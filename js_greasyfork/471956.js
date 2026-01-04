// ==UserScript==
// @name         Guardian actor names ao3
// @version      0.1
// @namespace    http://tampermonkey.net/
// @description  Change actor names
// @author       laireshi
// @match       https://archiveofourown.org/*
// @match       http://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/471956/Guardian%20actor%20names%20ao3.user.js
// @updateURL https://update.greasyfork.org/scripts/471956/Guardian%20actor%20names%20ao3.meta.js
// ==/UserScript==

const replaceActorNames = () => {
    'use strict';

    const WORDS_TO_REPLACE = [/Zhu Yilong/ig, /Zhu Yi Long/ig, /Zhu Yi-Long/ig, /Bai Yu/ig, /Zhu-Yilong/ig, /ZhuBai/ig, /BaiZhu/ig,
        /Z1L/ig, /weibo/ig, /Zhu_Yilong/ig, /Bai_Yu/ig];
    const llama = 'LLAMALLAMALLAMA'
    let newText;

    const blurbs = Array.from(document.querySelectorAll('.blurb'));
    blurbs.forEach(blurb => {
        for (let name of WORDS_TO_REPLACE){
            if (name.test(blurb.innerHTML)){
                newText = blurb.innerHTML.replace(name, llama);
                blurb.innerHTML = newText;
            }
        }
    })
    
    const ficPage = document.querySelector('.works-show');
    for (let name of WORDS_TO_REPLACE){
        if (name.test(ficPage.innerHTML)){
            newText = ficPage.innerHTML.replace(name, llama);
            ficPage.innerHTML = newText;
        }
    }
}

replaceActorNames();