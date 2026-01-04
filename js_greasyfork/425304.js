// ==UserScript==
// @name        ServiceNow Digital Equity Templates
// @match       https://aut.service-now.com/sc_task.do*
// @version     1.2
// @description Sets category and creates generic comms for common DE requests
// @namespace https://greasyfork.org/users/453161
// @downloadURL https://update.greasyfork.org/scripts/425304/ServiceNow%20Digital%20Equity%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/425304/ServiceNow%20Digital%20Equity%20Templates.meta.js
// ==/UserScript==

initialise();

function initialise() {
    var templateElement = document.createElement("select");
    templateElement.id = "quicklog-de-templates";
    templateElement.className = "form-control";
    populateTemplateSelect(templateElement);
    templateElement = encapsulateElement("DE Template", templateElement);
    document.getElementById("element.sc_task.location").insertAdjacentElement("afterend", templateElement);
    document.getElementById("quicklog-de-templates").addEventListener("change", applyTemplate, false);

    var campusElement = document.createElement("select");
    campusElement.id = "quicklog-de-campus";
    campusElement.className = "form-control";
    campusElement.disabled = true;
    populateCampusSelect(campusElement);
    campusElement = encapsulateElement("DE Location", campusElement);
    document.getElementById("element.sc_task.u_category").insertAdjacentElement("beforebegin", campusElement);
    document.getElementById("quicklog-de-campus").addEventListener("change", applyComms, false);
}

function populateTemplateSelect()
{
    var templateElement = arguments[0];

    // Append an empty option node to work as a default placeholder.
    var placeholder = document.createElement("option");
    placeholder.innerHTML = "";
    placeholder.disabled = false;
    placeholder.selected = true;
    placeholder.value = "";
    templateElement.appendChild(placeholder);

    // laptop issue
    var laptopOption = document.createElement("option");
    laptopOption.appendChild(document.createTextNode("Laptop Request"));
    laptopOption.value = "laptop";
    templateElement.appendChild(laptopOption);

    // modem issue
    var modemOption = document.createElement("option");
    modemOption.appendChild(document.createTextNode("Modem Request"));
    modemOption.value = "modem";
    templateElement.appendChild(modemOption);

    // both issue
    var multipleOption = document.createElement("option");
    multipleOption.appendChild(document.createTextNode("Laptop + Modem Request"));
    multipleOption.value = "Multiple Devices";
    templateElement.appendChild(multipleOption);
}

function populateCampusSelect()
{
    var campusElement = arguments[0];

    // Append an empty option node to work as a default placeholder.
    var placeholder = document.createElement("option");
    placeholder.innerHTML = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.value = "";
    campusElement.appendChild(placeholder);

    var cityOption = document.createElement("option");
    cityOption.appendChild(document.createTextNode("City"));
    cityOption.value = "City";
    campusElement.appendChild(cityOption);

    var southOption = document.createElement("option");
    southOption.appendChild(document.createTextNode("South"));
    southOption.value = "South";
    campusElement.appendChild(southOption);

    var northOption = document.createElement("option");
    northOption.appendChild(document.createTextNode("North"));
    northOption.value = "North";
    campusElement.appendChild(northOption);
}

function encapsulateElement()
{
    // Main div container for element. This element is returned by function.
    var containerDiv = document.createElement("div");
    containerDiv.className = "form-group";

    // Span element used as label.
    var labelSpan = document.createElement("span");
    labelSpan.className = " col-xs-12 col-md-3 col-lg-4 control-label";
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

function applyTemplate()
{
    // get the template that is selected.
    var templateValue = document.getElementById("quicklog-de-templates").value;

    // if blank is selected, abort function.
    if (templateValue == ""){
        document.getElementById("quicklog-de-campus").value = "";
        document.getElementById("quicklog-de-campus").disabled = true;
        g_form.setValue("activity-stream-comments-textarea", "");
        return;
    } else {
        document.getElementById("quicklog-de-campus").disabled = false;
    }

    // set category to digital equity. subcategory to the template value.
    g_form.setValue('u_category', 'digital_equity');
    g_form.setValue('u_sub_category', templateValue);

    applyComms();
}

function applyComms()
{
    var campusValue = document.getElementById("quicklog-de-campus").value;

    if (campusValue == ""){
        return;
    }

    var location = "";
    if (campusValue == "City"){
        location = "WA Level 4"
    }
    if (campusValue == "South"){
        location = "MA202"
    }
    if (campusValue == "North"){
        location = "AL125"
    }

    // get the template that is selected.
    var templateValue = document.getElementById("quicklog-de-templates").value;

    // for comms, generate sentence for single device.
    let device = templateValue + " you requested is";
    // if multiple devices, alter comms.
    if (templateValue == "Multiple Devices"){
        device = "laptop and modem you requested are"
    }

    // retrieve RITM number.
    let jobNumber = g_form.getValue("sys_display.sc_task.request_item");

    // query server for the user's first name. AJAX query, so will call publishComms function once server responds.
    var nameQuery = g_form.getReference('request_item.request.requested_for', publishComms);

    // generates comms and populates field in form.
    function publishComms(nameQuery){
        let comms = "Hi " + nameQuery.first_name + ",\n\nThe " + device + " now available for pick up from " + campusValue + " campus.\nPlease come in to the Tech Central in " + location + " on a working day between 8am and 10pm.\nRemember to bring your ID Card and reference this job number: " + jobNumber + ".\n\nRegards,\nICT Student Support";
        g_form.setValue("comments", comms);
    }
}