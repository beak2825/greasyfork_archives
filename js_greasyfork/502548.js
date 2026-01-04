// ==UserScript==
// @name          GetImageFrombilibiliComments
// @namespace     https://greasyfork.org/zh-CN/scripts/502548-getimagefrombilibilicomments
// @version       1.0.0
// @description   便捷地从b站评论区下载图片
// @author         ouyu69
// @include      *://www.bilibili.com/video/*
// @include      *bilibili.com/video/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502548/GetImageFrombilibiliComments.user.js
// @updateURL https://update.greasyfork.org/scripts/502548/GetImageFrombilibiliComments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(getImageElements,5000) ;
})(); //(function(){})() 表示该函数立即执行

function getImageElements() {//寻找目标函数
    const biliComments = document.querySelector("bili-comments");
    if (biliComments) {
        // console.log("biliComments OK");
        const shadowRoot1 = biliComments.shadowRoot;
        if (shadowRoot1) {
            const biliCommentThreadRenderers = shadowRoot1.querySelectorAll("bili-comment-thread-renderer");
            Array.from(biliCommentThreadRenderers).forEach(biliCommentThreadRenderer => {
                const shadowRoot2 = biliCommentThreadRenderer.shadowRoot;
                if (shadowRoot2) {
                    const comments = shadowRoot2.querySelectorAll("#comment");
                    Array.from(comments).forEach(comment => {
                        const shadowRoot3 = comment.shadowRoot;
                        if (shadowRoot3) {
                            const pics = shadowRoot3.querySelectorAll("#pic > bili-comment-pictures-renderer");
                            Array.from(pics).forEach(pic => {
                                const shadowRoot4 = pic.shadowRoot;
                                if (shadowRoot4) {
                                    const imgs = shadowRoot4.querySelectorAll("#content > img");
                                    // console.log("All OK");
                                    Array.from(imgs).forEach(img => {
                                        // console.log("找到了目标元素" + img.getAttribute("src"));
                                        const existButton = img.nextElementSibling;
                                        if(!existButton || !existButton.classList.contains('download-button-class'))addDownloadButton(img);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }else{
        // console.log("biliComments cant find") ;
    }
}
function addDownloadButton(img) {
    const button = document.createElement("button");
    button.classList.add('download-button-class'); // 添加一个类以便后续检查
    button.textContent = "download";
    button.style.backgroundColor = "skyblue"
    button.style.color= "white" ;
    button.style.height= "20px" ;
    button.style.borderRadius= "10px" ;
    button.style.marginLeft = "10px";
    button.onclick = () => {
        const url = "https:" + img.getAttribute('src').split('@')[0];
        const fileName = url.split("//")[1].split("/")[3] ;
        console.log(url) ;
        console.log(fileName) ;
        downloadFile(url,fileName) ;
    };
    img.parentNode.insertBefore(button, img.nextSibling);
}
function downloadFile(url, fileName) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
}

