// ==UserScript==
// @name         全民k歌歌曲下载
// @namespace    Chenbz
// @version      1.5
// @description  全民k歌歌曲下载!
// @author       Chenbz
// @match        https://node.kg.qq.com/play?*
// @match        https://kg.qq.com/node/play?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412414/%E5%85%A8%E6%B0%91k%E6%AD%8C%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/412414/%E5%85%A8%E6%B0%91k%E6%AD%8C%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // console.log(window.__DATA__.detail.song_name);
    // console.log(window.__DATA__.detail.playurl);
    // console.log(window.__DATA__.share.data_url);

    /*
     * window.__DATA__ 是请求获得的数据源
     * 歌曲名字: window.__DATA__.detail.song_name
     * 歌曲链接: window.__DATA__.detail.playurl
     * 歌曲链接: window.__DATA__.share.data_url
     * */

     function getA(name, url) {
        let a = document.createElement('a');
        a.href = url;
        a.innerHTML = name;
        a.target = "_blank";
        a.style.color = "#fff";
        a.style.backgroundColor = "#28a745";
        a.style.borderColor = "#28a745";
        a.style.padding = "5px 20px";
        a.style.borderRadius = "10px";
        a.style.float = "right";
        a.style.fontSize = "20px";
        a.style.textDecoration = "none";
        a.style.marginLeft = "5px";

        return a;
    }

    // 获取要被添加节点
    let download = document.getElementsByClassName('play_name')[0];

    if (window.__DATA__.detail.playurl !== "") {
        // 添加下载按钮
        download.appendChild(getA("下载此歌曲", window.__DATA__.detail.playurl));
    } else {
        // 添加下载按钮
        download.appendChild(getA("下载此歌曲", window.__DATA__.share.data_url));
    }

    if (window.__DATA__.detail.playurl_video !== "") {
        // 添加下载按钮
        download.appendChild(getA("下载此视频", window.__DATA__.detail.playurl_video));
    }

    // 创建下载歌词按钮
    let a = document.createElement('a');
    a.href = "javascript:void(0)";
    a.innerHTML = "下载此歌词";
    a.id = "download_txt";
    a.style.color = "#fff";
    a.style.backgroundColor = "#28a745";
    a.style.borderColor = "#28a745";
    a.style.padding = "5px 20px";
    a.style.borderRadius = "10px";
    a.style.float = "right";
    a.style.fontSize = "20px";
    a.style.textDecoration = "none";
    a.style.marginLeft = "5px";

    // 把按钮加到页面
    download.appendChild(a);

    // 监听下载按钮点击事件
    let txt = document.getElementById("download_txt");
    txt.onclick = function() {
        download_txt();
    };

    // 定义一个数组，用来存储响应数据
    var arrayObj = new Array();
    var _ajax = $.ajax;

    // 拦截所有请求
    $.ajax = function(opts) {
        // 把拦截下来的响应存储到数组里
        arrayObj.push(_ajax(opts));
    };

    // 下载歌词方法
    function download_txt() {
        // 把响应数据 JSON
        let json = JSON.parse(arrayObj[0].responseText);
        // 取得歌词部分
        let text = json[0].data.lyric

        // 执行下载
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', window.__DATA__.detail.song_name);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }

})();