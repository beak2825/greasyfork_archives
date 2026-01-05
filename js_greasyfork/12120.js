// ==UserScript==
// @name        KAT - Search Categories
// @namespace   SearchCategories
// @version     1.0
// @description Allows you search requests/ideabox and include category
// @match       https://kat.cr/request/*
// @match       https://sandbox.kat.cr/request/*
// @match       https://kat.cr/ideabox/*
// @match       https://sandbox.kat.cr/ideabox/*
// @downloadURL https://update.greasyfork.org/scripts/12120/KAT%20-%20Search%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/12120/KAT%20-%20Search%20Categories.meta.js
// ==/UserScript==

var category = "";
var request = '<option value="All" selected>All</option><option value="Anime">Anime</option><option value="Applications">Applications</option><option value="Books">Books</option><option value="Games">Games</option><option value="Movies">Movies</option><option value="Music">Music</option><option value="Other">Other</option><option value="TV">TV</option><option value="Unassigned">Unassigned</option><option value="XXX">XXX</option>';
var ideas = '<option value="All" selected>All</option><option value="Achievements, Profile and Friends">Achievements, Profile and Friends</option><option value="Blog">Blog</option><option value="Bugs and ASAP">Bugs and ASAP</option><option value="Comments, Messages and Feedback">Comments, Messages and Feedback</option><option value="Community">Community</option><option value="General Enhancements">General Enhancements</option><option value="Languages">Languages</option><option value="Mobile, Apps and Browser Extensions">Mobile, Apps and Browser Extensions</option><option value="New Category Suggestions">New Category Suggestions</option><option value="Other">Other</option><option value="Search and Indexation">Search and Indexation</option><option value="Security">Security</option><option value="Site Mechanics, Design and Development">Site Mechanics, Design and Development</option><option value="Subscriptions, Bookmarks and RSS">Subscriptions, Bookmarks and RSS</option><option value="Torrent Enhancements">Torrent Enhancements</option>';
$('<select id="cat" name="cat" style="width:110px; margin:0px 5px;"></select>').insertAfter('input[name="s"]');

//IDEAS NEED UPDATING
if (window.location.href.search("/request/") != -1)
{
    $("#cat").html(request);
    if (window.location.href.search("/search/") != -1)
    {
        category = window.location.href.split("cat=")[1];
        $("#cat").val(category);
        if (category != "All")
        {
            $(".request-item").each(function()
            {
                if ($(this).find(".requestBoxBody").children().eq(2).children().text() != category) $(this).hide();
            });
        }
    }
}
else
{
    $("#cat").html(ideas);
    $("#cat").css("width", "280px");
    if (window.location.href.search("/search/") != -1)
    {
        category = window.location.href.split("cat=")[1];
        category = category.replace(/%2C/g, ",");
        category = category.replace(/\+/g, " ");
        console.log(category);
        $("#cat").val(category);
        if (category != "All")
        {
            $(".ideaBox").each(function()
            {
                if ($(this).find(".ideaBoxBody").children().eq(2).children().text() != category) $(this).hide();
            });
        }
    }
}