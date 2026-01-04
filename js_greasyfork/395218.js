// ==UserScript==
// @name         CSDN论坛灌水乐园自动回复
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  打开灌水乐园的帖子就开始自动回复
// @author       大西瓜一块五一斤
// @match        https://bbs.csdn.net/topics/*
// @downloadURL https://update.greasyfork.org/scripts/395218/CSDN%E8%AE%BA%E5%9D%9B%E7%81%8C%E6%B0%B4%E4%B9%90%E5%9B%AD%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395218/CSDN%E8%AE%BA%E5%9D%9B%E7%81%8C%E6%B0%B4%E4%B9%90%E5%9B%AD%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //要发送的内容
    var content = "[face]monkey:5.gif[/face]";

    var username = "";
    var url = window.location.href.match(/https:\/\/[^1-9]*\d+/)[0];
    var pageSize = 10;
    var isanswer = false;

    function getContent(url, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest();
        } else {
            // IE6, IE5 浏览器执行代码
            //xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (callback) {
                    callback(xmlhttp.responseText);
                }
            }
        }
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
    }

    function getAnswer(response) {
        if (response.indexOf('data-username="' + username + '" data-nickname') > -1) {
            isanswer = true;
            console.log("username111");
        } else {
            isanswer = false;
            console.log("username222");
        }
    }

    function getUsername(response) {
        username = response.match(/(?<=username:')[^']*(?=')/)[0];
        console.log(username);
    }

    function isAnswer() {
        var wrap = document.getElementsByClassName("bbs_bread_wrap");
        if (wrap[0].children[3].innerText != "灌水乐园") {
            console.log("不是灌水乐园不回复");
            return true;
        } else {
            console.log("灌水乐园可以回复");
        }

        var reply_num = document.getElementsByClassName("cur_page")[0];
        console.log(reply_num);
        if (reply_num||reply_num==undefined) {
            var total=1;
            if(reply_num!=undefined){
                total = parseInt(reply_num.innerText);
            }
            var totalPage = (total + pageSize - 1) / pageSize;
            for (var i = 1; i <= totalPage; i++) {
                getContent(url + "?page=" + i, getAnswer);
                if (isanswer) {
                    console.log("已回复111");
                    return true;
                } else {
                    console.log("未回复222");
                }
            }
        }
        else {
            console.log("不是第一页直接返回已回复");
            return true;
        }
        return false;
    }

    getContent("https://bbs.csdn.net/", getUsername);

    if (!isAnswer()) {
        console.log("正在回复");
        document.getElementsByClassName("csdn_bbs_warp")[0].children[1].click();
        document.getElementById("post_body").value = content;
        document.getElementById("submit_new_post_form").click();
    }
})();