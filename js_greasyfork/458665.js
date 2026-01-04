// ==UserScript==
// @name         trekGPT
// @namespace    https://gist.github.com/dgnsrekt
// @version      0.5
// @description  Use chat GPT like the Star Trek TNG LCARS OS. Has TTS & STT. Plus common TNG sound effects.
// @author       dgnsrekt
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/458665/trekGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/458665/trekGPT.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let lastSentences = [];
    let listening = false;
    let voiceResponse = true;


    const inChat = window.location.hostname === "chat.openai.com";
    const targetNode = document.getElementsByTagName("main")[0];
    const observer = new MutationObserver(onMutation);
    const textArea = document.getElementsByTagName("textarea")[0];
    const synth = window.speechSynthesis;
    const WAKE_WORD = "computer";
    const CANCEL_PHRASES = ["cancel command", "cancel request", "shut up", "shut up computer"];
    const DEACTIVATE_VOICE_PHRASES = ["deactivate voice", "deactivate voice response", "shut up", "shut up computer"]
    const ACTIVATE_VOICE_PHRASES = ["activate voice", "activate voice response", "speak up", "speak up computer"]

    function readOutWords(words) {
        if (!voiceResponse) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(words);
        utterance.rate = 1;
        utterance.pitch = 0.85;
        synth.speak(utterance);
    }

    function onMutation(mutationsList) {

        mutationsList.forEach((mutation) => {
            if (mutation.type !== "characterData") {
                return;
            }

            switch (mutation.target.parentElement.tagName) {
                case "P":
                case "LI":
                    readSentence(mutation.target.parentElement.innerText);
            }
        });
    }

    function removeBackticks(str) {
        return str.replace(/`/g, "");
    }

    function formatPeriodSeparatedWords(input) {
        // Regular expression pattern to match two words separated by a period
        const pattern = /([a-zA-Z]+)\.([a-zA-Z]+)/g;
        // Replace the matched pattern with "word1 dot word2"
        const replaced = input.replace(pattern, "$1 dot $2");
        return replaced;
    }

    const compose =
        (...fns) =>
            (x) =>
                fns.reduceRight((acc, fn) => fn(acc), x);

    const sanitizeSentence = compose(removeBackticks, formatPeriodSeparatedWords);

    function matchSentence(str) {
        const sentenceRegex1 = /([A-Z][^\.!?]*[\.!?])/g;
        const sentenceRegex2 = /([^:]*:[\s])/g;

        return str.match(sentenceRegex1) || str.match(sentenceRegex2);
    }

    function matchExactPhrase(phraseArray, string) {
        const regexArray = phraseArray.map(phrase => new RegExp(`^${phrase}$`, "i"))
        const output = regexArray.some((regex) => regex.test(string))
        console.log({ output, regexArray })
        return output
    }


    function matchManyRequests(string) {
        const target = "Too many requests in 1 hour. Try again later."
        return new RegExp(target, "i").test(string)
    }

    function readSentence(string) {
        const tooManyRequests = matchManyRequests(string)

        if (tooManyRequests) {
            setTimeout(() => window.location.reload(false), 1000);
        }

        const sentencesInString = matchSentence(string)

        if (!sentencesInString) {
            return
        }

        sentencesInString.forEach((sentence) => {

            const cleanSentence = sanitizeSentence(sentence);

            if (lastSentences.includes(cleanSentence)) {
                return
            }

            readOutWords(cleanSentence);
            lastSentences.push(cleanSentence);

            if (lastSentences.length > 50) {
                lastSentences.shift();
            }

        });

    }

    const attachErrorAudioToParent = (parentElement) => {
        let sound = document.createElement('audio');
        sound.id = 'audio-error';
        sound.src = 'https://www.trekcore.com/audio/computer/computer_error.mp3';
        sound.type = 'audio/mpeg';
        sound.autoplay = false;
        parentElement.appendChild(sound);
        return sound
    }

    const attachSuccessAudioToParent = (parentElement) => {
        let sound = document.createElement("audio");
        sound.id = "audio-success";
        sound.src = "https://www.trekcore.com/audio/computer/computerbeep_41.mp3";
        sound.type = "audio/mpeg";
        sound.autoplay = false;
        parentElement.appendChild(sound);
        return sound;
    };

    const attachListeningAudioToParent = (parentElement) => {
        let sound = document.createElement("audio");
        sound.id = "audio-listening";
        sound.src = "https://www.trekcore.com/audio/computer/computerbeep_29.mp3";
        sound.type = "audio/mpeg";
        sound.autoplay = false;
        parentElement.appendChild(sound);
        return sound;
    };

    function matchCancelPhrase(phrase) {
        return matchExactPhrase(CANCEL_PHRASES, phrase)
    }

    function matchActivateVoicePhrase(phrase) {
        return matchExactPhrase(ACTIVATE_VOICE_PHRASES, phrase)
    }

    function matchDeactivateVoicePhrase(phrase) {
        return matchExactPhrase(DEACTIVATE_VOICE_PHRASES, phrase)
    }


    function createSpeechRecognition(submitQuestion, cancelRequest, soundEngine) {

        const recognition = new webkitSpeechRecognition || new SpeechRecognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onerror = function (event) {
            console.error(event);
        };

        recognition.onstart = function () {
            console.log("Speech recognition service has started");
        };

        recognition.onend = function () {
            console.log("Speech recognition service disconnected");
            recognition.start();
        };

        recognition.onresult = function (event) {
            let final_transcript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                }
            }

            if (final_transcript) {
                console.log({ final_transcript })
            }


            const phrase = final_transcript.toLowerCase().trim();
            const wakePhrase = phrase.startsWith(WAKE_WORD);
            const cancelPhrase = matchCancelPhrase(phrase);
            const activateVoice = matchActivateVoicePhrase(phrase);
            const deactivateVoice = matchDeactivateVoicePhrase(phrase);

            console.log({ cancelPhrase, activateVoice, deactivateVoice, listening, voiceResponse }, phrase)

            if (deactivateVoice) {
                soundEngine.deactivateVoice()
            }

            if (activateVoice) {
                soundEngine.activateVoice()
            }

            if (cancelPhrase) {
                listening = false;
                recognition.stop();
                cancelRequest();
                return;
            }

            if (wakePhrase & !listening) {
                listening = true;
                soundEngine.playListeningSound();
                return;
            }

            if (!listening || !phrase) {
                return;
            }

            listening = false;
            recognition.stop();

            submitQuestion(phrase);
        };

        return recognition;
    }


    const getCancelButton = () => {
        const buttons = document.querySelectorAll("button");
        return Array.from(buttons).find(button => button.innerText === "Stop generating");
    }

    function main() {
        if (!textArea || !inChat) {
            return
        }

        const textAreaParent = textArea.parentElement;
        const submitButton = textAreaParent.getElementsByTagName("button")[0];

        const listeningSound = attachListeningAudioToParent(textAreaParent);
        const successSound = attachSuccessAudioToParent(textAreaParent);
        const errorSound = attachErrorAudioToParent(textAreaParent);


        const playListeningSound = () => {
            if (!synth.speaking) {
                listeningSound.play();
            }
        };

        const playSuccessSound = () => {
            if (!synth.speaking) {
                successSound.play();
            }
        };

        const playErrorSound = () => {
            if (!synth.speaking) {
                errorSound.play();
            }
        };

        const activateVoice = () => {
            voiceResponse = true
            playSuccessSound()
        }

        const deactivateVoice = () => {
            voiceResponse = false
            playSuccessSound()
        }

        const soundEngine = {
            playListeningSound,
            playSuccessSound,
            playErrorSound,
            activateVoice,
            deactivateVoice
        };

        const submitQuestion = (question) => {
            console.log("Submitting Question", question);

            synth.cancel();
            textArea.value = question;
            soundEngine.playSuccessSound();
            submitButton.click();
        };

        const cancelRequest = () => {
            const cancelButton = getCancelButton()

            if (cancelButton) {
                cancelButton.click();
            }

            synth.cancel()
            soundEngine.playErrorSound();
        }

        const recognitionEngine = createSpeechRecognition(submitQuestion, cancelRequest, soundEngine);
        recognitionEngine.start();

        observer.observe(targetNode, {
            subtree: true,
            attributes: true,
            characterData: true,
        });
    }

    main()
})();