// ==UserScript==
// @name         Add MBin Article Archive Link
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Add archive.ph search link next to MBin links
// @author       ignirtoq
// @license      MIT
// @match        https://fedia.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fedia.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502542/Add%20MBin%20Article%20Archive%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/502542/Add%20MBin%20Article%20Archive%20Link.meta.js
// ==/UserScript==

const HOSTS_TO_OMIT = new Set([
    "archive.ph",
    "github.com",
    "i.imgur.com",
    "lemmy.world",
    "sh.itjust.works",
    "www.youtube.com",
    "youtu.be",
]);

const SUFFIXES_TO_OMIT = new Set([
    "gif",
    "jpeg",
    "jpg",
    "png",
    "webp",
]);

const LINK_CONTAINER_SELECTOR = '.entry__domain:has(a[rel="nofollow noopener noreferrer"])';
const LINK_ELEMENT_CHILD_SELECTOR = 'a';
const ARCHIVE_SEARCH_PREFIX = 'https://archive.ph/';
const ARCHIVE_LINK_TEXT = 'archive.ph';

function createArchiveSearchURL(linkUrl) {
    return `${ARCHIVE_SEARCH_PREFIX}${linkUrl}`;
}

function createArchiveLink(archiveUrl) {
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', archiveUrl);
    linkEl.setAttribute('target', '_blank');
    linkEl.append(ARCHIVE_LINK_TEXT);

    return linkEl;
}

function insertArchiveLink(el, archiveLinkEl) {
    el.append('(');
    el.append(archiveLinkEl);
    el.append(')');
}

function extractLinkFromContainer(container) {
    const childLink = container.querySelector(LINK_ELEMENT_CHILD_SELECTOR);
    if (childLink == null) return childLink;

    return childLink.getAttribute('href');
}

function filterURL(linkURL) {
    const url = new URL(linkURL);
    if (HOSTS_TO_OMIT.has(url.host)) {
        return null;
    }
    if (SUFFIXES_TO_OMIT.has(url.pathname.split(".").pop())) {
        return null;
    }

    url.search = "";
    return url.toString();
}

function addArchiveLinkToContainer(container) {
    const linkURL = extractLinkFromContainer(container);
    if (linkURL == null) return;
    const filteredURL = filterURL(linkURL);
    if (filteredURL == null) return;

    const archiveLinkURL = createArchiveSearchURL(filteredURL);
    const archiveLinkEl = createArchiveLink(archiveLinkURL);
    insertArchiveLink(container, archiveLinkEl);
}

function getLinkContainers() {
    return [...document.querySelectorAll(LINK_CONTAINER_SELECTOR)];
}

(function() {
    'use strict';

    getLinkContainers().forEach(addArchiveLinkToContainer);
})();