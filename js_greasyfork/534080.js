// ==UserScript==
// @name         beta Crime Value/Skill per nerve + crime morale and scmanning solver
// @version      2.1
// @description  Displays best options CS for burglary, displays money per nerve in cracking, adapts emphorus data to your crime data from crime execution and from tornreport
// @author       Created by Heartflower [2626587] adapted by Garrincha
// @match        https://www.torn.com/*
// @match        https://torn.report/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @namespace https://greasyfork.org/users/1462491
// @downloadURL https://update.greasyfork.org/scripts/534080/beta%20Crime%20ValueSkill%20per%20nerve%20%2B%20crime%20morale%20and%20scmanning%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/534080/beta%20Crime%20ValueSkill%20per%20nerve%20%2B%20crime%20morale%20and%20scmanning%20solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Player specific info


//______________________________________________________________________________________________________________________________
    /**
     * Creates and appends a sidebar to the document body for logging actions.
    // --- Sidebar Logging Functionality ---
    let logSidebar;
    let logContent;
    // Set to true to start minimized
    let isSidebarMinimized = true;

    /**
     * Creates and appends a sidebar to the document body for logging actions.

    function createLogSidebar() {
        // Check for the correct sidebar ID
        if (document.getElementById('Beta Scripts Debugger')) {
            return; // Sidebar already exists
        }

        logSidebar = document.createElement('div');
        logSidebar.id = 'tampermonkey-log-sidebar';
        Object.assign(logSidebar.style, {
            position: 'fixed',
            right: '0',
            // Initial state is minimized:
            top: 'auto', // Allows 'bottom' to control vertical position
            bottom: '50px', // Leave a 50px margin at the bottom
            width: '400px', // Set to 400px wide
            height: '30px', // Minimized height
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            borderLeft: '1px solid #333',
            zIndex: '99999',
            padding: '10px',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
            fontSize: '12px',
            overflowY: 'hidden', // Hide scrollbar for minimized state
            display: 'flex',
            flexDirection: 'column',
            transition: 'height 0.3s ease, top 0.3s ease' // Smooth transition for minimize/maximize
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            marginBottom: '10px',
            paddingBottom: '5px',
            borderBottom: '1px solid #555'
        });
        logSidebar.appendChild(header);

        const headerTitle = document.createElement('span');
        headerTitle.textContent = 'Tampermonkey Log';
        header.appendChild(headerTitle);

        const minimizeButton = document.createElement('button');
        // Set initial text and title for minimized state
        minimizeButton.textContent = '+'; // Plus sign for maximize
        minimizeButton.title = 'Maximize Log';
        Object.assign(minimizeButton.style, {
            background: 'none',
            border: '1px solid #777',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            width: '20px',
            height: '20px',
            lineHeight: '1',
            borderRadius: '3px',
            cursor: 'pointer',
            padding: '0',
            textAlign: 'center'
        });
        header.appendChild(minimizeButton);

        logContent = document.createElement('div');
        Object.assign(logContent.style, {
            flexGrow: '1',
            overflowY: 'hidden', // Log content scrolls, but hidden when minimized
            display: 'none' // Hide content initially
        });
        logSidebar.appendChild(logContent);

        document.body.appendChild(logSidebar);

        // Add event listener for the minimize button
        minimizeButton.addEventListener('click', () => {
            isSidebarMinimized = !isSidebarMinimized;
            if (isSidebarMinimized) {
                logSidebar.style.height = '30px'; // Minimized height
                logSidebar.style.top = 'auto'; // Reset top
                logSidebar.style.bottom = '50px'; // Stick to bottom
                logContent.style.overflowY = 'hidden'; // Hide scrollbar
                logContent.style.display = 'none'; // Hide content
                minimizeButton.textContent = '+'; // Plus sign for maximize
                minimizeButton.title = 'Maximize Log';
            } else {
                logSidebar.style.height = 'auto'; // Restore auto height
                logSidebar.style.top = '30%'; // Restore top position (from user's previous request)
                logSidebar.style.bottom = '50px'; // Keep bottom margin
                logContent.style.overflowY = 'auto'; // Restore scrollbar
                logContent.style.display = 'block'; // Show content
                minimizeButton.textContent = '–'; // Minus sign for minimize
                minimizeButton.title = 'Minimize Log';
                // Scroll to bottom after maximizing to show latest logs
                logContent.scrollTop = logContent.scrollHeight;
            }
            logAction(`Sidebar ${isSidebarMinimized ? 'minimized' : 'maximized'}.`);
        });
    }

    /**
     * Logs a message to the custom sidebar.
     * @param {string} message The message to log.

    function logAction(message) {
        if (!logContent) {
            // If sidebar isn't ready yet, fall back to console (shouldn't happen with proper init)
            console.log(message);
            return;
        }
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${timestamp}] ${message}`;
        Object.assign(logEntry.style, {
            marginBottom: '5px',
            wordBreak: 'break-word'
        });
        logContent.appendChild(logEntry);
        // Scroll to the bottom to show the latest log, only if not minimized
        if (!isSidebarMinimized) {
            logContent.scrollTop = logContent.scrollHeight;
        }
    }

    // --- End Sidebar Logging Functionality ---

    /**
     * Handles all URL change detection and subsequent actions.
     * This function consolidates the logic from your provided script.
     */
   function checkUrl() {
        const hash = location.hash;
        const currentHref = window.location.href;

//        logAction(`URL Changed. Current URL: ${currentHref}, Hash: ${hash}`);

        // Only trigger general crime page actions if the URL is EXACTLY the crimes page base URL.
        const isCrimesPageExact = currentHref === "https://www.torn.com/loader.php?sid=crimes#/";
        if (isCrimesPageExact) {
//            logAction("URL is exactly 'https://www.torn.com/loader.php?sid=crimes#/'. Triggering general crime page actions with 0.5s delay.");
            setTimeout(() => {
                addCrimesPageMuseumWarning();
                flashCrimeSelectorIfMuseumDay();
            }, 500);
        }

        // Now, separately check for specific hash pages.
        // These will run if their hash matches, regardless of the 'sid=crimes' check above.
        // This allows both general crime page actions and specific hash actions to occur.
        if (hash === '#/disposal') {
 //           logAction("Hash matches '#/disposal'. Triggering fetchDisposals() with 0.5s delay.");
            setTimeout(() => {
                fetchDisposals();
            }, 500);
        } else if (hash === '#/cracking') {
   //         logAction("Hash matches '#/cracking'. Triggering fetchCrackings() with 0.5s delay.");
            setTimeout(() => {
                fetchCrackings();
            }, 500);
        } else if (hash === '#/burglary') {
   //         logAction("Hash matches '#/burglary'. Triggering fetchBurglary() with 0.5s delay.");
            setTimeout(() => {
                fetchBurglary();
            }, 500);
        } else {
   //         logAction("No specific crime page detected based on current URL or hash.");
        }
    }

    // --- Event Listeners and History API Patching ---

    // Create the sidebar as soon as the script executes
  //  createLogSidebar();

    // Initial check when the script loads
 //   logAction("Script initialized. Performing initial URL check.");
    checkUrl();

    // Listen for 'popstate' (browser back/forward) and 'hashchange' events
    // Wrapped in setTimeout to ensure URL is fully updated
    window.addEventListener('popstate', () => {
 //       logAction("Event: 'popstate' detected. Deferring URL check.");
        setTimeout(checkUrl, 0);
    });
    window.addEventListener('hashchange', () => {
 //       logAction("Event: 'hashchange' detected. Deferring URL check.");
        setTimeout(checkUrl, 0);
    });

    // Patch pushState and replaceState to also detect changes made by SPAs
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
  //      logAction("History: 'pushState' called. Deferring URL check.");
        setTimeout(checkUrl, 0); // Defer to ensure URL is updated
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
  //      logAction("History: 'replaceState' called. Deferring URL check.");
        setTimeout(checkUrl, 0); // Defer to ensure URL is updated
    };

    // Listen for all clicks on the document, with a delay for URL check
    document.addEventListener("click", (event) => {
        // If the clicked element is (or is inside) a method button, do not run the URL check.
        // On other clicks, delay and check.
        if (event.target.closest('.methodButton___lCgpf')) {
 //           logAction("Click: Method button clicked. Skipping immediate URL check.");
            return;
        }
 //       logAction("Click: Non-method button clicked. Delaying URL check by 500ms.");
        setTimeout(checkUrl, 500);
    });

    // --- MutationObserver for DOM changes ---
    let mutationObserverTimeout;
    const excludedSelector = '.toggle-content___BJ9Q9'; // The element to exclude from observation triggers

    const observer = new MutationObserver((mutationsList, observer) => {
        let relevantMutationFound = false;
        for (const mutation of mutationsList) {
            // Check if the mutation target itself or any added/removed nodes are within the excluded element
            // Node.ELEMENT_NODE ensures we only check actual elements
            const isTargetExcluded = mutation.target.nodeType === Node.ELEMENT_NODE && mutation.target.closest(excludedSelector);
            let isNodeExcluded = false;

            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.closest(excludedSelector)) {
                        isNodeExcluded = true;
                        break;
                    }
                }
            }
            if (!isNodeExcluded && mutation.removedNodes) { // Only check removedNodes if not already excluded by addedNodes
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.closest(excludedSelector)) {
                        isNodeExcluded = true;
                        break;
                    }
                }
            }

            // If neither the target nor any added/removed nodes are within the excluded element,
            // then this is a relevant mutation.
            if (!isTargetExcluded && !isNodeExcluded) {
                relevantMutationFound = true;
                break; // Found a relevant mutation, no need to check further
            }
        }

        if (relevantMutationFound) {
            // Use a timeout to debounce multiple rapid mutations into a single checkUrl call
            clearTimeout(mutationObserverTimeout);
            mutationObserverTimeout = setTimeout(() => {
   //             logAction("Relevant DOM Mutation detected. Triggering URL check.");
                checkUrl();
            }, 100); // Debounce for 100ms
        } else {
  //          logAction("DOM Mutation detected, but it was within the excluded area. Skipping URL check.");
        }
    });

    // Start observing the document body for changes in its children and subtree
    // Also observe attributes, as content might change via attribute updates (like the 'updated' timestamp)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
 //   logAction("MutationObserver started on document.body, filtering changes within " + excludedSelector);


        // --- End Checkurl Logging Functionality ---

})();


function fetchDisposals() {
    addMuseumAdvisoryBanner();

function addMuseumAdvisoryBanner() {
  if (!isMuseumDay()) return;

  const crimeContainer = document.querySelector(
    "#react-root > div > div.crime-root.disposal-root > div > div.currentCrime___MN0T1"
  );
  if (!crimeContainer) return;

  // ===== 1. Insert museumDayWarning under the titleBar
  const titleBar = crimeContainer.querySelector(".titleBar___Cci85");
  if (titleBar && !crimeContainer.querySelector(".museumDayWarning")) {
    const museumDayWarning = document.createElement("div");
    museumDayWarning.className = "museumDayWarning";
    museumDayWarning.style.background = "#fffbe6";
    museumDayWarning.style.border = "1px solid #e0d38c";
    museumDayWarning.style.color = "#666";
    museumDayWarning.style.fontSize = "13px";
    museumDayWarning.style.padding = "8px";
    museumDayWarning.style.margin = "4px 8px";
    museumDayWarning.style.borderRadius = "6px";
    museumDayWarning.style.display = "flex";
    museumDayWarning.style.alignItems = "center";

    museumDayWarning.innerHTML = `
      ⚠️ Pay Attention to Museum Day Starting Time — Consider burying all today's targets but
      <span style="color: goldenrod;"> Old Furniture (68%) </span> and
      <span style="color: goldenrod;"> Building Debris (70%) </span>.`;

    crimeContainer.insertBefore(museumDayWarning, titleBar.nextSibling);
  }

  // ===== 2. Insert museumRowWarning above virtualList
  const virtualList = crimeContainer.querySelector(".virtualList___noLef");
  if (virtualList && !crimeContainer.querySelector(".museumRowWarning")) {
    const museumRowWarning = document.createElement("div");
    museumRowWarning.className = "museumRowWarning";
    museumRowWarning.style.background = "#fffbe6";
    museumRowWarning.style.border = "1px solid #e0d38c";
    museumRowWarning.style.color = "#666";
    museumRowWarning.style.fontSize = "13px";
    museumRowWarning.style.padding = "8px";
    museumRowWarning.style.margin = "4px 8px";
    museumRowWarning.style.borderRadius = "6px";
    museumRowWarning.style.display = "flex";
    museumRowWarning.style.alignItems = "center";

    museumRowWarning.innerHTML = `⚠️ Museum Day Tip: Consider Avoiding <strong>Old Furniture (68%) and Building Debris (70%). Bury the rest!`;

    crimeContainer.insertBefore(museumRowWarning, virtualList);
  }
}
        let disposalData = [
            { name: 'Biological Waste', method: 'Abandon', emfsample: 407, emfCScrime: 7.82145782145782, emfaveragemoneynerve: 3731.19778869779, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Biological Waste', method: 'Bury', emfsample: 324, emfCScrime: 8.68055555555556, emfaveragemoneynerve: 3129.83217592593, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Biological Waste', method: 'Burn', emfsample: 184, emfCScrime: 1.14130434782609, emfaveragemoneynerve: 2050.29239130435, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'Biological Waste', method: 'Sink', emfsample: 1428, emfCScrime: 7.86064425770308, emfaveragemoneynerve: 2333.99754901961, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },

            { name: 'Body Part', method: 'Abandon', emfsample: 607, emfCScrime: 9.17078528281164, emfaveragemoneynerve: 9451.10708401977, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Body Part', method: 'Bury', emfsample: 413, emfCScrime: 9.26150121065375, emfaveragemoneynerve: 7999.33171912833, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Body Part', method: 'Burn', emfsample: 184, emfCScrime: 7.8804347826087, emfaveragemoneynerve: 6299.32336956522, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'Body Part', method: 'Sink', emfsample: 93, emfCScrime: 7.16845878136201, emfaveragemoneynerve: 5011.54121863799, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Body Part', method: 'Dissolve', emfsample: 777, emfCScrime: 6.99577128148557, emfaveragemoneynerve: 4972.23414230557, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Building Debris', method: 'Abandon', emfsample: 2999, emfCScrime: 8.75291763921307, emfaveragemoneynerve: 1289.56818939647, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Building Debris', method: 'Bury', emfsample: 1037, emfCScrime: 0.229026036644166, emfaveragemoneynerve: 780.230351976856, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Building Debris', method: 'Sink', emfsample: 4992, emfCScrime: 7.7991452991453, emfaveragemoneynerve: 729.900607638889, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },

            { name: 'Dead Body', method: 'Abandon', emfsample: 945, emfCScrime: 7.95414462081129, emfaveragemoneynerve: 18535.2627865961, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Dead Body', method: 'Bury', emfsample: 162, emfCScrime: 9.5679012345679, emfaveragemoneynerve: 15559.1111111111, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Dead Body', method: 'Burn', emfsample: 253, emfCScrime: 7.35177865612648, emfaveragemoneynerve: 12560.776284585, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'Dead Body', method: 'Sink', emfsample: 13, emfCScrime: 6.41025641025641, emfaveragemoneynerve: 9041.02564102564, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Dead Body', method: 'Dissolve', emfsample: 485, emfCScrime: 6.86303387334315, emfaveragemoneynerve: 9806.93195876289, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Documents', method: 'Abandon', emfsample: 517, emfCScrime: 4.9645390070922, emfaveragemoneynerve: 1299.7807865893, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Documents', method: 'Bury', emfsample: 192, emfCScrime: 3.97135416666667, emfaveragemoneynerve: 1110.275390625, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Documents', method: 'Burn', emfsample: 2518, emfCScrime: 9.54328832406672, emfaveragemoneynerve: 979.967990468626, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'Documents', method: 'Sink', emfsample: 73, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Documents', method: 'Dissolve', emfsample: 22, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Firearm', method: 'Abandon', emfsample: 472, emfCScrime: 6.88559322033898, emfaveragemoneynerve: 4947.16631355932, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Firearm', method: 'Bury', emfsample: 608, emfCScrime: 8.59375, emfaveragemoneynerve: 4219.62253289474, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Firearm', method: 'Sink', emfsample: 1007, emfCScrime: 7.81198278715657, emfaveragemoneynerve: 3140.92154915591, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Firearm', method: 'Dissolve', emfsample: 19, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'General Waste', method: 'Abandon', emfsample: 4130, emfCScrime: 10.7304277643261, emfaveragemoneynerve: 297.445076674738, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'General Waste', method: 'Bury', emfsample: 2387, emfCScrime: 11.7616254713029, emfaveragemoneynerve: 244.536237955593, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'General Waste', method: 'Burn', emfsample: 2502, emfCScrime: 9.25259792166267, emfaveragemoneynerve: 193.748001598721, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'General Waste', method: 'Sink', emfsample: 438, emfCScrime: 2.14992389649924, emfaveragemoneynerve: 118.744672754947, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'General Waste', method: 'Dissolve', emfsample: 86, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Industrial Waste', method: 'Abandon', emfsample: 928, emfCScrime: 7.54310344827586, emfaveragemoneynerve: 3052.43893678161, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Industrial Waste', method: 'Bury', emfsample: 843, emfCScrime: 7.16192170818505, emfaveragemoneynerve: 2573.48976868327, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Industrial Waste', method: 'Sink', emfsample: 2462, emfCScrime: 7.72068778770647, emfaveragemoneynerve: 2306.80967370701, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },

            { name: 'Murder Weapon', method: 'Abandon', emfsample: 228, emfCScrime: 10.5263157894737, emfaveragemoneynerve: 5025.97076023392, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Murder Weapon', method: 'Bury', emfsample: 288, emfCScrime: 8.89756944444445, emfaveragemoneynerve: 4310.16059027778, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Murder Weapon', method: 'Sink', emfsample: 748, emfCScrime: 8.1216577540107, emfaveragemoneynerve: 3087.811385918, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Murder Weapon', method: 'Dissolve', emfsample: 19, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Old Furniture', method: 'Abandon', emfsample: 1375, emfCScrime: 12.0121212121212, emfaveragemoneynerve: 426.684, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Old Furniture', method: 'Bury', emfsample: 686, emfCScrime: 1.84037900874635, emfaveragemoneynerve: 257.127551020408, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Old Furniture', method: 'Burn', emfsample: 2801, emfCScrime: 9.4216351303106, emfaveragemoneynerve: 289.463013209568, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'Old Furniture', method: 'Sink', emfsample: 359, emfCScrime: 5.01392757660167, emfaveragemoneynerve: 210.25069637883, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Old Furniture', method: 'Dissolve', emfsample: 40, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Broken Appliance', method: 'Abandon', emfsample: 1328, emfCScrime: 10.0652610441767, emfaveragemoneynerve: 651.903614457831, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Broken Appliance', method: 'Bury', emfsample: 224, emfCScrime: 5.52455357142857, emfaveragemoneynerve: 432.779575892857, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:8 },
            { name: 'Broken Appliance', method: 'Sink', emfsample: 3855, emfCScrime: 7.7453523562473, emfaveragemoneynerve: 362.810462602681, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },
            { name: 'Broken Appliance', method: 'Dissolve', emfsample: 63, emfCScrime: 0, emfaveragemoneynerve: 0, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:14 },

            { name: 'Vehicle', method: 'Abandon', emfsample: 703, emfCScrime: 8.34518729255571, emfaveragemoneynerve: 2179.7240398293, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:6 },
            { name: 'Vehicle', method: 'Burn', emfsample: 741, emfCScrime: 9.58164642375169, emfaveragemoneynerve: 1459.23886639676, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:10 },
            { name: 'Vehicle', method: 'Sink', emfsample: 1313, emfCScrime: 8.01599390708302, emfaveragemoneynerve: 1228.16945925362, mysample: 0, mynerveCS: 0, myaveragemoney:0, nerveAmount:12 },];

    let crimeOptionElements = document.querySelectorAll('.crime-option');
    let existingPayoutElements = document.querySelectorAll('.hf-disposal-payout');

    if (existingPayoutElements) {
        existingPayoutElements.forEach(el => el.remove());
    }

    crimeOptionElements.forEach(crimeOptionElement => {
        let crimeTitleElement = crimeOptionElement.querySelector('.crimeOptionSection___hslpu');
        let crimeTitle = crimeTitleElement.textContent.trim();
        let methodButtons = crimeOptionElement.querySelectorAll('.methodButton___lCgpf');

        let payoutElement = document.createElement('div');
        payoutElement.className = 'hf-disposal-payout';
        payoutElement.style.display = 'flex';
        payoutElement.style.flex = '1';
        payoutElement.style.flexDirection = 'column';
        payoutElement.style.alignItems = 'flex-end';
        payoutElement.style.color = 'var(--default-base-grey1-color)';
        crimeTitleElement.appendChild(payoutElement);

        let payoutParagraph = document.createElement('p');
        payoutParagraph.className = 'hf-disposal-payout-amount';
        payoutParagraph.textContent = 'Unknown';
        payoutElement.appendChild(payoutParagraph);

        // Create left info display (Nerve/CS when selected)
        let leftInfo = document.createElement('div');
        leftInfo.className = 'hf-disposal-left-info';
        leftInfo.style.position = 'absolute';
        leftInfo.style.left = '8px';
        leftInfo.style.fontSize = '12px';
        leftInfo.style.color = 'var(--default-base-grey1-color)';
        crimeTitleElement.style.position = 'relative';
        crimeTitleElement.appendChild(leftInfo);

        let methodData = [];

        methodButtons.forEach(button => {
            let methodName = button.getAttribute('aria-label');
            let data = disposalData.find(d => d.name === crimeTitle && d.method === methodName);

            if (data) {
                let nerveCS = data.emfCScrime;
                methodData.push({ element: button, value: nerveCS, method: methodName, nerveCS: nerveCS.toFixed(2) });
                // Store the value as dataset for quick access on click
                button.dataset.nerveCS = nerveCS.toFixed(2);
            }
        });

        // Sort methods by efficiency
        methodData.sort((a, b) => b.value - a.value);

        // Color the top 3
        const colors = [
            'linear-gradient(180deg, rgba(0, 255, 0, 0.5), rgba(0, 200, 0, 0.5))',// green
            'linear-gradient(180deg, rgba(255, 255, 0, 0.5), rgba(200, 200, 0, 0.5))',// yellow
            'linear-gradient(180deg, rgba(255, 165, 0, 0.5), rgba(200, 120, 0, 0.5))'// orange
        ];

        methodData.forEach((data, index) => {
            if (index < 3) {
                data.element.style.background = colors[index];
                data.element.dataset.bg = colors[index]; // store original color
            }
        });

// Create bestMethodParagraph only once
let bestMethodParagraph = document.createElement('p');
bestMethodParagraph.style.paddingBottom = '4px';
if (methodData.length > 0) {
    bestMethodParagraph.textContent = `${methodData[0].method}`;
    payoutParagraph.parentNode.insertBefore(bestMethodParagraph, payoutParagraph);
    payoutParagraph.textContent = `${methodData[0].nerveCS} Nerve/CS`;
}

// Add click events to highlight selected method and show Nerve/CS on the left
methodButtons.forEach(button => {
    button.addEventListener('click', () => {
        methodButtons.forEach(btn => {
            btn.classList.remove('selected___TKH3R');
        });

        button.classList.add('selected___TKH3R');
        if (button.dataset.bg) {
            button.style.background = button.dataset.bg;
        }

        // Show Nerve/CS
        payoutParagraph.textContent = `${button.dataset.nerveCS} Nerve/CS`;

        // Update bestMethodParagraph text content only if selected method is different
        let selectedMethodText = `${methodData[0].method} -> ${button.getAttribute('aria-label').trim()}`;
        if (button.getAttribute('aria-label').trim() !== methodData[0].method) {
            bestMethodParagraph.innerHTML = `${methodData[0].method} <span style="color: red;">-> ${button.getAttribute('aria-label').trim()}</span>`;
            bestMethodParagraph.style.color = 'red'; // Update to red for different method
        } else {
            bestMethodParagraph.textContent = methodData[0].method;
            bestMethodParagraph.style.color = 'green'; // Keep green if it's the best method
        }
    });
});

        // Mutation Observer for button state changes (e.g., when selected)
        const observer = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const changedNode = mutation.target;
                    if (changedNode.classList.contains('selected___TKH3R')) {
                        // Handle when a button is selected
                        console.log(`Button ${changedNode.getAttribute('aria-label')} selected`);
                    } else {
                        // Handle when the button is deselected
                        console.log(`Button ${changedNode.getAttribute('aria-label')} deselected`);
                    }
                }
            });
        });

        // Observe all method buttons for class changes
        methodButtons.forEach(button => {
            observer.observe(button, {
                attributes: true, // Watch for attribute changes (class)
                childList: false, // Do not observe child nodes
                subtree: false // Do not observe subtree
            });
        });
    });
}



    function fetchCrackings() {
    let crackingValues = {
            'Cell phone record database': {average: 606200, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 9},
            'Contractor supply database': {average: 560538, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Edge firewall': {average: 474250, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 9},
            'Encrypted communication channel': {average: 695780, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 9},
            'Endpoint detection': {average: 441400, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Enhanced interrogation archive': {average: 688900, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 9},
            'Foreign intelligence records': {average: 511350, bruteForceSuccessRate: 94, crackingSuccessRate: 100, encryption: 9},
            'Level 3 security authentication': {average: 526367, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 9},
            'Military personnel records': {average: 443450, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Mission report log': {average: 490425, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 9},
            'Primary access terminal': {average: 811888, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Primary load balancer': {average: 491800, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 9},
            'Reconnaissance archive': {average: 510814, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Security mainframe': {average: 547400, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Terrorist watch list': {average: 570775, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 9},
            'Arrest records': {average: 149784, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Birth records': {average: 204332, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 3},
            'Bodycam footage repository': {average: 171653, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Cookie log': {average: 195650, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Crime statistics database': {average: 261376, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Cross connect ingress': {average: 207629, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'DNA database': {average: 227400, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Encrypted file sharing platform': {average: 119950, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Encrypted target list': {average: 156092, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Foreign exchange account': {average: 243070, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Immigration records': {average: 178248, bruteForceSuccessRate: 99, crackingSuccessRate: 96, encryption: 3},
            'Import / export records': {average: 201777, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Load balancing controller': {average: 211150, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Multi cluster ingress': {average: 245360, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Officer training records': {average: 122653, bruteForceSuccessRate: 99, crackingSuccessRate: 95, encryption: 3},
            'People of interest list': {average: 195714, bruteForceSuccessRate: 97, crackingSuccessRate: 97, encryption: 3},
            'Political donations ledger': {average: 250164, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 3},
            'Secure communications channel': {average: 181894, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 3},
            'Secure data-sharing portal': {average: 255265, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Sensitive financial ledger': {average: 166900, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 3},
            'Slush fund account': {average: 300679, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 3},
            'Stacked network switch': {average: 225675, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 3},
            'Surveillance network access': {average: 228154, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 3},
            'Surveillance records': {average: 150375, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'Vacated properties register': {average: 172972, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 3},
            'Voting records': {average: 228600, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'VRF router': {average: 262900, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 3},
            'Warrant database': {average: 180164, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 3},
            'Witness protection directory': {average: 422063, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 3},
            'API gateway': {average: 117322, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Business communications platform': {average: 121107, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Client directory': {average: 159825, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Corporate bank account': {average: 198804, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 2},
            'Digital storage platform': {average: 98992, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 2},
            'Forum administrator access': {average: 90686, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Patent filing catalog': {average: 123724, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 2},
            'Payment processing portal': {average: 132786, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 2},
            'Pre-release media bucket': {average: 110385, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 2},
            'Research & development databank': {average: 103853, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Reward code directory': {average: 99538, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Sales ledger': {average: 142827, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 2},
            'Source code repository': {average: 97600, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 2},
            'Version control system': {average: 71815, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 2},
            'Botnet command module': {average: 86456, bruteForceSuccessRate: 96, crackingSuccessRate: 99, encryption: 1},
            'Coroner post-mortem records': {average: 126707, bruteForceSuccessRate: 98, crackingSuccessRate: 98, encryption: 1},
            'Credit card records': {average: 124700, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 1},
            'Cryptocurrency mining cluster': {average: 123136, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 1},
            'Dark web storefront': {laverage: 151911, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Document storage platform': {average: 100915, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Drug test results': {average: 79062, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Enrollment documentation archive': {average: 70594, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 1},
            'Gore website': {average: 60896, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Government email account': {average: 92325, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 1},
            'Home printer cache': {average: 114549, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 1},
            'Lobbying minutes archive': {average: 94364, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 1},
            'Malpractice reports archive': {average: 88627, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 1},
            'Master password': {average: 117200, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 1},
            'Medical records database': {average: 134443, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 1},
            'Mental health records': {average: 50220, bruteForceSuccessRate: 94, crackingSuccessRate: 100, encryption: 1},
            'Network superadmin authentication': {average: 154907, bruteForceSuccessRate: 99, crackingSuccessRate: 97, encryption: 1},
            'Offshore tax account': {average: 106462, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Online filing system': {average: 89926, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Patient directory': {average: 118535, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Personal email account': {average: 58334, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Private email account': {average: 79596, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 1},
            'Private email account': {average: 69284, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Proxy server access': {average: 59685, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 1},
            'Software development hub': {average: 128420, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 1},
            'Stolen credit card repository': {average: 98884, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 1},
            'Stolen password repository': {average: 59346, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Student grade records': {average: 80304, bruteForceSuccessRate: 98, crackingSuccessRate: 98, encryption: 1},
            'Student loan ledger': {average: 115202, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 1},
            'Student personal records': {average: 69054, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 1},
            'Training records': {average: 51622, bruteForceSuccessRate: 94, crackingSuccessRate: 100, encryption: 1},
            'Union membership forum': {average: 70450, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 1},
            'Video comments log': {average: 98096, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 1},
            'Voicemail account': {average: 71411, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 1},
            'VPN provider authentication': {average: 116998, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 1},
            'Business communications platform': {average: 20181, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Calendar app': {average: 15127, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Cellphone call history': {average: 40486, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 0},
            'Cellphone provider': {average: 15084, bruteForceSuccessRate: 96, crackingSuccessRate: 99, encryption: 0},
            'Clothing store account': {average: 24550, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Cloud storage bucket': {average: 20427, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Cloud storage bucket': {average: 20378, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 0},
            'Community Q&A site': {average: 34786, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Court docket library': {average: 62388, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Criminal records archive': {laverage: 63844, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Crowdfunding account': {average: 15001, bruteForceSuccessRate: 98, crackingSuccessRate: 98, encryption: 0},
            'Cryptocurrency exchange': {average: 24636, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Cryptocurrency exchange': {average: 25201, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Dating site': {average: 15433, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Dental records': {average: 34080, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Escort service website': {average: 19866, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 0},
            'Fantasy sports account': {average: 14799, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Fitness tracker': {average: 15392, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Game streaming account': {average: 15271, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'High school records': {average: 40247, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'HOA records': {average: 15741, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Home network access': {average: 35641, bruteForceSuccessRate: 95, crackingSuccessRate: 98, encryption: 0},
            'Home router access': {average: 24261, bruteForceSuccessRate: 95, crackingSuccessRate: 97, encryption: 0},
            'Home security system': {average: 39676, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Home security system': {average: 19916, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Home wi-fi network': {average: 14829, bruteForceSuccessRate: 94, crackingSuccessRate: 100, encryption: 0},
            'Image board account': {average: 20488, bruteForceSuccessRate: 97, crackingSuccessRate: 99, encryption: 0},
            'Instant messenger': {average: 18845, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Legal advice portal': {average: 26320, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 0},
            'Mental health records': {average: 45165, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'MMORPG Account': {average: 20183, bruteForceSuccessRate: 94, crackingSuccessRate: 100, encryption: 0},
            'Mortuary records': {average: 120411, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Music streaming service': {average: 15910, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Nanny-cam access': {average: 20657, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Offshore investment account': {average: 25066, bruteForceSuccessRate: 95, crackingSuccessRate: 98, encryption: 0},
            'Online auction account': {average: 25072, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Online bank account': {average: 25175, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 0},
            'Online bank account': {average: 44363, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Online forum account': {average: 14626, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Online gambling account': {average: 15113, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Online payment service': {average: 25263, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Online pharmacy account': {average: 14944, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 0},
            'Online photo collection': {average: 34531, bruteForceSuccessRate: 94, crackingSuccessRate: 98, encryption: 0},
            'Online RPG account': {average: 20823, bruteForceSuccessRate: 94, crackingSuccessRate: 99, encryption: 0},
            'Online therapy account': {average: 15316, bruteForceSuccessRate: 90, crackingSuccessRate: 100, encryption: 0},
            'Online wishlist': {average: 24717, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 0},
            'Patient database': {average: 71049, bruteForceSuccessRate: 98, crackingSuccessRate: 98, encryption: 0},
            'Personal blog': {average: 14942, bruteForceSuccessRate: 98, crackingSuccessRate: 99, encryption: 0},
            'Personal email account': {average: 15538, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Personal email account': {average: 37084, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Personal email account': {average: 80948, bruteForceSuccessRate: 95, crackingSuccessRate: 100, encryption: 0},
            'Personal website': {average: 20023, bruteForceSuccessRate: 94, crackingSuccessRate: 98, encryption: 0},
            'Political party hub': {average: 24705, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Porn site': {average: 19966, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Portfolio website': {average: 20291, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Prescription generating software': {average: 43167, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 0},
            'Search engine history': {average: 15719, bruteForceSuccessRate: 97, crackingSuccessRate: 100, encryption: 0},
            'Secure filing system': {average: 59928, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Sentencing history database': {average: 51450, bruteForceSuccessRate: 93, crackingSuccessRate: 93, encryption: 0},
            'Smart heating controls': {average: 15701, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Smart pet feeder': {average: 16180, bruteForceSuccessRate: 94, crackingSuccessRate: 100, encryption: 0},
            'Social media account': {average: 24712, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Social network profile': {average: 15343, bruteForceSuccessRate: 99, crackingSuccessRate: 98, encryption: 0},
            'Stock trading platform': {average: 24541, bruteForceSuccessRate: 98, crackingSuccessRate: 98, encryption: 0},
            'Takeout delivery app': {average: 15400, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'University network authentication': {average: 19806, bruteForceSuccessRate: 99, crackingSuccessRate: 100, encryption: 0},
            'Video calling app': {average: 20123, bruteForceSuccessRate: 98, crackingSuccessRate: 99, encryption: 0},
            'Video game storefront': {average: 20248, bruteForceSuccessRate: 95, crackingSuccessRate: 99, encryption: 0},
            'Webcam network access': {average: 44545, bruteForceSuccessRate: 93, crackingSuccessRate: 100, encryption: 0},
            'Work disciplinary records': {average: 35500, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 0},
            'Work email account': {average: 25164, bruteForceSuccessRate: 98, crackingSuccessRate: 100, encryption: 0},
            'Work email account': {average: 19904, bruteForceSuccessRate: 97, crackingSuccessRate: 99, encryption: 0},
            'Remote PC access': {average: 25097, bruteForceSuccessRate: 96, crackingSuccessRate: 100, encryption: 0},
            'National archive': {average: 216900, bruteForceSuccessRate: 100, crackingSuccessRate: 100, encryption: 0},
        };

        let highestPayoutValue = 0;
        let highestPayoutElements = [];
        let bruteForceStrength = 6.7265;
        // For when real bruteforce from rig is to be used just remove the //
        //let rigStatusElement = document.querySelector('.rigStatus___PyA3T');
        //let bruteForceStrengthElement = rigStatusElement.querySelector('.strength___DM3lW');
        //bruteForceStrengthElement.querySelector('.value___FmWPr').textContent;

        let previousPayoutDivs = document.querySelectorAll('.payoutPerNerve');

        if (previousPayoutDivs) {
            previousPayoutDivs.forEach(element => {
                element.remove();
            });
        }

        let crimeOptionElements = document.querySelectorAll('.crime-option');
        crimeOptionElements.forEach(crimeOptionElement => {
            let targetElement = crimeOptionElement.querySelector('.targetSection___F_nB4');
            let crimeTypeElement = targetElement.querySelector('.service___uYhDL');
            let crimeType = crimeTypeElement.textContent;
            let passwordLength = crimeOptionElement.querySelectorAll('.charSlot___b_S9h').length;

            if (crackingValues.hasOwnProperty(crimeType)) {
                let lowReward = crackingValues[crimeType].low;
                let highReward = crackingValues[crimeType].high;
                let averageReward = crackingValues[crimeType].average;
                let encryption = crackingValues[crimeType].encryption;
                let payoutPerNerve = '';
                let tries = '';
                    let bruteForceSuccessRate = (crackingValues[crimeType].bruteForceSuccessRate / 100) || 1;
                    let crackingSuccessRate = (crackingValues[crimeType].crackingSuccessRate / 100) || 1;
                    tries = (passwordLength * (encryption + 1)) / (bruteForceStrength * bruteForceSuccessRate);
                    let totalNerve = Math.max(12,(7 * tries + 5) / crackingSuccessRate);
                    payoutPerNerve = averageReward / totalNerve;

                let formattedPayoutPerNerve = '$' + Math.round(payoutPerNerve).toLocaleString('en-US');
                let payoutDiv = document.createElement('div');
                payoutDiv.className = 'payoutPerNerve';
                payoutDiv.textContent = formattedPayoutPerNerve;
                payoutDiv.style.display = 'flex';
                payoutDiv.style.flex = '1';
                payoutDiv.style.justifyContent = 'right';
                targetElement.appendChild(payoutDiv);

                // Update highest payout
               if (payoutPerNerve > 6000) {
                highestPayoutElements.push(crimeOptionElement);
            }
            }
        });

        crimeOptionElements.forEach(element => {
            element.style.background = '';
        });

        // Highlight the crime options with the highest payout
        highestPayoutElements.forEach(element => {
        element.style.background = 'linear-gradient(180deg, rgba(108, 173, 43, 0.5), rgba(77, 124, 30, 0.5))';
    });
    }


function fetchBurglary() {
    let burglarycasings = {
            "Tool Shed": "1",
            "Beach Hut": "1",
            "Bungalow": "1-2",
            "Mobile Home": "1-2",
            "Cottage": "1-2",
            "Apartment": "4-6",
            "Suburban Home": "1-2",
            "Secluded Cabin": "1-2",
            "Farmhouse": "2-3",
            "Lake House": "3+",
            "Luxury Villa": "2-3",
            "Manor House": "4-6",
            "Self-Storage Facility": "2-3",
            "Funeral Directors": "6+",
            "Market": "5+",
            "Postal Office": "4-6",
            "Cleaning Agency": "1-2",
            "Barbershop": "1-2",
            "Liquor Store": "2-3",
            "Dentists Office": "1-2",
            "Chiropractors": "2-3",
            "Recruitment Agency": "4-6+",
            "Advertising Agency": "7+",
            "Dockside Warehouse": "7+",
            "Farm Storage Unit": "4-6",
            "Shipyard": "8+",
            "Printing Works": "8+",
            "Brewery": "4-6",
            "Truckyard": "1-2",
            "Old Factory": "1-2",
            "Slaughterhouse": "1-3",
            "Paper Mill": "2-3",
            "Foundry": "2-3",
            "Fertilizer Plant": "2-3"
        };

    let burglaryOptions = document.querySelectorAll('.crime-option');

    burglaryOptions.forEach(crimeOption => {
        let confidenceElement = crimeOption.querySelector('.confidenceFill___EG9Li');
        let confidenceSection = crimeOption.querySelector('.crimeOptionSection___hslpu.flexGrow___S5IUQ');

        if (confidenceElement && confidenceSection) {
            // Extract the height percentage from the style attribute
            let heightStyle = confidenceElement.style.height;
            let confidenceValue = parseFloat(heightStyle.replace('%', ''));

            // Apply background color based on confidence level
            if (confidenceValue < 30) {
                confidenceSection.style.background = 'rgba(255, 0, 0, 0.5)'; // 🔴 Red
            } else if (confidenceValue >= 30 && confidenceValue < 40) {
                confidenceSection.style.background = 'rgba(255, 255, 0, 0.5)'; // 🟡 Yellow
            } else if (confidenceValue >= 40) {
                confidenceSection.style.background = 'rgba(0, 255, 0, 0.5)'; // 🟢 Green
            }

            // Add text displaying confidence value
            let confidenceText = document.createElement('p');
            confidenceText.textContent = `Conf ${Math.round(confidenceValue)}%`; // Rounded value, no decimals
            confidenceText.style.fontWeight = 'bold';
            confidenceText.style.color = '#000'; // Black for visibility
            confidenceText.style.position = 'relative';
            confidenceText.style.textAlign = 'right'; // Align text content to the right

            // Append the confidence text to the section (remove old text first)
            let existingText = confidenceSection.querySelector('.confidence-text');
            if (existingText) {
                existingText.remove();
            }

            confidenceText.classList.add('confidence-text');
            confidenceSection.appendChild(confidenceText);
        }
    });
}



// MISC
function isMuseumDay() {
  const today = new Date();
  const month = today.getMonth(); // May = 4
  const date = today.getDate();
  return month === 4 && (date === 17 || date === 18 || date === 19);
}

function addCrimesPageMuseumWarning() {
  if (!isMuseumDay()) return;

  const crimeHubRoot = document.querySelector("#react-root > div > div.crimes-hub-root");
  if (!crimeHubRoot || crimeHubRoot.querySelector(".museumRowWarning")) return;

  const museumRowWarning = document.createElement("div");
  museumRowWarning.className = "museumRowWarning";
  museumRowWarning.style.background = "#fffbe6";
  museumRowWarning.style.border = "1px solid #e0d38c";
  museumRowWarning.style.color = "#666";
  museumRowWarning.style.fontSize = "18px";
  museumRowWarning.style.padding = "8px";
  museumRowWarning.style.margin = "4px 8px";
  museumRowWarning.style.borderRadius = "6px";
  museumRowWarning.style.display = "flex";
  museumRowWarning.style.alignItems = "center";

  museumRowWarning.innerHTML = `⚠️ Museum Day Tip: Go bury some stuff try to find artifacts! Pay Attention to Event Starting Time`;

  crimeHubRoot.insertBefore(museumRowWarning, crimeHubRoot.firstChild);
}

function flashCrimeSelectorIfMuseumDay() {
  if (!isMuseumDay()) return;

  const target = document.querySelector("#react-root > div > div.crimes-hub-root > div.crimeTypes___SPiiy > a:nth-child(9)");
  if (!target) return;

  // Inject keyframes if not already added
  if (!document.getElementById("museumPulseKeyframes")) {
    const style = document.createElement("style");
    style.id = "museumPulseKeyframes";
    style.innerHTML = `
      @keyframes museumBorderPulse {
        0% { box-shadow: 0 0 0px 20px goldenrod; }
        50% { box-shadow: 0 0 15px 40px goldenrod; }
        100% { box-shadow: 0 0 0px 20px goldenrod; }
      }
    `;
    document.head.appendChild(style);
  }

  // Apply the animation to the target
  target.style.animation = "museumBorderPulse 0.6s infinite";
  target.style.borderRadius = "6px"; // Optional for rounded edges
}
