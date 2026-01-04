// @ts-check
// ==UserScript==
// @name        What was that tweet!?
// @namespace   https://github.com/noccu
// @match       https://twitter.com/*
// @grant       none
// @version     1.2
// @author      noccu
// @description Keeps a list of removed tweets on your timeline.
// @downloadURL https://update.greasyfork.org/scripts/415013/What%20was%20that%20tweet%21.user.js
// @updateURL https://update.greasyfork.org/scripts/415013/What%20was%20that%20tweet%21.meta.js
// ==/UserScript==

"use strict";
/** @type {Element} */
var TIMELINE;
const LIST = {
    list: new Map(),
    /** @type {HTMLElement} */
    listDom: undefined,
    frag: document.createDocumentFragment(),
    maxSize: 150,
    create() {
        if (!this.listDom) {
            //hidden list
            let closeBtn = document.createElement("div");
            closeBtn.id = "wt-close";
            closeBtn.textContent = "X";
            closeBtn.addEventListener("click", () => this.hide());
            let list = document.createElement("div");
            list.id = "wt-list";
            list.style.visibility = "hidden";
            list.append(closeBtn);
            this.listDom = list;
            document.body.append(list);
            //open button
            let target = document.querySelector("nav");
            if (target) {
                let btn = document.createElement("div"),
                    text = document.createElement("span");
                btn.id = "wt-open";
                btn.textContent = "🗑";
                btn.className = "css-18t94o4 r-jwli3a r-1sp51qo";
                btn.addEventListener("click", this.show.bind(this));
                text.textContent = "Removed";
                text.className = "r-1qd0xha r-1b6yd1w r-b88u0q r-1joea0r";
                btn.append(text);
                target.append(btn);
                
                this.setAppearance(target, text);
                let o = new MutationObserver(() => this.setAppearance(target, text));
                o.observe(target, {attributes: true, attributeFilter: ["class"]});
            }
        }
    },
    add(tweet) {
        let id = tweet.getElementsByClassName("js-action-profile")[0]?.dataset.tweetId;
        if (id) {
            if (this.list.has(id)) {
                this.moveToTop(id);
            }
            else {
                this.frag.prepend(tweet);
                this.list.set(id, tweet);    
            }
        }
    },
    remove(amount) {
        let i = 1;
        for (let [id, t] of this.list) {
            t.remove();
            this.list.delete(id);
            i++;
            if (i > amount) return;
        }
    },
    update() {
        let v;
        if (this.list.size > this.maxSize) {
            v = this.listDom.style.visibility || "visible";
            this.hide();
            this.remove(this.list.size - this.maxSize);
        }
        this.listDom.prepend(this.frag);
        if (v) this.listDom.style.visibility = v;
    },
    moveToTop(id) {
        let node = this.list.get(id);
        if (node) this.listDom.prepend(node);
    },
    show() {
        this.listDom.style.visibility = "visible";
    },
    hide() {
        this.listDom.style.visibility = "hidden";
    },
    
    /**
     * @param {HTMLElement} nav
     * @param {HTMLSpanElement} txt
     */
    setAppearance(nav, txt) {
        //full
        if (nav.classList.contains("r-1habvwh")) {
            txt.style.display = "initial";
        }
        else {
            txt.style.display = "none"
        }
    }
}

/**
 * @param {MutationRecord[]} records
 */
function handleChange(records) {
    for (let record of records) {
        record.removedNodes.forEach( /** @arg {HTMLElement} node */ node => {
            let images = node.getElementsByTagName("img");
            if (images.length > 1 && Array.prototype.some.call(images, /** @param {HTMLImageElement} i*/ i => i.alt == "Image" || i.alt.endsWith("video"))) {
                LIST.add(node);
            }
        })
    }
    LIST.update();
}

function addCSS() {
    if (document.getElementById("wwt-css")) return;
    let css = document.createElement("style");
    css.id = "wwt-css";
    css.innerHTML = `
        #wt-list {
            position: fixed;
            top: 0;
            background-color: inherit;
            width: 500px;
            height: 100%;
            overflow: auto;
        }
        #wt-list > * {
            transform: none !important;
            position: static !important;
            opacity: 1 !important;
        }
        #wt-list .r-3s2u2q:hover {
            text-decoration: underline;
        }
        #wt-open {
            font-size: xx-large;
            display: flex;
            align-items: center;
        }
        #wt-close {
            color: black;
            position: fixed !important;
            top: 0;
            background-color: red;
            font-size: x-large;
            cursor: pointer;
        }
    `;
    document.head.append(css);
}

/**
 * @param {string} selector
 * @returns {Promise<Element>}
 */
function waitOnDOM(selector) {
    return new Promise(r => {
        function check(unused, o) {
            let target = document.querySelector(selector);
            if (target) {
                if (o && o instanceof MutationObserver) o.disconnect();
                r(target);
                return true;
            } else return false;
        }
        if (!check()) {
            let o = new MutationObserver(check);
            o.observe(document, {
                childList: true,
                subtree: true
            });
        }
    })
}

// Main
const MAIN_OBSERVER = new MutationObserver(main);
const TWEET_OBSERVER = new MutationObserver(handleChange);
MAIN_OBSERVER.observe(document.head, {attributes: true, attributeFilter: ["href"], childList: true}); //page changes
main();

function main() {
    if (location.pathname == "/home") {
        waitOnDOM("section > div.css-1dbjc4n[aria-label$='Home Timeline'] > div:not([class])")
        .then(tl => {
                LIST.create();
                TIMELINE = tl
                addCSS();
                TWEET_OBSERVER.observe(TIMELINE, {childList: true});
            });
    }
}
