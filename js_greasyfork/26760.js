// ==UserScript==
// @name         GAB User Autocomplete List Builder
// @namespace    http://gab.ai/
// @version      0.1
// @description  User Autocomplete requirement 1 of 2: gather info for the user autocomplete lists
// @author       Jeremiah 20:9
// @match        https://gab.ai/*/followers
// @match        https://gab.ai/*/following
// @require      https://code.jquery.com/jquery-1.8.2.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26760/GAB%20User%20Autocomplete%20List%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/26760/GAB%20User%20Autocomplete%20List%20Builder.meta.js
// ==/UserScript==

var itvcheck1 = -1;
var itvcheck2 = -1;
var beforecount = 0;
var followers = [];
var following = [];

$(document).ready(function(){
    itvcheck1 = setInterval(checkForFollowersLoad, 500);
    itvcheck2 = setInterval(checkForFollowingLoad, 500);
});

function checkForFollowersLoad()
{
    if($("profile-followers > div").length === 0 || $("#refreshfollowers").length === 1)
        return;

    followers = [];

    $("profile-followers > div").prepend('<a id="refreshfollowers">Refresh Followers</a>');
    $("#refreshfollowers").click(function(){
        $("#refreshfollowers").html("Loading...");
        refreshFollowers();
    });
}
function checkForFollowingLoad()
{
    if($("profile-following > div").length === 0  || $("#refreshfollowing").length === 1)
        return;

    following = [];

    $("profile-following > div").prepend('<a id="refreshfollowing">Refresh Following</a>');
    $("#refreshfollowing").click(function(){
        $("#refreshfollowing").html("Loading...");
        refreshFollowing();
    });
}

function refreshFollowers()
{
    var user = window.location.href.replace("https://", "").split("/");
    user = user[1];
    var loc = "https://gab.ai/users/" + user + "/followers";
    // https://gab.ai/users/<USERNAME>/followers?before=X
    $.ajax({
        dataType: "json",
        url: loc + "?before=" + beforecount,
        success: function(data){
            for(var d in data.data)
            {
                var user = {};
                user.name = data.data[d].name;
                user.atname = data.data[d].username;
                user.pic = data.data[d].picture_url;
                user.type = "follower";
                followers.push(user);
            }
            $("#refreshfollowers").html("Loading: " + followers.length);
            if(!data["no-more"])
            {
                beforecount += 30;
                refreshFollowers();
            }
            else
            {
                followers.sort(function(a, b){
                    if (a.atname.toLowerCase() < b.atname.toLowerCase())
                        return -1;
                    if (a.atname.toLowerCase() > b.atname.toLowerCase())
                        return 1;
                    return 0;
                });

                localStorage.setItem("gab-user-followers", JSON.stringify(followers));
                beforecount = 0;
                alert("Done! Updated follower list for autocomplete. " + followers.length + " followers found.");
                $("#refreshfollowers").remove();
            }
        }
    });
}

function refreshFollowing()
{
    var user = window.location.href.replace("https://", "").split("/");
    user = user[1];
    var loc = "https://gab.ai/users/" + user + "/following";
    // https://gab.ai/users/<USERNAME>/following?before=X
    $.ajax({
        dataType: "json",
        url: loc + "?before=" + beforecount,
        success: function(data){
            for(var d in data.data)
            {
                var user = {};
                user.name = data.data[d].name;
                user.atname = data.data[d].username;
                user.pic = data.data[d].picture_url;
                user.type = "following";
                following.push(user);
            }
            $("#refreshfollowing").html("Loading: " + following.length);
            if(!data["no-more"])
            {
                beforecount += 30;
                refreshFollowing();
            }
            else
            {
                following.sort(function(a, b){
                    if (a.atname.toLowerCase() < b.atname.toLowerCase())
                        return -1;
                    if (a.atname.toLowerCase() > b.atname.toLowerCase())
                        return 1;
                    return 0;
                });
                
                localStorage.setItem("gab-user-following", JSON.stringify(following));
                beforecount = 0;
                alert("Done! Updated following list for autocomplete. " + following.length + " following found.");
                $("#refreshfollowing").remove();
            }
        }
    });
}