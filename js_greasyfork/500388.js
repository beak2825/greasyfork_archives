
// ==UserScript==
// @name          天气预报-rain
// @namespace     lixianqxj
// @version       1.0.2
// @description   自动化温度雨量填写
// @match         http://172.24.10.103/*
// @icon      	  https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @author        brady.wang
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/500388/%E5%A4%A9%E6%B0%94%E9%A2%84%E6%8A%A5-rain.user.js
// @updateURL https://update.greasyfork.org/scripts/500388/%E5%A4%A9%E6%B0%94%E9%A2%84%E6%8A%A5-rain.meta.js
// ==/UserScript==


function showAlert(str,color){
    var alertBox = document.createElement("div"); // 创建一个新的 div 元素作为弹窗容器
    alertBox.innerHTML = str; // 设置弹窗内容

    // 添加样式到弹窗容器
    alertBox.style.position = "fixed";
    alertBox.style.top = "20%";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translate(-50%, -50%)";
    alertBox.style.padding = "12px";
    alertBox.style.background = color;
    alertBox.style.borderRadius = "10px";
    alertBox.style.width = "211px";
    alertBox.style.height = "20px";
    alertBox.style.fontSize = "17px";
    alertBox.style.color = "#25a74d";
    alertBox.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";

    // 将弹窗容器添加到页面中
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove(); // 5秒后移除弹窗容器
    }, 5000);
}


function extractTemperatures(str) {
    // 正则表达式匹配温度范围，例如 "0.0℃-0.0℃"
    const tempRegex = /([-+]?\d*\.?\d+)℃-([-+]?\d*\.?\d+)℃/g;
    let tempMatches;
    const temperatures = [];

    // 使用while循环和exec方法来找到所有的匹配项
    while ((tempMatches = tempRegex.exec(str)) !== null) {
        // tempMatches[1] 是低温，tempMatches[2] 是高温
        temperatures.push(parseFloat(tempMatches[1])); // 添加低温到数组
        temperatures.push(parseFloat(tempMatches[2])); // 添加高温到数组
    }

    // 如果提取的温度值数量不是6个，抛出错误
    if (temperatures.length !== 6) {
        throw new Error('Failed to extract exactly six temperatures from the string.');
    }
    console.log(11111111111);

    console.log(temperatures);

    return temperatures;
}

function handleTextareaChange()
{
    console.log("概述输入框值变化");
    var gaishu_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(1) > div > div.el-form-item.is-success.is-required > div > div > div.cur-content > div > textarea");
    var tem_arr =    extractTemperatures(gaishu_obj.value);

     if(Array.isArray(tem_arr) && tem_arr.length == 6){
         console.log(tem_arr);
         // 第一天最低
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_18.is-center > div > div > div > div > input").value =tem_arr[0];
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

         // 第一天最高
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_19.is-center > div > div > div > div > input").value =tem_arr[1];
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

          // 第二天最低
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_29.is-center > div > div > div > div > input").value =tem_arr[2];
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

          // 第二天最高
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_30.is-center > div > div > div > div > input").value =tem_arr[3];
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

          // 第三天最低
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_40.is-center > div > div > div > div > input").value =tem_arr[4];
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
          // 第三天最高
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_41.is-center > div > div > div > div > input").value =tem_arr[5];
         document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


     } else {
       console.log("温度个数不对 未触发");
     }
}

function gaishu_input()
{
   var gaishu_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(1) > div > div.el-form-item.is-success.is-required > div > div > div.cur-content > div > textarea");
 
    gaishu_obj.addEventListener('keyup', handleTextareaChange);

}



function input_click() {

    // 第一天温度开始
    var zagunao_1_low_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_18.is-center > div > div > div > div > input");

     if (typeof zagunao_1_low_obj === "object" && zagunao_1_low_obj !== null) {
          showAlert("自动填充温度插件已准备好","#cff5c8");

     } else {
         showAlert("自动填充温度插件未准备好！请刷新页面！！！","red");
     }


    zagunao_1_low_obj.oninput = function () {
        console.log('第一天---最低温度---输入框的值发生了改变');


        var zagunao_1_low;
        var miyaluo_1_low;
        var guergou_1_low;
        var xuecheng_1_low;
        var taoping_1_low;
        var putou_1_low;
        var ganbao_1_low;
        var puxi_1_low;
        var shangmeng_1_low;
        var xiameng_1_low;
        var tonghua_1_low;
        zagunao_1_low = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_18.is-center > div > div > div > div > input").value;
        zagunao_1_low = Number(zagunao_1_low);



        miyaluo_1_low = zagunao_1_low - 6;
        guergou_1_low = zagunao_1_low - 3;
        xuecheng_1_low = zagunao_1_low + 1;
        taoping_1_low = zagunao_1_low + 2;
        putou_1_low = zagunao_1_low - 1;
        ganbao_1_low = zagunao_1_low;
        puxi_1_low = zagunao_1_low;
        shangmeng_1_low = zagunao_1_low - 3;
        xiameng_1_low = zagunao_1_low;
        tonghua_1_low = zagunao_1_low + 1;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = miyaluo_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = guergou_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = xuecheng_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = taoping_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = putou_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = ganbao_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = puxi_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = shangmeng_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = xiameng_1_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_18.is-center > div > div > div > div > input").value = tonghua_1_low;


        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_18.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
    };

    var zagunao_1_high_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_19.is-center > div > div > div > div > input");
    document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_19.is-center > div > div > div > div > input")
    zagunao_1_high_obj.oninput = function () {
        console.log('第一天---最高温度---输入框的值发生了改变');

        var zagunao_1_high;
        var miyaluo_1_high;
        var guergou_1_high;
        var xuecheng_1_high;
        var taoping_1_high;
        var putou_1_high;
        var ganbao_1_high;
        var puxi_1_high;
        var shangmeng_1_high;
        var xiameng_1_high;
        var tonghua_1_high;
        zagunao_1_high = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_19.is-center > div > div > div > div > input").value;
        zagunao_1_high = Number(zagunao_1_high);



        console.log("杂谷脑最高温度当前为" + zagunao_1_high);
        miyaluo_1_high = zagunao_1_high - 6;
        guergou_1_high = zagunao_1_high - 3;
        xuecheng_1_high = zagunao_1_high + 1;
        taoping_1_high = zagunao_1_high + 2;
        putou_1_high = zagunao_1_high - 1;
        ganbao_1_high = zagunao_1_high;
        puxi_1_high = zagunao_1_high;
        shangmeng_1_high = zagunao_1_high - 3;
        xiameng_1_high = zagunao_1_high;
        tonghua_1_high = zagunao_1_high + 1;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = miyaluo_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = guergou_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = xuecheng_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = taoping_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = putou_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = ganbao_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = puxi_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = shangmeng_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = xiameng_1_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_19.is-center > div > div > div > div > input").value = tonghua_1_high;

		document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_19.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

    };

    //第一天温度结束


    // 第二天温度开始

    var zagunao_2_low_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_29.is-center > div > div > div > div > input");

    zagunao_2_low_obj.oninput = function () {
        console.log('第二天---最低温度---输入框的值发生了改变');
        var zagunao_2_low;
        var miyaluo_2_low;
        var guergou_2_low;
        var xuecheng_2_low;
        var taoping_2_low;
        var putou_2_low;
        var ganbao_2_low;
        var puxi_2_low;
        var shangmeng_2_low;
        var xiameng_2_low;
        var tonghua_2_low;
        zagunao_2_low = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_29.is-center > div > div > div > div > input").value;
        zagunao_2_low = Number(zagunao_2_low);



        miyaluo_2_low = zagunao_2_low - 6;
        guergou_2_low = zagunao_2_low - 3;
        xuecheng_2_low = zagunao_2_low + 1;
        taoping_2_low = zagunao_2_low + 2;
        putou_2_low = zagunao_2_low - 1;
        ganbao_2_low = zagunao_2_low;
        puxi_2_low = zagunao_2_low;
        shangmeng_2_low = zagunao_2_low - 3;
        xiameng_2_low = zagunao_2_low;
        tonghua_2_low = zagunao_2_low + 1;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = miyaluo_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = guergou_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = xuecheng_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = taoping_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = putou_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = ganbao_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = puxi_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = shangmeng_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = xiameng_2_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_29.is-center > div > div > div > div > input").value = tonghua_2_low;


		document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_29.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


    };

    var zagunao_2_high_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_30.is-center > div > div > div > div > input")

        zagunao_2_high_obj.oninput = function () {
        console.log('第二天---最高温度---输入框的值发生了改变');

        var zagunao_2_high;
        var miyaluo_2_high;
        var guergou_2_high;
        var xuecheng_2_high;
        var taoping_2_high;
        var putou_2_high;
        var ganbao_2_high;
        var puxi_2_high;
        var shangmeng_2_high;
        var xiameng_2_high;
        var tonghua_2_high;
        zagunao_2_high = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_30.is-center > div > div > div > div > input").value;
        zagunao_2_high = Number(zagunao_2_high);



        console.log("杂谷脑最高温度当前为" + zagunao_2_high);
        miyaluo_2_high = zagunao_2_high - 6;
        guergou_2_high = zagunao_2_high - 3;
        xuecheng_2_high = zagunao_2_high + 1;
        taoping_2_high = zagunao_2_high + 2;
        putou_2_high = zagunao_2_high - 1;
        ganbao_2_high = zagunao_2_high;
        puxi_2_high = zagunao_2_high;
        shangmeng_2_high = zagunao_2_high - 3;
        xiameng_2_high = zagunao_2_high;
        tonghua_2_high = zagunao_2_high + 1;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = miyaluo_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = guergou_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = xuecheng_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = taoping_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = putou_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = ganbao_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = puxi_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = shangmeng_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = xiameng_2_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_30.is-center > div > div > div > div > input").value = tonghua_2_high;


        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_30.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

    };

    // 第二天温度结束


    // 第三天温度开始
    var zagunao_3_low_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_40.is-center > div > div > div > div > input");

    zagunao_3_low_obj.oninput = function () {
        console.log('第三天---最低温度---输入框的值发生了改变');
        var zagunao_3_low;
        var miyaluo_3_low;
        var guergou_3_low;
        var xuecheng_3_low;
        var taoping_3_low;
        var putou_3_low;
        var ganbao_3_low;
        var puxi_3_low;
        var shangmeng_3_low;
        var xiameng_3_low;
        var tonghua_3_low;
        zagunao_3_low = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_40.is-center > div > div > div > div > input").value;
        zagunao_3_low = Number(zagunao_3_low);



        miyaluo_3_low = zagunao_3_low - 6;
        guergou_3_low = zagunao_3_low - 3;
        xuecheng_3_low = zagunao_3_low + 1;
        taoping_3_low = zagunao_3_low + 2;
        putou_3_low = zagunao_3_low - 1;
        ganbao_3_low = zagunao_3_low;
        puxi_3_low = zagunao_3_low;
        shangmeng_3_low = zagunao_3_low - 3;
        xiameng_3_low = zagunao_3_low;
        tonghua_3_low = zagunao_3_low + 1;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = miyaluo_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = guergou_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = xuecheng_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = taoping_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = putou_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = ganbao_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = puxi_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = shangmeng_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = xiameng_3_low;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_40.is-center > div > div > div > div > input").value = tonghua_3_low;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_40.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
    };

        var zagunao_3_high_obj = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_41.is-center > div > div > div > div > input")

        zagunao_3_high_obj.oninput = function () {
        console.log('第三天---最高温度---输入框的值发生了改变');

        var zagunao_3_high;
        var miyaluo_3_high;
        var guergou_3_high;
        var xuecheng_3_high;
        var taoping_3_high;
        var putou_3_high;
        var ganbao_3_high;
        var puxi_3_high;
        var shangmeng_3_high;
        var xiameng_3_high;
        var tonghua_3_high;
        zagunao_3_high = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_41.is-center > div > div > div > div > input").value;
        zagunao_3_high = Number(zagunao_3_high);



        console.log("杂谷脑最高温度当前为" + zagunao_3_high);
        miyaluo_3_high = zagunao_3_high - 6;
        guergou_3_high = zagunao_3_high - 3;
        xuecheng_3_high = zagunao_3_high + 1;
        taoping_3_high = zagunao_3_high + 2;
        putou_3_high = zagunao_3_high - 1;
        ganbao_3_high = zagunao_3_high;
        puxi_3_high = zagunao_3_high;
        shangmeng_3_high = zagunao_3_high - 3;
        xiameng_3_high = zagunao_3_high;
        tonghua_3_high = zagunao_3_high + 1;

        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = miyaluo_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = guergou_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = xuecheng_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = taoping_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = putou_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = ganbao_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = puxi_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = shangmeng_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = xiameng_3_high;
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_41.is-center > div > div > div > div > input").value = tonghua_3_high;

		document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));
        document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_41.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

    };
    // 第三天温度结束

}



    // 获取明天的日期
   var today = new Date();
    var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    var month = tomorrow.getMonth() + 1;
    var day = tomorrow.getDate();

    var next_tomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);
    var next_month = next_tomorrow.getMonth() + 1;
    var next_day = next_tomorrow.getDate();

    var next_next_tomorrow = new Date(today.getTime() + 72 * 60 * 60 * 1000);
    var next_next_month = next_next_tomorrow.getMonth() + 1;
    var next_next_day = next_next_tomorrow.getDate();

     var tomorrow_str;
     var next_tomorrow_str
     var next_next_tomorrow_str
    if(day == 1){
      tomorrow_str = month.toString()+"月1"
    } else {
       tomorrow_str = day.toString()
    }


     if(next_day == 1){
      next_tomorrow_str = next_month.toString()+"月1"
    } else {
       next_tomorrow_str = next_day.toString()
    }

     if(next_next_day == 1){
      next_next_tomorrow_str = next_next_month.toString()+"月1"
    } else {
       next_next_tomorrow_str = next_next_day.toString()
    }

   var  two_str  =tomorrow_str + "日晚上到"+next_tomorrow_str+"日白天";
   var  three_str = next_tomorrow_str + "日晚上到"+next_next_tomorrow_str+"日白天";
   var last_str = "今天晚上到明天白天?，气温：0.0℃-0.0℃，偏北风1-3级。"+two_str+"?，气温：0.0℃-0.0℃；"+three_str+"?，气温：0.0℃-0.0℃。";

function isNumberWithOneDecimalOrInteger(value) {
  // 首先，检查值是否为空、null或undefined
  if (value === null || value === undefined || value === '') {
    return false;
  }

  // 尝试将值转换为数字
  const num = Number(value);

  // 检查转换是否成功，并且值是否有限（不是NaN、Infinity或-Infinity）
  if (isNaN(num) || !isFinite(num)) {
    return false;
  }

  // 将数字转换为字符串，并去除尾随的零（如果有的话）
  // 注意：toFixed在转换整数时会添加.0，但我们不想因此认为整数不是有效的
  const str = num.toString().replace(/\.?0+$/, ''); // 去除尾随的'.'和'0'

  // 检查处理后的字符串是否仅包含数字，并且（如果是小数）小数点后仅有一位数字
  // 或者，它是否是一个不包含小数点的纯数字（整数）
  const parts = str.split('.');
  if (parts.length === 1) {
    // 没有小数点，是整数
    return true;
  } else if (parts.length === 2 && parts[1].length === 1) {
    // 有小数点，且小数点后只有一位数字
    return true;
  }

  return false;
}
function adjustValue(originalValue) {
  // 确保 originalValue 是数字
  const numOriginalValue = Number(originalValue);
  if (isNaN(numOriginalValue)) {
    console.error('originalValue 不是一个有效的数字');
    return ''; // 或者返回其他默认值，比如 '0.0'
  }

  // 生成一个-0.9到0.9之间的随机数
  let randomChange = (Math.random() * 2 - 1) * 0.9;

  // 计算新值
  let newValue = numOriginalValue + randomChange;

  // 这里不需要再次检查 newValue 是否是数字，因为我们已经确保了 numOriginalValue 是数字，
  // 并且 randomChange 也是数字，所以它们的和也一定是数字。

  // 如果新值小于0且原始值是非负的，则返回原值（保留一位小数）
  if (newValue < 0 && numOriginalValue >= 0) {
    return numOriginalValue.toFixed(1);
  }

  // 返回调整后的值（保留一位小数）
  return newValue.toFixed(1);
}
function yuliang_change()
{
    // 第一天第一行温度----------------------------------------------------
    // 首先，尝试获取该元素
    var one_1 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input");

    var one_1_value = one_1.value;
    // 检查元素是否存在
    if (one_1 ) {
        // 给元素添加keyup事件监听器
        one_1 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            one_1_value = one_1.value;
            console.log("第一天 温度1 "+one_1_value)
            if(isNumberWithOneDecimalOrInteger(one_1_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_2_column_3.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }


    // 第一天 第二行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
    var one_2 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input")
    var one_2_value = one_2.value;
    // 检查元素是否存在
    if (one_2 ) {
        // 给元素添加keyup事件监听器
        one_2 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            one_2_value = one_2.value;

            console.log("第一天 温度1 "+one_2_value)
            if(isNumberWithOneDecimalOrInteger(one_2_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(one_2_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_6_column_7.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }
     // 第一天 第三行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
    var one_3 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input")
	var one_3_value = one_3.value;
    // 检查元素是否存在
    if (one_3 ) {
        // 给元素添加keyup事件监听器
        one_3 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            one_3_value = one_3.value;
            console.log("第一天 温度1 "+one_3_value)
            if(isNumberWithOneDecimalOrInteger(one_3_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(one_3_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_3_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_10_column_11.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }
     // 第一天 第四行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
    var one_4 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input")
	var one_4_value = one_4.value;
    // 检查元素是否存在
    if (one_4 ) {
        // 给元素添加keyup事件监听器
        one_4 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            one_4_value = one_4.value;
            console.log("第一天 温度1 "+one_4_value)
            if(isNumberWithOneDecimalOrInteger(one_4_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(one_4_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(one_4_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(3) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_1_column_14_column_15.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }






     // 第二天 第一行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
				document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input")
	var two_1 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input")
	var two_1_value = two_1.value;
    // 检查元素是否存在
    if (two_1 ) {
        // 给元素添加keyup事件监听器
        two_1 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            two_1_value = two_1.value;
            console.log("第二天 温度1 "+two_1_value)
            if(isNumberWithOneDecimalOrInteger(two_1_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(two_1_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_21_column_22.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }
     // 第二天 第二行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
				document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input")
	var two_2 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input")
	var two_2_value = two_2.value;
    // 检查元素是否存在
    if (two_2 ) {
        // 给元素添加keyup事件监听器
        two_2 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            two_2_value = two_2.value;
            console.log("第二天 温度1 "+two_2_value)
            if(isNumberWithOneDecimalOrInteger(two_2_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(two_2_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(two_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(5) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_2_column_25_column_26.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }

     // 第三天 第一行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
				 document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input")
	var three_1 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input")
	var three_1_value = three_1.value;
    // 检查元素是否存在
    if (three_1 ) {
        // 给元素添加keyup事件监听器
        three_1 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            three_1_value = three_1.value;
            console.log("第三天 温度1 "+three_1_value)
            if(isNumberWithOneDecimalOrInteger(three_1_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(three_1_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_1_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_32_column_33.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }
     // 第三天 第二行温度-----------------------------------------------------------------------
     // 首先，尝试获取该元素
				  document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input")
	var three_2 = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input")
	var three_2_value = three_2.value;
    // 检查元素是否存在
    if (three_2 ) {
        // 给元素添加keyup事件监听器
        three_2 .addEventListener('keyup', function(event) {
            // 在这里编写你希望在keyup事件发生时执行的代码
            console.log('Key pressed:', event.key);
            three_2_value = three_2.value;
            console.log("第三天 温度1 "+three_2_value)
            if(isNumberWithOneDecimalOrInteger(three_2_value)){
              //如果是浮点数，才修改下面的值
                 //米亚罗镇
                var val = adjustValue(three_2_value);
                console.log(val)

                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //古尔沟镇
                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(3) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                //薛城镇
                //桃坪镇
                //朴头镇
                //甘堡乡
                //蒲溪乡
                //上孟乡
                //下孟乡
                //通化乡
                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(4) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));

                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(5) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(6) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(7) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(8) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));



                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(9) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(10) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


                val = adjustValue(three_2_value);
                console.log(val)
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").value =val;
                document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(7) > div > div > div.el-table.el-table--fit.el-table--border.el-table--group.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(11) > td.el-table_3_column_36_column_37.is-center > div > div > div > div > input").dispatchEvent(new Event('input'));


            }


        });
    } else {
        console.log('The target element does not exist.');
    }
}

function lurushangci_click() {
    console.log("录入上次");
    var lurushangci = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(1) > div > div.el-form-item.is-required > div > div > div.last-content > button");
    lurushangci.click();
    
    setTimeout(function() {
        var text = document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(1) > div > div.el-form-item.is-success.is-required > div > div > div.cur-content > div > textarea");
        text.value = last_str;
        gaishu_input();
    }, 2000);


    input_click();
    yuliang_change();
}

var intervalId
function checkElementExists(selector) {
    // 使用querySelector查找元素，如果找到则返回该元素，否则返回null
    var element =  document.querySelector("body > div > section > section > div > div > div.content > div > div > div.__panel > div > div.left-box > div.product-text > form > div:nth-child(1) > div > div.el-form-item.is-required > div > div > div.last-content > button > span");
    if (element) {
        console.log('录入上次按钮元素找到了:', element);

        // 如果不再需要检测，可以清除定时器
        clearInterval(intervalId);

        // 你可以在这里执行需要的操作，比如停止检测、更新UI等
        lurushangci_click();


    } else {
        console.log('录入上次按钮还未找到，继续检测...');
    }
}


function myCallback(event) {
    console.log('点击后的回调', event);
    intervalId = setInterval(function() {
    checkElementExists('#myElement'); // 使用你的元素选择器替换'#myElement'
}, 1000); // 每秒检查一次

    //setTimeout(lurushangci_click, tm);
}

function isCurrentUrlSpecific() {
    const currentUrl = window.location.href;
    const targetUrl1 = 'http://172.24.10.103/?#/main/forecast/product/hour72';
    const targetUrl2 = 'http://172.24.10.103/#/main/forecast/product/hour72';

   if(currentUrl == targetUrl1 || currentUrl == targetUrl2){
      return true
   }else{
      return false
   }

}


function chaxun_click() {
    console.log("点击查询");
    //console.log("location.hostname:", location.hostname)
    let currentUrl = window.location.href;
    console.log("当前页面url: "+currentUrl);
    
    if(isCurrentUrlSpecific()){
        var chaxun = document.querySelector("body > div > section > section > div > div > div.content > div > div > div > div > div.left-box > div > div:nth-child(2) > button");
        if (chaxun) {
           // chaxun.click();
            chaxun.addEventListener('click', function(event) {
                // 处理点击事件
                console.log('点击了查询');
                // 执行回调逻辑
                myCallback(event);
            });
            chaxun.click();

        } else {
            console.log("元素不存在");
        }
    } else {
        console.log("不是72小时天气预报");
    }
}

(function () {
    'use strict';
    setTimeout(chaxun_click, 2000);

})();