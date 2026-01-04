// ==UserScript==
// @name         作业帮打包机
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  打包机选择app
// @author       HolmesZhao
// @match        *://zmtc.zuoyebang.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452092/%E4%BD%9C%E4%B8%9A%E5%B8%AE%E6%89%93%E5%8C%85%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/452092/%E4%BD%9C%E4%B8%9A%E5%B8%AE%E6%89%93%E5%8C%85%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const zmtcAppType = "zmtcAppType"
    function addMenu() {
        const menus = document.getElementsByClassName('layout-nav-menu')[0]
        const cloneMenu = menus.children[0].cloneNode()
        cloneMenu.innerHTML = `
        <select id="appType">
            <option value="none">选择喵宝APP</option>
            <option value="ios-miaomiaoji">iOS 喵喵机</option>
            <option value="android-miaomiaoji">Android 喵喵机</option>
            <option value="ios-study">iOS 喵喵错题</option>
            <option value="android-study">Android 喵喵错题</option>
            <option value="ios-paperang">iOS 喵喵机国际</option>
            <option value="android-paperang">Android 喵喵机国际</option>
            <option value="ios-iot">iOS 作业帮智能</option>
            <option value="android-iot">Android 作业帮智能</option>
            <option value="android-mbdriver">Android 产测工具</option>
            <option value="embed-mb_q1">Q1 固件</option>
            <option value="embed-E3">E3 固件</option>
            <option value="embed-penlite">笔Lite 固件</option>
            <option value="embed-f2s_wifi">F2S_WiFi 固件</option>
            <option value="embed-N1">N1 固件</option>
        </select>
        `
        menus.appendChild(cloneMenu)

        const appType = document.getElementById('appType')
        appType.onchange = appTypeChanged

        const cloneMenu2 = menus.children[0].cloneNode()
        cloneMenu2.innerHTML = `
        <select id="userType">
            <option value="none">通用选择</option>
            <option value="ios">我是 iOS</option>
            <option value="android">我是 Android</option>
            <option value="embed">我是固件</option>
        </select>
        `
        menus.appendChild(cloneMenu2)

        const userType = document.getElementById('userType')
        userType.onchange = userTypeChanged

        changeSelectName()
    }

    function changeSelectName() {
        const appType = document.getElementById('appType')
        const options = appType.options
        const currentType = getQueryVariable('nav_item')
        let values = []
        for (let index = 0; index < options.length; index++) {
            const element = options[index].value;
            values.push(element)
        }
        if (values.indexOf(currentType) != -1) {
            appType.value = currentType
        } else {
            appType.value = "none"
        }
    }

    function appTypeChanged(e) {
        const value = this.options[this.options.selectedIndex].value
        console.log(value)
        const hostname = window.location.hostname
        const pathname = window.location.pathname
        window.location.href = "http://" + hostname + pathname + "?nav_item=" + value
    }

    function userTypeChanged(e) {
        const value = this.options[this.options.selectedIndex].value
        console.log(value)
        const appType = document.getElementById('appType')
        const options = appType.querySelectorAll('option')
        for (let index = 0; index < options.length; index++) {
            const option = options[index]
            option.style.display = ""
            if (value == "none") continue
            if (option.value.indexOf(value) === -1) {
                option.style.display = "none"
            }
        }
    }

    function getQueryVariable(variable) {
        let len = window.location.href.indexOf('?')
        if (len <= 0) { return false; }
        var query = window.location.href.substring(len + 1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }


    class Dep {// 订阅池
        constructor(name){
            this.id = new Date() //这里简单的运用时间戳做订阅池的ID
            this.subs = []//该事件下被订阅对象的集合
        }
        defined(){// 添加订阅者
            Dep.watch.add(this);
        }
        notify() {//通知订阅者有变化
            this.subs.forEach((e, i) => {
                if(typeof e.update === 'function'){
                    try {
                       e.update.apply(e)//触发订阅者更新函数
                    } catch(err){
                        console.warr(err)
                    }
                }
            })
        }
    }
    Dep.watch = null;

    class Watch {
        constructor(name, fn){
            this.name = name;//订阅消息的名称
            this.id = new Date();//这里简单的运用时间戳做订阅者的ID
            this.callBack = fn;//订阅消息发送改变时->订阅者执行的回调函数
        }
        add(dep) {//将订阅者放入dep订阅池
           dep.subs.push(this);
        }
        update() {//将订阅者更新方法
            var cb = this.callBack; //赋值为了不改变函数内调用的this
            cb(this.name);
        }
    }

    var addHistoryMethod = (function(){
        var historyDep = new Dep();
        return function(name) {
            if(name === 'historychange'){
                return function(name, fn){
                    var event = new Watch(name, fn)
                    Dep.watch = event;
                    historyDep.defined();
                    Dep.watch = null;//置空供下一个订阅者使用
                }
            } else if(name === 'pushState' || name === 'replaceState') {
                var method = history[name];
                return function(){
                    method.apply(history, arguments);
                    historyDep.notify();
                }
            }
        }
    }())

    window.addHistoryListener = addHistoryMethod('historychange');
    history.pushState = addHistoryMethod('pushState');
    history.replaceState = addHistoryMethod('replaceState');


    window.addHistoryListener('history',function(){
        console.log('窗口的history改变了');
        changeSelectName()
    })

    window.onload = e => {
        setTimeout(e => {
            addMenu()
        }, 1000)
    }

})();