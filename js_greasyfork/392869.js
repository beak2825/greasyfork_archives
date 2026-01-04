// ==UserScript==
// @name           Google_search_filter_with_Language
// @name:zh-CN            Google_search_filter_with_Language
// @name:zh-TW            Google_search_filter_with_Language
// @name:ja            Google_search_filter_with_Language
// @description:zh-CN     Google result filter by language
// @description:zh-TW     Google result filter by language
// @description:ja     Google result filter by language
// @description    Google result filter by language
// @namespace      Google_search_filter_with_Language
// @supportURL     https://github.com/zhuzemin
// @include        https://www.google.*/search*
// @author         zhuzemin
// @version        1.12
// @grant		   none
// @downloadURL https://update.greasyfork.org/scripts/392869/Google_search_filter_with_Language.user.js
// @updateURL https://update.greasyfork.org/scripts/392869/Google_search_filter_with_Language.meta.js
// ==/UserScript==
let searchBtn=document.querySelector("button.Tg7LZd");
let lr = document.createElement("lr");
lr.innerHTML = '<lr><a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '').replace(/$/, '&lr=lang_en')+'">EN</a>/<a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '').replace(/$/, '&lr=lang_ja')+'">JA</a>/<a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '').replace(/$/, '&lr=lang_zh-TW')+'">TW</a>/<a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '').replace(/$/, '&lr=lang_zh-CN')+'">CN</a>/<a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '').replace(/$/, '&lr=lang_zh-CN|lang_zh-TW')+'">TW&CN</a>/<a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '')+'">All Language</a></lr>'
searchBtn.parentNode.insertBefore(lr, searchBtn);
let allLinks=document.querySelectorAll('a.hide-focus-ring');
for(let link of allLinks){
  if(/(isch)|(vid)/.test(link.href)){
    searchBtn.parentNode.insertBefore(link, searchBtn);
  }
}
