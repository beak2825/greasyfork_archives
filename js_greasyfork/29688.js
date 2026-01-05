// ==UserScript==
// @name         bv7_password_generator_b
// @namespace    bv7
// @version      0.17
// @description  ge.ge.ge.ge.generate...
// @author       bv7
// @include      *
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29688/bv7_password_generator_b.user.js
// @updateURL https://update.greasyfork.org/scripts/29688/bv7_password_generator_b.meta.js
// ==/UserScript==

(function() {
	'use strict';

	addEventListener('load', function(event) {
		event.preventDefault();
		(function() {
			function PG() {
				var useNums    = GM_getValue('pg_useNums',    true);
				var useCaps    = GM_getValue('pg_useCaps',    true);
				var useLower   = GM_getValue('pg_useLower',   true);
				var useSymbols = GM_getValue('pg_useSymbols', false);
				var length     = GM_getValue('pg_length',     6);
				var password;
				this.generate = function() {
					var chars = '';
					if (useNums)    chars = chars + '0123456789';
					if (useCaps)    chars = chars + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
					if (useLower)   chars = chars + 'abcdefghijklmnopqrstuvwxyz';
					if (useSymbols) chars = chars + '%*)?@#$~';
					password = '';
					for(var i = 0; i < length; i++) password = password + chars[Math.floor(Math.random() * chars.length)];
				};
				this.copy = function() {
					var nodePassword = document.createElement('input');
					//nodePassword.appendChild(document.createTextNode(password));
					nodePassword.setAttribute('type', 'text');
					nodePassword.value = password;
					document.appendChild(nodePassword);
					nodePassword.select();
					document.execCommand("copy");
/*					clipboard.copy({
    					'text/plain': password,
						'text/html': '*'
					});
*/
  				};
			}
			var pg = new PG();
			var nodeTool   = document.createElement('div');
			var nodeButton = document.createElement('button');
			nodeButton.appendChild(document.createTextNode('Generate & copy'));
			nodeButton.addEventListener('click', function(pg) {
				return function(event) {
					event.preventDefault();
					pg.generate();
					pg.copy();
				};
			}(pg));
			nodeTool.appendChild(nodeButton);
			
			document.body.appendChild(nodeTool);
		})();
	});
})();