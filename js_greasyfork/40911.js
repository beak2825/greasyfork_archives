// ==UserScript==
// @name         Google Searcher / WebScraper 2.0 
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Searches google based on user inputted keywords and scrapes information for companies that match keywords
// @author       Erik 
// @include      https://www.google.com*

// @downloadURL https://update.greasyfork.org/scripts/40911/Google%20Searcher%20%20WebScraper%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/40911/Google%20Searcher%20%20WebScraper%2020.meta.js
// ==/UserScript==

(function(){ // https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
  "use strict";


    // 1st Step -- Open Up https://google.com/    
    if (window.location.href.indexOf("search") === -1 && window.location.href === "https://www.google.com/") {  // will run this section of the code when nothing has been searched 
    alert("Script 3.4 is Running"); 

    var x = prompt("What keywords would you like to include in your search? \nPlease Seperate Keywords with , (ie restaurants,LA,California) \nRecommended amount is 3-5 keywords"); 
    var y = x.split(',');

    var j = 0; 
    var z = ""
    while (j < y.length) { // will create a string with the keywords of inputted by the user 
        var a = y[j].trim()
        z += a + "+" ;
        j++;
    }
    window.open("https://www.google.com/search?q=" + z + "+email@gmail.com"); // will open a seperate window that will have a search index > 0 && include emails
    }


// Run after new Google Search Window is Open
    if (window.location.href.indexOf("search") !== -1) { // this will run when the keywords have been opened in a new window --> should only run on data
        alert("Webscraper is running");
        // run some good shit
        /**
        // read the data -- the code below reads the innerText (without HTML Tags)
        var body = document.body.innerText; // this is all of the text displayed on the page
        var arr = textContent.split("...\n"); // this will split it into arrays but not perfectly
        console.log(arr);
        // make many copies of the array and within the index find the business name, phone number, location, email
        **/ 
        
        var header = document.querySelectorAll("h3.r"); // all of the header information 100 results
        var url = document.querySelectorAll("cite.iUh30"); // all of the site information 100 results
        var body = document.querySelectorAll("span.st"); // all of the data about each of the 100 results
        
        var HTML = "<br><center><h1>Information</h1><p>Copy and paste into excel for ease of use or get help writing a macro @ !</p><table style='width:100%'><tr><th>Business</th><th>Name</th><th>Email</th><th>Address</th><th>Phone Number</th><th>Website</th></tr>";
        //let object = new Object ();
        var Data_Arr = []; 
        console.log(header); 
        for (var i = 0; i < header.length; i++) { 
            //Get header name
            var business_name =  header[i].textContent; // business name
            var site = url[i].textContent; // site URL
            var data = body[i].textContent; // all text content need to sort through this
            
            // get phone number
            var rePhone = /\d?-?\(?(\d\d\d)\)?\.?-?\s?\d\d\d-?\.?\s?\d\d\d\d/g;
            var phone = data.match(rePhone); //gets the phone number in match group 1
            
            //get email
            var reEmail = /[A-Za-z\.0-9\-]*@[A-Za-z0-9\-]*\.(com|edu|org|web|xyz|net|gov)/g; 
            var email = data.match(reEmail);
            
            //get street
            var reStreet = /([0-9][0-9][0-9][0-9]?[0-9]? ([A-Za-z\.][\.])?[A-Za-z]*\s?[A-Za-z]* (Rd|Blvd|Lane|Circle|Ln|St|Street|Road|Drive|Dr|[0-9][0-9][0-9]|[0-9][0-9])?)/g
            var street = data.match(reStreet); 
            
            //get City and State
            var reState = /([A-Za-z]*, [A-Z][A-Z] ([0-9]{5})?)/g; 
            var state = data.match(reState); 
            var full_address = street + ", " + state;  
            
            Data_Arr[0] = business_name; 
            Data_Arr[1] = "name"; 
            Data_Arr[2] = email; 
            Data_Arr[3] = full_address; 
            Data_Arr[4] = phone; 
            Data_Arr[5] = site; 

            // object.business = business_name;//get regex business
            // object.name = "idk";//get regex name
            // object.email =  email;//get regex email
            // object.address =  full_address;//get regex address
            // object.phone =  phone;//get regex phone
            // object.website =  site;//get regex website
            HTML = HTML + "<tr>" + "<td>" + Data_Arr[0] + "</td>" + "<td>" + Data_Arr[1] + "</td>" + "<td>" + Data_Arr[2] + "</td>" + "<td>" + Data_Arr[3] + "</td>" + "<td>" + Data_Arr[4] + "</td>" + "<td>" + Data_Arr[5] + "</td>" + "</tr>" ;
            
        }
        
        localStorage.setItem("HTML", HTML);
        
        var final = prompt("Would you like your data to be displayed or would you like to click to the next page to keep mining data? \n1 = show me my data \n2 = click to next page and we will get that data also"); 
        if (final === "1"){ 
            HTML = localStorage.getItem("HTML");
            HTML = HTML + "</tbody></table></center>"
            document.body.innerHTML = HTML; 
            alert("Data is below");
        } else { 
        alert("Click to the next page when you are ready and we will mine the next page for you."); 
    }
        
        
    }


})();