// ==UserScript==
// @name         Base 6 4 ta pu ni chi a ku n (lol)
// @namespace    https://twitter.com/
// @version      0.1
// @description  Finds base64encoded and automatically decode
// @author       6 4 ta pu ni chi a ku n ro yal lol
// @match https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407265/Base%206%204%20ta%20pu%20ni%20chi%20a%20ku%20n%20%28lol%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407265/Base%206%204%20ta%20pu%20ni%20chi%20a%20ku%20n%20%28lol%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const root = document.getElementById("react-root");

    setInterval(() => {
        const tweets = root.querySelectorAll("article div[dir][lang]:not(.base64-decoded)");

        for (let tweet of tweets) {
            const text = tweet.textContent;
            const match = text.match(/[0-9A-Za-z+\/=]{8,}/);
            if (match && match[0].length * 2 > text.length) {
                let data = match[0];
                try { // repeat decoding
                    for (;;) {
                        data = atob(data);
                    }
                } catch(e) {}
                if (/[\x80-\xff]/.test(data)) { // UTF-8
                    data = new TextDecoder().decode(new Uint8Array(data.split("").map(c => c.charCodeAt())));
                }
                const decoded = document.createElement("div");
                decoded.style.color = "green";
                decoded.textContent = data;
                tweet.insertAdjacentElement("afterend", decoded);
            }
            tweet.classList.add("base64-decoded");
            // ６　４　た　ぷ　に　き　あ　く　ん　笑
        }
    }, 5000);

})();