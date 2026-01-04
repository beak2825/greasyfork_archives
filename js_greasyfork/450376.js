// ==UserScript==
// @name        LeetCode 英文站跳转中文站
// @description leetcode swith en and cn site
// @include     *://leetcode*.com/*
// @exclude     *://leetcode.com/*/discuss/*
// @version     0.0.1
// @author      mzvast
// @license     MIT
// @namespace https://greasyfork.org/users/210993
// @downloadURL https://update.greasyfork.org/scripts/450376/LeetCode%20%E8%8B%B1%E6%96%87%E7%AB%99%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/450376/LeetCode%20%E8%8B%B1%E6%96%87%E7%AB%99%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%E7%AB%99.meta.js
// ==/UserScript==


var en_host = "leetcode.com";
var cn_host = "leetcode-cn.com";

if (location.hostname==en_host) {
    var pathname_L = location.pathname.split('/');
    var url = "https://"+cn_host+pathname_L.slice(0,3).join('/');
    // console.log('url:',url);
    location.replace(url);
}



