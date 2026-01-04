// ==UserScript==
// @author      Mr. Nope
// @version     1.2
// @name        XVIDEOS Plus
// @description A kinder XVIDEOS. Because you're worth it.
// @namespace   Nope
// @date        2019-02-23
// @include     *xvideos.com*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        https://seeklogo.com/images/X/xvideos-logo-77E7B4F168-seeklogo.com.png
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/380713/XVIDEOS%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/380713/XVIDEOS%20Plus.meta.js
// ==/UserScript==

(() => {
  const OPTIONS = {
    autoplay: JSON.parse(localStorage.getItem('plus_autoplay')) || false,
    cinemaMode: JSON.parse(localStorage.getItem('plus_cinemaMode')) || false
  }
  
  /**
   * Shared Styles
   */
  const sharedStyles = `
    /* Our own elements */

    .plus-buttons {
      background: rgba(27, 27, 27, 0.9);
      box-shadow: 0px 0px 12px rgba(20, 111, 223, 0.9);
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
  
  /**
   * Color Theme
   */
  const themeStyles = `
    .plus-buttons {
      box-shadow: 0px 0px 12px rgba(255, 153, 0, 0.85);
    }

    .plus-buttons:hover {
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    }

    .plus-buttons a.plus-button {
      background: rgb(47, 47, 47);
      color: rgb(172, 172, 172);
    }

    .plus-buttons a.plus-button:hover {
      background: rgb(79, 79, 79);
      color: rgb(204, 204, 204);
    }

    .plus-buttons a.plus-button.plus-button-isOn {
      background: rgb(255, 153, 0);
      color: rgb(0, 0, 0);
    }

    .plus-buttons a.plus-button.plus-button-isOn:hover {
      background: rgb(255, 153, 0);
      color: rgb(255, 255, 255);
    }
  `;
  
  /**
   * Site-Specific Styles
   */
  const generalStyles = `
    /* Hide elements */

    .abovePlayer,
    .streamatesModelsContainer,
    #headerUpgradePremiumBtn,
    #headerUploadBtn,
    #PornhubNetworkBar,
    #js-abContainterMain,
    #hd-rightColVideoPage > :not(#relatedVideosVPage) {
      display: none !important;
    }

    #related-videos .thumb-block {
      opacity: 1;
    }

    #related-videos .thumb-block:hover {
      opacity: 1;
    }
  `;
  
  /**
   * Run on page load
   */
  window.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('#html5video video'); // References the HTML5 Video element
    
    /**
     * Create option buttons
     */
    
    const buttons = document.createElement('div');
    
    const scrollButton = document.createElement('a');
    const scrollButtonText = document.createElement('span');
    
    const autoplayButton = document.createElement('a');
    const autoplayButtonText = document.createElement('span');
    const autoplayButtonState = OPTIONS.autoplay ? 'plus-button-isOn' : 'plus-button-isOff';
    
    const cinemaModeButton = document.createElement('a');
    const cinemaModeButtonText = document.createElement('span');
    const cinemaModeButtonState = OPTIONS.cinemaMode ? 'plus-button-isOn' : 'plus-button-isOff';
    
    scrollButtonText.textContent = "Scroll to Top";
    scrollButtonText.classList.add('text');
    scrollButton.appendChild(scrollButtonText);
    scrollButton.classList.add('plus-button');
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0 });
    });
    
    cinemaModeButtonText.textContent = 'Cinema Mode';
    cinemaModeButtonText.classList.add('text');
    cinemaModeButton.appendChild(cinemaModeButtonText);
    cinemaModeButton.classList.add(cinemaModeButtonState, 'plus-button');
    cinemaModeButton.addEventListener('click', () => {
      OPTIONS.cinemaMode = !OPTIONS.cinemaMode;
      localStorage.setItem('plus_cinemaMode', OPTIONS.cinemaMode);
      
      if (OPTIONS.cinemaMode) {
        cinemaModeButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        cinemaModeButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });
    
    autoplayButtonText.textContent = 'Autoplay';
    autoplayButtonText.classList.add('text');
    autoplayButton.appendChild(autoplayButtonText);
    autoplayButton.classList.add(autoplayButtonState, 'plus-button');
    autoplayButton.addEventListener('click', () => {
      OPTIONS.autoplay = !OPTIONS.autoplay;
      localStorage.setItem('plus_autoplay', OPTIONS.autoplay);
      
      if (OPTIONS.autoplay) {
        autoplayButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        autoplayButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });
    
    buttons.classList.add('plus-buttons');
    
    buttons.appendChild(scrollButton);
    buttons.appendChild(autoplayButton);
    buttons.appendChild(cinemaModeButton);
    
    document.body.appendChild(buttons);
    
    /**
     * Initialize video pages containing valid video element
     */
    
    if (/^http[s]*:\/\/[www.]*xvideos\.com\/video/.test(window.location.href) && video) {
      /**
       * Auto-enable cinema mode if enabled
       */
      if (OPTIONS.cinemaMode) {
        document.querySelector('.buttons-bar img[src*="icon-screen-expand"]').dispatchEvent(new MouseEvent('click'));
      }
    
      /**
       * Autoplay video if enabled
       */
      if (OPTIONS.autoplay) {
        document.querySelector('.buttons-bar img[src*="icon-play"]').dispatchEvent(new MouseEvent('click'));
      }
    }
    
    /**
     * Add styles
     */
    
    GM_addStyle(sharedStyles);
    GM_addStyle(themeStyles);
    GM_addStyle(generalStyles);
    
    /**
     * Add dynamic styles
     */
    
    const dynamicStyles = `
      .plus-buttons {
        margin-right: -${buttons.getBoundingClientRect().width - 23}px;
      }

      .plus-buttons:hover {
        margin-right: 0;
      }
    `;
    
    GM_addStyle(dynamicStyles);
  });
})();