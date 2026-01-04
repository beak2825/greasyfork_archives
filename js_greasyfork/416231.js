// ==UserScript==
// @namespace    milesrhoden
// @name         NaughtyBlogKeyboardNav
// @author       milesrhoden
// @version      0.8
// @license      MIT
// @description  Re-style naughtyblog and enable keyboard navigation
// @author       You
// @include      /^https?://(www)?\.?naughtyblog\.my//
// @include      /^https?://(www)?\.?naughtyblog\.org//
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416231/NaughtyBlogKeyboardNav.user.js
// @updateURL https://update.greasyfork.org/scripts/416231/NaughtyBlogKeyboardNav.meta.js
// ==/UserScript==


// https://sleazyfork.org/en/scripts/416231-naughtyblogkeyboardnav

(function () {
  'use strict';

  const mainBack = "black";
  const mainFront = "#DDD";
  const specialBack = "#888";
  const specialFront = "#000";

  const addCustomStyleTag = () => {
    const newStyle = document.createElement("style");
    newStyle.setAttribute('type', 'text/css');
    // classToColor background, color, padding, margin
    newStyle.innerHTML = `
    .post-overview {
      display: block;
      /*
      width: 80%;
      max-width: 80%;
      */
      width: 95%;
      max-width: 95%;
    }

    .post-header-overview {
      width: 100%;
      max-width: 100%;
    }

    .post .post-content {
      width: 100%;
      max-width: 100%;
    }

    .post .post-content img {
      min-width: 100%;
      max-width: 100%;
      max-height: 90vh;
    }

    #input-for-hidden-terms {
      max-width: 100px;
    }

    #restore-term-button-list button {
      display:block;
    }
  `;
    document.head.appendChild(newStyle);
  };

  const selectors
    = { singlePost:     '.post-overview'
      , postContentSelector: '.post-title'
      , parentNodeCount: 0
      , linkSelector: '.post-content img'
      };

  function elementIsHidden(el) {
    return (el.offsetParent === null)
  }

  function getCurrentElement (elementList) {
    if (!elementList) return
    const positionArray = [];
    elementList.forEach(e => positionArray.push(e.getBoundingClientRect().top));

    let targetIndex = positionArray.findIndex(e => e > -10);
    if (targetIndex === -1) return
    return elementList[targetIndex]
  } // end of scrollToPreviousElement

  function screenIsScrolledToTop () {
    const body = document.querySelector('body');

    return body
      ? (body.getBoundingClientRect().top > -10) // within 10 pixels of the top
      : undefined
  }

  function screenIsScrolledToBottom () {
    const html = document.querySelector('html');
    const body = document.querySelector('body');

    // html.clientHeight is the height of the visible window
    // body.clientHeight is the height of all elements combined

    return (html && body)
      ? ((body.clientHeight + body.getBoundingClientRect().top) < (html.clientHeight + 5))
      : undefined
  }

  function elementScrollJump (ev) {
    if (document.activeElement.tagName === "INPUT") return
    if (document.activeElement.tagName === "TEXTAREA") return

    const upList
      = [ 38 // up arrow
        , 87 // w key
        ];
    const downList
      = [ 40 // down arrow
        , 83 // s key
        ];
    const clickList
      = [ 39 // right arrow
        , 68 // d key
        ];

    const activeKeyCode = ev.keyCode;

    if  (!activeKeyCode
        || [...upList, ...downList, ...clickList].indexOf(activeKeyCode) === -1
        ) { return }

    const postList = [];
    const postElements = document.querySelectorAll(selectors.singlePost);
    postElements.forEach(e => {if (!elementIsHidden(e)) {postList.push(e);}});

    if (clickList.indexOf(activeKeyCode) !== -1 && selectors.linkSelector) {
      const targetEl = getCurrentElement(postList);
      let linkElement = targetEl.querySelector(selectors.linkSelector).parentNode;
      if (!linkElement) return
      linkElement.setAttribute('target', '_blank');
      linkElement.click();
      return
    }

    ev.preventDefault();

    if (upList.indexOf(activeKeyCode) !== -1) {
      // console.log("Scrolling to previous element...")
      scrollToPreviousElement(postList);
    } else if (downList.indexOf(activeKeyCode) !== -1) {
      // console.log("Scrolling to next element...")
      scrollToNextElement(postList);
    }

  } // end of elementScrollJump

  function scrollToPreviousElement (elementList) {
    if (!elementList) return
    const positionArray = [];
    let targetIndex = elementList.length - 1;

    // if you're at the very top (within 10 pixels), go the very bottom
    if (screenIsScrolledToTop()) {
      window.scrollTo(0,document.body.scrollHeight);
    } else if (screenIsScrolledToBottom()) {
      // if you're at the very bottom (within 5 pixels), go to last element (or the very top)
      elementList[elementList.length - 1]
        ? elementList[elementList.length - 1].scrollIntoView()
        : window.scrollTo(0,0);
    } else {
      elementList.forEach(e => positionArray.push(e.getBoundingClientRect().top));
      targetIndex = positionArray.findIndex(e => e > -10);

      if (targetIndex === 0) {
        window.scrollTo(0,0);
      } else if (targetIndex >= 1) {
        elementList[targetIndex - 1].scrollIntoView();
      }
    } // end else

    return elementList[targetIndex]
  } // end of scrollToPreviousElement

  function scrollToNextElement (elementList) {
    if (!elementList) return

    const positionArray = [];
    let targetIndex = 0;

    // if you're at the very bottom (within 5 pixels), go the very top
    if (screenIsScrolledToBottom()) {
      window.scrollTo(0,0);
    } else if (screenIsScrolledToTop()) {
      // if you're at the very top (within 10 pixels), go the first element (or the very bottom)
      elementList[0]
        ? elementList[0].scrollIntoView()
        : window.scrollTo(0,document.body.scrollHeight);
    } else {
      elementList.forEach(e => positionArray.push(e.getBoundingClientRect().top));
      targetIndex = positionArray.findIndex(e => e > 10);
      if (targetIndex === -1) {
        window.scrollTo(0,document.body.scrollHeight);
      } else {
        elementList[targetIndex].scrollIntoView();
      }

    } // end else

    return elementList[targetIndex]
  } // end of scrollToNextElement

  // import { addCustomModalStyleTag } from "./_styles.js"

  const modalBlockId = "draggable-modal-block";

  const collapsingArrowSvg
    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="17px" height="17px">
      <g fill="none" fill-rule="evenodd">
        <path d="M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z" fill="#FFFFFF">
        </path>
      </g>
    </svg>`;

  function getMainModalElement () {
    return document.querySelector(`#${modalBlockId}`)
  }

  const maxListHeight
    = Math.max( Math.floor(window.innerHeight / 2)
              , 200
              );

  function createModalBlock () {

    addCustomModalStyleTag();
    const modalBlock = document.createElement('div');
    modalBlock.setAttribute('id', modalBlockId);
    // modalBlock.setAttribute('title', "Click and hold to drag...")

    document.querySelector('body').prepend(modalBlock);

    modalBlock.onmousedown = moveModalContainer;
    modalBlock.ondragstart = () => false;

    // This function came from https://javascript.info/mouse-drag-and-drop
    function moveModalContainer (event) {

      if (event.target.tagName === "INPUT") return
      if (event.target.tagName === "BUTTON") return
      if (event.target.tagName === "SPAN") return
      if (event.target.tagName === "SECTION") return
      if (event.target.tagName === "LABEL") return
      if (event.target.tagName === "SVG") return
      if (event.target.tagName === "G") return
      if (event.target.tagName === "PATH") return
      // if (event.target.tagName === "LI") return

      // const modalBlock = document.querySelector(`#${modalBlockId}`)
      // if (!modalBlock) return

      const top = document.querySelector('html').scrollTop;

      let shiftX = event.clientX - modalBlock.getBoundingClientRect().left;
      let shiftY = event.clientY - modalBlock.getBoundingClientRect().top;
      modalBlock.style.position = 'fixed';
      modalBlock.style.zIndex = 1000;
      document.body.append(modalBlock);

      moveAt(event.pageX, event.pageY);

      // moves the modalBlock at (pageX, pageY) coordinates
      // taking initial shifts into account
      function moveAt(pageX, pageY) {
        modalBlock.style.left = pageX - shiftX + 'px';
        modalBlock.style.top = (pageY - top) - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      // move the modalBlock on mousemove
      document.addEventListener('mousemove', onMouseMove);

      // drop the modalBlock, remove unneeded handlers
      modalBlock.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        modalBlock.onmouseup = null;
      };

    }; // end moveModalContainer

    // return modalBlock
  }

  function createCollapsibleSectionContainer (sectionTitle, idPrefix) {
    const el = getMainModalElement();
    if (!el) return

    const firstAttempt = el.querySelector(`#${idPrefix}-filter-container`);
    if (firstAttempt) return firstAttempt

    function toggleSectionVisibility (ev) {
      const clickableDiv = ev.target.closest(`#${idPrefix}-filter-container > .section-header`);
      if (!clickableDiv) return;
      ev.preventDefault();
      const containerDiv = document.querySelector(`#${idPrefix}-filter-container`);
      const isOpen = /open/.test(containerDiv.className);

      if (isOpen) {
        containerDiv.classList.remove('open');
        localStorage.setItem(`${idPrefix}IsHidden`, 'true');
      } else {
        containerDiv.classList.add('open');
        localStorage.setItem(`${idPrefix}IsHidden`, 'false');
      }
    } // end toggleSectionVisibility

    // Putting this click listener on the document is (ironically) better for performance
    // https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/
    document.addEventListener('click', toggleSectionVisibility);

    const sectionContainerDiv = document.createElement('section');
    sectionContainerDiv.setAttribute('id',`${idPrefix}-filter-container`);
    if (!JSON.parse(localStorage.getItem(`${idPrefix}IsHidden`) || 'false')) {
      sectionContainerDiv.setAttribute('class','open');
    }

    const sectionHeaderDiv = document.createElement('section');
    sectionHeaderDiv.setAttribute('class','section-header');

    const toggleArrowDiv = document.createElement('section');
    toggleArrowDiv.setAttribute('class','toggle-arrow');
    toggleArrowDiv.innerHTML = collapsingArrowSvg;
    sectionHeaderDiv.append(toggleArrowDiv);

    const sectionHeaderText = document.createElement('span');
    sectionHeaderText.setAttribute('class','modal-section-header');
    sectionHeaderText.innerText = sectionTitle;
    sectionHeaderDiv.append(sectionHeaderText);

    sectionContainerDiv.append(sectionHeaderDiv);
    el.append(sectionContainerDiv);

    return sectionContainerDiv
  } // end createCollapsibleSectionContainer

  function addCustomModalStyleTag () {
    const newStyle = document.createElement("style");
    newStyle.setAttribute('type', 'text/css');
    // classToColor background, color, padding, margin
    newStyle.innerHTML = `
    svg { pointer-events: none; }
    .modal-button {
      text-align: center;
      margin:auto;
      display: block;
      min-width: 7em;
      border: 1px solid #777;
      padding: 3px 5px;
      border-radius: 5px;
    }
    .modal-section-header {
      display: inline-block;
      cursor: pointer;
      font-size: 1.2em;
      user-select: none;
    }
    .hide-button {
      margin-bottom:5px;
      /* background: #DDD; */
      /* color:#222; */
      border: 1px solid #777;
      border-radius: 2px;
      padding: 3px;
    }
    .live-button {
      margin-bottom:5px;
      font-weight: 800;
      font-size: 107%;
      border: 1px solid #777;
      border-radius: 3px;
      padding: 3px;
      color: #EEE;
      background: #2762a6;
    }
    .modal-input-list-button {
      background: #000;
      color: #DDD;
    }
    #draggable-modal-block {
      position: fixed;
      top: 40px;
      left: 10px;
      padding: 15px 5px;
      min-height: 20px;
      min-width: 20px;
      background: #333333BB;
      color: #DDD;
      z-index: 1000;
      border: solid transparent 1px;
      border-radius: 8px;
      transition: 500ms;
      opacity: .2;
    }
    #draggable-modal-block:hover {
      background: #333333BB;
      transition: 0ms;
      opacity: 1;
    }
    .deactivated-filters#draggable-modal-block button,
    .deactivated-filters#draggable-modal-block section {
      display: none;
    }
    .deactivated-filters#draggable-modal-block button:nth-child(1) {
      display: block;
    }
    .input-modal-checkbox {
      display:inline-block;
      margin-left: 25px;
    }

    .modal-input-list label {
      display: inline-block;
      margin: 0 0 0 8px;
      font-size: 1em;
      transition: 250ms;
      user-select: none;
    }
    .modal-input-list label:hover,
    .modal-input-list li:hover label {
      color: #FFF;
      transition: 50ms;
    }
    .modal-input-list li { margin: 0; }

    section.section-header {
      display: flex;
    }

    .toggle-arrow {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 25px;
      width:  25px;
      border-radius: 2px;
      margin: 0;
      transition: 300 ms;
      cursor: pointer;
      /* transform: rotate(-90deg); */
      opacity: .8;
    }
    .toggle-arrow:hover {
      opacity: 1;
      background: black;
    }

    .toggle-arrow svg       { transform: rotate(-90deg); transition: 300ms; }
    .open .toggle-arrow svg { transform: rotate(0deg); }

    .modal-input-list {
      opacity: 0;
      display: none;
      visibility: hidden;
      transition: visibility 0s lineaer 0.1s, opacity 0.3s ease;
      padding: 0;
      margin: 0;
      max-height: ${maxListHeight}px;
      overflow-y: auto;
    }
    .open .modal-input-list {
      display: block;
      visibility: visible;
      opacity: 1;
      transition-delay: 0s;
    }
    .modal-input-list li {
      display: block;
    }
  `;
    document.head.appendChild(newStyle);
  }

  function createCheckboxWithLabel (options) {
    // options example:
    //      { id: "modal-checkbox-example-id"
    //      , label: "Example Checkbox"
    //      , checked: true }
    options = options || {};
    const modalBlock = getMainModalElement();
    if (!modalBlock) return

    let newCheckbox;
    if (options && options.id) newCheckbox = modalBlock.querySelector(`#${options.id}`);
    if (newCheckbox) {
      console.log("not creating duplicate input", options.id);
      return [] // don't create duplicates
    }
    newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type',`checkbox`);
    newCheckbox.setAttribute('class',`input-modal-checkbox`);
    newCheckbox.oninput = function(e) {
      this.setAttribute('value', newCheckbox.checked);
    };

    for (const key in options) {
      if (key === 'label') continue
      if (key === 'checked') {
        newCheckbox.checked = !!options[key];
      } else {
        newCheckbox.setAttribute(key, options[key]);
      }
    } // end for loop

    const newLabel = document.createElement('label');
    newLabel.innerText = options.label;
    // newLabel.onclick = function () { newCheckbox.checked = !newCheckbox.checked  }
    newLabel.onclick = function () { newCheckbox.click();  };
    return [newCheckbox, newLabel]
  }

  function createNewCheckboxListItem (el, options) {
    const newListItem = document.createElement('li');
    const newCheckboxElements = createCheckboxWithLabel(options);
    if (newCheckboxElements.length > 0) {
      newCheckboxElements.forEach(el => newListItem.append(el));
      el.append(newListItem);
    }
  }

  // import * as foo from './src/foo.js'

  const noDisplayString = "display:none;";

  const hideButtonAttributes
    = {
    specialId: "hide-posts-special-button"
    , hideLabel: "Show Posts"
    , showLabel: "Hide Posts"
  };

  setTimeout(function () {
    const isListPageRegex = new RegExp(`^https?://(www)?\\.?naughtyblog\\.(org|my)/(category/\\w+/)?(page/\\d/)?`);
    if (isListPageRegex.test(window.location.href)) {

      addCustomStyleTag();
      createModalBlock();
      // createCheckboxes(masterSiteList)
      const bod = document.querySelector('body');
      putMutationObserverOnMainElement(bod, hidePosts);
      hidePosts();
      bod.addEventListener("keydown", elementScrollJump);
      bod.addEventListener("keydown", copyRapidgatorLinkListener);

    } // end if list page
    else {
      // document.querySelector('body').addEventListener("keydown", returnPrevPageListener)
      document.querySelector('body').addEventListener("keydown", copyRapidgatorLinkListener);
    } // end else

  } // end function
    , 400
  ); // end setTimeout



  // ===========================================================================
  // Begin support functions
  // Nothing invoked beneath this point
  // ===========================================================================

  function putMutationObserverOnMainElement (el, callback) {
    // select the target node (USER count tab)
    let mainElementTarget = el;
    if (!mainElementTarget) return

    // configuration of the observer:
    const mainElementConfig = { childList: true };

    // create an observer instance
    const mainElementObserver
      = new MutationObserver(callback);

    // pass in the target node, as well as the observer options
    mainElementObserver.observe(mainElementTarget, mainElementConfig);
  } // end putMutationObserverOnMainElement

  function getHideStatus () {
    const rawJSON = localStorage.getItem('isHidingPosts') || 'false';
    return JSON.parse(rawJSON)
  }

  function getHiddenTerms () {
    const rawJSON = localStorage.getItem('hiddenTerms') || '[]';
    return JSON.parse(rawJSON)
  }

  function createHideFunction () {
    return () => {
      localStorage.setItem('isHidingPosts', JSON.stringify(!getHideStatus()));
      hidePosts();
    } // end callback function
  } // end createHideFunction

  function createHideButton () {
    const buttonContainerElement = getMainModalElement();
    if (!buttonContainerElement) return

    let hideButtonElement = buttonContainerElement.querySelector(`#${hideButtonAttributes.specialId}`);
    let buttonAlreadyExisted = true;

    if (!hideButtonElement) {
      console.log("creating hide button...");
      buttonAlreadyExisted = false;
      hideButtonElement = document.createElement('button');
      hideButtonElement.id = hideButtonAttributes.specialId;
      hideButtonElement.addEventListener('click', createHideFunction());
    }

    hideButtonElement.innerText
      = getHideStatus()
        ? hideButtonAttributes.hideLabel
        : hideButtonAttributes.showLabel;
    hideButtonElement.className
      = getHideStatus()
        ? 'modal-button hide-button'
        : 'modal-button live-button';

    if (!buttonAlreadyExisted) buttonContainerElement.prepend(hideButtonElement);

  } // end createHideButton

  function hidePosts () {
    const hideBadPosts = getHideStatus();
    console.log(`${hideBadPosts ? 'Hiding' : 'Revealing'} those posts...`);
    const postElements = document.querySelectorAll(selectors.singlePost);

    if (!postElements) return

    createHideButton();

    postElements.forEach(el => {
      let targetEl = el;
      for (let i = 0; i < selectors.parentNodeCount; i++) {
        targetEl = targetEl.parentNode;
      } // end for loop
      const isHidden = hasHiddenTerms(el);
      if (isHidden && hideBadPosts) {
        targetEl.style = noDisplayString;
      } else {
        targetEl.style = "";
        // (targetEl.style || '').replace("display:none;", "")
      }
    }); // end postElements forEach

    createInputForHidingThings();
  } // end hidePosts function

  function hasHiddenTerms (el) {
    const hiddenTerms = getHiddenTerms();
    const titleEl = el.querySelector(selectors.postContentSelector);
    if (!titleEl) return false

    return hiddenTerms && hiddenTerms.some(x => titleEl.innerText.toLowerCase().includes(x.toLowerCase()))
  } // end of hasHiddenTerms

  function createInputForHidingThings () {
    const inputForHidingContainerDiv = createCollapsibleSectionContainer("Hidden Terms", "terms");

    let inputForHiding = document.querySelector('#input-for-hidden-terms');
    if (!inputForHiding) {
      inputForHiding = document.createElement('input');
      inputForHiding.setAttribute('id', 'input-for-hidden-terms');
      inputForHiding.setAttribute('class', 'modal-input');
      inputForHidingContainerDiv.append(inputForHiding);
      inputForHidingContainerDiv.addEventListener("keydown", addNewTermForHiding);
    }

    let listContainerDiv = document.querySelector(`#restore-term-button-list`);
    if (!listContainerDiv) {
      listContainerDiv = document.createElement('section');
      listContainerDiv.id = `restore-term-button-list`;
      listContainerDiv.className = 'modal-input-list';
      inputForHidingContainerDiv.append(listContainerDiv);
    }

    const hiddenTerms = getHiddenTerms();
    if (!hiddenTerms) return

    hiddenTerms.forEach(termName => {
      const specialButtonId = `restore-term-${termName.replace(/[^0-9a-zA-Z]/g, '')}`;
      // don't make the same button twice
      if (listContainerDiv.querySelector(`#${specialButtonId}`)) return

      const newRestoreButton = document.createElement('button');
      newRestoreButton.id = specialButtonId;
      // newRestoreButton.innerText  = `${counts[termName] || 0} - ${termName}`
      newRestoreButton.innerText = termName;
      newRestoreButton.className = 'hide-button';
      newRestoreButton.addEventListener('click', createRestoreFunction(termName, specialButtonId));

      listContainerDiv.append(newRestoreButton);
    }); // end hiddenTerms forEach
  } // end createInputForHidingThings function

  function addNewTermForHiding (ev) {
    if (ev.keyCode !== 13) return

    const hiddenStringInput = document.getElementById('input-for-hidden-terms');
    if (document.activeElement !== hiddenStringInput) return
    ev.preventDefault();

    // record value
    const newHiddenString = hiddenStringInput.value.toString();
    // clear the input
    hiddenStringInput.value = "";

    // add to list
    const hiddenTermsList = getHiddenTerms();
    if (hiddenTermsList && hiddenTermsList.indexOf(newHiddenString) === -1) {
      // console.log('Adding value to hiddenTerms...')
      hiddenTermsList.push(newHiddenString);
      localStorage.setItem('hiddenTerms', JSON.stringify(hiddenTermsList));
      hidePosts();
    }
  } // end addNewTermForHiding

  function createRestoreFunction (termName, specialButtonId) {
    return () => {
      const hiddenTerms = getHiddenTerms();
      const termIndex = hiddenTerms.indexOf(termName);
      if (termIndex !== -1) {
        hiddenTerms.splice(termIndex, 1);
        localStorage.setItem('hiddenTerms', JSON.stringify(hiddenTerms));
      } // end if termName
      const restoreTermButton = document.querySelector(`#${specialButtonId}`);
      if (restoreTermButton) restoreTermButton.remove();
      hidePosts();
    } // end callback function
  } // end createRestoreFunction

  function copyRapidgatorLinkListener (ev) {
    // Check if 'c' (keyCode 67) or 'e' (keyCode 69) key was pressed
    if (ev.keyCode !== 67 && ev.keyCode !== 69) return

    // Don't trigger if user is typing in an input field
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return

    const bestLink = findBestRapidgatorLink();
    if (bestLink) {
      copyToClipboard(bestLink);
      showCopyNotification(bestLink);
    }
  } // end copyRapidgatorLinkListener

  function findBestRapidgatorLink () {
    // Find all links that contain rapidgator or rg.to
    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    const rapidgatorLinks = allLinks.filter(link => {
      const href = link.href.toLowerCase();
      return href.includes('rapidgator') || href.includes('rg.to')
    });

    if (rapidgatorLinks.length === 0) return null

    // Prioritize by quality: 1080p > 720p > 2160p > others
    const qualityOrder = ['1080', '720', '2160'];

    for (const quality of qualityOrder) {
      const qualityLink = rapidgatorLinks.find(link =>
        link.href.toLowerCase().includes(quality)
      );
      if (qualityLink) return qualityLink.href
    }

    // If no quality found, return the first rapidgator link
    return rapidgatorLinks[0].href
  } // end findBestRapidgatorLink

  function copyToClipboard (text) {
    // Use userscript clipboard API if available (most reliable)
    if (typeof GM_setClipboard !== 'undefined') {
      GM_setClipboard(text);
      return
    }

    // Fall back to browser clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  } // end copyToClipboard

  function fallbackCopyToClipboard (text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  } // end fallbackCopyToClipboard

  function showCopyNotification (link) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.innerText = `Copied: ${link}`;
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 16px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    max-width: 300px;
    word-wrap: break-word;
  `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  } // end showCopyNotification

}());
