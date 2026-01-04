// ==UserScript==
// @name         CustBasicInfo
// @version      2025-05-12
// @description  掌厅及综合管理系统
// @author       CPP
// @match        *://172.16.41.51:*/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_DROM_ACTV*
// @match        *://172.16.41.51:*/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_VAR_AUTH*
// @match        *://172.16.41.51:*/livebos/.c5/link?j=*
// @match        *://172.16.41.11/backstage/index.php?act=procedure&op=specialVarityApplyCheck*
// @match        *://172.16.2.6:*/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_DROM_ACTV*
// @match        *://172.16.2.6:*/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_VAR_AUTH*
// @match        *://172.16.2.6:*/livebos/.c5/link?j=*
// @match        *://172.16.2.6/backstage/index.php?act=procedure&op=specialVarityApplyCheck*
// @match        *://172.16.41.11/backstage/index.php?act=procedure&op=specialVarityApplyDetail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace http://172.16.41.51:8011/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_DROM_ACTV
// @downloadURL https://update.greasyfork.org/scripts/515010/CustBasicInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/515010/CustBasicInfo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getElementByXpath(xpath){
        var element = document.evaluate(xpath,document).iterateNext();
        return element;
    }

    // 添加一个提示条
    var elem = document.createElement('nav');
    elem.setAttribute('height', '40px');
    elem.setAttribute('margin-top', '10px');
    elem.style.color = 'red';
    elem.style.fontSize = '20px';
    var taskNone;

    var url = window.location.href;
    var tag_name, tag_id, tag_cert;
    var cust_name, cust_cert, cust_id;

    if (url.indexOf('/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_DROM_ACTV') > -1) {
        tag_name = document.querySelector("#DATA_FORM > div > div:nth-child(1) > div > div.ant-collapse-content > div > div:nth-child(3) > div > div.ant-form-item-control-wrapper > div > div > div");
        tag_id = document.querySelector("#option_CLNT_ID_body > span:nth-child(1)");
        tag_cert = document.querySelector("#DATA_FORM > div > div:nth-child(2) > div > div.ant-collapse-content > div > div:nth-child(1) > div > div.ant-form-item-control-wrapper > div > div > div");
        taskNone = document.querySelector("#header");
    }
    else if (url.indexOf('/livebos/UIProcessor?Creator=workflow&Table=WF_MSH_VAR_AUTH') > -1) {
        tag_name = document.querySelector("#DATA_FORM > div > div:nth-child(1) > div > div.ant-collapse-content > div > div:nth-child(4) > div > div.ant-form-item-control-wrapper > div > div > div");
        tag_id = document.querySelector("#option_CLNT_ID_body > span:nth-child(1)");
        tag_cert = document.querySelector("#DATA_FORM > div > div:nth-child(1) > div > div.ant-collapse-content > div > div:nth-child(5) > div > div.ant-form-item-control-wrapper > div > div > div");
        taskNone = document.querySelector("#header");
    }
    else if (url.indexOf('/livebos/.c5/link?j=') > -1) {
        var titleElem = document.querySelector("#titleBarDiv > div.taskTitle > h1");
        var title = titleElem.innerText;
        if (title.indexOf('特殊品种交易权限申请') == -1 && title.indexOf('休眠账户激活') == -1) {
            console.log('不是待查询的页面');
            return;
        }

        tag_name = document.querySelector("#DATA_FORM > div > div:nth-child(1) > div > div.ant-collapse-content > div > div:nth-child(3) > div > div.ant-form-item-control-wrapper > div > div > div");
        tag_id = document.querySelector("#option_CLNT_ID_body > span:nth-child(1)");

        if (title.indexOf('特殊品种交易权限申请') > -1) {
            tag_cert = document.querySelector("#DATA_FORM > div > div:nth-child(1) > div > div.ant-collapse-content > div > div:nth-child(5) > div > div.ant-form-item-control-wrapper > div > div > div");
        } else {
            tag_cert = document.querySelector("#DATA_FORM > div > div:nth-child(2) > div > div.ant-collapse-content > div > div:nth-child(1) > div > div.ant-form-item-control-wrapper > div > div > div");
        }
        taskNone = getElementByXpath("//div[@class='taskTitle']/h1");
    }

    if (url.indexOf('://172.16.41.11/backstage/index.php?act=procedure&op=specialVarityApplyCheck') > -1) {
        tag_name = document.querySelector("#shidangxing > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4) > input[type=text]");
        tag_id = document.querySelector("#shidangxing > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]");;
        tag_cert = document.querySelector("#shidangxing > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4) > input[type=text]");
        taskNone = getElementByXpath("//h1[contains(text(), '安粮期货交易者适当性期货及期权编码或权限申请表')]");

        cust_name = tag_name.value;
        cust_cert = tag_cert.value;
        cust_id = tag_id.value;
    }
    else if (url.indexOf('172.16.41.11/backstage/index.php?act=procedure&op=specialVarityApplyDetail') > -1) {
        tag_name = document.querySelector("#form1 > table > tbody > tr:nth-child(6) > td.vatop.rowform > input");
        tag_id = document.querySelector("#form1 > table > tbody > tr:nth-child(2) > td.vatop.rowform > input");;
        tag_cert = document.querySelector("#form1 > table > tbody > tr:nth-child(8) > td.vatop.rowform > input");
        taskNone = document.querySelector("body > div.page > div.fixed-bar > div");
        alert(taskNone)

        cust_name = tag_name.value;
        cust_cert = tag_cert.value;
        cust_id = tag_id.value;
    }
    else {
        cust_name = tag_name.innerText;
        cust_cert = tag_cert.innerText;
        cust_id = tag_id.innerText;
    }

    taskNone.append(elem);

    if (tag_name == null || tag_id == null || tag_cert == null) {
        console.log("部分或全部信息为空");
        return;
    }

        // 获取cookie
    function getCookie(name) {
        // 拆分 cookie 字符串
        var cookieArr = (document.cookie || "").split(";");

        // 循环遍历数组元素
        for(var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");

            //* 删除 cookie 名称开头的空白并将其与给定字符串进行比较 *
            if(name == cookiePair[0].trim()) {
                // 解码cookie值并返回
                return decodeURIComponent(cookiePair[1]);
            }
        }
        // 如果未找到，则返回null
        return null;
    }

    function hasValue(values, theVal) {
        var valueArr = (values || "").split(",");

        for(var i = 0; i < valueArr.length; i++) {
            var  val = valueArr[i];

            //* 删除 cookie 名称开头的空白并将其与给定字符串进行比较 *
            if(theVal == val) {
                return true;
            }
        }

        return false;
    }

    function addCookie(name, value) {
        var cookieValue = document.cookie;
        //console.log(cookieValue);

        var curDate = new Date();
        //当前时间戳
        var curTamp = curDate.getTime();
        //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
        var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
        //当日已经过去的时间（毫秒）
        var passedTamp = curTamp - curWeeHours;
        //当日剩余时间
        var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
        var leftTime = new Date();
        leftTime.setTime(leftTamp + curTamp);

        // 获得原来的值
        var cookieOrgin = getCookie('Downloaded');
        //console.log(cookieOrgin);

        if (!hasValue(cookieOrgin, value)) {
            //创建cookie
            document.cookie = name + "=" + value + ',' + cookieOrgin + "; expires=" + leftTime.toGMTString();
            //console.log(document.cookie);
            //console.log(leftTime.toGMTString());
        }
    }

    function cookieHasValue(value) {
        var cookieOrgin = getCookie('Downloaded');
        return hasValue(cookieOrgin, value);
    }

    // 保存图片到本地浏览器默认位置
    function save_img(content, file_name) {
        var raw = window.atob(content);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        var blob = new Blob([uInt8Array], {type: "image/png"});
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = file_name;
        a.dispatchEvent(new MouseEvent('click'))
    }

    // 发送ws请求
    var ws = new WebSocket('wss://zx.alqh.cn:8080/ws');
    var ws_closed = false;
    var has_picture = false;

    function isOpen(ws) { return ws.readyState === ws.OPEN }

    // 连接成功时触发
    ws.onopen = function() {
        var msg = {type: 'request', name: cust_name, cert: cust_cert, id: cust_id};
        if (!isOpen(ws)) return;
        ws.send(JSON.stringify(msg));
        console.log('发送征信截图请求...');
        elem.innerHTML = '发送征信截图请求...';
    }

    // 接收到服务器响应时触发
    ws.onmessage = function(evt) {
        // 分析接收到数据(json格式)
        var data = evt.data;
        var res = JSON.parse(data);
        //console.log(res);

        // 1、出现了错误
        if (res.result == "error") {
            alert('服务端提示: ' + res.msg);
            elem.innerHTML = '';
            ws.close();
            return;
        }
        // 2、完成了图片的下载
        else if (res.result == "end") {
            //alert('客户 ' + res.name + ' 的图片已完成下载')
            if (!has_picture) {
                alert('客户 ' + res.name + ' 的图片已完成下载');
            }
            //elem.innerHTML = '';
            ws.close();
            return;
        }
        // 3、征信图片正在下载中
        else if (res.result == "downloading") {
            console.log("服务端征信图片正在下载...");
            elem.innerHTML = '服务端征信图片正在下载...';
            // 间隔一定时间，再次发送查询请求
            var tid = setTimeout(() => {
                if (ws_closed) {
                    clearTimeout(tid);
                    return;
                } else {
                    var msg = {type: 'query', name: cust_name, cert: cust_cert, id: cust_id};
                    if (!isOpen(ws)) return;
                    ws.send(JSON.stringify(msg));
                    console.log("查询服务器状态...");
                    elem.innerHTML = '查询服务器状态...';
                    clearTimeout(tid);
                }
            }, 10000);
        }
        // 4、征信图片已下载, 发送下载请求
        else if (res.result == "downloaded") {
            console.log("服务端图片已存在")
            elem.innerHTML = '服务端图片已存在';
            var msg = {type: 'download', name: cust_name, cert: cust_cert, id: cust_id};
            if (!isOpen(ws)) return;
            ws.send(JSON.stringify(msg));
        }
        // 5、下载征信图片内容
        else if (res.result == "content") {
            // 如果已经下载，则不下载
            if (!cookieHasValue(cust_id)) {
                // 将所有图片保存
                for (var i = 0; i < res.png.length; ++i) {
                    //var filename = cust_id + '-' + cust_name + '-' + cust_cert + '-' + res.png[i].file_index;
                    var filename = cust_id + '-' + cust_name + '-' + res.png[i].file_index;
                    // console.log('文件名: ' + filename);
                    elem.innerHTML = '文件名: ' + filename;
                    save_img(res.png[i].content, filename);
                }

                elem.innerHTML = '图片已下载完毕';
                addCookie('Downloaded', cust_id);
            }
            else {
                elem.innerHTML = '本地已有图片';
                has_picture = true;
            }

            // 通知本次ws结束
            var msg = {type: 'end', id: cust_id, name: cust_name};
            if (!isOpen(ws)) return;
            ws.send(JSON.stringify(msg));
        }
    }

    // 断开时触发
    ws.onclose = function(e) {
        //elem.innerHTML = '';
        ws_closed = true;
        // console.log('ws关闭:' + + e.code + ' ' + e.reason + ' ' + e.wasClean);
        // console.log(e);
    }
})();