// ==UserScript==
// @name                openlaw裁判文书详情页json
// @namespace           https://github.com/askmiw
// @version             0.0.1
// @description         清空您发过的所有微博
// @author              askmiw
// @match               http://openlaw.cn/judgement/*
// @require             http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant               none
// @compatible         firefox 测试通过
// @compatible         chrome 测试通过
// @compatible         opera 未测试
// @compatible         safari 未测试
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/372645/openlaw%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E8%AF%A6%E6%83%85%E9%A1%B5json.user.js
// @updateURL https://update.greasyfork.org/scripts/372645/openlaw%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E8%AF%A6%E6%83%85%E9%A1%B5json.meta.js
// ==/UserScript==
/*
window.setInterval(function(){
    $('a[action-type="fl_menu"]')[0].click();
    $('a[title="删除此条微博"]')[0].click();
    $('a[action-type="ok"]')[0].click();
},500)
*/
function parse(){
    var doc = {}
    doc.title = $('h2.entry-title').text()
    doc.date = $('li.ht-kb-em-date').text()
    doc.author = $('li.ht-kb-em-author').text()
    
    alert(JSON.stringify(doc))
}
parse();