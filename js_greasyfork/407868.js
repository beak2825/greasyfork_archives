// ==UserScript==
// @name         Pobieranie z CDA.pl
// @name:en      CDA.pl downloader
// @namespace    https://www.cda.pl
// @version      4.5.2
// @description  Dodaje przycisk do pobierania filmu na stronie cda.pl i w osadzonych odtwarzaczach
// @description:en Adds a button for downloading videos from cda.pl and embeded video players
// @author       Kizior
// @match        http*://www.cda.pl/video/*
// @match        http*://ebd.cda.pl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407868/Pobieranie%20z%20CDApl.user.js
// @updateURL https://update.greasyfork.org/scripts/407868/Pobieranie%20z%20CDApl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modal = `
      <div id="cdaDownloader" style="display: none; position: fixed; background-color: rgb(5, 5, 5); width: 300px; height: 150px; z-index: 1000000; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; border-radius: 5px; border: 2px dashed darkorange; padding: 2px; font-size: 12px; color: rgb(187, 187, 187); font-family: Arial, Helvetica, sans-serif;">
        <span>
          <b>Pobieranie z CDA.pl</b><br>
          <font size="1">by Kizior</font><br>
          Wybierz jakość filmu:
        </span>
        <div id="cdaDownloaderClose" style="position: absolute; right: 0px; top: 0px; color: red; background-color: lightgrey; font-weight: bold; margin: 1%; padding: 2%; cursor: default; width: 10px; height: 10px; line-height: 10px; border: 2px dotted green; user-select: none;">
          X
        </div>
        <div id="cdaDownloaderButtons" style="position: relative; top: 40%; transform: translate(0px, -100%);">
        </div>
        <div id="cdaDownloaderLoading" style="position: relative; top: 20%; display: none;">
          Ładowanie...
        </div>
      </div>`;

    const modalButtonStyle = `padding: 2%; margin: 1%; border-radius: 10%; font-size: 20px; font-weight: bold; background-color: darkgray; color: rgb(64, 64, 64); border-color: orange; font-family: Arial, Helvetica, sans-serif;`;
    let abortController = new AbortController();

    function initializeModal() {
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modal;
        document.body.appendChild(modalElement);
        document.querySelector("#cdaDownloaderStartButton").addEventListener("click", () => {
            document.querySelector('#cdaDownloader').style.display = 'block';
        });
        const buttons = document.querySelector("#cdaDownloaderButtons");
        document.querySelector('#cdaDownloaderClose').addEventListener("click", () => {
            document.querySelector('#cdaDownloader').style.display = 'none';
        })
        const qualities = getQualityModes();

        for(const q of Object.keys(qualities)) {
            const buttonElement = document.createElement('button');
            buttonElement.style = modalButtonStyle;
            buttonElement.innerHTML = q;
            buttonElement.addEventListener("click", () => {
                getVideoUrl(q);
            });
            buttons.appendChild(buttonElement);
        }
    }

    function getQualityModes() {
        const playerData = document.querySelector("[id^='mediaplayer']").attributes['player_data'].value;
        if(!playerData) {
            return [];
        }
        const playerDataJSON = JSON.parse(playerData);
        return playerDataJSON.video.qualities;
    }

    function getVideoId() {
        const playerData = document.querySelector("[id^='mediaplayer']").attributes['player_data'].value;
        if(!playerData) {
            return undefined;
        }
        const playerDataJSON = JSON.parse(playerData);
        return playerDataJSON.video.id;
    }

    async function getVideoUrl(quality) {
        abortController.abort();
        abortController = new AbortController();
        const qualityCode = getQualityModes()[quality];
        const loadingElement = document.querySelector('#cdaDownloaderLoading');
        loadingElement.innerHTML = `Ładowanie...<br/>Wczytywanie filmu w jakości <b>${quality}</b>...`;
        loadingElement.style.display = 'block';

        try {
            const response = await fetch('https://cda-downloader.onrender.com/downloader', {
                method: 'POST',
                body: JSON.stringify({
                    videoId: getVideoId(),
                    quality: qualityCode,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: abortController.signal,
            });

            const responseJSON = await response.json();
            loadingElement.innerHTML = `
              <a onmouseover="this.style.color='orange';" onmouseout="this.style.color=''" href="${responseJSON.result.resp}"> Pobierz (${quality}) </a><br/>
              <font size='1'>Kliknij prawym przyciskiem myszy i wybierz \"Zapisz link jako\"</font>`;
        } catch (error) {
            if(error.name !== 'AbortError') {
                console.log(error);
                loadingElement.innerHTML = `
                  <span>Wystąpił błąd :(</span>`;
            }
        }
    }


    if(!document.querySelector(".areaquality")) {
        if(document.querySelector("#naglowek")) {
            // for regular videos on cda.pl
            document.querySelector("#naglowek").parentNode.parentNode.parentNode.innerHTML+=(`
              <div class="areaquality" style="position: relative;z-index:100;"><div class="wrapqualitybtn"></div></div>
            `);
            document.querySelector("#naglowek").parentNode.parentElement.style.width = "480px";
        } else {
            // for embed videos
            document.querySelector(".quality").innerHTML+=(`
              <div class="areaquality" style="position: relative;z-index:100;"><div class="wrapqualitybtn"></div></div>
            `);
        }
    }

    document.querySelector(".areaquality").firstElementChild.innerHTML+=`
      <a id="cdaDownloaderStartButton" class="quality-btn" style="background:green">
        Pobierz
      </a>`;

    initializeModal();
})();
