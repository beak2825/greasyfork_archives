// ==UserScript==
// @name         Ingress Report inappropriate gameplay Tool
// @namespace    ingressboxy
// @version      0.2
// @description  Auto Report inappropriate gameplay
// @author       QQBoxy
// @match        https://support.ingress.com/hc/*/requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28514/Ingress%20Report%20inappropriate%20gameplay%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/28514/Ingress%20Report%20inappropriate%20gameplay%20Tool.meta.js
// ==/UserScript==

//提交前
//https://support.ingress.com/hc/zh-tw/requests/new?ticket_form_id=164398

//提交完成後
//https://support.ingress.com/hc/zh-tw/requests/397683

(function() {
    'use strict';
    function $(id) {
		return document.getElementById(id.substr(1));
	}
	function getCookie(name) {
	    var n = name + "=";
	    var nlen = n.length;
	    var clen = document.cookie.length;
	    var i = 0;
	    while(i < clen) {
	        var j = i + nlen;
	        if(document.cookie.substring(i, j) == n) {
	            var endstr = document.cookie.indexOf(";", j);
	            if(endstr == -1)
	                endstr = clen;
	            return unescape(document.cookie.substring(j, endstr));
	        }
	        i = document.cookie.indexOf(" ", i) + 1;
	        if(i == 0) break;
	    }
	    return null;
	}
	if(!window.location.pathname.match("/hc/zh-tw/requests/new")) {
		if(parseInt(getCookie("loop"),10)==1) {
			window.location = "https://support.ingress.com/hc/zh-tw/requests/new?ticket_form_id=164398";
		}
		return;
	}
	
	var TARGET = 0;
	if(parseInt(getCookie("loop"),10)==1) {
		TARGET = parseInt(getCookie("target"),10) + 1;
		document.cookie = "target=" + escape(TARGET+"");
	}
	
	var TYPE = 0;
	if(parseInt(getCookie("loop"),10)==1) {
		TYPE = parseInt(getCookie("type"),10);
	}
	
	var NAME = "";
	if(parseInt(getCookie("loop"),10)==1) {
		NAME = getCookie("name");
	}
	
	var INFO_TEXT = "The following agent are the same guy.";
	var SUBJECT_TEXT = [
		"Multi-account sharing",
		"Account buying/selling",
		"GPS spoofing",
	];
	var OPTIONS = [
		"abuse_ma",
		"abuse_sell",
		"abuse_cheat"
	];
	var OPTIONS_EXPLAIN = [
		"Multiple accounts/account sharing",
		"Account buying/selling",
		"GPS spoofing"
	];
	var INAPPROPRIATE = "";
    var CODENAMES = [];
    if(getCookie("codenames")) {
    	var codenames = JSON.parse(getCookie("codenames"));
    	CODENAMES = codenames;
    }
    var guys = "";
    var at_guys = "";
    for(var c in CODENAMES) {
    	guys += ( (c==0)?"":"\n" ) + CODENAMES[c];
    	at_guys += "\n@" + CODENAMES[c];
    }
    
	if(parseInt(getCookie("loop"),10)==1) {
		if(TARGET>=CODENAMES.length) {
			TARGET = 0;
			document.cookie = "loop=" + escape("0");
			document.cookie = "target=" + escape("0");
		}
	}
    
    //Form
    var form = $("#new_request");
	//Your email address
	//var email = $("#request_anonymous_requester_email");
	//Subject
	var subject = $("#request_subject");
	//Additional info/reason for your request
	var description = $("#request_description");
	//Type of inappropriate gameplay
	var inappropriate = $("#request_custom_fields_26993577");
	var inappropriate_text = inappropriate.nextElementSibling;
	//Codename of suspected Agent (one codename per report, please)
	var suspected = $("#request_custom_fields_27867927");
	//Your codename
	var codename = $("#request_custom_fields_26753947");
	
	subject.value = (CODENAMES[TARGET]?CODENAMES[TARGET]+" ":"") + SUBJECT_TEXT[TYPE];
	description.value = INFO_TEXT + at_guys;
	inappropriate.value = OPTIONS[TYPE];
	inappropriate_text.innerHTML = OPTIONS_EXPLAIN[TYPE];
    suspected.value = CODENAMES[TARGET]?CODENAMES[TARGET]:"";
    codename.value = NAME;
    
    var control = document.createElement("div");
    
    var div = document.createElement("div");
    div.setAttribute("class", "form-field text required request_description");
    
    var label = document.createElement("label");
    label.setAttribute("for", "request_description");
    label.innerHTML = "Input codename list";
    
    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", "codename_list");
    textarea.onkeyup = function() {
		var list_arr = $("#codename_list").value.split("\n");
    	var at_guys = "";
		for(var c in list_arr) {
	    	at_guys += "\n@" + list_arr[c];
	    }
	    $("#request_description").value = INFO_TEXT + at_guys;
    	$("#request_subject").value = (list_arr[0]?list_arr[0]+" ":"") + SUBJECT_TEXT[0];
	    $("#request_custom_fields_27867927").value = list_arr[0]?list_arr[0]:"";
	};
    textarea.value = guys;
    
    div.appendChild(label);
    div.appendChild(textarea);
    control.appendChild(div);
    
    form.parentNode.insertBefore(control, form);
    
	console.log("TARGET:", getCookie("target"));
	console.log("LOOP:", getCookie("loop"));
	console.log("TYPE:", getCookie("type"));
	console.log("NAME:", getCookie("name"));
    if(parseInt(getCookie("loop"),10)==1) {
    	/*setTimeout(function() {
    		window.location = "https://support.ingress.com/hc/zh-tw/requests/397683";
    	}, 2000);*/
    	//form.submit();
    }
    form.onsubmit = function() {
    	if(parseInt(getCookie("loop"),10)!=1) {
    		var name = $("#request_custom_fields_26753947").value;
    		var list_arr = $("#codename_list").value.split("\n");
    		var list_text = JSON.stringify(list_arr, null, 0);
			var type = 0;
			for(type=0;type<OPTIONS.length;type++) {
				if(OPTIONS[type] == inappropriate.value) break;
			}
			document.cookie = "target=" + escape("0");
			document.cookie = "codenames=" + escape(list_text);
			document.cookie = "type=" + escape(type);
			document.cookie = "loop=" + escape("1");
			document.cookie = "name=" + escape(name);
			
			//window.location = "https://support.ingress.com/hc/zh-tw/requests/397683";
			form.submit();
		}
    	return false;
	};
})();