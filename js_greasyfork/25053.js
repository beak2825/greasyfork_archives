// ==UserScript==
// @name        lianu的夺宝岛脚本•寨
// @description zh-cn
// @namespace   dbditem.jd.com
// @version     1.4.6
// @grant       none
// @homepageURL https://greasyfork.org/zh-CN/scripts/25053-lianu%E7%9A%84%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%84%9A%E6%9C%AC-%E5%AF%A8
// @include     /https?\://dbditem.jd.com/*
// @downloadURL https://update.greasyfork.org/scripts/25053/lianu%E7%9A%84%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%84%9A%E6%9C%AC%E2%80%A2%E5%AF%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/25053/lianu%E7%9A%84%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%84%9A%E6%9C%AC%E2%80%A2%E5%AF%A8.meta.js
// ==/UserScript==

if (window.location.protocol != "http:") {
    window.location.href = "http:" + window.location.href.substring(window.location.protocol.length);
}

var tmp = document.getElementsByClassName('name')[0].title;
tmp = tmp.replace("&","%26");
var b = document.getElementById("feedback-auction");
var div = document.createElement("iframe");
div.width = "510";
div.height = "90";
div.frameborder = "0";
div.allowtransparency = "yes";
div.scrolling = "no";
div.src = "http://www.lianu.com/dbdsql3.php?code=1&name=" + tmp + "&sul=0&time1=0&time2=0&zt=&day=90";
b.parentNode.insertBefore(div, b);
var b2 = document.getElementsByClassName('name')[0];
var div2 = document.createElement("br");
insertAfter(div2, b2);
var div2 = document.createElement("br");
insertAfter(div2, b2);
var div2 = document.createElement("br");
insertAfter(div2, b2);
var len = getStrActualLen(tmp);
//alert(len);
if (len >= 1) {
    var body = document.getElementsByTagName('h1')[0];
    var div = body.innerHTML;
    var a = document.createElement("h2");

    var mo = document.getElementsByClassName('parameter')[0].innerText;
    var mos = '';
    var bool = mo.indexOf("磨损");
    if (bool > 0) {
        mos = '<font color="red">[磨损]</font>';
        //alert(mos);
    }
    var bool = mo.indexOf("脏");
    if (bool > 0) {
        mos = mos + '<font color="red">[脏]</font>';
        //alert(mos);
    }
    var bool = mo.indexOf("慎拍");
    if (bool > 0) {
        mos = mos + '<font color="red">[慎拍]</font>';
        //alert(mos);
    }
    var bool = mo.indexOf("刮花");
    if (bool > 0) {
        mos = mos + '<font color="red">[刮花]</font>';
        //alert(mos);
    }
    var bool = mo.indexOf("磕碰");
    if (bool > 0) {
        mos = mos + '<font color="red">[磕碰]</font>';
        //alert(mos);
    }
    var bool = mo.indexOf("伤");
    if (bool > 0) {
        mos = mos + '<font color="red">[伤]</font>';
        //alert(mos);
    }
    a.innerHTML = div + mos;
    body.parentNode.insertBefore(a, body);
    body.parentNode.removeChild(body);
}

var b2 = document.getElementById("accordion1").parentNode;
//alert(b2.innerHTML);
b2.innerHTML = "";
//var b3 = getClass("div", "parameter");
//b2.innerHTML = '<div class="parameter" style="padding-left:500px;">' + b3[0].innerHTML + '</div>';
//b3[0].innerHTML = "";

function getClass(tagName, className) { //获得标签名为tagName,类名className的元素
    if(document.getElementsByClassName) { //支持这个函数
        return document.getElementsByClassName(className);
    } else {
        var tags = document.getElementsByTagName(tagName);//获取标签
        var tagArr = [];//用于返回类名为className的元素
        for(var i = 0;i < tags.length; i++) {
            if(tags[i].class == className) {
                tagArr[tagArr.length] = tags[i];//保存满足条件的元素
            }
        }
        return tagArr;
    }
}

function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function getStrActualLen(sChars) {
    return sChars.replace(/[^\x00-\xff]/g,"xx").length;
}
function insertAfter(newEl, targetEl) {
    var parentEl = targetEl.parentNode;
    if(parentEl.lastChild == targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}