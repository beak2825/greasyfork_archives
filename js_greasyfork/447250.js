// ==UserScript==
// @name KTT Save
// @namespace http://tampermonkey.net/
// @version 0.4
// @description save KTT, So Good day and Nakayoshi Tabi images
// @author 黃色心臟
// @match https://*.familyclub.jp/s/jwb/diary/*
// @run-at document-end
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447250/KTT%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/447250/KTT%20Save.meta.js
// ==/UserScript==

(function() {
    var imgs, date, row, i, res = [], lnk;

    if(document.getElementsByClassName("page--special").length > 0) { //nakayoshi
        imgs = document.querySelectorAll('figure > img, .img-single')
        for (i = imgs.length-4; i >= 1; i--) {
            if (imgs[i].src && !exist(imgs[i].src)) res.push(imgs[i].src);
        }
        date = document.querySelector('time.entry__date').innerText
        row = document.querySelector('.entry__headline');
    } else if (document.getElementsByClassName("section-hero").length > 0) {//so good day
        date = "so_good_day"
        row = document.querySelector('.section-hero')
        imgs = document.querySelectorAll('.modal-content > img')
        for (i = imgs.length-1; i >= 0; i--) {
            if (imgs[i].src && !exist(imgs[i].src)) res.push(imgs[i].src);
        }
    } else {
        date = document.querySelector('p.entry__date').innerText
        row = document.querySelector('.entry__posted_on')
        imgs = document.querySelectorAll('div > img')
        for (i = imgs.length-1; i >= 0; i--) {
            if (imgs[i].src && !exist(imgs[i].src)) res.push(imgs[i].src);
        }
    }

    window.addEventListener('load', () => {
        addButton('Save Image', saveImage)
    })

    // add button function
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {border: 'solid 2px', borderRadius:'3px', padding: '4px 6px', marginLeft: '8px', marginTop: '8px'}
        let button = document.createElement('button'), btnStyle = button.style
        row.appendChild(button)
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
        lnk.download = date;
        lnk.style.display = "none";
        document.body.appendChild(lnk);
        doit(lnk,res);
    }

})()