// ==UserScript==
// @name         有道文档翻译导出
// @namespace    http://pan.alonealone.com/
// @version      0.1.3
// @description  有道文档翻译预览页面图片批量下载，存到本地方便合成pdf。
// @author       Alone & mapl
// @match        *://*.youdao.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419495/%E6%9C%89%E9%81%93%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/419495/%E6%9C%89%E9%81%93%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
const download = (fileName, blob) => {
  const link = document.createElement("a");
  link.href = blob;
  link.download = fileName;
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};


function download2(fileName,url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    //带上cookie
    xhr.withCredentials = true
    // 响应类型设置为blob
    xhr.responseType = 'blob';
    // 请求成功
    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = fileName;
            // 将a标签添加到body中是为了更好的兼容性，谷歌浏览器可以不用添加
            document.body.appendChild(a);
            a.click();
            // 移除
            a.remove();
            // 释放url
            window.URL.revokeObjectURL(a.href);
        }
    });
    // 监听下载进度
    xhr.addEventListener('progress', function (e) {
        let percent = Math.trunc(e.loaded / e.total * 100);
    });
    // 错误处理
    xhr.addEventListener('error', function (e) {
        // todo
    });
    // 发送请求
    xhr.send();
}

(function() {
    'use strict';
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("id", "dl_bt");
    button.setAttribute("value", "使用脚本导出图片到本地");
    button.setAttribute("class", "check-full");
    button.style.width = "12%";
    var t = 0;
    button.addEventListener('click', function(){
        var transimgs = document.querySelector("#docTranslation").getElementsByClassName("doc-img-wrapper")
        transimgs = [...transimgs].map(e=>e.getElementsByTagName("img")[0].getAttribute("data-src"))
        transimgs.map((e, i)=>{
            setTimeout(()=>download2(document.getElementsByClassName("original-doc-name")[0].title + " - " + i + ".png" ,e), i*1000)
        })
    })
    document.getElementsByClassName("translation-title-wrap")[0].appendChild(button);
    document.getElementById("payContainer").appendChild(button);
})();