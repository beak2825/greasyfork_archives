// ==UserScript==
// @name         Twitch Chat Username BG Color
// @version      1
// @description  Change the background color of chat messages to the user's name color
// @author       Cullenn
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/428778
// @downloadURL https://update.greasyfork.org/scripts/423944/Twitch%20Chat%20Username%20BG%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/423944/Twitch%20Chat%20Username%20BG%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatBoxClass = '.chat-scrollable-area__message-container';

    function rgbBrightness(rbgString) {
        var a = rbgString.split("(")[1].split(")")[0];
        a = a.split(",");
        return a.reduce((a, b) => {return parseInt(a)+parseInt(b)});
    }

    function changeChatboxColors(item) {
        if(!item.getAttribute('colorChanged')){
            item.setAttribute('colorChanged', true);
            const midRgb = ((255 * 3) / 2) - 1;
            var chatName = item.querySelector('.chat-author__display-name');
            var bgColor = chatName.style.color;

            var nameColor = rgbBrightness(bgColor) > midRgb ? 'rgb(0, 0, 0)' : 'rgb(255 255 255)';
            chatName.style.backgroundColor = nameColor;
            item.querySelector('.text-fragment').style.color = nameColor;
            item.querySelector('.chat-line__timestamp').style.color = nameColor;


            if(item.style) {
                item.style.backgroundColor = bgColor;
            }
        }
    }

    var initHasLoaded = false;
    const initTargetNode = document.body;
    const initConfig = { attributes: true, childList: true, subtree: true };
    const initCallback = function(mutationList, observer){
        if(initHasLoaded) {
            initObserver.disconnect();
        }
        const isChatLoaded = !!document.querySelector(chatBoxClass);
        if (isChatLoaded) {
            initHasLoaded = true;

            document.querySelectorAll('.chat-line__message').forEach((item, i) => {
                changeChatboxColors(item);
            });

            const chatboxTargetNode = document.querySelector(chatBoxClass);
            const chatboxConfig = { attributes: false, childList: true, subtree: false };
            const chatboxCallback = function(mutationList, observer) {
                mutationList.forEach((item) => {
                    item.addedNodes.forEach((itemItem) => {
                        changeChatboxColors(itemItem);
                    })
                })
            }
            const chatboxObserver = new MutationObserver(chatboxCallback);
            chatboxObserver.observe(chatboxTargetNode, chatboxConfig)
        }
	};
    const initObserver = new MutationObserver(initCallback);
	initObserver.observe(initTargetNode, initConfig);
})();