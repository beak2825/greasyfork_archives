// ==UserScript==
// @name            中建网络学院_2023年学分版_代刷加：vx:shuake345
// @description	    只对学分类课程有效|自动切换|自动看课|代刷加：vx:shuake345
// @author          vx:shuake345
// @namespace      代刷网课vx:shuake345
// @version         0.1
// @include         http://e-cscec.zhixueyun.com*
// @include         https://e-cscec.zhixueyun.com*
// @noframes
// @encoding        utf-8
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/479908/%E4%B8%AD%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_2023%E5%B9%B4%E5%AD%A6%E5%88%86%E7%89%88_%E4%BB%A3%E5%88%B7%E5%8A%A0%EF%BC%9Avx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/479908/%E4%B8%AD%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_2023%E5%B9%B4%E5%AD%A6%E5%88%86%E7%89%88_%E4%BB%A3%E5%88%B7%E5%8A%A0%EF%BC%9Avx%3Ashuake345.meta.js
// ==/UserScript==


(function() {
    'use strict';
 //console.log('ceshi')
    // Your code here...
    var n=0

    //刷新
    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        console.log('隐藏');
        //window.close()
    } else if (document.visibilityState == "visible") {
        console.log('显示')
        if(document.URL.search('train-new/class-detail/')>1){setTimeout(sx,1000)}
    }
});
    function sx(){
        if(document.URL.search('train-new/class-detail/')>20){
        window.location.reload()
        }
    }
            //setInterval(sx,370000)

    function jxbf(){
    if(document.getElementsByClassName('btn-ok btn').length>0){
    document.getElementsByClassName('btn-ok btn')[0].click()
        console.log('点击成功')
    };
    if(document.getElementsByClassName('btn')[0].innerText=="继续学习"){
       window.close()
       }
    if(document.getElementsByClassName('iconfont icon-reload').length==document.getElementsByClassName('chapter-list-box required').length && document.getElementsByClassName('iconfont icon-reload').length!==0){
       window.close()
       }
   if(document.getElementsByClassName('item pointer item22')[document.getElementsByClassName('item pointer item22').length-1].innerText=="已完成"){
    window.close() //第一个视频是完成，就关闭视频，多小节视频需要关闭此处
    }
       };
setInterval(jxbf, 15000);



    function wwc1(){
        let x = document.getElementsByClassName('ms-train-state')
        var xuepoint=document.getElementsByClassName('t-course-hour')//学分为1，学时为0
        for(var i = 0;i < x.length;i++ ){
            var xuefen=document.getElementsByClassName('t-course-hour')[i*2+1].innerText.search('-')
            var xueshi=document.getElementsByClassName('t-course-hour')[i*2].innerText.search('-')
        if(x[i].innerText=="未完成" && xuefen<0){
            document.getElementsByClassName('m-bottom row-title-a pointer')[i].click()
            clearInterval(wwwc1)
            break;
        }else if(i==x.length-1){
            if(document.getElementsByClassName('load-more pointer').length>0){
                document.getElementsByClassName('load-more pointer')[0].click()
             setTimeout(wwwc1,2000)
            }else{
                document.getElementsByClassName('pointer iconfont icon-triangle-down')[n].click()
                n=n+1
             console.log('点击成功')
            setTimeout(wwwc1,5000)
            }
        }
        };
    };
    var wwwc1 = setInterval(wwc1,5000)
    //已完成的跳过
    function ywc(){
        if(document.URL.search('study/course/detail/')>2){
        let y = document.getElementsByClassName('item pointer')
        if(y.length>0){
       for(var i = 0;i < y.length;i++ ){
        if(y[i].innerText=="未开始"){
        y[i].click()
        console.log('1未开始')
             clearInterval(ywc1)
        break;
        }else if(y[i].innerText=="学习中"){
        //y[i].click()
        console.log('1学习中')
        break;
        };
       };
        }}
       };
    var ywc1=setInterval( ywc, 10000);
    function bf(){
     document.getElementsByTagName('video')[0].play()
        /*if(document.getElementsByClassName('chapter-list-box required focus').length==1){
        if(document.getElementsByClassName('chapter-list-box required focus ')[0].querySelectorAll('div.section-item.section-item11>div>span')[1].innerText=='已完成'){
                    如果有客户，学了很多学习中的。就要用到这个了
        }
        }*/
        document.getElementsByClassName('chapter-list-box required focus ')[0].querySelectorAll('div.section-item.section-item11>div>span')[1].innerText
    }
    setInterval( ywc, 13000);
})();