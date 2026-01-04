// ==UserScript==
// @name     Twitch Chat Sound Enchantment
// @description Play sound, when there are new messages on your Twitch channel
// @namespace https://rubyclarity.com
// @version  1
// @supportURL https://github.com/ledestin/twitch-chat-sound-enchantment/issues
// @author Dmitry Maksyoma (https://twitter.com/oledestin)
// @grant    none
// @require https://cdn.jsdelivr.net/npm/cookies-js@1.2.3/dist/cookies.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @include      http*://www.twitch.tv/*
//
// "Bell, Candle Damper, A (H1)" by InspectorJ (www.jshaw.co.uk) of
// Freesound.org.
// @downloadURL https://update.greasyfork.org/scripts/413789/Twitch%20Chat%20Sound%20Enchantment.user.js
// @updateURL https://update.greasyfork.org/scripts/413789/Twitch%20Chat%20Sound%20Enchantment.meta.js
// ==/UserScript==

const debugFlag = true;

const noop = function noop(..._args) {};
const logger = {
  debug: debugFlag ? console.log : noop,
  info: console.log,
};

/* globals _ */

class ChatWatcher {
  static processedMessageClass = "chat-sound-enchantment-processed"
  static newMessageSelector = `.chat-line__message:not(.${ChatWatcher.processedMessageClass})`
  static bellSoundUrl =
    "https://raw.githubusercontent.com/ledestin/twitch-chat-sound-enchantment/main/sounds/bell-candle-damper.mp3"
  static soundDelay = 3000

  constructor(twitch) {
    this.twitch = twitch;
    this.debouncedPlayBell = _.debounce(this.playBell, ChatWatcher.soundDelay, {
      leading: true,
      trailing: true,
    });
    this.bell = new Audio(ChatWatcher.bellSoundUrl);
  }

  watchChatAndPlayBellOnNewMessages() {
    if (!this.twitch.isOnMyChannel()) return

    const newMessages = this.fetchNewMessages();
    if (newMessages.length === 0) return

    this.markNewMessagesAsProcessed(newMessages);
    logger.debug(`${newMessages.length} new message(s) found`);
    this.debouncedPlayBell();
  }

  // private

  fetchNewMessages() {
    return document.querySelectorAll(ChatWatcher.newMessageSelector)
  }

  markNewMessagesAsProcessed(newMessages) {
    newMessages.forEach((message) => {
      message.classList.add(ChatWatcher.processedMessageClass);
    });
  }

  playBell = () => {
    this.bell.play();
  }
}

/* globals Cookies */

class Twitch {
  constructor() {
    this.currentUser = this.fetchCurrentUser();
  }

  isLoggedIn() {
    return this.currentUser !== null
  }

  isOnMyChannel() {
    return this.myChannelUrl() === window.location.href
  }

  // private

  myChannelUrl() {
    return `https://www.twitch.tv/${this.currentUser}`
  }

  fetchCurrentUser() {
    const twitchUserCookie = Cookies.get("twilight-user");

    if (!twitchUserCookie) {
      logger.info("couldn't detect Twitch user, please login first");
      return
    }

    try {
      const { login } = JSON.parse(twitchUserCookie);
      return login
    } catch {
      logger.info("failed to parse Twitch cookie");
      return
    }
  }
}

/* global GM */
const chatPollDelay = 1000;

const twitch = new Twitch();

function main() {
  if (!twitch.isLoggedIn()) return

  logger.debug("Setting up %s", GM.info.script.name);
  setupChatPolling();
}

function setupChatPolling() {
  const watcher = new ChatWatcher(twitch);
  setInterval(() => watcher.watchChatAndPlayBellOnNewMessages(), chatPollDelay);
}

main();
