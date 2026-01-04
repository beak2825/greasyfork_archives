// ==UserScript==
// @name         Change the font of piaotian.com
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  更改飘天网小说阅读页面字体
// @author       Yang Li
// @match        http://www.piaotian.com/html/*
// @match        https://www.piaotian.com/html/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/370125/Change%20the%20font%20of%20piaotiancom.user.js
// @updateURL https://update.greasyfork.org/scripts/370125/Change%20the%20font%20of%20piaotiancom.meta.js
// ==/UserScript==

$(document).ready(function(){
    // v0.1
    //$myfont='font: 26px STKaiti, serif !important; line-height: 1.4 !important;';
    //$mywidth='width: 800px !important;';

    // v0.2.4
    // Improvements for mobile
    $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1" />');
    $myFont='font: 1.5em STKaiti, serif; line-height: 1.4;';
    $myWidth='width: 80%;';
    $('#main #content').attr('style', $myFont + $myWidth);
//     $('#main #content').attr('style', $myFont);
});