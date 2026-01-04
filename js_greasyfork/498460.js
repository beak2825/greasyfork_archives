// ==UserScript==
// @name         BiliBili一键关灯
// @version      0.2.3
// @description  点击按钮可使视频实现一键关灯模式
// @author       GSK
// @include      *://*.bilibili.com/*
// @ico          https://www.bilibili.com/favicon.ico?v=1
// @grant    GM_setValue
// @grant    GM_getValue
// @license      MIT License
// @namespace https://greasyfork.org/users/1321187
// @downloadURL https://update.greasyfork.org/scripts/498460/BiliBili%E4%B8%80%E9%94%AE%E5%85%B3%E7%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/498460/BiliBili%E4%B8%80%E9%94%AE%E5%85%B3%E7%81%AF.meta.js
// ==/UserScript==


(function() {

    'use strict';


    // // 键盘操作
    // document.onkeydown = hotkey;
    // function hotkey() {
    //     // 接收指令
    //     var keycode = window.event.keyCode;
    //     // 判断是否与目标码相同
    //     // 按键-：视频关灯
    //     if (keycode == 189) {
    //         // 通过标签拿资源
    //         var inputLight = document.querySelector('[aria-label="关灯模式"]');
    //         // 元素存在对其进行操作
    //         inputLight.click();

    //         // 关灯or开灯
    //         // document.getElementsByClassName("bui-checkbox-input")[3].click();
    //     }

    //     // 按键：番剧关灯
    //     //if (a == 83) {
    //     //    // 关灯or开灯
    //     //    document.getElementsByClassName("bui-checkbox-input")[1].click();
    //     //}

    //     // 按键=：删除头部
    //     if (keycode == 187) {
    //         // 获取div
    //         var div = document.getElementsByClassName("bili-header__bar")[0];
    //         // 删除div
    //         div.parentNode.removeChild(div);

    //     }
    // }




    // 声明所有需要共享的变量
    let deletedHeader = null;
        // 声明控制面板变量，初始为null
    let panel = null; // 用于存储控制面板的DOM元素

    // 1. 顶栏操作函数 ========================================

    /**
     * 切换顶栏显示状态的函数
     * 根据当前状态自动判断是隐藏还是显示顶栏
     */
    const toggleHeader = function () {
        // 如果deletedHeader存在，表示顶栏已被隐藏，需要恢复
        if (deletedHeader) {
            restoreHeader();
        }
        // 否则表示顶栏当前显示，需要隐藏
        else {
            hideHeader();
        }
    };

    /**
     * 隐藏顶栏的函数
     * 1. 查找顶栏元素
     * 2. 备份顶栏信息
     * 3. 从DOM中移除顶栏
     * 4. 更新按钮状态
     * 5. 保存状态到存储
     */
    const hideHeader = function () {
        // 查找顶栏元素
        const header = document.querySelector(".bili-header__bar");

        // 如果找到顶栏元素
        if (header) {
            // 备份顶栏信息到deletedHeader对象
            deletedHeader = {
                element: header, // 顶栏元素本身
                parent: header.parentNode, // 顶栏的父元素
                nextSibling: header.nextElementSibling, // 顶栏的下一个兄弟元素
                isHidden: true// 标记为已隐藏
            };

            // 从DOM中移除顶栏元素
            header.remove();

            // 更新控制面板按钮状态为"已隐藏"
            updateHeaderButton(true);

            // 将隐藏状态保存到GM存储
            GM_setValue('headerState', { isHidden: true });
        }
    };

    /**
     * 恢复顶栏的函数
     * 1. 检查是否有备份的顶栏
     * 2. 根据备份信息将顶栏恢复到原位置
     * 3. 更新按钮状态
     * 4. 清除备份
     * 5. 保存状态到存储
     */
    const restoreHeader = function () {
        // 检查是否有备份的顶栏
        if (deletedHeader) {
            // 如果原位置有下一个兄弟节点
            if (deletedHeader.nextSibling) {
                // 在兄弟节点前插入顶栏(恢复到原位置)
                deletedHeader.parent.insertBefore(
                    deletedHeader.element,
                    deletedHeader.nextSibling
                );
            }
            // 如果没有兄弟节点
            else {
                // 将顶栏追加到父元素末尾
                deletedHeader.parent.appendChild(deletedHeader.element);
            }

            // 更新控制面板按钮状态为"已显示"
            updateHeaderButton(false);

            // 清除备份的顶栏信息
            deletedHeader = null;

            // 将显示状态保存到GM存储
            GM_setValue('headerState', { isHidden: false });
        }
    };

    // 2. 更新按钮状态 ========================================

    /**
     * 更新控制面板中顶栏按钮状态的函数
     * @param {boolean} isHidden - 当前顶栏是否处于隐藏状态
     */
    const updateHeaderButton = function (isHidden) {
        // 获取顶栏切换按钮元素
        const headerBtn = document.querySelector('#bili-toggle-header');

        // 如果找到按钮元素
        if (headerBtn) {
            // 根据状态设置按钮内容和图标
            headerBtn.innerHTML = isHidden ?
                // 隐藏状态下的按钮内容
                `<svg viewBox="0 0 24 24"><path d="M19 11H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1z"></path></svg>
             显示顶栏` :
                // 显示状态下的按钮内容
                `<svg viewBox="0 0 24 24"><path d="M19 13H5c-.55 0-1-.45-1-1s.45-1 1-1h14c.55 0 1 .45 1 1s-.45 1-1 1z"></path></svg>
             隐藏顶栏`;

            // 切换按钮的激活状态类
            headerBtn.classList.toggle('btn-active', isHidden);
        }
    };


    // 监听键盘按下事件
    document.onkeydown = function(event) {
        // 如果当前焦点在输入框内，则不执行快捷键操作
        if (document.activeElement.tagName === 'INPUT') return;

        // 根据按下的不同按键执行不同操作
        switch(event.key) {
                // 处理"-"键：开关关灯模式
            case '-': {
                // 查找关灯模式按钮
                const lightSwitch = document.querySelector('[aria-label="关灯模式"]');
                // 如果找到按钮，则模拟点击
                if (lightSwitch) lightSwitch.click();
                break; // 跳出switch语句
            }

                // 处理"="键：删除顶部导航栏
            case '=': {
                // 查找顶部导航栏元素
                //const header = document.querySelector(".bili-header__bar");
                //if (header) {
                //    // 备份元素及其位置信息
                //    deletedHeader = {
                //        element: header,// 元素本身
                //        parent: header.parentNode,// 父元素
                //        nextSibling: header.nextElementSibling // 下一个兄弟元素
                //    };
                //    // 从DOM中移除元素
                //    header.remove();
                //}
                toggleHeader();
                break;
            }

                // 处理"'"键：恢复顶部导航栏
            case "'": {
                // 检查是否有备份的头部元素
                if (deletedHeader) {
                    // 如果原位置有下一个兄弟节点
                    if (deletedHeader.nextSibling) {
                        // 在兄弟节点前插入
                        // 这是一个方法，避免方法排版混淆
                        // 提供原始方法格式deletedHeader.parent.insertBefore(deletedHeader.element,deletedHeader.nextSibling);
                        // 方法可以翻译为：parent.insertBefore(要插入的元素, 参考节点);
                        deletedHeader.parent.insertBefore(
                            deletedHeader.element,
                            deletedHeader.nextSibling
                        );
                    } else {
                        // 否则追加到父元素末尾
                        deletedHeader.parent.appendChild(deletedHeader.element);
                    }
                    // 恢复完成后清空备份
                    deletedHeader = null;
                }
                break;
            }
        }
    };


    //if(event.button == 0){
    //      //通过鼠标左键获取当下所指标签
    //    var clickedElement1 = event.target;
    //}


    // 鼠标操作
    document.onmousedown = function(event) {

        // 通过标签拿到关灯模式资源
        var inputLight = document.querySelector('[aria-label="关灯模式"]');
        // 通过标签拿到收藏模式按钮资源
        var Collect = document.querySelector('[title="收藏（E）"]');
        // 通过标签拿到收藏模式下的关闭按钮资源
        var Close = document.querySelector('[class="close"]');
        // 通过标签拿到收藏模式下的确定按钮资源
        var Enter = document.querySelector('[class="btn submit-move"]');

        // var event = event || window.event//兼容ie低版本的

        // 鼠标侧键4：前进按键（关灯操作，包括开闭）
        if(event.button == 4) {
            // 元素存在对其进行操作
            inputLight.click();
        }

        // 鼠标侧键3：后退按键（快捷键：收藏操作，包括选择性开闭）
        if(event.button == 3) {
            // 判断收藏页面确定按键元素是否存在
            if(Enter === null || Enter === undefined){
                // 确定按钮元素不存在进而判断关闭按钮元素是否存在
                if(Close === null || Close === undefined){
                    // 关闭按钮元素不存在对其进行收藏按钮操作
                    Collect.click();
                }else{
                    // 关闭元素存在对其进行点击操作
                    Close.click();
                }
            }else{
                // 确定按钮元素存在而进行点击确认操作
                Enter.click();
            }


        }

        // 鼠标侧键4：前进按键
        // if(event.button == 4) {
        //     // 获取head-div资源
        //     var div = document.getElementsByClassName("bili-header__bar")[0];
        //     // 判断head-div是否为空或者未定义
        //     // 或条件判断，二者满足其一为true，则为false
        //     if(div === null || div === undefined){
        //         // 满足条件true，执行下面代码
        //         //获取当下鼠标点击处标签
        //         var clickedElement = event.target;
        //获取当下鼠标点击处标签,然后直接删除（第二种实现方法）
        //         event.target.remove();
        //         //console.log('您当前获得的标签是: ' + clickedElement.tagName);
        //         //删除因点击所获的标签
        //         clickedElement.parentNode.removeChild(clickedElement);
        //     }else{
        //         // 不足条件false，执下面代码
        //         // 直接删除head-div资源
        //         div.parentNode.removeChild(div);
        //     }
        // }

    }

    // Your code here...


    // // 创建控制面板
    // const createControlPanel = function() {
    //     // 创建样式
    //     const style = document.createElement('style');
    //     style.textContent = `
    //         .bili-custom-panel {
    //             position: fixed;
    //             top: 100px;
    //             left: 20px;
    //             width: 200px;
    //             min-width: 180px;
    //             max-width: 300px;
    //             min-height: 180px;
    //             background: rgba(0,0,0,0.8);
    //             border-radius: 8px;
    //             padding: 12px;
    //             color: white;
    //             z-index: 9999;
    //             cursor: move;
    //             backdrop-filter: blur(8px);
    //             border: 1px solid rgba(255,255,255,0.3);
    //             box-shadow: 0 6px 16px rgba(0,0,0,0.4);
    //             resize: none;
    //             overflow: hidden;
    //             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    //         }
    //         .bili-custom-panel h3 {
    //             margin: 0 0 12px 0;
    //             padding-bottom: 8px;
    //             border-bottom: 1px solid rgba(255,255,255,0.3);
    //             font-size: 15px;
    //             user-select: none;
    //             font-weight: 500;
    //         }
    //         .bili-custom-btn {
    //             display: flex;
    //             align-items: center;
    //             width: 100%;
    //             padding: 8px 12px;
    //             margin: 6px 0;
    //             background: rgba(255,255,255,0.12);
    //             border: none;
    //             border-radius: 6px;
    //             color: white;
    //             text-align: left;
    //             cursor: pointer;
    //             transition: all 0.2s;
    //             font-size: 13px;
    //         }
    //         .bili-custom-btn:hover {
    //             background: rgba(255,255,255,0.2);
    //             transform: translateY(-1px);
    //         }
    //         .bili-custom-btn:active {
    //             transform: translateY(0);
    //         }
    //         .bili-custom-btn svg {
    //             flex-shrink: 0;
    //             margin-right: 8px;
    //             width: 16px;
    //             height: 16px;
    //             fill: currentColor;
    //         }
    //         .panel-resize-handle {
    //             position: absolute;
    //             background: transparent;
    //             z-index: 10;
    //         }
    //         .panel-resize-handle-e {
    //             cursor: e-resize;
    //             width: 10px;
    //             height: 100%;
    //             right: 0;
    //             top: 0;
    //         }
    //         .panel-resize-handle-s {
    //             cursor: s-resize;
    //             height: 10px;
    //             width: 100%;
    //             bottom: 0;
    //             left: 0;
    //         }
    //         .panel-resize-handle-se {
    //             cursor: se-resize;
    //             width: 16px;
    //             height: 16px;
    //             right: 0;
    //             bottom: 0;
    //         }
    //         .btn-active {
    //             background: rgba(255,255,255,0.25) !important;
    //             color: #fff;
    //         }
    //     `;
    //     document.head.appendChild(style);

    //     // 创建面板 - 使用已声明的panel变量
    //     panel = document.createElement('div');
    //     panel.className = 'bili-custom-panel';
    //     panel.innerHTML = `
    //         <h3>B站增强控制</h3>
    //         <button class="bili-custom-btn" id="bili-toggle-light">
    //             <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"></path></svg>
    //             开关灯模式
    //         </button>
    //         <button class="bili-custom-btn" id="bili-toggle-header">
    //             <svg viewBox="0 0 24 24"><path d="M19 13H5c-.55 0-1-.45-1-1s.45-1 1-1h14c.55 0 1 .45 1 1s-.45 1-1 1z"></path></svg>
    //             隐藏顶栏
    //         </button>
    //         <button class="bili-custom-btn" id="bili-fullscreen">
    //             <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
    //             全屏播放器
    //         </button>
    //         <div class="panel-resize-handle panel-resize-handle-e"></div>
    //         <div class="panel-resize-handle panel-resize-handle-s"></div>
    //         <div class="panel-resize-handle panel-resize-handle-se"></div>
    //     `;
    //     document.body.appendChild(panel);

    //     // 拖拽功能实现
    //     let isDragging = false;
    //     let isResizing = false;
    //     let resizeDirection = '';
    //     let offsetX, offsetY;
    //     let startX, startY, startWidth, startHeight;

    //     // 面板拖拽
    //     panel.addEventListener('mousedown', (e) => {
    //         if (e.target.classList.contains('panel-resize-handle')) {
    //             isResizing = true;
    //             isDragging = false;
    //             resizeDirection = e.target.classList.contains('panel-resize-handle-e') ? 'e' :
    //             e.target.classList.contains('panel-resize-handle-s') ? 's' : 'se';
    //             startX = e.clientX;
    //             startY = e.clientY;
    //             startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
    //             startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
    //             e.preventDefault();
    //             return;
    //         }

    //         if (e.target.tagName === 'BUTTON') return;

    //         isDragging = true;
    //         isResizing = false;
    //         offsetX = e.clientX - panel.getBoundingClientRect().left;
    //         offsetY = e.clientY - panel.getBoundingClientRect().top;
    //         panel.style.cursor = 'grabbing';
    //         e.preventDefault();
    //     });

    //     document.addEventListener('mousemove', (e) => {
    //         if (isResizing) {
    //             const width = startWidth + (resizeDirection.includes('e') ? (e.clientX - startX) : 0);
    //             const height = startHeight + (resizeDirection.includes('s') ? (e.clientY - startY) : 0);

    //             if (width > 150 && width < 500) {
    //                 panel.style.width = width + 'px';
    //             }
    //             if (height > 150 && height < 500) {
    //                 panel.style.height = height + 'px';
    //             }
    //         } else if (isDragging) {
    //             panel.style.left = (e.clientX - offsetX) + 'px';
    //             panel.style.top = (e.clientY - offsetY) + 'px';
    //         }
    //     });

    //     document.addEventListener('mouseup', () => {
    //         if (isDragging || isResizing) {
    //             // 保存位置和大小
    //             GM_setValue('panelSettings', {
    //                 left: panel.style.left,
    //                 top: panel.style.top,
    //                 width: panel.style.width,
    //                 height: panel.style.height
    //             });
    //         }
    //         isDragging = false;
    //         isResizing = false;
    //         panel.style.cursor = 'move';
    //     });

    //     // 恢复位置和大小
    //     const savedSettings = GM_getValue('panelSettings');
    //     if (savedSettings) {
    //         panel.style.left = savedSettings.left || '20px';
    //         panel.style.top = savedSettings.top || '100px';
    //         if (savedSettings.width) panel.style.width = savedSettings.width;
    //         if (savedSettings.height) panel.style.height = savedSettings.height;
    //     }

    //     // 初始化按钮状态
    //     const headerState = GM_getValue('headerState');
    //     if (headerState && headerState.isHidden) {
    //         updateHeaderButton(true);
    //     }

    //     // 按钮事件监听
    //     panel.querySelector('#bili-toggle-light').addEventListener('click', () => {
    //         const btn = document.querySelector('[aria-label="关灯模式"]');
    //         if (btn) btn.click();
    //     });

    //     panel.querySelector('#bili-toggle-header').addEventListener('click', toggleHeader);

    //     panel.querySelector('#bili-fullscreen').addEventListener('click', () => {
    //         const player = document.querySelector('.bpx-player-container');
    //         if (player) {
    //             if (player.requestFullscreen) player.requestFullscreen();
    //             else if (player.webkitRequestFullscreen) player.webkitRequestFullscreen();
    //         }
    //     });
    // };

    // // 初始化
    // if (document.readyState === 'complete') {
    //     createControlPanel();
    // } else {
    //     window.addEventListener('load', createControlPanel);
    // }
    // Your code here...

})();