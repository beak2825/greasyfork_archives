// ==UserScript==
// @name        美团买药首条接待自动回复
// @namespace   1933987037@qq.com
// @include     https://yiyao.meituan.com/im*
// @license MIT
// @grant       no
// @version     1.91
// @run-at      document-end
// @description 这是一个刷自动回复率的工具，如果超过指定时间，没有其他客服回复，插件会自动回复指定内容
// @require    http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/509905/%E7%BE%8E%E5%9B%A2%E4%B9%B0%E8%8D%AF%E9%A6%96%E6%9D%A1%E6%8E%A5%E5%BE%85%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/509905/%E7%BE%8E%E5%9B%A2%E4%B9%B0%E8%8D%AF%E9%A6%96%E6%9D%A1%E6%8E%A5%E5%BE%85%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
//_senderTextarea_1fjpz_67
(function () {

    var shijian=1;//当前对话回复时间默认为1
    var lee=0;
    var jd=-1;

    xh(shijian)

    //循环函数
    function xh(shijian){
        setTimeout(function(){//延迟器

            if (document.getElementsByClassName("yyfe-typography")[0].innerHTML.includes("待接待")) {
                jd=0;
            } else if(document.getElementsByClassName("yyfe-typography")[1].innerHTML.includes("待接待")){
                jd=1;
            }else if(document.getElementsByClassName("yyfe-typography")[2].innerHTML.includes("待接待")){
                jd=2;
            }else if(document.getElementsByClassName("yyfe-typography")[3].innerHTML.includes("待接待")){
                jd=3;
            }else if(document.getElementsByClassName("yyfe-typography")[4].innerHTML.includes("待接待")){
                jd=4;
            }else if(document.getElementsByClassName("yyfe-typography")[5].innerHTML.includes("待接待")){
                jd=5;
            }else{
                jd=6;
            }


             if(document.querySelector('._offlineTip_t5bo0_8') !== null){
                 jd=jd+1;
            }


             lee=document.getElementsByClassName("_sessionList_t5bo0_1")[0].children[jd].childNodes.length;

            if(lee>1){
                // 是否有即将超时
                shijian=shijian+5;
            } else {
                shijian=1;
            }

            if(shijian>40){//当时间大于*秒执行
                shijian=30;
                dj(jd);//执行点击回复函数
            }

            xh(shijian)

        },5000)


    }




    function dj(jd){

        document.getElementsByClassName("_sessionList_t5bo0_1")[0].children[jd].children[1].click();
        document.getElementsByClassName("_panelMenuItem_g8dq3_8")[3].children[1].click();
        document.getElementsByClassName("roo-accordion-panel-header")[0].click();
        document.getElementsByClassName("roo-btn roo-btn-link roo-btn-link-brand roo-btn-xs roo-btn-xs roo-btn-normal")[1].click();


    }




})();