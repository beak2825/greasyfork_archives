// ==UserScript==
// @name         Sankaku Complex
// @namespace    lander_scripts
// @version      1.150
// @description  Site improvements
// @author       You
// @match        https://*.sankakucomplex.com/*
// @icon         https://m.media-amazon.com/images/I/41Iwdj1S2yL.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388483/Sankaku%20Complex.user.js
// @updateURL https://update.greasyfork.org/scripts/388483/Sankaku%20Complex.meta.js
// ==/UserScript==

console.info('💗 Sankaku Complex - Site improvements: Script Loaded');
(function() {
    'use strict';
    //Logs in at login screen
    var isLoginPage = document.querySelectorAll("input[name='user[name]']").length != 0
    if(isLoginPage)
    {
        console.info('💗 Sankaku Complex - Site improvements: Login page found!');
        document.querySelectorAll("input[name='user[name]']")[0].value = "dontbothermedead@gmail.com"
        document.querySelectorAll("input[name='user[password]']")[0].value = "Q#hKhew#9aho#u"
        document.querySelectorAll("input[name='commit']")[0].click()
    }else
    {
        //clicks the dark mode button if it is off // Disabled on 09/23, seems to be dark by default?
        //var isDarkModeOff = document.querySelectorAll(".theme-button-dark.theme-button-selected").length != 0
        //console.info('💗 Sankaku Complex - Site improvements: Darkmode: ' + isDarkModeOff)
        //if(isDarkModeOff){
        //    document.querySelectorAll(".theme-button-dark")[0].click()
        //}

        //removes anti-blocker, search for div with styles z-index and hide
        var annoyingPop = document.querySelectorAll("div[style*='z-index:']")[0];
        if(annoyingPop)
        {
            console.info('💗 Sankaku Complex - Site improvements: Anti-adblock popoup removed!');
            annoyingPop.style.display="none";
        }

        //makes image big
        var startIMG = document.querySelectorAll("#image")[0];
        if (startIMG){
            //adds a delay, not sure why necessary. I think behavior gets changed with a script after page load.
            setTimeout(function() {
                startIMG.click()
                startIMG = document.querySelectorAll("#image")[0]
                startIMG.style.width="100%";
                startIMG.style.height="100%";
                console.info('💗 Sankaku Complex - Site improvements: Image Resized')
            }, 800);
        }
    }
})();