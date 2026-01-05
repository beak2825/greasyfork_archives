// ==UserScript==
// @name         IndieGala - Gift Fetch & Copy
// @icon         https://www.indiegala.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.1.1
// @description  Reveal all steam keys or gift links of the bundle and copy them all to clipboard
// @include      https://www.indiegala.com/gift?gift_id=*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29035/IndieGala%20-%20Gift%20Fetch%20%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/29035/IndieGala%20-%20Gift%20Fetch%20%20Copy.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$.fn.innerText = function() {
    return $(this).contents().filter(function() {
        return this.nodeType == 3;
    }).text();
};
$(document).ready(function() {
    unsafeWindow.confirm = function() {
        return true;
    };
    var waiter = setInterval(function() {
        if ($("#this_your_gift").length > 0) {
            clearInterval(waiter);
            $("#steam-key-games .left").append('&nbsp;&nbsp;<input type="button" class="button" value="Fetch All Steam Keys" id="fetchSteamKeys"></input>');
            $("#steam-key-games .left").append('&nbsp;&nbsp;<input type="button" class="button" value="Fetch All Gift Links" id="fetchGiftLinks"></input>');
            $("#fetchSteamKeys").click(fetchSteamKeys);
            $("#fetchGiftLinks").click(fetchGiftLinks);
        }
    }, 100);
});
function listSteamKeys() {
    var list = "";
    $(".game-key-string:not(:contains(Give this link to your friend!))").each(function() {
        list += $(this).find(".game-steam-url").innerText().trim() + "\t" + $(this).find(".keys").val() + "\r\n";
    });
    console.log(list);
    GM_setClipboard(list);
}
function listGiftLinks() {
    var list = "";
    $(".game-key-string:contains(Give this link to your friend!)").each(function() {
        list += $(this).find(".game-steam-url").innerText().trim() + "\t" + $(this).find("[class*=give-gift-link] a").attr("href") + "\r\n";
    });
    console.log(list);
    GM_setClipboard(list);
}
function fetchSteamKeys() {
    $(".order-button-profile").each(function() {
        unsafeWindow.globalAjaxSemaphore = false;
        $(this).click();
    });
    $("#fetchGiftLinks").hide();
    $("#fetchSteamKeys").val("Copy All Steam Keys").click(listSteamKeys);
}
function fetchGiftLinks() {
    $("[name=steambutton]").each(function() {
        unsafeWindow.globalAjaxSemaphore = false;
        $(this).click();
    });
    $("#fetchSteamKeys").hide();
    $("#fetchGiftLinks").val("Copy All Gift Links").click(listGiftLinks);
}