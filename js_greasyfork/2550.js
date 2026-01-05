// ==UserScript==
// @name			Procore - Blueprints
// @author			Chet Manley
// @version			0.1
// @description			Procore 
// @include			https://www.procoretech.com/mechanical_turk/*
// @require			http://code.jquery.com/jquery-latest.min.js
// @namespace x
// @downloadURL https://update.greasyfork.org/scripts/2550/Procore%20-%20Blueprints.user.js
// @updateURL https://update.greasyfork.org/scripts/2550/Procore%20-%20Blueprints.meta.js
// ==/UserScript==

$('#drawing_number').focus();
$('body > img').hide();
$('body > hr').append('<div id="cm_cropped_image"></div>');
$('#cm_cropped_image').css('height', '550px');
$('#cm_cropped_image').css('background-image', 'url(' + $('body > img').prop('src') + ')');
$('#cm_cropped_image').css('background-position', 'right bottom');
$('#cm_cropped_image').css('background-repeat', 'no-repeat');