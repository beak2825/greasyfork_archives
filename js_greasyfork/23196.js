// ==UserScript==
// @name         Sic 'Em 365 - Ignore
// @version      1.0
// @description  Hide posts by users on ignore list
// @author       trumpetbear
// @match        https://sicem365.com/forums/1/topics/*
// @match        http://sicem365.com/forums/1/topics/*
// @grant        none
// @namespace https://greasyfork.org/users/66085
// @downloadURL https://update.greasyfork.org/scripts/23196/Sic%20%27Em%20365%20-%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/23196/Sic%20%27Em%20365%20-%20Ignore.meta.js
// ==/UserScript==


/***** TO ADD A USER TO YOUR IGNORE LIST *****

Add the username exatly as it appears to the variable below. This is case sensitve.
Seperate multiple users with commas.

EXAMPLE:

var ignoreList = "UsernameOne,usernameTwo,User Name,User:Name Three";

*/

var ignoreList = "Brian Ethridge,trumpetbear,F5:Stewart";

var reload = true;
var url = window.location.href;

$( document ).ajaxComplete(function() {
    if (url != window.location.href) {
        reload = true;
        url = window.location.href;
    }
    hideIgnorePosts();
    reload = false;
});

function hideIgnorePosts() {
    if (ignoreList.length > 0){
        var posts = $(".postUsername");
        for (x=0;x<posts.length;x++) {
            if (reload && ignoreList.indexOf($(posts[x]).text()) > -1) {
                $($(".postBody")[x]).hide();
                $($(".postFooter")[x]).hide();
                $($(".postContent")[x]).append("<a class=\"tempLink\" onclick=\"javascript:$(this).hide();$($('.postBody')["+x+"]).show();$($('.postFooter')["+x+"]).show();\">View Post</a>");
            }
        }
    }
}