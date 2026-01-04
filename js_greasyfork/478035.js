// ==UserScript==
// @name         dxcy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dxcy功能优化
// @author       veako
// @match        https://vue.ruoyi.vip/*
// @icon         http://tampermonkey.net/favicon.ico
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/478035/dxcy.user.js
// @updateURL https://update.greasyfork.org/scripts/478035/dxcy.meta.js
// ==/UserScript==

(function() {
        'use strict';

        function addButton() {
            setTimeout(() => {
                const parentDom = document.querySelector('#app > div.app-wrapper.openSidebar > div.sidebar-container.has-logo > div.el-scrollbar.theme-dark > div.scrollbar-wrapper.el-scrollbar__wrap > div > ul');
                parentDom.insertAdjacentHTML("afterBegin", '<div><button class=""><li role="menuitem" tabindex="-1" class="el-menu-item submenu-title-noDropdown" style="padding-left: 20px; color: rgb(191, 203, 217); background-color: rgb(48, 65, 86);"><svg data-v-248913c8="" aria-hidden="true" class="svg-icon"><use data-v-248913c8="" xlink:href="#icon-dashboard"></use></svg><span>综合管理</span></li></button></div>')
            }, 1000)
        }

        function initButton() {
            setTimeout(() => {
                var parent = document.getElementById("su").parentNode
                var button = document.createElement("button");
                button.style.height = '50px'
                button.style.width = '50px'
                button.innerText = "上传";
                parent.append(button);
                button.onclick = () => {
                    console.log(1111)
                    exportCSV(1)
                };
            }, 500)
        }
        function init() {
            addButton()
        }

        // Your code here...
        init()
    }

)();