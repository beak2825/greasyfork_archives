// ==UserScript==
// @name         Zhihu-K
// @namespace    https://gist.github.com/rain15z3/82f8d7a5d4778d969d92211c9dfe2fed
// @version      1.0
// @description  知乎赞同数用K显示
// @author       RainbowBird
// @match        https://www.zhihu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/404674/Zhihu-K.user.js
// @updateURL https://update.greasyfork.org/scripts/404674/Zhihu-K.meta.js
// ==/UserScript==

!(function () {
    setInterval(refrush, 3000);
})();

function refrush() {
    console.log("[Zhihu-K] loading...");
    $(".Button.VoteButton.VoteButton--up").each(function () {
        var text = $(this).contents().eq(1).get(0).nodeValue;

        text = text.replace(/\u200B/g, "");
        var rep = text.replace("赞同 ", "");
        if (text.match("万")) {
            rep = rep.replace(" 万", "");
            var num = parseFloat(rep) * 10000;
        } else {
            var num = parseFloat(rep);
        }

        if (num >= 10000 || (num >= 1000 && num < 10000)) {
            var numk = num / 1000;
            if (numk.toString().match(".")) numk = numk.toFixed(1);
            text = "赞同 " + numk + " K";
        }

        $(this).contents().eq(1).get(0).nodeValue = text;
    });
}