/*
Copyright 2009+, GM_config Contributors (https://github.com/sizzlemctwizzle/GM_config)

GM_config Contributors:
    Mike Medley <medleymind@gmail.com>
    Joe Simmons
    Izzy Soft
    Marti Martz

GM_config is distributed under the terms of the GNU Lesser General Public License.

    GM_config is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name        GM_config 8+
// @description	A library to help you set up configure in greasemonkey script.
// @namespace   freMea
// @version     2.1.1
// @grant       GM_setValue
// @grant		GM_getValue
// @license		LGPL version 3 or any later version; http://www.gnu.org/copyleft/lgpl.html
// @copyright   2015+, eight <https://github.com/eight04/GM_config>
// @homepageURL https://github.com/eight04/GM_config
// @supportURL  https://github.com/eight04/GM_config/issues
// @attribution sizzlemctwizzle (https://github.com/sizzlemctwizzle/GM_config)
// @attribution Joe Simmons (https://greasyfork.org/en/scripts/1884-gm-config)
// @attribution eight04 (https://greasyfork.org/fr/scripts/7212-gm-config-eight-s-version)
// ==/UserScript==

var GM_config = function(){

	"use strict";

	var config = {
		title: null,
		settings: null,
		local: false
	}, dialog, css, GM_config;

	function addChild(e, children) {
		if (!children) {
			return;
		}

		if (!Array.isArray(children)) {
			children = [children];
		}

		var i;
		for (i = 0; i < children.length; i++) {
			if (typeof children[i] == "string") {
				children[i] = document.createTextNode(children[i]);
			}
			e.appendChild(children[i]);
		}
	}

	function element(tag, attr, children) {
		var e, key, key2;

		e = document.createElement(tag);

		if (attr) {
			for (key in attr) {
				if (typeof attr[key] == "boolean") {
					if (attr[key]) {
						e.setAttribute(key, "");
					} else {
						e.removeAttribute(key);
					}

				} else if (key == "event") {
					for (key2 in attr[key]) {
						e["on" + key2] = attr[key][key2];
					}

				} else {
					e.setAttribute(key, attr[key]);
				}
			}
		}

		addChild(e, children);

		return e;
	}

	function frag(children) {
		var fragment = document.createDocumentFragment();
		addChild(fragment, children);
		return fragment;
	}

	function getValue(key) {
		if (config.local) {
			key = location.hostname + "/" + key;
		}
		var value = GM_getValue(key);
		if (GM_getValue(key + "/type") == "object") {
			value = JSON.parse(value);
		}
		return value;
	}

	function setValue(key, value) {
		if (config.local) {
			key = location.hostname + "/" + key;
		}
		if (typeof value == "object") {
			GM_setValue(key + "/type", "object");
			value = JSON.stringify(value);
		}
		GM_setValue(key, value);
	}

	function read() {
		var key, s;
		config.local = GM_getValue(location.hostname, false);
		for (key in config.settings) {
			s = config.settings[key];
			s.value = getValue(key, s.type);
			if (s.value == null) {
				s.value = s.default;
			}
		}
	}

	function save() {
		var key, s;
		GM_setValue(location.hostname, config.local);
		for (key in config.settings) {
			s = config.settings[key];
			if (s.value == null) {
				setValue(key, s.default);
			} else {
				setValue(key, s.value);
			}
		}
	}

	function destroyDialog() {
		dialog.element.classList.remove("config-dialog-ani");
		setTimeout(function() {
			document.body.classList.remove("config-dialog-open");
			document.body.style.paddingRight = "";
			dialog.element.parentNode.removeChild(dialog.element);
			dialog = null;
		}, 220);
	}

	function createDialog(title) {
		var iframe = element("iframe", {"class": "config-dialog-content"});
		var modal = element("div", {"class": "config-dialog", "tabindex": "-1"}, [
			element("style", null, "body.config-dialog-open { padding-right: " + (window.innerWidth - document.documentElement.offsetWidth) + "px; }"),
			iframe
		]);

		var head = element("div", {"class": "config-dialog-head"}, title);
		var body = element("div", {"class": "config-dialog-body"});
        var sep = element("div", {"class": "config-dialog-sep"});
		var footer = element("div", {"class": "config-dialog-footer form-inline"});

		var style = element("style", null, getConfigCssString());

		document.body.classList.add("config-dialog-open");
		document.body.appendChild(modal);

		function manipulateIframe() {
			var doc = iframe.contentDocument;
			doc.head.appendChild(style);
			doc.body.appendChild(head);
			doc.body.appendChild(body);
            doc.body.appendChild(sep);
			doc.body.appendChild(footer);
		}

		iframe.contentWindow.onload = manipulateIframe;

		manipulateIframe();

		function render() {
			var body = iframe.contentDocument.body,
				w = body.offsetWidth,
				h = body.scrollHeight;

			iframe.style.width = w + "px";
			iframe.style.height = h + "px";
			modal.focus();

			modal.classList.add("config-dialog-ani");
		}

		return {
			element: modal,
			head: head,
			body: body,
			footer: footer,
			render: render
		};
	}

	function close(saveFlag) {
		var key, s;

		if (!dialog) {
			return;
		}
		destroyDialog();

		for (key in config.settings) {
			s = config.settings[key];
			if (saveFlag) {
				switch (s.type) {
					case "number":
						s.value = +s.element.value;
						break;

					case "checkbox":
						s.value = s.element.checked;
						break;

					case "radio":
						s.value = s.element.querySelector("input:checked").value;
						break;

					case "select":
						if (!s.multiple) {
							s.value = s.element.value;
						} else {
							s.value = Array.prototype.map.call(
								s.element.selectedOptions,
								function(ele){
									return ele.value;
								}
							);
						}
						break;

					default:
						s.value = s.element.value;
				}
				// Create inputs
			}
			// Create inputs
			s.element = null;
		}

		if (saveFlag) {
			save();
		}

		if (GM_config.onclose) {
			GM_config.onclose(saveFlag);
		}
	}

	function getConfigCssString() {
        if (config.style) {
		   return "*,:after,:before{box-sizing:border-box}a{transition:all .2s linear}a:link,a:visited{color:#707070}a:active,a:hover{color:#0a53f8}.link{color:#707070;text-decoration:underline;cursor:pointer}body{font-size:16px;font-family:\"Helvetica Neue\",Helvetica,Arial,\"微軟正黑體\",sans-serif;color:#3d3d3d;margin:0;line-height:1}h1,h2,h3,h4,h5,h6{margin-top:30px;margin-bottom:15px;font-weight:700}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small{font-size:70%;color:#8a8a8a}h1 .head-reset,h2 .head-reset,h3 .head-reset,h4 .head-reset,h5 .head-reset,h6 .head-reset{font-size:16px;font-weight:400}h1{font-size:260%}h2{font-size:215%;border-bottom:1px solid gray;padding-bottom:.25em}h3{font-size:170%}h4{font-size:125%}h5{font-size:100%}h6{font-size:85%}p{margin-top:.9375em;margin-bottom:.9375em;line-height:1.55}button,input,select,textarea{font-size:inherit;font-family:inherit;line-height:inherit;margin:0;padding:0;vertical-align:middle;height:2em;color:inherit;background-color:transparent;border:none}button:focus,input:focus,select:focus,textarea:focus{outline:0}:-moz-placeholder,::-moz-placeholder{opacity:1}:invalid{outline:0;box-shadow:none}textarea{height:auto;line-height:1.55;padding-top:.225em;padding-bottom:.225em}select{cursor:pointer;line-height:1.55}select[multiple]{height:auto}button{cursor:pointer;text-align:center;background-image:none}button::-moz-focus-inner{border:0;padding:0}img{vertical-align:text-bottom;max-width:100%;max-height:100%}code{font-family:Menlo,Monaco,Consolas,\"Courier New\",\"細明體\",monospace;background-color:#f0f0f0;font-size:90%;padding:.25em}pre{margin-top:1em;margin-bottom:1em;font-family:Menlo,Monaco,Consolas,\"Courier New\",\"細明體\",monospace}small{font-size:90%}hr{border:none;border-top:1px solid gray;margin:15px 0}::selection{background-color:rgba(255,169,46,.4)}::-moz-selection{background-color:rgba(255,169,46,.4)}fieldset,legend{border:0;margin:0;padding:0}input[type=checkbox],input[type=radio]{padding:0}.row-gap>fieldset>legend{position:relative;top:15px}input.ng-invalid,input.ng-invalid:focus,input.ng-invalid:hover,select.ng-invalid,select.ng-invalid:focus,select.ng-invalid:hover,textarea.ng-invalid,textarea.ng-invalid:focus,textarea.ng-invalid:hover{border-color:#cb1b1b}input[type=checkbox].ng-invalid,input[type=checkbox].ng-invalid:focus,input[type=checkbox].ng-invalid:hover,input[type=radio].ng-invalid,input[type=radio].ng-invalid:focus,input[type=radio].ng-invalid:hover{box-shadow:0 0 0 1px #cb1b1b}::-webkit-input-placeholder{color:#c9c9c9}::-moz-placeholder{color:#c9c9c9}:-ms-input-placeholder{color:#c9c9c9}:-moz-placeholder{color:#c9c9c9}.form-group{margin-top:1em;margin-bottom:1em}.row>.form-group{margin:0}label,legend{vertical-align:bottom}label .checkbox,label .form-control,label .input-group,label .radio,label+.checkbox,label+.form-control,label+.input-group,label+.radio,legend .checkbox,legend .form-control,legend .input-group,legend .radio,legend+.checkbox,legend+.form-control,legend+.input-group,legend+.radio{margin-top:.3em}.form-control{border:1px solid gray;border-radius:.1875em;width:100%;line-height:1;display:inline-block;padding-left:.5em;padding-right:.5em;color:#707070;transition:.2s all linear}.form-control:hover{border-color:#ccc}.form-control:focus{border-color:#0a53f8;color:#242424}.form-control[disabled]{background-color:#f0f0f0;border-color:#ccc;cursor:not-allowed}.form-control[disabled]:active,.form-control[disabled]:hover{border-color:#ccc}.checkbox,.radio{position:relative}.checkbox input[type=checkbox],.checkbox input[type=radio],.radio input[type=checkbox],.radio input[type=radio]{color:inherit;position:absolute;width:auto;height:auto;top:0;bottom:0;left:0;margin:auto 0}.checkbox label,.radio label,label.checkbox,label.radio{display:table;padding-left:1.5em;cursor:pointer;line-height:1.55;transition:.2s all linear}.checkbox label:hover,.radio label:hover,label.checkbox:hover,label.radio:hover{color:#707070}.checkbox+.checkbox,.checkbox+.radio,.radio+.checkbox,.radio+.radio{margin-top:0}.form-inline .checkbox,.form-inline .form-group,.form-inline .radio,.form-inline button,.form-inline fieldset,.form-inline input,.form-inline select{display:inline-block;vertical-align:middle;width:auto;margin:0}.btn-default{border:1px solid gray;border-radius:.1875em;transition-property:border-color,box-shadow;transition-duration:.2s;transition-timing-function:linear;padding-left:.5em;padding-right:.5em;min-width:4.25em}.btn-default:hover{border-color:#ccc}.btn-default:focus{color:#3d3d3d;border-color:#0a53f8}.btn-default:active{border-color:#0a53f8;box-shadow:inset .12em .12em .5em #dedede}.btn-default[disabled]{background-color:#f0f0f0;border-color:#ccc;cursor:not-allowed}.btn-default[disabled]:active,.btn-default[disabled]:hover{border-color:#ccc}.btn-sm{border:1px solid gray;border-radius:.1875em;transition-property:border-color,box-shadow;transition-duration:.2s;transition-timing-function:linear;width:2em;line-height:.8}.btn-sm:hover{border-color:#ccc}.btn-sm:focus{color:#3d3d3d;border-color:#0a53f8}.btn-sm:active{border-color:#0a53f8;box-shadow:inset .12em .12em .5em #dedede}.btn-sm[disabled]{background-color:#f0f0f0;border-color:#ccc;cursor:not-allowed}.btn-sm[disabled]:active,.btn-sm[disabled]:hover{border-color:#ccc}.btn-close{width:1em;height:1em;vertical-align:baseline;color:#707070}.btn-close:hover{color:inherit}.btn-circle{display:inline-block;width:1.25em;height:1.25em;text-align:center;line-height:1.25;font-size:80%;vertical-align:baseline;border-radius:50%;border:1px solid #707070;margin:-1px 0;color:#707070}.btn-circle:hover{color:inherit;border-color:inherit}.btn-block{display:block;width:100%}.btn-group{display:block;display:inline-block;border:1px solid gray;border-radius:.1875em}.btn-group>*{display:table-cell;vertical-align:middle;white-space:nowrap;border-width:0 1px;border-radius:0;margin-right:-1px}.btn-group>:first-child{margin-left:-1px}body{display:inline-block;padding:30px;overflow:hidden}.config-dialog-head{font-weight:700;font-size:120%}.config-dialog-head .btn-sm{font-size:50%;font-weight:400;width:auto;padding:0 2px;float:right}.config-dialog-head .btn-sm+*{margin-right:5px}.config-dialog-footer.form-inline{white-space:nowrap}.config-dialog-footer.form-inline>*+*{margin-left:15px}.config-dialog-footer.form-inline label.radio{padding:4px 0 1px 18px}.deco{line-height:0.5;text-align:center;font-size:110%;font-weight:bold;color:#999999}.deco span{display:inline-block;position:relative}.deco span:before,.deco span:after{content:'';position:absolute;height:5px;border-bottom:2px groove #999999;top:2px;width:200%}.deco span:before{right:100%;margin-right:15px}.deco span:after{left:100%;margin-left:15px}.config-dialog-sep{position:relative;border-top:2px groove #999999;margin:0 auto 10px auto;width:100%;}"+config.style;
        } else {
		   return "*,:after,:before{box-sizing:border-box}a{transition:all .2s linear}a:link,a:visited{color:#707070}a:active,a:hover{color:#0a53f8}.link{color:#707070;text-decoration:underline;cursor:pointer}body{font-size:16px;font-family:\"Helvetica Neue\",Helvetica,Arial,\"微軟正黑體\",sans-serif;color:#3d3d3d;margin:0;line-height:1}h1,h2,h3,h4,h5,h6{margin-top:30px;margin-bottom:15px;font-weight:700}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small{font-size:70%;color:#8a8a8a}h1 .head-reset,h2 .head-reset,h3 .head-reset,h4 .head-reset,h5 .head-reset,h6 .head-reset{font-size:16px;font-weight:400}h1{font-size:260%}h2{font-size:215%;border-bottom:1px solid gray;padding-bottom:.25em}h3{font-size:170%}h4{font-size:125%}h5{font-size:100%}h6{font-size:85%}p{margin-top:.9375em;margin-bottom:.9375em;line-height:1.55}button,input,select,textarea{font-size:inherit;font-family:inherit;line-height:inherit;margin:0;padding:0;vertical-align:middle;height:2em;color:inherit;background-color:transparent;border:none}button:focus,input:focus,select:focus,textarea:focus{outline:0}:-moz-placeholder,::-moz-placeholder{opacity:1}:invalid{outline:0;box-shadow:none}textarea{height:auto;line-height:1.55;padding-top:.225em;padding-bottom:.225em}select{cursor:pointer;line-height:1.55}select[multiple]{height:auto}button{cursor:pointer;text-align:center;background-image:none}button::-moz-focus-inner{border:0;padding:0}img{vertical-align:text-bottom;max-width:100%;max-height:100%}code{font-family:Menlo,Monaco,Consolas,\"Courier New\",\"細明體\",monospace;background-color:#f0f0f0;font-size:90%;padding:.25em}pre{margin-top:1em;margin-bottom:1em;font-family:Menlo,Monaco,Consolas,\"Courier New\",\"細明體\",monospace}small{font-size:90%}hr{border:none;border-top:1px solid gray;margin:15px 0}::selection{background-color:rgba(255,169,46,.4)}::-moz-selection{background-color:rgba(255,169,46,.4)}fieldset,legend{border:0;margin:0;padding:0}input[type=checkbox],input[type=radio]{padding:0}.row-gap>fieldset>legend{position:relative;top:15px}input.ng-invalid,input.ng-invalid:focus,input.ng-invalid:hover,select.ng-invalid,select.ng-invalid:focus,select.ng-invalid:hover,textarea.ng-invalid,textarea.ng-invalid:focus,textarea.ng-invalid:hover{border-color:#cb1b1b}input[type=checkbox].ng-invalid,input[type=checkbox].ng-invalid:focus,input[type=checkbox].ng-invalid:hover,input[type=radio].ng-invalid,input[type=radio].ng-invalid:focus,input[type=radio].ng-invalid:hover{box-shadow:0 0 0 1px #cb1b1b}::-webkit-input-placeholder{color:#c9c9c9}::-moz-placeholder{color:#c9c9c9}:-ms-input-placeholder{color:#c9c9c9}:-moz-placeholder{color:#c9c9c9}.form-group{margin-top:1em;margin-bottom:1em}.row>.form-group{margin:0}label,legend{vertical-align:bottom}label .checkbox,label .form-control,label .input-group,label .radio,label+.checkbox,label+.form-control,label+.input-group,label+.radio,legend .checkbox,legend .form-control,legend .input-group,legend .radio,legend+.checkbox,legend+.form-control,legend+.input-group,legend+.radio{margin-top:.3em}.form-control{border:1px solid gray;border-radius:.1875em;width:100%;line-height:1;display:inline-block;padding-left:.5em;padding-right:.5em;color:#707070;transition:.2s all linear}.form-control:hover{border-color:#ccc}.form-control:focus{border-color:#0a53f8;color:#242424}.form-control[disabled]{background-color:#f0f0f0;border-color:#ccc;cursor:not-allowed}.form-control[disabled]:active,.form-control[disabled]:hover{border-color:#ccc}.checkbox,.radio{position:relative}.checkbox input[type=checkbox],.checkbox input[type=radio],.radio input[type=checkbox],.radio input[type=radio]{color:inherit;position:absolute;width:auto;height:auto;top:0;bottom:0;left:0;margin:auto 0}.checkbox label,.radio label,label.checkbox,label.radio{display:table;padding-left:1.5em;cursor:pointer;line-height:1.55;transition:.2s all linear}.checkbox label:hover,.radio label:hover,label.checkbox:hover,label.radio:hover{color:#707070}.checkbox+.checkbox,.checkbox+.radio,.radio+.checkbox,.radio+.radio{margin-top:0}.form-inline .checkbox,.form-inline .form-group,.form-inline .radio,.form-inline button,.form-inline fieldset,.form-inline input,.form-inline select{display:inline-block;vertical-align:middle;width:auto;margin:0}.btn-default{border:1px solid gray;border-radius:.1875em;transition-property:border-color,box-shadow;transition-duration:.2s;transition-timing-function:linear;padding-left:.5em;padding-right:.5em;min-width:4.25em}.btn-default:hover{border-color:#ccc}.btn-default:focus{color:#3d3d3d;border-color:#0a53f8}.btn-default:active{border-color:#0a53f8;box-shadow:inset .12em .12em .5em #dedede}.btn-default[disabled]{background-color:#f0f0f0;border-color:#ccc;cursor:not-allowed}.btn-default[disabled]:active,.btn-default[disabled]:hover{border-color:#ccc}.btn-sm{border:1px solid gray;border-radius:.1875em;transition-property:border-color,box-shadow;transition-duration:.2s;transition-timing-function:linear;width:2em;line-height:.8}.btn-sm:hover{border-color:#ccc}.btn-sm:focus{color:#3d3d3d;border-color:#0a53f8}.btn-sm:active{border-color:#0a53f8;box-shadow:inset .12em .12em .5em #dedede}.btn-sm[disabled]{background-color:#f0f0f0;border-color:#ccc;cursor:not-allowed}.btn-sm[disabled]:active,.btn-sm[disabled]:hover{border-color:#ccc}.btn-close{width:1em;height:1em;vertical-align:baseline;color:#707070}.btn-close:hover{color:inherit}.btn-circle{display:inline-block;width:1.25em;height:1.25em;text-align:center;line-height:1.25;font-size:80%;vertical-align:baseline;border-radius:50%;border:1px solid #707070;margin:-1px 0;color:#707070}.btn-circle:hover{color:inherit;border-color:inherit}.btn-block{display:block;width:100%}.btn-group{display:block;display:inline-block;border:1px solid gray;border-radius:.1875em}.btn-group>*{display:table-cell;vertical-align:middle;white-space:nowrap;border-width:0 1px;border-radius:0;margin-right:-1px}.btn-group>:first-child{margin-left:-1px}body{display:inline-block;padding:30px;overflow:hidden}.config-dialog-head{font-weight:700;font-size:120%}.config-dialog-head .btn-sm{font-size:50%;font-weight:400;width:auto;padding:0 2px;float:right}.config-dialog-head .btn-sm+*{margin-right:5px}.config-dialog-footer.form-inline{white-space:nowrap}.config-dialog-footer.form-inline>*+*{margin-left:15px}.config-dialog-footer.form-inline label.radio{padding:4px 0 1px 18px}.deco{line-height:0.5;text-align:center;font-size:110%;font-weight:bold;color:#999999}.deco span{display:inline-block;position:relative}.deco span:before,.deco span:after{content:'';position:absolute;height:5px;border-bottom:2px groove #999999;top:2px;width:200%}.deco span:before{right:100%;margin-right:15px}.deco span:after{left:100%;margin-left:15px}.config-dialog-sep{position:relative;border-top:2px groove #999999;margin:0 auto 10px auto;width:100%;}";
        }
    }

	function getCssString() {
		return ".config-dialog-open{overflow:hidden}.config-dialog{position:fixed;top:0;left:0;right:0;bottom:0;vertical-align:middle;text-align:center;background:rgba(0,0,0,.5);overflow:auto;z-index:99999;opacity:0;transition:opacity .2s linear;white-space:nowrap}.config-dialog:before{content:\"\";display:inline-block;height:100%;vertical-align:middle}.config-dialog-ani{opacity:1}.config-dialog-content{text-align:left;display:inline-block;width:90%;vertical-align:middle;background:#fff;margin:30px 0;box-shadow:0 0 30px #000;border-width:0;transition:transform .2s linear;transform:translateY(-20px)}.config-dialog-ani .config-dialog-content{transform:none}";
	}

	function setupDialogValue (reset, imports) {
		var key, setting, value;

		for (key in config.settings) {
			setting = config.settings[key];

			if (reset) {
				value = setting.default;
			} else {
				if (imports && imports[key] != undefined) {
					value = imports[key];
				} else {
					value = setting.value;
				}
			}

			switch (setting.type) {
				case "number":
					setting.element.value = value.toString();
					break;

				case "checkbox":
					setting.element.checked = value;
					break;

				case "radio":
					setting.element.querySelector("[value=" + value + "]").checked = true;
					break;

				case "select":
					if (!setting.multiple) {
						setting.element.querySelector("[value=" + value + "]").selected = true;
					} else {
						while (setting.element.selectedOptions.length) {
							setting.element.selectedOptions[0].selected = false;
						}
						value.forEach(function(value){
							setting.element.querySelector("[value=" + value + "]").selected = true;
						});
					}
					break;

				default:
					setting.element.value = value;
					break;
			}
		}
	}

	function createInputs(dialog) {
		var key, s, group;

		for (key in config.settings) {
			s = config.settings[key];

			if (s.type == "textarea") {
				s.element = element("textarea", {"id": key});
				s.element.classList.add("form-control");
				group = [
					element("label", {"for": key}, s.label),
					s.element
				];
			} else if (s.type == "radio") {
				s.element = element("fieldset", null, [element("legend", null, s.label)].concat(Object.keys(s.options).map(function(optKey){
					return element("label", {class: "radio"}, [
						element("input", {type: "radio", name: key, value: optKey}),
						s.options[optKey]
					]);
				})));
				group = [
					s.element
				];
			} else if (s.type == "select") {
				s.element = element(
					"select",
					{class: "form-control", multiple: !!s.multiple},
					Object.keys(s.options).map(function(optKey){
						return element(
							"option",
							{value: optKey},
							s.options[optKey]
						);
					})
				);
				group = element("label", null, [
					s.label,
					s.element
				]);
			} else {
				s.element = element("input", {"id": key, "type": s.type});

				switch (s.type) {
					case "section":
                        s.element = element("div", {"class": "section"},
                                          [element("p", {"class": "deco", "id": key},
                                              [element("span",null, s.label)]
                                          )]
                                       );
						group = [s.element]
						break;
					case "number":
						s.element.classList.add("form-control");
						group = [
							element("label", {"for": key}, s.label),
							s.element
						];
						break;
					case "checkbox":
						group = element("div", {"class": "checkbox"}, [
							s.element,
							element("label", {"for": key}, s.label)
						]);
						break;
					default:
						s.element.classList.add("form-control");
						group = [
							element("label", {"for": key}, s.label),
							s.element
						];
				}
			}

			dialog.body.appendChild(
				element("div", {"class": "form-group"}, group)
			);
		}
	}

	function createFooter(dialog) {
		var local = config.local;

		dialog.footer.appendChild(frag([
			element("button", {"class": "btn-default", event: {
				click: function () {
					config.local = local;
					close(true);
				}
			}}, "Save"),

			element("button", {"class": "btn-default", event: {
				click: function() {
					close();
				}
			}}, "Cancel"),

			element("button", {class: "btn-default", event: {
				click: function() {
					setupDialogValue(true);
				}
			}}, "Default"),

			element("label", {class: "radio"}, [
				element("input", {type: "radio", name: "working-scope", checked: !local, event: {
					change: function () {
						local = !this.checked;
					}
				}}),
				"Global setting"
			]),

			element("label", {class: "radio"}, [
				element("input", {type: "radio", name: "working-scope", checked: local, event: {
					change: function () {
						local = this.checked;
					}
				}}),
				"On " + location.hostname
			])
		]));
	}

	function exportSetting() {
		var exports = JSON.stringify(getConfigObj());
		prompt("Copy:", exports);
	}

	function importSetting() {
		var imports = prompt("Paste your setting:"), setting;
		if (!imports) {
			return;
		}
		try {
			setting = JSON.parse(imports);
		} catch (err) {
			alert("Invalid JSON!");
			return;
		}
		setupDialogValue(false, setting);
	}

	function createHead(dialog) {
		dialog.head.appendChild(frag([
			element("button", {class: "btn-sm", event: {
				click: exportSetting
			}}, "Export"),
			element("button", {class: "btn-sm", event: {
				click: importSetting
			}}, "Import")
		]));
	}

	function open() {
		if (!css) {
			css = element("style", {"id": "config-css"}, getCssString());
			document.head.appendChild(css);
		}

		if (!dialog) {
			dialog = createDialog(config.title);

			// Create head
			createHead(dialog);

			// Create inputs
			createInputs(dialog);

			// Setup values
			setupDialogValue();

			// Create footer
			createFooter(dialog);

			// Render
			dialog.render();
		}
	}

	function getConfigObj(key) {
		var con;

		if (typeof key == "string") {
			return config.settings[key].value;
		} else {
			if (typeof key == "object") {
				con = key;
			} else {
				con = {};
			}
			for (key in config.settings) {
				con[key] = config.settings[key].value;
			}
			return con;
		}
	}

	GM_config = {
		init: function(title, settings, configstyle) {
			config.title = title;
			config.settings = settings;
            config.style = configstyle;
			read();
			return GM_config.get();
		},
		open: open,
		close: close,
		get: getConfigObj
	};

	return GM_config;
}();
