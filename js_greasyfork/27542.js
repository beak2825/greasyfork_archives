// ==UserScript==
// @name           Gazelle YAVAH
// @namespace      https://greasyfork.org/en/scripts/27542-gazelle-yavah
// @author         hateradio
// @version        3.3
// @description    Yet Another Various Artists Helper
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU2MDFGNUQ0OUEwQzExRTA4MDU3OTY0MDk4NTc5NjBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU2MDFGNUQ1OUEwQzExRTA4MDU3OTY0MDk4NTc5NjBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTYwMUY1RDI5QTBDMTFFMDgwNTc5NjQwOTg1Nzk2MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTYwMUY1RDM5QTBDMTFFMDgwNTc5NjQwOTg1Nzk2MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz55oPNtAAAB6klEQVR42uyXPWsCQRCGV5FUJ9pqkVJ7tVesFVtNlUar/Ae5XotACsEmzZ22orXoD9Be7bULBK0CgewzsMcRPYIWXoobWGf2nN15550ZP2LpdPpRKfWiV0rdVz70ek3oF1uvZxWOpOL65UGFJwIgVIkARAAiABGACEAEIAJwNYBcLqfm87nYvV7Psx3HUfV6/c/zk8lElctlb5+4FsDxeBTNJYVCwbMty1KLxUL2PO92uyqZTCrbtuUMYI1st9vbAZxOJ9FkO5vNVK1WE3s8HnvgOp2O7GGrWCzKGg6H8l6z2VSHw+H2EpggZDkajTzbZG/KtN/vhQGCZTIZ2aP9wW9uQkCs12u5jLVcLiUo9UXYUwLKAktQzh62OOeXmP5Z7mj9FNIQuGcMQBuZQCuU0d1kR53p+FarJc+x0f4J8PuY5jSs+G2/JC7RSwNVKhUJ7KfQ1BONH3apVJJz0+lUgBgfJJvNqt1u59m/6Q/sARqKehGYRiMjLgYMoBD2+Xxeurrf71/0QcMkrLTb7bMGDBxD48hllIQgaDP32IADJL5kaebe7wMTjB9JDAaDiwDiQZ92BgjIoa5arapGoyHPTRnQrusG+nDParUSMNibzeYs1r+Ygu8Qv4u+6IF3vfiLbt05+Kdebz8CDACimwIgWblgdAAAAABJRU5ErkJggg==
// @icon64         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY0NDMyN0UzOUEwQzExRTA4REU5OUY2M0Q5RDZGNTQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY0NDMyN0U0OUEwQzExRTA4REU5OUY2M0Q5RDZGNTQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjQ0MzI3RTE5QTBDMTFFMDhERTk5RjYzRDlENkY1NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjQ0MzI3RTI5QTBDMTFFMDhERTk5RjYzRDlENkY1NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6q1rvzAAAEMElEQVR42uyaP0gcQRTG12CpYBkVUkWto22CYqtiq7FWrNVervdPK5r2oq2orSiptQkE1LRqkSooBNIk+xvyLe/m9la9XDzIvoFh9mZnZme+973vvRE7enp6kjKXF3/aD2n9VbJa4eAdKQPepu2nkhJgAAa8KrEHvHyRlLw4AA6AA+AAOAAOgAPgADgADoAD4AA4AA6AA+AAOAAOgAPgADgADoAD4AA4AA6AA+AAOAAOgAPQmjI7O5scHx8nq6urWd/o6Gjoo/JeZWFhIfTRtqIsLS3VfaNtDOju7s6ep6amcvsnJiZCe3Bw0JJvjoyMhPbi4iL3fedzHPzm5ia0XV1doR0cHEyGh4eTu7u7cHj1Awq/T09Pk9vb21wAsSjsoVxeXiaVSqVmLCzT+729vWztvPXapgGiIwe1DNDGT05Ocg+/tbWVjRGQy8vL2e+1tbWa9zMzM2EeQLcVAH2czVCxPn2Hh4ehv7e3N2MF/QImBo1x5+fnyfj4eLK4uBj6BwYGMvZo/tzcXBjDWMrV1VXDvXU+p+WhIwcBBOhpgRkbGwvPAiUusuz6+npGfw4Zv2e+1mUMoNC2FQBLP0SO37u7u+E39AQYDsBzHgAAhPUp9/f3ud/Qe+mN7WtE/7ZEAYlc3gHpB4SiIsorvMXhUqoPoGLF9fV1exnAoaT4tLK+rCMRtOK3v78f2unp6TAHGqMTCJ2dq7V4D4iTk5Oh2lKkAc8eBWIri9IcQKKF3wKKpS7hTu8pPK+srGRrbWxsZO+tK7FGEav4X+H3aVstaSb87tEMIAbjc/heXppbrVZr4rnSXJv+QmH1S6Di1Jh1rDbgCvTLJeJCf/yOeUVzmnIBCRcb1UE50Pz8fBaeRDUrTIxRgeYaY/vtHMKjzeP1LRsJVOQqsY9LKIt8/8kAIDYSLImM2LC5uZn5n01YFIpsri+/7uvrq0tyAEh3AAACbMZrTgxaf39/Xegr6v9rEZSwAACHZ0P0adMWnO3t7WzjsohYYGO01tOcmBGsf3Z2VgdaUZz/JwwQC6Cwwg1WRn1jS7JpDqqNDQ0N1TFA8VpzcDGxBssrgxPz7JzYvXBDaQtVgBbF/6bD4NHRUc1NzAoPWR4A7ezshD5Zzlpb11KyP/q5sDDHWl+XJcV4zYk1wDIrrzyGAU9OhCRiWMvGVytYsfpay2lTjOUmF98LOLwsayOIAKAyVtqiy48dQyR5KP43zQBtzvqdBKvoEmQB1Fzd3mxmGGdxjXL+Rv6ft7+WMkAfsP5lQ5ilsuK4rsDycaWtEjlZykYDXXdtHsK30RPWka7ENz0JpdyvpQxQLGbDsWDFOX5sbSuE2rRETmujB9b3bdEcGaARAx66NXoq3Gwq7H8WdwD+XwB+lPj8PwHgOK3fSnj4r2n9TB7wPa1v0ko0eF2Sw39J60fY/1uAAQDAo7S7+Gt3nAAAAABJRU5ErkJggg==
// @include        /https://redacted\.ch/(torrents\.php(\?|\?page=\d+&)id=\d+|upload\.php)/
// @include        /https://apollo\.rip/(torrents\.php(\?|\?page=\d+&)id=\d+|upload\.php)/
// @include        /https://notwhat\.cd/(torrents\.php(\?|\?page=\d+&)id=\d+|upload\.php)/
// @updated        20 Feb 2017
// @since          18 Jun 2010
// @downloadURL https://update.greasyfork.org/scripts/27542/Gazelle%20YAVAH.user.js
// @updateURL https://update.greasyfork.org/scripts/27542/Gazelle%20YAVAH.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var YA;//, update;

	/* U P D A T E HANDLE */
	/*update = {
		name: 'What.CD: YAVAH',
		version: 3200,
		key: 'ujs_WCD_YAVAH',
		callback: 'yavahupdater',
		page: 'https://dl.dropboxusercontent.com/u/14626536/userscripts/updt/yavah/yavah.user.js',
		urij: 'https://dl.dropboxusercontent.com/u/14626536/userscripts/updt/yavah/yavah.json',
		uric: 'https://dl.dropboxusercontent.com/u/14626536/userscripts/updt/yavah/yavah.js', // If you get "Failed to load source for:" in Firebug, allow no-ip.org to run scripts.
		checkchrome: true,
		interval: 10,
		day: (new Date()).getTime(),
		time: function () { return new Date(this.day + (1000 * 60 * 60 * 24 * this.interval)).getTime(); },
		css: function (t) {
			if (!this.style) { this.style = document.createElement('style'); this.style.type = 'text/css'; document.body.appendChild(this.style); }
			this.style.appendChild(document.createTextNode(t + '\n'));
		},
		js: function (t) {
			var j = document.createElement('script');
			j.type = 'text/javascript';
			j[/^https?\:\/\//i.test(t) ? 'src' : 'textContent'] = t;
			document.body.appendChild(j);
		},
		notification: function (j) {
			if (j) { if (this.version < j.version) { window.localStorage.setItem(this.key, JSON.stringify({date: this.time(), version: j.version})); } else { return true; } }
			var a = document.createElement('a');
			a.href = this.page;
			a.id = 'userscriptupdater';
			a.title = 'Update now.';
			a.textContent = 'An update for ' + this.name + ' is available.';
			document.body.appendChild(a);
			return true;
		},
		check: function (opt) {
			var stored = JSON.parse(window.localStorage.getItem(this.key)), J;
			if (opt || !stored || stored.date < this.day) {
				window.localStorage.setItem(this.key, JSON.stringify({date: this.time(), version: this.version}));
				if (!opt) { this.css(this.csstxt); }
				if (!opt && typeof (GM_xmlhttpRequest) === 'function' && !this.chrome()) {
					GM_xmlhttpRequest({method: 'GET', url: update.urij, onload: function (r) { update.notification(JSON.parse(r.responseText)); }, onerror: function () { update.check(1); }});
				} else {
					J = this.notification.toString().replace('function', 'function ' + this.callback).replace('this.version', this.version).replace('this.key', "'" + this.key + "'").replace('this.time()', this.time()).replace('this.page', '"' + this.page + '"').replace('this.name', 'j.name');
					this.js(J);
					this.js(this.uric);
				}
			} else if (this.version < stored.version) { this.css(this.csstxt); this.notification(); }
		},
		chrome: function () {
			if (this.checkchrome === true && typeof (chrome) === 'object') { return true; }
		},
		csstxt: '#userscriptupdater,#userscriptupdater:visited{-moz-box-shadow: 0 0 6px #787878;-webkit-box-shadow: 0 0 6px #787878;box-shadow: 0 0 6px #787878;border: 1px solid #777;-moz-border-radius:4px;border-radius:4px; cursor:pointer;color:#555;font-family: Arial;font-size: 11px;font-weight: bold; text-align: justify;min-height: 45px;padding: 12px 20px 10px 65px;position: fixed; right: 10px;top: 10px;width: 170px;background: #ebebeb url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAACLCAYAAAD4QWAuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1NUIzQjc3MTI4N0RFMDExOUM4QzlBNkE2NUU3NDJFNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGN0Q1OEQyNjdEQzUxMUUwQThCNEE3MTU1NDU1NzY2OSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGN0Q1OEQyNTdEQzUxMUUwQThCNEE3MTU1NDU1NzY2OSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NUIzQjc3MTI4N0RFMDExOUM4QzlBNkE2NUU3NDJFNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NUIzQjc3MTI4N0RFMDExOUM4QzlBNkE2NUU3NDJFNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po6YcvQAAAQFSURBVHja7JzBSxRRHMdnp+gkiLdOgtshKGSljQVF8CK0biEErYfwFmT+BQpdA0MIBEFtTx2qSxESaAt5ioUQFDp5sjl06rbnumzfp7+VbZx5M+/Nb9wZ+f3g56wzO28//ua93/u9J/stdDodx2/P3o85llaFT8JvwlvwTfhf00a2Hv8IPO86PHYHvg//An8OfwRfg/9RfzvTZ7DBvoZXQq6p6D7MCuwT+N2I92zAB/sNO0yPO8quwxf7DasABmK+d0XTVVKHnYIvG96z1i9Ymw8ep/R2obAqNdkm41e2sFct71v1/f4BiXyOJpRpHKZ918s9527B5+FvLwJWDaoR3zmvZ/bZw2HPNyMeBOTeb/BfaXaDEuVMvx2G3QDQMkW21wZsUpkp7GbIeU9zz3TI+WXTVGYCW6XRbApb1lxbTwt2VVMltS1hVWRnuWFVqhoNudbW9NchHIpc+ToO7GDE49JFtRij/ZG4gy0O7CIVIjZWNuhiw0lhK1SA6GzI8ppxKouCjTNaOWC7qWzKFrYaNw/SQOKwNVtYk4KjyAQ7RpnHCHaeCg7ugZQon7sBj3RYM62mHdmTVAaGxbiRNVmqRM3/bUvgDQCX/CcLvZsceEOF1v82dgPTrkdVVp2iXU8Q4e9ob0IHu59gUecxdwdlMwBunusGAJ1NuPr0KLoFdYQ3GGBXAiMLWC9gBRDX2gTa9g3Wp7Rbk8TqaPfjWWRp9I0kaLARVCbiXMO/xLGwdfCd7Oa4eDGQdD0fYYcJ7z/bzXHpxbWEDRaddO1FF3aSobE6pazAawztX0H7465mXWVqB2hwqWdwFeFfGaM+Wlh4V/rkMO2fpmy3VWTf5AD0NzLLkYsfn53T7fUs21k2UPmw5jBs9qZgx/AH4Ns+VxvQwJg0rGXTMPUfnhYgj0MLmayb6+TIBFZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBVZgBTZzVrg3U+Nsz1iTo7m7c+GRFU2ONGBFkyMNWNHkSANWNDl0xqbJAZ+j1/nR5HBOv6zm/8JaPjQ5KKqiyRFVpORfk8PRf3NZq8lRrd3PhiaHc6pvcLk0ORDdfGlyAFg0OdKAPUlliG76mhyGUNaDLXOaHIjuJdXkoKVKXzU5wlJZZjU5AFyKKhErFkuVbjcoUo3Apcmhnu6Ebkcmc5oczd2dZlA3YNHkUAFwUtLkcJlWnm1a1ng94AvkbKnM1SxVTKwRMphYNDkAPNiFFU0OZuPV5NDMYiyaHOgKvJoc8CVftFk1ORRsi/FxvYR3yH9qZjYba+VGkwOTw5GCzZcmByzTmhyI6ra/kNkiz4wmByD/0+T4J8AAyDkZArebBxMAAAAASUVORK5CYII=) no-repeat 13px 15px} #userscriptupdater:hover,#userscriptupdater:visited:hover { border-color: #8f8d96; color:#55698c;background-position: 13px -85px }'
	};
	update.check();*/

	// http://jsperf.com/mega-trim-test
	if (!String.prototype.trim) { String.prototype.trim = function () { return this.match(/\S+(?:\s+\S+)*/)[0] || ''; }; }
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (self) {
			var args = [].slice.call(arguments, 1), fn = this;
			return function () {
				return fn.apply(self, args.concat([].slice.call(arguments)));
			};
		};
	}

	YA = {
		types: [
			'Main',
			'Guest',
			'Remixer',
			'Composer',
			'Conductor',
			'DJ / Compiler',
			'Producer'
		],
		VAH: function () {
			if (!this.sibling) { return false; }

			this.stored = this.inputs.innerHTML;
			this.de.initEvent('click', true, true);
			this.boxSetup();

			update.css('#YAVAH p a { display:block } .yavahtext{max-width: 90%; height: 50px;}');
		},
		clk: function () {
			var t = this.box.getElementsByTagName('textarea'), i = 0;

			this.inputs.innerHTML = this.stored; // Reset
			this.first = true;

			for (i; i < t.length; i++) {
				this.fill(t[i], i + 1);
			}
		},
		tap: function (el) {
			if (el.click) { el.click(); } else { el.dispatchEvent(this.de); }
		},
		fill: function (textarea, value) {
			var lines = textarea.value.match(/[^\r\n]+/g) || '', i = 0, j = lines.length;
			for (i; i < j; i++) {
				if (lines[i].length > 0) {
					if (!this.first) { this.tap(this.a); }
					this.inputs.querySelector(this.selector).value = lines[i].trim();
					this.inputs.querySelector('select:last-of-type').value = value;
					this.first = false;
				}
			}
		},
		boxSetup: function () {
			this.box.className = 'box';
			this.box.id = 'YAVAH';
			this.box.innerHTML = '<div class="head"><strong><abbr title="Yet Another Various Artists Helper">YAVAH</abbr></strong></div>';
			this.box.appendChild(this.menu());
			this.sibling.parentNode.insertBefore(this.box, this.sibling);
		},
		menu: function () {
			var m = document.createElement('div'),
				b = document.createElement('input');

			m.setAttribute('style', 'padding: 3px 6px 6px');
			m.innerHTML = this.generateBoxes();
			m.querySelector('textarea').className = 'noWhutBB yavahtext';

			b.value = 'Go!';
			b.type = 'button';
			b.addEventListener('click', this.clk.bind(this), false);
			m.appendChild(b);
			return m;
		},
		generateBoxes: function () {
			var i = 0,
				t = ['<p>Enter artists, one per line. (Toggle.)</p>'];

			for (i; i < this.types.length; i++) {
				t.push('<p onclick="$(this).nextElementSibling().toggleClass(\'hidden\')"><a href="#" onclick="return false;">'
					+ this.types[i] + '</a></p><textarea class="noWhutBB yavahtext hidden"></textarea>');
			}

			t.push('<p>Review the changes below.</p>');
			return t.join('');
		},
		first: false,
		selector: 'input[name="aliasname[]"]:last-of-type, input[name="artists[]"]:last-of-type',
		de: document.createEvent('HTMLEvents'),
		sibling: document.querySelector('.box_addartists, #dynamic_form'),
		a: document.querySelector('.box_addartists a, #artistfields a.brackets'),
		inputs: document.querySelector('#AddArtists, #artistfields'),
		box: document.createElement('div')
	};
	YA.VAH();
}());