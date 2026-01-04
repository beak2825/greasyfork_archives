// ==UserScript==
// @name         Github跳转到github1s编辑页面
// @namespace    https://github.com/kitety/jump-to-github1s
// @homepage     https://github.com/kitety/jump-to-github1s
// @version      0.0.1
// @description  Github跳转到github1s编辑页面的脚本，Github仓库页面显示一个按钮，跳转到Github1s的编辑页面
// @author       Kitety
// @icon         https://github.com/favicon.ico
// @match        *://github.com/*
// @run-at       document-end
// @require      https://unpkg.com/jquery@3.5.1/dist/jquery.js
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/422506/Github%E8%B7%B3%E8%BD%AC%E5%88%B0github1s%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/422506/Github%E8%B7%B3%E8%BD%AC%E5%88%B0github1s%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
(function (w) {
    var $ul = $("ul.pagehead-actions");
    var href = window.location.href.replace("github.com", "github1s.com");
    if (!$ul.length) return;
    var $li = $(
      '<li><a href="' +
        href +
        '" class="btn btn-sm tooltipped tooltipped-s" target="_blank" rel="noopener noreferrer"  aria-label="跳转到Github1s" > 跳转到Github1s</a> </li> '
    );
    $ul.append($li);
  })();
