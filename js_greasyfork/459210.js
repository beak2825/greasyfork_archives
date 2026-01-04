// ==UserScript==
// @name GeoGuessr Lobby Random Map
// @namespace   gglrm
// @description Add a button to select a random map in a lobby
// @version 0.2
// @match https://www.geoguessr.com/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459210/GeoGuessr%20Lobby%20Random%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/459210/GeoGuessr%20Lobby%20Random%20Map.meta.js
// ==/UserScript==

var oldHref = document.location.href;

window.addEventListener("load", (event) => {
    checkPage();

    var bodyList = document.querySelector("body"),
        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    checkPage();
                }
            });
        });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
});

function checkPage() {
    if (location.pathname.split("/").length < 3 || !["duels", "team-duels", "battle-royale", "bullseye", "live-challenge"].includes(location.pathname.split("/")[1])) {
        return;
    }

    let label = document.querySelector("[class*=game-options_editableOption]")
    if (label === null) {
        return;
    }

    let divRef = label.querySelector("[class*=game-options_optionInput]")

    let div = document.createElement("div")
    div.classList.add(... divRef.classList)

    let button = document.createElement("button")
    button.type = "button"
    button.classList.add(... divRef.children[0].classList)
    button.innerText = "🔀"
    button.addEventListener("click", randomize)
    div.appendChild(button)

    label.appendChild(div)
}

function randomize() {
    fetch("https://www.geoguessr.com/api/v3/social/maps/browse/popular/random?count=1&page=0")
        .then(function (response) { return response.json() })
        .then(function (response) {
            let id = location.pathname.split("/")[2]
            let options = {mapSlug: response[0].id}
            let init = {
                method: "PUT",
                credentials: "include",
                async: true,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options)
            }
            fetch("https://game-server.geoguessr.com/api/lobby/" + id + "/options", init)
        })
}
