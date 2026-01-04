// ==UserScript==
// @name         Steam鉴赏家列表排序
// @namespace    https://steamcommunity.com/id/GarenMorbid/
// @version      1.4
// @description  Steam鉴赏家列表排序~
// @author       Garen
// @match        https://store.steampowered.com/curator/*/admin/lists_manage
// @match        https://store.steampowered.com/curator/*/admin/lists_edit/*
// @grant        none
// @license Garen
// @downloadURL https://update.greasyfork.org/scripts/546370/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/546370/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '更新排序';
    button.style.marginLeft = '10px';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    // 创建弹出层
    function createModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            display: none;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 90%;
        `;

        // App IDs 输入框
        const appIdLabel = document.createElement('div');
        appIdLabel.textContent = 'App IDs (英文逗号分隔):';
        appIdLabel.style.marginBottom = '5px';
        appIdLabel.style.fontWeight = 'bold';

        const appIdInput = document.createElement('textarea');
        appIdInput.rows = 3;
        appIdInput.placeholder = '例如: 123,456,789';
        appIdInput.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;';

        // List ID 输入框
        const listIdLabel = document.createElement('div');
        listIdLabel.textContent = 'List ID:';
        listIdLabel.style.marginBottom = '5px';
        listIdLabel.style.fontWeight = 'bold';

        const listIdInput = document.createElement('input');
        listIdInput.type = 'text';
        listIdInput.placeholder = '输入 List ID';
        listIdInput.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;';

        // 按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.style.textAlign = 'right';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = 'padding: 5px 10px; margin-left: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;';

        const submitButton = document.createElement('button');
        submitButton.textContent = '提交';
        submitButton.style.cssText = 'padding: 5px 10px; margin-left: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;';

        buttonGroup.appendChild(cancelButton);
        buttonGroup.appendChild(submitButton);

        // 组装内容
        content.appendChild(appIdLabel);
        content.appendChild(appIdInput);
        content.appendChild(listIdLabel);
        content.appendChild(listIdInput);
        content.appendChild(buttonGroup);
        modal.appendChild(content);

        // 事件处理
        button.addEventListener('click', () => {
            modal.style.display = 'flex';
            appIdInput.value = '';
            listIdInput.value = '';
            appIdInput.focus();
        });

        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        submitButton.addEventListener('click', () => {
            const appidsText = appIdInput.value.trim();
            const unListId = listIdInput.value.trim();

            if (!appidsText || !unListId) {
                alert('请填写所有字段！');
                return;
            }

            // 转换为数组
            const rgAppIds = appidsText.split(',')
                .map(id => id.trim())
                .filter(id => id !== '');

            if (rgAppIds.length === 0) {
                alert('请输入有效的 App IDs！');
                return;
            }

            $J.ajax({
                url: g_strCuratorAdminURL + 'ajaxupdatesortorder/',
                data: {
                    listid: unListId,
                    appids: rgAppIds,
                    sessionid: g_sessionID
                },
                dataType: 'json',
                type: 'POST'
            }).done(function (data) {
                modal.style.display = 'none';
                ShowAlertDialog("成功", "排序已成功更新！");
            }).fail(function (data) {
                var response = JSON.parse(data.responseText);
                ShowAlertDialog("\u54ce\u5440\uff01", "\u6211\u4eec\u65e0\u6cd5\u4fdd\u5b58\u60a8\u4f5c\u51fa\u7684\u66f4\u6539 ( %1$s )".replace(/%1\$s/, response.success));
            });
        });

        // 点击遮罩层关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        return modal;
    }

    // 创建并添加元素
    const titleframe = document.querySelector('.titleframe');
    if (titleframe) {
        const modal = createModal();
        titleframe.parentNode.insertBefore(button, titleframe.nextSibling);
        document.body.appendChild(modal);
    } else {
        console.error('未找到 class="titleframe" 的元素');
    }
})();