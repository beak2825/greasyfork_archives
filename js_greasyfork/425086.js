// ==UserScript==
// @name         上海工程技术大学自动填体温
// @namespace    sues
// @version      0.3
// @description  上海工程技术大学自动填体温脚本
// @author       You
// @include      *://cas.sues.edu.cn/cas/login?*
// @include      *://my.sues.edu.cn/_web/sopportal/stuIndex.jsp*
// @include      *://my.sues.edu.cn/_web/sopportal/workHall.jsp?*
// @include      *://workflow.sues.edu.cn/default/work/shgcd/jkxxcj/jkxxcj.jsp
// @grant        unsafeWindow
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425086/%E4%B8%8A%E6%B5%B7%E5%B7%A5%E7%A8%8B%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%A1%AB%E4%BD%93%E6%B8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/425086/%E4%B8%8A%E6%B5%B7%E5%B7%A5%E7%A8%8B%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%A1%AB%E4%BD%93%E6%B8%A9.meta.js
// ==/UserScript==


window.onload = function() {
    var title = document.title;
    if(title.search("登录") != -1){
       login();
       return true;
    }
    if(title.search("综合服务门户") != -1)
    {
        setTimeout({},2000);
        open();
        return true;
    }
    if(title.search("一网通办") != -1)
    {
        setTimeout({},3000);
        open2();
        return true;
    }
    if(title.search("健康信息填报") != -1)
    {
        fill();
        return true;
    }
};

function login()
{
    var id_num="";  // 请输入你的学号
    var password="";    // 请输入你的密码
    if (id_num == "" || password == "")
        {alert("首次使用请配置脚本文件中的用户名和密码(在脚本文件69、70行)，配置完成后请刷新页面");
            return false;
        }
    document.getElementById("username").value = id_num;
    document.getElementById("password").value = password;
    setTimeout({},2000);
    document.getElementById("passbutton").click();
    return true;
}

function open()
{
    document.getElementsByClassName("fa fa-bank")[0].click();
    return true;
}

function open2()
{
    var url = "https://workflow.sues.edu.cn/default/work/shgcd/jkxxcj/jkxxcj.jsp";
    GM_openInTab(url, { active: true, insert: true, setParent :true });
    return true;
}

function fill()
{
    var tw_int = String((Math.floor(Math.random() * (369 - 361 + 1)) + 361)/10);
    document.getElementsByName("tw")[0].innerText = tw_int;
    setTimeout({},2000);
    document.getElementById("post").click();
    setTimeout({},5000);
    document.getElementsByClassName("layui-layer-btn0")[0].click();
    return true;
}
