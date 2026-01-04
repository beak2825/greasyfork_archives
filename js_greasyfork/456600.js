// ==UserScript==
// @name         中国干部网络学院浦东分院_乡村振兴网上专题班
// @namespace    浩浩逆天
// @version      0.1
// @description  1倍速自动看自动切换，进入课程后点击继续学习，即可解放双手
// @author       You
// @match        *://cela.e-celap.com/dsfa/nc/pc/course/views/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-celap.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456600/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E6%B5%A6%E4%B8%9C%E5%88%86%E9%99%A2_%E4%B9%A1%E6%9D%91%E6%8C%AF%E5%85%B4%E7%BD%91%E4%B8%8A%E4%B8%93%E9%A2%98%E7%8F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/456600/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E6%B5%A6%E4%B8%9C%E5%88%86%E9%99%A2_%E4%B9%A1%E6%9D%91%E6%8C%AF%E5%85%B4%E7%BD%91%E4%B8%8A%E4%B8%93%E9%A2%98%E7%8F%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function dk(){
        var i=0
        while (i<$('.icon-zk.toggleSj').length){
        $('.icon-zk.toggleSj')[i].click()
            i++
        }
        i=0
        while(i<$('.icon-zk').length){
        $('.icon-zk')[i].click()
            i++
        }
        document.getElementById("J_headZC").innerHTML="<img style=\"width:130px; height:130px;\" src='https://img.nuannian.com/files/images/22/0921/1663766968-1460.jpg'>"
    }
    setTimeout(dk,2000)
    function pdbf(){
        var sel=document.getElementsByClassName('selConListItem kcAllow')
        var jindu=sel[0].querySelector('canvas').attributes['data-percent'].textContent
     
        if(jindu=="100"){
        if(sel[0].nextSibling.innerText==undefined){
            sel[0].parentNode.parentNode.parentNode.nextSibling.querySelector('ul>li.kcAllow').click()
        }else{
            sel[0].nextSibling.click()
        }
        }
    }
    setInterval(pdbf,5000)
    function bf(){
    if($('video')[0].paused){
    $('video')[0].play()
    }
    }
     setInterval(bf,10000)

})();