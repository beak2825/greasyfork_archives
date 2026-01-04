// ==UserScript==
// @name           GoatBots Card Watcher
// @version        2.2.2
// @author         aminomancer
// @homepageURL    https://github.com/aminomancer/GoatBots-Card-Watcher
// @supportURL     https://github.com/aminomancer/GoatBots-Card-Watcher
// @namespace      https://github.com/aminomancer
// @match          https://www.goatbots.com/*
// @description    Configure a list of cards to watch GoatBots until in stock. Pick a GoatBots page to watch, and click the cards you want to watch for. Then leave the script to automatically refresh that page on a set timer, check if any of the cards are in stock, and if so, add them to cart, play an audio alert, and (optionally) start delivery.
// @license        CC-BY-NC-SA-4.0

// The alert will use text-to-speech to audibly speak the names of the new cards
// if text-to-speech is available on your computer. Otherwise it will just play
// a predefined sound file that says "New cards in stock." You can watch
// multiple pages, and you can scan for multiple cards per-page.

// Configure the script by setting a URL path and cards to scan for in the
// config settings. You can access the config settings through the "Card
// Watcher" menu at the top of the GoatBots window, or through your script
// manager. Violentmonkey and the latest Greasemonkey versions have a toolbar
// button that opens a popup showing script settings for the current page. These
// are the same settings as in the "Card Watcher" menu. So if you go to
// www.goatbots.com you can open the popup or the menu and use the buttons in
// there to configure your watchlist. If you're not sure, there are further
// instructions and details in the script.

// When you first open a GoatBots page, open the menu popup and click the button
// that says "Add Page to Watchlist" to make a watchlist editor appear. The top
// text field is the path field. It defaults to the path of the current page. If
// you want to still be able to use the normal GoatBots page without it
// constantly reloading, add a + at the end of the page URL, like in the page
// paths for the example watchlist. You can navigate to the URL just fine with +
// at the end, and the script will correctly recognize it as a different URL.
// Then, the script will only activate when you explicitly navigate to the +
// version of the URL, which you can bookmark.

// Then proceed to the big text area — the cards list. Technically, you can
// manually input the cards you want to add, in YAML or JSON format. But because
// there are many versions of some cards, the cards are uniquely identified by a
// random ID that is not easily visible on the page. So it's recommended to
// click the "Select by clicking" button at the bottom. This will allow you to
// add cards to the watchlist just by clicking them. Clicking a card row will
// toggle it on or off. Then click the "Confirm" button to return to the
// watchlist editor — the cards list will now be filled with the cards you
// selected. Then, click the "Save" button and it will store this in your script
// settings. They will persist even after updating the script.

// By default, this script will refresh the page every 10 seconds, provided the
// tab the page is loaded in is not active. It basically pauses refreshing while
// the tab is active, so that you can still use the page as normal. That way, it
// will only scan in the background, and alert you when it finds something.
// However, this pausing behavior can be disabled by setting "Refresh while
// active" to true in the advanced settings, which can be accessed through the
// menu. You can set the values of any of the settings in this interface, except
// for the watchlist. If you need to make bulk changes to the watchlist, go to
// the script page in your script manager and click on the "Values" tab.

// The "Automatically start delivery" setting lets you begin delivery as soon as
// new cards are detected. This increases the chances that you'll get the cards,
// since there's no risk of fumbling around trying to find the tab and click the
// "start delivery" button yourself. The script will just handle it for you. But
// if you're going to use this, you have to make sure the script isn't operating
// when you're away from the computer, since it will be a major public nuisance
// if you're not actually present to conduct the delivery.

// Otherwise, it's useful to have this feature since it takes a few minutes for
// GoatBots to actually send a trade request. So there's time for you to get
// ready. You just want to make sure you enter the delivery queue as soon as
// possible, so that someone else doesn't queue up first. If you're first in
// line, I think it's guaranteed you'll get the card. You can toggle this
// setting from the menu popup or your script manager (popup or values page).
// For additional efficiency, when the delivery is finished, the script will
// automatically go back to the page it was watching before it started delivery.

// If you're using Firefox and you want the text-to-speech alerts, make sure the
// following pref is enabled in about:config - media.webspeech.synth.enabled
// If you don't want or can't use text-to-speech, and the default sound file is
// not to your liking, you can replace it with your own base64-encoded audio
// file. You can convert any mp3 file to base64 by uploading it to this encoder:
// https://codepen.io/xewl/pen/NjyRJx
// Then just copy the resulting string and replace the "Voice audio file" value
// at the bottom with your new string. The script will decode and play it at
// runtime. This audio file is not a user setting because that would slow the
// script down, so you have to edit the script directly.

// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @grant          GM_addValueChangeListener
// @grant          GM_getResourceURL
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.addStyle
// @require        https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js
// @resource       texture https://cdn.jsdelivr.net/gh/aminomancer/Netflix-Marathon-Pausable@latest/texture/noise-512x512.png
// @run-at         document-start
// @license        This Source Code Form is subject to the terms of the Creative Commons Attribution-NonCommercial-ShareAlike International License, v. 4.0. If a copy of the CC BY-NC-SA 4.0 was not distributed with this file, You can obtain one at http://creativecommons.org/licenses/by-nc-sa/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// @icon           data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><path d="M209.82 4.76c6.89-2.17 14.1-3.64 21.35-3.39-3.84 5.25-10.98 5.94-15.65 10.18-3.46 3.21-6.81 6.64-9.42 10.59-5.7 9.12-8.51 19.69-14.2 28.81-5.78 9.3-13.58 17.08-20.24 25.72-1.45 1.98-3.04 3.99-3.69 6.4-.34 3.05.6 6.05.74 9.08l.05 2.13c-4.95-4.04-9.21-8.86-14.4-12.62-2.88-2.07-5.77-4.39-7.25-7.71-1.9-3.22-3.03-7.96-7.28-8.75-7.22-1.55-14.52.8-21.8.47-5.74.22-12.08-.92-17.31 2-3.97 3.64-4.81 9.54-8.84 13.18-4.53 4.17-9.48 7.88-14.38 11.6l-.4-3.44c-.32-3.18-1.1-6.41-3.14-8.96-7.28-9.66-17.82-16.31-25.03-26.03-4.49-7.25-4.69-16.16-8.06-23.89-3.43-8.09-7.86-16.86-16.25-20.71-3.78-2.02-8.23-3.37-10.79-7.05 7.25-.25 14.46 1.22 21.35 3.39 4.92 1.55 9.31 4.48 12.81 8.24 7.79 8.3 14.09 17.87 21.73 26.29 5.96 5.31 12.47 10.13 19.88 13.24 8.95 4.94 19.27 6.73 29.41 6.51 7.76-.21 15.79.74 23.3-1.71 7.83-2.72 13.95-8.6 19.6-14.44 6.63-6.79 15.51-11.01 21.55-18.43 2.99-3.67 6.31-7.06 10-10.04 5.05-4.09 10-8.71 16.36-10.66zM114.1 113.84c3.61.62 6.75 2.57 9.89 4.33 3.14-1.78 6.28-3.72 9.89-4.33 2.06 6.59 5.3 13.45 3.39 20.49-2.87 4.34-7.31 7.39-11.21 10.75-2.15 2.25-4.57-.47-6.31-1.81-3.09-2.86-6.82-5.26-8.95-8.97-2.1-7.03 1.49-13.81 3.3-20.46zm-58.06 2.13c6.37 2.83 11.79 7.51 16.26 12.8 1.35 1.43 1.52 3.44 1.82 5.29-9.66.14-18.59-8.24-18.08-18.09zm128.03 5.08c2.71-1.94 5.49-4.35 9.03-4.32.01 9.08-8.75 16.15-17.31 17.1-1.4-5.95 4.39-9.51 8.28-12.78zm-71.88 31.12c5.66-1.78 11.7-2.26 17.6-1.7 6.43.65 12.07 4.59 16.22 9.36-7.22 2.36-14.22 6.39-22.05 5.95-6.67.14-12.78-3.25-18.1-6.95 1.17-2.88 3.21-5.73 6.33-6.66z" fill="%23735141"/><path d="M118.03 65.67c7.28.33 14.58-2.02 21.8-.47 4.25.79 5.38 5.53 7.28 8.75 1.48 3.32 4.37 5.64 7.25 7.71 5.19 3.76 9.45 8.58 14.4 12.62 4.83 4.66 12.1 4.35 18.3 3.78 8.88-.73 17.18-5.71 26.26-4.12-1.24 1.55-2.55 3.07-4.17 4.23-8.33 6.01-18.2 9.44-26.49 15.52-8.35 6.22-12.61 16.36-14.92 26.22-1.34 5.2-1.8 11.08-5.69 15.16-5.87 6.19-13.54 10.4-19.08 16.94-2.96 3.37-6.09 7.07-10.6 8.29-4.66 1.19-9.59 1.42-14.34.76-4.55-.71-6.87-5.21-9.85-8.19-6.43-7.67-15.54-12.48-21.92-20.16-6.32-8.02-4.82-19.25-10.33-27.66-5.93-9.38-15.17-16.08-24.91-21.1-5.79-3.07-12.4-5.47-16.36-11.01 6.19-.98 12.22 1.13 18.37 1.33 4.98.23 9.96.18 14.94.11 3.24-.12 6.7-.12 9.53-1.93 4.9-3.72 9.85-7.43 14.38-11.6 4.03-3.64 4.87-9.54 8.84-13.18 5.23-2.92 11.57-1.78 17.31-2m34.74 31.09c-4.84 5.32-12.49 8.51-14.11 16.21 2.22 2.38 5.01 4.66 8.42 4.77 4.72.14 9.24-1.97 13.04-4.61 4.45-3.14 5.68-9.01 5.27-14.14-.33-3.91-4.29-7.47-8.3-6.25-1.63 1.12-2.94 2.63-4.32 4.02m-74.95 4.16c2.79 8.98 11.12 15.94 20.23 17.78 4.61 1.2 7.32-3.37 9.4-6.63-2.18-4.17-6.05-6.97-9.24-10.3-4.04-3.81-9.05-7.99-14.98-7.42-3.02.44-6.85 3.06-5.41 6.57m36.28 12.92c-1.81 6.65-5.4 13.43-3.3 20.46 2.13 3.71 5.86 6.11 8.95 8.97 1.74 1.34 4.16 4.06 6.31 1.81 3.9-3.36 8.34-6.41 11.21-10.75 1.91-7.04-1.33-13.9-3.39-20.49-3.61.61-6.75 2.55-9.89 4.33-3.14-1.76-6.28-3.71-9.89-4.33m-1.91 38.33c-3.12.93-5.16 3.78-6.33 6.66 5.32 3.7 11.43 7.09 18.1 6.95 7.83.44 14.83-3.59 22.05-5.95-4.15-4.77-9.79-8.71-16.22-9.36-5.9-.56-11.94-.08-17.6 1.7zm46.15 25.22c2.66-8.12 4.5-17.94 12.52-22.6.74 4.36.84 8.78 1.03 13.19.45 10.5 2.72 21.08 7.73 30.39 2.99 5.62 5.65 11.48 6.72 17.8l-49.1 28.43c-1.64-7.43-.74-15.06-.98-22.59.05-4.78-.52-9.8 1.41-14.32 4.77-11.51 17-18.17 20.67-30.3zm-78.08-20.56c7.52 8.48 10.21 19.98 16.93 29.01 5.08 7.16 13.12 11.63 17.93 19.01 3.45 5.37 3.63 11.96 3.76 18.13.04 7.38.13 14.79-.89 22.12-2.08.16-4.16.36-6.24.43l-41.04-23.32c-.03-9.13-.51-18.48 2.13-27.33 3.74-12.39 6.36-25.15 7.42-38.05z" fill="%23e4dfd1"/><path d="M208.39 88.39c10.26-2.56 20.49-5.45 31.02-6.69.53 6.12-3.34 11.21-7.53 15.18-5.77 5.58-11.14 11.74-18.05 15.97-4.04 2.75-8.7 4.45-12.65 7.34-5.22 4.37-6.75 11.63-11.85 16.13-3.53 3.34-8.33 4.89-11.9 8.16-1.31 4.33-.83 8.97-1.11 13.44.06 7.56-.61 15.18.24 22.7 2.74 11.04 11.96 19.31 14.21 30.53.77 2.74-2.67 3.78-4.43 5.02-1.07-6.32-3.73-12.18-6.72-17.8-5.01-9.31-7.28-19.89-7.73-30.39-.19-4.41-.29-8.83-1.03-13.19-8.02 4.66-9.86 14.48-12.52 22.6-3.67 12.13-15.9 18.79-20.67 30.3-1.93 4.52-1.36 9.54-1.41 14.32.24 7.53-.66 15.16.98 22.59-2.56 1.8-4.95 3.83-7.66 5.4h-12.26c-1.84-1.51-3.67-3.05-5.57-4.47 2.08-.07 4.16-.27 6.24-.43 1.02-7.33.93-14.74.89-22.12-.13-6.17-.31-12.76-3.76-18.13-4.81-7.38-12.85-11.85-17.93-19.01-6.72-9.03-9.41-20.53-16.93-29.01-1.06 12.9-3.68 25.66-7.42 38.05-2.64 8.85-2.16 18.2-2.13 27.33-3.2-1.63-6.82-3.13-8.74-6.36-.32-2.72.21-5.44.76-8.1 2.03-8.82 4.96-17.42 6.74-26.31 2.32-10.98 3.38-22.26 2.81-33.47-.27-1.35-.05-3.1-1.23-4.04-3.51-2.92-8.07-4.37-11.24-7.74-4.62-4.71-5.79-11.8-10.73-16.23-4.84-4.05-11.29-5.73-15.78-10.26-4.2-4.23-7.08-9.54-11-14.01-3.59-4.44-8.35-7.8-11.58-12.53 6.64-.16 13.27.74 19.68 2.42 6.81 1.74 13.5 4.25 20.59 4.58 8.7.36 17.54.76 26.11-1.15l.4 3.44c-2.83 1.81-6.29 1.81-9.53 1.93-4.98.07-9.96.12-14.94-.11-6.15-.2-12.18-2.31-18.37-1.33 3.96 5.54 10.57 7.94 16.36 11.01 9.74 5.02 18.98 11.72 24.91 21.1 5.51 8.41 4.01 19.64 10.33 27.66 6.38 7.68 15.49 12.49 21.92 20.16 2.98 2.98 5.3 7.48 9.85 8.19 4.75.66 9.68.43 14.34-.76 4.51-1.22 7.64-4.92 10.6-8.29 5.54-6.54 13.21-10.75 19.08-16.94 3.89-4.08 4.35-9.96 5.69-15.16 2.31-9.86 6.57-20 14.92-26.22 8.29-6.08 18.16-9.51 26.49-15.52 1.62-1.16 2.93-2.68 4.17-4.23-9.08-1.59-17.38 3.39-26.26 4.12-6.2.57-13.47.88-18.3-3.78l-.05-2.13c6.44.32 12.88 1.26 19.33.7 6.95-.59 13.61-2.79 20.35-4.46M56.04 115.97c-.51 9.85 8.42 18.23 18.08 18.09-.3-1.85-.47-3.86-1.82-5.29-4.47-5.29-9.89-9.97-16.26-12.8m128.03 5.08c-3.89 3.27-9.68 6.83-8.28 12.78 8.56-.95 17.32-8.02 17.31-17.1-3.54-.03-6.32 2.38-9.03 4.32zm-31.3-24.29c1.38-1.39 2.69-2.9 4.32-4.02 4.01-1.22 7.97 2.34 8.3 6.25.41 5.13-.82 11-5.27 14.14-3.8 2.64-8.32 4.75-13.04 4.61-3.41-.11-6.2-2.39-8.42-4.77 1.62-7.7 9.27-10.89 14.11-16.21zm-74.95 4.16c-1.44-3.51 2.39-6.13 5.41-6.57 5.93-.57 10.94 3.61 14.98 7.42 3.19 3.33 7.06 6.13 9.24 10.3-2.08 3.26-4.79 7.83-9.4 6.63-9.11-1.84-17.44-8.8-20.23-17.78z" fill="%230c0b09"/></svg>
// @downloadURL https://update.greasyfork.org/scripts/466804/GoatBots%20Card%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/466804/GoatBots%20Card%20Watcher.meta.js
// ==/UserScript==

/**
 * @typedef {Object} Card An object representing a card to watch for.
 * @property {string} name The name of the card, e.g. "Lightning Bolt"
 * @property {string} id The GoatBots ID of the card, e.g. "A4zDSnxvlEjn"
 * @property {string} [set] The set code, usually 3 characters.
 * @property {string} [frame] The card style, e.g. "Borderless"
 * @property {string} [rarity] The rarity, e.g. "Mythic Rare"
 * @property {number} [wanted] The max number of copies to order, or a value
 *   less than 1 for no limit.
 * @property {string} [alert] Optional alert text to read aloud when found.
 * @property {string} [notes] Optional notes about the card (not read aloud).
 */

/**
 * @typedef {Object} Page An object representing a GoatBots page to watch.
 * @property {string} path The pathname of the GoatBots page to watch.
 * @property {Card[]} cards The cards to scan for on the page.
 */

const GMObj =
  "GM" in window && typeof GM === "object" && typeof GM.getValue === "function";
// check if the script handler is GM4, since if it is, we can't add a menu command
const GM4 =
  GMObj &&
  GM.info.scriptHandler === "Greasemonkey" &&
  GM.info.version.split(".")[0] >= 4;
if (GM4) {
  GM_getValue = GM.getValue;
  GM_setValue = GM.setValue;
  GM_addStyle = GM.addStyle;
  GM_getResourceURL = GM.getResourceUrl;
  GM_registerMenuCommand = () => {};
  GM_unregisterMenuCommand = () => {};
  GM_addValueChangeListener = () => {};
}

class CardWatcher {
  config = {};

  requests = {};

  logger = {};

  LOG_LEVELS = {
    off: Number.MAX_VALUE,
    error: 5,
    warn: 4,
    info: 3,
    debug: 2,
    all: Number.MIN_VALUE,
  };

  shouldLog(level, maxLevel = this.config["Debug log level"]) {
    return this.LOG_LEVELS[maxLevel] <= this.LOG_LEVELS[level];
  }

  /**
   * Log a message to the console, if the user's log level is less than or equal
   * to the message's. The lower the level, the more important the message is.
   * By default, a level 0 message will be logged in the console, but a level 1
   * message will not. For debugging purposes you can increase your log level
   * setting to 4. That will capture all messages.
   * @param {string} [mode] the console method ("log" or "error" for example).
   * @param {any} message anything worth logging.
   */
  _log(mode = "debug", ...message) {
    if (this.shouldLog(mode)) {
      console[mode](...message);
    }
  }

  get yamlEnabled() {
    return this.config["Editor format"] === "yaml" && window.jsyaml;
  }

  /**
   * Parse a YAML or JSON string into a JS value.
   * @param {string} string The string to parse.
   * @param {string} [expectedType="array"] The expected parsed value type.
   * @returns {any} The parsed value.
   */
  fromString(string, expectedType = "array") {
    let parsed;
    if (window.jsyaml) {
      parsed = window.jsyaml.load(string, {
        json: true,
        onWarning: error => {
          this.logger.warn(
            "GoatBots Card Watcher: invalid cards value :>> ",
            error
          );
        },
      });
    } else {
      parsed = JSON.parse(string);
    }
    function throwTypeError() {
      throw new Error(
        `Expected ${expectedType}, but got ${typeof parsed}: ${parsed}`
      );
    }
    switch (expectedType) {
      case "array":
        if (!Array.isArray(parsed)) throwTypeError();
        break;
      case "integer":
        if (!Number.isInteger(parsed)) throwTypeError();
        break;
      default:
        // eslint-disable-next-line valid-typeof
        if (typeof parsed !== expectedType) throwTypeError();
        break;
    }
    return parsed;
  }

  /**
   * Convert a JS value into a YAML or JSON string (based on user settings).
   * @param {any} thing The value to convert.
   * @returns {string} The converted value.
   */
  toFormatString(thing) {
    if (this.yamlEnabled) {
      return window.jsyaml.dump(thing, {
        indent: 2,
        noRefs: true,
        noCompatMode: true,
      });
    }
    return JSON.stringify(thing, null, 2);
  }

  migrateSettings() {
    // Check for old watchlist format { path: string, cards: string[] }[]
    // The new format is { path: string, cards: object[] }[]
    // Just wipe it since we can't get the card ids from the old format.
    if (typeof GM_getValue("Watchlist")[0]?.cards[0] === "string") {
      GM_setValue("Watchlist", this.defaults.Watchlist);
    }
  }

  constructor() {
    // Add methods for all log levels.
    for (const level of Object.keys(this.LOG_LEVELS)) {
      if (["all", "off"].includes(level)) continue;
      this.logger[level] = (...args) => this._log(level, ...args);
    }
    // Maybe migrate old settings.
    this.migrateSettings();
    // Get the user settings or set them if they aren't already set.
    for (const [key, value] of Object.entries(this.defaults)) {
      const saved = GM_getValue(key);
      if (saved === undefined) {
        this.logger.debug(
          `GoatBots Card Watcher: writing setting ${key} :>> `,
          value
        );
        GM_setValue(key, value);
        this.config[key] = value;
      } else {
        this.config[key] = saved;
      }
      GM_addValueChangeListener(key, (...args) => this.onValueChange(...args));
    }
    // Add menu commands for auto-start delivery and pause watching.
    GM_registerMenuCommand(
      this.config["Automatically start delivery"]
        ? "Disable Automatic Delivery"
        : "Enable Automatic Delivery",
      () =>
        GM_setValue(
          "Automatically start delivery",
          !this.config["Automatically start delivery"]
        )
    );
    GM_registerMenuCommand(
      this.config["Pause watching"] ? "Resume Watching" : "Pause Watching",
      () => {
        GM_setValue("Pause watching", !this.config["Pause watching"]);
        if (this.config["Pause watching"] && this.cards?.length) {
          window.location.reload();
        }
      }
    );
    GM_registerMenuCommand("Advanced Settings", () => this.advancedDialog());
    // Add styles to highlight watched cards.
    GM_addStyle(this.css);
    // Check if the current page is not in the watchlist.
    const page = this.config.Watchlist.find(
      page => page.path === window.location.pathname
    );
    // Add a custom menu to the page DOM.
    document.addEventListener(
      "DOMContentLoaded",
      () => this.createMenu(!!page),
      { once: true }
    );
    if (this.config["Use text-to-speech"] && window.speechSynthesis) {
      this.voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
    // If we're on the delivery page...
    if (window.location.pathname === "/delivery") {
      // Check if we're here because we triggered delivery automatically...
      if (
        window.history.state?.autostart &&
        this.config["Automatically start delivery"]
      ) {
        this.logger.info(
          "GoatBots Card Watcher: Automatically started delivery"
        );
        const { previousURL } = window.history.state;
        // We use the history to store state between page loads. That way we can
        // avoid messing with the normal usage of GoatBots. When we auto-start
        // delivery, we mark the history with an autostart property and a
        // previousURL property. The previousURL property stores the URL we were
        // on when we triggered delivery. So it's for whichever page we were
        // watching when we added cards to cart and started delivery. We store
        // it so we can trigger delivery, let GoatBots go through the motions of
        // processing the delivery (which causes page loads), and then, when
        // delivery is finally finished, go back and resume scanning for cards.
        if (previousURL) {
          document.addEventListener("DOMContentLoaded", () => {
            // If #delivery-steps is present, then the delivery is in progress.
            // Which means we don't want to go back yet. The page will reload
            // when delivery finishes, so we'll reach this code again.
            // #delivery-count represents the number of items in cart. This is
            // supposed to take us back to the previous page when a delivery has
            // successfully finished. But sometimes a delivery might fail, in
            // which case we want to let the user handle it. If a delivery was
            // successful, our cart will be empty when the page reloads. So just
            // check that the cart is empty before proceeding.
            if (
              !document.getElementById("delivery-steps") &&
              !document.getElementById("delivery-count")?.textContent
            ) {
              window.location.href = previousURL;
            }
          });
        }
      }
      return;
    }
    // Add menu commands for editing watchlist.
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        if (this.pageCanBeWatched()) {
          GM_registerMenuCommand(
            page ? "Edit Cards List" : "Add Page to Watchlist",
            () => this.editCardListDialog()
          );
        }
      },
      { once: true }
    );
    if (!page) return;
    GM_registerMenuCommand("Remove Page from Watchlist", () =>
      this.removeFromWatchlist()
    );
    this.logger.info("GoatBots Card Watcher: watching the page");
    this.path = page.path;
    this.cards = page.cards;
    // If the page's cards list is empty for some reason, do nothing.
    if (!this.cards?.length) return;
    document.addEventListener("DOMContentLoaded", this, { once: true });
    // Construct the predefined audio files.
    this.voiceAudio = new Audio(
      `data:audio/mp3;base64,${this.audio["Voice audio file"]}`
    );
    this.alertAudio = new Audio(
      `data:audio/mp3;base64,${this.audio["Alert audio file"]}`
    );
  }

  /**
   * Send an XMLHttpRequest with given parameters to the GoatBots server.
   * Communicate with the server using the same AJAX syntax as GoatBots'
   * client-side code, but with some modifications to maintain control.
   * @param {string} [url] URL to send request to via XMLHttpRequest.
   * @param {FormData|Object} [data] Form data to send with request.
   * @param {function} [success] Callback to invoke on successful request load.
   * @param {function} [reject] Callback to invoke for unsuccessful response.
   * @param {boolean} [leaving] Will we leave the current page on success?
   * @param {boolean} [debug] Should we log info to console?
   */
  makeRequest({
    url,
    data,
    success,
    reject,
    leaving,
    debug = this.shouldLog("debug"),
  } = {}) {
    const key = leaving ? "leaving" : url;
    if (key in this.requests) {
      if (key === "leaving") {
        if (debug) {
          console.log(
            `GoatBots Card Watcher AJAX: blocking requests because ${key}`
          );
        }
        return;
      }
      this.requests[key].abort();
      delete this.requests[key];
      if (debug) {
        console.log(
          `GoatBots Card Watcher AJAX: aborting previous request ${key}`
        );
      }
    }
    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.timeout = 30000;
    request.onload = () => {
      if (debug) {
        console.log(
          `GoatBots Card Watcher AJAX: response status: ${request.status}`
        );
      }
      if (request.status === 403) {
        window.location.href = "/login";
      } else if (request.status === 200) {
        if (debug) {
          console.log(
            `GoatBots Card Watcher AJAX: response: ${request.response}`
          );
        }
        if (success) {
          if (debug) {
            console.log("GoatBots Card Watcher AJAX: calling success function");
          }
          success(request.response);
        }
        if (key in this.requests && key !== "leaving") {
          delete this.requests[key];
        }
      } else if (reject) {
        reject({ status: request.status, response: request.response });
      } else if (
        window.confirm("GoatBots Card Watcher hit a server error. Reload?")
      ) {
        window.location.reload();
      }
    };
    let form = new FormData();
    if (data) {
      if (Object.prototype.isPrototypeOf.call(FormData, data)) {
        form = data;
      } else {
        for (const el in data) {
          if (Object.hasOwn(data, el)) {
            form.append(el, data[el]);
          }
        }
      }
      if (debug) {
        console.log(`GoatBots Card Watcher AJAX: sending data: ${form}`);
      }
    } else if (debug) {
      console.log("GoatBots Card Watcher AJAX: sending no data");
    }
    request.send(form);
    this.requests[key] = request;
  }

  /** Invoked when the page finishes loading. Scan for new cards. */
  handleEvent() {
    this.logger.debug("GoatBots Card Watcher: loaded");
    const words = [];
    const cards = [];
    const pageType = window.location.pathname.split("/")[1];
    // Scan every card in the page's price lists.
    for (const pricelist of document.querySelectorAll(
      "#main .price-list:not(.redeemable-cards)"
    )) {
      for (const row of pricelist.children) {
        const id = row.dataset.item;
        const found = id && this.cards?.find(c => c.id === id);
        if (found) {
          row.toggleAttribute("watching", true);
          // Only handle the card if it's in stock.
          if (row.querySelector(".stock")?.classList.contains("out")) {
            continue;
          }
          this.logger.debug(
            `GoatBots Card Watcher: ${found.name} in stock`,
            found
          );
          let word;
          switch (pageType) {
            case "card": {
              if (!words.length) {
                words.push(
                  found.name ??
                    document
                      .querySelector("body > main > h1")
                      ?.innerText?.trim()
                );
              }
              let { set } = found;
              if (
                found.name.endsWith(" Redeemable Set") ||
                found.name.endsWith(" Booster")
              ) {
                set = "";
              }
              word = `${set ?? ""} ${found.frame ?? ""} ${
                found.alert ?? ""
              }`.trim();
              break;
            }
            case "set": {
              word = `${found.frame ?? ""} ${found.name ?? ""} ${
                found.alert ?? ""
              }`.trim();
              break;
            }
            default: {
              word = found.name;
              break;
            }
          }
          if (word) words.push(word);
          // If the card isn't already in our cart, add it.
          if (
            row
              .querySelector(".delivery")
              ?.firstElementChild?.classList.contains("delivery-count")
          ) {
            continue;
          }
          cards.push({ ...found, row });
        }
      }
    }
    if (this.config["Pause watching"]) {
      this.countdown();
      return;
    }
    // Check delivery status. If a delivery is in progress, adding cards to cart
    // or starting delivery would fail and cause repeated reloads.
    this.makeRequest({
      url: "/ajax/delivery-status",
      success: data => {
        data = JSON.parse(data);
        if (!data) {
          // If we found cards, start the alert process.
          if (words.length) {
            this.addToCart(cards);
            if (this.config["Use text-to-speech"] && window.speechSynthesis) {
              // Limit the length of the speech if user chose to.
              let limit = this.config["Limit number of card names to speak"];
              if (limit && typeof limit === "number") {
                if (pageType === "card") {
                  // Don't count the card name for the limit if on a card page.
                  limit += 1;
                }
                words.splice(limit);
              }
              this.playSynthAlert(words.join("; "));
            } else {
              this.playVoiceAlert();
            }
            return;
          }
        } else {
          this.logger.debug(
            "GoatBots Card Watcher: delivery active :>> ",
            data.text
          );
          this.logger.debug(
            "GoatBots Card Watcher: delivery hash :>> ",
            data.hash
          );
        }
        this.countdown();
      },
      reject: () => this.countdown(),
    });
  }

  /** Start the reload timer. */
  countdown() {
    this.logger.debug("GoatBots Card Watcher: waiting to reload");
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      // Check delivery status. We don't reload if a delivery is in progress.
      this.makeRequest({
        url: "/ajax/delivery-status",
        success: data => {
          data = JSON.parse(data);
          if (!data) {
            if (this.path === window.location.pathname) {
              // Don't reload if the dialog is open or if watching is paused. Also
              // don't reload if the tab is active unless the setting is enabled.
              if (
                document.querySelector(".card-watcher-dialog") ||
                this.config["Pause watching"] ||
                !(document.hidden || this.config["Refresh while active"])
              ) {
                this.countdown();
              } else {
                window.location.reload();
              }
            }
          } else {
            this.logger.debug(
              "GoatBots Card Watcher: delivery active :>> ",
              data.text
            );
            this.logger.debug(
              "GoatBots Card Watcher: delivery hash :>> ",
              data.hash
            );
            this.countdown();
          }
        },
        reject: () => this.countdown(),
      });
    }, this.config["Refresh interval"]);
  }

  /**
   * Add the passed items to the cart. When all of them are finished, try to
   * start delivery automatically. This relies on ajax requests and we can't add
   * multiple items in one request, so we need to iterate over the items, only
   * adding the next item when the current item finishes successfully.
   * @param {Card[]} [cards] An array containing all the items to add.
   * @param {number} [i] The current array index.
   */
  addToCart(cards = [], i = 0) {
    const card = cards[i];
    const row = card?.row;
    // If the current row is valid, add it to cart.
    if (card) {
      this.logger.debug(
        `GoatBots Card Watcher: adding ${
          card.wanted ? `${card.wanted}x ` : ""
        }${card.name} to cart`
      );
      const item = card.id || card?.row.dataset.item;
      if (item) {
        this.makeRequest({
          url: "/ajax/delivery-item",
          data: { item: row.dataset.item },
          abort: `item${row.dataset.item}`,
          success: rv => {
            if (card.wanted && card.wanted > 1) {
              // If the card has a wanted value less than the returned quantity,
              // we need to make the request again until the quantity in cart is
              // less than or equal to the wanted value set by the user.
              rv = JSON.parse(rv);
              if (rv !== null && typeof rv === "object") {
                if (
                  typeof rv.quantity === "number" &&
                  rv.quantity > card.wanted
                ) {
                  this.addToCart(cards, i);
                  return;
                }
              }
            }
            i += 1;
            this.addToCart(cards, i);
          },
        });
      } else {
        this.logger.error(
          `GoatBots Card Watcher: could not find item id for ${card.name}`
        );
        i += 1;
        this.addToCart(cards, i);
      }
    } else if (cards.length) {
      // If the row is undefined, that means either 1) the array was somehow
      // empty from the start, in which case we should do nothing; or 2) we got
      // to the end of the array, meaning we're finished adding items to cart.
      this.finishedAddingToCart = true;
      this.tryDelivery();
    }
  }

  /** Either start delivery or go to the delivery page. */
  tryDelivery() {
    // Only proceed if the speech/audio is finished (async) and we're finished
    // adding items to cart (iterative). This will be called multiple times and
    // only the last call will actually start delivery.
    if (this.finishedSpeaking && this.finishedAddingToCart) {
      if (this.config["Automatically start delivery"]) {
        // If the setting is enabled, start delivery automatically.
        this.makeRequest({
          url: "/ajax/delivery-start",
          leaving: true,
          success: () => {
            // If the delivery start request succeeds as it should, go the
            // delivery page and save the current URL with the history API so we
            // can recover it after the delivery is finished. That's necessary
            // because this CardWatcher instance will be flushed when the
            // document changes and replaced by a new instance with no memory of
            // the previous one or its triggering delivery. We want to be able
            // to distinguish between the *user* starting delivery manually and
            // the *script* starting delivery automatically. That way we don't
            // screw up the normal usage of GoatBots.
            window.history.pushState(
              { autostart: true, previousURL: window.location.href },
              "",
              "/delivery"
            );
            window.location.reload();
          },
          reject: () => {
            window.location.href = "/delivery";
          },
        });
        this.logger.info("GoatBots Card Watcher: starting delivery");
      } else {
        // Just go to the delivery page without starting delivery.
        window.location.href = "/delivery";
      }
    } else {
      this.logger.info(
        `GoatBots Card Watcher: waiting for ${
          this.finishedSpeaking
            ? "items to be added to cart"
            : "speech/audio to finish"
        }`
      );
    }
  }

  /**
   * Convert some text into audible speech.
   * @param {string} text The input text, e.g. card names.
   */
  playSynthAlert(text) {
    if (text) {
      this.logger.debug("GoatBots Card Watcher: speech synth startup");
      const speech = new SpeechSynthesisUtterance();
      this.voices = window.speechSynthesis.getVoices();
      speech.lang = "en-US";
      speech.text = text;
      speech.rate = this.config["Text-to-speech rate"];
      speech.volume = this.config["Alert volume"];
      // If speech synthesis isn't working, use the generic voice file.
      if (this.voices) {
        if (!window.speechSynthesis.speaking) {
          if (this.voices?.length > 0 && this.config["Text-to-speech voice"]) {
            const voice = this.voices.find(
              voice => voice?.voiceURI === this.config["Text-to-speech voice"]
            );
            if (voice) speech.voice = voice;
          }
          // Trigger delivery when the alert is finished. I'd prefer to do this
          // sooner but navigation ends the speech synthesis.
          speech.onend = () => {
            this.finishedSpeaking = true;
            this.tryDelivery();
            speech.onend = null;
          };
          this.logger.debug("GoatBots Card Watcher: speaking words :>> ", text);
          this.alertAudio.volume = this.config["Alert volume"];
          this.alertAudio.play();
          window.speechSynthesis.speak(speech);
        } else {
          this.logger.debug("GoatBots Card Watcher: speech synth busy");
        }
        return;
      }
    } else {
      this.logger.error(
        "GoatBots Card Watcher: speech synth sent invalid card names"
      );
    }
    this.playVoiceAlert();
  }

  /** Play a predefined audio alert. */
  playVoiceAlert() {
    this.alertAudio.volume = this.config["Alert volume"];
    this.voiceAudio.volume = this.config["Alert volume"];
    this.voiceAudio.onended = () => {
      // Trigger delivery when the alert is finished.
      this.finishedSpeaking = true;
      this.tryDelivery();
      this.voiceAudio.onended = null;
    };
    this.logger.debug("GoatBots Card Watcher: playing audio");
    this.alertAudio.play();
    this.voiceAudio.play();
  }

  /**
   * User setting change event handler. This is how we handle real-time update
   * of settings. When a setting changes, we hear about it and can respond
   * accordingly, changing values and labels and so on.
   * @param {string} id The name of the setting changed.
   * @param {any} oldValue The setting's previous value.
   * @param {any} newValue The setting's new value, after this value change.
   * @param {boolean} remote Whether the value was changed in an instance of the
   *   script running in another tab. If true, we don't need to reload the page.
   */
  onValueChange(id, oldValue, newValue, remote) {
    if (oldValue === newValue) return;
    this.logger.debug(
      `GoatBots Card Watcher: setting updated — ${id} :>> `,
      newValue
    );
    this.config[id] = newValue;
    const menu = document.getElementById("card-watcher-menu");
    switch (id) {
      case "Pause watching":
        if (menu) {
          const label = this.config["Pause watching"]
            ? "Resume Watching"
            : "Pause Watching";
          const item = menu.querySelector("a[href='#pause']");
          item.setAttribute("aria-label", label);
          item.textContent = label;
        } else {
          this.logger.warn("GoatBots Card Watcher: menu missing");
        }
        if (!remote && !newValue && oldValue && this.cards?.length) {
          window.location.reload();
        }
        GM_unregisterMenuCommand(
          oldValue ? "Resume Watching" : "Pause Watching"
        );
        GM_registerMenuCommand(
          newValue ? "Resume Watching" : "Pause Watching",
          () => {
            GM_setValue("Pause watching", !newValue);
          }
        );
        break;
      case "Automatically start delivery":
        if (menu) {
          const label = this.config["Automatically start delivery"]
            ? "Disable Automatic Delivery"
            : "Enable Automatic Delivery";
          const item = menu.querySelector("a[href='#autostart']");
          item.setAttribute("aria-label", label);
          item.textContent = label;
        } else {
          this.logger.warn("GoatBots Card Watcher: menu missing");
        }
        GM_unregisterMenuCommand(
          oldValue ? "Disable Automatic Delivery" : "Enable Automatic Delivery"
        );
        GM_registerMenuCommand(
          newValue ? "Disable Automatic Delivery" : "Enable Automatic Delivery",
          () => GM_setValue("Automatically start delivery", !newValue)
        );
        break;
      default:
        break;
    }
  }

  /** Whether this page is compatible with the script's core functions. */
  pageCanBeWatched() {
    const path = window.location.pathname.split("/");
    return (
      document.querySelector("#main .price-list:not(.redeemable-cards)") &&
      ["card", "set", "boosters"].includes(path[1]) &&
      !["treasure-chest-booster", "magic-online-player-reward-pack"].includes(
        path[2]
      )
    );
  }

  /**
   * For a given card row, return the card's rarity.
   * @param {Element} row The <li> element containing the card.
   * @returns {string|null} The rarity, e.g. "Common", or null if not found.
   */
  getRarity(row) {
    const rarityElm = row?.querySelector(".rarity");
    if (rarityElm) {
      switch (
        [...rarityElm.classList].find(c =>
          ["common", "uncommon", "rare", "mythic"].includes(c)
        )
      ) {
        case "common":
          return "Common";
        case "uncommon":
          return "Uncommon";
        case "rare":
          return "Rare";
        case "mythic":
          return "Mythic Rare";
        default:
      }
    }
    return null;
  }

  /**
   * For a given card row, return a Card object identifying the card.
   * @param {Element} row The <li> element containing the card.
   * @returns {Card|null} The card object, or null if not found.
   */
  getCardObject(row) {
    const id = row.dataset.item;
    if (!id) return null;
    /** @type {Card} */
    let item;
    const rowName = row.querySelector(".name").innerText?.trim() ?? "";
    const pageType = window.location.pathname.split("/")[1];
    const set = row
      .querySelector(".rarity use")
      ?.getAttribute("href")
      .match(/.svg#cardset-(.*)/)?.[1]
      ?.toUpperCase();
    const rarity = this.getRarity(row);
    switch (pageType) {
      case "card": {
        const name =
          document.querySelector("body > main > h1")?.innerText?.trim() ??
          "Unknown";
        item = { name, set };
        if (rowName && rowName !== name) {
          // If rowName and name both end with Redeemable Set, remove
          // "Redeemable Set" from rowName since it'll already be in the name.
          if (
            rowName.endsWith(" Redeemable Set") &&
            name.endsWith(" Redeemable Set")
          ) {
            item.frame = rowName.slice(0, -15);
          } else {
            item.frame = rowName?.split("(")[0]?.trim();
          }
        }
        if (rarity) item.rarity = rarity;
        item.wanted = -1;
        item.id = id;
        break;
      }
      case "set":
      default: {
        const section = row.parentElement.previousElementSibling;
        const sectionName =
          (section.classList.contains("next-frame") &&
            section?.innerText?.trim()) ||
          "";
        const cardType = document.getElementById("cardtype-input")?.placeholder;
        let frame = sectionName?.match(/(.*) Cards/)?.[1]?.trim() ?? "";
        let name = rowName;
        if (cardType && name?.startsWith(cardType)) {
          // we may need to remove Foil from the card name and add it to the
          // frame, e.g. cardType is "Foil" and rowName is "Foil Ragavan". If
          // card type is "Regular", the row name won't include it, so we don't
          // need to do anything.
          name = name.slice(cardType.length).trim();
          frame = `${cardType} ${frame}`.trim();
        }
        item = { name, set };
        if (frame) item.frame = frame;
        if (rarity) item.rarity = rarity;
        item.wanted = -1;
        item.id = id;
        break;
      }
    }
    return item;
  }

  /**
   * For a given string, return an array of Card objects.
   * @param {string} string The string to parse.
   * @param {boolean} log Whether to log errors.
   * @returns {Card[]} The cards parsed from the string.
   */
  getCardsFromString(string, log = true) {
    /** @type {Card[]} */
    let cards = [];
    try {
      cards = this.fromString(string);
    } catch (error) {
      if (log) {
        this.logger.warn(
          "GoatBots Card Watcher: invalid cards value :>> ",
          error
        );
      }
    }
    return cards;
  }

  /**
   * Try to find up to two random cards on the page to use as examples, e.g. for
   * the placeholder text in the card list editor. If no cards are found, return
   * one predefined example card.
   * @returns {Card[]} An array of example cards.
   */
  getExampleCards() {
    const exampleCards = [];
    const rows = [
      ...document.querySelectorAll(
        "#main .price-list:not(.redeemable-cards) li[data-item]"
      ),
    ];
    while (rows.length && exampleCards.length < 2) {
      const index = Math.floor(Math.random() * rows.length);
      const [row] = rows.splice(index, 1);
      const item = this.getCardObject(row);
      if (item) exampleCards.push(item);
    }
    if (!exampleCards.length) {
      /** @type {Card} */
      const fakeCard = {
        name: "Knight-Errant of Eos",
        set: "MOM",
        frame: "Extended Art",
        rarity: "Rare",
        wanted: -1,
        id: "A4zDSnxvnkroQw==",
      };
      exampleCards.push(fakeCard);
    }
    return exampleCards;
  }

  /** Open the card list editor dialog. */
  editCardListDialog() {
    if (document.querySelector(".card-watcher-dialog")) return;
    this.logger.debug("GoatBots Card Watcher: opening card list editor");
    const page = this.config.Watchlist.find(
      page => page.path === window.location.pathname
    );
    const { path, cards } = page ?? { path: window.location.pathname };

    const dialog = document.createElement("dialog");
    dialog.className = "card-watcher-dialog";
    dialog.id = "card-watcher-editor-dialog";

    // The DOM menu we created in the navbar. We want to highlight the menu when
    // the dialog is open, like the other GoatBots menus are highlighted.
    const menu = document.getElementById("card-watcher-menu");

    // Main text-based dialog.
    const title = dialog.appendChild(document.createElement("h3"));
    title.textContent = cards ? "Edit Cards List" : "Add Page to Watchlist";
    const form = dialog.appendChild(document.createElement("form"));
    form.setAttribute("method", "dialog");
    form.noValidate = true;

    const pathLabel = form.appendChild(document.createElement("label"));
    pathLabel.id = "card-watcher-path";
    const pathTitle = pathLabel.appendChild(document.createElement("span"));
    pathTitle.textContent = "Page path:";
    pathTitle.style.cursor = "help";
    pathTitle.title =
      "The path for the page you want to watch. This is everything after the domain. To avoid messing up your normal GoatBots use, add a plus + character to the end of the path. Then the script will only activate on the + version, which you can bookmark.";
    const pathField = document.createElement("input");
    pathField.type = "text";
    pathField.required = true;
    pathField.minLength = 2;
    pathField.pattern = "^/.*";
    pathField.placeholder = path;
    pathField.value = path;
    pathLabel.appendChild(pathField);

    const cardsLabel = form.appendChild(document.createElement("label"));
    cardsLabel.id = "card-watcher-cards-list";
    const cardsTitle = cardsLabel.appendChild(document.createElement("p"));
    cardsTitle.textContent = "Cards needed on page:";
    cardsTitle.style.cursor = "help";
    cardsTitle.title = `The cards you want to watch for on this page, in ${
      this.yamlEnabled ? "YAML" : "JSON"
    } format. You can use the "Select by Clicking" button below to select cards from the page and automatically add them to the list in the correct format. Any of the card values, such as the name, can be safely changed except for the ID. The ID is used to match cards on the page to the cards in the list, so changing it will prevent the script from finding the card. The other values are just so you can easily identify the card${
      this.config["Use text-to-speech"] && window.speechSynthesis
        ? " and so the script can read the card name and other details aloud when the card is found in stock"
        : ""
    }.`;
    const cardsField = cardsLabel.appendChild(
      document.createElement("textarea")
    );
    cardsField.required = true;
    cardsField.spellcheck = false;
    cardsField.placeholder = `Add cards to the list with the "Select by Clicking" button below. You can choose any name for the card.\n\n${this.toFormatString(
      this.getExampleCards()
    )}`;
    if (cards?.length) cardsField.value = this.toFormatString(cards);

    const buttonBox = form.appendChild(document.createElement("div"));
    buttonBox.className = "button-box";

    const saveBtn = buttonBox.appendChild(document.createElement("button"));
    saveBtn.setAttribute("mode", "list-save");
    saveBtn.textContent = "Save";

    const clickSelectBtn = buttonBox.appendChild(
      document.createElement("button")
    );
    clickSelectBtn.setAttribute("mode", "select");
    clickSelectBtn.textContent = "Select by Clicking";

    let removeBtn;
    if (page) {
      removeBtn = buttonBox.appendChild(document.createElement("button"));
      removeBtn.setAttribute("mode", "remove");
      removeBtn.textContent = "Remove Page";
    }

    const cancelBtn = buttonBox.appendChild(document.createElement("button"));
    cancelBtn.setAttribute("mode", "list-cancel");
    cancelBtn.textContent = "Cancel";

    // Click select dialog.
    const clickSelectTitle = dialog.appendChild(document.createElement("h3"));
    clickSelectTitle.style.display = "none";
    clickSelectTitle.textContent = "Select by Clicking";
    clickSelectTitle.style.cursor = "help";
    clickSelectTitle.title =
      "Click cards in the price list to add them to the cards list. Cards in the list are highlighted in green, and clicking them will remove them from the cards list.";
    const clickSelectForm = dialog.appendChild(document.createElement("form"));
    clickSelectForm.setAttribute("method", "dialog");
    clickSelectForm.noValidate = true;
    clickSelectForm.style.display = "none";

    const clickSelectButtonBox = clickSelectForm.appendChild(
      document.createElement("div")
    );
    clickSelectButtonBox.className = "button-box";
    const clickSelectConfirmBtn = clickSelectButtonBox.appendChild(
      document.createElement("button")
    );
    clickSelectConfirmBtn.setAttribute("mode", "select-confirm");
    clickSelectConfirmBtn.textContent = "Confirm";
    const clickSelectCancelBtn = clickSelectButtonBox.appendChild(
      document.createElement("button")
    );
    clickSelectCancelBtn.setAttribute("mode", "select-cancel");
    clickSelectCancelBtn.textContent = "Cancel";

    // Click handler for click-to-select mode.
    const clickSelect = e => {
      const row = e.target.closest("li");
      if (
        row &&
        row.className !== "header" &&
        row.dataset.item &&
        !row.parentElement.classList.contains("disabled")
      ) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.logger.debug(
          "GoatBots Card Watcher: card row selected by click :>> ",
          row
        );
        row.toggleAttribute("watching");
      }
    };

    // Escape keydown handler for click-to-select mode.
    const clickSelectEscape = e => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.logger.debug("GoatBots Card Watcher: escape key pressed :>> ", e);
        clickSelectForm.requestSubmit(clickSelectCancelBtn);
      }
    };

    // Main form submission handler.
    form.onsubmit = e => {
      e.preventDefault();
      this.logger.debug(
        "GoatBots Card Watcher: form submission :>> ",
        e.submitter.getAttribute("mode")
      );
      switch (e.submitter) {
        case saveBtn: {
          // Save the current values.
          const path = pathField.value.trim();
          const cardsValue = cardsField.value;
          const currentCards = this.getCardsFromString(cardsValue);
          // Check that the inputs are valid, and if not, dispatch a
          // notification to the user through generic web API. We could set
          // these values on the path field by default, but then the path field
          // would need to be valid even when clicking the other buttons. We
          // only care if it's valid when the user is clicking the save button.
          // And I don't want to use click handlers because there are other ways
          // to submit the form, like hitting Enter in an input field.
          pathField.title = `/${path}`;
          if (!currentCards.length) cardsField.value = "";
          if (!form.checkValidity()) {
            this.logger.error("GoatBots Card Watcher: invalid input");
            form.reportValidity();
            pathField.removeAttribute("title");
            cardsField.value = cardsValue;
            return;
          }
          pathField.removeAttribute("title");
          cardsField.value = cardsValue;
          if (page) {
            // If there was no change to the watchlist, don't bother with
            // updating user settings or reloading the page.
            if (
              page.path === path &&
              JSON.stringify(page.cards) === JSON.stringify(currentCards)
            ) {
              break;
            }
            page.path = path;
            page.cards = currentCards;
          } else {
            /** @type {Page} */
            const newPage = { path, cards: currentCards };
            this.config.Watchlist.push(newPage);
          }
          GM_setValue("Watchlist", this.config.Watchlist);
          // If the user modified the path field such that it no longer matches
          // the current page URL, navigate to the new path to begin watching.
          // Otherwise just reload, so we don't lose scroll position.
          if (window.location.pathname === path) window.location.reload();
          else window.location.href = path;
          return;
        }
        case clickSelectBtn: {
          // Handle selecting cards by click.
          const main = document.getElementById("main");
          main?.classList.add("click-select");
          main?.addEventListener("click", clickSelect, true);
          document.body?.addEventListener("keydown", clickSelectEscape);
          form.style.display = "none";
          title.style.display = "none";
          clickSelectForm.style.removeProperty("display");
          clickSelectTitle.style.removeProperty("display");
          const currentCards = this.getCardsFromString(cardsField.value);
          for (const pricelist of document.querySelectorAll(
            "#main .price-list"
          )) {
            if (pricelist.classList.contains("redeemable-cards")) {
              pricelist.classList.add("disabled");
              continue;
            }
            for (const row of pricelist.children) {
              const id = row.dataset.item;
              row.toggleAttribute(
                "watching",
                !!(id && currentCards?.find(c => c.id === id))
              );
            }
          }
          return;
        }
        case removeBtn: {
          // Remove the current page from the watchlist and reload.
          this.removeFromWatchlist();
          return;
        }
        case cancelBtn: {
          for (const pricelist of document.querySelectorAll(
            "#main .price-list:not(.redeemable-cards)"
          )) {
            for (const row of pricelist.children) {
              const id = row.dataset.item;
              row.toggleAttribute(
                "watching",
                !!(id && this.cards?.find(c => c.id === id))
              );
            }
          }
          break;
        }
        default:
          break;
      }
      // Exit the dialog without saving anything.
      dialog.style.display = "none";
      dialog.remove();
      // Un-highlight the menu node when we leave the dialog.
      menu?.firstElementChild?.classList.remove("active");
    };

    // Main form Escape key handler.
    form.onkeydown = e => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.logger.debug("GoatBots Card Watcher: escape key pressed :>> ", e);
        form.requestSubmit(cancelBtn);
      }
    };

    // Click-to-select form submission handler.
    clickSelectForm.onsubmit = e => {
      e.preventDefault();
      this.logger.debug(
        "GoatBots Card Watcher: form submission :>> ",
        e.submitter.getAttribute("mode")
      );
      switch (e.submitter) {
        case clickSelectConfirmBtn: {
          // Add the selected cards to the card list field
          const selectedCards = [];
          const currentCards = this.getCardsFromString(cardsField.value);
          for (const pricelist of document.querySelectorAll(
            "#main .price-list:not(.redeemable-cards)"
          )) {
            for (const row of pricelist.children) {
              if (row.className !== "header" && row.hasAttribute("watching")) {
                const id = row.dataset.item;
                if (!id) {
                  this.logger.error(
                    "GoatBots Card Watcher: missing data-item attribute :>> ",
                    row
                  );
                  row.removeAttribute("watching");
                  continue;
                }
                const card =
                  currentCards?.find(c => c.id === id) ||
                  this.getCardObject(row);
                selectedCards.push(card);
              }
            }
          }
          cardsField.value = selectedCards.length
            ? this.toFormatString(selectedCards)
            : "";
          break;
        }
        case clickSelectCancelBtn:
        // fall through
        default: {
          // Unmark the selected cards and don't add them to the list.
          const currentCards = this.getCardsFromString(cardsField.value);
          for (const pricelist of document.querySelectorAll(
            "#main .price-list:not(.redeemable-cards)"
          )) {
            for (const row of pricelist.children) {
              if (row.className === "header") continue;
              const id = row.dataset.item;
              row.toggleAttribute(
                "watching",
                !!(id && currentCards?.find(c => c.id === id))
              );
            }
          }
          break;
        }
      }
      const main = document.getElementById("main");
      main?.classList.remove("click-select");
      main?.removeEventListener("click", clickSelect, true);
      document.body?.removeEventListener("keydown", clickSelectEscape);
      clickSelectForm.style.display = "none";
      clickSelectTitle.style.display = "none";
      form.style.removeProperty("display");
      title.style.removeProperty("display");

      for (const pricelist of document.querySelectorAll("#main .price-list")) {
        pricelist.classList.remove("disabled");
      }

      cardsField.focus();
    };

    document.body.appendChild(dialog);
    // Highlight the menu node.
    menu?.firstElementChild?.classList.add("active");
    // Make sure the end of the path is selected so we can easily add the +
    // character to the end of the path.
    if (cards) {
      cardsField.focus();
    } else {
      pathField.focus();
      pathField.scrollTo({ left: pathField.scrollWidth });
    }
  }

  // Open the advanced settings dialog.
  advancedDialog() {
    if (document.querySelector(".card-watcher-dialog")) return;
    this.logger.debug(
      "GoatBots Card Watcher: opening advanced settings dialog"
    );

    const dialog = document.createElement("dialog");
    dialog.className = "card-watcher-dialog";
    dialog.id = "card-watcher-advanced-dialog";

    // The DOM menu we created in the navbar. We want to highlight the menu when
    // the dialog is open, like the other GoatBots menus are highlighted.
    const menu = document.getElementById("card-watcher-menu");

    // Main text-based dialog.
    const title = dialog.appendChild(document.createElement("h3"));
    title.textContent = "Advanced Settings";
    const form = dialog.appendChild(document.createElement("form"));
    form.setAttribute("method", "dialog");
    form.noValidate = true;

    const refreshIntervalLabel = form.appendChild(
      document.createElement("label")
    );
    refreshIntervalLabel.id = "card-watcher-refresh-interval";
    const refreshIntervalTitle = refreshIntervalLabel.appendChild(
      document.createElement("span")
    );
    refreshIntervalTitle.textContent = "Refresh interval:";
    refreshIntervalTitle.style.cursor = "help";
    refreshIntervalTitle.title =
      "How often to refresh the page to check stock, in milliseconds. This should be set to at least the average page load time. If it normally takes 2 seconds for the page to finish loading (as indicated by a loading icon in your browser, etc.), then you don't want to set this to less than 2000.";
    const refreshIntervalField = document.createElement("input");
    refreshIntervalField.type = "number";
    refreshIntervalField.required = true;
    refreshIntervalField.size = 1;
    refreshIntervalField.step = 1000;
    refreshIntervalField.min = 1000;
    refreshIntervalField.max = Number.MAX_SAFE_INTEGER;
    refreshIntervalField.placeholder = this.defaults["Refresh interval"];
    refreshIntervalField.value = this.config["Refresh interval"];
    refreshIntervalLabel.appendChild(refreshIntervalField);

    const activeRefreshLabel = form.appendChild(
      document.createElement("label")
    );
    activeRefreshLabel.id = "card-watcher-active-refresh";
    const activeRefreshTitle = activeRefreshLabel.appendChild(
      document.createElement("span")
    );
    activeRefreshTitle.textContent = "Refresh while active:";
    activeRefreshTitle.style.cursor = "help";
    activeRefreshTitle.title =
      "By default, the page will only refresh when the tab is in the background (i.e., you have a different tab focused). This way you can still use the page normally if you want to. But if you use windows instead of tabs, so that your GoatBots tab is always visible, you should check this box.";
    const activeRefreshField = document.createElement("input");
    activeRefreshField.type = "checkbox";
    activeRefreshField.checked = !!this.config["Refresh while active"];
    activeRefreshLabel.appendChild(activeRefreshField);

    const TTSLabel = form.appendChild(document.createElement("label"));
    TTSLabel.id = "card-watcher-use-tts";
    const TTSTitle = TTSLabel.appendChild(document.createElement("span"));
    TTSTitle.textContent = "Use text-to-speech:";
    TTSTitle.style.cursor = "help";
    TTSTitle.title =
      "By default, the alert will convert the names of the new cards to audible speech. You can disable text-to-speech by unchecking this box. In that case, it will use a fallback voice audio file.";
    const TTSField = document.createElement("input");
    TTSField.type = "checkbox";
    TTSField.checked = !!this.config["Use text-to-speech"];
    TTSLabel.appendChild(TTSField);

    const cardLimitLabel = form.appendChild(document.createElement("label"));
    cardLimitLabel.id = "card-watcher-card-limit";
    const cardLimitTitle = cardLimitLabel.appendChild(
      document.createElement("span")
    );
    cardLimitTitle.textContent = "Limit number of card names to speak:";
    cardLimitTitle.style.cursor = "help";
    cardLimitTitle.title =
      "If there are many cards to add to the cart, saying all their names out loud might be very slow. And we wait for speech to finish before starting delivery, since starting delivery will stop the speech. So if it has to say 10 names, that could mean 20-30 seconds before we initiate delivery. And that means someone else might initiate delivery on one of the desired items first. So this optional setting allows you to put a cap on the number of names spoken. If you set this to 0, then there is no limit. Any positive integer will set a proper limit. I personally set this to 3.";
    const cardLimitField = document.createElement("input");
    cardLimitField.type = "number";
    cardLimitField.required = true;
    cardLimitField.min = 0;
    cardLimitField.max = 100;
    cardLimitField.placeholder =
      this.defaults["Limit number of card names to speak"];
    cardLimitField.value = this.config["Limit number of card names to speak"];
    cardLimitLabel.appendChild(cardLimitField);

    const alertVolumeLabel = form.appendChild(document.createElement("label"));
    alertVolumeLabel.id = "card-watcher-alert-volume";
    alertVolumeLabel.setAttribute("for", "");
    const alertVolumeTitle = alertVolumeLabel.appendChild(
      document.createElement("span")
    );
    alertVolumeTitle.textContent = "Alert volume:";
    alertVolumeTitle.style.cursor = "help";
    alertVolumeTitle.title =
      "How loud should the alert be? This is a number between 0 and 1, where 0 is silent and 1 is the loudest. The default is 1.";
    alertVolumeTitle.className = "no-wrap";
    // use a range input and a number input so the user can type in a value if
    // they want, but also use the slider if they prefer.
    const alertVolumeGroup = document.createElement("div");
    alertVolumeGroup.id = "card-watcher-alert-volume-group";
    alertVolumeGroup.className = "inline-input-group no-wrap";
    const alertVolumeRangeLabel = alertVolumeGroup.appendChild(
      document.createElement("label")
    );
    const alertVolumeRange = document.createElement("input");
    alertVolumeRange.id = "card-watcher-alert-volume-range";
    alertVolumeRange.type = "range";
    alertVolumeRange.required = true;
    alertVolumeRange.min = 0.01;
    alertVolumeRange.max = 1;
    alertVolumeRange.step = 0.01;
    alertVolumeRange.value = this.config["Alert volume"];
    alertVolumeRangeLabel.appendChild(alertVolumeRange);
    const alertVolumeNumberLabel = alertVolumeGroup.appendChild(
      document.createElement("label")
    );
    const alertVolumeNumber = document.createElement("input");
    alertVolumeNumber.id = "card-watcher-alert-volume-number";
    alertVolumeNumber.type = "number";
    alertVolumeNumber.required = true;
    alertVolumeNumber.size = 4;
    alertVolumeNumber.min = 0.01;
    alertVolumeNumber.max = 1;
    alertVolumeNumber.step = 0.01;
    alertVolumeNumber.value = this.config["Alert volume"];
    alertVolumeNumberLabel.appendChild(alertVolumeNumber);
    // make sure the range and number inputs stay in sync
    alertVolumeRange.oninput = () => {
      // round to 2 decimal places
      alertVolumeNumber.value = Math.round(alertVolumeRange.value * 100) / 100;
    };
    alertVolumeNumber.oninput = () => {
      alertVolumeRange.value = alertVolumeNumber.value;
    };
    alertVolumeLabel.appendChild(alertVolumeGroup);

    const speechRateLabel = form.appendChild(document.createElement("label"));
    speechRateLabel.id = "card-watcher-speech-rate";
    const speechRateTitle = speechRateLabel.appendChild(
      document.createElement("span")
    );
    speechRateTitle.textContent = "Text-to-speech rate:";
    speechRateTitle.style.cursor = "help";
    speechRateTitle.title =
      "How fast should the speech play? The value can range between 0.1 (lowest) and 10 (highest), with 1 being the default pitch for the current platform or voice, which should correspond to a normal speaking rate. Other values act as a percentage relative to this, so for example 2 is twice as fast, 0.5 is half as fast, etc. I prefer 1.1 since the default voice on my computer (Windows 10) is kinda slow. Also, the script doesn't navigate to the delivery page until the voice alert has finished. So, a slower voice rate might mean a longer delay in starting delivery.";
    const speechRateField = document.createElement("input");
    speechRateField.type = "number";
    speechRateField.required = true;
    speechRateField.size = 1;
    speechRateField.step = "any";
    speechRateField.min = 0.1;
    speechRateField.max = 10;
    speechRateField.placeholder = 1;
    speechRateField.value = this.config["Text-to-speech rate"];
    speechRateLabel.appendChild(speechRateField);

    // Text-to-speech voice
    const speechVoiceLabel = form.appendChild(document.createElement("label"));
    speechVoiceLabel.id = "card-watcher-speech-voice";
    const speechVoiceTitle = speechVoiceLabel.appendChild(
      document.createElement("span")
    );
    speechVoiceTitle.textContent = "Text-to-speech voice:";
    speechVoiceTitle.style.cursor = "help";
    speechVoiceTitle.title =
      "Which voice to use for text-to-speech? This is a platform-dependent setting.";
    const speechVoiceField = document.createElement("select");
    const defaultSpeechVoiceOption = document.createElement("option");
    defaultSpeechVoiceOption.value = "";
    defaultSpeechVoiceOption.textContent = "System default";
    speechVoiceField.appendChild(defaultSpeechVoiceOption);
    const voices = this.voices || [];
    if (voices.length < 1) {
      speechVoiceField.disabled = true;
      speechVoiceField.style.cursor = "help";
      speechVoiceField.title =
        "No voices available. This could be because you are using a browser or OS that does not support the Web Speech API or because the API is disabled in your browser settings.";
      defaultSpeechVoiceOption.disabled = true;
      speechVoiceField.value = "";
    } else {
      for (const voice of voices) {
        const option = document.createElement("option");
        option.value = voice.voiceURI;
        option.textContent = voice.name;
        speechVoiceField.appendChild(option);
      }
      speechVoiceField.value = this.config["Text-to-speech voice"] || "";
    }
    speechVoiceLabel.appendChild(speechVoiceField);

    // Editor format (YAML or JSON)
    const currentFormat = this.config["Editor format"];
    const editorFormatLabel = form.appendChild(document.createElement("label"));
    editorFormatLabel.id = "card-watcher-editor-format";
    editorFormatLabel.setAttribute("for", "");
    const editorFormatTitle = editorFormatLabel.appendChild(
      document.createElement("span")
    );
    editorFormatTitle.textContent = "Editor format:";
    editorFormatTitle.style.cursor = "help";
    editorFormatTitle.title =
      "The format to use when editing the card list. YAML is the default, but you can use JSON instead if you prefer.";
    const editorFormatGroup = document.createElement("div");
    editorFormatGroup.id = "card-watcher-editor-format-group";
    editorFormatGroup.className = "inline-input-group";
    const editorFormatYAMLLabel = editorFormatGroup.appendChild(
      document.createElement("label")
    );
    const editorFormatYAML = document.createElement("input");
    editorFormatYAML.type = "radio";
    editorFormatYAML.name = "editor-format";
    editorFormatYAML.value = "yaml";
    editorFormatYAML.checked = currentFormat === "yaml";
    editorFormatYAMLLabel.appendChild(editorFormatYAML);
    editorFormatYAMLLabel.append("YAML");
    const editorFormatJSONLabel = editorFormatGroup.appendChild(
      document.createElement("label")
    );
    const editorFormatJSON = document.createElement("input");
    editorFormatJSON.type = "radio";
    editorFormatJSON.name = "editor-format";
    editorFormatJSON.value = "json";
    editorFormatJSON.checked = currentFormat === "json";
    editorFormatJSONLabel.appendChild(editorFormatJSON);
    editorFormatJSONLabel.append("JSON");
    editorFormatLabel.appendChild(editorFormatGroup);

    // Debug log level
    const logLevelLabel = form.appendChild(document.createElement("label"));
    logLevelLabel.id = "card-watcher-log-level";
    const logLevelTitle = logLevelLabel.appendChild(
      document.createElement("span")
    );
    logLevelTitle.textContent = "Debug log level:";
    logLevelTitle.style.cursor = "help";
    logLevelTitle.title =
      "An integer between 0 and 4. At the default level 0, we won't log anything to the console except for errors. At level 1, major debug messages will be logged. At level 2, less significant messages. And so on. The max value 4 will log everything. If you need my help troubleshooting something, set this to 4, try to reproduce the bug, and then copy the contents of your console and send it to me.";
    const logLevelField = document.createElement("select");
    for (const level of Object.keys(this.LOG_LEVELS)) {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      logLevelField.appendChild(option);
    }
    logLevelField.required = true;
    logLevelField.value = this.config["Debug log level"];
    logLevelLabel.appendChild(logLevelField);

    const buttonBox = form.appendChild(document.createElement("div"));
    buttonBox.className = "button-box";

    const saveBtn = buttonBox.appendChild(document.createElement("button"));
    saveBtn.setAttribute("mode", "advanced-save");
    saveBtn.textContent = "Save";

    const cancelBtn = buttonBox.appendChild(document.createElement("button"));
    cancelBtn.setAttribute("mode", "advanced-cancel");
    cancelBtn.textContent = "Cancel";

    // Main form submission handler.
    form.onsubmit = e => {
      e.preventDefault();
      this.logger.debug(
        "GoatBots Card Watcher: form submission :>> ",
        e.submitter.getAttribute("mode")
      );
      switch (e.submitter) {
        case saveBtn: {
          // Check that the user's inputs are all valid, and if not, dispatch a
          // notification to the user through generic web API.
          if (!form.checkValidity()) {
            this.logger.error("GoatBots Card Watcher: invalid input");
            form.reportValidity();
            return;
          }
          // Save the current values.
          GM_setValue(
            "Refresh interval",
            Number(refreshIntervalField.value.trim())
          );
          GM_setValue("Refresh while active", activeRefreshField.checked);
          GM_setValue("Use text-to-speech", TTSField.checked);
          GM_setValue(
            "Limit number of card names to speak",
            Number(cardLimitField.value.trim())
          );
          GM_setValue("Alert volume", Number(alertVolumeNumber.value.trim()));
          GM_setValue(
            "Text-to-speech rate",
            Number(speechRateField.value.trim())
          );
          GM_setValue("Text-to-speech voice", speechVoiceField.value);
          GM_setValue("Editor format", form.elements["editor-format"].value);
          GM_setValue("Debug log level", logLevelField.value);
          break;
        }
        case cancelBtn:
        // fall through
        default:
          break;
      }
      // Exit the dialog without saving anything.
      dialog.style.display = "none";
      dialog.remove();
      // Un-highlight the menu node when we leave the dialog.
      menu?.firstElementChild?.classList.remove("active");
    };

    // Escape keydown handler.
    form.onkeydown = e => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.logger.debug("GoatBots Card Watcher: escape key pressed :>> ", e);
        form.requestSubmit(cancelBtn);
      }
    };

    document.body.appendChild(dialog);
    // Highlight the menu node.
    menu?.firstElementChild?.classList.add("active");
    // Make sure the end of the path is selected so we can easily add the +
    // character to the end of the path.
    refreshIntervalField.focus();
    refreshIntervalField.scrollTo({ left: refreshIntervalField.scrollWidth });
  }

  /** Delete the current page from the watchlist. */
  removeFromWatchlist() {
    this.logger.debug("GoatBots Card Watcher: remove from watchlist?");
    const idx = this.config.Watchlist.findIndex(
      page => page.path === window.location.pathname
    );
    if (idx !== -1) {
      // Ask the user to confirm so they don't lose data.
      if (
        window.confirm(
          `Are you sure you want to remove ${window.location.pathname} from the watchlist?`
        )
      ) {
        this.logger.debug("GoatBots Card Watcher: yes, remove from watchlist");
        this.config.Watchlist.splice(idx, 1);
        GM_setValue("Watchlist", this.config.Watchlist);
        window.location.reload();
      }
    }
  }

  /**
   * Make a menu in the navbar with the same options as in the script manager.
   * @param {boolean} [handling] whether the current page is being watched.
   */
  createMenu(handling = false) {
    const nav = document.querySelector("nav");
    if (!nav || nav.querySelector("ul > li#card-watcher-menu")) return;
    this.logger.debug("GoatBots Card Watcher: creating the DOM menu");
    const ul = nav.querySelector("ul");
    const menu = ul.children[3].cloneNode(true);
    menu.id = "card-watcher-menu";
    const label = menu.firstElementChild;
    label.dataset.submenu = "cardwatcher";
    label.classList.remove("active");
    label.setAttribute("href", "#cardwatcher");
    label.setAttribute("aria-label", "Card Watcher menu");
    label.firstChild.textContent = "\nCard Watcher\n";
    const submenu = menu.lastElementChild;
    submenu.id = "submenu-cardwatcher";

    document.body.addEventListener("keydown", e => {
      if (e.code === "Enter") {
        const item = document
          .getElementById("card-watcher-menu")
          .querySelector("li.selected");
        if (item) {
          this.logger.debug(
            "GoatBots Card Watcher: overriding Enter key behavior for our menu items"
          );
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          item.firstElementChild.click();
        }
      }
    });

    const items = [];
    // for (let item of submenu.firstElementChild.children) items.push(item.firstElementChild);
    const submenuList = submenu.firstElementChild;
    for (let i = 0; i < 5; i++) {
      const li =
        submenuList.children[i] ?? submenuList.children[i - 1].cloneNode(true);
      items.push(li.firstElementChild);
    }

    if (this.pageCanBeWatched()) {
      const label0 = handling ? "Edit Cards List" : "Add Page to Watchlist";
      items[0].setAttribute("aria-label", label0);
      items[0].textContent = label0;
      items[0].setAttribute("href", "#cardlist");
      items[0].setAttribute("onclick", "return false");
      items[0].addEventListener("click", () => this.editCardListDialog());
    } else {
      items[0].parentElement.remove();
    }

    if (handling) {
      const label1 = "Remove Page from Watchlist";
      items[1].setAttribute("aria-label", label1);
      items[1].textContent = label1;
      items[1].setAttribute("href", "#remove");
      items[1].setAttribute("onclick", "return false");
      items[1].addEventListener("click", () => this.removeFromWatchlist());
    } else {
      items[1].parentElement.remove();
    }

    const label2 = this.config["Pause watching"]
      ? "Resume Watching"
      : "Pause Watching";
    items[2].setAttribute("aria-label", label2);
    items[2].textContent = label2;
    items[2].setAttribute("href", "#pause");
    items[2].setAttribute("onclick", "return false");
    items[2].addEventListener("click", () =>
      GM_setValue("Pause watching", !this.config["Pause watching"])
    );

    const label3 = this.config["Automatically start delivery"]
      ? "Disable Automatic Delivery"
      : "Enable Automatic Delivery";
    items[3].setAttribute("aria-label", label3);
    items[3].textContent = label3;
    items[3].setAttribute("href", "#autostart");
    items[3].setAttribute("onclick", "return false");
    items[3].addEventListener("click", () =>
      GM_setValue(
        "Automatically start delivery",
        !this.config["Automatically start delivery"]
      )
    );

    const label4 = "Advanced Settings";
    items[4].setAttribute("aria-label", label4);
    items[4].textContent = label4;
    items[4].setAttribute("href", "#advancedsettings");
    items[4].setAttribute("onclick", "return false");
    items[4].addEventListener("click", () => this.advancedDialog());

    // Remove all the other items from the cloned menu.
    items.slice(5).forEach(item => item.parentElement?.remove());

    ul.children[3].after(menu);
  }

  /* These are the default config values. There's some additional detail on the
   * settings in the code comments below. I don't recommend editing this
   * directly in the script, since your edits won't survive script updates.
   * Instead, the script uses the GM API to save your settings permanently. The
   * below data is just for initially generating your settings on install. */
  defaults = {
    /* This is the watchlist, where pages to watch and cards to scan for are
     * listed. Your Watchlist array can have any number of members. Each member
     * should be an object representing a GoatBots page to scan for cards on.
     * Therefore, each member should have a path property and a cards property.
     * The path property's value should be a valid GoatBots page pathname, and
     * the cards property's value should be an array of cards to scan for on
     * that page. Each card should be an object with at least a name property
     * and an id property. The name can be whatever you want, and will be spoken
     * aloud if the card is found. The id should be the GoatBots card ID, which
     * you can find in the DOM or by using the Select by Clicking button.
     *
     * For the path value, enter the GoatBots URL you want to watch into your
     * address bar. In this example, I want to watch the 2X2 promos page,
     * https://www.goatbots.com/set/promotional-march-of-the-machine+ I add + at
     * the end so I can use the page normally without it constantly refreshing
     * the page. So I visit that page and under the Card Watcher tab at the top,
     * I click "Add Page to Watchlist".
     *
     * Any GoatBots page with the usual row layout should work. For example, you
     * can add paths like /card/plains if you want to scan for a specific Plains
     * card that way. Or you can add a path like /boosters if you want to scan
     * for "Modern Horizons 2 Booster" - of course, these boosters are always in
     * stock, so that would be pointless. But you can add nearly any path.
     *
     * In the cards array, add the cards you want to get an alert for. These
     * need to be exact, so using the "Select by Clicking" button is highly
     * recommended. */

    /** @type {Page[]} */
    Watchlist: [
      /* This is just an example. We're watching the page for MOM promos, and
       * we're scanning *that particular page* with *that exact path* for all
       * the following cards. If you navigate to the MOM promos page as normal,
       * this won't activate, because that page doesn't have a + at the end of
       * the URL. If you add a + to the end of the URL, then it will start
       * watching the page. Moreover, if the script found the same cards on a
       * different page, it would do nothing. It's only searching for these
       * cards on this specific page with this exact path. So you can think of
       * each of these objects as a path-cards pair. You'd set this kind of
       * special path so you can still browse the site as normal, without the
       * script interrupting what you're doing. */
      {
        path: "/set/promotional-phyrexia-all-will-be-one+",
        cards: [
          {
            name: "Atraxa, Grand Unifier",
            set: "ONE",
            frame: "Showcase",
            rarity: "Mythic Rare",
            wanted: -1,
            id: "A4zDSnxvkUrgTA==",
          },
          {
            name: "Elesh Norn, Mother of Machines",
            set: "ONE",
            frame: "Phyrexian",
            rarity: "Mythic Rare",
            wanted: -1,
            id: "A4zDSnxvnk3mQw==",
          },
          {
            name: "Blackcleave Cliffs",
            set: "ONE",
            frame: "Borderless",
            rarity: "Rare",
            wanted: -1,
            id: "A4zDSnxvkUrjTw==",
          },
          {
            name: "The Mycosynth Gardens",
            set: "ONE",
            frame: "Extended Art",
            rarity: "Rare",
            wanted: -1,
            id: "A4zDSnxvkUrmTQ==",
          },
          {
            name: "Annex Sentry",
            set: "ONE",
            frame: "Regular Frame",
            rarity: "Rare",
            wanted: -1,
            id: "A4zDSnxvnk3mSg==",
          },
        ],
      },

      {
        path: "/card/lightning-bolt+",
        cards: [
          {
            name: "Lightning Bolt",
            set: "PRM",
            frame: "Textless",
            rarity: "Common",
            wanted: -1,
            id: "A4zDSnxslkToTg==",
          },
          {
            name: "Lightning Bolt",
            set: "STA",
            frame: "Showcase",
            rarity: "Rare",
            wanted: -1,
            id: "A4zDSnxukEXlSQ==",
          },
          {
            name: "Lightning Bolt",
            set: "PRM",
            frame: "Borderless",
            rarity: "Uncommon",
            wanted: -1,
            id: "A4zDSnxvlUzpTw==",
          },
          {
            name: "Lightning Bolt",
            set: "TD0",
            frame: "Regular",
            rarity: "Common",
            wanted: -1,
            id: "A4zDSnxslETlSA==",
          },
        ],
      },
    ],

    /* This is just used to define a user setting that we'll use to pause/resume
     * the script's normal watching and reloading behavior. */
    /** @type {boolean} */
    "Pause watching": false,

    /* When we detect new cards on the list, we automatically navigate to the
     * delivery page. But we can also automatically *start* delivery, making
     * this even faster. Otherwise you might miss an opportunity, if for example
     * you're working on something else when the alert goes off. This will allow
     * you to get the delivery started while you get ready. It takes a few
     * minutes for the delivery to be fulfilled, so there's plenty of time. The
     * thing you need to be quick about is actually clicking the "start
     * delivery" button. If you don't get to that fast enough, someone else will
     * do it first. And it seems to be a first-come, first-served system.
     * Whoever clicks that button first gets first priority, and anyone who
     * clicks it after will not get the card unless the first person fails to
     * complete the trade for whatever reason. So clicking the button as soon as
     * possible is good, as long as we can get to the MTGO window in time. If
     * you're going to use this feature, please don't use it irresponsibly. For
     * example, if you use this script while you're away from the computer, then
     * automatically starting deliveries that you're not present to complete
     * will be of no use to you, and it will just make it harder for everyone
     * else who's trying to buy the same cards and actually IS present.
     * Consequently, this setting is disabled by default. I don't want people to
     * be using it by accident, or using it without reading this, frankly. */
    /** @type {boolean} */
    "Automatically start delivery": false,

    /* How often to refresh the page to check stock, in milliseconds. This is
     * set to 10 seconds by default. This should be set to at least the average
     * page load time. If it normally takes 2 seconds for the page to finish
     * loading (as indicated by a loading icon in your browser, etc.), then you
     * don't want to set this to less than 2 seconds. */
    /** @type {number} */
    "Refresh interval": 10000,

    /* By default, the page will only refresh when the tab is in the background
     * (i.e., you have a different tab focused). This way you can still use the
     * page normally if you want to. But if you use windows instead of tabs, so
     * that your GoatBots tab is always visible, you should set this to true. */
    /** @type {boolean} */
    "Refresh while active": false,

    /* By default, the alert will convert the names of the new cards to audible
     * speech. You can disable text-to-speech by setting this to false. In that
     * case, it will use the fallback voice audio file defined at the bottom. */
    /** @type {boolean} */
    "Use text-to-speech": true,

    /* If there are many cards to add to the cart, saying all their names out
     * loud might be very slow. And we wait for speech to finish before starting
     * delivery, since starting delivery will stop the speech. So if it has to
     * say 10 names, that could mean 20-30 seconds before we initiate delivery.
     * And that means someone else might initiate delivery on one of the desired
     * items first. So this optional setting allows you to put a cap on the
     * number of names spoken. If this setting is falsy (that means any of
     * false, 0, "", null, undefined), then there is no limit. Any positive
     * integer will set a proper limit. I personally set this to 3. */
    /** @type {number} */
    "Limit number of card names to speak": 0,

    /* How loud should the alert be? This is a number between 0 and 1, where 0
     * is silent and 1 is the loudest. The default is 1. */
    /** @type {number} */
    "Alert volume": 1,

    /* How fast should the text-to-speech voice be? The value can range between
     * 0.1 (lowest) and 10 (highest), with 1 being the default pitch for the
     * current platform or voice, which should correspond to a normal speaking
     * rate. Other values act as a percentage relative to this, so for example 2
     * is twice as fast, 0.5 is half as fast, etc. I prefer 1.1 since the
     * default voice on my computer (Windows 10) is kinda slow. Also, the script
     * doesn't navigate to the delivery page until the voice alert has finished.
     * So, a slower voice rate might cause a delay in starting delivery. */
    /** @type {number} */
    "Text-to-speech rate": 1.1,

    /* Which text-to-speech voice to use. This is a URI reference to a voice on
     * your system. You can configure this setting in the Advanced Settings
     * dialog, and you can test the voices in your operating system's settings.
     * If you leave this blank, it will use your system's default voice. */
    /** @type {string|null} */
    "Text-to-speech voice": "",

    /* Which format the card list should be rendered with in the editor. Cards
     * are stored in GreaseMonkey's storage as JSON, and converted to JavaScript
     * objects during runtime. But the editor can display them in YAML, which is
     * easier to read and edit since it doesn't require quotes or commas and is
     * more compact. The editor will automatically convert the YAML back to JSON
     * when you save. This setting is just for convenience. If you don't like
     * YAML, you can set this to "json" instead. */
    /** @type {"yaml"|"json"} */
    "Editor format": "yaml",

    /* One of these values: [ "off", "error", "warn", "info", "debug", "all" ]
     * At the default, "off", we won't log anything to the console. At "error",
     * major errors will be logged. At "warn", less significant issues will be
     * logged as well. At "info", major events that are not errors will also be
     * logged. At "debug" and "all", everything will be logged. These values are
     * intended for me to use in development. If you need my help
     * troubleshooting something, set this to "all", try to reproduce the bug,
     * and then copy the contents of your devtools console and send it to me. */
    /** @type {"off"|"error"|"warn"|"info"|"debug"|"all"} */
    "Debug log level": "off",
  };

  css = /* css */ `
.price-list.disabled {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(100%);
}
.price-list > li[watching] > a {
  background: hsla(120, 100%, 75%, 0.15);
}
.price-list > li[watching]:nth-of-type(2n) > a,
.price-list > li.even[watching] > a {
  background: hsla(120, 100%, 80%, 0.22);
}
#main.click-select .price-list > li > a {
  cursor: default;
}
.card-watcher-dialog {
  display: block;
  position: fixed;
  z-index: 2147483646;
  top: 50%;
  left: calc(2% + 20px);
  right: auto;
  transform: translateY(-50%);
  background-color: hsla(0, 0%, 7.1%, 0.71);
  background-image: url("${GM_getResourceURL("texture")}");
  background-repeat: repeat;
  background-size: auto;
  background-attachment: local;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  border: 1px solid hsl(0, 0%, 33.3%);
  color: hsla(0, 0%, 97%, 0.95);
  max-width: -webkit-min-content;
  max-width: -moz-min-content;
  max-width: min-content;
  height: -webkit-min-content;
  height: -moz-min-content;
  height: min-content;
  padding: 10px;
  font-size: 0.9em;
  transition: 0.2s ease-in-out opacity;
}
.card-watcher-dialog form {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 0.8em;
}
.card-watcher-dialog :is(label, span, p, h3) {
  cursor: default;
  user-select: none;
  white-space: nowrap;
}
.card-watcher-dialog label > span:not(.no-wrap) {
  white-space: normal;
}
.card-watcher-dialog h3 {
  margin-block: 0 0.4em;
  text-align: center;
}
.card-watcher-dialog p {
  margin-block: 0;
}
.card-watcher-dialog input:is([type="text"], [type="number"]) {
  padding: 0.5em;
  flex-grow: 1;
}
.card-watcher-dialog input:is([type="range"], [type="checkbox"], [type="radio"]) {
  cursor: default;
}
.card-watcher-dialog textarea {
  min-width: 100%;
  min-height: 70px;
  width: 360px;
  height: 400px;
  padding: 0.5em;
  flex-grow: 1;
}
.card-watcher-dialog
  :is(#card-watcher-path, #card-watcher-cards-list)
  :is(input, textarea) {
  font-family: monospace;
  font-size: 0.9em;
}
.card-watcher-dialog :is(input, textarea)::placeholder {
  opacity: 0.54;
}
.card-watcher-dialog label {
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 1em;
  flex-flow: row nowrap;
}
.card-watcher-dialog #card-watcher-cards-list {
  width: 100%;
  display: flex;
  row-gap: 0.4em;
  flex-flow: column nowrap;
  align-items: revert;
}
.card-watcher-dialog input:is([type="checkbox"], [type="radio"]),
.card-watcher-dialog input:is([type="checkbox"], [type="radio"]):checked {
  width: 0.5em;
  height: 0.5em;
  box-sizing: content-box;
  padding: 0.5em;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.card-watcher-dialog input[type="checkbox"]:checked {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>');
}
.card-watcher-dialog input[type="radio"]:checked {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><circle cx="12" cy="12" r="8" fill="white"/></svg>');
  border-color: transparent;
}
.card-watcher-dialog select {
  padding-inline-end: 1.5em;
  min-width: 0;
  background-position-x: calc(100% - 0.6em);
  flex-grow: 1;
  flex-shrink: 1;
  text-overflow: ellipsis;
  cursor: default;
}
.card-watcher-dialog select:disabled {
  opacity: 0.4;
}
.card-watcher-dialog .button-box {
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  flex-grow: 1;
  gap: 0.6em;
  min-width: 250px;
  width: 100%;
}
.card-watcher-dialog .button-box button {
  white-space: nowrap;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 20%;
}
.card-watcher-dialog .button-box > [disabled] {
  pointer-events: none;
  opacity: 0.4;
}
.card-watcher-dialog input[type="range"]:is(:hover, :focus) {
	border: 1px solid #df652a;
	box-shadow: 0 0 10px 2px #df652a88;
}
.card-watcher-dialog input[type=range]::-moz-range-thumb {
  border: 1px solid transparent;
  box-sizing: border-box;
  transition: border .2s ease-out,box-shadow .2s ease-out;
}
.card-watcher-dialog input[type=range]::-moz-range-thumb:is(:hover, :active, :focus) {
  border-color: #df652a;
  box-shadow:0 0 10px 2px #df652a;
}
.card-watcher-dialog .inline-input-group {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-flow: row wrap;
  flex-grow: 1;
  gap: 0.6em;
}
.card-watcher-dialog .inline-input-group.no-wrap {
  flex-wrap: nowrap;
}
.card-watcher-dialog .inline-input-group > label {
  width: unset;
}
.card-watcher-dialog .inline-input-group > label > input[type="range"] {
  width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
}
.card-watcher-dialog #card-watcher-card-limit > input {
  width: auto;
  min-width: 50px;
}
.card-watcher-dialog #card-watcher-speech-voice > select {
  width: 100%;
}
.card-watcher-dialog input[type="number"] {
  -moz-appearance: textfield;
}
.card-watcher-dialog input[type="number"]::-webkit-inner-spin-button,
.card-watcher-dialog input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.card-watcher-menu > a {
  white-space: nowrap;
}
#menu-wrap {
  max-width: 95em !important;
}
@media only screen and (max-width: 1399px) {
  #menu,
  #menu-wrap {
    max-width: 82.5rem !important;
  }
}
`;

  audio = {
    /* The audio file to use if text-to-speech is disabled or unavailable. This
     * must be an mp3 file converted to a base64 file using this tool:
     * https://codepen.io/xewl/pen/NjyRJx
     * By default, it says "new cards available" in a male English voice.
     * Make sure the string is wrapped in backticks `like this` */
    "Voice audio file":
      "SUQzAwAAAAAfdlRFTkMAAAATAAAB//5MAGEAbQBlACAATQBQADMAVExBTgAAABcAAAH//lUAUwAgAEUAbgBnAGwAaQBzAGgAVEFMQgAAAD0AAAH//kMAcgBlAGEAdABlAGQAOgAgADcALwA2AC8AMgAwADIAMgAgADEAMAA6ADEANAA6ADEANAAgAFAATQBUUEUxAAAAMQAAAf/+VABlAHgAdABBAGwAbwB1AGQAOgAgAEkAVgBPAE4AQQAgAEoAbwBlAHkAMgAyAENPTU0AAAAyAAABZW5nAAD//mgAdAB0AHAAOgAvAC8AdwB3AHcALgBuAGUAeAB0AHUAcAAuAGMAbwBtAFRDT04AAAAPAAAB//5TAHAAZQBlAGMAaABUSVQyAAAAGwAAAf/+NgA2ADkAMAAzADMAOAAwAC4AbQBwADMAVFlFUgAAAAsAAAH//jIAMAAyADIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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",

    /* A ding sound for the alert. This file is played at the beginning of the
     * voice alert just to make it louder and fancier. */
    "Alert audio file":
      "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AAAICIAI+AAAAQAAAf4AAAAgB4AjwAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/0kxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sQROOPMAAAf4AAAAgHQBjlAAAAAAAB/gAAACAQACQUAAAGqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/RTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBE3o/wAAB/gAAACAAAD/AAAAEAAAH+AAAAIAeAJEAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EETgh3AFAMcAAAAIAAAP8AAAAQBEASCgAAAgDIAkFAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQROAP8AAAf4AAAAgCoAjQAAABAAAB/gAAACAHgCPAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBE34/wAAB/gAAACAHgCOAAAAEAAAH+AAAAIAeAI4AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EETej/AAAH+AAAAIAeAI8AAAAQAAAf4AAAAgAAA/wAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQRN6P8AAAf4AAAAgB4AjwAAABAAAB/gAAACAAAD/AAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBE3o/wAAB/gAAACAHgCPAAAAEAAAH+AAAAIAAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAH+AAAAIAAAP8AAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  };
}

const cardWatcher = new CardWatcher();

try {
  unsafeWindow.goatBotsCardWatcher = cardWatcher;
} catch (error) {
  try {
    window.goatBotsCardWatcher = cardWatcher;
  } catch (error) {
    console.error("Could not attach card watcher to window");
  }
}
