// ==UserScript==
// @name         Change Background Color for All Sites (dark red)
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      1.6
// @description  Change background color while preserving other styles
// @author       Trilla_G
// @match        *://*/*
// @grant        GM_addStyle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534569/Change%20Background%20Color%20for%20All%20Sites%20%28dark%20red%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534569/Change%20Background%20Color%20for%20All%20Sites%20%28dark%20red%29.meta.js
// ==/UserScript==

GM_addStyle(`
  /* General background elements */
  body, html, #content, main, .main-container, .page-wrapper, .site-wrapper,
  .content-wrapper, .app-root, [class*="background"] {
      background-color: #943022 !important;
    
  }

  /* Ensure text and foreground colors are not overridden */
  * {
      background-color: transparent !important;
  }

  /* Restore background for pop-up elements */
  .popup, .popover, .modal, .tooltip, .menu, .dropdown, .overlay,
  .dialog, .floating-menu, .context-menu, [role="dialog"], [role="menu"],
  [role="tooltip"], [role="alert"], [aria-modal="true"] {
      background-color: #643022 !important; /* Darker red to match theme */
      color: inherit !important;
  }

  /* YouTube-specific backgrounds */
  ytd-app, ytd-page-manager {
      background-color: #943022 !important;
  }

  /* Rumble backgrounds */
  .app, .wrapper, .main-content {
      background-color: #943022 !important;
  }

  /* Kick backgrounds */
  .kick-app-root, .video-player-page, .page-content {
      background-color: #943022 !important;
  }

  /* Twitch navigation, sidebar, and headers */
  .tw-root, .tw-sidebar, .side-nav__content, .top-nav__menu, .chat-room,
  .channel-page__container, [data-a-target="side-nav-bar"], .tw-transition-group,
  .side-nav__scrollable_content {
      background-color: #943022 !important;
  }

  /* ChatGPT background fix */
  .chatgpt-app, .flex.flex-col.items-center, #__next {
      background-color: #943022 !important;
  }

  /* X (formerly Twitter) background and containers */
  [data-testid="primaryColumn"], [data-testid="secondaryColumn"],
  header[role="banner"], div[aria-label="Timeline: Home"],
  [role="main"] {
      background-color: #943022 !important;
  }

  /* Remove semi-transparent overlays */
  [style*="rgba"], [style*="opacity"] {
      background: none !important;
      opacity: 1 !important;
  }
`);

