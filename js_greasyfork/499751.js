// ==UserScript==
// @name        zagolovok_v_otchete_o_matche pefl.ru
// @namespace   Violentmonkey Scripts
// @match       https://pefl.ru/plug.php?p=refl&t=if*
// @grant       none
// @version     1.0.1
// @author      -
// @description 05.07.2024, 10:35:27
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499751/zagolovok_v_otchete_o_matche%20peflru.user.js
// @updateURL https://update.greasyfork.org/scripts/499751/zagolovok_v_otchete_o_matche%20peflru.meta.js
// ==/UserScript==

var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js", function() {
  	var team1 = $('.head').eq(0).text();
    	var team2 = $('.head').eq(2).text();
  	$("center").eq(1).before('<h2>&nbsp;'+team1+ '-' +team2+'</h2>');
});