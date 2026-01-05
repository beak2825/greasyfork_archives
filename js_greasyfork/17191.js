// ==UserScript==
// @name        acfun地址替换
// @namespace   https://greasyfork.org/users/29338
// @description   把ac土豆替换回http://www.acfun.tv/
// @include     http://acfun.tudou.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17191/acfun%E5%9C%B0%E5%9D%80%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/17191/acfun%E5%9C%B0%E5%9D%80%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
search=location.href.split("/")[3];
ac=location.href.split("/")[4];
if (ac.split("",2)[1]=="c" || search.split("",2)[1]=="e")
 location.href="http://www.acfun.tv/" + location.href.split("/")[3] + "/" + location.href.split("/")[4];
