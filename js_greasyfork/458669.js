// ==UserScript==
// @name         Remove ads and promoted tweets on Twitter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes ads and promoted tweets on Twitter, as well as the large bold "Promoted Tweet" headings
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match        https://twitter.com/*
// @match        https://*.twitter.com/*
// @match        https://x.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458669/Remove%20ads%20and%20promoted%20tweets%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/458669/Remove%20ads%20and%20promoted%20tweets%20on%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***************** CONFIGURATION STARTS HERE *****************/
    const FIND_AND_REMOVE_FREQUENCY_MS = 500; // how often to search for promoted tweets to remove them, in milliseconds (by default 500, to do it twice a second)
    const LOG_REMOVALS = false; // set to true if you want the removals to be reported in the web developer console (not usually visible unless you open it yourself)
    /****************** CONFIGURATION ENDS HERE ******************/

    const PROMOTED_ARTICLE_PATH = '//span[text()="Promoted"]/ancestor::article[@aria-labelledby]'; // xPath query to find promoted tweets, specifically their <article> DOM node
    const PROMOTED_TWEET_HEADING_PATH = '//span[text()="Promoted Tweet"]/parent::div/parent::h2/parent::div'; // Finds "<div><h2><div><span>Promoted tweet</span>…", selects the outer <div>.
    const PROMOTED_TREND_PATH = '//span[starts-with(text(),"Promoted by")]/ancestor::div[@aria-labelledby]'; // xPath query to find promoted trending topics, specifically their <div> DOM node
    const ADS_ARTICLE_PATH = '//span[text()="Ad"]/ancestor::article[@aria-labelledby]'; // xPath query to find advertising tweets, specifically their <article> DOM node

    /**
     * For an <article> element, take its list of IDs in aria-labelledby and return the DOM nodes with these IDs
     * e.g. for <article aria-labelledby="foo bar">, return the nodes with id="foo" and id="bar".
     */
    function getLabelNodes(article) {
        const labelledBy = article.getAttribute('aria-labelledby'); // space-separated node IDs
        const selector = labelledBy.split(' ').map(id => '#' + id).join(', '); // convert to a selector like '#foo, #bar'
        return Array.from(document.querySelectorAll(selector)); // returns the list of nodes found with these IDs
    }

    /** Returns whether one of the "label nodes" this article is labeled by has the text "Promoted" as its contents **/
    function isPromotedArticle(article) {
        return getLabelNodes(article)
            .some(node => ('' + node.textContent).toLowerCase() === 'promoted');
    }

    /** Returns whether the article contains a span with only the text "Ad" **/
    function isAdvertisement(article) {
        return Array.from(article.querySelectorAll('span'))
            .some(node => ('' + node.textContent).toLowerCase() === 'ad');
    }

    /** Runs an XPath query with a snapshot of the results, returns an array of the resulting elements **/
    function xPathQuerySnapshot(path) {
        const queryResult = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        return [...Array(queryResult.snapshotLength).keys()] // [0,1,2… N-1]
            .map(i => queryResult.snapshotItem(i));
    }

    /** Remove element and log reason, if needed **/
    function removeAndMaybeLog(element, logMessage) {
        if (LOG_REMOVALS) {
            console.log('Removing ' + logMessage);
        }
        element.style.display = 'none';
    }

    /** Finds and removes promoted tweets and the headings above these tweets **/
    function findAndRemoveUnwantedTweets() {
        xPathQuerySnapshot(PROMOTED_ARTICLE_PATH)
            .filter(article => isPromotedArticle(article))
            .forEach(article => removeAndMaybeLog(article, 'promoted tweet:' + article.textContent));

        xPathQuerySnapshot(ADS_ARTICLE_PATH)
            .filter(article => isAdvertisement(article))
            .forEach(article => removeAndMaybeLog(article, 'advertisement:' + article.textContent));

        xPathQuerySnapshot(PROMOTED_TWEET_HEADING_PATH)
            .forEach(div => removeAndMaybeLog(div, 'promoted tweet heading'));

        xPathQuerySnapshot(PROMOTED_TREND_PATH)
            .forEach(div => removeAndMaybeLog(div, 'promoted trending topic:' + div.textContent));
    }

    findAndRemoveUnwantedTweets(); // do it once when the page loads
    setInterval(findAndRemoveUnwantedTweets, FIND_AND_REMOVE_FREQUENCY_MS); // and then at regular intervals after that
})();