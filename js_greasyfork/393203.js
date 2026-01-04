// ==UserScript==
// @name         avyu36clearad
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  clear ad
// @author       leilight
// @match        http://*.avyu36.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393203/avyu36clearad.user.js
// @updateURL https://update.greasyfork.org/scripts/393203/avyu36clearad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.wrap.mt20.clearfix,.nextpage,#rightdiv,.nav_menu.clearfix:gt(5),.nav_bar,.top-banner.clearfix').hide();
    $('#rightdiv').next().hide();
    $('#header_box').appendTo('body');
    $('#key').height(30);
    
    $('body>section').siblings().hide();
    $('#top_box').remove();
    $('.classlist_con:gt(5)').remove();
    $('section.classlist').appendTo($('body'));
    $('body>section.wrapper').css('padding-bottom',0);
    setInterval(function(){
        if($('div[id*=ABIOPAGDF]').length){
            for(var i = 0; i < 9999; i++) {
            clearInterval(i)
        }
        $('[id*=ABIOPAGDF]').remove();
        }
        
    },1000);
    $('.pic img').height('auto');
})();