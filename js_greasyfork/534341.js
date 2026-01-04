// ==UserScript==
// @name Save Family Club Web Images
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Save Family Club Web Images(New Version)
// @author 黃色心臟
// @match https://*.familyclub.jp/s/jwb/diary/*
// @run-at document-end
// @grant GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534341/Save%20Family%20Club%20Web%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/534341/Save%20Family%20Club%20Web%20Images.meta.js
// ==/UserScript==

(function() {
    var imgs, date, row, i, res = [], lnk, element, artist;

    date = document.querySelector('div.article__posted').innerText;
    row = document.querySelector(".article.row");
    artist = document.querySelector(".artist-info");
    imgs = document.querySelectorAll('.article-content.wysiwyg-area img')
    for (i = imgs.length-1; i >= 0; i--) {
        if (imgs[i].src && !exist(imgs[i].src)) res.push(imgs[i].src);
    }

    window.addEventListener('load', () => {
        addButton('Save Image', saveImage)
    })

    // add button function
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {border: 'solid 2px', borderRadius:'3px', padding: '4px 6px', marginLeft: '20px', marginBottom: '15px'}
        let button = document.createElement('button'), btnStyle = button.style
        row.insertBefore(button, row.firstChild);
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    function exist(url) {
        url = url.toLowerCase();
        for (var i = res.length-1; i >= 0; i--){
            if (res[i].toLowerCase() === url) return 1;
        }
        return 0;
    }
    function doit(lnk, res) {
        if (res.length) {
            lnk.href = res.splice(0, 1)[0];
            lnk.click();
            setTimeout(doit, 100, lnk, res);
        } else lnk.parentNode.removeChild(lnk);
    }
    function saveImage() {
        lnk = document.createElement("A");
        lnk.download = artist.innerText + date + '.jpg';
        lnk.style.display = "none";
        document.body.appendChild(lnk);
        doit(lnk,res);
    }

})()