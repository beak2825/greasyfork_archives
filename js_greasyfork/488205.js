// ==UserScript==
// @name         Patreon: Load all comments and replies
// @namespace    http://tampermonkey.net/
// @version      2024-02-24-0.3
// @description  Automates loading all the comments and replies instead of requiring the user to click for them
// @author       You & ChatGPT based on adgitate's https://greasyfork.org/en/scripts/484278-patreon-load-all-comments
// @match        https://www.patreon.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488205/Patreon%3A%20Load%20all%20comments%20and%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/488205/Patreon%3A%20Load%20all%20comments%20and%20replies.meta.js
// ==/UserScript==

(function() {
    let intervalId;

    function startWhenButtonNotAvailable() {
        let lmc = document.querySelector("button[data-tag='loadMoreCommentsCta']");
        if (lmc == null) {
            clearInterval(intervalId); // Clear the interval when the button is not found
            loadAllReplies();
        }
    }

    function loadAllReplies() {
        let buttons = document.querySelectorAll("button");
        let filteredButtons = Array.from(buttons).filter(button => button.textContent.includes("Load replies"));
        let delayBetweenClicks = 2500;
        let buttonsClicked = 0;
        let dateHadler = document.querySelector("a[data-tag='post-published-at']");
        let dateText = dateHadler.innerHTML;

        function clickButtonsSequentially() {
            if (buttonsClicked < filteredButtons.length) {
                filteredButtons[buttonsClicked].click();
                buttonsClicked++;
                dateHadler.innerHTML = dateText + " - Loading replies " + buttonsClicked + " / " + filteredButtons.length
                setTimeout(clickButtonsSequentially, delayBetweenClicks);
            } else {
                alert("All " + buttonsClicked + " Load replies buttons have been pressed.");
                dateHadler.innerHTML = dateText + " - All replies loaded (" + buttonsClicked + "/" + filteredButtons.length + ")"
            }
        }

        clickButtonsSequentially();
    }

    function loaded() {
        let lmc = document.querySelector("button[data-tag='loadMoreCommentsCta']");
        if (lmc !== null) {
            lmc.innerHTML = "Loading All comments... Please wait";
            let obs = new MutationObserver(mut => {
                if (mut[0].removedNodes.length > 0 && lmc) {
                    lmc.click();
                }
            });
            obs.observe(lmc.parentElement, { childList: true, subtree: true });
        }
		intervalId = setInterval(startWhenButtonNotAvailable, 2500);
    }
    document.body.onload = loaded;
//    document.addEventListener("DOMContentLoaded", loaded);
})();
