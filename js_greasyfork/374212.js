// ==UserScript==
// @name Convenient Cam4.com
// @namespace CAM4
// @description Some tweaks to make cam4.com a bit more convenient.
// @version 4
// @include https://www.cam4.com/*
// @match https://www.cam4.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374212/Convenient%20Cam4com.user.js
// @updateURL https://update.greasyfork.org/scripts/374212/Convenient%20Cam4com.meta.js
// ==/UserScript==
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var _isFullScreen = false;
var _htmlTag, _cam4Player, _originalCam4PlayerStyle = null;

var observer = new MutationObserver(function (mutations, observer) {
  mutations.forEach(mutation => {
    if (mutation.target.id === 'Cam4DialogContainer') {
      document.getElementById('Cam4DialogContainer').style['display'] = 'none';
    }
    if (mutation.target.id === 'videoBannerMidrollAdWrapper') {
      document.getElementById('videoBannerMidrollAdWrapper').style['display'] = 'none';
    }
  });
});

function initialize() {
  try {
    _htmlTag = document.getElementsByTagName('html')[0];
    
    _cam4Player = document.getElementById('Cam4HLSPlayer') ? document.getElementById('Cam4HLSPlayer') : document.getElementById('Cam4VChat');
    _cam4Player.addEventListener('dblclick', toggleFullScreen, false);
    _originalCam4PlayerStyle = _cam4Player.style;
    
    document.getElementsByClassName('completeFullscreen')[0].addEventListener('click', toggleFullScreen, false);
    document.addEventListener('keydown', catchKeyDown, false);
    
    observer.observe(document, {
      subtree: true,
      attributes: true
    });

    HLS.disconnect = null;
  } catch (exception) {
    console.warn('initialize.exception', exception);
  }
};

function catchKeyDown(e) {
  if (e.keyCode == 13 && e.altKey) {
    toggleFullScreen();
  }
}

function toggleFullScreen() {
  _isFullScreen = !_isFullScreen;
  _htmlTag.style['overflow'] = _isFullScreen ? 'hidden' : 'auto';
  if (_isFullScreen) {
    _cam4Player.style['position'] = 'fixed';
    _cam4Player.style['top'] = 0;
    _cam4Player.style['left'] = 0;
    _cam4Player.style['height'] = '100vh';
    _cam4Player.style['width'] = '100vw';
    _cam4Player.style['z-index'] = 99999;
  } else {
    _cam4Player.style = _originalCam4PlayerStyle;
  }
}
window.onload = initialize;
