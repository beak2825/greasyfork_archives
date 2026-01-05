// ==UserScript==
// @name       HF ToolBar Lite
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.2
// @description  HFTB without GM_config (mobile friendly)
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.sticky/1.0.4/jquery.sticky.js
// @match      *hackforums.net/showthread.php?tid=*
// @match      *hackforums.net/usercp.php
// @match      *hackforums.net/forumdisplay.php?fid=*
// @match      *hackforums.net/private.php*
// @match      *hackforums.net
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// @downloadURL https://update.greasyfork.org/scripts/27307/HF%20ToolBar%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/27307/HF%20ToolBar%20Lite.meta.js
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
if (!window.location.href.includes("hackforums.net/newreply.php?tid=")){
createStickyHeader();
}
// ------------------------------ Page Load ------------------------------
function createStickyHeader(){
    var headerHeight = "18px";
    // Create toolbar
    $("#panel").append($("<div>").attr("id","Sticky")
                       .css("height","22px").css("background-color","#333333")
                       .css("border-style","solid").css("border-color","white").css("border-width","0px 0px 1px 0px")
                       .css("align-items","center").css("z-index","100"));
    // Left
    $("#Sticky").append($("<div>").attr("id","leftSticky").addClass("float_left").text("")
                        .css("padding-left","5px").css("display","block").css("height",headerHeight));
    // Center
    $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/forumdisplay.php?fid=25").text("Lounge"));
    $("#leftSticky").append(" | ");
    $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/forumdisplay.php?fid=2").text("RANF"));
    $("#leftSticky").append(" | ");
    $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/forumdisplay.php?fid=53").text("Groups"));
    $("#leftSticky").append(" | ");
    $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/private.php?action=tracking").text("PM Tracking"));
    $("#leftSticky").append(" | ");
    $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/forumdisplay.php?fid=247").text("Web Browsers"));
    $("#leftSticky").append(" | ");
    // Right
    $("#Sticky").append($("<div>").attr("id","rightSticky").css("float","right").css("height",headerHeight));
    $("#rightSticky").append($("<a>").text("New Posts").attr("href","https://hackforums.net/search.php?action=getnew").attr("onClick",""));
    $("#rightSticky").append(" | ");
    // Your Threads (right)
    $("#rightSticky").append($("<a>").text("Your Threads").attr("href","https://hackforums.net/search.php?action=finduserthreads&uid="+getUID()).attr("onClick",""));
    $("#rightSticky").append(" | ");
    // Your Posts (right)
    $("#rightSticky").append($("<a>").text("Your Posts").attr("href","https://hackforums.net/search.php?action=finduser&uid="+getUID()).attr("onClick",""));

    // Sticky
    $(document).ready(function(){
        $("#Sticky").sticky();
    });
}

function getUID(){
    var profileLink = "";
    if ($("#panel a:eq(0)").length > 0)
        profileLink = $("#panel a:eq(0)").attr("href");
    if (profileLink.includes("hackforums.net/member.php?action=profile&uid="))
        profileLink = profileLink.replace(/\D/g,'');
    return profileLink;
}