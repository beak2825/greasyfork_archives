// ==UserScript==
// @name         微信公众号文章同步
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @license      MIT
// @description  检查当前页面是否是微信公众号后台，并检查是否已登录数村账号
// @author       Your Name
// @icon         https://dizuo.bsszxc.com.cn/platform/assets/logo-10c81290.png
// @match        *://mp.weixin.qq.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @resource     elementUICSS https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css
// @resource     elementIconsWoff https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/fonts/element-icons.woff
// @resource     elementIconsTtf https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/fonts/element-icons.ttf
// @resource     icon https://dizuo.bsszxc.com.cn/platform/assets/logo-10c81290.png
// @require      https://unpkg.com/vue@2.6.14/dist/vue.js
// @require      https://unpkg.com/element-ui@2.15.14/lib/index.js
// @connect      localhost
// @connect      bsszxc.com.cn
// @connect      gov-tj.com
// @connect      gov.com
// @connect      gov.com.cn
// @connect      gov.cn
// @downloadURL https://update.greasyfork.org/scripts/498832/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/498832/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 引入 Element UI 的 CSS
    const elementUICSS = GM_getResourceText("elementUICSS");
    GM_addStyle(elementUICSS);
    // 添加自定义的 CSS 来覆盖默认的字体路径
    const customCSS = `
        @font-face {
            font-family: "element-icons";
            src: url(${GM_getResourceURL("elementIconsWoff")}) format("woff"),
                 url(${GM_getResourceURL("elementIconsTtf")}) format("truetype");
            font-weight: normal;
            font-style: normal;
        }
        #floatButton {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 5px;
            background-color: #FFFFFF;
            border: 1px solid #ccc;
            border-radius: 10px;
            cursor: pointer;
        }
        #floatButton img {
            width: 35px;
            height: 35px;
            vertical-align: middle;
        }
        #popupDiv {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            padding: 20px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            display: none;
            min-width: 600px;
            max-height: 800px;
            overflow-y: auto; /* 使其可滚动 */
            flex-direction: column;
            box-sizing: border-box;
        }

        #popupContent {
            flex: 1;
            overflow-y: auto;
        }
    `;
    GM_addStyle(customCSS);

    initializeScript();

    function initializeScript() {
        const floatButton = document.createElement('button');
        floatButton.id = 'floatButton';

        const icon = document.createElement('img');
        icon.src = GM_getResourceURL('icon');
        floatButton.appendChild(icon);

        document.body.appendChild(floatButton);

        const popupDiv = document.createElement('div');
        popupDiv.id = 'popupDiv';
        floatButton.appendChild(popupDiv);

        floatButton.onclick = function(event) {
            if (!isDragging) {
                const popupInvisible = !popupDiv.style.display || popupDiv.style.display === 'none';
                eventBus.$emit('popupVisible', popupInvisible);
                popupDiv.style.display = popupInvisible ? 'flex' : 'none';
                adjustPopupDivPosition();
            }
        };

        let isDragging = false;
        let initialX, initialY, offsetX = 0, offsetY = 0;

        floatButton.onmousedown = function(event) {
            event.preventDefault();
            isDragging = false;
            let moveCount = 0;

            initialX = event.clientX;
            initialY = event.clientY;

            document.onmousemove = function(event) {
                moveCount++;
                if (moveCount > 3) { // 降低触发拖动的灵敏度
                    isDragging = true;
                }
                if (isDragging) {
                    offsetX = event.clientX - initialX;
                    offsetY = event.clientY - initialY;

                    floatButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                    adjustPopupDivPosition();
                }
            };

            document.onmouseup = function() {
                if (isDragging) {
                    const rect = floatButton.getBoundingClientRect();
                    floatButton.style.right = window.innerWidth - rect.right + 'px';
                    floatButton.style.top = rect.top + 'px';
                    floatButton.style.transform = 'none';
                }
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        floatButton.ondragstart = function() {
            return false;
        };

        function adjustPopupDivPosition() {
            const floatButtonRect = floatButton.getBoundingClientRect();
            const popupDivRect = popupDiv.getBoundingClientRect();

            if (window.innerWidth - floatButtonRect.right < popupDivRect.width) {
                popupDiv.style.left = 'auto';
                popupDiv.style.right = '0';
            } else {
                popupDiv.style.left = '0';
                popupDiv.style.right = 'auto';
            }
        }

        const popupContent = document.createElement('div');
        popupContent.id = "popupContent";
        popupDiv.appendChild(popupContent);

        popupDiv.onmousedown = function(event) {
            event.stopPropagation();
        };

        popupDiv.onclick = function(event) {
            event.stopPropagation();
        };

        // 创建事件总线
        const eventBus = new Vue();
        // 动态加载 Vue 组件
        function loadVueComponent(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "cache-control": "no-cache"
                },
                onload: function(response) {
                    const componentScript = response.responseText;
                    eval(componentScript);  // 动态执行脚本

                    if (window.remoteComponent) {
                        new Vue({
                            render: h => h(window.remoteComponent, { props: { eventBus } })
                        }).$mount('#popupContent');
                    } else {
                        console.error('remoteComponent is not defined in the loaded script.');
                    }
                },
                onerror: function(error) {
                    console.error('Error loading Vue component:', error);
                }
            });
        }

        // 加载远程 Vue 组件
        const componentUrl = 'https://dev-dizuov2.bsszxc.com.cn:60002/content/static/remote-component.js';
        loadVueComponent(componentUrl);
    }
})();