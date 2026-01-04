// ==UserScript==
// @name         Monkey Chat Handler (Typing Style)
// @namespace    http://tampermonkey.net/
// @version      4
// @license MIT
// @description  A mod that handles monke bot's chats with a cool typing animation.
// @author       No one of importance
// @match        https://bonk.io/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547149/Monkey%20Chat%20Handler%20%28Typing%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547149/Monkey%20Chat%20Handler%20%28Typing%20Style%29.meta.js
// ==/UserScript==
let Currentvursion =4
GM_addStyle(`
    .cool-chat-message {
        border-left: 3px solid #4CAF50;
        padding: 5px 8px;
        margin: 4px 0;
        word-wrap: break-word;
    }

    .cool-chat-message a {
        color: #87CEEB;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.2s ease, text-decoration 0.2s ease;
    }

    .cool-chat-message a:hover {
        color: #98FB98;
        text-decoration: underline;
    }
`);

let autoCanv = function() {
    Object.defineProperty(this, 'chatBox1', {
        get: function() { return document.getElementById('newbonklobby_chat_content'); }
    });
    Object.defineProperty(this, 'chatBox2', {
        get: function() { return document.getElementById('ingamechatcontent'); }
    });
};
let canv = new autoCanv();
function scapino(str) {
  return str.replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
  );
}

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, rawr => {
    try {
      const url = new URL(rawr);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return scapino(rawr);
      const scatman = scapino(url.toString());
      return `<a href="${scatman}" target="_blank" rel="noopener noreferrer">${scatman}</a>`;
    } catch {
      return scapino(rawr);
    }
  });
}
async function displayInChat(msg, color = '#228B22', inner = true, size) {
    const TYPING_SPEED_MS = 30;
    const chatBox1 = canv.chatBox1;
    const chatBox2 = canv.chatBox2;

    if (!chatBox1 && !chatBox2) {
        console.error("No chatbox elements found!");
        return;
    }

    const scrollToBottom = () => {
        if (chatBox1) chatBox1.scrollTop = chatBox1.scrollHeight;
        if (chatBox2) chatBox2.scrollTop = chatBox2.scrollHeight;
    };

    const finalHtml = inner ? linkify(msg) : linkify(msg.replace(/</g, "&lt;").replace(/>/g, "&gt;"));

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = finalHtml;
    const plainText = tempDiv.textContent || "";

    const createMessageElements = () => {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'cool-chat-message';
        const typingSpan = document.createElement('span');
        typingSpan.style.color = color;
        if (size) {
            typingSpan.style.fontSize = size + 'px';
        }
        messageContainer.appendChild(typingSpan);
        return { messageContainer, typingSpan };
    };

    const elements1 = chatBox1 ? createMessageElements() : null;
    const elements2 = chatBox2 ? createMessageElements() : null;

    if (elements1) chatBox1.appendChild(elements1.messageContainer);
    if (elements2) chatBox2.appendChild(elements2.messageContainer);
    scrollToBottom();

    for (let i = 0; i < plainText.length; i++) {
        const char = plainText[i];
        if (elements1) elements1.typingSpan.textContent += char;
        if (elements2) elements2.typingSpan.textContent += char;
        scrollToBottom();
        await new Promise(resolve => setTimeout(resolve, TYPING_SPEED_MS));
    }

    if (elements1) elements1.typingSpan.innerHTML = finalHtml;
    if (elements2) elements2.typingSpan.innerHTML = finalHtml;
}

let autoName = function() {
    Object.defineProperty(this, 'name', {
        get: function() {
            return document.getElementById("pretty_top_name")?.textContent;
        }
    });
};
let name = new autoName();

let monkTypes = {
    handleJoining: {
        run: function(data) {
            if (data[0].to == name.name && data[0].version==Currentvursion) {
                pack(`4,{"initiator":"monke","type":"returnMessage","confirmed":"yes","from":"${name.name}"}`);
            }
        },
        variables: ['data'],
    },
    chatMessage: {
        run: function(data) {
            if (data[0].to == name.name) {
                const message = Mycipher.decrypt(data[0].message);
                displayInChat(message);
            }
        },
        variables: ['data'],
    },
};
let monkVariableTypes = {
    data: {
        description: 'returns the data from the monk command',
        returned: function(data) {
            return data;
        }
    }
};

function handleMonk(data) {
    let runner = monkTypes[data.type];
    if (!runner) return;
    runner.run(runner.variables.map(variable => monkVariableTypes[variable].returned(data)));
}

let Mycipher;
let oldsend = WebSocket.prototype.send;
let code = function(xx) {
    if (xx == "5") {
        window.bonkws = this;
        let old_onmsg = this.onmessage;
        this.onmessage = function(yy) {
            if (yy.data.startsWith("42[")) {
                try {
                    let data = JSON.parse(yy.data.slice(2));
 if (data[0] == 21) {
                            if(data[1].wl.startsWith('monke:')){
                                //expected monke:encryption key:rounds
                                let fullstring=data[1].wl;
                                let parts = data[1].wl.split(':');
            Mycipher = new EduCipher(parts[1]);
                pack(`4,{"initiator":"monke","type":"returnMessage","key":"${Mycipher.encrypt(parts[1])}","from":"${name.name}"}`);
let newString=yy.data.replace('"'+fullstring+'"',parts[2]);
old_onmsg.call(this,{data:newString});
return
                        }}
                    if (data[0] == 7 && data[2].initiator == 'monke') {
                        handleMonk(data[2]);
                    }
                } catch (e) {}
            }
            return old_onmsg.call(this, yy);
        };
    }
    return oldsend.call(this, xx);
};

function fixOverwriteBitch() {
    WebSocket.prototype.send = code;
}
fixOverwriteBitch();

async function pack(input) {
    if (window.bonkws && window.bonkws.readyState === 1) {
        await window.bonkws.send("42[" + input + "]");
    } else {
        console.error("Bonk WebSocket not ready to send message.");
    }
}
class EduCipher {
    constructor(masterKey) {
        this.BLOCK_SIZE = 16;
        this.NUM_ROUNDS = 8;
        
        const { substitutionTable, reverseSubstitutionTable } = this._createSubstitutionTables(masterKey);
        this.substitutionTable = substitutionTable;
        this.reverseSubstitutionTable = reverseSubstitutionTable;
        this.roundKeys = this._expandKeyToRoundKeys(masterKey);
    }

    _createSubstitutionTables(key) {
        const substitutionTable = new Uint8Array(256);
        const reverseSubstitutionTable = new Uint8Array(256);

        for (let i = 0; i < 256; i++) {
            substitutionTable[i] = i;
        }

        let shuffleIndex = 0;
        for (let i = 0; i < 256; i++) {
            const keyByte = key.charCodeAt(i % key.length);
            shuffleIndex = (shuffleIndex + substitutionTable[i] + keyByte) % 256;
            [substitutionTable[i], substitutionTable[shuffleIndex]] = [substitutionTable[shuffleIndex], substitutionTable[i]];
        }

        for (let i = 0; i < 256; i++) {
            reverseSubstitutionTable[substitutionTable[i]] = i;
        }
        
        return { substitutionTable, reverseSubstitutionTable };
    }

    _expandKeyToRoundKeys(masterKey) {
        const expandedKeys = [];
        let currentKey = new Uint8Array(this.BLOCK_SIZE);

        for (let i = 0; i < this.BLOCK_SIZE; i++) {
            currentKey[i] = masterKey.charCodeAt(i % masterKey.length) || 0;
        }

        for (let round = 0; round < this.NUM_ROUNDS + 1; round++) {
            expandedKeys.push(new Uint8Array(currentKey));
            
            currentKey[0] = this.substitutionTable[currentKey[0]] ^ (round + 1);
            for (let i = 1; i < this.BLOCK_SIZE; i++) {
                currentKey[i] = this.substitutionTable[currentKey[i]] ^ currentKey[i - 1];
            }
        }
        
        return expandedKeys;
    }

    encrypt(message) {
        const messageAsBytes = new TextEncoder().encode(message);
        const paddedMessage = this._addPadding(messageAsBytes);
        const encryptedBlocks = new Uint8Array(paddedMessage.length);
        const iv = this._getInsecureRandomBytes(this.BLOCK_SIZE);
        
        let previousCipherBlock = iv;

        for (let i = 0; i < paddedMessage.length; i += this.BLOCK_SIZE) {
            let blockToEncrypt = paddedMessage.slice(i, i + this.BLOCK_SIZE);

            for (let j = 0; j < this.BLOCK_SIZE; j++) {
                blockToEncrypt[j] ^= previousCipherBlock[j];
            }

            const encryptedBlock = this._encryptBlock(blockToEncrypt);
            
            encryptedBlocks.set(encryptedBlock, i);
            previousCipherBlock = encryptedBlock;
        }

        const finalPayload = new Uint8Array(iv.length + encryptedBlocks.length);
        finalPayload.set(iv);
        finalPayload.set(encryptedBlocks, iv.length);

        return btoa(String.fromCharCode(...finalPayload));
    }

    decrypt(encryptedBase64) {
        const combinedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        
        const iv = combinedBytes.slice(0, this.BLOCK_SIZE);
        const encryptedMessage = combinedBytes.slice(this.BLOCK_SIZE);
        const decryptedBlocks = new Uint8Array(encryptedMessage.length);
        
        let previousCipherBlock = iv;

        for (let i = 0; i < encryptedMessage.length; i += this.BLOCK_SIZE) {
            const blockToDecrypt = encryptedMessage.slice(i, i + this.BLOCK_SIZE);
            const decryptedBlock = this._decryptBlock(blockToDecrypt);

            for (let j = 0; j < this.BLOCK_SIZE; j++) {
                decryptedBlock[j] ^= previousCipherBlock[j];
            }
            
            decryptedBlocks.set(decryptedBlock, i);
            previousCipherBlock = blockToDecrypt;
        }

        const unpaddedBytes = this._removePadding(decryptedBlocks);
        
        return new TextDecoder().decode(unpaddedBytes);
    }
    
    _encryptBlock(block) {
        let state = new Uint8Array(block);
        this._mixWithRoundKey(state, this.roundKeys[0]);

        for (let round = 1; round < this.NUM_ROUNDS; round++) {
            this._substituteBytes(state, this.substitutionTable);
            this._shiftBytes(state);
            this._mixWithRoundKey(state, this.roundKeys[round]);
        }

        this._substituteBytes(state, this.substitutionTable);
        this._mixWithRoundKey(state, this.roundKeys[this.NUM_ROUNDS]);

        return state;
    }

    _decryptBlock(block) {
        let state = new Uint8Array(block);
        
        this._mixWithRoundKey(state, this.roundKeys[this.NUM_ROUNDS]);
        this._substituteBytes(state, this.reverseSubstitutionTable);
        
        for (let round = this.NUM_ROUNDS - 1; round >= 1; round--) {
            this._mixWithRoundKey(state, this.roundKeys[round]);
            this._reverseShiftBytes(state);
            this._substituteBytes(state, this.reverseSubstitutionTable);
        }

        this._mixWithRoundKey(state, this.roundKeys[0]);
        return state;
    }
    
    _substituteBytes(state, table) {
        for (let i = 0; i < state.length; i++) state[i] = table[state[i]];
    }

    _shiftBytes(state) {
        const firstByte = state[0];
        state.copyWithin(0, 1);
        state[state.length - 1] = firstByte;
    }
    
    _reverseShiftBytes(state) {
        const lastByte = state[state.length - 1];
        state.copyWithin(1, 0);
        state[0] = lastByte;
    }

    _mixWithRoundKey(state, roundKey) {
        for (let i = 0; i < state.length; i++) state[i] ^= roundKey[i];
    }
    
    _addPadding(data) {
        const padLength = this.BLOCK_SIZE - (data.length % this.BLOCK_SIZE);
        const padding = new Uint8Array(padLength).fill(padLength);
        const result = new Uint8Array(data.length + padLength);
        result.set(data);
        result.set(padding, data.length);
        return result;
    }

    _removePadding(data) {
        const padLength = data[data.length - 1];
        if (padLength === 0 || padLength > data.length) {
            throw new Error("Invalid padding detected. Decryption failed.");
        }
        return data.slice(0, data.length - padLength);
    }

    _getInsecureRandomBytes(length) {
        const randomBytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
        return randomBytes;
    }
}