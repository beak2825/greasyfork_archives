// ==UserScript==
// @name         Remove Mention Gabs From Gab.ai Homepage
// @namespace    https://gab.ai/Jeremy20_0
// @version      0.1
// @description  This script will remove all posts which begin with a @ mention
// @author       Jeremiah 20:9
// @match        https://gab.ai/home
// @match        https://gab.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22614/Remove%20Mention%20Gabs%20From%20Gabai%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/22614/Remove%20Mention%20Gabs%20From%20Gabai%20Homepage.meta.js
// ==/UserScript==

$(document).ready(function(){
    var list = document.getElementById("user-post-list");
    list.addEventListener('DOMSubtreeModified', function () {
        var posts = $("div.post").not(".post--load");
        if(posts.length < 2 || userpostlist === undefined || userpostlist.posts.length === 0)
            return;
        var regex = /^\s*@[A-Za-z][A-Za-z0-9_]*/gi;
        for(var p = 0; p < userpostlist.posts.length; p++)
        {
            if(regex.test(userpostlist.posts[p].post.body))
            {
                userpostlist.posts.splice(p,1);
                p--;
            }
        }
    });
});