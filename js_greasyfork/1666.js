// ==UserScript==
// @name       Desafiar todos - Playfulbet
// @namespace  http://twitter.com/ivan_817
// @version    0.7
// @description  enter something useful
// @include      *playfulbet.com/eventos/*
// @copyright  2014+, ivan817
// @downloadURL https://update.greasyfork.org/scripts/1666/Desafiar%20todos%20-%20Playfulbet.user.js
// @updateURL https://update.greasyfork.org/scripts/1666/Desafiar%20todos%20-%20Playfulbet.meta.js
// ==/UserScript==

$(".tab-selector").append("<br/><span style='color: #01DF01;text-shadow:1px 1px 8px #04B431;'><a href='' id='DesafiarTodos' >Desafiar a todos</a></span>")
$("a#DesafiarTodos").click(function(){
	$("a.js-challenge.accept").each(function(index,element){element.click();});
});