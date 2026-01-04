// ==UserScript==
// @name        Pardus Quickset Ambush
// @namespace   http://userscripts.xcom-alliance.info/
// @description Quickly set up an ambush from the navigation screen using a pre-set Quick List
// @author      Miche (Orion) / Sparkle (Artemis)
// @include     http*://*.pardus.at/main.php*
// @version     1.7.2
// @icon 	http://userscripts.xcom-alliance.info/quickset_ambush/icon.png
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/402694/Pardus%20Quickset%20Ambush.user.js
// @updateURL https://update.greasyfork.org/scripts/402694/Pardus%20Quickset%20Ambush.meta.js
// ==/UserScript==

/*****************************************************************************************
	Version Information
*****************************************************************************************/
/*****************************************************************************************
	2013.03.21 (Version 1.0)
	  - Initial release.

	2013.03.23 (Version 1.1)
	  - Fixed problem with partial refresh attempting to access GM_getValue
	  - Added cloak/unclock functionality, modified cloaking to use existing page code
      - Moved settings popup, updated settings wording and optimised the settings css
      - Changed the css for the main buttons to not be absolutely positioned
      - Added a reset to defaults option for the settings

	2013.08.09 (Version 1.2)
	  - Added a timer to show how long remains for your retreat point to be used

	2013.08.13 (Version 1.3)
	  - Ensured that any quicklist has white-space removed before parsing

	2014.08.21 (Version 1.4)
	  - Extended to accommodate 26 round ambush for TSS

    2017.01.11 (Version 1.5)
	  - Fixed a bug where the "specific" option was always being considered "exclude"

    2018.05.02 (Version 1.6)
      - Switched from using GM_xmlhttpRequest for setting the actual ambush (use a form submit)

    2020.04.18 (Version 1.7)
      - Prevent any movement via mouse or keyboard when settings are open

*****************************************************************************************/


/*****************************************************************************************
	Main Page
*****************************************************************************************/
if (document.URL.indexOf('pardus.at/main.php') > -1) {

	var QuicksetAmbush = {

		ButtonKeys: ['setrp','ambush1','ambush2','ambush3','cloak'],

		ButtonData: {},

		ButtonDataDefaults: {
			'setrp':	{ 'display':'Set RP', 'shortcut':'', 'enabled':true },
			'cloak':	{ 'display':'Cloak', 'shortcut':'', 'enabled':true },
			'ambush1':	{ 'display':'Ambush QL1', 'shortcut':'', 'enabled':true, 'quicklist':'' },
			'ambush2':	{ 'display':'Ambush QL2', 'shortcut':'', 'enabled':true, 'quicklist':'' },
			'ambush3':	{ 'display':'Ambush QL3', 'shortcut':'', 'enabled':true, 'quicklist':'' }
		},

		Init: function() {
			var html = this.BuildFullMarkup();
			if (this.enabled) {
				this.AddCSS();
				var div = document.createElement('div');
				div.setAttribute('id','ambush_button_wrapper');
				div.innerHTML = html;
				var node = document.querySelector('#tdSpaceChart>table>tbody>tr:last-child>td:nth-of-type(2)');
				node.appendChild(div);
				this.UpdateButtonStates();
				this.AddButtonClickEvents();
				this.AddButtonKeypressEvents();
				this.ShowRetreatPointCountdown();
			}
		},

		AddCSS: function() {
			var CSS = document.createElement('style');
			CSS.setAttribute('type','text/css');
			var css = '#ambush_button_wrapper { text-align:center;margin-left:-8px;padding-bottom: 15pt; }' + '\n';
				css += '#ambush_button_wrapper button { cursor:pointer;font-size:11px;color:#fff;padding:3px;margin:0 7px 0 0;border-style:ridge;border-width:2px;border-radius:5px; }' + '\n';
				css += '#ambush_button_wrapper button.disabled { cursor:default;color:#ccc;background-color:#aaa; }' + '\n';
				css += '#retreatpointcountdown { margin-right:5px; }' + '\n';
				css += '#quickset_ambush_settings { vertical-align:middle;margin-left:5px;width:20px;height:20px;cursor:pointer; }' + '\n';
				css += '#errmsgdiv b { color:#f00; }' + '\n';
				css += '#errmsgdiv p { margin:5px 0; }' + '\n';
				css += '#errmsgdiv i { text-indent:20px; }' + '\n';
				// css for the settings popup
				css += '#quickset_ambush_settings_wrapper { position:absolute;z-index:3;right:11px;top:5px; }' + '\n';
				css += '#quickset_ambush_settings_wrapper table { width:400px;border:2px ridge #a1a1af; }' + '\n';
				css += '#quickset_ambush_settings_wrapper td { font-size:11px; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .buttons { padding:0px 0 8px;text-align:right; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .buttons span { float:left;margin:4px; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .buttons button { border-width:1px;padding:2px 6px;margin:0 5px; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .col1 { width:110px;float:left; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .col2 input { width:85px;padding:2px;border:1px inset; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .col3 { float:right;margin-right:8px; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .col3 input { text-align:center;width:20px;padding:2px;border:1px inset; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .col4 { margin-left:8px;font-style:italic; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .col4 textarea { padding:2px;background-color:#00001c;color:#d0d1d9;border:1px inset; width:367px;height:44px;overflow:hidden;font-family:Lucida Grande;font-size:11px;margin:2px 8px 0 8px; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .spacer { height:8px;clear:both; }' + '\n';
				css += '#quickset_ambush_settings_wrapper .spacer_mid { height:4px;clear:both; }' + '\n';
			CSS.innerHTML = css;
			document.body.appendChild(CSS);
		},

		GetButtonData: function(button) {
			if (this.ButtonData[button]) return this.ButtonData[button];
			var universe = window.location.host.substr(0, window.location.host.indexOf('.'));
			var obj = {};
			var data = GM_getValue(universe, '');
			if (data != '') {
				obj = JSON.parse(data);
			} else {
				obj = this.ButtonDataDefaults;
			}
			this.ButtonData = obj;
			return this.ButtonData[button];
		},

		GetAButtonMarkup: function(index) {
			var button = this.GetButtonData(index);
			var html = '';
			if (button && button.enabled) {
				html = '<button id="' + index + '">' + button.display + (button.shortcut == '' ? '' : (' [' + button.shortcut.toUpperCase() + ']')) + '</button>';
			}
			return html;
		},

		DisableButton: function(button) {
			if (document.getElementById(button)) {
				document.getElementById(button).setAttribute('disabled','disabled');
				document.getElementById(button).setAttribute('class','disabled');
			}
		},

		EnableButton: function(button) {
			if (document.getElementById(button)) {
				document.getElementById(button).removeAttribute('disabled');
				document.getElementById(button).removeAttribute('class');
			}
		},

		UpdateButtonStates: function() {
			if (!document.getElementById('aCmdRetreatInfo')) {
				this.DisableButton('setrp');
			} else {
				this.EnableButton('setrp');
			}
			if (document.getElementById('cloak')) {
				if (document.getElementById('inputShipCloak')) {
					document.getElementById('cloak').innerHTML = document.getElementById('cloak').innerHTML.replace(/Uncloak/,'Cloak');
				} else {
					document.getElementById('cloak').innerHTML = document.getElementById('cloak').innerHTML.replace(/Cloak/,'Uncloak');
				}
			}
			var no_ambush = document.body.textContent.indexOf("View current ambush settings") > -1 || !document.getElementById('aCmdAmbush');
			if (document.getElementById('ambush1')) {
				if (no_ambush || this.GetButtonData('ambush1').quicklist == '') {
					this.DisableButton('ambush1');
				} else {
					this.EnableButton('ambush1');
				}
			}
			if (document.getElementById('ambush2')) {
				if (no_ambush || this.GetButtonData('ambush2').quicklist == '') {
					this.DisableButton('ambush2');
				} else {
					this.EnableButton('ambush2');
				}
			}
			if (document.getElementById('ambush3')) {
				if (no_ambush || this.GetButtonData('ambush3').quicklist == '') {
					this.DisableButton('ambush3');
				} else {
					this.EnableButton('ambush3');
				}
			}
		},

		GetSettingsButtonMarkup: function() {
			var button_src = 'data:image/gif;base64,' +
			'R0lGODlhDgAOAOYAAKGhof////z8/AAAAMvLy/Hx8dDQ0Obm5r29vff39/39/WhoaGlpaGhpadPT03V1' +
			'dTk5Oevr68PDw3l5edHR0fj4+Pb29urq6uDg4MrKyvn5+eHh4cfHx97e3tXV1bS0tLm5ucbGxvLy8ra2' +
			'ttjY2AgICCYmJpubm2ZmZmloaVtbWxUVFf7+/ktLS4eHh8nJyZOTlGtsbPX19ZycnMTExGhpaGhoaZOU' +
			'k9LS0qqqqrOzs35/f39/f/v7+8zMzJ+fn8/Pz87OztTU1IiIiIiJiZeYl6enp42OjsjIyJ+en4WDg5KS' +
			'kmxrbIuLi56en4mJidfX17i4uO7u7n5+fnJycmlpadzc3OPj47y8vMXFxWpqam9vb5eXl+np6ZmZmeLi' +
			'4qampo6OjmhoarCwsL+/v3p5eYOEg3BvbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
			'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAOAA4AAAe5gACC' +
			'g4SESQEsAYqLiolOJwoIGgKUlQJkGidFCgkJPQOgAzIVFgpcNwkFIlIDC1oDFyIFFjBHBRcRByUjUSUY' +
			'EV0FYUQHG18dK1bIJFcbB09KHgYUQCZQJCY+OAYeZjtCBOEQMz8QHwYEDjwTDi8vIS0VAi1THBkUZQ8G' +
			'WTQSKhgHVFABgyTIgy0hhoDAgsJIDhQTvDSRcIZJhg8IEIAY48LFEh0jOMQQw6BBAwYLGFRpsKCGjRQp' +
			'AgEAOw==';
			return '<img src="' + button_src + '" title="Quickset Ambush Settings" id="quickset_ambush_settings"/>';
		},

        FreezeFrame: function(toggle) {
            if (toggle === 'on') {
                this.FreezeFrameLockState();
            }
            else {
                this.FreezeFrameUnlockState();
            }
        },

        FreezeFrameLockState: function() {
            if (this.FreezeFrameImg) {
                return;
            }

            this.FreezeFrameImg = document.getElementById('status_image');
            this.FreezeFrameImg.setAttribute('id','useform');
            var els = document.querySelectorAll('#tdSpaceChart table td a');
            for (var i=0; i<els.length; i++) {
                els[i].setAttribute('xonclick', els[i].getAttribute('onclick'));
                els[i].removeAttribute('onclick');
            }
        },

        FreezeFrameUnlockState: function() {
            this.FreezeFrameImg.setAttribute('id','status_image');
            var els = document.querySelectorAll('#tdSpaceChart table td a');
            for (var i=0; i<els.length; i++) {
                if (els[i].hasAttribute('xonclick')) {
                    els[i].setAttribute('onclick', els[i].getAttribute('xonclick'));
                    els[i].removeAttribute('xonclick');
                }
            }
            this.FreezeFrameImg = null;
        },

		HandleSettingsButtonClick: function(e) {
            this.FreezeFrame('on');
            var node = document.getElementById('quickset_ambush_settings_wrapper');
			if (!node) {
				node = document.createElement('DIV');
				node.setAttribute('id','quickset_ambush_settings_wrapper');
				var _html = '';
					_html += '<table style="background:url(' + unsafeWindow.imgDir + '/bgd.gif);" cellpadding="3">';
					_html += '<tr><th>Quickset Ambush Settings</th></tr>';
					_html += '<tr><td>';
					_html += '<em>Choose which buttons to show and assign optional shortcut keys for them</em>';
					_html += '</td></tr>';
					_html += '<tr><td>';
					_html += '<div class="spacer"></div>';
					_html += '<label><input type="checkbox" id="chk_cloak">Show Cloak/Uncloak button</label> ';
					_html += '<input type="hidden" id="disp_cloak">';
					_html += '<label class="col3">Shortcut key: <input type="text" value="" maxlength="1" id="key_cloak"></label> ';
					_html += '<div class="spacer"></div>';
					_html += '<label class="col1"><input type="checkbox" id="chk_setrp">Show Set RP</label> ';
					_html += '<label class="col2">Button text: <input type="text" id="disp_setrp"></label> ';
					_html += '<label class="col3">Shortcut key: <input type="text" value="" maxlength="1" id="key_setrp"></label> ';
					_html += '<div class="spacer"></div>';
					_html += '</td></tr>';
					_html += '<tr><td>';
					_html += '<em>The buttons below will only show when you have assigned a quicklist to them</em>';
					_html += '</td></tr>';
					_html += '<tr><td>';
					_html += '<div class="spacer"></div>';
					_html += '<label class="col1"><input type="checkbox" id="chk_ambush1">Enable button</label> ';
					_html += '<label class="col2">Button text: <input type="text" id="disp_ambush1"></label> ';
					_html += '<label class="col3">Shortcut key: <input type="text" value="" maxlength="1" id="key_ambush1"></label> ';
					_html += '<div class="spacer_mid"></div>';
					_html += '<label class="col4">Quicklist: <br><textarea id="ql_ambush1"></textarea></label>';
					_html += '<div class="spacer"></div>';
					_html += '<label class="col1"><input type="checkbox" id="chk_ambush2">Enable button</label> ';
					_html += '<label class="col2">Button text: <input type="text" id="disp_ambush2"></label> ';
					_html += '<label class="col3">Shortcut key: <input type="text" value="" maxlength="1" id="key_ambush2"></label> ';
					_html += '<div class="spacer_mid"></div>';
					_html += '<label class="col4">Quicklist: <br><textarea id="ql_ambush2"></textarea></label>';
					_html += '<div class="spacer"></div>';
					_html += '<label class="col1"><input type="checkbox" id="chk_ambush3">Enable button</label> ';
					_html += '<label class="col2">Button text: <input type="text" id="disp_ambush3"></label> ';
					_html += '<label class="col3">Shortcut key: <input type="text" value="" maxlength="1" id="key_ambush3"></label> ';
					_html += '<div class="spacer_mid"></div>';
					_html += '<label class="col4">Quicklist: <br><textarea id="ql_ambush3"></textarea></label>';
					_html += '<div class="spacer"></div>';
					_html += '</td></tr>';
					_html += '<tr><td class="buttons"><span>v1.1</span>';
					_html += '<button id="btn_reset_quickset_ambush_settings">Reset Settings</button>&nbsp;<button id="btn_close_quickset_ambush_settings">Cancel</button>&nbsp;<button id="btn_quickset_ambush_settings">Save and Close</button>';
					_html += '</td></tr>';
					_html += '</table>';
				node.innerHTML = _html;
				document.getElementById('tdSpaceChart').parentNode.appendChild(node);
				document.getElementById('btn_reset_quickset_ambush_settings').addEventListener('click', this.ClickResetSettingsButton.bind(this), true);
				document.getElementById('btn_close_quickset_ambush_settings').addEventListener('click', this.ClickCloseSettingsButton.bind(this), true);
				document.getElementById('btn_quickset_ambush_settings').addEventListener('click', this.ClickSaveSettingsAndClose.bind(this), true);
			}
			this.ShowCurrentSettingsData();
			node.style.display = 'block';
		},

		ShowCurrentSettingsData: function() {
			for (var loop=0; loop<this.ButtonKeys.length; loop++) {
				var index = this.ButtonKeys[loop];
				var button = this.GetButtonData(index);
				document.getElementById('chk_' + index).checked = button.enabled;
				document.getElementById('disp_' + index).value = button.display;
				document.getElementById('key_' + index).value = button.shortcut;
				if (document.getElementById('ql_' + index)) document.getElementById('ql_' + index).value = button.quicklist;
			}
		},

		ClickCloseSettingsButton: function(e) {
			if (document.getElementById('quickset_ambush_settings_wrapper')) {
				document.getElementById('quickset_ambush_settings_wrapper').style.display = 'none';
			}
            this.FreezeFrame('off - but only if it was off previously');
		},

		ClickResetSettingsButton: function(e) {
			this.SaveButtonData(this.ButtonDataDefaults);
			document.location.replace(document.location.toString());
		},

		ClickSaveSettingsAndClose: function(e) {
			var obj = {};
			for (var loop=0; loop<this.ButtonKeys.length; loop++) {
				var index = this.ButtonKeys[loop];
				obj[index] = {};
				obj[index].enabled = document.getElementById('chk_' + index).checked;
				if (document.getElementById('disp_' + index)) obj[index].display = document.getElementById('disp_' + index).value;
				obj[index].shortcut = document.getElementById('key_' + index).value;
				if (document.getElementById('ql_' + index)) obj[index].quicklist = document.getElementById('ql_' + index).value;
			}
			this.SaveButtonData(obj);
			document.location.replace(document.location.toString());
		},

        SaveButtonData: function(obj) {
			var universe = window.location.host.substr(0, window.location.host.indexOf('.'));
			this.ButtonData = obj;
			GM_setValue(universe, JSON.stringify(obj));
		},

		BuildFullMarkup: function() {
			var html = '';
			html += '<span id="retreatpointcountdown"></span>';
			for (var loop=0; loop<this.ButtonKeys.length; loop++) {
				html += this.GetAButtonMarkup(this.ButtonKeys[loop]);
			}
			this.enabled = html != '';
			html += this.GetSettingsButtonMarkup();
			html += '<div id="errmsgdiv"></div>';
			return html;
		},

        AddButtonClickEvents: function() {
			for (var loop=0; loop<this.ButtonKeys.length; loop++) {
				if (document.getElementById(this.ButtonKeys[loop])) document.getElementById(this.ButtonKeys[loop]).addEventListener('click', this.HandleButtonClick.bind(this), true);
			}
			document.getElementById('quickset_ambush_settings').addEventListener('click', this.HandleSettingsButtonClick.bind(this), true);
		},

        HandleButtonClick: function(e) {
			switch (e.target.getAttribute('id')) {
				case 'setrp' : this.SetRetreatPoint(); break;
				case 'ambush1' : this.SetAmbush(1); break;
				case 'ambush2' : this.SetAmbush(2); break;
				case 'ambush3' : this.SetAmbush(3); break;
				case 'cloak' : this.Cloak(); break;
				default: return;
			}
		},

		AddButtonKeypressEvents: function() {
			window.addEventListener("keypress", this.HandleButtonKeyPress.bind(this), true);
		},

		HandleButtonKeyPress: function(e) {
			if (window.name == '' || e.ctrlKey || e.metaKey || e.altKey || e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA') return;
			var key = String.fromCharCode(e.which).toLowerCase();
			switch (key) {
				case this.GetButtonData('setrp').shortcut.toLowerCase() : this.SetRetreatPoint(); break;
				case this.GetButtonData('ambush1').shortcut.toLowerCase() : this.SetAmbush(1); break;
				case this.GetButtonData('ambush2').shortcut.toLowerCase() : this.SetAmbush(2); break;
				case this.GetButtonData('ambush3').shortcut.toLowerCase() : this.SetAmbush(3); break;
				case this.GetButtonData('cloak').shortcut.toLowerCase() : this.Cloak(); break;
				default: return;
			}
		},

		SetRetreatPointTime: function() {
			var universe = window.location.host.substr(0, window.location.host.indexOf('.'));
			GM_setValue(universe + 'RPTimeSet', new Date().getTime() + '');
			this.ShowRetreatPointCountdown();
		},

		ShowRetreatPointCountdown: function() {
			var universe = window.location.host.substr(0, window.location.host.indexOf('.'));
			var last_rp_set_time = GM_getValue(universe + 'RPTimeSet', 0);
			var delta = new Date().getTime() - last_rp_set_time
			if (delta < 1000 * 60 * 10) {
				var secs = Math.floor(delta / 1000);
				var mins = 9 - Math.floor(secs / 60);
				secs = secs % 60;
				secs = 59 - secs;
				if (secs < 10) secs = '0' + secs;
				if (mins < 1) {
					document.getElementById('retreatpointcountdown').style.color = 'red';
				} else
				if (mins < 2) {
					document.getElementById('retreatpointcountdown').style.color = 'gold';
				}
				document.getElementById('retreatpointcountdown').innerHTML = mins + ':' + secs;
				setTimeout(this.ShowRetreatPointCountdown.bind(this), 1000);
			} else {
				document.getElementById('retreatpointcountdown').innerHTML = '';
			}
		},

		SetRetreatPoint: function() {
			var button = document.getElementById('setrp');
			if (button && button.getAttribute('disabled') != 'disabled') {
				var url = 'main.php';
				var params = 'retreat_point_set=Yes';
				var that = this;
				GM_xmlhttpRequest({
					method: "POST",
					url: url,
					data: params,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": params.length,
						"Connection": 'close'
					}
					,onload: function(response) {
						that.SetRetreatPointTime();
						var locc = top.document.getElementById('msgframe').contentWindow.location.href;
						top.document.getElementById('msgframe').contentWindow.location.href = locc;
					}
				});
			}
		},

		Cloak: function() {
			if (document.getElementById('inputShipCloak')) {
				document.getElementById('inputShipCloak').click();
			} else
			if (document.getElementById('inputShipUncloak')) {
				document.getElementById('inputShipUncloak').click();
			}
		},

		ParseQuickList: function(quicklist) {
			function addToForm(name, value) {
				if (params != '') params += '&';
				params += name + '=' + value;
			}
			var _quicklist_array = quicklist.replace(/\s+/g,'').split(';');
			var params = '';
			if (!(_quicklist_array.length == 22 || _quicklist_array.length == 23)) {
				return {
					"error":true,
					"msg":"Quicklists must have either 22 or 23 entries delimited by a ; character"
				}
			}
			var _ransom = 0;
			if (_quicklist_array[0] == 'd') {
				addToForm('ambush_type', 'destroy');
			} else if (_quicklist_array[0] == 'r') {
				addToForm('ambush_type', 'raid');
			} else if (/^r[0-9]+$/.test(_quicklist_array[0])) {
				addToForm('ambush_type', 'raid');
				_ransom = _quicklist_array[0].substr(1);
			} else {
				return {
					"error":true,
					"msg":"The ambush type must one of either 'd' or 'r' (or 'r' followed by numbers)",
					"detail":""
				}
			}
			addToForm('ransom', _ransom);
			if (_quicklist_array[1] == 'm') addToForm('use_missiles', 'use_missiles');
			if (_quicklist_array[2] == 't') addToForm('attackers_trigger_ambush', 'attackers_trigger_ambush');
			if (_quicklist_array[3] == 'r') addToForm('retreat', 'retreat');
			if (_quicklist_array[4].indexOf('e') > -1) addToForm('attack_foes', 'attack_foes');
			if (_quicklist_array[4].indexOf('f') > -1) addToForm('attack_friends', 'attack_friends');
			if (_quicklist_array[4].indexOf('n') > -1) addToForm('attack_neutrals', 'attack_neutrals');
			if (_quicklist_array[5].indexOf('f') > -1) addToForm('attack_federation', 'attack_federation');
			if (_quicklist_array[5].indexOf('e') > -1) addToForm('attack_empire', 'attack_empire');
			if (_quicklist_array[5].indexOf('u') > -1) addToForm('attack_union', 'attack_union');
			if (_quicklist_array[5].indexOf('n') > -1) addToForm('attack_neutral', 'attack_neutral');
			// _quicklist_array[6] appears to have been left for a future purpose
			if (_quicklist_array[7].length) {
				if (/^f(:[0-9]+)?$/.test(_quicklist_array[7])) {
					addToForm('attack_bounties_fed', 'attack_bounties_fed');
					addToForm('attack_bounties_fed_value', _quicklist_array[7].substr(2));
				} else {
					return {
						"error":true,
						"msg":"The bounty for attacking federation bountied pilots is incorrect",
						"detail":"expected either 'f' or 'f:' followed by numbers"
					}
				}
			}
			if (_quicklist_array[8].length) {
				if (/^e(:[0-9]+)?$/.test(_quicklist_array[8])) {
					addToForm('attack_bounties_emp', 'attack_bounties_emp');
					addToForm('attack_bounties_emp_value', _quicklist_array[8].substr(2));
				} else {
					return {
						"error":true,
						"msg":"The bounty for attacking empire bountied pilots is incorrect",
						"detail":"expected either 'e' or 'e:' followed by numbers"
					}
				}
			}
			if (_quicklist_array[9].length) {
				if (/^u(:[0-9]+)?$/.test(_quicklist_array[9])) {
					addToForm('attack_bounties_uni', 'attack_bounties_uni');
					addToForm('attack_bounties_uni_value', _quicklist_array[9].substr(2));
				} else {
					return {
						"error":true,
						"msg":"The bounty for attacking union bountied pilots is incorrect",
						"detail":"expected either 'u' or 'u:' followed by numbers"
					}
				}
			}
			if (_quicklist_array[10].length) {
				if (/^n(:[0-9]+)?$/.test(_quicklist_array[10])) {
					addToForm('attack_bounties_priv', 'attack_bounties_priv');
					addToForm('attack_bounties_priv_value', _quicklist_array[10].substr(2));
				} else {
					return {
						"error":true,
						"msg":"The bounty for attacking private bountied pilots is incorrect",
						"detail":"expected either 'n' or 'n:' followed by numbers"
					}
				}
			}
			var _attack_mass = 'g';
			if (_quicklist_array[11].length) {
				let result = _quicklist_array[11].match(/^(l|g):([0-9]+)$/);
				if (result) {
					_attack_mass = result[1];
					addToForm('attack_mass_value', result[2]);
				} else {
					return {
						"error":true,
						"msg":"The attack mass is incorrect",
						"detail":"expected 'l:' or 'g:' followed by a number"
					}
				}
			}
			addToForm('attack_mass', {'l':'<', 'g':'>'}[_attack_mass]);
			if (_quicklist_array[12].indexOf('0') > -1) addToForm('attack_classes[]', '0');
			if (_quicklist_array[12].indexOf('1') > -1) addToForm('attack_classes[]', '1');
			if (_quicklist_array[12].indexOf('2') > -1) addToForm('attack_classes[]', '2');
			if (_quicklist_array[12].indexOf('3') > -1) addToForm('attack_classes[]', '3');
			if (_quicklist_array[12].indexOf('4') > -1) addToForm('attack_classes[]', '4');
			if (_quicklist_array[12].indexOf('5') > -1) addToForm('attack_classes[]', '5');
			if (_quicklist_array[12].indexOf('6') > -1) addToForm('attack_classes[]', '6');
			if (_quicklist_array[13] != '') {
				if (/^[0-9, ]+$/.test(_quicklist_array[13])) {
					let _tempArr = _quicklist_array[13].split(',');
					for (let loop=0; loop<_tempArr.length; loop++) {
						addToForm('attack_alliance_'+_tempArr[loop], _tempArr[loop]);
					}
				} else {
					return {
						"error":true,
						"msg":"The alliances to attack is incorrect",
						"detail":"only numbers and whitespace separated by commas are allowed"
					}
				}
			}
			if (_quicklist_array[14] != '') {
				if (/^[0-9, ]+$/.test(_quicklist_array[14])) {
					let _tempArr = _quicklist_array[14].split(',');
					for (let loop=0; loop<_tempArr.length; loop++) {
						addToForm('attack_individual_'+_tempArr[loop], _tempArr[loop]);
					}
				} else {
					return {
						"error":true,
						"msg":"The individuals to attack is incorrect",
						"detail":"only numbers and whitespace separated by commas are allowed"
					}
				}
			}
			if (_quicklist_array[15].indexOf('f') > -1) addToForm('exclude_friends', 'exclude_friends');
			if (_quicklist_array[15].indexOf('n') > -1) addToForm('exclude_neutrals', 'exclude_neutrals');
			if (_quicklist_array[16].indexOf('f') > -1) addToForm('exclude_federation', 'exclude_federation');
			if (_quicklist_array[16].indexOf('e') > -1) addToForm('exclude_empire', 'exclude_empire');
			if (_quicklist_array[16].indexOf('u') > -1) addToForm('exclude_union', 'exclude_union');
			if (_quicklist_array[16].indexOf('n') > -1) addToForm('exclude_neutral', 'exclude_neutral');
			var _exclude_mass = 'l';
			if (_quicklist_array[17].length) {
				let result = _quicklist_array[17].match(/^(l|g):([0-9]+)$/);
				if (result) {
					_exclude_mass = result[1];
					addToForm('exclude_mass_value', result[2]);
				} else {
					return {
						"error":true,
						"msg":"The exclude mass is incorrect",
						"detail":"expected 'l:' or 'g:' followed by a number"
					}
				}
			}
			addToForm('exclude_mass', {'l':'<', 'g':'>'}[_exclude_mass]);
			if (_quicklist_array[18].indexOf('0') > -1) addToForm('exclude_classes[]', '0');
			if (_quicklist_array[18].indexOf('1') > -1) addToForm('exclude_classes[]', '1');
			if (_quicklist_array[18].indexOf('2') > -1) addToForm('exclude_classes[]', '2');
			if (_quicklist_array[18].indexOf('3') > -1) addToForm('exclude_classes[]', '3');
			if (_quicklist_array[18].indexOf('4') > -1) addToForm('exclude_classes[]', '4');
			if (_quicklist_array[18].indexOf('5') > -1) addToForm('exclude_classes[]', '5');
			if (_quicklist_array[18].indexOf('6') > -1) addToForm('exclude_classes[]', '6');
			if (_quicklist_array[19] != '') {
				if (/^[0-9, ]+$/.test(_quicklist_array[19])) {
					let _tempArr = _quicklist_array[19].split(',');
					for (let loop=0; loop<_tempArr.length; loop++) {
						addToForm('exclude_alliance_'+_tempArr[loop], _tempArr[loop]);
					}
				} else {
					return {
						"error":true,
						"msg":"The alliances to exclude is incorrect",
						"detail":"only numbers and whitespace separated by commas are allowed"
					}
				}
			}
			if (_quicklist_array[20] != '') {
				if (/^[0-9, ]+$/.test(_quicklist_array[20])) {
					let _tempArr = _quicklist_array[20].split(',');
					for (let loop=0; loop<_tempArr.length; loop++) {
						addToForm('exclude_individual_'+_tempArr[loop], _tempArr[loop]);
					}
				} else {
					return {
						"error":true,
						"msg":"The individuals to exclude is incorrect",
						"detail":"only numbers and whitespace separated by commas are allowed"
					}
				}
			}
			if (parseInt(_quicklist_array[21],10) > 0 && parseInt(_quicklist_array[21],10) < 27) {
				addToForm('rounds', parseInt(_quicklist_array[21],10));
			} else {
				return {
					"error":true,
					"msg":"The number of rounds to ambush must be between 1 and 26 (inclusive)",
					"detail":""
				}
			}
			var _priority = 'exclusion';
			if (_quicklist_array.length == 23) {
				if (_quicklist_array[22].toLowerCase() == 's') {
					_priority = 'specific';
				}
			}
			addToForm('priority', _priority);
			addToForm('confirm', 'Lay+Ambush');
			return { 'error':false, 'params':params.replace(new RegExp( "\\n", "g" ), "") };
		},

		SetAmbush: function(index) {
			var button = document.getElementById('ambush' + index);
			if (button && button.getAttribute('disabled') != 'disabled') {
				var parsed = this.ParseQuickList(this.GetButtonData('ambush' + index).quicklist);
				if (parsed.error === true) {
                    button.style.backgroundColor = 'red';
                    button.setAttribute('disabled','disabled');
					var msgDiv = document.getElementById('errmsgdiv');
					if (msgDiv) {
						var html = '<p><b>WARNING!</b> Your attempt to set an ambush was unsuccessful</p>';
						html += '<p>' + parsed.msg + '</p>';
						if (parsed.detail != '') html += '<p><i>&ndash; ' + parsed.detail + '</i></p>';
						msgDiv.innerHTML = html;
					} else {
						console.log('WARNING! Your attempt to set an ambush was unsuccessful. ' + parsed.msg + ' - ' + parsed.msg);
					}
					return;
				}

                var frame = document.createElement('frame');
                frame.style.display = 'none';
                frame.name = 'quickSetAmbushFrame';
                frame.addEventListener('load', function() {
                    var locc = top.document.getElementById('msgframe').contentWindow.location.href;
                    top.document.getElementById('msgframe').contentWindow.location.href = locc;
                    document.location.replace(document.location.toString());
                });
                document.body.appendChild(frame);

                var frm = document.createElement('form');
                frm.style.display = 'none';
                frm.target = frame.name;
                frm.method = 'POST';
                frm.action = 'ambush.php';

                function appendToForm(frm, name, value) {
                    var el = document.createElement('input');
                    el.type = 'hidden';
                    el.name = name;
                    el.value = value;
                    frm.appendChild(el);
                }

                var paramData = parsed.params.split('&');
                for (var loop = 0; loop < paramData.length; loop++) {
                    var data = paramData[loop].split('=');
                    appendToForm(frm, data[0], data[1]);
                }

                document.body.appendChild(frm);
                frm.submit();
			}
		}

	};

	// run normally once
	QuicksetAmbush.Init();

	// hook in to allow for partial refresh
	unsafeWindow.addUserFunction(function(QSA) {
		return function() {
			if (QSA.enabled) QSA.UpdateButtonStates()
		};
	}(QuicksetAmbush));

}