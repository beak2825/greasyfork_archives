// ==UserScript==
// @name         Wanikani shaking for no reason bug fix
// @namespace    https://www.wanikani.com
// @version      0.12
// @description  Fix wanikani bug where the answer box would shake even though the answer is in right format.
// @author       Cometzero
// @include      *://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30057/Wanikani%20shaking%20for%20no%20reason%20bug%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/30057/Wanikani%20shaking%20for%20no%20reason%20bug%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    $("#answer-form button").on("click", function(){
        var qt = $.jStorage.get("questionType"); // saved value in jStorage
        var htmlQt = $("#question-type h1 strong").html(); // actual value on the screen
        
        // radicals have name instead of meaning
        if(htmlQt === "Name") htmlQt = "meaning";
        
        if(qt != htmlQt) {
            console.log("Detected wrong questionType. Changing to " + htmlQt);
            $.jStorage.set("questionType", htmlQt); // set to the right value
            
            // if the shake animation is runnig we know that this click function was called
            // after the wk click function
            if($("#answer-form form").is(':animated')){
                //$("#answer-form form").finish(); // cancel the shaking animation
                $("#answer-form button").click();
            }
        }
      
    });
    
    /*
    $.jStorage.listenKeyChange('questionType', function(key, action){
        console.log(key + " has been " + action + ", new value:" + $.jStorage.get("questionType"));
        
        var qt = $.jStorage.get("questionType");
        var htmlQt = $("#question-type h1 strong").html();
        console.log(qt + " ?==? " + htmlQt);
    });
    */
})();