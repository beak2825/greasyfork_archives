// ==UserScript==
// @name         淘宝宝贝详情图
// @namespace    http://tampermonkey.net/
// @version      1.97
// @description  下载淘宝宝贝详情页的5张主图和颜色图
// @author       fxm
// @license      https://www.apache.org/licenses/LICENSE-2.0
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/463969/%E6%B7%98%E5%AE%9D%E5%AE%9D%E8%B4%9D%E8%AF%A6%E6%83%85%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/463969/%E6%B7%98%E5%AE%9D%E5%AE%9D%E8%B4%9D%E8%AF%A6%E6%83%85%E5%9B%BE.meta.js
// ==/UserScript==
(() => {

    function download() {

        var protocol = "https:";
        var fmf = "_400x400.jpg";

        // 标题
        var elementById = document.getElementById("J_Title");
        var title = elementById.getElementsByClassName("tb-main-title")[0].getAttribute("data-title");
        title = title.substring(0, 15);

        // 主图
        var main_pics = document.getElementById("J_UlThumb");
        if (main_pics == null) {
            console.log("此页没有主图")
            return;
        }
        var lis = main_pics.getElementsByTagName("li");
        if (lis == null) return;
        // 待下载主图名称数组[name,url]
        var pending_download_pic_name_urls = [];
        var k = 0;
        for (let i = 0; i < lis.length; i++) {
            var picUrl = lis[i].getElementsByTagName("img")[0].getAttribute("data-src");
            if (picUrl == null) {
                continue;
            }
            var suffix = picUrl.split(".");
            var name = (i + 1) + "." + suffix[suffix.length - 1];
            var download_url = protocol + picUrl.substring(0, picUrl.length - 10);
            pending_download_pic_name_urls[k++] = [name, download_url];
        }

        // 颜色图
        var color_pics = document.getElementsByClassName("J_TSaleProp tb-img tb-clearfix")[0];
        if (color_pics == null){
            console.log("此页没有颜色图");
            return;
        }
        var color_lis = color_pics.getElementsByTagName("li");
        for (let i = 0; i < color_lis.length; i++) {
            var color_picUrl = color_lis[i].getElementsByTagName("a")[0].getAttribute("style");
            var s = color_picUrl.indexOf("/");
            var l = color_picUrl.indexOf("jpg") + 3;
            color_picUrl = protocol + color_picUrl.substring(s, l) + fmf;
            var color = color_lis[i].getElementsByTagName("a")[0].getElementsByTagName("span")[0].textContent + ".jpg";
            pending_download_pic_name_urls[k++] = [color, color_picUrl];
        }
        for (let i = 0; i < pending_download_pic_name_urls.length; i++) {
            var fileName = pending_download_pic_name_urls[i][0];
            var url = pending_download_pic_name_urls[i][1];
            getBlob(url, title + "-" + fileName);
        }

    }

    // 第一步，要先通过当前url 取得 blob 对象（必须）
    async function getBlob(url, fileName) {
        // fetch 为ES6新增，不支持IE兼容，请注意分辨
        await fetch(url)
            .then((response) => {
                return response.blob() // 转为文件流 请求类型类型 或其他类型
            })
            .then(res => {
                let blob = new Blob([res]) // 转为blob
                downloadFileName(blob, fileName) // 下载并重命名函数
            })
    }

    function downloadFileName(blob, fileName) {
        let link = document.createElement('a') // 创建a标签
        link.href = window.URL.createObjectURL(blob) // 获取blob 下载url
        link.download = fileName  // a标签新增属性  download 用于指定文件名
        link.click() // 点击下载
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
    }

    function downloadPage(){
        if (window.parent.location.href.startsWith("https://item.taobao.com")){
            // 等3秒的目的是为了加载好完整的宝贝详情页面，不知道为啥淘宝很卡，还是等等吧
            setTimeout(download, 3000);
            // 给它十秒钟下载时间，足够了吧？然后关掉页面
            setTimeout(window.close,13000)
        }
    }

    setTimeout(downloadPage,5000);

})();
