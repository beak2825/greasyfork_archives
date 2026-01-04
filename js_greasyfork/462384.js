// ==UserScript==
// @name         xiuren
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阿斯蒂芬
// @author       You
// @license      MIT
// @match        https://www.xrmnw.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiurenb.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462384/xiuren.user.js
// @updateURL https://update.greasyfork.org/scripts/462384/xiuren.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').append('<style>.content img{ width: 30%;border:none; display:inline-block}br{    display: none;}</style>');
$('<div style="    position: fixed;    width: 140px;    height: 140px;    background: rgba(0,0,0,.5);    top: 0;">1</div>')
  .appendTo($('body'))
  .hover(function(){
    var url=window.location.href.replace('.html','');
    var s=$(this).html();
    for(var i= s;i<parseInt($(this).html())+14;i++){
        $.ajax({ type: 'get',dataType: 'html',url:url+'_'+i+'.html',
                success: function(html){
                  window.bill=$(html)
                    $(".content img").last().after($(html).find('.content img'));
                  $(".content img").css({width:'200px',display:'inline-block'})
                }})
      }
    $(this).html(parseInt($(this).html())+13)
})

    // Your code here...
})();