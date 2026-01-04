// ==UserScript==
// @name         Luogu Quick Searcher
// @version      10.1.0
// @description  Quick problems search in luogu~
// @author       Ciyang
// @license      GNU General Public License
// @match        https://www.luogu.org/*
// @match        http://www.luogu.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/236821
// @downloadURL https://update.greasyfork.org/scripts/389291/Luogu%20Quick%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/389291/Luogu%20Quick%20Searcher.meta.js
// ==/UserScript==
'use strict';

var version = "10.1.0", author = "Ciyang", blog = "https://xciyang.github.io/";
var dUrl = GM_getValue("default_way"), bgColor = GM_getValue("searcher_bg");
document.onkeydown = function (event) { if (event.keyCode == 112) mainfunc(); };
if (dUrl == undefined) {
    GM_setValue("default_way", 0);
    dUrl = 0;
}
if (bgColor == undefined) {
    GM_setValue("searcher_bg", "rgba(135,206,235,0.5)");
    bgColor = "rgba(135,206,235,0.5)";
}
function mainfunc() {
    if (removek()) return;
    if (document.readyState == "complete") {
        var newElement = document.createElement("div");
        newElement.id = "CiyangSearch";
        newElement.innerHTML = "<input type = 'text'> | <i class = 'fas fa-search'></i> | <i class= 'fas fa-cog'></i> | <i class ='fas fa-crosshairs'></i> |";
        newElement.style.position = "fixed";
        newElement.style.zIndex = "2";
        newElement.style.top = "10%";
        newElement.style.left = "30%";
        newElement.style.width = "auto";
        newElement.style.height = "auto";
        newElement.style.borderRadius = ".25rem";
        newElement.style.backgroundColor = bgColor;

        var appElement = document.getElementById('app');
        appElement.appendChild(newElement);

        newElement.children[0].style = "padding: .2em .5em;box - sizing: border - box;border: 2px solid #ccc;border - radius: 5px;background: rgba(255, 255, 255, .3);outline: 0; font-weight:bold;";
        for (var i = 1; i < newElement.children.length; i++) newElement.children[i].style.cursor = 'pointer';
        newElement.children[0].onkeydown = function (event) {
            if (event.keyCode == 13) {
                var str = this.value;
                if (str.length == 0) return;
                if (str[0] == '#') judgeURL(1, str.substring(1, str.length));
                else judgeURL(0, str);
            }
            return;
        };
        newElement.children[1].onclick = function () {
            var str = newElement.children[0].value;
            if (str.length == 0) return;
            if (str[0] == '#') judgeURL(1, str.substring(1, str.length));
            else judgeURL(0, str);
            return;
        };
        newElement.children[2].onclick = function () { setLink(); };
        newElement.children[3].onclick = function () { setBGColor(); };
        newElement.children[0].focus();
    }
    return;
};

function removek() {
    var search = document.getElementById("CiyangSearch");
    if (search) {
        search.parentNode.removeChild(search);
        return true;
    }
    return false;
}
function judegeProblem(str) {
    if (str.match(/AT[0-9]{1,4}/) == str) return true;
    if (str.match(/CF[0-9]{1,4}[A-Z][0-9]{0,1}/) == str) return true;
    if (str.match(/SP[0-9]{1,5}/) == str) return true;
    if (str.match(/P[0-9]{4}/) == str) return true;
    if (str.match(/UVA[0-9]{1,5}/) == str) return true;
    if (str.match(/U[0-9]{1,6}/) == str) return true;
    if (str.match(/T[0-9]{1,6}/) == str) return true;
    return false;
}
function judgeURL(way, str) {
    if (str.length == 0) return;
    if (judegeProblem(str)) go(dUrl ^ way, '/problemnew/show/' + str);
    else go(dUrl ^ way, '/problem/list?keyword=' + str);
    return;
}
function go(k, url) {
    if (k == 0) window.location = url;
    else window.open(url);
    removek();
}
function setLink() {
    var defaultWay = prompt("请输入首选打开网页方式，1 为新标签页，0为从当前页跳转。当前为" + dUrl + "，搜索先输入 # 可使用优先级低的方式。");
    if (defaultWay == null) return;
    if (defaultWay != "0" && defaultWay != "1") {
        alert("您的输入有误");
        return;
    }
    GM_setValue("default_way", defaultWay);
    location.reload();
}
function setBGColor() {
    var searcherBG = prompt("请输入背景颜色码，支持RGB和十六进制。当前为" + bgColor + "。", bgColor);
    if (searcherBG == null) return;
    GM_setValue("searcher_bg", searcherBG);
    location.reload();
}
console.info("[Luogu Quick Searcher]已加载成功,版本:" + version + ",作者:" + author + ",博客地址:" + blog);
