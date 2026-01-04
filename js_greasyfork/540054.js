// ==UserScript==
// @name        SoM'25 Userscript
// @namespace    http://saahild.com
// @version      1.0
// @description  Userscript to add some features to SoM'25 (edit the config in the file!)
// @author       Neon
// @match        https://summer.hackclub.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540054/SoM%2725%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/540054/SoM%2725%20Userscript.meta.js
// ==/UserScript==


// Main script logic that uses the config
(function () {
  'use strict';
const config = {
hide_help: true,
hide_music: true,
fake_admin: false, 
hide_admin: true,
}

const adminButton = `<li class="flex justify-start border-2 border-dashed border-orange-500 bg-orange-500/10" style="margin-right: 10px; border-radius: 10px;">
  <form class="button_to" method="get" action="/admin"><button class="relative inline-block group py-2 cursor-pointer text-2xl" type="submit">
    <span class="relative z-10 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="w-8 mr-4 h-8"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="#4A2D24" d="M15.275 12.475L11.525 8.7L14.3 5.95l-.725-.725L8.8 10q-.3.3-.7.3t-.7-.3t-.3-.712t.3-.713l4.75-4.75q.6-.6 1.413-.6t1.412.6l.725.725l1.25-1.25q.3-.3.713-.3t.712.3L20.7 5.625q.3.3.3.713t-.3.712zM4 21q-.425 0-.712-.288T3 20v-1.925q0-.4.15-.763t.425-.637l6.525-6.55l3.775 3.75l-6.55 6.55q-.275.275-.637.425t-.763.15z"></path></svg>

      <span class="text-nowrap tracking-tight pointer-events-none text-3xl transition-opacity duration-200 opacity-0 w-[0px]" data-sidebar-target="collapseFade">
        Admin
</span></span>
    <div class="absolute transition-all duration-150 bottom-1 pr-3 box-content bg-[#C7A077] rounded-full z-0 group-hover:opacity-100 h-6 opacity-0 w-[36px]" data-kind="underline" data-sidebar-target="underline" style="transform: translateX(-10px);"></div>
</button></form>
          </li>`
const shop_admin_per_block = `<div class="p-2 border-2 border-dashed border-orange-500 bg-orange-500/10 w-fit h-fit ">    <a class="underline" target="_blank" href="/admin/shop_items/55">administrate it?</a>
</div>`

  // TODO: migrate to when new elemnt updated etc
  setInterval(() => {
    console.log("meow")
  let mconfig = {
    has_already_added_admin_btn: false,
    has_already_added_sadmin_btn: false,
  }

  if(config.hide_help) {
    let hqa = document.getElementById("tutorial-help-btn")
    if(hqa) {
        hqa.remove()
    }
    }
    if(config.hide_music) {
        let mqa = document.getElementById("music-toggle")
        if(mqa) {
            mqa.remove()
        }
    }
    if(config.fake_admin && !config.hide_admin) {
        const navqa = document.querySelector('[data-sidebar-target="links"]');
        if(navqa && !mconfig.has_already_added_admin_btn) {
            navqa.insertAdjacentHTML('beforeend', adminButton);
            mconfig.has_already_added_admin_btn = true;
        }
        if(window.location.pathname === '/shop') {
        let amount_of_shop_items = document.querySelector('[class="flex flex-col sm:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"]').children.length
// add top elemt
let shop_number_thing = `<div class="p-2 border-2 border-dashed border-orange-500 bg-orange-500/10 w-fit h-fit mb-4">    <p>${amount_of_shop_items} items - <a class="underline" href="/admin/shop_items">edit them?</a></p>
</div>`
if(mconfig.has_already_added_sadmin_btn) {
    let h1Under = document.querySelector('[class="text-4xl sm:text-5xl mb-0"]')
h1Under.parentElement.insertBefore(shop_number_thing, h1Under.nextSibling);
mconfig.has_already_added_sadmin_btn = true;
}
// TODO: work more on this
}
    }
    if(config.hide_admin && !config.fake_admin) {
        Array.from(document.querySelectorAll('[class*="border-orange-500 bg-orange-500/10"]')).forEach(e=>e.remove())
        if(window.location.href.includes('/admin')) {
            window.location.href = '/';
        }
    }
  
  }, 50)
})();