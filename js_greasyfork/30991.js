// ==UserScript==
// @name         NWRP Group Inviter
// @namespace    http://59th.eu
// @version      0.1.7
// @description  Invite an entire group to your group, ez spamming
// @author       Ur mom
// @match        *://steamcommunity.com/groups/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30991/NWRP%20Group%20Inviter.user.js
// @updateURL https://update.greasyfork.org/scripts/30991/NWRP%20Group%20Inviter.meta.js
// ==/UserScript==


//http://steamcommunity.com/groups/officialnwrpcommunity <-- Custom URL is this bit at the end

//Custom URL of the group you want to invite from
var target_steam_group = "warofrights";

//Custom URL of the group to want to invite people to
var invite_steam_group = "officialnwrpcommunity";








/**********************************************************************************************************/
/* * * * * * * * * * * * * * * * * * * * * Leave the rest below alone * * * * * * * * * * * * * * * * * * */
/**********************************************************************************************************/

function InviteUserToSteamGroup(group_id)
{
	return $.ajax({
		url: 'http://steamcommunity.com/groups/' + target_steam_group + '/memberslistxml',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		$(xml).find('steamID64').each(function(){
			var params = {
				json: 1,
				type: 'groupInvite',
				group: group_id,
				sessionID: g_sessionID,
				invitee: $(this).text()
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

function GetGroupData(steam_group_custom_url)
{
	return $.ajax({
		url: 'http://steamcommunity.com/groups/' + steam_group_custom_url + '/memberslistxml',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		InviteUserToSteamGroup($(xml).find('groupID64').text());
	}).fail(function() {
		console.log('The request failed or the group custom URL is wrong.');
	});
}

// Start invite process
GetGroupData( invite_steam_group );