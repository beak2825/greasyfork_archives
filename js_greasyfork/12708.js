// ==UserScript==
// @name         Convio WYSIWYG Fixer
// @namespace    conviowysiwygfixer
// @author       Arthur Hanna
// @description  This userscript fixes annoying behavior in Convio's terrible WYSIWYG.
// @match        https://secure3.convio.net/ta/admin/CommCenter?email=em_edit4*
// @match        https://secure3.convio.net/ta/admin/CommCenter?email=em_create4*
// @version      1.21
// @downloadURL https://update.greasyfork.org/scripts/12708/Convio%20WYSIWYG%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/12708/Convio%20WYSIWYG%20Fixer.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.

	// Count unstyled elements? This code doesn't work.
	
	// var n = jQ( "#html_editorhtml_ifr" ).contents().find( "li" ).length;

    // jQ( "#html_editorrow1" ).text( "There are " + n + " unstyled lis" );
    


  // Create custom buttons!
  
	jQ(".field-hint").append("<div id='tabuttons' style='padding: 10px;'></div><div id='tamessages' style='padding: 10px;'>");

  jQ( "#tabuttons" ).append( "<span id='checkbroken' class='fixers'><strong>Check code.</strong></span>");

  jQ( "#tabuttons" ).append( "<span id='fixlinks' class='fixers'><strong>Fix link stylings</strong></span>");
  
  jQ( "#tabuttons" ).append( "<span id='fixbullets' class='fixers'><strong>Fix bullet styles</strong></span>");
  
  jQ( "#tabuttons" ).append( "<span id='headerimg' class='fixers'><strong>Fix header image</strong></span>");


  jQ( "#tabuttons" ).append( "<span id='previewbutton' class='fixers'><strong>Insert preview text</strong></span>");
  
//	jQ( "#tabuttons" ).append( "<span id='viewhtml' class='fixers'><strong>Show HTML</strong></span>");
  
    jQ( ".field-hint" ).append( "<label for='prevtext' style='float: left; margin-top: 5px; margin-right: 10px;'>Preview Text: </label><input type='text' name='prevtext' placeholder='Preview text' id='actualpreviewtext'></input>");



 jQ("#actualpreviewtext").css({"float": "left", "width" : "650px"});


    

  jQ(".field-hint").css({"padding": "15px 0", });
    jQ(".field-hint").css({"padding": "15px 0", });
  // Styling for custom links
  
  jQ(".fixers").css({"margin-right": "15px", "border": "2px solid #ccc", "padding": "3px", "border-radius": "3px"});
  
  
  // GRAB PREVIEW TEXT FROM EMAIL IF IT EXISTS, ADD TO PREVIEW TEXT BOX - this does not work
	
	jQ( "#html_editorhtml_ifr").contents().find("#previewtext")

  
  // Let's fix the links onclick
  
  jQ( "#fixlinks" ).click(function() {
     
     		
     
			var n = jQ( "#html_editorhtml_ifr" ).contents().find( "a:not([style])").length;

			jQ( "#tamessages" ).text( "Fixed " + n + " unstyled links." );
  
	// This isn't totally perfect, since some links aren't bold, i.e. calendar adds.  
  
  jQ( "#html_editorhtml_ifr" ).contents().find( "a" ).css({
  
  		"text-decoration": "underline",
  		"color": "#f05c22",
  		"font-weight": "bold",

  	});
  		
  
});

// non-working "view html" function

//  jQ( "#viewhtml" ).click(function() {

// 	jQ( "#emailcontent" ).remove();
  	
//    jQ( "#tabuttons" ).append( "<textarea id='emailcontent'></textarea>");


// });




function explode(){

   		 var textis = jQ( "#html_editorhtml_ifr").contents().find("#previewtext").text();
 		 jQ('#actualpreviewtext').val(textis);
 		 
}

setTimeout(explode, 2000);


  

  jQ( "#previewbutton" ).click(function() {

			// Grab whatever text has been entered in the box.
			
			var bla = jQ('#actualpreviewtext').val();


			
			// if special div isn't there, add it.
			
			if ( jQ( "#html_editorhtml_ifr").contents().find("#previewtext").length == 0 ) {

  	 jQ( "#html_editorhtml_ifr").contents().find("body").prepend( "<span id='previewtext' style='display: none !important; color: white; font-size: 1px;'></span>" );
			
 
				}
			

			//Set

			jQ( "#html_editorhtml_ifr" ).contents().find( "#previewtext").text( bla );
			
			jQ( "#tamessages" ).text( "Preview text set to " + bla);



});




  jQ( "#fixbullets" ).click(function() {
  
  			// Need to modify this code to detect whether these have inline styles.

				var n = jQ( "#html_editorhtml_ifr" ).contents().find( "li:not([style])").length;

			jQ( "#tamessages" ).text( "Fixed " + n + " unstyled list items." );

		  jQ( "#html_editorhtml_ifr" ).contents().find( "li" ).css({
  
				"margin-bottom": "1em",
				"font-size": "16px",
				"line-height": "28px",
				"font-family": "georgia,serif",
				"color": "#000000",

			});

});


  jQ( "#checkbroken" ).click(function() {

			// Check for unstyled elements. Display how many.
			
			// This needs to be updated to check for header images. Filed an issue (https://github.com/transalt/userscripts/issues/1)
	
			var unlis = jQ( "#html_editorhtml_ifr" ).contents().find( "li:not([style])").length;
			
			var unas = jQ( "#html_editorhtml_ifr" ).contents().find( "a:not([style])" ).length;
			
			jQ( "#tamessages" ).text( "There are " + unlis + " unstyled list items. There are " + unas + " unstyled links.");



});



  jQ( "#headerimg" ).click(function() {

     
     // Need to write function to check for incorrect properties.
     
			var n = jQ( "#html_editorhtml_ifr" ).contents().find( "#leadimg:not([width='100%'])").length;

			jQ( "#tamessages" ).text( "Fixed " + n + " header images." );
  
  // Make sure width is 100%
  
  jQ( "#html_editorhtml_ifr" ).contents().find( "#leadimg").attr("width","100%");
  	
  // Make sure height is not set. If so, remove it.
  
    jQ( "#html_editorhtml_ifr" ).contents().find( "#leadimg" ).removeAttr("height");

  	
  	

});


}

// load jQuery and execute the main function
addJQuery(main);