// ==UserScript==
// @name EyesonAIWorker
// @version 1.5
// @description opens twitter page / a-g first section / z-c second / ctrl submit
// @icon        https://i.imgur.com/YAadD6h.png
// @match       https://worker.mturk.com/projects*
// @grant window.close
// @namespace https://greasyfork.org/users/164486
// @downloadURL https://update.greasyfork.org/scripts/36700/EyesonAIWorker.user.js
// @updateURL https://update.greasyfork.org/scripts/36700/EyesonAIWorker.meta.js
// ==/UserScript==


var myWindow;
var sanity = "Law Enforcement";
if($("b").eq(1).text() === sanity){
[].forEach.call(document.querySelectorAll("a[href*=\"twitter.com\"]"), function(anchor) {
    myWindow = window.open(anchor.href, "_blank","toolbar=yes,scrollbars=yes,resizable=yes,top=000,left=9999,width=600,height=400");
  //setTimeout(function () { myWindow.close();}, 6000);
});


window.onkeydown = function (event) {
   
    
    if(event.which == 65){                                                                   // a = law enforcement
    document.querySelector('input[value="Selection_bGU-"]').checked = true;}
 

     if(event.which == 83){                                                                   // s = military
    document.querySelector('input[value="Selection_bQ--"]').checked = true;}


    if(event.which == 68){                                                                   // d = fire
    document.querySelector('input[value="Selection_ZW1mcg--"]').checked = true;}


     if(event.which == 70){                                                                   // f = news
    document.querySelector('input[value="Selection_bmV3cw--"]').checked = true;}


     if(event.which == 71){
                                                                              // g = None
    document.querySelector('input[value="Selection_bm9uZQ--"]').checked = true;
    document.querySelector(`[class="btn btn-primary"]`).click();
      { myWindow.close();}  }

    //Section 2 answers 
    
    if(event.which == 90){

    document.querySelector('input[value="Selection_b3JnYW5pemF0aW9u"]').checked = true;
     document.querySelector(`[class="btn btn-primary"]`).click();
      { myWindow.close();}  }

    if(event.which == 88){

    document.querySelector('input[value="Selection_b2ZmaWNpYWw-"]').checked = true;
    document.querySelector(`[class="btn btn-primary"]`).click();
      { myWindow.close();}  }           // x official
    
     if(event.which == 67){

    document.querySelector('input[value="Selection_cGVyc29uYWw-"]').checked = true;
    document.querySelector(`[class="btn btn-primary"]`).click();
      { myWindow.close();}  }           // c personal
};}
