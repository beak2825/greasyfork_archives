// ==UserScript==
// @name         Gab.ai Better Censor words
// @namespace    https://gab.ai/Jeremy20_9
// @version      0.3
// @description  wildcard support [%] for Gab.ai censor words
// @author       Jeremiah 20:9
// @match        https://gab.ai/self-censor*
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23798/Gabai%20Better%20Censor%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/23798/Gabai%20Better%20Censor%20words.meta.js
// ==/UserScript==

var list = null;
if(window.location.href.indexOf("https://gab.ai/self-censor") == 0)
{
    //----- SELF CENSOR PAGE ------------------------------------------
    $(document).ready(function(){
        list = $("ul.censor-list--word")[0];
        list.addEventListener('DOMSubtreeModified', handleListPopulate);
        setTimeout(handleListPopulate, 500);
    });
}
else
{
    //----- OTHER PAGES -----------------------------------------------
    $(document).ready(function(){
        var cwords = localStorage.getItem("gab-censored-words");
        if(!cwords)
            return;

        cwords = JSON.parse(cwords);

        if(cwords.length == 0)
            return;

        list = $("#home-post-list,#user-post-list")[0];
        if(!list)
            return;
        
        list.addEventListener('DOMSubtreeModified', handleUserPosts);
    });
}
function handleUserPosts()
{
    var cwords = localStorage.getItem("gab-censored-words");
    cwords = JSON.parse(cwords);
    var posts = $("div.post").not(".post--load");
    var plist = (userpostlist == undefined || userpostlist.posts.length == 0) ? postlist : userpostlist;
    
    if(posts.length < 2 || plist == undefined || plist.posts.length == 0)
        return;

    for(var c in cwords)
    {
        var regex = new RegExp(cwords[c], "gmi");
        for(var p = 0; p < plist.posts.length; p++)
        {
            if(regex.test(plist.posts[p].post.body))
            {
                plist.posts.splice(p,1);
                p--;
            }
        }
    }
}
function handleListPopulate()
{
    var censorwords = [];

    if(!censorPreferences.words)
        return;

    for(var w in censorPreferences.words)
    {
        var word = censorPreferences.words[w];
        word = "(^|\\b)" + word.replace("%", "[\\w]*") + "\\b";
        censorwords.push(word);
    }

    list.removeEventListener('DOMSubtreeModified', handleListPopulate);
    localStorage.setItem("gab-censored-words", JSON.stringify(censorwords));
}