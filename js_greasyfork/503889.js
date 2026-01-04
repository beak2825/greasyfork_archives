// ==UserScript==
// @name         Auto Game Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Automatically fetches game status and redirects if valid game is available. this is on robloxsoftworks.xyz
// @author       NYXEN
// @match        https://robloxsoftworks.xyz/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503889/Auto%20Game%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/503889/Auto%20Game%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (async () => {
        try {
            const e = await fetch("api/latest");
            if (!e.ok) {
                throw new Error("Network response was not ok");
            }
            const a = await e.json();
            if (a.game === "Uploading") {
                await Swal.fire("Error", "Game is getting uploaded. Please try again.", "error");
            } else if (a.game === "UnderReview") {
                await Swal.fire("Error", "Game is under review, attempting to bypass. Please try again.", "error");
            } else {
                await Swal.fire({
                    title: "Success",
                    text: "Got valid game. Redirecting now.",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                window.location.href = a.game;
            }
        } catch (e) {
            console.error("Error:", e);
        }
    })();
})();