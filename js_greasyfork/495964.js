// ==UserScript==
// @name         航发商城-我的全网比价单-助手
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  航发商城-我的全网比价单-打开明细不能打开新的窗口问题，点击行
//                （不要点击前后明细链接，点击行中间即可在新窗口打开明细）
// @author       T.M.H
// @match        https://trade.aecc-mall.com/supMall/marketInquiry/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aecc-mall.com
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @run-at document-end
// @license      @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495964/%E8%88%AA%E5%8F%91%E5%95%86%E5%9F%8E-%E6%88%91%E7%9A%84%E5%85%A8%E7%BD%91%E6%AF%94%E4%BB%B7%E5%8D%95-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495964/%E8%88%AA%E5%8F%91%E5%95%86%E5%9F%8E-%E6%88%91%E7%9A%84%E5%85%A8%E7%BD%91%E6%AF%94%E4%BB%B7%E5%8D%95-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


setTimeout(function(){
$('div.hasLayout table.el-table__body tbody tr').each(function() {
  var firstCell = $(this).find('td:first');
  $(this).click(function(){
  var newWindow = window.open('https://trade.aecc-mall.com/supMall/marketInquiry/detail?askSheetCode='+firstCell.text()+'&answerStatus&isAskSheetDetail=true');
  })
});
}, 2000)