// ==UserScript==
// @name         携程apollo 1.0版本自动折叠namespace
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  携程apollo 1.0版本自动折叠namespace脚本，把match的地址改为你的apollo中心的地址
// @author       zz
// @match        http://10.1.32.112:8070/config.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382642/%E6%90%BA%E7%A8%8Bapollo%2010%E7%89%88%E6%9C%AC%E8%87%AA%E5%8A%A8%E6%8A%98%E5%8F%A0namespace.user.js
// @updateURL https://update.greasyfork.org/scripts/382642/%E6%90%BA%E7%A8%8Bapollo%2010%E7%89%88%E6%9C%AC%E8%87%AA%E5%8A%A8%E6%8A%98%E5%8F%A0namespace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.onload = function () {
        var btn = document.createElement('button');
        btn.textContent = "一键折叠Namespace";

        btn.onclick = function() {
            var eles = document.getElementsByClassName("namespace-name ng-binding");
            if (eles.length > 0) {
                var length = eles.length;
                for (var i = 0; i < length; i++) {
                    eles[i].click();
                }
            }
        }

        document.getElementsByClassName('navbar-header')[0].appendChild(btn);

        setTimeout(function() {
            btn.click();
        }, 2000);
    }
})();