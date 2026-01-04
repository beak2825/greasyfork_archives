// ==UserScript==
// @name        Ferium add command for curseforge
// @namespace   Violentmonkey Scripts
// @match       https://www.curseforge.com/minecraft/mc-mods/*
// @match       https://www.curseforge.com/minecraft/mc-mods
// @license     MIT
// @grant       none
// @version     0.2.0
// @author      -
// @description 2022/6/6 21:48:18
// @downloadURL https://update.greasyfork.org/scripts/446090/Ferium%20add%20command%20for%20curseforge.user.js
// @updateURL https://update.greasyfork.org/scripts/446090/Ferium%20add%20command%20for%20curseforge.meta.js
// ==/UserScript==


const elem = document.querySelector('div[class="-mx-1 flex-wrap flex"]')
if(elem) {
  const id = elem.querySelector("[data-project-id]").dataset.projectId
  console.log(id)
  elem.innerHTML += `<div class="px-1">
    <a href="javascript:void(0)"
       onclick='navigator.clipboard.writeText("ferium add ${id}");this.innerText="Copied!"'
       class="button button--hollow"
       data-tooltip="ferium add ${id}"
       one-link-mark="yes">
      <span class="button__text">Ferium</span>
  </a></div>`
}

const searched = document.querySelectorAll('div[class="my-2"] > .project-listing-row')
for(const project of Array.from(searched)) {
  const id = project.querySelector('a[data-project-id]').dataset.projectId
  if(!project.querySelector('a[data-tooltip="ferium add ${id}"]'))
    project.querySelector('div[class="flex mb-2 -mx-1"]').innerHTML += `<div class="px-1">
      <a href="javascript:void(0)"
         onclick='navigator.clipboard.writeText("ferium add ${id}");this.innerText="Copied!"'
         class="button button--hollow"
         data-tooltip="ferium add ${id}"
         one-link-mark="yes">
        <span class="button__text">Ferium</span>
      </a></div>`
}