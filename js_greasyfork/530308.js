// ==UserScript==
// @name         Video Speed Buttons - Modern
// @description  Add speed buttons to any HTML5 <video> element
// @namespace    harubi
// @version      1.3.0
// @run-at       document-end
// @author       harubi
// @grant        none
// @license MIT
//
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/530308/Video%20Speed%20Buttons%20-%20Modern.user.js
// @updateURL https://update.greasyfork.org/scripts/530308/Video%20Speed%20Buttons%20-%20Modern.meta.js
// ==/UserScript==

class VideoSpeedController {
  constructor() {
    // Configuration
    this.config = {
      anchorSelector: '#above-the-fold',
      videoSelector: 'video',
      speeds: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 8, 16],
      speedLabels: ['25%', '50%', '75%', 'Normal', '1.25', '1.5x', '1.75x', '2x', '3x', '4x', '8x', '16x'],
      defaultSpeedIndex: 3, // Index of 1.0 in the speeds array
      labelText: 'Video Speed: ',
      selectedColor: '#FF5500',
      normalColor: 'grey',
      buttonSize: '120%'
    };

    // State
    this.selectedIndex = this.config.defaultSpeedIndex;
    this.buttons = [];

    this.init();
  }

  init() {
    // Find anchor and video elements
    this.anchor = document.querySelector(this.config.anchorSelector);
    this.videoEl = document.querySelector(this.config.videoSelector);

    if (!this.anchor || !this.videoEl) {
      console.error('[VideoSpeedController] Could not find anchor or video element');
      // Try again in 1 second for dynamically loaded content
      setTimeout(() => this.init(), 1000);
      return;
    }

    this.createContainer();
    this.anchor.insertBefore(this.container, this.anchor.firstChild);
    this.setPlaybackRate(this.config.speeds[this.selectedIndex]);
    this.setupKeyboardControls();
    this.setupVideoObserver();
  }

  createContainer() {
    // Create main container
    this.container = document.createElement('div');
    this.container.className = 'vsb-container';
    Object.assign(this.container.style, {
      borderBottom: '1px solid #ccc',
      marginBottom: '10px',
      paddingBottom: '10px'
    });

    // Add label
    const label = document.createElement('span');
    label.textContent = this.config.labelText;
    Object.assign(label.style, {
      marginRight: '10px',
      fontWeight: 'bold',
      fontSize: this.config.buttonSize,
      color: this.config.normalColor
    });
    this.container.appendChild(label);

    // Create speed buttons
    this.config.speeds.forEach((speed, index) => {
      const button = document.createElement('span');

      button.textContent = this.config.speedLabels[index];
      Object.assign(button.style, {
        marginRight: '10px',
        fontWeight: 'bold',
        fontSize: this.config.buttonSize,
        color: index === this.selectedIndex ? this.config.selectedColor : this.config.normalColor,
        cursor: 'pointer'
      });

      button.addEventListener('click', () => this.selectSpeed(index));

      this.buttons.push(button);
      this.container.appendChild(button);
    });
  }

  selectSpeed(index) {
    // Deselect current button
    this.buttons[this.selectedIndex].style.color = this.config.normalColor;

    // Select new button
    this.selectedIndex = index;
    this.buttons[this.selectedIndex].style.color = this.config.selectedColor;

    // Update playback rate
    this.setPlaybackRate(this.config.speeds[this.selectedIndex]);
  }

  setPlaybackRate(rate) {
    if (this.videoEl) {
      this.videoEl.playbackRate = rate;
      this.currentRate = rate;
    }
  }

  isCommentBox(el) {
    const commentBoxSelectors = ['.comment-simplebox-text', 'textarea'];
    return commentBoxSelectors
      .some(selector => el === document.querySelector(selector));
  }

  showHelp() {
    const infobox = document.createElement('pre');
    Object.assign(infobox.style, {
      font: '1em monospace',
      borderTop: '1px solid #ccc',
      marginTop: '10px',
      paddingTop: '10px'
    });

    infobox.innerHTML = `
      Keyboard Controls (click to close)
      [-]  Speed Down
      [+]  Speed Up
      [*]  Reset Speed
      [?]  Show Help
    `;

    infobox.addEventListener('click', () => this.container.removeChild(infobox));
    this.container.appendChild(infobox);
  }

  setupKeyboardControls() {
    this.keydownHandler = (ev) => {
      if (this.isCommentBox(ev.target)) return;

      switch (ev.key) {
        case '-':
          if (this.selectedIndex > 0) {
            this.selectSpeed(this.selectedIndex - 1);
          }
          break;
        case '+':
          if (this.selectedIndex < this.config.speeds.length - 1) {
            this.selectSpeed(this.selectedIndex + 1);
          }
          break;
        case '*':
          this.selectSpeed(this.config.defaultSpeedIndex);
          break;
        case '?':
          this.showHelp();
          break;
      }
    };

    document.body.addEventListener('keydown', this.keydownHandler);
  }

  setupVideoObserver() {
    // Use MutationObserver instead of setInterval
    this.observer = new MutationObserver(() => {
      // Check if video element is still valid
      if (!this.videoEl || !document.body.contains(this.videoEl)) {
        const newVideo = document.querySelector(this.config.videoSelector);
        if (newVideo && newVideo !== this.videoEl) {
          this.videoEl = newVideo;
          if (this.currentRate) {
            this.setPlaybackRate(this.currentRate);
          }
        }
      } else if (this.videoEl && this.videoEl.playbackRate !== this.currentRate) {
        this.setPlaybackRate(this.currentRate);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    document.body.removeEventListener('keydown', this.keydownHandler);

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize when document is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  new VideoSpeedController();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    new VideoSpeedController();
  });
}