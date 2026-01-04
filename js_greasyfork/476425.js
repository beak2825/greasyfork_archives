// ==UserScript==
// @name         Add UCS download button
// @namespace    http://ucs.piugame.com/
// @version      1.1
// @description  Adds download button on UCS site
// @author       Conjo
// @match        https://ucs.piugame.com/ucs_share?*wr_id=*
// @match        https://ucs.piugame.com/bbs/board.php?*wr_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476425/Add%20UCS%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/476425/Add%20UCS%20download%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        const buttons = document.querySelector(".btn_wrap > div:nth-child(1)");
        const downloadButton = buttons.lastElementChild.cloneNode(true);
        const downloadURL = new URL("https://ucs.piugame.com/ucs_player/file.php");
        const qstrings = new URLSearchParams(window.location.search)

        downloadURL.search = "wr_id=" + qstrings.get("wr_id") ;
        downloadButton.children[0].href=downloadURL.pathname + downloadURL.search;
        downloadButton.getElementsByClassName("tt")[0].innerHTML = "Download"
        buttons.append(downloadButton);
    }

    addDownloadButton();
})();