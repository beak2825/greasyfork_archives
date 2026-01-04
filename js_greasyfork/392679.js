// ==UserScript==
// @name 思迅商务管理系统美化
// @namespace MoeHero
// @version 0.1
// @description 商务管理系统美化
// @run-at document-end
// @match *://www2.siss.com.cn/webcrm/*
// @require https://unpkg.com/wangeditor/release/wangEditor.min.js
// @require http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392679/%E6%80%9D%E8%BF%85%E5%95%86%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/392679/%E6%80%9D%E8%BF%85%E5%95%86%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var J = jQuery.noConflict(true);

J('[type=reset]').hide();
J('title').text('');

if(location.pathname == "/webcrm/popnews.aspx") {
  var lastTitle = localStorage.getItem('lastTitle');
  var title = J('#popnews_title').text();
  if(lastTitle == null || lastTitle != title) {
    J('#popnews_close>a').on('click', () => {
      localStorage.setItem('lastTitle', title);
    });
  } else {
    window.close();
  }
}


if(location.pathname == "/webcrm/RegistAdd.aspx") {
  J('#Address').val('山东省青岛市');
  J('#ContactName').val('赵琳');
  J('#telArea').val('0532');
  J('#Telephone').val('18661701226');
  setTimeout(() => {
    J('#City').val('青岛市');
  }, 1);
}

J('#ctl00_ContentPlaceHolder1_txtpassword1').val('123456');

var textarea = [];
var textarea1 = J('textarea[name="ctl00$ContentPlaceHolder1$txtMemo"]');
var textarea2 = J('textarea[name="memo"]');
var textarea3 = J('textarea[name="ctl00$Content$Wizard1$txtContentYY"]');
var textarea4 = J('textarea[name="ctl00$Content$Wizard1$txtContentXG"]');
if (textarea1[0] != undefined) textarea.push(textarea1);
if (textarea2[0] != undefined) textarea.push(textarea2);
if (textarea3[0] != undefined) textarea.push(textarea3);
if (textarea4[0] != undefined) textarea.push(textarea4);

for (let t in textarea) {
  if(textarea[t].val() == '') {
    textarea[t].val('麻烦从***移*站点到该加密锁 谢谢');
  }
}
