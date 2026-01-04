// ==UserScript==
// @name         Quizlet Utils
// @version      1.40
// @author       refracta
// @description  Enhances the Quizlet website experience by adding features
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @license      MIT
// @run-at document-start
// @grant unsafeWindow
// @require https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @require https://update.greasyfork.org/scripts/486298/1321525/LZ-UTF8%20v063.js
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/483721/Quizlet%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/483721/Quizlet%20Utils.meta.js
// ==/UserScript==
(async function () {
    'use strict';

    function waitFor(checkFunction, checkDelay = 100) {
        return new Promise(resolve => {
            let i = setInterval(_ => {
                try {
                    let check = checkFunction();
                    check ? clearInterval(i) || resolve(check) : void 0
                } catch (e) {}
            }, checkDelay);
        });
    }

    async function toggleButtons(sortingOn, isAudioOn) {
        let optionButton = await waitFor(_ => Array.from(document.querySelectorAll('use'))
                                         .filter(e => e?.getAttribute('xlink:href')?.includes('settings'))
                                         .find(e => e?.parentElement?.getAttribute('aria-label'))?.parentElement?.parentElement);
        optionButton.click();
        let sortingOnToggle = await waitFor(_ => Array.from(document.querySelectorAll('.AssemblyToggleSwitch-input'))
                                            .find(i => i.name === 'sortingOn')
                                            .parentElement
                                            .querySelector('.AssemblyToggleSwitch-fauxInput'));
        if (sortingOn) {
            sortingOnToggle.click();
        }
        let audioToggle = await waitFor(_ => Array.from(document.querySelectorAll('.AssemblyToggleSwitch-input'))
                                        .find(i => i.name === 'textToSpeech')
                                        .parentElement
                                        .querySelector('.AssemblyToggleSwitch-fauxInput'));
        if (isAudioOn) {
            audioToggle.click();
        }
        let closeButton = (await waitFor(_ => document.querySelector('svg[aria-label="close x"].AssemblyIcon--medium'))).parentElement;
        closeButton.click();
    }

    const schema = {
        type: "object",
        description: "데이터 객체",
        properties: {
            list: {
                type: "array",
                description: "단어 암기 내용을 기계식 채점한 결과 중, 맞았다고 볼 수 있는 항목의 목록",
                items: {
                    type: "object",
                    properties: {
                        number: {
                            type: "number",
                            description: "문항 번호"
                        },
                        word: {
                            type: "string",
                            description: "대상 영어 단어"
                        },
                        input: {
                            type: "string",
                            description: "사용자가 입력한 대답"
                        },
                        relatedMean: {
                            type: "string",
                            description: "제시된 단어의 원래 뜻과 비교할 때, 사용자가 입력한 대답과 유사한 단일 항목들"
                        },
                        reason: {
                            type: "string",
                            description: "사용자가 입력한 대답이 맞다고/틀렸다고 볼 수 있는지에 대한 이유"
                        },
                        isCorrect: {
                            type: "boolean",
                            description: "맞다고 볼 수 있으면 참, 아니면 거짓"
                        }
                    }
                }
            }
        },
        required: ['list']
    }

    const systemContent = `
단어 암기 내용을 채점해주는 애플리케이션에서 기계식 채점된 결과 중 맞았다고 볼 수 있는 항목을 출력해 줘
입력 포맷: \`\`\`[문항 번호]. [단어] / (품사) [뜻] [[내가 쓴 내용] (틀림 표시)]\n...(계속)\`\`\`
1. 기계 채점은 단순히 문자열만을 비교해서 완전히 일치하지 않으면 틀렸다고 채점된다. 이는 비슷한 뜻을 가진 문자열로 답했을 때, 잘못 채점되는 문제가 있다.
2. 의미를 고려해보았을 때 맞았다고 볼 수 있는 것을 나열한다. (여전히 틀렸다고 봐야하면 생략할 것, 품사가 일치하지 않으면 틀린 것으로 처리할 것)
`.trim();

    const tools = [
        {
            type: "function",
            function: {
                name: "get_adjusted_results",
                description: "단어 암기 내용을 기계식 채점한 결과 중, 맞았다고 볼 수 있는 항목의 목록을 가져온다.",
                parameters: schema
            }
        }
    ]

    async function gpt4(query, callback, done) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: "gpt-4-turbo-preview",
                messages: [
                    {role: 'system', content: systemContent},
                    {role: "user", content: query}
                ],
                tools,
                tool_choice: "auto",
                stream: true
            })
        });

        let queue = [];
        const reader = response.body.getReader();
        let fullData = '';
        try {
            while (true) {
                const {
                    value,
                    done
                } = await reader.read();
                if (done)
                    break;
                const prevCommands = fullData.split('\n').map(e => e.trim().slice(6)).filter(e => e && e !== '[DONE]').map(s => {
                    try { return JSON.parse(s); } catch(e) {} return null;
                }).filter(e => e);
                fullData += new TextDecoder("utf-8").decode(value);
                const commands = fullData.split('\n').map(e => e.trim().slice(6)).filter(e => e && e !== '[DONE]').map(s => {
                    try { return JSON.parse(s); } catch(e) {} return null;
                }).filter((e, i) => e && i >= prevCommands.length);
                queue = [...queue, ...commands];
                callback?.(queue, commands);
            }
        } catch (error) {
            console.error('Stream reading failed', error);
        } finally {
            reader.releaseLock();
        }
    }

    if (localStorage.vocasVersion !== '9') {
        localStorage.vocasVersion = 9;
        let vocas = await fetch(`https://gscdn-hackers.abstr.net/vocas-9.json`).then(r => r.text());
        localStorage.vocas = vocas;
        location.reload();
    }

    function fixWords(config) {
        try {
            const title = config.studyModesCommon.studiableData.studiableContainer.title;
            let [_, day, category] = title.match(/.+Day(\d{2}) (.+) -/);
            day = parseInt(day);
            const vocas = JSON.parse(LZUTF8.decompress(localStorage.vocas, {
                inputEncoding: "StorageBinaryString"
            }))[day - 1].filter(v => v.LearningVocabulary === category);
            const items = config.studyModesCommon.studiableData.studiableItems;
            let currentWord = config.cards.engine.modeState?.question?.front?.attributes[0]?.plainText;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let voca = vocas[i];
                let {
                    cardSides
                } = item;
                let [word, definition] = cardSides;
                definition.media[0].plainText += '\n\n';
                definition.media[0].plainText += voca.RelatedWordInfo.length ? voca.RelatedWordInfo.map(w => `[${w.RelatedWord}] ${w.PartsOfSpeech.replace(/[가-힣]/g, '').trim()} ${w.RelatedWordVocabulary}: ${w.RelatedWordVocabularyMeaning}`).join('\n') + '\n\n' : '';
                definition.media[0].plainText += voca.ThisIsToeic.length ? voca.ThisIsToeic.map((t, i) => `[${t.Category}] ${t.Description}`).join('\n') + '\n\n' : '';
                definition.media[0].plainText += voca.VocabularyExample.length ? voca.VocabularyExample.map((e, i) => `[E${i + 1}] ` + e.VocabularyExample + '\n' + `[K${i + 1}] ` + e.VocabularyExampleMeaning).join('\n') + '\n\n' : '';
                if (voca.GPT) {
                    definition.media[0].plainText += `[GPT] ${voca.GPT}`;
                }
                definition.media[0].plainText = definition.media[0].plainText.trim();
                word.media[0].ttsUrl = 'https://gscdn-hackers.abstr.net/champ/files/hackers_voca/mp3/BookmanageIdx_1/' + voca.PronunciationSign[0].VocabularySpeechRoute;
                if (currentWord === voca.Vocabulary) {
                    config.cards.engine.modeState.question.front.attributes[1].url = word.media[0].ttsUrl;
                    config.cards.engine.modeState.question.back.attributes[0].plainText = definition.media[0].plainText.trim();
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    function fixTouchBugs(element) {
        const clonedElement = element.cloneNode(true);
        element.parentNode.insertBefore(clonedElement, element.nextSibling);
        element.style.display = 'none';
        clonedElement.addEventListener('click', function() {
            setTimeout(_=> element.click());
        });
    }

    if (location.pathname.includes('/flash-cards') || location.pathname.includes('/flashcards')) {
        Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
            set: function (value) {
                const config = JSON.parse(value.props.pageProps.dehydratedReduxStateKey);
                const sortingOn = config.studyModesCommon.settings.preference?.sortingOn;
                const isAudioOn = config.studyModesCommon.settings.preference?.isAudioOn;
                if (!(sortingOn && isAudioOn)) {
                    toggleButtons(!sortingOn, !isAudioOn);
                }
                if (!location.search.includes('simple=true')) {
                    fixWords(config);
                }

                let currentColor = 'white';
                if (!location.search.includes('hide=true')) {
                    currentColor = '';
                }

                document.addEventListener('keydown', function(e) {
                    if (e.key === 'q') {
                        currentColor = location.search.includes('hide=true') ? '' : 'white';
                    }
                    updateColor();
                });

                document.addEventListener('keyup', function(e) {
                    if (e.key === 'q') {
                        currentColor = location.search.includes('hide=true') ? 'white' : '';
                    }
                    updateColor();
                });

                function updateColor() {
                    Array.from(document.querySelectorAll('.lang-ko')).forEach(e => e.style.color = currentColor);
                }

                setInterval(() => {
                    updateColor();
                }, 1000);

                value.props.pageProps.dehydratedReduxStateKey = JSON.stringify(config);
                Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                setInterval(_ => {
                    if (document.querySelectorAll('[data-testid="AssemblyTooltip--base"] [aria-label="check"]').length === 1) {
                        fixTouchBugs(document.querySelector('[data-testid="AssemblyTooltip--base"] [aria-label="check"]').parentElement);
                        fixTouchBugs(document.querySelector('[data-testid="AssemblyTooltip--base"] [aria-label="close x"]').parentElement);
                    }
                }, 1000);
            },
            configurable: true
        });
        let id = location.pathname.match(/\d{1,50}/)[0];
        let incorrects = localStorage['incorrects-' + id];
        if (incorrects) {
            incorrects = JSON.parse(incorrects);
            let enabled = false;
            (await waitFor(_ => document.querySelector('.UISwitch-input'))).addEventListener('contextmenu', async function (e) {
                e.preventDefault();
                let terms = Array.from(document.querySelectorAll('.SetPageTerms-term'));
                let incorrectTerms = terms.filter(e => incorrects.some(i => i.question === e.querySelector('.TermText').textContent));
                let buttons = incorrectTerms.map(e => e.querySelector('.AssemblyIconButton'));
                if (!enabled) {
                    buttons = buttons.filter(e => e.classList.contains('AssemblyIconButton--tertiary'));
                } else {
                    buttons = buttons.filter(e => e.classList.contains('AssemblyIconButton--highlight'));
                }
                enabled = !enabled;
                for (let button of buttons) {
                    await waitFor(_ => true, 100);
                    button.click();
                }
                return false;
            }, false);
        }
    }

    if (location.pathname.includes('/learn')) {
        Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
            set: function (value) {
                const config = JSON.parse(value.props.pageProps.dehydratedReduxStateKey);
                value.props.pageProps.studyModesCommon.studiableAccents.definition = [];
                value.props.pageProps.dehydratedReduxStateKey = JSON.stringify(config);
                Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            },
            configurable: true
        });
    }

    if (location.pathname.includes('/test')) {
        Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
            set: function (value) {
                const config = JSON.parse(value.props.pageProps.dehydratedReduxStateKey);
                const studyModesCommon = config.studyModesCommon;
                studyModesCommon.studiableData.accents.word = [];
                studyModesCommon.studiableData.accents.definition = [];
                studyModesCommon.settings.preference.acceptsPartialAnswer = true;
                studyModesCommon.settings.preference.typoHelpGradingSetting = true;
                studyModesCommon.settings.preference.audioEnabledSetting = true;
                const testGeneratorSettings = config.testMode.serverData.testGeneratorSettings;
                testGeneratorSettings.grading.acceptsAnswersWithTypos = true;
                testGeneratorSettings.grading.acceptsPartialAnswer = true;
                testGeneratorSettings.grading.acceptsSmartGrading = true;
                testGeneratorSettings.test.numQuestions = config.studyModesCommon.studiableData.studiableItems.length;
                testGeneratorSettings.test.enabledQuestionTypes = [1];
                testGeneratorSettings.test.enabledAnswerSides = ['definition'];
                testGeneratorSettings.test.enabledPromptSides = ['word'];
                const testModeSettings = config.testMode.settings;
                testModeSettings.test.numQuestions = config.studyModesCommon.studiableData.studiableItems.length;
                testModeSettings.test.enabledQuestionTypes = [1];
                testModeSettings.test.enabledAnswerSides = ['definition'];
                testModeSettings.test.enabledPromptSides = ['word'];
                value.props.pageProps.dehydratedReduxStateKey = JSON.stringify(config);
                Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            },
            configurable: true
        });

        const progress = await waitFor(_ => document.querySelector('[data-testid="progress-meter"]'));
        let [percent, title] = document.querySelectorAll('section > section');
        let results = Array.from(document.querySelectorAll('nav li')).filter(e => !isNaN(e.textContent)).map(e => e.querySelector('svg[aria-label="check"]') ? true : false);
        let incorrectElements = Array.from(document.querySelectorAll('div[role="listitem"]')).filter((e, i) => !results[i]);
        let incorrects = incorrectElements.map(e => ({
            question: e.querySelector('div[data-testid="Question Text"]').textContent,
            submitted: e.querySelector('span[data-testid="Submitted Answer"]').textContent,
            answer: e.querySelector('span[data-testid="diff-text"]').textContent
        }));
        let incorrectsResult = incorrects.map((e, i) => `${i + 1}. ${e.question} / ${e.answer.replaceAll('\n', ' ')} [${e.submitted} (X)]`).join('\n');
        let id = location.pathname.match(/\d{1,50}/)[0];
        localStorage['incorrects-' + id] = JSON.stringify(incorrects);
        const infoStringRaw = `${title.textContent.trim()} (${percent.textContent.trim()})\n${incorrectsResult}`;
        let infoString = infoStringRaw;
        const sendConfirmButtonHTML = `
        <button
            id="send-confirm-button"
            type="button"
            class="AssemblyButtonBase AssemblySecondaryButton AssemblyButtonBase--medium AssemblyButtonBase--padding"
            style="width: 100%; margin-top: 10px;">
            <span>인증하기</span>
        </button><span id="gpt-calibration" style="white-space: pre-line; margin-bottom: 2em; margin-top: 0.5em"><span>`;
        progress.insertAdjacentHTML('afterend', sendConfirmButtonHTML);
        const sendConfirmButton = document.querySelector('#send-confirm-button');
        sendConfirmButton.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            window.navigator.clipboard.writeText(infoString).then(_ => {
                alert(infoString);
            });
            return false;
        }, false);
        sendConfirmButton.addEventListener('click', async _ => {
            const imageServerUrl = "https://quizlet-image.abstr.net";
            const writtenTestSection = document.querySelector('[data-testid="written-test-section"]');
            writtenTestSection.style.display = 'none';
            const canvas = await html2canvas(document.querySelector('body'));
            writtenTestSection.style.display = '';
            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            const iFormData = new FormData();
            iFormData.append('image', blob, 'canvas-image.png');
            const result = await fetch(`${imageServerUrl}/upload`, {
                method: 'POST',
                body: iFormData
            }).then(response => response.json());
            const imageUrl = imageServerUrl + '/' + result.path;
            const jandiPromise = fetch("https://wh.jandi.com/connect-api/webhook/19768040/c8808897b6d1d189eefb61c8b4372216", {
                method: "POST",
                headers: {
                    "Accept": "application/vnd.tosslab.jandi-v2+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    body: infoString,
                    connectColor: "#FAC11B",
                    connectInfo: [{
                        imageUrl
                    }]
                })
            }).then(response => response.json());

            let fullMessage = infoString.trim() + '\n\n' + imageUrl;
            const MAX_LENGTH = 4096;
            let messages = [];

            while (fullMessage.length > 0) {
                if (fullMessage.length > MAX_LENGTH) {
                    let part = fullMessage.slice(0, MAX_LENGTH);
                    let lastNewline = part.lastIndexOf('\n\n');

                    if (lastNewline > 0 && lastNewline < MAX_LENGTH) {
                        part = fullMessage.slice(0, lastNewline);
                        messages.push(part);
                        fullMessage = fullMessage.slice(lastNewline).trim();
                    } else {
                        messages.push(fullMessage.slice(0, MAX_LENGTH));
                        fullMessage = fullMessage.slice(MAX_LENGTH);
                    }
                } else {
                    messages.push(fullMessage);
                    break;
                }
            }

            const sendMessages = async () => {
                let results = [];
                for (let message of messages) {
                    const formData = new FormData();
                    formData.append('chat_id', '@quizlet_alert_channel');
                    formData.append('text', message);

                    let result = await fetch("https://api.telegram.org/bot6478465460:AAE_XN_E_y7Q8pF3yIPXmwZaWB-nxYGy2Xg/sendMessage", {
                        method: 'POST',
                        body: formData
                    }).then(response => response.json());
                    results.push(result);
                }
                return results;
            };

            const telegramPromise = sendMessages();
            console.log(await Promise.all([jandiPromise, telegramPromise]));
            alert('인증 결과를 전송했습니다.');
        });

        let correctCount = results.reduce((a, b) => a + (b ? 1 : 0));
        function runCalibration() {
            let total = '';
            let complete = false;
            infoString = infoStringRaw;
            document.querySelector('#gpt-calibration').textContent = infoString;
            gpt4(infoStringRaw, function (queue, commands) {
                for (let command of commands) {
                    let delta = command?.choices?.[0]?.delta?.tool_calls?.[0]?.function?.arguments;
                    let totalList;
                    if (delta) {
                        total += delta;
                        // console.log(total);
                        try {
                            totalList = JSON.parse(total).list;
                            complete = true;
                        } catch (e) {}
                        if (!totalList) {
                            try {
                                totalList = JSON.parse(total.split('},').slice(0, -1).join('},') + '}]}').list;
                            } catch (e) {}
                        }
                        if (!totalList) {
                            infoString = infoStringRaw + `\n${complete ? '' : `\n<Loading: ${total.length}>`}\n[GPT 채점 보정 ${correctCount}+${0}/${results.length} ${Math.round(correctCount / results.length * 100)}%]\n`
                            document.querySelector('#gpt-calibration').textContent = infoString;
                            continue;
                        }
                        totalList = totalList.filter(e => e.isCorrect);
                        totalList = totalList.map(e => ({...incorrects[e.number - 1], ...e}));
                        let correct = totalList.length;
                        let percent = Math.round((correctCount + correct) / results.length * 100);
                        if (correct !== 0) {
                            infoString = infoStringRaw + `\n${complete ? '' : `\n<Loading: ${total.length}>`}\n[GPT 채점 보정 ${correctCount}+${correct}/${results.length} ${percent}%]\n` + totalList.map(e => `${e.number}. ${e.question} / ${e.answer.replaceAll('\n', ' ')} [${e.relatedMean.trim()}≒${e.input.trim()}] (${e.reason})`).join('\n');
                            document.querySelector('#gpt-calibration').textContent = infoString;
                        }
                        sendConfirmButton.textContent = `인증하기 (GPT 채점 보정 ${correctCount}+${correct}/${results.length}, ${percent}%)`;
                    }
                }
            });
        }
        runCalibration();
        document.addEventListener('keypress', function(event) {
            if (event.key === 'r') {
                runCalibration();
            }
        });
    }

    unsafeWindow.itemClickHandler = async function (e) {
        const info = JSON.parse(decodeURIComponent(atob(e.dataset.info)));
        const date = toFormatDate(new Date(info.data['날짜']));
        const name = encodeURIComponent(info['이름']);
        const result = await fetch(`https://script.google.com/macros/s/AKfycbwflhs9MmmV0r2EtOoToyP_wZZO3RreHimFX-ZGhlJTt1qng04EY22XIQqtRud2FZsa/exec?name=${name}&date=${date}`).then(r => r.json());
        if(result.result === 'success') {
            alert(`시간(${date}, ${info['이름']})이 기록되었습니다.`);
        }
    }

    function getItemHTML(title, subtitle, url, info) {
        return `
<div class="DashboardListItem" onclick="javascript:if(event.ctrlKey) { event.preventDefault(); event.stopPropagation(); window.open('${url}', '_blank').focus(); } else { if(!event.currentTarget.querySelector('.SetPreview-cardBylineCreator').contains(event.target)) { event.currentTarget.querySelector('.target-anchor').click(); } }">
    <div class="DashboardFeed-setItem" role="contentinfo">
            <div class="SetPreviewLink SetPreviewLink--noLinkBox">
                <div class="SetPreview">
                    <div class="SetPreview-inner">
                        <div class="SetPreview-cardBylineWrapper">
                            <div class="PreviewCardByline">
                                <div class="UIDelimiter">
                                    <span class="SetPreview-cardBylineTermsCount"><span>${subtitle}</span></span>
                                    <span class="UIVerticalRule UIVerticalRule--onWhite"></span>
                                    <div class="SetPreview-cardBylineCreator" data-info="${btoa(encodeURIComponent(JSON.stringify(info)))}" onclick="javascript:itemClickHandler(this)">
                                        <div class="UserLink">
                                            <div class="UserLink-inner">
                                                <div class="UserLink-avatar">
                                                    <a class="UILink" data-testid="UILink-anchor" href="#" tabindex="0" title="">
                                                        <span class="UserAvatar" style="height: 16px; width: 16px;">
                                                            <div class="Image">
                                                                <img class="Image-image" height="16" referrerpolicy="no-referrer" src="https://gscdn-hackers.abstr.net/stamp-icon.png" width="16">
                                                            </div>
                                                        </span>
                                                    </a>
                                                </div>
                                                <div class="UserLink-content">
                                                    <div class="UserLink-pill-badge">
                                                        <a class="UILink" data-testid="UILink-anchor" href="javascript:;" tabindex="0">
                                                            <span class="UserLink-username">인증하기</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <header class="SetPreview-cardHeader">
                            <a class="UILink target-anchor" data-testid="UILink-anchor"
                               href="${url}">
                                <span class="SetPreview-cardHeaderTitle">
                                  <span>${title}</span>
                                </span>
                            </a>
                        </header>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
    }
    function getGroupTag(groupName, items) {
        var div = document.createElement('div');
        const groupTag = `
<div class="DashboardFeedGroup" style="margin-bottom: 2em">
    <header class="DashboardFeedGroup-header">
        <h3 class="DashboardFeedGroup-title">${groupName}</h3>
        <div style="
            padding-left: 0.5rem;
            vertical-align: top;
            width: 100%;
            display: table-cell;
         ">
            <hr style="border: none;
                border-bottom: .0625rem solid #d9dde8;
                height: 0;
                margin-bottom: 0;
                overflow: visible
            ">
        </div>
    </header>
    ${items.join('\n')}
</div>
`;
        div.innerHTML = groupTag;
        return div.querySelector('div');
    }

    function toFormatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}-${String(date.getDate()).padStart(2, 0)}`;
    }

    async function addSetsData() {
        if (location.pathname.includes('/sets')) {
            const {infoData, defaultData} = await fetch('https://script.google.com/macros/s/AKfycbwflhs9MmmV0r2EtOoToyP_wZZO3RreHimFX-ZGhlJTt1qng04EY22XIQqtRud2FZsa/exec').then(r=>r.json());
            const today = new Date();
            today.setMilliseconds(0);
            today.setSeconds(0);
            today.setMinutes(0);
            today.setHours(0);
            let list = [];
            for(let i = 0; i < 7; i++){
                const dDay = new Date(today.getTime());
                dDay.setDate(dDay.getDate() - i);
                list = [...list, ...defaultData.filter(e => new Date(e['날짜']).getTime() === dDay.getTime() && e['인증 시각'] === '')];
            }
            list = list.map(e => e['식별자'].split(',').map(s => ({...infoData.find(i => i['식별자'] === s.trim() && i['이름'] === e['이름']), data: e}))).flat();
            list = list.filter(e => e.URL);
            const names = Array.from(new Set(list.map(e => e['이름']))).sort().reverse();
            for(const name of names) {
                let currentList = list.filter(e => e['이름'] === name);
                currentList = currentList.map(e => getItemHTML(`해커스 토익 기출 보카 Day${String(e['챕터']).padStart(2, 0)} ${e['분류']}`,
                                                               `${e['이름']} (${toFormatDate(new Date(e.data['날짜']))}, ${e.data['일차']}일차 단어)`,
                                                               e.URL, e));
                const currentGroup = getGroupTag(`최근 7일 단어 (${name})`, currentList);
                document.querySelector('.DashboardFeed').prepend(currentGroup);
            }
        }
    }

    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            setTimeout(_ => addSetsData(), 100);
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
})();