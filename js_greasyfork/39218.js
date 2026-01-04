// ==UserScript==
// @name         Kittens Game Automation
// @namespace    https://github.com/Alistair1231/Kittens-Game-automation-and-tools
// @version      1.0.3
// @description  Auto craft resources when full, auto pray, auto hunt, auto trade, fast autosave, simple save export/import, ...
// @author       Alistair1231
// @match        http*://bloodrizer.ru/games/kittens/*
// @grant        none
// @license GPL-3.0
// @copyright 2018, Alistair1231 (https://openuserjs.org/users/Alistair1231)
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/39218/Kittens%20Game%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/39218/Kittens%20Game%20Automation.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author Alistair1231
// ==/OpenUserJS==

var script='<script src="https://cdn.jsdelivr.net/gh/Alistair1231/Kittens-Game-automation-and-tools/kittens.js"></script>';
var script2='<script>let bot = new kittenBot();'+
	'bot.init();'+
	'bot.export();</script>';
var ln1="<style>"+
			".tableBox {"+
			"display: block !important;}"+
		"</style>"+
		"<br>"+
		"<form id='tableBot'>"+
			"<table>"+
	    	"<tr>"+
		    	"<td>"+
	    			"<input type='checkbox' class='tableBox' name='1' value='1' checked>1</input>"+
		    	"</td>"+
		    	"<td>"+
					"<input type='checkbox' class='tableBox'  name='pray' value='pray' checked>Pray</input>"+
		    	"</td>"+
		    	"<td>"+
					"<a href='#' onclick='bot.run()'>Run</a>"+
		    	"</td>"+
	    	"</tr>"+
	    	"<tr>"+
	    		"<td>"+
	    			"<input type='checkbox' class='tableBox'  name='2' value='2' checked>2</input>"+
	    		"</td>"+
		    	"<td>"+
					"<input type='checkbox' class='tableBox'  name='hunt' value='hunt' checked>Hunt</input>"+
		    	"</td>"+
		    	"<td>"+
					"<a href='#' onclick='bot.stop()'>Stop</a>"+
		    	"</td>"+
	    	"</tr>"+
	    	"<tr>"+
	    		"<td>"+
	    			"<input type='checkbox' class='tableBox' name='3' value='3'>3</input>"+
	    		"</td>"+
		    	"<td>"+
					"<input type='checkbox' class='tableBox' name='craft' value='craft' checked>Craft</input>"+
		    	"</td>"+
		    	"<td>"+
					"<a href='#' onclick='bot.export()'>Export</a>"+
		    	"</td>"+
	    	"</tr>"+
	    	"<tr>"+
	    		"<td>"+
	    			"<input type='checkbox' class='tableBox' name='4' value='4'>4</input>"+
	    		"</td>"+
		    	"<td>"+
					"<input type='checkbox' class='tableBox' name='trade' value='trade'>Trade</input>"+
		    	"</td>"+
		    	"<td>"+
					"<a href='#' onclick='bot.import()'>Import</a>"+
		    	"</td>"+
	    	"</tr>"+
	    	"</table>"+
	    "</form>";

$(script).insertBefore("div[id*='gamePageContainer']");
setTimeout(function(){
	$(script2).insertBefore("a[onclick*='gamePage.ui.hideChat();']");
	},2000);
$(ln1).insertBefore("a[onclick*='gamePage.ui.hideChat();']");
