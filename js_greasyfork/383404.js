// ==UserScript==
// @name         fxp chat spam bot
// @namespace    idk
// @version      1
// @description  spam a chat in fxp.
// @author       nktfh100
// @match        https://www.fxp.co.il/chat.php?*
// @match        https://www.fxp.co.il/chat.php
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/383404/fxp%20chat%20spam%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/383404/fxp%20chat%20spam%20bot.meta.js
// ==/UserScript==

//https://www.fxp.co.il/member.php?u=1089677

var isSpamming = false;
var interval_;

function msgBot() {
    var iframe = document.getElementById("pm_holder");
    var textA = iframe.contentWindow.document.getElementById("input-textarea");
    var btn = iframe.contentWindow.document.getElementById("send-chat-pm");

    var o = null,
        t = "";
    var r = ["[color=gold]", " תעה ", " לילה טוב ", " אה טוב ", " קליל ", " קל ", "[font=tahoma]", " פנחס ", " חחחח שמתם לב FXP = כספ ", " כספ ", " ילדי אנימה ", " FXP ", " חחחחחחחחחח ", " חתול ", " כלב ", " אללה אשכולילה ", "[b]", " ו", " טיפ: כותרת ארוכה ומפורטת מביאה למענה הרבה יותר מהיר מאשר כותרת קצרה! ", "[color=blue]", " צריכים לעלות תמונה לאשכול מהמחשב, שירות העלאת התמונות של האתר: [url=https://www.fxp.co.il/upload.php]העלאת תמונות[/url] ", " אין בנים בכספ ", "[color=red]", " איו בנות בכספ ", "[i]", " תעה על התודה ", " תודה על הפרסום ", " פיצה ", " עד מתי ילדים בני 12 עם ניק אדום ", " כבל תת ימי יש לך? ", " CARE.COM ", " לוזינה", " בוקר טוב ", " בוקר קל ", " ערב קל ", " ערב שלום ", " איכס ", " ננעל", " נשברלי ", " שחור זה מרזה ", " :wub: ", " :) ", ":(", " :D ", " ;) ", " :mad: ", " :loveyou: ", " יש קראק? ", " :P ", " :bot: ", " :whistle: ", " :Tongue2: ", "[u]", " :jockey: ", " :clap: ", " :tovtov: ", " יש נייס ", " :rasta: ", " :close2: ", " :WOW: ", " תודה מוריד ", " ארז ברז", "[quote]מצחיק[/quote]", "שלום", "[size=6]", " ו"],
        c = Math.floor(Math.random() * r.length + 1),
        n = Math.floor(18 * Math.random() + 1);
    for (var i = 0; i <= n; i++) t += r[c - 1], c = Math.floor(Math.random() * r.length + 1);
    t.includes("[size") && (t += "[/size][color=white]b[/color]"), t.includes("[u") && (t += "[/u][color=white]b[/color]"), t.includes("[i") && (t += "[/i][color=white]b[/color]"), t.includes("[font") && (t += "[/font][color=white]b[/color]"), t.includes("[color") && (t += "[/color][color=white]b[/color]"), t.includes("[b") && (t += "[/b][color=white]b[/color]"), textA.innerHTML = t

    btn.click();
    console.debug('Message sent');
}

function buttonClick() {
    var btn = document.getElementById("button_");
    if(isSpamming) {
        isSpamming = false;
        clearInterval(interval_);
        btn.value = "Start spam bot";

    }else {
        isSpamming = true;
        btn.value = "Stop spam bot";

        //msgBot();
        interval_ = setInterval(msgBot, 1050);
    }
}


$(document).ready(function () {
    $('body').append('<input type="button" value="Start bot" id="button_">')
    $("#button_").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
    $('#button_').click(function () { buttonClick() });
});

