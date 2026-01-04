// ==UserScript==
// @name           Redmine Assign Support
// @version      0.1
// @description  try to take over the world!
// @match        */issues/*
// @include      *:*redmine*issues/*
// @namespace https://greasyfork.org/users/32974
// @downloadURL https://update.greasyfork.org/scripts/416887/Redmine%20Assign%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/416887/Redmine%20Assign%20Support.meta.js
// ==/UserScript==

(function () {

    function setup() {

	    oldSelect = document.getElementById("issue_assigned_to_id");
	    newSelect = document.createElement("select");

	    for(var i = 0, len = oldSelect.length; i < len; i++){
	        var o = document.createElement("option");
	        o.text = oldSelect.options[i].text;
	        try{
	            newSelect.add(o, null);
	        } catch(e) {
	            newSelect.add(o);
	        }
	    }

	    newSelect.selectedIndex = oldSelect.selectedIndex;
	    newSelect.addEventListener('change', reflectChange, false);
	    inputField = document.createElement("input");
	    inputField.id = 'redmineAssignSupport';

	    if(inputField.addEventListener) {
	        inputField.addEventListener('keyup', narrowDownSearch, false);
	    } else if(inputField.attachEvent) {
	        inputField.attachEvent('keyup', narrowDownSearch);
	    } else if(inputField.onkeyup) {
	        inputField.onkeyup = narrowDownSearch;
	    }

	    oldSelect.parentNode.insertBefore(inputField, oldSelect);
	    oldSelect.parentNode.insertBefore(newSelect, oldSelect);
	    oldSelect.style.display = "none";

	    reflectChangeInner();
	    inputField.focus();

	    function narrowDownSearch(){
	        removeAll(newSelect);
	        for(var i = 0, len = oldSelect.length; i < len; i++){
	            var v = this.value.toLowerCase();
	            if(oldSelect.options[i].text.replace("	", "").toLowerCase().match(v) || oldSelect.options[i].value.toLowerCase().match(v)){
	                var o = document.createElement("option");
	                o.text = oldSelect.options[i].text;
	                try{
	                    newSelect.add(o, null);
	                } catch(e) {
	                    newSelect.add(o);
	                }
	            }
	        }
	        if(newSelect.options[0]){
	            reflectChangeInner();
	        }
	    }

	    function removeAll(select){
	        for(var i = 0, len = select.length; i < len; i++) {
	            select.remove(0);
	        }
	    }

	    function reflectChange(event){
	        reflectChangeInner();
	    }

	    function reflectChangeInner(){
	        var selected = newSelect.options[newSelect.selectedIndex].text;
	        for(var i = 0, len = oldSelect.length; i < len; i++){
	            if(selected === oldSelect.options[i].text){
	                oldSelect.selectedIndex = i;
	                return;
	            }
	        }
	    }
    };

    var timer = 0;
    document.addEventListener('DOMNodeInserted', function() {
        if (timer) return;
        timer = setTimeout(function() {
            if (!document.getElementById('redmineAssignSupport')) {
                setup();
            }
            timer = 0;
        }, 30);
    }, false);


})();