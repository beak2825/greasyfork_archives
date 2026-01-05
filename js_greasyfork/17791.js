// ==UserScript==
// @name           Other Style
// @namespace      arreloco
// @include        http://www.kongregate.com/*
// @version 0.0.1.20160306141517
// @description Different Kong Style
// @downloadURL https://update.greasyfork.org/scripts/17791/Other%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/17791/Other%20Style.meta.js
// ==/UserScript==
headss = document.getElementsByTagName("head")[0];
fileref = document.createElement("style");
fileref.setAttribute("type", "text/css");
fileref.innerHTML = ".old_school_sign_in #header, .drop_down_sign_in #header{height: 40px;}	.drop_down_sign_in #welcome{position:relative;}	#header #header_logo{width:200px;}	.new_nav_split #header h2 a{display:none;}	.drop_down_sign_in #welcome{top:0px;}	#header h3#playing{position:relative;top:-3px;}	#headerwrap{background-color:#000000;}"
headss.appendChild(fileref)