// ==UserScript==
// @name         躾
// @namespace    duchessmay
// @version      0.1
// @description  Allow submitting synonyms with kana
// @author       Duchess-May
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/lesson/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404773/%E8%BA%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/404773/%E8%BA%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("/// 躾が咲く");
    
    $('input#user-response').on('keydown',function(event) {

        if (event.keyCode === 13){ 
            //event.preventDefault();
            event.stopPropagation();
            console.log("/// 躾: キーコード１３押した: " + event.isPropagationStopped());
        
            var jikou = "kana";
            var wrong = false;
        
            if ($.jStorage.get("questionType")==="meaning") {
                // jikou = ["kana"];
            } else {
                // jikou = ["kana","kana"];
            }
        
            $('input#user-response')[0].value(function(element){
                if(element !== "" && $.jStorage.get('currentItem')[jikou].indexOf(capitalize(element.trim())) === -1 ){
                       console.log(element + " is wrong!");
                       wrong = true;
                }
            });
            if (!wrong) {
                $("body").css("background-color", "red");
            }
            else {
                $("body").css("background-color", "#0271de");
            }
            //$("#answer-form form button").click();   
        
    }
    

  });
    
  function capitalize(str){
        return str[0].toUpperCase() + str.substr(1);   
  }
  
})();