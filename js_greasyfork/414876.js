// ==UserScript==
// @name         Live Chat Mod | CALIBER
// @description  Sticky Moderator chat with Additional highlight commands (For Dark Theme)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       CALIBER
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414876/Live%20Chat%20Mod%20%7C%20CALIBER.user.js
// @updateURL https://update.greasyfork.org/scripts/414876/Live%20Chat%20Mod%20%7C%20CALIBER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    // ================
    // my config
    // ================
    // font size
    var chatFontSize = 15;
    // if true, add char frame to message
    var isEnableCharFrame = false;
    // if true, author name is hide
    var isHideAuthorName = false;
    // if true, author name is display to right side in chat window
    var isAuthorNameRightSide = true;
    var authorNameMaxWidth = 100;
    // if true, user thumbnail is hide
    var isHideThumbnail = false;
    // if true, member badge is hide
    var isHideBadge = false;
    // if true, input panel is hide (you can't post chat / super chat)
    var isHideFooter = false;
    // if true, header is hide
    var isHideHeader = true;
    // if true, show/hidden toggle button is hide
    var isHideToggleButton = false;
    // if true, common emotes is hide
    var isHideCommonEmotes = true;
    // if false, moderator chat is not fixed to bottom
    var isFixModarator = true;
    // number of seconds moderator chat is display
    var moderatorChatTimeout = 20;
*/

    // ================
    // config
    // ================
    // font size
    var chatFontSize = 13;
    // if true, add char frame to message
    var isEnableCharFrame = false;
    // if true, author name is hide
    var isHideAuthorName = false;
    // if true, author name is display to right side in chat window
    var isAuthorNameRightSide = true;
  
    var authorNameMaxWidth = 100;
    // if true, user thumbnail is hide
    var isHideThumbnail = false;
    // if true, member badge is hide
    var isHideBadge = false;
    // if true, input panel is hide (you can't post chat / super chat)
    var isHideFooter = false;
    // if true, header is hide
    var isHideHeader = false;
    // if true, show/hidden toggle button is hide
    var isHideToggleButton = false;
    // if true, common emotes is hide
    var isHideCommonEmotes = true;
    // if false, moderator chat is not fixed to bottom
    var isFixModarator = true;
    // number of seconds moderator chat is display
    var moderatorChatTimeout = 20;
    // ================

    setTimeout(function () {
        var stylesheet = "";

        // bold, font-size
        stylesheet += "#message.yt-live-chat-text-message-renderer { font-weight: bold; font-size: " + chatFontSize +"px; }";
        if (isEnableCharFrame) {
            stylesheet += "#message.yt-live-chat-text-message-renderer { color: #ffffff; letter-spacing : 4px; text-shadow : 2px 2px 1px #003366, -2px 2px 1px #003366, 2px -2px 1px #003366, -2px -2px 1px #003366, 2px 0px 1px #003366, 0px  2px 1px #003366, -2px  0px 1px #003366, 0px -2px 1px #003366; }";
            stylesheet += "yt-live-chat-renderer { background: #0000; } #item-scroller { overflow-y: hidden !important; }";
        }

        // simple #input-panel styles
        stylesheet += "yt-live-chat-message-input-renderer { padding: 4px 16px; }";
        // stylesheet += "#input-panel #container { position: relative; }";
        // stylesheet += "#input-panel #container > #buttons { position: absolute; top: 0; right: 0; transform: scale(0.8); margin: 0; }";

        if (isHideAuthorName) {
            stylesheet += "#author-name.yt-live-chat-author-chip { display: none; }";
        } else if (isAuthorNameRightSide) {
            stylesheet += "#content #author-name.yt-live-chat-author-chip { position: absolute; right: 10px; top: 0px; opacity: 0.7; transform: scale(0.8); font-size: 16px; }";
        } else {
            stylesheet += "#author-name.yt-live-chat-author-chip { max-width: " + authorNameMaxWidth + "px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }";
        }
        if (isHideThumbnail) {
            stylesheet += "#author-photo { display: none !important; }";
        }
        if (isHideBadge) {
            stylesheet += "#chat-badges { display: none !important; }";
        }
        if (isHideFooter) {
            stylesheet += "#panel-pages { display: none !important; }";
        }
        if (isHideHeader) {
            stylesheet += "yt-live-chat-header-renderer { display: none !important; }";
        }
        if (isHideToggleButton) {
            stylesheet += "#show-hide-button.ytd-live-chat-frame { display: none !important; }";
        }
        if (isHideCommonEmotes) {
            stylesheet += "yt-emoji-picker-renderer #category-buttons { display: none !important; }";
            var emoteCategories = ["UCkszU2WH9gy1mb0dV-11UJg/CIW60IPp_dYCFcuqTgodEu4IlQ", "😀", "🐵", "🍇", "🌍", "🎃", "👓", "🏧"];
            for (var i = 0; i < emoteCategories.length; i++) {
                stylesheet += "[aria-activedescendant='" + emoteCategories[i] + "'] { display: none; }";
            }
        }

        // moderator chats is fixed to bottom in chat window
        stylesheet += "#moderator-chat-container { position: absolute; bottom: 0; background: #222; left: 0; right: 0; z-index: 10000; padding-top: 10px; border-top: 1px solid #9f9f9f; }";

        // reload button
        stylesheet += "#chat-reload-button { display: inline-block; position: absolute; right: 0; bottom: 0; color: #fff; background: #1E90FF; opacity: 0; padding: 3px; transition: opacity .2s linear; cursor: pointer; z-index: 10001; }";
        stylesheet += "yt-live-chat-app:hover #chat-reload-button { opacity: 1; }";
				
      	// CALIBER Custom Styles
      	stylesheet += ".yt-live-chat-author-badge-renderer yt-icon svg {color:#14ea02!important;} #message{display: inline-block!important; max-width: 80%;} #content{display:flex; align-items: center;}#author-name.member.yt-live-chat-author-chip {color: #ffa9f2;  opacity: 1.0 !important;}";
      	stylesheet += "yt-live-chat-author-chip .moderator {color:#14ea02!important;}";
      	stylesheet += ".yt-live-chat-moderation-message-renderer yt-formatted-string .yt-formatted-string{color: #ca0000;}";
        stylesheet += "#items.yt-live-chat-item-list-renderer > .yt-live-chat-item-list-renderer:not(:first-child){border-bottom: 1px solid #80808021;} #deleted-state{color: red!important; padding-left: 5px;}";
      
        // apply style
        var $style = document.createElement("style");
        $style.innerText = stylesheet;
        document.body.appendChild($style);

        // fix moderator chat
        var $container = document.createElement("div");
        $container.id = "moderator-chat-container";
        document.querySelector("yt-live-chat-item-list-renderer #contents").appendChild($container);

        // reload button
        var $reload = document.createElement("a");
        $reload.id = "chat-reload-button";
        $reload.innerText = "Reload";
        $reload.onclick = reloadButtonOnClick;
        document.querySelector("yt-live-chat-app > #contents").appendChild($reload);

        setInterval(observeModerator, 2000);
    }, 5000);

    function reloadButtonOnClick() {
        location.href = location.href;
    }

    function appendModeratorChat($chat) {
        document.querySelector("#moderator-chat-container").appendChild($chat);
        setTimeout(function () {
            $chat.remove();
        }, moderatorChatTimeout * 1000);
    }
		


    function observeModerator() {
        var $chats;
        if (isFixModarator) {
            $chats = document.querySelectorAll("yt-live-chat-text-message-renderer[author-type='moderator'], yt-live-chat-text-message-renderer[author-type='owner']");
        } else {
            $chats = document.querySelectorAll("yt-live-chat-text-message-renderer[author-type='owner']");
        }
        for (var i = 0; i < $chats.length; i++) {
            appendModeratorChat($chats[i]);
        }
      	

    }
})();


window.addEventListener ('load', function () {
    setInterval (setTitle, 5000);
}, false);

function setTitle () {
   var author1 = document.querySelectorAll("#author-name");
          for (var i = 0; i < author1.length; i++){
            singler = author1[i];
            
            
            // Hide the message while clicking the photo
              mainNodeSel = singler.parentNode.parentNode.parentNode;
			 				if(mainNodeSel.querySelector("#author-photo")){
								mainNodeSel.querySelector("#author-photo").onclick = closethelist;
							}
            
            	
             if(singler.innerText == "CALIBER"){
               var developer = true;
              pnosingle = singler.parentNode;
               pnosingle.style.alignItems = "center";
               pnosingle.parentNode.style.alignItems = "center";
               singler.setAttribute('style', 'color:black !important; background: yellow; padding:4px; opacity: 1.0;');
             }
          
            // Verified User Correction
             if(singler.querySelector("yt-live-chat-author-badge-renderer[type='verified']")){
                singler.setAttribute('style', 'background: #74ff74; color: black!important; padding: 5px; padding-left: 5px; margin-top: 2px; padding-left: 10px;')
							  if(singler.innerText == "Nightbot" || singler.innerText == "Streamlabs"){
                  singler.parentNode.parentNode.parentNode.style.display = "none";
           			 }
              }
            
          // Highlight Keywords
				if( mainNodeSel.querySelector("#message")){
          messageNode = mainNodeSel.querySelector("#message");
          messagetxt = messageNode.textContent;
          
          // Hide !points Call
          if (messagetxt.search("!points") != -1){
            messageNode.parentNode.parentNode.style.display = "none";
          }
          
          // Moderator only Highlights
           if( (mainNodeSel.hasAttribute("author-type") && (mainNodeSel.getAttribute("author-type") == 'moderator')) || developer)  {
          if(messagetxt.search("!ht") != -1){
            console.log("Triggerd!");
            messagetxt = messagetxt.replace(/\!ht/g, " ");
            console.log(messagetxt);
            messageNode.textContent = messagetxt;
            messageNode.style.backgroundColor = "Yellow";
            messageNode.style.color = "black";
            messageNode.style.padding = "0px 5px";
            
          }
           if(messagetxt.search("!hr") != -1){
            console.log("Triggerd!");
            messagetxt = messagetxt.replace(/\!hr/g, " ");
            console.log(messagetxt);
            messageNode.textContent = messagetxt;
            messageNode.style.backgroundColor = "red";
            messageNode.style.color = "white";
            messageNode.style.padding = "0px 5px";
            
          }
           if(messagetxt.search("!hfull") != -1){
            console.log("Triggerd!");
            messagetxt = messagetxt.replace(/\!hfull/g, " ");
            console.log(messagetxt);
            messageNode.textContent = messagetxt;
            mainNodeSel.style.backgroundColor = "red";
            mainNodeSel.style.color = "white";
            //mainNodeSel.style.padding = "0px 5px";
            }
          }
          
        }
            
          }
}


function closethelist(event) {
			  event.target.parentNode.parentNode.style.display = "none";
			}