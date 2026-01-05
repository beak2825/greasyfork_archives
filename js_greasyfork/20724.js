// ==UserScript==
// @name         Kissanime Downloader with Jdownloader
// @namespace    https://github.com/Meisterlala/Kissanime-Downloader
// @version      v2.0.0
// @description  Adds Download Button
// @author       Meisterlala
// @include      *//kissanime.*/Anime/*
// @include      *//kissanime.*/Anime/*/*
// @grant        GM.setClipboard
// @grant        GM.addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20724/Kissanime%20Downloader%20with%20Jdownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/20724/Kissanime%20Downloader%20with%20Jdownloader.meta.js
// ==/UserScript==

// Adds the CSS for button formatting
var maincolor = window.getComputedStyle ( document.querySelector ( '.bigChar' ) ).color;
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "#myButton{z-index:222;cursor:pointer;position:relative;margin-right:15px;background-color:transparent;outline:0;border:none;\n" +
"display:inline-block;text-decoration:none;font:400 27px Tahoma,Arial,Helvetica,sans-serif;transition-duration:.4s;border-radius:4px;\n" +
"color:" + maincolor + "}#myButton:hover{color:#000;background-color:" + maincolor + "}#myButtonContainer{text-align:center}" ;
document.body.appendChild(css);
// Adds the button to the page
let container = document.createElement ( 'div' );
container.setAttribute ( 'id', 'myButtonContainer' );

let button = document.createElement ( 'button' );
button.setAttribute ( 'type', 'button' );
button.setAttribute ( 'id', 'myButton' );
button.innerHTML = 'Download with JDownloader';

let containerContainer = document.querySelector ( '.barContent > div:nth-child(2)' );

container.appendChild ( button );
containerContainer.appendChild ( container );

// Activate the added button
button.addEventListener ( 'click', function ( ) {
  let links = '';
  if (location.hostname.slice( 10 ) == 'ac') {
  	links = Array.prototype.slice.call ( document.querySelectorAll ( '.episodeList a[href*=Episode]' ) )
    	.map ( elem => elem.getAttribute ( 'href' ) )
    	.reverse ( )
     	.join ( '\n' );
  } else {
  	links = Array.prototype.slice.call ( document.querySelectorAll ( '.episodeList a[href*=Episode]' ) )
    	.map ( elem => document.location.protocol + '//' + document.location.hostname + elem.getAttribute ( 'href' ) )
      .reverse( )
      .join( '\n' );
  }    
  GM.setClipboard( links );
}, false );
