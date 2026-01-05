// ==UserScript==
// @name         Facebook Crying Grin Smiley / Emoji Replacer
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Replaces the terrible crying grin emoji / smiley on Facebook with the standard :D one
// @author       Stefan BCN - https://www.bouncycastlenetwork.com
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22678/Facebook%20Crying%20Grin%20Smiley%20%20Emoji%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/22678/Facebook%20Crying%20Grin%20Smiley%20%20Emoji%20Replacer.meta.js
// ==/UserScript==

function replaceSmileys() {
    var replace = document.createElement("span");
    var searchImg = "zd0/1/16/1f602.png";
    var replaceImg = "zce/1/16/1f600.png";
    var searchBig = "126362137548583";
    var replaceBig = "126361967548600";
    var className = "emoticon emoticon_grin";
    replace.className = className;
    var imgs = document.getElementsByClassName("_3kkw");
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].style.backgroundImage.indexOf(search) !== -1){
            imgs[i].parentNode.replaceChild(replace, imgs[i]);
        }
    }
    imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].src.indexOf(searchImg) !== -1){
            imgs[i].src = imgs[i].src.replace(searchImg, replaceImg);
        }
    }
    
    imgs = document.getElementsByTagName("div");
    for (var i = 0; i < imgs.length; i++) {
        var backgroundImage = imgs[i].style.backgroundImage;
        if (backgroundImage.indexOf(searchBig) !== -1){
            imgs[i].style.backgroundImage = backgroundImage.replace(searchBig, replaceBig);
        }
    }
}

var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

var observer = new mutationObserver(replaceSmileys);
observer.observe(document.querySelector('body'), {
    'childList': true,
    'subtree': true
});