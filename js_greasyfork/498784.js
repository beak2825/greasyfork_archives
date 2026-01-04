// ==UserScript==
// @name         Senpa.io+ V1
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Some things
// @author       Tek
// @match        https://senpa.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498784/Senpaio%2B%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/498784/Senpaio%2B%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function triggerEscKey() {
        var event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            keyCode: 27,
            key: 'Escape',
            code: 'Escape'
        });
        document.dispatchEvent(event);
    }

    function checkRespawnWindow() {
        var respawnWindow = document.querySelector('.modal.scale-modal');
        if (respawnWindow && getComputedStyle(respawnWindow).opacity === '1') {
            console.log('Respawn window detected, triggering Esc key...');
            setTimeout(triggerEscKey, 5);
        }
    }

    function removeAdsAndSocialSidebar() {
        var bottomAdDiv = document.getElementById("bottomAd");
        if (bottomAdDiv) {
            bottomAdDiv.parentNode.removeChild(bottomAdDiv);
        }

        var adsBlockDivs = document.querySelectorAll(".ads-block-1");
        adsBlockDivs.forEach(function(adsBlockDiv) {
            adsBlockDiv.parentNode.removeChild(adsBlockDiv);
        });

        var bannerDivs = document.querySelectorAll(".banner");
        bannerDivs.forEach(function(bannerDiv) {
            bannerDiv.parentNode.removeChild(bannerDiv);
        });

        var advertisementInformerEndgameDivs = document.querySelectorAll(".advertisement-informer-endgame");
        advertisementInformerEndgameDivs.forEach(function(advertisementInformerEndgameDiv) {
            advertisementInformerEndgameDiv.parentNode.removeChild(advertisementInformerEndgameDiv);
        });

        var senpaIoDiv = document.getElementById("senpa-io_300x250_3");
        if (senpaIoDiv) {
            senpaIoDiv.parentNode.removeChild(senpaIoDiv);
        }

        var socialSidebarUl = document.getElementById("socialsidebar");
        if (socialSidebarUl) {
            socialSidebarUl.parentNode.removeChild(socialSidebarUl);
        }

        var endGameDiv = document.getElementById("endGame");
        if (endGameDiv) {
            endGameDiv.remove();
        }

        var roomStatsHudDiv = document.getElementById("room-stats-hud");
        if (roomStatsHudDiv) {
            roomStatsHudDiv.remove();
        }

        var gameAdsBannerContainer = document.getElementById("gameadsbanner-container");
        if (gameAdsBannerContainer) {
            gameAdsBannerContainer.remove();
        }

        var roomStatsDisplay = document.querySelector(".room-stats-display");
        if (roomStatsDisplay) {
            roomStatsDisplay.remove();
        }

        var teamPlayersList = document.querySelector(".team-players-list");
        if (teamPlayersList) {
            teamPlayersList.remove();
        }

        var playButton = document.getElementById('play');
        if (playButton) {
            playButton.style.backgroundColor = '#4CAF50';
            playButton.style.color = '#ffffff';
            playButton.style.border = '2px solid #4CAF50';
            playButton.style.padding = '10px 20px';
            playButton.style.fontSize = '16px';
            playButton.style.cursor = 'pointer';
            playButton.style.width = '150px';
            playButton.style.height = '200px';
        }

        var spectateButton = document.getElementById('spectate');
        if (spectateButton) {
            spectateButton.style.backgroundColor = '#f44336';
            spectateButton.style.color = '#ffffff';
            spectateButton.style.border = '2px solid #f44336';
            spectateButton.style.padding = '10px 20px';
            spectateButton.style.fontSize = '16px';
            spectateButton.style.cursor = 'pointer';
            spectateButton.style.width = '150px';
            spectateButton.style.height = '200px';
        }
    }

    setInterval(checkRespawnWindow, 300);

    window.addEventListener('load', removeAdsAndSocialSidebar);

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeAdsAndSocialSidebar();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
