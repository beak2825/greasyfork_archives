// ==UserScript==
// @name         fb add advertiseIds
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  quick and batch to add ad account Ids in facebook developer apps
// @author       ZhaoTengchao
// @license MIT
// @match        https://developers.facebook.com/apps/*/settings/advanced/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480371/fb%20add%20advertiseIds.user.js
// @updateURL https://update.greasyfork.org/scripts/480371/fb%20add%20advertiseIds.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
    // 等待文档加载完毕后执行
    $(document).ready(function() {
        // 创建悬浮按钮
        const floatingButton = $('<button>')
        .text('Update ad account IDs')
        .css({
            position: 'fixed',
            bottom: '200px',
            right: '20px',
            padding: '10px',
            backgroundColor: '#f00',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: '9999'
        })
        .appendTo('body');

        // 点击按钮事件
        floatingButton.on('click', function() {
            // 创建弹窗
            const popup = $('<div>').css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '40px',
                backgroundColor: '#fff',
                border: '2px solid #ccc',
                borderRadius: '10px',
                width: '400px',
                height: '300px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
            });

            // 添加两个表单和按钮到弹窗
            const addInput = $('<textarea>').attr('placeholder', '待插入ID').css('margin-bottom', '20px').css('width','100%').css('height','30%').addClass('form-control');
            const deleteInput = $('<textarea>').attr('placeholder', '待删除ID').css('margin-bottom', '20px').css('width','100%').css('height','30%').addClass('form-control');
            const buttonWrapper = $('<div>').css({display: 'flex', justifyContent: 'space-between', width: '100%'});
            const addButton = $('<button>').text('确定').addClass('btn btn-primary').css('width', '30%');
            const resetButton = $('<button>').text('重置').addClass('btn btn-secondary').css('width', '30%');
            const cancelButton = $('<button>').text('取消').addClass('btn btn-secondary').css('width', '30%');

            resetButton.on('click', function() {
                addInput.val('');
                deleteInput.val('');
                localStorage.removeItem('formData'); // 清除本地存储的数据
            });

            addButton.on('click', function() {
                // 存储输入的数据到数组中
                const addValue = extractNumbers(addInput.val());
                const deleteValue = extractNumbers(deleteInput.val());
                const data = {
                    add: addValue,
                    delete: deleteValue
                };
                console.log(data);
                // 存储数据到 localStorage
                localStorage.setItem('formData', JSON.stringify(data));
                popup.remove(); // 移除弹窗
            });

            cancelButton.on('click', function() {
                popup.remove(); // 移除弹窗
            });
            // 获取之前存储的数据
            const storedData = JSON.parse(localStorage.getItem('formData'));
            if (storedData) {
                addInput.val(storedData.add); // 填充待插入ID文本框
                deleteInput.val(storedData.delete); // 填充待删除ID文本框
            }

            // 将按钮添加到按钮容器内，并将容器添加到弹窗
            buttonWrapper.append(resetButton, addButton, cancelButton);
            popup.append(addInput, deleteInput, buttonWrapper);
            $('body').append(popup);
        });
    });

    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('/settings/advanced/save')) {
            var origSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(data) {
                // 获取之前存储的数据
                const storedData = JSON.parse(localStorage.getItem('formData'));
                const myAdd = storedData.add;
                const myDelete = storedData.delete;
                if (data && myAdd && myAdd.length > 0) {
                    const addStr = "&" + addAccountIds(data, myAdd);
                    data = data + addStr;
                }
                if (data && myDelete && myDelete.length > 0) {
                    const str = removeExistingIdsFromText(data, myDelete);
                    data = str;
                }
                // 继续原始的发送请求
                origSend.call(this, data);
            };
        }
        // 继续原始的请求
        return origOpen.apply(this, arguments);
    };

    function extractNumbers(text) {
        const regex = /\d+/g;
        const matches = text.match(regex);
        return matches ? matches : [];
    }
    // 处理添加广告id时的字符串拼接方式
    function addAccountIds(text, arr) {
        const matches = text.match(/advertiser_account_ids\[(\d+)\]=(\d+)/g);
        let maxId = 0;
        const usedIds = new Set();

        if (matches) {
            matches.forEach(match => {
                const id = parseInt(match.match(/\d+/g)[0]);
                if (id > maxId) {
                    maxId = id;
                }
                usedIds.add(match.split('=')[1]);
            });
        }

        const formattedIds = arr
        .filter(id => !usedIds.has(id))
        .map((id, index) => `advertiser_account_ids[${maxId + index + 1}]=${id}`)
        .join('&');

        return formattedIds;
    }
    // 删除指定的广告id
    function removeExistingIdsFromText(text, arr) {
        const regex = /advertiser_account_ids\[(\d+)\]=(\d+)/g;
        const idSet = new Set(arr);
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (idSet.has(match[2])) {
                text = text.replace(`advertiser_account_ids[${match[1]}]=${match[2]}`, '');
            }
        }
        if(!match) {
            return text;
        }
        // 重新排序
        text = text.replace(/advertiser_account_ids\[(\d+)\]=(\d+)/g, () => {
            const nextId = idSet.values().next().value;
            return nextId ? `advertiser_account_ids[${match[1]}]=${nextId}` : '';
        });

        return text;
    }


})(jQuery);