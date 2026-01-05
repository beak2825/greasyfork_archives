// ==UserScript==
// @name         Invite User To ALL of my Groups
// @namespace    http://teamgamerfood.com
// @version      0.1.2
// @description  Own someone by inviting someone to all your groups
// @author       A5 
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/profiles/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13422/Invite%20User%20To%20ALL%20of%20my%20Groups.user.js
// @updateURL https://update.greasyfork.org/scripts/13422/Invite%20User%20To%20ALL%20of%20my%20Groups.meta.js
// ==/UserScript==


//Your profile custom ID
var custom_ID = "A5--"; 


/**********************************************************************************************************/
/* * * * * * * * * * * * * * * * * * * * * Leave the rest below alone * * * * * * * * * * * * * * * * * * */
/**********************************************************************************************************/

function InviteUserToSteamGroups()
{
	return $.ajax({
		url: 'http://steamcommunity.com/id/' + custom_ID + '/?xml=1',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		$(xml).find('groupID64').each(function(){
			
			var params = {
				json: 1,
				type: 'groupInvite',
				group: $(this).text(),
				sessionID: g_sessionID,
				invitee: g_rgProfileData.steamid
			};

			$.ajax({
				url: 'http://steamcommunity.com/actions/GroupInvite',
				data: params,
				type: 'POST',
				dataType: 'json'
			}).done(function(data) {
				if (data.duplicate) {
					console.log('[' + $(this).text() + '] The user are already in the group or have already received invites.');
				} else {
					console.log('[' + $(this).text() + '] Invite to Join Your Group.');
				}
			}).fail(function() {
				console.log('Error processing your request. Please try again.');
			});
		});
	}).fail(function() {
		console.log('The request failed or the group custom URL is wrong.');
	});
}

// Start invite process
InviteUserToSteamGroups();
