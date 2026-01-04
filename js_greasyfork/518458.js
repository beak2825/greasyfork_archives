// ==UserScript==
// @name         CRM优化1.9
// @icon         http://yy.boloni.cn/cm/images/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  按钮
// @author       HEBI VISION
// @match        *://yy.boloni.cn/*
// @grant         GM_addStyle
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/518458/CRM%E4%BC%98%E5%8C%9619.user.js
// @updateURL https://update.greasyfork.org/scripts/518458/CRM%E4%BC%98%E5%8C%9619.meta.js
// ==/UserScript==

//新增客户时自动填入
(function() {
    'use strict';
    // 检查目标元素是否存在且文本内容正确
    function checkAndExecute() {
        // 查找目标标题元素
        const targetElement = document.querySelector('#customerCode');
        // 检查元素是否存在且文本内容为"新增客户信息"
        if (targetElement && targetElement.textContent.trim() === "保存即生成") {
            console.log("检测到'保存即生成'页面，开始执行自动点击脚本");
            // 执行80后选项点击
            window.setInterval(function () {
                const elem1 = document.querySelector("#_easyui_combobox_i21_4");
                if (elem1) elem1.click();
            }, 500);
            // 执行门店销售选项点击
            window.setInterval(function () {
                const elem2 = document.querySelector("#_easyui_combobox_i20_3");
                if (elem2) elem2.click();
            }, 500);
            // 执行自由职业者选项点击
            window.setInterval(function () {
                const elem3 = document.querySelector("#_easyui_combobox_i22_18");
                if (elem3) elem3.click();
            }, 600);
            // 执行客户等级选项点击
            window.setInterval(function () {
                const elem4 = document.querySelector("#_easyui_combobox_i23_1");
                if (elem4) elem4.click();
            }, 500);
            // 执行自然到店选项点击
            window.setInterval(function () {
                const elem5 = document.querySelector("#_easyui_combobox_i25_1");
                if (elem5) elem5.click();
            }, 500);
            return true;
        }
        return false;
    }
    // 立即检查一次
    if (!checkAndExecute()) {
        // 如果没找到，设置一个定时器定期检查，直到找到为止
        const checkInterval = setInterval(function() {
            if (checkAndExecute()) {
                clearInterval(checkInterval); // 找到后清除检查定时器
            }
        }, 1000); // 每秒检查一次
    }
})();


//子合同填入
(function() {
    'use strict';
    // 检查目标元素是否存在且文本内容正确
    function checkAndExecute() {
        // 查找目标标题元素
        const targetElement = document.querySelector('#productLineListTitle');
        // 检查元素是否存在且文本内容为"新增客户信息"
        if (targetElement && targetElement.textContent.trim() === "子合同") {
            console.log("检测到'子合同'页面，开始执行自动点击脚本");
            // 子合同类型-输入框点击
            window.setInterval(function () {
                const elem = document.querySelector("#contractItemMoneyWin > div:nth-child(1) > div:nth-child(3) > span > input.textbox-text.textbox-text-readonly.validatebox-text.textbox-prompt");
                if (elem) elem.click();
            }, 450);

            // 子合同类似选项-正单合同点击
            window.setInterval(function () {
                const elem = document.querySelector("div[style*='width: 178.4px'] > #_easyui_combobox_i7_0");
                if (elem) elem.click();
            }, 500);

            // 签署日期-输入框点击
            window.setInterval(function () {
                const elem = document.querySelector("#contractItemMoneyWin > div:nth-child(1) > div:nth-child(4) > span > input.textbox-text.textbox-text-readonly.validatebox-text.textbox-prompt");
                if (elem) elem.click();
            }, 450);

            // 签署日期当天点击
            window.setInterval(function () {
                const elem = document.querySelector("div > div.datebox-calendar-inner.panel-noscroll > div > div.calendar-body > table > tbody > tr:nth-child(2) > td.calendar-day.calendar-today.calendar-selected.calendar-sunday.calendar-first,div > div.datebox-calendar-inner.panel-noscroll > div > div.calendar-body > table > tbody > tr:nth-child(2) > td.calendar-day.calendar-today.calendar-selected.calendar-saturday.calendar-last");
                if (elem) elem.click();
            }, 500);

            // 交货日期-输入框点击
            window.setInterval(function () {
                const elem = document.querySelector("#contractItemMoneyWin > div:nth-child(1) > div:nth-child(6) > span > input.textbox-text.textbox-text-readonly.validatebox-text.textbox-prompt");
                if (elem) elem.click();
            }, 400);

            // 交货日期点击
            window.setInterval(function () {
                const elem = document.querySelector("div > div.datebox-calendar-inner.panel-noscroll > div > div.calendar-body > table > tbody > tr:nth-child(5) > td.calendar-day.calendar-saturday.calendar-last");
                if (elem) elem.click();
            }, 500);

            // 服务设计师点击
            window.setInterval(function () {
                const elem = document.querySelector("#_easyui_combobox_i8_0");
                if (elem) elem.click();
            }, 500);

            return true;
        }
        return false;
    }

    // 立即检查一次
    if (!checkAndExecute()) {
        // 如果没找到，设置一个定时器定期检查，直到找到为止
        const checkInterval = setInterval(function() {
            if (checkAndExecute()) {
                clearInterval(checkInterval); // 找到后清除检查定时器
            }
        }, 1000); // 每秒检查一次
    }
})();

//子合同输入文字10000
(function() {
    'use strict';

    // 目标输入框的选择器（匹配所有奇数行第4列的input）
    const targetSelector = '#productLineIdMoney';

    // 要输入的值
    const inputValue = '10000';

    // 填充目标输入框
    function fillInputs() {
        const inputs = document.querySelectorAll(targetSelector);
        inputs.forEach(input => {
            if (input && input.type === 'text' && input.value !== inputValue) {
                input.value = inputValue;
                console.log(`已填充 ${input} 为 ${inputValue}`);

                // 触发 input 和 change 事件（某些网站可能需要）
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化（适用于动态加载的页面）
    const observer = new MutationObserver(fillInputs);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查（如果输入框已经存在）
    fillInputs();
})();







//新增房屋信息
(function() {
    'use strict';
    // 检查目标元素是否存在且文本内容正确
    function checkAndExecute() {
        // 查找目标标题元素
        const targetElement = document.querySelector('#updateHouseBtn');
        // 检查元素是否存在且文本内容为"新增客户信息"
        if (targetElement && targetElement.textContent.trim() === "编辑房屋") {
            console.log("检测到'编辑房屋'页面，开始执行自动点击脚本");

            // 三室选项点击
            window.setInterval(function () {
                const elem = document.querySelector("#_easyui_combobox_i14_2");
                if (elem) elem.click();
            }, 500);

            // 两厅选项点击
            window.setInterval(function () {
                const elem = document.querySelector("#_easyui_combobox_i15_1");
                if (elem) elem.click();
            }, 500);

            // 两卫选项点击
            window.setInterval(function () {
                const elem = document.querySelector("#_easyui_combobox_i16_1");
                if (elem) elem.click();
            }, 500);

            return true;
        }
        return false;
    }

    // 立即检查一次
    if (!checkAndExecute()) {
        // 如果没找到，设置一个定时器定期检查，直到找到为止
        const checkInterval = setInterval(function() {
            if (checkAndExecute()) {
                clearInterval(checkInterval); // 找到后清除检查定时器
            }
        }, 1000); // 每秒检查一次
    }
})();












//勾选活动时的复选框
(function() {
    'use strict';
    // 目标选择器（匹配前20行的复选框）
    const targetSelector = '#activityList > tr:nth-child(n+1):nth-child(-n+20) > td:nth-child(1) > input[type=checkbox]';
    // 检查并勾选所有匹配的复选框
    function checkAllCheckboxes() {
        const checkboxes = document.querySelectorAll(targetSelector);
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                console.log('已勾选复选框:', checkbox);
            }
        });
    }
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        checkAllCheckboxes();
    });
    // 开始观察整个文档的子树变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // 初始检查，以防元素已经存在
    checkAllCheckboxes();
})();

//勾选活动时输入文字10000
(function() {
    'use strict';

    // 目标输入框的选择器（匹配所有奇数行第4列的input）
    const targetSelector = '#activityList > tr:nth-child(odd) > td:nth-child(4) > input';

    // 要输入的值
    const inputValue = '10000';

    // 填充目标输入框
    function fillInputs() {
        const inputs = document.querySelectorAll(targetSelector);
        inputs.forEach(input => {
            if (input && input.type === 'text' && input.value !== inputValue) {
                input.value = inputValue;
                console.log(`已填充 ${input} 为 ${inputValue}`);

                // 触发 input 和 change 事件（某些网站可能需要）
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化（适用于动态加载的页面）
    const observer = new MutationObserver(fillInputs);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查（如果输入框已经存在）
    fillInputs();
})();



//增加房屋时房屋面积
(function() {
    'use strict';
    // 目标输入框的选择器（匹配所有奇数行第4列的input）
    const targetSelector = '#houseEditForm > div.pop50 > div.popline.wselt60.rjz_area.clearfix > div > input';
    // 要输入的值
    const inputValue = '150';
    // 填充目标输入框
    function fillInputs() {
        const inputs = document.querySelectorAll(targetSelector);
        inputs.forEach(input => {
            if (input && input.type === 'text' && input.value !== inputValue) {
                input.value = inputValue;
                console.log(`已填充 ${input} 为 ${inputValue}`);

                // 触发 input 和 change 事件（某些网站可能需要）
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
    // 使用 MutationObserver 监听 DOM 变化（适用于动态加载的页面）
    const observer = new MutationObserver(fillInputs);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // 初始检查（如果输入框已经存在）
    fillInputs();
})();


//增加房屋时地址信息间选框
(function() {
    'use strict';

    // 使用更稳定的选择器（根据实际情况修改）
    const selector = '#houseEditForm > div.pop50 > div:nth-child(4) > div > div:nth-child(2) > label > input[type=radio]';

    // 等待元素可用的函数
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();

        function checkElement() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }

            if (Date.now() - startTime > timeout) {
                console.log('等待元素超时');
                return;
            }

            requestAnimationFrame(checkElement);
        }

        checkElement();
    }

    // 更真实地模拟用户点击
    function simulateClick(element) {
        // 检查元素是否可见且可点击
        if (!element.offsetParent) {
            console.log('元素不可见，无法点击');
            return;
        }

        // 创建更完整的点击事件序列
        const clickEvents = [
            new MouseEvent('mouseover', { bubbles: true }),
            new MouseEvent('mousedown', { bubbles: true }),
            new MouseEvent('mouseup', { bubbles: true }),
            new MouseEvent('click', { bubbles: true })
        ];

        clickEvents.forEach(event => element.dispatchEvent(event));
        console.log('已模拟点击目标元素');
    }

    // 页面加载完成后开始等待目标元素
    window.addEventListener('load', () => {
        waitForElement(selector, (element) => {
            // 先滚动到元素位置
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 延迟一下确保元素完全可见
            setTimeout(() => {
                simulateClick(element);

                // 验证点击是否生效（根据实际情况修改）
                setTimeout(() => {
                    const isSelected = element.closest('label').classList.contains('ant-radio-checked');
                    if (isSelected) {
                        console.log('元素已成功选中');
                    } else {
                        console.log('点击可能未生效，尝试其他方法');
                        // 可以在这里添加备选方案
                    }
                }, 500);
            }, 300);
        });
    });
})();



//增加房屋时默认勾选国补单选框
(function() {
    'use strict';

    // 使用更稳定的选择器（根据实际情况修改）
    const selector = '#whetherGovtSubsidyList > label:nth-child(1) > input[type=radio]';

    // 等待元素可用的函数
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();

        function checkElement() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }

            if (Date.now() - startTime > timeout) {
                console.log('等待元素超时');
                return;
            }

            requestAnimationFrame(checkElement);
        }

        checkElement();
    }

    // 更真实地模拟用户点击
    function simulateClick(element) {
        // 检查元素是否可见且可点击
        if (!element.offsetParent) {
            console.log('元素不可见，无法点击');
            return;
        }

        // 创建更完整的点击事件序列
        const clickEvents = [
            new MouseEvent('mouseover', { bubbles: true }),
            new MouseEvent('mousedown', { bubbles: true }),
            new MouseEvent('mouseup', { bubbles: true }),
            new MouseEvent('click', { bubbles: true })
        ];

        clickEvents.forEach(event => element.dispatchEvent(event));
        console.log('已模拟点击目标元素');
    }

    // 页面加载完成后开始等待目标元素
    window.addEventListener('load', () => {
        waitForElement(selector, (element) => {
            // 先滚动到元素位置
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 延迟一下确保元素完全可见
            setTimeout(() => {
                simulateClick(element);

                // 验证点击是否生效（根据实际情况修改）
                setTimeout(() => {
                    const isSelected = element.closest('label').classList.contains('ant-radio-checked');
                    if (isSelected) {
                        console.log('元素已成功选中');
                    } else {
                        console.log('点击可能未生效，尝试其他方法');
                        // 可以在这里添加备选方案
                    }
                }, 500);
            }, 300);
        });
    });
})();



















//删除添加房屋时的省市筛选
window.setInterval(function () {
const element = document.querySelector('#housingEstatesSelectorForm > table > tbody > tr > td.wselt30');
if (element) {
  element.remove();
  console.log('元素已删除');
} else {
  console.log('未找到目标元素');
}
},500);//自然到店






(function() {
//=========以下代码为平台自动登录开始
var user="";
var pwd="";
if(document.querySelector("#loginUserCode")==null){
//没有找到表示登录了,不再执行后续代码
return;
}
//未登录,执行登录代码

document.querySelector("#loginUserCode").value="LAC002";
document.querySelector("#loginPassword").value="AA123123";

 window.setInterval(function () {//延迟点击代码
document.querySelector(".login-btn").click();
    },2500);//延迟代码3秒

//=========以上代码为平台自动登录结束

})();

// 在首页添加一个按钮，自动进入客户列表
(function() {
    'use strict';
    // 等待目标元素加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }
    // 创建并插入按钮
    function createAndInsertButton(referenceElement) {
        // 创建按钮元素
        const button = document.createElement('a');
        button.id = 'kefu'; // 添加ID
        button.href = 'https://yy.boloni.cn/cm/customer-info/list';
        button.textContent = '客户';
        button.className = 'ant-btn ant-btn-primary'; // 使用和页面现有按钮相同的类
        button.style.marginLeft = '8px'; // 添加一些间距
        // 插入按钮到参考元素后面
        referenceElement.parentNode.insertBefore(button, referenceElement.nextSibling);

        return button;
    }
    // 主函数
    function main() {
        const targetSelector = '#refundAndLineScaleForm > div:nth-child(4) > div.panel-header > div > div.note-tip.fl';
        waitForElement(targetSelector, (element) => {
            createAndInsertButton(element);
            // 2.5秒后点击按钮
            setTimeout(() => {
                const button = document.getElementById('kefu');
                if (button) button.click();
            }, 1000);
        });
    }
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();



//删除客户创建时间的时分秒
(function() {
    'use strict';

    // 移除时间的时分秒
    function removeTimeSeconds() {
        const timeElements = document.querySelectorAll('.datagrid-cell-c1-createTime');
        timeElements.forEach(element => {
            const originalText = element.textContent.trim();
            const newText = originalText.replace(/\s\d{2}:\d{2}:\d{2}$/, '');
            if (newText !== originalText) {
                element.textContent = newText;
            }
        });
    }

    // 初始执行一次
    removeTimeSeconds();

    // 监听DOM变化，如果新添加的元素符合条件，则立即处理
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                let needsUpdate = false;
                mutation.addedNodes.forEach(node => {
                    // 检查新增的节点或其子节点是否包含目标元素
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('datagrid-cell-c1-createTime')) {
                            needsUpdate = true;
                        }
                        if (node.querySelector('.datagrid-cell-c1-createTime')) {
                            needsUpdate = true;
                        }
                    }
                });
                if (needsUpdate) {
                    removeTimeSeconds();
                }
            }
        });
    });

    // 开始观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

//销售合同，合同名称只显示姓名，不显示后面的信息
(function() {
    'use strict';

    // 统一处理函数
    function formatNameAndDate(element) {
        const originalText = element.textContent.trim();
        const match = originalText.match(/^([\u4e00-\u9fa5]+)([\d-]+)/);

        if (match) {
            let name = match[1];
            const date = match[2];

            // 两字姓名：前加全角空格（Unicode \u3000）
            if (name.length === 2) {
                name = '\u3000' + name; // 如 "　张三"
            }

            // 清空原内容并重新构建DOM
            element.innerHTML = '';

            // 添加姓名（固定宽度字体）
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.style.display = 'inline-block';
            nameSpan.style.width = '3em'; // 固定宽度（足够容纳3个汉字）
            nameSpan.style.textAlign = 'left';
            element.appendChild(nameSpan);

            // 添加红色分隔符 "‖"
            const separator = document.createElement('span');
            separator.textContent = '‖';
            separator.style.color = 'red';
            separator.style.margin = '0 2px';
            element.appendChild(separator);

            // 添加日期
            element.appendChild(document.createTextNode(date));
        }
    }

    // 初始处理
    document.querySelectorAll('[id^="datagrid-row-r1-1-"] > td:nth-child(3) > div > a > div').forEach(formatNameAndDate);

    // 监听动态内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                document.querySelectorAll('[id^="datagrid-row-r1-1-"] > td:nth-child(3) > div > a > div').forEach(formatNameAndDate);
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();






 GM_addStyle(`

body > div:nth-child(50) {
    top: 500px !important;
}
/*录单界面的日期选择在左上角一闪一闪的*/

#receiveOppo {
    display: none;
}
#editOppoReceiptBtn {
    width: 100px;
    right: 500px;
    position: absolute;
}






#main_content > div.-fixedgrid.plr15.positionrel.-fixbox203.-nofixed.panel-noscroll > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-header > div > table > tbody > tr > td:nth-child(3),#main_content > div.-fixedgrid.plr15.positionrel.-fixbox203.-nofixed.panel-noscroll > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-header > div > table > tbody > tr > td:nth-child(10) {
    max-width: 80px;
}

#main_content > div.-fixedgrid.plr15.positionrel.-fixbox203.-nofixed.panel-noscroll > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-header > div > table > tbody > tr > td:nth-child(9),#main_content > div.-fixedgrid.plr15.positionrel.-fixbox203.-nofixed.panel-noscroll > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-header > div > table > tbody > tr > td:nth-child(10),#main_content > div.-fixedgrid.plr15.positionrel.-fixbox203.-nofixed.panel-noscroll > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-header > div > table > tbody > tr > td:nth-child(11),[id^="datagrid-row-r1-2-"] > td:nth-child(9),[id^="datagrid-row-r1-2-"] > td:nth-child(10),[id^="datagrid-row-r1-2-"] > td:nth-child(11) {
    display: none !important;
}







#loginUserCode,#loginPassword {
    font-weight: bold;
    font-size: 15px;
}



 #confirmHousingBtn {
    transform: translate(-265%, -1670%);
}
#main_content > div.btn-morebox.clearfix.animate:nth-child(6) > div.btn-allbox > div.btn-show.clearfix {
transform:translateX(-750%);
}

#main_content > div.btn-morebox.clearfix.animate:nth-child(13) > div.btn-allbox {
transform:translateX(-211%);
}

#addChildContract {
transform:translateX(-1100%);
}

.datagrid-cell-c1-storeName {
    display: none;
}

.datagrid-cell-c1-customerCode {
    display: none;
}

.datagrid-cell-c1-customerName {
    max-width: 70px;
}

#main_content > div.-fixedgrid.plr15.positionrel.-fixbox204.-nofixed.panel-noscroll:nth-child(14) > div.panel.datagrid.easyui-fluid > div.datagrid-wrap.panel-body.panel-body-noheader > div.datagrid-view:first-child > div.datagrid-view2:nth-child(2) > div.datagrid-header:first-child > div.datagrid-header-inner > table.datagrid-htable > tbody > tr.datagrid-header-row > td:nth-child(2) > div.datagrid-cell.datagrid-cell-c1-customerName {
    max-width: 70px;
}

#main_content > div.-fixedgrid.plr15.positionrel.-fixbox204.-nofixed.panel-noscroll:nth-child(14) > div.panel.datagrid.easyui-fluid > div.datagrid-wrap.panel-body.panel-body-noheader > div.datagrid-view:first-child > div.datagrid-view2:nth-child(2) > div.datagrid-header:first-child > div.datagrid-header-inner > table.datagrid-htable > tbody > tr.datagrid-header-row > td:nth-child(5) > div.datagrid-cell.datagrid-cell-c1-saleMans {
    display: none;
}


 #main_content > div.-fixedgrid.plr15.positionrel.-fixbox204.-nofixed.panel-noscroll:nth-child(14) > div.panel.datagrid.easyui-fluid > div.datagrid-wrap.panel-body.panel-body-noheader > div.datagrid-view:first-child > div.datagrid-view2:nth-child(2) > div.datagrid-header:first-child > div.datagrid-header-inner > table.datagrid-htable > tbody > tr.datagrid-header-row > td.datagrid-header-over:nth-child(6) > div.datagrid-cell.datagrid-cell-c1-designers{
    display: none;
}
.datagrid-cell-c1-saleMans {
    display: none;
}

.datagrid-cell-c1-designers {
    display: none;
}




 #main_content > div.-fixedgrid.plr15.positionrel.-fixbox204.-nofixed.panel-noscroll:nth-child(14) > div.panel.datagrid.easyui-fluid > div.datagrid-wrap.panel-body.panel-body-noheader > div.datagrid-view:first-child > div.datagrid-view2:nth-child(2) > div.datagrid-header:first-child > div.datagrid-header-inner > table.datagrid-htable > tbody > tr.datagrid-header-row > td:nth-child(11) > div.datagrid-cell.datagrid-cell-c1-sourceChannelFour{
    display: none;
}


 .datagrid-cell-c1-opportunityStatus{
    display: none;
}


 .datagrid-cell-c1-sourceChannelFour{
    display: none;
}



 .datagrid-cell-c1-createTime {
    min-width: 150px;
}


#main_content > div.-fixedgrid.plr15.positionrel.-fixbox204.-nofixed.panel-noscroll:nth-child(14) > div.panel.datagrid.easyui-fluid > div.datagrid-wrap.panel-body.panel-body-noheader > div.datagrid-view:first-child > div.datagrid-view2:nth-child(2) > div.datagrid-header:first-child > div.datagrid-header-inner > table.datagrid-htable > tbody > tr.datagrid-header-row > td.datagrid-header-over:nth-child(13) > div.datagrid-cell.datagrid-cell-c1-createTime {
    min-width: 150px;
}

 .datagrid-cell-c1-totalReceivedPayments {
    min-width: 130px;
}

#main_content > div.-fixedgrid.plr15.positionrel.-fixbox204.-nofixed.panel-noscroll:nth-child(14) > div.panel.datagrid.easyui-fluid > div.datagrid-wrap.panel-body.panel-body-noheader > div.datagrid-view:first-child > div.datagrid-view2:nth-child(2) > div.datagrid-header:first-child > div.datagrid-header-inner > table.datagrid-htable > tbody > tr.datagrid-header-row > td.datagrid-header-over:last-child > div.datagrid-cell.datagrid-cell-c1-totalReceivedPayments {
    min-width: 130px;
}



.datagrid-wrap.panel-body.panel-body-noheader{
max-height: 750px;
min-height: 750px;
}

div.datagrid-view{
max-height: 750px;
min-height: 750px;
}

div.datagrid-body{
max-height: 750px;
min-height: 750px;
}

.datagrid-header .datagrid-cell, .datagrid-header .datagrid-cell-group {
max-width: 300px;
}


.datagrid-cell-c1-address {
max-width: 300px;

}

span.select2-container.select2-container--default.select2-container--open:last-child > span.select2-dropdown.select2-dropdown--below {
min-width: 250px;

}


.pagination table {
    transform: translateX(-150%);
}
.pagination-info {
    transform: translateX(-300%);
}


/*勾选活动窗口的窗口大小*/
#OppoReceiptDIV > div.full-row-tip.warning{display: none;}
body > div:nth-child(65) {top: 5px !important;height: 700px !important;}
#frist_win{height: 700px !important;}
.basic-data-box > table td {padding: 1px 5px !important;font-size: 14px !important;}
.basic-data-box > table td textarea {height: 30px !important;}
.window .window-body {max-height: 580px;}


#main_content > div.btn-morebox.clearfix.animate > div > div > a.btn-style.green.editcluebox#newBtn {
    transform: translate(-1650%, 0%);
}

#houseEditForm > div.pop50 > div.popline.wline100.whether-govt-subsidy-btn {
transform: translate(55%, -715%);
}
.wline100 .w70 {
    width: 315px !important;
}

  `)

