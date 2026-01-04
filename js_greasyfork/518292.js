// ==UserScript==
// @name         MGB Crawer
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  try to take over the world!
// @author       erekook
// @match        https://www.xiaohongshu.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518292/MGB%20Crawer.user.js
// @updateURL https://update.greasyfork.org/scripts/518292/MGB%20Crawer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var tagId;

    function upload(title, imageList, content) {
        // 定义请求的 URL
        var url = "http://118.25.152.68:20003/g/xhsCrawler/uploadMaterial";

        // 准备要发送的数据
        var data = JSON.stringify({
            title: title,
            imageList: imageList,
            content: content,
            tagId: tagId
        });
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: data,
            onload: function (response) {
                if (response.status === 200) {
                    console.log("成功:", response.responseText);
                    alert(response.responseText)
                } else {
                    console.error("请求失败:", response.status, response.statusText);
                    alert('爬取失败')
                }
            },
            onerror: function (error) {
                console.error("请求发生错误:", error);
            }
        });
    }
    var up = document.createElement('div')
    up.textContent = '爬取内容'
    up.style = 'width:50px;height:50px;background: #31C37B;color:#fff;border-radius: 50%;position: fixed;right:100px;top:100px;z-index:999999;text-align:center;line-height:50px;cursor:pointer;font-size:12px'
    document.body.appendChild(up)
    up.addEventListener("click", (event) => {
        crawerContent()
    });

    function crawerContent() {
        try{
            const imgList = []
            const imgSwiperList = document.getElementsByClassName('swiper-slide')
            for (var i = 0; i < imgSwiperList.length; i++ ){
                const img = imgSwiperList[i].children[0].children[0]
                imgList.push(img.src)
            }
            const detailNode = document.getElementById('detail-title')
            let title = ''
            let content = ''
            if (detailNode && detailNode.innerHTML){
                title = detailNode.innerHTML
            }
            const nodeText = document.getElementById('detail-desc').children[0]
            if (nodeText.children.length> 0){
                const contentSpan = nodeText.children[0]
                if (contentSpan.id !== 'hash-tag') {
                    content = contentSpan.innerHTML
                }
            }
            tagId = window.prompt("请输入标签id？", 72)
            upload(title, imgList, content)
        }catch(error){
            console.error(error)
        }
    }
})();