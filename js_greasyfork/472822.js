// ==UserScript==
// @name         Remove Glassfy Charts
// @name:zh-CN   移除 Glassfy 图表
// @namespace    http://gewill.org/
// @version      0.2
// @description  Delete Glassfy Charts, fullly show sales reports list.
// @description:zh-CN  删除 Glassfy 图表，完整显示销售报告列表。
// @author       Ge Will
// @match        *://dashboard.glassfy.io/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzQyOV8xMTEyOCkiPg0KPHBhdGggZD0iTTIwIDMuOTk5OTRINEw5LjYgMTEuNDY2NkM5Ljg1OTY0IDExLjgxMjggMTAgMTIuMjMzOSAxMCAxMi42NjY2VjE5Ljk5OTlMMTQgMTcuOTk5OVYxMi42NjY2QzE0IDEyLjIzMzkgMTQuMTQwNCAxMS44MTI4IDE0LjQgMTEuNDY2NkwyMCAzLjk5OTk0WiIgc3Ryb2tlPSIjMjkyOTI5IiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPC9nPg0KPGRlZnM+DQo8Y2xpcFBhdGggaWQ9ImNsaXAwXzQyOV8xMTEyOCI+DQo8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIi8+DQo8L2NsaXBQYXRoPg0KPC9kZWZzPg0KPC9zdmc+
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472822/Remove%20Glassfy%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/472822/Remove%20Glassfy%20Charts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        // 定义用于标识 div 元素的类名
        const divClassName = "col-lg-6";

        // 查找并移除具有指定类名的 div 元素
        const divElementsToRemove = document.querySelectorAll(`div.${divClassName}`);
        divElementsToRemove.forEach(element => {
            element.remove();
        });

        // 查找并移除 ngb-alert 元素
        const ngbAlertElementsToRemove = document.querySelectorAll('ngb-alert');
        ngbAlertElementsToRemove.forEach(element => {
            element.remove();
        });
    }

    // 每隔3秒执行一次移除操作
    setInterval(removeElements, 3000);
})();
