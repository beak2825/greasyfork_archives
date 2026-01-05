// ==UserScript==
// @name        EzRep for HackForums
// @namespace   ezrep-hf-bassboostofficial
// @description Easily give reputation on HackForums.net.
// @include     http://hackforums.net/showthread.php?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20797/EzRep%20for%20HackForums.user.js
// @updateURL https://update.greasyfork.org/scripts/20797/EzRep%20for%20HackForums.meta.js
// ==/UserScript==

//EzRep - Created by BassBoostOfficial (2929519)
//BEWARE: Cancerous code ahead!
//        Code analysis might be dangerous.

var x = document.getElementsByClassName('post_author');
for (var i = 0; i < x.length; ++i) {
    var item = x[i];

    var str = item.innerHTML;
    var separator = 'profile&amp;uid=';
    var lastPart = str.split(separator).pop();
    var separator2 = '"';
    var uid = lastPart.split(separator2).shift();
    var extraMention = "";

    if (uid == "2929519") {
        extraMention = "<strong class=\"reputation_positive\">EzRep Creator</strong><br>";
    } else {

    }

    var y = document.getElementsByClassName("post_author_info");

    y[i].innerHTML = extraMention + '<a target="_blank" href="http://hackforums.net/reputation.php?action=add&uid=' + uid + '&pid=0">Rate user</a><br>' + y[i].innerHTML;
}