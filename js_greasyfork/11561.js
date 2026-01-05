// ==UserScript==
// @name           Tapuz Forum View Fix
// @namespace      Tapuz
// @version        2.2
// @description    Remove clutter and sluggishness from tapuz forums
// @include        *tapuz.co.il/forums/forumpage*
// @downloadURL https://update.greasyfork.org/scripts/11561/Tapuz%20Forum%20View%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11561/Tapuz%20Forum%20View%20Fix.meta.js
// ==/UserScript==

$('div#common_top').css("height", "1px");
$('div.top_company').hide()
$('.headerSpacer').css("margin-top", "60px");
$('.forum-side-bar').hide();
$('.forumContentInner').css('margin-left', '0px');
$('.sideBarForum').hide();
$('#divTopBanner').hide();
$('footer').hide();
$('#divBottomBanner').hide();
//$('forumHeaderTabs').not('.activeForumHeaderTab').hide();
//$('.forumHeaderTabs li').not('.activeForumHeaderTab').hide();
$('.forumHeaderTabs').hide();
$('.businessMessage').hide();
$('.forum-brief').hide();
$('.forumTaglinesBox').hide();
$('div#user_7923').parent('.msg-title').hide();
$.fx.speeds.fast = 0;
$('div.mainImage').hide();
$('div.thirdLineLeftContainer').hide();
$('#TopMenuForum').removeClass('TopMenuForum opensans');
$('div.LogoLinks').hide();
$('div.ThirdLineMenu').hide();