// ==UserScript==
// @name          Old Reddit Better Codeblocks
// @namespace     http://tampermonkey.net/
// @version       0.4.2
// @license       MIT
// @description   re-render markdown with marked.js and highlight codeblocks with highlight.js
// @author        cultab
// @match         http*://*.reddit.com/*
// @exclude       http*://new.reddit.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @require       https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require       https://cdn.jsdelivr.net/npm/marked@10.0.0/lib/marked.umd.min.js
// @require       https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @resource hljs https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css
// @downloadURL https://update.greasyfork.org/scripts/480530/Old%20Reddit%20Better%20Codeblocks.user.js
// @updateURL https://update.greasyfork.org/scripts/480530/Old%20Reddit%20Better%20Codeblocks.meta.js
// ==/UserScript==


/* global VM hljs DOMPurify marked */

const DEBUG = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function until(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) {
            resolve();
        } else {
            setTimeout(_ => poll(resolve), 400);
        }
    }

    return new Promise(poll);
}

function parse(md) {
    log(md)
    md = md.replace(/(https?:\/\/.*\.(jpeg|jpg|png|gif|webp).*(\?[A-z])?)/g, "$1:\n\n![]($1)");
    log(md)
    md = md.replace('/&nbsp;/g', ' ');
    md = DOMPurify.sanitize(marked.parse(md));
    md = md.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return md;
}

function log(...vars) {
    if (DEBUG) {
        console.log(...vars);
    }
}

const skipme_marker = "orbc_skip";
const source_marker = "orbc_source";

const stoyle = GM_getResourceText("hljs");
GM_addStyle(stoyle);

const content = document.body.querySelector("div.content");
log(content);

let base = 0;

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const disconnect = VM.observe(content, () => {
    const id = genRanHex(6);

    // all posts/comments
    const entries = document.getElementsByClassName("entry");

    // barrier for callback completion
    let barrier = entries.length;
    log(id, " Start with #", barrier);

    let changed = false;
    for (const entry of entries) {
        // const eid = genRanHex(4);

        // if it contains an expando we need to check some stuff :)
        let expando_btn = entry.querySelector(".expando-button")
        if (expando_btn) {
            if (expando_btn.classList.contains("collapsed") || !expando_btn.classList.contains("selftext")) {
                entry.classList.remove(skipme_marker);
                barrier--;
                continue;
            } else {
            }
        }

        // if we proccesed this entry, skip it
        if (entry.classList.contains(skipme_marker)) {
            barrier--;
            continue;
        }

        // find view source button and if exists click it twice
        let btn = entry.querySelector(".viewSource");
        if (!btn) {
            barrier--;
            continue;
        }
        btn.children[0].click(); // yes twice
        btn.children[0].click();

        // when source is loaded, use it to replace post content with marked.js markdown
        const fn = () => { /* intended shared reference to barrier and changed*/
            let source = entry.querySelector("textarea").innerHTML;
            if (!source) {
                log(id, "no source yet");
                return false;
            }
            entry.classList.add(source_marker);
            entry.classList.add(skipme_marker);
            let post = entry.querySelector(".usertext-body");
            if (post) {
                changed = true;
                post.children[0].innerHTML = parse(source);
            } else {
                log("null post for id: ", id);
            }
            barrier--;
            return true
        }

        // if view source has loaded run
        if (entry.classList.contains(source_marker)) {
            fn();
        } else { // else wait for it to load
            VM.observe(entry, fn);
        }

    }
    (async () => {
        // wait until all posts have been re-parsed
        await until(() => {
            log(id, "barrier", barrier);
            return barrier == 0;
        });
        log(id, " Exit, changed: ", changed);
        if (!changed) {
            return false;
        }

        // create a div with class hlhs
        let hl = document.createElement("div");
        hl.classList.add('hljs');
        hl.setAttribute("id", "hljshack");
        document.querySelector("body").append(hl);

        // use it to get the style of hljs classes
        let ready_and_styled = document.getElementById("hljshack");
        let wanted_styles = window.getComputedStyle(ready_and_styled);

        // force hljs styles on code and pre blocks
        let code_blocks = document.querySelectorAll("code");
        for (let blk of code_blocks) {
            // highlight block
            blk.innerHTML = hljs.highlightAuto(blk.innerText).value;
            blk.style.backgroundColor = wanted_styles.backgroundColor;
            blk.style.color = wanted_styles.color;
        }
        let pre_elems = document.querySelectorAll("pre");
        for (let pre of pre_elems) {
            pre.style.backgroundColor = wanted_styles.backgroundColor;
            pre.style.borderColor = wanted_styles.color;
        }
    })();


    return false;
});

content.append(document.createElement("span"));
