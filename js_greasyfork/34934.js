// ==UserScript==
// @name        Geschicklichkeits spiel 
// @namespace   basti 10121012
// @include     **
 
 
// @namespace   
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  ein geschickichkeitsspiel wo schnelligkeit und konzetration notwendig ist 
 
// @version      2
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
 

 // @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png


 
// @downloadURL https://update.greasyfork.org/scripts/34934/Geschicklichkeits%20spiel.user.js
// @updateURL https://update.greasyfork.org/scripts/34934/Geschicklichkeits%20spiel.meta.js
// ==/UserScript==
 
 document.getElementById('content').innerHTML += '<div id="response"></div><div id="ww"></div>';

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
 

 

//------------------------font-weight:bold;-----------------------------------------------------------------

var maxfenster = 600; // Px
var maxtiefe = maxfenster+200;
var farbemengen = 16777215;//Möglich sind  16777215
  var min = 10; // Gröse der quadrate minimum
  var max = 200; // gröse der quadrate maximun 
 





addGlobalStyle('#info{float:left; margin:0;padding:0px 0px 0px 0px;color:black;font-family:Arial;font-size:20px; text-align:center;}');  
addGlobalStyle('.ul{float:left; margin:0;padding:0px 0px 0px 0px;color:red;font-family:Arial;font-size:20px; text-align:center;}');  
addGlobalStyle('#alles {position:absolute;top:0px; left:0px; z-index:1; height:'+maxtiefe+'px; width:'+maxfenster+'px;  background-color:yellow;}');


addGlobalStyle('#inhalt {position:absolute;top:-100px; left:0px; z-index:15; height:100px; width:'+maxfenster+'px;  background-color:grey;}');

addGlobalStyle('#did1 {position:absolute;top:0px; left:0px; z-index:2; height:200px; width:200px;  background-color:red;}');
addGlobalStyle('#did2 {position:absolute;top:0px; left:200px; z-index:3; height:200px; width:200px;  background-color:green;}');
addGlobalStyle('#did3 {position:absolute;top:0px; left:400px; z-index:4; height:200px; width:200px;  background-color:blue;}');



addGlobalStyle('#did4 {position:absolute;top:200px; left:0px; z-index:5; height:200px; width:200px;  background-color:green;}');
addGlobalStyle('#did5 {position:absolute;top:200px; left:200px; z-index:6; height:200px; width:200px;  background-color:blue;}');
addGlobalStyle('#did6 {position:absolute;top:200px; left:400px; z-index:7; height:200px; width:200px;  background-color:red;}');


addGlobalStyle('#did7 {position:absolute;top:400px; left:0px; z-index:8; height:200px; width:200px;  background-color:blue;}');
addGlobalStyle('#did8 {position:absolute;top:400px; left:200px; z-index:9; height:200px; width:200px;  background-color:red;}');
addGlobalStyle('#did9 {position:absolute;top:400px; left:400px; z-index:10; height:200px; width:200px;  background-color:green;}');

addGlobalStyle('#did10 {position:absolute;top:600px; left:0px; z-index:10; height:200px; width:600px;  background-color:green;}');
addGlobalStyle('#meinspan {display:block;}');
document.getElementById('ww').innerHTML  = '<div id="inhalt"><input type="button" name="startt" id="startt" value="Start Spiel"><br>'
  +'Leicht:<input type="checkbox" name="leicht1" id="leicht1"> '
    +'Mittel:<input type="checkbox" name="leicht2" id="leicht2"> '
    +'Schwer:<input type="checkbox" name="leicht3" id="leicht3"> '
    +'Super schwer:<input type="checkbox" name="leicht4" id="leicht4"></div>'
  +'<div id="alles"><div id="l"></div>'

+'<div id="did1" name="as"><span id="meinspan">Merke dir diesen Würfel und klicke ihn schnellls möglich an  </span></div>'
+'<div id="did2" name="as"></div>'
+'<div id="did3" name="as"></div>'
+'<div id="did4" name="as"></div>'
+'<div id="did5" name="as"></div>'
+'<div id="did6" name="as"></div>'
+'<div id="did7" name="as"></div>'
+'<div id="did8" name="as"></div>'
+'<div id="did9" name="as"></div>'
+'<div id="did10" ><div id="info"></div></div>'
 +'</div>';
window.onload = function() {
  
  
  chek1 = document.getElementById('leicht1')
  chek1.onchange = function() {
     var speedq = 1000;
    document.getElementsByName('leicht1')[0].checked =true;
    document.getElementsByName('leicht2')[0].checked =false;
    document.getElementsByName('leicht3')[0].checked =false;
    document.getElementsByName('leicht4')[0].checked =false;
    sessionStorage.setItem('speedq', speedq);
  }
  
    chek2 = document.getElementById('leicht2')
  chek2.onchange = function() {
    var speedq = 500;
    document.getElementsByName('leicht1')[0].checked =false;
    document.getElementsByName('leicht2')[0].checked =true;
    document.getElementsByName('leicht3')[0].checked =false;
    document.getElementsByName('leicht4')[0].checked =false;
    sessionStorage.setItem('speedq', speedq);
  }
  
      chek3 = document.getElementById('leicht3')
  chek3.onchange = function() {
   var speedq = 250;
    document.getElementsByName('leicht1')[0].checked =false;
    document.getElementsByName('leicht2')[0].checked =false;
    document.getElementsByName('leicht3')[0].checked =true;
    document.getElementsByName('leicht4')[0].checked =false;
    sessionStorage.setItem('speedq', speedq);
  }
  
        chek4 = document.getElementById('leicht4')
  chek4.onchange = function() {
    var speedq = 100;
    document.getElementsByName('leicht1')[0].checked =false;
    document.getElementsByName('leicht2')[0].checked =false;
    document.getElementsByName('leicht3')[0].checked =false;
    document.getElementsByName('leicht4')[0].checked =true;
    sessionStorage.setItem('speedq', speedq);
  }
  
  
  
            document.getElementsByName('startt')[0].addEventListener('click', function start() { 
if (window.confirm("Achtung spiel startet "+sessionStorage.getItem('speedq')+"")) { 
  document.getElementById('meinspan').style.display="none";
los()
}






  
  
  
  
  
  
  
  
  
  
  
  var falsch = document.getElementsByName('as');
  for(sa=0;sa<=8;sa++){
 
    falsch[sa].onclick = function() {
   hi = sessionStorage.getItem('hi');
  hi++
sessionStorage.setItem('hi', hi);
  
 
  }
  }
  
  
  
  
  
  ay3 = document.getElementById('alles');
   ay3.onclick = function() {
     var neben = sessionStorage.getItem('neben'); 
  neben++;
sessionStorage.setItem('neben', neben);
    daneben = sessionStorage.getItem('neben')-sessionStorage.getItem('hi');
   }
   
   
   
   
   
sel3 = document.getElementById('did1');
   sel3.onclick = function() {
      clearInterval(timerr);
    ypx = new Date() 
    diff = ypx.getTime() - anfangpx.getTime()
    alert("Es dauerte " + diff/1000 + " Sekunden, denn richtigen Würfel zu treffen\n  "+hi+" mal falsch den falschen würfel geklickt \n "+daneben+" daneben geklickt")

   }
 

 
















// $did2.click(function() {
  // alert('HOVER')
// });



function los(){
b()
sessionStorage.setItem('hi', 0);
sessionStorage.setItem('neben', 0);
 anfangpx = new Date() 
}

function b(){
 
 
  
  
  var a =aa()
 var x =xx()
var xx1= po(x);
  var yy = po(x);
 document.getElementById('did'+a).style.top=xx1+'px';
document.getElementById('did'+a).style.left=yy+'px';
document.getElementById('did'+a).style.width=x+'px';
document.getElementById('did'+a).style.height=x+'px';
 var color = '#'+Math.floor(Math.random()*farbemengen).toString(16);
  
f1 = farb(color,1)
f2 = farb(color,2)
f3 = farb(color,3)
f4 = farb(color,4)
f5 = farb(color,5)
f6 = farb(color,6)
var ee = '<b>'+f1+' - '+f2+' - '+f3+' - '+f4+' - '+f5+' - '+f6+'</b>';
 var allfarbe4 = Math.round(parseInt(f1)*parseInt(f2));
  var allfarbe1 =Math.round(parseInt(allfarbe4)*parseInt(f3)); 
    var allfarbe2 =Math.round(parseInt(allfarbe1)*parseInt(f4));
    var allfarbe3 =Math.round(parseInt(allfarbe2)*parseInt(f5));
     var allfarbe =Math.round(parseInt(allfarbe3)*parseInt(f6));
  
 var zusammen = allfarbe*x;

  var poos = xx1*yy;
    var gesamt = zusammen*poos;
 document.getElementById('info').innerHTML  =' '+ee+' <br>' 
+'Farbcode  Möglichkeiten  ( 16777215 )<br>'+allfarbe+'<br>'
 +'Farben mal Grösse ( 200 px )('+x+')<br>'+zusammen+'<br>'
 +''+maxfenster+'px X '+maxfenster+'px mögliche Positsionen (360000)('+poos+') <br>'+gesamt+'<br>'  
 +'Vielen Dank fürs zukucken<a href="https://greasyfork.org/de/users/150605-pennerhackisback" titel="Meine Scripte von Pennerhackisback">Meine Scripte</a>';  
   

document.getElementById('did'+a).style.background = color;

timerr =window.setTimeout(function () { b() }, sessionStorage.getItem('speedq'));
 
}
 


function xx(){

 var x = Math.floor(Math.random() * (max - min));
 
  return x;
}

function aa(){
  min1 = 1;
  max1 = 11;
 var a = Math.floor(Math.random() * (max1 - min1));
  if(a==0){
  a=1;
    return a;
  }else{
 
  return a;
}
}


function farb(color,p){
g=color.split('')[p];
  
if(g=='a'){var g =10;}else
if(g=='b'){var g =11;}else
if(g=='c'){var g =13;}else
if(g=='d'){var g =14;}else
if(g=='e'){var g =15;}else
if(g=='f'){var g =12;}else
if(g==0){var g =16;}else
if(g==1){var g =1;}else  
 if(g==2){var g =2;}else 
if(g==3){var g =3;}else
if(g==4){var g =4;}else
if(g==5){var g =5;}else
if(g==6){var g =6;}else
if(g==7){var g =7;}else
 if(g==8){var g =8;}else 
  if(g==9){var g =9;}else 
  {var g =1;} 
  
  
  return g;
  }

function po(x){
  var  max2=maxfenster-x;
  var po = Math.floor(Math.random() * (max2 - 1));
 //if(po==1){var x = 0; var y = 0;}else
  
  return po;
 }


 }, false);  
}