// ==UserScript==
// @name         PodRefreshAll
// @namespace    https://github.com/mdczaplicki
// @version      1.1
// @description  Path of Diablo refresh all button
// @author       Marek Czaplicki
// @match        https://pathofdiablo.com/p/?account*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35833/PodRefreshAll.user.js
// @updateURL https://update.greasyfork.org/scripts/35833/PodRefreshAll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function $$(selector, context) {
      context = context || document;
      var elements = context.querySelectorAll(selector);
      return Array.prototype.slice.call(elements);
    }
    var pane = $('h4:contains("Offer")');

    var button = $("<button></button>");
    button.text("Refresh all!");
    button.addClass('btn');
    button.addClass('btn-success');
    button.addClass('btn-xs');

    button.css('float', 'right');
    button.css('width', '300px');

    button.click(function() {refreshAll();});

    pane.append(button);

    function refreshAll() {
        var buttons = $$('.btn.btn-success.btn-xs');
        for (var i = 0; i < buttons.length; ++i) {
            doRefresh(buttons[i]);
        }
    }
})();
