// ==UserScript==
// @name         Steam Chinese Mark
// @description  mark url contains appid which support chinese & card info
// @author       desc_inno, wsz987
// @namespace    https://github.com/desc70865/Steam-Chinese-Mark/
// @supportURL   https://github.com/desc70865/Steam-Chinese-Mark/issues
// @version      0.4.2
// @icon         https://keylol.com/favicon.ico
// @match        https://keylol.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @resource     chinese https://raw.githubusercontent.com/desc70865/Steam-Chinese-Mark/master/full.json
// @resource     card https://bartervg.com/browse/cards/json/
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/403120/Steam%20Chinese%20Mark.user.js
// @updateURL https://update.greasyfork.org/scripts/403120/Steam%20Chinese%20Mark.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    window.onload = function(){
        var card_json = JSON.parse(GM_getResourceText('card')),
            chinese_json = JSON.parse(GM_getResourceText('chinese'));
        search_appid(card_json, chinese_json);
        jQuery('body').on("click", "#threadindex > div > ul > li",()=>{
            $('.t_f').ready(()=>setTimeout(()=>{search_appid(card_json, chinese_json).then(unauto())},1000))
        });
    }
})();

function search_appid(card_json, chinese_json){
    var color_card = "deeppink",
    color_foo = "darkviolet",
    color_language = "red", // #57BAE8
    fontWeight_new = "bolder"; // normal

    return new Promise(resolve => {
        $('.steam-info-link').each(function(){
            var arr_href = $(this).context.pathname.split('/'),
                kind = arr_href[1],
                appid = arr_href[2];
            if(kind != 'app'){
                if(kind == 'bundle'){
                    $(this).context.text = "[Bundle]: "+ $(this).context.innerText;
                }
                else if(kind == 'sub'){
                    $(this).context.text = "[Sub]: "+ $(this).context.innerText;
                }
                $(this).context.style.color = color_foo;
            }
            else if(card_json[appid] != undefined){
                $(this).context.text = "📇 " + $(this).context.innerText;
                $(this).context.style.color = color_card;
                $(this).context.style.fontWeight = fontWeight_new;
            }
            if(chinese_json[appid] != undefined){
                $(this).context.text = "🀄️ " + $(this).context.innerText;
                $(this).context.style.color = color_language;
                $(this).context.style.fontWeight = fontWeight_new;
            }
        })
    });
}

function unauto(){
    $('.plc div.authi>a[rel=nofollow]').eq(0).after(`<span class="pipe">|</span><a href="javascript:void(0);" id="unauto_tab">标记</a>`);
    $('#unauto_tab').click(()=>search_appid(card_json, chinese_json))
};
