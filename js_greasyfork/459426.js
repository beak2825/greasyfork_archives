// ==UserScript==
// @name        Hello! Project Application Link Emphasizer
// @namespace   https://twitter.com/LoveRuruDambara
// @version     1.1
// @description ハロプロFCサイトのお申し込みはこちらからを目立つように表示する
// @include     https://www.up-fc.jp/helloproject/news_Info.php?id=*
// @author      cumin
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459426/Hello%21%20Project%20Application%20Link%20Emphasizer.user.js
// @updateURL https://update.greasyfork.org/scripts/459426/Hello%21%20Project%20Application%20Link%20Emphasizer.meta.js
// ==/UserScript==
function update(elm) {
    if (elm.textContent.match(/こちら/)) {
        elm.innerHTML = '<span style="color: red; font-size: 75px; "> ' + 'こちら' + '</span>';
    }
}
 
const bTags = document.getElementsByTagName("b");
 
for (let i = 0; i < bTags.length; i++) {
    if (bTags[i].textContent.match(/お申込みは/)) {
        if(bTags[i].parentElement.tagName.toLowerCase() == 'font') {
            const fontTag = bTags[i].parentElement;
            const aTag = fontTag.nextElementSibling;
            const uTag = aTag.firstElementChild;
            const fontTag2 = uTag.firstElementChild;
            let bTag = fontTag2.firstElementChild;
            update(bTag);
        }
        else {
            const aTag = bTags[i].nextElementSibling;
            const uTag = aTag.firstElementChild;
            let bTag = uTag.firstElementChild;
            update(bTag);
        }
    }
}