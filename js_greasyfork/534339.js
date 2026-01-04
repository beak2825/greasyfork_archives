// ==UserScript==
// @name         Save Family Club Web Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  save the whole Family Club Web page as a long image(New Version)
// @author       黃色心臟
// @match        https://*.familyclub.jp/s/jwb/diary/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534339/Save%20Family%20Club%20Web%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/534339/Save%20Family%20Club%20Web%20Page.meta.js
// ==/UserScript==

(function() {
    addScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    var date, row, toCapture, artistText;

    date = document.querySelector('div.article__posted').innerText;
    row = document.querySelector(".article.row");
    var artist = document.querySelector(".artist-info");
    var article_name = document.querySelector(".article__name");
    if (article_name) {
        artistText = artist.innerText + '_' + article_name.innerText
    } else {
        artistText = artist.innerText
    }
    document.querySelectorAll('*').forEach(el => {
        const style = getComputedStyle(el);
        if (style.backgroundImage.includes('gradient') && !style.backgroundImage.includes('rgb')) {
            el.style.backgroundImage = 'none';
        }
    });
    const iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.setAttribute('sandbox', 'allow-scripts');
    }

    toCapture = document.querySelector('article.article.row');

    //console.log(iframeDocument);

    window.addEventListener('load', () => {
        addButton('Save Page', savePage)
    })

    // add button function
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {border: 'solid 2px', borderRadius:'3px', padding: '4px 6px', marginLeft: '20px', marginTop: '8px'}
        let button = document.createElement('button'), btnStyle = button.style
        row.insertBefore(button, row.firstChild);
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
        el.download = "Page_" + artistText + date +'.jpg';
        const event = new MouseEvent('click');
        el.dispatchEvent(event);
    }

    function savePage() {
        setTimeout(() => {
            html2canvas(toCapture, {
                useCORS: true,
                logging: true,
                backgroundColor: "#ffffff",
                ignoreElements: (element) => { // skip gradient
                    const computedStyle = getComputedStyle(element);
                    return computedStyle.backgroundImage.includes('gradient');
                }
            }).then(canvas => {
                download(canvas);
            }).catch(error => {
                console.error("Error during html2canvas:", error);
                alert("An error occurred while capturing the page. Check the console for more details.");
            });
        }, 200);
    }
})()