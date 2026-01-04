// ==UserScript==
// @name         Hide Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ///
// @author       You
// @match        https://nhentai.net/*
// @match        https://nhentai.to/*
// @match        https://www.pixiv.net/*
// @match        https://mangadex.org/*
// @match        https://hennojin.com/*
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @match        https://comics.inkr.com/*
// @match        https://imhentai.xxx/*
// @match        https://tmohentai.com/*
// @match        https://igg-games.com/*
// @match        https://www.hentaicore.net/*
// @match        https://redlanterntl.wordpress.com/*
// @match        https://www.mangaupdates.com/*
// @match        https://kemono.su/*
// @match        https://hitomi.la/*
// @match        https://sukebei.nyaa.si/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500322/Hide%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/500322/Hide%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scriptEnabled = true; // Flag to control whether the script is enabled or disabled
    var originalElements = []; // Array to store original elements and their brightness settings
    const currentURL = window.location.href; // Current URL of the webpage

    // Configuration object mapping URLs to CSS selectors
    const pageConfigurations = {
        'https://tmohentai.com': 'div[style*="https://imgrojo.tmohentai.com/contents"]',
        'https://e-hentai.org/': 'div[style*="https://ehgt.org"]',
        'https://www.pixiv.net': 'div[class^="sc-x1dm5r-0"]',
        'https://hitomi.la': 'div.dj-img1, div.dj-img2, div.dj-img-back, div.cg-img1, div.cg-img2'
    };

    // Function to apply brightness effect to an element
    function applyEffect(element, brightness) {
        // Sets the element's brightness filter style if it exists and brightness is not null.
        // Otherwise, remove the filter.
        element.style.filter = element && brightness !== null ? 'brightness(' + brightness * 100 + '%)' : '';
    }

    // Function to restore original styles of elements
    function restoreOriginalStyles() {
        originalElements.forEach(originalElement => applyEffect(originalElement[0], originalElement[1]))
        originalElements = [];
    }

    // Function to disable the script
    function disableScript() {
        scriptEnabled = false;
        console.log('SCRIPT DISABLED');
        restoreOriginalStyles();
    }

    // Function to enable the script
    function enableScript() {
        scriptEnabled = true;
        console.log('SCRIPT ENABLED');
        runScript();
    }

    function createButton(){
        // Crear el botón
        var button = document.createElement('button');
        button.textContent = 'Hide/Show Images';
        button.id = 'fixedButton';

        // Aplicar estilos al botón para que esté siempre en la parte inferior central de la pantalla
        var style = document.createElement('style');
        style.textContent = `
            #fixedButton {
                position: fixed;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 1000; /* Asegurarse de que el botón esté en el frente */
            }
            #fixedButton:hover {
                background-color: #0056b3;
            }
        `;
        document.head.appendChild(style);

        // Agregar el botón al cuerpo del documento
        document.body.appendChild(button);

        // Agregar un event listener al botón (opcional)
        button.addEventListener('click', function() {
            console.log('¡Botón presionado!');
            if (scriptEnabled) {
                disableScript();
            } else {
                enableScript();
            }
        });
    }

    // Function to retrieve brightness value from element's computed style
    function getBrightnessFromStyle(element) {
        const style = window.getComputedStyle(element); // Gets the computed style of the element
        const filterValue = style.getPropertyValue('filter'); // Gets the value of the computed style's 'filter' property
        const brightnessMatch = filterValue.match(/brightness\(([^)]+)\)/); // 'brightness(' + any character except ')' + ')'.
        
        // If there is no value for 'filter', it does not contain 'brightness', or the match is invalid, return null
        if (!filterValue || !filterValue.includes('brightness') || !brightnessMatch || brightnessMatch.length <= 1) {
            return null;
        }

        // Return the brightness value as a floating number
        return parseFloat(brightnessMatch[1]);
    }

    // Function to process an element based on its type (Image or Div)
    function processElement(element, typeString) {
        // Determine the information to log based on the element's type
        const elementInformation = typeString === 'Image' ? element.src : element.className;
        console.log(typeString + ': ' + elementInformation);

        // Store the original element and its brightness value in the originalElements array
        const brightness = getBrightnessFromStyle(element)
        originalElements.push([element, brightness]);

        // Applying brightness effect (default: 0%)
        applyEffect(element, 0);
    }

    // Main function to run the script
    function runScript() {
        // Select all <img> elements on the page and process each one as an 'Image'
        const images = document.querySelectorAll('img');
        images.forEach(img => processElement(img, 'Image'))

        let term; // Variable to store the CSS selector configuration for the current URL
        var special_page = false; // Flag to determine if the current page is a special page based on URL configurations

        // Iterate through each URL configuration in pageConfigurations object
        for (const url in pageConfigurations) {
             // Check if the current URL starts with the URL from pageConfigurations
            if (currentURL.startsWith(url)) {
                special_page = true;
                // Get the CSS selector configuration for this URL
                term = pageConfigurations[url];
                // Select all elements matching the CSS selector and process each as a 'Div'
                const elements = document.querySelectorAll(term);
                elements.forEach(element => processElement(element, 'Div'));
            }
        };
        
        // Create a new MutationObserver to monitor changes in the DOM
        const observer = new MutationObserver(function(mutationsList, observer) {
            // Iterate over each mutation that occurred
            mutationsList.forEach(function(mutation) {
                // Check if the mutation type is 'childList' (nodes were added or removed)
                if (mutation.type === 'childList') {
                    // Convert addedNodes NodeList to an array
                    const addedNodes = Array.from(mutation.addedNodes);

                    // Iterate over each added node
                    addedNodes.forEach(function(node) {
                        // Check if the node has a tagName (it's an element node)
                        if (node.tagName) {
                            // Check if the special_page flag is true and the node is a <div>
                            if (special_page && node.tagName.toLowerCase() === 'div') {
                                // Query all new <div> elements that match the specified term
                                const newDivs = node.querySelectorAll(term);

                                // If there are matching <div> elements, process each as a 'Div'
                                if (newDivs.length > 0) {
                                    // Process each new <div> element as a 'Div'
                                    newDivs.forEach(div => processElement(div, 'Div'))
                                }
                            }
                            // Check if the node is an <img> element
                            if (node.tagName.toLowerCase() === 'img') {
                                const img = node;
                                // Process the inserted <img> element as an 'Image'
                                processElement(img, 'Image');
                            }
                        }
                    });
                }
            });
        });

        // Start observing changes on the entire document body, including all its descendants
        observer.observe(document.body, { childList: true, subtree: true });

        /* console.log(special_page); */
        // Event listener for dynamically inserted nodes (like new divs or images)
        /* document.addEventListener('DOMNodeInserted', function(event) {
            if (event.target.tagName) {
                // Check if the special_page flag is true and the inserted node is a <div>
                if (special_page && event.target.tagName.toLowerCase() === 'div') {
                    const newDivs = event.target.querySelectorAll(term);
                    if (newDivs.length > 0) {
                        // Process each new <div> element as a 'Div'
                        newDivs.forEach(div => processElement(div, 'Div'))
                    }
                }
                // Check if the inserted node is an <img> element
                if (event.target.tagName.toLowerCase() === 'img') {
                    const img = event.target;
                    // Process the inserted <img> element as an 'Image'
                    processElement(img, 'Image');
                }
            }
        }); */
    }

    runScript(); // Run the script initially upon page load

    createButton()

    // Event listener to toggle script enable/disable with Ctrl+Shift+Y
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyY') {
            if (scriptEnabled) {
                disableScript();
            } else {
                enableScript();
            }
        }
    });
})();