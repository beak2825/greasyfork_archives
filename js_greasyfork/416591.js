// ==UserScript==
// @name               TW Auto
// @version            0.01
// @license            LGPLv3
// @description        Automation for The West
// @author             hiroaki
// @match              https://*.the-west.com.br/game.php*
// @match              https://*.the-west.com.pt/game.php*
// @match              https://*.the-west.cz/game.php*
// @match              https://*.the-west.de/game.php*
// @match              https://*.the-west.dk/game.php*
// @match              https://*.the-west.es/game.php*
// @match              https://*.the-west.fr/game.php*
// @match              https://*.the-west.gr/game.php*
// @match              https://*.the-west.hu/game.php*
// @match              https://*.the-west.it/game.php*
// @match              https://*.the-west.net/game.php*
// @match              https://*.the-west.nl/game.php*
// @match              https://*.the-west.org/game.php*
// @match              https://*.the-west.pl/game.php*
// @match              https://*.the-west.ro/game.php*
// @match              https://*.the-west.ru/game.php*
// @match              https://*.the-west.se/game.php*
// @match              https://*.the-west.sk/game.php*
// @grant              none
// @namespace https://greasyfork.org/users/3197
// @downloadURL https://update.greasyfork.org/scripts/416591/TW%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/416591/TW%20Auto.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	MouseSaver = {
		el: null,
		tm: null,
		my_img: null,
		my_div: null,
		my_fun: function() {
			var d = new Date();
			var stamp = d.getTime();
			var that = this;
			$(".xxx").remove();
			this.el = $(".job_durationbar_short .job_action_short");
			this.el.after('<div class="xxx" id="x_'+stamp+'" style="width: 60px; margin-top: 220px;"><img class="iii" id="i_'+stamp+'" src="https://westgr.innogamescdn.com/images/map/icons/instantwork.png"><br /><span id="y_'+stamp+'"></span></div>');
			this.my_div = $("#x_"+stamp);
			this.my_img = $("#i_"+stamp);
			my_click = function(el) {
				if(that.tm) clearTimeout(that.tm);
				var maxq = Premium.hasBonus('automation') ? 9 : 4;
				if(Character.energy > 0) {
					var rnd = Math.max(2000, Math.floor(1000 * Math.random() * TaskQueue.timeleft));
					if(TaskQueue.queue.length < maxq) that.el.click();
					that.tm = setTimeout(function() { console.log('ok '+rnd); my_click(that.el); }, rnd);
				}
				return false;
			}
			this.my_img.click(function(ev) {
				my_click(that.el);
				that.my_img.hide();
				that.my_div.remove();
			});
		},
		script: {
			listeningSignal: 'game_config_loaded',
			loaded: false,
			init: function() {
				var that = this;
				if(this.loaded) return false;
				EventHandler.listen('game_config_loaded', function() {
					that.init();
					return EventHandler.ONE_TIME_EVENT;
				});
				if(!!(Game && Game.loaded)) {
					this.loaded = true;
					$("#map").on('click', function(){
						setTimeout(MouseSaver.my_fun, 100);
						return false;
					});
				}
			},
		},
	};
	$(function() { try { MouseSaver.script.init(); } catch(x) { console.trace(x); } });
});