// ==UserScript==
// @name                HF Staff Opti
// @author              Hash G.
// @namespace           HF
// @description         For Optimized 
// @include             *hackforums.net*
// @require             http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version             1.0.4
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13020/HF%20Staff%20Opti.user.js
// @updateURL https://update.greasyfork.org/scripts/13020/HF%20Staff%20Opti.meta.js
// ==/UserScript==


if ( $(".post_author span:contains('Optimized')").length >= 1 ) {
	if (document.URL.indexOf("showthread.php") >= 0) {
		$("span:contains('Optimized')").each(function() {
			$(this).attr("class", "group3");
			$(this).parent().parent().find("img[src*='groupimages']").attr("src", "http://hackforums.net/images/modern_bl/groupimages/english/staff.png");
			$(this).parent().parent().find("img[src*='groupimages']").attr("title", "Staff");
			$(this).parent().parent().find("img[src*='star']").attr("src", "http://hackforums.net/images/modern_bl/starstaff.png");
		})
	}
}

if (document.URL.indexOf("showstaff.php") >= 0) {
	var staffhtml = '<div style="width: 48%; min-height: 120px;float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"><table border="0" cellpadding="5" cellspacing="0" width="100%"><tbody><tr><td class="trow1" width="75%"><span><strong><a href="http://hackforums.net/member.php?action=profile&amp;uid=2250372"><span class="group3">Optimized</span></a></strong></span><br><span class="smalltext">(Optimistically Posting)<br><!-- start: member_profile_groupimage --><img src="http://hackforums.net/images/modern_bl/groupimages/english/staff.png" alt="" title=""><br><!-- end: member_profile_groupimage --><span class="smalltext"><!-- start: postbit_pm --><a href="private.php?action=send&amp;uid=2250372" class="bitButton" rel="nofollow" title="Send this user a private message">PM</a><!-- end: postbit_pm --></span><br></span></td><td align="right" valign="middle" width="25%"><!-- start: memberlist_user_avatar --><img src="./uploads/avatars/avatar_2250372.png?dateline=1442443389" alt="" height="70" width="56"><!-- end: memberlist_user_avatar --></td></tr></tbody></table></div>';
	$(".tborder > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)").append(staffhtml);
}

$("#boardstats_e").find("a[href*='2250372']").find("span").attr("class", "group3");

if (document.URL.indexOf("member.php?action=profile&uid=2250372") >= 0) {
	$(".group0").attr("class", "group3");
	$(".quick_keys > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)").find("img[src*='groupimages']").attr("src", "http://hackforums.net/images/modern_bl/groupimages/english/staff.png");
	$("img[src*='groupimages']").attr("title", "Staff");
	$("img[src*='star']").attr("src", "http://hackforums.net/images/modern_bl/starstaff.png");	
}