// ==UserScript==
// @name         抖音视频下载
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-03-14
// @description  网页版抖音视频下载
// @author       You
// @match        https://www.douyin.com/*
// @match        https://www.douyin.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://unpkg.com/layui@2.9.7/dist/layui.js
// @downloadURL https://update.greasyfork.org/scripts/489825/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/489825/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('进入抖音视频下载-沙福林特供版-----------开始');


    // 引入第三方CSS,使用文档参考
    var link = document.createElement('link');
    link.id='layuiCss';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/layui@2.9.7/dist/css/layui.css'; // 替换为你要引入的CSS文件的URL
    document.head.appendChild(link);

    // 下载服务器的MP3文件
    function downloadMp4(filePath,fileName){
        console.log('进入抖音视频下载-沙福林特供版-----------开始下载视频')
        console.log(`视频名 ${fileName}，视频地址 ${filePath}`);
        fetch(filePath).then(res => res.blob()).then(blob => {
            const a = document.createElement('a');
            document.body.appendChild(a)
            a.style.display = 'none'
            // 使用获取到的blob对象创建的url
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            // 指定下载的文件名
            a.download = fileName;
            a.click();
            document.body.removeChild(a)
            // 移除blob对象的url
            window.URL.revokeObjectURL(url);
        });
    }
    var $div = $('<div id="alDownload">下载</div>');
    $div.css({
        fontSize:'3em',
        position: "fixed",
        left: 0,
        bottom: 0,
        padding: '20px',
        backgroundColor: 'yellow',
        cursor: 'pointer',
        zIndex: 9999
    });
    console.log('进入抖音视频下载-沙福林特供版-----------创建下载按钮',$div[0])
    document.body.appendChild($div[0])
    // 添加一个样式文件
    // 添加点击事件，下载视频
    $div.click(function(event){
        var source = document.querySelector("[data-xgplayerid] video>source");
        var filePath = source.src;
        console.log(`获取到视频地址 ${filePath}`);
        // 获取视频名
        var fileName = $(".j5WZzJdp:eq(0) span>span>span>span").html();
        if(window.location.href.indexOf('video')){
            // 说明是从首页直接观看的，因此视频名需要重新获取，这个还不太好拿，先用时间戳代替
            fileName = `${new Date().getTime()}.mp4`;
        }
        console.log(`获取到视频名 ${fileName}`);
        layer.msg('操作成功，正在进行下载，请稍后在浏览器下载列表查看')
        downloadMp4(filePath,fileName)
        event.stopPropagation();
    });
})();