// ==UserScript==
// @name        FaceIT Extra info in Match Room
// @version     0.4.0
// @description More info for FaceIT match room.
// @author      BONNe
// @include     https://www.faceit.com/*
// @connect     api.worldoftanks.eu
// @connect     api.worldoftanks.ru
// @connect     api.worldoftanks.com
// @license     MIT License
// @namespace https://greasyfork.org/users/63466
// @downloadURL https://update.greasyfork.org/scripts/22814/FaceIT%20Extra%20info%20in%20Match%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/22814/FaceIT%20Extra%20info%20in%20Match%20Room.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Inject script
angular.element(document).ready(function()
{
    var $body = angular.element(document.body);
    var $rootScope = $body.injector().get('$rootScope');

    $rootScope.$on('USER_LOGGED_IN', function()
    {
        initUser($rootScope);
    });

    $rootScope.$on('USER_LOGGED_OUT', function()
    {
        initUser($rootScope);
    });

    $rootScope.$watch(
        function()
        {
            setTimeout(function()
            {
                runStatsFunction();
            }, 5000);
        });
});


// Run script that will collect and add all information
function runStatsFunction()
{
    var gameElement = $('section.match-vs');

    if (angular.element(gameElement).length)
    {
        var matchItems = $(".match-team-member .match-team-member__details__name");

        matchItems.each(function(idx, el)
        {
            var href = $(el.getElementsByTagName("a")[0]).attr("href");

            if (href)
            {
                var splitHref = href.split("/");
                var nickIdx = splitHref.length - 1;
                if (splitHref[nickIdx])
                {
                    $.get("https://api.faceit.com/api/nicknames/" + splitHref[nickIdx], function(data)
                    {
                        var game = window.location.href.split('/')[4];

                        if ($(matchItems[idx]).has('.match-team-member_custom_info').length === 0)
                        {
                            $(matchItems[idx]).append("<div class='match-team-member_custom_info'></div>");
                            var $customInfo = $(matchItems[idx]).children(".match-team-member_custom_info");
                            var $controlList = $(matchItems[idx]).parent().parent().children(".match-team-member__controls");

                            var playload = data['payload']['games'][game];
                            var skill = playload['faceit_elo'];
                            var country = data['payload']['country'];

                            $customInfo.append('<div class="custom-info-user-info"></div>');
                            $customInfo.append('<div class="custom-info-user-ratings"></div>');

                            getUserDetails(game, playload['game_id'], country, $controlList, $customInfo);
                            addUserSkill(game, skill,  $customInfo);
                        }
                    });
                }
            }
        });
    }
}


// Get and add given user information
function getUserDetails(game, userID, country, $controlList, $customInfo)
{
    switch (game)
    {
        case "wot_EU":
            $.ajax(
            {
                url: 'https://api.worldoftanks.eu/wot/account/info/?application_id=c3b3e8c9b7c294ff52b43396b83384a9&account_id=' + userID,
                type: 'GET',
                timeout: 30000,
                error: function()
                {
                    return true;
                },
                success: function(json)
                {
                    var userName = json['data'][userID]['nickname'];
                    var wgRating = json['data'][userID]['global_rating'];
                    var clanID = json['data'][userID]['clan_id'];
                    var profileLink = "http://worldoftanks.eu/en/community/accounts/" + userID + "-" + userName + "/";

                    addWGIcon(profileLink, $controlList);
                    addFlagIcon(country, $controlList);

                    addUserName(userName, profileLink, $customInfo);
                    addUserRating(wgRating, $customInfo);
                    getClanDetails(clanID, game, $customInfo, $controlList);
                }
            });

            break;
        case "wot_RU":
            $.ajax(
            {
                url: 'https://api.worldoftanks.ru/wot/account/info/?application_id=c3b3e8c9b7c294ff52b43396b83384a9&account_id=' + userID,
                type: 'GET',
                timeout: 30000,
                error: function()
                {
                    return true;
                },
                success: function(json)
                {
                    var userName = json['data'][userID]['nickname'];
                    var wgRating = json['data'][userID]['global_rating'];
                    var clanID = json['data'][userID]['clan_id'];
                    var profileLink = "http://worldoftanks.ru/ru/community/accounts/" + userID + "-" + userName + "/";
                    var clanLink = "https://ru.wargaming.net/clans/wot/" + clanID + "/";

                    addWGIcon(profileLink, $controlList);
                    addFlagIcon(country, $controlList);

                    addUserName(userName, profileLink, $customInfo);
                    addUserRating(wgRating, $customInfo);
                    getClanDetails(clanID, game, $customInfo, $controlList);
                }
            });
            break;
        case "wot_NA":
            $.ajax(
            {
                url: 'https://api.worldoftanks.com/wot/account/info/?application_id=c3b3e8c9b7c294ff52b43396b83384a9&account_id=' + userID,
                type: 'GET',
                timeout: 30000,
                error: function()
                {
                    return true;
                },
                success: function(json)
                {
                    var userName = json['data'][userID]['nickname'];
                    var wgRating = json['data'][userID]['global_rating'];
                    var clanID = json['data'][userID]['clan_id'];
                    var profileLink = "http://worldoftanks.com/en/community/accounts/" + userID + "-" + userName + "/";
                    var clanLink = "https://na.wargaming.net/clans/wot/" + clanID + "/";

                    addWGIcon(profileLink, $controlList);
                    addFlagIcon(country, $controlList);

                    addUserName(userName, profileLink, $customInfo);
                    addUserRating(wgRating, $customInfo);
                    getClanDetails(clanID, game, $customInfo, $controlList);
                }
            });
            break;
        default:
    }
}


// Get information about clan
function getClanDetails(clanID, game, $customInfo, $controlList)
{
    if (!isNaN(parseFloat(clanID)))
    {
        switch (game)
        {
            case "wot_EU":
                $.ajax(
                    {
                        url: 'https://api.worldoftanks.eu/wgn/clans/info/?application_id=c3b3e8c9b7c294ff52b43396b83384a9&clan_id=' + clanID,
                        type: 'GET',
                        timeout: 30000,
                        error: function()
                        {
                            return true;
                        },
                        success: function(json)
                        {
                            var clanLink = "https://eu.wargaming.net/clans/wot/" + clanID + "/";
                            var clanTag = json['data'][clanID]['tag'];
                            var clanIcon = json['data'][clanID]['emblems']['x64']['portal'];

                            addClanDetails(clanTag, clanLink, $customInfo);
                            addClanIcon(clanIcon, clanLink, $controlList);
                        }
                    });

                break;
            case "wot_RU":
                $.ajax(
                    {
                        url: 'https://api.worldoftanks.ru/wgn/clans/info/?application_id=c3b3e8c9b7c294ff52b43396b83384a9&clan_id=' + clanID,
                        type: 'GET',
                        timeout: 30000,
                        error: function()
                        {
                            return true;
                        },
                        success: function(json)
                        {
                            var clanLink = "https://ru.wargaming.net/clans/wot/" + clanID + "/";
                            var clanTag = json['data'][clanID]['tag'];
                            var clanIcon = json['data'][clanID]['emblems']['x64']['portal'];

                            addClanDetails(clanTag, clanLink, $customInfo);
                            addClanIcon(clanIcon, clanLink, $controlList);
                        }
                    });
                break;
            case "wot_NA":
                $.ajax(
                    {
                        url: 'https://api.worldoftanks.com/wgn/clans/info/?application_id=c3b3e8c9b7c294ff52b43396b83384a9&clan_id=' + clanID,
                        type: 'GET',
                        timeout: 30000,
                        error: function()
                        {
                            return true;
                        },
                        success: function(json)
                        {
                            var clanLink = "https://na.wargaming.net/clans/wot/" + clanID + "/";
                            var clanTag = json['data'][clanID]['tag'];
                            var clanIcon = json['data'][clanID]['emblems']['x64']['portal'];

                            addClanDetails(clanTag, clanLink, $customInfo);
                            addClanIcon(clanIcon, clanLink, $controlList);
                        }
                    });
                break;
            default:
        }
    }
}


// Add ELO rating value to custom info panel
function addUserSkill(game, skill, $customInfo)
{
    // Common, if you havn't got premium, then you should not see this.
    if (userHasPremium)
    {
        var text = "ELO: <strong style='color: " + getLeagueColor(game, skill) + "'>" + skill + "</strong> ";
        $customInfo.children(".custom-info-user-ratings").append(text);
    }
}


// Add username to custom info panel
function addUserName(userName, profileLink, $customInfo)
{
    var text = 'Nickname: <a target="_blank" href="' + profileLink + '"><strong>' + userName + '</strong></a>';

    $customInfo.children(".custom-info-user-info").append(text);
}

// Add user ratings to custom info panel
function addUserRating(wgRating, $customInfo)
{
    var text = 'WG Rating: <strong style="color: ' + wgColor(wgRating) + '">' + wgRating + '</strong>';

    $customInfo.children(".custom-info-user-ratings").append(text);
}

// Add clan details to custom info panel
function addClanDetails(clanTag, clanLink, $customInfo)
{
    var text = '<br />Clan: <strong><a target="_blank" href="' + clanLink + '">' + clanTag + '</a></strong>';

    $customInfo.children(".custom-info-user-info").append(text);
}


// Add User WG profile icon to control list panel
function addWGIcon(link, $controlList)
{
    var wgIcon = '<a target="_blank" href="' + link + '" tooltip="WG Account" ' +
        'class="btn btn-sm btn-text btn-link btn-link-primary match-team-member__controls__button">' +
        '<img src="http://cdn-frm-eu.wargaming.net/wot/eu//profile/3/83/15/photo-thumb-535158303-56af78dc.jpeg?_r=1454340319" ' +
        'style="width:18px;margin-top:6px;" class="icon-md"></img> </a>';

    $(wgIcon).insertBefore($controlList.children(".match-team-member__controls__space"));
}


// Add User Country flag icon to control list panel
function addFlagIcon(country, $controlList)
{
    var flagIcon = '<button class="btn btn-sm btn-text btn-link btn-link-primary match-team-member__controls__button">' +
        '<img src="https://flags.fmcdn.net/data/flags/small/' + country + '.png" class="icon-md" alt="' + country + '" Flag" height="18px" width="18px"></img></button>';

    $(flagIcon).insertBefore($controlList.children(".match-team-member__controls__space"));
}


// Add Clan icon to control list panel
function addClanIcon(clanIcon, clanLink, $controlList)
{
    var icon = '<a target="_blank" href="' + clanLink + '" tooltip="WG Clan" ' +
        'class="btn btn-sm btn-text btn-link btn-link-primary match-team-member__controls__button">' +
        '<img src="' + clanIcon + '" style="width:18px;margin-top:6px;" class="icon-md"></img> </a>';

    $(icon).insertBefore($controlList.children(".match-team-member__controls__space"));
}


// Get league color depending which game user plays.
function getLeagueColor(game, skill)
{
    var color = "grey";

    switch (game)
    {
        case "wot_EU":
            color = "#912600";
            if (skill > 1099) color = "silver";
            if (skill > 1499) color = "gold";
            if (skill > 1849) color = "#b9f2ff";
            if (skill > 1949) color = "orange";
            break;
        case "wot_RU":
            color = "#912600";
            if (skill > 1099) color = "silver";
            if (skill > 1499) color = "gold";
            if (skill > 1849) color = "#b9f2ff";
            if (skill > 1949) color = "orange";
            break;
        case "wot_NA":
            color = "#912600";
            if (skill > 1099) color = "silver";
            if (skill > 1499) color = "gold";
            if (skill > 1849) color = "#b9f2ff";
            if (skill > 1949) color = "orange";
            break;
        default:
            if (skill > 800) color = "green";
            if (skill > 1100) color = "gold";
            if (skill > 1700) color = "orange";
            if (skill > 2000) color = "red";
    }

    return color;
}


// Get wg rating color.
function wgColor(skill)
{
    var color = "black";

    if (skill > 2020) color = "#cd3333";
    if (skill > 4185) color = "#d7b600";
    if (skill > 6340) color = "#6d9521";
    if (skill > 8525) color = "#4a92b7";
    if (skill > 9930) color = "#83579d";

    return color;
}


// Init user
function initUser($scope)
{
    if ($scope.currentUser === null)
    {
        userHasPremium = false;
    }
    else
    {
        userHasPremium = $scope.currentUser.membership.type === "premium";
    }
}


var userHasPremium = false;
