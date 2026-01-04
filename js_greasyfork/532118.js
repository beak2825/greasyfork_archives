// ==UserScript==
// @name гей мосс
// @author лемондемон
// @run-at document-start
// @description gay moss
// @match https://catwar.net/*
// @version 0.0.1.20250407183805
// @namespace https://greasyfork.org/users/1455158
// @downloadURL https://update.greasyfork.org/scripts/532118/%D0%B3%D0%B5%D0%B9%20%D0%BC%D0%BE%D1%81%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/532118/%D0%B3%D0%B5%D0%B9%20%D0%BC%D0%BE%D1%81%D1%81.meta.js
// ==/UserScript==

(function() {
let css = `
     img[src="things/75.png"], li .exchange img[src="/cw3/things/75.png"] {
        content: url('http://d.zaix.ru/Mwgc.gif');
    } 
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
