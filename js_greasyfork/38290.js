// ==UserScript==
// @name         Group layout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Griffi0n
// @match        https://web.roblox.com/groups/*
// @match        https://web.roblox.com/Groups/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38290/Group%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/38290/Group%20layout.meta.js
// ==/UserScript==

$("#MasterContainer").attr("style", "background-color: #E3E3E3");
$("#Body").attr("style", "background-color: #E3E3E3");
$("#SearchControls").attr("style", "background-color:#fff;box-shadow:0 1px 4px 0 rgba(25,25,25,0.3);padding:15px;position:relative;");
$("#ctl00_cphRoblox_JoinGroupWithCaptcha").attr("class", "btn-secondary-xs btn-more btn-fixed-width");
$("#ctl00_cphRoblox_JoinGroupWithCaptcha").attr("style", "margin-top: 10px; text-align: center;");
$("#ctl00_cphRoblox_AlreadyRequestedInvite").attr("class", "btn-secondary-xs btn-more btn-fixed-width");
$("#ctl00_cphRoblox_AlreadyRequestedInvite").attr("style", "margin-top: 10px; text-align: center;");
$("#ctl00_cphRoblox_AlreadyRequestedInvite").attr("disabled", "");
$(".GroupPanelContainer").attr("style", "background-color:#fff;box-shadow:0 1px 4px 0 rgba(25,25,25,0.3);padding:15px;position:relative;width: auto;height: " + $(".right-col").css("height") + ";padding-bottom: 50px;");
$(".right-col").attr("style", "position: absolute;left: 160px;padding-left: 10px;");
$("#GroupsPeopleContainer").attr("style", "background-color:#fff;box-shadow:0 1px 4px 0 rgba(25,25,25,0.3);padding:15px;position:relative;");
$("#ctl00_cphRoblox_GroupSearchBar_SearchKeyword").attr("class", "form-control input-field");
$("#ctl00_cphRoblox_GroupSearchBar_SearchKeyword").attr("style", "width: 600px; height: 20px;");
$("#ctl00_cphRoblox_GroupSearchBar_SearchKeyword").attr("placeholder", "Search all groups");
$("#ctl00_cphRoblox_GroupSearchBar_SearchKeyword").attr("value", "Search all groups");
$("#ctl00_cphRoblox_GroupSearchBar_SearchButton").attr("class", "btn-primary-md");
$("#ctl00_cphRoblox_GroupSearchBar_SearchButton").attr("style", "position: relative; top: -35px; left: 300px;");
$("#BodyWrapper").attr("style", "outline: white solid 0px !important;");
$("#ctl00_cphRoblox_rbxGroupFundsPane_GroupFunds").attr("style", "background-color:#fff;box-shadow:0 1px 4px 0 rgba(25,25,25,0.3);padding:15px;position:relative;left: 30px;");
$("#ctl00_cphRoblox_rbxGroupFundsPane_GroupFunds").attr("class", "");
$("#ctl00_cphRoblox_rbxGroupFundsPane_GroupFunds b").html("Funds: " + $("#ctl00_cphRoblox_rbxGroupFundsPane_GroupFunds .robux").html());
$("#ctl00_cphRoblox_rbxGroupFundsPane_GroupFunds .robux").remove();
$("#ctl00_cphRoblox_GroupWallPane_Wall .StandardBox").attr("style", "background-color:#fff;box-shadow:0 1px 4px 0 rgba(25,25,25,0.3);padding:15px;position:relative;");
$("head").append("<style>.AlternatingItemTemplateOdd {border: 1px solid #B8B8B8;border-radius:3px;background-color:white !important;margin-top: 10px;} .AlternatingItemTemplateEven {border: 1px solid #B8B8B8;border-radius:3px;background-color:white !important;margin-top: 10px;} .RepeaterImage {overflow: visible;} .tab {color:#555;border-radius:3px 3px 0 0;border:0px solid #ddd;padding:10px 15px;background-color:white;} .tab.active {color:#555;border-radius:3px 3px 0 0;border:1px solid #ddd;padding:10px 15px;} .tab:hover {background-color:white !important;} .GroupPlace, #ctl00_cphRoblox_rbxGroupAlliesPane_RelationshipsUpdatePanel div div a, #ctl00_cphRoblox_rbxGroupEnemiesPane_RelationshipsUpdatePanel div div a {background-color:#fff;box-shadow:0 1px 4px 0 rgba(25,25,25,0.3);padding:5px;margin:2px;border-radius:3px;position:relative;} .GroupPlace:hover, #ctl00_cphRoblox_rbxGroupAlliesPane_RelationshipsUpdatePanel div div a:hover, #ctl00_cphRoblox_rbxGroupEnemiesPane_RelationshipsUpdatePanel div div a:hover {box-shadow: 0 1px 10px rgba(150,150,150,0.74);transition:box-shadow 200ms ease-in-out;}</style>");
$(".bcOverlay").remove();
$(".btn-control").attr("style", "font-size: 15px;");
$(".btn-control").attr("class", "btn-control-md");
$("#ctl00_cphRoblox_GroupWallPane_NewPost").attr("class", "form-control input-field");
$("#ctl00_cphRoblox_GroupWallPane_NewPostButton").attr("style", "font-size: 15px;position: relative;top:10px;");
$(".RepeaterImage a").attr("class", "avatar avatar-card-fullbody friend-link");
$("#ctl00_cphRoblox_GroupDescriptionEmblem img").attr("style", "border-radius: 3px;");
$("#Div2").attr("style", "height: 600px;position:relative;left: 50px;top:50px;");
window.setInterval(function() {
$(".bcOverlay").remove();
$(".RepeaterImage a").attr("class", "avatar avatar-card-fullbody friend-link");
$(".Avatar a").attr("class", "avatar avatar-card-fullbody friend-link");
$(".NameText").attr("style", "color: #191919;");
$(".Name").attr("style", "text-align: center;");
$(".OnlineStatus").html("");
$(".OnlineStatus").attr("style", "position: relative;z-index: 2;left: 90px;top:120px;display:inline;");
$(".OnlineStatus").attr("class", "avatar-status online profile-avatar-status icon-online");
}, 1);