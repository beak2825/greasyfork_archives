// ==UserScript==
// @name        Straight2ThePoint
// @description Scroll web page to the sentence shown in search engine results.
// @version     0.2.21
// @author      Burn
// @namespace   https://openuserjs.org/users/burn
// @copyright   2022, burn (https://openuserjs.org/users/burn)
// @include     https://*
// @match       https://*
// @license     MIT
// @require  	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @run-at      document-end
// @grant    	GM_getValue
// @grant    	GM_setValue
// @grant    	GM_deleteValue
// @grant    	GM.getValue
// @grant    	GM.setValue
// @grant       GM.deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453384/Straight2ThePoint.user.js
// @updateURL https://update.greasyfork.org/scripts/453384/Straight2ThePoint.meta.js
// ==/UserScript==

(async function(W) {
    const DBG = false;

    let storeName = GM_info.script.name,
    myLog = (msg) => {
        DBG && console.log(storeName + " | " + msg);
    },
    qS = (el, scope) => {
        scope = (scope instanceof HTMLElement) ? scope : document;
        return scope.querySelector(el) || false;
    },
    qSall = (els, scope) => {
        scope = (scope instanceof HTMLElement) ? scope : document;
        return scope.querySelectorAll(els) || false;
    },
    openedPage = {
        title    : "",
        url      : "",
        sentence : ""
    },
    setGmValue = (name, val) => {
        myLog('setting Value');
        GM.setValue(name, JSON.stringify(val));
    },
    getGmValue = async (name, def) => {
        def = def || '{}';
        let tmpOut = await GM.getValue(name, def);
        myLog("getting Value");
        return JSON.parse(tmpOut);
    },
    isSearchResultsPage = () => {
        if (/^https:\/\/[^\.]+\.google\.[a-z]{2,3}\/search\?q=/i.exec(location.href))
            return true;
        else return false;
    },
    linksElements = false,
    prepareSnippetSearch = (sentence) => {
        myLog("preparing search");
        sentence = sentence.toString();
        let snippets = sentence.split(/\.\s|\s\.\.\.\s?/g);
        snippets.filter(el => (el !== "" && el.length > 3)).forEach(searchSnippet);
        GM.deleteValue(storeName);
    },
    searchSnippet = (snippet) => {
        snippet = snippet.trim();
        myLog("now searching for " + snippet);
        ((a, b) => {
            if (W.find) {
                while (W.find(a)) {
                    let rng = W.getSelection().getRangeAt(0);
                    rng.deleteContents();
                    let newNode = document.createElement("mark");
                    newNode.setAttribute("class","straight-to-this-point");
                    newNode.appendChild(document.createTextNode(snippet));
                    rng.insertNode(newNode);
                    myLog("after highlighting snippet with mark");
                }
                W.getSelection().removeAllRanges();
            } else if (document.body.createTextRange) {
                let rng=document.body.createTextRange();
                while (rng.findText(a))
                    rng.pasteHTML(b);
                myLog("after calling pasteHTML");
            }
        })(snippet, '<mark class="straight-to-this-point">' + snippet + '</mark>');
    },
    setClickListener = (el) => {
        el.addEventListener("click", () => {
            let child = Object.create(openedPage),
                tmpUrl = "";
            if (el.href.indexOf("&url=") >= 0) {
                tmpUrl = decodeURIComponent((el.href.split("&url=")[1]));
            } else tmpUrl = el.href;
            child.url = tmpUrl.replace(/&usg=[\w\-]+$/i, "");
            myLog("url: " + child.url);
            child.title = qS("h3", el).innerText;
            myLog("title: " + child.title);
            let sentence = qS(
                "div:last-child span ~ span",
                el.parentNode.parentNode.nextSibling).innerText;
            if (undefined === sentence) {
                sentence = qS(
                    "div:last-child span:last-child",
                    el.parentNode.parentNode.nextSibling).innerText;
            }
            if (undefined === sentence) {
                sentence = qS("div:last-child span:last-child",
                    el.parentNode.parentNode.nextSibling.nextSibling).innerText;
            }
            child.sentence = sentence;
            myLog("child.sentence: " + child.sentence);
            setGmValue(storeName, child);
        });
    };

    let valStored = await getGmValue(storeName);
    let child;

    if (isSearchResultsPage()) {
        myLog("found search results page, now looking for links");
        if (false !== (linksElements = qSall('#search #rso div div div div div a:first-child'))) {
            myLog("found " + linksElements.length + " links, now adding click listener");
            linksElements.forEach(setClickListener);
        }
    } else {
        myLog("Found target page, now looking for stored sentence info");
        if (undefined !== valStored.title) {
            myLog("found stored sentence object: " + JSON.stringify(valStored));
            prepareSnippetSearch(valStored.sentence);
        }
    }
})(window || unsafeWindow);
