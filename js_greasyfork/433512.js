// ==UserScript==
// @name         3dm去广告
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  3dm去广告a
// @author       mfk
// @require https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @match        https://bbs.3dmgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/433512/3dm%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433512/3dm%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //setInterval(function(){

       $(".a_cn").remove();
       $(".a_h").remove();
       $(".a_f").remove();
       $(".a_pt").remove();
       // },1000)
})();