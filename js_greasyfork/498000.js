// ==UserScript==
// @name         OpenAI Censor
// @namespace    http://tampermonkey.net/
// @version      2024-06-19
// @description  Encode/decode words from the given file on the ChatGPT page to hide sensitive info.
// @author       Screeneroner
// @license      GPL v3
// @homepageURL  https://github.com/screeneroner/OpenAI-Censor
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://seeklogo.com/images/C/chatgpt-logo-4AE4C3B8A4-seeklogo.com.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498000/OpenAI%20Censor.user.js
// @updateURL https://update.greasyfork.org/scripts/498000/OpenAI%20Censor.meta.js
// ==/UserScript==

/*——————————————————————————————————————————————————————————————————————————————————————————————————

This code is free software: you can redistribute it and/or modify  it under the terms of the
version 3 GNU General Public License as published by the Free Software Foundation.

This code is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY without even
the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details (https://www.gnu.org/licenses/gpl-3.0.html)

WARNING TO USERS AND MODIFIERS

This script contains "Buy me a coffee" links to honor the author's hard work and dedication in creating
all features present in this code. Removing or altering these links not only violates the GPL license
but also disregards the significant effort put into making this script valuable for the community.

If you find value in this script and would like to show appreciation to the author,
kindly consider visiting the site below and treating the author to a few cups of coffee:

https://www.buymeacoffee.com/screeneroner

Your honor and gratitude is greatly appreciated.

——————————————————————————————————————————————————————————————————————————————————————————————————*/

/*——————————————————————————————————————————————————————————————————————————————————————————————————

## Three can keep a secret if two are dead

AI is a powerful tool that may use your inputs to "improve models," "enhance your experience," and
other similar purposes. This means YOUR TEXTS MUST BE STORED SOMEWHERE, in a location that you do
not have access to verify or delete them. Even if you accidentally send your ABSOLUTELY PRIVATE
information, it could be stored. To prevent even a theoretical possibility of disclosing your own
secrets or confidential information about clients and/or customers, you SHOULD NOT SHARE IT AT ALL!
However, for example, if you are using AI to correct grammar, wording, and tone of your letters,
you must use the exact text in the AI prompts.

## Hide it to keep it

The solution for this dichotomy is straightforward - just replace real words with their 'anonymized'
analogs! Instead of calling your client by its real name 'Super Secret IT Company LTD.', use
'Client Company Name' in the prompt. There are two main problems with this approach. The first is
that there may be many places in your text where you need to make these changes. It can take a lot
of time to replace them all, and you may miss some entries, leaving them unhidden. The second
problem is that the response from the AI will contain these 'anonymized' words, and you will need
to replace them back to get 'unhidden' text.

This script will handle the above-described routine for you! You should prepare the encrypting file
in a zebra-like format. The first row contains the real word(s), and the second row contains its
anonymized version. Like this:
```
Apple
Client Company
Steve Jobs
John Smith
```
The script will inject the transcoding codes into the OpenAI ChatGPT web page along with three
buttons below the entry field: Choose File, Unhide, and Hide. The first button will load the
'encrypting' file (you may use several ones). When you press the Hide button, it will scan the
entire page (including the prompt entry text area) and replace real words with anonymized ones.
From this moment, you can safely send your texts to the AI. Once you get a response and press the
Unhide button, the script will do a reverse translation, and you will see the original texts and
words ready to be copy-pasted.

The important point here is that the AI operates with anonymized text only. The real, de-anonymized
texts remain in the operational memory of your local computer and become unhidden only when you
load the proper encoding file and press the Unhide button!

## How to use this script

1. Download and install a browser add-on like Tampermonkey (or similar)
2. Install this OpenAI Censor script according to the add-on's script installation procedure.
3. Prepare and save the encoding file with pairs of rows that contain real and encoded text.
4. Open the ChatGPT web page. You should see a new row with the script buttons under the input area.
5. Press the Choose File button and load your encryption file.
6. Type your prompt.
7. Press the Hide button and verify that all real words were anonymized.
8. Send the anonymized prompt to the AI and get its response.
9. Press the Unhide button to replace anonymized words with the originals and get the original texts.
10. Profit!

——————————————————————————————————————————————————————————————————————————————————————————————————*/

// VERSION CHANGES
// 2024-06-15 Initial release
// 2024-06-19 Fixed bug when encoding data was not cleared on re-reading (changed) encoding file.

(function() {
    'use strict';

const placeholders = {};
const instructionText = "WARNING! Tokens in ««»», represent some hidden words and in your responses they should be used as-is without any changes inside the ««»»!";

const replace = (text, dict, reverse = false) => {
    if (typeof text !== 'string') return text;
    if (reverse) {
        for (let i = 1; i < dict.length; i += 2) {
            const pattern = `««${dict[i]}»»`;
            const re = new RegExp(pattern, 'g');
            text = text.replace(re, dict[i - 1]);
        }
    } else {
        for (let i = 0; i < dict.length; i += 2) {
            const pattern = dict[i];
            const replacement = `««${dict[i + 1]}»»`;
            const re = new RegExp(pattern, 'g');
            text = text.replace(re, replacement);
        }
    }
    return text;
};

const processTextNodes = (node, dict, reverse = false) => {
    if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = replace(node.nodeValue, dict, reverse);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName !== 'INPUT' && node.tagName !== 'TEXTAREA' && node.tagName !== 'SELECT') {
            node.childNodes.forEach(child => processTextNodes(child, dict, reverse));
        } else if (node.tagName === 'INPUT' && node.type !== 'file') {
            node.value = replace(node.value, dict, reverse);
        } else if (node.tagName === 'TEXTAREA') {
            node.value = replace(node.value, dict, reverse);
        }
    }
};

const createButton = (text, onClick, bgColor) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, { width:'100px', display:'inline-block', padding:'2px 4px',
        color:'#fff', backgroundColor:bgColor, borderColor:bgColor, borderRadius:'3px', height:'100%' });
    btn.onclick = (event) => { event.preventDefault(); onClick(); };
    return btn;
};

const removeInstructionTextGlobally = () => {
    const replaceInstructionText = (node) => {
        if (node.nodeType === Node.TEXT_NODE)
            node.nodeValue = node.nodeValue.replace(new RegExp(instructionText, 'g'), '');
        else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceInstructionText);
            if (node.tagName === 'TEXTAREA') {
                node.value = node.value.replace(new RegExp(instructionText, 'g'), '');
            }
        }
    };
    replaceInstructionText(document.body);
};

const addInstructionText = () => {
    const promptTextarea = document.getElementById('prompt-textarea');
    if (promptTextarea && !promptTextarea.value.includes(instructionText)) {
        promptTextarea.value += ` ${instructionText}`;
    }
};

const addContainer = () => {
    const existingContainer = document.getElementById('encoding-container');
    if (existingContainer) return;

    const container = document.createElement('div');
    container.id = 'encoding-container';
    Object.assign(container.style, { display:'flex', flexDirection:'row', gap:'6px', margin:'6px', width:'100%', justifyContent:'center', alignItems: 'stretch', scale: '0.8' });

    // Create Buy me a coffee button
    const bmcContainer = document.createElement('div');
    bmcContainer.innerHTML = `
        <a href="https://www.buymeacoffee.com/screeneroner" target="_blank">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 28px !important;margin-right: 8px" >
        </a>
    `;

    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';

    fileInput.onchange = event => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const lines = e.target.result.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                    Object.keys(placeholders).forEach(key => delete placeholders[key]); // Clear existing placeholders
                    for (let i = 0; i < lines.length; i++) {
                        placeholders[i] = lines[i];
                    }
                } catch (err) {
                    alert('Error reading or parsing file.');
                }
            };
            reader.readAsText(file);
        }
    };

    container.append(
        bmcContainer,
        fileInput,
        createButton('UNHIDE', () => { removeInstructionTextGlobally(); processTextNodes(document.body, Object.values(placeholders), true); }, '#d9534f'),
        createButton('HIDE', () => { processTextNodes(document.body, Object.values(placeholders), false); addInstructionText(); }, '#5cb85c')
    );

    const promptTextarea = document.getElementById('prompt-textarea');
    if (promptTextarea) {
        promptTextarea.parentNode.insertBefore(container, promptTextarea.nextSibling);
    } else {
        document.body.appendChild(container);
    }
};

setInterval(addContainer, 5000);

})();
