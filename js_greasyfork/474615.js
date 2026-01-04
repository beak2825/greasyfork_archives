// ==UserScript==
// @name         一个草率的V2EX右边栏签到UI
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  网站右侧显示签到UI, 无需跳转签到页签到
// @author       echo
// @match        *://*.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/474615/%E4%B8%80%E4%B8%AA%E8%8D%89%E7%8E%87%E7%9A%84V2EX%E5%8F%B3%E8%BE%B9%E6%A0%8F%E7%AD%BE%E5%88%B0UI.user.js
// @updateURL https://update.greasyfork.org/scripts/474615/%E4%B8%80%E4%B8%AA%E8%8D%89%E7%8E%87%E7%9A%84V2EX%E5%8F%B3%E8%BE%B9%E6%A0%8F%E7%AD%BE%E5%88%B0UI.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var $ = window.jQuery;
  $(function () {
    let xhr, div;
    xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
      let cnt = new RegExp("<body>.*<\/body>", "is").exec(xhr.response);
      div = $('<div></div>');
      div.html(cnt);
      let signin = div.find('.site-nav .tools a[href="/signin"]');
      if (!signin.length == 0) return;
      if (window.location.pathname == '/mission/daily') return;
      let position = $('#Rightbar .box:eq(0) .cell:eq(2)');
      if (position.length == 0) return;
      let code = "";
      let url = "";
      let before = { txt: '签&ensp;&ensp;&ensp;到', c1: '#9EEB80', c2: '#90CC78' };
      let after = { txt: '今日已签到', c1: '#EBA380', c2: '#EBA380' };
      let bar = $(`<div class="cell" style="">
              <div cellpadding="0" cellspacing="0" border="0" width="100%" style="text-shadow:0.5px 0.5px 2px #fff;background-color:#ffffffff;padding: 4px;text-align: center;"><a href="#" style="
              color:#666;font-weight:bold;display: block;width: 100%;height: 100%;text-decoration: none;
              user-select:none"></a></div></div>`);
      let aFather = bar.children();
      let a = aFather.children();
      position.after(bar);
      xhr = new XMLHttpRequest();
      xhr.onload = function (e) {
        let cnt = new RegExp("<body>.*<\/body>", "is").exec(xhr.response);
        div.html(cnt);
        let btn = div.find('#Main input');
        if (btn.length == 0 || btn.val() == "查看我的账户余额") { refresh(after); stopA(); return; } else { refresh(before); }
        let txt = btn.attr('onclick');
        code = new RegExp("(?<=once=)\\d{5}").exec(txt)[0];
        url = `/mission/daily/redeem?once=${code}`;
        a.one('click', function (e) { $.get(url, function (rs) { refresh(after) }); setTimeout(() => { stopA(); }, 10); });
      }
      xhr.open('get', '/mission/daily');
      xhr.send();
      //刷新按钮状态
      function refresh(stat) {
        a.html(stat.txt);
        log(stat.txt);
        aFather.css('backgroundColor', stat.c1);
        aFather.hover(function () { $(this).css('backgroundColor', stat.c2) }, function () { $(this).css('backgroundColor', stat.c1) });
      }
      //禁用签到链接
      function stopA() {
        a.attr('href', '/mission/daily');
      }
    }
    xhr.open('get', window.location.origin);
    xhr.send();
    //日志
    function log(message, type) {
      const tag = "%cV2EX 签到%c ";
      const style = "background: #44605C; color: white; padding: 3px 3px 2px 3px; border-radius: 3px;font-size:11px;font-weight:bold;"
      if (type == 'error') console.error(tag + message, style, 'font-size:11px;');
      else console.log('' + tag + message, style, 'font-size:11px;');
    }
  });
})();