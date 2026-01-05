// ==UserScript==
// @name            Hack Forums Ban reason on profile
// @namespace       Snorlax
// @description		Adds ban reason to a banned profile
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include			*hackforums.net/member.php?action=profile&uid=*
// @version         1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2949/Hack%20Forums%20Ban%20reason%20on%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/2949/Hack%20Forums%20Ban%20reason%20on%20profile.meta.js
// ==/UserScript==

userBanned = $(".group7").length;
UID = document.location.href.replace(/[^0-9]/g, '');
username = $(".group7").text();

if(userBanned == 1) {
    $("a[href*='misc.php?action=username_history&uhuid=']").after("<br /><strong>Ban reason: </strong><span id='banReason'>Loading...</span>");
    $("#banReason").after("<br /><a href='javascript:void(0)' id='showMore' style='font-size:x-small'>Show more...</a>");
    $("#showMore").after("<div style='display: none;' id='extraInfo' ><strong>Banned by: </strong><span id='bannedBy'>Loading...</span></div>");
    $("#bannedBy").after("<br /><strong>Ban date info: </strong><span id='banDate'>Loading...</span>");
    $("#banDate").after('<br /><a id="citeBan" href="javascript:void();">[cite ban]</a></div>');
    getPage();
}

function getPage() {
    $.ajax({
        type: "GET",
        url: "/bans.php",
        async: true,
        data: "",
        success: function(data){
            banPage(data);
        }
    });
}

function banPage(data) {
    banReason = $(data).find("a[href*='" + UID + "']:contains('" + username + "')").parent().next().html();
    console.log(banReason);
    bannedBy = $(data).find("a[href*='" + UID + "']:contains('" + username + "')").parent().next().next().html();
    console.log(bannedBy);
    bannedWhen = $(data).find("a[href*='" + UID + "']:contains('" + username + "')").parent().next().next().next().html();
    console.log(bannedWhen);
    banExpiry = $(data).find("a[href*='" + UID + "']:contains('" + username + "')").parent().next().next().next().next().html();
    console.log(banExpiry);
    $("#banReason").html(banReason); 
    $("#bannedBy").html(bannedBy);
    $("#banDate").html("Banned: " + bannedWhen + ". Will expire: " + banExpiry + ".");

}

$("#showMore").on("click", function() {
    $(this).hide();
    $("#extraInfo").show();
});
$("#citeBan").on("click", function() {
    prompt("Cited Ban:","[b][url=" + document.location.href + "][color=black]" + username + "[/color][/url][/b] was banned for: " + banReason);
});