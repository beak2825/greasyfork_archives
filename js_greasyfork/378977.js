// ==UserScript==
// @name        instagram_allow_saveimage2
// @namespace   http://catherine.v0cyc1pp.com/instagram_allow_saveimage.user2.js
// @match       https://www.instagram.com/*
// @version     2.3
// @grant       none
// @run-at      document-end
// @description Allow "Save image as..." on context menu of Instagram.
// @description KNOWN ISSUE: can't save videos.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/378977/instagram_allow_saveimage2.user.js
// @updateURL https://update.greasyfork.org/scripts/378977/instagram_allow_saveimage2.meta.js
// ==/UserScript==

//console.log("instagram_allow_saveimage2 start");

function proc_mainpage(elem) {
    var parent = elem.parentNode;
    if (parent == null || parent == undefined) {
        return;
    }
    var next = parent.nextElementSibling;
    if (next == null || next == undefined) {
        return;
    }

    var next2 = next.nextElementSibling;
    if (next2 != null || next2 != undefined) {
        var next2_classname = next2.className;
        if (next2_classname != undefined) {
            return;
        }
    }


    var classname = next.className;



    var kids = next.children;
    if (kids.length == 0) {
        next.style.display = "none";
    } else {
        next.style.display = "block";
    }
}

function proc_stories(elem) {
    var next = elem.nextElementSibling;
    if (next == null || next == undefined) {
        return;
    }
    var tagname = next.tagName;
    console.log("tagname="+tagname);
    if ( tagname == "DIV" ) {
        next.style.display = "none";
    }
}

function main() {
    //$("img").each(function() {
    document.querySelectorAll("img").forEach(function(elem) {
        //$(this).removeAttr("srcset");
        //elem.removeAttribute("srcset");
        //$(this).removeAttr("sizes");
        //elem.removeAttribute("sizes");

        // メイン用：親の次の兄弟
        proc_mainpage(elem);

        // ストーリー用：elemの次の兄弟
        // →画像クリックで一時停止できなくなるのでやめた。2021.3.2
        //proc_stories(elem);

    });

}


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe(document, config);
});

var config = {
    attributes: true,
    childList: true,
    characterData: false,
    subtree: true
};

observer.observe(document, config);