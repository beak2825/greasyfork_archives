// ==UserScript==
// @name         drive.google Image find
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *.googleusercontent.com/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374352/drivegoogle%20Image%20find.user.js
// @updateURL https://update.greasyfork.org/scripts/374352/drivegoogle%20Image%20find.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let src=window.location.href;
    let block='<div  style="background:#fff;padding:0 5px;position: fixed;z-index: 10000;left: 10px;top: 10px;">'+
                     '<a href="https://www.google.com/searchbyimage?image_url='+(src)+'" target="_blank">Искать в гугле</a><br>'+
                     '<a href="https://yandex.ru/images/search?rpt=imageview&cbird=1&img_url='+encodeURIComponent(src).replace(/%20/g,'+')+'" target="_blank">Искать в яндекс</a>'+
                    '</div>';
    $('body').append(block);
})();