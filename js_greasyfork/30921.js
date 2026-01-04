// ==UserScript==
// @name         Filtrado de hilos ForoCoches
// @namespace    https://greasyfork.org/es/scripts/30921-filtrado-de-hilos-forocoches
// @description  Filtra los hilos no deseados por palabras clave y autores.
// @include      *.forocoches.com/
// @include      *.forocoches.com/foro/forumdisplay.php*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @icon         https://i.imgur.com/QlWA4Kx.png
// @run-at       document-start
// @version      2.3
// @downloadURL https://update.greasyfork.org/scripts/30921/Filtrado%20de%20hilos%20ForoCoches.user.js
// @updateURL https://update.greasyfork.org/scripts/30921/Filtrado%20de%20hilos%20ForoCoches.meta.js
// ==/UserScript==



// Palabras a filtrar:
var palabras = ['palabra', 'ejemplo'];


// Usuarios a filtrar:
var usuarios = ['usuario','ejemplo'];



$( document ).ready(function() {
  
// Panel ocultos
var visible = false;
$("body").before("<div id='scr-ocultos'><div id='panelOcultos'><div id='contFiltrado'></div></div></div>");


// Script para filtrar
var filtroPalabras = document.querySelectorAll('a[href*="showthread.php"]');
var filtroUsuarios = document.querySelectorAll('span[onclick*="member.php?u="], a[href*="/foro/member.php?u="]');
for (var i = 0; i < filtroPalabras.length; i++) {
	comprobarPalabras(filtroPalabras[i], 'textContent');
}
for (var i = 0; i < filtroUsuarios.length; i++) {
	comprobarUsuarios(filtroUsuarios[i], "textContent");
}
function comprobarPalabras(obj, elemento) {
	var text = obj[elemento];
	for (var i = 0; i < palabras.length; i++) {
		if (text.toLowerCase().indexOf(palabras[i].toLowerCase()) !== -1) {
			var palabrasEscape = palabras[i].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
			obj.innerHTML = obj.innerHTML.replace(new RegExp('(' + palabrasEscape + ')', 'gi'), "<span class='p-filtrada'>$1</span>");
			obj.closest('tr').style.display = "none";
			$("#contFiltrado").append("<div class='filtradoAll filtrado-p'>" + obj.closest("tr").innerHTML + "</div>");
		}
	}
}
function comprobarUsuarios(obj, elemento) {
	var text = obj[elemento];
	for (var i = 0; i < usuarios.length; i++) {
		if ((text.toLowerCase() === usuarios[i].toLowerCase()) || (text.toLowerCase() === usuarios[i].slice(0, 8).toLowerCase() + "..")) {
			obj.innerHTML = obj.innerHTML.replace(usuarios[i], "<span class='u-filtrado'>" + usuarios[i] + "</span>");
			obj.innerHTML = obj.innerHTML.replace(usuarios[i].slice(0, 8) + "..", "<span class='u-filtrado'>" + usuarios[i].slice(0, 8) + ".." + "</span>");
			obj.closest("tr").style.display = "none";
			$("#contFiltrado").append("<div class='filtradoAll filtrado-u'>" + obj.closest("tr").innerHTML + "</div>");
		}
	}
}


// Panel ocultos
$("#scr-ocultos").prepend("<div id='abrirOcultos'></div>");
$("#abrirOcultos").click(function() {
	if (!visible) {
		$("#scr-ocultos").children("#panelOcultos").css("display", "block");
		visible = true;
		$("#abrirOcultos").css("display", "none");
	}
});
$("#panelOcultos").prepend("<div id='cerrarOcultos'></div>");
$("#cerrarOcultos").click(function() {
	if (visible) {
		$("#scr-ocultos").children("#panelOcultos").css("display", "none");
		visible = false;
		$("#abrirOcultos").css("display", "block");
	}
});
$("#panelOcultos").css("display", "none");

});



// Hoja de estilos para panel ocultos
(function() {var css = [
	"#abrirOcultos {",
	"  cursor: pointer;",
	"  position: absolute;",
	"  z-index: 101;",
	"  display: block;",
	"  width: 24px;",
	"  height: 24px;",
	"  background: url(https://i.imgur.com/k5l5pdD.png) no-repeat center;",
	"  background-size: 24px;",
	"  right: 12px;",
	"  top: 19px;",
	"  opacity: .2;",
	"  transition: .2s;",
	"}",
	"#abrirOcultos:hover {",
	"  opacity: .87;",
	"}",
	"#cerrarOcultos {",
	"  cursor: pointer;",
	"  position: fixed;",
	"  z-index: 100;",
	"  width: 100%;",
	"  height: 100%;",
	"  background: rgba(128,128,128,.4);",
	"}",
	"#contFiltrado {",
	"  padding: 24px;",
	"  background: #fff;",
	"  overflow: auto;",
	"  z-index: 101;",
	"  width: calc(75% - 48px);",
	"  max-height: calc(90% - 48px);",
	"  left: 50%;",
	"  top: 50%;",
	"  transform: translate(-50%,-50%);",
	"  position: fixed;",
	"  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
	"  border-radius: 2px;",
	"}",
	".filtradoAll {",
	"  font-size: 0;",
	"  font-family: Roboto, Arial;",
	"  padding: 16px;",
	"  border-bottom: 1px solid rgba(0,0,0,.1);",
	"  width: calc(100% - 32px);",
	"}",
	".filtradoAll > div > span {",
	"  font-family: Roboto, Arial;",
	"}",
	".filtradoAll > .texto,",
	".filtradoAll > strike,",
	".filtradoAll > a,",
	".filtradoAll > div {",
	"  font-size: 14px;",
	"  display: table;",
	"}",
	".filtradoAll > a:not(:nth-of-type(2)):not([href^=\'/foro/member.php?u=\']),",
	".filtradoAll > img,",
	".filtradoAll > div:not(:nth-of-type(1)):not(:nth-of-type(2)),",
	".filtradoAll > div > .smallfont,",
	".filtradoAll > div > span[style=\'float:right\'],",
	".filtradoAll > div > a > img,",
	".filtradoAll > div > span > img,",
	".filtradoAll > div > span > a > img {",
	"  display: none;",
	"}",
  ".filtradoAll > a:link:nth-last-child(1) {",
	"  font-weight: normal;",
  "  color: #000;",
	"}",
	".p-filtrada {",
	"  background: rgba(244,67,54,.7);",
	"  color: #fff;",
	"  padding: 2px 0;",
	"  border-radius: 2px;",
	"  text-decoration: line-through;",
	"}",
	".u-filtrado {",
	"  background: rgba(255,235,59,.7);",
	"  padding: 2px 0;",
	"  border-radius: 2px;",
	"  text-decoration: line-through;",
	"}"
].join("\n");
	var node = document.createElement("style");
	node.id = "filtrado_css";
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// Si no hay <head> insertar en cualquier sitio
		document.documentElement.appendChild(node);
	}
})();