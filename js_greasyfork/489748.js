// ==UserScript==
// @name	 Simply Swim Improver
// @version  1.30.8
// @grant	unsafewindow
// @run-at   document-end
// @match https://b1101334.simplyswim.net.au/*
// @require https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js
// @grant	GM_addStyle
// @grant	 GM.setValue
// @grant	GM.getValue
// @grant	 GM.deleteValue
// @grant	 GM.xmlhttpRequest
// @namespace https://greasyfork.org/users/1088091
// @description Script to improve Simply Swim Functionality
// @downloadURL https://update.greasyfork.org/scripts/489748/Simply%20Swim%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/489748/Simply%20Swim%20Improver.meta.js
// ==/UserScript==

//maybe force instructor to be last cell when covering another class
//look into why Thursday 22/8 combined class put the level in the right hand column
//multi swim, need to run a check to eliminate holiday program bookings

let Global_CurrentPage_Link = window.location.href;
let Global_PageTitle_E = document.querySelector('title');
let Global_CustomStyle_E = document.createElement('style');
let REPO_OWNER = 'DeadlyGenga';  // Your GitHub username
let REPO_NAME = 'SimplySwim';  // The repository name
let FILE_PATH = 'images';  // Directory path where images should be uploaded
let JSON_FILE = 'ImageLink.json';  // The JSON file to update
let PRIVATE_TOKEN = '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';
Global_CustomStyle_E.id = "CustomStyle";
document.head.appendChild(Global_CustomStyle_E);

//hides system messages
let Global_SystemMessages_E = document.querySelector('.system_messages');
if(Global_SystemMessages_E){
	if(Global_SystemMessages_E.textContent == "BILLING HOLD ACTIVE  -  CLICK TO REMOVE"){
	}else{
		Global_SystemMessages_E.style.display = 'none';
	}
}

//extracts staff name if found on page
let Global_bTag_E = document.querySelector('html body div#wrapper div#content div#sidebar div.inner b');
if (Global_bTag_E) {
	let Func_textNode_E = getNextTextNode(Global_bTag_E);
	if (Func_textNode_E) {
		GM.setValue("Staff", Func_textNode_E.textContent.trim());
	}
}

//this section hides elements from the top bar				  
GM.getValue("Staff").then(function(Para_Staff_Name_string) {
	if (adminList.includes(Para_Staff_Name_string)) {
		retrieveConfig().then(result => {
			if(result > 14){
				let quickAction_E = document.querySelector('#quickActions');
				const Local_Config_E = '<a href="https://b1101334.simplyswim.net.au/syssettings.php" class="button add_new" title="System Config"><span><span>System Config</span></span></a><span id="flashing" style="padding: 8px; color: red;">Make Up Days</span><br><br>';
				quickAction_E.insertAdjacentHTML('afterbegin', Local_Config_E);
				let Local_Element_E = document.querySelector('#flashing')
				setInterval(() => {
					Local_Element_E.style.visibility = (Local_Element_E.style.visibility === 'hidden') ? 'visible' : 'hidden';} , 500);
			}
		});
	}else if(raisedList.includes(Para_Staff_Name_string)){
		hideElements('#main_menu > ul:nth-child(1) > li:nth-child(8)'); //Document Library
	}else{
		hideElements('#main_menu > ul:nth-child(1) > li:nth-child(8)'); //Document Library
		hideElements('#main_menu > ul:nth-child(1) > li:nth-child(9)'); //Admininstration
		hideElements('#main_menu > ul:nth-child(1) > li:nth-child(6)'); //Enquiries
		hideElements('#main_menu > ul:nth-child(1) > li:nth-child(10)'); //Reports
		hideElements('#main_menu > ul:nth-child(1) > li:nth-child(11)'); //Configuration
	}
});

//add 'Alex Brush' Font
// Inject the Google Font link into the head
let Global_AlexFont_Link = document.createElement('link');
Global_AlexFont_Link.href = 'https://fonts.googleapis.com/css?family=Alex Brush';
Global_AlexFont_Link.rel = 'stylesheet';
document.head.appendChild(Global_AlexFont_Link);

//add buttons to go direct to specific actions
let Global_Calendar_E = document.querySelector('div.calendar');
if (Global_Calendar_E) {
	const newElement = '<div class="quick_info_top"><h2>Quick Actions</h2></div><div class="quick_info_content" id="quickActions"><a href="addfamily.php" class="button add_new" title="Add a New Family"><span><span><img src="//cdn.simplyswim.net.au/images/add.png" align="top"> Add a New Family</span></span></a><br><br></div><span class="quick_info_bottom"></span>'; 
	// Insert the new element and <br> before the calendar element
	Global_Calendar_E.insertAdjacentHTML('beforebegin', newElement);
	Global_Calendar_E.parentNode.insertBefore(document.createElement('br'), Global_Calendar_E);

	const Local_QuickInfo_E = document.querySelector('#quickActions');
	const Local_SalesSummary_E = '<a href="https://b1101334.simplyswim.net.au/newrunreport.php?ReportType=1&ReportID=11" class="button add_new" title="Daily Sales Summary"><span><span>Daily Sales Summary</span></span></a><br><br>';
	const Local_Invoice_Generation_E = '<a href="https://b1101334.simplyswim.net.au/invoicerun.php" class="button add_new" title="Generate Lesson Invoices"><span><span>Lesson Invoice Generation</span></span></a><br><br>';
	const Local_Member_Generation_E = '<a href="https://b1101334.simplyswim.net.au/membershiprenewal.php" class="button add_new" title="Generate Memberships"><span><span>Membership Invoice Generation</span></span></a><br><br>';
	const Local_CreateMultiClass_E = '<a href="https://b1101334.simplyswim.net.au/addclass_multi.php" class="button add_new" title="Add New Multi-Class"><span><span><img src="//cdn.simplyswim.net.au/images/add.png" align="top">  Multi-Class Creation</span></span></a><br><br>';
	const Local_BulkStatement_E = '<a href="https://b1101334.simplyswim.net.au/statementbulk.php" class="button add_new" title="Send Bulk Statments"><span><span>Send Statements</span></span></a><br><br>';
	const Local_FamilyPortalMessages_E = '<a href="https://b1101334.simplyswim.net.au/contactusmessages.php" class="button add_new" title="View Family Portal Messages"><span><span>Family Portal Messages</span></span></a><br><br>';
	const Local_TeacherReplacement_E = '<a href="https://b1101334.simplyswim.net.au/viewteacheroverrides.php" class="button add_new" title="View Teacher Replacmenets"><span><span>View Teacher Replacmenets</span></span></a><br><br>';

	GM.getValue("Staff").then(function(Func_StaffName_String) {
		if (adminList.includes(Func_StaffName_String)) {
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_SalesSummary_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_CreateMultiClass_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_Invoice_Generation_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_Member_Generation_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_BulkStatement_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_FamilyPortalMessages_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_TeacherReplacement_E);
		} else if (raisedList.includes(Func_StaffName_String)) {
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_SalesSummary_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_CreateMultiClass_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_FamilyPortalMessages_E);
			Local_QuickInfo_E.insertAdjacentHTML('beforeend', Local_TeacherReplacement_E);
		}
	});
}

//Sets up the search by child/partial names
let Global_SearchInput_E = document.getElementById('searchField');
if(Global_SearchInput_E){
	Global_SearchInput_E.addEventListener('keypress', function(event) {
		let Global_SearchInput_S = Global_SearchInput_E.value.trim();
		let Global_CleanedName_S = Global_SearchInput_S.trim().split(' ')[0]; // Clean the name (remove spaces and keep only the first name)
		let Global_LastName_S = Global_SearchInput_S.trim().split(' ')[1] || ''; // Clean the name (remove spaces and keep only the last name if present)
		GM.setValue('storedClean', Global_CleanedName_S);
		GM.setValue('storedFull', Global_SearchInput_S);
		GM.setValue('storedLast', Global_LastName_S);
		//keycode 13 is enter
		if (event.keyCode === 13) {
			event.preventDefault();
			Global_SearchInput_E.value = Global_CleanedName_S;
			Global_SearchInput_E.form.submit();
		}
	});
}

//continues the child search funcationality
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/searchresults.php') || Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/searchresultsnew.php')){
	let SearchResults_AllResults_EL = document.querySelectorAll('.first');
	GM.getValue('storedFull').then(function(fullName){
		var searchResults = document.querySelector('.title_wrapper > h2:nth-child(1)');
		searchResults.textContent = "Search Results - " + toProperCase(fullName);
		var firstName = fullName.trim().split(' ')[0];
		var lastName = fullName.trim().split(' ')[1] || '';
		SearchResults_AllResults_EL.forEach(function(row) {
		// Get the text content of the first td element in the current tr
		var tdFirst = row.querySelector('td:first-child').textContent.trim().split(' ')[0];
		var tdLast = row.querySelector('td:first-child').textContent.trim().split(' ')[1];
		// Compare the text with the stored full name
		if (!(tdFirst.toLowerCase().includes(firstName.toLowerCase()) && tdLast.toLowerCase().includes(lastName.toLowerCase()))&&lastName.length>0) {
				row.style.display = 'none'; // Hide the tr element if the text does not contain the full name
			}
		});
		GM.deleteValue('storedClean');
		GM.deleteValue('storedFull');
	// Function to convert a string to proper case
	function toProperCase(str) {
		return str.toLowerCase().replace(/\b\w/g, function (char) {
			return char.toUpperCase();
		});
	}
	});
}

//POS page edits
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/newpos')){
	
	let NewPos_gstTable_E = null;
	let NewPos_Money_Value_D = '';
	let NewPos_tdElements_All = document.querySelectorAll('td');
	for(let local_td_element of NewPos_tdElements_All){
		if (local_td_element.textContent.includes("TOTAL DUE")){
			NewPos_Money_Value_D = local_td_element.nextSibling.nextSibling.textContent;
			NewPos_gstTable_E = local_td_element.parentElement.parentElement
			break;
		}
	}
	NewPos_Money_Value_D = NewPos_Money_Value_D.replace("$","");
	NewPos_Money_Value_D = Number(NewPos_Money_Value_D);
	//calculates the GST Amount
	NewPos_Money_Value_D = Number(Math.round((NewPos_Money_Value_D/115)*1500)/100).toFixed(2);
	NewPos_Money_Value_D = "$ " + NewPos_Money_Value_D;
	let NewPos_gstTR_E = document.createElement('tr');
	let NewPos_gstTD_E = document.createElement('td');
	NewPos_gstTD_E.textContent = "Inc GST";
	NewPos_gstTD_E.style.fontSize = "medium";
	NewPos_gstTR_E.appendChild(NewPos_gstTD_E);
	NewPos_gstTD_E = document.createElement('td');
	NewPos_gstTD_E.textContent = NewPos_Money_Value_D;
	NewPos_gstTD_E.align = "right";
	NewPos_gstTR_E.appendChild(NewPos_gstTD_E);
	NewPos_gstTable_E.appendChild(NewPos_gstTR_E);
	
	//POSItemButton is all POS buttons
	addGlobalStyle('.POSItemButton { display: flex; justify-content: center !important; flex-direction: column !important; border-radius: 10px !important; width: 100px !important; height: 100px !important;}');
	addGlobalStyle('.POSCategoryButton { width: 100px !important; height: 100px !important;}');
	addGlobalStyle('.POSItemDisplayContainer {border-radius:10px !important;}');
	addGlobalStyle('#page > div:nth-child(6) > table:nth-child(3) {border-radius:10px !important;}');
	addGlobalStyle('[class^="POSFunction_"] {border-radius:10px !important;}');

	//AddPOS is the for sale item Buttons
	addGlobalStyle('[onclick*="AddPOS"] {background-color:whitesmoke !important; background-repeat:no-repeat !important; background-size:contain !important; background-position:center !important; clear:left !important;}');
	addGlobalStyle('[onclick*="AddPOS"]~[onclick*="AddPOS"] {clear:none !important;}');

	//Dynamically update images
	POSButton_List = document.querySelectorAll('[positemid]');
	POSButton_List.forEach(function(POSButton_E){
		let POSButton_Text = POSButton_E.firstChild.textContent.trim();
		let POSButton_Price = POSButton_E.firstElementChild;
		let clonedNode = POSButton_Price.cloneNode(true);
		clonedNode.textContent = POSButton_Text;
		clonedNode.style.width = '';
		clonedNode.style.paddingRight = '6px';
		clonedNode.style.paddingLeft = '6px';
		clonedNode.style.position = 'relative';
		clonedNode.style.top = '-25px';
		POSButton_E.insertBefore(clonedNode,POSButton_Price);
		console.log(POSButton_Price);
		console.log(POSButton_Text);
		POSButton_E.firstChild.textContent= '';
		let currentID = POSButton_E.getAttribute("positemid");
		GM.getValue(currentID).then(imageURL => {
			if (imageURL) {
				addGlobalStyle(`[positemid="${currentID}"] {background-image: url("${imageURL}") !important;}`);
			}
		});
	});
}

// this sets end date of bookings to end of year for normal bookings
// If it thinks it is a holiday booking it sets the end date to the same day
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/newenrollment.php')){
	let NewEnroll_startDate_E = document.getElementById('StartDate');
	let NewEnroll_endDate_E = document.getElementById('EndDate');	
	let NewEnroll_Price_Structure_S = document.querySelector('div.row:nth-child(20) > div:nth-child(2)').innerText;	
	if (NewEnroll_startDate_E && NewEnroll_endDate_E) {
		let NewEnroll_startYear_I = NewEnroll_startDate_E.value.split('-')[0];
		let NewEnroll_startMonth_I = NewEnroll_startDate_E.value.split('-')[1];
		let NewEnroll_startDay_I = NewEnroll_startDate_E.value.split('-')[2];
		if(NewEnroll_Price_Structure_S.includes("Holiday")) {
			NewEnroll_endDate_E.value = NewEnroll_startYear_I + '-' + NewEnroll_startMonth_I + '-' + NewEnroll_startDay_I;
		}else{
			NewEnroll_endDate_E.value = NewEnroll_startYear_I + '-12-31';
		}
	}
}

// this sets end date of bookings to end of year for squad multi class
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/multiclassenrollment.php')){
	let MultiEnroll_startDate_E = document.getElementById('StartDate');
	let MultiEnroll_endDatet_E = document.getElementById('EndDate');
	let MultiEnroll_multiType_S = document.querySelector('div.row:nth-child(4) > div:nth-child(2)').innerText;
	if (MultiEnroll_startDate_E && MultiEnroll_endDatet_E ) {
		let startYear = MultiEnroll_startDate_E.value.split('-')[0];
		if (MultiEnroll_multiType_S == "Te Waihora" || MultiEnroll_multiType_S == "Hauora" || MultiEnroll_multiType_S == "Haere-Roa"){
			MultiEnroll_endDatet_E .value = startYear + '-12-31';
		}
	}
}

//hides the owing total on the attendance screen - presets away status for non attend
//auto mark attend for break/squads if time > class start time of day
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/main')){
	
	document.querySelector('.table_wrapper_inner > table:nth-child(2)').querySelectorAll('th').forEach(function(Para_THTag_E){
		let Local_ClassID_Int = Para_THTag_E.children[0].getAttribute("name");
		let Local_ClassEditA_E = document.createElement('a');

		let Local_DateInfoLWeek_Date = document.querySelector('.title_wrapper > h2:nth-child(1) > a:nth-child(1)').href.split('Date=')[1];
		let parts = Local_DateInfoLWeek_Date.split('-');
		let baseDate = new Date(parts[0], parts[1] - 1, parts[2]); // month is 0-based
		baseDate.setDate(baseDate.getDate() + 7);
		let yyyy = baseDate.getFullYear();
		let mm = String(baseDate.getMonth() + 1).padStart(2, '0');
		let dd = String(baseDate.getDate()).padStart(2, '0');

		let Local_DateInfoToday_Date = `${yyyy}-${mm}-${dd}`;
		
		let img = document.createElement('img');
			img.src = "//cdn.simplyswim.net.au/images/edit.png";
			img.border = "0";
			img.align = "bottom";
		Local_ClassEditA_E.append(img, " Edit Class");
		
		Local_ClassEditA_E.href = "https://b1101334.simplyswim.net.au/editclass.php?ClassID=" + Local_ClassID_Int + "&ReturnDate=" + Local_DateInfoToday_Date;
		Local_ClassEditA_E.style = "color: Black;";
		Para_THTag_E.appendChild(Local_ClassEditA_E);
		
	});
	
	// Removes owing total - next to Payment Option
	document.querySelectorAll('.table_wrapper_inner').forEach(function(Para_DivTag_E) {
		let Attendance_BTag_EL = Para_DivTag_E.getElementsByTagName('b');
		for (let LL_i = 0; LL_i < Attendance_BTag_EL.length; LL_i++) {
			let Attendance_SpanTag_EL = Attendance_BTag_EL[LL_i].getElementsByTagName('span');
			for (let LL_j = Attendance_SpanTag_EL.length - 1; LL_j >= 0; LL_j--) {
				let Attendance_SpanTag_E = Attendance_SpanTag_EL[LL_j];
				Attendance_SpanTag_E.parentNode.removeChild(Attendance_SpanTag_E);
			}
		}
	});
	
	//sets all non-Attend reasons to away by default
	document.querySelectorAll('select[name="NonAttendCode"]').forEach(function(Para_DropDown_E) {
		Para_DropDown_E.value = 1;
	}); 
	
	//auto attend for break/squads
	document.querySelectorAll('tr').forEach(function(Para_nameRow_E){
		let Para_nameCell_EL = Para_nameRow_E.getElementsByTagName('td');
		if(Para_nameCell_EL.length>0){
			let Attendance_aTag_EL = Para_nameCell_EL[0].getElementsByTagName('a');
			if(Attendance_aTag_EL.length>0 && Attendance_aTag_EL[1].href.includes('=3040')){
				if (Para_nameCell_EL[1].getElementsByTagName('a')[0].href.includes(Global_CurrentPage_Link)){
					Para_nameCell_EL[1].getElementsByTagName('a')[0].click();
				}
			}
		}
	});
}

//scrolls class page to 3pm and resizes elements to allow each child to be on new line and correctly align Lanes
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/classes_framework')){
	
	// Create a MutationObserver instance to observe changes in the DOM
	const classFrame_observer = new MutationObserver(function(Para_mutationsList) {
		for (let Para_mutation of Para_mutationsList) {
			if (Para_mutation.type === 'childList' && Para_mutation.addedNodes.length > 0) {
				let filteredNodes = Array.from(Para_mutation.addedNodes).filter(function(node) {
					return !node.classList.contains('dhx_body');
				});
				resizeClassesElements(document,false);
				scrollClassDown(document,false);
				break; // Exit the loop after triggering the action
			}
		}
	});

	// Start observing changes in the DOM
	document.querySelectorAll('.dhx_cal_data').forEach(function(element) {
		classFrame_observer.observe(element, { childList: true , subtree: true });
	});	
	addGlobalStyle('.fullWidth { left:0px !important;}');
	addGlobalStyle('.fullWidth { z-index:1}');
}

//set the date for running daily sales Summary
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/newrunreport.php?ReportType=1&ReportID=11')){
	
	// Get the input elements by their IDs
	let DailyReport_StartDateInput_E = document.getElementById('StartDate');
	let DailyReport_EndDateInput_E = document.getElementById('EndDate');
	
	let DailyReport_Year_Int = new Date().getFullYear();
	let DailyReport_Month_Int = String(new Date().getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
	let DailyReport_Day_Int = String(new Date().getDate()).padStart(2, '0');

	// Format the date as yy-mm-dd
	let DailyReport_FormattedDate_Date = DailyReport_Year_Int.toString() + '-' + DailyReport_Month_Int + '-' + DailyReport_Day_Int;
	
	// Check if both input elements exist
	if (DailyReport_StartDateInput_E && DailyReport_EndDateInput_E) {
		DailyReport_StartDateInput_E.value = DailyReport_FormattedDate_Date;
		DailyReport_EndDateInput_E.value = DailyReport_FormattedDate_Date;
	}
}

//Edits various options for Class Creation and Edit pages
if (Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/addclass.php') || Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/addclass_multi.php') || Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/editclass.php') || Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/bulkupdateenrolmenttemplate.php')) {
	let ClassCreation_hrefID_S = Global_CurrentPage_Link.split('au/')[1].split('.')[0];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim ' + ClassCreation_hrefID_S;
	
	// Remove Hour options 12pm-5am and 8pm-11pm
	let ClassCreate_SelectStartHour_E = document.querySelector('select[name="StartHour"]');
	if (ClassCreate_SelectStartHour_E) {
			ClassCreate_SelectStartHour_E.querySelectorAll('option').forEach(function(Func_Option_E) {
			let Func_Option_I = parseInt(Func_Option_E.value, 10);
			if ((Func_Option_I >= 0 && Func_Option_I <= 5) || (Func_Option_I >= 20 && Func_Option_I <= 23)) {
				Func_Option_E.remove();
			}
		});
	}

	//remove lane options 7-10
	let ClassCreate_SelectLanes_E = document.querySelector('select[name="Lane"]');
	if (ClassCreate_SelectLanes_E) {
		ClassCreate_SelectLanes_E.querySelectorAll('option').forEach(function(Func_Option_E) {
			let Func_Option_I = parseInt(Func_Option_E.value, 10);
			if (Func_Option_I >= 7 && Func_Option_I <= 10) {
				Func_Option_E.remove();
			}
			if (Func_Option_I >= 11 && Func_Option_I <= 14) {
				Func_Option_E.textContent = 'Small ' + (Func_Option_I - 10);
			}
		});
	}
		
	// Remove Duration options greater than 120 minutes
	let ClassCreate_SelectDuration_E = document.querySelector('select[name="Duration"]');
	if (ClassCreate_SelectDuration_E) {
		ClassCreate_SelectDuration_E.querySelectorAll('option').forEach(function(Func_Option_E) {
			let Func_Option_I = parseInt(Func_Option_E.value, 10);
			if (Func_Option_I > 120) {
				Func_Option_E.remove();
			}
		});
	}
		
	// Remove Max class size options between 20 and 999
	let ClassCreate_selectMaxStudents_E = document.querySelector('select[name="MaxStudents"]');
	if (ClassCreate_selectMaxStudents_E) {
		ClassCreate_selectMaxStudents_E.querySelectorAll('option').forEach(function(Func_Option_E) {
			let Func_Option_I = parseInt(Func_Option_E.value, 10);
			if (Func_Option_I > 20 && Func_Option_I < 999) {
				Func_Option_E.remove();
			}
		});
	}
		
	// Remove Lane 7 to Lane 10 checkboxes
	for (let LL_i = 7; LL_i <= 10; LL_i++) {
		let Local_checkbox_E = document.querySelector('input[name="Lane[' + LL_i + ']"]');
		if (Local_checkbox_E) {
			Local_checkbox_E.parentNode.removeChild(Local_checkbox_E.nextSibling); // Remove the line break after the checkbox
			Local_checkbox_E.parentNode.removeChild(Local_checkbox_E.nextSibling);
			Local_checkbox_E.parentNode.removeChild(Local_checkbox_E);
		}
	}

	// Rename Lane 11 to Lane 14 as Small 1 to Small 4
	for (let LL_i = 11; LL_i <= 14; LL_i++) {
		let Local_checkbox_E = document.querySelector('input[name="Lane[' + LL_i + ']"]');
		if (Local_checkbox_E) {
			Local_checkbox_E.nextSibling.textContent = 'Small ' + (LL_i - 10);
		}
	}
}

//pass adjustment modification
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/postpassadjustment.php')){
	let PassAdjust_hrefID_S = Global_CurrentPage_Link.split('=')[2].split("&")[0];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Adjustment ' + PassAdjust_hrefID_S;
	let passAdjust_allLabels = document.querySelectorAll('label');
	let PassAdjust_DaysRemaing_Select_E = null;
	let PassAdjust_EntriesRemain_Element = null;
	let PassAdjust_EntriesRemain_Select_E = null;
	passAdjust_allLabels.forEach(function(para_label_e){
		if (para_label_e.textContent.includes('Expiry Days')){
			PassAdjust_DaysRemaing_Select_E = para_label_e.nextSibling.nextSibling;
		}else if(para_label_e.textContent.includes('Entries Rem')){
			PassAdjust_EntriesRemain_Element = para_label_e.nextSibling.nextSibling;
		}else if(para_label_e.textContent.includes('Pass / Entry Adju')){
			PassAdjust_EntriesRemain_Select_E = para_label_e.nextSibling.nextSibling;
		}
	});
	
	//Adds and Selects a "No Action" Option if it is not there
	let PassAdjust_NoAction_Check = true;
	PassAdjust_DaysRemaing_Select_E.querySelectorAll('option').forEach(function(existingOption){
		if (existingOption.value == 0){
			PassAdjust_NoAction_Check = false;
			return;
		}
	});
	if (PassAdjust_NoAction_Check){
		let PassAdjust_zeroOption_E = document.createElement('option');
		PassAdjust_zeroOption_E.value = 0;
		PassAdjust_zeroOption_E.innerText = "-- No Action --";
		PassAdjust_DaysRemaing_Select_E.appendChild(PassAdjust_zeroOption_E);
		PassAdjust_zeroOption_E.selected = true;
	}
	//below forces the option of adding 1 - 30 days to a card, if the option doesnt already exist
	for (let dayX = 1; dayX < 31; dayX++) {
		let PassAdjust_newOption_E = document.createElement('option');
		PassAdjust_newOption_E.value = dayX;
		if (dayX == 1) {
			PassAdjust_newOption_E.innerText = "Add " + dayX + " day";
		}else{
			PassAdjust_newOption_E.innerText = "Add " + dayX + " days";
		}
		let PassAdjust_existingDayAdd_Test = true;
		PassAdjust_DaysRemaing_Select_E.querySelectorAll('option').forEach(function(Func_existingOption_E){
			if (Func_existingOption_E.value == dayX){
				PassAdjust_existingDayAdd_Test = false;
				return;
			}
		});
		if (PassAdjust_existingDayAdd_Test){
			PassAdjust_DaysRemaing_Select_E.querySelector('select').appendChild(PassAdjust_newOption_E);
		}
	} 	
	
	//sets entry adjustment value to reduce by 1
	PassAdjust_EntriesRemain_Select_E.querySelectorAll('option').forEach(function(Func_Option_E) {
			if (Func_Option_E.value == -1) {
				Func_Option_E.selected = true;
			}
	});
	
	//forces information about pass to always be on a new line after the Description
	let PassAdjust_Labels_EL = document.querySelectorAll('label');
	for (let LL_i = 1; LL_i < PassAdjust_Labels_EL.length && LL_i <= 8; LL_i++) {
		PassAdjust_Labels_EL[LL_i].insertAdjacentHTML('afterend', '<br>');
	}
	
	if (PassAdjust_EntriesRemain_Element.textContent.trim() == '1') {
		//sets days remaining to 10 if last entry
		PassAdjust_DaysRemaing_Select_E.querySelector('select').selectedIndex = 10;
	}else if (PassAdjust_EntriesRemain_Element.textContent.trim()=='0'){
		//expires a card if it has 0 uses left and is not a multi month pass
		let PassAdust_monthPass_Check = document.querySelector('.forms > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2)').textContent.includes('Month');
		let PassAdjust_PassStatus_E = document.querySelector('[name="Expired"]');
		if (!PassAdust_monthPass_Check){
			PassAdjust_PassStatus_E.querySelectorAll('option').forEach(function(Func_Option_E){
				if(Func_Option_E.value = 1){
					Func_Option_E.selected = true;
				}
			});
		}
	}
	
addGlobalStyle('.inputs { width: 60% !important;}');
}

//pass view screen
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/viewfamilypass.php')){
	let FamilyPass_hrefID_S = Global_CurrentPage_Link.split('=')[1].split("&")[0];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Pass ' + FamilyPass_hrefID_S;
	
	//forces information about pass to always be on a new line after the Description
	let FamilyPass_Labels_EL = document.querySelectorAll('label');
	for (let LL_i = 1; LL_i < FamilyPass_Labels_EL.length && LL_i <= 8; LL_i++) {
		FamilyPass_Labels_EL[LL_i].insertAdjacentHTML('afterend', '<br>');
	}
	let targetElement = document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(3)');
	let cardType = document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(3)').innerText;
	if (cardType.includes("Senior")){
		cardType = "Sen";
		colour = '#CCC0DA';
	}else if (cardType.includes("Master")){
		cardType = "Mas";
		colour = '#99FF66';
	}else if (cardType.includes("Adult")){
		cardType = "Adu";
		colour ='#DCE6F1';
	}else if (cardType.includes("Child")){
		cardType = "Chi";
		colour = '#FFFF99';
	}else if (cardType.includes("Mellow")){
		cardType = "Mel";
		colour = '#FFCCFF';
	}else if (cardType.includes("Parent")){
		cardType = "Par";
		colour = '#FFCCCC';
	}
	let FamilyID = document.querySelector('div.section:nth-child(2) > div:nth-child(1) > h2:nth-child(1) > a:nth-child(1)').href.split("=")[1];
	addEnhancedBarcodeToPage(colour,cardType,FamilyID,targetElement);
	addGlobalStyle('.inputs { width: 60% !important;}');
	// Create the button element
	let printButton = document.createElement('button');
	printButton.id = 'printableCardTwo';
	printButton.textContent = 'Print Card';

	// Append the button to the element with the class "forms"
	let formsElement = document.querySelector('.forms');
	if (formsElement) {
		formsElement.appendChild(printButton);
	}

	document.getElementById("printableCardTwo").addEventListener("click", function(event) {
		event.preventDefault(); // Prevent default behavior if necessary
		printCard(); // Your custom function
	}, true);
}

//family screen
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/familyinfo.php')){
	let FamilyInfo_hrefID_S = Global_CurrentPage_Link.split('=')[1];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Family ' + FamilyInfo_hrefID_S;
	let FamilyInfo_tds_EL = document.querySelectorAll('td');
	
	let FamilyInfo_hElements_All = document.querySelectorAll('h2');
	let FamilyInfo_FamilyName_S = '';
	for(let local_h_element of FamilyInfo_hElements_All){
		if (local_h_element.textContent.includes("Family Information")){
			FamilyInfo_FamilyName_S = local_h_element.innerText.split(' - ')[1].split(' (')[0];
			break;
		}
	}
	//let FamilyInfo_FamilyName_S = document.querySelector('#page > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > h2:nth-child(1)').innerText.split(' - ')[1].split(' (')[0];
	GM.setValue('ID' + FamilyInfo_hrefID_S,FamilyInfo_FamilyName_S);
	// Loop through each TD element
	FamilyInfo_tds_EL.forEach(function(Para_td_E) {
		let Func_TD_text_S = Para_td_E.textContent.trim();
		// Replace the text with the shortened version if it matches any of the specified phrases
		if (Func_TD_text_S === 'Concession Cards - Adult Casual Swim') {
			Para_td_E.textContent = 'Adult';
		} else if (Func_TD_text_S === 'Concession Cards - Senior/Student Casual Swim') {
			Para_td_E.textContent = 'Senior/Student';
		} else if (Func_TD_text_S === 'Concession Cards - Mellow Mondays'){
			Para_td_E.textContent ='Mellow Mondays';
		} else if (Func_TD_text_S === 'Concession Cards - Masters Swim Group'){
			Para_td_E.textContent ='Masters';
		}else if (Func_TD_text_S === 'Concession Cards - Masters Swim Group'){
			Para_td_E.textContent ='Masters';
		}else if (Func_TD_text_S === '3 Monthly - Adult 3 Month Pass'){
			Para_td_E.textContent ='3 Month: Adult';
		}else if (Func_TD_text_S === '6 Monthly - Senior/Student 6 Month Pass'){
			Para_td_E.textContent ='6 Month: Senior/Student';
		}else if (Func_TD_text_S === 'Concession Cards - Parent & Preschooler'){
			Para_td_E.textContent ='Parent & Preschooler';
		}else if (Func_TD_text_S === 'Concession Cards - Junior Masters Swim'){
			Para_td_E.textContent ='Junior Masters';
		}
		// Add more conditions for other text replacements as needed
	});
	// Function to show the specific table rows
	function showSpecificRows() {
		let Func_tableBody_E = document.querySelector('#page > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(1) > fieldset:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1)');

		if (Func_tableBody_E) {
			// Show the table body and its ancestors
			let Func_TableParent_E = Func_tableBody_E.parentNode;
			while (Func_TableParent_E) {
				if (Func_TableParent_E.style) {
					Func_TableParent_E.style.display = 'block';
				}
				Func_TableParent_E = Func_TableParent_E.parentNode;
			}
			Func_tableBody_E.style.display = 'block';
			
			// Loop through each row
			Func_tableBody_E.querySelectorAll('tr').forEach(function(Para_row_E, Para_Index_Int) {
				if (Para_Index_Int === 0) {
					// Show the header row
					Para_row_E.style.display = 'table-row';
					return;
				}

				// Get the cells in the current row
				let Func_Cells_EL = Para_row_E.querySelectorAll('td');

				// Check if the "Remaining" column has a value greater than 0
				let Func_RemainingValue_Int = parseInt(Para_row_E.querySelectorAll('td')[4].textContent.trim(), 10);

				if (Func_RemainingValue_Int > 0) {
					Para_row_E.style.display = 'table-row';

					// Set display of all child elements to their default
					 Func_Cells_EL.forEach(function(Func_Cell_E) {
						 Func_Cell_E.style.display = 'table-cell';
						// Ensure all children of each cell are visible as well
						Func_Cell_E.querySelectorAll('*').forEach(function(Func_childElement_E) {
							Func_childElement_E.style.display = 'inline';
						});
					});
				}
			});
		}
	}
	let FamilyInfo_autoMode = false;
	let FamilyInfo_PassInfo_E = "";
	function logFocusedElementInfo(){
		const Func_focusedElement_E = document.activeElement;
		if (Func_focusedElement_E) {
			FamilyInfo_PassInfo_E = Func_focusedElement_E.href;
			FamilyInfo_PassInfo_E = FamilyInfo_PassInfo_E.substring(FamilyInfo_PassInfo_E.indexOf('?')+1);
			if(!FamilyInfo_PassInfo_E.includes('Stage2')){
				window.location.href = "https://b1101334.simplyswim.net.au/postpassadjustment.php?" + FamilyInfo_PassInfo_E;
				FamilyInfo_autoMode = false;
			}
		}
	}

	// Add an event listener for the key combination (Ctrl+Shift+Y in this case)
	document.addEventListener('keydown', function(event) {
		if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
			hideAllElements();
			showSpecificRows();
			FamilyInfo_autoMode = true;
		}
		if (event.key === 'Tab' && FamilyInfo_autoMode) {
			// Use a timeout to ensure the next element is focused before logging
			setTimeout(logFocusedElementInfo, 0);
		}
	});

	//finds any family portal messages and displays them on the communication list
	let FamilyInfo_refElement_S = '';
	let FamilyInfo_dateInfo_D = '';
	let FamilyInfo_trElements_All = document.querySelectorAll('.first');
	for(let local_tr_element of FamilyInfo_trElements_All){
		if (local_tr_element.textContent.includes("New Class Enrolment")){
			FamilyInfo_Communications_EL = local_tr_element.parentElement.querySelectorAll('.first');
			break;
		}
	}
	const FamilyInfo_ExternalUrl_S = 'https://b1101334.simplyswim.net.au/contactusmessages.php';
	fetch(FamilyInfo_ExternalUrl_S)
		.then(response => response.text())
		.then(htmlData => {
			let parser = new DOMParser();
			let doc = parser.parseFromString(htmlData, 'text/html');
			doc.querySelectorAll('.first').forEach(function(Para_rowElement_E) {
				Para_rowElement_E.querySelectorAll('td a').forEach(function(Para_InfoElement_E) {
					let ContactMessages_href_S = Para_InfoElement_E.href;
					if (ContactMessages_href_S.includes(FamilyInfo_hrefID_S)) {
						FamilyInfo_refElement_S = Para_InfoElement_E.parentNode.previousSibling.firstChild.href;
						ContactMessages_Date_S = Para_InfoElement_E.parentNode.previousSibling.textContent.split(' ')[1];
						FamilyInfo_dateInfo_D = ContactMessages_Date_S.split('/');
						ContactMessages_Date_S = ContactMessages_Date_S.split('/')[0] + '/' + ContactMessages_Date_S.split('/')[1] + '/' + ContactMessages_Date_S.split('/')[2];
						FamilyInfo_dateInfo_D = new Date(FamilyInfo_dateInfo_D[2],FamilyInfo_dateInfo_D[1]-1,FamilyInfo_dateInfo_D[0]);
						
						for(let LL_i = 0; LL_i < FamilyInfo_Communications_EL.length; LL_i++) {
							let FamilyInfo_ExistingCom_S = FamilyInfo_Communications_EL[LL_i].firstChild.innerText;
							let FamilyInfo_CommunicationInfo_Date = new Date(FamilyInfo_ExistingCom_S.split('/')[2],FamilyInfo_ExistingCom_S.split('/')[1]-1,FamilyInfo_ExistingCom_S.split('/')[0]);
							
							if(FamilyInfo_CommunicationInfo_Date < FamilyInfo_dateInfo_D){
								let Local_newTR_E = document.createElement('tr');
								Local_newTR_E.classList.add('first');
								let Local_td_E = document.createElement('td');
								Local_td_E.textContent = ContactMessages_Date_S;
								Local_newTR_E.appendChild(Local_td_E);
								Local_td_E = document.createElement('td');
								Local_td_E.innerHTML = '<a style="color: black;" href=' + '"' + FamilyInfo_refElement_S +'"' + '>Inbound Web Portal Message <img src="https://cdn.simplyswim.net.au/images/magnifier.png" border="0" align="bottom"></a>';
								Local_newTR_E.appendChild(Local_td_E);
								FamilyInfo_Communications_EL[LL_i].parentNode.insertBefore(Local_newTR_E, FamilyInfo_Communications_EL[LL_i]);;
								break;
							}
						};
					}
				});					
			});
		})
			.catch(error => {
		});
	//grab email failures if any
	let FamilyInfo_Email_S = '';
	let FamilyInfo_EmailFailDate_S = '';
	let FamilyInfo_EmailFailReason_S = '';
	let FamilyInfo_emailFailure_S = 'https://b1101334.simplyswim.net.au/emailfailures.php';
	let FamilyInfo_Communications_Table_E = document.querySelector('#page > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(3)');
	fetch(FamilyInfo_emailFailure_S)
		.then(response => response.text())
		.then(htmlData => {
			parser = new DOMParser();
			doc = parser.parseFromString(htmlData, 'text/html');
			Local_Rows_EL = doc.querySelectorAll('.first')
			Local_Counter = 0;
			for(let Para_RowElement_E of Local_Rows_EL){
				let Local_Email_FamilyID_S = Para_RowElement_E.querySelector('td:nth-child(4) > a').href.split("=")[1];
				FamilyInfo_EmailFailDate_S = Para_RowElement_E.querySelector('td:nth-child(1)').textContent;
				FamilyInfo_EmailFailDate_S = formatDate(FamilyInfo_EmailFailDate_S);
				FamilyInfo_EmailFailReason_S = Para_RowElement_E.querySelector('td:nth-child(5)').textContent;
				if (Local_Email_FamilyID_S == FamilyInfo_hrefID_S){
					Local_Counter = Local_Counter + 1;
					if (Local_Counter == 1){
						FamilyInfo_Communications_Table_E.insertAdjacentHTML('beforebegin', '<div class="section table_section"><div class="title_wrapper"><h2><img src="https://cdn.simplyswim.net.au/images/attach.png" align="bottom"> Communication Failures - Last 5</h2><span class="title_wrapper_left"></span><span class="title_wrapper_right"></span></div><div class="section_content"><div class="sct"><div class="sct_left"><div class="sct_right"><div class="sct_left"><div class="sct_right"><form name="" action="#" method="" autocomplete="off" target=""><fieldset><div class="table_wrapper"><div class="table_wrapper_inner"><table cellpadding="0" cellspacing="0" width="100%"><tbody id="FailureTable"><tr><th>Date</th><th>Failure Reason</th></tr></tbody></table></div></div></fieldset></form></div></div></div></div></div><span class="scb"><span class="scb_left"></span><span class="scb_right"></span></span></div></div>');
						document.querySelector('#FailureTable').insertAdjacentHTML('beforeend','<tr class="first"><td style="width: 25%;">' + FamilyInfo_EmailFailDate_S + '</td><td>' + FamilyInfo_EmailFailReason_S + '</td></tr>');
					}else if(Local_Counter > 1 && Local_Counter < 6){
						document.querySelector('#FailureTable').insertAdjacentHTML('beforeend','<tr class="first"><td>' + FamilyInfo_EmailFailDate_S + '</td><td>' + FamilyInfo_EmailFailReason_S + '</td></tr>');
					}else if (Local_Counter > 5){
						break;
					}
				}
			}
		})
			.catch(error => {
		});
}

//classes via Iframe
if (Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/classes')) {
	
	function iframeChange() {
		
		let Classes_iFrame_document = document.getElementById('ifm').contentDocument || document.getElementById('ifm').contentWindow.document;
		
		resizeClassesElements(Classes_iFrame_document,true);
		scrollClassDown(Classes_iFrame_document,true);

		// Create a MutationObserver to detect changes in the iframe content
		var observer = new MutationObserver(function(mutationsList) {
			for (var mutation of mutationsList) {
				if (
					mutation.type === 'childList' &&
					mutation.addedNodes.length > 0
				) {
					var filteredNodes = Array.from(mutation.addedNodes).filter(function(node) {
						return !node.classList.contains('dhx_body');
					});
					resizeClassesElements(Classes_iFrame_document,true);
					scrollClassDown(Classes_iFrame_document,true);
					break;
				}
			}
		});

		// Start observing changes in the iframe's content
	  
		var iframe = document.getElementById('ifm');
	  	if(iframe){
			var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
			var calDataElementsIframe = iframeDocument.querySelectorAll('.dhx_cal_data');		 
			// Attach the observer to each calDataElement inside the iframe
			calDataElementsIframe.forEach(function(element) {
				observer.observe(element, { childList: true, subtree: true });
			});
		}
		
// CSS rules to be injected
const cssRules = ".fullWidth {left: 0px !important; z-index: 1 !important;}";
injectCSSIntoIframe('myIframe', cssRules);

	};
	setTimeout(iframeChange, 1000); // Wait for 1000 milliseconds (1 second) before executing the script
	
	//need to call iframeChange whenver the iframe changes
	function observeIframeSrcChange() {
	const iframe = document.getElementById('ifm');
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.attributeName === 'src') {
				setTimeout(iframeChange,1000);
			}
		});
	});
	observer.observe(iframe, {
		attributes: true // Configure it to listen for changes to attributes
	});
}

// Usage
observeIframeSrcChange();
}

//moves new multi enrolment to the right, adds book make up at bottom of attendance only if they are owed a make up, adds swap button to classes that have yet to start
if (Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/studentinfo')){
	let StudentInfo_hrefID_S = Global_CurrentPage_Link.split('=')[1];
	let StudentInfo_ExtractedNumber_I = 0;
	if(StudentInfo_hrefID_S == 'Save'){
		
		document.querySelector('ul.system_messages:nth-child(2)').remove();
		let StudentInfo_StudentTitle_S = document.querySelector('#page > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > h2:nth-child(1)').textContent.trim();
		StudentInfo_ExtractedNumber_I = extractNumberFromText(StudentInfo_StudentTitle_S);
		StudentInfo_hrefID_S = StudentInfo_ExtractedNumber_I;
		
	}else{
		StudentInfo_ExtractedNumber_I = StudentInfo_hrefID_S;
	}
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Student ' + StudentInfo_hrefID_S;
	
	let StudentInfo_aElements_All = document.querySelectorAll('a');
	for(let local_a_element of StudentInfo_aElements_All){
		if (local_a_element.textContent.includes("New Class Enrolment")){
			StudentInfo_levelID_S = local_a_element.getAttribute('onclick').match(/searchLevelID1=(\d+)/)[1];
			break;
		}
	}
	let StudentInfo_classes_tbody = null;
	let StudentInfo_tBodyElements_All = document.querySelectorAll('tbody');
	for(let local_tbody_element of StudentInfo_tBodyElements_All){
		if (local_tbody_element.textContent.includes("Special Price")){
			StudentInfo_classes_tbody = local_tbody_element;
			break;
		}
	}
	let StudentInfo_classes_trArray = StudentInfo_classes_tbody.querySelectorAll('.first');
	StudentInfo_classes_trArray.forEach(local_row_el => {
		
		let local_enrollmentID_S = local_row_el.querySelector('a').href.split('=')[1];
		let local_swapElement_E = local_row_el.querySelector('[onclick]');
		if(!local_swapElement_E){
			// Create Swap Class <a> element
			let swapLink = document.createElement('a');
			swapLink.href = '#';
			swapLink.style.color = 'black';
			let local_onClick_S = `openChild('classes_framework.php?Standalone=1&ScheduleMode=3&StudentID=${StudentInfo_hrefID_S}&EnrollmentID=${local_enrollmentID_S}&ShowWeek=1&showOnlyVacancies=0&searchLevelID1=${StudentInfo_levelID_S}','Classes',1000,650)`;
			swapLink.setAttribute("onclick",local_onClick_S)

			// Add icon and text
			let img = document.createElement('img');
			img.src = '//cdn.simplyswim.net.au/images/arrow_rotate_clockwise.png';
			img.border = '0';
			img.align = 'top';
			img.title = 'Swap Class';

			swapLink.appendChild(img);
			swapLink.appendChild(document.createTextNode('Swap Class'));

			// Append to row (adjust as needed for layout)
			local_row_el.children[0].appendChild(document.createTextNode(' '));
			local_row_el.children[0].appendChild(swapLink);
		}
	});
	
	// Loop through each <ul> element and set its class to "right"
	document.querySelector('.table_menu').querySelectorAll('ul').forEach(function(Para_UL_ELement) {
		Para_UL_ELement.classList.add('right');
	});
	// Construct the URL with the extracted number
	//old url for make ups 'https://b1101334.simplyswim.net.au/bookmakeup.php?StudentID=' + extractedNumber;
	const StudentInfo_URL_S = 'https://b1101334.simplyswim.net.au/newbookmakeup.php?StudentID=' + StudentInfo_ExtractedNumber_I;
	// Create the clickable link element
	let StudentInfo_ulRight_E = document.createElement('ul');
	StudentInfo_ulRight_E.classList.add('right');
	let StudentInfo_AddNew_Button_E = document.createElement('a');
	StudentInfo_AddNew_Button_E.href = StudentInfo_URL_S;
	StudentInfo_AddNew_Button_E.classList.add('button');
	StudentInfo_AddNew_Button_E.classList.add('add_new');
	StudentInfo_ulRight_E.appendChild(StudentInfo_AddNew_Button_E);
	
	let StudentInfo_FamilyUrl_S = '';
	
	for(let local_a_element of StudentInfo_aElements_All){
		if (local_a_element.textContent.includes("Back to Family")){
			StudentInfo_FamilyUrl_S = local_a_element.href;
			break;
		}
	}
	
	// Function to fetch information from the specified URL
	function fetchExternalInfo(Para_Link_S) {
		fetch(Para_Link_S)
			.then(response => response.text())
			.then(htmlData => {
				extractAndDisplayInfo(htmlData);
			})
			.catch(error => {
			});
	};
	// Function to extract make up information and display book make up button
	function extractAndDisplayInfo(htmlData) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlData, 'text/html');
		let Func_BookMakeUp_Check_E = '';
		doc.querySelectorAll('.first').forEach(function(Para_Row_E) {
			Para_Row_E.querySelectorAll('td a').forEach(function(Para_Student_MakeUp_E) {
				let Func_href_S = Para_Student_MakeUp_E.href;
				if (Func_href_S.includes(StudentInfo_ExtractedNumber_I) && Func_href_S.includes('newbookmakeup')) {
					Func_BookMakeUp_Check_E = Para_Student_MakeUp_E.parentNode;
					return;
				}
			});
		});
		if (Func_BookMakeUp_Check_E) {
			if(Func_BookMakeUp_Check_E.textContent.split(' ')[0].trim() > 0){
				let Local_Span_Empty_E = document.createElement('span');
				let Local_Span_Text_E = document.createElement('span');
				Local_Span_Text_E.textContent = 'Book Make Up';
				Local_Span_Empty_E.appendChild(Local_Span_Text_E);
				StudentInfo_AddNew_Button_E.appendChild(Local_Span_Empty_E);
				document.querySelectorAll('.table_menu')[2].querySelector('ul:nth-child(2)').appendChild(StudentInfo_ulRight_E);
			}
			
		}
	}
	// Call the fetchExternalInfo function when the page loads
	fetchExternalInfo(StudentInfo_FamilyUrl_S);
	let StudentInfo_NotesSection_E = document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1)');
	let StudentInfo_NotesRow_E = document.createElement('tr');
	let StudentInfo_NotesNewTD_E = document.createElement('td');
	StudentInfo_NotesSection_E.appendChild(StudentInfo_NotesRow_E);
	StudentInfo_NotesRow_E.appendChild(StudentInfo_NotesNewTD_E);
	StudentInfo_NotesNewTD_E = document.createElement('td');
	StudentInfo_NotesRow_E.appendChild(StudentInfo_NotesNewTD_E);
	StudentInfo_NotesNewTD_E.textContent = '"RT: (initials)" is used to store requested teachers. Use a comma to seperate multiple teachers, use F or M for Female or Male.';
	
	let StudentInfo_NotesOldRow_R = document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(5)');
	document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)').colSpan = "2";
	let StudentInfo_NotesORNewTD = document.createElement('td');
	let StudentInfo_NotesORNewA = document.createElement('a');
	StudentInfo_NotesORNewA.classList.add("button");
	StudentInfo_NotesORNewA.classList.add("send_form_btn");
	StudentInfo_NotesORNewA.href = "https://b1101334.simplyswim.net.au/editlevelgroup.php?LevelGroupID=21";
	StudentInfo_NotesORNewTD.appendChild(StudentInfo_NotesORNewA);
	let Local_SpanOne = document.createElement('span');
	let Local_SpanTwo = document.createElement('span');
	StudentInfo_NotesORNewA.appendChild(Local_SpanOne);
	Local_SpanOne.appendChild(Local_SpanTwo);
	Local_SpanTwo.textContent = "Edit Make Up Group";
	
	let StudentInfo_LevelInfo_E = document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(4)');
	let StudentInfo_LevelInfoSpan_E = document.createElement('td')
	StudentInfo_LevelInfo_E.appendChild(StudentInfo_LevelInfoSpan_E);
	StudentInfo_LevelInfoSpan_E.textContent = 'Please do not change levels to book make ups, change the temp group to allow them to book into a different level';
	
	
	GM.getValue("Staff").then(function(Para_Staff_Name_string) {
		if (adminList.includes(Para_Staff_Name_string)) {
			StudentInfo_NotesOldRow_R.appendChild(StudentInfo_NotesORNewTD);
		}else if(raisedList.includes(Para_Staff_Name_string)){
			StudentInfo_NotesOldRow_R.appendChild(StudentInfo_NotesORNewTD);
		}
	});
}

/* This does not currently work
While I can get it to end the previous classes using an attendance ID of say 100,000(A valid attendance) it will not credit the family with the invoice - Also does not credit the family with that attendance ID
//adds a extra button on swap class page, for if they have yet to start a class
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/swapenrollment.php')){
	let swapEnrol_previouslesson_Div = document.querySelector('div.row:nth-child(7) > div:nth-child(2)');
	// Find the first radio input
let firstRadio = document.querySelector('input[type="radio"][name="LastAttendanceID"]');
if (firstRadio) {
	// Get original value and subtract 1
	let originalValue = parseInt(firstRadio.value);
	let newValue = originalValue - 1;

	// Get the date text (e.g. "Friday 02/05/2025")
	let originalDateText = firstRadio.nextSibling.textContent.trim();
	let dateMatch = originalDateText.match(/\d{2}\/\d{2}\/\d{4}/);
	if (dateMatch) {
		let [day, month, year] = dateMatch[0].split('/').map(Number);
		let originalDate = new Date(year, month - 1, day);

		// Subtract 7 days
		originalDate.setDate(originalDate.getDate() - 7);

		// Format back to dd/mm/yyyy
		let newDateStr = originalDate.toLocaleDateString('en-GB'); // e.g. "25/04/2025"
		let weekday = originalDate.toLocaleDateString('en-GB', { weekday: 'long' }); // e.g. "Friday"

		// Create new radio input
		let newRadio = document.createElement('input');
		newRadio.type = 'radio';
		newRadio.name = 'LastAttendanceID';
		newRadio.value = newValue;

		// Create text node
		let newText = document.createTextNode(` ${weekday} ${newDateStr}`);

		// Insert before the first radio
		firstRadio.parentNode.insertBefore(newRadio, firstRadio);
		firstRadio.parentNode.insertBefore(newText, firstRadio);
		firstRadio.parentNode.insertBefore(document.createElement('br'), firstRadio);
	}
}
}*/

//class extract specifically for Profs and Day sheet
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/main.php')){
function extractInfo(type) {
	
  var dateInfo = document.querySelector('.title_wrapper h2');
	var date = '';
	dateInfo.childNodes.forEach(function(node) {
  	if (node.nodeName !== 'A') {
		date += node.textContent.trim();
  	}
	});
  var weekday = date.split(' ')[0];
  var justDate = date.split(' ')[1];
  var dayMonth = justDate
	.split('/')
  	.slice(0, 2)
	.map(function (part) {
		return part.replace(/^0+/, '');
	})
	.join('/');
  
  var tables = document.querySelectorAll('table');
  if (tables.length < 2) {
	return [];
  }

  var table = tables[1]; // Select the second table (index 1)
  var info = [];
  let medicalArray = [];

  info.push(weekday);
  info.push(justDate);
  var ctSlot = "";
  var cLevel = "";
  var rows = table.querySelectorAll('tr');
  var tracking = 0;
  rows.forEach(function(row) {
	  tracking = tracking +1;
	  //class title information
	var thElement = row.querySelector('th');
	if (thElement) {
	  var imgTitle = '';
	  var classTitleInfo = "";
	  var skipThis = false;
	  var skipThat = false;
	  var aElements = thElement.querySelectorAll('a');
		if (aElements.length >= 2) {
			var aTextContent = aElements[1].textContent.trim();
			var imgElement = aElements[1].querySelector('img');
			var imgTitle = imgElement ? imgElement.getAttribute('title') : '';
			if (imgTitle == "Class Past Start Time"){
				var secimgElement = aElements[1].querySelectorAll('img')[1];
				var imgTitle = secimgElement ? secimgElement.getAttribute('title') : '';
			}
			if (imgTitle !== null) {
				imgTitle = imgTitle.substring(imgTitle.lastIndexOf(':') + 2);
				classTitleInfo = (aTextContent.slice(0,aTextContent.indexOf(" - ",aTextContent.indexOf(" - ")+1)+3) + imgTitle + ' + ' + aTextContent.slice(aTextContent.indexOf(" - ",aTextContent.indexOf(" - ")+1)+3));
			} else {
				classTitleInfo = aTextContent;
			}
			if (aTextContent.includes("Hauora")){
				skipThis = true;
			}
			extraTeacher = "";
			if (type === "Daysheet" || type == "holiday"){
				classInfoArray = classTitleInfo.split(" - ");
				if (classInfoArray[1].includes("Adult")){
					classInfoArray[1] = "Adult";
				}else if (classInfoArray[1].includes("Private")){
					classInfoArray[1] = "Private";
				}else if (classInfoArray[1].includes("Level 2-3 UA")){
					classInfoArray[1] = "Level 2-3 UA";
				}else if (classInfoArray[1].includes("Super Saver")){
					classInfoArray[1] = classInfoArray[1].replace("Super Saver","SS");
				}
				else if (classInfoArray[1].includes("Stroke Clinic")){
					classInfoArray[1] = classInfoArray[1].replace("Stroke Clinic ","");
				}
				else if (classInfoArray[1].includes("Specialist Clinic")){
					classInfoArray[1] = "SpecClin";
				}
				if(classInfoArray[0].includes("9:") || classInfoArray[0].includes("8:")){
					classInfoArray[0] = "0" + classInfoArray[0];
				}
				if (classInfoArray[2].includes(" + ")){
					extraTeacher = "zz+" + classInfoArray[2].split(" + ")[1];
					classInfoArray[2] = classInfoArray[2].split(" + ")[0].trim();
				}
				ctSlot = classInfoArray[0];
				cLevel = classInfoArray[1];
				classTitleInfo = classInfoArray[2].trim() + " - " + classInfoArray[0] + " - " + classInfoArray[3] + " - " +classInfoArray[1];
				//0 is time slot
				//1 is class level
				//2 is instrucor
				//3 is lane
			}
			info.push(classTitleInfo);
			if(extraTeacher.length>0){
				info.push(extraTeacher);
			}
		}
	}
	//class children information
	var tdElements = row.querySelectorAll('td');
	if (tdElements.length >= 2) {
	  var childName = '';
	  var awayStatus = '';
	  var movementStatus = '';
	  var medicalAlert  = '';
	  var birthdayInfo = '';
	  var makeUpStatus = '';
	  var newStudent = '';
	  var idNumber = '';
	  

	  var bElement = tdElements[0].querySelector('b');
	  if (bElement) {
			multiCount = 1;
			multiCount = bElement.querySelector('a').getAttribute("multiClass");
			childName = bElement.textContent.trim();
			var aElement = bElement.querySelector('a');
			if (aElement){
				var studentID = aElement.href.match(/studentinfo\.php\?StudentID=(\d+)$/);
				content5 = ' (' + studentID[1] + ')';
			}
			if (childName.includes("Break") || childName.includes("Squads")) {
				skipThis = true;
			}
			if(type !== "Profs"){
				if (childName.includes("Break") && classInfoArray[2].includes("Admininstration")) {
					skipThat = true;
				}
			}
		}
	if (cLevel.includes("SpecClin") > 0){
		multiCount = 1;
	}
	var makeUp = false;
		//looks at studentInfo
	var imgElements = tdElements[0].querySelectorAll('img');
	var transferStat = tdElements[0].querySelector('b').querySelector('a').getAttribute("transfer");
	var studentNote = tdElements[0].querySelector('b').querySelector('a').getAttribute("StudentNotes");
	let medicalNote = tdElements[0].querySelector('b').querySelector('a').getAttribute("MedicalNotes");
	var studentLevel = tdElements[0].querySelector('b').querySelector('a').getAttribute("level");
	var studentlcLevel = tdElements[0].querySelector('b').querySelector('a').getAttribute("lastClassLevel");
	var studentAge = tdElements[0].querySelector('b').querySelector('a').getAttribute("studentage");
	var studentStatus = tdElements[0].querySelector('b').querySelector('a').getAttribute("attendstatus");
		if (transferStat && studentStatus && studentStatus.includes('exist')){
			if (transferStat.toUpperCase() == (weekday.substr(0,3) + " " + ctSlot).toUpperCase()){
				movementStatus = "T " + dayMonth;
			}
		}else if (studentStatus && studentStatus.includes('return')){
			movementStatus = "R " + dayMonth;
		}else if (studentStatus && studentStatus.includes('new')){
			newStudent = "N "+ dayMonth;
		}
	var instructorInitials = '';
	if (studentNote){
		if (studentNote.includes("RT: (")){
			instructorInitials = "RT: " + studentNote.split("RT: (")[1].split(")")[0];
		}else if (studentNote.includes("RT:(")){
			instructorInitials = "RT: " + studentNote.split("RT:(")[1].split(")")[0];
		}else if (studentNote.includes("RT")){
			instructorInitials = "RT: " + studentNote.split("RT (")[1].split(")")[0];
			let warningAlert = "Please make sure requested teacher is in the correct format\nIt needs to have 'RT:' at the front as well as enclosing the initials in Brackets\nThis needs to be fixed for: " + childName;
			alert(warningAlert);
		}	
	}
	if (studentLevel) {
		if (type == "holiday"){
			sLevelNumber = studentLevel.split(" ")[1];
			if (studentLevel.includes('Te Waihora')){
				sLevelNumber = "TW";
			}
			childName = childName + " " + sLevelNumber;
		}
		sTempLevel = cLevel.split(" ")[1];
		if(sTempLevel*1 > studentlcLevel*1){
			movementStatus = "UP "+ dayMonth;
		}else if (sTempLevel*1 < studentLevel.split(" ")[1]){
			movementStatus = "NU";
		}
	}
	  imgElements.forEach(function(imgElement) {
		var imgTitle = imgElement.getAttribute('title');
		if (!imgTitle) {
			let imgTempTitle = imgElement.getAttribute('src');
			if (imgTempTitle.includes('exclamation')) {
				imgTitle = 'medical alert';
			}else if (imgTempTitle.includes('orange')){
				imgTitle = 'make-up';
			}else{
				return;
			}
		}
		if (imgTitle.includes('recently changed Levels')) {
			sLevel = imgElement.getAttribute('level');
			sALevel = sLevel.split(" ")[1];
			cALevel = cLevel.split(" ")[1];
			if (cALevel == sALevel) {;
				movementStatus = "UP "+ dayMonth;
			}else if (cALevel < sALevel) {
				movementStatus = "NU";
			}else{
				movementStatus = "";
			}
		} else if (imgTitle.includes('medical alert')) {
			medicalAlert = "Q";
			let exists = medicalArray.some(e => e[0] === childName);
			if (!exists) {
				medicalArray.push([childName, medicalNote]);
			}
		} else if (imgTitle.includes('Birthday')) {
			dayofBirth = imgElement.getAttribute("dob").substr(-2)*1;
			monthofBirth = imgElement.getAttribute("dob").substr(5,2)*1;
			birthdayInfo = "BD "+ dayofBirth + "/" + monthofBirth;
		} else if (imgTitle.includes('First Attendance')) {
			if (!(studentStatus == "exist")){
				newStudent = "N "+ dayMonth;
			}
			movementStatus = "";
		} else if (imgTitle.includes('make-up')) {
			makeUpStatus = "MU "+ dayMonth;
			newStudent = newStudent.replace("N " + dayMonth,"");
			makeUp = true;
		} 
	  });
	
		//Looks at away status
	awayStatus = tdElements[1].childNodes[1].textContent.trim();
	  if(awayStatus.includes('Leave')){
			awayStatus = "L " + dayMonth;
			birthdayInfo = "";
	  }else if(awayStatus.includes('Away') || awayStatus.includes('Medical') || awayStatus.includes('Unable') || awayStatus.includes('Booked') || awayStatus.includes('Revised')){
			awayStatus = "A " + dayMonth;
			birthdayInfo = "";		
	  }else if(awayStatus.includes('Holiday')){
			awayStatus = "HP " + dayMonth;
			birthdayInfo = "";
	  }else if (awayStatus.includes('Not Starting Yet')){
	  		awayStatus = "Not Yet " + dayMonth;
			birthdayInfo = "";
	  }else if (awayStatus.includes('Admin No Credit') || awayStatus.includes('Admin with Credit')){
	  		awayStatus = "Admin " + dayMonth;
			birthdayInfo = "";
	  }else if (awayStatus.includes('Marked as Attend')){
		  awayStatus = "";
	  }	  
		if (type === "Profs") {
			if (skipThis) {
				info.pop();
			}else{
				if (!makeUp) {
					childName = childName.replace(/\s*\([^)]*\)/g, '')
					info.push(childName + content5);
				}
			}
		}else if (type === "Daysheet" || type == "holiday"){
			if (skipThat){
				info.pop();
			}
			if(classInfoArray[1].includes('Assessment')){
				info.push(childName + ' (' + studentAge + ')');
			}else if ((makeUp && awayStatus.includes('A')) || awayStatus.includes('Admin') || awayStatus.includes('Not Yet') || childName.includes('Break') || childName.includes('Squads')){
			}else{
				if (makeUp) {
					info.push("zq+" + childName +  ' ^ ' + medicalAlert + ' ^ ' + makeUpStatus + ' ^ ' + awayStatus);
				}else if (multiCount > 1 && type === "Daysheet"){
					info.push(childName + ' x' + multiCount + ' ^ ' + medicalAlert + ' ^ ' + instructorInitials + ' ^ ' + movementStatus + ' ^ ' + newStudent + ' ^ ' + birthdayInfo + ' ^ ' + awayStatus);
				}else{
					info.push(childName + ' ^ ' + medicalAlert + ' ^ ' + instructorInitials + ' ^ ' + movementStatus + ' ^ ' + newStudent + ' ^ ' + birthdayInfo + ' ^ ' + awayStatus);
				}
			}
		}
	}
  });
	if (type === "Daysheet" || type == "holiday") {
		// Recreate the array in a better format
		var mainPool = false;
		var smallPool = false;
		var mainArray = [];
		var smallArray = [];
		info.forEach(function(item) {
			if (item.includes('Main')) {
				mainPool = true;
				smallPool = false;
				mainArray.push(item + " / ");
			} else if (item.includes('Small')) {
				smallPool = true;
				mainPool = false;
				smallArray.push(item + " / ");
			} else {
				if (mainPool) {
					mainArray[mainArray.length - 1] += ' - ' + item;
				}
				if (smallPool) {
					smallArray[smallArray.length - 1] += ' - ' + item;
				}
			}
		});
		mainArray.sort();
		mainArray = organizeGroups(mainArray,weekday,type);
		smallArray.sort();
		smallArray = organizeGroups(smallArray,weekday,type);		
		info = [];
		info.push(weekday);
		info.push(justDate);
		mainArray.sort();
		smallArray.sort();
		x = 0;
		mainArray.forEach(function(instArray){
			y =0;
			instArray.forEach(function(item){
				if (item[0].includes("Hauora")){
					if (mainArray[x+1]){
						if (!mainArray[x+1][y]){
							mainArray[x][0].push(2);
						}else{
							mainArray[x][0].push(1);
						}
					}
				}
				y++;
			});
			x++;
		});
		
		info.push(mainArray);
		info.push(smallArray);
		info.push(medicalArray);
	}
	return info;
}

function displayInfoOnPage(info) {
	var infoContainer = document.createElement('div');
	infoContainer.id = 'infoContainer';
	infoContainer.style.margin = '20px';
	var pElement = document.createElement('div');
		var arrayIndex = 0;
		var prevItem = '';
		info.forEach(function(item) {
			if (arrayIndex < info.length-1){
				if ((info[arrayIndex+1].includes("Main") || info[arrayIndex+1].includes("Small")) && (item.includes("Main") || item.includes("Small"))){
					return;
				}
			}
			if (item.includes('Main') || item.includes('Small')) {
				item = item.replace('Main','Lane');
				item = item.replace('Small','Lane');
				infoContainer.appendChild(pElement);
				pElement = document.createElement('div');
			} else if (arrayIndex > 0){
				pElement.textContent += ' - ';
			}
			
			pElement.textContent += item;
			prevItem = item;
			arrayIndex = arrayIndex + 1;
		});
	infoContainer.appendChild(pElement);
	document.body.appendChild(infoContainer);
}

function createTable(data,mpRows,spRows) {
	var columnWidths = [14,14,14,14,14,14,14,14,14,14]
	var table = document.createElement('table');
	table.id = "ClassTable";
	table.style.borderCollapse = "collapse";
	table.style.display = 'inline-flex';
	var tbody = document.createElement('tbody');
	
	// Date Information
	var dateRow = document.createElement('tr');
	//spacer
	var dateCell = document.createElement('td');
	dateRow.appendChild(dateCell);
	//Month Year
	var monthColour = ["#0000FF","#007FFF","#00FFFF","#00FF00","#B6FF00","#FFFF00","#FCCC1A","#FF7F00","#FF0000","#FF007F","#FF00FF","#7F00FF"];
	var dateCell = document.createElement('td');	
	var dateInfo = new Date(data[1].split("/")[2],data[1].split("/")[1]-1,data[1].split("/")[0]);
	var monthName = dateInfo.toLocaleString('default', { month: 'long' });
	var yearName = dateInfo.getFullYear();
	dateCell.colSpan = 2;
	dateCell.style.fontSize = "4em";
	dateCell.style.fontWeight = "bold";
	dateCell.textContent = monthName + ' ' + yearName;
	dateCell.style.color = monthColour[(17*dateInfo.getMonth()+16) % 12];
	dateRow.appendChild(dateCell);
	//the day
	var dateCell = document.createElement('td');
	dateCell.colSpan = 2;
	dateCell.style.fontSize = "3.5em";
	dateCell.style.textAlign = "center";
	dateCell.textContent = data[0];
	dateCell.style.fontFamily = "Calibri";
	dateCell.style.fontWeight = "Bold";
	dateRow.appendChild(dateCell);
	//date in small format
	var dateCell = document.createElement('td');
	dateCell.textContent =  data[1].substr(0,2) + '-' + monthName.substr(0,3);
	dateCell.style.textAlign = "right";
	dateCell.style.fontSize = "2em";
	dateRow.appendChild(dateCell);
	tbody.appendChild(dateRow);	
	
	var idealWidth = 14;
	var idealHeight = "15px";
	var cellBorder = "Solid Solid Solid None";
	
	// process the class info
function processTheBits(dataBlock,tbody,rows){
	var originalRows = rows;
	dataBlock.forEach(function (instructorInfo) {
		var SpecClinBool = false;
		var SpecClinBig = false;
		for (var i = 0; i < instructorInfo.length; i++){
			if(instructorInfo[i][0].includes("SpecClin") > 0){
				SpecClinBool = true;
			}
		}
		rows = originalRows;
		var instructorName = instructorInfo[0][0];
		if (instructorName.includes("#")) {
			instructorName = instructorName.replace("#","");
		}
		var oaColumnInt = 0;
		var overFlowed = false;
		var columnCount = instructorInfo[0][2];
		var rowCount = instructorInfo[0][1];	
		var spanable = instructorInfo[0][3];
		if (rowCount <= originalRows){
			rows = (rowCount + rows)/2;
		}
		if (rowCount < rows){
			rows = rowCount;
		}
		if (rowCount < 3) {
			rows = 4;
		}
		if (SpecClinBool){
			if (rowCount < 20){
				rows = rowCount/2;
				if (rows < originalRows){
					rows = originalRows;
				}
			}else{
				SpecClinBig = true;
			}
		}
		var classInfoList = instructorInfo.slice(1);
		var restBreak = false;
		// Create a new row for the instructor
		var instructorRow = document.createElement('tr');
		var instructorCell = document.createElement('td');
		instructorCell.style.verticalAlign = "top";
		instructorCell.style.textAlign = "right";
		instructorCell.style.paddingTop = "4px";
		instructorCell.style.paddingRight = "10px";
		instructorCell.style.width = "70px";
		instructorCell.style.borderStyle = "None Solid None None";
		instructorCell.style.borderWidth = "thin";
		instructorCell.textContent = instructorName;
		instructorRow.appendChild(instructorCell);
		// Create cells for class information
		classInfoList.forEach(function (classInfo, index) {
			if(classInfo[0].includes("Specialist Clinic")){
				SpecClinBig = true;
			}else{
				SpecClinBig = false;
			}
			var classCell = document.createElement('td');
			classCell.style.verticalAlign = "top";
			classCell.style.padding = '0';
			classCell.style.margin = '0';
			var classTable = document.createElement('table');
			var bkGround = "#A6A6A6";
			restBreak = false;
			if (spanable > 0){
				classCell.style.backgroundColor = bkGround;
			}
			if (classInfo[0].includes("SS Level") && !classInfo[0].includes("Level 4-5")){
				for (var lp = 1; lp < rows; lp++){
					classInfo.splice(lp * 2, 0, "");
				}
			}
			var columns = Math.ceil(classInfo.length / rows);
			if (columns > 1) {
				for (var k = index + 1; k < classInfoList.length; k++){
					if (classInfoList[k][0] == ""){
						classInfoList.splice(k,1)
						break;
					}
				}
			}
			if (SpecClinBig){
				overFlowed = false;
				oaColumnInt = 1;
				columns = 1;
			}
			if (overFlowed) {
				oaColumnInt = oaColumnInt + 2;
				overFlowed = false;
			}else{
				oaColumnInt = oaColumnInt + 1;
			}
			var columnWidth = 0;
			index = 0;
			
			// Add class info
			// Loop rows times
			for (var i = 0; i < rows; i++) {
				var detailRow = document.createElement('tr');
				if ( i > 0 ) {
					index += 1;
				}
				for (var col = 0; col < columns; col++) {
					index = index + col;
					var detailCell = document.createElement('td');
					if (col == 0 && index > 0){
						detailCell.className = 'column' + oaColumnInt;
					}else if (col == 1 && index > 0){
						detailCell.className = 'column' + (oaColumnInt + 1);
						overFlowed = true;
					}
					if (index > rows*columns){
						break;
					}
					if (classInfo[index]){
						//changes column width for long names - may need to add further granulation
						var columnCheck = classInfo[index].replace(/\^|zq\+|zz\+/g, "").replace(/\s{2,}/g, " ").trim();
						columnCheck = columnCheck.replace("RT: ","");
						columnWidth = columnCheck.length;
						if (classInfo[index].includes("SS")){
							columnWidth = 28;
						}
						if (columnWidths[oaColumnInt-1] < (parseInt(columnWidth)+1)/2) {
							columnWidths[oaColumnInt-1] = (parseInt(columnWidth)+1)/2;
						}
						if (classInfo[index].includes(" - ")){
							var levelInfo = classInfo[index].split(" - ")[1].replace(" ","").replace(" ","").toLowerCase();
							levelInfo = levelInfo.replace("+","plus");
							levelInfo = levelInfo.replace("-","to");
							if (levelInfo.includes("haeretoroa")){
								levelInfo = "haereroa";
							}
						}
						if (classInfo[index].includes("SpecClin")){
							classInfo[index] = classInfo[index].replace("SpecClin","Specialist Clinic");
						}
						bkGround = levelColours[levelInfo.replace("hp","").replace("ss","")];
						if (levelInfo == "break"){
							restBreak = true;
						}else if (levelInfo == "hauora"){
							rows = classInfo.length;
							col = columns;
							//adjustable rowspan
							if (spanable < 2) {
								classCell.rowSpan = spanable+1;
							}else{
								classCell.rowSpan = spanable
							}
						}
						if (classInfo[index].includes(" MU ")) {
							detailCell.style.fontStyle = "italic";
						}
						if (classInfo[index].includes("zz+") && !restBreak){
							classInfo[index] = classInfo[index].replace("zz+","");
							detailCell.style.fontWeight = "bold";
							detailCell.style.textAlign = "center";
							detailCell.style.color = "red";
						}
						if (classInfo[index].includes("zq+") && !restBreak){
							classInfo[index] = classInfo[index].replace("zq+","");
						}
						if(classInfo[index].includes("^")){
							if (SpecClinBig){
								classInfo[index] = " ^ ^ ^";
								if (index == 1){
									classInfo[index] = "See Jenny, Huia or Reception ^ ^ ^";
								}
							}
							classInfoDetails = classInfo[index].split("^");
							classInfoDetails.forEach(function(info){
								var spanCell = document.createElement('span');
								if (info.includes("RT:")){
									spanCell.style.fontWeight = "bold";
									spanCell.style.color = "mediumblue";
									info = info.replace("RT:","");
									if (SpecClinBool){
										info = "";
									}
								}
								info = info.replace(/\s*\([^)]*\)/g, '');
								spanCell.textContent = info;
								if (info.includes(" NU ") || info.includes(" T ") || info.includes(" R ") || info.includes(" A ") || info.includes(" L ") || info.includes(" N ") || info.includes(" UP ") || info.includes(" HP ")){
									spanCell.style.fontWeight = "bold";
									spanCell.style.color = "red";
									if (SpecClinBool){
										spanCell.textContent = "";
									}
								}
								if (info.includes(" Q ")){
									spanCell.style.fontWeight = "bold";
									spanCell.style.color = "blue";
								}
								if (info.includes(" BD ")){
									spanCell.style.fontWeight = "bold";
									spanCell.style.color = "purple";
									if (SpecClinBool){
										spanCell.textContent = "";
									}
								}
								detailCell.appendChild(spanCell);
							});
						}else{
							var levelTitle = false;
							if (classInfo[index].includes("Level")){
								if (col > 0) {
									detailRow.appendChild(detailCell);
									classTable.appendChild(detailRow);
									var detailRow = document.createElement('tr');
									var detailCell = document.createElement('td');
									detailCell.style.minWidth = idealWidth + "em";
									i = i +1;
								}
								detailCell.style.textAlign = "center";
								detailCell.style.fontWeight = "bold";
								detailCell.colSpan = 2;
								levelTitle = true;
								col = columns;
							}
							if (classInfo[index].length>0){
								if(index > 0 && restBreak){
									detailCell.style.color = bkGround;
									detailCell.textContent = "|";
								}else{
									detailCell.textContent = classInfo[index];
								}
							}else{
								//might be removable - doesnt seem to get called
								detailCell.textContent = "|";
							}	
						}
					}else{
						if (col == 0){
							detailCell.textContent = "|";
							detailCell.style.color = bkGround;
						}
					}
					
					detailCell.style.borderColor = "black";
					detailCell.style.borderStyle = cellBorder;
					detailCell.style.borderWidth = "Thin";
					if (index === 0) {
						if (classInfo.length > rows) {
							classCell.colSpan = 2;
							detailCell.colSpan = 2;
							col = columns;
						}
						detailCell.classList.add("classTitle");
					}else{
						if (restBreak && index < (rows - 1)) {
							detailCell.style.borderColor = bkGround;
							detailCell.style.borderStyle = "solid none";
						}else{
							detailCell.style.borderStyle = cellBorder;
						}
						detailCell.style.height = idealHeight;
						detailCell.style.borderWidth = "Thin";
					}
					
					detailCell.style.paddingTop = "0px";
					detailCell.style.paddingBottom = "0px";
					detailRow.appendChild(detailCell);
					
					if(restBreak && i > 0){
						classTable.style.borderRight = "solid";
						classTable.style.borderWidth = "Thin";
					}
					detailRow.classList.add(levelInfo);
					addGlobalStyle('.' + levelInfo + '{background-color: ' + bkGround + '}');
					var classTitle = `.classTitle { text-align: center;border-style: solid;border-width: thin;height: 18px;font-size: 1.1em;font-weight: bold;}`;
					addGlobalStyle(classTitle);
					
					if (restBreak) {
						detailRow.style.backgroundImage = "linear-gradient(to bottom,#E4DFEC,#CCC0DA)";
					}else if (levelInfo === "level2to3ua") {
						detailRow.style.backgroundImage = "linear-gradient(to right,#FFFF99,#CCCCFF)";
					}else if (levelInfo === "sslevel9plus") {
						detailRow.style.backgroundImage = "linear-gradient(to right,#FF99FF,#66FFFF,#FFFF66)";
					}else if (levelInfo === "sslevel7to8") {
						detailRow.style.backgroundImage = "linear-gradient(to right,#FFC000,#99CCFF)";
					}else if (levelInfo === "sslevel6") {
						detailRow.classList.add('level6');
					}else if (levelInfo === "sslevel4to5") {
						detailRow.style.backgroundImage = "linear-gradient(to right,#99CC00,#FFFF00)";
					}else if (levelInfo === "sslevel5to6") {
						detailRow.style.backgroundImage = "linear-gradient(to right,#FFFF00,#99FF66)";
					}else if (levelInfo === "hplevel6plus") {
						detailRow.style.backgroundImage = "linear-gradient(to right,#99FF66,#FFC000,#99CCFF,#FF99FF,#66FFFF,#FFFF66)";
					}
					
					if(classInfo.length > rows && classInfo.length-index <= rows-i && !levelTitle){
						var emptyCell = document.createElement('td');
						emptyCell.textContent = "|";
						emptyCell.style.color = bkGround;
						emptyCell.style.paddingTop = "0px";
						emptyCell.style.paddingBottom = "0px";
						emptyCell.style.borderColor = "black";
						emptyCell.style.borderStyle = cellBorder;
						emptyCell.style.borderWidth = "Thin";
						sizeCheck = detailRow.querySelectorAll('td');
						if (sizeCheck.length<2){
							detailRow.appendChild(emptyCell);
							classTable.appendChild(detailRow);
						}
						col = 1;				
					}
				}
				classTable.appendChild(detailRow);
		  }
			classTable.style.borderCollapse = "collapse";
			classCell.appendChild(classTable);
			classCell.classList.add("nested-sortable");
			instructorRow.appendChild(classCell);
			
		});
		tbody.appendChild(instructorRow);
	});
	}
	
	processTheBits(data[2],tbody,mpRows);
	
	//inserts small pool band
	smallRow = document.createElement('tr');
	smallCell = document.createElement('td');
	smallRow.appendChild(smallCell);
	smallCell = document.createElement('td');
	smallCell.textContent = "Small Pool";
	smallCell.colSpan = 10;
	smallCell.style.textAlign = "center";
	smallCell.style.fontSize = "1.2em";
	smallCell.style.backgroundColor = "indianred";
	smallCell.style.border = "solid";
	smallCell.style.borderWidth = "thin";
	smallCell.style.fontWeight = "bold";
	smallRow.appendChild(smallCell);
	tbody.appendChild(smallRow);
	
	processTheBits(data[3],tbody,spRows);
	
	columnWidths.forEach(function(cWidth,index){
		addGlobalStyle('.column' + (index + 1) + '{min-width: ' + (cWidth) + "em;}");
	});
	
	//insert text area at bottom
	infoRow = document.createElement('tr');
	infoCell = document.createElement('td');
	infoRow.appendChild(infoCell);
	infoCell = document.createElement('td');
	infoCell.style.maxWidth = idealWidth*2 + ".2em";
	infoCell.style.border = "solid";
	infoCell.style.borderWidth = "thin";
	infoSpan = document.createElement('span');
	infoSpan.textContent = "Health and Safety:";
	infoSpan.style.fontSize = "1.1em";
	infoSpan.style.fontFamily = "Arial";
	infoSpan.style.textDecoration = "underline";
	infoCell.appendChild(infoSpan);
	infoTextArea = document.createElement('textarea');
	infoTextArea.style.resize = "none";
	infoTextArea.style.width = "98%";
	infoTextArea.style.fontSize = "1.1em";
	infoTextArea.style.fontFamily = "Arial";
	infoTextArea.addEventListener('input', function() {
		autoResizeTextarea(infoTextArea);
	});
	infoCell.appendChild(infoTextArea);
	if (data[0] == "Saturday" || data[0] =="Sunday"){
		infoCell.colSpan = 3;
	}else{
		infoCell.colSpan = 2;
	}
	infoCell.style.verticalAlign = "top";
	infoSpan = document.createElement('span');
	//insert the skill of the day
	var skilloDay = findSkilloDay(dateInfo);
	infoSpan.textContent = "Skill of the Day: " + skilloDay;
	infoSpan.style.display = "flex";
	infoSpan.style.fontSize ="1.1em";
	//infoCell.appendChild(infoSpan);
	//commented out to not insert skill of the day
	infoRow.appendChild(infoCell);
	infoCell = document.createElement('td');
	infoCell.style.verticalAlign = "top";
	infoCell.style.border = "solid";
	infoCell.style.borderWidth = "thin";
	infoSpanTwo = document.createElement('span');
	infoSpanTwo.textContent = "General Information:";
	infoSpanTwo.style.fontSize = "1.1em";
	infoSpanTwo.style.fontFamily = "Arial";
	infoSpanTwo.style.textDecoration = "underline";
	infoCell.appendChild(infoSpanTwo);
	infoTextAreatwo = document.createElement('textarea');
	infoTextAreatwo.style.resize = "none";
	infoTextAreatwo.style.width = "98%";
	infoTextAreatwo.style.fontSize = "1.1em";
	infoTextAreatwo.style.fontFamily = "Arial";
	infoTextAreatwo.addEventListener('input', function() {
		autoResizeTextarea(infoTextAreatwo);
	});
	infoCell.appendChild(infoTextAreatwo);
	if (data[0] == "Saturday" || data[0] =="Sunday"){
		infoCell.colSpan = 3;
	}else{
		infoCell.colSpan = 2;
	}
	infoRow.appendChild(infoCell);
	tbody.appendChild(infoRow);
	table.appendChild(tbody);

	//make all trs have the same number of columns by adding extra blank grey cells
	let tableRows = Array.from(table.querySelector('tbody').querySelectorAll(':scope > tr'));
	let maxTDs = 0;
	
	tableRows.forEach(tableRow => {
		let tdCount = tableRow.querySelectorAll(':scope > td').length;
		if (tdCount > maxTDs){
			maxTDs = tdCount;
		}
	});
	
	tableRows.forEach((tableRow,index) => {
		if ((index == 0) || (tableRow.textContent.trim() == "Small Pool") || (index == tableRows.length-1)){
			return;
		}
		let currentTDs = tableRow.querySelectorAll(':scope > td');
		let numberOfTds = tableRow.querySelector(':scope> td:nth-child(2) > table').querySelectorAll('tr').length;
		
		let missingtd = maxTDs - currentTDs.length;
		for (let i = 0; i < missingtd; i++){
			
			let newTD = document.createElement('td');
			newTD.classList.add("nested-sortable");
			newTD.style.verticalAlign = "top";
			newTD.style.padding = '0';
			newTD.style.margin = '0';
			let newTable = document.createElement('table');
			newTable.classList.add("deleteableTable");
			let newRow = document.createElement('tr');
			newRow.classList.add('undefined');
			let newTDTwo = document.createElement('td');
			newTDTwo.classList.add('classTitle');
			newRow.appendChild(newTDTwo);
			newTable.appendChild(newRow);
			newTDTwo.textContent = "|";
			newTDTwo.style.color = "#A6A6A6";
			newTDTwo.style.borderStyle = "Solid Solid Solid None";
			newTDTwo.style.borderColor = "black"
			newTDTwo.style.borderWidth = "Thin";
			newTDTwo.style.paddingTop = "0px";
			newTDTwo.style.paddingBottom = "0px";
			let columnNumber = 'column' + (maxTDs - missingtd + i);
			
			for (let j = 0; j< numberOfTds-1;j++){
				newRow = document.createElement('tr');
				newRow.classList.add('undefined');
				newTDTwo = document.createElement('td');
				newTDTwo.classList.add(columnNumber);
				newTDTwo.textContent = "|";
				newTDTwo.style.borderColor = "black"
				newTDTwo.style.borderWidth = "Thin";
				newTDTwo.style.color = "#A6A6A6";
				newTDTwo.style.borderStyle = "Solid Solid Solid None";
				newTDTwo.style.height = "15px";
				newTDTwo.style.paddingTop = "0px";
				newTDTwo.style.paddingBottom = "0px";
				newRow.appendChild(newTDTwo);
				newTable.appendChild(newRow);
			}
			//need to loop now to add new rows and tds
			//newTDTwo.classList.add('column5');
			newTable.style.borderCollapse = "collapse";
			newTD.appendChild(newTable);
			tableRow.appendChild(newTD);
		}
	});	
	return table;
}

function autoResizeTextarea(textarea){
	textarea.style.height = 'auto';
	let fontSize = parseFloat(window.getComputedStyle(textarea, null).getPropertyValue('font-size'));
	textarea.style.height = (textarea.scrollHeight / fontSize) + 0.5 + 'em';
}

function hideOtherElements() {
  var allElements = document.querySelectorAll('div');
  allElements.forEach(function(element) {
	element.classList.add("notDisplay");
	element.style.setProperty('display', 'none', 'important');
  });
}

function showInfoAndHideElements(type,mainRows,smallRows) {
	
	addGlobalStyle('.delete-btn { position: absolute; background: #ff4d4d; color: white; font-size: 12px; border-radius: 50%; width: 16px; height: 16px; text-align: center; line-height: 16px; cursor: pointer; display: none; z-index: 999;}');
	addGlobalStyle('.deleteableTable:hover > .delete-btn { display: block;}');
	addGlobalStyle('.deleteableTR:hover > .delete-btn { display: block;}');
	addGlobalStyle('.delete-btn:not(.delete-btn-tr) {top: 2px; right: 4px;}');
	addGlobalStyle('.delete-btn-tr {top: 2px; left: 4px;}');

	addGlobalStyle('.move-btn { position: absolute; background: blue; color: white; font-size: 12px; border-radius: 50%; width: 16px; height: 16px; text-align: center; line-height: 16px; cursor: pointer; display: none; z-index: 999;}');
	addGlobalStyle('.move-btn:not(.move-btn-tr) {top: 2px; right: 21px;}');
	addGlobalStyle('.move-btn-tr {top: 2px; left: 21px;}');
	addGlobalStyle('.deleteableTable:hover > .move-btn { display: block;}');
	addGlobalStyle('.deleteableTR:hover > .move-btn { display: block;}');
	let extractedInfo = extractInfo(type);
  	hideOtherElements();
	
	
	let revertButton = document.createElement('button');
	revertButton.type = "Button";
	revertButton.id = "revertButton";
	revertButton.classList.add("no-print");
	revertButton.textContent = 'Revert Attendance';
	revertButton.style.position = 'absolute';
	revertButton.style.margin = '15px';
	revertButton.addEventListener('click', function(){
		let allElements = document.querySelectorAll('div');
		allElements.forEach(function(element){
			if (element.classList.contains("notDisplay")){
				element.classList.remove('notDisplay');
				if (element.id != "refreshRequiredModal"){
					element.style.removeProperty('display');
				}
			}
		});
		if(document.querySelector('#freshwidget-close')){
			document.querySelector('#freshwidget-close').click();
		}
		if (document.querySelector('#tableContainer')){
			document.querySelector('#tableContainer').remove();
		}else if(document.querySelector('#infoContainer')){
			document.querySelector('#infoContainer').remove();
		}
	});
	
	
  	document.body.style.overflow = 'auto';
	if (type === "Profs"){
		displayInfoOnPage(extractedInfo);
		if (!document.querySelector('#revertButton')){
			document.querySelector('#infoContainer').appendChild(revertButton);
		}
	}else{

		let tableContainer = document.createElement('div');
		tableContainer.id = 'tableContainer';
		tableContainer.style.position = 'relative';
		document.body.appendChild(tableContainer);
		tableContainer.appendChild(createTable(extractedInfo,mainRows,smallRows));
		
		let medicalNoteString = '<strong>The Information below will not appear when printing</strong><br>'
		//insert medical info that will not print
		extractedInfo[4].forEach(function(line){
			line[1] = line[1].replace(/\n/g, ", ")
			medicalNoteString += '<strong>' + line[0] + '</strong>' + " - " + line[1] + '<br>';
		});
		let medicalArea = document.createElement('p');
		let medicalDiv = document.createElement('div');
		medicalArea.innerHTML = medicalNoteString;
		medicalDiv.classList.add('no-print');
		medicalDiv.appendChild(medicalArea);
		medicalDiv.style.marginLeft = '85px';
		medicalDiv.style.width = '800px';
		if (!document.querySelector('#revertButton')){
			document.querySelector('#tableContainer').appendChild(revertButton);
		}
		document.querySelector('#tableContainer').appendChild(medicalDiv);
	
		//prevents printing elements
		let style = document.createElement('style');
		style.textContent = '@media print {.no-print { display: none !important; }}';
		document.head.appendChild(style);
	
	
		let isCloning = false;
        window.addEventListener("keydown", (e) => {
            if (e.key == "Control") isCloning = true;
        });
        window.addEventListener("keyup", (e) => {
            if (e.key == "Control") isCloning = false;
        });

        // --- Sortable initializer ---
        function makeSortable(el) {
			let oldIndex = "";
			let map = {};
            new Sortable(el, {
                animation: 150,
                ghostClass: "sortable-ghost",
                group: {
                    name: "shared-group",
                    pull: () => isCloning ? "clone" : true,
                    put: true
                },
                onClone: function(evt) {
                    evt.clone.classList.add("cloned");
					addDeleteButton(evt.clone);
                },
				handle: '.move-btn',
				onStart(evt){
					map = {};
					for (let i = 1; i <=10; i++){
						const cell = document.querySelector(`.column${i}`);
						if (cell){
							map[i] = cell.getBoundingClientRect().x
						}
					}
				},
				onEnd(evt) {
					const movedEl = evt.item;
					if(movedEl.tagName == "TR"){
						return;
					}
					const newIndex = movedEl.getBoundingClientRect().x
					let changeCol = 1;
					let smallestDiff = Infinity;
					for( let col in map){
						const diff = Math.abs(map[col] - newIndex);
						if (diff < smallestDiff){
							smallestDiff = diff;
							changeCol = parseInt(col,10);
						}
					}
					
					// Find all .columnX elements inside the dragged block
					const columnCells = movedEl.querySelectorAll("[class*='column']");
					let firstCol = 0;
					let origChange = changeCol;
					columnCells.forEach(cell => {
						const match = Array.from(cell.classList).find(c => c.startsWith('column'));
						if (match) {
							let colNum = parseInt(match.replace('column', ''), 10);
							
							if (firstCol == 0) {
								firstCol = colNum;
							}
							if (colNum > firstCol){
								changeCol = origChange + 1;
							}
							//let newColNum = colNum + change;

							// Optional: Clamp to a minimum of 1
							//newColNum = Math.max(1, newColNum);

							// Replace the class
							cell.classList.remove(`column${colNum}`);
							cell.classList.add(`column${changeCol}`);
						}
					});
				}
            });
        }

        // Main table body
        let table = document.querySelector("#ClassTable > tbody");
        if (table) {
            makeSortable(table);
			Array.from(table.children).forEach(theRow => {
				addDeleteButton(theRow);
				addMoveButton(theRow);
			});
        }

        // Optional: any nested sortable areas
        document.querySelectorAll(".nested-sortable").forEach(nested => {
            makeSortable(nested);
			addDeleteButton(nested.children[0]);
			addMoveButton(nested.children[0]);
			/*makeSortable(nested.children[0])
			let theTRs = nested.children[0].querySelectorAll('tr');
			theTRs.forEach((currentTR, index) => {
				if (index > 0) {
					makeSortable(currentTR);
					console.log(currentTR);
					addDeleteButton(currentTR);
					addMoveButton(currentTR);
				}
			});*/
        });
	}	

	
}

function classGenerateButtons(){
// Create a prof button
var profButton = document.createElement('button');
var targetElement = document.querySelector('.table_wrapper_inner > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)');
targetElement.parentNode.insertBefore(profButton, targetElement.nextSibling);
profButton.type = "button";
profButton.textContent = 'Show Prof Info';
profButton.id = 'profButton';
profButton.style.setProperty('margin', '2px');
profButton.addEventListener('click', function(){
	showInfoAndHideElements("Profs",1,1);
});

// create HP Info Button
var classButton = document.createElement('button');
targetElement.parentNode.insertBefore(classButton, targetElement.nextSibling);
classButton.textContent = 'Show Holiday Program';
classButton.type = "button";
classButton.id = 'HPButton';
classButton.style.setProperty('margin', '2px');
classButton.addEventListener('click', function(){showInfoAndHideElements("holiday",15,6);});
	
// create class info button with customizeable class vertical size
var classButton = document.createElement('button');
targetElement.parentNode.insertBefore(classButton, targetElement.nextSibling);
classButton.textContent = 'Show Class Info';
classButton.type = "button";
classButton.id = 'customClassButton';
classButton.style.setProperty('margin', '2px');
classButton.addEventListener('click', function(){
	var Childmainrows = parseInt(document.querySelector('#mainInput').value)+1;
	var Childsmallrows = parseInt(document.querySelector('#smallInput').value)+1;
	showInfoAndHideElements("Daysheet",Childmainrows,Childsmallrows);
});
//create input boxes
var smallInput = document.createElement('input');
targetElement.parentNode.insertBefore(smallInput,targetElement.nextSibling);
smallInput.value = 5;
smallInput.id = "smallInput";
smallInput.style.width = "20px";
var smallSpan = document.createElement('span');
targetElement.parentNode.insertBefore(smallSpan,targetElement.nextSibling);
smallSpan.innerText = "Small Pool Rows:";
smallSpan.style.setProperty('margin', '2px');
smallSpan.style.fontSize = "12pt";
var mainInput = document.createElement('input');
targetElement.parentNode.insertBefore(mainInput,targetElement.nextSibling);
mainInput.value = 8;
mainInput.id = "mainInput";
mainInput.style.width = "20px";
var mainSpan = document.createElement('span');
targetElement.parentNode.insertBefore(mainSpan,targetElement.nextSibling);
mainSpan.innerText = "Main Pool Rows:";
mainSpan.style.setProperty('margin', '2px');
mainSpan.style.fontSize = "12pt";
}

var targetElement = document.querySelector('.table_wrapper_inner > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)');
var childSpan = document.createElement('span');
targetElement.parentNode.insertBefore(childSpan, targetElement.nextSibling);
childSpan.id = "loadingInfo";
childSpan.textContent = "Loading... ";
childSpan.style.fontSize = "18pt";
childSpan.style.setProperty('margin','2px');

//attempt to extract information such as birthday(captured - Used), multi class(captured - Used), transfers(captured) - extend to new swimmers, medical Info(captured), UP/NU(captured), student notes(captured) & waitlist

var aDate = document.querySelector('.title_wrapper > h2:nth-child(1)').innerText.split(" ")[1].trim();
var attendanceTable = document.querySelector('.table_wrapper_inner > table:nth-child(2) > tbody:nth-child(1)');
var attendanceRows = attendanceTable.querySelectorAll('tr');
var rowstoCheck = attendanceRows.length;
var initialRows = rowstoCheck;
var rowRunning = 0;
var emptyRows = 0;
let classLevel = '';
attendanceRows.forEach(function(theRow){
	emptyRows = rowRunning;
	childSpan.textContent = "Loading... " + (rowRunning - emptyRows) + "/" + (initialRows - emptyRows);
	let attendanceTDs = theRow.querySelector('td');
	let attendanceTHs = theRow.querySelector('th');
	if (attendanceTDs){
		aStudentB = attendanceTDs.querySelector('b');
		if(aStudentB){
			aStudentLink = aStudentB.querySelector('a').href
			if (aStudentLink.endsWith('=4020') || aStudentLink.endsWith('=4021')){
				rowstoCheck = rowstoCheck - 1;
				rowRunning = rowRunning + 1;
			}else{
				retrieveData(aStudentLink,attendanceTDs,aDate)
			}
		}else{
			rowstoCheck = rowstoCheck - 1;
			rowRunning = rowRunning + 1;
		}
		if(attendanceTDs.nextElementSibling){
			if(attendanceTDs.nextElementSibling.querySelector('select')){
				if(classLevel == 'Hauora' || classLevel == 'Haere-Roa' || classLevel == 'Te Waihora' ){
					attendanceTDs.nextElementSibling.querySelector('select').value = 16;
				}
			}
		}
	}else if (attendanceTHs) {
		let aClassImages = attendanceTHs.querySelectorAll('img');
		let aClassImage = null;
		let imgCheck = false;
		aClassImages.forEach(function(theImage){
			let altText = theImage.getAttribute('alt');
			if (altText && altText.includes('Override')){
				aClassImage = theImage;
			}
		});
		let aClassA = attendanceTHs.querySelector('a:nth-child(2)')
		classLevel = aClassA.textContent.split(' - ')[1];
		if(aClassImage){
			let aClassLink = aClassA.href;
			retrieveClassData(aClassLink,aClassImage);
		}
		rowstoCheck = rowstoCheck - 1;
		rowRunning = rowRunning + 1;
	}else{
		rowstoCheck = rowstoCheck - 1;
		rowRunning = rowRunning + 1;
	}
});

async function retrieveClassData(classURL,classImage){
	try {
		let classResponse = await fetch(classURL);
		let classText = await classResponse.text();
		let classParser = new DOMParser();
		let classDoc = classParser.parseFromString(classText,'text/html');
		let labelSet = classDoc.querySelectorAll('label');
		let usualTeacher = "";
		labelSet.forEach(function(tempLabel){
			if (tempLabel.textContent.includes('Teacher')){
				let inputTextContent = tempLabel.nextElementSibling.textContent;
				usualTeacher = inputTextContent.split('Usual: ')[1].split(' Re')[0];
				classImage.title = 'Usual Teacher: ' + usualTeacher;
			}
		});
		
	}catch (error) {
		console.log(error);
	}
}


async function retrieveData(studentURL,sCell,aDate){
	try {
		let studentResponse = await fetch(studentURL);
		let studentText = await studentResponse.text();
		let parser = new DOMParser();
		let studentDoc = parser.parseFromString(studentText,'text/html');
		var sName = studentDoc.querySelector('[name="FirstName"]').value;
		var sNotes = studentDoc.querySelector('[name="Notes"]').value;
		let targetTH = Array.from(studentDoc.querySelectorAll('th')).find(th => th.textContent.trim().includes("Alert / Notes"));
		let medicalNotes = "";
		if (targetTH) {
			let targetRow = targetTH.parentElement;
			let nextRow = targetRow.nextElementSibling;
			if (nextRow) {
				let thirdTD = nextRow.querySelector('td:nth-child(3)');
				if (thirdTD) {
					medicalNotes = thirdTD.textContent.trim();
				}
			}
		}
		sCell.querySelector('a').setAttribute("StudentNotes",sNotes);
		sCell.querySelector('a').setAttribute("MedicalNotes",medicalNotes);
		let eRows = "";
		let selectorTest = studentDoc.querySelectorAll('tbody');
		selectorTest.forEach(function(test){
			if (test.textContent.includes("Special Price")){
				eRows = test.querySelectorAll('.first');
			}
		});
		var classCount = eRows.length;
		var sYears = studentDoc.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4) > b:nth-child(4)').textContent.split(':')[1].split('Years')[0].trim();
		sCell.querySelector('a').setAttribute("StudentAge",sYears);
		
		let allTbody = studentDoc.querySelectorAll('tbody');
		
		let attendanceInfo = null;
		for (let tbody of allTbody) {
			if (tbody.textContent.includes("Current / Future Attendance")) {
				attendanceInfo = tbody;
				break;
			}
		}

		var sLevel = studentDoc.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4) > b:nth-child(1)').textContent.trim();
		sCell.querySelector('a').setAttribute("level",sLevel);
		
		var futureAttend = attendanceInfo.querySelectorAll('tr tr:not(.first)');		
		futureAttend.forEach(function(row){
			if (row.innerText.includes('Previous')){
				var attendRow = row.nextElementSibling;
				var x = 0;
				if (!(attendRow)){
					sCell.querySelector('a').setAttribute("attendStatus","new");
				}
				while (x < 3){
					if(attendRow){
						if (attendRow.innerText && attendRow.innerText.includes('Assessment')){
							sCell.querySelector('a').setAttribute("attendStatus","new");
							x = 4
						}else if (attendRow.innerText && attendRow.innerText.length > 10 && attendRow.innerText.includes('Attended')){
							var startingCheck = isWithinXDays(aDate,attendRow.innerText.substring(0,10), 30);
							if(startingCheck){
								sCell.querySelector('a').setAttribute("attendStatus","exist");
								x = 4
							}else{
								sCell.querySelector('a').setAttribute("attendStatus","return");
								x = 4
							}
						}
						attendRow = attendRow.nextElementSibling;
					}
					x = x + 1;
				}
				x = 0
				attendRow = row.nextElementSibling;
				while (x < 10){
					if(attendRow){
						if (attendRow.innerText && attendRow.innerText.includes('LTS')){
							var slevelInfo = attendRow.innerText.split('LTS')[1].split(' ')[0];
							sCell.querySelector('a').setAttribute('lastClassLevel',slevelInfo);
							x = 11;
						}
						attendRow = attendRow.nextElementSibling;
					}
					x = x + 1;
				}
			}
		});
		
		eRows.forEach(function(classRow){
			//runs the check for if they have recently joined/transfered to this class
			classRowDate = classRow.querySelector('td:nth-child(2)').innerText;
			startingCheck = isWithinXDays(aDate, classRowDate, 6);
			if (startingCheck) {
				sCell.querySelector('a').setAttribute("transfer",classRow.querySelector('td').innerText.substr(0,11).trim());
			}
			//rowDate is start date of booking
			rowDate = new Date(classRowDate.split('/')[2],classRowDate.split('/')[1]-1,classRowDate.split('/')[0]);
			//day of the attendance page
			attDate = new Date(aDate.split('/')[2],aDate.split('/')[1]-1,aDate.split('/')[0]);
			if (rowDate > attDate && classCount > 1){
				classCount = classCount - 1;
			}else if(classRow.querySelector('td').innerText.includes("SQDHr") || classRow.querySelector('td').innerText.includes("SQDH") || classRow.querySelector('td').innerText.includes("SQDTW")){
				classCount = classCount - 1;
			}
		});
		
		sCell.querySelector('a').setAttribute("MultiClass",classCount);	
		
		sCell.querySelectorAll('img').forEach(function(studentImg){
			if(studentImg.title.includes("Birthday")){
				var doBirth = studentDoc.querySelector('#DateofBirth').value;
				studentImg.setAttribute("DOB",doBirth);
			}
			if(studentImg.title.includes("recently")){
				var sLevel = studentDoc.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4) > b:nth-child(1)').textContent.trim();
				studentImg.setAttribute("level",sLevel);
			}
			if(studentImg.title.includes("medical")){
				let sMedical = null;
				for (let tbody of allTbody) {
					if (tbody.textContent.includes("Alert / Notes")) {
						sMedical = tbody;
						break;
					}
				}
				studentImg.setAttribute("medical",sMedical);
			}
		});
		
		//if (sCell.querySelector('a').getAttribute('level').includes('Te Waihora') || sCell.querySelector('a').getAttribute('level').includes('Hauora') || sCell.querySelector('a').getAttribute('level').includes('Haere-Roa')){
		//	if(sCell.nextElementSibling.querySelector('select')){
		//		sCell.nextElementSibling.querySelector('select').value = 16;
		//	}
		//}
		rowstoCheck = rowstoCheck - 1
		rowRunning = rowRunning + 1;
		document.querySelector('#loadingInfo').textContent = "Loading... " + (rowRunning - emptyRows) + "/" + (initialRows - emptyRows);
		if(rowstoCheck <1){
			document.querySelector('#loadingInfo').style.display = "none";
			classGenerateButtons();
		}
	} catch (error) {
		console.log(error);
	}
}

}

//generates barcodes for use with Squad Attendance - ensures end membership button is always available
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/viewstudentmembershiphistory.php')){
	
	let membershipID = Global_CurrentPage_Link.split("shipID=")[1];
	let membershipEndDate = document.querySelector('div.row:nth-child(6) > div:nth-child(2) > a:nth-child(1)');
	if (!membershipEndDate) {
		// Create the new <a> element
		let newLink = document.createElement('a');
		newLink.href = `endstudentmembership.php?StudentMembershipID=${membershipID}`;
		newLink.className = 'button add_new';
		newLink.onclick = () => {}; // Optional: leave empty or define behavior

		// Create inner span structure
		let outerSpan = document.createElement('span');
		let innerSpan = document.createElement('span');
		innerSpan.textContent = 'Change End Date';

		outerSpan.appendChild(innerSpan);
		newLink.appendChild(outerSpan);

		// Append to the correct location
		let targetParent = document.querySelector('div.row:nth-child(6) > div:nth-child(2)');
		let dateSpan = document.createElement('span');
		dateSpan.textContent = targetParent.textContent
		dateSpan.style.float = "left";
		dateSpan.style.marginRight = "10px";
		targetParent.textContent = "";
		targetParent.appendChild(dateSpan);
		targetParent.appendChild(newLink);
	}	
	
	let FamilyID = document.querySelector('div.row:nth-child(1) > div:nth-child(2)').innerText;
	let targetElement = document.querySelector('div.row:nth-child(7)');
	let cardType = document.querySelector('div.row:nth-child(2) > div:nth-child(2)').innerText;
	let colour = '#FF0000';
	addEnhancedBarcodeToPage(colour,cardType,FamilyID,targetElement);
	
	// Create the button element
	var printButton = document.createElement('button');
	printButton.id = 'printableCard';
	printButton.textContent = 'Print Card';

	// Append the button to the element with the class "forms"
	var formsElement = document.querySelector('.forms');
	if (formsElement) {
		formsElement.appendChild(printButton);
	}

	document.getElementById("printableCard").addEventListener("click", function(event) {
		event.preventDefault(); // Prevent default behavior if necessary
		printCard(); // Your custom function
	}, true);
	
}

//update title of page so AHK can find it
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/updatestudentskills.php')){
	var hrefID = Global_CurrentPage_Link.split('=')[1];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Skills ' + hrefID;
}

//update title of page so AHK can find it
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/changeattendance.php')){
	var hrefID = Global_CurrentPage_Link.split('Value=')[1].split("&")[0];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Attendance ' + hrefID;
}

//update title of page so AHK can find it
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/editclass.php')){
	var hrefID = Global_CurrentPage_Link.split('ClassID=')[1].split("&")[0];
	Global_PageTitle_E.innerText = 'Canterbury Swim School SimplySwim Class ' + hrefID;
}


//log back in if logged out due to time out
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/login.php?Failed')){
	document.querySelector('.inline > input:nth-child(1)').click();
}

//info on the system settings page
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/syssettings.php')){
	let sysSetting_Info_E = document.createElement('span');
	sysSetting_Info_E.textContent = "Make sure to set this back to 14 once you are done";
	sysSetting_Info_E.style.color = "red";
	sysSetting_Info_E.style.fontWeight = "bold";
	document.querySelector('#Scheduling > div:nth-child(8) > div:nth-child(2)').appendChild(sysSetting_Info_E);
}

//add a button to Membership Renewal to select all Memberships
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/membershiprenewal.php')){
	let MembershipRenew_Inputs_E = document.querySelector('.inputs');
	let MembershipRenew_SelectAll_Div = document.createElement('div');
	let MembershipRenew_SelectAll_Button = document.createElement('button');
	MembershipRenew_SelectAll_Button.type = "button";
	MembershipRenew_SelectAll_Button.textContent = "Select All";
	MembershipRenew_SelectAll_Button.addEventListener('click', function(){
		SelectAllCheckBoxes(MembershipRenew_Inputs_E);
	});
	MembershipRenew_SelectAll_Div.appendChild(MembershipRenew_SelectAll_Button)
	MembershipRenew_Inputs_E.insertBefore(MembershipRenew_SelectAll_Div,MembershipRenew_Inputs_E.children[0]);
}

//add a button to upload POS images to the POS Item page
if(Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/editpositem.php')){
	// Create a hidden file input
	const fileInput = document.createElement('input');
	let itemID = Global_CurrentPage_Link.split('ItemID=')[1];
	if (itemID){
		GM.setValue("ProductEdit",itemID);
	}else{
		GM.getValue("ProductEdit", "").then(storedID => {
			itemID = storedID;
		});
	}
	fileInput.type = 'file';
	fileInput.accept = 'image/*';
	fileInput.style.display = 'none';

	// Handle file selection
	fileInput.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			uploadImageAndUpdateJSON(file, itemID);
		}
	});
	// Create an upload button
	const uploadButton = document.createElement('button');
	uploadButton.textContent = "Upload Image";
	uploadButton.style.display = 'block';
	uploadButton.type = "button";

	// When the button is clicked, trigger the hidden file input
	uploadButton.addEventListener('click', () => {
		fileInput.click();
	});

	// Append button to the page
	let editPOS_Options_Div = document.querySelector('div.row:nth-child(10)');
	let editPOS_newRow_Div = document.createElement('div');
	editPOS_newRow_Div.classList.add('row');
	let editPOS_newLabel_label = document.createElement('label');
	editPOS_newLabel_label.textContent = "Image";
	editPOS_rowsub_Div = document.createElement('div');
	editPOS_rowsub_Div.classList.add('inputs');
	let editPOS_ExistingPicture_Img = document.createElement('img');
	GM.getValue(itemID).then(response => {
		editPOS_ExistingPicture_Img.src = response;
	});
	editPOS_ExistingPicture_Img.style.maxWidth= '130px';
	editPOS_ExistingPicture_Img.style.maxHeight= '130px';
	editPOS_ExistingPicture_Img.id = 'ProductImage';
	
	editPOS_rowsub_Div.appendChild(editPOS_ExistingPicture_Img);
	editPOS_rowsub_Div.appendChild(uploadButton);
	
	editPOS_newRow_Div.appendChild(editPOS_newLabel_label);
	editPOS_newRow_Div.appendChild(editPOS_rowsub_Div);
	editPOS_Options_Div.after(editPOS_newRow_Div);
	document.body.appendChild(fileInput);
}

//auto put in payment amount on family payment screen
if (Global_CurrentPage_Link.startsWith('https://b1101334.simplyswim.net.au/familypayment.php')){
	let FamilyPayment_ToPay_Input = document.querySelector('[name="PaymentAmount"]');
	let FamilyPayment_Balance_Labels = document.querySelectorAll('label');
	let FamilyPayment_Balance_Value = '';
	FamilyPayment_Balance_Labels.forEach((Para_Label_E)=>{
		if (Para_Label_E.textContent.includes("Current Balance")){
			FamilyPayment_Balance_Value = Para_Label_E.nextElementSibling.childNodes[1].textContent;
			if(FamilyPayment_Balance_Value.includes('to pay')){
				FamilyPayment_Balance_Value = FamilyPayment_Balance_Value.replace(',','').replace('$ ','').replace(' to pay','');
			}else{
				FamilyPayment_Balance_Value = '';
			}
		}
	});
	FamilyPayment_ToPay_Input.setAttribute("value",FamilyPayment_Balance_Value);
}

//reload page if its 6am
setInterval(checkTimeAndReload, 30000);
checkTimeAndReload();
//check the jsonFile for any updates to Images for POS
retrieveJSON();


//functions and constants - for use by other things, no direct control themselves
const levelColours = {level1:'#FFCCFF',level2:'#FFFF99',level3:'#CCCCFF',level4:'#99CC00',level4to5:'#99CC00',level5:'#FFFF00',level5to6:'#FFFF00',level6:'#99FF66',level6plus:'#99FF66',level7:'#FFC000',level7to8:'#FFC000',level8:'#99CCFF',level9:'#FF99FF',level9plus:'#FF99FF',level10:'#66FFFF',level11:'#FFFF66',hauora:'#A9F1B7',tewaihora:'#66FFCC',aoraki:'#33CCCC',pukaki:'#33CCCC',rangitata:'#33CCCC',waitaki:'#33CCCC',waiau:'#33CCCC',private:'#FDE9D9',adult:'#FFCCFF',level2to3ua:'#FFFF99',break:'#E4DFEC',masters:'#DA9896',assessment:'#FFFFFF',specclin:'#D8CA62',babies:'#C4FCC9',kakano:'#ACFFB9',haereroa:'#66FFCC'};

const skillsoDay = ["Level 1-3: Safe Entries for parents too Level 4+: Bubble Breath","Level 1-3: Climb out solo Level 4+: Flutter kick","Level 1-3: Roll to Back Level 4+: Catch Up Free/Continous Back","Level 1-3: Jump in Rotate to back Level 4+: Hand on Wall Starts","Level 1-3: Survival Backstroke Level 4+: Stroke initiation Free/Back","Level 1-3: Monkey Monkey Level 4+: Wiggly Worm","Level 1-3: Breaststroke kick Level 4+: Breast 2-3 kick scull to breath"];

const skillsoWeek = ["Bubble and Breath","Breaststroke Kick","Backstroke Kick","Backstroke Arms","Fly Kick","Push Starts"]

const adminList = ["Matthew Hurley","Jennifer Jones","Huia Mikara"];
const raisedList = ["Te Ana Singh","Georgia Peterson","Ryan Gibbs", "Patrick Langley"];

function SelectAllCheckBoxes(Para_MemRenew_Input_E){
	let Local_CheckBoxes_EL = Para_MemRenew_Input_E.querySelectorAll('input[type="checkbox"]');
	Local_CheckBoxes_EL.forEach(function(Local_CheckBox_E){
		Local_CheckBox_E.checked = true;
	});
}

function addGlobalStyle(Para_Css_Info_S) {
	// Check if the style already exists
	let Global_Doc_ExistingStyles_EL = document.querySelectorAll('style');
	for (let LL_i = 0; LL_i < Global_Doc_ExistingStyles_EL.length; LL_i++) {
		if (Global_Doc_ExistingStyles_EL[LL_i].innerHTML.includes(Para_Css_Info_S)) {
			return; // Style already exists, do not add it again
		}
	}
	// If not, add the new style
	document.querySelector('#CustomStyle').innerHTML += Para_Css_Info_S + '\n';   
}

//does time based checks
function checkTimeAndReload() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	
	//reload page at 6am
	if (hours === 6 && minutes === 0) {
		window.location.reload();
	}
	
	//check for updates to jsonfile
	if(minutes % 5 == 0){
		retrieveJSON();
	}
}

function getColTimeSlot(info){
	const morningSlots = [
		{ max: 9 * 60 + 30, column: 1 },
		{ max: 10 * 60 + 5, column: 2 },
		{ max: 10 * 60 + 25, column: 3 },
		{ max: 10 * 60 + 50, column: 4 },
		{ max: 11 * 60 + 25, column: 5 },
		{ max: 12 * 60 + 0, column: 6 },
		{ max: 12 * 60 + 30, column: 7 },
		{ max: Infinity, column: 8 }
	];
	const afternoonSlots = [
		{ max: 16 * 60, column: 1 },
		{ max: 16 * 60 + 35, column: 2 },
		{ max: 17 * 60 + 10, column: 3 },
		{ max: 17 * 60 + 45, column: 4 },
		{ max: Infinity, column: 5 }
	];
	const timeSlots = info > 14 * 60 ? afternoonSlots : morningSlots;
	for (const slot of timeSlots) {
		if (info < slot.max) {
			return slot.column;
		}
	}
}

//for daysheet generation
function organizeGroups(inputArray,weekday,type) {
	let newMainArray = [];
	let tempArray = [];
	let oldInstructor = '';
	let prevTimeSlot = '';
	let prevColumn = '';
	let prevLevel = '';
	inputArray.forEach(function(item) {
		let groupArray = [];
		// Parse the item details
		let groupInfo = item.split(" / ")[0];
		let swimmers = item.split(" / ")[1];
		let swimmersArray = swimmers.split(" - ");
		let instructor = groupInfo.split(" - ")[0];
		if(instructor.includes("Ziyu")){
			instructor = "#Ziyu";
		}
		let timeSlot = groupInfo.split(" - ")[1];
		let arvo = timeSlot.substr(timeSlot.length - 2);
		let pureTime = timeSlot.substr(0, timeSlot.length - 2).split(":");
		// Adjust time for PM
		if (arvo === "pm" && Number.parseInt(pureTime[0]) < 12) {
			pureTime[0] = Number.parseInt(pureTime[0]) + 12;
		}
		if(!(weekday == "Saturday" || weekday == "Sunday") && pureTime[0]<15 && type == "Daysheet"){
			return;
		}
		if(!(weekday == "Saturday" || weekday == "Sunday") && pureTime[0]>14 && type == "holiday"){
			return;
		}
		// Normalize timeSlot
		if (timeSlot.includes("09:") || timeSlot.includes("08:")) {
			timeSlot = timeSlot.substring(1);
		}
		let timeSlotH = Number.parseInt(pureTime[0]) * 60 + Number.parseInt(pureTime[1]);  
		// Determine column based on timeSlot
		let column = getColTimeSlot(timeSlotH);
		if (type == "holiday"){
			column = column - 5;
		}
		if (prevLevel.includes('11')) {
			column -= 1;
		}
		let lane = groupInfo.split(" - ")[2];
		let level = groupInfo.split(" - ")[3];
		prevLevel = level;
		swimmersArray.shift();
		// Assign group details
		if (level.includes('Break') || level.includes('Aoraki') || level.includes('Pukaki') || 
			level.includes('Waitaki') || level.includes('Waiau') || level.includes('Rangitata') || level.includes('Assessment')) {
			groupArray.push(timeSlot + " - " + level);
		} else {
			groupArray.push(timeSlot + " - " + level + " - L" + lane.split(" ")[1]);
		}
		// Add swimmers to group array
		swimmersArray.forEach(function(swimmer) {
			groupArray.push(swimmer);
		});
		groupArray.sort();
		if (instructor !== oldInstructor) {
			prevLevel = '0';
			newMainArray.push(tempArray);
			tempArray = [];
			tempArray.push([instructor, groupArray.length, column]);		 
			for (let i = tempArray.length; i < column; i++) {	
				tempArray.push([""]);
			}
			tempArray.push(groupArray);
		} else if (prevTimeSlot === timeSlot) {
			let temperArray = tempArray.pop();
			groupArray.forEach(function(item) {
				temperArray.push(item);
			});
			if (tempArray[0][1] < temperArray.length) {
				tempArray[0][1] = temperArray.length;
			}
			tempArray.push(temperArray);
		} else {
			if (tempArray[0][1] < groupArray.length) {
				tempArray[0][1] = groupArray.length;
			}
			if (tempArray[0][2] < column) {
				tempArray[0][2] = column;
			}
			for (let i = tempArray.length; i < column; i++) {	
				tempArray.push([""]);
			}
			tempArray.push(groupArray);
		}
		prevTimeSlot = timeSlot;
		prevColumn = column;
		oldInstructor = instructor;
	});
	newMainArray.push(tempArray);
	// Remove the initial empty array added before the first instructor group
	newMainArray.shift();
	return newMainArray;
}

function findSkilloDay(dateInfo){
	doW = dateInfo.getDay();
	woY = dateInfo.getWeekNumber();
	return skillsoDay[(doW + woY)%7];
}

Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
};

function isWithinXDays(date1, date2, dayCount) {
	// Parse the dates from the format DD/MM/YYYY
	let [day1, month1, year1] = date1.split('/').map(Number);
	let [day2, month2, year2] = date2.split('/').map(Number);
	
	// Create Date objects
	let firstDate = new Date(year1, month1 - 1, day1); // Months are 0-indexed in JavaScript
	let secondDate = new Date(year2, month2 - 1, day2);
	
	// Calculate the difference in time
	let timeDifference = firstDate - secondDate;
	
	// Convert the difference in time to days
	let dayDifference = timeDifference / (1000 * 60 * 60 * 24);
	
	// Check if the second date is within dayCount days of the first date
	return dayDifference >= 0 && dayDifference <= dayCount;
}

// Function to find the next sibling text node
function getNextTextNode(element) {
	let currentNode = element.nextSibling;
	while (currentNode) {
		if (currentNode.nodeType === 3 && currentNode.textContent.trim() !== '') {
			return currentNode; // Found a non-empty text node
		}
		currentNode = currentNode.nextSibling;
	}
	return null; // No valid text node found
}

// Function to hide elements based on a given selector
function hideElements(selector) {
	var elementsToHide = document.querySelectorAll(selector);
	elementsToHide.forEach(function(element) {
		element.style.display = 'none';  // Adjust the display property as needed
	});
}

// Function to check if a given day string is a weekday (Monday to Friday)
function isWeekday(dayString) {
	var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	return weekdays.includes(dayString);
}

//for Scrolling the class information to the correct time given a day of the week
function scrollClassDown(Para_Document_HTML,Para_iFrame_Check) {
	let Func_DayName_String = Para_Document_HTML.querySelector('.dhx_cal_date').textContent.trim().split(' ')[0];
	
	if (!Para_iFrame_Check) {
		if (isWeekday(Func_DayName_String)) {
			Para_Document_HTML.querySelector('div.dhx_scale_hour:nth-child(9)').scrollIntoView();
		}else{
			Para_Document_HTML.querySelector('div.dhx_scale_hour:nth-child(3)').scrollIntoView();
		}
	}else{
		let Func_scrollableContainer_E = Para_Document_HTML.querySelector('.dhx_cal_data');
		if (isWeekday(Func_DayName_String)) {
			Func_scrollableContainer_E.scrollTop = Para_Document_HTML.querySelector('div.dhx_scale_hour:nth-child(9)').offsetTop;
		}else{
			Func_scrollableContainer_E.scrollTop = Para_Document_HTML.querySelector('div.dhx_scale_hour:nth-child(3)').offsetTop;
		}
	}
}

function resizeClassesElements(Para_Document_HTML,Para_iFrame_Check){
	var activeElements = Para_Document_HTML.querySelectorAll('.active')[0];
	Para_Document_HTML.querySelectorAll('.dhx_scale_holder').forEach(function(element, index) {element.style.height = '5200px';});
	Para_Document_HTML.querySelectorAll('.dhx_scale_holder_now').forEach(function(element, index) {element.style.height = '5200px';});
	Para_Document_HTML.querySelectorAll('.dhx_cal_event').forEach(function(element) {
		var heightCheck = parseFloat(element.style.height);			
		var resizedCheck = 0;
		resizedCheck = element.getAttribute("resized");
		if (resizedCheck < 1){
			element.style.height = heightCheck*2 + 'px';
			element.style.top = (parseFloat(element.style.top) * 2-1 )+'px';
			element.setAttribute("resized","1");
		}
		var classLink = element.querySelector('.dhx_title a');
		retrieveWaitlist(classLink.href,element);
	});
	Para_Document_HTML.querySelectorAll('.dhx_scale_hour').forEach(function(element) {
		element.style.height = 399+ 'px';
	});
	Para_Document_HTML.querySelectorAll('.dhx_title a').forEach(function(element) {
		element.textContent = element.textContent.replace('07:','7:');
		element.textContent = element.textContent.replace('08:','8:');
		element.textContent = element.textContent.replace('09:','9:');
		element.textContent = element.textContent.replace('15:','3:');
		element.textContent = element.textContent.replace('16:','4:');
		element.textContent = element.textContent.replace('17:','5:');
		element.textContent = element.textContent.replace('18:','6:');
	});
	Para_Document_HTML.querySelectorAll('.dhx_body').forEach(function(element) {
		let heightCheck = parseFloat(element.parentNode.style.height);
		element.innerHTML = element.innerHTML.replace(/, /g,'<br>');
		element.style.fontSize = '10pt';
		if (element.getAttribute("resized") < 1){
			element.style.height = heightCheck-30 + 'px';
		}
		element.setAttribute("resized","1");
	});
	
	if (activeElements.getAttribute('name')==='unit_tab') {
		// Apply styles if the active element is a unit_tab
		var calHeader = Para_Document_HTML.querySelectorAll('.dhx_cal_header')[0];
		var scaleWidth = calHeader.offsetWidth/10;
		var halfWidth = calHeader.offsetWidth/28;
		var splitGroup = 0;
		var elementList = Para_Document_HTML.querySelectorAll('.dhx_cal_event');
		elementList.forEach(function(element,index) {
			var elementTop = parseFloat(element.style.top);
			var elementParent = element.parentElement;
			if(index > 0){
				var prevElementParent = elementList[index - 1].parentElement;
				var prevElementTop = parseFloat(elementList[index - 1].style.top);
				if (elementTop === prevElementTop && prevElementParent === elementParent) {
					splitGroup = 2;
				}
			}
			if (index<elementList.length - 1){
				var nextElementParent = elementList[index + 1].parentElement;
				var nextElementTop = parseFloat(elementList[index + 1].style.top);
				if (elementTop === nextElementTop && nextElementParent === elementParent) {
					splitGroup = 1;
				}
			}
			if(splitGroup === 1){
				element.style.width = scaleWidth/2 +'px';
				element.style.left = '0px';
				splitGroup = 0;
			} else if (splitGroup === 2){
				element.style.width = scaleWidth/2 +'px';
				element.style.left = scaleWidth/2+'px';
				splitGroup = 0;
			} else {
			element.style.width = scaleWidth + 'px';
			element.classList.add('fullWidth');
			}
		});
		Para_Document_HTML.querySelectorAll('.dhx_header').forEach(function(element) {
			if(parseFloat(element.parentElement.style.width) < scaleWidth/2+5){
				element.style.width = scaleWidth/2 -4+'px';
				if(splitGroup){
					element.style.left = '0px';
					splitGroup = false;
				} else{
					element.style.left = scaleWidth/2-4+'px';
					splitGroup = true;
				}
			}else{
				element.classList.add('fullWidth');
				element.style.width = scaleWidth -4+ 'px';
			}
		});
		Para_Document_HTML.querySelectorAll('.dhx_body').forEach(function(element) {
			if(parseFloat(element.parentElement.style.width) < scaleWidth/2+5){
				element.style.width = scaleWidth/2 -12+'px';
				if(splitGroup){
					element.style.left = '0px';
					splitGroup = false;
				} else{
					element.style.left = scaleWidth/2-12+'px';
					splitGroup = true;
				}
			}else{
				element.classList.add('fullWidth');
				element.style.width = scaleWidth - 12 + 'px';
			}
			
		});
		Para_Document_HTML.querySelectorAll('.dhx_footer').forEach(function(element) {
			if(parseFloat(element.parentElement.style.width) < scaleWidth/2+5){
				element.style.width = scaleWidth/2-4 +'px';
				if(splitGroup){
					element.style.left = '0px';
					splitGroup = false;
				} else{
					element.style.left = scaleWidth/2-4+'px';
					splitGroup = true;
				}
			}else{
				element.classList.add('fullWidth');
				element.style.width = scaleWidth-4+ 'px';
			}
		});
		Para_Document_HTML.querySelectorAll('.dhx_title').forEach(function(element) {
			if(parseFloat(element.parentElement.style.width) < scaleWidth/2+5){
				element.style.width = (scaleWidth-4)/2 +'px';
				if(splitGroup){
					element.style.left = '0px';
					splitGroup = false;
				} else{
					element.style.left = (scaleWidth-4)/2+'px';
					splitGroup = true;
				}
			}else{
				element.classList.add('fullWidth');
				element.style.width = scaleWidth -2+ 'px';
			}
		});
		
		
		let scaleBars = Para_Document_HTML.querySelectorAll('.dhx_scale_bar');
		var leftage = 0;
		scaleBars.forEach(function(element, index) {
			if (index >= 6 && index <= 9) {
				element.style.display = 'none';
				leftage = leftage - scaleWidth;
				
			}
			if(index<14){
			element.style.width = scaleWidth + 'px';
			element.style.left = leftage + 'px';
			leftage = leftage + scaleWidth + 1;
			}
			if(index >9 && index<14){
				element.textContent = element.textContent.replace('Lane 1', 'Small ');
			}
		});
		var scaleHolder = Para_Document_HTML.querySelectorAll('.dhx_scale_holder');
		var leftage = 51;
		scaleHolder.forEach(function(element, index) {
			if (index >= 6 && index <= 9) {
				element.style.display = 'none';
				leftage = leftage - scaleWidth;
			}
			if(index<14){
			element.style.left = leftage + 'px';
			leftage = leftage + scaleWidth + 1;
			element.style.width = scaleWidth + 'px';
			}
		});
		
		// Function to get elements with specific background color and their parent nodes
		function getElementsByBackgroundColor(color) {
			var allElements = Para_Document_HTML.querySelectorAll('*');
			var matchedParents = [];
			allElements.forEach(function(element) {
				var computedStyle = window.getComputedStyle(element);
				// Check if the background color matches the specified color
				if (computedStyle.backgroundColor === color) {
					// Add the parent node to the matchedParents array
					matchedParents.push(element.parentNode);
				}
			});
			return matchedParents;
		}
		var squadElementsParents = getElementsByBackgroundColor('rgb(51, 204, 204)');
		squadElementsParents.forEach(function(parentElement) {
			parentElement.style.zIndex = 0;
		});
	}
}

async function retrieveWaitlist(classURL,element){
	let classResponse = await fetch(classURL);
	let classText = await classResponse.text();
	let parser = new DOMParser();
	let classDoc = parser.parseFromString(classText,'text/html');
	var waitListRequestsBody = classDoc.querySelector('div.section:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(1) > fieldset:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1)');
	var waitListRequests = waitListRequestsBody.querySelectorAll('.first');
	waitListRequests.forEach(function(nameRow){
		studentInfo = nameRow.querySelector('td a').textContent;
		if (!element.querySelector('.dhx_body').innerHTML.includes(studentInfo)){
			element.querySelector('.dhx_body').innerHTML += "<i>" + "WL:" + studentInfo + "</i><br>";
		}
	});
}

// Function to inject CSS into the iframe
function injectCSSIntoIframe(iframeId, cssRules) {
	// Get the iframe element
	let iframe = document.getElementById('ifm');
	// Ensure the iframe and its contentDocument are accessible
	if (iframe && iframe.contentDocument) {
		let styleElement = document.createElement('style');
		styleElement.type = 'text/css';
		styleElement.innerHTML = cssRules;
		iframe.contentDocument.head.appendChild(styleElement);
	}
}'	'

// Function to hide all elements on the page
function hideAllElements() {
	document.querySelectorAll('*').forEach(element => {
		element.style.display = 'none';
	});
}

// Function to extract the number from the specified text
function extractNumberFromText(text) {
	// Use a regular expression to match and extract the number
	let match = text.match(/\(#(\d+)\)/);
	if (match && match[1]) {
		return match[1]; // Return the extracted number
	}
	return null; // Return null if no number is found
}


function generateEnhancedBarcodeImage(colour,cardType,FamilyID, options, callback) {
	const canvas = document.createElement('canvas');
	const canvasCode = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	let value = '';
	if (colour == '#FF0000') {
		if (FamilyID.split(' ').length == 2){
			FamilyIDShort = FamilyID.split(' ')[0].substring(0,3) + FamilyID.split(' ')[1].substring(0,3);
		}else{
			FamilyIDShort = FamilyID.split(' ')[0].substring(0,3) + FamilyID.split(' ')[1].substring(0,1) + FamilyID.split(' ')[2].substring(0,2);
		}
		value = 'SQ-'+FamilyIDShort+'=';
		//'-'+cardType.substring(0,3)+ - to add squad information
	}else{
		value = 'CC-'+FamilyID+'-'+cardType+'=';
	}
	// Set initial canvas size
	canvas.width = 1075;
	canvas.height = 650;
	// Generate the barcode on the canvas
	JsBarcode(canvasCode, value, options);
	ctx.fillStyle = colour;
	ctx.fillRect(0, 0, 1075, 650);
	ctx.fillStyle = 'black';
	if(colour == '#FF0000'){
		ctx.font = "108px Arial";
		if (FamilyID.split(' ').length == 2){
			ctx.fillText(FamilyID.split(' ')[0], 50, 150);
			ctx.fillText(FamilyID.split(' ')[1], 50, 260);
		}else{
			ctx.fillText(FamilyID.split(' ')[0], 50, 150);
			ctx.fillText(FamilyID.split(' ')[1] + ' ' + FamilyID.split(' ')[2], 50, 260);
		}
	
		let tempImg = new Image();
		let tempImgTwo = new Image();
		tempImg.src = 'https://i.postimg.cc/LX5908LK/Waitaha-2-png.png';
		tempImgTwo.src = 'https://i.postimg.cc/R0SmYZKC/Waitaha-Text.png';
		function loadImage(img) {
			return new Promise((resolve) => {
				img.onload = () => resolve(img);
			});
		}
		Promise.all([loadImage(tempImg), loadImage(tempImgTwo)]).then(([loadedImg, loadedImgTwo]) => {
			ctx.drawImage(tempImgTwo, 100, 350, 400, 100);
			ctx.drawImage(tempImg, 620, 30, 390, 390);
			ctx.drawImage(canvasCode, 70, 470);
			const imgData = canvas.toDataURL('image/png');
			const img = new Image();
			img.onload = function() {
				callback(img);
			};
			img.src = imgData;
			img.style.width = "350px";
			img.style.height = "200px";
			img.id = "scanCard";
		});
	}else{
		GM.getValue('ID' + FamilyID).then(function(cardName){
			ctx.font = '92px Arial';
			ctx.fillText(cardName.split(' ')[0], 50, 150);
			ctx.fillText(cardName.split(' ')[1], 50, 260);
			ctx.fillStyle = 'black';
			ctx.font = '48px Arial';
			if (cardType.includes("Sen")){
				cardType = "Senior/Student";
			}
			if (cardType.includes("Mel")){
				cardType = "Mellow Mondays";
			}
			if (cardType.includes("Par")){
				cardType = "Parent & Preschooler";
			}
			if (cardType.includes("Mas")){
				cardType = "Masters";
			}
			if (cardType.includes("Adu")){
				cardType = "Adult";
			}
			if (cardType.includes("Chi")){
				cardType = "Child";
			}
			passType = document.querySelector('.forms > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(3)').innerText;
			if (passType.includes('3 Month')){
				ctx.fillText(cardType + ' 3 Month Pass', 100, 450);
			}else if (passType.includes('6 Month')){
				ctx.fillText(cardType + ' 6 Month Pass', 100, 450);
			}else{
				ctx.fillText(cardType + ' 10 Swim Pass', 100, 450);
			}
	
			let tempImg = new Image();
			tempImg.src = 'https://i.postimg.cc/8567vGQ4/CSS-logo-full-res.png';
			tempImg.onload = function() {
				ctx.drawImage(tempImg, 570, 5, 500, 392);
				ctx.drawImage(canvasCode, 70, 470);
				const imgData = canvas.toDataURL('image/png');
				const img = new Image();
				img.onload = function() {
					callback(img);
				};
				img.src = imgData;
				img.id = 'scanCard';
				img.style.width = "350px";
				img.style.height = "200px";
			};
		}); 
	}
}

function addEnhancedBarcodeToPage(colour,cardType,FamilyID,targetElement) {
	if (targetElement) {
		const barcodeContainer = document.createElement('div');
		barcodeContainer.className = 'row';
		const label = document.createElement('label');
		label.textContent = 'Barcode';
		barcodeContainer.appendChild(label);
		const br = document.createElement('br');
		barcodeContainer.appendChild(br);
		const inputsDiv = document.createElement('div');
		inputsDiv.className = 'inputs';
		const barcodeOptions = {
			format: 'CODE128',
			displayValue: true,
			width: 5,
			height: 100,
			fontSize: 0,
			background: colour
		};
		generateEnhancedBarcodeImage(colour,cardType,FamilyID, barcodeOptions, function(img) {
			inputsDiv.appendChild(img);
			barcodeContainer.appendChild(inputsDiv);
			// Insert the barcode container after the target element
			targetElement.parentNode.insertBefore(barcodeContainer, targetElement.nextSibling);
		});
	}
}

//prints the squad/membership Cards
function printCard(zEvent){
	let allElements = document.querySelectorAll('*');
	const scanCard = document.getElementById('scanCard');
	allElements.forEach(function(element){
		element.removeAttribute('style');
		element.className ='';
		element.id = '';
		element.style.padding = '';
		element.style.border = '';
		element.style.background = 'none';
		if(element !== scanCard && !element.contains(scanCard)){
			element.style.display = 'none';
		}
	});
	scanCard.style.padding = '110px';
	window.print();
	location.reload();
}

function formatDate(inputDate) {
    // Parse the input string into a Date object
    let [datePart, timePart] = inputDate.split(' '); // Separate the date and time
    let [year, month, day] = datePart.split('-'); // Split the date into parts
    let [hours, minutes] = timePart.split(':'); // Split the time into parts

    // Convert hours to 12-hour format and determine AM/PM
    let period = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format (12 remains 12, 0 becomes 12)

    // Format the new string
    let formattedDate = `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
    return formattedDate;
}


// Function to upload image and update JSON file
function uploadImageAndUpdateJSON(imageFile, product) {
  const imageName = imageFile.name;
  const imagePath = `${FILE_PATH}/${imageName}`;
  const fullPath = `https://raw.githubusercontent.com/DeadlyGenga/SimplySwim/refs/heads/main/${imagePath}`;
  // Convert image to Base64
  const reader = new FileReader();
  reader.onload = function () {
    const base64Image = reader.result.split(',')[1];  // Remove the data URL part
    // Upload image to GitHub
	updateJSON(fullPath, product);
	let local_Image_E = document.querySelector('#ProductImage')
	local_Image_E.src = 'https://raw.githubusercontent.com/DeadlyGenga/SimplySwim/refs/heads/main/images/Loading%20Icon.png';
	setTimeout(() => {
		local_Image_E.src = fullPath;
		local_Image_E.onerror = function(){
			local_Image_E.src = 'https://raw.githubusercontent.com/DeadlyGenga/SimplySwim/refs/heads/main/images/UploadFail.png';
		}
	},5000);
    uploadFileToGitHub(imagePath, base64Image)
  };
  reader.readAsDataURL(imageFile);
}

// Function to upload a file to GitHub
function uploadFileToGitHub(filePath, content) {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    // Step 1: Check if the file exists
    fetch(url, {
      headers: { Authorization: `token ${PRIVATE_TOKEN}` }
    })
      .then(response => {
        if (response.status === 404) {
          return { sha: null }; // File doesn't exist, no SHA needed
        }
        return response.json();
      })
      .then(fileData => {
        const sha = fileData.sha || null; // Get SHA if file exists

        const data = {
          message: `Upload ${filePath}`,
          content: content, // Base64 encoded content
          ...(sha && { sha }) // Include SHA only if updating an existing file
        };

        return fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${PRIVATE_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });
      })
      .then(response => response.json())
      .then(result => {
        if (result.sha) {
          console.log("✅ Upload successful:", result);
          resolve(result);
        } else {
          reject("❌ Upload failed: No SHA returned");
        }
      })
      .catch(error => {
        console.error("❌ Upload error:", error);
        reject(error);
      });
  });
}

//updates the json file in the github with image url and item id of new upload
function updateJSON(filePath,productID){
	const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${JSON_FILE}`;
// Step 1: Fetch Existing File Data
	fetch(GITHUB_API_URL, {
		headers: { Authorization: `token ${PRIVATE_TOKEN}` }
	})
  .then(response => response.json())
  .then(fileData => {
    const decodedContent = atob(fileData.content); // Decode base64 content
    let jsonData = JSON.parse(decodedContent); // Convert to JSON object
    // Step 2: Check if the ProductID exists and replace or add the image
    const imageIndex = jsonData.images.findIndex(image => image.ProductID === productID);
    if (imageIndex !== -1) {
      // ProductID exists, replace the image URL
      jsonData.images[imageIndex].url = filePath;
    } else {
      // ProductID doesn't exist, push the new image
      jsonData.images.push({ url: filePath, ProductID: productID });
    }
    // Step 3: Encode and Upload New JSON Data
    const updatedContent = btoa(JSON.stringify(jsonData, null, 2)); // Convert back to base64
    return fetch(GITHUB_API_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${PRIVATE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Updated ImageLink.json",
        content: updatedContent,
        sha: fileData.sha // Required to update the file
      })
    });
  })
  .then(response => response.json())
  .then(data => console.log("File updated successfully:", data))
  .catch(error => console.error("Error updating file:", error));
}



function retrieveJSON(){
	let jsonFilePath = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${JSON_FILE}`;
	fetch(jsonFilePath, {
		headers: { Authorization: `token ${PRIVATE_TOKEN}` }
	})
  .then(response => response.json())
  .then(fileData => {
    const decodedContent = atob(fileData.content); // Decode base64 content
    let jsonData = JSON.parse(decodedContent);
	jsonData.images.forEach(Image => {
		GM.setValue(Image.ProductID,Image.url);
	});
  })
}


function addDeleteButton(el) {
    el.style.position = 'relative';

    const btn = document.createElement("span");
    btn.textContent = "×";
    btn.className = "delete-btn";
	
	if (el.tagName == "TABLE") {
		el.classList.add('deleteableTable');
		btn.title = ('Click to delete class');
	}else if(el.tagName == "TR"){
		el.classList.add('deleteableTR');
		btn.classList.add('delete-btn-tr');
		btn.title = ('Click to delete row');
	}

    btn.addEventListener("click", (e) => {
        el.remove();
    });

    el.appendChild(btn);
}

function addMoveButton(el){	
	const mBtn = document.createElement('span');
	mBtn.textContent = '➕';
	mBtn.className = 'move-btn';
	
	
	if (el.tagName == "TABLE") {
		mBtn.title = "Click and drag to move class\nCtrl+click to copy class";
	}else if(el.tagName == "TR"){
		mBtn.classList.add('move-btn-tr');
		mBtn.title = "Click and drag to move row\nCtrl+click to copy row";
	}

    el.appendChild(mBtn);
}

async function retrieveConfig(){
	try {
		let configResponse = await fetch("https://b1101334.simplyswim.net.au/syssettings.php");
		let configText = await configResponse.text();
		let configParser = new DOMParser();
		let configDoc = configParser.parseFromString(configText,'text/html');
		let makeUpDays = configDoc.querySelector('#MUPDAYS').value;
		return makeUpDays;
	}catch (error) {
		console.log(error);
	}
}