//
// Written by Glenn Wiking
// Script Version: 0.1.1
// Date of issue: 18/02/16
// Date of resolution: 24/02/
//
// ==UserScript==
// @name        Hubspot LaV
// @namespace   HL
// @description Behavioral fixes in Hubspot for Like a Virgin
// @include     *app.hubspot.com/ctas*
// @license MIT 

// @version     0.1.1
// @icon        https://shuttle-storage.s3.amazonaws.com/addons/Icons/HubspotLogo.svg

// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require			https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js


// @downloadURL https://update.greasyfork.org/scripts/435895/Hubspot%20LaV.user.js
// @updateURL https://update.greasyfork.org/scripts/435895/Hubspot%20LaV.meta.js
// ==/UserScript==

function check() {
	if ( $(".private-modal__container:not(.affected)").length && $("[data-key='dashboard.embedCodeDialog.title']").length ) {
    	let panel = $(".private-modal__container");
    	const lang = $("html").attr("lang");
      
    	const clone = $("#code-copy-area .uiButton[data-button-use='primary']").clone();
    	$("#code-copy-area .uiButton[data-button-use='primary']").parent().append( clone );
    
    	let button = $("#code-copy-area button:last");
    	button.attr("data-button-use", "tertiary");
    	
    	button.children().text( button.children().text() + " (Safe)" );
    	let bText = button.text();
    	
    	let link = panel.find(".is--code").val().split("<a href=")[1].split(" >")[0].replace(/"/g,"");
      console.log( link );
    
    	button.on("click", function() {
      	$("body").append("<input class='copier'>");
        $(".copier").val( link );
        $(".copier").select();
       	document.execCommand("copy");
        $(".copier").remove();
        
        if ( lang.includes("nl") ) {
        	$(this).children().text("Gekopiëerd!");
        } else {
        	$(this).children().text("Copied!");
        }
        setTimeout( function() {
        	button.children().text( bText );
        }, 1000);
      });
    
    	$(".private-modal__container").addClass("affected");
  }
}

setInterval( check, 500);