// ==UserScript==
// @name         Confluence - remember opened branches in pagetree
// @namespace    http://netresearch.de/
// @version      0.1
// @description  Confluence does not remember which branches of the pagetree you opened - this script records the opened and closed branches in LocalStorage and restores them on page change, reload or on other tabs/windows
// @author       Christian Opitz
// @include      *.atlassian.net/wiki/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/22250/Confluence%20-%20remember%20opened%20branches%20in%20pagetree.user.js
// @updateURL https://update.greasyfork.org/scripts/22250/Confluence%20-%20remember%20opened%20branches%20in%20pagetree.meta.js
// ==/UserScript==

(function() {
    'use strict';
    AJS.toInit(function() {
        var spaceKey = AJS.Meta.get('space-key');
        if (!spaceKey) {
            return;
        }
        var $ = AJS.$,
            saveKey = 'netresearch-opened-' + spaceKey,
            load = function() {
                var data = localStorage.getItem(saveKey);
                return data ? JSON.parse(data) : [];
            },
            opened = load(),
            toBeOpened = opened.slice(0),
            open = function() {
                var remove = [];
                for (var id of toBeOpened) {
                    var el = $('#' + id);
                    if (el.length) {
                        if (!el.hasClass('icon-section-opened')) {
                            el.trigger('click', [true]);
                        }
                        remove.push(id);
                    }
                }
                for (id of remove) {
                    toBeOpened.splice(toBeOpened.indexOf(id), 1);
                }
            },
            thisIsUsSaving = false;

        AJS.bind('pagetree-children-loaded', function() {
            open();
            $('.plugin_pagetree_childtoggle:not(.nr-registered)').addClass('nr-registered').click(function(e, thisIsUsClicking) {
                if (thisIsUsClicking) {
                    return;
                }
                var $this = $(this),
                    id = $this.attr('id'),
                    pos = opened.indexOf(id),
                    // Class is set, when elements are loaded - if there are no elements we can assume they are about to be:
                    isOpen = $this.hasClass('icon-section-opened') || $('#child_ul' + id.substring(9)).length === 0;
                
                if (isOpen && pos < 0) {
                    opened.push(id);
                } else if (!isOpen && pos >= 0) {
                    opened.splice(pos, 1);
                }
                thisIsUsSaving = true;
                localStorage.setItem(saveKey, JSON.stringify(opened));
                thisIsUsSaving = false;
            });
        });

        window.addEventListener("storage", function(e) {
            if (thisIsUsSaving || e.key != saveKey) {
                return;
            }
            var newOpened = load();
            $('.icon-section-opened').each(function() {
                var $open = $(this);
                if (newOpened.indexOf($open.attr('id')) < 0) {
                    $open.trigger('click', [true]);
                }
            });
            toBeOpened = newOpened;
            open();
        }, false);
    });
})();