// ==UserScript==
// @name         Saladict read aloud
// @namespace    https://greasyfork.org/en/scripts/453276-saladict-read-aloud
// @version      0.0.2
// @description  Enhanced Saladict extension read aloud feature with Browser's tts
// @author       bruce lu
// @match        https://**/*
// @grant        GM_addStyle
// @require https://greasyfork.org/scripts/402597-monitor-dom-change/code/monitor%20dom%20change.js?version=801281
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/453276/Saladict%20read%20aloud.user.js
// @updateURL https://update.greasyfork.org/scripts/453276/Saladict%20read%20aloud.meta.js
// ==/UserScript==

!(function enhancer() {
  const css = `
    
    #speech-settings-menu {
      width: 640px;
      background: #FFFFFF;
      padding: 1em;
      margin: 1em auto;
      border-top: 5px solid #69c773;
      box-shadow: 0 2px 10px rgba(0,0,0,0.8);
      position: relative;
    }
    
    #speech-settings-menu h1 {
      margin-top: 0;
    }
    #speech-settings-menu .close {
      position: absolute;
      right: 1em;
      top: 0.5em;
      font-size: 20px;
      cursor: pointer;
    }
    
    #msg {
      font-size: 0.9em;
      line-height: 1.4em;
    }
    
    #msg.not-supported strong {
      color: #CC0000;
    }
    
    #speech-msg {
      width: 100%;
      padding: 0.5em;
      font-size: 1em;
      border-radius: 3px;
      border: 1px solid #D9D9D9;
      box-shadow: 0 2px 3px rgba(0,0,0,0.1) inset;
      rows: 3;
    }
    
    #speech-settings-menu input[type="range"] {
      width: 300px;
    }
    
    #speech-settings-menu label {
      display: inline-block;
      float: left;
      width: 150px;
    }
    
    #speech-settings-menu .option {
      margin: 1em 0;
    }
    
    #speak {
      display: inline-block;
      border-radius: 3px;
      border: none;
      font-size: 0.9rem;
      padding: 0.5rem 0.8em;
      background: #69c773;
      border-bottom: 1px solid #498b50;
      color: white;
      -webkit-font-smoothing: antialiased;
      font-weight: bold;
      margin: 0;
      width: 100%;
      text-align: center;
    }
    
    #speak:hover, #speak:focus {
      opacity: 0.75;
      cursor: pointer;
    }
    
    #speak:active {
      opacity: 1;
      box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1) inset;
    }
    #speech-control-menu {
      position: fixed;
      display: flex;
      gap: 6px;
      top: 0;
      right: 6px;
      z-index: 99999;
      background: #fff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    #speech-control-menu > img {
        cursor: pointer;
        width: 30px;
    }
    #speech-control-menu > img:hover {
        background-color: #eeeeee;
    }
    `;
  const speakerTemplate = `
    <button id="menuBar-Speaker" class="menuBar-Btn" title="朗读">
      <img class="menuBar-Btn_Icon" width="30" height="30"src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABk0lEQVRIie2WK08DQRSFuyQlRRBK62iQCLAkqGIJDfAbwIDHgSAYAiFUYzFoHpKXaYOoaKqhhqeBkIJBlXyIng2T7W7Z2W0QpNdMzr1n7rc7nc5sItGLXngCyADXQPkvoYNABcUv3nmgvxvQFHCFER28eeALqAGjcaBJ4BRPdPBPATeyPUSCA33AoRcaBAZSGtNASdaa1bIDDrDvB/UDA+PAE7AgPWS8+aYNeCcIGgDeU6kJFJTLK/cBDPtB5vS0GLmOEbBCWyo3gKzyF8qt+IEfvQ3DgoEcsEtrEzrAmSzrqi9Kn/iB/RqGBR8pVZSeka5Ij0nfdRvs/o6v0lnpN+kB6U93Tl/bE0QLx3ZCt8CrGg80Tmqsa3QPkJe2mcTbXCO0/nru5jqXZU31JeljP3DBhduCDb8DbKvcADLKXyq3HGr9sD9Aiio1gVnlppV7B9JhwbZH5gTwzM+RmQbqsm+EghrN4lwSZVmrRLmbiXYt3sp2D+SsoeabYP8hUI0FNRrafvokY0ONhhnBS11r2ot/Gd9VtODK8mjaMAAAAABJRU5ErkJggg==">
    </button>
    <button id="tts-settings" class="menuBar-Btn" title="打开语音设置">
      <img class="menuBar-Btn_Icon" width="30" height="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAA4klEQVRIie1VQQ6CQAzs+gVIeIESvwBPwysP4mLicvbiEV7AS8aDNalrV7YEY0yYC7RMOu3O7kK04a8BYMQDw5pFD+K9wCsKjWcVaLlYB+AEYApEJs53HLfmCbAMtolEh6k4A3Bard0HnVsQeyKqiCgnoppjiatzDpYpisCDS9glAAfAC84EsRnmBEa8o4pwa4U7v70j651FuJlGDnmaJ6OSKyM9HZVc2kFVPPERT/pFnogiTbAKnj3I+dkH3xuTAIusdk5iAqVR4Anzif/u3SWEUm/h/SKBiOjAAuv9Tzb8BHdDj3NHtMGuJwAAAABJRU5ErkJggg==">
    </button>
    `;

  const menuTemplate = `
    <div id="speech-settings-menu" style="background-color: #FFFF; padding: 2rem;">
      <h1>Web Speech Synthesis Settings</h1>
      <span class="close">x</span>
      <p id="msg"></p>
      <textarea name="speech-msg" id="speech-msg" x-webkit-speech></textarea>
      <div class="option">
        <label for="voice">Voice</label>
        <select name="voice" id="voice"></select>
      </div>
      <div class="option">
        <label for="volume">Volume</label>
        <input type="range" min="0" max="1" step="0.1" name="volume" id="volume" value="1">
      </div>
      <div class="option">
        <label for="rate">Rate</label>
        <input type="range" min="0.1" max="10" step="0.1" name="rate" id="rate" value="1">
      </div>
      <div class="option">
        <label for="pitch">Pitch</label>
        <input type="range" min="0" max="2" step="0.1" name="pitch" id="pitch" value="1">
      </div>
      <button id="speak">Speak</button>
    </div>`;

  GM_addStyle(css);

  let showSettings = false;

  const speechSettings = document.createElement("div");
  speechSettings.innerHTML = menuTemplate;
  speechSettings.style.position = "fixed";
  speechSettings.style.left = "0";
  speechSettings.style.top = "35px";
  speechSettings.style.display = "none";
  speechSettings.style.zIndex = "99999";

  document.body.appendChild(speechSettings);

  /*
   * Check for browser support
   */
  const supportMsg = document.getElementById("msg");

  if ("speechSynthesis" in window) {
    supportMsg.innerHTML =
      "Your browser <strong>supports</strong> speech synthesis.";
  } else {
    supportMsg.innerHTML =
      'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="https://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
    supportMsg.classList.add("not-supported");
  }

  // Get the 'speak' button
  const button = document.getElementById("speak");

  // Get the text input element.
  const speechMsgInput = document.getElementById("speech-msg");

  const closeBtn = document.querySelector("#speech-settings-menu .close");
  closeBtn.addEventListener("click", toggleSettings);
  // Get the voice select element.
  const voiceSelect = document.getElementById("voice");

  // Get the attribute controls.
  const volumeInput = document.getElementById("volume");
  const rateInput = document.getElementById("rate");
  const pitchInput = document.getElementById("pitch");

  function toggleSettings(e, text = "") {
    e.stopPropagation();
    speechMsgInput.value = text;
    if (showSettings) {
      speechSettings.style.display = "none";
      showSettings = false;
    } else {
      speechSettings.style.display = "block";
      showSettings = true;
    }
  }

  // Fetch the list of voices and populate the voice options.
  function loadVoices() {
    // Fetch the available voices.
    const voices = speechSynthesis.getVoices();

    // Loop through each of the voices.
    voices.forEach(function (voice, i) {
      // Create a new option element.
      const option = document.createElement("option");

      // Set the options value and text.
      option.value = voice.name;
      option.innerHTML = voice.name;

      // Add the option to the voice selector.
      voiceSelect.appendChild(option);
    });
    voiceSelect.value =
      "Microsoft Jenny Online (Natural) - English (United States)";
  }
  // Execute loadVoices.
  loadVoices();

  // Chrome loads voices asynchronously.
  window.speechSynthesis.onvoiceschanged = function (e) {
    // console.log("[ this ] >", this);
    // console.log("[ e ] >", e);
    loadVoices();
  };

  function speak(text) {
    speechSynthesis.cancel();
    // Create a new instance of SpeechSynthesisUtterance.
    const msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = text;
    // Set the attributes.
    msg.volume = parseFloat(volumeInput.value);
    msg.rate = parseFloat(rateInput.value);
    msg.pitch = parseFloat(pitchInput.value);

    // Set the attributes.
    msg.addEventListener("end", (event) => {
      console.log(
        `Utterance has finished being spoken after ${event.elapsedTime} seconds.`
      );
    });

    // If a voice has been selected, find the voice and set the
    // utterance instance's voice attribute.
    if (voiceSelect.value) {
      const selectedVoice = speechSynthesis
        .getVoices()
        .filter(function (voice) {
          return voice.name == voiceSelect.value;
        })[0];

      msg.voice = selectedVoice;
    }

    // Queue this utterance.
    window.speechSynthesis.speak(msg);
  }

  // Set up an event listener for when the 'speak' button is clicked.
  button.addEventListener("click", function (e) {
    if (speechMsgInput.value.length > 0) {
      speak(speechMsgInput.value);
    }
  });

  function start() {
    const over = document.querySelector("html");
    monitordom(
      over,
      (lists) => {
        if (lists.addedNodes.length > 0) {
          const n = lists.addedNodes[0];
          if (typeof n.className == "string") {
            if (n.className.includes("saladict-panel")) {
              const saladictPanelRoot = document.querySelector(
                "#saladict-dictpanel-root > .saladict-panel"
              ).shadowRoot;
              const menuBarBtn =
                saladictPanelRoot.querySelector(".menuBar-Btn");
              // get text
              const textArea =
                saladictPanelRoot.querySelector(".mtaBox-TextArea");
              if (menuBarBtn) {
                menuBarBtn.insertAdjacentHTML("afterend", speakerTemplate);
                const speakerBtn =
                  saladictPanelRoot.querySelector("#menuBar-Speaker");
                const settingsBtn =
                  saladictPanelRoot.querySelector("#tts-settings");
                settingsBtn.addEventListener("click", (e) => {
                  toggleSettings(e, textArea.value || "");
                });
                speakerBtn.addEventListener("click", (e) => {
                  if (textArea) {
                    speak(textArea.value);
                  }
                });
              }
            }
          }
        }
      },
      { attributes: true, childList: true, subtree: true }
    );
  }
  start();
})();
