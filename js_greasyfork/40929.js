// ==UserScript==
// @author      FIRAT
// @name        TeknoIZDIRAP Renk
// @description Teknoseyir Renk Ayarı
// @namespace   http://teknoizdirap.com
// @include     https://teknoseyir.com/*
// @exclude     https://teknoseyir.com/wp-*
// @icon        http://teknoizdirap.com/izdirap48.png
// @icon64      http://teknoizdirap.com/izdirap64.png
// @version     0.1

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40929/TeknoIZDIRAP%20Renk.user.js
// @updateURL https://update.greasyfork.org/scripts/40929/TeknoIZDIRAP%20Renk.meta.js
// ==/UserScript==

function headerRenk(){
    var commentHeading = document.getElementsByClassName("comment-heading");
    for (var i = 0; i < commentHeading.length; ++i) {
        var item = commentHeading[i];
        item.style.color="#DCDCDC";//yorum yazar yazı rengi
	item.style.backgroundColor="#FF0000";//yorum yazar arkaplan rengi
    }

    var author = document.getElementsByClassName("author");
    for (var i = 0; i < author.length; ++i) {
        var item = author[i];
        item.style.color="#FF0000";//durum yazar yazı rengi
	item.style.backgroundColor="#DCDCDC";//durum yazar arkaplan rengi
    }
}
setInterval(headerRenk, 200);