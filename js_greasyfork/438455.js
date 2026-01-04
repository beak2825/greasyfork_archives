// ==UserScript==
// @name        Копируем пагинацию
// @description Копирует существующую пагинацию (переключатели страниц) на странице поиска раздач, наверх
// @namespace   https://github.com/mastdiekin
// @include     https://pornolab.net/forum/tracker.php*
// @include     http://pornolab.net/forum/tracker.php*
// @include     https://rutracker.org/forum/tracker.php*

// @version     1.0.1
// @author      mastdiekin
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438455/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D1%83%D0%B5%D0%BC%20%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/438455/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D1%83%D0%B5%D0%BC%20%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.fn.dupe = function (a, b) {
        var c = [];
        for (var d = 0; d < a; d++) $.merge(c, this.clone(b).get());
        return this.pushStack(c);
    };

    $(".bottom_info").dupe(1).prependTo("#search-results");

    // Исправим менюшку "Страницы"
    $(".bottom_info").find("a.menu-root").eq(0).click(
			function(e){ e.preventDefault(); Menu.clicked($(this)); return false; })
        .hover(
			function(){ Menu.hovered($(this)); return false; },
			function(){ Menu.unhovered($(this)); return false; }
		)
})();