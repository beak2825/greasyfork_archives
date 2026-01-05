// ==UserScript==
// @name           MyFreeCams PVT video link adder
// @version        1.2
// @description    Adds links to privates in your chat log (see picture) http://i.imgur.com/UM0A50S.jpg
// @author         Camgurlfan
// @compatible     tested with chromium and opera (/w tampermonkey)
// @updateurl      https://greasyfork.org/scripts/17170-myfreecams-pvt-video-link-adder/code/MyFreeCams%20PVT%20video%20link%20adder.user.js
// @run-at         document-end
// @include        http://www.myfreecams.com/php/chat_logs.php*
// @include        https://www.myfreecams.com/php/chat_logs.php*
// @icon           http://a.mfcimg.com/mfc2/images/icons/png/archive.16x16.png
// @grant          unsafeWindow
// @grant          GM_addStyle
// @namespace      https://greasyfork.org/users/30835
// @downloadURL https://update.greasyfork.org/scripts/17170/MyFreeCams%20PVT%20video%20link%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/17170/MyFreeCams%20PVT%20video%20link%20adder.meta.js
// ==/UserScript==

/*******************************************************************************************************************
                                                  chat logs
*******************************************************************************************************************/
if (location.href.indexOf('myfreecams.com/php/chat_logs.php') != -1) {
    unsafeWindow.GetLog.LoadJWPlayer = function() {
        var V1_FLV = (0); // 0:  FLV (Legacy format, older archive)
        var V1_F4V = (1 << 0); // 1:  F4V (Legacy format, older archive)
        var V2_NONE = (1 << 1); // 2:  No Recorded files
        var V2_FLV = (1 << 2); // 4:  FLV Recorded by FMS/Wowza
        var V2_F4V = (1 << 3); // 8:  F4V Recorded by FMS
        var V2_MP4X = (1 << 4); // 16: Transcoded MP4 (Some other F4V or FLV bit set)
        var V2_MP4W = (1 << 5); // 32: MP4 Recorded by Wowza (not a transcode)

        var aMatches = GetLog.sArchiveFile.match(/\.(\w{3})$/);
        var sFormat = aMatches[1];

        var size = VideoResize.GetSize();
        var isPlaying = false;
        var isBuffering = false;
        var hasError = false;

        oSources = [];

        if (GetLog.bUseFallbackArchive) {
            var aMatches;
            if (aMatches = GetLog.sFallbackArchive.match(/\.(\w{3})$/)) {
                var sFallbackFormat = aMatches[1];
                oSources.push({
                    file: GetLog.sFallbackArchive,
                    label: sFallbackFormat + ' fallback'
                });
            }
        } else {
            oSources.push({
                file: GetLog.sArchiveFile,
                label: sFormat
            });
        }
        console.log("Loading " + oSources[0].file);
        var fFallback = function() {
            if (GetLog.sArchiveFormat & V2_MP4X && !GetLog.bUseFallbackArchive) {
                GetLog.bUseFallbackArchive = true;
                aMatches = GetLog.sFallbackArchive.match(/\.(\w{3})$/);
                var sFallbackFormat = aMatches[1];
                console.log('JWPlayer MP4 Fallback ' + ("fallback to " + sFallbackFormat + " , file: " + GetLog.sArchiveFile));
                g_oReportBack.Send('JWPlayer MP4 Fallback', ("fallback to " + sFallbackFormat + " , file: " + GetLog.sArchiveFile));
                GetLog.LoadJWPlayer();
            }
        };
        jwplayer('mediaplayer').setup({
            sources: oSources,
            autostart: true,
            base: '/vendor/swf/',
            height: size.height,
            width: size.width
        });
        jwplayer('mediaplayer').onSetupError(
            function(err) {
                console.log(err);
                hasError = true;
                g_oReportBack = new MfcReportBack('chat_logs');
                g_oReportBack.Send('JWPlayer SetupError', (err.message + ", file: " + GetLog.sArchiveFile));
            }
        );
        jwplayer('mediaplayer').onError(
            function(err) {
                console.log(err);
                hasError = true;
                g_oReportBack = new MfcReportBack('chat_logs');
                g_oReportBack.Send('JWPlayer Error', (err.message + ", file: " + GetLog.sArchiveFile));
                fFallback();
            }
        );
        jwplayer('mediaplayer').onBuffer(
            function(info) {
                console.log(info);
                isBuffering = true;
            }
        );
        jwplayer('mediaplayer').onPlay(
            function(info) {
                console.log(info);
                isPlaying = true;
            }
        );
        setTimeout(function() {
            if (isPlaying === false && hasError === false) {
                g_oReportBack = new MfcReportBack('chat_logs');
                var message;
                if (isBuffering)
                    message = "file buffered but did not play within 10 secs. , file: " + GetLog.sArchiveFile;
                else
                    message = "file did not play or buffer within 10 secs. , file: " + GetLog.sArchiveFile;

                console.log('JWPlayer Observation: ' + message);
                g_oReportBack.Send('JWPlayer Observation', message);
                fFallback();
            }
        }, 5000);
        var oChatArea;
        if (oChatArea == document.getElementById('chat_area'))
            oChatArea.height = (size.client_height - size.height - 200);
        console.log(GetLog.sArchiveFile);
    };
    unsafeWindow.GetLog.Response = function() {
        if (g_oReq.readyState != 4) return;
        document.getElementById('log_contents').style.heigth = '400px';
        var sRes = g_oReq.responseText;
        if (g_UA.IE <= 7) {
            sRes = sRes.replace(/<div id=mediaplayer>[^<]*<\/div>/, "<div style='padding:20px;'>Archives are no longer viewable with Internet Explorer versions 6 or 7 as it does not support modern video compression.<br><br> Please <a href=http://windows.microsoft.com/en-us/internet-explorer/browser-ie target=_blank>update Internet Explorer</a>, or consider <a href=https://www.google.com/intl/en/chrome/browser/ target=_blank>installing Google Chrome</a> as an alternative.</div>");
        }
        document.getElementById('log_contents').innerHTML = sRes;
        GetLog.bUseFallbackArchive = false;
        var aMatches;
        if (aMatches = sRes.match(/archive_format:(\d+)/)) {
            GetLog.sArchiveFormat = aMatches[1];
        }
        if (aMatches = sRes.match(/fallback_archive:([^\s\-]*)/)) {
            GetLog.sFallbackArchive = decodeURIComponent(aMatches[1]);
        }
        if (aMatches = sRes.match(/JWPlayer:([^<]*)/)) {
            GetLog.sArchiveFile = decodeURIComponent(aMatches[1]);
            GetLog.LoadJWPlayer();
        }
        var downloadLink = document.createElement("a");
        downloadLink.href = GetLog.sArchiveFile;
        downloadLink.setAttribute("title", GetLog.sArchiveFile);
        downloadLink.innerHTML = "DOWNLOAD " + GetLog.sArchiveFile.match(/[^/]+$/gi).toString();
        downloadLink.setAttribute("style", "float:left;text-transform: uppercase;padding: 1px 8px;text-decoration: none; border-radius: 8px;font-size: 9px; font-variant: small-caps;margin: 1px 4px;");
        downloadLink.style.border = "1px white solid";
        downloadLink.style.backgroundColor = "green";
        downloadLink.style.color = "white";
        downloadLink.addEventListener("mouseout", function() {
            downloadLink.style.border = "1px green solid";
            downloadLink.style.backgroundColor = "white";
            downloadLink.style.color = "green";
        });
        downloadLink.addEventListener("mouseover", function() {
            downloadLink.style.border = "1px white solid";
            downloadLink.style.backgroundColor = "green";
            downloadLink.style.color = "white";
        });
        if (document.querySelector("#chat_area > div > span.chat_log_index_private_session")) {
            document.querySelector("#chat_area > div > span.chat_log_index_private_session").appendChild(downloadLink);
        } else {
            document.querySelector("#chat_area > div").appendChild(downloadLink);
        }
        VideoResize.Execute();
    };
}