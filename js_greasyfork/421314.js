// ==UserScript==
// @name          Youtube记忆恢复双语字幕和播放速度-下载字幕
// @name:en    Youtube store/restore bilingual subtitles and playback speed - download subtitles
// @description  记忆播放器设置菜单（含自动翻译菜单）选择的字幕语言和播放速度。默认中文（简体）字幕/默认字幕（双语）；找不到匹配的语言时，匹配前缀，例如中文（简体）->中文
// @description:en  The selected subtitle language and playback speed are stored and auto restored
// @match       https://www.youtube.com/*
// @run-at       document-start
// @author      szdailei@gmail.com
// @source      https://github.com/szdailei/GM-scripts
// @namespace  https://greasyfork.org
// @version         3.0.3
// @downloadURL https://update.greasyfork.org/scripts/421314/Youtube%E8%AE%B0%E5%BF%86%E6%81%A2%E5%A4%8D%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E5%92%8C%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6-%E4%B8%8B%E8%BD%BD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/421314/Youtube%E8%AE%B0%E5%BF%86%E6%81%A2%E5%A4%8D%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E5%92%8C%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6-%E4%B8%8B%E8%BD%BD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

/**
require:  @run-at document-start
ensure:  run handleYtNavigateFinish() when yt-navigate-finish event triggered
*/
(() => {
  const PLAY_SPEED_LOCAL_STORAGE_KEY = 'greasyfork-org-youtube-config-play-speed';
  const SUBTITLE_LOCAL_STORAGE_KEY = 'greasyfork-org-youtube-config-subtitle';
  const NOT_SUPPORT_LANGUAGE =
    'Only English and Chinese are supported. \n\nFor users who have signed in youtube, please change the account language to English or Chinese. \n\nFor users who have not signed in youtube, please change the browser language to English or Chinese.';
  const DEFAULT_SUBTITLES = 'english';
  const TIMER_OF_MENU_LOAD_AFTER_USER_CLICK = 20;
  const TIMER_OF_ELEMENT_LOAD = 100;
  const numbers = '0123456789';
  const specialCharacterAndNumbers = '`~!@#$%^&*()_+<>?:"{},./;\'[]0123456789-=（）';

  class I18n {
    constructor(langCode, resource) {
      this.langCode = langCode;
      switch (langCode) {
        case 'zh':
        case 'zh-CN':
        case 'zh-SG':
        case 'zh-Hans-CN':
        case 'cmn-Hans-CN':
        case 'cmn-Hans-SG':
          this.resource = resource.cmnHans;
          break;
        case 'zh-TW':
        case 'zh-Hant-TW':
        case 'cmn-Hant-TW':
          this.resource = resource.cmnHant;
          break;
        case 'zh-HK':
        case 'zh-MO':
        case 'zh-Hant-HK':
        case 'zh-Hant-MO':
        case 'yue-Hant-HK':
        case 'yue-Hant-MO':
          this.resource = resource.cmnHantHK;
          break;
        case 'en':
        case 'en-AU':
        case 'en-BZ':
        case 'en-CA':
        case 'en-CB':
        case 'en-GB':
        case 'en-IE':
        case 'en-IN':
        case 'en-JM':
        case 'en-NZ':
        case 'en-PH':
        case 'en-TT':
        case 'en-US':
        case 'en-ZA':
        case 'en-ZW':
          this.resource = resource.en;
          break;
        default:
          alert(NOT_SUPPORT_LANGUAGE); // eslint-disable-line no-alert
          this.resource = resource.en;
          break;
      }
    }

    t(key) {
      return this.resource[key];
    }
  }

  let lastHref = null;
  const hostLanguage = document.getElementsByTagName('html')[0].getAttribute('lang');
  if (hostLanguage === null) {
    return;
  }

  const i18n = new I18n(hostLanguage, getResource());
  if (getStorage(i18n.t('subtitles')) === null) {
    setStorage(i18n.t('subtitles'), i18n.t(DEFAULT_SUBTITLES));
  }

  window.addEventListener('yt-navigate-finish', handleYtNavigateFinish);

  function getResource() {
    const resource = {
      en: {
        playSpeed: 'Playback speed',
        subtitles: 'Subtitles',
        autoTranlate: 'Auto-translate',
        chinese: 'Russian',
        //openTranscript: 'Open transcript',
        //downloadTranscript: 'Download transcript',
      },
      cmnHans: {
        playSpeed: '播放速度',
        subtitles: '字幕',
        autoTranlate: '自动翻译',
        chinese: '中文（简体）',
        openTranscript: '打开解说词',
        downloadTranscript: '下载字幕',
      },
      cmnHant: {
        playSpeed: '播放速度',
        subtitles: '字幕',
        autoTranlate: '自動翻譯',
        chinese: '中文（簡體）',
        openTranscript: '開啟字幕記錄',
        downloadTranscript: '下載字幕',
      },
      cmnHantHK: {
        playSpeed: '播放速度',
        subtitles: '字幕',
        autoTranlate: '自動翻譯',
        chinese: '中文（簡體字）',
        openTranscript: '開啟字幕',
        downloadTranscript: '下載字幕',
      },
    };
    return resource;
  }

  function handleYtNavigateFinish() {
    if (lastHref === window.location.href || window.location.href.indexOf('/watch') === -1) {
      return;
    }

    lastHref = window.location.href;
    // run once on https://www.youtube.com/watch*.
    youtubeConfig();
  }

  /**
require:  yt-navigate-finish event on https://www.youtube.com/watch*
ensure:
    1. If there isn't subtitle enable button, exit.
    2. store/resotre play speed and subtitle. If can't restore subtitle, but there is auto-translate radio, translate to stored subtitle.
    3. If there is transcript, trun on transcript.
*/
  async function youtubeConfig() {
    const player = await waitUntil(document.getElementById('movie_player'));
    const rightControls = await waitUntil(player.getElementsByClassName('ytp-right-controls'));
    const rightControl = rightControls[0];
    if (isSubtitleEabled(rightControl) === false) {
      return;
    }

    const settingsButtons = await waitUntil(rightControl.getElementsByClassName('ytp-settings-button'));
    const settingsButton = settingsButtons[0];
    settingsButton.addEventListener('click', handleRadioClick);

    settingsButton.click();
    const settingsMenu = await waitUntil(getPanelMenuByTitle(player, ''));
    await restoreSettingOfTitle(player, settingsMenu, i18n.t('playSpeed'));

    const isSubtitlRestored = await restoreSettingOfTitle(player, settingsMenu, i18n.t('subtitles'));
    if (isSubtitlRestored === false) {
      const labels = settingsMenu.getElementsByClassName('ytp-menuitem-label');
      const subtitlesRadio = getElementByShortTextContent(labels, i18n.t('subtitles'));
      subtitlesRadio.click();
      const subtitleMenu = await waitUntil(getPanelMenuByTitle(player, i18n.t('subtitles')));
      const isAutoTransSubtitleRestored = await restoreSettingOfTitle(player, subtitleMenu, i18n.t('autoTranlate'));
      if (isAutoTransSubtitleRestored === false) {
        settingsButton.click(); // close settings menu
      }
    } else {
      settingsButton.click(); // close settings menu
    }

    await turnOnTranscript();
  }

  function isSubtitleEabled(rightControl) {
    const subtitlesEnableButtons = rightControl.getElementsByClassName('ytp-subtitles-button');
    if (
      subtitlesEnableButtons === null ||
      subtitlesEnableButtons[0] === null ||
      subtitlesEnableButtons[0].style.display === 'none'
    ) {
      return false;
    }
    if (subtitlesEnableButtons[0].getAttribute('aria-pressed') === 'false') {
      subtitlesEnableButtons[0].click();
    }
    return true;
  }

  async function restoreSettingOfTitle(player, openedMenu, subMenuTitle) {
    const value = getStorage(subMenuTitle);
    if (value === null) {
      return true;
    }

    const labels = openedMenu.getElementsByClassName('ytp-menuitem-label');
    const radio = getElementByShortTextContent(labels, subMenuTitle);
    if (radio === null) {
      return false;
    }
    radio.click();
    const subMenu = await waitUntil(getPanelMenuByTitle(player, subMenuTitle));
    return restoreSettingByValue(subMenu, value);
  }

  function getPanelMenuByTitle(player, title) {
    if (title === null || title === '') {
      // settings menu
      const panelMenus = player.getElementsByClassName('ytp-panel-menu');
      if (panelMenus === null || panelMenus.length === 0 || panelMenus[0].previousElementSibling !== null) {
        // no panelMenus or panelMenu has previousElementSibling (panelHeader)
        return null;
      }
      return panelMenus[0];
    }

    // other menu, not settings menu
    const panelHeaders = player.getElementsByClassName('ytp-panel-header');
    if (panelHeaders !== null) {
      for (let i = 0; i < panelHeaders.length; i += 1) {
        const panelHeaderTitle = getPanelHeaderTitle(panelHeaders[i]);
        if (getShortText(panelHeaderTitle.textContent) === title) {
          return panelHeaders[i].nextElementSibling;
        }
      }
    }
    return null;
  }

  function getPanelHeaderTitle(panelHeader) {
    const panelTitles = panelHeader.getElementsByClassName('ytp-panel-title');
    return panelTitles[0];
  }

  function restoreSettingByValue(openedMenu, value) {
    const panelheader = openedMenu.previousElementSibling;
    const panelTitle = getPanelHeaderTitle(panelheader);
    const labels = openedMenu.getElementsByClassName('ytp-menuitem-label');
    let storedRadio = getElementByTextContent(labels, value);
    if (storedRadio === null) {
      // if can't match '中文（简体）'，try '中文'
      storedRadio = getElementByShortTextContent(labels, getShortText(value));
      if (storedRadio === null) {
        panelTitle.click();
        return false;
      }
    }

    if (storedRadio.parentElement.getAttribute('aria-checked') === 'true') {
      panelTitle.click();
      return true;
    }
    storedRadio.click();
    return true;
  }

  function handleRadioClick() {
    const player = document.getElementById('movie_player');

    if (this.textContent === '') {
      // clicked on settingsButton which will open settingsMenu
      handleRadioToPanelMenuClick(player, '', handleRadioClick);
      return;
    }

    // clicked on radio which will open subMenu
    const label = this.getElementsByClassName('ytp-menuitem-label')[0];
    const shortText = getShortText(label.textContent);
    if (
      shortText === i18n.t('playSpeed') ||
      shortText === i18n.t('subtitles') ||
      shortText === i18n.t('autoTranlate')
    ) {
      handleRadioToPanelMenuClick(player, shortText, handleRadioClick);
      return;
    }

    // in 'autoTranlate' menu, only one radio which seleted by default has parentNode, others are orphan nodes and can't get parentNode by 'this'
    const panelHeaders = player.getElementsByClassName('ytp-panel-header');
    const title = getShortText(getPanelHeaderTitle(panelHeaders[0]).textContent);
    setStorage(title, label.textContent);
  }

  async function handleRadioToPanelMenuClick(player, title, eventListener) {
    const panelMenu = await waitUntil(getPanelMenuByTitle(player, title), TIMER_OF_MENU_LOAD_AFTER_USER_CLICK);
    addEventListenerOnPanelMenu(panelMenu, eventListener);
  }

  function addEventListenerOnPanelMenu(panelMenu, eventListener) {
    const radios = panelMenu.getElementsByClassName('ytp-menuitem-label');
    Array.prototype.forEach.call(radios, (radio) => {
      radio.parentElement.addEventListener('click', eventListener);
    });
  }

  async function turnOnTranscript() {
    const infoContents = await waitUntil(document.getElementById('info-contents'));
    const moreActionsMenuButtons = await waitUntil(infoContents.getElementsByClassName('dropdown-trigger'));
    const moreActionsMenuButton = moreActionsMenuButtons[0];

    moreActionsMenuButton.click();
    const menuPopupRenderers = await waitUntil(document.getElementsByTagName('ytd-menu-popup-renderer'));
    const formattedStrings = menuPopupRenderers[0].getElementsByTagName('yt-formatted-string');
    const openTranscriptRadio = getElementByTextContent(formattedStrings, i18n.t('openTranscript'));
    if (openTranscriptRadio === null) {
      moreActionsMenuButton.click(); // close moreActionsMenu
      return;
    }

    openTranscriptRadio.click();
    const panels = await waitUntil(document.getElementById('panels'));
    const actionButton = panels.querySelector('#action-button');
    insertPaperButton(actionButton, i18n.t('downloadTranscript'), onTranscriptDownloadButtonClicked);
  }

  function insertPaperButton(referenceNode, textContent, clickCallback) {
    if (
      referenceNode.previousElementSibling !== null &&
      referenceNode.previousElementSibling.textContent.indexOf(textContent) !== -1
    ) {
      return;
    }

    const newNode = document.createElement('paper-button');
    newNode.className = 'style-scope ytd-subscribe-button-renderer';
    newNode.textContent = textContent;

    referenceNode.parentNode.insertBefore(newNode, referenceNode);
    newNode.addEventListener('click', clickCallback);
  }

  function onTranscriptDownloadButtonClicked() {
    const infoContents = document.getElementById('info-contents');
    const title = infoContents.getElementsByTagName('h1')[0];
    const filename = `${title.textContent}.srt`;

    const panels = document.getElementById('panels');
    const cueGroups = panels.getElementsByClassName('cue-group');
    if (cueGroups === null) {
      return;
    }
    const content = getFormattedSRT(cueGroups);
    saveTextAsFile(filename, content);
  }

  function getFormattedSRT(cueGroups) {
    let content = '';
    for (let i = 0; i < cueGroups.length; i += 1) {
      const currentSubtitleStartOffsets = cueGroups[i].getElementsByClassName('cue-group-start-offset');
      const startTime = currentSubtitleStartOffsets[0].textContent.split('\n').join('').trim();
      let endTime;
      if (i === cueGroups.length - 1) {
        endTime = getLastSubtitleEndTime(startTime);
      } else {
        const nextSubtitleStartOffsets = cueGroups[i + 1].getElementsByClassName('cue-group-start-offset');
        endTime = nextSubtitleStartOffsets[0].textContent.split('\n').join('').trim();
      }

      const serialNumberLine = i + 1;
      const timeLine = `00:${startTime},000  -->  00:${endTime},000`;
      const cues = cueGroups[i].getElementsByClassName('cue');
      const contentLine = cues[0].textContent.split('\n').join('').trim();
      content += `${serialNumberLine.toString()}\n${timeLine}\n${contentLine}\n\n`;
    }
    return content;
  }

  function getLastSubtitleEndTime(startTime) {
    // assume 2 minutes long of the last subtitle
    const startTimes = startTime.split(':');
    const minuteNumber = parseInt(startTimes[0], 10) + 2;
    const endTime = `${minuteNumber.toString()}:${startTimes[1]}`;
    return endTime;
  }

  function saveTextAsFile(filename, text) {
    const a = document.createElement('a');
    a.href = `data:text/txt;charset=utf-8,${encodeURIComponent(text)}`;
    a.download = filename;
    a.click();
  }

  function getElementByTextContent(elements, textContent) {
    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].textContent === textContent) {
        return elements[i];
      }
    }
    return null;
  }

  function getElementByShortTextContent(elements, textContent) {
    for (let i = 0; i < elements.length; i += 1) {
      if (getShortText(elements[i].textContent) === textContent) {
        return elements[i];
      }
    }
    return null;
  }

  function getShortText(text) {
    if (text === null) {
      return null;
    }
    if (text === '' || numbers.indexOf(text[0]) !== -1 || text === i18n.t('autoTranlate')) {
      return text.trim();
    }

    // return input text before specialCharacterAndNumbers
    let shortText = '';
    for (let i = 0; i < text.length; i += 1) {
      if (specialCharacterAndNumbers.indexOf(text[i]) !== -1) {
        break;
      }
      shortText += text[i];
    }
    return shortText.trim();
  }

  function getStorage(title) {
    let storedValue = null;
    switch (title) {
      case i18n.t('playSpeed'):
        storedValue = localStorage.getItem(PLAY_SPEED_LOCAL_STORAGE_KEY);
        break;
      case i18n.t('subtitles'):
      case i18n.t('autoTranlate'):
        storedValue = localStorage.getItem(SUBTITLE_LOCAL_STORAGE_KEY);
        break;
      default:
        break;
    }
    return storedValue;
  }

  function setStorage(title, value) {
    switch (title) {
      case i18n.t('playSpeed'):
        localStorage.setItem(PLAY_SPEED_LOCAL_STORAGE_KEY, value);
        break;
      case i18n.t('subtitles'):
      case i18n.t('autoTranlate'):
        localStorage.setItem(SUBTITLE_LOCAL_STORAGE_KEY, value);
        break;
      default:
        break;
    }
  }

  async function waitUntil(condition, timer) {
    let timeout = TIMER_OF_ELEMENT_LOAD;
    if (timer) {
      timeout = timer;
    }
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const result = condition;
        if (result) {
          clearInterval(interval);
          resolve(result);
        }
      }, timeout);
    });
  }
})();
