// ==UserScript==
// @name         Wanikani Forums: OwOfy Post
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Might as well enable merciless damnation to come sooner rather than later.
// @author       Logograph
// @match        https://community.wanikani.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/474503/Wanikani%20Forums%3A%20OwOfy%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/474503/Wanikani%20Forums%3A%20OwOfy%20Post.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let injected = false;
    class OwO {
        constructor(options) {
            options = options != null ? options : {}
            let defaults = {
                rltow: true,
                yaftern: true,
                repeaty: true,
                replaceWords: true,
                wordMap: {
                    love: 'wuv',
                    mr: 'mistuh',
                    dog: 'doggo',
                    cat: 'kitteh',
                    hello: 'henwo',
                    hell: 'heck',
                    fuck: 'fwick',
                    fuk: 'fwick',
                    shit: 'shoot',
                    friend: 'fwend',
                    stop: 'stawp',
                    god: 'gosh',
                    dick: 'peepee',
                    penis: 'peepee',
                    damn: 'darn'
                },
                doStutter: true,
                stutterChance: 0.1,
                doPrefixes: true,
                prefixChance: 0.05,
                prefixes: [
                    'OwO',
                    'OwO whats this?',
                    '*unbuttons shirt*',
                    '*nuzzles*',
                    '*waises paw*',
                    '*notices bulge*',
                    '*blushes*',
                    '*giggles*',
                    'hehe'
                ],
                doSuffixes: true,
                suffixChance: 0.15,
                suffixes: [
                    '(ﾉ´ з `)ノ',
                    '( ´ ▽ ` ).｡ｏ♡',
                    '(´,,•ω•,,)♡',
                    '(*≧▽≦)',
                    'ɾ⚈▿⚈ɹ',
                    '( ﾟ∀ ﾟ)',
                    '( ・ ̫・)',
                    '( •́ .̫ •̀ )',
                    '(▰˘v˘▰)',
                    '(・ω・)',
                    '✾(〜 ☌ω☌)〜✾',
                    '(ᗒᗨᗕ)',
                    '(・`ω´・)',
                    ':3',
                    '>:3',
                    'hehe',
                    'xox',
                    '>3<',
                    'murr~',
                    'UwU',
                    '*gwomps*'
                ]
            }
            for (let key in defaults) {
                this[key] = options[key] != null ? options[key] : defaults[key]
            }
            this.prefixes.sort((a, b) => a.length - b.length)
            this.suffixes.sort((a, b) => a.length - b.length)
        }

        static replaceAll(text, map) {
            let source = Object.keys(map).map(i => `\\b${i}`)
            let re = new RegExp(`(?:${source.join(')|(?:')})`, 'gi')
            return text.replace(re, match => {
                let out = map[match.toLowerCase()]
                // Not very tidy way to work out if the word is capitalised
                if ((match.match(/[A-Z]/g) || []).length > match.length / 2) out = out.toUpperCase()
                return out
            })
        }

        static weightedRandom(list) {
            // Returns a random choice from the list based on the length of string in the list
            // Shorter strings are proportionally more likely to be picked
            // ** List should already be sorted shortest to longest **
            let max = list[list.length - 1].length + 1
            let acc = 0
            let weights = list.map(i => acc += max - i.length)
            let random = Math.floor(Math.random() * acc)
            for (var [index, weight] of weights.entries()) {
                if (random < weight) break
            }
            return list[index]
        }

        owoify(text) {
            // Replace words
            if (this.replaceWords) {
                text = OwO.replaceAll(text, this.wordMap)
            }
            // OwO
            if (this.rltow) {
                text = text.replace(/[rl]/gi, match =>
                                    match.charCodeAt(0) < 97 ? 'W' : 'w'
                                   )
            }
            // Nya >;3
            if (this.yaftern) {
                text = text.replace(/n[aeiou]/gi, match =>
                                    `${match[0]}${match.charCodeAt(1) < 97 ? 'Y' : 'y'}${match[1]}`
                    )
            }
            // Repeaty wepeaty
            if (this.repeaty) {
                text = text.replace(/\b(?=.*[aeiou])(?=[a-vx-z])[a-z]{4,}y\b/gi, match =>
                                    `${match} ${match.charCodeAt(0) < 97 ? 'W' : 'w'}${match.match(/.[aeiouy].*/i)[0].slice(1)}`
                    )
            }
            // S-stutter
            if (this.doStutter) {
                text = text.split(' ').map(word => {
                    if (word.length === 0 || word[0].match(/[a-z]/i) == null) return word
                    while (Math.random() < this.stutterChance) {
                        word = `${word[0]}-${word}`
                        }
                    return word
                }).join(' ')
            }
            // Prefixes
            if (this.doPrefixes) {
                if (Math.random() < this.prefixChance) {
                    text = `${OwO.weightedRandom(this.prefixes)} ${text}`
                    }
            }
            // Suffixes
            if (this.doSuffixes) {
                if (Math.random() < this.suffixChance) {
                    text = `${text} ${OwO.weightedRandom(this.suffixes)}`
                    }
            }
            return text
        }
    }
    const createButton = () => {
        const classes = "widget-button btn-flat btn-icon owo-button";
        const btn = document.createElement("button");
        classes.split(" ").forEach(cls => btn.classList.add(cls));
        btn.innerHTML = "OwO";
        btn.onclick = (ev) => {
            const parent = btn.closest("article").querySelector(".cooked");
            console.log(parent);
            const paragraphs = [...parent.childNodes] ?? [];
            const recursivelyOwOfy = (node) => {
                if (node.childNodes.length) {
                    for (let n of node.childNodes) {
                        recursivelyOwOfy(n);
                    }
                }
                else {
                    node.textContent = new OwO().owoify(node.textContent);
                }
            }
            paragraphs.forEach(recursivelyOwOfy);
        };
        return btn;
    }
    const e = document.getElementById("topic");
    const inject = (addedNodes) => {
        console.log(addedNodes);
        addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) return;
            if (node.classList?.contains("topic-post")) {
                const actions = node.querySelector(".actions");
                const owoBottom = node.parentNode.querySelector(".owo-button");
                owoBottom && owoBottom.parentNode.removeChild(owoBottom);
                requestIdleCallback(() => actions.appendChild(createButton()));
                return;
            } else if (node.classList?.contains("reply") || node.classList?.contains("double-button")) {
                const owoBottom = node.parentNode.querySelector(".owo-button");
                owoBottom && node.parentNode.removeChild(owoBottom);
                node.parentNode.appendChild(owoBottom || createButton());
                return;
            } else if (node.classList?.contains("show-replies")){
                const owoBottom = createButton();
                node.parentNode.appendChild(owoBottom);
                return;
            }
        });
    }
    const init = () => {
        const classes = "widget-button btn-flat btn-icon";
        const els = document.querySelectorAll("nav.post-controls");
        for (let el of els) {
            if (el.getAttribute("data-owo-injected") === "true") continue;
            const btn = document.createElement("button");
            classes.split(" ").forEach(cls => btn.classList.add(cls));
            btn.innerHTML = "OwO";
            btn.onclick = (ev) => {
                const parent = el.closest("article").querySelector(".cooked");
                console.log(parent);
                const paragraphs = [...parent.childNodes] ?? [];
                const recursivelyOwOfy = (node) => {
                    if (node.childNodes.length) {
                        for (let n of node.childNodes) {
                            recursivelyOwOfy(n);
                        }
                    }
                    else {
                        node.textContent = new OwO().owoify(node.textContent);
                    }
                }
                paragraphs.forEach(recursivelyOwOfy);
            };
            if (el.nodeType !== Node.TEXT_NODE) {
                el.querySelector(".actions").appendChild(btn);
                el.setAttribute("data-owo-injected", "true");
            }
        }
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes?.length > 0) {
                    const button = createButton();
                    inject(mutation.addedNodes);
                }
            });
        });
        observer.observe(e, { childList: true, subtree: true });
    }
    const i = setInterval(() => {
        if (window.Discourse && e) {
            window.Discourse.application.initializer({
                name: "owo-bottom",
                initialize: init
            })
            window.Discourse.application.runInitializers();
            clearInterval(i);
        }
    }, 100);
})();
