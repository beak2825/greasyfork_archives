// ==UserScript==
// @name        CiscoSpark
// @namespace   CiscoSpark
// @description Button for Spark
// @include     https://tools-stage.cisco.com/support/serviceordertool-1/searchController.svo*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21363/CiscoSpark.user.js
// @updateURL https://update.greasyfork.org/scripts/21363/CiscoSpark.meta.js
// ==/UserScript==

console.log("running GM");
//GM_log("running GM log");
   runScript(); 


function runScript() {
  //get username from webpage
    console.log("running GM inside");
    
    var buttonToAdd = document.createElement('BUTTON');
    var t = document.createTextNode("Spark Room");
    buttonToAdd.appendChild(t);

    var element = document.getElementById("fw-banner");
    element.appendChild(buttonToAdd);
    
    buttonToAdd.addEventListener("click", function(){
     urlCall();
    });
  
}



function urlCall() {
    var url = "https://arc-dev.cloudapps.cisco.com/arcui/virtualagent/createRoom";
    console.log("url: " + url);
    $.ajax({
        type: "GET",
        url: url,
        crossDomain: true,
        dataType: "jsonp",
        
        success: function( data, textStatus, jqXHR) {
            console.log("succes on creating spark room");
            console.log("data: " + data);
             console.log("textStatus: " + textStatus);
             console.log(jqXHR);
        },
        error: function(jqXHR, textStatus, errorThrown){
           console.log("error on creating spark room");
            console.log("jqXHR: "+ jqXHR);
            console.log("textStatus: "+ textStatus);
            console.log("data: "+ data);
        }              
    });
}

