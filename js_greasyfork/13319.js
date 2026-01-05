// ==UserScript==
// @name         RYM: Rate issues from custom charts and collection view pages
// @namespace    https://rateyourmusic.com/~pandrew
// @version      0.1
// @description  something useful
// @author       Pando Calrissian
// @match        https://rateyourmusic.com/customchart*
// @match        https://rateyourmusic.com/charts/*
// @match        https://rateyourmusic.com/collection/*
// @grant        none
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/13319/RYM%3A%20Rate%20issues%20from%20custom%20charts%20and%20collection%20view%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/13319/RYM%3A%20Rate%20issues%20from%20custom%20charts%20and%20collection%20view%20pages.meta.js
// ==/UserScript==

GM_addStyle('.issue_cataloger, .film_cataloger {  right: 0; top: inherit; }'); 


$('#content').prepend('<script src="/sourced/artist_page.js"></script><script src="/sourced/release_page.js"></script>')

rate = '<span onclick="RYMartistPage.openIssueCataloger(RYM_ID);" class="disco_cat_inner_issue"><span class="disco_cat_catalog_msg"><i class="fa fa-caret-left"></i> </span> <span id="disco_cat_catalog_msg_RYM_ID">Rate</span></span><div id="issue_cataloger_RYM_ID" class="issue_cataloger"><div class="issue_cataloger_close" onclick="RYMartistPage.collapseIssueCataloger(RYM_ID);"><i class="fa fa-caret-right"></i> </div> <div id="issue_cataloger_content_RYM_ID" class="issue_cataloger_content"></div></div>'

$.each($('.album'), function(){
    album_id = $(this).attr('title').replace('[Album','').replace(']','');
    linky = $(this).parent().after().after(rate.replace(/RYM_ID/g, album_id));
});
