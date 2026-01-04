// ==UserScript==
// @name        kbin social add home-instance name to username 
// @namespace   english
// @description  kbin social add home -instance name to username 
// @include     http*://*kbin.social*
// @include     http*://*beehaw.org*
// @version     1.16
// @run-at document-end
// @require       https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468704/kbin%20social%20add%20home-instance%20name%20to%20username.user.js
// @updateURL https://update.greasyfork.org/scripts/468704/kbin%20social%20add%20home-instance%20name%20to%20username.meta.js
// ==/UserScript==


// Main - redirect test 

 // A $( document ).ready() block.
$( document ).ready(function() {


$( ".user-inline" ).each(function() {
 // $( this ).addClass( "foo" );
// get username URL and text, then remove username from URL and paste the instance name after username (not if instance is home-instance of kbin.social

var homeinstance = $(this).attr('href') ;    

var myname = $(this).text().trim();

//console.log( "@@@");
//console.log(homeinstance );
//console.log(myname );

var homeinstance2 =  homeinstance.replace( "/u/@" + myname + "@"  , '');

if(   homeinstance2  !=   "/u/" + myname     ){ //show nothing if home-instance kbin 

console.log(homeinstance2 );
$(this).append( " <i>- " +  homeinstance2 +"</i>" );

}



});


}); //end each username a href




//css color for added text - dark and light modes 

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '     #content a.user-inline i{color: #c63434;}body.theme--dark #content a.user-inline i{color: #ffabc3  !important ;}      ' ;

document.getElementsByTagName('head')[0].appendChild(style);

 

  