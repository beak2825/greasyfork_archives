// ==UserScript==
// @name         网页版抖音视频下载器
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @version      2.0
// @description  插入当前视频的下载按钮
// @author       xiaofang
// @match        *://www.douyin.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @namespace    https://greasyfork.org/zh-CN/scripts/438928
// @supportURL   https://github.com/xiaofang113/GreasyFork/blob/main/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8/current_version.js
// @homepageURL  https://github.com/xiaofang113/GreasyFork/blob/main/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8/current_version.js
// @downloadURL https://update.greasyfork.org/scripts/438928/%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/438928/%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function(){
console.log("脚本启动成功");
window.onload = function(){
$("head").prepend(`
<script>
    function tishi() {
        $('.DownloadURL path').attr('style', 'fill:#00CCFF');
        // setTimeout(function(){$('.DownloadURL path').attr('style','fill:#FFFFFF');},100);
    };
    function getimgs() {
        var imgs = [];
        var result = document.evaluate('//div[@data-e2e="feed-active-video"]//*[@class="u0N5WOYm"]/div/div/img/@src', document);
        var img = result.iterateNext();
        while (img) {
            imgs.push(img.value);
            img = result.iterateNext();
        };
        return imgs;
    };
    function download1() {
        var filename = ($("div[data-e2e='feed-active-video'] div.account-name").text() + '：' + $("div[data-e2e='feed-active-video'] span.e_h_fqNj").text()).replace(/[\\/:.*?\"<>|\\n]/g, '').trim().replace(/\s+/g, '') + '-' + Math.random().toString(36).substr(2);
        var imgs = getimgs();
        if (imgs.length > 0) {
            for (var i = 0; i < imgs.length; i++) {
                imgname = filename + '-' + (i + 1).toString();
                download_PNG(imgname, imgs[i]);
            }
        } else {
            $("div[data-e2e='feed-active-video'] video").children().each(function () {
                var downloadURL = $(this).attr('src');
                console.log(downloadURL);
                if (downloadURL.length > 20) { download_MP4(downloadURL, filename + '.mp4'); tishi(); };
                return false;
            });
        }
    };
    function download_MP4(url, name) {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const a = document.createElement('a');
                const objectUrl = window.URL.createObjectURL(blob);
                a.download = name;
                a.href = objectUrl;
                a.click();
                window.URL.revokeObjectURL(objectUrl);
                a.remove();
            })
    };
    function download_PNG(name, url) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            canvas.getContext('2d').drawImage(this, 0, 0);
            var a = document.createElement('a');
            a.download = name + '.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
        };
        img.src = url;
    }
</script>
`);
$(".YwClj8rK #fullscreen_capture_feedback").next().prepend('<div class="Y58u3RjO aeP91Vml tishi1" style="display: none;">下载成功</div>');
$(".XW6jLhS3").prepend('<div class="Y58u3RjO GDIQIpUY tishi2" style="display: none;">下载成功</div>');
setInterval(function(){
    var aaa = false;
    var result = document.evaluate('//div[@data-e2e="feed-active-video"]//*[@class="OFZHdvpl immersive-player-switch-on-hide-interaction-area"]/div', document);
    var bt = result.iterateNext();
    while (aaa==false&&bt) {
        if($(bt).attr("class")=="DownloadURL"){aaa = true;break;}
        bt = result.iterateNext();
    };
    if (aaa==false){
        const targetElement = document.evaluate('//div[@data-e2e="feed-active-video"]//*[@class="OFZHdvpl immersive-player-switch-on-hide-interaction-area"]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        targetElement.insertAdjacentHTML('afterend', '<div class="DownloadURL" onclick="download1()"><div class="NRiH5zYV"><div class="pBxTZJeH Qz1xVpFH"><div class="tzVl3l7w"><svg width="49" height="35" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 30 35"><path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path></svg></div><div class="hfgGrUTS">下载</div></div></div></div>');
        aaa==true;
    };
},1000);
}
})();
