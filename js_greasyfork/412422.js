// ==UserScript==
// @name         网易云音乐歌曲下载
// @namespace    Chenbz
// @version      1.2
// @description  网易云音乐歌曲下载!
// @author       Chenbz
// @match        https://music.163.com/song?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412422/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/412422/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 获取歌曲id
    function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

    /*
    * 获取到id
    * 判断是不是在歌曲详情界面
    * 显示下载按钮
    **/
    if(getQueryVariable("id")) {
        // console.log("http://music.163.com/song/media/outer/url?id=" + getQueryVariable("id"));

        let download = document.getElementsByClassName('des s-fc4')[0];

        if(download !== undefined) {
            let a = document.createElement('a');
            a.href = "http://music.163.com/song/media/outer/url?id=" + getQueryVariable("id");
            a.innerHTML = "下载此歌曲";
            a.target = "_blank";
            a.style.color = "#fff";
            a.style.backgroundColor = "#28a745";
            a.style.borderColor = "#28a745";
            a.style.padding = "5px 20px";
            a.style.borderRadius = "10px";
            a.style.float = "right";
            a.style.fontSize = "20px";
            a.style.textDecoration = "none";

            download.appendChild(a);
        }
    }

})();