// ==UserScript==
// @name         Voir les OPGGax des délus
// @version      1.1
// @description  pour voir les OPGG des délus
// @author       Craftbukkit
// @match        https://www.jeuxvideo.com/forums/0-19163-0-*.htm
// @match        https://www.jeuxvideo.com/forums/42-19163-*.htm
// @icon         https://www.google.com/s2/favicons?domain=jeuxvideo.com
// @grant        GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/29578
// @downloadURL https://update.greasyfork.org/scripts/432364/Voir%20les%20OPGGax%20des%20d%C3%A9lus.user.js
// @updateURL https://update.greasyfork.org/scripts/432364/Voir%20les%20OPGGax%20des%20d%C3%A9lus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var temporaryStorage = [];

    function fetchLocalStorage() {
        temporaryStorage = JSON.parse(localStorage.getItem('opggRank')) || {};
        for(var pseudo in temporaryStorage) {
            var account = temporaryStorage[pseudo];
            // refresh toutes les 10 min
            if((Date.now() - account.time) / 1000 / 60 >= 10) {
                delete temporaryStorage[pseudo];
            }
        }
        localStorage.setItem('opggRank', JSON.stringify(temporaryStorage));
    };

    function saveTemporaryStorage(pseudo, rank) {
        temporaryStorage[pseudo] = {
            rank: rank,
            time: Date.now()
        };
        localStorage.setItem('opggRank', JSON.stringify(temporaryStorage));
    };

    async function getOPGGax(pseudo) {
        if(temporaryStorage[pseudo]) {
            return temporaryStorage[pseudo].rank;
        }
        var parser = new DOMParser();
        await timeout(100);
        var opggLink = await fetch("https://www.jeuxvideo.com/profil/"+pseudo+"?mode=infos")
                            .then(response => response.text())
                            .then(text => {
                                var dom = parser.parseFromString(text, "text/html");
                                var links = dom.querySelectorAll(".bloc-signature-desc span");
                                var link;
                                links.forEach(function (l) {
                                    if(l.innerText.substr(0, 18) === "https://euw.op.gg/") {
                                        link = l.innerText;
                                    }
                                });
                                return link;
                             });
        if (!opggLink) {
            saveTemporaryStorage(pseudo, 'Iron 4');
            return 'Iron 4';
        }

        var opgg = await getWithGM(opggLink);
        var dom = opgg && parser.parseFromString(opgg, "text/html");
        var rank = dom && dom.querySelector(".TierRank") && dom.querySelector(".TierRank").innerText;
        saveTemporaryStorage(pseudo, rank);
        return rank;
    }

    async function getWithGM(url) {
        return new Promise(r => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    r(response.responseText);
                }
            });
        });
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleTopics(topic) {
        if (topic.querySelector === undefined) {
            return;
        }
        var pseudo = topic.querySelector(".topic-author");
        var rank = await getOPGGax(pseudo.innerText.toLowerCase());
        var pseudo = topic.querySelector(".topic-author");
        pseudo.style.textOverflow = 'ellipsis';
        pseudo.style.whiteSpace = 'nowrap';
        pseudo.style.overflow = 'hidden';
        pseudo.innerText = '['+rank+'] ' + pseudo.innerText;
    }

    async function handleMessages(topic) {
        if (topic.querySelector === undefined) {
            return;
        }
        var pseudo = topic.querySelector(".bloc-pseudo-msg");
        var rank = await getOPGGax(pseudo.innerText.toLowerCase());
        var pseudo = topic.querySelector(".bloc-pseudo-msg");
        pseudo.style.textOverflow = 'ellipsis';
        pseudo.style.whiteSpace = 'nowrap';
        pseudo.style.overflow = 'hidden';
        pseudo.innerText = '['+rank+'] ' + pseudo.innerText;
    }

    async function init() {
        fetchLocalStorage();
        var topics = document.querySelectorAll(".topic-list [data-id]");
        for (var t in topics) {
            var topic = topics[t];
            await handleTopics(topic);
        }
        var messages = document.querySelectorAll(".bloc-header");
        for (var m in messages) {
            var message = messages[m];
            await handleMessages(message);
        }
    }

    init();
})();