// ==UserScript==
// @name         YouTube Subtitle Reader con TTS
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Legge ad alta voce i sottotitoli dei video di YouTube
// @author       Flejta
// @match        https://www.youtube.com/watch?v*
// @include     https://www.youtube.com/shorts/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531213/YouTube%20Subtitle%20Reader%20con%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/531213/YouTube%20Subtitle%20Reader%20con%20TTS.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Bypass per TrustedHTML
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy("default", {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  //#region A: stili CSS
  // Aggiungi stili CSS
  GM_addStyle(`
            #subtitle-reader-btn {
                background-color: #3ea6ff;
                color: #0f0f0f;
                border: none;
                border-radius: 18px;
                padding: 10px 16px;
                margin-left: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                font-family: Roboto, Arial, sans-serif;
                transition: background-color 0.2s;
            }
            #subtitle-reader-btn:hover {
                background-color: #65b8ff;
            }
            #subtitle-reader-btn.reading {
                background-color: #4caf50;
            }
            .spinner {
                display: inline-block;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3ea6ff;
                border-radius: 50%;
                width: 14px;
                height: 14px;
                margin-left: 8px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);
  //#endregion A: stili CSS

  //#region B: Variabili globali e costanti
  // Variabili globali
  let capturedSubtitles = "";
  let speechSynth = window.speechSynthesis;
  let isReading = false;
  // Variabili globali aggiunte
  let capturedSubtitleEntries = []; // Array di sottotitoli
  let isReadingActive = false; // Stato di lettura
  let lastReadIndex = -1; // Indice dell'ultimo sottotitolo letto
  let preferredVoice = null; // Voce TTS preferita
  let speechRate = 1.0; // Velocità di lettura TTS
  let translationCache = {}; // Cache per le traduzioni
  const GROUP_SIZE = 30; // Dimensione del gruppo di sottotitoli da tradurre insieme (circa 3 minuti)
  let lastReadTime = 0;
  let plannedSubtitles = {
    startIndex: -1,
    endIndex: -1,
    rate: 1.0,
    lastUpdate: 0,
  };
  let subtitleFadeoutTimer = null;
  /**
   * Configurazione per la gestione della velocità video
   */
  const videoSpeedConfig = {
    normalSpeed: 1.0, // Velocità normale del video
    minSpeed: 0.75, // Velocità minima a cui rallentiamo il video
    currentSpeed: 1.0, // Velocità corrente (inizializzata a normale)
    isAdaptiveSpeedEnabled: true, // Abilita/disabilita l'adattamento velocità
    transitionDuration: 300, // Durata della transizione di velocità in ms
    speedRestoreTimeout: null, // Timeout per ripristinare la velocità normale
    lastSpeedChangeTime: 0, // Timestamp dell'ultimo cambio di velocità
    speedChangeHistory: [], // Storico cambi di velocità per analisi
  };
  // Prompt Groq ottimizzato per sottotitoli YouTube
  const groqPromptYouTube = `Sei un esperto nell'elaborazione e traduzione di sottotitoli di YouTube. Il tuo compito è migliorarli per la lettura tramite sintesi vocale (TTS) e tradurli dalla lingua di origine alla lingua target.

LINGUA DI ORIGINE: {sourceLang}: se auto allora devi determinare automaticamente la lingua, questo vale anche nel caso in cui ti accorga che la lingua di origine indicata è errata
LINGUA TARGET: {targetLang}

OBIETTIVI IN ORDINE DI PRIORITÀ:
1. TRADURRE accuratamente il testo dalla lingua di origine alla lingua target
2. RIMUOVERE tutti gli elementi non discorsivi come "(rise)", "umm", suoni, indicazioni tra parentesi, risate trascritte ecc.
3. EVITARE DI SPEZZARE FRASI - Le frasi devono rimanere complete e non interrotte tra sottotitoli diversi
4. UNIRE sottotitoli consecutivi in frasi più lunghe quando non ci sono pause significative
5. Aggiungere punteggiatura appropriata dove manca (i sottotitoli automatici di YouTube spesso ne sono privi)
6. Garantire naturalezza nella lingua target (non una traduzione meccanica)

REGOLE PER L'UNIONE DEI SOTTOTITOLI:
- Unisci sottotitoli adiacenti SOLO quando non c'è una pausa significativa tra loro, che è segnata con il marcatore [PAUSE] che non va tradotto e va sempre rimosso
- Non superare MAI i 150 caratteri per sottotitolo
- Unisci tutti i sottotitoli brevi (meno di 5 parole) con quelli adiacenti quando possibile
- Quando unisci sottotitoli consecutivi, il nuovo timestamp di inizio deve essere uguale al timestamp del primo sottotitolo originale

REGOLE PER LA DIVISIONE DEI SOTTOTITOLI:
- I sottotitoli che superano i 150 caratteri devono essere divisi, possibilmente cercando di mantenere blocchi di senso compiuto
- In caso di divisione, il timestamp di inizio del primo sottotitolo rimarrà invariato, quello del secondo dovrà essere intelligentemente calcolato

FORMATO DI OUTPUT:
{
  "improved_subtitles": [
    {
      "start": number, // timestamp di inizio in secondi (float)
      "text": string,  // testo tradotto e migliorato
      "estimated_duration": number, // durata stimata in secondi della lettura (float)
      "end": number,   // timestamp di fine del sottotitolo (calcolato come l'inizio del successivo o inizio + durata stimata per l'ultimo)
      "original_indices": [number, number, ...] // indici dei sottotitoli originali che hanno contribuito a questo sottotitolo
    },
    ...
  ],
  "statistics": {
    "original_count": number, // numero di sottotitoli originali
    "improved_count": number, // numero di sottotitoli dopo elaborazione
    "translation_language": string // lingua in cui è stata fatta la traduzione
  }
}

Ecco i sottotitoli originali da elaborare:
`;
  /**
   * Elenco aggiornato dei modelli Groq disponibili (Marzo 2025)
   * Questo array contiene i modelli attivi, rimossi quelli decommissionati
   */
  const AVAILABLE_GROQ_MODELS = [
    {
      id: "llama-3.1-8b-instant",
      name: "Llama 3.1 8B (veloce, consigliato)",
      contextWindow: 128000,
    },
    {
      id: "llama3-70b-8192",
      name: "Llama 3 70B (più preciso)",
      contextWindow: 8192,
    },
    {
      id: "gemma-7b-it",
      name: "Gemma 7B (bilanciato)",
      contextWindow: 8192,
    },
    {
      id: "llama-3.1-70b-versatile",
      name: "Llama 3.1 70B (alta qualità)",
      contextWindow: 128000,
    },
  ];

  //#endregion B: Variabili globali e costanti

  //#region FUNZIONI C: PER LA SINTESI VOCALE

  // Inizializza la sintesi vocale e carica le voci disponibili
  function initSpeechSynthesis() {
    return new Promise((resolve, reject) => {
      // Se la voce è già stata caricata, risolvi subito
      if (preferredVoice) {
        resolve(preferredVoice);
        return;
      }

      // Funzione per caricare le voci
      function loadVoices() {
        const voices = speechSynth.getVoices();
        if (voices.length === 0) {
          setTimeout(loadVoices, 100);
          return;
        }

        // Cerca prima la voce Google in italiano
        let voice = voices.find(function (v) {
          return v.lang.includes("it-IT") && v.name.includes("Google");
        });

        // Se non trova una voce Google in italiano, cerca qualsiasi voce italiana
        if (!voice) {
          voice = voices.find(function (v) {
            return v.lang.includes("it");
          });
        }

        // Se ancora non trova una voce italiana, usa la prima voce disponibile
        if (!voice && voices.length > 0) {
          voice = voices[0];
        }

        console.log(
          "Voci disponibili:",
          voices
            .map(function (v) {
              return v.name + " (" + v.lang + ")";
            })
            .join(", ")
        );
        console.log("Voce selezionata:", voice ? voice.name + " (" + voice.lang + ")" : "Nessuna voce trovata");

        preferredVoice = voice;
        resolve(voice);
      }

      loadVoices();

      // In alcuni browser, onvoiceschanged viene attivato quando le voci sono pronte
      if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = loadVoices;
      }

      // Timeout se le voci non vengono caricate
      setTimeout(function () {
        if (!preferredVoice) {
          reject(new Error("Timeout nel caricamento delle voci"));
        }
      }, 5000);
    });
  }

  // Funzione per leggere un testo utilizzando la sintesi vocale
  function speakText(text) {
    return new Promise((resolve, reject) => {
      if (!text) {
        resolve();
        return;
      }

      // Pulisci eventuali letture precedenti
      speechSynth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice ? preferredVoice.lang : "it-IT";
      utterance.rate = speechRate; // Utilizza la velocità calcolata
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = function () {
        console.log("Lettura completata");
        resolve();
      };

      utterance.onerror = function (event) {
        console.error("Errore nella sintesi vocale:", event);
        reject(new Error("Errore durante la lettura"));
      };

      speechSynth.speak(utterance);
      console.log(`Lettura avviata (velocità ${speechRate.toFixed(1)}x)`);
    });
  }

  // Versione migliorata di speakTextWithRate
  function speakTextWithRate(text, rateToUse) {
    return new Promise((resolve, reject) => {
      if (!text || !text.trim()) {
        resolve();
        return;
      }

      // Verifica preliminare che la voce sia pronta
      if (!preferredVoice) {
        console.warn("Voce TTS non ancora inizializzata, riprovo...");
        initSpeechSynthesis()
          .then((voice) => {
            preferredVoice = voice;
            // Riprova la chiamata una volta che la voce è pronta
            speakTextWithRate(text, rateToUse).then(resolve).catch(reject);
          })
          .catch((err) => {
            console.error("Impossibile inizializzare la voce:", err);
            reject(new Error("Voce TTS non disponibile"));
          });
        return;
      }

      try {
        // Interrompi qualsiasi sintesi vocale in corso PRIMA di creare una nuova utterance
        if (speechSynth.speaking || speechSynth.pending) {
          speechSynth.cancel();
          // Breve attesa per dare tempo al sistema di liberare le risorse
          setTimeout(() => {
            try {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.voice = preferredVoice;
              utterance.lang = preferredVoice.lang;
              utterance.rate = rateToUse;
              utterance.pitch = 1.0;
              utterance.volume = 1.0;

              utterance.onend = () => {
                resolve();
              };

              utterance.onerror = (event) => {
                console.error("Errore nella sintesi vocale:", event);
                reject(new Error("Errore durante la lettura TTS: " + (event.error || "sconosciuto")));
              };

              speechSynth.speak(utterance);
              console.log(`Lettura avviata (${text.substring(0, 30)}...) con velocità ${rateToUse.toFixed(2)}x`);
            } catch (e) {
              console.error("Errore durante speak dopo timeout:", e);
              reject(e);
            }
          }, 50);
        } else {
          // Se la sintesi vocale non è attiva, utilizza direttamente
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
          utterance.rate = rateToUse;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          utterance.onend = () => {
            resolve();
          };

          utterance.onerror = (event) => {
            console.error("Errore nella sintesi vocale:", event);
            reject(new Error("Errore durante la lettura TTS: " + (event.error || "sconosciuto")));
          };

          speechSynth.speak(utterance);
          console.log(`Lettura avviata (${text.substring(0, 30)}...) con velocità ${rateToUse.toFixed(2)}x`);
        }
      } catch (e) {
        console.error("Errore immediato in speechSynth.speak:", e);
        reject(e);
      }
    });
  }

  /**
   * Versione migliorata di startReadingFromTime che gestisce anche
   * l'adattamento della velocità video per migliorare la lettura
   */
  function startReadingFromTimeEnhanced(time) {
    // Trova il sottotitolo che dovrebbe essere attivo o sta per iniziare
    const currentSubtitle = findSubtitleAtTime(time, 0.5); // Anticipa di 0.5 secondi

    // Se non troviamo un sottotitolo valido per questo tempo, non fare nulla
    if (!currentSubtitle) {
      return;
    }

    // Cerca il prossimo sottotitolo per calcoli di timing
    let nextSubtitle = null;
    if (currentSubtitle.index < capturedSubtitleEntries.length - 1) {
      const nextIndex = currentSubtitle.index + 1;
      nextSubtitle = {
        index: nextIndex,
        text: capturedSubtitleEntries[nextIndex].text,
        startTime: capturedSubtitleEntries[nextIndex].start,
        endTime:
          nextIndex < capturedSubtitleEntries.length - 1
            ? capturedSubtitleEntries[nextIndex + 1].start
            : capturedSubtitleEntries[nextIndex].start + estimateReadingTime(capturedSubtitleEntries[nextIndex].text),
      };
    }

    // Verifica se la sintesi vocale è attualmente attiva
    const isSpeaking = speechSynth.speaking || speechSynth.pending;

    // Se è lo stesso sottotitolo che stiamo già leggendo, non fare nulla
    if (currentSubtitle.index === lastReadIndex && isSpeaking) {
      return;
    }

    // Se stiamo già leggendo qualcosa, decidi se continuare o interrompere
    if (isSpeaking && lastReadIndex >= 0 && lastReadIndex !== currentSubtitle.index) {
      const previousSubtitle = {
        index: lastReadIndex,
        text: capturedSubtitleEntries[lastReadIndex].text,
        startTime: capturedSubtitleEntries[lastReadIndex].start,
        endTime:
          lastReadIndex < capturedSubtitleEntries.length - 1
            ? capturedSubtitleEntries[lastReadIndex + 1].start
            : capturedSubtitleEntries[lastReadIndex].start + estimateReadingTime(capturedSubtitleEntries[lastReadIndex].text),
      };

      // Decidi se continuare a leggere il sottotitolo precedente
      if (shouldContinueReading(previousSubtitle, currentSubtitle)) {
        console.log(`Continuo a leggere sottotitolo [${lastReadIndex}] invece di interrompere per [${currentSubtitle.index}]`);
        return;
      }
    }

    // Calcola il tempo totale disponibile per questo sottotitolo (con un minimo)
    const totalAvailableTime = Math.max(nextSubtitle ? nextSubtitle.startTime - currentSubtitle.startTime : 2.0, 0.5); // Minimo 0.5s

    // Ottieni le impostazioni di lingua correnti
    const sourceLanguageSelector = document.getElementById("source-language-selector");
    const targetLanguageSelector = document.getElementById("target-language-selector");
    const sourceLang = sourceLanguageSelector ? sourceLanguageSelector.value : "auto";
    const targetLang = targetLanguageSelector ? targetLanguageSelector.value : "it";

    // Funzione interna per eseguire la lettura
    const processAndRead = (textToRead) => {
      // Pulisci eventuali spazi bianchi extra e controlla se il testo è vuoto
      const cleanedText = textToRead ? textToRead.trim() : "";
      if (!cleanedText) {
        console.log(`Sottotitolo [${currentSubtitle.index}] vuoto dopo pulizia, salto lettura.`);
        return;
      }

      // Stima il tempo necessario per leggere il testo alla velocità normale
      const estimatedReadingTime = estimateReadingTime(cleanedText);

      // MODIFICA: Verifica se è necessario rallentare il video
      if (estimatedReadingTime > totalAvailableTime * 1.1) {
        // Se serve più del 110% del tempo disponibile
        // Adatta la velocità del video per dare più tempo alla lettura
        adaptVideoSpeed(estimatedReadingTime, totalAvailableTime);
      }

      // Calcola la velocità ottimale (ora possiamo usare una velocità più costante)
      // Dato che adattiamo la velocità del video, possiamo mantenere una velocità di lettura più naturale
      const optimalRate = calculateOptimalRateEnhanced(cleanedText, totalAvailableTime, 1.0, 1.25); // Limitiamo l'accelerazione a max 1.25x

      console.log(
        `Ripresa/Salto a [${currentSubtitle.index}] (Rate: ${optimalRate.toFixed(2)}x): "${cleanedText.substring(0, 50)}..."`,
        `[Tempo Totale: ${totalAvailableTime.toFixed(1)}s, Stimato@1x: ${estimatedReadingTime.toFixed(1)}s]`
      );

      // Mostra i sottotitoli tradotti (se l'opzione è abilitata)
      const showSubtitlesCheckbox = document.getElementById("show-subtitles-checkbox");
      if (showSubtitlesCheckbox && showSubtitlesCheckbox.checked && targetLang !== "off" && targetLang !== sourceLang) {
        showTranslatedSubtitle(cleanedText);
      }

      // Interrompi qualsiasi lettura precedente
      try {
        if (speechSynth.speaking || speechSynth.pending) {
          speechSynth.cancel();
        }
      } catch (e) {
        console.error("Errore durante speechSynth.cancel() in startReadingFromTimeEnhanced:", e);
      }

      // Piccolo timeout per dare tempo al cancel() di avere effetto
      setTimeout(() => {
        // Salva informazioni sul testo attuale per le stime future
        window._lastReadText = cleanedText;
        window._lastReadTime = Date.now();

        speakTextWithRate(cleanedText, optimalRate)
          .then(() => {
            // Al completamento della lettura, pianifica il ripristino della velocità video
            if (videoSpeedConfig.currentSpeed < videoSpeedConfig.normalSpeed) {
              scheduleSpeedRestore();
            }
          })
          .catch((err) => {
            console.error(`Errore durante speakTextWithRate su ripresa/salto per indice ${currentSubtitle.index}:`, err);
          });

        // Aggiorna l'indice dell'ultimo sottotitolo letto
        lastReadIndex = currentSubtitle.index;
        lastReadTime = Date.now();
      }, 50);
    };

    // Traduci se necessario, altrimenti usa il testo originale
    if (targetLang && targetLang !== "off" && (targetLang !== sourceLang || sourceLang === "auto")) {
      getTranslatedSubtitle(currentSubtitle.index, sourceLang, targetLang)
        .then((translatedText) => {
          processAndRead(translatedText || currentSubtitle.text);
        })
        .catch((err) => {
          console.error(`Errore recupero traduzione su ripresa/salto per indice ${currentSubtitle.index}, uso originale:`, err);
          processAndRead(currentSubtitle.text);
        });
    } else {
      processAndRead(currentSubtitle.text);
    }
  }

  /**
   * Gestisce in modo intelligente l'interruzione e la continuazione della lettura.
   * Decide se completare la lettura corrente o interromperla per il nuovo sottotitolo.
   * @param {Object} currentSubtitle - Il sottotitolo che dovrebbe essere letto ora
   * @param {Object} nextSubtitle - Il sottotitolo successivo (opzionale)
   * @return {boolean} - True se dovremmo continuare a leggere, false se interrompere
   */
  function shouldContinueReading(currentSubtitle, nextSubtitle) {
    // Se la sintesi vocale non sta parlando, non c'è decisione da prendere
    if (!speechSynth.speaking) {
      return false;
    }

    // Se non c'è un prossimo sottotitolo, continua la lettura
    if (!nextSubtitle) {
      return true;
    }

    // Calcola quanto tempo rimane prima del prossimo sottotitolo
    const videoElement = document.querySelector("video");
    if (!videoElement) return false;

    const currentTime = videoElement.currentTime;
    const timeUntilNextSubtitle = nextSubtitle.startTime - currentTime;

    // Stima quanto tempo resta per finire la lettura corrente
    // Utilizza la percentuale di completamento del testo e la durata stimata
    const estimatedRemainingTime = getRemainingReadingTime();

    console.log(
      `Analisi continuazione: Tempo al prossimo sottotitolo: ${timeUntilNextSubtitle.toFixed(2)}s, Tempo stimato per finire: ${estimatedRemainingTime.toFixed(
        2
      )}s`
    );

    // Se il tempo restante è sufficiente, continua la lettura
    if (timeUntilNextSubtitle > estimatedRemainingTime * 1.1) {
      // 10% di margine
      return true;
    }

    // Se il sottotitolo corrente è particolarmente importante (fine frase, ecc.), dagli priorità
    if (isImportantSubtitle(currentSubtitle.text)) {
      return true;
    }

    // Altrimenti, interrompi la lettura corrente per passare al prossimo sottotitolo
    return false;
  }

  /**
   * Stima il tempo rimanente per completare la lettura corrente
   * @return {number} - Tempo stimato in secondi
   */
  function getRemainingReadingTime() {
    // In assenza di un metodo diretto per conoscere il tempo restante,
    // facciamo una stima approssimativa basata sul testo e la velocità
    if (!speechSynth.speaking) return 0;

    // Se stiamo usando l'API SpeechSynthesis nativa, non abbiamo un modo diretto
    // per sapere quanto testo è già stato letto. Utilizziamo una stima basata
    // sul tempo trascorso e la lunghezza totale del testo

    // Otteniamo l'ultimo testo che è stato avviato per la lettura
    const lastReadText = window._lastReadText || "";
    const elapsedTime = (Date.now() - (window._lastReadTime || Date.now())) / 1000;
    const totalEstimatedTime = estimateReadingTime(lastReadText) / speechRate;

    // Stima una percentuale di completamento basata sul tempo
    const estimatedProgress = Math.min(elapsedTime / totalEstimatedTime, 0.95); // max 95% per sicurezza
    const estimatedRemaining = totalEstimatedTime * (1 - estimatedProgress);

    return Math.max(estimatedRemaining, 0.2); // minimo 0.2 secondi per sicurezza
  }

  /**
   * Verifica se un sottotitolo è particolarmente importante da completare
   * @param {string} text - Il testo del sottotitolo
   * @return {boolean} - True se è importante completare questo sottotitolo
   */
  function isImportantSubtitle(text) {
    if (!text) return false;

    // Sottotitoli che terminano con punteggiatura forte sono probabilmente fine frase
    if (/[.!?]$/.test(text.trim())) {
      return true;
    }

    // Sottotitoli brevi (probabilmente esclamazioni o comandi importanti)
    if (text.length < 15 && /[!?]/.test(text)) {
      return true;
    }

    // Sottotitoli che contengono nomi propri o numeri importanti
    const containsImportantInfo = /\b([A-Z][a-z]+\s[A-Z][a-z]+|[0-9]{4,})\b/.test(text);

    return containsImportantInfo;
  }

  //#endregion FUNZIONI C: PER LA SINTESI VOCALE

  //#region FUNZIONI D: PER GESTIONE ADATTIVA VELOCITÀ VIDEO

  /**
   * Cancella eventuali ripristini velocità programmati
   */
  function clearScheduledSpeedRestore() {
    if (videoSpeedConfig.speedRestoreTimeout) {
      clearTimeout(videoSpeedConfig.speedRestoreTimeout);
      videoSpeedConfig.speedRestoreTimeout = null;
    }
  }

  /**
   * Pianifica il ripristino graduale della velocità normale
   */
  function scheduleSpeedRestore() {
    // Cancella eventuali ripristini già programmati
    clearScheduledSpeedRestore();

    // Pianifica un nuovo ripristino
    videoSpeedConfig.speedRestoreTimeout = setTimeout(() => {
      // Ripristina gradualmente la velocità normale
      const videoElement = document.querySelector("video");
      if (!videoElement || videoElement.paused) return;

      // Verifica se la sintesi vocale è ancora attiva
      if (speechSynth.speaking) {
        // Se stiamo ancora parlando, ritarda ulteriormente il ripristino
        scheduleSpeedRestore();
        return;
      }

      // Altrimenti, ripristina gradualmente la velocità
      console.log("Ripristino velocità video normale...");
      applyVideoSpeed(videoSpeedConfig.normalSpeed);
    }, 1500); // Attendi 1.5 secondi dopo la fine della lettura
  }

  /**
   * Applica la velocità al video con una transizione fluida
   * @param {number} targetSpeed - Velocità target
   */
  function applyVideoSpeed(targetSpeed) {
    const videoElement = document.querySelector("video");
    if (!videoElement) return;

    const startSpeed = videoElement.playbackRate;
    const startTime = performance.now();
    const duration = videoSpeedConfig.transitionDuration;

    // Funzione per l'animazione della transizione
    function animateSpeed(currentTime) {
      const elapsed = currentTime - startTime;
      if (elapsed >= duration) {
        videoElement.playbackRate = targetSpeed;
        videoSpeedConfig.currentSpeed = targetSpeed;
        videoSpeedConfig.lastSpeedChangeTime = Date.now();
        return;
      }

      // Calcola la velocità intermedia con easing
      const progress = elapsed / duration;
      const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // Sinusoidal easing
      const newSpeed = startSpeed + (targetSpeed - startSpeed) * easedProgress;

      videoElement.playbackRate = newSpeed;
      requestAnimationFrame(animateSpeed);
    }

    // Avvia l'animazione
    requestAnimationFrame(animateSpeed);
  }

  /**
   * Regola la velocità di riproduzione del video in base al tempo necessario
   * per la lettura del sottotitolo corrente.
   *
   * @param {number} neededTime - Tempo stimato necessario per la lettura completa (in secondi)
   * @param {number} availableTime - Tempo disponibile prima del prossimo sottotitolo (in secondi)
   * @param {Object} options - Opzioni aggiuntive
   * @returns {Object} - Informazioni sul cambio di velocità effettuato
   */
  function adaptVideoSpeed(neededTime, availableTime, options = {}) {
    // Se l'adattamento della velocità è disabilitato, non fare nulla
    if (!videoSpeedConfig.isAdaptiveSpeedEnabled) {
      return { changed: false, reason: "adaptive_speed_disabled" };
    }

    const videoElement = document.querySelector("video");
    if (!videoElement) {
      return { changed: false, reason: "video_element_not_found" };
    }

    // Se il tempo necessario è minore o uguale al tempo disponibile, non serve rallentare
    if (neededTime <= availableTime) {
      // Se la velocità è stata già modificata, pianifica un ripristino graduale
      if (videoSpeedConfig.currentSpeed < videoSpeedConfig.normalSpeed) {
        scheduleSpeedRestore();
      }
      return { changed: false, reason: "enough_time_available" };
    }

    // Calcola il fattore di rallentamento necessario
    const requiredSlowdownFactor = neededTime / availableTime;

    // Determina la nuova velocità target (più lenta)
    let targetSpeed = videoSpeedConfig.normalSpeed / requiredSlowdownFactor;

    // Limita la velocità minima consentita
    targetSpeed = Math.max(targetSpeed, videoSpeedConfig.minSpeed);

    // Arrotonda a 0.05 più vicino per maggiore stabilità
    targetSpeed = Math.round(targetSpeed * 20) / 20;

    // Se la differenza è minima, non cambiare
    if (Math.abs(videoSpeedConfig.currentSpeed - targetSpeed) < 0.05) {
      return { changed: false, reason: "minimal_change" };
    }

    // Evita cambiamenti troppo frequenti della velocità (minimo 1 secondo tra i cambi)
    const now = Date.now();
    if (now - videoSpeedConfig.lastSpeedChangeTime < 1000 && !options.force) {
      return { changed: false, reason: "too_frequent" };
    }

    // Registra il cambio di velocità per analisi
    videoSpeedConfig.speedChangeHistory.push({
      time: now,
      from: videoSpeedConfig.currentSpeed,
      to: targetSpeed,
      neededTime: neededTime,
      availableTime: availableTime,
    });

    // Limita la dimensione dello storico
    if (videoSpeedConfig.speedChangeHistory.length > 10) {
      videoSpeedConfig.speedChangeHistory.shift();
    }

    // Applica la nuova velocità con transizione fluida
    applyVideoSpeed(targetSpeed);

    // Cancella eventuali ripristini di velocità programmati
    clearScheduledSpeedRestore();

    console.log(`Velocità video adattata: ${targetSpeed.toFixed(2)}x (necessario: ${neededTime.toFixed(2)}s, disponibile: ${availableTime.toFixed(2)}s)`);

    return {
      changed: true,
      fromSpeed: videoSpeedConfig.currentSpeed,
      toSpeed: targetSpeed,
      reason: "needed_more_time",
    };
  }

  //#endregion FUNZIONI D: PER GESTIONE ADATTIVA VELOCITÀ VIDEO

  //#region FUNZIONE 1: Aggiunta del pulsante e pannello impostazioni
  function addButton() {
    // Verifica se il pulsante esiste già
    if (document.getElementById("subtitle-reader-btn")) {
      return;
    }

    // Cerca l'elemento target dove inserire il pulsante
    const targetElement = document.querySelector("#above-the-fold #top-row #owner");

    if (!targetElement) {
      // Se non troviamo l'elemento, riproviamo più tardi
      setTimeout(addButton, 1000);
      return;
    }

    // Crea il pulsante
    const button = document.createElement("button");
    button.id = "subtitle-reader-btn";
    button.textContent = "Leggi Sottotitoli";

    // Aggiungi l'evento click
    button.addEventListener("click", buttonPress);

    // Aggiungi il pulsante alla pagina
    targetElement.appendChild(button);
    console.log("Pulsante aggiunto");
  }

  // Funzione per aggiungere il pulsante diviso (principale + impostazioni)
  function addSplitButton() {
    console.log("Aggiunta pulsante diviso");

    // Verifica se il pulsante esiste già
    if (document.getElementById("subtitle-reader-container")) {
      return;
    }

    // Cerca l'elemento target dove inserire il pulsante
    const targetElement = document.querySelector("#above-the-fold #top-row #owner");
    if (!targetElement) {
      // Se non troviamo l'elemento, riproviamo più tardi
      setTimeout(addSplitButton, 1000);
      return;
    }

    // Crea il container per i pulsanti
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "subtitle-reader-container";
    buttonContainer.style.cssText = `
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    position: relative;
  `;

    // Crea il pulsante principale
    const mainButton = document.createElement("button");
    mainButton.id = "subtitle-reader-btn";
    mainButton.textContent = "Leggi";
    mainButton.style.cssText = `
    background-color: #3ea6ff;
    color: #0f0f0f;
    border: none;
    border-radius: 18px 0 0 18px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: Roboto, Arial, sans-serif;
    transition: background-color 0.2s;
    height: 36px;
    line-height: 1;
  `;

    // Crea il pulsante delle impostazioni
    const settingsButton = document.createElement("button");
    settingsButton.id = "subtitle-settings-btn";
    settingsButton.innerHTML = "⚙️";
    settingsButton.style.cssText = `
    background-color: #3ea6ff;
    color: #0f0f0f;
    border: none;
    border-radius: 0 18px 18px 0;
    padding: 8px 10px;
    font-size: 16px;
    cursor: pointer;
    font-family: Roboto, Arial, sans-serif;
    transition: background-color 0.2s;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    height: 36px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

    // Crea il pannello delle impostazioni
    const settingsPanel = createSettingsPanel();

    // IMPORTANTE: Aggiunta dell'evento click con funzione wrapper esplicita
    mainButton.addEventListener("click", function (e) {
      console.log("Pulsante principale cliccato");
      buttonPress(); // Chiamata esplicita alla funzione
    });

    settingsButton.addEventListener("click", function (e) {
      e.stopPropagation(); // Previene il bubbling dell'evento
      const isVisible = settingsPanel.style.display === "block";
      settingsPanel.style.display = isVisible ? "none" : "block";

      // Aggiungi questa condizione per rilevare la lingua quando il pannello viene mostrato
      if (!isVisible) {
        detectSubtitleLanguage(); // Rileva la lingua quando il pannello si apre
      }
    });

    // Chiudi il pannello quando si fa clic altrove
    document.addEventListener("click", function (e) {
      if (!buttonContainer.contains(e.target)) {
        settingsPanel.style.display = "none";
      }
    });

    // Effetti hover
    mainButton.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#65b8ff";
    });

    mainButton.addEventListener("mouseout", function () {
      if (!isReadingActive) {
        this.style.backgroundColor = "#3ea6ff";
      }
    });

    settingsButton.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#65b8ff";
    });

    settingsButton.addEventListener("mouseout", function () {
      this.style.backgroundColor = "#3ea6ff";
    });

    // Assembla i componenti
    buttonContainer.appendChild(mainButton);
    buttonContainer.appendChild(settingsButton);
    buttonContainer.appendChild(settingsPanel);

    // Aggiungi il container alla pagina
    targetElement.appendChild(buttonContainer);
    console.log("Pulsante diviso aggiunto con pannello impostazioni");
  }

  // Aggiorna la funzione che cambia lo stato del pulsante
  function updateButtonState(isActive) {
    const mainButton = document.getElementById("subtitle-reader-btn");
    if (mainButton) {
      if (isActive) {
        mainButton.textContent = "Attivo";
        mainButton.style.backgroundColor = "#4caf50"; // Verde
      } else {
        mainButton.textContent = "Leggi";
        mainButton.style.backgroundColor = "#3ea6ff"; // Blu
      }
    }
  }

  // Funzione per creare il pannello delle impostazioni
  function createSettingsPanel() {
    console.log("Creazione pannello impostazioni");

    // Crea il pannello delle impostazioni
    const settingsPanel = document.createElement("div");
    settingsPanel.id = "subtitle-settings-panel";
    settingsPanel.style.cssText = `
      display: none;
      position: absolute;
      top: 40px;
      left: 0;
      background-color: #212121;
      padding: 16px;
      border-radius: 8px;
      margin-top: 5px;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      width: 300px;
      color: white;
      font-family: Roboto, Arial, sans-serif;
    `;

    // Crea il contenuto del pannello
    const panelContent = `
      <div style="border-bottom: 1px solid #3a3a3a; padding-bottom: 12px; margin-bottom: 12px;">
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px; color: #fff;">
          Impostazioni sottotitoli
        </div>
      </div>

      <!-- Sezione Traduzione -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #ddd;">
          Traduzione
        </div>

        <div style="margin-bottom: 12px;">
         <label for="source-language-selector" id="source-language-label" style="display: block; margin-bottom: 4px; font-size: 13px; color: #aaa;">
            Lingua originale <span id="detected-language-display" style="font-size: 12px; color: #ffab40;"></span>
         </label>
          <select id="source-language-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
            <option value="auto">Rilevamento automatico</option>
            <option value="en">Inglese</option>
            <option value="it">Italiano</option>
            <option value="es">Spagnolo</option>
            <option value="fr">Francese</option>
            <option value="de">Tedesco</option>
            <option value="zh">Cinese</option>
            <option value="ja">Giapponese</option>
            <option value="ko">Coreano</option>
            <option value="ru">Russo</option>
            <option value="ar">Arabo</option>
          </select>
        </div>

        <div style="margin-bottom: 12px;">
          <label for="target-language-selector" style="display: block; margin-bottom: 4px; font-size: 13px; color: #aaa;">
            Traduci in
          </label>
          <select id="target-language-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
            <option value="off">Nessuna traduzione</option>
            <option value="it">Italiano</option>
            <option value="en">Inglese</option>
            <option value="es">Spagnolo</option>
            <option value="fr">Francese</option>
            <option value="de">Tedesco</option>
            <option value="zh">Cinese</option>
            <option value="ja">Giapponese</option>
            <option value="ko">Coreano</option>
            <option value="ru">Russo</option>
            <option value="ar">Arabo</option>
          </select>
        </div>
      </div>

      <!-- Sezione Visualizzazione -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #ddd;">
          Visualizzazione
        </div>

        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <input type="checkbox" id="show-subtitles-checkbox" style="margin-right: 8px;">
          <label for="show-subtitles-checkbox" style="font-size: 13px; color: #bbb;">
            Mostra sottotitoli tradotti
          </label>
        </div>
      </div>

      <!-- Sezione Modalità (spostata in fondo) -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #ddd;">
          Modalità di elaborazione
        </div>
        <div style="margin-bottom: 12px;">
  <select id="processing-mode-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
    <option value="normal">Normale (base)</option>
    <option value="ai">AI - elaborazione avanzata</option>
  </select>
</div>

<div id="ai-settings" style="margin-bottom: 12px; display: none;">
  <label for="api-key-input" style="display: block; margin-bottom: 4px; font-size: 13px; color: #aaa;">
    API key Groq
  </label>
  <div style="display: flex;">
    <input type="password" id="api-key-input" placeholder="Inserisci API key" style="flex-grow: 1; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px 0 0 4px; font-size: 13px;">
    <button id="test-api-key" style="padding: 8px 12px; background-color: #3ea6ff; color: #0f0f0f; border: none; border-radius: 0 4px 4px 0; font-size: 13px; cursor: pointer;">Test</button>
  </div>
  <div id="api-key-status" style="margin-top: 4px; font-size: 12px; display: none;"></div>

  <div style="display: flex; align-items: center; margin-top: 4px;">
    <input type="checkbox" id="show-api-key" style="margin-right: 8px;">
    <label for="show-api-key" style="font-size: 12px; color: #aaa;">Mostra API key</label>
  </div>

  <label for="ai-model-selector" style="display: block; margin-top: 12px; margin-bottom: 4px; font-size: 13px; color: #aaa;">
    Modello AI
  </label>
    <select id="ai-model-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
  </select>
</div>
</div>

<!-- Footer con link e info -->
<div style="border-top: 1px solid #3a3a3a; padding-top: 12px; font-size: 11px; color: #888; text-align: center;">
  YouTube Subtitle Reader v0.3
</div>  `;

    settingsPanel.innerHTML = panelContent;

    // Aggiungi l'evento per mostrare/nascondere le impostazioni AI
    // Aggiungi l'evento per mostrare/nascondere le impostazioni AI
    setTimeout(() => {
      const processingModeSelector = document.getElementById("processing-mode-selector");
      const aiSettings = document.getElementById("ai-settings");
      const showApiKeyCheckbox = document.getElementById("show-api-key");
      const apiKeyInput = document.getElementById("api-key-input");

      if (processingModeSelector && aiSettings) {
        processingModeSelector.addEventListener("change", function () {
          aiSettings.style.display = this.value === "ai" ? "block" : "none";
        });
      }

      if (showApiKeyCheckbox && apiKeyInput) {
        showApiKeyCheckbox.addEventListener("change", function () {
          apiKeyInput.type = this.checked ? "text" : "password";
        });
      }

      // Precompilazione per sviluppo
      if (apiKeyInput) {
        apiKeyInput.value = "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";
      }

      // AGGIUNGI QUI IL CODICE PER IL PULSANTE DI TEST
      const testApiKeyButton = document.getElementById("test-api-key");
      const apiKeyStatus = document.getElementById("api-key-status");

      if (testApiKeyButton && apiKeyInput && apiKeyStatus) {
        testApiKeyButton.addEventListener("click", async function () {
          // Mostra indicatore di caricamento
          testApiKeyButton.disabled = true;
          testApiKeyButton.textContent = "...";
          apiKeyStatus.style.display = "block";
          apiKeyStatus.textContent = "Verifica in corso...";
          apiKeyStatus.style.color = "#ffab40";

          // Testa la chiave API
          const isValid = await testGroqApiKey(apiKeyInput.value);

          // Aggiorna UI in base al risultato
          testApiKeyButton.disabled = false;
          testApiKeyButton.textContent = "Test";

          if (isValid) {
            apiKeyStatus.textContent = "API key valida!";
            apiKeyStatus.style.color = "#4caf50";

            // Salva la chiave verificata
            saveSettings();
          } else {
            apiKeyStatus.textContent = "API key non valida o errore di connessione";
            apiKeyStatus.style.color = "#ff5252";
          }
        });
      }
    }, 100);

    // Previeni la chiusura del pannello quando si fa clic all'interno
    settingsPanel.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    return settingsPanel;
  }

  // Funzione per salvare le impostazioni
  function saveSettings() {
    const processingMode = document.getElementById("processing-mode-selector")?.value || "normal";
    const apiKey = document.getElementById("api-key-input")?.value || "";
    const aiModel = document.getElementById("ai-model-selector")?.value || "mixtral-8x7b-32768";

    // Ottieni anche altre impostazioni dalla UI
    const sourceLang = document.getElementById("source-language-selector")?.value || "auto";
    const targetLang = document.getElementById("target-language-selector")?.value || "it";
    const showSubtitles = document.getElementById("show-subtitles-checkbox")?.checked || false;

    // Salva tutte le impostazioni
    const settings = {
      processingMode,
      groqApiKey: apiKey,
      aiModel,
      sourceLang,
      targetLang,
      showSubtitles,
    };

    console.log("Salvataggio impostazioni:", { ...settings, groqApiKey: apiKey ? "***" : null });
    return updateSettings(settings);
  }

  /**
   * Versione migliorata di createSettingsPanel che include opzioni IA
   */
  function createSettingsPanelEnhanced() {
    console.log("Creazione pannello impostazioni migliorato");

    // Crea il pannello delle impostazioni
    const settingsPanel = document.createElement("div");
    settingsPanel.id = "subtitle-settings-panel";
    settingsPanel.style.cssText = `
    display: none;
    position: absolute;
    top: 40px;
    left: 0;
    background-color: #212121;
    padding: 16px;
    border-radius: 8px;
    margin-top: 5px;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    width: 300px;
    color: white;
    font-family: Roboto, Arial, sans-serif;
  `;

    // Crea il contenuto del pannello
    const panelContent = `
    <div style="border-bottom: 1px solid #3a3a3a; padding-bottom: 12px; margin-bottom: 12px;">
      <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px; color: #fff;">
        Impostazioni sottotitoli
      </div>
    </div>

    <!-- Sezione Traduzione -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #ddd;">
        Traduzione
      </div>

      <div style="margin-bottom: 12px;">
       <label for="source-language-selector" id="source-language-label" style="display: block; margin-bottom: 4px; font-size: 13px; color: #aaa;">
          Lingua originale <span id="detected-language-display" style="font-size: 12px; color: #ffab40;"></span>
       </label>
        <select id="source-language-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
          <option value="auto">Rilevamento automatico</option>
          <option value="en">Inglese</option>
          <option value="it">Italiano</option>
          <option value="es">Spagnolo</option>
          <option value="fr">Francese</option>
          <option value="de">Tedesco</option>
          <option value="zh">Cinese</option>
          <option value="ja">Giapponese</option>
          <option value="ko">Coreano</option>
          <option value="ru">Russo</option>
          <option value="ar">Arabo</option>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label for="target-language-selector" style="display: block; margin-bottom: 4px; font-size: 13px; color: #aaa;">
          Traduci in
        </label>
        <select id="target-language-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
          <option value="off">Nessuna traduzione</option>
          <option value="it">Italiano</option>
          <option value="en">Inglese</option>
          <option value="es">Spagnolo</option>
          <option value="fr">Francese</option>
          <option value="de">Tedesco</option>
          <option value="zh">Cinese</option>
          <option value="ja">Giapponese</option>
          <option value="ko">Coreano</option>
          <option value="ru">Russo</option>
          <option value="ar">Arabo</option>
        </select>
      </div>
    </div>

    <!-- Sezione Visualizzazione -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #ddd;">
        Visualizzazione
      </div>

      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <input type="checkbox" id="show-subtitles-checkbox" style="margin-right: 8px;">
        <label for="show-subtitles-checkbox" style="font-size: 13px; color: #bbb;">
          Mostra sottotitoli tradotti
        </label>
      </div>

      <!-- NUOVA OPZIONE: Elaborazione AI -->
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <input type="checkbox" id="use-ai-checkbox" style="margin-right: 8px;">
        <label for="use-ai-checkbox" style="font-size: 13px; color: #bbb;">
          Usa AI per migliorare sottotitoli
        </label>
      </div>
    </div>

    <!-- Sezione Modalità -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #ddd;">
        Modalità di elaborazione
      </div>
      <div style="margin-bottom: 12px;">
        <select id="processing-mode-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
          <option value="normal">Normale (base)</option>
          <option value="ai">AI - elaborazione avanzata</option>
        </select>
      </div>

      <div id="ai-settings" style="margin-bottom: 12px; display: none;">
        <label for="api-key-input" style="display: block; margin-bottom: 4px; font-size: 13px; color: #aaa;">
          API key Groq
        </label>
        <div style="display: flex;">
          <input type="password" id="api-key-input" placeholder="Inserisci API key" style="flex-grow: 1; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px 0 0 4px; font-size: 13px;">
          <button id="test-api-key" style="padding: 8px 12px; background-color: #3ea6ff; color: #0f0f0f; border: none; border-radius: 0 4px 4px 0; font-size: 13px; cursor: pointer;">Test</button>
        </div>
        <div id="api-key-status" style="margin-top: 4px; font-size: 12px; display: none;"></div>

        <div style="display: flex; align-items: center; margin-top: 4px;">
          <input type="checkbox" id="show-api-key" style="margin-right: 8px;">
          <label for="show-api-key" style="font-size: 12px; color: #aaa;">Mostra API key</label>
        </div>

        <label for="ai-model-selector" style="display: block; margin-top: 12px; margin-bottom: 4px; font-size: 13px; color: #aaa;">
          Modello AI
        </label>
        <!-- MODIFICATO: Non aggiungiamo più opzioni statiche qui, ma creiamo un select vuoto
             che verrà popolato dinamicamente dalla funzione updateAIModelSelector() -->
        <select id="ai-model-selector" style="width: 100%; padding: 8px; background-color: #383838; color: white; border: 1px solid #555; border-radius: 4px; font-size: 13px;">
        </select>
      </div>
    </div>

    <!-- Footer con link e info -->
    <div style="border-top: 1px solid #3a3a3a; padding-top: 12px; font-size: 11px; color: #888; text-align: center;">
      YouTube Subtitle Reader v0.7
    </div>
  `;

    settingsPanel.innerHTML = panelContent;

    // Previeni la chiusura del pannello quando si fa clic all'interno
    settingsPanel.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    // Aggiungi eventi dopo che il pannello è stato inserito nel DOM
    setTimeout(() => {
      // Eventi per la modalità AI
      const processingModeSelector = document.getElementById("processing-mode-selector");
      const aiSettings = document.getElementById("ai-settings");
      const useAiCheckbox = document.getElementById("use-ai-checkbox");
      const showApiKeyCheckbox = document.getElementById("show-api-key");
      const apiKeyInput = document.getElementById("api-key-input");

      if (processingModeSelector && aiSettings) {
        processingModeSelector.addEventListener("change", function () {
          aiSettings.style.display = this.value === "ai" ? "block" : "none";

          // Sincronizza il checkbox con il selettore
          if (useAiCheckbox) {
            useAiCheckbox.checked = this.value === "ai";
          }

          // Salva le impostazioni
          saveSettings();
        });
      }

      // Sincronizza il checkbox con il selettore della modalità
      if (useAiCheckbox && processingModeSelector) {
        useAiCheckbox.addEventListener("change", function () {
          processingModeSelector.value = this.checked ? "ai" : "normal";
          if (aiSettings) {
            aiSettings.style.display = this.checked ? "block" : "none";
          }

          // Salva le impostazioni
          saveSettings();
        });
      }

      if (showApiKeyCheckbox && apiKeyInput) {
        showApiKeyCheckbox.addEventListener("change", function () {
          apiKeyInput.type = this.checked ? "text" : "password";
        });
      }

      // Test API key
      const testApiKeyButton = document.getElementById("test-api-key");
      const apiKeyStatus = document.getElementById("api-key-status");

      if (testApiKeyButton && apiKeyInput && apiKeyStatus) {
        testApiKeyButton.addEventListener("click", async function () {
          // Mostra indicatore di caricamento
          testApiKeyButton.disabled = true;
          testApiKeyButton.textContent = "...";
          apiKeyStatus.style.display = "block";
          apiKeyStatus.textContent = "Verifica in corso...";
          apiKeyStatus.style.color = "#ffab40";

          // Testa la chiave API
          const isValid = await testGroqApiKey(apiKeyInput.value);

          // Aggiorna UI in base al risultato
          testApiKeyButton.disabled = false;
          testApiKeyButton.textContent = "Test";

          if (isValid) {
            apiKeyStatus.textContent = "API key valida!";
            apiKeyStatus.style.color = "#4caf50";

            // Salva la chiave verificata
            saveSettings();
          } else {
            apiKeyStatus.textContent = "API key non valida o errore di connessione";
            apiKeyStatus.style.color = "#ff5252";
          }
        });
      }

      // NUOVO: Aggiorna il selettore dei modelli AI con le opzioni disponibili
      updateAIModelSelector();

      // Carica impostazioni salvate
      loadSavedSettings();
    }, 100);

    return settingsPanel;
  }

  async function loadSavedSettings() {
    console.log("Caricamento impostazioni salvate...");

    try {
      // Recupera le impostazioni salvate
      const settings = await getSettings(["processingMode", "groqApiKey", "aiModel" /* altri valori */]);

      // Verifica che il modello salvato sia ancora disponibile
      if (settings.aiModel) {
        settings.aiModel = findAvailableModel(settings.aiModel);
      }

      // ... resto della funzione per aggiornare l'UI con le impostazioni ...
    } catch (error) {
      console.error("Errore durante il caricamento delle impostazioni:", error);
    }
  }

  /**
   * Salva le impostazioni correnti
   */
  function saveSettings() {
    const processingMode = document.getElementById("processing-mode-selector")?.value || "normal";
    const apiKey = document.getElementById("api-key-input")?.value || "";
    const aiModel = document.getElementById("ai-model-selector")?.value || "llama-3.1-8b-instant";
    const useAI = document.getElementById("use-ai-checkbox")?.checked || false;

    // Ottieni anche altre impostazioni dalla UI
    const sourceLang = document.getElementById("source-language-selector")?.value || "auto";
    const targetLang = document.getElementById("target-language-selector")?.value || "it";
    const showSubtitles = document.getElementById("show-subtitles-checkbox")?.checked || false;

    // Salva tutte le impostazioni
    const settings = {
      processingMode,
      groqApiKey: apiKey,
      aiModel,
      useAI,
      sourceLang,
      targetLang,
      showSubtitles,
    };

    console.log("Salvataggio impostazioni:", {
      ...settings,
      groqApiKey: apiKey ? "***" : null,
    });

    return updateSettings(settings);
  }

  //#endregion FUNZIONE 1: Aggiunta del pulsante e pannello impostazioni

  //#region FUNZIONE 2: Gestione pressione pulsante

  // Gestione pressione pulsante
  /**
   * Versione aggiornata di buttonPress che supporta l'elaborazione con AI
   */
  function buttonPressEnhanced() {
    console.log("Funzione buttonPress migliorata eseguita");

    // Toggle dello stato di lettura
    isReadingActive = !isReadingActive;

    // Aggiorna l'aspetto del pulsante
    updateButtonState(isReadingActive);

    if (isReadingActive) {
      // Ottieni l'elemento video
      const videoElement = document.querySelector("video");

      // Metti in pausa il video durante l'inizializzazione
      if (videoElement) {
        videoElement.pause();
      }

      // Verifica se stiamo usando la modalità AI e se la chiave API è valida
      checkAIMode()
        .then((aiSettings) => {
          console.log("Verifica modalità AI completata:", { useAI: aiSettings.useAI });

          // Continua con il flusso normale di inizializzazione
          return initSpeechSynthesis().then(() => {
            return { useAI: aiSettings.useAI };
          });
        })
        .then(function (settings) {
          // Se è la prima volta, ottieni i sottotitoli
          if (capturedSubtitleEntries.length === 0) {
            const videoID = getVideoID();
            if (videoID) {
              // Usa la versione migliorata se l'AI è abilitata
              const captureFunction = settings.useAI ? captureSubtitlesEnhanced : captureSubtitles;

              captureFunction(videoID, { useAI: settings.useAI })
                .then(function (subtitles) {
                  console.log(`Sottotitoli ottenuti: ${subtitles.length}`);

                  // Processa i sottotitoli per unirli dove appropriato
                  // Se sono già stati elaborati con AI, possiamo saltare questo passaggio
                  capturedSubtitleEntries = subtitles[0]?.isImproved ? subtitles : mergeSubtitles(subtitles);

                  console.log(`Sottotitoli elaborati: ${capturedSubtitleEntries.length}`);

                  // Mostra anteprima dei sottotitoli
                  showSubtitles(capturedSubtitleEntries);

                  // MODIFICA QUI: Prima potenzia le funzioni, poi avvia il monitoraggio
                  enhanceMonitorVideoPlayback(); // Potenzia le funzioni di lettura e monitoraggio
                  monitorVideoPlayback(); // Poi avvia il monitoraggio standard

                  // Avvia sempre il video quando tutto è pronto
                  if (videoElement) {
                    videoElement.play().catch((e) => console.error("Errore ripresa video:", e));
                  }
                })
                .catch(function (error) {
                  console.error("Errore:", error);
                  alert("Errore nel recupero dei sottotitoli: " + error.message);

                  // Ripristina lo stato
                  isReadingActive = false;
                  updateButtonState(false);
                });
            } else {
              alert("Impossibile ottenere l'ID del video.");

              // Ripristina lo stato
              isReadingActive = false;
              updateButtonState(false);
            }
          } else {
            // MODIFICA QUI: Prima potenzia le funzioni, poi avvia il monitoraggio
            enhanceMonitorVideoPlayback(); // Potenzia le funzioni di lettura e monitoraggio
            // Se i sottotitoli sono già caricati, inizia solo il monitoraggio
            monitorVideoPlayback();

            // Avvia sempre il video quando tutto è pronto
            if (videoElement) {
              videoElement.play().catch((e) => console.error("Errore ripresa video:", e));
            }
          }
        })
        .catch(function (error) {
          console.error("Errore di inizializzazione:", error);
          alert("Errore nell'inizializzazione: " + error.message);

          // Ripristina lo stato
          isReadingActive = false;
          updateButtonState(false);
        });
    } else {
      // Interrompi la sintesi vocale
      speechSynth.cancel();
    }

    //Test group subtitle
    console.log("testGroupSubtitle");
    if (capturedSubtitleEntries.length > 0) {
      testGroupTranslation();
    }
  }

  async function checkAIMode() {
    try {
      // Recupera le impostazioni salvate
      const settings = await getSettings(["processingMode", "groqApiKey", "aiModel"]);

      // Verifica esplicita: usa AI solo se il processing mode è "ai"
      if (settings.processingMode !== "ai") {
        console.log("Modalità normale selezionata, AI non verrà utilizzata");
        return { useAI: false };
      }

      // Verifica che il modello salvato sia ancora disponibile
      if (settings.aiModel) {
        const availableModel = findAvailableModel(settings.aiModel);
        if (availableModel !== settings.aiModel) {
          await updateSettings({ aiModel: availableModel });
          settings.aiModel = availableModel;
        }
      }

      // Verifica della chiave API
      if (!settings.groqApiKey) {
        console.warn("Chiave API Groq mancante");
        alert("La chiave API Groq è mancante. Verrà utilizzata la modalità normale.");
        await updateSettings({ processingMode: "normal" });
        return { useAI: false };
      }

      // Verifica validità chiave
      const isApiKeyValid = await testGroqApiKey(settings.groqApiKey);
      if (!isApiKeyValid) {
        console.warn("Chiave API Groq non valida");
        alert("La chiave API Groq non è valida. Verrà utilizzata la modalità normale.");
        await updateSettings({ processingMode: "normal" });
        return { useAI: false };
      }

      // Tutto ok, usa AI
      console.log("Chiave API Groq valida, utilizzando modalità AI");
      return {
        useAI: true,
        apiKey: settings.groqApiKey,
        model: settings.aiModel || findAvailableModel("llama-3.1-8b-instant"),
      };
    } catch (error) {
      console.error("Errore durante la verifica della modalità AI:", error);
      return { useAI: false };
    }
  }

  //#endregion FUNZIONE 2: Gestione pressione pulsante

  //#region FUNZIONE 3: Cattura dei sottotitoli
  function captureSubtitles(videoID) {
    return new Promise((resolve, reject) => {
      showSpinner();

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.youtube.com/watch?v=${videoID}`,
        onload: function (response) {
          try {
            console.log("Analisi della pagina del video...");

            // Cerca i dati dei sottotitoli nella risposta
            const match = response.responseText.match(/"captionTracks":(\[.*?\])/);

            if (match) {
              console.log("captionTracks trovati:", match[1]);
              const captions = JSON.parse(match[1]);

              if (captions && captions.length > 0) {
                // Mostra informazioni sui sottotitoli disponibili
                let captionsInfo = "Sottotitoli disponibili:\n";
                captions.forEach((caption, index) => {
                  captionsInfo += `${index + 1}. ${(caption.name && caption.name.simpleText) || "Unnamed"} (${caption.languageCode})\n`;
                });
                console.log(captionsInfo);

                // Prendi il primo set di sottotitoli disponibili
                const captionUrl = captions[0].baseUrl.replace(/\\u0026/g, "&");
                console.log("URL sottotitoli:", captionUrl);

                // Carica i sottotitoli
                GM_xmlhttpRequest({
                  method: "GET",
                  url: captionUrl,
                  onload: function (subResponse) {
                    capturedSubtitles = subResponse.responseText;
                    console.log("Risposta sottotitoli ricevuta, lunghezza:", capturedSubtitles.length);

                    const subtitleEntries = extractSubtitles(capturedSubtitles);
                    hideSpinner();

                    if (subtitleEntries.length > 0) {
                      resolve(subtitleEntries);
                    } else {
                      reject(new Error("Sottotitoli trovati, ma in formato non riconosciuto"));
                    }
                  },
                  onerror: function (error) {
                    console.error("Errore nella richiesta sottotitoli:", error);
                    hideSpinner();
                    reject(new Error("Errore nel recupero dei sottotitoli"));
                  },
                });
              } else {
                hideSpinner();
                reject(new Error("Nessun sottotitolo trovato per questo video"));
              }
            } else {
              // Tentativo alternativo di trovare i sottotitoli
              const playerResponseMatch = response.responseText.match(/"playerResponse":(.*?),"adPlacement"/);
              if (playerResponseMatch) {
                try {
                  console.log("Tentativo alternativo usando playerResponse...");
                  const playerResponse = JSON.parse(playerResponseMatch[1]);

                  if (
                    playerResponse.captions &&
                    playerResponse.captions.playerCaptionsTracklistRenderer &&
                    playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks
                  ) {
                    const captionTracks = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
                    if (captionTracks.length > 0) {
                      const captionUrl = captionTracks[0].baseUrl.replace(/\\u0026/g, "&");
                      console.log("URL sottotitoli (metodo alternativo):", captionUrl);

                      GM_xmlhttpRequest({
                        method: "GET",
                        url: captionUrl,
                        onload: function (subResponse) {
                          capturedSubtitles = subResponse.responseText;
                          console.log("Risposta sottotitoli ricevuta, lunghezza:", capturedSubtitles.length);

                          const subtitleEntries = extractSubtitles(capturedSubtitles);
                          hideSpinner();

                          if (subtitleEntries.length > 0) {
                            resolve(subtitleEntries);
                          } else {
                            reject(new Error("Sottotitoli trovati con metodo alternativo, ma in formato non riconosciuto"));
                          }
                        },
                        onerror: function (error) {
                          console.error("Errore nella richiesta sottotitoli (metodo alternativo):", error);
                          hideSpinner();
                          reject(new Error("Errore nel recupero dei sottotitoli"));
                        },
                      });
                      return;
                    }
                  }
                } catch (e) {
                  console.error("Errore nel metodo alternativo:", e);
                }
              }

              hideSpinner();
              reject(new Error("Nessun sottotitolo trovato. Il video potrebbe non avere sottotitoli disponibili."));
            }
          } catch (e) {
            console.error("Errore durante il parsing dei sottotitoli:", e);
            hideSpinner();
            reject(new Error("Errore durante il recupero dei sottotitoli: " + e.message));
          }
        },
        onerror: function (error) {
          console.error("Errore nella richiesta HTTP:", error);
          hideSpinner();
          reject(new Error("Errore di rete durante il recupero dei sottotitoli"));
        },
      });
    });
  }

  // Funzione per estrarre i sottotitoli da vari formati
  function extractSubtitles(responseText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseText, "text/xml");

    // Log dettagliato per debug
    console.log("Risposta XML ricevuta:", responseText.substring(0, 500) + "...");
    console.log("Documento XML analizzato:", xmlDoc);

    let subtitleEntries = [];

    // Formato 1: <transcript><text start="...">...</text></transcript>
    const transcriptTexts = xmlDoc.querySelectorAll("transcript > text");
    if (transcriptTexts && transcriptTexts.length > 0) {
      console.log("Formato sottotitoli trovato: transcript > text");

      transcriptTexts.forEach((node) => {
        const start = parseFloat(node.getAttribute("start") || "0");
        const text = node.textContent || "";
        if (text.trim()) {
          subtitleEntries.push({
            start,
            text: decodeHtmlEntities(text),
          });
        }
      });
    }

    // Formato 2: <body><p t="..." d="...">...</p></body>
    const bodyTexts = xmlDoc.querySelectorAll("body > p");
    if (bodyTexts && bodyTexts.length > 0) {
      console.log("Formato sottotitoli trovato: body > p");

      bodyTexts.forEach((node) => {
        const start = parseFloat(node.getAttribute("t") || "0") / 1000;
        const duration = parseFloat(node.getAttribute("d") || "0") / 1000;
        const text = node.textContent || "";
        if (text.trim()) {
          subtitleEntries.push({
            start,
            text: decodeHtmlEntities(text),
          });
        }
      });
    }

    // Formato 3: Testo JSON in una stringa XML
    if (subtitleEntries.length === 0) {
      try {
        const jsonMatch = responseText.match(/\{.*\}/);
        if (jsonMatch) {
          console.log("Tentativo di analizzare come JSON");
          const jsonData = JSON.parse(jsonMatch[0]);

          // Prova vari formati JSON
          if (jsonData.events) {
            console.log("Formato JSON trovato: events");
            jsonData.events.forEach((event) => {
              if (event.segs && event.segs.length > 0) {
                let text = "";
                event.segs.forEach((seg) => {
                  if (seg.utf8) text += seg.utf8;
                });

                if (text.trim()) {
                  subtitleEntries.push({
                    start: (event.tStartMs || 0) / 1000,
                    text: decodeHtmlEntities(text),
                  });
                }
              }
            });
          }
        }
      } catch (e) {
        console.error("Errore nel parsing JSON:", e);
      }
    }

    // Se non è stato trovato nessun formato noto, prova a estrarre tutto il testo
    if (subtitleEntries.length === 0) {
      console.log("Nessun formato standard riconosciuto, estraggo tutto il testo");
      const allText = responseText
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (allText) {
        console.log("Contenuto non strutturato trovato:", allText.substring(0, 300) + "...");
      }
    }

    return subtitleEntries;
  }

  //#region AGGIORNAMENTI ALLA FUNZIONE DI CATTURA SOTTOTITOLI

  /**
   * Versione migliorata di captureSubtitles che supporta l'elaborazione con AI
   * @param {string} videoID - ID del video di YouTube
   * @param {Object} options - Opzioni di elaborazione
   * @returns {Promise<Array>} - Promise che si risolve in un array di oggetti sottotitolo
   */
  function captureSubtitlesEnhanced(videoID, options = {}) {
    console.log("Avvio cattura sottotitoli avanzata con opzioni:", options);

    return new Promise((resolve, reject) => {
      showSpinner();

      // Prima ottieni i sottotitoli normalmente
      captureSubtitles(videoID)
        .then(async function (originalSubtitles) {
          console.log(`Sottotitoli originali ottenuti: ${originalSubtitles.length}`);

          // Se l'elaborazione AI è richiesta e abbiamo sottotitoli validi
          if (options.useAI && originalSubtitles && originalSubtitles.length > 0) {
            console.log("Avvio elaborazione AI dei sottotitoli...");

            try {
              // Recupera le impostazioni salvate
              const settings = await getSettings(["groqApiKey", "aiModel"]);

              if (!settings.groqApiKey) {
                console.warn("API key Groq mancante, utilizzo sottotitoli originali");
                hideSpinner();
                resolve(originalSubtitles);
                return;
              }

              // Processa i sottotitoli con Groq
              const improvedSubtitles = await processSubtitlesWithGroq(originalSubtitles, {
                groqApiKey: settings.groqApiKey,
                aiModel: settings.aiModel || "llama-3.1-8b-instant",
              });

              console.log("Elaborazione AI completata con successo");
              hideSpinner();

              // Mostra un messaggio di successo
              alert(`Sottotitoli migliorati con IA: ${originalSubtitles.length} originali → ${improvedSubtitles.length} ottimizzati`);

              resolve(improvedSubtitles);
            } catch (aiError) {
              console.error("Errore durante l'elaborazione AI:", aiError);
              alert("Errore durante l'elaborazione AI: " + aiError.message + "\nUtilizzo sottotitoli originali.");
              hideSpinner();
              resolve(originalSubtitles);
            }
          } else {
            // Se l'AI non è richiesta o non abbiamo sottotitoli, utilizza quelli originali
            console.log("Utilizzo sottotitoli originali (no AI)");
            hideSpinner();
            resolve(originalSubtitles);
          }
        })
        .catch(function (error) {
          console.error("Errore durante il recupero sottotitoli:", error);
          hideSpinner();
          reject(error);
        });
    });
  }

  //#endregion AGGIORNAMENTI ALLA FUNZIONE DI CATTURA SOTTOTITOLI

  //#endregion FUNZIONE 3: Cattura dei sottotitoli

  //#region FUNZIONE 4: Visualizza i sottotitoli

  function showSubtitles(subtitleEntries) {
    if (!subtitleEntries || subtitleEntries.length === 0) {
      alert("Nessun sottotitolo da mostrare.");
      return;
    }

    // Prepara l'anteprima dei primi 10 sottotitoli
    let previewText = "";
    const previewLimit = Math.min(10, subtitleEntries.length);

    for (let i = 0; i < previewLimit; i++) {
      const entry = subtitleEntries[i];
      previewText += `[${formatTime(entry.start)}] ${entry.text}\n`;
    }

    previewText += `\n(Totale ${subtitleEntries.length} righe di sottotitoli)`;

    // Mostra l'anteprima
    alert("Anteprima dei sottotitoli catturati:\n\n" + previewText);
  }

  // Trova il sottotitolo corrispondente alla posizione corrente del video (con anticipazione)
  function findSubtitleAtTime(time, anticipationTime = 1.0) {
    if (!capturedSubtitleEntries || capturedSubtitleEntries.length === 0) {
      return null;
    }

    // Aggiungiamo l'anticipazione per cercare un po' in avanti
    const lookAheadTime = time + anticipationTime;

    // Ricerca lineare del sottotitolo corrente o imminente
    for (let i = 0; i < capturedSubtitleEntries.length; i++) {
      const subtitle = capturedSubtitleEntries[i];
      const nextSubtitle = i < capturedSubtitleEntries.length - 1 ? capturedSubtitleEntries[i + 1] : null;

      const startTime = subtitle.start;
      // Calcola endTime in modo più preciso
      const endTime = nextSubtitle ? nextSubtitle.start : startTime + estimateReadingTime(subtitle.text);

      // Verifica se siamo nel sottotitolo attuale
      if (time >= startTime && time < endTime) {
        return {
          index: i,
          text: subtitle.text,
          startTime: startTime,
          endTime: endTime,
          currentSubtitle: true,
        };
      }

      // Verifica se siamo vicini al prossimo sottotitolo (anticipazione)
      if (time < startTime && lookAheadTime >= startTime) {
        return {
          index: i,
          text: subtitle.text,
          startTime: startTime,
          endTime: endTime,
          currentSubtitle: false,
        };
      }
    }

    // Se siamo oltre l'ultimo sottotitolo
    if (time >= capturedSubtitleEntries[capturedSubtitleEntries.length - 1].start) {
      const lastIndex = capturedSubtitleEntries.length - 1;
      const lastSubtitle = capturedSubtitleEntries[lastIndex];
      const estimatedDuration = estimateReadingTime(lastSubtitle.text);

      return {
        index: lastIndex,
        text: lastSubtitle.text,
        startTime: lastSubtitle.start,
        endTime: lastSubtitle.start + estimatedDuration,
        currentSubtitle: true,
      };
    }

    return null;
  }

  //#endregion FUNZIONE 4: Visualizza i sottotitoli

  //#region FUNZIONE 5: editing e raggruppamento sottotitoli

  /**
   * Unisce sottotitoli consecutivi in modo più aggressivo e intelligente per migliorare
   * la qualità della traduzione e della lettura vocale.
   *
   * @param {Array} subtitles - Array di oggetti sottotitolo con proprietà start e text
   * @param {Number} maxTimeDiff - Differenza massima di tempo tra sottotitoli da unire (in secondi)
   * @param {Number} maxMergedLength - Lunghezza massima di una frase unita (default: 300 caratteri)
   * @return {Array} - Array di sottotitoli uniti
   */
  function enhancedMergeSubtitles(subtitles, maxTimeDiff = 0.5, maxMergedLength = 150) {
    if (!subtitles || subtitles.length <= 1) return subtitles;

    const mergedSubtitles = [];
    let currentGroup = {
      start: subtitles[0].start,
      text: subtitles[0].text,
      isGroup: false,
      originalIndices: [0], // Mantiene traccia degli indici originali uniti in questo gruppo
    };

    // Funzione migliorata per determinare se due sottotitoli possono essere uniti
    function canMerge(currentText, nextText, timeDiff) {
      // Unisce automaticamente se il sottotitolo corrente termina con puntini di sospensione
      if (currentText.trim().endsWith("...")) return true;

      // Unisce automaticamente se il sottotitolo successivo inizia con minuscola o è chiaramente una continuazione
      if (/^[a-z,;:]/.test(nextText) || /^\s*[andbutorbecausesothenthus]/.test(nextText.toLowerCase())) return true;

      // Controllo della punteggiatura finale - non unire periodi con punteggiatura forte
      // a meno che non sia una frase breve (può essere un'abbreviazione)
      const hasStrongPunctuation = /[.!?]\s*$/.test(currentText);
      const isShortPhrase = currentText.length < 30;

      // Controllo della lunghezza totale per evitare frasi troppo lunghe
      const combinedLength = currentText.length + nextText.length;
      const isReasonableLength = combinedLength <= maxMergedLength;

      return timeDiff <= maxTimeDiff && (!hasStrongPunctuation || isShortPhrase) && isReasonableLength;
    }

    // Funzione migliorata per determinare il miglior connettore tra frasi
    function getConnector(currentText, nextText) {
      // Rimuove i puntini di sospensione alla fine se il prossimo sottotitolo è una continuazione
      if (currentText.trim().endsWith("...")) {
        return currentText.replace(/\.\.\.\s*$/, " ");
      }

      // Se termina con punteggiatura diversa dal punto, mantieni solo uno spazio
      if (/[,;:][\s"']*$/.test(currentText)) {
        return " ";
      }

      // Se termina con punto ma la frase è breve, sostituisci con una virgola
      if (/[.][\s"']*$/.test(currentText) && currentText.length < 30) {
        return currentText.replace(/[.][\s"']*$/, ", ");
      }

      // Se c'è già uno spazio alla fine, non aggiungerne un altro
      if (/\s+$/.test(currentText)) {
        return "";
      }

      // Se la seconda frase inizia con minuscola, probabilmente è una continuazione
      if (/^[a-z]/.test(nextText)) {
        return " ";
      }

      // Altrimenti usa una virgola come separatore per default
      return ", ";
    }

    // Funzione per pulire e normalizzare il testo dei sottotitoli
    function cleanSubtitleText(text) {
      return (
        text
          // Rimuove timestamp e marcatori tecnici comuni nei sottotitoli
          .replace(/\[\d{2}:\d{2}:\d{2}\]/g, "")
          .replace(/\(\d{2}:\d{2}\)/g, "")
          // Normalizza spazi
          .replace(/\s+/g, " ")
          // Normalizza punteggiatura
          .replace(/\s+([.,;:!?])/g, "$1")
          // Rimuove parentesi vuote
          .replace(/\(\s*\)/g, "")
          // Rimuove tag HTML semplici che possono essere presenti nei sottotitoli
          .replace(/<[^>]*>/g, "")
          .trim()
      );
    }

    for (let i = 1; i < subtitles.length; i++) {
      const currentSub = subtitles[i];
      const prevSub = subtitles[i - 1];

      // Calcola la differenza temporale
      const timeDiff = currentSub.start - prevSub.start;

      if (canMerge(currentGroup.text, currentSub.text, timeDiff)) {
        // Pulisci il testo prima di unirlo
        const cleanedText = cleanSubtitleText(currentSub.text);

        // Determina il connettore appropriato
        let connector = getConnector(currentGroup.text, cleanedText);

        // Gestione speciale per i puntini di sospensione
        if (currentGroup.text.trim().endsWith("...") && connector === " ") {
          currentGroup.text = currentGroup.text.replace(/\.\.\.\s*$/, "... ");
        } else if (connector.includes(",")) {
          // Se abbiamo sostituito un punto con una virgola
          currentGroup.text = currentGroup.text.replace(/[.][\s"']*$/, "") + connector + cleanedText;
        } else {
          currentGroup.text += connector + cleanedText;
        }

        currentGroup.isGroup = true;
        currentGroup.originalIndices.push(i);
      } else {
        // Pulisci il testo prima di salvarlo
        currentGroup.text = cleanSubtitleText(currentGroup.text);

        // Salva il gruppo corrente e iniziane uno nuovo
        mergedSubtitles.push(currentGroup);
        currentGroup = {
          start: currentSub.start,
          text: cleanSubtitleText(currentSub.text),
          isGroup: false,
          originalIndices: [i],
        };
      }
    }

    // Aggiungi l'ultimo gruppo
    currentGroup.text = cleanSubtitleText(currentGroup.text);
    mergedSubtitles.push(currentGroup);

    console.log(
      `Unione sottotitoli potenziata: da ${subtitles.length} a ${mergedSubtitles.length} elementi (riduzione del ${Math.round(
        (1 - mergedSubtitles.length / subtitles.length) * 100
      )}%)`
    );

    return mergedSubtitles;
  }

  /**
   * Versione alternativa che considera anche il contenuto semantico
   * per decidere quali sottotitoli unire. Richiede più risorse computazionali.
   *
   * @param {Array} subtitles - Array di oggetti sottotitolo
   * @param {Number} maxTimeDiff - Differenza massima di tempo tra sottotitoli
   * @param {Boolean} aggressive - Se true, unisce in modo più aggressivo
   * @return {Array} - Array di sottotitoli uniti
   */
  function semanticMergeSubtitles(subtitles, maxTimeDiff = 0.8, aggressive = true) {
    // Prima applica la fusione basata sul tempo
    let mergedByTime = enhancedMergeSubtitles(subtitles, maxTimeDiff);

    if (!aggressive || mergedByTime.length <= 1) return mergedByTime;

    // Ora applichiamo una fusione semantica per passaggi contigui
    const finalMerged = [];
    let currentGroup = mergedByTime[0];

    // Parole di transizione che indicano continuazione semantica
    const continueWords = [
      "therefore",
      "thus",
      "hence",
      "consequently",
      "so",
      "accordingly",
      "as a result",
      "for this reason",
      "because",
      "since",
      "due to",
      "moreover",
      "furthermore",
      "in addition",
      "additionally",
      "also",
      "similarly",
      "likewise",
      "in the same way",
      "equally",
      "indeed",
    ];

    // Regex per rilevare se un testo inizia con una parola di transizione
    const continuePattern = new RegExp(`^(${continueWords.join("|")})\\b`, "i");

    for (let i = 1; i < mergedByTime.length; i++) {
      const nextGroup = mergedByTime[i];

      // Controlla se il prossimo gruppo inizia con una parola di transizione
      const isContinuation = continuePattern.test(nextGroup.text.trim());

      // Controlla se c'è continuità del soggetto (euristica semplice)
      const lastSentence = currentGroup.text.split(/[.!?]\s+/).pop() || "";
      const nextText = nextGroup.text;

      // Estrae potenziali soggetti (prima parola di ogni frase, o pronomi)
      const lastWords = lastSentence.split(/\s+/).slice(0, 3);
      const nextWords = nextText.split(/\s+/).slice(0, 5);

      // Verifica se c'è almeno una parola condivisa (possibile riferimento allo stesso soggetto)
      const hasCommonSubject = lastWords.some((word) => nextWords.includes(word) && word.length > 3);

      if (isContinuation || hasCommonSubject) {
        // Unisci i due gruppi
        currentGroup.text += `. ${nextGroup.text}`;
        currentGroup.isGroup = true;
        currentGroup.originalIndices = currentGroup.originalIndices.concat(nextGroup.originalIndices);
      } else {
        finalMerged.push(currentGroup);
        currentGroup = nextGroup;
      }
    }

    // Aggiungi l'ultimo gruppo
    finalMerged.push(currentGroup);

    console.log(
      `Unione semantica: da ${mergedByTime.length} a ${finalMerged.length} elementi (riduzione ulteriore del ${Math.round(
        (1 - finalMerged.length / mergedByTime.length) * 100
      )}%)`
    );

    return finalMerged;
  }

  /**
   * Funzione di supporto per stimare il tempo di lettura di un testo
   * Utile per assegnare durate a sottotitoli uniti
   *
   * @param {String} text - Testo di cui stimare il tempo di lettura
   * @param {Number} wordsPerMinute - Parole al minuto (default 150)
   * @return {Number} - Tempo stimato in secondi
   */

  function estimateReadingTime(text) {
    // Media delle parole al minuto per una lettura normale (italiano)
    const wordsPerMinute = 180;

    // Stima il numero di parole (approssimativo)
    const wordCount = text.split(/\s+/).length;

    // Calcola il tempo stimato in secondi
    const estimatedSeconds = (wordCount / wordsPerMinute) * 60;

    // Aggiungi un piccolo buffer per la sintesi vocale
    return estimatedSeconds + 0.3; // +300ms di buffer
  }

  /**
   * Versione finale raccomandata che integra entrambi gli approcci
   * e include ulteriori miglioramenti per ottimizzare la qualità
   * dei sottotitoli sia per la traduzione che per la lettura vocale.
   *
   * @param {Array} subtitles - Array di oggetti sottotitolo
   * @param {Object} options - Opzioni di configurazione
   * @return {Array} - Array di sottotitoli ottimizzati
   */
  function optimizeSubtitles(subtitles, options = {}) {
    const defaults = {
      maxTimeDiff: 0.8, // Differenza temporale massima in secondi
      maxGroupLength: 200, // Lunghezza massima di un gruppo in caratteri
      useSemanticMerge: true, // Utilizzare la fusione semantica
      aggressive: true, // Modalità di unione aggressiva
      cleanupText: true, // Pulire il testo da artefatti
      removeSpeakerLabels: true, // Rimuovere etichette del tipo "[Narrator]:"
      normalizeSpaces: true, // Normalizzare gli spazi
      autoFixPunctuation: true, // Correggere automaticamente la punteggiatura
      logStatistics: true, // Mostrare statistiche nel log della console
    };

    // Unisci le opzioni passate con i valori di default
    const settings = { ...defaults, ...options };

    if (!subtitles || subtitles.length === 0) return [];

    let result = [...subtitles];
    const originalCount = result.length;

    // Fase 1: pulizia del testo se richiesta
    if (settings.cleanupText) {
      result = result.map((sub) => {
        let cleanText = sub.text;

        // Rimuovi etichette dei parlanti (es. "[John]:", "Speaker A:", ecc.)
        if (settings.removeSpeakerLabels) {
          cleanText = cleanText.replace(/^\s*\[[\w\s]+\]:\s*/g, "");
          cleanText = cleanText.replace(/^\s*[\w\s]+:\s*/g, "");
        }

        // Normalizza gli spazi
        if (settings.normalizeSpaces) {
          cleanText = cleanText.replace(/\s+/g, " ").trim();
        }

        // Correggi punteggiatura comune
        if (settings.autoFixPunctuation) {
          cleanText = cleanText
            .replace(/\s+([.,;:!?])/g, "$1") // Spazi prima della punteggiatura
            .replace(/([.,;:!?])(?=[a-zA-Z])/g, "$1 ") // Mancanza di spazi dopo punteggiatura
            .replace(/\.{4,}/g, "...") // Normalizza puntini di sospensione
            .replace(/\(\s*\)/g, ""); // Parentesi vuote
        }

        return {
          ...sub,
          text: cleanText,
        };
      });
    }

    // Fase 2: unione basata sul tempo e sulle regole linguistiche
    result = enhancedMergeSubtitles(result, settings.maxTimeDiff, settings.maxGroupLength);
    const timeBasedCount = result.length;

    // Fase 3: unione semantica se abilitata
    if (settings.useSemanticMerge) {
      result = semanticMergeSubtitles(result, settings.maxTimeDiff, settings.aggressive);
    }

    // Mostra statistiche se richiesto
    if (settings.logStatistics) {
      const timeBasedReduction = Math.round((1 - timeBasedCount / originalCount) * 100);
      const finalReduction = Math.round((1 - result.length / originalCount) * 100);

      console.log(`
      Statistiche ottimizzazione sottotitoli:
      - Sottotitoli originali: ${originalCount}
      - Dopo unione temporale: ${timeBasedCount} (${timeBasedReduction}% di riduzione)
      - Risultato finale: ${result.length} (${finalReduction}% di riduzione totale)
    `);
    }

    return result;
  }

  // Esporta la versione raccomandata come funzione principale
  // mantenendo le precedenti per compatibilità
  function mergeSubtitles(subtitles, maxTimeDiff = 1.2) {
    if (!subtitles || subtitles.length <= 1) return subtitles;

    const result = [];
    let currentGroup = {
      start: subtitles[0].start,
      text: subtitles[0].text,
      isGroup: false,
    };

    // Parametri ottimizzati per l'equilibrio
    const OPTIMAL_LENGTH = 100; // Lunghezza ottimale per un sottotitolo
    const MAX_MERGED_CHARS = 150; // Limite massimo di sicurezza
    const MAX_SUBTITLES_PER_GROUP = 5; // Massimo numero di sottotitoli per gruppo
    let subtitlesInCurrentGroup = 1;

    for (let i = 1; i < subtitles.length; i++) {
      const current = subtitles[i];
      const prev = subtitles[i - 1];
      const timeDiff = current.start - prev.start;
      const combinedLength = currentGroup.text.length + current.text.length;

      // Condizioni per l'unione:
      // 1. Non superare la dimensione massima di sicurezza
      // 2. Non unire troppi sottotitoli
      // 3. Cercare di raggiungere una lunghezza ottimale
      // 4. Se i sottotitoli sono vicini nel tempo, favorire l'unione
      const belowMaxSize = combinedLength < MAX_MERGED_CHARS;
      const belowMaxCount = subtitlesInCurrentGroup < MAX_SUBTITLES_PER_GROUP;
      const belowOptimalSize = currentGroup.text.length < OPTIMAL_LENGTH;
      const closeEnoughInTime = timeDiff < maxTimeDiff;

      // Unisci i sottotitoli se sono abbastanza vicini nel tempo
      // e non superano i limiti di sicurezza
      if (belowMaxSize && belowMaxCount && (belowOptimalSize || closeEnoughInTime)) {
        // Aggiunge uno spazio intelligente tra i sottotitoli
        const connector = determineConnector(currentGroup.text, current.text);
        currentGroup.text += connector + current.text;
        currentGroup.isGroup = true;
        subtitlesInCurrentGroup++;
      } else {
        // Finisci il gruppo corrente e iniziane uno nuovo
        result.push(currentGroup);
        currentGroup = {
          start: current.start,
          text: current.text,
          isGroup: false,
        };
        subtitlesInCurrentGroup = 1;
      }
    }

    // Aggiungi l'ultimo gruppo
    result.push(currentGroup);

    const reductionPercentage = Math.round((1 - result.length / subtitles.length) * 100);
    console.log(`Unione sottotitoli equilibrata: da ${subtitles.length} a ${result.length} elementi (riduzione del ${reductionPercentage}%)`);

    return result;
  }

  // Funzione per determinare il miglior connettore tra due sottotitoli
  function determineConnector(text1, text2) {
    // Rimuovi spazi all'inizio e alla fine
    text1 = text1.trim();
    text2 = text2.trim();

    // Se il primo testo termina con punteggiatura, aggiungi uno spazio
    if (/[.!?]$/.test(text1)) {
      return " ";
    }

    // Se il primo testo termina con virgola, punto e virgola, ecc.
    if (/[,;:]$/.test(text1)) {
      return " ";
    }

    // Se il secondo testo inizia con lettera minuscola o congiunzione
    if (/^[a-z]/.test(text2) || /^(e|ed|ma|o|oppure|quindi|però)\b/i.test(text2)) {
      return " ";
    }

    // Altrimenti, aggiungi uno spazio e una virgola
    return ", ";
  }

  // Funzione principale per ottenere i chunk ottimizzati per TTS
  function getChunksForTts(text, options) {
    // Determina se è una lingua dell'est asiatico
    const isEA = /^zh|ko|ja/.test(options.lang);

    // Scegli il punteggiatore appropriato
    const punctuator = isEA ? new EastAsianPunctuator() : new LatinPunctuator();

    // Lingue che richiedono limiti di parole più bassi
    const needsSmallerLimit = /^(de|ru|es|pt|id)/.test(options.lang);

    // Calcola il limite di parole tenendo conto della lingua e della velocità
    const baseWordLimit = needsSmallerLimit ? 32 : 36;
    const adjustedWordLimit = Math.floor(baseWordLimit * (isEA ? 2 : 1) * options.rate);

    // Per Google TTS nativa, usa WordBreaker
    // Per Google Translate, usa CharBreaker con limite ridotto
    // Per altre voci, usa CharBreaker con limite più alto
    if (isGoogleVoice(options.voice)) {
      console.log(`Usando WordBreaker con limite di ${adjustedWordLimit} parole`);
      return new WordBreaker(adjustedWordLimit, punctuator).breakText(text);
    } else if (isGoogleTranslate(options.voice)) {
      console.log("Usando CharBreaker con limite di 200 caratteri (Google Translate)");
      return new CharBreaker(200, punctuator).breakText(text);
    } else {
      console.log("Usando CharBreaker con limite di 750 caratteri");
      return new CharBreaker(750, punctuator, 200).breakText(text);
    }
  }

  // Funzioni di supporto per determinare il tipo di voce
  function isGoogleVoice(voice) {
    return voice && voice.voiceName && /^Google\s/.test(voice.voiceName);
  }

  function isGoogleTranslate(voice) {
    return voice && voice.voiceName && /^GoogleTranslate\s/.test(voice.voiceName);
  }

  /**
   * Determina se un testo è complesso in base a vari fattori
   * @param {string} text - Il testo da analizzare
   * @return {boolean} - True se il testo è considerato complesso
   */
  function isComplexText(text) {
    if (!text) return false;

    // Lunghezza media delle parole
    const words = text.split(/\s+/);
    const avgWordLength = text.length / Math.max(words.length, 1);

    // Presenza di parole lunghe (potenzialmente tecniche)
    const longWords = words.filter((word) => word.length > 8).length;
    const longWordRatio = longWords / Math.max(words.length, 1);

    // Presenza di numeri, formule o termini specialistici
    const hasSpecialTerms = /(\d{2,}|[-+*\/=]|\(\w+\)|\b[A-Z]{2,}\b)/.test(text);

    // Punteggiatura che indica frasi complesse
    const hasComplexPunctuation = /[;:()\[\]–—]/.test(text);

    // Combinazione dei fattori
    const isComplex = avgWordLength > 6 || longWordRatio > 0.2 || hasSpecialTerms || hasComplexPunctuation;

    return isComplex;
  }

  /**
   * Aggiunge marcatori [PAUSE] ai sottotitoli quando c'è una pausa significativa
   * @param {Array} subtitles - Array di oggetti sottotitolo
   * @param {number} minPauseDuration - Durata minima per considerare una pausa (secondi)
   * @returns {Array} - Sottotitoli con marcatori di pausa aggiunti
   */
  function addPauseMarkersToSubtitles(subtitles, minPauseDuration = 2.0) {
    if (!subtitles || subtitles.length <= 1) return subtitles;

    const result = [];

    for (let i = 0; i < subtitles.length; i++) {
      const current = subtitles[i];
      const modified = { ...current };

      // Verifica se c'è una pausa significativa prima del prossimo sottotitolo
      if (i < subtitles.length - 1) {
        const next = subtitles[i + 1];
        const timeDiff = next.start - current.start;
        const estimatedReadingTime = estimateReadingTime(current.text);

        // Se c'è una pausa sostanziale dopo la lettura stimata, aggiunge [PAUSE]
        if (timeDiff > estimatedReadingTime + minPauseDuration) {
          modified.text = modified.text + " [PAUSE]";
        }
      }

      result.push(modified);
    }

    return result;
  }

  //#endregion FUNZIONE 5: editing e raggruppamento sottotitoli

  //#region FUNZIONE 6: Stimare il tempo di lettura

  // Funzione per calcolare la velocità di lettura ottimale in base al tempo disponibile
  /**
   * Funzione per calcolare la velocità di lettura ottimale in base al tempo disponibile.
   * @param {string} text - Il testo da leggere.
   * @param {number} availableTime - Il tempo totale (in secondi) disponibile per leggere il sottotitolo.
   * @param {number} [baseRate=1.0] - La velocità di lettura considerata "normale".
   * @param {number} [maxRate=1.5] - La velocità massima consentita.
   * @returns {number} - La velocità di lettura calcolata.
   */
  function calculateOptimalRate(text, availableTime, baseRate = 1.0, maxRate = 1.5) {
    if (!text || availableTime <= 0) {
      return baseRate; // Ritorna la velocità base se non c'è testo o tempo
    }

    // Stima il tempo necessario per leggere il testo alla velocità base (es. 1.0x)
    // estimateReadingTime già include un piccolo buffer
    const estimatedTimeAtBaseRate = estimateReadingTime(text) / baseRate;

    // console.log(`CalcRate: available=${availableTime.toFixed(2)}s, estimated@${baseRate}x=${estimatedTimeAtBaseRate.toFixed(2)}s`); // Debug

    // Se c'è abbastanza tempo (o più) per leggere alla velocità base
    if (availableTime >= estimatedTimeAtBaseRate) {
      // console.log(`CalcRate: Tempo sufficiente. Uso rate: ${baseRate}`); // Debug
      return baseRate; // Usa la velocità normale
    } else {
      // Se non c'è abbastanza tempo, calcola la velocità necessaria per adattarsi
      // (Tempo Stimato @ Base) / (Tempo Effettivo Disponibile) = Fattore di Accelerazione Necessario
      const requiredAccelerationFactor = estimatedTimeAtBaseRate / availableTime;

      // La velocità finale sarà la velocità base moltiplicata per il fattore di accelerazione
      const calculatedRate = baseRate * requiredAccelerationFactor;

      // Limita la velocità tra la baseRate e la maxRate
      const finalRate = Math.min(Math.max(calculatedRate, baseRate), maxRate);

      // console.log(`CalcRate: Tempo insufficiente. Accelero a: ${finalRate.toFixed(2)}x (richiesto: ${calculatedRate.toFixed(2)}x)`); // Debug
      return finalRate;
    }
  }

  // Funzione che calcola la velocità ottimale con look-ahead intelligente
  function calculateSmartRate(currentIndex) {
    // Verifica se questo sottotitolo è già in un gruppo pianificato
    if (currentIndex >= plannedSubtitles.startIndex && currentIndex <= plannedSubtitles.endIndex) {
      // Usa la velocità già calcolata per questo gruppo
      return plannedSubtitles.rate;
    }

    // Reset della pianificazione precedente
    plannedSubtitles = {
      startIndex: -1,
      endIndex: -1,
      rate: 1.0,
      lastUpdate: Date.now(),
    };

    // Ottieni il sottotitolo corrente
    const currentSubtitle = capturedSubtitleEntries[currentIndex];
    const currentText = currentSubtitle.text;

    // Stima il tempo necessario per leggere normalmente
    const normalReadingTime = estimateReadingTime(currentText);

    // Calcola il tempo disponibile per questo sottotitolo
    let availableTime = 0;
    if (currentIndex + 1 < capturedSubtitleEntries.length) {
      availableTime = capturedSubtitleEntries[currentIndex + 1].start - currentSubtitle.start;
    } else {
      // Per l'ultimo sottotitolo, usiamo una stima ragionevole
      availableTime = normalReadingTime * 1.2;
    }

    // Se il tempo è sufficiente, usa velocità normale
    if (availableTime >= normalReadingTime) {
      plannedSubtitles = {
        startIndex: currentIndex,
        endIndex: currentIndex,
        rate: 1.0,
        lastUpdate: Date.now(),
      };
      return 1.0;
    }

    // Altrimenti, pianifica in anticipo
    console.log("Tempo insufficiente per sottotitolo singolo, pianificazione avanzata...");

    const maxLookahead = 3; // Massimo numero di sottotitoli da considerare insieme

    // Accumula testo e calcola tempo totale disponibile
    let combinedText = currentText;
    let lastSubtitleEnd = currentSubtitle.start;
    let groupEndIndex = currentIndex;

    for (let i = 1; i <= maxLookahead; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex >= capturedSubtitleEntries.length) break;

      const nextSubtitle = capturedSubtitleEntries[nextIndex];

      // Calcola gap tra sottotitoli
      const gap = nextSubtitle.start - lastSubtitleEnd;
      const significantGap = 1.0; // 1 secondo è considerato una pausa tra frasi

      if (gap > significantGap) {
        // Abbiamo trovato una pausa significativa, fermiamoci qui
        break;
      }

      // Aggiungi questo sottotitolo al gruppo
      combinedText += " " + nextSubtitle.text;
      lastSubtitleEnd = nextSubtitle.start;
      groupEndIndex = nextIndex;

      // Vediamo se abbiamo tempo sufficiente per l'intero gruppo
      const totalTextTime = estimateReadingTime(combinedText);

      // Calcola il tempo disponibile fino al prossimo sottotitolo dopo il gruppo
      let deadlineTime = 0;
      if (groupEndIndex + 1 < capturedSubtitleEntries.length) {
        deadlineTime = capturedSubtitleEntries[groupEndIndex + 1].start;
      } else {
        // Se siamo alla fine, usa una stima generosa
        deadlineTime = lastSubtitleEnd + totalTextTime * 1.5;
      }

      const totalAvailableTime = deadlineTime - currentSubtitle.start;

      // Se il tempo è quasi sufficiente con un'accelerazione moderata, fermiamoci qui
      if (totalTextTime <= totalAvailableTime * 1.25) {
        const requiredRate = Math.min(Math.max(totalTextTime / totalAvailableTime, 1.0), 1.5);

        // Aggiorna la pianificazione
        plannedSubtitles = {
          startIndex: currentIndex,
          endIndex: groupEndIndex,
          rate: requiredRate,
          lastUpdate: Date.now(),
        };

        console.log(
          `Gruppo pianificato: sottotitoli ${currentIndex}-${groupEndIndex}, ` +
            `tempo: ${totalAvailableTime.toFixed(1)}s, ` +
            `lettura: ${totalTextTime.toFixed(1)}s, ` +
            `velocità: ${requiredRate.toFixed(2)}x`
        );

        return requiredRate;
      }
    }

    // Se arriviamo qui, anche con lookahead non abbiamo trovato una soluzione ottimale
    // Calcoliamo la velocità minima necessaria per il gruppo che abbiamo accumulato
    const totalTextTime = estimateReadingTime(combinedText);
    let deadlineTime = groupEndIndex + 1 < capturedSubtitleEntries.length ? capturedSubtitleEntries[groupEndIndex + 1].start : lastSubtitleEnd + totalTextTime;

    const totalAvailableTime = deadlineTime - currentSubtitle.start;

    // Limita la velocità a un massimo ragionevole
    const requiredRate = Math.min(Math.max(totalTextTime / totalAvailableTime, 1.0), 1.75);

    // Aggiorna la pianificazione
    plannedSubtitles = {
      startIndex: currentIndex,
      endIndex: groupEndIndex,
      rate: requiredRate,
      lastUpdate: Date.now(),
    };

    console.log(`Gruppo pianificato (compromesso): sottotitoli ${currentIndex}-${groupEndIndex}, ` + `velocità: ${requiredRate.toFixed(2)}x`);

    return requiredRate;
  }

  /**
   * Versione migliorata di calculateOptimalRate che è più flessibile
   * con la regolazione della velocità quando necessario
   */
  function calculateOptimalRateEnhanced(text, availableTime, baseRate = 1.0, maxRate = 1.5) {
    if (!text || availableTime <= 0) {
      return baseRate;
    }

    // Stima il tempo necessario alla velocità base
    const estimatedTimeAtBaseRate = estimateReadingTime(text) / baseRate;

    // Se c'è abbastanza tempo, usa la velocità base
    if (availableTime >= estimatedTimeAtBaseRate * 1.1) {
      // 10% di margine
      return baseRate;
    }

    // Se c'è una significativa mancanza di tempo (meno del 70% del necessario),
    // considera di rallentare rispetto all'accelerazione standard
    if (availableTime < estimatedTimeAtBaseRate * 0.7) {
      // Analizza la complessità del testo
      const isComplex = isComplexText(text);

      if (isComplex) {
        // Per testi complessi, limita la velocità massima a 1.3x
        maxRate = Math.min(maxRate, 1.3);

        // Se il testo è molto complesso e importante, considera di rallentare
        // anche se questo significa non finire in tempo
        if (isImportantSubtitle(text) && text.length > 50) {
          return Math.min(1.25, maxRate);
        }
      }
    }

    // Calcola la velocità necessaria per adattarsi al tempo disponibile
    const requiredAccelerationFactor = estimatedTimeAtBaseRate / availableTime;
    const calculatedRate = baseRate * requiredAccelerationFactor;

    // Limita la velocità tra la baseRate e la maxRate
    let finalRate = Math.min(Math.max(calculatedRate, baseRate), maxRate);

    // Arrotonda a 0.05 più vicino per maggiore prevedibilità
    finalRate = Math.round(finalRate * 20) / 20;

    console.log(
      `Rate adattivo: ${finalRate.toFixed(2)}x (richiesto: ${calculatedRate.toFixed(2)}x, tempo: ${availableTime.toFixed(1)}s/${estimatedTimeAtBaseRate.toFixed(
        1
      )}s)`
    );

    return finalRate;
  }

  //#endregion FUNZIONE 6: Stimare il tempo di lettura

  //#region FUNZIONI 7: DI UTILITÀ

  // Funzione per ottenere l'ID del video
  function getVideoID() {
    return new URLSearchParams(window.location.search).get("v");
  }

  // Funzione per mostrare lo spinner
  function showSpinner() {
    const button = document.getElementById("subtitle-reader-btn");
    if (button) {
      // Rimuovi tutto il contenuto esistente
      while (button.firstChild) {
        button.removeChild(button.firstChild);
      }

      // Aggiungi il testo "Caricamento" come nodo di testo
      const textNode = document.createTextNode("Caricamento");
      button.appendChild(textNode);

      // Crea e aggiungi lo spinner
      const spinner = document.createElement("div");
      spinner.className = "spinner";
      button.appendChild(spinner);
      button.disabled = true;
    }
  }

  // Funzione per nascondere lo spinner
  function hideSpinner() {
    const button = document.getElementById("subtitle-reader-btn");
    if (button) {
      // Rimuovi tutto il contenuto esistente
      while (button.firstChild) {
        button.removeChild(button.firstChild);
      }

      // Aggiungi il testo "Leggi Sottotitoli" come nodo di testo
      const textNode = document.createTextNode("Leggi Sottotitoli");
      button.appendChild(textNode);
      button.disabled = false;
    }
  }

  // Funzione per decodificare entità HTML
  function decodeHtmlEntities(text) {
    const element = document.createElement("div");
    if (text) {
      element.innerHTML = text;
      return element.innerText || element.textContent;
    }
    return text;
  }

  // Funzione per formattare il tempo
  function formatTime(seconds) {
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  // Monitoraggio degli eventi video
  function monitorVideoPlayback() {
    const videoElement = document.querySelector("video");
    if (!videoElement) {
      console.warn("Elemento video non trovato, riprovando tra 1 secondo");
      setTimeout(monitorVideoPlayback, 1000);
      return;
    }

    console.log("Monitoraggio video iniziato");

    // Aggiungi la variabile lastReadTime se non esiste già
    if (typeof lastReadTime === "undefined") {
      window.lastReadTime = 0;
    }

    // Monitora eventi di play
    videoElement.addEventListener("play", function () {
      const currentTime = videoElement.currentTime;
      console.log("Video play event - posizione corrente:", currentTime);

      // Attiva la lettura se i sottotitoli sono stati caricati
      if (capturedSubtitleEntries.length > 0 && isReadingActive) {
        startReadingFromTime(currentTime);
      }
    });

    // Monitora eventi di pausa
    videoElement.addEventListener("pause", function () {
      const currentTime = videoElement.currentTime;
      console.log("Video pause event - posizione corrente:", currentTime);

      // Interrompi la lettura quando il video è in pausa
      if (isReadingActive) {
        speechSynth.pause();
      }
    });

    // Monitora eventi di seeking
    videoElement.addEventListener("seeking", function () {
      const currentTime = videoElement.currentTime;
      console.log("Video seeking event - nuova posizione:", currentTime);

      // Interrompi la lettura corrente
      speechSynth.cancel();

      // Se il video è in riproduzione, riavvia la lettura dalla nuova posizione
      if (!videoElement.paused && isReadingActive) {
        startReadingFromTime(currentTime);
      }
    });

    // Monitora periodicamente la posizione del video per sincronizzare la lettura
    let lastCheckedTime = -1;
    const checkInterval = setInterval(function () {
      if (videoElement.paused || !isReadingActive) return;

      const currentTime = videoElement.currentTime;

      // Ottimizzazione: verifica se il tempo è cambiato significativamente
      if (Math.abs(currentTime - lastCheckedTime) < 0.2) {
        return;
      }
      lastCheckedTime = currentTime;

      const currentSubtitle = findSubtitleAtTime(currentTime, 0.5); // Anticipazione di 0.5 secondi

      if (currentSubtitle && currentSubtitle.index !== lastReadIndex) {
        // Verifica se è passato abbastanza tempo dall'ultima lettura
        const timeSinceLastRead = Date.now() - (window.lastReadTime || 0);
        const minTimeBetweenReads = 150;

        if (timeSinceLastRead < minTimeBetweenReads) {
          return;
        }

        // Ottieni le impostazioni di lingua correnti
        const sourceLanguageSelector = document.getElementById("source-language-selector");
        const targetLanguageSelector = document.getElementById("target-language-selector");
        const sourceLang = sourceLanguageSelector ? sourceLanguageSelector.value : "auto";
        const targetLang = targetLanguageSelector ? targetLanguageSelector.value : "it";

        // Calcola il tempo disponibile per questo sottotitolo
        const availableTime = Math.max(currentSubtitle.endTime - currentSubtitle.startTime, 0.5);

        // Funzione per effettuare la lettura
        function processAndRead(textToRead) {
          // Pulisci il testo e verifica che non sia vuoto
          const cleanedText = textToRead ? textToRead.trim() : "";
          if (!cleanedText) {
            lastReadIndex = currentSubtitle.index;
            return;
          }

          // Usa la funzione di pianificazione intelligente
          let optimalRate = calculateSmartRate(currentSubtitle.index);
          speechRate = optimalRate;

          // Calcola la velocità ottimale con limite massimo più basso (1.75 invece di 2.5)
          const estimatedTime = estimateReadingTime(cleanedText);
          optimalRate = Math.min(Math.max(optimalRate, 1.0), 1.75);
          speechRate = optimalRate;

          console.log(
            `Sottotitolo [${currentSubtitle.index}] (velocità ${speechRate.toFixed(2)}x): "${cleanedText.substring(0, 50)}..."`,
            `[Tempo disponibile: ${availableTime.toFixed(1)}s, Stimato: ${estimatedTime.toFixed(1)}s]`
          );

          // Mostra i sottotitoli tradotti se l'opzione è abilitata
          const showSubtitlesCheckbox = document.getElementById("show-subtitles-checkbox");
          if (showSubtitlesCheckbox && showSubtitlesCheckbox.checked && targetLang !== "off" && targetLang !== sourceLang) {
            showTranslatedSubtitle(cleanedText);
          }

          try {
            // Interrompi qualsiasi lettura precedente
            if (speechSynth.speaking || speechSynth.pending) {
              speechSynth.cancel();
            }

            // Usa setTimeout per dare tempo al sistema di liberare risorse
            setTimeout(() => {
              // Crea l'utterance dopo un breve ritardo
              const utterance = new SpeechSynthesisUtterance(cleanedText);
              utterance.voice = preferredVoice;
              utterance.lang = preferredVoice ? preferredVoice.lang : "it-IT";
              utterance.rate = speechRate;
              utterance.pitch = 1.0;
              utterance.volume = 1.0;

              speechSynth.speak(utterance);

              // Aggiorna l'indice e il timestamp
              lastReadIndex = currentSubtitle.index;
              window.lastReadTime = Date.now();
            }, 20);
          } catch (e) {
            console.error("Errore durante la lettura del sottotitolo:", e);
          }
        }

        // Se la traduzione è attiva, usa il testo tradotto
        if (targetLang && targetLang !== "off" && (targetLang !== sourceLang || sourceLang === "auto")) {
          getTranslatedSubtitle(currentSubtitle.index, sourceLang, targetLang)
            .then(function (translatedText) {
              processAndRead(translatedText || currentSubtitle.text);
            })
            .catch(function (err) {
              console.error("Errore durante la traduzione:", err);
              // Fallback al testo originale
              processAndRead(currentSubtitle.text);
            });
        } else {
          // Usa il testo originale
          processAndRead(currentSubtitle.text);
        }
      }
    }, 250); // Intervallo ridotto a 250ms per una maggiore reattività

    // Pulisci l'intervallo quando la pagina viene chiusa o cambiata
    window.addEventListener("beforeunload", function () {
      clearInterval(checkInterval);
    });
  }

  /**
   * Migliora le funzioni di sintesi vocale e monitoraggio video
   * Questa funzione sostituisce le versioni originali con versioni potenziate
   */
  function enhanceMonitorVideoPlayback() {
    console.log("Potenziamento funzionalità di monitoraggio e lettura...");

    // Inizializza le impostazioni di velocità video
    videoSpeedConfig.currentSpeed = videoSpeedConfig.normalSpeed;

    // CORREZIONE: Non proviamo a salvare un riferimento che potrebbe non esistere
    // Invece, assegniamo direttamente la funzione migliorata a startReadingFromTime
    window.startReadingFromTime = startReadingFromTimeEnhanced;

    // Aggiungi variabili globali per tenere traccia dell'ultimo testo letto
    window._lastReadText = "";
    window._lastReadTime = 0;

    // Assicurati che la velocità del video sia normale all'inizio
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.playbackRate = videoSpeedConfig.normalSpeed;
    }

    console.log("Funzioni di monitoraggio, lettura e velocità video potenziate!");
  }

  /**
   * Trova il sottotitolo corrispondente alla posizione corrente del video (con anticipazione)
   * Si assicura di essere definita PRIMA che startReadingFromTime sia chiamata
   */
  function startReadingFromTime(time) {
    // Questa è una versione base che verrà sovrascritta da startReadingFromTimeEnhanced
    // ma garantisce che ci sia sempre una funzione startReadingFromTime definita
    const currentSubtitle = findSubtitleAtTime(time, 0.5);
    if (currentSubtitle && currentSubtitle.index !== lastReadIndex) {
      speakText(currentSubtitle.text);
      lastReadIndex = currentSubtitle.index;
    }
  }

  // Funzione per rilevare la lingua dei sottotitoli
  async function detectSubtitleLanguage() {
    // Elemento per mostrare la lingua rilevata
    const detectedLanguageDisplay = document.getElementById("detected-language-display");
    if (!detectedLanguageDisplay) return;

    // Mostra "rilevamento in corso..."
    detectedLanguageDisplay.textContent = "(rilevamento...)";
    detectedLanguageDisplay.style.color = "#ffab40";

    try {
      const videoID = getVideoID();
      if (!videoID) throw new Error("Video ID non trovato");

      // Accediamo ai dati del player di YouTube
      const subtitleData = await new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 5;

        const checkForPlayer = () => {
          attempts++;
          const ytPlayer = document.querySelector("#movie_player");
          const captionData = ytPlayer?.getPlayerResponse()?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

          if (captionData) {
            const fetchedBaseUrl = captionData[0].baseUrl;
            const fetchedVideoID = fetchedBaseUrl.match(/[?&]v=([^&]+)/)?.[1];

            if (fetchedVideoID !== videoID && attempts < maxAttempts) {
              setTimeout(checkForPlayer, 500);
            } else {
              resolve(captionData);
            }
          } else if (attempts < maxAttempts) {
            setTimeout(checkForPlayer, 500);
          } else {
            reject(new Error("Dati dei sottotitoli non trovati"));
          }
        };

        checkForPlayer();
      });

      // Se non ci sono sottotitoli disponibili
      if (!subtitleData || !subtitleData.length) {
        detectedLanguageDisplay.textContent = "(nessun sottotitolo)";
        detectedLanguageDisplay.style.color = "#ff5252";
        return "auto";
      }

      // Estrai le informazioni sulla lingua
      const languages = subtitleData.map((track) => ({
        code: track.languageCode,
        name: track.name?.simpleText || track.languageCode,
        isAutoGenerated: track.vssId.startsWith("a."),
        baseUrl: track.baseUrl,
      }));

      console.log("Lingue sottotitoli disponibili:", languages);

      // Ottieni la prima lingua (quella principale)
      const mainLanguage = languages[0];
      const languageCode = mainLanguage.code.split("-")[0];
      const isAuto = mainLanguage.isAutoGenerated;

      // Mappa dei nomi delle lingue
      const languageNames = {
        en: "Inglese",
        it: "Italiano",
        es: "Spagnolo",
        fr: "Francese",
        de: "Tedesco",
        zh: "Cinese",
        ja: "Giapponese",
        ko: "Coreano",
        ru: "Russo",
        ar: "Arabo",
        pt: "Portoghese",
        nl: "Olandese",
        sv: "Svedese",
        tr: "Turco",
        pl: "Polacco",
        da: "Danese",
        fi: "Finlandese",
        no: "Norvegese",
        cs: "Ceco",
        hu: "Ungherese",
        el: "Greco",
        he: "Ebraico",
        hi: "Hindi",
        id: "Indonesiano",
        ms: "Malese",
        th: "Tailandese",
        vi: "Vietnamita",
      };

      // Imposta la lingua nel selettore source-language
      const sourceLanguageSelector = document.getElementById("source-language-selector");
      if (sourceLanguageSelector) {
        // Verifica se esiste un'opzione per questa lingua
        const options = Array.from(sourceLanguageSelector.options);
        const optionExists = options.some((option) => option.value === languageCode);

        if (optionExists) {
          sourceLanguageSelector.value = languageCode;
        } else {
          sourceLanguageSelector.value = "auto";
        }
      }

      // Mostra la lingua rilevata nel display
      const languageName = languageNames[languageCode] || mainLanguage.name || languageCode;
      detectedLanguageDisplay.textContent = `(${languageName}${isAuto ? ", auto" : ""})`;
      detectedLanguageDisplay.style.color = "#4caf50"; // Verde per indicare successo

      return languageCode;
    } catch (err) {
      console.error("Errore nel rilevamento della lingua dei sottotitoli:", err);
      detectedLanguageDisplay.textContent = "(errore nel rilevamento)";
      detectedLanguageDisplay.style.color = "#ff5252"; // Rosso per indicare errore
      return "auto";
    }
  }

  // Funzioni per la gestione delle impostazioni
  function getSettings(keys) {
    return new Promise(function (resolve) {
      if (typeof GM_getValue !== "undefined") {
        // Tampermonkey/Greasemonkey API
        const result = {};
        for (const key of keys) {
          result[key] = GM_getValue(key);
        }
        resolve(result);
      } else {
        // Fallback a localStorage
        const result = {};
        for (const key of keys) {
          result[key] = localStorage.getItem("ytsr_" + key);
          // Deserializza JSON se necessario
          try {
            if (result[key]) result[key] = JSON.parse(result[key]);
          } catch (e) {}
        }
        resolve(result);
      }
    });
  }

  function updateSettings(settings) {
    return new Promise(function (resolve) {
      if (typeof GM_setValue !== "undefined") {
        // Tampermonkey/Greasemonkey API
        for (const key in settings) {
          GM_setValue(key, settings[key]);
        }
        resolve();
      } else {
        // Fallback a localStorage
        for (const key in settings) {
          if (settings[key] === undefined || settings[key] === null) {
            localStorage.removeItem("ytsr_" + key);
          } else {
            // Serializza oggetti/array in JSON
            const value = typeof settings[key] === "object" ? JSON.stringify(settings[key]) : settings[key];
            localStorage.setItem("ytsr_" + key, value);
          }
        }
        resolve();
      }
    });
  }

  //#endregion FUNZIONI 7: DI UTILITÀ

  //#region FUNZIONE 8: traduzione dei sottotitoli

  /**
   * Traduce testo usando l'API Google Translate HTML
   * Questa versione è più robusta per i gruppi di sottotitoli perché
   * utilizza i tag HTML che vengono preservati durante la traduzione
   *
   * @param {string} text - Testo da tradurre
   * @param {string} sourceLang - Lingua di origine (es. "en" o "auto")
   * @param {string} targetLang - Lingua di destinazione (es. "it")
   * @returns {Promise<string>} - Promessa che restituisce il testo tradotto
   */
  function translateHtml(text, sourceLang, targetLang) {
    return new Promise((resolve, reject) => {
      if (!text || !targetLang || targetLang === "off") {
        resolve(text);
        return;
      }

      console.log(`Traduzione HTML in corso da ${sourceLang || "auto"} a ${targetLang}: "${text.substring(0, 50)}..."`);

      // Endpoint per l'API HTML di Google
      const endpoint = "https://translate-pa.googleapis.com/v1/translateHtml";

      // Headers necessari per la richiesta
      const headers = {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json+protobuf",
        "X-Goog-Api-Key": "AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      };

      // Crea il corpo della richiesta come specificato nel file API
      const body = JSON.stringify([[[text], sourceLang || "auto", targetLang], "wt_lib"]);

      // Flag per il timeout di sicurezza
      let responseReceived = false;
      const safetyTimeout = setTimeout(() => {
        if (!responseReceived) {
          console.error("Timeout di sicurezza: nessuna risposta ricevuta dalla traduzione HTML");
          responseReceived = true;
          resolve(text); // Restituisci il testo originale in caso di timeout
        }
      }, 20000);

      try {
        console.log(`Invio richiesta POST a ${endpoint.substring(0, 100)}...`);

        GM_xmlhttpRequest({
          method: "POST",
          url: endpoint,
          data: body,
          headers: headers,
          timeout: 15000,
          onload: function (response) {
            try {
              responseReceived = true;
              clearTimeout(safetyTimeout);

              console.log("Stato risposta traduzione HTML:", response.status);

              if (response.status === 200) {
                const responseText = response.responseText;

                // Verifica che la risposta non sia vuota
                if (!responseText || responseText.trim() === "") {
                  console.error("Risposta vuota dalla traduzione HTML");
                  resolve(text);
                  return;
                }

                try {
                  // Parsing della risposta come specificato nel file API
                  const result = JSON.parse(responseText);
                  const translatedText = result[0][0];

                  if (!translatedText || !translatedText.trim()) {
                    console.warn("Traduzione HTML vuota o non valida");
                    resolve(text);
                    return;
                  }

                  console.log(`Traduzione HTML completata: "${translatedText.substring(0, 50)}..."`);
                  resolve(translatedText);
                } catch (parseError) {
                  console.error("Errore parsing JSON dalla traduzione HTML:", parseError);
                  console.log("Testo che ha causato errore:", responseText.substring(0, 100));
                  resolve(text);
                }
              } else {
                console.error("Errore HTTP dalla traduzione HTML:", response.status);
                resolve(text);
              }
            } catch (callbackError) {
              console.error("Errore nella callback onload della traduzione HTML:", callbackError);
              resolve(text);
            }
          },
          onerror: function (error) {
            console.error("onerror chiamato per traduzione HTML:", error);
            responseReceived = true;
            clearTimeout(safetyTimeout);
            resolve(text);
          },
          ontimeout: function () {
            console.error("ontimeout chiamato per traduzione HTML");
            responseReceived = true;
            clearTimeout(safetyTimeout);
            resolve(text);
          },
          onabort: function () {
            console.error("onabort chiamato per traduzione HTML");
            responseReceived = true;
            clearTimeout(safetyTimeout);
            resolve(text);
          },
        });
      } catch (requestError) {
        console.error("Errore nell'invio della richiesta GM_xmlhttpRequest per traduzione HTML:", requestError);
        clearTimeout(safetyTimeout);
        resolve(text);
      }
    });
  }

  /**
   * Traduce un gruppo di sottotitoli usando l'API HTML di Google
   * Questa versione è più robusta perché ogni sottotitolo è racchiuso in un tag div
   * che viene preservato durante la traduzione, consentendo un'estrazione precisa
   *
   * @param {number} startIndex - Indice di inizio del gruppo di sottotitoli
   * @param {string} sourceLang - Lingua di origine
   * @param {string} targetLang - Lingua di destinazione
   * @returns {Promise<Object>} - Promessa che restituisce oggetto con traduzioni
   */
  function translateSubtitleGroupHtml(startIndex, sourceLang, targetLang) {
    // Crea chiave cache
    const cacheKey = `${sourceLang}|${targetLang}|${startIndex}`;

    // Verifica se è già in cache
    if (translationCache[cacheKey]) {
      console.log(`Gruppo di traduzione ${startIndex} trovato in cache`);
      return Promise.resolve(translationCache[cacheKey]);
    }

    // Costruisci il gruppo di sottotitoli
    const GROUP_SIZE = 15; // Ridotto a 15 per maggiore affidabilità
    const endIndex = Math.min(startIndex + GROUP_SIZE, capturedSubtitleEntries.length);
    const subtitlesToTranslate = [];

    // Usiamo tag HTML per incapsulare ogni sottotitolo
    let combinedHtml = "";
    for (let i = startIndex; i < endIndex; i++) {
      const text = capturedSubtitleEntries[i].text;
      // Ogni sottotitolo è racchiuso in un div con id univoco
      combinedHtml += `<div id="sub-${i - startIndex}" class="subtitle">${escapeHtml(text)}</div>`;
      subtitlesToTranslate.push({ index: i, text: text });
    }

    console.log(`Traduzione gruppo HTML da ${startIndex} a ${endIndex - 1} (${combinedHtml.length} caratteri)`);

    // Invia la richiesta di traduzione
    return translateHtml(combinedHtml, sourceLang, targetLang)
      .then((translatedHtml) => {
        console.log("HTML tradotto ricevuto:", translatedHtml.substring(0, 100) + "...");

        // Estrai i singoli sottotitoli tradotti
        const translations = {};
        let extractionFailures = 0;

        // Crea un DOM temporaneo per estrarre le traduzioni
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = translatedHtml;

        for (let i = 0; i < subtitlesToTranslate.length; i++) {
          try {
            // Cerca il div con l'id corrispondente
            const translatedDiv = tempDiv.querySelector(`#sub-${i}`);

            if (translatedDiv) {
              const extractedText = translatedDiv.innerHTML;
              translations[startIndex + i] = extractedText;
              console.log(`Estratto sottotitolo ${startIndex + i} da HTML:`, extractedText);
            } else {
              // Se il div non è stato trovato, usa una regex come fallback
              const regex = new RegExp(`<div id="sub-${i}"[^>]*>(.*?)</div>`, "i");
              const match = translatedHtml.match(regex);

              if (match && match[1]) {
                translations[startIndex + i] = match[1];
                console.log(`Estratto sottotitolo ${startIndex + i} con regex:`, match[1]);
              } else {
                translations[startIndex + i] = subtitlesToTranslate[i].text;
                console.log("Fallback al testo originale per sottotitolo", startIndex + i);
                extractionFailures++;
              }
            }
          } catch (error) {
            translations[startIndex + i] = subtitlesToTranslate[i].text;
            console.log("Errore durante l'estrazione per sottotitolo", startIndex + i, error);
            extractionFailures++;
          }
        }

        // Se ci sono stati troppi fallimenti nell'estrazione, ritenta con un approccio diverso
        if (extractionFailures > subtitlesToTranslate.length / 2) {
          console.log(`Troppi fallimenti nell'estrazione HTML (${extractionFailures}/${subtitlesToTranslate.length}), provo con traduzione classica`);
          return translateSubtitleGroupClassic(startIndex, sourceLang, targetLang);
        }

        // Memorizza nella cache
        translationCache[cacheKey] = translations;
        console.log(`Traduzione gruppo HTML ${startIndex} completata`);
        return translations;
      })
      .catch((error) => {
        console.error("Errore nella traduzione HTML di gruppo, ritenta con approccio classico:", error);
        return translateSubtitleGroupClassic(startIndex, sourceLang, targetLang);
      });
  }

  /**
   * Versione classica della traduzione di gruppo come fallback
   * Usa l'API standard di Google Translate
   *
   * @param {number} startIndex - Indice di inizio del gruppo di sottotitoli
   * @param {string} sourceLang - Lingua di origine
   * @param {string} targetLang - Lingua di destinazione
   * @returns {Promise<Object>} - Promessa che restituisce oggetto con traduzioni
   */
  function translateSubtitleGroupClassic(startIndex, sourceLang, targetLang) {
    // Simile all'implementazione originale ma con miglioramenti
    const cacheKey = `${sourceLang}|${targetLang}|${startIndex}-classic`;

    if (translationCache[cacheKey]) {
      console.log(`Gruppo di traduzione classica ${startIndex} trovato in cache`);
      return Promise.resolve(translationCache[cacheKey]);
    }

    const GROUP_SIZE = 10; // Ridotto a 10 per maggiore affidabilità
    const endIndex = Math.min(startIndex + GROUP_SIZE, capturedSubtitleEntries.length);
    const subtitlesToTranslate = [];

    // Usiamo delimitatori JSON che sono meno probabili da tradurre
    let combinedText = "";
    for (let i = startIndex; i < endIndex; i++) {
      const text = capturedSubtitleEntries[i].text;
      // JSON.stringify garantisce l'escape corretto
      combinedText += `{"idx":${i - startIndex},"txt":${JSON.stringify(text)}}`;
      subtitlesToTranslate.push({ index: i, text: text });
    }

    console.log(`Traduzione gruppo classica da ${startIndex} a ${endIndex - 1} (${combinedText.length} caratteri)`);

    return translateText(combinedText, sourceLang, targetLang)
      .then((translatedText) => {
        console.log("Testo tradotto ricevuto (classico):", translatedText.substring(0, 100) + "...");

        const translations = {};
        let extractionFailures = 0;

        for (let i = 0; i < subtitlesToTranslate.length; i++) {
          try {
            // Cerchiamo il pattern JSON nella traduzione
            const regex = new RegExp(`{"idx":${i},"txt":"?(.*?)"?}`, "i");
            const match = translatedText.match(regex);

            if (match && match[1]) {
              // Rimuovi escape di virgolette se presenti
              let extractedText = match[1].replace(/\\"/g, '"');
              translations[startIndex + i] = extractedText;
              console.log(`Estratto sottotitolo ${startIndex + i} (classico):`, extractedText);
            } else {
              // Se il pattern non è stato trovato, tenta un'estrazione meno precisa
              translations[startIndex + i] = subtitlesToTranslate[i].text;
              console.log("Fallback al testo originale per sottotitolo (classico)", startIndex + i);
              extractionFailures++;
            }
          } catch (error) {
            translations[startIndex + i] = subtitlesToTranslate[i].text;
            console.log("Errore durante l'estrazione per sottotitolo (classico)", startIndex + i, error);
            extractionFailures++;
          }
        }

        // Se ci sono stati troppi fallimenti, ritorna con una traduzione singola
        if (extractionFailures > subtitlesToTranslate.length / 2) {
          console.log(`Troppi fallimenti nell'estrazione classica (${extractionFailures}/${subtitlesToTranslate.length}), traduco singolarmente`);
          return translateIndividuallyAsFallback(startIndex, endIndex, sourceLang, targetLang);
        }

        translationCache[cacheKey] = translations;
        console.log(`Traduzione gruppo classica ${startIndex} completata`);
        return translations;
      })
      .catch((error) => {
        console.error("Errore nella traduzione classica di gruppo, traduco singolarmente:", error);
        return translateIndividuallyAsFallback(startIndex, endIndex, sourceLang, targetLang);
      });
  }

  /**
   * Funzione di supporto per escape HTML
   *
   * @param {string} unsafe - Testo da rendere sicuro per HTML
   * @returns {string} - Testo con caratteri HTML escaped
   */
  function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  /**
   * Funzione principale che decide quale implementazione di traduzione usare
   * Prima prova con HTML, poi fallback su classica e infine singola
   *
   * @param {number} startIndex - Indice di inizio del gruppo di sottotitoli
   * @param {string} sourceLang - Lingua di origine
   * @param {string} targetLang - Lingua di destinazione
   * @returns {Promise<Object>} - Promessa che restituisce oggetto con traduzioni
   */
  function translateSubtitleGroup(startIndex, sourceLang, targetLang) {
    // Tenta prima l'approccio HTML, poi fallback sugli altri metodi
    return translateSubtitleGroupHtml(startIndex, sourceLang, targetLang);
  }

  /**
   * Funzione di supporto per l'integrazione nel sistema di monitoraggio video
   * Traduce i sottotitoli all'avvio e li prepara per la lettura
   *
   * @param {Element} videoElement - Elemento video HTML
   * @param {string} sourceLang - Lingua di origine (o "auto")
   * @param {string} targetLang - Lingua di destinazione
   * @returns {Promise} - Promessa che si risolve quando la traduzione iniziale è completata
   */
  function prepareTranslatedSubtitles(videoElement, sourceLang = "auto", targetLang = "it") {
    if (!capturedSubtitleEntries || capturedSubtitleEntries.length === 0) {
      console.warn("Nessun sottotitolo da tradurre");
      return Promise.resolve();
    }

    if (targetLang === "off") {
      console.log("Traduzione disabilitata");
      return Promise.resolve();
    }

    console.log(`Preparazione traduzione: da ${sourceLang} a ${targetLang}, ${capturedSubtitleEntries.length} sottotitoli`);

    // Pre-traduci il primo gruppo per essere pronti alla lettura
    return translateSubtitleGroup(0, sourceLang, targetLang).then((translations) => {
      console.log("Primo gruppo tradotto, pronto per la lettura");

      // Opzionale: pre-carica il secondo gruppo per ridurre la latenza
      if (capturedSubtitleEntries.length > 15) {
        setTimeout(() => {
          translateSubtitleGroup(15, sourceLang, targetLang)
            .then(() => console.log("Secondo gruppo pre-caricato"))
            .catch((err) => console.error("Errore nel pre-caricamento:", err));
        }, 2000);
      }

      return translations;
    });
  }

  /**
   * Ottiene la traduzione per un sottotitolo specifico
   * Restituisce il sottotitolo originale se la traduzione non è disponibile
   *
   * @param {number} index - Indice del sottotitolo
   * @param {string} sourceLang - Lingua di origine
   * @param {string} targetLang - Lingua di destinazione
   * @returns {Promise<string>} - Promessa che restituisce il sottotitolo tradotto
   */
  function getTranslatedSubtitle(index, sourceLang = "auto", targetLang = "it") {
    if (targetLang === "off") {
      return Promise.resolve(capturedSubtitleEntries[index].text);
    }

    // Calcola a quale gruppo appartiene questo sottotitolo
    const groupSize = 15; // Deve corrispondere a GROUP_SIZE in translateSubtitleGroupHtml
    const groupIndex = Math.floor(index / groupSize) * groupSize;

    return translateSubtitleGroup(groupIndex, sourceLang, targetLang)
      .then((translations) => {
        const translatedText = translations[index];
        if (translatedText) {
          return translatedText;
        } else {
          console.warn(`Traduzione non trovata per sottotitolo ${index}, uso originale`);
          return capturedSubtitleEntries[index].text;
        }
      })
      .catch((err) => {
        console.error(`Errore nel recupero della traduzione per sottotitolo ${index}:`, err);
        return capturedSubtitleEntries[index].text;
      });
  }

  /**
   * Aggiorna la funzione di monitoraggio del video per utilizzare i sottotitoli tradotti
   * Integrazione con il resto dello script per lettura TTS
   */
  function enhanceMonitorVideoPlayback() {
    console.log("enhanceMonitorVideoPlayback è stata chiamata!");
    const sourceLanguageSelector = document.getElementById("source-language-selector");
    const targetLanguageSelector = document.getElementById("target-language-selector");

    // Ottieni le impostazioni di lingua correnti
    const sourceLang = sourceLanguageSelector ? sourceLanguageSelector.value : "auto";
    const targetLang = targetLanguageSelector ? targetLanguageSelector.value : "it";

    // Modifica startReadingFromTime per utilizzare i sottotitoli tradotti
    const originalStartReadingFromTime = startReadingFromTime;

    startReadingFromTime = function (time) {
      const currentSubtitle = findSubtitleAtTime(time, 0.5);
      if (currentSubtitle) {
        if (!currentSubtitle.currentSubtitle && currentSubtitle.index === lastReadIndex) {
          return;
        }

        // Calcola il tempo disponibile per questo sottotitolo
        let availableTime = currentSubtitle.endTime - currentSubtitle.startTime;
        availableTime = Math.max(availableTime, 0.5);

        // Ottieni la versione tradotta del sottotitolo
        getTranslatedSubtitle(currentSubtitle.index, sourceLang, targetLang)
          .then((translatedText) => {
            // Calcola la velocità ottimale
            const optimalRate = calculateOptimalRate(translatedText, availableTime);

            // Aggiorna la velocità di lettura
            speechRate = optimalRate;

            console.log(
              `Lettura sottotitolo tradotto (velocità ${speechRate.toFixed(1)}x): "${translatedText.substring(0, 50)}..."`,
              `[Tempo disponibile: ${availableTime.toFixed(1)}s]`
            );

            // Mostra i sottotitoli tradotti se l'opzione è abilitata
            const showSubtitlesCheckbox = document.getElementById("show-subtitles-checkbox");
            if (showSubtitlesCheckbox && showSubtitlesCheckbox.checked) {
              showTranslatedSubtitle(translatedText);
            }

            speakText(translatedText);
            lastReadIndex = currentSubtitle.index;
          })
          .catch((err) => {
            console.error("Errore durante la lettura del sottotitolo tradotto:", err);
            // Fallback al testo originale
            const originalText = currentSubtitle.text;
            speakText(originalText);
            lastReadIndex = currentSubtitle.index;
          });
      }
    };
  }

  /**
   * Mostra il sottotitolo tradotto sullo schermo
   *
   * @param {string} text - Testo tradotto da mostrare
   */
  function showTranslatedSubtitle(text) {
    let subtitleContainer = document.getElementById("translated-subtitles");
    if (!subtitleContainer) {
      subtitleContainer = document.createElement("div");
      subtitleContainer.id = "translated-subtitles";
      subtitleContainer.style.cssText = `
        position: fixed;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 9999;
        text-align: center;
        font-size: 18px;
        max-width: 80%;
        transition: opacity 0.3s;
      `;
      document.body.appendChild(subtitleContainer);
    }

    // Cancella qualsiasi timer di nascondimento precedente
    if (subtitleFadeoutTimer) {
      clearTimeout(subtitleFadeoutTimer);
      subtitleFadeoutTimer = null;
    }

    // Mostra il sottotitolo
    subtitleContainer.textContent = text;
    subtitleContainer.style.display = "block";
    subtitleContainer.style.opacity = "1";

    // Non impostiamo un timer qui - il sottotitolo rimarrà visibile
    // fino a quando non viene mostrato il prossimo o fino a quando
    // non viene esplicitamente nascosto
  }

  /**
   * Nasconde i sottotitoli tradotti
   * Da chiamare quando si passa a un nuovo sottotitolo
   */
  function hideTranslatedSubtitle() {
    const subtitleContainer = document.getElementById("translated-subtitles");
    if (subtitleContainer) {
      subtitleContainer.style.opacity = "0";
      // Dopo la transizione di opacità, nascondi l'elemento
      subtitleFadeoutTimer = setTimeout(() => {
        subtitleContainer.style.display = "none";
        subtitleFadeoutTimer = null;
      }, 300);
    }
  }

  function testGroupTranslation() {
    console.log("=== INIZIO TEST TRADUZIONE A GRUPPI ===");

    // Controlla se ci sono sottotitoli caricati
    if (!capturedSubtitleEntries || capturedSubtitleEntries.length === 0) {
      console.error("Errore: Nessun sottotitolo caricato per il test");
      return;
    }

    // Usa i primi 10 sottotitoli come test
    const testSize = Math.min(10, capturedSubtitleEntries.length);

    // Origine e destinazione per il test
    const sourceLang = "auto";
    const targetLang = "it"; // Cambia a seconda della tua lingua preferita

    // Mostra sottotitoli originali
    console.log("SOTTOTITOLI ORIGINALI:");
    for (let i = 0; i < testSize; i++) {
      console.log(`[${i}] ${capturedSubtitleEntries[i].text}`);
    }

    // Esegui la traduzione del gruppo
    console.log("\nTRADUZIONE IN CORSO...");
    console.log("Lingua di origine:", sourceLang);
    console.log("Lingua di destinazione:", targetLang);
    console.log("Usando delimitatori numerici [0] e [/0]");

    // Misura il tempo per la prima chiamata
    const startTime = performance.now();

    translateSubtitleGroup(0, sourceLang, targetLang)
      .then((translations) => {
        const elapsedTime = (performance.now() - startTime).toFixed(2);
        console.log(`\nTraduzioni ricevute in ${elapsedTime}ms`);
        console.log("SOTTOTITOLI TRADOTTI:");

        for (let i = 0; i < testSize; i++) {
          const originalText = capturedSubtitleEntries[i].text;
          const translatedText = translations[i] || "Non tradotto";

          console.log(`[${i}] Originale: "${originalText.substring(0, 40)}${originalText.length > 40 ? "..." : ""}"`);
          console.log(`    Tradotto:  "${translatedText.substring(0, 40)}${translatedText.length > 40 ? "..." : ""}"`);
        }

        console.log("\nTest della cache...");
        const cacheStart = performance.now();
        return translateSubtitleGroup(0, sourceLang, targetLang).then((cachedResult) => {
          const cacheTime = (performance.now() - cacheStart).toFixed(2);
          return { cacheTime, success: true };
        });
      })
      .then((cacheResult) => {
        if (cacheResult.success) {
          console.log(`Seconda chiamata completata in ${cacheResult.cacheTime}ms (dovrebbe essere molto più veloce grazie alla cache)`);
          console.log("=== TEST COMPLETATO CON SUCCESSO ===");
        }
      })
      .catch((error) => {
        console.error("Errore durante il test:", error);
        console.log("=== TEST FALLITO ===");
      });
  }

  // Funzione di fallback necessaria per la traduzione individuale
  async function translateIndividuallyAsFallback(startIndex, endIndex, sourceLang, targetLang) {
    console.log(`Tentativo di fallback: traduzione individuale per sottotitoli da ${startIndex} a ${endIndex - 1}`);

    const translations = {};
    for (let i = startIndex; i < endIndex; i++) {
      try {
        const text = capturedSubtitleEntries[i].text;
        const translatedText = await translateText(text, sourceLang, targetLang);
        translations[i] = translatedText;
        console.log(`Tradotto singolarmente sottotitolo ${i}: "${translatedText.substring(0, 30)}..."`);
      } catch (error) {
        console.error(`Errore nella traduzione singola del sottotitolo ${i}:`, error);
        translations[i] = capturedSubtitleEntries[i].text; // Fallback al testo originale
      }
      // Piccola pausa per evitare rate limit
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Salva in cache
    const cacheKey = `${sourceLang}|${targetLang}|${startIndex}`;
    translationCache[cacheKey] = translations;

    return translations;
  }

  /**
   * Traduce un singolo testo usando l'API di Google Translate
   * @param {string} text - Testo da tradurre
   * @param {string} sourceLang - Lingua sorgente (o 'auto' per rilevamento automatico)
   * @param {string} targetLang - Lingua di destinazione
   * @returns {Promise<string>} - Promise che restituisce il testo tradotto
   */
  function translateText(text, sourceLang = "auto", targetLang = "it") {
    return new Promise((resolve, reject) => {
      if (!text || !targetLang || targetLang === "off") {
        resolve(text);
        return;
      }

      console.log(`Traduzione testo: "${text.substring(0, 30)}..." da ${sourceLang} a ${targetLang}`);

      // Endpoint standard per l'API di Google Translate (non ufficiale)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang || "auto"}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Estrai il testo tradotto
          if (data && data[0]) {
            let translatedText = "";
            // Il formato è un array di array, con il testo tradotto nel primo elemento di ogni subarray
            for (let i = 0; i < data[0].length; i++) {
              if (data[0][i][0]) {
                translatedText += data[0][i][0];
              }
            }

            console.log(`Traduzione completata: "${translatedText.substring(0, 30)}..."`);
            resolve(translatedText);
          } else {
            reject(new Error("Formato risposta traduzione non valido"));
          }
        })
        .catch((error) => {
          console.error("Errore nella traduzione:", error);
          reject(error);
        });
    });
  }

  //#endregion FUNZIONE 8: traduzione dei sottotitoli

  //#region FUNZIONE 9: Aggiunta punteggiatura ai sottotitoli

  /**
   * Sistema di punteggiatura e chunking per migliorare la sintesi vocale
   * Adattato dalle librerie TTS di Google per ottimizzare la lettura dei sottotitoli
   */

  //#region Punteggiatura e divisione testo

  /**
   * Punteggiatore per lingue latine
   * Gestisce correttamente la punteggiatura in inglese, italiano, francese, spagnolo, tedesco, ecc.
   */
  function LatinPunctuator() {
    this.getParagraphs = function (text) {
      return recombine(text.split(/((?:\r?\n\s*){2,})/));
    };

    this.getSentences = function (text) {
      return recombine(
        text.split(/([.!?]+[\s\u200b]+)/),
        /\b(\w|[A-Z][a-z]|Assn|Ave|Capt|Col|Comdr|Corp|Cpl|Gen|Gov|Hon|Inc|Lieut|Ltd|Rev|Univ|Jan|Feb|Mar|Apr|Aug|Sept|Oct|Nov|Dec|dept|ed|est|vol|vs)\.\s+$/
      );
    };

    this.getPhrases = function (sentence) {
      return recombine(sentence.split(/([,;:]\s+|\s-+\s+|—\s*)/));
    };

    this.getWords = function (sentence) {
      var tokens = sentence.trim().split(/([~@#%^*_+=<>]|[\s\-—/]+|\.(?=\w{2,})|,(?=[0-9]))/);
      var result = [];
      for (var i = 0; i < tokens.length; i += 2) {
        if (tokens[i]) result.push(tokens[i]);
        if (i + 1 < tokens.length) {
          if (/^[~@#%^*_+=<>]$/.test(tokens[i + 1])) result.push(tokens[i + 1]);
          else if (result.length) result[result.length - 1] += tokens[i + 1];
        }
      }
      return result;
    };

    function recombine(tokens, nonPunc) {
      var result = [];
      for (var i = 0; i < tokens.length; i += 2) {
        var part = i + 1 < tokens.length ? tokens[i] + tokens[i + 1] : tokens[i];
        if (part) {
          if (nonPunc && result.length && nonPunc.test(result[result.length - 1])) result[result.length - 1] += part;
          else result.push(part);
        }
      }
      return result;
    }
  }

  /**
   * Punteggiatore per lingue dell'est asiatico
   * Gestisce correttamente cinese, giapponese, coreano
   */
  function EastAsianPunctuator() {
    this.getParagraphs = function (text) {
      return recombine(text.split(/((?:\r?\n\s*){2,})/));
    };

    this.getSentences = function (text) {
      return recombine(text.split(/([.!?]+[\s\u200b]+|[\u3002\uff01]+)/));
    };

    this.getPhrases = function (sentence) {
      return recombine(sentence.split(/([,;:]\s+|[\u2025\u2026\u3000\u3001\uff0c\uff1b]+)/));
    };

    this.getWords = function (sentence) {
      return sentence.replace(/\s+/g, "").split("");
    };

    function recombine(tokens) {
      var result = [];
      for (var i = 0; i < tokens.length; i += 2) {
        if (i + 1 < tokens.length) result.push(tokens[i] + tokens[i + 1]);
        else if (tokens[i]) result.push(tokens[i]);
      }
      return result;
    }
  }

  /**
   * Suddivisore basato su numero di parole
   * Utile per lingue latine e altre che usano spazi per separare le parole
   */
  function WordBreaker(wordLimit, punctuator) {
    this.breakText = breakText;

    function breakText(text) {
      return punctuator.getParagraphs(text).flatMap(breakParagraph);
    }

    function breakParagraph(text) {
      return punctuator.getSentences(text).flatMap(breakSentence);
    }

    function breakSentence(sentence) {
      return merge(punctuator.getPhrases(sentence), breakPhrase);
    }

    function breakPhrase(phrase) {
      var words = punctuator.getWords(phrase);
      var splitPoint = Math.min(Math.ceil(words.length / 2), wordLimit);
      var result = [];
      while (words.length) {
        result.push(words.slice(0, splitPoint).join(""));
        words = words.slice(splitPoint);
      }
      return result;
    }

    function merge(parts, breakPart) {
      var result = [];
      var group = { parts: [], wordCount: 0 };
      var flush = function () {
        if (group.parts.length) {
          result.push(group.parts.join(""));
          group = { parts: [], wordCount: 0 };
        }
      };

      parts.forEach(function (part) {
        var wordCount = punctuator.getWords(part).length;
        if (wordCount > wordLimit) {
          flush();
          var subParts = breakPart(part);
          for (var i = 0; i < subParts.length; i++) result.push(subParts[i]);
        } else {
          if (group.wordCount + wordCount > wordLimit) flush();
          group.parts.push(part);
          group.wordCount += wordCount;
        }
      });

      flush();
      return result;
    }
  }

  /**
   * Suddivisore basato su numero di caratteri
   * Utile per tutte le lingue, particolarmente per quelle asiatiche
   */
  function CharBreaker(charLimit, punctuator, paragraphCombineThreshold) {
    this.breakText = breakText;

    function breakText(text) {
      return merge(punctuator.getParagraphs(text), breakParagraph, paragraphCombineThreshold);
    }

    function breakParagraph(text) {
      return merge(punctuator.getSentences(text), breakSentence);
    }

    function breakSentence(sentence) {
      return merge(punctuator.getPhrases(sentence), breakPhrase);
    }

    function breakPhrase(phrase) {
      return merge(punctuator.getWords(phrase), breakWord);
    }

    function breakWord(word) {
      var result = [];
      while (word) {
        result.push(word.slice(0, charLimit));
        word = word.slice(charLimit);
      }
      return result;
    }

    function merge(parts, breakPart, combineThreshold) {
      var result = [];
      var group = { parts: [], charCount: 0 };
      var flush = function () {
        if (group.parts.length) {
          result.push(group.parts.join(""));
          group = { parts: [], charCount: 0 };
        }
      };

      parts.forEach(function (part) {
        var charCount = part.length;
        if (charCount > charLimit) {
          flush();
          var subParts = breakPart(part);
          for (var i = 0; i < subParts.length; i++) result.push(subParts[i]);
        } else {
          if (group.charCount + charCount > (combineThreshold || charLimit)) flush();
          group.parts.push(part);
          group.charCount += charCount;
        }
      });

      flush();
      return result;
    }
  }

  //#endregion

  //#region Funzioni di supporto

  /**
   * Determina se un testo è in una lingua dell'est asiatico
   * @param {string} lang - Codice lingua (es. 'en', 'zh-CN')
   * @returns {boolean} - True se è una lingua est asiatica
   */
  function isEastAsianLanguage(lang) {
    return /^zh|ko|ja/.test(lang);
  }

  /**
   * Suddivide il testo in chunk ottimizzati per la sintesi vocale
   * @param {string} text - Testo completo da suddividere
   * @param {string} lang - Codice lingua (es. 'en', 'it', 'zh-CN')
   * @param {number} [maxChunkSize=150] - Dimensione massima di un chunk in caratteri o parole
   * @returns {string[]} - Array di chunk di testo pronti per la sintesi vocale
   */
  function getOptimizedChunks(text, lang, maxChunkSize) {
    // Scegli il punteggiatore in base alla lingua
    const isEA = isEastAsianLanguage(lang);
    const punctuator = isEA ? new EastAsianPunctuator() : new LatinPunctuator();

    // Determina il limite appropriato in base alla lingua
    const wordLimit = Math.floor((/^(de|ru|es|pt|id)/.test(lang) ? 28 : 32) * (isEA ? 1.5 : 1));
    const charLimit = isEA ? 100 : 120;

    // Scegli il breaker appropriato
    if (isEA) {
      // Per lingue est asiatiche, utilizza CharBreaker
      return new CharBreaker(maxChunkSize || charLimit, punctuator).breakText(text);
    } else {
      // Per lingue occidentali, utilizza WordBreaker
      return new WordBreaker(maxChunkSize || wordLimit, punctuator).breakText(text);
    }
  }

  //#endregion

  //#region Integrazioni TTS

  /**
   * Versione migliorata della funzione speakText che usa chunking intelligente
   * per evitare errori TTS con testi lunghi
   */
  function enhancedSpeakText(text, options) {
    return new Promise((resolve, reject) => {
      if (!text) {
        resolve();
        return;
      }

      // Usa il sistema avanzato di chunking
      const chunks = getChunksForTts(text, options);
      console.log(`Testo suddiviso in ${chunks.length} chunk ottimizzati`);

      // Se il testo è molto lungo, mostra quanti caratteri stiamo processando
      if (text.length > 500) {
        console.log(`Elaborazione di ${text.length} caratteri totali`);
      }

      // Funzione per leggere un chunk alla volta
      function speakNextChunk(index) {
        if (index >= chunks.length) {
          console.log("Lettura completata di tutti i chunk");
          resolve();
          return;
        }

        const chunk = chunks[index];
        console.log(`Lettura chunk ${index + 1}/${chunks.length}: "${chunk.substring(0, 50)}${chunk.length > 50 ? "..." : ""}" (${chunk.length} caratteri)`);

        // Pulisci eventuali letture precedenti se è il primo chunk
        if (index === 0) {
          speechSynth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice ? preferredVoice.lang : options.lang || "it-IT";
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        utterance.onend = function () {
          // Aggiungi una breve pausa tra i chunk per evitare sovraccarichi dell'API
          setTimeout(() => {
            speakNextChunk(index + 1);
          }, 250); // 250ms di pausa tra i chunk
        };

        utterance.onerror = function (event) {
          console.error(`Errore TTS nel chunk ${index + 1}:`, event);
          // Continua con il prossimo chunk anche in caso di errore
          setTimeout(() => {
            speakNextChunk(index + 1);
          }, 500); // Pausa più lunga dopo un errore
        };

        speechSynth.speak(utterance);
      }

      // Inizia con il primo chunk
      speakNextChunk(0);
    });
  }

  /**
   * Sostituzione della funzione speakText con la versione migliorata
   * (sostituisce la funzione esistente)
   */
  function replaceOriginalSpeakText() {
    // Salva un riferimento alla funzione originale
    const originalSpeakText = window.speakText;

    // Sostituisci con la versione migliorata
    window.speakText = function (text) {
      return enhancedSpeakText(text, {
        lang: preferredVoice ? preferredVoice.lang : "it-IT",
        rate: speechRate,
        pitch: 1.0,
        volume: 1.0,
      });
    };

    console.log("Funzione speakText sostituita con versione ottimizzata per chunking");
  }

  //#endregion

  //#endregion FUNZIONE 9: Aggiunta punteggiatura ai sottotitoli

  //#region FUNZIONE 11: Uso IA

  // Funzione per costruire il prompt completo
  function buildGroqPrompt(subtitles) {
    // Converti i sottotitoli in formato JSON
    const subtitlesJson = JSON.stringify(subtitles, null, 2);

    // Concatena il prompt base con i sottotitoli
    return groqPrompt + subtitlesJson;
  }

  /**
   * Versione aggiornata di callGroqApi che usa optimizeGroqPrompt
   * @param {string} apiKey - Chiave API di Groq
   * @param {Array} subtitles - Array di oggetti sottotitolo
   * @param {string} model - Modello Groq da utilizzare
   * @returns {Promise<Object>} - Promise che si risolve nell'oggetto di risposta di Groq
   */
  async function callGroqApi(apiKey, subtitles, model = "llama-3.1-8b-instant") {
    console.log("Chiamata API Groq in corso...", {
      subtitlesCount: subtitles.length,
      modelUsed: model,
      firstSubtitle: subtitles[0],
      lastSubtitle: subtitles[subtitles.length - 1],
    });

    try {
      // Verifica se il modello richiesto è tra quelli disponibili
      // e seleziona un'alternativa se necessario
      const modelToUse = findAvailableModel(model);

      if (modelToUse !== model) {
        console.log(`Modello originale ${model} sostituito con ${modelToUse}`);
      }

      // MODIFICA: Usiamo la funzione di ottimizzazione del prompt
      // invece di riscrivere il prompt da zero
      const optimizedPromptText = optimizeGroqPrompt(groqPrompt, subtitles);

      // Corpo della richiesta
      const requestBody = {
        model: modelToUse,
        messages: [
          {
            role: "user",
            content: optimizedPromptText,
          },
        ],
        temperature: 0.5,
        max_tokens: 4000,
      };

      console.log("Invio richiesta a Groq con body:", JSON.stringify(requestBody).substring(0, 200) + "...");

      // Esegui la richiesta all'API di Groq
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Risposta ricevuta, status:", response.status);

      // Il resto della funzione rimane invariato
      // ...
    } catch (error) {
      console.error("Errore durante la chiamata API Groq:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Testa se l'API key di Groq è valida
   * @param {string} apiKey - API key da testare
   * @returns {Promise<boolean>} - Promise che si risolve in true se valida, false altrimenti
   */
  async function testGroqApiKey(apiKey) {
    console.log("Test API key Groq in corso...");

    if (!apiKey) {
      console.warn("Nessuna API key fornita per il test");
      return false;
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      console.log("Risposta test API key:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Modelli disponibili:", data.data.length);
        return true;
      }

      if (response.status === 401 || response.status === 403) {
        console.warn("API key non valida (401/403)");
        return false;
      }

      const errorData = await response.json();
      console.error("Errore test API Groq:", errorData);
      return false;
    } catch (error) {
      console.error("Errore durante il test dell'API Groq:", error);
      return false;
    }
  }

  /**
   * Funzione per aggiornare il selettore dei modelli nell'interfaccia
   * Rimuove i modelli non più disponibili e aggiunge quelli nuovi
   */
  function updateAIModelSelector() {
    const aiModelSelector = document.getElementById("ai-model-selector");
    if (!aiModelSelector) return;

    console.log("Aggiornamento selettore modelli AI...");

    // Rimuovi tutte le opzioni esistenti
    while (aiModelSelector.firstChild) {
      aiModelSelector.removeChild(aiModelSelector.firstChild);
    }

    // Aggiungi le opzioni dei modelli disponibili
    AVAILABLE_GROQ_MODELS.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.name;
      aiModelSelector.appendChild(option);
    });

    console.log("Selettore modelli AI aggiornato con", AVAILABLE_GROQ_MODELS.length, "modelli");
  }

  /**
   * Crea una versione ottimizzata del prompt Groq
   * Mantiene gli esempi ma rimuove dettagli meno essenziali
   * @param {string} originalPrompt - Il prompt originale completo
   * @param {Array} subtitles - I sottotitoli da elaborare
   * @returns {string} - Il prompt ottimizzato
   */
  function optimizeGroqPrompt(originalPrompt, subtitles) {
    console.log("Ottimizzazione prompt Groq per ridurre token...");

    // Se il prompt non è troppo lungo o i sottotitoli sono pochi, usa il prompt originale
    const subtitlesJson = JSON.stringify(subtitles, null, 2);
    const completePrompt = originalPrompt + subtitlesJson;

    if (completePrompt.length < 5000 || subtitles.length <= 20) {
      console.log("Prompt originale utilizzato (dimensione accettabile)");
      return completePrompt;
    }

    // Creazione versione ottimizzata del prompt
    // ... estrai le parti essenziali del prompt originale ...

    // Estrai parti fondamentali (obiettivi, formato output, esempi)
    // ...

    // Versione semplificata del prompt con le parti essenziali
    let optimizedPrompt = "Sei un esperto nell'elaborazione di sottotitoli. Ti fornisco sottotitoli di YouTube.\n\n";
    optimizedPrompt += "OBIETTIVI: Unire frasi frammentate, aggiungere punteggiatura, correggere errori.\n\n";
    optimizedPrompt += "FORMATO OUTPUT: JSON con sottotitoli migliorati e timing recalcolati.\n\n";
    optimizedPrompt += "Ecco i sottotitoli da elaborare:\n" + subtitlesJson;

    console.log(`Prompt ottimizzato: ridotto da ${completePrompt.length} a ${optimizedPrompt.length} caratteri`);
    return optimizedPrompt;
  }

  /**
   * Elabora sottotitoli con Groq per traduzione e miglioramento
   * @param {Array} subtitles - Array di oggetti sottotitolo originali
   * @param {Object} settings - Impostazioni (apiKey, modello, lingue)
   * @returns {Promise<Array>} - Sottotitoli migliorati
   */
  async function processSubtitlesWithGroq(subtitles, settings) {
    console.log("Elaborazione sottotitoli con Groq:", {
      subtitlesCount: subtitles.length,
      sourceLang: settings.sourceLang || "auto",
      targetLang: settings.targetLang || "it",
      model: settings.aiModel || "llama-3.1-8b-instant",
    });

    try {
      // Verifica API key
      if (!settings.groqApiKey) {
        throw new Error("API key Groq mancante");
      }

      // Mostra indicatore di elaborazione
      showProcessingIndicator(true, "Elaborazione sottotitoli con IA...");

      // Aggiungi marcatori [PAUSE] ai sottotitoli
      const subtitlesWithPauses = addPauseMarkersToSubtitles(subtitles);

      // Dividi in blocchi per rispettare i limiti di token
      const subtitleChunks = chunkSubtitles(subtitlesWithPauses, 40);
      let allImprovedSubtitles = [];
      let totalProcessed = 0;

      // Processa ogni blocco separatamente
      for (let i = 0; i < subtitleChunks.length; i++) {
        const chunk = subtitleChunks[i];
        showProcessingIndicator(true, `Elaborazione blocco ${i + 1}/${subtitleChunks.length} (${totalProcessed} di ${subtitles.length})`);

        try {
          // Chiama Groq API
          const response = await callGroqApiWithTranslation(
            settings.groqApiKey,
            chunk,
            settings.aiModel || "llama-3.1-8b-instant",
            settings.sourceLang || "auto",
            settings.targetLang || "it"
          );

          if (!response.success) {
            throw new Error(response.message || "Errore sconosciuto");
          }

          // Estrai i sottotitoli migliorati e aggiungili al risultato
          const improvedSubtitles = response.data.improved_subtitles || [];
          allImprovedSubtitles = allImprovedSubtitles.concat(improvedSubtitles);
          totalProcessed += chunk.length;
        } catch (error) {
          console.error(`Errore nel blocco ${i + 1}:`, error);

          // Fallback ai sottotitoli originali per questo blocco
          const fallbackSubtitles = chunk.map((sub, idx) => ({
            start: sub.start,
            text: sub.text.replace(/\s*\[PAUSE\]\s*$/, ""), // Rimuovi marcatore [PAUSE]
            estimated_duration: estimateReadingTime(sub.text),
            end: idx < chunk.length - 1 ? chunk[idx + 1].start : sub.start + estimateReadingTime(sub.text),
            original_indices: [totalProcessed + idx],
          }));

          allImprovedSubtitles = allImprovedSubtitles.concat(fallbackSubtitles);
          totalProcessed += chunk.length;
        }

        // Pausa tra le chiamate API
        if (i < subtitleChunks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Ordina i sottotitoli per tempo
      allImprovedSubtitles.sort((a, b) => a.start - b.start);

      // Converti nel formato utilizzato dall'applicazione
      const convertedSubtitles = allImprovedSubtitles.map((sub) => ({
        start: sub.start,
        text: sub.text,
        isImproved: true,
        estimatedDuration: sub.estimated_duration,
        originalIndices: sub.original_indices,
      }));

      showProcessingIndicator(false);
      return convertedSubtitles;
    } catch (error) {
      console.error("Errore durante l'elaborazione con Groq:", error);
      showProcessingIndicator(false);
      throw error;
    }
  }

  /**
   * Chiamata all'API Groq per elaborazione sottotitoli
   * @param {string} apiKey - API key Groq
   * @param {Array} subtitles - Sottotitoli da elaborare
   * @param {string} model - Modello AI da utilizzare
   * @param {string} sourceLang - Lingua sorgente
   * @param {string} targetLang - Lingua target
   * @returns {Promise<Object>} - Risposta elaborata
   */
  async function callGroqApiWithTranslation(apiKey, subtitles, model, sourceLang, targetLang) {
    try {
      // Verifica modello disponibile
      const modelToUse = findAvailableModel(model);

      // Prepara il prompt
      const promptText = groqPromptYouTube.replace("{sourceLang}", sourceLang).replace("{targetLang}", targetLang);

      const completePrompt = promptText + JSON.stringify(subtitles, null, 2);

      // Configurazione richiesta
      const requestBody = {
        model: modelToUse,
        messages: [
          {
            role: "user",
            content: completePrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      };

      console.log(`Invio richiesta a Groq (modello: ${modelToUse})`);

      // Esegui la richiesta
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore API Groq (${response.status}): ${errorText}`);
      }

      // Estrai e processa la risposta
      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Risposta API Groq malformattata");
      }

      // Estrai solo la parte JSON dalla risposta
      const resultContent = data.choices[0].message.content;
      let jsonData;

      try {
        const jsonMatch = resultContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Nessun JSON trovato nella risposta");
        }
      } catch (parseError) {
        console.error("Errore parsing JSON:", parseError);
        throw new Error("Impossibile interpretare la risposta come JSON");
      }

      return {
        success: true,
        data: jsonData,
        model: modelToUse,
      };
    } catch (error) {
      console.error("Errore chiamata API Groq:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Suddivide i sottotitoli in blocchi per rispettare i limiti API
   * @param {Array} subtitles - Sottotitoli da suddividere
   * @param {number} maxChunkSize - Dimensione massima per blocco
   * @returns {Array} - Array di blocchi di sottotitoli
   */
  function chunkSubtitles(subtitles, maxChunkSize = 40) {
    if (!subtitles || !subtitles.length) return [];

    const chunks = [];
    for (let i = 0; i < subtitles.length; i += maxChunkSize) {
      chunks.push(subtitles.slice(i, i + maxChunkSize));
    }

    return chunks;
  }

  /**
   * Verifica la disponibilità di un modello e trova alternative se necessario
   * @param {string} modelId - ID del modello richiesto
   * @returns {string} - ID del modello disponibile
   */
  function findAvailableModel(modelId) {
    // Verifica se il modello richiesto è nella lista dei disponibili
    const isAvailable = AVAILABLE_GROQ_MODELS.some((model) => model.id === modelId);

    if (isAvailable) {
      return modelId;
    }

    // Se non disponibile, usa un'alternativa
    console.warn(`Modello ${modelId} non disponibile, seleziono alternativa...`);

    // Preferisci modelli più leggeri e veloci come default
    const defaultModel = AVAILABLE_GROQ_MODELS.find((model) => model.id === "llama-3.1-8b-instant" || model.id === "gemma-7b-it") || AVAILABLE_GROQ_MODELS[0];

    return defaultModel.id;
  }

  /**
   * Mostra o nasconde indicatore di elaborazione
   * @param {boolean} show - Se mostrare l'indicatore
   * @param {string} message - Messaggio da mostrare
   */
  function showProcessingIndicator(show, message = "Elaborazione in corso...") {
    const button = document.getElementById("subtitle-reader-btn");

    if (!button) return;

    if (show) {
      button._originalText = button.textContent;

      // Rimuovi contenuto esistente
      while (button.firstChild) {
        button.removeChild(button.firstChild);
      }

      // Aggiungi testo e spinner
      const textNode = document.createTextNode(message);
      button.appendChild(textNode);

      const spinner = document.createElement("div");
      spinner.className = "spinner";
      button.appendChild(spinner);
      button.disabled = true;
    } else {
      // Ripristina stato originale
      if (button._originalText) {
        while (button.firstChild) {
          button.removeChild(button.firstChild);
        }

        const textNode = document.createTextNode(button._originalText);
        button.appendChild(textNode);
        delete button._originalText;
      } else {
        button.textContent = "Leggi Sottotitoli";
      }

      button.disabled = false;
    }
  }

  //#endregion FUNZIONE 11: Uso IA

  //#region FUNZIONE 12: Inizializzazione e osservazione URL

  // Inizializzazione dello script
  function init() {
    console.log("Inizializzazione YouTube Subtitle Reader con TTS");

    // AGGIUNGI QUI: Sostituisci la funzione speakText con la versione migliorata
    replaceOriginalSpeakText();

    // Carica le voci TTS in background
    initSpeechSynthesis()
      .then((voice) => {
        console.log("TTS inizializzato con successo, voce selezionata:", voice.name);
      })
      .catch((error) => {
        console.warn("Inizializzazione TTS fallita:", error);
        console.log("La sintesi vocale verrà inizializzata al primo utilizzo");
      });

    // Osserva i cambiamenti nell'URL per gestire la navigazione SPA
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;

        // Reimposta tutto quando cambia l'URL
        capturedSubtitles = "";
        capturedSubtitleEntries = [];
        isReadingActive = false;
        lastReadIndex = -1;

        // Interrompi la lettura se in corso
        if (speechSynth) {
          speechSynth.cancel();
        }

        // Controlla se siamo in una pagina video e aggiungi il pulsante
        if (location.href.includes("/watch?v=")) {
          setTimeout(addSplitButton, 1500);
        }
      }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Aggiungi il pulsante se siamo già in una pagina video
    if (location.href.includes("/watch?v=")) {
      setTimeout(addSplitButton, 1500);
    }
  }

  function initEnhanced() {
    console.log("Inizializzazione YouTube Subtitle Reader con TTS e supporto AI");

    // AGGIUNGI QUI: Sostituisci la funzione speakText con la versione migliorata
    replaceOriginalSpeakText();

    // Carica le voci TTS in background
    initSpeechSynthesis()
      .then((voice) => {
        console.log("TTS inizializzato con successo, voce selezionata:", voice.name);
      })
      .catch((error) => {
        console.warn("Inizializzazione TTS fallita:", error);
        console.log("La sintesi vocale verrà inizializzata al primo utilizzo");
      });

    // Osserva i cambiamenti nell'URL per gestire la navigazione SPA
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;

        // Reimposta tutto quando cambia l'URL
        capturedSubtitles = "";
        capturedSubtitleEntries = [];
        isReadingActive = false;
        lastReadIndex = -1;

        // Interrompi la lettura se in corso
        if (speechSynth) {
          speechSynth.cancel();
        }

        // Controlla se siamo in una pagina video e aggiungi il pulsante
        if (location.href.includes("/watch?v=")) {
          setTimeout(addSplitButton, 1500);
        }
      }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Aggiungi il pulsante se siamo già in una pagina video
    if (location.href.includes("/watch?v=")) {
      setTimeout(addSplitButton, 1500);
    }

    // IMPORTANTE: Sostituisci le funzioni originali con le versioni migliorate
    // Questo avviene qui per garantire che le funzioni originali esistano prima di essere sostituite
    window.buttonPress = buttonPressEnhanced;
    window.createSettingsPanel = createSettingsPanelEnhanced;

    console.log("Inizializzazione completata, funzioni migliorate caricate");
  }

  // Avvia lo script quando il documento è pronto
  if (document.readyState === "complete") {
    initEnhanced();
  } else {
    window.addEventListener("load", initEnhanced);
  }
  //#endregion FUNZIONE 12: Inizializzazione e osservazione URL
})();