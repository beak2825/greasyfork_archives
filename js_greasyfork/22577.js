// ==UserScript==
// @name         expand trade routes
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  ...
// @author       iti
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include      http*://*.travian.*/build.php?*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/22577/expand%20trade%20routes.user.js
// @updateURL https://update.greasyfork.org/scripts/22577/expand%20trade%20routes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.querySelector('#tradeRouteEdit')){
		function createTrade(userHour){
			if(userHour === undefined) return false;
            var options = '/build.php?show-destination=on';
                options += '&did_dest='+document.querySelector('#did_dest').value;
                options += '&r1='+document.querySelector('#r1').value;
                options += '&r2='+document.querySelector('#r2').value;
                options += '&r3='+document.querySelector('#r3').value;
                options += '&r4='+document.querySelector('#r4').value;
                options += '&userHour='+userHour;
                options += '&repeat='+document.querySelector('#repeat').value;
                options += '&gid='+document.querySelector('input[name="gid"]').value;
                options += '&a='+document.querySelector('input[name="a"]').value;
                options += '&t='+document.querySelector('input[name="t"]').value;
                options += '&trid='+document.querySelector('input[name="trid"]').value;
                options += '&option='+document.querySelector('input[name="option"]').value;
                GM_openInTab(window.location.origin+options);
                return true;
        }

        function createTradeLoop(){
			var imchecked = [];
            if(marketPlace.validateTradeRouteResourcesSanity()){
                var e = document.querySelectorAll('.scriptcheckbox');
                for(var i=0; i<e.length; i++){
                    if(e[i].checked) imchecked.push(i);
                }
				var ht = setInterval(function(){ if(!(createTrade(imchecked.pop()))) clearInterval(ht); }, 100);
            }
        }

        var p = document.createElement('p');

		var c = document.createElement('input');
		c.type = "checkbox";
        c.className = "scriptcheckbox";

        for(var i=0; i<24; i++){
            if(!(i%6)) p.appendChild(document.createElement('br'));
			if(i) c = c.cloneNode(false);
            p.appendChild(c);
            p.appendChild(document.createTextNode(i>9?i:'0'+i));
		}
        document.querySelector('#build').appendChild(p);
        
        var but = document.createElement('input');
        but.type = 'button';
        but.value = 'Create';
        document.querySelector('#build').appendChild(but);
        
        but.addEventListener('click',createTradeLoop);
    }
})();