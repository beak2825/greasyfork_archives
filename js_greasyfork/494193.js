// ==UserScript==
// @name         NYTimes Sudoku Auto Solver
// @namespace    http://tampermonkey.net/
// @version      Beta
// @description  Automatically solves the Sudoku for you on nytimes.com
// @author       Splxff
// @match        https://www.nytimes.com/puzzles/sudoku*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494193/NYTimes%20Sudoku%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/494193/NYTimes%20Sudoku%20Auto%20Solver.meta.js
// ==/UserScript==

! function () {
    function e() {
        if (document.querySelector("[data-cell]")) {
            var t = [];

            function o(e) {
                for (let t = 0; t < 9; t++) console.log(e[t].join(" "))
            }

            function r(e, t, o, r) {
                for (let o = 0; o < 9; o++)
                    if (e[t][o] === r) return !1;
                for (let t = 0; t < 9; t++)
                    if (e[t][o] === r) return !1;
                const l = 3 * Math.floor(t / 3)
                    , n = 3 * Math.floor(o / 3);
                for (let t = l; t < l + 3; t++)
                    for (let o = n; o < n + 3; o++)
                        if (e[t][o] === r) return !1;
                return !0
            }
            document.querySelectorAll("[data-cell]")
                .forEach(((e, o) => {
                    const r = Math.floor(o / 9);
                    t[r] ? t[r].length < 9 && t[r].push(parseInt(isNaN(e.getAttribute("aria-label")) ? 0 : e.getAttribute("aria-label"))) : t[r] = [parseInt(isNaN(e.getAttribute("aria-label")) ? 0 : e.getAttribute("aria-label"))], 80 === o && t.forEach(((e, t) => {
                        for (; e.length < 9;) e.push(0)
                    }))
                })), console.log("Sudoku before solving:"), o(t), console.log("\nSudoku after solving:"), ! function e(t) {
                    for (let o = 0; o < 9; o++)
                        for (let l = 0; l < 9; l++)
                            if (0 === t[o][l]) {
                                for (let n = 1; n <= 9; n++)
                                    if (r(t, o, l, n)) {
                                        if (t[o][l] = n, e(t)) return !0;
                                        t[o][l] = 0
                                    } return !1
                            } return !0
                }(t) ? console.log("No solution exists for the given Sudoku.") : o(t), Array.from(document.querySelectorAll("[data-cell]"))
                .forEach(((e, o) => {
                    o--, setTimeout((() => {
                        e.click();
                        var r = t[Math.floor(o / 9)][o % 9]
                            , l = Array.from(document.querySelectorAll("svg"))
                            .filter((e => e.getAttribute("number") == r.toString()));
                        l[l.length - 1].dispatchEvent(new MouseEvent("click", {
                            bubbles: !0
                        }))
                    }), 1 * o)
                }))
        } else setTimeout((() => {
            e()
        }), 2e3)
    }
    document.querySelector("[data-cell]") ? e() : setTimeout((() => {
        e()
    }), 2e3)
}();