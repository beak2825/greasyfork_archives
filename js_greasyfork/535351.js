    // ==UserScript==
    // @name            RPDL Uploader Enhancements
    // @namespace       https://github.com/rpdl-net/userscripts/
    // @version         1.4-alpha.10
    // @description     Provides various enhancements to uploading workflow.
    // @author          rpdl-net
    // @match           https://dl.rpdl.net/*
    // @match           https://jenkins.rpdl.net/*
    // @match           https://f95zone.to/threads/*
    // @grant           GM_setValue
    // @grant           GM_getValue
    // @grant           GM_deleteValue
    // @grant           window.onurlchange
    // @require         https://code.jquery.com/jquery-3.7.1.min.js
    // @tag             access-required
    // @icon            https://dl.rpdl.net/favicon.ico
    // @homepage        https://github.com/rpdl-net/userscripts/tree/main/uploader-enhancements
    // @supportURL      https://github.com/rpdl-net/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/535351/RPDL%20Uploader%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/535351/RPDL%20Uploader%20Enhancements.meta.js
    // ==/UserScript==

    (function() {
        'use strict';
       
        // Define your Jenkins username here; used for redirect to build-new, and dropdown selectors jobs (transfer, token-update)
        let username = GM_getValue('username');
        if (username === undefined || username === null || username === '') {
            const username = "";
            // Input your username above.
            // const username = "bob";
            GM_setValue('username', username);}

        // Pastes the pulled values to their respective boxes, if found
        function pasteAll() {
            // Selects and fills the dropdown found on Torrent-Transfer with the username defined at the beginning of the script, or the dropdown found on Build-New with the engine value saved in GM_setValue('engine')
            // Paste is set to occur on page load, so dropdown can still be modified if transfering to another uploader, or if engine needs to be modified
            const dropdown = document.querySelector('div.jenkins-select[name="parameter"]');
            if (dropdown) {
                const usernameOption = dropdown.querySelector(`option[value="${username}"]`);
                const engineOption = dropdown.querySelector(`option[value="${GM_getValue('engine')}"]`);
                if (usernameOption) {
                    usernameOption.selected = true;
                } else if (engineOption) {
                    engineOption.selected = true;}}
            // Calls clearAllValues to remove saved/pasted values from storage after half a second
            setTimeout(clearAllValues, 500);
        }

        // Creates torrent page button style, and adds click handlers for left-click, middle-click, or new tab opening
        function createButton(text, url) {
            const button = document.createElement('button');
            button.href = url;
            button.textContent = text;
            button.classList.add("rounded-md", "px-3", "ml-2", "text-md", "text-white");
            // Applies default style
            button.style.backgroundColor = '#44557a'; // bg color 1
            button.style.borderColor = '#4d608a'; // border color 1
            button.style.borderWidth = '0.5px';
            // Applies hover style on mouseover
            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#293349'; // bg color 2
                button.style.borderColor = '#293349';}); // border color 2
            // Resets to default style on mouseout
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = '#44557a'; // bg color 1
                button.style.borderColor = '#4d608a';}); // border color 1
            // Click event handlers
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default action (redirecting the current page)
                window.open(url, '_blank');});
            button.addEventListener('auxclick', (event) => {
                if ((event.button === 1 || (event.button === 0 && event.ctrlKey)) && event.target === button) {
                    clickHandler(event);}}
                                   );
            return button;
        }

        // Adds buttons to torrent pages
        function addButtonsOnTorrentPage() {
            const torrentPage = document.querySelector('div .truncate').parentElement;
            const buildNewButton = createButton('Build-new', `https://jenkins.rpdl.net/job/build-${username}-new/build`);
            const deleteButton = createButton('Delete', 'https://jenkins.rpdl.net/job/torrent-delete/build');
            const renameButton = createButton('Rename', 'https://jenkins.rpdl.net/job/torrent-rename/build');
            const transferButton = createButton('Transfer', 'https://jenkins.rpdl.net/job/torrent-transfer/build');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add("flex")
            buttonContainer.appendChild(buildNewButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(renameButton);
            buttonContainer.appendChild(transferButton);

            torrentPage.appendChild(buttonContainer);
        }

        // Creates F95 thread button style
        function createF95Button(text) {
            const button = document.createElement('a');
            button.textContent = text;
            button.classList.add('button--link', 'button');
            button.style.color = '#ffffff';
            button.style.backgroundColor = '#44557a';
            button.style.borderColor = '#4d608a';
            button.style.borderWidth = '0.5px';
            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#293349';
                button.style.borderColor = '#293349';});
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = '#44557a';
                button.style.borderColor = '#4d608a';});
            button.addEventListener('click', (event) => {
                event.preventDefault();
                var buttonText = button.textContent.trim();
                if (buttonText === "Last page") {
                    goToLast();}});
            return button;
        }

        // Adds buttons to F95 threads
        function addF95Button() {
            const buttonGroup = document.querySelector('.buttonGroup');
            // const firstButton = buttonGroup.querySelector('.button--link.button');
            if (buttonGroup) {
                const lastButton = createF95Button('Last page');
                const firstButton = buttonGroup.querySelector('.button--link.button');
                var currentPage = window.location.href;
                if (/slide=\d+$/.test(currentPage)) {
                    return;
                } else {
                    if (firstButton.href !== lastButton.href) {
                        buttonGroup.insertBefore(lastButton, firstButton);
                    }
                }
            }
        }

        // Redirects to the last page of the thread
        function goToLast() {
            var currentPage = window.location.href;
            if (/\/page-\d+$/.test(currentPage)) {
                var newPage = currentPage.replace(/\/page-\d+$/, '/latest');
            } else {
                var newPage = currentPage.replace(/\/$/, '') + '/latest';
            }
            window.location.href = newPage;
        }

        // Function to find the rpdl.net/docs link and create a floating button
    function pasteSniffer() {
        const pageBody = document.querySelector('div.p-body');
        if (!pageBody) {
            console.log('Page body not found!');
            return;
        }

        const linkElements = pageBody.querySelectorAll('a');
        let rpdlLinkFound = false;
        let postLink = null;

        // Search through all the links on the page to find the rpdl.net/docs link
        for (const link of linkElements) {
            const href = link.getAttribute('href');
            if (href === 'https://rpdl.net/docs/') {
                console.log('Found the rpdl.net/docs link:', href);
                rpdlLinkFound = true;

                // Look for the post link near this rpdl.net/docs link
                let postContainer = link.closest('.message');
                if (postContainer) {
                    const postLinkElement = postContainer.querySelector('a[href^="/threads"]'); // Look for post link inside this post
                    if (postLinkElement) {
                        postLink = `https://f95zone.to${postLinkElement.getAttribute('href')}`;
                        console.log('Found the associated post link:', postLink);
                    }
                }
                break; // Exit once we find the rpdl.net/docs link and its associated post link
            }
        }

        if (rpdlLinkFound && postLink) {
            // Create a floating button if the rpdl.net/docs and post link are found
            createPasteButton(postLink);
        } else {
            console.log('Did not find the rpdl.net/docs link or associated post link.');
        }
    }

    // Create a floating button and add it to the page
    function createPasteButton(postLink) {
        const button = document.createElement('button');
        button.textContent = 'Open Post Link';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '14px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        // When the button is clicked, open the post link in the current window
        button.addEventListener('click', () => {
            window.location.href = postLink;
        });

        document.body.appendChild(button);
    }

function hostSniffer() {
    const f95Links = document.querySelectorAll('a[class*="link link--external"]');
    const processedUrls = new Set();
    f95Links.forEach(link => {
        const backgroundImage = getComputedStyle(link).backgroundImage;
        const urlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
            const url = urlMatch[1];
            if ((url.includes("anonymfile") || url.includes("catbox") || url.includes("delafil") ||
           url.includes("download.gg") || url.includes("files.dp.ua") || url.includes("filesfm") ||
           url.includes("up2share") || url.includes("drive.google") || url.includes("bowfile") ||
           url.includes("gofile") || url.includes("uploadnow") || url.includes("yourfilestore") ||
           url.includes("buzzheavier") || url.includes("pixeldrain")) && !processedUrls.has(url)) {
                processedUrls.add(url);
                // Target the inner span if it exists
                const span = link.querySelector('span');
                if (span) {
                    span.style.color = '#4CBB17'; // Override span's color
                } else {
                    link.style.color = '#4CBB17'; // Fallback for links without spans
                }
            }
        }
    });
};

        function init(){
            // Checks if the current page is a Jenkins job (which is not rebuild screen) or a torrent page
            const isJenkinsJob = window.location.href.startsWith("https://jenkins.rpdl.net/job/") && !window.location.href.includes("rebuild");
            const isTorrentPage = window.location.href.match(/^https:\/\/dl\.rpdl\.net\/torrent\/\d+$/);
            const isF95Page = /^https:\/\/f95zone\.to\/threads\/[^/]+/.test(window.location.href);
            // If on a Jenkins job, it waits for the page to load and calls pasteAll
            if(isJenkinsJob){
                window.addEventListener("load", pasteAll);
            // If on a torrent page, it adds the buttons
            }else if(isTorrentPage){
                waitForKeyElements("div .truncate", addButtonsOnTorrentPage);
            // If on a F95 page, it adds the buttons
            } else if (isF95Page) {
                addF95Button();
                pasteSniffer();
                hostSniffer();
            // If on another page, calls clearAllValues to remove saved/pasted values from storage
            }
        }

        // When changing pages, calls init to check if on Jenkins job or torrent page
        if(!window.onurlchange){
            window.addEventListener("urlchange", init);
        }

        // Calls init to check if on Jenkins job or torrent page
        init();

        // Redirects on post-job pages
        function performRedirect() {
            const currentUrl = window.location.href;
            // Build-new post-job redirects to new Build-new job
            if (currentUrl === `https://jenkins.rpdl.net/job/build-${username}-new/`) {
                setTimeout(() => {window.location.replace(`https://jenkins.rpdl.net/job/build-${username}-new/build`)}, 500);
            // Torrent-Delete post-job redirects to new Torrent-Delete job
    // Note: Torrent-Delete redirect is disabled by default so the post-job screen can act as a visual confirmation of completion. To enable, remove the slashes at the start of the next 2 lines.
    //        } else if (currentUrl === 'https://jenkins.rpdl.net/job/torrent-delete/') {
    //            setTimeout(() => {window.location.replace('https://jenkins.rpdl.net/job/torrent-delete/build')}, 500);
            // Torrent-Rename and Torrent-Transfer post-jobs redirect to dashboard
            } else if (currentUrl === 'https://jenkins.rpdl.net/job/torrent-rename/' || currentUrl === 'https://jenkins.rpdl.net/job/torrent-transfer/') {
                window.location.replace('https://jenkins.rpdl.net/');
            }
        }

        function waitForKeyElements (selectorTxt,actionFunction,bWaitOnce,iframeSelector) {
            var targetNodes, btargetsFound;
            if (typeof iframeSelector == "undefined")
                targetNodes     = $(selectorTxt);
            else
                targetNodes     = $(iframeSelector).contents ()
                                                .find (selectorTxt);
    
            if (targetNodes  &&  targetNodes.length > 0) {
                btargetsFound   = true;
                targetNodes.each ( function () {
                    var jThis        = $(this);
                    var alreadyFound = jThis.data ('alreadyFound')  ||  false;
    
                    if (!alreadyFound) {
                        var cancelFound     = actionFunction (jThis);
                        if (cancelFound)
                            btargetsFound   = false;
                        else
                            jThis.data ('alreadyFound', true);
                    }
                } );
            }
            else {btargetsFound   = false;}
    
            var controlObj      = waitForKeyElements.controlObj  ||  {};
            var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
            var timeControl     = controlObj [controlKey];
    
            if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
                clearInterval (timeControl);
                delete controlObj [controlKey]
            }
            else {
                if ( ! timeControl) {
                    timeControl = setInterval ( function () {
                            waitForKeyElements (    selectorTxt,
                                                    actionFunction,
                                                    bWaitOnce,
                                                    iframeSelector
                                                );
                        },
                        300
                    );
                    controlObj [controlKey] = timeControl;
                }
            }
            waitForKeyElements.controlObj   = controlObj;
        }

        // Calls performRedirect when page loads
        performRedirect();
    })();
