// ==UserScript==
// @name        ExHentai.org - quick search artist on nhentai.net
// @namespace   exhentai_org_search_artist_on_nhentai_net
// @description Adds link next to artist name to quickly find him on nhentai.net
// @match     *://*.exhentai.org/g/*/*
// @match     *://*.e-hentai.org/g/*/*
// @match     *://*.nhentai.net/nope/*/*
// @version     1.16
// @homepageURL	https://greasyfork.org/en/scripts/448730-exhentai-search-artist-on-nhentai-net/
// @run-at      document-start
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @author      miwoj
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @icon         https://exhentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/448730/ExHentaiorg%20-%20quick%20search%20artist%20on%20nhentainet.user.js
// @updateURL https://update.greasyfork.org/scripts/448730/ExHentaiorg%20-%20quick%20search%20artist%20on%20nhentainet.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console) : function () {
};


var nhentaiSite;

function SearchNhentai() {
    var title=document.title.replace(/( - ExHentai\.org)|( - E-Hentai Galleries)|[^\w\d\[\]]/g," ");
    var artist=document.querySelector('[id^="td_artist"]').id;
    var artist2=artist.split(":").pop()

	 var artist_name=artist2.replaceAll("_","+");

	 // YOU CAN ADD YOUR CUSTOM TAGS YOU WANT ADDED TO EVERY SEARCH
	 var artist_name_plus_extra_tags=artist_name+"+some_tag+other_tag";

	 // SWITCH COMMENT IN THESE 2 LINES BELOW
    window.open("https://nhentai.net/search/?q="+encodeURI(artist_name));
	 //window.open("https://nhentai.net/search/?q="+encodeURI(artist_name_plus_extra_tags));
}

function CreateButton(text,func){
    var btn=document.createElement("button");
    btn.type="button";
    btn.onclick="";
    btn.innerHTML=text;
    btn.addEventListener('click',func);
    var artist_link=document.querySelector('[id^="td_artist"]');

    var all = document.getElementsByClassName('gt');
    for (var i = 0; i < all.length; i++) {
        all[i].style.border = '0px';
    }

    artist_link.style.border="0px";
    //alert (artist_link);

    btn.style.display="block";
    btn.style.backgroundColor="#4f535b00";
    btn.style.color="#ff6c85";
    btn.style.border="none";
    btn.style.marginTop="5px";
    btn.style.marginLeft="0px";
    btn.style.paddingLeft="0px";
    btn.style.cursor="pointer";
    btn.style.fontSize="8pt";
    btn.style.fontFamily="arial,helvetica,sans-serif";
    btn.style.fontWeight="bold";
    artist_link.insertBefore(btn, null);
}

var init = function () {
    nhentaiSite=GM_getValue('nhentaiSite')||'https://nhentai.net';
    CreateButton('search nhentai.net',function () {
        SearchNhentai();
});

}
window.addEventListener('DOMContentLoaded', init);
function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
        var val = prompt(promtText, GM_getValue(varName, defaultVal));
        if (val === null)  { return; }  // end execution if clicked CANCEL
        // prepare string of variables separated by the separator
        if (sep && val){
            var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
            var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
            //val = val.replace(pat1, sep).replace(pat2, '');
        }
        //val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
        GM_setValue(varName, val);
        // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
        //if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
        //else location.reload();
    });
}
