// ==UserScript==
// @name 天区new
// @description 该插件用于某社区网站
// @version 0.1.0
// @match  *://hj8781e.com/*
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @require https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @license      AGPL License
// @namespace https://greasyfork.org/users/1279066
// @downloadURL https://update.greasyfork.org/scripts/490826/%E5%A4%A9%E5%8C%BAnew.user.js
// @updateURL https://update.greasyfork.org/scripts/490826/%E5%A4%A9%E5%8C%BAnew.meta.js
// ==/UserScript==
function clearTr() {
  let allTr = $('.tab-bbs-list').find('tr')
  for(let i = 0; i < allTr.length; i++) {
    $(allTr[i]).css('display', 'none')
  }

  let shipin = $('.title-icon').find('img[src="/images/common/v2/video.png"]')
  for(let i = 0; i < shipin.length; i++) {
    $(shipin[i]).parent().parent().parent().parent().css('display', 'block')
    $(shipin[i]).parent().parent().parent().css('background', '#00fff3')
  }

  let zhiding = $('.title-icon').find('img[src="/images/common/v2/top.png"]')
  for(let i = 0; i < zhiding.length; i++) {
    $(zhiding[i]).parent().parent().parent().parent().css('display', 'none')
  }

  let zhiding1 = $('.title-icon').find('span[class="alltop"]')
  for(let i = 0; i < zhiding1.length; i++) {
    $(zhiding1[i]).parent().parent().parent().parent().css('display', 'none')
  }

  let chushou = $('.title-icon').find('img[src="/images/common/v2/sale.png"]')
  for(let i = 0; i < chushou.length; i++) {
    $(chushou[i]).parent().parent().parent().parent().css('display', 'none')
  }
}

var newel = document.createElement('button');
newel.style.width="160px";
newel.style.height="60px";
newel.style.position="fixed";
newel.style.top="520px";
newel.style.right="30px";
newel.setAttribute("id",'clearBtn');
var newtext = document.createTextNode("过滤"); newel.appendChild(newtext);
document.body.appendChild(newel);
$("#clearBtn").on("click",function (){clearTr()});