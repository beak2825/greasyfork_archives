// ==UserScript==
// @name Hotsno Discord Web Theme
// @author hotsno
// @description A Discord theme made 100% by me.
// @version 1.0.7
// @namespace https://greasyfork.org/en/users/748980
// @grant GM_addStyle
// @run-at document-start
// @include https://discord.com/*
// @include https://ptb.discord.com/*
// @include https://canary.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/423600/Hotsno%20Discord%20Web%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/423600/Hotsno%20Discord%20Web%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `

@import url(https://hotsno.github.io/hotsno-discord-theme/css/scsl.css);

/* Import any custom fonts here */

/* If you find an image I would STRONGLY recommend rehosting the image on imgur https://imgur.com/upload */

:root {
  /*
    Change the theme background
    Spaceman: https://i.imgur.com/K9AJmNI.png
    osu background 1: https://i.imgur.com/qqJPiCH.jpg
    osu background 2: https://i.imgur.com/4FHhFAl.jpg
    Vaporwave: https://i.imgur.com/bckU0YB.jpg
    Black blobs: https://i.imgur.com/S0g5h3b.jpg
    */
  --background-image: url(https://i.imgur.com/bckU0YB.jpg);

  /*
    Change your friends icon image
    Default: https://i.imgur.com/63g6Em8.jpg
    Purple dab: https://i.imgur.com/xYpufjb.png
    Green dab: https://i.imgur.com/QGB6qsI.png
    */
  --friends-icon: url(https://i.imgur.com/xYpufjb.png);
  --friends-icon-position: center center;
  --friends-icon-zoom: 100%;

  /*
    Change the main theme color
    Default: rgb(67, 181, 129)
    */
  --main-color: rgb(147, 112, 219);

  /*
    Change global transparency
    You can use this to make your background image lighter or darker
    Default: rgba(0, 0, 0, 0.8)
    */
  --main-transparency: rgba(0, 0, 0, 0.6);

  --unread-server-animation: none;

  /*
    Change background color when you hover members or friends
    Default: rgba(255, 255, 255, .15)
    */
  --hover-list-bg-color: rgba(255, 255, 255, 0.15);

  /*
    Change the color of the borders between messages
    Default: hsla(0,0%,100%,.1)
    */
  --border-lines-color: hsla(0, 0%, 100%, 0.1);

  /*
    Change the scroll bar color
    Default: rgba(255,255,255, .15)
    */
  --scroll-bar-color: rgba(147, 112, 219, 0.35);

  /*
    Change chat messages font size, you can use any unit: px, em, rem, %
    Default: 16px
    */
  --font-size: 16px;

  /*
    Change the text color of a selected text channel or joined voice channel
    Default: #f6f6f7
    */
  --selected-text-voice-color: #f6f6f7;

  /*
    Change the text color of a hovered text or voice channel
    Default: rgba(255, 255, 255, 0.75)
    */
  --channel-hover-text-color: rgba(255, 255, 255, 0.75);

  /*
    Change the text color of an unread text channel
    Default: #dcddde
    */
  --unread-text-color: #dcddde;

  /*
    Change the transparency of the user popout when clicking a member
    Default: rgba(0, 0, 0, 0.8)
    */
  --user-popup-background: rgba(0, 0, 0, 0.8);
}

/* ADD ANY CUSTOM CODE BELOW */

/* Hover member list */
:root {
  --hover-animation-speed: 0.35s;
  --seperator-color: var(--background-accent);
}
.membersWrap-2h-GB4 {
  min-width: unset;
  width: 65px;
  justify-content: right;
}
.members-1998pB {
  transition: transform var(--hover-animation-speed);
}
.membersWrap-2h-GB4:hover .members-1998pB {
  transform: translateX(-190px);
}
.membersWrap-2h-GB4 .membersGroup-v9BXpm::after {
  content: "";
  width: 30px;
  height: 2px;
  border-radius: 50px;
  background: unset;
  background-color: var(--seperator-color);
  position: absolute;
  left: -36px;
  top: 29px;
  margin-left: 0px;
}
.membersWrap-2h-GB4 .members-1998pB .member-3-YXUe {
  background-color: unset;
  margin-left: 0px;
  transition: margin-left var(--hover-animation-speed);
}
.membersWrap-2h-GB4:hover .members-1998pB .member-3-YXUe {
  margin-left: 8px;
}
.membersWrap-2h-GB4:hover .membersGroup-v9BXpm {
  transform: translateX(-6px);
}
.membersWrap-2h-GB4 .membersGroup-v9BXpm {
  cursor: default;
  transform: translateX(45px);
  transition: transform var(--hover-animation-speed);
  overflow: visible;
}
.members-1998pB {
  border-radius: 15px 15px 0 0 !important;
}
.membersWrap-2h-GB4,
.members-1998pB {
  left: 15px;
  margin-right: 10px;
}
.chat-3bRxxu {
  background: var(--background-tertiary);
}
.chatContent-a9vAAp {
  border-radius: 0 15px 0 0 !important;
  left: 25px;
  margin-left: -25px;
}
.theme-dark .members-1998pB{
  background-color: rgba(23, 23, 23, 0.9);
}

/* Small search bar */
.searchBar-3dMhjb {
  width: 28px;
  transition: width 0.1s ease-in-out;
}

/* Pill unread bar */
.newMessagesBar-265mhP {
  width: 500px;
  top: 1.6rem;
  left: auto;
  right: 12px;
  border-radius: 0.7rem 0 0 0.7rem;
  float: right;
}
.newMessagesBar-265mhP.barBase-1c2Rfb
  .barButtonAlt-mYL1lj.barButtonBase-2uLO1z {
  width: auto;
}
.newMessagesBar-265mhP {
  background: rgba(147, 112, 219, 0.35);
}

/* Hover bottom buttons */
.buttons-3JBrkn {
  opacity: 0;
  transition: opacity 0.1s;
}
.channelTextArea-rNsIhG:hover .buttons-3JBrkn {
  opacity: 1;
}
.attachWrapper-2TRKBi {
  order: 1;
  margin-left: 9px;
}
.attachButton-2WznTc {
  padding-right: 0px;
}
.uploadModal-2ifh8j .buttons-3JBrkn {
  opacity: 1;
}

/* Custom server name */
[data-guild-id="653624487530463233"] > .name-1jkAdW {
  visibility: hidden;
  position: relative;
}
[data-guild-id="653624487530463233"] > .name-1jkAdW:after {
  visibility: visible;
  position: absolute;
  top: 0;
  left: 0;
  content: "Telegram Anime Chat";
}

/* Hover top buttons
.toolbar-1t6TWx {
    opacity: 0;
    transition: opacity 50ms ease;
  }
  .toolbar-1t6TWx:hover {
    opacity: 1;
  }
*/

/* Remove banners */
.animatedContainer-1NSq4T {
  display: none;
}
.scroller-RmtA4e .content-3YMskv > div[style="height: 84px;"] {
  display: none;
}

/* Ctrl-T fix */
.scroller-zPkAnE {
  background-color: rgba(22, 22, 22, 0.9);
}
.theme-dark .quickswitcher-3JagVE {
  background-color: rgba(22, 22, 22, 0.9);
}
.backdrop-1wrmKB {
  opacity: 0.4 !important;
}
.theme-dark .input-2VB9rf {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Hide top buttons */
.clickable-3rdHwn[aria-label="Inbox"] {
  display: none;
}
.clickable-3rdHwn[aria-label="Member List"] {
  display: none;
}
.clickable-3rdHwn[aria-label="Toggle Channels"] {
  display: none;
}
.clickable-3rdHwn[aria-label="Toggle Servers"] {
  display: none;
}
.toolbar-1t6TWx a {display:none;}
`
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();