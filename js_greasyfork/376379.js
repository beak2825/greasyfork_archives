// ==UserScript==
// @author      LD
// @version     1.0
// @name        xHamster Plus
// @description A kinder xHamster. Because you're worth it.
// @namespace   LD
// @date        2018-08-08
// @include     *xhamster.com/*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        https://static-cl.xhcdn.com/xh-tpl3/images/favicon/apple-touch-icon.png
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376379/xHamster%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/376379/xHamster%20Plus.meta.js
// ==/UserScript==

(() => {
  /* Available options */
  const options = {
    autoresizePlayer:
      JSON.parse(localStorage.getItem('plus_autoresizePlayer')) || false
  }
  /* Empty tag function, for VS Code syntax highlight for CSS in literals */
  const css = (strings, ...values) => {
    /* Re-assemble input string and return untouched */
    return strings.reduce((output, string, index) => {
      return `${output}${string}${values[index] || ''}`;
    }, '');
  };
  
  /* Styles - Shared between all "Plus" userscripts */
  
  const sharedStyles = css`
    /* Our own elements */

    .plus-buttons {
      background: rgba(67, 67, 67, 0.85);
      box-shadow: 0px 0px 12px rgba(20, 111, 223, 0.85);
      font-size: 12px;
      position: fixed;
      bottom: 10px;
      padding: 10px 22px 8px 24px;
      right: 0;
      z-index: 100;
      transition: all 0.3s ease;

      /* Negative margin-right calculated later based on width of buttons */
    }

    .plus-buttons:hover {
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    }

    .plus-buttons .plus-button {
      margin: 10px 0;
      padding: 6px 15px;
      border-radius: 4px;
      font-weight: 700;
      display: block;
      position: relative;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      border: none;
      text-decoration: none;
    }

    .plus-buttons a.plus-button {
      background: rgb(221, 221, 221);
      color: rgb(51, 51, 51);
    }

    .plus-buttons a.plus-button:hover {
      background: rgb(187, 187, 187);
      color: rgb(51, 51, 51);
    }

    .plus-buttons a.plus-button.plus-button-isOn {
      background: rgb(20, 111, 223);
      color: rgb(255, 255, 255);
    }

    .plus-buttons a.plus-button.plus-button-isOn:hover {
      background: rgb(0, 91, 203);
      color: rgb(255, 255, 255);
    }

    .plus-hidden {
      display: none !important;
    }
  `;
  
  /* Styles - Color theme */
  
  const themeStyles = css`
    .plus-buttons {
      box-shadow: 0px 0px 18px rgba(227, 68, 73, 1);
    }

    .plus-buttons:hover {
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    }

    .plus-buttons a.plus-button {
      background: rgb(218, 218, 218);
      color: rgb(48, 48, 48);
    }

    .plus-buttons a.plus-button:hover {
      background: rgb(204, 204, 204);
      color: rgb(48, 48, 48);
    }

    .plus-buttons a.plus-button.plus-button-isOn {
      background: rgb(227, 68, 73);
      color: rgb(255, 255, 255);
    }

    .plus-buttons a.plus-button.plus-button-isOn:hover {
      background: rgb(212, 32, 37);
      color: rgb(255, 255, 255);
    }
  `;
  
  /* Styles - General site-specific */
  
  const generalStyles = css`
    /* Hide elements */

    .up-arrow,
    .premium-overlay,
    .bottom-widget-section,
    .clipstore-bottom,
    .wid-spot-container,
    .wid-banner-container {
      display: none !important;
    }

    /* Increase large player size */

    .video-page.video-page--large-mode .player-container__player {
      height: 720px;
    }

    /* Show all playlists without scrolling when adding to favorites */

    .favorites-dropdown__list {
      max-height: unset !important;
    }

    .video-page:not(.video-page--large-mode) .player-container {
      margin: 10px auto 0;
    }

    .video-page:not(.video-page--large-mode) .entity-container,
    .video-page:not(.video-page--large-mode) .comments-wrap {
      margin: 0 auto;
    }

    /* Minor stylistic improvements */

    .entity-container {
      margin: 22px 0;
      margin-bottom: 22px;
      border-top: 1px solid #ccc;
    }
  `;
  
  /*
   * Run after page has loaded
   */
  
  window.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('#player-container');
    const video = document.querySelector('#player-container video');
    
    /*
     * Use wide player by default
     */
    
    if (video && options.autoresizePlayer) {
      /* Button is not always available right away -- wait for `canplay` */
      video.addEventListener('canplay', function onCanPlay() {
          let largePlayerButton = document.querySelector('.large-mode');
        
          /* Click large player button */
          largePlayerButton.dispatchEvent(new MouseEvent('click'));
        
          /* Only run once */
          video.removeEventListener('canplay', onCanPlay, false);
      });
    }
    
    /*
     * Add buttons for certain options
     */
    
    /* Buttons container */
    
    let buttons = document.createElement('div');
    let scrollButton = document.createElement('a');
    let scrollButtonText = document.createElement('span');
    let autoresizeButton = document.createElement('a');
    let autoresizeButtonText = document.createElement('span');
    let autoresizeButtonState = options.autoresizePlayer ? 'plus-button-isOn' : 'plus-button-isOff';
    
    buttons.classList.add('plus-buttons');
    
    scrollButtonText.textContent = "Scroll to top";
    scrollButtonText.classList.add('text');
    scrollButton.appendChild(scrollButtonText);
    scrollButton.classList.add('plus-button');
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0 });
    });
    
    buttons.appendChild(scrollButton);
    buttons.appendChild(autoresizeButton);
    
    autoresizeButtonText.textContent = 'Auto-resize player';
    autoresizeButtonText.classList.add('text');
    autoresizeButton.appendChild(autoresizeButtonText);
    autoresizeButton.classList.add(autoresizeButtonState, 'plus-button');
    autoresizeButton.addEventListener('click', () => {
      options.autoresizePlayer = !options.autoresizePlayer;
      localStorage.setItem('plus_autoresizePlayer', options.autoresizePlayer);
      
      if (options.autoresizePlayer) {
        autoresizeButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        autoresizeButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });
    
    document.body.appendChild(buttons);
    
    /*
     * Add styles
     */
    
    GM_addStyle(sharedStyles);
    GM_addStyle(themeStyles);
    GM_addStyle(generalStyles);
    
    /*
     * Add dynamic styles
     */
    
    const dynamicStyles = css`
      .plus-buttons {
        margin-right: -${buttons.getBoundingClientRect().width - 23}px;
      }

      .plus-buttons:hover {
        margin-right: 0;
      }

      .video-page.video-page--large-mode .player-container__player {
        max-height: ${window.innerHeight - 60}px;
      }
    `;
    
    GM_addStyle(dynamicStyles);
    
    if (player) {
      window.addEventListener('resize', () => {
        if (player.classList.contains('xplayer-large-mode')) {
          player.style.maxHeight = `${window.innerHeight - 60}px`;
        }
      });
    }
  });
})();