// ==UserScript==
// @name         Ghost Trappers Friends Crawler
// @version      1.1
// @description  Makes getting more friends super easy.
// @author       Hazado
// @require		 https://code.jquery.com/jquery-2.2.2.min.js
// @match        *www.ghost-trappers.com/fb/live_feed.php*
// @match        *www.ghost-trappers.com/fb/invite_friend_into_team.php*
// @match        *www.ghost-trappers.com/fb/scores.php?type=myteam&more=true*
// @grant        none
// @namespace    https://greasyfork.org/users/149039
// @downloadURL https://update.greasyfork.org/scripts/32340/Ghost%20Trappers%20Friends%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/32340/Ghost%20Trappers%20Friends%20Crawler.meta.js
// ==/UserScript==
var check = false;
var user = JSON.parse(localStorage.getItem('AddNames'));
var friends = JSON.parse(localStorage.getItem('GhostTrapperFriends'));
if (friends.length > 1000) throw new Error("You have max # of friends, either clear some from your friends list or cancel invites.");
if (user === null) { var user = [];}
else if (user.length > 20 && window.location.href.indexOf("invite_friend_into_team.php") === -1) { window.location.href = "http://www.ghost-trappers.com/fb/invite_friend_into_team.php"; }
if (friends === null && window.location.href.indexOf("scores.php?type=myteam&more=true") == -1) { check = true; var friends = [];}
console.log("Users: "+user.length);
console.log("Friends and Invited Users: "+friends.length);

function checkfornames() {
    var temp = document.querySelectorAll('span[class*=playerName]');
    if (temp !== null && temp !== undefined){
        for (i = 0; i < temp.length; i++) {
            user.push(temp[i].textContent);
        }
        var uniqueNames = [];
        $.each(user, function(i, el){
            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        uniqueNames = uniqueNames.filter(function(val) {
            return friends.indexOf(val) == -1;
        });
        localStorage.setItem('AddNames', JSON.stringify(uniqueNames));
    }
}

function acceptFriends() {
    var temp = document.querySelectorAll('a[class*=acceptTeamRequest]');
    if (temp !== null && temp !== undefined){
        for (i = 0; i < temp.length; i++) {
            var tempsave = temp[i].outerHTML;
            tempsave = tempsave.replace("<a class=\"acceptTeamRequest\" onclick=\"acceptTeamRequest(","");
            tempsave = tempsave.replace(")\"></a>","");
            $.ajax({
                type: "POST",
                url: 'ajax_invite_friend_into_team.php',
                data: 'action=acceptRequest' + '&requestId=' + tempsave,
                success: onAcceptOrDeclinedOrCanceledReceived,
                dataType: 'json'
            });
        }
    }
    filterFriends();
}

function filterFriends() {
    $(document).ready();
    var temp = document.querySelectorAll('span[class*=playerName]');
    var tempuser = [];
    if (temp !== null && temp !== undefined){
        // Add invited users to Friend List
        for (i = 0; i < temp.length; i++) {
            tempuser.push(temp[i].textContent);
        }
        $.each(tempuser, function(g, el){
            if($.inArray(el, friends) === -1) friends.push(el);
        });
        // Compare users to add against new friend list
        user = user.filter(function(val) {
            return friends.indexOf(val) == -1;
        });
        localStorage.setItem('GhostTrapperFriends', JSON.stringify(friends));
    }
    addFriends();
}

function addFriends() {
    // Add new users
    var agentName = user.pop();
    if (agentName !== undefined) {
        $('#inviteRequestMessageContainer').hide();
        $.ajax({
            type: "POST",
            url: 'ajax_invite_friend_into_team.php',
            data: 'action=addFriendRequest' + '&agentName=' + agentName,
            success: onSendTeamRequestReceived,
            dataType: 'json'
        });
        setTimeout(function() { addFriends(); }, 1000);
        localStorage.removeItem('AddNames');
    }
    // Add users invited to Friend List
    else if (agentName === undefined) {
        temp = document.querySelectorAll('span[class*=playerName]');
        tempuser = [];
        if (temp !== null && temp !== undefined){
            for (i = 0; i < temp.length; i++) {
                tempuser.push(temp[i].textContent);
            }
            $.each(tempuser, function(i, el){
                if($.inArray(el, friends) === -1) friends.push(el);
            });
        }
        window.location.href = "http://www.ghost-trappers.com/fb/live_feed.php";
    }
}

function setupFriends() {
    $(document).ready();
    var temp = document.querySelectorAll('span[class*=playerName]');
    if (temp !== null && temp !== undefined){
        for (i = 0; i < temp.length; i++) {
            user.push(temp[i].textContent);
        }
        var uniqueFriends = [];
        $.each(user, function(i, el){
            if($.inArray(el, uniqueFriends) === -1) uniqueFriends.push(el);
        });
        localStorage.setItem('GhostTrapperFriends', JSON.stringify(uniqueFriends));
        alert("Friends recorded!");
        check = false;
        window.location.href = "http://www.ghost-trappers.com/fb/live_feed.php";
    }
}
if (check === true){alert("You need to let the Friend page load completely first!");window.location.href = "http://www.ghost-trappers.com/fb/scores.php?type=myteam&more=true";}
else if (window.location.href.indexOf("www.ghost-trappers.com/fb/live_feed.php") != -1) { window.setInterval(checkfornames,1000); }
else if (window.location.href.indexOf("www.ghost-trappers.com/fb/invite_friend_into_team.php") != -1) { acceptFriends(); }
else if (window.location.href.indexOf("www.ghost-trappers.com/fb/scores.php?type=myteam&more=true") != -1) { setTimeout(function() { setupFriends(); },20000); }