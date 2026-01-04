// ==UserScript==
// @name            DiscUdemy Take Course Clicker
// @namespace       http://sagaryadav.com/
// @version         0.1
// @description     click the Take Course Button if it exists
// @author          Sagar Yadav
// @match           https://www.discudemy.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=discudemy.com
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/461513/DiscUdemy%20Take%20Course%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/461513/DiscUdemy%20Take%20Course%20Clicker.meta.js
// ==/UserScript==

window.addEventListener('load', sleepLikeaBaby);

function sleepLikeaBaby() {
    setTimeout(startProgram, 100);
}

function doClicking(thisElement) {
    thisElement.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: 'smooth'
    });
    thisElement.innerText = 'TAKEN';
    thisElement.style.color = '#FFA500'; // Orange color hex
    thisElement.style.font = '40px';
    thisElement.target = '_top';
    window.open(thisElement.href);
}

var insertLink = "";


function startProgram () {
    let CouponLink = document.getElementById('couponLink');
    console.log(CouponLink, " = Couponlink");
    if (CouponLink != null) {
        doClicking(CouponLink);
    } else {
        let allLinks = document.getElementsByTagName('a');
        for (let a in allLinks) { // .classList.contains('secondary')
            if(allLinks[a].classList.contains('green') && allLinks[a].classList.contains('discBtn')) {
                doClicking(allLinks[a]);
            }
        }
    }
}
