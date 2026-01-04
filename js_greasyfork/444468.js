// ==UserScript==
// @name         爱剑三·估价
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  爱剑三的估价脚本
// @author       枕月
// @match        https://www.aijx3.com/account/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aijx3.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444468/%E7%88%B1%E5%89%91%E4%B8%89%C2%B7%E4%BC%B0%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/444468/%E7%88%B1%E5%89%91%E4%B8%89%C2%B7%E4%BC%B0%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function gujia() {
        if($('.account201Wrap').length !== 0) {
            $('.accountmain3b1_rt a').text(function(i, text) {
            $.post('https://www.aijx3.com/api/web/dispath', {ver: '1.0', method: 'guji.compute.account', valueType: 2, replyContent: text, token: $.cookie("token") }, function(res) {
                let json = JSON.parse(res)
                $('.accountmain3b1_rb').eq(i).children('ul').prepend('<li><h2><a>系统估价: ' + json.data.priceNum + '</a></h2></li>')
            })
        })
      } else {
          $('.text_centacc table tbody tr').append('<td width="150" class="text_cent_td"><span>估价</span></td>')
          let info = $('.text_cenb table tr')
          console.log(info.children('td a'))
      }
    }

    $('.accout10bb').append('<div class="accout10bb1x" id="gujia"><input type="button" value="点击估价"></div>')
    $('#gujia').click(gujia)
    $('.account20Wrap').remove()
})();