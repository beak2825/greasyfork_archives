// ==UserScript==
// @name         中安云网页版秒杀视频-代刷中安云考试-lfaqpx.zayxy.com-
// @namespace    代刷中安云考试--wx：shuake345
// @version      0.1
// @description  代刷中安云考试--wx：shuake345
// @author       wx：shuake345
// @match        *://*.zayxy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zayxy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487694/%E4%B8%AD%E5%AE%89%E4%BA%91%E7%BD%91%E9%A1%B5%E7%89%88%E7%A7%92%E6%9D%80%E8%A7%86%E9%A2%91-%E4%BB%A3%E5%88%B7%E4%B8%AD%E5%AE%89%E4%BA%91%E8%80%83%E8%AF%95-lfaqpxzayxycom-.user.js
// @updateURL https://update.greasyfork.org/scripts/487694/%E4%B8%AD%E5%AE%89%E4%BA%91%E7%BD%91%E9%A1%B5%E7%89%88%E7%A7%92%E6%9D%80%E8%A7%86%E9%A2%91-%E4%BB%A3%E5%88%B7%E4%B8%AD%E5%AE%89%E4%BA%91%E8%80%83%E8%AF%95-lfaqpxzayxycom-.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function BFye(){
        if(document.getElementsByTagName('video').length>0){
            document.getElementsByTagName('video')[0].currentTime=7200
            setTimeout(function (){
                var Curr=document.getElementsByClassName('curr')
                for (var i=0;i<Curr.length;i++){
                    if(Curr[i].className=='curr cloud'){//正在播放的curr
                        //下一个
                        Curr[i+1].querySelector('a>div>div>span').click()
                        break;
                    }

                }
            },2465)
        }else{
        document.querySelector("span.tag_r").click()
        }


    }
    setInterval(BFye,5245)

})();