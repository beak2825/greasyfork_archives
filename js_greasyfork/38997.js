// ==UserScript==
// @name         Super google
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Open google images in page instead of new tab
// @author       Faris Hijazi
// @include      https://www.google.*
// @include      https://encrypted.google.com*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/38996-faris-handy-webdev-javascript-functions/code/Faris%20Handy%20Webdev%20JavaScript%20functions.user.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/38997/Super%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/38997/Super%20google.meta.js
// ==/UserScript==
// @require      https://github.com/buzamahmooza/Helpful-Web-Userscripts/raw/master/Handy%20AF%20functions%20Faris.user.js



// noinspection ES6ConvertVarToLetConst
var debug;
if (typeof debug === 'undefined') {
    debug = false;
}
if (typeof log === 'undefined') {
    log = function (msg) {
        if (debug) console.log('Log:', msg);
    };
}

const gImgSearchUrl = "https://encrypted.google.com/search?&hl=en&tbm=isch&q=";
const AUTO_SAVE_UBL_SITES = false;
const REPLACE_IMG_DATA = false;

if (typeof GM === 'undefined') // PRE GM4
{
    GM = {};
    // noinspection JSUnresolvedVariable
    GM.getValue = GM_getValue;
    // noinspection JSUnresolvedVariable
    GM.setValue = GM_setValue;
}

let storedSuccessfulUrlsSet = GM_getValue('unblocked sites of og images', new Set(['forumophilia.com']));
let ublSitesMap = GM_getValue('ublSitesMap', new Map([['forumphilia.com', '']]));
let successfulUrlsSet = new Set();

if (typeof unsafeWindow === "undefined") {
    unsafeWindow = window;
}

window.addEventListener("keydown", onkeydown, true);

// addToSet(storedSuccessfulUrlsSet, successfulUrlsSet);
storedSuccessfulUrlsSet.forEach(function (e, i, a) {
    successfulUrlsSet.add(e);
});
// log('Stored successfulUrlsSet:', storedSuccessfulUrlsSet);
// log('successfulUrlsSet:', successfulUrlsSet);

if (AUTO_SAVE_UBL_SITES) setInterval(storeSuccessfulUrlsSet, 5000);

function updateSuccessfulUrlsSet() {
    qa('.display-original-image').forEach(function (elt, index, array) {
        let siteUrl = "" + getHostname(getGimgRUrl(elt));
        if (/google\.com/.test(siteUrl)) siteUrl = getHostname(elt.getAttribute('rg_meta_ru'));
        if (/tumblr\.com/.test(siteUrl)) siteUrl = siteUrl.replace(/^\d*?\./);
        successfulUrlsSet.add(siteUrl);
        console.log('adding ubl site:', siteUrl);
    });
    console.log('in updateSuccessfulUrlsSet:', Array.from(successfulUrlsSet));
    return successfulUrlsSet; // returning just cuz it could be handy
}

function storeSuccessfulUrlsSet() {
    updateSuccessfulUrlsSet();
    var merged = new Set();
    var stored = GM_getValue('unblocked sites of og images');
    addToSet(merged, successfulUrlsSet);
    addToSet(merged, stored);

    var diff = Array.from(successfulUrlsSet).filter(x => Array.from(stored).indexOf(x) < 0);
    console.log("Found unblocked site that isn't in the database:", diff);

    // successfulUrlsSet;
    // addToSet(successfulUrlsSet, storedSuccessfulUrlsSet);
    GM_setValue('unblocked sites of og images', Array.from(merged));
    console.log('stored set:', GM_getValue('unblocked sites of og images'));
    // console.log('merged successfulUrlsSet:', Array.from(merged));
}

function observeDocument(callback) {
    callback(document.body);
    new MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
            if (!mutations[i].addedNodes.length)
                continue;
            callback(mutations[i].target);
        }
    }).observe(document.body, {
        childList: true, subtree: true,
        attributes: false, characterData: false
    });
}

function observePanel(callback) {
    new MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
            if (!mutations[i].addedNodes.length)
                continue;
            callback(mutations[i].target);
        }
    }).observe(ImagePanel.mainPanel, {
        childList: true, subtree: true,
        attributes: true, characterData: false
    });
}

for (let elt of Array.from(getAllImgEls)) {
    createAndAddAttribute(elt, 'download-name', getGimgDescription(elt));
}

let GIUtOST_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
if (REPLACE_IMG_DATA) {
    replaceImgData();
    observeDocument(replaceImgData);
}

if (GIUtOST_MutOb) {
    const GIUtOST_chgMon = new GIUtOST_MutOb(function (mutationSet) {
        mutationSet.forEach(function (mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) { // noinspection EqualityComparisonWithCoercionJS
                if (mutation.addedNodes[i].nodeType == 1)
                    GIUtOST_checkNode(mutation.addedNodes[i]);
            }
        });
    }); // attach chgMon to document.body
    const opts = {childList: true, subtree: true};
    GIUtOST_chgMon.observe(document.body, opts);
}
GIUtOST_checkNode(document.elements);

function getAllImgEls() {
    return qa('img.rg_ic.rg_i');
}

/**abbreviation for querySelectorAll()*/
function qa(selector) {
    let x = document.querySelectorAll(selector);
    return x ? x : null;
}

function q(selector) {
    let x = document.querySelector(selector);
    return x ? x : null;
}

// Google images
function GIUtOST_checkNode(els) {
    clickLoadMoreImages(els);
    // showFullImageSiteURL(els);

    // var picBoxes = qa('[pic-not-found]'); if(picBoxes.length <= 0) return;
    // for(var i=0; i<picBoxes.length; i++) picBoxes[i] = picBoxes[i].parentNode.parentNode;
    // document.getElementsByClassName("rg_bx rg_di rg_el ivg-i");
    // if (picBoxes.length > 0) deleteElements(picBoxes);
}

function getImageBlocks() {
    return qa('.rg_bx');
}

function showFullImageSiteURL(els) {
    //siteAnchors
    try {
        if (els === null) return;
        var as = els.querySelectorAll('div.Q7Rsec');
        // console.log("as.length:" +as.length);
        for (var i = 0; i < as.length; i++) {
            var a = as[i];
            var getLocation = function (href) {
                var l = document.createElement("a");
                l.href = href;
                return l.hostname;
            };

            // if(a.classList.contains("ShowFullImageSiteURL")) break;
            // if(a.href.match("/null")) {console.log("match with null");break;}
            var host = getLocation(as[1].href);

            // siteSearchAnchor
            var ssa = document.createElement('a');
            ssa.href = (GoogleImagesSearchURL + "site:" + (host));
            // console.log("as["+i+"]: " +a.href);
            // console.log(i+"Ssa.href: "+  ssa.href);
            ssa.innerHTML = "site search[" + host + "]";
            let span = document.createElement('span');
            span.appendChild(ssa);
            a.parentNode.appendChild(span);
            a.classList.add("ShowFullImageSiteURL");
        }
    } catch (Exception) {
    }
}

// working :)
function clickLoadMoreImages(els) {
    var el = document.getElementById("smb");
    if (!el) return;
    el.click();
    // if(debug)console.log("Load more images");
}


//[Google.com images]
function getDataElement(imgN) {
    return imgN.parentNode.nextSibling;
}

function getDataText(imgN) {
    let data = "Not a main image, No data text available";
    try {
        data = getDataElement(imgN).innerHTML;
    } catch (exception) {
    }
    //	console.log('Data text:', data);
    return data;
}

function getGimgDescription(imgN) {
    let txt = getDataText(imgN);
    let title = extractFromText(txt, "ru");
    let desc = extractFromText(txt, "s");
    return title + "_" + desc;
    // desc.length > 1 ? desc : title; // choosing one of them (prioratizing the description over the title)
}

function getGimgTitle(imgN) {
    return extractImgData(imgN, 'pt');
}

function getGimgRUrl(imgN) {
    return extractImgData(imgN, 'ru');
}

function getGimgDimensions(imgN) {
    return extractImgData(imgN, 'ow') + 'x' + extractImgData(imgN, 'oh');
}

function extractImgData(imgN, key) {
    return extractFromText(getDataText(imgN), key);
}

/** The fallback will be the value returned if no results were found. */
function extractFromText(txt, key, fallback) {
    let data = typeof fallback === undefined ? fallback : ("no image data found for key: '" + key + "'");
    let regex = new RegExp('(?<="' + key + '":")(.+?)(?=")');
    if (!txt) return data;
    let matches = txt.match(regex);
    data = (matches) ? matches[0] : data;
    return data;
}

if (false) window.onbeforeunload = function (e) { // on tab exit
    ublSites = new Set(ublSites, GM_getValue('unblocked sites of og images'));
    console.log('ublSites:', ublSites);
    GM_setValue('unblocked sites of og images', Array.from(ublSites));
    var message = "Saving unblocked sites (confirmation).", e = e || window.event;
    // For IE and Firefox
    if (e) {
        e.returnValue = message;
    }
    // For Safari
    return message;
};

// replaces the image description link text
function replaceImgData(dataEls) {
    if (typeof dataEls === 'undefined') return;
    dataEls.querySelectorAll('.rg_meta').forEach(function (dataEl) {
        if (dataEl.classList.contains('rg_meta-modified')) return;
        try {
            let dataText = dataEl.innerHTML;
            // console.log('modifying meta data text:', dataText);
            let siteUrl = extractFromText(dataText, 'ru');
            let description = extractFromText(dataText, 's');
            let subTitle = extractFromText(dataText, 'st');

            let imageAnchor = dataEl.previousSibling;
            createAndAddAttribute(imageAnchor, 'rg_meta_st', subTitle);
            createAndAddAttribute(imageAnchor, 'rg_meta_ru', siteUrl);

            let hostname = getHostname(siteUrl).replace('www.', '');
            let siteSearchUrl = GoogleImagesSearchURL + "site:" + encodeURIComponent(hostname);

            dataEl.innerHTML = dataEl.innerHTML
                .replace(subTitle, 'site search: ' + hostname) // replace SubTitle text with site HOSTNAME
                .replace(siteUrl, siteSearchUrl) // replace title lin with site siteSearch link
            // .replace(description, HOSTNAME)
            ;

            dataEl.classList.add('rg_meta-modified');
        } catch (exception) {
            console.error("Caught exception while changin rg_meta:", exception);
        }
    });
}

function makeImageDescriptionsClickable() {
    ImagePanel.mainPanel.forEach(function (panel) {
        var description = panel.querySelector('div.irc_b.i8152.irc_mmc > div.i30053 > div > div.irc_it > div.irc_hd > div[dir="ltr"] > font > font');
        description.addEventListener("click", function (e) {
            var search = gImgSearchUrl + this.innerHTML;
            window.open(search, "_blank");
        });
    });
}

unsafeWindow.extractImgData = extractImgData;
unsafeWindow.getGimgTitle = getGimgTitle;
unsafeWindow.getGimgRUrl = getGimgRUrl;
unsafeWindow.getGimgDescription = getGimgDescription;
unsafeWindow.reverseImgSearch = reverseImgSearch;

//[Google.com images]
unsafeWindow.saveUblSites = function () {
    storeSuccessfulUrlsSet();
    console.log('Site links of unblocked images "display-original-image"es:', Array.from(successfulUrlsSet));
};

function addToSet(mainSet, otherSet) {
    if (typeof mainSet === 'undefined' || typeof otherSet === 'undefined') return;
    try {
        // if(isIterable(otherSet) && isIterable(mainSet))
        otherSet.forEach(function (elt, i, a) {
            if (typeof elt === 'string') {
                mainSet.add(elt);
            }
        });
    } catch (exc) {
    }
    console.log('merged sets:', Array.from(mainSet));
    return mainSet;
}

function reverseImgSearch(imageUrl) {
    window.open("https://encrypted.google.com/searchbyimage?&image_url=" + imageUrl, "_blank");
}


/**Here's a vanilla js example to trigger any event:
 *
 <code> triggerEvent(targetElement, 'keyup', 13); // simulate mouse/enter key press</code>*/
function triggerEvent(el, type, keyCode) {
    // focus on the input element
    el.focus();
    if ('createEvent' in document) {
        // modern browsers, IE9+
        var e = document.createEvent('HTMLEvents');
        e.keyCode = keyCode;
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE 8
        var e = document.createEventObject();
        e.keyCode = keyCode;
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
}

/* Understanding Google Images
 ###Image Boxes:
 Image boxes are contained in one parent element with the selector: `div#rg_s`.
 Every image box contains an `img`, and a `div` containing the data.


 Attributes |Selector| Notes
 --- | --- | ---
 **img** |
 *ClassName =*| **nicely**

 ###The Image Panel:
 There is one big panel containing 3 sub-panels, you only get to see one sub-panel at a time.
 Moving to the next image will rotate the 3 sub-panels, and you will visit each one as they rotate.
 * Main panel selector: `#irc_cc`
 * Sub-panels contain a `data-ved` attribute, only the active one will have data, the other 2 will be `null`.
 * Active sub-panel selector:    `#irc_cc div.irc_t:not([data-ved="null"])`
 */
class ImageBox extends Element {
}//TODO:
class ImagePanel {
    constructor(element) {
        if (typeof element !== 'undefined') {
            this.element = element;
        }
        this.makeDescriptionClickable();
        // this.relatedImagesDiv = {divElement: this.element,}
    }

    makeDescriptionClickable() {
        this.descriptionEl.addEventListener("click", function (e) {
            const search = gImgSearchUrl + this.innerHTML;
            window.open(search, "_blank");
        });
    }

    get isFocused() {
        return "translate3d(0px, 0px, 0px)".test(this.getAttribute('style'));
    }

    static get mainPanel() {
        const mainPanelEl = q("#irc_cc");
        return mainPanelEl ? new ImagePanel(mainPanelEl) : false;
    }

    get titleAndDescriptionDiv() {
        this.element.querySelector('._cjj > .irc_it');
    }

    /**
     * @returns {ElementTagNameMap[] | Element}
     */
    get descriptionEl() {
        if (this.titleAndDescriptionDiv)
            this.titleAndDescriptionDiv.querySelector('div.irc_hd > div[dir="ltr"] > font > font, div.irc_hd > div[dir="ltr"]');
    }

    get titleEl() {
        if (this.titleAndDescriptionDiv)
            this.titleAndDescriptionDiv.querySelector('span ~ a');
    }

    get title() {
        return this.titleEl.innerHTML;
    }

    get subtitleEl() {
        if (this.titleAndDescriptionDiv)
            this.titleAndDescriptionDiv.querySelector('span a.irc_lth._ZR');
    }

    get subtitle() {
        return this.subtitleEl.innerHTML;
    }

    /**
     * returns that small square at the bottom right (the focused one)
     * @returns {ElementTagNameMap[string] | Element}
     */
    get focusedRelativeImage() {
        return this.element.querySelector('div.irc_rimask.irc_rist');
    }

    get imageUrl() {
        this.focusedRelativeImage.querySelector('a').href;
    }

    get image() {
        return this.element.querySelector('img#irc_mi,img.irc_mut');
    }

    /**
     * @returns {ElementTagNameMap[string] | Element} returns the panel that is currently in focus (there are 3 panels)
     */
    static get focusedPanel() {
        var p = this.mainPanel ? this.mainPanel.querySelector('div.irc_c[style*="translate3d(0px, 0px, 0px)"]') : null;
        console.log('mainPanel:', p);
        return p;
    }

    // TODO: getters:
    // description
    // title
    // subtitle
}

function mainPanel() {
    const mainPanelEl = q("#irc_cc");
    return mainPanelEl;
}

// hot-keys
let KeyEvent;
if (typeof KeyEvent === "undefined") {
    KeyEvent = {
        DOM_VK_SPACE: 32,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_A: 65,
        DOM_VK_D: 68,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_COMMA: 188,
        DOM_VK_DOT: 190,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD_LEFT: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD_RIGHT: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_NUMPAD_DIVIDE: 106,
        DOM_VK_NUMPAD_MULTIPLY: 111,
        DOM_VK_NUMPAD_ENTER: 113,
        DOM_VK_F5: 116
    };
}

function onkeydown(b) {
    const a = (window.event) ? b.keyCode : b.which;
    /** @type {{CTRL_ONLY: boolean, SHIFT_ONLY: boolean, ALT_ONLY: boolean, NONE: boolean}} */
    const ModifierKeys = {
        CTRL_ONLY: b.ctrlKey && !b.altKey && !b.shiftKey && !b.metaKey,
        SHIFT_ONLY: !b.ctrlKey && !b.altKey && b.shiftKey && !b.metaKey,
        ALT_ONLY: !b.ctrlKey && b.altKey && !b.shiftKey && !b.metaKey,
        NONE: !b.ctrlKey && !b.shiftKey && !b.altKey && !b.metaKey
    };
    // 	if(b.ctrlKey && a == KeyEvent.DOM_VK_S)
    // 	{
    // 		if(i)
    // 		{
    // 			a = protected_createElement("a");
    // 			a.href = i.src;
    // 			a.download = ""; // HTML5
    // 			document.body.appendChild(a);
    // 			a.click();
    // 			document.body.removeChild(a);
    // 		}
    // 		return;
    // 	}
    // 	if (b.altKey || b.metaKey || (b.ctrlKey && a != KeyEvent.DOM_VK_SPACE && a != KeyEvent.DOM_VK_F5 && a != KeyEvent.DOM_VK_R))
    // 	{
    // 		return;
    // 	}

    // 	var by = Math.round(window.innerHeight * 0.10);

    const panel = mainPanel().querySelector('div.irc_c[style*="translate3d(0px, 0px, 0px)"]'); //ImagePanel.focusedPanel; // the active panel
    if (!panel) {
        console.error("SUBPANEL NOT FOUND!!");
        return false;
    }
    const focusedRelatedImage = panel.querySelector('div.irc_rimask.irc_rist');//panel.focusedRelativeImage;

    const panelImage = panel.querySelector('img#irc_mi,img.irc_mut');
    /**
     * @type {any | NodeListOf<Element>}
     * 0 - Visit
     * 1 - Save
     * 2 - View saved
     * 3 - Share
     */
    const buttons = panel.querySelectorAll('.irc_but_r > tbody > tr a');

    const visitPageButton = buttons[0];
    const titleAndDescriptionDiv = panel.querySelector('._cjj > .irc_it');
    const titleEl = titleAndDescriptionDiv.querySelector('span ~ a');
    const subtitleEl = titleAndDescriptionDiv.querySelector('span a.irc_lth._ZR');

    log("titleAndDescriptionDiv:", titleAndDescriptionDiv);
    if (!titleEl) console.error("Title element not found");
    if (!subtitleEl) console.error("SubTitle element not found");
    const title = titleEl.innerHTML;
    // panel.querySelector('a._ZR.irc_hol.i3724.irc_lth');
    const subtitle = subtitleEl.innerHTML;

    // image drop-down panel:    #irc_bg
    /**Goes to the previous main image*/
    function previousImage() {
        // triggerEvent(q("#irc_bg"), "keyup", KeyEvent.DOM_VK_LEFT);
        q('#irc_la').click();
    }

    /**Goes to the next main image*/
    function nextImage() {
        // triggerEvent(q("#irc_bg"), "keyup", KeyEvent.DOM_VK_LEFT);
        q('#irc_ra').click();
    }

    function lookupTitle() {
        const extractedTitleSearchText = (title.length < subtitle.length ? subtitle : title); // use the longer title
        openInTab(GoogleReverseImagesSearchURL + extractedTitleSearchText);
    }

    function siteSearch() {
        const hostname = getHostname(subtitleEl.href);
        console.log('Site search:', hostname);
        openInTab(siteSearchUrl(getHostname(subtitleEl.href)));
    }

    switch (a) {
        // Search by image/ site search
        case KeyEvent.DOM_VK_V:
        case KeyEvent.DOM_VK_NUMPAD1:
            const focusedRelatedImageUrl = focusedRelatedImage.querySelector('a').href;
            console.log('currentPanelImage', focusedRelatedImageUrl);
            if (typeof panelImage !== "undefined") {
                reverseImgSearch(focusedRelatedImageUrl);
                log("focusedRelatedImageUrl:", focusedRelatedImageUrl);
            } else
                console.error('Image not found', focusedRelatedImageUrl);
            break;
        // TODO:
        case KeyEvent.DOM_VK_NUMPAD4:
            nextImage();
            break;
        case KeyEvent.DOM_VK_NUMPAD6:
            previousImage();
            break;
        // Open related images (press the bottom right square in the corner) in new tab
        case KeyEvent.DOM_VK_NUMPAD3:
            const moreRelatedImagesLink = q('.irc_rismo.irc_rimask a');
            if (typeof moreRelatedImagesLink !== 'undefined')
                openInTab(moreRelatedImagesLink.href);
            break;
        case KeyEvent.DOM_VK_NUMPAD5:
            if (ModifierKeys.NONE) {
                openInTab(focusedRelatedImage.querySelector('a').href);
            } else if (ModifierKeys.CTRL_ONLY) {
                download(focusedRelatedImage.querySelector('a').href, undefined, undefined, focusedRelatedImage);
            }
            break;
        // Previous related image
        case KeyEvent.DOM_VK_COMMA:
        case KeyEvent.DOM_VK_NUMPAD8:
            let previousElementSibling = focusedRelatedImage.previousElementSibling;
            (previousElementSibling) ?
                previousElementSibling.click() :
                previousImage();
            break;
        // Next related image
        case KeyEvent.DOM_VK_DOT:
        case KeyEvent.DOM_VK_NUMPAD2:
            let nextElementSibling = focusedRelatedImage.nextElementSibling;
            (nextElementSibling && !nextElementSibling.classList.contains('irc_rismo')) ?
                nextElementSibling.click() :
                nextImage();
            break;
        // lookup the images title.
        // Opens a new window with the search query as the image title
        case KeyEvent.DOM_VK_NUMPAD7:
            // I have options, I'll choose the best later
            const visitUrl = buttons[0].href;
            const visitTitleUrl = subtitleEl.href;

            console.log('Visit:', visitUrl);
            openInTab(visitUrl);
            break;
        //TODO: Search using title
        //TODO: Visit website/ GIMG Site.Search the website
        case KeyEvent.DOM_VK_NUMPAD9:
            if (ModifierKeys.NONE) {
                lookupTitle();
            } else if (ModifierKeys.CTRL_ONLY) { // site search
                siteSearch();
            }
            break;

        case KeyEvent.DOM_VK_S:
            siteSearch();
            break;
    }

}

function openInTab(url) {
    window.open(url, "_blank");
}

// data-cthref = /url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=2ahUKEwjW84KFwbzZAhUvT98KHX4fA6UQjB16BAgAEAU&url=http%3A%2F%2Frwby.wikia.com%2Fwiki%2FFile%3ATEAM_PAJAMA_RWBY!.jpg&psig=AOvVaw2HgCMglmhtGPN4QfLzDi4P&ust=1519491410121543



