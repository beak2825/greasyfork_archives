// ==UserScript==
// @name		Universal Dark Theme Maker
// @namespace	uni_dark_theme
// @version		1.41
// @description	Simple Dark Theme style for any website which you can configure per-site
// @supportURL	https://github.com/Owyn/Universal_Dark_Theme/issues
// @homepage	https://github.com/Owyn/Universal_Dark_Theme
// @icon		https://images2.imgbox.com/b3/67/Aq5XazuW_o.png
// @author		Owyn
// @match		*://*/*
// @grant		GM.getValue
// @grant		GM.setValue
// @grant		GM_addElement
// @grant		GM_registerMenuCommand
// @grant		unsafeWindow
// @sandbox		JavaScript
// @compatible	Chrome
// @compatible	Firefox
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/397256/Universal%20Dark%20Theme%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/397256/Universal%20Dark%20Theme%20Maker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var el;
	var css;
	var cfg_color = "#c0c0c0";
	var cfg_bgclr = "#2e2e2e";
	var cfg_visclr = "#a4a4a4";
	var cfg_bgimg;
	var cfg_bgtrans;
	var cfg_excl;
	var cfg_css;
	var cfg_js;
	var cfg_match_pseudo;
	var cfg_active;
	switch(localStorage.getItem('active'))
	{
		case "true": // back-compatibility
		case "1":
			cfg_active = true;
			load_settings(); // start loading asap
			break;
		default:
			cfg_active = false;
			break;
	}
	async function load_settings()
	{
		cfg_excl = localStorage.getItem('excl') || "";
		cfg_css = localStorage.getItem('css') || "";
		cfg_js = localStorage.getItem('js') || "";
		cfg_bgimg = (localStorage.getItem('bgimg') === '1');
		cfg_bgtrans = (localStorage.getItem('bgtrans') === '1');
		cfg_match_pseudo = (localStorage.getItem('match_pseudo') === '1');
		let done;
		console.debug("UDT: GM settings started loading")
		if (typeof GM !== "undefined" && typeof GM.getValue === "function")
		{
			done = Promise.all([
				GM.getValue("Color", "#c0c0c0").then( function(result) { cfg_color = result; } , console.error),
				GM.getValue("bgColor", "#2e2e2e").then( function(result) { cfg_bgclr = result; } , console.error),
				GM.getValue("visitedColor", "#a4a4a4").then( function(result) { cfg_visclr = result; } , console.error)
			]).then(
				function() { console.debug("UDT: GM settings loaded"); updateHTMLColorVars(); observer.observe(document.documentElement, {attributeFilter: ["style"]}); },
				function(error) { console.error("UDT: GM settings NOT loaded: " + error); }
				);
		}
		return done
    }

	var observer = new MutationObserver((mutations) => {
		for (const m of mutations)
		{
			if(cfg_active && m.target.style.getPropertyValue('--cfg_visclr') === "")
			{
				updateHTMLColorVars();
				console.debug("UDT: color vars lost, reAdding...");
			}
		}
	});

	function updateHTMLColorVars()
	{
		document.documentElement.style.setProperty('--cfg_color', cfg_color);
		document.documentElement.style.setProperty('--cfg_bgclr', cfg_bgclr);
		document.documentElement.style.setProperty('--cfg_visclr', cfg_visclr);
	}

	function activate(yes, prev_active)
	{
		if(prev_active && el){console.debug("UDT: Removing dark style..."); el.remove();}
		if(yes)
		{
			make_css();
			console.debug("UDT: adding dark style...");
			el = GM_addElement(document.documentElement, 'style', {textContent: css});
			console.debug(el);
			if(cfg_js){eval(cfg_js);}
		}
	}
	function toggleDT()
	{
		cfg_active = !cfg_active;
		activate(cfg_active, !cfg_active);
		if(!cfg_active)
		{
			localStorage.removeItem('active');
		}
		else
		{
			localStorage.setItem('active', "1");
			updateHTMLColorVars();
		}
	}

	function make_css()
	{
		let exclusions;
		let exc_txt = ""
		if(cfg_excl !== "")
		{
			exclusions = cfg_excl.split(",");
			for (var i = 0, len = exclusions.length; i < len; i++)
			{
				exc_txt += ":not("+exclusions[i]+")";
			}
		}
		let bgimg_txt = cfg_bgimg ? "-color" : "";
        let match_pseudo = cfg_match_pseudo ? (",*"+exc_txt+"::before,*"+exc_txt+"::after") : "";
		////////////// Main thing, the style!:
		css = (cfg_excl !== "*" ?(cfg_bgtrans ?`
		:root`+exc_txt+` {
			color: var(--cfg_color) !important;
			background`+bgimg_txt+`: var(--cfg_bgclr) !important;
			border-color: var(--cfg_color) !important;
            scrollbar-color: var(--cfg_visclr) var(--cfg_bgclr) !important;
			color-scheme: dark;
		}
		:root `:``)+`*`+exc_txt+match_pseudo+` {
			color: `+(cfg_bgtrans ? `unset` : `var(--cfg_color)`)+` !important;
			background`+bgimg_txt+`: `+(cfg_bgtrans ? `unset` : `var(--cfg_bgclr)`)+` !important;
			border-color: var(--cfg_color) !important;
            scrollbar-color: var(--cfg_visclr) var(--cfg_bgclr) !important;
			color-scheme: dark;
		}
		:visited`+exc_txt+`, a:hover`+exc_txt+` {
			color: var(--cfg_visclr) !important;
		}
		input:focus`+exc_txt+`,textarea:focus`+exc_txt+`,select:focus`+exc_txt+`{
			outline: 1px solid var(--cfg_visclr) !important;
		}
		`:"")+cfg_css;
		//////////////
	}

	if(cfg_active)
	{
		console.debug("UDT: Adding dark style...");
		make_css();
		el = GM_addElement(document.documentElement, 'style', {textContent: css});
		console.debug(unsafeWindow);
        console.debug(el);
		updateHTMLColorVars(); // placeholder colors while GM settings are still loading
		window.addEventListener("DOMContentLoaded", function(){
			if (document.documentElement.lastElementChild !== el && el.parentNode === document.documentElement) // very fast browser
			{
				while (document.documentElement.lastElementChild !== el)
				{
					document.documentElement.prepend(document.documentElement.lastElementChild);
				}
				console.debug("UDT: moved dark style to the bottom"); // actually not, cuz security restrictions
			}
			if (cfg_js)
			{
				eval(cfg_js); // execute custom JS when the page fully loads
			}
			});
	}

	if (typeof GM_registerMenuCommand !== "undefined")
	{
		GM_registerMenuCommand("Dark Theme Configuration", ((typeof GM_addElement === "function") ? () => load_settings().then(cfg, console.error) : tell_users_they_are_wrong), "D");
		GM_registerMenuCommand("Toggle Dark Theme", ((typeof GM_addElement === "function") ? () => load_settings().then(toggleDT, console.error) : tell_users_they_are_wrong), "T");
	}
	else
	{
		tell_users_they_are_wrong();
	}

	function tell_users_they_are_wrong()
	{
		let txt = "Sorry, your userscript manager is missing functionality needed for Universal Dark Theme script to work! Install TamperMonkey userscript-manager extension (the №1 most popular userscript-manager extension - how did you miss it?...)"
		console.error(txt);
		alert(txt);
	}

	var t;
	var div;
	function cfg()
	{
		console.debug("UDT: config window open");
		function saveCfg()
		{
			if (typeof GM !== "undefined" && typeof GM.setValue === "function")
			{
				GM.setValue("Color", id("color").value);
				GM.setValue("bgColor", id("bgclr").value);
				GM.setValue("visitedColor", id("visitedColor").value);
			}
			localStorage.setItem('excl', id("excl").value);
			localStorage.setItem('css', id("css").value);
			localStorage.setItem('js', id("js").value);
			localStorage.setItem('active', id("active").checked ? "1" : "0");
			localStorage.setItem('match_pseudo', id("match_pseudo").checked ? "1" : "0");
			localStorage.setItem('bgimg', id("bgimg").checked ? "1" : "0");
			localStorage.setItem('bgtrans', id("bgtrans").checked ? "1" : "0");
			// pretty text "saved"
			id("cfg_save").value = "SAVED OK";
			clearTimeout(t);
			t = setTimeout(function() {id("cfg_save").value = "Save config";},1500)
			// update active configuration
			cfg_color = id("color").value;
			cfg_bgclr = id("bgclr").value;
			cfg_bgimg = id("bgimg").checked;
			cfg_bgtrans = id("bgtrans").checked;
			cfg_match_pseudo = id("match_pseudo").checked;
			cfg_visclr = id("visitedColor").value;
			cfg_excl = id("excl").value;
			cfg_css = id("css").value;
			cfg_js = id("js").value;
			activate(id("active").checked, cfg_active );
			cfg_active = id("active").checked;
			//
			updateHTMLColorVars();
			// clean up
			if(!id("active").checked) { localStorage.removeItem('active'); }
			if(!id("match_pseudo").checked) { localStorage.removeItem('match_pseudo'); }
			if(!id("bgimg").checked) { localStorage.removeItem('bgimg'); }
			if(!id("bgtrans").checked) { localStorage.removeItem('bgtrans'); }
			if(!id("excl").value) { localStorage.removeItem('excl'); }
			if(!id("css").value) { localStorage.removeItem('css'); }
			if(!id("js").value) { localStorage.removeItem('js'); }
		}
		if(div)
		{
			if(!div.isConnected) document.body.appendChild(div); // it was there but got closed
			return; // div already built
		}
		div = document.createElement("div");
		div.style = "all: initial !important; margin: auto !important; width: fit-content !important; height: fit-content !important; border: 1px solid var(--cfg_color) !important; background: var(--cfg_bgclr) !important; position: fixed !important; inset: 0 !important; z-index: 2147483647 !important; line-height: 1 !important;"; // all:initial to disable CSS inheritance
		div.attachShadow({mode: 'open'}); // outer CSS selectors won't affect it now (but we will still inherit styles) // we could use an iframe but extensions might block it? <iframe src='data:text/html,<strong>Hello World!</strong>'></iframe>
		const id = div.shadowRoot.getElementById.bind(div.shadowRoot);
		let shadowStyle = `* {
			color-scheme: dark;
			color: var(--cfg_color);
			background: var(--cfg_bgclr);
			border-color: var(--cfg_color);
			padding: initial; margin: initial;
		}
		:visited, a:hover { color: var(--cfg_visclr); }
		input:focus,textarea:focus,select:focus { outline: 2px solid var(--cfg_visclr); }
		tr,td { padding:1px; }
		input { padding:0px 3px; }
		input[type='checkbox'] { padding: 0px; }
		div { margin: auto; display: table; }
		div > input { margin:2px; width: 6em; }
		textarea { margin: 0px; min-width: 400px; min-height: 1em; height: 50px; resize:both; }`;
		div.shadowRoot.innerHTML = `<b><br><center>Configuration</center></b>
		<div>
		<br><input id='color' type='text'> Text color (empty = site default)
		<br><input id='bgclr' type='text'> Background color
		<br><input id='visitedColor' type='text'>&nbsp;<a href='' onclick='return false;'>Visited & hovered link color</a>
		<br><br></div><center><b>Per-site settings (stored in browser cookies called LocalStorage):</b>
		<table><tr><td><input id='active' type='checkbox'> Enabled for this website
		</td><td><input id='match_pseudo' type='checkbox'> Also color pseudo-elements
		</td></tr><br><br><tr><td><input id='bgimg' type='checkbox'> Keep background-images
		</td><td><input id='bgtrans' type='checkbox'> Make background transparent </td></tr></table>
		<br>Excluded css elements (e.g. \"#id1,.class2,input\"):<br><textarea id='excl'></textarea>
		<br><br>Custom CSS style:<br><textarea id='css'></textarea>
		<br><br>Custom JS Action:<br><textarea id='js'></textarea>
		<br><input id='cfg_save' type='button' value='Save config'> <input id='cfg_close' type='button' value='Close'></center>`;
		document.body.appendChild(div);
		GM_addElement(div.shadowRoot, 'style', {textContent: shadowStyle}); // damn CSP gets us even in our own shadow...
		id("color").value = cfg_color;
		id("bgclr").value = cfg_bgclr;
		id("bgimg").checked = cfg_bgimg;
		id("bgtrans").checked = cfg_bgtrans;
		id("visitedColor").value = cfg_visclr;
		//
		id("active").checked = cfg_active;
		id("match_pseudo").checked = cfg_match_pseudo;
		id("excl").value = cfg_excl;
		id("css").value = cfg_css;
		id("js").value = cfg_js;
		id("cfg_save").addEventListener("click", saveCfg, true);
		id("cfg_close").addEventListener("click", () => div.remove(), true);
	}

})();
