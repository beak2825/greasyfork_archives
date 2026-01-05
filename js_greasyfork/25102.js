// ==UserScript==
// @name         Wanikani Multiple Answer Input
// @namespace    mempo
// @version      1.0
// @description  Input multiple readings/meanings
// @author       Mempo
// @match        https://www.wanikani.com/review/session
// @match        http://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25102/Wanikani%20Multiple%20Answer%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/25102/Wanikani%20Multiple%20Answer%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("/// START OF WKMAI");
    
    $('input#user-response').on('keydown',function(event){

    if (event.keyCode === 13){ 
        //event.preventDefault();
        event.stopPropagation();
        console.log("/// WKMAI: PROPAGATION: " + event.isPropagationStopped());
        
        var WKMAI;
        var wrong = false;
        
        if($.jStorage.get("questionType")==="meaning"){
            WKMAI = ["en","syn"];
        }else{
            WKMAI = ["kana","kana"];
        }
        
        $('input#user-response')[0].value.split(/[;]|[ ]{2,}/).forEach(function(element){
            if(element !== "" &&
               $.jStorage.get('currentItem')[WKMAI[0]].indexOf(capitalize(element.trim())) === -1 && 
               $.jStorage.get('currentItem')[WKMAI[1]].indexOf(capitalize(element.trim())) === -1 ){
                console.log(element + " is wrong!");
                wrong = true;
            }
        });
        if(!wrong){
            $('input#user-response')[0].value =  $('input#user-response')[0].value.split(/[;]|[ ]{2,}/)[0];
        }
        $("#answer-form form button").click();

        
        
    }
    

  });
    
  function capitalize(str){
        return str[0].toUpperCase() + str.substr(1);   
  }
  
})();