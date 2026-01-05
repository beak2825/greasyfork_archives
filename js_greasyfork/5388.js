// ==UserScript==
// @name        GreasyFork Plus
// @namespace   407d4100-4661-11e4-916c-0800200c9a66
// @description Improves the layout of GreasyFork.org
// @include     *://greasyfork.org*
// @include 	*://*.sleazyfork.org*
// @version     1.1.2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/5388/GreasyFork%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/5388/GreasyFork%20Plus.meta.js
// ==/UserScript==
GM_addStyle("\
	body>.notice {\
		width: 920px;\
		font-weight: bold;\
		margin: 16px auto -10px;\
	}\
	body {\
		background: #F1F1F1;\
	}\
	a {\
		color: #167AC6;\
		text-decoration: none;\
	}\
	a:hover {\
		text-decoration: underline;\
	}\
");
if(document.location.href.indexOf("greasyfork.org/scripts") > -1) {
	GM_addStyle("\
		#browse-script-list {\
			margin-top: 0px;\
			font-size: 0px;\
		}\
		#browse-script-list li {\
			margin: 0px;\
		}\
		article {\
			padding: 6px 12px;\
			width: 920px;\
			margin: 0px auto;\
			border: 1px solid #E2E2E2;\
			border-bottom: 0px;\
			background: #FFFFFF;\
		}\
		article h2 .name-description-separator {\
			display: none;\
		}\
		article h2 .description {\
			display: block;\
		}\
		article dl {\
			display: none;\
		}\
		article .description {\
			font-size: 14px;\
		}\
		.pagination {\
			padding: 16px 212px 6px;\
			height: 30px;\
			width: 520px;\
			background: #FFFFFF;\
			border: 1px solid #E2E2E2;\
			border-top: 0px;\
			margin: 0px auto;\
			-webkit-border-bottom-left-radius: 6px;\
			-webkit-border-bottom-right-radius: 6px;\
			-moz-border-radius-bottomleft: 6px;\
			-moz-border-radius-bottomright: 6px;\
			border-bottom-left-radius: 6px;\
			border-bottom-right-radius: 6px;\
		}\
		.pagination .current {\
			font-style: normal;\
			font-weight: bold;\
		}\
		.pagination a:last-child {\
			float: right;\
		}\
		body>p {\
			display: none;\
		}\
		body>ol li:last-child article {\
			border-bottom: 1px solid #E2E2E2;\
		}\
		#script-list-option-groups {\
			float: none;\
			width: 920px;\
			margin: 16px auto 0px;\
			padding: 6px 12px;\
			background: #FFFFFF;\
			border: 1px solid #E2E2E2;\
			border-bottom: 0px;\
			-webkit-border-top-left-radius: 6px;\
			-webkit-border-top-right-radius: 6px;\
			-moz-border-radius-topleft: 6px;\
			-moz-border-radius-topright: 6px;\
			border-top-left-radius: 6px;\
			border-top-right-radius: 6px;\
		}\
		#script-list-option-groups #script-list-filter {\
			display: none;\
		}\
		#script-list-option-groups #script-list-sort {\
			padding: 0px;\
			background: none;\
			height: 40px;\
		}\
		#script-list-option-groups #script-list-sort li {\
			display: block;\
			float: left;\
			width: 12%;\
			text-align: center;\
			font-size: 14px;\
			margin: 12px auto;\
		}\
		#script-list-option-groups #script-list-sort {\
			font-size: 0px;\
		}\
		\
		#script-content {\
			border: 1px solid #E1E1E1;\
			background: #FFFFFF;\
			width: 920px;\
			margin: 0px auto 16px;\
			padding: 12px;\
			-webkit-border-radius: 6px;\
			-moz-border-radius: 6px;\
			border-radius: 6px;\
		}\
		#script-info header h2, #script-info header p {\
			margin: 6px auto;\
			width: 920px;\
		}\
		#script-links {\
			width: 920px;\
			margin: 0px auto;\
		}\
		#script-links li {\
			border-color: #E1E1E1;\
			-webkit-border-top-left-radius: 2px;\
			-webkit-border-top-right-radius: 2px;\
			-moz-border-radius-topleft: 2px;\
			-moz-border-radius-topright: 2px;\
			border-top-left-radius: 2px;\
			border-top-right-radius: 2px;\
		}\
		#install-stats-chart-container {\
			display: none;\
		}\
		#additional-info div {\
			background: none;\
			padding: 0px;\
			padding-top: 6px;\
		}\
	");
	
	if(document.location.href.indexOf("-") == -1 || document.location.href.indexOf("/by-site/") > -1) { // Applies only on search results (not script pages)
		document.body.children[3].children[0].innerHTML = "◀";
		document.body.children[3].lastChild.innerHTML = "▶";
		document.body.children[3].innerHTML += "<a href='/script_versions/new'>Post a script</a>";
		document.getElementById("script-list-sort").children[0].innerHTML += "\n<li class='script-list-option'><a href='/scripts/by-site'>By site</a></li>";
	}
}
else if(document.location.href.indexOf("greasemonkey.org/forum/") == -1) {
	var el, wrapper = document.createElement('div');
	wrapper.id = "wrapper";
	while (el = document.body.children[1]) {
		wrapper.appendChild(el);
	}
	document.body.appendChild(wrapper);
	GM_addStyle("\
	#wrapper {\
		width: 920px;\
		padding: 6px 12px;\
		background: #FFFFFF;\
		margin: 16px auto;\
		border: 1px solid #E1E1E1;\
		-webkit-border-radius: 6px;\
		-moz-border-radius: 6px;\
		border-radius: 6px;\
	}\
	#script-list-option-groups {\
		display: none;\
	}\
	");
	if(document.location.href.indexOf("greasyfork.org/users/") > -1) {
		GM_addStyle("\
			#wrapper {\
				padding-top: 0px;\
			}\
			#control-panel {\
				width: 920px;\
				padding: 6px 12px;\
				margin: 6px auto 0px;\
				height: 40px;\
				-webkit-border-top-left-radius: 6px;\
				-webkit-border-top-right-radius: 6px;\
				-moz-border-radius-topleft: 6px;\
				-moz-border-radius-topright: 6px;\
				border-top-left-radius: 6px;\
				border-top-right-radius: 6px;\
				background: #FFFFFF;\
				border: 1px solid #E1E1E1;\
				border-bottom: 0px;\
			}\
			#control-panel header {\
				display: none;\
			}\
			#user-control-panel li {\
				margin-top: -6px;\
				display:block;\
				float: left;\
				width: 14%;\
				text-align: center;\
			}\
			article h2 .name-description-separator {\
				display: none;\
			}\
			article h2 .description {\
				display: block;\
			}\
			article dl {\
				display: none;\
			}\
			article .description {\
				font-size: 14px;\
			}\
			h2 {\
				width: 920px;\
				font-size: 32px;\
				margin: 6px auto;\
			}\
		");
		
		document.body.appendChild(document.getElementById("wrapper").children[0]);
		document.body.appendChild(document.getElementById("wrapper")); // Sets the element to the bottom of its list of siblings
	
		if(document.getElementById("user-control-panel")) { // If signed in
			document.body.appendChild(document.getElementById("control-panel"));
			document.body.appendChild(document.getElementById("wrapper"));
			
			GM_addStyle("\
				#wrapper {\
					margin-top: 0px;\
					-webkit-border-top-left-radius: 0px;\
					-webkit-border-top-right-radius: 0px;\
					-moz-border-radius-topleft: 0px;\
					-moz-border-radius-topright: 0px;\
					border-top-left-radius: 0px;\
					border-top-right-radius: 0px;\
				}\
			");
			
			document.getElementById("user-control-panel").children[3].children[0].innerHTML = "GH Webhook";
			document.getElementById("user-control-panel").children[5].children[0].innerHTML = "Sign in methods";
		}
	}
}
