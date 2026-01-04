// ==UserScript==
// @name         国家开放大学刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷课
// @author       Le_le
// @match        *lms.ouchn.cn/course/*/learning-activity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444572/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444572/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    console.log('国家开放大学刷课');
    var times=0;
    //循环
    setInterval(() => {
        //判断是否在视频页面

        if(isvideo()){
            var tm= $("video").get(0).currentTime;
            var all= $("video").get(0).duration;
            $("video").attr("muted","muted");
            $("video").get(0).play();
            $("video").get(0).playbackRate=2;
            console.log("当前时间："+tm+"/"+all);
            if(tm>=all-1){
                jumptonext();
                console.log("当前视频刷完,跳转下一个");
            }
        }else if(times>4){
            console.log("不在视频页面,准备跳转");
            times=0;
            jumptonext();
        }else{
            times++;
            console.log("第"+times+"次判断");
        }
    }, 3000);

    function jumptonext(){
        var now=location.href;
        var num=now.substr(-7);
        var text=now.substr(0,now.length-7);
        var next=parseInt(num)+1;
        var nexturl=text+next;
        location.href=nexturl;
    }
})();
function isvideo(){
    var video=$("video").get(0);
    if(video){
        return true;
    }else{
        return false;
    }
};