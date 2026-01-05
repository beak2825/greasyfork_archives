// ==UserScript==
// @name            DW Moderator Toolbox
// @namespace       http://forum.dirtywarez.com/
// @description     Made to make moderator's life on DW easier
// @author          Nenad__
// @version         1.5
// @license         GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_xmlhttpRequest
// @include         http://forum.dirtywarez.com/viewtopic.php*
// @include         http://forum.dirtywarez.com/posting.php*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21616/DW%20Moderator%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/21616/DW%20Moderator%20Toolbox.meta.js
// ==/UserScript==

var section = {
    apps: false,
    ebooks: false,
    games: false,
    movies: false,
    tv: false,
    music: false,
    app_req: false,
    ebooks_req: false,
    games_req: false,
    movies_req: false,
    music_req: false,
    other_req: false,
    crack_req: false,

    check: function(html) {
        var htmlString = $('body').html().toString();
        var index = htmlString.indexOf(html);
        if (index != -1)
            return true;
        else
            return false;
    }
};


if (section.check('./viewforum.php?f=9" itemprop="url"')) section.apps = true;
if (section.check('./viewforum.php?f=18" itemprop="url"')) section.ebooks = true;
if (section.check('./viewforum.php?f=10" itemprop="url"')) section.games = true;
if (section.check('./viewforum.php?f=12" itemprop="url"')) section.movies = true;
if (section.check('./viewforum.php?f=16" itemprop="url"')) section.tv = true;
if (section.check('./viewforum.php?f=17" itemprop="url"')) section.music = true;
if (section.check('./viewforum.php?f=14" itemprop="url"')) section.app_req = true;
if (section.check('./viewforum.php?f=30" itemprop="url"')) section.ebooks_req = true;
if (section.check('./viewforum.php?f=15" itemprop="url"')) section.games_req = true;
if (section.check('./viewforum.php?f=28" itemprop="url"')) section.movies_req = true;
if (section.check('./viewforum.php?f=29" itemprop="url"')) section.music_req = true;
if (section.check('./viewforum.php?f=31" itemprop="url"')) section.other_req = true;
if (section.check('./viewforum.php?f=27" itemprop="url"')) section.crack_req = true;


var toolbox = {
    loadHTML: function() {
        var html = "";

        html += '<div class="mod_toolbox">';
        html += 'Mod Toolbox: <select class="toolbox_sel">';
        html += '<option value="undef">select...</option>';
        html += '<option value="Trash Dead links">[Trash] Dead links</option>';
        html += '<option value="Trash Premium only">[Trash] Premium Only Links</option>';
        html += '<option value="Trash Premium only alive">[Trash] Premium Only Alive</option>';
        html += '<option value="Wrong forum - Trashed">[Trash] Wrong Forum</option>';
        html += '<option value="Non-English">[Trash] Non-English Post</option>';
        html += '<option value="Flooding">[Trash] Flooding</option>';
        html += '<option value="Dupe">[Trash] Duplicate Topic (same links - dupe)</option>';
        html += '<option value="Non-Direct Link">[Trash] Non-Direct Link(s)</option>';
        html += '<option value="Blacklisted">[Trash] Blacklisted Links Only</option>';
        html += '<option value="Orphaned">[Trash] Orphaned</option>';
        html += '<option value="Adult">[Quarantine] Adult Content</option>';
        html += '<option value="DMCA">[Quarantine] DMCA</option>';
        if (section.apps) {
            html += '<option value="Apps to Mac">[Move] Applications > Mac Os</option>';
            html += '<option value="Apps to Non-Win">[Move] Applications > Non-Windows Warez</option>';
            html += '<option value="Apps to Mobile">[Move] Applications > Mobile</option>';
        }
        if (section.ebooks) {
            html += '<option value="eBook to aBook">[Move] E-Books > Audiobooks</option>';
            html += '<option value="eBook to Tuts">[Move] E-Books > Tutorials</option>';
            html += '<option value="eBook to cBook">[Move] E-Books > Comics</option>';
        }
        if (section.games) html += '<option value="Games to Console">[Move] Games > Console Games</option>';
        if (section.movies) {
            html += '<option value="Movies to TV">[Move] Movies > TV Shows</option>';
            html += '<option value="Obsolete Movie">[Trash] Obsolete Movie Quality</option>';
        }
        if (section.tv) html += '<option value="TV to Movies">[Move] TV Shows > Movies</option>';
        if (section.music) html += '<option value="Music to Music Videos">[Move] Music > Music Videos</option>';
        if (section.app_req) {
            html += '<option value="Completed Apps">[Move] Completed Requests</option>';
            html += '<option value="30 Days Apps">[Move] Over 30 Days Req</option>';
        }
        if (section.ebooks_req) {
            html += '<option value="Completed Ebooks">[Move] Completed Requests</option>';
            html += '<option value="30 Days Ebooks">[Move] Over 30 Days Req</option>';
        }
        if (section.games_req) {
            html += '<option value="Completed Games">[Move] Completed Requests</option>';
            html += '<option value="30 Days Games">[Move] Over 30 Days Req</option>';
        }
        if (section.movies_req) {
            html += '<option value="Completed Movies">[Move] Completed Requests</option>';
            html += '<option value="30 Days Movies">[Move] Over 30 Days Req</option>';
        }
        if (section.music_req) {
            html += '<option value="Completed Music">[Move] Completed Requests</option>';
            html += '<option value="30 Days Music">[Move] Over 30 Days Req</option>';
        }
        if (section.other_req) {
            html += '<option value="Completed Other">[Move] Completed Requests</option>';
            html += '<option value="30 Days Other">[Move] Over 30 Days Req</option>';
        }
        if (section.crack_req) {
            html += '<option value="Completed Cracks">[Move] Completed Requests</option>';
            html += '<option value="30 Days Cracks">[Move] Over 30 Days Req</option>';
        }
        html += '</select></div>';

        $(".bar-top").append(html);
        $(".mod_toolbox").css({"text-align": "right","padding-right": "150px"});
    },

    applyAction: function() {
        var thisValue = $(this).val();

        //http://forum.dirtywarez.com/mcp.php?f=10&t=2908923&quickmod=1&action=move&to_forum_id=41&confirm=Yes&moveit=1&redirect=.%2Fviewtopic.php%3Ff%3D10%26t%3D2908923&sid=5fd1dad3bbd203dfb04561ac7b54f1b8
        var binLink = $('ul.post-buttons > li:first-child > a').attr('href');

       // alert(binLink); return;
        if (!binLink) { return; } 

        var quickReply = $("textarea[name=message]");
        var postButton = $("input[name=post]");

        var modText = "";

        function moveThread(toForum, modText) {
            quickReply.val(modText);
            postButton.click();

            var moveLink = binLink.replace("to_forum_id=33", "to_forum_id=" + toForum);
            //console.log(moveLink); return;

            var request = $.ajax({
                url: moveLink,
                async: false,
                type: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });
        }

        switch (thisValue) {

            // Binning
            case "Trash Dead links":
                modText = "[mod]This thread contains dead links and it's moved to Recycle Bin. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.[/mod]";
                moveThread(33, modText);
                break;

            case "Trash Premium only":
                modText = "[mod]This thread contains only premium links and it's moved to Recycle Bin. If you post premium links you must also provide free alternatives, otherwise your post will be trashed.[/mod]";
                moveThread(33, modText);
                break;

            case "Trash Premium only alive":
                modText = "[mod]This thread contains only premium links alive and it's moved to Recycle Bin. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.\n\n[size=85][i]* If you post premium links you must also provide free alternatives, otherwise your post will be trashed.\n* Posts with dead free links leaving only premium will also be trashed.[/i][/size][/mod]";
                moveThread(33, modText);
                break;

            case "Trash Uncoded links":
                modText = "[mod]All links posted on the forum including IMDB and homepage info links ect. must be coded including internal links.\n\nUncoded Links - Post Trashed[/mod]";
                moveThread(33, modText);
                break;

            case "Wrong forum - Trashed":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Binned.[/b][/mod]";
                moveThread(33, modText);
                break;

            case "Non-English":
                modText = "[mod]This is an English speaking board, please remember that all publicly displayed messages must be written in the English language. If you choose to repost your topic, make sure the post is in the English language.\n\n[b]Binning.[/b][/mod]";
                moveThread(33, modText);
                break;

            case "Flooding":
                modText = "[mod]Forum flooding - Posting of shares with the same topic/title/scene release but different links is not  permitted. Please use the edit button to add fresh links to your post/s.\n\nYou already posted the same release.\n\n[b]Binning.[/b][/mod]";
                moveThread(33, modText);
                break;

            case "Dupe":
                modText = "[mod]Double posting of the same links (also called dupe) is not allowed. You already posted the same link(s).\n\n[b]Binning.[/b][/mod]";
                moveThread(33, modText);
                break;

            case "Non-Direct Link":
                modText = "[mod]Do not post masked, protected or redirecting links, only direct download links are permitted. Surveys for downloads are also prohibited.\n\n[b]Binning.[/b][/mod]";
                moveThread(33, modText);
                break;

            case "Blacklisted":
                modText = "[mod]Blacklisted links only > Trashed[/mod]";
                moveThread(33, modText);
                break;

            case "Orphaned":
                modText = "[mod]Orphaned Post > Trashed[/mod]";
                moveThread(33, modText);
                break;

            case "Obsolete Movie":
                modText = "[mod] CAM/TS quality movies will be removed when DVD or Blu-Ray quality rips are available for the same title.\n\nObsolete Quality > Trashed[/mod]";
                moveThread(33, modText);
                brek;


            // Quarantine
            case "Adult":
                modText = "[mod][b]Adult material in violation of Rule #5 - DELETED[/b][/mod]";
                moveThread(41, modText);
                break;

            case "DMCA":
                modText = "[mod]DMCA > Trashed[/mod]";
                moveThread(41, modText);
                break;



            // Moving
            case "eBook to aBook":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from E-Books to Audiobooks.[/b][/mod]";
                moveThread(49, modText);
                break;

            case "eBook to Tuts":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from E-Books to Tutorials.[/b][/mod]";
                moveThread(58, modText);
                break;

            case "eBook to cBook":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from E-Books to Comics.[/b][/mod]";
                moveThread(59, modText);
                break;

            case "Apps to Mac":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from Applications to Mac Os.[/b][/mod]";
                moveThread(25, modText);
                break;

            case "Apps to Non-Win":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from Applications to Non-Windows Warez.[/b][/mod]";
                moveThread(21, modText);
                break;

            case "Apps to Mobile":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from Applications to Mobile.[/b][/mod]";
                moveThread(26, modText);
                break;

            case "Games to Console":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from Games to Console Games.[/b][/mod]";
                moveThread(11, modText);
                break;

            case "Movies to TV":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from Movies to TV Shows.[/b][/mod]";
                moveThread(16, modText);
                break;

            case "TV to Movies":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from TV Shows to Movies.[/b][/mod]";
                moveThread(12, modText);
                break;

            case "Music to Music Videos":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from Music to Music Videos.[/b][/mod]";
                moveThread(24, modText);
                break;


            // Completed Reqs
            case "Completed Apps":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(42, modText);
                break;
            
            case "Completed Ebooks":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(47, modText);
                break;

            case "Completed Games":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(43, modText);
                break;

            case "Completed Movies":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(45, modText);
                break;

            case "Completed Music":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(46, modText);
                break;
            
            case "Completed Other":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(48, modText);
                break;

            case "Completed Cracks":
                modText = "[mod]Moved to Completed Requests.[/mod]";
                moveThread(44, modText);
                break;

            // Over 30 Days Reqs
            case "30 Days Apps":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(42, modText);
                break;
            
            case "30 Days Ebooks":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(47, modText);
                break;

            case "30 Days Games":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(43, modText);
                break;

            case "30 Days Movies":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(45, modText);
                break;

            case "30 Days Music":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(46, modText);
                break;
            
            case "30 Days Other":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(48, modText);
                break;

            case "30 Days Cracks":
                modText = "[mod]Over 30 days > Moved to Completed Requests.[/mod]";
                moveThread(44, modText);
                break;

            case "undef":
                break;
        }

        var cursorPos = $('textarea.inputbox')[0].selectionStart;
        var textareaText = $("textarea.inputbox").val();

        if (window.location.href.indexOf("viewtopic") > -1) {
            $("textarea.inputbox").val(textareaText.substring(0, cursorPos) + modText + textareaText.substring(cursorPos));
        } else if (window.location.href.indexOf("posting") > -1) {
            $("textarea#message.inputbox").val(textareaText.substring(0, cursorPos) + modText + textareaText.substring(cursorPos));
        }
    }
}



/************************************************************** 
**                      Moderator BBCodes                    **
***************************************************************/

var modBBCodes = {
    loadHTML: function() {
        var html = "";

        html += '<div class="modBBCodes">';
        html += '<input class="button2" type="button" value="Dead links" alt="Dead" />';
        html += '<input class="button2" type="button" value="Premium only" /> ';
        html += '<input class="button2" type="button" value="Premium only alive" /> ';
        html += '<input class="button2" type="button" value="Dead links removed" /> ';
        html += '<input class="button2" type="button" value="Uncoded links" /> ';
        html += '<input class="button2" type="button" value="Orphaned" /> ';
        html += 'Other situations: <select class="selectop">';
        html += '<option value="undef">select...</option>';
        html += '<option value="Wrong forum - Moved">Wrong forum - Moved</option>';
        html += '<option value="Wrong forum - Trashed">Wrong forum - Trashed</option>';
        html += '<option value="Non-English">Non-English - Trashed</option>';
        html += '<option value="Flooding">Flooding</option>';
        html += '<option value="Dupe">Double post, same links (dupe)</option>';
        html += '<option value="Non-Direct Link">Non-Direct Link</option>';
        html += '<option value="Adult">Adult Content</option>';
        html += '<option value="DMCA">DMCA</option>';
        html += '<option value="Blacklisted">Blacklisted Links Only</option>';
        html += '</select></div>';

        $(".fields1").find("#message-box").prepend(html);
    },

    addText: function() {
        var thisValue = $(this).val();
        var modText = "";

        switch (thisValue) {
            case "Dead links":
                modText = "[mod]This thread contains dead links and it's moved to Recycle Bin. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.[/mod]";
                break;
            case "Premium only":
                modText = "[mod]This thread contains only premium links and it's moved to Recycle Bin. If you post premium links you must also provide free alternatives, otherwise your post will be trashed.[/mod]";
                break;
            case "Premium only alive":
                modText = "[mod]This thread contains only premium links alive and it's moved to Recycle Bin. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.\n\n[size=85][i]* If you post premium links you must also provide free alternatives, otherwise your post will be trashed.\n* Posts with dead free links leaving only premium will also be trashed.[/i][/size][/mod]";
                break;
            case "Dead links removed":
                modText = "[mod]Post Edited > Dead links removed[/mod]";
                break;
            case "Uncoded links":
                modText = "[mod]All links posted on the forum including IMDB and homepage info links ect. must be coded including internal links.\n\nUncoded Links - Post Trashed[/mod]";
                break;
            case "Wrong forum - Moved":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Moved from X to Y.[/b][/mod]";
                break;
            case "Wrong forum - Trashed":
                modText = "[mod]Topics must be submitted to the relevant forums. Please read the forum descriptions before posting.\n\n[b]Binned.[/b][/mod]";
                break;
            case "Non-English":
                modText = "[mod]This is an English speaking board, please remember that all publicly displayed messages must be written in the English language. If you choose to repost your topic, make sure the post is in the English language.\n\n[b]Binning.[/b][/mod]";
                break;
            case "Flooding":
                modText = "[mod]Forum flooding - Posting of shares with the same topic/title/scene release but different links is not  permitted. Please use the edit button to add fresh links to your post/s.\n\nYou already posted the same release.\n\n[b]Binning.[/b][/mod]";
                break;
            case "Dupe":
                modText = "[mod]Double posting of the same links (also called dupe) is not allowed. You already posted the same link(s).\n\n[b]Binning.[/b][/mod]";
                break;
            case "Non-Direct Link":
                modText = "[mod]Do not post masked, protected or redirecting links, only direct download links are permitted. Surveys for downloads are also prohibited.\n\n[b]Binning.[/b][/mod]";
                break;
            case "Adult":
                modText = "[mod][b]Adult material in violation of Rule #5 - DELETED[/b][/mod]";
                break;
            case "DMCA":
                modText = "[mod]DMCA > Trashed[/mod]";
                break;
            case "Blacklisted":
                modText = "[mod]Blacklisted links only > Trashed[/mod]";
                break;
            case "Orphaned":
                modText = "[mod]Orphaned Post > Trashed[/mod]";
                break;

            case "undef":
                modText = "";
                break;
        }

        var cursorPos = $('textarea.inputbox')[0].selectionStart;
        var textareaText = $("textarea.inputbox").val();

        if (window.location.href.indexOf("viewtopic") > -1) {
            $("textarea.inputbox").val(textareaText.substring(0, cursorPos) + modText + textareaText.substring(cursorPos));
        } else if (window.location.href.indexOf("posting") > -1) {
            $("textarea#message.inputbox").val(textareaText.substring(0, cursorPos) + modText + textareaText.substring(cursorPos));
        }
    }
};

$(function() {
    modBBCodes.loadHTML();
    $('.modBBCodes .button2').on("click", modBBCodes.addText).css({"margin-right": "5px","font-size": "105%"});
    $('.selectop').on("change", modBBCodes.addText).css({"margin-right": "5px","font-size": "105%"});

    toolbox.loadHTML();
    $('.toolbox_sel').on("change", toolbox.applyAction);
});