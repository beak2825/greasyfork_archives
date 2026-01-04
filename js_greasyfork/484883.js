// ==UserScript==
// @name         KTT Save Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  save the whole KTT page as a long image
// @author       黃色心臟
// @match        https://*.familyclub.jp/s/jwb/diary/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484883/KTT%20Save%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/484883/KTT%20Save%20Page.meta.js
// ==/UserScript==

(function() {
    addScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    var date, row, toCapture;

    date = document.querySelector('p.entry__date').innerText
    row = document.querySelector('.entry__posted_on')
    toCapture = document.getElementsByClassName('site-main')[0];

    window.addEventListener('load', () => {
        addButton('Save Page', savePage)
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

    function addScript(url) {
        var script = document.createElement('script');
        script.type = 'application/javascript';
        script.src = url;
        document.head.appendChild(script);
    }

    function download(canvas) {
        const el = document.createElement('a');
        el.href = canvas.toDataURL();
        el.download = "KTT page " + date;
        const event = new MouseEvent('click');
        el.dispatchEvent(event);
    }
    function savePage() {
        html2canvas(toCapture).then(canvas => {
          download(canvas)
        });
    }

})()