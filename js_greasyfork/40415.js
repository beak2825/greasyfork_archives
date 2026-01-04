// ==UserScript==
// @name         TGit UI美化
// @namespace    tgit-beautifier
// @version      0.2.0
// @description  TGit UI太丑了不能忍
// @homepage     http://greasyfork.org/zh-CN/scripts/40415-tgit-ui%E7%BE%8E%E5%8C%96
// @author       JustDs
// @match        *://git.code.oa.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/40415/TGit%20UI%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/40415/TGit%20UI%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {

    var styles = [
        'body.ui_tgit .sidebar-right-wrapper { display: none; }',
        'body.ui_tgit .head-title { padding-top: 20px; background: #fff; color: #415b94; }',
        'body.ui_tgit .head-title a:not(.btn) { color: #415b94; }',
        'body.ui_tgit .head-title .avatar-hexagon .avatar-hexagon-inner { background-image: url(/assets/images/hexagon-default.31aee295.png); }'
    ].join(' ');

    var styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleElement);

})();