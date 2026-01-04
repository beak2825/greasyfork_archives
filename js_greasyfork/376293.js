// ==UserScript==
// @name         软件评测师真题解析查看器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查看软件评测师题目的解析
// @author       deepwzh(https://github.com/deepwzh)
// @match        http://www.rkpass.cn/tk_timu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376293/%E8%BD%AF%E4%BB%B6%E8%AF%84%E6%B5%8B%E5%B8%88%E7%9C%9F%E9%A2%98%E8%A7%A3%E6%9E%90%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/376293/%E8%BD%AF%E4%BB%B6%E8%AF%84%E6%B5%8B%E5%B8%88%E7%9C%9F%E9%A2%98%E8%A7%A3%E6%9E%90%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function get_jiexi() {
        var tmp = document.getElementsByTagName("script");
        var param = null;
        for (let i = 0; i < tmp.length; i++) {
             if (tmp[i].src.startsWith('http://www.rkpass.cn/timu_anniu.jsp?')) {
                 param = tmp[i].src.split('?')[1];
             }
        }
        var url = 'http://www.rkpass.cn';
        var web_url = url + "/tk_jiexi.jsp?" + param;
        fetch(web_url).then((data) => data.text()).then((data)=> {
            document.getElementById("jiexi_area").style.display='block';
            document.getElementById("jiexi_area").innerHTML = data;
        })
    }
    var d = document.querySelector("#tk_tjchakanjx")
    d.onclick = get_jiexi;
    // Your code here...
})();