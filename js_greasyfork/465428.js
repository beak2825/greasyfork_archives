// ==UserScript==
// @name           HotKey Next Page
// @namespace      hzhbest
// @author         hzhbest
// @version        1.5
// @description    按左右键快速翻页，也可点击浮动按钮快速翻页
// @include        http://*
// @include        https://*
// @license        MIT
// @run-at         document-end
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/465428/HotKey%20Next%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/465428/HotKey%20Next%20Page.meta.js
// ==/UserScript==

// original author : scottxp@126.com (https://userscripts-mirror.org/scripts/show/87895)
// mod by hzhbest  : add hilite and float buttons

const Strs = {
    next: [
        "下一页",
        "下壹頁",
        "下页",
        "下一页 »",
        "下一页 &gt;",
        "下一节",
        "下一章",
        "下一篇",
        "后一章",
        "后一篇",
        "后页>",
        "»",
        ">",
        "next",
        "next page",
        "Next →",
        "old",
        "older",
        "earlier",
        "下頁",
        "下一頁",
        "后一页",
        "后一頁",
        "翻下页",
        "翻下頁",
        "后页",
        "后頁",
        "下翻",
        "下一个",
        "下一张",
        "下一幅",
    ],
    last: [
        "上一页",
        "上壹頁",
        "上页",
        "« 上一页",
        "&lt; 上一页",
        "上一节",
        "上一章",
        "上一篇",
        "前一章",
        "前一篇",
        "<前页",
        "«",
        "<",
        "previous",
        "prev",
        "previous page",
        "← Previous",
        "new",
        "newer",
        "later",
        "上頁",
        "上一頁",
        "前一页",
        "前一頁",
        "翻上页",
        "翻上頁",
        "前页",
        "前頁",
        "上翻",
        "上一个",
        "上一张",
        "上一幅",
    ]
}

const GeneralXpaths = [
    ["//a[(normalize-space(text())='", "')]"],
    ["//a[@class='", "']"],
    ["//a[@id='", "']"],
    ["//a[starts-with(@class,'", " ')]"],
    ["//a[starts-with(@id,'", " ')]"],
    ["//input[@type='button' and @value='", "']"],
];

//编辑下面的数组来自定义规则
const SpecialXpaths = [
    {
        urls: ["http://www.google.com"],    //匹配的url
        last: "//a[@id='pnprev']",    //上一页节点的xpath
        next: "//a[@id='pnnext']",    //下一页节点的xpath
    },
    {
        urls: ["bilibili.com"],
        last: '//li[@class="be-pager-prev"]',
        next: '//li[@class="be-pager-next"]',
    },
    {
        urls: ["taobao.com"],
        last: '//button[contains(@aria-label,"上一页")]',
        next: '//button[contains(@aria-label,"下一页")]',
    },
    {
        urls: ["gov.cn"],
        last: '//button[@class="btn-prev"]',
        next: '//button[@class="btn-next"]',
    },
	/*{
        urls: ["anime1.me"],
        last: '//a[@id="table-list_previous"]',
        next: '//a[@id="table-list_next"]',
    },
    {
        urls: ["e-hentai.org"],
        last: '//a[@id="dprev"]',
        next: '//a[@id="dnext"]',
    },*/
];
const LastKEY = [
    37,     // 左方向键
    65      // 字母键A
];
const NextKEY = [
    39,     // 右方向键
    68      // 字母键D
];
const css = `.__hkbtn {outline: 3px solid #bb1a6a; font-size: larger;}
            .__hkbse {position: fixed; z-index: 1000; right: 2em; bottom: 5em; background: #fff9;}
            .__hkbse>div:first-of-type {display: none;}
            .__hkbse:hover>div:first-of-type {display: inline-block;}
            .__hkfbtn {width: 4em; height: 3em; display: inline-block; border: 2px solid #8a8a8a8a;
                cursor: pointer; text-align: center; font-size: 1.5em; line-height: 3em; opacity: 0.7;}
            .__hkfbtn.disabled {opacity: 0.3;}
            .__hkfbtn:hover {opacity: 1; background: #fbcf84dd;}
            `;
addCSS(css, 'hknp_css');
var lnode,rnode,bnode,href;
setTimeout(init, 2000);

function init(){
	lnode = getNode('last');
	rnode = getNode('next');
	if (!!lnode || !!rnode) {
		if (!!bnode) bnode.parentNode.removeChild(bnode);
		bnode = creaElemIn('div', document.body);
		bnode.className = '__hkbse';
		var lbutton = creaElemIn('div', bnode);
		var rbutton = creaElemIn('div', bnode);
		lbutton.className = rbutton.className = '__hkfbtn disabled';
		lbutton.innerHTML = "＜";
		rbutton.innerHTML = "＞";
		bnode.addEventListener('mouseover', ()=>{
			// console.log("href?",href == document.location.href);
			if(href !== document.location.href) init();
		},false);
		if (!!lnode && lnode.offsetHeight !== 0) {
			lnode.classList.add('__hkbtn') ;
			lbutton.classList.remove('disabled');
			if (lnode.textContent.length > 0) lbutton.innerHTML = lnode.textContent.substring(0,3);
			lbutton.title = lnode.textContent + ((!!lnode.href)? '\n' + lnode.href : '');
			lbutton.addEventListener('click', ()=>{
				click(lnode);
				setTimeout(init, 1000);
			}, false);
		}
		if (!!rnode && rnode.offsetHeight !== 0) {
			rnode.classList.add('__hkbtn') ;
			rbutton.classList.remove('disabled');
			if (rnode.textContent.length > 0) rbutton.innerHTML = rnode.textContent.substring(0,3);
			rbutton.title = rnode.textContent + ((!!rnode.href)? '\n' + rnode.href : '');
			rbutton.addEventListener('click', ()=>{
				click(rnode);
				setTimeout(init, 1000);
			}, false);
		}
	}
	href = document.location.href;
}

function creaElemIn(tagname, destin) {
    let theElem = destin.appendChild(document.createElement(tagname));
    return theElem;
}

function addCSS(css, cssid) {
    let stylenode = creaElemIn('style',document.getElementsByTagName('head')[0]);
    stylenode.textContent = css;
    stylenode.type = 'text/css';
    stylenode.id = cssid || '';
}

function checkKey(e) {
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    if (checkTextArea(e.target)) return;
    //console.log("hknp_keydown:",e.keyCode);
    if (LastKEY.includes(e.keyCode) && !!lnode) {
        click(lnode);
		setTimeout(init, 1000);
    }
    if (NextKEY.includes(e.keyCode) && !!rnode) {
        click(rnode);
		setTimeout(init, 1000);
    }
}

function checkTextArea(node) {
    var name = node.localName.toLowerCase();
    if (name == "textarea" || name == "input" || name == "select") {
		return true;
	}
    if (name == "div" && (node.id.toLowerCase().indexOf("textarea") != -1 || node.contentEditable !== false)) {
        return true;
	}
    return false;
}

function click(node) {
    if (node.onclick) node.onclick();
	if (href !== document.location.href) return;
    if (node.click) node.click();
	if (href !== document.location.href) return;
    if (node.href) location.href = node.href;
}
function xpath(query) {
	return unsafeWindow.document.evaluate(
        query,
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
}
function getNode(lnstr) {
    var node = getNodeByGeneralXpath(lnstr);
	// console.log("n1",lnstr,node);
    if (!node) node = getNodeBySpecialXpath(lnstr);
    // console.log("n2",lnstr,node);
	return node;
}
function getNodeByGeneralXpath(lnstr) { // lnstr 只支持输入 【last】 或者 【next】
    var strs;
    strs = Strs[lnstr];
    var x = GeneralXpaths;
    for (var i in x) {
        for (var j in strs) {
            var query = x[i][0] + strs[j] + x[i][1];
            var nodes = xpath(query);
            if (nodes.snapshotLength > 0) return nodes.snapshotItem(0);
        }
    }
    return null;
}
function getNodeBySpecialXpath(lnstr) {   // lnstr 只支持输入 【last】 或者 【next】
    var s = SpecialXpaths;
    for (var i in s) {
        if (checkXpathUrl(s[i].urls)) {
            return xpath(s[i][lnstr]).snapshotItem(0);
        }
    }
    return null;
}
function checkXpathUrl(urls) {
    for (var i in urls) if (location.href.indexOf(urls[i]) >= 0) return true;
    return false;
}
if (top.location != self.location) return;
unsafeWindow.document.addEventListener("keydown", checkKey, false);
