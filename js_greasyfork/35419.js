// ==UserScript==
// @name        Bastis fly in fly out alert 
// @namespace   basti 10121012
// @include     *pennergame*
 
 
// @author       alert der inplodiert und explodiert
// @description  wer faul ist und klicks ersparen will nimmt dieses script
 // @noframes
// @version      1
// @author			basti1012
// @require		  https://code.jquery.com/jquery-3.2.1.min.js
 
 // @require		http://code.jquery.com/jquery-migrate-1.2.1.js
 // @require		https://code.jquery.com/ui/1.9.1/jquery-ui.js
// @grant          GM_addStyle


// @downloadURL https://update.greasyfork.org/scripts/35419/Bastis%20fly%20in%20fly%20out%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/35419/Bastis%20fly%20in%20fly%20out%20alert.meta.js
// ==/UserScript==
   
 document.getElementById('content').innerHTML='';
   var grossgesamt=200;//in pixel
 var gross=grossgesamt/2;
 var inhalthead='Bastis fly in fly out';
var inhaltalert='hallo';
var bildalert='http://www.gif-animationen.de/wp-content/gallery/smileys-gross/smileys-smilies-38.gif';
var bye ='byebye';

 GM_addStyle('#hauptdiv { width:'+grossgesamt+'px;  height:'+grossgesamt+'px;  display:block; }');
  GM_addStyle('#hauptalert { background:DarkGray;width:'+grossgesamt+'px;  height:'+grossgesamt+'px; font-size:15px;color:yellow;   display:none; }');
 GM_addStyle('.X {position:absolute;top:0px;left:0px;z-index:10;background-color:red;border:1px solid black;  width:15px;  height:15px;cursor:pointer;}');
 GM_addStyle('.alerts {  background-color:DarkGray;border:1px solid black;  width:'+gross+'px;  height:'+gross+'px;  display:block; }');          
 GM_addStyle('.headeralert {  background-color:#6A5ACD;border:1px solid black;  width:'+grossgesamt+'px;  height:30px;  display:block; font-size:15px;color:yellow; padding-top:7px;}');

 GM_addStyle('.kopf {  background-color:#6A5ACD;border:1px solid black;  width:'+gross+'px;  height:30px;  display:block; font-size:15px;color:yellow; padding-top:7px;}');


 GM_addStyle('#alert1  {    animation-name: ol;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes ol { from {  transform: rotate(0deg) scale(0.0) ;position:absolute;left:-1000px;top:-1000px;}   to   {  transform:  rotate(-360deg) scale(1.0) ;position:absolute;left:0px;top:0px;}}');        
          
 GM_addStyle('#alert2  {    animation-name: or;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes or { from {  transform: rotate(0deg) scale(0.0) ;position:absolute;right:-1000px;top:-1000px;}   to   {  transform:  rotate(-360deg) scale(1.0) ;position:absolute;left:'+gross+'px;top:0px;}}');        
          
 GM_addStyle('#alert3  {    animation-name: ul;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes ul { from {  transform: rotate(0deg) scale(0.0) ;position:absolute;left:-1000px;top:1000px;}   to   {  transform:  rotate(-360deg) scale(1.0) ;position:absolute;left:0px;top:'+gross+'px;}}');        
                             
  GM_addStyle('#alert4  {    animation-name: ur;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes ur { from {  transform: rotate(0deg) scale(0.0) ;position:absolute;right:-1000px;top:1000px;}   to   {  transform:  rotate(-360deg) scale(1.0) ;position:absolute;left:'+gross+'px;top:'+gross+'px;}}');    


function fly()
{
 GM_addStyle('#alert1  {    animation-name: ol;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes ol { from {  transform: rotate(0deg) scale(1.0) ;position:absolute;left:0px;top:0px;}   to   {  transform:  rotate(-360deg) scale(0.0) ;position:absolute;left:-1000px;top:-1000px;}}');        
          
 GM_addStyle('#alert2  {    animation-name: or;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes or { from {  transform: rotate(0deg) scale(1.0) ;position:absolute;right:'+gross+'px;top:0px;}   to   {  transform:  rotate(-360deg) scale(5.0) ;position:absolute;left:-100px;top:300px;}}');        
          
 GM_addStyle('#alert3  {    animation-name: ul;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes ul { from {  transform: rotate(0deg) scale(1.0) ;position:absolute;left:0px;top:'+gross+'px;}   to   {  transform:  rotate(-360deg) scale(0.0) ;position:absolute;-1000px;top:1000px;}}');        
                             
  GM_addStyle('#alert4  {    animation-name: ur;   animation-duration: 2s;animation-play-state: paused;}');
 GM_addStyle('@keyframes ur { from {  transform: rotate(0deg) scale(1.0) ;position:absolute;left:'+gross+'px;top:'+gross+'px;}   to   {  transform:  rotate(-360deg) scale(0.0) ;position:absolute;right:-1000px;top:1000px;}}');  



}






          var bildinner = document.createElement("div");
          var bild = document.createElement("div");
          bild.id ="bild"
document.getElementsByTagName('body')[0].appendChild(bild);
bild.innerHTML=' <button id="klick">klick mich mal></button><div id="hauptdiv"><div id="alert1" class="alerts"><div id="kopf1" class="kopf"></div></div><div id="alert2" class="alerts"><div id="kopf2" class="kopf"></div></div><div id="alert3" class="alerts"></div><div id="alert4" class="alerts"></div></div>'
+'<div id="hauptalert" class="hauptalert"><div id="headeralert" class="headeralert"></div><div id="X" class="X">X</div><br><center><img src="'+bildalert+'" width="150" height="100"></center>'+inhaltalert+'</div>';
 
       $(document).ready(function() {
    $('#klick').click(function() {
       // $('#rotating').toggleClass('rotated');
        hole_alert()
        
document.getElementById('alert1').style.animationPlayState='running';
document.getElementById('alert2').style.animationPlayState='running';
document.getElementById('alert3').style.animationPlayState='running';
document.getElementById('alert4').style.animationPlayState='running';
        
    });
});

 function hole_alert(){
var browser_size = getSize();
var width =browser_size.wi
var height = browser_size.hi
var mittex = width/2-gross
var mittey = height/2-gross

document.getElementById('hauptdiv','hauptalert').style.position='fixed';
document.getElementById('hauptdiv','hauptalert').style.top =mittey+'px';
document.getElementById('hauptdiv','hauptalert').style.left =mittex+'px';
          
  document.getElementById('hauptalert').style.position='fixed';
document.getElementById('hauptalert').style.top =mittey+'px';
document.getElementById('hauptalert').style.left =mittex+'px';        
     window.setTimeout(function () { document.getElementById('hauptalert').style.display='block'; document.getElementById('hauptdiv').style.display='none';closen()
 document.getElementById('headeralert').innerHTML=inhalthead;                                   
                                   
                                   
                                   
                                   }, 2000);
 }
  function closen() {
      
          $('#X').click(function() {
       // $('#rotating').toggleClass('rotated');
  document.getElementById('hauptalert').style.display='none';
            
    document.getElementById('hauptdiv').style.display='block';            
   fly()           
    document.getElementById('kopf2').innerHTML=bye;
       window.setTimeout(function () {   document.getElementById('hauptdiv').style.display='none'; }, 2000);      
    });
      
  }       
          
          
          
          
        //  animation-fill-mode:forwards;
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
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
          
          
          
          
  