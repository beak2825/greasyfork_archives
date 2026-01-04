// ==UserScript==
// @name      百度搜索自动跳转谷歌搜索
// @namespace  hanero.club
// @author    HaneRo
// @version    0.0.1
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @description 自动从百度跳转到谷歌，可能有数秒延迟。
// @downloadURL https://update.greasyfork.org/scripts/386249/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/386249/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==



        function baiduswitchgoogle() {
                    window.open("https://www.google.com/ncr?gws_rd=ssl#newwindow=1&q=" + $('#kw') .val(), "_self");
        }
        if(window.location.search.lastIndexOf("wd=")>0 || window.location.search.lastIndexOf("word=")>0){
            baiduswitchgoogle();
        }
function loadJs(sid,jsurl,callback){
    var nodeHead = document.getElementsByTagName('head')[0];
    var nodeScript = null;
    if(document.getElementById(sid) === null){
        nodeScript = document.createElement('script');
        nodeScript.setAttribute('type', 'text/javascript');
        nodeScript.setAttribute('src', jsurl);
        nodeScript.setAttribute('id',sid);
        if (callback !== null) {
            nodeScript.onload = nodeScript.onreadystatechange = function(){
                if (nodeScript.ready) {
                    return false;
                }
                if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                    nodeScript.ready = true;
                    callback();
                }
            };
        }
        nodeHead.appendChild(nodeScript);
    } else {
        if(callback !== null){
            callback();
        }
    }
}