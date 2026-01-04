// ==UserScript==
// @name         辽宁干部在线学习网_配合软件_秒刷VX：shuake345
// @namespace    代刷VX：shuake345
// @version      0.1
// @description  需配合软件秒|代刷VX：shuake345|效果图：https://365.kdocs.cn/l/clV62keVBLZi
// @author       VX：shuake345
// @match       *://*.lngbzx.gov.cn/*
// @match       *://hebgb.gwypx.com.cn/*
// @icon         https://www.google.com/s2/favicons?domain=hebgb.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501676/%E8%BE%BD%E5%AE%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E7%BD%91_%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6_%E7%A7%92%E5%88%B7VX%EF%BC%9Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/501676/%E8%BE%BD%E5%AE%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E7%BD%91_%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6_%E7%A7%92%E5%88%B7VX%EF%BC%9Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sx(){
    if(document.URL.search('study_center')>1){
        window.location.reload()
    }
    }
    setInterval(sx,5000)
   function zy(){
       if(document.URL.search('study_center')>1){
       if(sessionStorage.getItem('key')!==document.querySelector("div > div.course_list_right > div.course_list_right_title.oneEllipsis").innerText){
            sessionStorage.setItem('key',document.querySelector("div > div.course_list_right > div.course_list_right_title.oneEllipsis").innerText)
            document.querySelector("div.Save").click()
        }
       }
   }
    setInterval(zy,2000)
    function cy(){
        if(document.URL.search('video_detail')>1){
        setTimeout(gb,35000)
        if(document.getElementsByTagName('video')[0].paused==true){
        document.getElementsByTagName('video')[0].play()
        }
    }
        }
    setInterval(cy,4000)

    function gb(){window.close()}

})();