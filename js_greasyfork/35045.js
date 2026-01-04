// ==UserScript==
// @name        LAUFLICHTS UPDaTES TEST 
// @namespace   basti 10121012
// @include     *pennergame*
 
 
// @namespace   
// @author       erzeugt eine lauflichtleiste .1 von 4 .das script ist noch nicht fertig kann aber zum spielen schon benutzt werden
// @description  wer faul ist und klicks ersparen will nimmt dieses script
 
// @version      5
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
   // @require		  https://code.jquery.com/jquery-3.2.1.min.js

  // @require		 http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js
 // @require		https://code.jquery.com/ui/1.9.2/jquery-ui.js
 
 // @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png


// @downloadURL https://update.greasyfork.org/scripts/35045/LAUFLICHTS%20UPDaTES%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/35045/LAUFLICHTS%20UPDaTES%20TEST.meta.js
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
 
 
function lichtladen(){
 
var mengelicht =sessionStorage.getItem('mengelampen')
var xwidth = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);  
var yheight = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
var menge1 = xwidth/mengelicht/2;//parseInt(200)
var menge =menge1.toFixed();
return {va: mengelicht, vb: menge, vc: xwidth, vd:yheight};
 
}

 var top1 =0;
 var top = 0;
var left = 0;
 var retval = lichtladen();
 
 var menge =retval.vb 
var mengelicht = retval.va
var xwidth = retval.vc
 var yheight = retval.vd

var mengebreite =yheight/menge;

 










 //alert(browserbreite+'-'+xwidth+'-'+menge)
var breite = sessionStorage.getItem('nummer')

var topinfo =parseInt(top)+parseInt(breite);
var leftinfo = 200;
addGlobalStyle('#info {    width: 400px;    height: 300px;    background-color:black;    position: absolute;top:200px;left:100px;z-index:1000;}');
addGlobalStyle('#info{color: blue;	font-size: 12px;   overflow:auto; 	padding-left: 5px;}');



 
function css(){
var breite = sessionStorage.getItem('nummer')
var farbe = sessionStorage.getItem('farbe')
 
addGlobalStyle('.einstellung{color: white;	font-size: 12px;  overflow:hidden; 	padding-left: 5px;}');
addGlobalStyle('.einstellung1{color: white;	font-size: 12px;  overflow:hidden; 	padding-left: 5px;}');
addGlobalStyle('.einstellung2{color: white;	font-size: 12px;  overflow:hidden; 	padding-left: 5px;}');
addGlobalStyle('.einstellung3{color: white;	font-size: 12px;  overflow:hidden; 	padding-left: 5px;}');  
  
 
 addGlobalStyle('#einstellung {    width:'+xwidth+'px;    height: '+breite+'px;    background-color:black;    position: fixed;top:0px;left:0px;z-index:1000;}');

   addGlobalStyle('#einstellung1 {    width:'+xwidth+'px;    height: '+breite+'px;    background-color:red;    position: fixed;bottom:0px;left:0px;z-index:1002;transform: rotateY(180deg);}');
  var right1 = xwidth-breite;

   addGlobalStyle('#einstellung3 {    width:'+xwidth+'px;    height: '+breite+'px;    background-color:red;    position: fixed;bottom:0px;right:'+breite+'px;z-index:1001;transform-origin: bottom right;transform: rotateZ(-270deg);}');
 
  addGlobalStyle('.meinedivs {    width: 0px;    height: '+breite+'px;    background-color:'+farbe+';    position: fixed;top:0px;left:0px;z-index:1109;}');
 
    var right2 = xwidth/2-breite;
 
     addGlobalStyle('#einstellung2 {    width:'+xwidth+'px;    height: '+breite+'px;    background-color:black;    position: absolute;bottom:0px;left:0px;z-index:1003;transform-origin: top left;transform: rotateZ(-90deg);}');

  
  
  
}




 document.getElementsByTagName('body')[0].innerHTML  += '<div id="einstellung" class="einstellung">'

 +'<din id="rein"></div>'
 
 +' <div id="einstellung1" class="einstellung"></div>'
  +' <div id="einstellung2" class="einstellung"></div>'
  +' <div id="einstellung3" class="einstellung"></div>'
 
      +'<div id="info"></div>';

for(a=0;a<=10;a++){
document.getElementById('rein').innerHTML  +='<div id="eins'+a+'" class="meinedivs">    </div>';
}



document.getElementById('info').innerHTML  = ''
+'Breite des Lauflichtes <input type="range" id="nummer" name="nummer" min="10" max="200" size="10" value="10"><br>'
+'Tempo des Lauflichtes <input type="range" id="tempo" name="tempo" min="10" max="2000" size="10" value="2000"><br>'
+'Noch schneller : <input type="range" id="tempoplus" name="tempoplus" min="1" max="20" size="1" value="1"><br>'
+'Farbe des Lichtes : <input type="color" id="farbe" name="farbe" value="'+sessionStorage.getItem('farbe')+'"><br>' 
+'Hintergrudfarbe : <input type="color" id="farbe1" name="farbe1" value="'+sessionStorage.getItem('farbe1')+'"><br>' 
+'Menge Lampen : <select id="mengelampen" name="mengelampen">'
+' <option value="">Menge der lichter</option><option value="0">1</option><option value="1"> 2</option> '
+'<option value="2">3</option><option value="3"> 4</option><option value="4">5</option> '
+' <option value="5">6</option><option value="6">7</option><option value="7">8</option>'
+' <option value="8"> 9</option><option value="9">10</option><option value="10">11</option></select><br>'
+'<div id="inn"></div><br>'
+'<div id="in0"></div><br>'
+'<div id="in1"></div><br>'
+'<div id="in2"></div><br>'
+'<div id="in3"></div><br>'
+'<div id="in4"></div><br>'
+'<div id="in5"></div><br>'
+'<div id="in6"></div><br>'
+'<div id="in7"></div><br>'
+'<div id="in8"></div><br>'
+'<div id="in9"></div><br>'
+'<div id="in10"></div><br>'



function jo () {
     var farbe = document.getElementsByName('farbe')[0].value;
     var nummer = document.getElementsByName('nummer')[0].value;
     var mengelampen = document.getElementsByName('mengelampen')[0].value;
     var tempo = document.getElementsByName('tempo')[0].value;
     var tempoplus = document.getElementsByName('tempoplus')[0].value;
   //  var farbe1 = document.getElementsByName('farbe1')[0].value;
document.getElementById('einstellung').style.background = document.getElementsByName('farbe1')[0].value;
 document.getElementById('einstellung1').style.background = document.getElementsByName('farbe1')[0].value;
  document.getElementById('einstellung2').style.background = document.getElementsByName('farbe1')[0].value;
 document.getElementById('einstellung3').style.background = document.getElementsByName('farbe1')[0].value;
  
             sessionStorage.setItem('tempoplus', tempoplus);
      sessionStorage.setItem('mengelampen', mengelampen);
      sessionStorage.setItem('nummer', nummer);
     sessionStorage.setItem('farbe', farbe);
   //  sessionStorage.setItem('farbe1', farbe1);
         sessionStorage.setItem('tempo', tempo);
     try{
   clearTimeout(timer1)
     }catch(e){}
css()
x=0;
los(x)
}

farbe1.onchange = jo;
farbe.onchange = jo;
mengelampen.onchange = jo;
nummer.onchange=jo;
tempo.onchange=jo
tempoplus.onchange=jo






function los(x){
   var retval = lichtladen();
   var menge =retval.vb 
   var mengelicht = retval.va
   var  lauf = menge*2;
   if(x<lauf){
       for(y=0;y<=mengelicht;y++){
            unten(y)
            if(y==0){
                  var y1=-menge
            }else if(y>=1){
                  var y1=menge*y*2-menge;
            }
            var x2=parseInt(x)*parseInt(sessionStorage.getItem('tempoplus'))
            if(x2>lauf){
                  x=0;
            }
                  var alles =y1;
                  var alles1 =Math.round(alles+x2);
                  document.getElementById('eins'+y).style.width=menge+'px';
                  document.getElementById('eins'+y).style.left=alles1+'px';
                  document.getElementById('eins'+y).innerHTML=alles1; 
                  document.getElementById('in'+y).innerHTML=''
                  +'Div '+y+' = Positsion -'+alles1+' X -'+x+' X2 - '+x2+' Tempoplus - '+sessionStorage.getItem('tempoplus')+'';
      }
      x++
      timer1 = window.setTimeout(function () {
             los(x)
      }, sessionStorage.getItem('tempo'));
   }
}

function unten(y){
            neuesElement = document.getElementById("einstellung").cloneNode(true);
            document.getElementById("einstellung1").appendChild(neuesElement);
            neuesElement1 = document.getElementById("einstellung").cloneNode(true);
            document.getElementById("einstellung2").appendChild(neuesElement1);
            neuesElement2 = document.getElementById("einstellung").cloneNode(true);
            document.getElementById("einstellung3").appendChild(neuesElement2);
}


/*

    //  +'<div id="eins0"  class="meinedivs"></div>'
  //    +'<div id="eins1" class="meinedivs"></div>'
   //   +'<div id="eins2" class="meinedivs"></div>'
    //  +'<div id="eins3" class="meinedivs"></div>'
  //    +'<div id="eins4" class="meinedivs">    </div>'
 //     +'<div id="eins5" class="meinedivs">    </div>'
  //    +'<div id="eins6" class="meinedivs">    </div>'
  //    +'<div id="eins7" class="meinedivs">    </div>'
  //    +'<div id="eins8" class="meinedivs">    </div>'
  //    +'<div id="eins9" class="meinedivs">    </div>'
 //     +'<div id="eins10" class="meinedivs">    </div> </div>'






function laufbreite(x){
     var retval = lichtladen();
   var menge =retval.vb 
 
   var  lauf = menge*2;
   if(x<lauf){
  var k='1'+mengebreite;
   for(ya=11;ya<=k;ya++){
     lk=ya-11;
              if(lk==0){
               var y3=-menge
           }else if(lk>=1){
   var y3=menge*lk*2-menge;
           } 
        //          yaa=ya-10;
      //  var y3=menge*yaa*2-menge-menge-menge;
          
                var x3=parseInt(x)*parseInt(sessionStorage.getItem('tempoplus'))
               if(x3>lauf){
                  x=0;
               }
               var allesa =y3;
               var alles11 =Math.round(allesa+x3);
     
          rightminus = sessionStorage.getItem('nummer')
      document.getElementById('eins'+ya).style.left=rightminus+'px';
     
    // document.getElementById('eins'+ya).style.backgroundColor='green';
                 document.getElementById('eins'+ya).style.width=sessionStorage.getItem('nummer')
                 document.getElementById('eins'+ya).style.height=menge+'px';
               document.getElementById('eins'+ya).style.top=alles11+'px';
     xwidthminus=xwidth-sessionStorage.getItem('nummer')

                    //document.getElementById('eins'+ya).style.left=xwidthminus+'px';

     
               document.getElementById('eins'+ya).innerHTML='<ceter>'+alles11+'</center>'; 
               document.getElementById('in'+ya).innerHTML='Div '+ya+' = Positsion: H'+alles11+'-W'+rightminus+' X -'+x+' y3-'+y3+'- X2 - '+x3+' Tempoplus - '+sessionStorage.getItem('tempoplus')+'';
   }
  
}
}

       +'<div id="eins11" class="meinedivs"></div>'
      +'<div id="eins12" class="meinedivs"></div>'
      +'<div id="eins13" class="meinedivs"></div>'
      +'<div id="eins14" class="meinedivs">    </div>'
      +'<div id="eins15" class="meinedivs">    </div>'
      +'<div id="eins16" class="meinedivs">    </div>'
      +'<div id="eins17" class="meinedivs">    </div>'
      +'<div id="eins18" class="meinedivs">    </div>'
       +'<div id="eins19" class="meinedivs">    </div>'
      +'<div id="eins20" class="meinedivs">    </div>'
       +'<div id="eins21" class="meinedivs">    </div>'
 

 
+'<div id="in11"></div><br>'
+'<div id="in12"></div><br>'
+'<div id="in13"></div><br>'
+'<div id="in14"></div><br>'
+'<div id="in15"></div><br>'
+'<div id="in16"></div><br>'
+'<div id="in17"></div><br>'
+'<div id="in18"></div><br>'
+'<div id="in19"></div><br>'
+'<div id="in20"></div><br>'
+'<div id="in21"></div><br>'






























/*
       //   if(y<=9){
            


//var los1 = document.getElementById('farbe');
//los1.onchange =    
          //     y='0'+y;
          //}
         // document.getElementById('eins'+y).style.zindex='10'+y+'';
          
     //     if(y==1){y1=-100}
    //        if(y==2){y1=100}
     //       if(y==3){y1=300}
     //       if(y==4){y1=500}
     //               if(y==5){y1=700}  
     //                 if(y==6){y1=900}
     //                if(y==7){y1=1100}
      //               if(y==8){y1=1300}
      //                if(y==9){y1=1500}
         //             if(y==10){y1=1700}



*/