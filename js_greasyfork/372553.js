// ==UserScript==
// @name         去掉CSDN BLOG复制时的小尾巴
// @namespace
// @website      https://eeve.me
// @version      0.2
// @description  去掉CSDN BLOG复制时烦人的小尾巴
// @author       eeve
// @include      /^http(s?)://blog.csdn.net/(.*)$/
// @grant        unsafeWindow
// @run-at       document-end
// @namespace		 https://greasyfork.org/users/71775
// @downloadURL https://update.greasyfork.org/scripts/372553/%E5%8E%BB%E6%8E%89CSDN%20BLOG%E5%A4%8D%E5%88%B6%E6%97%B6%E7%9A%84%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/372553/%E5%8E%BB%E6%8E%89CSDN%20BLOG%E5%A4%8D%E5%88%B6%E6%97%B6%E7%9A%84%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==
//
location.assign("javascript:(function(){csdn.copyright.textData = ''})()");

