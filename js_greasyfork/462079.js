// ==UserScript==
// @name         Download Audio from Microsoft Speech
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a download button to download the audio from the Microsoft Speech website
// @author       You
// @match        https://speech.microsoft.com/audiocontentcreation
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462079/Download%20Audio%20from%20Microsoft%20Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/462079/Download%20Audio%20from%20Microsoft%20Speech.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Function to inject download button on the page
  function injectDownloadButton() {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Audio';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '1000';

    downloadButton.onclick = () => {
      const textArea = document.querySelector('textarea');
      if (!textArea) {
        alert('No input text found. Please try again.');
        return;
      }

      const text = textArea.value;
      if (!text) {
        alert('No input text found. Please try again.');
        return;
      }

      // Send a request to the server to generate the audio
      sendAudioRequest(text);
    };

    document.body.appendChild(downloadButton);
  }

  // Function to send a request to the server for generating the audio
  function sendAudioRequest(text) {
    const apiUrl = 'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/split-ssmls';
    const customvoiceconnectionid = 'bd88f890-d796-11ed-8003-47dcd873a7eb'; // You may need to update this value from the website
    const ssml = `<speak version="1.0" xml:lang="en-US"><voice name="en-US-AriaNeural">${text}</voice></speak>`;

    GM_xmlhttpRequest({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Customvoiceconnectionid': customvoiceconnectionid,
      },
      data: JSON.stringify({
        ssmls: [ssml],
        splitFileOptions: {
          splitSsmlByContentMode: 'OneLinePerSegment',
          ssmlMaxCharLengthOfPlainTextPerSegmentMode: 'SpeakMaxPlainTextCharLengthAutoDetectLanguageFromSsml',
        },
      }),
      onload: (response) => {
        const jsonResponse = JSON.parse(response.responseText);
        const audioUrl = jsonResponse.vcgUrl;

        if (audioUrl) {
          downloadAudio(audioUrl);
        } else {
          alert('No audio URL found. Please try again.');
        }
      },
      onerror: () => {
        alert('Error fetching audio. Please try again.');
      },
    });
  }

  // Function to download the audio file
  function downloadAudio(audioUrl) {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio.mp3';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Inject the download button on the page
  injectDownloadButton();
})();
