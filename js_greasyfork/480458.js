// ==UserScript==
// @name         Goodreads to StoryGraph
// @namespace    https://github.com/ar3h1d/Goodreads-to-StoryGraph
// @version      0.1
// @description  User script to add a link from every book page on Goodreads to StoryGraph
// @author       ar3h1d
// @match        https://www.goodreads.com/book/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ar3h1d/Goodreads-to-StoryGraph/icon.png
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/480458/Goodreads%20to%20StoryGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/480458/Goodreads%20to%20StoryGraph.meta.js
// ==/UserScript==

function getElementByXpath(path) {
    // Find an element in page with Xpath
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function createButton(storygraphLink){
    // Create the button element
    const storygraphButton = document.createElement('button');
    storygraphButton.className = 'Button Button--secondary Button--medium';
    storygraphButton.href = storygraphLink;
    storygraphButton.textContent = 'StoryGraph';
    storygraphButton.target = '_blank';
    storygraphButton.style.marginLeft = '10px';
    storygraphButton.style.marginRight = '15px';
    //storygraphButton.style.border = '1px solid';
    //storygraphButton.style.color = '#d24040';

    // Add an onclick attribute that calls a function to redirect the user
    storygraphButton.onclick = function () {
        window.open(storygraphLink, '_blank');
    };

    // Find the TMDb button
    const shareButton = document.querySelector("#__next > div.PageFrame.PageFrame--siteHeaderBanner > main > div.BookPage__gridContainer > div.BookPage__rightColumn > div.BookPage__mainContent > div.BookPageTitleSection > div.BookPageTitleSection__share > div > button");
    if (shareButton) {
        // Insert the 30nama button after the All Topics button
        shareButton.parentNode.insertBefore(storygraphButton, shareButton.nextSibling);
    }
}

(function () {
    'use strict';

    // Extract movie title from the URL
    //const ISBNNode = getElementByXpath("//*[@id=\"__next\"]/div[2]/main/div[1]/div[2]/div[2]/div[2]/div[6]/div/span[2]/div[1]/span/div/dl/div[3]/dd/div/div[1]");
    //const ISBN = ISBNNode ? ISBNNode.textContent : null;
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    let jsonContent = JSON.parse(scriptTag.textContent);
    let ISBN = jsonContent.isbn;

    let bookURL = document.URL.split("/");
    let bookParts = bookURL[bookURL.length - 1].split("-");
    bookParts.shift();
    let bookTitle = bookParts.join(" ");

    if (ISBN) {
        //try{
        // Split the text by space and take the first part, which is the ISBN13
        //    ISBN = ISBN.split(' ')[0];
        //} catch (error) {console.error;}
        // Create the storygraph link with ISBN in the page
        const storygraphLink = `https://app.thestorygraph.com/browse?search_term=${ISBN}`;
        createButton(storygraphLink);
    }
    else {
        // Create the storygraph link with Book Title in URL
        const storygraphLink = `https://app.thestorygraph.com/browse?search_term=${bookTitle}`;
        createButton(storygraphLink);
    }

})();

//<button type="button" class="Button Button--transparent Button--small Button--rounded" aria-label="Share"><span class="Button__labelItem"><i class="Icon ShareIcon">
