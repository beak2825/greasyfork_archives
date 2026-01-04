// ==UserScript==
// @name        Google Finance Highlights via Gemini AI
// @description Google Finance with AI-Generated Summary via Gemini
// @version         0.5
// @license         MIT
// @namespace  djshigel
// @match        https://www.google.com/finance/*
// @run-at       document-end
// @grant           GM.setValue
// @grant           GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/499220/Google%20Finance%20Highlights%20via%20Gemini%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/499220/Google%20Finance%20Highlights%20via%20Gemini%20AI.meta.js
// ==/UserScript==

(async () => {
    let GEMINI_API_KEY = await GM.getValue("GEMINI_API_KEY") ;
    if (!GEMINI_API_KEY || !Object.keys(GEMINI_API_KEY).length) {
        GEMINI_API_KEY = window.prompt('Get Generative Language Client API key from Google AI Studio\nhttps://ai.google.dev/aistudio', '');
        await GM.setValue("GEMINI_API_KEY", GEMINI_API_KEY);
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ########## Highlight ##########
    const insertHighlightElement = () => {
        const contentElements = document.querySelectorAll('body>c-wiz>div>div');
        if (contentElements.length >= 4) {
            const targetInsertPosition = contentElements[3];
            const highlightElement = document.createElement('div');
            highlightElement.id = 'gemini-highlight';
            highlightElement.innerHTML = (new URL(location.href).searchParams.get('hl') == 'ja') ?
                `<div style='
                    font-size: 1.5em; 
                    margin-bottom: 10px; 
                    -webkit-background-clip: text!important; 
                    -webkit-text-fill-color: transparent; 
                    background: linear-gradient(to right, #4698e2, #c6657b); 
                    width: fit-content;' id='gemini-highlight-header'>
                    ✦ Geminiによるハイライト
                </div>
                <div id='gemini-highlight-content'>
                </div>`:
                `<div style='
                    font-size: 1.5em; 
                    margin-bottom: 10px; 
                    -webkit-background-clip: text!important; 
                    -webkit-text-fill-color: transparent; 
                    background: linear-gradient(to right, #4698e2, #c6657b); 
                    width: fit-content;' id='gemini-highlight-header'>
                    ✦ Highlights via Gemini
                </div>
                <div id='gemini-highlight-content'>
                </div>`;
            targetInsertPosition.prepend(highlightElement);
        }
    };

    const processHighlight = async (urls) => {
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                document.querySelector('#gemini-ticker').style.opacity = '1';
                const response = (new URL(location.href).searchParams.get('hl') == 'ja') ?
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `以下は最新のニュースのハイライトです。経済動向の深堀りも含めて、20文で要約してください。返事や番号は不要です: 
                                    ${urls}`
                                }],
                            }]
                        }),
                    }):
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `Below are some recent news highlights, with 20 sentences to dive deeper into; No reply or number needed.: 
                                    ${urls}`
                                }],
                            }]
                        }),
                    });

                if (!response.ok) throw new Error('Network response was not ok');

                const reader = response.body.getReader();
                let result = '', done = false, decoder = new TextDecoder();
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) result += decoder.decode(value, { stream: true });
                }
                result += decoder.decode();

                const data = JSON.parse(result);
                let summary = (data.candidates[0]?.content?.parts[0]?.text || '').replace(/\*\*/g, '').replace(/##/g, '');
                console.log(`highlights: ${summary}`);

                insertHighlightElement();
                let targetElement = document.querySelector('#gemini-highlight-content');
                if (!targetElement) {
                    console.error('No target element found for summary insertion');
                    return;
                }
            
                let displayText = targetElement.textContent + ' ';
                const chunkSize = 20;
                targetElement.textContent = displayText;
                for (let i = 0; i < summary.length; i += chunkSize) {
                    const chunk = summary.slice(i, i + chunkSize);
                    const chunkSpan = document.createElement('span');
                    chunkSpan.style.opacity = '0';
                    chunkSpan.textContent = chunk;
                    targetElement.appendChild(chunkSpan);
                    await delay(100);
                    chunkSpan.style.transition = 'opacity 1s ease-in-out';
                    chunkSpan.style.opacity = '1';
                }
                return;
            } catch (error) {
                document.querySelector('#gemini-ticker').style.opacity = '0';
                await delay(5000);
                console.error('Error:', error);
            }
        }
    };

    // ########## Ticker ##########
    const insertTickerElement = () => {
        if (document.querySelector('#gemini-ticker')) return;
        const ticker = document.createElement('div');
        ticker.id = 'gemini-ticker';
        ticker.style.position = 'fixed';
        ticker.style.right = '20px';
        ticker.style.bottom = '10px';
        ticker.style.fontSize = '1.5em';
        ticker.style.color = '#77777777';
        ticker.style.transition = 'opacity .3s';
        ticker.style.zIndex = '100';
        ticker.innerHTML = '✦';
        document.querySelector('body').appendChild(ticker);
    };

    // ########## Settings ##########
    const insertSettingsElement = () => {
        if (document.querySelector('#gemini-api-settings') || !document.querySelector('a[href*="./settings/"]')) return;
        const settingsLink = document.createElement('div');
        settingsLink.id = 'gemini-api-settings';
        settingsLink.style.height = '64px';
        settingsLink.style.alignContent = 'center';
        settingsLink.innerHTML = (new URL(location.href).searchParams.get('hl') == 'ja') ? 
            `<a style="height: 34px; font-size: 14px;">Google News Enhanced: Gemini APIキーの設定</a>`:
            `<a style="height: 34px; font-size: 14px;">Google News Enhanced: Setting for Gemini API key</a>`;
        document.querySelector('[autoupdate] [data-is-touch-wrapper]')?.parentElement.parentElement.appendChild(settingsLink);
        settingsLink.querySelector('a').addEventListener('click', async () => {
            const GEMINI_API_KEY = window.prompt('Get Generative Language Client API key from Google AI Studio\nhttps://ai.google.dev/aistudio', '');
            if (GEMINI_API_KEY != null) await GM.setValue("GEMINI_API_KEY", GEMINI_API_KEY);
        }, false);
    };

    // ########## Main ##########
    await delay(1000);
    insertTickerElement();
    for (let j = 0; j < 10 ; j++) {
        insertSettingsElement();
        if (document.querySelector('a[href*="./settings/"]')) continue;
        console.log(`######## attempt: ${j+1} ########`)
        document.querySelector('#gemini-ticker').style.opacity = '1';
        const articles = Array.from(document.querySelectorAll('article'));
        const allLinks = Array.from(document.querySelectorAll('a[href]'));
        if (allLinks.length == 0) break;
        
        if (!document.querySelector('#gemini-highlight')) {
            const urls = allLinks.map(links => {
                if (links.length == 0) return null;
                const href = links.getAttribute('href');
                const title = links.textContent;
                return `${title}: ${href}`;
            }).filter(Boolean).join(' ');
            console.log(`highlight: ${urls}`)
            await processHighlight(urls);
            await delay(1000);
        }

        document.querySelector('#gemini-ticker').style.opacity = '0';
        await delay(1000);
    }
    document.querySelector('#gemini-ticker').style.opacity = '0';
    console.log('######## Ended up all ########')
})();
