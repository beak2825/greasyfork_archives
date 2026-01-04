// ==UserScript==
// @name         Flexible dAmn
// @namespace    http://winyumi.deviantart.com/
// @version      0.2.16
// @description  Injects CSS that enables the chat to fit smaller window sizes, alongside other adjustments. Set execute order after superdAmn if installed.
// @author       Winyumi
// @match        http://chat.deviantart.com/chat/*
// @match        https://chat.deviantart.com/chat/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABh0lEQVRYhcWXr0sEQRTHP3s4QS1n0yoWwSKuzTxR7IJaFJMieElBLlwQ/HFNTQr+BUb3b5hqMmgSDQcaRHDCGe6CHLMzb3+x3/j2vff9sMPbeRv1+31ciqLIGfdJGb0F3Lqe/S49Ohs2MrukmzeBi6x1pQEALWCqFgBl9Aywn6e2rDdwDEzWAqCMnge289aPeRrfCeobwBqgAnkPmQGATQGARH3gKO1hmVOQpnsbJ091AVjgxJdQNcC1jZPXugC+gU4oqUqASxsnH3UB9IBzSaJvDA8csUVgQ9D31MbJpwQgynIdK6N3gatAzzdgzsbJz/9gmo/4CJTR4wRGaqj2qLlPviMY1R4wLchbUUZPOOJdV7LoCIbLxgvQFAA4VXQjahUx9ykIUGTZKAWAwU2Wa9koDKCMngV2qjIPAgBtwstGNQDK6AVgvUpz8H8HOkDo7+SLwbrlnuWCAKuBWgss2zh5FjmlIBa5DW/E5h7lBRAtG1UCdG2cvNcF0APOyjDPC3AoXTYk+gPJOFsYwn3WVAAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30708/Flexible%20dAmn.user.js
// @updateURL https://update.greasyfork.org/scripts/30708/Flexible%20dAmn.meta.js
// ==/UserScript==

/*

What does this script do?

v0.2

- Minimize the title and topic headers by clicking on the space just left of the chat tabs.

- Username and chat text are inlined together when chat window is small enough.

- With SuperdAmn, the away message box overlays the control bar and moves away when you need the controls.

v0.1

- Removes minimum width of page enabling smaller chat windows for times when you need multiple chat windows open on one screen.

- Hides most possibly unnecessary header elements giving you room for notifications, friends and collections menus.
  I especially kept the Submit button for the easy access to Sta.sh.

- Added word wrap on usernames in the chat log so chatroom setting changes don't stretch the chat.
  However, usernames with hyphens now can break into multiple lines if their line of text is too long.
  I personally think it's worth it considering how annoying stretched chats are. Long URL pastes still pose a threat though.

- With SuperdAmn, improves upon the title and topic editors with less restricted resizing.

- With SuperdAmn, adjusts the bottom controls by the pixel and hides some elements responsive to window sizing.
  Note: This does affect appearance of bottom controls poorly if SuperdAmn is not used, but it's not so bad. (Fixed!)

- With SuperdAmn, timestamps are smaller giving you some more room for actual chat text.


Get SuperdAmn here:
http://superdamners.deviantart.com/
https://github.com/graulund/superdAmn

*/


var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = `
.oh-search, #oh-menu-shop, #oh-menu-mobile,
#oh-menu-more { display: none !important; }
body { min-width: 0 !important; }
.damncrc-icon-roomname { top: 0 !important; }
.damncrc-iconbar-ctrls { top: 0 !important; }
.damncrc-input input, .damncrc-input textarea {
  box-sizing: border-box !important;
  max-width: 100% !important;
  width: 100% !important;
}
.damncr .msg .ts {
  font-size: 75% !important;
  font-weight: normal !important;
  letter-spacing: -1px;
}
.damncr .msg .from { white-space: normal !important; }
.damncr .msg .from .ffc { white-space: nowrap !important; }
.superdamn-topicer { position: relative !important; z-index: 10000; box-shadow: 0 0 10px #000; background-color: inherit; }
.superdamn-topicer textarea { box-sizing: border-box; }
.superdamn-topicer .meta span { white-space: nowrap; }
.superdamn-topicer .meta div { z-index: 21; font-size: 0; top: 1px; right: 0; background-color: inherit; padding-right: 5px; }
.superdamn-topicer .meta div button { font-size: 10pt; }
.superdamn-topicer .meta div .cancel { font-size: 9pt; margin-left: 5px; }
.damncrc-iconbar .away {
  position: absolute;
  right: 0 !important;
  z-index: 50;
  margin: 0 !important;
  max-width: none !important;
  white-space: nowrap !important;
  cursor: default;
  transform: translateY(1px);
  transition: transform 0.15s;
}
.damncrc-iconbar .away .t { display: inline-block; }
.damncrc-iconbar:hover .away { transform: translateY(-20px); box-shadow: rgba(0,0,0,0.25) 0 0 3px; }
@media screen and (max-width: 790px) {
  .damncrc-icon-roomname { display: none; }
}
@media screen and (max-width: 740px) {
  .oh-mmain>a#da-h1 { width: auto; }
  #deviantart-logo .type { display: none; }
}
@media screen and (max-width: 600px) {
  .damncrc-iconbar-ctrls > b,
  .emoticons.show_emoticons_modal,
  .superdamn-buttonbar2 { display: none !important; }
}
@media screen and (max-width: 520px) {
  /*.damncrc-iconbar-ctrls > a { display: none !important; }*/
  .damncr .msg { padding-top: 4px; }
  .damncr .msg .inner { display: block; padding-left: 12px; padding-right: 12px; }
  .damncr .msg .ts { display: block; margin-left: -12px; opacity: 0.5; }
  .damncr .msg .from { display: inline-block; margin-left: -12px; }
  .damncr .msg .text { display: inline; }
}
@media screen and (max-width: 470px) {
  .superdamnbutton.bold, .superdamnbutton.italic,
  .superdamnbutton.underline, .superdamnbutton.link,
  .superdamnbutton.thumb, .superdamnbutton.superscript,
  .superdamnbutton.subscript, .superdamnbutton.code,
  .superdamnbutton.website { display: none !important; }
}
#toppler {
  position: absolute;
  top: 60px;
  left: 0;
  width: 8px;
  height: 25px;
  background: transparent;
  z-index: 9000;
  border-radius: 0 5px 0 0;
}
#toppler:hover { background: #344041; cursor: pointer; }
.damncr-topbar { transition: height 0.5s, min-height 0.5s; }
.damn-lo-row-flex { /*transition: border-top-width 0.5s;*/ }
`;
/* Fix superdAmn button bar positioning */
if (typeof superdAmn) {
    css.innerHTML += `
.superdamn-buttonbar { top: -1px !important; }
.superdamn-buttonbar2 { vertical-align: baseline !important; position: relative; top: 1px; left: 4px; }
`;
}
document.body.appendChild(css);


/* Title and Topic Toggler */
var toppler = document.createElement("div");
toppler.id = "toppler";
document.body.appendChild(toppler);
var css2 = document.createElement("style");
css2.type = "text/css";
css2.innerHTML = "";
document.body.appendChild(css2);
var topplerEnabled = 0;
toppler.onclick = function() {
    if (topplerEnabled < 1) {
        css2.innerHTML = `
.damn-lo-row-flex .damn-lo-row-flex { border-top-width: 3px !important; }
.damn-lo-row-flex .damn-lo-row-flex .damn-lo-row-flex { border-top-width: 0 !important; }
.damncr-topbar { visibility: hidden; }
.alt0-border { border-color: transparent; }
`;
        topplerEnabled = 1;
    } else {
        css2.innerHTML = "";
        topplerEnabled = 0;
    }
};
