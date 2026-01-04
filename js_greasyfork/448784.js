// ==UserScript==
// @name         留言救星
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  巴啥留言排序
// @author       You
// @match        https://forum.gamer.com.tw/C.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448784/%E7%95%99%E8%A8%80%E6%95%91%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/448784/%E7%95%99%E8%A8%80%E6%95%91%E6%98%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    extendComment = function (bsn, snB, doneCallback) {
        console.log('test')
        jQuery("#showoldCommend_" + snB).hide();
        jQuery("#closeCommend_" + snB).show();
        commentNew5[snB] = jQuery("#Commendlist_" + snB).html();
        commentNew5[snB] = commentNew5[snB].replace(/ data-tooltipped=""/g, "").replace(/data-original-title=/g, "title=");
        var next_snC = jQuery("#moreCommentBtn_" + snB).attr("next");
        jQuery.ajax({
            url: "/ajax/moreCommend.php",
            data: {bsn: bsn, snB: snB, returnHtml: 1, next_snC: next_snC},
            method: "GET",
            dataType: "json"
        }).done(function (rdata) {
            var listSelector = "#Commendlist_" + snB;
            rdata['html'].sort(function (a, b) {
                let tempHtmlA = document.createElement('html')
                let tempHtmlB = document.createElement('html')
                tempHtmlA.innerHTML = a
                tempHtmlB.innerHTML = b
                let floorA = tempHtmlA.querySelector('.reply-content__footer').firstElementChild.attributes['data-floor'].value
                let floorB = tempHtmlB.querySelector('.reply-content__footer').firstElementChild.attributes['data-floor'].value
                return floorA - floorB
            })
            jQuery(listSelector).empty().prepend(rdata["html"]);
            Forum.C.commentFormatter(listSelector + " .reply-content__article > span.comment_content");
            Forum.C.bindReplyMenuTippy(listSelector);
            Forum.C.bindCommentGpBpListTippy(listSelector);
            Forum.C.bindCommentDateTippy(listSelector);
            GamerCard.bind(listSelector);

            if (rdata["next_snC"]) {
                jQuery("#moreCommentBtn_" + snB).attr("next", rdata["next_snC"]).show()
            } else {
                jQuery("#moreCommentBtn_" + snB).attr("next", 0).hide()
            }
            if (doneCallback) {
                doneCallback()
            }
        })
    }

    let replyContent = document.querySelectorAll('[id*=Commendlist_]')
    for (let i = 0; i < replyContent.length; i++) {
        let replyCommandDiv = replyContent[i].querySelectorAll('[id*=Commendcontent_]')
        replyCommandDiv = Array.prototype.slice.call(replyCommandDiv, 0);
        replyContent[i].innerHTML = ''
        replyCommandDiv.sort(function (a, b) {
            let tempA = a.querySelector('.reply-content__footer')
            let tempB = b.querySelector('.reply-content__footer')
            let floorA = tempA.getElementsByTagName('div')[0].innerText.replace('B', '')
            let floorB = tempB.getElementsByTagName('div')[0].innerText.replace('B', '')
            return floorA - floorB;
        })
        console.log(replyCommandDiv.length)
        for (let j = 0; j < replyCommandDiv.length; j++) {
            replyContent[i].appendChild(replyCommandDiv[j])
        }
    }
})();
