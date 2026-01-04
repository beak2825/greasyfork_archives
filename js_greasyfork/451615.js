// ==UserScript==
// @name         Mteam VIP Faker
// @version      0.0.1
// @description  仅供娱乐，请勿当真.
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://kp.m-team.cc/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/942532-beer
// @downloadURL https://update.greasyfork.org/scripts/451615/Mteam%20VIP%20Faker.user.js
// @updateURL https://update.greasyfork.org/scripts/451615/Mteam%20VIP%20Faker.meta.js
// ==/UserScript==
(() => {

    $('tr').find('td:eq(0)').each(function() {
        if($(this).text() == '等級') {
            console.log($(this).text());
            let $img = $(this).next().find('img');
            $img.attr('src', 'pic/vip.gif');
            $img.attr('alt', 'VIP');
            $img.attr('title', 'VIP');
        }
    });
    $('#info_block a').each(function() {
        if($(this).attr('href').match(/^userdetails.php\?id=\d+$/)) {
            $(this).attr('class', 'VIP_Name');
            $(this).after('<img class="star" src="pic/trans.gif" alt="Donor" style="margin-left: 2pt">');
        }
    });
    console.log($('[href^=userdetails.php?id=]'));

})();