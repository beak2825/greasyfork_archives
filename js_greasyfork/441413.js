// ==UserScript==
// @name        animes.vision - Strip all 'ouo' link protector from download links and fix file download names
// @name:pt-BR  animes.vision - Tira o protetor de links 'ouo' das URLs de download e corrige o nome dos arquivos
// @namespace   secretx_scripts
// @match       *://animes.vision/*/*/*/*/download
// @version     2024.02.19
// @author      SecretX
// @description Strip all 'ouo' link protector from download links and fix file download names
// @description:pt-br Remove das URLs de download do site 'ouo', transformando-os em download direto com o nome do episódio corrigido (chega de nomes aleatórios)
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM.xmlHttpRequest
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/vanillatoasts@1.4.0/vanillatoasts.min.js
// @resource    VANILLA_TOASTS_CSS https://cdn.jsdelivr.net/npm/vanillatoasts@1.4.0/vanillatoasts.min.css
// @icon        https://animes.vision/favicon.ico
// @license     GNU LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/441413/animesvision%20-%20Strip%20all%20%27ouo%27%20link%20protector%20from%20download%20links%20and%20fix%20file%20download%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/441413/animesvision%20-%20Strip%20all%20%27ouo%27%20link%20protector%20from%20download%20links%20and%20fix%20file%20download%20names.meta.js
// ==/UserScript==

const downloadButtonSectionName = "Vision Oficial FREE";
const tagName = "wire:initial-data";
const interestedInResponseWith = "download.links";

const linkProtectorRegex = /^https?:\/\/ouo.\w{2,3}\/\w+\/[a-z0-9]+\?s=(.+)$/i;
const qualityMapSelectors = {
    keyUHD: "uhd",
    keyFHD: "fullhd",
    keyHD: "hd",
    keySD: "sd",
};
const downloadButtons = {};

function findDownloadButtons() {
    for (let i = 1; i < 10; i++) {
        const elems = Array.from(document.querySelector(`div.download-links:nth-child(${i})`)?.children ?? []);
        if (elems.length === 0) {
            break;
        }

        const divTitle = elems.find(a => a.nodeName === "SPAN")?.innerText;
        if (divTitle?.toLowerCase() !== downloadButtonSectionName.toLowerCase()) {
            // not the right section, try again
            continue;
        }

        const downloadBtns = elems.find(a => a.nodeName === "DIV").children;
        for (let btn of downloadBtns) {
            const quality = btn.innerText.toLowerCase();

            if (quality.includes("uhd") || quality.includes("ultra hd") || quality.includes("4k")) {
                downloadButtons.uhd = btn;
            } else if (quality.includes("fhd") || quality.includes("fullhd")) {
                downloadButtons.fullhd = btn;
            } else if (quality.includes("hd")) {
                downloadButtons.hd = btn;
            } else if (quality.includes("sd")) {
                downloadButtons.sd = btn;
            } else {
                console.warn(`Unknown episode quality: ${quality}`);
            }
        }
        if (downloadButtons.length > 0) {
            break;
        }
    }
}

function extractDataFromDiv(stringDiv){
    const div = document.createElement("div");
    div.innerHTML = stringDiv;
    // extracts the tag that contains the data we want
    return div.children[0].getAttribute(tagName);
}

function cssCopyCat(elem1, elem2) {
    // get computed styles of original element
    const styles = window.getComputedStyle(elem1);

    let cssText = styles.cssText;
    if (!cssText) {
        cssText = Array.from(styles).reduce((str, property) => {
            return `${str}${property}:${styles.getPropertyValue(property)};`;
        }, '');
    }

    // assign css styles to element
    elem2.style.cssText = cssText;
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

function toast(title, message, type, timeout) {
    return VanillaToasts.create({
        title: title,
        text: message,
        type: type, // success, info, warning, error   / optional parameter
        timeout: timeout,
    });
}

const successToast = (title, message) => toast(title, message, "success", 1800);

const errorToast = (title, message) => toast(title, message, "error", 3800);

function cleanupLink(link) {
    const match = link.match(linkProtectorRegex);
    if (match == null) {
        return link;
    }
    return match[1];
}

function getEpisodeName() {
    return document.querySelector(".cat-heading")?.innerText;
}

function replaceDownloadButtons() {
    const url = window.location.href;

    doRequest("GET", url)
        .then(response => {
            const html = (new DOMParser()).parseFromString(response.responseText, 'text/html');
            const dataJson = Array.from(html.getElementsByTagName("div"))
                .map(div => div.getAttribute(tagName))
                .find(json => json != null && json.includes(interestedInResponseWith));

            if (dataJson == null) {
                console.error("Wasn't able to find any episode div, thus didn't extract any download links from the page");
                return;
            }

            const links = JSON.parse(dataJson)?.serverMemo?.data?.episodiosLink;
            if (links == null) {
                console.error(`Wasn't able to find links inside ${tagName} div, thus didn't extract any download links from the page`);
                return;
            }

            for (let keyQuality in links) {
                replaceDownloadButton(links, keyQuality);
            }

            if (!isMobile) {
                try { successToast("AnimesVision Script", "Download links injected successfully!") } catch (e) {}
            }
        })
        .catch(error => {
            const msg = `Could not bypass native ${window.location.host} links on page ${url} with error: ${error}`;
            console.error(msg);
            try { errorToast("AnimesVision Script", msg) } catch (e) {}
        });
}

function replaceDownloadButton(links, keyQuality) {
    const link = cleanupLink(links[keyQuality]);
    const quality = qualityMapSelectors[keyQuality];
    if (quality == null) {
        console.warn(`Unknown quality received from backend response: ${keyQuality}`);
        return;
    }
    const downloadBtn = downloadButtons[quality];
    if (downloadBtn == null) {
        console.warn(`No download button found for quality received from backend response: ${quality}`);
        return;
    }

    const newBtn = document.createElement("a");
    cssCopyCat(downloadBtn, newBtn);
    newBtn.innerText = downloadBtn.innerText;
    newBtn.href = link;
    const episodeName = getEpisodeName();
    if (episodeName != null) {
        newBtn.download = episodeName;
    }

    // remove the old button with the new 'a' tag that downloads properly named files and doesn't have any link protector
    downloadBtn.replaceWith(newBtn);
}

function replaceExternalDownloadLinks() {
    Array.from(document.getElementsByTagName("a"))
        .filter(a => a.href != null && a.href.match(linkProtectorRegex) != null)
        .forEach(a => a.href = cleanupLink(a.href));
}

function injectVanillaToastsCss() {
    const containerRegex = /(#vanillatoasts-container){([^}]+)/;
    const titleRegex = /(\.vanillatoasts-title){([^}]+)}/;
    const msgRegex = /(\.vanillatoasts-text){([^}]+?);color:#\d+}/;

    const css = GM_getResourceText("VANILLA_TOASTS_CSS")
        .replace(containerRegex, "$1{$2;z-index:1000000")
        .replace(titleRegex, "$1{$2;color:rgb(70,70,70)}")
        .replace(msgRegex, "$1{$2;color:rgb(110,110,110)}");

    GM_addStyle(css);
}

async function copyToClipboard(text) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text)
            .then(() => { console.info(`Successfully copied '${text}' to clipboard using navigator API`); return true },
                reason => { console.error("Copy to clipboard using navigator API failed", reason); return false });
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        const textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (e) {
            console.warn("Copy to clipboard using query command 'copy' failed", e);
        } finally {
            document.body.removeChild(textarea);
        }
    } else if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        window.clipboardData.setData("Text", text);
        return true;
    } else {
        console.warn("This browser has NO support for clipboard copying whatsoever!");
        return false;
    }
}

function addCopyTitleButton() {
    const episodeName = getEpisodeName();
    if (episodeName == null) {
        console.info("No episode name found, skipping copy title button");
        return;
    }

    const copyTitleBtn = document.createElement("button");
    copyTitleBtn.innerText = "Copy";
    copyTitleBtn.setAttribute("class", "btn btn-control btn-secondary btn-md");
    copyTitleBtn.addEventListener("click", () => {
        copyToClipboard(episodeName).then(sucessfullyCopied => {
            if (sucessfullyCopied && !isMobile) {
                successToast("AnimesVision Script", "Episode name copied to clipboard!");
            }
        });
    });
    document.querySelector(".main-az").appendChild(copyTitleBtn);
}

window.addEventListener("DOMContentLoaded", () => {
    'use strict';
    findDownloadButtons();
    injectVanillaToastsCss();
    addCopyTitleButton();
}, false);

window.addEventListener("load", () => {
    'use strict';
    replaceDownloadButtons();
    replaceExternalDownloadLinks();
}, false);

const isMobile = (function(){
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
})();