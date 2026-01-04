// ==UserScript==
// @name         FFN Copy to Clipboard Forum Thread Url
// @namespace    ghostontheloose
// @version      0.1
// @description  Adds a "Copy Link" button to copy to clipboard thread url from fanfiction.net forums.
// @author       GhostOnTheLoose
// @match        http://www.fanfiction.net/topic/*
// @match        https://www.fanfiction.net/topic/*
// @match        https://m.fanfiction.net/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432473/FFN%20Copy%20to%20Clipboard%20Forum%20Thread%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/432473/FFN%20Copy%20to%20Clipboard%20Forum%20Thread%20Url.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pageURL = (document.URL).split("#")[0];
    var allThreads = document.querySelectorAll("a[target='forum']");

    for (var i = 0; i < allThreads.length; i++) {
        var threadId = allThreads[i].id;
        var threadURL = pageURL + "#" + threadId;

        var replySpan = allThreads[i].parentElement.lastElementChild.previousElementSibling;

        var node = document.createElement ('span');
        node.innerHTML = '<a id=\"linkid_'+threadId+'\" href=\"'+threadURL+'\"><span class="icon-edit-1" style="font-size:15px;color:black"></span>Copy Link</a>';
        node.setAttribute('id', 'container_'+threadId);
        replySpan.insertAdjacentElement("beforeend", node);

        document.getElementById("linkid_"+threadId).addEventListener("click", function(target){
            copyToClipboard(target);
        });
    }
})();

function copyToClipboard(target) {
    var copyText = target.srcElement.href;
    navigator.clipboard.writeText(copyText);
}
