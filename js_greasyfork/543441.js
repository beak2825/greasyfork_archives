// ==UserScript==
// @name         JanitorAI - Text to Speech - Built-in/ElevenLabs/GeminiTTS
// @namespace    http://tampermonkey.net/
// @version      3.9.5
// @license      MIT
// @description  Text to Speech (TTS) integration for JanitorAI using built-in voices, ElevenLabs TTS, and Gemini TTS with emotion analysis and audio segmentation.
// @author       Zephyr (xzeph__ on Discord)
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.elevenlabs.io
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/543441/JanitorAI%20-%20Text%20to%20Speech%20-%20Built-inElevenLabsGeminiTTS.user.js
// @updateURL https://update.greasyfork.org/scripts/543441/JanitorAI%20-%20Text%20to%20Speech%20-%20Built-inElevenLabsGeminiTTS.meta.js
// ==/UserScript==

// ==========================================================
// SECCIÓN A. UTILIDADES DE AUDIO (globales, antes del userscript)
// ----------------------------------------------------------
// - Inicializa/recupera AudioContext para ElevenLabs
// - Decodifica ArrayBuffer a AudioBuffer
// - Convierte AudioBuffer a WAV Blob
// - Convierte base64 a ArrayBuffer
// - Despacha evento con AudioBuffer decodificado
// - Logs para depurar AudioBuffer
// ==========================================================

// --- ElevenLabs TTS AudioContext and AudioBuffer integration ---
let elevenLabsAudioContext = null;

function getElevenLabsAudioContext() {
    if (!elevenLabsAudioContext) {
        elevenLabsAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return elevenLabsAudioContext;
}

function decodeTTSArrayBuffer(arrayBuffer) {
    try {
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error("ArrayBuffer is empty or null");
        }
        const audioContext = getElevenLabsAudioContext();
        return audioContext.decodeAudioData(arrayBuffer.slice(0));
    } catch (error) {
        console.error("❌ Failed to decode ArrayBuffer to AudioBuffer:", error);
        throw new Error(`decodeTTSArrayBuffer failed: ${error.message}`);
    }
}

function dispatchTTSDecodedAudio(audioBuffer, playbackRate = 1.0, alignment) {
    const event = new CustomEvent('ElevenLabsTTSDecodedAudio', {
        detail: { audioBuffer, playbackRate, alignment }
    });
    window.dispatchEvent(event);
}

function logAudioBuffer(audioBuffer) {
    if (!(audioBuffer instanceof AudioBuffer)) {
        console.error('Provided object is not an AudioBuffer');
        return;
    }
    console.log('AudioBuffer Info:');
    console.log('Sample Rate:', audioBuffer.sampleRate);
    console.log('Number of Channels:', audioBuffer.numberOfChannels);
    console.log('Length (frames):', audioBuffer.length);
    console.log('Duration (seconds):', audioBuffer.duration);
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        console.log(`Channel ${i} Data:`, audioBuffer.getChannelData(i));
    }
}

function base64ToArrayBuffer(base64) {
    try {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    } catch (error) {
        console.error("❌ Failed to decode base64 to ArrayBuffer:", error);
        throw new Error(`base64ToArrayBuffer failed: ${error.message}`);
    }
}

// Convierte un AudioBuffer a Blob WAV (para segmentación/exportación)
function bufferToWave(abuffer) {
    try {
        if (!abuffer || !(abuffer instanceof AudioBuffer)) {
            throw new Error("Invalid AudioBuffer provided");
        }

        let numOfChan = abuffer.numberOfChannels,
            length = abuffer.length * numOfChan * 2 + 44,
            buffer = new ArrayBuffer(length),
            view = new DataView(buffer),
            channels = [], i, sample,
            offset = 0,
            pos = 0;

        // WAVE header
        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8); // file length - 8
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt "
        setUint32(16); // length = 16
        setUint16(1); // PCM
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan);
        setUint16(numOfChan * 2);
        setUint16(16); // 16-bit
        setUint32(0x61746164); // "data"
        setUint32(length - pos - 4);

        // Datos intercalados
        for (i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // 16-bit
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return new Blob([buffer], { type: "audio/wav" });

        function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
        function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
    } catch (error) {
        console.error("❌ Failed to convert AudioBuffer to WAV:", error);
        throw new Error(`bufferToWave failed: ${error.message}`);
    }
}

// Simple PCM16 mono -> WAV helper for Gemini TTS
function createWavFromPCM(pcmBuffer, rate = 24000, ch = 1, bits = 16) {
  const pcmBytes = pcmBuffer.byteLength;
  const blockAlign = ch * bits / 8;
  const byteRate = rate * blockAlign;
  const wav = new ArrayBuffer(44 + pcmBytes);
  const view = new DataView(wav);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmBytes, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, ch, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bits, true);
  writeString(36, 'data');
  view.setUint32(40, pcmBytes, true);

  new Uint8Array(wav).set(new Uint8Array(pcmBuffer), 44);
  return wav;
}

(function () {
  "use strict";

  // ==========================================================
  // SECCIÓN 0. ESTADO GLOBAL, RESET DE AJUSTES Y CONSTANTES
  // ----------------------------------------------------------
  // - Resetea formato viejo de settings si aplica
  // - Define selectores y flags comunes
  // ==========================================================

  // Reset de settings legacy
  try {
    const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    if (settings.hasOwnProperty('charVoice') || settings.hasOwnProperty('userVoice')) {
      console.log('TTS Userscript: Detected old voice setting format. Resetting to defaults.');
      localStorage.removeItem("ttsSettings");
    }
  } catch (e) {
    console.error("TTS Userscript: Could not parse settings, resetting to default.", e);
    localStorage.removeItem("ttsSettings");
  }

  // Selectores de chat/control
  const CHAT_CONTAINER_SELECTOR = '[class^="_messagesMain_"]';
  const MESSAGE_CONTAINER_SELECTOR = '[data-testid="virtuoso-item-list"] > div[data-index]';
  const BOT_NAME_ICON_SELECTOR = '[class^="_nameIcon_"]';
  const LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR = '[class^="_botChoicesContainer_"]';
  const SWIPE_SLIDER_SELECTOR = '[class^="_botChoicesSlider_"]';
  const MESSAGE_WRAPPER_SELECTOR = 'li[class^="_messageDisplayWrapper_"]';
  const MESSAGE_BODY_SELECTOR = '[class^="_messageBody_"]';
  const NAME_CONTAINER_SELECTOR = '[class^="_nameContainer_"]';
  const EDIT_PANEL_SELECTOR = '[class^="_editPanel_"]';
  const CONTROL_PANEL_SELECTOR = '[class^="_controlPanel_"]';
  const BOT_NAME_SELECTOR = '[class^="_nameText_"]';

  // Estado de último log y comunicación con Live2D
  let lastLoggedText = "";
  let lastLoggedStatus = "";
  let lastLoggedSwipeIndex = -1;
  let lastLoggedMessageIndex = -1;
  let live2dScriptDetected = false;

  // ==========================================================
  // SECCIÓN 0.5. CONSTANTES Y FUNCIONES DE GEMINI
  // ----------------------------------------------------------
  // - API key y endpoint de Gemini
  // - Lista de emociones soportadas
  // - Función para analizar texto con Gemini
  // - Función para calcular tiempos de segmentos según emoción
  // ==========================================================

  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Reemplaza con tu clave real
  const GEMINI_MODEL = "gemini-2.5-flash";
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const EMOTION_LIST = [
    "Admiration", "Amusement", "Anger", "Annoyance", "Approval", "Caring", "Confusion",
    "Curiosity", "Desire", "Disappointment", "Disapproval", "Disgust", "Embarrassment",
    "Excitement", "Fear", "Gratitude", "Joy", "Love", "Nervousness", "Neutral",
    "Optimism", "Pride", "Realization", "Relief", "Remorse", "Sadness", "Surprise"
  ];

  async function analyzeTextWithGemini(text) {
    console.log("🤖 Sending text to Gemini for emotion and action analysis...");

    // Construir lista de acciones disponibles para el prompt
    const actionsListText = availableActions.length > 0
      ? availableActions.join(", ")
      : "No actions available";

    const prompt = `You are a text analyzer that MUST preserve EVERY SINGLE CHARACTER from the input.

ABSOLUTE REQUIREMENTS - FAILURE TO COMPLY WILL BREAK THE SYSTEM:

1. CHARACTER PRESERVATION (CRITICAL):
   ✓ Keep EVERY letter (A-Z, a-z)
   ✓ Keep EVERY number (0-9)
   ✓ Keep EVERY punctuation mark (. , ! ? ; : - ' " etc.)
   ✓ Keep EVERY space character (leading, trailing, between words)
   ✓ Keep EVERY special symbol (@ # $ % & * + = etc.)
   ✓ Keep EVERY bracket/parenthesis ( ) [ ] { }
   ✓ Keep EVERY newline character (\\n)
   ✓ Keep EVERY asterisk (*) for actions
   ✓ Keep EVERY quotation mark (" ')
   ✓ Do NOT add, remove, or modify ANY character
   ✓ Do NOT trim whitespace
   ✓ Do NOT normalize text
   ✓ Do NOT fix typos or grammar

2. SEGMENT SPLITTING RULES:
   ✓ Split text ONLY when there is a SIGNIFICANT change in emotion or a physical action occurs
   ✓ BE REALISTIC: Most dialogue doesn't need many segments - only split when truly necessary
   ✓ MERGE CONSECUTIVE SEGMENTS: If two or more segments have the SAME emotion AND the SAME action (or both null), MERGE them into ONE segment
   ✓ Each segment's "text" must contain a COMPLETE, UNBROKEN portion of the original
   ✓ DO NOT cut words in half
   ✓ DO NOT break sentences mid-word
   ✓ Include complete phrases with their surrounding spaces
   ✓ When concatenating all segment "text" fields, the result MUST be IDENTICAL to the input
   ✓ QUALITY OVER QUANTITY: Fewer, meaningful segments are better than many unnecessary ones

3. MERGING EXAMPLES:
   ❌ BAD (too many segments):
   [
     {"emotion": "Joy", "action": null, "text": "Hi there! "},
     {"emotion": "Joy", "action": null, "text": "I'm so happy to see you! "},
     {"emotion": "Joy", "action": null, "text": "How are you?"}
   ]

   ✅ GOOD (merged):
   [
     {"emotion": "Joy", "action": null, "text": "Hi there! I'm so happy to see you! How are you?"}
   ]

   ❌ BAD (unnecessary split):
   [
     {"emotion": "Neutral", "action": null, "text": "I went to the "},
     {"emotion": "Neutral", "action": null, "text": "store yesterday."}
   ]

   ✅ GOOD (kept together):
   [
     {"emotion": "Neutral", "action": null, "text": "I went to the store yesterday."}
   ]

4. VALIDATION CHECK:
   Before responding, verify: input_text == segment[0].text + segment[1].text + ... + segment[n].text
   If they don't match EXACTLY, you have failed.

RESPONSE FORMAT (JSON only, no other text):
[
  {"emotion": "EmotionName", "action": "ActionName or null", "text": "exact text from input"},
  ...
]

EMOTION LIST (choose from): ${EMOTION_LIST.join(", ")}

ACTION LIST (choose from or use null): ${actionsListText}

EXAMPLE 1 (Simple, one segment):
Input: "Hi there! How are you today?"
Output:
[
  {"emotion": "Joy", "action": null, "text": "Hi there! How are you today?"}
]

EXAMPLE 2 (With action):
Input: "Hi there! *waves enthusiastically* How are you today?"
Output:
[
  {"emotion": "Joy", "action": null, "text": "Hi there! "},
  {"emotion": "Joy", "action": "Wave hand", "text": "*waves enthusiastically* "},
  {"emotion": "Curiosity", "action": null, "text": "How are you today?"}
]

EXAMPLE 3 (Emotion change):
Input: "I'm so happy! Wait... what's that noise? Oh no!"
Output:
[
  {"emotion": "Joy", "action": null, "text": "I'm so happy! "},
  {"emotion": "Curiosity", "action": null, "text": "Wait... what's that noise? "},
  {"emotion": "Fear", "action": null, "text": "Oh no!"}
]

IMPORTANT NOTES:
- Notice that ALL spaces, punctuation, and characters are preserved EXACTLY
- Each segment text is COMPLETE and UNBROKEN
- Segments are MERGED when they share the same emotion and action
- Only split when there's a REAL, SIGNIFICANT change
- Concatenating all segments MUST equal the original input EXACTLY

INPUT TEXT TO ANALYZE:
"${text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" },
    };

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ Gemini API Error Body:", errorBody);
      throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✓ Received response from Gemini:", data);

    let emotionQueue;
    try {
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error("No response text from Gemini");
      }
      emotionQueue = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response:", parseError);
      console.warn("⚠️ Defaulting to single neutral segment.");
      return [{ emotion: "Neutral", action: null, text: text }];
    }

    if (!Array.isArray(emotionQueue) || emotionQueue.length === 0) {
      console.warn("⚠️ Gemini did not return a valid emotion queue. Defaulting to a single neutral segment.");
      return [{ emotion: "Neutral", action: null, text: text }];
    }

    // Strict validation: ALL characters must be preserved
    const reconstructedText = emotionQueue.map(seg => seg.text || '').join('');

    if (reconstructedText !== text) {
      console.error("❌ CRITICAL VALIDATION FAILURE:");
      console.error("   Original length:", text.length);
      console.error("   Reconstructed length:", reconstructedText.length);
      console.error("   Character difference:", Math.abs(text.length - reconstructedText.length));

      // Show character-by-character comparison for debugging
      const maxLen = Math.max(text.length, reconstructedText.length);
      let firstDiffIndex = -1;
      for (let i = 0; i < maxLen; i++) {
        if (text[i] !== reconstructedText[i]) {
          firstDiffIndex = i;
          break;
        }
      }

      if (firstDiffIndex !== -1) {
        console.error("   First difference at index:", firstDiffIndex);
        console.error("   Expected char:", JSON.stringify(text[firstDiffIndex]));
        console.error("   Got char:", JSON.stringify(reconstructedText[firstDiffIndex]));
        const contextStart = Math.max(0, firstDiffIndex - 20);
        const contextEnd = Math.min(text.length, firstDiffIndex + 20);
        console.error("   Context (original):", JSON.stringify(text.substring(contextStart, contextEnd)));
        console.error("   Context (reconstructed):", JSON.stringify(reconstructedText.substring(contextStart, contextEnd)));
      }

      console.warn("⚠️ Falling back to single neutral segment to ensure accuracy.");
      return [{ emotion: "Neutral", action: null, text: text }];
    }

    // Additional validation: check each segment has text
    const invalidSegments = emotionQueue.filter(seg => !seg.text || typeof seg.text !== 'string');
    if (invalidSegments.length > 0) {
      console.error("❌ Found segments with invalid text fields:", invalidSegments);
      console.warn("⚠️ Falling back to single neutral segment.");
      return [{ emotion: "Neutral", action: null, text: text }];
    }

    console.log("✅ Gemini response VALIDATED - all characters preserved!");
    console.log(`📊 Emotion segments: ${emotionQueue.length}`);
    emotionQueue.forEach((seg, i) => {
      const actionText = seg.action ? ` [Action: ${seg.action}]` : '';
      const preview = seg.text.length > 40 ? seg.text.substring(0, 40) + '...' : seg.text;
      console.log(`  ${i + 1}. [${seg.emotion}]${actionText} "${preview}" (${seg.text.length} chars)`);
    });
    return emotionQueue;
  }

  function calculateSegmentEndTimes(alignment, segments) {
    console.log("--- Calculating Segment End Times (Character-Accurate) ---");
    const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;

    const alignmentText = characters.join('');
    const segmentsText = segments.map(s => s.text || '').join('');

    console.log("Alignment text length:", alignmentText.length);
    console.log("Segments text length:", segmentsText.length);

    // CRITICAL: Verify exact character match
    if (segmentsText !== alignmentText) {
      console.error("❌ CRITICAL ERROR: Segments text does not match alignment text!");
      console.error("   This means character preservation failed somewhere in the pipeline.");
      console.error("   Alignment text:", JSON.stringify(alignmentText.substring(0, 100)));
      console.error("   Segments text:", JSON.stringify(segmentsText.substring(0, 100)));

      // Find first mismatch
      for (let i = 0; i < Math.max(alignmentText.length, segmentsText.length); i++) {
        if (alignmentText[i] !== segmentsText[i]) {
          console.error(`   First mismatch at index ${i}:`);
          console.error(`     Expected: ${JSON.stringify(alignmentText[i])}`);
          console.error(`     Got: ${JSON.stringify(segmentsText[i])}`);
          break;
        }
      }

      return [];
    }

    console.log("✅ Text validation passed - segments match alignment exactly!");

    let currentCharIndex = 0;
    const segmentTimings = [];

    segments.forEach((segment, i) => {
      const segmentLength = segment.text.length;

      if (segmentLength === 0) {
        console.warn(`⚠️ Segment ${i + 1} has zero length, skipping`);
        return;
      }

      const startCharIndex = currentCharIndex;
      const endCharIndex = currentCharIndex + segmentLength - 1;

      // Safety check: ensure indices are within bounds
      if (startCharIndex >= character_start_times_seconds.length ||
          endCharIndex >= character_end_times_seconds.length) {
        console.error(`❌ Segment ${i + 1} indices out of bounds!`);
        console.error(`   Start index: ${startCharIndex}, End index: ${endCharIndex}`);
        console.error(`   Available indices: 0-${character_start_times_seconds.length - 1}`);
        return;
      }

      const startTime = character_start_times_seconds[startCharIndex];
      const endTime = character_end_times_seconds[endCharIndex];

      const actionText = segment.action ? ` [Action: ${segment.action}]` : '';
      const textPreview = segment.text.length > 50 ? segment.text.substring(0, 50) + '...' : segment.text;

      console.log(`Segment ${i + 1} [${segment.emotion}]${actionText}:`);
      console.log(`  Text: "${textPreview}" (${segmentLength} chars)`);
      console.log(`  Char indices: ${startCharIndex} → ${endCharIndex}`);
      console.log(`  Time range: ${startTime.toFixed(3)}s → ${endTime.toFixed(3)}s (${(endTime - startTime).toFixed(3)}s duration)`);

      segmentTimings.push({
        emotion: segment.emotion,
        action: segment.action || null,
        text: segment.text,
        startTime: startTime,
        endTime: endTime,
        duration: endTime - startTime
      });

      currentCharIndex += segmentLength;
    });

    // Final validation
    if (currentCharIndex !== alignmentText.length) {
      console.error(`❌ Character counting error! Processed ${currentCharIndex} chars but expected ${alignmentText.length}`);
    } else {
      console.log(`✅ Segment timings calculated successfully for ${segmentTimings.length} segments`);
      console.log(`✅ Total characters processed: ${currentCharIndex}`);
    }

    return segmentTimings;
  }

  async function splitAudioByTimestamps(audioBuffer, segmentTimings) {
    console.log('--- Splitting Audio by Emotion Timestamps ---');
    console.log(`Audio buffer: ${audioBuffer.duration.toFixed(3)}s, ${audioBuffer.numberOfChannels} channels, ${audioBuffer.sampleRate}Hz`);

    const blobs = [];

    for (let i = 0; i < segmentTimings.length; i++) {
      const timing = segmentTimings[i];
      const startOffset = timing.startTime;
      const endOffset = timing.endTime;

      // Calculate frame positions with proper rounding
      const startFrame = Math.floor(startOffset * audioBuffer.sampleRate);
      const endFrame = Math.ceil(endOffset * audioBuffer.sampleRate);
      const frameCount = endFrame - startFrame;

      const actionText = timing.action ? ` [Action: ${timing.action}]` : '';
      const textPreview = timing.text.length > 30 ? timing.text.substring(0, 30) + '...' : timing.text;

      console.log(`Segment ${i + 1}/${segmentTimings.length} [${timing.emotion}]${actionText}:`);
      console.log(`  Text: "${textPreview}"`);
      console.log(`  Time: ${startOffset.toFixed(3)}s → ${endOffset.toFixed(3)}s (${timing.duration.toFixed(3)}s)`);
      console.log(`  Frames: ${startFrame} → ${endFrame} (${frameCount} frames)`);

      if (frameCount <= 0) {
        console.error(`  ❌ Invalid frame count (${frameCount}), skipping segment`);
        continue;
      }

      if (startFrame >= audioBuffer.length) {
        console.error(`  ❌ Start frame ${startFrame} exceeds buffer length ${audioBuffer.length}, skipping`);
        continue;
      }

      // Clamp end frame to buffer length
      const actualEndFrame = Math.min(endFrame, audioBuffer.length);
      const actualFrameCount = actualEndFrame - startFrame;

      if (actualFrameCount <= 0) {
        console.error(`  ❌ Actual frame count after clamping is ${actualFrameCount}, skipping`);
        continue;
      }

      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const partBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          actualFrameCount,
          audioBuffer.sampleRate
        );

        // Copy audio data for each channel with bounds checking
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          const sourceData = audioBuffer.getChannelData(channel);
          const targetData = partBuffer.getChannelData(channel);

          for (let j = 0; j < actualFrameCount; j++) {
            const sourceIndex = startFrame + j;
            if (sourceIndex < sourceData.length) {
              targetData[j] = sourceData[sourceIndex];
            } else {
              targetData[j] = 0; // Silence if we exceed source bounds
            }
          }
        }

        const wavBlob = bufferToWave(partBuffer);
        blobs.push(wavBlob);
        console.log(`  ✅ Created WAV segment: ${(wavBlob.size / 1024).toFixed(2)} KB`);

      } catch (error) {
        console.error(`  ❌ Error creating segment ${i + 1}:`, error);
        continue;
      }
    }

    console.log(`✅ Successfully created ${blobs.length}/${segmentTimings.length} emotion-based audio segments`);
    return blobs;
  }

  // ==========================================================
  // SECCIÓN 1. EVENTOS DE INTEGRACIÓN Live2D
  // ----------------------------------------------------------
  // - Live2DScriptReady: saber si Live2D está activo
  // - TTSScriptReady: informar a Live2D que TTS está listo
  // ==========================================================

  // Informar a Live2D que el script TTS está presente y listo
  console.log("[TTS] TTS Script initialized. Dispatching 'TTSScriptReady' event...");
  const ttsReadyEvent = new CustomEvent('TTSScriptReady', {
      detail: {
          version: '3.9.1',
          capabilities: {
              emotionAnalysis: true,
              segmentedAudio: true,
              elevenLabs: true,
              builtInVoices: true
          }
      }
  });
  window.dispatchEvent(ttsReadyEvent);
  console.log("[TTS] 📢 'TTSScriptReady' event dispatched to Live2D script");

  // Live2D indica que está listo
  window.addEventListener("Live2DScriptReady", function () {
      if (!live2dScriptDetected) {
          live2dScriptDetected = true;
          console.log("[TTS] Live2D script detected. TTS will NOT play audio directly when Live2D is active.");
      }
  });

  // Variable global para almacenar las acciones disponibles
  let availableActions = [];

  // Listener para recibir las acciones disponibles desde Live2D
  window.addEventListener("Live2DActionsReady", function (event) {
      const { emotions, actions, modelName } = event.detail;
      availableActions = actions || [];
      console.log(`[TTS] Received actions list from Live2D model "${modelName}":`, availableActions);
      console.log(`[TTS] Emotions available:`, emotions.length);
  });

  // ==========================================================
  // SECCIÓN 2. DETECCIÓN DE MENSAJES DEL BOT/USUARIO
  // ----------------------------------------------------------
  // - Extrae el último mensaje terminado y dispara TTS si procede
  // - Ofrece utilidades para formatear texto a leer
  // ==========================================================

  // Extrae y procesa el último mensaje del bot ya finalizado
  function logMessageStatus() {
    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessageNodes.length === 0) return;

    // Encuentra el último del bot finalizado
    let lastBotMessageContainer = null;
    let activeMessageNode = null;
    let activeSwipeIndex = 0;
    let messageIndex = -1;

    for (let i = allMessageNodes.length - 1; i >= 0; i--) {
      const node = allMessageNodes[i];
      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        let candidateNode;
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (!slider) continue;
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
          if (allSwipes.length <= activeSwipeIndex) continue;
          candidateNode = allSwipes[activeSwipeIndex];
        } else {
          candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        }
        if (!candidateNode) continue;
        if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
        if (!candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastBotMessageContainer = node;
        activeMessageNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        break;
      }
    }
    if (!activeMessageNode) return;

    const messageText = extractFormattedMessageText(activeMessageNode);
    const { processed: processedTTS } = processTTSOutput(messageText);

    const status = "Finished";
    const shouldLog =
      status !== lastLoggedStatus ||
      activeSwipeIndex !== lastLoggedSwipeIndex ||
      messageIndex !== lastLoggedMessageIndex ||
      (status !== "Streaming" && messageText !== lastLoggedText);

    if (shouldLog) {
      lastLoggedStatus = status;
      lastLoggedSwipeIndex = activeSwipeIndex;
      lastLoggedMessageIndex = messageIndex;
      lastLoggedText = messageText;

      console.log("📜 Raw extracted text (Auto):");
      console.log(messageText);
      console.log("\n🎤 Processed TTS (Auto):");
      console.log(processedTTS || "[No TTS output]");
      console.log("--------------------");

      if (processedTTS) {
          playTTS(processedTTS, true); // isBot = true
      }
    }
  }

  // Versión que detecta último mensaje finalizado (bot o usuario)
  function logLastFinishedMessage() {
    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessageNodes.length === 0) return;

    let lastFinishedNode = null;
    let messageIndex = -1;
    let isBot = false;

    for (let i = allMessageNodes.length - 1; i >= 0; i--) {
      const node = allMessageNodes[i];
      let candidateNode;
      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (!slider) continue;
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          const activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
          if (allSwipes.length <= activeSwipeIndex) continue;
          candidateNode = allSwipes[activeSwipeIndex];
        } else {
          candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        }
        if (!candidateNode) continue;
        if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
        if (!candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastFinishedNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        isBot = true;
        break;
      } else {
        candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        if (!candidateNode) continue;
        if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
        if (!candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastFinishedNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        isBot = false;
        break;
      }
    }
    if (!lastFinishedNode) return;

    const messageText = extractFormattedMessageText(lastFinishedNode);
    const { processed: processedTTS } = processTTSOutput(messageText);
    const status = "Finished";

    if (
      status !== lastLoggedStatus ||
      messageIndex !== lastLoggedMessageIndex ||
      (status !== "Streaming" && messageText !== lastLoggedText)
    ) {
      lastLoggedStatus = status;
      lastLoggedSwipeIndex = -1;
      lastLoggedMessageIndex = messageIndex;
      lastLoggedText = messageText;

      console.log("📜 Raw extracted text (Auto, User+Bot):");
      console.log(messageText);
      console.log("\n🎤 Processed TTS (Auto, User+Bot):");
      console.log(processedTTS || "[No TTS output]");
      console.log("--------------------");

      if (processedTTS) {
          playTTS(processedTTS, isBot);
      }
    }
  }

  // Extrae texto formateado a partir del nodo del mensaje (respeta cursivas, etc.)
  function extractFormattedMessageText(messageNode) {
    // Find the message text container dynamically
    // Structure: _messageBody_ > [_nameContainer_, textContainer]
    // The text container is a direct child of _messageBody_ that is NOT _nameContainer_
    const messageBody = messageNode.querySelector(MESSAGE_BODY_SELECTOR);
    if (!messageBody) return "[No text found]";

    // Find the text container: it's a div child of messageBody that is not the name container
    let textContainer = null;
    for (const child of messageBody.children) {
      if (child.tagName === 'DIV' && !child.className.match(/_nameContainer_/)) {
        // This should be the text container (has dynamic css-XXXXX class)
        textContainer = child;
        break;
      }
    }
    if (!textContainer) return "[No text found]";

    let result = [];
    // Find text blocks - they have class 'css-0' or are direct children with content
    const blocks = textContainer.querySelectorAll('[class^="css-"]');
    blocks.forEach(block => {
      const p = block.querySelector('p');
      if (p) {
        let line = '';
        p.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === 'EM') line += '_' + child.textContent + '_';
            else if (child.tagName === 'STRONG') line += '**' + child.textContent + '**';
            else if (child.tagName === 'CODE') line += '`' + child.textContent + '`';
            else line += child.textContent;
          } else if (child.nodeType === Node.TEXT_NODE) {
            line += child.textContent;
          }
        });
        if (line.trim()) result.push(line.trim());
        return;
      }
      const ul = block.querySelector('ul');
      if (ul) {
        ul.querySelectorAll('li').forEach(li => result.push('• ' + li.textContent.trim()));
        return;
      }
      const code = block.querySelector('code');
      if (code && !p) { result.push('`' + code.textContent.trim() + '`'); return; }
      if (!block.textContent.trim()) return;
      result.push(block.textContent.trim());
    });
    return result.length ? result.join('\n') : "[No text found]";
  }

  // Limpia/filtra el texto de entrada según ajustes del usuario
  function processTTSOutput(rawText) {
    const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    const provider = settings.provider || 'builtin';
    const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : provider === 'gemini' ? 'gemini_' : '';

    let processed = rawText;
    let needsDelay = false;

    // Saltar bloques de código
    if (settings[`${prefix}tts-skip-codeblocks`]) {
      const codeblockRegex = /```[\s\S]*?```/g;
      if (codeblockRegex.test(processed)) needsDelay = true;
      processed = processed.replace(codeblockRegex, "");
      const inlineCodeRegex = /`[^`]*`/g;
      if (inlineCodeRegex.test(processed)) needsDelay = true;
      processed = processed.replace(inlineCodeRegex, "");
    } else {
      processed = processed.replace(/```([\s\S]*?)```/g, (m, p1) => p1.trim());
      processed = processed.replace(/`([^`]*)`/g, (m, p1) => p1);
    }

    // Omitir bullets
    if (settings[`${prefix}tts-skip-bulletpoints`]) {
      const lines = processed.split("\n");
      let found = false;
      processed = lines.filter(line => {
        if (/^\s*([•\-*])\s+/.test(line)) { found = true; return false; }
        return true;
      }).join("\n");
      if (found) needsDelay = true;
    }

    // Asteriscos y énfasis
    if (settings[`${prefix}tts-ignore-asterisks`]) {
      let found = false;
      processed = processed.replace(/\*\*[^*\n]+\*\*/g, () => { found = true; return ""; });
      processed = processed.replace(/\*[^*\n]+\*/g, () => { found = true; return ""; });
      processed = processed.replace(/_[^_\n]+_/g, () => { found = true; return ""; });
      if (found) needsDelay = true;
    } else {
      processed = processed.replace(/\*\*([^*\n]+)\*\*/g, (m, p1) => p1);
      processed = processed.replace(/\*([^*\n]+)\*/g, (m, p1) => p1);
      processed = processed.replace(/_([^_\n]+)_/g, (m, p1) => p1);
    }

    // Solo narrar comillas dobles
    if (settings[`${prefix}tts-only-quotes`]) {
      const matches = [];
      let match;
      const regex = /"([^"]+)"/g;
      while ((match = regex.exec(processed)) !== null) matches.push(match[1]);
      processed = matches.length > 0 ? matches.join(" ") : "";
    }

    processed = processed.replace(/\n{2,}/g, "\n").trim();
    return { processed, needsDelay };
  }

  // ==========================================================
  // SECCIÓN 3. OBSERVADOR DEL CHAT (activa detección automática)
  // ----------------------------------------------------------
  // - Observa cambios de DOM y llama a detectores adecuados
  // - Auto-narración de usuario si está activa
  // ==========================================================

  function initializeObserver() {
    const container = document.querySelector(CHAT_CONTAINER_SELECTOR);

    if (container) {
      const observer = new MutationObserver(() => {
        const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
        const provider = settings.provider || 'builtin';
        const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : provider === 'gemini' ? 'gemini_' : '';

        const ttsEnabled = !!settings[`${prefix}tts-enabled`];
        const autoGen = !!settings[`${prefix}tts-auto-gen`];
        const narrateUser = !!settings[`${prefix}tts-narrate-user`];

        // Only proceed if TTS is enabled and auto-gen is on
        if (ttsEnabled && autoGen) {
          // If narrate user is enabled, use logLastFinishedMessage (handles both bot and user)
          // Otherwise, use logMessageStatus (handles only bot messages)
          if (narrateUser) {
            logLastFinishedMessage();
          } else {
            logMessageStatus();
          }
        }
      });

      observer.observe(container, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['style'],
      });

      // Initial check
      const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
      const provider = settings.provider || 'builtin';
      const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : provider === 'gemini' ? 'gemini_' : '';
      if (settings[`${prefix}tts-enabled`] && settings[`${prefix}tts-auto-gen`]) {
        if (settings[`${prefix}tts-narrate-user`]) {
          logLastFinishedMessage();
        } else {
          logMessageStatus();
        }
      }
    } else {
      setTimeout(initializeObserver, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeObserver);
  } else {
    initializeObserver();
  }

  // ==========================================================
  // SECCIÓN 4. VOCES INTEGRADAS (Web Speech) Y MENÚ DE AJUSTES
  // ----------------------------------------------------------
  // - Carga de voces integradas y popup de prueba
  // - CSS y construcción del modal de ajustes TTS
  // - Guardado de settings (Built-in y ElevenLabs)
  // ==========================================================

  // Voces integradas
  let builtinVoices = [];
  function loadBuiltinVoices(callback) {
    function updateVoices() {
      builtinVoices = window.speechSynthesis?.getVoices() || [];
      if (typeof callback === "function") callback(builtinVoices);
    }
    if (!window.speechSynthesis) {
      builtinVoices = [];
      if (typeof callback === "function") callback([]);
      return;
    }
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
  }

  function showVoicesPopup() {
    loadBuiltinVoices(function(voices) {
      if (!voices || voices.length === 0) {
        alert("No built-in voices available or still loading. Try again in a moment.");
        return;
      }
      let msg = "Available Built-in Voices:\n\n";
      voices.forEach((v, i) => { msg += `${i + 1}. ${v.name} (${v.lang})${v.default ? " [default]" : ""}\n`; });
      alert(msg);
    });
  }

  // Atajo de teclado temporal: Ctrl+Alt+V para ver voces
  window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "v") showVoicesPopup();
  });

  // CSS del menú TTS - Glassmorphism Style (matching Live2D)
  const TTS_MENU_CSS = `
    /* === GLASSMORPHISM BASE VARIABLES === */
    .tts-modal-overlay {
      --glass-bg: rgba(18, 18, 22, 0.78);
      --glass-bg-light: rgba(30, 30, 36, 0.7);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-border-hover: rgba(176, 196, 222, 0.4);
      --accent-primary: rgba(176, 196, 222, 0.9);
      --accent-gradient: linear-gradient(135deg, rgba(176, 196, 222, 0.9), rgba(147, 197, 253, 0.8));
      --accent-glow: 0 0 15px rgba(176, 196, 222, 0.4);
      --accent-glow-strong: 0 0 20px rgba(176, 196, 222, 0.6), 0 0 40px rgba(176, 196, 222, 0.2);
      --text-primary: rgba(255, 255, 255, 0.95);
      --text-secondary: rgba(200, 200, 220, 0.8);
      --text-muted: rgba(160, 160, 180, 0.7);
      --blur-amount: 12px;
      --radius-sm: 8px;
      --radius-md: 15px;
      --radius-lg: 20px;
    }

    /* === MODAL OVERLAY === */
    .tts-modal-overlay {
      position: fixed; z-index: 9999; inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      animation: ttsFadeIn 0.2s ease-out;
    }
    @keyframes ttsFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ttsSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* === MODAL CONTAINER === */
    .tts-modal-container {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--blur-amount));
      -webkit-backdrop-filter: blur(var(--blur-amount));
      border-radius: var(--radius-lg);
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      min-width: 480px; max-width: 95vw; min-height: 320px; max-height: 90vh; padding: 0;
      display: flex; flex-direction: column; font-family: 'Segoe UI', system-ui, sans-serif;
      animation: ttsSlideUp 0.3s ease-out;
    }

    /* === HEADER === */
    .tts-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 28px 16px 28px;
      border-bottom: 1px solid var(--glass-border);
    }
    .tts-modal-title {
      font-size: 1.35rem; font-weight: 600;
      background: linear-gradient(135deg, #fff 0%, rgba(176, 196, 222, 1) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; margin: 0;
      text-shadow: 0 0 30px rgba(176, 196, 222, 0.3);
    }
    .tts-modal-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      font-size: 1.2rem; cursor: pointer;
      padding: 8px; border-radius: var(--radius-sm);
      transition: all 0.2s ease;
      display: flex; align-items: center; justify-content: center;
    }
    .tts-modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--glass-border-hover);
      color: var(--text-primary);
      box-shadow: var(--accent-glow);
    }

    /* === BODY === */
    .tts-modal-body {
      padding: 24px 28px; display: flex; flex-direction: column; gap: 18px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(176, 196, 222, 0.3) transparent;
    }
    .tts-modal-body::-webkit-scrollbar { width: 6px; }
    .tts-modal-body::-webkit-scrollbar-track { background: transparent; }
    .tts-modal-body::-webkit-scrollbar-thumb { background: rgba(176, 196, 222, 0.3); border-radius: 3px; }
    .tts-modal-body::-webkit-scrollbar-thumb:hover { background: rgba(176, 196, 222, 0.5); }

    /* === CHECKBOXES === */
    .tts-checkbox-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
    .tts-checkbox-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .tts-checkbox-row:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--glass-border);
    }
    .tts-checkbox-row label { color: var(--text-secondary); font-size: 0.95rem; cursor: pointer; }
    .tts-checkbox-row input[type="checkbox"],
    .tts-checkbox {
      appearance: none; -webkit-appearance: none;
      width: 20px; height: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(176, 196, 222, 0.3);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      flex-shrink: 0;
    }
    .tts-checkbox-row input[type="checkbox"]:checked,
    .tts-checkbox:checked {
      background: var(--accent-gradient);
      border-color: transparent;
      box-shadow: var(--accent-glow);
    }
    .tts-checkbox-row input[type="checkbox"]:checked::after,
    .tts-checkbox:checked::after {
      content: '✓';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: #1a1a2e;
      font-size: 12px;
      font-weight: bold;
    }

    /* === SLIDERS === */
    .tts-slider-row {
      display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .tts-slider-row:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--glass-border);
    }
    .tts-slider-label {
      color: var(--text-secondary); font-size: 0.95rem;
      margin-right: 8px; min-width: 120px;
    }
    .tts-slider {
      flex: 1; height: 6px;
      background: linear-gradient(90deg, rgba(176, 196, 222, 0.2), rgba(176, 196, 222, 0.1));
      border-radius: 3px; outline: none; -webkit-appearance: none;
      cursor: pointer;
    }
    .tts-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 18px; height: 18px;
      background: var(--accent-gradient);
      cursor: pointer; border-radius: 50%;
      box-shadow: var(--accent-glow);
      transition: all 0.2s ease;
    }
    .tts-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: var(--accent-glow-strong);
    }
    .tts-slider::-moz-range-thumb {
      width: 18px; height: 18px;
      background: var(--accent-gradient);
      cursor: pointer; border-radius: 50%; border: none;
      box-shadow: var(--accent-glow);
    }
    .tts-slider-value {
      width: 60px; padding: 8px 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--accent-primary);
      font-size: 0.9rem; text-align: center;
      font-family: 'JetBrains Mono', monospace;
      transition: all 0.2s ease;
    }
    .tts-slider-value:focus {
      border-color: var(--glass-border-hover);
      box-shadow: var(--accent-glow);
      outline: none;
    }

    /* === DROPDOWNS === */
    .tts-dropdown-row {
      display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px;
    }
    .tts-dropdown-label {
      color: var(--text-secondary); font-size: 0.9rem;
      font-weight: 500; margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tts-dropdown {
      padding: 10px 14px; border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary); font-size: 0.95rem;
      min-width: 120px; margin-bottom: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
    }
    .tts-dropdown:hover, .tts-dropdown:focus {
      border-color: var(--glass-border-hover);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: var(--accent-glow);
      outline: none;
    }
    .tts-dropdown option { background: #1e1f28; color: var(--text-primary); }
    .tts-dropdown optgroup { background: #1e1f28; color: var(--text-muted); }

    /* === FOOTER === */
    .tts-modal-footer {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 18px 28px;
      border-top: 1px solid var(--glass-border);
      background: transparent;
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }

    /* === BUTTONS === */
    .tts-modal-btn {
      padding: 10px 28px; border-radius: var(--radius-sm); border: none;
      font-size: 0.95rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tts-modal-btn.cancel {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
    }
    .tts-modal-btn.save {
      background: var(--accent-gradient);
      color: #1a1a2e;
      box-shadow: var(--accent-glow);
    }
    .tts-modal-btn.cancel:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--glass-border-hover);
      color: var(--text-primary);
    }
    .tts-modal-btn.save:hover {
      box-shadow: var(--accent-glow-strong);
      transform: translateY(-1px);
    }

    /* === API KEY CONTAINER === */
    .tts-api-key-container {
      display: flex; align-items: stretch; gap: 10px;
    }
    .tts-api-key-container textarea {
      flex-grow: 1; padding: 10px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 0.95rem; resize: none;
      font-family: 'JetBrains Mono', monospace;
      height: 42px; line-height: 1.5;
      transition: all 0.2s ease;
    }
    .tts-api-key-container textarea:focus {
      border-color: var(--glass-border-hover);
      box-shadow: var(--accent-glow);
      outline: none;
    }
    .tts-api-key-container textarea::placeholder {
      color: var(--text-muted);
    }
    .tts-api-key-validate-btn {
      padding: 0 20px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
      font-size: 0.9rem; font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .tts-api-key-validate-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--glass-border-hover);
      color: var(--text-primary);
      box-shadow: var(--accent-glow);
    }
    .tts-api-key-validate-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .tts-api-key-status {
      font-size: 0.85rem; margin-top: 6px; height: 18px;
      font-weight: 500;
    }
    .tts-api-key-status.success { color: #4ade80; text-shadow: 0 0 10px rgba(74, 222, 128, 0.3); }
    .tts-api-key-status.error { color: #f87171; text-shadow: 0 0 10px rgba(248, 113, 113, 0.3); }

    /* === PROVIDER SECTION DIVIDER === */
    .tts-dropdown-row[style*="border-bottom"] {
      padding-bottom: 18px !important;
      margin-bottom: 0 !important;
      border-bottom: 1px solid var(--glass-border) !important;
    }

    /* === SETTINGS PANELS === */
    #tts-settings-builtin,
    #tts-settings-elevenlabs,
    #tts-settings-gemini {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Remove extra margin from checkbox list when followed by other elements */
    .tts-checkbox-list {
      margin-bottom: 0 !important;
    }

    /* === TEXTAREA STYLES (for Gemini style prompt) === */
    .tts-dropdown-row textarea {
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 0.95rem;
      resize: none;
      font-family: 'Segoe UI', system-ui, sans-serif;
      transition: all 0.2s ease;
    }
    .tts-dropdown-row textarea:focus {
      border-color: var(--glass-border-hover);
      box-shadow: var(--accent-glow);
      outline: none;
    }
    .tts-dropdown-row textarea::placeholder {
      color: var(--text-muted);
    }

    /* Gemini style row - reduce internal gaps */
    #tts-settings-gemini .tts-dropdown-row {
      gap: 8px;
      margin-bottom: 0;
    }

    /* Slider rows in settings panels - no extra bottom margin */
    #tts-settings-gemini .tts-slider-row,
    #tts-settings-elevenlabs .tts-slider-row,
    #tts-settings-builtin .tts-slider-row {
      margin-bottom: 0;
    }
  `;
  if (!document.getElementById("tts-menu-style")) {
    const style = document.createElement("style");
    style.id = "tts-menu-style";
    style.textContent = TTS_MENU_CSS;
    document.head.appendChild(style);
  }

  const CHECKBOX_OPTIONS = [
      { id: "tts-enabled", label: "Enabled", default: false },
      { id: "tts-narrate-user", label: "Narrate user messages", default: false },
      { id: "tts-auto-gen", label: "Auto Generation", default: false },
      { id: "tts-only-quotes", label: 'Only narrate "quotes"', default: false },
      { id: "tts-ignore-asterisks", label: 'Ignore *text, even "quotes", inside asterisks*', default: false },
      { id: "tts-skip-codeblocks", label: "Skip codeblocks", default: false },
      { id: "tts-skip-bulletpoints", label: "Skip bulletpoints", default: false }
  ];

  let elevenLabsVoices = [];
  let elevenLabsModels = [];

  // Gemini TTS pre-made models and voices (single-speaker only)
  const GEMINI_TTS_MODELS = [
    { id: 'gemini-2.5-flash-preview-tts', label: 'Gemini 2.5 Flash (TTS)' },
    { id: 'gemini-2.5-pro-preview-tts', label: 'Gemini 2.5 Pro (TTS)' }
  ];

  const GEMINI_TTS_VOICES = [
    { id: 'Zephyr', label: 'Zephyr -- Bright' },
    { id: 'Puck', label: 'Puck -- Upbeat' },
    { id: 'Charon', label: 'Charon -- Informative' },
    { id: 'Kore', label: 'Kore -- Firm' },
    { id: 'Fenrir', label: 'Fenrir -- Excitable' },
    { id: 'Leda', label: 'Leda -- Youthful' },
    { id: 'Orus', label: 'Orus -- Firm' },
    { id: 'Aoede', label: 'Aoede -- Breezy' },
    { id: 'Callirrhoe', label: 'Callirrhoe -- Easy-going' },
    { id: 'Autonoe', label: 'Autonoe -- Bright' },
    { id: 'Enceladus', label: 'Enceladus -- Breathy' },
    { id: 'Iapetus', label: 'Iapetus -- Clear' },
    { id: 'Umbriel', label: 'Umbriel -- Easy-going' },
    { id: 'Algieba', label: 'Algieba -- Smooth' },
    { id: 'Despina', label: 'Despina -- Smooth' },
    { id: 'Erinome', label: 'Erinome -- Clear' },
    { id: 'Algenib', label: 'Algenib -- Gravelly' },
    { id: 'Rasalgethi', label: 'Rasalgethi -- Informative' },
    { id: 'Laomedeia', label: 'Laomedeia -- Upbeat' },
    { id: 'Achernar', label: 'Achernar -- Soft' },
    { id: 'Alnilam', label: 'Alnilam -- Firm' },
    { id: 'Schedar', label: 'Schedar -- Even' },
    { id: 'Gacrux', label: 'Gacrux -- Mature' },
    { id: 'Pulcherrima', label: 'Pulcherrima -- Forward' },
    { id: 'Achird', label: 'Achird -- Friendly' },
    { id: 'Zubenelgenubi', label: 'Zubenelgenubi -- Casual' },
    { id: 'Vindemiatrix', label: 'Vindemiatrix -- Gentle' },
    { id: 'Sadachbia', label: 'Sadachbia -- Lively' },
    { id: 'Sadaltager', label: 'Sadaltager -- Knowledgeable' },
    { id: 'Sulafat', label: 'Sulafat -- Warm' }
  ];

  function createTTSMenu() {
    const savedSettings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    const getSetting = (key, def) => (key in savedSettings ? savedSettings[key] : def);

    const overlay = document.createElement("div");
    overlay.className = "tts-modal-overlay";
    overlay.style.display = "none";

    const container = document.createElement("div");
    container.className = "tts-modal-container";

    const header = document.createElement("div");
    header.className = "tts-modal-header";
    const title = document.createElement("h2");
    title.className = "tts-modal-title";
    title.textContent = "Text to Speech Settings";
    const closeBtn = document.createElement("button");
    closeBtn.className = "tts-modal-close";
    closeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    closeBtn.onclick = () => {
        stopPreviewAudio();
        overlay.style.display = "none";
    };
    header.appendChild(title);
    header.appendChild(closeBtn);

    const mainBody = document.createElement("div");
    mainBody.className = "tts-modal-body";

    // Selector de proveedor
    const providerDropdownRow = document.createElement("div");
    providerDropdownRow.className = "tts-dropdown-row";
    providerDropdownRow.style.paddingBottom = "18px";
    providerDropdownRow.style.marginBottom = "0";
    providerDropdownRow.style.borderBottom = "1px solid #444";

  const providerLabel = document.createElement("label");
    providerLabel.className = "tts-dropdown-label";
    providerLabel.textContent = "TTS Provider";
  const providerSelect = document.createElement("select");
  providerSelect.id = "tts-provider-select";
  providerSelect.className = "tts-dropdown";
  providerSelect.innerHTML = `<option value="builtin">Built-in</option><option value="elevenlabs">ElevenLabs</option><option value="gemini">Gemini TTS (API)</option>`;
    providerSelect.value = getSetting("provider", "builtin");
    providerDropdownRow.appendChild(providerLabel);
    providerDropdownRow.appendChild(providerSelect);
    mainBody.appendChild(providerDropdownRow);

    // Nombres actuales de bot/usuario
    let botName = "char";
    try {
        const botNameElem = document.querySelector('[class^="_nameText_"]');
        if (botNameElem && botNameElem.textContent.trim()) botName = botNameElem.textContent.trim();
    } catch (e) {}
    let userPersona = "User";
    try {
        const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
        for (let i = allMessageNodes.length - 1; i >= 0; i--) {
            const node = allMessageNodes[i];
            if (!node.querySelector('[class^="_nameIcon_"]')) {
                const nameElem = node.querySelector('[class^="_nameText_"]');
                if (nameElem && nameElem.textContent.trim()) { userPersona = nameElem.textContent.trim(); break; }
            }
        }
    } catch (e) {}

    // Panel Built-in
    const settingsBuiltIn = document.createElement("div");
    settingsBuiltIn.id = "tts-settings-builtin";
    settingsBuiltIn.style.display = "flex";
    settingsBuiltIn.style.flexDirection = "column";
    settingsBuiltIn.style.gap = "18px";

    const checkboxListBuiltIn = document.createElement("div");
    checkboxListBuiltIn.className = "tts-checkbox-list";
    CHECKBOX_OPTIONS.forEach(opt => {
        const row = document.createElement("div");
        row.className = "tts-checkbox-row";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = `builtin-${opt.id}`;
        cb.dataset.key = opt.id;
        cb.className = "tts-checkbox";
        cb.checked = !!getSetting(opt.id, opt.default);
        const label = document.createElement("label");
        label.htmlFor = cb.id;
        label.textContent = opt.label;
        row.appendChild(cb);
        row.appendChild(label);
        checkboxListBuiltIn.appendChild(row);
    });
    settingsBuiltIn.appendChild(checkboxListBuiltIn);

    const sliderRowBuiltIn = document.createElement("div");
    sliderRowBuiltIn.className = "tts-slider-row";
    const sliderLabelBuiltIn = document.createElement("span");
    sliderLabelBuiltIn.className = "tts-slider-label";
    sliderLabelBuiltIn.textContent = "Playback speed";
    const sliderBuiltIn = document.createElement("input");
    sliderBuiltIn.type = "range";
    sliderBuiltIn.dataset.key = "playbackSpeed";
    sliderBuiltIn.className = "tts-slider";
    sliderBuiltIn.min = "0.10";
    sliderBuiltIn.max = "2.00";
    sliderBuiltIn.step = "0.05";
    sliderBuiltIn.value = getSetting("playbackSpeed", "1.00");
    const sliderValueBuiltIn = document.createElement("input");
    sliderValueBuiltIn.type = "text";
    sliderValueBuiltIn.className = "tts-slider-value";
    sliderValueBuiltIn.value = sliderBuiltIn.value;
    sliderBuiltIn.oninput = () => { sliderValueBuiltIn.value = parseFloat(sliderBuiltIn.value).toFixed(2); };
    sliderValueBuiltIn.oninput = () => {
      let v = parseFloat(sliderValueBuiltIn.value);
      if (!isNaN(v) && v >= 0.1 && v <= 2) sliderBuiltIn.value = v.toFixed(2);
    };
    sliderRowBuiltIn.appendChild(sliderLabelBuiltIn);
    sliderRowBuiltIn.appendChild(sliderBuiltIn);
    sliderRowBuiltIn.appendChild(sliderValueBuiltIn);
    settingsBuiltIn.appendChild(sliderRowBuiltIn);

    const dropdownRowBuiltIn = document.createElement("div");
    dropdownRowBuiltIn.className = "tts-dropdown-row";
    dropdownRowBuiltIn.innerHTML = `
        <label class="tts-dropdown-label">Default voice</label>
        <select class="tts-dropdown" data-key="defaultVoice"></select>
        <label class="tts-dropdown-label">Voice for "${botName}"</label>
        <select class="tts-dropdown" data-key="charVoice_${botName}"></select>
        <label class="tts-dropdown-label">Voice for "${userPersona}" (You)</label>
        <select class="tts-dropdown" data-key="userVoice_${userPersona}"></select>
    `;
    loadBuiltinVoices(() => {
        const dropdowns = dropdownRowBuiltIn.querySelectorAll('.tts-dropdown');
        dropdowns.forEach(dd => {
            dd.innerHTML = `<option value="Default">Default</option>`;
            builtinVoices.forEach(v => {
                const opt = document.createElement("option");
                opt.value = v.name;
                opt.textContent = `${v.name} (${v.lang})${v.default ? " [default]" : ""}`;
                dd.appendChild(opt);
            });
            const key = dd.dataset.key;
            const fallbackKey = key.startsWith('charVoice') || key.startsWith('userVoice') ? 'defaultVoice' : 'Default';
            dd.value = getSetting(key, getSetting(fallbackKey, 'Default'));
        });
    });
    settingsBuiltIn.appendChild(dropdownRowBuiltIn);

  // Panel ElevenLabs
    const settingsElevenLabs = document.createElement("div");
    settingsElevenLabs.id = "tts-settings-elevenlabs";
    settingsElevenLabs.style.display = "none";
    settingsElevenLabs.style.flexDirection = "column";
    settingsElevenLabs.style.gap = "18px";

    // API Key
    const apiKeyRow = document.createElement("div");
    apiKeyRow.className = "tts-dropdown-row";
    apiKeyRow.style.paddingBottom = "18px";
    apiKeyRow.style.marginBottom = "0";
    apiKeyRow.style.borderBottom = "1px solid #444";
    const apiKeyLabel = document.createElement("label");
    apiKeyLabel.className = "tts-dropdown-label";
    apiKeyLabel.textContent = "ElevenLabs API Key";
    const apiKeyContainer = document.createElement("div");
    apiKeyContainer.className = 'tts-api-key-container';
    const apiKeyInput = document.createElement("textarea");
    apiKeyInput.dataset.key = "elevenlabs_apiKey";
    apiKeyInput.value = getSetting("elevenlabs_apiKey", "");
    apiKeyInput.placeholder = "Enter your API Key";
    const validateBtn = document.createElement("button");
    validateBtn.type = "button";
    validateBtn.className = "tts-api-key-validate-btn";
    validateBtn.textContent = "Validate";
    const apiKeyStatus = document.createElement("div");
    apiKeyStatus.className = "tts-api-key-status";

    // Ocultar/mostrar clave
    let isKeyHidden = true;
    const originalKey = apiKeyInput.value;
    function maskKey(key) { return key.length > 0 ? '•'.repeat(key.length) : ''; }
    if (originalKey) { apiKeyInput.value = maskKey(originalKey); apiKeyInput.dataset.original = originalKey; }
    apiKeyInput.addEventListener('focus', () => {
        if (isKeyHidden && apiKeyInput.dataset.original) { apiKeyInput.value = apiKeyInput.dataset.original; isKeyHidden = false; }
    });
    apiKeyInput.addEventListener('blur', () => {
        apiKeyInput.dataset.original = apiKeyInput.value;
        apiKeyInput.value = maskKey(apiKeyInput.value);
        isKeyHidden = true;
    });
    apiKeyInput.addEventListener('input', () => { apiKeyInput.dataset.original = apiKeyInput.value; });

    apiKeyContainer.appendChild(apiKeyInput);
    apiKeyContainer.appendChild(validateBtn);
    apiKeyRow.appendChild(apiKeyLabel);
    apiKeyRow.appendChild(apiKeyContainer);
    apiKeyRow.appendChild(apiKeyStatus);
    settingsElevenLabs.appendChild(apiKeyRow);

    const checkboxListElevenLabs = document.createElement("div");
    checkboxListElevenLabs.className = "tts-checkbox-list";
    CHECKBOX_OPTIONS.forEach(opt => {
        const row = document.createElement("div");
        row.className = "tts-checkbox-row";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = `elevenlabs-${opt.id}`;
        cb.dataset.key = `elevenlabs_${opt.id}`;
        cb.className = "tts-checkbox";
        cb.checked = !!getSetting(cb.dataset.key, opt.default);
        const label = document.createElement("label");
        label.htmlFor = cb.id;
        label.textContent = opt.label;
        row.appendChild(cb);
        row.appendChild(label);
        checkboxListElevenLabs.appendChild(row);
    });
    settingsElevenLabs.appendChild(checkboxListElevenLabs);

    function createSlider(labelText, key, min, max, step, defaultValue, formatFn, parseFn) {
        const row = document.createElement("div");
        row.className = "tts-slider-row";
        row.innerHTML = `<span class="tts-slider-label">${labelText}</span>`;
        const slider = document.createElement("input");
        slider.type = "range";
        slider.dataset.key = key;
        slider.className = "tts-slider";
        slider.min = min; slider.max = max; slider.step = step;
        slider.value = getSetting(key, defaultValue);
        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.className = "tts-slider-value";
        valueInput.value = formatFn(slider.value);
        slider.oninput = () => { valueInput.value = formatFn(slider.value); };
        valueInput.onchange = () => {
            const parsed = parseFn(valueInput.value);
            if (parsed.isValid) { slider.value = parsed.value; valueInput.value = formatFn(slider.value); }
            else { valueInput.value = formatFn(slider.value); }
        };
        row.appendChild(slider);
        row.appendChild(valueInput);
        return row;
    }

    settingsElevenLabs.appendChild(createSlider("Playback speed", "elevenlabs_playbackSpeed", "0.1", "2.0", "0.05", "1.00",
        v => parseFloat(v).toFixed(2),
        v => { const n = parseFloat(v); return { isValid: !isNaN(n) && n >= 0.1 && n <= 2, value: n.toFixed(2) }; }
    ));
    settingsElevenLabs.appendChild(createSlider("Stability", "elevenlabs_stability", "0", "1", "0.01", "0.50",
        v => `${Math.round(v * 100)}%`,
        v => { const n = parseInt(v.replace('%','')); return { isValid: !isNaN(n) && n >= 0 && n <= 100, value: (n/100).toFixed(2) }; }
    ));
    settingsElevenLabs.appendChild(createSlider("Similarity Boost", "elevenlabs_similarity", "0", "1", "0.01", "0.75",
        v => `${Math.round(v * 100)}%`,
        v => { const n = parseInt(v.replace('%','')); return { isValid: !isNaN(n) && n >= 0 && n <= 100, value: (n/100).toFixed(2) }; }
    ));
    settingsElevenLabs.appendChild(createSlider("Style", "elevenlabs_style", "0", "1", "0.01", "0.00",
        v => `${Math.round(v * 100)}%`,
        v => { const n = parseInt(v.replace('%','')); return { isValid: !isNaN(n) && n >= 0 && n <= 100, value: (n/100).toFixed(2) }; }
    ));

    const speakerBoostRow = document.createElement("div");
    speakerBoostRow.className = "tts-checkbox-row";
    const speakerBoostCb = document.createElement("input");
    speakerBoostCb.type = "checkbox";
    speakerBoostCb.id = "elevenlabs-speaker-boost";
    speakerBoostCb.dataset.key = "elevenlabs_speaker-boost";
    speakerBoostCb.className = "tts-checkbox";
    speakerBoostCb.checked = !!getSetting("elevenlabs_speaker-boost", false);
    const speakerBoostLabel = document.createElement("label");
    speakerBoostLabel.htmlFor = speakerBoostCb.id;
    speakerBoostLabel.textContent = "Use Speaker Boost";
    speakerBoostRow.appendChild(speakerBoostCb);
    speakerBoostRow.appendChild(speakerBoostLabel);
    checkboxListElevenLabs.appendChild(speakerBoostRow);

    const dropdownRowElevenLabs = document.createElement("div");
    dropdownRowElevenLabs.className = "tts-dropdown-row";
    dropdownRowElevenLabs.innerHTML = `
        <label class="tts-dropdown-label">Model</label>
        <select class="tts-dropdown" data-key="elevenlabs_modelId"></select>
        <label class="tts-dropdown-label">Default voice</label>
        <select class="tts-dropdown" data-key="elevenlabs_defaultVoice"></select>
        <label class="tts-dropdown-label">Voice for "${botName}"</label>
        <select class="tts-dropdown" data-key="elevenlabs_charVoice_${botName}"></select>
        <label class="tts-dropdown-label">Voice for "${userPersona}" (You)</label>
        <select class="tts-dropdown" data-key="elevenlabs_userVoice_${userPersona}"></select>
    `;
  settingsElevenLabs.appendChild(dropdownRowElevenLabs);

  // Panel Gemini TTS (single-speaker)
  const settingsGemini = document.createElement("div");
  settingsGemini.id = "tts-settings-gemini";
  settingsGemini.style.display = "none";
  settingsGemini.style.flexDirection = "column";
  settingsGemini.style.gap = "12px";

  // Gemini API Key (no validation call, just stored)
  const geminiApiRow = document.createElement("div");
  geminiApiRow.className = "tts-dropdown-row";
  geminiApiRow.style.paddingBottom = "18px";
  geminiApiRow.style.marginBottom = "0";
  geminiApiRow.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";
  const geminiApiLabel = document.createElement("label");
  geminiApiLabel.className = "tts-dropdown-label";
  geminiApiLabel.textContent = "Gemini API Key";
  const geminiApiContainer = document.createElement("div");
  geminiApiContainer.className = 'tts-api-key-container';
  const geminiApiInput = document.createElement("textarea");
  geminiApiInput.dataset.key = "gemini_apiKey";
  geminiApiInput.value = getSetting("gemini_apiKey", "");
  geminiApiInput.placeholder = "Enter your Gemini API Key";

  // Ocultar/mostrar clave (mismo patrón que ElevenLabs)
  let geminiKeyHidden = true;
  const geminiOriginalKey = geminiApiInput.value;
  function maskGeminiKey(key) { return key.length > 0 ? '•'.repeat(key.length) : ''; }
  if (geminiOriginalKey) { geminiApiInput.value = maskGeminiKey(geminiOriginalKey); geminiApiInput.dataset.original = geminiOriginalKey; }
  geminiApiInput.addEventListener('focus', () => {
    if (geminiKeyHidden && geminiApiInput.dataset.original) { geminiApiInput.value = geminiApiInput.dataset.original; geminiKeyHidden = false; }
  });
  geminiApiInput.addEventListener('blur', () => {
    geminiApiInput.dataset.original = geminiApiInput.value;
    geminiApiInput.value = maskGeminiKey(geminiApiInput.value);
    geminiKeyHidden = true;
  });
  geminiApiInput.addEventListener('input', () => { geminiApiInput.dataset.original = geminiApiInput.value; });

  geminiApiContainer.appendChild(geminiApiInput);
  geminiApiRow.appendChild(geminiApiLabel);
  geminiApiRow.appendChild(geminiApiContainer);
  settingsGemini.appendChild(geminiApiRow);

  // Gemini checkboxes (same options, prefixed)
  const checkboxListGemini = document.createElement("div");
  checkboxListGemini.className = "tts-checkbox-list";
  CHECKBOX_OPTIONS.forEach(opt => {
    const row = document.createElement("div");
    row.className = "tts-checkbox-row";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = `gemini-${opt.id}`;
    cb.dataset.key = `gemini_${opt.id}`;
    cb.className = "tts-checkbox";
    cb.checked = !!getSetting(cb.dataset.key, opt.default);
    const label = document.createElement("label");
    label.htmlFor = cb.id;
    label.textContent = opt.label;
    row.appendChild(cb);
    row.appendChild(label);
    checkboxListGemini.appendChild(row);
  });
  settingsGemini.appendChild(checkboxListGemini);

  // Gemini Static Style toggle + textarea
  const geminiStyleRow = document.createElement("div");
  geminiStyleRow.className = "tts-dropdown-row";

  const geminiStyleCheckboxRow = document.createElement("div");
  geminiStyleCheckboxRow.className = "tts-checkbox-row";
  const geminiStyleCheckbox = document.createElement("input");
  geminiStyleCheckbox.type = "checkbox";
  geminiStyleCheckbox.id = "gemini-static-style";
  geminiStyleCheckbox.dataset.key = "gemini_static_style_enabled";
  geminiStyleCheckbox.className = "tts-checkbox";
  geminiStyleCheckbox.checked = !!getSetting("gemini_static_style_enabled", false);
  const geminiStyleCheckboxLabel = document.createElement("label");
  geminiStyleCheckboxLabel.htmlFor = geminiStyleCheckbox.id;
  geminiStyleCheckboxLabel.textContent = "Static Style";
  geminiStyleCheckboxRow.appendChild(geminiStyleCheckbox);
  geminiStyleCheckboxRow.appendChild(geminiStyleCheckboxLabel);

  const geminiStyleTextareaLabel = document.createElement("label");
  geminiStyleTextareaLabel.className = "tts-dropdown-label";
  geminiStyleTextareaLabel.textContent = "Static style prompt (used for all Gemini TTS when enabled)";

  const geminiStyleTextarea = document.createElement("textarea");
  geminiStyleTextarea.dataset.key = "gemini_static_style_text";
  geminiStyleTextarea.placeholder = "Write the style instructions to prepend before every Gemini TTS generation.";
  geminiStyleTextarea.style.minHeight = "80px";
  geminiStyleTextarea.style.resize = "none";
  geminiStyleTextarea.style.padding = "10px 14px";
  geminiStyleTextarea.style.borderRadius = "8px";
  geminiStyleTextarea.style.border = "1px solid rgba(255, 255, 255, 0.08)";
  geminiStyleTextarea.style.background = "rgba(255, 255, 255, 0.05)";
  geminiStyleTextarea.style.color = "rgba(255, 255, 255, 0.95)";
  geminiStyleTextarea.style.fontFamily = "'Segoe UI', system-ui, sans-serif";
  geminiStyleTextarea.style.fontSize = "0.95rem";
  geminiStyleTextarea.value = getSetting("gemini_static_style_text", "");

  // Show/hide style textarea depending on toggle
  function updateGeminiStyleVisibility() {
    geminiStyleTextareaLabel.style.display = geminiStyleCheckbox.checked ? "block" : "none";
    geminiStyleTextarea.style.display = geminiStyleCheckbox.checked ? "block" : "none";
  }
  geminiStyleCheckbox.addEventListener("change", updateGeminiStyleVisibility);
  updateGeminiStyleVisibility();

  geminiStyleRow.appendChild(geminiStyleCheckboxRow);
  geminiStyleRow.appendChild(geminiStyleTextareaLabel);
  geminiStyleRow.appendChild(geminiStyleTextarea);
  settingsGemini.appendChild(geminiStyleRow);

  // Gemini model + voice dropdowns
  const dropdownRowGemini = document.createElement("div");
  dropdownRowGemini.className = "tts-dropdown-row";
  dropdownRowGemini.innerHTML = `
    <label class="tts-dropdown-label">Model</label>
    <select class="tts-dropdown" data-key="gemini_modelId"></select>
    <label class="tts-dropdown-label">Default voice</label>
    <select class="tts-dropdown" data-key="gemini_defaultVoice"></select>
    <label class="tts-dropdown-label">Voice for "${botName}"</label>
    <select class="tts-dropdown" data-key="gemini_charVoice_${botName}"></select>
    <label class="tts-dropdown-label">Voice for "${userPersona}" (You)</label>
    <select class="tts-dropdown" data-key="gemini_userVoice_${userPersona}"></select>
  `;

  // Populate Gemini model + voices
  const geminiModelSelect = dropdownRowGemini.querySelector('[data-key="gemini_modelId"]');
  GEMINI_TTS_MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.label;
    geminiModelSelect.appendChild(opt);
  });
  geminiModelSelect.value = getSetting('gemini_modelId', GEMINI_TTS_MODELS[0]?.id || 'gemini-2.5-flash-preview-tts');

  const geminiVoiceDropdowns = dropdownRowGemini.querySelectorAll('[data-key^="gemini_"]');
  geminiVoiceDropdowns.forEach(dd => {
    if (dd.dataset.key === 'gemini_modelId') return;
    dd.innerHTML = `<option value="Default">Default</option>`;
    GEMINI_TTS_VOICES.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = v.label;
      dd.appendChild(opt);
    });
    const key = dd.dataset.key;
    const fallbackKey = key.includes('charVoice') || key.includes('userVoice') ? 'gemini_defaultVoice' : 'Default';
    dd.value = getSetting(key, getSetting(fallbackKey, 'Default'));
  });

  settingsGemini.appendChild(dropdownRowGemini);

  mainBody.appendChild(settingsBuiltIn);
  mainBody.appendChild(settingsElevenLabs);
  mainBody.appendChild(settingsGemini);

    validateBtn.addEventListener('click', async () => {
        const key = apiKeyInput.dataset.original || apiKeyInput.value;
        if (!key) {
            apiKeyStatus.textContent = "API Key is empty.";
            apiKeyStatus.className = "tts-api-key-status error";
            return;
        }
        apiKeyStatus.textContent = "Validating...";
        apiKeyStatus.className = "tts-api-key-status";
        validateBtn.disabled = true;

        const validation = await validateElevenLabsKey(key);
        apiKeyStatus.textContent = validation.message;
        apiKeyStatus.className = `tts-api-key-status ${validation.isValid ? 'success' : 'error'}`;

        if (validation.isValid) {
            await fetchAndPopulateElevenLabsData(key);
            const currentSettings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
            currentSettings.elevenlabs_apiKey = key;
            localStorage.setItem("ttsSettings", JSON.stringify(currentSettings));
        }
        validateBtn.disabled = false;
    });

    async function fetchAndPopulateElevenLabsData(apiKey) {
        try {
            const [voices, models] = await Promise.all([
                elevenLabsApiRequest({ method: "GET", endpoint: "/v1/voices", apiKey }),
                elevenLabsApiRequest({ method: "GET", endpoint: "/v1/models", apiKey })
            ]);

            elevenLabsVoices = voices.voices || [];
            elevenLabsModels = models.filter(m => m.can_do_text_to_speech) || [];

            // Modelo
            const modelSelect = dropdownRowElevenLabs.querySelector('[data-key="elevenlabs_modelId"]');
            modelSelect.innerHTML = '';
            elevenLabsModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.model_id;
                option.textContent = model.name;
                modelSelect.appendChild(option);
            });
            modelSelect.value = getSetting('elevenlabs_modelId', elevenLabsModels[0]?.model_id || '');

            // Voces
            const dropdownsEL = dropdownRowElevenLabs.querySelectorAll('[data-key^="elevenlabs_"], [data-key*="Voice"]');
            dropdownsEL.forEach(dd => {
                if(dd.dataset.key === 'elevenlabs_modelId') return;
                const currentVal = dd.value;
                dd.innerHTML = `<option value="Default">Default</option>`;
                const categorized = { 'Premade': [], 'Cloned': [] };
                elevenLabsVoices.forEach(v => {
                    if(v.category === 'premade') categorized.Premade.push(v);
                    else categorized.Cloned.push(v);
                });
                Object.keys(categorized).forEach(category => {
                    const voicesInCategory = categorized[category];
                    if(voicesInCategory.length > 0){
                        const optgroup = document.createElement('optgroup');
                        optgroup.label = `${category} (${voicesInCategory.length})`;
                        voicesInCategory.forEach(voice => {
                            const option = document.createElement('option');
                            option.value = voice.voice_id;
                            option.textContent = voice.name;
                            option.dataset.previewUrl = voice.preview_url || '';
                            optgroup.appendChild(option);
                        });
                        dd.appendChild(optgroup);
                    }
                });
                const key = dd.dataset.key;
                const fallbackKey = key.includes('charVoice') || key.includes('userVoice') ? 'elevenlabs_defaultVoice' : 'Default';
                dd.value = getSetting(key, getSetting(fallbackKey, 'Default'));

                // Add event listener to play preview when voice changes
                dd.addEventListener('change', (event) => {
                    const selectedOption = event.target.options[event.target.selectedIndex];
                    const previewUrl = selectedOption.dataset.previewUrl;
                    if (previewUrl) {
                        playVoicePreview(previewUrl);
                    }
                });
            });

        } catch (error) {
            console.error("TTS Userscript: Failed to fetch ElevenLabs data:", error);
            apiKeyStatus.textContent = `Failed to get voices/models: ${error.message}`;
            apiKeyStatus.className = "tts-api-key-status error";
        }
    }

    // Cambio de proveedor
    providerSelect.onchange = () => {
      if (providerSelect.value === 'builtin') {
        settingsBuiltIn.style.display = 'flex';
        settingsElevenLabs.style.display = 'none';
        settingsGemini.style.display = 'none';
      } else if (providerSelect.value === 'elevenlabs') {
        settingsBuiltIn.style.display = 'none';
        settingsElevenLabs.style.display = 'flex';
        settingsGemini.style.display = 'none';
        const key = getSetting("elevenlabs_apiKey", "");
        if(key) fetchAndPopulateElevenLabsData(key);
      } else if (providerSelect.value === 'gemini') {
        settingsBuiltIn.style.display = 'none';
        settingsElevenLabs.style.display = 'none';
        settingsGemini.style.display = 'flex';
      }
    };
    setTimeout(() => { providerSelect.onchange(); }, 0);

    // Footer guardar/cancelar
    const footer = document.createElement("div");
    footer.className = "tts-modal-footer";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "tts-modal-btn cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => {
        stopPreviewAudio();
        overlay.style.display = "none";
    };

  const saveBtn = document.createElement("button");
    saveBtn.className = "tts-modal-btn save";
    saveBtn.textContent = "Save Settings";
    saveBtn.onclick = () => {
    const prevSettings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    const newSettings = { ...prevSettings, provider: providerSelect.value };

    // Built-in & ElevenLabs settings
    document.querySelectorAll('#tts-settings-builtin [data-key], #tts-settings-elevenlabs [data-key]').forEach(el => {
          const key = el.dataset.key;
          if (key === 'elevenlabs_apiKey') {
              if (el.dataset.original) newSettings[key] = el.dataset.original;
          } else if (el.type === 'checkbox') {
              newSettings[key] = el.checked;
          } else if (el.type === 'range' || el.classList.contains('tts-slider-value')) {
              newSettings[key] = parseFloat(el.value);
          } else {
              newSettings[key] = el.value;
          }
      });

    // Gemini TTS (API) settings stored separately with gemini_ prefix
    document.querySelectorAll('#tts-settings-gemini [data-key]').forEach(el => {
      const key = el.dataset.key;
      if (!key) return;
      if (key === 'gemini_apiKey') {
        if (el.dataset.original) newSettings[key] = el.dataset.original;
        else newSettings[key] = el.value;
      } else if (el.type === 'checkbox') {
        newSettings[key] = el.checked;
      } else if (el.type === 'range' || el.classList.contains('tts-slider-value')) {
        newSettings[key] = parseFloat(el.value);
      } else {
        newSettings[key] = el.value;
      }
    });

      localStorage.setItem("ttsSettings", JSON.stringify(newSettings));
      stopPreviewAudio();
      overlay.style.display = "none";
      document.querySelectorAll('.temp-btn').forEach(btn => btn.remove());
      document.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectTempButton);
    };
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    container.appendChild(header);
    container.appendChild(mainBody);
    container.appendChild(footer);
    overlay.appendChild(container);

    document.body.appendChild(overlay);
    return overlay;
  }

  let ttsMenuOverlay = null;

  // ==========================================================
  // SECCIÓN 5. INYECCIÓN EN EL MENÚ DE LA APP
  // ----------------------------------------------------------
  // - Añade entrada "Text to Speech" en el menú de JanitorAI
  // - Abre modal de configuración al hacer click
  // ==========================================================

  const MENU_LIST_SELECTOR = '[class^="_menuList_"]';
  const MENU_ITEM_CLASS = '[class^="_menuItem_"]';
  const TTS_BUTTON_ID = 'tts-menu-item';

  const bodyObserver = new MutationObserver(() => { injectTTSMenuItem(); });
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  function injectTTSMenuItem() {
    const menuList = document.querySelector(MENU_LIST_SELECTOR);
    if (!menuList) return;
    if (menuList.querySelector(`#${TTS_BUTTON_ID}`)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    const firstMenuItem = menuList.querySelector(MENU_ITEM_CLASS);
    btn.className = firstMenuItem ? firstMenuItem.className : '';
    btn.id = TTS_BUTTON_ID;
    btn.innerHTML = `
      <span class="_menuItemIcon_1fzcr_81">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-audio-lines-icon">
          <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/>
          <path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
        </svg>
      </span>
      <span class="_menuItemContent_1fzcr_96">Text to Speech</span>
    `;
    btn.addEventListener('click', function() {
      if (ttsMenuOverlay) ttsMenuOverlay.remove();
      ttsMenuOverlay = createTTSMenu();
      ttsMenuOverlay.style.display = "flex";
    });

    const menuItems = Array.from(menuList.querySelectorAll(MENU_ITEM_CLASS));
    let inserted = false;
    for (let i = 0; i < menuItems.length; i++) {
      const span = menuItems[i].querySelector('span[class*="_menuItemContent_"]');
      if (span && span.textContent.trim() === "Generation Settings") {
        if (menuItems[i].nextSibling) {
          menuList.insertBefore(btn, menuItems[i].nextSibling);
        } else {
          menuList.appendChild(btn);
        }
        inserted = true;
        break;
      }
    }
    if (!inserted) menuList.appendChild(btn);
  }

  // ==========================================================
  // SECCIÓN 6. MOTOR DE TTS (Built-in y ElevenLabs)
  // ----------------------------------------------------------
  // - Reproduce TTS según proveedor elegido
  // - Emite eventos para Live2D (stop, blobURL, audioBuffer)
  // - Segmenta audio según EmotionQueue+Alignment (si aplica)
  // ==========================================================

  let currentUtterance = null;
  let currentElevenLabsAudio = null;
  let currentPreviewAudio = null; // For voice preview playback
  let isPlaying = false; // Track global playing state

  function updateAllButtonStates(playing) {
      isPlaying = playing;
      const svg = playing ? STOP_SVG : PLAY_SVG;
      document.querySelectorAll('.temp-btn').forEach(button => {
          button.innerHTML = svg;
      });
  }

  function playTTS(text, isBot) {
      const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
      const provider = settings.provider || 'builtin';

    if (provider === 'elevenlabs') {
      playElevenLabsTTS(text, isBot, settings);
    } else if (provider === 'gemini') {
      playGeminiTTSTTS(text, isBot, settings);
    } else {
      playBuiltinTTS(text, isBot, settings);
    }
  }

  function stopTTS() {
      // Detener Built-in
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
      }
      // Detener ElevenLabs
      if (currentElevenLabsAudio) {
          currentElevenLabsAudio.pause();
          currentElevenLabsAudio.src = '';
          currentElevenLabsAudio = null;
      }
      // Actualizar todos los botones
      updateAllButtonStates(false);
  }

  // Voice preview functions
  function stopPreviewAudio() {
      if (currentPreviewAudio) {
          currentPreviewAudio.pause();
          currentPreviewAudio.src = '';
          currentPreviewAudio = null;
      }
  }

  function playVoicePreview(previewUrl) {
      if (!previewUrl) return;
      stopPreviewAudio();
      currentPreviewAudio = new Audio(previewUrl);
      currentPreviewAudio.play().catch(e => console.error("Error playing voice preview:", e));
  }

  // Gemini TTS (single-speaker, PCM -> WAV in browser)
  async function playGeminiTTSTTS(text, isBot, settings) {
    const apiKey = settings.gemini_apiKey;
    if (!settings['gemini_tts-enabled'] || !apiKey) { stopTTS(); return; }

    // If Live2D is active, use emotion analysis (single segment) and send queue to Live2D

    if (live2dScriptDetected) {
      console.log("🎭 [Gemini] Live2D detected - starting whole-utterance emotion analysis and queue dispatch");

      try {
        // 1. Process text with the same filters used elsewhere
        console.log("📝 [Gemini] Step 1: Processing text with TTS filters...");
        const { processed: processedText } = processTTSOutput(text);

        if (!processedText || processedText.trim() === '') {
          console.warn("⚠️ [Gemini] Processed text is empty after filters, skipping Gemini TTS + Live2D");
          return;
        }
        console.log(`✓ [Gemini] Text processed: ${processedText.length} characters`);

        // 2. Resolve speaker names (needed for voice selection in parallel call)
        console.log("👤 [Gemini] Step 2: Resolving speaker names...");
        try {
          const botNameElem = document.querySelector('[class^="_nameText_"]');
          if (botNameElem && botNameElem.textContent.trim()) botName = botNameElem.textContent.trim();
        } catch (e) {
          console.warn("⚠️ [Gemini] Could not get bot name:", e);
        }
        let userPersona = "User";
        try {
          const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
          for (let i = allMessageNodes.length - 1; i >= 0; i--) {
            const node = allMessageNodes[i];
            if (!node.querySelector('[class^="_nameIcon_"]')) {
              const nameElem = node.querySelector('[class^="_nameText_"]');
              if (nameElem && nameElem.textContent.trim()) { userPersona = nameElem.textContent.trim(); break; }
            }
          }
        } catch (e) {
          console.warn("⚠️ [Gemini] Could not get user persona:", e);
        }
        console.log(`✓ [Gemini] Bot: "${botName}", User: "${userPersona}"`);

        // 3. Resolve voice
        console.log("🎤 [Gemini] Step 3: Resolving voice configuration...");
        let voiceName;
        if (isBot) voiceName = settings[`gemini_charVoice_${botName}`] || settings.gemini_defaultVoice;
        else voiceName = settings[`gemini_userVoice_${userPersona}`] || settings.gemini_defaultVoice;

        if (!voiceName || voiceName === 'Default') {
          console.error("❌ [Gemini] No Gemini voice selected for this speaker.");
          return;
        }
        console.log(`✓ [Gemini] Using voice: ${voiceName}`);

        const modelId = settings.gemini_modelId || 'gemini-2.5-flash-preview-tts';
        const playbackSpeed = parseFloat(settings.gemini_playbackSpeed) || 1.0;

        // 4. Build final text depending on static style setting
        console.log("🎨 [Gemini] Step 4: Building style prompt...");
        const staticStyleEnabled = !!settings.gemini_static_style_enabled;
        let finalText;
        if (staticStyleEnabled && settings.gemini_static_style_text) {
          finalText = `${settings.gemini_static_style_text}\n${processedText}`;
        } else {
          const defaultStyle = `### ROLE AND PERSONA
You are a professional voice actor specializing in realistic, naturalistic roleplay narration.

### VOICE PROFILE
1.  **Base Tone:** Low, quiet, and measured. A steady, grounded hum.
2.  **Performance Style:** Understated and conversational. Use a "less is more" approach.
3.  **Negative Constraints (Crucial):**
    -   **No Theatrics:** Do not sound exaggerated, melodramatic, or "acty."
    -   **No Sultry Tone:** Do not use a breathy or seductive voice.
    -   **No Cartoons:** Avoid high-pitch spikes or anime-style exclamations. Keep it human.

### INSTRUCTIONS
1.  **Narrate Everything:** Read every word provided, including the descriptive text (narration) and the dialogue.
2.  **Context-Driven Emotion:** You must analyze the narration to understand the character's mental state, but express it subtly.
    -   **Subtlety is Key:** If the text describes anger, do not shout. Instead, drop your pitch and speak with cold intensity. If the text describes excitement, do not get loud; just quicken your pace slightly.
    -   **Continuity:** Ensure the narration and the dialogue flow together as one cohesive story, not two separate voices.

### EXAMPLE

**Input:**
*The guard slams his hand against the table, causing the mugs to rattle.*
"I told you already," *he hisses through gritted teeth, leaning in close so no one else hears,* "I don't have the money."

**Required Performance Logic:**
1.  **Narration (*The guard slams...*):** Read this calmly but firmly to set the weight of the action.
2.  **Dialogue ("I told you already")::** The text says "hisses" and "leaning in close." Do NOT shout. Whisper-talk this line with a tight, sharp intensity.
3.  **Narration (*he hisses...*):** Maintain the low, measured storytelling tone.
4.  **Dialogue ("I don't have the money")::** Deliver this with finality and a flat, cold tone.

**HERE'S THE TEXT YOU MUST NARRATE FOLLOWING ALL PREVIOUS INSTRUCTIONS, DO NOT NARRATE ANY OTHER TEXT:**
`;
          finalText = `${defaultStyle}\n${processedText}`;
        }

        const body = {
          contents: [ { parts: [ { text: finalText } ] } ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        };

        // ⚡ OPTIMIZATION: Execute Gemini emotion analysis and TTS generation in PARALLEL
        console.log("⚡ [Gemini] Step 5: Starting PARALLEL execution of emotion analysis and TTS generation...");
        updateAllButtonStates(true);

        const parallelStartTime = performance.now();

        // Create promises for both operations
        const emotionAnalysisPromise = analyzeTextWithGemini(processedText)
          .then(segments => {
            console.log(`✓ [Gemini] Emotion analysis completed (${((performance.now() - parallelStartTime) / 1000).toFixed(2)}s)`);
            return segments;
          })
          .catch(err => {
            console.warn("⚠️ [Gemini] Emotion analysis failed, will use Neutral:", err);
            return null;
          });

        const ttsGenerationPromise = new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "POST",
            url: `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey
            },
            data: JSON.stringify(body),
            onload: async (res) => {
              if (res.status < 200 || res.status >= 300) {
                reject(new Error(`HTTP ${res.status}: ${res.responseText}`));
                return;
              }
              try {
                const json = JSON.parse(res.responseText);
                const base64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (!base64) {
                  reject(new Error("No audio in response"));
                  return;
                }
                console.log(`✓ [Gemini] TTS generation completed (${((performance.now() - parallelStartTime) / 1000).toFixed(2)}s)`);
                resolve({ base64, json });
              } catch (e) {
                reject(e);
              }
            },
            onerror: (err) => reject(new Error("TTS request failed: " + err))
          });
        });

        // Wait for BOTH operations to complete in parallel
        console.log("⏳ [Gemini] Waiting for parallel operations to complete...");
        const [emotionSegments, ttsResult] = await Promise.all([emotionAnalysisPromise, ttsGenerationPromise]);
        
        const parallelTotalTime = ((performance.now() - parallelStartTime) / 1000).toFixed(2);
        console.log(`⚡ [Gemini] ✓ PARALLEL execution completed in ${parallelTotalTime}s (vs sequential: would take ~${(parseFloat(parallelTotalTime) * 1.5).toFixed(2)}s)`);

        // Process emotion analysis results
        const mainSeg = (emotionSegments && emotionSegments[0]) || { emotion: "Neutral", action: null, text: processedText };
        const mainEmotion = mainSeg.emotion || "Neutral";
        const mainAction = mainSeg.action || null;
        console.log(`✓ [Gemini] Main emotion: ${mainEmotion}${mainAction ? `, action: ${mainAction}` : ''}`);

        // Process TTS results
        try {
          const { base64 } = ttsResult;
          console.log("🔄 [Gemini] Step 6: Decoding PCM16 audio and wrapping as WAV blob...");
              const pcmBuffer = base64ToArrayBuffer(base64);
              const wavBuffer = createWavFromPCM(pcmBuffer, 24000, 1, 16);
              const blob = new Blob([wavBuffer], { type: 'audio/wav' });
              const url = URL.createObjectURL(blob);

              // Build a single segment queue item
              console.log("📦 [Gemini] Building single emotion segment for Live2D...");
              const singleSegment = {
                emotion: mainEmotion,
                action: mainAction,
                text: mainSeg.text || processedText,
                blobUrl: url,
                startTime: 0,
                endTime: null,
                duration: null
              };

          const audioElement = new Audio(url);
          audioElement.onloadedmetadata = () => {
            singleSegment.duration = audioElement.duration;
            singleSegment.endTime = audioElement.duration;

            console.log("⏱️ [Gemini] Step 7: Audio duration:", audioElement.duration, "seconds");
            console.log("📤 [Gemini] Step 8: Dispatching 'TTSEmotionSegmentsReady' to Live2D with a single segment...");

                const event = new CustomEvent('TTSEmotionSegmentsReady', {
                  detail: {
                    segments: [singleSegment],
                    totalDuration: audioElement.duration,
                    sampleRate: 24000
                  }
                });
                window.dispatchEvent(event);

                console.log("✅ [Gemini] Single-segment emotion queue dispatched to Live2D");
                updateAllButtonStates(false);
              };

              // Don't play directly: Live2D script will control playback using the blobUrl
              audioElement.onerror = () => {
                console.error("❌ [Gemini] Error loading audio metadata for duration");
                updateAllButtonStates(false);
              };

              // Force metadata load
              audioElement.load();

          audioElement.onerror = (e) => {
            console.error("❌ [Gemini] Failed to load audio for duration check:", e);
            updateAllButtonStates(false);
          };

        } catch (error) {
          console.error("❌ [Gemini] Error processing audio:", error);
          updateAllButtonStates(false);
        }

      } catch (e) {
        console.error("❌ [Gemini] Unexpected error in Live2D flow", e);
        updateAllButtonStates(false);
      }

      // Live2D will handle playback using the blobUrl queue
      return;
    }

    // If Live2D is NOT active, fall back to local playback (original behavior)
    stopTTS();

    // Resolve speaker names
    let botName = "char";
    try {
        const botNameElem = document.querySelector('[class^="_nameText_"]');
        if (botNameElem && botNameElem.textContent.trim()) botName = botNameElem.textContent.trim();
    } catch (e) {}
    let userPersona = "User";
    try {
        const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
        for (let i = allMessageNodes.length - 1; i >= 0; i--) {
            const node = allMessageNodes[i];
            if (!node.querySelector('[class^="_nameIcon_"]')) {
                const nameElem = node.querySelector('[class^="_nameText_"]');
                if (nameElem && nameElem.textContent.trim()) { userPersona = nameElem.textContent.trim(); break; }
            }
        }
    } catch (e) {}

    // Resolve voice
    let voiceName;
    if (isBot) voiceName = settings[`gemini_charVoice_${botName}`] || settings.gemini_defaultVoice;
    else voiceName = settings[`gemini_userVoice_${userPersona}`] || settings.gemini_defaultVoice;
    if (!voiceName || voiceName === 'Default') {
        console.error("TTS Userscript: No Gemini voice selected for this speaker.");
        return;
    }

    const modelId = settings.gemini_modelId || 'gemini-2.5-flash-preview-tts';
    const playbackSpeed = parseFloat(settings.gemini_playbackSpeed) || 1.0;

    // Build final text depending on static style setting
    const staticStyleEnabled = !!settings.gemini_static_style_enabled;
    let finalText;
    if (staticStyleEnabled && settings.gemini_static_style_text) {
      finalText = `${settings.gemini_static_style_text}\n${text}`;
    } else {
      // Default style prompt when Static Style is disabled or empty
      const defaultStyle = `### ROLE AND PERSONA
You are a professional voice actor specializing in realistic, naturalistic roleplay narration.

### VOICE PROFILE
1.  **Base Tone:** Low, quiet, and measured. A steady, grounded hum.
2.  **Performance Style:** Understated and conversational. Use a "less is more" approach.
3.  **Negative Constraints (Crucial):**
    -   **No Theatrics:** Do not sound exaggerated, melodramatic, or "acty."
    -   **No Sultry Tone:** Do not use a breathy or seductive voice.
    -   **No Cartoons:** Avoid high-pitch spikes or anime-style exclamations. Keep it human.

### INSTRUCTIONS
1.  **Narrate Everything:** Read every word provided, including the descriptive text (narration) and the dialogue.
2.  **Context-Driven Emotion:** You must analyze the narration to understand the character's mental state, but express it subtly.
    -   **Subtlety is Key:** If the text describes anger, do not shout. Instead, drop your pitch and speak with cold intensity. If the text describes excitement, do not get loud; just quicken your pace slightly.
    -   **Continuity:** Ensure the narration and the dialogue flow together as one cohesive story, not two separate voices.

### EXAMPLE

**Input:**
*The guard slams his hand against the table, causing the mugs to rattle.*
"I told you already," *he hisses through gritted teeth, leaning in close so no one else hears,* "I don't have the money."

**Required Performance Logic:**
1.  **Narration (*The guard slams...*):** Read this calmly but firmly to set the weight of the action.
2.  **Dialogue ("I told you already")::** The text says "hisses" and "leaning in close." Do NOT shout. Whisper-talk this line with a tight, sharp intensity.
3.  **Narration (*he hisses...*):** Maintain the low, measured storytelling tone.
4.  **Dialogue ("I don't have the money")::** Deliver this with finality and a flat, cold tone.

**HERE'S THE TEXT YOU MUST NARRATE FOLLOWING ALL PREVIOUS INSTRUCTIONS, DO NOT NARRATE ANY OTHER TEXT:**
`;
      finalText = `${defaultStyle}\n${text}`;
    }

    const body = {
      contents: [ { parts: [ { text: finalText } ] } ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    };

    updateAllButtonStates(true);

    try {
      GM_xmlhttpRequest({
        method: "POST",
        url: `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        data: JSON.stringify(body),
        onload: async (res) => {
          if (res.status < 200 || res.status >= 300) {
            console.error("Gemini TTS HTTP error", res.status, res.responseText);
            updateAllButtonStates(false);
            return;
          }
          try {
            const json = JSON.parse(res.responseText);
            const base64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64) {
              console.error("Gemini TTS: no audio in response", json);
              updateAllButtonStates(false);
              return;
            }

            // PCM16 mono @24kHz by spec
            const pcmBuffer = base64ToArrayBuffer(base64);
            const wavBuffer = createWavFromPCM(pcmBuffer, 24000, 1, 16);
            const blob = new Blob([wavBuffer], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);

            currentElevenLabsAudio = new Audio(url); // reuse same audio holder
            currentElevenLabsAudio.playbackRate = playbackSpeed;
            currentElevenLabsAudio.onended = () => { updateAllButtonStates(false); currentElevenLabsAudio = null; };
            currentElevenLabsAudio.onerror = () => { updateAllButtonStates(false); currentElevenLabsAudio = null; };
            currentElevenLabsAudio.play();
          } catch (e) {
            console.error("Gemini TTS parse/play error", e);
            updateAllButtonStates(false);
          }
        },
        onerror: (e) => {
          console.error("Gemini TTS network error", e);
          updateAllButtonStates(false);
        }
      });
    } catch (e) {
      console.error("Gemini TTS unexpected error", e);
      updateAllButtonStates(false);
    }
  }

  // Built-in (Web Speech)
  function playBuiltinTTS(text, isBot, settings) {
    if (!settings['tts-enabled']) { stopTTS(); return; }
    if (!window.speechSynthesis || !text || typeof text !== 'string') return;
    stopTTS();

    const utter = new SpeechSynthesisUtterance(text);
    currentUtterance = utter;

    utter.rate = parseFloat(settings.playbackSpeed) || 1.0;
    utter.pitch = 1;

    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length === 0) {
      window.speechSynthesis.speak(utter);
      updateAllButtonStates(true);
      return;
    }

    let defaultVoice = allVoices.find(v => v.lang === 'en-US' && v.default) || allVoices.find(v => v.lang === 'en-US') || allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
    let botName = "char";
    try {
      const botNameElem = document.querySelector('[class^="_nameText_"]');
      if (botNameElem && botNameElem.textContent.trim()) botName = botNameElem.textContent.trim();
    } catch (e) {}
    let userPersona = "User";
    try {
      const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
      for (let i = allMessageNodes.length - 1; i >= 0; i--) {
        const node = allMessageNodes[i];
        if (!node.querySelector('[class^="_nameIcon_"]')) {
          const nameElem = node.querySelector('[class^="_nameText_"]');
          if (nameElem && nameElem.textContent.trim()) { userPersona = nameElem.textContent.trim(); break; }
        }
      }
    } catch (e) {}
    let targetVoiceName = 'Default';
    if (isBot) {
      targetVoiceName = settings[`charVoice_${botName}`] || settings.defaultVoice || 'Default';
    } else {
      targetVoiceName = settings[`userVoice_${userPersona}`] || settings.defaultVoice || 'Default';
    }
    let selectedVoice = (targetVoiceName !== 'Default') ? allVoices.find(v => v.name === targetVoiceName) : null;
    utter.voice = selectedVoice || defaultVoice;

    utter.onstart = () => { updateAllButtonStates(true); };
    utter.onend = () => { updateAllButtonStates(false); };
    utter.onerror = () => { updateAllButtonStates(false); };

    window.speechSynthesis.speak(utter);
  }

  // ElevenLabs (con timestamps, WAV generation y AudioBuffer)
  async function playElevenLabsTTS(text, isBot, settings) {
    const apiKey = settings.elevenlabs_apiKey;
    if (!settings['elevenlabs_tts-enabled'] || !apiKey) { stopTTS(); return; }

    // Si Live2D está activo, usar análisis de Gemini y segmentación de audio
    if (live2dScriptDetected) {
        console.log("🎭 Live2D script detected - Starting emotion-based audio segmentation");

        try {
            // 1. Procesar el texto según los ajustes del usuario
            console.log("📝 Step 1: Processing text with TTS filters...");
            const { processed: processedText } = processTTSOutput(text);

            if (!processedText || processedText.trim() === '') {
                console.warn("⚠️ Processed text is empty after filters, skipping emotion analysis");
                return;
            }
            console.log(`✓ Text processed: ${processedText.length} characters`);

            // 2. Obtener nombre del personaje/usuario (needed for voice selection in parallel call)user names...");
            let botName = "char";
            try {
                const botNameElem = document.querySelector('[class^="_nameText_"]');
                if (botNameElem && botNameElem.textContent.trim()) botName = botNameElem.textContent.trim();
            } catch (e) {
                console.warn("⚠️ Could not get bot name:", e);
            }
            let userPersona = "User";
            try {
                const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
                for (let i = allMessageNodes.length - 1; i >= 0; i--) {
                    const node = allMessageNodes[i];
                    if (!node.querySelector('[class^="_nameIcon_"]')) {
                        const nameElem = node.querySelector('[class^="_nameText_"]');
                        if (nameElem && nameElem.textContent.trim()) { userPersona = nameElem.textContent.trim(); break; }
                    }
                }
            } catch (e) {
                console.warn("⚠️ Could not get user persona:", e);
            }
            console.log(`✓ Bot: "${botName}", User: "${userPersona}"`);

            // 3. Obtener configuración de voz
            console.log("🎤 Step 3: Getting voice configuration...");
            let voiceId;
            if (isBot) voiceId = settings[`elevenlabs_charVoice_${botName}`] || settings.elevenlabs_defaultVoice;
            else voiceId = settings[`elevenlabs_userVoice_${userPersona}`] || settings.elevenlabs_defaultVoice;

            if (!voiceId || voiceId === 'Default') {
                console.error("❌ No ElevenLabs voice selected for this speaker.");
                console.error(`   Looking for: ${isBot ? `elevenlabs_charVoice_${botName}` : `elevenlabs_userVoice_${userPersona}`}`);
                console.error(`   Fallback: elevenlabs_defaultVoice = ${settings.elevenlabs_defaultVoice}`);
                return;
            }
            console.log(`✓ Using voice ID: ${voiceId}`);

            // 4. Preparar request body
            console.log("⚙️ Step 4: Preparing ElevenLabs request...");
            const stability = typeof settings.elevenlabs_stability !== "undefined" ? parseFloat(settings.elevenlabs_stability) : 0.50;
            const similarity = typeof settings.elevenlabs_similarity !== "undefined" ? parseFloat(settings.elevenlabs_similarity) : 0.75;
            const style = typeof settings.elevenlabs_style !== "undefined" ? parseFloat(settings.elevenlabs_style) : 0.00;
            const speakerBoost = !!settings['elevenlabs_speaker-boost'];

            const requestBody = {
                text: processedText,
                model_id: settings.elevenlabs_modelId,
                voice_settings: {
                    stability: stability,
                    similarity_boost: similarity,
                    style: style,
                    use_speaker_boost: speakerBoost
                }
            };
            console.log(`✓ Request body prepared (model: ${settings.elevenlabs_modelId})`);

            // ⚡ OPTIMIZATION: Execute Gemini emotion analysis and ElevenLabs TTS in PARALLEL
            console.log("⚡ Step 5: Starting PARALLEL execution of emotion analysis and TTS generation...");
            const parallelStartTime = performance.now();

            const [emotionSegments, responseData] = await Promise.all([
                analyzeTextWithGemini(processedText)
                    .then(segments => {
                        console.log(`✓ Emotion analysis completed (${((performance.now() - parallelStartTime) / 1000).toFixed(2)}s)`);
                        return segments;
                    })
                    .catch(err => {
                        console.warn("⚠️ Emotion analysis failed, will continue without emotions:", err);
                        return null;
                    }),
                elevenLabsApiRequest({
                    method: 'POST',
                    endpoint: `/v1/text-to-speech/${voiceId}/with-timestamps`,
                    apiKey: apiKey,
                    data: requestBody,
                    responseType: 'json'
                })
                    .then(data => {
                        console.log(`✓ ElevenLabs TTS completed (${((performance.now() - parallelStartTime) / 1000).toFixed(2)}s)`);
                        return data;
                    })
            ]);

            const parallelTotalTime = ((performance.now() - parallelStartTime) / 1000).toFixed(2);
            console.log(`⚡ ✓ PARALLEL execution completed in ${parallelTotalTime}s (vs sequential: would take ~${(parseFloat(parallelTotalTime) * 1.5).toFixed(2)}s)`);

            if (!emotionSegments || emotionSegments.length === 0) {
                console.error("❌ No emotion segments returned from Gemini");
                return;
            }
            console.log(`✓ Got ${emotionSegments.length} emotion segments from Gemini`);

            if (!responseData || !responseData.audio_base64 || !responseData.alignment) {
                console.error("❌ Invalid response from ElevenLabs:", responseData);
                return;
            }
            console.log("✓ Timestamps received from ElevenLabs");

            // 6. Decodificar audio base64
            console.log("🔄 Step 6: Decoding base64 audio...");
            const audioData = base64ToArrayBuffer(responseData.audio_base64);
            console.log(`✓ Audio data decoded: ${audioData.byteLength} bytes`);

            // 7. Decodificar a AudioBuffer
            console.log("🎵 Step 7: Converting to AudioBuffer...");
            const audioBuffer = await decodeTTSArrayBuffer(audioData);
            console.log(`✓ Audio decoded to AudioBuffer (${audioBuffer.duration.toFixed(2)}s)`);

            // 8. Calcular tiempos exactos de cada segmento usando alignment
            console.log("⏱️ Step 8: Calculating segment timings...");
            const segmentTimings = calculateSegmentEndTimes(responseData.alignment, emotionSegments);

            if (!segmentTimings || segmentTimings.length === 0) {
                console.error("❌ Failed to calculate segment timings - no valid segments returned");
                return;
            }
            console.log(`✓ Calculated timings for ${segmentTimings.length} segments`);

            // 9. Dividir audio en segmentos según timestamps
            console.log("✂️ Step 9: Splitting audio by timestamps...");
            const audioBlobs = await splitAudioByTimestamps(audioBuffer, segmentTimings);

            if (!audioBlobs || audioBlobs.length === 0) {
                console.error("❌ Failed to split audio - no blobs created");
                return;
            }
            console.log(`✓ Created ${audioBlobs.length} audio blobs`);

            // 10. Generar blob URLs para cada segmento
            console.log("🔗 Step 10: Generating blob URLs...");
            console.log("\n🎵 === EMOTION-BASED AUDIO SEGMENTS ===");
            const emotionAudioSegments = audioBlobs.map((wavBlob, index) => {
                const blobUrl = URL.createObjectURL(wavBlob);
                const timing = segmentTimings[index];
                const textPreview = timing.text.substring(0, 50);
                const actionText = timing.action ? ` [Action: ${timing.action}]` : '';

                console.log(`\n📦 Segment ${index + 1} [${timing.emotion}]${actionText}:`);
                console.log(`   Text: "${textPreview}${timing.text.length > 50 ? '...' : ''}"`);
                console.log(`   Time: ${timing.startTime.toFixed(3)}s - ${timing.endTime.toFixed(3)}s`);
                console.log(`   Duration: ${timing.duration.toFixed(3)}s`);
                console.log(`   WAV Blob URL: ${blobUrl}`);

                return {
                    emotion: timing.emotion,
                    action: timing.action,
                    text: timing.text,
                    blobUrl: blobUrl,
                    startTime: timing.startTime,
                    endTime: timing.endTime,
                    duration: timing.duration
                };
            });

            console.log("\n✅ All emotion-based segments generated successfully");

            // 11. Enviar los segmentos al script de Live2D mediante CustomEvent
            console.log("📤 Step 11: Dispatching segments to Live2D...");
            const event = new CustomEvent('TTSEmotionSegmentsReady', {
                detail: {
                    segments: emotionAudioSegments,
                    totalDuration: audioBuffer.duration,
                    sampleRate: audioBuffer.sampleRate
                }
            });
            window.dispatchEvent(event);

            console.log("✅ Emotion segments dispatched to Live2D script via 'TTSEmotionSegmentsReady' event");
            console.log("⚠️ Playback skipped - Live2D script will handle audio playback\n");

        } catch (error) {
            console.error("❌ Error during emotion-based segmentation:");
            console.error("   Error type:", error.name);
            console.error("   Error message:", error.message);
            console.error("   Error stack:", error.stack);

            // Intentar identificar el paso donde falló
            if (error.message.includes('Gemini') || error.message.includes('fetch')) {
                console.error("   → Likely failed during Gemini API call (Step 2)");
            } else if (error.message.includes('elevenlabs') || error.message.includes('API')) {
                console.error("   → Likely failed during ElevenLabs API call (Step 6)");
            } else if (error.message.includes('decode') || error.message.includes('Audio')) {
                console.error("   → Likely failed during audio decoding (Step 7-8)");
            } else if (error.message.includes('segment') || error.message.includes('timing')) {
                console.error("   → Likely failed during segment processing (Step 9-10)");
            }
        }

        return;
    }

    // Si no hay Live2D, reproducir normalmente
    stopTTS();

    let botName = "char";
    try {
        const botNameElem = document.querySelector('[class^="_nameText_"]');
        if (botNameElem && botNameElem.textContent.trim()) botName = botNameElem.textContent.trim();
    } catch (e) {}
    let userPersona = "User";
    try {
        const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
        for (let i = allMessageNodes.length - 1; i >= 0; i--) {
            const node = allMessageNodes[i];
            if (!node.querySelector('[class^="_nameIcon_"]')) {
                const nameElem = node.querySelector('[class^="_nameText_"]');
                if (nameElem && nameElem.textContent.trim()) { userPersona = nameElem.textContent.trim(); break; }
            }
        }
    } catch (e) {}

    let voiceId;
    if (isBot) voiceId = settings[`elevenlabs_charVoice_${botName}`] || settings.elevenlabs_defaultVoice;
    else voiceId = settings[`elevenlabs_userVoice_${userPersona}`] || settings.elevenlabs_defaultVoice;

    if (!voiceId || voiceId === 'Default') {
        console.error("TTS Userscript: No ElevenLabs voice selected for this speaker.");
        return;
    }

    const playbackSpeed = parseFloat(settings.elevenlabs_playbackSpeed) || 1.0;
    const stability = typeof settings.elevenlabs_stability !== "undefined" ? parseFloat(settings.elevenlabs_stability) : 0.50;
    const similarity = typeof settings.elevenlabs_similarity !== "undefined" ? parseFloat(settings.elevenlabs_similarity) : 0.75;
    const style = typeof settings.elevenlabs_style !== "undefined" ? parseFloat(settings.elevenlabs_style) : 0.00;
    const speakerBoost = !!settings['elevenlabs_speaker-boost'];

    const requestBody = {
        text: text,
        model_id: settings.elevenlabs_modelId,
        voice_settings: {
            stability: stability,
            similarity_boost: similarity,
            style: style,
            use_speaker_boost: speakerBoost
        }
    };

    try {
        updateAllButtonStates(true);

        const responseData = await elevenLabsApiRequest({
            method: 'POST',
            endpoint: `/v1/text-to-speech/${voiceId}/with-timestamps`,
            apiKey: apiKey,
            data: requestBody,
            responseType: 'json'
        });

        const audioBase64 = responseData.audio_base64;
        const alignment = responseData.alignment;
        console.log("ElevenLabs Timestamps (Alignment):", alignment);

        const audioData = base64ToArrayBuffer(audioBase64);

        // Decodificar a AudioBuffer
        const audioBuffer = await decodeTTSArrayBuffer(audioData);
        logAudioBuffer(audioBuffer);

        // Crear WAV desde AudioBuffer y generar blob URL descargable
        const wavBlob = bufferToWave(audioBuffer);
        const wavBlobUrl = URL.createObjectURL(wavBlob);
        console.log("🎵 ElevenLabs Audio WAV Download URL:");
        console.log(wavBlobUrl);
        console.log("💾 To download: Right-click the link above and 'Save link as...' or run:");
        console.log(`const a = document.createElement('a'); a.href = '${wavBlobUrl}'; a.download = 'tts_audio_${Date.now()}.wav'; a.click();`);
        console.log("--------------------");

        // Despachar evento con AudioBuffer decodificado (para otros usos si es necesario)
        dispatchTTSDecodedAudio(audioBuffer, playbackSpeed, alignment);

        // Crear blob MP3 para reproducción
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        // Reproducir audio directamente (ya verificamos que Live2D no está activo)
        currentElevenLabsAudio = new Audio(audioUrl);
        currentElevenLabsAudio.playbackRate = playbackSpeed;

        currentElevenLabsAudio.onended = () => {
            updateAllButtonStates(false);
            currentElevenLabsAudio = null;
        };

        currentElevenLabsAudio.onerror = () => {
            updateAllButtonStates(false);
            currentElevenLabsAudio = null;
        };

        currentElevenLabsAudio.play();

    } catch (error) {
        console.error("TTS Userscript: ElevenLabs generation failed:", error);
        alert(`ElevenLabs TTS failed: ${error.message}`);
        updateAllButtonStates(false);
    }
  }

  // ==========================================================
  // SECCIÓN 7. HELPERS DE API ELEVENLABS
  // ----------------------------------------------------------
  // - Peticiones a la API (GM_xmlhttpRequest)
  // - Validación de API key
  // ==========================================================

  function elevenLabsApiRequest(options) {
      const { method, endpoint, apiKey, params = {}, data = null, responseType = 'json' } = options;
      let url = `https://api.elevenlabs.io${endpoint}`;
      if (Object.keys(params).length > 0) url += `?${new URLSearchParams(params).toString()}`;

      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: method,
              url: url,
              headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
              data: data ? JSON.stringify(data) : null,
              responseType: responseType,
              onload: function(response) {
                  if (response.status === 200) {
                      resolve(responseType === 'json' ? JSON.parse(response.responseText) : response.response);
                  } else {
                      let errorMessage = `Error: ${response.status}`;
                      try {
                          const errorDetail = JSON.parse(response.responseText).detail;
                          if (typeof errorDetail === 'string') errorMessage = errorDetail;
                          else if (errorDetail[0]?.msg) errorMessage = errorDetail[0].msg;
                      } catch (e) { /* ignore */ }
                      reject({ status: response.status, message: errorMessage });
                  }
              },
              onerror: function(error) {
                  reject({ status: 0, message: `Network error: ${error.statusText || 'Unknown'}` });
              }
          });
      });
  }

  async function validateElevenLabsKey(apiKey) {
      try {
          await elevenLabsApiRequest({ method: "GET", endpoint: "/v1/models", apiKey });
          return { isValid: true, message: "API Key Valid" };
      } catch (error) {
          return { isValid: false, message: `Invalid API Key` };
      }
  }

  // ==========================================================
  // SECCIÓN 8. BOTONES DE CONTROL EN CADA MENSAJE
  // ----------------------------------------------------------
  // - Inyecta botón play/stop en panel del mensaje
  // - Respeta ajustes (proveedor, narrar usuario, etc.)
  // ==========================================================

  const PLAY_SVG = `
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z" clip-rule="evenodd"/>
    </svg>`;

  const STOP_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-stop-icon">
      <circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>`;

  function injectTempButton(panel) {
    if (!panel || panel.querySelector('.temp-btn')) return;
    const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    const provider = settings.provider || 'builtin';
    const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : provider === 'gemini' ? 'gemini_' : '';

    const ttsEnabled = !!settings[`${prefix}tts-enabled`];
    const narrateUser = !!settings[`${prefix}tts-narrate-user`];
    if (!ttsEnabled) return;

    const isBot = !!(panel.closest && panel.closest('[data-index]') && panel.closest('[data-index]').querySelector(BOT_NAME_ICON_SELECTOR));
    if (!narrateUser && !isBot) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = '_controlPanelButton_prxth_8 temp-btn';
    btn.style.marginLeft = '0px';
    btn.innerHTML = isPlaying ? STOP_SVG : PLAY_SVG;

    btn.onclick = function() {
      if ((window.speechSynthesis && window.speechSynthesis.speaking) || currentElevenLabsAudio) {
          stopTTS();
          return;
      }
      const messageWrapper = this.closest(MESSAGE_WRAPPER_SELECTOR);
      if (messageWrapper) {
          const messageText = extractFormattedMessageText(messageWrapper);
          const { processed: processedTTS } = processTTSOutput(messageText);

          // Mostrar logs al hacer clic manual
          console.log("📜 Raw extracted text (Manual):");
          console.log(messageText);
          console.log("\n🎤 Processed TTS (Manual):");
          console.log(processedTTS || "[No TTS output]");
          console.log("--------------------");

          if (processedTTS) playTTS(processedTTS, isBot);
      }
    };

    panel.insertBefore(btn, panel.firstChild);
  }

  // Observa aparición de paneles de control para inyectar botón
  const controlPanelObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(CONTROL_PANEL_SELECTOR)) injectTempButton(node);
          node.querySelectorAll?.(CONTROL_PANEL_SELECTOR).forEach(injectTempButton);
        }
      }
    }
  });

  function startControlPanelObserver() {
    const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if (chatContainer) {
      document.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectTempButton);
      controlPanelObserver.observe(chatContainer, { childList: true, subtree: true });
    } else {
      setTimeout(startControlPanelObserver, 1000);
    }
  }

  startControlPanelObserver();

})();