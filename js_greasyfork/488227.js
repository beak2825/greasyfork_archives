// ==UserScript==
// @name         Experimental Flight Interface
// @namespace    https://github.com/Ferhatduran55/geofs-experimental-fi
// @version      0.7.13
// @description  Improve your plane with the interface that offers experimental features.
// @author       Ferhatduran55
// @match        https://www.geo-fs.com/geofs.php?v=3.9
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        unsafeWindow
// @license      MIT
// @homepage     https://greasyfork.org/scripts/488227
// @supportURL   https://greasyfork.org/scripts/488227/feedback
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488227/Experimental%20Flight%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/488227/Experimental%20Flight%20Interface.meta.js
// ==/UserScript==

// dist/index.js
(function () {
	'use strict';

	try{if(typeof document != 'undefined'){GM.addStyle("*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font-family by default.\n2. Use the user's configured `mono` font-feature-settings by default.\n3. Use the user's configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type='button']),\ninput:where([type='reset']),\ninput:where([type='submit']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden=\"until-found\"])) {\n  display: none;\n}\r\n.container {\n  width: 100%;\n}\r\n@media (min-width: 640px) {\n\n  .container {\n    max-width: 640px;\n  }\n}\r\n@media (min-width: 768px) {\n\n  .container {\n    max-width: 768px;\n  }\n}\r\n@media (min-width: 1024px) {\n\n  .container {\n    max-width: 1024px;\n  }\n}\r\n@media (min-width: 1280px) {\n\n  .container {\n    max-width: 1280px;\n  }\n}\r\n@media (min-width: 1536px) {\n\n  .container {\n    max-width: 1536px;\n  }\n}\r\n.static {\n  position: static;\n}\r\n.m-2 {\n  margin: 0.5rem;\n}\r\n.mt-4 {\n  margin-top: 1rem;\n}\r\n.flex {\n  display: flex;\n}\r\n.h-5 {\n  height: 1.25rem;\n}\r\n.w-11\\/12 {\n  width: 91.666667%;\n}\r\n.w-5 {\n  width: 1.25rem;\n}\r\n.w-fit {\n  width: -moz-fit-content;\n  width: fit-content;\n}\r\n.w-max {\n  width: -moz-max-content;\n  width: max-content;\n}\r\n.flex-auto {\n  flex: 1 1 auto;\n}\r\n.flex-none {\n  flex: none;\n}\r\n.flex-col {\n  flex-direction: column;\n}\r\n.items-center {\n  align-items: center;\n}\r\n.justify-between {\n  justify-content: space-between;\n}\r\n.gap-2 {\n  gap: 0.5rem;\n}\r\n.gap-4 {\n  gap: 1rem;\n}\r\n.rounded-md {\n  border-radius: 0.375rem;\n}\r\n.border-0 {\n  border-width: 0px;\n}\r\n.bg-sky-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(2 132 199 / var(--tw-bg-opacity, 1));\n}\r\n.p-2 {\n  padding: 0.5rem;\n}\r\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\r\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\r\n.pb-4 {\n  padding-bottom: 1rem;\n}\r\n.pl-2 {\n  padding-left: 0.5rem;\n}\r\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.font-medium {\n  font-weight: 500;\n}\r\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity, 1));\n}\r\n.text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n}\r\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\r\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.transition {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\r\n.marker\\:content-none *::marker {\n  --tw-content: none;\n  content: var(--tw-content);\n}\r\n.marker\\:content-none::marker {\n  --tw-content: none;\n  content: var(--tw-content);\n}\r\n.hover\\:cursor-pointer:hover {\n  cursor: pointer;\n}\r\n.hover\\:bg-sky-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(3 105 161 / var(--tw-bg-opacity, 1));\n}html[dir=\"ltr\"],\r\n[data-sonner-toaster][dir=\"ltr\"] {\r\n  --toast-icon-margin-start: -3px;\r\n  --toast-icon-margin-end: 4px;\r\n  --toast-svg-margin-start: -1px;\r\n  --toast-svg-margin-end: 0px;\r\n  --toast-button-margin-start: auto;\r\n  --toast-button-margin-end: 0;\r\n  --toast-close-button-start: 0;\r\n  --toast-close-button-end: unset;\r\n  --toast-close-button-transform: translate(-35%, -35%);\r\n}\r\nhtml[dir=\"rtl\"],\r\n[data-sonner-toaster][dir=\"rtl\"] {\r\n  --toast-icon-margin-start: 4px;\r\n  --toast-icon-margin-end: -3px;\r\n  --toast-svg-margin-start: 0px;\r\n  --toast-svg-margin-end: -1px;\r\n  --toast-button-margin-start: 0;\r\n  --toast-button-margin-end: auto;\r\n  --toast-close-button-start: unset;\r\n  --toast-close-button-end: 0;\r\n  --toast-close-button-transform: translate(35%, -35%);\r\n}\r\n[data-sonner-toaster] {\r\n  position: fixed;\r\n  width: var(--width);\r\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,\r\n    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,\r\n    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;\r\n  --gray1: hsl(0, 0%, 99%);\r\n  --gray2: hsl(0, 0%, 97.3%);\r\n  --gray3: hsl(0, 0%, 95.1%);\r\n  --gray4: hsl(0, 0%, 93%);\r\n  --gray5: hsl(0, 0%, 90.9%);\r\n  --gray6: hsl(0, 0%, 88.7%);\r\n  --gray7: hsl(0, 0%, 85.8%);\r\n  --gray8: hsl(0, 0%, 78%);\r\n  --gray9: hsl(0, 0%, 56.1%);\r\n  --gray10: hsl(0, 0%, 52.3%);\r\n  --gray11: hsl(0, 0%, 43.5%);\r\n  --gray12: hsl(0, 0%, 9%);\r\n  --border-radius: 8px;\r\n  box-sizing: border-box;\r\n  padding: 0;\r\n  margin: 0;\r\n  list-style: none;\r\n  outline: none;\r\n  z-index: 999999999;\r\n}\r\n[data-sonner-toaster][data-x-position=\"right\"] {\r\n  right: max(var(--offset), env(safe-area-inset-right));\r\n}\r\n[data-sonner-toaster][data-x-position=\"left\"] {\r\n  left: max(var(--offset), env(safe-area-inset-left));\r\n}\r\n[data-sonner-toaster][data-x-position=\"center\"] {\r\n  left: 50%;\r\n  transform: translateX(-50%);\r\n}\r\n[data-sonner-toaster][data-y-position=\"top\"] {\r\n  top: max(var(--offset), env(safe-area-inset-top));\r\n}\r\n[data-sonner-toaster][data-y-position=\"bottom\"] {\r\n  bottom: max(var(--offset), env(safe-area-inset-bottom));\r\n}\r\n[data-sonner-toast] {\r\n  --y: translateY(100%);\r\n  --lift-amount: calc(var(--lift) * var(--gap));\r\n  z-index: var(--z-index);\r\n  position: absolute;\r\n  opacity: 0;\r\n  transform: var(--y);\r\n  touch-action: none;\r\n  will-change: transform, opacity, height;\r\n  transition: transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms;\r\n  box-sizing: border-box;\r\n  outline: none;\r\n  overflow-wrap: anywhere;\r\n}\r\n[data-sonner-toast][data-styled=\"true\"] {\r\n  padding: 16px;\r\n  background: var(--normal-bg);\r\n  border: 1px solid var(--normal-border);\r\n  color: var(--normal-text);\r\n  border-radius: var(--border-radius);\r\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);\r\n  width: var(--width);\r\n  font-size: 13px;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n}\r\n[data-sonner-toast]:focus-visible {\r\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2);\r\n}\r\n[data-sonner-toast][data-y-position=\"top\"] {\r\n  top: 0;\r\n  --y: translateY(-100%);\r\n  --lift: 1;\r\n  --lift-amount: calc(1 * var(--gap));\r\n}\r\n[data-sonner-toast][data-y-position=\"bottom\"] {\r\n  bottom: 0;\r\n  --y: translateY(100%);\r\n  --lift: -1;\r\n  --lift-amount: calc(var(--lift) * var(--gap));\r\n}\r\n[data-sonner-toast] [data-description] {\r\n  font-weight: 400;\r\n  line-height: 1.4;\r\n  color: inherit;\r\n}\r\n[data-sonner-toast] [data-title] {\r\n  font-weight: 500;\r\n  line-height: 1.5;\r\n  color: inherit;\r\n}\r\n[data-sonner-toast] [data-icon] {\r\n  display: flex;\r\n  height: 16px;\r\n  width: 16px;\r\n  position: relative;\r\n  justify-content: flex-start;\r\n  align-items: center;\r\n  flex-shrink: 0;\r\n  margin-left: var(--toast-icon-margin-start);\r\n  margin-right: var(--toast-icon-margin-end);\r\n}\r\n[data-sonner-toast][data-promise=\"true\"] [data-icon] > svg {\r\n  opacity: 0;\r\n  transform: scale(0.8);\r\n  transform-origin: center;\r\n  animation: sonner-fade-in 300ms ease forwards;\r\n}\r\n[data-sonner-toast] [data-icon] > * {\r\n  flex-shrink: 0;\r\n}\r\n[data-sonner-toast] [data-icon] svg {\r\n  margin-left: var(--toast-svg-margin-start);\r\n  margin-right: var(--toast-svg-margin-end);\r\n}\r\n[data-sonner-toast] [data-content] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 2px;\r\n}\r\n[data-sonner-toast] [data-button] {\r\n  border-radius: 4px;\r\n  padding-left: 8px;\r\n  padding-right: 8px;\r\n  height: 24px;\r\n  font-size: 12px;\r\n  color: var(--normal-bg);\r\n  background: var(--normal-text);\r\n  margin-left: var(--toast-button-margin-start);\r\n  margin-right: var(--toast-button-margin-end);\r\n  border: none;\r\n  cursor: pointer;\r\n  outline: none;\r\n  display: flex;\r\n  align-items: center;\r\n  flex-shrink: 0;\r\n  transition: opacity 400ms, box-shadow 200ms;\r\n}\r\n[data-sonner-toast] [data-button]:focus-visible {\r\n  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);\r\n}\r\n[data-sonner-toast] [data-button]:first-of-type {\r\n  margin-left: var(--toast-button-margin-start);\r\n  margin-right: var(--toast-button-margin-end);\r\n}\r\n[data-sonner-toast] [data-cancel] {\r\n  color: var(--normal-text);\r\n  background: rgba(0, 0, 0, 0.08);\r\n}\r\n[data-sonner-toast][data-theme=\"dark\"] [data-cancel] {\r\n  background: rgba(255, 255, 255, 0.3);\r\n}\r\n[data-sonner-toast] [data-close-button] {\r\n  position: absolute;\r\n  left: var(--toast-close-button-start);\r\n  right: var(--toast-close-button-end);\r\n  top: 0;\r\n  height: 20px;\r\n  width: 20px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  padding: 0;\r\n  background: var(--gray1);\r\n  color: var(--gray12);\r\n  border: 1px solid var(--gray4);\r\n  transform: var(--toast-close-button-transform);\r\n  border-radius: 50%;\r\n  cursor: pointer;\r\n  z-index: 1;\r\n  transition: opacity 100ms, background 200ms, border-color 200ms;\r\n}\r\n[data-sonner-toast] [data-close-button]:focus-visible {\r\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2);\r\n}\r\n[data-sonner-toast] [data-disabled=\"true\"] {\r\n  cursor: not-allowed;\r\n}\r\n[data-sonner-toast]:hover [data-close-button]:hover {\r\n  background: var(--gray2);\r\n  border-color: var(--gray5);\r\n}\r\n[data-sonner-toast][data-swiping=\"true\"]:before {\r\n  content: \"\";\r\n  position: absolute;\r\n  left: 0;\r\n  right: 0;\r\n  height: 100%;\r\n  z-index: -1;\r\n}\r\n[data-sonner-toast][data-y-position=\"top\"][data-swiping=\"true\"]:before {\r\n  bottom: 50%;\r\n  transform: scaleY(3) translateY(50%);\r\n}\r\n[data-sonner-toast][data-y-position=\"bottom\"][data-swiping=\"true\"]:before {\r\n  top: 50%;\r\n  transform: scaleY(3) translateY(-50%);\r\n}\r\n[data-sonner-toast][data-swiping=\"false\"][data-removed=\"true\"]:before {\r\n  content: \"\";\r\n  position: absolute;\r\n  inset: 0;\r\n  transform: scaleY(2);\r\n}\r\n[data-sonner-toast]:after {\r\n  content: \"\";\r\n  position: absolute;\r\n  left: 0;\r\n  height: calc(var(--gap) + 1px);\r\n  bottom: 100%;\r\n  width: 100%;\r\n}\r\n[data-sonner-toast][data-mounted=\"true\"] {\r\n  --y: translateY(0);\r\n  opacity: 1;\r\n}\r\n[data-sonner-toast][data-expanded=\"false\"][data-front=\"false\"] {\r\n  --scale: var(--toasts-before) * 0.05 + 1;\r\n  --y: translateY(calc(var(--lift-amount) * var(--toasts-before)))\r\n    scale(calc(-1 * var(--scale)));\r\n  height: var(--front-toast-height);\r\n}\r\n[data-sonner-toast] > * {\r\n  transition: opacity 400ms;\r\n}\r\n[data-sonner-toast][data-expanded=\"false\"][data-front=\"false\"][data-styled=\"true\"]\r\n  > * {\r\n  opacity: 0;\r\n}\r\n[data-sonner-toast][data-visible=\"false\"] {\r\n  opacity: 0;\r\n  pointer-events: none;\r\n}\r\n[data-sonner-toast][data-mounted=\"true\"][data-expanded=\"true\"] {\r\n  --y: translateY(calc(var(--lift) * var(--offset)));\r\n  height: var(--initial-height);\r\n}\r\n[data-sonner-toast][data-removed=\"true\"][data-front=\"true\"][data-swipe-out=\"false\"] {\r\n  --y: translateY(calc(var(--lift) * -100%));\r\n  opacity: 0;\r\n}\r\n[data-sonner-toast][data-removed=\"true\"][data-front=\"false\"][data-swipe-out=\"false\"][data-expanded=\"true\"] {\r\n  --y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));\r\n  opacity: 0;\r\n}\r\n[data-sonner-toast][data-removed=\"true\"][data-front=\"false\"][data-swipe-out=\"false\"][data-expanded=\"false\"] {\r\n  --y: translateY(40%);\r\n  opacity: 0;\r\n  transition: transform 500ms, opacity 200ms;\r\n}\r\n[data-sonner-toast][data-removed=\"true\"][data-front=\"false\"]:before {\r\n  height: calc(var(--initial-height) + 20%);\r\n}\r\n[data-sonner-toast][data-swiping=\"true\"] {\r\n  transform: var(--y) translateY(var(--swipe-amount, 0px));\r\n  transition: none;\r\n}\r\n[data-sonner-toast][data-swipe-out=\"true\"][data-y-position=\"bottom\"],\r\n[data-sonner-toast][data-swipe-out=\"true\"][data-y-position=\"top\"] {\r\n  animation: swipe-out 200ms ease-out forwards;\r\n}\r\n@keyframes swipe-out {\r\n  from {\r\n    transform: translateY(\r\n      calc(var(--lift) * var(--offset) + var(--swipe-amount))\r\n    );\r\n    opacity: 1;\r\n  }\r\n  to {\r\n    transform: translateY(\r\n      calc(\r\n        var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%\r\n      )\r\n    );\r\n    opacity: 0;\r\n  }\r\n}\r\n@media (max-width: 600px) {\r\n  [data-sonner-toaster] {\r\n    position: fixed;\r\n    --mobile-offset: 16px;\r\n    right: var(--mobile-offset);\r\n    left: var(--mobile-offset);\r\n    width: 100%;\r\n  }\r\n  [data-sonner-toaster] [data-sonner-toast] {\r\n    left: 0;\r\n    right: 0;\r\n    width: calc(100% - 32px);\r\n  }\r\n  [data-sonner-toaster][data-x-position=\"left\"] {\r\n    left: var(--mobile-offset);\r\n  }\r\n  [data-sonner-toaster][data-y-position=\"bottom\"] {\r\n    bottom: 20px;\r\n  }\r\n  [data-sonner-toaster][data-y-position=\"top\"] {\r\n    top: 20px;\r\n  }\r\n  [data-sonner-toaster][data-x-position=\"center\"] {\r\n    left: var(--mobile-offset);\r\n    right: var(--mobile-offset);\r\n    transform: none;\r\n  }\r\n}\r\n[data-sonner-toaster][data-theme=\"light\"] {\r\n  --normal-bg: #fff;\r\n  --normal-border: var(--gray4);\r\n  --normal-text: var(--gray12);\r\n  --success-bg: hsl(143, 85%, 96%);\r\n  --success-border: hsl(145, 92%, 91%);\r\n  --success-text: hsl(140, 100%, 27%);\r\n  --info-bg: hsl(208, 100%, 97%);\r\n  --info-border: hsl(221, 91%, 91%);\r\n  --info-text: hsl(210, 92%, 45%);\r\n  --warning-bg: hsl(49, 100%, 97%);\r\n  --warning-border: hsl(49, 91%, 91%);\r\n  --warning-text: hsl(31, 92%, 45%);\r\n  --error-bg: hsl(359, 100%, 97%);\r\n  --error-border: hsl(359, 100%, 94%);\r\n  --error-text: hsl(360, 100%, 45%);\r\n}\r\n[data-sonner-toaster][data-theme=\"light\"]\r\n  [data-sonner-toast][data-invert=\"true\"] {\r\n  --normal-bg: #000;\r\n  --normal-border: hsl(0, 0%, 20%);\r\n  --normal-text: var(--gray1);\r\n}\r\n[data-sonner-toaster][data-theme=\"dark\"]\r\n  [data-sonner-toast][data-invert=\"true\"] {\r\n  --normal-bg: #fff;\r\n  --normal-border: var(--gray3);\r\n  --normal-text: var(--gray12);\r\n}\r\n[data-sonner-toaster][data-theme=\"dark\"] {\r\n  --normal-bg: #000;\r\n  --normal-border: hsl(0, 0%, 20%);\r\n  --normal-text: var(--gray1);\r\n  --success-bg: hsl(150, 100%, 6%);\r\n  --success-border: hsl(147, 100%, 12%);\r\n  --success-text: hsl(150, 86%, 65%);\r\n  --info-bg: hsl(215, 100%, 6%);\r\n  --info-border: hsl(223, 100%, 12%);\r\n  --info-text: hsl(216, 87%, 65%);\r\n  --warning-bg: hsl(64, 100%, 6%);\r\n  --warning-border: hsl(60, 100%, 12%);\r\n  --warning-text: hsl(46, 87%, 65%);\r\n  --error-bg: hsl(358, 76%, 10%);\r\n  --error-border: hsl(357, 89%, 16%);\r\n  --error-text: hsl(358, 100%, 81%);\r\n}\r\n[data-rich-colors=\"true\"] [data-sonner-toast][data-type=\"success\"] {\r\n  background: var(--success-bg);\r\n  border-color: var(--success-border);\r\n  color: var(--success-text);\r\n}\r\n[data-rich-colors=\"true\"]\r\n  [data-sonner-toast][data-type=\"success\"]\r\n  [data-close-button] {\r\n  background: var(--success-bg);\r\n  border-color: var(--success-border);\r\n  color: var(--success-text);\r\n}\r\n[data-rich-colors=\"true\"] [data-sonner-toast][data-type=\"info\"] {\r\n  background: var(--info-bg);\r\n  border-color: var(--info-border);\r\n  color: var(--info-text);\r\n}\r\n[data-rich-colors=\"true\"]\r\n  [data-sonner-toast][data-type=\"info\"]\r\n  [data-close-button] {\r\n  background: var(--info-bg);\r\n  border-color: var(--info-border);\r\n  color: var(--info-text);\r\n}\r\n[data-rich-colors=\"true\"] [data-sonner-toast][data-type=\"warning\"] {\r\n  background: var(--warning-bg);\r\n  border-color: var(--warning-border);\r\n  color: var(--warning-text);\r\n}\r\n[data-rich-colors=\"true\"]\r\n  [data-sonner-toast][data-type=\"warning\"]\r\n  [data-close-button] {\r\n  background: var(--warning-bg);\r\n  border-color: var(--warning-border);\r\n  color: var(--warning-text);\r\n}\r\n[data-rich-colors=\"true\"] [data-sonner-toast][data-type=\"error\"] {\r\n  background: var(--error-bg);\r\n  border-color: var(--error-border);\r\n  color: var(--error-text);\r\n}\r\n[data-rich-colors=\"true\"]\r\n  [data-sonner-toast][data-type=\"error\"]\r\n  [data-close-button] {\r\n  background: var(--error-bg);\r\n  border-color: var(--error-border);\r\n  color: var(--error-text);\r\n}\r\n.sonner-loading-wrapper {\r\n  --size: 16px;\r\n  height: var(--size);\r\n  width: var(--size);\r\n  position: absolute;\r\n  inset: 0;\r\n  z-index: 10;\r\n}\r\n.sonner-loading-wrapper[data-visible=\"false\"] {\r\n  transform-origin: center;\r\n  animation: sonner-fade-out 0.2s ease forwards;\r\n}\r\n.sonner-spinner {\r\n  position: relative;\r\n  top: 50%;\r\n  left: 50%;\r\n  height: var(--size);\r\n  width: var(--size);\r\n}\r\n.sonner-loading-bar {\r\n  animation: sonner-spin 1.2s linear infinite;\r\n  background: var(--gray11);\r\n  border-radius: 6px;\r\n  height: 8%;\r\n  left: -10%;\r\n  position: absolute;\r\n  top: -3.9%;\r\n  width: 24%;\r\n}\r\n.sonner-loading-bar:nth-child(1) {\r\n  animation-delay: -1.2s;\r\n  transform: rotate(0.0001deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(2) {\r\n  animation-delay: -1.1s;\r\n  transform: rotate(30deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(3) {\r\n  animation-delay: -1s;\r\n  transform: rotate(60deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(4) {\r\n  animation-delay: -0.9s;\r\n  transform: rotate(90deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(5) {\r\n  animation-delay: -0.8s;\r\n  transform: rotate(120deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(6) {\r\n  animation-delay: -0.7s;\r\n  transform: rotate(150deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(7) {\r\n  animation-delay: -0.6s;\r\n  transform: rotate(180deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(8) {\r\n  animation-delay: -0.5s;\r\n  transform: rotate(210deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(9) {\r\n  animation-delay: -0.4s;\r\n  transform: rotate(240deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(10) {\r\n  animation-delay: -0.3s;\r\n  transform: rotate(270deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(11) {\r\n  animation-delay: -0.2s;\r\n  transform: rotate(300deg) translate(146%);\r\n}\r\n.sonner-loading-bar:nth-child(12) {\r\n  animation-delay: -0.1s;\r\n  transform: rotate(330deg) translate(146%);\r\n}\r\n@keyframes sonner-fade-in {\r\n  0% {\r\n    opacity: 0;\r\n    transform: scale(0.8);\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n    transform: scale(1);\r\n  }\r\n}\r\n@keyframes sonner-fade-out {\r\n  0% {\r\n    opacity: 1;\r\n    transform: scale(1);\r\n  }\r\n  100% {\r\n    opacity: 0;\r\n    transform: scale(0.8);\r\n  }\r\n}\r\n@keyframes sonner-spin {\r\n  0% {\r\n    opacity: 1;\r\n  }\r\n  100% {\r\n    opacity: 0.15;\r\n  }\r\n}\r\n@media (prefers-reduced-motion) {\r\n  [data-sonner-toast],\r\n  [data-sonner-toast] > *,\r\n  .sonner-loading-bar {\r\n    transition: none !important;\r\n    animation: none !important;\r\n  }\r\n}\r\n.sonner-loader {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%);\r\n  transform-origin: center;\r\n  transition: opacity 200ms, transform 200ms;\r\n}\r\n.sonner-loader[data-visible=\"false\"] {\r\n  opacity: 0;\r\n  transform: scale(0.8) translate(-50%, -50%);\r\n}");}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}

})();
const sharedConfig = {
  context: undefined,
  registry: undefined,
  effects: undefined,
  done: false,
  getContextId() {
    return getContextId(this.context.count);
  },
  getNextContextId() {
    return getContextId(this.context.count++);
  }
};
function getContextId(count) {
  const num = String(count),
    len = num.length - 1;
  return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
}
function setHydrateContext(context) {
  sharedConfig.context = context;
}

const IS_DEV = false;
const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const SUPPORTS_PROXY = typeof Proxy === "function";
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
const NO_INIT = {};
var Owner = null;
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
    owner = Owner,
    unowned = fn.length === 0,
    current = detachedOwner === undefined ? owner : detachedOwner,
    root = unowned
      ? UNOWNED
      : {
          owned: null,
          cleanups: null,
          context: current ? current.context : null,
          owner: current
        },
    updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || undefined
  };
  const setter = value => {
    if (typeof value === "function") {
      value = value(s.value);
    }
    return writeSignal(s, value);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE),
    s = SuspenseContext && useContext(SuspenseContext);
  if (s) c.suspense = s;
  if (!options || !options.render) c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function isPromise(v) {
  return v && typeof v === "object" && "then" in v;
}
function createResource(pSource, pFetcher, pOptions) {
  let source;
  let fetcher;
  let options;
  {
    source = true;
    fetcher = pSource;
    options = {};
  }
  let pr = null,
    initP = NO_INIT,
    id = null,
    scheduled = false,
    resolved = "initialValue" in options,
    dynamic = typeof source === "function" && createMemo(source);
  const contexts = new Set(),
    [value, setValue] = (options.storage || createSignal)(options.initialValue),
    [error, setError] = createSignal(undefined),
    [track, trigger] = createSignal(undefined, {
      equals: false
    }),
    [state, setState] = createSignal(resolved ? "ready" : "unresolved");
  if (sharedConfig.context) {
    id = sharedConfig.getNextContextId();
    if (options.ssrLoadFrom === "initial") initP = options.initialValue;
    else if (sharedConfig.load && sharedConfig.has(id)) initP = sharedConfig.load(id);
  }
  function loadEnd(p, v, error, key) {
    if (pr === p) {
      pr = null;
      key !== undefined && (resolved = true);
      if ((p === initP || v === initP) && options.onHydrated)
        queueMicrotask(() =>
          options.onHydrated(key, {
            value: v
          })
        );
      initP = NO_INIT;
      completeLoad(v, error);
    }
    return v;
  }
  function completeLoad(v, err) {
    runUpdates(() => {
      if (err === undefined) setValue(() => v);
      setState(err !== undefined ? "errored" : resolved ? "ready" : "unresolved");
      setError(err);
      for (const c of contexts.keys()) c.decrement();
      contexts.clear();
    }, false);
  }
  function read() {
    const c = SuspenseContext && useContext(SuspenseContext),
      v = value(),
      err = error();
    if (err !== undefined && !pr) throw err;
    if (Listener && !Listener.user && c) {
      createComputed(() => {
        track();
        if (pr) {
          if (c.resolved && Transition) ;
          else if (!contexts.has(c)) {
            c.increment();
            contexts.add(c);
          }
        }
      });
    }
    return v;
  }
  function load(refetching = true) {
    if (refetching !== false && scheduled) return;
    scheduled = false;
    const lookup = dynamic ? dynamic() : source;
    if (lookup == null || lookup === false) {
      loadEnd(pr, untrack(value));
      return;
    }
    const p =
      initP !== NO_INIT
        ? initP
        : untrack(() =>
            fetcher(lookup, {
              value: value(),
              refetching
            })
          );
    if (!isPromise(p)) {
      loadEnd(pr, p, undefined, lookup);
      return p;
    }
    pr = p;
    if ("value" in p) {
      if (p.status === "success") loadEnd(pr, p.value, undefined, lookup);
      else loadEnd(pr, undefined, castError(p.value), lookup);
      return p;
    }
    scheduled = true;
    queueMicrotask(() => (scheduled = false));
    runUpdates(() => {
      setState(resolved ? "refreshing" : "pending");
      trigger();
    }, false);
    return p.then(
      v => loadEnd(p, v, undefined, lookup),
      e => loadEnd(p, undefined, castError(e), lookup)
    );
  }
  Object.defineProperties(read, {
    state: {
      get: () => state()
    },
    error: {
      get: () => error()
    },
    loading: {
      get() {
        const s = state();
        return s === "pending" || s === "refreshing";
      }
    },
    latest: {
      get() {
        if (!resolved) return read();
        const err = error();
        if (err && !pr) throw err;
        return value();
      }
    }
  });
  if (dynamic) createComputed(() => load(false));
  else load(false);
  return [
    read,
    {
      refetch: load,
      mutate: setValue
    }
  ];
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function on(deps, fn, options) {
  const isArray = Array.isArray(deps);
  let prevInput;
  return prevValue => {
    let input;
    if (isArray) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else input = deps();
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null);
  else if (Owner.cleanups === null) Owner.cleanups = [fn];
  else Owner.cleanups.push(fn);
  return fn;
}
function getListener() {
  return Listener;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o;
  Listener = null;
  try {
    return runUpdates(fn, true);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
    Listener = prevListener;
  }
}
const [transPending, setTransPending] = /*@__PURE__*/ createSignal(false);
function resumeEffects(e) {
  Effects.push.apply(Effects, e);
  e.length = 0;
}
function createContext(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let value;
  return Owner && Owner.context && (value = Owner.context[context.id]) !== undefined
    ? value
    : context.defaultValue;
}
function children(fn) {
  const children = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
let SuspenseContext;
function getSuspenseContext() {
  return SuspenseContext || (SuspenseContext = createContext());
}
function readSignal() {
  if (this.sources && (this.state)) {
    if ((this.state) === STALE) updateComputation(this);
    else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current =
    node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);
            else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (IS_DEV);
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(
    node,
    node.value,
    time
  );
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner,
    listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    node.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null);
  else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];
      else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  if ((node.state) === 0) return;
  if ((node.state) === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if ((node.state) === STALE) {
      updateComputation(node);
    } else if ((node.state) === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;
  else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i,
    userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);
    else queue[userLength++] = e;
  }
  if (sharedConfig.context) {
    if (sharedConfig.count) {
      sharedConfig.effects || (sharedConfig.effects = []);
      sharedConfig.effects.push(...queue.slice(0, userLength));
      return;
    }
    setHydrateContext();
  }
  if (sharedConfig.effects && (sharedConfig.done || !sharedConfig.count)) {
    queue = [...sharedConfig.effects, ...queue];
    userLength += sharedConfig.effects.length;
    delete sharedConfig.effects;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
          runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);
      else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
        index = node.sourceSlots.pop(),
        obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
          s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
    delete node.tOwned;
  }
  if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(
      () =>
        (res = untrack(() => {
          Owner.context = {
            ...Owner.context,
            [id]: props.value
          };
          return children(() => props.children);
        })),
      undefined
    );
    return res;
  };
}

const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [],
    mapped = [],
    disposers = [],
    len = 0,
    indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [],
      newLen = newItems.length,
      i,
      j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      } else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (
          start = 0, end = Math.min(len, newLen);
          start < end && items[start] === newItems[start];
          start++
        );
        for (
          end = len - 1, newEnd = newLen - 1;
          end >= start && newEnd >= start && items[end] === newItems[newEnd];
          end--, newEnd--
        ) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, (len = newLen));
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY) return true;
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v = this[i]();
    if (v !== undefined) return v;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || (!!s && $PROXY in s);
    sources[i] = typeof s === "function" ? ((proxy = true), createMemo(s)) : s;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy(
      {
        get(property) {
          for (let i = sources.length - 1; i >= 0; i--) {
            const v = resolveSource(sources[i])[property];
            if (v !== undefined) return v;
          }
        },
        has(property) {
          for (let i = sources.length - 1; i >= 0; i--) {
            if (property in resolveSource(sources[i])) return true;
          }
          return false;
        },
        keys() {
          const keys = [];
          for (let i = 0; i < sources.length; i++)
            keys.push(...Object.keys(resolveSource(sources[i])));
          return [...new Set(keys)];
        }
      },
      propTraps
    );
  }
  const sourcesMap = {};
  const defined = Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i = sourceKeys.length - 1; i >= 0; i--) {
      const key = sourceKeys[i];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get
          ? {
              enumerable: true,
              configurable: true,
              get: resolveSources.bind((sourcesMap[key] = [desc.get.bind(source)]))
            }
          : desc.value !== undefined
          ? desc
          : undefined;
      } else {
        const sources = sourcesMap[key];
        if (sources) {
          if (desc.get) sources.push(desc.get.bind(source));
          else if (desc.value !== undefined) sources.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i],
      desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);
    else target[key] = desc ? desc.value : undefined;
  }
  return target;
}

const narrowedError = name => `Stale read from <${name}>.`;
function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || undefined));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, undefined, undefined);
  const condition = keyed
    ? conditionValue
    : createMemo(conditionValue, undefined, {
        equals: (a, b) => !a === !b
      });
  return createMemo(
    () => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn
          ? untrack(() =>
              child(
                keyed
                  ? c
                  : () => {
                      if (!untrack(condition)) throw narrowedError("Show");
                      return conditionValue();
                    }
              )
            )
          : child;
      }
      return props.fallback;
    },
    undefined,
    undefined
  );
}
function Switch(props) {
  const chs = children(() => props.children);
  const switchFunc = createMemo(() => {
    const ch = chs();
    const mps = Array.isArray(ch) ? ch : [ch];
    let func = () => undefined;
    for (let i = 0; i < mps.length; i++) {
      const index = i;
      const mp = mps[i];
      const prevFunc = func;
      const conditionValue = createMemo(
        () => (prevFunc() ? undefined : mp.when),
        undefined,
        undefined
      );
      const condition = mp.keyed
        ? conditionValue
        : createMemo(conditionValue, undefined, {
            equals: (a, b) => !a === !b
          });
      func = () => prevFunc() || (condition() ? [index, conditionValue, mp] : undefined);
    }
    return func;
  });
  return createMemo(
    () => {
      const sel = switchFunc()();
      if (!sel) return props.fallback;
      const [index, conditionValue, mp] = sel;
      const child = mp.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn
        ? untrack(() =>
            child(
              mp.keyed
                ? conditionValue()
                : () => {
                    if (untrack(switchFunc)()?.[0] !== index) throw narrowedError("Match");
                    return conditionValue();
                  }
            )
          )
        : child;
    },
    undefined,
    undefined
  );
}
function Match(props) {
  return props;
}
const SuspenseListContext = /* #__PURE__ */ createContext();
function Suspense(props) {
  let counter = 0,
    show,
    ctx,
    p,
    flicker,
    error;
  const [inFallback, setFallback] = createSignal(false),
    SuspenseContext = getSuspenseContext(),
    store = {
      increment: () => {
        if (++counter === 1) setFallback(true);
      },
      decrement: () => {
        if (--counter === 0) setFallback(false);
      },
      inFallback,
      effects: [],
      resolved: false
    },
    owner = getOwner();
  if (sharedConfig.context && sharedConfig.load) {
    const key = sharedConfig.getContextId();
    let ref = sharedConfig.load(key);
    if (ref) {
      if (typeof ref !== "object" || ref.status !== "success") p = ref;
      else sharedConfig.gather(key);
    }
    if (p && p !== "$$f") {
      const [s, set] = createSignal(undefined, {
        equals: false
      });
      flicker = s;
      p.then(
        () => {
          if (sharedConfig.done) return set();
          sharedConfig.gather(key);
          setHydrateContext(ctx);
          set();
          setHydrateContext();
        },
        err => {
          error = err;
          set();
        }
      );
    }
  }
  const listContext = useContext(SuspenseListContext);
  if (listContext) show = listContext.register(store.inFallback);
  let dispose;
  onCleanup(() => dispose && dispose());
  return createComponent(SuspenseContext.Provider, {
    value: store,
    get children() {
      return createMemo(() => {
        if (error) throw error;
        ctx = sharedConfig.context;
        if (flicker) {
          flicker();
          return (flicker = undefined);
        }
        if (ctx && p === "$$f") setHydrateContext();
        const rendered = createMemo(() => props.children);
        return createMemo(prev => {
          const inFallback = store.inFallback(),
            { showContent = true, showFallback = true } = show ? show() : {};
          if ((!inFallback || (p && p !== "$$f")) && showContent) {
            store.resolved = true;
            dispose && dispose();
            dispose = ctx = p = undefined;
            resumeEffects(store.effects);
            return rendered();
          }
          if (!showFallback) return;
          if (dispose) return prev;
          return createRoot(disposer => {
            dispose = disposer;
            if (ctx) {
              setHydrateContext({
                id: ctx.id + "F",
                count: 0
              });
              ctx = undefined;
            }
            return props.fallback;
          }, owner);
        });
      });
    }
  });
}

const booleans = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
];
const Properties = /*#__PURE__*/ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...booleans
]);
const ChildProperties = /*#__PURE__*/ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]);
const Aliases = /*#__PURE__*/ Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases = /*#__PURE__*/ Object.assign(Object.create(null), {
  class: "className",
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? (a[tagName] ? a["$"] : undefined) : a;
}
const DelegatedEvents = /*#__PURE__*/ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]);

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
    aEnd = a.length,
    bEnd = bLength,
    aStart = 0,
    bStart = 0,
    after = a[aEnd - 1].nextSibling,
    map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? (bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart]) : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
            sequence = 1,
            t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}

const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document
      ? code()
      : insert(element, code(), element.firstChild ? null : undefined, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isImportNode, isSVG, isMathML) {
  let node;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstChild;
  };
  const fn = () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document = window.document) {
  const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}
function setBoolAttribute(node, name, value) {
  if (isHydrating(node)) return;
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute("class");
  else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, (handler[0] = e => handlerFn.call(node, handler[1], e)));
  } else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}),
    prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return (nodeStyle.cssText = value);
  typeof prev === "string" && (nodeStyle.cssText = prev = undefined);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  {
    createRenderEffect(
      () => (prevProps.children = insertExpression(node, props.children, prevProps.children))
    );
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function isHydrating(node) {
  return !!sharedConfig.context && !sharedConfig.done && (!node || node.isConnected);
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++)
    node.classList.toggle(classNames[i], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node, value, prev);
  if (prop === "classList") return classList(node, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node.removeEventListener(e, prev, true);
    value && node.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node, prop.slice(5), value);
  } else if (
    (forceProp = prop.slice(0, 5) === "prop:") ||
    (isChildProp = ChildProperties.has(prop)) ||
    (((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop)))) ||
    (isCE = node.nodeName.includes("-") || "is" in props)
  ) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    } else if (isHydrating(node)) return value;
    if (prop === "class" || prop === "className") className(node, value);
    else if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;
    else node[propAlias || prop] = value;
  } else {
    setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  if (sharedConfig.registry && sharedConfig.events) {
    if (sharedConfig.events.find(([el, ev]) => ev === e)) return;
  }
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = value =>
    Object.defineProperty(e, "target", {
      configurable: true,
      value
    });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host &&
      typeof node.host !== "string" &&
      !node.host._$host &&
      node.contains(e.target) &&
      retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host));
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = _$HY.done = true;
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  const hydrating = isHydrating(parent);
  if (hydrating) {
    !current && (current = [...parent.childNodes]);
    let cleaned = [];
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (node.nodeType === 8 && node.data.slice(0, 2) === "!$") node.remove();
      else cleaned.push(node);
    }
    current = cleaned;
  }
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
    multi = marker !== undefined;
  parent = (multi && current[0] && current[0].parentNode) || parent;
  if (t === "string" || t === "number") {
    if (hydrating) return current;
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (hydrating) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => (current = insertExpression(parent, array, current, marker, true)));
      return () => current;
    }
    if (hydrating) {
      if (!array.length) return current;
      if (marker === undefined) return (current = [...parent.childNodes]);
      let node = array[0];
      if (node.parentNode !== parent) return current;
      const nodes = [node];
      while ((node = node.nextSibling) !== marker) nodes.push(node);
      return (current = nodes);
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (hydrating && value.parentNode) return (current = multi ? [value] : value);
    if (Array.isArray(current)) {
      if (multi) return (current = cleanChildren(parent, current, marker, value));
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
      prev = current && current[normalized.length],
      t;
    if (item == null || item === true || item === false);
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic =
          normalizeIncomingArray(
            normalized,
            Array.isArray(item) ? item : [item],
            Array.isArray(prev) ? prev : [prev]
          ) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return (parent.textContent = "");
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i)
          isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
}
function Portal(props) {
  const { useShadow } = props,
    marker = document.createTextNode(""),
    mount = () => props.mount || document.body,
    owner = getOwner();
  let content;
  let hydrating = !!sharedConfig.context;
  createEffect(
    () => {
      if (hydrating) getOwner().user = hydrating = false;
      content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
      const el = mount();
      if (el instanceof HTMLHeadElement) {
        const [clean, setClean] = createSignal(false);
        const cleanup = () => setClean(true);
        createRoot(dispose => insert(el, () => (!clean() ? content() : dispose()), null));
        onCleanup(cleanup);
      } else {
        const container = createElement(props.isSVG ? "g" : "div", props.isSVG),
          renderRoot =
            useShadow && container.attachShadow
              ? container.attachShadow({
                  mode: "open"
                })
              : container;
        Object.defineProperty(container, "_$host", {
          get() {
            return marker.parentNode;
          },
          configurable: true
        });
        insert(renderRoot, content);
        el.appendChild(container);
        props.ref && props.ref(container);
        onCleanup(() => el.removeChild(container));
      }
    },
    undefined,
    {
      render: !hydrating
    }
  );
  return marker;
}

const $RAW = Symbol("store-raw"),
  $NODE = Symbol("store-node"),
  $HAS = Symbol("store-has"),
  $SELF = Symbol("store-self");
function wrap$1(value) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: (p = new Proxy(value, proxyTraps$1))
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value),
        desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          Object.defineProperty(value, prop, {
            enumerable: desc[prop].enumerable,
            get: desc[prop].get.bind(p)
          });
        }
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return (
    obj != null &&
    typeof obj === "object" &&
    (obj[$PROXY] ||
      !(proto = Object.getPrototypeOf(obj)) ||
      proto === Object.prototype ||
      Array.isArray(obj))
  );
}
function unwrap(item, set = new Set()) {
  let result, unwrapped, v, prop;
  if ((result = item != null && item[$RAW])) return result;
  if (!isWrappable(item) || set.has(item)) return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item)) item = item.slice(0);
    else set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item)) item = Object.assign({}, item);
    else set.add(item);
    const keys = Object.keys(item),
      desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get) continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
    }
  }
  return item;
}
function getNodes(target, symbol) {
  let nodes = target[symbol];
  if (!nodes)
    Object.defineProperty(target, symbol, {
      value: (nodes = Object.create(null))
    });
  return nodes;
}
function getNode(nodes, property, value) {
  if (nodes[property]) return nodes[property];
  const [s, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s.$ = set;
  return (nodes[property] = s);
}
function proxyDescriptor$1(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE)
    return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  getListener() && getNode(getNodes(target, $NODE), $SELF)();
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getNodes(target, $NODE);
    const tracked = nodes[property];
    let value = tracked ? tracked() : target[property];
    if (property === $NODE || property === $HAS || property === "__proto__") return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (
        getListener() &&
        (typeof value !== "function" || target.hasOwnProperty(property)) &&
        !(desc && desc.get)
      )
        value = getNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (
      property === $RAW ||
      property === $PROXY ||
      property === $TRACK ||
      property === $NODE ||
      property === $HAS ||
      property === "__proto__"
    )
      return true;
    getListener() && getNode(getNodes(target, $HAS), property)();
    return property in target;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys: ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor$1
};
function setProperty(state, property, value, deleting = false) {
  if (!deleting && state[property] === value) return;
  const prev = state[property],
    len = state.length;
  if (value === undefined) {
    delete state[property];
    if (state[$HAS] && state[$HAS][property] && prev !== undefined) state[$HAS][property].$();
  } else {
    state[property] = value;
    if (state[$HAS] && state[$HAS][property] && prev === undefined) state[$HAS][property].$();
  }
  let nodes = getNodes(state, $NODE),
    node;
  if ((node = getNode(nodes, property, prev))) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) {
    for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
    (node = getNode(nodes, "length", len)) && node.$(state.length);
  }
  (node = nodes[$SELF]) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
      len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
    prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
      isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const { from = 0, to = current.length - 1, by = 1 } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === undefined && value == undefined) return;
  value = unwrap(value);
  if (part === undefined || (isWrappable(prev) && isWrappable(value) && !Array.isArray(value))) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(...[store, options]) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1
        ? updateArray(unwrappedStore, args[0])
        : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}

const $ROOT = Symbol("store-root");
function applyState(target, parent, property, merge, key) {
  const previous = parent[property];
  if (target === previous) return;
  const isArray = Array.isArray(target);
  if (
    property !== $ROOT &&
    (!isWrappable(target) ||
      !isWrappable(previous) ||
      isArray !== Array.isArray(previous) ||
      (key && target[key] !== previous[key]))
  ) {
    setProperty(parent, property, target);
    return;
  }
  if (isArray) {
    if (
      target.length &&
      previous.length &&
      (!merge || (key && target[0] && target[0][key] != null))
    ) {
      let i, j, start, end, newEnd, item, newIndicesNext, keyVal;
      for (
        start = 0, end = Math.min(previous.length, target.length);
        start < end &&
        (previous[start] === target[start] ||
          (key && previous[start] && target[start] && previous[start][key] === target[start][key]));
        start++
      ) {
        applyState(target[start], previous, start, merge, key);
      }
      const temp = new Array(target.length),
        newIndices = new Map();
      for (
        end = previous.length - 1, newEnd = target.length - 1;
        end >= start &&
        newEnd >= start &&
        (previous[end] === target[newEnd] ||
          (key && previous[end] && target[newEnd] && previous[end][key] === target[newEnd][key]));
        end--, newEnd--
      ) {
        temp[newEnd] = previous[end];
      }
      if (start > newEnd || start > end) {
        for (j = start; j <= newEnd; j++) setProperty(previous, j, target[j]);
        for (; j < target.length; j++) {
          setProperty(previous, j, temp[j]);
          applyState(target[j], previous, j, merge, key);
        }
        if (previous.length > target.length) setProperty(previous, "length", target.length);
        return;
      }
      newIndicesNext = new Array(newEnd + 1);
      for (j = newEnd; j >= start; j--) {
        item = target[j];
        keyVal = key && item ? item[key] : item;
        i = newIndices.get(keyVal);
        newIndicesNext[j] = i === undefined ? -1 : i;
        newIndices.set(keyVal, j);
      }
      for (i = start; i <= end; i++) {
        item = previous[i];
        keyVal = key && item ? item[key] : item;
        j = newIndices.get(keyVal);
        if (j !== undefined && j !== -1) {
          temp[j] = previous[i];
          j = newIndicesNext[j];
          newIndices.set(keyVal, j);
        }
      }
      for (j = start; j < target.length; j++) {
        if (j in temp) {
          setProperty(previous, j, temp[j]);
          applyState(target[j], previous, j, merge, key);
        } else setProperty(previous, j, target[j]);
      }
    } else {
      for (let i = 0, len = target.length; i < len; i++) {
        applyState(target[i], previous, i, merge, key);
      }
    }
    if (previous.length > target.length) setProperty(previous, "length", target.length);
    return;
  }
  const targetKeys = Object.keys(target);
  for (let i = 0, len = targetKeys.length; i < len; i++) {
    applyState(target[targetKeys[i]], previous, targetKeys[i], merge, key);
  }
  const previousKeys = Object.keys(previous);
  for (let i = 0, len = previousKeys.length; i < len; i++) {
    if (target[previousKeys[i]] === undefined) setProperty(previous, previousKeys[i], undefined);
  }
}
function reconcile(value, options = {}) {
  const { merge, key = "id" } = options,
    v = unwrap(value);
  return state => {
    if (!isWrappable(state) || !isWrappable(v)) return v;
    const res = applyState(
      v,
      {
        [$ROOT]: state
      },
      $ROOT,
      merge,
      key
    );
    return res === undefined ? state : res;
  };
}
const producers = new WeakMap();
const setterTraps = {
  get(target, property) {
    if (property === $RAW) return target;
    const value = target[property];
    let proxy;
    return isWrappable(value)
      ? producers.get(value) ||
          (producers.set(value, (proxy = new Proxy(value, setterTraps))), proxy)
      : value;
  },
  set(target, property, value) {
    setProperty(target, property, unwrap(value));
    return true;
  },
  deleteProperty(target, property) {
    setProperty(target, property, undefined, true);
    return true;
  }
};
function produce(fn) {
  return state => {
    if (isWrappable(state)) {
      let proxy;
      if (!(proxy = producers.get(state))) {
        producers.set(state, (proxy = new Proxy(state, setterTraps)));
      }
      fn(proxy);
    }
    return state;
  };
}

var _tmpl$$5 = /* @__PURE__ */ template(`<div class=sonner-loading-wrapper><div class=sonner-spinner>`), _tmpl$2$4 = /* @__PURE__ */ template(`<div class=sonner-loading-bar>`), _tmpl$3$2 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"clip-rule=evenodd>`), _tmpl$4$2 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"clip-rule=evenodd>`), _tmpl$5$1 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"clip-rule=evenodd>`), _tmpl$6$1 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor height=20 width=20><path fill-rule=evenodd d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"clip-rule=evenodd>`), _tmpl$7 = /* @__PURE__ */ template(`<div class=sonner-loader>`), _tmpl$8 = /* @__PURE__ */ template(`<button aria-label="Close toast"data-close-button><svg xmlns=http://www.w3.org/2000/svg width=12 height=12 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round><line x1=18 y1=6 x2=6 y2=18></line><line x1=6 y1=6 x2=18 y2=18>`), _tmpl$9 = /* @__PURE__ */ template(`<li aria-atomic=true role=status tabindex=0 data-sonner-toast>`), _tmpl$10 = /* @__PURE__ */ template(`<div data-icon>`), _tmpl$11 = /* @__PURE__ */ template(`<div data-description>`), _tmpl$12 = /* @__PURE__ */ template(`<div data-content><div data-title>`), _tmpl$13 = /* @__PURE__ */ template(`<button data-button data-cancel>`), _tmpl$14 = /* @__PURE__ */ template(`<button data-button>`), _tmpl$15 = /* @__PURE__ */ template(`<section tabindex=-1>`), _tmpl$16 = /* @__PURE__ */ template(`<ol tabindex=-1 data-sonner-toaster>`);
function styleInject(css, {
  insertAt
} = {}) {
  if (typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
styleInject(':where(html[dir=ltr]),\n:where([data-sonner-toaster][dir=ltr]) {\n  --toast-icon-margin-start: -3px;\n  --toast-icon-margin-end: 4px;\n  --toast-svg-margin-start: -1px;\n  --toast-svg-margin-end: 0px;\n  --toast-button-margin-start: auto;\n  --toast-button-margin-end: 0;\n  --toast-close-button-start: 0;\n  --toast-close-button-end: unset;\n  --toast-close-button-transform: translate(-35%, -35%);\n}\n:where(html[dir=rtl]),\n:where([data-sonner-toaster][dir=rtl]) {\n  --toast-icon-margin-start: 4px;\n  --toast-icon-margin-end: -3px;\n  --toast-svg-margin-start: 0px;\n  --toast-svg-margin-end: -1px;\n  --toast-button-margin-start: 0;\n  --toast-button-margin-end: auto;\n  --toast-close-button-start: unset;\n  --toast-close-button-end: 0;\n  --toast-close-button-transform: translate(35%, -35%);\n}\n:where([data-sonner-toaster]) {\n  position: fixed;\n  width: var(--width);\n  font-family:\n    ui-sans-serif,\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    Roboto,\n    Helvetica Neue,\n    Arial,\n    Noto Sans,\n    sans-serif,\n    Apple Color Emoji,\n    Segoe UI Emoji,\n    Segoe UI Symbol,\n    Noto Color Emoji;\n  --gray1: hsl(0, 0%, 99%);\n  --gray2: hsl(0, 0%, 97.3%);\n  --gray3: hsl(0, 0%, 95.1%);\n  --gray4: hsl(0, 0%, 93%);\n  --gray5: hsl(0, 0%, 90.9%);\n  --gray6: hsl(0, 0%, 88.7%);\n  --gray7: hsl(0, 0%, 85.8%);\n  --gray8: hsl(0, 0%, 78%);\n  --gray9: hsl(0, 0%, 56.1%);\n  --gray10: hsl(0, 0%, 52.3%);\n  --gray11: hsl(0, 0%, 43.5%);\n  --gray12: hsl(0, 0%, 9%);\n  --border-radius: 8px;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  outline: none;\n  z-index: 999999999;\n}\n:where([data-sonner-toaster][data-x-position=right]) {\n  right: max(var(--offset), env(safe-area-inset-right));\n}\n:where([data-sonner-toaster][data-x-position=left]) {\n  left: max(var(--offset), env(safe-area-inset-left));\n}\n:where([data-sonner-toaster][data-x-position=center]) {\n  left: 50%;\n  transform: translateX(-50%);\n}\n:where([data-sonner-toaster][data-y-position=top]) {\n  top: max(var(--offset), env(safe-area-inset-top));\n}\n:where([data-sonner-toaster][data-y-position=bottom]) {\n  bottom: max(var(--offset), env(safe-area-inset-bottom));\n}\n:where([data-sonner-toast]) {\n  --y: translateY(100%);\n  --lift-amount: calc(var(--lift) * var(--gap));\n  z-index: var(--z-index);\n  position: absolute;\n  opacity: 0;\n  transform: var(--y);\n  filter: blur(0);\n  touch-action: none;\n  transition:\n    transform 400ms,\n    opacity 400ms,\n    height 400ms,\n    box-shadow 200ms;\n  box-sizing: border-box;\n  outline: none;\n  overflow-wrap: anywhere;\n}\n:where([data-sonner-toast][data-styled=true]) {\n  padding: 16px;\n  background: var(--normal-bg);\n  border: 1px solid var(--normal-border);\n  color: var(--normal-text);\n  border-radius: var(--border-radius);\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);\n  width: var(--width);\n  font-size: 13px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n:where([data-sonner-toast]:focus-visible) {\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2);\n}\n:where([data-sonner-toast][data-y-position=top]) {\n  top: 0;\n  --y: translateY(-100%);\n  --lift: 1;\n  --lift-amount: calc(1 * var(--gap));\n}\n:where([data-sonner-toast][data-y-position=bottom]) {\n  bottom: 0;\n  --y: translateY(100%);\n  --lift: -1;\n  --lift-amount: calc(var(--lift) * var(--gap));\n}\n:where([data-sonner-toast]) :where([data-description]) {\n  font-weight: 400;\n  line-height: 1.4;\n  color: inherit;\n}\n:where([data-sonner-toast]) :where([data-title]) {\n  font-weight: 500;\n  line-height: 1.5;\n  color: inherit;\n}\n:where([data-sonner-toast]) :where([data-icon]) {\n  display: flex;\n  height: 16px;\n  width: 16px;\n  position: relative;\n  justify-content: flex-start;\n  align-items: center;\n  flex-shrink: 0;\n  margin-left: var(--toast-icon-margin-start);\n  margin-right: var(--toast-icon-margin-end);\n}\n:where([data-sonner-toast][data-promise=true]) :where([data-icon]) > svg {\n  opacity: 0;\n  transform: scale(0.8);\n  transform-origin: center;\n  animation: sonner-fade-in 300ms ease forwards;\n}\n:where([data-sonner-toast]) :where([data-icon]) > * {\n  flex-shrink: 0;\n}\n:where([data-sonner-toast]) :where([data-icon]) svg {\n  margin-left: var(--toast-svg-margin-start);\n  margin-right: var(--toast-svg-margin-end);\n}\n:where([data-sonner-toast]) :where([data-content]) {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n[data-sonner-toast][data-styled=true] [data-button] {\n  border-radius: 4px;\n  padding-left: 8px;\n  padding-right: 8px;\n  height: 24px;\n  font-size: 12px;\n  color: var(--normal-bg);\n  background: var(--normal-text);\n  margin-left: var(--toast-button-margin-start);\n  margin-right: var(--toast-button-margin-end);\n  border: none;\n  cursor: pointer;\n  outline: none;\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  transition: opacity 400ms, box-shadow 200ms;\n}\n:where([data-sonner-toast]) :where([data-button]):focus-visible {\n  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);\n}\n:where([data-sonner-toast]) :where([data-button]):first-of-type {\n  margin-left: var(--toast-button-margin-start);\n  margin-right: var(--toast-button-margin-end);\n}\n:where([data-sonner-toast]) :where([data-cancel]) {\n  color: var(--normal-text);\n  background: rgba(0, 0, 0, 0.08);\n}\n:where([data-sonner-toast][data-theme=dark]) :where([data-cancel]) {\n  background: rgba(255, 255, 255, 0.3);\n}\n:where([data-sonner-toast]) :where([data-close-button]) {\n  position: absolute;\n  left: var(--toast-close-button-start);\n  right: var(--toast-close-button-end);\n  top: 0;\n  height: 20px;\n  width: 20px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  background: var(--gray1);\n  color: var(--gray12);\n  border: 1px solid var(--gray4);\n  transform: var(--toast-close-button-transform);\n  border-radius: 50%;\n  cursor: pointer;\n  z-index: 1;\n  transition:\n    opacity 100ms,\n    background 200ms,\n    border-color 200ms;\n}\n:where([data-sonner-toast]) :where([data-close-button]):focus-visible {\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2);\n}\n:where([data-sonner-toast]) :where([data-disabled=true]) {\n  cursor: not-allowed;\n}\n:where([data-sonner-toast]):hover :where([data-close-button]):hover {\n  background: var(--gray2);\n  border-color: var(--gray5);\n}\n:where([data-sonner-toast][data-swiping=true])::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 100%;\n  z-index: -1;\n}\n:where([data-sonner-toast][data-y-position=top][data-swiping=true])::before {\n  bottom: 50%;\n  transform: scaleY(3) translateY(50%);\n}\n:where([data-sonner-toast][data-y-position=bottom][data-swiping=true])::before {\n  top: 50%;\n  transform: scaleY(3) translateY(-50%);\n}\n:where([data-sonner-toast][data-swiping=false][data-removed=true])::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  transform: scaleY(2);\n}\n:where([data-sonner-toast])::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  height: calc(var(--gap) + 1px);\n  bottom: 100%;\n  width: 100%;\n}\n:where([data-sonner-toast][data-mounted=true]) {\n  --y: translateY(0);\n  opacity: 1;\n}\n:where([data-sonner-toast][data-expanded=false][data-front=false]) {\n  --scale: var(--toasts-before) * 0.05 + 1;\n  --y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));\n  height: var(--front-toast-height);\n}\n:where([data-sonner-toast]) > * {\n  transition: opacity 400ms;\n}\n:where([data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]) > * {\n  opacity: 0;\n}\n:where([data-sonner-toast][data-visible=false]) {\n  opacity: 0;\n  pointer-events: none;\n}\n:where([data-sonner-toast][data-mounted=true][data-expanded=true]) {\n  --y: translateY(calc(var(--lift) * var(--offset)));\n  height: var(--initial-height);\n}\n:where([data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]) {\n  --y: translateY(calc(var(--lift) * -100%));\n  opacity: 0;\n}\n:where([data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]) {\n  --y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));\n  opacity: 0;\n}\n:where([data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]) {\n  --y: translateY(40%);\n  opacity: 0;\n  transition: transform 500ms, opacity 200ms;\n}\n:where([data-sonner-toast][data-removed=true][data-front=false])::before {\n  height: calc(var(--initial-height) + 20%);\n}\n[data-sonner-toast][data-swiping=true] {\n  transform: var(--y) translateY(var(--swipe-amount, 0px));\n  transition: none;\n}\n[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],\n[data-sonner-toast][data-swipe-out=true][data-y-position=top] {\n  animation: swipe-out 200ms ease-out forwards;\n}\n@keyframes swipe-out {\n  from {\n    transform: translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));\n    opacity: 1;\n  }\n  to {\n    transform: translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));\n    opacity: 0;\n  }\n}\n@media (max-width: 600px) {\n  [data-sonner-toaster] {\n    position: fixed;\n    --mobile-offset: 16px;\n    right: var(--mobile-offset);\n    left: var(--mobile-offset);\n    width: 100%;\n  }\n  [data-sonner-toaster] [data-sonner-toast] {\n    left: 0;\n    right: 0;\n    width: calc(100% - var(--mobile-offset) * 2);\n  }\n  [data-sonner-toaster][data-x-position=left] {\n    left: var(--mobile-offset);\n  }\n  [data-sonner-toaster][data-y-position=bottom] {\n    bottom: 20px;\n  }\n  [data-sonner-toaster][data-y-position=top] {\n    top: 20px;\n  }\n  [data-sonner-toaster][data-x-position=center] {\n    left: var(--mobile-offset);\n    right: var(--mobile-offset);\n    transform: none;\n  }\n}\n[data-sonner-toaster][data-theme=light] {\n  --normal-bg: #fff;\n  --normal-border: var(--gray4);\n  --normal-text: var(--gray12);\n  --success-bg: hsl(143, 85%, 96%);\n  --success-border: hsl(145, 92%, 91%);\n  --success-text: hsl(140, 100%, 27%);\n  --info-bg: hsl(208, 100%, 97%);\n  --info-border: hsl(221, 91%, 91%);\n  --info-text: hsl(210, 92%, 45%);\n  --warning-bg: hsl(49, 100%, 97%);\n  --warning-border: hsl(49, 91%, 91%);\n  --warning-text: hsl(31, 92%, 45%);\n  --error-bg: hsl(359, 100%, 97%);\n  --error-border: hsl(359, 100%, 94%);\n  --error-text: hsl(360, 100%, 45%);\n}\n[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true] {\n  --normal-bg: #000;\n  --normal-border: hsl(0, 0%, 20%);\n  --normal-text: var(--gray1);\n}\n[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true] {\n  --normal-bg: #fff;\n  --normal-border: var(--gray3);\n  --normal-text: var(--gray12);\n}\n[data-sonner-toaster][data-theme=dark] {\n  --normal-bg: #000;\n  --normal-border: hsl(0, 0%, 20%);\n  --normal-text: var(--gray1);\n  --success-bg: hsl(150, 100%, 6%);\n  --success-border: hsl(147, 100%, 12%);\n  --success-text: hsl(150, 86%, 65%);\n  --info-bg: hsl(215, 100%, 6%);\n  --info-border: hsl(223, 100%, 12%);\n  --info-text: hsl(216, 87%, 65%);\n  --warning-bg: hsl(64, 100%, 6%);\n  --warning-border: hsl(60, 100%, 12%);\n  --warning-text: hsl(46, 87%, 65%);\n  --error-bg: hsl(358, 76%, 10%);\n  --error-border: hsl(357, 89%, 16%);\n  --error-text: hsl(358, 100%, 81%);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=success] {\n  background: var(--success-bg);\n  border-color: var(--success-border);\n  color: var(--success-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=success] [data-close-button] {\n  background: var(--success-bg);\n  border-color: var(--success-border);\n  color: var(--success-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=info] {\n  background: var(--info-bg);\n  border-color: var(--info-border);\n  color: var(--info-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=info] [data-close-button] {\n  background: var(--info-bg);\n  border-color: var(--info-border);\n  color: var(--info-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=warning] {\n  background: var(--warning-bg);\n  border-color: var(--warning-border);\n  color: var(--warning-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=warning] [data-close-button] {\n  background: var(--warning-bg);\n  border-color: var(--warning-border);\n  color: var(--warning-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=error] {\n  background: var(--error-bg);\n  border-color: var(--error-border);\n  color: var(--error-text);\n}\n[data-rich-colors=true] [data-sonner-toast][data-type=error] [data-close-button] {\n  background: var(--error-bg);\n  border-color: var(--error-border);\n  color: var(--error-text);\n}\n.sonner-loading-wrapper {\n  --size: 16px;\n  height: var(--size);\n  width: var(--size);\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n}\n.sonner-loading-wrapper[data-visible=false] {\n  transform-origin: center;\n  animation: sonner-fade-out 0.2s ease forwards;\n}\n.sonner-spinner {\n  position: relative;\n  top: 50%;\n  left: 50%;\n  height: var(--size);\n  width: var(--size);\n}\n.sonner-loading-bar {\n  animation: sonner-spin 1.2s linear infinite;\n  background: var(--gray11);\n  border-radius: 6px;\n  height: 8%;\n  left: -10%;\n  position: absolute;\n  top: -3.9%;\n  width: 24%;\n}\n.sonner-loading-bar:nth-child(1) {\n  animation-delay: -1.2s;\n  transform: rotate(0.0001deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(2) {\n  animation-delay: -1.1s;\n  transform: rotate(30deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(3) {\n  animation-delay: -1s;\n  transform: rotate(60deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(4) {\n  animation-delay: -0.9s;\n  transform: rotate(90deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(5) {\n  animation-delay: -0.8s;\n  transform: rotate(120deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(6) {\n  animation-delay: -0.7s;\n  transform: rotate(150deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(7) {\n  animation-delay: -0.6s;\n  transform: rotate(180deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(8) {\n  animation-delay: -0.5s;\n  transform: rotate(210deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(9) {\n  animation-delay: -0.4s;\n  transform: rotate(240deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(10) {\n  animation-delay: -0.3s;\n  transform: rotate(270deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(11) {\n  animation-delay: -0.2s;\n  transform: rotate(300deg) translate(146%);\n}\n.sonner-loading-bar:nth-child(12) {\n  animation-delay: -0.1s;\n  transform: rotate(330deg) translate(146%);\n}\n@keyframes sonner-fade-in {\n  0% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes sonner-fade-out {\n  0% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n}\n@keyframes sonner-spin {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0.15;\n  }\n}\n@media (prefers-reduced-motion) {\n  [data-sonner-toast],\n  [data-sonner-toast] > *,\n  .sonner-loading-bar {\n    transition: none !important;\n    animation: none !important;\n  }\n}\n.sonner-loader {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center;\n  transition: opacity 200ms, transform 200ms;\n}\n.sonner-loader[data-visible=false] {\n  opacity: 0;\n  transform: scale(0.8) translate(-50%, -50%);\n}\n');
var bars = Array(12).fill(0);
function Loader(props) {
  return (() => {
    var _el$ = _tmpl$$5(), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(For, {
      each: bars,
      children: () => _tmpl$2$4()
    }));
    createRenderEffect(() => setAttribute(_el$, "data-visible", props.visible));
    return _el$;
  })();
}
function SuccessIcon() {
  return _tmpl$3$2();
}
function WarningIcon() {
  return _tmpl$4$2();
}
function InfoIcon() {
  return _tmpl$5$1();
}
function ErrorIcon() {
  return _tmpl$6$1();
}
function getAsset(type) {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
}
var toastsCounter = 0;
var Observer = class {
  subscribers;
  toasts;
  constructor() {
    this.subscribers = [];
    this.toasts = [];
  }
  // We use arrow functions to maintain the correct `this` reference
  subscribe = (subscriber) => {
    this.subscribers.push(subscriber);
    return () => {
      const index = this.subscribers.indexOf(subscriber);
      this.subscribers.splice(index, 1);
    };
  };
  publish = (data) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };
  addToast = (data) => {
    this.publish(data);
    this.toasts = [...this.toasts, data];
  };
  create = (data) => {
    const {
      message,
      ...rest
    } = data;
    const id = typeof data?.id === "number" || data.id && data.id?.length > 0 ? data.id : toastsCounter++;
    const alreadyExists = this.toasts.find((toast2) => {
      return toast2.id === id;
    });
    if (alreadyExists) {
      this.toasts = this.toasts.map((toast2) => {
        if (toast2.id === id) {
          this.publish({
            ...toast2,
            ...data,
            id,
            title: message
          });
          return {
            ...toast2,
            ...data,
            id,
            title: message
          };
        }
        return toast2;
      });
    } else {
      this.addToast({
        title: message,
        ...rest,
        id
      });
    }
    return id;
  };
  dismiss = (id) => {
    if (!id) {
      this.toasts.forEach((toast2) => {
        this.subscribers.forEach((subscriber) => subscriber({
          id: toast2.id,
          dismiss: true
        }));
      });
    }
    this.subscribers.forEach((subscriber) => subscriber({
      id,
      dismiss: true
    }));
    return id;
  };
  message = (message, data) => {
    return this.create({
      ...data,
      message
    });
  };
  error = (message, data) => {
    return this.create({
      ...data,
      message,
      type: "error"
    });
  };
  success = (message, data) => {
    return this.create({
      ...data,
      type: "success",
      message
    });
  };
  info = (message, data) => {
    return this.create({
      ...data,
      type: "info",
      message
    });
  };
  warning = (message, data) => {
    return this.create({
      ...data,
      type: "warning",
      message
    });
  };
  promise = (promise, data) => {
    if (!data) {
      return;
    }
    let id;
    if (data.loading !== void 0) {
      id = this.create({
        ...data,
        promise,
        type: "loading",
        message: data.loading
      });
    }
    const p = promise instanceof Promise ? promise : promise();
    let shouldDismiss = id !== void 0;
    p.then((response) => {
      if (response && typeof response.ok === "boolean" && !response.ok) {
        shouldDismiss = false;
        const message = typeof data.error === "function" ? data.error(`HTTP error! status: ${response.status}`) : data.error;
        this.create({
          id,
          type: "error",
          message
        });
      } else if (data.success !== void 0) {
        shouldDismiss = false;
        const message = typeof data.success === "function" ? data.success(response) : data.success;
        this.create({
          id,
          type: "success",
          message
        });
      }
    }).catch((error) => {
      if (data.error !== void 0) {
        shouldDismiss = false;
        const message = typeof data.error === "function" ? data.error(error) : data.error;
        this.create({
          id,
          type: "error",
          message
        });
      }
    }).finally(() => {
      if (shouldDismiss) {
        this.dismiss(id);
        id = void 0;
      }
      data.finally?.();
    });
    return id;
  };
  loading = (message, data) => {
    return this.create({
      ...data,
      type: "loading",
      message
    });
  };
  // We can't provide the toast we just created as a prop as we didn't create it yet, so we can create a default toast object, I just don't know how to use function in argument when calling()?
  custom = (jsx, data) => {
    const id = data?.id || toastsCounter++;
    this.publish({
      jsx: jsx(id),
      id,
      ...data
    });
    return id;
  };
};
var ToastState = new Observer();
function toastFunction(message, data) {
  const id = data?.id || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id
  });
  return id;
}
var basicToast = toastFunction;
var toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
});
function useIsDocumentHidden() {
  const [isDocumentHidden, setIsDocumentHidden] = createSignal(false);
  onMount(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", callback);
    onCleanup(() => {
      window.removeEventListener("visibilitychange", callback);
    });
  });
  return isDocumentHidden;
}
var VISIBLE_TOASTS_AMOUNT = 3;
var VIEWPORT_OFFSET = "32px";
var TOAST_LIFETIME = 4e3;
var TOAST_WIDTH = 356;
var GAP = 14;
var SWIPE_TRESHOLD = 20;
var TIME_BEFORE_UNMOUNT = 200;
function _cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
var Toast = (props) => {
  const [mounted, setMounted] = createSignal(false);
  const [removed, setRemoved] = createSignal(false);
  const [swiping, setSwiping] = createSignal(false);
  const [swipeOut, setSwipeOut] = createSignal(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = createSignal(0);
  const [initialHeight, setInitialHeight] = createSignal(0);
  let toastRef;
  const isFront = () => props.index === 0;
  const isVisible = () => props.index + 1 <= props.visibleToasts;
  const toastType = () => props.toast.type;
  const toastClassname = () => props.toast.class || "";
  const toastDescriptionClassname = () => props.toast.descriptionClass || "";
  const propsWithDefaults = mergeProps({
    gap: GAP
  }, props);
  const heightIndex = () => props.heights.findIndex((height) => height.toastId === props.toast.id) || 0;
  const duration = () => props.toast.duration || props.duration || TOAST_LIFETIME;
  let closeTimerStartTimeRef = 0;
  let lastCloseTimerStartTimeRef = 0;
  const [pointerStartRef, setPointerStartRef] = createSignal(null);
  const coords = () => props.position.split("-");
  const toastsHeightBefore = () => {
    return props.heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex()) return prev;
      return prev + curr.height;
    }, 0);
  };
  const isDocumentHidden = useIsDocumentHidden();
  const invert = () => props.toast.invert || props.invert;
  const disabled = () => toastType() === "loading";
  const offset = () => heightIndex() * propsWithDefaults.gap + toastsHeightBefore();
  function getLoadingIcon() {
    if (props.icons?.loading) {
      return (() => {
        var _el$8 = _tmpl$7();
        insert(_el$8, () => props.icons.loading);
        createRenderEffect(() => setAttribute(_el$8, "data-visible", toastType() === "loading"));
        return _el$8;
      })();
    }
    return createComponent(Loader, {
      get visible() {
        return toastType() === "loading";
      }
    });
  }
  onMount(() => {
    setMounted(true);
  });
  onMount(() => {
    const toastNode = toastRef;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    createEffect(() => {
      props.setHeights((heights) => {
        const alreadyExists = heights.find((height) => height.toastId === props.toast.id);
        if (!alreadyExists) return [{
          toastId: props.toast.id,
          height: newHeight,
          position: props.toast.position
        }, ...heights];
        else return heights.map((height) => height.toastId === props.toast.id ? {
          ...height,
          height: newHeight
        } : height);
      });
    });
  });
  const deleteToast = () => {
    setRemoved(true);
    setOffsetBeforeRemove(offset());
    props.setHeights((h) => h.filter((height) => height.toastId !== props.toast.id));
    setTimeout(() => {
      props.removeToast(props.toast);
    }, TIME_BEFORE_UNMOUNT);
  };
  let remainingTime = duration();
  createEffect(on(() => [props.expanded, props.interacting, props.toast, duration(), props.toast.promise, toastType(), props.pauseWhenPageIsHidden, isDocumentHidden()], ([expanded, interacting, toast2, duration2, promise, toastType2, pauseWhenPageIsHidden, isDocumentHidden2]) => {
    if (promise && toastType2 === "loading" || duration2 === Number.POSITIVE_INFINITY) return;
    let timeoutId;
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef < closeTimerStartTimeRef) {
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef;
        remainingTime = remainingTime - elapsedTime;
      }
      lastCloseTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
    };
    const startTimer = () => {
      closeTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
      timeoutId = setTimeout(() => {
        toast2.onAutoClose?.(toast2);
        deleteToast();
      }, remainingTime);
    };
    if (expanded || interacting || pauseWhenPageIsHidden && isDocumentHidden2) pauseTimer();
    else startTimer();
    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  }));
  createEffect(on(() => props.toast.id, (toastId) => {
    const toastNode = toastRef;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      props.setHeights((h) => [{
        toastId,
        height,
        position: props.toast.position
      }, ...h]);
      onCleanup(() => {
        props.setHeights((h) => h.filter((height2) => height2.toastId !== toastId));
      });
    }
  }));
  createEffect(on(() => props.toast.delete, (d) => {
    if (d) deleteToast();
  }));
  return (() => {
    var _el$9 = _tmpl$9();
    _el$9.$$pointermove = (event) => {
      if (!pointerStartRef()) return;
      const yPosition = event.clientY - pointerStartRef().y;
      const xPosition = event.clientX - pointerStartRef().x;
      const clamp = coords()[0] === "top" ? Math.min : Math.max;
      const clampedY = clamp(0, yPosition);
      const swipeStartThreshold = event.pointerType === "touch" ? 10 : 2;
      const isAllowedToSwipe = Math.abs(clampedY) > swipeStartThreshold;
      if (isAllowedToSwipe) {
        toastRef?.style.setProperty("--swipe-amount", `${yPosition}px`);
      } else if (Math.abs(xPosition) > swipeStartThreshold) {
        setPointerStartRef(null);
      }
    };
    _el$9.$$pointerup = () => {
      if (swipeOut()) return;
      setPointerStartRef(null);
      const swipeAmount = Number(toastRef?.style.getPropertyValue("--swipe-amount").replace("px", "") || 0);
      if (Math.abs(swipeAmount) >= SWIPE_TRESHOLD) {
        setOffsetBeforeRemove(offset());
        props.toast.onDismiss?.(props.toast);
        deleteToast();
        setSwipeOut(true);
        return;
      }
      toastRef?.style.setProperty("--swipe-amount", "0px");
      setSwiping(false);
    };
    _el$9.$$pointerdown = (event) => {
      if (disabled()) return;
      setOffsetBeforeRemove(offset());
      event.target.setPointerCapture(event.pointerId);
      if (event.target.tagName === "BUTTON") return;
      setSwiping(true);
      setPointerStartRef({
        x: event.clientX,
        y: event.clientY
      });
    };
    var _ref$ = toastRef;
    typeof _ref$ === "function" ? use(_ref$, _el$9) : toastRef = _el$9;
    insert(_el$9, createComponent(Show, {
      get when() {
        return props.closeButton && !props.toast.jsx;
      },
      get children() {
        var _el$10 = _tmpl$8();
        addEventListener(_el$10, "click", disabled() ? void 0 : () => {
          deleteToast();
          props.toast.onDismiss?.(props.toast);
        }, true);
        createRenderEffect((_p$) => {
          var _v$ = disabled(), _v$2 = _cn(props.classes?.closeButton, props.toast?.classes?.closeButton);
          _v$ !== _p$.e && setAttribute(_el$10, "data-disabled", _p$.e = _v$);
          _v$2 !== _p$.t && className(_el$10, _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$10;
      }
    }), null);
    insert(_el$9, createComponent(Show, {
      get when() {
        return props.toast.jsx || props.toast.title instanceof Element;
      },
      get fallback() {
        return [createComponent(Show, {
          get when() {
            return toastType() || props.toast.icon || props.toast.promise;
          },
          get children() {
            var _el$11 = _tmpl$10();
            insert(_el$11, (() => {
              var _c$ = createMemo(() => !!(props.toast.promise || props.toast.type === "loading" && !props.toast.icon));
              return () => _c$() ? props.toast.icon || getLoadingIcon() : null;
            })(), null);
            insert(_el$11, (() => {
              var _c$2 = createMemo(() => props.toast.type !== "loading");
              return () => _c$2() ? props.toast.icon || props.icons?.[toastType()] || getAsset(toastType())() : null;
            })(), null);
            return _el$11;
          }
        }), (() => {
          var _el$12 = _tmpl$12(), _el$13 = _el$12.firstChild;
          insert(_el$13, () => props.toast.title);
          insert(_el$12, createComponent(Show, {
            get when() {
              return props.toast.description;
            },
            get children() {
              var _el$14 = _tmpl$11();
              insert(_el$14, () => props.toast.description);
              createRenderEffect(() => className(_el$14, _cn(props.descriptionClass, toastDescriptionClassname(), props.classes?.description, props.toast?.classes?.description)));
              return _el$14;
            }
          }), null);
          createRenderEffect(() => className(_el$13, _cn(props.classes?.title, props.toast?.classes?.title)));
          return _el$12;
        })(), createComponent(Show, {
          get when() {
            return props.toast.cancel;
          },
          get children() {
            var _el$15 = _tmpl$13();
            _el$15.$$click = () => {
              deleteToast();
              if (props.toast.cancel?.onClick) props.toast.cancel.onClick();
            };
            insert(_el$15, () => props.toast.cancel.label);
            createRenderEffect((_p$) => {
              var _v$20 = props.toast.cancelButtonStyle || props.cancelButtonStyle, _v$21 = _cn(props.classes?.cancelButton, props.toast?.classes?.cancelButton);
              _p$.e = style(_el$15, _v$20, _p$.e);
              _v$21 !== _p$.t && className(_el$15, _p$.t = _v$21);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$15;
          }
        }), createComponent(Show, {
          get when() {
            return props.toast.action;
          },
          get children() {
            var _el$16 = _tmpl$14();
            _el$16.$$click = (event) => {
              props.toast.action?.onClick(event);
              if (event.defaultPrevented) return;
              deleteToast();
            };
            insert(_el$16, () => props.toast.action.label);
            createRenderEffect((_p$) => {
              var _v$22 = props.toast.actionButtonStyle || props.actionButtonStyle, _v$23 = _cn(props.classes?.actionButton, props.toast?.classes?.actionButton);
              _p$.e = style(_el$16, _v$22, _p$.e);
              _v$23 !== _p$.t && className(_el$16, _p$.t = _v$23);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$16;
          }
        })];
      },
      get children() {
        return props.toast.jsx || props.toast.title;
      }
    }), null);
    createRenderEffect((_p$) => {
      var _v$3 = props.toast.important ? "assertive" : "polite", _v$4 = _cn(props.class, toastClassname(), props.classes?.toast, props.toast?.classes?.toast, props.classes?.default, props.classes?.[toastType()], props.toast?.classes?.[toastType()]), _v$5 = !(props.toast.jsx || props.toast.unstyled || props.unstyled), _v$6 = mounted(), _v$7 = Boolean(props.toast.promise), _v$8 = removed(), _v$9 = isVisible(), _v$10 = coords()[0], _v$11 = coords()[1], _v$12 = props.index, _v$13 = isFront(), _v$14 = swiping(), _v$15 = toastType(), _v$16 = invert(), _v$17 = swipeOut(), _v$18 = Boolean(props.expanded || props.expandByDefault && mounted()), _v$19 = {
        "--index": props.index,
        "--toasts-before": props.index,
        "--z-index": props.toasts.length - props.index,
        "--offset": `${removed() ? offsetBeforeRemove() : offset()}px`,
        "--initial-height": props.expandByDefault ? "auto" : `${initialHeight()}px`,
        ...props.style,
        ...props.toast.style
      };
      _v$3 !== _p$.e && setAttribute(_el$9, "aria-live", _p$.e = _v$3);
      _v$4 !== _p$.t && className(_el$9, _p$.t = _v$4);
      _v$5 !== _p$.a && setAttribute(_el$9, "data-styled", _p$.a = _v$5);
      _v$6 !== _p$.o && setAttribute(_el$9, "data-mounted", _p$.o = _v$6);
      _v$7 !== _p$.i && setAttribute(_el$9, "data-promise", _p$.i = _v$7);
      _v$8 !== _p$.n && setAttribute(_el$9, "data-removed", _p$.n = _v$8);
      _v$9 !== _p$.s && setAttribute(_el$9, "data-visible", _p$.s = _v$9);
      _v$10 !== _p$.h && setAttribute(_el$9, "data-y-position", _p$.h = _v$10);
      _v$11 !== _p$.r && setAttribute(_el$9, "data-x-position", _p$.r = _v$11);
      _v$12 !== _p$.d && setAttribute(_el$9, "data-index", _p$.d = _v$12);
      _v$13 !== _p$.l && setAttribute(_el$9, "data-front", _p$.l = _v$13);
      _v$14 !== _p$.u && setAttribute(_el$9, "data-swiping", _p$.u = _v$14);
      _v$15 !== _p$.c && setAttribute(_el$9, "data-type", _p$.c = _v$15);
      _v$16 !== _p$.w && setAttribute(_el$9, "data-invert", _p$.w = _v$16);
      _v$17 !== _p$.m && setAttribute(_el$9, "data-swipe-out", _p$.m = _v$17);
      _v$18 !== _p$.f && setAttribute(_el$9, "data-expanded", _p$.f = _v$18);
      _p$.y = style(_el$9, _v$19, _p$.y);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0
    });
    return _el$9;
  })();
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) return window.getComputedStyle(document.documentElement).direction;
  return dirAttribute;
}
var Toaster$1 = (props) => {
  const propsWithDefaults = mergeProps({
    position: "bottom-right",
    hotkey: ["altKey", "KeyT"],
    theme: "light",
    visibleToasts: VISIBLE_TOASTS_AMOUNT,
    dir: getDocumentDirection()
  }, props);
  const [toastsStore, setToastsStore] = createStore({
    toasts: []
  });
  const possiblePositions = () => {
    return Array.from(new Set([propsWithDefaults.position].concat(toastsStore.toasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
  };
  const [heights, setHeights] = createSignal([]);
  const [expanded, setExpanded] = createSignal(false);
  const [interacting, setInteracting] = createSignal(false);
  let listRef;
  const hotkeyLabel = () => propsWithDefaults.hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const [lastFocusedElementRef, setLastFocusedElementRef] = createSignal(null);
  const [isFocusedWithinRef, setIsFocusedWithinRef] = createSignal(false);
  const [actualTheme, setActualTheme] = createSignal(propsWithDefaults.theme !== "system" ? propsWithDefaults.theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
  const removeToast = (toast2) => setToastsStore("toasts", (toasts) => toasts.filter(({
    id
  }) => id !== toast2.id));
  onMount(() => {
    const unsub = ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        setToastsStore("toasts", produce((_toasts) => {
          _toasts.forEach((t) => {
            if (t.id === toast2.id) t.delete = true;
          });
        }));
        return;
      }
      const changedIndex = toastsStore.toasts.findIndex((t) => t.id === toast2.id);
      if (changedIndex !== -1) {
        setToastsStore("toasts", [changedIndex], reconcile(toast2));
        return;
      }
      setToastsStore("toasts", produce((_toasts) => {
        _toasts.unshift(toast2);
      }));
    });
    onCleanup(() => {
      unsub();
    });
  });
  createEffect(on(() => propsWithDefaults.theme, (theme) => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (typeof window === "undefined") return;
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({
      matches
    }) => {
      if (matches) setActualTheme("dark");
      else setActualTheme("light");
    });
  }));
  createEffect(() => {
    if (toastsStore.toasts.length <= 1) setExpanded(false);
  });
  onMount(() => {
    const handleKeyDown = (event) => {
      const isHotkeyPressed = propsWithDefaults.hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        setExpanded(true);
        listRef?.focus();
      }
      if (event.code === "Escape" && (document.activeElement === listRef || listRef?.contains(document.activeElement))) setExpanded(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });
  createEffect(on(() => listRef, (ref) => {
    if (ref) {
      onCleanup(() => {
        if (lastFocusedElementRef()) {
          lastFocusedElementRef()?.focus({
            preventScroll: true
          });
          setLastFocusedElementRef(null);
          setIsFocusedWithinRef(false);
        }
      });
    }
  }));
  return createComponent(Show, {
    get when() {
      return toastsStore.toasts.length > 0;
    },
    get children() {
      var _el$17 = _tmpl$15();
      insert(_el$17, createComponent(For, {
        get each() {
          return possiblePositions();
        },
        children: (position, index) => {
          const [y, x] = position.split("-");
          return (() => {
            var _el$18 = _tmpl$16();
            _el$18.$$pointerup = () => setInteracting(false);
            _el$18.$$pointerdown = () => {
              setInteracting(true);
            };
            _el$18.addEventListener("mouseleave", () => {
              if (!interacting()) setExpanded(false);
            });
            _el$18.$$mousemove = () => setExpanded(true);
            _el$18.addEventListener("mouseenter", () => setExpanded(true));
            _el$18.addEventListener("focus", (event) => {
              if (!isFocusedWithinRef()) {
                setIsFocusedWithinRef(true);
                setLastFocusedElementRef(event.relatedTarget);
              }
            });
            _el$18.addEventListener("blur", (event) => {
              if (isFocusedWithinRef() && !event.currentTarget.contains(event.relatedTarget)) {
                setIsFocusedWithinRef(false);
                if (lastFocusedElementRef()) {
                  lastFocusedElementRef()?.focus({
                    preventScroll: true
                  });
                  setLastFocusedElementRef(null);
                }
              }
            });
            var _ref$2 = listRef;
            typeof _ref$2 === "function" ? use(_ref$2, _el$18) : listRef = _el$18;
            setAttribute(_el$18, "data-y-position", y);
            setAttribute(_el$18, "data-x-position", x);
            insert(_el$18, createComponent(For, {
              get each() {
                return toastsStore.toasts.filter((toast2) => !toast2.position && index() === 0 || toast2.position === position);
              },
              children: (toast2, index2) => createComponent(Toast, {
                get index() {
                  return index2();
                },
                get icons() {
                  return propsWithDefaults.icons;
                },
                toast: toast2,
                get duration() {
                  return propsWithDefaults.toastOptions?.duration ?? props.duration;
                },
                get ["class"]() {
                  return propsWithDefaults.toastOptions?.class;
                },
                get classes() {
                  return propsWithDefaults.toastOptions?.classes;
                },
                get cancelButtonStyle() {
                  return propsWithDefaults.toastOptions?.cancelButtonStyle;
                },
                get actionButtonStyle() {
                  return propsWithDefaults.toastOptions?.actionButtonStyle;
                },
                get descriptionClass() {
                  return propsWithDefaults.toastOptions?.descriptionClass;
                },
                get invert() {
                  return Boolean(propsWithDefaults.invert);
                },
                get visibleToasts() {
                  return propsWithDefaults.visibleToasts;
                },
                get closeButton() {
                  return Boolean(propsWithDefaults.closeButton);
                },
                get interacting() {
                  return interacting();
                },
                get position() {
                  return propsWithDefaults.position;
                },
                get style() {
                  return propsWithDefaults.toastOptions?.style;
                },
                get unstyled() {
                  return propsWithDefaults.toastOptions?.unstyled;
                },
                removeToast,
                get toasts() {
                  return toastsStore.toasts;
                },
                get heights() {
                  return heights();
                },
                setHeights,
                get expandByDefault() {
                  return Boolean(propsWithDefaults.expand);
                },
                get gap() {
                  return propsWithDefaults.gap;
                },
                get expanded() {
                  return expanded();
                },
                get pauseWhenPageIsHidden() {
                  return propsWithDefaults.pauseWhenPageIsHidden;
                }
              })
            }));
            createRenderEffect((_p$) => {
              var _v$24 = propsWithDefaults.dir === "auto" ? getDocumentDirection() : propsWithDefaults.dir, _v$25 = propsWithDefaults.class, _v$26 = actualTheme(), _v$27 = propsWithDefaults.richColors, _v$28 = {
                "--front-toast-height": `${heights()[0]?.height}px`,
                "--offset": typeof propsWithDefaults.offset === "number" ? `${propsWithDefaults.offset}px` : propsWithDefaults.offset || VIEWPORT_OFFSET,
                "--width": `${TOAST_WIDTH}px`,
                "--gap": `${GAP}px`,
                ...propsWithDefaults.style
              };
              _v$24 !== _p$.e && setAttribute(_el$18, "dir", _p$.e = _v$24);
              _v$25 !== _p$.t && className(_el$18, _p$.t = _v$25);
              _v$26 !== _p$.a && setAttribute(_el$18, "data-theme", _p$.a = _v$26);
              _v$27 !== _p$.o && setAttribute(_el$18, "data-rich-colors", _p$.o = _v$27);
              _p$.i = style(_el$18, _v$28, _p$.i);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0,
              i: void 0
            });
            return _el$18;
          })();
        }
      }));
      createRenderEffect(() => setAttribute(_el$17, "aria-label", `Notifications ${hotkeyLabel()}`));
      return _el$17;
    }
  });
};
/*!
 * Original code by Emil Kowalski
 * MIT Licensed, Copyright 2023 Emil Kowalski, see https://github.com/emilkowalski/sonner/blob/main/LICENSE.md for details
 *
 * Credits:
 * https://github.com/emilkowalski/sonner/blob/main/src/index.tsx
 */
delegateEvents(["pointerdown", "pointerup", "pointermove", "click", "mousemove"]);

const propsData = [{
  name: "Definition",
  options: {
    source: {
      target: "geofs.aircraft.instance",
      prop: "definition"
    },
    reactive: true,
    reset: true,
    allowed: [{
      name: "airbrakesTravelTime",
      type: "float"
    }, {
      name: "accessoriesTravelTime",
      type: "float"
    }, {
      name: "flapsTravelTime",
      type: "float"
    }, {
      name: "flapsSteps",
      type: "int"
    }, {
      name: "gearTravelTime",
      type: "float"
    }, {
      name: "zeroThrustAltitude",
      type: "int"
    }, {
      name: "zeroRPMAltitude",
      type: "int"
    }, {
      name: "mass",
      type: "int"
    }, {
      name: "minRPM",
      type: "int",
      comment: "not recommended"
    }, {
      name: "maxRPM",
      type: "int",
      comment: "not recommended"
    }],
    ignored: ["object", "function", "undefined", "null", "boolean", "symbol", "array"]
  }
}, {
  name: "Engines",
  options: {
    source: {
      target: "geofs.aircraft.instance",
      prop: "engines"
    },
    reactive: true,
    allowed: [{
      name: "thrust",
      type: "int"
    }, {
      name: "afterBurnerThrust",
      type: "int"
    }, {
      name: "reverseThrust",
      type: "int"
    }],
    ignored: ["object", "function", "undefined", "null", "boolean", "symbol", "array"]
  }
}, {
  name: "id",
  options: {
    source: {
      target: "geofs.aircraft.instance",
      prop: "id"
    },
    reactive: true
  }
}];

function getObjectFromPath(path) {
  const parts = path.split(".");
  let obj = unsafeWindow;
  for (let part of parts) {
    obj = obj[part];
    if (obj === void 0) {
      throw new Error(`Path ${path} does not exist`);
    }
  }
  return obj;
}

class Reactive {
  static _options = {
    cloneAfterCreation: false,
    temp: null
  };
  static _cache = {};
  static set cache(value) {
    this._cache = value;
  }
  static get cache() {
    return this._cache;
  }
  static set options(value) {
    this._options = value;
  }
  static get options() {
    return this._options;
  }
  static parse(obj, propName, options = {}) {
    let target = obj;
    try {
      if (typeof obj === "string") {
        target = getObjectFromPath(obj);
      } else if (typeof obj === "object") {
        target = obj;
      } else {
        throw new Error("The first argument to parse must be an object or string path.", obj);
      }
      if (typeof propName !== "string") {
        throw new Error("The second argument to parse must be a string.", propName);
      }
      if (target === void 0) {
        throw new Error("Invalid target.", target);
      }
      if (propName === void 0) {
        throw new Error("Invalid property.", propName);
      }
      let value = target[propName];
      if (value === void 0) {
        throw new Error("Invalid value.", value);
      }
      const [prop, setProp] = createSignal(value);
      const cloneAfterCreation = (() => options?.cloneAfterCreation !== void 0 ? options?.cloneAfterCreation : this._options?.cloneAfterCreation)();
      if (prop === void 0 || setProp === void 0) {
        throw new Error("Signal not created.");
      }
      Object.defineProperty(target, propName, {
        get: function() {
          return prop();
        },
        set: function(newValue) {
          value = newValue;
          setProp(newValue);
        }
      });
      if (Object.getOwnPropertyDescriptor(target, propName) === void 0) {
        throw new Error("Reactive property not created.");
      }
      if (cloneAfterCreation) {
        if (this._options.temp === null) {
          throw new Error("Temporary object not defined.");
        }
        if (this._cache[propName] !== void 0) {
          throw new Error("Property already exists in cache.", propName);
        }
        const [reactiveProp, setReactiveProp] = [prop, setProp];
        if (reactiveProp === void 0 || setReactiveProp === void 0) {
          throw new Error("Reactive property not cloned.");
        }
        this._cache[propName] = true;
        Object.defineProperty(this._options.temp, propName, {
          get: function() {
            return reactiveProp();
          },
          set: function(newValue) {
            setReactiveProp(newValue);
          }
        });
        if (Object.getOwnPropertyDescriptor(this._options.temp, propName) === void 0) {
          throw new Error("Reactive property clone not defined.", propName);
        }
      }
      return [prop, setProp];
    } catch (e) {
      console.error(e);
    }
  }
}

class Props {
  static _reactive = Reactive;
  static _data = {};
  static get reactive() {
    return this._reactive;
  }
  static set reactive(value) {
    this._reactive = value;
  }
  static async load(...arr) {
    return await new Promise((resolve, reject) => {
      try {
        if (!arr.length) {
          throw new Error("No props to load");
        }
        if (!Array.isArray(arr)) {
          throw new Error("Props must be an array");
        }
        for (const item of arr[0]) {
          const {
            name,
            options
          } = item;
          const {
            source
          } = options;
          if (options.reactive) {
            if (!options.source) {
              throw new Error("Reactive props require a source");
            }
            if (!options.source.target || !options.source.prop) {
              throw new Error("Reactive props require a target and prop");
            }
            this._reactive.parse(source.target, source.prop, options.source?.options);
          }
          Object.defineProperty(this, name, {
            get: function() {
              return this._data[name];
            },
            set: function(newValue) {
              this._data[name] = newValue;
            }
          });
          this[name] = {
            allowed: options.allowed || [],
            ignored: options.ignored || [],
            reset: options.reset || false
          };
        }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}

const toastOptions = {
  duration: 2e3,
  closeButton: true
};

var _tmpl$$4 = /* @__PURE__ */ template(`<li class="flex gap-2"><label class="flex-none w-fit">:</label><input>`), _tmpl$2$3 = /* @__PURE__ */ template(`<br>`), _tmpl$3$1 = /* @__PURE__ */ template(`<span class="text-sm text-slate-500">`), _tmpl$4$1 = /* @__PURE__ */ template(`<li class="flex gap-2"><button class="w-fit m-2 border-0 rounded-md px-3 bg-sky-600 text-white shadow-md hover:bg-sky-700 hover:cursor-pointer">Reset</button><button class="w-fit m-2 border-0 rounded-md px-3 bg-sky-600 text-white shadow-md hover:bg-sky-700 hover:cursor-pointer">Save</button><button class="w-fit m-2 border-0 rounded-md px-3 bg-sky-600 text-white shadow-md hover:bg-sky-700 hover:cursor-pointer">Load`);
const getDefinitions = async () => {
  return await new Promise((resolve, reject) => {
    try {
      const {
        allowed,
        ignored,
        reset
      } = Props.Definition;
      const definition = flightAssistant.instance.definition;
      if (!definition) throw new Error("No definition found.");
      const response = [];
      for (const item of Object.entries(definition)) {
        const [propName, prop] = item;
        const propType = typeof prop;
        if (ignored.includes(propType)) continue;
        const isAllowed = allowed.some((p) => p.name === propName);
        if (!isAllowed) continue;
        const syncType = allowed.find((p) => p.name === propName).type;
        if (!syncType) continue;
        const hasComment = allowed.find((p) => p.name === propName).comment;
        const isNum = ["int", "float", "number"].includes(syncType) || propType === "number";
        const isInt = syncType === "int";
        const isFloat = syncType === "float";
        const isText = syncType === "string";
        let props = {};
        if (isText) {
          props.placeholder = "Text";
        } else if (isNum) {
          props.min = isInt ? "0" : isFloat ? "0.0" : null;
          props.max = isInt ? parseInt(prop * 2) : isFloat ? parseFloat(prop * 2) : null;
          props.step = isInt ? "1" : isFloat ? "0.2" : null;
          props.placeholder = `Between ${props.min} and ${props.max}`;
        }
        if (reset) props["data-definitions-default"] = prop;
        props["data-definitions-propname"] = propName;
        props["data-definitions-type"] = syncType;
        response.push((() => {
          var _el$ = _tmpl$$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling;
          setAttribute(_el$2, "for", `set${propName}`);
          insert(_el$2, propName, _el$3);
          insert(_el$2, hasComment ? [_tmpl$2$3(), (() => {
            var _el$6 = _tmpl$3$1();
            insert(_el$6, hasComment);
            return _el$6;
          })()] : null, null);
          setAttribute(_el$4, "id", `set${propName}`);
          setAttribute(_el$4, "type", isNum ? "number" : isText ? "text" : null);
          spread(_el$4, mergeProps(props, {
            "class": "flex-auto w-max m-2 border-0 rounded-md p-2 shadow-md",
            "oninput": async (e) => {
              let that = e.target;
              let [min, max, value] = ["min", "max", "value"].map((e2) => isNum ? parseFloat(that[e2]) : that[e2]);
              let type = that.type;
              await new Promise((resolve2, reject2) => {
                if (type == "number" && value > min && value <= max) {
                  let newMax = value * 2 * 100;
                  e.target.max = newMax < 1 ? 10 : newMax;
                  flightAssistant.instance.definition[propName] = value;
                  that.placeholder = `Between ${min} and ${max}`;
                  resolve2(`${propName} set to ${value}`);
                } else if (type == "text" && !value) {
                  flightAssistant.instance.definition[propName] = value;
                  resolve2(`${propName} set to ${value}`);
                } else {
                  reject2(isNum ? `Value must be between ${min} and ${max}` : isText ? `Value must be text` : `Invalid value`);
                }
              }).then((msg) => toast.success(msg, toastOptions)).catch((msg) => toast.error(msg, toastOptions));
            }
          }), false, false);
          return _el$;
        })());
      }
      if (reset) {
        response.unshift((() => {
          var _el$7 = _tmpl$4$1(), _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling, _el$10 = _el$9.nextSibling;
          _el$8.$$click = () => {
            const inputs = document.querySelectorAll("input[data-definitions-default]");
            inputs.forEach((input) => {
              let prefix = "data-definitions-";
              let value = input.getAttribute(`${prefix}default`);
              let propName = input.getAttribute(`${prefix}propname`);
              let type = input.getAttribute(`${prefix}type`);
              if (type === "int") value = parseInt(value);
              if (type === "float") value = parseFloat(value);
              input.value = value;
              flightAssistant.instance.definition[propName] = value;
            });
            if (inputs.length) toast.success("Definitions reset", toastOptions);
            else toast.error("No definitions to reset", toastOptions);
          };
          _el$9.$$click = () => {
            toast.info("Coming soon..", toastOptions);
          };
          _el$10.$$click = () => {
            toast.info("Coming soon..", toastOptions);
          };
          return _el$7;
        })());
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
delegateEvents(["click"]);

var _tmpl$$3 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=16 height=16 viewBox="0 0 16 16"><path fill-rule=evenodd d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">`);
const GroupRotation = (props) => {
  return (() => {
    var _el$ = _tmpl$$3();
    createRenderEffect((_p$) => {
      var _v$ = `w-5 h-5 text-gray-500 transition group-open/${props["group-open"]}:rotate-90`, _v$2 = props.fill || "currentColor";
      _v$ !== _p$.e && setAttribute(_el$, "class", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$, "fill", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$$2 = /* @__PURE__ */ template(`<details><summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer"><span class="flex gap-2"></span></summary><article class="px-4 pb-4"><ul class="flex flex-col gap-4 pl-2 mt-4">`), _tmpl$2$2 = /* @__PURE__ */ template(`<li class="flex gap-2"><label>:</label><input>`);
const getEngines = async () => {
  return await new Promise((resolve, reject) => {
    try {
      const {
        allowed,
        ignored
      } = Props.Engines;
      const engines = flightAssistant.instance.engines;
      if (!engines) throw new Error("No engines found.");
      const response = [];
      for (let i = 0; i < engines.length; i++) {
        response.push((() => {
          var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.firstChild;
          className(_el$, "group/engine" + i);
          insert(_el$3, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return engines[i].name;
                },
                get children() {
                  return engines[i].name;
                }
              }), createComponent(Match, {
                get when() {
                  return !engines[i].name;
                },
                get children() {
                  return ["Engine ", i + 1];
                }
              })];
            }
          }));
          insert(_el$2, createComponent(GroupRotation, {
            "group-open": `engine${i}`
          }), null);
          insert(_el$5, createComponent(For, {
            get each() {
              return Object.entries(engines[i]);
            },
            children: (item) => {
              const [propName, prop] = item;
              const propType = typeof prop;
              if (ignored.includes(propType)) return null;
              const isAllowed = allowed.some((p) => p.name === propName);
              if (!isAllowed) return null;
              const syncType = allowed.find((p) => p.name === propName).type;
              if (!syncType) return null;
              const isNum = ["int", "float", "number"].includes(syncType) || propType === "number";
              const isInt = syncType === "int";
              const isFloat = syncType === "float";
              const isText = syncType === "string";
              let props = {};
              if (isText) {
                props.placeholder = "Text";
              } else if (isNum) {
                props.min = isInt ? "0" : isFloat ? "0.0" : null;
                props.max = isInt ? parseInt(prop * 2) : isFloat ? parseFloat(prop * 2) : null;
                props.step = isInt ? "1" : isFloat ? "0.2" : null;
                props.placeholder = `Between ${props.min} and ${props.max}`;
              }
              return (() => {
                var _el$6 = _tmpl$2$2(), _el$7 = _el$6.firstChild, _el$8 = _el$7.firstChild, _el$9 = _el$7.nextSibling;
                insert(_el$7, propName, _el$8);
                setAttribute(_el$9, "type", isNum ? "number" : isText ? "text" : null);
                spread(_el$9, mergeProps({
                  get id() {
                    return `set${engines[i].name}${propName}`;
                  }
                }, props, {
                  "class": "w-11/12 m-2 border-0 rounded-md p-2 shadow-md",
                  "oninput": async (e) => {
                    let that = e.target;
                    let [min, max, value] = ["min", "max", "value"].map((e2) => isNum ? parseFloat(that[e2]) : that[e2]);
                    let type = that.type;
                    await new Promise((resolve2, reject2) => {
                      if (type == "number" && value > min && value <= max) {
                        let newMax = value * 2 * 100;
                        e.target.max = newMax < 1 ? 10 : newMax;
                        flightAssistant.instance.engines[i][propName] = value;
                        that.placeholder = `Between ${min} and ${max}`;
                        resolve2(`${engines[i].name}${propName} set to ${value}`);
                      } else if (type == "text" && !value) {
                        flightAssistant.instance.engines[i][propName] = value;
                        resolve2(`${engines[i].name}${propName} set to ${value}`);
                      } else {
                        reject2(isNum ? `Value must be between ${min} and ${max}` : isText ? `Value must be text` : `Invalid value`);
                      }
                    }).then((msg) => toast.success(msg, toastOptions)).catch((msg) => toast.error(msg, toastOptions));
                  }
                }), false, false);
                createRenderEffect(() => setAttribute(_el$7, "for", `set${engines[i].name}${propName}`));
                return _el$6;
              })();
            }
          }));
          return _el$;
        })());
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};

const Groups = () => [{
  name: "definitions",
  title: "Definitions",
  icon: true,
  resource: createResource(getDefinitions),
  reference: null
}, {
  name: "engines",
  title: "Engines",
  icon: true,
  resource: createResource(getEngines),
  reference: null
}];

var _tmpl$$1 = /* @__PURE__ */ template(`<summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer"><span class="flex gap-2">`), _tmpl$2$1 = /* @__PURE__ */ template(`<span>Loading...`), _tmpl$3 = /* @__PURE__ */ template(`<span>Error: `), _tmpl$4 = /* @__PURE__ */ template(`<article class="px-4 pb-4"><ul class="flex flex-col gap-4 pl-2 mt-4">`), _tmpl$5 = /* @__PURE__ */ template(`<div> Loading...`), _tmpl$6 = /* @__PURE__ */ template(`<details>`);
const Summary = (props) => {
  return (() => {
    var _el$ = _tmpl$$1(), _el$2 = _el$.firstChild;
    insert(_el$2, () => props.title);
    insert(_el$, createComponent(GroupRotation, {
      get ["group-open"]() {
        return props.name;
      }
    }), null);
    return _el$;
  })();
};
const Article = (props) => {
  return (() => {
    var _el$3 = _tmpl$4(), _el$4 = _el$3.firstChild;
    var _ref$ = props.reference;
    typeof _ref$ === "function" ? use(_ref$, _el$4) : props.reference = _el$4;
    insert(_el$4, createComponent(Suspense, {
      get fallback() {
        return (() => {
          var _el$8 = _tmpl$5(), _el$9 = _el$8.firstChild;
          insert(_el$8, () => props.title, _el$9);
          return _el$8;
        })();
      },
      get children() {
        return createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return props.resource?.loading;
              },
              get children() {
                return _tmpl$2$1();
              }
            }), createComponent(Match, {
              get when() {
                return props.resource?.error;
              },
              get children() {
                var _el$6 = _tmpl$3(); _el$6.firstChild;
                insert(_el$6, () => props.resource.error, null);
                return _el$6;
              }
            }), createComponent(Match, {
              get when() {
                return props.resource();
              },
              get children() {
                return createComponent(For, {
                  get each() {
                    return props.resource();
                  },
                  children: (i) => {
                    return i;
                  }
                });
              }
            })];
          }
        });
      }
    }));
    return _el$3;
  })();
};
const Details = (props) => {
  return (() => {
    var _el$10 = _tmpl$6();
    insert(_el$10, createComponent(Summary, props), null);
    insert(_el$10, createComponent(Article, props), null);
    createRenderEffect(() => className(_el$10, "group/" + props.name));
    return _el$10;
  })();
};
const Group = (props) => {
  try {
    if (!props.name || !props.resource) {
      throw new Error("Group component requires a name and resource prop.");
    }
    if (typeof props.resource !== "function") {
      throw new Error("Group component resource prop must be an function.");
    }
    let {
      name,
      resource
    } = props;
    let icon = props.icon || true;
    let title = props.title || name;
    let reference = props.reference || null;
    return createComponent(Details, {
      name,
      title,
      resource,
      icon,
      reference
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};

const ui = {
  left: document.querySelector(".geofs-ui-left"),
  bottom: document.querySelector(".geofs-ui-bottom")
};

var _tmpl$ = /* @__PURE__ */ template(`<ul class="geofs-list geofs-toggle-panel geofs-efi-list"data-noblur=true data-onshow={geofs.initializePreferencesPanel()} data-onhide={geofs.savePreferencesPanel()}>`), _tmpl$2 = /* @__PURE__ */ template(`<button class="mdl-button mdl-js-button geofs-f-standard-ui"id=geofs-efi-button tabindex=0 data-upgraded=,MaterialButton data-toggle-panel=.geofs-efi-list data-tooltip-classname=mdl-tooltip--top title="Experimental Flight Interface">CONFIG`);
const MenuComponent = () => {
  const groups = Groups();
  const [currentAircraftId, setCurrentAircraftId] = createSignal();
  setCurrentAircraftId(flightAssistant.instance.id);
  const sameAircraftId = createMemo(() => flightAssistant.instance.id === currentAircraftId());
  createEffect(() => {
    if (!sameAircraftId()) {
      setCurrentAircraftId(flightAssistant.instance.id);
      setTimeout(() => {
        for (let i = 0; i < groups.length; i++) {
          groups[i].resource[1].refetch();
        }
      }, 1e3);
    }
  });
  onMount(() => {
    for (let i = 0; i < groups.length; i++) {
      let {
        name,
        reference
      } = groups[i];
      flightAssistant.refs[name] = reference;
    }
  });
  return createComponent(For, {
    each: groups,
    children: (group) => {
      return createComponent(Group, {
        get name() {
          return group.name;
        },
        get title() {
          return group.title;
        },
        get icon() {
          return group.icon;
        },
        get resource() {
          return group.resource[0];
        },
        get reference() {
          return group.reference;
        }
      });
    }
  });
};
const ContainerComponent = () => {
  let ref;
  onMount(() => {
    flightAssistant.refs.container = ref;
  });
  onCleanup(() => {
    flightAssistant.refs.container = null;
  });
  return (() => {
    var _el$ = _tmpl$();
    var _ref$ = ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : ref = _el$;
    insert(_el$, createComponent(MenuComponent, {}));
    return _el$;
  })();
};
const ButtonComponent = () => {
  let ref;
  onMount(() => {
    flightAssistant.refs.button = ref;
  });
  onCleanup(() => {
    flightAssistant.refs.button = null;
  });
  return (() => {
    var _el$2 = _tmpl$2();
    var _ref$2 = ref;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : ref = _el$2;
    return _el$2;
  })();
};
const Container = () => render(() => createComponent(ContainerComponent, {}), ui.left);
const Button = () => render(() => createComponent(ButtonComponent, {}), ui.bottom);

const Toaster = () => {
  return createComponent(Portal, {
    get mount() {
      return document.body;
    },
    get children() {
      return createComponent(Toaster$1, {
        position: "top-right",
        gap: 8,
        expand: false,
        richColors: true
      });
    }
  });
};

const App = () => {
  const flightAssistant = {
    version: GM.info.script.version,
    refs: {},
    instance: {}
  };
  Props.reactive.options = {
    cloneAfterCreation: true,
    temp: flightAssistant.instance
  };
  unsafeWindow.executeOnEventDone("geofsStarted", function() {
    const starter = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          Props.load(propsData);
          Container();
          Button();
          resolve("Assistant Started.");
        } catch (e) {
          reject(e);
        }
      }, 5e3);
    });
    toast.promise(starter, {
      loading: "Assistant is starting..",
      success: (data) => data,
      error: (err) => `Error: ${err.message}`
    });
  });
  unsafeWindow.flightAssistant = flightAssistant;
  return createComponent(Toaster, {});
};

const root = document.body;
render(() => createComponent(App, {}), root);
