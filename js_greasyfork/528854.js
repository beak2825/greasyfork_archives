// ==UserScript==
// @name        Autoclick claim button 4 Website
// @namespace   Violentmonkey Scripts
// @match       *://earn-pepe.com/*
// @match       *://earn-bonk.com/*
// @match       *://feyorra.site/*
// @match       *://earn-trump.com/*
// @grant       none
// @version     1.0
// @author      iewilmaestro
// @license     Copyright iewilmaestro
// @description autoclick faucet claim button
// @downloadURL https://update.greasyfork.org/scripts/528854/Autoclick%20claim%20button%204%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/528854/Autoclick%20claim%20button%204%20Website.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(text, url, gradientColor, isLink = true) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.color = 'white';
        button.style.fontWeight = 'bold';
        button.style.transition = 'background 0.3s ease';

        button.style.background = gradientColor;

        button.onmouseover = function() {
            button.style.background = gradientColor + '95';
        };
        button.onmouseout = function() {
            button.style.background = gradientColor;
        };

        if (isLink) {
            button.onclick = function() {
                window.open(url, '_blank');
            };
        } else {
            button.onclick = function() {
            };
        }

        document.body.appendChild(button);

        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.pointerEvents = 'all';

        const buttons = document.querySelectorAll('.custom-button');
        const verticalSpacing = 10;
        let topOffset = 70;
        if (buttons.length > 0) {
            topOffset = 70 + (buttons.length) * (button.offsetHeight + verticalSpacing);
        }

        button.style.top = `${topOffset}px`;
        button.classList.add('custom-button');
    }

    createButton('IEWIL OFFICIAL', '', 'linear-gradient(45deg, #000000, #434343)', false);
    createButton('Earnbonk', 'https://earn-bonk.com/?ref=EpP6D', 'linear-gradient(45deg, #FF7E00, #FFB400)');
    createButton('EarnPepe', 'https://earn-pepe.com/?ref=Wvmj', 'linear-gradient(45deg, #32CD32, #228B22)');
    createButton('FeyorraSite', 'https://feyorra.site/?ref=D4CW', 'linear-gradient(45deg, #00BFFF, #1E90FF)');
    createButton('EarnTrump', 'https://earn-trump.com/?ref=zw8rn', 'linear-gradient(45deg, #FFD700, #FFEC8B)');

    window.addEventListener('load', function() {
        const adSelectors = [
            '.ad-container',
            '.ads',
            '.advertisement',
            'iframe[src*="ads"]',
            '#ad-banner',
            '#ad-wrapper',
            '[id^="google_ads"]',
            '[id^="ad-"]',
        ];

        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.remove());
        });
    });

    setInterval(function(){
    function claim(){
      const Button = document.querySelector("#loginBtnText");
      if(Button){
          Button.click();
      }
    }
    const timeOut = document.body.outerHTML.includes("Timeout, Please refresh the page!");
    if(timeOut){
      location.reload();
    }
    const Verified = document.body.outerHTML.includes("Verified!");
    if(Verified){
      claim();
    }
  },3000);
})();

