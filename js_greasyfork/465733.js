// ==UserScript==
// @name         Discord Server Banner Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Removes the banner image in boosted discord servers.
// @author       You
// @match        https://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465733/Discord%20Server%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/465733/Discord%20Server%20Banner%20Remover.meta.js
// ==/UserScript==

setInterval(() => {
    const bannerPic = document.querySelector('div.animatedContainer-2laTjx');
    const bannerSpaceParent = document.querySelector('ul.content-yjf30S');
    const bannerSpace = bannerSpaceParent.querySelector('div');
    bannerPic.style.display = 'none'; //hides the banner picture
    bannerSpace.style.display = 'none'; // hides the banner space

    const mainClassContainer = document.querySelector('div.container-1-ERn5'); // removes three classes that banner servers have which restores black line under the title container box
    mainClassContainer.classList.remove("hasBanner-2IrYih");
    mainClassContainer.classList.remove("bannerVisible-Vkyg1I");
    mainClassContainer.classList.remove("communityInfoVisible-3zc5_s");
}, 0);
