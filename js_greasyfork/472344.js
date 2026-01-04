// ==UserScript==
// @name        GP Captcha Sover
// @namespace   GP Captcha Sover
// @version     0.5
// @description GPCapxxx
// @author      aewaewxxx
// @match       *://*/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472344/GP%20Captcha%20Sover.user.js
// @updateURL https://update.greasyfork.org/scripts/472344/GP%20Captcha%20Sover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if(document.querySelector('#gpcaptcha')){

        const captchaImgs = document.querySelectorAll('#gpcaptcha .svg-padding');
        const hashes = [
            {"Key": "M512 176.001C512 273.203"},
            {"Flag": "M349.565 98.783C295.978"},
            {"Heart": "M414.9 24C361.8 24 312"},
            {"Car": "M499.991 168h-54.815l-7.854-20"},
            {"Plane": "M472 200H360.211L256.013"},
            {"House" :"M488 312.7V456c0 13.3-10.7"},
            {"Cup":"M192 384h192c53 0 96-43"},
            {"Tree" : "M377.33 375.429L293.906"},
            {"Star" : "M259.3 17.8L194 150.2 47.9"},
            {"Truck":"M624 352h-16V243.9c0-12.7-5"}
        ]

        const selectedText = document.querySelector('#gpcaptcha p .text-capitalize').innerText.toLowerCase();
        const checkHash = hashes.find(hash => Object.keys(hash)[0].toLowerCase() === selectedText);
        const flagValue = checkHash ? Object.values(checkHash)[0] : null;
        console.log(selectedText, flagValue)

        function checkImages() {
            Array.from(captchaImgs).forEach((img, i) => {
                const svg = img.querySelector('svg path').getAttribute('d');
                if (svg.startsWith(flagValue)) {
                    img.click()
                    console.log('Matched');
                }else{
                    console.log('Doesnt match');
                }
            });
        }

        setInterval(function(){
            checkImages();
        },10000)
    }

})();