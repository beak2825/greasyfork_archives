// ==UserScript==
// @name         CSFD - get series links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get CSFD series or episodes IDs to clipboard
// @author       Libor Marek
// @match        https://www.csfd.cz/film/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405287/CSFD%20-%20get%20series%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/405287/CSFD%20-%20get%20series%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        $("#children").append('<div style="float:none;display:block;width:650px;text-align:right;"><input type="button" id="copyEpisodeIDs" value="Kopírovat ID"></div>');

        var EpisodeIDs = '';
        $("#children").children("div").children("ul").children("li").children("a").each(function () {
            var link = $(this).attr("href").trim("/");
            var matches = link.match(/\/(\d+)+[\/]?/g).map(id => id.replace(/\//g, ''));
            EpisodeIDs += matches[1] + "\n";
        });

        $(document).on("click", "#copyEpisodeIDs", function () {
            var $temp = $("<textarea><textarea>");
            $("body").append($temp);
            $temp.val(EpisodeIDs).select();
            document.execCommand("copy");

        });

    });

})();
