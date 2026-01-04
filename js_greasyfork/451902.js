// ==UserScript==
// @name          Trip Mode vMeta - Messenger
// @namespace     http://userstyles.org
// @description	  A modern Convo.trip module. #101025 #110101001
// @author        0xDzul
// @include       http://facebook.com/*
// @include       https://facebook.com/*
// @include       http://*.facebook.com/*
// @include       https://*.facebook.com/*
// @include       http://messenger.com/*
// @include       https://messenger.com/*
// @include       http://*.messenger.com/*
// @include       https://*.messenger.com/*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/451902/Trip%20Mode%20vMeta%20-%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/451902/Trip%20Mode%20vMeta%20-%20Messenger.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var styles = `
    <script>body{
       	{
	position:absolute;
	height:100vh!important;
	width:100%!important;
	left:0!important;
	right:0!important;
	top:0!important;
	bottom:0!important;
	position:absolute!important;
	background-image:-webkit-linear-gradient(91deg,#26F33C,#3AFE46);
	animation:animate 3s linear infinite;
	}
	@keyframes animate {
	from{-webkit-filter:hue-rotate(0deg)}to{-webkit-filter:hue-rotate(360deg);
	}
	@-webkit-keyframes\
	from{-webkit-filter:hue-rotate(0deg)}to{-webkit-filter:hue-rotate(360deg);
	}
	@-moz-keyframes\
	from{-webkit-filter:hue-rotate(0deg)}to{-webkit-filter:hue-rotate(360deg);
	}
	@-o-keyframes
	from{-webkit-filter:hue-rotate(0deg)}to{-webkit-filter:hue-rotate(360deg);
        }`
	var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();