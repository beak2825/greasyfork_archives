// ==UserScript==
// @name        bcrawlink
// @description Provides links to the raw media files for previews on bandcamp to get around preview listen limits.  Also allows you to easily download the previews.  >:)
// @license     MIT License
// @namespace   com.bandcamp.benburrill.evil
// @include     *
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22236/bcrawlink.user.js
// @updateURL https://update.greasyfork.org/scripts/22236/bcrawlink.meta.js
// ==/UserScript==

// BTW, we run this on all sites because some bandcamp pages are not actually on bandcamp.org

function on_doc_ready(func) {
    if (document.readyState === "complete") {
        func(null);
    } else {
        document.addEventListener("DOMContentLoaded", func);
    }
}

on_doc_ready(function() {
    window.TralbumData && TralbumData.trackinfo.forEach(function (track, index) {
        // I've only seen the mp3 type, but if there happen to be more, we want to
        // make links for all of them.
        track.file && Object.keys(track.file).forEach(function (media_type) {
            var cls = "raw-link-" + media_type;
            var base = "(tr,div)[rel=\"tracknum=" + (index + 1) + "\"]";
            var pref_child = "td.title-col";

            // If possible, use the child pref_child instead of base.
            if ($(base).has(pref_child).length) base += ">" + pref_child;

            $(base + ":not(:has(a." + cls + "))").each(function () {
                $(this).append("<a class=\"" + cls + "\" href=\"" + track.file[media_type] + "\" target=\"_blank\">\n                        " + media_type + "\n                    </a>");
            });
        });
    });
});