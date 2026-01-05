// ==UserScript==
// @name        --- iWings --- Wings.io Mods / Script
// @namespace   wingsiomodrawr
// @description Auto Respawn + Autofire + Dark Theme / Night Mode + Macros / Shortcuts + Hide Leaderboard & Fireflies + More!
// @version     15
// @author      condoriano
// @icon        http://i.imgur.com/pECyZov.png
// @include     http://wings.io/*
// @include     https://wings.io/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20021/---%20iWings%20---%20Wingsio%20Mods%20%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/20021/---%20iWings%20---%20Wingsio%20Mods%20%20Script.meta.js
// ==/UserScript==

(function() {

	if(window.top != window.self || (window.iWings && window.iWings.enabled)) { if(window.iWings && window.iWings.versions) window.iWings.versions.push('script v15'); return; }
	if(!window.iWings) window.iWings = { enabled: true, versions: ['script v15'] }; var isFirefox = /Firefox/.test(navigator.userAgent);

	if(isFirefox) {
		var scriptChanged = false;
		window.addEventListener('beforescriptexecute', function(e) {
			if(e.target.innerHTML.length > 100000 && !scriptChanged) {
				e.preventDefault();
				e.stopPropagation();
				scriptChanged = true;
				e.target.remove();
				var oriScript = e.target.innerHTML;
				var httpReq = new XMLHttpRequest();
				httpReq.open('GET', 'http://greasyfork.org/scripts/20020-wingsiomod/code/wingsiomod.js', false);
				httpReq.onreadystatechange = function() {
					if(httpReq.readyState == 4 && httpReq.status == 200) {
						var modScript = httpReq.responseText.trim().replace(/^function.*{|}$/g, '');
						var finalScript = combineScript(oriScript, modScript);
						var elem = document.createElement('script');
						elem.innerHTML = finalScript;
						document.body.appendChild(elem);
					}
				};
				httpReq.send();
			}
			if(scriptChanged) window.removeEventListener(e.type, arguments.callee, true);
		}, true);
	}
	else {
		var httpReq = new XMLHttpRequest();
		httpReq.open('GET', 'http://wings.io/', true);
		httpReq.onreadystatechange = function() {
			if(httpReq.readyState == 4 && httpReq.status == 200) {
				var tempDOM = document.createElement('div');
				tempDOM.innerHTML = httpReq.responseText;
				for(var i = 0; i < tempDOM.children.length; i++) {
					if(tempDOM.children[i].tagName.toUpperCase() == 'SCRIPT' && tempDOM.children[i].innerHTML.length > 100000) {
						var oriScript = tempDOM.children[i].innerHTML;
						var httpReq2 = new XMLHttpRequest();
						httpReq2.open('GET', 'http://greasyfork.org/scripts/20020-wingsiomod/code/wingsiomod.js', true);
						httpReq2.onreadystatechange = function() {
							if(httpReq2.readyState == 4 && httpReq2.status == 200) {
								var modScript = httpReq2.responseText.trim().replace(/^function.*{|}$/g, '');
								var finalScript = combineScript(oriScript, modScript);
								tempDOM.children[i].innerHTML = finalScript;
								document.open();
								document.write(tempDOM.innerHTML);
								document.close();
							}
						};
						httpReq2.send();
						break;
					}
				}
			}
		};
		httpReq.send();
	}

	function combineScript(a, b) {
		a = a.replace('"#62bae2"', 'handleColors("#62bae2")'); // solid bg when 'disable gradient' enabled
		a = a.replace(/("rgba\("\+parseInt\(.\)\+",145,202,1\.0\)")/, 'handleColors($1)'); // sky
		a = a.replace(/("rgba\("\+parseInt\(.\)\+",231,252,1\.0\)")/, 'handleColors($1)'); // sky
		a = a.replace(/("rgba\(9,188,255,1\.0\)")/g, 'handleColors($1)'); // water lv 1
		a = a.replace(/("rgba\(8,164,254,1\.0\)")/g, 'handleColors($1)'); // waterlv 2
		a = a.replace(/("rgba\(7,142,252,1\.0\)")/g, 'handleColors($1)'); // waterlv 3
		a = a.replace(/("rgba\(0,132,232,1\.0\)")/g, 'handleColors($1)'); // waterlv 4
		a = a.replace(/("rgba\(0,90,190,1\.0\)")/g, 'handleColors($1)'); // waterlv 5
		a = a.replace('["wing",770,203,27,27,.5,.5]', '["wing",770,203,27,27,.5,.5],["none",0,0,1,1,1,1]'); // add empty sprite array
		a = a.replace('"cannonshoot",', '"cannonshoot",ZzZz="",'); // add empty sound array
		a = a.replace(/trailEffect\(\),(.)=(..)/, 'trailEffect(),$1=document.getElementById("optnNoFireflies").checked?ZzZz:$2'); // if enabled, play empty sound
		a = a.replace(/(.)\=(.)\.frames\.wing/, '$1=document.getElementById("optnNoFireflies").checked?$2.frames.none:$2.frames.wing'); // if enabled, draw empty sprite // b=p.frames.wing
		a = a.replace(/(.\.width=.);(.\.height=.);(.=.\+"px)/, '$1;$2+30;$3'); // fix leaderboard cut off at bottom // c.width=V;c.height=L;k=h+"px
		a = a.replace(/(,.\.height\=.),/, '$1+30,'); // fix 'you' label cut off at bottom // ,s.height=b,
		a = a.replace(/this\.drawLeaderboard\=function\((a)\){/, 'this.drawLeaderboard=function($1){if(document.getElementById("optnNoLeaderboard").checked)return;'); // if enabled, hide leaderboard // this.drawLeaderboard=function(a){
		a = a.replace(/(.\.drawImage\(.,.),(.\+5\))/, '$1,document.getElementById("optnNoLeaderboard").checked?10:$2'); // if enabled, move 'you' label to top // a.drawImage(t,e,k+5)
		a = a.replace(/\(function\((.....)\){/i, '(function($1){' + b);
		return a;
	}

})();
