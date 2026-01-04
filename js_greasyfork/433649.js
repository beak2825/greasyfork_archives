// ==UserScript==
// @name        SmileyStash
// @namespace   Empornium Scripts
// @description Manage and search for your favorite smilies and emoji.
// @version     2.5.0
// @author      vandenium
// @include     /^https://www\.empornium\.(me|sx|is)\/forum/*/
// @include     /^https://www\.empornium\.(me|sx|is)\/inbox.php/*/
// @include     /^https://www\.empornium\.(me|sx|is)\/upload.php/*/
// @include     /^https://www\.empornium\.(me|sx|is)\/torrents.php\?id*/
// @include     /^https://www\.empornium\.(me|sx|is)\/collages.php\?id*/
// @include     /^https://www\.empornium\.(me|sx|is)\/requests.php\?.*/
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/433649/SmileyStash.user.js
// @updateURL https://update.greasyfork.org/scripts/433649/SmileyStash.meta.js
// ==/UserScript==

// Changelog:
// Version 2.5.0
//  - New feature: Now works on Collage and Request pages.
// Version 2.4.0
//  - New feature: Now works on Torrent pages (comment section).
// Version 2.3.0
//  - New feature: Now works Inbox and Torrent Upload pages.
// Version 2.2.0
//  - Added [Cntl]-[Shift]-[Z] shortcut to open smiley dialog.
// Version 2.1.1
//  - Bug fix: Fix issue introduced in 2.1.0 of not rendering favorites correctly.
// Version 2.1.0
//  - Replace inline emoji with library.
//  - Cache emoji locally for reduced network calls and responsiveness.
// Version 2.0.1
// - Bugfix: Update text color in emoji dialog box.
// Version 2.0.0
// - New Feature: Emoji!
// Version 1.1.0
// - New Feature: Set focus on text input in smilies dialog.
// Version 1.0.1
// - Bugfix: Remove default show/hide smilies control.
// Version 1.0.0
// - Finalize design.
// - Don't show click count/name in favorite smilies area.
// Version 0.0.3
//  - Close dialog when clicking smiley.
// Version 0.0.2
//  - Move all smilies into dialog box.
// Version 0.0.1
//  - The initial version.
//  - Features
//    - Track and display your most recently used smilies.
//    - Displays usage count.
//    - Sorts in descending order.
//    - Displays associated smiley name.
//    - Can clear all favorites.
//  - Requirements
//    - Tampermonkey or Violentmonkey installed in a modern browser.
// Future:
//  - Options:
//    - Edit your frequently used smilies.
//    - Show/hide name and/or click count
//    - Sort by name
//    - Update smilies periodically

let allSmilies;
// const { emojies } = window;

// Changes XML to JSON
function xmlToJson(xml) {
  // Create the return object
  let obj = {};

  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j += 1) {
        const attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const { nodeName } = item;
      if (typeof (obj[nodeName]) === 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof (obj[nodeName].push) === 'undefined') {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

const getAllSmilies = async () => {
  // Check cache first.
  allSmilies = GM_getValue('sm-all-smilies');
  if (allSmilies) {
    return Promise.resolve(JSON.parse(allSmilies).smilies.smiley);
  }

  // Get all smilies and cache.
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: '/ajax.php?action=get_smilies&indexfrom=0&indexto=433',
      onload: (responseObject) => {
        const xmlSmilies = new window.DOMParser().parseFromString(responseObject.responseText, 'text/xml');
        const jsonSmilies = xmlToJson(xmlSmilies);
        GM_setValue('sm-all-smilies', JSON.stringify(jsonSmilies));
        allSmilies = jsonSmilies.smilies.smiley;
        return resolve(allSmilies);
      },
      oneerror: () => reject(new Error('onerror')),
      onabort: () => reject(new Error('abort')),
    });
  });
};

const getFavoriteSmilies = () => {
  const favorites = GM_getValue('sm-favorite-smilies');
  return favorites ? JSON.parse(favorites) : {};
};

const showFavoriteSmilies = async (emojies) => {
  // Get all smilies
  allSmilies = await getAllSmilies();

  // clear if it exists
  const favContainer = document.querySelector('#sm-container-outer');

  if (favContainer) favContainer.remove();

  const template = `
  <style>

  #sm-container-outer {
    border: solid #555 1px;
    border-radius: 3px;
    min-height: 50px;
    padding: 5px;
    margin: 5px 0 5px 0;
  }

  #sm-container-inner {
    text-align: left;
    font-family: "Calibri", sans-serif;
  }

  #sm-favorite-smilies .bb_smiley:hover {
    background-color: #ebebef;
  }

  #all-smilies-outer-container {
    font-family: "Calibri", sans-serif;
    border: solid #555 1px;
    border-radius: 5px;
    margin: 5px 0 0 0;
    height: 250px;
    padding: 3px;

    position: fixed;
    top: 50%;
    left: 20%;
    width: 60%;
    background-color: rgb(20,20,20, 0.95);
  }

  #all-smilies-container {
    overflow: hidden;
    overflow-y: scroll;
    height: 210px;
  }

  .bb_smiley {
    display: inline-block;
    margin: 3px 3px 0 0;
    padding: 3px;
    text-align: center;
    text-decoration: none;
  }

  .bb_smiley:hover {
    background-color: #ebebef;
    text-decoration: none;
    color: #666;
  }

  #smiley-searchbox {
    display: inline-block;
    margin: 5px;
    width: 91%;
    height: 1.3em;
    font-size: 1.3em;
    border-radius: 2px;
  }

  #toggle-all-smilies {
    float: left;
  }

  #quickpost {
    width: 100%;
    margin: 5px 0 0 0;
  }

  #clear-favorites {
    float: right;
  }

  #clear-favorites:hover {
    cursor: pointer;
    color: #aaa;
  }

  #sm-container-inner #msg {
    font-size: 1.2em;
  }

  #all-smilies-button {
    vertical-align: text-top;
  }
  #all-smilies-button img {
    width: 13px;
    margin-bottom: -2px;
  }

  div#close-hb {
    float: right;
    border-radius: 5px;
    height: 20px;
    font-size: 20px;
    margin: -5px 0;
  }

  div#close-hb:hover{
    cursor:pointer;
    border-radius: 5px;
    height: 20px;
    color: #eee;
  }

  .fade-in {
    animation: fadeIn .250s;
  }
  @keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }
  .fade-out {
    animation: fadeOut 0.150s;
  }
  @keyframes fadeOut {
    0% {opacity:1;}
    100% {opacity:0;}
  }

  .emoji-character {
    font-size: large;
  }

  .bb_smiley span {
    color: #ccc;
  }

  </style>

  <div id='sm-container-inner'>
    <span id='msg'>Favorite Smilies:</span><span id='clear-favorites'>Clear Favorites</span>
    <div id='sm-favorite-smilies'></div>
  </div>
  `;

  const outer = document.createElement('div');
  outer.id = 'sm-container-outer';
  outer.innerHTML = template;

  const favoriteSmilies = getFavoriteSmilies(emojies);

  const favSmiliesContainer = outer.querySelector('#sm-favorite-smilies');

  const sortedSmilies = [];

  for (const smiley in favoriteSmilies) {
    sortedSmilies.push([smiley, favoriteSmilies[smiley].clicks]);
  }

  sortedSmilies.sort((a, b) => b[1] - a[1]);

  sortedSmilies.forEach(async (smileyData) => {
    const smiley = await createSmiley(smileyData[0], smileyData[1], false, emojies);
    favSmiliesContainer.append(smiley);
  });

  const locationHref = window.location.href;

  let target = document.querySelector('#quickreplytext'); // forums

  if (locationHref.includes('upload')) {
    target = document.querySelector('#desc').parentNode;
  }

  if (locationHref.includes('inbox')) {
    target = document.querySelector('#messageform').parentNode;
  }

  const clearFavorites = outer.querySelector('#clear-favorites');
  clearFavorites.addEventListener('click', () => {
    GM_deleteValue('sm-favorite-smilies');
    showFavoriteSmilies(emojies);
  });

  target.append(outer);
};

const closeSmiliesDialog = (e) => {
  if (e) {
    if (e.key === 'Escape' || e.type === 'click') {
      const dialog = document.querySelector('#all-smilies-outer-container');
      dialog.classList.remove('fade-in');
      dialog.classList.add('fade-out');
      window.setTimeout(() => dialog.remove(), 150);
    }
  }
};

const createSmiley = async (name, clicks, showMeta, emojies) => {
  let smiley = allSmilies.find((sm) => sm.bbcode['#text'] === name);
  const locationHref = window.location.href;

  // check emoticons
  if (!smiley) {
    smiley = emojies.find((emoji) => emoji.unicodeName === name);
  }

  const link = document.createElement('a');
  link.classList.add('bb_smiley');
  link.type = smiley.bbcode ? 'bb-smiley' : 'emoji';
  link.title = smiley.bbcode ? smiley.bbcode['#text'] : smiley.unicodeName;
  link.character = smiley.character;
  link.href = `javascript:insert('${link.character ? link.character : ` ${link.title} `}', '${locationHref.includes('upload') ? 'desc' : 'quickpost'}' )`;
  link.innerHTML = smiley.url ? smiley.url['#text'] : `<span class='emoji-character'>${smiley.character}</span>`;

  if (showMeta) {
    // add smiley/emoji name
    const smileyText = document.createElement('span');

    smileyText.innerText = link.type === 'bb-smiley'
      ? `${link.title.split(':')[1]}${clicks ? `(${clicks})` : ''}`
      : link.title;

    smileyText.style.display = 'block';
    link.appendChild(smileyText);
  }

  // add smiley click handler to persist click link count.
  link.addEventListener('click', (e) => {
    const favoriteSmiliesContainer = document.querySelector('#sm-favorite-smilies');
    const smileyClone = e.target.closest('.bb_smiley').cloneNode(true);
    favoriteSmiliesContainer.append(smileyClone);
    const favoriteSmiliesText = GM_getValue('sm-favorite-smilies') || '{}';
    const favoriteSmilies = JSON.parse(favoriteSmiliesText);
    if (favoriteSmilies[smileyClone.title]) {
      favoriteSmilies[smileyClone.title].clicks += 1;
    } else {
      const o = {
        clicks: 1,
      };
      favoriteSmilies[smileyClone.title] = o;
    }
    GM_setValue('sm-favorite-smilies', JSON.stringify(favoriteSmilies));

    // Re-render favorite smilies
    showFavoriteSmilies(emojies);

    // Close smilies dialog if open
    closeSmiliesDialog();
  });
  return link;
};

const showAllSmilies = async (smilies, emojies) => {
  const container = document.createElement('div');
  container.id = 'all-smilies-outer-container';
  container.classList.add('fade-in');

  const smiliesContainer = document.createElement('div');
  smiliesContainer.id = 'all-smilies-container';
  container.innerHTML = '';

  // create a search input
  const searchbox = document.createElement('input');
  searchbox.type = 'text';
  searchbox.id = 'smiley-searchbox';
  searchbox.placeholder = 'Type to search for smilies or emojies...';

  const closeButton = document.createElement('div');
  closeButton.id = 'close-hb';
  closeButton.innerText = '🗙';

  closeButton.addEventListener('click', closeSmiliesDialog);

  const allSmilies = [];

  // add bb smilies
  for (const smiley of smilies) {
    const link = await createSmiley(smiley.bbcode['#text'], false, true, emojies);
    await allSmilies.push(link);
    smiliesContainer.append(link);
  }

  for (const emoji of emojies) {
    const link = await createSmiley(emoji.unicodeName, false, true, emojies);
    await allSmilies.push(link);
    smiliesContainer.append(link);
  }

  searchbox.addEventListener('keyup', () => {
    const typed = searchbox.value;

    allSmilies.forEach((sm) => {
      if (!sm.title.includes(typed)) {
        sm.style.display = 'none';
      } else {
        sm.style.display = 'inline-block';
      }
    });
  });

  container.prepend(searchbox);
  container.append(closeButton);
  container.append(smiliesContainer);
  document.body.append(container);
  searchbox.focus();
};

const showSmiliesDialog = (e, emojies) => {
  if (e) {
    if (e.keyCode === 90 && e.shiftKey && e.ctrlKey) {
      showAllSmilies(allSmilies, emojies);
    }
  }
};

const clearAllData = () => {
  GM_deleteValue('sm-all-smilies');
  GM_deleteValue('sm-favorite-smilies');
  GM_deleteValue('emojis');
};

const createSmiliesButton = (emojies) => {
  const button = document.createElement('a');
  button.classList.add('bb_button');
  button.alt = 'smilies';
  button.id = 'all-smilies-button';

  button.innerText = '😀 Smilies & Emoji';

  button.addEventListener('click', async () => {
    allSmilies = await getAllSmilies();
    showAllSmilies(allSmilies, emojies);
  });

  const target = document.querySelectorAll('.bb_buttons_left')[1];
  target.append(button);
};

const isSmiliesDialogOpen = () => !!document.querySelector('#all-smilies-outer-container');

const configureSmiliesDialogCloseControls = (emojies) => {
  document.querySelector('.overflow_button').remove();
  document.body.addEventListener('keyup', (e) => {
    closeSmiliesDialog(e);
    showSmiliesDialog(e, emojies);
  });

  document.body.addEventListener('click', (e) => {
    const smiliesButton = document.querySelector('#all-smilies-button');
    const smileySearchBox = document.querySelector('#smiley-searchbox');
    const dialog = document.querySelector('#all-smilies-outer-container');
    if (isSmiliesDialogOpen()
      && e.target !== smiliesButton
      && e.target.parentNode !== smiliesButton
      && e.target !== smileySearchBox
      && e.target !== dialog) {
      closeSmiliesDialog(e);
    }
  });
};

const getAllEmoji = () => new Promise((resolve, reject) => {
  const emojis = GM_getValue('emojis');
  if (emojis) {
    return resolve(JSON.parse(emojis));
  }
  return GM_xmlhttpRequest({
    url: 'https://sleazyfork.org/scripts/433889-emojis/code/emojis.js?version=979510',
    responseType: 'json',
    onload: (data) => {
      if (data && data.response) {
        GM_setValue('emojis', JSON.stringify(data.response));
        return resolve(data.response);
      }
      return reject();
    },
    onerror: () => reject(),
    onabort: () => reject(),
  });
});

const run = async () => {
  const emojies = await getAllEmoji();
  showFavoriteSmilies(emojies);
  createSmiliesButton(emojies);
  configureSmiliesDialogCloseControls(emojies);
};

run();
