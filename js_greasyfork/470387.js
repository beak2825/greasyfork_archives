// ==UserScript==
// @name         imgflip_saver
// @version      1.2
// @description  Free ImgFlip Meme Generator Saves
// @author       Jiggly Beats
// @license      ISC
// @match        *://imgflip.com/memegenerator*
// @icon         https://imgflip.com/favicon.ico?b
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/1121305
// @downloadURL https://update.greasyfork.org/scripts/470387/imgflip_saver.user.js
// @updateURL https://update.greasyfork.org/scripts/470387/imgflip_saver.meta.js
// ==/UserScript==

unsafeWindow.addEventListener('load', function () {
  const replaceNode = (e, n) => {
      if (n) e.parentNode.replaceChild(e.cloneNode(!0), e);
      else {
        for (var a = e.cloneNode(!1); e.hasChildNodes();) a.appendChild(e.firstChild);
        e.parentNode.replaceChild(a, e)
      }
    },
    gB = () => document.querySelector("#mm-settings > div.gen-wrap > div.gen-wrap-btns.clearfix > button.mm-generate.b.but"),
    canvas = document.querySelector("#mm-preview-outer > div.mm-preview > canvas"),
    nSB = (e, n) => {
      Object.assign(document.createElement("a"), {
        style: "display:none!important;",
        href: window.URL.createObjectURL(e),
        download: n
      }).click()
    };
  replaceNode(gB()), Object.assign(gB(), {
    innerText: "Free Download <3",
    onclick: () => {
      canvas.toBlob((e => {
        nSB(e, `meme-${canvas.width}x${canvas.height}.png`)
      }))
    }
  });
});
