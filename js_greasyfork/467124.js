// ==UserScript==
// @name         Design Portal Assist
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Design Portal Assist!
// @author       Sean
// @match        https://oa.epoint.com.cn/interaction-design-portal/portal/pages/casestemplates/casetemplatesdetail*
// @icon         https://oa.epoint.com.cn/interaction-design-portal/portal/pages/style/images/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467124/Design%20Portal%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/467124/Design%20Portal%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle() {
        // 注入样式：增加按钮
        let injectStyle = ".content { position: relative; } .front-proto { position: absolute; top: 20px; right: 20px; width: 106px; height: 36px; border-radius: 4px; cursor: pointer; line-height: 36px; background: #25c2c9; color: #fff; text-align: center; font-size: 14px}";


        // 添加注入样式
        let extraStyleElement = document.createElement("style");
        extraStyleElement.innerHTML = injectStyle;
        document.head.appendChild(extraStyleElement);
    }

    function getUrlParameters() {
        var params = {};
        var search = window.location.search.substring(1);
        var urlParams = search.split('&');

        for (var i = 0; i < urlParams.length; i++) {
            var param = urlParams[i].split('=');
            var paramName = decodeURIComponent(param[0]);
            var paramValue = decodeURIComponent(param[1] || '');
            params[paramName] = paramValue;
        }

        return params;
    }

    window.onload = ()=> {
        addStyle();

        const $content = jQuery('.content');

        $content.append('<div class="front-proto">前端原型</div>');

        const $frontBtn = jQuery('.front-proto', $content);

        $frontBtn.on('click', ()=> {
            window.open('http://192.168.0.200/fe3project?filter=' + getUrlParameters().guid);
        });

    };
})();