// ==UserScript==
// @name           黑名单-motianzu
// @namespace      Violentmonkey Scripts
// @author         https://www.52pojie.cn/home.php?mod=space&uid=900837
// @description    屏蔽与相应用户有关的所有内容，来源于网络（Discuz 论坛通用！）
// @description    纯修改自用
// @include        http*://*motianzu.com/*
// @grant 	   none
// @version        0.11
// @downloadURL https://update.greasyfork.org/scripts/421221/%E9%BB%91%E5%90%8D%E5%8D%95-motianzu.user.js
// @updateURL https://update.greasyfork.org/scripts/421221/%E9%BB%91%E5%90%8D%E5%8D%95-motianzu.meta.js
// ==/UserScript==
 
var ID = new Array("沈柯成志","陌上青花","layalala");    //用户名屏蔽列表  备注: 如需屏蔽多人   按照 "用户名1","用户名2" 格式
var displaymessage = true;                  //如不需要显示屏蔽提示   请将"true"改为"false"
 
for (var x in ID) {
        thread = document.evaluate('//table/tbody[tr[1]/td[2]//cite/a[text()="' + ID[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (thread.snapshotLength) {
                for (var i = 0; i < thread.snapshotLength; i++) {
                     if(displaymessage) {
                             thread.snapshotItem(i).innerHTML = "<tr><td class='icn'><img src='static/image/common/folder_common.gif' /></a></td><th class='common'><b>已屏蔽主题 " + "<font color=grey></th><td class='by'><cite><font color=grey>" + ID[x] + "</font></cite></td><td class='num'></td><td class='by'></td></tr>";
                         }
                         else {
                                 thread.snapshotItem(i).innerHTML = "";
                     }
                }
        }
        post = document.evaluate('//table/tbody[tr[1]/td[1]//a[text()="' + ID[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (post.snapshotLength) {
                for (var i = 0, c = ""; i < post.snapshotLength; i++) {
                        c = post.snapshotItem(i).firstChild.childNodes[3].textContent.replace(/\s*/g, "").slice(0, 3);
                        c = (Number(c) > 99) ? c + "#" : c;
                        if(displaymessage) {
                             post.snapshotItem(i).innerHTML = "<p><center>已屏蔽" + " <font color=grey>" + ID[x] + "</font></center></p>";
                         }
                         else {
                                 post.snapshotItem(i).innerHTML = "";
                     }
                }
        }
         quote = document.evaluate('//blockquote[font/a/font[contains(text(),"' + ID[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
     if (quote.snapshotLength) {
        for (var i = 0; i < quote.snapshotLength; i++) {
                         if(displaymessage) {
                             quote.snapshotItem(i).innerHTML = '<p>已屏蔽引用 <font color=grey>' + ID[x] + '</font>的言论</p>';
                         }
                         else {
                                 quote.snapshotItem(i).innerHTML = '<br />';
                     }
                }
        }
         title = document.evaluate('//table/tbody[tr[1]/th[1]//a[contains(text(),"' + ID[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (title.snapshotLength) {
                                for (var i = 0, c = ""; i < title.snapshotLength; i++) {
                                        title.snapshotItem(i).innerHTML = "";
                                }
                        }
 
}