// ==UserScript==
// @name        More Emojis
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       GM.xmlHttpRequest
// @connect     sketchful-emojis.herokuapp.com
// @version     1.2.1
// @author      Bell
// @license     MIT
// @copyright   2021, Faux (https://greasyfork.org/users/281093)
// @run-at      document-end
// @description Adds more emojis. You can upload your own emojis. Only people with this script can see the new emojis.
// @downloadURL https://update.greasyfork.org/scripts/426620/More%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/426620/More%20Emojis.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-alert */

const options = {
  // default is 24px
  emojiSize: '34px',
  imagesInChat: true,
};

const apiUrl = 'https://sketchful-emojis.herokuapp.com/emojis';

const sketchfulEmojis = [
  "skStas", "skAlien", "skPing", "skNice", "skOK", "skOof", "skOuO", "skOwO", "skSmirk", "skPog", 
  "skMonka", "skThink", "skThonk", "skTongue", "skWaitWhat", "skWeary", "skNeutral", "skMoney", 
  "skAngry", "skHappy", "skClown", "skCool", "skCowboy", "skCry", "skFeels", "skFire", "skHeartEyes", 
  "skLove", "skImp", "skJoJo", "skJoy", "skKermit", "skLUL", "skLaugh", "skWink"
];

const css = `
  #gameChat .emoji {
    height: ${options.emojiSize};
    margin-top: -3px;
  }
  
  .chatImage {
    margin-top: -3px;
    cursor: pointer;
  }
  
  .imageModal {
    position: fixed;
    display:flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.7);
    cursor: pointer;
  }
  
  .imageModalContent {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
  }
`;
  
let emojis;

(async () => {
  addStyle(css);
  
  const chatInput = document.querySelector("#gameChatInput");
  const chat = document.querySelector('#gameChatList');
  const { tab } = await addEmojiMenu();

  if (options.imagesInChat) addImageListener(chat, chatInput);
  
  try {
    emojis = await getEmojis();
  } catch (e) {
    alert('Couldn\'t fetch the emojis from the API. Go bother Yugen#4690.');

    console.error(e);

    return;
  }
  
  tab.style.display = '';

  if (!emojis.length) return;

  addEmojis();
  
  setInterval(() => {
    refreshEmojis();
  }, 20000);

  new MutationObserver((mutations) => {
    checkChat(mutations, emojis);
  }).observe(chat, { childList: true });
})();

function addStyle(styleString) {
  const style = document.createElement('style');

  style.textContent = styleString;
  document.head.append(style);
}

// TODO: ADD DRAG DROP IMAGE IN CHAT 
// function addDragDrop(chat) {
//   sketchCanvas.addEventListener('dragenter', () => {
//     chat.
  
//   }, false);
//   sketchCanvas.addEventListener('dragleave', unhighlight, false);
//   sketchCanvas.addEventListener('drop', handleDrop, false);
//   sketchCanvas.addEventListener('dragover', function(event) {
//     event.preventDefault();
//   }, false);

// }

function addImageListener(chat, chatInput) {  
  chatInput.addEventListener('keydown', e => {
    if (!(e.code === 'Enter')) return;
    
    chatInput.value = chatInput.value.replaceAll(/https.\/\/i\.imgur\.com\/(\w+).(?:gif|png|mp4|jpg|jpeg)/g, (_, f) => {
      return ` ${f} `;
    });
  });
  
  chat.addEventListener('click', e => {
    if (!e.target.classList.contains('chatImage')) return;
    
    const modal = document.createElement('div');
    
    modal.classList.add('imageModal');
    
    modal.onclick = (e) => {
      e.stopImmediatePropagation();
      modal.remove();
    }
      
    const img = new Image();
    img.classList.add('imageModalContent');
    img.src = e.target.src;
    
    modal.appendChild(img);
    
    document.body.appendChild(modal);
  });
}

function validateEmojiName(name, toAlert = false) {
  if (name.length < 2 || name.length > 32) {
    toAlert && alert('Name must be between 2 and 32 characters long');
    
    return false;
  }
  
  if (!name.match(/^[\w_]+$/)) {
    toAlert && alert('Name can only contain alphanumeric characters and underscores.');
    
    return false;
  }
  
  for (const defaultName of sketchfulEmojis) {
    if (name.match(defaultName)) {
      toAlert && alert('Name cannot contain a default sketchful emoji substring');
      
      return false;
    }
  }
  
  return true;
}

function createImageNode(match, capture) {
  return `<img draggable="false" style="width: 100%; height: auto" class="chatImage" alt="Image" src="https://i.imgur.com/${capture}.png">`;
} 

function checkChat(mutations, emojis) {
  mutations.forEach((mutation) => {
    const msgNode = mutation.addedNodes[0];
    
    if (!msgNode || msgNode.classList.contains('chatAdmin')) return;
    
    parseMessage(msgNode, emojis);
  });
}

function getEmojis(authorId) {
  const query = authorId ? `?authorID=${authorId}` : '';
  
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: 'GET',
      url: `${apiUrl}${query}`,
      onload: (res) => {
        const parsed = JSON.parse(res.responseText);
        
        resolve(parsed.sort((a, b) => b.name.localeCompare(a.name)));
      },
      onerror: reject
    });    
  });
}

function addEmojiMenu() {
  const menus = document.querySelector('.menuTabs');
  const menuTabs = document.querySelector('#menu > div.menuNav > ul');
  
  const emojiTab = document.createElement('li');
  const emojiMenu = document.createElement('div');
  const form = document.createElement('form');
  
  emojiTab.style.display = 'none';
  emojiTab.innerHTML = `
    <a href="#menuEmojis" draggable="false">
      <img alt="Shop" class="lazy" src="${getRandomEmojiUrl()}" draggable="false"> <span>Emojis</span>
    </a>
  `;
  
  emojiMenu.id = 'menuEmojis';
  emojiMenu.style.height = '470px';
  emojiMenu.style.overflowY = 'scroll';
  
  form.style.marginTop = '30px';
  form.innerHTML = `
      <label for="emojiUrl" style="margin-top: 10px">Discord image URL:</label>
      <input type="text" id="emojiUrl" name="emojiUrl" autocomplete="off"><span style="margin-left: 10px; margin-right: 10px">OR</span>
      <input type="file" id="emojiFile" name="emojiFile" accept="image/png, image/gif, image/jpeg, image/jpg" style="width: 210px"><br><br>
      <label for="emojiName">Emoji name:</label>
      <input type="text" id="emojiName" name="emojiName" required style="margin-right: 20px" autocomplete="off">
      <input type="submit" value="Upload" class="btn btn-primary">
  `;
  
  form.onsubmit = uploadEmoji;
  
  emojiMenu.appendChild(form);
  
  menuTabs.appendChild(emojiTab);
  menus.appendChild(emojiMenu);
  
  const fileInput = document.querySelector('#emojiFile');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    let filename = file.name.replace(/\.[^/.]+$/, '');
    
    if (!file) return;
    
    if (!validateEmojiName(filename)) filename = '';

    const nameInput = document.querySelector('#emojiName');
    
    nameInput.value = filename;
  });
  
  addEmojiContainer();
  
  return {
    tab: emojiTab,
    menu: emojiMenu,
  };
}

function getRandomEmojiUrl() {
  return `res/emotes/${sketchfulEmojis[Math.floor(Math.random() * sketchfulEmojis.length)]}.png`;
}

function uploadEmoji(e) {
  e.preventDefault();
  
  const imageUrl = document.querySelector('#emojiUrl').value;
  const nameInput = document.querySelector('#emojiName');
  const name = nameInput.value;
  
  if (!validateEmojiName(name, true)) return;

  const file = document.querySelector('#emojiFile').files[0];
  
  if (imageUrl) {
    if (!imageUrl.match('^https:\/\/cdn\.discordapp\.com\/(?:emojis|attachments)\/.+')) {
      alert('Only discord urls  allowed.');
      
      return;
    }
    
    sendPostRequest(name, imageUrl);
  } else if (file) {
    const fileSize = ((file.size / 1024)).toFixed(4); // KB

    if (fileSize > 512) {
      alert('Maximum file size allowed is 512kb');

      return;
    }
    
    const fileReader = new FileReader();

    fileReader.onload = async (evt) => {
      const url = await getImageUrl(evt.target.result.split(',')[1]);

      sendPostRequest(name, url);
    };
    
    fileReader.readAsDataURL(file);
  } else {
    alert('You need to either upload a file or provide an image url');

    return;
  }
}

function updateEmojiName(id, newName) {
  const data = {
    name: newName,
  };
  
  GM.xmlHttpRequest({
    method: 'PUT',
    url: `${apiUrl}/${id}?authorID=${getAuthorId()}`,
    data: JSON.stringify(data),
    headers:  {
      'Content-Type': 'application/json'
    },
    onload: async (res) => {
      if (res.statusText === 'OK') {
        refreshEmojis();
      } else {
        alert('Couldn\'t update emoji.');
      }
    },
    onerror: () => {
      alert('Couldn\'t update emoji.');
    }
  }); 
}

function getAuthorName() {
  const { nick } = JSON.parse(localStorage.getItem('settings'));
  
  return nick;
}

function sendPostRequest(name, url) {
  if (!url || !name) {
    console.error('No url or name provided');
    
    return;
  }
    
  const data = {
    name, 
    url,
    authorID: getAuthorId(),
    authorName: getAuthorName(),
  };

  GM.xmlHttpRequest({
    method: 'POST',
    url: `${apiUrl}`,
    data: JSON.stringify(data),
    headers:  {
      'Content-Type': 'application/json'
    },
    onload: async (res) => {
      if (res.statusText === 'OK') {
        refreshEmojis();
      } else {
        alert('Couldn\'t upload emoji.');
        console.log(res);
      }
    },
    onerror: () => {
      alert('Couldn\'t upload emoji.');
    }
  }); 
}

async function getImageUrl(src) {
  const imgurData = new FormData();
  imgurData.append('image', src);

  const params = {
    method: 'POST',
    headers: { Authorization: 'Client-ID d0bd823e7933d4d' },
    body: imgurData
  };

  const response = await fetch('https://api.imgur.com/3/image', params);
  const resJSON = await response.json();

  return resJSON.data.link;
}

function parseMessage(node, emojis) {  
  const message = node.querySelector('span');

  for (const { name, url } of emojis) {
    message.innerHTML = message.innerHTML.replaceAll(`:${name}:`, getEmojiTag(name, url));
  }
  
  if (options.imagesInChat) message.innerHTML = message.innerHTML.replaceAll(/ (\w+) /, createImageNode);
}

function getEmojiTag(name, url) {
  return `<img draggable="false" class="emoji" alt="${name}" title="${name}" src="${url}">`;
}

async function addEmojis() {
  emojis = await getEmojis();
  
  const emojiList = document.querySelector('#gameChatEmotesList');
  [...document.querySelectorAll('[data-emoji-name]')].forEach((emoji) => emoji.remove());
  
  for (const { name, url } of emojis) {    
    const emojiNode = document.createElement('li');
    const emojiImg = new Image();
    
    emojiImg.src = url;
    emojiNode.setAttribute('alt', name);
    emojiNode.setAttribute('title', name);
    emojiNode.setAttribute('onclick', `addEmote(':${name}:', event.shiftKey)`);
    emojiNode.dataset.emojiName = name;
    
    emojiNode.appendChild(emojiImg);
    emojiList.insertBefore(emojiNode, emojiList.firstChild);
  }
}

async function addEmojiContainer() {
  const emojis = await getEmojis(getAuthorId());
  const prevContainer = document.querySelector('#emojiContainer');
  
  if (prevContainer) prevContainer.remove();
  
  if (!emojis.length) return;
  
  const emojiContainer = document.createElement('div');
  
  emojiContainer.id = 'emojiContainer';
  emojiContainer.style.marginTop = '40px';
  
  for (const { name, url, id } of emojis) {
    const emoji = document.createElement('div');
    const emojiImage = new Image();
    const nameInput = document.createElement('input');
    const updateButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    
    nameInput.type = 'text';
    nameInput.value = name;
    nameInput.style.marginRight = '30px';
    
    emojiImage.src = url;
    emojiImage.dataset.id = id;
    emojiImage.alt = name;
    
    emojiImage.style.width = '40px';
    emojiImage.style.height = '40px';

    emoji.style.marginBottom = '10px';
    emoji.style.display = 'flex';
    emoji.style.justifyContent = 'center';
    emoji.style.gap = '20px';
    
    updateButton.classList.add('btn', 'btn-primary');
    updateButton.textContent = 'Update';
    
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Delete';
    
    updateButton.onclick = () => {
      updateEmojiName(id, nameInput.value);
    };
    
    deleteButton.onclick = () => {
      deleteEmoji(id);
    };
    
    emoji.append(emojiImage, nameInput, updateButton, deleteButton);
    emojiContainer.appendChild(emoji);
  }
  
  const emojiMenu = document.querySelector('#menuEmojis');

  emojiMenu.appendChild(emojiContainer);
}

function refreshEmojis() {
  addEmojis();
  addEmojiContainer();
}

function deleteEmoji(id) {
  GM.xmlHttpRequest({
    method: 'DELETE',
    url: `${apiUrl}/${id}?authorID=${getAuthorId()}`,
    onload: async (res) => {
      if (res.statusText === 'OK') {
        refreshEmojis();
      } else {
        alert('Couldn\'t delete emoji.');
      }
    },
    onerror: () => {
      alert('Couldn\'t delete emoji.');
    }
  }); 
}

function dec2hex(dec) {
  return dec.toString(16).padStart(2, '0');
}

function generateId(len) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  
  return Array.from(arr, dec2hex).join('');
}

function getAuthorId() {
  let uid = localStorage.getItem('emojiUploaderId');
  
  if (!uid) {
    uid = generateId();
    
    localStorage.setItem('emojiUploaderId', uid);
  }
  
  return uid;
}