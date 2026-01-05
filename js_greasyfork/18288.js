// ==UserScript==
// @namespace         https://github.com/JackieZheng

// @name              百度搜索广告清理助手
// @name:en           Remove Baidu Search Side AD
// @name:zh           百度搜索广告清理助手
// @name:zh-CN        百度搜索广告清理助手

// @description       移除百度搜索的广告如搜索结果里的百度推广
// @description:en    Remove Baidu search advertising 
// @name:zh           移除百度搜索的广告如搜索结果里的百度推广
// @name:zh-CN        移除百度搜索的广告如搜索结果里的百度推广

// @homepageURL       https://github.com/JackieZheng/remove-baidu-search-ad/
// @supportURL        https://github.com/JackieZheng/remove-baidu-search-ad/issues/

// @compatible        chrome 67.0.3381.1 + TamperMonkey + 脚本 0.2.0 测试通过
// @compatible        firefox 未测试
// @compatible        opera 未测试
// @compatible        safari 未测试

// @author            Jackie
// @version           0.2.6
// @license           LGPLv3

// @match             http://www.baidu.com/s*
// @match             https://www.baidu.com/s*
// @grant             none
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/18288/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/18288/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
'use strict';

function clearBaiduSearchAD () {
    // 移除网页右边的推广
    var div = document.getElementById("ec_im_container");
    if (div) {
        div.parentNode.removeChild(div);
    }

    // 移除搜索结果头部与尾部的推广
    Array.prototype.forEach.call(document.body.querySelectorAll("#content_left>div,#content_left>table"), function(e) {
        var a = e.getAttribute("style");
        if (a && /display:(table|block)\s!important/.test(a)) {
            e.parentNode.removeChild(e);
        }
    });  
    // 移除搜索结果头部 shadow-root
    Array.prototype.forEach.call(document.body.querySelectorAll(".c-container /deep/ .c-container"), function(ad) {         
        if (ad) {
           ad.parentNode.removeChild(ad);
        }
    }); 
  
   // 暴力清除“广告”
    Array.prototype.forEach.call(document.body.querySelectorAll("#content_left>div>div>span"), function(e) {
        var st = e.innerText;
        var ad=e.parentNode.parentNode;
        if (st=="广告") {
            ad.parentNode.removeChild(ad);
        }
    });  
    
}

clearBaiduSearchAD();
document.getElementById("su").addEventListener('click', function() {
    setTimeout(clearBaiduSearchAD, 1000);
}, false);
document.getElementById("kw").addEventListener('keyup', function() {
   setTimeout(clearBaiduSearchAD, 1000);
}, false);
document.getElementById("container").addEventListener('DOMSubtreeModified',function(){ 
  setTimeout(clearBaiduSearchAD, 0);
},false);  
window.onload = function () {
   setTimeout(clearBaiduSearchAD, 1000);
};
window.onscroll = function(){
  setTimeout(clearBaiduSearchAD, 0);
}
document.body.onmousemove = function(){
  setTimeout(clearBaiduSearchAD, 0);
}
 
