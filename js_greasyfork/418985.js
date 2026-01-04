// ==UserScript==
// @name         中国农业大学各平台自动操作合集
// @namespace    Jia.ys
// @version      1.1
// @description  自动登录中国农业大学学吧，修改为简体中文；自动登录中国农业大学校园网、THEOL 在线教育平台，跳过每次都要点击的登录按钮，自动刷新 THEOL 在线教育平台
// @author       Rsmix
// @include      http://studybar.cau.edu.cn/login/index.php
// @include      http://studybar.cau.edu.cn/
// @include      http://studybar.cau.edu.cn/?lang=en
// @include      http://studybar.cau.edu.cn/?lang=zh_tw
// @include      http://10.3.191.8/
// @include      http://10.3.191.9/
// @include      http://10.3.38.7/
// @include      http://jx.cau.edu.cn/meol/index.do
// @match        http://jx.cau.edu.cn/meol/homepage/common/sso_login.jsp
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/418985/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%90%84%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/418985/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%90%84%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

// 如果你想注销后也自动登录，请将这两行代码插入第13行
// @include      http://10.3.191.8/a79.htm
// @include      http://10.3.191.8/a79.htm?isReback=*


var cauWebUser = {"UserName": "这里填账号",
                  "PassWord": "这里填密码"};

var studybarUser = {"UserName": "这里填账号",
                    "PassWord": "这里填密码"};

function studybarLogin()
{
    if (studybarUser["UserName"] == "这里填账号" || studybarUser[""] == "这里填密码") {
        alert("请去用户脚本管理器中，找到studybarUser，添加自己的账号与密码");
    } else {
        (function() {
            setTimeout(function(){
                document.getElementById("username").value = studybarUser["UserName"];
                document.getElementById("password").value = studybarUser["PassWord"];
                document.getElementById("loginbtn").click();
            },1000);
        })();
    }
}

function studybarFresh()
{
    window.location.href = "http://studybar.cau.edu.cn/?lang=zh_cn";
}

function cauWebLogin()
{
    if (cauWebUser["UserName"] == "这里填账号" || cauWebUser["PassWord"] == "这里填密码") {
        alert("请去用户脚本管理器中，找到 cauWebUser，添加自己的账号与密码");
    } else {
        (function() {
            if (document.title == '上网登录页'){
                setTimeout(function(){
                    $( "input[name='DDDDD']").attr("value",cauWebUser["UserName"]);
                    $( "input[name='upass']").attr("value",cauWebUser["PassWord"]);
                    ee(1);
                },600);
            }
        })();
    }
}

function THEOLLoginClick() {
    setTimeout(function(){
        javascript: (function () {
            var link = document.getElementsByClassName('into')[0];
            window.location.href = link.href;
        })()
    },600);
}

function THEOLFresh() {
    window.parent.location.reload();
}

switch(document.URL)
{
    case "http://studybar.cau.edu.cn/login/index.php":
        studybarLogin();
        break;
    case "http://studybar.cau.edu.cn/":
    case "http://studybar.cau.edu.cn/?lang=en":
    case "http://studybar.cau.edu.cn/?lang=zh_tw":
        studybarFresh();
        break;
    case "http://10.3.191.8/":
    case "http://10.3.191.9/":
    case "http://10.3.38.7/":
    case "http://10.3.191.8/a79.htm":
    case "http://10.3.191.8/a79.htm?isReback=*":
        cauWebLogin();
        break;
    case "http://jx.cau.edu.cn/meol/index.do":
        THEOLLoginClick();
        break;
    case "http://jx.cau.edu.cn/meol/homepage/common/sso_login.jsp":
        THEOLFresh();
        break;
}


// @Etc:     Hello my friend, this is my contact information, welcome to advise
// @Blog:    https://www.cnblogs.com/rsmx/
// @GitHub:  https://github.com/JiaYunSong
// @Date:    2020-12-22 08:52