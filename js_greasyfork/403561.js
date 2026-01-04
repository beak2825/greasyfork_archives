// ==UserScript==
// @name         最新ニコレポ内のリンクを常に新しいタブで開く
// @namespace    https://rinsuki.net/
// @version      0.1
// @description  最新ニコレポ内のリンクをクリックした時に常に新しいタブで開きます
// @author       rinsuki
// @match        https://www.nicovideo.jp/my/top*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403561/%E6%9C%80%E6%96%B0%E3%83%8B%E3%82%B3%E3%83%AC%E3%83%9D%E5%86%85%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E5%B8%B8%E3%81%AB%E6%96%B0%E3%81%97%E3%81%84%E3%82%BF%E3%83%96%E3%81%A7%E9%96%8B%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403561/%E6%9C%80%E6%96%B0%E3%83%8B%E3%82%B3%E3%83%AC%E3%83%9D%E5%86%85%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E5%B8%B8%E3%81%AB%E6%96%B0%E3%81%97%E3%81%84%E3%82%BF%E3%83%96%E3%81%A7%E9%96%8B%E3%81%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAnchorTag(e) {
        if (e == null) return e
        if (e.tagName === "A") return e
        return findAnchorTag(e.parentElement)
    }

    function isChildTreeOfNicorepoRoot(e) {
        if (e == null) return false
        if (e.classList.contains("NicorepoTimeline")) return true
        return isChildTreeOfNicorepoRoot(e.parentElement)
    }

    document.addEventListener("click", e => {
        const anchor = findAnchorTag(e.target)
        if (anchor == null) return
        if (!isChildTreeOfNicorepoRoot(anchor)) return
        anchor.target = "_blank"
    })
})();