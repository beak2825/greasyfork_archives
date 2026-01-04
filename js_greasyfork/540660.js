// ==UserScript==
// @name         create href to local file path specified by lfp scheme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  after register hanlder for lfp, we need to construct the scheme url corresponding to local file path, the path consist on 2 key part, formated date in YYYY-MM-DD and bgm japanese name(jpn), this the user script the construct the path based existing info on the page
// @author       You
// @include      /^https?://(bangumi|bgm).tv/anime/list/.*$/
// @include      /^https?://(bangumi|bgm).tv/index.*$/
// @include      /^https://localhost:8001/anime/tags/.*$/
// @include      /^https://cityhunter.me/anime/tags/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540660/create%20href%20to%20local%20file%20path%20specified%20by%20lfp%20scheme.user.js
// @updateURL https://update.greasyfork.org/scripts/540660/create%20href%20to%20local%20file%20path%20specified%20by%20lfp%20scheme.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const interval = setInterval(() => {
        if (document.getElementById('browserItemList')) {
            clearInterval(interval);
            main();
        }
    }, 500);
})();

const DATE_REGEX = /(\d{4})[-/年]?(\d{1,2})[-/月]?(\d{1,2})[-/日]?/
function main() {
    const extractedJpn = getJpn()
//    const infotips = $('#browserItemList .info.tip')
    const infotips = document.querySelectorAll('#browserItemList .info.tip');

    for (let i = 0; i < infotips.length; i++) {
        const match = infotips[i].innerHTML.match(DATE_REGEX)
        // if (match)
        //     console.log(match[0])
        const convertedDate = convertDate(match[0])

        const folderPath = `${convertedDate} ${extractedJpn[i]}`
        console.log(folderPath)
        const lfp = createAnchorElement(folderPath)
        insertAfter(lfp, infotips[i])
    }
}

function getJpn() {
    // Get the <ul> element by its ID
    const ulElement = document.getElementById('browserItemList');

    // Get all the <h3> elements within the <ul> element
    const h3Elements = ulElement.getElementsByTagName('h3');

    // Create an empty array to store the extracted inner texts
    const extractedTexts = [];

    // Iterate over each <h3> element
    for (const h3Element of h3Elements) {
        //in list/do page, jpn title present in small tag if chn tag exist
        //otherwise it present in a tag, for index page, it always present in a tag
        const smallElement = h3Element.querySelector('small');
        if (smallElement) {
            //console.log(`small tag: ${smallElement.innerText}`);
            extractedTexts.push(smallElement.innerText);
        } else {
            //console.log(`a tag: ${h3Element.querySelector('a').innerText}`);
            extractedTexts.push(h3Element.querySelector('a').innerText);
        }
    }

    return extractedTexts;
}

function convertDate(dateString) {
    var match = dateString.match(DATE_REGEX);
    //https://stackoverflow.com/questions/9428518/javascript-0-at-the-end-of-match-statement
    if (match) {
        var year = match[1];
        var month = ("0" + match[2]).slice(-2);
        var day = ("0" + match[3]).slice(-2);
        return year + "-" + month + "-" + day;
    }
    console.log("not matched")
    // Return the original string if the format is not recognized
    return dateString;
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function createAnchorElement(text) {
    // Create the anchor element
    const anchor = document.createElement('a');

    // Set the href attribute
    anchor.href = `lfp://${text}`;

    // Set the inner text
    anchor.innerText = text;

    // Return the created anchor element
    return anchor;
}