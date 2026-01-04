// ==UserScript==
// @name Remove FB redirection
// @namespace Violentmonkey Scripts
// @include          https://www.facebook.com/* 
// @author       Chomik 
// @version 1.0
// @description The script changes links on Facebook from redirected to direct, so Facebook will not know, what you click. 
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/369652/Remove%20FB%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/369652/Remove%20FB%20redirection.meta.js
// ==/UserScript==
 



var extractURL = function(fbURI){

  
  if (fbURI.indexOf('u=http') == -1)
    return fbURI;  
  
  debugger;
  
 // get query string from url (optional) or window
  var queryString = fbURI ? fbURI.split('?')[1] : window.location.search.slice(1);

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');
    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');    
      if (a[0] == "u"){
//        debugger;      
        var decoded = decodeURIComponent(a[1]);
        if (decoded.substr(0,4) == 'http'){
          debugger;
          return decoded;          
        } else
          return fbURI;
      }
    }
  }

}


var removeFBLinks = function() {
//  debugger;
  var links = document.getElementsByTagName('a');
  if (links){
//    debugger;            
    for (var i = 0; i < links.length; i++){
      var li = links[i].href;
      li = extractURL(li);
      links[i].href = li;
    }
  }
}





var TimeoutStop = function() {

  setTimeout(TimeoutStop, 1000);
  setTimeout(removeFBLinks, 500);

}

TimeoutStop();