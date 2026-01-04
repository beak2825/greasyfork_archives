// ==UserScript==
// @name         Daz Interactive License Display
// @description  Displays all interactive licenses purchased. View & Seach at your Account page.
// @license      AGPL-3.0-or-later
// @version      1.1
// @author       Threed Resident
// @namespace    http://tampermonkey.net/
// @match        https://www.daz3d.com/customer/account
// @match        https://www.daz3d.com/customer/account/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454437/Daz%20Interactive%20License%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/454437/Daz%20Interactive%20License%20Display.meta.js
// ==/UserScript==


(function() {
	'use strict';

	/****************************************************/
	// GLOBALS
	/****************************************************/

	let owned = [];
	let licensed_interactive = [];
	let licensed_3dprint = [];

	let debug = false;

	//---------------------------------------------------
	// Output

	let OUTPUT = [];
	let ERRORS = [];

	/****************************************************/
	// Utility
	/****************************************************/

	function html_to_node(code){
		let tempWrapper = document.createElement("div");
		tempWrapper.innerHTML = code;
		if (tempWrapper.childElementCount == 1) tempWrapper = tempWrapper.firstChild;
		return tempWrapper;
	}

	function copyLinksToClip() {
		GM_setClipboard(OUTPUT.join("\n"), "text");
		display_msg(`COPIED ${OUTPUT.length} links`, "successCustMsg");
	}

	function copy_data(){
		owned = JSON.parse(window.localStorage.getItem("Catalog/owned")).owned;
		let licenses = JSON.parse(window.localStorage.getItem("License/owned")).licensed;
		licensed_interactive = licenses.interactive;
		licensed_3dprint = licenses["3dprinting"];
		console.log("Interactive License length is: " + licensed_interactive.length)
		console.log("Purchase data loaded.");
	}

	/****************************************************/
	// RUN
	/****************************************************/

	function searchFunction() {
		// Declare variables
		var input, filter, ul, li, a, i, txtValue;
		input = document.getElementById('licenseSearchInput');
		filter = input.value.toUpperCase();
		ul = document.getElementById("daz-list-licensed");
		li = ul.getElementsByClassName('xdd-list-item');

		// Loop through all list items, and hide those who don't match the search query
		for (i = 0; i < li.length; i++) {
			a = li[i].getElementsByTagName("a")[0];
			txtValue = a.textContent || a.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	};

	function run() {
		copyLinksToClip();
	}

	/****************************************************/
	// START
	/****************************************************/

	init();

	/****************************************************/
	// INITIALIZE
	/****************************************************/

	function init(){
		copy_data();
		add_html();};

	function add_html(){

		console.log(window.location.href);
		if (window.location.href == "https://www.daz3d.com/customer/account" || window.location.href == "https://www.daz3d.com/customer/account/"){
			add_html_licenses_interactive();
		}

		if ( debug ){
			add_html_copy_data_button();
		}}

	function add_html_licenses_interactive(){
		//
		// Add place for licensed items
		let product_api_cache = {};

		console.log("About to insert list of owned");

		let styleHtml_licenses_interactive =
			`<div class="account_content licenses_interactive">
				<h3 class="poppins-bold">Interactive Licenses</h3>
				<div>
					<form style="width:100%">
						<input type="text" id="licenseSearchInput" placeholder="Search for license names..." style="width:100%">
					</form>
					<div style="padding: 1.5rem;">
						<ul class="daz-list-licensed" id="daz-list-licensed" style="height: 600px; overflow: scroll; margin-bottom: 0px;"></ul>
					</div>
				</div>
			</div>`;
		document.querySelector(`.dashboard`).append(html_to_node(styleHtml_licenses_interactive));

		var myDiv = document.querySelector ("#licenseSearchInput");
		if (myDiv) {
			console.log ("UL found");
			myDiv.addEventListener ("keyup", searchFunction , false);
		}

		let fetch_list_from_api = async (prod_id_many) => {
			var prod_id = "";
			console.log("prod_id_many length is: " + prod_id_many.length)
			for (var id in prod_id_many) {
				prod_id = String(prod_id_many[id]);
				let response = await fetch("/dazApi/slab/" + prod_id);
				let data = await response.json();
				if ( data.name ){
					//console.log(data.name);
					styleHtml_licenses_interactive = `<li class="xdd-list-item"><img style="width:40px;" src="data:image/jpg;base64,` + data.image + `"/><a href="` + data.url+`" target="_blank">` + data.name + `</a></li>`;
					document.querySelector(`.daz-list-licensed`).append(html_to_node(styleHtml_licenses_interactive));
				} else {
					console.log("no name, drop id: " + prod_id);
				};
			};
		};
		fetch_list_from_api(licensed_interactive);};

	function add_html_copy_data_button(){
		let styleHtml =
			`<style id="generalStyle">
				#sideBtn {position: fixed; bottom: 0px; right: 0px; display: block; font-size: 1.2rem; padding: 5px; background: green; border: 3px solid red; cursor: pointer; z-index: 99999999;}
				#custMsg {position: fixed; top:0; left: 50%; font-size:1rem; padding:10px; width:max-content; z-index: 99999999;}
				.genericCustMsg {background:blue; color:white;}
				.successCustMsg {background:green; color:white;}
				.errorCustMsg {background:red; color:white;}
			</style>`;
		document.querySelector(`html`).appendChild(html_to_node(styleHtml));

		let buttonsHtml = `<button id="sideBtn">Links</button>`;
		document.querySelector(`html`).appendChild(html_to_node(buttonsHtml));

		document.querySelector("#sideBtn").addEventListener("click", run);};
})();