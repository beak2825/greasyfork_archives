// ==UserScript==
// @name         视频号小店
// @name:zh-CN   视频号小店
// @namespace    https://greasyfork.org/zh-CN/scripts
// @version      1.6.3
// @description  快捷添加库存
// @author       僵尸先生
// @match        https://channels.weixin.qq.com/*
// @license      AGPL-3.0
// @icon         
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_getTab
// @downloadURL https://update.greasyfork.org/scripts/475148/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%B0%8F%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/475148/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%B0%8F%E5%BA%97.meta.js
// ==/UserScript==

(() => {
    "use strict";

    var btn_all
    var input_id

    //模拟键盘输入
    function simulateKeyboardInput(element, text) {
        let event = new Event('input', { bubbles: true });
        element.value = text;
        element.dispatchEvent(event);
    }

    function inventory_click(number) {
        // 定义一个定时器
        let bo = true;
        let btn_t = setInterval(function () {
            if (document.readyState === 'complete' && input_id.value === document.querySelectorAll('.flex')[10].children[0].textContent) {
                if (bo) {
                    document.querySelector('.icon_img').click()
                    bo = false;
                }
                setTimeout(function () {
                    let temp_text = document.querySelector('.item-basic-spu').innerText
                    if (temp_text.slice(temp_text.indexOf('-') - 14, temp_text.indexOf('-')) === input_id.value) {
                        let input_inventory_all = document.querySelectorAll('.weui-desktop-form__input')
                        setTimeout(function () {
                            document.querySelectorAll('#app .weui-desktop-tooltip.weui-desktop-tooltip__up-left')[1].click()
                            simulateKeyboardInput(input_inventory_all[0], number)
                            if (document.readyState === 'complete') {
                                setTimeout(function () {
                                    document.querySelectorAll('#app .weui-desktop-btn.weui-desktop-btn_default')[1].click()
                                }, 300);
                                setTimeout(function () {
                                    let btn_all_all = document.querySelectorAll('#app .weui-desktop-btn.weui-desktop-btn_primary')
                                    btn_all_all[1].click();
                                    btn_all_all[2].click();
                                }, 400);
                            }

                        }, 100);
                        //停止定时器
                        clearInterval(btn_t)
                    }
                }, 100);


            }
        }, 200);
    }


    function main(number) {
        // 在这里选择你要操作的input元素
        input_id = document.querySelector('.ignore_default_input') // 请替换为你的input的ID
        // 检查input元素是否存在
        if (input_id) {
            input_id.select()
            if (!navigator.clipboard) {
                console.log('浏览器不支持Clipboard API');
                return;
            }
            // 获取剪贴板中的数据
            navigator.clipboard.readText()
                .then(text => {
                    simulateKeyboardInput(input_id, text);
                })
                .catch(err => {
                    console.error('从剪贴板中获取数据失败：', err);
                });
        }
        btn_all = document.querySelectorAll('#app .weui-desktop-btn.weui-desktop-btn_default')
        // 定义一个定时器
        let input_timer = setInterval(function () {
            if (input_id.value.length === 14) {
                btn_all[0].click();
                // 停止定时器
                clearInterval(input_timer);
                inventory_click(number)
            }
        }, 200);
    }

    function check_inventory(number) {
        let con = setInterval(function () {
            if (document.readyState === 'complete') {
                btn_all[0].click()
                setTimeout(function () {
                    if (document.readyState === 'complete') {
                        let temp = document.querySelectorAll('.goods_price.WeChatSansStdRegular')[1].innerText
                        if (number !== parseInt(temp)) {
                            main(number)
                        }
                    }
                }, 500);
                clearInterval(con);
            }

        }, 2300);
    }


    // 监听键盘按下事件
    document.addEventListener('keydown', function (event) {
        // 判断按下的是哪个键
        if (event.key === 'Home') {
            // 打开数据
            document.querySelectorAll('.weui-desktop-menu__name')[11].click()
            setTimeout(function () {
                open(document.getElementsByName('goods')[0].appUrl)
            }, 100)


        }
        else if ((event.ctrlKey && event.keyCode >= 96 && event.keyCode <= 105) || (event.altKey && event.keyCode >= 96 && event.keyCode <= 105) || event.key === 'Insert') {
            let number = null
            if (event.ctrlKey) {
                number = event.keyCode - 96
            }
            else if (event.altKey && event.keyCode === 96) {
                number = 100
            }
            else if (event.altKey) {
                number = (event.keyCode - 96) * 10
            }
            else if (event.key === 'Insert') {
                let textBox
                let container = document.querySelectorAll('.flex')[0]
                if (container.firstChild.childNodes[2].childNodes[0].name !== 'inventory_text') {

                    let inventory_div = document.createElement("div")
                    let sourceControl = document.querySelector('.form_item_content ')
                    let sourceStyles = window.getComputedStyle(sourceControl)
                    // 将源控件的计算样式应用到目标控件
                    for (let i = 0; i < sourceStyles.length; i++) {
                        let styleName = sourceStyles[i];
                        inventory_div.style[styleName] = sourceStyles.getPropertyValue(styleName);
                    }

                    let textBox_line = document.createElement("div")
                    sourceControl = document.querySelector('.form_item_content_line')
                    sourceStyles = window.getComputedStyle(sourceControl)
                    for (let i = 0; i < sourceStyles.length; i++) {
                        let styleName = sourceStyles[i];
                        textBox_line.style[styleName] = sourceStyles.getPropertyValue(styleName);
                    }

                    let textBox_text_left = document.createElement("div")
                    textBox_text_left.innerHTML = '库存'
                    sourceControl = document.querySelector('.form_item_content_left')
                    sourceStyles = window.getComputedStyle(sourceControl)
                    for (let i = 0; i < sourceStyles.length; i++) {
                        let styleName = sourceStyles[i];
                        textBox_text_left.style[styleName] = sourceStyles.getPropertyValue(styleName);
                    }

                    let textBox_text_right = document.createElement("div")
                    sourceControl = document.querySelector('.form_item_content_right')
                    sourceStyles = window.getComputedStyle(sourceControl)
                    for (let i = 0; i < sourceStyles.length; i++) {
                        let styleName = sourceStyles[i];
                        textBox_text_right.style[styleName] = sourceStyles.getPropertyValue(styleName);
                    }

                    textBox = document.createElement("input")

                    //textBox.placeholder = '自定义库存'
                    sourceControl = document.querySelector('.ignore_default_input')
                    sourceStyles = window.getComputedStyle(sourceControl)
                    for (let i = 0; i < sourceStyles.length; i++) {
                        let styleName = sourceStyles[i];
                        textBox.style[styleName] = sourceStyles.getPropertyValue(styleName);
                    }

                    textBox.name = 'inventory_text'
                    textBox.type = 'text'
                    textBox.placeholder = '自定义库存'
                    textBox.style.opacity = '0.33'

                    textBox.addEventListener("click", function () {
                        inventory_div.style.borderColor = "#FF6146"
                    });

                    textBox.addEventListener("blur", function () {
                        inventory_div.style.borderColor = ''
                    });

                    textBox.addEventListener("input", function () {
                        if (textBox.value.trim() === "") {
                            textBox.style.opacity = "0.33";
                        } else {
                            textBox.style.opacity = "1";
                        }
                    });

                    textBox_text_right.appendChild(textBox)

                    inventory_div.appendChild(textBox_text_left)
                    inventory_div.appendChild(textBox_line)
                    inventory_div.appendChild(textBox_text_right)


                    // 将文本框添加到页面中的某个元素中
                    container.insertBefore(inventory_div, container.firstChild);


                }

                // 监听文本框的键盘按下事件
                textBox.addEventListener("keydown", function (event) {
                    // 检查按下的键是否是回车键
                    if (event.keyCode === 13) {
                        // 用户按下了回车键
                        number = parseInt(textBox.value)
                        main(number)
                        check_inventory(number)
                    }
                })
            }
            if (event.key !== 'Insert') {
                main(number)
                check_inventory(number)
            }




        }
    })



})();