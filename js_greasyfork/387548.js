// ==UserScript==
// @name         Item Stats Sort
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/bazaar.php*
// @match       *.torn.com/displaycase.php*
// @match       *.torn.com/item.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387548/Item%20Stats%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/387548/Item%20Stats%20Sort.meta.js
// ==/UserScript==

GM_addStyle(`
#x_item_stats {
  background-color: #c13c3c;
  color: #eaeaea;
  cursor: pointer;
  padding: 1em;
  position: fixed;
  right: 0;
}
`)

const item_stats = async () => {
  const category_wrap = document.querySelector('.category-wrap')
  let cat_index = 0
  category_wrap.querySelectorAll('UL.items-cont').forEach((UL) => {
    console.log(cat_index)
    for (const LI of UL.children) {
      const name_DIV = LI.querySelector('.name-wrap')
      if (name_DIV) {
        const item_name = name_DIV.innerText
        const acc_icon = LI.querySelector('.bonus-attachment-item-accuracy-bonus')
        const dmg_icon = LI.querySelector('.bonus-attachment-item-damage-bonus')
        const def_icon = LI.querySelector('.bonus-attachment-item-defence-bonus')
        if (acc_icon && dmg_icon) {
          const acc = parseFloat(acc_icon.parentElement.innerText)
          const dmg = parseFloat(dmg_icon.parentElement.innerText)
          LI.querySelector('.bonuses-wrap').children[2].innerHTML = ((dmg * acc)/100).toFixed(2)
        }
        else if(def_icon) {
          const def = parseFloat(def_icon.parentElement.innerText)
        }
      }
    }
    cat_index += 1
  })
}

document.querySelector('div.content').insertAdjacentHTML('beforebegin', `<div id="x_item_stats">Item Stats</div>`)
document.querySelector('#x_item_stats').addEventListener('click', (e) => {
  item_stats()
})