// ==UserScript==
// @name         Скрывать прочитанное в preview
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрипт скрывает ответы которые вы читали с помощью наведения курсора. Скрытие работает когда вы прочитали все ответы на ответ.
// @author       dimden.dev
// @match        https://2ch.hk/*/res/*
// @match        https://2ch.life/*/res/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449553/%D0%A1%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BF%D1%80%D0%BE%D1%87%D0%B8%D1%82%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5%20%D0%B2%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/449553/%D0%A1%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BF%D1%80%D0%BE%D1%87%D0%B8%D1%82%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5%20%D0%B2%20preview.meta.js
// ==/UserScript==

console.log("Running HideReadPreviews");
let getTextFromHtml = (t) =>
t
.split('>')
.map((i) => i.split('<')[0])
.filter((i) => !i.includes('=') && i.trim())
.join('');

let pendingPosts = [];
let readPosts = [];

setInterval(() => {
    let previews = Array.from(document.getElementsByClassName('post_preview')).map(i => POSTS.get(+i.dataset.num)).filter(i => !!i);
    for(let i in previews) {
        let p = previews[i];
        if(p.counter === undefined) {
            p.counter = 0;
            pendingPosts.push(p);
        } else p.counter++;
        if(!p.clearText) p.clearText = getTextFromHtml(p.comment);
        if(!p.isRead) {
            if(p.clearText.length < 100 || (p.clearText.length <= 200 && p.counter === 1) || (p.clearText.length <= 300 && p.counter === 2)) {
                p.isRead = true;
                readPosts.push(p);
                let index = pendingPosts.findIndex(pp => pp.num === p.num);
                pendingPosts.splice(index, 1);
            } else if(p.counter === 3) {
                p.isRead = true;
                readPosts.push(p);
                let index = pendingPosts.findIndex(pp => pp.num === p.num);
                pendingPosts.splice(index, 1);
            }
        }
    }
    for(let i in readPosts) {
        let p = readPosts[i];
        let allRepliesRead = p.refmap.reduce((acc, curr) => acc && readPosts.find(j => j.num === curr), true);
        if(allRepliesRead) {
            p.el.classList.add('post_type_hidden');
            let index = readPosts.findIndex(pp => pp.num === p.num);
            readPosts.splice(index, 1);
        }
    }
}, 1000);