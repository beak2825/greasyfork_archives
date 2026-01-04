// ==UserScript==
// @name         Time Hooker
// @namespace    https://tampermonkey.net/
// @version      1.7
// @description  Hook the wait timers for websites that use them to delay content
// @author       Niteesh
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519308/Time%20Hooker.user.js
// @updateURL https://update.greasyfork.org/scripts/519308/Time%20Hooker.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    
    const cloudflareIndicators = [
        "Checking your browser", // Common text
        "verify your browser",  // Additional text
        "cloudflare",           // May appear in class or ID names
        "turnstile"             // Cloudflare CAPTCHA widget class
    ];
    
    function isCloudflareVerificationPresent() {
        return [...document.querySelectorAll('*')].some(el => {
            const text = el.textContent?.toLowerCase() || "";
            const idOrClass = (el.id || "") + " " + (el.className || "");
            return cloudflareIndicators.some(indicator =>
                text.includes(indicator.toLowerCase()) ||
                idOrClass.toLowerCase().includes(indicator.toLowerCase())
            );
        });
    }
    
    
    
    function print() {
        console.log(...arguments);
    }
    
    function clearAllTimers() {
        const highestIntervalId = setInterval(() => {}, 0);
        for (let i = 0; i <= highestIntervalId; i++) {
            clearInterval(i);
        }
    
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i <= highestTimeoutId; i++) {
            clearTimeout(i);
        }
    
        print('Cleared all active timers.');
    }
    
    function restoreOriginalTimers() {
        window.setInterval = originalSetInterval;
        window.setTimeout = originalSetTimeout;
        print("Restoring done.");
    }
    
    function interceptTimers(val) {
        window.setTimeout = function(callback, delay, ...args) {
            const newDelay = delay / val;
            print(`[Intercepted] setTimeout: ${delay}ms -> ${newDelay}ms`);
            return originalSetTimeout(callback, newDelay, ...args);
        };

        window.setInterval = function(callback, interval, ...args) {
            const newInterval = interval / val;
            print(`[Intercepted] setInterval: ${interval}ms -> ${newInterval}ms`);
            return originalSetInterval(callback, newInterval, ...args);
        };
    }
	interceptTimers(15);
    let timerUsed = false;
    let potentialTimers;
    
    window.onload = function() {
    
        potentialTimers = [...document.querySelectorAll('*')].filter(el => {
    		const text = el.textContent.trim().toLowerCase();
    		const waitRegexes = [
                /wait\s+\d+\s+seconds/i,          
                ///please\s+wait/i,
                /click\s+on\s+(image|button)/i, 
                /click\s+and\s+wait\s+\d+/i
            ];
            return waitRegexes.some(regex => regex.test(text));
    		//return /wait\s+\d+\s+seconds/i.test(text) || /please\s+wait/i.test(text);
    	});
    	if (potentialTimers.length > 0) {
    		print("Potential timers detected:", potentialTimers);
    		timerUsed = true;
    
    	} else {
    		print("No timers detected.");
    		
    		restoreOriginalTimers();
    		
    		if (isCloudflareVerificationPresent()) {
    		  print("Cloudflare verification detected...");
    		} else {
    		  originalSetTimeout(_ => {
    		      clearAllTimers();
    		  }, 3000);
    		}
    	}



        (function () {
    const overlayClassName = "custom-overlay";

    // Function to create and append an overlay on a given element
    function createOverlay(element) {
        // Check if the overlay already exists
        if (element.querySelector(`.${overlayClassName}`)) return;

        // Create the overlay
        const overlay = document.createElement('div');
        //overlay.textContent = "Overlay"; // Optional: Add text to the overlay
        overlay.className = overlayClassName;

        // Style the overlay
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(255, 0, 0, 0.3)"; // Red overlay with transparency
        overlay.style.zIndex = "9999";
        overlay.style.pointerEvents = "none"; // Allow clicks to pass through
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.color = "white";
        overlay.style.fontSize = "16px";

        // Ensure the parent element has `position: relative` for correct overlay placement
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === "static") {
            element.style.position = "relative";
        }

        // Append the overlay
        element.appendChild(overlay);
        element.style.zIndex = 1001;
        element.style.position = "absolute"
        element.style.top = '0';
        element.style.left = '0';
    }


            const HIGH_Z_INDEX_THRESHOLD = 9999; // Define the threshold for "too high"
    const ADJUSTED_Z_INDEX = 1000; // Define the new reasonable z-index value

    // Function to find and adjust high z-index elements
    function adjustHighZIndex() {
        const elements = [...document.querySelectorAll('*')]; // Get all elements
        elements.forEach(el => {
if (el == document.querySelectorAll('.overlayClassName')) {
    return;
}
            const zIndex = window.getComputedStyle(el).zIndex;
            if (!isNaN(zIndex) && zIndex > HIGH_Z_INDEX_THRESHOLD) {
                console.log(`Element with high z-index found:`, el);
                console.log(`Original z-index: ${zIndex}`);
                el.style.zIndex = ADJUSTED_Z_INDEX; // Adjust the z-index
                console.log(`Adjusted z-index to: ${ADJUSTED_Z_INDEX}`);
            }
        });
    }

            

            function logLinks() {
                const targetKeywords = ["continue", "get link"]; // Keywords to match
        const elements = [...document.querySelectorAll('*')].filter(el =>
            (targetKeywords.some(keyword => el.textContent.toLowerCase().includes(keyword))) && ((el.tagName === 'A' && el.href) || // Standard links
            (el.tagName === 'BUTTON') || // Buttons with click handlers
            el.getAttribute('role') === 'link') // Elements with role="link"
        );
                print(elements);
        elements.forEach(el => {
            console.log("Found link/button:");
            console.log({
                tag: el.tagName,
                text: el.textContent.trim(),
                href: el.href || "N/A",
                onclick: el.onclick ? el.onclick.toString() : "N/A"
            });
        });

        console.log(`Total links/buttons found: ${elements.length}`);
    }

    // Initial log of all links
    
    // Function to find all relevant elements and overlay them

    function overlayLinks() {
        const targetKeywords = ["continue", "get link"];
        const elements = [...document.querySelectorAll('*')].filter(el =>
            targetKeywords.some(keyword => el.textContent.toLowerCase().trim().includes(keyword)) &&
            (el.tagName === 'BUTTON' || el.tagName === 'A' || el.onclick || el.hasAttribute('role'))
        );

        elements.forEach(element => {
            createOverlay(element);
            print(element)
        });

        console.log(`${elements.length} elements overlaid.`);
    }

    // Initial overlay
    


    // Use MutationObserver to handle dynamically added elements


     if (timerUsed) {
         adjustHighZIndex();
         logLinks();
         overlayLinks();
         const observer = new MutationObserver(() => {
        overlayLinks();
        logLinks();
        adjustHighZIndex()
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Log for debugging
    console.log("Overlay script is running...");
    print("Link logging is active...");

     }
})();


    	/*
    	if (timerUsed) {
            print("setting up...");
            
            originalSetInterval(() => {
                const button = document.querySelector('button:enabled, .clickable');
                let clickable = [];
                clickable = [...document.querySelectorAll('*')].find(el =>
                                                                     (el.textContent.toLowerCase().includes("continue") || el.textContent.toLowerCase().includes("get link") || el.textContent.toLowerCase().includes("robot")) &&
                                                                     (el.tagName === 'BUTTON' || el.tagName === 'A') && !el.disabled
                                                                    );
   
        		if (clickable) {
        			print("Clickable element found:", clickable);
        			if (clickable.tagName === 'BUTTON') {
        			     clickable.click();
        			} else if (clickable.tagName === 'A') {
        			     print(clickable.href);
        			     if (clickable.href !== window.location.href) {
        			        window.location.replace(clickable.href);
        			     }
        			}
        // 			else {
        // 			     print("just trying to click, do you find the exact button?");
        // 			     clickable.click();
        // 			}
        			
        		} else {
        			print("No clickable element found.");
        		}
    		}, 1000);
            
            // dynamically searching for a button
    		const observer = new MutationObserver((mutations) => {
    			mutations.forEach(mutation => {
    			    const button = [...document.querySelectorAll('*')].find(el =>
        					(el.textContent.toLowerCase().includes("continue") || el.textContent.toLowerCase().includes("get link")) &&
        					(el.tagName === 'BUTTON' || el.tagName === 'A') && !el.disabled
        				);
    				
    				if (button) {
    					print("Dynamically loaded 'continue' button found:", button);
    					observer.disconnect(); // Stop observing once found
                        button.click();
    					print("clicked");
    				}
    			});
    		});
    
    		// Start observing changes in the DOM
    		observer.observe(document.body, {
    			childList: true,
    			subtree: true
    		});
    	} else {
		
		}
        */
    }

})();