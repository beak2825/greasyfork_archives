// ==UserScript==
// @name        Ingress Intel Plus
// @description Makes your life with Ingress Intel easier.
// @include     *.ingress.com/intel*
// @version     0.3.2
// @grant none
// @namespace https://greasyfork.org/users/1264
// @downloadURL https://update.greasyfork.org/scripts/1785/Ingress%20Intel%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/1785/Ingress%20Intel%20Plus.meta.js
// ==/UserScript==

// Esta variable sirve para agregar los estilos del script
var style = document.createElement("STYLE");

// Eliminar barras de desplazamiento lateral
document.getElementById("dashboard").style.overflowX="hidden";

// <INICIO> Modificacion del "restrict to map"
	var styleText = document.createTextNode("#plext_viewport_restrict_checkbox_container:hover{opacity:1.0;}");
	var styleText2 = document.createTextNode("#plext_viewport_restrict_checkbox_container{opacity:0.2;transition:all 1s;}");
	style.appendChild(styleText);
	style.appendChild(styleText2);
	document.head.appendChild(style);
	styleText=styleText2=null;
// <FIN> Modificacion del "restrict to map"

// <INICIO> Creacion boton ocultar comm
	var botonComm = document.createElement("DIV");
	botonComm.id="commVisibilitySwitcher";
	botonComm_Text=document.createTextNode("Ocultar Comm");
	botonComm.appendChild( botonComm_Text );
	botonComm_Style = document.createTextNode("#commVisibilitySwitcher{background-color:#222; border:1px solid #EBBC4A; bottom:-45px; color:#EBBC4A; cursor:pointer; height:25px; padding:0px 5px; position:absolute; right:85px; text-align:center; width:110px;}");
	style.appendChild(botonComm_Style);
	botonComm.addEventListener("click", switchComm, false);
	botonComm.class="unselectable";
	document.getElementById("dashboard_container").appendChild(botonComm);
// <FIN> Creación de boton ocultar comm

// Funcion switchComm
function switchComm()
{
	var comm = document.getElementById("comm");
	var boton = document.getElementById("commVisibilitySwitcher");
	if( comm.style.display=="none" )//El comm está oculto, hay que mostrarlo
	{
		comm.style.display="block";
		boton.textContent="Ocultar Comm";
	}
	else
	{
		comm.style.display="none";
		boton.textContent="Mostrar Comm";
	}
}