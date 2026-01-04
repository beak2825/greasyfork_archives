// ==UserScript==
// @name         wanwansub
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  wanwansub去广告
// @author       You
// @match        http://wanwansub.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409787/wanwansub.user.js
// @updateURL https://update.greasyfork.org/scripts/409787/wanwansub.meta.js
// ==/UserScript==
 
(function ( ) {
    'use strict';
    var $ = $ || window.$;
    let isrun = false;
    function noad() {
         if (isrun) return;
        console.log('noad');
        isrun = true;
        function subnoad(csspath) {
            const ad1 = $(csspath);
            if (ad1.length > 0)
                ad1.css('display', 'none');
        }

        const ad1 = $('body > div:nth-child(5)');
            if (ad1.length == 0)
            {
                console.log('return noad');
                isrun = false;
                return;
            }

        subnoad('body > div:nth-child(7)');
        subnoad('body > div:nth-child(6)');
        subnoad('body > div:nth-child(5)');

        isrun = false;
    }

    noad();
    //$('body').bind('DOMNodeInserted', noad);
    const config = { //attributes: true,
                    childList: true,
                    //subtree: true
    };
    const observer = new MutationObserver(noad);
    observer.observe($('body')[0], config);
    // Your code here...
})( );