// ==UserScript==
// @name         All Night BBCode
// @version      0.4
// @description  Fix broken BBCode on the All Night Laundry comic
// @author       AjaxGb
// @match        http*://www.all-night-laundry.com/post/*
// @icon         http://www.all-night-laundry.com/static/favicon.ico
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/85711
// @downloadURL https://update.greasyfork.org/scripts/426837/All%20Night%20BBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/426837/All%20Night%20BBCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.ui-widget-content .quote { border-color: rgb(210, 210, 210); }');

    const origMSPAFontSizePx = 13;
    
    const decoder = new TextDecoder('utf-8');
    const u8arrays = {
        2: new Uint8Array(2),
        3: new Uint8Array(3),
    };

    function walkNodes(walker, {addToNode, addToName}) {
        for (let node = walker.currentNode; node;) {
            let newAddTo = null;
            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                {
                    if (walker.firstChild()) {
                        walkNodes(walker, {});
                        walker.parentNode();
                    }
                    break;
                }
                case Node.TEXT_NODE:
                {
                    node.data = node.data.replace(/[\xc0-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}/g, text => {
                        const array = u8arrays[text.length];
                        for (let i = text.length - 1; i >= 0; i--) {
                            array[i] = text.codePointAt(i);
                        }
                        return decoder.decode(array);
                    });

                    const tagMatch = node.data.match(/\[strike\]|\[size=(\d+)\]|\[quote=([^;\]]+);\d+\]|\[\/(strike|size|quote)\]/i);
                    if (tagMatch) {
                        const [tagTextI, sizePxText, quoteName, endTagI] = tagMatch;
                        const tagTextNode = node.splitText(tagMatch.index);
                        const nextTextNode = tagTextNode.splitText(tagTextI.length);
                        //  node  tagTextNode nextTextNode
                        // "blah"   "[tag]"   "blah"

                        if (endTagI) {
                            const endTag = endTagI.toLowerCase();
                            if (addToName !== endTag) {
                                throw new Error(`Closed [${endTag}] tag when no such tag available`);
                            }
                            tagTextNode.replaceWith(nextTextNode);
                            if (addToNode) {
                                addToNode.append(node);
                            }
                            return;
                        } else {
                            const tagText = tagTextI.toLowerCase();
                            let walkArgs;

                            if (tagText.startsWith('[strike')) {
                                const strike = document.createElement('s');
                                tagTextNode.replaceWith(strike);

                                walkArgs = {addToNode: strike, addToName: 'strike'};

                            } else if (tagText.startsWith('[size=')) {
                                const sizePx = parseInt(sizePxText);
                                const span = document.createElement('span');
                                const currFontSize = tagTextNode.parentElement.computedStyleMap().get('font-size');
                                if (currFontSize.unit !== 'px') {
                                    throw new Error('computedStyleMap() font-size was not px: '+currFontSize.unit);
                                }
                                span.style.fontSize = `${Math.round(currFontSize.value * sizePx / origMSPAFontSizePx)}px`;
                                tagTextNode.replaceWith(span);

                                walkArgs = {addToNode: span, addToName: 'size'};

                            } else if (tagText.startsWith('[quote=')) {
                                const quoteBlock = document.createElement('div');
                                quoteBlock.className = 'quote';
                                const quoteTitle = document.createElement('span');
                                quoteTitle.className = 'quote_author';
                                const quoteStrong = document.createElement('strong');
                                quoteStrong.append(quoteName);
                                quoteTitle.append(quoteStrong);
                                quoteBlock.append(quoteTitle);
                                quoteBlock.append(document.createElement('br'));
                                tagTextNode.replaceWith(quoteBlock);

                                walkArgs = {addToNode: quoteBlock, addToName: 'quote'};
                            }

                            walker.currentNode = nextTextNode;
                            walkNodes(walker, walkArgs);
                            walker.currentNode = node;
                        }
                    }
                    break;
                }
            }
            const oldNode = node;
            node = walker.nextSibling();
            if (addToNode) {
                addToNode.append(oldNode);
            }
        }
        if (addToNode) {
            throw new Error(`Unclosed [${addToName}] tag`);
        }
    }

    const whatToWalk = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT;
    function fixBBCode(element) {
        const walker = document.createTreeWalker(element, whatToWalk);
        if (walker.firstChild()) {
            walkNodes(walker, {});
        }
    }

    fixBBCode(document.getElementById('main_content'));
    const authorNotes = document.getElementById('notes');
    if (authorNotes) {
        fixBBCode(authorNotes);
    }
})();
