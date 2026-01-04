// ==UserScript==
// @name         企业微信阅读小助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       other_pp
// @match        https://lexiangla.com/teams/*
// @match        http://127.0.0.1:8848/*
// @grant        GM_xmlhttpRequest
// @connect      vip.mms.insistzyw.top
// @connect      *
// @grant        GM_download
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/407444/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E9%98%85%E8%AF%BB%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407444/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E9%98%85%E8%AF%BB%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//速度默认7秒
(function () {
    'use strict';
    let gloab = {
        username: '',
        time: 0,
        status: '未开始做题',
        key: '',
        servicestatus: '未运行',
        speed: 7,
        index: 1,
        event_interval: null,
        url: "http://47.102.113.125:29987"
    }
    //获取题目
    function getQuestion(index) {
        let title = $('div.title:eq(' + index + ')').text();
        if(!title)
            return '';
        return title.match(/[^0-9.。]+/)[0];
    }
    //获取对应题目的选项列表
    function getQuestionOption(index) {
        let answer = $('div.title:eq(' + index + ') + ul').text();
        return answer.match(/[^\sa-zA-Z.]+/ig)
    }
    //根据题目和答案选中答案 题目的下标从1开始 选项的下标从0开始
    function checkedAnswer(qindex, oindex) {
        $('div.title:eq(' + qindex + ') + ul input:eq(' + oindex + ')').click();
    }

    //插入用户面板
    function questionGui() {
        let css = "position:fixed;left:0px;top:300px;background-color:#AEDD81;box-shadow: 4px 4px 8px #888888;z-index:9999;width:222px;height:200px";
        let html_text = "";
        html_text += "<div style=\"font-size: 15px;color: white;font-weight: bold;text-align: center;\">企业微信阅读小助手</div>";
        html_text += "<div id=\"myform\" style=\"margin: 2px 2px;\"></div>";
        html_text += "<label>用户名:</label>";
        html_text += "<input type=\"text\" id=\"qq_username\" name=\"username\" style=\"width:150px;color: dimgray;\">";
        html_text += "<label>密&nbsp;&nbsp;&nbsp;钥:</label>";
        html_text += "<input type=\"text\" id=\"qq_key\" name=\"key\" style=\"width:150px\">";
        html_text += "<label>服务器状态:<span id=\"SevStatus\" style=\"color: red;\">未连接</span></label>";
        html_text += "<div>剩余使用数量:<span id=\"use_time\">0</span></div>"
        html_text += "<div>匹配进度:<span id=\"qq_ffs\">0</span></div>";
        html_text += "<div>";
        html_text += "<label>当前状态:";
        html_text += "<button id=\"qq_status\">开始做题</button>";
        html_text += "</label>";
        html_text += "<div>提示:<span id=\"qq_title\" style=\"color:red;\">无</span></div>";
        html_text += "<div style=\"color: dodgerblue;\">点击进行注册</div>";
        html_text += "</div>";
        html_text += "</div>";
        let html = "<div style=\"" + css + "\">" + html_text + "</div>";
        html_text += "</div>";
        $('body').append(html);
    }
    //开始做题
    function start() {
        //尝试获取题目
        let question = getQuestion(1);
        //判断是否在答题界面
        if (question == '') {
            $("#qq_title").text("当前不在答题界面!");
            return;
        }
        $("#qq_status").text("暂停做题");
        //开始答题
        getServiceInForMation();
        //判断剩余次数
        setTimeout(function (){
            let use_time = Number($('#use_time').text())
        if(use_time>0){
            gloab.event_interval = setInterval(toServerGetAnswer, gloab.speed * 1000);
        }
        }, 400);

    }
    //向服务器端请求
    function toServerGetAnswer() {
        let qes = getQuestion(gloab.index);
        let index = gloab.index;
        let an = '';
        let qq_username = $('#qq_username').val();
        let key = $('#qq_key').val();
        console.log(qq_username, key);
        GM_xmlhttpRequest({
            method: "get",
            url: gloab.url + "/vsp-hpp/getAnswer?username=" + qq_username + "&key=" + key + "&question=" + qes,
            onload: function (res) {
                $("#SevStatus").text("在线中");
                var obj = JSON.parse(res.response);
                //成功获取答案，开始选择答案
                if (obj.code == 200) {
                    $('#qq_title').text(obj.msg);
                    an = obj.data;
                    if (!an) {
                        $('#qq_title').text("这题没有答案噢!");
                        return;
                    }
                    let list = getQuestionOption(index);
                    for (var i = 0; i < list.length; i++) {
                        if (an.indexOf(list[i]) != -1) {
                            checkedAnswer(index, i);
                        }
                    }
                } else {
                    $('#qq_title').text(obj.msg);
                }
            }
        });
        //每隔20次重新获取状态
        if (gloab.index % 20 == 0) {
            getServiceInForMation();
        }
        if (index == 100) {
            clearInterval(gloab.event_interval);
            $("qq_ffs").text("已经暂停");
        }
        gloab.index = gloab.index + 1;
        $("#qq_ffs").text(index);
        return 1;
    }
    //停止做题
    function stop() {
        $("#qq_status").text("开始做题");
        clearInterval(gloab.event_interval);
    }
    //插入成功后开始绑定事件
    function bindUserTap() {
        $("#qq_status").bind("click", function () {
            console.log($("#qq_status").text());
            if ($("#qq_status").text() == "开始做题") {
                start();
            } else {
                stop();
            }
        })
        $("#qq_username").bind("input propertychange", function () {
            gloab.username = $("#qq_username").val();
        })
    }

    //做题前初始化
    function init() {
        questionGui();
        bindUserTap();
    }

    init();

    //当前服务器状态和个人用户信息
    function getServiceInForMation() {
        let qq_username = $('#qq_username').val();
        let key = $('#qq_key').val();
        GM_xmlhttpRequest({
            method: "get",
            url: gloab.url + "/vsp-hpp/getServerstatus?username=" + qq_username + "&key=" + key,
            onload: function (obj) {
                var res = JSON.parse(obj.response);
                if (!res.code) {
                    $("SevStatus").text("断开连接");
                    $("#qq_title").text("脚本暂时不可用");
                }
                if (res.code == 200) {
                    if(!res.data){
                        $("#use_time").text(0);
                    }else{
                        $("#use_time").text(res.data.use_time);
                    }

                    $("#SevStatus").text("已连接");
                    $("#qq_title").text("连接状态正常");
                } else {
                    $("#use_time").text(0);
                    $("#SevStatus").text("已连接");
                    $("#qq_title").text("请先注册");
                }
            }
        });
    }
})();