// ==UserScript==
// @name         Video Speed
// @version      0.1
// @description  Video Speed Adjustment
// @author       You
// @match        *://*/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/4136
// @downloadURL https://update.greasyfork.org/scripts/36317/Video%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/36317/Video%20Speed.meta.js
// ==/UserScript==

/**
 * @filedescription This is a simple script for adding HTML5 speed controls to
 * video elements.
 * @author Benedict Chen (benedict@benedictchen.com)
 */
GM_addStyle (`
.sophis-video-control {
  position: absolute;
  z-index: 9999999;
}

.sophis-video-control::shadow .sophis-bg {
  transition: opacity 0.25s;
  opacity: 0.3;
  -webkit-user-select: none;
  font: 12px/1em "Helvetica Neue Light", Helvetica, Arial, sans-serif;
  vertical-align: middle;
  background: black;
  color: white;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 10px;
  position: relative;
}

.sophis-video-control:hover::shadow .sophis-bg {
  opacity: 1;
}

.sophis-video-control::shadow .sophis-btn {
  display: inline-block;
  height: 20px;
  width: 20px;
  color: white;
  background: black;
  border: 1px solid white;
  border-radius: 1000px;
  outline: none;
  -webkit-transition: all 0.2s;
  line-height: 20px;
  padding: 0;
  vertical-align: center;
  cursor: pointer;
}

.sophis-video-control::shadow .sophis-btn:active {
  border: 1px solid lightblue;
  color: lightblue;
}

.sophis-video-control::shadow .speed-indicator {
  color: white;
  padding: 0 10px;
  cursor: default;
}

.sophis-video-control::shadow .sophis-btn.sophis-close-button {
  position: absolute;
  border-radius: none;
  background: none;
  bottom: -20px;
  left: calc(50% - 15px);
  width: 30px;
  text-align: center;
  margin: auto;
  display: block;
  color: #ccc;
  font-size: 10px;
  font-weight: light;
  border: none;
}
`);
var sophis = sophis || {};

var increment = 0.1;
var keyCombo = 'udar';

/**
 * Keyboard character mappings from their numeric values.
 * @type {Object.<String:Number>}
 * @enum
 */
var KeyCodes = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  PAGEUP: 33,
  PAGEDOWN: 34
};

/**
 * A mapping of actions to keyboard character values.
 * @type {Object.<String>}
 * @enum
 */
var KeyMapping = {
  DECREASE_SPEED: 'A',
  INCREASE_SPEED: 'S'
};

/**
 * Controls an HTML video with playback speed.
 * @param {Element} targetEl The target element to inject a video control into.
 */
sophis.VideoControl = function(targetEl) {
  /**
   * The html body that stores the controls.
   * @private {Element}
   */
  this.el_ = null;

  /**
   * The shadow container that stores the controls.
   * @private {Element}
   */
  this.bgEl_ = null;

  /**
   * The video element.
   * @private {Element}
   */
  this.videoEl_ = targetEl;

  /**
   * @private {Element}
   */
  this.speedIndicator_ = null;

  /**
   * The button that destroys the component
   * @private {Element}
   */
  this.closeButton_ = null;

  this.createDom();
  this.enterDocument();
};

/** @const */
sophis.VideoControl.CLASS_NAME = 'sophis-video-control';


/**
 * Creates the HTML body of the controls.
 */
sophis.VideoControl.prototype.createDom = function() {
  var container = document.createElement('div');
  var shadow = container.attachShadow({"mode":"closed"});

  var bg = document.createElement('div');
  var speedIndicator = document.createElement('span');
  var minusButton = document.createElement('button');
  var plusButton = document.createElement('button');
  var closeButton = document.createElement('a');
  shadow.appendChild(bg);
  bg.appendChild(minusButton);
  bg.appendChild(speedIndicator);
  bg.appendChild(plusButton);
  bg.appendChild(closeButton);
  bg.classList.add('sophis-bg');
  speedIndicator.classList.add('speed-indicator');
  minusButton.textContent = '-';
  minusButton.classList.add('sophis-btn', 'decrease');
  plusButton.textContent = '+';
  plusButton.classList.add('sophis-btn', 'increase');
  closeButton.classList.add('sophis-btn', 'sophis-close-button');
  closeButton.textContent = 'close';
  this.videoEl_.parentElement.insertBefore(container, this.videoEl_);
  this.videoEl_.classList.add('sophis-video');
  this.el_ = container;
  this.el_.classList.add(sophis.VideoControl.CLASS_NAME);
  this.bgEl_ = bg;
  this.speedIndicator_ = speedIndicator;
  this.minusButton_ = minusButton;
  this.plusButton_ = plusButton;
  this.closeButton_ = closeButton;
  // Vimeo iframe hack.  They are intercepting all our events with a hidden
  // element.
  if (this.isLocationVimeo_()) {
    var clickInterceptingScum = document.querySelector('.player .target');
    if (clickInterceptingScum) {
      clickInterceptingScum.parentElement.removeChild(clickInterceptingScum);
    }
  }
};


/**
 * Post-dom creation actions such as adding event listeners.
 */
sophis.VideoControl.prototype.enterDocument = function() {
  var self = this;
  var clickHandler = this.handleClick_.bind(this);
  var dblClickHandler = this.handleDblClick_.bind(this);
  var keydownHandler = this.handleKeyDown_.bind(this);
  var keyPressHandler = this.handleKeyPress_.bind(this);
  this.bgEl_.addEventListener('click', clickHandler, true);
  this.bgEl_.addEventListener('dblclick', dblClickHandler, true);
  document.body.addEventListener('keydown', keydownHandler, true);
  document.body.addEventListener('keypress', keyPressHandler, true);
  // Set speed indicator to correct amount.
  this.speedIndicator_.textContent = this.getSpeed();
  this.videoEl_.addEventListener('ratechange', function() {
    self.speedIndicator_.textContent = self.getSpeed();
  });
};

/**
 * Increases the current video's playback rate.
 */
sophis.VideoControl.prototype.decreaseSpeed = function () {
  this.videoEl_.playbackRate -= increment;
};

/**
 * Decreases the current video's playback rate.
 */
sophis.VideoControl.prototype.increaseSpeed = function () {
  this.videoEl_.playbackRate += increment;
};

/**
 * Determines if the current video element is playing.
 * @return {Boolean} Whether or not the video is playing.
 * @private
 */
sophis.VideoControl.prototype.isPlaying_ = function() {
  var videoEl = this.videoEl_;
  return videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended;
};

sophis.VideoControl.prototype.hasFocus = function() {
  var activeEl = document.activeElement;
  if (activeEl.nodeName === 'BODY') {
    return false;
  }
  return (activeEl && activeEl.querySelector('video, .sophis-video-control'));
};

/**
 * Handles the native `keyPress` events.
 * @param {Event} e The native key press event.
 */
sophis.VideoControl.prototype.handleKeyPress_ = function(e) {
  if (!this.isPlaying_() || !this.hasFocus() || !e.keyCode) {
    return;
  }
  var characterValue = String.fromCharCode(e.keyCode).toUpperCase();
  if (characterValue) {
    switch(characterValue) {
      case KeyMapping.INCREASE_SPEED:
        this.increaseSpeed();
        break;
      case KeyMapping.DECREASE_SPEED:
        this.decreaseSpeed();
        break;
    }
  }
}

/**
 * Handles native `keyDown` events.
 * @param {Event} e The native keyDown event.
 * @private
 */
sophis.VideoControl.prototype.handleKeyDown_ = function(e) {
  if (!this.isPlaying_() || !this.hasFocus()) {
    return;
  }
  var keyCode = e.keyCode;
  if (keyCode && keyCombo === 'pgud') {
    switch (keyCode) {
      case KeyCodes.PAGEDOWN:
        this.decreaseSpeed();
      break;
      case KeyCodes.PAGEUP:
        this.increaseSpeed();
      break;
      default:
        this.videoEl_.focus();
        return false;
    }
  }
  else if (keyCode && keyCombo === 'lrar') {
    switch (keyCode) {
      case KeyCodes.LEFT:
        this.decreaseSpeed();
      break;
      case KeyCodes.RIGHT:
        this.increaseSpeed();
      break;
      default:
        this.videoEl_.focus();
        return false;
    }
  }
  else if (keyCode && keyCombo === 'udar') {
    switch (keyCode) {
      case KeyCodes.DOWN:
        this.decreaseSpeed();
      break;
      case KeyCodes.UP:
        this.increaseSpeed();
      break;
      default:
        this.videoEl_.focus();
        return false;
    }
  }
};

/**
 * Handles a user clicking on the video controls.
 * @param {Event} e The native click event.
 * @private
 */
sophis.VideoControl.prototype.handleClick_ = function(e) {
  if (!e.target.classList.contains('sophis-btn')) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  if (e.target === this.minusButton_) {
    this.decreaseSpeed();
  } else if (e.target === this.plusButton_) {
    this.increaseSpeed();
  } else if (e.target === this.closeButton_) {
    this.dispose();
  }
  // Redundant if we listen for 'ratechange', but do it anyway
  this.speedIndicator_.textContent = this.getSpeed();
  return false;
};

/**
 * Handles a double-click event on the video controls.
 * @param {Event} e The native click event.
 * @private
 */
sophis.VideoControl.prototype.handleDblClick_ = function(e) {
  if (!e.target.classList.contains('sophis-btn')) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Determines whether or not the current page is being executed within
 * the boundaries of an iframe.
 * @return {Boolean} Whether or not the current page is an iframe.
 * @private
 */
sophis.VideoControl.prototype.isEmbeddedInIframe_ = function() {
  return window.self !== window.top;
};

/**
 * Determines whether we are coming from a Vimeo URL.
 * @return {Boolean} Whether or not the current window is from Vimeo.
 * @private
 */
sophis.VideoControl.prototype.isLocationVimeo_ = function() {
  return !!window.location.href.match('vimeo');
};

/**
 * Gets the current speed of the player.
 * @return {String} The playback speed/rate of the video.
 */
sophis.VideoControl.prototype.getSpeed = function() {
  return parseFloat(this.videoEl_.playbackRate).toFixed(2);
};

/**
 * Destroys and removes the component from page.
 */
sophis.VideoControl.prototype.dispose = function() {
  var clickHandler = this.handleClick_.bind(this);
  var dblClickHandler = this.handleDblClick_.bind(this);
  this.bgEl_.removeEventListener('click', clickHandler);
  this.bgEl_.removeEventListener('dblclick', dblClickHandler);
  this.el_.parentNode.removeChild(this.el_);
};

/**
 * Finds all video elements that have no video control yet and
 * adds a new one.
 */
sophis.VideoControl.insertAll = function () {
  var videoTags = document.getElementsByTagName('video');
  Array.prototype.forEach.call(videoTags, function(videoTag) {
    if (!videoTag.getAttribute('sophis-video-control')) {
      videoTag.setAttribute('sophis-video-control', true);
      new sophis.VideoControl(videoTag);
    }
  });
};

// Listen for new video elements and inject into it.
document.addEventListener('DOMNodeInserted', function(event) {
  var node = event.target || null;
  if (node && node.nodeName === 'VIDEO') {
    new sophis.VideoControl(node);
  }
});

sophis.VideoControl.insertAll();
// Ghetto polling for new video elements being added to the page.
// Necessary for Tuts+ and many non-standard implementations.
setInterval(sophis.VideoControl.insertAll, 1000);

