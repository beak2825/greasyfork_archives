// ==UserScript==
// @name         Adblock Blocker Blocker
// @namespace    Adblock Blocker Blocker
// @version      0.2.0
// @description  Bypass adblock-detectors. Pretty heavy-handed so will need updating frequently.
// @author       Lawrence Sim
// @match        *://*.forbes.com/*
// @match        *://*.nbcnews.com/*
// @match        *://*.cnbc.com/*
// @match        *://*.businessinsider.com/*
// @match        *://*.insider.com/*
// @match        *://*.usatoday.com/*
// @match        *://*.eastbaytimes.com/*
// @match        *://*.sacbee.com/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.bostonglobe.com/*
// @match        *://*.cbssports.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439072/Adblock%20Blocker%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/439072/Adblock%20Blocker%20Blocker.meta.js
// ==/UserScript==
(function() {
        // washington post is particularly aggressive
    var isWaPo = window.location.hostname.endsWith("washingtonpost.com"),
        // block classes applied on body
        blockClasses = [
            "body--no-scroll", // forbes
            "adblock-on",      // business insider
            "tp-modal-open",   // east bay times
            "modal-open"       // forbes
        ],
        // modal blocking elements
        blockerElems = [
            ".fbs-auth__adblock",                         // forbes
            ".fEy1Z2XT",                                  // nbc / cbs sports
            ".tp-modal, .tp-backdrop",                    // business insider
            ".modal-scrollable, .connext-modal-backdrop", // east bay times
            ".fc-ab-root",                                // sacbee
            ".meter-social-connect"                       // boston globe
        ],
        // blocking elements with randomized IDs after classname
        blockerElemPrefixes = [
            "paywall-",            // sacbee
            "sp_veil",             // wapo
            "sp_message_container" // usa today
        ],
        // prevent dynamic removal of article content
        articleElems = [
            ".article-body" // wapo (others)
        ],
        blockerElemsJoin = blockerElems.join(", "),
        articleElemsJoin = articleElems.join(", ");

    var allowScroll = count => {
            console.log("ADBLOCK BLOCKER: allowing scroll (" + count + ")");
            document.body.style.overflow = "";
            if(isWaPo) document.body.style.position = ""; // wapo
            document.children[0].style.overflow = ""; // nbc
            document.getElementsByTagName("html")[0].style.overflow = "";
            blockClasses.forEach(cname => document.body.classList.remove(cname));
        },
        clearBlockers = (mutated, count) => {
            console.log("ADBLOCK BLOCKER: clearing modal blockers (" + count + ")");
            (mutated || [{target: document.body}]).forEach(mutant => {
                let remove = false;
                mutant.target.querySelectorAll(blockerElemsJoin)
                             .forEach(el => {remove = true; el.remove();});
                if(remove) return;
                mutant.target.querySelectorAll("div").forEach(div => {
                    remove = false;
                    div.classList.forEach(cl => {
                        remove = remove || blockerElemPrefixes.find(prefix => cl.startsWith(prefix));
                    });
                    if(remove) div.remove();
                });
            });
        };
    var init = () => {
        // observe body attributes to prevent anti-scroll
        var obs1Count = 0,
            obsBodyAttrs = new MutationObserver(() => allowScroll(++obs1Count));
        allowScroll(obs1Count);
        obsBodyAttrs.observe(
            document.body,
            {attributes: true, attributeFilter: ['style', 'classList']}
        );
        // observe body node additions to remove modal blockers
        var obs2Count = 0,
            obsBodyChilden = new MutationObserver(mutated => {
                clearBlockers(mutated, ++obs2Count);
                allowScroll(++obs1Count);
            });
        clearBlockers(null, obs2Count);
        obsBodyChilden.observe(document.body, {childList: true});
        // store article content and prevent mutation
        document.querySelectorAll(articleElemsJoin).forEach(el => {
            articleElems.forEach(cselect => el.classList.remove(cselect.slice(1)));
            var obsArticle = new MutationObserver(
                ((article, html) => {
                    var obsCount = 0;
                    return function(mutated, observer) {
                        console.log("ADBLOCK BLOCKER: restoring article cache (" + (++obsCount) + ")");
                        article.innerHTML = html;
                        if(obsCount > 99) observer.disconnect();
                    };
                })(el, el.innerHTML)
            );
            obsArticle.observe(el, {childList: true, subtree: false});
        });
    };

    window.setTimeout(init, 200);
})();