// ==UserScript==
// @name     Facebook Messenger Dark
// @name:vi  Facebook Messenger Dark (Nền Tối)
// @description   A dark theme for Facebook Messenger, making your eyes feel comfortable when you work, especially at night.
// @description:vi Dark Theme cho Facebook Messenger, giúp bạn thoải mái hơn trong việc làm việc với messenger, đặc biệt là vào buổi tối.
// @include  https://*.messenger.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  0.0.1
// @namespace    f97
// @author       f97
// @homepageURL https://f97.xyz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442297/Facebook%20Messenger%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/442297/Facebook%20Messenger%20Dark.meta.js
// ==/UserScript==
 
GM_addStyle ( `
svg:not([fill]):not(.crt8y2ji) path:not([fill]) {
  fill: var(--primary-icon) !important;
}

.hwsy1cff path[fill=black] {
  fill: var(--primary-icon) !important;
}

.sf5mxxl7 {
  --secondary-button-background: unset !important;
}

.q2y6ezfg {
  background-color: var(--secondary-button-background) !important;
}

.iihba337 {
  display: none !important;
}

:root,
.__fb-light-mode {
  color-scheme: dark !important;
  --fds-black: black !important;
  --fds-black-alpha-05: rgba(0, 0, 0, 0.05) !important;
  --fds-black-alpha-10: rgba(0, 0, 0, 0.1) !important;
  --fds-black-alpha-15: rgba(0, 0, 0, 0.15) !important;
  --fds-black-alpha-20: rgba(0, 0, 0, 0.2) !important;
  --fds-black-alpha-30: rgba(0, 0, 0, 0.3) !important;
  --fds-black-alpha-40: rgba(0, 0, 0, 0.4) !important;
  --fds-black-alpha-50: rgba(0, 0, 0, 0.5) !important;
  --fds-black-alpha-60: rgba(0, 0, 0, 0.6) !important;
  --fds-black-alpha-80: rgba(0, 0, 0, 0.8) !important;
  --fds-blue-05: black !important;
  --fds-blue-30: black !important;
  --fds-blue-40: black !important;
  --fds-blue-60: black !important;
  --fds-blue-70: black !important;
  --fds-blue-80: black !important;
  --fds-button-text: black !important;
  --fds-comment-background: black !important;
  --fds-dark-mode-gray-35: black !important;
  --fds-dark-mode-gray-50: black !important;
  --fds-dark-mode-gray-70: black !important;
  --fds-dark-mode-gray-80: black !important;
  --fds-dark-mode-gray-90: black !important;
  --fds-dark-mode-gray-100: black !important;
  --fds-gray-00: black !important;
  --fds-gray-05: black !important;
  --fds-gray-10: black !important;
  --fds-gray-20: black !important;
  --fds-gray-25: black !important;
  --fds-gray-30: black !important;
  --fds-gray-45: black !important;
  --fds-gray-70: black !important;
  --fds-gray-80: black !important;
  --fds-gray-90: black !important;
  --fds-gray-100: black !important;
  --fds-green-55: black !important;
  --fds-highlight: black !important;
  --fds-highlight-cell-background: black !important;
  --fds-primary-icon: white !important;
  --fds-primary-text: white !important;
  --fds-red-55: black !important;
  --fds-soft: cubic-bezier(0.08, 0.52, 0.52, 1) !important;
  --fds-spectrum-aluminum-tint-70: black !important;
  --fds-spectrum-blue-gray-tint-70: black !important;
  --fds-spectrum-cherry: black !important;
  --fds-spectrum-cherry-tint-70: black !important;
  --fds-spectrum-grape-tint-70: black !important;
  --fds-spectrum-grape-tint-90: black !important;
  --fds-spectrum-lemon-dark-1: black !important;
  --fds-spectrum-lemon-tint-70: black !important;
  --fds-spectrum-lime: black !important;
  --fds-spectrum-lime-tint-70: black !important;
  --fds-spectrum-orange-tint-70: black !important;
  --fds-spectrum-orange-tint-90: black !important;
  --fds-spectrum-seafoam-tint-70: black !important;
  --fds-spectrum-slate-dark-2: black !important;
  --fds-spectrum-slate-tint-70: black !important;
  --fds-spectrum-teal: black !important;
  --fds-spectrum-teal-dark-1: black !important;
  --fds-spectrum-teal-dark-2: black !important;
  --fds-spectrum-teal-tint-70: black !important;
  --fds-spectrum-teal-tint-90: black !important;
  --fds-spectrum-tomato: black !important;
  --fds-spectrum-tomato-tint-30: black !important;
  --fds-spectrum-tomato-tint-90: black !important;
  --fds-strong: cubic-bezier(0.12, 0.8, 0.32, 1) !important;
  --fds-white: black !important;
  --fds-white-alpha-05: rgba(255, 255, 255, 0.05) !important;
  --fds-white-alpha-10: rgba(255, 255, 255, 0.1) !important;
  --fds-white-alpha-20: rgba(255, 255, 255, 0.2) !important;
  --fds-white-alpha-30: rgba(255, 255, 255, 0.3) !important;
  --fds-white-alpha-40: rgba(255, 255, 255, 0.4) !important;
  --fds-white-alpha-50: rgba(255, 255, 255, 0.5) !important;
  --fds-white-alpha-60: rgba(255, 255, 255, 0.6) !important;
  --fds-white-alpha-80: rgba(255, 255, 255, 0.8) !important;
  --fds-yellow-20: black !important;
  --accent: hsl(214, 100%, 59%) !important;
  --always-white: white !important;
  --always-black: black !important;
  --always-dark-gradient: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.6)
  ) !important;
  --always-dark-overlay: rgba(0, 0, 0, 0.4) !important;
  --always-light-overlay: rgba(255, 255, 255, 0.4) !important;
  --always-gray-40: #65676b !important;
  --always-gray-75: #bcc0c4 !important;
  --always-gray-95: #f0f2f5 !important;
  --attachment-footer-background: rgba(255, 255, 255, 0.1) !important;
  --background-deemphasized: rgba(255, 255, 255, 0.1) !important;
  --base-blue: #1877f2 !important;
  --base-cherry: #f3425f !important;
  --base-grape: #9360f7 !important;
  --base-lemon: #f7b928 !important;
  --base-lime: #45bd62 !important;
  --base-pink: #ff66bf !important;
  --base-seafoam: #54c7ec !important;
  --base-teal: #2abba7 !important;
  --base-tomato: #fb724b !important;
  --blue-link: #4599ff !important;
  --card-background: #242526 !important;
  --card-background-flat: #323436 !important;
  --comment-background: #3a3b3c !important;
  --comment-footer-background: #4e4f50 !important;
  --dataviz-primary-1: rgb(48, 200, 180) !important;
  --disabled-button-background: rgba(255, 255, 255, 0.2) !important;
  --disabled-button-text: rgba(255, 255, 255, 0.3) !important;
  --disabled-icon: rgba(255, 255, 255, 0.3) !important;
  --disabled-text: rgba(255, 255, 255, 0.3) !important;
  --divider: #3e4042 !important;
  --event-date: #f3425f !important;
  --filter-accent: invert(40%) sepia(52%) saturate(200%) saturate(200%)
      saturate(200%) saturate(189%) hue-rotate(191deg) brightness(103%)
      contrast(102%) !important;
  --filter-always-white: invert(100%) !important;
  --filter-disabled-icon: invert(100%) opacity(30%) !important;
  --filter-placeholder-icon: invert(59%) sepia(11%) saturate(200%)
      saturate(135%) hue-rotate(176deg) brightness(96%) contrast(94%) !important;
  --filter-primary-icon: invert(89%) sepia(6%) hue-rotate(185deg) !important;
  --filter-secondary-icon: invert(62%) sepia(98%) saturate(12%)
      hue-rotate(175deg) brightness(90%) contrast(96%) !important;
  --filter-warning-icon: invert(77%) sepia(29%) saturate(200%) saturate(200%)
      saturate(200%) saturate(200%) saturate(200%) saturate(128%)
      hue-rotate(359deg) brightness(102%) contrast(107%) !important;
  --filter-blue-link-icon: invert(73%) sepia(29%) saturate(200%)
      saturate(200%) saturate(200%) saturate(200%) saturate(200%)
      saturate(200%) saturate(103.25%) hue-rotate(189deg) brightness(101%)
      contrast(101%) !important;
  --filter-positive: invert(37%) sepia(61%) saturate(200%) saturate(200%)
      saturate(200%) saturate(200%) saturate(115%) hue-rotate(91deg)
      brightness(97%) contrast(105%) !important;
  --filter-negative: invert(25%) sepia(33%) saturate(200%) saturate(200%)
      saturate(200%) saturate(200%) saturate(200%) saturate(200%)
      saturate(110%) hue-rotate(345deg) brightness(132%) contrast(96%) !important;
  --glimmer-spinner-icon: white !important;
  --hero-banner-background: #e85d07 !important;
  --hosted-view-selected-state: rgba(45, 136, 255, 0.1) !important;
  --highlight-bg: rgba(24, 119, 242, 0.31) !important;
  --hover-overlay: rgba(255, 255, 255, 0.1) !important;
  --media-hover: rgba(68, 73, 80, 0.15) !important;
  --media-inner-border: rgba(255, 255, 255, 0.05) !important;
  --media-outer-border: #33363a !important;
  --media-pressed: rgba(68, 73, 80, 0.35) !important;
  --messenger-card-background: #242526 !important;
  --messenger-reply-background: #18191a !important;
  --overlay-alpha-80: rgba(11, 11, 11, 0.8) !important;
  --overlay-on-media: rgba(0, 0, 0, 0.6) !important;
  --nav-bar-background: #242526 !important;
  --nav-bar-background-gradient: linear-gradient(
      to top,
      #242526,
      rgba(36, 37, 38, 0.9),
      rgba(36, 37, 38, 0.7),
      rgba(36, 37, 38, 0.4),
      rgba(36, 37, 38, 0)
  ) !important;
  --nav-bar-background-gradient-wash: linear-gradient(
      to top,
      #18191a,
      rgba(24, 25, 26, 0.9),
      rgba(24, 25, 26, 0.7),
      rgba(24, 25, 26, 0.4),
      rgba(24, 25, 26, 0)
  ) !important;
  --negative: hsl(350, 87%, 55%) !important;
  --negative-background: hsl(350, 87%, 55%, 20%) !important;
  --new-notification-background: #e7f3ff !important;
  --non-media-pressed: rgba(68, 73, 80, 0.15) !important;
  --non-media-pressed-on-dark: rgba(255, 255, 255, 0.3) !important;
  --notification-badge: #f02849 !important;
  --placeholder-icon: #8a8d91 !important;
  --placeholder-text: #8a8d91 !important;
  --placeholder-text-on-media: rgba(255, 255, 255, 0.5) !important;
  --popover-background: #3e4042 !important;
  --positive: #31a24c !important;
  --positive-background: #1f3520 !important;
  --press-overlay: rgba(255, 255, 255, 0.1) !important;
  --primary-button-background: #2d88ff !important;
  --primary-button-background-experiment: #2374e1 !important;
  --primary-button-pressed: #77a7ff !important;
  --primary-button-text: #ffffff !important;
  --primary-deemphasized-button-background: rgba(
      45,
      136,
      255,
      0.2
  ) !important;
  --primary-deemphasized-button-pressed: rgba(24, 119, 242, 0.2) !important;
  --primary-deemphasized-button-pressed-overlay: rgba(
      25,
      110,
      255,
      0.15
  ) !important;
  --primary-deemphasized-button-text: #2d88ff !important;
  --primary-icon: #e4e6eb !important;
  --primary-text: #e4e6eb !important;
  --primary-text-on-media: white !important;
  --primary-web-focus-indicator: #d24294 !important;
  --progress-ring-neutral-background: rgba(255, 255, 255, 0.2) !important;
  --progress-ring-neutral-foreground: #ffffff !important;
  --progress-ring-on-media-background: rgba(255, 255, 255, 0.2) !important;
  --progress-ring-on-media-foreground: #ffffff !important;
  --progress-ring-blue-background: rgba(45, 136, 255, 0.2) !important;
  --progress-ring-blue-foreground: hsl(214, 100%, 59%) !important;
  --progress-ring-disabled-background: rgba(122, 125, 130, 0.2) !important;
  --progress-ring-disabled-foreground: #7a7d82 !important;
  --scroll-thumb: rgba(255, 255, 255, 0.3) !important;
  --scroll-shadow: 0 1px 2px rgba(0, 0, 0, 0.1),
      0 -1px rgba(255, 255, 255, 0.05) inset !important;
  --secondary-button-background: rgba(255, 255, 255, 0.1) !important;
  --secondary-button-background-floating: #4b4c4f !important;
  --secondary-button-background-on-dark: rgba(255, 255, 255, 0.4) !important;
  --secondary-button-pressed: rgba(0, 0, 0, 0.05) !important;
  --secondary-button-stroke: transparent !important;
  --secondary-button-text: #e4e6eb !important;
  --secondary-icon: #b0b3b8 !important;
  --secondary-text: #b0b3b8 !important;
  --secondary-text-on-media: rgba(255, 255, 255, 0.9) !important;
  --section-header-text: #bcc0c4 !important;
  --shadow-1: rgba(0, 0, 0, 0.1) !important;
  --shadow-2: rgba(0, 0, 0, 0.2) !important;
  --shadow-5: rgba(0, 0, 0, 0.5) !important;
  --shadow-8: rgba(0, 0, 0, 0.8) !important;
  --shadow-inset: rgba(255, 255, 255, 0.05) !important;
  --surface-background: #242526 !important;
  --text-highlight: rgba(24, 119, 242, 0.45) !important;
  --toggle-active-background: rgb(45, 136, 255) !important;
  --toggle-active-icon: #ffffff !important;
  --toggle-active-text: #ffffff !important;
  --toggle-button-active-background: #e6f2ff !important;
  --wash: #3e4042 !important;
  --web-wash: #18191a !important;
  --warning: hsl(40, 89%, 52%) !important;
  --fb-logo-color: #2d88ff !important;
  --dialog-anchor-vertical-padding: 56px !important;
  --header-height: 0px !important;
  --button-corner-radius: 6px !important;
  --card-corner-radius: 8px !important;
  --fds-animation-enter-exit-in: cubic-bezier(0.14, 1, 0.34, 1) !important;
  --fds-animation-enter-exit-out: cubic-bezier(0.45, 0.1, 0.2, 1) !important;
  --fds-animation-swap-shuffle-in: cubic-bezier(0.14, 1, 0.34, 1) !important;
  --fds-animation-swap-shuffle-out: cubic-bezier(
      0.45,
      0.1,
      0.2,
      1
  ) !important;
  --fds-animation-move-in: cubic-bezier(0.17, 0.17, 0, 1) !important;
  --fds-animation-move-out: cubic-bezier(0.17, 0.17, 0, 1) !important;
  --fds-animation-expand-collapse-in: cubic-bezier(
      0.17,
      0.17,
      0,
      1
  ) !important;
  --fds-animation-expand-collapse-out: cubic-bezier(
      0.17,
      0.17,
      0,
      1
  ) !important;
  --fds-animation-passive-move-in: cubic-bezier(0.5, 0, 0.1, 1) !important;
  --fds-animation-passive-move-out: cubic-bezier(0.5, 0, 0.1, 1) !important;
  --fds-animation-quick-move-in: cubic-bezier(0.1, 0.9, 0.2, 1) !important;
  --fds-animation-quick-move-out: cubic-bezier(0.1, 0.9, 0.2, 1) !important;
  --fds-animation-fade-in: cubic-bezier(0, 0, 1, 1) !important;
  --fds-animation-fade-out: cubic-bezier(0, 0, 1, 1) !important;
  --fds-duration-extra-extra-short-in: 100ms !important;
  --fds-duration-extra-extra-short-out: 100ms !important;
  --fds-duration-extra-short-in: 200ms !important;
  --fds-duration-extra-short-out: 150ms !important;
  --fds-duration-short-in: 280ms !important;
  --fds-duration-short-out: 200ms !important;
  --fds-duration-medium-in: 400ms !important;
  --fds-duration-medium-out: 350ms !important;
  --fds-duration-long-in: 500ms !important;
  --fds-duration-long-out: 350ms !important;
  --fds-duration-extra-long-in: 1000ms !important;
  --fds-duration-extra-long-out: 1000ms !important;
  --fds-duration-none: 0ms !important;
  --fds-fast: 200ms !important;
  --fds-slow: 400ms !important;
  --font-family-apple: system-ui, -apple-system, BlinkMacSystemFont,
      ".SFNSText-Regular", sans-serif !important;
  --font-family-default: Helvetica, Arial, sans-serif !important;
  --font-family-segoe: Segoe UI Historic, Segoe UI, Helvetica, Arial,
      sans-serif !important;
  --dataviz-primary-2: rgb(134, 218, 255) !important;
  --dataviz-primary-3: rgb(95, 170, 255) !important;
  --dataviz-secondary-1: rgb(129, 77, 231) !important;
  --dataviz-secondary-2: rgb(168, 124, 255) !important;
  --dataviz-secondary-3: rgb(219, 26, 139) !important;
  --dataviz-supplementary-1: rgb(255, 122, 105) !important;
  --dataviz-supplementary-2: rgb(241, 168, 23) !important;
  --dataviz-supplementary-3: rgb(49, 162, 76) !important;
  --dataviz-supplementary-4: rgb(228, 230, 235) !important;
}
` );
