// ==UserScript==
// @name        隐身访问贴吧主页
// @description 隐身访问其他人的贴吧主页不留下访问记录
// @author      酷企鹅Link
// @include     http://tieba.baidu.com/home/*
// @version     1.0.3.3
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @namespace https://greasyfork.org/users/8620
// @downloadURL https://update.greasyfork.org/scripts/14958/%E9%9A%90%E8%BA%AB%E8%AE%BF%E9%97%AE%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/14958/%E9%9A%90%E8%BA%AB%E8%AE%BF%E9%97%AE%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==
(function () {
  gd_cltb(0);
  function gd_cltb(gd_n) {
    if (!gd_getReqString('un')) return;
    var gd_un = document.querySelector('.userinfo_username').innerHTML;
    if (!gd_un) return;
    if (unsafeWindow && unsafeWindow.PageData && unsafeWindow.PageData.tbs) {
      var gd_tbs = unsafeWindow.PageData.tbs;
    } else {
      gd_n++;
      if (gd_n > 20) return;
      setTimeout(function () {
        gd_cltb(gd_n)
      }, 600);
      return;
    }
    console.log(gd_un, gd_tbs);
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://tieba.baidu.com/home/post/delvisite',
      data: 'ie=utf-8&tbs=' + gd_tbs + '&un=' + gd_un,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      onload: function (response) {
        console.log(response);
        if (response.responseText.indexOf('\\u6210\\u529f') != - 1) document.querySelector('div[class="right_aside"]>div[class="ihome_aside_section ihome_visitor "]>h1[class="ihome_aside_title"]').innerHTML = document.querySelector('div[class="right_aside"]>div[class="ihome_aside_section ihome_visitor "]>h1[class="ihome_aside_title"]').innerHTML + '<font color=red> (已清除记录)</font>'
      }
    });
  }
  function gd_getReqString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var Req = window.location.search.substr(1).match(reg);
    if (Req) return Req[2];
    return null;
  }
}) ()
