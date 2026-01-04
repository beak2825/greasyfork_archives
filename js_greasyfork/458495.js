// ==UserScript==
// @name         Bonk Chat Mod (beta)
// @namespace    https://greasyfork.org/en/scripts/
// @version      0.0.2.e
// @license      GPL-3.0
// @description  Adds a couple features to Bonk.io
// @author       rrreddd
// @match        https://bonk.io/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.3.slim.js
// @downloadURL https://update.greasyfork.org/scripts/458495/Bonk%20Chat%20Mod%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458495/Bonk%20Chat%20Mod%20%28beta%29.meta.js
// ==/UserScript==

var gameText = document.getElementById ('ingamechatinputtext');
var lobbyText = document.getElementById ('newbonklobby_chat_input');
var chatBox = document.getElementById ('ingamechatbox');
var chatCont = document.getElementById ('ingamechatcontent');
var chatAnchor = GM_getValue ('chatAnchor');
var chatWidth = GM_getValue ('chatWidth');
var chatHeight = GM_getValue ('chatHeight');
var fontSize = GM_getValue ('fontSize');
var fontFamily = GM_getValue('fontFamily');
var nameColor = GM_getValue('nameColor');
var textColor = GM_getValue('textColor');
var chatCoord = [];
var sentText;
var cmd;
var args = [];

if (!chatAnchor) chatAnchor = 'BL';
if (!chatWidth) chatWidth = '50%';
if (!chatHeight) chatHeight = '30%';
if (!fontSize) fontSize = '12';
if (!fontFamily) fontFamily = 'Calibri';
if (!nameColor) nameColor = '#e3e3e3';
if (!textColor) textColor = '#ffffff';

gameText.addEventListener ('keydown', function (e) {runScripts (e)});
lobbyText.addEventListener ('keydown', function (e) {runScripts (e)});

setChat (chatAnchor, chatWidth, chatHeight, fontFamily, fontSize, nameColor, textColor);

function runScripts(e) {
    if (e.keyCode == 13) {
        if (!gameText.value) {sentText = lobbyText.value} else {sentText = gameText.value};

        if (sentText.substring (0, 1) == '/') {

            args = sentText.split(" ");
            cmd = args[0].substring (1).toUpperCase();
            args.shift();

            switch (cmd) {
                case 'MC':
                case 'MOVECHAT':
                    switch (args[0].toUpperCase()) {
                        case 'BL':
                        case 'TL':
                        case 'TR':
                        case 'BR':
                            chatAnchor = args[0].toUpperCase();
                            GM_setValue ('chatAnchor', chatAnchor);
                            chatAlert ('Anchor set: ' + chatAnchor, 'red');
                            break;
                        default:
                            alert ('bad anchor.  use TL, TR, BR, BL');
                    };
                    break;

                case 'CW' :
                case 'CHATWIDTH' :
                    if(!isNaN(args[0])) {
                        chatWidth = args[0] + 'px';
                        GM_setValue ('chatWidth', chatWidth);
                        chatAlert ('Chat width set: ' + chatWidth, 'red');
                    } else if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(args[0])) {
                        chatWidth = args[0];
                        GM_setValue ('chatWidth', chatWidth);
                        chatAlert ('Chat width set: ' + chatWidth, 'red');
                    } else {
                        alert(`
                            bad width
                            use a number or %
                        `);
                    };
                    break;

                case 'CH' :
                case 'CHATHEIGHT' :
                    if(!isNaN(args[0])) {
                        chatHeight = args[0] + 'px';
                        GM_setValue ('chatHeight', chatHeight);
                        chatAlert ('Chat height set: ' + chatHeight, 'red');
                    } else if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(args[0])) {
                        chatHeight = args[0];
                        GM_setValue ('chatHeight', chatHeight);
                        chatAlert ('Chat height set: ' + chatHeight, 'red');
                    } else {
                        alert(`
                            bad height
                            use a number or %
                        `);
                    };
                    break;

                case 'FF' :
                case 'FONT' :
                    fontFamily = args.join(" ");
                    GM_setValue ('fontFamily', fontFamily);
                    chatAlert ('Font set: ' + fontFamily, 'red');
                    break;

                case 'FS' :
                case 'FONTSIZE' :
                    if (!isNaN(args[0])) {
                        if (args[0] >= 6) {
                            if (args[0] <= 32) {
                                fontSize = args[0];
                                GM_setValue ('fontSize', fontSize);
                                chatAlert ('Font size set: ' + fontSize, 'red');
                            } else {
                                alert (`
                                    bad font size
                                    min: 6, max: 32
                                `);
                            };
                        };
                    };
                    break;

                case 'NC' :
                case 'NAMECOLOR' :
                case 'PC' :
                case 'PLAYERCOLOR' :
                    nameColor = args[0];
                    GM_setValue ('nameColor', nameColor);
                    chatAlert ('Player name color set: ' + nameColor, 'red');
                    break;

                case 'TC' :
                case 'TEXTCOLOR' :
                    textColor = args[0];
                    GM_setValue ('textColor', textColor);
                    chatAlert ('Message color set: ' + textColor, 'red');
                    break;

                case 'TEST' :
                    chatAlert ('TEST!', 'pink');
                    break;
                default:
                    return;
            };

            setChat (chatAnchor, chatWidth, chatHeight, fontFamily, fontSize, nameColor, textColor);
            gameText.value = '';
            lobbyText.value = '';
        };
    };
};

function chatAlert (message, textCol) {
    $("#ingamechatcontent").append("<div><span class='ingamechatmessage' style='color: " + textCol + " !important'>" + message + "</span></div>");
};

function setChat (anchor, width, height, font, fontsize, nameCol, textCol) {

    var chatMaxHeight;

    switch (anchor) {
        case 'BL':
            chatCoord = ['0px', 'unset', '0px', 'unset', 'unset'];
            chatMaxHeight = height;
            break;
        case 'TL':
            chatCoord = ['unset', '0px', '0px', 'unset', '0px'];
            chatMaxHeight = '100%';
            break;
        case 'TR':
            chatCoord = ['unset', '0px', 'unset', '0px', '0px'];
            chatMaxHeight = '100%';
            break;
        case 'BR':
            chatCoord = ['0px', 'unset', 'unset', '0px', 'unset'];
            chatMaxHeight = height;
            break;
    };

    GM_addStyle (`
        #ingamechatbox {
            bottom: ${chatCoord[0]} !important;
            top: ${chatCoord[1]} !important;
            left: ${chatCoord[2]} !important;
            right: ${chatCoord[3]} !important;
            width: ${width} !important;
            height: ${height} !important;
        }

        #ingamechatcontent {
            top: ${chatCoord[4]} !important;
            height: calc(${chatMaxHeight} - 24px) !important;
            max-height: calc(${chatMaxHeight} - 24px) !important;
            margin: 5px !important;
            font-size: ${fontsize}pt !important;
            font-family: ${font} !important;
        }

        #ingamechatinputtext {
            font-size: ${fontsize}pt !important;
            font-family: ${font} !important;
            padding-left: 0px !important;
        }

        .ingamechatname {
            color: ${nameCol} !important;
        }

        .ingamechatmessage {
            color: ${textCol} !important;
        }
    `);

};