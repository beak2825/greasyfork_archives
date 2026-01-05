// ==UserScript==
// @name	Ukrywacz postów na FSO
// @namespace	pl.kurczak
// @author	Kurczak
// @description	Pozwala ukrywać posty wybranych użytkowników
// @include	http://forum.siatka.org/viewtopic*
// @include	http://www.forum.siatka.org/viewtopic*
// @version	1.0.0
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/18810/Ukrywacz%20post%C3%B3w%20na%20FSO.user.js
// @updateURL https://update.greasyfork.org/scripts/18810/Ukrywacz%20post%C3%B3w%20na%20FSO.meta.js
// ==/UserScript==
function block(user, posts) {
    var blocked = loadBlockedUsers();
    var index = blocked.indexOf(user);
    if(index === -1) {
        blocked.push(user);
        storeBlockedUsers(blocked);
        filterPosts(posts, blocked);
    }
}

function unblock(user, posts) {
    var blocked = loadBlockedUsers();
    var index = blocked.indexOf(user);
    if(index !== -1) {
        blocked.splice(index, 1);
        storeBlockedUsers(blocked);
        filterPosts(posts, blocked);
    }
}

function loadBlockedUsers() {
    return GM_getValue("blocked", [""]);
}

function storeBlockedUsers(blocked) {
    return GM_setValue("blocked", blocked);
}

function prepare(posts) {
    var fa = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">';
    var hb = '<div class="hiddenBar" style="display: none;"><a class="showPost" href="javascript:void(0)" title="Pokaż post">[ + ]</a> Ukryty post</div>';
    var sb = '<div class="shownBar"><a class="hidePost" href="javascript:void(0)" title="Ukryj post">[ - ]</a> <a href="javascript:void(0)" style="display: none;" class="blockUser" title="Zablokuj użytkownika">[ <i aria-hidden="true" class="fa fa-lock"></i> ]</a> <a style="display: none;" class="unblockUser" href="javascript:void(0)" title="Odblokuj użytkownika">[ <i aria-hidden="true" class="fa fa-unlock"></i> ]</a></div>';

    $("head").append(fa);
    posts.find(".corners-top").after(hb).after(sb);

    posts.each(function () {
        var body = $(this).find(".postbody");
        var profile = $(this).find(".postprofile");
        var author = $(this).find(".author strong a").text();
        var hiddenBar = $(this).find(".hiddenBar");
        var shownBar = $(this).find(".shownBar");
        $(this).find(".showPost").click(function () {
            body.show();
            profile.show();
            shownBar.show();
            hiddenBar.hide();
        });
        $(this).find(".hidePost").click(function () {
            body.hide();
            profile.hide();
            shownBar.hide();
            hiddenBar.show();
        });
        $(this).find(".blockUser").click(function () {
            block(author, posts);
        });
        $(this).find(".unblockUser").click(function () {
            unblock(author, posts);
        });
    });
}

function filterPosts(posts, blocked) {
    posts.each(function () {
        var author = $(this).find(".author strong a").text();
        if (blocked.indexOf(author) === -1) {
            $(this).find(".blockUser").show();
            $(this).find(".unblockUser").hide();
            $(this).find(".showPost").click();
        } else {
            $(this).find(".blockUser").hide();
            $(this).find(".unblockUser").show();
            $(this).find(".hidePost").click();
        }
    });
}

function main() {
    var posts = $(".post");
    prepare(posts);
    filterPosts(posts, loadBlockedUsers());
}

$(document).ready(main);
