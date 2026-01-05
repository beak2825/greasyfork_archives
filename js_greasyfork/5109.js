// ==UserScript==
// @name        KAT - Show Cast
// @namespace   ShowCast
// @version     1.03
// @description Show initial cast as displayed on IMDB
// @include /^https?://kat\.cr/.+-i\d{7}/
// @downloadURL https://update.greasyfork.org/scripts/5109/KAT%20-%20Show%20Cast.user.js
// @updateURL https://update.greasyfork.org/scripts/5109/KAT%20-%20Show%20Cast.meta.js
// ==/UserScript==

var container = $(".dataList").find("div");

$.ajaxPrefilter(function(options) {
  if(options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    //options.url = "http://cors.corsproxy.io/url=" + options.url;
  }
});

$(container).html('<strong>Cast: <i id="temp">Please be patient, this will load shortly</i></strong>');

/** Assign the mode used here
 * 	Stars	-	Get the 3 stars shown at the top of the page	-	NOT CURRENTLY IMPLEMENTED
 * 	S		-	Gets the first 15 actors from the 'Cast Overview' page
 * 	F		-	Gets the entire cast
 **/
var mode = "S";

var id = $('a[href^="http://anonym.to/?http://www.imdb.com/"]').text();
if (mode == "S" || mode == "F")
{
    $.get('http://myapifilms.com/imdb?idIMDB=tt' + id + '&format=JSON&lang=en-gb&actors=' + mode, function( data ) 
    {
        $("#temp").remove();
        for (var i = 0; i < data.actors.length; i++)
        {
            var actor = data.actors[i];
            
            $(container).append('<a href="/movies/actor/' + actor.actorName.replace(" ", "-") + '-a' + actor.actorId.substring(2) + '/">' + data.actors[i].actorName + '</a>, ');
        }
        $(container).html($(container).html().slice(0,-2));
    }, "json");
}