// ==UserScript==
// @name         客户BUG代码提交检查单填充
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  表单填充
// @license MIT
// @author       none
// @match        http*://*/seeyon/collaboration/collaboration.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517257/%E5%AE%A2%E6%88%B7BUG%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BA%A4%E6%A3%80%E6%9F%A5%E5%8D%95%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/517257/%E5%AE%A2%E6%88%B7BUG%E4%BB%A3%E7%A0%81%E6%8F%90%E4%BA%A4%E6%A3%80%E6%9F%A5%E5%8D%95%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
        awaitInit();
    }, 3000);

    var zwDoc = window.document;
    function awaitInit(){
        if ($(".mask").length > 0) {
            setTimeout(function () {
                awaitInit();
            }, 1000);
            return;
        }
        setTimeout(function () {
            init();
        }, 200);
    }
    var trArr = [];
    var branchName = [];
    function init() {
        var zwWin = window;
        // for (let i = 0; i < 10; i++) {
        //     zwWin = zwWin.top;
        // }
        if ($(zwWin.document).find("#zwIframe").contents().length == 1) {
            zwWin = $(zwWin.document).find("#zwIframe")[0].contentWindow
            zwDoc = zwWin.document;
        }
        //初始化分支tr
        for (let i = 5; i <= 12; i++) {
            let find = $(zwDoc).find("#tableName-front_formmain_" + i).find("tr");
            for (let j = 0; j < find.length; j++) {
                trArr.push(find.get(j));
                branchName.push($($(find.get(j)).find("td")[2]).text());
            }
        }
        console.log("获取的tr:");

        console.log(trArr)
        console.log(branchName)
        if ($(zwDoc).find("#auxiliaryformmain_0line0col2_id").text().indexOf("客户bug代码提交检查单") != -1) {
            var select1StrArr = ["是", "否"];
            var select2StrArr = ["高版本无问题", "高版本提交过", "操作错误、无需提交", "低版本无此功能"];
            // 创建第一个选择框
            var select1 = $('<select style="text-align: center;min-width: 30px;" id="option1" name="option1"></select>');
            for (let i = 0; i < 2; i++) {
                var selected = i == 1 ? "selected" : "";
                select1.append('<option ' + selected + ' value="' + i + '">' + select1StrArr[i] + '</option>');
            }
            // 创建第二个选择框
            var select2 = $('<select  style="text-align: center;min-width: 30px;" id="option2" name="option2"></select>');
            for (let i = 0; i < 4; i++) {
                select2.append('<option value="' + i + '">' + select2StrArr[i] + '</option>');
            }
            // 创建开始分支
            var select3 = $('<select  style="text-align: center;min-width: 30px;" id="option3" name="option3"></select>');
            for (let i = 0; i < branchName.length; i++) {
                var select = branchName.length == i + 1 ? "selected" : "";
                select3.append('<option ' + select + ' value="' + i + '">' + branchName[i] + '</option>');
            }
            // 创建结束分支
            var select4 = $('<select  style="text-align: center;min-width: 30px;" id="option4" name="option4"></select>');
            for (let i = 0; i < branchName.length; i++) {
                select4.append('<option value="' + i + '">' + branchName[i] + '</option>');
            }
            zwWin.__AutoFillValue__V_123 = {};
            zwWin.__AutoFillValue__V_123.runAutoFillValue = runAutoFillValue;
            zwWin.__AutoFillValue__V_123.select1 = select1;
            zwWin.__AutoFillValue__V_123.select2 = select2;
            zwWin.__AutoFillValue__V_123.select3 = select3;
            zwWin.__AutoFillValue__V_123.select4 = select4;
            // 创建一个按钮
            var button = $('<button id="actionButton" onclick="__AutoFillValue__V_123.runAutoFillValue(__AutoFillValue__V_123.select1.val(),__AutoFillValue__V_123.select2.val(),Number(__AutoFillValue__V_123.select3.val()), Number(__AutoFillValue__V_123.select4.val()))">点击填充</button>');
            // 将创建的元素添加到容器中
            $(zwDoc).find('#auxiliaryformmain_0line0col2_id').append(select1, select2, button, "</br>启:", select3, "结:", select4);
        }
    }
    function sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }
    async function runAutoFillValue(options1Index, options2Index,options3Index, options4Index) {
        var options2Arr = [];
        var clearArr = [];
        for (let i = options4Index; i <= options3Index; i++) {
            let tr = trArr[i];
            let select = $(tr).find(".ui-select");
            console.log("选项:");
            console.log(select);
            if (select.length >= 2) {
                $(select[0]).trigger("click");
                await sleep(50)
                let options = $(zwDoc).find(".ui-popper").find(".cap4-select__option__left");
                if (options.length == 2) {
                    $(options[options1Index]).trigger("click");
                }
                if (options1Index == 0) {
                    clearArr.push($(tr).find(".ui-input__suffix--clear")[1]);
                }else{
                    //等于否选第二个
                    options2Arr.push($(select[1]));
                }
            }
        }
        await sleep(1000)
        for (let i = 0; i < options2Arr.length; i++) {
            options2Arr[i].trigger("click");
            await sleep(50)
            var options = $(zwDoc).find(".ui-popper").find(".cap4-select__option__left");
            console.log(options)
            if (options.length > 0) {
                $(options[options2Index]).trigger("click");
            }
        }
        for (let i = 0; i < clearArr.length; i++) {
            $(clearArr[i]).trigger("click");
        }
    }
})();