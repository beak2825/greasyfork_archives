// ==UserScript==
// @name         Google CN Helper
// @namespace    http://jishu.ge/
// @version      0.2
// @description  使用谷歌子域名进行谷歌中国搜索
// @author       Sleeper
// @match        *://db833953.google.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370834/Google%20CN%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370834/Google%20CN%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var google = "https://db833953.google.cn/search?gws_rd=cr&q=";

    var pagination = document.getElementsByTagName("td");
    var url = google + window.location.href.split("&")[1].substring(2);
    var keyword = 0;
    console.log(pagination);
        for(var i = 1;i < pagination.length-2;i++){
           var count = pagination[i].textContent-1;
           pagination[i].childNodes[0].href = url + "&start=" + Number(count)*10;
        }
    var nav = document.getElementsByClassName("cur")[0];
    pagination[0].childNodes[0].href = nav.previousSibling.childNodes[0].href;
    pagination[pagination.length-1].childNodes[0].href = nav.nextSibling.childNodes[0].href;

    var submit=document.getElementById('mKlEF');
    submit.onclick=function(event){
        event.preventDefault();
        var name = document.getElementById('lst-ib').value;
        window.location.href = google + name;
    }

    document.onkeydown=function(e){//对整个页面文档监听
        var keyNum=window.event ? e.keyCode :e.which;//获取被按下的键值
        if(keyNum==13){//判断如果用户按下了回车键（keycody=13）
            var name = document.getElementById('lst-ib').value;
            window.location.href = google + name;
        }
    }

})();