// ==UserScript==
// @name         Graphomata Weighted Score Display
// @namespace    http://tampermonkey.net/
// @description  Display weighted score (i.e. Re+½Im) on the leaderboard.
// @version      2024-12-11
// @author       WYXkk
// @match        https://graphomata.com/game/leaderboards.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=graphomata.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488426/Graphomata%20Weighted%20Score%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/488426/Graphomata%20Weighted%20Score%20Display.meta.js
// ==/UserScript==

async function untilGet(id)
{
    var u=undefined;
    while(u==undefined)
    {
        u=document.querySelectorAll(id)[0];
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return u;
}

(async function() {
    'use strict';
    var a=await untilGet('#leaderboardsTable > tbody');
    let s=a.innerHTML;
    let x=[...s.matchAll(/(\d{1,2}),(\d{3})(\+(\d,)?(\d{1,3})<i>i<\/i>)?/g)];
    let last=0;let ss='';
    for(let i in x){
        ss+=s.slice(last,x[i].index);
        let value=(parseInt(x[i][1]||'0')*1000+parseInt(x[i][2]||'0'))+(parseInt(x[i][4]||'0')*1000+parseInt(x[i][5]||'0'))/2;
        ss+=x[i][0]+`</td><td style="white-space: nowrap">${value.toLocaleString()}`;
        last=x[i].index+x[i][0].length;
    }
    ss+=s.slice(last);
    a.innerHTML=ss.replace('<th>Score</th>','<th>Score</th>\n<th>Weighted</th>');
    document.body.style['maxWidth']='950px';
})();