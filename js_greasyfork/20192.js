// ==UserScript==
// @name giphy.gif killer
// @namespace Violentmonkey Scripts
// @grant none
// @include http*
// @include https*
// @run-at document-load
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @description Turns giphy.gif into links.
// @version 0.0.1.20160602190755
// @downloadURL https://update.greasyfork.org/scripts/20192/giphygif%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/20192/giphygif%20killer.meta.js
// ==/UserScript==
var loading_gif = 'https://files.catbox.moe/hq82sb.gif';

function KillImage(image)
{
  var original = image.src;
  var tokill = "giphy.gif"
  if (original.slice(-tokill.length)==tokill)
  {
    console.log("Killed: " + original);
    image.setAttribute('src', loading_gif);
    image.addEventListener('click', function (e) {
    //image.addEventListener('mouseover', function (e) {
      if (image.src == loading_gif && image.src != original)
      {
        image.setAttribute('src', original);
      }
      //e.target.appendChild(img);
    });
  }
}

function UrlImage(image)
{
  var original = image.src;
  var tokill = "giphy.gif"
  if (original.slice(-tokill.length)==tokill)
  {
    var parent = image.parentElement;
    //$(image).remove();
    image.setAttribute('src', loading_gif);

    if ( $(parent).is('a') )
    {		
      parent.removeChild(image);
      parent.innerHTML = original;
    }
    else
    {

      var a = document.createElement('a');
      a.setAttribute('href',original);
      a.innerHTML = original;
      // apend the anchor to the body
      // of course you can append it almost to any other dom element
      //document.getElementsByTagName('body')[0].appendChild(a); 
      $( image ).replaceWith( a );
    }
  }
}

var images = document.getElementsByTagName('img'); 
var srcList = [];
for(var i = 0; i < images.length; i++) {
    UrlImage(images[i]);
}

$(document).bind('DOMNodeInserted', function(e) {
    //console.log(e.target, ' was inserted');
  	if ( $(e.target).is('img') )
    {
    	UrlImage(e.target);  
    }
});

console.log("Killing images...")