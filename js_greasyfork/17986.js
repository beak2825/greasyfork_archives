// ==UserScript==
// @name         ebay Country Filter
// @namespace    https://greasyfork.org/
// @version      0.4.33
// @description  Attempts to clear up unwanted items in your ebay search results
// @author       Schabernack
// @match        http://www.ebay.com/sch/*
// @match        https://www.ebay.com/sch/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/17986/ebay%20Country%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/17986/ebay%20Country%20Filter.meta.js
// ==/UserScript==
/*
ebay Country Filter
 
Attempts to clear up unwanted items in your ebay search results
by hiding items being sold from certain countries

A work in progress
*/
(function() {
	//print various debugging info, slightly more convienient than using the console sometimes
	var DEBUGON = false;

	var totalHidden = 0;

	var countriesList = JSON.parse(localStorage.getItem("ecfCountriesList"));

	//localstorage ecfEnabled is a STRING. Need to convert it to a boolean
	var enabled = localStorage.getItem("ecfEnabled") === "true";

	if (DEBUGON) {
		console.log("\ninitial storage values");
		console.log("ecfEnabled: ", enabled);
		console.log("ecfCountriesList:", countriesList);
	}

	//if getItem returns null then this is the first time the script it being used
	if (countriesList === null) {
		countriesList = [];
	}

	if (DEBUGON) {
		console.log("\nafter storage values");
		console.log("ecfEnabled: ", enabled);
		console.log("ecfCountriesList:", countriesList);
	}

	//insert the markup into the sidebar with the other default filters
	//the html here is complicated mostly because I wanted to keep the same aesthetics
	//and structure as the rest of the page
	//important so this plays nicely with other ebay userscripts
	var enableText = `
	<div id='ecf_controls'> 
		<div class='asp asp-left-nav'> 
			<div class='pnl-h'> 
				<h3>Country Filter - Enable</h3>
				<div class='pnl-b pad-bottom'>
					<div class='cbx'> 
						<span> 
							<input type='checkbox' name='ecf_enable' id='ecf_enable' 
								value='enable' class='cbx' ${enabled ? "checked" : ""} /> 
							<label for='ecf_enable'><span class='cbx'>Enabled</span></label> 
						</span> 
					</div> 
				</div> 
			</div> 
		</div> 
	</div> 
	<div id='ecf_countries' style='display: ${enabled ? "block" : "none"}'> 
		<div class='asp'> 
			<div class='pnl-h'> 
				<h3>Country Filter - List</h3>
				<div class='pnl-b pad-bottom'>
					<div id='ecf_countries_list'></div> 
					<div class='cbx'>
						<span class='cbx'> 
							<a id='ecf_add'>Add New Country</a> 
						</span>
					</div>
					<a id='ecf_apply'><input class='submit-btn submit' type='button' value="Apply Changes"></a>
				</div>
			</div>
		</div> 
	</div>`;

	//insert the markup into the sidebar
	//sometimes ebay's markup changes and I can't figure out why (layout looks identical)
	//the two common sidebar containers are left rail and #LeftNavContainer
	var sidebarContainer =
		$("#LeftNavContainer").length > 0
			? $("#LeftNavContainer")
			: $(".srp-rail__left").eq(0);
	sidebarContainer.prepend(enableText);

	//display the list of country list checkboxes
	if (countriesList.length !== 0) {
		countriesList.forEach(function(country) {
			printCountry(country);
		});
	}

	if (enabled) {
		var countriesListText = countriesList.join("|");

		//if the list of countries is empty or the user only added empty strings as countries
		if (countriesListText !== "") {
			var regex = new RegExp(
				"(?:From )(?:" + countriesList.join("|") + ")",
				"i"
			);

			//go through each item li on the page and hide it if it's from an unwanted country
			var itemList =
				$("li.sresult").length > 0 ? $("li.sresult") : $("li.s-item");
			itemList.each(function(index, obj) {
				//the "From: <country> text"
				var locText = obj.textContent.trim();

				if (regex.test(locText)) {
					//add wrapper and expand button
					obj.innerHTML =
						"<div class='ecf_expander'>[+] Hidden - Click to expand</div><div class='ecf_wrapper'>" +
						obj.innerHTML +
						"</div>";

					$(this).addClass("ecf_hidden");

					totalHidden++;
				}
			});
		}
	}

	if (DEBUGON) {
		console.log("Total Hidden: " + totalHidden + "\n");
	}

	//To do: display the total items hidden somewhere
	//maybe underneath the total found? or with the rest of the userscripts controls?

	stylesheetInit();

	/* *** Functions and events *** */

	/*	
	adds country to master list and updates local storage

	@return true 	The country given is valid and could be added
	@return false 	The country given is empty/spaces
	*/
	var addCountry = function(country) {
		country = country.trim();

		//if user entered an empty string or a bunch of spaces, ignore it
		if (country === "") {
			return false;
		}

		countriesList.push(country);
		localStorage.setItem("ecfCountriesList", JSON.stringify(countriesList));

		if (DEBUGON) {
			console.log("new country list: ", countriesList);
		}

		return true;
	};

	/*
	removes country from master list and updates local storage
	*/
	var removeCountry = function(country) {
		var index = countriesList.indexOf(country);
		countriesList.splice(index, 1);

		if (DEBUGON) {
			console.log("new country list: ", countriesList);
		}

		localStorage.setItem("ecfCountriesList", JSON.stringify(countriesList));
	};

	/* 
	displays a given country in a checkbox on the page
	*/
	function printCountry(country) {
		var valStripped = country.replace(" ", "");
		$("#ecf_countries_list").append(`
		<div class='cbx'> 
			<span> 
				<input type='checkbox' name='ecf_${valStripped}' 
					id='ecf_${valStripped}' value='${country}' 
					class='cbx ecf_country_checkbox' checked />
				<label for='ecf_${valStripped}'>
					<span class='cbx'>${country}</span>
				</label>
			</span>
		</div>`);
	}

	/*
	clicking on the "Add Country" link will prompt the user for a country 
	*/
	$("#ecf_add").on("click", function() {
		var val = prompt("Enter country name");

		//attempt to add country to list and display it if it's valid
		if (addCountry(val)) {
			printCountry(val);
		}
	});

	/* 
	clicking on a filtered item will show/hide it
	*/
	var resultContainer =
		$("#Results").length > 0 ? $("#Results") : $(".srp-main");
	resultContainer.on("click", ".ecf_expander", function() {
		$(this)
			.next()
			.slideToggle(550, "swing");
	});

	/*
	checking enable checkbox will show the list of countries div
	unchecking it will hide it
	also updates local storage
	*/
	$(document).on("change", "#ecf_enable", function() {
		if (DEBUGON) {
			console.log("ecfEnabled: " + localStorage.getItem("ecfEnabled"));
		}

		if (enabled == true) {
			enabled = false;
			localStorage.setItem("ecfEnabled", false);
			$("#ecf_countries").hide();
			//hide the country filter - list div
		} else {
			enabled = true;
			localStorage.setItem("ecfEnabled", true);
			$("#ecf_countries").show();
			//show the country filter - list div
		}

		if (DEBUGON) {
			console.log("ecfEnabled: " + localStorage.getItem("ecfEnabled"));
		}
	});

	/*
	reload the page so the user's settings will take effect
	*/
	$("#ecf_apply").on("click", function() {
		location.reload();
	});

	/*
	unchecking a country checkbox will remove that country from the master list
	the checkbox will also get removed from the page as well
	*/
	$("#ecf_countries_list").on("click", ".ecf_country_checkbox", function() {
		var country = $(this).val();

		if (DEBUGON) {
			console.log(country);
		}

		removeCountry(country);

		$(this)
			.parent()
			.parent()
			.remove(); //structure: <div><span><input /> ...
	});

	/*
	add a new stylesheet to the page and set it up with our styles
	*/
	function stylesheetInit() {
		var sheet = (function() {
			var style = document.createElement("style");

			//for webkit
			style.appendChild(document.createTextNode(""));

			document.head.appendChild(style);

			return style.sheet;
		})();

		sheet.insertRule(
			".ecf_wrapper { background: #333333; border: 5px solid brown; overflow: auto }",
			0
		);
		sheet.insertRule(
			".ecf_expander { cursor: pointer; height: 1.5em; line-height: 1.5em; color: #555; background-color: #fafafa;  }",
			0
		);
		sheet.insertRule(
			".ecf_hidden .ecf_wrapper { background: #cccccc; display: none; }",
			0
		);
		sheet.insertRule("#ecf_controls { margin-bottom:5px; }", 0);
		sheet.insertRule("#ecf_add { display:block; margin-top: 6px; }", 0);
		sheet.insertRule(
			"#ecf_apply { display:block; margin-top: 15px;color:#333333; }",
			0
		);
		sheet.insertRule("#ecf_apply input { display:block; width:auto; }", 0);
	}
})();
