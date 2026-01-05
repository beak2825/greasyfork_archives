// ==UserScript==
// @name            twitter_jian_cha
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    1.1
// @description    检查列表里的人员变动
// @include         https://twitter.com/virtualmi/lists/*
// @exclude         https://twitter.com/virtualmi/lists/*/members
// @license         WTFPL
// @run-at          document-end
// @require         https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/28862/twitter_jian_cha.user.js
// @updateURL https://update.greasyfork.org/scripts/28862/twitter_jian_cha.meta.js
// ==/UserScript==
(function () {
  //alert("xc");
  timer = setTimeout(onSub, 4000);
}) ();
function onSub() {
  //$('.global-nav-inner').css('background-color', '#FFADFC');
  var ck_ = '';
  var name_g = $('.js-list-name.u-dir').text().replace(/(^\s*)|(\s*$)/g, '') + '_';
  var name_n = $('a:contains(成员) strong').first().text();
  ck_ = $.cookie(name_g);
  //alert($('a:contains(订阅者) strong').first().text());
  if (ck_ === undefined) {
    $.cookie(name_g, name_n, {
      expires: 365
    });
  } else if (ck_ < name_n) {
    //alert($('a:contains(订阅者) strong').first().text());
    $('a:contains(订阅者) strong').first().text('[+++]');
    $('.global-nav-inner').css('background-color', '#dff6ff');
    $('.js-list-name.u-dir').click(function () {
      if (confirm('确认更新么') === true) {
        $.cookie(name_g, name_n, {
          expires: 365
        });
      }
    });
  } else if (ck_ > name_n) {
    $('a:contains(订阅者) strong').first().text('[---]');
    $('.global-nav-inner').css('background-color', '#dff6ff');
    $('.js-list-name.u-dir').click(function () {
      if (confirm('确认更新么') === true) {
        $.cookie(name_g, name_n, {
          expires: 365
        });
      }
    });
  }
}