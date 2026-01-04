// ==UserScript==
// @name         Cubecraft Ranks Display
// @namespace    What does namespace do?
// @version      0.1
// @description  Displays a users rank under their forum posts if they have their minecraft account linked
// @author       You
// @match        https://www.cubecraft.net/threads/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/38885/Cubecraft%20Ranks%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/38885/Cubecraft%20Ranks%20Display.meta.js
// ==/UserScript==

var mcNamesObj = $(".playerUsername");
var datastring = "";

for(var i = 0; i < mcNamesObj.length; i++) {
    name = mcNamesObj[i].innerHTML;
    if(datastring == "") {
        datastring += "usernames[]=" + name;
    } else {
        datastring += "&&usernames[]=" + name;
    }
}

GM_xmlhttpRequest({
    method: "POST",
    url: "https://www.landviz.nl/host/cc_ranks/getRank.php",
    data: datastring,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(res) {
        ranks = res.responseText.split(",");

        for(var i = 0; i < ranks.length; i++) {
            $($(mcNamesObj[i]).parentsUntil(".messageUserInfo")[2]).find(".userText").find(".userTitle").html(ranks[i] + " Rank");
        }
    }
});
