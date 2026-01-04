// ==UserScript==
// @name         安泰培训系统-秒刷vx-shuake345
// @namespace    自动看
// @version      0.1
// @description  代刷vx:shuake345
// @author       vx:shuake345
// @match        *://*.geovisearth.com/*
// @icon         https://www.google.com/s2/favicons?domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511348/%E5%AE%89%E6%B3%B0%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F-%E7%A7%92%E5%88%B7vx-shuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/511348/%E5%AE%89%E6%B3%B0%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F-%E7%A7%92%E5%88%B7vx-shuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

   //参数设置
    var closetime = 10 //自动关闭视频播放界面的时间，单位（分钟）

    //------------------------代码分割线--------------------------------

    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
    } else if (document.visibilityState == "visible") {
        if(document.URL.search('summer2022')>1){setTimeout(sx,1000)}
    }
});
    function sx(){window.location.reload()}
    function zy(){
    if(document.URL.search('summer2022')>1){

        var xxnum=document.querySelectorAll('li.clearfix')

        for (var i=0;i<xxnum.length;i++){

            var maxd=xxnum[i].querySelector('div.news_time>div>span').innerText

            console.log(maxd)
            switch (i){
                case 0:
                    if( Number(maxd)< 2){
                        xxnum[i].querySelector('a').click()
            }
        break;
    case 7 :
       if( Number(maxd)< 3){
              xxnum[i].querySelector('a').click()
            }
         break;
                default:
                    if( Number(maxd)< 1){
              xxnum[i].querySelector('a').click()
                break
            }
}
        }

    }
    }
    setTimeout(zy,15000)


    function cy(){
        if(document.URL.search('smartedu')>1){
    if(document.getElementsByClassName('btn btn-primary').length>0){
        document.getElementsByClassName('btn btn-primary')[0].click()
    }else if(document.getElementsByTagName('video').length==1){
        setTimeout(function(){window.close()},50*60000)
    }
    }
        }
    setTimeout(cy,6000)


})();