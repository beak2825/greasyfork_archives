// ==UserScript==
// @name         Clraik Scoopendous Gifter Alert 3.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alert when scoopendous-gifter or scoopendous-gift element appears.
// @author       Amanda Bynes
// @match        https://clraik.com/forum/showthread.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540558/Clraik%20Scoopendous%20Gifter%20Alert%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/540558/Clraik%20Scoopendous%20Gifter%20Alert%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let meun = $('.welcomelink a').text()
    let icun = $($('.scoopendous-gifter').parent().parent().find('.username')[0]).text()

    if (icun != ''){
    let postid = $('.scoopendous-gifter').parent().parent().parent().parent().attr('id').slice(5,)

    let isme = '';

    if (meun == icun) {
     isme = " THAT'S YOU!";

    }


alert(`User is ${icun}, postid ${postid}${isme}`)
    }

    let giftneeded = $('.scoopendous-gift').parent().parent().find('.username').text()

    if (giftneeded != ''){
        alert(`${giftneeded} needs ice cream`)

    }




})();