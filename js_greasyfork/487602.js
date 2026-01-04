// ==UserScript==
// @name снежинки
// @namespace github.com/openstyles/stylus
// @version 2.5
// @description Обозначает эффект снежинок с зимнего квеста
// @author Древоточец
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://catwar.su/cw3/*
// @downloadURL https://update.greasyfork.org/scripts/487602/%D1%81%D0%BD%D0%B5%D0%B6%D0%B8%D0%BD%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/487602/%D1%81%D0%BD%D0%B5%D0%B6%D0%B8%D0%BD%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
let css = `

    div img[src="things/11714.png"], li .exchange img[src="/cw3/things/11714.png"] {
        content: url('https://i.ibb.co/VwZhngG/0a686b10ede9.png');
    }

    div img[src="things/11709.png"], li .exchange img[src="/cw3/things/11709.png"] {
        content: url('https://i.ibb.co/VQq0rw4/0a686b10ede9.png');
    }
    
    div img[src="things/11713.png"], li .exchange img[src="/cw3/things/11713.png"] {
        content: url('https://i.ibb.co/0fzzmgk/image.png');
    }
    
    div img[src="things/11718.png"], li .exchange img[src="/cw3/things/11718.png"] {
        content: url('https://i.ibb.co/ZMGF62v/0a686b10ede9.png');
    }
    
    div img[src="things/11710.png"], li .exchange img[src="/cw3/things/11710.png"] {
        content: url('https://i.ibb.co/x3MkwF8/0a686b10ede9.png');
    }
    
    div img[src="things/11717.png"], li .exchange img[src="/cw3/things/11717.png"] {
        content: url('https://i.ibb.co/QXx4BbS/0a686b10ede9.png');
    }
    
    div img[src="things/11711.png"], li .exchange img[src="/cw3/things/11711.png"] {
        content: url('https://i.ibb.co/35bQRKJ/0a686b10ede9.png');
    }
    
    div img[src="things/11715.png"], li .exchange img[src="/cw3/things/11715.png"] {
        content: url('https://i.ibb.co/68KfV3W/0a686b10ede9.png');
    }
    
    div img[src="things/11712.png"], li .exchange img[src="/cw3/things/11712.png"] {
        content: url('https://i.ibb.co/gdkghwC/0a686b10ede9.png');
    }
    
    div img[src="things/11716.png"], li .exchange img[src="/cw3/things/11716.png"] {
        content: url('https://i.ibb.co/VqY6P1h/0a686b10ede9.png');
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
