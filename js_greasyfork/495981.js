// ==UserScript==
// @name         Eboek.info Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @author       PcLover2
// @description  Make Eboek.info nicer to look at and automate downloads
// @match        https://eboek.info/stripboeken/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495981/Eboekinfo%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/495981/Eboekinfo%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let downloadLinksButton = document.getElementById('downloadlinks');
    if (downloadLinksButton) {
        downloadLinksButton.click();
    }

    // Function to create and inject the button and input boxes
    function injectControls() {
        let downloadLinksElement = document.getElementById('downloadlinks');
        if (downloadLinksElement) {
            // Create input boxes for start and end indices
            let startInput = document.createElement('input');
            startInput.type = 'number';
            startInput.placeholder = 'Start';
            startInput.id = 'startIndex';
            startInput.style.marginRight = '10px';
            startInput.style.padding = '15px';
            startInput.style.width = '60px';
            startInput.style.color = '#fff';
            startInput.style.background = '#444444';
            startInput.value = '1';

            let endInput = document.createElement('input');
            endInput.type = 'number';
            endInput.placeholder = 'Einde';
            endInput.id = 'endIndex';
            endInput.style.marginRight = '10px';
            endInput.style.padding = '15px';
            endInput.style.width = '70px';
            endInput.style.background = '#444444';
            endInput.style.color = '#fff';
            endInput.value = '1000';

            // Create the button
            let button = document.createElement('button');
            button.innerHTML = 'Download';
            button.style.marginTop = '10px';
            button.style.padding = '15px';
            button.style.width = 'auto';
            button.style.background = '#444444';
            button.style.color = '#fff';
            button.onclick = function() {
                startAutoClick();
            };

            // Insert the inputs and button immediately after the downloadlinks element
            downloadLinksElement.parentNode.insertBefore(startInput, downloadLinksElement.nextSibling);
            downloadLinksElement.parentNode.insertBefore(endInput, startInput.nextSibling);
            downloadLinksElement.parentNode.insertBefore(button, endInput.nextSibling);
        }
    }

    // Function to start the auto-click process
    function startAutoClick() {
        // Click the p element with id 'downloadlinks'
        let downloadLinksButton = document.getElementById('downloadlinks');
        if (downloadLinksButton) {
            downloadLinksButton.click();
        }

        // Function to click links inside td elements with class 'filename'
        function clickLinks() {
            let links = document.querySelectorAll('td.filename a');
            let startIndex = parseInt(document.getElementById('startIndex').value) - 1; // Adjust for 0-based index
            let endIndex = parseInt(document.getElementById('endIndex').value) - 1; // Adjust for 0-based index

            // Ensure valid indices
            startIndex = Math.max(0, startIndex);
            endIndex = Math.min(links.length - 1, endIndex);

            for (let i = startIndex; i <= endIndex; i++) { // Include endIndex
                setTimeout(() => {
                    links[i].click();
                }, (i - startIndex) * 1000); // Adjust the interval as needed
            }
        }

        // Set a delay to allow the page to update after clicking the downloadlinks button
        setTimeout(clickLinks, 2000); // Adjust this delay as needed
    }

    // Function to hide elements by ID
    function hideElementById(id) {
        var element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    // Function to remove specific styles from an element by ID
    function removeContainerStyles(id) {
        var element = document.getElementById(id);
        if (element) {
            element.style.webkitBoxShadow = 'none';
            element.style.boxShadow = 'none';
        }
    }

    // Function to change background color for body.custom-background
    function changeBodyBackgroundColor() {
        var bodyElement = document.querySelector('body.custom-background');
        if (bodyElement) {
            bodyElement.style.backgroundColor = 'white';
        }
    }

    // Function to hide elements by class name
    function hideElementsByClass(className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }

    // Function to hide elements by class name
    function hideElementBorderByClass(className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.border = 'none';
        }
    }

    // Function to hide <p> elements with more than 2 underscores
    function hideParagraphsWithUnderscores() {
        var paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(function(paragraph) {
            if (paragraph.textContent.split('_').length > 3) {
                paragraph.style.display = 'none';
            }
        });
    }

    // Function to add search input field
    function addSearchField() {
        var postElements = document.getElementsByClassName('post');
        if (postElements.length > 0) {
            var searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search...';
            searchInput.id = 'searchInput';
            searchInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    search();
                }
            });

            // Applying styles to the search input
            searchInput.style.background = '#444444';
            searchInput.style.borderBottom = '1px solid #ccc';
            searchInput.style.borderTop = '1px solid #d8d8d8';
            searchInput.style.marginBottom = '10px';
            searchInput.style.padding = '15px';
            searchInput.style.overflow = 'visible';
            searchInput.style.position = 'relative';
            searchInput.style.width = '100%';
            searchInput.style.color = '#fff';

            var container = document.createElement('div');
            container.classList.add('searchcustom');
            container.appendChild(searchInput);

            postElements[0].parentNode.insertBefore(container, postElements[0]);
        }
    }

    // Function to perform search
    function search() {
        var query = document.getElementById('searchInput').value.trim().replace(/\s+/g, '+');
        window.location.href = 'https://eboek.info/?s=' + query;
    }

    // Function to style all img tags
    function styleAllImages() {
        var images = document.getElementsByTagName('img');
        for (var i = 0; i < images.length; i++) {
            images[i].style.width = 'auto';
            images[i].style.maxHeight = '250px';
        }
    }

    // Function to hide h2 tags
    function hideSpecificH2() {
        var h2s = document.getElementsByTagName('h2');
        Array.from(h2s).forEach(function(h2) {
            if (h2.textContent.trim() === "Download Of Lees De Strips Online") {
                h2.style.display = 'none';
            }
        });
    }

    // Function to remove the specified style properties
    function removeUnselectableStyles() {
        // Get all elements with the class 'unselectable'
        const elements = document.querySelectorAll('.unselectable');

        // Iterate through each element
        elements.forEach(element => {
            // Remove the specific style properties
            element.style.webkitUserSelect = 'auto';
            element.style.webkitTouchCallout = 'auto';
            element.style.mozUserSelect = '';
            element.style.msUserSelect = '';
            element.style.userSelect = 'auto';
        });
    }

    // Function to set the font-size of elements with the class 'entry-content' to 15px
    function setEntryContentFontSize() {
        const elements = document.querySelectorAll('.entry-content');
        elements.forEach(element => {
            element.style.fontSize = '15px';
        });
    }

    // Function to remove oncontextmenu attribute from all img tags
    function removeOnContextMenuFromImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.oncontextmenu = null;
        });
    }

    // Function t create a div called stripinfo
    function Makedivforp() {
        // Find the unselectable div
        var unselectableDiv = document.querySelector('div.unselectable');

        if (unselectableDiv) {
            // Find the image element
            var imgElement = unselectableDiv.querySelector('img');

            // Find all the p elements following the img element
            var pElements = Array.from(imgElement.parentElement.querySelectorAll('p'));

            // Hide the first and second p elements
            if (pElements.length >= 2) {
                pElements[0].style.display = 'none';
                pElements[1].style.display = 'none';

                // Create a new div for the p elements with class 'striptext'
                var stripTextDiv = document.createElement('div');
                stripTextDiv.classList.add('striptext');
                pElements.forEach(function(pElement) {
                    stripTextDiv.appendChild(pElement);
                });

                // Create a new div with class 'stripinfo'
                var stripInfoDiv = document.createElement('div');
                stripInfoDiv.classList.add('stripinfo');
                stripInfoDiv.style.display = 'flex'; // Apply display flex

                // Apply right padding to the img element
                imgElement.style.paddingRight = '15px';

                // Move the image and the stripTextDiv into the stripInfoDiv
                stripInfoDiv.appendChild(imgElement);
                stripInfoDiv.appendChild(stripTextDiv);

                // Append the stripInfoDiv into the unselectableDiv
                unselectableDiv.appendChild(stripInfoDiv);
            }
        }
      }

    function MakeTitleDissapear() {
        // Find the entry div
        var entryDiv = document.querySelector('div.entry');

        if (entryDiv) {
            // Find all children of entry div
            var children = entryDiv.children;

            // Iterate over children and remove all except entry-content div
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.classList.contains('entry-content')) {
                    // If it's entry-content div, do nothing
                    continue;
                } else {
                    // Otherwise, remove the element
                    entryDiv.removeChild(child);
                }
            }
        }
      }

    // Inject the inputs and button when the script loads
    injectControls();
    // Run the function once when the script is loaded
    removeUnselectableStyles();
    // Hide the elements with ID 'header' and 'nav'
    hideElementById('header');
    hideElementById('nav');
    // Remove specific styles from the element with ID 'container'
    removeContainerStyles('container');
    // Change the background color of body.custom-background to white
    changeBodyBackgroundColor();
    // Hide the elements with class 'entry-footer clearfix'
    hideElementsByClass('entry-footer clearfix');
    hideElementsByClass('cbxwpbkmarkwrap');
    hideElementById('gallery-2');
    // Hide borders for elements with class 'post'
    hideElementBorderByClass('post');
    setEntryContentFontSize();
    // Hide <p> elements with more than 2 underscores
    hideParagraphsWithUnderscores();
    removeOnContextMenuFromImages();
    // Add search input field and button
    addSearchField();
    styleAllImages();
    hideSpecificH2();

})();



(function() {
    'use strict';

    // Change color of <p> and <h2> elements to white
    let elements = document.querySelectorAll('p, h2, a, h1, span');
    elements.forEach(element => {
        element.style.color = 'white';
    });

    // Change background color of <body>
    document.body.style.backgroundColor = '#1e1e1e';

    // Change background color of <div> with id 'content'
    let contentDiv = document.getElementById('content');
    if (contentDiv) {
        contentDiv.style.backgroundColor = '#1e1e1e';
    }

    // Change background color of <div> with class 'post'
    let postDivs = document.querySelectorAll('div.post');
    postDivs.forEach(div => {
        div.style.backgroundColor = '#1e1e1e';
    });
      // Add border-radius to all <img> elements
    let images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.borderRadius = '10px';
    });
})();