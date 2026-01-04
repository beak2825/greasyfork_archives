// ==UserScript==
// @name vorhang der schwingt mit  meue
// @description vorhang tür für alle seiten die gespeichert werden 
// @include **
// @noframes
// @namespace By Basti102 alias pennerhackisback oder früher pennerhack
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_addStyle
// @grant  GM_xmlhttpRequest
// @version       2.0
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/36672/vorhang%20der%20schwingt%20mit%20%20meue.user.js
// @updateURL https://update.greasyfork.org/scripts/36672/vorhang%20der%20schwingt%20mit%20%20meue.meta.js
// ==/UserScript==



    var tuer = document.createElement("div");
  tuer.id = 'tuer';
 

    document.getElementsByTagName('body')[0].appendChild(tuer);

 
 
tuer.innerHTML ='<div id="wrap">   <canvas id="canvascurtain" width="613" height="854"></canvas></div><div class="menu" id="einstellung"> <span class="ob1 close1 "></span> <span class="ob2 close "></span><span class="mi1"></span><span class="un1 close "></span><span class="un2 close1 "></span></div><div id="eininfo" class="menuein"><h1> Einstellung Schiebetür</h1><div id="feld"></div></div><div id="banner">        <div class="doorHoverLeft" id="zu"><span class="doorText">WelCome to </span></div>        <div class="doorHoverRight"><span class="doorText">HTML lion</span></div></div>';
 




  GM_addStyle('body {  margin: 0;  padding: 0;}#canvascurtain {  width: 100%;  height: 100%:top:0px;}canvas{ position: absolute; z-index: 1000;top:0px;left:0px;pointer-events: none; }');


   GM_addStyle('.menuein{   position:absolute;   top:25%;   left:25%;   width:50%;   height:auto;   background:blacK;   color:red;   z-index:1001;   display:none;  transition: 1s ease all; }');
               
  GM_addStyle('.menu {  position:absolute; z-index:1001;  width: 50px;   height:50px;  display: block;   transition: .3s ease all; }  .ob1{   position:absolute;   width:35px;  height:10px;   background:black;   left:0;   top:10px;    transition: 1s ease all; transform-origin:0% 0%; } .mi1{   position:absolute;   width:38px;   height:10px;   background:black;   left:0;   top:30px; } .un1{   position:absolute;   width:35px;   height:10px;  background:black;   left:0;   top:50px;    transition: 1s ease all;     transform-origin:0% 100%; } .ob2{  position:absolute;   width:35px;   height:10px;   background:black;   right:12px;   top:10px;    transition: 1s ease all;  transform-origin:100% 0%; } .un2{   position:absolute;   width:35px;   height:10px;   background:black;   right:12px;   top:50px;  transition: 1s ease all;     transform-origin:100% 100%; } .closeob1{   transform: rotate(-45deg); } .closeob2{   transform: rotate(45deg); }.weg{   display:none;} .rot{background:red; }');
        
 
     
 
    
    function nein(){
 
    
       GM_addStyle(' #banner { width:100%; height:100%;border: solid 3px black;  position:fixed; z-index:1001;  overflow: hidden ;} .doorText { background-color: green;  color: black; width:50%; font-size: 24px;font-weight:900; text-align:center;height: 45px; border:solid 1px black; position: absolute; top: 30%; }.doorHoverLeft {  position: absolute; left: 0px; top: 0px; height:100%; width: 50%; transition: 3s ease-in-out; border:2px black solid;  background:red;pointer-events: none; }.doorHoverRight { position: absolute; right: 0px; top: 0px; height:100%;width: 50%; transition: 3s ease-in-out; border:2px black solid;background:red;pointer-events: none; }#banner:hover .doorHoverLeft { left: -50%; }#banner:hover .doorHoverRight { right: -50%; }');



 }
var l=$(document).width()/2;
 
function seite_gefunden(wobinich){
 $(document).on("mousemove", function(event) {
  


    var zu1 = document.getElementById("zu");
    var dis1 = window.getComputedStyle(zu1, null).getPropertyValue("left");
   dis2=dis1.replace("-","")
     dis2=dis2.replace("px","")
 
   dis=l-dis2
// alert(dis)
if(dis2>=l){
  
   $("#banner").css("display","none")
}
 });
 
 
 
 
 
 }

 
$(".hover").mouseleave(
        function () {
                $(this).removeClass("hover");
        }
);



 
 
$('#einstellung').click(function(){
$('.close').addClass('closeob1 rot')
$('.close1').addClass('closeob2 rot')
$('.mi1').addClass('weg');
    var elem = document.getElementById("eininfo");
    var dis = window.getComputedStyle(elem, null).getPropertyValue("display");
if(dis=='block'){
 $('.close').removeClass('closeob1 rot')
$('.close1').removeClass('closeob2 rot')
$('.mi1').removeClass('weg')
$('#eininfo').css("display","none")

}else{
 weiter()
 
$('#eininfo').css("display","block")
}
});










 function weiter(){
 
 document.getElementById('feld').innerHTML='';
 
    for(a=1;a<=10;a++){
    p=localStorage.getItem("linkks"+a)
 document.getElementById('feld').innerHTML+='<input type="text" id="jj'+a+'" value="'+p+'">';
 
  try{
 
 document.getElementById("jj"+a).value +=''+a+'';
  }catch(e){}
  }
 

document.getElementById('feld').innerHTML+='<br><center><input type="button" id="save" value="Speichern"><br><p class="pscript">Script auf diesen Seiten ausführen.Zb anstatt http://www.google.de kann man auch einfach google eingeben.Das Script sucht nach den eingegebenen Wörter in der url.</p><br><div id="gespeichert"></div></center>';
function save1(){
for(l=1;l<=10;l++){
var linkks=document.getElementById("jj"+l).value;
 
localStorage.setItem("linkks"+l, linkks);
   document.getElementById("gespeichert").innerHTML+='<p style="color:green;font-size:30px;">'+l+'. Link '+linkks+' Gespeichert</p>'; 
}

}
save.onclick=save1
 }
 
 
 
     for(a=1;a<=10;a++){
     wobinich=location.host;
 
    p=localStorage.getItem("linkks"+a)
    was=wobinich.indexOf(p)
   
 if(was!=-1){
  //nein()
  neu()
  //seite_gefunden(wobinich)
 }else{
  
   
 }
}
 
 function neu(){

      var cv = document.getElementById("canvascurtain");
        var ctx = cv.getContext("2d");
        var img = new Image();
        function imgload() {
            var img = this;
            var wimg = this.width, himg = this.height;
            cv.width = 2 * this.width;
            cv.height = this.height;
            var time = 0, duration = 20000, intv = 15, counter = 0;
            var m = 200, v = 0, deltabottom = 0;
            function update() {
                counter++;
                if (true/*counter % 2*/) {
                    ctx.clearRect(0, 0, wimg, himg);
                    var deltatop = time / duration * 10;
                    if (deltatop > 0.8) deltatop = 0.8;
                    v += (deltabottom - deltatop) / m - v / 40;
                    deltabottom -= v;
                    for (var y = 0, i = 0, inewbase = 0; y < himg; y++) {
                        var inewbasenew = inewbase + wimg * 4;
                        var factor1 = y / himg;
                        var delta = (deltatop * (1 - factor1) + deltabottom * factor1);
                        var factor = 1 - delta;
                        var currentwidth = wimg * factor;
                        ctx.drawImage(img, 0, y, currentwidth, 1);
                        ctx.translate(2 * wimg, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(img, 0, y, currentwidth, 1);
                        ctx.scale(1, 1);
                    }
                }
                time += intv;
                if (time < duration) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }
        img.onload = imgload;
        img.src = "http://webentwicklung.ulrichbangert.de/images/vorhang-links-3.jpg";
 }