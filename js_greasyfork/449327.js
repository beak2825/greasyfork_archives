// ==UserScript==
// @name         curseforge mod favicon
// @namespace    https://github.com/adrianmgg
// @version      1.1.0
// @description  use a mod's icon (or a mod category's icon) as its curseforge page's favicon
// @author       amgg
// @match        https://www.curseforge.com/*
// @match        https://legacy.curseforge.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @downloadURL https://update.greasyfork.org/scripts/449327/curseforge%20mod%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/449327/curseforge%20mod%20favicon.meta.js
// ==/UserScript==

function getCategoryPageIcon() {
    // get category links (need to look inside `nav`s specifically because otherwise other dropdowns will also get matched)
    const categoryIcons = [...document.querySelectorAll('nav .category-list-item [data-value="category-link"]')]
        .filter(el => el.querySelector(':scope > .bg-primary-0') !== null) // just the selected ones
        .map(el => el.querySelector(':scope > div > figure > img')) // get icon inside it
        .map(img => img.src);
    // if there's multiple we want the last one, for the cases when a sub-category is selected
    return categoryIcons[categoryIcons.length - 1] ?? null;
}

function getModPageIcon() {
    const fromIconElem = document.querySelector('.project-avatar > a > img')?.src ?? null;
    const fromOpengraphTags = document.querySelector('html > head > meta[property="og:image"]')?.content ?? null;
    // some specific pages don't have og tags, so we use the icon element as a fallback on those only
    if(/\/relations\/(dependents|dependencies)\/?$|\/issues\/?$/.test(window.location.pathname)) {
        return fromIconElem;
    } else {
        return fromOpengraphTags;
    }
}

function getIconUrl() {
    if(window.location.hostname === 'legacy.curseforge.com') {
        return getCategoryPageIcon() ?? getModPageIcon() ?? null;
    } else {
        const nextData = JSON.parse(document.getElementById('__NEXT_DATA__')?.textContent ?? '{}');
        return nextData?.props?.pageProps?.project?.avatarUrl;
    }
}

(function() {
    const iconUrl = getIconUrl();
    if(iconUrl === null) return;
    // get the current favicon elem (if any) and swap its url
    const faviconLink = document.querySelector('link[rel~="icon"]');
    if(faviconLink !== null) faviconLink.href = iconUrl;
    // watch for any favicon elems added later and swap out their urls
    (new MutationObserver(function(mutations, observer) {
        for(const mutation of mutations) {
            for(const node of mutation.addedNodes) {
                if(node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'LINK' && node.matches('[rel~="icon"]')) {
                    node.href = iconUrl;
                }
            }
        }
    })).observe(document.head, {subtree: false, childList: true});
})();
