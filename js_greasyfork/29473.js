// ==UserScript==
// @name         Duolingo Wide
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  Make Duolingo wider and more minimalist, and add useful keyboard shortcuts for the main features of the site.
// @author       Nekosuki
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/29473/Duolingo%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/29473/Duolingo%20Wide.meta.js
// ==/UserScript==


GM_addStyle("div.a5SW0,div._2_lzu{display:none}div._3MT-S{width:100%}div.kHldG{width:20%}");
GM_addStyle("div[data-test='player-end-carousel'] > div > div:first-child{width:100%} div._2Q3-3 {display:none}");
GM_addStyle(".__duowide_langs > :last-child {column-count:3} .__duowide_langs > :last-child > ul {max-height:none} .__duowide_friends a+div {position:absolute}");
GM_addStyle(".__duowide_achievs div._3jMdg {column-count:2} .__duowide_achievs li.f4TL7 {border:none; padding: 0 10px 25px 0} .__duowide_achievs h1._1Cjfg {margin-bottom: 30px !important}");

(function() {
    "use strict";
    let addStrengthenButton = function() {
        let c = document.querySelector("div.mAsUf");
        if(c === null || c.firstElementChild.dataset.test != "lingot-store-button") return;
        let a = document.querySelector("a[data-test='global-practice']");
        a.className = "_3FQrh _1uzK0 _3f25b _2arQ0 _3skMI _2ESN4";
        a.style.float = "right";
        a.innerHTML = "Practice";
        let p = a.cloneNode(true);
        p.onclick = function() { a.click(); return false; };
        c.replaceChild(p, c.firstChild);
    };
    let improveProfile = function() {
        if(document.querySelector("h1[data-test='profile-username']") == null) return;
        let d = document.querySelector("div.a5SW0");
        if(d === null || d.firstChild.textContent != "Languages") return;
        let e = d.nextElementSibling;
        let c = document.querySelector("div._3MT-S").firstChild;
        c.firstChild.classList.add("__duowide_achievs");
        d.className = "_2hEQd _1E3L7 __duowide_langs";
        e.className = "_2hEQd _1E3L7 __duowide_friends";
        let info = c.firstChild.firstChild.firstChild.firstChild;
        info.removeChild(info.lastChild);
        let a = document.createElement("div");
        a.className = "_2hEQd _1E3L7";
        a.innerHTML = "<div class=\"_2RO1n\"></div>";
        a.firstChild.appendChild(info);
        c.insertBefore(a, c.firstChild);
        c.insertBefore(d, c.lastChild);
        c.insertBefore(e, c.lastChild);
        let h = c.querySelector("h1._1Cjfg");
        if(h === null || h.textContent !== "Achievements") {
            info.parentNode.appendChild(c.children[1].firstChild);
            c.removeChild(c.children[1]);
        }
    };
    let keyEventListener = function(event) {
        if(['input', 'select', 'textarea'].indexOf(document.activeElement.tagName.toLowerCase()) !== -1) return;
        if(window.location.pathname === "/practice" || window.location.pathname.match(/^\/skill\/[^/]+\/[^/]+\//)) {
            switch(event.keyCode) {
                case 68:
                    let discussSentence = document.querySelector("div.PYCF5 > button:last-child");
                    if(discussSentence !== null) discussSentence.click();
                    return;
                case 81:
                    let quitButton = document.querySelector("div.Mlxjr > a._38taa._2Zfkq.cCL9P");
                    if(quitButton !== null) quitButton.click();
                    return;
            }
        }
        let tag = null;
        switch(event.keyCode) {
            case 78: /* N */ newLearningSession(); return;
            case 72: /* H */ tag = "home-nav"; break;
            case 87: /* W */ tag = "vocab-nav"; break;
            case 68: /* D */ tag = "discussion-nav"; break;
            case 76: /* L */ tag = "labs-nav"; break;
            case 80: /* P */ tag = "global-practice"; break;
            case 89: /* Y */ tag = "user-profile"; break;
            case 83: /* S */ tag = "sound-settings"; break;
        }
        let elem = document.querySelector("a[data-test='" + tag + "']");
        if(elem !== null) elem.click();
        else if(window.location.pathname === "/practice") {
            let practiceButton = document.querySelector("button[data-test='secondary-button']");
            let timedPracticeButton = document.querySelector("button[data-test='player-next']");
            if(event.keyCode == 80) practiceButton.click();
            else if(event.keyCode == 84) timedPracticeButton.click();
        }
    };
    let widenCommentSection = function() {
        if(window.location.pathname.startsWith("/comment/")) {
            document.querySelector("section.page-main.main-right").style.width = "initial";
        }
    };
    let checkForSettings = function() {
        let m = document.querySelector("div._3MT-S");
        if(m === null) return;
        let s = document.querySelector("div._2_lzu");
        if(window.location.pathname.startsWith("/settings")) {
            m.style.width = "auto";
            s.style.display = "block";
        } else {
            m.style.width = "100%";
            s.style.display = "none";
        }
    };
    let init = function() {
        document.addEventListener("keyup", keyEventListener);
    };
    let check = function() {
        widenCommentSection();
        improveProfile();
        addStrengthenButton();
        checkForSettings();
    };
    let newLearningSession = function() {
        if(window.location.pathname.startsWith("/skill/")) {
            let next = document.querySelector("a[data-test=begin-session-button]");
            if(next !== null) next.click();
            return;
        }
        let skills = Array.prototype.slice.call(document.querySelectorAll("a[data-test~=skill-tree-link]"));
        let toLearn = skills.filter(a => !a.dataset.test.includes("gold") && !a.dataset.test.includes("purple") && a.firstElementChild.childElementCount == 1);
        if(toLearn.length === 0) return;
        toLearn[0].click();
    };
    new MutationObserver(check).observe(document, {childList: true, subtree: true});
    init();
})();