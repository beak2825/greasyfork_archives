// ==UserScript==
// @name          GGn GameDox Upload Helper
// @description   A GGn user script to help with GameDox uploading
// @namespace     http://tampermonkey.net/
// @version       1.0.0
// @author        BestGrapeLeaves
// @license       MIT
// @match         https://gazellegames.net/upload.php?groupid=*
// @icon          https://i.imgur.com/UFOk0Iu.png
// @downloadURL https://update.greasyfork.org/scripts/450692/GGn%20GameDox%20Upload%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450692/GGn%20GameDox%20Upload%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const GAME_DOX_INSERT = `[align=center] pdf pages
[/align]`;

    $("select#miscellaneous").change(function () {
        const selected = $("select#miscellaneous option:selected").text();
        if (selected === "GameDOX") {
            $("input#release_title").val(
              $("input#release_title").val() + " - Manual"
            );
            $("select#gamedox").val("Guide").change();
            $("select#format").val("PDF").change();
            $("input#scan").click();
            Scan();
            $("textarea#release_desc").val(
              $("textarea#release_desc").val() + GAME_DOX_INSERT
            );
        }
    });
})();