// ==UserScript==
// @name         Pyrator
// @namespace    http://www.wykop.pl/
// @version      0.1
// @description  po najechaniu na nicki plusujących wyświetla datę i czas
// @author       MirkoStats
// @match        http://www.wykop.pl/mikroblog/*
// @match        http://www.wykop.pl/wpis/*
// @match        http://www.wykop.pl/ludzie/*
// @require      https://greasyfork.org/scripts/12080-cryptojs-v3-1-2/code/CryptoJS%20v312.js?version=71213
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12081/Pyrator.user.js
// @updateURL https://update.greasyfork.org/scripts/12081/Pyrator.meta.js
// ==/UserScript==

var appkey = "zLwnRq50RK";
var secretkey = "";

$(document).ready(main);

function main() {
	var $selector = $('#itemsStream > li > div > div > div.text > div.votersContainer > div > a.c999.showVoters');
	$selector.removeClass('ajax');

	$selector.on('click', function(e) {
		e.preventDefault();

		var $that = $(this).closest('.votersContainer');
		var voters = $that.find('.voters-list > a');
		var id = $that.closest('.dC').data('id');
		request(id, voters);
	});
}

function request(entryId, voters) {
	var url = "http://a.wykop.pl/Entries/Index/" + entryId + "/appkey," + appkey + ",format,jsonp";
	var voterList = "+: ";
	$.ajax({
		url: url,
		method: "GET",/*
		headers: {
			apisign: CryptoJS.MD5(secretkey + url).toString()
		},*/
		dataType: "jsonp",
		jsonp: false,
		jsonpCallback: "wykopParser",
		crossDomain: true,
		success: function(response) {
			for (var i=0; i<response.voters.length; i++) {
				var voter = response.voters[i];
				voterList += '<a href="http://www.wykop.pl/ludzie/'+ voter.author +'/" class="link gray tdnone color-'+ voter.author_group +'" title="'+ voter.date +'">'+ voter.author +'</a>, ';
			}
			voters.parent().html(voterList);
		}
	});
}