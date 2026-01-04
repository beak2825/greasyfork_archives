// ==UserScript==
// @name         TheWest - No Edge Blink
// @namespace    https://greasyfork.org/en/scripts/35587-thewest-no-edge-blink
// @version      0.25
// @description  Stop blinking title on Edge
// @author       Adriano
// @license      LGPLv3
// @include      http*://*.the-west.*/game.php
// @include      http*://*.the-west.*.*/game.php*
// @include      http*://*.tw.innogames.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35587/TheWest%20-%20No%20Edge%20Blink.user.js
// @updateURL https://update.greasyfork.org/scripts/35587/TheWest%20-%20No%20Edge%20Blink.meta.js
// ==/UserScript==

function appendScript(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	document.body.appendChild(newScript);
	document.body.removeChild(newScript);
}
appendScript(function() {
    //'use strict';
    var VERSION = 0.25;
	var URL_INSTALL = "https://greasyfork.org/en/scripts/35587-thewest-no-edge-blink";
	var URL_CODE = "https://greasyfork.org/scripts/35587-thewest-no-edge-blink/code/TheWest%20-%20No%20Edge%20Blink.user.js";
    var SCRIPT1 = "https://greasyfork.org/scripts/35553-thewest-tamagotchi-pg";
    var SCRIPT2 = "https://greasyfork.org/en/scripts/35587-thewest-no-edge-blink";
	var scriptAuthor = "Adriano";
	var scriptCredits = '<span style="display: inline-block; vertical-align: middle;">Adriano (Tiger54) for this script<br />.</span>';
    var scriptList = '<p style="margin: 8pt;"><b>Adriano\'s Scripts</b>: <span style="display: inline-block; vertical-align: middle;"><a href="' + SCRIPT1 + '">Tamagotchi PG</a><br><a href="' + SCRIPT2 + '">No Edge Blink</a></span></p>';
	var scriptName = "No Tab Blink";
	var scriptObject = "NoEdgeBlink";
	this[scriptObject] = {
        localeManager: {
			localeDefault: 'en_US',
			localeScript: 'en_US',
			getMsg: function(msg) {
				if(undefined !== this.languages[this.localeScript][msg]) return this.languages[this.localeScript][msg];
				if(undefined !== this.languages[this.localeDefault][msg]) return this.languages[this.localeDefault][msg];
				return '';
			},
            checkLanguages: function() {
				var langs = Object.keys(this.languages), messages = Object.keys(this.languages[this.localeDefault]), that = this;
				$.each(messages, function(i, msg) {
					$.each(langs, function(j, lang) {
						if(!that.languages[lang].hasOwnProperty(msg)) console.log('Missing '+lang+'.'+msg);
						else if(typeof that.languages[that.localeDefault][msg] == "object") {
							$.each(Object.keys(that.languages[that.localeDefault][msg]), function(k, msg2) {
								if(!that.languages[lang][msg].hasOwnProperty(msg2)) console.log('Missing '+lang+'.'+msg+'.'+msg2);
							});
						}
					});
				});
				$.each(langs, function(i, lang) {
					$.each(Object.keys(that.languages[lang]), function(j, msg) {
						if(!messages.includes(msg)) console.log('Obsolete message '+lang+'.'+msg);
						else if(typeof that.languages[lang][msg] == "object") {
							$.each(Object.keys(that.languages[lang][msg]), function(j, msg2) {
								if(!that.languages[that.localeDefault][msg].hasOwnProperty(msg2)) console.log('Obsolete message '+lang+'.'+msg+'.'+msg2);
							});
						}
					});
				});
			},
			setLocale: function(localeSelected) {
				this.localeScript = (undefined !== this.languages[localeSelected]) ? localeSelected : this.localeDefault;
			},
            languages: {
				en_US: {
					description: '<h1>The West - No Edge Blink</h1><p style="margin: 8pt;">Under Windows 10, in Edge, the title in the tab will fade on each text change. <br>This can be annoying when you are not playing.</p><p style="margin: 8pt;">With this script, the seconds will be removed from the title, so that it blinks only 1 time each minute (every second if the tab is active).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p>' + scriptList,
					version: 'version',
					version_checkFailed: 'Unable to check for updates',
					version_checkManual: 'Check manually',
					version_ok: 'You already have the latest version',
					version_upgrade: 'A new version is available. Do you want to upgrade now?',
					refresh: 'Refresh',
				},
            },
        },
        script: {
			api: null,
			listeningSignal: 'game_config_loaded',
			loaded: false,
			init: function() {
				var that = this;
				if(this.loaded) return false;
				EventHandler.listen(this.listeningSignal, function() {
					that.init();
					return EventHandler.ONE_TIME_EVENT;
				});
				if(!!(Game && Game.loaded)) {
					this.loaded = true;
					NoEdgeBlink.localeManager.setLocale(Game.locale);
					this.api = TheWestApi.register(scriptObject, scriptName, VERSION.toString(), Game.version.toString(), scriptAuthor, URL_INSTALL);
                    NoEdgeBlink.script.api.setGui(NoEdgeBlink.localeManager.getMsg('description'));
                    if(TitleTicker.tick)
                    {
                        TitleTicker.tick = function() {
                            var title,c;
                            c=TaskQueue.timeleft;
                            if(c)
                            {
                                if(TitleTicker.isWindowActive)
                                    title=(c.formatDuration()) + ' - ' + TitleTicker.getSuffix();
                                else
                                    title=(c.formatDuration().substring(0,c.formatDuration().length-3)) + ' - ' + TitleTicker.getSuffix();
                            }
                            else
                            {
                                title=TitleTicker.getSuffix();
                            }
                            if(!TitleTicker.isWindowActive && TitleTicker.notifyMessage)
                            {
                                if(TitleTicker.lastNotify > 0)
                                    title=TitleTicker.notifyMessage;
                                TitleTicker.lastNotify++;
                                if(TitleTicker.lastNotify>TitleTicker.notifyDuration)
                                    TitleTicker.lastNotify=-TitleTicker.notifyDuration;
                            }
                            else
                            {
                                TitleTicker.lastNotify=0;
                            }
                            if(TitleTicker.lasttitle == title)
                                return;
                            TitleTicker.lasttitle=title;
                            document.title=title;
                            TitleTicker.setTime(TitleTicker.time-1);
                        };
                    }
				}
			},
		},
    };
    $(function() { try { NoEdgeBlink.script.init(); } catch(x) { console.trace(x); } });
});
