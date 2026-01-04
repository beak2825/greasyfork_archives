// ==UserScript==
// @name         tpy
// @namespace    https://panpacific.com/
// @license      MIT
// @version      0.1.2
// @description  用户内部
// @author       You
// @match        *://*.panpacific.com/*
// @match        https://umdigital.asia/pphg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511531/tpy.user.js
// @updateURL https://update.greasyfork.org/scripts/511531/tpy.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 设置定时器
    const intervalId = setInterval(distribute, 1000);

    function distribute() {
        console.log(window.location.pathname)
        if(window.location.pathname === "/zh.html"){
            let loggedInElement = document.querySelector('.name-logged-in');
            let textContent = loggedInElement.textContent.trim();
            console.log(loggedInElement,textContent)
            if(textContent===''){
                let labelElement = document.querySelector('.label3');
                labelElement.click();
                clearInterval(intervalId); // 停止定时器
            }else{
                xuanze()
            }

        }else if (window.location.pathname === "/zh/booking/make.html"){
            yuding()
        }else if(window.location.pathname === "/zh/booking/guest-detail.html"){
            tijiaoxinxi()
        }else if(window.location.pathname === "/zh/booking/confirmation.html"){
            clickPlayButton()
        }else if(window.location.pathname === "/pphg/"){

        }

    }
    function xuanze(){
        // 查找包含文本“目的地”的 p 标签
        const destinationElement = Array.from(document.querySelectorAll('.chosen-container.chosen-container-single .chosen-single span'))
        .find(span => span.textContent.trim() === "选择一项");

        console.log(destinationElement)
        if (destinationElement) {
            clearInterval(intervalId); // 停止定时器
            // 找到父级 .chosen-single 并点击
            const targetDropdown = destinationElement.closest('.chosen-single');

            if (targetDropdown) {
                console.log(targetDropdown, '找到包含“目的地”的下拉框');

                // 模拟点击事件，展开下拉框
                const event = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                targetDropdown.dispatchEvent(event);
                setTimeout(() => {
                    // 获取所有包含 "泛太平洋" 且属于指定城市的可选项
const options = Array.from(document.querySelectorAll('.chosen-results .active-result'))
    .filter(option => {
        const text = option.textContent;
        // 过滤出包含 "泛太平洋" 且属于北京、宁波、苏州、天津、厦门的选项
        return text.includes('泛太平洋') &&
               (text.includes('北京') || text.includes('宁波') || text.includes('苏州') || text.includes('天津') || text.includes('厦门'));
    });

if (options.length > 0) {
    // 随机选择一个符合条件的选项
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];
    console.log(selectedOption, '随机选择的泛太平洋酒店');


                        // 创建并触发 mousedown 事件
                        const mouseDownEvent = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        selectedOption.dispatchEvent(mouseDownEvent);

                        // 创建并触发 mouseup 事件
                        const mouseUpEvent = new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        selectedOption.dispatchEvent(mouseUpEvent);

                        // 创建并触发 click 事件
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        selectedOption.dispatchEvent(clickEvent);

                        // 延迟点击日期框和处理接下来的逻辑
                        setTimeout(() => {
                            console.log(23322);
                            // 点击日期框
                            document.querySelector('.form-group .btn-detail-selection').click();

                            // 等待日期框加载
                            setTimeout(() => {
                                const label = document.querySelector('label.custom-control.custom-checkbox');
                                console.log(label);
                                // 点击标签
                                if (label) {
                                    label.click();
                                    setTimeout(xuanzeriqi, 500);
                                }
                            }, 500);  // 等待 1 秒以确保日期框加载完成
                        }, 500);
                    } else {
                        console.log('未找到任何可选项');
                    }
                }, 1000);  // 等待下拉框展开后再选择
            } else {
                console.log("未找到目标下拉框");
            }
        } else {
            console.log("未找到包含“目的地”的元素");
        }

    }













    function clickPlayButton() {
        // 查找 class 为 'btn btn-play' 的 a 标签元素
        const playButton = document.querySelector('a.btn.btn-play');

        // 如果找到了该元素
        if (playButton) {
            const href = playButton.getAttribute('href'); // 提取 href 属性

            if (href) {
                // 打印 href 并执行页面跳转
                console.log('Redirecting to:', href);
                window.location.href = href; // 执行跳转
            } else {
                console.log('Href not found.');
            }
        } else {
            console.log('Play button not found.');
        }
    }



    // 判断 label3 是否可见的函数
    function isLabel3Visible() {
        const label = document.querySelector('.label3');

        if (label) {
            const style = window.getComputedStyle(label);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }

        return false;
    }
    function getCurrentStep() {
        // 查找 class 为 'nos selected' 的元素
        const selectedStep = document.querySelector('.step-nos .nos.selected');

        // 如果找到了该元素，返回它的文本内容作为当前步骤数字
        if (selectedStep) {
            return parseInt(selectedStep.textContent.trim());
        }

        // 如果没有找到选中的步骤，返回 0 表示未找到
        return 0;
    }












    function xuanzeriqi(){
        // 找到 "Next" 按钮
        const nextButton = document.querySelector('.datepicker-days .next');

        // 定义一个函数，间隔 1 秒点击 "Next" 按钮 3 次
        function clickNextWithDelay(times, delay) {
            let clickCount = 0;

            const clickInterval = setInterval(() => {
                if (clickCount < times) {
                    nextButton.click(); // 点击 "Next" 按钮
                    clickCount++;
                    console.log(`第 ${clickCount} 次点击`);
                } else {
                    clearInterval(clickInterval); // 停止定时器
                    console.log("点击完成");
                    //setTimeout(dianjishijian(),2000)
                }
            }, delay); // 每次点击的间隔时间
        }

        // 点击 3 次，每次间隔 1 秒（1000 毫秒）
        clickNextWithDelay(4, 50);
    }
    function dianjishijian(){
        // 获取所有可点击的日期单元格
        const days = Array.from(document.querySelectorAll('td.day')).filter(day => {
            const dayNumber = parseInt(day.textContent);
            // 保留当前月的 1 到 20 号的日期
            return dayNumber >= 1 && dayNumber <= 20 && !day.classList.contains('old') && !day.classList.contains('new');
        });

        console.log(days);

        // 确保有可点击的日期
        if (days.length > 0) {
            // 随机选择一个可点击日期
            const randomIndex = Math.floor(Math.random() * days.length); // 选择范围改为 days.length
            const selectedDay = days[randomIndex];
            console.log('Selected Day:', selectedDay);

            // 确保日期单元格可见
            selectedDay.scrollIntoView();

            // 点击日期
            selectedDay.click();

            // 延迟4秒后调用 dianjitijiao 函数
            setTimeout(() => {
                dianjitijiao();  // 传递函数引用而不是调用
            }, 4000);
        } else {
            console.log('No available days to select.');
        }

    }
    function dianjitijiao(){
        setTimeout(() => {
            const button = document.querySelector('.btn.button.button-primary.button-circle');
            if (button) {

                // 创建并触发点击事件
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(clickEvent);

            } else {
                console.log("未找到按钮");
            }
        }, 2000); // 100毫秒延迟，确保页面加载完成
    }
    function triggerClick(element) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }


    function yuding(){
        // 找到第一个具有指定类名的按钮并点击
        const bookNowButton = document.querySelector('.btn.btn-primary.btn-block.text-uppercase.pull-right.btn-booknow');
        console.log(bookNowButton)
        if (bookNowButton) {
            bookNowButton.click();
        } else {
            console.log('按钮未找到');
        }
    }
    function tijiaoxinxi(){

        console.log(1212121212)
        // 获取包含“国家/地区”的下拉框
        const chosenSingle = Array.from(document.querySelectorAll('.chosen-single'))
        .find(el => el.textContent.includes('国家/地区'));

        if (chosenSingle) {
            // 模拟点击选择框以显示选项
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            chosenSingle.dispatchEvent(mouseDownEvent);
            chosenSingle.dispatchEvent(mouseUpEvent);

            // 等待下拉框展开
            setTimeout(() => {
                // 获取要选择的选项
                const optionToSelect = document.querySelector('li.active-result[data-option-array-index="229"]');

                // 如果找到了该选项，则点击它
                if (optionToSelect) {
                    // 创建并触发 mousedown 事件
                    const mouseDownEvent = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    optionToSelect.dispatchEvent(mouseDownEvent);

                    // 创建并触发 mouseup 事件
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    optionToSelect.dispatchEvent(mouseUpEvent);

                    // 创建并触发 click 事件
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    optionToSelect.dispatchEvent(clickEvent);
                    // 触发下拉框的变更事件，确保选项被选中
                    const event = new Event('change', { bubbles: true });
                    chosenSingle.dispatchEvent(event);
                    setTimeout(quhao,500)
                } else {
                    console.log('选项未找到');
                }
            }, 500); // 等待下拉框展开
        } else {
            console.log('下拉框未找到');
        }
        function quhao(){
            // 查找具有 placeholder="区号" 的 input 元素
            const inputField = document.querySelector('input[placeholder="号码"]');

            // 如果找到了该输入框，则填写内容
            if (inputField) {
                inputField.value = generateRandomPhoneNumber(); // 填写内容
                // 触发输入事件以确保值被正确处理
                const event = new Event('input', { bubbles: true });
                inputField.dispatchEvent(event);
                setTimeout(visa,500)
            } else {
                console.log('输入框未找到');
            }
        }

        function generateRandomPhoneNumber() {
            // 生成随机的前缀 (XXX)
            const prefix = Math.floor(100 + Math.random() * 900); // 100-999之间的数字
            // 生成随机的后缀 (XXXX)
            const lineNumber = Math.floor(1000 + Math.random() * 9000); // 1000-9999之间的数字

            // 返回格式化的电话号码
            return `${prefix}${lineNumber}`;
        }
        function visa(){
            const chosenSingle = Array.from(document.querySelectorAll('.chosen-container-single'))
            .find(el => el.textContent.includes('信用卡类型'));
            console.log(chosenSingle)
            if (chosenSingle) {
                // 模拟点击选择框以显示选项
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                chosenSingle.dispatchEvent(mouseDownEvent);
                chosenSingle.dispatchEvent(mouseUpEvent);
                // 等待下拉框展开
                setTimeout(() => {
                    // 获取要选择的选项
                    const optionToSelect = Array.from(document.querySelectorAll('li.active-result'))
                    .find(option => option.innerText.trim() === 'Visa');


                    // 如果找到了该选项，则点击它
                    if (optionToSelect) {
                        // 创建并触发 mousedown 事件
                        const mouseDownEvent = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        optionToSelect.dispatchEvent(mouseDownEvent);

                        // 创建并触发 mouseup 事件
                        const mouseUpEvent = new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        optionToSelect.dispatchEvent(mouseUpEvent);

                        // 创建并触发 click 事件
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        optionToSelect.dispatchEvent(clickEvent);
                        // 触发下拉框的变更事件，确保选项被选中
                        const event = new Event('change', { bubbles: true });
                        chosenSingle.dispatchEvent(event);
                        setTimeout(kahao,500)
                    } else {
                        console.log('选项未找到');
                    }
                }, 500); // 等待下拉框展开
            } else {
                console.log('下拉框未找到');
            }
        }
        function getRandomCardData() {
            const data = [
                "4377664546504101|09|2027|526", "4377661723028045|08|2027|512", "4377663445482310|10|2029|973",
                "4377660627015561|08|2029|868", "4377662165177530|05|2026|755", "4377660543468837|11|2026|941",
                "4377660700755166|02|2027|605", "4377661455267365|08|2029|496", "4377663827275712|01|2029|447",
                "4377664627156862|10|2029|911", "4377660368708820|10|2028|124", "4377664608662276|08|2026|900",
                "4377660136273370|12|2026|447", "4377662040866265|08|2028|765", "4377666507567183|08|2026|673",
                "4377666370547684|04|2026|273", "4377664128218302|09|2027|196", "4377666853146384|07|2028|263",
                "4377664445375603|11|2029|818", "4377661284586480|06|2026|463", "4377660420065060|06|2028|595",
                "4377667561048672|03|2026|426", "4377668618202056|07|2027|208", "4377666045886202|01|2027|150",
                "4377666246688506|05|2026|575", "4377661618153668|02|2026|662", "4377666351748178|04|2029|619",
                "4377666163321073|10|2029|894", "4377660042471613|05|2029|676", "4377667055140688|08|2029|549",
                "4377664077187888|03|2026|525", "4377665000067170|08|2029|504", "4377668712310805|03|2029|320",
                "4377666871023367|08|2026|318", "4377660016106211|05|2026|705", "4377667626800786|07|2028|808",
                "4377664781702543|05|2029|591", "4377663647417452|07|2029|888", "4377664627100704|06|2026|951",
                "4377667081855226|01|2027|331", "4377660337411324|11|2028|757"
            ];

            // 随机选择一条数据
            const randomIndex = Math.floor(Math.random() * data.length);
            const selectedData = data[randomIndex];

            // 分割数据，提取卡号和月份/年份
            const [cardNumber, month, year] = selectedData.split('|');

            // 返回结果
            return {
                k: cardNumber,
                n: `${month}/${year}`
    };
        }
        function kahao(){
            let ka = getRandomCardData()
            // 查找具有 name="ccNum" 的 input 元素
            const inputField = document.querySelector('input[name="ccNum"]');

            // 如果找到了该输入框，则填写内容
            if (inputField) {
                inputField.value = ka.k; // 填写信用卡卡号
                // 触发输入事件以确保值被正确处理
                const event = new Event('input', { bubbles: true });
                inputField.dispatchEvent(event);
                // 查找具有 name="ccNum" 的 input 元素
                const inputccExpiry = document.querySelector('input[name="ccExpiry"]');

                // 如果找到了该输入框，则填写内容
                if (inputccExpiry) {
                    inputccExpiry.value = ka.n; // 填写信用卡卡号
                    // 触发输入事件以确保值被正确处理
                    const event = new Event('input', { bubbles: true });
                    inputccExpiry.dispatchEvent(event);
                    setTimeout(gouxuan,500)
                } else {
                    console.log('输入框未找到');
                }
            } else {
                console.log('输入框未找到');
            }
        }
        function gouxuan(){
            // 查找 input[name="receiveEmail"] 元素
            const checkbox = document.querySelector('input[name="receiveEmail"]');
            console.log(checkbox)
            // 检查是否找到 checkbox
            if (checkbox) {
                // 点击 checkbox
                checkbox.click();
                const inputcheckbox = document.querySelector('input[name="1"]');
                console.log(inputcheckbox)
                // 检查是否找到 checkbox
                if (inputcheckbox) {
                    // 点击 checkbox
                    inputcheckbox.click();
                    setTimeout(tijiaoyuding,500)
                } else {
                    console.log('未找到复选框');
                }
            } else {
                console.log('未找到复选框');
            }
        }
        function tijiaoyuding(){
            // 查找 id 为 "confirmation-submit" 的元素
            const confirmButton = document.getElementById('confirmation-submit');

            // 检查是否找到该元素
            if (confirmButton) {
                // 点击该按钮
                confirmButton.click();
            } else {
                console.log('未找到确认按钮');
            }
        }
    }

})();