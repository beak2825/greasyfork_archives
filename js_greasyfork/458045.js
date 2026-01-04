// ==UserScript==
// @name         MoveChat · Bonk.io
// @namespace    https://greasyfork.org/en/users/962705
// @version      1.2.0
// @license      GPL-3.0
// @description  Adds a button to the top bar to move the chat position.  Click to rotate through the four corners and full screen.
// @author       rrreddd
// @match        https://bonk.io/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/458045/MoveChat%20%C2%B7%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/458045/MoveChat%20%C2%B7%20Bonkio.meta.js
// ==/UserScript==

var chatBtn = document.createElement ('div');
var topBar = document.getElementById ('pretty_top_bar');
var chatBox = document.getElementById ('ingamechatbox');
var chatCont = document.getElementById ('ingamechatcontent');
var chatAnchor = GM_getValue ('chatAnchor');
var chatWidth = GM_getValue ('chatWidth');
var chatHeight = GM_getValue ('chatHeight');
var defChatWidth = '50%';
var defChatHeight = '250';
var chatCoord = [];

if (!chatAnchor) chatAnchor = 'BL';
if (!chatWidth) chatWidth = defChatWidth;
if (!chatHeight) chatHeight = defChatHeight;

chatBtn.setAttribute ('id', 'pretty_top_movechat');
chatBtn.setAttribute ('class', 'pretty_top_button niceborderleft');
topBar.appendChild (chatBtn);

chatBtn.style.cssText = (`
    position: absolute;
    top: 0;
    right: 290px;
    height: 34px;
    width: 58px;
    background-image: url(https://i.imgur.com/gXPdjBE.png);
    background-repeat: no-repeat;
    background-position: center;
`);

setChatPos();

document.getElementById ("pretty_top_movechat").addEventListener ("click", setChatPos, false);

function setChatPos () {
    GM_setValue ('chatAnchor', chatAnchor);

    switch (chatAnchor) {
        case 'BL':
            chatCoord = ['10px', 'unset', '10px', 'unset', 'unset'];
            chatWidth = defChatWidth;
            chatHeight = defChatHeight;
            chatAnchor = 'TL';
            break;
        case 'TL':
            chatCoord = ['unset', '10px', '10px', 'unset', '0px'];
            chatWidth = defChatWidth;
            chatHeight = defChatHeight;
            chatAnchor = 'TR';
            break;
        case 'TR':
            chatCoord = ['unset', '10px', 'unset', '10px', '0px'];
            chatWidth = defChatWidth;
            chatHeight = defChatHeight;
            chatAnchor = 'BR';
            break;
        case 'BR':
            chatCoord = ['10px', 'unset', 'unset', '10px', 'unset'];
            chatWidth = defChatWidth;
            chatHeight = defChatHeight;
            chatAnchor = 'FS';
            break;
        case 'FS':
            chatCoord = ['unset', '0px', '0px', 'unset', '0px'];
            chatWidth = '100%';
            chatHeight = '100%';
            chatAnchor = 'BL';
            break;
    };

    GM_addStyle (`
        #ingamechatbox {
            bottom: ${chatCoord[0]} !important;
            top: ${chatCoord[1]} !important;
            left: ${chatCoord[2]} !important;
            right: ${chatCoord[3]} !important;
            width: ${chatWidth} !important;
            height: ${chatHeight} !important;
        }

        #ingamechatcontent {
            top: ${chatCoord[4]} !important;
            max-height: ${chatHeight} !important;
            margin: 5px !important;
        }
    `);

};