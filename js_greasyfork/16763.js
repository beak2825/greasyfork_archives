// ==UserScript==
// @name        Auto Login for FUN services
// @namespace   https://twitter.com/sititou70
// @description This is plugin for auto login in FUN services.
// @include     /https?:\/\/auth\.fun\.ac\.jp/
// @include     /https?:\/\/wifi\.fun\.ac\.jp\/.*/
// @include     /https?:\/\/student\.fun\.ac\.jp\/up\/faces\/login\/Com00501A.jsp/
// @include     /https?:\/\/vle\.c\.fun\.ac\.jp\/moodle\/login\/index\.php/
// @include     /https?:\/\/hope\.c\.fun\.ac\.jp\/login\/index\.php/
// @include     /https?:\/\/hope\.c\.fun\.ac\.jp\/cas\/login\.*/
// @include     /https?:\/\/hope\.c\.fun\.ac\.jp\/enrol\/.*/
// @include     /https?:\/\/manaba\.fun\.ac\.jp\/ct\/login/
// @include     /https?:\/\/webdav\.fun\.ac\.jp\/proself\/login\/login\.go.*/
// @include     /https?:\/\/webdav\.fun\.ac\.jp\/proself\/login\/login\.go.*/
// @include     /https?:\/\/webdav\.fun\.ac\.jp\/proself\/weblink\.go.*/
// @include     /https?:\/\/webmail\.fun\.ac\.jp\/cgi-bin\/index\.cgi/
// @include     /https?:\/\/webmail\.fun\.ac\.jp\/cgi-bin\/htmlparse\.cgi\?html=sessionout\.html/
// @include     /.*auto.*login.*for.*fun.*services.*settings.*/
// @require     https://code.jquery.com/jquery-2.2.3.min.js
// @version     3.4
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/16763/Auto%20Login%20for%20FUN%20services.user.js
// @updateURL https://update.greasyfork.org/scripts/16763/Auto%20Login%20for%20FUN%20services.meta.js
// ==/UserScript==
(function(){

var login_function = {};
login_function.fun_network = function(){
	if(document.querySelector("body > center:nth-child(1) > form:nth-child(6) > input:nth-child(3)") !== null){
		document.querySelector("body > center:nth-child(1) > form:nth-child(6) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > input:nth-child(1)").value = settings.fun_network.id;
		document.querySelector("body > center:nth-child(1) > form:nth-child(6) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > input:nth-child(1)").value = settings.fun_network.password;
		document.querySelector("body > center:nth-child(1) > form:nth-child(6) > input:nth-child(3)").click();
	}
};
login_function.fun_wifi = function(){
	if(document.querySelector("#actionBtn > input:nth-child(1)") !== null){
		document.querySelector("#username").value = settings.fun_wifi.id;
		document.querySelector("#password").value = settings.fun_wifi.password;
		document.querySelector("#actionBtn > input:nth-child(1)").click();
	}
};
login_function.student = function(){
	if(document.getElementById("form1:login") !== null){
		document.getElementById("form1:htmlUserId").value = settings.student.id;
		document.getElementById("form1:htmlPassword").value = settings.student.password;
		document.getElementById("form1:login").click();
	}
};
login_function.moodle = function(){
	if(document.querySelector("#loginbtn") !== null){
		document.querySelector("#username").value = settings.moodle.id;
		document.querySelector("#password").value = settings.moodle.password;
		document.querySelector("#loginbtn").click();
	}
};
login_function.hope_fun = function(){
	document.location = "https://hope.c.fun.ac.jp/login/index.php?authCAS=CAS";
};
login_function.hope_cas = function(){
	if(document.querySelector(".btn-submit") !== null){
		document.querySelector("#username").value = settings.hope.id;
		document.querySelector("#password").value = settings.hope.password;
		document.querySelector(".btn-submit").click();
	}
};
login_function.hope_enrol = function(){
	if(document.querySelector("input[value=続ける],input[value=Continue]") !== null)document.querySelector("input[value=続ける],input[value=Continue]").click();
};
login_function.manaba = function(){
	if(document.querySelector("#login") !== null){
		document.querySelector("#mainuserid").value = settings.manaba.id;
		document.querySelector(".layout > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > input:nth-child(1)").value = settings.manaba.password;
		document.querySelector("#login").click();
	}
};
login_function.webdav = function(){
	if(document.querySelector("input.input_buttonlogin:nth-child(1)") !== null){
		document.querySelector("table.tbl-no-space:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > input:nth-child(1)").value = settings.webdav.id;
		document.querySelector("table.tbl-no-space:nth-child(2) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3) > input:nth-child(1)").value = settings.webdav.password;
		document.querySelector("input.input_buttonlogin:nth-child(1)").click();
	}
};
login_function.webdav_weblink = function(){
	if(document.querySelector("input.input_buttonlogin:nth-child(1)") !== null){
		document.querySelector("table.tbl-no-space:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > input:nth-child(1)").value = settings.webdav.id;
		document.querySelector("table.tbl-no-space:nth-child(2) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3) > input:nth-child(1)").value = settings.webdav.password;
		document.querySelector("input.input_buttonlogin:nth-child(1)").click();
	}
};
login_function.fun_mail = function(){
	if(document.querySelector(".LButton") !== null){
		document.querySelector("#userid").value = settings.fun_mail.id;
		document.querySelector("#userpwd").value = settings.fun_mail.password;
		document.querySelector(".LButton").click();
	}
};
login_function.fun_mail_sessionout = function(){
	document.location = "https://webmail.fun.ac.jp/cgi-bin/index.cgi";
};
login_function.setting = function(){
	create_setting_html();
};

var sites = [
	["fun_network", "https?:\/\/auth\.fun\.ac\.jp"],
	["fun_wifi", "https?:\/\/wifi\.fun\.ac\.jp\/.*"],
	["student", "https?:\/\/student\.fun\.ac\.jp\/up\/faces\/login\/Com00501A.jsp"],
	["moodle", "https?:\/\/vle\.c\.fun\.ac\.jp\/moodle\/login\/index\.php"],
	["hope_fun", "https?:\/\/hope\.c\.fun\.ac\.jp\/login\/index\.php"],
	["hope_cas", "https?:\/\/hope\.c\.fun\.ac\.jp\/cas\/login\.*"],
	["hope_enrol", "https?:\/\/hope\.c\.fun\.ac\.jp\/enrol\/.*"],
	["manaba", "https?:\/\/manaba\.fun\.ac\.jp\/ct\/login"],
	["webdav", "https?:\/\/webdav\.fun\.ac\.jp\/proself\/login\/login\.go.*"],
	["webdav_weblink", "https?:\/\/webdav\.fun\.ac\.jp\/proself\/weblink\.go.*"],
	["fun_mail", "https?:\/\/webmail\.fun\.ac\.jp\/cgi-bin\/index\.cgi"],
	["fun_mail_sessionout", "https?:\/\/webmail\.fun\.ac\.jp\/cgi-bin\/htmlparse\.cgi\\?html=sessionout\.html"],
	["setting", ".*auto.*login.*for.*fun.*services.*settings.*"]
];

var judge_now_site = function(url){
	var now_site = "not_found";
	for(var i = 0; i < sites.length; i++){
		if(RegExp(sites[i][1]).test(url)){
			now_site = sites[i][0];
			break;
		}
	}
	
	return now_site;
};

var save_settings = function(){
	$.each(settings, function(name, obj){
		settings[name].id = $("#input_" + name + "_id").val();
		settings[name].password = $("#input_" + name + "_password").val();
	});
	
	GM_setValue("settings", JSON.stringify(settings));
	$("div").append("<p>done!</p>");
};

var reset_settings = function(){
	GM_deleteValue("settings");
	location.reload(true);
};

var create_setting_html = function(){
	var wrap_div = $("<div>");
	wrap_div.css("margin", "20px");
	wrap_div.append("<h1>Auto Login for FUN services settings</h1>");
	
	$.each(settings, function(name, obj){
		wrap_div.append("<h2>" + name + "</h2>");
		
		var inputs = $("<p>");
		inputs.append("<span>id:</span>");
		inputs.append("<input type='text' id='input_" + name + "_id' value='" + obj.id + "'>");
		inputs.append("<span>password:</span>");
		inputs.append("<input type='password' id='input_" + name + "_password' value='" + obj.password + "'>");
		
		wrap_div.append(inputs);
	});
	
	wrap_div.append("<button id='save_settings'>save</button>");
	wrap_div.append("<button id='reset_settings'>reset settings</button>");
	
	//style
	wrap_div.find("div").css("margin", "20px");
	wrap_div.find("p").css("margin", "-10px 0px 20px 0px");
	wrap_div.find("input").css("margin", "0px 20px 0px 0px");
	wrap_div.find("span").css("margin", "0px 0px 0px 10px");
	wrap_div.find("button").css("margin", "0px 5px 0px 5px");
	
	$("body").html(wrap_div);
	
	$("#save_settings").click(save_settings);
	$("#reset_settings").click(reset_settings);
};

var settings = {
	fun_network: {
		id: "",
		password: ""
	},
	fun_wifi: {
		id: "",
		password: ""
	},
	student: {
		id: "",
		password: ""
	},
	moodle: {
		id: "",
		password: ""
	},
	hope: {
		id: "",
		password: ""
	},
	manaba: {
		id: "",
		password: ""
	},
	webdav: {
		id: "",
		password: ""
	},
	fun_mail: {
		id: "",
		password: ""
	}
};


//load settings
if(GM_getValue("settings") === undefined){
	GM_setValue("settings", JSON.stringify(settings));
}else{
	var load_settings = JSON.parse(GM_getValue("settings"));
	
	$.each(load_settings, function(name, obj){
		settings[name].id = load_settings[name].id;
		settings[name].password = load_settings[name].password;
	});
}


if(judge_now_site(document.referrer) == judge_now_site(document.URL))return;

//do auto login
login_function[judge_now_site(document.URL)]();

})();