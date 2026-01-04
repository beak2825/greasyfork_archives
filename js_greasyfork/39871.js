// ==UserScript==
// @name         WebBot to View 2 Sites
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  will be a bot and get you hits
// @author       Erik Toor
// @include      *
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/39871/WebBot%20to%20View%202%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/39871/WebBot%20to%20View%202%20Sites.meta.js
// ==/UserScript==

// tries to do dis w userinput 

if (window.location.href === "https://www.webassigngenius.com/") { 
    var run = parseInt(prompt("would you like to run site viewer 4.1? \n1 = yes\n2 = no")); // start that script 
  
        if (run === 1 ) { 
            if (window.location.href === "https://www.webassigngenius.com/") { // set storage for site 
                //console.log("settinglocalstorage");
            	var site = prompt('whats ur site bro \n finish your domain with a forward slash\nex https://google.com should be https://google.com/'); // prompt to get the site
            	localStorage.setItem('site', site);
            	var site2 = prompt('whats ur site2 bro \n finish your domain with a forward slash\nex https://google.com should be https://google.com/'); // prompt to get the site
            	localStorage.setItem('site2', site2);
            }
            
    //        var switch1 = function switch1() {window.open(localStorage.getItem("site2")); window.close();}
    
            if (window.location.href === localStorage.getItem("site")) { // code that will run for the first site 
                    console.log('we are on one of the sites that was inputted to the script');
                    setTimeout(window.open(localStorage.getItem("site2")), 5000); 
                    setTimeout(window.close(), 5000); 
    
            /** 
            The stuff in here will set the time of the timer at a location for the site and then check for the time and to see if the diff bw b and the timer is 30
            Then it will open a new site and close the other site programmatically
            */
            
                    /**localStorage.setItem(('timer'),(b = setInterval( function () { console.log(b); b++;}, 1000))); // creates a timer and sets the beginning timer time
                    while (b - parseInt(localStorage.getItem('timer'))<10) { 
                        console.log(b - parseInt(localStorage.getItem('timer')));
                    
                    if (window.location.href === localStorage.getItem("site") && b - parseInt(localStorage.getItem('timersite')) > 10) { 
                        window.open(localStorage.getItem("site")); //put this back in later 
                        localStorage.remove("timer")
                        window.close();
                        }
                    }   */
                    }
            
            if (window.location.href === localStorage.getItem("site2")) { // code that will run for the first site 
                    console.log('we are on one of the sites that was inputted to the script');
                    setTimeout(window.open(localStorage.getItem("site")), 5000); 
                    setTimeout(window.close(), 5000); 
                    }
        }

}