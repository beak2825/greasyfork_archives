// ==UserScript==
// @name         重庆干部网络学院-视频自动播放-测试版（有可能失效）
// @namespace    代刷：shuake345
// @version      0.1
// @description  2倍速-自动播放||需要+++代刷：shuake345
// @author       代刷：shuake345
// @include      *://cqgj.12371.gov.cn/*
// @match        *://cqgj.12371.gov.cn/#/play/play?Id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478603/%E9%87%8D%E5%BA%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%88%E6%9C%89%E5%8F%AF%E8%83%BD%E5%A4%B1%E6%95%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/478603/%E9%87%8D%E5%BA%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%88%E6%9C%89%E5%8F%AF%E8%83%BD%E5%A4%B1%E6%95%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function sx(){
    window.location.reload()
    }
    
    function gb(){window.close()}
   
function bf(){
    document.getElementsByTagName('video')[0].play()
    //document.getElementsByTagName('video')[0].playbackRate=2
    if(document.getElementsByClassName('jw-current-time')[0].innerText==document.getElementsByClassName('jw-duration')[0].innerText){
   // setTimeout(gb,19000)
    }
}
    setInterval(bf,5000)
    
window.onload=function zhuye(){
    var sl=window.sessionStorage
    if(document.URL.search('trainingClass')>0){
        for (var i =0;i<document.getElementsByClassName('progress').length;i++){
        if(document.getElementsByClassName('progress')[i].innerText!=="100.0%"){
            if(i!=Number(sl.getItem('key'))){
            sl.setItem('key',i)
            document.querySelectorAll('div.list2>a')[i].click()
            }
            break;
        }
        }
        var wancshu=
    setTimeout(sx,150000)
    }
}

})();