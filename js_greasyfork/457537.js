// ==UserScript==
// @name        programajaponesonline.com.br - Toolkit
// @name:pt-BR  programajaponesonline.com.br - Toolkit
// @namespace   secretx_scripts
// @match       *://portal.programajaponesonline.com.br/*
// @version     2023.01.03
// @author      SecretX
// @description This script does a lot of simple things, like remembering what volume you have previously set to your audios, sync the audio volumes as if they are one (including mute), add space bar and media button keyboard shortcut support to play/pause the audio, add volume change keyboard shortcut through Add (+) and Subtract (-) keys of your numpad. There's also a function to hide furigana (so it only appears when you hover the mouse over the paragraphs).
// @description:pt-br Esse script faz várias coisinhas básicas, como arrumar volume dos áudios que você está escutando, unificar o volume dos áudios (incluindo o mute), adiciona alguns atalhos para tocar os áudios da playlist (como por exemplo colocar a barra de espaço para sempre pausar o áudio atual), adiciona a possibilidade de aumentar o volume usando a tecla de Mais (+) e Menos (-) do seu numpad. Tem também uma função de ocultar furigana (deixar pra aparecer somente quando passar o mouse por cima).
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @require     https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @icon        https://i.imgur.com/vn8ClVJ.png
// @license     GNU LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/457537/programajaponesonlinecombr%20-%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/457537/programajaponesonlinecombr%20-%20Toolkit.meta.js
// ==/UserScript==

const keybindHandlers = {
    playPauseAudioKey: playPauseAudioPlaying,
    stopAudioKey: stopAudioPlaying,
    increaseVolumeKey: () => forEachAudio(stepUpVolume),
    decreaseVolumeKey: () => forEachAudio(stepDownVolume),
}

Object.defineProperty(HTMLElement.prototype, "isVisible", {
    value: function() {
        return (this.offsetParent !== null);
    },
    writable: true,
    configurable: true
});

Object.defineProperty(Array.prototype, "insert", {
    value: function(index, ...items) {
        return [...this.slice(0, index), ...items, ...this.slice(index)]
    },
    writable: true,
    configurable: true
});

function loadSetting(name) {
    return GM_SuperValue.get(name);
}

function saveSetting(name, value) {
    GM_SuperValue.set(name, value);
}

function getPlaylistOptions() {
    const cached = loadSetting("playlist_options");
    if (cached != null) return cached;

    const defaults = {
        enableShortcutKeys: true,
        rememberAudioRepetitionAmount: true,
        linkAudioVolumes: true,
        playPauseAudioKey: ["space", "playpausemedia"],
        stopAudioKey: ["stopmedia"], // Stop media
        increaseVolumeKey: ["+"], // Plus Numpad
        decreaseVolumeKey: ["-"], // Minus Numpad
        volumeStep: 0.05, // 5%
        volumeMin: 0.0, // 0%
        volumeMax: 1.0, // 100%
    };
    saveSetting("playlist_options", defaults);
    return defaults;
}

function savePlaylistOptions(playlistOptions) {
    saveSetting("playlist_options", playlistOptions);
}

function getLessionsOptions() {
    const cached = loadSetting("lessions_options");
    if (cached != null) return cached;

    const defaults = {
        enableHideTranslationButton: true,
        showFuriganaOnMouseOver: false,
        audioVolume: 1.0,
        audioSpeed: 1.0,
    };
    saveSetting("lessions_options", defaults);
    return defaults;
}

function saveLessionsOptions(playlistOptions) {
    saveSetting("lessions_options", playlistOptions);
}

function showElem(htmlElem) {
    if (htmlElem == null) return;
    htmlElem.classList.remove("hidden");
}

function hideElem(htmlElem) {
    if (htmlElem == null) return;
    htmlElem.classList.add("hidden");
}

const getAudios = () => Array.from(document.querySelectorAll("audio"));
const forEachAudio = action => getAudios().forEach(audio => action(audio));
const getPlayingAudio = () => {
    const audios = getAudios().filter(audio => audio.isVisible());
    return audios.length === 1 ? audios[0] : null;
}
const setVolumeOfAllAudios = volume => forEachAudio(audio => audio.volume = Math.max(0.0, Math.min(1.0, volume)));
const setMuteOfAllAudios = isMuted => forEachAudio(audio => audio.muted = isMuted);
const toggleAudio = (audio) => audio.paused ? audio.play() : audio.pause();
const stepDownVolume = (audio) => audio.volume = Math.max(audio.volume - getPlaylistOptions()["volumeStep"], getPlaylistOptions()["volumeMin"]);
const stepUpVolume = (audio) => audio.volume = Math.min(audio.volume + getPlaylistOptions()["volumeStep"], getPlaylistOptions()["volumeMax"]);

function loadPreviousSettings() {
    const previousAudioVolume = loadSetting("audio_volume");
    if (previousAudioVolume != null) setVolumeOfAllAudios(previousAudioVolume);
    setMuteOfAllAudios(loadSetting("audio_muted") === true);
}

function linkAllAudioVolumeSliders(audios) {
    audios.forEach(audio => audio.addEventListener("volumechange", () => {
        setVolumeOfAllAudios(audio.volume)
        setMuteOfAllAudios(audio.muted);
        saveSetting("audio_volume", audio.volume);
        saveSetting("audio_muted", audio.muted);
    }));
}

function playPauseAudioPlaying() {
    const playingAudio = getPlayingAudio();
    if (playingAudio == null) {
        console.info("No audio is playing");
        return;
    }
    toggleAudio(playingAudio);
}

function stopAudioPlaying() {
    const playingAudio = getPlayingAudio();
    if (playingAudio == null) {
        console.info("No audio is playing");
        return;
    }
    if (!playingAudio.paused) playingAudio.pause();
}

// UI

const mainDivId = "jpo_toolkit";
const parentDivId = `${mainDivId}_parent`;
const formId = `${mainDivId}_form`;
const openButtonId = "jpo_toolkit_open_button";
const closeButtonId = "jpo_toolkit_close_button";

function injectToolkitOverlayCss() {
    const css = `
    @import url("https://fonts.googleapis.com/css?family=Bebas+Neue:400|Inter:400");
    
    :root {
      --black: rgba(0, 0, 0, 1);
      --baby-powder: rgba(252, 252, 252, 1);
    
      --font-size-s: 0.7rem;
      --font-size-m: 0.8rem;
      --font-size-l: 1.7rem;
    
      --font-family-bebas_neue: "Bebas Neue";
      --font-family-inter: "Inter";
    }

    #${parentDivId} {
        width: 24rem;
        min-height: 9rem;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        padding: 0.5rem 1.5rem 1.75rem 1.5rem;
        border: 0 none;
        background: var(--baby-powder);
        display: block;
        position: fixed;
        z-index: 16000001;
        right: 1rem;
        top: 9rem;
        border-radius: 5px;
        box-shadow:0px 4px 4px rgba(0, 0, 0, 0.25);
    }
    
    .jpo_toolkit_title_bar {
        display: flex;
        justify-content: space-between;
    }
    
    .jpo_toolkit_title_bar > h2 {
        color: var(--black);
        font-family: var(--font-family-bebas_neue);
        font-size: var(--font-size-l);
        font-weight: 400;
        letter-spacing: 0;
        line-height: normal;
        margin-bottom: 0;
    }
    
    #${closeButtonId} {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2.5rem;
        margin-right: -0.8rem;
    }
    
    #${closeButtonId} > img {
        height: var(--font-size-l);
        width: var(--font-size-l);
        filter: contrast(30%) opacity(70%);
    }
    
    div.toolkit_form_section {
        display: grid;
        font-size: var(--font-size-m);
    }
    
    div.toolkit_form_section_second_onwards {
        margin-top: 0.5em
    }
    
    div.toolkit_form_field_label {
        display: flex; 
        align-items: center;
    }
    
    div.toolkit_form_field_label > label {
      color: var(--black);
      font-family: var(--font-family-inter);
      font-size: var(--font-size-m);
      font-weight: 400;
      letter-spacing: 0;
      line-height: normal;
    }
    
    .hidden {
        display: none !important;
    }
    
    .rectangle_box {
      margin-top: 1.7rem;
      position: relative;
      padding: 1rem 0.5rem 0.5rem 0.5rem;
      border: 1px solid;
      border-color: #d7d7d7;
      border-radius: 5px;
      width: 100%;
    }
    
    .overlap_group {
      align-items: flex-end;
      background-color: var(--baby-powder);
      display: flex;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      margin: -0.6rem 0 0 0.5rem;
      padding: 0 0.2rem;
    }
    
    .section_title {
      color: #959595;
      font-family: var(--font-family-bebas_neue);
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: normal;
    }
    
    .jpo_toolkit_input {
        width: 3.7rem;
        padding: 4px 4px 4px 8px;
        border-radius: 7px;
        border: 1px solid #ccc;
        font-size: var(--font-size-m);
    }
    
    .go_to_right {
        margin-left: auto;
    }
    `;

    // Use Violent Monkey global function to inject our CSS onto page
    GM_addStyle(css);
}

function createToolkitOverlay() {
    const div = document.createElement("div");
    div.id = parentDivId;
    hideElem(div);

    const playlistOptions = getPlaylistOptions();

    const html = `
    <div id="${mainDivId}">
    
    <div class="jpo_toolkit_title_bar">
        <h2>PJO Toolkit️</h2>
        <div id="${closeButtonId}">
            <img src="${closeIcon()}" alt="Close this window"/>
        </div>
    </div>
    
    <p style="font-size: 0.7rem; font-style: italic; margin-bottom: 0.25rem">Work in progress!</p>
        
    <form id="${formId}" name="${formId}" action="">
    
    <div class="toolkit_form_section">
        <div class="rectangle_box">
            <div class="overlap_group">
                <div class="section_title">Playlist</div>
            </div>
            <div class="toolkit_form_field_label">
                <label for="enable_shortcut_keys">Ativar botões de atalho</label>
                <input type="checkbox" id="enable_shortcut_keys" class="go_to_right"/>
            </div>
            <div class="toolkit_form_field_label toolkit_form_section_second_onwards">
                <label for="remember_audio_repetition_amount">Lembrar do número de repetição dos áudios</label>
                <input type="checkbox" id="remember_audio_repetition_amount" class="go_to_right"/>
            </div>
            <div class="toolkit_form_field_label toolkit_form_section_second_onwards">
                <label for="link_audio_volumes">Unificar volume de todos os áudios</label>
                <input type="checkbox" id="link_audio_volumes" class="go_to_right"/>
            </div>
            <div class="toolkit_form_field_label toolkit_form_section_second_onwards">
                <label for="volume_min">Volume mínimo (0-100)</label>
                <input type="number" id="volume_min" class="jpo_toolkit_input go_to_right" value="${Math.floor(playlistOptions.volumeMin * 100.0)}" min="0" max="100"/>
            </div>
            <div class="toolkit_form_field_label toolkit_form_section_second_onwards">
                <label for="volume_max">Volume máximo (0-100)</label>
                <input type="number" id="volume_max" class="jpo_toolkit_input go_to_right" value="${Math.floor(playlistOptions.volumeMax * 100.0)}" min="0" max="100"/>
            </div>
            <div class="toolkit_form_field_label toolkit_form_section_second_onwards">
                <label for="volume_step">Volume step (1-100)</label>
                <input type="number" id="volume_step" class="jpo_toolkit_input go_to_right" value="${Math.floor(playlistOptions.volumeStep * 100.0)}" min="1" max="100"/>
            </div>
        </div>
         <div class="rectangle_box">
            <div class="overlap_group">
                <div class="section_title">Lessons</div>
            </div>
            <div class="toolkit_form_field_label">
                <label for="hide_translation_button">Exibir botão de esconder tradução de textos</label>
                <input type="checkbox" id="hide_translation_button" class="go_to_right"/>
            </div>
            <div class="toolkit_form_field_label toolkit_form_section_second_onwards">
                <label for="show_furigana_on_mouse_over">Furigana somente ao passar o mouse</label>
                <input type="checkbox" id="show_furigana_on_mouse_over" class="go_to_right"/>
            </div>
        </div>
    </form>
    
    </div>
    `.trim();
    div.innerHTML = html;

    setPlaylistInteractListeners(div);

    return div;
}

function setPlaylistInteractListeners(div) {
    const setPlaylistCheckboxOption = (checkbox, property) => {
        const playlistOptions = getPlaylistOptions();
        const isChecked = !playlistOptions[property];
        checkbox.attributes.checked = isChecked;
        playlistOptions[property] = isChecked;
        savePlaylistOptions(playlistOptions);
        console.info(`Setting '${property}' to '${isChecked}'`);
    };
    const preparePlaylistCheckbox = (inputSelector, property) => {
        const checkbox = div.querySelector(inputSelector);
        checkbox.addEventListener("input", () => setPlaylistCheckboxOption(checkbox, property), false);
        if (getPlaylistOptions()[property]) checkbox.checked = true;
    }
    preparePlaylistCheckbox("input#enable_shortcut_keys", "enableShortcutKeys");
    preparePlaylistCheckbox("input#remember_audio_repetition_amount", "rememberAudioRepetitionAmount");
    preparePlaylistCheckbox("input#link_audio_volumes", "linkAudioVolumes");

    const setPlaylistVolumeOption = (input, property) => {
        const playlistOptions = getPlaylistOptions();
        const newValue = Math.min(input.max, Math.max(input.min, input.value)) / 100.0;
        playlistOptions[property] = newValue;
        savePlaylistOptions(playlistOptions);
        console.info(`Setting '${property}' to '${newValue}'`);
    };
    const playlistVolumeMin = div.querySelector("input#volume_min");
    playlistVolumeMin.addEventListener("input", () => setPlaylistVolumeOption(playlistVolumeMin, "volumeMin"), false);
    const playlistVolumeMax = div.querySelector("input#volume_max");
    playlistVolumeMax.addEventListener("input", () => setPlaylistVolumeOption(playlistVolumeMax, "volumeMax"), false);
    const playlistVolumeStep = div.querySelector("input#volume_step");
    playlistVolumeStep.addEventListener("input", () => setPlaylistVolumeOption(playlistVolumeStep, "volumeStep"), false);

    const setLessionsCheckboxOption = (checkbox, property) => {
        const lessionsOptions = getLessionsOptions();
        const isChecked = !lessionsOptions[property];
        checkbox.attributes.checked = isChecked;
        lessionsOptions[property] = isChecked;
        saveLessionsOptions(lessionsOptions);
        console.info(`Setting '${property}' to '${isChecked}'`);
    };
    const hideTranslationButton = div.querySelector("input#hide_translation_button");
    hideTranslationButton.addEventListener("input", () => setLessionsCheckboxOption(hideTranslationButton, "enableHideTranslationButton"), false);
    if (getLessionsOptions().enableHideTranslationButton) hideTranslationButton.checked = true;
    const showFuriganaOnMouseOver = div.querySelector("input#show_furigana_on_mouse_over");
    showFuriganaOnMouseOver.addEventListener("input", () => setLessionsCheckboxOption(hideTranslationButton, "showFuriganaOnMouseOver"), false);
    if (getLessionsOptions().showFuriganaOnMouseOver) showFuriganaOnMouseOver.checked = true;
    
    div.querySelector(`#${closeButtonId}`).addEventListener("click", () => hideElem(div), false);
}

function appendOpenToolkitButton() {
    const userInfoDiv = document.querySelector("div.user-info");
    const userInfoItems = userInfoDiv.innerHTML.split("|");
    const newItems = userInfoItems.insert(1, `<a id='${openButtonId}'>PJO Toolkit</a>`);
    userInfoDiv.innerHTML = newItems.join(" | ");
    document.querySelector(`#${openButtonId}`).addEventListener("click", () => showElem(document.querySelector(`#${parentDivId}`)));
}

function injectToolkitOverlay() {
    injectToolkitOverlayCss();
    document.body.appendChild(createToolkitOverlay());
    appendOpenToolkitButton();
}

// Main functions

function rememberAudioRepeatNumber() {
    const audioRepeat = loadSetting("audio_repeat_amount") ?? {};

    // div.playlist-title > div > input.playlist-item-loop
    const audioDivs = Array.from(document.querySelectorAll("li.playlist-item-active"));
    for (const audioDiv of audioDivs) {
        const audioInput = audioDiv.querySelector("div.playlist-title > div > input.playlist-item-loop");
        // Will become something like 'Nihongo Rise - Tópico 08アンケート調査 (Questionário de pesquisa.)'
        const audioName = Array.from(audioDiv.querySelectorAll("div.playlist-title > div > span.jp-title"))
            .map(span => span.innerText)
            .reduce((a, b) => a + b, "")
            .trim();

        if (audioInput == null || audioName == null || audioName.length === 0) continue;

        const previousRepeatAmount = audioRepeat[audioName];
        if (previousRepeatAmount != null && audioInput.value === "1") {
            // Restore previous repeat value
            audioInput.value = previousRepeatAmount;
        }

        audioInput.addEventListener("input", () => {
            console.info(`Changed '${audioName}' repeat amount to '${audioInput.value}'`);
            audioRepeat[audioName] = audioInput.value;
            saveSetting("audio_repeat_amount", audioRepeat);
        }, false);
    }
}

function bindKeyboardShortcuts() {
    for (const [actionName, keyShortcuts] of Object.entries(getPlaylistOptions())) {
        const executorMethod = keybindHandlers[actionName];
        if (executorMethod == null) continue;

        keyShortcuts.forEach(keyShortcut => Mousetrap.bind(keyShortcut, () => {
            executorMethod();
            return false;  // prevents default browser behavior
        }));
    }
    console.log("Bound keyboard shortcuts!");
}

function configurePlaylist() {
    if (window.location.pathname !== "/playlist/") return;
    const audios = getAudios();
    if (audios.length === 0) {
        console.info("No audios found on your playlist, skipping script...");
        return;
    }
    const playlistOptions = getPlaylistOptions();
    if (playlistOptions.linkAudioVolumes) {
        loadPreviousSettings();
        linkAllAudioVolumeSliders(audios);
    }
    if (playlistOptions.rememberAudioRepetitionAmount) rememberAudioRepeatNumber();
    if (playlistOptions.enableShortcutKeys) bindKeyboardShortcuts();
}

function configureLessonAudios() {
    const lessionsOptions = getLessionsOptions();
    getAudios().forEach(audio => {
        console.info(`Setting audio of lesson to ${lessionsOptions["audioVolume"]} at speed ${lessionsOptions["audioSpeed"]}`);
        audio.volume = lessionsOptions["audioVolume"];
        audio.playbackRate = lessionsOptions["audioSpeed"];
    });
}

function addTextLessionHideTranslationButton() {
    const textTranslationDivs = Array.from(document.querySelectorAll("div.portuguese_block"));
    if (textTranslationDivs.length === 0) {
        console.info("This lession have no text");
        return;
    }
    const firstTranslationDiv = textTranslationDivs[0];
    const translationDivStyle = window.getComputedStyle(firstTranslationDiv);

    const audioDiv = document.querySelector("div#audio-text");
    if (audioDiv == null) {
        console.error("Could not find audio div to add the hide/show button!");
        return;
    }
    const firstTextLineDiv = audioDiv.nextSibling;
    if (!isMobile) {
        firstTextLineDiv.style.marginTop = "1.3em";
    } else {
        firstTextLineDiv.style.marginTop = "2.0em";
    }

    const toggleDiv = document.createElement("div");
    toggleDiv.style.display = "flex";
    toggleDiv.style.margin = translationDivStyle.margin;
    if (!isMobile) {
        toggleDiv.style.width = "80%";
        toggleDiv.style.marginTop = "1.5em";
    } else {
        toggleDiv.style.width = translationDivStyle.width;
        toggleDiv.style.marginTop = "2.2em";
    }

    const toggleButton = document.createElement("button");
    toggleButton.style.height = "2.4rem";
    toggleButton.style.width = "8.35rem";
    if (isMobile) {
        toggleButton.style.borderRadius = "0.5rem";
    }
    toggleDiv.appendChild(toggleButton);

    let isHidden = loadSetting("text_translation_hidden") === true;
    updateTranslationButtonText(isHidden, toggleButton);
    const defaultDisplayMode = firstTranslationDiv.style.display ?? "block";

    toggleButton.addEventListener("click", function() {
        isHidden = toggleTranslationDisplay(isHidden, toggleButton, textTranslationDivs, defaultDisplayMode);
        saveSetting("text_translation_hidden", isHidden);
    }, false);

    if (isHidden) {
        for (let translationDiv of textTranslationDivs) {
            translationDiv.style.display = "none";
        }
    }
    audioDiv.parentNode.insertBefore(toggleDiv, firstTextLineDiv);
}

function toggleTranslationDisplay(isHidden, toggleButton, textTranslationDivs, defaultDisplayMode) {
    for (let translationDiv of textTranslationDivs) {
        if (isHidden) {
            translationDiv.style.display = defaultDisplayMode;
        } else {
            translationDiv.style.display = "none";
        }
    }
    updateTranslationButtonText(!isHidden, toggleButton);
    return !isHidden;
}

function updateTranslationButtonText(isHidden, toggleButton) {
    if (isHidden) {
        toggleButton.innerText = "Mostrar tradução";
    } else {
        toggleButton.innerText = "Esconder tradução";
    }
}

function makeFuriganaAppearOnHover() {
    const furiganaTexts = Array.from(document.querySelectorAll("div.furigana_text"));
    for (const sentenceDiv of furiganaTexts) {
        const rts = Array.from(sentenceDiv.querySelectorAll("rt"));
        if (rts.length === 0) return;
        rts.forEach(rt => rt.style.visibility = "hidden");

        sentenceDiv.addEventListener("mouseenter", () => rts.forEach(rt => rt.style.visibility = "visible"), false);
        sentenceDiv.addEventListener("mouseleave", () => rts.forEach(rt => rt.style.visibility = "hidden"), false);
    }
}

function configureLesson() {
    if (!(/(\/.+){3,}/i.test(window.location.pathname))) return;
    const lessionsOptions = getLessionsOptions();
    configureLessonAudios();
    if (lessionsOptions.enableHideTranslationButton) addTextLessionHideTranslationButton();
    if (lessionsOptions.showFuriganaOnMouseOver) makeFuriganaAppearOnHover();
}

function addAdditionalKeybinds() {
    Mousetrap.addKeycodes({
        178: "stopmedia",
        179: "playpausemedia",
    });
}

window.addEventListener("DOMContentLoaded", function () {
    'use strict';
    addAdditionalKeybinds();
    configurePlaylist();
    configureLesson();
    injectToolkitOverlay();
});

const isMobile = (function(){
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
})();

/**
 * Icons.
 */
function closeIcon() {
    return `data:image/png;base64,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`;
}

var GM_SuperValue = new function () {

    var JSON_MarkerStr  = 'json_val: ';
    var FunctionMarker  = 'function_code: ';

    function ReportError (msg) {
        if (console && console.error)
            console.log (msg);
        else
            throw new Error (msg);
    }

    //--- Check that the environment is proper.
    if (typeof GM_setValue != "function")
        ReportError ('This library requires Greasemonkey! GM_setValue is missing.');
    if (typeof GM_getValue != "function")
        ReportError ('This library requires Greasemonkey! GM_getValue is missing.');


    /*--- set ()
        GM_setValue (http://wiki.greasespot.net/GM_setValue) only stores:
        strings, booleans, and integers (a limitation of using Firefox
        preferences for storage).

        This function extends that to allow storing any data type.

        Parameters:
            varName
                String: The unique (within this script) name for this value.
                Should be restricted to valid Javascript identifier characters.
            varValue
                Any valid javascript value.  Just note that it is not advisable to
                store too much data in the Firefox preferences.

        Returns:
            undefined
    */
    this.set = function (varName, varValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.set().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.set().');
        }

        switch (typeof varValue) {
            case 'undefined':
                ReportError ('Illegal varValue sent to GM_SuperValue.set().');
                break;
            case 'boolean':
            case 'string':
                //--- These 2 types are safe to store, as is.
                GM_setValue (varName, varValue);
                break;
            case 'number':
                /*--- Numbers are ONLY safe if they are integers.
                    Note that hex numbers, EG 0xA9, get converted
                    and stored as decimals, EG 169, automatically.
                    That's a feature of JavaScript.

                    Also, only a 32-bit, signed integer is allowed.
                    So we only process +/-2147483647 here.
                */
                if (varValue === parseInt (varValue)  &&  Math.abs (varValue) < 2147483647)
                {
                    GM_setValue (varName, varValue);
                    break;
                }
            case 'object':
                /*--- For all other cases (but functions), and for
                    unsafe numbers, store the value as a JSON string.
                */
                var safeStr = JSON_MarkerStr + JSON.stringify (varValue);
                GM_setValue (varName, safeStr);
                break;
            case 'function':
                /*--- Functions need special handling.
                */
                var safeStr = FunctionMarker + varValue.toString ();
                GM_setValue (varName, safeStr);
                break;

            default:
                ReportError ('Unknown type in GM_SuperValue.set()!');
                break;
        }
    }//-- End of set()


    /*--- get ()
        GM_getValue (http://wiki.greasespot.net/GM_getValue) only retieves:
        strings, booleans, and integers (a limitation of using Firefox
        preferences for storage).

        This function extends that to allow retrieving any data type -- as
        long as it was stored with GM_SuperValue.set().

        Parameters:
            varName
                String: The property name to get. See GM_SuperValue.set for details.
            defaultValue
                Optional. Any value to be returned, when no value has previously
                been set.

        Returns:
            When this name has been set...
                The variable or function value as previously set.

            When this name has not been set, and a default is provided...
                The value passed in as a default

            When this name has not been set, and default is not provided...
                undefined
    */
    this.get = function (varName, defaultValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.get().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.get().');
        }

        //--- Attempt to get the value from storage.
        var varValue    = GM_getValue (varName);
        if (!varValue)
            return defaultValue;

        //--- We got a value from storage. Now unencode it, if necessary.
        if (typeof varValue == "string") {
            //--- Is it a JSON value?
            var regxp       = new RegExp ('^' + JSON_MarkerStr + '(.+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = JSON.parse ( m[1] );
                return varValue;
            }

            //--- Is it a function?
            var regxp       = new RegExp ('^' + FunctionMarker + '((?:.|\n|\r)+)$');
            var m           = varValue.match (regxp);
            if (m  &&  m.length > 1) {
                varValue    = eval ('(' + m[1] + ')');
                return varValue;
            }
        }

        return varValue;
    }//-- End of get()


    /*--- runTestCases ()
        Tests storage and retrieval every every knid of value.
        Note: makes extensive use of the console.

        Parameters:
            bUseConsole
                Boolean: If this is true, uses the console environment to store
                the data.  Useful for dev test.
        Returns:
            true, if pass.  false, otherwise.
    */
    this.runTestCases = function (bUseConsole) {

        if (bUseConsole) {
            //--- Set up the environment to use local JS, and not the GM environment.
            this.testStorage    = {};
            var context         = this;
            this.oldSetFunc     = (typeof GM_setValue == "function") ? GM_setValue : null;
            this.oldGetFunc     = (typeof GM_getValue == "function") ? GM_getValue : null;

            GM_setValue    = function (varName, varValue) {
                console.log ('Storing: ', varName, ' as: ', varValue);
                context.testStorage[varName] = varValue;
            }

            GM_getValue    = function (varName, defaultValue) {
                var varValue    = context.testStorage[varName];
                if (!varValue)
                    varValue    = defaultValue;

                console.log ('Retrieving: ', varName, '. Got: ', varValue);

                return varValue;
            }
        }

        var dataBefore  =   [null, true, 1, 1.1, -1.0, 2.0E9,  2.77E9,  2.0E-9, 0xA9, 'string',
            [1,2,3], {a:1, B:2}, function () {a=7; console.log ("Neat! Ain't it?"); }
        ];

        for (var J = 0;  J <= dataBefore.length;  J++)
        {
            var X       = dataBefore[J];
            console.log (J, ': ', typeof X, X);

            this.set ('Test item ' + J, X);
            console.log ('\n');
        }

        console.log ('\n***********************\n***********************\n\n');

        var dataAfter   = [];

        for (var J = 0;  J < dataBefore.length;  J++)
        {
            var X       = this.get ('Test item ' + J);
            dataAfter.push (X);
            console.log ('\n');
        }

        console.log (dataBefore);
        console.log (dataAfter);

        dataAfter[12]();

        //--- Now test for pass/fail.  The objects won't be identical but contenets are.
        var bPass;
        if (dataBefore.toString()  ==  dataAfter.toString() ) {
            var pfStr   = 'PASS!';
            bPass       = true;
        } else {
            var pfStr   = 'FAIL!';
            bPass       = false;
        }
        console.log ( "\n***************************        \
                       \n***************************        \
                       \n***************************        \
                       \n*****     " + pfStr + "       *****        \
                       \n***************************        \
                       \n***************************        \
                       \n***************************\n");

        if (bUseConsole) {
            //--- Restore the GM functions.
            GM_setValue    = this.oldSetFunc;
            GM_getValue    = this.oldGetFunc;
        }
        else {
            //--- Clean up the FF storage!

            for (var J = 0;  J < dataBefore.length;  J++)
            {
                GM_deleteValue ('Test item ' + J);
            }
        }

        return bPass;

    }//-- End of runTestCases()
};


//GM_SuperValue.runTestCases  (true);

//--- EOF
