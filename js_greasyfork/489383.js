// ==UserScript==
// @name         大麦抢票
// @version      2024-03-14（加了人数）
// @description  学习分享
// @author       ysq
// @license       MIT
// @match        https://www.damai.cn/*
// @match        https://m.damai.cn/shows/*
// @match        https://m.damai.cn/app/*
// @match        https://detail.damai.cn/*
// @match        https://www.damai.cn/*
// @icon         https://img.alicdn.com/tfs/TB1RxAHSmrqK1RjSZK9XXXyypXa-16-16.ico
// @run-at document-end
// @namespace https://greasyfork.org/users/1272145
// @downloadURL https://update.greasyfork.org/scripts/489383/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489383/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 延迟执行的操作
    function delayedOperation() {
        var items = document.querySelectorAll('.select_right_list_item.sku_item');

        console.log(items);
        if (items.length >0) {
            alert('注意提前登录账号，提前设定买票人');
            var target = [];
            var selectedTexts = [];

            items.forEach(function(item) {
                selectedTexts.push(item.textContent);
            });

            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;

            var popupWidth = 400;
            var popupHeight = 400;

            var popupLeft = (screenWidth - popupWidth) / 2;
            var popupTop = (screenHeight - popupHeight) / 2;

            var popup = window.open('', 'popup', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + popupLeft + ',top=' + popupTop);

            popup.document.write('<h2>票价/人数选择：</h2>');
            selectedTexts.forEach(function(text) {
                popup.document.write('<input type="checkbox" value="' + text + '"> ' + text + '<br>');
            });
            // 写入人数选择下拉框
            popup.document.write('<label for="peopleCount">选择人数:</label>');
            popup.document.write('<select id="peopleCount" name="peopleCount">');

            // 假设您有一个包含人数选项的数组
            var peopleCount
            var availablePeopleCounts = [1, 2, 3, 4, 5];
            availablePeopleCounts.forEach(function(count) {
                popup.document.write('<option value="' + count + '">' + count + '人</option>');
            });

            popup.document.write('</select>');
            popup.document.write('<br><button onclick="confirmSelection()">确定</button>');
            var selectedItems = [];

            popup.confirmSelection = function() {
                var checkboxes = popup.document.querySelectorAll('input[type="checkbox"]:checked');
                var selectedCount = popup.document.getElementById("peopleCount").value;
                console.log("人数",selectedCount)
                checkboxes.forEach(function(checkbox) {
                    selectedItems.push(checkbox.value);
                });

                console.log(selectedItems);
                popup.close();

                selectedItems.forEach(function(selectedText) {
                    items.forEach(function(item) {
                        if (item.textContent.includes(selectedText)) {
                            target.push(item);
                        }
                    });
                    var currentIndex = 0;
                    let i = 1;
                    target[currentIndex].click();

                    var consoleOutput = [];

                    function clickItems() {
                        if (currentIndex < target.length) {
                            target[currentIndex].click();
                            var t=document.querySelector('a.cafe-c-input-number-handler.cafe-c-input-number-handler-up');
                            if(t){
                                for (let j = 0; j < selectedCount-1; j++) {
                               t.click();
                            }}
                            var buyLink = document.querySelector('div.buy-link');

                            if (buyLink) {
                                var message1 = '有票了！！！！！！！！ ' ;
                                consoleOutput.push(message1);
                                console.log(message1);
                                buyLink.click();
                            }
                            currentIndex++;
                        } else {
                            var message = "第" + i + "次抢....";
                            consoleOutput.push(message);
                            console.log(message);
                            currentIndex = 0;
                            i++;
                        }
                    }

                    setInterval(clickItems, 200);

                    var consoleWindow = window.open('', 'consoleWindow', 'width=600,height=400');
                    consoleWindow.document.write('<h2>抢票信息</h2><div id="consoleOutput"></div>');

                    function updateConsoleOutput() {
                        var consoleOutputDiv = consoleWindow.document.getElementById('consoleOutput');
                        if (consoleOutput.length > 0) {
                            consoleOutputDiv.innerHTML = consoleOutput[consoleOutput.length - 1];
                        }
                    }


                    setInterval(updateConsoleOutput, 100);

                });
            };
        }
        else{
            //提交订单页面一以及选择“继续浏览器付款”
            var iconfonts= document.querySelectorAll('.iconfont.icondanxuan-weixuan_');
            iconfonts.forEach(function(iconfont){
                iconfont.click();
            });
            const allSpans = document.getElementsByTagName('span');
            var mouseDownEvent = new MouseEvent('mousedown', {
                'view': null,
                'bubbles': true,
                'cancelable': true
            });
            var mouseUpEvent = new MouseEvent('mouseup', {
                'view': null,
                'bubbles': true,
                'cancelable': true
            });

            // 循环遍历每个<span>标签
            for (let i = 0,j=0; i < allSpans.length; i++,j++) {
                // 判断<span>标签中的文本内容是否包含"提交订单"
                if (allSpans[i].textContent.includes("提交订单") || allSpans[i].textContent.includes("继续浏览器付款") || allSpans[j].textContent.includes("下一步")) {
                    // 点击包含"提交订单"文本信息的<span>标签
                    allSpans[i].dispatchEvent(mouseDownEvent);
                    allSpans[i].dispatchEvent(mouseUpEvent);
                }
            }

        }

    }
    // 在页面加载完成后延迟执行操作
    window.addEventListener('load', function() {
        setTimeout(delayedOperation, 500);
    });
    //判断当前页面为抢票页面


})();