// ==UserScript==
// @name         Steam Arkadaşlarınıza Toplu Yorum Yapma
// @icon         http://steamcommunity.com/favicon.ico
// @namespace    VESPZU
// @author       VESPZU
// @version      1
// @description  Steam arkadaş listenizdeki arkadaşlarınızın tümüne ya da seçtiklerinize tek seferde yorum yapmanızı sağlar.
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?$/
// @run-at       document-idle
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/419500/Steam%20Arkada%C5%9Flar%C4%B1n%C4%B1za%20Toplu%20Yorum%20Yapma.user.js
// @updateURL https://update.greasyfork.org/scripts/419500/Steam%20Arkada%C5%9Flar%C4%B1n%C4%B1za%20Toplu%20Yorum%20Yapma.meta.js
// ==/UserScript==

// ==Configuration==
const delay = 7; // Profile yorum yapma arasında beklenecek süre
// ==/Configuration==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);
ToggleManageFriends();
$("#manage_friends > .row:last").before(`
    <div class="row commentthread_entry" style="background-color: initial; padding-right: 24px;">
        <div class="commentthread_entry_quotebox">
            <textarea rows="3" class="commentthread_textarea" id="comment_textarea" placeholder="Yorum ekle" style="overflow: hidden; height: 20px;"></textarea>
        </div>
        <div class="commentthread_entry_submitlink" style="">
            <a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup('Profile');">
            <span>Biçimlendirme yardımı</span>
            </a>
            <span class="emoticon_container">
            <span class="emoticon_button small" id="emoticonbtn">
            </span>
            </span>
            <span class="btn_green_white_innerfade btn_small" id="comment_submit">
            <span>Seçili Arkadaşların Profillerine Yorum Yap</span>
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
        alert("Mesaj yazdığınızdan ve en az 1 arkadaş seçtiğinizden emin olun.");
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
                $("#log_body").get()[0].innerHTML += "<br>" + (response.success === false ? response.error : "Profile başarıyla yorum yapıldı. <a href=\"https://steamcommunity.com/profiles/" + profileID + "/#commentthread_Profile_" + profileID + "_0_area\">" + profileID + "</a>");
                $(".friend_block_v2[data-steamid=" + profileID + "]").removeClass("selected").find(".select_friend_checkbox").prop("checked", false);
                UpdateSelection();
            })
            .fail(() => $("#log_body").get()[0].innerHTML += "<br>Bu profile yorum yapılamıyor. <a href=\"http://steamcommunity.com/profiles/" + profileID + "/\">" + profileID + "</a>")
            .always(() => $("#log_head").html("<br><b> " + (i + 1) + " içinden " + total + " profile yorum yapıldı" + (total.length === 1 ? "" : "") + ".<b>")), delay * i * 1000);
    });

});
// ==/Code==