// ==UserScript==
// @name         Facebook Email Scraper
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Searches google based on user inputted keywords and scrapes information for companies that match keywords
// @author       Erik 
// @include      https://www.facebook.com/search/*

// @downloadURL https://update.greasyfork.org/scripts/40934/Facebook%20Email%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/40934/Facebook%20Email%20Scraper.meta.js
// ==/UserScript==

(function(){ // https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
  "use strict";
    
    console.log("Facebook Email Scraper Running..."); 
    var seconds = parseInt(prompt("How many seconds would you like the scraper to search for emails for? \nPlease enter an integer\n60 = approximately 40-80 emails"));  
    
    if (seconds > 0) { 
        start_scroll_down(); 
    }
    
    function start_scroll_down() { 
        var timesRun = 0;
        var interval = setInterval(function(){
        timesRun += 1;
        window.scrollBy(0, 5000);
        if(timesRun === seconds){
            clearInterval(interval);
            var x = true; 
            if (x === true) { 
			    console.log("invoked fct");
                count_emails(); 
            }
        }
        console.log('start function'); //do whatever here..
        }, 2000); 

    }


    function count_emails() {
        //var y = document.querySelectorAll("span._5-jo");
		var text = document.querySelectorAll("div._307z");
        var HTML = "<br><center><h1>Information</h1><p>Copy and paste into excel for ease of use or get help writing a macro <a href='https://www.youtube.com/watch?v=T--ZZSQhGqU'>here</a>!</p><p>Finding trouble removing duplicates? Get the premium version of the script <a href='google.com'>here</a>.</p><table style='width:100%'><tbody><tr><th>Name</th><th>Email</th>";

        var arr = []; 
        for (var i = 0; i <text.length; i++) { 
	        var data = text[i].textContent;
	        var reEmail = /[A-Za-z\.0-9\-]*@[A-Za-z0-9\-]*\.(com|edu|org|web|xyz|net|gov)/g; 
            var email = data.match(reEmail);
            var name = data.split(/January|February|March|April|May|June|July|August|September|October|November|December/g)[0];
	        if (email === null) { 
            } else {
				var small = []
				small[0] = name; 
				small[1] = email[0];

                arr.push(small); // put in array 
        		HTML = HTML + "<tr><td>" + name + "</td><td>" + email[0]; // put in HTML String 
		
            }
        }
    HTML = HTML + "</table></center>"; 
    console.log(arr);


    var q = parseInt(prompt("Would You Like to Display This Data? \n1 = Yes \n2 = No"));
    if (q ===1){
        document.body.innerHTML = HTML; 
    } else { 
        alert("emails are in the console");
    }
    //end of if
    
        
    } //end of fct


})();

    