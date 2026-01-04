// ==UserScript==
// @name        Empornium ThreadMan
// @description Thread visibility management
// @namespace   Empornium Scripts
// @version     1.4.1
// @author      vandenium
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @include     /^https:\/\/(www\.)?empornium\.(me|sx|is)\/$/
// @include     /^https:\/\/(www\.)?empornium\.(me|sx|is)\/(forum|torrents|articles|userhistory|index)+/
// @downloadURL https://update.greasyfork.org/scripts/429984/Empornium%20ThreadMan.user.js
// @updateURL https://update.greasyfork.org/scripts/429984/Empornium%20ThreadMan.meta.js
// ==/UserScript==
// Changelog:
// Version 1.4.1
//  - Preserve link's <strong> HTML tag
// Version 1.4.0
//  - Added a blacklist CSS animation
// Version 1.3.1
//  - Instead of changing link color, add green heart next to thread.
// Version 1.3.0
//  - Add Greenlist hotkey, "g".
//    - Sets color of links to green.
// Version 1.2.1
//  - Move settings code to end of code
//  - Move processThreads code higher.
// Version 1.2.0
//  - Adds Greenlist
//    - Threads in the Greenlist are always shown regardless of viewed status.
//    - Threads created by users (after updating to 1.2.0) are always added to the Greenlist.
//    - The Greenlist is not retroactive. Threads created by users prior to using version 
//      1.2.0 need to be manually added to the Greenlist.
//    - Fix eventing issue causing repeated event listener executions.
// Version 1.1.1
//  - Ignore keyup event when cursor in new post area.
// Version 1.1.0
//  - Added post forward/back navigation hotkeys in threads.
//    - Forward: d, Backward: e
// Version 1.0.10
//  - Fix textarea background color for all themes
// Version 1.0.9
//  - Fix h1,h3 style
// Version 1.0.8
//  - Fix Settings dimensions
// Version 1.0.7
//  - Update Settings colors to be consistent in all themes.
// Version 1.0.6
//  - Fix break in 1.0.5 to include the homepage (with/without index.php)
// Version 1.0.5
//  - Fix @include, was trying to run on pages with no Latest Forum Threads section.
// Version 1.0.4
//  - Update @include to one-liner.
// Version 1.0.3
//  - Adding index to includes.
// Version 1.0.2
//  - Move settings link to the furthest left of user dropdown area.
// Version 1.0.1
//  - Update hotkey thread highlighting
// Version 1.0.0
//  - The initial version:
//    - Features:
//    - Whitelist/blacklist/Mark Read
//    - Works on Latest Forum Threads and Forum pages.
//    - Hide thread based on whether you've clicked since most recent.
//    - Hotkeys: blacklist (b), whitelist (w), mark read (r)
//    - Settings dialog to set/clear above.
// Todo:
//    - Status area (how many threads currently hidden, etc.)

GM_addStyle(`
@keyframes greenlist {
  0% {
    background-color: #90b180;
  }
  100% {
    background-color: initial;
  }
}

.greenlist-animation {
  animation: greenlist 1s;
}

.spin-out {
  animation-name: spinOut;
  animation-duration: 1.5s;
  animation-fill-mode: both;
}

@keyframes spinOut {
  0% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1) rotateY(0deg);
  }
  100% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0, 0) rotateY(360deg);
  }
}
`);

const initialOptions = {
  options: {
    whitelist: {
      threads: new Set(),
    },
    blacklist: {
      threads: new Set(),
    },
    greenlist: {
      threads: new Set(),
    }
  },
  userSelected: {
    threads: new Set(),
  },
};

const optionsKey = 'empornium-threadman-options';
const getOptions = () => {
  const options = GM_getValue(optionsKey);
  if (options) {
    const rawOptions = JSON.parse(options);

    if (!rawOptions.options.greenlist) {
      rawOptions.options.greenlist = {
        threads: '[]'
      };
    }

    // convert whitelist/blacklist back to sets
    rawOptions.options.whitelist.threads = new Set(JSON.parse(rawOptions.options.whitelist.threads));
    rawOptions.options.blacklist.threads = new Set(JSON.parse(rawOptions.options.blacklist.threads));
    rawOptions.options.greenlist.threads = new Set(JSON.parse(rawOptions.options.greenlist.threads));
    rawOptions.userSelected.threads = new Set(JSON.parse(rawOptions.userSelected.threads));

    // console.log('Options from GM: ', JSON.stringify(rawOptions, null, 4))

    return rawOptions;
  }
  return initialOptions;
};
const setOptions = (options = initialOptions) => {
  // console.log(`Setting options to ${optionsKey}:`, options);

  // convert sets to arrays
  options.options.whitelist.threads = JSON.stringify([...options.options.whitelist.threads]);
  options.options.blacklist.threads = JSON.stringify([...options.options.blacklist.threads]);
  options.options.greenlist.threads = JSON.stringify([...options.options.greenlist.threads]);
  options.userSelected.threads = JSON.stringify([...options.userSelected.threads]);

  GM_setValue(optionsKey, JSON.stringify(options ? options : initialOptions));
};
const getLatestForumThreads = () => Array.from(document.querySelectorAll('.latest_threads > span'));
const getForumThreads = () => Array.from(document.querySelectorAll('table.forum_list tr.rowa, table.forum_list tr.rowb'));
const getThreadMetaData = (thread) => {
  if (thread.children[0].nodeName.toLowerCase() === 'span') { // Latest forum thread
    const link = thread.children[1].href;
    return {
      id: link.split('/thread/')[1].split('?')[0],
      name: thread.children[1].textContent.trim(),
      timestamp: new Date(thread.children[3].title),
    };
  } else { // forum
    const firstAnchor = thread.querySelector('a');
    return {
      name: firstAnchor.textContent,
      id: firstAnchor.href.split('/thread/')[1],
      timestamp: thread.querySelector('span.time').title,
    };
  }
};

// Shows/hides threads based on options and displayed threads.
//  - Latest Forums section (top of multiple pages)
//  - Forum Page
const processThreads = (threads) => {
  const options = getOptions();
  threads.forEach(thread => {
    const threadMetaData = getThreadMetaData(thread);

    // Handle whitelist threads
    if (options.options.whitelist.threads.size > 0) {
      if (options.options.whitelist.threads.has(threadMetaData.id)) {
        thread.hidden = false;
      } else {
        thread.hidden = true;
      }
    } else {
      // Handle blacklisted threads
      if (options.options.blacklist.threads.has(threadMetaData.id)) {
        thread.hidden = true;
      }
    }

    // Handle greenlist threads (these are always shown - they trump previous visibility)
    if (options.options.greenlist.threads.size > 0) {
      if (options.options.greenlist.threads.has(threadMetaData.id)) {
        const link = thread.querySelector('a');
        link.innerHTML = `<strong>💚${link.textContent}</strong>`;
        thread.hidden = false;
      }
    }

    // Handle clicked threads. Iterate over userselected threads. if any match current thread, check date and optionally hide.
    options.userSelected.threads.forEach(selectedThread => {
      if (selectedThread.id === threadMetaData.id) {
        const threadDate = new Date(threadMetaData.timestamp);
        const clickedDate = new Date(selectedThread.lastClicked);

        // check date and if greenlisted. always show greenlisted thread.
        if (clickedDate > threadDate && !options.options.greenlist.threads.has(threadMetaData.id)) {
          console.log(`Hiding already viewed thread, ${threadMetaData.name}`);
          thread.hidden = true;
        }
      }
    });
  });
};

//-----------Settings Dialog----------------
const template = `
  <style>
  #threadman-options-outer-container {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    top: 50%;
    width: 1000px;
    height: 430px;
    border: solid #333 1px;
    background-color: rgb(0,0,0,0.9);
    border-radius: 15px;
    margin: 5px;
  }

  #threadman-options-outer-container h1 {
    color: #ccc;
  }

  #threadman-options-outer-container h3 {
    color: #ccc;
  }

  .threadman-options-container {
    max-width: 1000px;
    width: 100%;
    position: relative;
    margin: 15px;
  }

  .threadman-options-container textarea {
    background: #333;
    color: #ccc;
  }

    .options-inner {
      width: 24%;
      margin-right: 5px;
      display: inline-block;
    }

    #threadman-save-settings {
      margin-top: 10px;
    }

    #close-threadman-settings a {
      float: right;
      margin: 0px 30px;
      text-decoration:none;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 1.3em;
    }

    #close-threadman-settings a:hover {
      background-color: rgba(100,100,10,0.9);
    }

  </style>

  <div class="threadman-options-container" id="threadman-option-container">
    <div id='close-threadman-settings'><a href='#'>✖️</a></div>
    <h1>Empornium ThreadMan Settings</h1>

    <div>
      <div class='options-inner'>
        <h3>Blacklist</h3>
        <textarea id= "blacklist" rows="15" cols="27" placeholder="Hide all threads in this list (comma-separated thread IDs)"></textarea>
      </div>
      <div class='options-inner'>
        <h3>Whitelist</h3>
        <textarea id="whitelist" rows="15" cols="27" placeholder="Only show threads in this list (comma-separated thread IDs, Blacklist ignored)"></textarea>
      </div>
      <div class='options-inner'>
        <h3>Greenlist</h3>
        <textarea id="greenlist" rows="15" cols="27" placeholder="Always show threads in this list. Forum threads you create will be automatically added to this list. (comma-separated thread IDs)"></textarea>
      </div>
      <div class='options-inner'>
        <h3>Thread Click Log</h3>
        <textarea id="userclicks" rows="15" cols="27"></textarea>
      </div>
    </div>

    <div>
      <button id='threadman-save-settings'>Save Settings</button>
    </div>

  </div>
  `;

//-----------------------------------------

const hideSettings = () => document.querySelector('#threadman-options-outer-container').remove();
const isNumeric = (num) => !isNaN(num);
const cleanUserSettings = (list) => list.filter(val => val !== '' && isNumeric(val));
const showSettings = () => {
  const createTemplateDOM = (str) => {
    const template = document.createElement('div');
    template.id = 'threadman-options-outer-container';
    template.innerHTML = str;
    return template;
  };

  const dom = createTemplateDOM(template);

  // Get settings
  const options = getOptions();

  console.log('options in settings', options);

  // Set blacklist settings
  dom.querySelector('#blacklist').textContent = [...options.options.blacklist.threads];

  // Set whitelist settings
  dom.querySelector('#whitelist').textContent = [...options.options.whitelist.threads];

  // Set greenlist settings
  dom.querySelector('#greenlist').textContent = [...options.options.greenlist.threads];

  // Set userclicks
  dom.querySelector('#userclicks').textContent = JSON.stringify([...options.userSelected.threads]);

  // Save settings
  dom.querySelector('#threadman-save-settings').addEventListener('click', () => {
    const blacklistSettingsRaw = dom.querySelector('#blacklist').value.trim();
    const whitelistSettingsRaw = dom.querySelector('#whitelist').value.trim();
    const greenlistSettingsRaw = dom.querySelector('#greenlist').value.trim();
    const userSelectedRaw = dom.querySelector('#userclicks').value.trim();

    // clean blacklist
    const blacklistSettingsListRaw = blacklistSettingsRaw.split(',');
    const blacklistSettings = cleanUserSettings(blacklistSettingsListRaw);

    // clean whitelist
    const whitelistSettingsListRaw = whitelistSettingsRaw.split(',');
    const whitelistSettings = cleanUserSettings(whitelistSettingsListRaw);

    // clean greenlist
    const greenlistSettingsListRaw = greenlistSettingsRaw.split(',');
    const greenlistSettings = cleanUserSettings(greenlistSettingsListRaw);

    // set options, save, close, refresh.
    options.options.blacklist.threads = new Set(blacklistSettings);
    options.options.whitelist.threads = new Set(whitelistSettings);
    options.options.greenlist.threads = new Set(greenlistSettings);
    options.userSelected.threads = userSelectedRaw === '' ? new Set() : new Set(JSON.parse(userSelectedRaw));

    setOptions(options);
    hideSettings();
    window.location.reload();
  });

  // Close settings
  dom.querySelector('#close-threadman-settings a').addEventListener('click', hideSettings);

  // Add to document.
  const body = document.querySelector('body');
  body.appendChild(dom);
};

// On click, need to set the lastClicked property on options.
// Search through all threads, if exists, update, else create new.
const addClickToOptions = (threadMetaData) => {
  const options = getOptions();
  const userSelectedThreads = [...options.userSelected.threads];
  const found = userSelectedThreads.find(thread => thread.id === threadMetaData.id);

  if (found) { // delete old value, add new with updated date
    options.userSelected.threads.delete(found);

    options.userSelected.threads.add({
      id: found.id,
      lastClicked: new Date(),
    });

  } else {
    options.userSelected.threads.add({
      id: threadMetaData.id,
      lastClicked: new Date(),
    });
  }
  setOptions(options);
};

/**
 * Adds click handlers to threads
 * @param {*} threads List of threads
 * @param {*} selectorToThread Selector to the top-level element of thread starting from the event target.
 */
const addClickHandlerToThreads = (threads, selectorToThread) => {
  threads.forEach(thread => {
    thread.addEventListener('click', (el) => {
      const threadMetaData = getThreadMetaData(el.target.closest(selectorToThread));
      addClickToOptions(threadMetaData);
    });

    thread.addEventListener('mouseenter', (e) => {
      e.target.classList.add('threadman-thread-target');
    });

    thread.addEventListener('mouseleave', (e) => {
      e.target.classList.remove('threadman-thread-target');
    });
  });
};

// Add settings link to page.
const addSettingsLink = () => {
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  ul.append(li);
  ul.style.display = 'inline-block';

  const a = document.createElement('a');
  a.href = '#';
  a.textContent = 'ThreadMan🦸‍♂️Settings';
  a.addEventListener('click', () => {
    showSettings();
  });
  li.appendChild(a);
  const container = document.querySelector('#major_stats');
  container.prepend(ul);
};

/**
 * Main execution
 */
//setOptions();  // For clearing out all settings.

// Get threads
const latestForumThreads = getLatestForumThreads();
const forumThreads = getForumThreads();

// Process Latest Forum threads
processThreads(latestForumThreads);

// Process Forum Pages
processThreads(forumThreads);

// Click handlers
addClickHandlerToThreads(latestForumThreads, '.latest_threads > span');
addClickHandlerToThreads(forumThreads, 'tr');

const markThread = (type, thread) => {
  let bgColor;

  function addClassBlackList() {
    thread.style.display = 'inline-block';
    thread.classList.add('spin-out');
    setTimeout(() => { thread.style.display = 'none'; thread.remove(); }, 900);
  }

  if (type === 'blacklist') {
    addClassBlackList();
  }

  if (type === 'whitelist') {
    bgColor = 'whitesmoke';
    thread.classList.remove('rowa');
    thread.classList.remove('rowb');
    thread.style.border = 'solid gainsboro 1px';
    thread.style.transition = 'opacity 0.75s';
  }

  if (type === 'greenlist') {
    thread.classList.add('greenlist-animation');
  }

  if (type === 'read') {
    bgColor = '#ACE1AF';
    thread.classList.remove('rowa');
    thread.classList.remove('rowb');
    thread.style.transition = 'opacity 1.2s';
    thread.style.opacity = 0;
    thread.style.border = 'solid gainsboro 1px';

    setTimeout(() => {
      thread.remove();
    }, 700);
  }

  thread.style.backgroundColor = bgColor;
  thread.style.borderRadius = '2px';
};

// Handles hotkey presses for latest forum and forum threads
const hotkeyHandler = (thread, e) => {
  const threadMetaData = getThreadMetaData(thread);
  if (e.keyCode === 66) { // b blacklist
    if (thread.classList.contains('threadman-thread-target')) {

      // add thread id to blacklist options
      const options = getOptions();
      if (!options.options.greenlist.threads.has(threadMetaData.id)) {
        options.options.blacklist.threads.add(threadMetaData.id);
        setOptions(options);
        markThread('blacklist', thread);
      }
    }
  }

  if (e.keyCode === 71) { // g greenlist
    if (thread.classList.contains('threadman-thread-target')) {

      // add thread id to greenlist options
      const options = getOptions();
      if (!options.options.greenlist.threads.has(threadMetaData.id)) {
        options.options.greenlist.threads.add(threadMetaData.id);

        const link = thread.querySelector('a');
        link.textContent = `💚${link.textContent}`;
        setOptions(options);
        markThread('greenlist', thread);
      }
    }
  }

  if (e.keyCode === 87) { // w whitelist
    if (thread.classList.contains('threadman-thread-target')) {
      const options = getOptions();
      if (!options.options.whitelist.threads.has(threadMetaData.id)) {
        options.options.whitelist.threads.add(threadMetaData.id);
      }
      setOptions(options);
      markThread('whitelist', thread);
    }
  }

  if (e.keyCode === 82) { // r read
    if (thread.classList.contains('threadman-thread-target')) {
      addClickToOptions(threadMetaData);
      markThread('read', thread);
    }
  }
};

// For post stepping hotkeys.
if (window.location.pathname.includes('forum/thread')) {
  const posts = document.querySelectorAll('table.forum_post[id*=post]');
  let n = window.scrollY > 0 ? posts.length - 1 : 0;
  const highlightStyleSet = 'box-shadow: 0px 0px 5px 4px; filter: hue-rotate(25deg)';
  const highlightStyleSetUnset = 'box-shadow: none; filter:none';

  posts[n].children[0].style.cssText = highlightStyleSet;

  document.addEventListener('keyup', (e) => {

    if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA') return;

    if (e.key === 'd') {
      if (n >= (posts.length - 1)) {
        n = posts.length - 1;
      } else {
        posts[n].children[0].style = highlightStyleSetUnset;
        const nextEl = posts[n].nextElementSibling;
        nextEl.children[0].style.cssText = highlightStyleSet;
        nextEl.scrollIntoView({ behavior: 'smooth' });
        n += 1;
      }
    }
    if (e.key === 'e') {
      if (n <= 0) {
        window.scrollTo(0, 0);
        n = 0;
      } else {
        posts[n].children[0].style = highlightStyleSetUnset;
        const prevEl = posts[n].previousElementSibling;
        prevEl.children[0].style = highlightStyleSet;
        prevEl.scrollIntoView({ behavior: 'smooth' });
        n -= 1;
      }
    }
  });
}

// Greenlist-related code.
const isThreadPage1 = () => {
  return /forum\/thread\/[0-9]+(\?page=1)?$/.test(document.location.pathname) &&
    (document.location.search === '' || document.location.search.includes('page=1'));
};
const getPostAt = (n) => document.querySelectorAll('table.forum_post')[n];
const getPostOwnerId = (postDom) => postDom.querySelector('.user_name a').href.split('=')[1];
const getCurrentUserId = () => document.querySelector('#nav_userinfo a').href.split('=')[1];
const isModeratorMovedPost = () => {
  const firstPost = getPostAt(0);
  const firstPostUserText = firstPost.querySelector('#user_dropdown'); // not authenticated user's 
  if (firstPostUserText) {
    const postUserText = firstPostUserText.innerText.toLowerCase();
    return postUserText.includes('moderator') || postUserText.includes('admin');
  }
  return false;
};
const isThreadStartedByMe = () => {
  const userId = getCurrentUserId();
  if (isModeratorMovedPost()) {
    return userId === getPostOwnerId(getPostAt(1));
  }
  return (userId === getPostOwnerId(getPostAt(0)));
};

// After creating a new thread, the user will hit this conditional.
// This id should be greenlisted.
if (isThreadPage1() && isThreadStartedByMe()) {
  const threadId = document.location.pathname.split('/')[3];
  const options = getOptions();
  options.options.greenlist.threads.add(threadId);
  setOptions(options);
}

// Hotkeys
document.querySelector('body').addEventListener('keydown', (e) => {
  // Escape closes options dialog
  if (e.key === 'Escape') {
    hideSettings();
  }

  // Setup hotkey functionality for latest forum and forum threads.
  getLatestForumThreads().forEach((thread) => hotkeyHandler(thread, e));
  getForumThreads().forEach((thread) => hotkeyHandler(thread, e));
});

// Settings link
addSettingsLink();