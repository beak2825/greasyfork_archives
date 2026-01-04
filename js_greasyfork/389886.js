// ==UserScript==
// @name        Netflix - Audio Downloader
// @description Allows you to download subtitles from Netflix
// @license     MIT
// @version     4.0.11
// @namespace   tithen-firion.github.io
// @include     https://www.netflix.com/*
// @grant       unsafeWindow
// @require     https://cdn.jsdelivr.net/gh/Stuk/jszip@579beb1d45c8d586d8be4411d5b2e48dea018c06/dist/jszip.min.js?version=3.1.5
// @require     https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js@283f438c31776b622670be002caf1986c40ce90c/dist/FileSaver.min.js?version=2018-12-29
// @downloadURL https://update.greasyfork.org/scripts/389886/Netflix%20-%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/389886/Netflix%20-%20Audio%20Downloader.meta.js
// ==/UserScript==

const MAIN_TITLE = '.player-status-main-title, .ellipsize-text>h4, .video-title>h4';
const TRACK_MENU = '#player-menu-track-settings, .audio-subtitle-controller';
const NEXT_EPISODE = '.player-next-episode:not(.player-hidden), .button-nfplayerNextEpisode';

const WEBVTT = 'webvtt-lssdh-ios8';

const DOWNLOAD_MENU = `<lh class="list-header">Netflix Audio Downloader</lh>`;

const SCRIPT_CSS = `.player-timed-text-tracks, .track-list-subtitles{ border-right:1px solid #000 }
.player-timed-text-tracks+.player-timed-text-tracks, .track-list-subtitles+.track-list-subtitles{ border-right:0 }
#player-menu-track-settings .subtitle-downloader-menu li.list-header,
.audio-subtitle-controller .subtitle-downloader-menu lh.list-header{ display:none }`;

let audios = [];
let zip;
let audioCache = {};
let batch = false;

const randomProperty = obj => {
  const keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

// get show name or full name with episode number
const __getTitle = full => {
  if(typeof full === 'undefined')
    full = true;
  const titleElement = document.querySelector(MAIN_TITLE);
  if(titleElement === null)
    return null;
  const title = [titleElement.textContent.replace(/[:*?"<>|\\\/]+/g, '_').replace(/ /g, '.')];
  if(full) {
    const episodeElement = titleElement.nextElementSibling;
    if(episodeElement) {
      const m = episodeElement.textContent.match(/^[^\d]*?(\d+)[^\d]*?(\d+)?[^\d]*?$/);
      if(m && m.length == 3) {
        if(typeof m[2] == 'undefined') // example: Stranger Things season 1
          title.push(`S01E${m[1].padStart(2, '0')}`);
        else
          title.push(`S${m[1].padStart(2, '0')}E${m[2].padStart(2, '0')}`);
      }
    }
    title.push('WEBRip.Netflix');
  }
  return title.join('.');
};
// helper function, periodically checking for the title and resolving promise if found
const _getTitle = (full, resolve) => {
  const title = __getTitle(full);
  if(title === null)
    window.setTimeout(_getTitle, 200, full, resolve);
  else
    resolve(title);
};
// promise of a title
const getTitle = full => new Promise(resolve => {
  _getTitle(full, resolve);
});

const processAudioInfo = async result => {
  const tracks = result.audio_tracks;
  console.log(result)
  const titleP = getTitle();
  audios = tracks.map((audio) => {
		return {
			 fileName: `${titleP}_${audio.language}.${audio.codecName.toLowerCase()}`,
			 codecName: audio.codecName,
			 language: audio.language,
			 languageDescription: audio.languageDescription,
			 url: audio.streams[0].urls[0].url
		 }
	 
  });
  
  console.log(audios);

};

const getMovieID = () => window.location.pathname.split('/').pop();


const _save = async (_zip, title) => {
  const content = await _zip.generateAsync({type:'blob'});
  saveAs(content, title + '.zip');
};

const _download = async _zip => {
  const showTitle = getTitle(false);
  const {titleP, audio} = audioCache[getMovieID()];
  console.log(audio);
  console.log(Object.entries(audio));
  const downloaded = [];
  for(const [language, audio_data] of Object.entries(audio)) {
    const response = await fetch(audio_data.url, {mode: "cors"});
    //const data = await response.json();
    const stream = response.body;
    downloaded.push({language, stream });
  }
  const title = await titleP;

  downloaded.forEach(x => {
    const {language, data} = x;
    _zip.file(`${title}.${language}.mp4`, data);
  });

  return await showTitle;
};

const downloadThis = async () => {
  const _zip = new JSZip();
  const showTitle = await _download(_zip);
  _save(_zip, showTitle);
};

const downloadAll = async () => {
  zip = zip || new JSZip();
  batch = true;
  const showTitle = await _download(zip);
  const nextEp = document.querySelector(NEXT_EPISODE);
  if(nextEp)
    nextEp.click();
  else {
    await _save(zip, showTitle);
    zip = undefined;
    batch = false;
  }
};

const processMessage = e => {
  processAudioInfo(e.detail);
}

const injection = () => {
  const WEBVTT = 'webvtt-lssdh-ios8';

  // hijack JSON.parse and JSON.stringify functions
  ((parse, stringify) => {
    JSON.parse = function (text) {
      const data = parse(text);
      if (data && data.result && data.result.audio_tracks && data.result.movieId) {
        window.dispatchEvent(new CustomEvent('netflix_audio_downloader_data', {detail: data.result}));
      }
      return data;
    };
    JSON.stringify = function (data) {
      if (data && data.params && data.params.profiles) {
        data.params.profiles.unshift(WEBVTT);
      }
      return stringify(data);
    };
  })(JSON.parse, JSON.stringify);
}

window.addEventListener('netflix_audio_downloader_data', processMessage, false);

// inject script
const sc = document.createElement('script');
sc.innerHTML = '(' + injection.toString() + ')()';
document.head.appendChild(sc);
document.head.removeChild(sc);

// add CSS style
const s = document.createElement('style');
s.innerHTML = SCRIPT_CSS;
document.head.appendChild(s);

// add menu when it's not there
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if(node.nodeName.toUpperCase() == 'DIV') {
        let trackMenu = (node.parentNode || node).querySelector(TRACK_MENU);
        if(trackMenu !== null && trackMenu.querySelector('.subtitle-downloader-menu') === null) {
          let ol = document.createElement('ol');
          ol.setAttribute('class', 'subtitle-downloader-menu player-timed-text-tracks track-list track-list-subtitles');
          ol.innerHTML = DOWNLOAD_MENU;
		  
		  for(const audio of audios){
			  
			const li = document.createElement('li');
			li.classList.add('track');
			li.classList.add(audios.language);
			const a = document.createElement('a');
			const text = document.createTextNode('Download ' + audio.languageDescription);
			a.appendChild(text);
			a.setAttribute('href', audio.url);
			li.appendChild(a);
			//li.addEventListener('click', downloadThis);
			ol.appendChild(li);

		  }
		  
		  trackMenu.appendChild(ol);
          
          //ol.querySelector('.download-all').addEventListener('click', downloadAll);
        }
      }
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });