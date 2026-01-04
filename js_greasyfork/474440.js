// ==UserScript==
// @name         iyingshi iframe embeded
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  iyingshi zhibo player update
// @match        *.localau.vip/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aiyingshi.tv
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/474440/iyingshi%20iframe%20embeded.user.js
// @updateURL https://update.greasyfork.org/scripts/474440/iyingshi%20iframe%20embeded.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const injectCSS = css => {
        let el = document.createElement('style');
        el.type = 'text/css';
        el.innerText = css;
        document.head.appendChild(el);
        return el;
    };

    // Your code here...
    // do stuff within iframe
    const wrapper = document.querySelector('#player');
    const mask = wrapper.querySelector('.dplayer-controller-mask');
    const controls = wrapper.querySelector('.dplayer-controller');
    const video = wrapper.querySelector('video');
    video.setAttribute('controls', true);
    mask.remove();
    controls.remove();





    let isPiPSupported = 'pictureInPictureEnabled' in document
    let toggleBtn;
    if(isPiPSupported){
        toggleBtn = document.createElement('button');
        toggleBtn.classList.add('toggle-btn');
        toggleBtn.textContent = '🪟'
        toggleBtn.addEventListener('click', togglePiPMode);
        video.addEventListener('enterpictureinpicture', (event)=> {
            toggleBtn.textContent = "❌";
        });

        video.addEventListener('leavepictureinpicture', (event) => {
            toggleBtn.textContent = "🪟";
        });
        video.addEventListener('leavepictureinpicture', (event) => {
            toggleBtn.textContent = "🪟";
        });

        document.body.appendChild(toggleBtn);


        injectCSS(`
.toggle-btn{
position: fixed;
top: 50%;
right: 1rem;
border: none;
background: black;
color: white;
font-size: 1.5rem;
line-height: 1;
padding: 5px;
border-radius: 5px;
    width: auto;
    height: auto;
    cursor: pointer;
    opacity: 0.5;
    }
    .toggle-btn:hover{
background: #333;
    opacity: 1;
    }
    `);
    }


    async function togglePiPMode(event) {
        toggleBtn.disabled = true; //disable btn ,so that no multiple request are made
        try {
            if (video !== document.pictureInPictureElement) {
                await video.requestPictureInPicture();
                toggleBtn.textContent = "❌";
            }
            // If already playing exit mide
            else {
                await document.exitPictureInPicture();
                toggleBtn.textContent = "🪟";
            }
        } catch (error) {
            console.log(error);
        } finally {
            toggleBtn.disabled = false; //enable toggle at last
        }
    }

})();