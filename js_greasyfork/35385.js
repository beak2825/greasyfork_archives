// ==UserScript==
// @name		Kongregate Game Reload Button
// @name:id 	Kongregate Game Reload Button
// @namespace	http://g.hol.es/
// @version		0.1.03
// @description	Reload only game frame, keep the chat
// @description:id	Tambahan tombol reload di frame game, chatnya ga ilang
// @author		Ipakerok 46
// @include		http*://*konggames.com/*/*/*
// @include		http*://*?*kongregate_game_auth_token=*
// @supportURL	mailto:korekapi14046@gmail.com
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/35385/Kongregate%20Game%20Reload%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/35385/Kongregate%20Game%20Reload%20Button.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// reload button
	var reloadButton = function(){
		var panel = document.createElement('div');
		var button = document.createElement('button');
		button.innerHTML  = "Reload";
		panel.setAttribute('style', "position:fixed;bottom:0px;right:0px;padding:0px;opacity:0.4;z-index:99999;");
		button.setAttribute('style', "background:#6783b4;color:#fff;padding:1px;border:solid 1px;font-size:7px");
		panel.appendChild(button);
		button.onclick = e=>{
            window.location=window.location;
        };
		button.onmouseover = e=>{
            e.target.parentNode.style.opacity=1;
        };
		button.onmouseleave = e=>{
            e.target.parentNode.style.opacity=0.4;
        };
		document.body.appendChild(panel);
	};


    var style = document.createElement('style');
    style.innerHTML = '';
    style.innerHTML += 'body, html{pointer-events:unset !important;} ';
    document.body.appendChild(style);

	reloadButton();

})();