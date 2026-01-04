// ==UserScript==
// @name        闲鱼搜索框
// @namespace   Scripts
// @version     0.0.1
// @description 为闲鱼添加搜索框
// @author      chasen
// @match       https://2.taobao.com/*
// @match       https://s.2.taobao.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375210/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/375210/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==
'use strict';
!(function() {
    var url = "https://2.taobao.com/list/list.htm?q=",
        ul  = document.getElementById("J_SiteNavBdR"),
        li  = document.createElement("li"),
        div = document.createElement("div"),
        inp = document.createElement("input"),
        btn = document.createElement("button");
    // 输入框
    inp.style.width      = "70%";
    inp.style.border     = "1px solid #a2a2a2";
    inp.style.background = "none";
    if (getParam("q") !== false) inp.value = getParam("q");
    inp.onkeydown = function(e) {
        if (e.keyCode != "13") return;
        window.location.href = url + inp.value.trim();
    }
    // 搜索按钮
    btn.innerText        = "搜索";
    btn.style.width      = "20%";
    btn.style.border     = "1px solid #a2a2a2";
    btn.style.background = "none";
    btn.style.marginLeft = "-1px";
    btn.onclick = function() {
        window.location.href = url + inp.value.trim();
    }
    // 外层
    div.className = "site-nav-menu-hd menu-hd";
    li.className  = "site-nav-menu menu";
    // 添加到页面
    div.appendChild(inp);
    div.appendChild(btn);
    li.appendChild(div);
    ul.appendChild(li);

    function getParam(name) {
        var paramArr = window.location.search.substr(1).split('&');
        for (var i = 0; i < paramArr.length; i++) {
            var keyValue = paramArr[i].split('=');
            if (keyValue[0] == name) return decodeURI(keyValue[1]);
        }
        return false;
    }
})();