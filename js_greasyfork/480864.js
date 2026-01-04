// ==UserScript==
// @name         Idle Infinity - 符文变动查询
// @version      0.1
// @description  符文变动查询
// @author       浮世
// @match        https://www.idleinfinity.cn/Equipment/Material?*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1199419
// @downloadURL https://update.greasyfork.org/scripts/480864/Idle%20Infinity%20-%20%E7%AC%A6%E6%96%87%E5%8F%98%E5%8A%A8%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/480864/Idle%20Infinity%20-%20%E7%AC%A6%E6%96%87%E5%8F%98%E5%8A%A8%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    // 创建存储符文数量的按钮
    var storeButton1 = $('<a class="btn btn-xs btn-default" id="storeRunesButton1">存储</a>');
    // var storeButton2 = $('<a class="btn btn-xs btn-default" id="storeRunesButton2">查询</a>');

    // 将按钮放入一个 div 中，并添加到 panel-heading 中
    var buttonContainer = $('<div class="pull-right" ></div>');
    buttonContainer.append(storeButton1);

    $('.panel-heading:contains("符文")').append(buttonContainer);

    var storedRuneCounts = {}; // 存储每个符文项的数量

    storeButton1.click(function() {
        var storedRuneCounts = {};
        $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function() {
            var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span
            var runeCount = parseInt($(this).find('p:first .artifact').last().text().trim()); // 获取符文数量
            // 检查解析是否成功，如果是 NaN 或者数量小于等于 20 则跳过不存储
            var regexResult = runeName.match(/-(\d+)#/);
            if (regexResult && parseInt(regexResult[1]) >= 1) {
                // 检查解析是否成功，如果是 NaN 则设为 0
                if (isNaN(runeCount)) {
                    runeCount = 0;
                }
                storedRuneCounts[runeName] = runeCount; // 存储符文数量
            }
        });

        var currentTime = new Date().toLocaleString(); // 获取当前时间
        localStorage.setItem('storedRuneCounts', JSON.stringify(storedRuneCounts)); // 存储到 localStorage
        localStorage.setItem('storedTime', currentTime); // 存储时间到 localStorage
        alert("已存储数据");
    });


    function showChange(){
        var storedRuneCounts = JSON.parse(localStorage.getItem('storedRuneCounts')) || {};
        var storedTime = localStorage.getItem('storedTime');
        var timeElement = $('<p>').text('存储时间: ' + storedTime); // 创建展示存储时间的元素
        var buttonContainer = $('<div class="pull-right" ></div>');
        buttonContainer.append(timeElement);
        $('.panel-heading:contains("符文")').append(buttonContainer);


        $('.col-xs-12.col-sm-4.col-md-3.equip-container').each(function() {
            var $pElement = $(this).find('p:first'); // 获取当前容器下的第一个 <p> 元素
            var runeName = $(this).find('p:first .equip-name .artifact:nth-child(2)').text().trim(); // 获取符文名称的第二个 span
            var currentRuneCount = parseInt($(this).find('p:first .artifact').last().text().trim()); // 获取符文数量

            if (storedRuneCounts.hasOwnProperty(runeName)) {
                var storedCount = storedRuneCounts[runeName];
                var changeCount = currentRuneCount - storedCount; // 计算数量变动
                if (changeCount !== undefined) {
                    var changeText = (changeCount > 0) ? ' -> +' + changeCount : ' -> ' + changeCount; // 根据变动数量生成对应文本

                    // 将变动数量拼接到符文信息的最后，并为 <p> 标签添加对应的样式
                    $pElement.append(changeText)
                        .css('color', (changeCount > 0) ? 'red' : (changeCount < 0) ? 'green' : ''); // 为 <p> 标签添加颜色样式
                }
            }



        });}
    showChange();
})();