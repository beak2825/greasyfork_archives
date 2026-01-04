// ==UserScript==
// @name         Twitter - replace X and Favicon
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  i like birds!
// @author       hopper.jerry@gmail.com
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/471847/Twitter%20-%20replace%20X%20and%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/471847/Twitter%20-%20replace%20X%20and%20Favicon.meta.js
// ==/UserScript==

(() => {
    let xLogo='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';
    let oldxLogo='M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0'
    
    let oldLogo='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z';
    let oldPromoLogo='M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z';
    let oldFavicon='https://abs.twimg.com/favicons/twitter.2.ico';

    function findElementToRemove(container, iconSelector) {
        let removeElement = null;
        if (container.querySelectorAll(iconSelector).length > 0) {
            removeElement = container;
        }
        return removeElement;
    }

    function twitterFixLogo() {
        let svgContainers = document.querySelectorAll('svg');
        for (let container of svgContainers) {
            let removeElement = findElementToRemove(container, `svg path[d='${xLogo}']`);
            if (removeElement) {
                let ele = removeElement.getElementsByTagName("path");
                ele[0].setAttribute("style", 'color: rgb(29, 155, 240)');
                ele[0].setAttribute("d", `${oldLogo}`);
                break;
            }
        }
    }

    function twitterFixIcon(){
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = oldFavicon;
    }


    // Observe elements with logo and change it
    let logoMutationObserver = new MutationObserver(twitterFixLogo);
    logoMutationObserver.observe(document.body, { childList: true, subtree: true });
    // Fix the favIcon
    twitterFixIcon();
    // Kill the observer, as the page is probably loaded completely and logo's replaced.
    setTimeout(function() {
        logoMutationObserver.disconnect()
    }, 5000)
    // Fix the icon after a window resize
    addEventListener("resize", (event) => {});
    onresize = (event) => {
        twitterFixLogo();
    };



})();