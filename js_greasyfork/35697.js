// ==UserScript==
// @name        NovelUpdates Focus
// @version     1
// @namespace   zack0zack
// @description NovelUpdates.com Focus a los capitulos
// @include     *www.novelupdates.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35697/NovelUpdates%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/35697/NovelUpdates%20Focus.meta.js
// ==/UserScript==

window.scrollTo(0, 1000);					// mueve la ventana verticalmente 1000

var completas = new Array();
completas[0]  = "c191 (final)";					// Emperador de Solo Play 
completas[1]  = "despu" + unescape("%E9") + "s";		//  Todo el mundo es un retornado 
completas[2]  = "c348 ep";
completas[3]  = "Emperador de juego en solitario";
completas[4]  = "Emperador de Solo Play";
//completas[5]  = "";
//completas[6]  = "";
//completas[7]  = "";
//completas[8]  = "";
//completas[9]  = "";
//completas[10]  = "";
//completas[1]  = "";


var x= new Array();
x[0]  = "c56";							// Memorize
x[1] = "c459";							// Transcendiendo los Nueve Cielos
 x[2] = "c45";								// Ejército de un hombre
x[3] = "c20";							// Me reencarné y confundí como un genio
x[4] = "c52";							// Tensei Jinsei
x[5] = "c215";							// Salve el Rey
x[6] = "c139";							// (Um, lo siento) He sido reencarnado
x[7] = "c60";							// Revolución de la maga de la 8 clase
 x[8] = "c552";							// Liberar Bruja
x[9] = "c97";							// Viviré mi segunda vida
x[10] = "c893";							// IRAS

x[11] = "Renacimiento del ladr" + unescape("%F3") + "n que vag" + unescape("%F3") + " por el mundo";
x[12] = "Maestro Hunter K";
x[13] = "(Um, lo siento) ";
x[14] = "He sido reencarnado";
x[15] = "Me reencarn" + unescape("%E9") + " y confund" + unescape("%ED") + " como un genio";
x[16] = "Libera a esa bruja";
x[17] = "Yo soy el Monarca";
x[18] = "Revoluci" + unescape("%F3") + "n de la 8" + unescape("%AA") + " clase mago";
x[19] = "Trascendiendo los Nueve Cielos";
x[20] = "m Really a Superstar";
x[21] = "Game Market 1983";
x[22] = "Tales of Demons and Gods";
x[23] = "Transcending the Nine Heavens";
x[24] = "Sovereign of the Three Realms";
x[25] = "I am the Monarch";
x[26] = "24";							//HaCKer
x[27] = "Bocchi Tenseiki";
//x[28] = "";
//x[29] = "";
//x[30] = "";


 var i, v = document.getElementsByTagName('a');
 for(i=0; i < v.length ; i++ ) {
	var a = v[i].innerHTML;
	var ale;
	for ( ale = 0; ale < x.length; ale++){
		a = a.replace( x[ale], '<b><font color=red>' + x[ale] + '</font></b>');
	}
	for ( ale = 0; ale < completas.length; ale++){
		a = a.replace( completas[ale], '<b><font color=blue>' + completas[ale] + '</font></b>');
	}
	v[i].innerHTML = a;
 }


window.addEventListener("load",function() {
	window.scrollTo(0, 900);				// mueve la ventana verticalmente 1000
},true)
