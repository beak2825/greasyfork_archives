// ==UserScript==
// @name         Better FMovies
// @description  Stay Fullscreen and Switch to Next Season on Last Episode
// @version      0.1.4
// @require      http://code.jquery.com/jquery-latest.js
// @include      /https?://(www\.)?fmoviesz\.to\/tv/
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1235006
// @downloadURL https://update.greasyfork.org/scripts/482412/Better%20FMovies.user.js
// @updateURL https://update.greasyfork.org/scripts/482412/Better%20FMovies.meta.js
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

    const addSkipTimeBtn = document.createElement("div");
    addSkipTimeBtn.classList.add("item");
    const addSkipTimeBtnContent = document.createTextNode("Add skip time");
    addSkipTimeBtn.appendChild(addSkipTimeBtnContent);

    let skipTime;
    addSkipTimeBtn.addEventListener("click", function () {
        let skipTimeRaw = prompt(
            "Please enter a valid time for when intro ends (00:00:00):"
        );
        let a = skipTimeRaw.split(":");
        skipTime = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    });

    bottomButtons.appendChild(addSkipTimeBtn);

    function receiveMessage(e) {
        let visibleEpisodes = $("ul.episodes:visible");
        let episodeLinks = Array.from(visibleEpisodes.find("a"));
        let lastEpisode = episodeLinks[episodeLinks.length - 1];

        let r = e.message || e.data || e.originalEvent.data;
        let p = JSON.parse(r);
        console.log(p);

        if (p.event === "META_LOADED") {
            if (skipTime) {
                document
                    .querySelector("#player iframe")
                    .contentWindow.postMessage(
                        JSON.stringify({
                            cmd: "SEEK",
                            value: skipTime,
                        }),
                        "*"
                    );
            }
        }

        if (lastEpisode.classList.contains("active")) {
            if (p.event === "PLAY_COMPLETED") {
                let currentSeason = visibleEpisodes.attr("data-season");
                let nextSeason =
                    $("ul.episodes").find(":visible").prevObject[currentSeason];
                if (typeof nextSeason !== "undefined") {
                    nextSeason.querySelector("a").click();
                } else {
                    let firstSeason = $("ul.episodes").find(":visible").prevObject[0];
                    firstSeason.querySelector("a").click()
                }
            }
        }
    }

    window.addEventListener("message", receiveMessage);
})();
