// ==UserScript==
// @name			Roll20 Fixes
// @namespace		http://statonions.com/
// @version			0.3.21
// @description		Some silly fixes and 'improvements' to Roll20 because I'm impatient and a psycho
// @author			Justice Noon
// @match			https://app.roll20.net/editor/
// @grant			GM_setValue
// @grant			GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/372126/Roll20%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/372126/Roll20%20Fixes.meta.js
// ==/UserScript==
// Changelog: Fix disabled zoom slider

(function() {
    'use strict';

//Features
var TMp = {
	clickShow: true,
	macroHide: true,
	fullButt: true,
	fixPing: "1",
	css: {
		player:	false,
		zoom: false,
		sidebar: false,
		quick: false,
		turns: false,
        error: false,
		macroTok: true,
		bigQuery: true
	},
	pfCustomAttr: true,
	splitTokName: "3",
	toolbarButt: true,
	scaleToks: false,
	statusHQ: false,
	scrollPages: '2',
    perfMode: false,
	noPopouts: false
};
try {
	GM_info;
	var stored = GM_getValue('TMp', 'nah');
	if (stored == 'nah')
		GM_setValue('TMp', JSON.stringify(TMp));
	else {
		var checkVals = function(d, s) {
			for (var k in d) {
				if (typeof d[k] !== typeof s[k])
					s[k] = d[k];
				if (typeof d[k] == 'object')
					s[k] = checkVals(d[k], s[k]);
			};
			return s;
		};
		TMp = checkVals(TMp, JSON.parse(stored));
		GM_setValue('TMp', JSON.stringify(TMp));
	}
	checkLoaded();
}
catch(err) {
	checkLoaded();
}

function checkLoaded(tried) {
    if (!tried) tried = 1;
    try {
            if (Campaign && Campaign.activePage().thegraphics && Campaign.activePage().thegraphics.models[0] && Campaign.activePage().thegraphics.models[0].view && Campaign.activePage().thegraphics.models[0].view.graphic) {
                tried = 69;
				showtime();
			}
            else
                setTimeout(checkLoaded, 1000, tried);
    }
    catch(err) {
        if (++tried < 69)
            setTimeout(checkLoaded, 1000, tried);
        else {
            console.log(err);
			console.log("Couldn't load userscript. Aborting.");
		}
    }
};

function showtime() {
//For *my* players specifically. Activates all css tweaks. I'm too lazy to maintain separate code (in-person touchpad view)
////_.each(TMp.css, (c,i,l) => l[i] = true);TMp.perfMode = true;
	//Create greasemonkey preferences menu
	try {
		GM_info;
		var prefLi = document.createElement('li');
		prefLi.id = 'showfixes';
		var prefSpan = document.createElement('span');
		prefSpan.setAttribute('class', 'pictos');
		prefSpan.appendChild(document.createTextNode('x'));
		prefLi.appendChild(prefSpan);
		prefLi.appendChild(document.createTextNode("\r\n        'Fixes' Preferences\r\n"));
		document.getElementById('helpsite').childNodes[3].childNodes[1].appendChild(prefLi);
		prefLi.addEventListener('click', promptPrefs);
        $("#helpsite").off();

		function promptPrefs(e) {
			e.stopPropagation();
			var finished = false, response, responseVal, responseMod = '', ref = TMp, counter, changeKey;
			while (!finished) {
				counter = 1;
				response = prompt(_.reduce(ref, (memo, v, k) => memo + '\n' + counter++ + ':' + k + '  ::  ' + (_.isObject(v) ? '[' + _.keys(v).length + ' properties]' : v), 'Enter a number:\n0:Back'), 'Enter a number to swap value.');
				responseVal = parseInt(response.replace(/\+/g,'').replace(/-/g,''));
				responseMod = (response.indexOf('+') != -1 ? '+' : (response.indexOf('-') != -1 ? '-' : ''));
				if (/[^0-9+-]+/.test(response) || responseVal == 0 || responseVal > counter) {
					if (ref === TMp) {
						GM_setValue('TMp', JSON.stringify(TMp));
						finished = true;
						alert('Reload to see changes');
					}
					else
						ref = TMp;
				}
				else {
					changeKey = _.keys(ref)[responseVal-1];
					if (_.isObject(ref[changeKey])) {
						if (responseMod == '!')
							_.each(ref[changeKey], (e,i) => {if (typeof e == 'boolean') ref[changeKey][i] = !e});
						else if (responseMod == '+')
							_.each(ref[changeKey], (e,i) => {if (typeof e == 'boolean') ref[changeKey][i] = true});
						else if (responseMod == '-')
							_.each(ref[changeKey], (e,i) => {if (typeof e == 'boolean') ref[changeKey][i] = false});
						else
							ref = ref[changeKey];
					}
					else if (_.isBoolean(ref[changeKey]))
						ref[changeKey] = !ref[changeKey];
					else
						ref[changeKey] = prompt('Enter a new value for ' + changeKey);
				}
			}
		}
	}
	catch (err) {
		console.log('No GM. No need for preferences.');
	}

	window.myLower = Campaign.activePage().thegraphics.models[0].view.graphic.canvas.lowerCanvasEl;
	window.myUpper = Campaign.activePage().thegraphics.models[0].view.graphic.canvas.upperCanvasEl;
	window.myMain = document.getElementById('finalcanvas');

	//Display tokenname on select
	if (TMp.clickShow) {
		var toks = [];
		var muteCallback = function(mutationsList) {
			if (currentcontexttarget) {
				for(var mutation of mutationsList) {
					if (!_.isEmpty(mutation.addedNodes)) {
						let cct = currentcontexttarget.canvas;
						let cctIt = cct.lastRenderedObjectWithControlsAboveOverlay.model.attributes;
						if (!cctIt.showname) {
							cctIt.showname = true;
							toks.push([cctIt.page_id, cctIt.id]);
						}
						cct._objects.push(cct._objects.splice(cct._objects.indexOf(cct.lastRenderedObjectWithControlsAboveOverlay), 1)[0]);
						currentcontexttarget.canvas.renderAll && currentcontexttarget.canvas.renderAll();
					}
					else if (!_.isEmpty(mutation.removedNodes)) {
						_.each(toks, tok => {if (tok[0] == Campaign.activePage().id) _.find(Campaign.activePage().thegraphics.models, tokk => tokk.attributes.id == tok[1]).attributes.showname = false});
						toks = [];
						currentcontexttarget.canvas.renderAll && currentcontexttarget.canvas.renderAll();
						Campaign.activePage().reorderByZ();
					}
				}
			}
		};
		var observer = new MutationObserver(muteCallback);
		observer.observe(document.getElementById('editor-wrapper'), {childList: true});
	}

	if (TMp.css.macroTok) {
		var macroTokCallback = function(mutationsList) {
			for (var mutation of mutationsList) {
                _.delay((mutation) => {
                    let cctIt = currentcontexttarget.canvas.lastRenderedObjectWithControlsAboveOverlay.model.attributes;
                    if (mutation.target.style.display == 'block' && cctIt.gmnotes != 'blank' && cctIt.gmnotes != '%3Cp%3Eblank%3C/p%3E')
                        _.each(document.getElementsByClassName('tokenactions')[0].firstElementChild.children, ob => ob.setAttribute('data-blank', 'false'));
                }, (typeof currentcontexttarget == 'undefined' ? 1000 : 0), mutation);
			}
		};
		var macroObserver = new MutationObserver(macroTokCallback);
		macroObserver.observe(document.querySelector('.mode.tokenactions'), {attributeFilter: ['style']});
	}

	//Allow Macros to be hidden
	if (TMp.macroHide) {
		var toggleMacro = document.createElement('div');
		toggleMacro.setAttribute('class', 'macrobox');
		var toggleButton = document.createElement('button');
		toggleButton.setAttribute('class', 'btn');
		toggleButton.appendChild(document.createTextNode('Show/Hide'));
		toggleButton.id = 'toggleMacros';
		toggleMacro.appendChild(toggleButton)
		//macrobar is defined by default
		macrobar.appendChild(toggleMacro);
		document.getElementById('toggleMacros').addEventListener('click', () => macrobar.style.left = (macrobar.style.left == '' ? (macrobar.offsetWidth * -1 + 100) + 'px' : ''));
	}

	//Create fullscreen button
	if (TMp.fullButt) {
		var fullScreenLi = document.createElement('li');
		fullScreenLi.setAttribute('tip', 'Toggle Fullscreen');
		fullScreenLi.id = 'fullscreener';
		var fullScreenSpan = document.createElement('span');
		fullScreenSpan.setAttribute('class', 'pictos');
		fullScreenSpan.appendChild(document.createTextNode('`'));
		fullScreenLi.appendChild(fullScreenSpan);
		floatingtoolbar.childNodes[1].appendChild(fullScreenLi);
		fullScreenLi.addEventListener('click', toggleFullScreen);

		function toggleFullScreen() {
			var doc = window.document;
			var docEl = doc.documentElement;

			var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
			var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

			if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
			}
			else {
			cancelFullScreen.call(doc);
			}
		}
	}
	//Create Floating Toolbar button
	if (TMp.toolbarButt) {
		var ToolBar = _.filter(Campaign.players.get(d20_player_id).macros.models, m => m.attributes.name.indexOf('ToolBar') > -1);
		if (_.isUndefined(ToolBar))
			ToolBar = _.filter(_.union(..._.map(Campaign.players.models, m => m.macros.models)), m => {return m.visibleToCurrentPlayer() && m.attributes.name.indexOf('ToolBar') > -1});
		_.each(ToolBar, tb => {
			var actions = tb.attributes.action.split('\n');
			var toolBarLi = document.createElement('li');
			toolBarLi.setAttribute('tip', 'Additional Macros');
			toolBarLi.id = 'ToolBar' + (tb.attributes.name == ToolBar ? tb.id : tb.attributes.name.replace('ToolBar',''));
			toolBarLi.setAttribute('style', 'display: flex; justify-content: center; align-items: center;');
			for (var k = 0, thisAction, thisSpan, thisLi, thisA, thisODiv; k < actions.length; k++) {
				thisAction = actions[k].split('||');
				thisSpan = document.createElement('span');
				thisSpan.setAttribute('class', 'pictos');
                thisSpan.setAttribute('style', 'left: -11rem;');
				//Make sure character is supported and won't unclip out of side
				var canvas = document.createElement('canvas').getContext('2d');
				canvas.font = '22px Pictos';
				var width = canvas.measureText(thisAction[0]);
				if (width.width > 31)
					thisAction[0] = _.compact([...thisAction[0].replace(/[\u200B-\u200D\uFEFF]/g, '')]).join(' ');
				thisSpan.appendChild(document.createTextNode(thisAction[0]));
				if (k == 0) {
					toolBarLi.appendChild(thisSpan);
					var thisDiv = document.createElement('div');
					thisDiv.setAttribute('class', 'submenu');
					var thisUl = document.createElement('ul');
				}
				else {
					thisLi = document.createElement('li');
					thisA = document.createElement('a');
                    if (thisAction[2].indexOf('j:') > -1) {
                     thisA.setAttribute('href', '!');
                     thisA.onclick = eval('() => {' + thisAction[2].substr(2) + '}');
                    }
                    else
                        thisA.setAttribute('href', thisAction[2]);
					thisA.appendChild(thisSpan);
					thisODiv = document.createElement('div');
					thisODiv.appendChild(document.createTextNode(thisAction[1]));
					thisA.appendChild(thisODiv);
					thisLi.appendChild(thisA);
					thisUl.appendChild(thisLi);
				}
			}
			thisDiv.appendChild(thisUl);
			thisDiv.setAttribute('style', 'top: -' + k*20 + 'px !important;');
			toolBarLi.appendChild(thisDiv);
			floatingtoolbar.childNodes[1].appendChild(toolBarLi);
		});
	}

	//Fix Pings
	if (TMp.fixPing != "0") {
		JSON.parse2 = JSON.parse;
		JSON.parse = function(e) {
			var intercept = JSON.parse2(e), api = false;
			if (intercept.type == 'mapping') {
				if (_.isUndefined(intercept.currentLayer))
                    api = true;
                if (TMp.fixPing == "2" && intercept.player == "api") {
                    if (is_gm)
                        spoofPing(intercept);
                    Object.assign(intercept, {scrollto: false, left: -100, top: -100});
                }
                intercept.currentLayer = 'objects';
                if (intercept.pageid != Campaign.activePage().id || (api && intercept.player != "api" && intercept.player != d20_player_id))
                    Object.assign(intercept, {scrollto: false, left: -100, top: -100});
			}
			return intercept;
		};
		function spoofPing(old) {
			var paddingOffset = [], currentCanvasOffset = [];
			var canvasZoom = Math.round(document.getElementById('finalcanvas').getContext('2d').getTransform().a * 10) / 10;
			var canvasWidth = document.getElementById('finalcanvas').clientWidth, canvasHeight = document.getElementById('finalcanvas').clientHeight;
			var scaledTop = document.getElementById('editor-wrapper').scrollTop / canvasZoom, scaledLeft = document.getElementById('editor-wrapper').scrollLeft / canvasZoom;
			var pageWidth = Campaign.activePage().attributes.width * 70, pageHeight = Campaign.activePage().attributes.height * 70;
			var padding = 125;
			if (scaledLeft < padding)
				(paddingOffset[0] = padding - scaledLeft, currentCanvasOffset[0] = 0);
			else {
				if (pageWidth / canvasZoom - scaledLeft - canvasWidth / canvasZoom + padding < 0)
					(paddingOffset[0] = pageWidth / canvasZoom - scaledLeft - canvasWidth / canvasZoom + padding, currentCanvasOffset[0] = scaledLeft - padding + paddingOffset[0]);
				else
					(paddingOffset[0] = 0, currentCanvasOffset[0] = scaledLeft - padding);
			}
			if (scaledTop < padding)
				(paddingOffset[1] = padding - scaledTop, currentCanvasOffset[1] = 0);
			else {
				if (pageHeight / canvasZoom - scaledTop - canvasHeight / canvasZoom + padding < 0)
					(paddingOffset[1] = pageHeight / canvasZoom - scaledTop - canvasHeight / canvasZoom + padding, currentCanvasOffset[1] = scaledTop - padding + paddingOffset[1]);
				else
					(paddingOffset[1] = 0, currentCanvasOffset[1] = scaledTop - padding);
			}
			//var m = {left: old.left, top: old.top};
            var pos = {left: canvasZoom * (old.left - currentCanvasOffset[0]) + paddingOffset[0], top: canvasZoom * (old.top - currentCanvasOffset[1]) + paddingOffset[1]};
			var evt = new MouseEvent('mousedown', {bubbles: true, cancelable: true, composed: true, buttons: 1, shiftKey: true, clientX: pos.left, clientY: pos.top});
            var maskedArr = [];
           _.each(Campaign.activePage().thegraphics.models, m => {
               if (m.attributes.layer == 'objects' && Math.abs(m.attributes.top - old.top) <= m.attributes.height / 2 && Math.abs(m.attributes.left - old.left) <= m.attributes.width / 2) {
                   //debugger;
                   maskedArr.push([m.id, m.view.graphic.selectable]);
                   m.view.graphic.selectable = false;
               }
           });
            _.delay((e, mask) => {window.myUpper.dispatchEvent(e); _.each(mask, m => Campaign.activePage().thegraphics._byId[m[0]].view.graphic.selectable = m[1]);}, 1000, new MouseEvent('mouseup', {bubbles: true, cancelable: true, composed: true, buttons: 1, clientX: 1, clientY: 1}), maskedArr);
            return !(window.myUpper.dispatchEvent(evt));
		}
	}

	//CSS override block
	if (_.contains(TMp.css, true) || TMp.toolbarButt || TMp.statusHQ) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '';
		//Remove player names/ icons
		if (TMp.css.player)
			style.innerHTML += '.player.ui-droppable {display: none;} ';
		//Remove Zoom Slider
		if (TMp.css.zoom)
			style.innerHTML += '#zoomclick {display:none;} ';
		//Remove sidebar show/ hide button
		if (TMp.css.sidebar)
			style.innerHTML += '#sidebarcontrol {display: none;} ';
		//Increase quickmenu sizes
		if (TMp.css.quick)
			style.innerHTML += '.sheet-roll-cell a{padding:.5em !important;} ';
		//Permanently hide turn order
		if (TMp.css.turns)
			style.innerHTML += 'div.ui-dialog[style*="width: 160px;"] {display: none !important;} ';
        //Hides the connection error box
		if (TMp.css.error)
			style.innerHTML += '#connectionerror {display: none !important;} ';
		//Query window input box should size to the box size
		if (TMp.css.bigQuery)
			style.innerHTML += '.ui-dialog-content.ui-widget-content > p > strong + input {width: 100% !important; width: -moz-available !important; width: -webkit-fill-available !important; width: fill-available !important;} ';
		//Hide macroTokens by default
		if (TMp.css.macroTok)
			style.innerHTML += 'button[data-type="macro"]:not([data-blank="false"]) {display: none !important;} ';
		if (TMp.statusHQ)
			style.innerHTML += '#radial-menu .markermenu .markericon {background-image: url(https://files.catbox.moe/08tmts.svg) !important;} ';
		//Fills Toolbar buttons to their spaces
			style.innerHTML += '.submenu > ul > li > a {display: inline-block; width: 100%; height: 100%; color: grey; text-align: center;} .submenu > ul > li > a:hover {text-decoration: none;} .submenu > ul > li > a > .pictos {position: relative; left: -6rem; top: .1rem;} .submenu > ul > li > a > div {position: absolute; left: 3rem; top: .5rem;}';
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	//Popouts and/ or dialogs create browser-behavior tabs instead of forced popups. 1 for just characters, 2 for everything.
	if (TMp.noPopouts) {
		unsafeWindow._open = unsafeWindow.open;
		if (TMp.noPopouts == 1)
			unsafeWindow.open = function(a,b,c) {if (a == "/editor/popout") return unsafeWindow._open(a, b); else return unsafeWindow._open(a,b,c);};
		else
			unsafeWindow.open = function(a,b,c) {return unsafeWindow._open(a, b);};
	}

	//Character sheets display custom attributes as name
	if (TMp.pfCustomAttr) {
		function cssInjection(charId) {
			var list = [1,2,3,10,11,12];
			var head = 'div.dialog.characterdialog[data-characterid=' + charId + '] {', foot = '';
			_.each(list, function(cK) {
				cK = 'customa' + cK;
				let val = {};
				if (!_.isUndefined(val = _.find(Campaign.characters._byId[charId].attribs.models, at => at.attributes.name == cK + '-name')))
					head += `--${cK}: "${val.attributes.current}"; `
				foot += `input[title="@{buff_${cK}-total}"] + span {visibility: hidden; top: -1.2rem;} input[title="@{buff_${cK}-total}"] + span::after {content: var(--${cK}, "${cK}"); visibility: visible; display: block;} `
			});
			return [head + '} ', foot];
		}
		function newShow(that) {
			var customOver;
			var modCss = cssInjection(that.model.attributes.id);
			if (_.isNull(document.getElementById('customOver'))) {
				customOver = document.createElement('style');
				customOver.type = 'text/css';
				customOver.id = 'customOver';
				customOver.innerHTML = modCss[1];
			}
			else {
				customOver = document.getElementById('customOver');
			}
			customOver.innerHTML += (modCss[0].indexOf('{}') > -1 ? '' : modCss[0]);
			if (that.childWindow) {
				_.delay(function() {customOver.innerHTML = modCss.join(' '); that.childWindow.document.getElementsByTagName('head')[0].appendChild(customOver)}, 4000);
			}
			else
				document.getElementsByTagName('head')[0].appendChild(customOver);
		};

		_.each(Campaign.characters.models, ch => {ch.view.showDialog2 = ch.view.showDialog; ch.view.showDialog = function(e, t) {this.showDialog2(e, t); newShow(this)}});
		_.each(Campaign.characters.models, ch => {ch.view.showPopout2 = ch.view.showPopout; ch.view.showPopout = function(e, t) {this.showPopout2(e, t); newShow(this)}});
		//Bookmarklet check then process active child windows
		if (typeof unsafeWindow == 'undefined')
			_.each(window.allChildWindows, win => {newShow(Campaign.characters._byId[win.document.getElementsByClassName('dialog characterdialog')[0].getAttribute('data-characterid')].view)});
	}

	//Tokens auto split their name to multiple lines
	if (TMp.splitTokName != "0") {
        var newFill = function(x, y, w, h) {
            if (this.font != 'bold 14px Arial' || this.fillStyle.replace(/ /g,'').indexOf('rgba(255,255,255,0.5') == -1)
                this.fillRect2(x, y, w, h);
            else if (this.fillText != this.newText)
                this.fillText = this.newText;
            //Note to self: Find where they're resetting this and stop it. A lot of wasted cycles for this.
        };
        var newText = function(t, x, y, m) {
            if (this.font != 'bold 14px Arial' || this.fillStyle != '#000000')
                this.fillText2(t, x, y, m);
            else if (this.canvas == window.myUpper)
                return;
            else {
                var g = 14, r = y - 22, n = m, max = parseInt(TMp.splitTokName), forced, tmpFix = 3;
                var texes = t.toString().split(' ');
                for (var k = 0; k < texes.length; k++) {
                    while ((this.measureText(texes[k] + ' ' + texes[k+1]).width < r*2 || k >= max - 1) && k+1 < texes.length ) {
                        texes[k] += ' ' + texes[k+1];
                        texes.splice(k+1, 1);
                    }
                    if (texes[k].indexOf('\\n') > -1) {
                        forced = texes[k].split('\\n');
                        texes[k] = forced.shift();
                        texes.splice(k+1, 0, ...forced);
                    }
                    texes[k] = texes[k].replace(/_/g, ' ');
                    n = this.measureText(texes[k]).width;
                    this.fillStyle = 'rgba(255, 255, 255, 0.50)';
                    this.fillRect2(-1 * Math.floor((n + 6) / 2), r + 8 + (g+6)*k, n + 6, g + 6);
                    this.fillStyle = 'rgb(0,0,0)';
                    this.fillText2(texes[k], x, y + tmpFix + (g+6)*k, n);
                }
            }
		};
        _.each([window.myMain, window.myUpper, window.myLower], function(c) {
            let can = c.getContext('2d');
            can.fillRect2 = can.fillRect;
            can.fillRect = newFill;
            can.newFill = newFill;
            can.fillText2 = can.fillText;
            can.fillText = newText;
            can.newText = newText;
        });
	}

	if (false && (TMp.scaleToks || TMp.statusHQ)) {
		var newRect = function(x, y, w, h) {
			var rgba = /rgba\( ?(\d*) ?, ?(\d*) ?, ?(\d*) ?, ?((?:\d|\.)*) ?\)/.exec(this.fillStyle), fillStr, offset = 24;
			if (rgba && parseFloat(rgba[4]).toFixed(2) == "0.75" && (Campaign.tokendisplay.bar3_rgb + '' == (fillStr = rgba[1] + ',' + rgba[2] + ',' + rgba[3]) || (Campaign.tokendisplay.bar2_rgb + '' == fillStr && _.isNumber(offset -= 12)) || (Campaign.tokendisplay.bar1_rgb + '' == fillStr && _.isNumber(offset -= 24)))) {
				var scale = (x - 3) * -1 / 35;
				if (scale != 1) {
					h = scale * 8;
					y = (y - offset + 20) + ((offset - 20) * scale);
					x = (x - 3) + (3 * scale);
					this.lineWidth = scale;
					w = Math.floor((70 * scale - 6 * scale) * (w / (70 * scale - 6)));
				}
			}
			this.rect2(x, y, w, h);
		};
		var newImage = function() {
			if (arguments[7] && arguments[7] == 21 && (arguments[0].src == 'https://files.catbox.moe/08tmts.svg' || arguments[0].src == 'https://app.roll20.net/images/statussheet.png' || arguments[0].src == 'https://app.roll20.net/images/statussheet_small.png')) {
				if (TMp.statusHQ) {
					if (arguments[0].src != 'https://files.catbox.moe/08tmts.svg')
						arguments[0].src = 'https://files.catbox.moe/08tmts.svg';
					arguments[3] = 24;
					arguments[4] = 24;
				}
				if (false) {
					var scaleO, scaleR, scaleH, scaleD, it, scale, k, j, pairs;
					switch(Campaign.get('markers_position')) {
						case 'bottom':
							scaleO = arguments[5];
							scaleR = arguments[6] + 19;
							it = (scaleR - scaleO);
							scale = scaleR / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = scaleR - 10 * scale;
							scaleH = scaleO + 16 * pairs[0] * scale + 22 * pairs[1] * scale;
							break;
						case 'left':
							scaleO = -(arguments[5]);
							scaleR = -(arguments[6] + 19);
							it = (scaleO - scaleR);
							scale = scaleO / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = -scaleR - 10 * scale + 16 * pairs * scale[0] + 22 * pairs[1] * scale;
							scaleH = -scaleO + 16 * pairs[0] * scale + 22 * pairs[1] * scale;
							break;
						case 'right':
							scaleO = arguments[5] + 18;
							scaleR = -(arguments[6] + 19);
							it = (scaleO - scaleR);
							scale = scaleO / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = -scaleR - 10 * scale + 16 * pairs[0] * scale + 22 * pairs[1] * scale;
							scaleH = scaleO - 18 * scale;
							break;
						default:
							debugger;
							scaleO = arguments[5];
							scaleR = -(arguments[6] - 1);
							it = (scaleR - scaleO);
							scale = scaleR / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = 10 * scale - scaleR;
							scaleH = scaleO + 16 * pairs[0] + 22 * pairs[1] - 16 * pairs[0] * scale - 22 * pairs[1] * scale;
					}
					arguments[5] = scaleH;
					arguments[6] = scaleD - 9 * scale;
					arguments[7] = 21 * scale;
					arguments[8] = 21 * scale;
				}
			}
			this.drawImage2(...arguments);
		}
		_.each([window.myMain, window.myUpper, window.myLower], function(c) {
			let can = c.getContext('2d');
			if (TMp.scaleToks) {
				can.rect2 = can.rect;
				can.rect = newRect;
			}
			can.drawImage2 = can.drawImage;
			can.drawImage = newImage;
		});

	}

	//Makes mousewheel scroll page listing at top and adds custom speed to it
	if (TMp.scrollPages != '0' && is_gm) {
		var scrollHorizontally = function(e) {
			e = window.event || e;
			document.getElementById('page-toolbar').children[1].scrollLeft -= (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * (parseFloat(TMp.scrollPages) * 40));
			e.preventDefault();
		}
        document.getElementById('page-toolbar').children[1].addEventListener("wheel", scrollHorizontally, false);
	}

	//Disables anti-aliasing on canvas if you need the performance
    if (TMp.perfMode) {
		_.each([window.myMain, window.myUpper, window.myLower], function(c) {
			c.getContext('2d').imageSmoothingEnabled = false;
		});
    }
}

})();