// ==UserScript==
// @name         AtCoder Navbar Restrictor
// @namespace    https://twitter.com/KakurenboUni
// @version      0.0.3
// @description  restricts navbar width
// @author       uni_kakurenbo
// @match        https://atcoder.jp/contests/**
// @license      MIT
// @supportURL   https://twitter.com/KakurenboUni
// @downloadURL https://update.greasyfork.org/scripts/501929/AtCoder%20Navbar%20Restrictor.user.js
// @updateURL https://update.greasyfork.org/scripts/501929/AtCoder%20Navbar%20Restrictor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $navbar = document.getElementById("navbar-collapse");
    if(!$navbar) return;

    const $contestTitle = document.getElementsByClassName("contest-title")[0];
    if(!$contestTitle) return;

    $contestTitle.style["overflow-x"] = "clip"
    $contestTitle.style["text-overflow"] = "ellipsis"
    $contestTitle.style["text-wrap"] = "nowrap"

    const observer = new ResizeObserver(() => {
        const $navbarBrand = document.getElementsByClassName("navbar-brand")[0];
        const $navbarRight = document.getElementsByClassName("navbar-right")[0];
        if(!$navbarBrand || !$navbarRight) return;

        const width = $navbar.offsetWidth - ($navbarRight.offsetWidth + $navbarBrand.offsetWidth);
        $contestTitle.style["max-width"] = `${width}px`;
    });

    observer.observe($navbar);
})();
