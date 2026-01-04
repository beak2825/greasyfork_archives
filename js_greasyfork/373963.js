// ==UserScript==
// @name         MouseHunt - Display Converted Charms Thumbnail
// @author       Jia Hao (Limerence#0448 @Discord)
// @namespace    https://greasyfork.org/en/users/165918-jia-hao
// @version      1.3
// @description  Adds a thumbnail showing the charms obtained from Unstable/Torch/Treasure Trawling Charms.
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/373963/MouseHunt%20-%20Display%20Converted%20Charms%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/373963/MouseHunt%20-%20Display%20Converted%20Charms%20Thumbnail.meta.js
// ==/UserScript==

//Special thanks to Tan Y.K. for refactoring this function! :D
function unstableThumbnails() {
    var charmPops = $(".chesla_trap_trigger,.torch_charm_event").not(".minimalJournal,:has(img)");
    charmPops.each(function() {
        //Only entries made by Unstable/Torch/Treasure Trawling charms
        if ($(this).text().indexOf("Unstable Charm") >= 0 || $(this).text().indexOf("Treasure Trawling Charm") >= 0 || $(this).text().indexOf("Torch Charm") >= 0) {
            var itemType = $(".journaltext>a",this).attr("href").match(/[?&]item_type=([^&]+)/);
            if (itemType) {
                var $this = $(this).prepend("<div class=journalimage><img /></div>");
                hg.utils.UserInventory.getItem(decodeURIComponent(itemType[1]), function(x) {
                    $("img",$this).css("border","1px solid black").attr("src", x.thumbnail);
                    $this.css("background-image","none");
                });
            }
        }
    });
}

$(document).ajaxSuccess(unstableThumbnails);
$(document).ready(function() {
    //If current page is main camp or journal
    var pageTitle = document.title;
    if (pageTitle.includes("Hunter's Camp") || pageTitle.includes("Journal Page")) {
        unstableThumbnails();
    }

});