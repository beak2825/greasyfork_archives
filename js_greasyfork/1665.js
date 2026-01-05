// ==UserScript==
// @name       Aceptar Todas Peticiones
// @namespace  http://twitter.com/ivan_817
// @version    0.7
// @description  Añade boton Aceptar todas las peticiones
// @include      *playfulbet.com/usuarios/*?type=requests
// @copyright  2014, ivan817
// @downloadURL https://update.greasyfork.org/scripts/1665/Aceptar%20Todas%20Peticiones.user.js
// @updateURL https://update.greasyfork.org/scripts/1665/Aceptar%20Todas%20Peticiones.meta.js
// ==/UserScript==

$(".column.trailer").append("<br/><span style='color: #01DF01;text-shadow:1px 1px 8px #04B431;'><a href='' id='AceptarTodos'>Aceptar todas</a></span>")
$("a#AceptarTodos").click(function(){
	$("a.accept.request-answer").each(function(index,element){element.click();});
});