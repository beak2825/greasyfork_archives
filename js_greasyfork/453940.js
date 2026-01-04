// ==UserScript==
// @name        MWL - MyWaifuList Auto Comment Expander
// @name:tr     MWL - MyWaifuList Otomatik Yorum Açıcısı
// @namespace   https://myanimelist.net/profile/kyoyatempest
// @match       https://mywaifulist.moe/waifu/*
// @version     1.5
// @author      kyoyacchi
// @description Auto expands the comments for the waifu you're viewing comments.
// @description:tr Yorumlarını görüntülediğiniz waifu'nun yorumlarını otomatik olarak açar.
// @license gpl-3.0
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/453940/MWL%20-%20MyWaifuList%20Auto%20Comment%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/453940/MWL%20-%20MyWaifuList%20Auto%20Comment%20Expander.meta.js
// ==/UserScript==


let buton = document.getElementsByClassName("inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-transparent dark:border-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150")


if (!buton) {
  return
}

var otoaç = setInterval(()=> {
  buton[0].click();
},1500)

setTimeout(()=> {
  clearInterval(otoaç)
},60000)//1 min.
//stops after 1 min.