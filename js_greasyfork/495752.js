// ==UserScript==
// @name         dingtalk文档图片预览
// @description  点击任意dingtalk文档内的图片,即可预览大图
// @namespace    img_viewer
// @license      MIT
// @version      1.2.0
// @author       Deyu
// @match        *://alidocs.dingtalk.com/iframe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dingtalk.com
// @require      https://cdn.jsdelivr.net/npm/viewerjs@1.11.6/dist/viewer.min.js
// @resource     viewerCss https://cdn.jsdelivr.net/npm/viewerjs@1.11.6/dist/viewer.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/495752/dingtalk%E6%96%87%E6%A1%A3%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495752/dingtalk%E6%96%87%E6%A1%A3%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const win = unsafeWindow
    // const NAME = "img_viewer_for_dingtalk"
    const css = GM_getResourceText("viewerCss")
    GM_addStyle(css)
    let isViewed = false
    win.document.body.addEventListener('click', function(event) {
        const target = event.target;
        // console.log(NAME, isViewed, target.tagName)
        if (!isViewed && target.tagName === 'IMG') {
            const viewer = new Viewer(target, {
                inline: false,
                viewed() {
                    isViewed = true
                    viewer.zoomTo(1);
                },
                hidden() {
                    isViewed = false
                    viewer.destroy()
                }
            });
            viewer.show();
        }
    });
})();