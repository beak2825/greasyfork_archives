// ==UserScript==
// @name     Wallhaven download full size
// @version  1.1
// @grant    none
// @include https://wallhaven.cc/w/*
// @description Adds a button to quickly download the full image
// @license MIT
// @namespace https://greasyfork.org/users/833672
// @downloadURL https://update.greasyfork.org/scripts/435221/Wallhaven%20download%20full%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/435221/Wallhaven%20download%20full%20size.meta.js
// ==/UserScript==

const add_button= async (url) =>{
    const download = document.createElement("a");
    const image = document.getElementById("wallpaper").src;
    let blob = await fetch(image).then(b => b.blob());
    download.classList.add("button");
    download.innerText ="Download";
    download.href = URL.createObjectURL(blob);
    download.download = image.replace(/^.*[\\\/]/, '');
    Array.from(document.querySelectorAll(".color-palette")).pop().insertAdjacentElement("afterend",download);
}

add_button();