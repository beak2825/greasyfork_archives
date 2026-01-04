// ==UserScript==
// @name         Roll20 Stream Deck Integration
// @namespace    http://statonions.com
// @version      0.0.3
// @description  Let's not get banned!
// @author       Justice Noon
// @match        https://app.roll20.net/editor/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/391327/Roll20%20Stream%20Deck%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/391327/Roll20%20Stream%20Deck%20Integration.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//Connection nonsense. Maybe there is a better way to swap hands.
	var pageReady = setInterval(() => {
		if (document.readyState == 'complete' && document.getElementById('exitroll20game')) {
			var importButton = document.createElement('button');
			Object.assign(importButton, {classList: ['btn'], innerHTML: 'SD', id: 'importsd'});
			importButton.addEventListener('click', () => connectElgatoStreamDeckSocket(...JSON.parse(prompt('Current clipboard'))));
			document.getElementById('exitroll20game').parentNode.insertBefore(importButton, document.getElementById('exitroll20game').nextElementSibling);
			clearInterval(pageReady);
		}
	}, 2000);

	//Intercept selected
	d21.token_editor.showRadialMenu = _.debounce((e,t,n) => {
		if (watchAction.lastSelect != e) {
			watchAction.lastSelect = e;
			watchAction.UpdateSelect();
		}
		d21.token_editor.do_showRadialMenu(e,t,n);
	}, 100);

	function toDataURL(src, callback, outputFormat) {
		var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function() {
			var canvas = document.createElement('CANVAS');
			var ctx = canvas.getContext('2d');
			var dataURL;
			canvas.height = this.naturalHeight;
			canvas.width = this.naturalWidth;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			callback(dataURL);
		};
		img.src = src;
		if (img.complete || img.complete === undefined) {
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src = src;
		}
	}

	var websocket = null;
	var pluginUUID = null;
	var globalSettings = {};

	var DestinationEnum = Object.freeze({"HARDWARE_AND_SOFTWARE":0, "HARDWARE_ONLY":1, "SOFTWARE_ONLY":2});

	//awaitSettings is context: {callback:, args:} and is invoked with current settings as the first argument
	var timer, awaitSettings = [], awaitGlobalSettings = [];

	var manageAction = {

		onSendToPlugin : function(context, payload) {
			var updatedSettings = {};
			//updatedSettings[payload.key] = payload.value;
			if (payload.key == 'customVars') {
				updatedSettings.customVars = payload.value.split('\n').reduce((a,c) => {var v = c.split(','); a[v[0]] = v[1]; return a; }, {});
				this.SetGlobalSettings(updatedSettings, true);
			}
		},

		onDidReceiveGlobalSettings : function(settings) {
			globalSettings = Object.assign({}, settings);
			awaitGlobalSettings.forEach((o) => { o.callback.call(manageAction, settings, o.args); });
			awaitGlobalSettings = [];
		},

		SetGlobalSettings : function(settings, append) {
			if (append) {
				websocket.send(JSON.stringify({event: 'getGlobalSettings', context: pluginUUID}));
				awaitGlobalSettings.push({callback: (a, b) => {manageAction.SetGlobalSettings(Object.assign(a, b))}, args: settings});
			}
			else {
				var json = {
					"event": "setGlobalSettings",
					"context": pluginUUID,
					"payload": settings
				};

				websocket.send(JSON.stringify(json));
			}
		}
	};

	var watchAction = {

		type : "com.statonions.r20Deck.watch",

		watchList : {},

		selectList : [],

		lastSelect : undefined,

		onKeyDown : function(context, settings, coordinates, userDesiredState) {

			timer = setTimeout(function () {
				var updatedSettings = {};
				updatedSettings["keyPressCounter"] = -1;

				watchAction.SetSettings(context, updatedSettings);
				watchAction.SetTitle(context, 0);
			},1500);
		},

		onKeyUp : function(context, settings, coordinates, userDesiredState) {

			clearTimeout(timer);

			var onPressString = '';
			if(settings != null && settings.hasOwnProperty('onPress')) {
				onPressString = settings["onPress"];
			}
			if (onPressString.indexOf('{selected|') > -1 && watchAction.lastSelect && !watchAction.lastSelect.active && watchAction.lastSelect.model.character)
				onPressString = onPressString.replace(/{selected\|/g, '{' + watchAction.lastSelect.model.character.attributes.name + '|');
			d21.textchat.doChatInput(onPressString);
		},

		onTitleParametersDidChange : function(context, settings) {
			this.ParseTitle(context, settings);
		},

		onSendToPlugin : function(context, payload) {
			var updatedSettings = {};
			if (payload.key.indexOf('rdio') > -1)
				updatedSettings.format = payload.selection.toString();
			else
				updatedSettings[payload.key] = payload.value;

			if (payload.key != 'onPress') {
				awaitSettings[context] = {callback: (a) => {watchAction.ParseTitle(context, Object.assign(a, updatedSettings)); watchAction.SetSettings(context, Object.assign(a, updatedSettings));}};
				websocket.send(JSON.stringify({event: 'getSettings', context: context}));
			}
			else
				this.SetSettings(context, updatedSettings, true);
		},

		onWillAppear : function(context, settings, coordinates) {
			if(settings != null && settings.hasOwnProperty('template'))
				this.ParseTitle(context, settings);
			else
				this.SetTitle(context, '?');
		},

		onPropertyInspectorDidAppear : function(context, action) {
			var json = {
				'action': action,
				'event': 'sendToPropertyInspector',
				'context': context,
				'payload': 'wakeup'
			};
			websocket.send(JSON.stringify(json));
		},

		onDidReceiveSettings : function(context, action, settings) {
			if (awaitSettings[context]) {
				awaitSettings[context].callback.call(watchAction, settings, awaitSettings[context].args);
				delete awaitSettings[context];
			}
		},

		onWatchChange : function(attrObj) {
			var context = this;
			websocket.send(JSON.stringify({event: 'getSettings', context: context}));
			awaitSettings[context] = {callback: (a) => watchAction.ParseTitle(context, a)};
			//Campaign.characters._byId["-L835O27zGLdt2hUVHF6"].attribs._byId["-L835NTtLYwALT-YAVWz"].on('change', test, 'temp1');

		},

		UpdateSelect : function() {
			_.each(watchAction.selectList, c => {
				websocket.send(JSON.stringify({event: 'getSettings', context: c}));
				awaitSettings[c] = {callback: (a) => watchAction.ParseTitle(c, a)};
			});
		},

		ParseTitle : function(context, settings) {
			var template = settings.template || '';
			//For global variables. To do later
			//if (globalSettings && /%\S%/.test(template))

			var attrReg = /@{(?:([^{}|]*)\|)?([^{}|]*)(?:\|([^{}|]*))?}/g, newWatches = [], attrs, lastChar;
			while((attrs = [...template.matchAll(attrReg)]).length > 0) {
				if (!watchAction.watchList[context])
					watchAction.watchList[context] = [];
				_.each(attrs, a => {
					var newVal, charObj, attrObj, attrId;
					if (a[1]) {
						if (a[1].charAt(0) == '-')
							charObj = Campaign.characters._byId[a[1]];
						else if (a[1] == 'selected') {
							if (watchAction.lastSelect) {
								if (typeof watchAction.lastSelect.model.attributes[a[2]] != 'undefined')
									charObj = watchAction.lastSelect.model;
								else
									charObj = watchAction.lastSelect.model.character;
							}
							if (!watchAction.selectList.includes(context))
								watchAction.selectList.push(context);
						}
						else
							charObj = Campaign.characters.find(o => o.attributes.name == a[1]);
					}
					charObj = charObj || lastChar;
					if (typeof charObj != 'undefined') {
						lastChar = charObj;
						if (charObj.attributes.type == 'image')
							attrObj = charObj;
						else if (a[2].charAt(0) == '-')
							attrObj = charObj.attribs._byId[a[2]];
						else if (a[2].indexOf('[') > -1) {
							var searcher = a[2].match(/([^\[]*)\[([^\]]*)\](.*)/);
							var repRowId = charObj.attribs.find(o => {return o.attributes.name.indexOf(searcher[1]) > -1 && o.attributes.current == searcher[2]});
							if (repRowId)
								repRowId = repRowId.attributes.name.replace(searcher[1],'').replace('_name','');
							attrObj = charObj.attribs.find(o => {return o.attributes.name == searcher[1] + repRowId + searcher[3]});
						}
						else
							attrObj = charObj.attribs.find(o => o.attributes.name == a[2]);
						if (!attrObj) {
							console.log("Couldn't find " + a[0]);
							template = template.replace(a[0], (settings.format == 'math' ? '0' : ''));
						}
						else {
							attrId = attrObj.attributes.id;
							newWatches.push(attrId);
							if (!watchAction.watchList[context].includes(attrId))
								attrObj.on('change', watchAction.onWatchChange, context);
							if (attrObj == charObj)
								template = template.replace(a[0], attrObj.attributes[a[2]]);
							else
								template = template.replace(a[0], attrObj.attributes[(a[3] || 'current')]);
						}
					}
					else
						template = template.replace(a[0],'[noChar]');
				});
				attrReg.lastIndex = 0;
			}
			//Remove values
			_.each(_.difference(watchAction.watchList[context], newWatches), (o) => {
				if (!(lastChar) || (lastChar.attribs && !(lastChar.attribs._byId[o])))
					lastChar = Campaign.characters.find(o => o.attribs._byId[o]);
				if (lastChar) {
					if (lastChar.attribs)
						lastChar.attribs._byId[o].off('change', watchAction.onWatchChange, context);
					else
						lastChar.off('change', watchAction.onWatchChange, context);
				}
			});
			watchAction.watchList[context] = newWatches;

			template = template.replace(/\\n/g,'\n');
			if (!settings.format || settings.format == 'default')
				this.SetTitle(context, template);
			else if (settings.format == 'picture' && template.indexOf('http') > -1) {
				toDataURL(template, o => websocket.send(JSON.stringify({
					"event": "setImage",
					"context": context,
					"payload": {
						"image": o,
						"target": DestinationEnum.HARDWARE_AND_SOFTWARE
					}
				})));
				this.SetTitle(context, '');
			}
			else if (settings.format == 'math' && template.indexOf('[noChar]') == -1) {
				_.each([...template.matchAll(/\[\[([^\[\]]*)\]\]/g)], o => {
					template = template.replace(o[0], eval(o[1]));
				});
				this.SetTitle(context, template);
			}
		},

		SetTitle : function(context, toWhat) {
			var json = {
				"event": "setTitle",
				"context": context,
				"payload": {
					"title": toWhat,
					"target": DestinationEnum.HARDWARE_AND_SOFTWARE
				}
			};

			websocket.send(JSON.stringify(json));
		},

		SetSettings : function(context, settings, append) {
			if (append) {
				websocket.send(JSON.stringify({event: 'getSettings', context: context}));
				awaitSettings[context] = {callback: (a, b) => {this.SetSettings(context, Object.assign(a, b))}, args: settings};
			}
			else {
				var json = {
					"event": "setSettings",
					"context": context,
					"payload": settings
				};

				websocket.send(JSON.stringify(json));
			}
		}
	};

	function connectElgatoStreamDeckSocket (inPort, inPluginUUID, inRegisterEvent, inInfo) {
		pluginUUID = inPluginUUID

		// Open the web socket
		websocket = new WebSocket("ws://localhost:" + inPort);

		function registerPlugin(inPluginUUID) {
			var json = {
				"event": inRegisterEvent,
				"uuid": inPluginUUID
			};
			websocket.send(JSON.stringify(json));
		};

		websocket.onopen = function() {
			// WebSocket is connected, send message
			registerPlugin(pluginUUID);
			document.getElementById('importsd').style.background = 'lightgreen';
		};

		websocket.onmessage = function (evt) {
			// Received message from Stream Deck
			var jsonObj = JSON.parse(evt.data);
			var event = jsonObj['event'];
			var action = jsonObj['action'];
			var context = jsonObj['context'];
			var jsonPayload = jsonObj['payload'], settings, coordinates, userDesiredState, title;
			if (event == 'didReceiveGlobalSettings') {
				manageAction.onDidReceiveGlobalSettings(jsonPayload.settings);
				return;
			}
			if (action == 'com.statonions.r20Deck.manage') {
				if (event == 'sendToPlugin')
					manageAction.onSendToPlugin(context, jsonPayload['sdpi_collection']);
				return;
			}

			switch (event) {
				case 'keyDown':
					settings = jsonPayload['settings'];
					coordinates = jsonPayload['coordinates'];
					userDesiredState = jsonPayload['userDesiredState'];
					watchAction.onKeyDown(context, settings, coordinates, userDesiredState);
					break;
				case 'keyUp':
					settings = jsonPayload['settings'];
					coordinates = jsonPayload['coordinates'];
					userDesiredState = jsonPayload['userDesiredState'];
					watchAction.onKeyUp(context, settings, coordinates, userDesiredState);
					break;
				case 'willAppear':
					settings = jsonPayload['settings'];
					coordinates = jsonPayload['coordinates'];
					watchAction.onWillAppear(context, settings, coordinates);
					break;
				case 'titleParametersDidChange':
					settings = jsonPayload['settings'];
					watchAction.onTitleParametersDidChange(context, settings);
					break;
				case 'sendToPlugin':
					watchAction.onSendToPlugin(context, jsonPayload['sdpi_collection']);
					break;
				case 'propertyInspectorDidAppear':
					watchAction.onPropertyInspectorDidAppear(context, action);
					break;
				case 'didReceiveSettings':
					watchAction.onDidReceiveSettings(context, action, jsonPayload.settings);
					break;
			}
		};

		websocket.onclose = function() {
			// Websocket is closed
			document.getElementById('importsd').style.background = 'lightpink';
		};
	};
	unsafeWindow.connectElgatoStreamDeckSocket = connectElgatoStreamDeckSocket;
})();