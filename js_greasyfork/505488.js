// ==UserScript==
// @name         emoji2emoticon
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Replace emojis with traditional text emoticons
// @author       huberatelier
// @match        *://*/*
// @icon         https://github.com/huberatelier/huberatelierThemes/blob/main/emoji2emoticon/lolicon.png?raw=true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505488/emoji2emoticon.user.js
// @updateURL https://update.greasyfork.org/scripts/505488/emoji2emoticon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const emojers = {
        '😀': ' :D ',
        '😃': ' =D ',
        '😄': ' ^_^ ',
        '😁': ' ^_^V ',
        '😆': ' xD ',
        '😅': ' ^_^\' ',
        '😂': ' LOL ',
        '🙂': ' :) ',
        '🙃': ' (: ',
        '😉': ' ;) ',
        '😊': ' ^_^ ',
        '😇': ' O:-) ',
        '😍': ' <3 ',
        '😘': ' :-* ',
        '😗': ' :-* ',
        '☺️': ' ^_^ ',
        '😚': ' :-* ',
        '😙': ' ;-* ',
        '😋': ' :p ',
        '😛': ' :P ',
        '😜': ' ;P ',
        '😝': ' :p ',
        '🤑': ' $.$ ',
        '🤗': ' \\(^_^)/ ',
        '🤔': ' :-? ',
        '🤐': ' :-X ',
        '😐': ' :| ',
        '😑': ' :| ',
        '😶': ' : ',
        '😏': ' ¬‿¬ ',
        '😒': ' ¬⁔¬ ',
        '🙄': ' -_- ',
        '😬': ' :E ',
        '😌': ' ^_^\' ',
        '😔': ' :\\ ',
        '😪': ' |-O ',
        '😴': ' (-O-) ',
        '😷': ' :() ',
        '🤒': ' :###.. ',
        '🤕': ' @_@ ',
        '😵': ' %) ',
        '😎': ' B) ',
        '🤓': ' 8) ',
        '😕': ' :/ ',
        '😟': ' D: ',
        '🙁': ' :( ',
        '☹️': ' :C ',
        '😮': ' :o ',
        '😯': ' :o ',
        '😲': ' :o ',
        '😳': ' ://) ',
        '😦': ' :(',
        '😧': ' D: ',
        '😨': ' D: ',
        '😰': ' D: ',
        '😥': ' ^_^\' ',
        '😢': ' T_T ',
        '😭': ' T_T ',
        '😱': ' :-o ',
        '😖': ' ://{ ',
        '😣': ' >_< ',
        '😞': ' ://( ',
        '😓': ' ^_^\' ',
        '😩': ' D; ',
        '😫': ' 囧 ',
        '😤': ' >_< ',
        '😡': ' >_< ',
        '😠': ' >_< ',
        '😈': ' >:D ',
        '👿': ' >:( ',
        '💀': ' 8-X '
    };

    const emojiregex = new RegExp(Object.keys(emojers).join('|'), 'g');

    function replacetext(node) {
        const original = node.nodeValue;
        const replaced = original.replace(emojiregex, match => emojers[match]);
        if (replaced !== original) {
            node.nodeValue = replaced;
        }
    }

    function replaceall() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];

        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }

        nodes.forEach(replacetext);
    }

    window.addEventListener('load', replaceall);

    const observer = new MutationObserver(() => {
        clearTimeout(observer.timeout);
        observer.timeout = setTimeout(replaceall, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
