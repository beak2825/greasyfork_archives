// ==UserScript==
// @name         kub配置复制
// @namespace    http://tampermonkey.net/
// @version      2025-03-01
// @description  用于在 kub 页面复制配置信息
// @author       You
// @match        http://fkub.server.com/env-instance/detail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528466/kub%E9%85%8D%E7%BD%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/528466/kub%E9%85%8D%E7%BD%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = console.log.bind(console)

    function copyToClipboard(text) {
        // 创建一个临时的 textarea 元素
        const $temp = $('<textarea>');
        $('body').append($temp);

        // 设置 textarea 的内容为要复制的文本
        $temp.val(text).select();

        // 执行复制命令
        document.execCommand('copy');

        // 移除临时元素
        $temp.remove();

        console.log('已复制到剪贴板：', text);
    }

    // Your code here...
    log("---monkey_main")

    // 目标元素的选择器
    const targetSelector = '.ant-table.ant-table-small.ant-table-bordered';

    // 检查目标元素是否已加载
    function checkAndRun() {
        const elements = $(targetSelector);
        if (elements.length > 0) {
            console.log('目标元素已加载！', elements);

            // 第一个元素是 DB中间件
            const dbElement = elements[0];

            // 找到 title
            const titleEle = $(dbElement).find('.title')[0];
            log('titleEle', titleEle)

            // 创建一个 Antd 按钮
            const antdButton = $('<button>')
            .addClass('ant-btn ant-btn-primary') // Antd 按钮的类名
            .text('复制配置') // 按钮文本
            .css('margin-left', '20px') // 设置 margin-left
            .on('click', function() {
                log('按钮被点击');

                // 找到每一行
                const table = $(targetSelector)[0];
                const rows = $(table).find('.ant-table-row.ant-table-row-level-0');
                log('行数', rows.length);

                // 形成字典
                let confMap = {}

                // 每一行找 类型
                for (let i=0; i<rows.length; i++) {
                    const row = rows[i];

                    // 类型
                    const typeCell = $(row).find('.ant-table-cell')[3];
                    log('类型', typeCell.textContent);
                    let typeText = typeCell.textContent

                    // 地址
                    const addrCell = $(row).find('.ant-table-cell')[4];
                    const text = addrCell.textContent

                    const leftIndex = text.indexOf('(');
                    const rightIndex = text.indexOf(')');

                    let addr = ''
                    if (leftIndex !== -1 && rightIndex !== -1 && rightIndex > leftIndex) {
                        addr = text.slice(leftIndex + 1, rightIndex);
                    }

                    log('地址', addr);

                    // 端口
                    const portCell = $(row).find('.ant-table-cell')[5];
                    log('端口', portCell.textContent);
                    let portText = portCell.textContent;

                    //
                    confMap[`${typeText}_addr`] = `test_${addr}:${portText}`
                }


                // 找 cluster 标签
                let labels = $('body').find('.ant-descriptions-item-label')
                for (let i=0; i<labels.length; i++) {
                    const label = labels[i]
                    log('label', i, label.textContent)
                    if (label.textContent.trim() === "路由标签") {
                        let clusterItem = $(label).siblings('.ant-descriptions-item-content')[0]
                        log('cluster', clusterItem.textContent)
                        confMap['cluster'] = clusterItem.textContent
                        break;
                    }
                }



                // 打印配置
                log('conf', confMap)
                copyToClipboard(JSON.stringify(confMap, null, 4))


            });

            // 将按钮添加到目标元素中
            $(titleEle).append(antdButton);

            // 停止监听（如果只需要执行一次）
            observer.disconnect();
        }
    }

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(function(mutations) {
        console.log('DOM 发生变化，检查目标元素是否加载...');
        checkAndRun();
    });

    // 开始监听 DOM 变化
    observer.observe(document.body, {
        childList: true,    // 监听子节点的变化
        subtree: true       // 监听整个子树
    });

    // 初始检查（如果元素已经存在）
    checkAndRun();
})();