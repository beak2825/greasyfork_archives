// ==UserScript==
// @id           ctfile@405647825@qq.com
// @name         城通网盘、皮皮盘、牛盘显示正确下载地址
// @namespace    http://weibo.com/pendave
// @version      0.9.5
// @description  城通网盘、皮皮盘、牛盘显示正确下载地址!去掉遮挡的popjump透明层！自动跳到第二页！
// @author       405647825@qq.com
// @include      *ctfile.com*
// @include      *ctfile.net*
// @include      *pipipan.com*
// @include      *6pan.cc/file-*html
// @include      *666pan.cc/file-*html
// @include      *777pan.cc/file-*html
// @include      *888pan.cc/file-*html
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/446171/%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E3%80%81%E7%9A%AE%E7%9A%AE%E7%9B%98%E3%80%81%E7%89%9B%E7%9B%98%E6%98%BE%E7%A4%BA%E6%AD%A3%E7%A1%AE%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/446171/%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E3%80%81%E7%9A%AE%E7%9A%AE%E7%9B%98%E3%80%81%E7%89%9B%E7%9B%98%E6%98%BE%E7%A4%BA%E6%AD%A3%E7%A1%AE%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
//牛盘
if(location.href.match(/666pan\.cc|6pan\.cc|777pan\.cc|888pan\.cc/g) ){
        var fileCode = location.href.match(/(\d+)\./g)[0].replace('.','');
        //document.querySelector('div.file_item').childNodes[1].innerHTML += '&nbsp;<a id="free_down_link" class="color_btn btn_deep_blue txtwhite" href="http://www.777pan.cc/cd.php?file_id=' + fileCode + '" target="_blank">⇩ 直接下载</a><span>8分钟一次</span>';
        //document.querySelector('#free_down_link').click();
        location.href = 'http://www.777pan.cc/down-' + fileCode + '.html';
}
//城通网盘、皮皮盘
//第一页自动点击按钮
if(location.href.match(/ctfile\.com|pipipan\.com|ctfile\.net/g) && document.querySelector('#free_down_link')){
        document.querySelector('#free_down_link').click();
}
//有pop广告的移除
if(document.querySelector('a[href*="popjump.php"]') !== null){
        var popNode = document.querySelector('a[href*="popjump.php"]');
        popNode.remove();
}
if(document.querySelector('#infoModal') !== null){
        var popNode1 = document.querySelector('#infoModal');
        popNode1.remove();
}
if(document.querySelector('div.modal-backdrop.fade.in') !== null){
        var popNode2 = document.querySelector('div.modal-backdrop.fade.in');
        popNode2.remove();
}
document.querySelector('#page-content > hr').nextElementSibling.remove();
document.querySelector('div.row-fluid.text-center').remove();
var myArray = ["https://www.360banzou.com/sou/","https://www.mybanzou.net","https://www.medicaldupeng.com/zh/","https://medicaldupeng.com/zh/tag/%E5%8C%BB%E5%AD%A6%E6%8F%92%E7%94%BB%E5%B8%88", "https://medicaldupeng.com/zh/%E7%B2%BE%E5%BD%A9%E6%95%99%E7%A8%8B/%E7%8B%AC%E5%AE%B6%E8%AF%BE%E7%A8%8B%E3%80%90%E7%94%9F%E7%89%A9%E5%8C%BB%E5%AD%A6%E7%A7%91%E5%AD%A6%E6%8F%92%E7%94%BB%E5%9F%B9%E8%AE%AD-%E7%9F%A2%E9%87%8F%E5%9B%BE-%E9%AB%98%E8%83%BD%E7%BB%98%E5%9B%BE.html"];
var randomItem = myArray[Math.floor(Math.random()*myArray.length)];
document.querySelector('#page-content > hr').outerHTML += '<iframe style="border: 0px" src="' + randomItem + '" width="775" height="456"></iframe>';
//获取第二页里的真实下载地址 建立copy按钮
//var uid = location.href.match(/\d+/g)[0];
//var fid = location.href.match(/\d+/g)[1];
if(document.body.innerHTML.match(/uid=(\d+)\&fid=(\d+)/g)){
        var uidNfid = document.body.innerHTML.match(/uid=(\d+)\&fid=(\d+)/g)[0];
        //document.querySelector('div.pull-right').querySelector('a').href.match(/.+(uid=\d+&fid=\d+)&.+/)[1];
}
var chk = document.querySelector('#free_down_link').onclick.toString().match(/,\s'(.+)',\s/)[1];
var jsonUrl = location.href.match(/^.*\/\/[^\/]+/g)[0]+"/get_file_url.php?"+uidNfid+"&file_chk="+chk+"&verifycode=";
console.warn(jsonUrl);
GM_xmlhttpRequest({
        method: 'GET',
        url:  jsonUrl,
        headers: {
                'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
                'Accept': 'text/javascript,application/json',
        },
        onload: function(responseDetails) {
                //console.warn(responseDetails.responseText);
                var jsonData = eval('(' + responseDetails.responseText + ')');
                //console.warn(jsonData);
                var downUrl = jsonData.downurl;
                unsafeWindow.copyJsonMenu = function() {
                        GM_setClipboard(downUrl);
                };
                setTimeout(document.querySelector('#free_down_link').nextSibling.innerHTML = '<button style="position: absolute; top: 0px; right: 0px; width: 100%; height: 100%; border: unset; background: rgba(23,160,94,0.8);" onclick="copyJsonMenu();this.style.background=\'rgba(247,206,37,0.8)\';">Copy真实下载地址</button>',200);
        }
});