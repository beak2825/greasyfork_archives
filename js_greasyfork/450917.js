// ==UserScript==
// @name         hentai图片优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  本子详情页加载原图、加载全部和图片放大，方便连续观看
// @author       Buried_Dreams
// @match        https://hentaibeeg.com/*
// @match        https://www.hentai.name/g/*
// @match        https://hentaicolor.net/*
// @match        https://nhentai.xxx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaibeeg.com
// @grant        none
// @namespace    https://greasyfork.org/scripts/450917
// @downloadURL https://update.greasyfork.org/scripts/450917/hentai%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450917/hentai%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const standWebList = {
    'www.hentai.name': {
      reg: /_thumb\./g,
    }
  }

  function getData() {
    const defaultData = {
      reg: /t\./g,
    }
    const standData = standWebList[document.domain]
    let data = standData ?? defaultData
    data = {
      ...data,
      elBoxContainer: '#thumbnail-container',
      rewriteStyle: `
        .thumb-container{
          width: 65vmin!important;
          display: block!important;
          margin: 0 auto!important;
        }
        .thumb-container img{
          width: 100%!important;
        }
        #thumbnail-container .gallerythumb{
          display: block!important;
        }
        #thumbnail-container .gallerythumb img:hover{
          filter: none!important;
        }
        @media screen and (max-width: 500px){
          .thumb-container{
            width: 100%!important;
          }
        }
      `,
      regFruit: '.',
    }
    return data
  }

  const webRewriteData = getData()

  async function cStyle() {
    const style = `
        <style type="text/css">
        ${webRewriteData.rewriteStyle}
        </style>
      `
    $('body').prepend(style)
  }

  function cText(text) {
    const { reg, regFruit } = webRewriteData
    return text.replace(reg, regFruit)
  }

  function init() {
    cStyle()
    const el = $(webRewriteData.elBoxContainer)
    const text = el.html().toString()
    el.html(cText(text))
  }
  $('#showAll').click();
  init()
})();