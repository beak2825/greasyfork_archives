// ==UserScript==
// @name        Chat Box Section
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/*
// @grant       none
// @license     GPL-v3
// @version     1.4.9
// @author      rockhandle
// @description Creates a separated section for the chat box
// @downloadURL https://update.greasyfork.org/scripts/519490/Chat%20Box%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/519490/Chat%20Box%20Section.meta.js
// ==/UserScript==
//Startup Sequence Variables
const smmoChat = document.querySelector("iframe").parentElement.parentElement;

if (!smmoChat) return;
smmoChat.style.cssText = "position: fixed; height: 100%; margin-top: 4rem";

//Script Variables
const chatWidth = 20  //Percentage of screen width that the chat consumes. Most resolutions at and under 1080p should work fine without modifications to this. 2k and 4k screens need some adjusting
const newButton = document.createElement("button")
const newHTML = document.createElement("div")
const chatButton = document.getElementById("show_hide_chat_btn")

newButton.style.cssText = "position: fixed; padding: 0.5rem; background-color: #000; border: 2px solid #C0C0C0; border-radius: 0.5rem; color: #C0C0C0; z-index: 30; font-size: 0.8rem";
document.getElementById("chatBox").style.cssText = `position: relative; height: calc(100% - 4rem); width: ${chatWidth}vw; padding: 0rem`;
chatButton.style.display = 'none';

//Functions
function ButtonPos() {
  if (window.innerWidth > 1740) {
    newButton.style.removeProperty('left');
    newButton.style.removeProperty('bottom');
    newButton.style.right = "5rem";
    newButton.style.top = "0.6rem";
    return
  }
  newButton.style.removeProperty('top');
  newButton.style.removeProperty('right');
  newButton.style.bottom = "1rem";
  newButton.style.left = docCookies.getItem('web_app_menu') ? "4.5rem" : "17rem"
}

document.body.querySelector('[class="inline-block"]').onmousedown = () => {setTimeout(ButtonPos, 1000)};
window.addEventListener('resize',ButtonPos);

newButton.onmousedown = () => {
  newHTML.style.display = newHTML.style.display === "none" ? "block" : "none";
  chatButton.click();
};

//Main Script
newButton.innerHTML = "Show/Hide Chat";
newHTML.style.cssText = `background-color: rgb(17 17 17 / var(--tw-bg-opacity)); height: 94vh; width: ${chatWidth}vw; float: right; position: sticky; z-index: 1; display: none`;

document.onkeydown = event => {
  if (event.code === 'NumpadEnter') newButton.onmousedown()
}

if(docCookies.getItem('show_chat') === 'true') newHTML.style.display = "block";

document.body.querySelector('.h-screen.flex.overflow-hidden.bg-gray-100').style.cssText = 'z-index: 2; position: relative';

document.getElementById("app").insertAdjacentElement('afterbegin', newHTML);
document.body.querySelector(".web-app-container").insertAdjacentElement('afterbegin', newButton);
newHTML.appendChild(smmoChat);
ButtonPos();