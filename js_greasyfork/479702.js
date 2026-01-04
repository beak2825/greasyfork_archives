// ==UserScript==
// @name         4Play
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Make easy surfing
// @author       You
// @match        https://4play.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4play.to
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479702/4Play.user.js
// @updateURL https://update.greasyfork.org/scripts/479702/4Play.meta.js
// ==/UserScript==


function bypassAds() {
    const adsWrapper = document.querySelector(".adswrapper");
    if(adsWrapper) adsWrapper.parentElement.removeChild(adsWrapper);

    const adsWrapper2 = document.querySelector(".davwheat-ad");
    if(adsWrapper2) adsWrapper2.parentElement.removeChild(adsWrapper2);
}

function commentButton() {
    const buttonComment = document.createElement("button");

    // styling
    buttonComment.style.position = "fixed";
    buttonComment.style.bottom = "10px";
    buttonComment.style.right = "10px";
    buttonComment.style.zIndex = 9999;
    buttonComment.style.padding = "8px 12px";
    buttonComment.id = "SendComment";

    buttonComment.innerText = "Kirim Komen";
    buttonComment.addEventListener("click", sendComment)
    document.body.append(buttonComment);
}

function sendComment() {
    document.querySelector(".reply2see_reply").click()

    const alert = document.querySelector("#composer .item-fof-necrobumping .Alert .Checkbox.off")
    if(alert) document.querySelector("#composer .item-fof-necrobumping .Checkbox.off").click()

    setTimeout(() => {
        document.querySelector("#composer textarea.FormControl").focus()
        document.execCommand("insertText", false, generateComment())
        document.querySelector(".TextEditor-controls li.item-submit button").click()
    }, 500)
}

function generateComment() {
    return "Ijin ngopi dulu mbah"
}

function showTopButton() {
    const topBtn = document.createElement("button");

    // styling
    topBtn.style.position = "fixed";
    topBtn.style.bottom = "10px";
    topBtn.style.left = "10px";
    topBtn.style.zIndex = 9999;
    topBtn.style.padding = "8px 12px";
    topBtn.id = "ToTop";

    topBtn.innerText = "Top";
    topBtn.addEventListener("click", () => {
        window.location.href = window.location.href.match(/https?:\/\/4play\.to\/koleksi\/.*\//)
    })
    document.body.append(topBtn);
}

(function() {
    'use strict';

    // Bypass Ads
    bypassAds()
    setInterval(bypassAds, 200)

    const lockedLink = document.querySelector(".reply2see.locked");
    if(lockedLink) commentButton()

    window.addEventListener("urlchange", ({ url }) => {
        if(url.match(/\/koleksi\//)) {
            const lockedLink = document.querySelector(".reply2see.locked");
            if(lockedLink) commentButton()

            showTopButton()
                //document.querySelector(".reply2see_reply").click()
        } else {
            const sendCommentBtn = document.getElementById("SendComment")
            if(sendCommentBtn) sendCommentBtn.parentElement.removeChild(sendCommentBtn)

            const toTop = document.getElementById("ToTop")
            if(toTop) toTop.parentElement.removeChild(toTop)
        }
    })
})();