// ==UserScript==
// @name           Facebook Filter
// @namespace      namespace
// @author         sanhbkdn
// @icon           https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-128.png
// @description    Hide Facebook posts you don't wanna see.
// @include        http://www.facebook.com/*
// @include        https://www.facebook.com/*
// @exclude        https://www.facebook.com/permalink.php*
// @grant          GM_notification
// @version 0.0.1.20180529152542
// @downloadURL https://update.greasyfork.org/scripts/368662/Facebook%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/368662/Facebook%20Filter.meta.js
// ==/UserScript==

// Install:
// Step 1: Install TamperMonkey
// Step 2: In Chrome, go to chrome://extensions/
// Step 3: Click on TamperMonkey options
// Step 4: Go to new user script tab.
// Step 5: Paste this script into it and save.

// Notes:
// To add more keywords to the blacklist, simply add
// more elements to the blacklist array at the start of
// this script.

const keywords = [ 'giá', 'bán', 'ship', 'hàng', 'khách', 'Sở hữu', 'mụn', 'lông', 'nám', 'tóc', 'thâm'];

const len = keywords.length;

const notificationDetails = {
    text: 'Blocked',
    title: 'Facebook Filter',
    timeout: 15000,
    onclick: function() { },
};

function contains(keywords, str) {
    let indexOfMatch;
    let keyBlocked;
    for (let i = len - 1; i >= 0; i--) {
        // add spaces at before and after each word to be more precise
        // (ex: ' giá '!= 'giáo'), some words do not need extra spaces
        indexOfMatch = str.search(' ' + keywords[i].toUpperCase() + ' ');
        keyBlocked = '';
        if (indexOfMatch >= 0) {
            for(let j = 0; j < 10; j++){
                if(typeof str[indexOfMatch] === "undefined") break;
                keyBlocked += str[indexOfMatch++];
            }
            console.log("[KeyBlocked] "+ keyBlocked);
            return true;
        }
    }
    return false;
}

function hidePostsByKeywords(black_list) {
    let posts = document.getElementsByClassName('userContentWrapper');
    for (let i = posts.length - 1; i >= 0; i--) {
        if(posts[i].style.display == 'none') continue;

        let content, url;

        if(typeof(posts[i].getElementsByClassName("userContent")[0]) == 'undefined'){
            continue;
        }

        content = posts[i].getElementsByClassName("userContent")[0].textContent;
        if (contains(black_list, content.toUpperCase())) {
            url = posts[i].getElementsByClassName("_5pcq")[0].href;
            posts[i].style.display = 'none';

            notificationDetails.text = "[Blocked] " + content;
            notificationDetails.onclick = function(){
                window.open(url, '_blank');
            };
            GM_notification(notificationDetails);
        }
    }
}
window.addEventListener("DOMNodeInserted", function() { hidePostsByKeywords(keywords); }, false);