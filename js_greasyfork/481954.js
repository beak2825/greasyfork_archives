// ==UserScript==
// @name                YouTube Direct Downloader
// @version             5.1
// @description         Video/short download button next to subscribe button. Downloads MP4, WEBM, MP3 or subtitles from youtube + option to redirect shorts to normal videos. Choose your preferred quality from 8k to audio only, codec (h264, vp9 or av1) or service provider (cobalt, yt5s, yt1s, ytmp3) in settings.
// @author              FawayTT
// @namespace           FawayTT
// @supportURL          https://github.com/FawayTT/userscripts/issues
// @icon                https://github.com/FawayTT/userscripts/blob/main/ydd-icon.png?raw=true
// @match               *://*.youtube.com/*
// @match               *://*.yt5s.in/*
// @match               *://*.cobalt.meowing.de/*
// @match               *://*.5smp3.com/*
// @match               *://*.yt1s.biz/*
// @match               *://*.ytmp3.ai/*
// @connect             cobalt-api.kwiatekmiki.com
// @require             https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM_xmlhttpRequest
// @license             MIT
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/481954/YouTube%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/481954/YouTube%20Direct%20Downloader.meta.js
// ==/UserScript==

const gmcCSS = `
 #YDD_config {
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px);
  color: #fff !important;
  border-radius: 30px !important;
  padding: 20px !important;
  height: fit-content !important;
  max-width: 700px !important;
  font-family: Arial, sans-serif !important;
  z-index: 9999999 !important;
  padding-bottom: 0px !important;
  width: 100% !important;
}

#YDD_config_header {
  background-color: #ff000052 !important;
  border-radius: 10px;
  padding: 10px !important;
  text-align: center !important;
  font-size: 24px !important;
  color: blob !important;
  font-weight: 600 !important;
}

.section_header_holder {
  font-weight: 600;
  margin-top: 10px !important;
}

#YDD_config_buttons_holder {
  text-align: center;
  margin-top: 20px;
}

#YDD_config_resetLink {
  color: #fff !important;
}

.config_var {
  margin: 0px !important;
  line-height: 3;
}

#YDD_config_buttons_holder button {
  background-color: #ff000052 !important;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 10px 20px !important;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.1s ease-in;
}

#YDD_config_buttons_holder button:hover {
  background-color: #ff0000 !important;
}

#YDD_config_fieldset {
  border: 1px solid #444;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

#YDD_config_fieldset legend {
  color: #ff0000;
}

 #YDD_config .section_header {
  background: none !important;
  width: fit-content;
  margin: 5px 0px !important;
  border: none !important;
  font-size: 18px !important;
  color: #ff0000 !important;
}

 #YDD_config input, select, textarea {
  cursor: pointer;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin: 5px 0 !important;
}

 #YDD_config ::selection {
  color: white;
  background: #ff0000;
}

 #YDD_config input, select, textarea {
  transition: all 0.1s ease-in;
}

 #YDD_config input:focus, select:focus, textarea:focus {
  border-color: #ff0000;
}

 #YDD_config input:hover, select:hover, textarea:hover {
  opacity: 0.8;
}

 #YDD_config label {
  color: #fff;
}

#YDD_config_buttons_holder {
  position: relative;
  margin-top: 0px !important;
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.reset_holder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  padding: 10px;
}

input[type='checkbox'] {
  appearance: none;
  position: absolute;
  width: 20px;
  transform: translateY(3px);
  height: 20px;
  border: 1px solid #555;
  border-radius: 10px;
  background-color: #333;
  cursor: pointer;
}

input[type='checkbox']:before {
  content: " ";
}

input[type='checkbox']:checked {
  background-color: #d50707;
}

input[type='checkbox']:checked::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 2px;
  width: 12px;
  height: 6px;
  border-bottom: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  transform: rotate(-45deg);
}

#YDD_config_downloadService_var:after {
  content: "▲ Use cobalt_api for direct download (hosted by third party and can easily run out of bandwidth).";
  display: block;
  font-family: arial, tahoma, myriad pro, sans-serif;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  opacity: 0.7;
}

#YDD_config_vCodec_var:after {
  content: "▲ H264 [MP4] = best compatibility. VP9 [WEBM] = better quality. AV1 = best quality but is used only by few videos.";
  display: block;
  font-family: arial, tahoma, myriad pro, sans-serif;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  opacity: 0.7;
}

#YDD_config_backupService_var:after {
  content: "▲ Available via right click or used automatically when direct download is not working.";
  display: block;
  font-family: arial, tahoma, myriad pro, sans-serif;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  opacity: 0.7;
}
`;

const yddCSS = `
#experiment-overlay {
  overflow: visible !important;
}

#ydd-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  margin-left: 8px;
  box-shadow: 1px 0px 7px -4px rgba(0, 0, 0, 0.8);
}

#ydd-download {
  position: relative;
  z-index: 10;
  cursor: pointer;
  font-size: 2rem;
  padding: 8px 12px;
  border: none;
  border-radius: 15px;
  line-height: 2rem;
  font-weight: 500;
  color: #0f0f0f;
  background-color: #f1f1f1;
  font-family: "Roboto","Arial",sans-serif;
  align-items: center;
  text-transform: capitalize;
}

#ydd-download:hover {
  filter: brightness(90%);
}

#ydd-options {
  line-height: 2rem;
  font-weight: 500;
  color: var(--yt-spec-text-primary);
  margin: 0px 5px;
  cursor: pointer;
  font-family: "Roboto","Arial",sans-serif;
  transition: all 0.1s ease-in;
}

#ydd-options:hover {
  scale: 1.4;
}

#ydd-options-div {
  transition: transform 0.3s ease, opacity 0.1s ease;
  position: absolute;
  top: 0px;
  transform: translateY(-70%);
  right: -24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  margin-right: 8px;
  margin-top: 6px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  z-index: 9999999;
  font-family: "Roboto","Arial",sans-serif;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 2rem;
  color: black;
  align-items: start;
  white-space: nowrap;
}

#ydd-options-div > * {
  margin: 6px;
  cursor: pointer;
  transition: all 0.1s ease-in;
}

#ydd-options-div > *:hover {
  scale: 1.1;
}

@keyframes scaleIn {
  0% {
    transform: scale(0.8) translateY(-20%);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(-10%);
    opacity: 1;
  }
}

@keyframes scaleOut {
  0% {
    transform: scale(1) translateY(-10%);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) translateY(-20%);
    opacity: 0;
  }
}

.ydd-scale-up {
  animation: scaleIn 0.3s forwards;
}

.ydd-scale-down {
  animation: scaleOut 0.3s forwards;
}
`;

console.log('Running YDD');

const defaults = {
  downloadService: 'yt5s',
  backupService: 'yt1s',
  quality: 'max',
  vCodec: 'av1',
  aFormat: 'mp3',
  filenamePattern: 'basic',
  isAudioMuted: false,
  disableMetadata: false,
  redirectShorts: false,
  showCobaltError: false,
};

const downloadServices = {
  yt5s: {
    title: 'YT5S',
    download: (isAudioOnly) => {
      GM_setValue('yt5sUrl', document.location.href);
      if (isAudioOnly) extraDownloadServices['5smp3'].download();
      else window.open('https://yt5s.in/');
    },
    checkPage: () => {
      if (checkUrl('yt5s.in')) {
        const url = GM_getValue('yt5sUrl');
        if (url) {
          const input = document.querySelector('#txt-url');
          const button = document.querySelector('#btn-submit');
          if (!input || !button) {
            retry();
          } else {
            GM_deleteValue('yt5sUrl');
            yddAdded = true;
            setInput(input, url);
            button.click();
          }
        }
        return true;
      }
      return extraDownloadServices['5smp3'].checkPage();
    },
  },
  ytmp3: {
    title: 'YTMP3',
    download: (isAudioOnly) => {
      GM_setValue('ytmp3Url', document.location.href);
      GM_setValue('ytmp3AudioOnly', isAudioOnly);
      window.open('https://ytmp3.ai/');
    },
    checkPage: () => {
      if (checkUrl('ytmp3.ai')) {
        const url = GM_getValue('ytmp3Url');
        const audioOnly = GM_getValue('ytmp3AudioOnly');
        if (url) {
          const input = document.querySelector('input[id="v"]');
          const button = document.querySelector("button[type='submit']");
          if (!input || !button) {
            retry();
          } else {
            GM_deleteValue('ytmp3Url');
            GM_deleteValue('ytmp3AudioOnly');
            yddAdded = true;
            setInput(input, url);
            // Swaps radio button for audio format
            document.querySelectorAll('button:not(#submit)')[audioOnly ? 0 : 1].id = 'selected';
            document.querySelectorAll('button:not(#submit)')[audioOnly ? 1 : 0].id = '';

            button.click();
          }
        }
        return true;
      }
      return false;
    },
  },
  yt1s: {
    title: 'YT1S',
    download: (isAudioOnly) => {
      GM_setValue('yt1sUrl', document.location.href);
      if (isAudioOnly) extraDownloadServices['5smp3'].download();
      else window.open('https://yt1s.biz/');
    },
    checkPage: () => {
      if (checkUrl('yt1s.biz')) {
        const url = GM_getValue('yt1sUrl');
        if (url) {
          const input = document.querySelector('.index-module--search--fb2ee');
          const button = document.querySelector('.index-module--button--62cd9');
          if (!input || !button) {
            retry();
          } else {
            GM_deleteValue('yt1sUrl');
            yddAdded = true;
            setInput(input, url);
            button.click();
          }
        }
        return true;
      }
      return extraDownloadServices['5smp3'].checkPage();
    },
  },
  cobalt_web: {
    title: 'Cobalt WEB',
    download: (isAudioOnly) => {
      GM_setValue('cobaltUrl', document.location.href);
      GM_setValue('cobaltUrlAudioOnly', isAudioOnly);
      window.open('https://cobalt.meowing.de/');
    },
    checkPage: () => {
      if (checkUrl('cobalt.meowing.de')) {
        const url = GM_getValue('cobaltUrl');
        const audioOnly = GM_getValue('cobaltUrlAudioOnly');
        if (url) {
          const input = document.querySelector('#link-area');
          const button = audioOnly ? document.querySelector('#setting-button-save-downloadMode-audio') : document.querySelector('#setting-button-save-downloadMode-auto');
          const loadingIcon = document.querySelector('#input-icons');
          if (!input || !button || !loadingIcon) {
            retry();
          } else {
            GM_deleteValue('cobaltUrl');
            GM_deleteValue('cobaltUrlAudioOnly');
            yddAdded = true;
            setInput(input, url);
            button.click();
            const observer = new MutationObserver(function () {
              if (loadingIcon.classList.contains('loading') || !loadingIcon) return;
              const dwnButton = document.querySelector('#download-button');
              dwnButton.click();
              const queue = document.querySelector('#processing-popover');
              queue.style.backgroundColor = 'rgba(255, 37, 37, 0.56)';
              const downloadObserver = new MutationObserver(function () {
                const queueItems = queue.querySelectorAll('.processing-item');
                const latestItem = queueItems[0];
                if (!latestItem) return;
                const downloadButton = latestItem.querySelector('button[aria-label="download"]');
                if (latestItem && downloadButton) {
                  queue.style.backgroundColor = 'rgba(40, 90, 62, 0.56)';
                  downloadButton.click();
                  downloadObserver.disconnect();
                }
                return;
              });

              downloadObserver.observe(queue, { childList: true, attributes: true, subtree: true });

              observer.disconnect();
            });
            observer.observe(loadingIcon, { attributes: true, attributeFilter: ['class'] });
          }
        }
        return true;
      }
      return false;
    },
  },
  cobalt_api: {
    get title() {
      const quality = gmc.get('quality') || defaults.quality;
      const vCodec = gmc.get('vCodec') || defaults.vCodec;
      return 'Cobalt: ' + quality + ', ' + vCodec;
    },
    download: (isAudioOnly) => {
      if (dError) return handleCobaltError(dError, isAudioOnly);
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://cobalt-api.kwiatekmiki.com', // Replace with your cobalt instance
        headers: getHeaders(),
        data: JSON.stringify({
          url: encodeURI(document.location.href),
          videoQuality: gmc.get('quality'),
          youtubeVideoCodec: gmc.get('vCodec'),
          audioFormat: gmc.get('aFormat'),
          filenameStyle: gmc.get('filenamePattern'),
          disableMetadata: gmc.get('disableMetadata'),
          downloadMode: isAudioOnly ? 'audio' : `${gmc.get('isAudioMuted') ? 'muted' : 'auto'}`,
        }),
        onload: (response) => {
          const data = response.responseText && JSON.parse(response.responseText);
          if (response.status === 200) {
            if (data.url) window.open(data.url);
            else handleCobaltError('Cobalt is not sending expected response.', isAudioOnly);
          } else if (response.status === 403) {
            handleCobaltError('Cobalt is blocking your request with Bot Protection.', isAudioOnly);
          } else {
            handleCobaltError(`Something went wrong! Try again later. (${data.error.code || data.text || data.statusText || ''})`, isAudioOnly);
          }
        },
        onerror: function (error) {
          handleCobaltError(error.message || error, isAudioOnly);
        },
        ontimeout: function () {
          handleCobaltError('Cobalt is not responding. Please try again later.', isAudioOnly);
        },
      });

      clearTimeout(dTimeout);
      dError = 'Slow down.';
      dTimeout = setTimeout(() => {
        dError = null;
      }, 5000);
    },
  },
};

const extraDownloadServices = {
  '5smp3': {
    title: '5smp3',
    download: () => {
      GM_setValue('5smp3Url', document.location.href);
      window.open('https://5smp3.com/watch');
    },
    checkPage: () => {
      if (checkUrl('5smp3.com')) {
        const url = GM_getValue('5smp3Url');
        if (url) {
          const input = document.querySelector('#inputUrl');
          const button = document.querySelector('.btn-icon.rounded-pill');
          if (!input || !button) {
            retry();
          } else {
            GM_deleteValue('5smp3Url');
            yddAdded = true;
            input.value = url;
            button.click();
          }
        }
        return true;
      }
      return false;
    },
  },
  downsub: {
    title: 'Downsub',
    download: () => {
      window.open(`https://downsub.com/?url=${document.location.href}`);
    },
    checkPage: () => {},
  },
};

GM_registerMenuCommand('Settings', opencfg);

let frame = document.createElement('div');
let checkIndex = 0;
let observerExecuted = false;
const maxChecks = 10;

let gmc = new GM_config({
  id: 'YDD_config',
  title: 'YouTube Direct Downloader (YDD) - Settings',
  css: gmcCSS,
  frame: frame,
  fields: {
    downloadService: {
      section: ['Download method'],
      label: 'Main service:',
      labelPos: 'left',
      type: 'select',
      default: defaults.downloadService,
      options: Object.keys(downloadServices),
    },
    backupService: {
      label: 'Backup service:',
      type: 'select',
      default: defaults.backupService,
      options: [...Object.keys(downloadServices), 'none'],
    },
    quality: {
      section: ['Cobalt API settings'],
      label: 'Quality:',
      labelPos: 'left',
      type: 'select',
      default: defaults.quality,
      options: ['max', '2160', '1440', '1080', '720', '480', '360', '240', '144'],
    },
    vCodec: {
      label: 'Video codec:',
      labelPos: 'left',
      type: 'select',
      default: defaults.vCodec,
      options: ['h264', 'vp9', 'av1'],
    },
    aFormat: {
      label: 'Audio format:',
      type: 'select',
      default: defaults.aFormat,
      options: ['best', 'mp3', 'ogg', 'wav', 'opus'],
    },
    isAudioMuted: {
      label: 'Download videos without audio:',
      type: 'checkbox',
      default: defaults.isAudioMuted,
    },
    disableMetadata: {
      label: 'Download videos without metadata:',
      type: 'checkbox',
      default: defaults.disableMetadata,
    },
    filenamePattern: {
      label: 'Filename pattern:',
      type: 'select',
      default: defaults.filenamePattern,
      options: ['classic', 'pretty', 'basic', 'nerdy'],
    },
    showCobaltError: {
      label: 'Show error messages:',
      type: 'checkbox',
      default: defaults.showCobaltError,
    },
    redirectShorts: {
      section: ['Extra features'],
      label: 'Redirect shorts:',
      labelPos: 'left',
      type: 'checkbox',
      default: defaults.redirectShorts,
    },
    url: {
      section: ['Links'],
      label: 'YDD github page',
      type: 'button',
      click: () => {
        GM_openInTab('https://github.com/FawayTT/userscripts');
      },
    },
    cobaltUrl: {
      label: 'Cobalt github page',
      type: 'button',
      click: () => {
        GM_openInTab('https://github.com/imputnet/cobalt');
      },
    },
    cobaltInstance: {
      label: 'Cobalt instance provider',
      type: 'button',
      click: () => {
        GM_openInTab('kwiatekmiki.com');
      },
    },
  },
  events: {
    save: function () {
      gmc.close();
      deleteButtons();
      modify();
    },
    init: function () {
      if (document.body) return onInit();
      document.addEventListener('DOMContentLoaded', onInit, { once: true });
    },
  },
});

function opencfg() {
  gmc.open();
}

let oldHref = document.location.href;
let yddAdded = false;
let dError;
let dTimeout;

function checkUrl(url) {
  return document.location.href.includes(url);
}

function getHeaders() {
  const userAgent = navigator.userAgent;
  const refererHeader = window.location.href;
  const originHeader = window.location.origin;
  const languages = navigator.languages;
  return {
    'User-Agent': userAgent,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': languages,
    Referer: refererHeader,
    Origin: originHeader,
  };
}

function getYouTubeVideoID(url) {
  if (url.includes('shorts')) {
    const regex = /\/shorts\/([^/?]+)/;
    const match = url.match(regex);
    const id = match ? match[1] : null;
    return id;
  }
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get('v');
}

function handleCobaltError(errorMessage, isAudioOnly) {
  const backupService = gmc.get('backupService') || defaults.backupService;
  const showError = gmc.get('showCobaltError');
  if (!showError && backupService !== 'cobalt_api') {
    download(isAudioOnly, backupService);
    return;
  }
  let alertText = 'Cobalt error: ' + (errorMessage || 'Something went wrong! Try again later.');
  if (backupService !== 'none' && backupService !== 'cobalt_api') {
    alertText += '\n\nYou will be redirected to backup provider ' + backupService + '.';
    alert(alertText);
    download(isAudioOnly, backupService);
  } else alert(alertText);
}

function download(isAudioOnly, downloadService) {
  if (!downloadService) downloadService = gmc.get('downloadService');
  console.log('Attempting download with ' + downloadService);
  if (downloadServices[downloadService]) {
    downloadServices[downloadService].download(isAudioOnly);
  } else {
    console.error('Download service not found: ' + downloadService);
  }
}

function addStyles() {
  const style = document.createElement('style');
  style.innerHTML = yddCSS;
  document.head.appendChild(style);
}

function deleteButtons() {
  const buttons = document.querySelectorAll('#ydd-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    button.remove();
  });
}

function closeOptions(optionsDiv) {
  optionsDiv.classList.remove('ydd-scale-up');
  optionsDiv.classList.add('ydd-scale-down');
  setTimeout(() => {
    optionsDiv.remove();
  }, 400);
}

function showOptions(div) {
  let optionsDiv = document.getElementById('ydd-options-div');
  if (optionsDiv) {
    closeOptions(optionsDiv);
    return;
  }
  optionsDiv = document.createElement('div');
  const audio = document.createElement('div');
  const subtitles = document.createElement('div');
  const settings = document.createElement('div');
  audio.innerText = '🔊 Audio';
  subtitles.innerText = '🖹 Subtitles';
  settings.innerText = '⛭ Settings';
  optionsDiv.id = 'ydd-options-div';
  optionsDiv.appendChild(audio);
  optionsDiv.appendChild(subtitles);
  optionsDiv.appendChild(settings);
  div.appendChild(optionsDiv);
  optionsDiv.style.opacity = undefined;
  optionsDiv.classList.add('ydd-scale-up');
  settings.addEventListener('click', () => {
    opencfg();
    closeOptions(optionsDiv);
  });
  audio.addEventListener('click', () => {
    download(true);
    closeOptions(optionsDiv);
  });
  subtitles.addEventListener('click', () => {
    extraDownloadServices['downsub'].download();
    closeOptions(optionsDiv);
  });
  window.addEventListener('click', (e) => {
    if (!div.contains(e.target)) {
      closeOptions(optionsDiv);
    }
  });
}

function createButton(bar, short) {
  if (!bar) return;
  const div = document.createElement('div');
  const button = document.createElement('button');
  const options = document.createElement('div');
  div.id = 'ydd-button';
  button.id = 'ydd-download';
  options.id = 'ydd-options';
  div.appendChild(button);
  div.appendChild(options);
  if (short) {
    div.style.marginTop = '10px';
    div.style.marginLeft = '0px';
    bar.insertBefore(div, bar.firstChild);
  } else bar.appendChild(div);

  let downloadService = gmc.get('downloadService') || defaults.downloadService;
  if (downloadServices[downloadService] && downloadServices[downloadService].title) {
    button.title = downloadServices[downloadService].title;
  } else {
    button.title = 'YDD';
  }
  button.innerText = '⇩';
  options.innerText = '☰';
  button.addEventListener('click', () => {
    download();
  });
  button.addEventListener('contextmenu', (e) => {
    const downloadService = gmc.get('downloadService') || defaults.downloadService;
    const backupService = gmc.get('backupService') || defaults.backupService;
    if (downloadService !== backupService && backupService !== 'none') download(false, backupService);
  });
  options.addEventListener('click', () => {
    showOptions(div);
  });
}

function checkShort(replace = true) {
  if (checkUrl('youtube.com/shorts')) {
    if (gmc.get('redirectShorts') && replace) window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
    return true;
  } else return false;
}

function setInput(input, value) {
  const inputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  inputSetter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function retry() {
  checkIndex++;
  if (checkIndex > maxChecks) yddAdded = true;
  else yddAdded = false;
}

function checkPage(alternative) {
  const serviceName = alternative ? gmc.get('backupService') : gmc.get('downloadService');
  const service = downloadServices[serviceName];
  if (service && service.checkPage) {
    return service.checkPage();
  }
  return false;
}

function modify() {
  const short = checkShort();
  if (checkPage() || checkPage(true)) return;
  if (!checkUrl('youtube.com/watch') && !short) {
    yddAdded = true;
    return;
  }
  if (short) {
    const bars = document.querySelectorAll('#actions');
    if (bars.length <= 1) {
      yddAdded = false;
      return;
    }
    deleteButtons();
    bars.forEach((bar) => {
      createButton(bar, true);
    });
    yddAdded = true;
  } else {
    const bar = document.getElementById('owner');
    if (!bar) {
      yddAdded = false;
      return;
    }
    deleteButtons();
    createButton(bar, false);
    yddAdded = true;
  }
}

function onInit() {
  addStyles();
  document.body.appendChild(frame);

  const observer = new MutationObserver(function () {
    observerExecuted = true;
    if (!yddAdded) return modify();
    if (oldHref != document.location.href) {
      oldHref = document.location.href;
      yddAdded = false;
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  setTimeout(() => {
    if (!observerExecuted) modify();
  }, 500);
}

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: (string) => string,
    });
  } catch {
    console.warn('Trusted Types: Default policy already exists.');
  }
}
