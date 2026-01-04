// ==UserScript==
// @name         Wikipedia Anchors
// @version      0.1
// @namespace    https://github.com/OoDeLally/wikipedia-anchors
// @description  Add an anchored link to titles on Wikipedia articles
// @author       Pascal Heitz
// @license      MIT
// @include        http*://*.wikipedia.org/*
// @include        http*://wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372178/Wikipedia%20Anchors.user.js
// @updateURL https://update.greasyfork.org/scripts/372178/Wikipedia%20Anchors.meta.js
// ==/UserScript==

function createDivider() {
    var divider = document.createElement('span');
    divider.innerHTML = ' | ';
    divider.classList.add('mw-editsection-divider');
    divider.style.display = 'inline';
    return divider;
}

function createLink(href) {
    var link = document.createElement('a');
    link.innerHTML = 'link';
    link.style.display = 'inline';
    link.href = href;
    return link;
}

function createBracket(innerHTML) {
    var bracket = document.createElement('span');
    bracket.innerHTML = innerHTML;
    bracket.classList.add('mw-editsection-bracket');
    bracket.style.display = 'inline';
    return bracket;
}

function createEditSection() {
    var editSectionSpan = document.createElement('span');
    editSectionSpan.classList.add('mw-editsection');
    editSectionSpan.appendChild(createBracket('['));
    editSectionSpan.appendChild(createBracket(']'));
    return editSectionSpan;
}

function insertBeforeLastIfPossible(containerNode, childNode) {
    if (containerNode.childNodes.length < 1) {
        return;
    }
    containerNode.insertBefore(childNode, containerNode.lastElementChild);
}


(function() {
    'use strict';

    var headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (var header of headers) {
        var headlineSpan = header.querySelectorAll('span.mw-headline')[0];
        if (!headlineSpan) {
            continue;
        }
        var headlineId = headlineSpan.id;
        if (!headlineId) {
            continue;
        }


        var anchoredLink = createLink(document.location.href.match(/(^[^#]*)/)[0] + "#" + headlineId);


        var editsectionSpan = header.querySelectorAll('span.mw-editsection')[0];
        if (editsectionSpan) {
            insertBeforeLastIfPossible(editsectionSpan, createDivider());
            insertBeforeLastIfPossible(editsectionSpan, anchoredLink);
        } else {
            // The editsection doesnt exist, we need to create it
            editsectionSpan = createEditSection();
            header.appendChild(editsectionSpan);
            insertBeforeLastIfPossible(editsectionSpan, anchoredLink);
        }

    }

})();
