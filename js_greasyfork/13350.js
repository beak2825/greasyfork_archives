// ==UserScript==
// @name        LoliAutists Group Invite
// @namespace   LoliAutists
// @description Autoinvites when you view a profile
// @match       *://steamcommunity.com/id/*
// @match       *://steamcommunity.com/profile/*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13350/LoliAutists%20Group%20Invite.user.js
// @updateURL https://update.greasyfork.org/scripts/13350/LoliAutists%20Group%20Invite.meta.js
// ==/UserScript==

function InviteUserToSteamGroup(group_id)
{
	var params = {
		json: 1,
		type: 'groupInvite',
		group: group_id,
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
			console.log('[' + g_rgProfileData.steamid + '] The user are already in the group or have already received invites.');
		} else {
			console.log('[' + g_rgProfileData.steamid + '] Invite to Join Your Group.');
		}
	}).fail(function() {
		console.log('Error processing your request. Please try again.');
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
GetGroupData("GhettoPatrol");