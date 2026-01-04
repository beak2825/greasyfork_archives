// ==UserScript==
// @name         更好用的NXU
// @namespace    http://tampermonkey.net/
// @version      0.0.7.1
// @description  让NXU更好用！
// @author       H
// @license      Apache Licence
// @match        https://webvpn.nxu.edu.cn/*
// @match        https://jwgl.nxu.edu.cn/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        window.close
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js
// @require      https://greasyfork.org/scripts/469717-nxu%E5%82%A8%E5%AD%98%E5%BA%93/code/NXU%E5%82%A8%E5%AD%98%E5%BA%93.js?version=1215934
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.0.min.js
// @connect      https://webvpn.nxu.edu.cn/*
// @resource     svg-logo https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/css/all.min.css
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/469125/%E6%9B%B4%E5%A5%BD%E7%94%A8%E7%9A%84NXU.user.js
// @updateURL https://update.greasyfork.org/scripts/469125/%E6%9B%B4%E5%A5%BD%E7%94%A8%E7%9A%84NXU.meta.js
// ==/UserScript==


//==脚本系统操作==
function deleteAllVar(){
    while(GM_listValues().length > 0){
        GM_deleteValue(GM_listValues()[0]);
    }
    console.log("变量已清空！");
}
function deleteVar(varname){
    GM_deleteValue(varname);
    console.log("删除了一个变量：" + varname);
}
function setVar(varname, vardata){
    GM_setValue(varname, vardata);
    console.log("设置了一个变量：\n" + varname + " => " + vardata);
}
function showAllVar() {
    var all_value="";
    for (var i = -1; i <= GM_listValues().length; i++) {
        if (i == -1) {
            all_value += "\n=========这里是储存的变量=========\n\n";
        } else if (i == GM_listValues().length) {
            all_value += "\n=========/这里是储存的变量=========";
        } else {
            all_value += GM_listValues()[i]+"："+GM_getValue(GM_listValues()[i])+"\n";
        }
    }
    console.log(all_value);
}
//删除所有变量
//deleteAllVar();

//删除变量
//deleteVar("news_goals");

//设置变量
//setVar("date", "2022-12-25");

//输出所有储存的变量
showAllVar();

//绑定到控制台
unsafeWindow.deleteAllVar = deleteAllVar;
unsafeWindow.deleteVar = deleteVar;
unsafeWindow.setVar = setVar;
unsafeWindow.showAllVar = showAllVar;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
//==/脚本系统操作==


//==需要调用的函数==

//关闭窗口
function closeWindow() {
    try {
        window.opener = window;
        var win = window.open("", "_self");
        win.close();
        top.close();
    } catch (error) {
        console.log("关闭窗口：失败\n错误信息："+error);
    }
}

//随机数
function random(min, max){
    return parseInt(Math.random()*(max-min+1)+min,10);
}

//等待执行
function justWait(min, max, log = true){
    var waitmsg,waittime;
    if (max == 0) {
        waittime = min;
        waitmsg = "==等待了："+(waittime / 1000)+" 秒==";
    } else {
        waittime = random(min, max);
        waitmsg = "==随机等待了："+(waittime / 1000)+" 秒==";
    }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (log) {
                console.log(waitmsg);
            }
            resolve();
        }, waittime);
    });
}

//toast输出
function createToast(id, mes, time = 5) {
    const notifications = document.querySelector('.notifications');
    const toastDetails = {
        success:{
            icon: 'fa-circle-check',
            text: 'Success: This is a success toast.'
        },
        error:{
            icon: 'fa-circle-xmark',
            text: 'Error: This is a error toast.'
        },
        warning:{
            icon: 'fa-circle-exclamation',
            text: 'Warning: This is a warning toast.'
        },
        info:{
            icon: 'fa-circle-info',
            text: 'Info: This is a info toast.'
        }
    };
    if (document.querySelector("style.i"+time.toString().replace(".", "\\."))){
        document.querySelector("style.i"+time.toString().replace(".", "\\.")).innerHTML = ".toast.i"+time+"::before{animation-duration: "+time+"s;}";
    } else {
        var style = document.createElement("style");
        style.className = "i"+time;
        style.innerHTML = ".toast.i"+time+"::before{animation-duration: "+time+"s;}";
        document.getElementsByTagName("head")[0].appendChild(style);
    }
    // console.log(id)
    const {icon, text} = toastDetails[id];
    let txt;
    if (mes == "" || mes == null || typeof(mes) == "undefined"){
        txt = text;
    } else {
        txt = mes;
    }
    const toast = document.createElement('li') // 创建li元素
    toast.setAttribute("time", time);
    toast.setAttribute("style", "::before{animation-duration: "+time+"}")
    toast.className = `toast ${id} i${time}` // 为li元素新增样式
    toast.innerHTML = `
    <div class="column">
        <i class="fa-solid ${icon}"></i>
        <span>${txt}</span>
    </div>
    <i class="fa-solid fa-xmark" onClick="removeToast(this.parentElement)"></i>`
    notifications.appendChild(toast) // 添加元素到 notifications ul
    // 隐藏toast
    if (time != 0){
        toast.timeoutId = setTimeout(()=> removeToast(toast), time * 1000);
    }
}

//toast移除
function removeToast(toast) {
    toast.classList.add('hide')
    if( toast.timeoutId) clearTimeout(toast.timeoutId) // 清楚setTimeout
    // 移除li元素
    setTimeout(() => {
        toast.remove()
    },500)
}

//创建XHR
function createXHR() {
    var xmlHttp;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                console.log("您的浏览器不支持AJAX！");
                return false;
            }
        }
    }
    return xmlHttp;
}

function titleChange(dom) {
    //console.log("更改视图...")
    if (dom.id == "plugin-settings") {
        //document.querySelector(".anchor__item.is-active").classList.remove("is-active");
        //dom.classList.add("is-active");
        //var scrollableDiv = document.querySelector("div.portal-content__block").querySelector(".el-scrollbar__view");
        //var contentDiv = document.querySelector("div#plugin-settings-content");
        //document.querySelector("div#plugin-settings-content").scrollIntoView({ behavior: 'auto', inline: 'center' });
        let div = document.querySelector("div#plugin-settings-content");
        let div_parent = document.querySelector("div.portal-content__block").querySelector(".el-scrollbar__wrap");
        document.querySelector("div.portal-content__block").querySelector(".el-scrollbar__wrap").scrollBy(0, div.getBoundingClientRect().top - div_parent.getBoundingClientRect().top)
    } else {
        //dom.classList.add("is-active");
        //document.querySelector("div.anchor__item#plugin-settings").classList.remove("is-active");
    }
}

//绑定
unsafeWindow.createToast = createToast;
unsafeWindow.removeToast = removeToast;
unsafeWindow.window.close = window.close;
unsafeWindow.titleChange = titleChange;
unsafeWindow.titleChange = titleChange;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
//==/需要调用的函数==


//==预关闭==
if (!$("title").length){
    if (GM_getValue("auto-close")) {
        window.close();
    } else {
        return;
    }
}
//==/预关闭==


//==常量==
const url = window.location.href;
const type = $("title").text();
const load_message = {"loading tesseract core":"核心加载","initializing tesseract":"初始化","loading language traineddata":"加载语言训练数据","initializing api":"初始化接口","recognizing text":"识别验证码"};
//==/常量==


//==开始==
console.log("插件运行...");

//添加css样式
GM_addStyle(css_content);
GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));

//插入toast列表
var ul = document.createElement("ul");
ul.className = "notifications";
$("body").append(ul);
//createToast("success", "测试消息", 0);

//自动关闭处理
if (url == "https://webvpn.nxu.edu.cn/wengine-vpn/failed") {
    if ($("body").html().indexOf("http://ids.nxu.edu.cn/authserver/login?service=https%3A%2F%2Fwebvpn.nxu.edu.cn%2Flogin%3Fcas_login%3Dtrue")) {
        //location.href = "https://webvpn.nxu.edu.cn"
        createToast("warning", "好像出错了？<br>刷新试试吧", 5);
    }
} else if (($("body").html().indexOf("啊呀，服务器开小差了。3秒后自动返回上一页") != -1)
           || ($("body").html().indexOf("出错啦！该网站无法访问!") != -1)
           || (url.indexOf("/login.action") != -1 && url != "https://jwgl.nxu.edu.cn/login.action")){
    if (GM_getValue("auto-close")) {
        window.close();
    } else {
        return;
    }
} else if (url.indexOf("/index.action?wrdrecordvisit") != -1) {
    if (type == "宁夏大学教务管理信息系统") {
        if (GM_getValue("auto-close")) {
            window.close();
        }
        let div = document.createElement("div");
        div.setAttribute("style", "z-index: 9999;padding: 2em 3em;white-space: nowrap;;font-size: 16px;position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);border-radius: 10px;border: 1px white solid;background: #49d3ef;background: -webkit-linear-gradient(to left, #49d3ef, #016ba9);background: linear-gradient(to right bottom, #49d3ef, #016ba9);display: flex;flex-direction: column;align-items: center;color: white;justify-content: center;");
        div.innerHTML = jwgl_error;
        $("body").append(div);
        GM_addElement(document.querySelector("div#control-button"), "button", {textContent: '立即跳转', onclick: "location.href = 'https\:\/\/jwgl.nxu.edu.cn'", style: "height: auto;margin: 0.5em 1em;padding: 0.5em 1em;border: 1px white solid;border-radius: 4px;font-weight: bold;color: white;background:#2193b0;background: -webkit-linear-gradient(to right bottom, #6dd5ed, #2193b0);background: linear-gradient(to right bottom, #6dd5ed, #2193b0);"});
    }
}

//网页判断
if (url == "https://jwgl.nxu.edu.cn/index.action" || url == "https://jwgl.nxu.edu.cn/login.action" ) {
    console.log("检测到教务系统登录页面");
    //自动登录
    if (!GM_getValue("auto-login") || GM_getValue("username") == undefined || GM_getValue("username") == "" || GM_getValue("username") == null || GM_getValue("password") == undefined || GM_getValue("password") == "" || GM_getValue("password") == null) {
        return;
    }
    createToast("info", "自动登录...", 5);
    //自动识别验证码
    Tesseract.recognize(
        'https://jwgl.nxu.edu.cn/captcha/image.action',
        'eng',
        { logger: m => load_message[m.status] ? (createToast("info", load_message[m.status], 1)) : (null) }
    ).then(({ data: { text } }) => {
        jwglLogin(text);
    })
} else if (url.indexOf("https-443") != -1) {
    if (document.getElementsByTagName("h1")[0] && document.getElementsByTagName("h1")[0].innerHTML) {
        if (document.getElementsByTagName("h1")[0].innerHTML == 'An error occurred.') {
            console.log("检测到服务器错误页面");
            if (GM_getValue("auto-close")) {
                window.close();
            } else {
                return;
            }
        }
    } else if (type == "宁夏大学教务管理信息系统"){
        console.log("宁夏大学教务管理信息系统页面");
        console.log("等待800ms");

        if (document.getElementsByName("loginForm.name")[0]) {
            if (GM_getValue("auto-close")) {
                window.close();
            }
            return;
        }

        /*
        createToast("info", "自动登录...", 5);
        //自动识别验证码
        Tesseract.recognize(
            url.replace(/index\.action.+/, "captcha/image.action?vpn-1"),
            'eng',
            { logger: m => load_message[m.status] ? (createToast("info", load_message[m.status], 1)) : (null) }
        ).then(({ data: { text } }) => {
            console.log(1)
            jwglLogin(text);
        })
        */
        //成功进入
        jwgl();

    }
} else if (url.indexOf("login") != -1){
    console.log("疑似登录页面，确认中...");
    if (document.querySelector("title").innerHTML.indexOf("503 Service Temporarily Unavailable") != -1) {
        location.reload();
    }
    if (!document.querySelector(".auth_tab")) {
        return;
    }
    console.log("登录页面");
    if (GM_getValue("username") == undefined || GM_getValue("username") == "" || GM_getValue("username") == null || GM_getValue("password") == undefined || GM_getValue("password") == "" || GM_getValue("password") == null) {
        return;
    }
    //自动登录
    if (GM_getValue("auto-login")) {
        console.log("自动登录...");
        createToast("info", "自动登录...", 5);
        if (document.querySelector("#msg.auth_error")) {
            createToast("error", "输入的学号密码有误", 5);
            return;
        }
        document.querySelector("input#username").value = GM_getValue("username");
        document.querySelector("input#password").value = GM_getValue("password");
        document.querySelector("button.auth_login_btn").click();
    } else {
        return;
    }
} else if (url == "https://webvpn.nxu.edu.cn/" || url == "https://webvpn.nxu.edu.cn"){
    console.log("资源访问控制系统首页");
    resourceIndex();
} else if (type == "宁夏大学教务管理信息系统"){
    console.log("宁夏大学教务管理信息系统页面");
    console.log("等待800ms");
    if (document.getElementsByName("loginForm.name")[0]) {
        if (GM_getValue("auto-close")) {
            window.close();
        }
        return;
    }
    //成功进入
    jwgl();
}

async function jwglLogin(text) {
    document.getElementsByName("loginForm.captcha")[0].onfocus();
    //document.querySelector("input#textfield.loginput").value = "";
    //document.querySelector("input#textfield2.loginput").value = "";
    document.querySelector("input#textfield.loginput").value = GM_getValue("username");
    document.querySelector("input#textfield2.loginput").value = GM_getValue("password");
    document.querySelector("input#textfield3.loginput").value = text;
    document.querySelector("input#submitButton").click();
}

async function resourceIndex() {
    //等待标签加载完毕
    while(true) {
        if (document.querySelector("div.el-scrollbar__view") && document.querySelector("div.el-scrollbar__view").innerHTML) {
            break;
        }
        await justWait(100, 0);
    }
    GM_setValue("autoLogining", false);
    var div_title = document.querySelector("div.el-scrollbar__view");
    var div_setting_title = document.createElement("div");
    div_setting_title.innerHTML = "插件设置";
    div_setting_title.classList.add("anchor__item");
    div_setting_title.id = "plugin-settings";
    div_title.appendChild(div_setting_title);
    var div_settings = document.createElement("div");
    div_settings.innerHTML = settings_div;
    div_settings.id = "plugin-settings-content";
    document.querySelector("div.portal-content__block").querySelector(".el-scrollbar__view").appendChild(div_settings);
    var div_option = document.querySelectorAll("div.anchor__item");
    for (let i = 0; i < div_option.length; i++) {
        div_option[i].setAttribute("onclick", "titleChange(this)");
    }
    document.querySelector("div.portal-content__block").querySelector(".el-scrollbar__wrap").onscroll = () => {
        let div = document.querySelector("div#plugin-settings-content");
        let div_parent = document.querySelector("div.portal-content__block").querySelector(".el-scrollbar__wrap");
        if (div.getBoundingClientRect().top <= div_parent.getBoundingClientRect().top) {
            document.querySelector("div.anchor__item#plugin-settings").classList.add("is-active");
        } else {
            document.querySelector("div.anchor__item#plugin-settings").classList.remove("is-active");
        }
    }
    var button = document.querySelector("#reflash-user-info");
    var input_username = document.querySelector("input#username");
    var input_password = document.querySelector("input#password");
    if (GM_getValue("username") == undefined || GM_getValue("username") == "" || GM_getValue("username") == null || GM_getValue("password") == undefined || GM_getValue("password") == "" || GM_getValue("password") == null) {
        input_username.value = "";
        input_password.value = "";
    } else {
        input_username.value = GM_getValue("username");
        input_password.value = GM_getValue("password");
    }
    reflashUserInfoCheck()
    try {
        // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        button.addEventListener("click", function(){
            reflashUserInfo();
        }, false);
        input_username.addEventListener("input", function(){
            reflashUserInfoCheck();
        }, false);
        input_password.addEventListener("input", function(){
            reflashUserInfoCheck();
        }, false);
    } catch (error) {
        try {
            // IE8.0及其以下版本
            button.attachEvent("onclick", function(){
                reflashUserInfo();
            }, false);
            input_username.addEventListener("oninput", function(){
                reflashUserInfoCheck();
            }, false);
            input_password.addEventListener("oninput", function(){
                reflashUserInfoCheck();
            }, false);
        } catch (error) {
            // 早期浏览器
            alert("错误: 按钮绑定事件失败\n很抱歉，该脚本并不适合您的浏览器\n请尝试安装最新版Edge、Chrome、FireFox、Opera、Safari或其他浏览器后获得支持");
            return;
        }
    }
    var input_switch_total = document.querySelectorAll("label.switch");
    for (let i = 0; i < input_switch_total.length; i++) {
        var input_switch = input_switch_total[i].querySelector("input");
        input_switch.checked = GM_getValue(input_switch.id);
        try {
            // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
            input_switch.addEventListener("input", function(){
                switchHandle(this);
            }, false);
        } catch (error) {
            try {
                // IE8.0及其以下版本
                input_switch.addEventListener("oninput", function(input_switch){
                    switchHandle(this);
                }, false);
            } catch (error) {
                // 早期浏览器
                alert("错误: 按钮绑定事件失败\n很抱歉，该脚本并不适合您的浏览器\n请尝试安装最新版Edge、Chrome、FireFox、Opera、Safari或其他浏览器后获得支持");
                return;
            }
        }
    }
}

function reflashUserInfo() {
    var warning = document.querySelectorAll("p.warning");
    for (let i = 0; i < warning.length; i++) {
        warning[i].style.display = "none";
    }
    var username = document.querySelector("input#username").value;
    var password = document.querySelector("input#password").value;
    //console.log(username);
    var pass = true;
    if (username == null || username == "") {
        document.querySelector("p.warning#username-empty").style.display = "block";
        pass = false;
    } else if (!/^1\d{9}\d$/.test(username)) {
        console.log(username);
        document.querySelector("p.warning#username-error").style.display = "block";
        pass = false;
    }
    if (password == null || password == "") {
        document.querySelector("p.warning#password-empty").style.display = "block";
    }
    if (pass) {
        //console.log("pass");
        GM_setValue("username", username);
        GM_setValue("password", password);
        createToast("success", "账号设置成功！", 2);
        document.querySelector("#reflash-user-info").disabled = true;
    }
}

function reflashUserInfoCheck() {
    var username = document.querySelector("input#username").value;
    var password = document.querySelector("input#password").value;
    if (GM_getValue("username") == undefined || GM_getValue("username") == "" || GM_getValue("username") == null || GM_getValue("password") == undefined || GM_getValue("password") == "" || GM_getValue("password") == null) {
        return;
    }
    //console.log(username)
    //console.log(password)
    if (username == GM_getValue("username") && password == GM_getValue("password")) {
        document.querySelector("#reflash-user-info").disabled = true;
    } else {
        document.querySelector("#reflash-user-info").disabled = false;
    }
}

function switchHandle(input) {
    GM_setValue(input.id, input.checked);
    var message = input.parentNode.parentNode.querySelector("p").innerHTML;
    if (input.checked) {
        message += "&nbsp;&nbsp;&nbsp;&nbsp;开";
    } else {
        message += "&nbsp;&nbsp;&nbsp;&nbsp;关";
    }
    createToast("info", message, 2);
}

async function jwgl() {
    while (true) {
        if ($("iframe#menuIfr").length && $("iframe#menuIfr").contents().find("table") && $("iframe#menuIfr").contents().find("table").html()) {
            break;
        }
        await justWait(1000, 0);
    }
    $("body").css("overflow","hidden");
    var table_main = $("iframe#menuIfr").contents().find("td[valign=top]");
    table_main.append(jwgl_table_title("实用工具", "tool"));
    var table_title = $("iframe#menuIfr").contents().find("table#tool");
    table_main.append(jwgl_table_content("课表生成", "curriculum"));
    $("iframe#menuIfr").contents().find("a#curriculum").click(function () {
        curriculum();
    });
    table_main.append(jwgl_table_content("课表美化", "curriculum-beautification"));
    $("iframe#menuIfr").contents().find("a#curriculum-beautification").click(function () {
        curriculumBeautification();
    });
}

async function curriculum() {
    var docu = $("iframe#menuIfr")[0].contentWindow.document;
    if (!$("iframe#main").contents().find("iframe")[0] || $("iframe#main").contents().find("iframe")[0].src.indexOf("courseTableForStd.action") == -1) {
        if (docu.querySelector("#menuTreenodeIcon4").src == "https://jwgl.nxu.edu.cn/static/images/tree/plus.gif") {
            docu.querySelector("#menuTreeLink4").click();
        }
        while (true) {
            if (docu.querySelector("#menuTreeLink6")) {
                break;
            }
            await justWait(500,0);
        }
        docu.querySelector("#menuTreeLink6").click();
        while (true) {
            if ($("iframe#main").contents().find("iframe").contents().find("div").html()) {
                break;
            }
            await justWait(500,0);
        }
        createToast("info", "请确认学期后再次点击按钮", 3);
        return;
    }
    const $$ = (message)=>{return $("iframe#main").contents().find("iframe").contents().find(message)};
    if (!$$("table.listTable").length) {
        createToast("error", "无课表显示！", 3);
        return;
    }
    $$("td > div").each(function() {
        var div = $(this);
        //div.html(div.attr('title'));
        var content = div.attr('title');
        content = content.split(/[ \n\r]+/);
        (content.length == 3) ? (content.splice(1, 0, "未定")) : (null);
        var content_array = [];
        for (let i = 0; i < content.length; i += 4) {
            content_array.push(content.slice(i, i + 4));
        }
        console.log(content_array);
    });
}

async function curriculumBeautification() {
    var docu = $("iframe#menuIfr")[0].contentWindow.document;
    if (!$("iframe#main").contents().find("iframe")[0] || $("iframe#main").contents().find("iframe")[0].src.indexOf("courseTableForStd.action") == -1) {
        if (docu.querySelector("#menuTreenodeIcon4").src == "https://jwgl.nxu.edu.cn/static/images/tree/plus.gif") {
            docu.querySelector("#menuTreeLink4").click();
        }
        while (true) {
            if (docu.querySelector("#menuTreeLink6")) {
                break;
            }
            await justWait(500,0);
        }
        docu.querySelector("#menuTreeLink6").click();
        while (true) {
            if ($("iframe#main").contents().find("iframe").contents().find("div").html()) {
                break;
            }
            await justWait(500,0);
        }
    }
    const $$ = (message)=>{return $("iframe#main").contents().find("iframe").contents().find(message)};
    if (!$$("table.listTable").length) {
        createToast("error", "无课表显示！", 3);
        return;
    }
    if ($$("table.optimized").length) {
        createToast("info", "已美化！", 3);
        return;
    }
    $$("body").html($$("body").html().replace(".noneprint{\n\tdisplay:none\n}    \n\n",""))
    $$("table.listTable").addClass('optimized');
    $("iframe#main").attr("scrolling", "no");
    $("iframe#main").contents().find("iframe").attr("scrolling", "auto");
    $$("table").css("margin-bottom", "3em");
    $$("tr").attr("height", "auto");
    $$("tr").css("min-height", "45px");
    $$("td > div").each(function() {
        var div = $(this);
        //div.html(div.attr('title'));
        div.css("height", "auto");
        div.css("padding", "1em 0.5em 0");
        var content = div.attr('title');
        content = content.split(/(?<!\d|\[|\]|\(|\))[ \n\r]+(?<!\d|\[|\]|\(|\))/);
        (content.length == 3) ? (content.splice(1, 0, "未定")) : (null);
        var content_array = [];
        for (let i = 0; i < content.length; i += 4) {
            content_array.push(content.slice(i, i + 4));
        }
        console.log(content_array);
        div.css("display", "flex");
        div.css("flex-direction", "column");
        div.css("justify-content", "center");
        div.css("align-items", "center");
        div.css("text-align", "center");
        div.html("");
        for (let i = 0; i < content_array.length; i++) {
            (content_array.length > 1) ? div.append(jwgl_class(content_array[i], i)) : div.append(jwgl_class(content_array[i]))
        }
    });
}

function isIframeChange() {
    var elemIfram = document.querySelector("iframe#main");
    if (window.MutationObserver || window.webkitMutationObserver) {
        // chrome
        var callback = function(mutations) {
            mutations.forEach(function() {
                iframeChange();
            });
        };
        var observer
        if (window.MutationObserver) {
            observer = new MutationObserver(callback);
        } else {
            observer = new webkitMutationObserver(callback);
        }
        observer.observe(elemIfram, {
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });
    } else if (elemIfram.addEventListener) {
        // Firefox, Opera and Safari
        elemIfram.addEventListener("DOMAttrModified", function(){iframeChange();}, false);
    } else if (elemIfram.attachEvent) {
        // Internet Explorer
        elemIfram.attachEvent("onpropertychange", function(){iframeChange();});
    }
}

function iframeChange() {
    console.log("111");
}

async function needLogin() {
    if (new Date().getTime() - GM_getValue("needLoginCheck") < 60 * 10 * 1000) {
        return;
    }
    GM_setValue("needLoginCheck", new Date().getTime());
    GM_setValue("autoLogining", true);
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://webvpn.nxu.edu.cn/",
        onload: function(response) {
            console.log(response.finalUrl);
            if (response.finalUrl.indexOf("login") != -1) {
                console.log(GM_getValue("autoLogining"))
                var tab = GM_openInTab("https://webvpn.nxu.edu.cn/");
                var listener = GM_addValueChangeListener("autoLogining", function(key, oldValue, newValue, remote) {
                    console.log(111)
                    tab.close();
                    GM_removeValueChangeListener(listener);
                });
            }
        }
    });
    await justWait(1000 * 60 * 10, 0);
}

document.onvisibilitychange = ()=>{
    if (document.visibilityState == "visible"){
        needLogin();
    }
}



