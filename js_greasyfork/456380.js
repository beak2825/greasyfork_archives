// ==UserScript==
// @name         ChatGPT Copy as Markdown with MathJax Support
// @name:zh-CN  支持数学公式的ChatGPT Markdown一键复制
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Copy the chatGPT Q&A content as a markdown text, with MathJax Render Support, you can use this together with 'OpenAI-ChatGPT LaTeX Auto Render (with MathJax V2)' that adds support for math render, based on 'chatGPT Markdown' by 赵巍໖.
// @description:zh-cn  将chatGPT问答内容复制成markdown文本，并支持MathJax渲染内容导出，与'OpenAI-ChatGPT LaTeX Auto Render（with MathJax V2）'一起使用可以渲染公式, 基于赵巍໖的'chatGPT Markdown'。
// @license MIT
// @author       jbji
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @icon         https://chat.openai.com/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456380/ChatGPT%20Copy%20as%20Markdown%20with%20MathJax%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/456380/ChatGPT%20Copy%20as%20Markdown%20with%20MathJax%20Support.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var mathFixEnabled = true;
    function toMarkdown() {
        var main = document.querySelector("main");
        var article = main.querySelector("div > div > div > div");
        var chatBlocks = Array.from(article.children)
            .filter(v => v.getAttribute("class").indexOf("border") >= 0);
        // for chatgpt plus
        if (chatBlocks.length > 0 && chatBlocks[0].classList.contains("items-center")) {
            chatBlocks.shift(); // remove first element from array
        }
        var new_replacements = [
            //['\\', '\\\\', 'backslash'], //Don't need this any more cause it would be checked.
            ['`', '\\`', 'codeblocks'],
            ['*', '\\*', 'asterisk'],
            ['_', '\\_', 'underscores'],
            ['{', '\\{', 'crulybraces'],
            ['}', '\\}', 'crulybraces'],
            ['[', '\\[', 'square brackets'],
            [']', '\\]', 'square brackets'],
            ['(', '\\(', 'parentheses'],
            [')', '\\)', 'parentheses'],
            ['#', '\\#', 'number signs'],
            ['+', '\\+', 'plussign'],
            ['-', '\\-', 'hyphen'],
            ['.', '\\.', 'dot'],
            ['!', '\\!', 'exclamation mark'],
            ['>', '\\>', 'angle brackets']
        ];

        // A State Machine used to match string and do replacement
        function replacementSkippingMath(string, char_pattern, replacement) {
            var inEquationState = 0; // 0:not in equation, 1:inline equation expecting $, 2: line euqation expecting $$
            var result = "";
            for (let i = 0; i < string.length; i++) {
                if(string[i] == '\\'){
                    result += string[i];
                    if (i+1 < string.length) result += string[i+1];
                    i++; // one more add to skip escaped char
                    continue;
                }
                switch(inEquationState){
                    case 1:
                        result += string[i];
                        if(string[i] === '$'){
                            inEquationState = 0; //simply exit and don't do further check
                            continue;
                        }
                        break;
                    case 2:
                        result += string[i];
                        if(string[i] === '$'){
                            if (i+1 < string.length && string[i+1] === '$'){ //matched $$
                                result += '$';
                                inEquationState = 0;
                                i++; // one more add
                            }
                            //else is unexpected behavior
                            continue;
                        }
                        break;
                    default:
                        if(string[i] === '$'){
                            if (i+1 < string.length && string[i+1] === '$'){//matched $$
                                result += '$$';
                                inEquationState = 2;
                                i++; // one more add
                            }else{ //matched $
                                result += '$';
                                inEquationState = 1;
                            }
                            continue;
                        }else if(string[i] === char_pattern[0]){ //do replacement
                            result += replacement;
                        }else{
                            result += string[i];
                        }
                }
            }

            return result;
        }

        function markdownEscape(string, skips) {
            skips = skips || []
            //reduce function applied the function in the first with the second as input
            //this applies across the array with the first element inside as the initial 2nd param for the reduce func.
            return new_replacements.reduce(function (string, replacement) {
                var name = replacement[2]
                if (name && skips.indexOf(name) !== -1) {
                    return string;
                } else {
                    return replacementSkippingMath(string, replacement[0], replacement[1]);
                }
            }, string)
        }

        function replaceInnerNode(element) {
            if (element.outerHTML) {
                var htmlBak = element.outerHTML;
                if(mathFixEnabled){
                    //replace mathjax stuff
                    var mathjaxBeginRegExp = /(<span class="MathJax_Preview".*?)<scr/s; //this is lazy
                    var match = mathjaxBeginRegExp.exec(htmlBak);
                    while(match){
                        htmlBak = htmlBak.replace(match[1], '');
                        //repalace math equations
                        var latexMath;
                        //match new line equations first
                        var latexMathNLRegExp = /<script type="math\/tex; mode=display" id="MathJax-Element-\d+">(.*?)<\/script>/s;
                        match = latexMathNLRegExp.exec(htmlBak);
                        if(match){
                            latexMath = "$$" + match[1] + "$$";
                            htmlBak = htmlBak.replace(match[0], latexMath);
                        }else{
                            //then inline equations
                            var latexMathRegExp = /<script type="math\/tex" id="MathJax-Element-\d+">(.*?)<\/script>/s;
                            match = latexMathRegExp.exec(htmlBak);
                            if(match){
                                latexMath = "$" + match[1] + "$";
                                htmlBak = htmlBak.replace(match[0], latexMath);
                            }
                        }
                        match = mathjaxBeginRegExp.exec(htmlBak);
                    }
                }

                var parser = new DOMParser();
                //default code block replacement
                var nextDomString = htmlBak.replace(/<code>([\w\s-]*)<\/code>/g, (match) => {
                    var doc = parser.parseFromString(match, "text/html");
                    return "`" + (doc.body.textContent) + "`";
                });
                return parser.parseFromString(nextDomString, "text/html").body.children[0];
            }
            return element;
        }

        var elementMap = {
            "P": function (element, result) {
                let p = replaceInnerNode(element);
                result += markdownEscape(p.textContent, ["codeblocks", "number signs"]);
                result += `\n\n`;
                return result;
            },
            //this should be unordered!
            "UL": function (element, result) {
                let ul = replaceInnerNode(element);
                Array.from(ul.querySelectorAll("li")).forEach((li, index) => {
                    result += `- ${markdownEscape(li.textContent, ["codeblocks", "number signs"])}`;
                    result += `\n`;
                });
                result += `\n\n`;
                return result;
            },
            "OL": function (element, result) {
                let ol = replaceInnerNode(element);
                var olStart = parseInt(ol.getAttribute("start") || "1"); //bug fix thanks to original author
                Array.from(ol.querySelectorAll("li")).forEach((li, index) => {
                    result += `${index + olStart}. ${markdownEscape(li.textContent, ["codeblocks", "number signs"])}`;
                    result += `\n`;
                });
                result += `\n\n`;
                return result;
            },
            "PRE": function (element, result) {
                var codeBlocks = element.querySelectorAll("code");
                //first get class name
                var regex = /^language-/;
                var codeType = '';
                for(var c of codeBlocks){
                    var classNameStr = c.className.split(' ')[2];
                    if (regex.test(classNameStr)){
                        codeType = classNameStr.substr(9);
                    }
                }
                //then generate the markdown codeblock
                result += "```" + codeType + "\n";
                Array.from(codeBlocks).forEach(block => {
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
                let p = replaceInnerNode(nextBlock);
                let text = markdownEscape(p.textContent, ["codeblocks", "number signs"]);
                let lines = text.split('\n');
                for (let j = 0; j < lines.length; j++) {
                    result += `> ${lines[j]}\n`;
                }
                result += '\n';
            }else{
                //try to parse the block
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
    //for copy button
    //var copyHtml = `<div id="__copy__" style="cursor:pointer;position: fixed;bottom: 210px;left: 20px;width: 100px;height: 35px;background: #333333;border: 1px solid #555555;border-radius: 5px;color: white;display: flex;justify-content: center;align-items: center;transition: all 0.2s ease-in-out;"><span>Copy .md</span></div>`;
    // for copy function
    //var copyElement = document.createElement("div");
    //document.body.appendChild(copyElement);
    //copyElement.outerHTML = copyHtml;

    // listen and add element
    // select the body element
    var body = document.querySelector('body');

    // create a new MutationObserver instance
    var observer = new MutationObserver(function(mutations) {
        // iterate over the mutations array
        mutations.forEach(function(mutation) {
            // if a div element was added to the body
            if (mutation.type === 'childList'){
                //TypeError: undefined is not an object (evaluating 'mutation.addedNodes[0].nodeName')
                if(mutation.addedNodes[0] && mutation.addedNodes[0].nodeName === 'DIV'
                   && mutation.addedNodes[0].id === 'headlessui-portal-root') {
                    // do something
                    setTimeout(function(){var navListHidden = document.querySelector('#headlessui-portal-root').querySelector('div > div > div > div.flex > div.flex > div.flex > nav');
                                          addCopyButton(navListHidden);},300);
                }
            }
        });
    });

    // set the observer options
    var options = {
        childList: true, // listen for changes to child nodes
        subtree: true // listen for changes in all descendant nodes
    };

    // start observing the body element
    observer.observe(body, options);

    function addCopyButton(navigationList) {
        if(navigationList.childNodes[2].text == 'Copy .md'){ //avoid duplicate
            return;
        }
        var date = new Date();
        var time = date.getTime();
        var id = "__copy__" + time;
        var copyButton = document.createElement("a");
        copyButton.id = id;
        copyButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>'
            +'<span>Copy .md</span>';
        copyButton.className = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';
        navigationList.insertBefore(copyButton, navigationList.childNodes[2]);

        //for anchor
        var copyAnchor = document.getElementById(id);
        copyAnchor.addEventListener("click", () => {
            // Get the `span` element inside the `div`
            let span = copyAnchor.querySelector("span");

            // Change the text of the `span` to "Done"
            span.innerText = "Copied!";

            // Use `setTimeout` to change the text back to its original value after 3 seconds
            setTimeout(() => {
                span.innerText = "Copy .md";
            }, 1000);

            // Perform the rest of the original code
            navigator.clipboard.writeText(toMarkdown()).then(() => {
                //alert("done");
            });
        });
    }
    //default case
    setTimeout(function(){
                var navList = document.querySelector('#__next').querySelector("div > div.hidden > div > div > nav");
                addCopyButton(navList);
    },600);
    //ensure next conversation works.
    setTimeout(function(){
        var nextConversationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                //console.log(" Mutation detected. Trying to add copy button...");
            });
            setTimeout(function(){
                var navList = document.querySelector('#__next').querySelector("div > div.hidden > div > div > nav");
                addCopyButton(navList);
            },400);
        });
        //console.log("Trying to setup observation...");
        nextConversationObserver.observe(document.querySelector("#__next"), { childList: true });
        //console.log("Over.");
    },1100);
    /**
    window.addEventListener("load", function (event) {
        // Your code here, for example:
        console.log("Page loaded");
    });
    **/
})();