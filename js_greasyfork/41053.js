// ==UserScript==
// @name				Better Live.me
// @namespace	    	https://greasyfork.org/en/users/14254
// @description         optimize something...
// @icon				https://lh3.googleusercontent.com/Q1I5dN_1a5pABToRowOygo5mUklXLb-uWrUoSX4qEurTUI6bTSnowOAVJA4uSxrL_Q=w300
// @include		        http*://*.liveme.com/live.html?videoid=*
// @version		    	1.01
// @grant			    none
// @require				https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author			    2015+, anyone, 14254
// @downloadURL https://update.greasyfork.org/scripts/41053/Better%20Liveme.user.js
// @updateURL https://update.greasyfork.org/scripts/41053/Better%20Liveme.meta.js
// ==/UserScript==


//		m3u8
$('.nav').append( '<a id="betterLM1" href="#" class="link" style="color:red">m3u8</a>' );
$('#betterLM1').click(function() {
	var elem = 'param[name="flashvars"]';
	var val = $(elem).val();
	var url = val.split("a=")[1].split("m3u8")[0]+"m3u8";
	alert(""+url+"");
});


//		hearts
$('.nav').append( '<a id="betterLM2" href="#" class="link" style="color:red">Hearts</a>' );
$('#betterLM2').click(function() {
	$('.hot_heart').remove();
});

