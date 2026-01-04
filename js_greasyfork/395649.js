// ==UserScript==
// @name         Auto-complete Release Type
// @namespace    hi
// @version      1.2
// @description  Auto-complete release informations (release type and gamedox) on GGn upload page !
// @author       Sapphire_e
// @match        https://gazellegames.net/upload.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395649/Auto-complete%20Release%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/395649/Auto-complete%20Release%20Type.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#release_title.input_tog").keyup(function () {
        if ($("#release_title.input_tog").val().toLowerCase().match(/(\-\w+$)/gm)) { // Permits to check if release name end with "-something" (scene format)
            if ($("#release_title.input_tog").val().toLowerCase().includes("update")) { // Permits to check if release name contain "vX" (update) - UPDATE Part
                let verTemp, ver
                verTemp = $("#release_title.input_tog").val().split(/.v/gm)[1]
                ver = verTemp.split(/_|-/gm)[0]
                $("#miscellaneous").val("GameDOX")
                ReleaseType()
                $('#gamedoxrow').gshow()
                $("#gamedox").val("Update")
                GameDOXCheck()
                $("#gamedoxvers").val(ver)
            } else if ($("#release_title.input_tog").val().includes("-GGn")) {
                $("#miscellaneous").val("GGn Internal") // GGn part (if release title contains -GGn)
                $('#gamedoxrow').ghide()
                ReleaseType()
            } else if (!$("#release_title.input_tog").val().toLowerCase().includes("incl.dlc") && !$("#release_title.input_tog").val().toLowerCase().includes("incl_dlc") && $("#release_title.input_tog").val().toLowerCase().includes("dlc")) { // DLC Part (if release title contains DLC)
                $("#miscellaneous").val("GameDOX")
                ReleaseType()
                $("#gamedox").val("DLC")
                GameDOXCheck()
            } else if ($("#release_title.input_tog").val().toLowerCase().includes("rip")) {
                $("#miscellaneous").val("Rip") // Rip part (if release title contains RIP)
                $('#gamedoxrow').ghide()
                ReleaseType()
            } else {
                $("#miscellaneous").val("ROM") // ROM Part (if release name doesn't contain DLC nor update vX. nor RIP)
                $('#gamedoxrow').ghide()
                ReleaseType()
            }
        }
        else if ($("#release_title.input_tog").val() === "") {
            $("#miscellaneous").val("")
            $('#gamedoxrow').ghide()
            ReleaseType()
        }
    })
})();