// ==UserScript==
// @name         dnvod-ad-rm
// @namespace    https://yuxiang-zhou.github.io
// @version      0.1.4
// @description  dnvod ad remover
// @author       Yuxiang Zhou
// @match        https://www.dnvod.tv/*/Readyplay.aspx*
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371678/dnvod-ad-rm.user.js
// @updateURL https://update.greasyfork.org/scripts/371678/dnvod-ad-rm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timer = setInterval(function(){
        console.log('Start tracking ads');
        document.body.dispatchEvent(new CustomEvent('filterAds'));
        if($('form').attr('action').includes('Readyplay.aspx')){
            if($('object')){
                $('object').prependTo('body');
                $('div').hide();
                clearInterval(timer);
                console.log($('object'));
            }
        }
    }, 1000);
})();