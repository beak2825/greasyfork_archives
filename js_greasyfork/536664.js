// ==UserScript==
// @name         JanitorAI Char Card Downloader
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Downloads JanitorAI bot descriptions as PNG Character v2 cards.
// @author       Gemini, mostly
// @match        http*://*.janitorai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536664/JanitorAI%20Char%20Card%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536664/JanitorAI%20Char%20Card%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper Functions ---

    /**
     * Encodes a UTF-8 string to Base64.
     * @param {string} str The UTF-8 string to encode.
     * @returns {string} The Base64 encoded string.
     */
    function utf8ToBase64(str) {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
        let binaryString = '';
        uint8Array.forEach(byte => {
            binaryString += String.fromCharCode(byte);
        });
        return btoa(binaryString);
    }

    /**
     * Generates a CRC32 lookup table.
     * @returns {Uint32Array} The CRC32 lookup table.
     */
    function makeCRCTable() {
        const table = new Uint32Array(256);
        const poly = 0xEDB88320; // Reversed polynomial for CRC32
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) {
                if (c & 1) {
                    c = poly ^ (c >>> 1);
                } else {
                    c = c >>> 1;
                }
            }
            table[n] = c;
        }
        return table;
    }

    // Pre-compute CRC32 table for efficiency
    const crcTable = makeCRCTable();

    /**
     * Calculates CRC32 for a Uint8Array.
     * @param {Uint8Array} bytes The byte array to calculate CRC32 for.
     * @param {number} [start=0] The starting offset in the byte array.
     * @param {number} [length=bytes.length-start] The number of bytes to process.
     * @returns {number} The CRC32 checksum as an unsigned 32-bit integer.
     */
    function crc32(bytes, start = 0, length = bytes.length - start) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < length; i++) {
            const byte = bytes[start + i];
            crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xFF];
        }
        return (crc ^ 0xFFFFFFFF) >>> 0; // Ensure unsigned 32-bit integer
    }


    // --- Main Download Function ---

    /**
     * Fetches a WebP image, converts it to PNG, adds a tEXt chunk with Base64 encoded text,
     * and downloads it.
     * @param {string} name The base name for the downloaded file (e.g., "myImage").
     * ".png" will be appended.
     * @param {string} url The URL of the WebP image.
     * @param {string} text The text to embed in the tEXt chunk (will be Base64 encoded).
     */
    async function downloadImageWithText(name, url, text) {
        try {
            // 1. Fetch WebP image
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for URL: ${url}`);
            }
            const webpBlob = await response.blob();

            // 2. Transcode WebP to PNG using Canvas
            const imageBitmap = await createImageBitmap(webpBlob);
            const canvas = document.createElement('canvas');
            canvas.width = imageBitmap.width;
            canvas.height = imageBitmap.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                 throw new Error("Could not get 2D rendering context from canvas.");
            }
            ctx.drawImage(imageBitmap, 0, 0);
            if (typeof imageBitmap.close === 'function') {
                imageBitmap.close(); // Release memory if available
            }

            // Get initial PNG data as Uint8Array
            const base64PngDataUrl = canvas.toDataURL('image/png');
            const pngPrefix = "data:image/png;base64,";
            if (!base64PngDataUrl.startsWith(pngPrefix)) {
                throw new Error("Canvas did not return a valid PNG data URL.");
            }
            const base64Data = base64PngDataUrl.substring(pngPrefix.length);
            const binaryString = atob(base64Data); // Decode base64 to binary string
            const initialPngBytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                initialPngBytes[i] = binaryString.charCodeAt(i);
            }

            // 3. Prepare tEXt chunk
            const keyword = "chara"; // Or "Comment", "GreasemonkeyText", etc.
            const base64EncodedUserText = utf8ToBase64(text);

            const textEncoder = new TextEncoder();
            const keywordBytes = textEncoder.encode(keyword);
            const nullSeparatorByte = new Uint8Array([0]);
            const textContentBytes = textEncoder.encode(base64EncodedUserText); // Base64 is ASCII

            // Data for the tEXt chunk: Keyword + Null + Text
            const chunkData = new Uint8Array(
                keywordBytes.length + nullSeparatorByte.length + textContentBytes.length
            );
            chunkData.set(keywordBytes, 0);
            chunkData.set(nullSeparatorByte, keywordBytes.length);
            chunkData.set(textContentBytes, keywordBytes.length + nullSeparatorByte.length);

            // Chunk Type: "tEXt" (ASCII: 116, 69, 88, 116)
            const chunkTypeBytes = new Uint8Array([116, 69, 88, 116]);

            // Chunk Data Length (4 bytes, big-endian)
            const chunkDataLength = chunkData.length;
            const chunkLengthBytes = new Uint8Array(4);
            new DataView(chunkLengthBytes.buffer).setUint32(0, chunkDataLength, false); // false for big-endian

            // CRC (4 bytes, big-endian): calculated over Chunk Type + Chunk Data
            const bytesForCRC = new Uint8Array(chunkTypeBytes.length + chunkData.length);
            bytesForCRC.set(chunkTypeBytes, 0);
            bytesForCRC.set(chunkData, chunkTypeBytes.length);
            const crcValue = crc32(bytesForCRC);
            const crcBytes = new Uint8Array(4);
            new DataView(crcBytes.buffer).setUint32(0, crcValue, false);

            // Assemble the full tEXt chunk: Length + Type + Data + CRC
            const textChunkBytes = new Uint8Array(
                chunkLengthBytes.length +
                chunkTypeBytes.length +
                chunkData.length +
                crcBytes.length
            );
            textChunkBytes.set(chunkLengthBytes, 0);
            textChunkBytes.set(chunkTypeBytes, chunkLengthBytes.length);
            textChunkBytes.set(chunkData, chunkLengthBytes.length + chunkTypeBytes.length);
            textChunkBytes.set(crcBytes, chunkLengthBytes.length + chunkTypeBytes.length + chunkData.length);

            // 4. Inject tEXt chunk before IEND chunk
            // The IEND chunk is always the last chunk in a PNG file and is 12 bytes long.
            // (4 bytes for length 0, 4 bytes for "IEND" type, 4 bytes for CRC)
            const iendChunkPosition = initialPngBytes.length - 12;

            if (iendChunkPosition < 8) { // PNG signature is 8 bytes
                throw new Error("PNG data is too short to contain a valid IEND chunk.");
            }

            // Basic validation of IEND chunk's type 'IEND' for sanity check
            // ASCII: I=73, E=69, N=78, D=68
            // Position in initialPngBytes: iendChunkPosition + 4 to iendChunkPosition + 7 for type
            if (initialPngBytes[iendChunkPosition + 4] !== 73 ||
                initialPngBytes[iendChunkPosition + 5] !== 69 ||
                initialPngBytes[iendChunkPosition + 6] !== 78 ||
                initialPngBytes[iendChunkPosition + 7] !== 68) {
                console.warn("Could not reliably identify IEND chunk type at the expected position. The resulting PNG might have issues if the tEXt chunk is inserted incorrectly. This can happen if the canvas output is non-standard.");
            }

            const bytesBeforeIEND = initialPngBytes.subarray(0, iendChunkPosition);
            const iendChunk = initialPngBytes.subarray(iendChunkPosition); // The 12-byte IEND chunk

            // Concatenate: PNG data before IEND + tEXt chunk + IEND chunk
            const finalPngBytes = new Uint8Array(
                bytesBeforeIEND.length + textChunkBytes.length + iendChunk.length
            );
            finalPngBytes.set(bytesBeforeIEND, 0);
            finalPngBytes.set(textChunkBytes, bytesBeforeIEND.length);
            finalPngBytes.set(iendChunk, bytesBeforeIEND.length + textChunkBytes.length);

            // 5. Create Blob and Trigger Download
            const finalPngBlob = new Blob([finalPngBytes], { type: 'image/png' });
            const objectUrl = URL.createObjectURL(finalPngBlob);

            const a = document.createElement('a');
            a.style.display = 'none'; // Hide the anchor element
            a.href = objectUrl;
            a.download = `${name}.png`; // Append .png to the provided name
            document.body.appendChild(a);
            a.click();

            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error(`Error in downloadImageWithText function for "${name}":`, error);
            // In a Greasemonkey script, you might want to use alert() or a custom notification
            alert(`Failed to download and process image "${name}": ${error.message}`);
        }
    }

    // Create the button
    const button = document.createElement('button');
    button.innerText = 'Download Card';
    button.style.position = 'fixed';
    button.style.top = '8px'; // Move to the top of the screen
    button.style.left = '50%'; // Center horizontally
    button.style.transform = 'translate(-50%, 0)'; // Adjust for horizontal centering
    button.style.padding = '5px 8px'; // Reduced vertical padding
    button.style.borderRadius = '6px';
    button.style.backgroundColor = 'rgba(128, 90, 213, 0.6)';
    button.style.color = 'var(--chakra-colors-whiteAlpha-800)';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.fontFamily = 'var(--chakra-fonts-body)';
    button.style.lineHeight = '1';
    button.style.fontSize = '14px';

    function stripCopy(t) {
        return t.replaceAll(/^created by.*janitorai.com$/gm, '').trim();
    }

    var card;

    function setCard(jc) {
        card = {
      spec: 'chara_card_v2',
      spec_version: '2.0', // May 8th addition
      data: {
        name: jc.name,
        creator_notes: stripCopy(jc.description),
        description: stripCopy(jc.personality),
        scenario: stripCopy(jc.scenario),
        first_mes: stripCopy(jc.first_message),
        mes_example: stripCopy(jc.example_dialogs),

        // New fields start here
         /*
        system_prompt: string
        post_history_instructions: string
        alternate_greetings: Array<string>
        character_book?: CharacterBook
      */
        // May 8th additions
        tags: jc.tags.map(x=>x.slug).concat(jc.custom_tags || []),
        creator: jc.creator_name,
        character_version: jc.updated_at,
        extensions: jc,
          }
        };
        for (const f of ['description', 'personality', 'scenario', 'first_message', 'example_dialogs']) {
            delete jc[f];
        }
        button.style.display='block';
    }

    try {
        setCard(Object.values(JSON.parse(JSON.parse(document.evaluate('//script[contains(.,"_storeState_")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue.text.match(/JSON.parse\((".*)\);/)[1]))).filter(x=>x.character)[0].character);
    } catch {}

    (function (open) {
      XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", () => {
          if (this.readyState == 4) {
              if (this.responseURL.match(/\/characters\//)) {
                  try {
                      setCard(JSON.parse(this.responseText));
                      // console.log("loaded card",  this.responseURL, this.responseText.slice(0, 15));
                  } catch{
                      button.style.display='none';
                  }
              }
          }
        }, false);
        return open.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open);

    button.addEventListener('click', () => {
        downloadImageWithText(`janitorai - ${card.data.name}`, `https://ella.janitorai.com/bot-avatars/${card.data.extensions.avatar}`, JSON.stringify(card));
    });

    if (!card) {
        button.style.display='none';
    }

    document.body.prepend(button);
})();