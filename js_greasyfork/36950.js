// ==UserScript==
// @name         教务管理系统美化
// @namespace    https://gitee.com/archi_chen/usts_beautify.git
// @version      0.3
// @description  [usts] [beautify] [苏州科技大学] [美化] [教务频道] [正方]
// @author       Ar
// @include      *://*/default*.aspx
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36950/%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/36950/%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var head = document.getElementsByTagName("head")[0];
for(let child in head.childNodes) {
    let childTag = head.childNodes[child];
    if(childTag.rel == "stylesheet" && childTag.rel != undefined) {
        head.removeChild(childTag);
    }
}

var form = document.getElementsByTagName("form")[0];
for(let child in form.childNodes) {
    let childTag = form.childNodes[child];
    if(typeof childTag == "object") {
        form.removeChild(childTag);
    }
}

// 添加HTML框架
var form = document.getElementById("form1");
form.innerHTML = `
<!-- 遮罩 -->
<div id="mask"></div>

<div id="copyright">Hello world</div>

<!-- ASP保留字 -->
<input type="hidden" name="__VIEWSTATE" value="dDwxNTMxMDk5Mzc0Ozs+8SKE1eIxEXhQ+rQzyLaGuxFtQgA=">
<div id="login">

<h1>USTS</h1>
<!-- 用户名 -->
<div class="row">
<div class="label" id="studentid">Student ID</div>
<input name="txtUserName" type="text" id="txtUserName" tabindex="1" class="text_nor" autocomplete="off" placeholder="e.g, card number">
</div>

<!-- 用户密码输入框 -->
<div class="row">
<div class="label" id="studentid">Password</div>
<input name="TextBox2" type="password" id="TextBox2" tabindex="2" class="text_nor" placeholder="e.g, six word after ID card">
</div>

<!-- 验证码输入框 -->
<div class="row">
<div class="label" id="studentid">ID Code</div>
<input name="txtSecretCode" type="text" id="txtSecretCode" tabindex="3" class="text_nor" onblur="yzblur(this);" onkeydown="keydown(this);" onfocus="show(this);" title="看不清，换一张" alt="看不清，换一张" placeholder="Verification Code">
</div>

<div class="row" style="text-align: center">
<!-- 验证码图片 -->
<img id="icode" onclick="reloadcode();" title="看不清，换一张" onclick="reloadcode();" alt="看不清，换一张" src="CheckCode.aspx" border="0">
<!-- 身份选择单选按钮：默认值“学生” -->
<input id="RadioButtonList1_2" type="radio" name="RadioButtonList1" value="学生" checked="checked" tabindex="4" style="display: none">
</div>

<!-- 提交按钮 -->
<div class="row">
<input type="submit" name="Button1" value="提交" id="Button1" class="btn_dl">
</div>
</div>
`;

// 添加样式表
var body = document.getElementsByTagName("body")[0];
var style = document.createElement("style");
style.innerHTML = `
body {
    background-color: black;
    z-index: -2;
}

#mask {
    position: absolute;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.2s;
}

input {
    border-style: none;
    margin: 0;
    padding: 0;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    border-color: white;
    display: inline;
}

.text_nor {
    color: gray;
    border-style: solid;
    border-width: 2px;
    border-color: white;
    transition: border-color 0.4s;
}

.text_nor:hover {
    border-color: rgb(88, 174, 255);
}

input[type="submit"] {
    width: 100%;
    background-color: white;
    color: gray;
    transition: background-color 0.2s;
}

input[type="submit"]:hover {
    background-color: rgb(220, 220, 220);
    height: 30px;
    line-height: 30px;
}

.row {
    margin: 8px;
}

.label {
    width: 100px;
    height: 30px;
    line-height: 30px;
    color: white;
    display: inline-block;
}

#login {
    display: inline-block;
    margin-top: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    padding: 20px;
    border-radius: 5px;
}

#icode {
    display: none;
}

h1 {
    color: white;
}

#copyright {
    color: white;
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 50px;
}
`;
body.appendChild(style);

var dailyImg = document.createElement("script");
dailyImg.innerHTML = `
function dailyImg(jsonp) {
    let img_url = "https://cn.bing.com" + jsonp.images[0].url;
    let img_text = jsonp.images[0].copyright;
    let body = document.getElementsByTagName("body")[0];
    body.style.backgroundImage = "url(" + img_url + ")";

    let copyright = document.getElementById("copyright");
    copyright.innerText = img_text;
}
`;

var JSONP = document.createElement("script");
JSONP.src = "http://23.106.131.241/bing";

body.appendChild(dailyImg);
body.appendChild(JSONP);

// JS功能模块

// 垂直-水平居中登陆DIV
var placeLoginDIV = function() {
    var login = document.getElementById("login");
    login.style.marginTop = window.innerHeight/2 - login.offsetHeight/2 + "px";
    login.style.marginLeft = window.innerWidth/2 - login.offsetWidth/2 + "px";
};

window.addEventListener("resize", placeLoginDIV);

placeLoginDIV();

var inputEle = document.getElementsByTagName("input");
for(let input in inputEle) {
    if(!isNaN(input)) {
        inputEle[input].addEventListener("focus", function() {
            let mask = document.getElementById("mask");
            mask.style.opacity = 0.5;
            if(inputEle[input].id == "txtSecretCode") {
                let icode = document.getElementById("icode");
                icode.style.display = "inline-block";
            }
        });
        inputEle[input].addEventListener("focusout", function() {
            let mask = document.getElementById("mask");
            mask.style.opacity = 0;
        });
    }
}