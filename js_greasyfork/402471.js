// ==UserScript==
// @name         Hide AdF
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Liste noire customisable de la liste des derniers sujets.
// @author       You
// @match        https://www.dreadcast.net/Forum*
// @match        https://www.dreadcast.net/FAQ*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402471/Hide%20AdF.user.js
// @updateURL https://update.greasyfork.org/scripts/402471/Hide%20AdF.meta.js
// ==/UserScript==

const blacklist = ["https://www.dreadcast.net/Forum/2-691-ami-du-flood-",
                  "https://www.dreadcast.net/Forum/2-un-autre-lien",
                  "https://www.dreadcast.net/Forum/2-et-encore-un-lien"];


$(document).ready( function() {
    for (let link of blacklist) {
        $("#list_derniers_sujets ul li a[href='" + link + "']").parent().hide();
    }
});