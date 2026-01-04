// ==UserScript==
// @name         my cf
// @namespace    xay5421
// @author       xay5421
// @match        *://codeforces.com/problemset/problem/*
// @match        *://codeforces.com/contest/*/problem/*
// @match        *://codeforces.ml/problemset/problem/*
// @match        *://codeforces.ml/contest/*/problem/*
// @match        *://codeforces.com/*
// @version      0.1
// @description  CF插件，可以跳转洛谷
// @require       https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/436716/my%20cf.user.js
// @updateURL https://update.greasyfork.org/scripts/436716/my%20cf.meta.js
// ==/UserScript==

const pathname=location.pathname

if(/\/problemset\/problem\/(\d*)\/([A-Z][1-9]?)$/.test(pathname)){
	location.href=`/contest/${RegExp.$1}/problem/${RegExp.$2}`;
}
else if(/\/contest\/(\d*)\/problem\/([A-Z][1-9]?)$/.test(pathname)){
	let x=$('.header>.title'),y=x.html();
	x.html(`<a href="https://www.luogu.com.cn/problem/CF${RegExp.$1+RegExp.$2}" target="_blank">${y}</a>`);
}

if(0){
    var stateObject = {};
    var title = "Wow Title";
    var newUrl = "/my/awesome/url";
    history.pushState(stateObject,title,newUrl);
}