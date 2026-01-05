// ==UserScript==
// @name           ✱ Discuz/phpwind论坛 基于ID/标题关键词 屏蔽帖子
// @namespace      lisanye
// @description    Discuz/phpwind论坛 基于ID/标题关键词 屏蔽帖子
// @include        */viewthread.php*
// @include        */thread*
// @include        */redirect.php*
// @include        */forum-redirect-tid*
// @include        */forum-viewthread-tid*
// @include        */forum.php?mod=viewthread*
// @include        */forum.php?mod=forumdisplay*
// @include        */forum-*.html
// @include        https://www.firefox.net.cn/*
// @version        20180213
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27275/%E2%9C%B1%20Discuzphpwind%E8%AE%BA%E5%9D%9B%20%E5%9F%BA%E4%BA%8EID%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D%20%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/27275/%E2%9C%B1%20Discuzphpwind%E8%AE%BA%E5%9D%9B%20%E5%9F%BA%E4%BA%8EID%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D%20%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

// 该脚本最好配合Discuz论坛自带的“黑名单”“提醒筛选”和“消息屏蔽”，一起使用。
// 这样黑名单中的人，你既看不到他们的帖子，他们回复你时你也收不到通知（提醒筛选），他们给你发私信你也收不到（消息屏蔽）。完全彻底的眼不见为净。
// “黑名单”通常在这个地址：/home.php?mod=space&do=friend
// “提醒筛选”通常在这个地址：/home.php?mod=spacecp&ac=privacy&op=filter   “消息屏蔽”在这个地址：/home.php?mod=space&do=pm&subop=setting
// 注：有些Discuz版本，系统消息和成员互动，即使选了针对单个人，也会变成全局，这种情况可以在F12的console中改请求字段，来实现“定向屏蔽”

// 用户名（模仿下面的格式，只添加要屏蔽其帖子的用户名，两边用英文双引号括住，用英文逗号分隔）
var dogs = new Array("wxcwhk", "goldsun0", "hh2");
// 主题帖标题
var dogtitles = new Array("签到", "水果乐园", "请进");
// 分类
var dogsubgroup = new Array("闲情帖", "菠菜帖");

blockAll();

var mo = new MutationObserver(function(allmutations) {
    blockAll();
});
mo.observe(document.querySelector('body'), {'childList': true,'characterData':false,'subtree': true});

function blockAll() {
    //discuz论坛

		// 主题列表页 针对ID
		for (x in dogs) {
			dog = document.evaluate('//table/tbody[tr[1]//cite/a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

		// 单个主题帖内 针对ID 回帖
		for (x in dogs) {
			dog = document.evaluate('//*[starts-with(@id, "post")]/table/tbody[tr[1]/td[1]//a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

		// 主题列表页 针对标题
		for (x in dogtitles) {
			dog = document.evaluate('//table/tbody[tr[1]/th[1]/a[contains(text(),"' + dogtitles[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

		// 主题列表页 针对子分类
		for (x in dogsubgroup) {
			dog = document.evaluate('//table/tbody[tr[1]/th[1]/em/a[contains(text(),"' + dogsubgroup[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

		// 不明
		for (x in dogs) {
			dog = document.evaluate('//table/tbody[tr[1]/td[1]/div[1]//font[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					c = String(dog.snapshotItem(i).firstChild.childNodes[3].textContent.match(/\d+#/)).replace(/#/, "楼");
					dog.snapshotItem(i).innerHTML = "<b><center>c被屏蔽帖子 " + c + " <font color=red>" + dogs[x] + "</font></center></b>";
					//dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

    //phpwind

    // 主题列表页 针对ID
		for (x in dogs) {
			dog = document.evaluate('//div[@class="thread_posts_list"]//tr//p[@class="info"][contains(., "楼主：' + dogs[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

    // 手机列表页 针对ID
		for (x in dogs) {
			dog = document.evaluate('//td[@class="subject"]/p[@class="info"][contains(., "楼主：' + dogs[x] + '")]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}
}

GM_addStyle(`#hiddenpoststip {
    display: none !important;
}`);