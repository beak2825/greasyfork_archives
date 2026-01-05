// ==UserScript==
// @name        Webadmin - searchable formcollection
// @namespace   com.aforms2web.ds.ujs
// @description Make Application/FormCollection selection searchable
// @author      dietmar.stoiber@aforms2web.com
// @include     *webadmin*
// @version     0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19989/Webadmin%20-%20searchable%20formcollection.user.js
// @updateURL https://update.greasyfork.org/scripts/19989/Webadmin%20-%20searchable%20formcollection.meta.js
// ==/UserScript==

init(); 

function init(){
    var select = $("#afs_application");
    if(select.size() > 0){
	select.attr("size", 10);
	select.attr("style", "min-height: 3em");
	
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.innerHTML = "Filter";
	tr.appendChild(td);
	td = document.createElement("td");

	var input = document.createElement("input");
	input.addEventListener ('keydown', stopMovingCarretONUpDown, true);
	input.addEventListener ('keyup', filter, true);
	input.setAttribute("id", "afs_application_filter"); 	
	input.setAttribute("type", "text"); 	
	input.setAttribute("autocomplete", "off"); 	
	input.setAttribute("class", "input_field_size300"); 	
	input.setAttribute("style", "border-top-right-radius: 5em 2em;"); 	
	td.appendChild(input);

	tr.appendChild(td);
	select.closest("tbody").prepend(tr);

	input.focus();

    }
}

var appSelect_currentSelected = null;

function stopMovingCarretONUpDown(event){
	if(event.keyCode == 38 || event.keyCode == 40){ 
	    event.preventDefault();
	}
}

function filter(event){
    var filter = $("#afs_application_filter").val();
    var appSelect = $("#afs_application");
    var selected = null;
    var first = null;
    if(appSelect_currentSelected != null){		
	if(event.keyCode == 38){ // up
	    appSelect_currentSelected.prevAll(':not(:disabled)').first().attr("selected", true);
	    appSelect_currentSelected = appSelect.find("option:selected");
	    return;
	}else if(event.keyCode == 40){ // down
	    appSelect_currentSelected.nextAll(':not(:disabled)').first().attr("selected", true);
	    appSelect_currentSelected = appSelect.find("option:selected");
	    return;
	}
    }
	appSelect_currentSelected = null;
	$("#afs_application > option").each(function() {
	    if(this.text.indexOf(filter) >= 0 || this.text.match(new RegExp(filter, 'gi'))){
		$(this).attr("style", "");
		$(this).attr("disabled", false);
		if(first == null){
		    first = $(this);
		}
		if($(this).attr("selected") && selected == null){
		    appSelect_currentSelected = $(this);
		}
	    }else{
		$(this).attr("style", "display: none; visibility: hidden;");
		$(this).attr("disabled", true);
		$(this).attr("selected", false);
	    }
	});
	if(appSelect_currentSelected == null){
	    first.attr("selected", true);
	    appSelect_currentSelected = appSelect.find("option:selected");
	}
	if(appSelect_currentSelected != null){
	    appSelect.scrollTop(appSelect_currentSelected.position().top);
	}
}