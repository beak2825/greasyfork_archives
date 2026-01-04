// ==UserScript==
// @name         Invite ALL your friends for your Steam Group
// @version      1.1
// @description  Mass-invite lads to your Steam Group (specified under the GroupID)
// @author       Speedy 
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/profiles/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @namespace https://greasyfork.org/users/325004
// @downloadURL https://update.greasyfork.org/scripts/388367/Invite%20ALL%20your%20friends%20for%20your%20Steam%20Group.user.js
// @updateURL https://update.greasyfork.org/scripts/388367/Invite%20ALL%20your%20friends%20for%20your%20Steam%20Group.meta.js
// ==/UserScript==

var groupID = 'putTheIdHere';
var friends = GetCheckedAccounts('#search_results>.selectable');

InviteUserToGroup(null, groupID, friends);
