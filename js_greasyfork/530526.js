// ==UserScript==
// @name        ProgressUI Module
// @namespace   Violentmonkey Scripts
// @description Reusable progress UI module
// @version     0.7
// @author      maanimis
// @run-at      document-idle
// @license     MIT
// ==/UserScript==

(function () {
'use strict';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

const DEFAULT_THEMES = {
  light: {
    background: '#f8f8f8',
    text: '#333333',
    border: '#e0e0e0',
    progressBg: '#e0e0e0',
    progressFill: '#4CAF50',
    shadow: 'rgba(0,0,0,0.2)'
  },
  dark: {
    background: '#2a2a2a',
    text: '#ffffff',
    border: '#444444',
    progressBg: '#444444',
    progressFill: '#4CAF50',
    shadow: 'rgba(0,0,0,0.5)'
  }
};
class ProgressUI {
  constructor(config = {}) {
    this.config = this.validateConfig(config);
    this.elements = this.createUIElements();
    this.applyStyles();
    this.attachToDOM();
  }
  update(message, percent) {
    if (!this.isMounted) return false;
    if (message) {
      this.elements.status.textContent = message;
    }
    if (typeof percent === 'number') {
      const clamped = Math.max(0, Math.min(100, percent));
      this.elements.progressBar.style.width = `${clamped}%`;
      this.elements.percentText.textContent = `${Math.round(clamped)}%`;
    }
    return true;
  }
  scheduleCleanup(delay = 3000, fade = true) {
    window.clearTimeout(this.removalTimeout);
    this.removalTimeout = window.setTimeout(() => this.remove(fade), delay);
  }
  remove(fade = true) {
    if (!this.isMounted) return;
    if (fade) {
      this.elements.container.style.opacity = '0';
      window.setTimeout(() => this.detachFromDOM(), 300);
    } else {
      this.detachFromDOM();
    }
  }
  get isMounted() {
    return document.body.contains(this.elements.container);
  }
  static showQuick(message, config = {}) {
    var _config$closable, _config$duration, _config$percent;
    const instance = new ProgressUI(_extends({}, config, {
      closable: (_config$closable = config.closable) != null ? _config$closable : false,
      duration: (_config$duration = config.duration) != null ? _config$duration : 3000
    }));
    instance.update(message, (_config$percent = config.percent) != null ? _config$percent : 100);
    instance.scheduleCleanup(config.duration, true);
    return instance;
  }
  validateConfig(config) {
    var _config$position, _config$width, _config$theme, _config$title, _config$closable2, _config$colors, _config$duration2;
    return {
      position: (_config$position = config.position) != null ? _config$position : 'top-right',
      width: (_config$width = config.width) != null ? _config$width : '300px',
      theme: (_config$theme = config.theme) != null ? _config$theme : 'light',
      title: (_config$title = config.title) != null ? _config$title : '',
      closable: (_config$closable2 = config.closable) != null ? _config$closable2 : true,
      colors: (_config$colors = config.colors) != null ? _config$colors : {},
      duration: (_config$duration2 = config.duration) != null ? _config$duration2 : 3000
    };
  }
  createUIElements() {
    const container = document.createElement('div');
    const status = document.createElement('div');
    const progressBar = document.createElement('div');
    const percentText = document.createElement('div');
    const progressBarContainer = document.createElement('div');

    // Set up the DOM structure
    progressBarContainer.appendChild(progressBar);
    container.appendChild(status);
    container.appendChild(progressBarContainer);
    container.appendChild(percentText);

    // Add classes for easier styling (optional)
    container.classList.add('progress-ui-container');
    status.classList.add('progress-ui-status');
    progressBarContainer.classList.add('progress-ui-bar-container');
    progressBar.classList.add('progress-ui-bar');
    percentText.classList.add('progress-ui-percent');
    return {
      container,
      status,
      progressBar,
      percentText
    };
  }
  applyStyles() {
    const colors = this.getThemeColors();

    // Container styles
    Object.assign(this.elements.container.style, _extends({
      position: 'fixed',
      zIndex: '9999'
    }, this.getPositionStyles(), {
      backgroundColor: colors.background,
      color: colors.text,
      padding: '15px',
      borderRadius: '5px',
      boxShadow: `0 0 10px ${colors.shadow}`,
      width: this.config.width,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      transition: 'opacity 0.3s ease'
    }));

    // Status element
    Object.assign(this.elements.status.style, {
      marginBottom: '10px',
      fontSize: '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    });

    // Progress bar container
    Object.assign(this.elements.progressBar.parentElement.style, {
      width: '100%',
      backgroundColor: colors.progressBg,
      borderRadius: '4px',
      height: '10px',
      overflow: 'hidden'
    });

    // Progress bar
    Object.assign(this.elements.progressBar.style, {
      height: '100%',
      width: '0%',
      backgroundColor: colors.progressFill,
      transition: 'width 0.3s'
    });

    // Percentage text
    Object.assign(this.elements.percentText.style, {
      textAlign: 'right',
      marginTop: '5px',
      fontSize: '12px',
      fontWeight: '600'
    });
    this.addOptionalElements();
  }
  getPositionStyles() {
    const positionStyles = {};
    switch (this.config.position) {
      case 'top-left':
        positionStyles.top = '20px';
        positionStyles.left = '20px';
        break;
      case 'top-center':
        positionStyles.top = '20px';
        positionStyles.left = '50%';
        positionStyles.transform = 'translateX(-50%)';
        break;
      case 'bottom-left':
        positionStyles.bottom = '20px';
        positionStyles.left = '20px';
        break;
      case 'bottom-right':
        positionStyles.bottom = '20px';
        positionStyles.right = '20px';
        break;
      case 'bottom-center':
        positionStyles.bottom = '20px';
        positionStyles.left = '50%';
        positionStyles.transform = 'translateX(-50%)';
        break;
      case 'center':
        positionStyles.top = '50%';
        positionStyles.left = '50%';
        positionStyles.transform = 'translate(-50%, -50%)';
        break;
      default:
        // top-right
        positionStyles.top = '20px';
        positionStyles.right = '20px';
    }
    return positionStyles;
  }
  getThemeColors() {
    const baseTheme = this.config.theme === 'custom' ? DEFAULT_THEMES.light : DEFAULT_THEMES[this.config.theme];
    return _extends({}, baseTheme, this.config.colors);
  }
  addOptionalElements() {
    if (this.config.title) {
      const title = document.createElement('div');
      title.textContent = this.config.title;
      Object.assign(title.style, {
        marginBottom: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        paddingRight: '15px'
      });
      this.elements.container.prepend(title);
    }
    if (this.config.closable) {
      const closeButton = document.createElement('div');
      closeButton.innerHTML = '×';
      Object.assign(closeButton.style, {
        position: 'absolute',
        top: '5px',
        right: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        opacity: '0.6'
      });
      closeButton.addEventListener('click', () => this.remove());
      this.elements.container.appendChild(closeButton);
    }
  }
  attachToDOM() {
    document.querySelectorAll('.progress-ui-container').forEach(el => el.remove());
    document.body.appendChild(this.elements.container);
  }
  detachFromDOM() {
    if (this.isMounted) {
      document.body.removeChild(this.elements.container);
    }
  }
}
const globalContext = window;
globalContext.ProgressUI = ProgressUI;

// const globalContext =
//   typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

})();
