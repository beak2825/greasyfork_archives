// ==UserScript==
// @name         BWiki快捷菜单栏
// @namespace    https://www.wkr.moe/
// @version      1.0
// @description  将BWiki的功能菜单栏从hover可见克隆至始终居右
// @author       Wankko Ree
// @run-at       document-end
// @match        https://wiki.biligame.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/431773/BWiki%E5%BF%AB%E6%8D%B7%E8%8F%9C%E5%8D%95%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/431773/BWiki%E5%BF%AB%E6%8D%B7%E8%8F%9C%E5%8D%95%E6%A0%8F.meta.js
// ==/UserScript==

(async function() {
    var postion = await GM.getValue("postion");
    if (postion === undefined) {
        postion = "right";
        await GM.setValue("postion", postion);
    }
    $(".game-bg.container").append(
        $('<div id="wkrmenu" class="vectorMenu" style="position: fixed; top: 120px; bottom: unset; right: unset;"></div>').append(
            $(".menu")
            .clone(true)
            .css("opacity", "1")
            .css("top", "0")
            .css("border-radius", "8px")
            .append($('<li id="ca-wkr-reverse"><a>切换位置</a></li>').click(async()=> {
                if (postion === "right") {
                    postion = "left";
                } else if (postion === "left") {
                    postion = "right";
                }
                await GM.setValue("postion", postion);
                check();
            }))
        )
    );
    $("#wkrmenu>.menu>#ca-purge").removeClass("is-disabled");
    $("#wkrmenu>.menu>li:first>a").css("border-radius","8px 8px 0 0");
    $("#wkrmenu>.menu>li:last>a").css("border-radius","0 0 8px 8px");

    function check () {
        if ($(".bui-sns-info.hidden-xs").css("margin-left") === undefined) {
            setTimeout(check, 100);
        } else {
            var base = parseInt($(".bui-sns-info.hidden-xs").css("margin-left").slice(0, -2));
            var p = postion == "left" ? -220 : postion == "right" ? base+70+10 : 0;
            $("#wkrmenu").css("margin-left", p+'px');
            $("#wkrmenu>.menu").css("visibility", "visible");
        }
    }
    check();
})();