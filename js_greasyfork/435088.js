// ==UserScript==
// @name         Infinity 导出 Excel
// @version      1.0.5
// @icon         https://inftab.com/icon/favicon.ico
// @description  Infinity Pro 网站版，将您保存的网站导出为一个 Excel 文件。导出前需要登录账号，如果导出的网站为空，请先刷新界面。
// @author       曦源 <pinkones@qq.com>
// @match        *://inftab.com/*
// @match        *://www.inftab.com/*
// @grant        none
// @run-at       document-end
// @namespace    项目地址github
// @supportURL   https://github.com/SunBrook/infinity_tool_scripts
// @homepageURL  https://github.com/SunBrook/infinity_tool_scripts
// @downloadURL https://update.greasyfork.org/scripts/435088/Infinity%20%E5%AF%BC%E5%87%BA%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/435088/Infinity%20%E5%AF%BC%E5%87%BA%20Excel.meta.js
// ==/UserScript==


'use strict';

function init(){
    // 目标位置
    var backup_btn_box = document.querySelector("side-profile")
    .shadowRoot.querySelector("side-user")
    .shadowRoot.querySelector("infinito-card.backup-recovery .backup-btn-box");

    // 创建 Excel 导出页面元素
    var export_excel_node = document.createElement("div");
    export_excel_node.className = "backup-btn-card";
    export_excel_node.innerHTML = ''+
    '<div class="backup-btn-content" id="ExportExcel">'+
    '<div class="backup-btn">'+
    '<div class="backup-btn-title">'+
    '<span class="backup-btn-title-text"><!---->导出 Excel 文件<!----></span>'+
    '<i-svg></i-svg>'+
    '</div>'+
    '<span class="backup-btn-desc"><!---->从当前本地数据导出<!----></span>'+
    '</div>'+
    '</div>';

    // 创建完成后，然后在设置图标
    var createFirst = new Promise(function (resolve, reject){
    backup_btn_box.append(export_excel_node);
    resolve("finish");
    });

    createFirst.then(function(message){
    // 设置导出图标样式
    var ico_svg = backup_btn_box.querySelector(".backup-btn-card:nth-child(4) .backup-btn-title i-svg")
    .shadowRoot.querySelector(".svg");
    ico_svg.style.webkitMaskImage = "url(/images/arrow-right.d51ffb7.svg)";
    });

    backup_btn_box.querySelector(".backup-btn-card:nth-child(4) div#ExportExcel").onclick = function(){
        GetWebInfoV2();
    }
}

setTimeout(init, 3000);


//网站数量
var tb_count = 0;

//获取用户的网站信息
function GetWebInfoV2() {
    //表头
    var tableHtml = '<div id="z_wrapper" style="z-index: 999999;position: absolute;background-color: white;width: 1000px;height: 500px;margin-left: 150px;margin-top:50px;overflow-y: scroll;padding:8px;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.8;border-radius: 15px;">' +
        '<table id="z_table" style="border-collapse: collapse;text-align:center;">' +
        '<tr>' +
        '<th style="border: 1px solid #ccc;padding:5px;width:500px;height:40px;">名称</th>' +
        '<th style="border: 1px solid #ccc;padding:5px;width:500px;height:40px;">网址</th>' +
        '<th style="border: 1px solid #ccc;padding:5px;width:100px;height:40px;">分类</th>' +
        '</tr>';

    //获取 window.localStorage
    var storage = window.localStorage;
    if (!storage) {
        alert("浏览器不支持LocalStorage");
        return;
    }

    //用户收藏的网站json字符串
    var store_site = storage["store-site"];
    if (!store_site) {
        alert("导出失败，请刷新页面重试");
        return;
    }

    //字符串 转 ToJson对象
    var u_list = JSON.parse(store_site).sites;

    //遍历 - 每页
    for (let i = 0; i < u_list.length; i++) {
        var page_list = u_list[i]; //某一页
        for (let j = 0; j < page_list.length; j++) {
            var unit_list = page_list[j]; //某个单元格
            var image_type = unit_list.bgType;
            //判断是 单个网站 还是文件夹 image / folder
            if (image_type == "image" || image_type == "color") {
                //单个网站 纯色
                //网站
                var url = unit_list.target;
                //过滤 infinity:// 开头的官方应用
                var fdStart = url.indexOf("infinity://");
                if (fdStart == 0) continue;
                //名称
                var name = unit_list.name;
                tableHtml += '<tr>' +
                    '<td style="border: 1px solid #ccc;padding:5px;height:25px;"  align="center">' + name + '</td>' +
                    '<td style="border: 1px solid #ccc;padding:5px;height:25px;"><a href="' + url + '" target="_blank">' + url + '</a></td>' +
                    '<td style="border: 1px solid #ccc;padding:5px;height:25px;"  align="center"></td>' +
                    '</tr>';
                tb_count++;
            } else if (image_type == undefined) {
                //文件夹
                //文件夹名称
                var folder_name = unit_list.name;
                //文件夹子项集合
                var folder_list = unit_list.children;
                //只要用户自定义的网站集合
                var item_user_disposed = new Array();
                for (let k = 0; k < folder_list.length; k++) {
                    var url = folder_list[k].target;
                    var fdStart = url.indexOf("infinity://");
                    if (fdStart == 0) continue;
                    item_user_disposed.push({ url: url, name: folder_list[k].name });
                }
                //组成table
                if (!item_user_disposed.length) continue;
                for (let m = 0; m < item_user_disposed.length; m++) {
                    if (m == 0) {
                        tableHtml += '<tr>' +
                            '<td style="border: 1px solid #ccc;padding:5px;height:25px;" align="center">' + item_user_disposed[m].name + '</td>' +
                            '<td style="border: 1px solid #ccc;padding:5px;height:25px;"><a href="' + item_user_disposed[m].url + '" target="_blank">' + item_user_disposed[m].url + '</a></td>' +
                            '<td style="border: 1px solid #ccc;padding:5px;height:25px;"  align="center" rowspan="' + item_user_disposed.length + '">' + folder_name + '</td>' +
                            '</tr>';
                    } else {
                        tableHtml += '<tr>' +
                            '<td style="border: 1px solid #ccc;padding:5px;height:25px;" align="center">' + item_user_disposed[m].name + '</td>' +
                            '<td style="border: 1px solid #ccc;padding:5px;height:25px;"><a href="' + item_user_disposed[m].url + '" target="_blank">' + item_user_disposed[m].url + '</a></td>' +
                            '</tr>';
                    }
                }
                tb_count += item_user_disposed.length;
            }
        }
    }

    tableHtml += '</table></div><a id="dlink"  style="display:none;"></a><input type="button" onclick="tableToExcel(\'tablename\', \'name\', \'myfile.xlsx\')" value="Export to Excel">';
    var div_table = document.createElement("div");
    div_table.id = 'temp_div';
    div_table.innerHTML = tableHtml;
    document.body.appendChild(div_table);

    console.log("网站个数：", tb_count);

    // tableToExcel('z_table', " 累计 " + tb_count + " 个网站"); //直接下载
    var userInfo = storage["store-user"];
    if (!userInfo) {
        tableToExcel('z_table', "累计 " + tb_count + " 个网站", "InfinityPro " + getCurrentDate(2));
    } else {
        var user_info = JSON.parse(userInfo).userInfo;
        if(user_info.name){
            var space = " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            tableToExcel('z_table', "用户：" + user_info.name + space + "共收藏 " + tb_count + " 个网站", "InfinityPro " + getCurrentDate(2));
        }
        else{
            tableToExcel('z_table', "累计 " + tb_count + " 个网站", "InfinityPro " + getCurrentDate(2));
        }
    }

    //销毁table
    document.getElementById("temp_div").remove();
}

//时间类
function getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //年份
    var month = now.getMonth();//月份
    var date = now.getDate();//日期
    var day = now.getDay();//周几
    var hour = now.getHours();//小时
    var minu = now.getMinutes();//分钟
    var sec = now.getSeconds();//秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
        time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
        time = year + "/" + month + "/" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
}


//导出excel
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g,
                function (m, p) { return c[p]; })
        }
    // 直接下载
    // return function (table, name) {
    //     if (!table.nodeType) table = document.getElementById(table)
    //     var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
    //     window.location.href = uri + base64(format(template, ctx))
    // }

    // 重命名下载文件
    return function (table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

        document.getElementById("dlink").href = uri + base64(format(template, ctx));
        document.getElementById("dlink").download = filename;//这里是关键所在,当点击之后,设置a标签的属性,这样就可以更改标签的标题了
        document.getElementById("dlink").click();

    }
})()