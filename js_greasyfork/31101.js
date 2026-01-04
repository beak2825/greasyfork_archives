// ==UserScript==
// @name         bs复制key
// @namespace    http://tampermonkey.net/
// @match        https://www.bundlestars.com/en/orders/*
// @description  try to take over the world!
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/31101/bs%E5%A4%8D%E5%88%B6key.user.js
// @updateURL https://update.greasyfork.org/scripts/31101/bs%E5%A4%8D%E5%88%B6key.meta.js
// ==/UserScript==

(function () {
  var gd_btn = $('<div><a href="javascript:;" style="color:#ffd700">一键刮KEY</a>|<a href="javascript:;" style="color:#ffd700">复制key(asf格式)</a><textarea style="top:-1px;left:-1px;width:0px;height:0px;position:absolute"></textarea></div>'),
  gd_txta = gd_btn.find('textarea');

    gd_btn.find('a').eq(0).click(function () {
        $('.key-container.hidden-sm.hidden-xs div a').click();
    });
    
    gd_btn.find('a').eq(1).click(function () {
    var keystr='!redeem ';
    $('.key-reveal-copy.ng-scope div input').each(function(i,el){
    keystr+=$(el).val()+',';});
    gd_copy(keystr.slice(-1)==','?keystr.slice(0,-1):keystr);
    
    alert(keystr + '已拷贝到剪切板！');
  });
    
  $('div.well.no-round h2').after(gd_btn);
    
    function gd_copy(gd_str) {
    gd_txta.val(gd_str).select();
    document.execCommand('copy');
  }
}) ();