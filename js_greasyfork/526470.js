// ==UserScript==
// @name        GitHub fix theme
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @match       https://*.github.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @license     MIT
// @version     1.0.4
// @author      Mops
// @icon        https://github.githubassets.com/favicons/favicon-dark.png
// @description Buttons and labels should be colored as "primary", not "success".
// @downloadURL https://update.greasyfork.org/scripts/526470/GitHub%20fix%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/526470/GitHub%20fix%20theme.meta.js
// ==/UserScript==

/**
 * blue: 215deg
 * green: 135deg
 * orange: 23deg
 */
let accent = '215deg';

GM_addStyle(`
/* All primary-themed buttons should be blue*/
html.js-focus-visible[lang][data-color-mode] {
  --accent: ${accent};

  --bgColor-accent-emphasis: hsl(var(--accent) 83.61% 52.16%);
  --button-primary-bgColor-rest: var(--bgColor-accent-emphasis);
  --button-primary-bgColor-active: hsl(var(--accent) 83.61% 60.16%);
  --button-primary-bgColor-hover: hsl(var(--accent) 83.61% 44.16%);
  --button-primary-bgColor-disabled: hsl(var(--accent) 83.61% 41.16%);

  --borderColor-accent-emphasis: hsl(var(--accent) 63.61% 56.16%);
  --button-primary-borderColor-rest: var(--borderColor-accent-emphasis);
  --button-primary-borderColor-disabled: hsl(var(--accent) 63.61% 45.16%);
}

/* (Latest) pill and other success-themed pills */
.Label.Label--success,

/* (Preview) pill */
:where(.prc-Label-Label--LG6X):where([data-variant=success])
{
  border-color: var(--borderColor-accent-emphasis);
  color: var(--fgColor-accent);
}
`);