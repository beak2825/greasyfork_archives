// ==UserScript==
// @description Toolkit für mydealz.de
// @grant		none
// @iconhttps		https://www.mydealz.de/assets/img/favicon_914c899c.ico
// @name        HUKD Toolkit
// @namespace   lolnickname
// @include		/^https?:\/\/www\.mydealz\.de/
// @include		http://hukd.mydealz.de*
// @include		https://hukd.mydealz.de*
// @version     1.8.0
// @downloadURL https://update.greasyfork.org/scripts/10855/HUKD%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/10855/HUKD%20Toolkit.meta.js
// ==/UserScript==
// ========================== //
//     Einstellungen Start    //
// ========================== //
var USER_NAME = 'lolnickname';

// true = Funktion aktivieren
// false = Funktion deaktivieren
var REMOVE_TOP_BAR = 'true';
var REMOVE_GS_WIDGET = 'true';
var REMOVE_NL_SECTION = 'true';
var REMOVE_APP_AD = 'true';
var RESET_PM_LINK = 'true';
var INSERT_DIRECTLINK = 'true';
var REPLACE_REPORT_BUTTON = 'true';
var REMODEL_NAV_BAR = 'true';

// ========================== //
//     Einstellungen Ende     //
// ========================== //
startUp();
function startUp() {
if(!$("userBar-button--user")[0]) {
	try {
				if (REMOVE_TOP_BAR) removeTopBar();
				if (REMOVE_GS_WIDGET) removeGsWidget();
				if (REMOVE_NL_SECTION) removeNlSection();
				if (REMOVE_APP_AD) removeAppAd();
				if (RESET_PM_LINK) resetPmLink();
				if (INSERT_DIRECTLINK) insertDirectLink();
				if (REPLACE_REPORT_BUTTON) replaceReportButton();
				if (REMODEL_NAV_BAR) remodelNavBar();
        noErrorOccurred();
	} catch (e) {anErrorOccurred();}
} else {
	if (window.location != 'https://hukd.mydealz.de/login') {
		alert('Bitte einloggen.');
		window.location = 'https://hukd.mydealz.de/login';
	}
}
	
}
function removeTopBar()
{
	$(".topBar").hide();
}

function removeGsWidget()
{
	$("#gs-widget").hide();
}

function removeNlSection()
{
	$(".newsletter").hide();
}

function removeAppAd()
{
	$("[alt='app banner for ios android and window phone']").hide();
}

function resetPmLink()
{
	$(".userBar-link.userBar-notificationItem.userBar-button--pm").removeAttr("data-handler data-menu");
	var iconField = $(".userBar-link.userBar-notificationItem.userBar-button--pm")[0];
	var aLink = createElement('a', null, null, null);
	aLink.href = 'http://hukd.mydealz.de/profile/' + USER_NAME + '/messages';
	aLink.appendChild(iconField);
	var iGrid = $(".iGrid.button-group")[0];
	var avatar = $(".userBar-button--user")[0];
	iGrid.insertBefore(aLink, avatar);
}

function insertDirectLink()
{//Direktlink by Nico
	$(".comments-list > li").each(function(index)
	{
		var id=$(this).prop("id");
		var directLink='http://' + window.location.hostname + window.location.pathname + '?page=' + getPageNumber() +'#' + id;
		$(this).find(".hList").first().append("<li class=\"comment-option hList-item\"> <a href=" + directLink +"><button class=\"link ico ico--type-arrow-blue ico--pos-l\" onclick=\"window.open('" + directLink + "')\">Direktlink</button><a/></li>");
	});
}

function replaceReportButton()
{
	$(".section-sub.hList").each(function(index)
															 {
																 $(this).find(".link.ico.ico--type-megaphone-blue.ico--pos-l").parent().hide();
																 var items = $(this).find("[id^='report_'] .hList-item");
																 $(this).append(items);
															 });
}

function remodelNavBar()
{
	$(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium").find("[href*='diverses']").parent().removeClass("navMenu1-item hide--downThrough-").addClass("tGrid-cell hide--upTo-menu5");
	$(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium").find("[href*='diverses']").removeClass("navMenu1-item navMenu1-item--selected").addClass("navTrigger1");
	var diversesNav = $(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium").find("[href*='diverses']").parent();
	$(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium").find("[href*='gesuche']").parent().removeClass("navMenu1-item hide--downThrough-").addClass("tGrid-cell hide--upTo-menu6");;
	$(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium").find("[href*='gesuche']").removeClass("navMenu1-item navMenu1-item--selected").addClass("navTrigger1");
	var gesucheNav = $(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium").find("[href*='gesuche']").parent();
	var tGrid = $(".navTrigger1-row-items.tGrid-cell.tGrid.hide--upTo-medium");
	$(".navTrigger1 .hide--upTo-xSmall").hide();
	tGrid.append(diversesNav);
	tGrid.append(gesucheNav);	
}

function anErrorOccurred()
{
    $(".userBar-link .avatar-image").css( "border", "1px dotted red" );
}

function noErrorOccurred()
{
    $(".userBar-link .avatar-image").css( "border", "1px dotted lime" );
}




function getPageNumber()
//Direktlink by Nico
{
	return $(".form--narrow input[name=cur_page]").val();
}

function createElement(elemType, elemId, elemClass, elemText)
{
    var elmNewContent = document.createElement(elemType);
	if (elemId) {
	    elmNewContent.id = elemId;
	}
	if (elemClass) {
	    elmNewContent.className = elemClass;
	}
	if (elemText) {
    	elmNewContent.appendChild(document.createTextNode(elemText));
	}
    return elmNewContent;
}