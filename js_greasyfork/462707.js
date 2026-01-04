// ==UserScript==
// @name         放开飞书复制和右键
// @license      GPL License
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  让飞书文档不受权限限制，可以复制任意内容，可以打开右键菜单(复制下载图片)，
// @author       masonlee
// @match        *://*.feishu.cn/*
// @icon         https://sf3-scmcdn2-cn.feishucdn.com/ccm/pc/web/resource/bear/src/common/assets/favicons/icon_file_doc_nor-32x32.8cb0fef16653221e74b9.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/462707/%E6%94%BE%E5%BC%80%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/462707/%E6%94%BE%E5%BC%80%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE.meta.js
// ==/UserScript==
 
(function() {
    console.log('已放开飞书文档的复制和右键屏蔽！！！！');
    document.addEventListener('DOMContentLoaded', function () {
        const rawAddEventListener = document.addEventListener;
        document.addEventListener = function (type, listener, options) {
            if(type === 'copy') {
                rawAddEventListener.call(
                    document,
                    type,
                    event => {
                        return null;
                    },
                    options,
                );
                return
            }
            rawAddEventListener.call(
                document,
                type,
                listener,
                options,
            );
        };
 
        const bodyAddEventListener = document.body.addEventListener;
        document.body.addEventListener = function (type, listener, options) {
            bodyAddEventListener.call(
                document.body,
                type,
                event => {
                    if (type === 'contextmenu') {
                        return true;
                    }
                    return listener(event);
                },
                options,
            );
        };
    });
})();