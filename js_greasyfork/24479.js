// ==UserScript==
// @name        forSPAMlol
// @namespace   forspamlol
// @description ALIVE CHAT
// @include     https://www.twitch.tv/*
// @version     forsenE
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24479/forSPAMlol.user.js
// @updateURL https://update.greasyfork.org/scripts/24479/forSPAMlol.meta.js
// ==/UserScript==

(function(){
	var a, b, button, d = document, html, i, fn, fn2, fn3, fn4, timer, images, add, stor, pos, ui, sub, spamming;
	stor = localStorage;
	html = '<tr><td><input title="Real input. Supports /me, but nothing else" style="color: #eee; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 84px;"></td><td><input title="No. of times to repeat input" style="color: #eee; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 43px; margin-right: 2px;"><input title="Milliseconds between messages" style="color: #eee; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 43px;"></td></tr><tr><td><input title="Text to fill in between repeated input. Double click for superlongspam" style="color: #eee; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 84px;"></td><td style="transform: translateY(-1px); color: transparent;"><button style="background: rgb(0,200,90); box-sizing: border-box; border: 1px solid #6441a4; width: 19px; margin-right: 4px; border-radius: 2px; height: 19px;" title="Start spamming">|</button><button title="Test your message once in chat" style="background: rgb(0,150,200); box-sizing: border-box; border: 1px solid #6441a4; width: 19px; border-radius: 2px; height: 19px; margin-right: 4px;">|</button><button title="Are you a sub?" style="background: ' + (stor.subspam ? "rgb(0,200,90)" : "transparent") + '; box-sizing: border-box; border: 1px solid #6441a4; width: 19px; border-radius: 2px; height: 19px; color: rgb(255,255,0); font-weight: 900;">$</button></td></tr>';
	a = d.createElement("table");
	add = d.createElement("a");
	pos = 0;
	spamming = false;
	fn = function() {
		var _new = d.createElement("div"), process = w => {
			var img = d.createElement("img"), fn = e => {
				e.preventDefault();
				e.stopPropagation();
				if (e.button != 0) {
					let array, edit;
					array = JSON.parse(stor.spamimages);
					edit = array.splice(Number(e.target.dataset.pos), 1);
					if (e.button == 1) {
						add.click();
						edit = edit[0];
						i[4].value = edit[0];
						i[5].value = edit[1];
						i[6].value = edit[2];
						i[7].value = edit[3];
						i[8].value = edit[4];
					}
					e.target.remove();
					stor.spamimages = JSON.stringify(images = array);
					pos = 0;
					[].slice.call(d.querySelectorAll("div>img[data-pos]")).forEach(a=>{
						a.dataset.pos="";
						a.dataset.pos=pos++
					});
				} else {
					i[0].value = w[2];
					i[1].value = w[4];
					i[3].value = w[3];
				}
			}, fn2 = e => e.target.remove();
			img.setAttribute("src", w[0]);
			img.alt = img.title = w[1];
			img.onmouseup = fn;
			img.className = "emoticon";
			img.style.margin = "1px";
			img.style.cursor = "pointer";
			img.style.minWidth = img.style.minHeight = "10px";
			img.style.maxWidth = img.style.maxHeight = "35px";
			img.dataset.pos = pos++;
			ui.insertBefore(img, add);
		}, close = () => {
			i[4].value = i[5].value = i[6].value = i[7].value = i[8].value = "";
			_new.style.display = "none";
			add.hidden = false;
		};
		a.innerHTML = html;
		a.style = "width: 178px; max-width: 178px; color: #eee; margin: 0 auto -2px;";
		ui.appendChild(add);
		add.innerHTML = '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; margin: 1px 0;"><g><line fill="none" stroke="#aaa" stroke-width="4" x1="4" y1="15" x2="26" y2="15"/><line fill="none" stroke="#aaa" stroke-width="4" x1="15" y1="4" x2="15" y2="26"/></g></svg>';
		add.title = "Add new shortcut spam. Right click on saved spam icons to remove them from the shortcuts, middle click to delete the icon and copy the spam into the editor";
		ui.appendChild(_new);
		_new.style = "display: none; margin-bottom: 2px; border-top: 1px solid #6441a4; padding: 2px 0 0 2px";
		_new.innerHTML = 'Icon URL: <input style="color: white; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 105px; margin-right: 2px; float: right;" title="Right click on the desired icon in chat then select \'Copy Image Location\'">Tooltip: &nbsp; &nbsp; &nbsp;<input style="color: white; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 105px; margin-right: 2px; float: right;" title="The text that appears when you hover over the icon. Optional">Input: &nbsp; &nbsp; &nbsp; &nbsp;<input title="The text you want to spam gachiBASS" style="color: white; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 105px; margin-right: 2px; float: right;">Fill text: <input title="Filler between the repeated input text. Optional" style="color: white; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 105px; margin-right: 2px; float: right;">Repeats: <input title="No. of times to repeat input" style="color: white; background: transparent; box-sizing: border-box; border: 1px solid #6441a4; width: 105px; margin-right: 2px; float: right;"><button style="background: transparent none repeat scroll 0% 0%; box-sizing: border-box; border: 1px solid #6441a4; margin-right: 12px; border-radius: 2px; height: 19px; width: 50px;">Cancel</button><button style="background: transparent none repeat scroll 0% 0%; box-sizing: border-box; border: 1px solid #6441a4; border-radius: 2px; height: 19px; width: 50px; margin-right: 12px;" title="Copy the current spam from the top into this shortcut">Copy</button><button style="background: transparent none repeat scroll 0% 0%; box-sizing: border-box; border: 1px solid #6441a4; border-radius: 2px; height: 19px; width: 50px;">Save</button>';
		i = ui.querySelectorAll("input");
		b = ui.querySelectorAll("button");
		i[0].value = "gachiBASS";
		i[1].value = "15";
		i[2].value = "2000";
		i[3].addEventListener("dblclick", () => {i[3].value="                       "}, false);
		b[1].onclick = fn2;
		b[0].onclick = fn3;
		add.onclick = () => {
			add.hidden = true;
			i[5].value = "New Shortcut";
			i[8].value = "1";
			_new.style.display = "block";
		};
		b[2].onclick = () => {
			if (stor.subspam) {
				stor.subspam = "";
				b[2].style.backgroundColor = "transparent";
			} else {
				stor.subspam = "true";
				b[2].style.backgroundColor = "rgb(0,200,90)";
			}
		};
		b[3].onclick = close;
		b[4].onclick = () => {
			i[6].value = i[0].value;
			i[7].value = i[3].value;
			i[8].value = i[1].value;
		};
		b[5].onclick = () => {
			var new_img = [i[4].value, i[5].value, i[6].value, i[7].value, i[8].value];
			try {process(new_img)}
			catch(e){return close()}
			images.push(new_img);
			stor.spamimages = JSON.stringify(images);
			close();
		};
		images.forEach(process);
	};
	fn2 = function() {
		var chat, m;
		chat = d.querySelector("#right-column .chat-input > textarea");
		if (!button) button = d.querySelector(".chat-buttons-container > button.button:last-of-type");
		m = Array(parseInt(i[1].value)).fill(i[0].value).join(" "+i[3].value+" ");
		if (m.substr(0, 3) === "/me") m = "/me " + m.replace(/\/me /g, "");
		else m = ". " + m;
		chat.value = m;
		button.click();
	};
	fn3 = function() {
		if (!spamming) {
			spamming = true;
			b[0].style.backgroundColor = "rgb(200,0,0)";
			b[0].title = "Stop spamming";
			fn2();
			timer = setInterval(fn2, Number(i[2].value));
		} else {
			spamming = false;
			b[0].style.backgroundColor = "rgb(0,200,90)";
			b[0].title = "Start spamming";
			clearInterval(timer);
		}
	};
	fn4 = function() {
		var cb, fancy;
		if (document.location.pathname.indexOf("/forsenlol") != 0) {
			try {
				ui.remove();
				ui = null;
			} catch(e){}
			return;
		}
		else if (document.location.pathname.indexOf("/forsenlol") == 0 && ui) return;
		ui = d.createElement('div');
		cb = function(e) {
			var pos = [ui.offsetLeft,ui.offsetTop], origin = getCoors(e);
			function getCoors(e) {
				var coors = new Array(2);
				coors[0] = e.clientX;
				coors[1] = e.clientY;
				return coors;
			}
			function moveDrag(e) {
				var currentPos = getCoors(e);
				var rect = ui.getBoundingClientRect();
				ui.style.right = "";
				var deltaX = currentPos[0] - origin[0];
				var deltaY = currentPos[1] - origin[1];
				var destX = pos[0] + deltaX;
				var destY = pos[1] + deltaY;
				if(destX < 0) destX = 0;
				if(destX > (d.documentElement.clientWidth - rect.width)) destX = d.documentElement.clientWidth - rect.width;
				if(destY < 0) destY = 0;
				if(destY > (d.documentElement.clientHeight - rect.height)) destY = d.documentElement.clientHeight - rect.height;
				ui.style.left = stor.leleft = destX + 'px';
				ui.style.top  = stor.letop = destY + 'px';
			}
			d.onmousemove = moveDrag;
			d.onmouseup = function () {
				d.onmousemove = null;
				d.onmouseup = null;
			};
			return false;
		};
		ui.style.cssText = 'position: absolute; top: ' + (stor.letop || '16px') + '; ' + (stor.leleft ? ('left: '+stor.leleft+';') : 'right: 300px;') + ' width: 180px; background-color: rgb(20,20,20); color: #eee; border: 1px solid #6441a4; z-index: 9420';
		ui.innerHTML = '<center style="cursor: move; padding: 5px;">Forspam</center><span style="display: block; width: 100%; border-bottom-style: solid; border-bottom-width: 1px; border-color: #6441a4"></span>';
		d.body.appendChild(ui);
		ui.querySelector("center").onmousedown = cb;
		ui.appendChild(a);
		if (!stor.spamimages) {
			fancy = "/me ▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬ forsenPls forsenPls forsenPls forsenPls forsenPls forsenPls forsenPls forsenPls forsenPls forsenPls ▬▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬▬";
			images = [
				["//cdn.betterttv.net/emote/55e2096ea6fa8b261f81b12a/1x", "fancydance", fancy, "", 1],
				["//cdn.betterttv.net/emote/5608cf93fdaf5f3275fe39cd/1x", "weebdance", fancy.replace(/forsenPls/g, "nyanPls"), "", 1],
				["//cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/1x", "had to report", "/me SORRY FORSEN I HAD TO REPORT YOU", "FeelsBadMan", 4]
			];
			stor.spamimages = JSON.stringify(images);
		} else {
			images = JSON.parse(stor.spamimages);
		}
		fn();
	};
	setInterval(fn4, 1000);
}())