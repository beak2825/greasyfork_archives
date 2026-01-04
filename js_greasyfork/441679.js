// ==UserScript==
// @name         丹阳中北学院自动登录网络
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  摆脱NNU-ZB时常健忘的毛病，帮助您自动设置账号密码运营商，自动登录网页，然后关闭网页
// @author       @大千小熊（B站同名的家伙） 信息系信息管理专业20级
// @match        http://172.31.254.2/a79.htm
// @match        *://172.31.254.2/a79.htm/*
// @match        *://172.31.254.2/a79.htm
// @match        *://172.31.254.2/a79.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=254.2
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441679/%E4%B8%B9%E9%98%B3%E4%B8%AD%E5%8C%97%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%BD%91%E7%BB%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/441679/%E4%B8%B9%E9%98%B3%E4%B8%AD%E5%8C%97%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%BD%91%E7%BB%9C.meta.js
// ==/UserScript==
//脚本使用方法 修改UserName和UserPassword即可。
//ServiceProvider 是您的
(function () {
    let _UserName = ""
    let _UserPassword = ""
    let _ServiceProvider = 1 //0校园网 1中国移动 2中国电信

    //--程序私有变量表--
    __AlreadyAddStopPanel = false//视口中是否已经添加了取消自动登录的按钮
    __AllowAutoSendMessage = false//用户设置是否自动登录网站
    __AllowAutoClose = false//用户设置是否支持自动关闭网页
    __AlreadyCloseRightPanel__ = false//用户是否已经关闭了右下角的面板
    __MainColor__ = "#ffdc9ce0" //设置面板的主题色
    ___TimeOut = 5//设置自动关闭页面的计时器,当设置为0可以秒关网页
    ___StartTimeOut = false//是否开始倒计时
    'use strict';
    // Your code here...


    setInterval(function () {//不断调用的函数
        Update()
    }, 1000);

    window.onload = function () { //当页面加载完成的时候，开始执行本段函数。
        InitPanel()
        if (ReadUserInfo() == "HaveUserInf") {
        } else {
            alert("o(TヘTo)<br>这似乎是您第一次使用<br>在左下角设置一下您的信息，并且记得保存哦~")
        }
        Main()
    }

    function ReadUserInfo() {//刷新用户信息
        let storage = window.localStorage
        if (storage.getItem("Account") == null) {
            return "NoUserInf"
        } else {
            _UserName = storage.getItem("Account")
            _UserPassword = storage.getItem("Password")
            _ServiceProvider = storage.getItem("ServiceProvider")
            __AllowAutoSendMessage = (storage.getItem("AllowAutoSignIn") == "true" ? true : false)
            __AllowAutoClose = (storage.getItem("AllowAutoClose") == "true" ? true : false)
        }
        FreshPaneInf()//读取完刷新信息
        //首先检测有无在本地保存过用户的信息，如果没有就弹出消息提示框让用户设置一下
        return "HaveUserInf"
    }
    function InitPanel() {//向页面添加一个提示的Panel
        //修改自选服务按钮z-index和position
        var btn_Zixuan = document.getElementsByName("authentication")[0]
        btn_Zixuan.style.zIndex = "0";
        // btn_Zixuan.style.top = "10px"
        //#region 欢迎Panel
        //添加了一个欢迎提示文字Panel
        var body = document.getElementById("edit_body")
        var para = document.createElement("div")
        var node = document.createTextNode("丹阳中北学院自动登录脚本正在运行中~")
        var br = document.createElement("br")
        para.appendChild(node)
        para.appendChild(br)
        para.appendChild(document.createTextNode("欢迎关注作者B站：@大千小熊 ヽ(゜▽゜　)－"))
        para.style.position = "absolute"
        para.style.top = "3%"
        para.style.left = "40%"
        para.style.padding = "10px"
        para.style.backgroundColor = __MainColor__;
        para.style.borderRadius = "10px"
        para.style.boxSizing = "context-box"
        para.id = "panelWelcome"
        //合并入body
        body.appendChild(para)
        var div = document.createElement("div")
        div.style.fontSize = "100px"
        div.style.position = "absolute"
        div.style.width = "100px"
        div.style.height = "100px"
        div.style.top = "0%"
        div.style.left = "70%"
        div.style.textAlign = "center"
        div.style.display = "flex"
        div.style.justifyContent = "center"
        div.style.alignItems = "center"
        // div.style.webkitTransform = "rotate(360deg)"
        // div.style.webkitAnimation = "rotation 3s linear infinite"
        div.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 6000,
            iterations: Infinity
        })
        div.appendChild(document.createTextNode("❀"))
        div.id = "panelRoate"
        body.appendChild(div)
        //#endregion
        //一个基础的面板
        var div_Normal = document.createElement("div")
        div_Normal.style.margin = "10px"
        div_Normal.style.textAlign = "center"
        //#region 添加一个设置Panel_软件信息展示
        if (__AlreadyCloseRightPanel__ == false) {
            var panelInf = document.createElement("div")
            //向面板添加一个关闭的按钮
            panelInf.id = "panelInf"//设置面板的id
            var div_Close = document.createElement("div")
            div_Close.style.position = "relative"
            div_Close.style.right = "-260px"
            var btn_Close = document.createElement("button")

            btn_Close.addEventListener("click", CloseRightPanel)

            btn_Close.appendChild(document.createTextNode("关闭"))
            div_Close.appendChild(btn_Close)
            panelInf.appendChild(div_Close)

            //#region panelInf_Style
            panelInf.style.display = "flex"
            panelInf.style.backgroundColor = __MainColor__
            panelInf.style.position = "fixed"
            panelInf.style.borderRadius = "10px"
            panelInf.style.bottom = "20px"
            panelInf.style.right = "20px"
            panelInf.style.flexDirection = "colum"
            panelInf.style.width = "300px"
            panelInf.style.flexDirection = "column"
            panelInf.style.zIndex = 400
            //panelInf.style.pointerEvents = "none"
            //#endregion
            div_Normal.style.fontSize = "20px"
            div_Normal.appendChild(document.createTextNode("❤技术支持和脚本原理❤"))
            panelInf.appendChild(div_Normal)

            //div add
            div = document.createElement("div")
            div.style.margin = "10px"
            div.style.fontSize = "15px"
            div.appendChild(document.createTextNode("*如果您是第一次使用脚本，您可以在左下角设置保存您的信息。\n*您可以在下方的链接中获取教程和技术支持。\n*祝您使用愉快~"))
            panelInf.appendChild(div)

            //div add
            div = document.createElement("div")
            div.style.margin = "2px"
            div.style.textAlign = "center"

            var a = document.createElement('a')
            a.href = "https://space.bilibili.com/24782963"
            a.appendChild(document.createTextNode("作者B站"))
            div.appendChild(a)
            panelInf.appendChild(div)

            a = document.createElement('a')
            a.href = "https://blog.csdn.net/qq_34013247"
            a.appendChild(document.createTextNode("技术解析博客"))
            a.style.marginLeft = "10px"
            a.style.marginRight = "10px"
            div.appendChild(a)
            panelInf.appendChild(div)

            a = document.createElement('a')
            a.href = "https://www.bilibili.com/read/cv15706867"
            a.appendChild(document.createTextNode("使用教程"))
            div.appendChild(a)
            panelInf.appendChild(div)

            //div add
            div = document.createElement("div")
            div.style.fontSize = "10px"
            div.style.textAlign = "center"
            div.appendChild(document.createTextNode("欢迎QQ扩列：2966766627 （OvO）"))
            panelInf.appendChild(div)

            //合并入body
            body.appendChild(panelInf)
        }
        //#endregion

        //#region 添加一个设置面板
        //div add
        var panelSet = document.createElement("div")
        panelSet.style.display = "flex"
        panelSet.style.backgroundColor = __MainColor__
        panelSet.style.position = "fixed"
        panelSet.style.borderRadius = "10px"
        panelSet.style.bottom = "20px"
        panelSet.style.left = "20px"
        panelSet.style.flexDirection = "column"
        var divTitle = document.createElement("div")
        divTitle.style.margin = "10px"
        divTitle.style.textAlign = "center"
        divTitle.style.fontSize = "30px"
        divTitle.appendChild(document.createTextNode("❤脚本设置小助手❤"))
        panelSet.appendChild(divTitle)
        //添加Account面板
        var divSetAccount = document.createElement("div")
        divSetAccount.style.margin = "10px"
        var p = document.createElement("p")
        p.style.float = "left"
        p.style.fontSize = "20px"
        p.appendChild(document.createTextNode("账户"))
        divSetAccount.appendChild(p)
        input = document.createElement("input")
        input.style.float = "right"
        input.style.fontSize = "20px"
        input.style.margin = "0px 10px 0px 10px"
        input.placeholder = "请输入您NNU-ZB网络账户"
        input.id = "InputAccount"
        divSetAccount.appendChild(input)
        panelSet.appendChild(divSetAccount)
        //添加Password面板
        var divSetPass = document.createElement("div")
        divSetPass.style.margin = "10px"
        p = document.createElement("p")
        p.style.float = "left"
        p.style.fontSize = "20px"
        p.appendChild(document.createTextNode("密码"))
        divSetPass.appendChild(p)
        input = document.createElement("input")
        input.style.float = "right"
        input.style.fontSize = "20px"
        input.style.margin = "0px 10px 0px 10px"
        input.placeholder = "请输入您的账户密码"
        input.id = "InputPassword"
        divSetPass.appendChild(input)
        panelSet.appendChild(divSetPass)
        //添加运营商选择区域
        var divSetSer = document.createElement("div")
        divSetSer.style.margin = "10px"
        p = document.createElement("p")
        p.style.float = "left"
        p.style.fontSize = "20px"
        p.appendChild(document.createTextNode("运营商"))
        divSetSer.appendChild(p)
        var select = document.createElement("select")
        select.style.float = "right"
        select.style.fontSize = "20px"
        select.style.margin = "0px 10px 0px 10px"
        select.add(new Option("校园网", 0))
        select.add(new Option("中国移动", 1, true, true))
        select.add(new Option("中国电信", 2))
        select.id = "InputSerSelect"
        divSetSer.appendChild(select)
        panelSet.appendChild(divSetSer)
        //CheckBox
        var divCB = document.createElement("div")
        divCB.style.margin = "10px"
        divCB.style.display = "flex"
        divCB.style.justifyContent = "center"
        inputbox = document.createElement("input")
        inputbox.type = "checkbox"
        inputbox.id = "InputcbAutoSubmit"
        divCB.appendChild(inputbox)
        divCB.appendChild(document.createTextNode("自动登录"))

        inputbox = document.createElement("input")
        inputbox.type = "checkbox"
        inputbox.id = "InputcbAutoClose"
        divCB.appendChild(inputbox)
        divCB.appendChild(document.createTextNode("登录完自动关闭网页"))
        panelSet.appendChild(divCB)
        //添加按钮
        divbtn = document.createElement("div")
        divbtn.style.margin = "10px"
        divbtn.style.display = "flex"
        divbtn.style.justifyContent = "center"
        btn_Save = document.createElement("button")
        btn_Save.addEventListener("click", BtnSave)
        btn_Save.appendChild(document.createTextNode("保存设置"))
        btn_Save.style.width = "50%"
        divbtn.appendChild(btn_Save)
        btn_Clear = document.createElement("button")
        btn_Clear.addEventListener("click", BtnClear)
        btn_Clear.appendChild(document.createTextNode("清除数据"))
        btn_Clear.style.width = "50%"
        divbtn.appendChild(btn_Clear)
        panelSet.appendChild(divbtn)
        body.appendChild(panelSet)
        //#endregion
    }
    function Main() {//主函数，修改账户名，和密码，和元素的运营商信息，然后登录网页
        console.log("Run Main")
        //修改登录页面的账号名字
        if (window.localStorage.getItem("Account") == "" || window.localStorage.getItem("Password") == "") {
            alert("阿勒，您好像账户和密码有一个为空，请检查左下角的设置~")
            return;
        }
        var name = document.getElementsByName("DDDDD")
        if (name.length == 0) {
            console.log("已经进入了登陆完毕的判定页面，开始执行判断")
            if (TestConnect() == "AlreadyConnect") {//连通测试成功、
                console.log("~登录成功~")
                if (__AllowAutoClose == true || __AllowAutoClose == "true") {
                    RunClose()
                }
            } else {//连通测试失败
                console.error("~登录失败~")
                alert("(≧﹏ ≦)<br>脚本未能帮您成功登录网络，www")
            }
            return;
        }
        name[1].placeholder = "这个地方将由脚本自动为您填写"
        name[1].value = _UserName
        //修改登录页面的密码
        var pass = document.getElementsByName("upass")

        pass[1].placeholder = "这个地方将由脚本自动为您填写"
        pass[1].value = _UserPassword
        pass[1].type = "text"
        //模拟选择运营商
        var serviceProvider = document.getElementsByName("ISP_select")[0]
        if (_ServiceProvider >= 0 && _ServiceProvider <= 2) {
            serviceProvider.options[Number(_ServiceProvider) + 1].selected = true
        } else {
            console.error("运营商传递参数错误")
        }
        if (__AllowAutoSendMessage == "true" || __AllowAutoSendMessage == true) {//如果可以自动发送消息，那么就向网页发送消息
            SubmitMessage()
        }
    }

    function Update() {//每间隔特定时间进行调用
        if (document.getElementById("panelWelcome") == null) {
            //说明panel不见了，这就是意味着面板消失，界面刷新
            InitPanel()
            FreshPaneInf()
            console.log("自动登录完毕,开始检测结果")
            if (TestConnect() == "AlreadyConnect") {//连通测试成功、
                console.log("~登录成功~")
                if (__AllowAutoClose == true || __AllowAutoClose == "true") {
                    RunClose()
                }
            } else {//连通测试失败
                console.error("~登录失败~")
                alert("(≧﹏ ≦)<br>脚本未能帮您成功登录网络，www")
            }
        } else {

        }
        if (___StartTimeOut == true) {//开启了倒计时功能
            document.getElementById("NumberTimeOut").innerHTML = ___TimeOut
            if (___TimeOut == 0) {
                BtnCancelTime()
                closewin()
            }
            ___TimeOut -= 1
        }
    }
    function RunClose() {
        console.log("正在倒计时")
        ___StartTimeOut = true
        //向界面添加一个面板用于提示用户关闭网页
        let body = document.getElementById("edit_body")
        var divTimeOut = document.createElement("div")
        divTimeOut.style.position = "absolute"
        divTimeOut.style.margin = "auto"
        divTimeOut.style.top = "0px"
        divTimeOut.style.bottom = "0px"
        divTimeOut.style.left = "0px"
        divTimeOut.style.right = "0px"
        divTimeOut.style.backgroundColor = __MainColor__
        divTimeOut.style.width = "30%"
        divTimeOut.style.height = "30%"
        divTimeOut.style.height = "30"
        divTimeOut.style.borderRadius = "10px"
        divTimeOut.style.textAlign = "center"
        divTimeOut.id = "PanelTimeOut"//设置面板的状态

        div = document.createElement("div")
        div.style.margin = "10px"
        div.style.fontSize = "25px"
        div.appendChild(document.createTextNode("在此时间后自动关闭本页面"))
        divTimeOut.appendChild(div)

        div = document.createElement("div")
        div.style.margin = "10px"
        div.style.fontSize = "40px"
        p = document.createElement("p")
        p.id = "NumberTimeOut"
        p.appendChild(document.createTextNode("5"))
        div.appendChild(p)
        divTimeOut.appendChild(div)

        div = document.createElement("div")
        div.style.margin = "10px"
        btnM = document.createElement("button")
        btnM.appendChild(document.createTextNode("取消自动关闭"))
        btnM.addEventListener("click", BtnCancelTime)
        div.appendChild(btnM)
        divTimeOut.appendChild(div)

        body.appendChild(divTimeOut)
    }
    function closewin() {//关闭页面
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
            window.location.href = "about:blank";
            window.close();
        } else {
            window.opener = null;
            window.open("", "_self");
            window.close();
        }
    }
    function SubmitMessage() {//模拟点击按钮提交信息
        var sub = document.getElementsByName("0MKKey")
        sub[1].click()
    }

    function TestConnect() {//探测网络连接性
        //检测网页有没有出现关键字“成功，终端IP已经在线等功能”
        var msg = document.getElementById("message")
        if (msg == null) {
            console.log("msg消息：未能捕捉错误信息，判定成功")
            return "AlreadyConnect"
        } else {
            console.log("msg消息：" + msg.innerHTML)
            if (msg.innerHTML.search("已经在线") != -1 || msg.innerHTML.search("成功") != -1)
                return "AlreadyConnect"
        }
    }

    function CloseRightPanel() {
        document.getElementById("panelInf").style.display = "none"
        __AlreadyCloseRightPanel__ = true
    }


    function showMsgNotification(title, msg) {//放弃使用
        Notification.requestPermission(function (status) {
            var n = new Notification(title, { body: msg }); // 显示通知
        });
    }

    function BtnSave() {
        alert("~保存设置成功！~" + "<br>" + "账户密码等敏感信息保存在了脚本本地")
        _UserName = document.getElementById("InputAccount").value
        _UserPassword = document.getElementById("InputPassword").value
        _ServiceProvider = document.getElementById("InputSerSelect").selectedIndex
        __AllowAutoSendMessage = document.getElementById("InputcbAutoSubmit").checked
        __AllowAutoClose = document.getElementById("InputcbAutoClose").checked

        window.localStorage.setItem("Account", _UserName)
        window.localStorage.setItem("Password", _UserPassword)
        window.localStorage.setItem("ServiceProvider", _ServiceProvider)
        window.localStorage.setItem("AllowAutoSignIn", __AllowAutoSendMessage)
        window.localStorage.setItem("AllowAutoClose", __AllowAutoClose)

        console.log("Account:" + _UserName + "\n" + "Password:" + _UserPassword)
        Main()
    }

    function BtnClear() {
        alert("（＾∀＾●）ﾉｼ<br>数据已经被清除了")
        _UserName = ""
        _UserPassword = ""
        _ServiceProvider = 1
        FreshPaneInf()
        document.getElementById("InputAccount").value = ""
        document.getElementById("InputPassword").value = ""
        document.getElementById("InputSerSelect").options[1].selected = true
        document.getElementById("InputcbAutoSubmit").checked = false
        document.getElementById("InputcbAutoClose").checked = false
        var storage = window.localStorage
        storage.removeItem("Account")
        storage.removeItem("Password")
        storage.removeItem("ServiceProvider")
        storage.removeItem("AllowAutoSignIn")
        storage.removeItem("AllowAutoClose")
    }

    function FreshPaneInf() {//重新刷新面板信息
        document.getElementById("InputAccount").value = _UserName
        document.getElementById("InputPassword").value = _UserPassword
        document.getElementById("InputSerSelect").selectedIndex = _ServiceProvider
        document.getElementById("InputcbAutoSubmit").checked = __AllowAutoSendMessage
        document.getElementById("InputcbAutoClose").checked = __AllowAutoClose
    }

    function BtnCancelTime() {
        ___StartTimeOut = false
        document.getElementById("PanelTimeOut").style.display = "none"
    }
})();