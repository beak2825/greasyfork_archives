// ==UserScript==
// @name         GitHub Changesets
// @version      0.2.0
// @description  Improve the Changesets experience in GitHub PRs
// @license      MIT
// @author       Bjorn Lu
// @homepageURL  https://github.com/bluwy/github-changesets-userscript
// @supportURL   https://github.com/bluwy/github-changesets-userscript/issues
// @namespace    https://greasyfork.org/en/scripts/521590-github-changesets
// @match        https://github.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521590/GitHub%20Changesets.user.js
// @updateURL https://update.greasyfork.org/scripts/521590/GitHub%20Changesets.meta.js
// ==/UserScript==

// Options
const shouldRemoveChangesetBotComment = true
const shouldSkipCache = false

"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/human-id/dist/index.js
  var require_dist = __commonJS({
    "node_modules/human-id/dist/index.js"(exports) {
      "use strict";
      var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.minLength = exports.maxLength = exports.poolSize = exports.humanId = exports.adverbs = exports.verbs = exports.nouns = exports.adjectives = void 0;
      exports.adjectives = ["afraid", "all", "beige", "better", "big", "blue", "bold", "brave", "breezy", "bright", "brown", "bumpy", "busy", "calm", "chatty", "chilly", "chubby", "clean", "clear", "clever", "cold", "common", "cool", "cozy", "crisp", "cuddly", "curly", "curvy", "cute", "cyan", "dark", "deep", "dirty", "dry", "dull", "eager", "early", "easy", "eight", "eighty", "eleven", "empty", "every", "fair", "famous", "fancy", "fast", "few", "fiery", "fifty", "fine", "five", "flat", "floppy", "fluffy", "forty", "four", "frank", "free", "fresh", "fruity", "full", "funky", "funny", "fuzzy", "gentle", "giant", "gold", "good", "goofy", "great", "green", "grumpy", "happy", "heavy", "hip", "honest", "hot", "huge", "humble", "hungry", "icy", "itchy", "jolly", "khaki", "kind", "large", "late", "lazy", "legal", "lemon", "light", "little", "long", "loose", "loud", "lovely", "lucky", "major", "many", "metal", "mighty", "modern", "moody", "neat", "new", "nice", "nine", "ninety", "odd", "old", "olive", "open", "orange", "perky", "petite", "pink", "plain", "plenty", "polite", "pretty", "proud", "public", "puny", "purple", "quick", "quiet", "rare", "ready", "real", "red", "rich", "ripe", "salty", "seven", "shaggy", "shaky", "sharp", "shiny", "short", "shy", "silent", "silly", "silver", "six", "sixty", "slick", "slimy", "slow", "small", "smart", "smooth", "social", "soft", "solid", "some", "sour", "sparkly", "spicy", "spotty", "stale", "strict", "strong", "sunny", "sweet", "swift", "tall", "tame", "tangy", "tasty", "ten", "tender", "thick", "thin", "thirty", "three", "tidy", "tiny", "tired", "tough", "tricky", "true", "twelve", "twenty", "two", "upset", "vast", "violet", "wacky", "warm", "wet", "whole", "wicked", "wide", "wild", "wise", "witty", "yellow", "young", "yummy"];
      exports.nouns = [
        "actors",
        "ads",
        "adults",
        "aliens",
        "animals",
        "ants",
        "apes",
        "apples",
        "areas",
        "baboons",
        "badgers",
        "bags",
        "balloons",
        "bananas",
        "banks",
        "bars",
        "baths",
        "bats",
        "beans",
        "bears",
        "beds",
        "beers",
        "bees",
        "berries",
        "bikes",
        "birds",
        "boats",
        "bobcats",
        "books",
        "bottles",
        "boxes",
        "breads",
        "brooms",
        "buckets",
        "bugs",
        "buses",
        "bushes",
        "buttons",
        "camels",
        "cameras",
        "candies",
        "candles",
        "canyons",
        "carpets",
        "carrots",
        "cars",
        "cases",
        "cats",
        "chairs",
        "chefs",
        "chicken",
        "cities",
        "clocks",
        "cloths",
        "clouds",
        "clowns",
        "clubs",
        "coats",
        "cobras",
        "coins",
        "colts",
        "comics",
        "cooks",
        "corners",
        "cougars",
        "cows",
        "crabs",
        "crews",
        "cups",
        "cycles",
        "dancers",
        "days",
        "deer",
        "deserts",
        "dingos",
        "dodos",
        "dogs",
        "dolls",
        "donkeys",
        "donuts",
        "doodles",
        "doors",
        "dots",
        "dragons",
        "drinks",
        "dryers",
        "ducks",
        "eagles",
        "ears",
        "eels",
        "eggs",
        "emus",
        "ends",
        "experts",
        "eyes",
        "facts",
        "falcons",
        "fans",
        "feet",
        "files",
        "flies",
        "flowers",
        "forks",
        "foxes",
        "friends",
        "frogs",
        "games",
        "garlics",
        "geckos",
        "geese",
        "ghosts",
        "gifts",
        "glasses",
        "goats",
        "grapes",
        "groups",
        "guests",
        "hairs",
        "hands",
        "hats",
        "heads",
        "hoops",
        "hornets",
        "horses",
        "hotels",
        "hounds",
        "houses",
        "humans",
        "icons",
        "ideas",
        "impalas",
        "insects",
        "islands",
        "items",
        "jars",
        "jeans",
        "jobs",
        "jokes",
        "keys",
        "kids",
        "kings",
        "kiwis",
        "knives",
        "lamps",
        "lands",
        "laws",
        "lemons",
        "lies",
        "lights",
        "lilies",
        "lines",
        "lions",
        "lizards",
        "llamas",
        "loops",
        "mails",
        "mammals",
        "mangos",
        "maps",
        "masks",
        "meals",
        "melons",
        "memes",
        "meteors",
        "mice",
        "mirrors",
        "moles",
        "moments",
        "monkeys",
        "months",
        "moons",
        "moose",
        "mugs",
        "nails",
        "needles",
        "news",
        "nights",
        "numbers",
        "olives",
        "onions",
        "oranges",
        "otters",
        "owls",
        "pandas",
        "pans",
        "pants",
        "papayas",
        "papers",
        "parents",
        "parks",
        "parrots",
        "parts",
        "paths",
        "paws",
        "peaches",
        "pears",
        "peas",
        "pens",
        "pets",
        "phones",
        "pianos",
        "pigs",
        "pillows",
        "places",
        "planes",
        "planets",
        "plants",
        "plums",
        "poems",
        "poets",
        "points",
        "pots",
        "pugs",
        "pumas",
        "queens",
        "rabbits",
        "radios",
        "rats",
        "ravens",
        "readers",
        "regions",
        "results",
        "rice",
        "rings",
        "rivers",
        "rockets",
        "rocks",
        "rooms",
        "roses",
        "rules",
        "sails",
        "schools",
        "seals",
        "seas",
        "sheep",
        "shirts",
        "shoes",
        "showers",
        "shrimps",
        "sides",
        "signs",
        "singers",
        "sites",
        "sloths",
        "snails",
        "snakes",
        "socks",
        "spiders",
        "spies",
        "spoons",
        "squids",
        "stamps",
        "stars",
        "states",
        "steaks",
        "streets",
        "suits",
        "suns",
        "swans",
        "symbols",
        "tables",
        "taxes",
        "taxis",
        "teams",
        "teeth",
        "terms",
        "things",
        "ties",
        "tigers",
        "times",
        "tips",
        "tires",
        "toes",
        "tools",
        "towns",
        "toys",
        "trains",
        "trams",
        "trees",
        "turkeys",
        "turtles",
        "vans",
        "views",
        "walls",
        "wasps",
        "waves",
        "ways",
        "webs",
        "weeks",
        "windows",
        "wings",
        "wolves",
        "wombats",
        "words",
        "worlds",
        "worms",
        "yaks",
        "years",
        "zebras",
        "zoos"
      ];
      exports.verbs = ["accept", "act", "add", "admire", "agree", "allow", "appear", "argue", "arrive", "ask", "attack", "attend", "bake", "bathe", "battle", "beam", "beg", "begin", "behave", "bet", "boil", "bow", "brake", "brush", "build", "burn", "buy", "call", "camp", "care", "carry", "change", "cheat", "check", "cheer", "chew", "clap", "clean", "cough", "count", "cover", "crash", "create", "cross", "cry", "cut", "dance", "decide", "deny", "design", "dig", "divide", "do", "double", "doubt", "draw", "dream", "dress", "drive", "drop", "drum", "eat", "end", "enjoy", "enter", "exist", "fail", "fall", "feel", "fetch", "film", "find", "fix", "flash", "float", "flow", "fly", "fold", "follow", "fry", "give", "glow", "go", "grab", "greet", "grin", "grow", "guess", "hammer", "hang", "happen", "heal", "hear", "help", "hide", "hope", "hug", "hunt", "invent", "invite", "itch", "jam", "jog", "join", "joke", "judge", "juggle", "jump", "kick", "kiss", "kneel", "knock", "know", "laugh", "lay", "lead", "learn", "leave", "lick", "lie", "like", "listen", "live", "look", "lose", "love", "make", "march", "marry", "mate", "matter", "melt", "mix", "move", "nail", "notice", "obey", "occur", "open", "own", "pay", "peel", "pick", "play", "poke", "post", "press", "prove", "pull", "pump", "punch", "push", "raise", "read", "refuse", "relate", "relax", "remain", "repair", "repeat", "reply", "report", "rescue", "rest", "retire", "return", "rhyme", "ring", "roll", "rule", "run", "rush", "say", "scream", "search", "see", "sell", "send", "serve", "shake", "share", "shave", "shine", "shop", "shout", "show", "sin", "sing", "sink", "sip", "sit", "sleep", "slide", "smash", "smell", "smile", "smoke", "sneeze", "sniff", "sort", "speak", "spend", "stand", "stare", "start", "stay", "stick", "stop", "strive", "study", "swim", "switch", "take", "talk", "tan", "tap", "taste", "teach", "tease", "tell", "thank", "think", "throw", "tickle", "tie", "trade", "train", "travel", "try", "turn", "type", "unite", "vanish", "visit", "wait", "walk", "warn", "wash", "watch", "wave", "wear", "win", "wink", "wish", "wonder", "work", "worry", "write", "yawn", "yell"];
      exports.adverbs = ["bravely", "brightly", "busily", "daily", "freely", "hungrily", "joyously", "knowingly", "lazily", "noisily", "oddly", "politely", "quickly", "quietly", "rapidly", "safely", "sleepily", "slowly", "truly", "yearly"];
      function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }
      function longest(arr) {
        return arr.reduce(function(a, b) {
          return a.length > b.length ? a : b;
        });
      }
      function shortest(arr) {
        return arr.reduce(function(a, b) {
          return a.length < b.length ? a : b;
        });
      }
      function humanId(options) {
        if (options === void 0) {
          options = {};
        }
        if (typeof options === "string")
          options = { separator: options };
        if (typeof options === "boolean")
          options = { capitalize: options };
        var _a = options.separator, separator = _a === void 0 ? "" : _a, _b = options.capitalize, capitalize = _b === void 0 ? true : _b, _c = options.adjectiveCount, adjectiveCount = _c === void 0 ? 1 : _c, _d = options.addAdverb, addAdverb = _d === void 0 ? false : _d;
        var res = __spreadArray(__spreadArray(__spreadArray([], __spreadArray([], Array(adjectiveCount), true).map(function(_) {
          return random(exports.adjectives);
        }), true), [
          random(exports.nouns),
          random(exports.verbs)
        ], false), addAdverb ? [random(exports.adverbs)] : [], true);
        if (capitalize)
          res = res.map(function(r) {
            return r.charAt(0).toUpperCase() + r.substr(1);
          });
        return res.join(separator);
      }
      exports.humanId = humanId;
      function poolSize(options) {
        if (options === void 0) {
          options = {};
        }
        var _a = options.adjectiveCount, adjectiveCount = _a === void 0 ? 1 : _a, _b = options.addAdverb, addAdverb = _b === void 0 ? false : _b;
        return exports.adjectives.length * adjectiveCount * exports.nouns.length * exports.verbs.length * (addAdverb ? exports.adverbs.length : 1);
      }
      exports.poolSize = poolSize;
      function maxLength(options) {
        if (options === void 0) {
          options = {};
        }
        var _a = options.adjectiveCount, adjectiveCount = _a === void 0 ? 1 : _a, _b = options.addAdverb, addAdverb = _b === void 0 ? false : _b, _c = options.separator, separator = _c === void 0 ? "" : _c;
        return longest(exports.adjectives).length * adjectiveCount + adjectiveCount * separator.length + longest(exports.nouns).length + separator.length + longest(exports.verbs).length + (addAdverb ? longest(exports.adverbs).length + separator.length : 0);
      }
      exports.maxLength = maxLength;
      function minLength(options) {
        if (options === void 0) {
          options = {};
        }
        var _a = options.adjectiveCount, adjectiveCount = _a === void 0 ? 1 : _a, _b = options.addAdverb, addAdverb = _b === void 0 ? false : _b, _c = options.separator, separator = _c === void 0 ? "" : _c;
        return shortest(exports.adjectives).length * adjectiveCount + adjectiveCount * separator.length + shortest(exports.nouns).length + separator.length + shortest(exports.verbs).length + (addAdverb ? shortest(exports.adverbs).length + separator.length : 0);
      }
      exports.minLength = minLength;
      exports.default = humanId;
    }
  });

  // src/index.ts
  run();
  document.addEventListener("pjax:end", () => run());
  document.addEventListener("turbo:render", () => run());
  async function run() {
    if (/^\/.+?\/.+?\/pull\/.+$/.exec(location.pathname) && // Skip if sidebar is already added
    !hasSidebarSection() && await repoHasChangesetsSetup()) {
      if (shouldRemoveChangesetBotComment) {
        removeChangesetBotComment();
      }
      const updatedPackages = await prHasChangesetFiles();
      await addChangesetSideSection(updatedPackages);
      await addChangesetMergeWarning(updatedPackages);
    }
  }
  async function repoHasChangesetsSetup() {
    const orgRepo = window.location.pathname.split("/").slice(1, 3).join("/");
    const baseBranch = document.querySelector(".commit-ref")?.title.split(":")[1].trim();
    if (!baseBranch) return false;
    const cacheKey = `github-changesets-userscript:repoHasChangesetsSetup-${orgRepo}-${baseBranch}`;
    const cacheValue = sessionStorage.getItem(cacheKey);
    if (!shouldSkipCache && cacheValue) return cacheValue === "true";
    const encodedBaseBranch = encodeGitHubURI(baseBranch);
    const changesetsFolderUrl = `https://github.com/${orgRepo}/tree/${encodedBaseBranch}/.changeset`;
    const response = await fetch(changesetsFolderUrl, { method: "HEAD" });
    const result = response.status === 200;
    sessionStorage.setItem(cacheKey, result + "");
    return result;
  }
  async function prHasChangesetFiles() {
    const orgRepo = window.location.pathname.split("/").slice(1, 3).join("/");
    const prNumber = window.location.pathname.split("/").pop();
    const allCommitTimeline = document.querySelectorAll(
      ".js-timeline-item:has(svg.octicon-git-commit) a.markdown-title"
    );
    const prCommitSha = allCommitTimeline[allCommitTimeline.length - 1].href.split("/").slice(-1).join("").slice(0, 7);
    const cacheKey = `github-changesets-userscript:prHasChangesetFiles-${orgRepo}-${prNumber}-${prCommitSha}`;
    const cacheValue = sessionStorage.getItem(cacheKey);
    if (!shouldSkipCache && cacheValue) return JSON.parse(cacheValue);
    const filesUrl = `https://api.github.com/repos/${orgRepo}/pulls/${prNumber}/files`;
    const response = await fetch(filesUrl);
    const files = await response.json();
    const hasChangesetFiles = files.some((file) => file.filename.startsWith(".changeset/"));
    if (hasChangesetFiles) {
      const updatedPackages = await getUpdatedPackagesFromAddedChangedFiles(files);
      sessionStorage.setItem(cacheKey, JSON.stringify(updatedPackages));
      return updatedPackages;
    } else {
      sessionStorage.setItem(cacheKey, "{}");
      return {};
    }
  }
  async function addChangesetSideSection(updatedPackages) {
    updatedPackages = sortUpdatedPackages(updatedPackages);
    const notificationsSideSection = document.querySelector(
      ".discussion-sidebar-item.sidebar-notifications"
    );
    if (!notificationsSideSection) return;
    const plusIcon = `<svg class="octicon octicon-plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path></svg>`;
    const createLink = await getCreateChangesetLink();
    let html = createLink ? `<a class="d-block text-bold discussion-sidebar-heading discussion-sidebar-toggle" href="${createLink}">Changesets
${plusIcon}</a>` : `<div class="d-block text-bold discussion-sidebar-heading">Changesets</div>`;
    if (Object.keys(updatedPackages).length) {
      html += `<table style="width: 100%; max-width: 400px;">
  <tbody>
    ${Object.entries(updatedPackages).map(([pkg, bumpInfos]) => {
        const bumpElements = bumpInfos.map((info) => {
          if (info.diff) {
            return `<a class="Link--muted" href="${location.origin + location.pathname}/files#diff-${info.diff}">${info.type}</a>`;
          } else {
            return info.type;
          }
        });
        return `<tr>
  <td style="width: 1px; white-space: nowrap; padding-right: 8px; vertical-align: top;">${pkg}</td>
  <td class="color-fg-muted">${bumpElements.join(", ")}</td>
</tr>`;
      }).join("")}
  </tbody>  
</table>`;
    }
    if (hasSidebarSection()) return;
    const changesetSideSection = document.createElement("div");
    changesetSideSection.className = "discussion-sidebar-item sidebar-changesets";
    changesetSideSection.innerHTML = html;
    notificationsSideSection.before(changesetSideSection);
  }
  function hasSidebarSection() {
    return !!document.querySelector(".sidebar-changesets");
  }
  function removeChangesetBotComment() {
    const changesetBotComment = document.querySelector(
      '.js-timeline-item:has(a.author[href="/apps/changeset-bot"])'
    );
    if (changesetBotComment) {
      changesetBotComment.remove();
    }
  }
  async function addChangesetMergeWarning(updatedPackages) {
    if (Object.keys(updatedPackages).length > 0) return;
    if (hasChangesetMergeWarning()) return;
    const createLink = await getCreateChangesetLink();
    if (!createLink) return;
    const warning = document.createElement("span");
    const warningIcon = `<svg class="octicon octicon-alert mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`;
    warning.className = "warning-changesets d-block position-absolute fgColor-attention text-small ml-md-6 pl-md-4 pl-1";
    warning.style.marginTop = "-2.6rem";
    warning.innerHTML = `    ${warningIcon}
    <span>No changesets found.</span>
    <a class="Link--muted Link--inTextBlock" href="${createLink}">Create new</a>
  `;
    const mergeBox = document.querySelector(".merge-pr");
    if (!mergeBox) return;
    if (hasChangesetMergeWarning()) return;
    mergeBox.insertAdjacentElement("afterend", warning);
  }
  function hasChangesetMergeWarning() {
    return !!document.querySelector(".warning-changesets");
  }
  var createChangesetLinkCache = {};
  async function getCreateChangesetLink() {
    const canEditPr = !!document.querySelector("button.js-title-edit-button");
    const isPrOpen = !!document.querySelector(".gh-header .State.State--open");
    if (!canEditPr || !isPrOpen) {
      return null;
    }
    const headRef = document.querySelector(".commit-ref.head-ref > a")?.title;
    if (!headRef) return null;
    const orgRepo = headRef.split(":")[0].trim();
    const branch = headRef.split(":")[1].trim();
    const prTitle = document.querySelector(".js-issue-title")?.textContent.trim();
    const key = `${orgRepo}-${branch}`;
    if (createChangesetLinkCache[key]) {
      return createChangesetLinkCache[key];
    }
    const { humanId } = await Promise.resolve().then(() => __toESM(require_dist(), 1));
    const changesetFileName = `.changeset/${humanId({
      separator: "-",
      capitalize: false
    })}.md`;
    const changesetFileContent = `---
"package": patch
---

${prTitle}
`;
    const encodedBranch = encodeGitHubURI(branch);
    const encodedContent = encodeURIComponent(changesetFileContent);
    const link = `https://github.com/${orgRepo}/new/${encodedBranch}?filename=${changesetFileName}&value=${encodedContent}`;
    createChangesetLinkCache[key] = link;
    return link;
  }
  async function getUpdatedPackagesFromAddedChangedFiles(changedFiles) {
    const map = {};
    for (const file of changedFiles) {
      if (file.filename.startsWith(".changeset/") && file.status === "added") {
        const lines = parseAddedPatchStringAsLines(file.patch);
        let isInYaml = false;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line === "---") {
            isInYaml = !isInYaml;
            if (isInYaml) continue;
            else break;
          }
          const match = /^['"](.+?)['"]:\s*(major|minor|patch)\s*$/.exec(line);
          if (!match) continue;
          const pkg = match[1];
          const type = match[2];
          const diff = await getAddedDiff(file.filename, i + 1);
          const packages = map[pkg] || [];
          packages.push({ type, diff });
          map[pkg] = packages;
        }
      }
    }
    return map;
  }
  function parseAddedPatchStringAsLines(patch) {
    return patch.replace(/^@@.*?@@$\n/m, "").replace(/^\+/gm, "").split("\n");
  }
  async function getAddedDiff(filename, line) {
    if (window.isSecureContext && window.crypto && window.crypto.subtle) {
      const filenameSha256 = await sha256(filename);
      return `${filenameSha256}R${line}`;
    }
  }
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
  function sortUpdatedPackages(map) {
    const newMap = {};
    for (const key of Object.keys(map).sort()) {
      const order = { major: 1, minor: 2, patch: 3 };
      const value = [...map[key]].sort((a, b) => {
        return order[a.type] - order[b.type];
      });
      newMap[key] = value;
    }
    return newMap;
  }
  function encodeGitHubURI(uri) {
    return uri.replace("#", "%23");
  }
})();
