// ==UserScript==
// @name звездочки
// @namespace github.com/openstyles/stylus
// @version 1.2
// @description Обозначает эффект звездочек с зимнего квеста
// @author Древоточец (снова)
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://catwar.net/*
// @downloadURL https://update.greasyfork.org/scripts/528764/%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D0%BE%D1%87%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/528764/%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D0%BE%D1%87%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
let css = `
     img[src="things/14024.png"], li .exchange img[src="/cw3/things/14024.png"] {
        content: url('https://i.ibb.co/HLYjxrWv/image.png');
    } /* могущество */
    
     img[src="things/14026.png"], li .exchange img[src="/cw3/things/14026.png"] {
        content: url('https://i.ibb.co/Z66DvXcM/image.png');
    } /* активность */
    
     img[src="things/14027.png"], li .exchange img[src="/cw3/things/14027.png"] {
        content: url('https://i.ibb.co/V0sbvkBX/image.png');
    } /* ун */
    
     img[src="things/14045.png"], li .exchange img[src="/cw3/things/14045.png"] {
        content: url('https://i.ibb.co/qF1YnCQw/image.png');
    } /* здоровье */
    
     img[src="things/14029.png"], li .exchange img[src="/cw3/things/14029.png"] {
        content: url('https://i.ibb.co/dxHX06r/image.png');
    } /* какашка пу */
    
     img[src="things/14030.png"], li .exchange img[src="/cw3/things/14030.png"] {
        content: url('https://i.ibb.co/gbXTDv3n/image.png');
    } /* бу */
    
     img[src="things/14032.png"], li .exchange img[src="/cw3/things/14032.png"] {
        content: url('https://i.ibb.co/JFHhphXV/image.png');
    } /* лу */
    
     img[src="things/14033.png"], li .exchange img[src="/cw3/things/14033.png"] {
        content: url('https://i.ibb.co/1JP1Mz2z/image.png');
    } /* уз */
    
     img[src="things/14031.png"], li .exchange img[src="/cw3/things/14031.png"] {
        content: url('https://i.ibb.co/tMxzk8Xw/image.png');
    } /* вд */
    
     img[src="things/14028.png"], li .exchange img[src="/cw3/things/14028.png"] {
        content: url('https://i.ibb.co/hFnskgX6/image.png');
    } /* ку */
    
     img[src="things/14025.png"], li .exchange img[src="/cw3/things/14025.png"] {
        content: url('https://i.ibb.co/Pzmrjj08/image.png');
    } /* -тб */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
