// ==UserScript==
// @name         Amgm_Script{Twitter_tweetMillisecondTime v.0.1.0}
// @namespace    twitter.com/Amgm_life
// @version      0.1.0
// @description  ツイ時刻を表示
// @author       Amagumo
// @match        https://twitter.com/*
// @icon         https://pbs.twimg.com/profile_images/1432407590688808963/mlJVxYpk.jpg
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432848/Amgm_Script%7BTwitter_tweetMillisecondTime%20v010%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/432848/Amgm_Script%7BTwitter_tweetMillisecondTime%20v010%7D.meta.js
// ==/UserScript==

console.log("[Amgm_Script{Twitter}] start: Twitter_tweetMillisecondTime v.0.1.0");
(function () {
    setInterval(setMilliseconds, 1000);
    document.head.appendChild(document.createElement("style")).textContent = `
    .Amgm_setMilliseconds_time {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 10px;
        color: #000;
        transition: .1s;
        opacity: .5;
    }
    article:hover .Amgm_setMilliseconds_time {
        opacity: 1;
    }`;

    const errorArticles = new Set();
    function setMilliseconds() {
        for (let $article of document.querySelectorAll("article")) {
            if ($article.querySelector(".Amgm_setMilliseconds_time") || errorArticles.has($article)) continue;
            if ($article.innerHTML.includes("M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.393-.875-.876V9.967l-7.547 7.546c-.17.17-.395.256-.62.256s-.447-.086-.618-.257c-.342-.342-.342-.896 0-1.237l7.547-7.547h-3.54c-.482 0-.874-.393-.874-.876s.392-.875.875-.875h5.65c.483 0 .875.39.875.874v5.65z")) {
                // const $wrap = $article.closest("section > div > div > div");//プロモーション削除(失敗)
                // $wrap.children[0].remove();
                // $wrap.remove();
                continue;
            }
            const tweetId = $article.querySelector("time")?.closest("a")?.getAttribute("href")?.match(/status\/([0-9]+)/)?.[1]
                ?? [...($article.querySelectorAll("a[href]") || [])].find($a => $a.getAttribute("href")?.match(/status\/([0-9]+)/))?.getAttribute("href")?.match(/status\/([0-9]+)/)[1];
            if (!tweetId) {
                errorArticles.add($article);///console.error($article);
                continue;
            }
            const $time = $article.appendChild(document.createElement("time"));
            $time.textContent = tweetId2time(tweetId);
            $time.classList.add("Amgm_setMilliseconds_time");
            $article.appendChild($time);
        }
    }

    function tweetId2time(tweetId) {
        const time = new Date(parseInt(BigInt(tweetId) / 2n ** 22n + 1288834974657n));
        return time.toLocaleString() + "." + ("000" + time.getMilliseconds()).substr(-3);
    }
})();
