// ==UserScript==
// @name         ArchWiki JP Link Changer
// @version      1.0
// @namespace pclives.org
// @license MIT
// @description  ArchWiki .jpのパッケージ詳細リンクの遷移先を.orgに変更します．
// @author       popcount
// @match        https://wiki.archlinux.jp/index.php/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439976/ArchWiki%20JP%20Link%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/439976/ArchWiki%20JP%20Link%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("a").forEach(e => {
        e.href = e.href.replace("https://www.archlinux.jp/packages/", "https://archlinux.org/packages/");
    })
})();