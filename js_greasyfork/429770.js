// ==UserScript==
// @name         Discord Conceals Filenames
// @description  Replace the names of files you upload to Discord.
// @version      1
// @grant        none
// @match        https://discord.com/*
// @author       piousdeer
// @namespace https://greasyfork.org/users/749016
// @downloadURL https://update.greasyfork.org/scripts/429770/Discord%20Conceals%20Filenames.user.js
// @updateURL https://update.greasyfork.org/scripts/429770/Discord%20Conceals%20Filenames.meta.js
// ==/UserScript==

// Which string to replace filename with.
const REPLACE_WITH = "unknown";
// Set to "whitelist" to only affect files with selected extensions, "blacklist" to affect all files but those ones.
const MODE = "blocklist";
// E.g. ["mp4", "gif"] will make the script ignore these files in blacklist mode.
const EXTENSIONS = [];

const _getFilename = Object.getOwnPropertyDescriptor(File.prototype, "name").get;

Object.defineProperty(File.prototype, "name", {
  get() {
    const filename = _getFilename.call(this);
    const extension = filename.split(".").slice(-1)[0];
    const isListed = EXTENSIONS.includes(extension);

    if (
      (MODE === "blacklist" && isListed) ||
      (MODE === "whitelist" && !isListed)
    ) {
      return filename;
    }

    return [REPLACE_WITH, extension].join(".");
  },
});
