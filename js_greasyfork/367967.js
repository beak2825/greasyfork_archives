// ==UserScript==
// @name         Google WebScraper 
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Searches google based on user inputted keywords and scrapes information for companies that match keywords
// @author       Erik 
// @include      https://www.google.com*

// @downloadURL https://update.greasyfork.org/scripts/367967/Google%20WebScraper.user.js
// @updateURL https://update.greasyfork.org/scripts/367967/Google%20WebScraper.meta.js
// ==/UserScript==

(function(){ // https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
  "use strict";


    // 1st Step -- Open Up https://google.com/    
    if (window.location.href.indexOf("search") === -1 && window.location.href === "https://www.google.com/") {  // will run this section of the code when nothing has been searched 
        alert("Script 3.2 is Running"); 
        var x = prompt("What keywords would you like to include in your search? \nPlease Seperate Keywords with , (ie restaurants,LA,California) \nRecommended amount is 3-5 keywords"); 
        var y = x.split(',');

        var j = 0; 
        var z = "";
        while (j < y.length) { // will create a string with the keywords of inputted by the user 
            var a = y[j].trim()
            z += a + "+" ;
            j++;
        }
        var HTML = ""; 
        HTML = HTML + "<br><center><h1><strong>Information</strong></h1><p>Copy and paste into excel for ease of use or get help writing a macro <a href = 'https://scriptsolutions.io'>here</a>!</p><table style='width:100%'><tr><th>Business</th><th>Name</th><th>Email</th><th>Address</th><th>Phone Number</th><th>Website</th></tr>";
        localStorage.setItem("HTML", HTML); 
        window.open("https://www.google.com/search?q=" + z + "+email@gmail.com"); // will open a seperate window that will have a search index > 0 && include emails
    }


    // Run after new Google Search Window is Open
    if (window.location.href.indexOf("search") !== -1 && window.location.href.includes("google.com/search")) { // this will run when the keywords have been opened in a new window --> should only run on data
        
        var header = document.querySelectorAll("h3.r"); // all of the header information 100 results
        var url = document.querySelectorAll("cite.iUh30"); // all of the site information 100 results
        var body = document.querySelectorAll("span.st"); // all of the data about each of the 100 results
        
        HTML = localStorage.getItem("HTML"); 
        var sites_with_no_emails = "";
        var Information = {}; 
        console.log(header); 
        for (var i = 0; i < header.length; i++) { 
            //Get header name
            var business_name =  header[i].textContent; // business name
            var site = url[i].textContent; // site URL
            var data = body[i].textContent; // all text content need to sort through this
            
            // get phone number
            var rePhone = /\d?-?\(?(\d\d\d)\)?\.?-?\s?\d\d\d-?\.?\s?\d\d\d\d/g;
            var phone = data.match(rePhone); //gets the phone number in match group 1
            if (phone !== null) { 
                Information.phone = data.match(rePhone)[0];
            } else {
                Information.phone = null; 
            }
            
            
            
            //get email
            var reEmail = /[A-Za-z\.0-9\-]*@[A-Za-z0-9\-]*\.(com|edu|org|web|xyz|net|gov)/g; 
            var email = data.match(reEmail);
            if (email!== null) { 
                Information.email = data.match(reEmail)[0];
            } else { 
                Information.email = null; 
            }
            
            //get street
            var reStreet = /([0-9][0-9][0-9][0-9]?[0-9]? ([A-Za-z\.][\.])?[A-Za-z]*\s?[A-Za-z]* (Rd|Blvd|Lane|Circle|Ln|St|Street|Road|Drive|Dr|[0-9][0-9][0-9]|[0-9][0-9])?)/g
            var street = data.match(reStreet);
            
            //get City and State
            var reState = /([A-Za-z]*, [A-Z][A-Z] ([0-9]{5})?)/g; 
            var state = data.match(reState); 
            var full_address =""; 
            if (state!==null && street!== null) { 
                full_address = street + ", " + state;  
            } else if (street === null && state !== null) { 
                full_address = state;  
            } else if (street !== null && state === null) { 
                full_address = street; 
            } else { 
                full_address = "VA";
            }
            Information.full_address = full_address;
            
            if (Information.email === null | Information.email === undefined){ 
                    sites_with_no_emails = sites_with_no_emails + site + ", ";
            } else {
                HTML = HTML + "<tr>" + "<td>" + business_name + "</td>" + "<td>" + "name" + "</td>" + "<td>" + Information.email + "</td>" + "<td>" + Information.full_address + "</td>" + "<td>" + Information.phone + "</td>" + "<td>" + site + "</td>" + "</tr>" ;
            }
            localStorage.setItem("HTML", HTML); 
            localStorage.setItem("site", sites_with_no_emails); 
            
        }
        

        HTML = localStorage.getItem("HTML"); 
        sites_with_no_emails = localStorage.getItem("site");
        sites_with_no_emails = sites_with_no_emails.replace(/,$/,"");
        var final = prompt("Would you like your data to be displayed or would you like to click to the next page to keep mining data? \n1 = show me my data \n2 = click to next page and we will get that data also\n3 = scroll to the bottom of the page for me so I can click next").trim(); 
        if (final === "1"){ 
            var num_emails = Math.floor(HTML.match(/td/g).length/12); 
            
            if (document.querySelectorAll("nobr")[0] !== undefined){ 
                var time = document.querySelectorAll("nobr")[0].textContent; 
                time = time.replace(/ ?\( ?/,"");
                time = time.replace(/ ?\) ?/,"");
            } else { time = "0.43 seconds";  }

            HTML = HTML + "</tbody></table></center>" + "<center><p>You obtained " + num_emails + " emails " + " in " + time + "!</p>" + "<p>Scrape the following sites with <a href='https://www.import.io/'>import.io</a> or <a href='http://urlprofiler.com/'>url-profiler</a>: </p>"+ "<p>" + sites_with_no_emails + "and https://www.webassigngenius.com/.</p></center>";
            document.body.innerHTML = HTML; 
        } else if (final === "2") { 
            alert("Information is in the console. \nIf you would like to go to the next page click next and we will scrape more information.");
        } else if (final === "3") { 
            window.scrollBy(0, 15000); //scroll to the bottom of the page
            
        }
        
        
    }


})();