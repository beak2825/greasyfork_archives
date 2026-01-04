// ==UserScript==
// @name         Github search on Google
// @version      2.1.0
// @description  Adds a button to search github.com with Google
// @author       Alexyoe && Bilenkonito
// @namespace    https://github.com/bilenkonito/Github-on-Google-Search
// @license      MIT
// @match        http*://www.google.*/search*
// @match        http*://google.*/search*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/466013/Github%20search%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/466013/Github%20search%20on%20Google.meta.js
// ==/UserScript==

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const githubUrl = '+site%3Agithub.com';
let githubIcon = '<svg foscusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

if (typeof window.trustedTypes !== "undefined") {
    const policy = window.trustedTypes.createPolicy("html", {
        createHTML: (input) => input,
    });
    githubIcon = policy.createHTML(githubIcon);
}

(function () {
    // Create the link element
    const el = document.createElement("a");
    el.className = isImageSearch ? "NZmxZe" : "zItAnd FOU1zf GMT2kb";

    // Add icon to the link
    const span = document.createElement("span");
    span.className = isImageSearch ? "m3kSL" : "mUKzod";
    span.style.cssText = "height:16px;width:16px";
    span.innerHTML = githubIcon;
    el.appendChild(span);

    // Create the div element for the text
    const link = document.createElement("div");
    link.textContent = "Github";
    el.appendChild(link);

    // Add site:github.com to the query
    el.href = window.location.href.replace(
        queryRegex,
        (match) => match.search(siteRegex) >= 0 ?
                       match.replace(siteRegex, githubUrl) :
                       match + githubUrl);

    // Insert the link into Google search
    Array.from(document.getElementsByClassName(isImageSearch ? "T47uwc" : "nfdoRb")).forEach((menuBar) => {
        const firstButton = Array.from(menuBar.getElementsByClassName("NZmxZe")).find((v) => !v.classList.contains("lvtvhd"));
        return firstButton ?
            menuBar.insertBefore(el, firstButton) :
            menuBar.appendChild(el);
    });

    // Fix Sizing
    Array.from(document.getElementsByClassName("TrmO7")).forEach((v) => v.classList.add("size-fix"));
    const buttonBoxCSS = document.createElement("style");
    buttonBoxCSS.innerHTML = ".size-fix { min-width: fit-content !important; }";
    document.head.appendChild(buttonBoxCSS);
})();
