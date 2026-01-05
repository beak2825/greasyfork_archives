// ==UserScript==
// @name        GRO Index Search Helper
// @description Adds additional functionality to the UK General Register Office (GRO) BMD index search
// @namespace   cuffie81.scripts
// @match       https://www.gro.gov.uk/gro/content/certificates/indexes_search.asp*
// @version     1.20
// @grant       GM_listValues
// @grant       GM_getValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/24590/GRO%20Index%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/24590/GRO%20Index%20Search%20Helper.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {
	let resources, recordType, results;
	
	var main = function() {
		
		// Register Handlebars helper operators
		Handlebars.registerHelper({
			eq: function (v1, v2) 	{ return v1 === v2; },
			ne: function (v1, v2) 	{ return v1 !== v2; },
			lt: function (v1, v2) 	{ return v1 < v2; },
			gt: function (v1, v2) 	{ return v1 > v2; },
			lte: function (v1, v2)	{ return v1 <= v2; },
			gte: function (v1, v2)	{ return v1 >= v2; },
			and: function () 		{ return Array.prototype.slice.call(arguments).every(Boolean); },
			or: function () 		{ return Array.prototype.slice.call(arguments, 0, -1).some(Boolean); }
		});
		
		buildResources();
		recordType = getRecordType();
		//console.log("resources:\r\n%s", JSON.stringify(resources));
		
		// Load the general css
		$("body").append($(resources.baseStyle));

		
		initialiseSearchForm();
		initialiseResultViews();
		
		// Scroll down to the form. Do this last as we may add/remove/change elements in the previous calls.
		$("h1:contains('Search the GRO Online Index')")[0].scrollIntoView();
		
	
		// Wire up accesskeys to clicks, to avoid having to use the full accesskey combo (eg ALT+SHFT+#)
		$(document).on("keypress", function(e) {
			
			let activeElementIsTextField = (document.activeElement
											&& document.activeElement.tagName.toLowerCase() !== "input"
											&& document.activeElement.getAttribute("type") === "text");
        
			if (!activeElementIsTextField)
			{
				let char = String.fromCharCode(e.which);
				//console.log("keypress: %s", char);
				if ($("*[id^='groish'][accesskey='" + char + "']").length)
					$("*[id^='groish'][accesskey='" + char + "']").click();
				else if (char == "{")
					adjustSearchYear(-10);
				else if (char == "}")
					adjustSearchYear(10);
				else if (char == "?")
					$("form[name='SearchIndexes'] input[type='submit'][value='Search'][accesskey='?']").click();
				else if (char == '@')
					switchRecordType();
			}
		});
		
		// Remove focus
		if (document.activeElement)
			document.activeElement.blur();
	}
	
	var initialiseSearchForm = function() {
	
		// Hide superfluous spacing, text and buttons
		$("form[name='SearchIndexes'] input[type='submit'][value='Reset']").hide();
		$("form[name='SearchIndexes'] a.tooltip").hide();
		
		$("form[name='SearchIndexes'] span.main_text").has("i > a[href^='most_customers_want_to_know.asp']").hide();
		
		$("form[name='SearchIndexes'] a:contains('FreeBMD')").hide();
		$("form[name='SearchIndexes'] a:contains('(used 1837')").hide();

		$("form[name='SearchIndexes'] td.main_text[colspan='5'] > br").closest("tr").hide();
		$("form[name='SearchIndexes'] td.main_text[colspan='5'] > strong").closest("tr").hide();
		
		$("form[name='SearchIndexes'] #SurnameMatchesText").closest("tr").hide();
		$("form[name='SearchIndexes'] #ForenameMatchesText").closest("tr").hide();
		$("form[name='SearchIndexes'] #MothersMaidenSurnameMatchesText").closest("tr").hide();
		
		// Change text
		$("form[name='SearchIndexes'] td span.main_text:contains('year(s)')").text("yrs");
		
		$("form[name='SearchIndexes'] td.main_text:contains('Surname at Death:')").html("Surname:<span class='redStar'>*</span>");
		$("form[name='SearchIndexes'] td.main_text:contains('First Forename at Death:')").text("Forename 1:");
		$("form[name='SearchIndexes'] td.main_text:contains('Second Forename at Death:')").text("Forename 2:");
		$("form[name='SearchIndexes'] td.main_text:contains('District of Death:')").text("District:");
		$("form[name='SearchIndexes'] td.main_text:contains('Age at'):contains('Death'):contains('in years')").text("Age:");
		
		$("form[name='SearchIndexes'] td.main_text:contains('Surname at Birth:')").html("Surname:<span class='redStar'>*</span>");
		$("form[name='SearchIndexes'] td.main_text:contains('First Forename:')").text("Forename 1:");
		$("form[name='SearchIndexes'] td.main_text:contains('Second Forename:')").text("Forename 2:");
		$("form[name='SearchIndexes'] td.main_text:contains('Maiden Surname:')").text("Mother:");
		$("form[name='SearchIndexes'] td.main_text:contains('District of Birth:')").text("District:");
		$("form[name='SearchIndexes'] td.main_text:contains('Register No:')").text("Register:");
		$("form[name='SearchIndexes'] td.main_text:contains('Entry'):contains('No:')").text("Entry:");
		
		$("form[name='SearchIndexes'] a:contains('View list of registration districts')").text("Districts");

		
		// Add gender and year navigation buttons, and style them
		let searchButton = $("form[name='SearchIndexes'] input[type='submit'][value='Search']");
		$(searchButton).attr("accesskey", "?");
		$(searchButton).parent().find("br").remove();

		$("<input type='button' class='formButton' accesskey='#' id='groish_BtnToggleGender' value='Gender' />").insertBefore($(searchButton));
		$("<input type='button' class='formButton' accesskey='[' id='groish_BtnYearsPrev' value='&lt; Years' />").insertBefore($(searchButton));
		$("<input type='button' class='formButton' accesskey=']' id='groish_BtnYearsNext' value='Years &gt;' />").insertBefore($(searchButton));
		
		let buttonContainer = $("form[name='SearchIndexes'] input[type='submit'][value='Search']").closest("td").addClass("groish_ButtonContainer");
		
		// Add button event handlers
		$("input#groish_BtnYearsPrev").click(function() { navigateYears(false); });
		$("input#groish_BtnYearsNext").click(function() { navigateYears(true); });
		$("input#groish_BtnToggleGender").click(function() { toggleGender(); });
		
		// Add death age sync checkbox
		let ageInput = $("form[name='SearchIndexes'] #Age");
		let ageInputContainer = $(ageInput).closest("td");
		if (ageInput && ageInputContainer && $(ageInput).is(":visible")) {
			
			// Add checkbox
			$("<input type='checkbox' id='groish_AgeSync' /> <label for='groish_AgeSync' class='main_text' title='Keep age in sync with year'>Sync</label>").appendTo($(ageInputContainer));
			
			// Get values
			let age = parseInt($(ageInput).val(), 10);
			let syncAge = (!isNaN(age)) && (sessionStorage.getItem("age-sync") === "true");
			
			// Set checkbox state
			$("input#groish_AgeSync").prop('checked', syncAge);
			
			// Add event handler to sync checkbox, to save state
			$("input#groish_AgeSync").click(function() { sessionStorage.setItem("age-sync", $("input#groish_AgeSync").is(":checked")); });
		}

		// Set encoding
		if (typeof $("form[name='SearchIndexes']").attr("accept-charset") === typeof undefined) {
			$("form[name='SearchIndexes']").attr("accept-charset", "UTF-8");
		}

	}
	
	var initialiseResultViews = function() {
		
		// Move default results table into a view container
		let defaultTable = $("form[name='SearchIndexes'] h3:contains('Results:')").closest("table").css("width", "100%").addClass("groish_ResultsTable");
		$(defaultTable).before($("<div results-view='default' />"));
		let defaultView = $("div[results-view='default']");
		$(defaultView).append($("table.groish_ResultsTable"));

		// Move header row to before default view
		$(defaultView).before($("<div class='groish_ResultsHeader' style='margin: 10px 0px; position: relative' />"));
		$(".groish_ResultsHeader").append($("table.groish_ResultsTable h3:contains('Results:')"));

		// Move pager row contents to after default view
		$(defaultView).after($("table.groish_ResultsTable > tbody > tr:last table:first"));
		$("div[results-view='default'] + table").css("width", "100%").addClass("groish_ResultsInfo");

		// Get results, sort them and populate views
		results = getResults(recordType);
		sortResults();
		populateAlternateViews();
		
	}
	
	var sortResults = function(reverse, sortFieldsCsv) {
		//console.log("sorting results, sort fields: %s", sortFieldsCsv);
		
		if (!results || !results.items)
			return;
		
		let defaultSortFields = "year,quarter";
		
		// Get the last sort fields and order for the record type
		let sortFieldsKey 	= recordType + "-sort-fields";
		let sortOrderKey	= recordType + "-sort-order";
		let lastSortFields 	= sessionStorage.getItem(sortFieldsKey);
		let lastSortOrder 	= sessionStorage.getItem(sortOrderKey);
		
		// Cleanup values
		sortFieldsCsv = (sortFieldsCsv || "").replace(/\s\s+/g, ' ');
		lastSortFields = (lastSortFields || "").replace(/\s\s+/g, ' ');
		
		//console.log("last sort fields: %s; last sort order: %s", lastSortFields, lastSortOrder);
		
		let sortOrder = "asc";
		if (!sortFieldsCsv) {
			sortFieldsCsv = lastSortFields || defaultSortFields;
			sortOrder = lastSortOrder || "asc";
		}
		else if (sortFieldsCsv.localeCompare(lastSortFields) == 0 && sortOrder.localeCompare(lastSortOrder) == 0 && reverse) {
			sortOrder = "desc";
		}
	
		// Build sort fields and order arrays
		let sortFields = sortFieldsCsv.split(",");
		let sortOrders = Array.apply(null, Array(sortFields.length)).map(String.prototype.valueOf, sortOrder);
		
		// Append defaults if needed
		if (sortFieldsCsv.localeCompare(defaultSortFields) != 0) {
			sortFields.push("year");
			sortFields.push("quarter");
			
			sortOrders.push("asc");
			sortOrders.push("asc");
		}
		
		//console.log("sorting results by: %s (%s)", sortFields, sortOrders);
		results.items = _.orderBy(results.items, sortFields, sortOrders);
		
		sessionStorage.setItem(sortFieldsKey, sortFieldsCsv);
		sessionStorage.setItem(sortOrderKey, sortOrder);
	}

	var populateAlternateViews = function() {
	
		// Add alternate view(s)
		if (recordType && resources && results && results.items && results.items.length > 0) {
			// Remove any existing views
			$("div[results-view][results-view!='default']").remove();
			
			// Add alternate views
			//console.log("Adding alternate views...");
			let viewPrefix = "view_" + recordType; // record type = EW_Birth, EW_Death
			for (let resourceName in resources) {
				let resourceNamePrefix = resourceName.substring(0, viewPrefix.length);
			
				if (resources.hasOwnProperty(resourceName) && viewPrefix.localeCompare(resourceNamePrefix) == 0) {
					let template =  resources[resourceName].toString();
					let compiledTemplate = Handlebars.compile(template);
					let html = compiledTemplate(results);
					
					if (html) {
						$("div[results-view]").filter(":last").after($(html));
						//console.log("Added alternate view");
					}
				}
			}
			
			// Add view helpers and event handlers, if not already added
			if ($("div[results-view]").length > 1) {
				// Add event handler to hide/show actions row
				// TODO: Make adding view event handlers more dynamic, so they can be specific to the view
				$("div[results-view][results-view!='default'] tbody tr.rec")
					.off("click.groish")
					.on("click.groish", function(event) {

						event.preventDefault();
						$(this).next("tr.rec-actions:not(:empty)").toggle();
					}
				);

				// Add event handler for column sorting
				$("div[results-view][results-view!='default'] thead td[sort-fields]")
					.off("click.groish")
					.on("click.groish", function(event) {

						event.preventDefault();
						//let defaultSortFields = ($(this).closet("div[results-view]").attr("default-sort-fields");
						let sortFields = ($(this).attr("sort-fields") ? $(this).attr("sort-fields") : $(this).text());
						sortResults(true, sortFields);
						populateAlternateViews();
					}
				);

				// Add view switcher, if it doesn't already exist
				if ($("#groish_ViewSwitcher").length == 0) {
					$(".groish_ResultsHeader").append($("<a href='#' id='groish_ViewSwitcher' class='main_text' accesskey='~'>Switch view</a>"));
					$("#groish_ViewSwitcher").off("click.groish").on("click.groish", function() { switchResultsView(); return false; });


					// Add results copier (if supported)
					if (window.getSelection && document.createRange) {
						$(".groish_ResultsHeader").append($("<a href='#' id='groish_ResultsCopier' class='main_text' accesskey='|'>Copy results</a>"));
						$("#groish_ResultsCopier")
							.off("click.groish")
							.on("click.groish", function(event) {

								event.preventDefault();

								// Get most specific element containing results, typically a table body
								let resultsContent = $("div[results-view]:visible tbody");

								if (resultsContent.length == 0)
									resultsContent = $("div[results-view]:visible");
								
								if (resultsContent.length > 0) {
									resultsContent = resultsContent[0];
									let selection = window.getSelection();
									let range = document.createRange();
									range.selectNodeContents(resultsContent);
									selection.removeAllRanges();
									selection.addRange(range);

									try {
										if (document.execCommand("copy")) {
											selection.removeAllRanges();
											$(".groish_Message").text("Results copied to clipboard").show();
											setTimeout(function() { $(".groish_Message").fadeOut(); }, 3000);
										}
									}
									catch(e) { }
								}

								return false;
						});
					}
				}
			}

			
			// Show the last used view
			let viewName = sessionStorage.getItem("groish_view." + recordType);
			//console.log("initialising view: %s", viewName);
			if (viewName && $("div[results-view='" + viewName + "']:hidden").length == 1) {
				//console.log("setting active view: %s", viewName);
				$("div[results-view][results-view!='" + viewName + "']").hide();
				$("div[results-view][results-view='" + viewName + "']").show();
			}
		}
		
	}

	var switchResultsView = function() {
		let views = $("div[results-view]");
		if (views.length > 1) {
			let curIndex = -1;
			$(views).each(function(index) {
				if ($(this).css("display") != "none")
					curIndex = index;
			});

			//console.log("current view index: %s", curIndex);
			if (curIndex !== -1) {
				let newIndex = ((curIndex == (views.length-1)) ? 0 : curIndex+1);
				$(views).hide();
				$("div[results-view]:eq(" + newIndex + ")").show();

				$(".groish_Message").hide();

				// Get the name and save it
				let viewName = $("div[results-view]:eq(" + newIndex + ")").attr("results-view")
				sessionStorage.setItem("groish_view." + recordType, viewName); //save it
				//console.log("new view: %s", viewName);
			}
		}
	}
	
	var getResults = function(recordType) {
		let results = { "ageWarningThreshold": 24, "items": [], "failures": [] };
		
		// Lookup record type - birth or death
		if (recordType !== null && (recordType === "EW_Birth" || recordType === "EW_Death")) {
			let gender = $("form[name='SearchIndexes'] select#Gender").val();
			let year = parseInt($("form[name='SearchIndexes'] select#Year").val(), 10);
			let dataFormat = (year >= 1993 ? 1993 : (year >= 1984 ? 1984 : 1837));

			// Save the data format
			results["dataFormat" + dataFormat] = true;
			
			$("div[results-view='default'] > table > tbody > tr")
				.has("input[type='radio'][name='SearchResult']")
				.each(function(index) {
						try
						{
							//console.log("Parsing record (%d)...", index);
							
							let quarterNames = [ "Mar", "Jun", "Sep", "Dec" ];
							
							// Get result id, contains year and record id
							let recordId = null;
							let resultId = $(this).find("input[type='radio'][name='SearchResult']:first").val();
													
							if (resultId && resultId.length > 5 && resultId.indexOf('.') == 4)
								recordId = resultId.substring(5);
				
							// Get names and reference
							let names 	= $(this).find("td:eq(1)").text().replace(/\u00a0/g, " ").replace(/\s\s+/g, ' ').trim();
							let ref 	= $(this).next().find("td:eq(0)").text();

							// Clean up reference
							ref = ref.replace(/\u00a0/g, " ");
							ref = ref.replace(/\s\s+/g, ' ');
							ref = ref.replace(/GRO Reference: /g, "");
							ref = ref.replace(/M Quarter in/g, "Q1");
							ref = ref.replace(/J Quarter in/g, "Q2");
							ref = ref.replace(/S Quarter in/g, "Q3");
							ref = ref.replace(/D Quarter in/g, "Q4");
							ref = ref.replace(/Order this entry as a:/g, "");
							ref = ref.replace(/Entry Number(:|)/gi, "Entry");
							ref = ref.replace(/Occasional Copy(:|)/gi, "Copy");
							ref = ref.replace(/^DOR /gi, "");
							ref = ref.replace(/ Union /gi, " ");
							
							if (/(((-|Q[1-9])\/[0-9]{4}) in )/gi.test(ref))
                              ref = ref.replace(/(((-|Q[1-9])\/[0-9]{4}) in )/gi, "$2 ");
							
							ref = ref.replace(/\s\s+/g, ' ');
							ref = ref.trim();


							// Parse forenames, surname
							let namesArr 	= /([a-z' -]+),([a-z' -]*)/gi.exec(names);
							//console.log("index: %d, namesArr: %s", index, namesArr);
							
							// Parse mother's maiden name
							let mother = null;
							if (recordType === "EW_Birth")
								mother = toTitleCase($(this).find("td:eq(2)").text().replace(/\u00a0/g, " ").replace(/\s\s+/g, ' ')).trim();
							
							// Initialise record
							let record =
								{
									"recordId":		recordId,
									"ref":			ref,
									"gender":		gender,
									"forenames": 	toTitleCase(namesArr[2]).trim(),
									"surname": 		toTitleCase(namesArr[1]).trim(),
									"age": 			null,
									"yob":			null,
									"birth":		null,
									"mother": 		mother,
									"actions": 		[]
								};

							
							// Parse reference
							// TODO: Use named capture groups when widely supported in browsers
							let refPatterns = 
							[
								{
									// 1937 Q3 NORTHAMPTON Volume 03B Page 32
									"pattern": 	"([0-9]{4}) Q([1-4]) ([a-z\\.\\-,\\(\\)0-9\\&'\\/ ]*) (Volume ([a-z0-9]+)) (Page ([0-9a-z]+))( Copy ([0-9a-z]+)|)",
									"indexes": 	{ "year": 1, "quarter": 2, "district": 3, "volume": 5, "page": 7, "copy": 9 }
								},
								{
									// 1937 Q3 NORTHAMPTON Volume 03B
									"pattern": 	"([0-9]{4}) Q([1-4]) ([a-z\\.\\-,\\(\\)0-9\\&'\\/ ]*) (Volume ([a-z0-9]+))( Copy: ([0-9a-z]+)|)",
									"indexes": 	{ "year": 1, "quarter": 2, "district": 3, "volume": 5, "copy": 7 }
								},
								{
									// DOR -/1992 NORTHAMPTON (6701C) Volume 7 Page 2375 Entry Number 126
									"pattern": 	"(-|Q([1-4]))\\/([0-9\\-]{1,4}) ([a-z\\.\\-,\\(\\)0-9\\&'\\/ ]*) (Volume ([a-z0-9]+)) (Page ([0-9a-z]+)) (Entry ([0-9a-z]+))( Copy ([0-9a-z]+)|)",
									"indexes": 	{ "quarter": 2, "year": 3, "district": 4, "volume": 6, "page": 8, "entry": 10, "copy": 12 }
								},
								{
									// DOR Q4/1984 NORTHAMPTON (6701B) Volume 7 Page 2456 
									"pattern": 	"(-|Q([1-4]))\\/([0-9\\-]{1,4}) ([a-z\\.\\-,\\(\\)0-9\\&'\\/ ]*) (Volume ([a-z0-9]+)) (Page ([0-9a-z]+))( Copy ([0-9a-z]+)|)",
									"indexes": 	{ "quarter": 2, "year": 3, "district": 4, "volume": 6, "page": 8, "copy": 10 }
								},
								{
									// DOR Q2/2000 Northampton (6701A) Reg A59B Entry Number 96 
									"pattern": 	"(-|Q([1-4]))\\/([0-9\\-]{1,4}) ([a-z\\.\\-,\\(\\)0-9\\&'\\/ ]*) (Reg ([a-z0-9]+)) (Entry ([0-9a-z]+))( Copy ([0-9a-z]+)|)",
									"indexes": 	{ "quarter": 2, "year": 3, "district": 4, "reg": 6, "entry": 8, "copy": 10 }
								},
								{
									// DOR Q2/2000 Northampton (6701A) Entry Number 96 
									"pattern": 	"(-|Q([1-4]))\\/([0-9\\-]{1,4}) ([a-z\\.\\-,\\(\\)0-9\\&'\\/ ]*) (Entry ([0-9a-z]+))( Copy ([0-9a-z]+)|)",
									"indexes":	{ "quarter": 2, "year": 3, "district": 4, "entry": 6, "copy": 8 }
								}
							];
							
							for (let p of refPatterns) {
								let re 		= new RegExp(p.pattern, "gi");
								let result 	= re.exec(ref);
								
								if (result) {
									if (p.indexes) {
										for (const [key, value] of Object.entries(p.indexes)) {
											//console.log("index: %d, name: %s, value: %s", value, key, result[value]);
											record[key] = (result && result.length > value && result[value]) ? result[value] : null;
										}
									}
									break;
								}
							}
							
							// Set format
							let recordYear 			= (record.year ? record.year : year);
							let recordDataFormat 	= (recordYear >= 1993 ? 1993 : (recordYear >= 1984 ? 1984 : 1837));
							record["dataFormat"] 	= recordDataFormat;
							results["dataFormat" + recordDataFormat] = true;
							
							// Parse age and year of birth
							if (recordType === "EW_Death") {
								
								if (record.dataFormat == 1837) {
									let ageArr = /^([0-9]{1,3})$/.exec($(this).find("td:eq(2)").text().replace(/\u00a0/g, " ").replace(/\s\s+/g, ' ').trim());
									if (ageArr)
										record.age = parseInt(ageArr[1], 10);
								}
								else if (record.dataFormat >= 1984) {
									let yobArr = /^([0-9]{4})$/.exec($(this).find("td:eq(2)").text().replace(/\u00a0/g, " ").replace(/\s\s+/g, ' ').trim());
									if (yobArr)
										record.yob = parseInt(yobArr[1], 10);
								}
							}
							
							
							// Tidy up data...

							// Tidy up strings
							if (record.district) {
								record.district	= toTitleCase(record.district);
								
								for (let prefix of [ "The ", "Of ", "Union Of "]) {
									if (record.district.startsWith(prefix))
										record.district = record.district.replace(prefix, "");
								}
							}
							
							for (let key of [ "forenames", "surname", "district", "volume", "page", "reg", "entry", "copy" ]) {
								if (record[key]) {
									record[key] = record[key].trim();
								}
							}
							
							// Tidy up integers
							for (let key of [ "age", "yob", "birth", "quarter", "year" ]) {
								
								if (record[key]) {
									record[key] = parseInt(record[key], 10);
									
									if (isNaN(record[key]))
										record[key] = null;
								}
							}
							
							// Set calculated data
							if (record.yob && record.yob > 0) {
								record.birth = record.yob;
								
								if (record.year && record.year > 0)
									record.age = record.year - record.yob;
							}
							else if (record.age != null && record.year && record.year > 0) {
								record.birth = record.year - record.age;
							}
							
							record.noForenames	= (!record.forenames || record.forenames == "-");
							record.ageWarning	= (record.age && record.age > 0 && record.age <= results.ageWarningThreshold);
							record.quarterName	= ((record.quarter && record.quarter >=1 && record.quarter <= 4) ? quarterNames[record.quarter-1] : null);

							
							//console.log("resultId: %s, record.recordId: %s, record.year: %s, recordType: %s", resultId, record.recordId, record.year, recordType);
							
							// Determine what actions are supported for the record and add them
							if (record.recordId && record.year && recordType) {
								
								// Define possible actions
								let actions = [
									{ "text": "Order Certificate", 		"url": null, "itemType": "Certificate", "pdfStatus": 0, "selector": "img[src$='order_certificate_button.gif']" },
									{ "text": "Order PDF", 				"url": null, "itemType": "PDF", 		"pdfStatus": 5, "selector": "img[src$='order_pdf_button.gif']" }
									//{ "text": "Order MSF + Bundle", 	"url": null, "itemType": "MSFBundle", 	"pdfStatus": 0, "selector": "img[src$='order_certificate_button.gif']" }
								];
							
								for (let i = 0; i < actions.length; i++) {
									
									if ($(this).next().find(actions[i].selector).length) {
										
										// Build order url
										let orderUrl = "https://www.gro.gov.uk/gro/content/certificates/indexes_order.asp?";
										
										orderUrl += "Index=" + recordType;
										orderUrl += "&Year=" + record.year;
										orderUrl += "&EntryID=" + record.recordId;
										orderUrl += "&ItemType=" + actions[i].itemType;
										
										if (actions[i].pdfStatus && actions[i].pdfStatus > 0)
											orderUrl += "&PDF=" + actions[i].pdfStatus;
										
										actions[i].url = orderUrl;
										record.actions.push(actions[i]);
									}
									
									//console.log("action '%s' (%s), url: %s", actions[i].itemType, actions[i].selector, actions[i].url);
								}
							}
							
							
							//console.log(record);
							results.items.push(record);
						}
						catch (e)
						{
							//console.log("Failed to parse record (%d): %s", index, e.message);
							results.failures.push({ "index": index, "ex": e });
						}
					});
		}
		
		return results;
	}

	var toTitleCase = function(str) {
		return str.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	var switchRecordType = function() {
		let recordTypes = $("form[name='SearchIndexes'] input[type='Radio'][name='index']");

		let curIndex = -1;
		for (let i = 0; i < recordTypes.length; i++) {
			if ($(recordTypes).eq(i).prop("checked")) {
				curIndex = i;
				break;
			}
		}
		
		//console.log("current record type: %d", curIndex);

		if (curIndex >= 0) {
			let nextIndex = (curIndex == (recordTypes.length-1)) ? 0 : curIndex + 1;

			if (nextIndex != curIndex)
				$(recordTypes).eq(nextIndex).prop("checked", true).click();
			
			//console.log("next record type: %d", nextIndex);
		}			
	}

	var toggleGender = function() {
		let curGender = $("form[name='SearchIndexes'] select#Gender").val();
		$("form[name='SearchIndexes'] select#Gender").val((curGender === "F" ? "M" : "F"));
		$("form[name='SearchIndexes'] input[type='submit'][value='Search']").click();
	}
	
	var adjustSearchYear = function(step) {
		let adjusted = false;
		
		// Get min and max years
		let minYear = parseInt($("form[name='SearchIndexes'] select#Year option:eq(2)").val(), 10);
		let maxYear = parseInt($("form[name='SearchIndexes'] select#Year option:last").val(), 10);

		//console.log("Year range: %s - %s", minYear, maxYear);

		if (!isNaN(step) && !isNaN(minYear) && !isNaN(maxYear)) {
			// Read current year and range
			let curYear = parseInt($("form[name='SearchIndexes'] select#Year").val(), 10);
			let curRange = parseInt($("form[name='SearchIndexes'] select#Range").val(), 10);
			
			if (isNaN(curYear) || curYear === 0)
				curYear = 1837;

			if (!isNaN(curRange)) {
				// Calculate the new year
				let newYear = (isNaN(curYear) ? minYear : curYear+step);
				newYear = Math.min(Math.max(newYear, minYear), maxYear);
				
				if (newYear != curYear) {
					
					// Get list of all years
					let years = $("form[name='SearchIndexes'] select#Year option[value]")
									.toArray()
									.map(el => parseInt(el.value, 10))
									.filter(y => !isNaN(y) && y > 0)
									.sort();
									
					//console.log(years);
					
					// If the year doesn't exist try and find the closest
					if (!years.find(y => y === newYear)) {
						let stepRange = (Math.abs(step)-1)/2;
						let nowYear = new Date().getFullYear();
						
						let minYear = (step > 0) ? newYear - stepRange : 1837;
						let maxYear = (step < 0) ? newYear + stepRange : nowYear;
						
						minYear = Math.min(Math.max(minYear, 1837), nowYear);
						maxYear = Math.min(Math.max(maxYear, 1837), nowYear);
						
						years = years.filter(y => y >= minYear && y <= maxYear);
						
						newYear = findClosestNumber(years, newYear, minYear, maxYear);
					}

					//console.log("newYear: %d", newYear);
					
					if (newYear && newYear > 0 && newYear != curYear)
					{
						$("form[name='SearchIndexes'] select#Year").val(newYear);
						adjusted = true;
					}
				}
				
				// Adjust death age
				if (adjusted && curYear && newYear && $("input#groish_AgeSync").is(":checked")) {
					
					// Is the new year in line with the step size?
					if (curYear + step === newYear) {
						let curAge = parseInt($("form[name='SearchIndexes'] #Age").val(), 10);
						if (!isNaN(curAge)) {
							let newAge = Math.max(curAge + step, 0);
							$("#Age").val(newAge);
							//console.log("syncing age: %d -> %d", curAge, newAge);
						}
					}
				}
			}

			//console.log("Current year: %d +-%d (%d-%d), New year: %d (%d-%d)", curYear, curRange, curYear-curRange, curYear+curRange, newYear, newYear-curRange, newYear+curRange);
		}

		return adjusted;
	}
	
	var findClosestNumber = function(numbers, target, minNumber, maxNumber) {
		
		//console.log("target: %d, minNumber: %d, maxNumber: %d", target, minNumber, maxNumber);
		let number = 0;
		
		if (numbers && target && minNumber && maxNumber && minNumber <= maxNumber) {
			target = parseInt(target, 10);
			minNumber = parseInt(minNumber, 10);
			maxNumber = parseInt(maxNumber, 10);
			
			if (numbers.find(n => n === target)) {
				number = target;
			}
			else {
				for (let i = 0; i < numbers.length; i++) {
					let n = numbers[i];
					if (!isNaN(n) && n >= minNumber && n <= maxNumber && Math.abs(target-n) < Math.abs(target-number)) {
						number = n;
						if (Math.abs(target-number) == 1)
							break;
					}
				}
			}
		}
		
		return number;
	}

	var navigateYears = function(forward) {
		let curRange = parseInt($("form[name='SearchIndexes'] select#Range").val(), 10);
		
		if (!isNaN(curRange)) {
			// Calculate the new year
			let step = (curRange * 2) + 1;
			if (!forward) step = -step;
		
			if (adjustSearchYear(step)) {
				$("form[name='SearchIndexes'] input[type='submit'][value='Search']").click();
			}
		}
	}
	
	var getRecordType = function() {
		return $("form[name='SearchIndexes'] input[type='radio'][name='index']:checked").val();
	}

	var buildResources = function() {
		resources = {

			baseStyle: `
<style type="text/css">
	body
	{
		min-height: 1200px;
		background-color: #EAEAEA;
	}
	
	/* widen the page */
	body > table[width="800"]
	{
		width: 960px !important;
	}
	
	/* widen header */
	table[width="780"][height="80"].banner
	{
		width: 100% !important;
	}

	/* widen content area */
	body > table[width="800"] td[width="600"],
	body > table[width="800"] table[width="600"]
	{
		width: 760px !important;
	}

	form[name="SearchIndexes"]
	{
		position: relative !important;
	}
	
	.groish_ButtonContainer
	{
		padding-bottom: 10px;
	}
	
	.groish_ButtonContainer input[type='submit'],
	.groish_ButtonContainer input[type='button']
	{
		margin-right: 20px;
		min-width: 100px;
		font-size: 13px;
		padding: 6px 10px;
		background-color: #15377E;
		border-width: 0px;
	}
	
	.groish_ButtonContainer input[type='submit']
	{
		margin-right: 0px;
	}
	
	#groish_ResultsCopier,
	#groish_ViewSwitcher
	{
		display:inline-block;
		position: absolute;
		bottom: 0px;
		color: #0076C0;
		font-weight: bold;
		cursor: pointer;
	}
	
	#groish_ResultsCopier
	{
		right: 120px;
	}
	
	#groish_ViewSwitcher
	{
		right: 10px;
	}
	
	div[results-view] td[sort-fields]:hover
	{
		cursor: pointer;
	}

	.groish_Message
	{
		position: absolute;
		bottom: -30px;
		left: 5px;
	}
	
	#groish_AgeSync
	{
		vertical-align: middle;
	}

</style>
`,

			view_EW_Birth_Table: `
<style type="text/css">
	div[results-view='EW_Birth-Table'] td
	{
		padding: 5px 3px;
		font-size: 75%;
		color: #222;
		vertical-align: top;
	}
	
	div[results-view='EW_Birth-Table'] thead td
	{
		font-weight: bold;
	}
	
	div[results-view='EW_Birth-Table'] tbody tr:nth-child(4n+1),
	div[results-view='EW_Birth-Table'] tbody tr:nth-child(4n+2)
	{
		background-color: #CCE0FF;
	}
	
	div[results-view='EW_Birth-Table'] tr.rec-actions a
	{
		padding: 0px 5px;
		font-size: 90%;
		color: #15377E;
		text-decoration: none;
	}
</style>
<div results-view='EW_Birth-Table' style='display: none; margin-bottom: 25px' default-sort-fields='year,quarter'>
	<table style='width: 100%; border-collapse: collapse'>
		<thead>
			<tr>
				<td style='width: 12%' sort-fields='year,quarter'>Date</td>
				<td style='width: 30%' sort-fields='forenames,surname'>Name</td>
				<td style='width: 15%' sort-fields='mother'>Mother</td>
				<td style='width: 25%' sort-fields='district'>District</td>
				<td style='width: 6%'  sort-fields='volume,district'>Vol</td>
				<td style='width: 6%'  sort-fields='page,volume'>Page</td>
				<td style='width: 6%'  sort-fields='copy,volume'>Copy</td>
			</tr>
		</thead>
		<tbody>
		{{#each items}}
			<tr class='rec'>
				<td>{{year}} Q{{quarter}}</td>
				<td><span class='forenames'>{{forenames}}</span> <span class='surname'>{{surname}}</span>{{#if noForenames}} ({{gender}}){{/if}}</td>
				<td>{{mother}}</td>
				<td>{{district}}</td>
				<td>{{volume}}</td>
				<td>{{page}}</td>
				<td>{{copy}}</td>
			</tr>
			<tr class='rec-actions' style='display: none'>
				<td colspan='7' style='text-align: right'>
				{{#actions}}
					<a href='{{url}}' {{#if title}}title='{{title}}'{{/if}}>{{text}}</a>
				{{/actions}}
				</td>
			</tr>
		{{/each}}
		</tbody>
	</table>
	{{#if failures}}
		<p class='main_text' style='color: Red'>WARNING: Failed to parse {{failures.length}} records. See default view for full list.</p>
		<!--
			{{#each failures}}record parse exception ({{index}}): exception: {{ex.message}}{{/each}}
		-->
	{{/if}}
	<p class='main_text groish_Message'></p>
</div>`,
		
			view_EW_Birth_Delimited: `
<style type="text/css">
	div[results-view='EW_Birth-Delimited'] td
	{
		padding: 5px 3px;
		font-size: 75%;
		color: #222;
		vertical-align: top;
	}
	
	div[results-view='EW_Birth-Delimited'] thead td
	{
		font-weight: bold;
	}
	
	div[results-view='EW_Birth-Delimited'] tbody tr:nth-child(odd)
	{
		background-color: #CCE0FF;
	}

</style>
<div results-view='EW_Birth-Delimited' style='display: none; margin-bottom: 25px' default-sort-fields='year,quarter'>
	<table style='width: 100%; border-collapse: collapse'>
		<thead>
			<tr>
				<td style='width: 100%' sort-fields='year,quarter'>Births</td>
			</tr>
		</thead>
		<tbody>
		{{#each items}}
			<tr class='rec'>
				<td>
				{{year}} Q{{quarter}} Birth: 
				{{forenames}} {{surname}}{{#if noForenames}} ({{gender}}){{/if}} 
				(mmn: {{mother}}); 
				{{district}};{{#if volume}} Vol {{volume}};{{/if}}{{#if page}} Page {{page}};{{/if}}{{#if copy}} Copy {{copy}};{{/if}}
				</td>
			</tr>
		{{/each}}
		</tbody>
	</table>
	{{#if failures}}
		<p class='main_text' style='color: Red'>WARNING: Failed to parse {{failures.length}} records. See default view for full list.</p>
		<!--
			{{#each failures}}record parse exception ({{index}}): exception: {{ex.message}}{{/each}}
		-->
	{{/if}}
	<p class='main_text groish_Message'></p>
</div>`,

			view_EW_Death_Table: `
<style type="text/css">
	div[results-view='EW_Death-Table'] td
	{
		padding: 5px 3px;
		font-size: 75%;
		color: #222;
		vertical-align: top;
	}
	
	div[results-view='EW_Death-Table'] thead td
	{
		font-weight: bold;
	}
	
	div[results-view='EW_Death-Table'] tbody tr:nth-child(4n+1),
	div[results-view='EW_Death-Table'] tbody tr:nth-child(4n+2)
	{
		background-color: #CCE0FF;
	}
	
	div[results-view='EW_Death-Table'] tr.rec-actions a
	{
		padding: 0px 5px;
		font-size: 90%;
		color: #15377E;
		text-decoration: none;
	}
</style>
<div results-view='EW_Death-Table' style='display: none; margin-bottom: 25px' default-sort-fields='year,quarter'>
	<table style='width: 100%; border-collapse: collapse'>
		<thead>
			<tr>
				<td style='width: 12%' sort-fields='year,quarter'>Date</td>
				<td style='width: 26%' sort-fields='forenames,surname'>Name</td>
				<td style='width: 8%'  sort-fields='age'>Age{{#if ageCautionThreshold}}*{{/if}}</td>
				<td style='width: 8%'  sort-fields='birth'>Birth</td>
				<td style='width: 28%' sort-fields='district'>District</td>
				{{#if (and dataFormat1984 dataFormat1993)}}
					<td style='width: 6%' >Vl/Rg</td>
					<td style='width: 6%' >Pg/Ey</td>
				{{else if dataFormat1993}}
					<td style='width: 6%'  sort-fields='reg,district'>Reg</td>
					<td style='width: 6%'  sort-fields='entry,volume'>Entry</td>
				{{else}}
					<td style='width: 6%'  sort-fields='volume,district'>Vol</td>
					<td style='width: 6%'  sort-fields='page,volume'>Page</td>
				{{/if}}
				<td style='width: 6%'  sort-fields='copy,volume'>Copy</td>
			</tr>
		</thead>
		<tbody>
		{{#each items}}
			<tr class='rec'>
				<td>{{year}}{{#if quarter}} Q{{quarter}}{{/if}}</td>
				<td><span class='forenames'>{{forenames}}</span> <span class='surname'>{{surname}}</span>{{#if noForenames}} ({{gender}}){{/if}}</td>
				<td>{{age}}</td>
				<td>{{birth}}
				<td>{{district}}</td>
				<td>{{#if volume}}{{volume}}{{else if reg}}{{reg}}{{/if}}</td>
				<td>{{#if page}}{{page}}{{else if entry}}{{entry}}{{/if}}</td>
				<td>{{copy}}</td>
			</tr>
			<tr class='rec-actions' style='display: none'>
				<td colspan='8' style='text-align: right'>
				{{#actions}}
					<a href='{{url}}' {{#if title}}title='{{title}}'{{/if}}>{{text}}</a>
				{{/actions}}
				</td>
			</tr>
		{{/each}}
		</tbody>
	</table>
	{{#if failures}}
		<p class='main_text' style='color: Red'>WARNING: Failed to parse {{failures.length}} records. See default view for full list.</p>
		<!--
			{{#each failures}}record parse exception ({{index}}): exception: {{ex.message}}{{/each}}
		-->
	{{/if}}
	<p class='main_text groish_Message'></p>
</div>`,

			view_EW_Death_Delimited: `
<style type="text/css">
	div[results-view='EW_Death-Delimited'] td
	{
		padding: 5px 3px;
		font-size: 75%;
		color: #222;
		vertical-align: top;
	}
	
	div[results-view='EW_Death-Delimited'] thead td
	{
		font-weight: bold;
	}
	
	div[results-view='EW_Death-Delimited'] tbody tr:nth-child(odd)
	{
		background-color: #CCE0FF;
	}
	
</style>
<div results-view='EW_Death-Delimited' style='display: none; margin-bottom: 25px' default-sort-fields='year,quarter'>
	<table style='width: 100%; border-collapse: collapse'>
		<thead>
			<tr>
				<td style='width: 100%' sort-fields='year,quarter'>Deaths</td>
			</tr>
		</thead>
		<tbody>
		{{#each items}}
			<tr class='rec'>
				<td>
					{{year}}{{#if quarter}} Q{{quarter}}{{/if}} Death: 
					{{forenames}} {{surname}}{{#if noForenames}} ({{gender}}){{/if}};
					{{#if yob}}
						Born {{yob}} (age {{age}});
					{{else}}
						Age {{age}} (b{{birth}});
					{{/if}}
					{{district}};{{#if volume}} Vol {{volume}};{{/if}}{{#if page}} Page {{page}};{{/if}}{{#if reg}} Reg {{reg}};{{/if}}{{#if entry}} Entry {{entry}};{{/if}}{{#if copy}} Copy {{copy}};{{/if}}
				</td>
			</tr>
		{{/each}}
		</tbody>
	</table>
	{{#if failures}}
		<p class='main_text' style='color: Red'>WARNING: Failed to parse {{failures.length}} records. See default view for full list.</p>
		<!--
			{{#each failures}}record parse exception ({{index}}): exception: {{ex.message}}{{/each}}
		-->
	{{/if}}
	<p class='main_text groish_Message'></p>
</div>`

		};

		// Add custom views
		// NB: Although GreaseMonkey has replaced the GM_* functions with functions on the GM object
		// both ViolentMonkey and TamperMonkey still support the GM_* functions so that's being used.

		// Custom views are defined as GM values (one value per view). The value name must begin with
		// either view_EW_Birth or view_EW_Death. The view may contain CSS and HTML and the views are
		// Handlebars.js templates (see default views above for examples).
	
		//console.log("adding custom views");
		if (typeof GM_listValues === "function" && typeof GM_getValue === "function") {
			let valueKeys = GM_listValues();
			for(let i = 0; i < valueKeys.length; i++) {
				let valueKey = valueKeys[i];
				//console.log("value key: %", valueKey);
				if (valueKey && valueKey.length > 13 && (valueKey.startsWith("view_EW_Birth") || valueKey.startsWith("view_EW_Death"))) {
					// Check the key isn't already in use
					if (!resources.hasOwnProperty(valueKey)) {
						let viewContent = GM_getValue(valueKey, null);
						if (viewContent) {
							//console.log("adding view: %s", valueKey);
							resources[valueKey] = viewContent;
						}
					}
				}
			}
		}
		
	}

	
	//Get the ball rolling...
	main();
});