// ==UserScript==
// @name         Songless Reveal Answer Hack
// @namespace    http://tampermonkey.net/
// @version      Beta
// @description  Reveals answer in Wordless on lessgames.com
// @author       Splxff
// @match        https://lessgames.com/songless
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lessgames.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494533/Songless%20Reveal%20Answer%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/494533/Songless%20Reveal%20Answer%20Hack.meta.js
// ==/UserScript==
 
! function () {
    window.prevAns = 'song';
    function e() {
        if (window.__next) {
            var r = Object.values(__next.firstChild)[0].return.return.return.return.return.memoizedState.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.memoizedState.track;
            if (!(r?.length > 1)) return "na";
            prevAns = r;
            Array.from(document.querySelectorAll("p"))
                .filter((e => e.textContent.toLowerCase()
                    .includes(prevAns.toLowerCase())))[0].textContent = r, Array.from(document.querySelectorAll("p"))
                .filter((e => e.textContent.toLowerCase()
                    .includes("less")))[0].textContent = ""
        } else e()
    }
    setInterval((() => {
        e()
    }), 2e3);
    e();
}();