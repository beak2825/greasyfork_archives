// ==UserScript==
// @name         Guardian actor names tumblr
// @version      0.2
// @namespace    http://tampermonkey.net/
// @description  Change actor names
// @author       laireshi
// @match        https://*.tumblr.com/*
// @downloadURL https://update.greasyfork.org/scripts/471949/Guardian%20actor%20names%20tumblr.user.js
// @updateURL https://update.greasyfork.org/scripts/471949/Guardian%20actor%20names%20tumblr.meta.js
// ==/UserScript==

const replaceActorNames = () => {
    'use strict';
    const WORDS_TO_REPLACE = [/Zhu Yilong/ig, /Zhu Yi Long/ig, /Zhu Yi-Long/ig, /Bai Yu/ig, /Zhu-Yilong/ig, /ZhuBai/ig, /BaiZhu/ig,
        /Z1L/ig, /weibo/ig, /Zhu_Yilong/ig, /Bai_Yu/ig];
    const llama = 'LLAMALLAMALLAMA'
    let newText;
    const entries = Array.from(document.querySelectorAll('body p'));
    entries.forEach(entry => {
        for (let name of WORDS_TO_REPLACE){
            if (name.test(entry.innerHTML)){
                newText = entry.innerHTML.replace(name, llama);
                entry.innerHTML = newText;
            }
        } 
    })
    const tags = Array.from(document.querySelectorAll('body a'));
    tags.forEach(tag => {
        for (let name of WORDS_TO_REPLACE){
            if (name.test(tag.innerHTML)){
                newText = tag.innerHTML.replace(name, llama);
                tag.innerHTML = newText;
            }
        } 
    })
}

replaceActorNames();