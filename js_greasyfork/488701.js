// ==UserScript==
// @name           HotKey Next Page(L改)
// @namespace      https://greasyfork.org/zh-TW/users/4839
// @author         hzhbest,leadra
// @version        1.0.4
// @description    按方向鍵[左.右]或shift+[A.D]翻頁
// @match          *://*/*
// @exclude        https://anime1.me/*
// @exclude        https://twitter.com/*
// @exclude        https://ani.gamer.com.tw/*
// @exclude        https://*.youtube.com/*
// @exclude        https://*.facebook.com/*
// @exclude        https://*.manhuagui.com/*
// @exclude        https://copymanga.*/*
// @exclude        https://mangacopy.*/*
// @exclude        https://mangacopy.*/*
// @exclude        https://www.dm5.com/*
// @exclude        https://*.google.com/*
// @exclude        https://*.imasdk.googleapis.com/*
// @exclude        https://*.googlesyndication.com/*

// @license        MIT
// @icon           data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/488701/HotKey%20Next%20Page%28L%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488701/HotKey%20Next%20Page%28L%E6%94%B9%29.meta.js
// ==/UserScript==

// original author : scottxp@126.com (https://userscripts-mirror.org/scripts/show/87895)
// mod by hzhbest  : add hilite and float buttons

const Strs = {
    next: [
        "下一页",
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
        "next",
        "next page",
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
        "previous",
        "prev",
        "previous page",
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
    ["//a[(text()='", "')]"],
    ["//a[@class='", "']"],
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
];
const LastKEY = [
    37,     // 左方向键
    65      // 字母键A
];
const NextKEY = [
    39,     // 右方向键
    68      // 字母键D
];
const LastKEY2 = [
    37,     // 左方向键

];
const NextKEY2 = [
    39,     // 右方向键

];
const css = `.__hkbtn {outline: 3px solid #bb1a6a; font-size: larger;}
            .__hkbse {position: fixed; z-index: 1000; right: 1em; bottom: 1em; background: #fff2;}
            .__hkbse>div:first-of-type {display: none;}
            .__hkbse:hover>div:first-of-type {display: inline-block;}
            .__hkfbtn {width: 3em; height: 1em; display: inline-block; border: 2px solid #8a8a8a8a;
                cursor: pointer; text-align: center; font-size: 1em; line-height: 1em; opacity: 0.3;}
            .__hkfbtn.disabled {opacity: 0.3;}
            .__hkfbtn:hover {opacity: 1; background: #fbcf84dd;}
            `;
addCSS(css, 'hknp_css');

var lnode = getNode('last');
var rnode = getNode('next');
if (!!lnode || !!rnode) {
    var bnode = creaElemIn('div', document.body);
    bnode.className = '__hkbse';
    var lbutton = creaElemIn('div', bnode);
    var rbutton = creaElemIn('div', bnode);
    lbutton.className = rbutton.className = '__hkfbtn disabled';
    lbutton.innerHTML = "＜";
    rbutton.innerHTML = "＞";
    if (!!lnode && lnode.offsetHeight !== 0) {
        lnode.classList.add('__hkbtn') ;
        lbutton.classList.remove('disabled');
        if (lnode.textContent.length > 0) lbutton.innerHTML = lnode.textContent.substring(0,3);
        lbutton.title = lnode.textContent + ((!!lnode.href)? '\n' + lnode.href : '');
        lbutton.addEventListener('click', ()=>{click(lnode);}, false);
    }
    if (!!rnode && rnode.offsetHeight !== 0) {
        rnode.classList.add('__hkbtn') ;
        rbutton.classList.remove('disabled');
        if (rnode.textContent.length > 0) rbutton.innerHTML = rnode.textContent.substring(0,3);
        rbutton.title = rnode.textContent + ((!!rnode.href)? '\n' + rnode.href : '');
        rbutton.addEventListener('click', ()=>{click(rnode);}, false);
    }
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
  //快速鍵：shift+AD
    if (e.shiftKey ){ //|| e.ctrlKey || e.altKey || e.metaKey return;
    if (checkTextArea(e.target)) return;
    //console.log("hknp_keydown:",e.keyCode);
    if (LastKEY.includes(e.keyCode) && !!lnode) {
        click(lnode);
    }
    if (NextKEY.includes(e.keyCode) && !!rnode) {
        click(rnode);
    }

                    }
  //快速鍵：方向鍵左右
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    if (checkTextArea(e.target)) return;
    if (LastKEY2.includes(e.keyCode) && !!lnode) {
        click(lnode);
    }
    if (NextKEY2.includes(e.keyCode) && !!rnode) {
        click(rnode);
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
    if (node.click) node.click();
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
    if (!node) node = getNodeBySpecialXpath(lnstr);
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
