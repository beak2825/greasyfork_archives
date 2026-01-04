// ==UserScript==
// @namespace    milesrhoden
// @name         DownloadForumPostHider
// @author       milesrhoden
// @version      1.8
// @license      MIT
// @description  Hide posts without download links
// @author       You
// @include      /^https?://(www)?\.?planetsuzy\.org/showthread.php/
// @include      /^https?://(www)?\.?planetsuzy\.org/.*/
// @include      /^https?://(www)?(hentai)?\.?pornbb\.org/newsearch\.php/
// @include      /^https?://(www)?(hentai)?\.?pornbb\.org/.*?-t(\d+-)?\d+\.html/
// @include      /^https?://(www)?\.?intporn\.com/.*/
// @include      /^https?://(www)?\.?intporn\.org/.*/
// @include      /^https?://(www)?\.?forum\.adultdeposit\.com/.*/
// @include      /^https?://(www)?\.?nitroporno\.com/
// @include      /^https?://(www)?\.?nitroporno\.com/.*/
// @include      /^https?://(www)?\.?rapidgatorkink\.com/
// @include      /^https?://(www)?\.?rapidgatorkink\.com/.*/
// @include      /^https?://(www)?\.?k2sporn\.com/
// @include      /^https?://(www)?\.?k2sporn\.com/.*/
// @include      /^https?://(www)?\.?warezcams\.com/
// @include      /^https?://(www)?\.?warezcams\.com/.*/
// @include      /^https?://(www)?\.?nitroflare-porn\.com/
// @include      /^https?://(www)?\.?nitroflare-porn\.com/.*/
// @include      /^https?://(www)?\.?fetish-bdsm\.com/
// @include      /^https?://(www)?\.?fetish-bdsm\.com/.*/
// @include      /^https?://(www)?\.?hidefporn\.ws/
// @include      /^https?://(www)?\.?hidefporn\.ws/.*/
// @include      /^https?://(www)?\.?javporn\.ws/
// @include      /^https?://(www)?\.?javporn\.ws/.*/
// @include      /^https?://(www)?\.?softmodels\.net/
// @include      /^https?://(www)?\.?softmodels\.net/.*/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407020/DownloadForumPostHider.user.js
// @updateURL https://update.greasyfork.org/scripts/407020/DownloadForumPostHider.meta.js
// ==/UserScript==


// Link to script on sleazyfork
// https://sleazyfork.org/en/scripts/407020/versions/new

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
    body {
      margin-top: 0;
    }
    .modal-post-count {
      margin: 0;
      display: inline-block;
      min-width: 20px;
      text-align: right;
    }
  `;
    document.head.appendChild(newStyle);
  };

  const selectors = getSelectors();

  function getSelectors () {
    let res = {};
    const curHost = window.location.host;
    if (curHost === "www.planetsuzy.org" || curHost === "www.intporn.com" || curHost === "www.forum.adultdeposit.com" ) {
      res
        = { singlePost:     '#posts > div[align="center"]'
          // , postContentSelector: curHost === "www.planetsuzy.org" ? 'div[align="center"]' : undefined
          , postContentSelector: curHost === "www.planetsuzy.org"
              ? 'table tr:nth-of-type(2) td:nth-of-type(2)'
              : undefined
          , parentNodeCount: 0
          };
    } // end if planetsuzy
    else if (curHost === "www.pornbb.org" || curHost === "hentai.pornbb.org") {
      res
        = { singlePost:     '.forumline .postbody'
          , postContentSelector: undefined
          , parentNodeCount: 2
          };
    } // end if pornbb
    else if (curHost === "www.intporn.org") {
      res
        = { singlePost:     'article.message--post'
          , postContentSelector: undefined
          , parentNodeCount: 0
          };
    } // end if intporn
    else if (curHost === "nitroporno.com"
    || curHost === "rapidgatorkink.com"
    || curHost === "k2sporn.com"
    || curHost === "warezcams.com"
    || curHost === "nitroflare-porn.com"
    || curHost === "fetish-bdsm.com"
    || curHost === "hidefporn.ws"
    || curHost === "javporn.ws"
    || curHost === "softmodels.net") {
      res
        = { singlePost:     '.block.story.shortstory'
          , postContentSelector: undefined
          , parentNodeCount: 0
          };
    } // end if nitroporno
    return res
  } // end of getSelectors

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
    /*  options example:
         { id: "modal-checkbox-example-id"
         , label: "Example Checkbox"
         , checked: true }
    */
    options = options || {};
    const modalBlock = getMainModalElement();
    if (!modalBlock) return []

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
      this.blur();
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

  function createSpan (options) {
    /*  options example:
         { id: "modal-checkbox-example-id"
         , label: "Example Checkbox"
         , checked: true }
    */
    options = options || {};
    const modalBlock = getMainModalElement();
    if (!modalBlock) return

    let newSpan;
    if (options && options.id) newSpan = modalBlock.querySelector(`#${options.id}`);
    if (newSpan) {
      console.log("not creating duplicate span", options.id);
      return // don't create duplicates
    }
    newSpan = document.createElement('span');

    for (const key in options) {
      newSpan.setAttribute(key, options[key]);
    } // end for loop
    return newSpan
  }

  function createNewCheckboxListItemWithCount (el, countOptions, checkboxOptions) {
    const newListItem = document.createElement('li');
    const newCheckboxElements = createCheckboxWithLabel(checkboxOptions);
    if (newCheckboxElements.length > 0) {
      const countElement = createSpan(countOptions);
      if (countElement) newCheckboxElements.unshift(countElement);
      newCheckboxElements.forEach(el => newListItem.append(el));
      el.append(newListItem);
    }
  }

  const masterSiteList
    = { depositFiles: [ "depositfiles.com"
                      , "depositfiles.org"
                      , "dfiles.eu"
                      , "dfiles.ru" ]
      , fileAl: [ "file.al" ]
      , fileBoom: [ "fboom.me"
                  // , "fboom.net"
                  , "fileboom.me" ]
      , fileFox: [ "filefox.cc" ]
      , fileJoker: [ "filejoker.net" ]
      , fileFactory: [ "filefactory.com" ]
      , filesMonster: [ "filesmonster.com" ]
      , filesSpace: [ "filespace.com" ]
      , filesUpload: [ "filesupload.org" ]
      , googleDrive: [ "drive.google.com" ]
      , keep2share: [ "keep2s.cc"
                    , "k2s.cc" ]
      , mediafire: [ "mediafire.com"]
      , mega: [ "mega.co.nz"
              , "mega.nz" ]
      , NitroFlare: [ "nitroflare.com" ]
      , nopy: [ "nopy.to" ]
      , racaty: [ "racaty.net" ]
      , rapidgator: [ "rapidgator.net"
                    , "rg.to" ]
      , uploaded: [ "uploaded.net"
                  , "ul.to" ]
      , uploadHaven: [ "uploadhaven.com" ]
      , upStore:  [ "upstore.net"
                  , "upsto.re" ]
      , zippyShare: [ "zippyshare.com" ]
      };
  // end masterSiteList

  // import * as foo from './src/foo.js'

  // console.log('Doing all the stuff!')

  const noDisplayString = "display:none;";

  const hideButtonAttributes
    = { specialId: "hide-posts-special-button"
      , hideLabel: "Show Posts"
      , showLabel: "Hide Posts"
      };

  addCustomStyleTag();
  createModalBlock();
  createCheckboxes(masterSiteList);
  const bod = document.querySelector('body');
  putMutationObserverOnMainElement(bod, hidePosts);
  hidePosts();
  bod.addEventListener("keydown", elementScrollJump);

  // ===========================================================================
  // Begin support functions
  // Nothing invoked beneath this point
  // ===========================================================================
  //

  function getHideStatus() {
    const rawJSON = localStorage.getItem('isHidingPosts') || 'false';
    return JSON.parse(rawJSON)
  }

  function getAvailableFileSharingSites() {
    const rawJSON = localStorage.getItem('availableFileSharingSites') || '[]';
    return JSON.parse(rawJSON)
  }

  function getUnavailableFileSharingSites() {
    const rawJSON = localStorage.getItem('unavailableFileSharingSites') || '[]';
    return JSON.parse(rawJSON)
  }

  function getAllFileSharingSites() {
    return Object.keys(masterSiteList)
    // const rawJSON = localStorage.getItem('allFileSharingSites') || '[]'
    // return JSON.parse(rawJSON)
  }

  function hidePosts () {
    const hideBadPosts = getHideStatus();
    console.log(`${hideBadPosts ? 'Hiding' : 'Revealing'} those posts...`);
    const postElements = document.querySelectorAll(selectors.singlePost);

    if (!postElements) return

    createHideButton();

    const counts = {};
    getAllFileSharingSites().forEach(e => counts[e] = 0);

    postElements.forEach(el => {
      let targetEl = el;
      for (let i = 0; i < selectors.parentNodeCount; i++) {
        targetEl = targetEl.parentNode;
      } // end for loop
      const isHidden = !elementHasValidDownloadLink(targetEl, counts);
      if (isHidden && hideBadPosts) {
        targetEl.setAttribute('hidden', "true");
      } else {
        targetEl.removeAttribute('hidden');
      }
    }); // end postElements forEach

    updatePostCounts(counts);
  } // end hidePosts function

  function createHideButton () {
    const buttonContainerElement = getMainModalElement();
    if (!buttonContainerElement) {
      console.log('well shit');
      return
    }

    let hideButtonElement = buttonContainerElement.querySelector(`#${hideButtonAttributes.specialId}`);
    const buttonAlreadyExisted = !!hideButtonElement;

    if (!hideButtonElement) {
      console.log("creating hide button...");
      hideButtonElement     = document.createElement('button');
      hideButtonElement.id  = hideButtonAttributes.specialId;
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

  function createHideFunction() {
    return () => {
      localStorage.setItem('isHidingPosts', JSON.stringify(!getHideStatus()));
      hidePosts();
    } // end callback function
  } // end createHideFunction

  function putMutationObserverOnMainElement (el, callback) {
    let mainElementTarget = el;
    if (!mainElementTarget) return

    // configuration of the observer:
    const mainElementConfig = { childList: true };

    // create an observer instance
    const mainElementObserver
      = new MutationObserver(callback); // end MutationObserver

    // pass in the target node, as well as the observer options
    mainElementObserver.observe(mainElementTarget, mainElementConfig);
  } // end putMutationObserverOnMainElement

  function updatePostCounts (counts) {
    const countList = document.querySelectorAll('.modal-input-list .modal-post-count');
    const activeSiteList = getAvailableFileSharingSites();
    for (let i = 0; i < countList.length; i++) {
      const countEl = countList[i];
      const siteName = countEl.id.replace(/^post-count-/, '');
      const countNum = counts[siteName];
      countEl.innerText = countNum || '';
      const newTitle
        = countNum
          ? `"${siteName}" links appear on ${countNum} ${(activeSiteList.indexOf(siteName) !== -1) ? 'visible' : 'hidden' } posts`
          : `No "${siteName}" links appear in any posts`;
      if (countEl.parentNode.title !== newTitle) countEl.parentNode.title = newTitle;
    }
  } // end updatePostCounts

  function getInvalidSiteList () { return getSiteLists()[0] }
  function getValidSiteList   () { return getSiteLists()[1] }

  function getSiteLists () {
    const inputList = document.querySelectorAll('.modal-input-list .input-modal-checkbox');
    let validRes = [];
    let invalidRes = [];
    const availableFileSharingSites = [];
    const unavailableFileSharingSites = [];
    for (let i = 0; i < inputList.length; i++) {
      const curInput = inputList[i];
      if (curInput.checked) {
        validRes = [...validRes, ...curInput.dataset.urls.split(',')];
        availableFileSharingSites.push(curInput.id.replace(/^modal-checkbox-/, ''));
      } else {
        invalidRes = [...invalidRes, ...curInput.dataset.urls.split(',')];
        unavailableFileSharingSites.push(curInput.id.replace(/^modal-checkbox-/, ''));
      }
    } // end for loop
    localStorage.setItem('allFileSharingSites'
                        , JSON.stringify([...availableFileSharingSites
                                        , ...unavailableFileSharingSites])
                        );
    localStorage.setItem('availableFileSharingSites'
                        , JSON.stringify(availableFileSharingSites));

    localStorage.setItem('unavailableFileSharingSites'
                        , JSON.stringify(unavailableFileSharingSites));

    return [invalidRes, validRes]
  } // end getSiteLists

  function createCheckboxes (siteList) {
    const siteListContainerDiv = createCollapsibleSectionContainer("Required Sites", "sites");

    const inputListContainer = document.createElement('ul');
    inputListContainer.setAttribute('class','modal-input-list open');
    inputListContainer.onclick="event.stopPropagation()";
    inputListContainer.onmousedown="event.stopPropagation()";

    const activeSiteList = getAvailableFileSharingSites();

    for (const key in siteList) {
      const countOptions
        = { id: `post-count-${key}`
          , class: "modal-post-count" };
      const checkboxOptions
        = { id: `modal-checkbox-${key}`
          , label: key
          , checked: !!(activeSiteList.indexOf(key) !== -1)
          , "data-urls": siteList[key].join(',') };
      createNewCheckboxListItemWithCount(inputListContainer, countOptions, checkboxOptions);
    } // end for loop
    putMutationObserverOnInputList(inputListContainer, hidePosts);
    siteListContainerDiv.append(inputListContainer);
  } // end createCheckboxes

  function putMutationObserverOnInputList (el, callback) {
    let inputEl = el;
    if (!inputEl) return

    // configuration of the observer:
    const inputElConfig
      = { attributeFilter: [ 'value' ]
        // , attributes: true // this is implied by the attributeFilter
        , subtree: true
        };

    // create an observer instance
    const mainElementObserver
      = new MutationObserver((mutations) => {
          const isValueChange = mutations.some(mutation => mutation.attributeName === 'value');
          isValueChange && callback();
        }); // end MutationObserver

    // pass in the target node, as well as the observer options
    mainElementObserver.observe(inputEl, inputElConfig);
  } // end putMutationObserverOnInputList


  function elementHasValidDownloadLink (el, counts) {
    const siteList = getValidSiteList();
    const badSiteList = getInvalidSiteList();

    const contentEl //= el
      = selectors.postContentSelector
        ? el.querySelector(selectors.postContentSelector)
        : el;
    if (!contentEl) return false

    function makeUrlRegExp (site) { return new RegExp(`(https?:\\/\\/)?(www(\\d*)?\\.)?${site.replace(/\./g,'\\.')}`, 'i') } // .replace(/\//g,'\\/')

    const postIsValid = siteList.some(site => {
      const regex = makeUrlRegExp(site);
      return regex.test(contentEl.innerHTML)
    });

    const curSiteListForCount
      = postIsValid
        ? siteList
        : badSiteList;

    curSiteListForCount.forEach(site => {
      const regex = makeUrlRegExp(site);
      if (regex.test(contentEl.innerHTML)) {
        for (const key in masterSiteList) {
          if (masterSiteList[key].indexOf(site) !== -1) counts[key]++;
        } // end for loop
      } // end if
    }); // end forEach

    return postIsValid
  }
  // end function elementHasValidDownloadLink

}());
