// ==UserScript==
// @name         Old Forums Page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Old Forums Page What Can I Say
// @author       Vue2016
// @license MIT
// @match        https://www.roblox.com/forum/
// @icon        data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533783/Old%20Forums%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/533783/Old%20Forums%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = "Forum - ROBLOX";
 document.querySelector(".alert-container").innerHTML += `
    <div id="MasterContainer">


<script type="text/javascript">
    $(function(){
        function trackReturns() {
            function dayDiff(d1, d2) {
                return Math.floor((d1-d2)/86400000);
            }
            if (!localStorage) {
                return false;
            }

            var cookieName = 'RBXReturn';
            var cookieOptions = {expires:9001};
            var cookieStr = localStorage.getItem(cookieName) || "";
            var cookie = {};

            try {
                cookie = JSON.parse(cookieStr);
            } catch (ex) {
                // busted cookie string from old previous version of the code
            }

            try {
                if (typeof cookie.ts === "undefined" || isNaN(new Date(cookie.ts))) {
                    localStorage.setItem(cookieName, JSON.stringify({ ts: new Date().toDateString() }));
                    return false;
                }
            } catch (ex) {
                return false;
            }



            var daysSinceFirstVisit = dayDiff(new Date(), new Date(cookie.ts));
            if (daysSinceFirstVisit == 1 && typeof cookie.odr === "undefined") {
                RobloxEventManager.triggerEvent('rbx_evt_odr', {});
                cookie.odr = 1;
            }
            if (daysSinceFirstVisit >= 1 && daysSinceFirstVisit <= 7 && typeof cookie.sdr === "undefined") {
                RobloxEventManager.triggerEvent('rbx_evt_sdr', {});
                cookie.sdr = 1;
            }
            try {
                localStorage.setItem(cookieName, JSON.stringify(cookie));
            } catch (ex) {
                return false;
            }
        }

        GoogleListener.init();



        RobloxEventManager.initialize(true);
        RobloxEventManager.triggerEvent('rbx_evt_pageview');
        trackReturns();



        RobloxEventManager._idleInterval = 450000;
        RobloxEventManager.registerCookieStoreEvent('rbx_evt_initial_install_start');
        RobloxEventManager.registerCookieStoreEvent('rbx_evt_ftp');
        RobloxEventManager.registerCookieStoreEvent('rbx_evt_initial_install_success');
        RobloxEventManager.registerCookieStoreEvent('rbx_evt_fmp');
        RobloxEventManager.startMonitor();


    });

</script>



        <script type="text/javascript">Roblox.FixedUI.gutterAdsEnabled=false;</script>



        <div id="Container">


        </div>



        <noscript><div class="alert-info"><h5>Please enable Javascript to use all the features on this site.</h5></div></noscript>






<div id="AdvertisingLeaderboard">


<iframe name="Roblox_Forums_Middle_728x90" allowtransparency="true" frameborder="0" height="110" scrolling="no" src="https://web.archive.org/web/20160706005725if_/http://www.roblox.com/userads/1" width="728" data-js-adtype="iframead" data-ruffle-polyfilled=""></iframe>

</div>


        <div id="BodyWrapper">

            <div id="RepositionBody">
                <div id="Body" class="body-width">


	<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">
		<tbody><tr valign="top">

            <!-- left column -->
			<td class="LeftColumn">&nbsp;&nbsp;&nbsp;</td>

            <!-- center column -->
			<td id="ctl00_cphRoblox_CenterColumn" width="95%" class="CenterColumn">
				<br>
            	<span id="ctl00_cphRoblox_NavigationMenu2">

<div id="forum-nav" style="text-align: right">
	<a id="ctl00_cphRoblox_NavigationMenu2_ctl00_HomeMenu" class="menuTextLink first" href="/web/20160706005725/http://forum.roblox.com/Forum/Default.aspx">Home</a>
	<a id="ctl00_cphRoblox_NavigationMenu2_ctl00_SearchMenu" class="menuTextLink" href="/web/20160706005725/http://forum.roblox.com/Forum/Search/default.aspx">Search</a>







</div>
</span>
				<br>
				<table cellpadding="0" cellspacing="2" width="100%">
					<tbody><tr>
						<td align="left">
							<span class="normalTextSmallBold">Current time: </span><span class="normalTextSmall">Jul 5, 7:57 PM</span>
						</td>
						<td align="right">
						    <span id="ctl00_cphRoblox_SearchRedirect">

<span>
    <span class="normalTextSmallBold">Search Roblox Forums:</span>
    <input name="ctl00$cphRoblox$SearchRedirect$ctl00$SearchText" type="text" maxlength="50" id="ctl00_cphRoblox_SearchRedirect_ctl00_SearchText" class="notranslate" size="20">
    <input type="submit" name="ctl00$cphRoblox$SearchRedirect$ctl00$SearchButton" value="Go" id="ctl00_cphRoblox_SearchRedirect_ctl00_SearchButton" class="translate btn-control btn-control-medium forum-btn-control-medium">
</span></span>

						</td>
					</tr>
				</tbody></table>
                <div style="height:7px;"></div>
				<table cellpadding="2" cellspacing="1" border="0" width="100%" class="table"><tbody><tr class="table-header forum-table-header">
	<th class="first" colspan="2"><a id="ctl00_cphRoblox_ForumGroupRepeater1_ctl01_GroupTitle" class="forumTitle" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForumGroup.aspx?ForumGroupID=1">ROBLOX</a></th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Threads&nbsp;&nbsp;</th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Posts&nbsp;&nbsp;</th><th style="width:135px;white-space:nowrap;">&nbsp;Last Post&nbsp;</th>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=46"><div class="forumTitle">
		All Things ROBLOX
	</div><div>
		The area for discussions purely about ROBLOX – the features, the games, and company news.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">1,211,193</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">7,965,206</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906741#192906923"><span class="normalTextSmaller"><div>
		<b>07:54 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">skinnyjohnman</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=14"><div class="forumTitle">
		Help (Technical Support and Account Issues)
	</div><div>
		Seeking account or technical help? Post your questions here.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">267,557</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">1,172,181</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906534#192906694"><span class="normalTextSmaller"><div>
		<b>07:52 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">Borsy</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=21"><div class="forumTitle">
		Suggestions &amp; Ideas
	</div><div>
		Do you have a suggestion and ideas for ROBLOX? Share your feedback here.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">490,087</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">4,470,733</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192903629#192906900"><span class="normalTextSmaller"><div>
		<b>07:54 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">PenguinvilleRescue1</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=54"><div class="forumTitle">
		BLOXFaires &amp; ROBLOX events
	</div><div>
		Check here to see the crazy things ROBLOX is doing. Contest information can be found here. ROBLOX is going to be at various Maker Faires and conferences around the globe. Discuss those events here!
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">7,997</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">653,224</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192897736#192906807"><span class="normalTextSmaller"><div>
		<b>07:53 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">Invictium2G</div></span></a></td>
</tr><tr class="table-header forum-table-header">
	<th class="first" colspan="2"><a id="ctl00_cphRoblox_ForumGroupRepeater1_ctl02_GroupTitle" class="forumTitle" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForumGroup.aspx?ForumGroupID=8">Club Houses</a></th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Threads&nbsp;&nbsp;</th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Posts&nbsp;&nbsp;</th><th style="width:135px;white-space:nowrap;">&nbsp;Last Post&nbsp;</th>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=13"><div class="forumTitle">
		ROBLOX Talk
	</div><div>
		A popular hangout where ROBLOXians talk about various topics.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">5,179,045</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">36,196,891</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906445#192906770"><span class="normalTextSmaller"><div>
		<b>07:52 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">coolcoolzombiedude</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=18"><div class="forumTitle">
		Off Topic
	</div><div>
		When no other forum makes sense for your post, Off Topic will help it make even less sense.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">5,667,122</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">36,810,533</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906859#192906984"><span class="normalTextSmaller"><div>
		<b>07:55 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">DarkVeiler</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=32"><div class="forumTitle">
		Clans &amp; Guilds
	</div><div>
		Talk about what’s going on in your Clans, Groups, Companies, and Guilds, and about the Groups feature in general.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">2,865,487</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">22,150,955</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192904138#192907078"><span class="normalTextSmaller"><div>
		<b>07:56 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">LordUnion</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=35"><div class="forumTitle">
		Let's Make a Deal
	</div><div>
		A fast paced community dedicated to mastering the Limited Trades and Sales market, and divining the subtleties of the ROBLOX Currency Exchange.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">5,873,802</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">39,061,698</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906536#192906685"><span class="normalTextSmaller"><div>
		<b>07:51 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">keeled</div></span></a></td>
</tr><tr class="table-header forum-table-header">
	<th class="first" colspan="2"><a id="ctl00_cphRoblox_ForumGroupRepeater1_ctl03_GroupTitle" class="forumTitle" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForumGroup.aspx?ForumGroupID=9">Game Creation and Development</a></th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Threads&nbsp;&nbsp;</th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Posts&nbsp;&nbsp;</th><th style="width:135px;white-space:nowrap;">&nbsp;Last Post&nbsp;</th>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=62"><div class="forumTitle">
		Game Marketing
	</div><div>
		This is where you show off your awesome creations, talk about how to advertise your game or share your marketing and sale tactics.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">31,546</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">221,384</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906891#192906891"><span class="normalTextSmaller"><div>
		<b>07:54 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">Cobrasquadleader</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=40"><div class="forumTitle">
		Game Design
	</div><div>
		This is the forum to get help, talk about future ROBLOX game ideas, or gather an awesome building team.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">101,182</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">560,339</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192883777#192906914"><span class="normalTextSmaller"><div>
		<b>07:54 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">Len521</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=33"><div class="forumTitle">
		Scripters
	</div><div>
		This is the place for discussion about scripting. Anything about scripting that is not a help request or topic belongs here.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">179,403</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">1,607,063</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192898445#192906724"><span class="normalTextSmaller"><div>
		<b>07:52 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">RapidPoolLover</div></span></a></td>
</tr><tr class="table-header forum-table-header">
	<th class="first" colspan="2"><a id="ctl00_cphRoblox_ForumGroupRepeater1_ctl04_GroupTitle" class="forumTitle" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForumGroup.aspx?ForumGroupID=6">Entertainment</a></th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Threads&nbsp;&nbsp;</th><th style="width:50px;white-space:nowrap;">&nbsp;&nbsp;Posts&nbsp;&nbsp;</th><th style="width:135px;white-space:nowrap;">&nbsp;Last Post&nbsp;</th>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=42"><div class="forumTitle">
		Video Game Central
	</div><div>
		Talk about your favorite video and computer games  outside of ROBLOX, with other fanatical video gamers!
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">159,590</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">1,420,972</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192903525#192906810"><span class="normalTextSmaller"><div>
		<b>07:53 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">RobFawkes</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=52"><div class="forumTitle">
		Video Creations with ROBLOX
	</div><div>
		This forum is for your sweet game play footage or that awesome viral video you saw on YouTube. Also to talk about your favorite Twitch streamers.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">25,189</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">202,016</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192903527#192906611"><span class="normalTextSmaller"><div>
		<b>07:51 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">Insurrect</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=26"><div class="forumTitle">
		Ro-Sports
	</div><div>
		For the many leagues of ROBLOX sports, real life sports fans.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">724,394</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">3,996,481</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192906665#192906933"><span class="normalTextSmaller"><div>
		<b>07:54 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">ericbassi</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=24"><div class="forumTitle">
		Pop-Culture (Music/Books/Movies/TV)
	</div><div>
		Come here to find what ROBLOXians think is a must read, see or hear.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">139,651</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">1,390,975</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192905747#192905747"><span class="normalTextSmaller"><div>
		<b>07:40 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">GroovierToe12</div></span></a></td>
</tr><tr class="forum-table-row">
	<td colspan="2" style="width:80%;"><a class="forum-summary" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowForum.aspx?ForumID=23"><div class="forumTitle">
		Role-Playing
	</div><div>
		The forum for story telling and imagination. Start a role-playing thread here involving your fictional characters, or role-play out a scenario with other players.
	</div></a></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">191,718</span></td><td class="forum-centered-cell" align="center"><span class="normalTextSmaller">8,591,149</span></td><td align="center"><a class="last-post" href="/web/20160706005725/http://forum.roblox.com/Forum/ShowPost.aspx?PostID=192295691#192906814"><span class="normalTextSmaller"><div>
		<b>07:53 PM</b>
	</div></span><span class="normalTextSmaller notranslate"><div class="notranslate">CrystaIGems</div></span></a></td>
</tr>
</tbody></table>
				<p></p>
			</td>

			<td class="CenterColumn">&nbsp;&nbsp;&nbsp;</td>

            <!-- right column -->
			<td id="ctl00_cphRoblox_RightColumn" nowrap="nowrap" width="160" class="RightColumn" style="padding-top:88px;">


<iframe name="Roblox_Forums_Right_160x600" allowtransparency="true" frameborder="0" height="612" scrolling="no" src="https://web.archive.org/web/20160706005725if_/http://www.roblox.com/userads/2" width="160" data-js-adtype="iframead" data-ruffle-polyfilled=""></iframe>

			</td>

            <td class="RightColumn">&nbsp;&nbsp;&nbsp;</td>
		</tr>
	</tbody></table>


                    <div style="clear:both"></div>
                </div>
            </div>
        </div>
        </div>`;
})();