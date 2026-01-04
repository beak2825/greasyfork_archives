// ==UserScript==
// @name         Twitter Email Scraper
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Searches google based on user inputted keywords and scrapes information for companies that match keywords
// @author       Erik 
// @include      https://twitter.com/search*

// @downloadURL https://update.greasyfork.org/scripts/40949/Twitter%20Email%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/40949/Twitter%20Email%20Scraper.meta.js
// ==/UserScript==

(function(){ // https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
  "use strict";
    console.log("Twitter Email Scraper Running");
    var seconds = parseInt(prompt("How many seconds would you like the scraper to search for emails for? \nPlease enter an integer\n60 = app 40 emails"));  
    
    if (seconds > 0) { start_scroll_down(); } 

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
		var text = document.querySelectorAll("div.tweet.js-stream-tweet.js-actionable-tweet.js-profile-popup-actionable.dismissible-content.original-tweet.js-original-tweet");
        var HTML = "<br><center><h1>Information</h1><p>Copy and paste into excel for ease of use or get help writing a macro <a href='https://www.youtube.com/watch?v=T--ZZSQhGqU'>here</a>!</p><p>Finding trouble removing duplicates? Get the premium version of the script <a href='google.com'>here</a>.</p><table style='width:100%'><tbody><tr><th>Name</th><th>Email</th>";
        var arr = [];  
        for (var i = 0; i <text.length; i++) { 
	        var data = text[i].textContent;
	        var reEmail = /[A-Za-z\.0-9\-]*@[A-Za-z0-9\- ]*\.\s?(com|edu|org|web|xyz|net|gov)/gi; 
            var email = data.match(reEmail);
            var name = data.split(/\@/g)[0];

	        if (email === null) { 
            } else {
                email = email[0];
                if (email === "gmail.com" | (/(@|\[at\]|\(at\))[A-Za-z ]*\.\s?(com|org|net|edu)/gi).test(email) === true ) { //handles people who put a space between their name and email 
                    var newreEmail = /[A-Za-z\.0-9\-]*\s?(@|\(a\)|\[at\]|\(at\))\s?[A-Za-z0-9\-]*\s?\.\s?(com|edu|org|web|xyz|net|gov)/gi;
                    if (data.match(newreEmail) !== null){
                        var spaceemail = data.match(newreEmail)[0]; 
                        email = spaceemail.replace(/ /g, ""); 
                    } 
                }
                
				var small = []
				small[0] = name.replace(/(\n|\s| )*/, ""); 
				small[1] = email;
		        arr.push(small);
            }
            HTML = HTML + "<tr><td>" + name + "</td>" + "<td>" + email + "</td></tr>";
        }
        
    /**
    var unique = []; //unique array 
    for (var j = 0; j < arr.length; j ++){ 
        var str = arr[j][1];
        for (var k =0; k < unique.length; k++) { 
            if (!unique[k].includes(str)){
                unique.push(arr); 
            }
        }
    }
    console.log(unique); 
    **/
        
    HTML = HTML + "</center></table>"; 
    console.log(arr); 
    
    var q = parseInt(prompt("Would You Like to Display This Data? \n1 = Yes \n2 = No"));
    if (q ===1){
        document.body.innerHTML = HTML; 
    } else { 
        alert("emails are in the console");
    } //end of if then 
    
        
    }//end of function 
    
    


})();