// ==UserScript==
// @name         删除题解
// @namespace    https://greasyfork.org/zh-CN/scripts/504749-%E5%88%A0%E9%99%A4%E9%A2%98%E8%A7%A3
// @version      0.1.0
// @description  在洛谷删除“查看题解”按钮。
// @author       dctc1494
// @match        *://www.luogu.com.cn/problem/*
// @icon         data:image/svg+xml;base64,PHN2ZyBkYXRhLXYtMTE0MzcxNGI9IiIgZGF0YS12LTA2NDAxMjZjPSIiIGFyaWEtaGlkZGVuPSJ0cnVlIiBmb2N1c2FibGU9ImZhbHNlIiBkYXRhLXByZWZpeD0iZmFzIiBkYXRhLWljb249ImJvb2siIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDQ4IDUxMiIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWJvb2siPjxwYXRoIGRhdGEtdi0xMTQzNzE0Yj0iIiBkYXRhLXYtMDY0MDEyNmM9IiIgZmlsbD0iY3VycmVudENvbG9yIiBkPSJNOTYgMEM0MyAwIDAgNDMgMCA5NlY0MTZjMCA1MyA0MyA5NiA5NiA5NkgzODRoMzJjMTcuNyAwIDMyLTE0LjMgMzItMzJzLTE0LjMtMzItMzItMzJWMzg0YzE3LjcgMCAzMi0xNC4zIDMyLTMyVjMyYzAtMTcuNy0xNC4zLTMyLTMyLTMySDM4NCA5NnptMCAzODRIMzUydjY0SDk2Yy0xNy43IDAtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMyem0zMi0yNDBjMC04LjggNy4yLTE2IDE2LTE2SDMzNmM4LjggMCAxNiA3LjIgMTYgMTZzLTcuMiAxNi0xNiAxNkgxNDRjLTguOCAwLTE2LTcuMi0xNi0xNnptMTYgNDhIMzM2YzguOCAwIDE2IDcuMiAxNiAxNnMtNy4yIDE2LTE2IDE2SDE0NGMtOC44IDAtMTYtNy4yLTE2LTE2czcuMi0xNiAxNi0xNnoiIGNsYXNzPSIiPjwvcGF0aD48L3N2Zz4=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504749/%E5%88%A0%E9%99%A4%E9%A2%98%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/504749/%E5%88%A0%E9%99%A4%E9%A2%98%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function remove(){
        var xpath = "/html/body/div/div[2]/main/div/section[1]/div[1]/a[2]";

        var iterator = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

        var element;
        while (element = iterator.iterateNext()) {
            if (element) {
                element.parentNode.removeChild(element);
            }
        }
    }

    window.addEventListener("load", () => {
        remove();
    });
})();
