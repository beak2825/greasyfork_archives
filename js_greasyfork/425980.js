// ==UserScript==
// @name           Top81黑名单-屏蔽指定用户帖子
// @namespace      Violentmonkey Scripts
// @author         loewez81
// @description    屏蔽与相应用户有关的所有内容，来源于网络
// @include        http*://top81.ws/*
// @include        http*://top81.cn/*
// @grant 	   none
// @version        1.0.0
// @downloadURL https://update.greasyfork.org/scripts/425980/Top81%E9%BB%91%E5%90%8D%E5%8D%95-%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/425980/Top81%E9%BB%91%E5%90%8D%E5%8D%95-%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

// 如有必要，请在插件的脚本设置中，添加需要生效的网址到@include规则

//用户名屏蔽列表  备注: 如需屏蔽多人   按照 "用户名1","用户名2" 格式
var ID = new Array("用户名1","用户名2");

//如不需要显示屏蔽提示   请将"true"改为"false"
var hint = true;

//处理所有 li 标签
for (var x in ID) {
    var o = document.evaluate('/html/body/ul//li/font[text()[contains(.,"' + ID[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (o.snapshotLength) {
        for (var i = 0; i < o.snapshotLength; i++) {
            if(hint) {
                o.snapshotItem(i).innerHTML = "<b>已屏蔽主题 " + "<cite><font color=grey>" + ID[x] + "</font></cite>";
            }
            else {
                o.snapshotItem(i).innerHTML = "";
            }
        }
    }
}
