// ==UserScript==
// @name         Simple Ad Block
// @version      1.0
// @description  Bypass YouTube's ad block detector
// @author       bernzrdo
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @namespace https://greasyfork.org/users/1207477
// @downloadURL https://update.greasyfork.org/scripts/478641/Simple%20Ad%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/478641/Simple%20Ad%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Simple Ad Block: Loaded!');

    function update(){

        let $style = document.querySelector('#sab-css');
        if(!$style) loadCSS();

        let $skipAd = document.querySelector('.ytp-ad-skip-button');
        if($skipAd){
            $skipAd.click();
            console.log('Simple Ad Block: Clicked "Skip Ad" button!');
        }

        let $adOverlay = document.querySelector('.ytp-ad-player-overlay');
        if($adOverlay){
            let $video = document.querySelector('#player video');
            $video.currentTime = $video.duration;
            console.log('Simple Ad Block: Jumped to end of ad!');
        }

        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    function loadCSS(){
        let $style = document.createElement('style');
        $style.id = 'sab-css';
        $style.innerText = `

            #player-ads, #masthead-ad { display: none !important }

            ytd-ad-slot-renderer { position: relative }

            ytd-ad-slot-renderer * { visibility: hidden }

            ytd-ad-slot-renderer::before {
	            content: '';

	            position: absolute;
                width: 100%;
                height: 100%;

	            background-image: url('https://i.imgur.com/7Uw0PP0.gif');
                background-size: 100px;
                background-position: center;
                background-repeat: no-repeat;

            }

        `;
        document.head.appendChild($style);
        console.log('Simple Ad Block: CSS Loaded!');
    }

})();