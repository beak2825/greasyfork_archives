// ==UserScript==
// @name         Password Game Assistant
// @license      MIT
// @namespace    https://blog.fyz666.xyz/blog/9097/
// @version      0.0.1
// @description  一个用于Password Game的脚本
// @author       Eric Fan
// @match        https://neal.fun/password-game/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485695/Password%20Game%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/485695/Password%20Game%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function Rule11() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let param = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        let url = 'https://neal.fun/api/password-game/wordle?date=' + param;
        fetch(url)
            .then(r => r.json())
            .then(data => {
            let ans = data['answer'];
            let input = document.querySelector(".ProseMirror");
            const p = document.createElement('p');
            const span = document.createElement('span');
            span.innerText = ans;
            p.appendChild(span);
            input.appendChild(p);
        });
    }
    function Rule13() {
        let phase = "🌑🌒🌓🌔🌕🌖🌗🌘";
        let input = document.querySelector(".ProseMirror");
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = phase;
        p.appendChild(span);
        input.appendChild(p);
    }
    function Rule14() {
        let iframe = document.querySelector('.geo-wrapper iframe');
        if (iframe === null) return;
        iframe.style.marginTop = 0;
    }
    function Rule19() {
        function processNodeRule19(textNode) {
            const text = textNode.nodeValue;
            const parent = textNode.parentNode;

            const fragments = text.split(/([aeiouyAEIOUY])/);

            fragments.forEach(fragment => {
                if (/[aeiouyAEIOUY]/.test(fragment)) {
                    const strong = document.createElement('strong');
                    strong.textContent = fragment;
                    parent.insertBefore(strong, textNode);
                } else {
                    parent.insertBefore(document.createTextNode(fragment), textNode);
                }
            });
            parent.removeChild(textNode);
        }

        function processRule19(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                processNodeRule19(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(processRule19);
            }
        }
        let paragraphs = document.querySelectorAll('.ProseMirror p');
        paragraphs.forEach(processRule19);
    }
    function Rule20() {
        let input = document.querySelector('.ProseMirror');
        input.innerHTML = input.innerHTML.replace(/🔥/g, "");
    }
    function Rule23() {
        let input = document.querySelector(".ProseMirror");
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = "🐛";
        p.appendChild(span);
        input.appendChild(p);
        setTimeout(() => {
            let end = setInterval(() => {}, 10000);
            for (let i = 1; i <= end; i++) {
                clearInterval(i);
            }
            input.removeChild(input.lastChild);
        }, 1000);
    }
    function Rule28() {
        let btn = document.querySelector('.refresh');
        if (btn == null) return;
        btn.click();
        setTimeout(() => {
            let color = document.querySelectorAll(".rand-color")[0];
            color = color.style.background.match(/\d+/g);
            let s = "#";
            color.forEach(item => {
                s += parseInt(item).toString(16).padStart(2, '0');
            });
            let input = document.querySelector(".ProseMirror");
            const p = document.createElement('p');
            const span = document.createElement('span');
            span.innerText = s;
            p.appendChild(span);
            input.appendChild(p);
        }, 100);
    }
    function Rule30() {
        function processNodeRule30(textNode) {
            const text = textNode.nodeValue;
            const parent = textNode.parentNode;
            const parentFontFamily = getComputedStyle(parent).fontFamily;

            const fragments = text.split(/(\d)/);

            fragments.forEach(fragment => {
                if (/\d/.test(fragment)) {
                    const span = document.createElement('span');
                    const fontSize = Math.pow(parseInt(fragment), 2);
                    span.style.fontSize = `${fontSize}px`;
                    span.style.fontFamily = parentFontFamily;
                    span.textContent = fragment;
                    parent.insertBefore(span, textNode);
                } else {
                    parent.insertBefore(document.createTextNode(fragment), textNode);
                }
            });
            parent.removeChild(textNode);
        }

        function processRule30(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                processNodeRule30(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(processRule30);
            }
        }
        let items = document.querySelectorAll(".ProseMirror p");
        items.forEach(processRule30);
    }
    function Rule31() {
        let counter = {};
        function processNodeRule31(textNode) {
            const text = textNode.nodeValue;
            const parent = textNode.parentNode;
            const parentFontFamily = getComputedStyle(parent).fontFamily;

            const fragments = text.split(/([a-zA-Z])/);

            fragments.forEach(fragment => {
                if (/[a-zA-Z]/.test(fragment)) {
                    let letter = fragment.toLowerCase();
                    counter[letter] = (counter[letter] || 0) + 1;
                    const span = document.createElement('span');
                    const fontSize = Math.pow(counter[letter] - 1, 2);
                    span.style.fontSize = `${fontSize}px`;
                    span.style.fontFamily = parentFontFamily;
                    span.textContent = fragment;
                    parent.insertBefore(span, textNode);
                } else {
                    parent.insertBefore(document.createTextNode(fragment), textNode);
                }
            });
            parent.removeChild(textNode);
        }

        function processRule31(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                processNodeRule31(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(processRule31);
            }
        }
        let items = document.querySelectorAll(".ProseMirror p");
        items.forEach(processRule31);
    }
    function final() {
        let p1 = document.querySelector('.password-final');
        let p2 = document.querySelector('.complete .ProseMirror');
        if (p1 === null || p2 === null) return;
        p2.innerHTML = p1.innerHTML;
    }
    const functions = [Rule11, Rule13, Rule14, Rule19, Rule20, Rule23, Rule28, Rule30, Rule31, final];
    const functionNames = ['Rule 11', 'Rule 13', 'Rule 14', 'Rule 19', 'Rule 20', 'Rule 23', 'Rule 28', 'Rule 30', 'Rule 31', 'Final'];

    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '50%';
    container.style.transform = 'translateY(-50%)';
    container.style.zIndex = '1000';

    functions.forEach((func, index) => {
        var button = document.createElement('button');
        button.textContent = functionNames[index];
        button.style.display = 'block';
        button.style.margin = '5px';
        button.style.width = '70px';
        button.style.padding = '5px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s, transform 0.2s';

        button.onmouseover = function() {
            button.style.backgroundColor = '#45a049';
        };
        button.onmouseout = function() {
            button.style.backgroundColor = '#4CAF50';
        };
        button.onmousedown = function() {
            button.style.transform = 'scale(0.95)';
        };
        button.onmouseup = function() {
            button.style.transform = 'scale(1)';
        };

        button.addEventListener('click', func);
        container.appendChild(button);
    });

    document.body.appendChild(container);
})();