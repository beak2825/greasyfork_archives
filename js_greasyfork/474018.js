// ==UserScript==
// @name         Word Count for Gone Wild Audio Search Interface
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This script loads word counts for script offers in the preview
// @author       HelloWorld1337
// @match        https://gwasi.com/
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474018/Word%20Count%20for%20Gone%20Wild%20Audio%20Search%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/474018/Word%20Count%20for%20Gone%20Wild%20Audio%20Search%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // register mutation observer so wordcounts get refetched when content is updated
    let observer = new MutationObserver(callback);
    function callback (records) {
        for (const record of records) {
            // Check if the childlist of the target node has been mutated
            if (record.type === "childList" && record.addedNodes.length === 1 && record.addedNodes[0].nodeName === 'A') {
                fetchWordCountForNode(record.addedNodes[0]);
            }
        }
    }

    observer.observe(document.querySelector('.results'), {
        childList: true,
        subtree: true,
    });


    function fetchWordCountForNode(link){
        if(link && link.querySelector('.flair-ScriptOffer') && !link.querySelector('.flair-wordCount')){
            GM.xmlHttpRequest({
                method: "GET",
                url: link.getAttribute('href'),
                onload: function(response) {
                    const dom = htmlToElement(response.responseText);

                    // fetch scriptbin word count
                    const scriptbinLink = dom.querySelector('a[href^="https://scriptbin.works/"]')

                    if(scriptbinLink){
                        GM.xmlHttpRequest({
                            method: "GET",
                            url: scriptbinLink.getAttribute('href'),
                            headers: {'Cookie': 'ta=y'},
                            onload: function(response){
                                const scriptBinDom = htmlToElement(response.responseText);
                                const scriptBits = scriptBinDom.querySelector('#script-bits');
                                if(scriptBits){
                                    const wordCount = scriptBits.getAttribute('data-readywordcount');
                                    insertWordCountFlair(wordCount,  link.querySelector('.flair-ScriptOffer'));
                                }

                            }});
                    }

                    // fetch ao3 word count
                    const ao3Link = dom.querySelector('a[href^="https://archiveofourown.org/works"]')
                    if(ao3Link){
                        GM.xmlHttpRequest({
                            method: "GET",
                            url: ao3Link.getAttribute('href'),
                            onload: function(response){
                                const ao3Dom = htmlToElement(response.responseText);
                                const scriptWordsTag = ao3Dom.querySelector('dd.words');
                                if(scriptWordsTag){
                                    const wordCount = scriptWordsTag.textContent;
                                    insertWordCountFlair(wordCount,link.querySelector('.flair-ScriptOffer'));
                                }
                            }});
                    }

                }
            });
        }
    }


    function fetchAllWordCounts () {
        for(const link of document.querySelectorAll('.results ul > a')){
            // only send requests for script offers that have not already been loaded
            fetchWordCountForNode(link);

        }
    }

    function htmlToElement(html) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        return dom;
    }

    function insertWordCountFlair(wordCount, insertAfterElement){
        const wordCountFlair = document.createElement('span');
        wordCountFlair.classList.add('flair');
        wordCountFlair.classList.add('audio');
        wordCountFlair.classList.add('wordCount');
        wordCountFlair.style = 'margin-left: 4px';
        wordCountFlair.textContent = wordCount + ' words';
        insertAfter(wordCountFlair, insertAfterElement)
    }

    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }


    window.onload = fetchAllWordCounts;

}());