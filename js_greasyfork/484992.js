// ==UserScript==
// @license      open
// @name         Krawężnik v2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides minimized threads
// @author       @ZasilaczKomputerowy
// @match        *://*.wykop.pl/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484992/Kraw%C4%99%C5%BCnik%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/484992/Kraw%C4%99%C5%BCnik%20v20.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var database = new Map();
    const cacheKey = 'minimized_threads';

    function loadDatabase() {
        try {
            let storedMap = localStorage.getItem(cacheKey);
            database = new Map(JSON.parse(storedMap));
        } catch (e) {
            console.log("Failed to load list of minimized thread from cache");
        }
    }

    function saveDatabase() {
        try {
            var serializedMap = JSON.stringify(Array.from(database.entries()));
            localStorage.setItem(cacheKey, serializedMap);
        } catch (e) {
            console.log("Failed to save list of minimized thread to cache");
        }
    }

    function setProcessed(element) {
        element.setAttribute("processed", "processed");
    }

    function isProcessed(element) {
        return element.hasAttribute("processed");
    }

    function getCommentId(element) {
        return element.id.match(/\d+/)[0];
    }

    function getHidableContent(element)
    {
        let arr = Array.from(element.children).filter(function(subElement) {
            return subElement.tagName === 'DIV';
        });

        let article = element.querySelector('article');
        let arr2 = Array.from(article.children).filter(function(subElement) {

            return subElement.tagName.toLowerCase() != 'header';
        });

        return arr.concat(arr2);
    }

    function geEntryContent(element)
    {
        return Array.from(element.children).filter(function(subElement) {
            return subElement.tagName === 'ARTICLE';
        })[0];
    }

    function setMinimized(element) {
        let elements = getHidableContent(element);

        elements.forEach(function(subElement) {
            subElement.style.display = 'none';
        });

        element.setAttribute("minimized", "minimized");
    }

    function setMaximized(element) {
        let elements = getHidableContent(element);
        elements.forEach(function(subElement) {
            subElement.style.display = 'block';
        });


        element.removeAttribute("minimized");
    }

    function isMinimized(element) {
        return element.hasAttribute("minimized");
    }

    function addLabel(element) {
        let content = geEntryContent(element);
        let container = content.querySelector("button.plus").parentElement;
        let id = getCommentId(element);

        let minimizeButton = document.createElement('button');


        minimizeButton.textContent = database.get(id) ? '[ + ]' : '[ - ]';
        minimizeButton.style.color = '#71be71';
        minimizeButton.style.paddingLeft = "11px"
        minimizeButton.id = "minimizeButton";

        // Add a click event listener to the minimize button
        minimizeButton.addEventListener('click', function() {
            if(database.get(id)) {
                minimizeButton.textContent = "[ - ]";
                database.delete(id);

                setMaximized(element);
            } else {
                minimizeButton.textContent = "[ + ]";
                database.set(id, true);

                setMinimized(element);
            }

            saveDatabase();
        });

        // Append the minimize button to the container
        container.appendChild(minimizeButton);
    }

    // Function to be executed when dynamic content is added
    function handleDynamicContent(mutationsList, observer) {
        let entrySections = document.querySelectorAll("section.entry");
        entrySections.forEach(function(section) {
            try {
                if(!isProcessed(section)) {
                    let id = getCommentId(section);

                    if(database.get(id)) {
                        setMinimized(section);
                    }

                    addLabel(section);
                    setProcessed(section);
                }
            } catch (e) {e.stack;}
        });
    }

    loadDatabase();

    // Create a MutationObserver
    const observer = new MutationObserver(handleDynamicContent);

    // Start observing the target node for configured mutations
    observer.observe(document.body, { childList: true, subtree: true });
})();