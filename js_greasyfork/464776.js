// ==UserScript==
// @name         Tweet Embed
// @namespace    websight.blue
// @version      0.1
// @description  Embed twitter links on bLUE
// @author       cykage
// @match        https://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464776/Tweet%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/464776/Tweet%20Embed.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function embedTweet(link) {
        const tweetLink = link.href
        const tweetDiv = document.createElement("div")
        const twtScript = document.createElement("script")

        twtScript.src = "https://platform.twitter.com/widgets.js"
        twtScript.id = "twtScript"

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://publish.twitter.com/oembed?url=${tweetLink}&omit_script=1`,
            responseType: "json",
            onload: function (data) {
                tweetDiv.innerHTML = JSON.parse(data.responseText).html
                link.after(tweetDiv)

                //add tweet script
                if (document.querySelector('#twtScript') === null) {
                    document.querySelector('body script').after(twtScript)
                }

            }
        })
    }

    const links = document.querySelectorAll('div.message-contents p a')

    links.forEach(link => {
        if (link.href.includes("https://twitter.com") || link.href.includes("https://mobile.twitter.com")) {
            embedTweet(link)
        }
    })

    //livelinks
    const observer = new MutationObserver(function (mutations_list) {
        mutations_list.forEach(function (mutation) {
            if (mutation.addedNodes[1]?.classList?.contains('message-container')) {
                const links = mutation.addedNodes[1].querySelectorAll('.message a')
                links.forEach(link => {
                    if (link.href.includes("https://twitter.com") || link.href.includes("https://mobile.twitter.com")) {
                        //remove twitter script so it runs again on new post
                        document.querySelector('#twtScript').remove()
                        embedTweet(link)
                    }
                })
            }

        });
    });

    observer.observe(document.querySelector('#messages'), { childList: true });

})();