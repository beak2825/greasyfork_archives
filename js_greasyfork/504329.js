// ==UserScript==
// @name         BIP增强
// @namespace    https://greasyfork.org/ysydoublefish/bip-enhance
// @icon         http://you.jxfxky.com:8998/favicon.ico
// @version      7.2.3
// @description  添加一些BIP原本没有的功能（有些功能明明U8都有，为什么BIP没有）
// @license      MIT
// @author       双鱼
// @match        http://you.jxfxky.com:8998/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.2.0/math.min.js
// @require      https://unpkg.com/interactjs@latest/dist/interact.min.js
// @homepageURL  https://n0eb0mluamf.feishu.cn/docx/L73TdYg8eo5cu9xPDGqcw1Xfnnh
// @downloadURL https://update.greasyfork.org/scripts/504329/BIP%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/504329/BIP%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/*
 * 功能01：报表页面双击单元格会快速跳转至对应明细账或凭证
 * - 在报表界面双击单元格时会优先寻找“联查”按钮下的“明细”按钮点击
 * - 如果没有“联查”按钮，则会寻找“联查明细”按钮点击
 * - 如果没有“联查明细”按钮，则会寻找“联查凭证”按钮点击
 * - 对于现金流量页面，直接查找“明细”或“联查凭证”按钮点击
 *
 * 功能02：选中多个单元格时，右下角会自动出现求和结果框，点击会将求和结果复制到剪切板
 * - 结果框会显示求和与计数，单元格只会包含判断后为金额的单元格，计数主要是用来判断脚本有没有出现问题
 * - 选中单元格是以松开鼠标的操作来判断的，鼠标点击或拖动框选结束时会触发松开鼠标
 * - 每次松开鼠标都会清空之前选中的单元格，但是按下Ctrl或Shift键除外
 * - 鼠标点击到一些奇怪的地方可能会导致bug，例如右边的滚动条（此时页面中已选中单元格的选中状态并不会消失，但是脚本里会清空）
 *
 * 功能03：在首页模拟鼠标点击，防止长时间不操作后登出
 * - 点击“上月”、“下月”、“今天”按钮（每隔5min）
 *
 * 功能04：为科目余额表页面添加快捷键
 * - “联查辅助”功能快捷键（Ctrl+S）
 *
 * 功能05：为报表页面添加快捷键
 * - “直接输出”功能快捷键（Ctrl+E）
 *
 * 功能06：凭证页面添加快捷键及对应按钮，优化现金流量功能
 * - 弹出现金流量警告时，会自动关闭该警告，并点击“现金流量”按钮
 * - “联查余额”功能快捷键（Ctrl+Y）
 * - “联查明细账”功能快捷键（Ctrl+L）
 * - 凭证记账页面直接显示“取消记账”按钮，不用自己再去找暗门了
 *
 * 功能07：优化辅助余额表页面
 * - 跳转到辅助余额表页面的时候，会自动点击两次“转换”按钮，以生成辅助编码
 *
 * 功能08：自定义计算器，方便快捷计算
 * - 打开/关闭计算器快捷键（Alt+C）
 * - 要知道计算器能做哪些事情，可以参考https://mathjs.org/docs/expressions/syntax.html
 *
 * 功能09：修改自定义转账执行页面
 * - 选择单位后，会自动点击“月末结转”
 * - 点击“月末结转”或“年末结转”后，自动点击对应复选框（包含未记账凭证）
 *
 * 功能10：隐藏消息角标
 * - 右上角出现了消息的角标，但是点进去之后还要注册，还是把它隐藏了吧，眼不见心不烦
 */

(function() {
    'use strict';

    if (window.self === window.top) {
        // 打招呼
        const consoleArtText = `
          +------------------+
          |                  |
          |  双鱼脚本已运行  |
          |                  |
          +------------------+
        `;
        console.log(consoleArtText);
    }

    // 设置面板
    function getStorageValue(inputValue) {
        const StorageValue = localStorage.getItem(inputValue);
        const returnValue = StorageValue !== null ? StorageValue === 'true' : true;
        return returnValue;
    }

    function addSettingsPanel() {

        let panel; // 设置面板
        let panelBackground;
        const functions = {
            doubleClickToDetail: {
                description: '功能01：双击单元格跳转至明细页面',
                func: doubleClickToDetail,
            },
            autoSumSelection: {
                description: '功能02：选中多个单元格求和',
                func: autoSumSelection,
            },
            preventLogoutByClicking: {
                description: '功能03：防止自动登出',
                func: preventLogoutByClicking,
            },
            modifyAccBalance: {
                description: '功能04：增强余额表界面',
                func: modifyAccBalance,
            },
            addExportShortCutKey: {
                description: '功能05：添加导出快捷键',
                func: addExportShortCutKey,
            },
            modifyVoucherPage: {
                description: '功能06：增强凭证页面',
                func: modifyVoucherPage,
            },
            convertAssistBalance: {
                description: '功能07：辅助余额表显示辅助编码',
                func: convertAssistBalance,
            },
            customCalculator: {
                description: '功能08：自定义计算器',
                func: addCustomCalculator,
            },
            modifyCustomTransferPage: {
                description: '功能09：半自动自定义转账',
                func: modifyCustomTransferPage,
            },
            hideBadge: {
                description: '功能10：隐藏消息角标',
                func: hideBadge,
            },
        }

        const functionNames = Object.keys(functions);

        function createSettingsPanel() {
            // 如果不是顶层窗口，就不执行以下代码
            if (window.self !== window.top) return;

            if (panel) return; // 如果面板已经创建，则不再创建新的

            panel = document.createElement('div');
            panel.id = 'tmSettingsPanel';
            panelBackground = document.createElement('div');
            panelBackground.id = 'tmSettingsPanelBackground';

            // 添加关闭按钮
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.id = 'close-button';
            closeButton.onclick = () => {
                panel.style.display = 'none';
                panelBackground.style.display = 'none';
            }

            let selectionHTML = '';

            Object.entries(functions).forEach(([functionName, functionDetail]) => {
              const toggleName = functionName + "Toggle";
              const EnableName = functionName + "Enabled";
              selectionHTML += `
              <div class="checkRow">
                  <label class="switch">
                      <input class="checkbox" type="checkbox" id="${toggleName}" name="${toggleName}">
                      <span class="slider"></span>
                  </label>
                  <label class="description" for="${toggleName}">${functionDetail.description}</label>
              </div>
              `;
            });

            // 设置内容
            panel.innerHTML = `
            <div class="draggable-header">
                <span class="settings-header">设置（保存并刷新后生效）</span>
            </div>
            <div class="content">
                ${selectionHTML}
            </div>
            <div class="tail">
                <button class="settings-button" id="save-settings">保存</button>
                <button class="settings-button" id="cancel-settings">取消</button>
            </div>
            `;
            panel.appendChild(closeButton);
            document.body.appendChild(panel);
            document.body.appendChild(panelBackground);

            document.getElementById('save-settings').onclick = saveSettings;
            GM_registerMenuCommand("设置", openSettingsPanel);
            panel.querySelector('#cancel-settings').onclick = () => {
                panel.style.display = 'none';
                panelBackground.style.display = 'none';
            }

            const checkRows = panel.querySelectorAll('#tmSettingsPanel .checkRow');
            checkRows.forEach(
                (checkRow) => {
                    checkRow.onclick = () => {
                        const checkbox = checkRow.querySelector('.checkbox');
                        if (checkbox) {
                            checkbox.checked = !checkbox.checked;
                        }
                    }
                }
            )

            enableDragging();

            GM_addStyle(`
                #tmSettingsPanel {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  min-width: 400px;
                  max-width: 600px;
                  background-color: #fff;
                  border: 1px solid #e5e5e5;
                  border-radius: 5px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  padding: 0px;
                  z-index: 10001;
                  overflow: auto;
                  display: none;
                }

                #tmSettingsPanelBackground {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 10000;
                  display: none;
                }
                #tmSettingsPanel .settings-header {
                  color: #444;
                  text-align: center;
                  margin-left: 20px;
                  font-weight: bold;
                }
                #tmSettingsPanel #close-button {
                  position: absolute;
                  color: #99999c;
                  font-size: 28px;
                  top: 5px;
                  right: 10px;
                  background-color: transparent;
                  border: none;
                  cursor: pointer;
                }
                #tmSettingsPanel #close-button:hover {
                  color: #50576b;
                }

                #tmSettingsPanel .checkRow .checkbox {
                  cursor: pointer
                }

                #tmSettingsPanel .checkRow .description {
                  color: #444;
                  font-size: 15px;
                  cursor: pointer;
                }

                #tmSettingsPanel .settings-button {
                  border-radius: 5px;
                  cursor: pointer;
                  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
                }
                #save-settings {
                  background-color: #ee2233;
                  color: white;
                  border: none;
                  padding: 5px 15px;
                  margin-left:auto;
                }
                #cancel-settings {
                  background-color: white;
                  color: black;
                  border: 1px solid;
                  border-color: #c6ccd7;
                  padding: 5px 15px;
                  margin: 0px 13px;
                }
                #save-settings:hover {
                  background-color: #be1b1c;
                }
                #cancel-settings:hover {
                  background-color: #f0f4fb;
                }
                #tmSettingsPanel .draggable-header{
                  position: relative;
                  top;
                  width: 100%;
                  padding: 10px 0px;
                  cursor: move;
                }
                #tmSettingsPanel .content {
                  position: relative;
                  padding: 10px 10px;
                  border: solid;
                  border-color: #c6ccd7;
                  border-width: 1px 0px;
                }
                #tmSettingsPanel .tail {
                  position: relative;
                  bottom;
                  width: 100%;
                  margin: 10px 0px;
                  display: flex;
                  justify-items: flex-end;
                }

                #tmSettingsPanel .switch {
                  position: relative;
                  display: inline-block;
                  width: 28px;
                  height: 12px;
                  vertical-align: middle;
                  margin-left: 18px;
                  margin-right: 12px;
                }

                #tmSettingsPanel .switch input {
                  opacity: 0;
                  width: 0;
                  height: 0;
                }

                #tmSettingsPanel .slider {
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: #ccc;
                  transition: 0.4s;
                  border-radius: 16px;
                }

                #tmSettingsPanel .slider:before {
                  position: absolute;
                  content: "";
                  height: 10px;
                  width: 10px;
                  left: 1px;
                  bottom: 1px;
                  background-color: white;
                  transition: 0.4s;
                  border-radius: 50%;
                }

                #tmSettingsPanel input:checked + .slider {
                  background-color: #ee2233;
                }

                #tmSettingsPanel input:checked + .slider:before {
                  transform: translateX(16px);
                }

                #tmSettingsPanel .checkRow {
                  display: flex;
                  align-items: center;
                  padding: 5px 0;
                }

                #tmSettingsPanel .checkRow:hover {
                  background-color: #f0f0f0;
                  cursor: pointer;
                }
            `);
        }

        function openSettingsPanel() {
            if (panel.style.display == 'block') return;
            functionNames.forEach(
                functionName => {
                    const toggleName = functionName + 'Toggle';
                    const EnableName = functionName + 'Enabled';
                    // 读取设置并更新复选框状态
                    document.getElementById(toggleName).checked = getStorageValue(EnableName);
                }
            )
            if (!panel.style.display || panel.style.display == 'none') {
                panel.style.top = '50%';
                panel.style.left = '50%';
                panel.style.display = 'block';
                panelBackground.style.display = 'block';
            }
        }

        function saveSettings() {
            functionNames.forEach(
                functionName => {
                    const toggleName = functionName + 'Toggle';
                    const EnableName = functionName + 'Enabled';
                    localStorage.setItem(EnableName, document.getElementById(toggleName).checked)
                }
            )
            panel.style.display = 'none';
            panelBackground.style.display = 'none';
        }

        function enableDragging() {
            let draggableContainer = panel;
            let draggableHeader = panel.querySelector('.draggable-header');

            // 初始位置
            let startX, startY, startMouseX, startMouseY;

            draggableHeader.addEventListener('mousedown', function(e) {
                // 记录鼠标和元素的初始位置
                startX = draggableContainer.offsetLeft;
                startY = draggableContainer.offsetTop;
                startMouseX = e.clientX;
                startMouseY = e.clientY;

                // 监听鼠标移动和松开的事件
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                // 计算移动的距离，并更新元素位置
                let deltaX = e.clientX - startMouseX;
                let deltaY = e.clientY - startMouseY;

                // 更新元素的位置
                draggableContainer.style.left = startX + deltaX + 'px';
                draggableContainer.style.top = startY + deltaY + 'px';
            }

            function onMouseUp() {
                // 移除鼠标移动和松开的监听器
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }

        createSettingsPanel();

        // 按设置一一实现所有需要的功能
        Object.entries(functions).forEach(([functionName, functionDetail]) => {
            const EnableName = functionName + "Enabled";
            if (getStorageValue(EnableName)) functionDetail.func();
        });
    }

    addSettingsPanel();


    /*
    -- 功能1：在报表界面双击单元格时会直接联查明细，明细界面双击会联查凭证，不用自己再多点几次了
    */

    //使用事件委托在body上设置双击事件监听器
    function doubleClickToDetail() {
        document.body.addEventListener('dblclick', function(event) {
            // 检查双击的是否为td元素
            if (event.target.tagName === 'TD') {
                const url = window.location.href;
                if (url.includes('/accbalance/pages/main/index.html')) {
                    // 尝试点击“明细”按钮
                    let targetButton = document.querySelector('div.btn-item-left[btn-code="detailbook"]');
                    if (targetButton) {
                        targetButton.click();
                    } else {
                        // 尝试点击“联查”按钮
                        const lookupButton = document.evaluate("//span[@class='wui-button-text-wrap' and text()='联查']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (lookupButton) {
                            lookupButton.click();
                            setTimeout(() => {
                                // 再次尝试点击“明细”按钮
                                targetButton = document.querySelector('div.btn-item-left[btn-code="detailbook"]');
                                if (targetButton) {
                                    targetButton.click();
                                }
                            }, 500);
                        }
                    }
                } else {
                    // 点击“联查明细”按钮
                    const targetButton = document.evaluate("//span[@class='wui-button-text-wrap' and text()='联查明细']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (targetButton) {
                        targetButton.click();
                    } else {
                        // 点击“联查凭证”按钮
                        const targetButton = document.evaluate("//span[@class='wui-button-text-wrap' and text()='联查凭证']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (targetButton) {
                            targetButton.click();
                        } else {
                            const detailButton = document.evaluate("//button[@btn-code='linkdetail']/span[text()='明细' or text()='联查凭证']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            if (detailButton) detailButton.click();
                        }
                    }
                }
            }
        });
    }

    /*
    -- 功能2：选中多个单元格时，右下角会自动出现求和与计数，并允许通过点击将结果复制到剪切板
    */

    function autoSumSelection() {
        const resultBox = document.createElement('div');
        Object.assign(resultBox.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(230, 230, 230, 0.9)',
            color: 'black',
            padding: '10px',
            borderRadius: '5px',
            border: '1.5px solid rgb(200, 200, 200)',
            zIndex: '10000',
            cursor: 'pointer',
            display: 'none'
        });

        const hoverStyle = {
            backgroundColor: 'rgba(200, 200, 200, 0.9)', // 悬浮时的背景色
            borderColor: 'rgb(150, 150, 150)' // 悬浮时的边框色
        };
        resultBox.addEventListener('mouseover', function() {
            this.style.backgroundColor = hoverStyle.backgroundColor;
            this.style.borderColor = hoverStyle.borderColor;
        });

        resultBox.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(230, 230, 230, 0.9)';
            this.style.borderColor = 'rgb(200, 200, 200)';
        });
        document.body.appendChild(resultBox);

        function showMessage(message) {
            const messageBox = document.createElement('div');
            messageBox.textContent = message;
            Object.assign(messageBox.style, {
                position: 'fixed',
                bottom: '60px',
                right: '20px',
                backgroundColor: 'rgba(250, 242, 242, 0.9)', // 使用更明显的背景色
                color: 'black',
                padding: '10px',
                borderRadius: '5px',
                border: '1.5px solid rgb(255, 195, 122)', // 设置边框颜色和样式
                zIndex: '10001',
                display: 'block'
            });
            document.body.appendChild(messageBox);

            // 1秒后消失
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 1000);
        }

        // 全局变量存储选中单元格的数值
        let selectedCellValues = {};

        // 用于更新选中单元格数值的函数
        function updateSelectedCells() {
            const highlightedCells = document.querySelectorAll('td.highlight');
            if (!event.ctrlKey && !event.shiftKey) {
                selectedCellValues = {}; // 如果没有按控制键，清空之前的数据
            }
            highlightedCells.forEach(cell => {
                const text = cell.textContent.trim();
                if (/^\-?[\d,]+\.\d{2}$/.test(text)) {
                    const cleanText = text.replace(/,/g, '');
                    const num = parseFloat(cleanText);
                    if (!isNaN(num)) {
                        const trElement = cell.parentNode;
                        const rowNumberIndex = trElement.querySelector('th span.rowHeader').textContent.trim();
                        const colNumberIndex = Array.from(trElement.children).indexOf(cell) - 1;
                        const colAlphaIndex = String.fromCharCode('A'.charCodeAt(0)+colNumberIndex);
                        const keyIndex = colAlphaIndex + rowNumberIndex;
                        selectedCellValues[keyIndex] = num;
                    }
                }
            });
            displayResults(); // 更新选择后立即调用显示结果函数
        }

        // 显示计算结果的函数
        function displayResults() {
            console.log(`当前单元格对象为${JSON.stringify(selectedCellValues)}`);
            const values = Object.values(selectedCellValues);
            const totalCount = values.length;
            if (totalCount >= 2) {
                const sum = values.reduce((acc, val) => acc + val, 0);
                const sumText = sum.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                //resultBox.textContent = `计数：${totalCount}&nbsp;&nbsp;&nbsp;&nbsp;合计：${sumText}`;
                resultBox.innerHTML = `计数: ${totalCount}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合计: ${sumText}`;
                resultBox.style.display = 'block';
            } else {
                resultBox.style.display = 'none';
            }
        }

        // 监听鼠标放开事件，处理拖动结束和更新选择
        document.addEventListener('mouseup', updateSelectedCells);

        resultBox.addEventListener('click', function() {
            const regex = /合计: (.*)/;
            const result = this.textContent.match(regex);
            if (result && result[1]) {
                const textToCopy = result[1].trim();

                GM_setClipboard(textToCopy, 'text');
                showMessage('合计金额已复制到剪切板！');

                // 在点击时改变背景颜色作为视觉反馈
                this.style.backgroundColor = 'rgba(249, 226, 208, 0.95)'; // 改变颜色
                this.style.border = '1.5px solid rgb(75, 137, 255, 0.9)';
                setTimeout(() => {
                    this.style.backgroundColor = 'rgba(230, 230, 230, 0.9)';
                    this.style.border = '1.5px solid rgb(200, 200, 200)'; // 恢复原样
                }, 300); // 持续时间为0.3秒
            }
        });
    }

    /*
    -- 功能3：在首页模拟鼠标点击，防止登出（中午睡个觉下午就退出登录了，真的很烦有没有）
    */

    function preventLogoutByClicking() {
        // 在首页才执行这个脚本
        const targetURLStart = 'http://you.jxfxky.com:8998/';
        const targetURLEnd = 'resources/workbench/public/common/main/index.html#/';

        // 设置间隔时间，例如每5分钟执行一次点击事件
        const minutes = 5;

        // 定义点击事件
        function clickButtons() {
            const currentURL = window.location.href;
            if (currentURL.startsWith(targetURLStart) && currentURL.endsWith(targetURLEnd)) {

                const leftButton = document.querySelector('.iconfont.icon-riqi-zuo2.nc-theme-Widgets-font-c');
                const rightButton = document.querySelector('.iconfont.icon-riqi-you2.nc-theme-Widgets-font-c');
                const todayButton = document.querySelector('div.current_day');

                // 定位第一个按钮并点击
                if (leftButton) {leftButton.click();}

                // 设置延迟0.5秒后点击第二个按钮
                setTimeout(() => {
                    if (rightButton) {
                        rightButton.click();
                    }
                }, 500); // 延迟0.5秒

                // 设置延迟0.5秒后点击第三个按钮
                setTimeout(() => {
                    if (todayButton) {
                        todayButton.click();
                    }
                }, 500); // 延迟0.5秒
            }
        }

        // 使用setInterval定期执行点击事件
        setInterval(clickButtons, minutes * 60 * 1000);
    }

    /*
    -- 功能4：在科目余额表页面改变结构，添加快捷键及说明
    */

    function modifyAccBalance() {
        // 需要点击才能生成下拉框，就点击两次，并且过程中隐藏出现的下拉框
        function getButton() {
            const lookupButton = document.evaluate("//span[@class='wui-button-text-wrap' and text()='联查']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (lookupButton) {
                lookupButton.click();
                const dropMenu = document.evaluate("//div[div[@selecticon='[object Object]']]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (dropMenu) {
                    dropMenu.style.display = 'none';
                }
                setTimeout(() => {
                    lookupButton.click();
                    setTimeout(() => {
                        if (dropMenu) {
                            dropMenu.style.removeProperty('display');
                        }
                    }, 350);
                }, 300);
            } else {
                setTimeout(getButton, 100);
            }
        }
        // 添加辅助对应的快捷键说明及功能
        function modifyAssButton() {
            const assistanceButton = document.evaluate("//div[@btn-code='assbal']//following-sibling::div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (assistanceButton) {
                const assistanceButtonLeft = document.querySelector('div.btn-item-left[btn-code="assbal"]');
                assistanceButton.textContent = 'Ctrl+S';
                document.addEventListener('keydown', function(event) {
                    if (event.ctrlKey && event.key.toUpperCase() === 'S') {
                        if (assistanceButtonLeft) {
                            event.preventDefault();
                            assistanceButtonLeft.click();
                        }
                    }
                });
            } else {
                setTimeout(modifyAssButton, 100);
            }
        }
        const accBalanceURL = 'http://you.jxfxky.com:8998/nccloud/resources/gl/accbalance/pages/main/index.html';
        const currentURL = window.location.href;
        if (accBalanceURL == currentURL) {
            getButton();
            modifyAssButton();
        }
    }

    /*
    -- 功能5：为报表页面的“直接输出”功能添加快捷键
    */
    function addExportShortCutKey() {
        const maxRetries = 15; // 设置最大重试次数

        // 需要点击才能生成下拉框，就点击两次，并且过程中隐藏出现的下拉框
        function getButton(retries = 0) {
            const dropButton = document.evaluate('//button[span[text()="打印"]]/following-sibling::button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (dropButton) {
                dropButton.click();
                const dropMenu = document.evaluate('//ul[li/span/div/div[text()="直接输出" or text()="输出xlsx文件"]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (dropMenu) {
                    dropMenu.style.display = 'none';
                }
                setTimeout(() => {
                    dropButton.click();
                    setTimeout(() => {
                        if (dropMenu) {
                            dropMenu.style.removeProperty('display');
                        }
                    }, 350);
                }, 300);
            } else {
                if (retries < maxRetries) {
                    setTimeout(() => getButton(retries + 1), 100);
                }
            }
        }

        // 添加导出对应的快捷键说明及功能
        function modifyAssButton(retries = 0) {
            const exportButtonRight = document.evaluate('//div[text()="直接输出" or text()="输出xlsx文件"]/following-sibling::div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const exportSingleButton = document.evaluate('//button/span[text()="直接输出"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (exportButtonRight) {
                const exportButton = document.evaluate('//div[text()="直接输出" or text()="输出xlsx文件"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                exportButtonRight.textContent = 'Ctrl+E';
                document.addEventListener('keydown', function(event) {
                    if (event.ctrlKey && event.key.toUpperCase() === 'E') {
                        if (exportButton) {
                            event.preventDefault();
                            exportButton.click();
                        }
                    }
                });
            } else if (exportSingleButton) {
                document.addEventListener('keydown', function(event) {
                    if (event.ctrlKey && event.key.toUpperCase() === 'E') {
                        event.preventDefault();
                        exportSingleButton.click();
                    }
                });
            } else {
                if (retries < maxRetries) {
                    setTimeout(() => modifyAssButton(retries + 1), 100);
                }
            }
        }

        getButton();
        modifyAssButton();
    }

    /*
    -- 功能6：为凭证页面的多个功能添加快捷键
    */
    function modifyVoucherPage() {
        // 需要点击才能生成下拉框，点击两次返回原样，并且过程中隐藏出现的下拉框
        function getDropMenu(dropButtonXpath, dropMenuXpath) {
            const dropButton = document.evaluate(dropButtonXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (dropButton) {
                dropButton.click();
                const dropMenu = document.evaluate(dropMenuXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (dropMenu) {
                    dropMenu.style.display = 'none';
                }
                setTimeout(() => {
                    dropButton.click();
                    setTimeout(() => {
                        if (dropMenu) {
                            dropMenu.style.removeProperty('display');
                        }
                    }, 350);
                }, 300);
            }
        }

        // 添加对应的快捷键说明及功能
        function modifyButton(buttonRightXpath, buttonLeftXpath, shortCutKey) {
            const buttonRight = document.evaluate(buttonRightXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (buttonRight) {
                const buttonLeft = document.evaluate(buttonLeftXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const keyCombination = `Ctrl+${shortCutKey.toUpperCase()}`
                buttonRight.textContent = keyCombination;
                document.addEventListener('keydown', function(event) {
                    if (event.ctrlKey && event.key.toUpperCase() == shortCutKey) {
                        if (buttonLeft) {
                            if (buttonLeftXpath.includes('联查')) {
                                const currentCheckboxes = document.querySelectorAll('tr.nctable-selected-row input[type="checkbox"]');
                                currentCheckboxes.forEach((currentCheckbox) => {
                                    if (!currentCheckbox.checked) currentCheckbox.click();
                                })
                            }
                            event.preventDefault();
                            buttonLeft.click();
                        }
                    }
                });
            }
        }

        // 检测到"分录联查"按钮后，添加对应的快捷键
        function modifyButtons() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            const LinemoreButtons = node.querySelectorAll('button[btn-code="linemore"]');
                            LinemoreButtons.forEach((LinemoreButton) => {
                                const spanText = LinemoreButton.querySelector('span');
                                if (spanText && spanText.textContent.trim() == "分录联查") {
                                    getDropMenu('//button[span[text()="分录联查"]]', '//div[div/ul/li/span/div/div[text()="联查余额"]]');
                                    getDropMenu('//button[span[text()="凭证处理"]]', '//div[div/ul/li/span/div/div[(text()="平行记账" or text()="现金流量")]]');
                                    setTimeout(()=>modifyButton('//div[text()="联查余额"]/following-sibling::div', '//div[text()="联查余额"]', 'Y'), 300);
                                    setTimeout(()=>modifyButton('//div[text()="联查序时账"]/following-sibling::div', '//div[text()="联查序时账"]', 'L'), 300);
                                }
                            });
                        }
                    });
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
        }

        function detectDanger() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            const dangerBoxes = node.querySelectorAll('div.danger');
                            let closeButton;
                            dangerBoxes.forEach((dangerBox) => {
                                const spanText = dangerBox.querySelector('div.toast-content span');
                                if (spanText && spanText.textContent.includes("错误:现金流量本币金额分析错误!")) {
                                    console.log('已找到现金流量错误弹窗');
                                    closeButton = dangerBox.querySelector('i.close-icon');
                                }
                            });
                            if (closeButton) {
                                closeButton.click();
                                const cashFlowButton = document.evaluate('//div[text()="现金流量"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                if (cashFlowButton) cashFlowButton.click();
                            }
                        }
                    });
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
        }

        // 点击凭证记账三次，生成“取消记账”按钮
        function getReverseAccountingButton(times=30) {
            if (times === 0) return;
            const voucherAccountingButton = document.evaluate('//span[contains(@class,"bill-info-title") and text()="凭证记账"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (voucherAccountingButton) {
                setTimeout(() => {
                    voucherAccountingButton.click();
                    setTimeout(() => {
                        voucherAccountingButton.click();
                        setTimeout(() => {
                            voucherAccountingButton.click();
                        }, 50);
                    }, 50);
                }, 250);
            } else {
                setTimeout(() => {
                    getReverseAccountingButton(times-1);
                }, 100);
            }
        }

        const currentURL = window.location.href;
        if (currentURL.includes('resources/gl/gl_voucher/pages')) {
            modifyButtons();
            detectDanger();
            getReverseAccountingButton();
        }
    }

    /*
    -- 功能7：跳转到辅助余额表页面时候，会自动点击两次“转换”按钮，以生成辅助编码
    */
    function convertAssistBalance() {
        if (window.location.href.includes('http://you.jxfxky.com:8998/nccloud/resources/gl/manageReport/assistBalance/content/index.html')) {
            console.log('当前为辅助余额表界面，开始尝试点击转换按钮');
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            const switchButtonSpan = node.querySelector('button[btn-code="switch"] span');
                            if (switchButtonSpan && switchButtonSpan.textContent.trim() == "转换") {
                                const switchButton = switchButtonSpan.parentNode;
                                setTimeout(() => {
                                    switchButton.click();
                                    setTimeout(() => switchButton.click(), 500);
                                }, 500)
                            }
                        }
                    });
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);

            /*
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                this.addEventListener('readystatechange', () => {
                    if (this.readyState === 4) {
                        // 请求已完成
                        if (url.includes('your-specific-endpoint')) {
                            console.log('捕获到目标 XMLHttpRequest 请求：', method, url);
                            console.log('响应数据：', this.responseText);
                            // 在此处理响应数据
                        }
                    }
                });
                return originalOpen.apply(this, arguments);
            };
            */

        }
    }


    /*
    -- 功能8：添加简易计算器，方便计算
    */
    function addCustomCalculator() {
        if (window.self !== window.top) {
            document.addEventListener("keydown", function (event) {
                if (event.altKey && event.key.toUpperCase() === 'C') {
                    const message = {
                        type: 'shortcut',
                        key: event.key,
                        altKey: event.altKey
                    };
                    window.top.postMessage(message, window.top.location.origin);
                }
            });
            return;
        }
        const calculatorDiv = document.createElement('div');
        calculatorDiv.id = 'custom-calc';
        calculatorDiv.innerHTML = `
            <div class="calculator" class="draggable">
            <div class="header draggable">
                <span class="title">计算器（打开/关闭快捷键Alt+C）</span>
                <div class="close-btn">×</div>
            </div>
            <div class="display">
                <div class="result"></div>
                <input type="text" class="current" placeholder="此处粘贴计算式" />
            </div>
            <div class="buttons">
                <button class="number">7</button>
                <button class="number">8</button>
                <button class="number">9</button>
                <button class="operator">/</button>
                <button class="number">4</button>
                <button class="number">5</button>
                <button class="number">6</button>
                <button class="operator">*</button>
                <button class="number">1</button>
                <button class="number">2</button>
                <button class="number">3</button>
                <button class="operator">-</button>
                <button class="number">0</button>
                <button class="number">.</button>
                <button ">C</button>
                <button class="operator">+</button>
            </div>
            </div>
            <div class="floating-ball pointer-cursor"></div>
        `;
        GM_addStyle(`
            #custom-calc .calculator {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 280px;
              background: #f4f4f4;
              border: 1px solid #ccc;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              display: none;
              z-index: 10;
            }

            #custom-calc .header {
              height: 30px;
              background: #fff;
              cursor: move;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 5px;
              -webkit-app-region: drag;
              border-bottom: 1px solid #ddd;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
            }

            #custom-calc .title {
              font-size: 14px;
              color: #333;
            }

            #custom-calc .close-btn {
              cursor: pointer;
              font-size: 20px;
              color: #aaa;
            }

            #custom-calc .close-btn:hover {
              color: #000;
            }

            #custom-calc .display {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 80px;
              padding: 5px;
              background: #fff;
              border-bottom: 1px solid #ddd;
            }

            #custom-calc .current,
            #custom-calc .result {
              text-align: right;
              font-size: 20px;
              overflow: hidden;
            }

            #custom-calc .current {
              width: 100%;
              border: none;
              outline: none;
              background: #f9f9f9;
              border-bottom: 1px solid #ddd;
              padding: 5px 5px;
              max-width: calc(100% - 10px);
              height: auto;
              max-height: 70px;
              line-height: normal;
            }

            #custom-calc .result {
              color: #888;
              background: #fff;
              border-bottom: 1px solid #ddd;
              padding: 5px 5px;
              height: 35px;
              line-height: 35px;
            }

            #custom-calc .buttons {
              border-top: 1px solid #ddd;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              overflow: hidden;
            }

            #custom-calc .buttons button {
              width: 25%;
              height: 60px;
              float: left;
              border: 1px solid #ddd;
              background: #fff;
              cursor: pointer;
              border-radius: 2px;
            }

            #custom-calc .buttons button:hover {
              background: #f0e0dc;
            }

            #custom-calc .draggable {
              -webkit-app-region: drag;
            }

            #custom-calc .floating-ball {
              position: fixed;
              bottom: 60px;
              right: 20px;
              width: 35px;
              height: 35px;
              background: #f4f4f4;
              border: 1px solid #ccc;
              border-radius: 50%;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              cursor: pointer;
              display: block;
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAB6VBMVEX///8AAABXWFpXWFpXWFpXWFpXWFpXWFpWV1lWV1lWV1lWV1lVVlhRUVNNTU5EQ0REQ0REQ0RAP0FAP0FAP0E8Ojw8Ojw8Ojw8Ojw4Nzg4Nzg4Nzg4Nzg0MjM0MjM0MjM0MjMxLi8xLi8xLi8xLi8xLi8sKSosKSosKSosKSopJicpJicpJickICIkICEkICEjICEjICEjHyAjHyAjHyAjHyAiHh8iHh8iHh9XWFpWV1lVVlhVVVdUVVdUVFZTVFZTU1VSU1VSU1RSUlRRUlRRUVNQUVNQUFJPT1FOTlBNTk9NTU9NTU5MTE5LS01LSkxKSkxJSUtJSEpISEpISElHR0lHR0hHRkhGRkdGRUdFRUZFREZEREVEQ0VEQ0RDQkRCQUNCQUJBQEJBQEFAP0FAP0BAPkA/Pj8/PT8+PT4+PD49PD49PD09Oz08Ozw8Ojw7Ojs7OTs7OTo6ODo6ODk5Nzk5Nzg4Nzg4Njg4Njc3NTc3NTY2NDY2NDU2MzU1MzQ1MjQ0MjMzMTIzMDIyMDEyLzAxLzAxLi8wLS8wLS4vLS4vLC0uKy0uKywtKywtKissKSorKCkrJygqJygqJigpJicoJSYoJCUnJCUnIyQmIyQmIiMlISIkICIkICEjICEjHyAiHh/////osd02AAAAOXRSTlMAAIDQYBDAsIBQ4LDwcFBwgEBQcECAUHBgcDBQYIAQcGCAQGBQcJAQcIBwMFDw4LCAUNCwEMCA0GDVjyXcAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+MBCQEFFQ0E3y8AAAMeSURBVHja1dblU1RxFMbx/YnYhGCgCKioYBeKiN3d3d3d3d3d+Z86Hi9n5nB152HPPuP8Pi+f2T33++ruZjJpIYR2BU35VtA+gwqF+X/8bx0K0QDO85uaOoIBnSazdMYCutACumIBzTTd/ndAMxYwhQcLmMqDBUzjwQKm82ABM3iwgJk8WMAsHixgNg8WMIcHC5hrFAWPInsMC5hnuJ4fgj2GBcw3nAH2WCQBCwxngD0WScBCwxlgj0USsMhwBthjWMBiwxlgj2EBS4xi1/OL7TEsYClPJAHLeCIJWM6DBazgwQJW8kQSsIoHC1jNgwWs4cEC1vJgAet4sID1PFjABh4sYCMPFrCJBwvYzIMFbOHBArbyYAHbjJLk72WJLqWppXuylGb5lsACthv6B9e5iEgCdhh6yrmISAJ2GnrKuQgsYJehp5yLwAJ2G3rKuQgsYI9Rllwq06U8tfRIlvIs3xJYwF4eLGAfDxawnwcLOMCDBRzkwQIO8WABh3mwgCM8WMBRHizgGA8WcNzombxUe+nSO7VUJEtFlm8JLOCEoT8rzkVgAScNPeVcBBZwytBTzkVgAacNPeVcBBZwxtBTzkVgAWcNPeVcBBZwztBTzkVgAeeNPsmlvrpU/nOp1KVf6jMCC7jAgwVc5MECLvFgAZd5sIArPFjAVR4s4BoPFnCdBwu4wYMF3DSqqv+802p0qQmtl/6ppSq1iFwCqlve6rqEnJY2BNwy9JRzEZEE3Db0lHMRWMAdQ085F4EF3DX0lHMRWMA9Q085F4EF3DcGJJcG6lKbLIN0GZwstVk+I3IJyCss4AEPFvCQBwt4xIMFPObBAp7wYAFPebCAZzxYwHOeSAJeGEPq5J1aV69LfXoJrZehqc+IXALqWn5WdAk5LW0IeGnoKeciIgl4Zegp5yKwgNeGnnIuAgt4Y+gp5yKwgLeGnnIuIpeAYcml4bqMyGlpQ8A7nkgC3vNgAR94sICPPFjAJx4s4DNPJAFfeCIJ+EozEgsY9Y1lNBYw5jvLWCwgjPvBMR57fiY0cAomNKABIUxs/JlvjZP++rBfqyIieTdLR6MAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDEtMDlUMDE6MDU6MjErMDg6MDDE0qVuAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA5VDAxOjA1OjIxKzA4OjAwtY8d0gAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADEyOEN8QYAAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTI40I0R3QAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTY3MTIxrXPclAAAABF0RVh0VGh1bWI6OlNpemUANDAwMEJWJEOwAAAAYHRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzUzLzUzNTg5NS5wbmfa7goHAAAAAElFTkSuQmCC");
              background-size: 25px 25px;
              background-repeat: no-repeat;
              background-position: center;
            }

            .pointer-cursor {
              cursor: pointer !important;
            }
            .move-cursor {
              cursor: move !important;
            }
        `);
        document.body.appendChild(calculatorDiv);
        const inputBox = document.querySelector("#custom-calc .current");
        const resultBox = document.querySelector("#custom-calc .result");
        const calculator = document.querySelector("#custom-calc .calculator");
        const floatingBall = document.querySelector("#custom-calc .floating-ball");

        // 拖动功能
        function addDraggable(elementId, containerId) {
            const element = document.querySelector(elementId);
            const container = document.querySelector(containerId);
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            element.addEventListener("mousedown", function (e) {
                isDragging = true;
                dragOffset.x = e.clientX - container.offsetLeft;
                dragOffset.y = e.clientY - container.offsetTop;

                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onStop);
            });

            function onMove(e) {
                if (isDragging) {
                    container.style.left = e.clientX - dragOffset.x + "px";
                    container.style.top = e.clientY - dragOffset.y + "px";
                }
            }

            function onStop() {
                isDragging = false;
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onStop);
            }
        }

        function calculateResult() {
            let currentInput = inputBox.value;

            if (currentInput.trim() === "") {
                resultBox.innerText = "";
                return;
            }
            try {
                const expression = currentInput.replace(/,/g, "");
                const result = math.evaluate(expression);
                const resultText = result.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                });
                document.querySelector("#custom-calc .result").innerText = resultText;
            } catch (e) {
                document.querySelector("#custom-calc .result").innerText = "计算错误";
            }
        }

        // 添加事件监听器，实时计算结果
        inputBox.addEventListener("input", function(event) {
            calculateResult();
        });

        inputBox.addEventListener('keydown', function(event){
            if (event.altKey && event.key.toUpperCase() === 'C') return;
            // 阻止传播行为
            event.stopPropagation();
        });

        calculator.addEventListener('click', function(event) {
            // 阻止传播行为
            event.stopPropagation();
            // 聚焦到输入框
            inputBox.focus();
        });

        resultBox.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // 切换计算器显示状态
        function toggleCalculator() {
            console.log('切换计算器');
            const calculator = document.querySelector("#custom-calc .calculator");
            if (calculator.style.display === "none" || calculator.style.display === "") {
                calculator.style.display = "block";
                inputBox.focus();
            } else {
                calculator.style.display = "none";
            }
        }

        // 初始化拖动功能
        addDraggable("#custom-calc .header", "#custom-calc .calculator");

        function draggFloatingBall() {
            // 选择你想要使其可拖拽的元素
            const draggableElement = document.querySelector('#custom-calc .floating-ball');

            if (draggableElement) {
                // 初始化 interact.js
                interact(draggableElement)
                    .draggable({
                    // 设置惯性阻力（可选）
                    inertia: false,
                    // 开始拖动时触发
                    onstart: function(event) {
                        // 阻止默认的点击行为
                        event.preventDefault();
                        draggableElement.classList.add('dragging');
                    },
                    // 拖动过程中触发
                    onmove: function(event) {
                        let target = event.target;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        // 更新元素位置
                        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    // 结束拖动时触发
                    onend: function(event) {
                        setTimeout(()=>{
                            // 移除拖动状态类
                            draggableElement.classList.remove('dragging');
                        }, 100);
                    }
                });
                // 防止拖动时触发点击事件
                draggableElement.addEventListener('click', function(event) {
                    if (draggableElement.classList.contains('dragging')) {
                        event.stopPropagation();
                        event.preventDefault();
                    } else {
                        toggleCalculator();
                    }
                });
            }
        }

        draggFloatingBall();

        // 绑定按钮点击事件
        const buttons = document.querySelectorAll("#custom-calc .buttons button");
        buttons.forEach((button) => {
            button.addEventListener("click", function () {
                const value = this.innerText;
                if (value === "C") {
                    inputBox.value = "";
                    resultBox.innerText = "";
                } else {
                    inputBox.value = inputBox.value + value;
                    calculateResult();
                }
            });
        });

        document.querySelector("#custom-calc .close-btn").onclick = toggleCalculator;


        // 监听打开/关闭快捷键
        window.addEventListener('message', function (event) {
            if (event.data.type === 'shortcut') {
                const keyEvent = event.data;
                if (keyEvent.altKey && keyEvent.key.toUpperCase() === 'C') {
                    toggleCalculator();
                }
            }
        }, false);

        document.addEventListener('keydown', function (event) {
            if (event.altKey && event.key.toUpperCase() === 'C') {
                toggleCalculator();
            }
        });
    }

    /*
    -- 功能9：添加凭证页面
    */
    function modifyCustomTransferPage() {
        const currentURL = window.location.href;
        const targetURL = 'http://you.jxfxky.com:8998/nccloud/resources/gl/gl_transfer/selfExecute/syncTree/index.html#/';
        if (currentURL !== targetURL) return;
        console.log('进入自定义转账执行页面');

        // 点击对应结转项目后自动选中对应复选框
        function autoCheck(transferClass, transferName) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            const transferBars = node.querySelectorAll('.wui-tree-title.base-tree-node-title');
                            transferBars.forEach((transferBar) => {
                                const transferBarText = transferBar.querySelector('span.title-middle');
                                if (transferBarText && transferBarText.textContent.includes(transferClass)) {
                                    transferBar.addEventListener('click', function(event) {
                                        setTimeout(() => {
                                            const monthEndTrasferCheckbox = document.evaluate(`//tr[td/div[text()="${transferName}"]]//label[@class="wui-checkbox wui-checkbox-inverse wui-checkbox-primary base-checkbox-hotkey-wrapper nc-checkbox table-checkbox"]/input[@type="checkbox"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                            const includeUncoveredVoucherCheckbox = document.evaluate('//label[@class="wui-checkbox wui-checkbox-inverse wui-checkbox-primary base-checkbox-hotkey-wrapper nc-checkbox "]/input[@type="checkbox"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                            if (monthEndTrasferCheckbox) monthEndTrasferCheckbox.click();
                                            if (includeUncoveredVoucherCheckbox) includeUncoveredVoucherCheckbox.click();
                                        }, 500);
                                    });
                                }
                            });
                        }
                    });
                });
            });
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
        }
        autoCheck('002 月末结转', '月末损益结转');
        autoCheck('004 年末利润结转', '年末利润结转');


        // 改变单位后自动点击月末结转
        function autoClickMonthTransfer() {
            const observer = new MutationObserver(function(mutationsList) {
                mutationsList.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        // 检查目标元素是否已经出现在页面中
                        const inputDiv = document.evaluate('//div[contains(@class,"refer-input-common")and div//input[@placeholder="财务核算账簿"]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        const hiddienInputBox = document.evaluate('//li[div/input[@placeholder="财务核算账簿"]]/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (inputDiv && hiddienInputBox) {
                            const observer = new MutationObserver(function(mutationsList) {
                                mutationsList.forEach(function(mutation) {
                                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                                        const inputValue = hiddienInputBox.value;
                                        if (inputValue) {
                                            console.log('输入框的值被改变为:', inputValue);
                                            setTimeout(() => {
                                                const transferBar = document.evaluate('//span[text()="002 月末结转"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                                if (transferBar) transferBar.click();
                                            }, 500);
                                        }
                                    }
                                });
                            });
                            observer.observe(hiddienInputBox, { attributes: true });
                        }
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        autoClickMonthTransfer();

    }

    /*
    -- 功能10：隐藏消息角标
    */
    function hideBadge(times=20) {
        if (window.self === window.top) return;
        const messageHint = document.querySelector('.ant-badge .ant-badge-count');
        if (messageHint) {
            messageHint.style.display= 'none';
        } else {
            setTimeout(() => {
                hideBadge(times-1);
            }, 50);
        }
    }

    /*
    -- 测试网页地址
    */

    function printURL(times) {
        console.log(window.location.href);
        if (times > 0) printURL(times - 1);
    }
})();

/*
 * 更新日志
 *
 * 日期：2024-07-17
 * 版本：1.0
 * - 初始版本发布，添加了报表单元格选择界面求和功能
 *
 * 日期：2024-07-19
 * 版本：2.0
 * - 添加了双击单元格会跳转到明细的功能
 *
 * 日期：2024-07-25
 * 版本：3.0
 * - 添加了首页模拟鼠标点击，防止长时间不使用登出的功能
 *
 * 日期：2024-07-31
 * 版本：4.0
 * - 添加了科目余额表页面“辅助”的快捷键（Ctrl+S），添加对应快捷键说明
 *
 * 日期：2024-08-05
 * 版本：5.0
 * - 添加了“直接输出”报表的快捷键（Ctrl+E），并添加了说明
 *
 * 日期：2024-08-06
 * 版本：5.1
 * - 添加了更新日志，添加了脚本元数据块注释的@homepageURL，方便跳转主页
 *
 * 日期：2024-08-07
 * 版本：6.0
 * - 添加了凭证界面“联查余额”功能的快捷键（Ctrl+Y）
 *
 * 日期：2024-08-08
 * 版本：6.1
 * - 添加了凭证界面“联查序时账”功能的快捷键（Ctrl+J）
 * - 优化添加快捷键的逻辑，通过监测新增元素规避无法处理动态页面的情况
 * - 优化了凭证界面弹出现金流量的交互：如果弹出现金流量警告窗（"错误:现金流量本币金额分析错误!"），会关闭该弹窗并且自动点击现金流量按钮（重点：以后做凭证可以不用管现金流量无脑保存了）
 * - 优化了匹配单元格金额的正则表达式，避免了年月日也匹配上的情况
 *
 * 日期：2024-08-10
 * 版本：6.2
 * - 优化了联查功能的交互，在使用联查功能时，会自动勾选当前所有已选中行（蓝色的行），就不用再去手动勾选了
 * - 优化了求和功能，可以对相隔较远的单元格进行求和了，并且结果显示框增加了计数，更容易判断求和是否出现问题
 * - 修改凭证界面“联查序时账”功能的快捷键（Ctrl+J 修改为 Ctrl+L），与余额表界面联查明细账的快捷键一致
 * - 优化了功能描述注释
 *
 * 日期：2024-08-20
 * 版本：6.3
 * - 将代码发布到Greasy Fork，自动添加了@updateURL，以便用户自动更新
 *
 * 日期：2024-08-22
 * 版本：6.4
 * - 增加了跳转到辅助余额表页面自动点击两次“转换”按钮的功能，以便生成辅助编码
 * - 新增console art，更有辨识度
 *
 * 日期：2024-08-27
 * 版本：7.0
 * - 仿照BIP页面风格新增了设置面板，可以自由开关功能（目前部分功能还有BUG）
 * - 添加了卡片台账页面“输出xlsx文件”的快捷键（Ctrl+E）
 *
 * 日期：2024-10-12
 * 版本：7.1.1
 * - 添加了简易计算器
 * - 修复了按下删除键计算器不能删除的bug
 *
 * 日期：2024-10-15
 * 版本：7.1.2
 * - 修改了计算器聚焦的逻辑（点击计算器会自动聚焦到输入框）
 * - 使得计算器悬浮框可拖动，并且拖动时不会触发点击事件
 * - 调整结果显示方式，最小2位小数，最大6位小数
 *
 * 日期：2024-10-17
 * 版本：7.1.3
 * - 增加了打开/关闭计算器的快捷键（Alt+C）
 * - 修正了按快捷键只能按小写的bug
 * - 优化了计算器的计算逻辑（你甚至能在这里算对数！）
 *
 * 日期：2024-10-21
 * 版本：7.1.4
 * - 修改了设置的逻辑：保存并刷新后生效
 * - 修改了双击单元格进入明细及联查凭证的逻辑：使其在现金流量页面也会生效
 * - 修改了“全部导出”快捷键（Ctrl+E）的逻辑：使其在现金流量页面也会生效
 *
 * 日期：2024-10-25
 * 版本：7.1.5
 * - 修改设置界面UI
 * - 修改了大写状态不能使用辅助联查的bug
 *
 * 日期：2024-11-06
 * 版本：7.1.6
 * - 增加了凭证记账页面直接显示“取消记账”按钮的功能，不用费尽心思去找了
 *
 * 日期：2024-11-06
 * 版本：7.2.0
 * - 修改了显示“取消记账”按钮的功能，增加容错
 * - 增加了自定义转账界面的功能，实现半自动
 *
 * 日期：2024-11-19
 * 版本：7.2.1
 * - 修改网址（8998 => 8899）
 *
 * 日期：2024-11-19
 * 版本：7.2.2
 * - 修改网址（8999 => 8998），我宣布，用友就是在搞笑
 *
 * 日期：2024-12-20
 * 版本：7.2.3
 * - 添加了隐藏右上角角标的功能
 */