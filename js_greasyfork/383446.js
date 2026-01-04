// ==UserScript==
// @name         Anti AnimeFLV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://animeflv.ru/ver/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383446/Anti%20AnimeFLV.user.js
// @updateURL https://update.greasyfork.org/scripts/383446/Anti%20AnimeFLV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoId = location.href.match(/ver\/([^s]*)\//)[1];
    const url = "/get_video_info_v2?s=hserver";

    fetch(url, {
        method: 'POST', // or 'PUT'
        body: new URLSearchParams("embed_id=" + videoId)
    }).then(res => res.json())
      .then((res) => onFetched(res.value));

    function onFetched(videoFrame) {
        const header = document.querySelector(".CapiTop");

        header.querySelector(".Next").innerHTML = ">";
        header.querySelector(".Prev").innerHTML = "<";

        header.querySelector(".Next").className = "next";
        header.querySelector(".Prev").className = "prev";

        document.write("<html><head></head><body></body></html>");
        document.body.innerHTML = "<div id='main'></div>";

        const main = document.querySelector("#main");
        main.appendChild(header);

        const videoCont = document.createElement("div");
        videoCont.innerHTML = videoFrame;
        videoCont.id = "video_container";

        main.appendChild(videoCont);

        addCss();
    }

    function addCss() {
        let node = document.createElement("style");
        node.innerHTML = `
            body {
             background: #333;
             font-family: sans-serif;
             margin: 0;
             text-align: center;
color: white;
            }
a {
color: white;
text-decoration: none;
}

#video_container {
max-height: 60%;
margin: 0 auto;
}

.next, .prev {
display: inline-block;
border-radius: 50%;
background: white;
color: black;
    font-size: 35px;
    height: 35px;
    width: 35px;
    line-height: 35px;
}
        `;
        document.body.appendChild(node);
    }
})();