// ==UserScript==
// @name        快捷便笺+
// @namespace   kjnote Scripts
// @author      Takitooru
// @match       *://*/*
// @version     1.1.0.5
// @description 快捷便笺，快速记录所需信息
// @license     GPL License
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @grant       GM_addStyle
// @grant       GM_addElement
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/456123/%E5%BF%AB%E6%8D%B7%E4%BE%BF%E7%AC%BA%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/456123/%E5%BF%AB%E6%8D%B7%E4%BE%BF%E7%AC%BA%2B.meta.js
// ==/UserScript==
(function() {
	window.addEventListener('load', function() {
		const RndToken = ({
			__TOKEN_LIST__:['ContainerID', 'ContainerCSSOpen'],
			init() {
				this.__TOKEN_LIST__.forEach((name) => (this[name] = randstr(16, false, true)));
				return this;
			}
		}).init();
		const CONST = {
			CSS: {
				outer: replaceText(
					`#{ContainerID}{width:20px;border:1px solid #70ae2d;position:fixed;top:2px;right:0px;z-index:999999999999999999999;background-color:#8bc34a;color:#fff;border-radius:3px;font:initial;opacity:0.5;transition-duration: 0.3s;}
					#{ContainerID}:hover, #{ContainerID}.{ContainerCSSOpen}{opacity:1;}`,
					{'{ContainerID}': RndToken.ContainerID, '{ContainerCSSOpen}': RndToken.ContainerCSSOpen}
				),
				inner: `.kjbtn{display: inline-block;text-align: center;cursor:pointer;user-select:none;}
				.boxhide{display: none;position:fixed;z-index:998;padding:3px;border-radius:3px;}
				.jstoolbar{color:#000;display:block;border-bottom:1px solid #ddd;background-color:#eeeeee;padding:10px 0 10px 0;}
				.slider{display:inline-block;font-size:13px}.sliderinput{vertical-align:middle;}
				.sclose{margin-right: 10px;font-size: 14px;text-align: center;font-weight:bold;color:black;width:20px;float:left;cursor:pointer;}
				.savetxt{width:80px;float:right;background-color:#8bc34a;border-radius:3px;color:#fff;padding:2px;font-size: 14px;text-align: center;cursor:pointer;margin-right:1em;}
				.stextarea{background-color: #eeeeee;margin: 0;padding: 5px 0 0 0;height: 200px;width: 350px;color: #000;font-size: 15px;resize: vertical;outline:none;border: none;scrollbar-width: thin;}.stextarea:focus{border: none;box-shadow: none;}
				.stextarea::-webkit-scrollbar {width: 5px;height: 5px;}.stextarea::-webkit-scrollbar-thumb {border-radius: 3px;-webkit-border-radius: 3px;background-color: #8bc34a;}.stextarea::-webkit-scrollbar-track {background-color: transparent;}`
			},
			HTML: {
				all: `<span class="kjbtn">快捷便笺+</span>
				<div class="boxhide"><div class="jstoolbar"><div class="sclose">X</div>
				<div class="slider">透明度:<input class="sliderinput" type="range" min="30" max="100" step="1" value="100"></div>
				<div class="savetxt">保存为txt</div>
				</div><textarea class="stextarea"></textarea></div>`
			}
		};

		const Newdiv = document.createElement("div");
		Newdiv.id = RndToken.ContainerID;
		stopPropagation(Newdiv, ['click', 'dblclick', 'input', 'change', 'focus', 'blur', 'copy', 'paste', 'contextmenu', 'drag', 'mouseenter', 'mousemove', 'mouseover', 'mouseleave', 'mousedown', 'keydown', 'keyup', 'keypress']);
		const shadow = Newdiv.attachShadow({mode: 'closed'});
		shadow.innerHTML = CONST.HTML.all;
		document.body.appendChild(Newdiv);

		GM_addStyle(CONST.CSS.outer);
		GM_addElement(shadow, 'style', {textContent: CONST.CSS.inner});

		const boxname = $(shadow, ".boxhide");
		const kjbtn = $(shadow, ".kjbtn");
		const close = $(shadow, ".sclose");
		const input = $(shadow, ".stextarea");
		const savetxt = $(shadow, ".savetxt");
		const opacity2t = $(shadow, ".sliderinput");
		kjbtn.addEventListener('click', e => e.preventDefault() || e.stopImmediatePropagation() || [...Newdiv.classList].includes(RndToken.ContainerCSSOpen) ? hide() : show(), {capture: true});
		close.onclick = hide;
		input.oninput = save;
		input.value = GM_getValue('text', '');
		if (typeof GM_addValueChangeListener === 'function') {
			GM_addValueChangeListener('text', function(name, old_value, new_value, remote) {
				remote && (input.value = new_value);
			});
		} else {
			setInterval(function() {
				input.value = GM_getValue('text', '');
			}, 500);
		}
		savetxt.addEventListener("click",function(e) {
			Val2txt();
		});
		opacity2t.addEventListener("input",function(e) {
			o2t(this);
		});

		function show() {
			Newdiv.classList.add(RndToken.ContainerCSSOpen);
			boxname.style.display = "block";
			boxname.style.top = "2px";
			boxname.style.right = (Newdiv.clientWidth + 2) + "px";
		}

		function hide() {
			Newdiv.classList.remove(RndToken.ContainerCSSOpen);
			boxname.style = null;
		}

		function save() {
			GM_getValue('text', '') !== input.value && GM_setValue('text', input.value);
		}

		function Val2txt() {
			const Filename = new Date().getTime();
			const TextContent = input.value;
			const Addele = document.createElement('a');
			Addele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(TextContent));
			Addele.setAttribute('download', Filename);
			const jset = document.createEvent('MouseEvents');
			jset.initEvent('click', true, true);
			Addele.dispatchEvent(jset);

		}

		function o2t(vv) {
			input.style.opacity = vv.value / 100;
		}

		function stopPropagation(elm, evtName) {
			Array.isArray(evtName) ? evtName.forEach(name => stopPropagation(elm, name)) : elm.addEventListener(evtName, e => e.stopPropagation());
		}
	});

	// Basic functions
	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}
	// createElement
	function $CrE() {
		switch(arguments.length) {
			case 2:
				return arguments[0].createElement(arguments[1]);
				break;
			default:
				return document.createElement(arguments[0]);
		}
	}

	// Replace model text with no mismatching of replacing replaced text
	// e.g. replaceText('aaaabbbbccccdddd', {'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e'}) === 'bbbbccccddddeeee'
	//      replaceText('abcdAABBAA', {'BB': 'AA', 'AAAAAA': 'This is a trap!'}) === 'abcdAAAAAA'
	//      replaceText('abcd{AAAA}BB}', {'{AAAA}': '{BB', '{BBBB}': 'This is a trap!'}) === 'abcd{BBBB}'
	//      replaceText('abcd', {}) === 'abcd'
	/* Note:
	    replaceText will replace in sort of replacer's iterating sort
	    e.g. currently replaceText('abcdAABBAA', {'BBAA': 'TEXT', 'AABB': 'TEXT'}) === 'abcdAATEXT'
	    but remember: (As MDN Web Doc said,) Although the keys of an ordinary Object are ordered now, this was
	    not always the case, and the order is complex. As a result, it's best not to rely on property order.
	    So, don't expect replaceText will treat replacer key-values in any specific sort. Use replaceText to
	    replace irrelevance replacer keys only.
	*/
	function replaceText(text, replacer) {
		if (Object.entries(replacer).length === 0) {return text;}
		const [models, targets] = Object.entries(replacer);
		const len = models.length;
		let text_arr = [{text: text, replacable: true}];
		for (const [model, target] of Object.entries(replacer)) {
			text_arr = replace(text_arr, model, target);
		}
		return text_arr.map((text_obj) => (text_obj.text)).join('');

		function replace(text_arr, model, target) {
			const result_arr = [];
			for (const text_obj of text_arr) {
				if (text_obj.replacable) {
					const splited = text_obj.text.split(model);
					for (const part of splited) {
						result_arr.push({text: part, replacable: true});
						result_arr.push({text: target, replacable: false});
					}
					result_arr.pop();
				} else {
					result_arr.push(text_obj);
				}
			}
			return result_arr;
		}
	}

	// Append a style text to document(<head>) with a <style> element
    function addStyle(css, id, parent=document.head) {
		const style = document.createElement("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of document.querySelectorAll('#'+id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
        parent.appendChild(style);
    }

	// Returns a random string
	function randstr(length=16, nums=true, cases=true) {
		const all = 'abcdefghijklmnopqrstuvwxyz' + (nums ? '0123456789' : '') + (cases ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '');
		return Array(length).fill(0).reduce(pre => (pre += all.charAt(randint(0, all.length-1))), '');
	}

	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})();