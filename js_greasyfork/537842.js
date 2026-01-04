// ==UserScript==
// @name              NovelAI Prompt Preset / Wildcards Manager
// @name:ja           NovelAI Prompt Preset / Wildcards Manager
// @name:zh           NovelAI Prompt Preset / Wildcards Manager
// @name:es           NovelAI Prompt Preset / Wildcards Manager
// @name:id           NovelAI Prompt Preset / Wildcards Manager
// @name:pt           NovelAI Prompt Preset / Wildcards Manager
// @namespace         https://github.com/NeviumX/NovelAI-Prompt-Preset-Manager
// @version           1.4.4
// @author            Nevium7, Gemini 2.5 Pro
// @description       Script to replace __TOKEN__ with any prompt you want before making a request to the NovelAI API. Also adds a UI to manage presets and wildcards on the image generation page.
// @description:ja    NovelAI の API にリクエストを行う前に、__TOKEN__ を任意のプロンプトに置き換えるスクリプト。プリセットやワイルドカードを管理するためのUIも画像生成ページに追加します。
// @description:zh    NovelAI 的 API 在請求之前，將 __TOKEN__ 替換為您想要的任何提示詞。還會在圖片生成頁面添加一個 UI 來管理預設和通配詞。
// @description:es    Script para reemplazar __TOKEN__ con cualquier prompt que desees antes de hacer una solicitud a la API de NovelAI. También agrega una UI para gestionar los presets y wildcards en la página de generación de imágenes.
// @description:id    Script untuk mengganti __TOKEN__ dengan prompt yang Anda inginkan sebelum membuat permintaan ke API NovelAI. Juga menambahkan UI untuk mengelola presets dan wildcards di halaman generasi gambar.
// @description:pt    Script para substituir __TOKEN__ com qualquer prompt que você desejar antes de fazer uma requisição à API da NovelAI. Também adiciona uma UI para gerenciar presets e wildcards na página de geração de imagens.
// @license           MIT
// @copyright         Nevium7
// @icon              https://novelai.net/icons/novelai-round.png
// @match             https://novelai.net/*
// @require           https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @require           https://cdn.jsdelivr.net/npm/@msgpack/msgpack@3.1.2/dist.umd/msgpack.min.js
// @grant             GM_addStyle
// @grant             GM_deleteValue
// @grant             GM_getValue
// @grant             GM_listValues
// @grant             GM_setValue
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/537842/NovelAI%20Prompt%20Preset%20%20Wildcards%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/537842/NovelAI%20Prompt%20Preset%20%20Wildcards%20Manager.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const cssString = `.nai-preset-panel         {background:#0e0f21;border:1px solid rgb(34, 37, 63);padding:5px 15px;font-size:13px;color:#f0f0f0;}\r
.nai-preset-title         {font-weight:700;margin-bottom:10px;font-size:14px;padding:7px 5px 0px;}\r
.nai-textarea-wrapper     {position:relative;width:100%;background:#0e0f21;}\r
.nai-preset-textarea, .nai-textarea-overlay {width:100%;min-height:80px;max-height:300px;padding:6px;border:none;border-radius:4px;font-size:14px;box-sizing:border-box;white-space:pre-wrap;overflow-wrap:break-word;margin:0;background:transparent;}\r
.nai-preset-textarea      {position:relative;z-index:1;color:transparent;caret-color:#f8f8f8;overflow-y:auto;}\r
.nai-textarea-overlay     {position:absolute;top:0;left:0;z-index:0;height:100%;pointer-events:none;overflow:hidden;color:#f8f8f8;}\r
.nai-preset-errormsg      {display: none;color: #dd6666; font-size: 12px;margin: 5px 0 0 2px;padding: 0 5px;}\r
.newline-char             {display:inline-block;color:#dd6666;background:rgba(221,102,102,0.1);border:1px solid rgba(221,102,102,0.5);border-radius:3px;font-weight:bold;padding:0 3px;line-height:1;font-size:12px;vertical-align:middle;user-select:none;}\r
.nai-preset-controls      {display:flex;gap:6px;align-items:center;margin:6px 0}\r
.nai-preset-input         {flex:1 1 0;padding:4px 6px;border-radius:4px;border:2px solid #262946;background:#0e0f21;color:#f8f8f8}\r
.nai-btn                  {padding:4px 10px;border:1px solid rgb(34, 37, 63);background: #22253f;color: #f8f8f8;border-radius:4px;cursor:pointer;font-weight:600}\r
.nai-btn:hover            {background: #323658ff}\r
.nai-preset-list          {display:flex;flex-wrap:wrap;gap:6px;max-height:200px;overflow-y:auto;}\r
.nai-preset-item          {background:#22253f;border:1px solid rgb(34,37,63);padding:2px 6px;border-radius:4px;display:inline-flex;width:fit-content;max-width:100%;white-space:nowrap;gap:4px;align-items:center;cursor:pointer;transition:border-color .3s ease;user-select:none}\r
.nai-preset-item input    {margin:0; accent-color: #f5f3c2; cursor: pointer;}\r
.nai-preset-item:hover    {border-color: #f5f3c2;}\r
.nai-btn-remove           {display:none;border:none;background:none;color:#dd6666;font-size:15px;cursor:pointer;line-height:1}\r
.nai-btn-toggle           {width:26px;padding:4px 0;font-weight:700}\r
.nai-gear-wrap            {position:absolute; top:6px; right:6px}\r
.nai-gear-btn             {width:26px;height:26px;cursor:pointer;border:none;background:none;padding:0;display:flex;align-items:center;justify-content:center;border-radius:2px;color:#f8f8f8}\r
.nai-gear-btn.active      {color:#e7f3c2;}\r
.nai-popup                {position:absolute;bottom:100%;right:0;margin-bottom:8px;width:200px;padding:10px;background:#13152c;border:2px solid #262946;border-radius:4px;color:#eee;display:none;z-index:2147483647}\r
.nai-popup:before         {content:'';position:absolute;bottom:-6px;right:14px;border:6px solid transparent;border-top-color:#262946}\r
.nai-remain-row           {margin-top:6px;display:flex;align-items:center;gap:6px;font-size:13px;white-space:nowrap;float:left}\r
.nai-remain-row input[type="checkbox"] {margin: 6px; accent-color: #f5f3c2; cursor: pointer;}\r
.nai-remain-row:hover     {cursor: pointer;}\r
.nai-remain-row[data-tooltip] {position: relative;}\r
.nai-remain-row[data-tooltip]::before,\r
.nai-remain-row[data-tooltip]::after {display: none;position: absolute;left: 50%;transform: translateX(-50%);z-index: 100;}\r
.nai-remain-row[data-tooltip]::before {content: attr(data-tooltip);width: 250px;bottom: 100%;margin-bottom: 8px;padding: 6px 8px;background: #13152c;border: 2px solid #262946;border-radius: 4px;color: #eee;font-size: 12px;white-space: normal;text-align: left;}\r
.nai-remain-row[data-tooltip]::after {content: '';bottom: 100%;margin-bottom: 2px;border: 6px solid transparent;border-top-color: #262946;}\r
.nai-remain-row[data-tooltip]:hover::before,\r
.nai-remain-row[data-tooltip]:hover::after {display: block;}\r
.nai-suggest-box          {position:fixed;z-index:2147483647;background:#191b31;border:2px solid #262946;border-radius:4px;max-height:180px;overflow-y:auto;font-size:13px;color:#eee}\r
.nai-suggest-item         {padding:4px 8px;cursor:pointer;border:1px solid rgb(34,37,63);border-radius:4px;transition:border-color .3s ease,background-color .3s ease}\r
.nai-suggest-item.active  {background-color: #323658ff;border-color: #f5f3c2;transition:background-color .3s ease,border-color .3s ease}\r
.nai-popup-header         {display:flex;justify-content:space-between;align-items:center;margin:0 0 10px;}\r
.nai-info-btn             {display:inline-flex;align-items:center;justify-content:center;color:#f8f8f8;opacity:0.6;transition:opacity .2s ease;}\r
.nai-info-btn:hover       {opacity:1;}\r
.nai-preset-search-wrapper {position: relative;flex: 1 1 0;display: flex;align-items: center;}\r
.nai-preset-search        {display:flex;gap:6px;align-items:center;margin-top:6px;}\r
.nai-preset-search-box    {width:100%;padding:4px 6px;border-radius:4px;border:2px solid #262946;background:#0e0f21;color:#f8f8f8}\r
.nai-preset-search-button {width:26px;cursor:pointer;padding:4px 0;display:flex;align-items:center;justify-content:center;border-radius:4px;color:#f8f8f8;}\r
.nai-preset-search-clear  {display: none;position: absolute;right: 4px;top: 0;bottom: 0;margin: auto;height: 20px;width: 20px;border: none;background: transparent;color: #dd6666;font-size: 16px;font-weight: bold;cursor: pointer;line-height: 1;align-items: center;justify-content: center;}\r
.nai-preset-search-clear:hover {color: #ff8888;}\r
.nai-btn-list-toggle      {width:26px;padding:4px 0;font-weight:700}\r
.nai-btn:focus-visible:not([data-mouse-clicked]), .nai-preset-search-button:focus-visible:not([data-mouse-clicked]), .nai-preset-search-clear:focus-visible:not([data-mouse-clicked]), .nai-gear-btn:focus-visible:not([data-mouse-clicked]), .nai-btn-remove:focus-visible:not([data-mouse-clicked]), .nai-preset-panel input[type="checkbox"]:focus-visible:not([data-mouse-clicked]) {outline:2px solid #f5f3c2; outline-offset:1px; border-radius:4px;}\r
.nai-preset-notification  {position: absolute;background: #191b31;border: 2px solid #262946; color: #f5f3c2;padding: 5px 10px;border-radius: 4px;font-size: 12px;z-index: 1000;animation: nai-fade-in-out 1.5s ease-out forwards;pointer-events: none;}\r
@keyframes Flash          {0%{background: #f5f3c2} 100%{background: #22253f}}\r
@keyframes Flash-Err      {0%{background: rgba(221,102,102,0.5)} 100%{background: #22253f}}\r
@keyframes nai-fade-in-out {0% { opacity: 0; transform: translateY(10px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); }100% { opacity: 0; transform: translateY(-10px); } }`;
  const PREFIX = "naiPromptPreset:";
  const TOKEN_REMAIN_TRG = "naiRemainTokenTrigger";
  const DEBUG_MODE_TRG = "debugModeTrigger";
  class JsonManager {
    TARGET_PATH;
    _dictCache;
    _patchInstalled;
    constructor() {
      this.TARGET_PATH = "/ai/generate-image";
      this._dictCache = this.buildDict();
      this.installPatch();
    }
buildDict() {
      const dict = {};
      GM_listValues().filter((k) => k.startsWith(PREFIX)).forEach((k) => dict[k.slice(PREFIX.length)] = GM_getValue(k, ""));
      console.log("[NovelAI Prompt Preset Manager] Preset dict built.");
      return dict;
    }
installPatch() {
      if (this._patchInstalled) return;
      this._patchInstalled = true;
      const TARGET = this.TARGET_PATH;
      const naiRemainValue = GM_getValue(TOKEN_REMAIN_TRG, false);
      const debugModeValue = GM_getValue(DEBUG_MODE_TRG, false);
      const initialDict = JSON.stringify(this._dictCache).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
      const patchCode = `
            (function(){
            window.__naiPresetDict = JSON.parse(\`${initialDict}\`);
            window.__naiRemain = ${naiRemainValue};
            window.__naiDebugMode = ${debugModeValue};
            const debugLog = (...args) => { if (window.__naiDebugMode) console.log(...args); };
            const errorLog = (...args) => console.error(...args);

            window.addEventListener('naiRemainUpdate', e => { window.__naiRemain = e.detail; });
            window.addEventListener('naiPresetUpdate', e => { window.__naiPresetDict = e.detail; });
            window.addEventListener('naiDebugUpdate', e => {window.__naiDebugMode = e.detail; });

            const tokenRe = /__([A-Za-z0-9_.-]+?)__/g;
            const replace = s => {
                return s.replace(tokenRe, (match, tokenName) => {
                    if (Object.prototype.hasOwnProperty.call(window.__naiPresetDict, tokenName)) {
                        let presetValue = window.__naiPresetDict[tokenName];
                        if (typeof presetValue === 'string') {
                            const newlineRegex = new RegExp('\\\\r?\\\\n', 'g');
                            const newlineTestRegex = new RegExp('\\\\r?\\\\n');
                            if (newlineTestRegex.test(presetValue)){
                                return '||' + presetValue.replace(newlineRegex, '|') + '||';
                            }
                            else return presetValue;
                        }
                        return presetValue;
                    }
                    return match;
                });
            };
            const deep    = o => (typeof o==='string') ? replace(o)
                                : Array.isArray(o)      ? o.map(deep)
                                : o && typeof o==='object'
                                ? Object.fromEntries(Object.entries(o).map(([k,v])=>[k,deep(v)]))
                                : o;

            const origFetch = window.fetch;
            window.fetch = async function(input, init) {
                const url = typeof input === 'string' ? input : input.url;
                const method = init?.method || (input instanceof Request ? input.method : 'GET').toUpperCase();

                if (method === 'POST' && url.includes('${TARGET}')) {
                    const body = init?.body || (input instanceof Request ? input.body : null);
                    if (!body) return origFetch.call(this, input, init);

                    console.log('[NovelAI Prompt Preset Manager] Intercepting POST to ${TARGET}');
                    const bodyText = typeof body === 'string' ? body : await new Response(body).text();

                    if (window.__naiRemain) {
                        try {
                            const jsonData = JSON.parse(bodyText);
                            const params = jsonData.parameters || {};
                            const safeCopy = (obj) => obj ? JSON.parse(JSON.stringify(obj)) : null;
                            window.__naiLastPromptData = {
                                inputPrompt : jsonData.input ?? '',
                                caption     : safeCopy(params.v4_prompt?.caption) ?? '',
                                negCaption  : safeCopy(params.v4_negative_prompt?.caption) ?? '',
                                negative    : safeCopy(params.negative_prompt) ?? '',
                            };
                            debugLog('[PresetMgr] Stored raw prompt data for patching.');
                        } catch(e) { console.error('[PresetMgr] Error parsing prompt data:', e); }
                    }

                    const modifiedBody = JSON.stringify(deep(JSON.parse(bodyText)));

                    if( modifiedBody === bodyText ) {
                        debugLog('[PresetMgr] No changes in body, skipping patching.'); 
                        return origFetch.call(this, input, init);
                    }
                    let finalInput, finalInit;
                    if (typeof input === 'string') {
                        finalInput = input;
                        finalInit = {...init, body: modifiedBody};
                    } else {
                        finalInput = new Request(input, { body: modifiedBody });
                        finalInit = undefined;
                    }

                    const res = await origFetch.call(this, finalInput, finalInit);

                    if (window.__naiRemain && res.ok && res.headers.get('Content-Type')?.includes('binary/octet-stream')) {
                        debugLog('[PresetMgr] binary/octet-stream response. Trying to process as ZIP.');
                        try {
                            const zipBuffer = await res.clone().arrayBuffer();
                            debugLog('[PresetMgr] Got zipBuffer, length:', zipBuffer.byteLength);
                            if (typeof window.JSZip === 'undefined') {
                                console.error('[PresetMgr] window.JSZip is undefined. Cannot process ZIP.');
                                return res;
                            }
                            debugLog('[PresetMgr] JSZip found in window. Loading ZIP...');
                            const zip = await window.JSZip.loadAsync(zipBuffer);
                            debugLog('[PresetMgr] ZIP loaded. Searching for PNG file...');
                            const pngFile = zip.file(/image_\\d+\\.png/)[0];
                            if (pngFile) {
                                debugLog('[PresetMgr] Found PNG in ZIP:', pngFile.name);
                                try {
                                    debugLog('[PresetMgr] Attempting pngFile.async("arraybuffer")...');
                                    // Promiseを一度変数に受けてからawaitする
                                    const arrayBufferPromise = pngFile.async('arraybuffer');
                                    const pngFileBuffer = await arrayBufferPromise;
                                    debugLog('[PresetMgr] Successfully got pngFileBuffer, length:', pngFileBuffer.byteLength);
                                    
                                    const patchedBuffer = patchPng(pngFileBuffer);

                                    if (patchedBuffer) {
                                        zip.file(pngFile.name, patchedBuffer); 
                                        debugLog('[PresetMgr] PNG patched. Generating new ZIP...');
                                        const newZipBuffer = await zip.generateAsync({type: 'arraybuffer', compression: "DEFLATE", compressionOptions: {level: 1}});
                                        
                                        debugLog('[PresetMgr] Repacked zip with patched PNG. Returning new response.');
                                        const newHeaders = new Headers(res.headers); 
                                        return new Response(newZipBuffer, { status: res.status, statusText: res.statusText, headers: newHeaders });
                                    } else {
                                        errorLog('[PresetMgr] patchPng returned null or undefined. Returning original response (from cloned zipBuffer).');
                                        const originalResponseCloneForFallback = new Response(zipBuffer, { status: res.status, statusText: res.statusText, headers: res.headers });
                                        return originalResponseCloneForFallback;
                                    }
                                } catch (e_png_processing) {
                                    console.error('[PresetMgr] Error during pngFile.async or subsequent patching/zipping:', e_png_processing);
                                    // エラーが発生した場合、元のZIPデータからレスポンスを再生成して返す
                                    const errorFallbackResponse = new Response(zipBuffer, { status: res.status, statusText: res.statusText, headers: res.headers });
                                    return errorFallbackResponse;
                                }
                            } else {
                                errorLog('[PresetMgr] No PNG file found in the ZIP. Returning original response.');
                            }
                        } catch (e_zip_load) {
                            console.error('[PresetMgr] Failed to load/process ZIP from binary/octet-stream:', e_zip_load);
                        }
                    }
                    // generate-image-stream
                    else if (window.__naiRemain && res.ok && res.headers.get('Content-Type')?.includes('application/msgpack')){
                        debugLog('[PresetMgr] SSE stream response detected. Starting transform stream for patching...');
                        try{
                            if (typeof window.MessagePack === 'undefined') {
                                console.error('[PresetMgr] window.MessagePack is undefined. Cannot decode.');
                                return res;
                            } else if (!res.body) {
                                console.error('[PresetMgr] Response body is null. Cannot decode stream.');
                                return res;
                            }
                            const transformStream = new ReadableStream({
                                async start(controller) {
                                    const reader = res.body.getReader();
                                    let buffer = new Uint8Array(0);
                                    try {
                                        while (true) {
                                            const { value, done } = await reader.read();
                                            if (done) break;

                                            const newBuffer = new Uint8Array(buffer.length + value.length);
                                            newBuffer.set(buffer);
                                            newBuffer.set(value, buffer.length);
                                            buffer = newBuffer;

                                            while (buffer.length > 4) {
                                                const messageLength = (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3];
                                                
                                                if (buffer.length >= 4 + messageLength) {
                                                    const messageChunk = buffer.subarray(0, 4 + messageLength); // 
                                                    const messageData = buffer.subarray(4, 4 + messageLength);  // 
                                                    
                                                    try {
                                                        const item = window.MessagePack.decode(messageData);
                                                        
                                                        // TARGET: final
                                                        if (item && item.event_type === 'final' && item.image && item.image instanceof Uint8Array) {
                                                            let patched = false;
                                                            const imageData = item.image;
                                                            
                                                            if (imageData.length > 4 && imageData[0] === 137 && imageData[1] === 80 && imageData[2] === 78 && imageData[3] === 71) {
                                                                debugLog('[PresetMgr] Final image is detected. Attempting to patch...');
                                                                const arrayBuffer = imageData.slice().buffer;
                                                                const patchedBuffer = patchPng(arrayBuffer);

                                                                if (patchedBuffer) {
                                                                    debugLog('[PresetMgr] PNG data patched successfully. Patched buffer length:', patchedBuffer.byteLength);
                                                                    item.image = new Uint8Array(patchedBuffer);
                                                                    const newPayload = window.MessagePack.encode(item);
                                                                    const newMessageChunk = new Uint8Array(4 + newPayload.length);
                                                                    writeUint32(newMessageChunk, 0, newPayload.length);
                                                                    newMessageChunk.set(newPayload, 4);
                                                                    
                                                                    controller.enqueue(newMessageChunk);
                                                                    patched = true;
                                                                } else {
                                                                    console.warn('[PresetMgr] patchPng returned null. No patch applied.');
                                                                }
                                                            } else {
                                                                debugLog('[PresetMgr] Final image is not a PNG, skipping patch.');
                                                            }
                                                            if (!patched) {
                                                                debugLog('[PresetMgr] Something went wrong, skipping patch.');
                                                                controller.enqueue(messageChunk);
                                                            }
                                                        } else {
                                                            controller.enqueue(messageChunk);
                                                        }
                                                    } catch (e) {
                                                        console.error('[PresetMgr] Failed to decode a message chunk, passing through. Error:', e);
                                                        controller.enqueue(messageChunk);
                                                    }
                                                    buffer = buffer.subarray(4 + messageLength);
                                                } else {
                                                    break;
                                                }
                                            }
                                        }
                                        controller.close();
                                    } catch (e) {
                                        console.error('[PresetMgr] Error during stream parsing:', e);
                                        controller.error(e);
                                    }
                                }
                            });
                            return new Response(transformStream, {
                                status: res.status,
                                statusText: res.statusText,
                                headers: new Headers(res.headers),
                            });
                            
                        } catch(e_stream){
                            console.error('[PresetMgr] Error processing SSE stream:', e_stream);
                            return res;
                        }
                    }
                    return res;
                } else {
                    return origFetch.call(this, input, init);
                }
            };
            /*── PNG書き換えとバイナリヘルパー関数 ──*/
            function patchPng(arrayBuf) {
                debugLog('[PresetMgr] Patching PNG metadata...');
                let data = new Uint8Array(arrayBuf);
                const raw = window.__naiLastPromptData;
                if (!raw) { return null; }

                let p = 8;
                let modified = false;

                while (p < data.length) {
                    const originalLen = readUint32(data, p);
                    const type = String.fromCharCode(...data.subarray(p + 4, p + 8));

                    if (type === 'tEXt') {
                        let q = p + 8;
                        let key = '';
                        while (data[q] && q < p + 8 + originalLen) {
                            key += String.fromCharCode(data[q++]);
                        }
                        
                        if (key === 'Description' && raw.inputPrompt) {
                            debugLog('[PresetMgr] Found "tEXt" chunk with "Description" key.');
                            q++;
                            const textOff = q;
                            const oldLen = originalLen - (key.length + 1);

                            const newTxt = new TextEncoder().encode(raw.inputPrompt);
                            const delta = newTxt.length - oldLen;
                            const out = new Uint8Array(data.length + delta);
                            const head = p + 8 + key.length + 1;

                            out.set(data.subarray(0, head), 0);
                            out.set(newTxt, head);
                            out.set(data.subarray(head + oldLen), head + newTxt.length);

                            const newChunkLen = newTxt.length + key.length + 1;
                            writeUint32(out, p, newChunkLen);
                            const crc = crc32(out, p + 4, 4 + newChunkLen);
                            writeUint32(out, p + 8 + newChunkLen, crc);

                            debugLog('[PresetMgr] PNG description patched.');
                            data = out;
                            modified = true;
                        }
                        
                        else if (key === 'Comment') {
                            debugLog('[PresetMgr] Found "tEXt" chunk with "Comment" key.');
                            q++;
                            const textOff = q;
                            const oldLen = originalLen - (key.length + 1);
                            const oldTxt = new TextDecoder().decode(data.subarray(textOff, textOff + oldLen));
                            const meta = JSON.parse(oldTxt);

                            // meta
                            if (raw.inputPrompt && meta.prompt) { meta.prompt = raw.inputPrompt; }
                            if (raw.caption && meta.v4_prompt?.caption) {
                                meta.v4_prompt.caption.base_caption = raw.caption.base_caption ?? meta.v4_prompt.caption.base_caption;
                                meta.v4_prompt.caption.char_captions = raw.caption.char_captions ?? meta.v4_prompt.caption.char_captions;
                            }
                            if (raw.negCaption && meta.v4_negative_prompt?.caption) {
                                meta.v4_negative_prompt.caption.base_caption = raw.negCaption.base_caption ?? meta.v4_negative_prompt.caption.base_caption;
                                meta.v4_negative_prompt.caption.char_captions = raw.negCaption.char_captions ?? meta.v4_negative_prompt.caption.char_captions;
                            }
                            if (raw.negative && meta.uc) { meta.uc = raw.negative }

                            const newTxt = new TextEncoder().encode(JSON.stringify(meta));
                            const delta = newTxt.length - oldLen;
                            const out = new Uint8Array(data.length + delta);
                            const head = p + 8 + key.length + 1;

                            out.set(data.subarray(0, head), 0);
                            out.set(newTxt, head);
                            out.set(data.subarray(head + oldLen), head + newTxt.length);

                            const newChunkLen = newTxt.length + key.length + 1;
                            writeUint32(out, p, newChunkLen);
                            const crc = crc32(out, p + 4, 4 + newChunkLen);
                            writeUint32(out, p + 8 + newChunkLen, crc);

                            debugLog('[PresetMgr] PNG metadata patched.');
                            data = out;
                            modified = true;
                        }
                    }
                    p += 12 + readUint32(data, p);
                }
                if (modified) {
                    console.log('[NovelAI Prompt Preset Manager] PNG metadata patching finished.');
                    window.__naiLastPromptData = null;
                    return data.buffer;
                }
                debugLog('[PresetMgr] Target chunk (tEXt with Comment or Description) not found.');
                return null;
            }

            function readUint32(u8, idx) { return (u8[idx] << 24) | (u8[idx+1] << 16) | (u8[idx+2] << 8) | u8[idx+3]; }
            function writeUint32(u8, idx, v) { u8[idx] = v >>> 24; u8[idx+1] = v >>> 16; u8[idx+2] = v >>> 8; u8[idx+3] = v & 0xFF; }
            function crc32(u8, off, len) {
                let c = ~0 >>> 0;
                for (let i = 0; i < len; i++) {
                    c ^= u8[off + i];
                    for (let k = 0; k < 8; k++) c = (c & 1) ? (c >>> 1) ^ 0xEDB88320 : (c >>> 1);
                }
                return (~c) >>> 0;
            }
            })();`;
      const scr = document.createElement("script");
      scr.textContent = patchCode;
      document.documentElement.appendChild(scr);
      scr.remove();
      console.log("[NovelAI Prompt Preset Manager] Patches installed to handle JSON/PNG.");
    }
    updateDict() {
      this._dictCache = this.buildDict();
      unsafeWindow.dispatchEvent(
        new CustomEvent("naiPresetUpdate", { detail: this._dictCache })
      );
    }
    getDict() {
      return this._dictCache;
    }
  }
  const jsonManagerSingleton = new JsonManager();
  class SuggestionManager {
    jsonMgr;
    editor;
    box;
    selIdx = -1;
    _updateHandler;
    _navHandler;
    _hideHandler;
    _mousedownHandler;
    _mouseoverHandler;
    _escapeKeyHandler;
    constructor(editor, jsonMgr) {
      this.jsonMgr = jsonMgr;
      this.editor = editor;
      this.box = this.createBox();
      this.bind();
    }
    createBox() {
      const div = document.createElement("div");
      div.className = "nai-suggest-box";
      div.style.display = "none";
      document.body.appendChild(div);
      return div;
    }
    bind() {
      this._updateHandler = () => this.update();
      this._navHandler = (e) => this.nav(e);
      this._hideHandler = () => this.hide();
      this._mousedownHandler = (e) => {
        const target = e.target;
        if (target.classList.contains("nai-suggest-item")) {
          e.preventDefault();
          this.choose(target, e.shiftKey);
        }
      };
      this._mouseoverHandler = (e) => {
        const target = e.target;
        if (target.classList.contains("nai-suggest-item")) {
          e.preventDefault();
          this.selIdx = [...this.box.children].indexOf(target);
          this.highlight();
        }
      };
      this._escapeKeyHandler = (e) => {
        if (e.key === "Escape") this.hide();
      };
      this.editor.addEventListener("input", this._updateHandler);
      this.editor.addEventListener("keydown", this._navHandler);
      this.editor.addEventListener("click", this._hideHandler);
      this.box.addEventListener("mousedown", this._mousedownHandler);
      this.box.addEventListener("mouseover", this._mouseoverHandler);
      document.addEventListener("keydown", this._escapeKeyHandler);
    }
    textBeforeCaret() {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode || !this.editor.contains(sel.anchorNode)) return "";
      const rng = sel.getRangeAt(0).cloneRange();
      rng.collapse(true);
      rng.setStart(this.editor, 0);
      return rng.toString();
    }
    update() {
      const txt = this.textBeforeCaret();
      const dict = this.jsonMgr.getDict();
      const mVal = txt.match(/__([A-Za-z0-9_.-]+)__(\w*)$/);
      if (mVal && dict[mVal[1]]) {
        const [, key, part] = mVal;
        const list = dict[key].split(/\r?\n/).filter(Boolean).filter((l) => l.toLowerCase().includes(part.toLowerCase())).slice(0, 100);
        if (list.length) return this.render(list.map((t) => ({ type: "value", text: t, originalKey: key })));
      }
      const mTok = txt.match(/__([A-Za-z0-9_.-]*)$/);
      if (mTok) {
        const prefix = mTok[1].toLowerCase();
        let keys = Object.keys(dict);
        keys = prefix ? keys.filter((k) => k.toLowerCase().startsWith(prefix)) : keys;
        keys.sort();
        keys = keys.slice(0, 100);
        if (keys.length) return this.render(keys.map((k) => ({ type: "token", text: `__${k}__` })));
      }
      this.hide();
    }
    render(items) {
      this.box.innerHTML = "";
      items.forEach((itemData) => {
        const div = document.createElement("div");
        div.className = "nai-suggest-item";
        div.textContent = itemData.text;
        div.dataset.type = itemData.type;
        if (itemData.type === "value" && itemData.originalKey) {
          div.dataset.originalKey = itemData.originalKey;
        }
        this.box.appendChild(div);
      });
      this.selIdx = 0;
      this.highlight();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        this.box.style.left = `${rect.left + window.scrollX}px`;
        this.box.style.top = `${rect.bottom + window.scrollY + 4}px`;
        this.box.style.display = "block";
      } else {
        this.hide();
      }
    }
    nav(e) {
      if (this.box.style.display === "none") return;
      const items = [...this.box.children];
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.selIdx = (this.selIdx + 1) % items.length;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.selIdx = (this.selIdx - 1 + items.length) % items.length;
      }
      if (e.key === "Tab" || e.key === " ") {
        e.preventDefault();
        this.choose(items[this.selIdx], e.shiftKey);
      }
      this.highlight();
    }
    choose(itemElement, shiftPressed = false) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return this.hide();
      const fullTextBeforeCaret = this.textBeforeCaret();
      const itemType = itemElement.dataset.type;
      const suggestionText = itemElement.textContent;
      let textToInsert = "";
      let charactersToDelete = 0;
      const newlineReplaceRegex = /\r?\n/g;
      const newlineTestRegex = /\r?\n/;
      if (itemType === "value") {
        const valueTriggerRegex = /__([A-Za-z0-9_.-]+)__(\w*)$/;
        const currentTriggerMatch = fullTextBeforeCaret.match(valueTriggerRegex);
        if (currentTriggerMatch) {
          charactersToDelete = currentTriggerMatch[0].length;
        } else {
          charactersToDelete = 0;
        }
        if (shiftPressed) {
          const presetName = itemElement.dataset.originalKey;
          const presetContent = this.jsonMgr.getDict()[presetName];
          if (typeof presetContent === "string") {
            if (newlineTestRegex.test(presetContent)) {
              textToInsert = "||" + presetContent.replace(newlineReplaceRegex, "|") + "||";
            } else {
              textToInsert = presetContent + ", ";
            }
          } else {
            textToInsert = suggestionText + ", ";
          }
        } else {
          textToInsert = suggestionText + ", ";
        }
      } else if (itemType === "token") {
        const tokenTriggerRegex = /__([A-Za-z0-9_.-]*)$/;
        const fullTokenTriggerRegex = /__([A-Za-z0-9_.-]+)__$/;
        let currentTriggerMatch = fullTextBeforeCaret.match(fullTokenTriggerRegex);
        if (currentTriggerMatch) {
          charactersToDelete = currentTriggerMatch[0].length;
        } else {
          currentTriggerMatch = fullTextBeforeCaret.match(tokenTriggerRegex);
          if (currentTriggerMatch) {
            charactersToDelete = currentTriggerMatch[0].length;
          } else {
            charactersToDelete = 0;
          }
        }
        if (shiftPressed) {
          const presetName = suggestionText.slice(2, -2);
          const presetContent = this.jsonMgr.getDict()[presetName];
          if (typeof presetContent === "string") {
            if (newlineTestRegex.test(presetContent)) {
              textToInsert = "||" + presetContent.replace(newlineReplaceRegex, "|") + "||";
            } else {
              textToInsert = presetContent + ", ";
            }
          } else {
            textToInsert = suggestionText + ", ";
          }
        } else {
          textToInsert = suggestionText + ", ";
        }
      }
      if (charactersToDelete > 0 || textToInsert) {
        for (let i = 0; i < charactersToDelete; i++) sel.modify("extend", "backward", "character");
        document.execCommand("insertText", false, textToInsert);
      }
      this.hide();
    }
    highlight() {
      const items = [...this.box.children];
      items.forEach((d, i) => {
        d.classList.toggle("active", i === this.selIdx);
      });
      if (items.length > 0 && this.selIdx >= 0 && this.selIdx < items.length) {
        const selectedItem = items[this.selIdx];
        const box = this.box;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;
        const boxScrollTop = box.scrollTop;
        const boxVisibleHeight = box.clientHeight;
        if (itemTop < boxScrollTop) {
          box.scrollTop = itemTop;
        } else if (itemBottom > boxScrollTop + boxVisibleHeight) {
          box.scrollTop = itemBottom - boxVisibleHeight;
        }
      }
    }
    hide() {
      this.box.style.display = "none";
      this.selIdx = -1;
    }
    destroy() {
      this.editor.removeEventListener("input", this._updateHandler);
      this.editor.removeEventListener("keydown", this._navHandler);
      this.editor.removeEventListener("click", this._hideHandler);
      this.box.removeEventListener("mousedown", this._mousedownHandler);
      this.box.removeEventListener("mouseover", this._mouseoverHandler);
      document.removeEventListener("keydown", this._escapeKeyHandler);
      this.box.remove();
    }
  }
  class ProseMirrorObserver {
    jsonMgr;
    map;
    mo;
    constructor(jsonMgr) {
      this.jsonMgr = jsonMgr;
      this.map = new Map();
      this.mo = new MutationObserver((m) => this.handle(m));
      this.start();
    }
    start() {
      this.mo.observe(document.documentElement, { childList: true, subtree: true });
    }
    attach(node) {
      if (!node.isContentEditable) return;
      if (this.map.has(node)) return;
      const sm = new SuggestionManager(node, this.jsonMgr);
      this.map.set(node, sm);
    }
    detach(node) {
      const sm = this.map.get(node);
      if (!sm) return;
      sm.destroy();
      this.map.delete(node);
    }
    handle(muts) {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const elementsSet = new Set(n.querySelectorAll?.("div.ProseMirror[contenteditable]"));
          if (elementsSet && elementsSet.size !== 0) {
            elementsSet.forEach((el) => {
              this.attach(el);
            });
            elementsSet.clear();
          } else return;
        });
        m.removedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.classList?.contains("ProseMirror")) this.detach(n);
        });
      });
    }
  }
  const messageTranslations = {
    "en": {
      doubleUnderscoreError: "[NovelAI Prompt Preset Manager]\nERROR: Do not use double-underscore (__) to the preset name.\n\nThis symbol should only be used to enclose actual preset tokens.",
      importFailure: "[NovelAI Prompt Preset Manager]\nFailed to import: ",
      importSuccess: "[NovelAI Prompt Preset Manager]\nImported ${importCount} new preset(s).\nAlready existing presets are not overwritten.",
      confirmDeletePreset: "[NovelAI Prompt Preset Manager]\nDelete preset?: ",
      confirmDeleteAllPresets: "[NovelAI Prompt Preset Manager]\nDelete ALL saved presets?",
      allPresetsDeleted: "[NovelAI Prompt Preset Manager]\nAll presets deleted."
    },
    "ja": {
      doubleUnderscoreError: "[NovelAI Prompt Preset Manager]\nエラー: プリセット名にダブルアンダースコア (__) を使用しないでください。\n\nこの記号は、実際のプリセットトークンを囲むときだけに使用する必要があります。",
      importFailure: "[NovelAI Prompt Preset Manager]\nインポートに失敗しました: ",
      importSuccess: "[NovelAI Prompt Preset Manager]\n${importCount}個の新しいプリセットをインポートしました。\n既に存在していたものは上書きされていません。",
      confirmDeletePreset: "[NovelAI Prompt Preset Manager]\nプリセットを削除しますか？: ",
      confirmDeleteAllPresets: "[NovelAI Prompt Preset Manager]\n保存されているすべてのプリセットを削除しますか？",
      allPresetsDeleted: "[NovelAI Prompt Preset Manager]\nすべてのプリセットが削除されました。"
    },
    "zh": {
      doubleUnderscoreError: "[NovelAI Prompt Preset Manager]\n错误：预设名称中不能使用双下划线 (__)。\n此符号仅用于包围实际的预设令牌。",
      importFailure: "[NovelAI Prompt Preset Manager]\n导入失败： ",
      importSuccess: "[NovelAI Prompt Preset Manager]\n成功导入 ${importCount} 个新预设。\n已存在的预设不会被覆盖。",
      confirmDeletePreset: "[NovelAI Prompt Preset Manager]\n删除预设？: ",
      confirmDeleteAllPresets: "[NovelAI Prompt Preset Manager]\n删除所有保存的预设？",
      allPresetsDeleted: "[NovelAI Prompt Preset Manager]\n所有预设已删除。"
    },
    "es": {
      doubleUnderscoreError: "[NovelAI Prompt Preset Manager]\nError: No se puede usar doble subrayado (__) en el nombre del presest.\nEste símbolo solo se debe usar para envolver el token real del presest.",
      importFailure: "[NovelAI Prompt Preset Manager]\nError al importar: ",
      importSuccess: "[NovelAI Prompt Preset Manager]\nSe importaron ${importCount} nuevos presest.\nLos presest existentes no se sobrescriben.",
      confirmDeletePreset: "[NovelAI Prompt Preset Manager]\nEliminar presest? ",
      confirmDeleteAllPresets: "[NovelAI Prompt Preset Manager]\nEliminar todos los presest guardados?",
      allPresetsDeleted: "[NovelAI Prompt Preset Manager]\nTodos los presest se han eliminado."
    },
    "id": {
      doubleUnderscoreError: "[NovelAI Prompt Preset Manager]\nError: Tidak boleh menggunakan double underscore (__) dalam nama presest.\nSimbol ini hanya boleh digunakan untuk mengelilingi token sebenar presest.",
      importFailure: "[NovelAI Prompt Preset Manager]\nGagal mengimpor: ",
      importSuccess: "[NovelAI Prompt Preset Manager]\n${importCount} presest baru berhasil diimpor.\nPresest yang ada tidak akan disetel ulang.",
      confirmDeletePreset: "[NovelAI Prompt Preset Manager]\nHapus presest? ",
      confirmDeleteAllPresets: "[NovelAI Prompt Preset Manager]\nHapus semua presest yang disimpan?",
      allPresetsDeleted: "[NovelAI Prompt Preset Manager]\nSemua presest telah dihapus."
    },
    "pt": {
      doubleUnderscoreError: "[NovelAI Prompt Preset Manager]\nErro: Não é possível usar sublinhado duplo (__) no nome do presest.\nEste símbolo deve ser usado apenas para envolver o token real do presest.",
      importFailure: "[NovelAI Prompt Preset Manager]\nErro ao importar: ",
      importSuccess: "[NovelAI Prompt Preset Manager]\n${importCount} presest novos foram importados.\nOs presest existentes não serão sobrescritos.",
      confirmDeletePreset: "[NovelAI Prompt Preset Manager]\nExcluir presest? ",
      confirmDeleteAllPresets: "[NovelAI Prompt Preset Manager]\nExcluir todos os presest salvos?",
      allPresetsDeleted: "[NovelAI Prompt Preset Manager]\nTodos os presest foram excluídos."
    }
  };
  const uiMessageTranslations = {
    "en": {
      presetNameError: "The preset name contains invalid characters.",
      presetLengthError: "The preset name is too long.",
      tooltipEnableDebugLog: "Outputs debug logs to the console. Can be checked from devtools.",
      tooltipRemainToken: "Sets whether to leave the preset token in the metadata.",
      popupPresetAdded: "Preset added.⇒ ",
      popupPresetUpdated: "Preset updated.⇒ "
    },
    "ja": {
      presetNameError: "プリセット名に使用できない文字が含まれています。",
      presetLengthError: "プリセット名が長すぎます。",
      tooltipEnableDebugLog: "コンソールにデバッグログを出力します。devtoolsから確認できます。",
      tooltipRemainToken: "メタデータにプリセットトークンを残すかどうかを設定します。",
      popupPresetAdded: "プリセットが追加されました。⇒ ",
      popupPresetUpdated: "プリセットが更新されました。⇒ "
    },
    "zh": {
      presetNameError: "预设名称包含无效字符。",
      presetLengthError: "预设名称过长。",
      tooltipEnableDebugLog: "将调试日志输出到控制台。可以在 devtools 中查看。",
      tooltipRemainToken: "设置是否在元数据中保留预设令牌。",
      popupPresetAdded: "预设已添加。⇒ ",
      popupPresetUpdated: "预设已更新。⇒ "
    },
    "es": {
      presetNameError: "El nombre del presest contiene caracteres inválidos.",
      presetLengthError: "El nombre del presest es demasiado largo.",
      tooltipEnableDebugLog: "Se imprimen los registros de depuración en la consola. Se pueden verificar desde devtools.",
      tooltipRemainToken: "Se establece si se deja el token del presest en el metadato.",
      popupPresetAdded: "Presest agregado.⇒ ",
      popupPresetUpdated: "Presest actualizado.⇒ "
    },
    "id": {
      presetNameError: "Nama presest berisi karakter yang tidak valid.",
      presetLengthError: "Nama presest terlalu panjang.",
      tooltipEnableDebugLog: "Mencetak log debug ke konsol. Bisa dicek dari devtools.",
      tooltipRemainToken: "Menetapkan apakah token presest di simpan di metadata.",
      popupPresetAdded: "Presest ditambahkan.⇒ ",
      popupPresetUpdated: "Presest diperbarui.⇒ "
    },
    "pt": {
      presetNameError: "O nome do presest contém caracteres inválidos.",
      presetLengthError: "O nome do presest é muito longo.",
      tooltipEnableDebugLog: "Imprime os registros de depuração na console. Pode ser verificado do devtools.",
      tooltipRemainToken: "Define se o token do presest é salvo no metadado.",
      popupPresetAdded: "Presest adicionado.⇒ ",
      popupPresetUpdated: "Presest atualizado.⇒ "
    }
  };
  class UIManager {
    langCode;
    panel;
    jsonMgr;
    _onDocClick;
    constructor(root) {
      this.langCode = this.getLangCode();
      this.panel = this.injectUI(root);
      this.jsonMgr = jsonManagerSingleton;
    }
    getLangCode() {
      if (window.__userLang) {
        if (window.__userLang.startsWith("ja")) return "ja";
        if (window.__userLang.startsWith("zh")) return "zh";
        if (window.__userLang.startsWith("es")) return "es";
        if (window.__userLang.startsWith("id")) return "id";
        if (window.__userLang.startsWith("pt")) return "pt";
        return "en";
      } else return "en";
    }
    injectUI(root) {
      const panelID = "nai-preset-panel-injected";
      if (root) {
        const panel = this.createPresetManagerUI();
        panel.id = panelID;
        root.insertAdjacentElement("afterend", panel);
        return panel;
      }
      return null;
    }
    destroy() {
      if (!this.panel) return;
      if (this._onDocClick) {
        document.removeEventListener("click", this._onDocClick, false);
        this._onDocClick = void 0;
      }
      if (this.panel.isConnected) this.panel.remove();
      this.panel = null;
    }
    createPresetManagerUI() {
      const panel = document.createElement("div");
      panel.className = "nai-preset-panel";
      panel.style.position = "relative";
      panel.innerHTML = `
            <div class="nai-preset-title">Prompt Preset / Wildcards Manager</div>
            <div class="nai-gear-wrap">
                <button class="nai-gear-btn" title="Settings">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19.14 12.94a7.93 7.93 0 0 0 .05-.94 7.93 7.93 0 0 0-.05-.94l2.11-1.65a.5.5 0 0 0 .12-.65l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.2 7.2 0 0 0-1.63-.94l-.38-2.65A.5.5 0 0 0 13.7 3h-3.4a.5.5 0 0 0-.49.41l-.38 2.65a7.2 7.2 0 0 0-1.63.94l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.65l2.11 1.65c-.04.31-.05.63-.05.94s.01.63.05.94l-2.11 1.65a.5.5 0 0 0-.12.65l2 3.46c.13.23.39.32.6.22l2.49-1c.5.4 1.05.72 1.63.94l.38 2.65c.05.24.25.41.49.41h3.4c.24 0 .44-.17.49-.41l.38-2.65c.58-.22 1.13-.54 1.63-.94l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.65l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"/>
                </svg>
            </button>
            </div>
            <div class="nai-popup">
                <div class="nai-popup-header">
                    <h3 style="margin:0;font-size:16px">Settings</h3>
                    <a href="https://github.com/NeviumX/NovelAI-Prompt-Preset-Manager?tab=readme-ov-file#features" title="About this script" target="_blank" class="nai-info-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                    </a>
                </div>
                <button class="nai-btn nai-set-import" style="width:100%;margin-bottom:8px">Import Preset</button>
                <button class="nai-btn nai-set-export" style="width:100%;margin-bottom:8px">Export Preset</button>
                <button class="nai-btn nai-set-clear"  style="width:100%;color:red">Clear All Preset</button>
                <label class="nai-remain-row" data-tooltip="${uiMessageTranslations[this.langCode].tooltipRemainToken}">
                    <input type="checkbox" id="nai-remain-check">
                    <span>Remain Preset Token</span>
                </label>
                <label class="nai-remain-row" data-tooltip="${uiMessageTranslations[this.langCode].tooltipEnableDebugLog}">
                    <input type="checkbox" id="nai-debug-mode-check">
                    <span>Enable Debug Logging</span>
                </label>
                <input type="file" accept=".json,.txt" class="nai-file-input" style="display:none">
            </div>

            <div class="nai-textarea-wrapper">
                <textarea class="nai-preset-textarea" placeholder="masterpiece, best quality, oil painting (medium)" spellcheck="false"></textarea>
                <div class="nai-textarea-overlay"></div>
            </div>

            <div class="nai-preset-errormsg"></div>

            <div class="nai-preset-controls">
                <input  class="nai-preset-input" placeholder="Preset name">
                <button class="nai-btn nai-btn-add">ADD</button>
                <button class="nai-btn nai-btn-clear">CLEAR</button>
                <button class="nai-btn nai-btn-toggle">▴</button>
            </div>

            <div class="nai-preset-list"></div>

            <div class="nai-preset-search">
                <div class="nai-preset-search-wrapper">
                    <input class="nai-preset-search-box" placeholder="Filter presets...">
                    <button class="nai-preset-search-clear">×</button>
                </div>
                
                <button class="nai-btn nai-preset-search-button">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </button>
                <button class="nai-btn nai-btn-list-toggle">▴</button>
            </div>
        `;
      const textarea = panel.querySelector(".nai-preset-textarea");
      const overlay = panel.querySelector(".nai-textarea-overlay");
      const presetInput = panel.querySelector(".nai-preset-input");
      const errorMsgDiv = panel.querySelector(".nai-preset-errormsg");
      const updateOverlay = () => {
        const text = textarea.value;
        overlay.innerHTML = "";
        const fragment = document.createDocumentFragment();
        const lines = text.split("\n");
        lines.forEach((line, index) => {
          fragment.appendChild(document.createTextNode(line));
          if (index < lines.length - 1) {
            const newlineSpan = document.createElement("span");
            newlineSpan.className = "newline-char";
            newlineSpan.textContent = "\\n";
            fragment.appendChild(newlineSpan);
            fragment.appendChild(document.createElement("br"));
          }
        });
        overlay.appendChild(fragment);
      };
      const syncScroll = () => {
        overlay.scrollTop = textarea.scrollTop;
        overlay.scrollLeft = textarea.scrollLeft;
      };
      const autoResizeTextarea = (ta) => {
        ta.style.height = "auto";
        const newHeight = ta.scrollHeight + 2 + "px";
        ta.style.height = newHeight;
        overlay.style.height = newHeight;
        syncScroll();
      };
      textarea.addEventListener("input", () => {
        autoResizeTextarea(textarea);
        updateOverlay();
      });
      textarea.addEventListener("scroll", syncScroll);
      updateOverlay();
      const list = panel.querySelector(".nai-preset-list");
      GM_listValues().filter((k) => k.startsWith(PREFIX)).forEach(
        (k) => {
          const presetName = k.slice(PREFIX.length);
          list.appendChild(this.makeListItem(presetName));
        }
      );
      const scrollItemIntoView = (item) => {
        if (!item) return;
        if (list.scrollHeight > list.clientHeight) {
          item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      };
      const validationRe = /^[A-Za-z0-9_.-]+$/;
      const maxNameLength = 36;
      const validatePresetName = (name) => {
        if (name.length > maxNameLength) {
          return uiMessageTranslations[this.langCode].presetLengthError;
        }
        if (name.includes("__")) {
          return uiMessageTranslations[this.langCode].presetNameError;
        }
        if (name && !validationRe.test(name)) {
          return uiMessageTranslations[this.langCode].presetNameError;
        }
        return null;
      };
      presetInput.addEventListener("input", () => {
        const name = presetInput.value;
        const error = validatePresetName(name);
        if (error) {
          errorMsgDiv.textContent = error;
          errorMsgDiv.style.display = "block";
        } else {
          errorMsgDiv.textContent = "";
          errorMsgDiv.style.display = "none";
        }
      });
      const addBtn = panel.querySelector(".nai-btn-add");
      addBtn.onclick = () => {
        const btnFlashErr = () => {
          addBtn.style.animation = "Flash-Err 0.4s";
          setTimeout(() => addBtn.style.animation = "", 400);
        };
        const name = presetInput.value.trim();
        if (!name) {
          btnFlashErr();
          return;
        }
        const presetText = textarea.value;
        if (!presetText) {
          btnFlashErr();
          return;
        }
        if (name.includes("__")) {
          alert(
            messageTranslations[this.langCode].doubleUnderscoreError
          );
          btnFlashErr();
          return;
        }
        if (validatePresetName(name) !== null) {
          btnFlashErr();
          return;
        }
        const key = PREFIX + name;
        const alreadyExists = GM_getValue(key, null) !== null;
        GM_setValue(key, presetText);
        if (alreadyExists) {
          const item = [...list.children].find((el) => el.querySelector("span")?.textContent === name);
          if (item) {
            addBtn.style.animation = "Flash 0.4s";
            setTimeout(() => addBtn.style.animation = "", 400);
            scrollItemIntoView(item);
            item.style.animation = "Flash 0.4s";
            setTimeout(() => item.style.animation = "", 400);
          }
          this.showNotification(uiMessageTranslations[this.langCode].popupPresetUpdated + name);
        } else {
          const newItem = this.makeListItem(name);
          list.appendChild(newItem);
          addBtn.style.animation = "Flash 0.4s";
          setTimeout(() => addBtn.style.animation = "", 400);
          newItem.style.animation = "Flash 0.4s";
          scrollItemIntoView(newItem);
          setTimeout(() => newItem.style.animation = "", 400);
          this.showNotification(uiMessageTranslations[this.langCode].popupPresetAdded + name);
        }
        this.jsonMgr.updateDict();
        presetInput.value = "";
      };
      panel.querySelector(".nai-btn-clear").onclick = () => {
        textarea.value = "";
        presetInput.value = "";
        autoResizeTextarea(textarea);
        updateOverlay();
        errorMsgDiv.textContent = "";
        errorMsgDiv.style.display = "none";
      };
      panel.querySelector(".nai-btn-toggle").onclick = (e) => {
        const wrapper = panel.querySelector(".nai-textarea-wrapper");
        const hidden = wrapper.style.display === "none";
        wrapper.style.display = hidden ? "" : "none";
        e.target.textContent = hidden ? "▴" : "▾";
      };
      list.addEventListener("change", (e) => {
        const target = e.target;
        if (target.matches('input[type="checkbox"]')) {
          const item = target.closest(".nai-preset-item");
          const btn = item.querySelector(".nai-btn-remove");
          btn.style.display = target.checked ? "inline" : "none";
          if (target.checked) {
            const name = item.querySelector("span").textContent;
            const presetText = GM_getValue(PREFIX + name, "");
            textarea.value = presetText;
            autoResizeTextarea(textarea);
            updateOverlay();
            presetInput.value = name;
            const allCheckboxes = document.querySelectorAll('.nai-preset-item input[type="checkbox"]');
            const allBtns = document.querySelectorAll(".nai-btn-remove");
            allCheckboxes.forEach((el) => {
              if (el !== target) {
                el.checked = false;
              }
            });
            allBtns.forEach((el) => {
              if (el !== btn) {
                el.style.display = "none";
              }
            });
          }
        }
      });
      list.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.matches(".nai-btn-remove")) return;
        e.stopPropagation();
        e.preventDefault();
        const item = target.closest(".nai-preset-item");
        const name = item.querySelector("span").textContent;
        if (!confirm(messageTranslations[this.langCode].confirmDeletePreset + name)) return;
        GM_deleteValue(PREFIX + name);
        item.remove();
        this.jsonMgr.updateDict();
      });
      const searchBox = panel.querySelector(".nai-preset-search-box");
      const searchBtn = panel.querySelector(".nai-preset-search-button");
      const searchClearBtn = panel.querySelector(".nai-preset-search-clear");
      const filterPresets = () => {
        const searchTerm = searchBox.value.toLowerCase().trim();
        const presetItems = list.querySelectorAll(".nai-preset-item");
        presetItems.forEach((item) => {
          const presetName = item.querySelector("span").textContent.toLowerCase();
          if (presetName.includes(searchTerm)) {
            item.style.display = "inline-flex";
          } else {
            item.style.display = "none";
          }
        });
      };
      searchBox.addEventListener("input", () => {
        filterPresets();
        searchClearBtn.style.display = searchBox.value ? "flex" : "none";
      });
      searchBtn.addEventListener("click", () => {
        this.refreshListItems();
        filterPresets();
      });
      searchClearBtn.addEventListener("click", () => {
        searchBox.value = "";
        filterPresets();
        searchClearBtn.style.display = "none";
        searchBox.focus();
      });
      panel.querySelector(".nai-btn-list-toggle").onclick = (e) => {
        const presetList = panel.querySelector(".nai-preset-list");
        const hidden = presetList.style.display === "none";
        presetList.style.display = hidden ? "" : "none";
        e.target.textContent = hidden ? "▴" : "▾";
      };
      const gearBtn = panel.querySelector(".nai-gear-btn");
      const popup = panel.querySelector(".nai-popup");
      gearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isActive = popup.style.display === "block";
        popup.style.display = isActive ? "none" : "block";
        gearBtn.classList.toggle("active", !isActive);
      });
      const importBtn = panel.querySelector(".nai-set-import");
      const exportBtn = panel.querySelector(".nai-set-export");
      const clearBtn = panel.querySelector(".nai-set-clear");
      const fileInput = panel.querySelector(".nai-file-input");
      importBtn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        if (!fileInput.files || !fileInput.files[0]) return;
        const reader = new FileReader();
        let importCount = 0;
        reader.onload = () => {
          try {
            importCount = 0;
            const obj = JSON.parse(reader.result);
            Object.entries(obj).forEach(([name, prompt]) => {
              if (typeof prompt !== "string") return;
              const key = PREFIX + name;
              if (GM_getValue(key, null) === null) {
                GM_setValue(key, prompt);
                list.appendChild(this.makeListItem(name));
                importCount++;
              }
            });
          } catch (err) {
            alert(messageTranslations[this.langCode].importFailure + err.message);
            return;
          }
          if (importCount > 0) {
            console.log(`[NovelAI Prompt Preset Manager]
Imported ${importCount} new preset(s)!`);
            alert(messageTranslations[this.langCode].importSuccess.replace("${importCount}", importCount.toString()));
            this.jsonMgr.updateDict();
          }
          fileInput.value = "";
        };
        reader.readAsText(fileInput.files[0]);
      });
      exportBtn.addEventListener("click", () => {
        const data = {};
        GM_listValues().filter((k) => k.startsWith(PREFIX)).forEach((k) => {
          const presetName = k.slice(PREFIX.length);
          data[presetName] = GM_getValue(k, "");
        });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nai-prompt-presets_" + ( new Date()).toLocaleString("sv-SE", { hour12: false }).replace(" ", "_").replaceAll(":", "-") + ".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
      clearBtn.addEventListener("click", () => {
        if (!confirm(messageTranslations[this.langCode].confirmDeleteAllPresets)) return;
        GM_listValues().filter((k) => k.startsWith(PREFIX)).forEach((k) => GM_deleteValue(k));
        list.innerHTML = "";
        alert(messageTranslations[this.langCode].allPresetsDeleted);
        this.jsonMgr.updateDict();
      });
      this._onDocClick = (e) => {
        if (!panel.contains(e.target)) {
          popup.style.display = "none";
          gearBtn.classList.remove("active");
        }
      };
      document.addEventListener("click", this._onDocClick, false);
      const remainChk = panel.querySelector("#nai-remain-check");
      remainChk.checked = GM_getValue(TOKEN_REMAIN_TRG, false);
      remainChk.addEventListener("change", () => {
        GM_setValue(TOKEN_REMAIN_TRG, remainChk.checked);
        window.dispatchEvent(new CustomEvent("naiRemainUpdate", { detail: remainChk.checked }));
      });
      const debugChk = panel.querySelector("#nai-debug-mode-check");
      debugChk.checked = GM_getValue(DEBUG_MODE_TRG, false);
      debugChk.addEventListener("change", () => {
        GM_setValue(DEBUG_MODE_TRG, debugChk.checked);
        window.dispatchEvent(new CustomEvent("naiDebugUpdate", { detail: debugChk.checked }));
      });
      const focusableSelector = '.nai-btn, .nai-preset-search-button, .nai-preset-search-clear, .nai-gear-btn, .nai-preset-panel input[type="checkbox"], .nai-btn-remove';
      panel.addEventListener("mousedown", (e) => {
        const target = e.target.closest(focusableSelector);
        if (target) {
          target.setAttribute("data-mouse-clicked", "true");
        }
      }, true);
      panel.addEventListener("blur", (e) => {
        const target = e.target.closest(focusableSelector);
        if (target) {
          target.removeAttribute("data-mouse-clicked");
        }
      }, true);
      return panel;
    }
makeListItem(name) {
      const wrapper = document.createElement("label");
      wrapper.className = "nai-preset-item";
      wrapper.innerHTML = `
            <input type="checkbox">
            <span>${name}</span>
            <button class="nai-btn-remove">×</button>
            `;
      return wrapper;
    }
refreshListItems() {
      if (!this.panel) return;
      const list = this.panel.querySelector(".nai-preset-list");
      const presetItems = list.querySelectorAll(".nai-preset-item");
      presetItems.forEach((item) => item.remove());
      GM_listValues().filter((k) => k.startsWith(PREFIX)).forEach(
        (k) => {
          const presetName = k.slice(PREFIX.length);
          list.appendChild(this.makeListItem(presetName));
        }
      );
    }
showNotification(message) {
      if (!this.panel) return;
      const oldNotification = this.panel.querySelector(".nai-preset-notification");
      if (oldNotification) {
        oldNotification.remove();
      }
      const notification = document.createElement("div");
      notification.className = "nai-preset-notification";
      notification.textContent = message;
      this.panel.appendChild(notification);
      const addBtn = this.panel.querySelector(".nai-btn-add");
      if (addBtn) {
        const notifRect = notification.getBoundingClientRect();
        const btnRect = addBtn.getBoundingClientRect();
        const panelRect = this.panel.getBoundingClientRect();
        const newTop = btnRect.top - panelRect.top - notifRect.height - 17;
        const panelPaddingLeft = 15;
        const panelPaddingRight = 15;
        const centeredLeft = btnRect.left - panelRect.left + btnRect.width / 2 - notifRect.width / 2;
        const minLeft = panelPaddingLeft;
        const maxLeft = panelRect.width - panelPaddingRight - notifRect.width;
        const newLeft = Math.min(maxLeft, Math.max(minLeft, centeredLeft));
        notification.style.top = `${newTop}px`;
        notification.style.left = `${newLeft}px`;
      } else {
        notification.style.top = "10px";
        notification.style.right = "15px";
      }
      setTimeout(() => {
        if (notification.isConnected) {
          notification.remove();
        }
      }, 1500);
    }
  }
  class PromptBoxObserver {
    map;
    mo;
    constructor() {
      this.map = new Map();
      this.mo = new MutationObserver((m) => this.handle(m));
      this.start();
    }
    start() {
      this.mo.observe(document.documentElement, { childList: true, subtree: true });
    }
    attach(root) {
      const prev = this.map.get(root);
      if (prev && !prev.panel?.isConnected) {
        prev.destroy();
        this.map.delete(root);
      }
      if (!this.map.has(root)) {
        const ui = new UIManager(root);
        this.map.set(root, ui);
      }
    }
    detach(root) {
      const ui = this.map.get(root);
      if (!ui) return;
      ui.destroy();
      this.map.delete(root);
    }
    handle(muts) {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          n.querySelectorAll?.(
            ".image-gen-prompt-main"
          ).forEach((el) => {
            this.attach(el);
          });
        });
        m.removedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          n.querySelectorAll?.(
            ".image-gen-prompt-main"
          ).forEach((el) => {
            this.detach(el);
          });
        });
      });
    }
  }
  (function() {
    GM_addStyle(cssString);
    if (typeof JSZip !== "undefined") {
      unsafeWindow.JSZip = JSZip;
      console.log("[PresetMgr] JSZip successfully attached to page context (unsafeWindow).");
    } else {
      console.error("[PresetMgr] JSZip was not attached to page context (unsafeWindow)!");
    }
    if (typeof MessagePack !== "undefined") {
      unsafeWindow.MessagePack = MessagePack;
      console.log("[PresetMgr] MessagePack successfully attached to page context (unsafeWindow).");
    } else {
      console.error("[PresetMgr] MessagePack was not attached to page context (unsafeWindow)!");
    }
    const userLang = navigator.languages && navigator.languages[0] || navigator.language || "en";
    window.__userLang = userLang;
    window.__naiPmObserver ?? (window.__naiPmObserver = new ProseMirrorObserver(jsonManagerSingleton));
    window.__naiPromptObserver ?? (window.__naiPromptObserver = new PromptBoxObserver());
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const handleLayoutChange = (e) => {
      if (window.__naiPromptObserver && window.__naiPromptObserver.map) {
        window.__naiPromptObserver.map.forEach((uiManager) => {
          uiManager.refreshListItems();
        });
      }
    };
    mediaQuery.addEventListener("change", handleLayoutChange);
  })();

})();