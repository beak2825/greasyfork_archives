// ==UserScript==
// @name        Tieba Sign
// @namespace   http://gera2ld.blog.163.com/
// @author      Gerald <gera2ld@163.com>
// @icon        http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version     1.3.4.6
// @description 贴吧签到
// @homepageURL http://gerald.top/code/TiebaSign
// @include     http://tieba.baidu.com/*
// @exclude     http://tieba.baidu.com/tb/*
// @require     https://greasyfork.org/scripts/144/code.user.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/122/Tieba%20Sign.user.js
// @updateURL https://update.greasyfork.org/scripts/122/Tieba%20Sign.meta.js
// ==/UserScript==

/*
 * 0: 签到成功
 * 1: 已签到
 * 2: 未开通签到
 * 3: 网络错误
 * 4: 未知错误
 */
// 模拟WAP签到
function wapSign(name, callback) {
  function error() {
    ret.err = 3;
    ret.msg = '网络错误';
    callback(ret);
  }
  var ret = {err: 4};
  $.get('/mo/?kw=' + encodeURIComponent(name) + '&ie=utf-8', function (d) {
    var s = d.match(/<(\w+) style="text-align:right;">(.*?)<\/\1>/);
    if (s) {
      if (s = s[2]) {
        var m = s.match(/<a href="(.*?)">签到<\/a>/);
        if (m)
          return $.get(m[1].replace(/&amp;/g, '&'), function (d) {
            if (m = d.match(/<span class="light">(.*?)<div/)) {
              ret.msg = m[1].replace(/<[^>]*>/g, '');
              if (/^签到成功/.test(ret.msg)) ret.err = 0;
            }
            callback(ret);
          }, 'html').fail(error);
        if (s.match(/<span >已签到<\/span>/)) {
          ret.err = 1;
          ret.msg = '已签到';
        }
      } else ret.err = 2;
    }
    callback(ret);
  }, 'html').fail(error);
}

// 普通签到
function htmlSign(n, callback) {
  function error() {
    ret.err = 3;
    ret.msg = '网络错误';
    callback(ret);
  }
  var ret = {err: 4};
  $.get('/f?kw=' + encodeURIComponent(n) + '&ie=utf-8', function (d) {
    var matches = d.match(/"is_sign_in":(\d+),"user_sign_rank":(\d+),/);
    if (matches && matches[1] == 1) {
      ret.err = 0;
      ret.msg = '签到成功，排名' + matches[2];
    } else if (matches = d.match(/PageData\.tbs = "(.*?)";/))
      return $.post('/sign/add', {
        ie: 'utf-8',
        kw: n,
        tbs: matches[1]
      }, function (res) {
        if (!res.no) {
          ret.err = 0;
          ret.msg = '签到成功，排名' + res.data.uinfo.user_sign_rank;
        } else ret.msg = res.no + ': ' + res.error;
        callback(ret);
      }, 'json').fail(error);
    callback(ret);
  }, 'html').fail(error);
}

// 访问时自动签到
function visitSign(j) {
  if (j.length && $('.focus_btn.cancel_focus').length) {  // “喜欢”才签到
    if (utils.getObj('wap', true))
      wapSign(PageData.forum.forum_name, function (d) {
        if (d.err) return;
        j.removeClass('j_cansign signstar_btn')
        .addClass('signstar_signed')
        .html(function (i, o) {
          return '<span class="sign_keep_span">WAP成功</span>' + o;
        });
        $('#signstar_wrapper').addClass('signstar_wrapper_signed sign_box_bright_signed');
      });
    else $('.j_cansign').click();
  }
}

// 从贴吧个人中心自动签到所有爱逛的贴吧
function hSign(ihome) {
  function init() {
    btnSign.prop('disabled', false);
    btnSign.html('全部签到');
  }
  function work(){
    btnSign.prop('disabled', true);
    btnSign.html('正在签到...');
    idx = 0;
    sign();
  }
  function mark(r) {
    var o = $('a.unsign[data-fid=' + forums[idx].forum_id + ']');
    if (r.err > 1) {
      if (r.err == 2) {
        r.color = 'blue';
        r.msg = '未开通签到';
      } else {
        r.color = 'red';
        r.msg = r.msg || '未知错误';
      }
    } else {
      forums[idx].is_sign = 1;
      o.removeClass('unsign').addClass('sign');
    }
    o.prop('title', r.msg);
    idx ++;
    setTimeout(sign, 1000);
  }
  function sign() {
    var o;
    while ((o = forums[idx]) && o.is_sign) idx++;
    if (!o) {
      btnSign.html('完成签到');
      return setTimeout(init, 200);
    }
    btnSign.html('正在签到...' + o.forum_name);
    (utils.getObj('wap', true) ? wapSign : htmlSign)(o.forum_name, mark);
  }
  var forums = ihome.forumGroup._forumArr;
  var btnSign = $('<button class="btn-default btn-middle" style="margin-left:8px;margin-right:8px">').appendTo('.ihome_title').click(work);
  var idx;
  $('<button class="btn-default btn-middle">').appendTo('.ihome_title').click(showOptions).html('签到设置');
  init();
}

// 设置
function showOptions(e) {
  e.stopPropagation();
  utils.popup.show({
    html:
      '<h3>设置 - 百度贴吧签到脚本</h3>' +
      '<label><input type=checkbox id=gs_wap>模拟WAP签到</label><br>' +
      '<label><input type=checkbox id=gs_sign>访问已关注的贴吧时自动签到</label><br>',
    className: 'ge_opt',
    init: function (d) {
      utils.bindProp($(d).find('#gs_wap'), 'checked', 'wap', true);
      utils.bindProp($(d).find('#gs_sign'), 'checked', 'sign', true);
    },
  });
}

if (PageData && PageData.user && PageData.user.is_login) {
  if (unsafeWindow.ihome && $('.userinfo_scores').length)
    hSign(unsafeWindow.ihome);
  else if (utils.getObj('sign', true) && !PageData.user.is_black)
    visitSign($('#sign_mod .j_cansign'));
}
