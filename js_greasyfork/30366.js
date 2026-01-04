// ==UserScript==
// @name         FuckBaidu
// @namespace    https://satori.moe/
// @version      0.2
// @description 隐藏百度搜索首页的多余元素
// @author       SatoriKomeiji
// @match        https://www.baidu.com
// @match        https://www.baidu.com/*
// @match        http://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30366/FuckBaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/30366/FuckBaidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('s_wrap').style.display="none";
    $('#kw').on('input',function(){
       $('#s_form_wrapper')[0].style.marginTop="";
       $('body')[0].style.overflow="";
       $('body')[0].style.overflow="";
    });
    document.getElementById('bottom_container').style.display="none";
    $('.mnav')[1].style.display="none";
    $('#s_form_wrapper')[0].style.marginTop=window.innerHeight/8+"px";
    $('body')[0].style.overflow="scroll";
    $('body')[0].style.overflow="hidden";
})();