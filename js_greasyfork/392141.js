// ==UserScript==
// @name         Youtube Save to... playlist incremental search
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  This script injects a search field into the dialog where user can save a video to a playlist. When the user starts to type an incremental search is implemented and the playlists are filtered out
// @author       Jaq Drako
// @match        *://www.youtube.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392141/Youtube%20Save%20to%20playlist%20incremental%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/392141/Youtube%20Save%20to%20playlist%20incremental%20search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const $ = window.$;
    if (!$) {
        console.warn("[YT Playlist Filter] jQuery missing");
        return;
    }

    // returns jQuery-wrapped dropdown element if the "Save to..." sheet is open, else null
    function findSaveDialog() {
        const candidates = $("tp-yt-iron-dropdown:visible");
        for (let i = 0; i < candidates.length; i++) {
            const dlg = $(candidates[i]);
            if (dlg.find("yt-list-view-model.ytListViewModelHost[role='list']").length > 0) {
                return dlg;
            }
        }
        return null;
    }

    function swallowEventsPreventClose($el) {
        // block all the "this is an outside click" detectors higher up
        const stopper = function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        // mousedown/up/click + focus just in case
        $el.on("mousedown click mouseup touchstart touchend", stopper);
    }

    function ensureSearchBox(dialogRoot) {
        const contentWrapper = dialogRoot.find("#contentWrapper").first();
        if (!contentWrapper.length) {
            return;
        }

        const headerContainer = contentWrapper.find(".ytContextualSheetLayoutHeaderContainer").first();
        if (!headerContainer.length) {
            return;
        }

        if (contentWrapper.find("#ytPlaylistSearchWrapper").length > 0) {
            return; // already injected
        }

        const searchHtml = [
            "<div id='ytPlaylistSearchWrapper'",
            "     style='box-sizing:border-box;padding:8px 16px 0 16px;display:flex;flex-direction:row;align-items:center;gap:8px;'>",
            "   <label for='ytPlaylistSearch'",
            "          style='font-size:12px;font-weight:500;white-space:nowrap;color:var(--yt-spec-text-primary,#fff);'>",
            "       Search:",
            "   </label>",
            "   <input id='ytPlaylistSearch' type='search'",
            "          placeholder='filter playlists...'",
            "          style='flex:1;font-size:12px;line-height:16px;padding:4px 6px;",
            "                 color:var(--yt-spec-text-primary,#fff);",
            "                 background-color:transparent;",
            "                 border:1px solid var(--yt-spec-text-secondary,#888);",
            "                 border-radius:4px;outline:none;'",
            "   />",
            "</div>"
        ].join("");

        const $injected = $(searchHtml).insertAfter(headerContainer);
        const input = $injected.find("#ytPlaylistSearch");

        // prevent dialog close on click/focus in our UI
        swallowEventsPreventClose($injected);
        swallowEventsPreventClose(input);

        // bind filtering
        input.on("input search", function () {
            filterPlaylists(dialogRoot);
        });
    }

    function filterPlaylists(dialogRoot) {
        const contentWrapper = dialogRoot.find("#contentWrapper").first();
        const termRaw = contentWrapper.find("#ytPlaylistSearch").val() || "";
        const term = termRaw.trim().toLowerCase();

        const rows = contentWrapper
            .find("yt-list-view-model.ytListViewModelHost[role='list']")
            .find("toggleable-list-item-view-model.toggleableListItemViewModelHost");

        rows.each(function () {
            const row = $(this);

            // try nice title span first
            const titleSpan = row.find(".yt-list-item-view-model__title").first();
            let name = "";

            if (titleSpan.length > 0) {
                name = (titleSpan.text() || "").trim().toLowerCase();
            } else {
                const item = row.find(".yt-list-item-view-model").first();
                name = (item.attr("aria-label") || "").trim().toLowerCase();
            }

            if (!term || name.indexOf(term) !== -1) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

    function attachCloseHandler(dialogRoot) {
        if (dialogRoot.data("ytPlaylistFilterObserverAttached")) {
            return;
        }
        dialogRoot.data("ytPlaylistFilterObserverAttached", true);

        const observer = new MutationObserver(function () {
            if (!document.contains(dialogRoot[0])) {
                startPolling();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    let pollHandle = null;

    function pollStep() {
        const dlg = findSaveDialog();
        if (!dlg) {
            return;
        }

        stopPolling();

        ensureSearchBox(dlg);
        filterPlaylists(dlg);
        attachCloseHandler(dlg);
    }

    function startPolling() {
        stopPolling();
        pollHandle = setInterval(pollStep, 200);
    }

    function stopPolling() {
        if (pollHandle) {
            clearInterval(pollHandle);
            pollHandle = null;
        }
    }

    startPolling();
})();
