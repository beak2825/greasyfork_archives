// ==UserScript==
// @name         htmlToMarkdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert selected html to markdown, then copy it to clipboard.
// @author       You
// @match        https://stackoverflow.com/questions/42800590/tampermonkey-right-click-menu
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @include      *
// @grant        GM_openInTab
// @require https://greasyfork.org/scripts/432248-tomarkdown/code/toMarkdown.js?version=969689
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/432249/htmlToMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/432249/htmlToMarkdown.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // GM_openInTab("https://website.net");

    var pandoc = [
        {
            filter: 'h1',
            replacement: function (content, node) {
                var underline = Array(content.length + 1).join('=');
                return '\n\n' + content + '\n' + underline + '\n\n';
            }
        },

        {
            filter: 'h2',
            replacement: function (content, node) {
                var underline = Array(content.length + 1).join('-');
                return '\n\n' + content + '\n' + underline + '\n\n';
            }
        },

        {
            filter: 'sup',
            replacement: function (content) {
                return '^' + content + '^';
            }
        },

        {
            filter: 'sub',
            replacement: function (content) {
                return '~' + content + '~';
            }
        },

        {
            filter: 'br',
            replacement: function () {
                return '\\\n';
            }
        },

        {
            filter: 'hr',
            replacement: function () {
                return '\n\n* * * * *\n\n';
            }
        },

        {
            filter: ['em', 'i', 'cite', 'var'],
            replacement: function (content) {
                return '*' + content + '*';
            }
        },

        {
            filter: function (node) {
                var hasSiblings = node.previousSibling || node.nextSibling;
                var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;
                var isCodeElem = node.nodeName === 'CODE' ||
                    node.nodeName === 'KBD' ||
                    node.nodeName === 'SAMP' ||
                    node.nodeName === 'TT';

                return isCodeElem && !isCodeBlock;
            },
            replacement: function (content) {
                return '`' + content + '`';
            }
        },

        {
            filter: function (node) {
                return node.nodeName === 'A' && node.getAttribute('href');
            },
            replacement: function (content, node) {
                var url = node.getAttribute('href');
                var titlePart = node.title ? ' "' + node.title + '"' : '';
                if (content === url) {
                    return '<' + url + '>';
                } else if (url === ('mailto:' + content)) {
                    return '<' + content + '>';
                } else {
                    return '[' + content + '](' + url + titlePart + ')';
                }
            }
        },

        {
            filter: 'li',
            replacement: function (content, node) {
                content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
                var prefix = '-   ';
                var parent = node.parentNode;

                if (/ol/i.test(parent.nodeName)) {
                    var index = Array.prototype.indexOf.call(parent.children, node) + 1;
                    prefix = index + '. ';
                    while (prefix.length < 4) {
                        prefix += ' ';
                    }
                }

                return prefix + content;
            }
        }
    ];

    // http://pandoc.org/README.html#smart-punctuation
    var escape = function (str) {
        return str.replace(/[\u2018\u2019\u00b4]/g, "'")
            .replace(/[\u201c\u201d\u2033]/g, '"')
            .replace(/[\u2212\u2022\u00b7\u25aa]/g, '-')
            .replace(/[\u2013\u2015]/g, '--')
            .replace(/\u2014/g, '---')
            .replace(/\u2026/g, '...')
            .replace(/[ ]+\n/g, '\n')
            .replace(/\s*\\\n/g, '\\\n')
            .replace(/\s*\\\n\s*\\\n/g, '\n\n')
            .replace(/\s*\\\n\n/g, '\n\n')
            .replace(/\n-\n/g, '\n')
            .replace(/\n\n\s*\\\n/g, '\n\n')
            .replace(/\n\n\n*/g, '\n\n')
            .replace(/[ ]+$/gm, '')
            .replace(/^\s+|[\s\\]+$/g, '');
    };

    var convert = function (str) {
        return escape(toMarkdown(str, { converters: pandoc, gfm: true }));
    }

    function getHTMLOfSelection () {
        var range;
        if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            return range.htmlText;
        }
        else if (window.getSelection) {
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
                var clonedSelection = range.cloneContents();
                var div = document.createElement('div');
                div.appendChild(clonedSelection);
                return div.innerHTML;
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }

    var selectText = getHTMLOfSelection()
    var markdownText = convert(selectText)

    navigator.clipboard.writeText(markdownText).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });

})();