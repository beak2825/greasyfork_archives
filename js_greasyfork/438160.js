// ==UserScript==
// @name         Better Stack Overflow
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Replace time format and add share button to each answer
// @author       Landon Li
// @match        *://stackoverflow.com/questions/*
// @match        *://*.stackexchange.com/questions/*
// @match        *://superuser.com/questions/*
// @match        *://askubuntu.com/questions/*
// @icon         https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438160/Better%20Stack%20Overflow.user.js
// @updateURL https://update.greasyfork.org/scripts/438160/Better%20Stack%20Overflow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function arrayFromXPathResults(elements) {
        const array = Array.from({length: elements.snapshotLength}, (_, i) => elements.snapshotItem(i));
        return array;
    }

    const replaceType1TimeSpan = async (span1) => { span1.innerText = span1.title };
    const replaceType2TimeSpan = async (span2) => { span2.innerText = span2.title.split(',')[0] };
    const addShareButton = async (div) => {
        var answerID = document.evaluate('./@id', div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;
        var actionDiv = document.evaluate('./div[1]/div[1]/div[1]', div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var shareLink = window.location.href.split('#')[0] + '#' + answerID;
        var shareDiv = htmlToElement('<div class="py6 mx-auto"><a href="#' + answerID + '" onclick="navigator.clipboard.writeText(\'' + shareLink + '\')">🔗</a></div>');
        actionDiv.appendChild(shareDiv);
    }

    console.log('Replacing time format...');
    var type1TimeSpans = document.evaluate('//div[contains(@class,"user-action-time")]//span', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    arrayFromXPathResults(type1TimeSpans).forEach(async (span) => {
        await replaceType1TimeSpan(span);
    });

    var type2TimeSpans = document.evaluate('//span[@class="comment-date"]//span', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    arrayFromXPathResults(type2TimeSpans).forEach(async (span) => {
        await replaceType2TimeSpan(span);
    });

    console.log('Adding share buttons...');
    var answerDivs = document.evaluate('//div[@id="answers"]/div[contains(@id, "answer-")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    arrayFromXPathResults(answerDivs).forEach(async (div) => {
        await addShareButton(div);
    });

})();
