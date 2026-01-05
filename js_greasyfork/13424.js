// ==UserScript==
// @name         Join all groups on a profile
// @namespace    http://teamgamerfood.com
// @version      0.1.3
// @description  Join all of someone's steam groups
// @author       A5 
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/profiles/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13424/Join%20all%20groups%20on%20a%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/13424/Join%20all%20groups%20on%20a%20profile.meta.js
// ==/UserScript==

/**********************************************************************************************************/
/* * * * * * * * * * * * * * * * * * * * * Leave the rest below alone * * * * * * * * * * * * * * * * * * */
/**********************************************************************************************************/

function JoinProfilesGroups()
{
	return $.ajax({
		url: 'http://steamcommunity.com/profiles/' + g_rgProfileData.steamid + '/?xml=1',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		$(xml).find('groupID64').each(function(){
			
			var params = {
				action: 'join',
				sessionID: g_sessionID,
			};

			$.ajax({
				url: 'http://steamcommunity.com/gid/' + $(this).text(),
				data: params,
				type: 'POST',
				dataType: 'json'
			}).done(function(data) {
					console.log('Joined Group.');
			}).fail(function() {
				console.log('Error processing your request. Please try again.');
			});
		});
	}).fail(function() {
		console.log('The request failed or the group custom URL is wrong.');
	});
}

// Start invite process
JoinProfilesGroups();
