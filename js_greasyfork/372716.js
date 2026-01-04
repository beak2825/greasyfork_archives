// ==UserScript==
// @name         指定网站跳转
// @description  自定义的相关网站自动跳转
// @namespace    https://greasyfork.org/zh-CN/scripts/372716
// @version      0.8
// @author       lqzh
// @copyright    lqzh
// @grant        none
// @include      http*://eslint.org/*
// @include      http*://developer.mozilla.org/*
// @include      http*://reactjs.org/*
// @downloadURL https://update.greasyfork.org/scripts/372716/%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/372716/%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

const list = [
    {	o: "//eslint.org/",r: "//zh-hans.eslint.org/",},
    {	o: "//developer.mozilla.org/en-US",r: "//developer.mozilla.org/zh-CN",},
    {	o: "//reactjs.org/",r: "//zh-hans.reactjs.org/",},
];

(function () {
	'use strict';
	let host = location.href;
	for (let i = 0; i < list.length; i++) {
		let site = list[i];
        let keyWord = location.protocol + site.o;
        console.log(keyWord);
		if (host.startsWith(keyWord)) {
            let re =  new RegExp("^" + keyWord);
			location.href = host.replace( re ,location.protocol + '//'+ site.r)
			break;
		}
	}
})();
