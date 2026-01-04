// ==UserScript==
// @run-at      document-start
// @version     1.0.0
// @name        YouTube and Google CN
// @namespace   none
// @author      max
// @description googleCN
// @license     GPL-3.0-only
// @match     *://youtube.*/*
// @match      *://*.youtube.*/*
// @match      *://www.google.com/*
// @exclude     *://www.google.com/a/*
// @icon        https://raw.githubusercontent.com/emmaexe/userscripts/main/youtube-region-setter/assets/youtube-ico-32.png
// @grant       GM.registerMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/509310/YouTube%20and%20Google%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/509310/YouTube%20and%20Google%20CN.meta.js
// ==/UserScript==
 
GM.registerMenuCommand('Set preferred youtube/google region', async () => {
    region = prompt('Please enter your preferred region:', 'CN');
    await GM.setValue('region', region);
    window.location.reload();
})
 
async function main(){
    let region = await GM.getValue('region', 'CN');
    let oldUrl = location.href;
    let arr = oldUrl.split('?');
    if (!(oldUrl.includes(`&gl=${region}`) || oldUrl.includes(`?gl=${region}`))) {
        if (arr.length > 1 && arr[1] !== '') {
            location.replace(oldUrl+`&gl=${region}`);
        } else {
            location.replace(oldUrl+`?gl=${region}`);
        }
    }
}
 
main();