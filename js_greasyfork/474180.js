// ==UserScript==
// @name         WendyPlugin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  this is a plugin for wendy
// @author       Wendy
// @match        https://h5.dawacq.com/*
// @match        http://h5.dawacq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474180/WendyPlugin.user.js
// @updateURL https://update.greasyfork.org/scripts/474180/WendyPlugin.meta.js
// ==/UserScript==

let DaWaScript = {
    Compose: {
        composeTimer: null,
        isComposeRunning: false,
        startCompose: function (btn) {
            console.log("运行脚本 compose");
            this.isComposeRunning = true;
            this.composeTimer = setInterval(function () {
                createClicker('#app > div > div.app-container > div > div.btn-bottom.flex.align-items-c.justify-b > div > div.btn', DaWaScript.Compose.isComposeRunning);
            }, parseInt(btn.attr('value')));
            btn.text("停止脚本");
        },
        stopCompose: function (btn) {
            this.isComposeRunning = false;
            clearInterval(this.composeTimer);
            console.log("停止脚本 compose");
            btn.text("运行脚本");
        }
    },
    QuickOrder: {
        quickOrderTimer: null,
        isQuickOrderRunning: false,
        startQuickOrder: function (btn) {
            console.log("运行脚本 quickOrder");
            this.isQuickOrderRunning = true;
            // 如果btn包含属性maxQuantity和minPrice，就执行批量操作
            if (btn.attr('maxQuantity') && btn.attr('minPrice')) {
                // 点击批量操作按钮
                console.log("点击批量操作按钮")
                $("#app > div > div.home > div.flex.handle-wrapper.justify-b > div.batch-all").click()
                // 如果存在标签#app > div > div.home > div.van-popup.van-popup--round.van-popup--bottom.custom-popup
                // 等标签van-overlay的display属性不为none，就执行下面的操作
                let timer = setInterval(function () {
                    if ($("#app > div > div.home > div.van-overlay").css('display') !== 'none') {
                        clearInterval(timer)
                        $(".select-term li:first-child input").val(btn.attr('minPrice'))
                        $(".select-term li:last-child input").val(btn.attr('maxQuantity'))
                    }
                }, 100)
                this.quickOrderTimer = setInterval(function () {
                    createClicker('#app > div > div.home > div.van-popup.van-popup--round.van-popup--bottom.custom-popup > div.submit-purchase > div.buy-btn', DaWaScript.QuickOrder.isQuickOrderRunning)
                }, parseInt(btn.attr('value')))

            } else {
                // 如果btn不包含属性maxQuantity和minPrice，就执行单个操作
                this.quickOrderTimer = setInterval(function () {
                    createClicker('#app > div > div.home > div.flex.handle-wrapper.justify-b > span', DaWaScript.QuickOrder.isQuickOrderRunning)
                }, parseInt(btn.attr('value')))
            }
            btn.text("停止脚本");
        },
        stopQuickOrder: function (btn) {
            this.isQuickOrderRunning = false;
            clearInterval(this.quickOrderTimer);
            console.log("停止脚本 quickOrder")
            btn.text("运行脚本")
        }
    },
}

// 创建连点函数
function createClicker(btn_selector, status = false) {
    if (status) {
        // 如果btn存在，就点击
        if ($(btn_selector).length > 0) {
            $(btn_selector).click();
        }
    }
}

// 快捷下单的运行脚本逻辑
function quickOrder(btn) {
    // 如果btn对应的文字是运行脚本，那么就运行脚本，否则就停止脚本
    if (btn.text().trim() === "运行脚本") {
        DaWaScript.QuickOrder.startQuickOrder(btn);
    } else {
        DaWaScript.QuickOrder.stopQuickOrder(btn);
    }
}

// 立即合成的运行脚本逻辑
function compose(btn) {
    let timer = null;
    if (btn.text().trim() === "运行脚本") {
        DaWaScript.Compose.startCompose(btn);
    } else {
        DaWaScript.Compose.stopCompose(btn);
    }
}

function quickOrder_config(btn) {
    // 检查是否已存在配置窗口，如果存在则返回
    if ($("#configModal").length) return;

    // 创建模态窗口
    let modal = $('<div>', {
        id: 'configModal',
        css: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    // 创建内容容器
    let content = $('<div>', {
        css: {
            width: '80%',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }
    });

    // 输入框，用于设置时间间隔
    let inputInterval = $('<input>', {
        type: 'number',
        value: btn.attr('value'),
        placeholder: '设置时间间隔 (毫秒)',
        css: {
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            fontSize: '14px',
        }
    });

    // 创建批量操作的开关
    let toggleSwitch = $('<input>', {
        type: 'checkbox',
        id: 'batchToggle',
        checked: btn.attr('maxQuantity') && btn.attr('minPrice'),
    });
    let toggleLabel = $('<label>', {
        for: 'batchToggle',
        text: '启用批量操作',
        css: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            width: '100%',
            fontSize: '14px',
        }
    });
    toggleLabel.prepend(toggleSwitch);

    // 批量操作的配置项
    let inputMinPrice = $('<input>', {
        type: 'number',
        value: btn.attr('minPrice'),
        placeholder: '最低价',
        css: {
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'none',
        }
    });
    let inputMaxQuantity = $('<input>', {
        type: 'number',
        value: btn.attr('maxQuantity'),
        placeholder: '最大数量',
        css: {
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'none',
        }
    });

    // 切换批量操作配置项的显示
    function changeStatus() {
        if (toggleSwitch.prop('checked')) {
            inputMinPrice.show();
            inputMaxQuantity.show();
        } else {
            inputMinPrice.hide();
            inputMaxQuantity.hide();
        }
    }

    changeStatus()
    toggleSwitch.change(function () {
        changeStatus()
    });

    // 保存按钮
    let saveButton = $('<button>', {
        text: '保存',
        css: {
            padding: '10px 20px',
            backgroundColor: 'rgb(255, 56, 70)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            width: '100%',
            marginTop: '10px',
        },
        click: function () {
            if (inputInterval.val() <= 400) {
                alert("时间间隔太短");
                $("#configModal").remove();
                return
            }
            // 这里可以根据需要保存配置
            btn.attr('value', inputInterval.val());
            // 如果批量按钮开启了，就保存批量操作的配置
            if (toggleSwitch.prop('checked')) {
                // 如果最低价或最大数量小于0，或者没填，就提示错误
                if (inputMaxQuantity.val() <= 0 || inputMinPrice.val() <= 0 || inputMaxQuantity.val() === "" || inputMinPrice.val() === "") {
                    alert("请填写相关参数且最大数量不能小于0");
                    $("#configModal").remove();
                    return
                }
                btn.attr('minPrice', inputMinPrice.val());
                btn.attr('maxQuantity', inputMaxQuantity.val());
            } else {
                btn.removeAttr('minPrice');
                btn.removeAttr('maxQuantity');
            }
            $("#configModal").remove();
        }
    });

    // 关闭按钮
    let closeButton = $('<span>', {
        text: '✖',
        css: {
            color: '#fff',
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
            fontSize: '0.4em', // 调整关闭按钮的字体大小
        },
        click: function () {
            $("#configModal").remove();
        }
    });

    // 组装内容并添加到页面
    content.append(closeButton, inputInterval, toggleLabel, inputMinPrice, inputMaxQuantity, saveButton);
    modal.append(content);
    $("body").append(modal);
}


function compose_config(btn) {
    // 检查是否已存在配置窗口，如果存在则返回
    if ($("#configModal").length) return;

    // 创建模态窗口
    let modal = $('<div>', {
        id: 'configModal',
        css: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    // 创建内容容器
    let content = $('<div>', {
        css: {
            width: '80%',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '14px', // 调整字体大小
        }
    });

    // 输入框，用于设置时间间隔
    let input = $('<input>', {
        type: 'number',
        value: btn.attr('value'),
        placeholder: '设置时间间隔 (毫秒)',
        css: {
            width: '80%',
            padding: '8px',
            marginBottom: '10px',
            fontSize: '14px', // 调整字体大小
        }
    });

    // 保存按钮
    let saveButton = $('<button>', {
        text: '保存',
        css: {
            padding: '8px 16px',
            backgroundColor: 'rgb(255, 56, 70)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '0.8em', // 调整字体大小
        },
        click: function () {
            if (input.val() <= 400) {
                alert("时间间隔太短");
            } else {
                btn.attr('value', input.val()); // 更新按钮的value属性
            }
            $("#configModal").remove(); // 关闭模态窗口
        }
    });

    // 关闭按钮
    let closeButton = $('<span>', {
        text: '✖',
        css: {
            color: '#fff',
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
            fontSize: '1.1em', // 调整关闭按钮的字体大小
        },
        click: function () {
            $("#configModal").remove(); // 关闭模态窗口
        }
    });

    // 组装内容并添加到页面
    content.append(closeButton, input, saveButton);
    modal.append(content);
    $("body").append(modal);
}


function new_button(height, content = "运行脚本") {
    let newButton = $('<div>', {
        text: content,
        css: {
            color: 'rgb(255, 255, 255)',
            fontWeight: '500',
            fontSize: '0.4rem',
            width: '1.6rem',
            height: height,
            lineHeight: height,
            textAlign: 'center',
            flex: 1,
            borderRadius: '0.213333rem',
            backgroundColor: 'rgb(255, 56, 70)',
            border: '0.0266667rem solid rgb(255, 56, 70)'
        }
    });
    return newButton;
}

function addButtonAfterTarget(parentSelector, targetChildText) {
// 为了防止重复添加，先判断是否已经添加了按钮
    let hasAdded = false;
    $(parentSelector).children().each(function () {
        if ($(this).text().trim() === "运行脚本" || $(this).text().trim() === "停止脚本"){
            hasAdded = true;
        }
    });
    $(parentSelector).each(function () {
        if (hasAdded) {
            return;
        }
        let targetChild = $(this).children().filter(function () {
            return $(this).text().trim() === targetChildText;
        });
        if (targetChild.length > 0) {
            // 获取高度
            let height = targetChild.css('height');
            targetChild.css('flex', 1);
            if (targetChildText === "快捷下单") {
                $(this).children().eq(targetChild.index() + 1).css('flex', 1);
                let newButton = new_button(height)
                newButton.attr('value', 1000);
                newButton.insertAfter(targetChild);
                let configButton = new_button(height, "配置脚本")
                configButton.insertAfter(newButton)
                // 绑定事件
                newButton.click(function () {
                    quickOrder($(this));
                })
                configButton.click(function () {
                    quickOrder_config(newButton)
                })

            } else {
                $(this).css('display', "flex");
                let newButton = new_button(height)
                // 设置newButton的属性value=700
                newButton.attr('value', 700);
                newButton.insertAfter(targetChild);
                let buttonConfig = new_button(height, "配置脚本")
                buttonConfig.insertAfter(newButton)
                // 绑定事件
                newButton.click(function () {
                    compose($(this));
                })
                buttonConfig.click(function () {
                    compose_config(newButton)
                })
            }

        }
    });
}

//

$(document).ready(function () {
    function startObserver(parentSelector, targetChildText) {
        const observer = new MutationObserver(function (mutations) {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const targetNode = document.querySelector(parentSelector);
                    if (targetNode) {
                        addButtonAfterTarget(parentSelector, targetChildText);
                        observer.disconnect(); // Stop observing once the element is found
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true, // Report added/removed nodes
            subtree: true,   // Also observe child nodes of the observed element
        });
    }

    function runScript() {
        if (window.location.href.includes("https://h5.dawacq.com/#/nft_market/list")) {
            console.log("this is a nft market page")
            // 监听，当页面中有了这个元素，就添加按钮
            startObserver('div.flex.handle-wrapper.justify-b', '快捷下单');
        }

        if (window.location.href.includes("https://h5.dawacq.com/#/pages/marketing/compose")) {
            console.log("this is a compose page")
            startObserver('div.r.flex-one', '立即合成');
        }
    }

    runScript()

    let originalPushState = window.history.pushState;
    window.history.pushState = function () {
        originalPushState.apply(window.history, arguments);
        runScript(); // 或其他您想在URL改变后执行的代码
    };

    window.addEventListener('popstate', function (event) {
        runScript(); // 或其他您想在URL改变后执行的代码
    });
})
;