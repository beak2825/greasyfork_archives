// ==UserScript==
// @name         Dog Tags Profile Helper
// @namespace    wildhareDTProfileHelper
// @version      0.1.6
// @description  changes link to personal stats to be focused on defends lost and no comparison
// @author       wildhare
// @match        *://*.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392113/Dog%20Tags%20Profile%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392113/Dog%20Tags%20Profile%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPlayerId() {
        let playerAccount = document.querySelector('.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(1) > div:nth-child(2) > span').innerText;
        let playerAccountArray = playerAccount.split(" ");
        let playerID = parseInt(playerAccountArray[1].match(/\[(\d+)\]/)[1]);
        return playerID;
        console.log('playerID')
    }

    var nodeSelector = '.profile-wrapper.medals-wrapper';
    var personalStatsSvgSelector = '.profile-button.profile-button-personalStats.active > svg';

    function appendLink(URL) {
        var buttonsList = document.querySelector('div.buttons-list');
        let defendsAnchor = document.createElement('a');
        defendsAnchor.href = URL;
        defendsAnchor.className = 'profile-button profile-button-defendslost active';
        let defendsAnchorSvg = document.querySelector(personalStatsSvgSelector).cloneNode(true);
        defendsAnchorSvg.style.backgroundColor = 'green';
        defendsAnchor.appendChild(defendsAnchorSvg);
        buttonsList.appendChild(defendsAnchor);
    }

    var checkNode = function(addedNode) {
        if (addedNode.nodeType === 1){
            if (addedNode.matches(nodeSelector)){
                var playerID = getPlayerId();
                var defendsLostURL = '/personalstats.php?ID=' + playerID + '&stats=defendslost&from=1%20month';
                appendLink(defendsLostURL);
            }
        }
    }

    var observer = new MutationObserver(function(mutations){
        for (var i=0; i < mutations.length; i++){
            for (var j=0; j < mutations[i].addedNodes.length; j++){
                checkNode(mutations[i].addedNodes[j]);
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();