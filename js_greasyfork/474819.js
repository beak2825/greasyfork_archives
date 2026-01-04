// ==UserScript==
// @name         Youtube Shorts to Normal Video
// @namespace    https://linktr.ee/DeadLyBro
// @description  EN: Convert Youtube Shorts videos to normal videos with one button. TR: Youtube Shorts videolarını bir buton ile normal videoya dönüştürün.
// @author       DeadLyBro
// @copyright    2023, DeadLyBro (https://openuserjs.org/users/DeadLyBro)
// @version      1.7
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474819/Youtube%20Shorts%20to%20Normal%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/474819/Youtube%20Shorts%20to%20Normal%20Video.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       DeadLyBro
// @updateURL    https://openuserjs.org/meta/DeadLyBro/Youtube_Shorts_to_Normal_Video.meta.js
// @downloadURL  https://openuserjs.org/install/DeadLyBro/Youtube_Shorts_to_Normal_Video.user.js
// ==/OpenUserJS==

(function() {
    'use strict';

    // Buton stilini ekleme fonksiyonu
    function addCustomCSS() {
        if (!document.querySelector('.NormalVideoButtonCSS')) {
            const myCSS = document.createElement('style');
            myCSS.classList.add('NormalVideoButtonCSS');
            myCSS.textContent = `
                .NormalVideoButton {
                    background: #272727;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    margin-bottom: 10px;
                }
                .NormalVideoButton:hover {
                    cursor: pointer;
                }
            `;
            document.body.append(myCSS);
        }
    }

    // Custom buton ekleme fonksiyonu
    function addCustomButton() {
        const activeElements = document.querySelectorAll('[is-active]');

        activeElements.forEach((activeElement) => {
            const likeButton = activeElement.querySelector('like-button-view-model');

            if (likeButton && !likeButton.querySelector('.NormalVideoButton')) {
                const myButton = document.createElement("button");
                myButton.innerText = `Normal Video`;
                myButton.classList.add('NormalVideoButton');
                myButton.addEventListener("click", () => {
                    const videoId = document.URL.split('/shorts/')[1];
                    if (videoId) {
                        location.href = `https://www.youtube.com/watch?v=${videoId}`;
                    }
                });
                likeButton.prepend(myButton);
            }
        });
    }

    // Shorts URL'sini kontrol edip, işlemi başlatma
    function checkAndRun() {
        if (document.baseURI.startsWith("https://www.youtube.com/shorts")) {
            addCustomCSS();  // CSS sadece bir kez eklenir
            addCustomButton();  // Buton ekleme her seferinde kontrol edilir
        }
    }

    // Sadece her saniyede bir URL kontrolü yapılır
    setInterval(checkAndRun, 1000);

})();