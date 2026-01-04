// ==UserScript==
// @name    AUTOCLICK "Continue" OF "Please disable your ad-block." or Ads Support Popup
// @namespace    
// @version 2024-10-24
// @description X:
// @author  Beginner[2023]
// @match   https://idol.sankakucomplex.com/*
// @match   https://chan.sankakucomplex.com/*
// @icon    https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant   none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487544/AUTOCLICK%20%22Continue%22%20OF%20%22Please%20disable%20your%20ad-block%22%20or%20Ads%20Support%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/487544/AUTOCLICK%20%22Continue%22%20OF%20%22Please%20disable%20your%20ad-block%22%20or%20Ads%20Support%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a = document.getElementById('content');
    var adpop_main = null;

    function check_adpop_vis() {
        if (adpop_main != null && adpop_main.getStyle('display') == 'none') {
            return false
        } else if (adpop_main == null) {
            for (let i = 0; i < a.children.length; i++) {
                /* checking the next element have to continue */
                if(a.children[i].nextElementSibling == null) {
                    // console.log('no more next element')
                    break
                }
                if(a.children[i].nextElementSibling.tagName.toLowerCase() == 'script' && a.children[i].nextElementSibling.getAttribute('type') == null){
                    adpop_main = a.children[i];
                    // console.log('pop!!')
                    return true
                }
            }
        }
    }

    function autoclick_c() {
        if(adpop_main != null) {
            try {
                let name_func = adpop_main.lastElementChild.childNodes[0].textContent.trim().slice('async function '.length,'async function '.length+7);
                window[name_func]()
            } catch (error) {
                console.log(error)
            }
        }
    }


    let running = setInterval(function() {
        let sta = check_adpop_vis()
        if (sta == true) {
            // console.log(sta)
            autoclick_c();
        } else {
            // console.log(sta)
            clearInterval(running);
        }
    },300)


})();