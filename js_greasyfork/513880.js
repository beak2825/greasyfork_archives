// ==UserScript==
// @name         广东省城乡医保业务系统综合功能辅助插件
// @namespace    https://greasyfork.org/zh-CN/scripts/513880
// @version      0.1.5
// @description  广东省医保业务系统辅助插件优化体验
// @author       哈根达斯@高州市医保局
// @match        http://19.15.80.59/
// @icon         http://19.15.80.59/favicon.ico
// @grant        none
// @license      AGPL-3.0-or-later
// @antifeature  综合功能辅助插件说明
// @note         家庭人员信息维护新增跳转查询按钮
// @note         默认切换为扫码登录并且自动刷新二维码
// @downloadURL https://update.greasyfork.org/scripts/513880/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9F%8E%E4%B9%A1%E5%8C%BB%E4%BF%9D%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BB%BC%E5%90%88%E5%8A%9F%E8%83%BD%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/513880/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9F%8E%E4%B9%A1%E5%8C%BB%E4%BF%9D%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BB%BC%E5%90%88%E5%8A%9F%E8%83%BD%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

let dataContainer = {};
function waitFor(selector, callback) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        setTimeout(function() {
            waitFor(selector, callback);
        }, 1000); // 可以调整时间间隔
    }
}
var str = window.location.href;
if (str = "http://19.15.80.59/#/login?redirect=%2F") {
    waitFor('.download-plugin', function() {
        // 等待ant-modal-close-x 元素出现立即点击关闭按钮
        //location.replace(window.location.href);
        document.getElementById("tab-code").click();
        setTimeout(function (){
            location.replace("http://19.15.80.59/");
        }, 60000*2);
    });
} else if (str.includes("http://19.15.80.59/mbs-ui/N0104.html")) {
    // 城乡医保系统家庭人员信息查询页面
    // 使用示例
    waitForElementToBeVisible('td.ant-table-serial-number-custom', 60000).then(element => {
        // 元素可见时执行的代码
        QueryData();
        console.log('Element is visible:', element);
    }).catch(error => {
        // 超时时执行的代码
        QueryData();
        console.error('Timeout:', error.message);
    });
} else if (str.includes("http://19.15.80.59/mbs-ui/N1412.html")) {
    // 城乡医保系统人员综合查询页面跳转
    CertificateType();
} else {
}

function waitForElementToBeVisible(selector, timeout) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkVisibility = () => {
            const element = document.querySelector(selector);
            if (element && isElementInViewport(element)) {
                resolve(element);
            } else if (Date.now() - startTime >= timeout) {
                reject(new Error(`Element with selector "${selector}" was not visible within ${timeout}ms`));
            } else {
                // 继续检查，可以使用requestAnimationFrame或setTimeout
                // requestAnimationFrame通常用于动画循环，但在这里为了简单起见，我们使用setTimeout
                setTimeout(checkVisibility, 100); // 每100毫秒检查一次
            }
        };
        checkVisibility();
    });
}

// 辅助函数：检查元素是否在视口中可见
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function QueryData() {
    // 获取表格头部行
    const table = document.querySelector('.ant-table');
    if (table) {
        var headerRow = table.querySelector('.ant-table-thead tr');
        // 创建新的表头单元格
        var newHeaderCell = document.createElement('th');
        newHeaderCell.textContent = '查询缴费';
        // 假设第六列的索引为 5，根据实际情况调整
        var sixthHeaderCell = headerRow.children[5];
        // 将新的表头单元格插入到第六列之后
        sixthHeaderCell.parentNode.insertBefore(newHeaderCell, sixthHeaderCell.nextSibling);
        // 获取表格中的所有行
        var rows = table.querySelectorAll('.ant-table-tbody tr');
        rows.forEach(function(row) {
            // 创建新的单元格用于放置“立即跳转”按钮
            var newCell = document.createElement('td');
            // 创建“立即跳转”按钮
            var payButton = document.createElement('button');
            payButton.textContent = '立即跳转';
            payButton.className = 'ant-btn ant-btn-primary';
            payButton.addEventListener('click', function() {
                // 获取证件号码
                var certNo = row.cells[5]? row.cells[5].textContent.trim() : '';
                const newPageUrl = 'http://19.15.80.59/mbs-ui/N1412.html#/N141201';
                const newWindow = window.open(newPageUrl, '_blank');
                if (newWindow) {
                    newWindow.focus();
                    const checkLoadInterval = setInterval(() => {
                        // 判断 certNo 的长度是否为 18 位
                                    if (certNo.length === 18) {
                                        console.log('certNo 的长度是 18 位');
                                        // 在这里处理长度为 18 位的情况
                                    } else {
                                        console.log('certNo 的长度不是 18 位');
                                        // 在这里处理长度不为 18 位的情况

                                        CertificateType();
                                    }
                        if (newWindow.document.readyState === 'complete') {
                            clearInterval(checkLoadInterval);
                            const tabElements = newWindow.document.querySelectorAll('.ant-tabs-tab');
                            tabElements.forEach(tabElement => {
                                if (tabElement.textContent === '居民缴费信息') {
                                    tabElement.click();
                                    // 触发点击事件后等待一段时间再进行后续操作
                                    setTimeout(() => {
                                        const input = newWindow.document.getElementById('certno');
                                        if (input) {
                                            // 假设 certNo 是一个已定义的变量
                                            input.value = certNo;
                                            const changeEvent = new Event('input', { bubbles: true, cancelable: true });
                                            input.dispatchEvent(changeEvent);
                                            // 等待一段时间以确保页面已经处理完输入变化
                                            setTimeout(() => {
                                                // 模拟空格键
                                                const spaceKeyEvent = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true });
                                                input.dispatchEvent(spaceKeyEvent);
                                                // 模拟退格键
                                                const backspaceKeyEventStandard = new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true, cancelable: true });
                                                input.dispatchEvent(backspaceKeyEventStandard);
                                                // 模拟回车键（通常用于提交表单）
                                                const enterKeyEventStandard = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
                                                // 仅仅为了模拟回车事件（不实际提交表单）
                                                input.dispatchEvent(enterKeyEventStandard);
                                            }, 500);
                                        }
                                    }, 500);
                                }
                            });
                        }
                    }, 100);
                }
            });
            newCell.appendChild(payButton);
            // 确保有第六列单元格再进行插入操作
            if (row.cells.length > 5) {
                var sixthCell = row.cells[5];
                sixthCell.parentNode.insertBefore(newCell, sixthCell.nextSibling);
            }
        });
    }
    // 获取下拉选择框的元素
    const selectElement1 = document.querySelector('.ant-pagination-options .ant-select-selection');
    // 触发下拉选择框的展开
    triggerClick(selectElement1.querySelector('.ant-select-arrow'));
    // 等待下拉列表展开（这里需要一些延迟，因为展开是异步的）
    setTimeout(() => {
        // 查找表示“50 条/页”选项的DOM元素
        // 注意：这里使用了CSS选择器和特定的文本内容来定位元素
        var options = document.querySelectorAll('.ant-select-dropdown-menu-item');
        var targetOption = null;
        options.forEach(function(option) {
            if (option.textContent.trim() === '50 条/页') {
                targetOption = option;
            }
        });
        // 如果找到了目标选项，则触发其点击事件
        if (targetOption) {
            targetOption.click();
        } else {
            console.error('未找到“50 条/页”的选项');
        }
    }, 300); // 延迟时间可能需要根据实际情况调整
}

// 假设您已经有一个函数可以触发点击事件
function triggerClick(element) {
    const event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    element.dispatchEvent(event);
}

function CertificateType() {
    // 获取下拉选择框元素
    const selectElement2 = document.getElementById('psnCertType');
    // 触发下拉选择框展开
    selectElement2.click();
    // 等待下拉列表展开（这里假设展开需要一些时间，可以根据实际情况调整等待时间）
    setTimeout(() => {
        const dropdown = document.querySelector('.ant-select-dropdown');
        if (dropdown) {
            const options = dropdown.querySelectorAll('.ant-select-dropdown-menu-item');
            for (let i = 0; i < options.length; i++) {
                if (options[i].textContent.trim() === '其他身份证件') {
                    options[i].click();
                    break;
                }
            }
        } else {
            console.error('未找到下拉菜单');
        }
    }, 500);
}