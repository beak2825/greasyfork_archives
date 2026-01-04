// ==UserScript==
// @name            Twitch Refresh Homepage
// @name:de         Twitch Startseite aktualisieren
// @version         1.0.0
// @description     Updates the Thumbnail, Viewer Count, Title, Game and Live Status of the Recommended Channels on the Twitch Homepage
// @description:de  Aktualisiert das Vorschaubild, Zuschauerzahl, Titel, Spiel und Live-Status der empfohlenen Kanäle auf der Twitch Startseite
// @icon            https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/twitch-refresh-homepage
// @license         MIT
// @match           https://www.twitch.tv/*
// @require         https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/494170/Twitch%20Refresh%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/494170/Twitch%20Refresh%20Homepage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function init() {
        const list = document.querySelectorAll("main article:not(:has(.tw-channel-status-text-indicator[style*='display: none']))");

        for (let i = 0; i < list.length; i++) {
            const query = `query {
                user(login: \"${list[i].querySelector("p").innerText}\") {
                    id
                    login
                    displayName
                    description
                    createdAt
                    roles {
                        isPartner
                    }
                    stream {
                        id
                        title
                        type
                        viewersCount
                        createdAt
                        game {
                            name
                        }
                    }
                }
            }`.replaceAll("\n", "").replaceAll("\t", " "); // Thanks to https://github.com/mauricew/twitch-graphql-api/blob/master/USAGE.md

            let data = await axios.post("https://gql.twitch.tv/gql", {
                query: query,
                variables: {}
            }, {
                headers: {
                    "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
                    "Content-Type": "application/json"
                }
            });
            data = data.data.data.user;

            if (data?.stream) { // Stream online
                data = data.stream;

                // Title
                list[i].querySelector("h3").innerText = data.title;
                list[i].querySelector("h3").title = data.title;

                // Game
                if (list[i].querySelector("p a")) { // Recommended <Game>-Channel Section doesn't have game paragraph
                    list[i].querySelector("p a").innerText = data.game.name;
                    list[i].querySelector("p a").href = `https://www.twitch.tv/directory/category/${data.game.name.toLowerCase().replaceAll(" ", "-")}`;
                }

                // Viewers Count
                list[i].querySelector(".tw-media-card-stat").innerText = `${data.viewersCount.toLocaleString()} ${list[i].querySelector(".tw-media-card-stat").innerText.split(" ").slice(1).join(" ")}`;

                // Thumbnail
                const img = list[i].querySelector("img:nth-child(2)");
                const url = new URL(img.src);
                img.src = `${url.origin}${url.pathname}?t=${Date.now()}`;
            } else { // Stream offline
                list[i].querySelector(".tw-channel-status-text-indicator").style.display = "none";
            }
        }
    }

    window.setInterval(init, 30000);
})();