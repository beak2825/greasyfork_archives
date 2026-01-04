// ==UserScript==
// @name         Random Rule34
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Borda nas thumbnails e Random favoritos
// @author       You
// @match        https://rule34.xxx/index.php?page=favorites*
// @match        https://rule34.xxx/index.php?page=post*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461592/Random%20Rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/461592/Random%20Rule34.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //document.querySelectorAll(".thumb img").forEach((v,i)=>{const arrs = v.title.split(" "); const find = arrs.find((a)=>a=="femboy"); find!==undefined?v.style.border="2px solid pink":''});//old
    document.querySelectorAll(".thumb img").forEach((v,i)=>{const arrs = v.title.split(" "); const find = ['femboy'].every(t=>arrs.includes(t)); find?v.style.border="2px solid pink":''});
    document.querySelectorAll(".thumb img").forEach((v,i)=>{const arrs = v.title.split(" "); const find = ['futanari'].every(t=>arrs.includes(t)); find?v.style.border="2px solid green":''});
    document.querySelectorAll(".thumb img").forEach((v,i)=>{const arrs = v.title.split(" "); const find = ['video'].every(t=>arrs.includes(t)); find?v.style.border="2px solid blue":''});
    document.querySelectorAll(".thumb img").forEach((v,i)=>{const arrs = v.title.split(" "); const find = ['video','futanari'].every(t=>arrs.includes(t)); find?v.style.border="2px solid yellow":''});

    if(window.location.search.search('rand') !== -1){

        const lastpage = document.querySelector("[name=lastpage]") || document.querySelector("[alt='last page']");

        const value = lastpage?.attributes?.onclick?.value || lastpage.href;

        const q = new URLSearchParams(value);

        const pid = q.get('pid');

        const id = parseInt(pid.match(/\d+/)[0]);

        setTimeout(()=>{
            window.location.href = window.location.href.split("&pid")[0]+'&pid='+Math.floor(Math.random() * (id - 0) + 0)+'&gerado';
        },2000);

    }

    if(window.location.search.search('gerado') !== -1){
        setTimeout(()=>{
            window.location.href = document.querySelectorAll('.thumb')[Math.floor(Math.random() * (document.querySelectorAll('.thumb').length - 0) + 0)].querySelector('a').href;
        },2000);
    }
})();