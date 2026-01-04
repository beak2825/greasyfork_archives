// ==UserScript==
// @name         Rtp Play Modo Cinema
// @namespace    rtpplaymc
// @version      1.1
// @description  Simples userscript para ver RTP Play em modo cinema
// @include      https://*rtp.pt/play/p*
// @author       Gabriel Fresco <gfmfresco@gmail.com>
// @grant        none
// @copyright    2021, Gabriel Fresco
// @license      GPL 3, https://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/436814/Rtp%20Play%20Modo%20Cinema.user.js
// @updateURL https://update.greasyfork.org/scripts/436814/Rtp%20Play%20Modo%20Cinema.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isResize = false;
    var playerHeight = '100vh';

    var menu = document.getElementsByClassName('worldnav-container')[0];

    //containers in order
    var container = document.getElementsByClassName('bg-img')[0].getElementsByClassName('container')[0];
    var articleVod = container.getElementsByClassName('article-vod')[0];
    var row = articleVod.getElementsByClassName('row')[0];
    var playerMediaContainer = row.getElementsByClassName('player_media_container')[0];
    var playerMedia = playerMediaContainer.getElementsByClassName('player_media')[0];
    var containersArr = [container,articleVod,row,playerMediaContainer,playerMedia];
    var player = document.getElementById('player_prog');

    //initial player height
    var playerDefaultHeight;
    setTimeout(() => {playerDefaultHeight = player.style.height}, 1000);

    //button
    var resizeIcon = document.createElement('i');
    resizeIcon.setAttribute('class','fal fa-expand-alt');
    var newButton = document.createElement('a');
    newButton.setAttribute('class','text-uppercase share st-custom-button st-hide-label');
    newButton.appendChild(resizeIcon);
    newButton.appendChild(document.createTextNode('Modo Cinema'));
    newButton.onclick = function(){
        setResize();
    };

    document.getElementById('containerOptions').appendChild(newButton);

    function setResize() {

        if (isResize){
            isResize = false;

            menu.style.display = 'block';

            container.style.removeProperty('width');
            for (let i = 0; i < containersArr.length; i++) {
                containersArr[i].style.removeProperty('height');
                playerMedia.style.marginTop = '6px';
                container.style.removeProperty('padding');
            }

            player.style.height = playerDefaultHeight;
            player.style.maxHeight = playerDefaultHeight;

            showScrollbar();
        } else {
            isResize = true;

            menu.style.display = 'none';

            container.style.width = '100%';
            for (let i = 0; i < containersArr.length; i++) {
                containersArr[i].style.height = '100vh';
                playerMedia.style.marginTop = '0';
                container.style.padding = '0';
            }

            player.style.height = playerHeight;
            player.style.maxHeight = playerHeight;

            hideScrollbar();

            window.scrollTo(0,0)
        }
    }

    function hideScrollbar() {
        var style = document.createElement("style");
        style.innerHTML = `html{scrollbar-width:none}body::-webkit-scrollbar{display:none;}`;
        document.head.appendChild(style);
    }
    function showScrollbar() {
        document.head.getElementsByTagName('style')[document.head.getElementsByTagName('style').length-1].remove();
    }
})();