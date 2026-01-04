// ==UserScript==
// @name         Youtube Downloader 2026
// @namespace    http://tampermonkey.net/
// @version      2029.2
// @description  Youtube Audio and Video downloader 2026
// @author       LeonelM
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498037/Youtube%20Downloader%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/498037/Youtube%20Downloader%202026.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stylesCss = `
    <style>
    button {
      margin: 0;
      padding: 0;
    }

    .newVideoTest:hover{
   background-color: rgba(80,80,80,0.8)
    }

    button:hover {
      color: #ec3203;
    }
    .btn1{
    margin-right: -15px;
    }

    .newText{
    font-size: 118%;
    font-weight: 500;
    display: flex;
    }

    .newText span{
       margin-right: 4px;
       margin-top: 5px;
       color: #e3e3e3;
    }
    .newVideoTest:hover .newText span{
       margin-right: 4px;
       margin-top: 5px;
           font-weight: bold;
           color: white;
    }

    .botones_div {
      background-color: transparent;
      border: none;
      color: #FFFFFF;
    }
    .ytp-swatch-color-white{
        color: var(--yt-spec-static-overlay-text-secondary);
        font-size: 13px;
        font-weight: bolder;
    }
    .newVideoTest:hover .newText .ytp-swatch-color-white{
        color: rgb(255 38 0);
        font-size: 13px;
    }

    </style>
    `;

    const menuBotones = `
    <style>
        ${stylesCss}
    </style>

       <div class="ytp-popup ytp-settings-menu leotest leoaudiotest" data-layer="6" id="ytp-id-18" style="width: 397px; height: 277px;">
        <!-- Panel for Audio Quality -->
        <div class="ytp-panel" style="width: 397px; height: 277px;">

         <span style="padding-left:20px;font-size: large;font-weight: 900;align-content: center;und;und;flex-wrap: wrap;display: flex;reverse;justify-content: space-between;flex-direction: row;align-items: center;">Download Audio

          <button title="Close" type="button" class="btn3 botones_div" style="
              left: auto;
             padding-left: 20px;
             position: relative;
              ">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="30" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M10 10l4 4m0 -4l-4 4"></path>
          </svg>
           </button>

         </span>

          <div class="ytp-panel-menu" role="menu" style="height: 177px;">

          <div class="newVideoTest" aria-haspopup="true" value="flac" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">

                    <span>FLAC </span><sup class="ytp-swatch-color-white">UHQ</sup>
                      <button id="downloadButtonflac" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  'flac','downloadButtonflac')">
                      Click to Download
                      </button>

                    </div>

                </div>

               <div class="newVideoTest" aria-haspopup="true" value="wav" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">

                    <span>WAV</span><sup class="ytp-swatch-color-white">UHQ</sup>
                      <button id="downloadButtonwav" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload( 'wav','downloadButtonwav')">
                      Click to Download
                      </button>

                    </div>

                </div>

                 <div class="newVideoTest" aria-haspopup="true"value="mp3" role="menuitem" tabindex="1" style="padding-left:20px">
                    <div class="newText">   <span>MP3</span>
                    <button id="downloadButtonmp3" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload( 'mp3','downloadButtonmp3')">
                      Click to Download
                      </button>

                    </div>
                </div>

                <div class="newVideoTest" aria-haspopup="true" value="m4a" role="menuitem" tabindex="2" style="padding-left:20px">
                    <div class="newText">    <span>M4A </span>
                     <button id="downloadButtonm4a" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload( 'm4a','downloadButtonm4a')">
                      Click to Download
                      </button>

                    </div>
                </div>

                <div class="newVideoTest" aria-haspopup="true" value="aac" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">    <span>AAC </span>
                    <button id="downloadButtonaac" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  'aac','downloadButtonaac')">
                      Click to Download
                      </button>

                    </div>
                </div>

                 <div class="newVideoTest" aria-haspopup="true" value="opus" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">    <span>OPUS </span>
                    <button id="downloadButtonopus" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload( 'opus','downloadButtonopus')">
                      Click to Download
                      </button>

                    </div>
                </div>

                <div class="newVideoTest" aria-haspopup="true" value="ogg" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">   <span> OGG </span>
                    <button id="downloadButtonogg" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  'ogg','downloadButtonogg')">
                      Click to Download
                      </button>

                    </div>
                </div>

            </div>

        </div>

    </div>

   <div class="ytp-popup ytp-settings-menu leotest leovideotest" data-layer="6" id="ytp-id-18" style="width: 397px; height: 277px;">
        <!-- Panel for Video Quality -->
        <div class="ytp-panel" style="width: 397px; height: 277px;">

         <span style="padding-left:20px;font-size: large;font-weight: 900;align-content: center;und;und;flex-wrap: wrap;display: flex;reverse;justify-content: space-between;flex-direction: row;align-items: center;">Download Video

          <button title="Close" type="button" class="btn3 botones_div" style="
             left: auto;
             padding-left: 20px;
             position: relative;
         ">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="30" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M10 10l4 4m0 -4l-4 4"></path>
          </svg>
           </button>

         </span>

          <div class="ytp-panel-menu" role="menu" style="height: 177px;">

               <div class="newVideoTest" aria-haspopup="true" value="4k" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">
                    <span>2160p</span><sup class="ytp-swatch-color-white">4K</sup>

                      <button id="downloadButton4k" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  '4k','downloadButton4k')">
                      Click to Download
                      </button>
                    </div>

                </div>

                 <div class="newVideoTest" aria-haspopup="true"value="1440" role="menuitem" tabindex="1" style="padding-left:20px">
                    <div class="newText">   <span>1440p</span><sup class="ytp-swatch-color-white">2K</sup>
                    <button id="downloadButton2k" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload( '1440','downloadButton2k')">
                      Click to Download
                      </button>

                    </div>
                </div>

                <div class="newVideoTest" aria-haspopup="true" value="1080" role="menuitem" tabindex="2" style="padding-left:20px">
                    <div class="newText">    <span>1080p</span><sup class="ytp-swatch-color-white">Full HD</sup>
                     <button id="downloadButton1080" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  '1080','downloadButton1080')">
                      Click to Download
                      </button>

                    </div>
                </div>

                <div class="newVideoTest" aria-haspopup="true" value="720" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">    <span>720p</span><sup class="ytp-swatch-color-white">HD</sup>
                    <button id="downloadButton720" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  '720','downloadButton720')">
                      Click to Download
                      </button>

                    </div>
                </div>

                 <div class="newVideoTest" aria-haspopup="true" value="480" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">    <span>480p</span>
                    <button id="downloadButton480" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  '480','downloadButton480')">
                      Click to Download
                      </button>

                    </div>
                </div>

                <div class="newVideoTest" aria-haspopup="true" value="360" role="menuitem" tabindex="0" style="padding-left:20px">
                    <div class="newText">   <span> 360p</span>
                    <button id="downloadButton360" style="place-content:center;margin-left: auto;height:100%;top: 8px;width:45%;padding: 9px;background-color:#2986cc;color: white;border: none;display: flex;border-radius: 5px;position: relative;" onclick="initiateDownload(  '360','downloadButton360')">
                      Click to Download
                      </button>

                    </div>
                </div>

            </div>

        </div>

    </div>

    </div>
    `;

    // HTML de los botones
    const downloadMp4Mp3 = `
           <button title="Download Video" type="button" class="btn1 botones_div">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-download"
             width="30"  height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
           <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
           <path d="M12 17v-6"></path>
           <path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path>
          </svg>
        </button>
        <button title="Download Audio" type="button" class="btn2 botones_div">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-music" width="30"
            height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
            <path d="M11 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M12 16l0 -5l2 1"></path>
          </svg>
        </button>
      `;

    let currentVideoUrl = window.location.href;
    let currentFunction = "";

    let firstBoot = true;

    function removeButtons(){
        let existingMenuBotones = document.querySelector('.leoaudiotest');
        let existingMenuBotones2 = document.querySelector('.leovideotest');
        let existingMenuBotones3 = document.querySelector('.btn1');
        let existingMenuBotones4 = document.querySelector('.btn2');


        if (existingMenuBotones) {
            existingMenuBotones.remove();
        }
        if (existingMenuBotones2) {
            existingMenuBotones2.remove();
        }
        if (existingMenuBotones3) {
            existingMenuBotones3.remove();
        }
        if (existingMenuBotones4) {
            existingMenuBotones4.remove();
        }
    }

    function loadScriptFixed() {
        // Definir una política de Trusted Types si aún no existe
        if (!window.trustedTypes.defaultPolicy) {
            window.trustedTypes.createPolicy('default', {
                createHTML: (input) => input // Aquí puedes agregar sanitización adicional si es necesario
            });
        }
        currentVideoUrl = window.location.href;
        currentFunction = "";

        // Remover botones existentes si ya están presentes
        removeButtons();

        const rightControlsDiv = document.querySelector('.ytp-right-controls');

        // Crear contenido seguro usando TrustedHTML
        const safeMenuBotones = window.trustedTypes.defaultPolicy.createHTML(menuBotones);
        const safeDownloadMp4Mp3 = window.trustedTypes.defaultPolicy.createHTML(downloadMp4Mp3);

        // Insertar contenido "seguro" en el DOM usando insertAdjacentHTML
        rightControlsDiv.insertAdjacentHTML('beforebegin', safeMenuBotones);
        rightControlsDiv.insertAdjacentHTML('beforebegin', safeDownloadMp4Mp3);

        // Insertar el CSS en el head del documento
        const existingStyleSheet = document.querySelector('#custom-style-sheet');
        if (existingStyleSheet) {
            existingStyleSheet.remove();
        }

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.id = 'custom-style-sheet';
        styleSheet.innerText = stylesCss;
        document.head.appendChild(styleSheet);

        const leoaudiotest = document.querySelector('.leoaudiotest');
        const leovideotest = document.querySelector('.leovideotest');

        const btn1mp4 = document.querySelector('.btn1');
        const btn2mp3 = document.querySelector('.btn2');
        const btn3cancel = document.querySelectorAll('.btn3');

        leovideotest.style.display = 'none';
        leoaudiotest.style.display = 'none';

        for (let i = 0; i < btn3cancel.length; i++) {
            if (btn3cancel[i]) {
                btn3cancel[i].onclick = () => {
                    leovideotest.style.display = 'none';
                    leoaudiotest.style.display = 'none';
                };
            }
        }

        if (btn1mp4) {
            btn1mp4.onclick = () => {
                if (leovideotest.style.display != ''){
                    leovideotest.style.display = '';
                } else{
                    leovideotest.style.display = 'none';
                }
                leoaudiotest.style.display = 'none';

            };
        }

        if (btn2mp3) {
            btn2mp3.onclick = () => {
                 if (leoaudiotest.style.display != ''){
                    leoaudiotest.style.display = '';
                } else{
                    leoaudiotest.style.display = 'none';
                }
                leovideotest.style.display = 'none';
            };
        }
    }

    window.initiateDownload = function(format, buttonID) {
        console.log("id:" + buttonID);
        const button = document.getElementById(buttonID);
        const url = window.location.href;
        currentFunction = format;

        // Check if the video URL has changed
        if (url !== currentVideoUrl) {
            resetButton(buttonID, currentFunction);
            currentVideoUrl = url;
        }

        button.innerHTML = 'Preparing...';
        button.style.backgroundColor = '#53c9ff';

        fetch("https://loader.to/ajax/download.php?url=" + currentVideoUrl + "&format=" + format + "&start=1&end=1")
            .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error('Network response was not ok: ' + text); });
            }
            return response.json();
        })
            .then(data => {
            if (data && data.success) {
                window.checkProgress(data.id, data.download_url, buttonID);
            } else {
                alert('Failed to initiate download.');
                button.innerHTML = 'Failed';
                button.style.backgroundColor = '#BF4B4B';
            }
        })
            .catch(error => {
            alert('An error occurred while trying to download the video: ' + error.message);
            button.innerHTML = 'Error';
            button.style.backgroundColor = '#BF4B4B';
            console.error('Error:', error);
        });
    }

    window.checkProgress = function(id, downloadUrl, buttonID) {
        const button = document.getElementById(buttonID);

        fetch("https://loader.to/ajax/progress.php?id=" + id)
            .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error('Network response was not ok: ' + text); });
            }
            return response.json();
        })
            .then(data => {
            if (data && data.download_url) {
                button.innerHTML = 'Download Now!';
                button.style.backgroundColor = '#64c896';
                button.onclick = function() {
                    window.open(data.download_url, '_blank');
                    resetButton(buttonID, currentFunction); // Reiniciar el botón después de la descarga
                };
            } else {
                setTimeout(function() {
                    window.checkProgress(id, downloadUrl, buttonID);
                }, 750);
            }
        })
            .catch(error => {
            alert('An error occurred while checking download progress: ' + error.message);
            console.error('Error:', error);
        });
    };

    function resetButton(buttonID, prevFormat) {
        const button = document.getElementById(buttonID);
        button.innerHTML = 'Download again';
        button.style.backgroundColor = '#64c896'; // Restablecer color original
    }

    // Function to handle URL changes
    function handleUrlChange() {
        if (window.location.href !== currentVideoUrl) {
            currentVideoUrl = window.location.href;
            console.log("url changed");
            removeButtons();
            setTimeout(loadScriptFixed, 2000);
        }
    }

    // Observe changes in the video URL
    const observer = new MutationObserver(handleUrlChange);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', handleUrlChange);

    if (firstBoot){
        setTimeout(loadScriptFixed, 6000);
        firstBoot = false;
    }
})();