// ==UserScript==
// @name         Funimation AP Features
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.0.2
// @description  Search on AP and opening full size cover
// @author       Quin15
// @match        https://www.funimation.com/shows/*
// @icon         https://www.google.com/s2/favicons?domain=funimation.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425613/Funimation%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/425613/Funimation%20AP%20Features.meta.js
// ==/UserScript==

var checkElems = function() {if ((document.querySelector('a[data-test="content-hero__watch-cta"]') || document.querySelector('button[data-test="content-hero__watch-cta"]')) && document.querySelector('div[role="img"] div[class^="v-image__image"]').style.backgroundImage) {setTimeout(addButtons, 200)} else {setTimeout(checkElems, 200);}};
checkElems();

var addButtons = function() {
    var searchAP = document.createElement('a');
    searchAP.setAttribute('data-v-06672a12', '')
    searchAP.className = 'px-5 v-btn v-btn--has-bg v-btn--router theme--dark v-size--large secondary';
    searchAP.style.minWidth = "212px";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:40px;"><span class="v-btn__content"><div data-v-06672a12="" style="margin-left:10px;"> Search On AP </div></span>`;
    document.querySelector('div[class="v-card__actions order-1 order-md-5 px-0 pb-md-0"]').appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/anime/all?name=" + document.querySelector('h1[data-test="content-hero__title"]').innerText), "")});

    var coverImg = document.createElement('a');
    coverImg.setAttribute('data-v-06672a12', '')
    coverImg.className = 'px-5 v-btn v-btn--has-bg v-btn--router theme--dark v-size--large secondary';
    coverImg.style.minWidth = "212px";
    coverImg.innerHTML = `<img src="` + document.querySelector('div[role="img"] div[class^="v-image__image"]').style.backgroundImage.replace(/.*url\(\"/, '').replace('")', '') + `" style="float:left;height:40px;"><span class="v-btn__content"><div data-v-06672a12="" style="margin-left:10px;"> Open Cover Image </div></span>`;
    document.querySelector('div[class="v-card__actions order-1 order-md-5 px-0 pb-md-0"]').appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(document.querySelector('div[role="img"] div[class^="v-image__image"]').style.backgroundImage.replace(/.*url\(\"/, '').replace('")', '').replace(/upload\/.*\,c\_fill/, 'upload/c_fill'), "")});
}