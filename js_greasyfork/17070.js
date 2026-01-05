// ==UserScript==
// @name CL1024- only show
// @namespace CL1024-only show
// @version 1.0
// @description CL1024-only show
// @require http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @include http://*
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/17070/CL1024-%20only%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/17070/CL1024-%20only%20show.meta.js
// ==/UserScript==
(function () {
  if (document.title.indexOf('草榴') != - 1) {
    //
    if (window.location.href.indexOf('thread0806.php?fid=2') != - 1   //亞洲無碼原創區
        || window.location.href.indexOf('thread0806.php?fid=15') != - 1 ) { //亞洲有碼原創區
      
      $('td > a.bl').each(function () {
        var thiz = $(this);
        var html = thiz.html();
        var thiz_id = thiz.attr('id');
        
        //按人过滤
        if (html != '第六天魔王' && html != 'arsenal-fan') {
          $(this).parent().parent().remove();
        }
        
      });
    }
  }
}) ();
//allow pasting
