// ==UserScript==
// @name         freewechat 界面精简
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://freewechat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367793/freewechat%20%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/367793/freewechat%20%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        //return;

        $('#hot-articles,#menu,#share-buttons,#share-wechat,#footer,#about-article').remove();
        //$('body > script').remove();
        $('body > div').get(1).remove();
        $('.freebrowser-ad').remove();
        $('ins').remove();

    }, 200);

})();