;(() => {
    function prioritizeNaturalVoices(voices) {
        const arr = [];
        if (voices.length < 1) {
            return [];
        }
        const allVoices = voices.filterAndMapX(voice => voice.name.includes('Natural') ? voice : (arr.push(voice) , false));
        allVoices.push(...arr);
        return allVoices
    }

    let voices = prioritizeNaturalVoices(speechSynthesis.getVoices()), utterance, vice, viceMap = {}, playStat = 0,
        icon;

    (() => {
        const fn = () => {
            utterance = new SpeechSynthesisUtterance();
            utterance.addEventListener('end', () => {
                playStat = 0;
                setIcon('▶️');
            })
            utterance.addEventListener('pause', (e) => {
                playStat = 2;
                setIcon('▶️');
            })
            utterance.addEventListener('resume', (e) => {
                playStat = 1;
                setIcon('⏸️');
            })
            voices.map(v => viceMap[v.voiceURI] = v);
        };
        voices.length > 1 ? fn() : speechSynthesis.addEventListener("voiceschanged", () => (voices = prioritizeNaturalVoices(speechSynthesis.getVoices()), fn()));
        return voices;
    })();

    let selectVice = GM_getValue('ttsVice', '自动选择');
    let rate = GM_getValue('ttsrate', 1);
    const setIcon = (i) => {
        if (!icon) {
            return
        }
        const pp = icon.parentElement.querySelector('button.pp');
        pp && (pp.innerHTML = i);
    };

    function play(text, vice = null) {
        utterance.voice = vice ? vice : viceMap[selectVice];
        utterance.text = text;
        utterance.rate = rate;
        playStat = 1;
        speechSynthesis.speak(utterance);
    }

    function speak(speakText) {
        if (viceMap[selectVice]) {
            play(speakText);
            return
        }
        const la = eld.detect(speakText).language;
        console.log(la);
        for (const value of voices) {
            const lang = value.lang.toLowerCase();
            if (lang.indexOf(la) > -1) {
                vice = value
                break;
            }
        }
        if (!vice) {
            icon.title = '似乎无可用的tts,请先安装';
            return
        }
        play(speakText, vice);
    }

    PushIconAction({
        name: 'tts发音 右键设置语速和语言',
        id: 'icon-speech',
        image: GM_getResourceURL('icon-speak'),
        trigger: function (speakText, _, ev) {
            if (voices.length < 1) {
                ev.target.title = 'tts还没有准备好，请稍等';
                return
            }
            speak(speakText);
        },
        call: (img) => {
            img.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const content = img.parentElement.querySelector('tr-content');
                content.style.display = 'block';
                const arr = voices.map(v => [`${v.lang} - ${v.localService && !v.name.includes('Online') ? 'local' : ''}-${v.name}`, v.voiceURI]);
                arr.unshift(['自动选择', '']);
                const options = buildOption(arr, selectVice, 1, 0);
                content.querySelector('div').innerHTML = `
                <div class="item">
                    <button class="pp">${playStat === 1 ? '⏸️' : '▶️'}</button>
                    <button class="stop">⏹️</button>

                </div>
                <div class="item">
                    <label for="speakspeed">语速:</label>
                    <input id="speakspeed" value="${rate}" min="0.1" step="0.1" type="number">
                </div>
                <div class="item">
                    <label for="language">语言:</label>
                    <select id="language">${options}</select>
                </div>
                `;
                icon = content.querySelector('.pp');
                content.querySelector('.stop').addEventListener('click', () => {
                    speechSynthesis.cancel();
                    playStat = 0;
                    icon.innerHTML = '▶️';
                });
                icon.addEventListener('click', function (e) {
                    switch (playStat) {
                        case 0:
                            speak(window.getSelection().toString().trim());
                            this.innerHTML = '⏸️';
                            break;
                        case 1:
                            speechSynthesis.pause();
                            this.innerHTML = '▶️';
                            break;
                        case 2:
                            speechSynthesis.resume();
                            this.innerHTML = '⏸️';
                            break;
                        default:
                            break;
                    }

                })
                content.querySelector('#speakspeed').addEventListener('change', function (e) {
                    rate = this.value;
                    GM_setValue('ttsrate', rate);
                });
                content.querySelector('#language').addEventListener('change', function (e) {
                    selectVice = this.value;
                    GM_setValue('ttsVice', this.value);
                })
            })
        },
        hide: (icon) => {
            speechSynthesis.cancel();
            setIcon('▶️');
            playStat = 0;
        }
    })
})();


