// ==UserScript==
// @name         FlashX.tv AutoDownloader
// @namespace    FlashX.tv AutoDownloader
// @version      1.0
// @description  Open a FlashX.tv video and wait for the download to start. The script will do everything while preventing ads/popups
// @author       Anon043
// @match        https://www.flashx.tv/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/33727/FlashXtv%20AutoDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/33727/FlashXtv%20AutoDownloader.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        // Per premere il pulsante dopo 5s senza dover cliccare
        setTimeout(function () {
            if($("#btn_download")) $("#btn_download").click(); // Click() non richiama eventi bindati su OnClick, evitando gli Ads
        }, 4000);
        // Per premere il pulsante "play" senza dover cliccare
        setTimeout(function () {
            if($(".vjs-big-play-button")) $(".vjs-big-play-button").click(); // Click() non richiama eventi bindati su OnClick, evitando gli Ads
            setTimeout(function () {
                if($(".vjs-download-button-control") && $(".vjs-download-button-control").attr("href")) {
                    var Titolo = $("#file_title").text().replace("[Put the lights off - Cinema Modus]", "").trim();
                    window.location.href = $(".vjs-download-button-control").attr("href").replace("normal.mp4", Titolo + ".mp4");
                }
            }, 1000);
        }, 1000);
    });
})();
