// ==UserScript==
// @name         Everyone Piano
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download pdf version of the music sheet on everyone piano
// @author       You
// @match        *://www.everyonepiano.com/*
// @match        *://www.everyonepiano.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=everyonepiano.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472756/Everyone%20Piano.user.js
// @updateURL https://update.greasyfork.org/scripts/472756/Everyone%20Piano.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Inject buttons into the body
    const downloadButton = document.createElement('button');
    downloadButton.id = 'downloadButton';
    downloadButton.textContent = 'Download and Pack Images';

    const generatePDFButton = document.createElement('button');
    generatePDFButton.id = 'generatePDFButton';
    generatePDFButton.textContent = 'Generate Images PDF';

    document.body.appendChild(downloadButton);
    document.body.appendChild(generatePDFButton);

    // Inject script dependencies into the header
    const dependencies = [
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js'
    ];

    dependencies.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    });

    // Inject your custom script at the end
    const customScript = document.createElement('script');
    customScript.src = 'https://share.273803761.xyz/files/renren-download.js';
    document.body.appendChild(customScript);
})();