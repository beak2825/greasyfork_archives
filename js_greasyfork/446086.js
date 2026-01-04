// ==UserScript==
// @name        Ferium add command for modrinth
// @namespace   Violentmonkey Scripts
// @match       https://modrinth.com/*
// @license     MIT
// @grant       none
// @version     0.2.3
// @author      -
// @description 2022/6/6 19:57:03
// @downloadURL https://update.greasyfork.org/scripts/446086/Ferium%20add%20command%20for%20modrinth.user.js
// @updateURL https://update.greasyfork.org/scripts/446086/Ferium%20add%20command%20for%20modrinth.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations, observer) => {
    for(const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.target.id === 'search-results') {
            for(const node of mutation.addedNodes) {
                if(!node) continue
                const buttons = node.querySelector('.title')
                if(node.className === 'project-card base-card padding-bg' && !buttons.querySelector('button[title^="ferium"]')) {
                  const title = node.querySelector('.title a').href.match(/.*\/(.*)/)[1]
                  buttons.innerHTML += `<button class="iconified-button" onclick='navigator.clipboard.writeText("ferium add ${title}");this.innerText="Copied!"' title="ferium add ${title}">Ferium</button>`
                }
            }
        }
    }
});
observer.observe(document.body, { attributes: false, childList: true, subtree: true });

// Mod detail
const tabs = document.querySelector(".navigation-card > nav");
const id = location.href.match(/mod\/(.+?)\/?$/)
if(tabs && id) {
  tabs.innerHTML += `<a class="nav-link button-animation" data-v-5a76b3fa="" href="javascript:void(0)" onclick='navigator.clipboard.writeText("ferium add ${id[1]}");this.innerHTML="<span>Copied!</span>"' title="ferium add ${id[1]}"><span>Ferium</span></button>`
}


for(const node of Array.from(document.querySelectorAll('.project-card.base-card'))) {
  console.log(node)
  const buttons = node.querySelector('.title')
  if(!buttons.querySelector('button[title^="ferium"]')) {
    const title = node.querySelector('.title a').href.match(/.*\/(.*)/)[1]
    buttons.innerHTML += `<button class="iconified-button" onclick='navigator.clipboard.writeText("ferium add ${title}");this.innerText="Copied!"' title="ferium add ${title}">Ferium</button>`
  }
}
