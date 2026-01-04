// ==UserScript==
// @name         Julia client
// @description  Julia client for Starblast.io
// @version      1.9
// @author       Julia12333
// @license      Julia
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @run-at       document-end
// @grant        none
// @icon         https://starblast.io/static/img/icon64.png
// @downloadURL https://update.greasyfork.org/scripts/485656/Julia%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/485656/Julia%20client.meta.js
// ==/UserScript==

/* Create a logger */
const log = (msg) => console.log(`%c[Mod Injector] ${msg}`, "color: #06c26d");

// Clear the console
console.clear();

/* Stop non-modified scripts from executing */
document.open();

/* Display a loading animation while mods are being loaded */
document.write(`
    <div id="loading-animation" style="position: fixed; z-index: 100; top: 0; left: 0; width: 100%; height: 100%; background: rgb(13, 13, 13); display: flex; justify-content: center; align-items: center;">
        <div class="loader loader--style6" title="5">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="60px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <rect x="0" y="13" width="4" height="5" fill="#FF1493">
                    <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="10" y="13" width="4" height="5" fill="#FF1493">
                    <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="20" y="13" width="4" height="5" fill="#FF1493">
                    <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                </rect>
            </svg>
        </div>
    </div>
`);

document.close();
log(`Script execution started`);

// Function to inject loader and apply external script
function injectLoader() {
    /* Ensure injection only happens on the main page */
    if (window.location.pathname !== "/") {
        log(`Injection not needed on this page`);
        return;
    }

    // Fetch the contents of the external script
    fetch('https://raw.githubusercontent.com/Julia1231231/Starblast-Julia-Style/main/Julia.html')
        .then(response => response.text())
        .then(clientCode => {
            log(`External script fetched successfully`);

            const start_time = performance.now();

            log("Patching source code...");

            if (!window.sbCodeInjectors) {
                log("No Starblast.io userscripts found to load. Make sure you have scripts installed.");
                log(`Proceeding with normal script execution.`);
            } else {
                /* Loop through `sbCodeInjectors` and pass source code for them to modify */
                let error_notified = false;
                for (const injector of window.sbCodeInjectors) {
                    try {
                        /* Run injector from other userscripts */
                        if (typeof injector === "function") clientCode = injector(clientCode);
                        else {
                            log("Injector was not a function");
                            console.log(injector);
                        }
                    } catch (error) {
                        /* Notify the user if any userscript fails to load (only once) */
                        if (!error_notified) {
                            alert("One of your Starblast.io userscripts failed to load");
                            error_notified = true;
                        }
                        console.error(error);
                    }
                }
            }

            const end_time = performance.now();
            log(`Source code patched successfully (${(end_time - start_time).toFixed(0)}ms)`);

            /* Finish up and write the modified code to the document */
            document.open();
            document.write(clientCode);
            document.close();

            // Run function once the document is loaded
            document.addEventListener("DOMContentLoaded", function () {
                log("Document loaded");
                setTimeout(() => {
                    if (!window.sbCodeRunners) {
                        log("No CodeRunners found");
                    } else {
                        log("CodeRunners found");
                        for (const runner of window.sbCodeRunners) {
                            try {
                                if (typeof runner === "function") {
                                    runner();
                                } else {
                                    log("CodeRunner was not a function");
                                    console.log(runner);
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    }
                }, 30);
            });
        })
        .catch(error => {
            log(`Failed to fetch external script: ${error}`);
            alert("An error occurred while fetching game code");
        });
}

/* Delay before attempting to inject mods */
setTimeout(injectLoader, 1);


