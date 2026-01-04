// ==UserScript==
// @name          	Adjust Instant-Buttons Sound Volume | MyInstants
// @name:de			Anpassung der Instant-Button Lautstärke | MyInstants
// @namespace    	https://greasyfork.org/users/928242
// @version        	1.1
// @description   	Adjust Instant-Buttons Sound Volume
// @description:de	Anpassung der Instant-Button Lautstärke
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @icon            https://www.google.com/s2/favicons?sz=64&domain=myinstants.com
// @match           https://www.myinstants.com/de/*
// @grant        	none
// @license        	MIT
// @downloadURL https://update.greasyfork.org/scripts/465425/Adjust%20Instant-Buttons%20Sound%20Volume%20%7C%20MyInstants.user.js
// @updateURL https://update.greasyfork.org/scripts/465425/Adjust%20Instant-Buttons%20Sound%20Volume%20%7C%20MyInstants.meta.js
// ==/UserScript==


/* global audio */

const savedVolume = window.localStorage.getItem("soundVol")

setTimeout(() => {

    const instantsContainer = document.querySelector("#instants_container");

    const volumeLabel = document.createElement("label");
    volumeLabel.textContent = "Volume:";

    const volumeRange = document.createElement("input");
    volumeRange.type = "range";
    volumeRange.id = "volume-range";
    volumeRange.min = "0";
    volumeRange.max = "100";
    volumeRange.step = "0.1";
    volumeRange.value = savedVolume || "50";

    audio.volume = savedVolume / 100 || volumeRange.value / 100;


    const volumeNumber = document.createElement("input");
    volumeNumber.type = "number";
    volumeNumber.id = "volume-number";
    volumeNumber.min = "0";
    volumeNumber.max = "100";
    volumeNumber.step = "0.5";
    volumeNumber.value = savedVolume || "50";


    const volumeControlContainer = document.createElement("div");
    volumeControlContainer.id = "volume-control-container"
    volumeControlContainer.classList.add("sticky")
    volumeControlContainer.appendChild(volumeLabel);
    volumeControlContainer.appendChild(volumeRange);
    volumeControlContainer.appendChild(volumeNumber);

    instantsContainer.before(volumeControlContainer);


    volumeRange.addEventListener("input", () => {
        changeVolume(volumeRange.value);
    });

    volumeNumber.addEventListener("input", () => {
        changeVolume(volumeNumber.value);
    });

    function changeVolume(vol) {
        audio.volume = vol / 100;
        volumeNumber.value = vol;
        volumeRange.value = vol;
        window.localStorage.setItem("soundVol", parseFloat(vol).toFixed(1))
    }


    const style = document.createElement("style");
    style.textContent = `

  #volume-control-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 15px;
    background-color: rgb(0 0 0 / 50%);
    width: fit-content;
    padding: 10px 20px;
    margin: auto;
    border-radius: 10px;
  }

  #volume-control-container.sticky {
      position: fixed;
      top: 90px;
      right: 20px;
      z-index: 100;
      background-color: rgba(0, 0, 0, 0.8);
  }

  #volume-control-container input:nth-child(3) {
    max-width: 65px;
  }

`;

    document.head.appendChild(style);


}, 1000)
