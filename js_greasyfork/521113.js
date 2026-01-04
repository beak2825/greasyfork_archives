// ==UserScript==
// @name         OA字段提取
// @version      202412181113
// @description  在页面上添加一个按钮，提取符合条件的字段值并复制到剪贴板。
// @author       qhq
// @match        https://*.ztna-dingtalk.com/spa/workflow/static4form/*
// @icon         data:image/x-icon;base64,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/////////////+Lj+f+cl+z//////+fn+v9kWOH////////////4+f3/OSfY/y4W1v8tFtaKLhbW/y4W1v9GNtv/ioLo/9vb+P//////al7i/y4W1v8uFtb/LhbW/7278v/+/v7/m5Ts/4qC6P9iVOD/LhbW/zIh1//8/P7/+/v+/+rt+//3+P3//////2Nc4f/v7/z/7/H8/zgo2P+EfOf/3d74//z9/v9FM9r/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/hn7n//////+XkOv/LhbW/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/Z1/j/OirY/7a28f//////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v9bTt///v7+/8TC8/8uFtb/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/zom2P/29/3/6+z7/zId1/8uFtb/LhbW/7278v/+/v7/Szfb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n/+vr+/73A8/+7vvL/6+37//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/LhbW/9jZ9//+/v7/TDzc/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f///////////////////////P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v8uFtb/r6vv//////92bOT/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5//f4/f+Zmuv/l5br/+Di+f/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v9vZeP/4N75/+De+f/w8Pz//////+7t+//g3vn/4N75//X1/f/+/v7/5eP6/+De+f+Tier/LhbW/zIh1//8/P7/+fn9/+De+f/09Pz//////1JF3f/j4/n/7/H8/zIe1/8uFtb/wcHz//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/5iQ6////////////////////////////////////////////////////////////6Wb7f8uFtb/MiHX//z8/v//////////////////////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/Py7Z/3hu5f95b+X/eW/l/3lv5f+vrfD//////6+t8P95b+X/eW/l/3lv5f95b+X/WEne/y4W1v8yIdf//Pz+/+Xk+v95b+X/zs71//////9SRd3/4+P5//n6/v+ytfD/sLPw/+jq+v/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/0g22/9aSt//RjTb/4J65///////gnrn/0Y02/9aSt//SDbb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n///////////////////////z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v83JNj/6er7//z9/v/a2/j/g33n//////+Dfef/2dv4//z9/v/p6/v/NyPY/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f/4+f3/o6Xt/6Gh7f/k5vr//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/3ty5f/+/v7//P3+/8jJ9P+Ce+f//////4J85//HyPT//P3+//7+/v97cuX/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uF9b/0ND2//////9+dub/Mx3X/4J65///////gnrn/zMd1/9+dub//////9DQ9v8uFtb/LhbW/zIh1//8/P7/1tT3/4R/5//s7vv//////1JF3f/j4/n/7/H8/zYm2P9CN9r/yMr0//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/1ZI3v/9/f7/5+j6/zUg1/8uFtb/gnrn//////+Ceuf/LhbW/zQg1//n6Pr//f3+/1ZI3v8uFtb/MiHX//z8/v/W1Pf/wr7z///////+/v7/Szzc/+Pj+f/v8fz/oqHt//j5/f/9/f7//P3+/0Uz2v8uFtb/LRbWii4W1v8uFtb/VUve/4OA5/9jWuH/LhbW/y4W1v+Ceuf//////4J65/8uFtb/LhbW/2Na4f+DgOf/VUve/y4W1v8wG9b/gn/n/3Nt5P9VR97/g4Dn/3dx5f8vGNb/4+P5/+/x/P+mpe7////////////r7fv/NCDX/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/zcm2P9EO9v/NybY/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v9BNtr/Qjna/zMg1/9EO9v/RDvb/zor2P8uFtb/LhbW/y4W1YguFtbcLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbWZi4W1l4tFtb4LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1tAuFtYO//x////AA//+AAD/+AAAP/AAAA/gAAAHwAAAA4AAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAE=
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/9065
// @downloadURL https://update.greasyfork.org/scripts/521113/OA%E5%AD%97%E6%AE%B5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521113/OA%E5%AD%97%E6%AE%B5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建观察器，监测 DOM 变化
    const observer = new MutationObserver((mutationsList, observer) => {
        const targetButton = document.querySelector('button[title="传阅"]');
        if (targetButton) {
            // 如果目标按钮已存在，停止观察
            observer.disconnect();

            // 找到目标按钮的父级 <span> 外层容器
            const targetSpan = targetButton.closest('span');
            if (!targetSpan) {
                console.warn("未找到目标按钮的外层 <span> 容器！");
                return;
            }

            // 创建新的外层 <span>
            const copyButtonSpan = document.createElement('span');
            copyButtonSpan.style.display = 'inline-block';
            copyButtonSpan.style.lineHeight = '28px';
            copyButtonSpan.style.verticalAlign = 'middle';
            copyButtonSpan.style.marginLeft = '10px';

            // 创建新按钮
            const copyButton = document.createElement('button');
            copyButton.className = targetButton.className; // 复制样式
            copyButton.title = "复制隐藏值";
            copyButton.type = "button";
            copyButton.innerHTML = '<div class="wf-req-top-button">复 制</div>';


            // 点击按钮后执行操作
            copyButton.addEventListener('contextmenu', () => {
                // 获取所有隐藏的 input 元素
                const inputs = document.querySelectorAll('input[type="hidden"]');

                // 定义一个数组用于存储结果
                let results = [];

                // 遍历并匹配特定模式的 id
                inputs.forEach(input => {
                    const match = input.id.match(/^field(\d+)$/); // 正则匹配：提取数字部分
                    if (match) {
                        results.push(`${match[1]}\t${input.value}`); // 使用提取的数字部分
                    }
                });

                // 将结果拼接为字符串
                const output = results.join('\n');

                if (output) {
                    // 复制到剪贴板
                    GM_setClipboard(output);
                    alert('结果已复制到剪贴板！\n' + output);
                } else {
                    alert('未找到符合条件的值！');
                }
            });

            copyButton.addEventListener('click', () => {
                // 获取所有包含 data-fieldmark 属性且匹配特定模式的元素
                const elements = document.querySelectorAll('[data-fieldmark^="field"]'); // 选择器匹配 data-fieldmark 以 "field" 开头的元素

                // 定义一个数组用于存储结果
                let results = [];

                // 遍历找到的元素，提取 data-fieldmark 和元素内的文字内容
                elements.forEach(element => {
                    const fieldmark = element.getAttribute('data-fieldmark'); // 获取 data-fieldmark 值
                    const match = fieldmark.match(/^field(\d+)$/); // 正则匹配提取数字部分
                    if (match) {
                        const textContent = element.textContent.trim(); // 提取元素下的文字内容，去除多余空格
                        results.push(`${match[1]}\t${textContent}`); // 格式：数字\t文字内容
                    }
                });

                // 将结果拼接为字符串
                const output = results.join('\n');

                if (output) {
                    // 复制到剪贴板
                    GM_setClipboard(output);
                    alert('结果已复制到剪贴板！\n' + output);
                } else {
                    alert('未找到符合条件的元素或内容！');
                }
            });

            // 将新按钮添加到 <span> 中
            copyButtonSpan.appendChild(copyButton);

            // 将新 <span> 插入到目标按钮的 <span> 外层之前
            targetSpan.parentNode.insertBefore(copyButtonSpan, targetSpan);
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, { childList: true, subtree: true });
})();
