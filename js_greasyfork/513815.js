// ==UserScript==
// @name         Gmeet++
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT
// @description  Add nice-to-have features to Gmeet meetings
// @author       KakkoiDev
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513815/Gmeet%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/513815/Gmeet%2B%2B.meta.js
// ==/UserScript==

/**
* Gmeet++ adds new features to Gmeet.
* Features:
* - 1. Automatically mute audio and turn off webcam when joining a meeting.
* - 2. Invert colors button on video grid elements.
* - 3. Generate a random list of participants and send it in the chat.
* - 4. Randomly pick a participant and paste his name in the chat.
* - 5. Promote Gmeet++ in the chat.
* - (WIP) Add furigana to participants' names' kanji.
* - (WIP) High-five with sound effect like on Tandem.
* Todo:
* -[ ] Inject CSS to make the invert look better
* -[x] refactor shared code between random list generator and the random name picker
* -[ ] deduplicate names in the random list generation or when picking a single name (when user is presenting for instance)
* -[ ] fix layout issue when inverting the colors (the absolutely positioned elements are moved)
*/

(function() {
    // console.log('Init Gmeet++');
    let hasMutedAudio = false;
    let hasMutedVideo = false;
    let hasVideoGridInvertButton = false;
    let isVideoGridInverted = false;
    let hasParticipantsRandomListButton = false;
    let hasParticipantsRandomButton = false;
    let hasPromoteGmeetppButton = false;

    // create menu dropdown
    const buttonsMenu = document.createElement('details');
    buttonsMenu.style.position = "fixed";
    buttonsMenu.style.top = "0";
    buttonsMenu.style.left = "0";
    buttonsMenu.style.zIndex = "1";
    buttonsMenu.style.display = "flex";
    buttonsMenu.style.flexDirection = "column";
    buttonsMenu.style.color = "white";
    buttonsMenu.style.backgroundColor = "black";
    const buttonsMenuSummary = document.createElement('summary');
    buttonsMenuSummary.innerText = "Gmeet ++";

    buttonsMenu.appendChild(buttonsMenuSummary);
    document.body.appendChild(buttonsMenu);

    function main() {
        const muteButtonList = document.querySelectorAll('[data-mute-button]');
        const muteAudioButton = muteButtonList?.[0];
        const isAudioMuted = muteAudioButton?.getAttribute('data-is-muted');
        const muteVideoButton = muteButtonList?.[1];
        const isVideoMuted = muteVideoButton?.getAttribute('data-is-muted');
        const headerDiv = document.querySelector("[data-side='1']");
        const videoGridDiv = headerDiv?.nextElementSibling;
        const peoplePanelDiv = document.querySelector('div[data-panel-id="1"]');
        const peoplePanelListList = peoplePanelDiv?.querySelectorAll('[role="list"]');
        const peoplePanelParticipantsDiv = peoplePanelListList?.[0];
        const peoplePanelToggleButton = document.querySelector('button[data-panel-id="1"]');
        const chatPanelToggleButton = document.querySelector('button[data-panel-id="2"]');
        const chatPanelDiv = document.querySelector('div[data-panel-id="2"]');

        const sendMessage = (message) => {
            // open chat panel only if panel is not visible
            if (chatPanelToggleButton.getAttribute('aria-pressed') === "false") {
                chatPanelToggleButton.click();
            }

            const chatPanelDiv = document.querySelector('div[data-panel-id="2"]');
            const chatPanelTextarea = chatPanelDiv?.querySelector('textarea');
            const chatPanelSendButton = chatPanelTextarea?.parentNode.parentNode.nextElementSibling.querySelector('button');

            // send list in the chat
            chatPanelTextarea.focus();
            document.execCommand('insertText', false, message);
            chatPanelSendButton.click();
        }

        const getParticipantsList = () => {
            if (!peoplePanelParticipantsDiv) throw new Error("No peoplePanelParticipantsDiv");

            return peoplePanelParticipantsDiv.querySelectorAll('[role="listitem"]');
        }

        const getParticipantsNameList = () => {
            return [...getParticipantsList()].map(participant => participant.getAttribute('aria-label'));
        }

        const randomizeList = (list) => {
            if (!Array.isArray(list)) throw new Error("Given list is not an array!");

            return list?.map(value => ({value, sort: Math.random()})).sort((a, b) => a.sort - b.sort).map(name => name.value);
        }

        const addButtonToMenu = ({text, onClick}) => {
            const newButton = document.createElement('button');
            newButton.innerText = text;
            newButton.onclick = onClick;

            buttonsMenu.appendChild(newButton);
        }

        // Open the panels to load them.
        if (peoplePanelToggleButton && peoplePanelDiv === null) {
            peoplePanelToggleButton.click();
        }

        if (chatPanelToggleButton && chatPanelDiv === null) {
            chatPanelToggleButton.click();
        }


        // 1. Automatically mute audio and turn off webcam when joining a meeting.
        // mute audio
        if (isAudioMuted === 'false' && hasMutedAudio === false) {
            muteAudioButton?.click();
            hasMutedAudio = true;
        }
        // handle edge-case: auto-muted audio
        if (isAudioMuted === 'true' && hasMutedAudio === false) {
            hasMutedAudio = true;
        }
        // mute video
        if (isVideoMuted === 'false' && hasMutedVideo === false) {
            muteVideoButton?.click();
            hasMutedVideo = true;
        }
        // handle edge-case: auto-muted video
        if (isVideoMuted === 'true' && hasMutedVideo === false) {
            hasMutedVideo = true;
        }

        // 2. Invert colors button on video grid elements.
        if (videoGridDiv && hasVideoGridInvertButton === false) {
            const toggleInvertVideoGrid = () => {
                if (isVideoGridInverted) {
                    videoGridDiv.style.filter = "invert(0)";
                    isVideoGridInverted = false;
                } else {
                    videoGridDiv.style.filter = "invert(1)";
                    isVideoGridInverted = true;
                }
            }

            addButtonToMenu({text: 'invert colors', onClick: toggleInvertVideoGrid});

            hasVideoGridInvertButton = true;
        }

        // 3. Generate a random list of participants and send it in the chat.
        if (chatPanelDiv && hasParticipantsRandomListButton === false) {
            const generateRandomParticipantList = () => {
                const randomParticipantNames = randomizeList(getParticipantsNameList());
                let randomParticipantNamesText = ""

                for (const [index, name] of randomParticipantNames.entries()) {
                    randomParticipantNamesText += `${index + 1}. ${name}\n`;
                }

                sendMessage(randomParticipantNamesText);
            };

            addButtonToMenu({text: 'generate participants random list', onClick: generateRandomParticipantList});

            hasParticipantsRandomListButton = true;
        }

        // 4. Randomly pick a participant and paste his name in the chat.
        if (chatPanelDiv && hasParticipantsRandomButton === false) {
            const getRandomParticipant = () => {
                const randomParticipantNames = randomizeList(getParticipantsNameList());
                const randomParticipantNameText = randomParticipantNames[0];

                sendMessage(randomParticipantNameText);
            };

            addButtonToMenu({text: 'get random participant', onClick: getRandomParticipant});

            hasParticipantsRandomButton = true;
        }

        // 5. Promote Gmeet++ in the chat.
        if (chatPanelDiv && hasPromoteGmeetppButton === false) {
            const promoteGmeetpp = () => {sendMessage('📨 Gmeet++\nAdd the features you miss to Gmeet!\nInstall: https://greasyfork.org/en/scripts/513815-gmeet')};

            addButtonToMenu({text: 'promote gmeet++', onClick: promoteGmeetpp});

            hasPromoteGmeetppButton = true;
        }
    }

    // Init & Loop
    main();

    new MutationObserver((event) => {
        // console.log({event});
        main();
    }).observe(document, {subtree: true, childList: true});
})();