// ==UserScript==
// @name         Fandom User Blog Actions
// @namespace    a
// @version      1
// @author       U.ayaao.p
// @description  Adds page actions to user blog pages on Fandom wikis
// @match        *://*.fandom.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464616/Fandom%20User%20Blog%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/464616/Fandom%20User%20Blog%20Actions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pageTitle = window.location.href.match(/User_blog:.*\/.*/);

    if (window.location.href.match(/\/User_blog:.*\/.*/)) {

        // Create the actions dropdown HTML
        var actionsHtml = '<div class="wds-dropdown">' +
                            '<div class="wds-dropdown__toggle wds-button wds-is-text page-header__action-button">' +
                                '<svg class="wds-icon wds-icon-small"><use xlink:href="#wds-icons-more-small"></use></svg>' +
                            '</div>' +
                            '<div id="p-cactions" class="wds-dropdown__content wds-is-right-aligned wds-is-not-scrollable">' +
                                '<ul class="wds-list wds-is-linked">' +
                                    '<li>' +
                                        '<a id="ca-history" href="/wiki/' + pageTitle + '?action=history" data-tracking-label="ca-history-dropdown" accesskey="h">' +
                                            'View history' +
                                        '</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a id="ca-move" href="/wiki/' + pageTitle + '"?action=edit" accesskey="e">' +
                                            'View source' +
                                        '</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a id="ca-purge" href="/wiki/' + pageTitle + '?action=purge" data-tracking-label="ca-purge-dropdown">' +
                                            'Purge' +
                                        '</a>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>';

        var pageHeaderActions = document.getElementById("p-views");
        pageHeaderActions.innerHTML += actionsHtml;
    }
})();