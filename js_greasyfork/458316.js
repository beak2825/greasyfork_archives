// ==UserScript==
// @name         CatAndNew
// @namespace    https://trade.rapnet.*/
// @version      1.1
// @description  try to take over the world!
// @author       HeyLop
// @match        https://trade.rapnet.cn/*
// @match        https://trade.rapnet.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL-3.0
// @run-at       context-menu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458316/CatAndNew.user.js
// @updateURL https://update.greasyfork.org/scripts/458316/CatAndNew.meta.js
// ==/UserScript==


/**时间获取函数 */
function HM_Time() {
    let date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let mon = (date.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    let day = date.getDate(); //获取当前日(1-31)
    let h = date.getHours(); //获取当前小时数(0-23)
    let m = date.getMinutes(); //获取当前分钟数(0-59)
    let s = date.getSeconds(); //获取当前秒数(0-59)
    return year + '/' + mon + '/' + day + '-' + h + ':' + m + ':' + s;
}


(function () {


    'use strict';

    //公共数组，存储当前页面刷新后列表
    var current_page = []
    var click_id_list = []
    var readied_id_list = []

    //从浏览器本地存储获取已读列表
    var storage = window.localStorage;
    //初始化浏览器本地存储数据
    if (!storage.hasOwnProperty("fly-read-label")) {
        storage.setItem("fly-read-label", "");//存储
        storage.setItem("fly-read-time", "");//存储
    }


    //判断已使用本地存储大小
    var size = 0;
    for (var item in storage) {
        if (storage.hasOwnProperty(item)) {
            size += storage.getItem(item).length;
        }
    }
    //'当前localStorage已使用容量为' + (size / 1024).toFixed(2) + 'KB'
    //如果大于当前容量的80% ，就删掉……的数据
    var localStorageUsed = (size / 1024).toFixed(2);
    console.log("MSG==========>date:" + HM_Time() + ",当前已用存储:" + localStorageUsed + "KB,浏览器本地存储使用量:" + (localStorageUsed / (1024 * 5)))
    if ((localStorageUsed / (1024 * 5)) > 0.8) {
        alert("存储使用超过80%，请重置✈️📅数据!!!!!!")
    }
    else if ((localStorageUsed / (1024 * 5)) > 0.9) {
        storage.setItem("fly-read-time", "");
        storage.setItem("fly-read-label", "");
        alert("存储使用超过90%，已重置✈️📅数据!!!!!!")
    }

    //将表格title添加空按钮，调整样式与表格结果一致
    var TableButton = document.createElement('button')
    TableButton.id = "tabelebut"
    TableButton.innerText = "✈️"
    TableButton.style.fontSize = '14px';
    TableButton.style.cursor = "pointer";
    if (document.getElementById("tabelebut") == null) {
        document.querySelector('.checkbox-header-col__HeaderCheckbox-sc-17l94kc-0.kLQRPN').before(TableButton)

    }


    //页面顶部增加查看浏览器缓存日期与浏览器缓存日期按钮
    var CatDateID = document.createElement('button')
    CatDateID.id = "CatDateID"
    CatDateID.innerText = "查看✈️📅"
    CatDateID.className = 'button__StyledButton-sc-ceuy7i-0 kUAZbV filter-open-button__FilterButton-sc-1l3yltp-0 cdoVHc'
    var RestDateButton = document.createElement('button')
    RestDateButton.id = "RestDateButton"
    RestDateButton.innerText = "重置✈️📅"
    RestDateButton.className = 'button__StyledButton-sc-ceuy7i-0 kUAZbV filter-open-button__FilterButton-sc-1l3yltp-0 cdoVHc'
    var page_end = document.querySelector('.button__StyledButton-sc-ceuy7i-0.kUAZbV.filter-open-button__FilterButton-sc-1l3yltp-0.cdoVHc')
    if (document.getElementById("CatDateID") == null) {
        page_end.after(CatDateID)
    }
    if (document.getElementById("RestDateButton") == null) {
        page_end.after(RestDateButton)
    }



    //监听查看日期按钮并添加功能
    CatDateID.addEventListener('click', (e) => {
        if (storage.getItem("fly-read-time").length < 4) {
            alert("最后保存数据日期✈️📅为空，暂无数据!!! \n==========>MSG浏览器存储使用情况<===========\n当前时间:" + HM_Time() + "\n当前已用存储:" + localStorageUsed + "KB\n存储使用百分比:" + (localStorageUsed / (1024 * 5) * 100 + "%") + "\n⚠️警告：存储使用百分比超过80%告警提示!!!\n⚠️警告：存储使用百分比超过90%将自动清除数据!!!")
        } else {
            alert("最后保存数据日期✈️📅---->" + storage.getItem("fly-read-time") + "\n==========>MSG浏览器存储使用情况<===========\n当前时间:" + HM_Time() + "\n当前已用存储:" + localStorageUsed + "KB\n存储使用百分比:" + (localStorageUsed / (1024 * 5) * 100 + "%") + "\n⚠️警告：存储使用百分比超过80%告警提示!!!\n⚠️警告：存储使用百分比超过90%将自动清除数据!!!")
        }
    })
    //监听重置日期按钮并添加功能
    RestDateButton.addEventListener('click', (e) => {
        storage.setItem("fly-read-time", "");
        storage.setItem("fly-read-label", "");
        if (storage.getItem("fly-read-time").length < 4) {
            alert("重置✈️📅成功!!!请刷新页面后重新运行查看数据!!!")
        } else {
            alert("重置✈️📅失败!!!")
        }
    })

    var reade_id_list_tmp = storage.getItem("fly-read-label")
    readied_id_list = reade_id_list_tmp.split(',')

    //底部增加按钮处理设置过期时间与清除浏览器缓存



    document.querySelectorAll('#searchResultTable-tableBody .tableRowWrapper').forEach(element => {

        //生成按钮CatButton 可能是js的bug 必须将按钮放置到函数内才可生效，否则只能最后一次循环生效
        var CatButton = document.createElement('button')
        CatButton.id = "NewButton"
        CatButton.innerText = "看"
        CatButton.style.fontSize = '14px';
        CatButton.style.cursor = "pointer";
        CatButton.style.backgroundColor = '#70DB93' //绿色



        //公共参数声明
        var CurrentId = element.firstElementChild.firstElementChild.firstElementChild.firstChild.firstElementChild.firstChild.id
        var DefaultId = "DefaultButton" + CurrentId
        var target = document.getElementById(CurrentId)
        // console.log("==========>" + DefaultId)
        //处理已读，并在页面中进行标记
        //判断当前页面到每条数据是否倍点击过
        if (readied_id_list.includes(CurrentId)) {
            target.before(CatButton)
        } else {
            //生成按钮DefaultButton（字体，背景均为透明色） 用于填补没被点击到列前，统一页面格式
            var DefaultButton = document.createElement('button')
            DefaultButton.id = DefaultId
            DefaultButton.innerText = "空"
            DefaultButton.style.fontSize = '14px';
            DefaultButton.style.cursor = "pointer";
            DefaultButton.style.color = "Transparent"
            DefaultButton.backgroundColor = "Transparent"

            target.before(DefaultButton)
        }

        //点击后将id发送到浏览器本地存储，并删除default占位按钮添加已读按钮
        element.addEventListener('click', (e) => {
            e.preventDefault()
            // console.log("点击了!!!")
            click_id_list = readied_id_list
            if (document.getElementById(DefaultId) != null) {
                document.getElementById(DefaultId).remove()
            }
            target.before(CatButton)
            click_id_list.push(CurrentId)
            storage.setItem("fly-read-label", click_id_list);//存储
            if (storage.getItem("fly-read-time").length < 4) {
                storage.setItem("fly-read-time", HM_Time());//存储
            }


        })
    });
})();