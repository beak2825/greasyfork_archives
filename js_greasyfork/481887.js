// ==UserScript==
// @name         Fix Discord embeds
// @namespace    zezombye.dev
// @version      0.1
// @description  Automatically replace reddit and twitter (vxtwitter) embeds by the official, iframe-based embeds.
// @author       Zezombye
// @match        https://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481887/Fix%20Discord%20embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/481887/Fix%20Discord%20embeds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("message", (event) => {
        //console.log(event);
        if (event.origin === "https://platform.twitter.com" && event.data["twttr.embed"].method === "twttr.private.resize") {
            document.getElementById(event.data["twttr.embed"].id).height = event.data["twttr.embed"].params[0].height;
        }
    })

    setInterval(function() {
        let embedWrappers = document.getElementsByClassName("embedWrapper_c143d9")
        for (var embedWrapper of embedWrappers) {
            if (embedWrapper.classList.contains("fixed-embed")) {
                continue;
            }
            if (embedWrapper?.children[0]?.children[0]?.querySelector(".embedProvider_cfa718")?.children[0].textContent === "vxTwitter / fixvx") {
                var tweetId = embedWrapper.children[0].children[0].querySelector(".embedTitle__31740").children[0].href;
                tweetId = tweetId.split("/")[5];
                tweetId = tweetId.split("?")[0];
                tweetId = tweetId.split("#")[0];
                let iframe = document.createElement("iframe")
                iframe.id = "twitter-iframe-"+tweetId+"-"+crypto.randomUUID();
                iframe.frameborder = 0;
                iframe.allowtransparency = true;
                iframe.allowfullscreen = true;
                iframe.scrolling = "no";
                iframe.src = `https://platform.twitter.com/embed/Tweet.html?dnt=true&embedId=${iframe.id}&frame=false&hideCard=false&hideThread=false&id=${tweetId}&lang=en&theme=dark&widgetsVersion=b2c2611296916%3A1702048662315&width=520px`
                iframe.width = 520;
                iframe.height = 300;
                embedWrapper.replaceChildren(iframe);
                embedWrapper.classList.add("fixed-embed");
                embedWrapper.classList.remove("embedFull__8dc21");

            } else if (embedWrapper?.children[0]?.children[0]?.querySelector(".embedProvider_cfa718")?.children[0].textContent === "Reddit") {
                var redditPost = embedWrapper.children[0].children[0].querySelector(".embedTitle__31740").children[0].href;
                redditPost = redditPost.match(/\/r\/\w+\/comments\/\w+\/\w+/);
                let iframe = document.createElement("iframe");
                iframe.id = "reddit-iframe-"+crypto.randomUUID();
                iframe.frameborder = 0;
                iframe.scrolling = "no";
                iframe.allowfullscreen = true;
                iframe.width = 520;
                iframe.height = 300;
                iframe.style = "border-radius: 8px;";
                iframe.sandbox = "allow-scripts allow-same-origin allow-popups";
                iframe.src = `https://embed.reddit.com${redditPost}/?embed=true&theme=dark&locale=en-EN`
                embedWrapper.replaceChildren(iframe);
                embedWrapper.classList.add("fixed-embed");
                embedWrapper.classList.remove("embedFull__8dc21");

                window.addEventListener("message", (event) => {
                    //console.log(event);
                    if (event.source === iframe.contentWindow) {
                        let eventData = JSON.parse(event.data)
                        if (eventData.type === "resize.embed") {
                            iframe.height = eventData.data;
                        }
                    }
                })
            }
        }
    }, 100);
})();