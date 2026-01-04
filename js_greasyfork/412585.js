// ==UserScript==
// @name         WebinarDownloadAndAnytime
// @namespace    College
// @version      1.0.2.2
// @description  Скачивание презентаций, всегда онлайн на вебинаре
// @author       aexe
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjODI4YTk5IiBkPSJtIDEwLDYgaCA0IHYgNiBoIDMgbCAtNSw2IC01LC02IGggMyB6IiBwYWludC1vcmRlcj0ibWFya2VycyBzdHJva2UgZmlsbCIvPjwvc3ZnPg==
// @homepage     https://greasyfork.org/ru/scripts/412585-webinaranytime
// @homepageURL  https://greasyfork.org/ru/scripts/412585-webinaranytime
// @website      https://greasyfork.org/ru/scripts/412585-webinaranytime
// @source       https://greasyfork.org/scripts/412585-webinaranytime/code/WebinarAnytime.user.js
// @supportURL   https://greasyfork.org/ru/scripts/412585-webinaranytime/feedback
// @include      http*://events.webinar.ru/*/*/stream-new/*
// @include      http*://events.webinar.ru/*/*/record-new/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/412585/WebinarDownloadAndAnytime.user.js
// @updateURL https://update.greasyfork.org/scripts/412585/WebinarDownloadAndAnytime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new window.Promise(function(resolve) {
            setTimeout(resolve, ms)
        });
    }

    function get_eventsession() {
        var oInfo = (/\/(\d+)$/).exec(window.location.pathname);
        if(oInfo.length > 1) {
            return parseInt(oInfo[1]);
        }
        return null;
    }

    function download_presentation(szURL) {
        var nTimeout = 2000;
        if(arguments.length > 1) {
            nTimeout = parseInt(arguments[1]);
        }
        var oTab = GM_openInTab(szURL, {
            'active': false
        });
        setTimeout(function(oTab) {
            try {
                oTab.close();
            } catch(e) {}
        }, nTimeout, oTab);
    }

    function cache_push_presentation(szURL) {
        if(window.WebinarDownloadAndAnytime.presentation.indexOf(szURL) !== (-1)) {
			return;
		}
		window.WebinarDownloadAndAnytime.presentation.push(szURL);
        cache_sync();
    }

    function cache_download_all_presentations() {
        cache_sync();
        for(var nI = 0; nI < window.WebinarDownloadAndAnytime.presentation.length; nI++) {
			download_presentation(window.WebinarDownloadAndAnytime.presentation[nI], (2000 + nI * 500));
		}
    }

    function cache_sync() {
        var nIndex = get_eventsession();
        if (nIndex === null) {
            return false;
        }
        var aStoredList = config_get('presentation_event_' + nIndex.toString());

        if(aStoredList === null) {
            aStoredList = [];
        }

        if(((typeof(window.WebinarDownloadAndAnytime)) != 'object') || (window.WebinarDownloadAndAnytime === null)) {
            return false;
        }

        if(((typeof(window.WebinarDownloadAndAnytime.presentation)) != 'object') || (window.WebinarDownloadAndAnytime.presentation === null)) {
            return false;
        }

        for(var nI = 0; nI < aStoredList.length; nI++) {
            if(window.WebinarDownloadAndAnytime.presentation.indexOf(aStoredList[nI]) === (-1)) {
                window.WebinarDownloadAndAnytime.presentation.push(aStoredList[nI]);
            }
		}

        config_set('presentation_event_' + nIndex.toString(), window.WebinarDownloadAndAnytime.presentation);
    }

    function store_presentation_model() {
        var nEventSession = get_eventsession();
        if(nEventSession === null) {
            return false;
        }
        var oXMLHttp = new XMLHttpRequest();
        oXMLHttp.open("GET", 'https://events.webinar.ru/api/eventsessions/' + nEventSession.toString() + '/model', true);
        oXMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        oXMLHttp.addEventListener('readystatechange', function() {
            if(this.readyState != 4 || this.status != 200) {
                return false;
            }
            var oResponse = null;
            try {
                oResponse = JSON.parse(this.responseText);
            } catch(e) {}

            if(oResponse === null) {
                return false;
            }
            if((typeof(oResponse.presentation) !== 'object') || (oResponse.presentation === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference) !== 'object') || (oResponse.presentation.fileReference === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference.file) !== 'object') || (oResponse.presentation.fileReference.file === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference.file.downloadUrl) !== 'string')) {
                return false;
            }

            cache_push_presentation(oResponse.presentation.fileReference.file.downloadUrl);
        });
        oXMLHttp.send(null);
    }

    function command_download_presentation_stream() {
        var nEventSession = get_eventsession();
        if(nEventSession === null) {
            return false;
        }
        var oXMLHttp = new XMLHttpRequest();
        oXMLHttp.open("GET", 'https://events.webinar.ru/api/eventsessions/' + nEventSession.toString() + '/model', true);
        oXMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        oXMLHttp.addEventListener('readystatechange', function() {
            if(this.readyState != 4 || this.status != 200) {
                return false;
            }
            var oResponse = null;
            try {
                oResponse = JSON.parse(this.responseText);
            } catch(e) {}

            if(oResponse === null) {
                return false;
            }
            if((typeof(oResponse.presentation) !== 'object') || (oResponse.presentation === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference) !== 'object') || (oResponse.presentation.fileReference === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference.file) !== 'object') || (oResponse.presentation.fileReference.file === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference.file.downloadUrl) !== 'string')) {
                return false;
            }

            cache_push_presentation(oResponse.presentation.fileReference.file.downloadUrl);
            download_presentation(oResponse.presentation.fileReference.file.downloadUrl);
        });
        oXMLHttp.send(null);
    }

    function command_download_presentation_stream_all() {
		var nEventSession = get_eventsession();
        if(nEventSession === null) {
            return false;
        }
        var oXMLHttp = new XMLHttpRequest();
        oXMLHttp.open("GET", 'https://events.webinar.ru/api/eventsessions/' + nEventSession.toString() + '/model', true);
        oXMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        oXMLHttp.addEventListener('readystatechange', function() {
            if(this.readyState != 4 || this.status != 200) {
                return false;
            }
            var oResponse = null;
            try {
                oResponse = JSON.parse(this.responseText);
            } catch(e) {}

            if(oResponse === null) {
                return false;
            }
            if((typeof(oResponse.presentation) !== 'object') || (oResponse.presentation === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference) !== 'object') || (oResponse.presentation.fileReference === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference.file) !== 'object') || (oResponse.presentation.fileReference.file === null)) {
                return false;
            }
            if((typeof(oResponse.presentation.fileReference.file.downloadUrl) !== 'string')) {
                return false;
            }

            var nI = 0;

            cache_push_presentation(oResponse.presentation.fileReference.file.downloadUrl);
			cache_download_all_presentations();
        });
        oXMLHttp.send(null);
    }

    function command_download_presentation_record() {
        var nEventSession = get_eventsession();
        if(nEventSession === null) {
            return false;
        }
        var oXMLHttp = new XMLHttpRequest();
        oXMLHttp.open("GET", 'https://events.webinar.ru/api/eventsessions/' + nEventSession.toString() + '/record?withoutCuts=false', true);
        oXMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        oXMLHttp.addEventListener('readystatechange', function() {
            if(this.readyState != 4 || this.status != 200) {
                return false;
            }
            var oResponse = null;
            try {
                oResponse = JSON.parse(this.responseText);
            } catch(e) {}
            if(oResponse === null) {
                return false;
            }
            if((typeof(oResponse.eventLogs) !== 'object') || (oResponse.eventLogs === null)) {
                return false;
            }

            var nI = 0;
            for(nI = 0; nI < oResponse.eventLogs.length; nI++) {
                var oEvent = oResponse.eventLogs[nI];
                if((typeof(oEvent.module) !== 'string')) {
                    continue;
                }
                if((/presentation\..*/).test(oEvent.module) !== true) {
                    continue;
                }
                if((typeof(oEvent.data) !== 'object') || (oEvent.data === null)) {
                    continue;
                }
                if((typeof(oEvent.data.fileReference) !== 'object') || (oEvent.data.fileReference === null)) {
                    continue;
                }
                if((typeof(oEvent.data.fileReference.file) !== 'object') || (oEvent.data.fileReference.file === null)) {
                    continue;
                }
                if((typeof(oEvent.data.fileReference.file.downloadUrl) !== 'string')) {
                    continue;
                }
				cache_push_presentation(oEvent.data.fileReference.file.downloadUrl);
            }
            cache_download_all_presentations();
        });
        oXMLHttp.send(null);
    }

	function command_flag_online() {
		window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_online = !window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_online;
		gm_menu_render();
	}

	function command_flag_unstable() {
		window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_unstable = !window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_unstable;
		gm_menu_render();
	}

	function command_config_save() {
        config_set('config:gm_menu_flags', window.WebinarDownloadAndAnytime.state.gm_menu_flags);
	}

	function command_config_clear() {
        config_set('config:gm_menu_flags', null);
	}

	function config_load() {
        var oConfig = config_get('config:gm_menu_flags');
        if(((typeof(oConfig)) != 'object') || (oConfig === null)) {
            oConfig = {
                'flag_online': true,
                'flag_unstable': false
            };
        }

        window.WebinarDownloadAndAnytime.state.gm_menu_flags = oConfig;
	}

	function config_set(szName, uValue) {
        GM_setValue(szName, uValue);
	}

	function config_get(szName) {
        var uValue = GM_getValue(szName);
        if(uValue === undefined) {
            return null;
        }
        return uValue;
	}

	function config_delete(szName) {
        GM_deleteValue(szName);
	}

	function config_clear() {
        var aConfigList = GM_listValues();
        for(var nI = 0; nI < aConfigList.length; nI++) {
            config_delete(aConfigList[nI]);
        }
	}

	function send_anytime_request() {
		var oControlAnytime = document.querySelector('[class^=Reaction__rippleContainer');
		if(oControlAnytime === null) {
			return false;
		}
		if(window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_online) {
			oControlAnytime.click();
		}
		setTimeout(send_anytime_request, parseInt(Math.random() * 5000) + 1000);
	}

    function webinar_onload() {
        var oControlAnytime = document.querySelector('[class^=Reaction__rippleContainer');
		if(oControlAnytime === null) {
			setTimeout(webinar_onload, 1000);
			return false;
		}

		setTimeout(send_anytime_request, 1000);
        store_presentation_model();
    }

	function gm_command_unregister(szMenuName) {
		if((typeof(window.WebinarDownloadAndAnytime.state.gm_menu[szMenuName])) == 'number') {
			GM_unregisterMenuCommand(window.WebinarDownloadAndAnytime.state.gm_menu[szMenuName]);
		}
		window.WebinarDownloadAndAnytime.state.gm_menu[szMenuName] = null;
	}

	function gm_menu_render() {
		gm_command_unregister('download_presentation_stream');
		gm_command_unregister('download_presentation_stream_all');
		gm_command_unregister('download_presentation_record');
		gm_command_unregister('flag_online');
		gm_command_unregister('flag_unstable');
		gm_command_unregister('config_save');
		gm_command_unregister('config_clear');

		if((/\/stream-new\/\d+$/).test(window.location.pathname)) {
			window.WebinarDownloadAndAnytime.state.gm_menu.download_presentation_stream = GM_registerMenuCommand('Скачать текущую презентацию', command_download_presentation_stream);
            window.WebinarDownloadAndAnytime.state.gm_menu.download_presentation_stream_all = GM_registerMenuCommand('Скачать все презентации', command_download_presentation_stream_all);
            window.WebinarDownloadAndAnytime.state.gm_menu.flag_online = GM_registerMenuCommand('Режим "Всегда онлайн": ' + (window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_online ? 'В': 'От') + 'ключен', command_flag_online);
            window.WebinarDownloadAndAnytime.state.gm_menu.flag_unstable = GM_registerMenuCommand('Режим "Нестабильное соединение": ' + (window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_unstable ? 'В': 'От') + 'ключен', command_flag_unstable);
        }
        else if((/\/record-new\/\d+$/).test(window.location.pathname)) {
            window.WebinarDownloadAndAnytime.state.gm_menu.download_presentation_record = GM_registerMenuCommand('Скачать все презентации', command_download_presentation_record);
        }

        window.WebinarDownloadAndAnytime.state.gm_menu.config_save = GM_registerMenuCommand('Сохранить конфигурацию', command_config_save);
        window.WebinarDownloadAndAnytime.state.gm_menu.config_clear = GM_registerMenuCommand('Сбросить конфигурацию', command_config_clear);
	}

    function main_complete() {
        if(window.document.readyState != "complete") {
            return false;
        }

		webinar_onload();
    }

    function main_init() {
        window.WebinarDownloadAndAnytime = {
            'user': null,
            'presentation': [],
			'state': {
				'gm_menu': {
					'download_presentation_stream': null,
					'download_presentation_stream_all': null,
					'download_presentation_record': null,
					'flag_online': null,
					'flag_unstable': null,
                    'config_save': null,
                    'config_clear': null
				},
				'gm_menu_flags': {
					'flag_online': true,
					'flag_unstable': false
				}
			}
        };

        config_load();

		gm_menu_render();

		unsafeWindow.wsHook = {};
		(function () {
			// Mutable MessageEvent.
			// Subclasses MessageEvent and makes data, origin and other MessageEvent properites mutatble.
			function MutableMessageEvent (o) {
				this.bubbles = o.bubbles || false;
				this.cancelBubble = o.cancelBubble || false;
				this.cancelable = o.cancelable || false;
				this.currentTarget = o.currentTarget || null;
				this.data = o.data || null;
				this.defaultPrevented = o.defaultPrevented || false;
				this.eventPhase = o.eventPhase || 0;
				this.lastEventId = o.lastEventId || '';
				this.origin = o.origin || '';
				this.path = o.path || new Array(0);
				this.ports = o.parts || new Array(0);
				this.returnValue = o.returnValue || true;
				this.source = o.source || null;
				this.srcElement = o.srcElement || null;
				this.target = o.target || null;
				this.timeStamp = o.timeStamp || null;
				this.type = o.type || 'message';
				this.__proto__ = o.__proto__ || MessageEvent.__proto__;
			}

			var before = unsafeWindow.wsHook.before = function (data, url, wsObject) {
				return data;
			};
			var after = unsafeWindow.wsHook.after = function (e, url, wsObject) {
				return e;
			};
			var modifyUrl = unsafeWindow.wsHook.modifyUrl = function(url) {
				return url;
			};
			unsafeWindow.wsHook.resetHooks = function () {
				unsafeWindow.wsHook.before = before;
				unsafeWindow.wsHook.after = after;
				unsafeWindow.wsHook.modifyUrl = modifyUrl;
			};

			var _WS = unsafeWindow.WebSocket;
			unsafeWindow.WebSocket = function (url, protocols) {
				var WSObject;
				url = unsafeWindow.wsHook.modifyUrl(url) || url;
				this.url = url;
				this.protocols = protocols;
				if (!this.protocols) { WSObject = new _WS(url); } else { WSObject = new _WS(url, protocols); }

				var _send = WSObject.send;
				WSObject.send = function (data) {
					arguments[0] = unsafeWindow.wsHook.before(data, WSObject.url, WSObject) || data;
					_send.apply(this, arguments);
				};

				// Events needs to be proxied and bubbled down.
				WSObject._addEventListener = WSObject.addEventListener;
				WSObject.addEventListener = function () {
					var eventThis = this;
					// if eventName is 'message'
					if (arguments[0] === 'message') {
						arguments[1] = (function (userFunc) {
							return function instrumentAddEventListener () {
								arguments[0] = unsafeWindow.wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject);
								if (arguments[0] === null) return;
								userFunc.apply(eventThis, arguments);
							};
						})(arguments[1]);
					}
					return WSObject._addEventListener.apply(this, arguments);
				}

				Object.defineProperty(WSObject, 'onmessage', {
					'set': function () {
						var eventThis = this;
						var userFunc = arguments[0];
						var onMessageHandler = function () {
							arguments[0] = unsafeWindow.wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject);
							if (arguments[0] === null) return;
							userFunc.apply(eventThis, arguments);
						};
						WSObject._addEventListener.apply(this, ['message', onMessageHandler, false]);
					}
				});

				return WSObject;
			};
		})();

        /*
        unsafeWindow.wsHook.before = function (data, url) {
            var oResponse = null;

            if((/^wss:\/\/ping-sd\.webinar\.ru\/socketcluster/).test(url)) {
                if(data.length == 0) {
                    return data;
                }

                if(data.charAt(0) != '{') {
                    return data;
                }

                try {
                    oResponse = JSON.parse(data);
                } catch(e) {
                    return data;
                }

                if(typeof(oResponse.type) != 'string') {
                    return data;
                }

                if(oResponse.type != 'webiping') {
                    return data;
                }

                if((typeof(oResponse.data) != 'object') || (oResponse.data === null)) {
                    return data;
                }

                if(typeof(oResponse.data.timestamp) != 'number') {
                    return data;
                }

                oResponse.data.timestamp = oResponse.data.timestamp - 1 - parseInt(Math.random() * 4);

				return JSON.stringify(oResponse);
			}
            return data;
        }
        */

		unsafeWindow.wsHook.after = function (messageEvent, url) {
			var oResponse = null;
            var nSleep = 0;

            if((/^wss:\/\/ping-sd\.webinar\.ru\/socketcluster/).test(messageEvent.target.url)) {
                if(messageEvent.data.length == 0) {
                    return messageEvent;
                }

                if(messageEvent.data.charAt(0) != '{') {
                    return messageEvent;
                }

                try {
                    oResponse = JSON.parse(messageEvent.data);
                } catch(e) {
                    return messageEvent;
                }

                if(typeof(oResponse.type) != 'string') {
                    return messageEvent;
                }

                if(oResponse.type != 'webipong') {
                    return messageEvent;
                }

                if((typeof(oResponse.data) != 'object') || (oResponse.data === null)) {
                    return messageEvent;
                }

                if(typeof(oResponse.data.timestamp) != 'number') {
                    return messageEvent;
                }

                nSleep = 1 + parseInt(Math.random() * 4);
                oResponse.data.timestamp = oResponse.data.timestamp + nSleep;
                sleep(nSleep * 1000);

                messageEvent.data = JSON.stringify(oResponse);

				return messageEvent;
			}

			if((/^wss:\/\/[^\/]*\.?webinar\.ru\/engine\.io\/\?EIO=3/).test(messageEvent.target.url)){
				if(messageEvent.data.length == 0) {
                    return messageEvent;
                }

                if(messageEvent.data.charAt(0) != '4') {
                    return messageEvent;
                }

                try {
                    oResponse = JSON.parse(messageEvent.data.slice(1));
                } catch(e) {
                    return messageEvent;
                }

                if((typeof(oResponse) != 'object') || (oResponse === null)) {
                    return messageEvent;
                }

                if(typeof(oResponse.name) != 'string') {
                    return messageEvent;
                }

                if(oResponse.name != 'message') {
                    return messageEvent;
                }

                if((typeof(oResponse.data) != 'object') || (oResponse.data === null)) {
                    return messageEvent;
                }

                if((typeof(oResponse.data.messages) != 'object') || (oResponse.data.messages === null)) {
                    return messageEvent;
                }

                if((typeof(oResponse.data.messages.length) != 'number')) {
                    return messageEvent;
                }

                var oCurrentMessage = null;

                for(var nI = 0; nI < oResponse.data.messages.length; nI++) {
                    try {
                        oCurrentMessage = JSON.parse(oResponse.data.messages[nI]);
                    } catch(e) {
                        continue;
                    }

                    if(typeof(oCurrentMessage.key) != 'string') {
                        continue;
                    }

                    switch(oCurrentMessage.key) {
                        case 'presentation.update':
                            if((typeof(oCurrentMessage.data) != 'object') || (oCurrentMessage.data === null)) {
                                break;
                            }
                            if((typeof(oCurrentMessage.data.fileReference) != 'object') || (oCurrentMessage.data.fileReference === null)) {
                                break;
                            }
                            if((typeof(oCurrentMessage.data.fileReference.file) != 'object') || (oCurrentMessage.data.fileReference.file === null)) {
                                break;
                            }
                            if(typeof(oCurrentMessage.data.fileReference.file.downloadUrl) != 'string') {
                                break;
                            }

                            cache_push_presentation(oCurrentMessage.data.fileReference.file.downloadUrl);
                            break;
                    }
                }
				return messageEvent;
			}

			return messageEvent;
		};

        unsafeWindow.fetch_default = unsafeWindow.fetch;
        unsafeWindow.fetch_call = unsafeWindow.fetch = function() {
			var bAfterHook = false;
            if((arguments.length > 1) && ((typeof(arguments[1])) == 'object') && (arguments[1] !== null)) {
                //Хук: Всегда активен и всегда включен звук
				if((/^https:\/\/events\.webinar\.ru\/api\/(light\/)?eventsessions\/\d+\/setUserInvolvementStatus$/).test(arguments[0])) {
                    if(window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_online) {
						arguments[1].body = "isFocused=true&isSoundEnabled=true";
						console.log('WebinarDownloadAndAnytime: Hook: setUserInvolvementStatus');
                    } else {
                        console.log('WebinarDownloadAndAnytime: Hook ignore: setUserInvolvementStatus');
                    }
				}
                //Хук: Всегда нестабильное подключение
				else if((/^https:\/\/events\.webinar\.ru\/api\/(light\/)?eventsessions\/\d+\/connectionIssue$/).test(arguments[0])) {
                    if(window.WebinarDownloadAndAnytime.state.gm_menu_flags.flag_unstable) {
						arguments[1].body = "status=unstable";
						console.log('WebinarDownloadAndAnytime: Hook: connectionIssue');
                    } else {
                        console.log('WebinarDownloadAndAnytime: Hook ignore: connectionIssue');
                    }
				}
                //TODO:
                //Информация о пользователе: https://events.webinar.ru/api/login
                //Кешированная информация в т.ч. информация по презентациям https://events.webinar.ru/api/eventsessions/6749163/cached
            }
            var oReturn = unsafeWindow.fetch_default.apply(this, Array.prototype.slice.call(arguments));

			return oReturn;
        };
    }

    main_init();

    if(window.document.readyState == "complete") {
        main_complete();
    } else {
        window.document.addEventListener('readystatechange', main_complete);
    }
})();