// ==UserScript==
// @name        Videos on CS:GO Stash
// @namespace   https://github.com/HatScripts/VideosOnCSGOStash
// @version     1.0.3
// @description Adds videos from CS:GO Skin Showcase (youtube.com/ffffinal) to CS:GO Stash (csgostash.com)
// @author      HatScripts
// @icon        http://csgostash.com/favicon.ico
// @include     http*://csgostash.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/16668/Videos%20on%20CS%3AGO%20Stash.user.js
// @updateURL https://update.greasyfork.org/scripts/16668/Videos%20on%20CS%3AGO%20Stash.meta.js
// ==/UserScript==

$(function () {
    $.searchVideos = function (query, maxVideos) {
        return $.getJSON("https://www.googleapis.com/youtube/v3/search", {
            key:        "AIzaSyBba67Fu_vuKllOeKXC4v4L4-7GXD93TTs",
            part:       "snippet",
            channelId:  "UCBdaeqYDYlS4mxgiemhjRAw",
            type:       "video",
            fields:     "items(id/videoId,snippet/title)",
            q:          query,
            maxResults: maxVideos
        });
    };

    $.addVideoLinks = function (searchResults) {
        resultBoxes.each(function () {
            var resultBox = $(this);
            var skinName = resultBox.find("h3:first").text().replace(/\\W/, "");
            var regex = new RegExp("^(\[Prototype\])?\\W*(?:StatTrak™ )?" + weapon
                + "\\W*" + skinName + "\\W*(.+?)?\\W*Skin Showcase$", "i");
            var videos = [];

            searchResults.items.forEach(function (video) {
                var groups = regex.exec(video.snippet.title);
                if (groups) {
                    groups.shift();
                    videos.push({
                        id:      video.id.videoId,
                        details: groups.filter(function (g) {
                            return g;
                        }).join(", ")
                    });
                }
            });
            videos.sort(function (a, b) {
                return a.details.localeCompare(b.details);
            }).forEach(function (video) {
                $.addVideoLink(resultBox, video.id, video.details);
            });
        });
    };

    $.addVideoLink = function (resultBox, videoId, details) {
        var a = $("<a>", {
            href:   "https://www.youtube.com/watch?v=" + videoId,
            target: "_blank"
        }).click(function (e) {
            var a = $(this);
            a.css("display", "none");
            $.embedVideoIn(a.parent(), videoId);
            e.preventDefault();
        }).append(
            $("<span>").addClass("glyphicon glyphicon-film")
        ).append("Load Skin Showcase Video");

        if (details) {
            details = details.replace(/ \(|\) /, " - ");
            a.append(" (" + details + ")");
        }
        resultBox.find(".details-link").append(
            $("<p>").append(a)
        );
    };

    $.embedVideoIn = function (element, videoId) {
        element.append(
            $("<div>").css({
                position:         "relative",
                "padding-bottom": "56.25%"
            }).append(
                $("<iframe>", {
                    src:             "https://www.youtube.com/embed/" + videoId
                                     + "?autoplay=1"       // Plays automatically
                                     + "&loop=1"           // Loops the video
                                     + "&showinfo=0"       // Hides video title
                                     + "&iv_load_policy=3" // Hides annotations
                                     + "&rel=0",           // Hides relevant videos
                    frameborder:     0,
                    allowfullscreen: ""
                }).css({
                    position: "absolute",
                    top:      0,
                    left:     0,
                    width:    "100%",
                    height:   "100%"
                })
            )
        );
    };

    var heading = $("h1:first").text();
    if (heading) {
        var weapon = heading.substr(0, heading.indexOf(" Skins"));
        var resultBoxes = $(".result-box");
        $.searchVideos(weapon, resultBoxes.length + 10).success($.addVideoLinks);
    }
});