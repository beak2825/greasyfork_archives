// ==UserScript==
// @name        No Apple News
// @description Remove Apple related entries in news sites
// @version 0.1.3
// @grant none
// @author Lucie Cupcakes
// @namespace https://lucdev.net
// @license UNLICENSE - https://unlicense.org/
// @match *://news.ycombinator.com/
// @match *://news.ycombinator.com/news*
// @match *://lobste.rs/
// @match *://lobste.rs/page/*
// @downloadURL https://update.greasyfork.org/scripts/441720/No%20Apple%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/441720/No%20Apple%20News.meta.js
// ==/UserScript==
(() => {
    const filterWords = ([
        'airbook',
        'apple',
        'icloud',
        'ios',
        'ipad',
        'iphone',
        'ipod',
        'm1',
        'mac',
        'macbook',
        'macos',
        'safari',
        'siri',
    ]).map(el => ` ${el} `);

    const domReady = (cb) => {
        if (document.readyState === 'complete') {
            return cb();
        }
        document.addEventListener('readystatechange', domReady.bind(
            null, cb));
    };

    const titleMatches = (str) => {
        for (const el of filterWords) {
            if (str.startsWith(`${el.trim()} `) || str.includes(el)) {
                return true;
            }
        }
        return false;
    };

    const removeHtmlElement = (el) => el.parentElement.removeChild(el);

    const filterArticlesByHostname = {
        'news.ycombinator.com': () => {
            return Array.from(document.querySelectorAll(
                    '.title > .titleline > a'))
                .map((el) => {
                    // Check if matches blocklist
                    if (!titleMatches(el.innerText
                            .toLowerCase())) {
                        return null;
                    }
                    // Grab metadata
                    const articleTr = el.parentElement
                        .parentElement.parentElement;
                    const id = articleTr.id.repeat(1);
                    const title = el.innerText.repeat(1);
                    const link = el.href.repeat(1);
                    // Remove entry
                    (() => {
                        [
                            document.querySelector(
                                `.athing[id="${id}"]`
                            ), // articleTr
                            document.querySelector(
                                `.athing[id="${id}"] + tr`
                            ), //subtext
                            document.querySelector(
                                `.athing[id="${id}"] + tr + tr.spacer`
                            ),
                        ]
                        .filter((el) => el !== null)
                            .forEach(removeHtmlElement);
                    })();
                    // Return metadata
                    return {
                        title,
                        link,
                        id,
                    };
                })
                .filter((el) => el !== null);
        },
        'lobste.rs': () => {
            return Array.from(document.querySelectorAll(
                    '.story .u-url'))
                .map((el) => {
                    // Check if matches blocklist
                    if (!titleMatches(el.innerText
                            .toLowerCase())) {
                        return null;
                    }
                    // Grab metadata
                    const title = el.innerText.repeat(1);
                    const link = el.href.repeat(1);
                    // Remove entry
                    (() => {
                        const articleDiv =
                            el.parentElement.parentElement
                            .parentElement.parentElement;
                        removeHtmlElement(articleDiv);
                    })();
                    // Return metadata
                    return {
                        title,
                        link,
                    };
                })
                .filter((el) => el !== null);
        },
    };

    domReady(() => {
        const articles = filterArticlesByHostname[location.hostname]
            ();
        console.log(`Filtered ${articles.length} article(s).`,
            articles);
    });
})();