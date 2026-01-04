// ==UserScript==
// @name         音视频下载工具
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202101271055
// @description  下载网页上非加密的音视频
// @author       流浪的蛊惑
// @run-at       document-end
// @match        *://*/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/420721/%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/420721/%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
function gdown(data){
    if(data.toLowerCase().indexOf("blob")>-1){
        alert("资源已加密，无法下载！");
        return false;
    }
    let gname=data.split("/");
    console.log({url:data,name:gname[gname.length-1].split("?")[0]});
    GM_download({
        url:data,
        name:gname[gname.length-1].split("?")[0],
        onerror:function(e){
            window.open(data);
        }
    });
}
(function() {
    'use strict';
    var dofind=true,gurl=null;
    setInterval(function(){
        if(dofind){
            var ga=document.getElementsByTagName("audio");
            var gv=document.getElementsByTagName("video");
            if(ga.length>0){
                gurl=ga[0].getAttribute("src");
            }
            if(gv.length>0){
                gurl=gv[0].getAttribute("src");
            }
            if(gurl!=null){
                dofind=false;
                gdown(gurl);
            }
        }
    },1000);
})();