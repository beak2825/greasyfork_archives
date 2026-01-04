// ==UserScript==
// @name        border spielerrein noch nicht fertig 
// @namespace   basti 10121012
// @include     *pennergame*
 
 
// @namespace   
// @author       erzeugt eine lauflichtleiste .1 von 4 .das script ist noch nicht fertig kann aber zum spielen schon benutzt werden
// @description  wer faul ist und klicks ersparen will nimmt dieses script
 
// @version      1
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @require		  https://code.jquery.com/jquery-3.2.1.min.js
// @require		  https://code.jquery.com/ui/1.11.4/jquery-ui.js
 // @require		  https://code.jquery.com/jquery-1.10.2.js

 
  // @require		  http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js 
 
 // @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png


 

// @downloadURL https://update.greasyfork.org/scripts/35188/border%20spielerrein%20noch%20nicht%20fertig.user.js
// @updateURL https://update.greasyfork.org/scripts/35188/border%20spielerrein%20noch%20nicht%20fertig.meta.js
// ==/UserScript==
  
  function addGlobalStyle(css) {
    var head, style;
    
    head = document.getElementsByTagName('body')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var border = 10;
var posision_foto_links = 200;
var posision_foto_top = 100;
var tempodrehen = 50;
css()

function css(){
 addGlobalStyle('#bild { position: absolute;top:'+posision_foto_top+'px;left:'+posision_foto_links+'px;z-index:100; border:0px solid red;background:black;}');
addGlobalStyle('#bild{color: blue;	font-size: 12px;   overflow:auto; 	padding-left: 5px;}');

addGlobalStyle('#bild{margin:0;padding:0;overflow:hidden;}');

}
  

  
  
  
 
 function position_ermitteln(){
    var elm = document.getElementById("bild");
     var xa = getAbsoluteX(elm);
      var ya = getAbsoluteY(elm);  
       var vonlinks = xa-border;
        var vonoben = ya-border;
         var breite = elm.offsetWidth;
          var hohe = elm.offsetHeight;
          //document.getElementById("bild").innerHTML = breite+'-'+hohe;
            var bis_ende_width =parseInt(breite)+parseInt(border)+parseInt(border);
             var bis_ende_height = parseInt(hohe)+parseInt(border)+parseInt(border);
             document.getElementById("pos").innerHTML ='<p>Von Links '+vonlinks+'<br>'
             +'Von Oben '+vonoben+'<br>Breite '+breite+'<br>Höhe '+hohe+'<br>'
             +'Breite mitborder '+bis_ende_width+'<br>Höhe mit Border '+bis_ende_height+'<br>'
 return {l: vonlinks, o: vonoben, w:bis_ende_width, h:bis_ende_height};
 }

          var bild = document.createElement("div");
          bild.id ="bild"
          document.getElementsByTagName('body')[0].appendChild(bild);

          var bildunten = document.createElement("div");
          bildunten.id ="bildunten"
          document.getElementsByTagName('body')[0].appendChild(bildunten);


          bild.innerHTML ='Functionen: <select id="funk" name="funk">'
 +'<option value=""></option>'
+' <option value="1">drehen</option>'
 +'<option value="2">Links rechts </option>'
 +'<option value="3">Zoom in zoom out</option> '
+'<option value="4">Beben</option> '
 +'<option value="5">Zittern</option> '
 +'<option value="6">    </option> '
 +'<option value="7">    </option> '
 +'<option value="8">    </option></select><br> '


+' Bilder <select id="urlbild" name="urlbild">'
+'<option value="4">    </option>'
+' <option value="https://cdn.pixabay.com/photo/2016/07/15/23/37/chess-board-1520707_960_720.jpg">nix</option>'
            +'<option value="https://previews.123rf.com/images/bluewren/bluewren0902/bluewren090200003/4322700-Schwarz-Wei-Schachbrett-Muster-mit-Abstand-Perspektive--Lizenzfreie-Bilder.jpg">schach</option>'
            +'<option value="https://cdn.pixabay.com/photo/2013/07/12/18/20/chessboard-153303_960_720.png">   </option> '
+'<option value="4">stopp</option> </select><br>'
            +'Tempo <input type="range" id="tempo" name="tempo" min="0" max="9" size="1" value="9"><br>'
           +'TempoPlus<input type="range" id="tempoplus" name="tempoplus" min="0" max="9" size="1" value="0"><br>'
            +'<br><div id="pos"><div>'
          
          
          var banner = document.querySelector('#bildunten');

banner.onmouseover =  function (evt) {
  alert(banner)
    banner.style.animationPlayState = 'paused';

}
          
 function menu(){
    var urlbild = document.getElementsByName('urlbild')[0].value;          
    var funk =   document.getElementsByName('funk')[0].value;
       var tempo =   document.getElementsByName('tempo')[0].value;
     var tempoplus =   document.getElementsByName('tempoplus')[0].value;
   try{
    //document.getElementById("bildunten").style.animationPlayState = 'paused';
   }catch(e){}
  
   bilder_wahl(urlbild,tempo,tempoplus)
      if(funk == 1){drehen() }
      if(funk == 2){laufen_links() }
      if(funk == 3){zoominout() }
           if(funk == 4){beben() }
           if(funk == 5){zittern() }
        if(funk == 6){ }
        if(funk == 7){ }
        if(funk == 8){ }
   }
   funk.onchange=menu;    
 urlbild.onchange=menu;
tempo.onchange=menu;




 function bilder_wahl(urlbild,tempo,tempoplus){

          var zuruck =  position_ermitteln()
        var width =zuruck.w 
        var hohe = zuruck.h
   var links = zuruck.l
   var oben= zuruck.o

			  bildunten.style.position = 'absolute';
	 	  bildunten.style.left = links+'px';
		 		  bildunten.style.top = oben+'px';
        bildunten.style.zIndex = 99;
         bildunten.style.width = width+'px';
       bildunten.style.height = hohe+'px';
        bildunten.style.overflow ='hidden';
 // bildunten.style.animation=' rot '+tempo+'.'+tempoplus+'s linear infinite';
 //bildunten.style.background='url('+urlbild+') 0 0 no-repeat';
   
 addGlobalStyle('#bildunten:before {  content: "";  position: absolute;  width: 200%;  height: 200%;  top: -50%;  left: -50%;  z-index: -1;background:url('+urlbild+') 0 0 no-repeat;animation:rot '+tempo+'.'+tempoplus+'s linear infinite} ');
   return;
 }
  
 
   

function laufen_links(){
 
addGlobalStyle('@keyframes rot {'
   +' 0% {left:-100px; }'
  +' 25% {left: 0px; }'
+'50% {left:-100px; }'
+' 100% {left:0px;  }');


}


//f2.setAttribute('transform', 'translate(240,120) rotate(' + -y + ')');



//.style.animationPlayState = 'paused';

 
function drehen(){
 
 addGlobalStyle('@keyframes rot {0% {transform: rotate(0deg); }100% { transform: rotate(360deg); }');

 
    }
  
  
 

function zoominout(){

 addGlobalStyle('@keyframes rot {0% {transform:  scale(1); }25% { transform: scale(2); }50% {transform:  scale(3);}75% {transform:  scale(2);}100% {transform:  scale(1); } ');
}

//animation-name: beben;animation-duration: 1s;animation-timing-function: linear;animation-iteration-count: infinite;

function beben(){
addGlobalStyle('@keyframes rot {'
+'0% { transform: rotate(0deg) translate(2px, 1px); }'
+'10% { transform: rotate(2deg) translate(1px, 2px); }'
+'20% { transform: rotate(-2deg) translate(3px, 0px) ; }'
+'30% { transform: rotate(0deg) translate(0px, -2px); }'
+'40% { transform: rotate(-2deg) translate(-1px, 1px); }'
+'50% { transform: rotate(2deg) translate(1px, -2px); }'
+'60% { transform: rotate(0deg) translate(3px, -1px); }'
+'70% { transform: rotate(2deg) translate(-2px, -1px); }'
+'80% { transform: rotate(-2deg) translate(1px, 1px); }'
+'90% { transform: rotate(0deg) translate(-2px, -2px); }'
+'100% { transform: rotate(2deg) translate(-1px, 2px); }'
+'}');
}




function zittern(){
addGlobalStyle('@keyframes rot {'
+'0% { transform: rotate(0deg) translate(20px, 10px); }'
+'10% { transform: rotate(1deg) translate(10px, 20px); }'
+'20% { transform: rotate(2deg) translate(20px, 10px) ; }'
+'30% { transform: rotate(1deg) translate(10px, 20px); }'
+'40% { transform: rotate(0deg) translate(20px, 10px); }'
+'50% { transform: rotate(1deg) translate(10px, 20px); }'
+'60% { transform: rotate(2deg) translate(20px, 10px); }'
+'70% { transform: rotate(1deg) translate(10px, 20px); }'
+'80% { transform: rotate(0deg) translate(20px, 10px); }'
+'90% { transform: rotate(1deg) translate(10px, 20px); }'
+'100% { transform: rotate(2deg) translate(20px, 10px); }'
+'}');
}






function getAbsoluteX (elm) {
   var x = 0;
   if (elm && typeof elm.offsetParent != "undefined") {
     while (elm && typeof elm.offsetLeft == "number") {
       x += elm.offsetLeft;
       elm = elm.offsetParent;
     }
   }
   return x;
}


// Findet die absolute y Position eines Elementes raus
function getAbsoluteY(elm){
   var y = 0;
   if (elm && typeof elm.offsetParent != "undefined") {
     while (elm && typeof elm.offsetTop == "number") {
       y += elm.offsetTop;
       elm = elm.offsetParent;
     }
   }
   return y;
}









  