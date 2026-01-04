// ==UserScript==
// @name         河北干部网络学院_配合软件秒刷（无软件别下载）
// @namespace    代刷VX：shuake345
// @version      0.1
// @description  没有软件|请使用慢速版；代刷VX：shuake345
// @author       VX：shuake345
// @match       *://www.hebgb.gov.cn/*
// @match       *://hebgb.gwypx.com.cn/*
// @match       *://*.lngbzx.gov.cn/*
// @icon         https://www.google.com/s2/favicons?domain=hebgb.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501640/%E6%B2%B3%E5%8C%97%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6%E7%A7%92%E5%88%B7%EF%BC%88%E6%97%A0%E8%BD%AF%E4%BB%B6%E5%88%AB%E4%B8%8B%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501640/%E6%B2%B3%E5%8C%97%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6%E7%A7%92%E5%88%B7%EF%BC%88%E6%97%A0%E8%BD%AF%E4%BB%B6%E5%88%AB%E4%B8%8B%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sx(){
    if(document.URL.search('class_detail_course')>1){
        window.location.reload()
    }
    }
    setInterval(sx,5000)
   function zy(){
       if(document.URL.search('class_detail_course')>1){
       if(sessionStorage.getItem('key')!==document.getElementsByClassName('hoz_course_name')[0].innerText){
            sessionStorage.setItem('key',document.getElementsByClassName('hoz_course_name')[0].innerText)
            document.getElementsByClassName('hover_btn')[0].click();
        }
       }
   }
    setInterval(zy,2000)
    function cy(){
        if(document.URL.search('portal')>1){
    if(document.getElementsByClassName('user_choise').length==1){
        document.getElementsByClassName('user_choise')[0].click()
        setTimeout(gb,35000)
    }
        if(document.getElementsByTagName('video')[0].paused==true){
        document.getElementsByTagName('video')[0].play()
        }
    }
        }
    setInterval(cy,4000)

    function gb(){window.close()}

})();