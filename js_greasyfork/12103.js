// ==UserScript==
// @namespace  allocine-lite
// @name       Allociné Lite
// @version    1.3
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      http://www.allocine.fr/*
// @description Removes useless things
// @downloadURL https://update.greasyfork.org/scripts/12103/Allocin%C3%A9%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/12103/Allocin%C3%A9%20Lite.meta.js
// ==/UserScript==

$('.main-wrapper').prev('div').remove();

$("body").css("background-image", "none");
$("body").css("background-color", "#332E2E");

$("#disqus_thread").remove();
$('.player-footer').remove();
$('section .titlebar .titlebar-title-md:contains("Commentaires")').remove();
$('.disqus-logged-out').remove();
$('.col-right div:first').remove();
$('.fb-page').remove();
$('#topheader').remove();
$('.mdl-rc .titlebar-title-md:contains("Suivez-nous avec Passion")').remove();


$('.entity-card-list span.light:contains("Date de reprise")').each(function() {
  
  $(this).css('border', '1px solid red');
  $(this).parents().eq(3).html("<i>ℹ️ Resortie masquée.</i>");
});



if($('.gallery-media.photo').length > 0)
{
	var src = $('.gallery-media.photo').attr('src');
	var url = src.replace('r_1280_720/', '');
	window.location = url;
}