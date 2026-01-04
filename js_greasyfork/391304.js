// ==UserScript==
// @name         听歌网站净化
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  去除启动弹窗还有切换随机播放
// @author       初七
// @match        http*://music.zhuolin.wang/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391304/%E5%90%AC%E6%AD%8C%E7%BD%91%E7%AB%99%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/391304/%E5%90%AC%E6%AD%8C%E7%BD%91%E7%AB%99%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    //歌曲播放模式的class
    var loop = "btn-order";
    //广告关闭的class
    var AD = "layui-layer-close";
    //下一曲的class
    var play= "btn-next";
    //广告
    var AD2 = "layui-layer-btn1";
    //刷新
    var rec = 'login-refresh'

    setTimeout(function (){
        document.getElementsByClassName(rec)[0].click();

        document.getElementsByClassName(AD2)[0].click();

        document.getElementsByClassName(loop)[0].click();
    
        document.getElementsByClassName(play)[0].click();
   
        document.getElementsByClassName(AD)[0].click();
 
        document.getElementsByClassName(play)[0].click();
  

    }, 1000);
})();

