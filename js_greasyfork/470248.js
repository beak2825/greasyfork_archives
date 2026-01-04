// ==UserScript==
// @name        meneame.net - Edición generalísimo
// @namespace   http://tampermonkey.net/
// @version     1.3
// @description Pruebe Vd. a ver las noticias como la gente de bien: todo es culpa de los rojos.
// @author      ochoceros
// @match       *://*.meneame.net/*
// @connect     meneame.net
// @resource    reign_flag       	https://upload.wikimedia.org/wikipedia/commons/8/89/Bandera_de_Espa%C3%B1a.svg
// @resource    dictatorship_flag   https://upload.wikimedia.org/wikipedia/commons/3/33/Flag_of_Spain_%281945%E2%80%931977%29.svg
// @grant		GM.getResourceUrl
// @icon        https://www.meneame.net/favicon.ico
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/470248/meneamenet%20-%20Edici%C3%B3n%20general%C3%ADsimo.user.js
// @updateURL https://update.greasyfork.org/scripts/470248/meneamenet%20-%20Edici%C3%B3n%20general%C3%ADsimo.meta.js
// ==/UserScript==

const TEMPLATE_REPLACE = '<span class="Text_Reign">$1</span><span class="Text_Dictatorship">XX</span>';
const CSS_FLAG = '<style>img.SVG_Wiki_Flag{height:43px; width=45px;padding-right: 0px;float: left;padding-top: 4px;box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);}</style>';
const CSS_REIGN = '.Text_Dictatorship{display:none !important;}.Flag_Dictatorship{display:none !important;}.Text_Reign{display:inline !important;}.Flag_Reign{display:block !important;}';
const CSS_DICTATORSHIP = '.Text_Dictatorship{display:inline !important;}.Flag_Dictatorship{display:block !important;}.Text_Reign{display:none !important;}.Flag_Reign{display:none !important;}';
const CSS_FLAG_TEXT = '<style id="style_Flag_text">' + CSS_REIGN + '</style>';
const JS_VARIABLES = 'const St_Reign="' + CSS_REIGN + '";const St_Dictatorship="' + CSS_DICTATORSHIP + '";let stReign=true;';
const JS_CODE = JS_VARIABLES + 'function swapFlag(){const stTag=document.getElementById("style_Flag_text");stTag.innerHTML=stReign?St_Dictatorship:St_Reign;stReign=!stReign;}';
const LOGO_LOCATION = '#header-logo.logo-mnm.nav-bar-option';

const WHERE_TO_SEARCH = [
    ['#header-top.mnm-center-in-wrap > a.sub-name.wideonly.nav-bar-option'],
    ['.news-summary > .news-body > .center-content > h2 > a.ga-event'],
    ['.news-summary > .news-body > .center-content > .news-content'],
    ['.news-summary > .news-body > .center-content > .news-tags a'],
    ['#newswrap > #toplink h1 a'],
    ['div#newswrap > h3 a'],
    ['#newswrap > #toplink p'],
    ['.comment > .comment-body > .comment-text'],
    ['div.body > div.cell > h5 a'],
    ['div.guest a div.guest-name'],
    ['div.body.comments ul li p a.tooltip'],
    ['.sidebox .tagcloud a',true],
    ['div.contents-layout > div.contents-body > h4 > a'],
    ['div.news-submitted > span.showmytitle'],
    ['div#comments-top.comments > div.topbox'],
    ['div.story-blog div.main-content'],
    ['div.news-summary > div.news-body > div.box'],
];

const REPLACE_WORDS = [
    ['al PP|al Partido Popular', 'a Podemos'],
    ['del PP|del Partido Popular', 'de Podemos'],
    ['el PP|el Partido Popular|Partido Popular|PP', 'Podemos'],
    ['Populares', 'podemitas'],
    ['Pablo Casado|Casado', 'Monedero'],
    ['Mariano Rajoy Brey|Mariano Rajoy|M. Rajoy|Rajoy', 'Pablo Iglesias'],
    ['Alberto N.ñez Feij.o|N.ñez Feij.o|Feij.o', 'Echenique'],
    ['y d.az ayuso|y ayuso', 'e Irene Montero'],
    ['isabel natividad d.az ayuso|isabel d.az ayuso|d.az ayuso|ayuso', 'Irene Montero'],
    ['y Vox', 'e Izquierda Unida'],
    ['vox', 'Izquierda Unida'],
    ['Santiago Abascal|abascal', 'Alberto Garzón'],
    ['derecha', 'izquierda'],
    ['el reino de españa|españa', 'el Reino de España'],
    ['pedro s.nchez|perro s.nchez|s.nchez', 'perro sanxe'],
    ['  edición general  ', 'edición generalísimo'],
    ['yolanda d.az|yolanda|la yoli', 'la Fashionaria'],
    ['jos. luis mart.nez almeida|mart.nez almeida|almeida', 'Manuela Carmena'],
    ['nazismo', 'renacimiento'],
    ['nazi', 'ilustre'],
    ['fascismo', 'comunismo'],
    ['fascista', 'comunista'],
    ['facha', 'progre'],
    ['franquismo', 'republicanismo'],
    ['franquista', 'republicano'],
    ['golpe de estado', 'glorioso alzamiento'],
    ['eldiario.es', 'abc.es'],
    ['publico.es', 'larazon.es'],
    ['20minutos.es', 'okdiario.com'],
    ['hijos de puta', 'unicornios'],
    ['hijas de puta', 'unicornias'],
    ['hijo de puta|hijoputa|ideputa|ioputa|ijueputa|hdp|joputa|hijo de la gran puta', 'unicornio'],
    ['hija de puta|hijaputa|iaputa|japuta|hija de la gran puta', 'unicornia'],
    ['magreb.|marroqu.|argelino|tunecino|egipcio|libio|et.ope|sudanes|sudafricano|congoleño|nigeriano|keniata|ghanes|senegal.s|malies|maliense|ugand.s|camerun.s|somal.|angoleño|ruand.s|guineano', 'africano'],
];

function doDirtyThings() {
    insertJS();
    insertStyle();
    insertFlags();
    REPLACE_WORDS.forEach(words => WHERE_TO_SEARCH.forEach(where => replaceText(document.querySelectorAll(where[0]), words, where[1])));
}

function replaceText(text_list, words, to_lower_case = false) {
    if (text_list && words) {
        for (var text of text_list) {
            var words_array = words[0].split('|');
            words_array.forEach(splitted => text.innerHTML = replaceTextPreserveURLs(text.innerHTML, splitted,(TEMPLATE_REPLACE.replace('XX', (to_lower_case ? words[1].toLowerCase() : words[1])))));
        }
    }
}

async function insertFlags() {
    var logoNode = document.querySelector(LOGO_LOCATION);
    async function insertFlag(node_tittle, show_Flag, flag_resource) {
        let img = document.createElement("img");
        img.setAttribute("class", 'SVG_Wiki_Flag ' + (show_Flag ? 'Flag_Reign' : 'Flag_Dictatorship'));
        img.setAttribute("onclick","javascript:swapFlag();");
        img.src = await GM.getResourceUrl(flag_resource);
        node_tittle.prepend(img);
    }
    if (logoNode.parentNode) {
        insertFlag(logoNode.parentNode,true,"reign_flag");
        insertFlag(logoNode.parentNode,false,"dictatorship_flag");
    }
}

function insertJS() {
    var script = document.createElement('script');
    script.type="text/javascript";
    script.innerText = JS_CODE;
    document.head.prepend(script);
}

function insertStyle() {
    document.head.insertAdjacentHTML("beforeend", CSS_FLAG);
    document.head.insertAdjacentHTML("beforeend", CSS_FLAG_TEXT);
}

function replaceTextPreserveURLs(textInnerHTML, TextToSearch, TextToReplace) {
    const urlRegex = /(?:href|data-src|src|title)=(["'])(?:(?=(\\?))\2.)*?\1/g;
    const urls = [];
    function replaceURLText(match) {
        urls.push(match);
        return `__URL_${urls.length - 1}__`;
    }
    const replacedText = textInnerHTML.replace(urlRegex, replaceURLText).replace(new RegExp('('+TextToSearch+')', 'gi'), TextToReplace);
    return replacedText.replace(/__URL_(\d+)__/g, (_, index) => urls[index]);
}

doDirtyThings();