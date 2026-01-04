// ==UserScript==
// @name         wov auto play
// @namespace    https://www.wolvesville.com/
// @version      0.1
// @description  yeyeye aasdd
// @author       You
// @match        https://www.wolvesville.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wolvesville.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443436/wov%20auto%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/443436/wov%20auto%20play.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var repeat = setInterval( function(){
        if(document.getElementsByClassName("css-1dbjc4n r-18u37iz r-1aockid").length == 0){
            if(document.getElementsByClassName("css-1dbjc4n r-1mlwlqe r-hwh8t1 r-1udh08x r-417010").length == 1){document.getElementsByClassName("css-1dbjc4n r-1mlwlqe r-hwh8t1 r-1udh08x r-417010")[0].click();}
            if(document.getElementsByClassName("css-1dbjc4n r-1loqt21 r-kzbkwu r-puj83k r-11g3r6m r-ttdzmv r-1otgn73 r-lrvibr").length == 2){document.getElementsByClassName("css-1dbjc4n r-1loqt21 r-kzbkwu r-puj83k r-11g3r6m r-ttdzmv r-1otgn73 r-lrvibr")[1].click();}
        }
    },1000);

    })();