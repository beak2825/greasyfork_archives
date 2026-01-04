// ==UserScript==
// @name         Tinder Autolike
// @namespace    ViolentMonkey
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://tinder.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429702/Tinder%20Autolike.user.js
// @updateURL https://update.greasyfork.org/scripts/429702/Tinder%20Autolike.meta.js
// ==/UserScript==

(function() {
var i = 0;

    var t = setInterval(function () {

   // var btnlike = document.evaluate( '/html/body/div[1]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[4]/button' ,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
   //  var btnlike = document.evaluate( '//path[@fill="url(#svg-fill-linear__nope)"' ,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue; 
                                        
   var btnlike = document.querySelector('path[fill*="var(--fill--like, none)"]').closest('span.Expand');    
   var btnunlike = document.querySelector('path[fill*="var(--fill--nope, none)"]').closest('span.Expand');   
   //var btnunlike = document.querySelector("path[fill='url(#svg-fill-linear__nope)']").closest('span.Expand');
   // var btnunlike = document.evaluate( '/html/body/div[1]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div/div[5]/div/div[2]/button/span/span' ,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                                        
    var bio = "";
    var km = "";
     try {

    //   km =  document.evaluate('//*[@id="s722988905"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div/div[3]/div[3]/div/div[2]/div/div/div/div[2]' ,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
       bio = document.querySelector("div[aria-hidden='false'].StretchedBox .BreakWord").innerHTML;
       
     } catch(err) { console.error(err); }
      
     // alert(bio);
      console.log(bio);
      console.log(i);
     // console.log(km);
  
      
        if( i == 10   || bio.indexOf("@") > -1  /* ||  bio.indexOf("insta") > -1 || bio.indexOf("Insta") > -1  || bio.indexOf("instagram") > -1 || bio.indexOf("Instagram") > -1 */ || bio.indexOf("IG") > -1 || bio.indexOf("ig") > -1 || bio.indexOf("Ig") > -1  || bio.indexOf("trans") > -1 ){
      //if( i == 7 ) {      
      console.log("unlinke");
            i =0;
            btnunlike.click();
            setTimeout(t, 3500);
        } else {
              btnlike.click();
              console.log("like");
              i = i+1; 
        }


    
    }, 3500);
   
})();
