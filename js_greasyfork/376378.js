// ==UserScript==
// @author      LD
// @version     1.0
// @name        PornHub Plus
// @description A kinder PornHub. Because you're worth it.
// @namespace   LD
// @date        2018-08-08
// @include     *pornhub.com/*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        http://www.techthisoutnews.com/wp-content/uploads/2018/03/porn.jpg
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376378/PornHub%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/376378/PornHub%20Plus.meta.js
// ==/UserScript==

(() => {
  const OPTIONS = {
    openWithoutPlaylist: true,
    showOnlyVerified: JSON.parse(localStorage.getItem('plus_showOnlyVerified')) || false,
    redirectToVideos: JSON.parse(localStorage.getItem('plus_redirectToVideos')) || false,
    autoresizePlayer: JSON.parse(localStorage.getItem('plus_autoresizePlayer')) || false,
    durationFilter: JSON.parse(localStorage.getItem('plus_durationFilter')) || { max: 0, min: 0 }
  }
  
  /* Styles - Shared between all "Plus" userscripts */
  
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
  
  /* Styles - Color theme */
  
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
  
  /* Styles - General site-specific */
  
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

    /* Show all playlists without scrolling in "add to" */

    .slimScrollDiv {
      height: auto !important;
    }

    #scrollbar_watch {
      max-height: unset !important;
    }

    /* Hide premium video from related videos sidebar */

    #relateRecommendedItems li:nth-of-type(5) {
      display: none !important;
    }

    /* Prevent animating player size change on each page load */

    #main-container .video-wrapper #player.wide {
      transition: none !important;
    }
  `;
  
  /*
   * Run after page has loaded
   */
  
  window.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('#player');
    const video = document.querySelector('video');
    // const largePlayerButton = document.querySelector('.mhp1138_cinema');
    
    /*
     * Use wide player by default
     */
    
    if (player && OPTIONS.autoresizePlayer) {
      player.classList.remove('original');
      player.classList.add('wide');
      document.querySelector('#hd-rightColVideoPage').classList.add('wide');
      
      setTimeout(() => {
        document.querySelector('.mhp1138_cinema').classList.add('mhp1138_active');
      }, 2000);
      
      // if (video.readyState >= 2) {
      //   // Video cached and ready
      //   largePlayerButton.dispatchEvent(new MouseEvent('mouseup'));
      // } else {
      //   // Wait for video to be ready
      //   video.addEventListener('canplay', function onCanPlay() {
      //     /* Click large player button */
      //     largePlayerButton.dispatchEvent(new MouseEvent('mouseup'));
      // 
      //     /* Only run once */
      //     video.removeEventListener('canplay', onCanPlay, false);
      //   });
      // }
    }
    
    /*
     * Clicking a video on a playlist page opens it without the playlist at the top
     * 
     * If this option is disabled, add it as a link after the video title.
     */

    if (OPTIONS.openWithoutPlaylist) {
      const playlistLinks = document.querySelectorAll('#playlistWrapper #videoPlaylist li a');
      for (link of playlistLinks) link.href = link.href.replace('pkey', 'nopkey');
    } else {
      const links = document.querySelectorAll('#playlistWrapper #videoPlaylist li .title a');
    
      for (link of links) {
        let newLink = document.createElement('a');
        newLink.href = link.href.replace('pkey', 'nopkey');
        newLink.appendChild(document.createTextNode('[↗]'));
        link.parentNode.appendChild(newLink);
      }
    }
    
    /*
     * Allow scrolling the page when mouse hovers playlists in "add to"
     */
    
    /* Clone playlist scroll container to remove listeners that preventDefault() */
    var scrollContainer = document.getElementById('scrollbar_watch');
    
    if (scrollContainer) {
      var newScrollContainer = scrollContainer.cloneNode(true);
      
      scrollContainer.parentNode.replaceChild(newScrollContainer, scrollContainer);
    }
    
    /*
     * Automatically "load more" to show all videos on user video pages
     
    
    var autoloadTimer = null; 
    var loadMoreButton = document.getElementById('moreDataBtn');
    
    function autoloadMore() {
      if (loadMoreButton.style.display === 'none') {
        clearInterval(autoloadTimer);
        
      } else {
        loadMoreButton.onclick();
      }
    }
    
    if (loadMoreButton) {
      autoloadTimer = setInterval(autoloadMore, 5000);
    }*/
    
    /*
     * Add buttons for certain options
     */
    
    /* Buttons container */
    
    let buttons = document.createElement('div');
    let scrollButton = document.createElement('a');
    let scrollButtonText = document.createElement('span');
    let verifiedButton = document.createElement('a');
    let verifiedButtonText = document.createElement('span');
    let verifiedButtonState = OPTIONS.showOnlyVerified ? 'plus-button-isOn' : 'plus-button-isOff';
    let redirectToVideosButton = document.createElement('a');
    let redirectToVideosButtonText = document.createElement('span');
    let redirectToVideosButtonState = OPTIONS.redirectToVideos ? 'plus-button-isOn' : 'plus-button-isOff';
    let autoresizeButton = document.createElement('a');
    let autoresizeButtonText = document.createElement('span');
    let autoresizeButtonState = OPTIONS.autoresizePlayer ? 'plus-button-isOn' : 'plus-button-isOff';
    let durationShortButton = document.createElement('a');
    let durationShortButtonText = document.createElement('span');
    let durationShortButtonState = !OPTIONS.durationFilter.min ? 'plus-button-isOn' : 'plus-button-isOff';
    
    buttons.classList.add('plus-buttons');
    
    scrollButtonText.textContent = "Scroll to top";
    scrollButtonText.classList.add('text');
    scrollButton.appendChild(scrollButtonText);
    scrollButton.classList.add('plus-button');
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0 });
    });
    
    buttons.appendChild(scrollButton);
    
    verifiedButtonText.textContent = 'Show only verified';
    verifiedButtonText.classList.add('text');
    verifiedButton.appendChild(verifiedButtonText);
    verifiedButton.classList.add(verifiedButtonState, 'plus-button');
    verifiedButton.addEventListener('click', () => {
      setShowOnlyVerified(!OPTIONS.showOnlyVerified);
    });
    
    buttons.appendChild(redirectToVideosButton);
    
    redirectToVideosButtonText.textContent = 'Redirect profiles to uploads';
    redirectToVideosButtonText.classList.add('text');
    redirectToVideosButton.appendChild(redirectToVideosButtonText);
    redirectToVideosButton.classList.add(redirectToVideosButtonState, 'plus-button');
    redirectToVideosButton.addEventListener('click', () => {
      OPTIONS.redirectToVideos = !OPTIONS.redirectToVideos;
      localStorage.setItem('plus_redirectToVideos', OPTIONS.redirectToVideos);
      
      if (OPTIONS.redirectToVideos) {
        redirectToVideosButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        redirectToVideosButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });
    
    buttons.appendChild(autoresizeButton);
    
    durationShortButtonText.textContent = 'Show short videos (< 8 min)';
    durationShortButtonText.classList.add('text');
    durationShortButton.appendChild(durationShortButtonText);
    durationShortButton.classList.add(durationShortButtonState, 'plus-button');
    durationShortButton.addEventListener('click', () => {
      OPTIONS.durationFilter.min = OPTIONS.durationFilter.min ? 0 : 8;
      localStorage.setItem('plus_durationFilter', JSON.stringify(OPTIONS.durationFilter));
      
      if (!OPTIONS.durationFilter.min) {
        durationShortButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
        updateDurationFilter();
      } else {
        durationShortButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
        updateDurationFilter();
      }
    });
    
    buttons.appendChild(durationShortButton);
    
    autoresizeButtonText.textContent = 'Auto-resize player';
    autoresizeButtonText.classList.add('text');
    autoresizeButton.appendChild(autoresizeButtonText);
    autoresizeButton.classList.add(autoresizeButtonState, 'plus-button');
    autoresizeButton.addEventListener('click', () => {
      OPTIONS.autoresizePlayer = !OPTIONS.autoresizePlayer;
      localStorage.setItem('plus_autoresizePlayer', OPTIONS.autoresizePlayer);
      
      if (OPTIONS.autoresizePlayer) {
        autoresizeButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        autoresizeButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });
    
    document.body.appendChild(buttons);
    
    if (window.location.href.includes('/playlist/')) {
      buttons.appendChild(verifiedButton);

      setTimeout(() => {
        setShowOnlyVerified(OPTIONS.showOnlyVerified);
      }, 1000);
    }
    
    /* Redirect profile page to all uploads, except if we just came from there */
    
    if (
      /^https:\/\/www\.pornhub\.com\/pornstar\/([^\/]+)$/.test(window.location.href) ||
      /^https:\/\/www\.pornhub\.com\/model\/([^\/]+)$/.test(window.location.href) ||
      /^https:\/\/www\.pornhub\.com\/users\/([^\/]+)$/.test(window.location.href) ||
      /^https:\/\/www\.pornhub\.com\/channels\/([^\/]+)$/.test(window.location.href)) {
      if (OPTIONS.redirectToVideos && !/.+\/videos\/upload.*/.test(document.referrer)) {
        window.location.href = window.location.href + '/videos/upload';
      }
    }
    
    function setShowOnlyVerified(state) {
      OPTIONS.showOnlyVerified = state;
      localStorage.setItem('plus_showOnlyVerified', state);
      
      if (state) {
        verifiedButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        verifiedButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
      
      document.querySelectorAll('.videoBox').forEach((box) => {
        if (!box.innerHTML.includes('Video of verified member')) {
          if (state) {
            box.classList.add('plus-hidden');
          } else {
            box.classList.remove('plus-hidden');
          }
        }
      });
    }
    
    function updateDurationFilter() {
      document.querySelectorAll('.videoBox').forEach((box) => {
        let durationParts = box.querySelector('.duration').textContent.split(":");
        let duration = { minutes: parseInt(durationParts[0]), seconds: parseInt(durationParts[1]) }
        
        if (duration.minutes >= OPTIONS.durationFilter.min &&
            (!OPTIONS.durationFilter.max || duration.minutes <= OPTIONS.durationFilter.max)) {
          box.classList.remove('plus-hidden');
        } else {
          box.classList.add('plus-hidden');
        }
      });
    }
    
    let loadMoreButton = document.querySelector('.more_related_btn');
    
    if (loadMoreButton)
      loadMoreButton.addEventListener('click', updateDurationFilter);
    
    updateDurationFilter();
    
    /*
     * Add styles
     */
    
    GM_addStyle(sharedStyles);
    GM_addStyle(themeStyles);
    GM_addStyle(generalStyles);
    
    /*
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