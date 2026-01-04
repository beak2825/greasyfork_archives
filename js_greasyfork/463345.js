// ==UserScript==
// @name         Restore Twitter Logo
// @description  Restores the default blue bird Twitter logo and removes the dog logo forced by Elon Musk
// @namespace    https://www.example.com/
// @version      1.7.3
// @author       noxljlfsd
// @grant        none
// @match        https://twitter.com/*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/463345/Restore%20Twitter%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/463345/Restore%20Twitter%20Logo.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function chageDogLogo() {
        //if(true||document.readyState === 'complete') {
            // Set the default Twitter logo URL
            const defaultLogoUrl = 'https://abs.twimg.com/responsive-web/client-web/icon-ios.8ea219d5.png';
            // Find the Twitter logo element and restore the default logo
            const twitterLogo = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > header > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-dnmrzs.r-1vvnge1 > h1 > a > div > svg");
            if (twitterLogo) {
                twitterLogo.outerHTML = `<image xlink:href="${defaultLogoUrl}" src="${defaultLogoUrl}" style="width:1.75rem;height:1.75rem;" alt="">`;
                return true;
            }
            else { return false;}
 
        //}
    }
    function TryChageLogo(){
        let times = 0;
        function changeDogLogoAndCount(){
            let tryResult = chageDogLogo();
            if(times++ >= 30 || tryResult){
                clearInterval();
            }
        }
        setInterval(changeDogLogoAndCount,1000);
    }
    TryChageLogo();
})();