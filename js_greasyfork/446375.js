// ==UserScript==
// @name        AtCoder Contest Standings with Twitter ID
// @namespace   https://twitter.com/KakurenboUni
// @version     1.0.4
// @match       https://atcoder.jp/contests/*/standings*
// @description Displays Twitter IDs in contest standings.
// @author      uni-kakurenbo
// @license     MIT
// @supportURL  https://twitter.com/KakurenboUni
// @downloadURL https://update.greasyfork.org/scripts/446375/AtCoder%20Contest%20Standings%20with%20Twitter%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/446375/AtCoder%20Contest%20Standings%20with%20Twitter%20ID.meta.js
// ==/UserScript==

void function() {
    "use strict";

    // ac-predictor などと併用すると，列の一部が見切れてしまうことがあります．
    // その場合は以下の行をコメントアウトし，順位表の幅を広げてください．(サイズは任意に変更していただいて構いません．)
    // document.querySelector("#main-container").style.width = "1380px"

    const cache = new Map();
    const STORAGE_ID_PREFIX = "AtCoder-Contest-Standings-with-Twitter-ID"


    window.onload = async function() {
        await rendered();

        const $checkboxes = Array.from(document.querySelectorAll("div.checkbox"));

        const $outerDivElement = document.createElement("div");

        $outerDivElement.innerHTML = `<label><input id="checkbox-twitter" type="checkbox"> Twitter ID を表示</label>`;
        $outerDivElement.className = "checkbox";

        $checkboxes[2].after($outerDivElement);

        const $addedCheckbox = document.querySelector("input#checkbox-twitter");
        $addedCheckbox.checked = localStorage.getItem(`${STORAGE_ID_PREFIX}.enable`) === "true";

        setVisuality();

        if(isAvailable() && $addedCheckbox.checked) display();
        $addedCheckbox.addEventListener('click', ({ target : { checked } }) => {
            if(checked) display();
            else hide();
        });

        $checkboxes.at(-1).addEventListener("click", setVisuality);
        document.querySelectorAll(".standings-per-page").forEach(element => {
            element.addEventListener("click", setVisuality);
        })

        function isAvailable() {
            return +document.querySelector("a.standings-per-page.selected").textContent <= 50 || $checkboxes.at(-1).querySelector("input").checked
        }
        function setVisuality() {
            if(isAvailable()) $addedCheckbox.disabled = false;
            else { $addedCheckbox.checked = false; $addedCheckbox.disabled = true; }
        }
    };

    function display() {
        const $usernames = document.querySelectorAll(".standings-rank + .standings-username .username")
        $usernames.forEach(async ($username) => {
            const username = $username.textContent;
            const existing = cache.get(username);
            let twitterId = "";
            if(existing) {
                twitterId = existing;
            } else {
                const response = await fetch($username.href);
                const row_text = await response.text();
                const twitterInfomation = row_text.match(/href='\/\/twitter.com\/(.*)'/);
                if(!twitterInfomation) return;
                twitterId = twitterInfomation[1];
                cache.set(username, twitterId)
            }
            const $span = document.createElement("span");
            $span.className = "twitter-link";
            $span.style["margin-left"] = "5px"
            $span.style["margin-right"] = "2px"
            $span.innerHTML = `<a href="https://twitter.com/@${twitterId}" target="_blank" rel="noopener noreferrer">@${twitterId}</a>`
            $username.after($span);
        })
        localStorage.setItem(`${STORAGE_ID_PREFIX}.enable`, true);
    }

    function hide() {
        const $targets = document.querySelectorAll(".twitter-link")
        $targets.forEach($target => $target.remove());
        localStorage.setItem(`${STORAGE_ID_PREFIX}.enable`, false);
    }

    async function rendered() {
        let timer;
        await new Promise((resolve) => {
            observer();
            function observer() {
                if(document.querySelector("div.checkbox")) {
                    resolve();
                }
                timer = setTimeout(observer, 10);
            };
        });
        clearTimeout(timer)
    }
}();
