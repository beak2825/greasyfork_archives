// ==UserScript==
// @name            Greasy Fork (Firefox)V1.27
// @id              srazzano/Greasy Fork (Firefox)@greasespot.net
// @version         1.2.7
// @description     Enhancement for greasyfork.org site
// @author          Sonny Razzano
// @namespace       srazzano
// @license         MIT
// @include         /^https?://greasyfork\.org/(?!forum).*$/
// @homepageURL     https://greasyfork.org/scripts/43
// @supportURL      https://greasyfork.org/scripts/43/feedback
// @icon            https://mediacru.sh/dfYwFoxae8AO.png
// @icon64URL       https://mediacru.sh/dfYwFoxae8AO.png
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_setClipboard
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/389542/Greasy%20Fork%20%28Firefox%29V127.user.js
// @updateURL https://update.greasyfork.org/scripts/389542/Greasy%20Fork%20%28Firefox%29V127.meta.js
// ==/UserScript==

var gf_1 = '#', gf_2 = 'Name', gf_3 = 'Description', gf_4 = 'Author', gf_5 = 'Daily', gf_6 = 'Total', gf_7 = 'Created', gf_8 = 'Updated', gf_9 = 'Options', gf_10 = 'Greasy Fork Options', gf_11 = 'Install';
var gf_12 = 'Scripts per page (max 200)', gf_13 = 'Sort list on page open by', gf_14 = 'Theme', gf_15 = 'Name/Description cells tooltips', gf_16 = 'Author&apos;s script count';
var gf_17 = 'Highlight All Created/Updated cells (select days ago &amp; prior)', gf_18 = 'Create a link', gf_19 = 'Styles', gf_20 = 'Label', gf_21 = '&quot;Help&quot; Link', gf_22 = '&quot;Post a new script&quot; Link';
var gf_23 = 'Url', gf_24 = 'Filter by text in Name/Author', gf_25 = 'Case-sensitive', gf_26 = '', gf_27 = 'Options / Filtered \u2006';
var gf_28 = 'Custom links w/labels: insert site domain and an asterisk and enter label name (comma separate multiple entries)', gf_29 = '', gf_30 = 'Width', gf_31 = 'Height', gf_32 = 'Left', gf_33 = 'Top';
var gf_34 = 'Filter popup:', gf_35 = 'Right-click to save prefs to clipboard', gf_36 = 'Size/Position filtered list popup in Options', gf_37 = 'Left-click for Options', gf_38 = 'English List only';
var gf_39 = 'Middle or Ctrl + Left-click to show/hide filtered list popup', gf_40 = 'Filter Ideograms', gf_41 = 'facebook.com*Facebook,google.com*Google,greasyfork.org*GreasyFork,mozillazine.org*mozillaZine,';
var gf_42 = 'twitter.com*Twitter,youtube.com*YouTube'; gf_43 = '', gf_44 = '', gf_45 = 'Right', gf_46 = 'Bottom';

(function () {
  if (typeof devtools == 'undefined') var devtools = {};
  if (typeof devtools.JSON == 'undefined') {
	  devtools.JSON = {};
	  devtools.JSON.stringify = function (obj) {
		  obj = JSON.stringify(obj);
		  return obj.replace(/"/g, '!~dq~!').replace(/'/g, '!~sq~!');
	  };
	  devtools.JSON.parse = function (str) {
		  str = str.replace(/!~dq~!/g, '"').replace(/!~sq~!/g, "'");
		  return JSON.parse(str);
	  };
  }

  devtools.dialog = {
	  open: function (options, id) {
		  this.__setVars(options);
		  if (!id) id = (new Date()).getTime() + '-' + Math.floor(Math.random() * 100001);
		  this.__var.lastDialogId = id;
		  var wrapper = document.getElementById('devtools-wrapper');
		  if (!wrapper) {
			  wrapper = document.createElement('div');
			  wrapper.id = 'devtools-wrapper';
			  wrapper.innerHTML = '\
<div class="grid">\
<div id="devtools-cell-topleft" class="dialog-wrapper top left"><div><div></div></div></div>\
<div id="devtools-cell-top" class="dialog-wrapper top"><div><div></div></div></div>\
<div id="devtools-cell-topright" class="dialog-wrapper top right"><div><div></div></div></div>\
<div id="devtools-cell-left" class="dialog-wrapper left"><div><div></div></div></div>\
<div id="devtools-cell-center" class="dialog-wrapper center"><div><div></div></div></div>\
<div id="devtools-cell-right" class="dialog-wrapper right"><div><div></div></div></div>\
<div id="devtools-cell-bottomleft" class="dialog-wrapper bottom left"><div><div></div></div></div>\
<div id="devtools-cell-bottom" class="dialog-wrapper bottom"><div><div></div></div></div>\
<div id="devtools-cell-bottomright" class="dialog-wrapper bottom right"><div><div></div></div></div>\
</div>';
        document.body.appendChild(wrapper);
			  wrapper = document.getElementById('devtools-wrapper');
			  this.__handleHooks();
		  }
		  wrapper.className = (this.__setting.mask) ? 'mask' : '';
		  var dialog = document.getElementById('devtools-dialog-' + id);
		  if (!dialog || dialog.parentNode.parentNode.parentNode.id !== 'devtools-cell-' + this.__setting.location.replace('-', '')) {
			  if (dialog) dialog.parentNode.removeChild(dialog);
			  dialog = document.createElement('div');
			  dialog.id = 'devtools-dialog-' + id;
			  dialog.className = 'dialog' + ((this.__setting.class && this.__setting.class != '') ? ' ' + this.__setting.class : '');
			  dialog.innerHTML = '\
<div class="dialog-close"><span>X</span></div>\
<div class="dialog-title"><span></span></div>\
<div class="dialog-content"></div>\
<div class="dialog-footer"></div>';
			  wrapper.querySelector('#devtools-cell-' + this.__setting.location.replace('-', '') + ' > div > div').appendChild(dialog);
			  dialog = document.getElementById('devtools-dialog-' + id);
			  dialog.querySelector('.dialog-close').addEventListener('click', function () {
				  devtools.dialog.close(this.parentNode.getAttribute('id').replace(/^devtools-dialog-/, ''));
			  }, false);
		  }
		  dialog.querySelector('.dialog-close').style.display = (this.__setting.closeButton) ? 'block' : 'none';
		  dialog.querySelector('.dialog-title').firstElementChild.textContent = this.__setting.title;
		  dialog.querySelector('.dialog-content').innerHTML = this.__parseTokens(this.__setting.message);
		  dialog.querySelector('.dialog-footer').textContent = '';
		  var button, buttonImg, i;
		  for (i = 0; i < this.__setting.buttons.length; i++) {
			  button = document.createElement('button');
			  button.textContent = this.__setting.buttons[i].text;
			  button.setAttribute('data-devtools-dialog-button', this.__setting.buttons[i].text);
			  if (this.__setting.buttons[i].icon) {
				  buttonImg = document.createElement('img');
				  buttonImg.setAttribute('src', this.__setting.buttons[i].icon);
				  buttonImg.setAttribute('alt', '');
				  button.insertBefore(buttonImg, button.firstChild);
			  }
			  if (typeof this.__setting.buttons[i].tooltip == 'string') button.setAttribute('title', this.__setting.buttons[i].tooltip);
			  button.addEventListener('click', this.__setting.buttons[i].callback, false);
			  dialog.querySelector('.dialog-footer').appendChild(button);
		  }
		  var style = document.getElementById('devtools-dialog-style');
		  if (!style || style.className != this.__setting.theme) {
			  if (style) style.parentNode.removeChild(style);
			  style = document.createElement('style');
			  style.id = 'devtools-dialog-style';
			  style.className = this.__setting.theme;
			  style.setAttribute('type', 'text/css');
			  style.textContent = this.__themes[this.__setting.theme].finalcss || (this.__themes._base.css + '\n' + this.__themes[this.__setting.theme].css);
			  document.querySelector('head').appendChild(style);
		  }
		  return id;
	  },

	  close: function (id) {
		  if (!id) {
			  if (!this.__var.lastDialogId) return false;
			  id = this.__var.lastDialogId;
		  }
		  var dialog = document.getElementById('devtools-dialog-' + id);
		  if (!dialog) return false;
		  else {
			  dialog.querySelector('.dialog-close').removeEventListener('click', function () {
				  devtools.dialog.close(this.parentNode.getAttribute('id').replace(/^devtools-dialog-/, ''));
			  }, false);
			  var inputs = this.getInputs(id);
			  dialog.parentNode.removeChild(dialog);
		  }
		  if (document.querySelector('div[id*="devtools-dialog-"]') == null) {
			  var wrapper = document.getElementById('devtools-wrapper');
			  wrapper.parentNode.removeChild(wrapper);
			  var styles = document.querySelectorAll('head style[id^="devtools-dialog-theme-"]');
			  for (var i = 0; i < styles.length; i++) styles[i].parentNode.removeChild(styles[i]);
		  }
		  return inputs;
	  },

	  setDefaults: function (options) {
		  this.__userDefaults = {};
		  for (var i in options) {
			  if (this.__defaults.hasOwnProperty(i)) this.__userDefaults[i] = options[i];
		  }
	  },

	  defineToken: function (tag, attributes, replacement) {
		  if (typeof tag != 'string' || /^\w+$/.test(tag) === false) return false;
		  if (typeof this.__tokens[tag] != 'undefined') return false;
		  if (typeof attributes == 'object' && attributes != null) {
			  for (var a in attributes) {
				  if (!attributes.hasOwnProperty(a)) continue;
				  if (typeof attributes[a].validation == 'undefined') return false;
		  } }
		  else attributes = {};
		  if (typeof replacement != 'function' && typeof replacement != 'string') return false;
		  this.__tokens[tag] = {
			  attributes: attributes,
			  replacement: replacement
		  };
		  return true;
	  },
	
	  defineTheme: function (name, css, base) {
		  if (typeof name != 'string' || typeof css != 'string') return false;
		  if (!/^\w+$/.test(name) || name == 'default') return false;
		  var cssOut = '';
		  var bases = {};
		  var baseTmp = base;
		  if (typeof base == 'string') {
			  for (var i = 0; i < 5; i++) {
				  if (this.__themes[baseTmp] && !bases[baseTmp]) {
					  cssOut = '/* devtools.dialog prerequisite theme: ' + baseTmp + ' */\n' + this.__themes[baseTmp].css + '\n\n' + cssOut;
					  bases[baseTmp] = true;
					  baseTmp = this.__themes[baseTmp].base;
				  }
				  else break;
		  } }
		  else base = null;
		  cssOut = ('/* devtools.dialog base reset */\n' + this.__themes._base.css + "\n\n" + cssOut + '/* devtools.dialog theme: ' + name + ' */\n' + css).replace('%theme%', name);
		  this.__themes[name] = {
			  base: base,
			  finalcss: cssOut,
			  css: css
		  };
		  return true;
	  },

	  defineHook: function (name, func) {
		  if (typeof this.__hooks[name] != 'undefined' || typeof func != 'function') return false;
		  this.__hooks[name] = func;
		  return true;
	  },

	  getInputs: function (id) {
		  if (!id) {
			  if (!this.__var.lastDialogId) return false;
			  id = this.__var.lastDialogId;
		  }
		  var dialog = document.querySelector('#devtools-dialog-' + id);
		  if (dialog) {
			  var out = {}, i, j;
			  var simpleInputs = dialog.querySelectorAll('[data-devtools-input="text"], [data-devtools-input="select"]');
			  for (i = 0; i < simpleInputs.length; i++) out[simpleInputs[i].getAttribute('name')] = simpleInputs[i].value;
			  var checkboxInputs = dialog.querySelectorAll('[data-devtools-input="checkbox"]');
			  for (i = 0; i < checkboxInputs.length; i++) out[checkboxInputs[i].getAttribute('name')] = (checkboxInputs[i].checked) ? true : false;
			  var radioInputs = dialog.querySelectorAll('[data-devtools-input="radio"]');
			  var radios;
			  for (i = 0; i < radioInputs.length; i++) {
				  radios = radioInputs[i].querySelectorAll('input');
				  for (j = 0; j < radios.length; j++) {
					  if (radios[j].checked) {
						  out[radios[j].getAttribute('name').split('-')[0]] = radios[j].value;
						  break;
			  } } }
			  return out;
		  }
		  return false;
	  },

	  __var: {
		  lastDialogId: false
	  },

	  __defaults: {
		  title: 'Script Notification',
		  message: 'This is a dialog from a userscript.',
		  mask: true,
		  closeButton: true,
		  location: 'center',
		  buttons: null,
		  theme: 'default',
		  class: ''
	  },
		
	  __settingsValidation: {
		  title: ['type', 'string'],
		  message: ['type', 'string'],
		  mask: ['type', 'boolean'],
		  closeButton: ['type', 'boolean'],
		  location: ['match', /^(top-left|top|top-right|left|center|right|bottom-left|bottom|bottom-right)$/],
		  buttons: null,
		  theme: null,
		  class: ['match', /^[\w- ]+$/]
	  },

	  __themes: {
		  '_base': {
			  css: '\
#devtools-wrapper,#devtools-wrapper *{border-radius:0!important;box-shadow:none!important;background:transparent!important;border:none!important;border-collapse:separate!important;border-spacing:0!important;color:#000!important;float:none!important;font-family:Arial,sans-serif!important;font-size:12px!important;font-weight:400;height:auto!important;letter-spacing:normal!important;line-height:18px!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1.0!important;padding:0!important;text-align:left!important;text-decoration:none!important;text-shadow:none!important;text-transform:none!important;vertical-align:middle!important;visibility:hidden!important;white-space:normal!important;width:auto!important;}\
#devtools-wrapper .dialog-content fieldset>label>input{position:relative;top:0}\
#devtools-wrapper{background-color:rgba(0, 0, 0, 0.8)!important;height:100%!important;left:0!important;overflow:auto!important;position:fixed!important;top:0!important;visibility:hidden!important;width:100%!important;z-index:2147483640!important;}\
#devtools-wrapper.mask{background-color:rgba(0, 0, 0, 0.8)!important;visibility:visible!important;}\
#devtools-wrapper .grid{display:table!important;height:100%!important;position:fixed!important;visibility:hidden!important;width:100%!important;}\
#devtools-wrapper .center,#devtools-wrapper .top,#devtools-wrapper .bottom,#devtools-wrapper .left,#devtools-wrapper .right{display:table-cell!important;padding:15px!important;}\
#devtools-wrapper .left,#devtools-wrapper .center,#devtools-wrapper .right{vertical-align:middle!important;}\
#devtools-wrapper .top{vertical-align:top!important;}\
#devtools-wrapper .bottom{vertical-align:bottom!important;}\
#devtools-wrapper .left .dialog{clear:both!important;float:left!important;}\
#devtools-wrapper .right .dialog{clear:both!important;float:right!important;}\
#devtools-wrapper .center .dialog,#devtools-wrapper .bottom .dialog,#devtools-wrapper .top .dialog{margin-left:auto!important;margin-right:auto!important;}\
#devtools-wrapper .dialog,#devtools-wrapper .dialog *{visibility:visible!important;}\
#devtools-wrapper .dialog fieldset{border:1px solid #000!important;margin-bottom:10px!important;padding:5px!important;}\
#devtools-wrapper .dialog legend{padding:0 5px!important;}\
#devtools-wrapper .dialog input[type="text"],#devtools-wrapper input[type="password"],#devtools-wrapper textarea,#devtools-wrapper select{-moz-appearance:none!important;box-sizing:border-box!important;background:#444!important;border:1px solid transparent!important;box-sizing:border-box!important;color:#FFF!important;}\
#devtools-wrapper .dialog input[type="checkbox"],#devtools-wrapper input[type="radio"]{margin-right:6px!important;vertical-align:top!important;}\
#devtools-wrapper .dialog input[type="radio"]+span{margin-right:12px!important;vertical-align:middle!important;}\
#devtools-wrapper .dialog .progress-bar{box-sizing:border-box!important;background-color:#fff!important;border:1px solid #000!important;box-sizing:border-box!important;height:20px!important;margin-left:auto!important;margin-right:auto!important;overflow:hidden!important;position:relative!important;width:100%!important;}\
#devtools-wrapper .dialog .progress-bar-inner{background-color:#000!important;height:100%!important;left:0!important;position:absolute!important;top:0!important;}\
#devtools-wrapper .dialog .progress-bar-text{height:100%!important;position:relative!important;text-align:center!important;width:100%!important;z-index:1!important;}\
#devtools-wrapper .dialog .dialog-content br:first-child, #devtools-wrapper .dialog .dialog-content br:last-child{display:none!important;}\
#devtools-wrapper .dialog strong{font-weight:bold!important;}\
#devtools-wrapper .dialog em{font-style:italic!important;}\
#devtools-wrapper .dialog ins{text-decoration:underline!important;}\
#devtools-wrapper .dialog a:link,#devtools-wrapper .dialog a:hover{color:EE0000!important;text-decoration:underline!important;}\
#devtools-wrapper .dialog a:visited{color:#74198b!important;}\
		  '},
			
		  'default': {
			  css: '\
#devtools-wrapper .dialog{border-radius:10px!important;box-shadow:0 0 50px #000!important;background-color:#eee !important;margin-bottom:5px!important;margin-top:5px!important;padding:4px!important;position:relative!important;}\
#devtools-wrapper .dialog .dialog-close span{color:#eee!important;font-size:18px!important;font-weight:700;line-height:25px!important;vertical-align:middle!important;}\
#devtools-wrapper .dialog .dialog-title{border-radius:5px!important;background-color:#444!important;color:#eee!important;height:15px!important;padding:4px 0 7px 0!important;text-align:center!important}\
#devtools-wrapper .dialog .dialog-title span{color:#eee!important;font-size:14px!important;font-weight:700;}\
#devtools-wrapper .dialog .dialog-footer{text-align:center!important;width:100%!important;}\
#devtools-wrapper .dialog .dialog-footer button{background:linear-gradient(#555,#222)!important;border:1px solid #333!important;box-shadow:0 0 1px #666 inset!important;border-radius:10px!important;color:#FFF!important;cursor:pointer!important;display:inline-block!important;height:25px!important;margin-left:2px!important;margin-right:2px!important;padding:0px 5px!important;}\
#devtools-wrapper .dialog .dialog-footer button:hover{background:linear-gradient(#222,#555)!important;}\
#devtools-wrapper .dialog hr{background-color:#ddd!important;margin:7px 0 7px 0!important;}\
#devtools-wrapper .dialog fieldset{border-radius:4px!important;border:1px solid #aaa!important}\
#devtools-wrapper .dialog label{-moz-box-align:center!important;display:block!important;font-weight:bold!important;}\
#devtools-wrapper .dialog label span{font-weight:normal!important;position:relative!important;top:-3px!important}\
#devtools-wrapper .dialog legend{font-weight:bold!important;}\
#devtools-wrapper .dialog input[type="text"],#devtools-wrapper input[type="password"],#devtools-wrapper textarea,#devtools-wrapper select{border-radius:4px!important;background:#444!important;border:1px solid transparent!important;color:#FFF!important}\
#devtools-wrapper .dialog input[type="text"]:focus,#devtools-wrapper input[type="password"]:focus,#devtools-wrapper textarea:focus,#devtools-wrapper select:focus{border:1px solid #444!important;}\
#devtools-wrapper .dialog input[type="checkbox"] label{display:block!important;}\
#devtools-wrapper .dialog .progress-bar{border-radius:5px!important;background-color:#fafafa!important;border:1px solid #ddd!important}\
#devtools-wrapper .dialog .progress-bar-inner{border-radius:5px!important;background-color:#444!important}\
#devtools-wrapper .dialog .progress-bar-text{text-shadow:#f2f2f2 -1px 0 3px #f2f2f2 0 -1px 3px #f2f2f2 1px 0 3px #f2f2f2 0 1px 3px #f2f2f2 -1px -1px 3px #f2f2f2 1px 1px 3px!important;}\
#devtools-wrapper .dialog-content div:nth-child(2) label span{position:relative!important;top:0!important}\
#devtools-wrapper .dialog-content>div:nth-child(2)>label>span{position:relative!important;top:-3px!important}\
		  '}
	  },

	  __tokens: {
		  'progressbar': {
			  attributes: {
				  'percent': {
					  defaultValue: '',
					  validation: /^(100|\d{1,2})$/
				  },
				  'calculate': {
					  defaultValue: '',
					  validation: /^\s*\d+\s*\/\s*\d+\s*$/
				  }
			  },
			  replacement: function (tag) {
				  var p;
				  if (tag.attributes.calculate != '') {
					  p = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(tag.attributes.calculate);
					  if (p) {
						  p = (p[1] / p[2]) * 10000;
						  p = Math.round(p) / 100;
					  }
					  else p = 0;
				  }
				  else if (tag.attributes.percent != '') p = tag.attributes.percent;
				  else return false;
				  if (p > 100) p = 100;
				  if (p < 0) p = 0;
				  p += '%';
				  return '<div class="progress-bar"><div class="progress-bar-text">' + p + '</div><div class="progress-bar-inner" style="width: ' + p + ' !important;"></div></div>';
			  }
		  },
		  'input': {
			  attributes: {
				  'type': {
					  validation: /^(text|textarea|radio|checkbox|select|password)$/
				  },
				  'name': {
					  validation: /^\w+$/
				  },
				  'label': {
					  defaultValue: '',
					  validation: false
				  },
				  'options': {
					  defaultValue: '',
					  validation: /^{.+}$/
				  },
				  'defaultValue': {
					  defaultValue: '',
					  validation: false
				  },
				  'hook': {
					  defaultValue: '',
					  validation: /^\w+$/
				  }
			  },
			  replacement: function (tag) {
				  var r = false;
				  switch (tag.attributes.type) {
					  case 'text':
						  r = '<label>' + tag.attributes.label + '<input type="text" name="' + tag.attributes.name + '" value="' + tag.attributes.defaultValue + '" data-devtools-input="text"/></label>';
					    break;
					  case 'password':
						  r = '<label>' + tag.attributes.label + '<input type="password" name="' + tag.attributes.name + '" value="' + tag.attributes.defaultValue + '" data-devtools-input="text"/></label>';
					    break;
					  case 'textarea':
						  r = '<label>' + tag.attributes.label + '<textarea name="' + tag.attributes.name + '" data-devtools-input="text">' + tag.attributes.defaultValue + '</textarea></label>';
					    break;
					  case 'checkbox':
						  r = '<div><label><input type="checkbox" name="' + tag.attributes.name + '"' + ((tag.attributes.defaultValue == 'true') ? ' checked' : '') + ' data-devtools-input="checkbox"/><span>' + tag.attributes.label + '</span></label></div>';
					    break;
					  case 'radio':
						  try {
							  var options = devtools.JSON.parse(tag.attributes.options);
							  var hash = Math.floor(Math.random() * 100000);
							  r = '<div data-devtools-input="radio"><fieldset><legend>' + tag.attributes.label + '</legend>';
							  for (var key in options) {
								  r += '<label><input type="radio" name="' + tag.attributes.name + '-' + hash + '" value="' + options[key] + '"';
								  r += ((tag.attributes.defaultValue == options[key]) ? ' checked' : '') + '/><span>' + key + '</span></label>';
							  }
							  r += '</fieldset></div>';
						  } catch (e) {return false;}
					    break;
					  case 'select':
						  try {
							  var options = devtools.JSON.parse(tag.attributes.options);
							  r = '<div><label>' + tag.attributes.label + '</label>';
							  r += '<select name="' + tag.attributes.name + '"' + ((tag.attributes.hook == 'color') ? ' data-devtools-hook="' + tag.attributes.hook + '"' : '') + ' data-devtools-input="select">';
							  for (var key in options) {
								  if (typeof options[key] == 'string') {
									  r += '<option value="' + options[key] + '"';
									  r += (tag.attributes.hook == 'color' && /^#[0-9a-f]{3,6}$/i.test(options[key])) ? ' style="background-color:' + options[key] + ' !important;"' : '';
									  r += ((tag.attributes.defaultValue == options[key]) ? ' selected' : '') + '>' + key + '</option>';
							  } }
							  r += '</select></div>';
						  } catch (e) {return false;}
					    break;
				  }
				  return r;
		  } }
	  },

	  __hooks: {
		  'color': function () {
			  var el = document.querySelectorAll('[data-devtools-hook="color"]');
			  if (!el) return;
			  setInterval(function () {
				  var el = document.querySelectorAll('[data-devtools-hook="color"]');
				  if (el) {
					  for (var i = 0; i < el.length; i++) {
						  if (/^#[0-9a-f]{3,6}$/i.test(el[i].value)) el[i].setAttribute('style', 'background-color: ' + el[i].value + ' !important');
				  } }
			  }, 500);
		  }
	  },

	  __userDefaults: {},

	  __setting: {},

	  __handleHooks: function () {
		  for (var hook in this.__hooks) this.__hooks[hook]();
	  },

	  __setVars: function (options) {
		  this.__setting = {};
		  var out = this.__copyObj(this.__defaults);
		  var setting, validationCopy, validationCount, valid;
		  for (setting in this.__userDefaults) {
			  if (this.__defaults.hasOwnProperty(setting)) out[setting] = this.__copyObj(this.__userDefaults[setting]);
		  }
		  if (typeof options == 'object') {
			  for (setting in options) {
				  if (this.__defaults.hasOwnProperty(setting)) out[setting] = options[setting];
		  } }
		  for (setting in out) {
			  if (setting == 'buttons') {
				  this.__setting[setting] = this.__validateButtons(out[setting]);
				  continue;
			  }
			  if (setting == 'theme') {
				  this.__setting[setting] = this.__validateTheme(out[setting]);
				  continue;
			  }
			  if (this.__settingsValidation.hasOwnProperty(setting)) {
				  validationCopy = this.__copyObj(this.__settingsValidation[setting]);
				  valid = false;
				  switch(validationCopy.shift()) {
					  case 'type':
						  for (validationCount = 0; validationCount < validationCopy.length; validationCount++) {
							  if (validationCopy[validationCount] == 'array') {
								  if (out[setting] instanceof Array) {
									  valid = true;
									  this.__setting[setting] = out[setting];
									  break;
								  }
								  else if (this.__userDefaults[setting] instanceof Array) {
									  valid = true;
									  this.__setting[setting] = this.__userDefaults[setting];
									  break;
							  } }
							  else if (typeof out[setting] == validationCopy[validationCount]) {
								  valid = true;
								  this.__setting[setting] = out[setting];
								  break;
							  }
							  else if (typeof this.__userDefaults[setting] == validationCopy[validationCount]) {
								  valid = true;
								  this.__setting[setting] = this.__userDefaults[setting];
								  break;
						  } }
					    break;
					  case 'match':
						  for (validationCount = 0; validationCount < validationCopy.length; validationCount++) {
							  if (validationCopy[validationCount].test(out[setting])) {
								  valid = true;
								  this.__setting[setting] = out[setting];
								  break;
							  }
							  else if (validationCopy[validationCount].test(this.__userDefaults[setting])) {
								  valid = true;
								  this.__setting[setting] = this.__userDefaults[setting];
								  break;
						  } }
					  break;
				  }
				  if (!valid) this.__setting[setting] = this.__copyObj(this.__defaults[setting]);
		  } }
	  },

	  __validateButtons: function (buttons) {
		  var btns = [];
		  if (typeof buttons == 'object' && buttons instanceof Array) {
			  var btnNum, btnAttr, o;
			  button:
			  for (btnNum = 0; btnNum < buttons.length; btnNum++) {
				  if (typeof buttons[btnNum] != 'object') {continue button;}
				  for (btnAttr in buttons[btnNum]) {
					  o = buttons[btnNum][btnAttr];
					  switch(btnAttr) {
						  case 'text':
							  if (typeof o != 'string') o = '';
						    break;
						  case 'tooltip':
							  if (typeof o != 'string') o = false;
						    break;
						  case 'icon':
							  if (typeof o != 'string') o = false;
						    break;
						  case 'callback':
							  if (typeof o != 'function') continue button;
						    break;
				  } }
				  btns.push(buttons[btnNum]);
		  } }
		  return btns;
	  },

	  __validateTheme: function (theme) {
		  if (typeof theme != 'string' || theme == '') return this.__defaults.theme;
		  if (typeof this.__themes[theme] == 'object' && this.__themes[theme] !== null) {
			  var t = this.__themes[theme];
			  if (t.base) {
				  if (typeof this.__themes[t.base] == 'object' && this.__themes[t.base] !== null) return theme;
				  else return this.__defaults.theme;
			  }
			  else return theme;
		  }
		  return this.__defaults.theme;
	  },

	  __parseTokens: function (text) {
		  var tagSplitRegex = /({\s*\w+\s*(?:\w+(?:\s*=\s*(?:".*?"|'.*?'))?\s*)*})/;
		  var tagRegex = /{\s*(\w+)/;
		  var attrRegex = /(\w+)\s*=\s*(".*?"|'.*?')/g;
		  var text_obj =  text.split(tagSplitRegex);
		  var i, match, attr, tag, temptext;
		  token_search:
		  for (i = 1; i < text_obj.length; i += 2) {
			  tag = {};
			  match = tagRegex.exec(text_obj[i]);
			  temptext = text_obj[i].replace(tagRegex, '');
			  tag.name = match[1];
			  tag.attributes = {};
			  if (typeof this.__tokens[tag.name] == 'undefined') continue;
			  if (typeof temptext != '') {
				  while ((attr = attrRegex.exec(temptext)) != null) {
					  attr[2] = attr[2].substring(1, attr[2].length - 1);
					  if (typeof this.__tokens[tag.name].attributes[attr[1]] == 'undefined') continue;
					  if (this.__tokens[tag.name].attributes[attr[1]].validation === false) tag.attributes[attr[1]] = attr[2];
					  else if (this.__tokens[tag.name].attributes[attr[1]].validation.test(attr[2])) tag.attributes[attr[1]] = attr[2];
					  else if (typeof this.__tokens[tag.name].attributes[attr[1]].defaultValue == 'string') tag.attributes[attr[1]] = this.__tokens[tag.name].attributes[attr[1]].defaultValue;
					  else continue token_search;
			  } }
			  for (attr in this.__tokens[tag.name].attributes) {
				  if (!this.__tokens[tag.name].attributes.hasOwnProperty(attr)) continue;
				  if (typeof tag.attributes[attr] == 'undefined') {
					  if (typeof this.__tokens[tag.name].attributes[attr].defaultValue == 'string') tag.attributes[attr] = this.__tokens[tag.name].attributes[attr].defaultValue;
					  else continue token_search;
			  } }
			  var rep = this.__tokens[tag.name].replacement;
			  if (typeof rep == 'string') text_obj[i] = rep;
			  else if (typeof rep == 'function') {
				  var rep_result = rep(tag);
				  if (typeof rep_result != 'string') continue token_search;
				  text_obj[i] = rep_result;
		  } }
		  return text_obj.join('');
	  },

	  __copyObj: function (obj) {
		  if (obj == null || typeof(obj) != 'object' || obj instanceof RegExp) return obj;
		  var c = new obj.constructor(); 
		  for (var key in obj) c[key] = this.__copyObj(obj[key]);
		  return c;
	} }

  if (typeof devtools.dialog!='undefined') {
		devtools.config = {
			open: function() {
				var msg = (typeof this.__options.html == 'string') ? this.__options.html + '<hr/>' : '';
				for(var name in this.__options.settings) msg += this.__options.settings[name].input;
				devtools.dialog.open({
					message: msg, 
					title:this.__options.title, 
					mask:true, 
					buttons: [{
						text: 'Save', 
						icon: this.__icons.save, 
						callback: this.__save}, 
						{text: 'Save & Reload', icon: this.__icons.save, callback: function() {devtools.config.__save(); document.location.reload();}}, 
						{text: 'Close', icon:this.__icons.close, callback:this.close
					}], 
					theme: (typeof this.__options.theme.css == 'string') ? 'devtoolsconfig' : 'default'}, 'devtools-config')
			},
			
		  close: function () {
			  devtools.dialog.close('devtools-config');
		  },
			
		  get: function (name) {
			  if (this.__options.settings[name] !== null && typeof this.__options.settings[name] != 'undefined') return GM_getValue('devtools-config-' + name, this.__options.settings[name].defaultValue);
			  return undefined;
		  },
			
		  getAll: function () {
			  var vals = {}, val;
			  var allVals = GM_listValues();
			  for (var i = 0; i < allVals.length; i++) {
				  val = allVals[i];
				  if (/^devtools-config-/.test(val)) vals[val.replace(/^devtools-config-/, '')] = this.get(val.replace(/^devtools-config-/, ''));
			  }
			  return vals;
		  },
			
		  init: function (options) {
			  if (typeof options != 'object' || !options) return false;
			  if (!options.settings) return false;
			  if (options.prefix) this.__options.prefix = options.prefix;
			  if (typeof options.callback == 'function') this.__options.callback = options.callback;
			  else this.__options.callback = function () {};
			  this.__options.title = (typeof options.title == 'string') ? options.title : 'Configuration Options';
			  var setting, name;
			  for (name in options.settings) {
				  if (!/^\w+$/.test(name) || !options.settings.hasOwnProperty(name)) continue;
				  this.__options.settings[name] = {};
				  setting = options.settings[name];
				  if (typeof setting.type == 'string') {
					  if (setting.type == 'text' || setting.type == 'textarea' || setting.type == 'password') {
						  this.__options.settings[name].defaultValue = (typeof setting.defaultValue == 'string') ? setting.defaultValue : '';
						  this.__options.settings[name].input = '{input type="' + setting.type + '" name="' + name + '" defaultValue="' + (this.get(name) || this.__options.settings[name].defaultValue) + '" label="' + ((typeof setting.label == 'string') ? setting.label : '') + '"}';
					  }
					  if (setting.type == 'checkbox') {
						  this.__options.settings[name].defaultValue = (setting.defaultValue == true || setting.defaultValue == 'true') ? true : false;
						  this.__options.settings[name].input = '{input type="' + setting.type + '" name="' + name + '" defaultValue="' + ((typeof this.get(name) == 'boolean') ? this.get(name) : this.__options.settings[name].defaultValue) + '" label="' + ((typeof setting.label == 'string') ? setting.label : '') + '"}';
					  }
					  if (setting.type == 'radio' || setting.type == 'select') {
						  this.__options.settings[name].defaultValue = (typeof setting.defaultValue == 'string') ? setting.defaultValue : '';
						  this.__options.settings[name].input = '{input type="' + setting.type + '" name="' + name + '" defaultValue="' + (this.get(name) || this.__options.settings[name].defaultValue) + '" label="' + ((typeof setting.label == 'string') ? setting.label : '') + '"';
						  this.__options.settings[name].input += ' options="' + ((typeof setting.options == 'object') ? devtools.JSON.stringify(setting.options) : '') + '"';
						  this.__options.settings[name].input += ((setting.colorHook === true && setting.type == 'select') ? ' hook="color"' : '') + '}';
			  } } }
			  this.__options.html = (typeof options.html == 'string') ? options.html : false;
			  this.__options.theme.useBase = (options.useBase === false) ? false : true;
			  this.__options.theme.css = (typeof options.css == 'string') ? options.css : null;
			  if (typeof this.__options.theme.css == 'string') {
				  devtools.dialog.defineTheme('devtoolsconfig', this.__options.theme.css, ((this.__options.theme.useBase) ? 'default' : null));
			  }
			  this.__initSettings = options;
			  return true;
		  },
			
		  __initSettings: null,
		  __save: function (options) {
			  options = devtools.dialog.getInputs('devtools-config');
			  for (var name in options) {
				  if (!options.hasOwnProperty(name)) continue;
				  GM_setValue('devtools-config-' + name, options[name]);
			  }
			  var img = document.querySelector('#devtools-dialog-devtools-config [data-devtools-dialog-button="Save"] img');
			  img.src = devtools.config.__icons.savecomplete;
			  setTimeout(function () {img.src = devtools.config.__icons.save;}, 2000);
			  devtools.config.init(devtools.config.__initSettings);
			  return true;
		  },
			
		  __options: {
			  title: '', 
			  html: '', 
			  theme: {useBase: true, css: false}, 
			  settings: {}, 
			  prefix: 'my_storage_prefix'
		  },
			
		  __icons: {
			  save: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKCSURBVHjaYj\
TL3lPIwMAgD8Q2QKwExDwMDP9ZgDQjw38GMGBmYmRgAuL///8x/PvH8IGNleHO95+/O09N81wDEEAghVqzS61SQOrVpdnBev7/+8/w6w8Q//4H1szJzsTAyMjA8OX7P4YvP/7y33v+xWDhzrszzLK28QMEEBNQvS1I1/pTn\
xiA+oC2/GfIm3waaBOQA9TFygKxHWTgd6CBf/4xMP5lYGKJd1cW5mRnmwoQQCADJEC2gjT8Bsr+/gNx928gn4WZAWwASO77L6gc0IIDlz8zsLEyM3z/+YcNIIBAXuD68w/scLAiEGACufc/SDPQ6UD4A2jz95//gS78D3Yl\
iH729gfIMEaAAGIBBdhfoAAQMfyE2l6bYADWDEQMv//+Z/j2E+R0cAACzQXCfyDX/AUHKkAAgUP7318GsNOaF5wHehvoZ0aY7QwMINf9AXoNGiFgICAgBDSAGawHIIBYGMBOApn+l0FMXBoUGZD4A+uAOhlo4///UC+AnAG\
05PfvP6DoYgAIIJALGP7+BRsGBoxwBgPEyf8h4QOh/oPlQU7//RuSLgACCGzAn7//GKBWgv0ICjgGsEKIf8H+Btv+F5xGgCyGn7//g10AEECgQGT4+w/i5LpIGQZiQOnsq8BwgbgEIIBYQFH2Fxa6QEMmHkvBqznPcjbQy3\
/ACQukASCAWCB+/Q8OcRCwkokl6IJ/QBv//gYnPwaAAGIB+u0/0AuMsDA49mQxXs0msnZAF/wFpw+QXoAAYgFa/uDXn3+Kxspc4AxTYD2HoAvEeYEu+Au28D1AADGaZe3qBxqkBnSBJdBIQZCzwFH3/x84kJBpWMxAIv3/Z\
wZGpssAAQYAIXxui1/HoMEAAAAASUVORK5CYII%3D',
			  close: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAD2SURBVHjax\
FM7DoMwDH2pOESHHgDPcB223gKpAxK34EAMMIe1FCQOgFQxuflARVBSVepQS5Ht2PHn2RHMjF/ohB8p2gSZpprtyxEHX8dGTeMG0A5UlsD5rCSGvF55F4SpqpSm1GmCzPO3LXJy1LXllwvodoMsCpNVy2hbYBjCLRiaZ8u7\
Dng+QXlu9b4H7ncvBmKbwoYBWR4kaXv3YmAMyoEpjv2PdWUHcP1j1ECqFpyj777YA6Yss9KyuEeDaW0cCsCUJMDjYUE8kr5TNuOzC+JiMI5uz2rmJvNWvidwcJXXx8IAuwb6uMqrY2iVgzbx99/4EmAAarFu0IJle5oAAAA\
ASUVORK5CYII%3D'
  } } }

  devtools.config.init({
    title: gf_10,
    settings: {
      'perpage': { type: 'text', label: gf_12, defaultValue: '50' },
      'sort': { type: 'radio', label: gf_13, options: { 'Daily': '4', 'Total': '5', 'Created': '6', 'Updated': '7' }, defaultValue: '7' },
      'theme': { type: 'radio', label: gf_14, options: { 'Blue': '1', 'Brown': '2', 'Red': '3' }, defaultValue: '3' },
      'highlight': { type: 'radio', label: gf_17, options: { 'Off': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7' }, defaultValue: '0' },
			'logo': { type: 'radio', label: 'Logo', options: { 'Icon': '1', 'Text': '2' }, defaultValue: '1' },
      'postnewlink': { type: 'checkbox', label: gf_22, defaultValue: true },
      'helplink': { type: 'checkbox', label: gf_21, defaultValue: true },
      'count': { type: 'checkbox', label: gf_16, defaultValue: true },
      'ttips': { type: 'checkbox', label: gf_15, defaultValue: false },
      'create1': { type: 'checkbox', label: gf_18, defaultValue: false },
      'label1': { type: 'text', label: gf_20, defaultValue: 'Link 1' },
      'link1': { type: 'text', label: gf_23, defaultValue: 'https://forum.userstyles.org' },
      'create2': { type: 'checkbox', label: gf_18, defaultValue: false },
      'label2': { type: 'text', label: gf_20, defaultValue: 'Link 2' },
      'link2': { type: 'text', label: gf_23, defaultValue: 'https://userstyles.org' },
      'filter': { type: 'checkbox', label: gf_24, defaultValue: false },
      'ideogram': { type: 'checkbox', label: gf_40, defaultValue: false },
      'english': { type: 'checkbox', label: gf_38, defaultValue: false },
      'casesensitive': { type: 'checkbox', label: gf_25, defaultValue: false },
      'filtertt': { type: 'checkbox', label: 'Button Tooltip', defaultValue: true },
      'filterlist1': { type: 'text', label: '', defaultValue: gf_26 },
      'filterlist2': { type: 'text', label: '', defaultValue: gf_26 },
      'filterlist3': { type: 'text', label: '', defaultValue: gf_26 },
      'filterlist4': { type: 'text', label: '', defaultValue: gf_26 },
      'listposition': { type: 'textarea', label: gf_34, defaultValue: '600px' },
      'listwidth': { type: 'text', label: gf_30, defaultValue: '900px' },
      'listheight': { type: 'text', label: gf_31, defaultValue: '60px' },
      'listleft': { type: 'text', label: gf_32, defaultValue: 'auto' },
			'listright': { type: 'text', label: gf_45, defaultValue: '0' },
			'listtop': { type: 'text', label: gf_33, defaultValue: '69px' },
			'listbottom': { type: 'text', label: gf_46, defaultValue: 'auto' },
      'custom': { type: 'checkbox', label: gf_28, defaultValue: true },
      'sitelink1': { type: 'text', label: '', defaultValue: gf_41 },
      'sitelink2': { type: 'text', label: '', defaultValue: gf_42 },
      'sitelink3': { type: 'text', label: '', defaultValue: gf_43 },
      'sitelink4': { type: 'text', label: '', defaultValue: gf_44 }
    },
		
    css: '\
#devtools-wrapper .dialog {width: 650px !important}\
#devtools-wrapper .dialog-close, #devtools-wrapper textarea, #devtools-wrapper .dialog > .dialog-footer > button:first-child {display: none !important}\
#devtools-wrapper .dialog .dialog-content {margin: 4px 0 !important; text-align: center !important}\
#devtools-wrapper [data-devtools-input="radio"] label {display: inline !important}\
#devtools-wrapper .dialog > .dialog-content fieldset {text-align: center !important}\
#devtools-wrapper .dialog > .dialog-content input[type=radio]:first-child + span {position: relative !important; top: -4px !important}\
#devtools-wrapper .dialog > .dialog-content > label > input {margin-left: 6px !important; padding: 0 2px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(1) {margin: 0 0 6px 0 !important; text-align: center !important; width: 100% !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(1) > input {text-align: center !important; width: 40px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(2), #devtools-wrapper .dialog > .dialog-content > div:nth-child(4) {margin-right: 10px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(2), #devtools-wrapper .dialog > .dialog-content > div:nth-child(3) {display: inline-block !important; text-align: center !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(4) input[type=radio]:first-child + span {margin-right: 20px !important; position: relative !important; top: -3px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(4), #devtools-wrapper .dialog > .dialog-content > div:nth-child(5) {display: inline-block !important; text-align: center !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(6), #devtools-wrapper .dialog > .dialog-content > div:nth-child(7), \
#devtools-wrapper .dialog > .dialog-content > div:nth-child(8), #devtools-wrapper .dialog > .dialog-content > div:nth-child(9) {display: inline-block !important; margin-right: 22px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(10), #devtools-wrapper .dialog > .dialog-content > div:nth-child(13) {display: inline-block !important; margin-top: 4px !important; width: 15% !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(11) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(14) > input {width: 12% !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(11), #devtools-wrapper .dialog > .dialog-content > label:nth-child(12), \
#devtools-wrapper .dialog > .dialog-content > label:nth-child(14), #devtools-wrapper .dialog > .dialog-content > label:nth-child(15) {display: inline !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(12), #devtools-wrapper .dialog > .dialog-content > label:nth-child(15) {margin-left: 11px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(12) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(15) > input {width: 60% !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(16), #devtools-wrapper .dialog > .dialog-content > div:nth-child(17), #devtools-wrapper .dialog > .dialog-content > div:nth-child(18),\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(19), #devtools-wrapper .dialog > .dialog-content > div:nth-child(20) {display: inline-block !important; }\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(16), #devtools-wrapper .dialog > .dialog-content > div:nth-child(17), #devtools-wrapper .dialog > .dialog-content > div:nth-child(18), \
#devtools-wrapper .dialog > .dialog-content > div:nth-child(19), #devtools-wrapper .dialog > .dialog-content > div:nth-child(20) {border-top: 1px solid #AAA !important; margin-top: 2px !important; padding-top: 8px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(16) {width: 27.6% !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(17) {width: 19% !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(18) {width: 18% !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(19) {width: 17% !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(20) {width: 16% !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(21) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(22) > input,\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(23) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(24) > input {border-radius: 0 !important; margin: 0 !important; width: 100% !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(21) > input {border-radius: 4px 4px 0 0 !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(24) {margin-bottom: 6px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(24) > input {border-radius: 0 0 4px 4px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(25), #devtools-wrapper .dialog > .dialog-content > label:nth-child(26), #devtools-wrapper .dialog > .dialog-content > label:nth-child(27), \
#devtools-wrapper .dialog > .dialog-content > label:nth-child(28), #devtools-wrapper .dialog > .dialog-content > label:nth-child(29), \
#devtools-wrapper .dialog > .dialog-content > label:nth-child(30), #devtools-wrapper .dialog > .dialog-content > label:nth-child(31) {display: inline !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(26), #devtools-wrapper .dialog > .dialog-content > label:nth-child(27) {margin-left: 10px !important; text-align: center !important; width: 50px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(28), #devtools-wrapper .dialog > .dialog-content > label:nth-child(29) {margin-left: 10px !important; text-align: center !important; width: 50px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(30), #devtools-wrapper .dialog > .dialog-content > label:nth-child(31) {margin-left: 10px !important; text-align: center !important; width: 50px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(26) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(27) > input {text-align: center !important; width: 50px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(28) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(29) > input {text-align: center !important; width: 50px !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(30) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(31) > input {text-align: center !important; width: 50px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(32) {border-top: 1px solid #AAA !important; margin-top: 6px !important; padding-top: 8px !important}\
#devtools-wrapper .dialog > .dialog-content > div:nth-child(32) > label {text-align: center !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(33) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(34) > input, \
#devtools-wrapper .dialog > .dialog-content > label:nth-child(35) > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(36) > input {border-radius: 0 !important; margin: 0 !important; width: 100% !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(33) > input {border-radius: 4px 4px 0 0 !important}\
#devtools-wrapper .dialog > .dialog-content > label:nth-child(36) > input {border-radius: 0 0 4px 4px !important}\
#devtools-wrapper .dialog > .dialog-footer > button > img {margin: 1px 5px 0 0 !important; vertical-align: top !important}\
#devtools-wrapper .dialog > .dialog-content > label > input, #devtools-wrapper .dialog > .dialog-content > label:nth-child(25) {margin-top: -3px !important}\
#devtools-wrapper input[type="text"]:focus, #devtools-wrapper input[type="text"]:hover, \
#devtools-wrapper .dialog > .dialog-footer > button:hover {background: tan !important; border: 1px solid #444 !important; color: #000 !important}\
  '});
	
  var scriptID = 'srazzano/Greasy Fork (Firefox)@greasespot.net', scriptVER = '1.1.6';
  var signed_in = document.body.querySelector(".user-profile-link");
  if (signed_in) {
    var userid = document.body.querySelector('.user-profile-link a').href.match(/\d+/), mp = /https:\/\/greasyfork\.org\/.*users\// + userid;
  }
  var perpage = devtools.config.get('perpage'), sort = devtools.config.get('sort'), theme = devtools.config.get('theme'), ttips = devtools.config.get('ttips'), helplink = devtools.config.get('helplink');
  var postnewlink = devtools.config.get('postnewlink'), count = devtools.config.get('count'), create1 = devtools.config.get('create1'), label1 = devtools.config.get('label1'), link1 = devtools.config.get('link1');
  var create2 = devtools.config.get('create2'), label2 = devtools.config.get('label2'), link2 = devtools.config.get('link2'), highlight = devtools.config.get('highlight'), filter = devtools.config.get('filter');
  var filterlist1 = devtools.config.get('filterlist1'), filterlist2 = devtools.config.get('filterlist2'), filterlist3 = devtools.config.get('filterlist3'), filterlist4 = devtools.config.get('filterlist4');
  var filterlist = filterlist1.concat(filterlist2,filterlist3,filterlist4), casesensitive = devtools.config.get('casesensitive'), listwidth = devtools.config.get('listwidth'), listheight = devtools.config.get('listheight');
  var listleft = devtools.config.get('listleft'), listtop = devtools.config.get('listtop'), listbottom = devtools.config.get('listbottom'), listright = devtools.config.get('listright'), custom = devtools.config.get('custom');
	var sitelink1 = devtools.config.get('sitelink1'), sitelink2 = devtools.config.get('sitelink2'), sitelink3 = devtools.config.get('sitelink3'), sitelink4 = devtools.config.get('sitelink4'), logo = devtools.config.get('logo');
	var sitelink = sitelink1.concat(sitelink2,sitelink3,sitelink4), filtertt = devtools.config.get('filtertt'), english = devtools.config.get('english'), ideogram = devtools.config.get('ideogram');
	var url = window.location.href;
	var aUrl = url.split('?')[0];
  var onMainPage = url.match(/https?:\/\/greasyfork\.org/);
  var onScriptPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts/);
  var onAuthorPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/\d+/);
  var onSitePage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/by-site/);
  var onCodePage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/\d+.*\/code/);
  var onVersionPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/\d+.*\/(versions)$/);
  var onFeedbackPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/\d+.*\/feedback/);
  var onNewPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/\d+\/versions\/new/);
  var onLibraryPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/libraries/);
  var onSearchPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/search/);
  var onAssessmentPage = url.match(/https?:\/\/greasyfork\.org\/.*scripts\/under-assessment/);
  var onUserPage = url.match(/https?:\/\/greasyfork\.org\/.*users/);
  var onSpecPage = url.match(/https?:\/\/greasyfork\.org\/.*users\/\d+\-.*/);
  var onEditPage = url.match(/https?:\/\/greasyfork\.org\/.*users\/edit/);
  var onHelpPage = url.match(/https?:\/\/greasyfork\.org\/.*help/);
  var scriptList = onScriptPage ? $('#browse-script-list') : $('#user-script-list');
  var scriptArray = [], scripts = $('li', scriptList), scriptCount = scripts.length, colIndex = 0;
  var bo = $('body')[0];
  var mh = $('#main-header');
  var sn = $('#site-name');
  var slf = $('#script-list-filter');
  var nav = $('nav', mh, 1);
  var up = $('#user-profile');
  var si = $('#script-info');
  var ucp = $('#user-control-panel');
  var ud = $('#user-discussions-on-scripts-written');
  var hasId = url.match(/\d+/);
  var date = new Date();
  var today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
	var initial = url.match(/\/\w{2}\/|\/\w{2}-\w{2}\//);

  function $(q, root, single, context) {
    root = root || document;
    context = context || root;
    if (q[0] == '#') return root.getElementById(q.substr(1));
    if (q.match(/^[\/*]|^\.[\/\.]/)) {
      if (single) return root.evaluate(q, context, null, 9, null) .singleNodeValue;
      var arr = [], xpr = root.evaluate(q, context, null, 7, null);
      for (var i = 0; i < xpr.snapshotLength; i++) arr.push(xpr.snapshotItem(i));
      return arr;
    }
    if (q[0] == '.') {
      if (single) return root.getElementsByClassName(q.substr(1)) [0];
      return root.getElementsByClassName(q.substr(1));
    }
    if (single) return root.getElementsByTagName(q) [0];
    return root.getElementsByTagName(q);
  }

  function $c(type, props, evls) {
    var node = document.createElement(type);
    if (props && typeof props == 'object') {
      for (prop in props) {
        if (typeof node[prop] == 'undefined') node.setAttribute(prop, props[prop]);
        else node[prop] = props[prop];
    } }
    if (evls instanceof Array) {
      for (var i = 0; i < evls.length; i++) {
        var evl = evls[i];
        if (typeof evl.type == 'string' && typeof evl.fn == 'function') node.addEventListener(evl.type, evl.fn, false);
    } }
    return node;
  }

  function toCustStr(num) {
    return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
  }

  String.prototype.toCustNum = function () {
    return parseInt(this.replace(/,|-/g, ''));
  }

  function sortTable(source) {
    var table = source;
    while (table.nodeName.toLowerCase() != 'table') {table = table.parentNode}
    var newRows = [];
    for (var i = 0; i < table.rows.length - 1; i++) {newRows[i] = table.rows[i + 1]}
    if (colIndex == source.cellIndex) newRows.reverse();
    else {
      colIndex = source.cellIndex;
      var cell = table.rows[1].cells[colIndex].textContent;
      if (onScriptPage) {
        if (colIndex == 0 || colIndex == 4 || colIndex == 5) newRows.sort(sortN);
        else if (colIndex == 1 || colIndex == 3) newRows.sort(sortT);
        else newRows.sort(sortD);
      } else {
        if (colIndex == 0 || colIndex == 3 || colIndex == 4) newRows.sort(sortN);
        else if (colIndex == 1) newRows.sort(sortT);
        else newRows.sort(sortD);
    } }
    function sortD(a, b) {
      var res = parseInt(a.cells[colIndex].textContent.replace(/-/g, '')) - parseInt(b.cells[colIndex].textContent.replace(/-/g, ''));
      return res;
    }
    function sortN(a, b) {
      var res = a.cells[colIndex].textContent.toCustNum() - b.cells[colIndex].textContent.toCustNum();
      return res;
    }
    function sortT(a, b) {
      a = a.cells[colIndex].textContent.toLowerCase();
      b = b.cells[colIndex].textContent.toLowerCase();
      return a.localeCompare(b);
    }
    for (var i = 0; i < newRows.length; i++) {table.appendChild(newRows[i])}
    var th = $('th', scriptTable);
    for (var i = 0; i < th.length; i++) {
      if (th[i] != th[source.cellIndex]) th[i].className = 'header';
      else th[i].className = 'header current';
  } }

  function pageUrl(e) {
    if (onScriptPage) {
      $('#header' + e).className = 'header current';
      if (!onSearchPage) {
        switch (e) {
          case '4': if (url.match(/sort=total_installs|sort=created|sort=updated/))  document.location = onScriptPage + '?per_page=' + perpage; break;
          case '5': if (!url.match('sort=total_installs')) document.location = url.split('?')[0] + '?per_page=' + perpage + '&sort=total_installs'; break;
          case '6': if (!url.match('sort=created')) document.location = url.split('?')[0] + '?per_page=' + perpage + '&sort=created'; break;
          case '7': if (!url.match('sort=updated')) document.location = url.split('?')[0] + '?per_page=' + perpage + '&sort=updated'; break;
    } } }
    if (onUserPage || onSpecPage || onSearchPage) {
      $('#header' + (e - 1)).className = 'header';
      $('#header1').click();
  } }

  function perPage() {
    if (!onSearchPage) {
      if (url.indexOf('per_page') > 0) {
        var pf = parseFloat(url.split('per_page=')[1]);
        if (perpage == '') perpage = '50';
        if (perpage > 200) { alert(gf_12); perpage = '200'; }
        if (pf == perpage) return;
        document.location = url.replace(/per_page=\d+/, 'per_page=' + perpage);
      } 
      if (url.indexOf('per_page') < 0 && url.indexOf('?') > 0 ) {
        var split0 = url.split('?')[0], split1 = url.split('?')[1];
        document.location = split0 + '?per_page=' + perpage + '&' + split1;
      }
      if (url.indexOf('?') < 0) document.location = url + '?per_page=' + perpage;
  } }

  function getFilterList() {
    if (filter) {
      if (ideogram && !english) {
        var ide = '\u2611 ideogram';
        var listdiv = $c('textarea', {id:'listBox', innerHTML:filterlist ? ide + ' \u2022 ' + filterlist.replace(/,/g, ' \u2022 ') : ide, spellcheck:false});
      }
      if (english && !ideogram) {
        var eng = '\u2611 all not English';
        var listdiv = $c('textarea', {id:'listBox', innerHTML:filterlist ? eng + ' \u2022 ' + filterlist.replace(/,/g, ' \u2022 ') : eng, spellcheck:false});
      }
      if (ideogram && english) {
        var ide = '\u2611 ideogram', eng = ' \u2611 all not English';
        var listdiv = $c('textarea', {id:'listBox', innerHTML:filterlist ? ide + eng + ' \u2022 ' + filterlist.replace(/,/g, ' \u2022 ') : ide + eng, spellcheck:false});
      }
      if (!ideogram && !english) var listdiv = $c('textarea', {id:'listBox', innerHTML:filterlist ? '\u2022 ' + filterlist.replace(/,/g, ' \u2022 ') : '', spellcheck:false});
    }
    if (!filter) {
      if (ideogram && !english) {
        var ide = '\u2611 ideogram';
        var listdiv = $c('textarea', {id:'listBox', innerHTML:ide, spellcheck:false});
      }
      if (english && !ideogram) {
        var eng = '\u2611 all not English';
        var listdiv = $c('textarea', {id:'listBox', innerHTML:eng, spellcheck:false});
      }
      if (ideogram && english) {
        var ide = '\u2611 ideogram', eng = ' \u2611 all not English';
        var listdiv = $c('textarea', {id:'listBox', innerHTML:ide + eng, spellcheck:false});
    } }
    if (!$('#listBox')) {
      document.oncontextmenu = function() {return false}
      document.body.appendChild(listdiv);
      $('#listBox').addEventListener('mouseout', function() {document.body.removeChild(listdiv); contentM()}, false);
    } else {
      var lb = $('#listBox');
      lb.parentNode.removeChild(lb);
      $('#script-table').addEventListener('mousedown', contentM, false);
  } }

  function openList(e) {
    if (e.button == 0 && e.target.id == 'opt-button') devtools.config.open();
    if (e.button == 0 && e.target.id == 'fil-button') getFilterList();
    if (e.button == 2) {
      GM_setClipboard(getPrefs()); 
      alert('Copied to Clipboard\n\n' + getPrefs());
  } }

  function getPrefs() {
    var la1 = label1 + '  ';
    var lk1 = 'Custom Link 1:   ' + la1 + link1;
    var la2 = label2 + '  ';
    var lk2 = 'Custom Link 2:   ' + la2 + link2;
    var fl = 'Filter List:\n  ' + filterlist1 + '\n  ' + filterlist2 + '\n  ' + filterlist3 + '\n  ' + filterlist4;
    var sl = 'Site List:\n  ' + sitelink1 + '\n  ' + sitelink2 + '\n  ' + sitelink3 + '\n  ' + sitelink4;
    return lk1 + '\n\n' + lk2 + '\n\n' + fl + '\n\n' + sl;
  }

  function contentM() {
    document.oncontextmenu = function() {return true}
  }

  GM_addStyle('\
body { margin: 0 !important; }\
body > p,  body > p + p { margin-top: 70px !important; padding-left: 4px !important; }\
body > p + p ~ p { margin-top: 0 !important; padding-left: 4px !important; }\
body > h3 { margin-left: 4px !important; }\
body ol#by-site-list li, #by-site-list a { color: #000 !important; text-decoration: none !important; }\
body ol#by-site-list li { font-size: 12px !important; padding: 0 4px !important; border: 1px solid transparent !important; border-bottom: 1px solid #000 !important; }\
body ol#by-site-list li:hover { background: #FFF !important; border: 1px solid #000 !important; border-radius: 3px !important; text-decoration: none !important; }\
body ol#by-site-list li:hover a { text-decoration: none !important; }\
body #moderator-actions * { display: inline !important; }\
body #moderator-actions li { padding: 0 6px !important; }\
#main-header { -moz-user-select: none !important; position: fixed !important; height: 62px !important; top: 0 !important; width: 100% !important; z-index: 8 !important; }\
#main-header * { text-decoration: none !important; }\
#main-header nav { float: right !important; }\
#main-header > #site-nav > nav > li, #main-header > #site-nav > nav > p, #main-header > #site-nav > nav > span { margin: 0 0 0 8px !important; }\
#main-header > #site-nav > nav > a { margin: 0 0 0 10px !important; }\
#main-header > #site-nav > nav > p > a { margin-right: 0 !important; }\
#main-header > #site-nav > nav > li.forum-link, #main-header > #site-nav > nav > li.help-link, #main-header > #site-nav > nav > span#OptFil { margin-left: 10px !important; }\
#main-header > #site-nav > nav > span.user-profile-link { margin-left: 6px !important; }\
#main-header nav > p { float: left !important; }\
#main-header #sort-name:hover * { color: #FFF !important; }\
#main-header nav a, #user-profile li, #user-profile a { color: #CCC !important; }\
#main-header nav a:hover, #user-profile li:hover, #user-profile a:hover { color: #FFF !important; }\
#main-header nav > li > a, #main-header nav > span > a, #main-header nav > p > a, #main-header nav > a { border-bottom: 1px solid #CCC !important; }\
#main-header nav > li > a:hover, #main-header nav > span > a:hover, #main-header nav > p > a:hover, #main-header nav > a:hover { border-bottom: 1px solid #FFF !important; }\
#main-header nav .nav-search { border: none !important; }\
#main-header #gf-cont { cursor: pointer; margin-left: 8px; }\
#main-header #gf-option { text-decoration: underline; }\
#main-header > #site-nav > nav > li.scripts-index-link { margin-right: -4px !important; }\
#site-name > p, #site-name p.subtitle, #script-list-sort { display: none; }\
section #user-profile { margin: 10px 0 0 10px !important; }\
section #user-profile * { margin: 4px 0 !important; }\
section #user-profile h4 { margin-left: 15px !important; }\
#main-header #create-link1, #main-header #create-link2 { cursor: pointer !important; margin: 0 0 0 12px !important; }\
#opt-button, #fil-button, #bs-button { color: #BBB; }\
#opt-button:hover, #fil-button:hover { color: #FFF;  cursor: pointer; }\
#bs-button { cursor: default; }\
input[type="submit"][value="Post new version"] { margin: 0 0 4px 10px; width: 120px; }\
#listBox { background: linear-gradient(#EEE, #AAA); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 3px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) inset, 2px 2px 2px rgba(0, 0, 0, 0.5); }\
#listBox { bottom: '+ listbottom +'; font-size: 16px; height: '+ listheight + '; left: '+ listleft +'; padding: 4px; position: fixed; right: '+ listright +'; top: '+ listtop +'; width: '+ listwidth +'; z-index: 1003; }\
#script-search { margin-bottom: 10px !important; margin-right: 12px !important; }\
#moderator-actions { -moz-user-select: none !important; color: #FFF !important; position: fixed !important; right: 384px !important; top: 6px !important; }\
#moderator-actions > ul { margin: 0 0 0 10px !important; padding: 0 !important; }\
#moderator-actions > header > h3 { cursor: default !important; float: left !important; font-size: 90% !important; margin: 1px 0 0 0 !important; }\
#moderator-actions a { color: #000 !important; text-decoration: none !important; }\
#script-list-sort { display: none !important; }\
#script-list-filter { -moz-user-select: none !important; background: none !important; color: #CCC !important; position: fixed !important; top: 0px !important; }\
#script-list-filter *:not(a) { display: inline !important; }\
#script-list-filter span.script-list-current { color: #FFF !important; margin: 0 8px 0 6px !important; text-shadow: 1px 1px 2px #000; }\
#script-list-filter a { border-bottom: 1px solid #CCC !important; color: #CCC !important; text-decoration: none !important; }\
#script-list-filter a:hover { border-bottom: 1px solid #FFF !important; color: #FFF !important; }\
#script-list-filter > ul > li:first-child > a { display: inline !important; }\
#script-list-filter > ul > li:first-child:not(.script-list-current):after { content:  " |" !important; }\
#OptFil { background: linear-gradient(rgba(225, 0, 0, .7), rgba(225, 0, 0, .5)) !important; }\
#OptFil {border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 3px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) inset, 2px 2px 3px rgba(0, 0, 0, 0.5); font-size: 100%; font-weight: bold; }\
#OptFil { background: #4F738E; padding: 0px 4px; position: relative !important; text-shadow: 1px 1px 2px #000; top: 6px !important; }\
#OptFil:hover { background: #0099FF; }\
#OptFil:hover { background: linear-gradient(rgba(255, 0, 0, .9), rgba(255, 0, 0, .9)) !important; }\
#language-selector-locale, #moderator-actions li, input[type="submit"][value="Post script"], .preview-button, input[type="submit"][value="Post new version"], #install-area > .install-link, #script-links li a, .install-help-link, .pagination > a, .pagination span:not(.gap), #main-header #gf-option, input[name="q"], input[type="submit"] { background: linear-gradient(rgba(255, 255, 255, .75), rgba(255, 255, 255, .5)) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 3px !important; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) inset, 2px 2px 2px rgba(0, 0, 0, 0.5) !important; color: #000 !important; margin: 0 1px !important; padding: 2px 6px !important; text-decoration: none !important; }\
.pagination { -moz-user-select: none !important; cursor: default !important; position: fixed !important; top: 38px !important; }\
.pagination > a, .pagination span { padding: 0 6px !important; }\
.pagination .previous_page, .pagination .next_page, .pagination span, #gf-option:hover { color: #000 !important; }\
.pagination .disabled { background: none !important; border: 1px solid transparent !important; box-shadow: none !important; color: #CCC !important; }\
.pagination span.disabled { background: linear-gradient(rgba(255, 255, 255, .4), rgba(255, 255, 255, .2)) !important; }\
.pagination .current, .pagination .gap { color: #FFF !important; font-weight: bold !important; padding: 0 !important; }\
.pagination .current { border-bottom: 1px solid #FFF !important; margin: 0 7px 0 4px !important; }\
.pagination .gap { margin: 0 !important; }\
#script-list-filter, .pagination, #moderator-actions { z-index: 9 !important; }\
#language-selector-locale:hover, #moderator-actions li:hover, input[type="submit"][value="Post script"]:hover, .preview-button:hover, input[type="submit"][value="Post new version"]:hover, #install-area > .install-link:hover, #script-links li:not(.current) a:hover, .install-help-link:hover, .pagination > a:not(.disabled):hover, .pagination span:not(.disabled):not(.gap):hover, #main-header #gf-option:hover, input[name="q"]:hover, input[name="q"]:focus, input[type="submit"]:hover { background: #FFF !important; }\
#additional-info > p > img { max-height: 100% !important; max-width: 100% !important; }\
input[name="q"] { width: 150px !important; }\
#script-list-sort { display: none !important; }\
#script-info { margin: 70px 0 0 4px !important; }\
#script-info > header { margin-bottom: 10px !important; }\
#script-meta { margin-top: 10px !important; }\
input[type="submit"][value="Post script"] { left: 210px !important; padding: 4px !important; position: fixed !important; top: 74px !important; }\
input[type="submit"][value="Post new version"] { margin: 0 0 4px 12px !important; padding: 4px 2px !important; }\
.preview-button { padding: 4px 2px !important; margin: 4px 10px !important; }\
#new_script_version { position: relative !important; top: 14px !important; }\
#install-area > .install-link { border-radius: 10px !important; padding: 12px !important; }\
.form-control input:not([type="radio"]):not([type="file"]) {width: 130px !important; }\
#edit_user { margin: 8px !important; }\
#script-links li{ background: none !important; border: none !important; }\
#script-content { border: none !important; }\
#script-meta { margin-top: 20px !important; }\
#additional-info > div { background: transparent !important; }\
#additional-info p img {max-width: 100% !important;}\
#new_user { margin-top: 80px !important; }\
#language-selector-locale { padding: 1px 0 !important; }\
.nav-search { position: fixed !important; right: 0 !important; top: 4px !important; z-index: 9 !important; }\
#site-nav nav, #nav-user-info { margin: 0 !important; right: 14px !important; z-index: 9 !important; }\
#site-nav nav { bottom: 14px !important; }\
#script-links, #install-area { display: inline-block !important; }\
#script-search, #language-selector { display: inline-block !important; }\
.script-list-option-group ul { padding-left: 10px !important; }\
.script-list-option.script-list-current { color: #FFF !important; }\
input[type="submit"]:not([name="commit"]) { margin-left: 0 !important; width: 24px !important; }\
#user-profile p a { color: #666 !important; }\
#user-profile p a:hover { color: #000 !important; }\
#table-container > #user-profile > ul > li { color: #000 !important; }\
#table-container > #user-profile > ul > li > a { color: #666 !important; }\
#table-container > #user-profile > ul > li:hover > a { color: #000 !important; }\
#table-container { margin: 70px 0 16px 0 !important; width: 100% !important; }\
#script-table { border-collapse: separate; border-spacing: 0; width: 100%; }\
#script-table > tr * { text-decoration: none !important; }\
#script-table > tr:first-child { height: 28px !important; }\
#script-table > tr:not(:first-child):hover, #script-table > tr:not(:first-child):hover a { color: #FFF !important; }\
#script-table > tr > th { background: rgba(0,0,0,.1) !important; border-radius: 0 0 8px 8px !important; }\
#script-table > tr > th.current { color: #FFF !important; }\
#script-table > tr > th:not(#header2):not(.current) { color: #CCC !important; text-shadow: 1px 1px 2px #000 !important; }\
#script-table > tr > th:not(#header2):hover { border-radius: 0 0 8px 8px !important; box-shadow: none !important; color: #FFF !important; }\
#script-table > tr > .header { cursor: pointer !important; text-align: center !important; }\
#script-table > tr > #header0 { text-align: center !important; }\
#script-table > tr > #header2 { cursor: default !important; pointer-events: none !important; }\
#script-table > tr > #header2 { background: transparent !important; border-radius: 0 !important; box-shadow: none !important; }\
#script-table > tr > #header3 { text-align: center !important; }\
#script-table > tr > td { cursor: default !important; padding: 0 !important; }\
#script-table > tr > td:nth-child(1) { text-align: center !important; width: 30px !important; padding: 0 0 0 4px !important; }\
#script-table > tr > td:nth-child(2) { max-width: 250px !important; overflow: hidden !important; padding-left: 6px !important; text-align: left !important; text-overflow: ellipsis !important; white-space: nowrap !important; }\
#script-table > tr > td:nth-child(3) { max-width: 400px !important; overflow: hidden !important; padding-left: 6px !important; text-align: left !important; text-overflow: ellipsis !important; white-space: nowrap !important; }\
#script-table > tr > td:nth-child(2) a:hover, #script-table tr > td:nth-child(4) a:hover { cursor: pointer !important; }\
#script-table > tr > td:nth-child(5) { text-align: center !important; width: 80px !important; }\
#script-table > tr > td:nth-child(7), #script-table > tr > td:nth-child(8) { text-align: center !important; width: 100px !important; }\
#script-table > tr > td.recent { background: #4F738E !important; border-radius: 100% !important; }\
#script-table > tr > td.recent > a { color: #FFF !important; text-shadow: 1px 1px 2px #000 !important; }\
table.CodeRay {margin-top: 12px !important; }\
#script-table > tr > td, #script-table > tr > td a { color: #000 !important; }\
#script-table > tr:hover > td { color: #BBB !important; }\
#script-table > tr > td.recent > a { color: #CCC !important; }\
  ');

	if (logo == 1) {
		GM_addStyle('\
#main-header h1 { display: none !important; }\
#main-header #site-name img { background: url(https://mediacru.sh/dfYwFoxae8AO.png) no-repeat !important; height: 64px !important; margin-top: 4px !important; padding-left: 64px !important; width: 0 !important; }\
#script-list-filter { left: 54px !important; }\
.pagination { left: 75px !important; }\
    ')
	}
	
	if (logo == 2) {
		GM_addStyle('\
#main-header h1 { font-size: 48px !important; margin: 0px 0 0 4px !important; text-shadow: 2px 2px 2px #000 !important; }\
#main-header #site-name img { display: none !important; }\
#script-list-filter { left: 270px !important; }\
.pagination { left: 275px !important; }\
    ')
	}
	
  if (onUserPage) {
    GM_addStyle('\
body h1 { visibility: collapse !important; }\
body > h2 { -moz-user-select: text !important; background: linear-gradient(rgba(255, 255, 255, .9), rgba(255, 255, 255, .6)) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 3px !important; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) inset !important; color: #000 !important; cursor: default !important; font-size: 20px !important; left: 74px !important; padding: 2px 10px !important; position: fixed !important; text-shadow: 0 1px 0 #CCC !important; top: 0 !important; }\
header > h3 { display: none !important; }\
#main-header #create-link1, #main-header #create-link2 { position: relative; top: 6px; }\
nav > #user-control-panel { -moz-user-select: none !important; float: left !important; margin: 0 0 2px 0 !important; }\
nav > #user-control-panel > li { display: inline !important; margin: 0 2px 0 0 !important; }\
nav > #user-control-panel > li > a {margin: 0 !important;}\
nav > #user-control-panel > li > a { background: linear-gradient(rgba(255, 255, 255, .9), rgba(255, 255, 255, .6)) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 3px !important; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) inset, 2px 2px 2px rgba(0, 0, 0, 0.5) !important; color: #000 !important; margin: 0 2px !important; padding: 0 6px !important; text-decoration: none !important; }\
nav > #user-control-panel > li > a:hover { background: #FFF !important; color: #000 !important; }\
nav > #user-control-panel > li > a[href="/users/sign_out"] { background: linear-gradient(rgba(245, 0, 0, .9), rgba(230, 0, 0, .5)) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: #FFF !important; text-shadow: 1px 1px 2px #000 !important; }\
nav > #user-control-panel > li > a[href="/users/sign_out"]:hover { background: #F00 !important; }\
nav li, nav > span { position: relative !important; top: 6px !important; }\
#script-table > tr > td:nth-child(4) { cursor: default !important; text-align: center !important; width: 80px; }\
#script-table > tr > td:nth-child(6) { text-align: center !important; width: 100px; }\
    ')
  }

  if (onScriptPage) {
    GM_addStyle('\
#main-header nav a { position: relative !important; top: 6px !important; }\
#script-table > tr > td:nth-child(4) { text-align: center !important; min-width: 80px !important; }\
#script-table > tr > td:nth-child(6) { text-align: center !important; width: 80px !important; }\
    ')
  }
	
  if (onAuthorPage) {
    GM_addStyle('\
#install-area { margin-left: 20px !important; }\
#install-area > .install-help-link { margin-left: 20px !important; vertical-align: middle !important; }\
#install-area > br { display: none !important; }\
    ')
  }
	
  if (onHelpPage) {
    GM_addStyle('\
body > ul { position: relative !important; top: 70px !important; }\
    ')
  }
	
  if (onEditPage) {
    GM_addStyle('\
#edit_user, #edit_user + a { position: relative !important; top: 70px !important; }\
    ')
  }

  if (theme == '1') {
    GM_addStyle('\
body { background-color: #E3F4FF !important; }\
#script-table > tr > th:not(#header2):not(.current) { background: linear-gradient(#0F4FA8, #E3F4FF) !important; border: 1px solid #0F4FA8 !important; }\
#script-table > tr:not(:first-child):hover td:not(.recent), #script-table > tr:not(:first-child):hover > td:not(.recent) a, #script-table > tr > td.recent { background: #004 !important; }\
#main-header, #script-table > tr > th.current, #script-table > tr > th:not(#header2):hover { background: #0F4FA8 !important; }\
#script-table > tr > td:nth-child(2) a:hover, #script-table tr > td:nth-child(4) a:hover { color: #00FFFF !important; }\
    ')
  }

  if (theme == '2') {
    GM_addStyle('\
body { background-color: #E1DAC9 !important; }\
#script-table > tr > th:not(#header2):not(.current) { background: linear-gradient(#555, #E1DAC9) !important; border: 1px solid #555 !important; }\
#script-table > tr:not(:first-child):hover td:not(.recent), #script-table > tr:not(:first-child):hover > td:not(.recent) a, #script-table > tr > td.recent { background: #444 !important; }\
#main-header, #script-table > tr > th.current, #script-table > tr > th:not(#header2):hover { background: #555 !important; }\
#script-table > tr > td:nth-child(2) a:hover, #script-table tr > td:nth-child(4) a:hover { color: #FFCC00 !important; text-shadow: 1px 1px 2px #000 !important; }\
    ')
  }

  if (theme == '3') {
    GM_addStyle('\
#script-table > tr > th:not(#header2):not(.current) { background: linear-gradient(#670000, #FFF) !important; border: 1px solid #670000 !important; }\
#script-table > tr:not(:first-child):hover td:not(.recent), #script-table > tr:not(:first-child):hover > td:not(.recent) a, #script-table > tr > td.recent { background: #670000 !important; }\
#main-header, #script-table > tr > th.current, #script-table > tr > th:not(#header2):hover { background: #670000 !important; }\
#script-table > tr > td:nth-child(2) a:hover, #script-table tr > td:nth-child(4) a:hover { color: pink !important; }\
    ')
  }
	
  if (helplink) {
    GM_addStyle('\
#main-header nav > .help-link {display: -moz-box !important; }\
    ')
  } else {
    GM_addStyle('\
#main-header nav > .help-link {display: none !important; }\
    ')
  }
	
  if (onScriptPage && !onAuthorPage && !onSitePage && !onLibraryPage && !onAssessmentPage && !onVersionPage && !onSearchPage) perPage();

  if (onCodePage || onVersionPage || onFeedbackPage) {
    var title = document.querySelector('#script-links');
    var csrfToken = document.head.children['csrf-token'], authToken = csrfToken ? '?authenticity_token=' + encodeURIComponent(csrfToken.content) : null;
    var li = title.appendChild(document.createElement('li')), link = li.appendChild(document.createElement('a'));
    link.href = '/scripts/' + hasId + '/code.user.js';
    link.dataset.pingUrl = '/scripts/' + hasId + '/install-ping' + (authToken ? authToken : '');
    link.className = 'install-link';
    link.textContent = gf_11;
    link.style = 'border-radius: 10px !important; margin-left: 21px !important; padding: 12px !important;';
  }

  if ($('#new_script_version')) {
    var fc = document.querySelector('.form-control'), pnv = document.querySelector('input[value="Post new version"]'), br = document.querySelector('.form-control br');
    fc.insertBefore(pnv, br)
  }

	var upl = document.body.querySelector('.user-profile-link');
	nav.appendChild(upl);
	
  var cs = $c('a', {id:'create-link1', href:link1, textContent:label1});
  var cs2 = $c('a', {id:'create-link2', href:link2, textContent:label2});
  if (create1) nav.appendChild(cs);
  if (create2) nav.appendChild(cs2);
	
  var optfil = $c('span', {id:'OptFil', title:filtertt ? gf_35 : ''});
  var optb = $c('span', {id:'opt-button', textContent:'Options'}, [{type:'mousedown', fn:function(e) {openList(e)}}]);
  var bsb = $c('span', {id:'bs-button'});
  var filb = $c('span', {id:'fil-button'}, [{type:'mousedown', fn:function(e) {openList(e)}}]);
  optfil.appendChild(optb);
  optfil.appendChild(bsb);
  optfil.appendChild(filb);
	nav.appendChild(optfil);
	
	var ss = $('#script-search');
	var ls = $('#language-selector');
	ss.insertBefore(ls, ss.firstChild);
	
  for (var i = 0; i < scriptCount; i++) {
    var scriptObj = {}, script = scripts[i], link = $('a', script, 1), desc = $('.description', script, 1), auth = $('dd', script, 1), num = $('dd', script);
    scriptObj.name = link.textContent;
    scriptObj.nhref = link.href;
    scriptObj.nhref2 = link.href;
    scriptObj.nhref3 = link.href;
    scriptObj.description = desc.textContent;
    scriptObj.author = auth.textContent;
    scriptObj.ahref = auth.lastChild.href;
    scriptObj.daily = toCustStr(num[1].textContent);
    scriptObj.total = toCustStr(num[2].textContent);
    scriptObj.created = num[3].innerHTML.split('="')[1].split('T')[0];
    scriptObj.created2 = num[3].textContent;
    scriptObj.updated = num[4].innerHTML.split('="')[1].split('T')[0];
    scriptObj.updated2 = num[4].textContent;
    scriptArray.push(scriptObj);
  }

  var scriptTable = $c('table', {id:'script-table'});
  var scriptTableHeaderRow = $c('tr');

  if (onScriptPage) var theaders = [gf_1, gf_2, gf_3, gf_4, gf_5, gf_6, gf_7, gf_8];
  else var theaders = [gf_1, gf_2, gf_3, gf_5, gf_6, gf_7, gf_8];

  for (var i = 0; i < theaders.length; i++) scriptTableHeaderRow.appendChild($c('th', {id:'header' + (i), className:'header', textContent:theaders[i], title:'Sort column by ' + theaders[i]}));
  scriptTable.appendChild(scriptTableHeaderRow);

  for (var i = 0; i < scriptArray.length; i++) {
    var script = scriptArray[i];
    var tts = 'Script ' + script.nhref.match(/\d+/), tta = 'User ' + script.ahref.match(/\d+/);
    var row = $c('tr', {id:script.name + '<>' + script.author});
    row.appendChild($c('td', {textContent:(i + 1) + '.'}));
    var cellName = $c('td'); 
    cellName.appendChild($c('a', {href:script.nhref, textContent:script.name, title:ttips != false ? script.name : ''}));
    var cellDesc = $c('td', {textContent:script.description, title:ttips != false ? script.description : ''});
    var cellAuthor = $c('td');
    if(onScriptPage) cellAuthor.appendChild($c('a', {href:script.ahref, textContent:script.author, title:tta}));
    var cellDaily = $c('td', {textContent:script.daily});
    var cellTotal = $c('td', {textContent:script.total});
    var cellCreated = $c('td', {title:tts});
    cellCreated.appendChild($c('a', {href:script.nhref2, textContent:script.created}));
    var cellUpdated = $c('td', {title:tts});
    cellUpdated.appendChild($c('a', {href:script.nhref3, textContent:script.updated}));
    var hl = parseInt(highlight + "00000000");
    var sc = new Date(script.created);
    var su = new Date(script.updated);
    var cc = Date.UTC(sc.getUTCFullYear(), sc.getUTCMonth(), sc.getUTCDate());
    var cu = Date.UTC(su.getUTCFullYear(), su.getUTCMonth(), su.getUTCDate());
    if (highlight != '0') {
      if (script.created2.match(/day/)) var cre2 = script.created2.match(/\d/);
      else var cre2 = '0';
      if (script.updated2.match(/day/)) var upd2 = script.updated2.match(/\d/);
      else var upd2 = '0';
      if ((cc + hl) >= today) { row.className = 'recent recent' + cre2; cellCreated.className = 'recent recent' + cre2; cellCreated.title = tts + ' ' + gf_7 + ': ' + script.created2; }
      if ((cu + hl) >= today) { row.className = 'recent recent' + upd2; cellUpdated.className = 'recent recent' + upd2; cellUpdated.title = tts + ' ' + gf_8 + ': ' + script.updated2; }
    }
    if (filter && filterlist != '') {
      var fl = filterlist.split(','), lc = row.id.toLowerCase();
      for (var j = 0; j < fl.length; j++) {
        if (casesensitive) {
          if (row.id.match(fl[j])) row.style.display = 'none';
        } else {
          var str = fl[j].toLowerCase();
          if (lc.match(str)) row.style.display = 'none';
    } } }
    if (ideogram) {
      if (row.id.match(/[\u4E00-\u9FFF]/) || script.description.match(/[\u4E00-\u9FFF]/)) row.style.display = 'none';
    }
    if (english) { //[^\u0000-\u2FFF\uFB00-\uFFFF]
      if (row.id.match(/[\u0080-\uFFFF]/) || script.description.match(/[\u0080-\uFFFF]/)) row.style.display = 'none';
    }
    row.appendChild(cellName);
    row.appendChild(cellDesc);
    if (onScriptPage) row.appendChild(cellAuthor);
    row.appendChild(cellDaily);
    row.appendChild(cellTotal);
    row.appendChild(cellCreated);
    row.appendChild(cellUpdated);
    scriptTable.appendChild(row);
  }

  var tableContainer = $c('div', {id:'table-container'});
  tableContainer.appendChild(scriptTable);
  scriptList.parentNode.replaceChild(tableContainer, scriptList);

  var th = $('th', scriptTable);
  for (var i = 0; i < th.length; i++) th[i].addEventListener('click', function (e) { if (e.target.nodeName == 'TH' && e.target.textContent != gf_3) sortTable(e.target); }, false);
	
  var cnt = scriptTable.querySelectorAll('tr[style="display: none;"]').length;

  if (filter || ideogram || english) {
    bsb.textContent = ' / ';
    filb.textContent = 'Filtered  ' + cnt;
  } else { 
    bsb.textContent = '';
    filb.textContent = ''; 
  }
	
  if (onScriptPage) {
    var pns = document.body.querySelector('a[href$="/script_versions/new"]');
    nav.appendChild(pns.parentNode);
    if (!postnewlink) pns.parentNode.style.display = 'none';
  }
	
	if (onVersionPage) {
    var nsv = $('#new_script_version').childNodes[2], btn = $('#new_script_version').lastElementChild, svc = $('#script_version_code').previousElementSibling;
    nsv.insertBefore(btn, svc);
  }

  if (onScriptPage && !onSitePage) document.body.querySelector('a[href$="/scripts"]').parentNode.style.display = 'none';

	if (onUserPage && count) {
    var num = scriptTable.querySelectorAll('tr').length - 1;
    var h2 = document.body.querySelector('body > h2');
    h2.textContent = h2.textContent + ' (' + num + ')';
  }

	if (onUserPage) {
    if (mp && ucp) nav.appendChild(ucp);
    if (ud) bo.appendChild(ud);
    if (up) tableContainer.appendChild(up);
  }

	if (custom && onScriptPage) {
		switch (sort) {
      case '4': var aSort = ''; break;
      case '5': var aSort = '&sort=total_installs'; break;
      case '6': var aSort = '&sort=created'; break;
      case '7': var aSort = '&sort=updated'; break;
    }
    var slfa = document.body.querySelectorAll('.script-list-option > a');
    for (var i = 0; i < slfa.length; i++) slfa[i].style.display = 'none';
    slf.innerHTML = slf.innerHTML.replace(/\|/g, '');
    var txt = $c('text', {textContent:'\n | \n'});
    slf.firstElementChild.appendChild(txt);
    var more = document.body.querySelector('a[href$="/scripts/by-site"]');
		var linkurl = sitelink.split(',');
    for (var i = 0; i < linkurl.length; i++) {
      var nam = linkurl[i].split('*')[0], lab = linkurl[i].split('*')[1] ? linkurl[i].split('*')[1] : nam;
      var span = $c('span', {id:linkurl[i], className:'script-filter-option'});
			if (initial) var link = $c('a', {href:initial + 'scripts/by-site/' + nam + '?per_page=' + perpage + aSort, textContent:lab, title:nam});
			else var link = $c('a', {href:'/scripts/by-site/' + nam + '?per_page=' + perpage + aSort, textContent:lab, title:nam});
      var sym = $c('text', {textContent:'\n | \n'});
      span.appendChild(link);
      span.appendChild(sym);
      slf.appendChild(span);
			slf.appendChild(more);
  } }
	
  pageUrl(sort);
	
}) ();