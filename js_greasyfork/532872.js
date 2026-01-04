// ==UserScript==
// @name         Nga 优化移动端显示样式
// @namespace    https://greasyfork.org/zh-CN/scripts/532872
// @author       monat151
// @license      MIT
// @version      1.2
// @description  优化移动端浏览器(PC端将浏览器宽高比调整一下刷新可以达到类似效果)中表格的显示样式
// @match        http*://bbs.nga.cn/read.php?tid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532872/Nga%20%E4%BC%98%E5%8C%96%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%98%BE%E7%A4%BA%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/532872/Nga%20%E4%BC%98%E5%8C%96%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%98%BE%E7%A4%BA%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let _PLUGIN_RUNNED = false, _INTERVAL_LOOPED = 0
    setTimeout(() => {
        const _PLUGIN_INTERVAL = setInterval(() => {
            try {
                // 将表格总宽度重置，不需要拖动
                document.querySelectorAll('.tablespacer').forEach(ele => {
                    ele.style = 'width: 100%;'
                })
                // 增加一些后期样式
                const style = document.createElement('style');
                style.innerHTML = `
                    /* 修复有时候第一楼的时间区域特别高的问题 */
                    #postInfo0 {
                        max-height: 50px;
                    }
                    /* 移除表格点击提示和粗边框 */
                    .ubbcode .tblclickadj {
                        outline: none !important;
                    }
                    .ubbcode .tblclickadj::after {
                        content: none;
                    }
                `;
                document.head.appendChild(style);
                console.log('[Nga 优化移动端显示样式] 插件运行成功。')
                window.clearInterval(_PLUGIN_INTERVAL)
            } catch (e) {
                console.warn('[Nga 优化移动端显示样式] 插件运行出错，等待重试。\n错误信息：', e)
                if (_INTERVAL_LOOPED > 30) {
                    console.error('[Nga 优化移动端显示样式] 插件运行失败次数过多，任务取消。')
                    window.clearInterval(_PLUGIN_INTERVAL)
                }
                _INTERVAL_LOOPED++
            }
        }, 100)
    }, 500)
})();