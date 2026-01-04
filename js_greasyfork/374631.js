// ==UserScript==
// @name         战旗直播地址解析
// @namespace    https://guihet.com/
// @version      1.0.9
// @description  打开战旗官网的任意直播间即可自动解析出m3u8格式的永久有效直播源地址，该地址可以用PotPlayer或VLC或其他自定义URL的播放器打开播放..
// @author       黑鸟博客
// @include      http://www.zhanqi.tv/*
// @include      https://www.zhanqi.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374631/%E6%88%98%E6%97%97%E7%9B%B4%E6%92%AD%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/374631/%E6%88%98%E6%97%97%E7%9B%B4%E6%92%AD%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function heredoc(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }
    var boxHtml = '';
    if(window.oPageConfig.oRoom.status !='4'){
        boxHtml = '状态:未知<br>';
    }
    if(window.oPageConfig.oRoom.status =='4'){
        boxHtml = '状态:未知<br>';
        try{
                var absUrl = "解析错误！！";
                var absUrlzq = "解析错误！！";
                var preURL ="解析错误！！";
                var lastURL = "解析错误！！";
                boxHtml += '<div class="flv-url-item"><label>地址</label><input id="flv-url-1" value="解析错误！！"/><a onclick="copyFlvUrl(1)">复制</a></div>';
                boxHtml += '<p align="center">BY <a href="https://guihet.com/" style="color:#0000FF">黑鸟博客</a></p>';
        }catch(e){
            boxHtml += '解析流数据错误';
            console.error(e);
        }
    }

    if(window.oPageConfig.oRoom.status !='4'){
        boxHtml = '状态: 未知<br>';
        boxHtml += '当前无法解析流数据';
    }
    window.toggleFlvUrlBox = function() {
        var flvUrlBoxBtn = document.getElementById('flv-url-box-btn');
        var flvUrlBox = document.getElementById('flv-url-box');
        if(flvUrlBox.style.display==='none'){
            flvUrlBox.style.display='block';
        }else{
            flvUrlBox.style.display='none';
        }
    }
    window.copyFlvUrl = function(index) {
        var input = document.getElementById('flv-url-'+index);
        input.select();
        document.execCommand("Copy");
    }
    window.openFlvUrl = function(index) {
        var input = document.getElementById('flv-url-'+index);
        var url = input.value;
        location.href = "vlc://"+url
    }
    var wrapper = document.createElement("div");
    wrapper.style.display = 'inline-block';
    wrapper.innerHTML = heredoc(function(){/*
<style>
#flv-url-box-btn {
    width: 32px;
    height: 32px;
    cursor: pointer;
    background-color: #ffffff;
    top: 9px;
    right: 40px;
    position: fixed;
    z-index: 1000000;
    border-radius: 4px;
    border: 1px solid #cccccc;
}
#flv-url-box-btn:hover{
    box-shadow: 0 0 8px #0ca4d4;
}
#flv-url-box {
    top: 54px;
    right: 40px;
    border: 1px solid #808080;
    border-radius: 6px;
    background-color: #ffffff;
    padding: 8px;
    position: fixed;
    z-index: 1000000;
}
#flv-url-box .flv-url-item{
    margin: 4px 0;
}
#flv-url-box .flv-url-item>*{
    border: 1px solid #808080;
    margin-left: -1px;
    vertical-align: top;
}
#flv-url-box .flv-url-item>*:first-child{
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    margin-left: 0;
}
#flv-url-box .flv-url-item>*:last-child{
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}
#flv-url-box .flv-url-item input{
    top 0;
    width: 320px;
    height: 24px;
    padding: 0 4px;
}
#flv-url-box .flv-url-item input:focus{
    outline: none;
    border-color: #0ca4d4;
}
#flv-url-box .flv-url-item a{
    user-select: none;
    padding: 0 4px;
    cursor: pointer;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    display: inline-block;
    background-color: #ffffff;
    color: #333;
}
#flv-url-box .flv-url-item label{
    user-select: none;
    text-align: center;
    width: 60px;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    display: inline-block;
    background-color: #ffffff;
    color: #333;
}
#flv-url-box .flv-url-item a:hover{
    border-color: #0ca4d4;
    color: #0ca4d4;
}
</style>
<div>
    <img id="flv-url-box-btn" onclick="toggleFlvUrlBox()" src="data:image/png;base64,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" />
    <div id="flv-url-box" style="display: none;">__box_html__</div>
<div>
    */}).replace('__box_html__', boxHtml);

    document.body.append(wrapper);
})();