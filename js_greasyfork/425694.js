// ==UserScript==
// @name         Duolingo HearEverything
// @namespace    http://tampermonkey.net/
// @version      0.69.1
// @description  Reads aloud most sentences in Duo's challenges.
// @author       Esh
// @match        https://*.duolingo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425694/Duolingo%20HearEverything.user.js
// @updateURL https://update.greasyfork.org/scripts/425694/Duolingo%20HearEverything.meta.js
// ==/UserScript==

const VERSION = '0.69.1 --- 1 ---';

const LOG_STRING = 'Duolingo HearEverything: ';
let voiceSelect;
const config = {};
const DEBUG = false;
// for config mouse hover
let hover = true;

const synth = window.speechSynthesis;
let voices = [];
const challengesUrls = [];
const challengesReads = [];
let timeout;
let howlPlay = false;
const page = {};
page.isNewPage = false;
page.isOptionSpeechAdded = false;

const speakerButton = `
  <a class="_3UpNo _3EXrQ _2VrUB" data-test="speaker-button" title="Listen" id="speak">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 73" width="94" height="73" preserveAspectRatio="xMidYMid meet" style="padding-left: 20%; width: 80%; height: 100%; transform: translate3d(0px, 0px, 0px);">
    <defs>
      <clipPath id="__lottie_element_402"><rect width="94" height="73" x="0" y="0"></rect></clipPath>
      <clipPath id="__lottie_element_404">
        <path d="M0,0 L1000,0 L1000,1038 L0,1038z"></path>
      </clipPath>
      <clipPath id="__lottie_element_409">
        <path d="M0,0 L1338,0 L1338,738 L0,738z"></path>
      </clipPath>
    </defs>
    <g clip-path="url(#__lottie_element_402)">
      <g clip-path="url(#__lottie_element_404)" transform="matrix(0.26499998569488525,0,0,0.26499998569488525,-84.5,-101.53498840332031)" opacity="1" style="display: block;">
        <g transform="matrix(1.3600000143051147,0,0,1.3600000143051147,516.219970703125,522.4000244140625)" opacity="0.9069389991639046" style="display: block;">
          <path stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(28,176,246)" stroke-opacity="1" stroke-width="22.485592375331898" d=" M48.88100051879883,-88.13400268554688 C79.822998046875,-70.9219970703125 100.77899932861328,-37.88800048828125 100.77899932861328,0 C100.77899932861328,37.9109992980957 79.7979965209961,70.96199798583984 48.82500076293945,88.16500091552734"></path>
        </g>
        <g style="display: block;" transform="matrix(1.3600000143051147,0,0,1.3600000143051147,516.219970703125,522.4000244140625)" opacity="1">
          <path stroke-linecap="round" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(28,176,246)" stroke-opacity="1" stroke-width="20.500305987715482" d=" M24.131000518798828,-42.808998107910156 C39.055999755859375,-34.37099838256836 49.14099884033203,-18.354000091552734 49.14099884033203,0 C49.14099884033203,18.386999130249023 39.02000045776367,34.42900085449219 24.049999237060547,42.854000091552734"></path>
        </g>
        <g clip-path="url(#__lottie_element_409)" transform="matrix(1.0370399951934814,0,0,0.9629600048065186,136.53640747070312,163.66775512695312)" opacity="1" style="display: block;">
          <g transform="matrix(1,0,0,1,260.93701171875,373.6780090332031)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(6,0,0,6,0,0)">
              <path fill="rgb(28,176,246)" fill-opacity="1" d=" M-8.293000221252441,-11.675000190734863 C-8.293000221252441,-11.675000190734863 -0.12300000339746475,-11.675000190734863 -0.12300000339746475,-11.675000190734863 C2.9070000648498535,-11.675000190734863 5.367000102996826,-9.21500015258789 5.367000102996826,-6.184999942779541 C5.367000102996826,-6.184999942779541 5.367000102996826,6.425000190734863 5.367000102996826,6.425000190734863 C5.367000102996826,9.454999923706055 2.9070000648498535,11.914999961853027 -0.12300000339746475,11.914999961853027 C-0.12300000339746475,11.914999961853027 -8.293000221252441,11.914999961853027 -8.293000221252441,11.914999961853027 C-11.322999954223633,11.914999961853027 -13.782999992370605,9.454999923706055 -13.782999992370605,6.425000190734863 C-13.782999992370605,6.425000190734863 -13.782999992370605,-6.184999942779541 -13.782999992370605,-6.184999942779541 C-13.782999992370605,-9.21500015258789 -11.322999954223633,-11.675000190734863 -8.293000221252441,-11.675000190734863z M-4.980999946594238,-11.656999588012695 C-4.980999946594238,-11.656999588012695 10.218999862670898,-22.32699966430664 10.218999862670898,-22.32699966430664 C11.24899959564209,-23.047000885009766 12.659000396728516,-22.797000885009766 13.369000434875488,-21.777000427246094 C13.638999938964844,-21.39699935913086 13.779000282287598,-20.937000274658203 13.779000282287598,-20.476999282836914 C13.779000282287598,-20.476999282836914 13.779000282287598,20.472999572753906 13.779000282287598,20.472999572753906 C13.779000282287598,21.722999572753906 12.769000053405762,22.732999801635742 11.519000053405762,22.732999801635742 C11.059000015258789,22.732999801635742 10.609000205993652,22.593000411987305 10.218999862670898,22.322999954223633 C10.218999862670898,22.322999954223633 -4.980999946594238,11.652999877929688 -4.980999946594238,11.652999877929688 C-5.580999851226807,11.232999801635742 -5.940999984741211,10.543000221252441 -5.940999984741211,9.803000450134277 C-5.940999984741211,9.803000450134277 -5.940999984741211,-9.807000160217285 -5.940999984741211,-9.807000160217285 C-5.940999984741211,-10.536999702453613 -5.580999851226807,-11.22700023651123 -4.980999946594238,-11.656999588012695z"></path>
              <g opacity="1" transform="matrix(1,0,0,1,0,0)"></g>
            </g>
          </g>
        </g>
      </g>
    </g>
    </svg>
  </a>
`;

// Element definitions
const DIALOGUE_SPEAKER_CLASS = '_29e-M _39MJv _2Hg6H';

// currently used
const ANSWER_CLASS = '._1UqAr';
const ANSWER = 'blame';
const ANSWER_QS = dataTestContains(ANSWER);
const RIGHT_ANSWER = 'blame-correct';
const RIGHT_ANSWER_QS = dataTestContains(RIGHT_ANSWER);
const RIGHT_ANSWER_TYPO_QS = '._3gI0Y';
const WRONG_ANSWER = 'blame-incorrect';
const WRONG_ANSWER_QS = dataTestContains(WRONG_ANSWER);
const CHALLENGE_TAP_TOKEN = 'challenge-tap-token'; // challenge-translate (tap)
const CHALLENGE_TAP_TOKEN_QS = dataTestIs(CHALLENGE_TAP_TOKEN);
const CHALLENGE_TAP_TOKEN_TEXT = 'challenge-tap-token-text';
const CHALLENGE_TAP_TOKEN_TEXT_QS = dataTestIs(CHALLENGE_TAP_TOKEN_TEXT);
const WORD_BANK = 'word-bank'; // if exists it's tap instead of keyboard (challenge-translate)
const WORD_BANK_QS = dataTestIs(WORD_BANK);
const TRANSLATE_INPUT = 'challenge-translate-input';
const TRANSLATE_INPUT_QS = dataTestIs(TRANSLATE_INPUT);
const SPEAKER_BUTTON = '._1KXUd._1I13x._2kfEr._1nlVc._2fOC9.UCrz7.t5wFJ';
const SPEAKER_BUTTON_QS = SPEAKER_BUTTON;
const HINT_SENTENCE = '._29e-M._39MJv._2Hg6H';
const HINT_SENTENCE_QS = HINT_SENTENCE;
const CHALLENGE_JUDGE_TEXT = 'challenge-judge-text';
const CHALLENGE_JUDGE_TEXT_QS = dataTestIs(CHALLENGE_JUDGE_TEXT);
const CHALLENGE_JUDGE_INTRO = 'hint-token';
const CHALLENGE_JUDGE_INTRO_QS = dataTestIs(CHALLENGE_JUDGE_INTRO);
const FORM_PROMPT = '._2SfAl._2Hg6H';
const FORM_PROMPT_QS = FORM_PROMPT;
const RIGHT_OPTION_QS = '[aria-checked="true"] div';
const TEXT_INPUT = 'challenge-text-input';
const TEXT_INPUT_QS = dataTestIs(TEXT_INPUT);
const SPEAK_INTRO = 'speakIntro';
const SPEAK_INTRO_QS = '#' + SPEAK_INTRO;
const HINT_TOKEN = 'hint-token';
const HINT_TOKEN_QS = dataTestIs(HINT_TOKEN);
const GAP_FILL_UNDERSCORE_QS = '._2Iqyl';
const TIP_TEXT_QS = '._1WCLL';

// used page types
const COMPLETE_REVERSE_TRANSLATION = 'challenge-completeReverseTranslation';
const DIALOGUE = 'challenge-dialogue';
const FORM = 'challenge-form';
const GAP_FILL = 'challenge-gapFill';
const LISTEN = 'challenge-listen';
const LISTEN_COMPREHENSION = 'challenge-listenComprehension';
const LISTEN_TAP = 'challenge-listenTap';
const MATCH = 'challenge-match';
const NAME = 'challenge-name';
const READ_COMPREHENSION = 'challenge-readComprehension';
const SPEAK = 'challenge-speak';
const TAP_COMPLETE = 'challenge-tapComplete';
const TAP_CLOZE = 'challenge-tapCloze';
const TAP_CLOZE_TABLE = 'challenge-tapClozeTable';
const TRANSLATE = 'challenge-translate';
const TYPE_CLOZE = 'challenge-typeCloze';

const TIP = 'tip';

// Print nice debug statements
function debug (s) {
  const name = (debug.caller !== null) ? debug.caller.name : '';
  if (typeof (s) === 'object') {
    console.debug(LOG_STRING + ' ' + name + '(): ');
    console.debug(s);
  } else {
    console.debug(LOG_STRING + ' ' + name + '(): ' + s);
  }
}

function dataTestContains (token) {
  const result = '[data-test~="' + token + '"]';
  return result;
}

function dataTestIs (token) {
  return '[data-test="' + token + '"]';
}

// needed for Duo Mute
// intercept xmlhttprequest to get session json and extract challenges
(function (open) {
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('readystatechange', function () {
      if (this.readyState === 4 && this.responseURL.includes('sessions')) {
        if (this.response.challenges) {
          debug(this.response.challenges);
          this.response.challenges.forEach((rspChallenge) => {
            if (typeof rspChallenge.tts !== 'undefined') {
              challengesUrls.push(rspChallenge.tts);
              challengesReads.push(rspChallenge.prompt);
            }
          });
        }
      }
    }, false);
    open.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.open);

// needed for Duo Muto
// Intercept Howl.play (which plays the sound over Howl.js).
// of course the linter doesn't know the object Howl, but it is there ;)
(function (play) {
  // eslint-disable-next-line no-undef
  Howl.prototype.play = function () {
    // if we read the options, Duo has to remain silent
    if (!page.isReadingOptions) {
      // if Duo is muted, we have to do his job
      if (config.he_muteduo) {
        const read = challengesReads[challengesUrls.indexOf(this._src)];
        if (DEBUG) document.querySelector('#mySentence').innerText = read;
        if (typeof read !== 'undefined') {
          debug('intercepting Duo speaking = ' + read);
          howlPlay = true;
          clearTimeout(timeout);
          const utter = generateUtter(read);
          synth.cancel();
          synth.speak(utter);
        } else {
          play.apply(this, arguments);
        }
      } else {
        play.apply(this, arguments);
      }
    } else {
      // We spoke it, so we can let Duo take over
      page.isReadingOptions = false;
      debug('Shhh Duo! I am reading the options');
    }
  };
  // eslint-disable-next-line no-undef
})(Howl.prototype.play);

window.addEventListener('load', function () {
  'use strict';
  debug(VERSION);
  voices = window.speechSynthesis.getVoices();
  readConfig();
  new MutationObserver(start).observe(document.body, {
    childList: true,
    subtree: true
  });
  debug('MutationObserver running');
});

// toggles visibility
function togglePopout (id) {
  const popout = document.getElementById(id);
  if (popout.style.display === 'none') {
    popout.style.display = 'block';
    document.addEventListener('click', closePopout);
    popout.addEventListener('mouseenter', setHover);
    popout.addEventListener('mouseleave', removeHover);
  } else {
    popout.style.display = 'none';
    document.removeEventListener('click', closePopout);
    popout.removeEventListener('mouseenter', setHover);
    popout.removeEventListener('mouseleave', removeHover);
  }

  function setHover () {
    hover = true;
  }

  function removeHover () {
    setTimeout(function () { hover = false; }, '100');
  }

  function closePopout () {
    if (!hover) {
      hover = true;
      togglePopout('hearEverythingConfig');
    }
  }
}

// gets the stored config
function readConfig () {
  // eslint-disable-next-line no-undef
  voiceSelect = GM_getValue('voiceSelect', 1000);
  setVoice();
  config.ap_timeout = 1000;
  // eslint-disable-next-line no-undef
  config.he_muteduo = GM_getValue('he_muteduo', false);
  configChallenge(DIALOGUE, 'cd', false, true, true);
  configChallenge(FORM, 'cf', true, true, false);
  configChallenge(GAP_FILL, 'cgf', true, true, true);
  configChallenge(LISTEN, 'cl', true, null, null);
  configChallenge(LISTEN_COMPREHENSION, 'clc', null, true, null);
  configChallenge(LISTEN_TAP, 'clt', true, true, null);
  configChallenge(MATCH, 'cm', null, true, null);
  configChallenge(NAME, 'cn', true, null, null);
  configChallenge(READ_COMPREHENSION, 'crc', true, false, false);
  configChallenge(SPEAK, 'cs', true, null, null);
  configChallenge(TAP_CLOZE, 'ctcl', true, null, false);
  configChallenge(TAP_CLOZE_TABLE, 'ctct', false, null, true);
  configChallenge(TAP_COMPLETE, 'ctc', true, false, true);
  configChallenge(TRANSLATE, 'ct', true, true, null);
  configChallenge(TYPE_CLOZE, 'ctyc', true, null, false);

  configChallenge(TIP, 't', false, false, false);

  // auto/click/autointro default: true/false, if not used: null
  function configChallenge (_challengeName, shortName, auto, click, autointro) {
    const keyAuto = 'he_' + shortName + '_auto';
    const keyClick = 'he_' + shortName + '_click';
    const keyAutointro = 'he_' + shortName + '_autointro';
    // eslint-disable-next-line no-undef
    if (auto !== null) config[keyAuto] = GM_getValue(keyAuto, auto);
    // eslint-disable-next-line no-undef
    if (click !== null) config[keyClick] = GM_getValue(keyClick, click);
    // eslint-disable-next-line no-undef
    if (autointro !== null) config[keyAutointro] = GM_getValue(keyAutointro, autointro);
  }

  function setVoice () {
    const duoState = JSON.parse(localStorage.getItem('duo.state'));
    config.lang = duoState.user.learningLanguage;

    if (voiceSelect === 1000) {
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang.includes(config.lang)) {
          voiceSelect = i;
        }
      }
    }
  }
}

// adds config to the page
function addConfig () {
  const nameWidth = '29ch';
  if (!document.querySelector('#hearEverythingGear') && document.querySelector('[role="progressbar"]')) {
    const configButton = document.createElement('button');
    configButton.setAttribute('id', 'hearEverythingGear');
    configButton.setAttribute('class', '_2hiHn _2kfEr _1nlVc _2fOC9 UCrz7 t5wFJ _1DC8p _2jNpf');
    configButton.setAttribute('style', `grid-column: 3/3; background-image:url(//d35aaqx5ub95lt.cloudfront.net/images/gear.svg);
        background-position: 0px 0px; background-repeat: no-repeat; background-size: contain;`);

    const configDiv = document.createElement('div');
    configDiv.setAttribute('class', '_3yqw1 np6Tv _1Xlh1');
    configDiv.setAttribute('style', 'display: none; position: fixed; margin-top: 1rem;');
    configDiv.setAttribute('id', 'hearEverythingConfig');
    let options = '<option value="1000">Auto</option>';
    for (let i = 0; i < voices.length; i++) {
      options += `<option value="${i}">${voices[i].name}</option>`;
    }
    const styleCheckbox = 'style="vertical-align: bottom;"';
    const configMute = `
          <div class="QowCP">
            <div id="config-duo-voice" style="border: none; padding: 3px;">
              <div class="myOptions">
                <span style="width: ${nameWidth};">Duo Voice:</span>
                <span><input type="checkbox" id="he_muteduo" value="muteduo" ${styleCheckbox}></input><label for="he_muteduo"> mute</label></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        `;
    // autoplay, play options, read intro
    const configDialogue = createConfigOption(DIALOGUE, 'cd', true, true, true);
    const configForm = createConfigOption(FORM, 'cf', true, true, true);
    const configGapFill = createConfigOption(GAP_FILL, 'cgf', true, true, true);
    const configListen = createConfigOption(LISTEN, 'cl', true, false, false);
    const configListenComprehension = createConfigOption(LISTEN_COMPREHENSION, 'clc', false, true, false);
    const configListenTap = createConfigOption(LISTEN_TAP, 'clt', true, true, false);
    const configMatch = createConfigOption(MATCH, 'cm', false, true, false);
    const configName = createConfigOption(NAME, 'cn', true, false, false);
    const configReadComprehension = createConfigOption(READ_COMPREHENSION, 'crc', true, true, true);
    const configSpeak = createConfigOption(SPEAK, 'cs', true, false, false);
    const configTapCloze = createConfigOption(TAP_CLOZE, 'ctcl', true, false, true);
    const configTapClozeTable = createConfigOption(TAP_CLOZE_TABLE, 'ctct', true, false, true);
    const configTapComplete = createConfigOption(TAP_COMPLETE, 'ctc', true, true, true);
    const configTranslate = createConfigOption(TRANSLATE, 'ct', true, true, false);
    const configTypeCloze = createConfigOption(TYPE_CLOZE, 'ctyc', true, false, false);

    configDiv.innerHTML = `
    <div class="_3uS_y eIZ_c" data-test="config-popout" style="--margin:20px;">
      <div class="_2O14B _2XlFZ _1v2Gj WCcVn" style="z-index: 1;">
        <div class="_1KUxv _1GJUD _3lagd SSzTP" style="width: auto;"><div class="_1cv-y"></div>
        <div class="QowCP">
          <div style="border: none; padding: 3px;">
            <div class="myOptions">
              <span style="width: ${nameWidth};">Language:</span>
              <span style="width: 45ch;"><select style="background-color: #ffc800; color: white; width: 45ch;" id="configLanguage">
              ${options}
              </select></span>
            </div>
          </div>
        </div>
        <div class="QowCP" id="he_configChallenges">
<style>
.myOptions {
  display: flex;
  justify-content: space-around;
  text-align: left;
}
.myOptions span {
  width: 15ch;
}
</style>
          ${configDialogue}
          ${configForm}
          ${configGapFill}
          ${configListen}
          ${configListenComprehension}
          ${configListenTap}
          ${configMatch}
          ${configName}
          ${configReadComprehension}
          ${configSpeak}
          ${configTapCloze}
          ${configTapClozeTable}        
          ${configTapComplete}
          ${configTranslate}
          ${configTypeCloze}
          ${configMute}
        </div>
      </div>
    </div>`;

    document.querySelector('[role="progressbar"]').insertAdjacentElement('afterend', configButton);
    configButton.insertAdjacentElement('afterend', configDiv);
    configButton.addEventListener('click', function () { togglePopout('hearEverythingConfig'); });
    const configLanguage = document.getElementById('configLanguage');
    configLanguage.querySelector('[value="' + voiceSelect + '"]').setAttribute('selected', true);
    configLanguage.addEventListener('change', function () {
      voiceSelect = configLanguage.options[configLanguage.selectedIndex].value;
      // eslint-disable-next-line no-undef
      GM_setValue('voiceSelect', voiceSelect);
    });

    setVisibleConfig();
    document.getElementById('hearEverythingConfig').addEventListener('change', function (e) {
      // eslint-disable-next-line no-undef
      GM_setValue(e.target.id, e.target.checked);
      config[e.target.id] = e.target.checked;
    });
  }
  if (document.querySelector('#hearEverythingGear') && document.querySelector('[role="progressbar"]')) {
    highlightConfig();
  }

  // builds a configBlock
  // auto = autoplay, click = read options, intro = read intro
  function createConfigOption (challengeName, prefix, auto, click, intro) {
    const nameArr = challengeName.split('-');
    if (nameArr.length === 1) {
      nameArr[1] = nameArr[0];
    }
    const name1Arr = nameArr[1].match(/[a-z]+|[A-Z][a-z]+/g);
    nameArr[1] = name1Arr.join(' ');
    for (let i = 0; i < nameArr.length; i++) {
      nameArr[i] = nameArr[i][0].toUpperCase() + nameArr[i].substr(1);
    }
    const name = nameArr.join(' ');

    const styleCheckbox = 'style="vertical-align: bottom;"';
    let clickSpan = '';
    let autoSpan = '';
    let introSpan = '';
    if (auto === true) autoSpan = `<input type="checkbox" id="he_${prefix}_auto" value="autoplay" ${styleCheckbox}></input><label for="he_${prefix}_auto"> auto play</label></span>`;
    if (click === true) clickSpan = `<input type="checkbox" id="he_${prefix}_click" value="readoptions" ${styleCheckbox}></input><label for="he_${prefix}_click"> read options</label></span>`;
    if (intro === true) introSpan = `<input type="checkbox" id="he_${prefix}_autointro" value="autointro" ${styleCheckbox}></input><label for="he_${prefix}_autointro"> auto intro</label></span>`;
    return `<div class="QowCP">
            <div class="myConfig" id="config-${challengeName}">
              <div class="myOptions">
                <span style="width: ${nameWidth};">${name}:</span>
                <span>${autoSpan}</span>
                <span>${clickSpan}</span>
                <span>${introSpan}</span>
              </div>
            </div>
          </div>
        `;
  }

  // sets all checkboxes to the current config
  function setVisibleConfig () {
    (Object.keys(config)).forEach((key) => {
      if (document.getElementById(key)) document.getElementById(key).checked = config[key];
    });
  }

  // highlights the current challenge config
  // list = array
  function highlightConfig () {
    const challenge = (page.challenge === COMPLETE_REVERSE_TRANSLATION) ? TRANSLATE : page.challenge;
    const allConfigs = document.querySelectorAll('.myConfig');
    allConfigs.forEach((entry) => {
      entry.style = 'border: none; padding: 3px;';
    });
    const element = document.querySelector('#config-' + challenge);
    if (element !== null) element.style = 'border: 1px solid gray; border-radius: 2px; padding: 3px;';
  }
}

// start whenever the mutation observer wants you to start
function start () {
  if ((window.location.pathname.includes('/skill')) && (document.querySelector('[data-test="challenge-header"]') !== null || document.querySelector(CHALLENGE_JUDGE_TEXT) !== null)) {
    checkNewPage();
    if (page.challenge) {
      addConfig();
      buildDebug();
      if (page.isNewPage) {
        setupPageInformation();
        setupAllChallenges();
        resetPageAtVisibleAnswer();
      }
    } else {
      page.isNewPage = false;
    }
  }

  function setupPageInformation () {
    page.isAnswerVisible = (document.querySelector(ANSWER_QS) !== null);
    page.hasIntroSpeakerButton = (document.querySelector(SPEAK_INTRO_QS) !== null);
    page.hasSpeakerButton = (document.querySelector(SPEAKER_BUTTON_QS) !== null);
    page.isWrongAnswer = (document.querySelector(WRONG_ANSWER_QS) !== null);
    page.isRightAnswer = (document.querySelector(RIGHT_ANSWER_QS) !== null);
    page.isRightAnswerTypo = (document.querySelector(RIGHT_ANSWER_TYPO_QS) !== null);
  }

  function setupAllChallenges () {
    if (page.challenge === COMPLETE_REVERSE_TRANSLATION) setupCompleteReverseTranslation();
    if (page.challenge === DIALOGUE) setupDialogue();
    if (page.challenge === FORM) setupForm();
    if (page.challenge === GAP_FILL) setupGapFill();
    if (page.challenge === MATCH) setupMatch();
    if (page.challenge === NAME) setupName();
    if (page.challenge === LISTEN_COMPREHENSION) setupListenComprehension();
    if (page.challenge === LISTEN_TAP) setupListenTap();
    if (page.challenge === READ_COMPREHENSION) setupReadComprehension();
    if (page.challenge === SPEAK) setupSpeak();
    if (page.challenge === TAP_CLOZE) setupTapCloze();
    if (page.challenge === TAP_CLOZE_TABLE) setupTapClozeTable();
    if (page.challenge === TAP_COMPLETE) setupTapComplete();
    if (page.challenge === (TRANSLATE || LISTEN)) setupTranslate();
    if (page.challenge === TYPE_CLOZE) setupTypeCloze();
    if (!page.challenge && document.querySelector(CHALLENGE_JUDGE_TEXT)) setupTip();
  }

  function resetPageAtVisibleAnswer () {
    if (page.isAnswerVisible) {
      // Alt + l for Duo or our speaker button
      document.removeEventListener('keydown', myShortcutListener);
      document.addEventListener('keydown', myShortcutListener);
      // reset page to allow new processing
      page.isNewPage = false;
      page.isOptionSpeechAdded = false;
    }
  }
}

function setupCompleteReverseTranslation () {
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeCompleteReverseTranslation(), config.he_ct_auto);

  function prepareChallengeCompleteReverseTranslation () {
    let read;
    if (page.isRightAnswer) {
      const tiParent = document.querySelector(TEXT_INPUT_QS).parentNode;
      tiParent.innerText = document.querySelector(TEXT_INPUT_QS).value;
      read = tiParent.parentNode.innerText;
    }
    if (page.isWrongAnswer || page.isRightAnswerTypo) {
      const answer = document.querySelector(ANSWER_CLASS);
      if (answer.lastElementChild) {
        read = answer.lastElementChild.innerText;
      } else {
        read = answer.innerText;
      }
    }
    if (page.hasSpeakerButton) {
      read = document.querySelector(HINT_TOKEN_QS).parentNode.innerText;
    }
    return read;
  }
}

function setupDialogue () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeDialogue(), config.he_cd_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeDialogue(), config.he_cd_auto);
  if (!page.isOptionSpeechAdded && document.querySelectorAll(CHALLENGE_JUDGE_INTRO_QS).length !== 0 && config.he_cd_click) {
    addSpeech(CHALLENGE_JUDGE_TEXT_QS);
  }

  function prepareChallengeDialogue () {
    // TODO: remove hard coded references
    const speaker1 = document.querySelector('[class="' + DIALOGUE_SPEAKER_CLASS + '"]').innerText;
    let speaker2;
    if (page.isWrongAnswer) {
      speaker2 = document.querySelector('._1UqAr._1sqiF').innerText;
    } else {
      speaker2 = document.querySelector('[aria-checked="true"]').querySelector('[data-test="challenge-judge-text"]').innerText;
    }
    return speaker1 + '\n' + speaker2;
  }

  function introChallengeDialogue () {
    if (document.querySelector(HINT_SENTENCE_QS)) {
      const read = document.querySelector(HINT_SENTENCE_QS).innerText;
      const speaker = document.createElement('div');
      speaker.innerHTML = speakerButton;
      speaker.children[0].id = SPEAK_INTRO;
      speaker.children[0].style = 'width:40px; height:40px; background:transparent; margin-left:-16px; margin-right:0px; padding-bottom:5px';
      document.querySelector(HINT_SENTENCE_QS).insertAdjacentElement('afterBegin', speaker);
      return read;
    }
  }
}

function setupForm () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeForm(), config.he_cf_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeForm(), config.he_cf_auto);
  if (page.isOptionSpeechAdded === false && document.querySelectorAll(CHALLENGE_JUDGE_TEXT_QS).length !== 0 && config.he_cf_click === true) {
    addSpeech(CHALLENGE_JUDGE_TEXT_QS);
  }

  function prepareChallengeForm () {
    let answer;
    if (page.isRightAnswer) {
      answer = document.querySelector(RIGHT_OPTION_QS).innerText;
      document.querySelector(GAP_FILL_UNDERSCORE_QS).innerHTML = hintTokenSpan(answer);
    }
    if (page.isWrongAnswer) {
      const answerElement = document.querySelector(ANSWER_CLASS);
      if (answerElement.lastElementChild) {
        answer = answerElement.lastElementChild.innerText;
      } else {
        answer = answerElement.innerText;
      }
    }
    const read = document.querySelector(FORM_PROMPT_QS).getAttribute('data-prompt').replace(/_+/, answer);
    if (page.isWrongAnswer) document.querySelector(FORM_PROMPT_QS).innerHTML = `<span>${read}</span>`;
    return read;
  }

  function introChallengeForm () {
    if (document.querySelector(FORM_PROMPT_QS)) {
      const read = document.querySelector(FORM_PROMPT_QS).getAttribute('data-prompt').replace(/_+/, '\n');
      const speaker = document.createElement('div');
      speaker.innerHTML = speakerButton;
      speaker.children[0].id = SPEAK_INTRO;
      speaker.children[0].style = 'width:40px; height:40px; background:transparent; margin-left:-16px; margin-right:0px; padding-bottom:5px';
      document.querySelector(FORM_PROMPT_QS).insertAdjacentElement('afterBegin', speaker);
      return read;
    }
  }
}

function setupGapFill () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeGapFill(), config.he_cgf_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeGapFill(), config.he_cgf_auto);
  if (!page.isOptionSpeechAdded && document.querySelectorAll(CHALLENGE_JUDGE_INTRO_QS).length !== 0 && config.he_cgf_click === true) {
    addSpeech(CHALLENGE_JUDGE_TEXT_QS);
  }

  function prepareChallengeGapFill () {
    let answer;
    if (page.isRightAnswer) {
      answer = document.querySelector(RIGHT_OPTION_QS).innerText;
    }
    if (page.isWrongAnswer) {
      const answerElement = document.querySelector(ANSWER_CLASS);
      if (answerElement.lastElementChild) {
        answer = answerElement.lastElementChild.innerText;
      } else {
        answer = answerElement.innerText;
      }
    }
    // question
    let read = document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.innerText;
    // new type, which has two blanc places
    if (answer.includes('...')) {
      const answers = answer.split(' ... ');
      debug('answer 1 = ' + answers[0]);
      debug('answer 2 = ' + answers[1]);
      const reads = read.split('\n');
      debug('reads = ' + reads);

      if (reads.length === 2) {
        read = answers[0] + reads[0] + answers[1] + reads[1];
      } else {
        read = reads[0] + answers[0] + reads[1] + answers[1] + reads[2];
      }
      const underscores = document.querySelectorAll(GAP_FILL_UNDERSCORE_QS);
      underscores.forEach(function (underscore, index) {
        underscore.innerHTML = hintTokenSpan(answers[index]);
      });
    } else {
      // if the answer is at the start of the sentence, there's no \n
      if (read.includes('\n')) {
        read = read.replace('\n', answer);
      } else {
        read = answer + ' ' + read;
      }
      document.querySelector(GAP_FILL_UNDERSCORE_QS).innerHTML = hintTokenSpan(answer);
    }

    return read;
  }
}

function setupListenComprehension () {
  if (page.isOptionSpeechAdded === false && document.querySelectorAll(CHALLENGE_JUDGE_INTRO_QS).length !== 0 && config.he_clc_click === true) {
    const hint = document.querySelector(HINT_TOKEN_QS).parentNode.innerText.replace('…', '').replace('...', '');
    addSpeech(CHALLENGE_JUDGE_TEXT_QS, hint);
  }
}

function setupListenTap () {
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeListenTap(), config.he_clt_auto);
  if (!page.isOptionSpeechAdded && config.he_clt_click && document.querySelectorAll(CHALLENGE_TAP_TOKEN_QS).length !== 0) {
    addSpeech(CHALLENGE_TAP_TOKEN_QS, '', true);
  }

  function prepareChallengeListenTap () {
    if (page.isWrongAnswer) {
      const answer = document.querySelector(ANSWER_CLASS);
      if (answer.lastElementChild) {
        return answer.lastElementChild.innerText;
      } else {
        return answer.innerText;
      }
    }
    if (page.isRightAnswer) {
      if (document.querySelector(CHALLENGE_TAP_TOKEN_QS)) {
        const read = document.querySelector(CHALLENGE_TAP_TOKEN_QS).parentNode.parentNode.innerText;
        return read.replace(/\n/g, ' ').replace(/' /g, "'");
      }
    }
  }
}

function setupMatch () {
  if (!page.isOptionSpeechAdded && config.he_cm_click && document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT_QS).length !== 0) {
    addSpeech(CHALLENGE_TAP_TOKEN_TEXT_QS, '', true);
  }
}

function setupName () {
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeName(), config.he_cn_auto);

  function prepareChallengeName () {
    let read;
    if (page.isRightAnswer) {
      read = document.querySelector(TEXT_INPUT_QS).value;
    }
    if (page.isWrongAnswer) {
      read = document.querySelector(ANSWER_CLASS).innerText;
    }
    return read;
  }
}

function setupReadComprehension () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeReadComprehension(), config.he_crc_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeReadComprehension(), config.he_crc_auto);
  if (!page.isOptionSpeechAdded && config.he_crc_click && document.querySelectorAll(CHALLENGE_JUDGE_TEXT_QS).length !== 0) {
    const hint = document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.nextSibling.firstChild.innerText.replace('…', '').replace('...', '');
    addSpeech(CHALLENGE_JUDGE_TEXT_QS, hint);
  }

  function prepareChallengeReadComprehension () {
    const speaker1 = document.querySelector(HINT_TOKEN_QS).parentNode.innerText.replaceAll(' ?', '?').replaceAll(' .', '.').replaceAll(' !', '!').replaceAll(' ,', ',');
    let speaker2;
    if (page.isWrongAnswer) {
      speaker2 = document.querySelector(ANSWER_CLASS).innerText;
    } else {
      speaker2 = document.querySelector(RIGHT_OPTION_QS).innerText;
    }
    return speaker1 + '\n' + document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.nextSibling.firstChild.innerText.replace('...', '').replace(' ?', '?') + ' ' + speaker2;
  }

  function introChallengeReadComprehension () {
    if (document.querySelector(HINT_TOKEN_QS)) {
      const read = document.querySelector(HINT_TOKEN_QS).parentNode.innerText;
      const speaker = document.createElement('div');
      speaker.innerHTML = speakerButton;
      speaker.children[0].id = SPEAK_INTRO;
      speaker.children[0].style = 'width:40px; height:40px; background:transparent; margin-left:-7px; margin-bottom:-10px; margin-right:0px;';
      document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.insertAdjacentElement('beforeBegin', speaker);
      return read;
    }
  }
}

function setupSpeak () {
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeSpeak(), config.he_cs_auto);

  function prepareChallengeSpeak () {
    if (document.querySelector(HINT_TOKEN_QS)) {
      return document.querySelector(HINT_TOKEN_QS).parentNode.innerText;
    }
  }
}

function setupTapCloze () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeTapCloze(), config.he_ctcl_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeTapCloze(), config.he_ctcl_auto);

  function introChallengeTapCloze () {
    const speaker = document.createElement('div');
    speaker.innerHTML = speakerButton;
    speaker.children[0].id = SPEAK_INTRO;
    speaker.children[0].style = 'width:40px; height:40px; background:transparent; padding-bottom:15px; margin-bottom:-10px; margin-right:0px;';
    document.querySelectorAll(HINT_TOKEN_QS)[0].insertAdjacentElement('beforeBegin', speaker);
    const hintTokens = document.querySelectorAll(HINT_TOKEN_QS);
    let intro = '';
    for (const token of hintTokens) {
      intro += token.innerText;
    }
    return intro;
  }

  function prepareChallengeTapCloze () {
    if (page.isRightAnswer) {
      return document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.innerText.replaceAll('\n', '');
    }
    if (page.isWrongAnswer) {
      const answer = document.querySelector(ANSWER_CLASS);
      if (answer.lastElementChild) {
        return answer.lastElementChild.innerText;
      } else {
        return answer.innerText;
      }
    }
  }
}

function setupTapClozeTable () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeTapClozeTable(), config.he_ctct_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeTapClozeTable(), config.he_ctct_auto);

  function introChallengeTapClozeTable () {
    const speaker = document.createElement('div');
    speaker.innerHTML = speakerButton;
    speaker.children[0].id = SPEAK_INTRO;
    speaker.children[0].style = 'width:40px; height:40px; background:transparent; padding-bottom:15px; margin-bottom:-10px; margin-right:0px;';
    document.querySelectorAll(HINT_TOKEN_QS)[1].insertAdjacentElement('beforeBegin', speaker);
    return document.querySelectorAll(HINT_TOKEN_QS)[1].innerText;
  }

  function prepareChallengeTapClozeTable () {
    if (page.isRightAnswer) {
      // it reads kind of 'vous\t\ns\navez' and should be 'vous savez'
      let read = document.querySelectorAll(HINT_TOKEN_QS)[2].parentNode.parentNode.parentNode.innerText.replace('\t\n', ' ').replace('\n', '');
      read += '\n' + document.querySelectorAll(HINT_TOKEN_QS)[3].parentNode.parentNode.parentNode.innerText.replace('\t\n', ' ').replace('\n', '');
      return read;
    }
    if (page.isWrongAnswer) {
      const answer = document.querySelector(ANSWER_CLASS);
      if (answer.lastElementChild) {
        return answer.lastElementChild.innerText;
      } else {
        return answer.innerText;
      }
    }
  }
}

function setupTapComplete () {
  if (!page.hasIntroSpeakerButton) handleIntroReading(introChallengeGapFill(), config.he_ctc_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeTapComplete(), config.he_ctc_auto);
  if (page.isOptionSpeechAdded === false && config.he_ctc_click && document.querySelectorAll(CHALLENGE_TAP_TOKEN_QS).length !== 0) {
    addSpeech(CHALLENGE_TAP_TOKEN_QS);
  }

  function prepareChallengeTapComplete () {
    let read;
    if (page.isRightAnswer) {
      read = document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.innerText.replace(/\n/g, '');
    }
    if (page.isWrongAnswer) {
      read = document.querySelector(ANSWER_CLASS).innerText;
    }
    return read;
  }
}

function setupTypeCloze () {
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeTypeCloze(), config.he_ctyc_auto);

  function prepareChallengeTypeCloze () {
    let read;
    if (page.isRightAnswer) {
      const htParent = document.querySelector(HINT_TOKEN_QS).parentNode.parentNode;
      const input = htParent.querySelector('input');
      input.parentNode.innerText = input.value;
      read = htParent.innerText.replaceAll('\n', '');
    }
    if (page.isWrongAnswer || page.isRightAnswerTypo) {
      const answer = document.querySelector(ANSWER_CLASS);
      if (answer.lastElementChild) {
        read = answer.lastElementChild.innerText;
      } else {
        read = answer.innerText;
      }
    }
    return read;
  }
}

function setupTranslate () {
  let configValue = config.he_ct_auto;
  if (page.challenge === LISTEN) configValue = config.he_cl_auto;
  // complete reverse translation uses the same config as translation, because it looks the same for the user
  // if (page.challenge === COMPLETE_REVERSE_TRANSLATION) configValue = config.he_ct_auto;
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareChallengeTranslate(), configValue);
  if (!page.isOptionSpeechAdded && config.he_ct_click && !page.hasSpeakerButton && document.querySelectorAll(CHALLENGE_TAP_TOKEN_QS).length !== 0) {
    addSpeech(CHALLENGE_TAP_TOKEN_QS, '', true);
  }

  function prepareChallengeTranslate () {
    let read;
    if (page.isRightAnswer) {
      if (document.querySelector(WORD_BANK_QS)) {
        read = document.querySelector(CHALLENGE_TAP_TOKEN_QS).parentNode.parentNode.innerText.replace(/\n/g, ' ');
        read = read.replace(/' /g, "'");
      } else {
        const tI = document.querySelector(TRANSLATE_INPUT_QS);
        if (tI.lang === config.lang) read = tI.innerHTML;
      }
    }
    if (page.isWrongAnswer || page.isRightAnswerTypo) {
      const answer = document.querySelector(ANSWER_CLASS);
      if (answer.lastElementChild) {
        read = answer.lastElementChild.innerText;
      } else {
        read = answer.innerText;
      }
    }
    if (page.hasSpeakerButton) {
      read = document.querySelector(HINT_TOKEN_QS).parentNode.innerText;
    }
    return read;
  }
}

function hintTokenSpan (text) {
  return `<span><div style="--offset:13px;">${text}</div></span>\n`;
}

function introChallengeGapFill () {
  if (document.querySelector(HINT_TOKEN_QS)) {
    const read = document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.innerText;
    const speaker = document.createElement('div');
    speaker.innerHTML = speakerButton;
    speaker.children[0].id = SPEAK_INTRO;
    speaker.children[0].style = 'width:40px; height:40px; background:transparent; margin-left:-16px; margin-right:0px; padding-bottom:5px';
    document.querySelector(HINT_TOKEN_QS).parentNode.parentNode.insertAdjacentElement('afterBegin', speaker);
    return read;
  }
}

function setupTip () {
  if (!page.hasIntroSpeakerButton && config.he_t_autointro) handleIntroReading(introTip(), config.he_t_autointro);
  if (page.isAnswerVisible) renderAnswerSpeakButton(prepareTip(), config.he_t_auto);
  if (page.isOptionSpeechAdded === false && config.he_t_click && document.querySelectorAll(CHALLENGE_JUDGE_TEXT).length !== 0) {
    addSpeech(CHALLENGE_JUDGE_TEXT);
  }

  function prepareTip () {
    const readArr = document.querySelectorAll(TIP_TEXT_QS);
    readArr[readArr.length - 3].replace('/(&nbsp;)+/', document.querySelector(RIGHT_OPTION_QS));
    let read = '';
    readArr.forEach(function (element, key) {
      if (key !== (0 || 1 || 2)) {
        read += element.innerText + '\n';
        if (readArr[readArr.length - 3].contains(document.querySelector(RIGHT_OPTION_QS))) return read;
      }
    });
    return read;
  }

  function introTip () {
    const readArr = document.querySelectorAll(TIP_TEXT_QS + ' ._1LQ5F ' + HINT_TOKEN_QS);
    let read = '';
    for (const element of readArr) {
      read += (element.innerText).replace(' ', '') + '\n';
    }
    const speaker = document.createElement('div');
    speaker.innerHTML = speakerButton;
    speaker.children[0].id = SPEAK_INTRO;
    speaker.children[0].style = 'width:40px; height:40px; background:transparent; margin-left:-16px; margin-right:0px; padding-bottom:5px';
    document.querySelector(HINT_TOKEN_QS).insertAdjacentElement('beforeBegin', speaker);
    return read;
  }
}

function handleIntroReading (read = '', click = false) {
  if (DEBUG) document.querySelector('#mySentence').innerText = read;
  debug('intro = ' + read);
  const utter = generateUtter(read);
  const speakIntro = document.querySelector(SPEAK_INTRO_QS);
  addSpeakListener(SPEAK_INTRO, utter, read);
  if (click && speakIntro !== null) {
    debug('click intro speaker button');
    speakIntro.click();
  }
}

function renderAnswerSpeakButton (read = '', auto = false) {
  debug('renderAnswerSpeakButton read = ' + read);
  const utter = generateUtter(read);
  // add speaker button to answer and fill in the correct answer in the headline
  updateText(read);
  // if we have added the speaker button, we find it in the document
  addSpeakListener('speak', utter, read);
  // if you like autoplay, it waits 1 second an plays it
  if (auto) timeoutAutoplay(utter);
}

function timeoutAutoplay (utter) {
  timeout = setTimeout(function () {
    debug('auto play ' + page.challenge);
    synth.cancel();
    synth.speak(utter);
  }, config.ap_timeout);
}

function addSpeakListener (id, utter, read) {
  const speak = document.querySelector('#' + id);
  if (speak) {
    speak.addEventListener('click', function () { synth.cancel(); synth.speak(utter); });
    if (DEBUG) document.querySelector('#mySentence').innerText = read;
    document.getElementById(id).title = read;
  } else {
    debug('No speak button found');
  }
}

function addSpeech (qs, t = '', overrideDuo = false) {
  if (t !== '') t += ' ';
  const options = document.querySelectorAll(qs);
  debug('add speech to options');
  options.forEach(function (option, index) {
    if ((page.challenge !== MATCH) || (page.challenge === MATCH && index > 4)) {
      const utter = generateUtter(t + option.innerText);
      option.parentNode.addEventListener('click', function () {
        if (overrideDuo) page.isReadingOptions = true;
        debug('Option read = ' + t + option.innerText);
        synth.cancel();
        synth.speak(utter);
      });
    }
  });
  page.isOptionSpeechAdded = true;
}

function generateUtter (read) {
  const utter = new SpeechSynthesisUtterance(read);
  utter.voice = voices[voiceSelect];
  utter.volume = 1;
  utter.pitch = 1;
  utter.rate = 1;
  utter.lang = config.lang;
  return utter;
}

function myShortcutListener (event) {
  const speak = document.querySelector('#speak');
  const duoSpeak = document.querySelector(SPEAKER_BUTTON_QS);
  // ALT + l combo
  if (event.altKey && event.key === 'l') {
    if (speak) speak.click();
    else if (duoSpeak) duoSpeak.click();
    debug('alt = ' + event.altKey + ' + ' + event.key);
  }
}

// gives some debug information directly in the Duo-GUI
function buildDebug () {
  if (DEBUG && !document.querySelector('#myChallenge')) {
    let autoPlay = 'disabled';
    let speakOptions = 'disabled';
    let autoIntro = 'disabled';
    autoPlay = getEnabled(autoPlay, TRANSLATE, config.he_ct_auto);
    autoPlay = getEnabled(autoPlay, GAP_FILL, config.he_cgf_auto);
    speakOptions = getEnabled(speakOptions, GAP_FILL, config.he_cgf_click);
    autoPlay = getEnabled(autoPlay, TAP_COMPLETE, config.he_ctc_auto);
    speakOptions = getEnabled(speakOptions, TAP_COMPLETE, config.he_ctc_click);
    autoPlay = getEnabled(autoPlay, FORM, config.he_cf_auto);
    speakOptions = getEnabled(speakOptions, FORM, config.he_cf_click);
    autoPlay = getEnabled(autoPlay, DIALOGUE, config.he_cd_auto);
    speakOptions = getEnabled(speakOptions, DIALOGUE, config.he_cd_click);
    autoIntro = getEnabled(autoIntro, DIALOGUE, config.he_cd_autointro);
    autoPlay = getEnabled(autoPlay, NAME, config.he_cn_auto);
    speakOptions = getEnabled(speakOptions, LISTEN_COMPREHENSION, config.he_clc_click);
    autoPlay = getEnabled(autoPlay, SPEAK, config.he_cs_auto);
    buildDebugDiv(speakOptions, autoPlay, autoIntro);
  }

  // sets a option to 'enabled' if challengeName and configOption are true for this page
  function getEnabled (option, challengeName, configOption) {
    if (page.challenge === challengeName && configOption) option = 'enabled';
    return option;
  }

  function buildDebugDiv (speakOptions, autoPlay, autoIntro) {
    const debugDiv = document.createElement('div');
    debugDiv.innerHTML = `<span>Challenge-Name: <span id="myChallenge">${getChallengeType()[0]}</span></span>
      <span>Sentence to speak: <span id="mySentence"></span></span>
      <span>Speak options: <span id="myOptions">${speakOptions}</span></span>
      <span>Auto play: <span id="myAutoPlay">${autoPlay}</span></span>
      <span>Auto intro: <span id="myAutoIntro">${autoIntro}</span></span>
      <span>Not found: <span id="myNotFound"></span></span>`;
    debugDiv.style = 'font-size: small; text-align:left; display:grid;';
    document.querySelector('[data-test="challenge-header"]').insertAdjacentElement('afterend', debug);
    if (!document.querySelector(HINT_SENTENCE_QS)) {
      document.querySelector('#myNotFound').innerText += ' HINT_SENTENCE: ' + HINT_SENTENCE;
    }
    if (!document.querySelector(SPEAKER_BUTTON_QS)) {
      document.querySelector('#myNotFound').innerText += ' SPEAKER_BUTTON: ' + SPEAKER_BUTTON;
    }
  }
}

function checkNewPage () {
  if (!document.querySelector('#myNewPage')) {
    page.challenge = getChallengeType()[0];
    // if (!page.challenge) { page.challenge = 'tip'; }
    const nP = document.createElement('div');
    nP.id = 'myNewPage';
    document.querySelector('[data-test="challenge-header"]').insertAdjacentElement('beforeend', nP);
    debug('Challenge Type = ' + page.challenge);
    page.isNewPage = true;
    if (howlPlay === false) {
      synth.cancel();
    } else {
      howlPlay = false;
    }
  }
}

// TODO: remove returned array
// returns challenge type or false
function getChallengeType () {
  const element = document.querySelector('[data-test~="challenge"]');
  if (element !== null) {
    return [element.getAttribute('data-test').split(' ')[1], element];
  } else {
    return [false];
  }
}

function updateText (t) {
  // don't add a listen button if there is no text t
  if (t !== '') {
    const translateInput = document.querySelector(TRANSLATE_INPUT_QS);
    const div = document.createElement('div');
    div.class = 'np6Tv';
    div.style = 'position: absolute; align-self: flex-end; top: 1.8rem;';
    div.innerHTML = speakerButton;
    // if the answer is displayed
    if (document.querySelector(ANSWER_QS)) {
      if (translateInput !== null) {
        if (translateInput.lang === config.lang) {
          document.querySelector(ANSWER_QS).parentNode.insertAdjacentElement('afterBegin', div);
        }
      } else {
        document.querySelector(ANSWER_QS).parentNode.insertAdjacentElement('afterBegin', div);
      }
    }
  }
}
