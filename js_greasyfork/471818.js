// ==UserScript==
// @name         meterphere 助手
// @license MIT
// @namespace    https://github.com/hao1032/tmScript
// @homepage     https://github.com/hao1032/tmScript
// @supportURL   https://github.com/hao1032/tmScript
// @version      0.5
// @description  metershpere 辅助
// @author       hao1032
// @include      *://ms.*.cc/*
// @match        https://cloud.metersphere.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=metersphere.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471818/meterphere%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471818/meterphere%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通过递归获取 row 节点下 value 所在节点
    function getValueChildNodeOfRow(node) {
        parent = node.parentNode
        if (!parent.classList.contains('el-row')) {
            return getValueChildNodeOfRow(parent);
        }
        return node
    }

    function addBtn() {


        console.log('show shortcuts!');

        // 获取非禁用的 input 节点
        var valueInputs = document.querySelectorAll('input[placeholder=值]:not([disabled=disabled])');
        valueInputs.forEach(function(input) {
            var valueNodeOfRow = getValueChildNodeOfRow(input);  // row 节点下 value 所在节点
            var row = valueNodeOfRow.parentNode;  // row 节点
            if(row.querySelector('i#flagflagflag')) {
                return
            }

            var valueIndex = Array.prototype.indexOf.call(row.children, valueNodeOfRow);  // value所在节点在 row 下的索引
            var firstInput = row.querySelector('input.el-input__inner');  // 第一个 input，里面有需要的字段值

            // 创建可以点击自动填写的按钮
            var auto = document.createElement('div');
            auto.style = 'padding-top: 10px;';
            auto.innerHTML = '<i id="flagflagflag" class="el-tooltip el-icon-d-arrow-right"></i>';
            auto.onclick = function() {
                var keyName = firstInput.value;
                if(keyName.includes('accessToken')) {
                    var projectName = document.querySelector('div.el-submenu__title').textContent;
                    if(projectName.includes('运营后台')) {
                        keyName = 'adminAccessToken';
                    } else if(projectName.includes('管理中台')) {
                        keyName = 'govAccessToken';
                    }
                }
                input.value = "${" + keyName + "}";
                input.dispatchEvent(new InputEvent("input"));
            };
            row.insertBefore(auto, valueNodeOfRow);  // 将按钮插入到 value 前面
        })

    }

    window.onkeydown = function (event) {
        if(event.shiftKey && event.keyCode === 65){
            console.log('保存成功');
            addBtn();
        }
    }
})();