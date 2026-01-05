// ==UserScript==
// @name		Mole Hole - grmh.pl
// @version		0.9.93
// @author		Tropsy Kreets
// @namespace		GRMH
// @description		extension of the Grepolis game
// @include		 http://*.grepolis.*/game*
// @include		https://*.grepolis.*/game*
// @include		https://*.grepolis.*/start?action=select_new_world
// @icon		https://grmh.pl/imgs/icon.ico
// @iconURL		https://grmh.pl/imgs/icon.ico
// @grant		none
// @copyright		2013+
// @downloadURL https://update.greasyfork.org/scripts/23237/Mole%20Hole%20-%20grmhpl.user.js
// @updateURL https://update.greasyfork.org/scripts/23237/Mole%20Hole%20-%20grmhpl.meta.js
// ==/UserScript==
(function(){
 var s=document.createElement('script');
 s.type='text/javascript';
 s.src='https://grmh.pl/MHscript/MH_script.js?_'+Math.round(new Date().getTime()/60000);
 var l=document.createElement('link');
 l.type='text/css';
 l.rel='stylesheet';
 l.href='https://grmh.pl/MHscript/MH_styles.css?_'+(new Date().getDay());
 document.body.appendChild(s);
 document.body.appendChild(l);
})();
