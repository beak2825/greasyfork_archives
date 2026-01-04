// ==UserScript==
// @name         ElevenLabs Demo Text-to-Speech
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aggiunge un'interfaccia di sintesi vocale su ElevenLabs per leggere testi
// @author       Flejta
// @match        https://elevenlabs.io/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535058/ElevenLabs%20Demo%20Text-to-Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/535058/ElevenLabs%20Demo%20Text-to-Speech.meta.js
// ==/UserScript==
//usare sulla pagina
//https://elevenlabs.io/?utm_source=google&utm_medium=cpc&utm_campaign=t2_brandsearch_brand_english&utm_id=21817123577&utm_term=elevenlabs&utm_content=brand_-_brand&gad_source=1&gad_campaignid=21817123577&gbraid=0AAAAAp9ksTH1rGhUC0KcSP-m08tvzNlhx&gclid=Cj0KCQjww-HABhCGARIsALLO6Xz2bGln1ozYUfeq0SPJ17mnQiEWfudJGur6chKUj6oJ-4xXvFnz3yAaApXTEALw_wcB
(function () {
  'use strict';

  // Crea l'interfaccia utente
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.left = '5%';
  container.style.width = '90%';
  container.style.background = '#fff';
  container.style.border = '1px solid #ccc';
  container.style.padding = '10px';
  container.style.zIndex = '9999';
  container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  container.innerHTML = `
    <h2>Sintesi Vocale</h2>
    <textarea id="ttsText" style="width: 100%; height: 200px; resize: none; overflow-y: auto;" placeholder="Incolla il testo qui..."></textarea>
    <div style="margin-top: 10px;">
      <button id="playBtn">Play</button>
      <button id="pauseBtn" disabled>Pause</button>
    </div>
    <p id="status">Pronto</p>
  `;

  document.body.appendChild(container);

  // Elementi DOM
  const textArea = document.getElementById('ttsText');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const status = document.getElementById('status');

  // Variabili di stato
  let audioQueue = [];
  let currentAudio = null;
  let isPlaying = false;
  let isPaused = false;

  // Funzione per dividere il testo in blocchi di massimo 500 caratteri
  function splitText(text, maxLength = 500) {
    const chunks = [];
    let currentChunk = '';

    // Dividi il testo in frasi (usando .!? come separatori)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    // Gestisci testi senza punteggiatura o molto lunghi
    const finalChunks = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxLength) {
        finalChunks.push(chunk);
      } else {
        // Suddividi ulteriormente in blocchi di maxLength
        for (let i = 0; i < chunk.length; i += maxLength) {
          finalChunks.push(chunk.slice(i, i + maxLength));
        }
      }
    }

    return finalChunks.filter(chunk => chunk.length > 0);
  }

  // Funzione per generare audio tramite XHR
  async function generateAudioChunk(text) {
    try {
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/pFZP5JQG7iQjIQuC4Bku?allow_unauthenticated=1',
        {
          headers: {
            'accept': '*/*',
            'accept-language': 'it-IT,it;q=0.9,en;q=0.8,zh;q=0.7,en-US;q=0.6,ru;q=0.5,zh-CN;q=0.4,ar;q=0.3',
            'content-type': 'application/json',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
          },
          referrer: 'https://elevenlabs.io/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { speed: 1 },
          }),
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
        }
      );

      if (!response.ok) {
        throw new Error(`Errore API: ${response.status} - ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Errore nella generazione audio:', error);
      throw error;
    }
  }

  // Funzione per riprodurre la coda audio
  async function playAudioQueue() {
    while (audioQueue.length > 0 && isPlaying && !isPaused) {
      const audioUrl = audioQueue.shift();
      currentAudio = new Audio(audioUrl);

      try {
        await currentAudio.play();
        status.textContent = 'Riproduzione in corso...';

        // Aspetta che l'audio finisca
        await new Promise(resolve => {
          currentAudio.onended = resolve;
          currentAudio.onerror = () => resolve(); // Gestisci errori di riproduzione
        });
      } catch (error) {
        console.error('Errore nella riproduzione:', error);
        status.textContent = `Errore nella riproduzione: ${error.message}`;
        break;
      } finally {
        URL.revokeObjectURL(audioUrl);
      }
    }

    if (audioQueue.length === 0 && isPlaying) {
      status.textContent = 'Riproduzione completata';
      resetPlayer();
    }
  }

  // Funzione per resettare lo stato del lettore
  function resetPlayer() {
    isPlaying = false;
    isPaused = false;
    currentAudio = null;
    audioQueue = [];
    playBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  // Gestore del pulsante Play
  playBtn.addEventListener('click', async () => {
    if (isPlaying) return; // Evita clic multipli

    const text = textArea.value.trim();
    if (!text) {
      status.textContent = 'Inserisci un testo!';
      return;
    }

    isPlaying = true;
    isPaused = false;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    status.textContent = 'Caricamento audio...';

    try {
      // Dividi il testo in blocchi
      const chunks = splitText(text, 500);
      status.textContent = `Generazione di ${chunks.length} blocchi audio...`;

      // Genera audio per ogni blocco
      for (let i = 0; i < chunks.length && isPlaying; i++) {
        const chunk = chunks[i];
        status.textContent = `Generazione blocco ${i + 1}/${chunks.length}...`;
        const audioUrl = await generateAudioChunk(chunk);
        audioQueue.push(audioUrl);

        // Avvia la riproduzione se è il primo blocco
        if (i === 0) {
          playAudioQueue();
        }
      }
    } catch (error) {
      status.textContent = `Errore: ${error.message}`;
      resetPlayer();
    }
  });

  // Gestore del pulsante Pause
  pauseBtn.addEventListener('click', () => {
    if (!isPlaying) return;

    if (isPaused) {
      // Riprendi
      isPaused = false;
      currentAudio.play();
      pauseBtn.textContent = 'Pause';
      status.textContent = 'Riproduzione in corso...';
    } else {
      // Metti in pausa
      isPaused = true;
      currentAudio.pause();
      pauseBtn.textContent = 'Riprendi';
      status.textContent = 'In pausa';
    }
  });
})();