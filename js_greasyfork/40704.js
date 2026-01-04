// ==UserScript==
// @name         QRT_AUTO_COMPLATE_SMSCODE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://10.0.0.80:8280/qrt-web-boss/apply/bindBankCard*
// @match        http://10.0.0.80:8280/qrt-web-boss/order/repay*
// @match        http://10.0.0.80:8280/qrt-web-boss/order/loan*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40704/QRT_AUTO_COMPLATE_SMSCODE.user.js
// @updateURL https://update.greasyfork.org/scripts/40704/QRT_AUTO_COMPLATE_SMSCODE.meta.js
// ==/UserScript==

;(function($) {
    'use strict';
    $(function(){
        // @require http://10.0.0.80:8280/qrt-web-boss/static/js/jquery.min.js
        var $smsCodeInput = $("input[name='smsCode']"),url='http://10.0.0.80:8280/qrt-web-boss/test/getLastSmsCode';
        if ($smsCodeInput.size() > 0) {
          var hrefUrl = window.location.href,btnCss="cursor: pointer;font-size: 1.2em;position:fixed;top:0px;right:0px;z-index: 99;border: 1px solid #3494fb;border-radius: 2px;background-color: #3494fb;color: white;";

          $('body').append('<button id="getSmsCodeBtn" style="'+btnCss+'">获取验证码</button>');
          $(document).on('click', '#getSmsCodeBtn', function(){
              var hrefUrl = window.location.href,smsKeyCode = '';

              if (hrefUrl.indexOf('bindBankCard') >= 0 ) {
                  smsKeyCode = 'bind_bank_card_smscode';
              } else if (hrefUrl.indexOf('order/loan') >= 0 ) {
                  smsKeyCode = 'loan_smscode';
              } else if (hrefUrl.indexOf('order/repay') >= 0 ) {
                  smsKeyCode = 'repay_smscode';
              }
              $('#getSmsCodeBtn').text('正在查询...');
              $.getJSON(url, {'smsKey' : smsKeyCode}, function(result){
                  if (result != null && result.code == 'SUCCESS' && result.data != null) {
                      $('#getSmsCodeBtn').text('获取验证码');
                      $smsCodeInput.val(result.data.substr(0, 6));
                  } else {
                      $('#getSmsCodeBtn').text('查询失败');
                  }
              });
          });
        }
    });
})(jQuery);