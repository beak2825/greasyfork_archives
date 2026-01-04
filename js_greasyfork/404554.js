// ==UserScript==
// @name        Nitter Image Saver
// @author      aloneunix
// @namespace   https://twitter.com/aloneunix
// @description Script to download tweet images in one click.
// @include     https://nitter.net/*
// @grant       GM_download
// @version     1.1
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404554/Nitter%20Image%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/404554/Nitter%20Image%20Saver.meta.js
// ==/UserScript==
var NitterImageSaver;
(function (NitterImageSaver) {
    function toISOLocal(d) {
        var z = n => ('0' + n).slice(-2);
        var zz = n => ('00' + n).slice(-3);
        var off = d.getTimezoneOffset();
        var sign = off < 0? '+' : '-';
        off = Math.abs(off);

        return d.getFullYear() + '-' +
            z(d.getMonth()+1) + '-' +
            z(d.getDate()) + 'T' +
            z(d.getHours()) + ':' +
            z(d.getMinutes()) + ':' +
            z(d.getSeconds()) + '.' +
            zz(d.getMilliseconds()) +
            sign + z(off/60|0) + ':' + z(off%60);
    }
    function getFileExtension(url) {
        var u = new URL(url);
        return u.pathname.split('.').pop();
    }
    function getFilename(tweet, url, index) {
        var a = tweet.querySelector("span.tweet-date > a");
        var s = a.pathname.split("/");
        var username = s[1];
        var tweet_id = s[3];
        var fucked_up_ts = a.title.split(",")[0].split("/");
        var date = new Date(parseInt(fucked_up_ts[2], 10),
                            parseInt(fucked_up_ts[1], 10) - 1,
                            parseInt(fucked_up_ts[0], 10));

        var formatted_date = toISOLocal(date).slice(0,10);

        var extension = getFileExtension(url);
        var _index = index !== undefined ? "_"+index : "";
        var filename = `${username}_${formatted_date}_${tweet_id}${_index}.${extension}`;
        return filename;
    }

    function addBtn(tweet) {
        var attachments = tweet.getElementsByClassName("attachments");
        if (attachments.length == 0) return;

        // console.log(tweet);
        tweet = tweet.getElementsByClassName("tweet-body")[0];

        // create button
        var dlbtn = document.createElement("a");
            dlbtn.style = "pointer-events: all; cursor: pointer;";
            dlbtn.textContent = "Download attachments";

        tweet.insertBefore(dlbtn, tweet.lastElementChild);

        dlbtn.onclick = function() {
            // get media
            var pic_urls = [];
            var imgs = attachments[0].querySelectorAll(".attachments a.still-image");
            for (var j = 0; j < imgs.length; j++) {
                var picurl = imgs[j].href;
                var origurl = 'https://pbs.twimg.com/' + decodeURIComponent(picurl.split("/pic/")[1]);
                pic_urls.push(origurl);
            }

            // download
            if (pic_urls.length == 1) {
                console.log(pic_urls[0]);
                GM_download({url: pic_urls[0], name: getFilename(tweet, pic_urls[0])});
            } else {
                pic_urls.forEach(function (mediaUrl, i) {
                    console.log(mediaUrl);
                    GM_download({url: mediaUrl, name: getFilename(tweet, mediaUrl, i+1)});
                });
            }
        };
    }

    document.querySelectorAll("div.timeline-item").forEach(function (tweet) {
        addBtn(tweet);
    });
})(NitterImageSaver || (NitterImageSaver = {}));
