// ==UserScript==
// @name        Export Links
// @namespace   *://*.500px.com/*
// @include     https://500px.com/*
// @include     http://500px.com/*
// @version     1
// @grant       none
// @description:en  Creates download links for 500px albums
// @description Creates download links for 500px albums
// @downloadURL https://update.greasyfork.org/scripts/31035/Export%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/31035/Export%20Links.meta.js
// ==/UserScript==



function export_urls()
{ 

  
  var output = 'Links<br>';
    $( ".photo_link" ).each(function( index ) {
      var picURI = "http://500px.com" + $( this ).attr("href");
 
      var picID = picURI.match(/\/([\d]+)\//gm);
      picID = picID[0];
      picID = picID.substr(1, picID.length-2);
      
      var url500api = "https://api.500px.com/v1/photos/"+picID+"?image_size=4";
      
      $.getJSON( url500api, function( data ) { 
         output = output + "<a href='"+data.photo.image_url + "'>"+data.photo.image_url+"</a><br />\n";
      });
    });
  
   $(document).ajaxStop(function () {
     $("body").html(output);
   });  
}

$(function() {     
    console.log('Export links loaded');    
});


window.addEventListener("DOMContentLoaded", function(){
	var image = document.getElementsByClassName("photo_link")[0];
    if (image) {
			var button = document.createElement("Button");
			button.type = "button";
			button.innerHTML = "Export Links";
			button.style.background = "transparent";
			button.style.border = "1px solid rgb(200, 120, 120)";
			button.style.padding = "15px 5px";
			button.style.color = "rgb(200, 120, 120)";
			button.style.width = "100%";
			var insertAt = document.getElementsByClassName("user_details")[0];
			button = insertAt.parentNode.insertBefore(button, insertAt); //confused?

			button.onclick= function() {        
          export_urls();
			}
   }
}, false);