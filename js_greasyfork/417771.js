// ==UserScript==
// @name         GogoAnime++
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Replaces the download link with a direct download link.
// @author       Arjix
// @match        *://*.gogoanime.vc/*
// @match        *://*.gogoanime.tv/*
// @match        *://*.gogoanime.io/*
// @match        *://*.gogoanime.in/*
// @match        *://*.gogoanime.se/*
// @match        *://*.gogoanime.sh/*
// @match        *://*.gogoanime.video/*
// @match        *://*.gogoanime.movie/*
// @match        *://*.gogoanime.so/*
// @match        *://*.gogoanimes.co/*
// @match        *://*.gogoanime.ai/*
// @match        *://*.animego.to/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab

// @downloadURL https://update.greasyfork.org/scripts/417771/GogoAnime%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/417771/GogoAnime%2B%2B.meta.js
// ==/UserScript==


// https://ourcodeworld.com/articles/read/682/what-does-the-not-allowed-to-navigate-top-frame-to-data-url-javascript-exception-means-in-google-chrome
function debugBase64(base64URL){
    var win = window.open();
    win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

(function() {
    'use strict';
    window.addEventListener("load", function () {
        const title = document.title
        const test = document.querySelector('div#load_recent_release')
        if (title.includes("Watch") && test == undefined) {
        const link = document.querySelector("li.dowloads").firstChild.href
        var ret = GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function(res) {
                var videoLinks = Array.from(res.response.matchAll(/<a\n.*?[\"'](http.*?)['\"].*?\n.*?(\(.*?\))/gm))
                var qualities = []
                videoLinks.forEach(link => {
                    let quality;
                    if (link[2].includes("720")) {
                        quality = 720
                    } else if (link[2].includes("480")) {
                        quality = 480
                    } else if (link[2].includes("360")) {
                        quality = 360
                    } else if (link[2].includes("HD") || link[2].includes("1080")) {
                        quality = 1080
                    }
                    let obj = {}
                    obj["src"] = link[1]
                    obj["size"] = quality
                    obj["type"] = "video/mp4"
                    qualities.push(obj)
                })
                qualities.sort((a, b) => (a.size > b.size ? 1 : -1))
                qualities = qualities.reverse();
                console.log(qualities)
                var videoLink = videoLinks[0][1]
                const title = document.querySelector("div.anime_video_body > h1").innerText.replace(" at gogoanime", "") + ".mp4"

                var downloadButton = document.querySelector("li.dowloads").firstChild
                downloadButton.href = videoLink
                downloadButton.target = "_self"
                downloadButton.download = title
                document.querySelector("li.dowloads > a > span").innerText = "Direct Download"

                const css = `
                    video {
                        --plyr-color-main: #ffc119;
                    }
                `

                const headJs = `
                    function initialize() {
                        const playerPlr = new Plyr(document.querySelector("video"));
                        playerPlr.source = {
                            type: 'video',
                            title: '${title}',
                            sources: ${JSON.stringify(qualities)}
                        };
                    };

                `

                const js = `
                    <script>
                        const title = document.createElement("title");
                        title.innerHTML="${title}";
                        document.head.appendChild(title);

                        const link = document.createElement("link");
                        link.href = "https://cdn.plyr.io/3.6.3/plyr.css";
                        link.rel="stylesheet";
                        link.type="text/css";
                        document.head.appendChild(link);


                        const style = document.createElement("style");
                        style.innerHTML = \`${css}\`;
                        document.head.appendChild(style);

                        const script = document.createElement('script');
                        script.innerHTML = \`${headJs}\`;
                        document.head.appendChild(script);

                        const plyrJs = document.createElement("script");
                        plyrJs.src = "https://cdnjs.cloudflare.com/ajax/libs/plyr/3.6.3/plyr.polyfilled.js";
                        plyrJs.type="text/javascript";
                        plyrJs.onload = initialize;
                        document.head.appendChild(plyrJs);
                    </script>
                `
                const header = "data:text/html,"
                const html = `<video width="1080" height="1920" controls data-plyr-config='{ "quality": {"default": 1080} }'></video>${js}`
                const linkPopUp = header+encodeURIComponent(html)
                const watchLink = `
                <div class="anime_video_note_watch">
                    Please, <a href="#" class="watchWithPlyr">watch on another window with plyr.</a> if you can't watch the video
                </div>
                `
                document.querySelector("div.anime_video_body > div.anime_video_body_cate > div.anime_video_note_watch").outerHTML = watchLink
                document.querySelector(".watchWithPlyr").onclick = () => {GM_openInTab(linkPopUp, {active: true})}
  }
})}
    }, false)
})();