// ==UserScript==
// @name        Gazelle : External CSS Saver
// @namespace   phracker + hateradio
// @description Save External CSS
// @include     http*://*.what.cd/user.php?action=edit&userid=*
// @include     http*://*.apollo.rip/user.php?action=edit&userid=*
// @include     http*://*.redacted.ch/user.php?action=edit&userid=*
// @include     http*://*.broadcasthe.net/user.php?action=edit&userid=*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36726/Gazelle%20%3A%20External%20CSS%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/36726/Gazelle%20%3A%20External%20CSS%20Saver.meta.js
// ==/UserScript==

(function(){
	var strg, saver;
	
	strg = {
		on:(function(){ try { var s = window.localStorage; if(s.getItem&&s.setItem&&s.removeItem){return true;} }catch(e){return false;} }()),
		read:function(key){ return this.on ? JSON.parse(window.localStorage.getItem(key)) : false; },
		save:function(key, dat){ return this.on ? !window.localStorage.setItem(key, JSON.stringify(dat)) : false; },
		wipe:function(key){ return this.on ? !window.localStorage.removeItem(key) : false; },
		zero:function(o){ var k; for(k in o){ if(o.hasOwnProperty(k)){ return false; } } return true; },
		grab:function(key, def){ return this.read(key) || def; }
	};
		
	saver = {
		boxes : 8,
		cssBoxUrl : document.getElementById('styleurl'),
		cssBox : document.getElementById('styleurl').parentNode,
		submitButton : document.querySelector('input[value="Save Profile"]'),
		data : strg.grab('css_saves', {}),
		reg : /(?:\.css)/,
		init : function () {
			this.box.insert();
			this.submitButton.addEventListener('click', this.box.saveValues, false);
		},
		box : {
			saveValues : function () {
				var i = 0, s = {}, v = '';
				for (i; i < saver.boxes; i++) {
					v = document.getElementById('addcss'+i).value;
					s[i] = saver.reg.test(v) ? v : '';
				}
				strg.save('css_saves', s);
			},
			putValue : function () {
				if (saver.reg.test(this.value)) {
					document.getElementById('styleurl').value = this.value;
				}
			},
			getValue : function (id) {
				return saver.data[id] || '';
			},
			insert : function () {
				var i = 0, e, f = document.createDocumentFragment(), s = document.createElement('small');
				f.appendChild(document.createElement('br'));
				for (i; i < saver.boxes; i++) {
					e = document.createElement('input');
					e.type = 'url';
					e.id = 'addcss' + i;
					e.value = this.getValue(i);
					e.size = 60;
					e.addEventListener('dblclick', saver.box.putValue, false);
					f.appendChild(e);
					f.appendChild(document.createElement('br'));
				}
				s.textContent = 'Submit the form to save.';
				f.appendChild(s);
				saver.cssBox.appendChild(f);
			}
		}
	};
	saver.init();
}());