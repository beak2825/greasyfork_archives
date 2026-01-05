// ==UserScript==
// @name        Advanced Combat Buttons
// @namespace   http://userscripts.xcom-alliance.info/
// @description Allows you to switch between Offensive, Balanced and Defensive combat modes without having to leave the navigation screen.
// @author      Miche (Orion) / Sparkle (Artemis)
// @include     http*://*.pardus.at/main.php*
// @include     http*://*.pardus.at/building.php*
// @include     http*://*.pardus.at/ship2ship_combat.php*
// @include     http*://*.pardus.at/ship2opponent_combat.php*
// @include     http*://*.pardus.at/overview_advanced_skills.php
// @version     2.2
// @icon 		http://userscripts.xcom-alliance.info/adv_combat_buttons/icon.png
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/11156/Advanced%20Combat%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/11156/Advanced%20Combat%20Buttons.meta.js
// ==/UserScript==

//Edited by Math (Orion) to include buttons for timebombs and agility boost.


/*****************************************************************************************
	Version Information

	03/09/2012 (Version 1.0)
	  - Initial release of the OC/BAL/DC buttons that do not require leaving the
	    navigation screen to switch.

	03/09/2012 (Version 2.0)
	  - Prevent changing to a combat skill if you don't have it trained
	
	04/09/2012 (Version 2.1)
	  - Changes to a combat skill on the overview advanced skills page are now also
	    monitored to ensure the navigation screen buttons remain in sync
	  - Switched to submitting the form into a frame rather than xhttp due to a bug between
	    Greasemonkey 1.0 and Firefox 15 not wrapping the response from the request for access.
	  - Added support for partial refresh should the pilot be using that
	
	
*****************************************************************************************/


/*****************************************************************************************
	Shared methods
*****************************************************************************************/

function getUniverse() {
	return window.location.host.substr(0, window.location.host.indexOf('.'));
};


/*****************************************************************************************
	Data Access Methods
*****************************************************************************************/

function getCurrentAdvancedCombatState() {
	var _state = GM_getValue(getUniverse()+'CurrentAdvCombatState', 'BA');
	return _state;
};

function setCurrentAdvancedCombatState(_state) {
	GM_setValue(getUniverse()+'CurrentAdvCombatState', _state);
};


/*****************************************************************************************
	Main Page Functionality
*****************************************************************************************/
if (document.URL.indexOf('pardus.at/main.php') > -1) {

//
//	Firefox 15 requires __exposedProps__ for Chrome wrapped JS Objects, yet Greasemonkey 1.0 does not
//	expose this property (the bug is fixed for 1.1). So instead of using the GM_XHTTP object, in the
//	following method - use a form submitting into a frame.
//
/*
	function updateAdvCombatButtonDisplay(_new_state) {
		var _button_current = document.getElementById('btn_adv_combat_'+getCurrentAdvancedCombatState());
		if (_button_current) _button_current.setAttribute('class','');
		var _button_new = document.getElementById('btn_adv_combat_'+_new_state);
		if (_button_new) _button_new.setAttribute('class','enabled');
	};
	
	function changeAdvCombatMode(_state) {
		var url = 'overview_advanced_skills.php';
		var params = '';
		params += 'action=switch_combat_mode';
		params += '&combat_mode=';
		if (_state == 'OC') {
			params += 'offensive';
		} else if (_state == 'DC') {
			params += 'defensive';
		} else {
			params += 'balanced';
		}
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

				var _b_all_good = true;
				if (_state == 'OC' && response.responseText.indexOf("value='Offensive' disabled class='disabled'>") > -1) {
					// OC is not trained
					_b_all_good = false;
				} else 
				if (_state == 'DC' && response.responseText.indexOf("value='Defensive' disabled class='disabled'>") > -1) {
					// DC is not trained
					_b_all_good = false;
				}
				if (_b_all_good) {
					updateAdvCombatButtonDisplay(_state);
					setCurrentAdvancedCombatState(_state);
				}

			}
		});
	};
*/

	function updateAdvCombatButtonDisplayFromFormLoad(evtData) {
		var _button_current = document.getElementById('btn_adv_combat_OC');
		if (_button_current) _button_current.setAttribute('class','');

		var _button_current = document.getElementById('btn_adv_combat_BA');
		if (_button_current) _button_current.setAttribute('class','');

		var _button_current = document.getElementById('btn_adv_combat_DC');
		if (_button_current) _button_current.setAttribute('class','');

		var _button_new = document.getElementById('btn_adv_combat_'+getCurrentAdvancedCombatState());
		if (_button_new) _button_new.setAttribute('class','enabled');
	};

	function changeAdvCombatModeUsingForm(_new_state) {
		function append_input(form, name, value) {
			var input = document.createElement("input");
			input.type = "hidden";
			input.name = name;
			input.value = value;
			form.appendChild(input);
		};

		var _form_id = 'adv_combat_update_form';
		var _frame_id = 'adv_combat_update_frame';
		var form = document.getElementById(_form_id);
		if (form) document.body.removeChild(form);
		form = document.createElement('form');
		form.style.display = 'none';
		form.action = 'overview_advanced_skills.php'
		form.method = 'post';
		form.target = _frame_id;
		form.id = _form_id;
		form.acceptCharset = 'utf-8';
		append_input(form, 'action', 'switch_combat_mode');
		if (_new_state == 'OC') {
			append_input(form, 'combat_mode', 'offensive');
		} else if (_new_state == 'DC') {
			append_input(form, 'combat_mode', 'defensive');
		} else {
			append_input(form, 'combat_mode', 'balanced');
		}
		document.body.appendChild(form);
		var frame = document.getElementById(_frame_id);
		if (!frame) {
			frame = document.createElement('iframe');
			frame.name = _frame_id;
			frame.id = frame.name;
			frame.style.display = "none";
			frame.addEventListener('load', updateAdvCombatButtonDisplayFromFormLoad, true);
			document.body.appendChild(frame);
		}
		form.submit();
	};

	function clickAdvCombatButton(evtData) {
		if (evtData.target.nodeName == 'BUTTON') {
			var btn = evtData.target;
			var _new_state = btn.getAttribute('id').substr(-2);
			if (_new_state != getCurrentAdvancedCombatState()) {
//
//	Firefox 15 requires __exposedProps__ for Chrome wrapped JS Objects, yet Greasemonkey 1.0 does not
//	expose this property (the bug is fixed for 1.1). So instead of using the GM_XHTTP object, in the
//	following method - use a form submitting into a frame.
//
//				changeAdvCombatMode(_new_state);
//
				changeAdvCombatModeUsingForm(_new_state);
			}
		}
	};

	function getAdvCombatButtonHTML(_state) {
		var _oc_html    = '<button id="btn_adv_combat_OC" class="' + (_state == 'OC' ? 'enabled' : '') + '">OC</button>';
		var _ba_html    = '<button id="btn_adv_combat_BA" class="' + (_state == 'BA' ? 'enabled' : '') + '">BAL</button>';
		var _dc_html    = '<button id="btn_adv_combat_DC" class="' + (_state == 'DC' ? 'enabled' : '') + '">DC</button>';
		var _ab_html    = '<button id="btn_AB">AB</button>';
		var _tb1_html    = '<button id="btn_T1">STUN</button>';
		var _tb2_html    = '<button id="btn_T2">AP TB</button>';
		return _oc_html + _ba_html + _dc_html + _ab_html + _tb1_html + _tb2_html;
	};

	function cssAdditions() {
		var CSS = document.createElement('STYLE');
		CSS.setAttribute('type','text/css');
		var css = '#advanced_combat_buttons_wrapper { margin:0px 18px 0;text-align:center; }' + '\n';
		   css += '#advanced_combat_buttons_wrapper button { width:54px;font-size:12px;color:#fff;padding:3px 5px;margin:2px; }' + '\n';
		   css += '#advanced_combat_buttons_wrapper .enabled { border-style:inset; }' + '\n';
		   css += '#advanced_combat_buttons_wrapper #btn_adv_combat_OC.enabled { background-color:#d20; }' + '\n';
		   css += '#advanced_combat_buttons_wrapper #btn_adv_combat_BA.enabled { background-color:#30c; }' + '\n';
		   css += '#advanced_combat_buttons_wrapper #btn_adv_combat_DC.enabled { background-color:#090; }' + '\n';
		CSS.innerHTML = css;
		document.body.appendChild(CSS);
	};

	// handle partial refresh scenario
	function runscript() {
		if (unsafeWindow.checkToDo !== undefined) {
			var local_checkToDo = unsafeWindow.checkToDo;
			unsafeWindow.checkToDo = function() {
				local_checkToDo();
				setTimeout(attachButtonsToStatusBox,1);
			}
		}
		attachButtonsToStatusBox();
	};
	
	function attachButtonsToStatusBox() {
		var _b_initial_run = false;
		if (!document.getElementById('advanced_combat_buttons_wrapper')) {
			_b_initial_run = true;
			cssAdditions();
			div = document.createElement('div');
			div.setAttribute('id','advanced_combat_buttons_wrapper');
			div.innerHTML = getAdvCombatButtonHTML(getCurrentAdvancedCombatState());
		}
		var node = document.getElementById('status_content');
		if (node) node.parentNode.appendChild(div);
		if (_b_initial_run) {
			document.getElementById('btn_adv_combat_OC').addEventListener('click', clickAdvCombatButton, true);
			document.getElementById('btn_adv_combat_BA').addEventListener('click', clickAdvCombatButton, true);
			document.getElementById('btn_adv_combat_DC').addEventListener('click', clickAdvCombatButton, true);
			document.getElementById('btn_AB').addEventListener('click', clickTBorABButton, true);
			document.getElementById('btn_T1').addEventListener('click', clickTBorABButton, true);
			document.getElementById('btn_T2').addEventListener('click', clickTBorABButton, true);
		}
	};
	
	runscript();

} else

/*****************************************************************************************
	Overview Advanced Skills Page Functionality, Building Page Functionality, 
	NPC Combat Functionality and PvP Combat Functionality
*****************************************************************************************/
if (document.URL.indexOf('pardus.at/overview_advanced_skills.php') > -1 || document.URL.indexOf('pardus.at/building.php') > -1 
	|| document.URL.indexOf('pardus.at/ship2opponent_combat.php') > -1 || document.URL.indexOf('pardus.at/ship2ship_combat.php') > -1) {

	function clickAdvCombatButton(evtData) {
		if (evtData.target.nodeName == 'INPUT') {
			var btn = evtData.target;
			if (btn.value == 'Offensive') {
				setCurrentAdvancedCombatState('OC');
			} else if (btn.value == 'Defensive') {
				setCurrentAdvancedCombatState('DC');
			} else {
				setCurrentAdvancedCombatState('BA');
			}
		}
	};

	var _oc_button = document.querySelector('input[type=submit][value=Offensive]');
	if (_oc_button) _oc_button.addEventListener('click', clickAdvCombatButton, true);
	var _ba_button = document.querySelector('input[type=submit][value=Balanced]');
	if (_ba_button) _ba_button.addEventListener('click', clickAdvCombatButton, true);
	var _dc_button = document.querySelector('input[type=submit][value=Defensive]');
	if (_dc_button) _dc_button.addEventListener('click', clickAdvCombatButton, true);

	if (document.URL.indexOf('pardus.at/overview_advanced_skills.php') > -1) {
		var els = document.getElementsByTagName('B');
		var _state = 'BA';
		for (var loop=0; loop<els.length; loop++) {
			if (els[loop].textContent == 'DEFENSIVE') {
				_state = 'DC';
				break;
			} else
			if (els[loop].textContent == 'OFFENSIVE') {
				_state = 'OC';
				break;
			}
		}
		setCurrentAdvancedCombatState(_state);
	}
}

//Math's edits to create buttons for TBs and Agility boost.

function setTimebombUsingForm(tbType) {
	function append_input(form, name, value) {
		var input = document.createElement("input");
		input.type = "hidden";
		input.name = name;
		input.value = value;
		form.appendChild(input);
	};

	var _form_id = 'tb_form';
	var _frame_id = 'tb_frame';
	var form = document.getElementById(_form_id);
	if (form) document.body.removeChild(form);
	form = document.createElement('form');
	form.style.display = 'none';
	form.action = 'overview_advanced_skills.php'
	form.method = 'post';
	form.target = _frame_id;
	form.id = _form_id;
  form.acceptCharset = 'utf-8';
	append_input(form, 'action', 'deploy_timebomb');
	if (tbType == 'T1') {
		append_input(form, 'timebomb_type', 'type_1');
	} else {
		append_input(form, 'timebomb_type', 'type_2');
	}
	document.body.appendChild(form);
	var frame = document.getElementById(_frame_id);
	if (!frame) {
		frame = document.createElement('iframe');
		frame.name = _frame_id;
		frame.id = frame.name;
		frame.style.display = "none";
		document.body.appendChild(frame);
	}
	form.submit();
};

function boostAgilityUsingForm() {
	function append_input(form, name, value) {
		var input = document.createElement("input");
		input.type = "hidden";
		input.name = name;
		input.value = value;
		form.appendChild(input);
	};

	var _form_id = 'agility_form';
	var _frame_id = 'agility_frame';
	var form = document.getElementById(_form_id);
	if (form) document.body.removeChild(form);
	form = document.createElement('form');
	form.style.display = 'none';
	form.action = 'overview_advanced_skills.php'
	form.method = 'post';
	form.target = _frame_id;
	form.id = _form_id;
	form.acceptCharset = 'utf-8';
	append_input(form, 'action', 'boost');
	append_input(form, 'boost', 'agility');
	document.body.appendChild(form);
	var frame = document.getElementById(_frame_id);
	if (!frame) {
		frame = document.createElement('iframe');
		frame.name = _frame_id;
		frame.id = frame.name;
		frame.style.display = "none";
		document.body.appendChild(frame);
	}
	form.submit();
}

function clickTBorABButton(evtData) {
	if (evtData.target.nodeName == 'BUTTON') {
		var btn = evtData.target;
		var btnType = btn.getAttribute('id').substr(-2);
		if (btnType == "AB") {
			boostAgilityUsingForm();
		} else {
			setTimebombUsingForm(btnType)
		}
	}
}
