// ==UserScript==
// @name           rpgmaker.ru my page fix
// @name:ru        Исправление my page на rpgmaker.ru
// @description    Correcting links in a user profile
// @description:ru Исправление ссылок в профиле пользователя
// @version        0.8
// @namespace      mur.greasy.fork.mypage
// @license        BSD
// @include        http://rpgmaker.ru/social/mypage
// @include        http://rpgmaker.ru/social/mypage/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35517/rpgmakerru%20my%20page%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/35517/rpgmakerru%20my%20page%20fix.meta.js
// ==/UserScript==

var links,thisLink;
links = document.evaluate("//a[@href]",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
for (var i=0;i<links.snapshotLength;i++) {
	var thisLink = links.snapshotItem(i);

	thisLink.href = thisLink.href.replace('http://rpgmaker.ru/%22/', '');
	thisLink.href = thisLink.href.replace('%22/', '');
	thisLink.href = thisLink.href.replace('\\%22\\', '');
}