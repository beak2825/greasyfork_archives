// ==UserScript==
// @match           https://news.google.com/*
// @name            Google News Enhanced via Gemini AI
// @version         6.1
// @license         MIT
// @namespace       djshigel
// @description  Google News with AI-Generated Annotation via Gemini
// @run-at          document-end
// @grant           GM.setValue
// @grant           GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/498714/Google%20News%20Enhanced%20via%20Gemini%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/498714/Google%20News%20Enhanced%20via%20Gemini%20AI.meta.js
// ==/UserScript==

(async () => {
    let GEMINI_API_KEY = await GM.getValue("GEMINI_API_KEY");
    if (!GEMINI_API_KEY || !Object.keys(GEMINI_API_KEY).length) {
        GEMINI_API_KEY = window.prompt('Get Generative Language Client API key from Google AI Studio\nhttps://ai.google.dev/aistudio', '');
        await GM.setValue("GEMINI_API_KEY", GEMINI_API_KEY);
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let consecutive429Count = 0;

    // ########## Header ##########
    function insertHeaderStyle() {
        const $headerStyle = document.createElement('style');
        const header = document.querySelector('header[role="banner"]');
        $headerStyle.innerText = `
            @media screen and (max-height: 860px) {
                header[role="banner"] {
                    position: absolute!important;
                    margin-bottom : -${header.clientHeight}px;
                }
            }`;
        document.querySelector('head').appendChild($headerStyle);
    }

    // ########## Load continuous page sections ##########

    const loadContinuous = async () => {
        for (let i = 0; i < 20; i++) {
            await delay(100);
            let intersectionObservedElement = document.querySelector('main c-wiz > c-wiz ~ div[jsname]');
            if (!intersectionObservedElement) break;
            intersectionObservedElement.style.position = 'fixed' ;
            intersectionObservedElement.style.top = '0';
        }
        await delay(3000);
        console.log(`loaded: ${document.querySelectorAll('main c-wiz > c-wiz').length} pages`);
    };

    // ########## Forecast ##########
    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }

    const insertForecastElement = async (forecastLink) => {
        if (forecastLink) {
            const forecast = document.createElement('div');
            forecast.id = 'gemini-forecast';
            forecast.style.maxWidth = '320px';
            forecast.style.marginLeft = '16px';
            forecastLink.parentElement.parentElement.appendChild(forecast);
        }
    };

    const processForecast = async () => {
        const forecastLink = document.querySelector('a[href*="https://weathernews.jp/"]') || 
            document.querySelector('a[href*="https://weather.com/"]');
        if (!forecastLink) return;
        let geo = 'nationwide' ;
        let latitude = null;
        let longitude = null;
        try {
            const position = await getCurrentPosition();
            if (position && position.coords && position.coords.latitude && position.coords.longitude) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                geo = `{${latitude}, ${longitude}}`
                if (!latitude || !longitude) geo = 'nationwide'
            }
        } catch (error) {
            geo = 'nationwide' ;
        }
        console.log(`forecast: ${geo}`);
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
                                    text: `私: 次の手順に従ってステップバイステップで実行してください。返事や番号は不要です。
                                1 ${geo}の地点の市町村名から、${(new Date).toString()}の天気に関する情報を抽出
                                2 どのように過ごすべきかを含め、200字程度に具体的に要約
                                3 タイトルと見出しと位置情報は含めず、結果のみ出力
                                あなた:`
                                }],
                            }],
                            tools: [{ googleSearch: {} }],
                        }),
                    }):
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `Me: Follow the steps below to execute step by step for each URL. No reply or number needed.
                                1 Extract weather information for ${(new Date).toString()} from specific city or town names in ${geo}
                                2 Summarize in detail (about 200 characters) including how to spend the day
                                3 Output only the results, without titles, headings or geolocation coordinates
                                You:`
                                }],
                            }],
                            tools: [{ googleSearch: {} }],
                        }),
                    });

                if (!response.ok) {
                    if (response.status === 429) {
                        consecutive429Count++;
                        if (consecutive429Count >= 3) {
                            console.warn("Too many requests. Pausing for a while...");
                            await delay(10000);
                            consecutive429Count = 0;
                            continue;
                        }
                    } else {
                        throw new Error('Network response was not ok');
                    }
                } else {
                    consecutive429Count = 0;
                }

                const reader = response.body.getReader();
                let result = '', done = false, decoder = new TextDecoder();
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) result += decoder.decode(value, { stream: true });
                }
                result += decoder.decode();

                const data = JSON.parse(result);
                if (data.error?.message || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.error('Error:', data.error.message);
                    consecutive429Count++;
                    continue;
                }
                let summary = data.candidates[0].content.parts[0].text.replace(/\*\*/g, '').replace(/##/g, '');
                if (summary.length < 80) {
                    console.error('Summary is too short');
                    return;
                } 
                console.log(`forecast: ${summary}`);

                insertForecastElement(forecastLink);
                let targetElement = document.querySelector('#gemini-forecast');
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

    // ########## Highlight ##########
    const insertHighlightElement = () => {
        const cWizElements = document.querySelector('aside>c-wiz') ?
            document.querySelectorAll('aside>c-wiz>*'):
            document.querySelector('main>c-wiz>c-wiz>c-wiz') ?
                document.querySelectorAll('main>c-wiz>*'):
                document.querySelectorAll('main>c-wiz>c-wiz, main>div>c-wiz, main>div>div>c-wiz');
        const validHolders = Array.from(document.querySelectorAll('c-wiz>section, c-wiz>section>div>div, main>div>c-wiz>c-wiz, main>c-wiz>c-wiz>c-wiz')).filter(element => {
            const backgroundColor = getComputedStyle(element).backgroundColor;
            return backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent';         
        });
        if (cWizElements.length >= 2) {
            const targetInsertPosition = cWizElements[1];
            const backgroundColor = getComputedStyle(validHolders[0]).backgroundColor;
            const cWizElement = document.createElement('c-wiz');
            cWizElement.id = 'gemini-highlight';
            cWizElement.style.marginBottom = '50px';
            cWizElement.style.width = '100%';
            cWizElement.innerHTML = (new URL(location.href).searchParams.get('hl') == 'ja') ? 
                `<section style='margin-top: 20px'>
                    <div style='
                        font-size: 1.5em; 
                        margin-bottom: 10px; 
                        -webkit-background-clip: text!important; 
                        -webkit-text-fill-color: transparent; 
                        background: linear-gradient(to right, #4698e2, #c6657b); 
                        width: fit-content;' id='gemini-highlight-header'>
                        ✦ Geminiによるハイライト
                    </div>
                     <div style='
                        background-color: ${backgroundColor}; 
                        padding: 16px; 
                        border-radius: 15px;' id='gemini-highlight-content'>
                    </div>
                </section>`:
                `<section style='margin-top: 20px'>
                    <div style='
                        font-size: 1.5em; 
                        margin-bottom: 10px; 
                        -webkit-background-clip: text!important; 
                        -webkit-text-fill-color: transparent; 
                        background: linear-gradient(to right, #4698e2, #c6657b); 
                        width: fit-content;' id='gemini-highlight-header'>
                        ✦ Highlight via Gemini
                    </div>
                     <div style='
                        background-color: ${backgroundColor}; 
                        padding: 16px; 
                        border-radius: 15px;' id='gemini-highlight-content'>
                    </div>
                </section>`;
            targetInsertPosition.parentElement.insertBefore(cWizElement, targetInsertPosition);
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
                                    text: `次に示す最新のニュースの中から最も重要なニュース1つに対し5文で深堀りをどうぞ。返事や番号は不要です。 ${urls}`
                                }],
                            }],
                            tools: [{ googleSearch: {} }],
                        }),
                    }):
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `Below, please take a eight-sentence in-depth look at one of the most important recent news stories. No reply or number needed. ${urls}`
                                }],
                            }],
                            tools: [{ googleSearch: {} }],
                        }),
                    });

                if (!response.ok) {
                    if (response.status === 429) {
                        consecutive429Count++;
                        if (consecutive429Count >= 3) {
                            console.warn("Too many requests. Pausing for a while...");
                            await delay(10000);
                            consecutive429Count = 0;
                            continue;
                        }
                    } else {
                        throw new Error('Network response was not ok');
                    }
                } else {
                    consecutive429Count = 0;
                }

                const reader = response.body.getReader();
                let result = '', done = false, decoder = new TextDecoder();
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) result += decoder.decode(value, { stream: true });
                }
                result += decoder.decode();

                const data = JSON.parse(result);
                if (data.error?.message || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.error('Error:', data.error.message);
                    consecutive429Count++;
                    continue;
                }
                let summary = data.candidates[0].content.parts[0].text.replace(/\*\*/g, '').replace(/##/g, '');
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

    // ########## Article ##########
    const processArticle = async (article, a, title, href) => {
        console.log(`title: ${title}`);
        console.log(`url: ${href}`);
        try {
            document.querySelector('#gemini-ticker').style.opacity = '1';
            let summary = await GM.getValue(href);
            if (!summary || !Object.keys(summary).length) {
                const response = (new URL(location.href).searchParams.get('hl') == 'ja') ?
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `「${title}」のニュースを200字程度に学者のように具体的に要約してください。`
                                }],
                            }],
                            tools: [{ googleSearch: {} }],
                        }),
                    }):
                    await fetch(apiUrl, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                             contents: [{
                                 parts: [{
                                    text: `Summarize in 400 characters or so like an academic for an article: "${title}".`
                                 }],
                             }],
                             tools: [{ googleSearch: {} }],
                         }),
                     });

                if (!response.ok) {
                    if (response.status === 429) {
                        consecutive429Count++;
                        if (consecutive429Count >= 3) {
                            console.warn("Too many requests. Pausing for a while...");
                            await delay(30000);
                            consecutive429Count = 0;
                            return Promise.resolve();
                        }
                    } else {
                        throw new Error('Network response was not ok');
                    }
                } else {
                    consecutive429Count = 0;
                }

                const reader = response.body.getReader();
                let result = '', done = false, decoder = new TextDecoder();
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) result += decoder.decode(value, { stream: true });
                }
                result += decoder.decode();

                const data = JSON.parse(result);
                if (data.error?.message || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.error('Error:', data.error.message);
                    consecutive429Count++;
                    return Promise.resolve();
                }
                summary = data.candidates[0].content.parts[0].text.replace(/\*\*/g, '').replace(/##/g, '');

                if (summary.length >= 180) await GM.setValue(href, summary);
            }
            console.log(`summary: ${summary}`);

            let targetElement = article.querySelector('time') || article.querySelector('span') || null;
            if (!targetElement || !targetElement.tagName) {
                const targetLinks = article.querySelectorAll('a[href*="./read/"]');
                const targetLink = targetLinks.length > 1 ? targetLinks[targetLinks.length - 1] : targetLinks[0];
                targetElement = document.createElement('span');
                targetElement.style.fontSize = '12px';
                targetElement.style.fontWeight = '200';
                targetElement.style.marginRight = '-90px';
                targetLink.parentElement.appendChild(targetElement);
            }
            
            if (targetElement.tagName === 'TIME') {
                targetElement.style.whiteSpace = 'pre-wrap';
                targetElement.style.alignSelf = 'end';
                targetElement.style.marginRight = '3px';
                targetElement.parentElement.style.height = 'auto';
            } else {
                targetElement.style.marginRight = '-60px';
                targetElement.style.whiteSpace = 'pre-wrap';
            }
            a.setAttribute('gemini-annotated', true);

            let displayText = targetElement.textContent + ' ';
            const chunkSize = 20;
            const author = targetElement.parentElement.querySelector('hr ~ div > span');
            if (author) {
                const hr = targetElement.parentElement.querySelector('hr');
                if (hr) hr.remove();
                displayText += ' ' + author.textContent + '  ';
                author.remove();
            }
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
        } catch (error) {
            document.querySelector('#gemini-ticker').style.opacity = '0';
            await delay(5000);
            console.error('Error:', error);
        }
    };

    const throttledProcessArticle = async (article, a, title, href, interval) => {
        await delay(interval);
        return processArticle(article, a, title, href);
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
        document.querySelector('a[href*="./settings/"]').closest('main > div > div > div').appendChild(settingsLink);
        settingsLink.querySelector('a').addEventListener('click', async () => {
            const GEMINI_API_KEY = window.prompt('Get Generative Language Client API key from Google AI Studio\nhttps://ai.google.dev/aistudio', '');
            if (GEMINI_API_KEY != null) await GM.setValue("GEMINI_API_KEY", GEMINI_API_KEY);
        }, false);
    };

    // ########## Main ##########
    insertHeaderStyle();
    insertTickerElement();
    await loadContinuous();
    for (let j = 0; j < 30 ; j++) {
        console.log(`######## attempt: ${j+1} ########`)
        insertSettingsElement();
        document.querySelector('#gemini-ticker').style.opacity = '1';
        const articles = Array.from(document.querySelectorAll('div[jsdata][ve-visible]'));
        const allLinks = Array.from(document.querySelectorAll('a[href*="./read/"]:not([gemini-annotated])'));
        if (allLinks.length == 0) break;

        const promiseArticles = articles.filter(a => a.querySelectorAll('a:not([gemini-annotated])').length).map(async (article, i) => {
            const a = Array.from(article.querySelectorAll('a:not([gemini-annotated])')).filter(a => a.textContent.length)[0];
            if (!a) return Promise.resolve();
            const href = a.getAttribute('href');
            const title = a.textContent;
            return throttledProcessArticle(article, a, title, href, i * 2000);
        });
        await Promise.all(promiseArticles);

        insertSettingsElement();

        if (!document.querySelector('#gemini-forecast')) {
            await processForecast();
            await delay(1000);
        }

        if (!document.querySelector('#gemini-highlight')) {
            const urls = articles.map(article => {
                const a = Array.from(article.querySelectorAll('a')).filter(a => a.textContent.length)[0];
                const href = a.getAttribute('href');
                const title = a.textContent;
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
