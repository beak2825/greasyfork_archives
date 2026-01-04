// ==UserScript==
// @name        Bastis fly out alert 
// @namespace   basti 10121012
// @include     *pennergame*
 
 
// @author       alert der explodiert
// @description  wer faul ist und klicks ersparen will nimmt dieses script
 // @noframes
// @version      5
// @author			basti1012
// @require		  https://code.jquery.com/jquery-3.2.1.min.js
 
 // @require		http://code.jquery.com/jquery-migrate-1.2.1.js
 // @require		https://code.jquery.com/ui/1.9.1/jquery-ui.js



// @downloadURL https://update.greasyfork.org/scripts/35374/Bastis%20fly%20out%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/35374/Bastis%20fly%20out%20alert.meta.js
// ==/UserScript==
      document.getElementById('content').innerHTML = '<div id="response"></div><div id="ww"></div>';

///// @require   https://unpkg.com/sweetalert/dist/sweetalert.min.js


 
    function addGlobalStyle(css) {
    var head, style;
    
    head = document.getElementsByTagName('body')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

 
 

 var url = document.location.href;
 
var xmlHttp = new XMLHttpRequest();
var response = document.getElementById("response");
xmlHttp.open("GET", url, true); // true for asynchronous
xmlHttp.send(null);
xmlHttp.onreadystatechange = function() {
	response.innerHTML = xmlHttp.status;
};
 
   
 //window.setTimeout(function () { fade("+elementNr+","+faktor+") }, step);
 
//var lnk = document.createElement('link');
 //  lnk.rel = 'stylesheet';
 //  lnk.type = 'text/css';
 //   lnk.href = 'http://bower_components/sweetalert2/dist/sweetalert2.min.css ';
//  document.head.appendChild(lnk);
          var bildinner = document.createElement("div");
          var bild = document.createElement("div");
          bild.id ="bild"

var gross=100;
 
 addGlobalStyle('#aalert { width:200px;  height:200px;  display:block; }');

addGlobalStyle('.alerts {  background-color:red;border:1px solid black;  width:100px;  height:100px;  display:block; }');
addGlobalStyle('#header1 {position:absolute; top;0px;left:0px;z-index:15; background-color:blue;width:100px;  height:30px;  display:block;padding:0px; }');
addGlobalStyle('#header2 {position:absolute; top;0px;right:0px;z-index:16; background-color:blue;width:100px;  height:30px;  display:block;padding:0px; }');

addGlobalStyle('#X {position:absolute;top:0px; right:0px;z-index:25;background-color:red;border:1px solid black;  width:15px;  height:15px;  display:block;cursor:pointer; }');


 addGlobalStyle('#alert1 {position:absolute;  left:0px;  top:0px;z-index:11; display:block; }');
 addGlobalStyle('#alert2 {position:absolute;  left:100px;  top:0px; z-index:12; display:block; }');
 addGlobalStyle('#alert3 {position:absolute;  left:0px;  top:100px;z-index:13;  display:block; }');
 addGlobalStyle('#alert4 {position:absolute;  left:100px;  top:100px; z-index:14; display:block; }');


 
function flieg(){

addGlobalStyle('#alert1  {    animation-name: obenlinks;   animation-duration: 2s; }');
addGlobalStyle('#alert2  {    animation-name: obenrechts;   animation-duration: 2s; }');
addGlobalStyle('#alert3  {    animation-name: untenlinks;   animation-duration: 2s;}');
addGlobalStyle('#alert4  {    animation-name: untenrechts;   animation-duration: 2s;}');

 addGlobalStyle('@keyframes obenlinks { from {  transform: translate(0px,0px) rotate(0deg) scale(1.0) }   to   {  transform: translate(-350px,-350px) rotate(-360deg) scale(2.0)}}');
 
 //addGlobalStyle('@keyframes obenlinks { 0% {  transform: translate(0px,0px) rotate(0deg) }'
 // +'   10% {  transform: translate(-100px,-100px) rotate(90deg) }'
 
 //    +'      100% {  transform: transform: translate(-350px,350px) rotate(90deg) }');
    
    
 addGlobalStyle('@keyframes obenrechts { from {  transform: translate(0px,0px)  rotate(0deg) scale(1.0) }   to   {  transform: translate(350px,-350px) rotate(360deg)scale(1.3) }}');

 addGlobalStyle('@keyframes untenlinks { from {  transform: translate(0px,0px)  rotate(0deg) scale(1.0) }   to   {  transform: translate(-350px,350px) rotate(-360deg) scale(2.0) }}');
 
 addGlobalStyle('@keyframes untenrechts { from {  transform: translate(0px,0px)  rotate(0deg) scale(1.0) }   to   {  transform: translate(350px,350px) rotate(360deg) scale(3.0) }}');

    //function flieg2(){
        
 addGlobalStyle('#header1  {    animation-name: flieg11;   animation-duration: 2s;}');
addGlobalStyle('#header2  {    animation-name: flieg12;   animation-duration: 2s;}');
 
 addGlobalStyle('@keyframes flieg11 { from {  transform: translate(0px,0px)  rotate(0deg) scale(1.0) }   to  {  transform: translate(250px,-550px) rotate(-760deg)scale(1.8)  }}');
 
 addGlobalStyle('@keyframes flieg12 { from {  transform: translate(0px,0px)  rotate(0deg) scale(1.0) }   to {  transform: translate(-120px,250px) rotate(30deg)scale(6.0)  }}');
        
        
  //  }
    
    
    
    
 //    window.setTimeout(function () { flieg2() }, 1200);
}

document.getElementsByTagName('body')[0].appendChild(bild);
bild.innerHTML=' <button id="klick">klick mich mal></button><div id="hallo"><div id="hallo1"></div><div id="hallo2"></div></div><div id="alert_der_fliegt">';


function hallo(){
document.getElementById('alert_der_fliegt').innerHTML='<div id="aalert">'
    +'<div id="alert1" class="alerts" name="alertz"><div id="header1" class="header">Und</div></div>'
    +'<div id="alert2" class="alerts" name="alertz"><div id="header2" class="header">Schüss<div id="X" name="close" class="X">X</div></div></div>'
    +'<div id="alert3" class="alerts"  name="alertz">alert3</div>'
    +'<div id="alert4" class="alerts" name="alertz">alert4</div>'
    +'</div> ';

document.getElementById('hallo').style.display='none';
}
 
 
function getSize() {
    var myWidth = 0, myHeight = 0;
 
    if( typeof( window.innerWidth ) == 'number' ) {
   
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
     
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
   
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return {wi:myWidth, hi:myHeight};
}








function hole_alert(){


 addGlobalStyle('#hallo { width:200px;  height:200px;}');
 
 addGlobalStyle('#hallo1 { position:absolute;  left:0px;  top:0px;z-index:22;width:200px;  height:30px; background-color:blue; display:block;padding:10px; }');
 addGlobalStyle('#hallo2 { position:absolute;  left:0px;  top:50px;z-index:22;width:200px;  height:170px; background-color:red; display:block;padding:10px; }');


    addGlobalStyle('#hallo  {    animation-name: aa;   animation-duration: 0.5s;}');
 
 addGlobalStyle('@keyframes aa { 0%{  transform:  scale(0.0) } 25%  {  transform: scale(1.0) } 50%{  transform:  scale(2.5) } 75%  {  transform: scale(0.9) } 100%{  transform:  scale(1.0) }    }');
    
    
//document.getElementById('hallo').style.transition='opacity 2s ease-out';
 // document.getElementById('hallo').style.display='block';opacity: 1;



 

var browser_size = getSize();
var width =browser_size.wi
var height = browser_size.hi
var mittex = width/2-gross
var mittey = height/2-gross

document.getElementById('hallo').style.position='fixed';
document.getElementById('hallo').style.top =mittey+'px';
document.getElementById('hallo').style.left =mittex+'px';


document.getElementById('hallo1').innerHTML ='<font style="font-size:20px;color:white">Alert By Basti1012</font><div id="X" name="close" class="X">X</div>';
document.getElementById('hallo2').innerHTML ='<center><img src="http://www.gif-animationen.de/wp-content/gallery/smileys-gross/smileys-smilies-38.gif" width="150" height="100"></center><center><font style="font-size:25px;color:white">Herzlichen Dank Für dein Besuch</font></center>';
 
 








 document.getElementsByName('close')[0].addEventListener('click', function start() { 
            hallo()
  var browser_size = getSize();
 
 var width =browser_size.wi
var height = browser_size.hi
 

var mittex = width/2-gross
var mittey = height/2-gross
document.getElementById('aalert').style.position='fixed';
document.getElementById('aalert').style.top =mittey+'px';
document.getElementById('aalert').style.left =mittex+'px'; 
  
            
            
flieg()
  
 window.setTimeout(function () { document.getElementById('aalert').style.display='none'; }, 2000);
 }, false); 
 
}


$(document).ready(function() {
    $('#klick').click(function() {
       // $('#rotating').toggleClass('rotated');
        hole_alert()
    });
});
