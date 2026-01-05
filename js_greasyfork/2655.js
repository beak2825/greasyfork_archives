// ==UserScript==
// @name        Amazon Cloud Player unchain download button
// @namespace   http://sebastian.gellweiler.net
// @version     2.0.1
// @grant       none
//
//
// @include https://www.amazon.*/gp/dmusic/cloudplayer*
// @include http://www.amazon.*/gp/dmusic/cloudplayer*
//
// @description Will unchain download buttons in Amazon Cloud Player so that you can download multiple songs on Linux and other platforms without Amazon Downloader. The resulting files can be opened with clamz or pymazon.
// @downloadURL https://update.greasyfork.org/scripts/2655/Amazon%20Cloud%20Player%20unchain%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/2655/Amazon%20Cloud%20Player%20unchain%20download%20button.meta.js
// ==/UserScript==
(function () {
    
    // Hide annoying cloud player advertisments on windows
    // and hide download button.
    jQuery(document).ready(function () {
jQuery('<style type="text/css">' +
    '#messageBanner, #cloudPlayerOverlay, .download' + "\n" +
    '{display: none !important; }' + "\n" +
'</style>').appendTo("head");
    });
    
    function bypassDownloader() {
        // Remove annoying popups and overlay.
        setTimeout(function() {
           jQuery('.ap_popover').hide();
           jQuery('#ap_overlay').hide();
        }, 200);

        // Submit download form.
        jQuery('#downloader').submit();       
    }

    /**
     * Replace old download links with new ones.
     */
    function downloadLinks() {
        // Try to replace download button in toolbar.
        // Ignore buttons that have been already replaced.
        var db = jQuery('.download:not(".replacedByNew")');
        db
        .addClass('replacedByNew')
        .after(
            jQuery('<span>', {                    
                text: db.text(),
                class: 'decoration buttonCenter',
                
                click: function () {
                    // Click on the old download button
                    // to submit the download form.
                    db.click();
                    // Only workaround amazon downloader if multiple songs are selected.
                    if (jQuery('input[itemtype=song]:checked').length > 1) {
                        bypassDownloader();
                    }
                }
            })
        );
        
        // Skip stupid installing cloud player advertisment on windows
        // when downloading single tracks.
        jQuery('.skipInstall').click();
        
        // Hide download album links because they do not work.
        jQuery('[href^="#download\/album"]').hide();
    }

    // @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
    jQuery.noConflict();

    // Constantly check if downloads links are replaced on the pages.
    setInterval(function () {
        downloadLinks();
    }, 1000);
}());
