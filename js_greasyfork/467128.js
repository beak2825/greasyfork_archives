// ==UserScript==
// @name     批量添加地址
// @version  1
// @description Designed for bulk addition of whitelist addresses for Okex, supporting the batch addition of 1-20 addresses. Please prepare comma-separated addresses in advance. Author's Twitter: @DFarm_club.
// @description:zh-CN 专为okex批量添加白名单地址，支持1-20个地址批量添加，请提前准备好逗号分隔的地址。作者推特：@DFarm_club
// @grant    none
// @match    https://www.okx.com/cn/balance/withdrawal-address/*
// @license             GNU General Public License v3.0 or later
// @namespace https://greasyfork.org/users/1084769
// @downloadURL https://update.greasyfork.org/scripts/467128/%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/467128/%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

function setNativeValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event('input', { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16-17
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
}
function addButtonToPopup(popupElement) {
    var button = document.createElement('button');
    button.innerHTML = '批量添加地址';


    // 添加样式
    button.style.padding = '10px 20px'; // 增加内边距
    button.style.fontSize = '16px'; // 增大字体大小
    button.style.borderRadius = '5px'; // 增加圆角
    button.style.border = 'none'; // 去除边框
    button.style.backgroundColor = '#4CAF50'; // 更改背景颜色
    button.style.color = 'white'; // 更改文字颜色
    button.style.cursor = 'pointer'; // 更改鼠标指针样式
    button.style.fontWeight = 'bold'; // 字体加粗

    // 添加鼠标悬停样式
    button.onmouseover = function() {
        button.style.backgroundColor = '#45a049'; // 鼠标悬停时改变背景颜色
    };

    // 添加鼠标离开样式
    button.onmouseout = function() {
        button.style.backgroundColor = '#4CAF50'; // 鼠标离开时恢复原背景颜色
    };

    var buttonBox = popupElement.querySelector('.okui-dialog-btn-box.layout-right');
    if (buttonBox) {
        buttonBox.style.display = 'flex'; // 将父元素设置为flex
        buttonBox.style.justifyContent = 'space-between'; // 按钮之间添加空间
        buttonBox.insertBefore(button, buttonBox.firstChild); // 把你的按钮添加到"确定"按钮之前
    }

    button.addEventListener('click', async function() {
        var addressesString = prompt("请输入地址，用逗号分隔每个地址");
        if (addressesString === null) { // 用户点击了取消
            return;
        }
        var addresses = addressesString.split(','); // 使用逗号分割字符串，得到地址数组
        var count=addresses.length-1
        var targetElement = document.querySelector('.add-address-form-btn');
        if (targetElement) {
            for (var i = 0; i < count; i++) {
                targetElement.click();
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // 填充地址到输入框中
            var inputFields = document.querySelectorAll('.okui-input-input');
            var addressIndex = 0;
            for (var i = 0; i < inputFields.length; i++) {
                if (inputFields[i].placeholder === "请输入 ETH 提现地址/域名/.crypto domain" && addressIndex < addresses.length) {
                    //inputFields[i].value = addresses[addressIndex];
                    setNativeValue(inputFields[i], addresses[addressIndex]);
                    // 找到滚动容器并滚动到输入框的位置
                    var scrollContainer = inputFields[i].closest('.okui-dialog-container');
                    if (scrollContainer) {
                        inputFields[i].scrollIntoView();
                    }
                    addressIndex++;
                }
            }
            // 找到页面上的所有复选框并模拟点击选中
            var checkboxes = document.querySelectorAll('input[type="checkbox"].okui-checkbox-input');
            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].checked) {
                    checkboxes[i].click();
                }
            }
        }
    });
}
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('okui-dialog')) {
                    var title = node.querySelector('.top-content-title');
                    if (title && title.textContent === "新增提现地址") {
                        addButtonToPopup(node);
                    }
                }
            }
        }
    });
});

var config = { childList: true, subtree: true };

observer.observe(document, config);


