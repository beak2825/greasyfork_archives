// ==UserScript==
// @name         B站自动签到
// @namespace    B站自动签到,Bilibili自动签到
// @version      0.6
// @description  B站自动签到工具
// @author       You
// @include      https://www.bilibili.com/*
// @include      https://t.bilibili.com/*
// @include      https://live.bilibili.com/*
// @include      https://www.bilibili.com/video/*
// @icon         https://s4.ax1x.com/2021/12/31/TfQpnS.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437809/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/437809/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    let cookie = document.cookie.split(';')//获取cookie
    let time = localStorage.getItem("signInTime")//获取上次签到时间

    function qd() {//签到方法
        fetch("https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign", {
            method: "GET",//GEt请求
            mode: 'cors',//跨域
            credentials: 'include',//允许携带cookie
            headers: {
                'cookie': cookie,//设置cookie
            }
        }).then(data => data.json())
            .then(response => {
                localStorage.setItem("signInTime", new Date().toDateString())//设置签到的时间戳
                show("签到完成")//显示提示
            })
            .catch(err => {
                show("发生错误",false)
                console.log(err)
            })
    }
    function show(showtext,bool=true) {//签到提示
        let showidv = document.createElement("div")//创建标签
        let icon = bool ? "🎉 " : "🚫 "
        showidv.innerText = icon + showtext
        showidv.style = "background-image: linear-gradient(45deg, rgb(255 186 251), rgb(41 201 255));color:#fff;font-size:20px;position: fixed;top:-104px;right:23px;width: 150px;height:100px;z-index:99999;border-radius: 20px;text-align: center;line-height: 100px;transition:all 0.2s linear;"//设置样式
        document.body.append(showidv)//添加提示到页面上
        setTimeout(() => {
            showidv.style.top = "55px"
        }, 100)
        setTimeout(() => {
            showidv.style.top = "-104px"
        }, 2000)
        setTimeout(() => {
            document.body.removeChild(showidv)
        }, 3000)
    }
    function sameday(t) {//是否同一天
        return t === new Date().toDateString();
    }
    console.log(time)
    if (time) {//如果有时间则判断时间戳是否是当天的时间
        if (!sameday(time)) {//不是同一天就签到
            console.log("今天没有签到过,正在签到")
            qd()//请求签到
        }else{
            console.log("已经签到过");
        }
    } else {//没有时间则没有签到,进行签到,签到完成缓存设置时间戳
        console.log("第一次使用此插件签到,正在签到")
        qd()//请求签到
    }
})();