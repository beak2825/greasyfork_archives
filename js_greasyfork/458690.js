// ==UserScript==
// @name         Imgsrc.ru Downloader
// @namespace    https://imgsrc.ru
// @version      1.0.0
// @description  Mass downloads all images from a collection on one page
// @author       You
// @match        https://imgsrc.ru/main/tape.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgsrc.ru
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458690/Imgsrcru%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/458690/Imgsrcru%20Downloader.meta.js
// ==/UserScript==

if (typeof GM_download !== 'function') {
    if (typeof GM_xmlhttpRequest !== 'function') {
        throw new Error('GM_xmlhttpRequest is undefined. Please set @grant GM_xmlhttpRequest at metadata block.');
    }

    function GM_download (url, name) {
        if (url == null) return;

        var data = {
            method: 'GET',
            responseType: 'arraybuffer',

            onload: function (res) {
                var blob = new Blob([res.response], {type: 'application/octet-stream'});
                var url = URL.createObjectURL(blob); // blob url

                var a = document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('download', data.name != null ? data.name : 'filename');
                document.documentElement.appendChild(a);

                // call download
                // a.click() or CLICK the download link can't modify filename in Firefox (why?)
                // Solution from FileSaver.js, https://github.com/eligrey/FileSaver.js/
                var e = new MouseEvent('click');
                a.dispatchEvent(e);

                document.documentElement.removeChild(a);

                setTimeout(function(){
                    // reduce memory usage
                    URL.revokeObjectURL(url);
                    if ('close' in blob) blob.close(); // File Blob.close() API, not supported by all the browser right now
                    blob = undefined;
                }, 1000);

                if (typeof data.onafterload === 'function') data.onafterload(); // call onload function
            }

            // error object of onerror function is not supported right now
        };

        if (typeof url === 'string') {
            data.url = url;
            data.name = name;
        }
        else {
            if (url instanceof Object === false) return;

            // as documentation, you can only use [url, name, headers, saveAs, onload, onerror] function, but we won't check them
            // Notice: saveAs is not supported
            if (url.url == null) return;

            for (var i in url) {
                if (i === 'onload') data.onafterload = url.onload; // onload function support
                else data[i] = url[i];
            }
        }

        // it returns this GM_xhr, thought not mentioned in documentation
        return GM_xmlhttpRequest(data);
    }
}

(function() {
    'use strict';

    const imageUrls = []
    const imageElements = document.querySelectorAll('.fts')

    const imageDiv = document.querySelector('.h100')

    for (let i = 0; i < imageElements.length; i++) {
        const url = 'https://' + imageElements[i].getAttribute('src');
        imageUrls.push(url)
    }

    const buttonDiv = document.createElement("div")
    buttonDiv.style.display = 'flex'
    buttonDiv.style['justify-content'] = 'center'


    const btn = document.createElement("button")
    btn.innerText = 'Download all images on this page'
    btn.id = 'download'
    btn.style.color = '#fff'
    btn.style.background = '#000'
    btn.style.border = 'none'
    btn.style.padding = '20px'
    btn.style['border-radius'] = '15px'

    buttonDiv.append(btn)


    imageDiv.prepend(buttonDiv)

    btn.addEventListener("mouseenter", () => {
        btn.style.background = '#4e4e4e'
        btn.style.cursor = 'pointer'
    })
    btn.addEventListener("mouseleave", () => {
        btn.style.background = '#000'
    })

    btn.addEventListener("click", () => {
        for (let i = 0; i < imageUrls.length; i++) {
            GM_download({
                url: imageUrls[i],
                name: imageUrls[i].split('/')[imageUrls[i].split('/').length - 1],
                saveAs: false
            });
        }
    })


})();
