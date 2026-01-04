// ==UserScript==
// @name        e-hentai to nhentai
// @name:zh-CN        e-hentai to nhentai
// @name:zh-TW         e-hentai to nhentai
// @name:ja        e-hentai to nhentai
// @namespace   e-hentai_to_nhentai
// @supportURL  https://github.com/zhuzemin
// @description A button in e-hentai, for search Gallery in nhentai
// @description:ja A button in e-hentai, for search Gallery in nhentai
// @description:zh-TW  A button in e-hentai, for search Gallery in nhentai
// @description:zh-CN A button in e-hentai, for search Gallery in nhentai
// @include     https://exhentai.org/g/*/*
// @include     https://e-hentai.org/g/*/*
// @version     1.11
// @run-at      document-start
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/395662/e-hentai%20to%20nhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/395662/e-hentai%20to%20nhentai.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

// prepare UserPrefs
setUserPref(
    'nhentaiSite',
    'https://en.nyahentai3.com',
    'Witch site you want use',
    `working with: 
    https://nhentai.net / https://en.nyahentai3.com / 
    https://zh.nyahentai4.com / https://zh.nyahentai.pro / https://zh.nyahentai.co / 
    https://ja.nyahentai.org / https://ja.nyahentai.net`,
    ','
);
var nyahentaiSite;

function SearchNyahentai() {
    var title=document.title.replace(/( - ExHentai\.org)|( - E-Hentai Galleries)|[^\w\d\[\]]/g," ");
    window.open(nyahentaiSite+"/search/q_"+encodeURI(title));
}

function CreateButton(text,func){
    var btn=document.createElement("button");
    btn.type="button";
    btn.onclick="";
    btn.innerHTML=text;
    btn.addEventListener('click',func);
    var gd2=document.querySelector("#gd2");
    gd2.insertBefore(btn, null);
}

var init = function () {
    nyahentaiSite=GM_getValue('nhentaiSite')||'https://en.nyahentai3.com';
    CreateButton('Search in nhentai',function () {
        SearchNyahentai();
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
