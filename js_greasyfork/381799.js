// ==UserScript==
// @name        百度首页广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Yuchen
// @match        https://www.baidu.com/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381799/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/381799/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    clearAD();
    $('#su').click(function(){ clearAD(); });
})();

function clearAD(){
    $("#content_left>div,#content_right>div").has("a+span:contains('广告'),a>span:contains('广告')").remove();
    setTimeout(() => { $("#content_left>div,#content_right>div").has("a+span:contains('广告'),a>span:contains('广告')").remove(); }, 2333);
}