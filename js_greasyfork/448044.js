// ==UserScript==
// @name        游侠下载免安装提示
// @namespace   Violentmonkey Scripts
// @match       https://down.ali213.net/pcgame/
// @match       https://down.ali213.net/pcgame/all/*
// @grant       none
// @version     1.1
// @author      -
// @description 2022/6/11 16:31:10
// @run-at document-idle
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448044/%E6%B8%B8%E4%BE%A0%E4%B8%8B%E8%BD%BD%E5%85%8D%E5%AE%89%E8%A3%85%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448044/%E6%B8%B8%E4%BE%A0%E4%B8%8B%E8%BD%BD%E5%85%8D%E5%AE%89%E8%A3%85%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
// debugger;
(function () {
    function checkDetailInfo(href, nameDiv) {
        $.ajax({
            url: href, success: function (result) {
                let res2 = $(result).find(".detail_game_l_r_ctit")[0];
                let h1 = res2.children[0];
                let isGreen = h1.innerText.indexOf("免安装")
                if (isGreen != -1) {
                    nameDiv.innerHTML = "<font color='#00FF00'>免安装</font>@" + nameDiv.innerText;
                }
            }
        });
    }

    function startNodeCheck(node) {
        let link = node.children[0];
        let nameDiv = node.children[1]
        checkDetailInfo(link.href, nameDiv);
    };

    let allItems = $(".famous-li")
    allItems.each(function (i) {
        startNodeCheck(this);
    });

    let famousBox = $(".famous-ul").on("DOMNodeInserted", function (event) {
        var target = event.target;
        if (target.className == "famous-li") {
            startNodeCheck(target);
        }
    });

})();

