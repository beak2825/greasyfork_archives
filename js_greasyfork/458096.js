// ==UserScript==
// @name         Hide Trends and WtF Twitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide trends and "Who to Follow" on twitter
// @author       You
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Number_sign.svg/1200px-Number_sign.svg.png
// @match        *://*.twitter.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/458096/Hide%20Trends%20and%20WtF%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/458096/Hide%20Trends%20and%20WtF%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //document.body.remove()
    var t = 0;
    var checkExist = setInterval(function() {
   if (document.getElementsByClassName("css-1dbjc4n r-1ysxnx4 r-k0dy70 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x")[0] != undefined) {

      document.getElementsByClassName("css-1dbjc4n r-1ysxnx4 r-k0dy70 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x")[0].remove();


      console.log("Remove Trends!");
     //clearInterval(checkExist);
   }if (document.getElementsByClassName("css-1dbjc4n r-g2wdr4 r-14wv3jr r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x")[0] != undefined)
   {
       document.getElementsByClassName("css-1dbjc4n r-g2wdr4 r-14wv3jr r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x")[0].remove();
   }
   /*commment this to keep Trends button---------------------------------------------------------------------------------------------------------*/
   if (document.getElementsByClassName("css-4rbku5 css-18t94o4 css-1dbjc4n r-1habvwh r-1loqt21 r-6koalj r-eqz5dr r-16y2uox r-1ny4l3l r-oyd9sg r-13qz1uu")[1] && t == 0) {
       document.getElementsByClassName("css-4rbku5 css-18t94o4 css-1dbjc4n r-1habvwh r-1loqt21 r-6koalj r-eqz5dr r-16y2uox r-1ny4l3l r-oyd9sg r-13qz1uu")[1].remove();
       t = 1;
       console.log("Remove Trends Button!");
       }
   /*----------------------------------------------------------------------------------------------------------------------------------------*/
}, 10);
})();