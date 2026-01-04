// ==UserScript==
// @name         熊猫TV自动领取竹子
// @namespace    https://greasyfork.org/zh-CN/scripts/369898
// @version      1.7.2
// @description  自动领取熊猫TV在线竹子奖励
// @author       Onsxsen
// @match        https://www.panda.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369898/%E7%86%8A%E7%8C%ABTV%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E7%AB%B9%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/369898/%E7%86%8A%E7%8C%ABTV%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E7%AB%B9%E5%AD%90.meta.js
// ==/UserScript==
//仅支持领取竹子不需要验证码的用户
//增加浏览器通知功能(暂未具体测试是否有BUG,因为我更新完之后我的账号已经领完了[doge])
(function() {
    'use strict';
    //声明通知函数
    var Noti ,bamboo;
    //Noti = false;
    function showMsg (id){
        if (Noti === undefined){
            window.clearInterval(Time1);
            console.log("清除定时器");
            return
        }
        Noti = false;
        if(id === '4') {
            showMsgNotification("当日竹子领取完毕","本次领取 " + (getbamboo() - bamboo) + " 竹子,当前竹子为 " + getbamboo());
            window.clearInterval(Time1);
            console.log("清除定时器");
        } else{
            showMsgNotification("自动领取竹子成功","本次领取 " + (getbamboo() - bamboo) + " 竹子,当前竹子为 " + getbamboo());
        }
    }
    //声明检测函数
    window.GetText = function (){
        var p = $('p.room-task-timer');
        if(p){
            //检测当前标题
            if(p.text() === '可领取'){
                Click();
                Noti = true;
            } else if (p.text() === '已领完'){
                showMsg('4');
            } else {
                if(Noti === true){
                    showMsg('0');
                }
            }
        }
    }
    //构造获取当前竹子数量函数
    function getbamboo(){
        var span = $('span.sidebar-userinfo-bamboo-num');
        if(span){
            return span.text();
        }
        return 0;
    }
    //声明领取程序
    function Click () {
        //获取领取的元素
        var li = $('li.room-task-item-2');
        if(li){
            //点击第一个元素
            bamboo = getbamboo();
            li[0].click();
        }
    }
    //构造通知函数
    function showMsgNotification(title, msg) {
        var Notification = window.Notification || window.mozNotification || window.webkitNotification;

        if(Notification) {//支持桌面通知
            if(Notification.permission === "granted") {//已经允许通知
                var instance = new Notification(title, {
                    body: msg,
                    icon: "https://i.h2.pdim.gs/3459966f6e12c3f61e596278e5af4b54.png",
                });

                instance.onclick = function() {
                    instance.close();
                };
                instance.onerror = function() {
                };
                instance.onshow = function() {
                    window.setTimeout(instance.close.bind(instance), 5000);
                };
                instance.onclose = function() {
                };
            }else {//第一次询问或已经禁止通知(如果用户之前已经禁止显示通知，那么浏览器不会再次询问用户的意见，Notification.requestPermission()方法无效)
                Notification.requestPermission(function(status) {
                    if (status === "granted") {//用户允许
                        var instance = new Notification(title, {
                            body: msg,
                            icon: "https://i.h2.pdim.gs/3459966f6e12c3f61e596278e5af4b54.png"
                        });

                        instance.onclick = function() {
                            // Something to do
                        };
                        instance.onerror = function() {
                            // Something to do
                        };
                        instance.onshow = function() {
                            // Something to do
                            window.setTimeout(instance.close.bind(instance), 5000);
                        };
                        instance.onclose = function() {
                            // Something to do
                        };
                    }else {//用户禁止
                        return false
                    }
                });
            }
        }

    }
    //设置一个定时器,一秒执行一次
    var Time1 =  window.setInterval('GetText()',1000);//每隔6000毫秒执行一次testFunction()函数，执行无数次。
})();