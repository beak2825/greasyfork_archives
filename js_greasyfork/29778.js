// ==UserScript==
// @name         bv7_password_generator
// @namespace    bv7
// @version      1.0
// @description  ge.ge.ge.ge.generate...
// @author       bv7
// @include      *
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29778/bv7_password_generator.user.js
// @updateURL https://update.greasyfork.org/scripts/29778/bv7_password_generator.meta.js
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
					nodePassword.setAttribute('type', 'text');
					nodePassword.value = password;
					document.body.appendChild(nodePassword);
					nodePassword.select();
					document.execCommand("copy");
					nodePassword.remove();
  				};
  				this.generateCopy = function() {
					this.generate();
					this.copy();
				};
				this.createNode = function() {
					var node = document.createElement('div');
					node.setAttribute('class', 'bv7tool');
					var nodeAncor = document.createElement('div')
					nodeAncor.appendChild(document.createTextNode('Password generator...'));
					node.appendChild(nodeAncor);
					var nodeContent = document.createElement('div');
					var nodeButton = document.createElement('button');
					nodeButton.appendChild(document.createTextNode('Password generate & copy'));
					nodeButton.addEventListener('click', function(me) {
						return function(event) {
							event.preventDefault();
							me.generate();
							me.copy();
						};
					}(this));
					nodeContent.appendChild(nodeButton);
					node.appendChild(nodeContent);
					return node;
				};
			}
			var pg = new PG();
			var node = document.createElement('style');
			node.setAttribute('type', 'text/css');
			node.appendChild(document.createTextNode(
				'.bv7tool{background-color:green;padding:5px;border-radius:15px}' +
				'.bv7tool:hover>*:first-child,.bv7tool>*:nth-child(2){display:none;}' +
				'.bv7tool:hover>*:nth-child(2){display:block;}'
			));
			document.head.appendChild(node);
			var nodeTool = document.createElement('div');
			nodeTool.setAttribute('style', 'position:absolute;');
			var nodeTool2 = document.createElement('div');
			nodeTool2.setAttribute('class', 'bv7tool');
			node = document.createElement('div');
			node.appendChild(document.createTextNode('...'));
			nodeTool2.appendChild(node);
			node = document.createElement('div');
			node.appendChild(pg.createNode())
			nodeTool2.appendChild(node);
			nodeTool.appendChild(nodeTool2);
			document.body.appendChild(nodeTool);
		})();
	});
})();