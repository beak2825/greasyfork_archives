// ==UserScript==
// @name         精易论坛易代码变宋体
// @namespace    xiaochen
// @version      0.1.1
// @description  能让精易论坛的易语言代码变成经典的宋体
// @author       小陈
// @match        https://bbs.125.la/thread-*.html
// @match        https://bbs.125.la/forum.php?mod=viewthread&tid=*
// @icon         https://bbs.125.la/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447491/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B%E6%98%93%E4%BB%A3%E7%A0%81%E5%8F%98%E5%AE%8B%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/447491/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B%E6%98%93%E4%BB%A3%E7%A0%81%E5%8F%98%E5%AE%8B%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';//严格模式


    var es=[];
    function changeFont(el){
        let err;
    	for(var i=0,len=el.length;i<len;i++){
            try{
                var e=el[i];
                e.style.fontFamily="宋体";
                //e.style.fontFamily="新宋体";
            }catch(err){
                console.log("改变字体时错误（但是错误时继续执行）："+err.message);
            }
        }
    };
    es=document.getElementsByClassName("frame_out ebackcolor1"); //获取易代码“经典配色”的元素
    //console.log(es);
    //es=Array(es);//防止找不到es.concat而异常
    //console.log(es);
    /*
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor2")); //合并：传统绿色
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor3")); //合并：传统蓝色
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor4")); //合并：古色古香
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor5")); //合并：显明配色
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor6")); //合并：淡兰黑字
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor7")); //合并：灰色风格
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor8")); //合并：粉红风格
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor9")); //合并：绿色风格
    es=es.concat(document.getElementsByClassName("frame_out ebackcolor10"));//合并：蓝色风格
    console.log(es);
    changeFont(es);
    */
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor2"); //传统绿色
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor3"); //传统蓝色
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor4"); //古色古香
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor5"); //显明配色
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor6"); //淡兰黑字
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor7"); //灰色风格
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor8"); //粉红风格
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor9"); //绿色风格
    changeFont(es);
    es=document.getElementsByClassName("frame_out ebackcolor10");//蓝色风格
    changeFont(es);

})();