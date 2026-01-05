// ==UserScript==
// @name        jiracalc
// @name:ru     jiracalc
// @namespace   jc
// @description atlassian jira storypoint calculator
// @description:ru калькулятор сторипоинтов для atlassian jira
// @include     https://digipro.atlassian.net/issues/*
// @version     1.1
// @grant       none
// @author   v0rbes@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/19924/jiracalc.user.js
// @updateURL https://update.greasyfork.org/scripts/19924/jiracalc.meta.js
// ==/UserScript==
function jiracalc()
{
  if ($('.customfield_10005').size() > 0)
  {
    var sum = [];
    
    $('.customfield_10005').each(function (i, elm)
    {
      var el = $(elm);
      if (el.text() !== '') 
      {
        var com = el.parent().find('.components').text();
        if (com) com = com.trim();
        if (com != '')
        {
          if (isNaN(sum[com])) sum[com] = 0;
          sum[com] += parseFloat(el.text());
        }
      }
    });
    var msg = '';
    for (var prop in sum)
    {
      msg += '<b>' + prop + ':</b> ' + sum[prop] + ' ';
    }
    if (!$('.jiracalc').size()) $('.aui-item:eq(0)').append('<div class=\'jiracalc\' style=\'font-size: 16px; width: 100%; text-align: center; margin: 10px\'>calllllc</div>');
    $('.jiracalc').html(msg);
  }
}
setInterval(jiracalc, 2000);