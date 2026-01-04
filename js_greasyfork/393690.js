// ==UserScript==
// @name         Planet Romeo - Poor Men's Plus
// @namespace    https://greasyfork.org/de/users/7597-djamana
// @version      1.1
// @description  Restores blur out tiles on the Planet Romeo visitors tab for non-plus users
// @author       Djamana
// @match        *://*.romeo.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/393690/Planet%20Romeo%20-%20Poor%20Men%27s%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/393690/Planet%20Romeo%20-%20Poor%20Men%27s%20Plus.meta.js
// ==/UserScript==


(function() {


    let oldXHROpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

 // do something with the method, url and etc.
    this.addEventListener('load', function() {

 // do something with the response text
    //  console.log('load: ' + this.responseText);


     isResponseAString = (typeof this.response === "string")
     try {
         this.xhr =  this.response

         if ( isResponseAString )
            this.xhr = JSON.parse( this.xhr )

         // remove displaylimit in visitors tab       <- that's the core patch !
         if  ( this.xhr.items_limited ) {
             delete  this.xhr.items_limited;
         }


         try {
             // cosmetic patch #1 (not really needed)
             if  ( this.xhr.is_plus == false ) {
                 debugger
                 this.xhr.is_plus  = true
                 this.is_free_plus = true // maybe not needed
                 this.xhr.payment_group="PLUS"
             }

             // cosmetic patch #2 (not really needed)
             if  ( this.xhr.inferface ) {
                 debugger
                 this.xhr.show_plus_badge = true // maybe not needed
                 this.xhr.show_ads = false  // maybe not needed
             }

             // cosmetic patch #3 (not really needed)
             if  ( this.xhr.show_plus_badge ) {
                 debugger
                 this.xhr.show_plus_badge = true // maybe not needed
             }
         }  catch (e) {
         debugger
         console.log("Userscript_PoorMansPlus (cosmetic patches) - ERROR: " + e)
     }



         // make responseText writeable
         Object.defineProperty(this, 'responseText', {
            writable: true
         });


         // set responseText
         if ( isResponseAString )
             this.responseText = JSON.stringify( this.xhr )
         else
             this.responseText =  this.xhr

     }  catch (e) {
         debugger
         console.log("Userscript_PoorMansPlus ERROR: " + e)
     }


 });

 return oldXHROpen.apply(this, arguments);
}


})();
