// ==UserScript==
// @name        Rule34 Preview Videos
// @namespace   VideoPreview
// @match     https://rule34.xxx/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     0.2
// @author      Zeus
// @license     MIT
// @description Rule34 Video Preview
// @downloadURL https://update.greasyfork.org/scripts/530224/Rule34%20Preview%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/530224/Rule34%20Preview%20Videos.meta.js
// ==/UserScript==

var cdn = "https://api-cdn-us-mp4.rule34.xxx/"

/*           *CDN Location*
If you have problems with loading videos you can try other servers here

Chicago, IL, USA:    https://uswebm.rule34.xxx/
New York, NY, USA:   https://nymp4.rule34.xxx/
Phoenix, AZ, USA:    https://ahrimp4.rule34.xxx/
Netherlands:         https://ws-cdn-video.rule34.xxx/
Netherlands:         https://wwebm.rule34.xxx/
Default:             https://api-cdn-us-mp4.rule34.xxx/
*/

jQuery(document).ready(function ($) {
    $(".image-list .thumb").each(function () {
        var container = $(this);
        var link = container.find('img').attr('src');
        var img = container.find('img')
        var classlink = container.find('img').attr('class')
        if (link && classlink == 'preview webm-thumb') {
            var first = false;
            var videoCreated = "";
            var TimeOut;
            container.on("mouseenter", function () {
                TimeOut = setTimeout(function () {
                    if (first == false) {
                        var videoUrl = cdn+"/images/"+link;
                        var videoUrlCleaned = videoUrl.replace("https://wimg.rule34.xxx/thumbnails/", "").replace("thumbnail_", "").replace("jpg", "mp4");
                        videoCreated = $('<video muted autoplay controls style="max-width:100%; height:auto;" poster = "'+link+'" preload="metadata"><source src="' + videoUrlCleaned + '" type="video/mp4"></video>');
                        container.append(videoCreated);
                        videoCreated.css("position", "relative"); videoCreated.css("opacity", 0); videoCreated.css("width", 0);
                        first = true;
                    }
                    img.css("opacity", 0);
                    videoCreated.css("opacity", 1); videoCreated.css("width", "auto"); videoCreated.get(0).play();
                }, 500);
            });
            container.on("mouseleave", function () {
                clearTimeout(TimeOut);
                img.css("opacity", 1)
                videoCreated.css("opacity", 0); videoCreated.css("width", 0); videoCreated.get(0).stop();
            });
        }
    });
});

//THANKS FOR SUPPORT: SepiaMoon
