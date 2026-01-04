// ==UserScript==
// @name         bonk chat
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Displays images in chat.
// @author       Apx
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @run-at       document-body
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/539121/bonk%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/539121/bonk%20chat.meta.js
// ==/UserScript==

function injector (f) {
    if(window.location == window.parent.location) {
        if(document.readyState == 'complete') {
            f();
        }
        else {
            document.addEventListener('readystatechange', function () {
                if(document.readyState != 'complete') return;
                f();
            });
        }
    }
}

injector(function () {
    const gameDocument = document.getElementsByTagName('iframe')[0].contentDocument;
    const gameWindow = document.getElementsByTagName('iframe')[0].contentWindow;

    const settings = {
        autoShowImages: true,
        ingameImages: true,
        notify: true,
        notifyOnReply: true,
    }

    // some variables stored with a help of WS
    let send = function() {};
    let playerList = null;
    let selfId = -1;

    let CSS = gameDocument.createElement('style');
    CSS.id = 'bonkChatUserscript';
    CSS.innerHTML = `
    .newbonklobby_chat_msg_colorbox {
        margin: 22px 10px 6px 6px;
        width: 12px;
        scale: 2;
        position: relative;
        bottom: 12px;
    }
    .newbonklobby_chat_msg_txtright {
        margin-left: 28px;
    }
    .newbonklobby_chat_msg_time {
        font-family: futurept_b1;
        font-size: 11px;
        color: #999999;
        display: inline-block;
        user-select: none;
        margin-left: 5px;
    }
    .newbonklobby_chat_msg_arrowtoreply {
        display: inline-block;
        height: 10px;
        width: 20px;
        margin: 10px 12px -7px;
        border-left: 2px solid #b3b3b3;
        border-top: 2px solid #b3b3b3;
        border-radius: 7px 0 0;
    }
    .newbonklobby_chat_msg_texttoreply {
        display: inline;
        font-family: "futurept_b1";
        font-size: 14px;
        user-select: none;
    }
    .newbonklobby_chat_msg_replytexthref {
        color: #181818;
        text-decoration: none;
    }
    .newbonklobby_chat_msg_replytexthref:hover {
        text-decoration: underline;
    }
    .newbonklobby_chat_msg_topname {
        left: 32px;
        margin-top: 4px;
        position: absolute;
        font-size: 12px;
    }
    #pretty_bottom {
        display: none;
    }
    .newbonklobby_chat_msg_texthref {
        color: #0955c7;
        font-family: "futurept_book";
        cursor: pointer;
        text-decoration: none;
    }
    .ingamechatmessagehref {
        color: #278fff;
        font-family: "futurept_book";
        cursor: pointer;
        text-decoration: none;
    }
    .newbonklobby_chat_msg_texthref:hover, .ingamechatmessagehref:hover {
        text-decoration: underline;
    }
    .newbonklobby_chat_image_container {
        padding: 4px 0;
        margin-left: 28px;
        display: block;
    }
    .newbonklobby_chat_image {
        max-height: 100px;
        max-width: calc(100% - 40px);
        border-radius: 10px;
        cursor: pointer;
    }
    .newbonklobby_chat_image_showbutton {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
        background-image: url("data:image/svg+xml,%3Csvg width='18px' height='18px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 1 1;
        bottom: 5px;
    }
    .newbonklobby_chat_image_showbutton:hover {
        background-color: rgba(100, 100, 100, 0.2);
    }
    .newbonklobby_chat_image_hidebutton {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
        background-image: url("data:image/svg+xml,%3Csvg width='18px' height='18px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 1 1;
        background-color: rgba(0, 0, 0, 0.2);
        bottom: 5px;
        right: 25px;
        border-radius: 5px;
    }
    .newbonklobby_chat_image_hidebutton:hover {
        background-color: rgba(100, 100, 100, 0.2);
    }
    #imagepreviewcontainer {
        width: 100%;
        height: 100%;
        position: absolute;
        visibility: hidden;
    }
    #imagepreviewbehindblocker {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.70);
    }
    #imagepreview {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 80%;
        max-height: 80%;
    }
    .imagepreviewbutton {
        cursor: pointer;
        position: absolute;
        top: 50px;
        width: 40px;
        height: 40px;
        background-repeat: no-repeat;
        background-position: 5 5;
        background-color: rgba(64, 64, 64, 0.33);
        border: 2px solid rgba(102, 102, 102, 0.33);
        border-radius: 30px;
    }
    .imagepreviewbutton:hover {
        background-color: rgba(90, 90, 90, 0.33);
    }
    #imagepreview_close {
        right: 40px;
        background-image: url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z' fill='%23888'/%3E%3C/svg%3E");
    }
    #imagepreview_opennewtab {
        right: 100px;
        background-image: url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 4C11.4477 4 11 3.55228 11 3C11 2.44772 11.4477 2 12 2L20 2C21.1046 2 22 2.89543 22 4V12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12V5.39343L3.72798 21.6655C3.33746 22.056 2.70429 22.056 2.31377 21.6655C1.92324 21.2749 1.92324 20.6418 2.31377 20.2512L18.565 4L12 4Z' fill='%23888'/%3E%3C/svg%3E");
    }
    #imagepreview_link {
        right: 150px;
        background-image: url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.2218 3.32234C15.3697 1.17445 18.8521 1.17445 21 3.32234C23.1479 5.47022 23.1479 8.95263 21 11.1005L17.4645 14.636C15.3166 16.7839 11.8342 16.7839 9.6863 14.636C9.48752 14.4373 9.30713 14.2271 9.14514 14.0075C8.90318 13.6796 8.97098 13.2301 9.25914 12.9419C9.73221 12.4688 10.5662 12.6561 11.0245 13.1435C11.0494 13.1699 11.0747 13.196 11.1005 13.2218C12.4673 14.5887 14.6834 14.5887 16.0503 13.2218L19.5858 9.6863C20.9526 8.31947 20.9526 6.10339 19.5858 4.73655C18.219 3.36972 16.0029 3.36972 14.636 4.73655L13.5754 5.79721C13.1849 6.18774 12.5517 6.18774 12.1612 5.79721C11.7706 5.40669 11.7706 4.77352 12.1612 4.383L13.2218 3.32234Z' fill='%23888'/%3E%3Cpath d='M6.85787 9.6863C8.90184 7.64233 12.2261 7.60094 14.3494 9.42268C14.7319 9.75083 14.7008 10.3287 14.3444 10.685C13.9253 11.1041 13.2317 11.0404 12.7416 10.707C11.398 9.79292 9.48593 9.88667 8.27209 11.1005L4.73655 14.636C3.36972 16.0029 3.36972 18.219 4.73655 19.5858C6.10339 20.9526 8.31947 20.9526 9.6863 19.5858L10.747 18.5251C11.1375 18.1346 11.7706 18.1346 12.1612 18.5251C12.5517 18.9157 12.5517 19.5488 12.1612 19.9394L11.1005 21C8.95263 23.1479 5.47022 23.1479 3.32234 21C1.17445 18.8521 1.17445 15.3697 3.32234 13.2218L6.85787 9.6863Z' fill='%23888'/%3E%3C/svg%3E");
    }
    #imagepreview_infocontainer {
        position: absolute;
        max-width: 50%;
        top: 50px;
        left: 40px;
        color: #dbdbdb;
        font-family: "futurept_b1";
        text-shadow: 1px 1px 3px black;
    }
    #newbonklobby_chat_actionmenu {
        background-color: #b8cdd0;
        position: absolute;
        padding: 0 5px 5px 5px;
        border-radius: 5px;
        z-index: 99;
        box-shadow: 2px 3px 5px -2px rgb(0 0 0 / 63%);
        display: none;
    }
    .newbonklobby_chat_actionmenu_button {
        margin-top: 5px;
        width: 145px;
    }
    .newbonklobby_chat_actionmenu_overline {
        margin-top: 5px;
        width: 145px;
        height: 1px;
        background-color: #a5acb0;
    }
    .newbonklobby_chat_msgselected {
        background-color: rgba(13, 125, 120, 0.12) !important;
    }
    #ingamechatcontent {
        pointer-events: all;
        overflow-y: scroll;
        max-height: 125px;
        margin-right: 2px;
    }
    #ingamechatbox {
        height: 152px;
        overflow: visible;
    }
    #ingamechatcontent::-webkit-scrollbar {
        background-color: transparent;
        width: 8px;
    }
    #ingamechatcontent::-webkit-scrollbar-track {
        background-color: transparent;
    }
    #ingamechatcontent::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.18);
       border-radius: 4px;
    }
    .ingamechatname, .ingamechatmessage {
        user-select: text;
    }
    .ingamechatreplytext {
        display: block;
        user-select: text;
        margin: 5px 0 -3px 15px;
        font-size: 12px;
        color: #abababba;
    }
    .ingamechattime {
        font-size: 12px;
        color: #ffffff8d;
        margin-left: 3px;
    }
    .ingamechatselected {
        background-color: rgba(13, 125, 120, 0.12) !important;
    }
    #ingamechatactionmenu {
        background-color: rgba(0, 0, 0, 0.2);
        position: absolute;
        padding: 0 5px 5px 5px;
        border: 1px solid white;
        border-radius: 10px;
        z-index: 99;
        box-shadow: 2px 3px 5px -2px rgb(0 0 0 / 63%);
        display: none;
        backdrop-filter: blur(5px);
    }
    .ingamechatactionmenuoverline {
        margin-top: 5px;
        width: 145px;
        height: 1px;
        background-color: white;
    }
    .ingamechatbutton {
        font-family: futurept_b1;
        letter-spacing: 0.4px;
        text-align: center;
        cursor: pointer;
        height: 21px;
        color: white;
        margin-top: 5px;
        pointer-events: all;
        border: 1px solid;
        border-radius: 5px;
    }
    .ingamechatbutton:hover {
        background-color: rgba(0, 0, 0, 0.4);
    }
    .ingamechatbuttondisabled {
        background-color: rgba(209, 82, 82, 0.3);
        pointer-events: none; !important
    }
    .ingamechatimagecontainer {
        padding: 4px 0;
        display: block;
    }
    .ingamechatimage {
        max-height: 70px;
        max-width: calc(70% - 40px);
        border-radius: 6px;
        cursor: pointer;
    }
    .ingamechatimageshowbutton {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 14px;
        height: 14px;
        background-image: url("data:image/svg+xml,%3Csvg width='12px' height='12px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 1 1;
        bottom: 3px;
    }
    .ingamechatimageshowbutton:hover {
        background-color: rgba(100, 100, 100, 0.2);
    }
    .ingamechatimagehidebutton {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 14px;
        height: 14px;
        background-image: url("data:image/svg+xml,%3Csvg width='12px' height='12px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 1 1;
        background-color: rgba(0, 0, 0, 0.2);
        bottom: 3px;
        right: 17px;
        border-radius: 5px;
    }
    .ingamechatimagehidebutton:hover {
        background-color: rgba(100, 100, 100, 0.2);
    }
    `;
    gameDocument.getElementsByTagName('head')[0].appendChild(CSS);

    const linkRegex = /https:\/\/[a-zA-Z0-9\/\._%-]{1,}(?:\?[a-zA-Z0-9\_%=&-]{1,})?/g;
    const chat = gameDocument.getElementById('newbonklobby_chat_content');
    const ingameChat = gameDocument.getElementById('ingamechatcontent');
    let userscriptName = '';
    try {
        userscriptName = new Error().stack.split('\n    at ')[1].match(/.*?userscript.html\?name=.*?\&id=[a-f0-9-]+(?=:)/)[0];
    } catch (e) {}
    let messageCount = 0;

    function showStatusMessage (text, color, ingame) {
        let status = document.createElement("div");
        let scroll = chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 5;
        let message = document.createElement("span");
        message.style.color = color;
        message.classList.add("newbonklobby_chat_status");
        message.appendChild(document.createTextNode(text));
        status.appendChild(message);
        chat.appendChild(status);
        if (chat.childElementCount > 250) {
            chat.removeChild(chat.firstChild);
        }
        if (scroll) {
            chat.scrollTop = chat.scrollHeight;
        }
        if(ingame) {
            let ingameStatus = document.createElement("div");
            let ingameMessage = document.createElement("span");
            ingameMessage.classList.add("ingamechatstatus");
            ingameMessage.appendChild(document.createTextNode(text));
            ingameStatus.appendChild(ingameMessage);
            ingameChat.appendChild(ingameStatus);
            if (ingameChat.childElementCount > 100) {
                ingameChat.removeChild(ingameChat.firstChild);
            }
            ingameChat.scrollTop = ingameChat.scrollHeight;
        }
    }

    function handleRepliedText (message) {
        if(message[0] == ' ') message = message.substring(1);
        if(message[0] != '"') return null;
        let textToReply = message.split('" ');
        if(textToReply.length < 2) return null;
        let reply = textToReply.slice(1).join('" ');
        textToReply = textToReply[0].substring(1).split(': ');
        if(textToReply.length < 2) return null;
        let authorToReply = textToReply[0];
        return {
            reply: reply,
            textToReply: textToReply.slice(1).join(': '),
            authorToReply: authorToReply
        };
    }
    function createHref (textToFind, ingame) {
        let hrefTemplate = ingame? 'hrefGameID' : 'hrefID';
        let messages;
        if(ingame) messages = [...ingameChat.children].filter( child => child.find('ingamechatmessage') ).reverse();
        else messages = [...chat.children].filter( child => child.find('newbonklobby_chat_msg_colorbox') ).reverse();
        for(let i = 1; i < messages.length; i++) {
            let msg = messages[i];
            let text;
            if(ingame) text = msg.find('ingamechatname').textContent + msg.find('ingamechatmessage').textContent;
            else text = msg.find('newbonklobby_chat_msg_name').textContent + msg.find('newbonklobby_chat_msg_txt').textContent;
            // … IS A SINGLE CHARACTER
            if(textToFind.endsWith('…')) {
                if(text.startsWith(textToFind.substring(0, textToFind.length - 1))) {
                    let id = hrefTemplate + messageCount;
                    msg.id = id;
                    return id;
                }
            } else {
                if(textToFind == text) {
                    let id = hrefTemplate + messageCount;
                    msg.id = id;
                    return id;
                }
            }
        }
        return null;
    }
    function createImages (link, onload) {
        let img = new Image();
        let name = link.match(/\/[a-zA-Z0-9_%-]{1,}(?:\.[a-zA-Z0-9_%-]{1,})?(?=[^.a-zA-z0-9_%\-]|$)/g).reverse()[0].substring(1);
        img.onload = function () {
            if(!img.loaded) {
                img.onload = null;
                onload(img, name);
            }
        };
        img.src = link;
    }

    function copyToClipboard (text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy text: ' + text, err);
        });
    }
    function focusChat(isInGameChat) {
        let event = document.createEvent("HTMLEvents");
        event.initEvent('keydown');
        event.keyCode = 13;
        gameDocument.dispatchEvent(event);
    }

    let imagePreviewContainer = document.createElement('div');
    imagePreviewContainer.id = 'imagepreviewcontainer';
    let imagePreviewBehindBlocker = document.createElement('div');
    imagePreviewBehindBlocker.id = 'imagepreviewbehindblocker';
    // image preview close button
    let imagePreviewClose = document.createElement('div');
    imagePreviewClose.classList.add('imagepreviewbutton');
    imagePreviewClose.id = 'imagepreview_close';
    imagePreviewBehindBlocker.onclick = imagePreviewClose.onclick = function () {
        gameWindow.anime({
            targets: imagePreviewContainer,
            opacity: 0,
            duration: 100,
            easing: "easeOutCubic",
            complete: () => {
                imagePreviewContainer.style.visibility = 'hidden';
            }
        });
        let imagePreview = gameDocument.getElementById('imagepreview');
        if(!imagePreview) return;
        gameWindow.anime({
            targets: imagePreview,
            scale: 0.8,
            duration: 100,
            easing: "easeOutCubic",
        });
    };
    // open in a new tab button
    let imagePreviewTab = document.createElement('div');
    imagePreviewTab.classList.add('imagepreviewbutton');
    imagePreviewTab.id = 'imagepreview_opennewtab';
    // '<a>' element just to have 'target' attribute
    let tabA = document.createElement('a');
    tabA.target = '_blank';
    imagePreviewTab.onclick = () => tabA.click();

    let imagePreviewLink = document.createElement('div');
    imagePreviewLink.classList.add('imagepreviewbutton');
    imagePreviewLink.id = 'imagepreview_link';
    imagePreviewLink.onclick = () => {
        copyToClipboard(gameDocument.getElementById('imagepreview').src);
        imagePreviewLink.style.backgroundColor = 'rgba(192, 192, 192, 0.33)';
        gameWindow.anime({
            targets: imagePreviewLink,
            backgroundColor: 'rgba(64, 64, 64, 0.33)',
            duration: 800,
            easing: "easeOutCubic",
            complete: () => imagePreviewLink.removeAttribute('style')
        });
    };
    let imageInfo = document.createElement('div');
    imageInfo.id = 'imagepreview_infocontainer';

    imagePreviewContainer.appendChild(imagePreviewBehindBlocker);
    imagePreviewContainer.appendChild(imagePreviewClose);
    imagePreviewContainer.appendChild(imagePreviewTab);
    imagePreviewContainer.appendChild(imagePreviewLink);
    imagePreviewContainer.appendChild(imageInfo);

    gameDocument.getElementById('newbonkgamecontainer').appendChild(imagePreviewContainer);

    let contextMenu = null;

    // context menu
    let createButton = function (text, ingame) {
        let button = document.createElement('div');
        button.textContent = text;
        if(ingame) {
            button.classList.add('ingamechatbutton');
            contextMenu.appendChild(button);
        }
        else {
            button.classList.add('brownButton');
            button.classList.add('brownButton_classic');
            button.classList.add('buttonShadow');
            button.classList.add('newbonklobby_chat_actionmenu_button');
            button.classList.add('newbonklobby_chat_actionmenu_buttonoverlined');
            contextMenu.appendChild(button);
        }
        return button;
    };
    let createLine = function (ingame) {
        let line = document.createElement('div');
        if(ingame) {
            line.classList.add('ingamechatactionmenuoverline');
            ingameContextMenuContainer.appendChild(line);
        }
        else {
            line.classList.add('newbonklobby_chat_actionmenu_overline');
            contextMenu.appendChild(line);
        }
    };

    const actions = {
        copyname: (content) => {
            let button = createButton('Copy Username', content.ingame);
            button.onclick = () => {
                copyToClipboard(content.name);
                closeContextMenu();
            }
        },
        copymessage: (content) => {
            let button = createButton('Copy Message', content.ingame);
            button.onclick = () => {
                copyToClipboard(`[${content.time}] ${content.name}: ${content.message}`);
                closeContextMenu();
            }
        },
        copytext: (content) => {
            let button = createButton('Copy Text', content.ingame);
            button.onclick = () => {
                copyToClipboard(content.message);
                closeContextMenu();
            }
        },
        kickoverline: (content) => createLine(content.ingame),
        kick: (content) => {
            let button = createButton('Kick ' + content.name, content.ingame);
            let isHost = !gameDocument.getElementById('newbonklobby_startbutton').classList.contains('brownButtonDisabled');
            let id = playerList.findIndex(user => user && user.userName == content.name);
            if(isHost && id != selfId) {
                button.onclick = () => {
                    if(button.textContent.startsWith('Kick ')) button.textContent = 'Sure?';
                    else {
                        if(id == -1) showStatusMessage('* Player not found.', '#b53030', content.ingame);
                        else send(`42[9,{"banshortid":${id},"kickonly":true}]`);
                        closeContextMenu();
                    }
                }
            }
            else {
                if(content.ingame) button.classList.add('ingamechatbuttondisabled');
                else button.classList.add('brownButtonDisabled');
            }
        },
        ban: (content) => {
            let button = createButton('Ban ' + content.name, content.ingame);
            let isHost = !gameDocument.getElementById('newbonklobby_startbutton').classList.contains('brownButtonDisabled');
            let id = playerList.findIndex(user => user && user.userName == content.name);
            if(isHost && id != selfId) {
                button.onclick = () => {
                    if(button.textContent.startsWith('Ban ')) button.textContent = 'Sure?';
                    else {
                        if(id == -1) showStatusMessage('* Player not found.', '#b53030', content.ingame);
                        else send(`42[9,{"banshortid":${id}}]`);
                        closeContextMenu();
                    }
                }
            }
            else {
                if(content.ingame) button.classList.add('ingamechatbuttondisabled');
                else button.classList.add('brownButtonDisabled');
            }
        },
        pingoverline: (content) => createLine(content.ingame),
        ping: (content) => {
            let button = createButton('Ping', content.ingame);
            button.onclick = () => {
                focusChat();
                if(content.ingame) gameDocument.getElementById('ingamechatinputtext').value += `@${content.name}`;
                else gameDocument.getElementById('newbonklobby_chat_input').value += `@${content.name}`;
                closeContextMenu();
            }
        },
        reply: (content) => {
            let button = createButton('Reply', content.ingame);
            button.onclick = () => {
                let text = content.message;
                // … IS A SINGLE CHARACTER
                if(text.length > 28) text = text.substring(0, 29) + '…';
                focusChat();
                if(content.ingame) gameDocument.getElementById('ingamechatinputtext').value = `"${content.name}: ${text}" `;
                else gameDocument.getElementById('newbonklobby_chat_input').value = `"${content.name}: ${text}" `;
                closeContextMenu();
            }
        }
    }

    let hideChatAfterClose = false;
    function openContextMenu (content, actions, position) {
        closeContextMenu();
        contextMenu = document.createElement('div');
        contextMenu.oncontextmenu = () => false;
        if(content.ingame) {
            contextMenu.id = 'ingamechatactionmenu';
            gameDocument.getElementById('ingamechatbox').appendChild(contextMenu);
            let observer;
            let callback = (mutation) => {
                if(mutation[0].target.style.visibility == 'hidden') {
                    hideChatAfterClose = true;
                    mutation[0].target.style.visibility = 'inherit';
                }
                observer.disconnect();
            }
            observer = new MutationObserver(callback);
            observer.observe(gameDocument.getElementById('ingamechatbox'), {attributes: true});
        }
        else {
            contextMenu.id = 'newbonklobby_chat_actionmenu';
            gameDocument.getElementById('newbonklobby_chatbox').appendChild(contextMenu);
        }
        let keys = Object.keys(actions);
        let players = [];
        for(let i = 0; i < keys.length; i++) {
            actions[keys[i]](content);
        }
        let rect = content.element.getBoundingClientRect();
        let chatRect;
        if(content.ingame) chatRect = gameDocument.getElementById('ingamechatbox').getBoundingClientRect();
        else chatRect = gameDocument.getElementById('newbonklobby_chatbox').getBoundingClientRect();
        contextMenu.style.display = 'unset';
        contextMenu.style.left = position.x - rect.x + 5;
        contextMenu.style.top = position.y - chatRect.top - (contextMenu.clientHeight * 0.4);
        if(contextMenu.getBoundingClientRect().bottom - chatRect.bottom > -10) {
            contextMenu.style.top = chatRect.height - contextMenu.clientHeight - 10;
        }
    }

    function closeContextMenu () {
        if(contextMenu) contextMenu.parentNode.removeChild(contextMenu);
        contextMenu = null;
        if(hideChatAfterClose) {
            hideChatAfterClose = false;
            gameDocument.getElementById('ingamechatbox').style.visibility = 'hidden';
        }
        [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
        [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
    }

    function openImagePreview (image) {
        imagePreviewContainer.style.visibility = 'inherit';
        imagePreviewContainer.style.opacity = '0';
        gameWindow.anime({
            targets: imagePreviewContainer,
            opacity: 1,
            duration: 175,
            easing: "easeOutCubic",
        });
        if(gameDocument.getElementById('imagepreview')) gameDocument.getElementById('imagepreview').remove();
        let imagePreview = image.cloneNode();
        imagePreview.classList.remove('newbonklobby_chat_image');
        imagePreview.id = 'imagepreview';
        imagePreviewContainer.insertBefore(imagePreview, imagePreviewClose);
        imagePreview.style.transform = 'scale(0.8)';
        gameWindow.anime({
            targets: imagePreview,
            scale: 1,
            duration: 175,
            easing: "easeOutCubic",
        });
        tabA.href = image.src;

        while(imageInfo.firstChild) imageInfo.removeChild(imageInfo.firstChild);
        let info = [
            'Link: ' + image.src,
            'Name: ' + image.src.match(/\/[a-zA-Z0-9_%-]{1,}(?:\.[a-zA-Z0-9_%-]{1,})?(?=[^.a-zA-z0-9_%\-]|$)/g).reverse()[0].substring(1),
            'Size: ' + image.naturalWidth + 'x' + image.naturalHeight
        ];
        info.forEach( info => {
            let div = document.createElement('div');
            div.textContent = info;
            imageInfo.appendChild(div);
        });
    }

    let injected = false;
    let originalSend = gameWindow.WebSocket.prototype.send;
    gameWindow.WebSocket.prototype.send = function(args) {
        if(this.url.includes("socket.io/?EIO=3&transport=websocket&sid=") && !injected){
            // information about packets (Aug 25, 2023): https://github.com/UnmatchedBracket/DemystifyBonk/blob/main/Packets.md
            send = (args) => {
                this.send(args);
            };
            injected = true;
            let originalReceive = this.onmessage;
            this.onmessage = function(args){
                let packet = null;
                if(args.data.indexOf('[') != -1) packet = JSON.parse(args.data.substring(args.data.indexOf('[')));
                else packet = [0, parseInt(args)];
                if(packet[0] == 0) {
                    if(packet[1] == 41) {
                        playerList = null;
                        injected = false;
                        selfId = -1;
                    }
                }
                else if(packet[0] == 2) {
                    playerList = [{
                        userName: gameDocument.getElementById('pretty_top_name').textContent,
                        guest: gameDocument.getElementById('pretty_top_level').textContent == 'Guest',
                        level: gameDocument.getElementById('pretty_top_level').textContent == 'Guest'? 0 : parseInt(gameDocument.getElementById('pretty_top_level').textContent),
                        ready: false,
                        team: 1,
                        avatar: null,
                        ping: 105,
                    }];
                    selfId = 0;
                }
                else if(packet[0] == 3) {
                    playerList = packet[3];
                    selfId = packet[1];
                }
                else if(packet[0] == 4) {
                    playerList.push({
                        userName: packet[3],
                        guest: packet[4],
                        level: packet[5],
                        ready: false,
                        team: packet[6],
                        avatar: null,
                        ping: 105,
                    });
                }
                else if(packet[0] == 5) {
                    playerList[packet[1]] = null;
                }
                return originalReceive.call(this, args);
            };
            let originalClose = this.onclose;
            this.onclose = function(args){
                injected = false;
                return originalClose.call(this, args);
            };
        }
        return originalSend.call(this, args);
    };

    let originalRemoveChild = chat.removeChild;
    chat.removeChild = function (args) {
        let stack = new Error().stack;
        if(stack.includes('https://bonk.io/js/socketio') && chat.childElementCount <= 250) return;
        originalRemoveChild.call(this, args);
        if(chat.firstChild && chat.firstChild.find('newbonklobby_chat_msg_colorbox')) {
            chat.firstChild.find('newbonklobby_chat_msg_colorbox').removeAttribute('style');
            chat.firstChild.find('newbonklobby_chat_msg_name').removeAttribute('style');
            chat.firstChild.find('newbonklobby_chat_msg_txt').classList.remove('newbonklobby_chat_msg_txtright');
        }
    }

    let originalAppendChild = chat.appendChild;
    chat.appendChild = function (args) {
        messageCount++;
        const lastMessage = this.lastChild;
        originalAppendChild.call(this, args);
        const newMessage = this.lastChild;

        let notified = false;

        newMessage.find = (name) => {
            return newMessage.getElementsByClassName(name)[0] || null;
        };
        newMessage.highlight = function (name) {
            this.style.backgroundColor = 'rgba(145, 154, 157, 0.5)';
            gameWindow.anime({
                targets: this,
                backgroundColor: 'rgba(145, 154, 157, 0)',
                delay: 250,
                duration: 500,
                easing: "easeOutCubic",
                complete: () => {
                    this.style.backgroundColor = '';
                }
            });
        };

        newMessage.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
        });
        newMessage.addEventListener('mouseout', function () {
            this.removeAttribute('style');
        });
        newMessage.oncontextmenu = () => false;

        if(newMessage.children[0] && newMessage.children[0].classList.contains('newbonklobby_chat_status')) {
            let text = newMessage.textContent;
            if(text == '* You\'re doing that too much!') {
                //script.informRatelimited();
            }
            else if(text.startsWith('* ') && text.endsWith(' has joined the game ')) {
                newMessage.addEventListener('mousedown', (event) => {
                    if(event.which != 3) return;
                    [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
                    newMessage.classList.add('newbonklobby_chat_msgselected');
                    const lessActions = { kick: actions.kick, ban: actions.ban };
                    openContextMenu(
                        {
                            message: newMessage.textContent,
                            name: text.substring(0, text.length - 21).substring(2),
                            time: new Date().toLocaleTimeString(),
                            element: newMessage,
                            ingame: false
                        },
                        lessActions,
                        event);
                    let documentMouseEvent = (event) => {
                        if(event.which == 3) {
                            for(let i = 0; i < chat.children.length; i++) {
                                let element = chat.children[i];
                                if(element.find('newbonklobby_chat_msg_colorbox') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                    return;
                                }
                            }
                        }
                        if(contextMenu && contextMenu.contains(event.target)) return;
                        gameDocument.removeEventListener('mousedown', documentMouseEvent);
                        closeContextMenu();
                    }
                    gameDocument.addEventListener('mousedown', documentMouseEvent);
                });
                //script.informRatelimited();
            }
            return;
        }

        const originalNewAppendChild = newMessage.appendChild;
        newMessage.appendChild = function (element) {
            if(element.className == 'newbonklobby_chat_msg_colorbox') {
                // create img element to avoid some bugs
                let img = document.createElement('div');
                img.className = 'newbonklobby_chat_msg_avatar';
                img.style.width = '12px';
                img.style.height = '12px';
                element.appendChild(img);
                let observer;
                let callback = (childList) => {
                    if(childList.length == 1) element.removeChild(element.firstChild);
                    observer.disconnect();
                }
                observer = new MutationObserver(callback);
                observer.observe(element, {childList: true});
            }
            else if(element.className == 'newbonklobby_chat_msg_txt') {
                let playerName = newMessage.find('newbonklobby_chat_msg_name');
                playerName.classList.add('newbonklobby_chat_msg_topname');
                playerName.textContent = playerName.textContent.substring(0, playerName.textContent.length - 2);
                let reply = handleRepliedText(element.textContent);
                if(!reply && lastMessage && !lastMessage.find('newbonklobby_chat_status') && lastMessage.find('newbonklobby_chat_msg_name') && lastMessage.find('newbonklobby_chat_msg_name').textContent == playerName.textContent) {
                    // if message is from the same person, do not display the name and avatar
                    newMessage.find('newbonklobby_chat_msg_colorbox').style.display = 'none';
                    newMessage.find('newbonklobby_chat_msg_name').style.display = 'none';
                    element.classList.add('newbonklobby_chat_msg_txtright');
                } else if(reply) {
                    // creating the message at the top
                    let text = document.createElement('div');
                    let textA = document.createElement('a');
                    textA.classList.add('newbonklobby_chat_msg_replytexthref');
                    let href = createHref(`${reply.authorToReply}${reply.textToReply}`);
                    if(href) {
                        textA.href = '#' + href;
                        let element = [...chat.children].find(child => child.id == href);
                        textA.onclick = () => element.highlight();
                    }
                    text.classList.add('newbonklobby_chat_msg_texttoreply');
                    textA.textContent = `" ${reply.authorToReply}: ${reply.textToReply} "`;
                    text.appendChild(textA);
                    element.textContent = reply.reply;
                    let arrow = document.createElement('div');
                    arrow.classList.add('newbonklobby_chat_msg_arrowtoreply');
                    arrow.appendChild(text);
                    let div = document.createElement('div');
                    div.appendChild(arrow);
                    div.appendChild(text);
                    newMessage.insertBefore(div, newMessage.firstChild);
                    if(reply.authorToReply == playerList[selfId].userName && settings.notify && settings.notifyOnReply && Notification.permission != 'denied' && !notified && newMessage.find('newbonklobby_chat_msg_name').textContent != playerList[selfId].userName) {
                        new Notification(element.textContent);
                        notified = true;
                    }
                }

                if (element.textContent.includes('@' + playerList[selfId].userName) && settings.notify && Notification.permission != 'denied' && !notified && newMessage.find('newbonklobby_chat_msg_name').textContent != playerList[selfId].userName) {
                    new Notification(element.textContent);
                    notified = true;
                }

                newMessage.addEventListener('mousedown', (event) => {
                    if(event.which != 3) return;
                    [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
                    this.classList.add('newbonklobby_chat_msgselected');
                    openContextMenu(
                        {
                            message: newMessage.find('newbonklobby_chat_msg_txt').textContent,
                            name: newMessage.find('newbonklobby_chat_msg_name').textContent,
                            time: newMessage.find('newbonklobby_chat_msg_time').textContent,
                            element: newMessage,
                            ingame: false
                        },
                        actions,
                        event);
                    let documentMouseEvent = (event) => {
                        if(event.which == 3) {
                            for(let i = 0; i < chat.children.length; i++) {
                                let element = chat.children[i];
                                if(element.find('newbonklobby_chat_msg_colorbox') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                    return;
                                }
                            }
                        }
                        if(contextMenu && contextMenu.contains(event.target)) return;
                        gameDocument.removeEventListener('mousedown', documentMouseEvent);
                        closeContextMenu();
                    }
                    gameDocument.addEventListener('mousedown', documentMouseEvent);
                });

                let links = element.textContent.match(linkRegex);
                try{
                    if(links && links.length) {
                        let content = element.textContent.substring();
                        element.textContent = '';
                        for(let i = 0; i < links.length; i++) {
                            let index = content.indexOf(links[i]);
                            let text = new Text(content.substring(0, index));
                            if(text.length > 0) element.appendChild(text);
                            let link = document.createElement('a');
                            link.classList.add('newbonklobby_chat_msg_texthref');
                            link.href = links[i];
                            link.target = '_blank';
                            link.textContent = links[i];
                            element.appendChild(link);
                            content = content.substring(index + links[i].length);
                            if(i == 0) {
                                let appendImage = function (image, name) {
                                    link.removeAttribute('href');
                                    link.removeAttribute('target');
                                    link.textContent = name;
                                    link.onclick = () => {
                                        openImagePreview(image);
                                    };

                                    image.onclick = () => {
                                        openImagePreview(image);
                                    };

                                    let imageDiv = document.createElement('div');
                                    let buttonDiv = document.createElement('div');
                                    let button = document.createElement('div');

                                    imageDiv.classList.add('newbonklobby_chat_image_container');
                                    image.classList.add('newbonklobby_chat_image');
                                    if(settings.autoShowImages) {
                                        button.classList.add('newbonklobby_chat_image_hidebutton');
                                    } else {
                                        button.classList.add('newbonklobby_chat_image_showbutton');
                                        image.style.display = 'none';
                                    }

                                    button.onclick = () => {
                                        if(button.classList.contains('newbonklobby_chat_image_showbutton')) {
                                            button.classList.remove('newbonklobby_chat_image_showbutton');
                                            button.classList.remove('brownButton');
                                            button.classList.remove('brownButton_classic');
                                            button.classList.remove('buttonShadow');

                                            button.classList.add('newbonklobby_chat_image_hidebutton');

                                            image.style.display = '';
                                        } else {
                                            button.classList.remove('newbonklobby_chat_image_hidebutton');

                                            button.classList.add('newbonklobby_chat_image_showbutton');
                                            button.classList.add('brownButton');
                                            button.classList.add('brownButton_classic');
                                            button.classList.add('buttonShadow');

                                            image.style.display = 'none';
                                        }
                                    };

                                    imageDiv.appendChild(image);
                                    imageDiv.appendChild(button);
                                    newMessage.appendChild(imageDiv);
                                };
                                createImages(links[0], appendImage);
                            }
                        }
                        // pushing the remainder of textContent
                        if(content.length > 0) element.appendChild(new Text(content));
                    }
                }
                catch(e) {
                    console.error(e);
                }
                originalNewAppendChild.call(this, element);
                let time = document.createElement('span');
                time.classList.add('newbonklobby_chat_msg_time');
                time.textContent = new Date().toLocaleTimeString();
                newMessage.appendChild(time);
                return;
            }
            originalNewAppendChild.call(this, element);
            return;
        };
    };



    originalAppendChild = ingameChat.appendChild;
    ingameChat.appendChild = function (args) {
        originalAppendChild.call(this, args);
        const newMessage = this.lastChild;
        newMessage.find = (name) => {
            return newMessage.getElementsByClassName(name)[0] || null;
        };
        newMessage.highlight = function (name) {
            this.style.backgroundColor = 'rgba(145, 154, 157, 0.5)';
            gameWindow.anime({
                targets: this,
                backgroundColor: 'rgba(145, 154, 157, 0)',
                delay: 250,
                duration: 500,
                easing: "easeOutCubic",
                complete: () => {
                    this.style.backgroundColor = '';
                }
            });
        };

        newMessage.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
        });
        newMessage.addEventListener('mouseout', function () {
            this.removeAttribute('style');
        });
        newMessage.oncontextmenu = () => false;

        if(newMessage.children[0] && newMessage.children[0].classList.contains('ingamechatstatus')) {
            let text = newMessage.textContent;
            if(text.startsWith('* ') && text.endsWith(' has joined the game.')) {
                newMessage.addEventListener('mousedown', (event) => {
                    [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
                    newMessage.classList.add('ingamechatselected');
                    if(event.which != 3) return;
                    const lessActions = { kick: actions.kick, ban: actions.ban };
                    openContextMenu(
                        {
                            message: newMessage.textContent,
                            name: text.substring(0, text.length - 21).substring(2),
                            time: new Date().toLocaleTimeString(),
                            element: newMessage,
                            ingame: true
                        },
                        lessActions,
                        event);
                    let documentMouseEvent = (event) => {
                        if(event.which == 3) {
                            for(let i = 0; i < chat.children.length; i++) {
                                let element = chat.children[i];
                                if(element.find('newbonklobby_chat_msg_colorbox') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                    return;
                                }
                            }
                        }
                        if(contextMenu && contextMenu.contains(event.target)) return;
                        gameDocument.removeEventListener('mousedown', documentMouseEvent);
                        closeContextMenu();
                    }
                    gameDocument.addEventListener('mousedown', documentMouseEvent);
                });
                //script.informRatelimited();
            }
            return;
        }

        let msgTextElement = args.find('ingamechatmessage');
        if(msgTextElement) {
            let reply = handleRepliedText(msgTextElement.textContent);
            if(reply) {
                let text = document.createElement('div');
                let textA = document.createElement('a');
                text.classList.add('ingamechatreplytext');
                let href = createHref(`${reply.authorToReply}${reply.textToReply}`, true);
                if(href) {
                    textA.href = '#' + href;
                    let element = [...chat.children].find(child => child.id == href);
                    textA.onclick = () => element.highlight();
                }
                textA.textContent = `Replied " ${reply.authorToReply}: ${reply.textToReply} "`;
                msgTextElement.textContent = ' ' + reply.reply;

                text.appendChild(textA);
                args.insertBefore(text, args.firstChild);
            }
            newMessage.addEventListener('mousedown', function (event) {
                if(event.which != 3) return;
                [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
                this.classList.add('ingamechatselected');
                openContextMenu(
                    {
                        message: newMessage.find('ingamechatmessage').textContent.substring(1),
                        name: newMessage.find('ingamechatname').textContent.substring(0, newMessage.find('ingamechatname').textContent.length - 1),
                        time: newMessage.find('ingamechattime').textContent,
                        element: newMessage,
                        ingame: true
                    },
                    actions,
                    event);
                let documentClickEvent = (event) => {
                    if(event.which == 3) {
                        for(let i = 0; i < ingameChat.children.length; i++) {
                            let element = ingameChat.children[i];
                            if(element.find('ingamechatmessage') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                return;
                            }
                        }
                    }
                    if(contextMenu && contextMenu.contains(event.target)) return;
                    gameDocument.removeEventListener('mousedown', documentClickEvent);
                    closeContextMenu();
                }
                gameDocument.addEventListener('mousedown', documentClickEvent);
            });
            let links = msgTextElement.textContent.match(linkRegex);
            try{
                if(links && links.length) {
                    let content = msgTextElement.textContent.substring();
                    msgTextElement.textContent = '';
                    for(let i = 0; i < links.length; i++) {
                        let index = content.indexOf(links[i]);
                        let text = new Text(content.substring(0, index));
                        if(text.length > 0) msgTextElement.appendChild(text);
                        let link = document.createElement('a');
                        link.classList.add('ingamechatmessagehref');
                        link.href = links[i];
                        link.target = '_blank';
                        link.textContent = links[i];
                        msgTextElement.appendChild(link);
                        content = content.substring(index + links[i].length);
                        if(i == 0) {
                            let appendImage = function (image, name) {
                                link.removeAttribute('href');
                                link.removeAttribute('target');
                                link.textContent = name;
                                link.onclick = () => {
                                    openImagePreview(image);
                                };

                                image.onclick = () => {
                                    openImagePreview(image);
                                };

                                let imageDiv = document.createElement('div');
                                let buttonDiv = document.createElement('div');
                                let button = document.createElement('div');

                                imageDiv.classList.add('ingamechatimagecontainer');
                                image.classList.add('ingamechatimage');
                                if(settings.autoShowImages && settings.ingameImages) {
                                    button.classList.add('ingamechatimagehidebutton');
                                } else {
                                    button.classList.add('ingamechatimageshowbutton');
                                    image.style.display = 'none';
                                }

                                button.onclick = () => {
                                    if(button.classList.contains('ingamechatimageshowbutton')) {
                                        button.classList.remove('ingamechatimageshowbutton');
                                        button.classList.remove('ingamechatbutton');
                                        button.classList.add('ingamechatimagehidebutton');
                                        image.style.display = '';
                                    } else {
                                        button.classList.remove('ingamechatimagehidebutton');
                                        button.classList.add('ingamechatimageshowbutton');
                                        button.classList.add('ingamechatbutton');
                                        image.style.display = 'none';
                                    }
                                };

                                imageDiv.appendChild(image);
                                imageDiv.appendChild(button);
                                newMessage.appendChild(imageDiv);
                            };
                            createImages(links[0], appendImage);
                        }
                    }
                    // pushing the remainder of textContent
                    if(content.length > 0) msgTextElement.appendChild(new Text(content));
                }
            }
            catch(e) {
                console.error(e);
            }
            let time = document.createElement('span');
            time.classList.add('ingamechattime');
            time.textContent = new Date().toLocaleTimeString();
            newMessage.appendChild(time);
        }
    }

    let callback = function (mutationList) {
        [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
        [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
        closeContextMenu();
    };
    let bonkLobbyObserver = new MutationObserver(callback);
    bonkLobbyObserver.observe(gameDocument.getElementById('newbonklobby'), {attributes: true});

    function onPlayerentry (element) {
        let pingButton = document.createElement('div');
        pingButton.className = 'newbonklobby_playerentry_menu_button brownButton brownButton_classic buttonShadow';
        pingButton.textContent = 'Ping';
        pingButton.onclick = () => {
            focusChat();
            let name = [...gameDocument.getElementById('newbonklobby_playerbox').getElementsByClassName('newbonklobby_playerentry_menuhighlighted')]
            .concat([...gameDocument.getElementById('newbonklobby_specbox').getElementsByClassName('newbonklobby_playerentry_menuhighlighted')])[0]
            .getElementsByClassName('newbonklobby_playerentry_name')[0].textContent;
            gameDocument.getElementById('bonkiocontainer').click();
            if(gameDocument.getElementById('newbonklobby').style.display != 'block') gameDocument.getElementById('ingamechatinputtext').value += `@${name}`;
            else gameDocument.getElementById('newbonklobby_chat_input').value += `@${name}`;
        }
        element.appendChild(pingButton);
    }
    let originalPlayingAppend = gameDocument.getElementById('newbonklobby_playerbox').appendChild;
    gameDocument.getElementById('newbonklobby_playerbox').appendChild = async function (args) {
        await originalPlayingAppend.call(this, args);
        if(args.className == 'newbonklobby_playerentry_menu') onPlayerentry(args);
    };
    let originalSpectatingAppend = gameDocument.getElementById('newbonklobby_specbox').appendChild;
    gameDocument.getElementById('newbonklobby_specbox').appendChild = async function (args) {
        await originalSpectatingAppend.call(this, args);
        if(args.className == 'newbonklobby_playerentry_menu') onPlayerentry(args);
    };
});













