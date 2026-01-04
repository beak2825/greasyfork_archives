// ==UserScript==
// @name         狼窝获m3u8url
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://langwotv.com/index.php/*/1.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421637/%E7%8B%BC%E7%AA%9D%E8%8E%B7m3u8url.user.js
// @updateURL https://update.greasyfork.org/scripts/421637/%E7%8B%BC%E7%AA%9D%E8%8E%B7m3u8url.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url=$("#playleft iframe").attr("src")
    const arr=url.split("url=")

    const li=$("<div>"+arr[1]+"</div>")
    li.click(()=>{
        copyText(arr[1])
        let eleB=$("<div style='padding-top:20px;color:#E6A23C;'>已复制成功</div>")
        $(".player").append(eleB)
    })
    $(".player").append(li)

    $(".video_title").click(()=>{
        copyText($(".video_title").text().trim())
    })
    // Your code here...

    // 复制的方法
    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }
})();