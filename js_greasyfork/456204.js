// ==UserScript==
// @name         chatGPT Markdown
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Save the chatGPT Q&A content as a markdown text
// @author       TripleTre
// @match        https://chat.openai.com/chat
// @icon         https://chat.openai.com/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456204/chatGPT%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/456204/chatGPT%20Markdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function toMarkdown() {
        var main = document.querySelector("main");
        var article = main.querySelector("div > div > div > div");
        var chatBlocks = Array.from(article.children)
            .filter(v => v.getAttribute("class").indexOf("border") >= 0);

        var replacements = [
            [/\*/g, '\\*', 'asterisks'],
            [/#/g, '\\#', 'number signs'],
            [/\//g, '\\/', 'slashes'],
            [/\(/g, '\\(', 'parentheses'],
            [/\)/g, '\\)', 'parentheses'],
            [/\[/g, '\\[', 'square brackets'],
            [/\]/g, '\\]', 'square brackets'],
            [/</g, '&lt;', 'angle brackets'],
            [/>/g, '&gt;', 'angle brackets'],
            [/_/g, '\\_', 'underscores'],
            [/`/g, '\\`', 'codeblocks']
        ];

        function markdownEscape(string, skips) {
            skips = skips || []
            return replacements.reduce(function (string, replacement) {
                var name = replacement[2]
                return name && skips.indexOf(name) !== -1
                    ? string
                    : string.replace(replacement[0], replacement[1])
            }, string)
        }

        function replaceInnerNode(element) {
            if (element.outerHTML) {
                var parser = new DOMParser();
                var nextDomString = element.outerHTML.replace(/<code>([\w\s-]*)<\/code>/g, (match) => {
                    var doc = parser.parseFromString(match, "text/html");
                    return "`" + "doc.body.textContent" + "`";
                });
                return parser.parseFromString(nextDomString, "text/html").body.children[0];
            }
            return element;
        }

        var elementMap = {
            "P": function (element, result) {
                var p = replaceInnerNode(element);
                result += markdownEscape(p.textContent, ["codeblocks", "number signs"]);
                result += `\n\n`;
                return result;
            },
            "OL": function (element, result) {
                var ol = replaceInnerNode(element);
                var olStart = parseInt(ol.getAttribute("start") || "1");
                Array.from(ol.querySelectorAll("li")).forEach((li, index) => {
                    result += `${index + olStart}. ${markdownEscape(li.textContent, ["codeblocks", "number signs"])}`;
                    result += `\n`;
                });
                result += `\n\n`;
                return result;
            },
            "PRE": function (element, result) {
                var codeBlocks = Array.from(element.querySelectorAll("code"));
                var languageMarkedBlock = codeBlocks.find(v => /language-(\w+)/.test(v.getAttribute("class") || ""));
                var languageMark = languageMarkedBlock.getAttribute("class").match(/language-(\w+)/)[1] || "";
                result += "```" + languageMark + "\n";
                codeBlocks.forEach(block => {
                    result += `${block.textContent}`;
                });
                result += "```\n";
                result += `\n\n`;
                return result;
            }
        };
        var TEXT_BLOCKS = Object.keys(elementMap);

        var mdContent = chatBlocks.reduce((result, nextBlock, i) => {
            if (i % 2 === 0) { // title
                result += `## ${markdownEscape(nextBlock.textContent, ["codeblocks", "number signs"])}`;
                result += `\n\n`;
            } else {
                var iterator = document.createNodeIterator(
                    nextBlock,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode: element => TEXT_BLOCKS.indexOf(element.tagName.toUpperCase()) >= 0
                    },
                    false,
                );
                let next = iterator.nextNode();
                while (next) {
                    result = elementMap[next.tagName.toUpperCase()](next, result);
                    next = iterator.nextNode();
                }
            }
            return result;
        }, "");
        return mdContent;
    }

    var copyHtml = `<div id="__copy__" style="z-index:9999999;cursor:pointer;position: fixed;top: 20px;right: 20px;width: 60px;height: 60px;background: #8bc34a;/* border: 1px solid #8bc34a; */border-radius: 50%;color: white;display: flex;justify-content: center;align-items: center;"><span>copy</span></div>`;
    var copyElement = document.createElement("div");
    document.body.appendChild(copyElement);
    copyElement.outerHTML = copyHtml;
    var copyAnchor = document.getElementById("__copy__");
    copyAnchor.addEventListener("click", () => {
        navigator.clipboard.writeText(toMarkdown()).then(() => {
            alert("done");
        });
    });
    console.log(mdContent);
})();