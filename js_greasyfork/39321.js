// ==UserScript==
// @name         mturk tv xport qual link qual requester!!!
// @version      1.1
// @description  always be quallin'!
// @namespace    https://greasyfork.org/users/64880
// @author       slothbear
// @include      https://worker.mturk.com/qualifications/*/request
// @downloadURL https://update.greasyfork.org/scripts/39321/mturk%20tv%20xport%20qual%20link%20qual%20requester%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/39321/mturk%20tv%20xport%20qual%20link%20qual%20requester%21%21%21.meta.js
// ==/UserScript==


$(function(){
	//fails, but qual still gets requested???
	$.post(document.URL, function(data){
		console.log(data);})
		.fail(function(jqXHR,textStatus,errorThrown){
		console.log("jqXHR: " + jqXHR);
		console.log("textStatus: " + textStatus);
		console.log("errorThrown: " + errorThrown);
	});

	$('#MainContent').html("<h2>Qual Requested!</h2>");
	
});
