// ==UserScript==
// @name         Gab Autocomplete for Users
// @namespace    https://gab.ai/Jeremy20_9
// @version      0.4
// @description  provides autocomplete for users from following and followers list
// @author       Jeremiah 20:9
// @match        https://gab.ai/*/following
// @match        https://gab.ai/*/followers
// @match        https://gab.ai/home
// @match        https://gab.ai/
// @match        https://gab.ai
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23004/Gab%20Autocomplete%20for%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/23004/Gab%20Autocomplete%20for%20Users.meta.js
// ==/UserScript==

var itvautocompleteusers = -1;
var itvgatherusers = -1;

$(document).ready(function(){
    var profileurl = $(".header__link--profile").attr("href");
    if(window.location.href == profileurl + "/following" || window.location.href == profileurl + "/followers")
    {
        itvgatherusers = setInterval(gatherUsers, 200);
    }
    else if(window.location.href == "https://gab.ai/home" || window.location.href == "https://gab.ai/" || window.location.href == "https://gab.ai")
    {
        itvautocompleteusers = setInterval(setupUserAutocomplete, 200);
    }
});

function gatherUsers()
{
    if($(".profile-badge.fal-panel").length === 0)
        return;
    
    clearInterval(itvgatherusers);
        
    var users = [];
    
    $(".profile-badge.fal-panel").each(function(idx){
        var userlink = $(this).find(".profile-badge__name");
        var href = $(userlink).attr("href");
        var hrefparts = href.split("/");
        var atname = hrefparts[hrefparts.length - 1];
        var username = $(userlink).text();
        var regex = /[^A-Z0-9 ]/gi;
        username = username.replace(regex, "").trim();
        var userpic = $(this).find(".profile-badge__picture").attr("src");
        users.push({name:username, atname:atname , pic:userpic});
    });
    if(window.location.href.indexOf("/followers") != -1)
    {
        localStorage.setItem("gabfollowers", JSON.stringify(users));
    }
    else if(window.location.href.indexOf("/following") != -1)
    {
        localStorage.setItem("gabfollowing", JSON.stringify(users));
    }
}

function setupUserAutocomplete()
{
    clearInterval(itvautocompleteusers);
    window.autocomplete_users = [];
    
    if(localStorage.getItem("gabfollowers"))
    {
        window.autocomplete_users = window.autocomplete_users.concat(JSON.parse(localStorage.getItem("gabfollowers")));//JSON.parse($.cookie("gabfollowers")));
    }
    if(localStorage.getItem("gabfollowing"))
    {
        window.autocomplete_users = window.autocomplete_users.concat(JSON.parse(localStorage.getItem("gabfollowing")));//JSON.parse($.cookie("gabfollowing")));
    }
    if(window.autocomplete_users.length === 0)
    {
        window.autocomplete_users = [{name:"Visit your followers and following pages to populate list", pic:null}];
    }
    
    // remove duplicates
    var usertable = {};
    for(var u = 0; u < window.autocomplete_users.length; u++)
    {
        var user = window.autocomplete_users[u];
        if(usertable[user.atname] === undefined)
            usertable[user.atname] = true;
        else
        {
            window.autocomplete_users.splice(u, 1);
            u--;
        }
    }
    
    $(composer.$el).add(composerModal.$el).find("textarea").atwho(
        {
            at: "@",
            displayTpl: "<li><img width='20' height='20' src='${pic}' align='left' style='margin-right:5px' />${name}</li>",
            insertTpl: "@${atname}",
            data: window.autocomplete_users
        }
    );
}