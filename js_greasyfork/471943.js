// ==UserScript==
// @name         Guardian actor names dreamwidth
// @version      0.4
// @namespace    http://tampermonkey.net/
// @description  Change actor names
// @author       laireshi
// @match        https://*.dreamwidth.org/*
// @downloadURL https://update.greasyfork.org/scripts/471943/Guardian%20actor%20names%20dreamwidth.user.js
// @updateURL https://update.greasyfork.org/scripts/471943/Guardian%20actor%20names%20dreamwidth.meta.js
// ==/UserScript==

const replaceActorNames = () => {
    'use strict';
    const WORDS_TO_REPLACE = [/Zhu Yilong/ig, /Zhu Yi Long/ig, /Zhu Yi-Long/ig, /Bai Yu/ig, /Zhu-Yilong/ig, /ZhuBai/ig, /BaiZhu/ig,
        /Z1L/ig, /weibo/ig, /Zhu_Yilong/ig, /Bai_Yu/ig];
    const llama = 'LLAMALLAMALLAMA'
    let newText;
    const entries = Array.from(document.querySelectorAll('.entry'));
    entries.forEach(entry => {
        for (let name of WORDS_TO_REPLACE){
            if (name.test(entry.innerHTML)){
                newText = entry.innerHTML.replace(name, llama);
                entry.innerHTML = newText;
            }
        }
    })


    const comments = Array.from(document.querySelectorAll('.comment'));
    comments.forEach(comm => {
        for (let name of WORDS_TO_REPLACE){
            if (name.test(comm.innerHTML)){
                newText = comm.innerHTML.replace(name, llama);
                comm.innerHTML = newText;
            }
        } 
    })

    const messages = Array.from(document.querySelectorAll('.item'));
    messages.forEach(mess => {
        for (let name of WORDS_TO_REPLACE){
            if (name.test(mess.innerHTML)){
                newText = mess.innerHTML.replace(name, llama);
                mess.innerHTML = newText;
            }
        }
    })
}

replaceActorNames();