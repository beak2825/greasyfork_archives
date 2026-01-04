// ==UserScript==
// @name         WebBot to View 2 Sites Statically inputted
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  will be a bot and get you hits
// @author       Erik Toor
// @include      *
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/39877/WebBot%20to%20View%202%20Sites%20Statically%20inputted.user.js
// @updateURL https://update.greasyfork.org/scripts/39877/WebBot%20to%20View%202%20Sites%20Statically%20inputted.meta.js
// ==/UserScript==

            if (window.location.href === "https://www.webassigngenius.com/") { // set storage for site 
                    console.log('we are on one of the sites that was inputted to the script');
                    setTimeout(window.open("https://tindergeniuspro.com/"), 5000); 
                    setTimeout(window.close(), 5000); 
                    
            }
            

            if (window.location.href === "https://tindergeniuspro.com/") { // code that will run for the first site 
                    console.log('we are on one of the sites that was inputted to the script');
                    setTimeout(window.open("https://www.webassigngenius.com/"), 5000); 
                    setTimeout(window.close(), 5000); 

  

        }

