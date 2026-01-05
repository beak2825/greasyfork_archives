// ==UserScript==
// @name         Steam Community - Friends Poster
// @icon         http://steamcommunity.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.2.1
// @description  Posts a message to all or selected friends from your steam friends
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?$/
// @run-at       document-idle
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/26001/Steam%20Community%20-%20Friends%20Poster.user.js
// @updateURL https://update.greasyfork.org/scripts/26001/Steam%20Community%20-%20Friends%20Poster.meta.js
// ==/UserScript==

// ==Configuration==
const delay = 7; // Seconds in between posting profile comments
// ==/Configuration==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);
ToggleManageFriends();
$("#manage_friends > .row:last").before(`
    <div class="row commentthread_entry" style="background-color: initial; padding-right: 24px;">
        <div class="commentthread_entry_quotebox">
            <textarea rows="3" class="commentthread_textarea" id="comment_textarea" placeholder="Add a comment" style="overflow: hidden; height: 20px;"></textarea>
        </div>
        <div class="commentthread_entry_submitlink" style="">
            <a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup('Profile');">
            <span>Formatting help</span>
            </a>
            <span class="emoticon_container">
            <span class="emoticon_button small" id="emoticonbtn">
            </span>
            </span>
            <span class="btn_green_white_innerfade btn_small" id="comment_submit">
            <span>Post Comments to Selected Friends</span>
            </span>
        </div>
    </div>
    <div class="row" id="log">
        <span id="log_head"></span>
        <span id="log_body"></span>
    </div>`);

new CEmoticonPopup($J('#emoticonbtn'), $J('#commentthread_Profile_0_textarea'));
$("#comment_submit").click(() => {
    const total = $(".selected").length;
    const msg = $("#comment_textarea").val();
    if (total === 0 || msg.length === 0) {
        alert("Please make sure you entered a message and selected 1 or more friends.");
        return;
    }

    $("#log_head, #log_body").html("");
    $(".selected").each((i, elem) => {
        let profileID = $(elem).data("steamid");
        setTimeout(() => $.post("//steamcommunity.com/comment/Profile/post/" + profileID + "/-1/", {
                comment: msg,
                count: 6,
                sessionid: g_sessionID
            }, response => {
                $("#log_body").get()[0].innerHTML += "<br>" + (response.success === false ? response.error : "Successfully posted comment on <a href=\"https://steamcommunity.com/profiles/" + profileID + "/#commentthread_Profile_" + profileID + "_0_area\">" + profileID + "</a>");
                $(".friend_block_v2[data-steamid=" + profileID + "]").removeClass("selected").find(".select_friend_checkbox").prop("checked", false);
                UpdateSelection();
            })
            .fail(() => $("#log_body").get()[0].innerHTML += "<br>Failed to post comment on <a href=\"http://steamcommunity.com/profiles/" + profileID + "/\">" + profileID + "</a>")
            .always(() => $("#log_head").html("<br><b>Processed " + (i + 1) + " out of " + total + " friend" + (total.length === 1 ? "" : "s") + ".<b>")), delay * i * 1000);
    });

});
// ==/Code==