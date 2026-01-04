// ==UserScript==
// @name         NNXY_LOGIN
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto login
// @author       You
// @match        *://jw.nnxy.cn
// @match        *://jw.nnxy.cn/*
// @match        http://jw.nnxy.cn/*
// @icon         https://files.catbox.moe/shi41x.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466483/NNXY_LOGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/466483/NNXY_LOGIN.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
let username = ''; // 用户名
let password = ''; // 密码
let autoLogin = false; // 是否自动登录

(function () {
  'use strict';

  if (username == '' && password == '') {
    alert('首次使用需要自行在脚本代码中添加用户名和密码');
    return false;
  }

  if ($('.dlti').text() == '用户登录') {
    $('#userAccount').val(username);
    $('#userPassword').val(password);
    let cookie = document.cookie.split('=')[1];
    let img = $('#SafeCodeImg').attr('src');
    let imgUrl = `${window.location.origin}${img}`;

    // 创建一个新的 <div> 元素，用作遮罩层
    var overlay = $('<div></div>');

    // 设置遮罩层样式为半透明黑色背景
    overlay.css({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    });

    // 创建一个新的 <div> 元素，用于显示文本
    var textContainer = $('<div>正在玩命获取验证码中...</div>');

    // 将文本容器样式设置为绝对定位，并在水平和垂直方向上居中
    textContainer.css({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '2rem',
      color: '#fff',
    });

    // 将文本容器添加到遮罩层中
    overlay.append(textContainer);

    // 将遮罩层添加到页面中
    $('body').append(overlay);

    $.ajax({
      type: 'POST',
      url: 'https://cn.923333.xyz/getImageCode',
      data: {
        id: username,
        image_link: imgUrl,
        cookie: cookie,
      },
      success: function (data) {
        if (data.status) {
          overlay.hide();
          $('#RANDOMCODE').val(data.code);
          if (autoLogin) {
            $('#btnSubmit').click();
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
      },
    });
  } else {
  }
})();