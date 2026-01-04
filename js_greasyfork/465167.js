// ==UserScript==
// @name         DropBox Link Converter & Mass Downloader w Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  #1 Change  dl=0 to dl=1 #2 Add Textarea with the list of links and wget preppended (so just cut and paste into the command line)
// @author       sharmanhall
// @license      MIT
// @connect      greasyfork.org
// @connect      sleazyfork.org
// @connect      github.com
// @connect      openuserjs.org
// @match        *://*.dropbox.com/*
// @grant        none
// @icon         https://cf.dropboxstatic.com/static/images/icons/blue_dropbox_glyph-vflJ8-C5d.png
// @downloadURL https://update.greasyfork.org/scripts/465167/DropBox%20Link%20Converter%20%20Mass%20Downloader%20w%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/465167/DropBox%20Link%20Converter%20%20Mass%20Downloader%20w%20Button.meta.js
// ==/UserScript==

//This updated script adds a button to the page labeled "Convert Links and Download." When the button is clicked, the script scrolls to the bottom of the page to load more links, converts the links to direct download links, and adds a textarea to the page with the list of links. The links are also formatted with `wget` so that they can be used in the command line. The button is temporarily disabled after the links are converted and re-enabled after a few seconds.
//Please note that this script is designed to work on Dropbox pages that match the URL pattern specified in the `@match` directive (`*://*.dropbox.com/*`). If you encounter any issues, please make sure that the script is running on the appropriate Dropbox page.


(function() {
    'use strict';

    const SECONDS_TO_WAIT_FOR_SCROLL = 1; // adjust as needed
    const DOWNLOAD_URL_REPLACEMENT = '?dl=1';

    // function to get all link elements
    function getLinks() {
        const links = document.querySelectorAll('a.dig-Link.sl-link--file[href*="dl=0"]');
        return Array.from(links).map(link => link.getAttribute('href').replace(/\?dl=0$/, DOWNLOAD_URL_REPLACEMENT));
    }

    // function to scroll to the bottom of the page and wait for new links to load
    async function waitForLinksToLoad() {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, SECONDS_TO_WAIT_FOR_SCROLL * 1000));
    }

    // create an array to hold the links
    let links = [];

    // add a button to the page that will convert the links and add the textarea when clicked
    const convertButton = document.createElement('button');
    convertButton.classList.add('dig-Button', 'dig-Button--primary', 'dig-Button--standard', 'convert-links-button');
    convertButton.textContent = 'Convert Links and Download';
    convertButton.style.position = 'fixed';
    convertButton.style.bottom = '20px';
    convertButton.style.right = '20px';
    convertButton.style.zIndex = '9999';
    document.body.appendChild(convertButton);

    // add a click event listener to the button
    convertButton.addEventListener('click', async function() {
        let finished = false;
        let numLinks = 0;
        while (!finished) {
            // scroll to the bottom of the page and wait for new links to load
            await waitForLinksToLoad();

            // get the newly loaded links
            const newLinks = getLinks().filter(url => !links.includes(url));
            links.push(...newLinks);

            // check if all links have been loaded
            finished = newLinks.length === 0;

            numLinks += newLinks.length;
        }

        // create and append textarea with the list of links
        const mycopy = document.createElement("textarea");
        mycopy.name = "mycopy";
        mycopy.id = "mycopy";
        mycopy.maxLength = "50000";
        mycopy.cols = "180";
        mycopy.rows = "40";
        mycopy.value = links.map(link => `wget "${link}";`).join('\n');
        document.body.appendChild(mycopy);

            // disable the button and change the text to indicate that the links have been converted
    convertButton.disabled = true;
    convertButton.textContent = `${numLinks} link(s) converted`;

    // enable the button again after 3 seconds
    setTimeout(function() {
        links = [];
        convertButton.disabled = false;
        convertButton.textContent = 'Convert Links and Download';
    }, 3000);
});

    })();
