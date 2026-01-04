// ==UserScript==
// @name         Copy to Clipboard - Profile Links to Attack Links
// @namespace    weird.af.copy.attack.link
// @version      1.0.5
// @description  Replace all profile links with attack links and copy to clipboard
// @author       Heasley
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469952/Copy%20to%20Clipboard%20-%20Profile%20Links%20to%20Attack%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/469952/Copy%20to%20Clipboard%20-%20Profile%20Links%20to%20Attack%20Links.meta.js
// ==/UserScript==

const copyContent = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}
const fadeDelay = 1000;
const fadeDuration = 1000;

(function() {
    'use strict';

    // create observer to wait for faction name to appear on the page
    var profileLinkObserver = new MutationObserver(function(mutations, observer) {

        $(".content-wrapper a[href*='profiles.php?XID='], .content-wrapper a[href*='sid=getInAttack']:not(.profile-button-attack), .content-wrapper a[href*='sid=attack']").each(function() {
            const a = $(this);
            const name = a.text();
            const href = a.attr('href');
            const matches = href.replace("/profiles.php?XID=","").replace("/loader2.php?sid=getInAttack&user2ID=","").replace("/loader.php?sid=attack&user2ID=","").match(/\d+$/, "");
            
            if (!matches || !matches.length) return;
            const userID = matches[0];
            const attackURL = "https://www.torn.com/loader.php?sid=attack&user2ID=" + userID;

            let textToCopy = attackURL;
            if (name) {
               textToCopy = attackURL + " | " + name + " [" + userID + "]";
            }

            a.off('click').on('click', function (e) {
                e.preventDefault();
                copyContent(textToCopy);

                var span = $('<span>')
                .css({
                    "position": "absolute",
                    "transform": "translate(-50%, -50%)",
                    "opacity": "1",
                    "left": e.pageX + 'px',
                    "top": e.pageY + 'px'
                })
                .append("Copied!")
                .appendTo(document.body);

                setTimeout(function() {
                    span.css({ opacity: "0", transition: "opacity 1s ease-in-out" });
                    setTimeout(function() { span.remove(); }, fadeDuration);
                }, fadeDelay);

                return false;
            });
        });

    });
    const target = document.querySelector('.content-wrapper');
    const obsOptions = {attributes: false, childList: true, characterData: false, subtree:true};

    profileLinkObserver.observe(target, obsOptions);
})();