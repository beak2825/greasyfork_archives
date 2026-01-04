// ==UserScript==
// @name        Don't mess with my "use subreddit style" toggle (Old Reddit/RES required)
// @author      warireku
// @description This script always shows RES' "use subreddit style" checkbox in the right of the logout link even if the sub intentionally hides it from the side bar (need RES extension installed)
// @include     https://old.reddit.com/r/*
// @license     CC0 1.0 Universal (No Rights Reserved)
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/users/237709
// @downloadURL https://update.greasyfork.org/scripts/398939/Don%27t%20mess%20with%20my%20%22use%20subreddit%20style%22%20toggle%20%28Old%20RedditRES%20required%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398939/Don%27t%20mess%20with%20my%20%22use%20subreddit%20style%22%20toggle%20%28Old%20RedditRES%20required%29.meta.js
// ==/UserScript==

//runs when page is fully loaded
window.addEventListener('load', function() {
    var styleBox = document.getElementById("res-style-checkbox");
    //if the res element exists
    if(styleBox !== null){
      styleBox.style.cssText = "display:inline !important; visibility: visible !important";

      var styleForm = document.getElementsByClassName("res-sr-style-toggle");
      var separator = document.getElementsByClassName("separator")[0];
      separator.innerHTML = "|";
      for(var i=0;i<styleForm.length;i++){
        styleForm[i].style.cssText = "display:contents !important; visibility: visible !important; position:absolute !important;";
        document.getElementById("header-bottom-right").appendChild(separator);
        document.getElementById("header-bottom-right").appendChild(styleForm[i]);
      }
		}
}, false);