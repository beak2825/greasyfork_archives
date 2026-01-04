// ==UserScript==
// @name         Facebook Email Scraper Premium 
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Searches facebook based on user inputted keywords and scrapes information for companies that match keywords
// @author       Erik 
// @include      https://www.facebook.com/search*

// @downloadURL https://update.greasyfork.org/scripts/367945/Facebook%20Email%20Scraper%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/367945/Facebook%20Email%20Scraper%20Premium.meta.js
// ==/UserScript==

(function(){ // https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
  "use strict";
    console.log("Facebook Email Scraper Premium Running");
    
    if (!location.href.includes("https://www.facebook.com/search/posts/")){ //clicks posts if not clicked
        window.onload = setInterval(function(){ document.body.querySelectorAll("div._4xjz")[1].click(); }, 1000);
    }
    
    if (location.href.includes("https://www.facebook.com/search/posts/")){ //runs if on posts
            var seconds = parseInt(prompt("How many seconds would you like the scraper to search for emails for? \nPlease enter an integer\n60 = approximately 40 targeted emails\n0 = run another time"));  
    }
    
    if (seconds > 0) { start_scroll_down(); } //calls scroll function 

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

        function see_all(){ //click the see all button every 5 seconds THIS WILL NEVER RUN 
            for (var a = 0; a < document.body.querySelectorAll("a").length; a++) { 
		        if ( document.body.querySelectorAll("a")[a].innerText === undefined ) { 
                } else if (document.body.querySelectorAll("a")[a].innerText === "See All"){
			        document.body.querySelectorAll("a")[a].click();
		            }
                }
            console.log("See All");
            } 

    }

    function count_emails() {
        
		var text = document.querySelectorAll("div._307z");
      
        var unique_emails = []; 
        var HTML = "<br><center><h1>Information</h1><p>Copy and paste into excel for ease of use or get help writing a macro <a href='https://www.youtube.com/watch?v=T--ZZSQhGqU'>here</a>!</p></p><table style='width:100%'><tbody><tr><th>Name</th><th>Email</th>";
        var tweet = {}; //new implementation with literal object declaration 
        
        for (var i = 0; i <text.length; i++) { 
	        var data = text[i].textContent;
	        var reEmail = /[A-Za-z\.0-9\-]*\s?(@|\(?\[?\s?[a]t?\s?\)?\]?)\s?[A-Za-z0-9\-]*\s?\.\s?(com|edu|org|web|xyz|net|gov)/gi;
            
            var email = data.match(reEmail);
            var name = data.split(/ is | to |Jan|Feb|March|April|May|June|July|Aug|Sep|Oct|November|December|Yesterday/)[0];
            
            if (data.match(reEmail)){ 
                tweet.email = data.match(reEmail)[0];
                tweet.email = tweet.email.replace(/ ?\(?\[?(AT|at)\)?\]? ?/, "@");
                tweet.email = tweet.email.replace(/ /g, ""); 
            }
            tweet.name = name;
            
            if(HTML.includes(tweet.email)){ 
                continue; 
            } else { 
                HTML = HTML + "<tr><td>" + tweet.name + "</td>" + "<td>" + tweet.email + "</td></tr>";
                unique_emails.push(tweet.name.trim()); 
                unique_emails.push(tweet.email); 
            }

            
        }

    HTML = HTML + "</center></table>"; 

    var length = (HTML.match(/<\/td>/ig).length)/2;
    var Foot = "<p>Twitter Scraper Premium scraped " + length + " unique emails in " +  seconds + " seconds! Leave a review for us <a href = 'facebook.com'>here</a>!</p>"
    console.log(unique_emails); 
    
    var q = parseInt(prompt("Would You Like to Display This Data? \n1 = Yes \n2 = No"));
    if (q ===1){
        document.body.innerHTML = HTML + Foot; 
    } else { 
        alert("emails are in the console");
    } //end of if then 
    
        
    }//end of function 
    
    


})();