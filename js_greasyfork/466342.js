// ==UserScript==
// @name         LuoguO2Enabler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically enable O2 in luogu problems
// @author       2_3_3
// @match        https://www.luogu.com.cn/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/466342/LuoguO2Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/466342/LuoguO2Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function wait(calb, cond) {
        if (cond()) {
            return calb();
        } else {
            setTimeout(function() {
                wait(calb, cond);
            }, 0);
        }
    }
    wait(function() {
        let t = document.getElementsByTagName("input");
        for (let i = 0; i < t.length; i++) {
            if (t[i].id !== "") {
                $("#" + t[i].id).click();
            }
        }
    }, function() {
        if (location.href.split('#').length !== 2) {
            return false;
        }
        let t = document.getElementsByTagName("input");
        for (let i = 0; i < t.length; i++) {
            if (t[i].id !== "") {
                return true;
            }
        }
        return false;
    });
})();