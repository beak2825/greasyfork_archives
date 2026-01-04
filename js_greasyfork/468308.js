// ==UserScript==
// @name         CNVD_Modify
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  CNVD添加复制漏洞列表页面单个或所有漏洞标题、优化用户中心已提交漏洞展示和复制漏洞编号
// @author       Mrxn
// @homepage     https://mrxn.net/
// @supportURL   https://github.com/Mr-xn/CNVD_Modify
// @license      MIT
// @run-at       document-end
// @match        https://www.cnvd.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnvd.org.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468308/CNVD_Modify.user.js
// @updateURL https://update.greasyfork.org/scripts/468308/CNVD_Modify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function copy_all_vuln_title(){
        // 获取表格元素
        const table = document.querySelector('.tlist');

        // 获取表格中的thead和tbody元素
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        // 获取所有的tr元素
        const trList = tbody.querySelectorAll('tr');

        // 获取表格中的第一个th元素
        const th = thead.querySelector('th:first-child');

        // 创建复制按钮
        const btn = document.createElement('button');
        btn.textContent = '复制所有标题';

        // 给复制按钮设置样式
        btn.style.position = 'relative';
        btn.style.top = 0;
        btn.style.right = 0;
        btn.style.paddingLeft = '10px';

        // 给复制按钮添加点击事件
        btn.addEventListener('click', () => {
            // 创建一个数组，用于保存所有的title属性值
            const titles = [];
            // 遍历所有的tr元素
            trList.forEach(tr => {
                // 获取当前tr元素下的第一个td元素
                const td = tr.querySelector('td:first-child');
                // 如果当前td元素下有a标签
                const a = td.querySelector('a');
                if (a) {
                    // 将a标签的title属性值添加到数组中
                    titles.push(a.getAttribute('title') || a.outerText);
                }
            });
            // 将title属性值以换行符为分隔符合并为一个字符串
            const text = titles.join('\n');
            // 创建一个临时的textarea元素
            const textarea = document.createElement('textarea');
            // 将合并后的字符串赋值给textarea元素的value属性
            textarea.value = text;
            // 将textarea元素添加到页面中
            document.body.appendChild(textarea);
            // 选中textarea元素中的文本
            textarea.select();
            // 复制选中的文本
            document.execCommand('copy');
            // 删除临时的textarea元素
            document.body.removeChild(textarea);
        });

        // 将复制按钮添加到th元素中
        th.appendChild(btn);
    }

    function user_copy(){
        // 判断当前页面是否为 https://www.cnvd.org.cn/
        if (window.location.href.startsWith('https://www.cnvd.org.cn/')) {
            //优化用户中心的已提交漏洞列表展示
            var elements = document.querySelectorAll('.tlist th, .tlist td');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.padding = '0';
            }

            //优化漏洞列表页面给每条漏洞前面添加复制按钮
            // 获取所有的td元素
            const tdList = document.querySelectorAll('tbody td');

            // 遍历所有的td元素
            tdList.forEach(td => {
                // 获取a标签元素
                const a = td.querySelector('a');
                if (!a) {
                    return;
                }
                // 创建复制按钮
                const btn = document.createElement('button');
                btn.textContent = '复制';

                // 给复制按钮设置样式
                btn.style.position = 'relative';
                btn.style.top = 0;
                btn.style.right = 0;

                // 根据a标签的href属性判断复制的内容
                if (a.getAttribute('href').startsWith('/flaw/show/')) {
                    //复制单独的每一条漏洞标题
                    // 复制a标签的title属性
                    btn.addEventListener('click', () => {
                        // 创建一个临时的textarea元素
                        const textarea = document.createElement('textarea');
                        // 将a标签的title属性赋值给textarea元素的value属性
                        textarea.value = a.getAttribute('title') || a.outerText;
                        // 将textarea元素添加到页面中
                        document.body.appendChild(textarea);
                        // 选中textarea元素中的文本
                        textarea.select();
                        // 复制选中的文本
                        document.execCommand('copy');
                        // 删除临时的textarea元素
                        document.body.removeChild(textarea);
                    });
                } else if (a.getAttribute('href').startsWith('/user/myreport/')) {
                    // 复制a标签的文本内容
                    btn.addEventListener('click', () => {
                        // 创建一个临时的textarea元素
                        const textarea = document.createElement('textarea');
                        // 将a标签的文本内容赋值给textarea元素的value属性
                        textarea.value = a.textContent;
                        // 将textarea元素添加到页面中
                        document.body.appendChild(textarea);
                        // 选中textarea元素中的文本
                        textarea.select();
                        // 复制选中的文本
                        document.execCommand('copy');
                        // 删除临时的textarea元素
                        document.body.removeChild(textarea);
                    });
                } else {
                    // 如果a标签的href属性既不以/flaw/show/开头，也不以/user/myreport/开头，则不添加复制按钮
                    return;
                }

                // 将复制按钮添加到td元素中
                td.appendChild(btn);
            });
        }
    }
    function run(){
        if (window.location.href.startsWith('https://www.cnvd.org.cn/')){
            user_copy();
        }
        if (window.location.href.includes('/flaw/list') || window.location.href.includes('/flaw/flawListByManu')) {
            //添加复制所有漏洞标题按钮
            copy_all_vuln_title();
        }
    }
    function Surveillance(){
        // 监视 table 内容的变化
        const observer = new MutationObserver(function(mutationsList, observer) {
            // 遍历每一个变化
            for (let mutation of mutationsList) {
                // 如果变化发生在 table 中，则执行某个函数
                if (mutation.target.nodeName === 'TABLE') {
                    return true;
                }
            }
        });

        // 配置 MutationObserver 监听 table 内容的变化
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);

    }

    //开始运行
    run();

})();