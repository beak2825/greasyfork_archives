// ==UserScript==
// @name         Bible.by site copy change
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  Смена копирования текстов на сайте bible.by: Быт 1:1 В начале...
// @author       You
// @match        https://bible.by/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bible.by
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498901/Bibleby%20site%20copy%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/498901/Bibleby%20site%20copy%20change.meta.js
// ==/UserScript==
//  need to include this in any place of page
//<script>
// copyMode = 1 // 0 - old style, 1 - text descr before texts, 2 - after texts
// copyAddQuotes = false // use quotas for text or not
// copyIncludeLink = true  // include link to site, affects only mode 1 or 2. To support for mode 0, change var a = n + " " + l with next commented line
//</script>

const copyMode = 1
const copyAddQuotes = false
const copyIncludeLink = true


function findParentDivWithId(node) {
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.hasAttribute('id')) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}

function processSelectedSections() {
    // const bookLink = document.querySelector('#prev_page').nextElementSibling;
    const bookLink = document.querySelector('a[data-target="#bbook"]');
    const book = bookLink.querySelector('span').textContent;
    const chapter = bookLink.nextElementSibling.textContent.match(/^\d+/)[0];


    const linkCanonical = document.querySelector('meta[property="og:url"]');
    const url = linkCanonical.getAttribute('content');

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    // console.log("range=" + range);
    // console.log("range.startOffset=" + range.startOffset);
    // console.log("range.endOffset=" + range.endOffset);
    const startContainer = findParentDivWithId(range.startContainer);
    const endContainer = findParentDivWithId(range.endContainer);

    let startNode = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentNode : startContainer;
    let endNode = endContainer.nodeType === Node.TEXT_NODE ? endContainer.parentNode : endContainer;
    // console.log("startContainer=" + startContainer);
    // console.log("endContainer=" + endContainer);
    // console.log("startType=" + startContainer.nodeType);
    // console.log("endType=" + endContainer.nodeType);
    // console.log("startContainer=" + startContainer.textContent);
    // console.log("endContainer=" + endContainer.textContent);
    // console.log("startNode=" + startNode.textContent);
    // console.log("endNode=" + endNode.textContent);
    // console.log("startContainer.nodeType=" + startContainer.nodeType);

    const allSelectedNodes = [];

    // Collect all selected nodes
    let currentNode = startNode;
    while (currentNode) {

        allSelectedNodes.push(currentNode);
        // console.log("push(" + currentNode.textContent + ")" + currentNode.textContent.length);

        if (currentNode === endNode) break;
        currentNode = currentNode.nextElementSibling;
    }
    // console.log("allSelectedNodes=~" + allSelectedNodes.join(",") + "~");

    // Extract text and ids from selected nodes
    let startId = parseInt(allSelectedNodes[0].id)
    let endId = parseInt(allSelectedNodes[allSelectedNodes.length - 1].id);
    const texts = allSelectedNodes.map((node, index) => {
        const clonedNode = node.cloneNode(true);
        clonedNode.querySelectorAll('sup').forEach(sup => sup.remove());

        let nodeText = clonedNode.textContent;
        // console.log("ooo:", index, nodeText.length, range.endOffset, nodeText);
        // end of previous text selected, which is really not selected chars (but something selected in DOM), need to skip it
        if ((index === 0) && (nodeText.length === range.startOffset)) {
            startId++
            startNode = startNode.nextSibling
            return ""
        }
        //the same for last selected text, if not real chars selected (may be only text number), omit this text
        if ((index === allSelectedNodes.length - 1) && (range.endOffset < 3)) {
            endId--
            endNode = endNode.previousSibling
            return ""
        }

        const nodeTextLength = nodeText.length
        if (node === endNode && range.endContainer.nodeType === Node.TEXT_NODE) {
            nodeText = nodeText.slice(0, range.endOffset);
        }
        //part of text selected, need to slice node text. Next we will add '...' before
        if (node === startNode && range.startContainer.nodeType === Node.TEXT_NODE) {
            nodeText = nodeText.slice(range.startOffset);
        }

        nodeText = nodeText.trim()
        if (node === startNode && range.startOffset > 1) {
            nodeText = '...' + nodeText;
        }
        if (node === endNode && range.endOffset < nodeTextLength) {
            nodeText += '...';
        }

        return nodeText.trim();
    });
    const textNumbers = startId === endId ? `${startId}` : `${startId}-${endId}`
    let combinedText = texts.join(' ').trim();
    combinedText = copyAddQuotes ? `"${combinedText}"`: combinedText;
    const linkToSite = copyIncludeLink ? `<br><br>Библия - <a href='${url}#${startId}'>${url}#${startId}</a><br>` : ``

    const textFrom = `${book} ${chapter}:${textNumbers}`
    let finalText = ""
    if (copyMode===1){
        finalText = `${textFrom}: ${combinedText}${linkToSite}`
    }else if (copyMode===2){
        finalText = `${combinedText} ${textFrom}${linkToSite}`
    }else{
        throw 'undefined copy mode, should be 1 or 2'
    }
    // console.log(finalText, startId, endId, textNumbers, startId === endId, startId == endId);
    return finalText
}

jQuery( document ).ready( function( $ )
    {
    function addLink(){
        var e = document.getElementsByTagName("body")[0]
          , n = "";
        if ("undefined" != typeof window.getSelection) {
            var t = window.getSelection();
            if (t.rangeCount) {
                for (var o = document.createElement("div"), i = 0, r = t.rangeCount; r > i; ++i)
                    o.appendChild(t.getRangeAt(i).cloneContents());
                n = o.innerHTML
            }
            if (!(n.toString().split(" ").length < 7)) {
                var l = "<br>" + document.title + ": <a href='" + document.location.href + "'>" + document.location.href + "</a>"
                var a = n + " " + l

                // modification start
                // to be able to use settings for old style mode, replace previous line with following:
                // var a = n + " " + (typeof copyIncludeLink === 'undefined' || copyIncludeLink ? l : '');
                try{
                    //check settings, if undefined, set it
                    typeof copyMode === 'undefined' && (copyMode = 1);
                    typeof copyAddQuotes === 'undefined' && (copyAddQuotes = false);
                    typeof copyIncludeLink === 'undefined' && (copyIncludeLink = true);
                    if (copyMode !==0) {
                        a = processSelectedSections()
                    }
                }catch (e){
                    // console.log("use old style copy method because of error:",e)
                }
                //modification end

                var d = document.createElement("div");
                d.style.position = "absolute",
                d.style.left = "-99999px",
                e.appendChild(d),
                d.innerHTML = a,
                t.selectAllChildren(d),
                window.setTimeout(function() {
                    e.removeChild(d)
                }, 0)
            }
        }

    }
document.oncopy = addLink;
} );