// ==UserScript==
// @name         图书互助查询小帮手: 读秀超星图书联盟显示图书编号
// @name:zh-CN   图书互助查询小帮手: 读秀超星图书联盟显示图书编号
// @name:zh-TW   圖書互助查詢小幫手: 讀秀超星圖書聯盟顯示圖書編號
// @name:en      Book Search Helper: DXID SSID helper.
// @namespace    duxiuhelp
// @version      0.0.1
// @author       Moon
// @icon         data:image/png;base64,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
// @match        *://*.duxiu.com/search*
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.dglib.superlib.net/views/specific/*
// @match        *://book.dglib.superlib.net/search*
// @match        *://book.douban.com/isbn/*
// @match        *://cadal.edu.cn/cadalinfo/search*
// @match        *://cadal.edu.cn/cardpage/bookCardPage?*ssno=*
// @match        *://fx.ccelib.com/detail_*
// @match        *://fx.ccelib.com/s?*
// @include      */search?*
// @include      *bookDetail.jsp?*
// @include      *chapter.jsp?*
// @include      *book.do?*
// @include	     *advsearch*
// @include		 *book.do?go=guide*
// @include		 *book.do?go=showmorelib*
// @include		 *searchEBook*
// @include		 *www.duxiu.com*
// @include		 *n/jpgfs/book/base*
// @include		 *n/slib/book/slib*
// @description        免注册，查询超星、读秀、全国图书馆参考咨询联盟等文献馆书籍编号(SSID, DXID)，并发起互助获取全文。
// @description:zh-CN  免注册，查询超星、读秀、全国图书馆参考咨询联盟等文献馆试读书籍是否可以发起互助获取全文。
// @description:zh-tw  免註冊，查詢超星、讀秀、全國圖書館參考咨詢聯盟等文獻館書籍編號(SSID, DXID)，並發起互助獲取全文。
// @description:en No registration, check the book numbers (SSID, DXID) of literature libraries such as Super Star, Duxiu, UCDRS, and initiate mutual assistance to obtain the full text.
// @license     Copyright Moon
// @downloadURL https://update.greasyfork.org/scripts/452189/%E5%9B%BE%E4%B9%A6%E4%BA%92%E5%8A%A9%E6%9F%A5%E8%AF%A2%E5%B0%8F%E5%B8%AE%E6%89%8B%3A%20%E8%AF%BB%E7%A7%80%E8%B6%85%E6%98%9F%E5%9B%BE%E4%B9%A6%E8%81%94%E7%9B%9F%E6%98%BE%E7%A4%BA%E5%9B%BE%E4%B9%A6%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452189/%E5%9B%BE%E4%B9%A6%E4%BA%92%E5%8A%A9%E6%9F%A5%E8%AF%A2%E5%B0%8F%E5%B8%AE%E6%89%8B%3A%20%E8%AF%BB%E7%A7%80%E8%B6%85%E6%98%9F%E5%9B%BE%E4%B9%A6%E8%81%94%E7%9B%9F%E6%98%BE%E7%A4%BA%E5%9B%BE%E4%B9%A6%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==

function main() {
	var bookList = document.querySelectorAll("table.book1");
	if (bookList.length == 0) {
		bookList = document.querySelectorAll("table.books");
	}
	if (bookList.length == 0) {
		bookList = document.querySelectorAll("table");
	}
	for (var i = 0; i < bookList.length; i++) {
		var ssid = document.getElementById("ssid" + i);
		var ssidVal = ssid.value;
		var dxid = document.getElementById("dxid" + i);
		var dxidVal = dxid.value;

		ssid.setAttribute("type", "");
		ssid.value = "SS " + ssid.value;
		dxid.setAttribute("type", "");
		dxid.value = "DX " + dxid.value;

		var node = ssid.parentNode;
		var blink = createBookLink(ssidVal, dxidVal);
		if (blink) {
			node.appendChild(blink);
		}
	}
}

function createBookLink(ssid, dxid) {
	var b = document.createElement("a");
	b.target = "_blank";
	b.innerText = "立即互助";

	if (ssid) {
		b.href = getBookLink(ssid);
	} else if (dxid) {
		b.href = searchBookLink(dxid);
	}

	return b;
}

function getBookLink(ssid) {
	return "https://1yuanbook.com/book/" + ssid;
}

function searchBookLink(dxid) {
	return "https://1yuanbook.com/search/" + dxid;
}

(function () {
	/// entry
	try {
		main();
	} catch (e) {
		console.error(e);
	}
})();
