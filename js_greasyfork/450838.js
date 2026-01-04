// ==UserScript==
// @name         畅玩空间
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description   无需会员免费开启金手指功能
// @author       by小怪
// @match        https://play.wo1wan.com/*/play*
// @icon         https://play.wo1wan.com/nextgame/pc/favicon.ico
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/450838/%E7%95%85%E7%8E%A9%E7%A9%BA%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/450838/%E7%95%85%E7%8E%A9%E7%A9%BA%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // unsafeWindow = unsafeWindow || window;
    var $ = $ || window.$;
    var cw={
    };

    cw.install=function(){
        var url = location.href;

        if ($('#btn_cheat').length > 0) {
            $(document).on("click", "#btn_cheat", function () {
                if (url.indexOf("play.wo1wan.com/fcnext/play") > 0) {
                    i_YKspp_(_0x203d('0x549'), _0x203d('0x55'));
                }
                if (url.indexOf("play.wo1wan.com/gbanext/play") > 0) {
                    i_AGhct_('popwin_gamehelp', _0x26a4('0x33e'));
                }

            });
        }


        if($('#btn_voice').length > 0){
            $(document).on("click", "#btn_voice", function () {
                if (url.indexOf("play.wo1wan.com/jjnext/play") > 0) {
                    i_adwRbg(_0x1c53('0x521'), _0x1c53('0x49a'));
                }
                if (url.indexOf("play.wo1wan.com/mdnext/play") > 0) {
                    i_adwRbg(_0x1c53('0x521'), _0x1c53('0x49a'));
                }
            });
        }



    }();
    // Your code here...
})();