// ==UserScript==
//
// @name        RickRoll
// @copyright   Victor Moraes, 2024
// @namespace   moraesvic
// @license     MIT
// @version     0.0.1
// @description This script transforms every webpage in a big Rick Roll.
// @author      Victor Moraes
// @homepage    https://moraesvic.com
// @match       *://*/*
// @run-at      document-body
//
// @downloadURL https://update.greasyfork.org/scripts/507713/RickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/507713/RickRoll.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const RICK_ROLL_YOUTUBE_VIDEO = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const RICK_ROLL_SLUG = "dQw4w9WgXcQ";

  const HOST = "https://d11dofpay2k0pk.cloudfront.net";
  const N_IMAGES = 53;

  const LYRICS_CUTOFF = 20;

  const LYRICS = [
    "A full commitment's what I'm thinking of",
    "And if you ask me how I'm feeling",
    "Don't tell me you're too blind to see",
    "Gotta make you understand",
    "I just wanna tell you how I'm feeling",
    "Inside, we both know what's been going on (going on)",
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna make you cry",
    "Never gonna run around and desert you",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
    "We know the game and we're gonna play it",
    "We're no strangers to love",
    "We've known each other for so long",
    "You know the rules and so do I (do I)",
    "You wouldn't get this from any other guy",
    "Your heart's been aching, but you're too shy to say it (say it)",
    "Your heart's been aching, but you're too shy to say it (to say it)",
  ];

  const getWordsFromLyrics = (function () {
    const regex = /(\(|\)|,)/g;
    const allLyrics = LYRICS.join(" ").toLowerCase().replace(regex, "");
    const lyricsLength = allLyrics.split(" ").length;
    const repeatedLyrics = (allLyrics + " " + allLyrics).split(" ");

    const _getWordsFromLyrics = (length) => {
      let s = [];
      let i = Math.floor(Math.random() * lyricsLength);

      while (s.join(" ").length < length) {
        s.push(repeatedLyrics[i++]);
      }

      return s.join(" ");
    };

    return _getWordsFromLyrics;
  })();

  const ENABLE_LOGGING = false;
  const MODIFY_IMAGES = true;
  const MODIFY_VIDEOS = true;
  const MODIFY_TEXT = true;
  const MODIFY_HYPERLINKS = true;
  const MODIFY_BACKGROUND_IMAGES = true;

  const log = (...args) =>
    ENABLE_LOGGING && console.debug(`[rick-roll]`, ...args);

  const getImageURL = () => {
    const i = 1 + Math.floor(Math.random() * N_IMAGES);
    return `${HOST}/${i.toString().padStart(2, "0")}.png`;
  };

  const getVideoURL = () => {
    return `${HOST}/RickRoll.webm`;
  };

  const getLineFromLyrics = () => {
    const i = Math.floor(Math.random() * LYRICS.length);
    return LYRICS[i];
  };

  const $$ = (x) => Array.from(document.querySelectorAll(x));

  const modifyTitle = () => {
    if (!LYRICS.includes(document.title)) {
      document.title = getLineFromLyrics();
    }
  };

  const modifyImages = () => {
    if (!MODIFY_IMAGES) {
      log(`Skipping image modification.`);
    }

    log(`Modifying images.`);

    const imgs = $$("img");

    log(`Found ${imgs.length} new images.`);

    imgs.forEach((x) => {
      if (x.src.startsWith(HOST)) {
        return;
      }

      x.style = `max-width: ${x.naturalWidth}px; max-height: ${x.naturalHeight}px;`;
      const url = getImageURL();
      x.src = url;
      x.srcset = "";
    });
  };

  const _isRickRollPage = () => window.location.href.includes(RICK_ROLL_SLUG);

  const _isVideoPlaying = (video) =>
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2;

  const modifyVideos = () => {
    if (!MODIFY_VIDEOS) {
      log(`Skipping video modification.`);
    }

    log(`Modifying videos.`);

    if (_isRickRollPage()) {
      log(`This is already the Rick Roll page, returning.`);
    }

    const videoURL = getVideoURL();
    const videos = $$("video").filter((x) => x.src !== videoURL);
    log(`Found ${videos.length} videos.`);

    videos.forEach((x) => {
      const url = getVideoURL();
      x.src = url;
    });
  };

  const _isOnlyNumbers = (s) => s.match(/^[-\d\s]*$/) !== null;
  const _getPrefixingWhitespace = (s) => s.match(/^(\s+)\S*$/)?.[1] ?? "";
  const _getSuffixingWhitespace = (s) => s.match(/^\S*(\s+)$/)?.[1] ?? "";

  const _modifyText = (firstRun = false) => {
    if (!MODIFY_TEXT) {
      log(`Skipping text modification.`);
    }

    log(`Processing text.`);

    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (w.nextNode()) {
      if (w.currentNode.textContent.trim() === "") {
        continue;
      }

      const parentTag = w.currentNode.parentNode.nodeName.toLowerCase();
      if (
        [
          "script",
          "style",
          "noscript",
          "iframe",
          "img",
          "input",
          "textarea",
        ].includes(parentTag)
      ) {
        continue;
      }

      if (LYRICS.includes(w.currentNode.textContent)) {
        continue;
      }

      nodes.push(w.currentNode);
    }

    log(`Found ${nodes.length} text nodes.`);

    nodes.forEach((node) => {
      const textContent = node.textContent;

      if (_isOnlyNumbers(textContent)) {
        return;
      }

      const prefixingWhiteSpace = _getPrefixingWhitespace(textContent);
      const suffixingWhiteSpace = _getSuffixingWhitespace(textContent);

      let newTextContent;
      if (textContent.length < LYRICS_CUTOFF) {
        if (firstRun) {
          newTextContent =
            prefixingWhiteSpace +
            getWordsFromLyrics(textContent.length) +
            suffixingWhiteSpace;
        } else {
          newTextContent = textContent;
        }
      } else {
        newTextContent =
          prefixingWhiteSpace + getLineFromLyrics() + suffixingWhiteSpace;
      }

      node.textContent = newTextContent;
    });
  };

  const modifyTextFirstRun = () => _modifyText(true);
  const modifyTextLaterRun = () => _modifyText(false);

  const modifyLinks = () => {
    if (!MODIFY_HYPERLINKS) {
      log(`Skipping hyperlink modification.`);
    }

    log(`Modifying hyperlinks`);

    const links = $$("a");
    log(`Found ${links.length} hyperlinks.`);

    links.forEach((link) => {
      link.href = RICK_ROLL_YOUTUBE_VIDEO;
    });
  };

  const modifyBackgroundImages = () => {
    if (!MODIFY_BACKGROUND_IMAGES) {
      log(`Skipping background image modification.`);
    }

    log(`Modifying background images.`);

    Array.from($$("*"))
      .filter((x) => {
        const backgroundImage = window
          .getComputedStyle(x, null)
          .getPropertyValue("background-image");

        return backgroundImage !== "none" && !backgroundImage.includes(HOST);
      })
      .forEach((x) =>
        x.style.setProperty("background-image", `url("${getImageURL()}")`)
      );
  };

  const main = () => {
    log("Loaded.");

    log(`Starting loader...`);

    const div = document.createElement("div");
    div.id = "rick-roll-loader";
    div.style = `
	    position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index:
		99999;
		background: white;
	  `;
    document.body.insertAdjacentElement("beforeend", div);

    window.addEventListener("load", () => {
      modifyTitle();
      modifyImages();
      modifyVideos();
      modifyTextFirstRun();
      modifyLinks();
      modifyBackgroundImages();

      setTimeout(() => {
        log(`Initial routine finished. Removing loader...`);
        document.querySelector("#rick-roll-loader").remove();
      }, 500);
    });
    document.addEventListener("scroll", () => {
      modifyImages();
      modifyVideos();
      modifyTextLaterRun();
      modifyLinks();
      modifyBackgroundImages();
    });
    setInterval(() => {
      modifyImages();
      modifyVideos();
      modifyTextLaterRun();
      modifyLinks();
      modifyBackgroundImages();
    }, 2000);
    setInterval(() => {
      const video = document.querySelector("video[tabindex='-1']");
      if (video !== null && !_isVideoPlaying(video)) {
        video.click();
      }
    }, 500);
  };

  main();
})();