// ==UserScript==
// @name        CB Mod Assist
// @author      TheKrucible
// @namespace   https://sorte.ninja
// @version     1.2
// @include     https://chaturbate.com/*
// @grant       GM.registerMenuCommand
// @description Helper script for mods on chaturbate.com that lets you save predefined messages and send them to chat with two clicks
// @downloadURL https://update.greasyfork.org/scripts/437894/CB%20Mod%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/437894/CB%20Mod%20Assist.meta.js
// ==/UserScript==

const host = document.createElement('div');
host.setAttribute('class', 'cbma');
document.body.appendChild(host);

const KEY = 'cbma-text';
const EDITOR_ID = 'cbma-textarea';
const STYLES = `
.cbma .editor {
  position: fixed;
  left: 20vw;
  top: 10vh;
  width: 60vw;
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
}
.cbma .editor textarea {
  width: 100%;
  height: 60vh;
  box-sizing: border-box;
  resize: none;
}
.cbma .speak {
  position: absolute;
  right: 50px;
  bottom: 0px;
  width: fit-content;
  max-width: 50vw;
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
}
.cbma .speak ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.cbma .speak ul li {
  cursor: pointer;
}
.cbma .speak ul li.off {
  font-style: italic;
  color: gray;
}
.cbma .speak ul li:hover {
  text-decoration: underline;
}
.cbma .buttonbar {
  margin-top: 20px;
  text-align: right;
}
button.cbma-speak {
  position: absolute;
  right: 75px;
  top: calc(50% - 10px);
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 3px 5px;
  text-transform: uppercase;
}
`;

function showEditor() {
  const text = window.localStorage.getItem(KEY) || '';
  host.innerHTML = `
<div class="editor">
  <h1>CB Mod Assist Editor</h1>
  <p>
    Enter lines you want to speak in chat here. One line = one chat item. Empty lines are ignored.<br>
    Lines starting with one or more spaces are shown "grayed out" in select box, but can still be spoken.<br>
    Do multi-line speaks with two plus signs: 'This will ++ send three lines ++ to chat'.<br>
    Make model specific sections with a line '# modelname'. Everything following that line will only show in that models room.
  </p>
	<textarea id="${EDITOR_ID}">${text}</textarea>
  <div class="buttonbar">
	  <button id="cbma-close">Save and close</button>
  </div>
</div>
`;
  document.getElementById('cbma-close').addEventListener('click', closeEditor);
}

function closeEditor() {
  const text = document.getElementById(EDITOR_ID).value;
  window.localStorage.setItem(KEY, text);
  host.innerHTML = '';
}

function showSpeak() {
  const items = (window.localStorage.getItem(KEY) || '')
  	.split('\n')
  	.filter(i => i.trim() !== '');

  if (items.length === 0) {
    host.innerHTML = `
<div class="speak">
  <h1>CB Mod Assist</h1>
  <p>No lines entered. Please click 'Edit' below to enter lines.</p>
  <div class="buttonbar">
    <button id="cbma-edit">Edit</button>
    <button id="cbma-close">Cancel</button>
  </div>
</div>
`;
  }
  else {
    host.innerHTML = `
<div class="speak">
  <h1>CB Mod Assist</h1>
  <p>Click line below to speak in chat. Shift+click to copy to chat box without sending.</p>
	<ul id="cbma-list"></ul>
  <div class="buttonbar">
    <button id="cbma-edit">Edit</button>
	  <button id="cbma-close">Cancel</button>
  </div>
</div>
`;
    const list = document.getElementById('cbma-list');
    let model = '';
    items.forEach(item => {
      if (item.startsWith('#')) {
        model = '/' + item.substring(1).trim() + '/'
      }
      else if (window.location.pathname.startsWith(model)) {
        const li = document.createElement('li');
        if (item.startsWith(' ')) {
          li.setAttribute('class', 'off');
        }
        li.textContent = item.trim();
        list.appendChild(li);
      }
    });
    list.addEventListener('click', speak);
  }
  document.getElementById('cbma-edit').addEventListener('click', showEditor);
  document.getElementById('cbma-close').addEventListener('click', cancelSpeak);
}

function speak(event) {
  const speach = event.target.textContent.split('++').map(x => x.trim()).filter(x => !!x);
  const input = document.querySelector('.inputDiv .chat-input-field');
  const button = input.parentElement.parentElement.querySelector('.SendButton');
  if (!input || !button) {
    return;
  }

  if (event.shiftKey) {
    input.innerText = event.target.textContent;
    return;
  }

  if (speach.length > 0) {
    doSpeak(speach, input, button);
  }

  cancelSpeak();
}

function doSpeak(lines, input, button) {
  const line = lines.shift();
  input.innerText = line;
  button.click();

  if (lines.length > 0) {
    window.setTimeout(() => doSpeak(lines, input, button), 300);
  }
}

function cancelSpeak() {
  host.innerHTML = '';
}

GM.registerMenuCommand('CB Mod Assist - Edit', showEditor);
GM.registerMenuCommand('CB Mod Assist - Speak', showSpeak);

function addGlobalStyle(css) {
  const head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

function init() {
  addGlobalStyle(STYLES);
  const input = document.querySelector('div.inputDiv');
  if (input) {
    const button = document.createElement('button');
    button.setAttribute('class', 'cbma-speak');
    button.innerHTML = 'Assist';
    input.appendChild(button);
    const textarea = input.querySelector('.chat-input-field');
    textarea.style.width = (textarea.clientWidth - 60) + 'px';
    button.addEventListener('click', showSpeak);
  }
}

window.addEventListener('load', () => window.setTimeout(init, 2000));
