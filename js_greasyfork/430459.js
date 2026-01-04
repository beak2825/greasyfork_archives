// ==UserScript==
// @name        Oracle Signup Bypass
// @namespace   Violentmonkey Scripts
// @match       https://*.oracle.com/*
// @grant       none
// @license      MIT
// @version     5.0
// @author      - CypherpunkSamurai
// @description        Download from Oracle without signup. (https://github.com/CypherpunkSamurai/oracle-signup-bypass)
// @downloadURL https://update.greasyfork.org/scripts/430459/Oracle%20Signup%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/430459/Oracle%20Signup%20Bypass.meta.js
// ==/UserScript==




// Replaces Download URLS
function assign_links(link_button) {
  var download_url = link_button.getAttribute("data-file");
  // console.log("Old URL: " + download_url);
  // Create Download Link
  download_url = download_url.replace("download.oracle.com", "edelivery.oracle.com");
  download_url = download_url.replace("/otn/", "/otn-pub/");
  // console.log("New URL: " + download_url);
  // Set Download Link
  link_button.setAttribute("href", download_url);
  link_button.classList = [".license-link"]; //, ".icn-download"];
}



// Set cookies

function setCookie(name,value,days, domain) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    // set cookie
    document.cookie = name + "=" + (value || "")  + expires + ";domain=" + domain + ";path=/";
}



// Make the license window invisible

function make_invisible() {
  var htmlDiv = document.createElement('div');
  htmlDiv.innerHTML = "<style>.w11w2{background-color: rgb(255, 255, 255);max-width: 1092px;visibility: hidden;}</style>";
  document.getElementsByTagName('head')[0].appendChild(htmlDiv); 
}




// ----------------------------------
//
// Runs the command on document load
//
// ----------------------------------

window.addEventListener('load', function() {
    var alldownloads = document.querySelectorAll(".license-link");

    // Set cookies for .oracle.com domain (including CDN). #fix_issue #1
    setCookie('oraclelicense','141',7, '.oracle.com');
    setCookie('AKA_A2','A',7, '.oracle.com');
    
    // Replace Download Links
    alldownloads.forEach(assign_links);
    
    // Make the license window invisible
    make_invisible();
  
    // Alert User About Bypass.... (disabled default)
    //alert("All Download Links Have Been Unlocked.... Thank You for Using the UserScript - CypherpunkSamurai");
}, false);

// Thanks for Using the Script :)
// 
// - CypherpunkSamurai (https://github.com/CypherpunkSamurai)