// ==UserScript==
// @name Vector Layout for Wikipedia (Fast)
// @namespace -
// @version 1.1.13
// @description returns old Wikipedia layout. (layout before 2023 redesign of the website)
// @author NotYou
// @match *://wikipedia.org/*
// @match *://*.wikipedia.org/*
// @match *://wiktionary.org/*
// @match *://*.wiktionary.org/*
// @match *://wikinews.org/*
// @match *://*.wikinews.org/*
// @match *://wikivoyage.org/*
// @match *://*.wikivoyage.org/*
// @match *://wikiquote.org/*
// @match *://*.wikiquote.org/*
// @match *://wikiversity.org/*
// @match *://*.wikiversity.org/*
// @match *://wikibooks.org/*
// @match *://*.wikibooks.org/*
// @match *://wikifunctions.org/*
// @match *://*.wikifunctions.org/*
// @match *://www.mediawiki.org/*
// @match *://wikitech.wikimedia.org/*
// @match *://foundation.wikimedia.org/*
// @match *://meta.wikimedia.org/*
// @match *://species.wikimedia.org/*
// @match *://incubator.wikimedia.org/*
// @match *://outreach.wikimedia.org/*
// @match *://wikimania.wikimedia.org/*
// @run-at document-start
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/458789/Vector%20Layout%20for%20Wikipedia%20%28Fast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458789/Vector%20Layout%20for%20Wikipedia%20%28Fast%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAKE_CLEAN_URL = false; // removes "useskin=vector" after loading

    const IS_DEBUG_MODE = false; // instead of redirecting, logs information in console

    const DEBUG_TITLE = 'VLfW — Debug\n';
    const { href } = location;

    redirect(href, false, () => {
        if(MAKE_CLEAN_URL) {
            const url = new URL(href);
            const { searchParams, pathname } = url;

            if(searchParams.get('useskin') === 'vector') {
                searchParams.delete('useskin');

                const newSearchParams = searchParams.toString();
                const newPath = pathname + (newSearchParams ? '?' + newSearchParams : newSearchParams);

                history.replaceState({}, '', newPath);
            }
        }
    });

    window.addEventListener('click', onClick);

    function redirect(inputUrl, saveHistory, onFinish) {
        let url;

        try {
            url = new URL(inputUrl);
        } catch(e) {
            throw new Error('"' + inputUrl + '" is not valid URL!');
        }

        const { searchParams, pathname, origin } = url;
        const cleanURL = origin + pathname;

        if(searchParams.get('useskin') !== 'vector' && url.pathname !== '/') {
            searchParams.set('useskin', 'vector');

            const params = '?' + searchParams.toString();

            const resultURL = cleanURL + params;
            const newPath = pathname + params;

            if(IS_DEBUG_MODE) {
                console.log(DEBUG_TITLE, resultURL, newPath);
            } else {
                replaceURL(resultURL, saveHistory);
            }
        }

        if (typeof onFinish === 'function') {
            onFinish()
        }
    }

    function onClick(e) {
        const node = e.target;
        const link = getLink(node);

        if(link && !(e.ctrlKey || e.metaKey)) {
            const url = new URL(link.href);
            const isOrigin = url.hostname.indexOf('wikipedia.org') > -1;
            const isNotAnchor = !link.getAttribute('href').startsWith('#');
            const isOnlyLink = !link.getAttribute('role');

            if(isOrigin && isNotAnchor && isOnlyLink) {
                e.preventDefault();

                redirect(url, false);
            }
        }
    }

    function replaceURL(url, saveHistory) {
        if(saveHistory) {
            location.assign(url);
        } else {
            location.replace(url);
        }
    }

    function getLink(node) {
        if(node.tagName === 'A') {
            return node;
        } else if(node.tagName === 'HTML' || !node.tagName) {
            return null;
        }

        return getLink(node.parentNode);
    }
})();