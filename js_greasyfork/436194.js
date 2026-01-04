// ==UserScript==
// @name         MPP Minibot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Minibot
// @author       You
// @match        *://mppclone.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436194/MPP%20Minibot.user.js
// @updateURL https://update.greasyfork.org/scripts/436194/MPP%20Minibot.meta.js
// ==/UserScript==

var hello = "(",
    calls = 1,
    catchedmsg = 0,
    sentmsgp = 0,
    sentmsg = 0,
    totalmsg = 0,
    th = ["", "thousand", "million", "billion", "trillion"],
    dg = "zero one two three four five six seven eight nine".split(" "),
    tn = "ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" "),
    tw = "twenty thirty forty fifty sixty seventy eighty ninety".split(" "),
    a = new Date().toLocaleTimeString();
setInterval(function () {
    a !== new Date().toLocaleTimeString() &&
        ((a = new Date().toLocaleTimeString()),
        setTimeout(function () {
            document.getElementById("timebtn").childNodes[0].nodeValue = new Date().toLocaleTimeString();
        }, 0));
}, 0);
$("body").append('<div id="timebtn" class="ugly-button" style="position: fixed; bottom: 17.5px !important; left: 1120px !important; z-index: 500;">0:0:0 PM/AM</div>');
$("#timebtn").on("click", function (d) {
    MPP.chat.send(new Date().toLocaleTimeString());
});
MPP.client.on("a", function (d) {
    function f(c) {
        MPP.chat.send("Bot: " + c.replace("undefined", ""));
        calls++;
        sentmsgp--;
        sentmsg++;
    }
    function m(c) {
        c = c.toString();
        c = c.replace(/[, ]/g, "");
        if (c != parseFloat(c)) return "not a number";
        var e = c.indexOf(".");
        -1 == e && (e = c.length);
        if (15 < e) return "too big";
        for (var k = c.split(""), g = "", n = 0, b = 0; b < e; b++)
            2 == (e - b) % 3 ? ("1" == k[b] ? ((g += tn[Number(k[b + 1])] + " "), b++, (n = 1)) : 0 != k[b] && ((g += tw[k[b] - 2] + " "), (n = 1))) : 0 != k[b] && ((g += dg[k[b]] + " "), 0 == (e - b) % 3 && (g += "hundred "), (n = 1)),
                1 == (e - b) % 3 && (n && (g += th[(e - b - 1) / 3] + " "), (n = 0));
        if (e != c.length) for (c = c.length, g += "point ", b = e + 1; b < c; b++) g += dg[k[b]] + " ";
        return g.replace(/\s+/g, " ");
    }
    catchedmsg++;
    var l = d.a.split(" "),
        h = l[0].toLowerCase(),
        p = d.p._id,
        r = d.p.color,
        q = d.p.name,
        t = new Color(d.p.color).getName();
    d.p._id === MPP.client.getOwnParticipant()._id && (sentmsgp++, sentmsg--, totalmsg++);
    h === hello + "help" && (sentmsg++, f("Commands: " + hello + "about " + hello + "me " + hello + "eat " + hello + "drink " + hello + "calls"));
    h === hello + "about" && f("Creators: CreepX7021 and Addison | Thanks to Addison for creating this bot! \u2764\ufe0f\ud83e\udde1\ud83d\udc9b\ud83d\udc9a\ud83d\udc99\ud83d\udc9c\ud83e\udd0e\ud83d\udda4\ud83e\udd0d");
    h === hello + "me" && f('Information | Name: "' + q + '" | ID: ' + p + " | Hex: " + r + " [" + t + "]");
    h === hello + "calls" &&
        f(
            "There are " +
                m(calls) +
                " commands used and " +
                m(catchedmsg) +
                " chat messages seen by the bot, and " +
                m(sentmsgp) +
                " chat messages sent by the player and " +
                m(sentmsg) +
                " messages sent by the bot, in total there are " +
                m(totalmsg) +
                "messagase sent by " +
                MPP.client.getOwnParticipant().name +
                " and bot".replace(void 0, "")
        );
    h === hello + "eat" && ((l = l.slice(1)), (p = d.a.substring(3 + hello.length + 1).trim()), 0 === l.length ? f("Usage: " + d.a + " <food>") : f(q + " ate " + p.replace(d.p.name, "Theirself")));
    h === hello + "drink" && ((l = l.slice(1)), (h = d.a.substring(5 + hello.length + 1).trim()), 0 === l.length ? f("Usage: " + d.a + " <drink>") : f(q + " drank " + h));
});