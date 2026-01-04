// ==UserScript==
// @name         Petit Lyrics コピー制限解除
// @version      0.1
// @description  Petit Lyrics の歌詞をコピーできるようにします　＊使用は自己責任でね
// @author       炎筆
// @namespace    https://greasyfork.org/users/803913
// @match        https://petitlyrics.com/lyrics/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=petitlyrics.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440576/Petit%20Lyrics%20%E3%82%B3%E3%83%94%E3%83%BC%E5%88%B6%E9%99%90%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/440576/Petit%20Lyrics%20%E3%82%B3%E3%83%94%E3%83%BC%E5%88%B6%E9%99%90%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

GM_addStyle(`
#newLyrics > div {
  padding-top: 5px;
  padding-bottom: 5px;
}
`)

const modifyLyricsNode = function($oldLyrics) {
    $oldLyrics.style.display = 'none';

    const $newLyrics = document.createElement('div');

    $newLyrics.id = 'newLyrics';
    $oldLyrics.parentNode.insertBefore($newLyrics, $oldLyrics);

    const fillText = CanvasRenderingContext2D.prototype.fillText;

    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
        let elm = null;

        if(text !== '') {
            elm = document.createElement('div');
            elm.innerText = text;
        }
        else {
            elm = document.createElement('br');
        }

        $newLyrics.append(elm);
    };
};

const observer = new MutationObserver(mutations => {
    for(const mutation of mutations) {
        for(const node of mutation.addedNodes) {
            if(node.id === 'lyrics') {
                modifyLyricsNode(node);
            }
        }
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});