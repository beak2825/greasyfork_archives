// ==UserScript==
// @name         GitHub Changesets
// @version      0.3.0
// @description  Improve the Changesets experience in GitHub PRs
// @license      MIT
// @author       Bjorn Lu
// @homepageURL  https://github.com/bluwy/github-changesets-userscript
// @supportURL   https://github.com/bluwy/github-changesets-userscript/issues
// @namespace    https://greasyfork.org/en/scripts/521590-github-changesets
// @match        https://github.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/521590/GitHub%20Changesets.user.js
// @updateURL https://update.greasyfork.org/scripts/521590/GitHub%20Changesets.meta.js
// ==/UserScript==

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
        if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
          if (ar || !(i2 in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
            ar[i2] = from[i2];
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
        return arr.reduce(function(a2, b2) {
          return a2.length > b2.length ? a2 : b2;
        });
      }
      function shortest(arr) {
        return arr.reduce(function(a2, b2) {
          return a2.length < b2.length ? a2 : b2;
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
        var res = __spreadArray(__spreadArray(__spreadArray([], __spreadArray([], Array(adjectiveCount), true).map(function(_2) {
          return random(exports.adjectives);
        }), true), [
          random(exports.nouns),
          random(exports.verbs)
        ], false), addAdverb ? [random(exports.adverbs)] : [], true);
        if (capitalize)
          res = res.map(function(r2) {
            return r2.charAt(0).toUpperCase() + r2.substr(1);
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

  // src/changesets-utils.ts
  async function repoHasChangesetsSetup() {
    const orgRepo = window.location.pathname.split("/").slice(1, 3).join("/");
    const baseBranch = document.querySelector(".commit-ref")?.title.split(":")[1].trim();
    if (!baseBranch) return false;
    const cacheKey = `github-changesets-userscript:repoHasChangesetsSetup-${orgRepo}-${baseBranch}`;
    const cacheValue = sessionStorage.getItem(cacheKey);
    if (cacheValue) return cacheValue === "true";
    const encodedBaseBranch = encodeGitHubURI(baseBranch);
    const changesetsFolderUrl = `https://github.com/${orgRepo}/tree/${encodedBaseBranch}/.changeset`;
    const response = await fetch(changesetsFolderUrl, { method: "HEAD" });
    const result = response.status === 200;
    sessionStorage.setItem(cacheKey, result + "");
    return result;
  }
  async function getUpdatedPackages() {
    const orgRepo = window.location.pathname.split("/").slice(1, 3).join("/");
    const prNumber = window.location.pathname.split("/").pop();
    const allCommitTimeline = document.querySelectorAll(
      ".js-timeline-item:has(svg.octicon-git-commit) a.markdown-title"
    );
    const prCommitSha = allCommitTimeline[allCommitTimeline.length - 1].href.split("/").slice(-1).join("").slice(0, 7);
    const cacheKey = `github-changesets-userscript:getUpdatedPackages-${orgRepo}-${prNumber}-${prCommitSha}`;
    const cacheValue = sessionStorage.getItem(cacheKey);
    if (cacheValue) return JSON.parse(cacheValue);
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
  async function getUpdatedPackagesFromAddedChangedFiles(changedFiles) {
    const map = {};
    for (const file of changedFiles) {
      if (file.filename.startsWith(".changeset/") && file.status === "added") {
        const lines = parseAddedPatchStringAsLines(file.patch);
        let isInYaml = false;
        for (let i2 = 0; i2 < lines.length; i2++) {
          const line = lines[i2];
          if (line === "---") {
            isInYaml = !isInYaml;
            if (isInYaml) continue;
            else break;
          }
          const match = /^['"](.+?)['"]:\s*(major|minor|patch)\s*$/.exec(line);
          if (!match) continue;
          const pkg = match[1];
          const type = match[2];
          const diff = await getAddedDiff(file.filename, i2 + 1);
          const packages = map[pkg] || [];
          packages.push({ type, diff });
          map[pkg] = packages;
        }
      }
    }
    return map;
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
    const hashHex = hashArray.map((b2) => b2.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
  function encodeGitHubURI(uri) {
    return uri.replace("#", "%23");
  }

  // src/features/add-merge-warning.ts
  async function addMergeWarning(updatedPackages) {
    if (Object.keys(updatedPackages).length > 0) return;
    if (isReleasePr()) return;
    if (hasChangesetMergeWarning()) return;
    const createLink = await getCreateChangesetLink();
    if (!createLink) return;
    const warning = document.createElement("span");
    const warningIcon = `<svg class="octicon octicon-alert mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`;
    warning.className = "warning-changesets position-absolute fgColor-attention text-small ml-md-6 pl-md-4 pl-1";
    warning.style.marginTop = "-2.6rem";
    warning.style.display = "none";
    warning.innerHTML = `    ${warningIcon}
    <span>No changesets found.</span>
    <a class="Link--muted Link--inTextBlock" href="${createLink}">Create new</a>
  `;
    const mergeBox = document.querySelector(".merge-pr");
    if (!mergeBox) return;
    if (hasChangesetMergeWarning()) return;
    mergeBox.insertAdjacentElement("afterend", warning);
    const observer = new MutationObserver(checkMergeBox);
    observer.observe(mergeBox, { childList: true, subtree: true });
    checkMergeBox();
    function checkMergeBox() {
      const hasButton = mergeBox.querySelector('button[type="button"]');
      if (hasButton) {
        warning.style.display = "block";
      } else {
        warning.style.display = "none";
      }
    }
  }
  function isReleasePr() {
    const prDescription = document.querySelector(".TimelineItem .comment-body");
    if (!prDescription) return false;
    return prDescription.textContent.trimStart().startsWith("This PR was opened by the Changesets release GitHub action");
  }
  function hasChangesetMergeWarning() {
    return !!document.querySelector(".warning-changesets");
  }

  // node_modules/uhtml/dist/prod/dom.js
  var e;
  !(function(e3) {
    e3[e3.None = 0] = "None", e3[e3.Mutable = 1] = "Mutable", e3[e3.Watching = 2] = "Watching", e3[e3.RecursedCheck = 4] = "RecursedCheck", e3[e3.Recursed = 8] = "Recursed", e3[e3.Dirty = 16] = "Dirty", e3[e3.Pending = 32] = "Pending";
  })(e || (e = {}));
  var t = [];
  var n = [];
  var { link: s, unlink: i, propagate: r, checkDirty: o, endTracking: l, startTracking: a, shallowPropagate: c } = (function({ update: e3, notify: t2, unwatched: n2 }) {
    let s2 = 0;
    return { link: function(e4, t3) {
      const n3 = t3.depsTail;
      if (void 0 !== n3 && n3.dep === e4) return;
      let i3;
      if (4 & t3.flags && (i3 = void 0 !== n3 ? n3.nextDep : t3.deps, void 0 !== i3 && i3.dep === e4)) return i3.version = s2, void (t3.depsTail = i3);
      const r3 = e4.subsTail;
      if (void 0 !== r3 && r3.version === s2 && r3.sub === t3) return;
      const o3 = t3.depsTail = e4.subsTail = { version: s2, dep: e4, sub: t3, prevDep: n3, nextDep: i3, prevSub: r3, nextSub: void 0 };
      void 0 !== i3 && (i3.prevDep = o3);
      void 0 !== n3 ? n3.nextDep = o3 : t3.deps = o3;
      void 0 !== r3 ? r3.nextSub = o3 : e4.subs = o3;
    }, unlink: i2, propagate: function(e4) {
      let n3, s3 = e4.nextSub;
      e: for (; ; ) {
        const i3 = e4.sub;
        let r3 = i3.flags;
        if (3 & r3 && (60 & r3 ? 12 & r3 ? 4 & r3 ? 48 & r3 || !o2(e4, i3) ? r3 = 0 : (i3.flags = 40 | r3, r3 &= 1) : i3.flags = -9 & r3 | 32 : r3 = 0 : i3.flags = 32 | r3, 2 & r3 && t2(i3), 1 & r3)) {
          const t3 = i3.subs;
          if (void 0 !== t3) {
            e4 = t3, void 0 !== t3.nextSub && (n3 = { value: s3, prev: n3 }, s3 = e4.nextSub);
            continue;
          }
        }
        if (void 0 === (e4 = s3)) {
          for (; void 0 !== n3; ) if (e4 = n3.value, n3 = n3.prev, void 0 !== e4) {
            s3 = e4.nextSub;
            continue e;
          }
          break;
        }
        s3 = e4.nextSub;
      }
    }, checkDirty: function(t3, n3) {
      let s3, i3 = 0;
      e: for (; ; ) {
        const o3 = t3.dep, l2 = o3.flags;
        let a2 = false;
        if (16 & n3.flags) a2 = true;
        else if (17 & ~l2) {
          if (!(33 & ~l2)) {
            void 0 === t3.nextSub && void 0 === t3.prevSub || (s3 = { value: t3, prev: s3 }), t3 = o3.deps, n3 = o3, ++i3;
            continue;
          }
        } else if (e3(o3)) {
          const e4 = o3.subs;
          void 0 !== e4.nextSub && r2(e4), a2 = true;
        }
        if (a2 || void 0 === t3.nextDep) {
          for (; i3; ) {
            --i3;
            const o4 = n3.subs, l3 = void 0 !== o4.nextSub;
            if (l3 ? (t3 = s3.value, s3 = s3.prev) : t3 = o4, a2) {
              if (e3(n3)) {
                l3 && r2(o4), n3 = t3.sub;
                continue;
              }
            } else n3.flags &= -33;
            if (n3 = t3.sub, void 0 !== t3.nextDep) {
              t3 = t3.nextDep;
              continue e;
            }
            a2 = false;
          }
          return a2;
        }
        t3 = t3.nextDep;
      }
    }, endTracking: function(e4) {
      const t3 = e4.depsTail;
      let n3 = void 0 !== t3 ? t3.nextDep : e4.deps;
      for (; void 0 !== n3; ) n3 = i2(n3, e4);
      e4.flags &= -5;
    }, startTracking: function(e4) {
      ++s2, e4.depsTail = void 0, e4.flags = -57 & e4.flags | 4;
    }, shallowPropagate: r2 };
    function i2(e4, t3 = e4.sub) {
      const s3 = e4.dep, i3 = e4.prevDep, r3 = e4.nextDep, o3 = e4.nextSub, l2 = e4.prevSub;
      return void 0 !== r3 ? r3.prevDep = i3 : t3.depsTail = i3, void 0 !== i3 ? i3.nextDep = r3 : t3.deps = r3, void 0 !== o3 ? o3.prevSub = l2 : s3.subsTail = l2, void 0 !== l2 ? l2.nextSub = o3 : void 0 === (s3.subs = o3) && n2(s3), r3;
    }
    function r2(e4) {
      do {
        const n3 = e4.sub, s3 = e4.nextSub, i3 = n3.flags;
        32 == (48 & i3) && (n3.flags = 16 | i3, 2 & i3 && t2(n3)), e4 = s3;
      } while (void 0 !== e4);
    }
    function o2(e4, t3) {
      const n3 = t3.depsTail;
      if (void 0 !== n3) {
        let s3 = t3.deps;
        do {
          if (s3 === e4) return true;
          if (s3 === n3) break;
          s3 = s3.nextDep;
        } while (void 0 !== s3);
      }
      return false;
    }
  })({ update: (e3) => "getter" in e3 ? y(e3) : w(e3, e3.value), notify: function e2(t2) {
    const s2 = t2.flags;
    if (!(64 & s2)) {
      t2.flags = 64 | s2;
      const i2 = t2.subs;
      void 0 !== i2 ? e2(i2.sub) : n[h++] = t2;
    }
  }, unwatched(e3) {
    if ("getter" in e3) {
      let t2 = e3.deps;
      if (void 0 !== t2) {
        e3.flags = 17;
        do {
          t2 = i(t2, e3);
        } while (void 0 !== t2);
      }
    } else "previousValue" in e3 || D.call(e3);
  } });
  var u;
  var d;
  var f = 0;
  var p = 0;
  var h = 0;
  function v(e3) {
    const t2 = u;
    return u = e3, t2;
  }
  function b(e3) {
    return T.bind({ previousValue: e3, value: e3, subs: void 0, subsTail: void 0, flags: 1 });
  }
  function x(e3) {
    const t2 = { fn: e3, subs: void 0, subsTail: void 0, deps: void 0, depsTail: void 0, flags: 2 };
    void 0 !== u ? s(t2, u) : void 0 !== d && s(t2, d);
    const n2 = v(t2);
    try {
      t2.fn();
    } finally {
      v(n2);
    }
    return D.bind(t2);
  }
  function y(e3) {
    const t2 = v(e3);
    a(e3);
    try {
      const t3 = e3.value;
      return t3 !== (e3.value = e3.getter(t3));
    } finally {
      v(t2), l(e3);
    }
  }
  function w(e3, t2) {
    return e3.flags = 1, e3.previousValue !== (e3.previousValue = t2);
  }
  function S(e3, t2) {
    if (16 & t2 || 32 & t2 && o(e3.deps, e3)) {
      const t3 = v(e3);
      a(e3);
      try {
        e3.fn();
      } finally {
        v(t3), l(e3);
      }
      return;
    }
    32 & t2 && (e3.flags = -33 & t2);
    let n2 = e3.deps;
    for (; void 0 !== n2; ) {
      const e4 = n2.dep, t3 = e4.flags;
      64 & t3 && S(e4, e4.flags = -65 & t3), n2 = n2.nextDep;
    }
  }
  function k() {
    for (; p < h; ) {
      const e3 = n[p];
      n[p++] = void 0, S(e3, e3.flags &= -65);
    }
    p = 0, h = 0;
  }
  function T(...e3) {
    if (!e3.length) {
      const e4 = this.value;
      if (16 & this.flags && w(this, e4)) {
        const e5 = this.subs;
        void 0 !== e5 && c(e5);
      }
      return void 0 !== u && s(this, u), e4;
    }
    {
      const t2 = e3[0];
      if (this.value !== (this.value = t2)) {
        this.flags = 17;
        const e4 = this.subs;
        void 0 !== e4 && (r(e4), f || k());
      }
    }
  }
  function D() {
    let e3 = this.deps;
    for (; void 0 !== e3; ) e3 = i(e3, this);
    const t2 = this.subs;
    void 0 !== t2 && i(t2), this.flags = 0;
  }
  var O = { greedy: false };
  var $ = (e3) => {
    t.push(v(void 0));
    try {
      return e3();
    } finally {
      v(t.pop());
    }
  };
  var W = class {
    constructor(e3, t2) {
      this._ = e3(t2);
    }
    get value() {
      return this._();
    }
    set value(e3) {
      this._(e3);
    }
    peek() {
      return $(this._);
    }
    valueOf() {
      return this.value;
    }
  };
  var E = class extends W {
    constructor(e3) {
      super(b, [e3]);
    }
    get value() {
      return super.value[0];
    }
    set value(e3) {
      super.value = [e3];
    }
    peek() {
      return super.peek()[0];
    }
  };
  var R = (e3, { greedy: t2 = false } = O) => t2 ? new E(e3) : new W(b, e3);
  function L() {
    return R.apply(null, arguments);
  }
  var _ = (e3) => {
    R = e3;
  };
  var { isArray: j } = Array;
  var { assign: F, defineProperties: P, entries: B, freeze: J } = Object;
  var V = class {
    #e;
    constructor(e3) {
      this.#e = e3;
    }
    valueOf() {
      return this.#e;
    }
    toString() {
      return String(this.#e);
    }
  };
  var H = (e3) => document.createComment(e3);
  var q = 42;
  var G = /* @__PURE__ */ new Set(["plaintext", "script", "style", "textarea", "title", "xmp"]);
  var I = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"]);
  var K = J({});
  var Q = J([]);
  var U = (e3, t2) => (e3.children === Q && (e3.children = []), e3.children.push(t2), t2.parent = e3, t2);
  var X = (e3, t2, n2) => {
    e3.props === K && (e3.props = {}), e3.props[t2] = n2;
  };
  var Y = (e3, t2, n2) => {
    e3 !== t2 && n2.push(e3);
  };
  var Z = class {
    constructor(e3) {
      this.type = e3, this.parent = null;
    }
    toJSON() {
      return [this.type, this.data];
    }
  };
  var ee = class extends Z {
    constructor(e3) {
      super(8), this.data = e3;
    }
    toString() {
      return `<!--${this.data}-->`;
    }
  };
  var te = class extends Z {
    constructor(e3) {
      super(10), this.data = e3;
    }
    toString() {
      return `<!${this.data}>`;
    }
  };
  var ne = class extends Z {
    constructor(e3) {
      super(3), this.data = e3;
    }
    toString() {
      return this.data;
    }
  };
  var se = class extends Z {
    constructor() {
      super(q), this.name = "template", this.props = K, this.children = Q;
    }
    toJSON() {
      const e3 = [q];
      return Y(this.props, K, e3), Y(this.children, Q, e3), e3;
    }
    toString() {
      let e3 = "";
      for (const t2 in this.props) {
        const n2 = this.props[t2];
        null != n2 && ("boolean" == typeof n2 ? n2 && (e3 += ` ${t2}`) : e3 += ` ${t2}="${n2}"`);
      }
      return `<template${e3}>${this.children.join("")}</template>`;
    }
  };
  var ie = class extends Z {
    constructor(e3, t2 = false) {
      super(1), this.name = e3, this.xml = t2, this.props = K, this.children = Q;
    }
    toJSON() {
      const e3 = [1, this.name, +this.xml];
      return Y(this.props, K, e3), Y(this.children, Q, e3), e3;
    }
    toString() {
      const { xml: e3, name: t2, props: n2, children: s2 } = this, { length: i2 } = s2;
      let r2 = `<${t2}`;
      for (const t3 in n2) {
        const s3 = n2[t3];
        null != s3 && ("boolean" == typeof s3 ? s3 && (r2 += e3 ? ` ${t3}=""` : ` ${t3}`) : r2 += ` ${t3}="${s3}"`);
      }
      if (i2) {
        r2 += ">";
        for (let n3 = !e3 && G.has(t2), o2 = 0; o2 < i2; o2++) r2 += n3 ? s2[o2].data : s2[o2];
        r2 += `</${t2}>`;
      } else r2 += e3 ? " />" : I.has(t2) ? ">" : `></${t2}>`;
      return r2;
    }
  };
  var re = class extends Z {
    constructor() {
      super(11), this.name = "#fragment", this.children = Q;
    }
    toJSON() {
      const e3 = [11];
      return Y(this.children, Q, e3), e3;
    }
    toString() {
      return this.children.join("");
    }
  };
  var oe = "\0";
  var le = `"${oe}"`;
  var ae = `'${oe}'`;
  var ce = /\x00|<[^><\s]+/g;
  var ue = /([^\s/>=]+)(?:=(\x00|(?:(['"])[\s\S]*?\3)))?/g;
  var de = (e3, t2, n2, s2, i2) => [t2, n2, s2];
  var fe = (e3) => {
    const t2 = [];
    for (; e3.parent; ) {
      switch (e3.type) {
        case q:
        case 1:
          "template" === e3.name && t2.push(-1);
      }
      t2.push(e3.parent.children.indexOf(e3)), e3 = e3.parent;
    }
    return t2;
  };
  var pe = (e3, t2) => {
    do {
      e3 = e3.parent;
    } while (t2.has(e3));
    return e3;
  };
  var he = (e3, t2) => t2 < 0 ? e3.content : e3.childNodes[t2];
  var ve = (e3, t2) => t2.reduceRight(he, e3);
  var ge;
  var be = false;
  var me = ({ firstChild: e3, lastChild: t2 }) => {
    const n2 = ge || (ge = document.createRange());
    return n2.setStartAfter(e3), n2.setEndAfter(t2), n2.deleteContents(), e3;
  };
  var xe = (e3, t2) => be && 11 === e3.nodeType ? 1 / t2 < 0 ? t2 ? me(e3) : e3.lastChild : t2 ? e3.valueOf() : e3.firstChild : e3;
  var ye = /* @__PURE__ */ Symbol("nodes");
  var we = { get() {
    return this.firstChild.parentNode;
  } };
  var Se = { value(e3) {
    me(this).replaceWith(e3);
  } };
  var ke = { value() {
    me(this).remove();
  } };
  var Ce = { value() {
    const { parentNode: e3 } = this;
    if (e3 === this) this[ye] === Q && (this[ye] = [...this.childNodes]);
    else {
      if (e3) {
        let { firstChild: e4, lastChild: t2 } = this;
        for (this[ye] = [e4]; e4 !== t2; ) this[ye].push(e4 = e4.nextSibling);
      }
      this.replaceChildren(...this[ye]);
    }
    return this;
  } };
  function Te(e3) {
    const t2 = H("<>"), n2 = H("</>");
    return e3.replaceChildren(t2, ...e3.childNodes, n2), be = true, P(e3, { [ye]: { writable: true, value: Q }, firstChild: { value: t2 }, lastChild: { value: n2 }, parentNode: we, valueOf: Ce, replaceWith: Se, remove: ke });
  }
  Te.prototype = DocumentFragment.prototype;
  var De = 16;
  var Oe = 32768;
  var Ne = ((e3 = globalThis.document) => {
    let t2, n2 = e3.createElement("template");
    return (s2, i2 = false) => {
      if (i2) return t2 || (t2 = e3.createRange(), t2.selectNodeContents(e3.createElementNS("http://www.w3.org/2000/svg", "svg"))), t2.createContextualFragment(s2);
      n2.innerHTML = s2;
      const r2 = n2.content;
      return n2 = n2.cloneNode(false), r2;
    };
  })(document);
  var $e = /* @__PURE__ */ Symbol("ref");
  var We = (e3, t2) => {
    for (const [n2, s2] of B(t2)) {
      const t3 = "role" === n2 ? n2 : `aria-${n2.toLowerCase()}`;
      null == s2 ? e3.removeAttribute(t3) : e3.setAttribute(t3, s2);
    }
  };
  var Ae = (e3) => (t2, n2) => {
    null == n2 ? t2.removeAttribute(e3) : t2.setAttribute(e3, n2);
  };
  var Ee = (e3, t2) => {
    e3[ye] = ((e4, t3, n2, s2) => {
      const i2 = s2.parentNode, r2 = t3.length;
      let o2 = e4.length, l2 = r2, a2 = 0, c2 = 0, u2 = null;
      for (; a2 < o2 || c2 < l2; ) if (o2 === a2) {
        const e5 = l2 < r2 ? c2 ? n2(t3[c2 - 1], -0).nextSibling : n2(t3[l2], 0) : s2;
        for (; c2 < l2; ) i2.insertBefore(n2(t3[c2++], 1), e5);
      } else if (l2 === c2) for (; a2 < o2; ) u2 && u2.has(e4[a2]) || n2(e4[a2], -1).remove(), a2++;
      else if (e4[a2] === t3[c2]) a2++, c2++;
      else if (e4[o2 - 1] === t3[l2 - 1]) o2--, l2--;
      else if (e4[a2] === t3[l2 - 1] && t3[c2] === e4[o2 - 1]) {
        const s3 = n2(e4[--o2], -0).nextSibling;
        i2.insertBefore(n2(t3[c2++], 1), n2(e4[a2++], -0).nextSibling), i2.insertBefore(n2(t3[--l2], 1), s3), e4[o2] = t3[l2];
      } else {
        if (!u2) {
          u2 = /* @__PURE__ */ new Map();
          let e5 = c2;
          for (; e5 < l2; ) u2.set(t3[e5], e5++);
        }
        const s3 = u2.get(e4[a2]) ?? -1;
        if (s3 < 0) n2(e4[a2++], -1).remove();
        else if (c2 < s3 && s3 < l2) {
          let r3 = a2, d2 = 1;
          for (; ++r3 < o2 && r3 < l2 && u2.get(e4[r3]) === s3 + d2; ) d2++;
          if (d2 > s3 - c2) {
            const r4 = n2(e4[a2], 0);
            for (; c2 < s3; ) i2.insertBefore(n2(t3[c2++], 1), r4);
          } else i2.replaceChild(n2(t3[c2++], 1), n2(e4[a2++], -1));
        } else a2++;
      }
      return t3;
    })(e3[ye] || Q, t2, xe, e3);
  };
  var Me = /* @__PURE__ */ new WeakMap();
  var Re = (e3, t2) => {
    const n2 = "object" == typeof t2 ? t2 ?? e3 : ((e4, t3) => {
      let n3 = Me.get(e4);
      return n3 ? n3.data = t3 : Me.set(e4, n3 = document.createTextNode(t3)), n3;
    })(e3, t2), s2 = e3[ye] ?? e3;
    n2 !== s2 && s2.replaceWith(xe(e3[ye] = n2, 1));
  };
  var Le = (e3, t2) => {
    Re(e3, t2 instanceof W ? t2.value : t2);
  };
  var _e = ({ dataset: e3 }, t2) => {
    for (const [n2, s2] of B(t2)) null == s2 ? delete e3[n2] : e3[n2] = s2;
  };
  var je = /* @__PURE__ */ new Map();
  var Fe = (e3) => {
    let t2 = je.get(e3);
    return t2 || je.set(e3, t2 = Pe(e3)), t2;
  };
  var Pe = (e3) => (t2, n2) => {
    t2[e3] = n2;
  };
  var Be = (e3, t2) => {
    for (const [n2, s2] of B(t2)) Ae(n2)(e3, s2);
  };
  var Je = (e3, t2, n2) => n2 ? (n3, s2) => {
    const i2 = n3[t2];
    i2?.length && n3.removeEventListener(e3, ...i2), s2 && n3.addEventListener(e3, ...s2), n3[t2] = s2;
  } : (n3, s2) => {
    const i2 = n3[t2];
    i2 && n3.removeEventListener(e3, i2), s2 && n3.addEventListener(e3, s2), n3[t2] = s2;
  };
  var Ve = (e3) => (t2, n2) => {
    t2.toggleAttribute(e3, !!n2);
  };
  var ze = false;
  var He = true;
  var qe = (e3) => {
    He = e3;
  };
  var Ge = () => He;
  var Ie = (e3) => xe(e3.n ? e3.update(e3) : e3.valueOf(false), 1);
  var Ke = (e3, t2) => {
    const n2 = [], s2 = e3.length, i2 = t2.length;
    for (let r2, o2, l2 = 0, a2 = 0; a2 < i2; a2++) r2 = t2[a2], n2[a2] = l2 < s2 && (o2 = e3[l2++]).t === r2.t ? (t2[a2] = o2).update(r2) : r2.valueOf(false);
    return n2;
  };
  var Qe = (e3, t2, n2) => {
    const s2 = R, i2 = n2.length;
    let r2 = 0;
    _((e4) => r2 < i2 ? n2[r2++] : n2[r2++] = e4 instanceof W ? e4 : s2(e4));
    const o2 = Ge();
    o2 && qe(!o2);
    try {
      return e3(t2, Ze);
    } finally {
      o2 && qe(o2), _(s2);
    }
  };
  var Ue = (e3, t2) => (e3.t === t2.t ? e3.update(t2) : (e3.n.replaceWith(Ie(t2)), e3 = t2), e3);
  var Xe = (e3, t2, n2) => {
    let s2, i2 = [], r2 = [De, null, n2], o2 = true;
    return x(() => {
      if (o2) o2 = false, s2 = Qe(t2, n2, i2), i2.length || (i2 = Q), s2 ? (e3.replaceWith(Ie(s2)), r2[1] = s2) : e3.remove();
      else {
        const e4 = Qe(t2, n2, i2);
        s2 && Ue(s2, e4) === e4 && (r2[2] = s2 = e4);
      }
    }), r2;
  };
  var Ye = /* @__PURE__ */ Symbol();
  var Ze = {};
  var et = class _et {
    constructor(e3, t2) {
      this.t = e3, this.v = t2, this.n = null, this.k = -1;
    }
    valueOf(e3 = Ge()) {
      const [t2, n2, s2] = this.t, i2 = document.importNode(t2, true), r2 = this.v;
      let o2, l2, a2, c2 = r2.length, u2 = Q;
      if (0 < c2) {
        for (u2 = n2.slice(0); c2--; ) {
          const [t3, s3, d3] = n2[c2], f3 = r2[c2];
          if (l2 !== t3 && (o2 = ve(i2, t3), l2 = t3), d3 & De) {
            const e4 = o2[Ye] || (o2[Ye] = {});
            if (d3 === De) {
              for (const { name: t4, value: n3 } of o2.attributes) e4[t4] ??= n3;
              e4.children ??= [...o2.content.childNodes], u2[c2] = Xe(o2, f3, e4);
            } else s3(e4, f3), u2[c2] = [d3, s3, e4];
          } else {
            let t4 = true;
            e3 || !(8 & d3) || d3 & Oe || (1 & d3 ? (t4 = false, f3.length && s3(o2, f3[0] instanceof _et ? Ke(Q, f3) : f3)) : f3 instanceof _et && (t4 = false, s3(o2, Ie(f3)))), t4 && (512 === d3 ? this.k = c2 : (16384 === d3 && (a2 ??= /* @__PURE__ */ new Set()).add(o2), s3(o2, f3))), u2[c2] = [d3, s3, f3, o2], e3 && 8 & d3 && o2.remove();
          }
        }
        a2 && ((e4) => {
          for (const t3 of e4) {
            const e5 = t3[$e];
            "function" == typeof e5 ? e5(t3) : e5 instanceof W ? e5.value = t3 : e5 && (e5.current = t3);
          }
        })(a2);
      }
      const { childNodes: d2 } = i2, f2 = d2.length, p2 = 1 === f2 ? d2[0] : f2 ? Te(i2) : i2;
      return this.v = u2, this.n = p2, -1 < this.k && s2.set(u2[this.k][2], p2, this), p2;
    }
    update(e3) {
      const t2 = this.k, n2 = this.v, s2 = e3.v;
      if (-1 < t2 && n2[t2][2] !== s2[t2]) return ((e4, t3) => e4.t[2].get(t3)?.update(e4) ?? e4.valueOf(false))(e3, s2[t2]);
      let { length: i2 } = n2;
      for (; i2--; ) {
        const e4 = n2[i2], [t3, r2, o2] = e4;
        if (512 === t3) continue;
        let l2 = s2[i2];
        if (t3 & De) if (t3 === De) {
          const t4 = l2(o2, Ze);
          r2 && Ue(r2, t4) === t4 && (e4[2] = t4);
        } else r2(o2, l2);
        else {
          let n3 = l2;
          if (1 & t3) {
            if (8 & t3) l2.length && l2[0] instanceof _et && (n3 = Ke(o2, l2));
            else if (256 & t3 && l2[0] === o2[0]) continue;
          } else if (8 & t3) if (t3 & Oe) {
            if (l2 === o2) {
              r2(e4[3], n3);
              continue;
            }
          } else o2 instanceof _et && (l2 = Ue(o2, l2), n3 = l2.n);
          l2 !== o2 && (e4[2] = l2, r2(e4[3], n3));
        }
      }
      return this.n;
    }
  };
  var tt = /* @__PURE__ */ new WeakMap();
  var nt = class extends Map {
    constructor() {
      super()._ = new FinalizationRegistry((e3) => this.delete(e3));
    }
    get(e3) {
      const t2 = super.get(e3)?.deref();
      return t2 && tt.get(t2);
    }
    set(e3, t2, n2) {
      tt.set(t2, n2), this._.register(t2, e3), super.set(e3, new WeakRef(t2));
    }
  };
  var st = (({ Comment: e3 = ee, DocumentType: t2 = te, Text: n2 = ne, Fragment: s2 = re, Element: i2 = ie, Component: r2 = se, update: o2 = de }) => (l2, a2, c2) => {
    const u2 = l2.join(oe).trim(), d2 = /* @__PURE__ */ new Set(), f2 = [];
    let p2 = new s2(), h2 = 0, v2 = 0, g = 0, b2 = Q;
    for (const s3 of u2.matchAll(ce)) {
      if (0 < v2) {
        v2--;
        continue;
      }
      const l3 = s3[0], m = s3.index;
      if (h2 < m && U(p2, new n2(u2.slice(h2, m))), l3 === oe) {
        "table" === p2.name && (p2 = U(p2, new i2("tbody", c2)), d2.add(p2));
        const t3 = U(p2, new e3("\u25E6"));
        f2.push(o2(t3, 8, fe(t3), "", a2[g++])), h2 = m + 1;
      } else if (l3.startsWith("<!")) {
        const n3 = u2.indexOf(">", m + 2);
        if ("-->" === u2.slice(n3 - 2, n3 + 1)) {
          const t3 = u2.slice(m + 4, n3 - 2);
          "!" === t3[0] && U(p2, new e3(t3.slice(1).replace(/!$/, "")));
        } else U(p2, new t2(u2.slice(m + 2, n3)));
        h2 = n3 + 1;
      } else if (l3.startsWith("</")) {
        const e4 = u2.indexOf(">", m + 2);
        c2 && "svg" === p2.name && (c2 = false), p2 = pe(p2, d2), h2 = e4 + 1;
      } else {
        const e4 = m + l3.length, t3 = u2.indexOf(">", e4), s4 = l3.slice(1);
        let x2 = s4;
        if (s4 === oe ? (x2 = "template", p2 = U(p2, new r2()), b2 = fe(p2).slice(1), f2.push(o2(p2, q, b2, "", a2[g++]))) : (c2 || (x2 = x2.toLowerCase(), "table" !== p2.name || "tr" !== x2 && "td" !== x2 || (p2 = U(p2, new i2("tbody", c2)), d2.add(p2)), "tbody" === p2.name && "td" === x2 && (p2 = U(p2, new i2("tr", c2)), d2.add(p2))), p2 = U(p2, new i2(x2, !!c2 && "svg" !== x2)), b2 = Q), e4 < t3) {
          let n3 = false;
          for (const [s5, i3, r3] of u2.slice(e4, t3).matchAll(ue)) if (r3 === oe || r3 === le || r3 === ae || (n3 = i3.endsWith(oe))) {
            const e5 = b2 === Q ? b2 = fe(p2) : b2;
            f2.push(o2(p2, 2, e5, n3 ? i3.slice(0, -1) : i3, a2[g++])), n3 = false, v2++;
          } else X(p2, i3, !r3 || r3.slice(1, -1));
          b2 = Q;
        }
        h2 = t3 + 1;
        const y2 = 0 < t3 && "/" === u2[t3 - 1];
        if (c2) y2 && (p2 = p2.parent);
        else if (y2 || I.has(x2)) p2 = y2 ? pe(p2, d2) : p2.parent;
        else if ("svg" === x2) c2 = true;
        else if (G.has(x2)) {
          const e5 = u2.indexOf(`</${s4}>`, h2), t4 = u2.slice(h2, e5);
          t4.trim() === oe ? (v2++, f2.push(o2(p2, 3, fe(p2), "", a2[g++]))) : U(p2, new n2(t4)), p2 = p2.parent, h2 = e5 + s4.length + 3, v2++;
          continue;
        }
      }
    }
    return h2 < u2.length && U(p2, new n2(u2.slice(h2))), [p2, f2];
  })({ Comment: ee, DocumentType: te, Text: ne, Fragment: re, Element: ie, Component: se, update: (e3, t2, n2, s2, i2) => {
    switch (t2) {
      case q:
        return [n2, i2, De];
      case 8:
        return j(i2) ? [n2, Ee, 9] : i2 instanceof V ? [n2, (r2 = e3.xml, (e4, t3) => {
          const n3 = e4[$e] ?? (e4[$e] = {});
          n3.v !== t3 && (n3.f = Te(Ne(t3, r2)), n3.v = t3), Re(e4, n3.f);
        }), 8192] : i2 instanceof W ? [n2, Le, 32776] : [n2, Re, 8];
      case 3:
        return [n2, Fe("textContent"), 2048];
      case 2: {
        const t3 = e3.type === q;
        switch (s2.at(0)) {
          case "@": {
            const e4 = j(i2);
            return [n2, Je(s2.slice(1), Symbol(s2), e4), e4 ? 257 : 256];
          }
          case "?":
            return [n2, Ve(s2.slice(1)), 4096];
          case ".":
            return "..." === s2 ? [n2, t3 ? F : Be, t3 ? 144 : 128] : [n2, Pe(s2.slice(1)), t3 ? 80 : 64];
          default:
            return t3 ? [n2, Pe(s2), 1040] : "aria" === s2 ? [n2, We, 2] : "data" !== s2 || /^object$/i.test(e3.name) ? "key" === s2 ? [n2, ze = true, 512] : "ref" === s2 ? [n2, Fe($e), 16384] : s2.startsWith("on") ? [n2, Fe(s2.toLowerCase()), 64] : [n2, Ae(s2), 4] : [n2, _e, 32];
        }
      }
    }
    var r2;
  } });
  var it = (e3, t2 = /* @__PURE__ */ new WeakMap()) => (n2, ...s2) => {
    let i2 = t2.get(n2);
    return i2 || (i2 = st(n2, s2, e3), i2.push((() => {
      const e4 = ze;
      return ze = false, e4;
    })() ? new nt() : null), i2[0] = Ne(i2[0].toString(), e3), t2.set(n2, i2)), new et(i2, s2);
  };
  var rt = it(false);
  var ot = it(true);
  function at(e3, ...t2) {
    const n2 = rt.apply(null, arguments);
    return Ge() ? n2.valueOf(true) : n2;
  }

  // src/settings.ts
  var featureDescriptions = {
    "remove-changeset-bot-comment": "Remove changeset-bot comment"
  };
  var featureSettings = Object.fromEntries(
    Object.keys(featureDescriptions).map((key) => [
      key,
      localStorageStore(`github-changesets-userscript:settings:${key}`, true)
    ])
  );
  function localStorageStore(key, defaultValue) {
    const store = {
      get() {
        const v2 = localStorage.getItem(key);
        if (v2) return JSON.parse(v2);
        if (defaultValue != null) {
          store.reset();
          return JSON.parse(JSON.stringify(defaultValue));
        }
      },
      set(value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      reset() {
        if (defaultValue != null) {
          store.set(defaultValue);
        } else {
          localStorage.removeItem(key);
        }
      }
    };
    return store;
  }
  function Settings() {
    const featureStates = Object.fromEntries(
      Object.entries(featureSettings).map(([name, setting]) => [name, L(setting.get())])
    );
    return at`
    <details-menu
      class="js-discussion-sidebar-menu select-menu-modal position-absolute right-0 hx_rsm-modal"
      style="z-index: 99; overflow: visible;"
    >
      <div class="select-menu-header rounded-top-2">
        <span class="select-menu-title">Features</span>
        <span class="color-fg-muted">(Refresh page to view changes)</span>
      </div>
      <div class="select-menu-list">
        ${Object.entries(featureStates).map(([_name, state]) => {
      const name = _name;
      return at`
            <label
              class="select-menu-item pl-2"
              key=${name}
              style="background-color: var(--overlay-bgColor, var(--color-canvas-overlay))"
            >
              <input
                type="checkbox"
                class="mr-1"
                .checked=${state.value}
                @change=${(e3) => {
        const checked = e3.target.checked;
        featureSettings[name].set(checked);
        state.value = checked;
      }}
              />
              <span>${featureDescriptions[name]}</span>
            </label>
          `;
    })}
      </div>
    </details-menu>
  `;
  }
  function getSettingsElement() {
    return at`<${Settings} />`;
  }

  // src/features/add-sidebar-section.ts
  var settingsIcon = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-gear"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg>`;
  async function addSidebarSection(updatedPackages) {
    if (hasSidebarSection()) return;
    updatedPackages = sortUpdatedPackages(updatedPackages);
    const notificationsSideSection = document.querySelector(
      ".discussion-sidebar-item.sidebar-notifications"
    );
    if (!notificationsSideSection) return;
    const createLink = await getCreateChangesetLink();
    let html = `    <details class="details-reset details-overlay select-menu hx_rsm">
      <summary class="text-bold discussion-sidebar-heading discussion-sidebar-toggle" role="button">
        ${settingsIcon}
        <span>Changesets</span>
        ${createLink ? `<span style="font-weight: normal;"> \u2013 <a class="btn-link Link--muted Link--inTextBlock" href="${createLink}">create new</a></span>` : ""}
      </summary>
    </details>`;
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
    changesetSideSection.querySelector("details").appendChild(getSettingsElement());
    notificationsSideSection.before(changesetSideSection);
  }
  function sortUpdatedPackages(map) {
    const newMap = {};
    for (const key of Object.keys(map).sort()) {
      const order = { major: 1, minor: 2, patch: 3 };
      const value = [...map[key]].sort((a2, b2) => {
        return order[a2.type] - order[b2.type];
      });
      newMap[key] = value;
    }
    return newMap;
  }
  function hasSidebarSection() {
    return !!document.querySelector(".sidebar-changesets");
  }

  // src/features/remove-changeset-bot-comment.ts
  function removeChangesetBotComment() {
    const changesetBotComment = document.querySelector(
      '.js-timeline-item:has(a.author[href="/apps/changeset-bot"])'
    );
    if (changesetBotComment) {
      changesetBotComment.remove();
    }
  }

  // src/index.ts
  var pageAlreadyRun = /* @__PURE__ */ new Set();
  run();
  document.addEventListener("pjax:end", () => run());
  document.addEventListener("turbo:render", () => run());
  async function run() {
    if (!pageAlreadyRun.has(location.href) && /^\/.+?\/.+?\/pull\/.+$/.exec(location.pathname) && await repoHasChangesetsSetup()) {
      pageAlreadyRun.add(location.href);
      if (featureSettings["remove-changeset-bot-comment"].get()) {
        removeChangesetBotComment();
      }
      const updatedPackages = await getUpdatedPackages();
      await addSidebarSection(updatedPackages);
      await addMergeWarning(updatedPackages);
    }
  }
})();
