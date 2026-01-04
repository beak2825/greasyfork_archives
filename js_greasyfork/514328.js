// ==UserScript==
// @name         [DEPRECATED] [GC] - Active Pet in Sidebar
// @description  [DEPRECATED] Shows a small version of your active pet in the AIO sidebar. Now part of GC officially as of 09/12/2024.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @match        https://www.grundos.cafe/*
// @grant        GM.getValue
// @grant        GM.setValue
// @author       aether
// @namespace    https://github.com/hlmartin/gc-userscripts/
// @version      1.0.1
// @license      MIT
// @supportURL   https://github.com/hlmartin/gc-userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/514328/%5BDEPRECATED%5D%20%5BGC%5D%20-%20Active%20Pet%20in%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/514328/%5BDEPRECATED%5D%20%5BGC%5D%20-%20Active%20Pet%20in%20Sidebar.meta.js
// ==/UserScript==

const GM_ACTIVE_PET_IN_SIDEBAR_KEY = 'gc_ActivePetInSidebar';

const getSavedPetData = async () => {
    return await GM.getValue(GM_ACTIVE_PET_IN_SIDEBAR_KEY, {});
};

const setSavedPetData = async (petData) => {
    await GM.setValue(GM_ACTIVE_PET_IN_SIDEBAR_KEY, petData);
};

const circleImageUrl = (url) => {
    return url.replace(/\/pets\/(.*)\//, "/pets/circle/");
};

const savePetImages = async () => {
    const petNodes = document.querySelectorAll('#quickref_petlist .quickref_pet');

    const petData = Array.from(petNodes).reduce(function(map, petNode) {
        const imgNode = petNode.querySelector("img");
        map[petNode.id] = circleImageUrl(imgNode.src);
        return map;
    }, {});

   await setSavedPetData(petData);

   return petData;
};

const injectIntoSidebar = (content) => {
    const html = `
      <div>
          <strong id="aio-active-header" class="aio-section-header">Active Pet</strong>
          <div class="aioImg">
              ${content}
          </div>
          <div class="clear"></div>
      </div>
    `;

    const dailiesSection = document.querySelector('#aio_sidebar .dailies');
    dailiesSection.insertAdjacentHTML("beforebegin", html);
};

const petImageHtml = (savedPetData, activePetName) => {
    return `<a href="/petlookup/?pet_name=${activePetName}">
              <img title="${activePetName}" src="${savedPetData[activePetName]}" style="max-width: 100px" />
            </a>`
};

const errorHtml = () => {
    return `<span class="aio-subtext">Pet not loaded</span>
            <span class="aio-subtext">
                <a href="/quickref">Quickref</a>
            </span>`
};

const main = async () => {
    if (location.href.includes('/quickref')) {
        await savePetImages();
    }

    const sidebar = document.getElementById('aio_sidebar');
    if (sidebar) {
        const activePetName = document.getElementById('userinfo').querySelectorAll("a[href='/quickref/']")[0].innerText;
        const savedPetData = await getSavedPetData();
        const html = savedPetData[activePetName] && petImageHtml(savedPetData, activePetName) || errorHtml();
        injectIntoSidebar(html);
    }
};

main();
