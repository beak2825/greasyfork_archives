// ==UserScript==
// @name        Auto-Save Draft for BitcoinTalk.org
// @description Auto-Saves your post drafts on BitcoinTalk.org
// @match       https://bitcointalk.org/index.php?action=post*
// @grant       none
// @version     1.2
// @author      TryNinja
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/484095/Auto-Save%20Draft%20for%20BitcoinTalkorg.user.js
// @updateURL https://update.greasyfork.org/scripts/484095/Auto-Save%20Draft%20for%20BitcoinTalkorg.meta.js
// ==/UserScript==

// "Drafts are saved whenever you preview or post a topic, post, or PM. Up to 100 drafts are kept. Drafts are deleted after 7 days."
// WARNING: Be mindful that a low interval might make you override your entire draft history in a go, since there is a limit of 100 drafts.

const INTERVAL_SECONDS = 60;

let initialMessage = getCurrentMessage();
let lastModifiedMessage;
let draftIndicatorElement;

function currentTimeUTC() {
  const date = new Date();

  const horaUTC = date.getUTCHours();
  const minutoUTC = date.getUTCMinutes();
  const segundoUTC = date.getUTCSeconds();
  return `${horaUTC.toString().padStart(2, '0')}:${minutoUTC.toString().padStart(2, '0')}:${segundoUTC.toString().padStart(2, '0')} UTC`;
}

function textToEntities(text) {
  let entities = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 127) entities += "&#" + text.charCodeAt(i) + ";";
    else entities += text.charAt(i);
  }
  return entities;
}

function insertDraftStatusIndicator() {
  const messageArea = document.querySelector("#postmodify textarea[name=message]");
  const indicatorElement = document.createElement("p");
  indicatorElement.id = "draftIndicator";
  indicatorElement.textContent = "Auto-Save draft is activated!";
  messageArea.after(indicatorElement);
  draftIndicatorElement = document.querySelector('p[id=draftIndicator]');
}

function addEventListenerToPreviewButton() {
  const previewButton = document.querySelector('input[name=preview]');
  previewButton.addEventListener('click', function() {
    const currentMessage = getCurrentMessage();
    lastModifiedMessage = currentMessage;
    draftIndicatorElement.style = "color: green;";
    draftIndicatorElement.textContent = `Draft saved manually @ ${currentTimeUTC()}`;
  });
}

function getCurrentMessage() {
  const message = document.querySelector("#postmodify textarea[name=message]").value;
  return textToEntities(message.replace(/&#/g, "&#38;#")).replace(/\+/g, "%2B");
}

async function draft(message) {
  const formData = new FormData();
  formData.append("message", message);
  const res = await fetch("https://bitcointalk.org/index.php?action=post2;preview;xml", {
    "body": formData,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });

  if (res.status === 200) {
    lastModifiedMessage = message;
    draftIndicatorElement.style = "color: green;";
    draftIndicatorElement.textContent = `Draft saved @ ${currentTimeUTC()}`;
  } else {
    draftIndicatorElement.style = "color: red;";
    draftIndicatorElement.textContent = `Draft failed @ ${currentTimeUTC()}`;
  }
}

(() => {
  insertDraftStatusIndicator();
  addEventListenerToPreviewButton();

  setInterval(() => {
    const currentMessage = getCurrentMessage();
    if (initialMessage !== currentMessage && lastModifiedMessage !== currentMessage) {
      draft(currentMessage);
    }
  }, INTERVAL_SECONDS * 1000)

})()