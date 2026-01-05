// ==UserScript==
// @name         漫音社自动填写百度云密码
// @version      0.1
// @author       FeiLong
// @match        http://www.acgjc.com/storage-download/*
// @grant        none
// @description  在漫音社自动填写百度云密码
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/28687
// @downloadURL https://update.greasyfork.org/scripts/26152/%E6%BC%AB%E9%9F%B3%E7%A4%BE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%99%BE%E5%BA%A6%E4%BA%91%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/26152/%E6%BC%AB%E9%9F%B3%E7%A4%BE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%99%BE%E5%BA%A6%E4%BA%91%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

$("a.btn-success")[0].href = $("a.btn-success")[0].href + "#" + $("input.pwd")[0].value

