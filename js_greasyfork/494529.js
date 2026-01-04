// ==UserScript==
// @name         Wordless Reveal Answer Hack
// @namespace    http://tampermonkey.net/
// @version      Beta
// @description  Reveals answer in Wordless on lessgames.com
// @author       Splxff
// @match        https://lessgames.com/wordless
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lessgames.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494529/Wordless%20Reveal%20Answer%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/494529/Wordless%20Reveal%20Answer%20Hack.meta.js
// ==/UserScript==

! function () {
    function e() {
        if (window.__next) {
            var t = Object.values(window.__next)[0].child.child.child.sibling.child.stateNode._reactInternals.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.child.return.return.return.return.return.return.return.sibling.child.stateNode.containerInfo.offsetParent.children[6].children[0]
                , n = Object.values(t)[0].return.return.return.return.return.return.return.return.return.return.alternate.child.child.child.return.sibling.alternate.sibling.child.child.child.child.child.return.sibling.child.child.child.child.child.child.child.sibling.stateNode
                , r = Object.values(n)[0].return.return.return.return.return.memoizedState.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.memoizedState.current;
            if (!(r.length > 1)) return "na";
            Array.from(document.querySelectorAll("p"))
                .filter((e => e.textContent.toLowerCase()
                    .includes("word")))[0].textContent = r, Array.from(document.querySelectorAll("p"))
                .filter((e => e.textContent.toLowerCase()
                    .includes("less")))[0].textContent = ""
        } else e()
    }
    setInterval((() => {
        e()
    }), 2e3);
    e();
}();