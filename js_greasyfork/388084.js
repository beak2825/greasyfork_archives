// ==UserScript==
// @name Assist User Account Creation BETA
// @description Assist with user account creation
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/*
// @match https://webadmin.aut.ac.nz/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_notification
// @version 0.3.1
// @downloadURL https://update.greasyfork.org/scripts/388084/Assist%20User%20Account%20Creation%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/388084/Assist%20User%20Account%20Creation%20BETA.meta.js
// ==/UserScript==

//set your username here
var my_username = "";

var user_details = [];

var fields_saved = ["date_start", "date_finish", "name_first", "name_middle", "name_last", "name_preferred", "dob", "previous_employee", "position", "room", "department", "department_id", "pc_serial_number", "aut_barcode", "phone", "fax", "email", "ticket_id", "requestor", "requestor_username", "url_id"];

//returns a date one year from today - https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
function futureDate() 
{
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year+1, month, day].join('-');
}

//cause otherwise it'll bitch if we're on IPD or something like that
if (document.location.href.includes("aut.service-now.com"))
{
  var type = document.getElementById("sys_target").value; //will be either 'incident' or 'u_request'
}

if (window.location.href.includes('aut.service-now.com')) 
{
  if (document.getElementById(`${type}.short_description`).value.includes("IT Account Setup/Reactivation: "))
  {    
    var short_desc = document.getElementById("u_request.description").value;
    var short_desc_split = short_desc.split("\n");
    //because there could be text above this line
    index = short_desc_split.indexOf("Employee Details:");
	
    var this_user = {};
    
    //capture all fields even though we likely won't use them all
    this_user["date_start"] = short_desc_split[index+1].substring(24);
    this_user["date_finish"] = short_desc_split[index+2].substring(25);
    this_user["name_first"] = short_desc_split[index+3].substring(15);
    this_user["name_middle"] = short_desc_split[index+4].substring(16);
    this_user["name_last"] = short_desc_split[index+5].substring(14);
    this_user["name_preferred"] = short_desc_split[index+6].substring(19);
    
		var test_dob = short_desc_split[index+7].substring(18);
    //Might be anything, encountered dd Month yyyy the other day
    if ( (test_dob != "Unknown") && (test_dob != "") )
    {
      this_user["dob"] = test_dob;
    }
    this_user["previous_employee"] = short_desc_split[index+8].substring(22);
    this_user["position"] = short_desc_split[index+9].substring(19);
    this_user["room"] = short_desc_split[index+10].substring(9);
    this_user["department"] = short_desc_split[index+11].substring(15);
    this_user["department_id"] = short_desc_split[index+12].substring(18);
    this_user["pc_serial_number"] = short_desc_split[index+13].substring(21);
    this_user["aut_barcode"] = short_desc_split[index+14].substring(16);
    this_user["phone"] = short_desc_split[index+15].substring(10);
    this_user["fax"] = short_desc_split[index+16].substring(8);
    
    //remove the generated login name to force me to look at which type they'd need
    if (document.getElementById("login") != null)
    {
      document.getElementById("login").value = "";
    }
	
    var email_account_required = short_desc_split[short_desc_split.indexOf("Network, Email, Internet Details:") + 1].slice(27);
    if (email_account_required == "Yes")
    {
      var email = `${this_user["name_first"]}.${this_user["name_last"]}@aut.ac.nz`;
      this_user["email"] = email.toLowerCase();
    }
    else
    {
      if (short_desc_split[short_desc_split.indexOf("Other Details:") + 1].includes("@"))
      {
        //the .* at the beginning is because regex reads left-to-right. Took me a second to figure out. Go ahead and try it without you reckless fool
        var email_regex = /.* (.*?@.*?) /;
        var email = email_regex.exec(short_desc_split[short_desc_split.indexOf("Other Details:") + 1])[1];
        this_user["email"] = email.toLowerCase();
      }
    }   
    
    var url_id_regex = /sys_id(.|.3D)(\w{32})/;
    var url_id = url_id_regex.exec(window.location.href)[2];
    this_user["url_id"] = url_id;
    var ticket_id = document.getElementById(`sys_readonly.${type}.number`).value;
    this_user["ticket_id"] = ticket_id;
    var requestor = document.getElementById(`sys_display.${type}.u_requestor`).value;
    this_user["requestor"] = requestor;
    var requestor_username = document.getElementById(`sys_readonly.${type}.u_affected_contact.user_name`).value;
    this_user["requestor_username"] = requestor_username;

    //if this user hasn't had their details saved, add them
    //add UA (user account) in case there are other values stored when we go to read them
    if (GM_getValue(`UA ${this_user["name_first"]} ${this_user["name_last"]}`, "NONEXISTANT") == "NONEXISTANT")
	{
	  GM_setValue(`UA ${this_user["name_first"]} ${this_user["name_last"]}`, this_user);
    }
    
    var name_last = document.getElementById("u_request.description").value.split("\n")[document.getElementById("u_request.description").value.split("\n").indexOf("Employee Details:")+5].substring(14);
    var hr_search_icon = document.createElement('img');
	hr_search_icon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAYFBMVEX///9qbnzY2d1tcYFvc39scoD39/hyc4PV1trq6+3Awsjw8fH6+vt1d4TJys+dn6mFh5R3fIeMkJrl5ui1t76wsbmVl6GAgY3d3uHFxsyIjJehpa2Zm6aqrLTP0NR5eonmUA5GAAAEuklEQVR4nO1a2bbqIAztbOd5rq3//5dXCWiPekqY1rkP3a9Ssg0h2UAsC4smb5e+vLm+bbvZMBfdNAbojxWRhl3t2V8wLFNi3HqQ9/434wxl25g07xRHxinm2NBipHGJMP/AZY1MmK/enH1d22kLw3DL426Z36Ji0U0hH3azV0XcpO8jom394aFO50I09Wvi4SDMkqnf0cy12W+fge8vI2ds0r581evZldHMJsxa1Izb64NNg/3twmK7Ra9q+IyG9SNWRNE941rIn1NGP6vVliFlmWfgrf07goV9qZIag1rBkxt1QibKfWefRlMWSn2eUPqeLANmv5TOaitM4MoxSOkf6BUCOaYulIoDGn+FvPk7NpoVJfYC3X+Lkv07A8iis7AbNz32nxOJOjKC/Ncr27/nJGAQi301SzruG2AxfaFAbCF4NakKqNGlwL9pIHLk8s8nAqjQLf4LyACdJvuWNcIioB2aC7uMB1jSK3J0CvJTvoZ8mRIWwcGNjjVlgD0c2FWoseCAi+ZT1hUf1pNoyKIQgT7CDCV6LtMYgYAFG1iOEQcwFyAii1Rh38A5m0SBy1XWgacuAr4DXDvxhuXac8ATAyoMiaMGE/ZpOuQsburprQJ7NIQA58jqmFsBugac8CLioTJjH1T67XhMbWoPPBAS9x4XZVdCvqER8IOgMRkCNAgOIxw0tPY6wFBwlTbZqqUp+zD9YZJZRJSTOIiD/aMRRECvxgiM3FxYminFDAkhcHRCqVAFSxopV5qSNKDjbu0X+Lz5fbRylIPHy0R46SqH7L8nYDoGPN78XIaK4Hp4MFkMWR44qnWzOUH2QMMVBIVJPcIUyVGxJYoMd4aVQcwVfORgejFGYOWeDEaEalNAzS22UC2MJQKPv8lKk4JgRCjOxaQmI4rMPR6TczWLAnquJmW5ykwuDFBzzwiWkpi4guwB1BlaDj1XlD8AVzkmdCl25hnFUwIdMslNhnJRmnHz8H6g/oIEF8AYsdMZEYZwAYxaWkgFul3QCiQYeO/Uez5KyCPYDXfwT0jRyrQ24xRCGRaiQOeDAVy+Ddibj6DSHIf01Qo/IdzUyDz4fgcsgMjFB7z0oZ4XEIAUIPQGk0D3gx5pNProHPQCfXLWIQwi+DOipw3a/KBeExIIwEF0V9P+CV91KzTwDO+J91BQ5oqbMbnIz9LQNhyV03pE/4VcNI+0R1BeHo2sn8pFPtq+f+/C51fJskB7aFQY0H8g1Y4V/GhA9eQYNKyPsxW+QXdYX+HqqjBIWG9gKfaIkLC/74WWo8Tg2U9nF/hTe9qyJkSyeGoMrJg1dPrIVtldA24B4avIoHl1yxb8hUhatvfsyzOFKDJIX12tdtkeuSHId2211139VWRgRdfdjio752tiaOKddXv4mX1VGVjObO8xL/HWMBpp5Exrfdn/fovf960yAyus7Q9kVXXLPtvtqw/zWhhY4+J+cvhE/Uv50sDACqYvbviB4SBIdTC4b7O8qH4x7vbxcdHQw+COKO/64cfSV/XKMa6XAUHSOFue51s4RuhSpZeBDP4fBgZfpk4GJwM8A+Vz18ngZHAyOBmcDE4GJwPdDP5cqZppqBZh8HcEgIGZR3MkxtLvk38/TzBLYvXZWQAAAABJRU5ErkJggg==";
	hr_search_icon.width = hr_search_icon.height = 32;
	hr_search_icon.style.verticalAlign = "bottom";
    hr_search_icon.style.float = "right";
	// link
	var hr_search_link = document.createElement('a');
	hr_search_link.target = "_blank";
	hr_search_link.href = `https://webadmin.aut.ac.nz/admin/db/xgab/t1.cgi?q=${this_user["name_last"]}`;
	hr_search_link.appendChild(hr_search_icon);

    document.getElementsByClassName("col-xs-10 col-md-9 col-lg-8 form-field input_controls")[1].insertAdjacentElement("beforebegin", hr_search_link);
  }
}

//search HR first and only give the link if we've previously saved the details (so we don't have broken buttons)
if (window.location.href.includes('t1.cgi') && (GM_listValues().length > 0))
{
  //Can't think of a way to reliably pass the user in question so we'll go off the search query I guess
  GM_listValues().forEach(add_create_user_link);

  function add_create_user_link(item, index) {
    if (item.toUpperCase().includes(window.location.href.split("q=")[1].toUpperCase()))
      {  
        console.log(item, index);
        var xgab_link = `<p style="color: red; font-size: 15px;"><a href=\"https://webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi?FN=${GM_getValue(item)["name_first"]}&LN=${GM_getValue(item)["name_last"]}&TY=PERSON&LO=1&AddEntry=1\">CREATE ACCOUNT</a></p>`;
        document.body.innerHTML= document.body.innerHTML.replace(/Inlude TERMINATED.br./,`Include TERMINATED<br><br>${xgab_link}`);
      }
  }
}

if ((window.location.href.indexOf('webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi') > 0) && (GM_listValues().length > 0) && (document.body.innerHTML.includes("Edit Staff Directory Record")))
{
  
  
  
  var hr_split = document.createElement("hr");
  var br_split = document.createElement("br");

  //https://stackoverflow.com/questions/24181244/create-a-drop-down-list-with-options-through-document-createelement
  var dropdown_element = document.createElement("select");
  // Use the Option constructor: args text (what the user will see), value (name of the template's var), defaultSelected, selected
  var option = new Option("-- Don't AutoFill --", "", true, false);
  dropdown_element.appendChild(option);
  
  GM_listValues().forEach(append_option);
  
  function append_option(item, index)
  {
    if (item.slice(0,3) == "UA ")
    {
      this_user = GM_getValue(item);
      var option = new Option(`${this_user["name_first"]} ${this_user["name_last"]}`, "", false, false);
      option.value = `${this_user["name_first"]} ${this_user["name_last"]}`;
      dropdown_element.appendChild(option);
    }
  }
  dropdown_element.addEventListener("change", autoFill);
  
  var hr_split = document.createElement("hr");
  var br_split = document.createElement("br");
  document.getElementsByName("loginButton")[0].insertAdjacentElement("afterend", dropdown_element);
  document.getElementsByName("loginButton")[0].insertAdjacentElement("afterend", hr_split);
  document.getElementsByName("loginButton")[0].insertAdjacentElement("afterend", br_split);
  
  function autoFill(user_to_autofill)
  {
	this_user = GM_getValue("UA ".concat(user_to_autofill.target.value));
    if (GM_getValue("date_finish") != "")
    {
      document.getElementById("expiredate").value = this_user["date_finish"];
    }
    else
    {
      var usethis = futureDate();
      document.getElementById("expiredate").value = usethis;
    }
    alert("Please manually select the department or none will be selected");
    document.getElementsByName("room")[0].value = this_user["room"];
    //custom combo box - doesn't work programatically atm (and gets fucked up by random other shit)
    document.getElementsByClassName("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-autocomplete-input")[0].value = `${this_user["department_id"]} - ${this_user["department"]}`;
    document.getElementsByClassName("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-autocomplete-input")[0].focus();
    document.getElementsByName("position")[0].value = this_user["position"];
    document.getElementsByName("ManagerLogin")[0].value = this_user["requestor_username"];
    document.getElementsByName("ManagerLogin")[0].focus();
    document.getElementsByName("ManagerLogin")[0].blur();
    document.getElementsByName("phone1")[0].value = this_user["phone"];
    document.getElementsByName("fax")[0].value = this_user["fax"];
    document.getElementsByName("email")[0].value = this_user["email"];
    document.getElementsByName("ITnotes")[0].value = `${this_user["ticket_id"]} Account Creation`;
    if(GM_getValue("dob") != "")
    {
      document.getElementsByName("ITnotes")[0].value += `\nDoB ${this_user["dob"]}`;
    }
    
    if (this_user["position"].toUpperCase().includes("PHD"))
    {
      document.getElementsByName("groups")[0].value += ",PHDSTUDENT";
    }

    //
    //Generate login options and what not
    //
    var xgab_id = document.getElementsByName("wr")[0].value;
    //Username format dropdown selector
    var username_dropdown = document.createElement("select");
    username_dropdown.setAttribute("id", "username_dropdown");
    var option = new Option("-- Username Options --", "", false, false);
    username_dropdown.appendChild(option);
    var option = new Option(`DEFAULT: EM Format em${xgab_id}`, "em_format", false, false);
    username_dropdown.appendChild(option);
    var name_format = String(`${this_user["name_first"].slice(0,1)}${this_user["name_last"]}`).toLowerCase();
    var option = new Option(`Name Format ${name_format}`, "name_format", false, false);
    username_dropdown.appendChild(option);
    var option = new Option(`Vendor Account ve${xgab_id}`, "vendor_account", false, false);
    username_dropdown.appendChild(option);
    var option = new Option(`Contractor Account co${xgab_id}`, "contractor_account", false, false);
    username_dropdown.appendChild(option);
    var option = new Option(`External Sharepoint sp${xgab_id}`, "external_sharepoint", false, false);
    username_dropdown.appendChild(option);

    username_dropdown.addEventListener("change", change_login);

    function change_login(option)
    {
      //we re do the email and email server for each in case sharepoint was selected mistakenly
      if (`${option.target.value}` == "")
      {
        document.getElementById("login").value = "";
      }
      else if (`${option.target.value}` == "name_format")
      {
        document.getElementById("login").value = name_format;
        document.getElementsByName("email")[0].value = this_user["email"];
        document.getElementsByName("fileserver")[0].value = "exchange";
      }
      else if (`${option.target.value}` == "em_format")
      {
        document.getElementById("login").value = `em${xgab_id}`;
        document.getElementsByName("email")[0].value = this_user["email"];
        document.getElementsByName("fileserver")[0].value = "exchange";
      }
      else if (`${option.target.value}` == "vendor_account")
      {
        document.getElementById("login").value = `ve${xgab_id}`;
        document.getElementsByName("email")[0].value = this_user["email"];
        document.getElementsByName("fileserver")[0].value = "exchange";
      }
      else if (`${option.target.value}` == "contractor_account")
      {
        document.getElementById("login").value = `co${xgab_id}`;
        document.getElementsByName("email")[0].value = this_user["email"];
        document.getElementsByName("fileserver")[0].value = "exchange";
      }
      else if (`${option.target.value}` == "external_sharepoint")
      {
        document.getElementById("login").value = `sp${xgab_id}`;
        document.getElementsByName("email")[0].value = "ENTER NON-AUT EMAIL";
        document.getElementsByName("fileserver")[0].value = "";
      }
    }
    if (document.getElementById("username_dropdown"))
    {
      document.getElementById("username_dropdown").remove();
    }
    document.getElementsByTagName("a")[18].insertAdjacentElement("afterend", username_dropdown);
  };
}

if (window.location.href.indexOf('webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi') > 0 && (document.body.innerHTML.includes("Please enter the login name of the user to notify with the account details once the account has been created")))
{
  if (my_username == "")
  {
    alert("Don't forget to put your username in the Assist User Account Creation source! [Won't run this time as it's not filled in]");
  }
  else
  {
    document.getElementsByName("AUTOCREATEnotify")[0].value = my_username;
  }
}