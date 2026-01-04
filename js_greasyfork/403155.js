// ==UserScript==
// @name         Steam Link Regular
// @description  regular links with end /[appid]/ & print at console
// @author       desc_inno
// @namespace    https://github.com/desc70865/Steam-Link-Regular
// @supportURL   https://github.com/desc70865/Steam-Link-Regular/issues
// @version      0.7
// @icon         https://keylol.com/favicon.ico
// @match        https://keylol.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403155/Steam%20Link%20Regular.user.js
// @updateURL https://update.greasyfork.org/scripts/403155/Steam%20Link%20Regular.meta.js
// ==/UserScript==

(function() {
    'use strict';
    print();
    jQuery('body').on("click", "#threadindex > div > ul > li",()=>{
        $('.t_f').ready(()=>setTimeout(()=>{print().then(unauto())},1000))
    });
})();

function print(){
    var table = [],
        name = [];
    setTimeout(3000);
    document.querySelectorAll('.steam-info-link').forEach(function(x){
        var not_language = x.href.match(/(\/\?l)/g) == null,
            not_client = x.href.match(/(\/\?cc)/g) == null,
            appid = x.href.match(/(?<=\/app\/)(\d{3,7})/g);
        if (not_language && not_client && appid != null){
            x.setAttribute("href", "https://store.steampowered.com/app/" + appid + "/");
        }
        name.push(x.outerText)
        table.push(x.href)
    })
    console.log(name.join('\n'))
    console.log(table.join('\n'))
}

function unauto(){
    $('.plc div.authi>a[rel=nofollow]').eq(0).after(`<span class="pipe">|</span><a href="javascript:void(0);" id="unauto_tab">标记</a>`);
    $('#unauto_tab').click(()=>print())
}
