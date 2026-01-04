// ==UserScript==
// @name         social-media-news-cleaner
// @license      MIT
// @namespace    https://greasyfork.org/en/users/931475
// @version      1.1.4
// @description  Cleans the news sites from the social media posts (for now, only cleans mamul.am from facebook and telegram posts and news.am (without subdomains) from facebook posts)
// @author       https://github.com/arturhg/
// @match        https://mamul.am/*
// @match        https://news.am/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mamul.am
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/447363/social-media-news-cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/447363/social-media-news-cleaner.meta.js
// ==/UserScript==

async function containsSocialMediaSourceMamulAm(url) {

    if (!(url.includes('news/') && !url.includes('sdk'))) {
        return Promise.resolve(false);
    }

    const entry = getWithTtl(url);
    if (entry != null) {
        return Promise.resolve(entry === true);
    }

    return fetch(url)
        .then(x => x.text())
        .then(function (html) {

            const doc = new DOMParser()
                .parseFromString(html, "text/html");

            const facebookIframes = [...doc.querySelectorAll('iframe')]
                .filter(fe => fe.src.includes('facebook.com'));

            if (facebookIframes.length !== 0) {
                setWithTtlInDays(url, true, 1);
                return true;
            }

            const facebookMentions = [...doc.querySelectorAll('.descer2 > p:nth-child(2)')]
                .filter(p => p.textContent.includes('ֆեյսբուքյան իր էջում') || p.textContent.includes('«Թելեգրամ»-ի իր էջում'));

            if (facebookMentions.length !== 0) {
                setWithTtlInDays(url, true, 1);
                return true;
            }

            const link = doc
                .querySelector('.w3 > a')?.href;

            if (link === undefined) {
                setWithTtlInDays(url, false, 1);
                return false;
            }

            const isSocialMediaSource = link?.includes('t.me/') || link?.includes('facebook.com/');
            setWithTtlInDays(url, isSocialMediaSource, 1);
            return isSocialMediaSource;
        });
}

async function containsSocialMediaSourceNewsAm(url) {

    if (url.includes('style.news.am') || url.includes('sport.news.am') || url.includes('med.news.am')) {
        return Promise.resolve(false);
    }

    const entry = getWithTtl(url);
    if (entry != null) {
        return Promise.resolve(entry === true);
    }

    return fetch(url)
        .then(x => x.text())
        .then(function (html) {

            const doc = new DOMParser()
                .parseFromString(html, "text/html");

            const facebookIframes = [...doc.querySelectorAll('iframe')]
                .filter(fe => fe.src.includes('facebook.com'));

            if (facebookIframes.length === 0) {

                const facebookMentions = [...doc.querySelectorAll('div.article-text > span.article-body > p')]
                    .filter(p => p.textContent.includes('ֆեյսբուքյան էջում գրել է') || p.textContent.includes('Facebook-ի իր էջում գրել է'));

                if (facebookMentions.length === 0) {
                    setWithTtlInDays(url, false, 1);
                    return false;
                }

            }

            setWithTtlInDays(url, true, 1);
            return true;
        });
}

Array.prototype.asyncFilter = async function (f) {
    const array = this;
    const booleans = await Promise.all(array.map(f));
    return array.filter((x, i) => booleans[i]);
}


function getNodesToRemoveOnMamulAm(newsLink) {

    const link = newsLink?.parentNode;
    const date = link?.previousSibling;
    const under = link.nextSibling;
    const picture = date?.previousSibling;

    const nodeArray = new Array(4);
    nodeArray[0] = picture;
    nodeArray[1] = date;
    nodeArray[2] = link;
    nodeArray[3] = under;
    return nodeArray;
}

function setWithTtlInDays(key, value, ttlInDays) {
    setWithTtlInSeconds(key, value, ttlInDays * 24 * 60 * 60)
}

function setWithTtlInSeconds(key, value, ttlInSeconds) {
    const now = new Date();

    const item = {
        value: value,
        expiry: now.getTime() + ttlInSeconds * 1000,
    }

    localStorage.setItem(key, JSON.stringify(item));
}

function getWithTtl(key) {
    const itemStr = localStorage.getItem(key)

    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

function garbageCollect() {
    for (const [key, value] of Object.entries(localStorage)) {
        if (!value) {
            continue;
        }

        try {
            const item = JSON.parse(value);
            const now = new Date();

            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
            }
        } catch (e) {
        }

    }
}

(function () {
    'use strict';

    setInterval(garbageCollect, 1000 * 60 * 60);

    const onMamulAm = window.location.href.includes('mamul.am');

    if (onMamulAm) {
        [...document.querySelectorAll('div > a')]
            .asyncFilter(a => containsSocialMediaSourceMamulAm(a.href))
            .then(links => links.flatMap(link => getNodesToRemoveOnMamulAm(link))
                .filter(node => node !== null && node !== undefined)
                .forEach(node => node.remove()));
    } else {
        [...document.querySelectorAll('a.news-item')]
            .asyncFilter(a => containsSocialMediaSourceNewsAm(a.href))
            .then(nodes => nodes.forEach(node => node.remove()));

    }

})();