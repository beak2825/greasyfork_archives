// ==UserScript==
// @name         u3dchina去回复提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉看帖时弹出回复
// @author       Yungs
// @match        http://*.u3dchina.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373410/u3dchina%E5%8E%BB%E5%9B%9E%E5%A4%8D%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/373410/u3dchina%E5%8E%BB%E5%9B%9E%E5%A4%8D%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var t = 0;
    var t2 = 0;
    window.onload = Delay();
    function Delay()
    {
       t = setInterval(RemoveTip,500);
       t2 = setTimeout(StopInterval,5000);
    }
    function RemoveTip(){
        var p = document.getElementById("fwin_tip");
        if (p != null)
        {
            p.remove();
            clearInterval(t);
            clearTimeout(t2);
        }
    }
    function StopInterval(){
      clearInterval(t);
        console.log("clear interval");
    }
})();