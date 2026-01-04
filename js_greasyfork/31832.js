// ==UserScript==
// @name         中国石油大学·插件
// @namespace    canheting
// @version      1.0
// @description  本脚本适用于【中国石油大学（北京）】，教务处登录...
// @author       canheting
// @include      http://202.204.193.215/

// @downloadURL https://update.greasyfork.org/scripts/31832/%E4%B8%AD%E5%9B%BD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%C2%B7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/31832/%E4%B8%AD%E5%9B%BD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%C2%B7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

var remaining_time=8;    //自动登录的时间单位：s
var autoLogin =true;   //是否自动登录
var changeBackImage=true;    //是否自动更换背景图片

var user = document.getElementsByName("zjh")[0];
var pass = document.getElementsByName("mm")[0];

///设置cookie
function setCookie(NameOfCookie, value, expiredays)
{
    //@参数:三个变量用来设置新的cookie:
    //cookie的名称,存储的Cookie值,
    // 以及Cookie过期的时间.
    // 这几行是把天数转换为合法的日期

    var ExpireDate = new Date ();
    ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));

    // 下面这行是用来存储cookie的,只需简单的为"document.cookie"赋值即可.
    // 注意日期通过toGMTstring()函数被转换成了GMT时间。

    document.cookie = NameOfCookie + "=" + escape(value) +
        ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString());
}

///获取cookie值
function getCookie(NameOfCookie)
{
    // 首先我们检查下cookie是否存在.
    // 如果不存在则document.cookie的长度为0

    if (document.cookie.length > 0)
    {

        // 接着我们检查下cookie的名字是否存在于document.cookie

        // 因为不止一个cookie值存储,所以即使document.cookie的长度不为0也不能保证我们想要的名字的cookie存在
        //所以我们需要这一步看看是否有我们想要的cookie
        //如果begin的变量值得到的是-1那么说明不存在

        begin = document.cookie.indexOf(NameOfCookie+"=");
        if (begin != -1)
        {
            // 说明存在我们的cookie.

            begin += NameOfCookie.length+1;//cookie值的初始位置
            end = document.cookie.indexOf(";", begin);//结束位置
            if (end == -1) end = document.cookie.length;//没有;则end为字符串结束位置
            return unescape(document.cookie.substring(begin, end)); }
    }
    // cookie不存在返回null
    return null;
}

///删除cookie
function delCookie (NameOfCookie)
{
    // 该函数检查下cookie是否设置，如果设置了则将过期时间调到过去的时间;   
    //剩下就交给<a href="http://lib.csdn.net/base/operatingsystem" class='replace_word' title="操作系统知识库" target='_blank' style='color:#df3434; font-weight:bold;'>操作系统</a>适当时间清理cookie啦

    if (getCookie(NameOfCookie)) {
        document.cookie = NameOfCookie + "=" +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

function checkCookies() {
    username=getCookie('username');
    password=getCookie("password");
    if ((username!=null && username!="")&&(password!=null && password!="")) {
        user.value = username;
        pass.value = password;
        if(autoLogin==true){
            //添加自动登录
            setTimeout("login()",remaining_time*1000);
            //插入自动登陆提示
            var divObj=document.createElement("div");
            var first=document.body.firstChild;//得到页面的第一个元素
            divObj.innerHTML="将在"+remaining_time+"s后自动登录，请稍后...";
            document.body.insertBefore(divObj,first);//在得到的第一个元素之前插入
        }
    }
    else {
        var result;
        result = prompt("学号",2013);
        if (result!=null&&result!=""){
            setCookie('username',result,30);
            result =prompt("密码","");
            if (result!=null&&result!=""){
                setCookie('password',result,30);
                checkCookies();
            }
        }

    }
}

if(changeBackImage==true){
    document.body.background="https://unsplash.it/1366/768/?random";
}

document.getElementById("userName_label").style.color="red";
document.getElementById("password_label").style.color="red";

document.body.onload=checkCookies();







