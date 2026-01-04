// ==UserScript==
// @name         NGSOC、360、TDP、XDR ：Keep Alive
// @namespace    http://leyilea.com/
// @version      2024-08-28 v5.0
// @description  NGSOC、360、TDP、XDR ：防退出、自动生成告警信息
// @license      leyilea
// @author       Leyiea
// @match        https://10.201.30.40/*
// @match        https://10.201.30.37/*
// @match        https://10.201.30.20/*
// @match        https://10.201.30.34/*
// @match        https://10.209.235.35/*
// @match        https://10.1.253.104/*
// @match        https://10.201.32.10/*
// @match        https://10.1.253.111/*
// @icon         https://jwt.io/img/pic_logo.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503664/NGSOC%E3%80%81360%E3%80%81TDP%E3%80%81XDR%20%EF%BC%9AKeep%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/503664/NGSOC%E3%80%81360%E3%80%81TDP%E3%80%81XDR%20%EF%BC%9AKeep%20Alive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    *  防退出
    */
    function send_check_health_ngsoc(host){
        document.getElementsByClassName("search-controller--buttons")[0].getElementsByClassName("q-button q-button--primary q-button--small")[0].click();
        // NGSOC发送check-health请求
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://'+host+'/api/v1/alarms/check-health', true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理数据
                // console.log(JSON.parse(this.responseText));
            } else {
                // 请求失败
                console.error('Request failed. Returned status of ' + this.status);
            }
        };
        xhr.onerror = function () {
            // 请求过程中发生错误
            // console.error('There was a network error.');
        };
        xhr.send();
    }
    function click_360(){
        // 获取元素
        var element = document.getElementsByClassName("notify-btn")[0];
        // 模拟点击
        element.click();
        element.click();
        document.getElementsByClassName("search-button-wrap")[0].getElementsByClassName("ng-isolate-scope")[0].click();
    }
    function clickYiTiHua(){
        // 获取元素
        var element = document.getElementsByClassName("left_nav_back")[0].getElementsByClassName("type_div_layout span_cur")[0];
        // 模拟点击
        element.click();
    }
    function run() {
        const host = window.location.host;
        console.log("NGSOC AND 360 Keep Alive V3 正在运行~");
        if(host == "10.201.30.20" || host == "10.201.30.34"){
            click_360();
        }
        if (host == "10.209.235.35"){
            clickYiTiHua();
        }
        if (host == "10.201.30.40" || host == "10.201.30.37"){
            send_check_health_ngsoc(host);
        }
    };
    setInterval(run, 10*60*1000); // 1000毫秒 = 1秒





    /*
    *  自动生成告警数据
    */
    var is_secondary = false;
    // 生产告警信息
    function set_info(data,a_type){
        var info = "";
        if (is_secondary){
            info = "#二级单位\r\n";
        }
        info = info + "编号："+data["id"]+"-099";
        info = info + "\r\n" + "监测来源："+data["o"];
        info = info + "\r\n" + "时间："+data["alarm_time"];
        info = info + "\r\n" + "攻击IP："+data["attck_ip"];
        info = info + "\r\n" + "目标IP："+data["target_ip"];
        info = info + "\r\n" + "XFF："+data["xff"];
        info = info + "\r\n" + "域名URL："+data["domain"];
        info = info + "\r\n" + "告警级别：低危";
        info = info + "\r\n" + "攻击名称："+data["alarm_name"];
        info = info + "\r\n" + "事件类型："+a_type;
        info = info + "\r\n" + "攻击结果：失败";
        info = info + "\r\n" + "是否白名单：否";
        if (a_type=="弱口令"){
            info = info + "\r\n" + "处置建议：增强密码策略,修改弱口令：";
        }else{
            info = info + "\r\n" + "处置建议：封禁IP "+data["xff"]+"，"+data["attck_ip"];
        }
        return info;
    }
    // 获取数据
    function get_data(){
        var host = window.location.host;
        var o = "";
        var alarm_time="";
        var attck_ip="";
        var target_ip="";
        var domain="";
        var alarm_name="";
        var xff = "";
        var request="";
        var request_header="";
        var arr="";
        if(location.pathname == "/alarm/detail"){
            o = "NGSOC一级";
            if(host=="10.201.30.37"){
                o = "NGSOC二级";
                is_secondary=true;
            }
            alarm_time=document.getElementsByClassName("q-tooltip content")[0].textContent;
            attck_ip=document.getElementsByClassName("q-link--inner")[0].textContent;
            target_ip=document.getElementsByClassName("q-link--inner")[1].textContent;
            domain=document.getElementsByClassName("field-content q-popover__reference")[12].textContent;
            alarm_name=document.getElementsByClassName("base-info")[0].getElementsByClassName("title")[0].textContent.split("-")[1];
            // 获取xff ：开始
            arr = document.getElementsByClassName("tit");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].textContent.trim() === "HTTP请求头") {
                    xff = document.getElementsByClassName("field-content q-popover__reference")[i].textContent
                }
            }
            let pattern = /X-Forwarded-For: (.*)\r\n/i;
            if(xff.match(pattern)){
                xff = xff.match(pattern)[1];
            }else{
                xff="";
            }
            // 获取xff ：结束
        }else if(location.pathname.split("/")[2] == "cases" && location.pathname.split("/")[3] == "mergeAlarm" && location.search.split("=")[0] == "?id"){
            o = "360一级";
            if(host=="10.201.30.34"){
                o = "360二级";
                is_secondary=true;
            }
            arr = document.getElementsByClassName("fadeIn")[0].getElementsByClassName("text-gray-light font-small ng-binding");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].textContent === "攻击者组") {
                    attck_ip = arr[i].nextElementSibling.getElementsByClassName("ng-binding ng-scope")[0].textContent;
                }
                if (arr[i].textContent === "目的地址") {
                    target_ip = arr[i].nextElementSibling.getElementsByClassName("ng-binding ng-scope")[0].textContent;
                }
                if (arr[i].textContent === "域名") {
                    domain = arr[i].nextElementSibling.getElementsByClassName("ng-binding ng-scope")[0].textContent;
                }
                if (arr[i].textContent === "请求流量") {
                    request = arr[i].nextElementSibling.getElementsByClassName("ng-binding ng-scope")[0].textContent;
                }
            }
            let pattern = /X-Forwarded-For: (.*)\r\n/i;
            if(request.match(pattern)){
                xff = request.match(pattern)[1];
            }
            alarm_time=document.getElementsByClassName("margin-left-8 ng-binding")[0].textContent;
            alarm_name=document.getElementsByClassName("flex flex-center-y flex-item font-bolder incident-name font-2xs ng-binding")[0].textContent;
        }else if(location.pathname.split("/")[1] == "safeOperation" && location.pathname.split("/")[2] == "index"){
            request_header = document.getElementsByClassName("keywords")[3].textContent;
            o = "一体化";
            alarm_time=document.getElementsByClassName("el-descriptions-item__cell el-descriptions-item__content")[1].textContent.split(".")[0];
            attck_ip=document.getElementsByClassName("el-descriptions-item__cell el-descriptions-item__content")[10].textContent;;
            target_ip=document.getElementsByClassName("el-descriptions-item__cell el-descriptions-item__content")[11].textContent;;
            if(request_header.match(/Host: (.*)\r\n/i)){
                domain = request_header.match(/Host: (.*)\r\n/i)[1];
            }
            alarm_name=document.getElementsByClassName("el-descriptions-item__cell el-descriptions-item__content")[2].textContent;
            let pattern = /X-Forwarded-For: (.*)\r\n/i;
            if(request_header.match(pattern)){
                xff = request_header.match(pattern)[1];
            }
        }else if(location.pathname.split("/")[1] == "threatMonitor"){
            if(document.getElementsByClassName("requestFlow-cssmodule__request-35Hou requestFlow-cssmodule__on-1DibO")[0]){
                request_header = document.getElementsByClassName("requestFlow-cssmodule__request-35Hou requestFlow-cssmodule__on-1DibO")[0].textContent;
            }
            o = "TDP";
            alarm_time=document.getElementsByClassName("index-cssmodule__desc-2CJ0P")[0].getElementsByClassName("mgr10")[0].textContent;
            attck_ip=document.getElementsByClassName("index-cssmodule__alert-detail-indicator-2HCzl")[0].getElementsByClassName("index-cssmodule__info-item-2lK2a")[3].getElementsByClassName("text-overflow")[0].textContent;
            target_ip=document.getElementsByClassName("index-cssmodule__alert-detail-indicator-2HCzl")[0].getElementsByClassName("index-cssmodule__info-item-2lK2a")[4].getElementsByClassName("text-overflow")[0].textContent;
            if(request_header.match(/Host: ([a-zA-Z\.\:0-9]+)\s/i)){
                domain = request_header.match(/Host: ([a-zA-Z\.\:0-9]+)\s/i)[1];
            }
            alarm_name=document.getElementsByClassName("text-overflow index-cssmodule__color-error-3Gfth")[0].textContent;
            let pattern = /X-Forwarded-For: ([a-zA-Z\.\:0-9]+)\s/i;
            xff = "";
            if(request_header.match(pattern)){
                xff = request_header.match(pattern)[1];
                if(xff==attck_ip){
                    xff="";
                }
            }
        }else if(location.href.split("?")[0].split("#")[1] == "/incident/secgpt"){
            o = "XDR+GPT";
            alarm_name=document.getElementsByClassName("header")[0].getElementsByClassName("ix-text-inner")[0].textContent.trim();
            request_header=document.getElementsByClassName("data-package__content limit-width")[0].getElementsByTagName("section")[0].getElementsByClassName("data-item__content")[0].textContent;
            alarm_time=document.getElementsByClassName("ix-drawer-body")[0].getElementsByClassName("wrap")[0].getElementsByClassName("content")[1].getElementsByClassName("baseinfo-field")[7].getElementsByTagName("span")[1].textContent.trim();
            attck_ip=document.getElementsByClassName("normal-five-tuple")[0].getElementsByClassName("asset-card")[0].getElementsByClassName("top-label-content ns-text-ellipsis")[0].getElementsByClassName("ix-overlay-target")[0].textContent;
            target_ip=document.getElementsByClassName("normal-five-tuple")[0].getElementsByClassName("asset-card")[1].getElementsByClassName("top-label-content ns-text-ellipsis")[0].getElementsByClassName("ix-overlay-target")[0].textContent;
            if(request_header.match(/Host: (.*)\r\n/i)){
                domain = request_header.match(/Host: (.*)\r\n/i)[1];
            }
            let pattern = /X-Forwarded-For: (.*)\r\n/i;
            xff = "";
            if(request_header.match(pattern)){
                xff = request_header.match(pattern)[1];
            }
        }

        var id = alarm_time.split("-")[1] + alarm_time.split("-")[2].split(" ")[0];
        var data = {
            "o":o,
            "alarm_time":alarm_time,
            "attck_ip":attck_ip,
            "target_ip":target_ip,
            "domain":domain,
            "alarm_name":alarm_name,
            "xff":xff,
            "id":id
        }
        return data;
    }
    // 创建按钮
    function create_button(a_type){
        // 创建一个新的button元素
        var button = document.createElement('button');
        button.id = 'myButton'+a_type;
        button.type = 'button';
        button.textContent = a_type;
        // （可选）为按钮添加事件监听器
        button.addEventListener('click', function() {
            var data = get_data();
            var info = set_info(data,a_type);
            prompt("告警信息如下，全选复制\r\n"+info,info);
        });
        return button;
    }
    // 将button添加到父元素中
    function add_buttons_to_parent(parent){
        if(document.getElementById("myButton扫描探测")){
            // 什么也不做
        }else{
            //var b1 = create_button("代码执行");
            //var b2 = create_button("命令执行");
            var b3 = create_button("扫描探测");
            //var b4 = create_button("弱口令");
            var b5 = create_button("漏洞利用");
            var b6 = create_button("僵木蠕");
            // 将button添加到父元素中
            console.log(parent);
            //parent.appendChild(b1);
            //parent.appendChild(b2);
            parent.appendChild(b3);
            //parent.appendChild(b4);
            parent.appendChild(b5);
            parent.appendChild(b6);
        }
    }

    function run2(){
        if(location.pathname == "/alarm/detail"){
            // ngsoc
            // console.log("ngsoc");
            add_buttons_to_parent(document.getElementsByClassName("evidence-operate-container")[0]); // 1000毫秒 = 1秒
        }else if(location.pathname.split("/")[2] == "cases" && location.pathname.split("/")[3] == "mergeAlarm" && location.search.split("=")[0] == "?id"){
            // 360
            // console.log("360");
            add_buttons_to_parent(document.getElementsByClassName("sub-tabs border-bottom flex bg-gray")[0]);
        }else if(location.pathname.split("/")[1] == "safeOperation" && location.pathname.split("/")[2] == "index"){
            // 一体化
            // console.log("一体化");
            add_buttons_to_parent(document.getElementsByClassName("dialog-footer")[2]);
        }else if(location.pathname.split("/")[1] == "threatMonitor"){
            // TDP
            // console.log("TDP");
            add_buttons_to_parent(document.getElementsByClassName("tab-header-wrapper")[0]);
        }else if(location.href.split("?")[0].split("#")[1] == "/incident/secgpt"){
            // XDR
            // console.log("XDR");
            add_buttons_to_parent(document.getElementsByClassName("sfv-tabpanel_scroll")[0]);
        }
    }

    setInterval(run2,4000);

})();


