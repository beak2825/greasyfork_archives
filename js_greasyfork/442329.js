// ==UserScript==
// @name     	    Remove YouTube Shorts
// @description	    on the Subscription page. Desktop & Mobile.
// @version  	    1.8
// @grant    	    none
// @match    	    https://www.youtube.com/*
// @match    	    https://m.youtube.com/*
// @license         MIT
// @namespace       Remove YouTube Shorts automatically
// @author          https://greasyfork.org/en/users/895144-ed-frees
// @downloadURL https://update.greasyfork.org/scripts/442329/Remove%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/442329/Remove%20YouTube%20Shorts.meta.js
// ==/UserScript==
if (!window.location.href.includes('m.youtube')) { // Desktop
    var timeStatusOverlay = document.getElementsByTagName('H2');
    var i = 0;

    if (!localStorage.getItem("dSButtonSettings")) {
        localStorage.setItem("dSButtonSettings", "red");
    }
    var delShortsInterval;
    if (localStorage.getItem("dSButtonSettings") == 'green') {
        delShortsInterval = setInterval(delShorts, 1000);
    }

    if (document.getElementById('center').children.length != 4) {
        const div = document.createElement('DIV');
        div.id = 'dSDiv';
        div.style.position = 'absolute';
        div.style.zIndex = '99999';

        const button = document.createElement('BUTTON');
        button.id = 'dSButton';
        button.innerHTML = 'DEL Shorts';
        button.style.border = 'none';
        button.style.color = 'white';
        button.style.fontSize = '1rem';
        button.style.background = localStorage.getItem("dSButtonSettings");
        button.addEventListener('click', function () {
            if (button.style.background == 'red' || button.style.background == 'red none repeat scroll 0% 0%') {
                button.style.background = 'green';
                localStorage.setItem("dSButtonSettings", "green");
                delShortsInterval = setInterval(delShorts, 1000);
            } else if (button.style.background == 'green' || button.style.background == 'green none repeat scroll 0% 0%') {
                button.style.background = 'red';
                localStorage.setItem("dSButtonSettings", "red");
                clearInterval(delShortsInterval);
            }
        });

        div.appendChild(button);
        document.getElementById('center').appendChild(div);
    }
} else { // Mobile
    var timeStatusOverlayMobile = document.getElementsByClassName('reel-shelf-title');
    var j = 0;
    setInterval(delShortsMobile, 1000);
}
function delShorts() {
    if (i != timeStatusOverlay.length && window.location.href == 'https://www.youtube.com/feed/subscriptions') {
        i = 0;
        while (i < timeStatusOverlay.length) {
            if (timeStatusOverlay[i].innerHTML.includes('Shorts')) {
                timeStatusOverlay[i].parentElement.parentElement.parentElement.parentElement.parentElement.remove();
                continue;
            } else {
                i++;
            }
        }
    }
}
function delShortsMobile() {
    if (j != timeStatusOverlayMobile.length && window.location.href == 'https://m.youtube.com/feed/subscriptions') {
        j = 0;
        while (j < timeStatusOverlayMobile.length) {
            if (timeStatusOverlayMobile[j].innerHTML.includes('Shorts')) {
                timeStatusOverlayMobile[j].parentElement.parentElement.parentElement.parentElement.parentElement.remove();
                continue;
            } else {
                j++;
            }
        }
    }
}