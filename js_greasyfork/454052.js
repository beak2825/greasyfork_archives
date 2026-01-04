// ==UserScript==
// @run-at      document-start
// @version     1.0.1
// @name        YouTube and Google region setter
// @namespace   https://github.com/emmaexe/userscripts
// @author      emmaexe
// @description Youtube and google regularly change your region based on your IP. This userscript automatically sets it to your preferred region instead.
// @license     GPL-3.0-only
// @homepageURL https://github.com/emmaexe/userscripts
// @supportURL  https://github.com/emmaexe/userscripts/issues
// @include     *://youtube.*/*
// @include     *://*.youtube.*/*
// @include     *://www.google.com/*
// @exclude     *://www.google.com/a/*
// @noframes
// @icon        https://raw.githubusercontent.com/emmaexe/userscripts/main/youtube-region-setter/assets/youtube-ico-32.png
// @grant       GM.registerMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/454052/YouTube%20and%20Google%20region%20setter.user.js
// @updateURL https://update.greasyfork.org/scripts/454052/YouTube%20and%20Google%20region%20setter.meta.js
// ==/UserScript==

GM.registerMenuCommand('Set preferred youtube/google region', async () => {
    region = prompt('Please enter your preferred region:', 'GB');
    await GM.setValue('region', region);
    window.location.reload();
})

async function main(){
    let region = await GM.getValue('region', 'GB');
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
