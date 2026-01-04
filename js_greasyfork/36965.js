// ==UserScript==
// @name         正方教务管理系统-框架
// @namespace    https://github.com/archichen/Zhengfang_edu_sys_beautify.git
// @version      0.3
// @description  [usts]
// @author       Ar
// @include      *://*/xs_main.aspx*
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      bing.com
// @run-at       document-body
// @language     English
// @downloadURL https://update.greasyfork.org/scripts/36965/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F-%E6%A1%86%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/36965/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F-%E6%A1%86%E6%9E%B6.meta.js
// ==/UserScript==

// 清除原生样式
var head = document.getElementsByTagName("head")[0];
for(let child in head.childNodes) {
    let childTag = head.childNodes[child];
    if(childTag.rel == "stylesheet" && childTag.rel != undefined) {
        head.removeChild(childTag);
    }
}

// 清除丑陋的logo
var head = document.getElementsByClassName("head")[0];
var logo = document.getElementsByClassName("logo")[0];
head.removeChild(logo);

// 清除丑陋的底栏
var bodyDiv = document.getElementById("bodyDiv");
var footerDiv = document.getElementById("footerDiv");
bodyDiv.removeChild(footerDiv);

// 暂时隐藏嵌入窗口，以便处理导航栏
// var mainDiv = document.getElementById("mainDiv");
// mainDiv.style.display = "none";

/**
* CSS注入
*/
// CSS静态注入
GM_addStyle(`
    body{
        padding: 0;
        margin: 0;
        background-color: white;
        color: #B8B6B5;
    }

    .nav {
        margin: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    // 清除默认列表样式
    ul {
        position: relative;
    }

    // 下拉菜单样式
    ul li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .top {
        // padding: 10px;
        padding: 10px;
        margin-right: 10px;
        margin-left: 10px;
        display: inline-block;
        // background-color: rgba(255, 255, 255, 0.3);
        transition: background-color 0.2s;
    }

    .top:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .sub {
        display: none;
        margin-top: 10px;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        z-index: 2;
    }

    .sub li {
        margin: 10px;
        list-style: none;
        transition: background-color 0.2s;
    }

    .sub li:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .top:hover .sub {
        display: block;
    }
    
    // 下拉菜单样式结束

    // 用户名
    .info {
        position: absolute;
        display: inline;
    }

    .info li {
        display: inline-block;
    }

    // 屏蔽“欢迎您”文字 
    .info ul li #Label3 {
        display: none;
    }
`);

// CSS动态部分注入
var body = document.getElementsByTagName("body")[0];
var style = document.createElement("style");
style.innerHTML = `
    a {
        text-decoration: none;
        color: #B8B6B5;
    }

    .info {
        position: absolute;
        right: 0;
        top: 0;
        margin: 0;
        padding: 0;
        display: inline-block;
    }

    .info #likTc {
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }

    .info #likTc:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .info ul li #Label3 {
        display: none;
    }

    .info ul li #xhxm {
        font-style: normal;
    }
`;
body.appendChild(style);

/**
* 元素注入
*/


/**
 * JS注入
 */
// 改变背景图片
var changeBackgroundImage = function() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
        timeout: 2000,
        ontimeout: function() {
            alert("背景图片获取失败，检查网络是否联通并重试。");
        },
        onload: function(data) {
            let img_url = JSON.parse(data.response).images[0].url;
            body.style.backgroundImage = `url(https://cn.bing.com${img_url})`;
            // body.style.backgroundImage = `url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514914870391&di=ce667824bebbae18b1916c0256e15654&imgtype=0&src=http%3A%2F%2Fpic103.nipic.com%2Ffile%2F20160711%2F22330193_120845617000_2.jpg)`;
            body.style.backgroundSize = "100%";
        }
    });
}

// 改变导航样式。e.g, 当前位置 / 通知公告 斜体改为常规
var changeNavWord = function() {
    let local = document.getElementsByClassName("location")[0];
    let local_em = local.getElementsByTagName("em")[0];
    local_em.innerText = local_em.innerText.replace(" ", "").replace("--", " / ");
    local_em.style.fontStyle = "normal";
};

// 改变嵌入窗口位置
var changeMainDivPlace = function() {
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.style.display = "inline-block";
    let margin_left = window.innerWidth / 2 - mainDiv.offsetWidth / 2 + "px";
    mainDiv.style.marginLeft = margin_left;
};

var notification = function() {
    let xhxm = document.getElementById("xhxm");
    let name = xhxm.innerText.replace("同学", "");
    GM_notification({
        text: `Author: Ar.\nClick here to Star and fork me on Github.`,
        title: `Welcome, ${name}~`,
        image: "http://img5.imgtn.bdimg.com/it/u=3850649171,3929565142&fm=27&gp=0.jpg"
    }, function() {
        window.open("https://github.com/archichen/Zhengfang_edu_sys_beautify.git");
    });
};

changeBackgroundImage();    // 改变背景图片
changeNavWord();    // 改变导航提示
changeMainDivPlace(); // 嵌入网页居中
setInterval(changeMainDivPlace, 100);

// 趣味弹窗
setTimeout(notification, 1);