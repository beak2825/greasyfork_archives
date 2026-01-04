// ==UserScript==
// @name         斗鱼弹幕机器人-hqf
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这是一个简单的斗鱼弹幕机器人
// @author       hqf
// @match        https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402985/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E6%9C%BA%E5%99%A8%E4%BA%BA-hqf.user.js
// @updateURL https://update.greasyfork.org/scripts/402985/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E6%9C%BA%E5%99%A8%E4%BA%BA-hqf.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**
      全局变量
    */
    var ZhiziData = {myIntervalVal:""};

      /**
     * 创建我的自定义功能区域
     */
    function createMyArea() {
        //创建一个div的区域
        var div = document.createElement("div");
        div.setAttribute("id", "myArea");
        var textNode = document.createTextNode("刷屏内容:");
        div.appendChild(textNode);
        document.getElementById("js-player-asideMain").appendChild(div);

        //加入id属性，便于操作，调试css
        var divStyle = document.getElementById("myArea").style;
        divStyle.setProperty("width", "100%");
        divStyle.setProperty("height", "66px");
        divStyle.setProperty("background", "rgba(0,0,0,0.4)");
        divStyle.setProperty("position", "absolute");
        divStyle.setProperty("z-index", "9");
        divStyle.setProperty("top", "635px");
        divStyle.setProperty("color", "blue");
        document.getElementById("myArea").innerHTML = editHtml();
    }

    /**
     * 编写html
     * @returns {string}
     */
    function editHtml() {
        var html =
            '   <span>弹幕的内容:</span>' +
            '   <input id="changeContent" placeholder="请输入需要改变的弹幕内容" style="width: 170px;" />'+

            '   <br><span>弹幕间隔/s:</span>' +
            '   <input id="chatInterval" placeholder="请输入需要弹幕间隔时长/s" type="number" value="5" style="width: 170px;" />' +

            '&nbsp;&nbsp;<button type="button" id="closeOrOpenAutoChatButton" style="background-color: #f70;">开启弹幕自动发送</button>    ';
        return html;
    }

     /**
     * 我自己的定时器
     * @param charContent 弹幕内容
     * @param chatInterval 弹幕间隔
     */
    function myInterval(changeContentVal, chatIntervalVal){
        if (changeContentVal == "") {
            changeContentVal = "我是机器人，专刷666";
        }
        if (chatInterval == "") {
            chatInterval = 5;
        }

        ZhiziData.myIntervalVal = setInterval(function () {
             document.getElementsByClassName("ChatSend")[0].children[0].value = changeContentVal;
            document.getElementsByClassName("ChatSend-button")[0].click()
        },chatIntervalVal * 1000)
    }

  /**
     * 为开启和关闭按钮，做监听事件
     */
    function addloseOrOpenAutoChatButtonListener() {
        //为开启，关闭按钮加入监听事件
        document.getElementById('closeOrOpenAutoChatButton').addEventListener('click', function (ev) {
            var closeOrOpenAutoChatButtonDom = document.getElementById("closeOrOpenAutoChatButton");
            if ("开启弹幕自动发送" == closeOrOpenAutoChatButtonDom.textContent) {
                //开启弹幕发送
                var changeContentVal = document.getElementById("changeContent").value;
                var chatIntervalVal = document.getElementById("chatInterval").value;
                //将input获取的值，传入定时器内，以改变定时器的内容和定时时长
                myInterval(changeContentVal, chatIntervalVal);
                closeOrOpenAutoChatButtonDom.textContent = "关闭弹幕自动发送";
                closeOrOpenAutoChatButtonDom.style.setProperty("background", "blue");
            } else {
                //清除定时器全局定时器
                window.clearInterval(ZhiziData.myIntervalVal);
                closeOrOpenAutoChatButtonDom.textContent = "开启弹幕自动发送";
                closeOrOpenAutoChatButtonDom.style.setProperty("background", "#f70");
            }
        }, false);
    }




    function initMain() {
        console.log("初始化函数initMain成功");
        //创建我的自定义功能区域
        createMyArea();
        //加入监听函数
        addloseOrOpenAutoChatButtonListener()
    }

    //调用初始化函数，掉用
    var initSetInterval = setInterval(function () {
        if (document.getElementById("myArea") == null){
            initMain();
        }else {
            console.log("初始化函数成功！")
            window.clearInterval(initSetInterval);
        }
    }, 5 * 1000);


})();