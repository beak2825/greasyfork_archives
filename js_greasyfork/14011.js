// ==UserScript==
// @name Concept Freestyle
// @namespace DC
// @author Naugriim
// @date 18.11.2015
// @version 1.0
// @description Customiser un lieu.
// @license "LICENCE BEERWARE"
// @include http://www.dreadcast.net/Main
// @compat Chrome, Firefox
// @downloadURL https://update.greasyfork.org/scripts/14011/Concept%20Freestyle.user.js
// @updateURL https://update.greasyfork.org/scripts/14011/Concept%20Freestyle.meta.js
// ==/UserScript==

var places = [];

function dlPlace(places) {

    var place = $('#carte_fond').css('background-image'),
      idPlace = place.substring(place.lastIndexOf("_")),
      idPlace = idPlace.substring(idPlace.indexOf("."), -2);
    
    for (var i=0 ; i < places.length ; i++)
    {    
        if (places[i] == idPlace) {            
            $('#carte_fond').css('background-image', 'url(http://conceptfreestyle.free.fr/cuscript/batiment'+idPlace+'.png)');
        }         
    }
    
}

function firePlace()  {
    $.ajax({
        type : 'GET',
        url : 'http://conceptfreestyle.free.fr/cuscript/places.jsonp',
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType : 'jsonp',    
        success: function(json) {
          
        var data = json.batiments[0];
        
        var places = Object.keys(data).map(function(_) { return data[_]; })
      
        dlPlace(places);

        },

        error: function(e) {
            console.log(e.message);
        }
    });
}

/*
$("#carte").click(function(){

  firePlace();

});
*/

$("#action2").click(function() {

     $(document).ajaxComplete( function(a,b,c) { 
         firePlace();
     });

});

$("#actionDefault").click(function(){

     $(document).ajaxComplete( function(a,b,c) { 
         firePlace();
     });

});

/*
$("#cadre_position").dblclick(function(){

  setTimeout(function() { firePlace(); }, 1500);

});
*/

$(document).ready(function() {
    
  firePlace();
 
});