// ==UserScript==
// @name         HideVKStories
// @namespace    hidevkstories
// @version      1.1
// @description  remove annoying stories block on vk.com website
// @author       savolkov
// @match        https://vk.com/feed
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29647/HideVKStories.user.js
// @updateURL https://update.greasyfork.org/scripts/29647/HideVKStories.meta.js
// ==/UserScript==
function removeStories(){
    $("#stories_feed_wrap").html("");
    $("#stories_feed_wrap").removeClass("clear_fix");
}
(function (window, undefined) {
    removeStories();
    var oldTitle = document.title;
    window.setInterval(function()
                       {
        if (document.title !== oldTitle)
        {
            removeStories();
        }
        oldTitle = document.title;
    }, 500); //check every 500ms
    $('#side_bar').on('click', removeStories());
})(window);