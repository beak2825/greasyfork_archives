// ==UserScript==
// @name        ServiceNow Quicklog
// @match       https://aut.service-now.com/new_call.do*
// @match       https://aut.service-now.com/sc_task.do*
// @match       https://aut.service-now.com/incident.do*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @version     4
// @description Stores data in script from New Call, and autopopulates the resulting task's fields.
// @namespace https://greasyfork.org/users/453161
// @downloadURL https://update.greasyfork.org/scripts/414204/ServiceNow%20Quicklog.user.js
// @updateURL https://update.greasyfork.org/scripts/414204/ServiceNow%20Quicklog.meta.js
// ==/UserScript==

main();

/*
Main method for this script.
Checks what page user is on and runs the appropriate functions.
*/
function main()
{
    var url = document.URL;
    if (url.includes("new_call.do")){
        console.log("<TAMPERMONKEY> Currently on New Call page")
        newCall();
    } else if(url.includes("sc_task.do") || url.includes("incident.do")){
        console.log("<TAMPERMONKEY> Currently on SCTASK/INCIDENT page");
        quicklog();
    }
}

/*
Function to add HTML elements to new call page.
These allow user to select template to apply and initiate quicklog.
*/
function newCall()
{
    console.log("<TAMPERMONKEY> Adding Quicklog options to New Call page.")

    // Create a submit HTML button to action the script based on selected template.
    var template_submit_bottom = document.createElement("button");
    template_submit_bottom.className = "form_action_button header  action_context btn btn-default";
    template_submit_bottom.id = "template-submit-bottom";
    template_submit_bottom.innerHTML = "Submit";
    template_submit_bottom.setAttribute("type", "button");
    template_submit_bottom.style.display = "none";

    // Insert the select element and the button into the webpage
    document.getElementById("sysverb_insert_bottom").insertAdjacentElement("afterend", template_submit_bottom);

    // Setup a listener for the button, so when it is clicked the storeInfo function is called.
    document.getElementById("template-submit-bottom").addEventListener("click", storeInfo, false);

    // Create a submit HTML button to action the script based on selected template.
    var template_submit_top = document.createElement("button");
    template_submit_top.className = "form_action_button header  action_context btn btn-default";
    template_submit_top.id = "template-submit-top";
    template_submit_top.innerHTML = "Submit";
    template_submit_top.setAttribute("type", "button");
    template_submit_top.style.display = "none";

    // Insert the select element and the button into the webpage
    document.getElementById("sysverb_insert").insertAdjacentElement("afterend", template_submit_top);

    // Setup a listener for the button, so when it is clicked the storeInfo function is called.
    document.getElementById("template-submit-top").addEventListener("click", storeInfo, false);

    // Create checkbox element to enable Quicklog options
    var quicklogCheckbox = document.createElement("input");
    quicklogCheckbox.id = "quicklog-checkbox";
    quicklogCheckbox.type = "checkbox";
    quicklogCheckbox.value = 1;

    // Insert into page and add event listener
    document.getElementById("element.new_call.u_work_notes").insertAdjacentElement("afterend", encapsulateQuicklogElement("Quicklog", quicklogCheckbox, " col-xs-12 col-md-1_5 col-lg-2 control-label"));
    document.getElementById("quicklog-checkbox").addEventListener("change", quicklogChecked);

    // Container for Quicklog options
    var qlRow = document.createElement("div");
    qlRow.className = "row";
    qlRow.id = "quicklog-container";
    qlRow.style.display = "none";

    // 2 columns in this row. Initialise them.
    var leftColumnDiv = document.createElement("div");
    var rightColumnDiv = document.createElement("div");
    leftColumnDiv.className = "vsplit col-sm-6";
    rightColumnDiv.className = "vsplit col-sm-6";

    // Create a select HTML element. Will provide template options
    var templateElement = document.createElement("select");
    templateElement.id = "quicklog-template-chooser";
    templateElement.className = "form-control";
    populateTemplateSelect(templateElement);
    leftColumnDiv.appendChild(encapsulateQuicklogElement("Quicklog Template", templateElement));

    // Create disabled input element. Will update on change of templateElement with appropriate category
    var categoryElement = document.createElement("input");
    categoryElement.className = "form-control disabled";
    categoryElement.id = "quicklog-category";
    categoryElement.setAttribute("readonly", "readonly");
    leftColumnDiv.appendChild(encapsulateQuicklogElement("Category", categoryElement));

    // Create disabled input element. Will update on change of templateElement with appropriate subcategory
    var subcategoryElement = document.createElement("input");
    subcategoryElement.className = "form-control disabled";
    subcategoryElement.id = "quicklog-subcategory";
    subcategoryElement.setAttribute("readonly", "readonly");
    leftColumnDiv.appendChild(encapsulateQuicklogElement("Subcategory", subcategoryElement));

    // Create input field for Effort. Value 5 by default. Max 99.
    var effortContainer = document.createElement("div");
    effortContainer.className = "input-group input-group-1";
    var minutesSpan = document.createElement("span");
    minutesSpan.className = "input-group-addon";
    minutesSpan.innerHTML = "Minutes";
    effortContainer.appendChild(minutesSpan);
    var effortElement = document.createElement("input");
    effortElement.id = "quicklog-effort";
    effortElement.type = "text";
    effortElement.value = "5";
    effortElement.className = "form-control accessibility_no_tooltip";
    effortElement.setAttribute("maxlength", 2);
    effortElement.style = "text-align: center";
    effortContainer.appendChild(effortElement);
    rightColumnDiv.appendChild(encapsulateQuicklogElement("Effort on Task (minutes)", effortContainer));

    // Create checkbox input element for copy to close notes. Checked by default.
    var closeNotesElement = document.createElement("input");
    closeNotesElement.id = "quicklog-copy-closenotes";
    closeNotesElement.type = "checkbox";
    closeNotesElement.setAttribute("checked", "checked");
    closeNotesElement.value = 1;
    rightColumnDiv.appendChild(encapsulateQuicklogElement("Copy Work Notes to Close Notes", closeNotesElement));

    // Create textarea for close notes. Readonly by default
    var closeNotesTextArea = document.createElement("textarea");
    closeNotesTextArea.id = "quicklog-closenotes";
    closeNotesTextArea.className = "form-control";
    closeNotesTextArea.style = "width: 100%; overflow: hidden; overflow-wrap: break-word; resize: none; height: 50px;";
    closeNotesTextArea.setAttribute("readonly", "readonly");
    rightColumnDiv.appendChild(encapsulateQuicklogElement("Close Notes", closeNotesTextArea));

    // Add column divs to row
    qlRow.appendChild(leftColumnDiv);
    qlRow.appendChild(rightColumnDiv);

    // Insert row div into webpage
    document.getElementById("45f05a65eb000100a04d4910f206fef2").insertAdjacentElement("beforeend", qlRow);

    // Add listener for copy close notes checkbox
    document.getElementById("quicklog-copy-closenotes").addEventListener("change", copyCloseNotesChecked);

    // Add listener for quicklog-template-chooser select element
    document.getElementById("quicklog-template-chooser").addEventListener("change", templateSelected);
}

/*
Function to encapsulate DOM element in appropriate divs to match ServiceNow formatting.
Used in newCall function.
Arg 0 is label text and Arg 1 is element to encapsulate. These are compulsory.
Arg 2 is custom class for labelSpan. This is optional and only used once for QuicklogCheckbox.
*/
function encapsulateQuicklogElement()
{
    // Main div container for element. This element is returned by function.
    var containerDiv = document.createElement("div");
    containerDiv.className = "form-group";

    // Span element used as label.
    var labelSpan = document.createElement("span");
    labelSpan.className = " col-xs-12 col-md-3 col-lg-4 control-label";
    // If arg 2 is specified, set class to that.
    if (arguments[2] != null){
        labelSpan.className = arguments[2];
    }
    labelSpan.innerHTML = arguments[0];
    containerDiv.appendChild(labelSpan);

    // Container for the particular quicklog element.
    var elementDiv = document.createElement("div");
    elementDiv.className = "col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls";

    // Append elements to nest and return containerDiv
    elementDiv.appendChild(arguments[1]);
    containerDiv.appendChild(elementDiv);
    return containerDiv;
}

/*
Function to populate the template_element select DOM object.
This object lets users select a template for categories to apply to the new call.
Function takes arg 0 as template_element DOM object.
*/
function populateTemplateSelect()
{
    var templateElement = arguments[0];

    // Append an empty option node to work as a default placeholder.
    var placeholder = document.createElement("option");
    placeholder.innerHTML = "-- Select a Quicklog Template --";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.value = "";
    templateElement.appendChild(placeholder);

    // Populate the select HTML element with option nodes.
    addOption("Account Registration", "IMS", "Account Registration", templateElement);
    addOption("Arion", "Arion", "Access/Permissions", templateElement);
    //addOption("Blackboard", "Blackboard", "Software/Application", templateElement);
    //addOption("Blackboard Collaborate", "Blackboard", "Blackboard Collaborate", templateElement);
    addOption("Canvas - Access/Permissions", "Canvas", "Access/Permissions", templateElement);
    addOption("Canvas - Assignments", "Canvas", "Assignments", templateElement);
    addOption("Canvas - Courses", "Canvas", "Courses", templateElement);
    addOption("Canvas - Other", "Canvas", "Other", templateElement);
    addOption("IMS - User Accounts", "IMS", "User Accounts", templateElement);
    addOption("EndNote", "EndNote", "Software/Application", templateElement);
    addOption("MS Teams", "Mstreams", "Software/Application", templateElement);
    addOption("MyPC", "My PC", "Software/application", templateElement);
    addOption("Office365 Assistance", "Office 365", "Software/Application", templateElement);
    addOption("Other Software Assistance", "Other Software", "Software/Application", templateElement);
    //addOption("Panopto", "Panopto", "Software/Application", templateElement);
    addOption("Print Assistance - Computer", "Print - Software", "Software/Application", templateElement);
    addOption("Print/Scan Assistance - Printer", "Printer", "Other", templateElement);
    addOption("Printer - Paper Jam", "Printer", "Hardware", templateElement);
    addOption("Remote Access", "RASS", "Remote Access", templateElement);
    addOption("StudentHub Online", "Student Digital Workspace", "Software/Application", templateElement);
    //addOption("Study Space - App Booking", "Student Digital Mobile App", "Timetable/Calandar", templateElement);
    //addOption("Study Space - Calendar Booking", "Office 365", "Calendar", templateElement);
    addOption("Top-up Assistance", "IMS", "Funds Kiosk", templateElement);
    addOption("Transfer/Refund Funds", "IMS", "Transfer/Refund", templateElement);
    addOption("WiFi - AUTWiFi", "WiFi Network", "AUT WiFi", templateElement);
}

/*
Function to add option nodes to the template_element select node.
The names are based on the category and subcategory of each website.
This method is used with parameters, where arg0 is template name, arg1 is category, arg2 is subcategory, and arg3 is element to append to.
Note that if the category is IMS Identity Management System, just use IMS.
*/
function addOption()
{
    // Create new option element
    var new_option = document.createElement("option");
    // Set the option text and value to a string based on the function parameters.
    new_option.appendChild(document.createTextNode(arguments[0]));
    // Set params as option value. Split using ~
    new_option.value = arguments[1] + "~" + arguments[2];
    // Add the new option node to the existing template_element
    arguments[3].appendChild(new_option);
}

/*
Function used as listener action for quicklog-checkbox element.
If checked, disable default buttons and enable quicklog objects.
If not, do the inverse.
*/
function quicklogChecked()
{
    if(document.getElementById("quicklog-checkbox").checked){
        // show the extra fields
        console.log("<TAMPERMONKEY> QL is checked");
        document.getElementById("template-submit-bottom").style.display = "inline-block";
        document.getElementById("template-submit-top").style.display = "inline-block";
        document.getElementById("quicklog-container").style.display = "block";
        document.getElementById("sysverb_insert_bottom").style.display = "none";
        document.getElementById("sysverb_insert").style.display = "none";
        var callType = document.getElementById("new_call.call_type").value;
        // if call type is invalid, set to sc_request
        if (callType != "incident" && callType != "sc_request"){
            g_form.setValue('call_type', "sc_request");
        }
    } else {
        // hide the extra fields
        console.log("<TAMPERMONKEY> QL is not checked");
        document.getElementById("template-submit-bottom").style.display = "none";
        document.getElementById("template-submit-top").style.display = "none";
        document.getElementById("quicklog-container").style.display = "none";
        document.getElementById("sysverb_insert_bottom").style.display = "inline-block";
        document.getElementById("sysverb_insert").style.display = "inline-block";
    }
}

/*
Function used as listener action for quicklog-copy-closenotes element.
If checked, set quicklog-closenotes element to readonly. Else do the inverse.
*/
function copyCloseNotesChecked()
{
    if (document.getElementById("quicklog-copy-closenotes").checked){
        console.log("<TAMPERMONKEY> Copy close notes is checked");
        document.getElementById("quicklog-closenotes").readOnly = true;
    } else {
        console.log("<TAMPERMONKEY> Copy close notes is not checked");
        document.getElementById("quicklog-closenotes").readOnly = false;
    }
}

/*
Function used as listener action for quicklog-template-chooser element.
When a template is selected. the category and subcategory readonly input fields are updated.
*/
function templateSelected()
{
    let categories = document.getElementById("quicklog-template-chooser").value.split("~");
    // To save screen space, IMS is shortened when set for value of option.
    // If the category is IMS, set categories[0] to the full IMS value.
    if (categories[0] == "IMS"){
        categories[0] = "IMS Identity Management System";
    }
    document.getElementById("quicklog-category").value = categories[0];
    document.getElementById("quicklog-subcategory").value = categories[1];
}

/*
Function to save info on new call page and store in userscript.
This function is called when the user clicks on the template_submit button.
*/
function storeInfo()
{
    console.log("<TAMPERMONKEY> Storing QL Info");
    // Get call type. If it isn't a Request or Incident, show an alert and exit function.
    var call_type = g_form.getValue("call_type");
    if (!(call_type == "incident" || call_type == "sc_request")){
        console.log("<TAMPERMONKEY> Call type: " + call_type + ". storeInfo aborted.");
        alert("Quicklog Error: Call type must be a Request or an Incident!");
        return;
    }
    // Get the selected template value. Note this is a string based on the categories.
    let select_element = document.getElementById("quicklog-template-chooser").value;
    // The string is empty if the default blank option is selected. Function only continues if not blank.
    if (select_element == ""){
        console.log("<TAMPERMONKEY> No template selected. storeInfo aborted.");
        alert("Quicklog Error: Template must be selected!");
        return;
    }
    // Store value of close-notes checkbox, close notes, and work notes elements..
    var copy_close_notes = document.getElementById("quicklog-copy-closenotes").checked;
    var work_notes = document.getElementById("new_call.u_work_notes").value;
    var close_notes = document.getElementById("quicklog-closenotes").value;
    // If copy_close_notes is true (checked) and work notes are empty, show alert and exit function.
    if (copy_close_notes && work_notes == ""){
        console.log("<TAMPERMONKEY> Copy close notes selected but no work notes. storeInfo aborted.");
        alert("Quicklog Error: Work notes must be filled!");
        return;
    }
    // Checks are complete. Can proceed with storing values.
    console.log("<TAMPERMONKEY> value not null. setting category");
    // Get effort value. If this isn't numerical, default to 5 (minutes).
    var effort = document.getElementById("quicklog-effort").value;
    if (isNaN(parseInt(effort))){
        console.log("<TAMPERMONKEY> Invalid Effort \"" + effort + "\". Defaulting to 5 minutes.");
        effort = "5";
    }

    // Store info in userscript
    GM_setValue("user", g_form.getValue("caller"));
    GM_setValue("short_description", g_form.getValue("short_description"));
    GM_setValue("description", g_form.getValue("description"));
    GM_setValue("category", document.getElementById("quicklog-category").value);
    GM_setValue("sub_category", document.getElementById("quicklog-subcategory").value);
    GM_setValue("effort", effort);
    if (copy_close_notes){
        GM_setValue("close_notes", work_notes);
    } else {
        GM_setValue("close_notes", close_notes);
    }

    // Logging/Debugging
    console.log("<TAMPERMONKEY> Stored value: User = " + GM_getValue("user"));
    console.log("<TAMPERMONKEY> Stored value: Short Description = " + GM_getValue("short_description"));
    console.log("<TAMPERMONKEY> Stored value: Description = " + GM_getValue("description"));
    console.log("<TAMPERMONKEY> Stored value: Category = " + GM_getValue("category"));
    console.log("<TAMPERMONKEY> Stored value: Sub Category = " + GM_getValue("sub_category"));
    console.log("<TAMPERMONKEY> Stored value: Effort = " + GM_getValue("effort"));
    console.log("<TAMPERMONKEY> Stored value: Close Notes = " + GM_getValue("close_notes"));

    // Submit form. Proceeds to SCTASK/Incident page.
    g_form.submit('sysverb_insert');
    console.log("<TAMPERMONKEY> Submitted New Call form");
}

/*
Function to initiate quicklog and fill out ServiceNow fields.
Checks if the info stored in userscript matches the ticket
If so, run autoPopulateForm function and delete stored info
This function is called when the user navigates to an sctask or incident webpage.
*/
function quicklog(){
    // If user is null, assume there is no stored data and exit function.
    if (GM_getValue("user") == null){
        console.log("<TAMPERMONKEY> No stored value for \"User\" found. Quicklog aborted.");
        return;
    }
    // True if affected contact in stored values matches affected contact for ticket.
    let user = (GM_getValue("user") === g_form.getValue("requested_for")) || (GM_getValue("user") === g_form.getValue("caller_id"));
    // Check if stored description values match the ticket.
    let description = GM_getValue("description") === g_form.getValue("description");
    let short_description = GM_getValue("short_description") === g_form.getValue("short_description");
    // Check if the ticket is in state 1 (new/open depending on task type).
    let state = g_form.getValue("state") == 1;
    // If state is false, exit the function. only autopopulate new tickets.
    if (!state){
        console.log("<TAMPERMONKEY> Ticket is not in \"Open\" or \"New\" state. Quicklog aborted.");
        return;
    }
    // If user, description, and short descriptions all match, proceed.
    if (user && description && short_description){
        console.log("<TAMPERMONKEY> Quicklog running successfully.");
        // Call method to insert info into ticket using g_form.
        autoPopulateForm();
        // Delete stored data
        GM_deleteValue("user");
        GM_deleteValue("description");
        GM_deleteValue("short_description");
        GM_deleteValue("category");
        GM_deleteValue("sub_category");
        GM_deleteValue("effort");
        GM_deleteValue("close_notes");
        console.log("<TAMPERMONKEY> Deleted stored values.");
    } else {
        // Runs if the info doesn't match for logging/debugging purposes.
        console.log("<TAMPERMONKEY> Stored values don't match this ticket. Quicklog aborted.");
    }
}

/*
Function to populate the ServiceNow task fields with the info from the call page.
This function is called when the user is on a open/new SCTASK or INC page, and the verification info matches.
*/
function autoPopulateForm()
{
    console.log("<TAMPERMONKEY> Running autoPopulateForm function from userscript!");
    // Some fields are named differently for INC and SCTASK. Check what type of task this is.
    if (document.getElementById("incident.severity") != null){
        // Ticket is an incident.
        // Set Severity to 4 (Single User)
        g_form.setValue('severity', 4);
        // Set the category of the incident
        g_form.setValue('category', GM_getValue("category"));
        // Set the subcategory of the incident
        g_form.setValue('subcategory', GM_getValue("sub_category"));
        // Set the resolution code
        g_form.setValue('close_code', 'Solved (Permanently)');
    } else {
        // Ticket is an SCTASK
        // Set the category of the SCTASK
        g_form.setValue('u_category', GM_getValue("category"));
        // Set the subcategory of the SCTASK (disabled in test instance as subcategories not updated here).
        g_form.setValue('u_sub_category', GM_getValue("sub_category"));
        // Set the close code
        g_form.setValue('u_close_code', 'Solved (Permanently)');
    }
    // Set Assignment Group to Student Service Desk.
    g_form.setValue('assignment_group', '2962c43fdba8009067f14815059619cc');
    // Set effort on task. Format string appropriately since this feeds value to a background input element.
    g_form.setValue('u_effort_on_task', "0 00:" + GM_getValue("effort") + ":00");
    // Set the assigned to field to the userID of the currently logged in user.
    g_form.setValue('assigned_to', g_user.userID);
    // Set close notes
    g_form.setValue('close_notes', GM_getValue("close_notes"));
    // Append [STUDQL] to description
    g_form.setValue('description', g_form.getValue("description") + "\n[STUDQL]")
    console.log("<TAMPERMONKEY> Finished populating g_form");
}