// ==UserScript==
// @name         Typeracer Change Profile Pic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to change your profile pic
// @author       minuminao23
// @match        https://play.typeracer.com/*
// @icon         https://www.google.com/s2/favicons?domain=typeracer.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/444126/Typeracer%20Change%20Profile%20Pic.user.js
// @updateURL https://update.greasyfork.org/scripts/444126/Typeracer%20Change%20Profile%20Pic.meta.js
// ==/UserScript==

(function() {
    let image_link = 'https://i.imgur.com/neGVEBV.jpg'; // paste your profile pic link here

    var interval = setInterval(function() {
            document.querySelector("#userInfo > div > div.profilePicContainer > img").src=image_link
            var profile_pic = document.querySelector("body > div.DialogBox.PlayerInfoPopup.trPopupDialog > div > div > div.dialogContent > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > img")
                profile_pic.src=image_link
                profile_pic.style.display=''
                profile_pic.ariaHidden=false
                profile_pic.height=200
                profile_pic.width=200
    }, 100)

})();