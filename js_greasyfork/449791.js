// ==UserScript==
// @name     Hide Twitter WhoToFollow
// @author   Jimmy Chin
// @version  1.0.0
// @match       https://twitter.com/*
// @description Hide Twitter WhoToFollow on Profile page.
// @namespace https://greasyfork.org/users/241557
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449791/Hide%20Twitter%20WhoToFollow.user.js
// @updateURL https://update.greasyfork.org/scripts/449791/Hide%20Twitter%20WhoToFollow.meta.js
// ==/UserScript==

javascript:(function(){
    const SELECTOR = {
        PRIMARY_COLUMN: "div[data-testid=primaryColumn]"
    }

    init();
    
    function init() {
        setDOMObserver();
    }

    function setDOMObserver() {
        const DOMObserver = new MutationObserver(() => {
            if (isProfilePage()) {
                const whoToFollowTitleElem = getWhoToFollowTitleElement();
                if (whoToFollowTitleElem) {
                    hideWhoToFollowElement(whoToFollowTitleElem);
                }
            }
        });
        
        DOMObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    function hideWhoToFollowElement(element) {
        hideElement(element);
        hideElement(element.nextSibling);
        hideElement(element.nextSibling.nextSibling);
        hideElement(element.nextSibling.nextSibling.nextSibling);
        hideElement(element.nextSibling.nextSibling.nextSibling.nextSibling);
        hideElement(element.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling);
    }

    function getWhoToFollowTitleElement() {
        const elements = document.querySelector(SELECTOR.PRIMARY_COLUMN)?.querySelectorAll(".css-1dbjc4n.r-1wtj0ep.r-1ny4l3l.r-ymttw5.r-1f1sjgu");
        const whoToFollowInnerTitleElem = elements[0]?.nextSibling?.getAttribute("data-testid") != "placementTracking" ? elements[0] : elements[1];
        if (!whoToFollowInnerTitleElem) {
            return null;
        }

        const whoToFollowOuterTitleElem = whoToFollowInnerTitleElem.parentElement?.parentElement?.parentElement;
        if (whoToFollowOuterTitleElem?.getAttribute("data-testid") != "cellInnerDiv") {
            return null;
        }

        return whoToFollowOuterTitleElem;
    }

    function isProfilePage() {
        const userIdElem = document.querySelector("div[data-testid=UserName]")?.querySelector(".css-1dbjc4n.r-1awozwy.r-18u37iz.r-1wbh5a2")?.querySelector(".css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0");
        if (!userIdElem) {
            return false;
        }

        const userId = userIdElem.innerHTML;
        if (!userId) {
            return false;
        }

        if (location.href != "https://twitter.com/" + userId.replace("@", "")) {
            return false;
        }

        return true;
    }

    function hideElement(element) {
        element.style.display = "none"
    }

})();