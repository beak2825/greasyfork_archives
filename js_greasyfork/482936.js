// ==UserScript==
// @name         share-tweet-copy
// @namespace    https://screw-hand.com/
// @version      0.4.6
// @description  support twitter to copy, easy to share.
// @author       screw-hand
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @homepage     https://github.com/screw-hand/tampermonkey-user.js
// @supportURL   https://github.com/screw-hand/tampermonkey-user.js/issues/new
// @downloadURL https://update.greasyfork.org/scripts/482936/share-tweet-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/482936/share-tweet-copy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Change Log
   * 
   * Version 0.4.6(2024-09-19)
   *  - fix dark mode style
   *
   * Version 0.4.5(2024-05-31)
   * - fix find tweet link with edit history. 
   * 
   * Version 0.4.4(2024-05-25)
   * - fix find tweet link
   * 
   * Version 0.4.3(2024-05-17)
   * - fix match https://x.com 
   * 
   * Version 0.4.2(2024-05-17)
   *  - math https://x.com
   * 
   * Version 0.4.1(2024-04-24)
   *  - dev.user.js (dev mode) support set up USER_TEMPLATE environment variable.
   * 
   * Version 0.4.0 (2024-04-23)
   *  - Tweets are measured by character count, and if the character count exceeds the limit, it is replaced with an ellipsis;
   *  - If the number of line breaks in a tweet exceeds the limit, it is replaced with an ellipsis.
   *  - support environment variable
   *
   * Version 0.3.16 (2024-04-17)
   *  - Fix username's emoji cannot be copied
   *
   * Version 0.3.15 (2024-01-24)
   *  - Fix margin for copy-tweet-button
   *
   * Version 0.3.14 (2024-01-24)
   *  - Fix button style on status page.
   *
   * Version 0.3.13 (2023-01-11)
   *  - Fix add newline between original and translated text in Immersive Translate.
   *
   * Version 0.3.12 (2023-12-29)
   *  - Fix media static error result count, add card link count.
   *
   * Version 0.3.11 (2023-12-29)
   *  - Fix media static error result count.
   *
   * Version 0.3.10 (2023-12-29)
   *  - temp update status page style
   *  - update failedmark icon svg
   *
   * Version 0.3.9 (2023-12-29)
   *  - fix copy result is undefined
   *
   * Version 0.3.8 (2023-12-29)
   *  - notify about copy failed
   *
   * Version 0.3.7 (2023-12-29)
   *  - recover homepage and supportURL config.
   *
   * Version 0.3.6 (2023-12-29)
   *  - Media count support static git, video, and more media card.
   *
   * Version 0.3.5 (2023-12-25)
   *  - Rename script path of github repo.
   *
   * Version 0.3.4 (2023-12-25)
   *  - Update media count default template.
   *
   * Version 0.3.3 (2023-12-25)
   *  - Chore indent use 2 spaces.
   *  - Feat remove multiple blank lines.
   *
   * Version 0.3.2 (2023-12-24)
   *  - Chore indent use 2 spaces.
   *
   * Version 0.3.1 (2023-12-23)
   *  - Fixed issue with copying reposted tweets: now correctly retrieves user name.
   *  - Optimized the teewText format, when copy the context with `@usernmae` not line feed.
   *  - Fxied copy emoji. Pre-condition: The user's system supports displaying that emoji.
   *  - Feature: Statistics the pic total count, for base feature.
   *
   *
   * Version 0.3.0 (2023-12-23)
   *   - Public the script to Greasy Fork.
   *   - Delete updateURL, donwupdateURL.
   *
   * Version 0.2 (2023-12-13)
   *   - Added styles for the copy-tweet button, including support for dark mode.
   *   - Implemented a tooltip to show the result of the copy action.
   *   - Enhanced dark mode support for better user experience in various lighting conditions.
   *
   * Version 0.1 (2023-12-13)
   *   - Initial release.
   *   - Basic functionality to copy tweet text to clipboard with a simple template.
   */

  /**
   * Defines the styles for the copy button.
   * This includes support for dark mode and styling for various states like hover and focus.
   */
  const copyBtnStyle = /*css*/`
  .copy-tweet-button {
    --button-bg: #e5e6eb;
    --button-hover-bg: #d7dbe2;
    --button-text-color: #4e5969;
    --button-hover-text-color: #164de5;
    --button-border-radius: 6px;
    --button-diameter: 24px;
    --button-outline-width: 2px;
    --button-outline-color: #9f9f9f;
    --tooltip-bg: #1d2129;
    --toolptip-border-radius: 4px;
    --tooltip-font-family: JetBrains Mono, Consolas, Menlo, Roboto Mono, monospace;
    --tooltip-font-size: 12px;
    --tootip-text-color: #fff;
    --tooltip-padding-x: 7px;
    --tooltip-padding-y: 7px;
    --tooltip-offset: 8px;
    /* --tooltip-transition-duration: 0.3s; */
  }

  html[style*="color-scheme: dark"] .copy-tweet-button {
    --button-bg: #353434;
    --button-hover-bg: #464646;
    --button-text-color: #ccc;
    --button-outline-color: #999;
    --button-hover-text-color: #8bb9fe;
    --tooltip-bg: #f4f3f3;
    --tootip-text-color: #111;
  }

  .copy-tweet-button {
    box-sizing: border-box;
    width: var(--button-diameter);
    height: var(--button-diameter);
    border-radius: var(--button-border-radius);
    background-color: var(--button-bg);
    color: var(--button-text-color);
    border: none;
    cursor: pointer;
    position: relative;
    outline: var(--button-outline-width) solid transparent;
    transition: all 0.2s ease;
  }

  *:has(+ .copy-tweet-button) {
    margin-right: 8px !important;
  }

  .tooltip {
    position: absolute;
    opacity: 0;
    left: calc(100% + var(--tooltip-offset));
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font: var(--tooltip-font-size) var(--tooltip-font-family);
    color: var(--tootip-text-color);
    background: var(--tooltip-bg);
    padding: var(--tooltip-padding-y) var(--tooltip-padding-x);
    border-radius: var(--toolptip-border-radius);
    pointer-events: none;
    transition: all var(--tooltip-transition-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .tooltip::before {
    content: attr(data-text-initial);
  }

  .tooltip::after {
    content: "";
    width: var(--tooltip-padding-y);
    height: var(--tooltip-padding-y);
    background: inherit;
    position: absolute;
    top: 50%;
    left: calc(var(--tooltip-padding-y) / 2 * -1);
    transform: translateY(-50%) rotate(45deg);
    z-index: -999;
    pointer-events: none;
  }

  .copy-tweet-button svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .checkmark,
  .failedmark {
    display: none;
  }

  .copy-tweet-button:hover .tooltip,
  .copy-tweet-button:focus:not(:focus-visible) .tooltip {
    opacity: 1;
    visibility: visible;
  }

  .copy-tweet-button:focus:not(:focus-visible) .tooltip::before {
    content: attr(data-text-end);
  }
  .copy-tweet-button.copy-failed:focus:not(:focus-visible) .tooltip::before {
    content: attr(data-text-failed);
  }

  .copy-tweet-button:focus:not(:focus-visible) .clipboard {
    display: none;
  }

  .copy-tweet-button:focus:not(:focus-visible) .checkmark {
    display: block;
  }

  .copy-tweet-button.copy-failed:focus:not(:focus-visible) .checkmark {
    display: none;
  }

  .copy-tweet-button.copy-failed:focus:not(:focus-visible) .failedmark {
    display: block;
  }

  .copy-tweet-button:hover,
  .copy-tweet-button:focus {
    background-color: var(--button-hover-bg);
  }

  .copy-tweet-button:active {
    outline: var(--button-outline-width) solid var(--button-outline-color);
  }

  .copy-tweet-button:hover svg {
    color: var(--button-hover-text-color);
  }
  `;

  /**
   * Adds styles using the DOM method.
   * @param {string} cssText - The CSS style text to be added.
   */
  function addStyleWithDOM(cssText) {
    const styleNode = document.createElement('style')
    styleNode.appendChild(document.createTextNode(cssText));
    (document.querySelector('head') || document.documentElement).appendChild(styleNode)
  }

  /**
   * Adds styles using GM_addStyle and returns whether it was successful.
   * @param {string} cssText - The CSS style text to be added.
   * @returns {boolean} Whether the style was successfully added.
   */
  function addStyleWithGM(cssText) {
    const isGMAddStyleAvailable = typeof GM_addStyle !== 'undefined';
    if (isGMAddStyleAvailable) {
      GM_addStyle(cssText);
    }
    return isGMAddStyleAvailable;
  }

  // Execute style addition and check if it was successful
  const resultsOfEnforcement = addStyleWithGM(copyBtnStyle)

  // If unsuccessful, fallback to adding styles using the DOM method
  if (!resultsOfEnforcement) {
    addStyleWithDOM(copyBtnStyle)
  }

  /**
   * environment variable
   * @type {Object}
   * @property {string} MODE 'DEV' || 'PROD'
   * @property {string} USER_TEMPLATE
   */
  const ENV = {
    MODE: GM_getValue('ENV_MODE', 'PROD'),
    USER_TEMPLATE: GM_getValue('ENV_USER_TEMPLATE')
  }

  if (ENV.MODE !== 'PROD') {
    console.log(`share-tweet-copy: ${ENV.MODE}`)
  }

  /**
   * Contains functions to extract various pieces of data from a tweet element.
   */
  const tweetDataExtractors = {
    username: ({ tweetElement }) => findUserName({ tweetElement }), 
    userId: ({ tweetElement }) => findUserID({ tweetElement }),
    tweetText: ({ tweetElement }) => findTweetText({ tweetElement }),
    mediaCount: ({ tweetElement }) => findMediaCount({ tweetElement }),
    link: ({ tweetElement }) => findLink({ tweetElement })
  };

  /**
   * User-defined template for formatting tweet data.
   */
  const UserTemplate = ENV.USER_TEMPLATE || [
    `{{username}} ({{userId}})`,
    ``,
    `{{tweetText}}`,
    ``,
    `{{mediaCount}}`,
    ``,
    `{{link}}`
  ].join('\n')

  /**
   * Adds a copy button to a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   */
  function addCopyButtonToTweet({ tweetElement }) {
    if (tweetElement.querySelector('.copy-tweet-button')) {
      return;
    }

    let copyButton = document.createElement('button');
    copyButton.className = 'copy-tweet-button';

    handleTempStyleStatusPage({ copyButton });

    copyButton.innerHTML = /*html*/`
      <span data-text-initial="Copy to clipboard" data-text-end="Copied" data-text-failed="Copy failed, open the console for details!" class="tooltip"></span>
      <span>
        <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0"
          height="14" width="14" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
          xmlns="http://www.w3.org/2000/svg" class="clipboard">
          <g>
            <path fill="currentColor"
              d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z">
            </path>
          </g>
        </svg>
        <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="14"
          width="14" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg"
          class="checkmark">
          <g>
            <path data-original="#000000" fill="currentColor"
              d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z">
            </path>
          </g>
        </svg>
        <svg class="failedmark" xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512">
          <path fill="#FF473E"
            d="m330.443 256l136.765-136.765c14.058-14.058 14.058-36.85 0-50.908l-23.535-23.535c-14.058-14.058-36.85-14.058-50.908 0L256 181.557L119.235 44.792c-14.058-14.058-36.85-14.058-50.908 0L44.792 68.327c-14.058 14.058-14.058 36.85 0 50.908L181.557 256L44.792 392.765c-14.058 14.058-14.058 36.85 0 50.908l23.535 23.535c14.058 14.058 36.85 14.058 50.908 0L256 330.443l136.765 136.765c14.058 14.058 36.85 14.058 50.908 0l23.535-23.535c14.058-14.058 14.058-36.85 0-50.908z" />
        </svg>
      </span>
    `

    let nameElement = tweetElement.querySelector('[data-testid="User-Name"]');
    if (nameElement) {
      nameElement.appendChild(copyButton);
    }

    copyButton.addEventListener('click', e => handleTweetCopyClick({ e, tweetElement }));
  }

  /**
   * Handles the copy button click event.
   * @param {Object} param - Object containing the event and tweet element.
   * @param {Event} param.e - The click event.
   * @param {Element} param.tweetElement - The tweet element.
   */
  function handleTweetCopyClick({ e, tweetElement }) {
    e.stopPropagation();

    try {
      let text = formatTweet({ tweetElement });
      copyTextToClipboard({ tweetElement, text });
    } catch (error) {
      handleCopyError({ tweetElement, error })
    }
  }

  /**
   * handles copy error
   * @param {Element} param.tweetElement - The tweet element.
   * @param {Error} param.error - The error object.
   */
  function handleCopyError({ tweetElement, error = new Error() }) {
    const copyTweetButton = tweetElement.querySelector('.copy-tweet-button');
    copyTweetButton.classList.add('copy-failed')
    console.error('Could not copy tweet: ', error);
  }

  /**
   * Finds the user name from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} User Name.
   */
  function findUserName({ tweetElement }) {
    let username = tweetElement.querySelector('div[data-testid="User-Name"]').firstChild;
    if (!username) {
      return '';
    }
    let clone = username.cloneNode(true);
    clone.querySelectorAll('img').forEach(img => {
      let altText = img.alt || '';
      let textNode = document.createTextNode(altText);
      img.parentNode.replaceChild(textNode, img);
    });
    return clone.textContent;
  }

  /**
   * Finds the user ID from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} User ID.
   */
  function findUserID({ tweetElement }) {
    let links = tweetElement.querySelectorAll('a[href^="/"][role="link"][tabindex="-1"]');
    let userIDElement = links[links.length - 1];

    return userIDElement ? userIDElement.textContent : '';
  }

  /**
   * @param {string} tweetText
   * @param {number} count max line breaks
   * @returns {string} tweetText
   */
  function limitLineBreaks(tweetText, count) {
    const lineCount = (tweetText.match(/\n/g) || []).length;
    if (lineCount > count) {
      const limitedText = tweetText.split('\n').slice(0, count).join('\n');
      return limitedText + '...\n';
    }
    return tweetText
  }

  /**
   * Calculate the length of the tweet character, and use an ellipsis to represent the overflow content.
   * @param {string} tweetText 
   * @returns {string} tweetText
   */
  function handleTweetText(tweetText) {
    /**
     * Counting characters Rule reference the following link, this is just a simple implementation
     * Counting characters | Docs | Twitter Developer Platform
     * https://developer.twitter.com/en/docs/counting-characters
     */
    const MAX_TWEET_CHARACTERS = 280;
    const CharacterConfig = {
      urls: { pattern: /https?:\/\/[^\s]+/g, charActerLength: 23 },
      emojis: { pattern: /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, charActerLength: 2 },
      cjk: { pattern: /[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}\u{AC00}-\u{D7AF}\u{1100}-\u{11FF}]/gu, charActerLength: 2 },
      mentions: { pattern: /@\w+/g, charActerLength: 0 }
    };
    const MAX_LINE_BREAK = 10;

    let characterCounts = {}
    Object.keys(CharacterConfig).forEach(key => {
      characterCounts[key] = 0
    })

    // Normalize the text
    tweetText = tweetText.normalize('NFC');

    let characterLength = 0;
    let tweetIndex = 0;
    let mask = {};

    while (tweetIndex < tweetText.length) {
      let matched = false;

      // Check each character pattern
      for (const [key, config] of Object.entries(CharacterConfig)) {
        const regex = new RegExp(config.pattern);
        regex.lastIndex = tweetIndex; // Start matching from current index
        const match = regex.exec(tweetText);

        if (match && match.index === tweetIndex) { // Match must start at the current index
          characterCounts[key] += 1;
          matched = true;
          const matchLength = match[0].length;

          if (key === 'urls') {
            // For URLs, add the entire URL's length once
            characterLength += config.charActerLength;
            tweetIndex += matchLength - 1; // Move index to the end of the URL
          } else {
            // For other patterns, add length per matched character
            characterLength += matchLength * config.charActerLength;
          }

          break; // Stop checking other patterns once matched
        }
      }

      if (!matched) {
        // If no special characters matched, count the current character as one
        characterLength += 1;
      }

      tweetIndex++; // Move to the next character
    }

    if (ENV.MODE !== 'PROD') {
      console.log({
        characterLength,
        tweetText_length: tweetText.length,
        characterCounts
      });
    }

    // Check if the length exceeds the limit and trim if necessary
    if (characterLength > MAX_TWEET_CHARACTERS) {
      tweetText = tweetText.substring(0, MAX_TWEET_CHARACTERS) + '...'; // Truncate and add ellipsis
    } 
    else {
      tweetText = limitLineBreaks(tweetText, MAX_LINE_BREAK)
    }

    return tweetText;
  }

  /**
   * Finds the tweetText from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} TweetText
   */
  function findTweetText({ tweetElement }) {
    const tweetTextDOM = tweetElement.querySelector('div[data-testid="tweetText"]');
    if (!tweetTextDOM) {
      return '';
    }
    let clone = tweetTextDOM.cloneNode(true);
    clone.innerHTML = tweetTextDOM.innerHTML.replace('><br><font', '>\n\n<font');
    // Support copy the emoji, There are system compatibility issues that cannot be fully resolved.
    // Consider using a third-party emoji library to solve this problem.
    clone.querySelectorAll('img').forEach(img => {
      let altText = img.alt || '';
      let textNode = document.createTextNode(altText);
      img.parentNode.replaceChild(textNode, img);
    });
    let tweetText  = handleTweetText(clone.textContent);
    
    return tweetText;
  }

  /**
   * Finds the media count from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} media count.
   */
  function findMediaCount({ tweetElement }) {
    let cameraEmoji = '\u{1F4F7}';

    // FIXME: bad design, this a build-in template, but need to number of judgments.
    // ===
    const tweetPhoto = tweetElement.querySelectorAll('div[data-testid="tweetPhoto"]')?.length || 0;
    const cardLink = tweetElement.querySelectorAll('div[data-testid^="card"] a[href*="https://t.co"]')?.length || 0;
    const mediaCount = tweetPhoto + cardLink;
    let mediaWord = 'media'
    if (!mediaCount) {
      return '';
    }
    if (mediaCount > 1) {
      mediaWord += 's'
    }
    return `${cameraEmoji} ${mediaCount} ${mediaWord}`;
    // ===
  }

  /**
   * Finds the link from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} tweet link.
   */
  const findLink = ({ tweetElement }) => {
    const StatusLink = [...tweetElement.querySelectorAll('a[href*="/status/"]')]
      ?.map(a => a.href)
      ?.find(link => /\/status\/\w+(\/history)?$/.test(link))
      ?.replace(/\/history$/, '')
    return StatusLink;
  }

  /**
   * Formats the tweet data according to the user-defined template.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} Formatted tweet data.
   */
  function formatTweet({ tweetElement }) {
    let formatted = UserTemplate.replace(/\\{{/g, '{').replace(/\\}}/g, '}');
    formatted = formatted.replace(/{{(\w+)}}/g, (match, key) => {
      if (tweetDataExtractors[key]) {
        return tweetDataExtractors[key]({ tweetElement });
      }
      return match;
    });
    formatted = formatted.replaceAll(/\n\n\n/gi, '\n')
    return formatted;
  }

  /**
   * Copies text to the clipboard.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @param {string} param.text - Text to be copied.
   */
  function copyTextToClipboard({ tweetElement, text }) {
    navigator.clipboard.writeText(text).then(function () {
      console.log('Tweet copied to clipboard');
      console.log(text);
      console.log('===');
    }).catch(function (error) {
      handleCopyError({ tweetElement, error })
    });
  }

  // FIXME Temporary solution to solve the problem of /status/ web style misalignment
  const handleTempStyleStatusPage = ({ copyButton }) => {
    let executed = false;

    if (window.location.href.indexOf('/status/') > 0 && !executed) {
      executed = true;

      const tempStyle = /*css*/`
        position: absolute;
        top: -2px;
        right: calc(-1 * (var(--button-diameter) + 8px));
      `;

      copyButton.setAttribute('style', tempStyle);
    }
  }

  /**
   * Observes DOM mutations to add a copy button to new tweets.
   */
  let observer = new MutationObserver(function (mutations) {
    let articles = document.querySelectorAll('article[role="article"]');
    articles.forEach(function (tweetElement) {
      if (!tweetElement.querySelector('.copy-tweet-button')) {
        addCopyButtonToTweet({ tweetElement });
      }
    });
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
})();
