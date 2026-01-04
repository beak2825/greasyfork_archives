// ==UserScript==
// @name         Join all groups on a profile
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Join all of someone's steam groups quickly
// @author       hoocs
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/profiles/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license MIT1
// @downloadURL https://update.greasyfork.org/scripts/516934/Join%20all%20groups%20on%20a%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/516934/Join%20all%20groups%20on%20a%20profile.meta.js
// ==/UserScript==

function JoinProfilesGroups() {
    let steamID = g_rgProfileData?.steamid || "";
    let sessionID = g_sessionID || "";

    if (!steamID || !sessionID) {
        console.log("Could not retrieve steamID or sessionID.");
        return;
    }

    $.ajax({
        url: 'https://steamcommunity.com/profiles/' + steamID + '/?xml=1',
        type: 'GET',
        dataType: 'xml'
    }).done(function(xml) {
        let groupIDs = [];
        $(xml).find('groupID64').each(function() {
            groupIDs.push($(this).text());
        });

        let joinRequests = groupIDs.map(groupID => {
            return $.ajax({
                url: 'https://steamcommunity.com/gid/' + groupID,
                type: 'POST',
                dataType: 'json',
                data: { action: 'join', sessionID: sessionID },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).done(function(data) {
                console.log('Joined Group:', groupID);
            }).fail(function() {
                console.log('Error joining group:', groupID);
            });
        });

        Promise.all(joinRequests).then(() => {
            console.log('All group join requests processed.');
        }).catch(() => {
            console.log('Some group join requests failed.');
        });
    }).fail(function() {
        console.log('Failed to retrieve group list. Check if the profile is public.');
    });
}

JoinProfilesGroups();
