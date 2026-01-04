// ==UserScript==
// @name        F95 Mobile Upgrade
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.3
// @author      Edexal
// @description Improves mobile experience
// @homepageURL https://sleazyfork.org/en/scripts/546346-f95-mobile-upgrade
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// @downloadURL https://update.greasyfork.org/scripts/546346/F95%20Mobile%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/546346/F95%20Mobile%20Upgrade.meta.js
// ==/UserScript==
(async () => {
  /*NOTE: F95 uses FontAwesome v5.15.4*/
  Edexal.addCSS(`
@media (width < 480px) {
  /*Fixes 'Your account' navigation menu*/ 
  #js-SideNavOcm .uix_sidebar--scroller {
    margin-top: 149px;
    & .block-header {
        padding: 14px;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        background-color: #37383a;
        color:#babbbc;
        &::before {
          content: "\\f007";
        }
    }
    & .block-body:nth-of-type(2) {
      margin-bottom: 20px;
    }
  }
  /*Fixes scroll buttons appearing behind threads*/
  .uix_fabBar {
    z-index: 50;
    & .u-scrollButtons {
      position: inherit;
      gap:10px;
      bottom: 55px;
      &.is-active {
        opacity: 0.6;
      }
      & a:last-child {
        margin-left: 0;
      }
      & a.button.button--scroll {
        padding: 6px 12px;
      }
    }
  }
  .has-hiddenscroll .u-scrollButtons {
	  right: 35vw;
  }
  
  /*Fixes sidebar list of all online members & staff*/
  body .p-body-sidebar {
    margin-top: 64px;
    margin-bottom: 45px;
    &::after {
      margin:initial;
    }
  }
  /*Styles for reactions*/
  button.reaction.actionBar-action {
    position: relative;
    cursor: pointer;
  }
  .reactTooltip {
    position: absolute;
    bottom: 30px;
    right: -70px;
    width: 180px;
    z-index: 5;
    background-color: #242629;
    border: 1px solid #343638;
    border-radius: 8px;
    max-width: unset;
    gap: 2px;
  }
   .actionBar .reaction.reaction--imageHidden.reaction--1 i {
      padding-right: 0;
      margin-right: 0;
  } 
  .reaction.reaction--imageHidden img {
    display: unset;
  }
  .reaction.reaction--imageHidden > img {
    display: none;
  }
  .reaction-text {
    margin-left: 6px;
  }
  .has-reaction .reaction-text {
    margin-left: 0;
  }
}`);
  const SELECTOR = {
    likeBtns: 'a.reaction.actionBar-action',
    reactionBtns: 'button.reaction.actionBar-action',
    thread: '.p-body-main',
    latestUpdate: '#latest-page_main-wrap'
  };
  let REACTION_BAR;

  function isLatestUpdatePage() {
    return location.pathname.includes('sam/latest_alpha');
  }

  function setScrollBtn(selector, targetSelector, scrollType, altTargetSelector) {
    const scrollBtn = document.querySelector(selector);
    if (!scrollBtn) return;
    scrollBtn.removeAttribute('data-xf-click');
    Edexal.onEv(scrollBtn,'click', (e) => {
      e.preventDefault();
      const target = document.querySelector(targetSelector) ?? document.querySelector(altTargetSelector);
      target.scrollIntoView({
        block: scrollType
      });
    });
  }

  function initScrollBtns() {
    setScrollBtn('.uix_fabBar .u-scrollButtons a:last-child',
      'div.block-outer:nth-child(4) > div:nth-child(1) > nav:nth-child(1) > div:nth-child(2)',
      'end',
      '#footer');
    setScrollBtn('.uix_fabBar .u-scrollButtons a:first-child',
      '.block--messages',
      'start',
      '#top');
  }

  function assignTabItem(name, pathURL, oldFaIcons, newFaIcons, itemPos) {
    const tabItem = document.querySelector(`.uix_tabBar .uix_tabList .uix_tabItem:nth-of-type(${itemPos})`);
    if (!tabItem) return;
    tabItem.href = pathURL;
    const icon = tabItem.querySelector('i');
    icon.classList.remove(...oldFaIcons);
    icon.classList.add(...newFaIcons);
    const labelDiv = tabItem.querySelector('div');
    labelDiv.textContent = name;
  }

  function initTabItems() {
    assignTabItem('Latest Updates', '/sam/latest_alpha/', ['far', 'fa-comment-alt-exclamation'], ['far', 'fa-gem'], 2);
    assignTabItem('Bookmarks', '/account/bookmarks/', ['far', 'fa-user'], ['far', 'fa-bookmark'], 1);
  }

  /*Removes all effects from tiles on Latest Update Page
   by removing all event listeners from tiles*/
  function removeTileHoverEffects() {
    if (!isLatestUpdatePage()) return;
    const tilesWrapper = document.querySelector(SELECTOR.latestUpdate);
    const tilesWrapperClone = tilesWrapper.cloneNode();
    tilesWrapperClone.append(...tilesWrapper.childNodes);
    const fragment = document.createDocumentFragment();
    fragment.append(tilesWrapperClone);
    tilesWrapper.replaceWith(fragment);
  }

  function createReaction(idNum, altName) {
    const a = Edexal.newEl({
      element: 'a',
      href: `/posts/10864040/react?reaction_id=${idNum}`,
      class: ['reaction', `reaction--${idNum}`],
      'data-reaction-id': idNum
    });
    const img = Edexal.newEl({
      element: 'img',
      src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      class: ['reaction-sprite', 'js-reaction'],
      alt: altName,
      title: altName,
      'data-extra-class': "tooltip--basic tooltip--noninteractive",
      'data-delay-in': 50,
      'data-delay-out': 50
    });
    a.append(img);
    return a;
  }

  function createReactionBar() {
    const divBar = Edexal.newEl({element: 'div', class: ['reactTooltip']});
    let reactions = [
      createReaction(1, 'Like'),
      createReaction(14, 'Heart'),
      createReaction(13, "Jizzed my pants"),
      createReaction(12, "Yay, update!"),
      createReaction(3, "Haha"),
      createReaction(9, "Hey there"),
      createReaction(4, "Wow"),
      createReaction(7, "Thinking Face"),
      createReaction(5, "Sad"),
      createReaction(18, "Disagree"),
      createReaction(8, "Angry")
    ];
    divBar.append(...reactions);
    REACTION_BAR = divBar;
  }

  function initReactionBtns(likeBtns) {
    for (const likeBtn of likeBtns) {
      let reactBtn;
      if (!likeBtn.classList.contains('has-reaction')) {
        reactBtn = Edexal.newEl({
          element: 'button',
          'data-post-id': likeBtn.getAttribute('data-th-react-plus-content-id')
        });
        likeBtn.classList.remove('reaction--small');
      } else {
        reactBtn = Edexal.newEl({element: 'a', href: likeBtn.href});
      }
      reactBtn.classList.add(...likeBtn.classList);
      reactBtn.append(...likeBtn.childNodes);
      likeBtn.replaceWith(reactBtn);
    }
  }

  function updateReactionBtnURLs(postId) {
    REACTION_BAR.querySelectorAll('a').forEach(el => {
      el.href = el.href.replace(/\/[0-9]+\//, `/${postId}/`);
    });
  }

  function addReactionBarEvent(e) {
    updateReactionBtnURLs(e.currentTarget.dataset.postId);
    e.currentTarget.append(REACTION_BAR);
  }

  function removeReactionBarEvent(e) {
    if (!e.target.closest(SELECTOR.reactionBtns)) {
      REACTION_BAR.remove();
    }
  }

  function addReactionBtnEvents() {
    const reactionBtns = document.querySelectorAll(SELECTOR.reactionBtns);
    for (const reactBtn of reactionBtns) {
      Edexal.onEv(reactBtn,'click',addReactionBarEvent);
    }
  }

  function setRemoval() {
    document.querySelector(SELECTOR.thread).addEventListener('click', removeReactionBarEvent);
  }

  function initReaction() {
    const likeBtns = document.querySelectorAll(SELECTOR.likeBtns);
    if (!likeBtns || !likeBtns.length) return;
    createReactionBar();
    initReactionBtns(likeBtns);
    addReactionBtnEvents();
    setRemoval();
  }

  function run() {
    //Run only on mobile
    if (window.innerWidth >= 480) return;
    initTabItems();
    initScrollBtns();
    initReaction();
    setTimeout(removeTileHoverEffects, 2000);
  }

  run();
})()