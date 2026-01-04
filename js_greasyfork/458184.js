// ==UserScript==
// @name         New Reddit post list to full width
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Transforming new Reddit post list to full width.
// @author       Santeri Hetekivi
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458184/New%20Reddit%20post%20list%20to%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/458184/New%20Reddit%20post%20list%20to%20full%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define consts.
    // XPath to input to create post.
    const XPATH_INPUT_CREATE_POST = "//*[@name='createPost']";
    // XPath to sidebar div.
    const XPATH_DIV_SIDEBAR = "//*[@data-testid='frontpage-sidebar']";
    // Milliseconds to sleep after trying to find elements.
    const MS_SLEEP = 1000;
    // Maximum time to wait for element as milliseconds.
    const MS_SLEEP_MAX = 10000;

    // Function to sleep.
    function sleep(ms) {
        // Return Promise to sleep.
        return new Promise(
            resolve => setTimeout(
                resolve,
                ms
            )
        );
    }

    // Get elements by given XPath.
    function elements(xpath)
    {
        // Get XPath result.
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        // Init elements array.
        var elements = [];

        // Add all elements from XPath result.
        for (
            var i = result.snapshotLength - 1;
            0 <= i;
            i--
        )
        {
            elements.push(
                result.snapshotItem(i)
            );
        }

        // Return elements array.
        return elements;
    }

    // Function to run logic.
    async function run()
    {
        // Init variables.
        // Init variable to store elements for creating post.
        var elementsCreatePost = [];
        // Init variable to stire elements for sidebar.
        var elementsSidebar = [];
        // Init variable for total sleep time in milliseconds.
        var msSleep = 0;

        // Wait while
        while(
            (
                // no creating post elements
                (
                    elementsCreatePost = elements(
                        XPATH_INPUT_CREATE_POST
                    )
                ).length == 0
                // or
                ||
                // no sidebar elements
                (
                    elementsSidebar = elements(
                        XPATH_DIV_SIDEBAR
                    )
                ).length == 0
            )
            // and
            &&
            // max sleep time has not been eclipsed yet.
            msSleep <= MS_SLEEP_MAX
        )
        {
            // Wait.
            await sleep(MS_SLEEP);
            // Update total wait time.
            msSleep += MS_SLEEP;
        }

        // Did not get exactly 1 post element.
        if(elementsCreatePost.length != 1)
        {
            // Return.
            return;
        }

        // If has exactly 1 sidebar element.
        if(elementsSidebar.length == 1)
        {
            // Remove sidebar.
            elementsSidebar[0]
                .parentElement
                .remove();
        }

        // Get posts element from create post element.
        const ELEMENT_POSTS = elementsCreatePost[0]
        .parentElement
        .parentElement;

        // Set posts element width to 100%.
        ELEMENT_POSTS
            .style
            .width = "100%";

        // Get children for posts element.
        const CHILDREN = ELEMENT_POSTS.children;

        // Set all of the children for posts element
        for (var i = 0; i < CHILDREN.length; i++)
        {
            // to width 100%.
            CHILDREN[i]
                .style
                .width = "100%";
        }

        // Change display from flex to block for parent of posts element.
        ELEMENT_POSTS.parentElement.style.display = "block";
    }

    // Wait for page to load.
    window.addEventListener(
        'load',
        function() {
            // Run logic.
            run();
        },
        false
    );
})();