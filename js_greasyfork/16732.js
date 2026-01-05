// ==UserScript==
// @name         每日签到 deepss.org
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  daily checkIn on deepss.org
// @author       superfun
// @match        https://www.deepss.org/user*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16732/%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0%20deepssorg.user.js
// @updateURL https://update.greasyfork.org/scripts/16732/%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0%20deepssorg.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$().ready( function(){
    setTimeout(function(){
        $('.gt_holder').css("display","block");
        $('.gt_holder').css("opacity","1");
    },1000)
    
} )