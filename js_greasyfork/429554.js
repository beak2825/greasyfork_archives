// ==UserScript==
// @name         Curseforge All Files Link
// @namespace    https://greasyfork.org/users/159960
// @version      1.1.1
// @description  Change CurseForge's download buttons to file list buttons. Optionally, you can show only Fabric mods.
// @author       shikikan
// @match        https://www.curseforge.com/minecraft/mc-mods*
// @match        https://www.curseforge.com/minecraft/texture-packs*
// @match        https://www.curseforge.com/minecraft/worlds*
// @match        https://www.curseforge.com/minecraft/mc-addons*
// @match        https://www.curseforge.com/minecraft/customization*
// @match        https://www.curseforge.com/minecraft/bukkit-plugins*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429554/Curseforge%20All%20Files%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/429554/Curseforge%20All%20Files%20Link.meta.js
// ==/UserScript==

(()=>{
const hideForge = true;

const $ = (sel, elem = document.body) => elem.querySelector(sel);
const $$ = (sel, elem = document.body) => [...elem.querySelectorAll(sel)];

const isCategory = ($("select#filter-sort"));
const isSearch = ($(".search-form"));

if(isCategory || isSearch){
  $$("a[href]").forEach(a => {
    if (a.getAttribute("href").slice(-16, -8) == "download" || a.getAttribute("href").slice(-8) == "download") {
      a.setAttribute("href", a.getAttribute("href").slice(0, -9) + "/files/all");
      a.setAttribute("target", "$blank");
    };
  });
}
if(hideForge && isSearch) {
  $$(".my-2").forEach(listitem => {
    listitem.style.display = "none";
    $$(".project-listing-row > .w-full > .-mx-1:not(.mb-2) > .px-1 > a > figure", listitem).forEach(icon => {
      if (icon.getAttribute("title") == "Fabric") {
        listitem.style.display = "block";
      }
    })
  })
}
  
})();
