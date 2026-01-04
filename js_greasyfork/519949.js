// ==UserScript==
// @name         Premium Link Grabber via OkDebrid
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Resolve premium download links across multiple file hosting sites via OkDebrid
// @license MIT
// @match        https://hexupload*/*
// @match        https://filer.net*/*
// @match        https://filespace*/*
// @match        https://uploadcloud*/*
// @match        https://vipfile*/*
// @match        https://nelion*/*
// @match        https://voe.sx*/*
// @match        https://ex-load*/*
// @match        https://4shared*/*
// @match        https://wayshare*/*
// @match        https://world-files*/*
// @match        https://fikper*/*
// @match        https://filestore*/*
// @match        https://drop.download*/*
// @match        https://wupfile*/*
// @match        https://elitefile*/*
// @match        https://filecat*/*
// @match        https://hotlink*/*
// @match        https://mexa.sh*/*
// @match        https://filesfly*/*
// @match        https://alfafile*/*
// @match        https://cloudghost*/*
// @match        https://novafile*/*
// @match        https://mexashare*/*
// @match        https://nitro.download*/*
// @match        https://file-upload*/*
// @match        https://florenfile*/*
// @match        https://ubiqfile*/*
// @match        https://filenext*/*
// @match        https://tezfiles*/*
// @match        https://send.cm*/*
// @match        https://streamtape*/*
// @match        https://filejoker*/*
// @match        https://fastfile*/*
// @match        https://uploadgig*/*
// @match        https://fileland*/*
// @match        https://loadme*/*
// @match        https://xubster*/*
// @match        https://racaty*/*
// @match        https://filesmonster*/*
// @match        https://icerbox*/*
// @match        https://subyshare*/*
// @match        https://extmatrix*/*
// @match        https://depositfiles*/*
// @match        https://fileboom*/*
// @match        https://1fichier*/*
// @match        https://jumploads*/*
// @match        https://fshare*/*
// @match        https://prefiles*/*
// @match        https://hitfile*/*
// @match        https://ufile.io*/*
// @match        https://upstore*/*
// @match        https://mega*/*
// @match        https://file.al*/*
// @match        https://easybytez*/*
// @match        https://isra.cloud*/*
// @match        https://usersdrive*/*
// @match        https://uploadrar*/*
// @match        https://worlduploads*/*
// @match        https://file2share*/*
// @match        https://syncs.online*/*
// @match        https://emload*/*
// @match        https://mountfile*/*
// @match        https://mixdrop*/*
// @match        https://clicknupload*/*
// @match        https://pixeldrain*/*
// @match        https://moondl*/*
// @match        https://turbobit*/*
// @match        https://xenupload*/*
// @match        https://wdupload*/*
// @match        https://hot4share*/*
// @match        https://nitroflare*/*
// @match        https://k2s*/*
// @match        https://dropgalaxy*/*
// @match        https://filefox*/*
// @match        https://rosefile*/*
// @match        https://upstream*/*
// @match        https://gigapeta*/*
// @match        https://uploadhaven*/*
// @match        https://fireget*/*
// @match        https://katfile*/*
// @match        https://fileblade*/*
// @match        https://fboom*/*
// @match        https://ddownload*/*
// @match        https://keep2share*/*
// @match        https://fastbit*/*
// @match        https://daofile*/*
// @match        https://takefile*/*
// @match        https://filedot*/*
// @match        https://ulozto*/*
// @match        https://mixloads*/*
// @match        https://mediafire*/*
// @match        https://fastclick*/*
// @match        https://bayfiles*/*
// @match        https://kshared*/*
// @match        https://flashbit*/*
// @match        https://rapidrar*/*
// @match        https://rapidgator*/*
// @match        https://fileaxa*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519949/Premium%20Link%20Grabber%20via%20OkDebrid.user.js
// @updateURL https://update.greasyfork.org/scripts/519949/Premium%20Link%20Grabber%20via%20OkDebrid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the popup
    function createDebridPopup(data) {
        // Create popup container
        const popup = document.createElement('div');
        popup.id = 'debrid-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 2px solid #333;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        `;

        // Popup content
        popup.innerHTML = `
            <h2>Premium Link Found!</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Size:</strong> ${data.size}</p>
            <p><strong>Host:</strong> ${data.host}</p>
            <button id="debrid-download-btn" style="
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 10px 0;
                cursor: pointer;
                border-radius: 5px;
            ">Download</button>
            <button id="debrid-close-btn" style="
                background-color: #f44336;
                color: white;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 10px 0 0 10px;
                cursor: pointer;
                border-radius: 5px;
            ">Close</button>
        `;

        // Add to body
        document.body.appendChild(popup);

        // Download button event
        const downloadBtn = document.getElementById('debrid-download-btn');
        downloadBtn.addEventListener('click', () => {
            window.open(data.link, '_blank');
            popup.remove();
        });

        // Close button event
        const closeBtn = document.getElementById('debrid-close-btn');
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });
    }

    // Function to send debrid request
    function sendDebridRequest() {
        const currentUrl = encodeURIComponent(window.location.href);

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://okdebrid.com/api?mode=plg&token=__",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "*/*"
            },
            data: `link=${currentUrl}&lang=en-US&chck=.&`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.link) {
                        createDebridPopup(data);
                    }
                } catch (error) {
                    console.error('Error parsing debrid response:', error);
                }
            },
            onerror: function(error) {
                console.error('Debrid request failed:', error);
            }
        });
    }

    // Run the script
    sendDebridRequest();
})();