// ==UserScript==
// @name         淘宝自动领淘金币
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Yulei, Haiifenng
// @match        https://taojinbi.taobao.com/index.htm*
// @grant        none
// @icon		 http://www.taobao.com/favicon.ico
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369944/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E9%A2%86%E6%B7%98%E9%87%91%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/369944/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E9%A2%86%E6%B7%98%E9%87%91%E5%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window._Q = function(e){
        return $(e).get(0);
    };

    function gotoLoginPage() {
        window.location = "https://login.taobao.com/member/login.jhtml?f=top&redirectURL=https%3A%2F%2Ftaojinbi.taobao.com%2Findex.htm";
    }

    setInterval(function(){
        gotoLoginPage();
    }, 10*60*1000);//每十分钟跳转一次登录页面

    function TDey(fn, n) {
        setTimeout(fn, n * 1e3)
    }

    function MEvt(sx, sy, cx, cy, e) {
        if (_Q(e)) {
            var MEvent = document.createEvent("MouseEvent");
            MEvent.initMouseEvent("mousedown", true, true, this, 1, sx, sy, cx, cy, false, false, false, false, 0, null);
            _Q(e).dispatchEvent(MEvent);
            _Q(e).click();
        }
    }

    var nn = 0;

    function MEv(sx, sy, cx, cy, e) {
        var MEvent = document.createEvent("MouseEvent");
        MEvent.initMouseEvent("mousemove", true, true, this, 0, sx, sy, cx, cy, false, false, false, false, -1, null);
        _Q(e).dispatchEvent(MEvent);
    }
    TDey(function () {
        //debugger
        if (_Q('.J_GoTodayBtn')){
            for (var i = 0; i < 9; ++i) { //Log(i);
                MEv(30, 249, 30, 154, "div.my-coin");
                MEv(30, 249, 30, 58, "img");
                MEv(96, 249, 96, 154, "p.lg-2.info.J_Coin");
                MEv(97, 249, 97, 154, "p.lg-2.info.J_Coin");
                MEv(101, 52, 101, 157, "p.lg-2.info.J_Coin");
                MEv(117, 265, 117, 165, "a");
            }
            MEvt(300, 429, 300, 333, '.J_GoTodayBtn');
        }
        if(_Q('.J_GoLoginBtn')){
            gotoLoginPage();
        }
    }, 7);

})();