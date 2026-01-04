// ==UserScript==
// @name         Extract All Posted Links
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds a button to extract all posted links (ignoring unwanted ones) and handles redirects. Now includes options to download or copy links to clipboard, with enhanced UI and local storage support to avoid duplicates.
// @author       Garcarius, neolith, NTFSvolume, cyphr
// @match        https://simpcity.cr/threads/*
// @match        https://forums.socialmediagirls.com/threads/*
// @grant        none
// @run-at       document-idle   // Wait until the page is fully loaded
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546529/Extract%20All%20Posted%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/546529/Extract%20All%20Posted%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pageURL = window.location.href.split('#')[0];
    const pathSegments = window.location.pathname.split('#')[0].split('/');
    const threadsIndex = pathSegments.indexOf("threads");
    const threadName = threadsIndex !== -1 && threadsIndex < pathSegments.length - 1 ? pathSegments[threadsIndex + 1] : "extracted_links";
    const threadPage = threadsIndex !== -1 && threadsIndex < pathSegments.length - 2 ? pathSegments[threadsIndex + 2] : "";
    // Exclude unwanted links (badges, reactions, comments, posts, etc.)
    let excludeTerms = [
        'adglare.net',
        'adtng',
        'chatsex.xxx',
        'cambb.xxx',
        'comments',
        'customers.addonslab.com',
        'energizeio.com',
        'escortsaffair.com',
        'instagram.com',
        'masturbate2gether.com',
        'member',
        'nudecams.xxx',
        'onlyfans.com',
        'porndiscounts.com',
        'posts',
        'reddit.com',
        'simpcity.su',
        'simpcity.cr',
        'forums.socialmediagirls.com',
        'stylesfactory.pl',
        'theporndude.com',
        'thread',
        'twitter.com',
        'tiktok.com',
        'data:image/svg+xml',
        'xenforo.com',
        'xentr.net',
        'youtube.com',
        'youtu.be',
        'x.com',
        "google.com/chrome"];
    let siteTerms = ['.badge', '.reaction', '.bookmark', '.comment'];

    // Create a container for the button and options
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = 1000;
    container.style.padding = '15px';
    container.style.backgroundColor = 'rgba(64, 181, 200, 0.95)';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.width = '300px'; // Increased width from 250px to 300px

    // Create the Extract Links button
    let button = document.createElement('button');
    button.innerHTML = 'Extract Links';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#40b5c8';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.marginBottom = '15px';
    button.style.width = '100%';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    button.style.transition = 'background-color 0.3s ease';

    // Button hover effect
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#2a9aa3';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#40b5c8';
    });

    // Create the option container
    let optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexDirection = 'column';
    optionsContainer.style.gap = '5px';

    // Function to create individual option rows
    function createOptionRow(content) {
        let row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '5px'; // Increased gap for better spacing
        return row;
    }

    // Create the radio buttons for action selection
    let actionRow = createOptionRow();

    let downloadOption = document.createElement('input');
    downloadOption.type = 'radio';
    downloadOption.id = 'action-download';
    downloadOption.name = 'extract-action';
    downloadOption.value = 'download';
    downloadOption.checked = true;

    let downloadLabel = document.createElement('label');
    downloadLabel.htmlFor = 'action-download';
    downloadLabel.textContent = 'Download as file';
    downloadLabel.style.cursor = 'pointer';
    downloadLabel.style.whiteSpace = 'nowrap';
    downloadLabel.style.flexBasis = '120px';

    let copyOption = document.createElement('input');
    copyOption.type = 'radio';
    copyOption.id = 'action-copy';
    copyOption.name = 'extract-action';
    copyOption.value = 'copy';


    let copyLabel = document.createElement('label');
    copyLabel.htmlFor = 'action-copy';
    copyLabel.textContent = 'Copy to clipboard';
    copyLabel.style.cursor = 'pointer';
    copyLabel.style.whiteSpace = 'nowrap';

    // Append radio buttons and labels to the action row
    actionRow.appendChild(downloadOption);
    actionRow.appendChild(downloadLabel);
    actionRow.appendChild(copyOption);
    actionRow.appendChild(copyLabel);

    let optionsRow = createOptionRow();

    let onlyCurrentPageCheckbox = document.createElement('input');
    onlyCurrentPageCheckbox.type = 'checkbox';
    onlyCurrentPageCheckbox.id = 'only-current-page';
    onlyCurrentPageCheckbox.name = 'only-current-page';
    onlyCurrentPageCheckbox.checked = false;

    let onlyCurrentPageLabel = document.createElement('label');
    onlyCurrentPageLabel.htmlFor = 'only-current-page';
    onlyCurrentPageLabel.textContent = 'Only Current Page';
    onlyCurrentPageLabel.style.cursor = 'pointer';
    onlyCurrentPageLabel.style.whiteSpace = 'nowrap';
    onlyCurrentPageLabel.style.flexBasis = '120px';

    let sortLinksCheckbox = document.createElement('input');
    sortLinksCheckbox.type = 'checkbox';
    sortLinksCheckbox.id = 'sort-links';
    sortLinksCheckbox.name = 'sort-links';
    sortLinksCheckbox.checked = true; // Defaults to sort links

    let sortLinksLabel = document.createElement('label');
    sortLinksLabel.htmlFor = 'sort-links';
    sortLinksLabel.textContent = 'Sort Links';
    sortLinksLabel.style.cursor = 'pointer';
    sortLinksLabel.style.whiteSpace = 'nowrap';

    optionsRow.appendChild(onlyCurrentPageCheckbox);
    optionsRow.appendChild(onlyCurrentPageLabel);
    optionsRow.appendChild(sortLinksCheckbox);
    optionsRow.appendChild(sortLinksLabel);

    let separatorRow = createOptionRow();
    separatorRow.style.display = 'none';

    let separatorLabel = document.createElement('label');
    separatorLabel.textContent = 'Separator:';
    separatorLabel.style.flex = '0 0 auto';
    separatorLabel.style.whiteSpace = 'nowrap';

    let separatorSelect = document.createElement('select');
    separatorSelect.id = 'separator-select';
    separatorSelect.style.flex = '1';

    let optionSpace = document.createElement('option');
    optionSpace.value = ' ';
    optionSpace.textContent = 'Space';

    let optionNewline = document.createElement('option');
    optionNewline.value = '\n';
    optionNewline.textContent = 'New Line';

    separatorSelect.appendChild(optionNewline);
    separatorSelect.appendChild(optionSpace);
    separatorSelect.value = '\n'

    separatorRow.appendChild(separatorLabel);
    separatorRow.appendChild(separatorSelect);

    optionsContainer.appendChild(actionRow);
    optionsContainer.appendChild(optionsRow);
    optionsContainer.appendChild(separatorRow);

    container.appendChild(button);
    container.appendChild(optionsContainer);

    document.body.appendChild(container);

    let navBar = document.querySelector('.p-nav');

    // Function to position the button below the navBar
    function positionButtonBelowNavBar() {
        let navBarHeight = navBar.offsetHeight;
        let navBarTop = navBar.getBoundingClientRect().top;
        container.style.top = (navBarTop + navBarHeight + 10) + 'px'; // 10px margin below the navBar
    }

    positionButtonBelowNavBar();

    window.addEventListener('resize', positionButtonBelowNavBar);
    window.addEventListener('scroll', positionButtonBelowNavBar);

    // Create the toast notification container
    let toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = 1001;
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    document.body.appendChild(toastContainer);

    // Function to show toast notifications
    function showToast(message, duration = 3000) {
        let toast = document.createElement('div');
        toast.textContent = message;
        toast.style.backgroundColor = 'rgba(0,0,0,0.8)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        toast.style.fontSize = '14px';
        toast.style.maxWidth = '300px';

        toastContainer.appendChild(toast);

        // Trigger reflow to enable transition
        void toast.offsetWidth;
        toast.style.opacity = '1';

        // Remove the toast after the specified duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, duration);
    }

    // Function to decode Base64 encoded URLs
    function decodeBase64Url(base64String) {
        try {
            return decodeURIComponent(atob(base64String).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            console.error('Error decoding Base64 URL:', e);
            return null;
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function () {
            showToast('Links copied to clipboard!');
        }, function (err) {
            console.error('Could not copy text: ', err);
            showToast('Failed to copy links to clipboard.', 5000);
        });
    }

    // Event listener to toggle separator selection visibility
    document.querySelectorAll('input[name="extract-action"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (copyOption.checked) {
                separatorRow.style.display = 'flex';
            } else {
                separatorRow.style.display = 'none';
            }
        });
    });

    const selectors = {
        images: 'img[class*=bbImage]',
        videos: 'video source',
        iframe: 'iframe[class=saint-iframe]',
        embeds: 'iframe',
        attachments_block: 'section[class=message-attachments]',
        attachments: 'a',
        embeds2: 'span[data-s9e-mediaembed-iframe]'
    };

    const combinedSelector = Object.values(selectors).join(', ');

    function updateLocalStorage() {
        let links = [];
        document.querySelectorAll(combinedSelector).forEach(link => {
            let href = link.href || link.src; // Use 'href' for <a> and 'src' for <iframe>

            // Check if the link contains a redirect confirmation
            if (href && href.includes('goto/link-confirmation?url=')) {
                // Extract and decode the actual URL from the Base64-encoded parameter
                try {
                    const urlObj = new URL(href);
                    const encodedUrl = urlObj.searchParams.get('url');
                    const decodedUrl = decodeBase64Url(encodedUrl);
                    if (decodedUrl) {
                        href = decodedUrl; // Use the decoded URL
                    }
                } catch (e) {
                    console.error('Invalid URL format:', href);
                }
            }

            if (href && href.includes('http')) {
                let isValid = (excludeTerms.every(term => !href.includes(term)) && siteTerms.every(term => !link.closest(term)) || href.includes('attachment')) ;

                if (isValid) {
                    links.push(href);
                }
            }
        });

        // Remove duplicate links
        links = [...new Set(links)];

        let savedLinks = JSON.parse(localStorage.getItem('saved_links')) || {};
        savedLinks[pageURL] = links;

        localStorage.setItem('saved_links', JSON.stringify(savedLinks));
        console.log(`Stored ${links.length} links from page: ${pageURL}`);
        console.log('Updated saved_links:', savedLinks);
    }

    // Event listener for button click
    button.addEventListener('click', function () {
        let savedLinks = JSON.parse(localStorage.getItem('saved_links')) || {};
        // Determine the selected action
        let selectedAction = document.querySelector('input[name="extract-action"]:checked').value;
        let separator = separatorSelect.value;
        let sortLinks = sortLinksCheckbox.checked
        let onlyCurrentPage = onlyCurrentPageCheckbox.checked;
        let fileName = threadName

        if (onlyCurrentPage) {
            fileName = threadName.concat("/", threadPage);
        }

        const threadKeys = Object.keys(savedLinks).filter(key => fileName && key.includes(fileName));
        console.log(`found ${threadKeys.length} pages`);
        let threadLinks = Object.values(threadKeys.map(key => savedLinks[key])).flat();
        console.log(threadLinks);

        if (threadLinks.length === 0) {
            showToast('No links found!', 4000);
            return;
        }

        // Remove duplicate links accross multiple pages
        threadLinks = [...new Set(threadLinks)];

        if (sortLinks) {
            threadLinks = threadLinks.sort();
        }

        if (selectedAction === 'copy') {
            let linksText = threadLinks.join(separator);
            copyToClipboard(linksText);
        } else {
            let linksText = threadLinks.join("\n");
            // Create a Blob with the links
            let blob = new Blob([linksText], { type: 'text/plain' });

            // Create a temporary link to trigger the download
            let tempLink = document.createElement('a');
            tempLink.href = URL.createObjectURL(blob);
            tempLink.download = `${fileName}.txt`;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            showToast('Links downloaded as file!');
        }
    });

    updateLocalStorage();
})();