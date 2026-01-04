// ==UserScript==
// @name         JPDB-Export
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Allows you to export your JPDB decks (see readme on github for more info)
// @author       JaiWWW
// @license      GPL-3.0
// @match        https://jpdb.io/deck?*
// @match        https://jpdb.io/add-to-deck-from-shirabe-jisho*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @homepageURL  https://github.com/JaiWWW/JPDB-Export
// @supportURL   https://github.com/JaiWWW/JPDB-Export/issues/new
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/451149/JPDB-Export.user.js
// @updateURL https://update.greasyfork.org/scripts/451149/JPDB-Export.meta.js
// ==/UserScript==

/*

Changelog:
1. Fixed a bug with export button creation in decks that were already pinned.

*/

let debug = false; // Set true to enter debug mode
// Any line beginning with "debug &&" will only run if this is set to true
let superdebug = false; // Creates way more console logs
// Any line beginning with "superdebug &&" will only run if this is set to true


// Start of required script: FileSaver.js by eligrey
// https://github.com/eligrey/FileSaver.js

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.FileSaver = mod.exports;
    }
})(this, function () {
    "use strict";

    /*
    * FileSaver.js
    * A saveAs() FileSaver implementation.
    *
    * By Eli Grey, http://eligrey.com
    *
    * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
    * source  : http://purl.eligrey.com/github/FileSaver.js
    */
    // The one and only way of getting global scope in all environments
    // https://stackoverflow.com/q/3277182/1008999
    var _global = typeof window === 'object' && window.window === window ? window : typeof self === 'object' && self.self === self ? self : typeof global === 'object' && global.global === global ? global : void 0;

    function bom(blob, opts) {
        if (typeof opts === 'undefined') opts = {
            autoBom: false
        };else if (typeof opts !== 'object') {
            console.warn('Deprecated: Expected third argument to be a object');
            opts = {
                autoBom: !opts
            };
        } // prepend BOM for UTF-8 XML and text/* types (including HTML)
        // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF

        if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            return new Blob([String.fromCharCode(0xFEFF), blob], {
                type: blob.type
            });
        }

        return blob;
    }

    function download(url, name, opts) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';

        xhr.onload = function () {
            saveAs(xhr.response, name, opts);
        };

        xhr.onerror = function () {
            console.error('could not download file');
        };

        xhr.send();
    }

    function corsEnabled(url) {
        var xhr = new XMLHttpRequest(); // use sync to avoid popup blocker

        xhr.open('HEAD', url, false);

        try {
            xhr.send();
        } catch (e) {}

        return xhr.status >= 200 && xhr.status <= 299;
    } // `a.click()` doesn't work for all browsers (#465)


    function click(node) {
        try {
            node.dispatchEvent(new MouseEvent('click'));
        } catch (e) {
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
            node.dispatchEvent(evt);
        }
    } // Detect WebView inside a native macOS app by ruling out all browsers
    // We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
    // https://www.whatismybrowser.com/guides/the-latest-user-agent/macos


    var isMacOSWebView = /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent);
    var saveAs = _global.saveAs || ( // probably in some web worker
        typeof window !== 'object' || window !== _global ? function saveAs() {}
        /* noop */
        // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
        : 'download' in HTMLAnchorElement.prototype && !isMacOSWebView ? function saveAs(blob, name, opts) {
            var URL = _global.URL || _global.webkitURL;
            var a = document.createElement('a');
            name = name || blob.name || 'download';
            a.download = name;
            a.rel = 'noopener'; // tabnabbing
            // TODO: detect chrome extensions & packaged apps
            // a.target = '_blank'

            if (typeof blob === 'string') {
                // Support regular links
                a.href = blob;

                if (a.origin !== location.origin) {
                    corsEnabled(a.href) ? download(blob, name, opts) : click(a, a.target = '_blank');
                } else {
                    click(a);
                }
            } else {
                // Support blobs
                a.href = URL.createObjectURL(blob);
                setTimeout(function () {
                    URL.revokeObjectURL(a.href);
                }, 4E4); // 40s

                setTimeout(function () {
                    click(a);
                }, 0);
            }
        } // Use msSaveOrOpenBlob as a second approach
        : 'msSaveOrOpenBlob' in navigator ? function saveAs(blob, name, opts) {
            name = name || blob.name || 'download';

            if (typeof blob === 'string') {
                if (corsEnabled(blob)) {
                    download(blob, name, opts);
                } else {
                    var a = document.createElement('a');
                    a.href = blob;
                    a.target = '_blank';
                    setTimeout(function () {
                        click(a);
                    });
                }
            } else {
                navigator.msSaveOrOpenBlob(bom(blob, opts), name);
            }
        } // Fallback to using FileReader and a popup
        : function saveAs(blob, name, opts, popup) {
            // Open a popup immediately do go around popup blocker
            // Mostly only available on user interaction and the fileReader is async so...
            popup = popup || open('', '_blank');

            if (popup) {
                popup.document.title = popup.document.body.innerText = 'downloading...';
            }

            if (typeof blob === 'string') return download(blob, name, opts);
            var force = blob.type === 'application/octet-stream';

            var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;

            var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

            if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== 'undefined') {
                // Safari doesn't allow downloading of blob URLs
                var reader = new FileReader();

                reader.onloadend = function () {
                    var url = reader.result;
                    url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
                    if (popup) popup.location.href = url;else location = url;
                    popup = null; // reverse-tabnabbing #460
                };

                reader.readAsDataURL(blob);
            } else {
                var URL = _global.URL || _global.webkitURL;
                var url = URL.createObjectURL(blob);
                if (popup) popup.location = url;else location.href = url;
                popup = null; // reverse-tabnabbing #460

                setTimeout(function () {
                    URL.revokeObjectURL(url);
                }, 4E4); // 40s
            }
        });
    _global.saveAs = saveAs.saveAs = saveAs;

    if (typeof module !== 'undefined') {
        module.exports = saveAs;
    }
});

// End of required script: FileSaver.js by eligrey
// https://github.com/eligrey/FileSaver.js



(function() {
    'use strict';

    if (!GM_getValue('debugPass') && (debug || superdebug)) { // If debug and/or super debug mode is enabled AND debugPass is falsy
        if (window.confirm("Looks like you have debug mode enabled. Are you sure you want to continue?")) {
            if (superdebug) { // If super debug mode is enabled
                if (window.confirm("Are you really sure you want to continue in super debug mode? This will drown your console!")) {
                    debug = true; // Just in case you only turned on superdebug - how naughty!
                    console.log("JPDB-Export successfully launched with super debug mode enabled.");
                } else {
                    superdebug = false;
                    console.log("JPDB-Export successfully launched with debug mode enabled.");
                }
            } else {
                console.log("JPDB-Export successfully launched with debug mode enabled.");
            }
        } else {
            debug = false;
            superdebug = false;
        }
    }

    const URL = window.location.href;
    debug && console.log(`URL = ${URL}`);

    if (URL.startsWith('https://jpdb.io/deck')) { // Deck page

        debug && console.log("Deck page detected");

        let workingURL = GM_getValue('workingURL'); // if export is in progress, workingURL will store the URL of the next page to be exported
        debug && console.log(`workingURL = ${workingURL}`);

        function exportToCSV() { // Export the deck contents to a CSV file

            debug && console.log("Called exportToCSV()");
            debug && GM_setValue('debugPass', true) // Skip debug check until export is finished

            // Test if FileSaver.js is supported
            let supported;
            try {
                const isFileSaverSupported = !!new Blob;
                // isFileSaverSupported = 1; // Uncomment to test what happens on unsupported browsers
                debug && console.log("Download script supported");
                supported = true;
            } catch (e) {
                debug && console.log("Download script not supported");
                supported = false;
                const errorMessage = 'Userscript "JPDB-Export":\n\nSorry, your browser does not support the system used to download files. Please see this link for more information: https://github.com/eligrey/FileSaver.js#user-content-supported-browsers\n\nDo you want to go to this link now? (opens in new tab)';
                if (confirm(errorMessage)) { // If they click OK to go to the link
                    window.open("https://github.com/eligrey/FileSaver.js#user-content-supported-browsers");
                }
            }

            if (supported) {

                debug && console.log("Script passed supported check, now running simultaneous export check");

                workingURL = GM_getValue('workingURL'); // Refreshing workingURL so that the alreadyExporting check works without a refresh
                debug && console.log(`workingURL = ${workingURL}`);
                const alreadyExporting = "Sorry, it seems like you already have an export in progress somewhere else. This script does not currently support simultaneous exports.\n\nIf this is an error, please report it on github by pressing the bug icon in your userscript manager's panel or dashboard. Thanks!";
                if (workingURL && URL != workingURL) { // workingURL active and on a different URL - i.e. an export is in progress somewhere else
                    debug && console.log("Simultaneous export detected");
                    return window.alert(alreadyExporting);
                }

                const confirmationMessage = "Exporting your deck may take some time if it has a lot of pages. Continue?";
                if ((URL === workingURL) || confirm(confirmationMessage)) { // If they are already in progress or click OK to start export

                    debug && console.log("Export confirmed. Attempting to start export");

                    function addPageToFile() { // Append the current page to the file
                        debug && console.log("Called addPageToFile()");

                        const vocabList = document.querySelector("body > div.container.bugfix > div.vocabulary-list"); // Div containing all the vocab on the page
                        debug && console.log("vocabList:", vocabList);

                        let wordWrapper; // The <a> tag surrounding each word
                        let stringK; // This will store the current kanji string being found to add to the CSV
                        let stringR; // This will store the current reading string being found to add to the CSV
                        let fileContents = GM_getValue('fileContents'); // Get the current file contents into fileContents
                        debug && console.log("File is currently", fileContents.split("\n").length-1, "lines long.");

                        debug && console.log("Looping through each element in the vocab list:");
                        for (let i = 1; i <= vocabList.childElementCount; i++) { // Loop through each word in the vocab list

                            superdebug && console.log(`Word number ${i}`);
                            stringK = '';
                            stringR = '';
                            wordWrapper = vocabList.querySelector(`div:nth-child(${i}) > div:nth-child(1) > div.vocabulary-spelling > a`);
                            superdebug && console.log("wordWrapper:", wordWrapper);
                            for (let j = 0; j < wordWrapper.childElementCount; j++) { // Loop through each ruby element in this word
                                superdebug && console.log("Checking:", wordWrapper.children[j]);
                                if (wordWrapper.children[j].childElementCount === 0) { // If this ruby element has no children (i.e. it's kana)
                                    superdebug && console.log("It's kana, adding to both strings");
                                    // Add the contents to both strings
                                    stringR += wordWrapper.children[j].textContent;
                                    stringK += wordWrapper.children[j].textContent;
                                } else { // If this ruby element is kanji
                                    superdebug && console.log("It's kanji, adding kanji to stringK and furigana to stringR");
                                    stringK += wordWrapper.children[j].firstChild.textContent; // Add the kanji to the kanji string
                                    stringR += wordWrapper.children[j].children[0].textContent; // Add the furigana to the reading string
                                }
                            }
                            superdebug && console.log(`Adding the following line to fileContents: "${stringK},${stringR}," plus a line break`);
                            fileContents += `${stringK},${stringR},\n`; // Append the correctly formatted strings to fileContents
                        }
                        debug && console.log("Adding page to 'fileContents'");
                        GM_setValue('fileContents', fileContents); // Update the file contents
                    }

                    function createFileName() { // Create a file name and upload to storage
                        debug && console.log("Called createFileName()");

                        const container = document.querySelector("body > div.container.bugfix");
                        debug && console.log("container:", container);
                        const deckName = container.firstChild.nextSibling.textContent;
                        superdebug && console.log(`deckName = ${deckName}`);
                        const current = new Date();
                        const time = current.toLocaleTimeString();
                        const date = current.toLocaleDateString();
                        const fileName = `_${deckName}_ deck export at ${time} on ${date}.csv`;
                        debug && console.log(`filename = ${fileName}, returning fileName`);
                        return fileName;
                    }

                    function downloadFile() { // Download the file
                        debug && console.log("Called downloadFile()");

                        superdebug && console.log("Attempting call createFileName()");
                        const fileName = createFileName();
                        superdebug && console.log("Getting file contents");
                        const fileContents = GM_getValue('fileContents');

                        const blob = new Blob([fileContents], {type: "text/plain;charset=utf-8"});
                        debug && console.log("Saving file");
                        saveAs(blob, fileName);
                        GM_setValue('workingURL', ''); // Clear working URL
                        GM_setValue('debugPass', false) // Clear debug pass
                    }

                    function lastPage() { // Test if we are on the last page or not
                        debug && console.log("Called lastPage()");

                        const pagination = document.querySelector("body > div.container.bugfix > div.pagination"); // Div that shows "Next page"
                        debug && pagination ? console.log("pagination:", pagination): console.log("Single-page deck detected");
                        if (!pagination || pagination.textContent.indexOf("Next page") < 0) { // Last page
                            debug && console.log("Last page detected");
                            return true;
                        } else { // More pages to go
                            debug && console.log("More pages detected");
                            return false;
                        }
                    }

                    if (URL.indexOf("offset=") < 0) { // If they are on the first page of the deck

                        debug && console.log("First page detected.");

                        GM_setValue('fileContents', ''); // Initiate fileContents
                        superdebug && console.log("fileContents initiated.");
                        superdebug && console.log("Attempting to call addPageToFile()");
                        addPageToFile();

                        superdebug && console.log("Attempting to call lastPage()");
                        if (lastPage()) { // Download file
                            superdebug && console.log("Attempting to call downloadFile()");
                            downloadFile();
                        } else { // Redirect to next page

                            // URL looks like 'https://jpdb.io/deck?id=123' potentially with '#a' at the end
                            const redirect = URL.replace('#a', '') + '&offset=50';
                            debug && console.log(`Redirecting to ${redirect}`);
                            GM_setValue('workingURL', redirect);
                            window.location.replace(redirect);
                        }

                    } else { // They are not on the first page
                        debug && console.log("Non-first page detected");

                        if (URL === workingURL) { // If export is already in progress and they are on the right page

                            superdebug && console.log("Attempting to call addPage()");
                            addPageToFile();

                            superdebug && console.log("Attempting to call lastPage()");
                            if (lastPage()) { // Download file
                                superdebug && console.log("Attempting to call downloadFile()");
                                downloadFile();
                            } else { // Redirect to next page

                                // URL looks like 'https://jpdb.io/deck=123&offset=200'
                                const offsetIndex = URL.indexOf("offset=") + 7; // First character of the actual offset number
                                const offset = parseInt(URL.slice(offsetIndex)) + 50; // Offset value of next page
                                superdebug && console.log(`Next offset = ${offset}`);

                                const redirect = URL.slice(0, offsetIndex) + offset;
                                debug && console.log(`Redirecting to ${redirect}`);
                                GM_setValue('workingURL', redirect)
                                window.location.replace(redirect);
                            }


                        } else { // User wants to start export but has to go to the first page

                            const firstPage = URL.slice(0,URL.indexOf("offset=")-1);

                            debug && console.log(`Redirecting to ${firstPage}`);
                            GM_setValue('workingURL', firstPage);
                            window.location.replace(firstPage); // Go to first page

                        }
                    }
                }
            }
        }

        if (URL === workingURL) {
            debug && console.log("URL matches working URL");
            exportToCSV();
        } else { // Don't bother tweaking the page if we're alredy in progress
            const menu = document.querySelector("body > div.container.bugfix > div.dropdown > details > div").firstChild; // UL of options in the menu
            debug && console.log("menu:", menu);
            let shirabe;

            for (let i=0; i<menu.childElementCount; i++) { // Loop through looking for import button
                if (menu.children[i].firstChild.lastChild.value === "Import from Shirabe Jisho") { // Found import button
                    shirabe = menu.children[i];
                    debug && console.log("Found shirabe:", shirabe);
                    break;
                }
            }
            
            shirabe.firstChild.lastChild.setAttribute('value', 'Import from CSV'); // Rename to "Import from CSV"
            debug && console.log("Renamed import button");

            // Add "Export to CSV" button
            shirabe.insertAdjacentHTML('afterend', '<li id="export"><form class="link-like" method="dialog"><input type="submit" value="Export to CSV"></form></li>');
            debug && console.log("Added export button");

            const exportButton = document.getElementById("export");
            exportButton.addEventListener('click', exportToCSV); // Call exportToCSV() when exportButton is clicked
            debug && console.log("Added event listener to export button");
        }
    }

    if (URL.startsWith('https://jpdb.io/add-to')) { // Import page

        debug && console.log("Import page detected");

        const heading = document.querySelector("body > div.container.bugfix > h4"); // "Import from Shirabe Jisho" heading
        debug && console.log("heading:", heading);
        heading.innerHTML = 'Import from CSV'; // Changing the heading
        debug && console.log("Changed heading");

        const bulletOne = document.querySelector("body > div.container.bugfix > ul > li:nth-child(1)"); // First bullet point
        debug && console.log("bulletOne:", bulletOne);
        bulletOne.innerHTML += ', decks or any other correctly-formatted CSV file';
        debug && console.log("Edited first bullet point");
        // Add a bullet point explaining how to find the correct format
        bulletOne.insertAdjacentHTML(
            'afterend', '<li>To see an example of the correct format, try exporting a deck and opening the file in a text editor</li>');
            debug && console.log("Inserted a new bullet point");
    }
})();
