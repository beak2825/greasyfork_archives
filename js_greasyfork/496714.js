// ==UserScript==
// @name         FMovies Forced Fullscreen
// @description  Stay Fullscreen while using autoplay. (Press ESC to exit)
// @version      1.3
// @require      http://code.jquery.com/jquery-latest.js
// @match      https://fmovies.to/tv/*
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/496714/FMovies%20Forced%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/496714/FMovies%20Forced%20Fullscreen.meta.js
// ==/UserScript==

(function () {
    const fullScreenBtn = document.createElement("div");
    const fullScreenBtnContent = document.createTextNode("Stay Fullscreen");
    fullScreenBtn.id = "fullscreen-btn";
    fullScreenBtn.classList.add("item");
    fullScreenBtn.appendChild(fullScreenBtnContent);

    const bottomButtons = document.querySelector(".c-items");
    bottomButtons.appendChild(fullScreenBtn);

    fullScreenBtn.addEventListener("click", function () {
        var elem = document.getElementById("player");
        var fn =
            elem.requestFullscreen ||
            elem.mozRequestFullScreen ||
            elem.webkitRequestFullscreen ||
            elem.msRequestFullscreen;

        if (fn) {
            fn.call(elem);
        }
    });


    function receiveMessage(e) {
        let visibleEpisodes = ("ul.episodes:visible");
        let episodeLinks = Array.from(visibleEpisodes.find("a"));
        let lastEpisode = episodeLinks[episodeLinks.length - 1];

        let r = e.message || e.data || e.originalEvent.data;
        let p = JSON.parse(r);
        console.log(p);

        if (lastEpisode.classList.contains("active")) {
            if (p.event === "PLAY_COMPLETED") {
                let currentSeason = visibleEpisodes.attr("data-season");
                let nextSeason =
                    ("ul.episodes").find(":visible").prevObject[currentSeason];
                if (typeof nextSeason !== "undefined") {
                    nextSeason.querySelector("a").click();
                } else {
                    let firstSeason = ("ul.episodes").find(":visible").prevObject[0];
                    firstSeason.querySelector("a").click()
                }
            }
        }
    }

    window.addEventListener("message", receiveMessage);
})();
