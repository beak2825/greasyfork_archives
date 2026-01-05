// ==UserScript==
// @name         Flower Password
// @name:zh-CN   花密
// @namespace    https://greasyfork.org/zh-CN/scripts/23026-flower-password
// @version      0.5.2
// @author       徐小花, Johnny Jian, xLsDg
// @description  花密 Flower Password - 可记忆的密码管理方案
// @homepageURL  https://github.com/xlsdg/flower-password-user-script
// @icon         https://cdn.jsdelivr.net/gh/xlsdg/flower-password-user-script/icon.png
// @supportURL   https://github.com/xlsdg/flower-password-user-script/issues
// @include      http://*
// @include      https://*
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/fpcode/dist/flowerpassword.umd.js
// @require      https://cdn.jsdelivr.net/npm/punycode@1.4.1/punycode.min.js
// @require      https://cdn.jsdelivr.net/gh/gorhill/publicsuffixlist.js/publicsuffixlist.min.js
// @resource     FP_STYLE https://cdn.jsdelivr.net/gh/xlsdg/flower-password-user-script/fp.min.css
// @resource     PUBLIC_SUFFIX_LIST https://publicsuffix.org/list/public_suffix_list.dat
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT License
// @encoding     utf-8
// @downloadURL https://update.greasyfork.org/scripts/23026/Flower%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/23026/Flower%20Password.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var currentField = null;

  function setupInputListeners() {
    function insideBox(e) {
      return e.parents('#flower-password-input').length > 0;
    }

    var lstPublicSuffix = GM_getResourceText('PUBLIC_SUFFIX_LIST');
    publicSuffixList.parse(lstPublicSuffix, punycode.toASCII);

    var hostname = location.hostname.toLowerCase();
    var domain = publicSuffixList.getDomain(hostname);
    var suffix = publicSuffixList.getPublicSuffix(hostname);

    $(document).on('focus', 'input:password', function () {
      if (insideBox($(this))) {
        return;
      }

      lazyInject();

      if (currentField && currentField.get(0) != this) {
        $('#flower-password-password, #flower-password-key').val('');
      }

      currentField = $(this);

      var offset = currentField.offset();
      var height = currentField.outerHeight();
      $('#flower-password-input')
        .css({
          left: offset.left + 'px',
          top: offset.top + height + 'px',
        })
        .show();

      var code = '';
      var key = domain.replace('.' + suffix, '') + code;
      $('#flower-password-key').val(key);
    });

    $(document).on('focus', 'input:not(:password)', function () {
      if (insideBox($(this))) {
        return;
      }
      $('#flower-password-input').hide();
    });
  }

  function isInjected() {
    return $('#flower-password-input').length > 0;
  }

  function lazyInject() {
    if (isInjected()) {
      return;
    }

    var style = GM_getResourceText('FP_STYLE');
    GM_addStyle(style);

    var html =
      '<div id="flower-password-input" style="display: none;">' +
      '<span id="flower-password-close" title="关闭">关闭</span>' +
      '<h1>花密 Flower Password</h1>' +
      '<label for="flower-password-password">记忆密码</label><input id="flower-password-password" name="flower-password-password" type="password" value=""/>' +
      '<br/>' +
      '<label for="flower-password-key">区分代号</label><input id="flower-password-key" name="flower-password-key" type="text" value=""/>' +
      '<p id="flower-password-hint">· 记忆密码：可选择一个简单易记的密码，用于生成其他高强度密码。<br/>· 区分代号：用于区别不同用途密码的简短代号，如淘宝账号可用“taobao”或“tb”等。<br/>· 按Enter键或Esc键关闭本窗口。<br/>· 花密官网地址：<a href="https://flowerpassword.com/" target="_blank">https://flowerpassword.com/</a></p>' +
      '</div>';
    $('body').append(html);

    var onChange = function () {
      var password = $('#flower-password-password').val();
      var key = $('#flower-password-key').val();
      var result = fpCode(password, key);
      if (result) {
        currentField.val(result);
        GM_setClipboard(result);
      }
    };

    $('#flower-password-password, #flower-password-key')
      .change(onChange)
      .keyup(onChange)
      .keyup(function (e) {
        if (e.which === 13 || e.which === 27) {
          currentField.focus();
          $('#flower-password-input').hide();
        }
      });

    $('#flower-password-close').click(function () {
      $('#flower-password-input').hide();
    });
  }

  setupInputListeners();
})();
