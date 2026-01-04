// ==UserScript==
// @name         MierdiTwist
// @namespace    http://yelidmod.com/
// @version      0.1
// @description  Notifies about new messages in tab's title & icon
// @author       You
// @match        https://twist.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419871/MierdiTwist.user.js
// @updateURL https://update.greasyfork.org/scripts/419871/MierdiTwist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultFavicon = "https://twist.com/a/img/fav/favicon.ico";
    const warningFavicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD5ElEQVRoQ+2aW2wMURjH/2d2u5e6tNtGrLYPgkR4aVqSShpa4pbSekG8iAiNxCVC6oFEUa/6IDQEr4iQeHAJdQlCG0GLIGiLoqWhF73YtjM7R850d7N2Z3bOrtnujvQkk0wy38z8f9/tnMkZAv+glBQd/lUO0FKAzAWoO3At8ScUQDMIeUqBMw/2p9/1SyLspPDgjyyrYD0LoDjxWnUVUFByst+dtvPZFiISKJ7vYURmEB9MV3W/0nWAFB3qKQehp3S5k89AkmU5lxRVdV8BsDL59OkrogQVDKAdwBR98yS0IOQ8A2AVbspBgftjAIkMnRKB6qsDtLFVwpdOOZFaYnq3AkApVWrgZ5+Mxk9S4PjWk/xAfwGEuuB7jw+odQTqR2/yAUUECAVq65LR4IvQ81YJXf2JB1IALj4ejL6NUuBNm4S7r8WYcteom8baqJonM8cLyMkQkJMpIDvDMnKeIeBrp4zKSwNGOV95TswRcI0jyGHiMn1ifUKzMwQ4UpQVethgTWHdsV7VazYrwZoCOySZ4kL9EDdkRIAUCzBzitXnSSbUgmzXiGdTbeoiQ98seoHnnyTUNYmoey+i41d44S+YlYKti51wpwto/u7F5tN9xgCcKZ+AGW4L98P8ht0DFPVNonI8/SDBM6zeI6ZPtmD7UifyploD72jp8GLTKQMAmPdv7UvnFs88x7xc/17E23Yvy03NMdFJsGmhA6X5dgghgTQMgOVk7d40TRFDEkXjR5YakuJpnknOIgCr5tixsdiBCQ71FIwrAPPqzRfDePBWRMNHCYMi//Qxd5pVSZepkyKnZFwBLj8ZwtEbHu60YoZZLgHbljhRODOF6764AtTUenDxMV+Lc9oI1s93KK2R1VPEkRaeTsUV3VzAmm1UrQaO13pwSQeASVmWa0P5IgfYhKY5VESr2eqBGAowO9uKHcudmJWl43JO8cFAWiCaAKy9XdmThnF2orTE9i4ZJ2578PBd+OLNKgC7SlJRkmeD7vQWg3g/iBpExJmYdYzxDoIPHV781piM2MPXzrNj6xInV85iNAH4FAG7S5wom2PXN/8H8VpRiHkxF6x294pUlOXb/nMAA7yvFoXRi4BZAdhy+tyjQWwo5Sxy/UREcDeKawRefpZQfc2D1p9e3Dvi4pDGZxJ3gL5BipO3PbjeOBxYVpsG4M6rYbAlB/uoCR5JDbC6wI6VeTbU3PLgSYukmQdGQITOxobUAF/mwpA6SCgAA/2XKES9FuL1bDR2pgeINQpRL6ej8WqstjzR4P2gSegmnxqInvCA03ybfCbfZjX7RrfpfzVg+WTunz38FWHS323+ANzUOYmSO/P8AAAAAElFTkSuQmCC";
    const pendingMessagesWarning = "(!)";

    const showWarning = () => {
        const title = document.querySelector('title').innerText;

        // warning already present or is looking at the tab
        if (title.includes(pendingMessagesWarning) || !document.hidden) {
            return;
        }
        document.querySelector('title').innerText = pendingMessagesWarning + " " + title;
        document.querySelectorAll('[rel="icon"], [rel="shortcut icon"]').forEach((el) => {
           el.href = warningFavicon;
        });
    }

    const hideWarning = () => {
        document.querySelector('title').innerText = document.querySelector('title').innerText.replace(pendingMessagesWarning, "");
        document.querySelectorAll('[rel="icon"], [rel="shortcut icon"]').forEach((el) => {
           el.href = defaultFavicon;
        });
    };

    // whenever user opens twist tab, hide the warnings
    document.addEventListener("visibilitychange", () => {
         if (!document.hidden) {
             hideWarning();
         }
    }, false);

    (function(originalFetch) {
        window.fetch = function(url, options) {
            if (!url.includes("getMessages")) {
                return originalFetch(url, options);
            }

            // apply MITM
            return new Promise((resolve, reject) => {
                originalFetch(url, options).then((response) => {
                    let result = response.clone();

                    resolve(response);

                    result.json().then((json) => {
                        json.data.forEach((event) => {
                            // private message
                            if (event.type == "message_added" && event.to_user == true) {
                                showWarning();
                            }
                        });
                    });
                }).catch(reject);
            });
        };
    })(fetch);
})();