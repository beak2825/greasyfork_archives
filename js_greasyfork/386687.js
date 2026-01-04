// ==UserScript==
// @name         Tan8 VIP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wing
// @match        http://www.tan8.com/yuepu-*.html
// @match        https://www.tan8.com/yuepu-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386687/Tan8%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/386687/Tan8%20VIP.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if('javascript:;'==jQuery('#btn_play').attr('href')){
       var vhref='open_yp.php?ypid='+ypid;
       jQuery('#btn_play').attr('href',vhref).attr('target','_blank').removeAttr('id');
    }
})();