// ==UserScript==
// @name         Better iFunny
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  We can use the website now, so let's use it in style.
// @author       Keidran
// @match        https://ifunny.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419368/Better%20iFunny.user.js
// @updateURL https://update.greasyfork.org/scripts/419368/Better%20iFunny.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(".button_pinterest, .l-sidebar, .l-categories, .header__leftbar{display:none}");

    function remove(cla) {
        document.querySelectorAll(cla).forEach(function(a){a.remove()});
    }

    remove(".button_pinterest");
    remove(".l-sidebar");
    remove(".l-categories");
    remove(".header__leftbar");

    var sublink=document.querySelectorAll('.navigation__link')[0];
    sublink.href="/subscriptions";
    sublink.innerText="subscriptions";

    addGlobalStyle("body, .switcher, .profile__base, .l-header, .post__toolbar, .button_copy, button_copy:hover, .comments-form__field{background-color:#111111;color:#CCCCCC}");
    addGlobalStyle(".header__container{flex-grow:0;margin-right:0}");
    addGlobalStyle(".header{justify-content:center}");
    addGlobalStyle(".l-content, .l-content-wrap{margin:auto}");

})();