// ==UserScript==
// @name         Recurbate downloa
// @version      1.1.4
// @description  Adds a download button for each video on recurbate.com/cc
// @author       razorwax
// @match        https://recu.me/
// @match        https://es.recu.me/
// @license MIT
// @namespace https://greasyfork.org/users/724632
// @downloadURL https://update.greasyfork.org/scripts/494527/Recurbate%20downloa.user.js
// @updateURL https://update.greasyfork.org/scripts/494527/Recurbate%20downloa.meta.js
// ==/UserScript==

function ErrorPrint(errorReason)
{
    var error = "Recurbate Download Error! [reason = " + errorReason + "]";
    console.error(error);
    window.alert(error);
}

function DownloadVideo(url)
{
    if (!url)
    {
        ErrorPrint("find_video_src_failure");
        return;
    }
    window.open(url, '_blank');
}

function FindSourceFromUnstartedVideo(videoBtn)
{
    // Find token and id
    var token = videoBtn.attr("data-token");
    var id = videoBtn.attr("data-video-id");
    if (token && id)
    {
        // Send video request to server
        var url = "/api/get.php?video="+id+"&token="+token;
        $.get(url, function(data)
        {
            // Find src from video tag in the response
            if (data.includes("<video") && data.includes("src="))
            {
                var src = data.match(/src=".*"/m);
                if (src.length > 0)
                {
                    // Get the source and download it
                    src = src[0];
                    src = src.substring(5, src.length - 1);
                    DownloadVideo(src);
                }
            }
            else
            {
                window.alert("Server blocked request, reason = " + data);
            }
        });
    }
    else
    {
        ErrorPrint("token_and_id_failure");
    }
}

function FindSourceFromStartedVideo()
{
    var foundVideo;
    var searchVideos = $("video");
    if (searchVideos.length == 1)
    {
        // Guess this is the video we are looking for
        foundVideo = searchVideos[0];
    }
    else
    {
        // Multiple videos found, search for the correct one
        var videoIdRegex = /video_\d+/;
        for (var video of searchVideos)
        {
            if (video.id.match(videoIdRegex))
            {
                foundVideo = video;
                break;
            }
        }
    }

    if (foundVideo)
    {
        var source = foundVideo.src;
        if (!source)
        {
            // Try to find video source by source element
            var sourceElem = $(foundVideo).find("source");
            if (sourceElem && sourceElem.length > 0)
            {
                source = sourceElem[0].src;
            }
        }
        DownloadVideo(source);
    }
    else
    {
        ErrorPrint("find_video_failure");
    }
}

function AddDownloadButton(appendToElem)
{
    var downloadBtn = $("<button style=\"margin-left: 10px;\" class=\"btn btn-warning btn-sm\"><b style=\"color:#212528\">Download</b></button>").appendTo(appendToElem);
    downloadBtn.on("click", function()
    {
        // Download button press
        var videoBtns = $("#play_button");
        if (videoBtns.length > 0)
        {
            // Found the unstarted video player, find src from it
            FindSourceFromUnstartedVideo($(videoBtns[0]));
        }
        else
        {
            // Video must have been started
            FindSourceFromStartedVideo();
        }
    });
}

// Create download button
$(function ()
{
    var addTo = $("a.bookmark");
    if (addTo.length == 1)
    {
        addTo = addTo.parent();
    }
    else
    {
        addTo = $("div.video-info").children("div");
    }

    if (addTo.length > 0)
    {
        AddDownloadButton($(addTo[0]));
    }
    else
    {
        ErrorPrint("add_download_btn_failure");
    }
});
