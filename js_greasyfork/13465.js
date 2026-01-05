// ==UserScript==
// @name        dailymotion
// @namespace   dailymotion
// @description select category whileuploading videos
// @include     http://www.dailymotion.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13465/dailymotion.user.js
// @updateURL https://update.greasyfork.org/scripts/13465/dailymotion.meta.js
// ==/UserScript==


// here is category variable where you can put your required category value
var category = "fun";  // for Celeb

//and here are available categories values you can choose from
//<option value="" selected="selected"></option>
//<option value="animals">Animals</option>
//<option value="auto">Auto-Moto</option>
//<option value="people">Celeb</option>
//<option value="fun">Comedy & Entertainment</option>
//<option value="webcam">Community & Blogs</option>
//<option value="creation">Creative</option>
//<option value="school">Education</option>
//<option value="videogames">Gaming</option>
//<option value="lifestyle">Lifestyle & How-to</option>
//<option value="shortfilms">Movies</option>
//<option value="music">Music</option>
//<option value="news">News</option>
//<option value="sport">Sports</option>
//<option value="tv">TV</option>
//<option value="tech">Tech</option>
//<option value="travel">Travel</option>


// here we are going to put intervale so every 3 second this script will run when you are on dailymotion site
setInterval(function(){ 

// here we are checking if there is category dropdown available. "user_category" is id of category dropdown
var elementExists = document.getElementById("user_category");
if(elementExists){
  
  // here we are checking whether the required category has been selected or not. if elementExists.selectedIndex == 0 means
  // category has not been selected
  if(elementExists.selectedIndex == 0)
    {
  // here we are getting all available options in dropdown
      var options= document.getElementById('user_category').options;
    
	
      for (var i= 0; i< options.length; i++) {
        
      // here we are looping and checking our required option and selecting it
        if (options[i].value == category) {
           elementExists.selectedIndex = i;
      
        }
      
      }
   }
  
}


}, 3000);
