// ==UserScript==
// @name         网页版抖音视频下载器Aria2
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @version      1.3
// @description  点击抖音页面右侧头像下方的下载按钮即可推送至Aria2下载，确保Aria2已启用！！！
// @author       xiaofang
// @match        *://www.douyin.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @namespace    https://greasyfork.org/zh-CN/scripts/440582
// @supportURL   https://github.com/xiaofang113/GreasyFork/blob/main/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8Aria2/current_version.js
// @homepageURL  https://github.com/xiaofang113/GreasyFork/blob/main/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8Aria2/current_version.js
// @downloadURL https://update.greasyfork.org/scripts/440582/%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8Aria2.user.js
// @updateURL https://update.greasyfork.org/scripts/440582/%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8Aria2.meta.js
// ==/UserScript==

(function(){
console.log("脚本启动成功");
window.onload = function(){

//###################################修改区域###################################
var filepath='S:/';                    //视频保存目录，提前创建，确保已存在。
var aria2_url='http://127.0.0.1:6800/jsonrpc'; //默认本地Aria2，可修改远程Aria2
//##############################################################################

// $("head").prepend("<script>	var filepath='"+filepath+"';var aria2_url='"+aria2_url+"';function download_url(aria2_url,filepath,filename,file_url){var data={jsonrpc:'2.0',id:'aaa',method:'aria2.addUri',params:[[file_url],{dir:filepath,out:filename,}]};$.post(aria2_url,JSON.stringify(data),function(){$('.DownloadURL path').attr('style','fill:#00CCFF');$('.tishi1').show();$('.tishi2').show();setTimeout(function(){$('.tishi1').hide();$('.tishi2').hide();},1000);});};function download1(){$('.swiper-slide-active video').children().each(function(){var downloadURL='http:'+$(this).attr('src');var text1=$('.swiper-slide-active .account-name').text()+'：'+$('.swiper-slide-active .UCT89JiM .Nu66P_ba').text();var filename=text1.replace(/[\\/:*?\"<>|\\n]/g,'')+'---'+Math.random().toString(36).substr(2)+'.mp4';console.log(downloadURL);if(downloadURL.length>20){download_url(aria2_url,filepath,filename,downloadURL);};downloadURL='';return false;});	};function download2(){var downloadURL='http:'+$('.swiper-slide-active video').attr('src');var text4=$('.swiper-slide-active .account-name').text()+'：'+$('.swiper-slide-active .UCT89JiM .Nu66P_ba').text();var filename = text4.replace(/[\\/:*?\"<>|\\n]/g,'')+'---'+Math.random().toString(36).substr(2)+'.mp4';console.log(downloadURL);if(downloadURL.length>20){download_url(aria2_url,filepath,filename,downloadURL);};downloadURL='';};function download3(){$('.xg-video-container video').children().each(function(){var downloadURL='http:'+$(this).attr('src');var text2='@'+$('.yy223mQ8 .Nu66P_ba').first().text()+'：'+$('.z8_VexPf .Nu66P_ba').text();var filename = text2.replace(/[\\/:*?\"<>|\\n]/g,'')+'---'+Math.random().toString(36).substr(2)+'.mp4';console.log(downloadURL);if(downloadURL.length>20){download_url(aria2_url,filepath,filename,downloadURL);};downloadURL='';return false;});};function download4(){var downloadURL='http:'+$('.xg-video-container video').attr('src');var text3='@'+$('.yy223mQ8 .Nu66P_ba').first().text()+'：'+$('.z8_VexPf .Nu66P_ba').text();var filename=text3.replace(/[\\/:*?\"<>|\\n]/g,'')+'---'+Math.random().toString(36).substr(2)+'.mp4';console.log(downloadURL);if(downloadURL.length>20){download_url(aria2_url,filepath,filename,downloadURL);};downloadURL='';};</script>");
$("head").prepend(`
<script>
    var filepath = '${filepath}';
    var aria2_url = '${aria2_url}';
    function tishi() {
        $('.DownloadURL path').attr('style', 'fill:#00CCFF');
        $('.tishi1').show();
        $('.tishi2').show();
        setTimeout(function () { $('.DownloadURL path').attr('style', 'fill:#FFFFFF'); }, 500);
        setTimeout(function () { $('.tishi1').hide(); $('.tishi2').hide(); }, 1000);
    };
    function download_JPG(aria2_url, filepath, filename, imgs) {
        for (var i = 0; i < imgs.length; i++) {
            imgname = filename + '/' + (i + 1).toString() + '.jpg';
            var data = { jsonrpc: '2.0', id: 'aaa', method: 'aria2.addUri', params: [[imgs[i]], { dir: filepath, out: imgname, }] };
            $.post(aria2_url, JSON.stringify(data), function () { tishi(); });
        }
    };
    function download_MP4(aria2_url, filepath, filename, file_url) {
        var data = { jsonrpc: '2.0', id: 'aaa', method: 'aria2.addUri', params: [[file_url], { dir: filepath, out: filename, }] };
        $.post(aria2_url, JSON.stringify(data), function () { tishi(); });
    };
    function getimg1() {
        var imgs = [];
        var result = document.evaluate('//*[@class="swiper-slide ARBi5fd6 page-recommend-container swiper-slide-active"]//*[@class="swiper-slide swiper-slide-active"]/parent::div/*/div/img/@src', document);
        var img = result.iterateNext();
        while (img) {
            imgs.push(img.value);
            img = result.iterateNext();
        };
        return imgs;
    };
    function getimg2() {
        var imgs = [];
        var result = document.evaluate('/html/body/div[1]/div/div[2]/div[4]/div[3]/div/div/div[2]/div[1]/div[1]/div[1]/div/div[2]/div//*[@class="swiper-slide swiper-slide-active"]/parent::div/*/div/img/@src', document);
        var img = result.iterateNext();
        while (img) {
            imgs.push(img.value);
            img = result.iterateNext();
        };
        return imgs;
    };
    function download1() {
        var filename = $('.swiper-slide-active .account-name').text() + '：' + $('.swiper-slide-active .UCT89JiM .Nu66P_ba').text().replace(/[\\/:.*?\"<>|\\n]/g, '').trim();
        var imgs = getimg1();
        if (imgs.length > 0) {
            download_JPG(aria2_url, filepath, filename, imgs);
            tishi();
        } else {
            $('.swiper-slide-active video').children().each(function () {
                var downloadURL = 'http:' + $(this).attr('src');
                filename = filename + '---' + Math.random().toString(36).substr(2) + '.mp4';
                if (downloadURL.length > 20) { download_MP4(aria2_url, filepath, filename, downloadURL); };
                downloadURL = '';
                return false;
            });
        };
    };
    function download2() {
        var filename = $('.DWKLQwFX .account-name').text() + '：' + $('.DWKLQwFX .UCT89JiM .Nu66P_ba').text().replace(/[\\/:.*?\"<>|\\n]/g, '').trim();
        var imgs = getimg2();
        if (imgs.length > 0) {
            download_JPG(aria2_url, filepath, filename, imgs);
            tishi();
        } else {
            $('.DWKLQwFX video').children().each(function () {
                var downloadURL = 'http:' + $(this).attr('src');
                filename = filename + '---' + Math.random().toString(36).substr(2) + '.mp4';
                if (downloadURL.length > 20) { download_MP4(aria2_url, filepath, filename, downloadURL); };
                downloadURL = '';
                return false;
            });
        };
    };
    function download3() {
        $('.xg-video-container video').children().each(function () {
            var downloadURL = 'http:' + $(this).attr('src');
            var text2 = '@' + $('.yy223mQ8 .Nu66P_ba').first().text() + '：' + $('.z8_VexPf .Nu66P_ba').text();
            var filename = text2.replace(/[\\/:*?\"<>|\\n]/g, '') + '---' + Math.random().toString(36).substr(2) + '.mp4';
            if (downloadURL.length > 20) { download_MP4(aria2_url, filepath, filename, downloadURL); };
            downloadURL = '';
            return false;
        });
    };
</script>
`);
$(".fullscreen_capture").prepend('<div class="Y58u3RjO aeP91Vml tishi1" style="display: none;">下载成功</div>');
$(".XW6jLhS3").prepend('<div class="Y58u3RjO GDIQIpUY tishi2" style="display: none;">下载成功</div>');
setInterval(function(){
    var aaa = "";
    $('.swiper-slide-active .OFZHdvpl').children().each(function(){
        aaa = "true";
        var cls= $(this).attr("class");
        if (cls=="DownloadURL"){
            aaa = "false";
            return false;
        };
    });
    if (aaa=="true"){
        $('.swiper-slide-active .OFZHdvpl').children().each(function(index,element){
            if(index==0){
                $(this).after('<div class="DownloadURL" onclick="download1()"><div class="NRiH5zYV"><div class="pBxTZJeH Qz1xVpFH"><div class="tzVl3l7w"><svg width="54" height="36" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 36 36"><path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path></svg></div><div class="hfgGrUTS">下载</div></div></div></div>');
                return false;
            };
        });
    };

    var bbb = "";
    $('.UwvcKsMK').children().each(function(){
        bbb = "true";
        var cls2= $(this).attr("class");
        if (cls2=="kr4MM4DQ DownloadURL"){
            bbb = "false";
            return false;
        };
    });
    if (bbb=="true"){
        $('.UwvcKsMK').children().each(function(index,element){
            if(index==3){
                $(this).after('<div class="kr4MM4DQ DownloadURL" onclick="download3()"><svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" class="u1O5vnab eclJUOOC" viewBox="0 0 36 36"><path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path></svg><span class="Uehud9DZ">下载</span></div>');
                return false;
            };
        });
    };
    var ccc = "";
    $('.DWKLQwFX .OFZHdvpl').children().each(function(){
        ccc = "true";
        var cls= $(this).attr("class");
        if (cls=="DownloadURL"){
            ccc = "false";
            return false;
        };
    });
    if (ccc=="true"){
        $('.DWKLQwFX .OFZHdvpl').children().each(function(index,element){
            if(index==0){
                $(this).after('<div class="DownloadURL" onclick="download2()"><div class="NRiH5zYV"><div class="pBxTZJeH Qz1xVpFH"><div class="tzVl3l7w"><svg width="54" height="36" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 36 36"><path d="M23 14l-8 8-8-8h5v-12h6v12zM15 22h-15v8h30v-8h-15zM28 26h-4v-2h4v2z"></path></svg></div><div class="hfgGrUTS">下载</div></div></div></div>');
                return false;
            };
        });
    };
},1000);
}
})();
