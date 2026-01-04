// ==UserScript==
// @name         Wordle Auto Answer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto Answers Wordle!
// @author       Splxff
// @match        https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494096/Wordle%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/494096/Wordle%20Auto%20Answer.meta.js
// ==/UserScript==

(() => {
    var e, t = !0
        , n = new Date
        , l = "";
    try {
        ! function o() {
            if (t)
                if (e = requestAnimationFrame(o), l) {
                    if (document.querySelectorAll('[class*="Key-"]')
                        .length > 5) {
                        console.log(l), t = !1, cancelAnimationFrame(e);
                        for (let e = 0; e < l.length; e++) Array.from(document.querySelectorAll('[class*="Key-"]'))
                            .filter((t => t.textContent == l[e]))[0].click();
                        Array.from(document.querySelectorAll('[class*="Key-"]'))
                            .filter((e => "enter" == e.textContent))[0].click()
                    }
                } else fetch("https://www.nytimes.com/svc/wordle/v2/" + n.toISOString()
                        .split("T")[0] + ".json")
                    .then((e => e.json()))
                    .then((e => l = e.solution))
        }()
    } catch (n) {
        console.log(n), t = !1, cancelAnimationFrame(e)
    }
})();