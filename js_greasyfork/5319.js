// ==UserScript==
// @name        AH-Chatcolor
// @author      Nugorra
// @namespace   ahchatcolor
// @description Eine Farbauswahlbox für den Chat des Browsergames Aquahaze. Orginal Idee von BaLLeRTroeTe, überarbeitet von Nugorra
// @include     http://world*.aquahaze.de/*
// @version     1.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5319/AH-Chatcolor.user.js
// @updateURL https://update.greasyfork.org/scripts/5319/AH-Chatcolor.meta.js
// ==/UserScript==
var frameWidth = $('#wideframe').width();
var divStyle = {padding: '10px', position: 'relative'};
var inputStyle = {width:'370px',margin:'0 10px 0 0'};
var spanStyle = {position:'absolute',top:'15px',right:'10px'};

$(document).ready(function(){
	$('#frame').after('<div id="colorDiv"></div>');
	$('#colorDiv').append('<input id="colorPicker" type="color" />' );
	$('#colorDiv').append('<span class="deletText">X</span>');
	$('#colorDiv').css(divStyle);
	$('#colorPicker').css(inputStyle);
	$('.deletText').css(spanStyle);
	
	$('#colorPicker').change(function(){
		var farbe = $('#colorPicker').val();
		$('form input[type=text]').val('/color ' + farbe);
	});
	$('.deletText').click(function(){
		$('form input[type=text]').val('');
	});
	
});
