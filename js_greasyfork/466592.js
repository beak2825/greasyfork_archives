// ==UserScript==
// @name        Hide bullshit on filmweb.pl
// @version     1.11
// @description Hides annoying sections on filmweb.pl
// @author      cphx
// @homepage    none
// @icon        https://filmweb.pl/favicon.ico
// @match       https://www.filmweb.pl/*
// @run-at      document-end
// @namespace https://greasyfork.org/users/1080913
// @downloadURL https://update.greasyfork.org/scripts/466592/Hide%20bullshit%20on%20filmwebpl.user.js
// @updateURL https://update.greasyfork.org/scripts/466592/Hide%20bullshit%20on%20filmwebpl.meta.js
// ==/UserScript==

if (location.pathname !== "/") {
    const addGlobalStyle = (css) => {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    // Add exception for pages /season/$/discussion/ for g4
    if (!(/^\/serial\/.*\/season\/.*\/discussion\//.test(location.pathname) || /^\/serial\/.*\/episode\/[^/]+\/[^/]+\/discussion\/.+/.test(location.pathname) || location.pathname === "/film/variable" || /^\/serial\/[^/]+\/discussion\/[^/]+/.test(location.pathname))) {
        addGlobalStyle(`
            .page__wrapper--grid [data-group=g4].page__group,
            .page__wrapper--grid [data-group=g8].page__group {
                display: none !important;
            }
        `);
    }

    // Add exception for g5 and hide section on /person/
    if (!/^\/person\//.test(location.pathname)) {
        addGlobalStyle(`
            .page__wrapper--grid [data-group=g5].page__group {
                display: none !important;
            }
        `);
    } else {
        addGlobalStyle(`
            .page__section.latestTrailerSection.LatestTrailerSection.hasMobileFa.section.isReady {
                display: none !important;
            }
        `);
    }

    addGlobalStyle(`
        .page__wrapper--grid [data-group=g9].page__group,
        .siteFooterSection,
        .page__wrapper--grid [data-group=g13].page__group {
            display: none !important;
        }
    `);
}
