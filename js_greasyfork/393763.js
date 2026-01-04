// ==UserScript==
// @name        Nexus Fast Slow DL
// @description Autostarts the slow download, removed the timer from manually clicking
// @namespace   NexusFastSlow
// @include     https://www.nexusmods.com/*/mods/*?tab=files&file_id=*
// @grant       none
// @run-at      document-idle
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/393763/Nexus%20Fast%20Slow%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/393763/Nexus%20Fast%20Slow%20DL.meta.js
// ==/UserScript==



(function () {
    var slow = $('#slowDownloadButton');
    var downloadUrl = slow.data('download-url');

    slow.text('Click to restart slow download');
    slow.off().click(function () {
        window.location.href = downloadUrl;
        $('.donation-wrapper > p').html('Your <span class="timer">slow</span> download was started manually.');
    });
    
    $('#fastDownloadButton, .subheader, .table thead, .table tbody').hide();

    $('.donation-wrapper').show();
    $('.donation-wrapper > p').html('Your <span class="timer">slow</span> download was started automatically.');

    window.location.href = downloadUrl;
})();
