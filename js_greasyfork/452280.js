// ==UserScript==
// @name          Trip Mode vCracked cRACK
// @description	  A modern Convo.trip module. #101025 #110101001
// @author        0xDzul
// @include       https://cracked.io/*
// @include       https://cracked.io/*
// @include       http://*.cracked.io/*
// @include       https://*.cracked.io/*
// @version       1.0
// @icon          ==🃏

// @namespace https://greasyfork.org/users/962736
// @downloadURL https://update.greasyfork.org/scripts/452280/Trip%20Mode%20vCracked%20cRACK.user.js
// @updateURL https://update.greasyfork.org/scripts/452280/Trip%20Mode%20vCracked%20cRACK.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var styles = `body
	{
		position:absolute;
		height:200%!important;
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