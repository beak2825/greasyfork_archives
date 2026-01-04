// ==UserScript==
// @name         OurKarma
// @namespace    lenins.work
// @version      666.420.69
// @description  Counts posts on page and displays karma ratio as well as three sorting toggles
// @match        https://www.torn.com/forums.php*
// @grant        none
// @author       lenin x chatgpt
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461960/OurKarma.user.js
// @updateURL https://update.greasyfork.org/scripts/461960/OurKarma.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var attempts = 0;

    function removeExistingToggle(id) {
  const existingToggle = document.getElementById(id);
  if (existingToggle) {
    existingToggle.remove();
  }
}


function findRawPosts() {
  var rawPosts = document.getElementsByClassName("post unreset");
  var count = rawPosts.length;
  var forumsHeader = document.getElementById("skip-to-content");
  var nearPostButton = document.querySelectorAll('.actions.no-select')[0]; // select the first element in the NodeList

  // Function to remove existing countText elements
  function removeExistingCountText() {
    var existingForumsHeaderCountText = document.getElementById("forumsHeaderCountText");
    var existingNearPostButtonCountText = document.getElementById("nearPostButtonCountText");

    if (existingForumsHeaderCountText) {
      existingForumsHeaderCountText.remove();
    }
    if (existingNearPostButtonCountText) {
      existingNearPostButtonCountText.remove();
    }
  }

  if (count === 0 && attempts < 3) {
    attempts++;
    setTimeout(findRawPosts, 300);
  } else if (count === 0 && attempts >= 2) {
    forumsHeader.innerHTML += " (ERROR)";
    if (nearPostButton) {
      nearPostButton.innerHTML = "(ERROR)" + nearPostButton.innerHTML; // prepend the error message to the existing HTML content
    }
  } else {
    var countText = " [" + count + "]&nbsp;";
    if (count === 20) {
      countText = "<span id='forumsHeaderCountText' style='color: green;font-weight:bold'>" + countText + "</span>";
    } else {
      countText = "<span id='forumsHeaderCountText' style='color: red;font-weight:bold'>" + countText + "</span>";
    }

    // Remove existing countText elements before adding new ones
    removeExistingCountText();

    forumsHeader.innerHTML += countText;

    if (nearPostButton) {
      var nearPostButtonCountText = countText.replace("forumsHeaderCountText", "nearPostButtonCountText");
      nearPostButton.innerHTML = nearPostButton.innerHTML + " " + nearPostButtonCountText; // prepend the count text to the existing HTML content
    }
  }
}

const TOGGLE_KEY = 'midpost_toggle';
const KARMA_SORT_KEY = 'karma_sort';
const QUOTE_TOGGLE_KEY = 'quote_toggle';


    // buggy style script that doesn't fuckin work for some reason

function addToggleStyles() {
var styles = `
.tgl-skewed {
  display: none;
}

.tgl-skewed + .tgl-btn {
  overflow: hidden;
  backface-visibility: hidden;
  transition: all .2s ease;
  font-family: sans-serif;
  font-size: 18px;
  background: #888;
  position: relative;
  cursor: pointer;
  width: 22px;
  height: 22px;
  border-radius: 5px;
}

.tgl-skewed + .tgl-btn:before,
.tgl-skewed + .tgl-btn:after {
  display: inline-block;
  transition: all .2s ease;
  width: 50%;
  text-align: center;
  position: absolute;
  line-height: 30px;
  font-weight: bold;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.tgl-skewed + .tgl-btn:before {
  content: attr(data-tg-off);
  left: 0;
  color: #aaa;
  opacity: 1;
  transition: opacity .25s ease-in-out;
  transform: translateX(-50%) skew(0deg);
}

.tgl-skewed + .tgl-btn:after {
  content: attr(data-tg-on);
  left: 10%;
  color: red;
  opacity: 0;
  transition: opacity .25s ease-in-out;
  transform: translateX(-50%) skew(0deg);
}

.tgl-skewed:checked + .tgl-btn:before {
  opacity: 0;
  transition: opacity .25s ease-in-out;
}

.tgl-skewed:checked + .tgl-btn:after {
  opacity: 1;
  transition: opacity .25s ease-in-out;
}

.tgl-skewed:checked + .tgl-btn {
  background: #86d993;
}
`;

  // Add the CSS styles to the page
  var style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);
}


function addToggle(id, offText, onText, eventListener, tooltipText, position = null) {
  const skipToContent = document.getElementById('top-page-links-list');
  var toggle = document.createElement("div");
  toggle.id = id;
  toggle.className = 'toggle-checkbox';

  if (position) {
    toggle.style.position = 'relative';
    toggle.style.left = position;
  }

  var toggleInput = document.createElement("input");
  toggleInput.classList.add("tgl", "tgl-skewed");
  toggleInput.type = 'checkbox';
  toggleInput.id = `${id}-input`;
  toggle.appendChild(toggleInput);

  // Create the label element
  var label = document.createElement("label");
  label.classList.add("tgl-btn");
  label.setAttribute("data-tg-off", offText);
  label.setAttribute("data-tg-on", onText);
  label.setAttribute("for", `${id}-input`);
  label.setAttribute("title", tooltipText); // Add the tooltipText as the title attribute
  toggle.appendChild(label);

  skipToContent.appendChild(toggle);
  toggleInput.addEventListener('click', eventListener);
}

function getToggleState(key) {
  return localStorage.getItem(key) === 'true';
}

function setToggleState(key, state) {
  localStorage.setItem(key, state);
}

function hideMidposts() {
  const midposts = document.querySelectorAll('.midpost');
  midposts.forEach(midpost => midpost.style.display = 'none');
}

function unhideMidposts() {
  const midposts = document.querySelectorAll('.midpost');
  midposts.forEach(midpost => midpost.style.display = '');
}

function toggleMidposts() {
  const isChecked = document.getElementById('toggleMidpost-input').checked;
  if (isChecked) {
    hideMidposts();
    setToggleState(TOGGLE_KEY, 'true');
  } else {
    unhideMidposts();
    setToggleState(TOGGLE_KEY, 'false');
  }
}

function toggleQuotes() {
    const isChecked = document.getElementById('toggleQuotes-input').checked;
    const quoteUnresetElements = document.querySelectorAll('.quote.unreset');

    if (isChecked) {
        quoteUnresetElements.forEach(el => {
            // Check if 'el' contains a 'post-quote' child
            const postQuoteChildren = el.querySelectorAll('.post-quote');

            postQuoteChildren.forEach(postQuoteChild => {
                // If this 'post-quote' child contains other 'post-quote' children, hide them
                const nestedPostQuotes = postQuoteChild.querySelectorAll('.post-quote');
                nestedPostQuotes.forEach(nested => {
                    nested.style.display = 'none';
                });
            });
        });
        setToggleState(QUOTE_TOGGLE_KEY, true);
    } else {
        quoteUnresetElements.forEach(el => {
            // Unhide all 'post-quote' elements (both parent and nested)
            const postQuoteChildren = el.querySelectorAll('.post-quote');
            postQuoteChildren.forEach(postQuoteChild => {
                postQuoteChild.style.display = '';
            });
        });
        setToggleState(QUOTE_TOGGLE_KEY, false);
    }
}



function classifyPosts() {
  const threadList = document.getElementsByClassName('thread-list')[0];
  const postElements = threadList.querySelectorAll('li[data-id]:not(.quote.forum-button, .edit.forum-button)');
  const excludedImageUrl = 'https://www.torn.com/images/v2/emotions/';
  postElements.forEach(postElement => {
    const images = Array.from(postElement.querySelectorAll('div.post.unreset img'));
    const hasExcludedImage = images.some(img => img.src.includes(excludedImageUrl));
    const hasNonExcludedImage = images.some(img => !img.src.includes(excludedImageUrl));
    const hasIframe = postElement.querySelector('div.post.unreset iframe');

    if ((hasNonExcludedImage || hasIframe) && !hasExcludedImage) {
      postElement.classList.add('memepost');
    } else {
      postElement.classList.add('midpost');
    }
  });
}

function addKarmaClass(li) {
  const rightPart = li.querySelector('.right-part');
  if (!rightPart) return;

  const likeValueElem = rightPart.querySelector('.like .value');
  const dislikeValueElem = rightPart.querySelector('.dislike .value');
  if (!likeValueElem || !dislikeValueElem) return;

  const likeValue = parseInt(likeValueElem.textContent, 10);
  const dislikeValue = parseInt(dislikeValueElem.textContent, 10);
  const realKarma = likeValue - dislikeValue;
  li.classList.add(`karma${realKarma}`);
}

function getKarmaNumber(className) {
  const match = className.match(/karma(-?\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function sortList() {
  const list = document.querySelector('.thread-list');
  const items = Array.from(list.children);
  items.sort((a, b) => {
    const aKarma = getKarmaNumber(a.className);
    const bKarma = getKarmaNumber(b.className);
    return bKarma - aKarma;
  });
  items.forEach(item => list.appendChild(item));
}

function unsortList() {
  const list = document.querySelector('.thread-list');
  const items = Array.from(list.children);
  items.sort((a, b) => {
    const aId = parseInt(a.dataset.id, 10);
    const bId = parseInt(b.dataset.id, 10);
    return aId - bId;
  });
  items.forEach(item => list.appendChild(item));
}

function toggleSort() {
  const isChecked = document.getElementById('toggleKarma-input').checked;
  if (isChecked) {
    sortList();
    setToggleState(KARMA_SORT_KEY, 'true');
  } else {
    unsortList();
    setToggleState(KARMA_SORT_KEY, 'false');
  }
}

function karmaHistory() {
  const karmaElems = document.querySelectorAll('.karma');

  const processKarmaElem = (karmaElem) => {
    const infoElem = karmaElem.closest('.info');
    const idText = infoElem.querySelector('.poster-id.bold').textContent.trim().slice(1, -1);

    // Remove commas for calculation
    const karmaText = karmaElem.textContent.trim().replace(/,/g, '');
    const karmaValue = parseInt(karmaText.match(/\d+/)[0], 10);

    const postsText = infoElem.querySelector('.posts').textContent.trim().replace(/,/g, '');
    const postsValue = parseInt(postsText.match(/\d+/)[0], 10);

    // Calculate ratio and format with commas
    const karmaRatio = karmaValue === 0 ? 'N/A' : (karmaValue / postsValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const karmaLink = document.createElement('a');
    karmaLink.href = `https://www.torn.com/forums.php#!p=search&q=by:${idText}&f=0&y=0`;
    karmaLink.style.textDecoration = 'none';
    karmaLink.style.color = 'inherit';
    karmaLink.textContent = karmaValue.toLocaleString(); // Format this value with commas for display

    const karmaLabel = document.createElement('span');
    karmaLabel.style.fontWeight = 'bold';
    karmaLabel.textContent = 'Karma: ';

    const emptyPropElem = infoElem.querySelector('.empty-prop');
    emptyPropElem.innerHTML = '<span class="bold">Ratio: </span>' + karmaRatio;

    karmaElem.innerHTML = '';
    karmaElem.appendChild(karmaLabel);
    karmaElem.appendChild(karmaLink);
  };

  karmaElems.forEach(processKarmaElem);
}

function init() {
  const threadListItems = document.querySelectorAll('.thread-list li');
  threadListItems.forEach(addKarmaClass);
  addToggleStyles();

  removeExistingToggle('toggleMidpost');
addToggle('toggleMidpost', String.fromCodePoint(0x1F4C4), String.fromCodePoint(0x1F5BC, 0xFE0F), toggleMidposts, "ALL POSTS / MEME POSTS");
  const midpostToggle = document.getElementById('toggleMidpost-input');
  midpostToggle.checked = getToggleState(TOGGLE_KEY);
  if (getToggleState(TOGGLE_KEY)) {
    hideMidposts();
  }

  removeExistingToggle('toggleKarma');
addToggle('toggleKarma', String.fromCodePoint(0x23F0), String.fromCodePoint(0x1F947), toggleSort, "CHRONOLOGICAL / KARMA TOTAL", '29px');
  const karmaToggle = document.getElementById('toggleKarma-input');
  karmaToggle.checked = getToggleState(KARMA_SORT_KEY);
  if (getToggleState(KARMA_SORT_KEY)) {
    sortList();
  }

removeExistingToggle('toggleQuotes');
addToggle('toggleQuotes', String.fromCodePoint(0x1F4AC), String.fromCodePoint(0x1F5E8, 0xFE0F), toggleQuotes, "ALL QUOTES / ONE QUOTE", '60px');
const quotesToggle = document.getElementById('toggleQuotes-input');
quotesToggle.checked = getToggleState(QUOTE_TOGGLE_KEY);
if (getToggleState(QUOTE_TOGGLE_KEY)) {
  toggleQuotes();
}

    findRawPosts();
  classifyPosts();
    karmaHistory();
}

        function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}



      function runScript() {
       if (window.location.hash.includes('threads')) {
      waitForElm('.thread-list').then((elm) => {
    console.log('"thread-list" found; executing OurKarma for thread page.');
        init();
  });
    } else {
    console.log('"thread-list" NOT found; waiting for hashchange and "thread-list" element.');
   window.addEventListener('hashchange', () => {
    waitForElm('.thread-list').then((elm) => {
    console.log('"thread-list" found after hashchange; executing OurKarma for thread page.');
init();
    })})}};

  window.addEventListener('hashchange', () => {
  removeExistingToggle('toggleKarma');
        removeExistingToggle('toggleMidpost');
      removeExistingToggle('toggleQuotes');
      runScript();
    }
  );

    runScript();
  }
)();