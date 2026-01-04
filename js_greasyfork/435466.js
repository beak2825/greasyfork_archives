// ==UserScript==
// @name        meneame.net - Mostrar negativizadores de meneos
// @namespace   http://tampermonkey.net/
// @version     0.14
// @description Muestra una lista de los usuarios que han votado negativo un meneo.
// @author      ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match       *://*.meneame.net/*
// @connect     meneame.net
// @icon        https://www.meneame.net/favicon.ico
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/435466/meneamenet%20-%20Mostrar%20negativizadores%20de%20meneos.user.js
// @updateURL https://update.greasyfork.org/scripts/435466/meneamenet%20-%20Mostrar%20negativizadores%20de%20meneos.meta.js
// ==/UserScript==

// RECOMENDADO USAR JUNTO AL CSS DE @Ergo: https://userstyles.world/style/1811

// ---- SCRIPT values ----
//const COLUMNS = 2;
const COLUMNS = IsMobileDevice() ? 1 : 2;
const ALIGNMENT = 'left'; // right / left
const ORDER_DATE = 'ASC'; // ASC / DESC
const NAME_LENGTH_PIXELS = 205;

// ---- API values ----
const NEGATIVE_COUNTER_CLASS = '.negative-vote-number';
const NEGATIVE_HEADER = '.news-details';
const NEGATIVE_HEADER_CONTENT = 'votos negativos:';
const VOTERS_LIST = '.voters-list';
const VOTER = 'a + span';
const NEWS_SUMMARY = '.news-summary'
const STORY_BLOG = '.story-blog';
const STORY_BLOG_INSERTION = '.col-md-8.col-md-offset-1';
const URL_VOTERS = 'https://www.meneame.net/backend/meneos.php?id=MENEO_ID&p=PAGE_COUNTER';
const URL_USER_VOTES = 'https://www.meneame.net/user/#USERNAME/shaken';
const USER_VOTES_HREF = "<a href='"+ URL_USER_VOTES + "' title='Noticias votadas por #USERNAME'>#SHAKEN_TEXT</a>";
const NEGATIVE_OPTIONS = [
    'antigua',
    'bulo',
    'cansina',
    'copia/plagio',
    'duplicada',
    'errónea',
    'irrelevante',
    'microblogging',
    'spam',
    'muro de pago',
    'sensacionalista',
];
const AVATAR_TOOLTIP_CLASS = 'avatar tooltip u:ID_USUARIO lazy';

const negativeArticleCSSSuffix = '_Article';
const negativeArticleCSSPrefix = 'negative_class_';
const negativeClassHeader = negativeArticleCSSPrefix + "header";
const negativeClassColumnsContainer = negativeArticleCSSPrefix + 'columns_container'
const divNegativizators = `<div class='${negativeClassHeader}'>HEADER</div><br><div class='${negativeClassColumnsContainer}'><div class='${negativeArticleCSSPrefix}voters'>LIST_NEG</div></div>`;
const divNegativizator = `<div class='${negativeArticleCSSPrefix}voter'><p class='${negativeArticleCSSPrefix}what WHAT'>WHAT</p><p class='${negativeArticleCSSPrefix}who'>WHO</p><p class='${negativeArticleCSSPrefix}when'>WHEN</p></div>`;
const NegativizatorsCSS = `.${negativeClassHeader} {text-align: left; margin-left: 20px;} .${negativeClassColumnsContainer} {margin-left: 20px; margin-right: 20px; text-align: center; margin-bottom: 20px;} .${negativeArticleCSSPrefix}voters {text-align:  right; column-count: ${COLUMNS}; column-rule-style: solid; column-gap: 5px;} .${negativeArticleCSSPrefix}voter {text-align: right; font-size: smaller; column-count: 3; column-width: 60px;} .negative_class_who {width:${NAME_LENGTH_PIXELS}px;white-space:nowrap;overflow:hidden;text-overflow:'…';}`;
let Total_Negativizators = 0;
let Array_Voters = [];
let Article = false;

ListNegativizators();

function ListNegativizators() {
    if (link_id > 0 && IsArticle() && HasNegatives()) {
        Article = true;
        ShowList();
    } else {
        if (link_id > 0 && document.querySelector(NEGATIVE_COUNTER_CLASS) && parseInt(document.querySelector(NEGATIVE_COUNTER_CLASS).textContent,10) > 0) ShowList();
    }
}

function IsArticle() {
    return document.querySelectorAll(STORY_BLOG).length > 0;
}

async function HasNegatives() {
    const result = await GM.xmlHttpRequest({
        method: "GET",
        url: url_votes(1),
        responseType: "document"
    });

    const xmlDoc = new DOMParser().parseFromString(result.responseText, "text/html");
    return xmlDoc.querySelector(NEGATIVE_HEADER).innerHTML.includes(NEGATIVE_HEADER_CONTENT);
}

async function ShowList() {
    let negative_header_content = '';
    let voters_page_counter = 1;
    let MaxPages = 0;

    while (voters_page_counter > 0) {
        const result = await GM.xmlHttpRequest({
            method: "GET",
            url: url_votes(voters_page_counter),
            responseType: "document"
        });

        const xmlDoc = new DOMParser().parseFromString(result.responseText, "text/html");

        if (negative_header_content === '') {
            negative_header_content = ApplyCSS2Header(xmlDoc.querySelector(NEGATIVE_HEADER).innerHTML);
            negative_header_content = IsMobileDevice() ? negative_header_content.replaceAll('<span','<br><span') : negative_header_content;
            console.log(negative_header_content);
            MaxPages = parseInt(xmlDoc.getElementsByClassName('pages')[0].lastChild.text, 10);
        }

        const node = xmlDoc.querySelector(VOTERS_LIST);

        if (node && node.childElementCount > 0) {
            AddPageNegativizators(node);
        } else {
            voters_page_counter = -1;
        }

        voters_page_counter++;
        if (voters_page_counter > MaxPages) voters_page_counter = 0;
    }

    InsertNegativizators(negative_header_content);
}

function AddPageNegativizators(page_node) {
    const node_neg = page_node.querySelectorAll(VOTER);

    if (node_neg && node_neg.length > 0) {
        node_neg.forEach(page_node => {
            divNegativeVoter(page_node.textContent, page_node.previousElementSibling.title, insertClassAvatar(page_node.previousElementSibling.childNodes[0]));
        });
    }
}

function InsertNegativizators(header_content) {
    if (Total_Negativizators > 0) {
        GM_addStyle(NegativizatorsCSS.replace('COLUMNS', COLUMNS).replace('text-align: right','text-align: ' + ALIGNMENT).replace('NAME_LENGTH_PIXELS',NAME_LENGTH_PIXELS));

        if (ORDER_DATE === 'ASC') {
            Array_Voters.sort((a, b) => b.Total_Negativizators - a.Total_Negativizators);
        }

        let where_class = NEWS_SUMMARY;
        let position = 'afterend';
        let what = columnDiv(header_content, ExtractVotersFromArray());

        if (Article) {
            position = 'afterbegin';
            where_class = STORY_BLOG_INSERTION;
            what = what.replace(negativeClassHeader, negativeClassHeader + negativeArticleCSSSuffix).replace(negativeClassColumnsContainer, negativeClassColumnsContainer + negativeArticleCSSSuffix);
        }

        document.querySelector(where_class).insertAdjacentHTML(position, what);
    }
}

function ApplyCSS2Header(strHeader) {
    for (const negativeOption of NEGATIVE_OPTIONS) {
        strHeader = strHeader.replace(negativeOption, `<span class='${negativeArticleCSSPrefix}what ${negativeOption.replaceAll(' ', '_')}'>${negativeOption.toUpperCase()}</span>`).replace(NEGATIVE_HEADER_CONTENT,NEGATIVE_HEADER_CONTENT.toUpperCase());
    }

    return strHeader;
}

function ExtractVotersFromArray() {
    let result = '';
    Array_Voters.forEach((voter_div) => {
        result += voter_div.strData;
    });
    return result;
}


function divNegativeVoter(what, who, avatar) {
    let date_lenght = ((who.slice(-11)).slice(0,1) === ':') ? 9 : 20;

    const when = who.slice(-date_lenght).replace(' UTC','').replace('-202','-2');
    const userName = who.slice(0,-1*(date_lenght+2));
    who = ALIGNMENT === 'left' ? avatar + '&nbsp;' + formatWho(userName) : formatWho(userName) + '&nbsp;' + avatar;
    Total_Negativizators++;

    const strData = divNegativizator.replace('WHAT', what.replaceAll(' ', '_')).replace('WHAT', encloseATagUserVotes(what.toUpperCase(), userName)).replace('WHO', who).replace('WHEN', when);

    Array_Voters.push({strData, Total_Negativizators});
}

function encloseATagUserVotes(strData, strUser) {
    return USER_VOTES_HREF.replaceAll('#USERNAME',strUser).replace('#SHAKEN_TEXT',strData);
}

function formatWho(strName) {
    return encloseATagUserVotes(strName, strName).replace("title", " class='username' title");
}

function columnDiv(header_neg, list_neg) {
    return divNegativizators.replace('HEADER', header_neg).replace('LIST_NEG', list_neg);
}

function url_votes(page) {
    return URL_VOTERS.replace('PAGE_COUNTER',page).replace('MENEO_ID', link_id);
}

function insertClassAvatar(nodeAvatar) {
    if (!nodeAvatar.src.includes('no-gravatar')) {
        nodeAvatar.className = AVATAR_TOOLTIP_CLASS.replace('ID_USUARIO', extractUserIdFromAvatarURL(nodeAvatar.getAttribute('src')));
    }

    return nodeAvatar.outerHTML;
}

function extractUserIdFromAvatarURL(strURL) {
    if (!strURL) return 0;
    const regex = /\/(\d+)-\d+/;
    const match = strURL.match(regex);
    return match ? match[1] : 0;
}

function IsMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}