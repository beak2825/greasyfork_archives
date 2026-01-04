// ==UserScript==
// @name        Drop My Flickr Links!
// @namespace   https://github.com/stanleyqubit/drop-my-flickr-links
// @license     MIT License
// @author      stanleyqubit
// @compatible  firefox Tampermonkey with UserScripts API Dynamic
// @compatible  chrome Violentmonkey or Tampermonkey
// @compatible  edge Violentmonkey or Tampermonkey
// @compatible  opera Tampermonkey
// @match       *://*.flickr.com/*
// @connect     flickr.com
// @connect     staticflickr.com
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_download
// @grant       GM_openInTab
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @version     3.0.2
// @icon        https://www.google.com/s2/favicons?sz=64&domain=flickr.com
// @description Creates a hoverable dropdown menu that shows links to all available sizes for Flickr photos.
// @downloadURL https://update.greasyfork.org/scripts/493773/Drop%20My%20Flickr%20Links%21.user.js
// @updateURL https://update.greasyfork.org/scripts/493773/Drop%20My%20Flickr%20Links%21.meta.js
// ==/UserScript==


/*
  The photos available for download through this userscript may be protected by
  copyright laws. Downloading a photo constitutes your agreement to use the
  photo in accordance with the license associated with it. Please check the
  individual photo's license information before use.

  Note -- Firefox + Tampermonkey users: in order for the script to have full
  access to the Flickr YUI `appContext` global variable and thus avoid having to
  resort to workarounds which may result in incorrectly displayed links or
  incomplete photo data, go to the Tampermonkey dashboard -> Settings, under
  "Config mode" select "Advanced", then under "Content Script API" select
  "UserScripts API Dynamic", then click "Save".

  FYI -- some authors may choose to disable photo downloads which means that
  Flickr will not make certain photo sizes (e.g. originals) available for users
  that aren't signed in with a Flickr account.
*/


const SCRIPT_NAME = "Drop My Flickr Links!";

const $ = (selector, node=document) =>
  node.querySelector(selector);

const $$ = (selector, node=document) =>
  node.querySelectorAll(selector);

const $new = (tagName, className='', innerHTML='') => {
  const elem = document.createElement(tagName);
  elem.className = className;
  elem.innerHTML = innerHTML;
  return elem;
}

const isObject = (val) =>
  Object.prototype.toString.call(val) === '[object Object]';

const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const clamp = (min, max, value) =>
  Math.max(min, Math.min(max, value));

const sequence = (min, max, step) =>
  [...Array(Math.floor((max - min) / step) + 1).keys()].map(i => i * step + min);

const getOr = (...args) => {
  while (args.length) {
    const v = args.shift();
    if (v != null && v !== '')
      return v;
  }
}

const isLightboxURL = (url) =>
  url.lastIndexOf('/lightbox') > 34;

const hasClass = (node, className) =>
  node.classList?.contains(className);

const isDropdownElement = (el) =>
  el?.getAttribute?.('class')?.startsWith?.('dmfl-dd');

const mouseInside = (e, rect) =>
  (e.clientX >= rect.left
   && e.clientX <= rect.right
   && e.clientY >= rect.top
   && e.clientY <= rect.bottom);

const isValidImageURL = (url) =>
  /(?<!combo\.)(static\.?|staging-jubilee\.)flickr\.com\/[a-z0-9_\/]+\.(jpg|png|gif)$/.test(url);

const isValidHref = (href) =>
  /flickr\.com\/(photos(?!\/tags\/)\/[-\w@]+\/[0-9]+|gp\/[-\w@]+\/[\w]+)(?!.*\/sizes\/)/.test(href);


const Settings = {
  defaults: {
    MAIN_PHOTO_ENGAGEMENT_VIEW: {
      section: 'general',
      type: 'checkbox',
      value: true,
      name: 'Main photo page engagement view',
      desc: `Place the dropdown inside the engagement view when navigating the
             main photo page.`,
    },
    REPLACE_FLICKR_DL_BUTTON: {
      section: 'general',
      type: 'checkbox',
      value: false,
      name: 'Replace Flickr download button',
      desc: `Replace the Flickr download button shown in the main photo page
             with our button. Requires "Main photo page engagement view".`,
    },
    PREPEND_AUTHOR_ID: {
      section: 'general',
      type: 'checkbox',
      value: true,
      name: 'Prepend author ID to the saved image file name <sup>429 ?</sup>',
      desc: `While this may be a quality-of-life feature, enabling this option
             comes at the expense of using 'GM_download' to save images, which
             means that a custom XHR is sent every time you attempt to download
             an image. Downloading a lot of images in a short period of time may
             trigger 429 response status codes from the server. While the script
             does have mitigations set in place (such as automatic retries) if
             this is bound to happen, if 429 errors become too frequent and a
             nuisance for you, consider switching this option off.`,
    },

    /* Dropdown button appearance */

    BUTTON_WIDTH: {
      section: 'appearance',
      type: 'select',
      value: 24, // Should be an even number so that the svg inside centers properly
      name: 'Dropdown button size',
      desc: `CSS pixel unit value.`,
      options: sequence(10, 100, 2),
    },
    BUTTON_TEXT_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#ffffff',
      name: 'Dropdown button text color',
      desc: `CSS color value.`,
    },
    BUTTON_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#5272ad', /* '#6495ed' */
      name: 'Dropdown button background color',
      desc: `CSS color value.`,
    },
    BUTTON_HOVER_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#519c60',
      name: 'Dropdown button background color on hover',
      desc: `CSS color value.`,
    },
    BUTTON_OPACITY: {
      section: 'appearance',
      type: 'number',
      value: 0.75,
      min: 0,
      max: 1,
      step: 0.01,
      name: 'Dropdown button opacity',
      desc: `CSS alpha value. Range [0.0, 1.0].`,
    },
    BUTTON_HOVER_OPACITY: {
      section: 'appearance',
      type: 'number',
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01,
      name: 'Dropdown button opacity on hover',
      desc: `CSS alpha value. Range [0.0, 1.0].`,
    },

    /* Dropdown menu appearance */

    CONTENT_TEXT_SIZE: {
      section: 'appearance',
      type: 'number',
      value: 18,
      min: 5,
      max: 100,
      step: 1,
      name: 'Dropdown menu text size',
      desc: `CSS pixel unit value.`,
    },
    CONTENT_A_TEXT_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#000000',
      name: 'Dropdown menu anchor element text color',
      desc: `CSS color value.`,
    },
    CONTENT_A_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#e8e9db',
      name: 'Dropdown menu anchor element background color',
      desc: `CSS color value.`,
    },
    CONTENT_A_HOVER_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#cfdbe1',
      name: 'Dropdown menu anchor element background color on hover',
      desc: `CSS color value.`,
    },
    CONTENT_A_PADDING: {
      section: 'appearance',
      type: 'text',
      value: '5px 10px',
      name: 'Dropdown menu anchor element padding',
      desc: `CSS padding value.`,
    },
    CONTENT_DIV_TEXT_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#000000',
      name: 'Dropdown menu preview element text color',
      desc: `CSS color value.`,
    },
    CONTENT_DIV_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#e7e4c5',
      name: 'Dropdown menu preview element background color',
      desc: `CSS color value.`,
    },
    CONTENT_DIV_HOVER_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#8dc5ed',
      name: 'Dropdown menu preview element background color on hover',
      desc: `CSS color value.`,
    },
    CONTENT_DIV_PADDING: {
      section: 'appearance',
      type: 'text',
      value: '5px 18px',
      name: 'Dropdown menu preview element padding',
      desc: `CSS padding value.`,
    },

    /* Dropdown navigation */

    DROPDOWN_NAV_UP_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: 'q',
      name: 'Dropdown navigation "up"',
      desc: `Cycles through the dropdown entries upwards and around.`,
    },
    DROPDOWN_NAV_DOWN_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: 'w',
      name: 'Dropdown navigation "down"',
      desc: `Cycles through the dropdown entries downwards and around.`,
    },

    /* Preview mode */

    PREVIEW_MODE_FADE_IN: {
      section: 'appearance',
      type: 'checkbox',
      value: true,
      name: 'Preview mode fade in transition',
      desc: `Adds a "fade in" animation when entering preview mode.`,
    },
    PREVIEW_MODE_SHOW_CONTROLS: {
      section: 'appearance',
      type: 'checkbox',
      value: true,
      name: 'Preview mode show image controls',
      desc: `Adds a widget for image control to the top left corner when in
             preview mode.`,
    },
    PREVIEW_MODE_SHOW_CLOSE_BUTTON: {
      section: 'appearance',
      type: 'checkbox',
      value: true,
      name: 'Preview mode show close button',
      desc: `Adds a clickable close button to the top right corner when in
             preview mode.`,
    },
    PREVIEW_MODE_SHOW_DOWNLOAD_BUTTON: {
      section: 'appearance',
      type: 'checkbox',
      value: true,
      name: 'Preview mode show download button',
      desc: `Adds a clickable download button to the bottom right corner when in
             preview mode.`,
    },
    PREVIEW_MODE_SHOW_RESOLUTION_INFO: {
      section: 'appearance',
      type: 'checkbox',
      value: true,
      name: 'Preview mode show image resolution information',
      desc: `Shows the photo's dimensions when in preview mode.`,
    },
    PREVIEW_MODE_SHOW_LICENSE_INFO: {
      section: 'appearance',
      type: 'checkbox',
      value: true,
      name: 'Preview mode show license information',
      desc: `Shows a hyperlink to the photo's license when in preview mode.`,
    },
    PREVIEW_MODE_AUTOENTER: {
      section: 'general',
      type: 'checkbox',
      value: false,
      name: 'Preview mode auto-enter',
      desc: `Automatically enters preview mode with the largest available image
             size when hovering images with the mouse cursor.`,
    },
    PREVIEW_MODE_AUTOENTER_DELAY: {
      section: 'general',
      type: 'number',
      value: 1000,
      min: 100,
      max: 10000,
      step: 100,
      name: 'Preview mode auto-enter delay',
      desc: `How much time to wait (in milliseconds) after hovering an image and
             before loading the preview. Has no effect if "Preview mode
             auto-enter" is off.`,
    },
    PREVIEW_MODE_AUTOENTER_FREEZE: {
      section: 'general',
      type: 'checkbox',
      value: false,
      name: 'Preview mode auto-enter freeze',
      desc: `If on, mouse movement does not exit preview mode. If off, preview
             mode exits as soon as the mouse cursor leaves the bounding box of
             the image that was previously hovered. Has no effect if "Preview
             mode auto-enter" is off.`,
    },
    PREVIEW_MODE_SCROLL_TO_ZOOM: {
      section: 'general',
      type: 'checkbox',
      value: true,
      name: 'Preview mode zoom on mouse scroll',
      desc: `Zoom the preview image with the mouse wheel.`,
    },
    PREVIEW_MODE_EXIT_ON_MOUSE_EVENT: {
      section: 'general',
      type: 'select',
      value: 'dblclick',
      name: 'Preview mode exit on mouse event',
      desc: `Exits preview mode on this mouse event.`,
      options: {'Double click': 'dblclick', 'Click': 'click', 'None': ''},
    },
    PREVIEW_MODE_BACKGROUND_OPACITY: {
      section: 'appearance',
      type: 'number',
      value: 0.65,
      min: 0,
      max: 1,
      step: 0.01,
      name: 'Preview mode background opacity',
      desc: `CSS alpha value. Range [0.0, 1.0].`,
    },
    PREVIEW_MODE_ICON_WIDTH: {
      section: 'appearance',
      type: 'select',
      value: 40, // Should be an even number so that the svg inside centers properly
      name: 'Preview mode icon size',
      desc: `CSS pixel unit value.`,
      options: sequence(30, 150, 2),
    },
    PREVIEW_MODE_ICON_FILL_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#f0fff0', /* honeydew */
      name: 'Preview mode icon fill color',
      desc: `Fill color for the vector graphic shown inside the icon. CSS color
             value.`,
    },
    PREVIEW_MODE_ICON_BG_COLOR: {
      section: 'appearance',
      type: 'text',
      value: '#586887',
      name: 'Preview mode icon background color',
      desc: `CSS color value.`,
    },
    PREVIEW_MODE_ICON_OPACITY: {
      section: 'appearance',
      type: 'number',
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.01,
      name: 'Preview mode icon opacity',
      desc: `CSS alpha value. Range [0.0, 1.0].`,
    },
    SAVE_IMAGE_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: 's',
      name: 'Save image',
      desc: `Downloads and saves the image locally (same as manually clicking
             the links in the dropdown). Can be pressed when the preview mode is
             open or when the dropdown element is shown inside the page, in
             which case, either the largest available image size or the one
             selected via dropdown navigation keys will be saved.`,
    },
    PREVIEW_MODE_ENTER_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: 'e',
      name: 'Preview mode enter',
      desc: `Enters preview mode with the largest available image size if no
             dropdown entry is selected via dropdown navigation keys, or with
             the selected navigation entry image size.`,
    },
    PREVIEW_MODE_EXIT_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: 'Escape',
      name: 'Preview mode exit / Dropdown navigation hide',
      desc: `Exits preview mode or hides the dropdown content if navigation has
             been started.`,
    },
    PREVIEW_MODE_ROTATE_CW_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: '>',
      name: 'Preview mode rotate clockwise key',
      desc: `Rotates the preview image 90 degrees clockwise when this key is
             pressed.`,
    },
    PREVIEW_MODE_ROTATE_CCW_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: '<',
      name: 'Preview mode rotate counter-clockwise key',
      desc: `Rotates the preview image 90 degrees counter-clockwise when this
             key is pressed.`,
    },
    PREVIEW_MODE_ZOOM_IN_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: '+',
      name: 'Preview mode zoom in key',
      desc: `Zooms in the preview image when this key is pressed.`,
    },
    PREVIEW_MODE_ZOOM_OUT_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: '-',
      name: 'Preview mode zoom out key',
      desc: `Zooms out the preview image when this key is pressed.`,
    },
    PREVIEW_MODE_TOGGLE_FIT_KB: {
      section: 'keybindings',
      type: 'kbd',
      value: '*',
      name: 'Preview mode toggle fit to screen key',
      desc: `Toggles the preview image between fit to screen view and full size
             view when this key is pressed.`,
    },
  },

  getValue(settingName, settingsObj) {
    const defaultData = this.defaults[settingName];
    const defaultOpts = defaultData.options;
    const defaultValue = defaultData.value;
    let value = settingsObj.hasOwnProperty(settingName)
      ? settingsObj[settingName]
      : defaultValue;

    // Starting with version 3, all setting values are primitive data types.
    // In order to preserve the existing stored settings, try to salvage saved
    // values from the previous settings object which had a different structure.
    if (typeof value === 'object') {
      value = value.value;
      if (typeof value === 'object') {
        value = value.key;
      }
    }

    if (typeof value === typeof defaultValue) {
      if (defaultOpts && !Object.values(defaultOpts).includes(value)) {
        return defaultValue;
      }
      return value;
    }
    return defaultValue;
  },

  // Flatten the the settings object down to the `value` field
  getOpts(settingsObj) {
    const opts = Object.create(null);
    opts.KEYBINDINGS = Object.create(null);
    for (const settingName in this.defaults) {
      const value = this.getValue(settingName, settingsObj);
      opts[settingName] = value;
      if (settingName.endsWith('_KB') && getOr(value)) {
        opts.KEYBINDINGS[value] = settingName;
      }
    }
    opts.PREVIEW_MODE_IS_VOLATILE = opts.PREVIEW_MODE_AUTOENTER
      && !opts.PREVIEW_MODE_AUTOENTER_FREEZE;
    return opts;
  },
}

const LICENSE_INFO = [
  {
    value: '0',
    text: 'All Rights Reserved',
    //desc: "You must request permission from the creator to use this work.",
    desc: 'The content owner retains all rights provided by copyright law. As such, you cannot reproduce, distribute and/or adapt any part of the work without permission.',
    url: 'https://www.flickrhelp.com/hc/en-us/articles/10710266545556-Using-Flickr-images-shared-by-other-members'
  },
  {
    value: '1',
    text: 'CC BY-NC-SA 2.0',
    //desc: "You can use this work, but only in a non-commercial way, so long as credit is given to the creator. You must then allow your work to be used under the same terms.",
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may not use the material for commercial purposes. If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.',
    url: 'https://creativecommons.org/licenses/by-nc-sa/2.0/'
  },
  {
    value: '2',
    text: 'CC BY-NC 2.0',
    //desc: "You can use this work, but only in a non-commercial way, so long as credit is given to the creator.",
    desc: 'You must give appropriate credit, provide a link to the license and indicate if changes were made. You may not use the material for commercial purposes.',
    url: 'https://creativecommons.org/licenses/by-nc/2.0/'
  },
  {
    value: '3',
    text: 'CC BY-NC-ND 2.0',
    //desc: "You can use this work, in its original form without any modifications and only in a non-commercial way, so long as credit is given to the creator.",
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may not use the material for commercial purposes. If you remix, transform, or build upon the material, you may not distribute the modified material.',
    url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/'
  },
  {
    value: '4',
    text: 'CC BY 2.0',
    //desc: "You can use this work so long as credit is given to the creator.",
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made.',
    url: 'https://creativecommons.org/licenses/by/2.0/'
  },
  {
    value: '5',
    text: 'CC BY-SA 2.0',
    //desc: "You can use this work so long as credit is given to the creator. You must then allow your work to be used under the same terms.",
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.',
    url: 'https://creativecommons.org/licenses/by-sa/2.0/'
  },
  {
    value: '6',
    text: 'CC BY-ND 2.0',
    //desc: "You can use this work, in its original form without any modifications, so long as credit is given to the creator.",
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. If you remix, transform, or build upon the material, you may not distribute the modified material.',
    url: 'https://creativecommons.org/licenses/by-nd/2.0/'
  },
  {
    value: '7',
    text: 'No known copyright restrictions',
    //desc: "The individual or organization posting the work is unaware of any restrictions. You should review the work prior to proceeding with use.",
    desc: 'This content is shared as part of the Flickr Commons, and has been determined to be free of copyright restrictions.',
    url: '/commons/usage/'
  },
  {
    value: '8',
    text: 'United States Government Work',
    //desc: "Copyright protection is not available for any work of the United States Government.",
    desc: 'Most U.S. government creative works such as writing or images are copyright-free. But not everything is. So before you use a U.S. government work, learn more (click).',
    url: 'https://www.usa.gov/government-copyright'
  },
  {
    value: '9',
    text: 'Public Domain Dedication (CC0)',
    //desc: "You can use this work since the copyright is no longer enforced.",
    desc: 'This work has been placed as completely as possible in the public domain. You may freely build upon, enhance and reuse the works for any purposes without restriction.',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  {
    value: '10',
    text: 'Public Domain Mark',
    //desc: "You can use this work since the copyright has expired.",
    desc: 'This work is no longer restricted by copyright and can be freely used.',
    url: 'https://creativecommons.org/publicdomain/mark/1.0/'
  },
  {
    value: '11',
    text: 'CC BY 4.0',
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made.',
    url: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    value: '12',
    text: 'CC BY-SA 4.0',
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/'
  },
  {
    value: '13',
    text: 'CC BY-ND 4.0',
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. If you remix, transform, or build upon the material, you may not distribute the modified material.',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/'
  },
  {
    value: '14',
    text: 'CC BY-NC 4.0',
    desc: 'You must give appropriate credit, provide a link to the license and indicate if changes were made. You may not use the material for commercial purposes.',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/'
  },
  {
    value: '15',
    text: 'CC BY-NC-SA 4.0',
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may not use the material for commercial purposes. If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
  },
  {
    value: '16',
    text: 'CC BY-NC-ND 4.0',
    desc: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may not use the material for commercial purposes. If you remix, transform, or build upon the material, you may not distribute the modified material.',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
  }
];

const ICONS = {
  "default": {
  /**
   * https://www.svgrepo.com/collection/chunk-16px-thick-interface-icons/
   * Author: Noah Jacobus
   * Website: https://noahjacob.us/
   * License: PD
   */
    loader:
      `<?xml version="1.0" encoding="utf-8"?>
      <svg class="dmfl-svg dmfl-svg-loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"  width="100%" height="100%">
      <circle transform-origin="50 50" cy="50" cx="50" r="35" fill="none" stroke-width="14" stroke-dasharray="164.933 54.977" filter="drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" /></circle>
      </svg>`
    ,
    dd_db_populated:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-dd-db-populated" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-dd-db-populated" fill-rule="evenodd" clip-rule="evenodd" d="M2 0H7C11.4183 0 15 3.58172 15 8C15 12.4183 11.4183 16 7 16H2V0ZM5 3V13H7C9.76142 13 12 10.7614 12 8C12 5.23858 9.76142 3 7 3H5Z"/>
      </svg>`
    ,
    pm_close_but:
      `<!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-closebut" filter="drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.29 -5.29 186.84 186.84" xml:space="preserve">
      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#252323" stroke-width="5.288">
      <path class="dmfl-svg-path dmfl-svg-pm-closebut" d="M0,143.124L54.994,88.13L0,33.136L33.135,0L88.13,54.995L143.125,0l33.135,33.136L121.266,88.13l54.994,54.994 l-33.135,33.136L88.13,121.265L33.135,176.26L0,143.124z"/> </g>
      <g id="SVGRepo_iconCarrier">
      <path class="dmfl-svg-path dmfl-svg-pm-closebut" d="M0,143.124L54.994,88.13L0,33.136L33.135,0L88.13,54.995L143.125,0l33.135,33.136L121.266,88.13l54.994,54.994 l-33.135,33.136L88.13,121.265L33.135,176.26L0,143.124z"/> </g>
      </svg>`
    ,
    pm_dl_but:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-dlbut" viewBox="0 0 16 16" fill="none" filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-dlbut" d="M13 7H10V0H6V7L3 7V8L8 13L13 8V7Z"/>
      <path class="dmfl-svg-path dmfl-svg-pm-dlbut" d="M14 14H2V16H14V14Z"/>
      </svg>`
    ,
    pc_main:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-pc-main" viewBox="0 0 16 16" fill="none" filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-pc-main" fill-rule="evenodd" clip-rule="evenodd" d="M6.50001 0H9.50001L10.0939 2.37548C10.7276 2.6115 11.3107 2.95155 11.8223 3.37488L14.1782 2.70096L15.6782 5.29904L13.9173 7.00166C13.9717 7.32634 14 7.65987 14 8C14 8.34013 13.9717 8.67366 13.9173 8.99834L15.6782 10.701L14.1782 13.299L11.8223 12.6251C11.3107 13.0484 10.7276 13.3885 10.0939 13.6245L9.50001 16H6.50001L5.90614 13.6245C5.27242 13.3885 4.68934 13.0484 4.17768 12.6251L1.82181 13.299L0.321808 10.701L2.08269 8.99834C2.02831 8.67366 2.00001 8.34013 2.00001 8C2.00001 7.65987 2.02831 7.32634 2.08269 7.00166L0.321808 5.29904L1.82181 2.70096L4.17768 3.37488C4.68934 2.95155 5.27241 2.6115 5.90614 2.37548L6.50001 0ZM8.00001 10C9.10458 10 10 9.10457 10 8C10 6.89543 9.10458 6 8.00001 6C6.89544 6 6.00001 6.89543 6.00001 8C6.00001 9.10457 6.89544 10 8.00001 10Z"/>
      </svg>`
    ,
    pc_rotcw:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-pc-rotcw" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-pc-rotcw" d="M10 7L9 6L11.2929 3.70711L10.8013 3.21553C10.023 2.43724 8.96744 2 7.86677 2C4.63903 2 2 4.68015 2 7.93274C2 11.2589 4.69868 14 8 14C9.53708 14 11.0709 13.4144 12.2426 12.2426L13.6569 13.6569C12.095 15.2188 10.0458 16 8 16C3.56933 16 0 12.3385 0 7.93274C0 3.60052 3.50968 0 7.86677 0C9.49787 0 11.0622 0.647954 12.2155 1.80132L12.7071 2.29289L15 0L16 1V7H10Z"/>
      </svg>`
    ,
    pc_rotccw:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-pc-rotccw" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-pc-rotccw" d="M6 7L7 6L4.70711 3.70711L5.19868 3.21553C5.97697 2.43724 7.03256 2 8.13323 2C11.361 2 14 4.68015 14 7.93274C14 11.2589 11.3013 14 8 14C6.46292 14 4.92913 13.4144 3.75736 12.2426L2.34315 13.6569C3.90505 15.2188 5.95417 16 8 16C12.4307 16 16 12.3385 16 7.93274C16 3.60052 12.4903 0 8.13323 0C6.50213 0 4.93783 0.647954 3.78447 1.80132L3.29289 2.29289L1 0L0 1V7H6Z"/>
      </svg>`
    ,
    pc_togglefit:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-pc-togglefit" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-pc-togglefit" fill-rule="evenodd" clip-rule="evenodd" d="M0 2H16V12H10V13L12 15V16H4V15L6 13V12H0V2ZM2 4H14V10H2V4Z"/>
      </svg>`
    ,
    pc_zoomin:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-pc-zoomin" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-pc-zoomin" fill-rule="evenodd" clip-rule="evenodd" d="M15 1H1V15H15V1ZM7 4H9V7H12V9H9V12H7V9H4V7H7V4Z"/>
      </svg>`
    ,
    pc_zoomout:
      `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg class="dmfl-svg dmfl-svg-pm-pc-zoomout" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="dmfl-svg-path dmfl-svg-pm-pc-zoomout" fill-rule="evenodd" clip-rule="evenodd" d="M15 1H1V15H15V1ZM4 7V9L12 9V7L4 7Z"/>
      </svg>`
    ,
  },
};

const DS_KEYS = [
  "o", "8k", "7k", "6k", "5k", "4k", "3k", "k", "h",
  "l", "c", "z", "m", "w", "n", "s", "q", "t", "sq"
];

const overlay = $new('div', 'dmfl-overlay');
overlay.style.display = 'none';

const loader = $new('div', 'dmfl-loader', ICONS.default.loader);
let startupLoader = $new('div', 'dmfl-startup-loader', ICONS.default.dd_db_populated);

const nodesProcessed = new Map();
const nodesBlacklisted = new Set();
const idsPopulating = new Set();
const urlsDownloading = new Set();
const page = Object.create(null);
const cache = Object.create(null);
const o = Settings.getOpts(GM_getValue('settings', {}));
let styleElement;


function setStyle(o) {

  styleElement?.remove();
  const style = `

  :root.dmfl-pv-open, :root.dmfl-sm-open {
    overflow: hidden;
  }

  :root.dmfl-pv-open.dmfl-sm-open .dmfl-sm {
    transition: background-color 1.5s;
    background-color: rgba(0,0,0,0);
  }

  @keyframes dmfl-fade-anim {
    0% { opacity: 0 } 100% { opacity: 1 }
  }

  @keyframes dmfl-scale-anim {
    0% { transform: scale(0); visibility: hidden; } 100% { transform: scale(1); visibility: visible; }
  }

  @keyframes dmfl-spin-anim {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); background-color: ${o.BUTTON_HOVER_BG_COLOR}; }
    100% { transform: rotate(360deg); }
  }

  /*
   ================
   === Dropdown ===
   ================
  */

  .dmfl-dd-container {
    width: ${o.BUTTON_WIDTH}px;
    height: ${o.BUTTON_WIDTH}px;
    display: block;
    cursor: pointer;
    z-index: 203;
  }

  .dmfl-dd-container.dmfl-sm-mode {
    position: absolute;
    z-index: 20001;
  }

  .dmfl-dd-container.dmfl-thumbnail {
    position: absolute;
    box-sizing: content-box;
    padding: 3px;
  }

  .dmfl-dd-container.dmfl-thumbnail:hover {
    width: max-content;
    height: max-content;
  }

  .dmfl-dd-container[class*="dmfl-engagement-view"] {
    display: flex;
    position: relative;
  }

  .dmfl-dd-container.dmfl-engagement-view-main-photo-page {
    align-items: center;
    margin-right: 12px;
  }

  .dmfl-dd-container:hover .dmfl-dd-content,
  .dmfl-dd-container.dmfl-dd-select-mode .dmfl-dd-content {
    visibility: visible;
  }

  .dmfl-dd-container:hover .dmfl-dd-button.dmfl-populated,
  .dmfl-dd-container.dmfl-dd-select-mode .dmfl-dd-button.dmfl-populated {
    opacity: ${o.BUTTON_HOVER_OPACITY};
  }

  .dmfl-dd-container:hover .dmfl-dd-button.dmfl-populated,
  .dmfl-dd-container.dmfl-dd-select-mode .dmfl-dd-button.dmfl-populated {
    background-color: ${o.BUTTON_HOVER_BG_COLOR};
  }

  .dmfl-dd-button .dmfl-svg-dd-db-populated {
    width: round(down, ${o.BUTTON_WIDTH * 0.5}px, 2px);
    height: round(down, ${o.BUTTON_WIDTH * 0.5}px, 2px);
    fill: ${o.BUTTON_TEXT_COLOR};
  }

  .dmfl-dd-button {
    display: flex;
    width: ${o.BUTTON_WIDTH}px;
    height: ${o.BUTTON_WIDTH}px;
    justify-content: center;
    align-items: center;
    font-size: calc(${o.BUTTON_WIDTH}px * 0.75);
    color: ${o.BUTTON_TEXT_COLOR};
    background-color: ${o.BUTTON_BG_COLOR};
    opacity: ${o.BUTTON_OPACITY};
  }

  .dmfl-dd-button.dmfl-sm-mode {
    animation: 0.5s ease-out 0s 1 normal dmfl-spin-anim;
  }

  .dmfl-dd-button.dmfl-thumbnail {
    position: relative;
  }

  .dmfl-dd-button[class*="dmfl-engagement-view"] {
    position: absolute;
  }

  .dmfl-dd-button.dmfl-populated-fail {
    background-color: #f08080; /* lightcoral */
  }

  .dmfl-dd-content {
    visibility: hidden;
    width: max-content;
    height: max-content;
    background-color: #f1f1f1;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    font-size: ${o.CONTENT_TEXT_SIZE}px;
    text-align: center;
    text-decoration: none;
    user-select: none;
  }

  .dmfl-dd-content.dmfl-thumbnail {
    position: relative;
  }

  .dmfl-dd-content[class*="dmfl-engagement-view"] {
    position: absolute;
    right: 0;
    bottom: ${o.BUTTON_WIDTH}px;
  }

  .dmfl-dd-content.dmfl-populated-fail {
    background-color: #efe4eb;
    box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    padding: 5px;
    text-align: left;
  }

  .dmfl-dd-entry {
    display: grid;
    grid-template-columns: 1fr auto;
    white-space: nowrap;
    line-height: normal;
    cursor: pointer;
  }

  .dmfl-dd-entry.dmfl-selected {
    outline: solid #6495ed;
  }

  .dmfl-dd-entry a {
    color: ${o.CONTENT_A_TEXT_COLOR} !important;
    background-color: ${o.CONTENT_A_BG_COLOR};
    padding: ${o.CONTENT_A_PADDING};
  }

  .dmfl-dd-entry a:hover {
    background-color: ${o.CONTENT_A_HOVER_BG_COLOR};
    text-decoration: underline;
  }

  .dmfl-dd-entry .dmfl-dd-entry-pv {
    font-family: sans-serif;
    font-weight: lighter;
    color: ${o.CONTENT_DIV_TEXT_COLOR};
    background-color: ${o.CONTENT_DIV_BG_COLOR};
    padding: ${o.CONTENT_DIV_PADDING};
  }

  .dmfl-dd-entry .dmfl-dd-entry-pv .dmfl-svg-dd-dc-pv {
    fill: ${o.CONTENT_DIV_TEXT_COLOR};
    width: 100%;
    height: 100%;
  }

  .dmfl-dd-entry .dmfl-dd-entry-pv:hover {
    background-color: ${o.CONTENT_DIV_HOVER_BG_COLOR};
    opacity: .9;
  }

  /*
   ====================
   === Preview mode ===
   ====================
  */

  .dmfl-pv {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 30000;
    animation: ${o.PREVIEW_MODE_FADE_IN ? '0.35s ease-out forwards dmfl-fade-anim' : 'none'};
  }

  .dmfl-pv-bg {
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,${o.PREVIEW_MODE_BACKGROUND_OPACITY});
    display: flex;
    position: fixed;
    z-index: 30000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .dmfl-pv-img-wrapper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .dmfl-pv-img {
    --dmfl-pv-img-translateX: 0;
    --dmfl-pv-img-translateY: 0;
    --dmfl-pv-img-scale: 1;
    --dmfl-pv-img-rotate: 0deg;
    visibility: hidden;
    position: absolute;
    cursor: grab;
    max-width: none;
    max-height: none;
    translate: none;
    rotate: none;
    scale: none;
    transform-origin: 0 0;
    transform: translateX(var(--dmfl-pv-img-translateX)) translateY(var(--dmfl-pv-img-translateY)) rotate(var(--dmfl-pv-img-rotate)) scale(var(--dmfl-pv-img-scale));
  }

  .dmfl-pv-bg svg[class*=dmfl-svg-pm-] {
    width: round(down, ${o.PREVIEW_MODE_ICON_WIDTH * 0.6}px, 2px);
    height: round(down, ${o.PREVIEW_MODE_ICON_WIDTH * 0.6}px, 2px);
  }

  .dmfl-pv-bg svg[class*=dmfl-svg-pm-]:not(.dmfl-svg-pm-closebut) > .dmfl-svg-path {
    fill: ${o.PREVIEW_MODE_ICON_FILL_COLOR};
  }

  .dmfl-pv-controls {
    --dmfl-pv-controls-opacity: 0;
    display: flex;
    align-items: center;
    font-size: ${o.PREVIEW_MODE_ICON_WIDTH * 0.7}px;
    line-height: 1;
    color: ${o.PREVIEW_MODE_ICON_FILL_COLOR};
    border-radius: calc(${o.PREVIEW_MODE_ICON_WIDTH}px / 4);
    background-color: ${o.PREVIEW_MODE_ICON_BG_COLOR};
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 30001;
    cursor: pointer;
    opacity: var(--dmfl-pv-controls-opacity);
    transition: all 1s;
  }

  .dmfl-pv-controls-rubberband {
    display: inline-flex;
    justify-content: space-around;
    width: 0px;
    height: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    opacity: .35;
    transition: all 0.5s ease-out;
  }

  .dmfl-pv-controls-rubberband > span {
    align-self: center;
  }

  .dmfl-pv-controls-main {
    display: inline-flex;
    width: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    height: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    margin: 0;
    justify-content: center;
    align-items: center;
    rotate: 0deg;
    transition: rotate 0.5s linear;
  }

  .dmfl-svg-path.dmfl-svg-pm-pc-main {
    transition: fill 2s;
  }

  .dmfl-pv-controls-rubberband > span:not(.dmfl-pv-controls-main) {
    display: none;
    opacity: 0;
    transform-origin: bottom;
    transform: translateY(${o.PREVIEW_MODE_ICON_WIDTH}px);
    animation-name: dmfl-pv-controls-anim;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
    animation-duration: 0.2s;
  }

  .dmfl-pv-controls:hover .dmfl-pv-controls-rubberband {
    width: ${o.PREVIEW_MODE_ICON_WIDTH * 6}px;
    opacity: 1;
  }

  .dmfl-pv-controls:hover {
    opacity: 1;
    background-color: #586887;
  }

  .dmfl-pv-controls:hover .dmfl-pv-controls-main {
    rotate: 90deg;
  }

  .dmfl-pv-controls:hover .dmfl-svg-path.dmfl-svg-pm-pc-main {
    fill: #e1d59f !important;
  }

  .dmfl-pv-controls:hover .dmfl-pv-controls-rubberband > span:not(.dmfl-pv-controls-main) {
    display: inline-flex;
  }

  .dmfl-pv-controls-rot-cw {
    animation-delay: 0.3s;
  }

  .dmfl-pv-controls-rot-ccw {
    animation-delay: 0.4s;
  }

  .dmfl-pv-controls-toggle-fit {
    animation-delay: 0.5s;
  }

  .dmfl-pv-controls-zoom-in {
    animation-delay: 0.6s;
  }

  .dmfl-pv-controls-zoom-out {
    animation-delay: 0.7s;
  }

  .dmfl-pv-controls-rubberband > span:not(.dmfl-pv-controls-main):hover {
    color: #7fffd4; /* aquamarine */
  }

  .dmfl-pv-controls-rubberband > span:not(.dmfl-pv-controls-main):hover .dmfl-svg-path {
    fill: #7fffd4;
  }

  @keyframes dmfl-pv-controls-anim {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dmfl-pv-close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    height: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    top: 20px;
    right: 20px;
    font-size: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    font-weight: bold;
    color: ${o.PREVIEW_MODE_ICON_FILL_COLOR};
    background-color: ${o.PREVIEW_MODE_ICON_BG_COLOR};
    border-radius: calc(${o.PREVIEW_MODE_ICON_WIDTH}px / 4);
    opacity: ${o.PREVIEW_MODE_ICON_OPACITY};
    text-shadow: 1px 1px 1px black;
    z-index: 30001;
    cursor: pointer;
  }

  .dmfl-pv-close:hover {
    color: #c5a853;
    opacity: 1;
  }

  .dmfl-pv-close .dmfl-svg {
    fill: ${o.PREVIEW_MODE_ICON_FILL_COLOR};
  }

  .dmfl-pv-close:hover .dmfl-svg {
    fill: #c5a853;
  }

  .dmfl-pv-download {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-decoration: underline;
    font-size: ${o.PREVIEW_MODE_ICON_WIDTH * 0.7}px;
    font-weight: bold;
    line-height: 1;
    height: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    width: ${o.PREVIEW_MODE_ICON_WIDTH}px;
    color: ${o.PREVIEW_MODE_ICON_FILL_COLOR};
    background-color: ${o.PREVIEW_MODE_ICON_BG_COLOR};
    position: fixed;
    z-index: 30001;
    right: 20px;
    bottom: 20px;
    border-radius: calc(${o.PREVIEW_MODE_ICON_WIDTH}px / 4);
    opacity: ${o.PREVIEW_MODE_ICON_OPACITY};
    cursor: pointer;
  }

  .dmfl-pv-download:hover {
    opacity: 1;
  }

  .dmfl-pv-photo-info-wrapper {
    display: flex;
    color: #fff !important;
    font-size: 13.5px;
    position: fixed;
    z-index: 30001;
    left: 20px;
    bottom: 20px;
  }

  .dmfl-pv-photo-info-wrapper * {
    position: relative;
    display: inline-block;
    color: #fff !important;
    margin-right: 5px;
    padding: 2px 5px 2px 5px;
    border-radius: 5px;
  }

  .dmfl-pv-license-info {
    background-color: #2f4f4fa8;
  }

  .dmfl-pv-resolution-info {
    background-color: #4a5a78b3;
  }

  /*
   ======================
   === Settings modal ===
   ======================
  */

  .dmfl-sm {
    display: flex;
    visibility: hidden;
    justify-content: center;
    align-items: center;
    position: fixed; /* Stay in place */
    z-index: 20000; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
  }

  .dmfl-sm.open, .dmfl-sm.opening {
    visibility: visible;
  }

  .dmfl-sm.opening {
    animation: 0.35s ease-out forwards dmfl-fade-anim;
    animation-direction: normal;
  }

  .dmfl-sm.closing {
    animation: 0.35s ease-in forwards dmfl-fade-anim;
    animation-direction: reverse;
  }

  .dmfl-sm-content {
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: #dce0e9;
    padding: 1.25rem;
    border: 1px solid #628b97;
    width: max-content;
    max-height: 80%;
    overflow: hidden;
    overscroll-behavior: contain;
    border-radius: 10px;
  }

  .dmfl-sm-content.opening {
    animation: 0.35s ease-out forwards dmfl-scale-anim;
    animation-direction: normal;
  }

  .dmfl-sm-content.closing {
    animation: 0.35s ease-in forwards dmfl-scale-anim;
    animation-direction: reverse;
  }

  .dmfl-sm-body {
    display: grid;
    row-gap: 1.5em;
    overflow: auto;
  }

  .dmfl-sm-section {
    display: grid;
    row-gap: 5px;
  }

  .dmfl-sm-section h3 {
    color: #2860b7;
    background-color: #d8e5f3;
    font-weight: 500;
    font-size: 24px;
    padding: 5px;
    line-height: 30px;
    margin-block-start: 0 !important;
    margin-block-end: 0 !important;
  }

  .dmfl-sm-dummy-target {
    width: ${o.BUTTON_WIDTH}px;
    height: ${o.BUTTON_WIDTH}px;
    margin-right: 2px;
  }

  .dmfl-sm-header {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 2em;
    padding: 0px 50px 0px 50px;
    user-select: none;
  }

  .dmfl-sm-header span {
    font-weight: 400;
    font-size: calc(${o.BUTTON_WIDTH}px * 0.75) !important;
    color: #000;
    text-decoration: underline;
  }

  .dmfl-sm-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.25rem;
  }

  .dmfl-sm-save, .dmfl-sm-restore {
    color: #fff;
    background: #1f95dd;
    padding: 0 20px;
    height: 2.25rem !important;
    transition: none !important;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
  }

  .dmfl-sm-save:disabled,
  .dmfl-sm-restore:disabled,
  .dmfl-sm-change-key-button:disabled {
    color: #8b8989;
    background: #c5c7c9;
  }

  .dmfl-sm-entry {
    display: flex;
    column-gap: 20px;
    align-items: center;
    width: 100%;
    height: 2.5em;
    padding: 5px 15px 5px 5px;
    box-sizing: border-box;
  }

  .dmfl-sm-entry:nth-child(odd) {
    background: #d1d6df;
  }

  .dmfl-sm-label {
    position: relative;
    display: flex;
    border-bottom: 1px dotted black;
    cursor: context-menu;
  }

  .dmfl-sm-label sup {
    position: relative;
    line-height: 0;
    vertical-align: baseline;
    top: 0;
    color: #f1972a;
    font-size: 70%;
  }

  .dmfl-sm-entry input[type="text"] {
    padding: 3px 5px;
    margin: 0;
  }

  .dmfl-sm-entry input[type="number"] {
    text-align: center;
    width: 65px;
    padding-block: 2px;
    padding-inline: 2px;
    line-height: normal;
  }

  .dmfl-sm-color-picker {
    display: inline-block;
    inline-size: 48px;
    block-size: 26px;
  }

  .dmfl-sm-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    color: #aaaaaa;
    font-size: 2.5rem;
    font-weight: bold;
    cursor: pointer;
  }

  .dmfl-sm-close:hover,
  .dmfl-sm-close:focus {
    color: #a97174;
    text-decoration: none;
  }

  .dmfl-sm-change-key-button {
    color: #fff;
    background: #1f95dd;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
    height: 25px !important;
    line-height: normal !important;
    vertical-align: inherit !important;
    padding: 0 15px !important;
    transition: none !important;
  }

  .dmfl-sm-kbd {
    background: #f5f5f5;
    border: 2px solid #ada6a6;
    border-radius: 0.25rem;
    box-shadow: inset 0 -1px 0 0 #958e8e;
    font-size: .825rem;
    padding: .25rem;
    box-sizing: border-box;
    font-family: monospace;
    font-weight: 600;
    line-height: 1.5;
    text-align: left;
  }

  .dmfl-sm-select {
    font-size: 100%;
    border: 1px solid darkgray;
    line-height: normal;
  }

  /*
   ======================
   === Popup messages ===
   ======================
  */

  .dmfl-msg {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    color: #fff;
    border: 1px solid rgba(119, 233, 220, 0.31);
    opacity: 0; /* Initially hidden */
    transition: opacity 0.35s ease-in-out;
    cursor: default;
    z-index: 99999;
  }

  .dmfl-msg.top {
    --dmfl-msg-top-minwidth: max(50px, ${o.PREVIEW_MODE_ICON_WIDTH}px);
    box-sizing: border-box;
    border-radius: 10px;
    top: ${o.PREVIEW_MODE_SHOW_CONTROLS ? `${o.PREVIEW_MODE_ICON_WIDTH + 30}` : 20}px;
    left: 20px;
    width: var(--dmfl-msg-top-minwidth);
    height: var(--dmfl-msg-top-minwidth);
    background-color: rgba(95, 129, 191, 0.7);
    font-size: calc(var(--dmfl-msg-top-minwidth) * 0.3);
    font-weight: 500;
    white-space: nowrap;
  }

  .dmfl-msg.bottom {
    border-radius: 3px;
    bottom: 20px;
    left: 50%;
    min-width: 300px;
    background-color: rgb(47 57 76 / 85%);
    font-size: 18px;
    padding: 10px 20px;
    transform: translateX(-50%);
  }

  /*
   ==============================
   === Main loading indicator ===
   ==============================
  */

  .dmfl-svg-loader circle {
    stroke: ${o.PREVIEW_MODE_ICON_FILL_COLOR};
  }

  .dmfl-loader {
    position: absolute;
    top: 50vh;
    left: 50vw;
    translate: -50% -50%;
    width: 45px;
    height: 45px;
    opacity: .65;
    z-index: 30002;
  }

  /*
   ======================
   === Startup loader ===
   ======================
  */

  .dmfl-startup-loader {
    display: flex;
    bottom: 70px;
    left: 50%;
    translate: -50%;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    z-index: 60000;
    color: ${o.BUTTON_TEXT_COLOR};
    background: ${o.BUTTON_BG_COLOR};
    position: fixed;
    cursor: wait;
    animation: 3s infinite dmfl-spin-anim;
  }

  .dmfl-startup-loader .dmfl-svg-dd-db-populated {
    width: 24px;
    height: 24px;
    fill: ${o.BUTTON_TEXT_COLOR};
  }
  `;
  console.log('Adding styles.');
  styleElement = GM_addStyle(style);
}


const Messages = {
  init() {
    this.messages = Object.create(null);
    this.top = $new('div', 'dmfl-msg top');
    this.bottom = $new('div', 'dmfl-msg bottom');
    document.body.append(this.top, this.bottom);
  },
  show(text, duration, location) {
    const container = this[location];
    container.textContent = text;
    container.style.visibility = 'visible';
    container.style.opacity = 1;
    clearTimeout(this.messages[container.className]);
    const messageTimeoutId = setTimeout(() => {
      container.style.opacity = 0;
      setTimeout(() => {
        if (container.style.getPropertyValue('opacity') != 0) return;
        container.style.visibility = 'hidden';
        container.textContent = '';
      }, 350);
    }, duration);
    this.messages[container.className] = messageTimeoutId;
  }
}


const SettingsModal = {
  init() {
    this.onResize = () => this.dropdown?.updatePos();
    this.modal = $new('div', 'dmfl-sm', `
      <form class="dmfl-sm-content" method="dialog">
        <span class="dmfl-sm-close">&times;</span>
        <header class="dmfl-sm-header">
          <div class="dmfl-sm-dummy-target"></div>
          <span>${SCRIPT_NAME.slice(1)}&nbsp;&nbsp;\u27b2&nbsp;&nbsp;Settings</span>
        </header>
        <div class="dmfl-sm-body">
          <section class="dmfl-sm-section general"><h3>General</h3></section>
          <section class="dmfl-sm-section appearance"><h3>Appearance</h3></section>
          <section class="dmfl-sm-section keybindings"><h3>Keybindings</h3></section>
        </div>
        <footer class="dmfl-sm-footer">
          <button class="dmfl-sm-save" type="submit" disabled>Save &amp; Reload</button>
          <button class="dmfl-sm-restore">Restore defaults</button>
        </footer>
      </form>`);
    document.body.appendChild(this.modal);
    this.content = $('.dmfl-sm-content', this.modal);
    this.closeButton = $('.dmfl-sm-close', this.modal);
    this.saveButton = $('.dmfl-sm-save', this.modal);
    this.restoreButton = $('.dmfl-sm-restore', this.modal);
    this.body = $('.dmfl-sm-body', this.modal);
    this.dummyTarget = $('.dmfl-sm-dummy-target', this.modal);
    this.dropdown = new Dropdown({
      node: this.dummyTarget,
      photoId: 30891517230,
      photoPageURL: 'https://flickr.com/photos/giftsoftheuniverse/30891517230/',
      author: 'giftsoftheuniverse',
    });
    this.dropdown.container.classList.add('dmfl-sm-mode');
    this.dropdown.button.classList.add('dmfl-sm-mode', 'dmfl-thumbnail');
    this.dropdown.content.classList.add('dmfl-thumbnail');
    this.modal.onanimationend = (e) => {
      if (e.target.classList.contains('opening')) {
        e.target.classList.add('open');
        e.target.classList.remove('opening');
      } else if (e.target.classList.contains('closing')) {
        e.target.classList.remove('closing');
        e.target.classList.remove('open');
      }
    }
    this.content.onanimationend = (e) => {
      if (e.target.classList.contains('opening')) {
        e.target.classList.remove('opening');
        Dropdown.active = this.dropdown;
        this.dropdown.show();
        addEventListener('resize', this.onResize);
      } else if (e.target.classList.contains('closing')) {
        e.target.classList.remove('closing');
        this.clearEntries();
        this.shown = false;
        setStyle(Object.assign(o, this.currentOpts));
        Dropdown.active = this.lastActiveDropdown?.container.isConnected
          ? this.lastActiveDropdown : null;
        removeEventListener('resize', this.onResize);
        MouseHandler.init();
      }
    }
    this.closeButton.onclick = () => {
      this.cancelKeyWait();
      this.dropdown?.hide();
      this.content.classList.add('closing');
      this.modal.classList.add('closing');
      $(':root').classList.remove('dmfl-sm-open');
    }
    this.restoreButton.onclick = () => {
      this.cancelKeyWait();
      this.clearEntries();
      this.tempSettings = {};
      this.fill(Settings.defaults);
      setStyle(Object.assign(o, Settings.getOpts({})));
      this.saveButton.disabled = false;
      this.restoreButton.disabled = true;
    }
    this.content.onsubmit = (e) => {
      if (e.submitter != this.saveButton) return;
      const kbEntries = Object.entries(this.tempSettings)
        .filter(([k, v]) => k.endsWith('_KB') && Boolean(v));
      while (kbEntries.length) {
        const kbEntry = kbEntries.shift();
        if (kbEntries.find(entry => entry[1] === kbEntry[1])) {
          Messages.show(`Key '${kbEntry[1]}' assigned more than once.`, 4000, 'bottom');
          return;
        }
      }
      this.saveButton.disabled = true;
      this.restoreButton.disabled = true;
      this.cancelKeyWait();
      GM_setValue('settings', this.tempSettings);
      this.dropdown?.hide();
      this.content.style.setProperty('transition', 'scale 1s ease-in');
      this.content.style.setProperty('transition-delay', '0.1s');
      this.content.style.setProperty('scale', 0);
      setTimeout(() => {
        this.modal.appendChild(loader);
        location.reload();
      }, 1000);
    }
  },
  onValueChanged(key, value) {
    this.saveButton.disabled = false;
    this.restoreButton.disabled = false;
    console.debug(`${key} value changed:`, {value});
    this.tempSettings[key] = value;
    Object.assign(o, Settings.getOpts(this.tempSettings));
    if (Settings.defaults[key]?.section == 'appearance') {
      requestAnimationFrame(() => {
        setStyle(o);
      });
    }
  },
  cancelKeyWait() {
    if (!this.shown) return;
    if (this.onKeyDown) {
      document.removeEventListener('keydown', this.onKeyDown, true);
      this.onKeyDown = null;
    }
    this.waitingForKey = false;
    if (this.changeKeyButtonPressed) {
      this.changeKeyButtonPressed.textContent = 'Change';
      this.changeKeyButtonPressed.disabled = false;
    }
  },
  clearEntries() {
    $$('.dmfl-sm-entry', this.modal).forEach(entry => entry.remove());
  },
  fill(settings) {
    for (const [settingName, settingData] of Object.entries(Settings.defaults)) {
      const entryChildren = [];
      const entry = $new('div', 'dmfl-sm-entry');
      let valueDesc = settingData.value;

      // Initialize temporary settings with either saved or default settings
      const settingValue = Settings.getValue(settingName, settings);
      this.tempSettings[settingName] = settingValue;

      const label = $new('label', 'dmfl-sm-label', settingData.name);
      entryChildren.push(label);

      if (/^(text|number|checkbox)$/.test(settingData.type)) {
        const inputElem = $new('input', 'dmfl-sm-input');
        inputElem.setAttribute('type', settingData.type);

        let propertyToGet, propertyToSet;
        if (typeof settingData.value === 'boolean') {
          propertyToGet = propertyToSet = 'checked';
        } else if (typeof settingData.value === 'number') {
          inputElem.setAttribute('min', settingData.min);
          inputElem.setAttribute('max', settingData.max);
          inputElem.setAttribute('step', settingData.step);
          inputElem.required = true;
          propertyToGet = 'valueAsNumber';
          propertyToSet = 'value';
        } else {
          propertyToGet = propertyToSet = 'value';
        }
        inputElem[propertyToSet] = settingValue;
        inputElem.addEventListener('input', () => {
          this.onValueChanged(settingName, inputElem[propertyToGet]);
        });
        entryChildren.push(inputElem);
        if (settingName.includes('_COLOR')) {
          const colorPicker = $new('input', 'dmfl-sm-color-picker');
          colorPicker.setAttribute('type', 'color');
          colorPicker.value = inputElem.value;
          colorPicker.addEventListener('input', () => {
            inputElem.value = colorPicker.value;
            inputElem.dispatchEvent(new Event('input'));
          })
          entryChildren.push(colorPicker);
        }
      } else if (settingData.type == "kbd") {
        const inputElem = $new('input');
        inputElem.setAttribute('type', 'checkbox');
        inputElem.checked = Boolean(settingValue);

        const kbdElem = $new('kbd', 'dmfl-sm-kbd');
        kbdElem.textContent = settingValue;

        const changeKeyButton = $new('button', 'dmfl-sm-change-key-button');
        changeKeyButton.textContent = 'Change';

        if (!inputElem.checked) {
          kbdElem.style.visibility = 'hidden';
          changeKeyButton.style.visibility = 'hidden';
        }

        changeKeyButton.onclick = (e) => {
          e.preventDefault();
          if (this.waitingForKey) return;

          this.onKeyDown = (e) => {
            if (/^(Shift|Alt|Control|Meta)$/.test(e.key)) return;
            e.preventDefault();
            e.stopPropagation();
            document.addEventListener('keyup', (e) => {
              e.preventDefault();
              e.stopPropagation();
            }, { capture: true, once: true });

            let keyUnavailable;
            for (const [k, v] of Object.entries(this.tempSettings)) {
              if (/_KB$/.test(k) && k != settingName && v === e.key) {
                const msg = `Key '${e.key}' already assigned to setting '${Settings.defaults[k].name}'.`;
                console.log(msg);
                Messages.show(msg, 4000, 'bottom');
                keyUnavailable = true;
              }
            }
            if (!keyUnavailable) {
              kbdElem.textContent = e.key;
              this.onValueChanged(settingName, e.key);
            }
            this.cancelKeyWait();
          }

          changeKeyButton.disabled = true;
          changeKeyButton.textContent = 'Press any key';
          document.addEventListener('keydown', this.onKeyDown, true);
          this.changeKeyButtonPressed = changeKeyButton;
          this.waitingForKey = true;
        }

        inputElem.addEventListener('input', ({target: {checked: keyEnabled}}) => {
          if (this.waitingForKey) this.cancelKeyWait();
          kbdElem.textContent = keyEnabled ? getOr(kbdElem.textContent, settingData.value) : '';
          this.onValueChanged(settingName, kbdElem.textContent);
          kbdElem.style.visibility = changeKeyButton.style.visibility =
            keyEnabled ? 'visible' : 'hidden';
        });
        entryChildren.push(inputElem, kbdElem, changeKeyButton);
      } else if (settingData.type == "select") {
        const selectElem = $new('select', 'dmfl-sm-select');
        const dataVal = settingData.value;
        const dataOpts = settingData.options;
        const isOptionsArray = Array.isArray(dataOpts);
        for (const [k, v] of Object.entries(dataOpts)) {
          const opt = $new('option');
          opt.value = v;
          opt.textContent = isOptionsArray ? v : k;
          selectElem.appendChild(opt);
          if (v == dataVal) { valueDesc = isOptionsArray ? v : k }
        }
        selectElem.value = settingValue;
        selectElem.addEventListener('change', ({target: {value: v}}) => {
          const parsedValue = (typeof dataVal === 'number' ? parseFloat(v) : v);
          this.onValueChanged(settingName, parsedValue);
        });
        entryChildren.push(selectElem);
      }

      label.title = `${settingData.desc.replace(/\s+/g, ' ')}\n\nDefault: ${String(valueDesc)
        .replace(/^true$/, 'On').replace(/^false$/, 'Off')}`;
      entry.append(...entryChildren);
      $(`.dmfl-sm-section.${settingData.section}`, this.modal)
        .appendChild(entry);
    }
  },
  show() {
    if (this.shown) return;

    this.lastActiveDropdown = Dropdown.active;
    Dropdown.active?.hide();
    if (PreviewMode.active)
      PreviewMode.clear({ reason: 'opening settings modal' });
    MouseHandler.destroy();

    this.currentOpts = Object.assign(Object.create(null), o);
    this.tempSettings = GM_getValue('settings', {});

    this.modal.classList.add('opening');
    this.content.classList.add('opening');
    $(':root').classList.add('dmfl-sm-open');
    this.shown = true;
    this.saveButton.disabled = true;
    this.restoreButton.disabled = false;

    this.fill(this.tempSettings);
  }
}


const PreviewMode = {

  SCALE_FACTOR: 1.1,
  SCALE_MIN: 0.01,
  SCALE_MAX: 5,

  init() {
    this.container = $new('div', 'dmfl-pv');
    this.container.style.display = 'none';
    document.body.appendChild(this.container);
    this.photoInfoWrapper = $new('div', 'dmfl-pv-photo-info-wrapper');
    this.downloadButton = $new('span', 'dmfl-pv-download', ICONS.default.pm_dl_but);
    this.closeButton = $new('span', 'dmfl-pv-close', ICONS.default.pm_close_but);
    this.controls = $new('div', 'dmfl-pv-controls', `
      <span class="dmfl-pv-controls-main">${ICONS.default.pc_main}</span>
      <div class="dmfl-pv-controls-rubberband">
        <span class="dmfl-pv-controls-rot-cw">${ICONS.default.pc_rotcw}</span>
        <span class="dmfl-pv-controls-rot-ccw">${ICONS.default.pc_rotccw}</span>
        <span class="dmfl-pv-controls-toggle-fit">${ICONS.default.pc_togglefit}</span>
        <span class="dmfl-pv-controls-zoom-in">${ICONS.default.pc_zoomin}</span>
        <span class="dmfl-pv-controls-zoom-out">${ICONS.default.pc_zoomout}</span>
      </div>`);
    $('.dmfl-pv-controls-rot-cw', this.controls).onclick = () => this.rotate(90);
    $('.dmfl-pv-controls-rot-ccw', this.controls).onclick = () => this.rotate(-90);
    $('.dmfl-pv-controls-toggle-fit', this.controls).onclick = () => this.toggleFit();
    $('.dmfl-pv-controls-zoom-in', this.controls).onclick = () => this.zoom(1);
    $('.dmfl-pv-controls-zoom-out', this.controls).onclick = () => this.zoom(-1);
    this.onResize = () => this.reset();
  },

  enter(data) {

    if (!data?.item) return;

    if (this.active) {
      console.debug('Preview mode already active.');
      return;
    }

    if (!parseInt(data.item.width) || !parseInt(data.item.height)) {
      console.error("Image dimensions not valid.", data);
      return;
    }

    Dropdown.active?.navStop();
    if (!SettingsModal.shown && !o.PREVIEW_MODE_IS_VOLATILE) {
      Dropdown.active?.hide();
      MouseHandler.destroy();
    }
    SettingsModal.cancelKeyWait();

    this.active = true;
    this.downloadController = null;
    this.data = data;
    this.canTransform = false;
    this.swapDimensions = false;
    this.isDragging = false;
    this.img_w = 0;
    this.img_h = 0;
    this.img_offsetX = 0;
    this.img_offsetY = 0;
    this.mouseX = innerWidth / 2;
    this.mouseY = innerHeight / 2;
    this.scale = 1;
    this.rotation = 0;
    addEventListener('resize', this.onResize);

    this.bg = $new('div', 'dmfl-pv-bg');
    $(':root').classList.add('dmfl-pv-open');
    this.container.style.display = 'block';
    this.container.appendChild(this.bg);
    console.log('Entered preview mode.');

    if (o.PREVIEW_MODE_EXIT_ON_MOUSE_EVENT) {
      this.bg.addEventListener(o.PREVIEW_MODE_EXIT_ON_MOUSE_EVENT, (e) => {
        if (/dmfl-(svg-pm-pc-|pv-controls)/.test(e.target.getAttribute('class'))) return;
        this.clear({ reason: 'requested by user' });
      });
    }

    if (o.PREVIEW_MODE_SHOW_CLOSE_BUTTON) {
      this.closeButton.onclick = () => this.clear({ reason: 'requested by user' });
      this.bg.appendChild(this.closeButton);
    }

    if (o.PREVIEW_MODE_SHOW_RESOLUTION_INFO) {
      const el = $new('span', 'dmfl-pv-resolution-info');
      el.textContent = data.photoInfo;
      this.photoInfoWrapper.appendChild(el);
    }

    if (o.PREVIEW_MODE_SHOW_LICENSE_INFO && data.licenseInfo) {
      const el = $new('a', 'dmfl-pv-license-info');
      el.setAttribute('href', data.licenseInfo.url);
      el.setAttribute('title', data.licenseInfo.desc);
      el.text = `License: ${data.licenseInfo.text}`;
      el.onclick = (e) => {
        GM_openInTab(el.href, false);
        e.preventDefault();
        e.stopPropagation();
      }
      this.photoInfoWrapper.appendChild(el);
    }

    if (this.photoInfoWrapper.childElementCount)
      this.bg.appendChild(this.photoInfoWrapper);

    this.bg.appendChild(this.loader = loader);

    const imgWrapper = $new('div', 'dmfl-pv-img-wrapper');
    this.bg.appendChild(imgWrapper);

    let source = data.imageURL;

    const img = this.img = new Image();
    img.className = 'dmfl-pv-img';

    img.onload = () => {
      if (!imgWrapper.isConnected) return;
      if (o.PREVIEW_MODE_SHOW_DOWNLOAD_BUTTON) {
        this.downloadButton.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.saveImage();
        }
        this.bg.appendChild(this.downloadButton);
      }
      this.img_w = img.naturalWidth;
      this.img_h = img.naturalHeight;
      img.setAttribute('width', this.img_w);
      img.setAttribute('height', this.img_h);
      this.canTransform = Boolean(this.img_w);
      this.reset();
      img.style.setProperty('visibility', 'visible');
      this.loader.remove();
      if (o.PREVIEW_MODE_SHOW_CONTROLS) {
        this.controls.style.setProperty('--dmfl-pv-controls-opacity', 0);
        this.bg.appendChild(this.controls);
        setTimeout(() => {
          requestAnimationFrame(() => {
            this.controls.style.setProperty('--dmfl-pv-controls-opacity', o.PREVIEW_MODE_ICON_OPACITY);
          });
        }, 100);
      }
      if (o.PREVIEW_MODE_SCROLL_TO_ZOOM) {
        img.addEventListener('wheel', (e) => {
          if (e.deltaY == 0) return;
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          this.zoom(e.deltaY > 0 ? -1 : 1, true);
        }, {"passive": true});
      }
      img.onmousedown = (e) => {
        if (e.button != 0) return;
        e.preventDefault();
        e.stopPropagation();
        img.style.cursor = 'grabbing';
        this.isDragging = true;
        this.img_offsetX = e.clientX - this.img_x;
        this.img_offsetY = e.clientY - this.img_y;
      }
      this.container.onmouseup = (e) => {
        if (e.button != 0 || !this.isDragging) return;
        e.stopPropagation();
        this.isDragging = false;
        img.style.cursor = 'grab';
        cancelAnimationFrame(this.dragAnimationFrameId);
      }
      this.container.onmousemove = (e) => {
        if (!this.isDragging || !img.isConnected) return;
        this.dragAnimationFrameId = requestAnimationFrame(() => {
          this.img_x = e.clientX - this.img_offsetX;
          this.img_y = e.clientY - this.img_offsetY;
          this.isFit = false;
          e.stopPropagation();
        });
      }
    }

    img.onerror = () => {
      if (!imgWrapper.isConnected) return;
      Messages.show("Could not load image.", 3000, 'bottom');
      this.clear({ reason: 'image onerror handler triggered' });
    }

    img.src = source instanceof Blob ? URL.createObjectURL(source) : source;
    imgWrapper.appendChild(img);

  },

  saveImage() {
    if (!(this.img?.complete && this.img.isConnected)) return;
    const isBlob = this.img.src.startsWith('blob');
    console.debug(`Saving image${isBlob ? ' from blob ' : ' '}as: '${this.data.downloadFilename}'`);
    if (o.PREPEND_AUTHOR_ID && !isBlob) {
      this.downloadController = dl({
        url: this.data.downloadURL,
        name: this.data.downloadFilename,
        maxRetries: 2,
        timeout: 30000,
      });
    } else {
      const link = $new('a');
      link.style.display = 'none';
      if (isBlob) {
        link.href = this.img.src;
        link.target = '_blank';
        link.download = this.data.downloadFilename;
      } else {
        link.href = this.data.downloadURL;
      }
      document.body.appendChild(link);
      link.dispatchEvent(new MouseEvent('click'));
      document.body.removeChild(link);
    }
    this.clear({ skipAbortDownload: true, reason: 'download initiated' });
  },

  reset(toFullSize) {
    if (!this.active || !this.canTransform) return;
    requestAnimationFrame(() => {
      let {img_w, img_h} = this;
      if (this.swapDimensions)
        ({img_h: img_w, img_w: img_h} = this);

      const vw = innerWidth;
      const vh = innerHeight;
      const scaleX = vw / img_w;
      const scaleY = vh / img_h;
      const needsDownscale = (img_w > vw) || (img_h > vh);

      let scale;
      if (needsDownscale && !toFullSize) {
        scale = Math.min(scaleX, scaleY);
        this.isFit = true;
      } else {
        scale = 1;
        this.isFit = !needsDownscale;
      }

      const scaled_w = img_w * scale;
      const scaled_h = img_h * scale;

      let x = (vw - scaled_w) / 2;
      let y = (vh - scaled_h) / 2;

      switch (this.rotation) {
        case 90:
        case -270:
          x += scaled_w;
          break;
        case -90:
        case 270:
          y += scaled_h;
          break;
        case 180:
        case -180:
          x += scaled_w;
          y += scaled_h;
          break;
      }

      this.img_x = x;
      this.img_y = y;
      this.setScale(scale);
    });
  },

  rotate(degrees) {
    if (!this.canTransform) return;
    let newAngle = this.rotation + degrees;
    let newAngleAbs = Math.abs(newAngle);
    if (newAngleAbs == 360) {
      newAngle = 0;
      newAngleAbs = 0;
    }

    const rect = this.img.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    let x = rect.x + halfW;
    let y = rect.y + halfH;

    this.img.style.setProperty('--dmfl-pv-img-rotate', `${newAngle}deg`);
    this.rotation = newAngle;
    this.swapDimensions = (newAngleAbs == 90 || newAngleAbs == 270);

    if (this.isFit) {
      this.reset();
      return;
    }

    switch (newAngle) {
      case 0:
        x -= halfH;
        y -= halfW;
        break;
      case 90:
      case -270:
        x += halfH;
        y -= halfW;
        break;
      case -90:
      case 270:
        x -= halfH;
        y += halfW;
        break;
      case 180:
      case -180:
        x += halfH;
        y += halfW;
        break;
    }

    this.img_x = x;
    this.img_y = y;
  },

  zoom(direction, isWheel) {
    if (!this.canTransform) return;

    requestAnimationFrame(() => {
      this.isFit = false;

      let newScale = this.scale * (direction > 0 ? this.SCALE_FACTOR : 1 / this.SCALE_FACTOR);
      newScale = clamp(this.SCALE_MIN, this.SCALE_MAX, newScale);
      const snapToFullSize = (this.scale < 1 && newScale > 1) || (this.scale > 1 && newScale < 1);
      if (snapToFullSize) newScale = 1;

      let x = this.img_x;
      let y = this.img_y;

      const originX = isWheel ? this.mouseX : innerWidth / 2;
      const originY = isWheel ? this.mouseY : innerHeight / 2;

      const offsetX = (originX - x) / this.scale;
      const offsetY = (originY - y) / this.scale;

      const delta = newScale - this.scale;

      x -= (offsetX * delta);
      y -= (offsetY * delta);

      this.img_x = x;
      this.img_y = y;
      this.setScale(newScale);
      this.showZoomPercentage();
    })
  },

  showZoomPercentage() {
    requestAnimationFrame(() => {
      Messages.show(`${parseInt(this.scale * 100)}%`, 1000, 'top');
    });
  },

  toggleFit() {
    if (!this.canTransform) return;
    this.reset(this.isFit);
    this.showZoomPercentage();
  },

  setScale(value) {
    this.img.style.setProperty('--dmfl-pv-img-scale', parseFloat(value.toFixed(5)));
    this.scale = value;
  },

  set img_x(value) {
    this.img.style.setProperty('--dmfl-pv-img-translateX', `${parseFloat(value.toFixed(5))}px`);
  },

  set img_y(value) {
    this.img.style.setProperty('--dmfl-pv-img-translateY', `${parseFloat(value.toFixed(5))}px`);
  },

  get img_x() {
    return parseFloat(this.img.style.getPropertyValue('--dmfl-pv-img-translateX')) || 0;
  },

  get img_y() {
    return parseFloat(this.img.style.getPropertyValue('--dmfl-pv-img-translateY')) || 0;
  },

  clear(opts) {
    let msg = 'Clearing preview mode.';
    if (opts?.reason) msg += ` Reason: ${opts.reason}`;
    console.debug(msg);
    if ((!opts?.skipAbortDownload) && (typeof this.downloadController?.abort === 'function')) {
      console.debug('Download control active. Aborting download.');
      this.downloadController.abort();
    }
    delete this.downloadController?.abort;
    if (this.img?.src?.startsWith('blob')) {
      console.debug('Revoking blob URL.');
      URL.revokeObjectURL(this.img.src);
    }

    $(':root').classList.remove('dmfl-pv-open');

    this.container.style.display = 'none';
    this.container.innerHTML = '';
    this.photoInfoWrapper.innerHTML = '';

    removeEventListener('resize', this.onResize);
    this.canTransform = false;
    this.active = false;
    MouseHandler.init();
    /* we shouldn't set this.img to null here b/c resize delay ... */
  },

}


class Dropdown {
  static #active;
  constructor(target) {
    this.target = target;
    this.resizeObserver = new ResizeObserver(this.updatePos.bind(this));
    this.container = $new('div', 'dmfl-dd-container');
    this.button = $new('div', 'dmfl-dd-button', ICONS.default.dd_db_populated);
    this.content = $new('div', 'dmfl-dd-content');
    this.button.onclick = () => SettingsModal.show();
    this.container.append(this.button, this.content);
    const dropdownNodes = [this.container, this.button, this.content];

    if (target.isMainPageEngagement) {
      this.isStatic = true;
      dropdownNodes.forEach(n => {
        n.classList.add('dmfl-engagement-view-main-photo-page');
      });
      let flickrDlButton;
      if (o.REPLACE_FLICKR_DL_BUTTON
          && (flickrDlButton = target.node.getElementsByClassName('download')[0])) {
        target.node.replaceChild(this.container, flickrDlButton);
      } else {
        target.node.appendChild(this.container);
      }
      this.container.onmouseenter = () => populate(this);
    } else if (target.isLightboxEngagement) {
      this.isStatic = true;
      const clear = () => {
        if (!this.lightboxIntervalID) return;
        console.debug('[lightbox] clearing interval');
        clearInterval(this.lightboxIntervalID);
        delete this.lightboxIntervalID;
        this.navStop();
      }
      const onEnter = (e) => {
        populate(this);
        const footer = document.getElementsByClassName('foot-overlay')[0];
        if (footer && !this.lightboxIntervalID) {
          console.debug('[lightbox] starting interval');
          this.lightboxIntervalID = setInterval(() => {
            if (footer?.isConnected) {
              footer.dispatchEvent(new MouseEvent('mousemove', {"bubbles": true}));
            } else {
              clear();
            }
          }, 500);
        }
      }
      const onLeave = (e) => {
        if (isDropdownElement(e.relatedTarget)) return;
        clear();
      }
      this.container.onmouseenter = onEnter;
      dropdownNodes.forEach(n => {
        n.classList.add('dmfl-engagement-view');
        n.onmouseleave = onLeave;
      });
      target.node.appendChild(this.container);
    } else if (target.isThumbnail) {
      this.isStatic = false;
      // Thumbnails, main photo, discussions page images
      dropdownNodes.forEach(n => n.classList.add('dmfl-thumbnail'));
    }
    if (this.isStatic) this.constructor.active = this;
  }
  get linkCount() {
    return $$('a', this.content).length;
  }
  navStart(direction) {
    const numSizes = this.target.sizes?.length;
    if (!numSizes) return;
    this.container.classList.add('dmfl-dd-select-mode');
    this.container.dispatchEvent(new MouseEvent('mouseenter'));
    switch(direction) {
      case "up":
        this.selectedIndex = this.selectedIndex == null
          ? numSizes - 1
          : (this.selectedIndex - 1 + numSizes) % numSizes;
        break;
      case "down":
        this.selectedIndex = this.selectedIndex == null
          ? 0
          : (this.selectedIndex + 1) % numSizes;
        break;
      default:
        return;
    }
    this.selectedEntry?.classList.remove('dmfl-selected');
    this.selectedEntry = this.content.children[this.selectedIndex];
    this.selectedEntry.classList.add('dmfl-selected');
  }
  navStop() {
    this.container.classList.remove('dmfl-dd-select-mode');
    this.selectedEntry?.classList.remove('dmfl-selected');
    this.selectedIndex = undefined;
    this.container.dispatchEvent(new MouseEvent('mouseleave'));
  }
  show() {
    overlay.appendChild(this.container);
    this.updatePos();
    overlay.style.display = 'block';
    this.resizeObserver.observe(this.target.node);
    return populate(this);
  }
  hide() {
    this.navStop();
    if (!this.isStatic) {
      this.content.style.left = 0;
      overlay.innerHTML = '';
      overlay.style.display = 'none';
      this.resizeObserver.disconnect();
    }
    if (!this.container.isConnected) {
      page.scrollX = null;
      page.scrollY = null;
      this.constructor.active = null;
    }
  }
  updateContentPos() {
    const r = this.content.getBoundingClientRect();
    const cw = document.documentElement.clientWidth;
    if (r.right > cw) {
      this.content.style.left = `${-(r.right - cw)}px`;
    }
  }
  updatePos() {
    if (this.isStatic || !this.target?.node) return;
    this.target.rect = this.target.node.getBoundingClientRect();
    if (!this.target.rect.width || !this.target.rect.height) return;
    this.container.style.left = `${this.target.rect.left + scrollX}px`;
    this.container.style.top = `${this.target.rect.top + scrollY}px`;
  }
  static get active() {
    return this.#active;
  }
  static set active(dropdown) {
    if (dropdown instanceof this) {
      dropdown.updatePos();
    }
    this.#active = dropdown;
  }
}


// Retry download by default if one of these codes is encountered
const RETRY_HTTP_CODES = {
  '403': 'Forbidden',
  '429': 'Too Many Requests',
  '500': 'Internal Server Error',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
};

function dl(opts) {

  if (urlsDownloading.has(opts.url))
    return { promise: Promise.reject(`Download in progress for ${opts.url}`).catch(console.warn) };

  const downloader = opts.responseType ? GM_xmlhttpRequest : GM_download;
  const {
    url,
    method = 'GET',
    headers = {'Referer': `${location.origin}/`},
    maxRetries,
    suppressMessages,
    ...rest
  } = opts;
  const _url = url.startsWith('//') ? location.protocol + url : url;
  let download, currentDownload, performRequest, retryCount = 0;

  const fn = url.split('/').filter(Boolean).pop();
  const log = (...args) => console.debug(`[${fn}]`, ...args);
  const cleanup = () => {
    log('Cleaning up.');
    delete download.abort;
    urlsDownloading.delete(url);
  };
  download = {
    abort() {
      if (currentDownload?.abort) {
        currentDownload.abort();
        Object.defineProperty(download, 'aborted', {value: true, writable: false});
        log('Download aborted.');
      }
      cleanup();
    }
  };

  // Determine whether a retry is warranted
  const checkStatus = async (res, evt) => {
    if (download.aborted)
      return Promise.reject("Download aborted from the outside");

    const resIsObj = isObject(res);

    const downloadFailed = (/error|timeout/.test(evt))
      || (!resIsObj)
      || (res.error != null)
      || (/^[045]/.test(res.status))
    ;

    if (downloadFailed) {
      // Abort is needed here because GM_download downloads the
      // failed response as `name` even if status is not 200.
      currentDownload?.abort?.();

      let failMsg = 'Download failed.';
      let retryReason;

      if (resIsObj) {
        let status = res.status;
        const message = getOr(res.message);
        const details = getOr(res.details);
        const statusText = getOr(res.statusText, res.error);
        const statusTextLowercase = statusText?.toLowerCase();

        for (const [k, v] of Object.entries(RETRY_HTTP_CODES)) {
          if (status == k) {
            retryReason = statusText || v;
            break;
          } else if (status == null && statusTextLowercase === v.toLowerCase()) {
            status = k;
            retryReason = statusText;
            break;
          }
        }

        const failReason = retryReason || details || statusText || message;

        if (failReason) failMsg += ` Reason: ${failReason}`;
        if (status) failMsg += ` [Status: ${status}]`;
        if (evt == 'timeout') {
          const isVM = /violentmonkey/i.test(GM_info?.scriptHandler);
          const append = opts.timeout && isVM ? ` after ${opts.timeout / 1000}s` : '';
          failMsg += ` (Timed out${append})`;
        }
      }

      log(`${failMsg} Response was:`, res);

      const doRetry = (evt != 'timeout' && retryReason != null);
      if (doRetry && maxRetries && retryCount < maxRetries) {
        retryCount++;
        const delay = random(1800, 2200);
        const retryMsg = `Retry ${retryCount}/${maxRetries} in ${delay / 1000}s.`;
        log(retryMsg);
        await sleep(delay);
        if (download.aborted)
          return Promise.reject("Download aborted from the outside");
        return performRequest();
      } else {
        if (!suppressMessages) {
          Messages.show(failMsg, 3000, 'bottom');
          GM_notification(`URL: ${_url}\n\n${failMsg}`, SCRIPT_NAME);
        }
        return Promise.reject(`Download failed after ${retryCount + 1} attempt(s).`);
      }
    }

    return Promise.resolve(res);
  };

  performRequest = () => {
    return new Promise((resolve, reject) => {
      currentDownload = downloader({
        ...rest,
        url: _url,
        headers: headers,
        method: method,
        ontimeout: (res) => checkStatus(res, 'timeout').then(resolve).catch(reject),
        onerror: (res) => checkStatus(res, 'error').then(resolve).catch(reject),
        onload: (res) => checkStatus(res, 'load').then(resolve).catch(reject),
      });
    })
  };

  urlsDownloading.add(url);
  log('Download started.' + (opts.responseType ? ` (${opts.responseType})` : ''));

  download.promise = performRequest()
    .then(res => { log('Download successful.'); return res; })
    .catch(error => { log('Download unsuccessful.', error); })
    .finally(cleanup);
  return download;

}

async function populate(dropdown) {

  if (!dropdown?.target.node
      || idsPopulating.has(dropdown.target.photoId)
      || nodesBlacklisted.has(dropdown.target.node))
    return;
  const numLinks = dropdown.linkCount;
  const lastStatus = cache[dropdown.target.photoId]?.responseStatus;
  if (numLinks < 2 && /^(5|429|403)/.test(lastStatus)) {
    console.debug(`${dropdown.target.photoId} : Last server response was ${lastStatus}. Retrying.`);
    dropdown.content.innerHTML = '';
    delete cache[dropdown.target.photoId];
  } else if (numLinks) {
    return;
  }

  if (startupLoader) {
    dropdown.button.style.cursor = 'progress';
    setTimeout(() => populate(dropdown), 1000);
    return;
  }

  dropdown.button.classList.remove('dmfl-populated');
  dropdown.button.style.cursor = 'inherit';

  idsPopulating.add(dropdown.target.photoId);

  if (dropdown.populateFailed) {
    dropdown.button.classList.remove('dmfl-populated-fail');
    dropdown.content.classList.remove('dmfl-populated-fail');
    dropdown.content.innerText = '';
    dropdown.populateFailed = false;
  }

  /**
   * First try to get sizes info from the YUI `appContext` global variable.
   * Some of this object's methods might not be available as the UserScripts API
   * implementation may differ across userscript managers. For Chromium-based
   * web browsers this shouldn't be an issue. However, if the YUI module is not
   * available, a request for the main photo page will be sent as a fallback
   * and its HTML probed for info via RegEx matching.
   *
   * Also, see note at the top of the file.
   */

  const {author, photoId, photoPageURL} = dropdown.target;

  let info = cache[photoId];
  if (info) {
    console.debug(`${photoId} : Got info from cache.`);
  } else {
    info = {};
    dropdown.button.innerHTML = ICONS.default.loader;
    try {
      const res = await unsafeWindow.appContext.getModel('photo-models', photoId);
      const reg = res?.registry?._data?.[photoId];
      const ds = res?.getValue?.('descendingSizes') || Object.entries(reg.sizes)
          .map(([key, value]) => { return { ...value, key } })
          .sort((a, b) => DS_KEYS.indexOf(a.key) - DS_KEYS.indexOf(b.key));
      if (!ds?.length) throw 'YUI app has no sizes data.';
      info.descendingSizes = ds;
      page.YUIready = true;
      const license = getOr(res?.getValue?.('license'), reg?.license);
      info.licenseInfo = LICENSE_INFO.find(item => item.value == license);
      console.debug(`${photoId} : Got info from app`);
    } catch(e) {
      page.YUIready = false;
      if (e?.message && e.stat === 'fail') {
        console.debug(`${photoId} : YUI said: "${e.message}".` +
                      ' Photo might be locked or is private. Trying xhr.');
      } else if (typeof e === 'string') {
        console.debug(`${photoId} : ${e}`);
      }
      console.debug(`${photoId} : Sending xhr: ${photoPageURL}`);
      await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: photoPageURL,
          ontimeout: reject,
          onabort: reject,
          onerror: reject,
          onload: resolve,
        });
      }).then(response => {
        const status = info.responseStatus = response?.status;
        const responseText = getOr(response?.responseText);
        if (!responseText) throw response;
        const ds = responseText.match(/descendingSizes":(\[.+?\])/)?.[1];
        if (!ds) {
          const finalUrl = response.finalUrl || photoPageURL;
          const reason = [];
          if (finalUrl.endsWith('///')) reason.push('(photo not found)');
          if (responseText.match(/This photo is private/)) reason.push('(photo is private)');
          if (status != null && status != 200) reason.push(`[status: ${status}]`);
          if (reason.length) { info.message = reason.join(' ') };
          console.debug(`${photoId} : No regex match at final url ${finalUrl}.`);
          throw response;
        }
        info.descendingSizes = JSON.parse(ds);
        const license = responseText.match(/"license":(\d+)/)?.[1];
        info.licenseInfo = LICENSE_INFO.find(item => item.value == license);
        console.debug(`${photoId} : Got info from xhr`);
      }).catch(error => {
        console.debug(`${photoId} : Error during xhr:`, error);
      });
    }
  }

  if (!Array.isArray(info.descendingSizes)) {
    let failMessage = 'No sizes found.';
    console.log(`${photoId} : ${failMessage}`);
    if (dropdown.target.isImage && dropdown.target.node.naturalWidth != 0) {
      console.log(`${photoId} : Adding image src as sole entry.`);
      const imageData = Object.create(null);
      imageData.src = dropdown.target.node.src;
      imageData.width = parseInt(dropdown.target.node.getAttribute('width'));
      imageData.height = parseInt(dropdown.target.node.getAttribute('height'));
      imageData.key = '?';
      info.descendingSizes = [imageData];
    } else {
      dropdown.populateFailed = true;
      dropdown.button.classList.remove('dmfl-populated');
      dropdown.button.classList.add('dmfl-populated-fail');
      dropdown.button.innerHTML = '\u26a0';
      dropdown.content.classList.add('dmfl-populated-fail');
      dropdown.content.innerText = failMessage + (info.message ? `\n\n${info.message}` : '');
    }
  }

  if (!cache[photoId]) { cache[photoId] = info }

  if (dropdown.populateFailed) {
    idsPopulating.delete(photoId);
    return;
  }

  const sizes = [];
  for (const item of info.descendingSizes) {
    const imageURL = getOr(item.url, item.src, item.displayUrl);
    if (!imageURL) {
      console.debug("Invalid descendingSizes item:", item);
      continue;
    }
    const downloadURL = imageURL.replace(/(\.[a-z]+)$/i, '_d$1');
    const filename = imageURL.split('/').filter(Boolean).pop();
    const extension = filename.split('.').pop();
    const entry = $new('div', 'dmfl-dd-entry');
    const anchor = $new('a', 'dmfl-dd-entry-anchor');
    anchor.setAttribute('href', o.PREPEND_AUTHOR_ID ? imageURL : downloadURL);
    anchor.textContent = `${item.width} x ${item.height} (${item.key})`;
    if (item.key == '?' && info.message) {
      anchor.setAttribute('title', `All sizes not available ${info.message}`);
    }
    if (!extension.endsWith('jpg')) {
      anchor.textContent += ` [${extension}]`;
    }
    const downloadFilename = author && o.PREPEND_AUTHOR_ID ? `${author}_-_${filename}` : filename;
    anchor.addEventListener('click', (event) => {
      console.debug(`Saving image as: '${downloadFilename}'`);
      if (!o.PREPEND_AUTHOR_ID) return;
      event.preventDefault();
      dl({url: downloadURL, name: downloadFilename, maxRetries: 2, timeout: 30000});
    })
    entry.appendChild(anchor);
    const previewButton = $new('div', 'dmfl-dd-entry-pv');
    previewButton.textContent = '\u00a0\u229e\u00a0';
    const itemInfo = {
      downloadURL: downloadURL,
      downloadFilename: downloadFilename,
      licenseInfo: info.licenseInfo,
      photoInfo: anchor.textContent,
      item: item,
      imageURL: imageURL,
    };
    previewButton.onclick = () => PreviewMode.enter(itemInfo);
    sizes.push(itemInfo);

    entry.appendChild(previewButton);
    dropdown.content.appendChild(entry);
  }
  dropdown.button.classList.add('dmfl-populated');
  dropdown.button.innerHTML = ICONS.default.dd_db_populated;
  dropdown.target.sizes = sizes;
  idsPopulating.delete(photoId);
}


const onKeyDown = async (e) => {

  let dropdown;
  if (!(PreviewMode.active || (dropdown = Dropdown.active))
      || !o.KEYBINDINGS[e.key]
      || (SettingsModal.shown && !PreviewMode.active)
      || /^(INPUT|TEXTAREA)$/.test(document.activeElement?.nodeName))
    return;

  e.preventDefault();
  e.stopPropagation();
  document.addEventListener('keyup', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { capture: true, once: true });

  switch (o.KEYBINDINGS[e.key]) {
    case "PREVIEW_MODE_ROTATE_CW_KB":
      PreviewMode.rotate(90);
      break;
    case "PREVIEW_MODE_ROTATE_CCW_KB":
      PreviewMode.rotate(-90);
      break;
    case "PREVIEW_MODE_ZOOM_IN_KB":
      PreviewMode.zoom(1);
      break;
    case "PREVIEW_MODE_ZOOM_OUT_KB":
      PreviewMode.zoom(-1);
      break;
    case "PREVIEW_MODE_TOGGLE_FIT_KB":
      PreviewMode.toggleFit();
      break;
    case "PREVIEW_MODE_ENTER_KB":
      if (!PreviewMode.active && dropdown?.target?.sizes?.length) {
        const idx = dropdown.selectedIndex || 0;
        PreviewMode.enter(dropdown.target.sizes[idx]);
      }
      break;
    case "PREVIEW_MODE_EXIT_KB":
      if (PreviewMode.active) {
        PreviewMode.clear({ reason: 'requested by user' });
      } else if (dropdown?.container.classList.contains('dmfl-dd-select-mode')) {
        dropdown.navStop();
      }
      break;
    case "SAVE_IMAGE_KB":
      if (PreviewMode.active) {
        PreviewMode.saveImage();
      } else if (dropdown) {
        const entries = dropdown.content.children;
        const idx = dropdown.selectedIndex || 0;
        entries[idx]?.querySelector?.('.dmfl-dd-entry-anchor')
          ?.dispatchEvent(new MouseEvent('click', {'cancelable': true}));
      }
      break;
    case "DROPDOWN_NAV_UP_KB":
      dropdown?.navStart("up");
      break;
    case "DROPDOWN_NAV_DOWN_KB":
      dropdown?.navStart("down");
      break;
  }

}

const MouseHandler = {

  clearHoverTimer() {
    if (MouseHandler.hoverTimeoutId) {
      clearTimeout(MouseHandler.hoverTimeoutId);
      MouseHandler.hoverTimeoutId = null;
    }
  },
  shouldHandle(e) {
    if (isDropdownElement(e.target)) {
      MouseHandler.clearHoverTimer();
      return false;
    }
    return true;
  },
  onEnter(e) {
    if (!MouseHandler.shouldHandle(e)) return;

    let targetNode = e.target;
    if (page.mainPhoto?.isConnected
        && /(photo-notes-scrappy-view|facade-of-protection-neue)/.test(targetNode.className))
      targetNode = page.mainPhoto;

    if (Dropdown.active?.target.node == targetNode) return;

    const dropdown = nodesProcessed.get(targetNode);
    if (!dropdown) return;

    MouseHandler.clearHoverTimer();
    Dropdown.active?.hide();
    Dropdown.active = dropdown;
  },
  async onMove(e) {
    if (!MouseHandler.shouldHandle(e)) return;

    const dropdown = Dropdown.active;
    if (!dropdown?.target.rect) return;

    if (!dropdown.target.rect.x || !dropdown.target.rect.y
        || (page.scrollY != null && (page.scrollY != scrollY || page.scrollX != scrollX)))
      dropdown.updatePos();

    page.scrollX = scrollX;
    page.scrollY = scrollY;

    const dropdownShown = overlay.childElementCount;
    const targetHovered = mouseInside(e, dropdown.target.rect);

    if (!dropdownShown && targetHovered) {
      await dropdown.show();
      if (dropdown.target.isThumbnail) dropdown.updateContentPos();
      if (o.PREVIEW_MODE_AUTOENTER && dropdown.target.sizes?.[0]) {
        MouseHandler.hoverTimeoutId = setTimeout(() => {
          if (!PreviewMode.active && (Dropdown.active?.target.node == dropdown.target.node))
            PreviewMode.enter(dropdown.target.sizes[0]);
        }, o.PREVIEW_MODE_AUTOENTER_DELAY);
      }
    } else if (dropdownShown && !targetHovered) {
      dropdown?.hide();
      MouseHandler.clearHoverTimer();
      if (PreviewMode.active && o.PREVIEW_MODE_IS_VOLATILE)
        PreviewMode.clear({ reason: 'hover left' });
    }
  },
  init() {
    if (MouseHandler.active
        || (PreviewMode.active && !o.PREVIEW_MODE_IS_VOLATILE)
        || Dropdown.active?.target.isMainPageEngagement
        || SettingsModal.shown
        || page.isLightbox)
      return;
    document.addEventListener('mousemove', MouseHandler.onMove, false);
    document.addEventListener('mouseenter', MouseHandler.onEnter, true);
    MouseHandler.active = true;
  },
  destroy() {
    if (!MouseHandler.active) return;
    document.removeEventListener('mousemove', MouseHandler.onMove, false);
    document.removeEventListener('mouseenter', MouseHandler.onEnter, true);
    MouseHandler.active = false;
  }

}


const TARGET_NODES_SELECTOR = [
  'img.main-photo',
  'td#GoodStuff span.photo_container a img', /* old theme */
  'div#main span.photo_container', /* old theme */
  'div.flex.flex-wrap.w-full.relative a.is-flickrui-link > img', /* discover page */
  'div.photo-list-view .photo-container a', /* galleries */
  'div.photo-list-view a.overlay', /* common thumbnail */
  'div.photo-list-view a.photo-link', /* new albums layout */
  'div.photo-list-tile-view > a', /* search page tile view */
  'div.group-discussion-topic-view div.message-text a img', /* discussions page images */
  'div#DiscussTopic td.Said a img', /* discussions page images (old theme) */
  'div.photo-content-upper-container .photo-engagement-view', /* main photo page engagement */
  'div.photo-page-lightbox-scrappy-view .photo-card-engagement', /* lightbox page engagement */
].join(",");


function checkBody() {
  // Detect page changes and clear our states
  const rootview = document.body.getElementsByClassName('flickr-view-root-view')[0];
  if (rootview && (page.url != document.URL) && (page.rootview != rootview || !rootview.isConnected)) {
    if (page.url) {
      console.debug('Rootview changed.');
      Dropdown.active?.hide();
      nodesProcessed.forEach((_, node) => {
        if (!node.isConnected) nodesProcessed.delete(node);
      });
      if (PreviewMode.active) PreviewMode.clear({ reason: 'page change' });
    }
    page.rootview = rootview;
    page.url = document.URL;
  }

  // Determine specific contexts
  page.mainPhoto = document.getElementsByClassName('main-photo')[0];
  page.isLightbox = isLightboxURL(document.URL);

  // Scan for newly added nodes
  $$(TARGET_NODES_SELECTOR, document.body).forEach(node => {
    if (nodesProcessed.has(node) || nodesBlacklisted.has(node)) return;

    const data = Object.create(null);

    if (node.nodeName == "A") {
      if (!isValidHref(data.photoPageURL = node.href)) return;
      data.isThumbnail = true;
    } else if (node.nodeName == "IMG") {
      data.isMainPhoto = node.classList.contains('main-photo');
      if (data.isMainPhoto) {
        if (o.MAIN_PHOTO_ENGAGEMENT_VIEW || page.isLightbox) return;
        data.photoPageURL = document.URL;
      } else {
        if (!isValidImageURL(node.src)) return;
        const anchor = node.parentNode;
        if (!isValidHref(data.photoPageURL = anchor?.href)) return;
      }
      data.isImage = data.isThumbnail = true;
    } else if (node.nodeName == "SPAN") {
      const anchor = $('a:not(.spaceball)', node);
      if (!isValidHref(data.photoPageURL = anchor?.href)) return;
      data.isThumbnail = true;
    } else if (/engagement/.test(node.className)) {
      if (!node.childElementCount) return;
      data.isMainPageEngagement = node.classList.contains('photo-engagement-view');
      if (data.isMainPageEngagement && !o.MAIN_PHOTO_ENGAGEMENT_VIEW) return;
      data.isLightboxEngagement = node.classList.contains('photo-card-engagement');
      data.photoPageURL = document.URL;
    } else {
      return;
    }

    if (!getOr(data.photoPageURL)) return;

    const photoIsLocked = data.photoPageURL.includes('flickr.com/gp/');
    const photoIsUnlocked = data.photoPageURL.includes('flickr.com/photos/');
    if (!photoIsLocked && !photoIsUnlocked) return;

    if (/\/(albums|groups|galleries)\//.test(data.photoPageURL)) {
      nodesBlacklisted.add(node);
      return;
    }

    const components = data.photoPageURL.split('/');
    data.author = components[4];
    data.photoId = data.isImage && !data.isMainPhoto
      ? node.src.split('/').filter(Boolean).pop()?.split('_')[0]
      : components[5];

    if (!data.photoId) {
      nodesBlacklisted.add(node);
      return;
    }

    if (!photoIsLocked && isNaN(Number(data.photoId))) {
      console.debug(`Not a valid photoId "${data.photoId}"`, node);
      nodesBlacklisted.add(node);
      return;
    }

    data.node = node;

    const dropdown = new Dropdown(data);
    nodesProcessed.set(node, dropdown);
    console.debug(`Created dropdown for nodeName ${node.nodeName} | ` +
                  `class ${node.className} | nodesProcessed: ${nodesProcessed.size}`);

    /**
     * Populate immediately only if the `appContext` global variable is ready.
     * Don't want to flood the server with too many non-API requests in a row
     * during observer stage. Calling appContext.getModel(...) will only send
     * requests to the Flickr API via the REST endpoint to gather info.
     */
    if (page.YUIready || !data.isThumbnail) {
      setTimeout(() => { /* Don't want to keep the observer busy for _too_ long */
        populate(dropdown);
      }, 200);
    }
  });

  if (Dropdown.active?.target.isMainPageEngagement || page.isLightbox) {
    MouseHandler.destroy();
  } else {
    MouseHandler.init();
  }
}


(async () => {
  console.log("Init start.");
  const getPageContent = () => document.querySelectorAll?.('div#content, div#Main, div#main, main')[0];
  if (!(page.content = getPageContent())) {
    console.log('Waiting for page content.');
    await new Promise(resolve => {
      new MutationObserver((_, observer) => {
        if (page.content = getPageContent()) {
          console.log('Page content ready.');
          observer.disconnect();
          resolve();
        }
      }).observe(document, { childList: true, subtree: true });
    });
  }

  setStyle(o);
  Messages.init();
  PreviewMode.init();
  SettingsModal.init();
  GM_registerMenuCommand('Settings', SettingsModal.show.bind(SettingsModal));

  document.body.append(startupLoader, overlay);

  new MutationObserver(checkBody)
    .observe(page.content, { childList: true, subtree: true });

  new ResizeObserver(() => { Dropdown.active?.updatePos() })
    .observe(document.documentElement);

  document.addEventListener('keydown', onKeyDown, true);
  MouseHandler.init();

  if (page.content.getAttribute('id') === 'content' && typeof unsafeWindow !== 'undefined') {
    let retryCount = 0;
    while (!(page.YUIready = unsafeWindow.appContext?.getModel != null) && retryCount < 10) {
      retryCount++;
      console.log(`Waiting for YUI appContext... (Retry ${retryCount}/10)`);
      await sleep(1000);
    }
  }

  startupLoader.remove();
  startupLoader = null;
  console.log("Init complete.");
})();
