// ==UserScript==
// @name TOC TouchButton
// @namespace Touchfriendly TOC Variant
// @match https://*.wordpress.com/*
// @version     0.8
// @description Add Touchfriendly TOC and next and previous link variant
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/380633/TOC%20TouchButton.user.js
// @updateURL https://update.greasyfork.org/scripts/380633/TOC%20TouchButton.meta.js
// ==/UserScript==

//Known Bug: look for a way to detect readerview/android page reload
//      onreload with active reader view(firefox) -> loads original version with longText link


const SELECTORTOC = 'p > a';
const MEDIAQUERYMAXWIDTH = '480px';

const DEFAULTSHORTTOC = "ToC";
const DEFAULTSHORTPREV = "-1←";
const DEFAULTSHORTNEXT = "→+1";
/**
 * Setting to Pair ["Longtext", "ShortText"]
 * ShortText will be shown as button
 * @param {String} LongText longer String which should be replaced
 * @param {Array} ShortText replacement for longText
 */
const LINKVARIANTS = [
    {
        "shortVersion": DEFAULTSHORTTOC,
        "longVariants": ["Table of Contents", "Index", "ToC"]
    },
    {
        "shortVersion": DEFAULTSHORTPREV,
        "longVariants": ["Previous Chapter", "Prev", "<- Previous Chapter"]
    },
    {
        "shortVersion": DEFAULTSHORTNEXT,
        "longVariants": ["Next Chapter", "Next", "Next Chapter -&gt;"]
    }];
//"<- Previous Chapter" or "&lt;- Previous Chapter" possible
//"Next Chapter ->"    same as before

// ↥ front UI ↥ for adjustment for different sites copy script and adjust SELECTORTOC and LINKVARIANTS and metas(@match, @namespace)
// ↧ script ↧
var nodesArray = [];

function readCssStyle(element, attribute) {
    let style = window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle;
    return style[attribute]
}

/**
 * toggle Hidden attributes depending on css value (set by mediaquery)
 * 
 * without active javascript attribute toggling ->  the longT Version would get read by Firefox Reader View and maybe other readability plugins
 */
function checkHidden() {
    let shortT = document.querySelectorAll('.shortTOC');
    let longT = document.querySelectorAll('.longTOC');

    //console.log("checkHidden","checkHidden shortT length: "+shortT.length +" # "+ readStyle(shortT[0],"display") );
    //http://john.foliot.ca/aria-hidden/
    for (var i = 0; i < shortT.length; i++) {
        //console.log("checkHidden","checkHidden shortT setAttribute aria-hidden + " + i);
        if (readCssStyle(shortT[i], "display") === "none") {
            //console.log("checkHidden","checkHidden shortT setAttribute aria-hidden display none");
            shortT[i].setAttribute('aria-hidden', 'true');
            shortT[i].setAttribute('hidden', "true");
            shortT[i].setAttribute('role', 'presentation');
        }
        else if (readCssStyle(shortT[i], "display") == "inline-block") {
            shortT[i].setAttribute('aria-hidden', 'false')
            shortT[i].removeAttribute('role');
            shortT[i].removeAttribute('hidden');
        }

    }
    for (let i = 0; i < longT.length; i++) {
        if (readCssStyle(longT[i], "display") == "none") {
            longT[i].setAttribute('aria-hidden', 'true');
            longT[i].setAttribute('hidden', "true");
            longT[i].setAttribute('role', 'presentation');
        }
        else if (readCssStyle(longT[i], "display") == "inline-block") {
            longT[i].setAttribute('aria-hidden', 'false')
            longT[i].removeAttribute('role');
            longT[i].removeAttribute('hidden');
        }
    }
}


//https://stackoverflow.com/questions/23683439/gm-addstyle-equivalent-in-tampermonkey
function addGlobalStyle(css) {
    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//https://stackoverflow.com/questions/1686571/greasemonkey-how-to-apply-a-css-rule-only-for-media-print
//https://stackoverflow.com/questions/8624210/getting-jquery-and-gm-addstyle-to-work-in-a-chrome-userscript-based-off-of-a-wor
//multiline for better readability add at end of line -> \
//https://stackoverflow.com/questions/23608346/how-to-style-a-div-like-the-button-element
addGlobalStyle('\
.shortTOC{  display:none;visiblity:hidden;}\
.longTOC{ display:inline-block;visiblity:visible;} \
@media (max-width: '+ MEDIAQUERYMAXWIDTH + ') { \
    .shortTOC { display: inline-block;visiblity:visible;\
        width: 23%;\
        text-align: center;\
        line-height:3.5em;\
        font-size:6vw;\
        -ms-touch-action: manipulation;\
        touch-action: manipulation;\
        cursor: pointer;\
        -webkit-user-select: none;\
        -moz-user-select: none;\
        -ms-user-select: none;\
        user-select: none;\
        background-image: none;\
        border: 1px solid transparent;\
        border-radius: 4px;\
        border-color: #ccc;\
    }\
     .longTOC { display:none;visiblity:hidden;}\
 }\
 ');

/**
 * results has only Nodes which match filterString
 * @param {Array} Nodes 
 * @param {String} filterString 
 */
function getNodes(Nodes, filterString) {
    //filter both HTML entity character and pure text
    //innerHTML:characters as is (example %nbsp; kept as space) ; textContent: example &nbsp; converted to space character
    let TOCFilter = Nodes.filter(e => (e.innerHTML == filterString || e.textContent == filterString));
    /*
    let TOCNodes = TOCFilter.map((e, i) => {
        //console.log("elementcontent: " +e + " at index: "+i +" nodeValueOuterhtml: " + e.outerHTML + " nodeValueinnerhtml: " + e.innerHTML );        
        return e
    });
    */
    return TOCFilter
}
/**
 * add custom classes to link text
 * @param {array} Nodes linkarray
 * @param {string} shortText 
 */
function setClasses(Nodes, shortText) {
    Nodes.forEach(element => {
        let TOCButton = document.createElement("a")
        TOCButton.href = element;
        TOCButton.setAttribute("class", "shortTOC")
        TOCButton.textContent = shortText
        element.setAttribute("class", "longTOC")
        element.parentNode.insertBefore(TOCButton, element.nextSibling);
    });
}
/**
 * Compare long link text and replace with shortText version
 * @param {Array} nodes link array 
 * @param {String} longText longer String which should be replaced and is used as filter for the linkarray
 * @param {String} shortText replacement for longText
 */
function addTouchfriendlyVariant(nodes, longText, shortText) {
    let TOCNodes = getNodes(nodes, longText)
    setClasses(TOCNodes, shortText);
    //console.log('Toc element: ' + TOCNodes);
}


function main() {
    let getSelectedLinks = function () {
        let links = Array.from(
            document.querySelectorAll(SELECTORTOC)
        );

        return links;
    };
    const links = getSelectedLinks();

    /*
    addTouchfriendlyVariant(links, "Table of Contents", "ToC");
    addTouchfriendlyVariant(links, "Previous Chapter", "-1←");
    addTouchfriendlyVariant(links, "Next Chapter", '→+1');
    */

    LINKVARIANTS.forEach(key => {
        key.longVariants.forEach(variant => {
            //console.log("LINKVARIANTS: " + key.shortVersion + " # " + variant);
            addTouchfriendlyVariant(links, variant, key.shortVersion);
        });
    });


}
main()

//https://www.sitepoint.com/jquery-document-ready-plain-javascript/
var callback = function () {
    // Handler when the DOM is fully loaded
    checkHidden();
};

//https://stackoverflow.com/questions/2720658/how-to-detect-when-a-tab-is-focused-or-not-in-chrome-with-javascript
var focusCheckCallback = function () {
    //console.log("onvisibilityState reaction: " + document.visibilityState);
    if (document.visibilityState == "visible") //hidden -> readerview rebuild?
        checkHidden();
}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    callback();
} else {
    document.addEventListener("DOMContentLoaded", callback);
}

window.addEventListener("resize", function () {
    checkHidden();
});
window.addEventListener("visibilitychange", focusCheckCallback);
//window.addEventListener("blur",focusCheckCallback);