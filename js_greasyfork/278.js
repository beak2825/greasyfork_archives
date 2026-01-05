// ==UserScript==
// @name        Eishockeyforum - Zitate
// @description Versteckt überflüssige Zitate, die aber wieder einblendbar sind.
// @namespace   ehf neu
// @include     http://www.eishockeyforum.at/index.php/Thread/*
// @include     http://www.eishockeyforum.at/index.php/PostAdd/*
// @version     20140727

// @downloadURL https://update.greasyfork.org/scripts/278/Eishockeyforum%20-%20Zitate.user.js
// @updateURL https://update.greasyfork.org/scripts/278/Eishockeyforum%20-%20Zitate.meta.js
// ==/UserScript==


$(document).ready(Greasemonkey_main);

function Greasemonkey_main()
{    
  var ZitatElem = $("div.messageBody").children("div").children("div.messageText").children(".quoteBox").children("div").children(".quoteBox");

  ZitatElem.each 
  (
    function() 
    {
      var itemDiv = $(this);
      if ((itemDiv.length > 0) && (itemDiv.children("header").children("h3").length > 0)) {
      
      itemDiv.children("div").css("display","none");
      itemDiv.children("header").children("h3").css("background-color", "rgba(192,192,192,0.25)");
      itemDiv.children("header").children("h3").hover(
        function() {
        $( this ).css("background-color", "rgba(128,128,128,0.25)").append( $( "<span\ class=\"ehfscriptclick\">&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;Click</span>" ) );
        }, function() {
        $( this ).css("background-color", "rgba(192,192,192,0.25)").find( "span:last" ).remove();
        }
      );
      itemDiv.children("header").children("h3").click(
        function() {
            itemDiv = $(this);
            if ( itemDiv.parent("header").parent(".quoteBox").children("div").css("display") == "none"){
              itemDiv.parent("header").parent(".quoteBox").children("div").css("display","block");
            }
            else {
              itemDiv.parent("header").parent(".quoteBox").children("div").css("display","none");
            }
        }
      );
      }
    }
  );
  
  var url = window.location.href;
  var type = url.split('#');
  var hash = '';
  if(type.length > 1){
    hash = type[1];
    //$(window).scrollTop($('a#' + hash).position().top);
    //alert(hash);
    var element_to_scroll_to = document.getElementById(hash);
    window.setTimeout(function(){element_to_scroll_to.scrollIntoView(true)}, 500);
  }
  /*if(window.location.hash) {
    alert(window.location.hash.substr(1));
  } else {
    // Fragment doesn't exist
  }*/

}