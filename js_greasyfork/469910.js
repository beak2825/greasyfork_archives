// ==UserScript==
// @name        twitter.com to embed
// @namespace   Violentmonkey Scripts
// @match       https://*.twitter.com/*
// @grant       none
// @version     1.1.1
// @license     GPLv3
// @author      -
// @run-at      document-start
// @description Allows limited browsing of Twitter while not being logged in. Replaces the actual pages with embedded representations of the same page.
// @downloadURL https://update.greasyfork.org/scripts/469910/twittercom%20to%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/469910/twittercom%20to%20embed.meta.js
// ==/UserScript==

function rewrite(url) {
    if (url.pathname === `/i/flow/login`) {
        const redirectParam = location.search.substring(1).split(`&`)
            .filter(param => param.startsWith(`redirect_after_login=`))
            .map(param => param.split(`=`)[1])[0];
        console.debug(`Redirect after login param:`, redirectParam);
        url = new URL(url.origin + decodeURIComponent(redirectParam));
    }

    const paths = url.pathname.split(`/`).slice(1);
    if (paths.length === 1) {
        return `https://syndication.twitter.com/srv/timeline-profile/screen-name/` + paths[0];
    } else if (paths.length == 3 && Number(paths[2])) {
        return `https://platform.twitter.com/embed/Tweet.html?id=` + paths[2];
    }
}
if (location.hostname === `twitter.com` && rewrite(location)) {
    location.replace(rewrite(location));
}


window.addEventListener(`load`, () => {
    if (location.href.startsWith(`https://syndication.twitter.com/srv/timeline-profile/screen-name/`)
        || location.href.startsWith(`https://platform.twitter.com/embed/Tweet.html`)) {
        const style = document.createElement(`style`);
        style.innerHTML = `#__next, #app { max-width: 800px; margin:auto; }`;
        document.head.append(style);
    }

    setTimeout(() => {

        for (const link of document.querySelectorAll(`a`)) {
            if (link.hostname.endsWith(`.twitter.com`)) continue;

            const newHref = rewrite(link);
            //console.debug(`rewrite ${link.href} to ${newHref}`)
            if (newHref) link.href = newHref;
        }
    }, 500);

});

