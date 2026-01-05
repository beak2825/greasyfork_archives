// ==UserScript==
// @name        SR satoshi
// @namespace   ------
// @description mejora farm satoshi
// @include     https://farmsatoshi.com/*
// @version     1
// @grant       none
//permitir pegado
// @downloadURL https://update.greasyfork.org/scripts/12751/SR%20satoshi.user.js
// @updateURL https://update.greasyfork.org/scripts/12751/SR%20satoshi.meta.js
// ==/UserScript==


try {
var maxAgua =localStorage.getItem("SRS_maxAgua");
var maxZan =localStorage.getItem("SRS_maxZan");
var maxTrigo =localStorage.getItem("SRS_maxTrigo");
var maxHeno =localStorage.getItem("SRS_maxHeno");
var maxMaiz =localStorage.getItem("SRS_maxMaiz");
}
catch(err){
var maxAgua =0;
var maxZan =0;
var maxTrigo =0;
var maxHeno =0;
var maxMaiz =0;  
}
  
  


var agua = document.getElementsByClassName("progress rounded_tiny progress_tiny bleu")[0].style.width;
var CapAgua=parseInt(maxAgua-(parseInt(agua,10)*maxAgua/100));

var zan = document.getElementsByClassName("progress rounded_tiny progress_tiny orange")[0].style.width;
var CapZan=parseInt(maxZan-(parseInt(zan,10)*maxZan/100));


var trigo = document.getElementsByClassName("progress rounded_tiny progress_tiny jaune")[0].style.width;
var CapTrigo=parseInt(maxTrigo-(parseInt(trigo,10)*maxTrigo/100));


var heno = document.getElementsByClassName("progress rounded_tiny progress_tiny jaune")[1].style.width;
var CapHeno=parseInt(maxHeno-(parseInt(heno,10)*maxHeno/100));


var maiz = document.getElementsByClassName("progress rounded_tiny progress_tiny green")[0].style.width;
var CapMaiz=parseInt(maxMaiz-(parseInt(maiz,10)*maxMaiz/100));


document.getElementsByClassName("ads2")[0].style.position="relative";



var Cadena= "Capacidad de agua:" + CapAgua + "<br> Capacidad de zanahorias=" + CapZan + "<br> Capacidad de trigo=" + CapTrigo + "<br> Capacidad de heno=" + CapHeno + "<br> Capacidad de maíz=" +CapMaiz; 

var ban = "<br><br><iframe src='//ads.exoclick.com/iframe.php?idzone=1688110&size=160x600' width='160' height='600' scrolling='no' marginwidth='0' marginheight='0' frameborder='0'></iframe>";

document.getElementsByClassName("menu-top-right")[0].innerHTML +="<div id='bob' style='background-color:#ffffff; font-size: 14px;text-align: left;position: relative; top:-100px;'>" + Cadena + ban +"</div>";

//recuperacion de valores maximos

try {
  // guardado de maximos
    //zanahoria
    var cadena = document.getElementsByClassName("food_stat")[0].innerHTML;
    var pos_max=cadena.search("<p>Max :");
    var cadena = cadena.slice(pos_max,1000); 
    var fin_max=cadena.search("</p>");
    var cadena = cadena.slice(8,fin_max); 
    var max=parseInt(cadena,10);
    localStorage.setItem("SRS_maxZan", max);
    
    //trigo
    var cadena = document.getElementsByClassName("food_stat")[1].innerHTML;
    var pos_max=cadena.search("<p>Max :");
    var cadena = cadena.slice(pos_max,1000); 
    var fin_max=cadena.search("</p>");
    var cadena = cadena.slice(8,fin_max); 
    var max=parseInt(cadena,10);
    localStorage.setItem("SRS_maxTrigo", max);
  
    //heno
    var cadena = document.getElementsByClassName("food_stat")[2].innerHTML;
    var pos_max=cadena.search("<p>Max :");
    var cadena = cadena.slice(pos_max,1000); 
    var fin_max=cadena.search("</p>");
    var cadena = cadena.slice(8,fin_max); 
    var max=parseInt(cadena,10);
    localStorage.setItem("SRS_maxHeno", max);
  
    //maiz
    var cadena = document.getElementsByClassName("food_stat")[3].innerHTML;
    var pos_max=cadena.search("<p>Max :");
    var cadena = cadena.slice(pos_max,1000); 
    var fin_max=cadena.search("</p>");
    var cadena = cadena.slice(8,fin_max); 
    var max=parseInt(cadena,10);
    localStorage.setItem("SRS_maxMaiz", max);
  
    //agua
    var cadena = document.getElementsByClassName("food_stat")[4].innerHTML;
    var pos_max=cadena.search("<p>Max :");
    var cadena = cadena.slice(pos_max,1000); 
    var fin_max=cadena.search("</p>");
    var cadena = cadena.slice(8,fin_max); 
    var max=parseInt(cadena,10);
    localStorage.setItem("SRS_maxAgua", max);
		
}
catch(err) {
    
}


