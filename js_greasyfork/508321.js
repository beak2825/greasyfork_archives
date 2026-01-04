// ==UserScript==
// @name               U-NEXT Skip Intro
// @name:zh-CN         U-NEXT 跳过片头
// @name:ja            U-NEXT イントロスキップ
// @namespace          http://tampermonkey.net/
// @match              https://*.unext.jp/*
// @run-at             document-start
// @grant              unsafeWindow
// @version            1.2
// @author             DiruSec
// @license            MIT
// @icon               https://www.google.com/s2/favicons?sz=64&domain=unext.jp
// @description        Add missing skip intro/credit to U-NEXT player
// @description:zh-CN  给 U-NEXT 添加跳过片头/演职人员表的功能
// @description:ja     U-NEXT に「イントロ/クレジットをスキップ」機能を追加
// @downloadURL https://update.greasyfork.org/scripts/508321/U-NEXT%20Skip%20Intro.user.js
// @updateURL https://update.greasyfork.org/scripts/508321/U-NEXT%20Skip%20Intro.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // define default variables
  let introObject = {
    startDuration: null,
    endDuration: null
  }
  let creditObject = {
    startDuration: null,
    endDuration: null
  }
  let moviePartsPositionList = []
  let episodeDuration = null
  let lastPlayTimeThrottle = null
  let playerPanelNode = null
  let hideSkipButtonWithPanel = false
  let moviePartsObjectInitialized = false
  let nextEpisodeObject = {
    titleCode: null,
    episodeCode: null,
    displayNo: null,
    episodeName: null,
    thumbnail: null,
    getPlayUrl() { return this.titleCode && this.episodeCode ? `https://video.unext.jp/play/${this.titleCode}/${this.episodeCode}` : null},
    getDisplayTitle() {return `${this.displayNo}\n${this.episodeName}`},
  }

  function initializeGlobalVar() {
    introObject = {
      startDuration: null,
      endDuration: null
    }
    creditObject = {
      startDuration: null,
      endDuration: null
    }
    moviePartsPositionList = []
    episodeDuration = null
    lastPlayTimeThrottle = null
    playerPanelNode = null
    hideSkipButtonWithPanel = false
    moviePartsObjectInitialized = false
    nextEpisodeObject = {
      titleCode: null,
      episodeCode: null,
      displayNo: null,
      episodeName: null,
      thumbnail: null,
      getPlayUrl() { return this.titleCode && this.episodeCode ? `https://video.unext.jp/play/${this.titleCode}/${this.episodeCode}` : null},
      getDisplayTitle() {return `${this.displayNo}\n${this.episodeName}`},
    }
  }

  function listenReactUrlChange() {
    // Save references to the original methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Utility function to handle URL changes
    function onUrlChange() {
      console.log('React Router URL changed:', window.location.href);

      // You can trigger a custom event or callback here
      const urlChangeEvent = new Event('reactRouterUrlChange');
      window.dispatchEvent(urlChangeEvent);
    }

    // Override pushState
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      onUrlChange(); // Trigger the function on URL change
    };

    // Override replaceState
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      onUrlChange(); // Trigger the function on URL change
    };
  }

  function preProcessRequest(requestOptions) {
    // condition checks
    if (!(requestOptions?.method === 'POST' && requestOptions?.headers['content-type'] === 'application/json' && requestOptions.body)) {
      return requestOptions;
    }

    let requestBody;
    try {
      requestBody = JSON.parse(requestOptions.body);
    } catch (e) {
      console.error('[U-NEXT Skip Intro] invaild graphql request body found');
      return requestOptions;
    }

    return requestOptions

  }

  function replaceGraphql(requestBody) {
    // replaces graphql to add intro/credit parts query
    const searchString = 'commodityCode\n      movieAudioList {\n        audioType\n        __typename\n      }\n      ';
    if (!requestBody.query || !requestBody.query.includes(searchString)) {
      return requestBody;
    }

    const replaceString = `${searchString}moviePartsPositionList {\n        hasRemainingPart\n        to\n        from\n        __typename\n      }\n      `;
    requestBody.query = requestBody.query.replace(searchString, replaceString);
    return requestBody
  }

  async function handleGetNextEpisode(response) {
    try {
      const jsonData = await response.json();
      const data = jsonData.data?.webfront_postPlay;

      if (!data || !data.nextEpisode) {
        console.warn('[U-NEXT Skip Intro] No next episode information found.');
        return null;
      }

      const { titleCode, episodeCode, displayNo, episodeName, thumbnail } = data.nextEpisode;

      return {
        titleCode,
        episodeCode,
        displayNo,
        episodeName,
        thumbnail: thumbnail.standard,
      };
    } catch (e) {
      console.error('[U-NEXT Skip Intro] Error parsing response:', e);
      return null;
    }
  }


  async function handleGetSkipDuration(response) {
    try {
      const jsonData = await response.json();
      const data = jsonData.data?.webfront_playlistUrl?.urlInfo && jsonData.data?.webfront_playlistUrl?.urlInfo[0];

      if (!data || !data.moviePartsPositionList) {
        console.warn('[U-NEXT Skip Intro] No moviePartsPositionList information found.');
        return null;
      }

      return data.moviePartsPositionList || [];
    } catch (e) {
      console.error('[U-NEXT Skip Intro] Error parsing response:', e);
      return [];
    }
  }

  function handleParseSkipDuration() {
    console.log('moviePartsPositionList', moviePartsPositionList)
    if (moviePartsPositionList.length === 0) return;

    // If there's only one part, compare 'from' with video duration/2
    if (moviePartsPositionList.length === 1) {
      const part = moviePartsPositionList[0];
      part.startDuration = Number(part.fromSeconds);
      part.endDuration = Number(part.endSeconds);
      part.duration = part.endDuration - part.startDuration;

      if (part.type === 'OPENING') {
        introObject.startDuration = part.startDuration
        introObject.endDuration = part.endDuration
        part.label = 'Intro';
      } else {
        creditObject.startDuration = part.startDuration
        creditObject.endDuration = part.endDuration
        part.label = 'Credits';

        part.hasRemainingPart === false && (creditObject.hasRemainingPart = false);
      }
    } else {
      // Logic for more than one part
      let introPart = moviePartsPositionList[0];
      let creditsPart = moviePartsPositionList[0];

      moviePartsPositionList.forEach(part => {
        part.startDuration = Number(part.fromSeconds);
        part.endDuration = Number(part.endSeconds);
        part.duration = part.endDuration - part.startDuration;

        // Find the earliest 'from' value for the intro
        if (part.startDuration < introPart.startDuration) {
          introPart = part;
        }

        // Find the latest 'to' value for the credits
        if (part.endDuration > creditsPart.endDuration) {
          creditsPart = part;
        }
      });

      introObject.startDuration = introPart.startDuration
      creditObject.startDuration = creditsPart.startDuration
      introObject.endDuration = introPart.endDuration
      creditObject.endDuration = creditsPart.endDuration
      creditObject.hasRemainingPart = creditsPart.hasRemainingPart
      // Assign labels
      introPart.label = 'Intro';
      creditsPart.label = 'Credits';
    }
  }

  // Save the original fetch function
  const originalFetch = window.fetch;

  // Override the fetch function
  const newFetch = async function (...args) {
    const url = args[0];

    // Check if the URL matches the pattern
    const regex = /^https:\/\/cc\.unext\.jp\/\?/;
    const getPlaylistUrlStr = 'operationName=cosmo_getPlaylistUrl';
    const getPostPlayStr = 'operationName=cosmo_getPostPlay';

    if (regex.test(url)) {

      //let requestOptions = args[1];
      //args[1] = preProcessRequest(requestOptions)

      // need to get something from response
      const response = await originalFetch(...args);
      const responseClone = response.clone()

      try {
        //const requestBody = JSON.parse(requestOptions.body);

        if (url.indexOf(getPlaylistUrlStr) !== -1) {
          let skipDuration = await handleGetSkipDuration(responseClone);

          moviePartsPositionList = skipDuration
          moviePartsObjectInitialized = true
        } else if (url.indexOf(getPostPlayStr) !== -1) {
          let nextEpisode = await handleGetNextEpisode(responseClone);
          nextEpisode && (
            nextEpisodeObject.titleCode = nextEpisode.titleCode,
            nextEpisodeObject.episodeCode = nextEpisode.episodeCode,
            nextEpisodeObject.displayNo = nextEpisode.displayNo,
            nextEpisodeObject.episodeName = nextEpisode.episodeName,
            nextEpisodeObject.thumbnail = nextEpisode.thumbnail.standard
          )
        }
      } catch (e) {
        console.error('[U-NEXT Skip Intro] Error handling operationName:', e);
      }

      // Return original Response object with no modification
      return response;
    }

    // If the URL doesn't match, return the original fetch call
    return originalFetch(...args);
  };

  Object.defineProperty(unsafeWindow, 'fetch', { value: newFetch, enumerable: false, writable: true });

// Function to create a button dynamically
function createSkipButton(text, onClick) {
  const isPanelDisplayed = window.getComputedStyle(document.querySelector('button[data-testid="player-header-back"]').parentElement.parentElement, null).getPropertyValue('opacity') === '1'
  const button = document.createElement('button');
  button.id = 'introskip-btn-skip';
  button.innerText = text;
  button.style.position = 'absolute';
  button.style.bottom = isPanelDisplayed? '9.6rem': '3rem';
  button.style.right = '2rem';
  button.style.zIndex = '1000';
  button.addEventListener('click', onClick);
  createButtonStyle();
  return button;
}

function createButtonStyle() {
  const style = document.createElement('style');
  style.innerHTML = `
      #introskip-btn-skip {
        background-color: #0F0F0FFF;
        color: #EEE;
        border: solid;
        border-color: #666;
        border-width: .1rem;
        border-radius: .2rem;
        cursor: pointer;
        padding: 1rem 2rem;
        opacity: 1;
        transition: all 0.2s ease;
      }

      #introskip-btn-skip:hover {
        background-color: #0F0F0F99;
        transform: scale(1.05);
      }

      #introskip-btn-skip.hide {
        opacity: 0;
        display: none;
      }
  `
  document.head.appendChild(style)
}

function removeButtonStyle() {
  const styleSheets = document.head.querySelectorAll('style');

  styleSheets.forEach(styleSheet => {
    if (styleSheet.innerHTML.includes('#introskip-btn-skip')) {
      styleSheet.remove();
    }
  });
}

function setHideSkipButtonWithPanel() {
  hideSkipButtonWithPanel = true;
  playerPanelNode = document.querySelector('button[data-testid="player-header-back"]').parentElement.parentElement;
  let isDisplayed = window.getComputedStyle(playerPanelNode, null).getPropertyValue('opacity') === '1'
  document.querySelector('#introskip-btn-skip').className = hideSkipButtonWithPanel&&!isDisplayed?'hide':''
}

// Function to add event listeners to the video
function addSkipButtonsToVideo(video) {
  let skipIntroButton = null;
  let skipCreditsButton = null;

  const callback = (mutationsList, observer) => {
    mutationsList.forEach((mutationObj) => {
      if (mutationObj.attributeName === 'class') {
        // for mutationsObserver, when opacity starts change, value will be the last moment before changes.
        let isDisplayed = window.getComputedStyle(playerPanelNode, null).getPropertyValue('opacity') === '0'
        let skipBtnDom = document.querySelector('#introskip-btn-skip')
        skipBtnDom && (skipBtnDom.className = hideSkipButtonWithPanel&&!isDisplayed?'hide':'')
        skipBtnDom && (skipBtnDom.style.bottom = isDisplayed?'9.6rem':'3rem')
      }
    })
  };

  const observer = new MutationObserver(callback);

  const config = { attributes: true, childList: false, subtree: false };

  const skipIntroPress = event => {
    event.code === 'KeyS' && (video.currentTime = introObject.endDuration);
  }
  const skipCreditPress = event => {
    event.code === 'KeyS' && (video.currentTime = creditObject.endDuration);
  }
  const nextEpisodePress = event => {
    event.code === 'KeyS' && (window.location.href = nextEpisodeObject.getPlayUrl());
  }
  // Get the episode duration
  video.ondurationchange = function () {
    episodeDuration = video.duration;
    console.log(`Episode Duration: ${episodeDuration}`);
  };

  // Listen to ontimeupdate event
  video.ontimeupdate = function () {
    const currentTime = video.currentTime;

    // Skip Intro Button
    if (currentTime >= introObject.startDuration && currentTime <= introObject.endDuration) {
      if (introObject.endDuration - currentTime >= 5 && !lastPlayTimeThrottle) {
        lastPlayTimeThrottle = setTimeout(setHideSkipButtonWithPanel, 5000)
      }
      if (!skipIntroButton) {
        playerPanelNode = document.querySelector('button[data-testid="player-header-back"]').parentElement.parentElement;

        skipIntroButton = createSkipButton('SKIP INTRO', ()=> {
          video.currentTime = introObject.endDuration;
        });
        window.addEventListener('keyup', skipIntroPress)

        document.querySelector('#videoFullScreenWrapper').appendChild(skipIntroButton);

        if (playerPanelNode) {
          observer.observe(playerPanelNode, config);
        } else {
          console.error("Target node not found.");
        }
      }
    } else if (skipIntroButton) {
      try {
        document.querySelector('#videoFullScreenWrapper').removeChild(skipIntroButton);
      } catch (e) {
        console.error('[U-NEXT Skip Intro] Cannot remove skip button. Page content maybe changed?', e);
      }
      observer.disconnect()
      window.removeEventListener('keyup', skipIntroPress)
      removeButtonStyle();
      clearTimeout(lastPlayTimeThrottle);
      lastPlayTimeThrottle = null;
      skipIntroButton = null;
    }

    // Skip Credits or Next Episode Button
    if (currentTime >= creditObject.startDuration && currentTime <= creditObject.endDuration) {
      const timeDifference = episodeDuration - creditObject.endDuration;
      playerPanelNode = document.querySelector('button[data-testid="player-header-back"]').parentElement.parentElement;

      if (creditObject.endDuration - currentTime >= 5 && !lastPlayTimeThrottle) {
        lastPlayTimeThrottle = setTimeout(setHideSkipButtonWithPanel, 5000)
      }

      // Show "Next Episode" if the time difference is <= 10 seconds

      if (creditObject.hasRemainingPart === false) {
        if (!skipCreditsButton || skipCreditsButton.innerText !== 'NEXT EPISODE') {
          if (skipCreditsButton) document.querySelector('#videoFullScreenWrapper').removeChild(skipCreditsButton);
          skipCreditsButton = createSkipButton('NEXT EPISODE', () => {
            window.location.href = nextEpisodeObject.getPlayUrl();
          });
          document.querySelector('#videoFullScreenWrapper').appendChild(skipCreditsButton);
          window.addEventListener('keyup', nextEpisodePress)

          if (playerPanelNode) {
            observer.observe(playerPanelNode, config);
          } else {
            console.error("Target node not found.");
          }
        }
      }
      // Otherwise, show "Skip Credits"
      else {
        if (!skipCreditsButton || skipCreditsButton.innerText !== 'SKIP CREDITS') {
          if (skipCreditsButton) document.querySelector('#videoFullScreenWrapper').removeChild(skipCreditsButton);
          skipCreditsButton = createSkipButton('SKIP CREDITS', () => {
            video.currentTime = creditObject.endDuration;
          });
          document.querySelector('#videoFullScreenWrapper').appendChild(skipCreditsButton);
          window.addEventListener('keyup', skipCreditPress)

          if (playerPanelNode) {
            observer.observe(playerPanelNode, config);
          } else {
            console.error("Target node not found.");
          }
        }
      }
    } else if (skipCreditsButton) {
      try {
        document.querySelector('#videoFullScreenWrapper').removeChild(skipCreditsButton);
      } catch (e) {
        console.error('[U-NEXT Skip Intro] Cannot remove skip button. Page content maybe changed?', e);
      }
      observer.disconnect();
      window.removeEventListener('keyup', skipCreditPress)
      window.removeEventListener('keyup', nextEpisodePress)
      removeButtonStyle();
      clearTimeout(lastPlayTimeThrottle);
      lastPlayTimeThrottle = null;
      skipCreditsButton = null;
    }
  };
}

window.addEventListener('reactRouterUrlChange', () => {
  document.querySelector('#introskip-btn-skip')?.remove();
  removeButtonStyle();
  clearTimeout();
  initializeGlobalVar();
  setTimeout(waitForVideoElement, 1000);
});

// Function to wait until the video element is available
function waitForVideoElement() {
  const video = document.getElementsByTagName("video")[0];
  if (video && moviePartsObjectInitialized) {
    handleParseSkipDuration()
    console.log(introObject, creditObject)
    addSkipButtonsToVideo(video);
  } else {
    // Retry after 500ms if video element is not found
    setTimeout(waitForVideoElement, 500);
  }
}

listenReactUrlChange();
waitForVideoElement();

})();