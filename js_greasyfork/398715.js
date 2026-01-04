// ==UserScript==
// @name         Instagram Story Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button that lets you download stories
// @author       Poup2804
// @match        https://www.instagram.com/stories/*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/398715/Instagram%20Story%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/398715/Instagram%20Story%20Downloader.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let menuPath = "#react-root > section > div > div > section > div.GHEPc"
    let videoPath = "#react-root > section > div > div > section > div.GHEPc > div._53rSq > div > div > video"
    let imagePath = "#react-root > section > div > div > section > div.GHEPc > div._-6eR1 > div > div > img"


    let checkExist = setInterval(function() {
        if (document.querySelector(menuPath).tagName) {
            clearInterval(checkExist);
            setInterval(function() {
                if(document.getElementById('dlButton') == null){
                    let dlButton = createButton()
                    let filename = document.querySelector("#react-root > section > div > div > section > header > div > div.MS2JH > div > div > div > a").innerText + " " + document.querySelector("#react-root > section > div > div > section > header > div > div.MS2JH > div > div > time").dateTime + "."

                    dlButton.addEventListener('click', function() {

                        if(document.querySelector(videoPath) != null) {
                            download(document.querySelector(videoPath).children[0].src, filename + "mp4")

                        }
                        else {
                            download(document.querySelector(imagePath).src, filename + "jpg")
                        }
                    })

                    let controls = document.querySelector(menuPath)
                    controls.append(dlButton)
                    console.log("added")
                }
            }, 2000);
        }
    }, 100);


})();

function createButton() {
    let dlButton = document.createElement('button')
    dlButton.classList.add('-jHC6')
    dlButton.id = 'dlButton'
    dlButton.style.top = '16px'

    let iconDiv = document.createElement('div')
    iconDiv.classList.add('coreSpriteSaveStory')
    dlButton.append(iconDiv)

    return dlButton;
}

// credits to https://stackoverflow.com/a/9834261
function download(url, filename) {
 fetch(url)
  .then(resp => resp.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch(() => alert('oh no!'));


}