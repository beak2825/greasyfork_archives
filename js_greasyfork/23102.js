// ==UserScript==
// @name           福利吧屏蔽辣鸡帖子
// @namespace discuz
// @description Filters out certain posts based on the filter list, for Discuz based bbs. Made for wndflb.com, may require modifications on other domains. This script is NOT original and is published under CC. (original version-https://greasyfork.org/scripts/5346-user.js) https://dolc.de/forum.php?mod=viewthread&tid=1618226
// @description:zh Discuz 论坛在浏览器端屏蔽特定 ID 发言。适用于过滤各种五毛党，五美分党，无脑喷子。给wndflb.com 写的，用在其他论坛上可能需要修改。基于他人工作成果制作。使用方式：在 “dogs” 列表里加入想屏蔽的 ID, 用引号包围，半角逗号区隔。(原版-https://greasyfork.org/scripts/5346-dolc-de-%E8%90%8D%E8%81%9A%E7%A4%BE%E5%8C%BA%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%B8%96%E5%AD%90/code/DOLCDE%20%E8%90%8D%E8%81%9A%E7%A4%BE%E5%8C%BA%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%B8%96%E5%AD%90.user.js) https://dolc.de/forum.php?mod=viewthread&tid=1618226 原作者原话:版权没有 修改不咎 不保证在其他Discuz论坛的兼容性
// @include        http*://*wndflb.com*
// @include        http*://*wnflb.com*
// @version 0.3
// @downloadURL https://update.greasyfork.org/scripts/23102/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%B1%8F%E8%94%BD%E8%BE%A3%E9%B8%A1%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/23102/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%B1%8F%E8%94%BD%E8%BE%A3%E9%B8%A1%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==
var dogs = new Array("此处是ID1", "此处是ID2", "后面请按照这个格式添加");       //此处添加被屏蔽者的ID
var displaywords = "该帖子为你屏蔽ID列表中的人发布的帖子-已屏蔽";               //此处自定义被屏蔽的帖子位置展示出的文字(仅在下面一项为true时有效)
var ifdisplay = true;                                                           //此处自定义是否在被屏蔽的帖子位置展示出文字 若要直接隐藏此项修改为false

// 主题列表页
for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/td[2]//cite/a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
		    if(ifdisplay){
			    dog.snapshotItem(i).innerHTML = "<tr><td class='icn'><img src='static/image/common/folder_common.gif' /></a></td><th class='common'><b>" + displaywords + c + "<font color=red></th><td class='by'><cite><font color=red>" + dogs[x] + "</font></cite></td><td class='num'></td><td class='by'></td></tr>";
		    }
		    else
		    {
		        dog.snapshotItem(i).innerHTML = "";
		    }
		}
	}
}

// 内容页
for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/td[1]//a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			c = dog.snapshotItem(i).firstChild.childNodes[3].textContent.replace(/\s*/g, "").slice(0, 2);
			c = (Number(c) > 9) ? c + "楼" : c;
			dog.snapshotItem(i).innerHTML = "<b><center>清扫垃圾人人有责：被屏蔽帖子 " + c + " <font color=red>" + dogs[x] + "</font></center></b>";
		}
	}
}

for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/td[1]/div[1]//font[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			c = String(dog.snapshotItem(i).firstChild.childNodes[3].textContent.match(/\d+#/)).replace(/#/, "楼");
			dog.snapshotItem(i).innerHTML = "<b><center>c被屏蔽帖子 " + c + " <font color=red>" + dogs[x] + "</font></center></b>";
		}
	}
}