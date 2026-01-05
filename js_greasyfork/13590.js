// ==UserScript==
// @name         Twitter Image URL replacement
// @namespace    https://greasyfork.org/ja/scripts/13590-twitter-image-url-replacement
// @version      0.4
// @description  TwitterTL上のimgタグsrcに:orgをつける
// @author       kakkou
// @match        https://twitter.com/*
// @exclude      https://twitter.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13590/Twitter%20Image%20URL%20replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/13590/Twitter%20Image%20URL%20replacement.meta.js
// ==/UserScript==

function repraseURL(node) {
    if ( node.nodeName == "IMG" ) {
        var image = node;
        // 画像クリック時のビューワのURL(:large)は変更しない
        if ( image.src.match(/pbs.twimg.com\/media/) && !image.src.match(/:(?:thumb|large|orig)$/) ) {
            image.src += ':orig';
        }
    }
}

// 最初から読まれてる奴を消す
var elements = document.getElementsByClassName("permalink-container");
for(var i=0; i<elements.length; i++) {
    var imgs = elements[i].getElementsByTagName('img');
    for(var j=0; j< imgs.length; j++) {
        repraseURL(imgs[j]);
    }
}

//Twitterは画像を動的ロードする
document.addEventListener("DOMNodeInserted", function(e){
    repraseURL(e.target);
});