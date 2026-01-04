// ==UserScript==
// @name смешная землеройка catwar.net
// @namespace cw3zemleroyka
// @version 1.1
// @description заменяет изображение землеройки на смешное
// @author кузя
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://catwar.net/cw3/*
// @downloadURL https://update.greasyfork.org/scripts/488706/%D1%81%D0%BC%D0%B5%D1%88%D0%BD%D0%B0%D1%8F%20%D0%B7%D0%B5%D0%BC%D0%BB%D0%B5%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20catwarnet.user.js
// @updateURL https://update.greasyfork.org/scripts/488706/%D1%81%D0%BC%D0%B5%D1%88%D0%BD%D0%B0%D1%8F%20%D0%B7%D0%B5%D0%BC%D0%BB%D0%B5%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20catwarnet.meta.js
// ==/UserScript==


(function() {
let css = `

    div img[src="things/5711.png"], li .exchange img[src="/cw3/things/5711.png"] {
        content: url('https://i.ibb.co/0QGFYz2/ETxC.png');
    }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();