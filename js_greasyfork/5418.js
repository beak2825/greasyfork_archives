// ==UserScript==
// @name       baby first script /yee
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://*/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5418/baby%20first%20script%20yee.user.js
// @updateURL https://update.greasyfork.org/scripts/5418/baby%20first%20script%20yee.meta.js
// ==/UserScript==

 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
        setTimeout(function(){ \
        $codes["yee"] = \'<img src="http://i.imgur.com/svdNDx7.png" width="66" height="77">\'; \
	}, 1500);'
        ;
 
document.body.appendChild(script);