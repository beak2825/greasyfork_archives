// ==UserScript==
// @name        Rename File ( - topic)
// @name:en     Rename File ( - topic)
// @namespace   charliet@gmail.com
// @description Renames the file
// @include     https://ycapi.org/button/*
// @version     2
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/30192/Rename%20File%20%28%20-%20topic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30192/Rename%20File%20%28%20-%20topic%29.meta.js
// ==/UserScript==

//console.log($('a')[0].href);

$('a').css('pointer-events','none');
$('div').css('cursor','pointer');


$('div').click(function() {
  //alert($(this).find('a')[0].href);
  
  url = $(this).find('a')[0].href;
  title = QueryString.name;
  title = title.replace(/"/g , "");
  
  var myURL = 'http://thompcha.com/yt/?url='+encodeURIComponent(url)+'&title='+encodeURIComponent(title);
  //alert(myURL);
  //$.get(myURL);
  //$('<a>').attr('href', myURL).text('blah').appendTo('body').click();
  window.location.href = myURL;
});
  //console.log(myURL);

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

/*
window.setInterval(function(){
  console.log($('a')[0].href);
}, 1000);
*/
/*
$( "#progress" ).change(function() {
  alert( "Handler for .change() called." );
});
*/
//var myURL = 'http://thompcha.com/sc/?url='+encodeURIComponent(url)+'&title='+encodeURIComponent(title);
/*
var myLink = "";

var myVar = setInterval(function(){ myLink = myTimer() }, 1000);

function myTimer() {
  var link = $('a')[0].href;
  if (link != "https://ycapi.org/"){
    return link;
    clearInterval(myVar);
    console.log($('a')[0].href);
  }
  
}

function myStopFunction() {
    clearInterval(myVar);
}
*/