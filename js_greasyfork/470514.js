// ==UserScript==
// @name         Bing Direct Link
// @namespace    http://github.com/benyaminl
// @version      0.14
// @description  This script is for removing Bing Redirect link, but this doesn't support privacy, as it fetch the redirect result of the URL
// @author       Benyamin Limanto
// @match        https://www.bing.com/search*
// @icon         https://icons.duckduckgo.com/ip2/bing.com.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470514/Bing%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/470514/Bing%20Direct%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceTheRestOfURL() {
        var urls = document.querySelectorAll("a[href*='https://www.bing.com/ck']:not(.b_logoArea)");
        for(i=0;i < urls.length; i++)
        {
            let url = urls[i];
            fetch(url.href)
                .then(r => r.text())
                .then(d => {
                try {
                    let realUrl = d.match(/https:\/\/.+/i)[0].replace("\";","");

                    url.href = realUrl;
                }
                catch(e)
                {
                    console.log(e);
                }
            });
        }
    }

    var urlBody = document.querySelectorAll(".tilk");
    var i = -1;
    for(i=0; i < urlBody.length; i++)
    {
        let url = urlBody[i];
        let stringUrl = url.querySelector("cite");

        fetch(url.href)
            .then(r => r.text())
            .then(d => {
            let realUrl = d.match(/https:\/\/.+/i)[0].replace("\";","");
            let h2Url = url.parentNode.parentNode.querySelector("h2 a");
            h2Url.href = realUrl;
        });
    }

    var urlCard = document.querySelectorAll(".rd_sg_ttl");
    for(i=0; i < urlCard.length; i++)
    {
        let url = urlCard[i];
        let cite = urlCard[i].parentNode.querySelector("cite");

        fetch(url.querySelector("a").href)
            .then(r => r.text())
            .then(d => {
            let realUrl = d.match(/https:\/\/.+/i)[0].replace("\";","");
            url.querySelector("a").href = realUrl;
        });

    }

    replaceTheRestOfURL();

    // Hook for rest dynamic part of page, using timeout
    document.querySelector("#b_results").addEventListener("click", function(e) {
        let target = e.target;

        console.log("clicked");
        let counter = 0;
        let check = setInterval(function() {
            replaceTheRestOfURL();
            counter++;
            if (counter > 5)
            {
                console.log("stopped");
                clearInterval(check);
            }

        }, 1000);
    });

})();