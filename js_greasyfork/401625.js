// ==UserScript==
// @name        YouTube homepage remover
// @description Remove videos from the homepage and place an inspirational quote
// @version     1.1
// @author      RavenEXP
// @grant       GM.xmlHttpRequest
// @include     *://*.youtube.com/
// @include     *://*.youtu.be/
// @require   	http://code.jquery.com/jquery-3.4.1.min.js
// @run-at      document-end
// @compatible  firefox
// @compatible  chrome
// @namespace https://greasyfork.org/users/530932
// @downloadURL https://update.greasyfork.org/scripts/401625/YouTube%20homepage%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/401625/YouTube%20homepage%20remover.meta.js
// ==/UserScript==

//Set the time for the script to expire
var workUntil = "17:30"

//Check if the current time will "break" youtube
var d = new Date(); 
var currentTime = d.getHours() + ":" + d.getMinutes();

if(currentTime < workUntil)
{
  //Remove homepage videos and side bar
 	$("#end.ytd-masthead").remove();
	$("#page-manager").remove();
	$("#guide-content.ytd-app").remove();
  $("#guide-button.ytd-masthead").remove();
  
  //Create the paragraphs for the quote and quote author
  $("ytd-app").append("<div id =\"quotePlace\"\">")
  $("#quotePlace").append("<p id=\"quote\"></p> <p id=\"author\"></p> </div>");

  //Apply css to the quote and quote author
	$("#quotePlace").css({"padding-top": "15%",
                        "padding-left": "25%",
                        "padding-right": "25%",
                        "font-size": "240%",
                        "color": "#f00",
                        "-webkit-filter": "invert(50%)",
                        "filter": "invert(50%)"});
  
  //Take the quote and quote author and put them in there paragraphs
  var apiArray = new Array();  
  GM.xmlHttpRequest({
      method: "GET",
      url: "https://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=xml&lang=en",
      responseType:   "xml",
      onload: function(data) {
        apiArray = getXMLToArray(data.responseText);
        console.log(apiArray.QUOTE.QUOTETEXT[0]);
        console.log(apiArray.QUOTE.QUOTEAUTHOR[0]);
        $("#quote").html('"' + apiArray.QUOTE.QUOTETEXT[0] + '"');
        $("#author").html('-' + apiArray.QUOTE.QUOTEAUTHOR[0]); 
      }
    });
}


function getXMLToArray(xmlDoc){
  var thisArray = new Array();
  //Check XML doc
  if($(xmlDoc).children().length > 0){
    //Foreach Node found
    $(xmlDoc).children().each(function(){
      if($(xmlDoc).find(this.nodeName).children().length > 0){
        //If it has children recursively get the inner array
        var NextNode = $(xmlDoc).find(this.nodeName);
        thisArray[this.nodeName] = getXMLToArray(NextNode);
      } else {
        //If not then store the next value to the current array
        thisArray[this.nodeName] = [];
        $(xmlDoc).children(this.nodeName).each(function(){
          thisArray[this.nodeName].push($(this).text());
        });
      }
    });
  }
  return thisArray;
}





    