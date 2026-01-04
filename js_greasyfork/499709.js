// ==UserScript==
// @name         sojson_maximum
// @namespace    http://tampermonkey.net/
// @version      20250001
// @description  最大化 https://m.sojson.com/editor.html 页面 json 编辑器的窗口
// @author       hejiangyuan
// @match        https://*.sojson.com/editor.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/499709/sojson_maximum.user.js
// @updateURL https://update.greasyfork.org/scripts/499709/sojson_maximum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const t = function() {

        const height = '98vh';

        var ele = document.getElementById('jsonformatter');
        ele.style.minHeight = height;

        ele = document.getElementById('jsoneditor');
        ele.style.minHeight = height;

        const removeElementClassName = ['layui-tab', 'header-fixed', 'layout-header', 'layui-breadcrumb'];
        for (const name of removeElementClassName) {
            ele = document.getElementsByClassName(name);
            if (ele.length > 0) {
                ele[0].parentNode.removeChild(ele[0]);
            }
        }

        ele = document.getElementsByTagName('hr');
        if (ele.length > 0) {
            ele[0].parentNode.removeChild(ele[0]);
        }

        ele = document.getElementsByClassName('layout');
        if (ele.length > 0) {
            ele[0].style.paddingTop = '0';
        }

        document.body.style.overflow = 'hidden';
    }

    setInterval(t, 1000);

})();