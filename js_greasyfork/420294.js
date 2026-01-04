// ==UserScript==
// @name         Acapela Box Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pay for the Yoda TTS I will not
// @author       alborrajo
// @match        https://acapela-box.com/AcaBox/index.php*
// @grant        unsafeWindow
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420294/Acapela%20Box%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420294/Acapela%20Box%20Downloader.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var $ = unsafeWindow.jQuery;

    let dlbutton = document.createElement("BUTTON");
    dlbutton.append("Free Download");
    dlbutton.onclick = function(evt) {
        unsafeWindow.SaveState();
        SendToVaaSFreeDownload();
        return false; // Dont reload
    }

    document.querySelector("div.StaticText:nth-child(2)").appendChild(dlbutton);

    // Listen/Download functions
    function SendToVaaSFreeDownload() {
        var voice=$("#acaboxvoice_cb").val();
        var voiceid=$("#acaboxvoice_cb option:selected").attr("data-id");
        var rate=parseInt($("#rate_slider").val()) + 180;
        var shaping=parseInt($("#shaping_slider").val()) + 100;
        var format=$("#audioformat_cb option:selected").text();
        var exportlinebyline=$("#exportlinebyline_checkbox").prop("checked") ? "1":"0";
        unsafeWindow.exportbyline=$("#exportlinebyline_checkbox").prop("checked") ? true: false;

        var text=$("#acaboxText").val();
        text="\\vct=" + shaping + "\\ \\spd=" + rate +  "\\ " + text;
        text=encodeURIComponent(text);
        voice=encodeURIComponent(voice);

        unsafeWindow.enable_UI(false);
        unsafeWindow.showWaitPopup(unsafeWindow.loc_processingtext);

        var codecMP3="0";
        if(unsafeWindow.audioMP3) {
            codecMP3="1";
        }

        $.ajax({
            processData:"true",
            async: true,
            type:"POST",
            url:'dovaas.php',
            dataType: "json",
            data: "text="+text+"&voice="+voiceid+"&listen="+unsafeWindow.listenmode+"&format="+format+"&codecMP3="+codecMP3+"&spd="+rate+"&vct="+shaping+"&byline="+(unsafeWindow.exportbyline?"1":"0")+"&ts="+unsafeWindow.timestamp,
            success: function(data) {
                unsafeWindow.hideWaitPopup();
                
                if(!data.hasOwnProperty("err_msg")) {
                    GM_download(data.snd_url, "tts.mp3"
                               );
                    console.log("Downloading "+data.snd_url);
                }
                else {
                    unsafeWindow.showErrorPopup(data.err_msg);
                }
                
                unsafeWindow.enable_UI(true);
            },
            error: function(e)
            {
                unsafeWindow.hideWaitPopup();
                var msg="Error:"+e.status+" "+e.statusText;
                unsafeWindow.showErrorPopup(msg);
                unsafeWindow.enable_UI(true);
            }
        });
    }

})();

