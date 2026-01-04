// ==UserScript==
// @name         中建三局-建安营-工人端+vx:shuake345+
// @namespace    vx:shuake345
// @version      0.1
// @description  后台继续播放📺高倍数🤖自动挂机无人值守🔥继续教育🎗️远程教育🚩好医生🦄🌈🧠各种专业技术人员培训网，专技网vx:shuake345
// @author       vx:shuake345
// @match        *://*.jay-training.com/*
// @icon         https://www.jay-training.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515511/%E4%B8%AD%E5%BB%BA%E4%B8%89%E5%B1%80-%E5%BB%BA%E5%AE%89%E8%90%A5-%E5%B7%A5%E4%BA%BA%E7%AB%AF%2Bvx%3Ashuake345%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/515511/%E4%B8%AD%E5%BB%BA%E4%B8%89%E5%B1%80-%E5%BB%BA%E5%AE%89%E8%90%A5-%E5%B7%A5%E4%BA%BA%E7%AB%AF%2Bvx%3Ashuake345%2B.meta.js
// ==/UserScript==

(function() {
    var 选择= document.querySelectorAll('[value="A"]')//——————————在这里修改A B C D来修改单选题
    var 对错= document.querySelectorAll('[value="1"]')//——————————在这里修改1=正确，0=错误。来修改判断题
    //！！！！！！！！！！！！——————————————————————————————————————多选默认全选
    function ks(){
        if(document.URL.search('exam')>1){
    for (var i=0;i<选择.length;i++){
        选择[i].click()
    }
            for (let i=0;i<选择.length;i++){
        对错[i].click()
    }
        }
    }
    setTimeout(ks,2800)
    var imgs=document.querySelectorAll('[class="n-checkbox-box-wrapper"]')
    var i=0
    function duoxuan(){
 imgs[i].click()
        i++
    }
    setInterval(duoxuan,200)
})();