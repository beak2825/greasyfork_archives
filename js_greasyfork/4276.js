// ==UserScript==
// @name       	  	FireCold Source
// @version    	  	1.0.2
// @description   	Redirect firecold video to youtube source if it exists.
// @include  		http*://*.firecold.com/videos/*
// @namespace		https://greasyfork.org/users/3159
// @downloadURL https://update.greasyfork.org/scripts/4276/FireCold%20Source.user.js
// @updateURL https://update.greasyfork.org/scripts/4276/FireCold%20Source.meta.js
// ==/UserScript==

var x=document.getElementById('player').nextElementSibling.text
var id = ((x.split('v='))[1].split('")'))[0]
if (id) location.replace("https://www.youtube.com/watch?v=" + id)