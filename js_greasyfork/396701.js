// ==UserScript==
// @name Twitter Auto Latest Tweet
// @version 1.1
// @author PartMent
// @description Automatically switch to latest tweet.
// @match https://mobile.twitter.com/
// @match https://twitter.com/
// @match https://mobile.twitter.com/home
// @match https://twitter.com/home
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/310437
// @downloadURL https://update.greasyfork.org/scripts/396701/Twitter%20Auto%20Latest%20Tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/396701/Twitter%20Auto%20Latest%20Tweet.meta.js
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
if (MutationObserver) console.log('Auto Latest is enabled.');
let observer = new MutationObserver(e => {
    let latest = false;
    let menu = document.querySelector('main div[data-testid="primaryColumn"] div[aria-expanded="false"]:not([data-testid="userActions"])');
    if (menu && !latest) {
        menu.click();
    }
    e.every(l => {
        let menusvg = document.evaluate('./div/div/div/div/*[local-name() = "svg"]/*[local-name() = "g"]', l.target, null, XPathResult.ANY_TYPE, null).iterateNext();
        if (menusvg && menusvg.childElementCount == 3) {
            let menubutton = document.evaluate('./div/div/div/div[2]', l.target, null, XPathResult.ANY_TYPE, null).iterateNext();
            menubutton.click();
            latest = true;
            console.log('Switched to Latest.');
            observer.disconnect();
            return;
        }else if (menusvg && menusvg.childElementCount == 6) {
            if (!latest) document.querySelector('div[data-focusable="true"] div').click();
            latest = true;
            console.log('Already in Latest.');
            observer.disconnect();
            return;
        }
    });
});
observer.observe(document.body, {childList: true, subtree: true});