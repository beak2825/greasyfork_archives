// ==UserScript==
// @name Steam Warning
// @namespace https://greasyfork.org/zh-CN/users/917529-hkai1221
// @version 0.1.0
// @author hkai1221
// @description Fake Steam Warning For Funny🤪 
// @icon https://sm.ms/image/OSoZxuT4vHMcrk8
// @match https://*.steamcommunity.com/*
// @match https://*.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/445561/Steam%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/445561/Steam%20Warning.meta.js
// ==/UserScript==
(function(){
    var styleDom = document.createElement('style');
    styleDom.innerHTML = '.header_installsteam_btn {display: inline-block !important;height: 24px;}';
    document.head.appendChild(styleDom);
    var btnDom = document.getElementsByClassName('header_installsteam_btn header_installsteam_btn_gray')[0];
    btnDom.innerHTML = '<span style="padding: 0 54px">帐户警示</span>';
	btnDom.className = 'header_installsteam_btn global_header_toggle_button yellow';
    btnDom.addEventListener('click',function(){
       console.log('拜托，steam黄信超酷的好吗');
       console.log('Come on, Steam alert banner is so cool, okay?');
       if(btnDom.className.indexOf('yellow') !== -1){
        btnDom.className = 'header_installsteam_btn global_header_toggle_button red';
       }else{
        btnDom.className = 'header_installsteam_btn global_header_toggle_button yellow';
       }
    })
})();