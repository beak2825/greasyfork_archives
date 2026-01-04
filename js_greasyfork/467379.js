// ==UserScript==
// @name         המודיע של ניב
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  מתקן את בעיית הצגת ההודעות החדשות באשכולות
// @author       You
// @match        https://www.fxp.co.il/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxp.co.il
// @grant        none
// @license      MIT
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/467379/%D7%94%D7%9E%D7%95%D7%93%D7%99%D7%A2%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467379/%D7%94%D7%9E%D7%95%D7%93%D7%99%D7%A2%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==
socket.on('showthreadpost', function (data) {
    if (data.userid === USER_ID_FXP) {
        return;
    }
    $(data.html).appendTo('#posts').hide().slideDown('slow');
    let tempidlive = $('#posts li.postbit:last-child').attr('id');
    tempidlive = tempidlive.replace(/[^\d.]/g, "");
    window.lastpostid_ajax_live = parseInt(tempidlive);
    window.ajax_last_post = parseInt(tempidlive);
    newpostobj["post_" + lastpostid_ajax_live] = 0;
    const countunreadpostname = countunreadpost();
    $("#post_" + lastpostid_ajax_live + " .postbody").css({
        "background-color": "#8AD1FF"
    });
    if ($('#newcom').length == 0) {
        $("body").append('<div id="newcom" class="newcom">תגובות חדשות <div class="arrowdown"></div></div>');
    }
    $('#counterpost').remove();
    $("#newcom").append("<span id='counterpost'>(" + countunreadpostname + ")</span>");
});