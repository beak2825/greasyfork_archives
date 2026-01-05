// ==UserScript==
// @name        Mark owned ScummVM/ResidualVM Games
// @namespace   ssokolow.com
// @description A simple aid for collecting ScummVM and ResidualVM-supported games
// @license MIT
// @version     6
//
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
//
// @match       *://scummvm.org/compatibility
// @match       *://scummvm.org/compatibility/*
// @match       *://residualvm.org/compatibility
// @match       *://residualvm.org/compatibility/*
// @match       *://www.scummvm.org/compatibility
// @match       *://www.scummvm.org/compatibility/*
// @match       *://www.residualvm.org/compatibility
// @match       *://www.residualvm.org/compatibility/*
//
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_deleteValue
// @grant       GM.deleteValue
// @grant       GM_listValues
// @grant       GM.listValues
// @downloadURL https://update.greasyfork.org/scripts/14251/Mark%20owned%20ScummVMResidualVM%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/14251/Mark%20owned%20ScummVMResidualVM%20Games.meta.js
// ==/UserScript==

const OWNED_OPACITY = 0.3;
var hide_owned;
var owned_games;

/// Code shared between initial setup and the click handler
var mark_owned = function(node, state) {
    let row = node.closest('tr');
    if (state) {
        row.style.opacity = OWNED_OPACITY;
      	row.classList.add('owned');
    } else {
      	row.style.opacity = 1.0;
        row.classList.remove('owned');
    }
};

// TODO: Finish factoring out jQuery
/// click() handler for the per-game toggle button
var toggleOwnership = function(e) {
    e.preventDefault();
    let game_id = this.dataset.gameId;

    // Toggle based on what's displayed so that it will always act as the
    // user expects, regardless of changes since last reload
    if (this.textContent == '+') {
        this.textContent = '-';
        mark_owned(this, true);
        GM.setValue(game_id, true);
    } else {
        this.textContent = '+';
        mark_owned(this, false);
        GM.deleteValue(game_id);
    }
};

/// click() handler for the whole-table hide/show button
var toggleVisible = function(e) {
    document.querySelectorAll('tr.owned').forEach(function(node) {
      node.style.display = hide_owned ? '' : 'none';
    });
    this.textContent = hide_owned ? '-' : '+';
    GM.setValue('__HIDE_OWNED', hide_owned = !hide_owned);
};

/// Shared code to generate a toggle button
var makeButton = function(initial_state, label) {
  	let button = document.createElement("div");
  	button.setAttribute('class', 'toggle_btn');
  	button.setAttribute('title', label);
  	button.textContent = initial_state ? '+' : '-'
  	button.style.cssText = "" +
      "background: #c0c0c0; " +
  		"border-radius: 3px; " +
  		"color: black; " +
      "display: inline-block; " +
    	"margin-right: 5px; " +
    	"padding: 0 2px; " +
      "text-align: center; " +
      "width: 1em; " +
      "cursor: pointer";
  	return button;
};

(async function() {
  	let state = await Promise.all([
    		GM.getValue('__HIDE_OWNED', false),
      	GM.listValues()
    ]);
    hide_owned = state[0];
    owned_games = state[1];

    // Per-entry code
    document.querySelectorAll('table.chart a').forEach(function(node) {
      	console.log(node);
        // Extract the game ID for use in record-keeping
      	let site_id = location.hostname.split('.');
      	site_id = site_id[site_id.length - 2]; // "scummvm" or "residualvm"
      
        let url = node.getAttribute('href').split('/');
        let game_id = url[url.length-1] ? url[url.length-1] : url[url.length-2];
      	game_id = site_id + "_" + game_id;

        // Craft a button to toggle ownership status
        let togglebutton = makeButton(owned_games.indexOf(game_id) == -1,
                                        "Toggle Owned")
      	togglebutton.addEventListener("click", toggleOwnership);
				togglebutton.dataset.gameId = game_id;
        node.closest('td').prepend(togglebutton);

        // TODO: Profile alternatives like an x|y|z regexp or a popping iteration
        if (owned_games.indexOf(game_id) !== -1){ mark_owned(node, true); }
    });

    // Global toggle-button code
    let g_button = makeButton(hide_owned, "Show/Hide Owned Games")
    g_button.id = 'gm_visible_toggle';
  	g_button.style.position = 'relative';
  	g_button.style.marginRight = '-100%';
  	g_button.style.top = '14px';
  	g_button.style.left = '0';
    g_button.addEventListener("click", toggleVisible);
  	
  	let container = document.querySelector("#content .content");
    if (!container) {
      container = document.querySelector("section.intro ~ section.content");
    }
		container.prepend(g_button);


    if (hide_owned) { 
      document.querySelectorAll('tr.owned').forEach(function(node) {
        node.style.display = 'none';
      });
    }

    // Hover-style the buttons and add a better print stylesheet to 
    // make "thrifting TODO" printouts easier
    let style_elem = document.createElement("style");
    style_elem.textContent = "td > .toggle_btn { visibility: hidden; }\n\n" +
        "td:hover > .toggle_btn { visibility: visible; }\n\n" +
      	"@media print { " +
	        "section.box section.content, #content, .rbwrapper > .box > .content { " +
	        	"position: absolute !important; " +
	        	"top: 0 !important; " +
	        	"left: 0 !important; " +
	        	"right: 0 !important; " +
	        	"z-index: 9999 !important; " +
	        	"margin: 0 !important; " +
	        	"padding: 0 !important; " +
	        	"background: white !important; " +
        	"} " +
        	"table.chart, #container { width: 100% !important; } " +
        	"#header, #menu, #footer, .intro, .cookie-consent, .toggle_btn { " +
      			"display: none !important; " +
					"} " +
        	"html, body, #container { background: white !important; } " + 
    		"}";
   	document.head.appendChild(style_elem);
})();