// ==UserScript==
// @name         4chan-Ignoring-Enhancements
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  4chan Pain Kill Extension
// @author       ECHibiki-/qa/
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @include https://boards.4chan.org/*
// @include http://boards.4chan.org/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/29955/4chan-Ignoring-Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/29955/4chan-Ignoring-Enhancements.meta.js
// ==/UserScript==

/*
This userscript enables 4chan users to hide images in the catalog and threads.
Gives the ability to hide images with ctrl+shift+click. Stores in browser memory for new sessions.
Also includes the ability to do word replacements with a regex replacement system.
*/

var local_store_threads = [];
var browser;
var finished = false;
var window_displayed = false;
var default_expire_time = 172800000;

var expire_time;
var md5_filters;
var md5_filters_arr = [];

var number_of_filters = 0;
var initial_filters = [];
var filtered_threads = [];
var kill = [];
var finished = false;
var observer;

var blank_png =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAALiMAAC4jAHM9rsvAAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAAo0lEQVR42u3RAQ0AAAjDMO5f9LFBSCdhTdvRnQIEiIAAERAgAgJEQIC4AERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABAQIECACAkRAgAjI9xbzUCtI4axs4wAAAABJRU5ErkJggg==";

//The following is image hiding functions.
//The next are filter functions
//The last are setup functions

/**
0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
**/


//is storage possible
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
		//From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

//What Browser
function detectBrowser() {
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
    {
        console.log("Opera");
        return 0;
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        console.log("Chrome");
        return 1;
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        console.log("Safari");
        return 2;
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 )
    {
        console.log("FireFox");
        return 3;
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
        console.log("IE");
        return 4;
    }
    else
    {
        console.log("Other");
        return -1;
    }
}

//hide image onclick listener.
//Method 404's a given image. This 404'ing allows image dissabling to be toggled on and off.
//Post number associated with the image is stored in local storage.
function hideImage(event){
    var hide_index = this.src.indexOf("base64");
    if((event.ctrlKey && event.shiftKey) && hide_index == -1){
        event.preventDefault();
        event.stopPropagation();
        if (storageAvailable('localStorage')) {
            localStorage.setItem(this.getAttribute("hide-grouping"), Date.now());
        }
        else {
            console.log("No Storage");
        }
		//some browsers require a querry on the image URL to 404 it.
		var nodes = document.querySelectorAll('img[hide-grouping="'+this.getAttribute("hide-grouping")+'"]');
		nodes.forEach(function(node){
			if(node.getAttribute("hide-grouping") == event.target.getAttribute("hide-grouping")){
				node.setAttribute("hidden-src", node.src);
				node.src = blank_png;//this.src + ".HIDDEN" +  "?" + Date.now();
			}
		});
        return false;
    }
    else if(event.ctrlKey && event.shiftKey){
        event.preventDefault();
        event.stopPropagation();
        if (storageAvailable('localStorage')) {
            localStorage.removeItem(this.getAttribute("hide-grouping"));
        }
        else {
            console.log("No Storage");
        }
		var nodes = document.querySelectorAll('img[hide-grouping="'+this.getAttribute("hide-grouping")+'"]');
		nodes.forEach(function(node){
			if(node.getAttribute("hide-grouping") == event.target.getAttribute("hide-grouping")){
				node.src = node.getAttribute("hidden-src");
			}
		});
        return false;
    }
    return true;
}

//functions to find properties by regex
function getPropertyByRegex(obj,propName) {
    var re = new RegExp("^" + propName + "(\\[\\d*\\])?$"),
        key;
    var rtnArray = [];
    for (key in obj)
        if (re.test(key))
            rtnArray.push(key);
    return rtnArray;
}

//retrieve from memory the hidden images
//Images are stored in memory as f<ID_NUMBER>IMG and recalled using the storage_key
//Function makes a check to see if the hiding time limit for the thread has expired or not.
//Note: Must have the DOM itterate through before retrieval
function retrieveStates(){
    var storage_position = 0,
        oJson = {},
        storage_key;
    while(storage_position < window.localStorage.length) {
        storage_key = window.localStorage.key(storage_position);
        oJson[storage_key] = window.localStorage.getItem(storage_key);
        storage_position++;
    }
    local_store_threads = getPropertyByRegex(oJson,"[0-9]+IMG");
	expire_time =  localStorage.getItem("Expiration_Time");
	md5_filters = localStorage.getItem("MD5_List_FSE");
	if(md5_filters !== null)
		md5_filters_arr = md5_filters.split("\n");
	md5_filters_arr.forEach(function(md5, index){
		md5 = md5.trim();
		md5_filters_arr[index] = md5.substring(1, md5.length - 1);
	});
}


//settings for time expiration on image hiding
function hideWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var background_div = document.createElement("div");
    background_div.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    background_div.setAttribute("id", "hiBackground");
    document.body.appendChild(background_div);
    background_div.addEventListener("click", hideToggle);

    var window_div = document.createElement("div");
    window_div.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    window_div.setAttribute("id", "hiWindow");

    var close_div = document.createElement("div");
    close_div.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    close_div.addEventListener("click", hideToggle);
    window_div.appendChild(close_div);

    var title_para = document.createElement("p");
    title_para.setAttribute("style", "margin-left:5px;margin-top:5px");
    var title_text = document.createTextNode("Filter Settings");
    title_para.appendChild(title_text);
    window_div.appendChild(title_para);

    var container_div = document.createElement("div");
    container_div.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    window_div.appendChild(container_div);

    var expiration_label = document.createElement("label");
    var expiration_text = document.createTextNode("Non-MD5 Expiration Time(hours): ");
    expiration_label.appendChild(expiration_text);
    container_div.appendChild(expiration_label);
    var expiration_input = document.createElement("input");
    expiration_input.setAttribute("id", "Expiration_Time");

	expiration_input.value =  expire_time / 3600000;

    container_div.appendChild(expiration_input);
    container_div.appendChild(expiration_input);
    container_div.appendChild(document.createElement("hr"));

	var md5_label = document.createElement("label");
	var md5_text = document.createTextNode("MD5 Filters:");
	var md5_textarea = document.createElement("TextArea");
	md5_textarea.setAttribute("style", "width:98%;height:217px");

	if(md5_filters !== null)
		md5_textarea.value = md5_filters;

	md5_textarea.setAttribute("placeholder", "Enter MD5 like on 4chanX... \n/abc123/\n/def890/");
	md5_textarea.setAttribute("ID", "MD5_List_FSE");
	container_div.appendChild(md5_label);
	md5_label.appendChild(md5_text);
	container_div.appendChild(document.createElement("br"));
	container_div.appendChild(md5_textarea);

	container_div.appendChild(document.createElement("hr"));

    var set_button = document.createElement("input");
    set_button.setAttribute("type", "button");
    set_button.setAttribute("id", "setTime");
    set_button.setAttribute("value", "Set");
    set_button.addEventListener("click", function(){
        if (storageAvailable('localStorage')) {
            var time = document.getElementById("Expiration_Time");
            var millisecond_time = time.value * 3600000;
            if (millisecond_time == 0 || millisecond_time === null || millisecond_time === undefined) millisecond_time = default_expire_time;
            expire_time = millisecond_time;
            localStorage.setItem("Expiration_Time", millisecond_time);

			md5_filters = document.getElementById("MD5_List_FSE").value;
			localStorage.setItem("MD5_List_FSE", md5_filters);

			hideToggle();
        }
    });
    container_div.appendChild(set_button);

    document.body.appendChild(window_div);

}

function hideToggle(){
    if(window_displayed){
        document.getElementById("hiWindow").style.display = "none";
        document.getElementById("hiBackground").style.display = "none";
        window_displayed = false;
    }
    else{
        document.getElementById("hiWindow").style.display = "inline-block";
        document.getElementById("hiBackground").style.display = "inline-block";
        window_displayed = true;
    }
}

function hideButton(){
    var hide_button = document.createElement("input");
    hide_button.setAttribute("Value", "Hide Image Settings");
    hide_button.setAttribute("type", "button");
    hide_button.setAttribute("style", "position:absolute;top:45px");
    hideWindow();
    if(document.body === null){
        setTimeout(hideButton, 30);
    }
    else{
        document.body.appendChild(hide_button);
        hide_button.addEventListener("click", hideToggle);
    }
}


/**111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
//111111111111111111111111111111111111111111111111111111111111////111111111111111111111111111111111111111111111111111111111111//
*/

//store filter settings
function loadSettings(){
    var filter_setting = 0,
        oJson = {},
        storage_key;
    while( filter_setting < window.localStorage.length) {
        filter_setting++;
        storage_key = window.localStorage.key(filter_setting);
        oJson[storage_key] = window.localStorage.getItem(storage_key);
    }
    number_of_filters = oJson["q"];
    filters = getPropertyByRegex(oJson,"filter[0-9]*");
    filters.forEach(function(filter){
        initial_filters.push(formatSettings(oJson[filter]));
    });
}

function saveSettings(){

    kill = []; //Determins if a certain pattern should be used or not due to regex errors from the user

    if(storageAvailable('localStorage')){
        window.localStorage.setItem("q", number_of_filters);
        for (var pattern_input = 0 ; pattern_input < number_of_filters; pattern_input++){
            var pattern_to_store = document.getElementById("Pattern"+pattern_input).value;
            var replacement_to_store = document.getElementById("Replacement"+pattern_input).value;
            var setting = "g";
            if(pattern_to_store === "" || replacement_to_store === "") continue;
            if (pattern_to_store.charAt(0) == "/" && pattern_to_store.charAt(pattern_to_store.length - 1) == "/"){
                pattern_to_store = pattern_to_store + setting;
            }
            else if(pattern_to_store.charAt(0) !== "/" && pattern_to_store.substr(pattern_to_store.length - 2).match(/\/[a-zA-Z$]/) == null){
                pattern_to_store = "/" + pattern_to_store + "/" + setting;
            }
            document.getElementById("Pattern"+pattern_input).value = pattern_to_store;
            var save_string = '"' + document.getElementById("Active"+pattern_input).checked + '"-"' + pattern_to_store + '"-"' + replacement_to_store + '"';
            window.localStorage.setItem("filter" + pattern_input, save_string);
        }
    }
    alert("Replacements Saved");
}

//Splits the saved settings into components
function formatSettings(input){
    var rtn =  input.split('"-"');
    var i = 0;
    rtn.forEach(function(filter){
        rtn[i] = filter.replace("\"", "");
        i++;
    });
    return rtn;
}

function filterWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var background_div = document.createElement("div");
    background_div.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    background_div.setAttribute("id", "FilterBackground");
    document.body.appendChild(background_div);
    background_div.addEventListener("click",  filterToggle);

    var window_div = document.createElement("div");
    window_div.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    window_div.setAttribute("id", "FilterWindow");

    var close_div = document.createElement("div");
    close_div.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    close_div.addEventListener("click",  filterToggle);
    window_div.appendChild(close_div);

    var title_para = document.createElement("p");
    title_para.setAttribute("style", "margin-left:5px;margin-top:5px");
    var title_text = document.createTextNode("Filter Settings");
    title_para.appendChild(title_text);
    window_div.appendChild(title_para);

    var container_div = document.createElement("div");
    container_div.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    window_div.appendChild(container_div);

    var filter_table = document.createElement("table");
    filter_table.setAttribute("style", "text-align:center;");
    filter_table.setAttribute("id", "filter_table");
    container_div.appendChild(filter_table);

    var table_row = document.createElement("tr");
    filter_table.appendChild(table_row);
    var table_head_active =  document.createElement("th");
    var head_text_active = document.createTextNode("Active");
    table_head_active.appendChild(head_text_active);
    filter_table.appendChild(table_head_active);
    var table_head_pattern =  document.createElement("th");
    var headTextPattern = document.createTextNode("Pattern");
    table_head_pattern.appendChild(headTextPattern);
    filter_table.appendChild(table_head_pattern);
    var table_head_replacement =  document.createElement("th");
    var head_text_replacement = document.createTextNode("Replacement");
    table_head_replacement.appendChild(head_text_replacement);
    filter_table.appendChild(table_head_replacement);


	//Create the pattern table
    //loop to create rows
    if (number_of_filters === 0 || isNaN(number_of_filters)) number_of_filters = 6;
    for (var i = 0; i <  number_of_filters ; i++){
        var table_row_contents = document.createElement("tr");
        table_row_contents.setAttribute("id", "FilterRow" + i);

        var table_data_active =  document.createElement("td");
        var table_checkbox_active = document.createElement("input");
        table_checkbox_active.setAttribute("type", "checkbox");
        table_checkbox_active.setAttribute("id", "Active" + i);
        table_data_active.appendChild(table_checkbox_active);
        table_row_contents.appendChild(table_data_active);

        var table_data_pattern =  document.createElement("td");
        var table_input_pattern = document.createElement("input");
        table_input_pattern.setAttribute("class", "inputs");
        table_input_pattern.setAttribute("id", "Pattern" + i);
        table_data_pattern.appendChild(table_input_pattern);
        table_row_contents.appendChild(table_data_pattern);

        var table_data_replacement =  document.createElement("td");
        var table_input_replacement =  document.createElement("input");
        table_input_replacement.setAttribute("class", "inputs");
        table_input_replacement.setAttribute("id", "Replacement" + i);
        table_data_replacement.appendChild(table_input_replacement);
        table_row_contents.appendChild(table_data_replacement);

        filter_table.appendChild(table_row_contents);
    }

    var table_last_contents = document.createElement("tr");

    var table_add_collumn =  document.createElement("td");
    var table_add_row_button = document.createElement("input");
    var table_subtract_row_button = document.createElement("input");
    table_subtract_row_button.setAttribute("type", "button");
    table_subtract_row_button.setAttribute("value", "-");
    table_subtract_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_add_collumn.appendChild(table_subtract_row_button);
    table_subtract_row_button.addEventListener("click", removeRow);
    table_add_row_button.setAttribute("type", "button");
    table_add_row_button.setAttribute("value", "+");
    table_add_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_add_collumn.appendChild(table_add_row_button);
    table_add_row_button.addEventListener("click", addRow);

    table_last_contents.appendChild(table_add_collumn);

    var table_set_collumn =  document.createElement("td");
    var table_confirm_button = document.createElement("input");
    table_confirm_button.setAttribute("type", "button");
    table_confirm_button.setAttribute("id", "table_confirm_button");
    table_confirm_button.setAttribute("value", "Set Replacements");
    table_confirm_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_confirm_button.addEventListener("click", saveSettings);
    table_confirm_button.addEventListener("click", modifyDOM);
    table_confirm_button.addEventListener("click", filterToggle);
    table_set_collumn.appendChild(table_confirm_button);
    table_last_contents.appendChild(table_set_collumn);


    var table_close_collumn = document.createElement("td");
    var table_close_button = document.createElement("input");
    table_close_button.setAttribute("type", "button");
    table_close_button.setAttribute("value", "Close Menu");
    table_close_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_close_button.addEventListener("click",  filterToggle);
    table_close_collumn.appendChild(table_close_button);
    table_last_contents.appendChild(table_close_collumn);

    filter_table.appendChild(table_last_contents);

    document.body.appendChild(window_div);

}

function filterToggle(){
    if(window_displayed){
        document.getElementById("FilterWindow").style.display = "none";
        document.getElementById("FilterBackground").style.display = "none";
        window_displayed = false;
    }
    else{
        document.getElementById("FilterWindow").style.display = "inline-block";
        document.getElementById("FilterBackground").style.display = "inline-block";
        window_displayed = true;
    }
}

function filterButton(){
    var filter_button = document.createElement("input");
    filter_button.setAttribute("Value", "Word Filter Settings");
    filter_button.setAttribute("type", "button");
    filter_button.setAttribute("style", "position:absolute;top:75px");
    filter_button.addEventListener("click", filterWindow);
    document.body.appendChild(filter_button);
    filter_button.addEventListener("click", filterToggle);
}

function addRow(){
    var filter_table = document.getElementById("filter_table");
    filter_table.deleteRow(parseInt(number_of_filters) + 1);
    number_of_filters++;

    var table_row_contents = document.createElement("tr");
    table_row_contents.setAttribute("id", "FilterRow" +  (number_of_filters - 1));

    var table_data_active =  document.createElement("td");
    var table_checkbox_active = document.createElement("input");
    table_checkbox_active.setAttribute("type", "checkbox");
    table_checkbox_active.setAttribute("id", "Active" + (number_of_filters - 1));
    table_data_active.appendChild(table_checkbox_active);
    table_row_contents.appendChild(table_data_active);

    var table_data_pattern =  document.createElement("td");
    var table_input_pattern = document.createElement("input");
    table_input_pattern.setAttribute("class", "inputs");
    table_input_pattern.setAttribute("id", "Pattern" + (number_of_filters - 1));
    table_data_pattern.appendChild(table_input_pattern);
    table_row_contents.appendChild(table_data_pattern);

    var table_data_replacement =  document.createElement("td");
    var table_input_replacement =  document.createElement("input");
    table_input_replacement.setAttribute("class", "inputs");
    table_input_replacement.setAttribute("id", "Replacement" + (number_of_filters - 1));
    table_data_replacement.appendChild(table_input_replacement);
    table_row_contents.appendChild(table_data_replacement);

    filter_table.appendChild(table_row_contents);

    var table_last_contents = document.createElement("tr");

    var table_add_collumn =  document.createElement("td");
    var table_add_row_button = document.createElement("input");
    var table_subtract_row_button = document.createElement("input");
    table_subtract_row_button.setAttribute("type", "button");
    table_subtract_row_button.setAttribute("value", "-");
    table_subtract_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_add_collumn.appendChild(table_subtract_row_button);
    table_subtract_row_button.addEventListener("click", removeRow);
    table_add_row_button.setAttribute("type", "button");
    table_add_row_button.setAttribute("value", "+");
    table_add_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_add_collumn.appendChild(table_add_row_button);
    table_add_row_button.addEventListener("click", addRow);

    table_last_contents.appendChild(table_add_collumn);

    var table_set_collumn =  document.createElement("td");
    var table_confirm_button = document.createElement("input");
    table_confirm_button.setAttribute("type", "button");
    table_confirm_button.setAttribute("id", "table_confirm_button");
    table_confirm_button.setAttribute("value", "Set Replacements");
    table_confirm_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_confirm_button.addEventListener("click", saveSettings);
    table_confirm_button.addEventListener("click", modifyDOM);
    table_confirm_button.addEventListener("click", filterToggle);
    table_set_collumn.appendChild(table_confirm_button);
    table_last_contents.appendChild(table_set_collumn);

    var table_close_collumn = document.createElement("td");
    var table_close_button = document.createElement("input");
    table_close_button.setAttribute("type", "button");
    table_close_button.setAttribute("value", "Close Menu");
    table_close_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    table_close_button.addEventListener("click", filterToggle);
    table_close_collumn.appendChild(table_close_button);
    table_last_contents.appendChild(table_close_collumn);

    filter_table.appendChild(table_last_contents);
}

function removeRow(){
    var filter_table = document.getElementById("filter_table");
    if(number_of_filters != 0){
        filter_table.deleteRow(number_of_filters);
        number_of_filters--;
    }
}

function setTable(){
    var filter_count = 0;
    initial_filters.forEach(function(filter){
        if(filter[2] === null || filter[1] === null || filter[0] === null || filter_count == number_of_filters) return;
        if(filter[0] == "true"){
            document.getElementById("Active"+filter_count).checked = true;
        }
        else if(filter[0] == "false"){
            document.getElementById("Active"+filter_count).checked = false;
        }
        document.getElementById("Pattern"+filter_count).value = filter[1];
        document.getElementById("Replacement"+filter_count).value = filter[2];
        filter_count++;
    });
}


//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//
//222222222222222222222222222222222222222222222222222222222222////2222222222222222222222222222222222222222222222222222222222221111111111111111111111111111//

//Functions to set the DOM listener and observers

var hidden_count = 0;
function modifyDOM(){
	var start = document.getElementById("delform");
    var itterator = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENTS, NodeFilter.SHOW_ELEMENTS);
    var node = "";

    while((node = itterator.nextNode())){
        decisionProcess(node, itterator);
    }
    if(!page_setup)
        console.log("HIDDEN THREADS: " + hidden_count);
}

function decisionProcess(node, itterator){
    var cname = node.className;
    var tag = node.tagName;
    if(tag  === "IMG" || tag  === "img"){
        if(!/\d+IMG/.test(node.getAttribute("hide-grouping")) && (node.getAttribute("data-md5") !== null)){
            filterImage(node);
        }
    }
    else if(cname == "postMessage"){
        var blockquote_id = node.id;
        var already_filtered = false;
        filtered_threads.forEach(function(thread_id){
            if(thread_id == blockquote_id) {
                already_filtered = true;
                return;
            }
        });
        if(!already_filtered){
            if(itterator == undefined) itterator = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENTS, NodeFilter.SHOW_ELEMENTS);
            var localNode;
            while((localNode = itterator.nextNode())){
                var className = localNode.className;
                if(className == undefined || className == "quotelink"){
                    for(var i = 0 ; i < number_of_filters; i++){
                        if(kill[i] == true) continue;
                        filter = document.getElementById("Pattern"+i);
                        replacement = document.getElementById("Replacement"+i);
                        active = document.getElementById("Active"+i);
                        if(active.checked){
                            var lastChar = filter.value.length - 1;
                            var filterText = filter.value;
                            if(filterText === "") break;
                            var setting = filterText.substr(lastChar);
                            filterText = filterText.substr(1, lastChar-2);
                            try{
                                var regex = new RegExp(filterText, setting);
                                var node_text = localNode.textContent;
                                if(regex.test(node_text)){
                                    localNode.textContent = node_text.replace(regex, replacement.value);
                                    filtered_threads.push(blockquote_id);
                                }
                            }
                            catch(e){
                                alert(i + "'s regex was invalid");
                                kill[i] = true;
                            }
                        }
                    }
                }
                else break;
            }
        }
    }
}

function filterImage(node){
	var sister_node = node.parentNode.parentNode.parentNode.getElementsByClassName("catalog-thumb")[0]; // the catalog sister to index
	if(sister_node === undefined) sister_node = document.createElement("IMG");

	node.setAttribute("hide-grouping", node.parentNode.parentNode.id.substring(1) + "IMG");
	sister_node.setAttribute("hide-grouping", node.parentNode.parentNode.id.substring(1) + "IMG");

	node.addEventListener("click", hideImage, {passive:false, capture:false, once:false});
	sister_node.addEventListener("click", hideImage, {passive:false, capture:false, once:false});

	var threadstore_len = local_store_threads.length;
	var node_group_id = node.getAttribute("hide-grouping");

	for(var thread = 0 ; thread < threadstore_len; thread++){
		if(node_group_id == local_store_threads[thread]){
            node.setAttribute("hidden-src", node.src);
            node.src = blank_png;//this.src + ".HIDDEN" +  "?" + Date.now();

            sister_node.setAttribute("hidden-src", sister_node.src);
            sister_node.src = blank_png;//this.src + ".HIDDEN" +  "?" + Date.now();

			hidden_count++;
			return;
		}
	}
	//index node holds the MD5
	var node_md5 = node.getAttribute("data-md5");
	var md5_filters_arr_len = md5_filters_arr.length;
	for(var md5 = 0 ; md5 < md5_filters_arr_len; md5++){
		if(node_md5 == md5_filters_arr[md5]){
            node.setAttribute("hidden-src", node.src);
            node.src = blank_png;//this.src + ".HIDDEN" +  "?" + Date.now();

            sister_node.setAttribute("hidden-src", sister_node.src);
            sister_node.src = blank_png;//this.src + ".HIDDEN" +  "?" + Date.now();

			hidden_count++;
			return;
		}
	}
}

function hoverUIObserver(mutations){
	mutations.forEach(function(mutation){
		mutation.addedNodes.forEach(function(image_node){
			var is_embeded_post;
			if(image_node.tagName == "DIV") {
				is_embeded_post = true;
				image_node = image_node.getElementsByClassName("postContainer")[0];
				if(image_node === undefined) return;
			}

			var unprocessed_id = image_node.getAttribute("data-full-i-d");
			if (unprocessed_id === null) return;
			var proccessed_id = unprocessed_id.substring(unprocessed_id.indexOf(".") + 1);
			var image_node_id = proccessed_id + "IMG";
			if(is_embeded_post) image_node =  image_node.getElementsByTagName("IMG")[0];
			if(image_node === undefined) return;

			var threadstore_len = local_store_threads.length;
			for(var thread = 0 ; thread < threadstore_len; thread++){
				if(image_node_id == local_store_threads[thread]){
					image_node.removeAttribute("src");
					return;
				}
			}
			//thread node holds the MD5
			var node_md5;
			if(is_embeded_post) node_md5 = image_node.getAttribute("data-md5");
			else node_md5 = document.getElementById("f" + proccessed_id).getElementsByTagName("IMG")[0].getAttribute("data-md5");
			var md5_filters_arr_len = md5_filters_arr.length;
			for(var md5 = 0 ; md5 < md5_filters_arr_len; md5++){
				if(node_md5 == md5_filters_arr[md5]){
					image_node.removeAttribute("src");
					return;
				}
			}
		});
	});
}

//initial onload setup
function hideSetup(){
	retrieveStates();
    hideButton();
}

function filterSetup(){
    loadSettings();
    filterButton();
    filterWindow();
    setTable();
}

function pkxSetup(){
	expire_time =  localStorage.getItem("Expiration_Time");
	md5_filters = localStorage.getItem("MD5_List_FSE");

    hideSetup();
    filterSetup();
    // initial_setup_observer.disconnect();
	modifyDOM();
    document.addEventListener('PostsInserted',function(e){
		retrieveStates();
        modifyDOM();
    });
	new MutationObserver(function(mutations){
		retrieveStates();
		hoverUIObserver(mutations);
	}).observe(document.getElementById("hoverUI"), {childList: true});
}

//4chanX exists
var page_setup = false;
document.addEventListener('4chanXInitFinished', function(e) {
		browser = detectBrowser();
		pkxSetup();
		console.log("Script loaded: 4chanPKX");
		page_setup = true;
}, false);
