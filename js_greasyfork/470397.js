// ==UserScript==
// @name         Steam创意工坊脚本
// @namespace    http://52shell.ltd/
// @version      1.4.1
// @description  一键自动添加删除集合项目
// @author       Shell
// @match        https://steamcommunity.com/sharedfiles/managecollection/?id=*
// @grant        none
// @license      MIT
// @log          修复一键添加删除没反应,添加操作项目的提示,f12打开控制台可查看.
// @GitHub         https://github.com/1592363624/greasyfork/blob/main/Steam创意工坊脚本.user.js
// @downloadURL https://update.greasyfork.org/scripts/470397/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/470397/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const createButton = (id, text, backgroundColor, rightPosition) => {
            const btn = document.createElement("BUTTON");
            btn.setAttribute('id', id);
            btn.innerHTML = text;
            btn.style = `
                position: absolute;
                top: 120px;
                right: ${rightPosition}px;
                border-radius: 20px; // 更大的圆角
                color: white;
                font-size: 20px; // 更小的字体
                background: ${backgroundColor};
                width: 120px; // 更宽的按钮
                height: 60px;
                text-decoration: none;
                border: none; // 移除边框
                box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1); // 添加阴影
                transition: all 0.3s ease 0s; // 添加过渡效果
                cursor: pointer; // 鼠标悬停时变为手指形状
                outline: none; // 移除轮廓
            `;
            btn.onmouseover = function() { // 鼠标悬停时改变背景色和阴影
                this.style.backgroundColor = '#2EE59D';
                this.style.boxShadow = '0px 15px 20px rgba(46, 229, 157, 0.4)';
            };
            btn.onmouseout = function() { // 鼠标移开时恢复背景色和阴影
                this.style.backgroundColor = backgroundColor;
                this.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
            };
            return btn;
        }

        const collectionWindow = document.querySelector('div.collectionAddItemsSection');
        const btnAdd = createButton('ASCM_addall', '一键添加', '#00c417', '50');
        const btnRem = createButton('ASCM_removeall', '一键删除', '#c20000', '180');

        collectionWindow.insertBefore(btnAdd, collectionWindow.firstChild);
        collectionWindow.insertBefore(btnRem, collectionWindow.firstChild);

        // 获取所有项目
        const itemChoices = document.querySelectorAll('div#MySubscribedItems div.itemChoice');

        // 当前选中的项目
        let selectedItems = [];

        // 监听Shift键按下事件
        let shiftPressed = false;
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                shiftPressed = true;
            }
        });

        // 监听Shift键释放事件
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift') {
                shiftPressed = false;
            }
        });

        // 点击项目时处理选中状态
        itemChoices.forEach((item) => {
            item.addEventListener('click', () => {
                if (shiftPressed) {
                    // 按住Shift键的情况下，添加或删除项目到选中列表
                    if (selectedItems.length === 0) {
                        // 如果没有选中的项目，则添加当前项目
                        selectedItems.push(item);
                        item.classList.toggle('selected');
                    } else {
                        // 否则，选中两个项目之间的所有项目
                        let startIndex = Array.from(itemChoices).indexOf(selectedItems[0]);
                        let endIndex = Array.from(itemChoices).indexOf(item);
                        if (startIndex > endIndex) {
                            [startIndex, endIndex] = [endIndex, startIndex]; // 确保startIndex小于endIndex
                        }

                        for (let i = startIndex; i <= endIndex; i++) {
                            const currentItem = itemChoices[i];
                            if (!selectedItems.includes(currentItem)) {
                                selectedItems.push(currentItem);
                                currentItem.classList.toggle('selected');
                                // console.log("正在操作项目：" + item.getAttribute('id'));
                            }
                        }
                    }
                } else {
                    // 如果没有按住Shift键，则清除选中项目并选中当前项目
                    selectedItems.forEach((selectedItem) => {
                        selectedItem.classList.remove('selected');
                    });
                    selectedItems = [item];
                    item.classList.toggle('selected');
                }
            });
        });

// 添加按钮点击事件
jQuery('button#ASCM_addall').click(function(){
    if (shiftPressed) {
        // 当按住Shift键时，执行多选操作
        console.log("正在添加选定项目...");
        selectedItems.forEach((selectedItem) => {
            const itemName = getItemName(selectedItem);
            addToCollection(selectedItem);
            console.log("已添加项目：" + itemName);
        });
    } else {
        // 否则，添加全部项目
        console.log("开始添加所有项目...");
        itemChoices.forEach((item) => {
            const itemName = getItemName(item);
            addToCollection(item);
            console.log("已添加项目：" + itemName);
        });
    }
});

// 删除按钮点击事件
jQuery('button#ASCM_removeall').click(function(){
    if (shiftPressed) {
        // 当按住Shift键时，执行多选操作
        console.log("正在删除选定项目...");
        selectedItems.forEach((selectedItem) => {
            const itemName = getItemName(selectedItem);
            window.RemoveChildFromCollection(selectedItem.getAttribute('id').replace('choice_MySubscribedItems_', ''));
            console.log("已删除项目：" + itemName);
        });
    } else {
        // 否则，删除全部项目
        console.log("开始删除所有项目...");
        itemChoices.forEach((item) => {
            const itemName = getItemName(item);
            window.RemoveChildFromCollection(item.getAttribute('id').replace('choice_MySubscribedItems_', ''));
            console.log("已删除项目：" + itemName);
        });
    }
});

// 获取项目名称的函数
function getItemName(itemElement) {
    const titleElement = itemElement.querySelector('.itemChoiceTitle');
    if (titleElement) {
        return titleElement.textContent.trim();
    }
    return "(获取项目名失败)未知项目";
}



        function addToCollection(item){
            // 获取项目的相关数据
            const collection_name = jQuery('div.manageCollectionHeader div.breadcrumbs a').eq(2).text().trim();
            const url = new URL(document.location.href);
            const collection_id = url.searchParams.get('id');
            const childid = item.getAttribute('id').replace('choice_MySubscribedItems_', '');

            // 创建请求数据
            const data = {
                id: collection_id,
                sessionid: window.g_sessionID,
                childid: childid,
                activeSection: collection_name
            };

            // 发送添加到集合的请求
            jQuery.ajax({
                type: "POST",
                url: 'https://steamcommunity.com/sharedfiles/addchild',
                data: data,
                success: function(response){
                    if(response.success === 1){
                        item.classList.add('inCollection');
                    }
                }
            });
        }
    }, 0);

})();
