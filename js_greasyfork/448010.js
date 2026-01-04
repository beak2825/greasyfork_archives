// ==UserScript==
// @name         live2d看板娘全站显示
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在所有网站显示一个看板娘
// @author       FiresonZ
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448010/live2d%E7%9C%8B%E6%9D%BF%E5%A8%98%E5%85%A8%E7%AB%99%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448010/live2d%E7%9C%8B%E6%9D%BF%E5%A8%98%E5%85%A8%E7%AB%99%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://blog.firesonz.top/css/all.min.css'; //这里是CSS文件的地址
var head = document.getElementsByTagName('head')[0];
head.appendChild(link);
const live2d_path = "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/"; //live2d路径，可参照https://github.com/stevenjoezhang/live2d-widget自行搭建
//const live2d_path = "https://blog.firesonz.top/live2d/"; //备用
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;
        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}
if (screen.width >= 768) {
    Promise.all([
        loadExternalResource(live2d_path + "waifu.css", "css"),
        loadExternalResource(live2d_path + "live2d.min.js", "js"),
        loadExternalResource(live2d_path + "waifu-tips.js", "js")
    ]).then(() => {
        initWidget({
            waifuPath: live2d_path + "waifu-tips.json",
            cdnPath: "https://blog.firesonz.top/api/" //备用CDN（JsDelivr在大陆不太稳定
            //apiPath: "" //api资源路径，需要的可以参照https://github.com/fghrsh/live2d_api自行搭建
        });
    });
}
console.log('欢迎使用Live2d看板娘~');