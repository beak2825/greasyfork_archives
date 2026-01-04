// ==UserScript==
// @name        animestc.net - Automatically set the highest quality for all items on page
// @name:pt-BR  animestc.net - Seleciona a qualidade mais alta de download em todos os items da página
// @namespace   secretx_scripts
// @match       *://animestc.net/*
// @match       *://*.animestc.net/*
// @match       *://protetor.animestc.*/link/*
// @version     2022.09.18
// @author      SecretX
// @description Automatically set the highest quality for all items on page
// @description:pt-br Seleciona automaticamente a qualidade mais alta de download em todos os items da página
// @grant       GM.xmlHttpRequest
// @run-at      document-start
// @icon        https://www.animestc.net/icons/favicon-32x32.png
// @license     GNU LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/441412/animestcnet%20-%20Automatically%20set%20the%20highest%20quality%20for%20all%20items%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/441412/animestcnet%20-%20Automatically%20set%20the%20highest%20quality%20for%20all%20items%20on%20page.meta.js
// ==/UserScript==

const autoscrollOptions = {
    // valid options: none, season-titles, episodes
    desktop: "season-titles",
    mobile: "episodes",
};

const qualityRegex = /\s*(\d+)\s*p\s*/i;
const atcBackendUri = "api/link";
const isOnLinkProtectorPage = () => /protetor\.animestc\.\w{1,3}/i.test(window.location.origin);
const isOnMainPage = () => (/\w+:\/\/(\w+\.)?animestc\.net\/?/i.test(window.location.href));

function delayed(ms, callback) {
    new Promise(resolve => setTimeout(resolve, ms)).then(callback);
}

function sortByQuality(map) {
    return new Map([...map].sort((a, b) => String(a[0]).localeCompare(b[0])));
}

function parseQuality(string) {
    let parsedQuality = string.match(qualityRegex);
    if (parsedQuality == null)
        return string;
    else
        return parsedQuality[1];
}

/**
 * Parses the quality options inside the `div` parameter, and return the "best" quality available.
 *
 * @param div a div that contains `a` html elements that represent the quality options of an episode
 * @returns {any} a map entry with the quality number (or string), e.g. 1080, 720, MP4 as key, and the highest
 * quality `a` html element as value
 */
function highestQualityFromDiv(div) {
    const qualityMap = new Map();
    for (const elementA of div) {
        const quality = parseQuality(elementA.innerText);
        qualityMap.set(quality, elementA);
    }
    return sortByQuality(qualityMap).entries().next().value;
}

function getHighestQualitiesFromDivColl(divHtmlCol) {
    const highestQualityElems = [];
    for (let div of divHtmlCol) {
        const children = div.children;
        const highestQualityElem = highestQualityFromDiv(children);
        highestQualityElems.push(highestQualityElem[1])
    }
    return highestQualityElems;
}

function smoothScrollTo(name, selector) {
    console.info(`Smooth scrolling page to ${name}`)
    document.querySelector(selector).scrollIntoView({ behavior : "smooth" });
}

function doRequest(httpMethod, url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: httpMethod.toUpperCase(),
            url: url,
            onload: resolve,
            onerror: reject,
            responseType: "text",
            timeout: 6000,
        });
    });
}

async function retryOnFail(promise, handler, maxRetries = 3, retryDelayMs = 1000) {
    let retries = 0;
    const retryCallback = async e => {
        if (retries >= maxRetries)
            throw new Error(`Maximum retries reached. ${e}`);
        else
            console.debug(`Retrying... ${e}`);
        retries++;
        return await runHandling();
    };
    return await runHandling();

    async function runHandling() {
        try {
            return handler(await promise());
        } catch (e) {
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
            return await retryCallback(e);
        }
    }
}

function skipLinkProtector() {
    if (!isOnLinkProtectorPage()) {
        console.info("This is not a link protector page, skipping link protector bypass.");
        return;
    }
    const linkId = document.getElementById("link-id").getAttribute("value");
    const backendRequestLink = `${window.location.origin}/${atcBackendUri}/${linkId}`;

    console.debug(`Sending request to backend: ${backendRequestLink}`);
    retryOnFail(() => doRequest("GET", backendRequestLink), response => {
        if (response.status !== 200) {
            throw new Error(`Backend request failed with status ${response.status}, response ${response.response}`);
        }
        const link = JSON.parse(response.response).link;
        console.info(`Received bypassed link, redirecting to ${link}`);
        window.location.replace(link);
    });
}

function doAutoScroll() {
    const onMobile = isOnMobile();
    const scrollTo = onMobile ? autoscrollOptions["mobile"] : autoscrollOptions["desktop"];
    const scrollDelayMs = onMobile ? 850 : 0;

    if (!isOnMainPage()) {
        if (scrollTo !== "none") console.info("Autoscroll only happens on main page, so this script won't scroll here");
        return;
    }
    delayed(scrollDelayMs, () => {
        if (scrollTo === "season-titles") smoothScrollTo(scrollTo, ".main-seasons-title");
        else if (scrollTo === "episodes") smoothScrollTo(scrollTo, ".episodes");
    });
}

function selectHighestQualityEpisodes() {
    const qualityDivs = document.getElementsByClassName("episode-info-tabs");
    if (qualityDivs.length === 0) {
        console.info("There is no quality div on this page, skipping automatic quality selection for now.");
        return;
    }
    const highestQualityElems = getHighestQualitiesFromDivColl(qualityDivs);
    for (const elementA of highestQualityElems) {
        console.debug(`Clicking on ${elementA} element!`);
        elementA.click();
    }
}

window.addEventListener("DOMContentLoaded", function() {
    'use strict';

    setTimeout(skipLinkProtector, 3000);
}, false);

window.addEventListener("load", function() {
    'use strict';

    doAutoScroll();
    selectHighestQualityEpisodes();
}, false);

function isOnMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}