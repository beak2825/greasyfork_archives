// ==UserScript==
// @name         Steam Inventory Preview Background Button
// @namespace    http://steamcommunity.com/profiles/76561197995708004/
// @version      1.02
// @description  Add preview background button to steam inventory.
// @author       HAC
// @match        http://steamcommunity.com/profiles/*
// @match        http://steamcommunity.com/id/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/37224/Steam%20Inventory%20Preview%20Background%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/37224/Steam%20Inventory%20Preview%20Background%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let path = window.location.pathname.replace(/\/+/g, "/");
    if(/^\/(?:id|profiles)\/.+\/inventory/.test(path)) {
        let observer = new MutationObserver(function(mutations) {
            let activeItemInfo = iActiveSelectView; // Get iActiveSelectView from global
            inventoryAddButtonPreviewBackground(activeItemInfo);
        });
        observer.observe(document.getElementById('iteminfo0_item_name'), { childList: true });
        observer.observe(document.getElementById('iteminfo1_item_name'), { childList: true });
    } else if(/^\/(?:id|profiles)\/.+/.test(path)){
        let previewHash = window.location.hash.match(/#previewBackground\/(\d+\/[a-z0-9]+(?:\.[a-z0-9]+)?)/i);
        if (previewHash) {
            let imageUrl = window.location.protocol + '//steamcdn-a.akamaihd.net/steamcommunity/public/images/items/' + previewHash[1];
            profileChangeBackground(imageUrl);
        }
    }

    function inventoryAddButtonPreviewBackground (activeItemInfo){
        let profileUrlNodesWrapper = document.getElementById('global_actions');
        let profileUrlNodes = profileUrlNodesWrapper.getElementsByClassName('playerAvatar');
        let profileUrl = profileUrlNodes[0].href;
        let itemButtonsHolder = document.getElementById('iteminfo' + activeItemInfo + '_item_actions');
        let itemButtons = itemButtonsHolder.getElementsByTagName('a');
        let imageUrl = itemButtons[0].href;
        let imageUrlMatch = imageUrl.match(/images\/items\/(\d+\/[a-z0-9]+(?:\.[a-z0-9]+)?)/i);
        if(imageUrlMatch !== null) {
            imageUrlMatch = imageUrlMatch[1];
            let previewUrl = profileUrl + '#previewBackground/' + imageUrlMatch;

            let a = document.createElement('a');
            a.setAttribute('href', previewUrl);
            a.setAttribute('target', '_blank');
            a.classList.add('btn_small');
            a.classList.add('btn_darkblue_white_innerfade');
            itemButtonsHolder.appendChild(a);
            let span = document.createElement('span');
            span.textContent = 'Preview Background';
            a.appendChild(span);
            itemButtonsHolder.style.height = '';
        }
    }

    function profileChangeBackground(imageUrl) {
        let img = document.createElement('img');
        img.style.display = 'none';
        img.src = imageUrl;
        document.body.appendChild(img);
        img.onload = function() {
            let bgImgNodes = document.getElementsByClassName('no_header profile_page');
            for(let bgImgNode of bgImgNodes) { bgImgNode.style.backgroundImage = 'url(' + imageUrl + ')'; }
            let bgImgNodes2 = document.getElementsByClassName('profile_background_image_content');
            for(let bgImgNode2 of bgImgNodes2) { bgImgNode2.style.backgroundImage = 'url(' + imageUrl + ')'; }
            img.remove();
        };
        img.onerror = function() {
            console.log("Error: Can't load image. " + imageUrl);
            img.remove();
        };
    }
})();