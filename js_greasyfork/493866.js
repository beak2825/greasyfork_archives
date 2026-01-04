// ==UserScript==
// @name базированный шлепа гигачад catwar.net
// @namespace basedfloppagigachad
// @version 1.1
// @description заменяет изображение котенка каракала на версию художника с ID 505212
// @author кузя
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://catwar.net/cw3/*
// @downloadURL https://update.greasyfork.org/scripts/493866/%D0%B1%D0%B0%D0%B7%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%88%D0%BB%D0%B5%D0%BF%D0%B0%20%D0%B3%D0%B8%D0%B3%D0%B0%D1%87%D0%B0%D0%B4%20catwarnet.user.js
// @updateURL https://update.greasyfork.org/scripts/493866/%D0%B1%D0%B0%D0%B7%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%88%D0%BB%D0%B5%D0%BF%D0%B0%20%D0%B3%D0%B8%D0%B3%D0%B0%D1%87%D0%B0%D0%B4%20catwarnet.meta.js
// ==/UserScript==


(function() {
let css = `

    div img[src="things/5706.png"], li .exchange img[src="/cw3/things/5706.png"] {
        content: url('https://i.ibb.co/6437wJ9/image.png');
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