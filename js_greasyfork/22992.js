// ==UserScript==
// @name         Popup List For Popular Hashtags
// @namespace    https://gab.ai/Jeremy20_0
// @version      0.2
// @description  support hashtag autocomplete for popular on gab.ai
// @author       Jeremiah 20:9
// @match        https://gab.ai/home
// @match        https://gab.ai/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22992/Popup%20List%20For%20Popular%20Hashtags.user.js
// @updateURL https://update.greasyfork.org/scripts/22992/Popup%20List%20For%20Popular%20Hashtags.meta.js
// ==/UserScript==

window.hashtags = [];

var itvhashtags = -1;
function hasContent(ct)
{
    for(var w = 0; w < window.emojis.length; w++)
    {
        if(window.emojis[w].name.toLowerCase() == ct.toLowerCase())
            return true;
    }
    return false;
}

function setupHashtags()
{
    if($(".hashtags__item").not(".hashtags__item--load").length === 0)
        return;
    
    clearInterval(itvhashtags);
    
    $(".hashtags__item").not(".hashtags__item--load").each(function(idx){
        var href = $(this).attr("href");
        var hrefparts = href.split("/");
        var hashtag = hrefparts[hrefparts.length - 1];
        if(!hasContent(hashtag))
        {
            window.hashtags.push({name: hashtag.toLowerCase(), content: "#" + hashtag});
        }
    });
    $(composer.$el).add(composerModal.$el).find("textarea").atwho({at: "#", displayTpl: "<li>${content}</li>", insertTpl: "${content}", data: window.hashtags});
}
$(document).ready(function(){
    itvhashtags = setInterval(setupHashtags, 200);
});