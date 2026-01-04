// ==UserScript==
// @name        Mp4Hydra Movie/Video Downloader
// @namespace   https://greasyfork.org/
// @version     1.14
// @description Adds a movie download button to the mp4hydra.org video player. Clicking the button will start the download of the mp4 video file.
// @author      paleocode
// @match       https://mp4hydra.org/movie/*
// @icon        https://mp4hydra.org/favicon-32x32.png
// @license     MIT
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/484039/Mp4Hydra%20MovieVideo%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/484039/Mp4Hydra%20MovieVideo%20Downloader.meta.js
// ==/UserScript==
(function () {
    if (document.title === 'Movie Not Found | Mp4Hydra.org') {
        return;
    }
    function getVideoSrc() {
        var player = document.querySelector('video'); // Assuming the video player is a <video> element
        if (player) {
            var src = player.src;
            console.log("Source: " + src);
            return src;
        }
        return null;
    }
    var button = Object.assign(document.createElement('button'), {
        innerHTML: 'Download',
        title: 'Download Movie',
        style: 'display: inline-block;margin: 0 0 0 10px; color: #000;',
        onclick: function () {
            var videoSrc = getVideoSrc();
            if (videoSrc) {
                var link = document.createElement("a");
                link.href = videoSrc + '?dl=dl';
                link.setAttribute('download', 'video.mp4'); // Set a default filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.log("Unable to find video source.");
            }
        }
    })
    const interval = setInterval(function () {
        var vcount = document.querySelector('#vcount > small');
        if (!vcount || vcount.innerText === "---") return;
        clearInterval(interval);
        document.querySelector('#vbar').appendChild(button);
    }, 100);
})();