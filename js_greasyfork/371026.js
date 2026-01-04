// ==UserScript==
// @name         FRHD Replay Key Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fafa
// @author       You
// @match        https://www.freeriderhd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371026/FRHD%20Replay%20Key%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/371026/FRHD%20Replay%20Key%20Viewer.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var add_html='<div id="replay-kb-box" style="left:0px;bottom:0px;position:absolute;text-align:center;font-weight:bold;font-family:Segoe UI;font-size:24px"><div id="replay-kb-z" style="left:5px;bottom:5px;width:40px;height:40px;line-height:40px;position:absolute;background-color:white;border:1px solid black">Z</div><div id="replay-kb-left" style="left:55px;bottom:5px;width:40px;height:40px;line-height:36px;position:absolute;background-color:white;border:1px solid black">←</div><div id="replay-kb-down" style="left:100px;bottom:5px;width:40px;height:40px;line-height:36px;position:absolute;background-color:white;border:1px solid black">↓</div><div id="replay-kb-right" style="left:145px;bottom:5px;width:40px;height:40px;line-height:36px;position:absolute;background-color:white;border:1px solid black">→</div><div id="replay-kb-up" style="left:100px;bottom:50px;width:40px;height:40px;line-height:36px;position:absolute;background-color:white;border:1px solid black">↑</div><div id="replay-kb-enter" style="left:55px;bottom:95px;width:130px;height:40px;line-height:40px;position:absolute;background-color:white;border:1px solid black">Enter</div><div id="replay-kb-backspace" style="left:55px;bottom:140px;width:130px;height:40px;line-height:40px;position:absolute;background-color:white;border:1px solid black">Backspace</div></div>';
	var keys=['z','up','down','left','right','enter','backspace']
	setInterval(function(){
		var rs=GameManager.game.currentScene.races;
		if(rs.length==0)return;
		if(typeof($('#replay-kb-box')[0])=='undefined'){
			$(add_html).insertBefore($('.gameGui'));
		}
		var code=GameManager.game.currentScene.races[0].race.code;
		var tick=GameManager.game.currentScene.ticks;
		for(var i=0;i<keys.length;i++){
			var down=code[keys[i]+'_down'],up=code[keys[i]+'_up'],lst_down=-1,lst_up=-1,col;
			if(typeof(down)!='undefined'){
				for(var j in down)if(j<=tick)lst_down=j;
			}
			if(typeof(down)!='undefined'){
				for(var j in up)if(j<=tick)lst_up=j;
			}
			if(lst_down>lst_up){
				col='#ccf';
			}else{
				col='#fff';
			}
			$('#replay-kb-'+keys[i]).css('background-color',col);
		}
	},1);
})();