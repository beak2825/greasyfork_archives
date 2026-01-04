//
// Written by Glenn Wiking
// Script Version: 0.1.2
//
//
// ==UserScript==
// @name        Shuttle SEO Switch
// @namespace   SEO
// @description Adds automatic h1, h2 and h3 tag conversion from custom styles in Shuttle Data WYSIWYG-editors
// @version     0.1.2
// @icon        https://dlw0tascjxd4x.cloudfront.net/assets/img/symbol.svg

// @include     *.shuttle.be/admin/*
// @include			*app.shuttle.be/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require			https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js

// @downloadURL https://update.greasyfork.org/scripts/429113/Shuttle%20SEO%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/429113/Shuttle%20SEO%20Switch.meta.js
// ==/UserScript==

$(window).on("load", function() {
  function apply() {
    let buttonHeading = $(".cke_panel_frame").contents().find(".cke_panel_listItem a[title*='Heading']").parent();
    let buttonText = $(".cke_panel_frame").contents().find(".cke_panel_listItem a[title*='Text']").parent();
    buttonHeading.off("click");
    buttonText.off("click");
    buttonHeading.on("click", function() {
      let heading = parseInt( $(this).find("> a").attr("title").split("Heading ")[1] );
      console.log( heading );
      
      $(".cke_wysiwyg_frame:visible").each( function() {
        let headings = $(this).contents().find("p > span.custom-style-h"+ heading +"");
        console.log( headings );
        headings.each( function() {
          $(this).parent().prepend("<h"+ heading +" class='custom-style-h"+ heading +"'></h"+ heading +">");
          $(this).contents().appendTo( $(this).prev("h"+heading) );
          $(this).remove();
        });
      });
      
    });
    buttonText.on("click", function() {
      let heading = $(this).find("> a").attr("title");
      console.log( heading );
    });
    $(".cke_source, iframe.cke_wysiwyg_frame").parent().addClass("seo-avail");
    $(".seo-avail:visible").each( function() {
      if ( $(this).prev().find(".cke_seo").length == 0 ) {
        let sourceClone = $(".cke_toolbar:nth-last-child(2)").clone();
        $(this).prev().find("> .cke_toolbox").append( sourceClone );
        $(this).prev().find("> .cke_toolbox .cke_toolbar:last").addClass("cke_seo");
        let seoDude = $(".cke_seo");
        $(this).prev().find("> .cke_toolbox .cke_button__source:first").closest(".cke_toolbar").addClass("cke_source-tool");
        $(this).prev().find("> .cke_toolbox .cke_button[title='Source']").closest(".cke_toolbar:not(.cke_seo):not(.cke_source-tool)").remove();
        
        console.log(seoDude.find("a"));
        seoDude.find(".cke_button_label").text("SEO");
        seoDude.find(".cke_button").attr("title", "SEO");
        seoDude.find(".cke_button").off("click");
        seoDude.find("a").attr("onclick","").attr("onkeydown","").attr("onfocus","").attr("onblur","");
      }
		});
    //console.log( $(".cke_seo:visible") );
    
    $(".cke_seo:visible").each( function() {
    	$(this).off("click");
      $(this).on("click", function() {
      	let innerItem = $(this).closest(".cke_inner").find("iframe.seo").contents().find("span[class^='custom-style-h']");
        innerItem.each( function() {
          let headingSet = parseInt( $(this).attr("class").split("custom-style-h")[1] );
          $(this).parent().prepend("<h"+ headingSet +" class='custom-style-h"+ headingSet +"'></h"+ headingSet +">");
          $(this).contents().appendTo( $(this).prev("h"+headingSet) );
          $(this).hide();
          
          console.log( headingSet );
        });
        
        	console.log( innerItem );
      });
    });
  }
  
  $(".shuttle-Panel").on("click", apply);
  setInterval( function() {
  	$(".cke_source, iframe.cke_wysiwyg_frame").addClass("seo");
    $(".seo").off("click");
    $(".seo").on("click", apply());
  },500 );
  
  $("head").append("<style type='text/css'>.seo-avail {border: 1px solid #7d03ab !important} .cke_top .cke_seo .cke_button__source_icon {background-position: 0 -624px !important;} .cke_top .cke_seo .cke_button {width: 46px !important;}</style>");
});
  