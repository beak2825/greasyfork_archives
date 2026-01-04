// ==UserScript==
// @name         Steam Store Title Mark
// @description  mark language support & card_info & positive percentage with game title
// @author       desc_inno
// @namespace    https://github.com/desc70865/Steam-Store-Title-Mark
// @supportURL   https://github.com/desc70865/Steam-Store-Title-Mark/issues
// @version      0.2
// @icon         https://store.steampowered.com/favicon.ico
// @match        https://store.steampowered.com/app/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403213/Steam%20Store%20Title%20Mark.user.js
// @updateURL https://update.greasyfork.org/scripts/403213/Steam%20Store%20Title%20Mark.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.load = titleMark();
})();

// set https://store.steampowered.com/account/languagepreferences both simplified & traditional chinese before use
function titleMark() { // add prefix & suffix to title if u need
    let trade_card = cardDetect(), // if has trade cards
        chinese_support = languageDetect(), // if supports simplified chinese or traditional chinese
        reviews_ratio = ratioDetect();
};

function cardDetect() {
    if((/Steam 集换式卡牌/g).test(document.body.innerText)){
        $('.apphub_AppName')[0].innerHTML = "📇 " + $('.apphub_AppName')[0].innerText; // add emoji to prefix for mark
        return 1;
    };
    return 0;
};

function languageDetect() { // 不支持默认语言时匹配"不支持",同时检测其他语言中包含的辅助语言
    let flag_schinese = $('.game_language_options')[0].innerText.match(/不支持/g) == null,
        flag_tchinese = $('.game_language_options')[0].innerText.match(/繁体中文/g) != null;
    if(flag_schinese == true || flag_tchinese == true){
        $('.apphub_AppName')[0].innerHTML = "🀄️ " + $('.apphub_AppName')[0].innerText; // add emoji to prefix for mark
        return 1;
    };
    return 0;
};

function ratioDetect() {
    let rate_panel = $("div.user_reviews_summary_row"), // get reviews panel
        last = rate_panel.length - 1; // if there is recent reviews, it should be 1, or just 0
    if((/%/g).test(rate_panel[0].dataset.tooltipHtml)){ // sometimes there wont be enough reviews
        let reviews_ratio = rate_panel[last].dataset.tooltipHtml.match(/\d+(?=%)/g), // overall percentage
            reviews_total = rate_panel[last].dataset.tooltipHtml.replace(',','').match(/\d+(?= 篇)/g), // a space here / sum of reviews
            reviews_positive = parseInt(reviews_total * reviews_ratio / 100);
        $('.apphub_AppName')[0].innerHTML = $('.apphub_AppName')[0].innerText + " => ("+ reviews_positive + "/" + reviews_total + ") = " + reviews_ratio + "%☆"; // add rate to suffix for mark
        return reviews_ratio;
    };
    return 60; // set the default value by 80 which should below threshold 90
};
