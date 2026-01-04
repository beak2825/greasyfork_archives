// ==UserScript==
// @name        Janitor Ripper
// @namespace   Violentmonkey Scripts
// @match       https://janitorai.com/*
// @grant       none
// @version     1.6
// @author      -
// @description Download Janitor AI characters as Tavern JSON files (compatible with SillyTavern)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525476/Janitor%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/525476/Janitor%20Ripper.meta.js
// ==/UserScript==


const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setInterval(fn, 100);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

async function addDownloadButton() {
  let dropdown;

  while (!dropdown) {
  dropdown = document.querySelector('.css-3f016y');

  // Not yet ready
    if (!dropdown) {
    await delay(100);

    }
  }

  const existing = document.getElementById('downloadTavernButton');

  if (existing) {
    return;
  }

  const li = document.createElement('button');
  li.setAttribute('class', 'chakra-menu__menuitem css-18esm8n');
  li.setAttribute('role', 'menuitem');
  li.setAttribute('type', 'button');
  li.setAttribute('tabindex', '-1');
  li.innerText = 'Download Tavern JSON';
  li.setAttribute('id', 'downloadTavernButton');
  li.addEventListener('click', onDownloadClick);
  dropdown.prepend(li);
}

function getAccessToken(){

  for (let i = 0; i < localStorage.length; i++) {
    const item = localStorage.key(i);
    if (item.endsWith('auth-token')) {
      const token = JSON.parse(localStorage.getItem(item));
      return token['access_token'];
    }
  }
}

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

async function onDownloadClick() {
  const fetchUrl = location.href.replace('janitorai.com', 'kim.janitorai.com');
  const characterIndex = fetchUrl.indexOf('_character');
  var newUrl = "";
  if (characterIndex !== -1) {
    newUrl = fetchUrl.substring(0, characterIndex); // 10 is the length of "_character"
  }
  const result = await fetch(newUrl, { headers: { 'Authorization': `Bearer ${getAccessToken()}`}});

  if (!result.ok) {
    alert('Could not download JSON');
    return;
  }
  console.log(newUrl);
  const data = await result.json();
  const tavernJson = JSON.stringify({
      'name': data['name'],
      'description': data['description'], // Most of them have description/personality fields reversed (blame Zoltan editor for it)
      'scenario': data['scenario'],
      'first_mes': data['first_message'],
      'personality': data['personality'],
      'mes_example': data['example_dialogs'],
  });
  download(tavernJson, `${data['name']}.json`, 'application/json');

}

docReady(addDownloadButton);