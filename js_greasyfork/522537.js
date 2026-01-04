// ==UserScript==
// @name         网页灯笼效果（不阻挡点击）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在所有网页上添加春节灯笼效果，且不阻挡页面点击
// @author       ZoeKyHein
// @license     MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522537/%E7%BD%91%E9%A1%B5%E7%81%AF%E7%AC%BC%E6%95%88%E6%9E%9C%EF%BC%88%E4%B8%8D%E9%98%BB%E6%8C%A1%E7%82%B9%E5%87%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522537/%E7%BD%91%E9%A1%B5%E7%81%AF%E7%AC%BC%E6%95%88%E6%9E%9C%EF%BC%88%E4%B8%8D%E9%98%BB%E6%8C%A1%E7%82%B9%E5%87%BB%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 创建灯笼HTML
        const lanternHTML = `
            <!-- 灯笼1 -->
            <div class="deng-box">
                <div class="deng">
                    <div class="xian"></div>
                    <div class="deng-a">
                        <div class="deng-b"><div class="deng-t">新</div></div>
                    </div>
                    <div class="shui shui-a"><div class="shui-c"></div><div class="shui-b"></div></div>
                </div>
            </div>

            <!-- 灯笼2 -->
            <div class="deng-box1">
                <div class="deng">
                    <div class="xian"></div>
                    <div class="deng-a">
                        <div class="deng-b"><div class="deng-t">年</div></div>
                    </div>
                    <div class="shui shui-a"><div class="shui-c"></div><div class="shui-b"></div></div>
                </div>
            </div>
        `;

        // 创建容器div
        const container = document.createElement('div');
        container.innerHTML = lanternHTML;

        // 将灯笼添加到页面底部
        document.body.appendChild(container);

        // 动态加载CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdn.jsdmirror.com/gh/muzihuaner/deng@main/deng.css';
        document.head.appendChild(link);

        // 添加样式确保灯笼位置合适且不阻挡点击
        const style = document.createElement('style');
        style.textContent = `
            .deng-box, .deng-box1 {
                position: fixed;
                z-index: 9999;
                pointer-events: none; /* 关键：使灯笼不阻挡点击 */
            }
            .deng-box {
                left: 5%;
                top: 0;
            }
            .deng-box1 {
                right: 5%;
                top: 0;
            }
            /* 确保灯笼内部的元素也不阻挡点击 */
            .deng-box *, .deng-box1 * {
                pointer-events: none;
            }
            .deng-t{
            font-family: 华文行楷,华文楷体,Arial,Lucida Grande,Tahoma,sans-serif;
            }
        `;
        document.head.appendChild(style);
    });
})();
