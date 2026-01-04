// ==UserScript==
// @name        Popmundo Assistant 2
// @description Usability improvements for Popmundo, mainly focused on interactions between characters and navigation.
// @namespace   bheuv
// @version     2.6.11
//
// @include     http://*.popmundo.com/
// @include     https://*.popmundo.com/World/*
// @include     https://*.popmundo.com/Forum/*
//
// @require     https://unpkg.com/vue@2.6.3/dist/vue.min.js
// @require	    https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require     https://unpkg.com/uuid@8.3.2/dist/umd/uuidv4.min.js
//
// @run-at document-start
// @noframes
//
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_addStyle
// @grant   GM_deleteValue
// @grant   unsafeWindow
//
// @downloadURL https://update.greasyfork.org/scripts/387108/Popmundo%20Assistant%202.user.js
// @updateURL https://update.greasyfork.org/scripts/387108/Popmundo%20Assistant%202.meta.js
// ==/UserScript==
(function () {
  "use strict";

  let debug = function (message) {
    //console.log(message);
  };

  const mapFocusWork = {
    9: "Media",
    29: "Nothing",
    33: "University",
    14: "Calm",
    2: "Compose",
    3: "Work",
    8: "Skill",
    13: "Incite",
    16: "Master/Mistress",
    22: "Community Service",
    17: "Pick Flowers",
    19: "Rehearse",
    15: "Teach",
    21: "Write Poetry",
  };

  class Repository {
    constructor(master, storage_type) {
      let allowedTypes = ["database", "session", "local", "memory"];

      if (allowedTypes.indexOf(storage_type) === -1) {
        throw (
          "Invalid storage type '" +
          storage_type +
          "'. Supported types are '" +
          allowedTypes.join("', ") +
          "'."
        );
      }

      this.dirty = false;
      this.loaded = false;
      this.master = master;
      this.storage_type = storage_type;
    }

    load() {
      let data = {};

      if (this.storage_type === "database") {
        data = GM_getValue(this.master);
      } else if (this.storage_type === "session") {
        data = sessionStorage.getItem(this.master);
      } else if (this.storage_type === "local") {
        data = localStorage.getItem(this.master);
      }

      if (!data) {
        data = {};
        this.dirty = true;
      } else if (typeof data !== "object") {
        data = this.unserialize(data);
      }

      this.data = data;
      this.loaded = true;
    }

    save() {
      if (!this.dirty) {
        return;
      }

      // Update version information
      this.set("__meta.version", Date.now());

      let data = this.serialize(this.data);

      if (this.storage_type === "database") {
        GM_setValue(this.master, data);
      } else if (this.storage_type === "session") {
        sessionStorage.setItem(this.master, data);
      } else if (this.storage_type === "local") {
        localStorage.setItem(this.master, data);
      }

      this.dirty = false;
    }

    get(key, default_value) {
      if (typeof default_value === "undefined") {
        default_value = null;
      }

      if (!this.loaded) {
        this.load();
      }

      // Data can be set using dot notation
      let path = key.split(".");

      if (Array.isArray(path) === false) {
        path = key;
      }

      // Walk down the path
      let part = path.shift();
      let current = this.data;

      while (part) {
        if (typeof current !== "object") {
          throw (
            "Attempted to use non-object as a part of the storage key ('" +
            part +
            "' in '" +
            key +
            "')"
          );
        }

        if (!current.hasOwnProperty(part)) {
          return default_value; // Part of the path does not exist, so value will definitely not exist!
        }

        if (path.length <= 0) {
          // This is the last piece of the path, so it's the value we were looking for
          // @todo: if this is an object, it could potentially be modified without the repository detecting it; so return a clone of objects
          return current[part];
        } else {
          // Update reference
          current = current[part.toString()];
        }

        part = path.shift();
      }
    }

    set(key, value) {
      if (!this.loaded) {
        this.load();
      }

      // Data can be set using dot notation
      let path = key.split(".");

      if (Array.isArray(path) === false) {
        path = key;
      }

      // Walk down the path
      let part = path.shift();
      let current = this.data;

      while (part) {
        if (typeof current !== "object") {
          throw (
            "Attempted to use non-object as a part of the storage key ('" +
            part +
            "' in '" +
            key +
            "')"
          );
        }

        if (!current.hasOwnProperty(part)) {
          // Initialize as empty object if path does not exist yet
          current[part.toString()] = {};
        }

        if (path.length <= 0) {
          if (value === "__REPOSITORY_DELETE__") {
            delete current[part];
          } else {
            // Last piece of the path, this is where we set the value
            current[part] = value;
          }
        } else {
          // Update reference
          current = current[part.toString()];
        }

        part = path.shift();
      }

      this.dirty = true;
    }

    remove(key) {
      // todo: make this actually delete instead of this shortcut
      this.set(key, "__REPOSITORY_DELETE__");
    }

    clear() {
      this.data = {};
      this.dirty = true;
    }

    unserialize(data_string) {
      return JSON.parse(data_string);
    }

    serialize(data_object) {
      return JSON.stringify(data_object);
    }

    destroy() {
      if (this.storage_type === "database") {
        GM_deleteValue(this.master);
      } else if (this.storage_type === "session") {
        sessionStorage.removeItem(this.master);
      } else if (this.storage_type === "local") {
        localStorage.removeItem(this.master);
      }

      this.data = {};
      this.dirty = false;
    }
  }

  // DATA
  const interactionData = {
    1: {
      name: "Greet",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
      hate: [-1],
    },
    3: {
      name: "Talk to",
      phone: false,
      diary: false,
      friendship: [3, 2, 0],
      love: [0],
      hate: [-2],
    },
    4: {
      name: "Tell joke",
      phone: false,
      diary: true,
      friendship: [3, 2, 1],
      love: [0],
    },
    5: {
      name: "Tease",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
      hate: [-2],
    },
    6: {
      name: "Google-google",
      phone: false,
      diary: false,
      friendship: [5],
      hate: [-3],
    },
    7: {
      name: "Buy a drink",
      phone: false,
      diary: false,
      love: [3, 2],
      friendship: [0],
    },
    8: {
      name: "Hug",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    9: {
      name: "Kiss",
      priority: 11,
      phone: false,
      diary: true,
      love: [5],
      friendship: [0],
    },
    10: {
      name: "Kiss passionately",
      phone: false,
      diary: true,
      love: [5],
      friendship: [0],
    },
    11: {
      name: "Make love",
      priority: 6,
      phone: false,
      diary: true,
      sexual: true,
      snuggle: true,
      friendship: [0, -1],
      love: [5, 2, 3],
    },
    12: {
      name: "Tickle",
      phone: false,
      diary: true,
      love: [3, 2],
      friendship: [0],
    },
    13: {
      name: "5 minute quickie",
      phone: false,
      priority: 11,
      diary: true,
      sexual: true,
      snuggle: true,
      love: [3, 2, 1],
      friendship: [0, -1],
    },
    14: {
      name: "Compliment",
      phone: false,
      diary: false,
      friendship: [0],
      love: [3, 2],
    },
    15: {
      name: "Insult",
      phone: false,
      diary: false,
      hate: [5],
      friendship: [-4],
      love: [-2],
    },
    16: {
      id: 16,
      name: "Slap",
      hate: [5],
    },
    17: {
      id: 17,
      name: "Fight",
      hate: [10],
    },
    18: {
      name: "Play with",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
      hate: [-4],
    },
    19: {
      name: "Tantric sex",
      phone: false,
      priority: 5,
      diary: true,
      sexual: true,
      snuggle: true,
      friendship: [-1],
      love: [5, 2],
    },
    20: {
      name: "Spank",
      phone: false,
      diary: true,
      sexual: true,
      friendship: [0],
      love: [5, 3, 2],
    },
    21: {
      name: "Sing to",
      phone: false,
      diary: true,
      friendship: [3, 2, 1],
      love: [0],
    },
    22: {
      id: 22,
      name: "Moon",
    },
    24: {
      name: "Wazzup call",
      phone: true,
      priority: 100,
      diary: true,
      friendship: [3, 2],
      love: [0],
      hate: [-2],
    },
    25: {
      name: "Dirty call",
      phone: true,
      priority: 99,
      diary: true,
      friendship: [0],
      love: [5],
    },
    26: {
      name: "Prank call",
      phone: true,
      priority: 100,
      diary: true,
      friendship: [3, 2],
      love: [0],
    },
    29: {
      name: "Seek apprenticeship",
      phone: false,
      diary: true,
      friendship: [3, 0],
      love: [0],
    },
    30: {
      name: "Caress",
      phone: false,
      diary: false,
      friendship: [0],
      love: [5],
    },
    32: {
      name: "Give first aid",
      phone: false,
      diary: false,
    },
    33: {
      name: "Do funny magic",
      phone: false,
      diary: true,
      friendship: [-8],
      love: [0],
    },
    34: {
      name: "Have profound discussion",
      phone: false,
      diary: false,
      friendship: [5, 0],
      love: [0],
      hate: [-4],
    },
    35: {
      name: "Ask for a dance",
      phone: false,
      diary: true,
      love: [8, 7, 3],
      friendship: [0],
    },
    36: {
      name: "Evil eye",
      phone: false,
      diary: false,
      hate: [5],
    },
    37: {
      id: 37,
      name: "Strangle",
      hate: [10],
    },
    39: {
      name: "Bless",
      phone: false,
      diary: false,
      friendship: [2],
    },
    40: {
      name: "Curse",
      phone: false,
      diary: false,
    },
    41: {
      name: "Pull hair",
      phone: false,
      diary: false,
      hate: [2],
      friendship: [-2],
    },
    42: {
      id: 42,
      name: "Give finger",
      hate: [5],
    },
    44: {
      name: "Give massage",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
      hate: [-5],
    },
    45: {
      id: 45,
      name: "Shoot",
    },
    46: {
      name: "Kiss my arse call",
      phone: true,
      priority: 100,
      diary: false,
      hate: [10],
    },
    47: {
      id: 47,
      name: "Talk about old times",
      friendship: [5],
    },
    48: {
      id: 48,
      name: "Push",
      hate: [3],
    },
    49: {
      name: "Cane poke",
      phone: false,
      diary: false,
    },
    51: {
      name: "Comfort",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
      hate: [-5],
    },
    52: {
      name: "Hush",
      phone: false,
      diary: false,
    },
    53: {
      id: 53,
      name: "Scare",
      hate: [2],
      friendship: [-3],
    },
    54: {
      name: "Smile",
      phone: false,
      diary: false,
      friendship: [1, 0],
      love: [0],
      hate: [0, -1],
    },
    55: {
      name: "Shake hands",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
      hate: [-2],
    },
    56: {
      name: "Kiss cheeks",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    57: {
      name: "Fraternise",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    58: {
      name: "Send funny pic MMS",
      phone: true,
      priority: 100,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    59: {
      name: "Rub elbows",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    60: {
      name: "High five",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
      hate: [-4],
    },
    61: {
      name: "Send friendly text",
      phone: true,
      priority: 100,
      diary: false,
      friendship: [2],
      love: [0],
    },
    62: {
      name: "Share opinions",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
    },
    63: {
      name: "Pat on back",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
    },
    64: {
      name: "Embrace",
      phone: false,
      diary: false,
      friendship: [0],
      love: [5],
    },
    65: {
      name: "Gossip",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
    },
    66: {
      name: "Plait hair",
      phone: false,
      diary: false,
      love: [0],
      friendship: [5],
    },
    67: {
      name: "Arm wrestle",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
    },
    68: {
      name: "Offer advice",
      phone: false,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    69: {
      name: "Share secrets",
      phone: false,
      diary: true,
      friendship: [5],
      love: [-1],
    },
    70: {
      name: "Hang out",
      phone: false,
      diary: true,
      love: [-1],
      friendship: [5],
    },
    71: {
      name: "Hey sexy, how you doin'?",
      phone: false,
      diary: false,
      love: [3, 2],
      friendship: [0],
      hate: [-2],
    },
    72: {
      id: 72,
      name: "Poke eyes",
      hate: [5],
    },
    73: {
      name: "Flirty phone call",
      phone: true,
      priority: 100,
      diary: false,
      love: [3, 2],
      friendship: [0],
    },
    74: {
      name: "Flirty text",
      phone: true,
      priority: 100,
      diary: false,
      friendship: [0],
      love: [3, 2],
    },
    75: {
      name: "Praise",
      phone: false,
      diary: false,
      love: [5],
      friendship: [0],
    },
    76: {
      name: "Tell naughty joke",
      phone: false,
      diary: false,
      love: [5],
      friendship: [0],
    },
    77: {
      name: "Say I love you",
      phone: false,
      diary: true,
      friendship: [0],
      love: [5],
    },
    78: {
      name: "Serenade",
      phone: false,
      diary: true,
      friendship: [0],
      love: [5],
    },
    79: {
      name: "Piss off!",
      phone: false,
      diary: false,
      hate: [3, 2],
    },
    80: {
      name: "Send insulting text",
      phone: true,
      priority: 100,
      diary: false,
      hate: [2],
      friendship: [-3],
      love: [-3],
    },
    81: {
      name: "Badmouth",
      phone: false,
      diary: false,
      hate: [5],
    },
    82: {
      id: 82,
      name: "Wedgie",
      hate: [5],
    },
    83: {
      id: 83,
      name: "Your mum...",
      hate: [5],
    },
    84: {
      id: 84,
      name: "Yell",
      hate: [5],
      friendship: [-5],
    },
    85: {
      id: 85,
      name: "Scratch",
      hate: [5],
      friendship: [-5],
    },
    86: {
      id: 86,
      name: "Send bum MMS",
      hate: [3],
    },
    87: {
      id: 87,
      name: "I hate you!",
      hate: [5],
    },
    88: {
      id: 88,
      name: "Wrestle",
      hate: [5],
    },
    89: {
      name: "Flex biceps",
      phone: false,
      diary: false,
      love: [5],
      friendship: [0],
    },
    90: {
      name: "Babble",
      phone: false,
      diary: false,
    },
    91: {
      name: "Look",
      phone: false,
      diary: false,
    },
    92: {
      name: "Grin",
      phone: false,
      diary: false,
    },
    93: {
      name: "Pick up",
      phone: false,
      diary: false,
      friendship: [5],
      hate: [-4],
    },
    94: {
      name: "Guide",
      phone: false,
      diary: false,
      friendship: [3, 2],
    },
    95: {
      name: "Change nappies",
      phone: false,
      diary: false,
    },
    96: {
      name: "Sing lullaby",
      phone: false,
      diary: false,
      friendship: [5],
    },
    97: {
      name: "Badmouth parents",
      phone: false,
      diary: false,
      friendship: [3, 2],
    },
    98: {
      name: "Talk about hobbies",
      phone: false,
      diary: false,
      friendship: [5],
    },
    99: {
      name: "Hide and seek",
      phone: false,
      diary: false,
      friendship: [5],
    },
    100: {
      name: "Ask about stuff",
      phone: false,
      diary: false,
      friendship: [2],
    },
    101: {
      name: "Explain stuff",
      phone: false,
      diary: false,
      friendship: [5],
    },
    102: {
      name: "Ruffle hair",
      phone: false,
      diary: false,
      friendship: [2],
    },
    103: {
      name: "Kiss on forehead",
      phone: false,
      diary: false,
      friendship: [5],
    },
    104: {
      name: "Tell fairy tale",
      phone: false,
      diary: false,
      friendship: [5],
    },
    105: {
      id: 105,
      name: "When I was young...",
    },
    106: {
      name: "Admire",
      phone: false,
      diary: false,
      friendship: [3, 2],
    },
    107: {
      id: 107,
      name: "Bully",
      friendship: [-3],
      hate: [5],
    },
    108: {
      id: 108,
      name: "Brag about parents",
      friendship: [-2],
      hate: [2],
    },
    109: {
      id: 109,
      name: "Chase",
      friendship: [-2],
      hate: [3],
    },
    112: {
      id: 112,
      name: "Trip",
      friendship: [-2],
      hate: [5],
    },
    115: {
      id: 115,
      name: "Threaten",
      hate: [2],
    },
    117: {
      name: "Play marbles",
      phone: false,
      diary: false,
      friendship: [3, 2],
      hate: [-2],
    },
    121: {
      name: "Gossip on phone",
      phone: true,
      priority: 100,
      diary: false,
      friendship: [3, 2],
      love: [0],
    },
    129: {
      name: "Stroll hand in hand",
      phone: false,
      diary: false,
      love: [5],
      friendship: [0],
    },
    133: {
      id: 133,
      name: "Throw food at",
    },
    136: {
      id: 136,
      name: "Talk about the dead",
      friendship: [5],
      love: [0],
    },
    137: {
      name: "Scare",
      phone: false,
      diary: false,
    },
    139: {
      name: "Compare notes",
      phone: false,
      diary: false,
      friendship: [5],
      love: [0],
    },
    140: {
      id: 140,
      name: "Badmouth nanny",
    },
    141: {
      id: 141,
      name: "Build fort",
    },
    144: {
      name: "Argue about money",
      phone: false,
      diary: false,
    },
    145: {
      name: "Plan future",
      phone: false,
      diary: false,
    },
    146: {
      id: 146,
      name: "Do the dishes",
    },
    147: {
      id: 147,
      name: "Roleplay",
      friendship: [0],
    },
    149: {
      name: "Compliment partner",
      phone: false,
      diary: false,
      friendship: [3],
    },
    150: {
      id: 150,
      name: "Shave",
    },
    151: {
      name: "Squeeze love handles",
      phone: false,
      diary: false,
    },
    154: {
      name: "Please stop flirting with me.",
      phone: false,
      diary: false,
      friendship: [0],
      love: [-15],
    },
    155: {
      name: "Please don't fight with me.",
      phone: false,
      diary: false,
      friendship: [0],
      hate: [-15],
    },
    156: {
      name: "I don't want to be friends.",
      phone: false,
      diary: false,
      friendship: [-15],
      hate: [0],
      love: [0],
    },
    157: {
      name: "It's not you, it's me...",
      phone: true,
      priority: 100,
      diary: false,
      friendship: [-3],
      love: [-15],
    },
    159: {
      name: "Intimate Roleplay",
      phone: false,
      diary: true,
      sexual: true,
      love: [6],
      friendship: [0],
    },
    160: {
      name: "Scream",
      phone: false,
      diary: false,
      hate: [5],
      friendship: [3, 2],
    },
    161: {
      name: "Wink",
      phone: false,
      diary: false,
      love: [3, 2],
      friendship: [0],
      hate: [-2],
    },
    162: {
      id: 162,
      name: "Birthday call",
      love: [0],
      friendship: [0],
    },
    164: {
      name: "Enjoy Kobe Sutra",
      phone: false,
      diary: true,
      sexual: true,
      friendship: [0],
      love: [5],
    },
    165: {
      name: "Romantic call",
      phone: true,
      priority: 98,
      diary: true,
      friendship: [3, 2],
      love: [5],
    },
    166: {
      name: "Say I'm sorry",
      phone: false,
      diary: false,
      friendship: [0],
      hate: [-15],
      love: [0],
    },
    171: {
      id: 171,
      name: "Thank You call",
      friendship: [3, 2],
      hate: [-2],
    },
  };

  const categoryData = {
    forbidden: {
      name: "Forbidden",
      entries: [29, 33, 39, 151, 32, 66, 26],
      default: false,
    },
    anti_romance: {
      name: "Anti-Romance",
      entries: [154, 157],
      default: false,
    },
    anti_friendship: {
      name: "Anti-Friendship",
      entries: [156],
      default: false,
    },
    birthday: {
      name: "Birthday",
      entries: [],
      default: false,
    },
    best_friends: {
      name: "Best Friends",
      entries: [69, 70],
      default: false,
    },
    love: {
      name: "Love",
      entries: [77, 165],
      default: false,
    },
    romance: {
      name: "Romance",
      entries: [78, 129, 77, 165],
      default: false,
    },
    flirty: {
      name: "Flirty",
      entries: [7, 14, 71, 73, 74, 75, 76, 78, 89, 161],
      default: false,
    },
    flirty_physical: {
      name: "Flirty (Physical)",
      entries: [9, 10, 12, 30, 35, 64, 129],
      default: false,
    },
    friendly: {
      name: "Friendly",
      entries: [
        1, 3, 4, 5, 6, 18, 21, 24, 26, 33, 34, 51, 55, 57, 58, 60, 59, 61, 62,
        63, 65, 68, 69, 70, 92, 94, 96, 97, 98, 99, 100, 101, 104, 117, 121,
        139, 145, 47, 90, 106, 136, 140, 141, 146,
      ],
      default: false,
    },
    friendly_physical: {
      name: "Friendly (Physical)",
      entries: [8, 18, 44],
      default: false,
    },
    boring: {
      name: "Boring",
      entries: [34],
      default: false,
    },
    playful: {
      name: "Playful",
      entries: [18, 5, 44],
      default: false,
    },
    sexual: {
      entries: [20, 159],
      name: "Sexual",
    },
    favourite: {
      name: "Favourite",
      entries: [10, 18, 35, 44],
      default: false,
    },
    all: {
      name: "All",
      entries: [
        1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 24,
        25, 26, 29, 30, 32, 33, 34, 35, 36, 39, 40, 41, 44, 46, 49, 51, 52, 53,
        54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
        73, 74, 75, 76, 77, 78, 79, 80, 81, 89, 90, 91, 92, 93, 94, 95, 96, 97,
        98, 99, 100, 101, 102, 103, 104, 106, 107, 108, 109, 112, 117, 121, 129,
        136, 137, 139, 140, 141, 144, 145, 147, 149, 151, 154, 155, 156, 157,
        159, 160, 161, 162, 164, 165, 166, 171, 84, 16, 42, 48, 82, 83, 115, 47,
        17, 72, 85, 87, 88, 86, 37, 45,
      ],
      default: false,
    },
    snuggles: {
      entries: [11, 13, 19, 164],
      name: "Snuggles",
    },
    max: {
      name: "Max",
      entries: [
        62, 34, 51, 5, 57, 68, 14, 75, 76, 77, 69, 70, 18, 30, 60, 64, 9, 10,
        44, 101, 104, 94,
      ],
    },
    romantic: {
      name: "Romantic",
      entries: [],
    },
  };

  let behaviourData = {
    is_debug: false,
    parseDebug: function (
      rules,
      contact,
      is_phone,
      num_interactions,
      interactionSet
    ) {
      // Parses rules with dummy data
      contact = contact || {};
      is_phone = is_phone || false;
      num_interactions = num_interactions || 3;
      interactionSet =
        interactionSet || new InteractionSet(assistant.getInteractions());

      // todo: this should work a bit differently because we want to hit all the rules instead of going with the first non-null result
      try {
        this.is_debug = true;
        let result = this.parse(
          rules,
          contact,
          is_phone,
          num_interactions,
          interactionSet
        );
      } catch (e) {
        throw e;
      } finally {
        this.is_debug = false;
      }
    },
    // Returning functions
    error: function (message) {
      if (this.is_debug) {
        throw message;
      } else {
        // @todo: call log function instead
        debug("[ERROR] " + message);
        return null;
      }
    },
    yield: function (rule, choice) {
      debug("[INFO] Rule '" + rule + "' successfully yielded '" + choice + "'");
      return choice;
    },
    next: function (message) {
      // @todo: call log function instead
      debug("[INFO] " + message);
      return null;
    }, // End of returning functions
    parseRule: function (
      rule,
      index,
      contact,
      is_phone,
      num_interactions,
      interactionSet
    ) {
      // Check if this rule is chance-based
      let parts = rule.split("%");
      if (Array.isArray(parts) && parts.length > 1) {
        let chance = parseInt(parts.pop());

        if (!_.isInteger(chance)) {
          return this.error(
            "Failed to parse chance in rule '" +
              rule +
              "' (must resolve to integer)."
          );
        }

        let random = Math.round(Math.random() * 100);

        if (!this.is_debug && random > chance) {
          return this.next(
            "Skipping rule '" +
              rule +
              "' because of dice roll (rolled " +
              random +
              "/" +
              chance +
              ")"
          );
        }

        rule = parts.join("%");
      }

      let full = rule; // make a copy for logging
      let params = rule.split(":");
      rule = params.shift();

      if (this.behaviours.hasOwnProperty(rule)) {
        let choice = this.behaviours[rule](
          contact,
          is_phone,
          num_interactions,
          interactionSet,
          params
        );

        if (choice !== null) {
          return this.yield(full, choice);
        } else {
          return this.next(
            "Rule '" + full + "' was unable to come to a decision"
          );
        }
      } else {
        return this.error(
          "Rule '" + full + "' refers to non-existant behaviour; skipping"
        );
      }
    },
    parse: function (
      rules,
      contact,
      is_phone,
      num_interactions,
      interactionSet
    ) {
      debug("Parsing " + rules);
      this.behaviours.parent = this;

      // Rules are separated by semicolons
      rules = rules.split(";");

      let behaviours = this.behaviours;
      let result = null;
      let numRules = rules.length;

      for (let i = 0; i < numRules; i++) {
        let rule = rules[i];
        result = this.parseRule(
          rule,
          i,
          contact,
          is_phone,
          num_interactions,
          interactionSet
        );

        if (result !== null) {
          // A non-null value was returned (at this point, valid responses should be an integer)
          result = parseInt(result);

          if (!this.is_debug) {
            break; // First response is used, no need to check other behaviours
          }
        }
      } // End of processing rules; an interaction has either been chosen, or failed to get to a choice (result null)

      return result;
    },
    behaviours: {
      learn: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        // Find out what stats can be learned about
        let friendship =
          parseInt(contact.friendship_contact) < 100 &&
          parseInt(contact.friendship_contact) > 0;
        let love =
          parseInt(contact.love_contact) < 100 &&
          parseInt(contact.love_contact) > 0;
        let hate =
          parseInt(contact.hate_contact) < 100 &&
          parseInt(contact.hate_contact) > 0;

        debug(
          "Learn Love=" + love + ";Friendship=" + friendship + ";Hate=" + hate
        );

        if (!friendship && !love && !hate) {
          debug("Cannot learn anything!");
          return null; // Nothing to learn about!
        }

        // Find interactions that have unknown stat changes
        let subset = interactionSet.subset(function (interaction) {
          return (
            (friendship &&
              (!interaction.hasOwnProperty("friendship") ||
                !Array.isArray(interaction.friendship))) ||
            (love &&
              (!interaction.hasOwnProperty("love") ||
                !Array.isArray(interaction.love))) ||
            (hate &&
              (!interaction.hasOwnProperty("hate") ||
                !Array.isArray(interaction.hate)))
          );
        });

        //debug(subset.list());

        let choice = subset.chooseFrom(subset.list());
        //debug(JSON.stringify(subset.interactions[choice]));
        return choice;
      },
      if: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let result = null;

        let left = params.shift();
        let mode = params.shift();
        let right = params.shift();

        // Remainder of params belong to execute
        let exec = params.join(":");

        // Translate left and right to values
        // Left must be an attribute
        if (left.indexOf("contact.") === 0) {
          // Left should translate to a contact attribute
          let attr = left.replace("contact.", "");

          if (!contact.hasOwnProperty(attr)) {
            left = null;
          } else {
            left = contact[attr];
          }
        } else {
          throw "Left side of IF statement is not valid ('" + left + '")';
        }

        // Right must be true/false/number/string
        if (right === "true") {
          right = true;
        } else if (right === "false") {
          right = false;
        } else if (_.isFinite(parseInt(right))) {
          right = parseInt(right);
        } else {
          // Right will be treated as a string
          right = right.toString();
        }

        if (mode === "eq") {
          result = left === right;
        } else if (mode === "neq") {
          result = left !== right;
        } else if (mode === "lt") {
          result = left < right;
        } else if (mode === "lte") {
          result = left <= right;
        } else if (mode === "gt") {
          result = left > right;
        } else if (mode === "gte") {
          result = left >= right;
        } else {
          throw "Mode (operator) is invalid ('" + mode + "') ";
        }

        if (result || this.parent.is_debug) {
          return this.parent.parse(
            exec,
            contact,
            is_phone,
            num_interactions,
            interactionSet
          );
        } else {
          return null;
        }
      },
      max: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let max = 0;
        let type = params[0];

        if (params.length <= 1) {
          max = 100;
        } else {
          max = params[1];
        }

        // Check if max is reached
        if (type == "friendship" && contact.friendship_contact >= max) {
          return null;
        }
        if (type == "love" && contact.love_contact >= max) {
          return null;
        }
        if (type == "hate" && contact.hate_contact >= max) {
          return null;
        }

        // New method uses interaction data to find best available interaction
        let all = _.cloneDeep(interactionSet.interactions);

        all = _.filter(all, function (val) {
          return Array.isArray(val[type]) && val[type][0] > 0;
        });

        if (all.length <= 0) {
          return null;
        }

        let ordered = _.orderBy(all, [type.toString() + "[0]"], ["desc"]);

        // Best interaction is now on top
        return ordered[0].id;
      },
      skip: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        return 0;
      },
      lowest: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let maxVal = 100;
        let type = "";

        let types = [
          "hate:" + contact.hate_contact,
          "friendship:" + contact.friendship_contact,
          "love:" + contact.love_contact,
        ];

        types = types.sort((a, b) => {
          // Sort by lowest percentage
          return parseInt(a.split(":")[1]) > parseInt(b.split(":")[1]);
        });

        for (let i = 0; i < types.length; i++) {
          types[i] = types[i].split(":")[0];
        }

        // Let max handle picking the interaction
        while (types.length > 0) {
          let type = types.shift();
          let val = this.max(
            contact,
            is_phone,
            num_interactions,
            interactionSet,
            [type]
          );

          if (null !== val) {
            return val;
          }
        }

        return null;
      },
      remcat: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let cat = params.shift().split(",");
        let categories = assistant.getCategories(); //todo: referencing assistant here is dirty

        cat.forEach(function (name) {
          let interactions = interactionSet.resolveCategory(categories[name]);
          interactionSet.remove(interactions);
        });

        return null;
      },
      cat: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let type = null;
        let cat = null;

        if (params.length > 0) {
          cat = params[0]; // Cat is first param
        }

        if (params.length > 1) {
          type = params[1]; // Type is second param
        }

        let category = assistant.getCategories()[cat]; //todo: referencing assistant here is dirty

        if (!category) {
          throw "Invalid category '" + cat + "'";
        }

        let ids = interactionSet.resolveCategory(category);

        // Select a random interaction from a category
        if (type === null) {
          return interactionSet.randomFrom(ids);
        } else if (type == "friendship") {
          return interactionSet.friendship(ids);
        } else if (type == "love") {
          return interactionSet.love(ids);
        } else if (type == "hate") {
          return interactionSet.hate(ids);
        }

        throw "Unknown type '" + type + "'";
      },
      any: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let type = null;

        if (params.length > 0) {
          type = params[0];
        }

        let ids = interactionSet.list();

        if (type === null) {
          return interactionSet.chooseFrom(ids);
        } else if (type == "friendship") {
          return interactionSet.friendship(ids);
        } else if (type == "love") {
          return interactionSet.love(ids);
        } else if (type == "hate") {
          return interactionSet.hate(ids);
        }

        throw "Unknown type '" + type + "'";
      },
      stop: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let num = parseInt(params[0]);
        num_interactions = parseInt(num_interactions);

        if (is_phone) {
          // does not work with phone!
          debug("Aborting stop rule; does not support phone interactions!");
          return null;
        }

        if (num >= num_interactions) {
          return 0; // zero marks this choice as failed
        }

        return null;
      },
      type: function (
        contact,
        is_phone,
        num_interactions,
        interactionSet,
        params
      ) {
        let type = params[0];

        if (type === "friendship") {
          return interactionSet.friendship();
        } else if (type === "love") {
          return interactionSet.love();
        } else if (type === "hate") {
          return interactionSet.hate();
        }

        throw "invalid type!";
      },
    },
  };

  const groupData = {
    lover: {
      behaviour:
        "if:contact.love_self:lt:50:remcat:snuggles;cat:snuggles;cat:sexual%50;max:love;stop:1;lowest;stop:2%50;cat:favourite;any",
      categories: {
        flirty: "w",
        flirty_physical: "w",
        love: "b",
        romance: "b",
        forbidden: "b",
        friendly: "w",
        friendly_physical: "w",
        best_friends: "b",
        snuggles: "w",
        sexual: "w",
      },
      permissions: {
        friendship: "react",
        love: "allow",
        hate: "forbid",
      },
      foreground_color: "azure",
      background_color: "mediumpurple",
    },
    romantic: {
      behaviour:
        "if:contact.love_self:lt:50:remcat:snuggles;cat:snuggles;cat:romance%25;cat:sexual%50;max:love;stop:1;lowest;cat:romance;stop:2%50;cat:favourite;any",
      categories: {
        best_friends: "b",
        flirty: "w",
        flirty_physical: "w",
        friendly: "w",
        friendly_physical: "w",
        boring: "b",
        sexual: "w",
        snuggles: "w",
        forbidden: "b",
        romance: "w",
      },
      permissions: {
        friendship: "allow",
        love: "allow",
        hate: "forbid",
      },
      foreground_color: "azure",
      background_color: "orchid",
    },
    friend: {
      behaviour: "cat:favourite%50;lowest;stop:2%50;any",
      categories: {
        friendly: "w",
        friendly_physical: "w",
        forbidden: "b",
      },
      permissions: {
        friendship: "allow",
        love: "forbid",
        hate: "forbid",
      },
      foreground_color: "azure",
      background_color: "steelblue",
    },
    enemy: {
      name: "Enemy",
      behaviour: "learn;lowest;any",
      categories: {
        all: "w",
        forbidden: "b",
      },
      permissions: {
        hate: "allow",
        love: "forbid",
        friendship: "forbid",
      },
      foreground_color: "azure",
      background_color: "black",
    },
  };

  // CLASSES
  class InteractionSet {
    constructor(interactionData) {
      this.interactions = {};
      Object.assign(this.interactions, interactionData);
    }

    has(id) {
      return this.interactions.hasOwnProperty(id);
    }

    filter(callback) {
      let filtered = {};

      Object.keys(this.interactions).forEach((interaction_id) => {
        // Make ID available to callback through object property
        this.interactions[interaction_id].id = parseInt(interaction_id);

        if (callback(this.interactions[interaction_id])) {
          filtered[interaction_id] = this.interactions[interaction_id];
        }
      });

      this.interactions = filtered;
    }

    /**
     * Removes all interactions with ids appearing in the provided array
     */
    remove(array) {
      array.forEach((id) => {
        if (this.interactions.hasOwnProperty(id)) {
          delete this.interactions[id];
        }
      });
    }

    add(interactions) {
      _.merge(this.interactions, interactions);
    }

    subset(callback) {
      let sub = new InteractionSet(this.interactions);
      sub.filter(callback);
      return sub;
    }

    resolveCategory(category) {
      if (!category || !category.hasOwnProperty("entries")) {
        throw "Category is expected to be an object with an 'entries' key";
      }

      return category.entries;
    }

    randomFrom(ids) {
      let subset = this.subset((interaction) => {
        return ids.indexOf(interaction.id) !== -1;
      });

      let result = subset.chooseRandom();

      return result;
    }

    chooseRandom() {
      // Picks a random interaction, taking into account interaction priority

      // Split available interactions based on their priority
      let prioritized = {};

      Object.keys(this.interactions).forEach((key) => {
        let interaction = this.interactions[key];

        if (!interaction.hasOwnProperty("priority")) {
          interaction.priority = 10;
        }

        let priority = String(interaction.priority);

        if (!prioritized.hasOwnProperty(priority)) {
          prioritized[priority] = {};
        }

        prioritized[priority][key] = interaction;
      });

      let result = null;

      // Loop through sorted keys until we get a result
      Object.keys(prioritized)
        .sort()
        .forEach((key) => {
          result = this.chooseFrom(Object.keys(prioritized[key]));

          if (result) {
            return;
          }
        });

      return result;
    }

    // legacy; should not be used
    chooseFrom(list) {
      let size = list.length;

      if (size <= 0) {
        return null;
      }

      // List is allowed to either be an array of arrays, or an array of ids
      if (Array.isArray(list[0])) {
        // Recursively call each item until a non-null value is returned
        let value = null;

        for (let i = 0; i < size; i++) {
          value = this.chooseFrom(list[i]);
          if (null !== value) {
            return value;
          }
        }

        // None of the entries provided a result
        return null;
      }

      // If the first item of the list is not an array, it is assumed that each  item is an id
      // First remove all items that do not appear in this object's interactions list
      let availableIds = Object.keys(this.interactions);

      if (list[0] === "*") {
        // Asterisk is a special case that should match any available id
        list = availableIds;
      } else {
        // Otherwise reduce the list to the available choices
        list = list.filter(function (listItem) {
          if (null === listItem || listItem.toString().length <= 0) {
            return false;
          }

          return availableIds.indexOf(listItem.toString()) !== -1;
        });
      }

      // Re-count
      size = list.length;

      if (size > 0) {
        // Pick a random entry from list
        let rand = Math.floor(Math.random() * size);
        return list[rand];
      }

      return null;
    }

    friendship(list) {
      // Create a subset of friendship-type interactions
      let sub = this.subset((interaction) => {
        return interaction.type === "friendship";
      });

      // Now choose
      return sub.chooseFrom(list);
    }

    love(list) {
      // Create a subset of friendship-type interactions
      let sub = this.subset((interaction) => {
        return interaction.type === "love";
      });

      // Now choose
      return sub.chooseFrom(list);
    }

    hate(list) {
      // Create a subset of friendship-type interactions
      let sub = this.subset((interaction) => {
        return interaction.type === "hate";
      });

      // Now choose
      return sub.chooseFrom(list);
    }

    list() {
      return Object.keys(this.interactions);
    }
  }

  let parseCharacterData = function () {
    // This must be done to make the authenticated character known to the script
    try {
      if (window.location.href.indexOf("/ChooseCharacter") !== -1) {
        // The select character page discloses the character ids
        let content = document.getElementById("ppm-content");
        let buttons = content.querySelectorAll('input[type="submit"]');
        let characterMap = [];

        for (let i = 0, len = buttons.length; i < len; i++) {
          let id =
            buttons[i].parentNode.parentNode.querySelector(
              "div.idHolder"
            ).innerText;
          let name =
            buttons[i].parentNode.parentNode.querySelector("h2 a").innerText;
          characterMap[i] = id + ":" + name;
        }

        // Store the data for use on other pages
        window.localStorage.setItem("characterMap", characterMap.join(","));
      } else {
        let characterMap = window.localStorage.getItem("characterMap");

        if (!characterMap) {
          // Character map is not available; cannot run the script
          throw "Character map is unavailable!";
        } else {
          characterMap = characterMap.split(",");
        }

        let dropdown = document.querySelector(
          "#character-tools-character select"
        );

        // Select all option elements in the dropdown
        let options = dropdown.querySelectorAll("option");

        if (characterMap.length > 0) {
          if (characterMap.length + 1 !== options.length) {
            alert(
              "CharacterMap appears to be invalid. Try logging out and back in again."
            );
          } else {
            let temp = {};

            for (let i = 0, len = characterMap.length; i < len; i++) {
              let name = btoa(characterMap[i].split(":")[1]);
              let id = characterMap[i].split(":")[0];

              temp[name] = id;
            }

            characterMap = temp;
          }
        }

        // Set attribute on each option
        for (let i = 0, len = options.length; i < len; i++) {
          options[i].setAttribute(
            "data-id",
            characterMap[btoa(options[i].innerHTML.split(' (')[0])]
          );
        }

        // Now find the authenticated character's id and attach it as data to the document body
        let selectedOption = dropdown.querySelector("option[selected]");
        let selectedValue = selectedOption.getAttribute("data-id");

        if (selectedValue && selectedValue !== "undefined") {
          document.body.dataset.character_name = selectedOption.innerText;
          document.body.dataset.character_id = selectedValue;
        } else {
          throw "Failed to parse character data from character select box!";
        }
      }
    } catch (e) {
      debug("CharacterMap could not be found/built: " + e);
    }
  };

  let modifyBody = function () {
    // Workaround for Popmundo's weird optgroup handling
    const interactionSelect = document.querySelector("select.optgroups");

    if (interactionSelect) {
      interactionSelect.classList.remove("optgroups"); // Prevents their javascript from picking up the select
      // All this stuff is just mimicking their javascript, minus the breakage
      const options = interactionSelect.querySelectorAll("option");
      const groups = {};

      for (const option of options) {
        if (option.dataset.group) {
          if (!groups.hasOwnProperty(option.dataset.group)) {
            const newElement = document.createElement("optgroup");
            newElement.label = option.dataset.group;
            interactionSelect.insertAdjacentElement("beforeend", newElement);
            groups[option.dataset.group] = newElement;
          }

          groups[option.dataset.group].insertAdjacentElement(
            "beforeend",
            option
          );
        }
      }

      interactionSelect.selectedIndex = 1;
      // JUST WHY?!?!?!?!?
    }

    // Inject styles
    GM_addStyle(`
          #character-tools-character select option { color:#000; }
          .collapsed { display: none; }
          div.assistant-controls-container {
              position:fixed;
              bottom:0;
              left:0;
              width:100%;
              display:flex;
              justify-content:center;

          }
          div.assistant-controls {
              background-color: #EFEFEF;
              width:800px;
              border-radius: 30px 30px 0 0;
              border: 1px solid #CFCFCF;
              display:flex;
              justify-content:center;
          }
          div.assistant-controls button {
              margin:5px;
              width:100px;
          }
          .modal {
              position:fixed;
              z-index: 101;
              top: 0;
              left: 0;
              height:100%;
              width:100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #000;
          }
          .modal-background {
              position:fixed;
              top:0;
              left:0;
              background: rgba(0,0,0,0.5);
              width:100%;
              height:100%;
              z-index:100000;
          }
          .modal-content {
              background-color: #EFEFEF;
              padding:15px;
              border: 1px solid #CFCFCF;
              border-radius: 5px;
              z-index:100001;
              width:800px;
              max-height:85%;
              opacity:0.8;
              transition: opacity 0.5s;
              overflow-y:auto;
          }
          .modal-content:hover {
              opacity: 1;
          }
          .close {
              float:right;
              cursor:pointer;
          }
          .a_yes {
              background-color:#99FF99;
              cursor:pointer;
              user-select:none;
              text-align:center;
          }
          .a_no {
              background-color:#FF9999;
              cursor:pointer;
              user-select:none;
              text-align:center;
          }
          .a_default {
              background-color:#999999;
              cursor:pointer;
              user-select:none;
              text-align:center;
          }
          .a_tab {
              border-bottom:none;
          }
          .a_tabs {
              border-bottom:1px solid #999999;
          }
          fieldset.assistant {
              border-radius: 3px;
              border: 1px solid rgba(0,0,0,0.25);
              background-color:rgba(255,255,255, 0.25);
              margin-bottom: 10px;
          }
          fieldset.assistant legend {
              border-radius: 3px;
              border: 1px solid rgba(0,0,0,0.25);
              background-color:rgba(255,255,255, 0.25);
              font-weight:bold;
              padding:3px;
          }
          .assistant div.error {
              padding: 3px;
              border-radius: 2px;
              margin:3px;
              background-color: rgb(255,200,200);
          }
          tr.group-toggle {
              cursor: pointer;
          }
          span.pa-info {
              cursor: pointer;
          }
          tr.pa-inactive-relation {
outline: 3px dotted red;
          }
      `);

    // Inject assistant container
    let assistantDiv = document.createElement("div");
    assistantDiv.id = "assistant";
    document.body.insertAdjacentElement("beforeend", assistantDiv);

    // Inject component tags
    assistantDiv.insertAdjacentHTML(
      "beforeend",
      "<assistant-controls></assistant-controls>"
    );
    assistantDiv.insertAdjacentHTML(
      "beforeend",
      "<assistant-settings></assistant-settings>"
    );
    assistantDiv.insertAdjacentHTML(
      "beforeend",
      "<assistant-interact></assistant-interact>"
    );
    //assistantDiv.insertAdjacentHTML("beforeend", "<assistant-contacts></assistant-contacts>");
    assistantDiv.insertAdjacentHTML(
      "beforeend",
      "<assistant-interactions-guide></assistant-interactions-guide>"
    );
  };

  const bus = new Vue();

  let assistant = {
    parsers: [],
    modules: {},
    config: {
      version: 2,
      navigate_delay: 1000,
    },

    init: function () {
      this._character_id = document.body.dataset.character_id || null;
      this._character_name = document.body.dataset.character_name || null;

      if (null === this._character_id || null === this._character_name) {
        throw "Could not initialize Assistant; character ID is not known.";
      }

      this._loaded = Date.now();

      // EventBus to make communication between Vue components and Assistant easier
      this.$bus = bus;

      // Todo: update group, category and interaction information from remote url
      this.data = {};

      let character_repository = new Repository(
        "character_" + this._character_id,
        "database"
      );
      let global_repository = new Repository("global", "database");
      let session_repository = new Repository("session", "session");
      let context_repository = new Repository("context", "memory");

      this.repository = {
        character: character_repository,
        global: global_repository,
        session: session_repository,
        context: context_repository,
      };

      // Save data before unloading window
      window.onbeforeunload = () => {
        this.save();
      };

      this.urls = {
        contacts:
          document.location.origin +
          "/World/Popmundo.aspx/Character/Relations/" +
          this._character_id,
        character: function (id) {
          return (
            document.location.origin + "/World/Popmundo.aspx/Character/" + id
          );
        },
        character_focus: function (id) {
          return (
            document.location.origin +
            "/World/Popmundo.aspx/Character/Focus/" +
            id
          );
        },
        items: function () {
          return (
            document.location.origin + "/World/Popmundo.aspx/Character/Items"
          );
        },
        move_locale: function (id) {
          return (
            document.location.origin +
            "/World/Popmundo.aspx/Locale/MoveToLocale/" +
            id
          );
        },
        characterInventory: function (id) {
          return (
            document.location.origin +
            "/World/Popmundo.aspx/Character/Items/" +
            id
          );
        },
      };
    },

    start: function () {
      // Parse data available on this page
      this.parse(document);
      this.runModules(document);

      //this.interactionsModule.parent = this;         // A hack to make parent available to sub modules
      //this.interactionsModule.interactions(true);    // Check if interactions is active (true makes it fail silently)
    },

    runModules: function () {
      Object.keys(this.modules).forEach((key) => {
        try {
          this.modules[key].run(document);
        } catch (e) {
          debug("Module " + key + " failed to run: " + e.toString());
        }
      });
    },

    addModule: function (module) {
      module.setAssistant(this);
      let name = module.getName();

      this.modules[name] = module;
    },

    // Repository functions
    load: function (refresh) {
      // No longer needed!
    },

    save: function () {
      // Save all repositories
      Object.keys(this.repository).forEach((key) => {
        this.repository[key].save();
      });
    },

    get: function (key, default_value) {
      return this.repository.character.get(key, default_value);
    },

    set: function (key, value) {
      return this.repository.character.set(key, value);
    },

    getGlobal: function (key, default_value) {
      return this.repository.global.get(key, default_value);
    },

    setGlobal: function (key, value) {
      return this.repository.global.set(key, value);
    },

    getNew(key, defaultValue) {
      key = this.transformNewKey(key);
      debug(`Reading ${key}`);
      return GM_getValue(key, defaultValue);
    },

    setNew(key, value) {
      key = this.transformNewKey(key);
      debug(`Writing ${key}`);
      GM_setValue(key, value);
    },

    deleteNew(key, value) {
      key = this.transformNewKey(key);
      debug(`Deleting ${key}`);
      GM_deleteValue(key, value);
    },

    transformNewKey(key) {
      key = key.replace("$character$", `c${this._character_id}`);
      return key;
    },

    getGroups: function () {
      if (!this.__groups) {
        let defaultGroups = this.getGlobal("default.groups.data", groupData);
        let userGroups = this.getGlobal("user.groups.data", {});
        let combined = {};

        _.merge(combined, defaultGroups, userGroups);

        this.__groups = combined;
      }

      return _.cloneDeep(this.__groups);
    },

    setGroups: function (groups) {
      // Modify only data that is not default
      let defaultGroups = this.getGlobal("default.groups.data", groupData);

      // Save only values that were modified from default
      let userGroups = this.object_diff(groups, defaultGroups);

      this.setGlobal("user.groups.data", userGroups);
      this.__groups = groups;
    },

    getInteractions: function () {
      if (!this.__interactions) {
        let defaultInteractions = this.getGlobal(
          "default.interactions.data",
          interactionData
        );
        let userInteractions = this.getGlobal("user.interactions.data", {});
        let combined = {};

        _.merge(combined, defaultInteractions, userInteractions);

        this.__interactions = combined;
      }

      return _.cloneDeep(this.__interactions);
    },

    setInteractions: function (interactions, as_default) {
      // Scrub invalid properties
      Object.keys(interactions).forEach((key) => {
        if (interactions[key].hasOwnProperty("type")) {
          delete interactions[key]["type"];
        }
      });

      if (as_default) {
        this.setGlobal("default.interactions.data", interactions);
        this.save();
      }

      let defaultInteractions = this.getGlobal(
        "default.interactions.data",
        interactionData
      );

      // Save only values that were modified from default
      let userInteractions = this.object_diff(
        interactions,
        defaultInteractions
      );

      this.setGlobal("user.interactions.data", userInteractions);
      this.__interactions = interactions;
    },

    getCategories: function () {
      if (!this.__categories) {
        let defaultCategories = this.getGlobal(
          "default.categories.data",
          categoryData
        );
        let userCategories = this.getGlobal("user.categories.data", {});

        this.__categories = _.merge(userCategories, defaultCategories);
      }

      return _.cloneDeep(this.__categories);
    },

    setCategories: function (categories) {
      // Modify only data that is not default
      let defaultCategories = this.getGlobal(
        "default.categories.data",
        categoryData
      );

      // Save only values that were modified from default
      let userCategories = this.object_diff(categories, defaultCategories);

      this.setGlobal("user.categories.data", userCategories);
      this.__categories = categories;
    },

    object_diff(new_values, old_values, no_return) {
      let recursive = function (new_values, old_values, no_return) {
        let changes = {};

        Object.keys(new_values).forEach((key) => {
          let value = new_values[key];

          if (!old_values.hasOwnProperty(key)) {
            changes[key] = value;
            return;
          }

          if (!_.isObject(value) || _.isArray(value)) {
            if (!_.isEqual(value, old_values[key])) {
              changes[key] = value;
            }

            return;
          }

          let temp = recursive(new_values[key], old_values[key], true);

          if (temp) {
            changes[key] = temp;
          }
        });

        if (no_return && Object.keys(changes) <= 0) {
          return;
        }

        return changes;
      };

      return recursive(new_values, old_values, no_return);
    },

    // Extended repository functions
    getContacts: function () {
      return this.get("relationships", {});
    },

    getContact: function (id) {
      return this.get("relationships" + "." + id, {});
    },

    setContact: function (contact) {
      if (!this.get("relationships")) {
        this.set("relationships", {});
      }

      /*if (! this.get('relationships.' + contact.id)) {
              this.set('relationships.' + contact.id, {});
          }*/

      this.set("relationships" + "." + contact.id, contact);
    },

    setContactAttribute: function (id, attribute, value) {
      this.set("relationships" + "." + id + "." + attribute, value);
    },

    // Navigation functions
    navigate: function (to) {
      // Navigate will return true if the current location is the same as the "to" destination
      if (!to) {
        throw "Navigate called with invalid 'to' argument!";
      }

      if (to.indexOf("undefined") !== -1) {
        throw "Nagivate cancelled because 'undefined' was detected in destination!";
      }

      if (this.navigating) {
        throw "Navigation already in progress!";
      }

      // todo: fail if max navigation attempts exceeded (3 ish?)

      if (document.location.href == to) {
        // Return true if when destination is reached
        return true;
      }

      // Navigate to provided destination
      this.navigating = true;

      this.nav_timer = setTimeout(() => {
        window.location.href = to;
      }, this.config.navigate_delay);

      return false;
    },

    navigateElement: function (element, supressConfirmation = false) {
      if (!element) {
        throw "navigateElement called with invalid 'element' argument!";
      }

      if (this.navigating) {
        throw "Navigation already in progress!";
      }

      // Navigate by clicking on the element
      this.navigating = true;

      this.nav_timer = setTimeout(() => {
        if (supressConfirmation) {
          unsafeWindow.jQuery(element).off("click");
        }

        element.click();
      }, this.config.navigate_delay);
    },

    stopNavigation: function () {
      clearTimeout(this.nav_timer);
      debug("[INFO] Stopped navigation");
      this.navigating = false;
    },

    parse: function (doc) {
      // Parse data from the given document
      this.parsers.forEach((parser) => {
        if (!parser.hasOwnProperty("name")) {
          debug("[WARNING] Parser does not have a name attribute!");
        }

        try {
          parser.parse(doc, this);
        } catch (e) {
          debug(
            "[WARNING] Parser " +
              parser.name +
              ' failed with exception "' +
              e +
              '"'
          );
        }
      });
    },
  };

  assistant.addModule({
    getName: function () {
      return "bookshow";
    },

    setAssistant: function (assistant) {
      this.assistant = assistant;
    },

    run: function (context) {
      if (context.location.href.indexOf("Artist/BookShow") === -1) {
        return;
      }

      let search = false;

      // Parse hash data
      if (context.location.hash.length > 0) {
        window.sessionStorage.setItem(
          "bookshow_hash",
          decodeURI(context.location.hash)
        );
      }

      let hashData = window.sessionStorage.getItem("bookshow_hash") || "";
      hashData = hashData.substr(1).split(",");

      const parsedHashData = {};

      for (let part of hashData) {
        part = part.toLowerCase().split(":");
        if (part.length === 2) {
          parsedHashData[part[0]] = part[1];
        }
      }

      debug(parsedHashData);

      // Attempt to select city
      if (parsedHashData.hasOwnProperty("city")) {
        const citySelect = context.querySelector(
          "#ctl00_cphLeftColumn_ctl01_ddlCities"
        );
        const city = parsedHashData.city.replace(/_/g, " ");

        if (citySelect.selectedOptions[0].innerText.toLowerCase() !== city) {
          for (let option of citySelect.options) {
            if (option.innerText.toLowerCase() === city) {
              citySelect.value = option.value;
              citySelect.onchange();
              break;
            }
          }

          return;
        }
      }

      // Select date
      if (parsedHashData.hasOwnProperty("date")) {
        const dateSelect = context.querySelector(
          "#ctl00_cphLeftColumn_ctl01_ddlDays"
        );
        const dateString = moment(parsedHashData.date).format("YYYY-MM-DD");
        debug(dateString);

        for (let option of dateSelect.options) {
          if (option.value === dateString) {
            dateSelect.value = option.value;
          }
        }
      }

      // Select time
      if (parsedHashData.hasOwnProperty("time")) {
        const timeSelect = context.querySelector(
          "#ctl00_cphLeftColumn_ctl01_ddlHours"
        );

        const timeString =
          (parsedHashData.time === "12" ? "14" : parsedHashData.time) +
          ":00:00";
        debug(timeString);

        for (let option of timeSelect.options) {
          if (option.value === timeString) {
            timeSelect.value = option.value;
            search = true;
          }
        }
      }

      window.sessionStorage.removeItem("bookshow_hash");

      if (search) {
        context
          .querySelector("#ctl00_cphLeftColumn_ctl01_btnFindClubs")
          .click();
      }

      const table = context.querySelector("#tableclubs");
      const bookBtn = context.querySelector(
        "#ctl00_cphLeftColumn_ctl01_btnBookShow"
      );

      if (table) {
        const rows = table.querySelectorAll("tbody tr");

        for (let row of rows) {
          const cells = row.querySelectorAll("td");
          const input = row.querySelector('input[type="radio"]');

          if (input && input.disabled) {
            debug("adding hidden row");
            row.classList.add("hidden");
          }

          if (input) {
            input.addEventListener("change", (e) => {
              debug("changed");
              bookBtn.click();
            });
          }

          const starValue = parseInt(
            cells[2].querySelector("span.sortkey").innerText
          );
          if (starValue < 50) {
            debug("adding hidden row");
            row.classList.add("hidden");
          }
        }

        setTimeout(() => {
          context.querySelector("th.right.header").click();
        }, 250);
      }
    },
  });

  assistant.addModule({
    getName: function () {
      return "Enhancement";
    },

    setAssistant: function (assistant) {
      this.assistant = assistant;
    },

    run: function (context) {
      if (this.assistant.getGlobal("enhanceProgressBars", true)) {
        this.modifyProgressBars(context);
      }

      if (this.assistant.getGlobal("enhanceScoringText", true)) {
        this.modifyScoringLinks(context);
      }

      this.modifyCharacterLinks(context);
      this.modifyTableGroups(context);
      // todo: This is not ready yet
      //this.modifyCollapsable(context);

      this.modifyExternalLinks(context);
      this.modifyDates(context);
      this.modifyFocusPage(context);
      this.modifySongCreatePage(context);

      this.modifyCharacterDropdown(context);
    },

    modifySongCreatePage(context) {
      if (!context.location.href.endsWith("Character/SongCreate")) return;

      const songTitleInput = context.querySelector(
        "#ctl00_cphLeftColumn_ctl00_txtSongName"
      );
      if (!songTitleInput) return;

      const pickSongButton = context.createElement("button");
      pickSongButton.innerText = "Load";

      songTitleInput.parentElement.style.display = "flex";
      //songTitleInput.insertAdjacentElement("afterend", pickSongButton);
    },

    modifyCharacterDropdown(context) {
      // Check for pending messages
      if (
        document.querySelector(
          "#character-tools-shortcuts img[src$='pending.png']"
        )
      ) {
        assistant.setNew(`$character$_select_messages`, true);
      } else {
        assistant.setNew(`$character$_select_messages`, false);
      }

      const select = context.querySelector("#character-tools-character select");
      if (!select) return;

      // Defer until select is actually opened
      select.addEventListener("focus", (e) => {
        if (e.target.dataset.pa_loaded) {
          return;
        } else {
          e.target.dataset.pa_loaded = true;
        }

        const characterSelectOptions = e.target.querySelectorAll(
          "#character-tools-character select option"
        );

        for (let option of Array.from(characterSelectOptions)) {
          if (option.dataset.id) {
            let backgroundColor = assistant.getNew(
              `c${option.dataset.id}_select_color`,
              null
            );
            let order = assistant.getNew(
              `c${option.dataset.id}_select_order`,
              9999 + 1
            );
            let focus = assistant.getNew(
              `c${option.dataset.id}_focus_work`,
              null
            );
            let focusExtra = assistant.getNew(
              `c${option.dataset.id}_focus_work_extra`,
              null
            );

            let hasMessages = assistant.getNew(
              `c${option.dataset.id}_select_messages`,
              false
            );

            option.dataset.pa_order = order;

            if (backgroundColor) {
              option.style.backgroundColor = backgroundColor;
            }

            if (focus) {
              if (mapFocusWork.hasOwnProperty(focus)) {
                focus = mapFocusWork[focus];
              }
              if (focusExtra) {
                focusExtra = focusExtra.split(" ");
                focus += ` ${focusExtra[focusExtra.length - 1]}`;
              }
              option.innerText = `${hasMessages ? "📥 " : ""}${
                option.innerText
              } (${focus})`;
            }
          } else {
            option.dataset.pa_order = 9999 + 2;
          }
        }

        Array.from(characterSelectOptions)
          .sort((a, b) => {
            return parseInt(a.dataset.pa_order) > parseInt(b.dataset.pa_order);
          })
          .forEach((option) => {
            select.appendChild(option);
          });
      });
    },

    modifyFocusPage(context) {
      if (context.location.href.indexOf("Character/Focus") !== -1) {
        const workFocusMenuSelector = "#ctl00_cphLeftColumn_ctl01_ddlWorkTypes";
        const workFocusMenu = context.querySelector(workFocusMenuSelector);

        if (!workFocusMenu) {
          debug(
            `Unable to detect workFocusMenu on "${context.location.href}" with selector "${workFocusMenuSelector}".`
          );
        }

        const workSelect = context.querySelector(
          "#ctl00_cphLeftColumn_ctl01_ddlWorkTypes"
        );
        const workExtraSelect = context.querySelector(
          "#ctl00_cphLeftColumn_ctl01_ddlExtras"
        );

        if (workSelect) {
          assistant.setNew("$character$_focus_work", workSelect.value);
        }

        if (workExtraSelect) {
          assistant.setNew(
            "$character$_focus_work_extra",
            workExtraSelect.selectedOptions[0].innerText
          );
        } else {
          assistant.deleteNew("$character$_focus_work_extra");
        }
      }
    },

    modifyDates(context) {
      let dateformat = this.assistant.getGlobal("dateformat", "DD.MM.YYYY");

      if (context.location.href.indexOf("PuppetMaster") !== -1) {
        let lastLoginCell = document.querySelector(
          "#ppm-content div.box:nth-of-type(2) tr:nth-of-type(5) td:nth-of-type(2)"
        );
        let lastLoginDate = moment(lastLoginCell.innerText, dateformat);

        let diff = moment().diff(lastLoginDate, "days");

        lastLoginCell.innerText =
          lastLoginCell.innerText + ` (${diff} days ago)`;

        if (diff < 7) {
          lastLoginCell.style.color = "green";
        } else if (diff < 30) {
          lastLoginCell.style.color = "yellow";
        } else if (diff < 40) {
          lastLoginCell.style.color = "orange";
        } else if (diff < 50) {
          lastLoginCell.style.color = "red";
        } else {
          lastLoginCell.style.color = "black";
          lastLoginCell.style.background = "red";
        }
      }
    },

    modifyExternalLinks(context) {
      let links = context.body.querySelectorAll("a");

      let isYoutubeVideoLink = function (href) {
        let result =
          /youtube\.com\/watch\?v=([A-Za-z0-9\-_]+)|youtu\.be\/([A-Za-z0-9\-_]+)/.exec(
            href
          );

        if (result) {
          return result[1] || result[2];
        }

        return false;
      };

      let embedYoutube = function (element, video) {
        if (element.dataset.expanded && element.dataset.expanded === "true") {
          element.nextSibling.remove();

          element.innerText = " [+]";
          element.dataset.expanded = false;
        } else {
          let iframe = context.createElement("iframe");
          iframe.src = `https://www.youtube.com/embed/${video}`;
          iframe.allow =
            "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
          iframe.setAttribute("allowfullscreen", true);
          iframe.setAttribute("frameborder", "0");
          iframe.style.width = "100%";
          iframe.style.height = "300px";
          iframe.style.margin = "0.25rem";
          element.insertAdjacentElement("afterend", iframe);

          element.innerText = " [-]";
          element.dataset.expanded = true;
        }
      };

      for (let link of links) {
        let video = isYoutubeVideoLink(link.href);

        if (video) {
          let expando = context.createElement("span");

          expando.innerText = " [+]";
          expando.style.cursor = "pointer";
          expando.style.fontFamily = "monospace";

          expando.addEventListener("click", function () {
            embedYoutube(this, video);
          });

          link.insertAdjacentElement("afterend", expando);
          link.addEventListener("click", function (e) {
            e.preventDefault();
            expando.click();
          });
        }
      }
    },

    modifyProgressBars: function (context) {
      let bars = context.querySelectorAll("div.progressBar");
      let greenBars = context.querySelectorAll("div.greenProgressBar");
      let blueBars = context.querySelectorAll("div.blueProgressBar");

      let modifyBar = function (bar) {
        let percentage = bar.title.split(" ")[0];
        bar.insertAdjacentHTML(
          "afterbegin",
          "<span style='float:left;font-size:smaller;color:rgba(0,0,0,0.75);'>" +
            percentage +
            "</span>"
        );
      };

      bars.forEach(modifyBar);
      greenBars.forEach(modifyBar);
      blueBars.forEach(modifyBar);
    },

    modifyScoringLinks: function (context) {
      let links = context.querySelectorAll(
        "a[href^='/World/Popmundo.aspx/Help/Scoring/']"
      );

      links.forEach(function (link) {
        let score = link.title.split("/");
        link.innerText = "[" + score[0] + "] " + link.innerText;
      });
    },

    modifyCharacterLinks: function (context) {
      let links = context.querySelectorAll(
        "#ppm-content a[href^='/World/Popmundo.aspx/Character/']"
      );
      let groups = this.assistant.getGroups();
      let defaultGroup = this.assistant.get(
        "interactions.default_group",
        "friend"
      );

      let settings = this.assistant.get("interactions", {});
      let now = moment();

      links.forEach((link) => {
        let match = /Character\/([0-9]+)/.exec(link.href);

        if (match) {
          let id = match[1];
          let contact = this.assistant.getContact(id);

          if (contact.hasOwnProperty("is_active") && !contact.is_active) {
            // Indicate that there once was a relationship with this character
            link.style.textDecoration = "line-through";
            link.style.textDecorationColor = "rgba(0,0,0,0.25)";
            return;
          } else if (!contact.is_active) {
            return;
          }

          // MARKER_HERE
          if (settings.limit_hours && contact.last_clicked) {
            const last = moment(contact.last_clicked);
            const next = moment.unix(last.unix() + settings.limit_hours * 3600);
            debug(next);

            if (next > now) {
              const elem = context.createElement("span");
              elem.innerText = "🕓";
              elem.title = `Next auto interaction: ${next.fromNow()}`;
              elem.classList.add("pa-info");
              link.insertAdjacentElement("afterend", elem);
            }
          }

          let groupName = contact.group || defaultGroup;

          let group = groups[groupName] || null;

          if (group) {
            let background = group.background_color || null;
            let foreground = group.foreground_color || null;

            if (background) {
              link.style.background = background;
            }

            if (foreground) {
              link.style.color = foreground;
            }

            link.style.padding = "0px 2px";
            link.style.borderRadius = "2px";
          }
        }
      });
    },

    modifyCollapsable: function (context) {
      let boxes = context.querySelectorAll("div.box");

      let toggle = function () {
        let child = this.parentNode.firstChild;

        while (child) {
          if (child !== this && child.nodeType === Node.ELEMENT_NODE) {
            child.classList.toggle("collapsed");
          }
          child = child.nextElementSibling || child.nextSibling;
        }
      };

      for (let box of boxes) {
        let header = box.querySelector("h2");
        if (!header) continue;

        header.addEventListener("click", toggle);
      }
    },

    modifyTableGroups: function (context) {
      const assistant = this.assistant; // Expose to toggleGroup

      const toggleGroup = function (el) {
        const rows = document.querySelectorAll(
          `tr[data-parent-group-index='${el.dataset.groupIndex}']`
        );
        let collapsedGroups = assistant.getGlobal("collapsedGroups", []);

        let isCollapsed = false;

        for (const row of rows) {
          if (!row.classList.contains("hidden")) {
            isCollapsed = true;
          }

          row.classList.toggle("hidden");
        }

        if (
          isCollapsed &&
          collapsedGroups.indexOf(el.dataset.groupName) === -1
        ) {
          collapsedGroups.push(el.dataset.groupName);
        } else if (
          !isCollapsed &&
          collapsedGroups.indexOf(el.dataset.groupName) !== -1
        ) {
          collapsedGroups.splice(
            collapsedGroups.indexOf(el.dataset.groupName),
            1
          );
        }

        assistant.setGlobal("collapsedGroups", collapsedGroups);
      };

      const collapsedGroups = assistant.getGlobal("collapsedGroups", []);
      const groupRows = context.querySelectorAll("table tr.group");
      let index = 1;

      for (const row of groupRows) {
        row.dataset.groupIndex = index;

        // Mark children that will be toggled
        let nextRow = row.nextElementSibling;
        let childCount = 0;

        do {
          if (
            nextRow.nodeName !== "TR" ||
            nextRow.classList.contains("group")
          ) {
            break; // When a non-tr element or tr without group class is encountered
          }

          nextRow.dataset.parentGroupIndex = index;
          nextRow = nextRow.nextElementSibling;
          childCount++;
        } while (nextRow);

        // Add number of items to row text
        const cells = row.querySelectorAll("td");
        for (const cell of cells) {
          if (cell.innerText.trim().length > 0) {
            row.dataset.groupName = cell.innerText;
            cell.innerHTML = cell.innerHTML + `(${childCount})`;
            break;
          }
        }

        row.addEventListener("click", function (event) {
          toggleGroup(this);
        });
        row.classList.add("group-toggle");

        if (collapsedGroups.indexOf(row.dataset.groupName) !== -1) {
          debug("Collapsing a group");
          toggleGroup(row);
        }

        index++;
      }
    },
  });

  assistant.addModule({
    getName: function () {
      return "Currency";
    },

    setAssistant: function (assistant) {
      this.assistant = assistant;
    },

    run: function (context) {
      this.modifyCurrency(context);
    },

    modifyCurrency: function (context) {
      const replacement = this.assistant.getGlobal("currency", "");
      const search = /(M\$)/g;
      const scope = context.querySelector("#ppm-main");

      if (replacement && replacement.length > 0) {
        this.walk(scope, search, replacement);
      }
    },

    walk: function (node, search, replacement) {
      if (node.nodeType == 3) {
        node.data = node.data.replace(search, replacement);
      }

      if (node.nodeType == 1 && node.nodeName != "SCRIPT") {
        for (var i = 0; i < node.childNodes.length; i++) {
          this.walk(node.childNodes[i], search, replacement);
        }
      }
    },
  });

  assistant.addModule({
    getName: function () {
      return "interactions";
    },

    setAssistant: function (assistant) {
      this.parent = assistant; // legacy
      this.assistant = assistant;
    },

    run: async function (context) {
      // Store a copy of the original functions
      const oGetPageNotifications = unsafeWindow.getPageNotifications;
      const oCheckServerDown = unsafeWindow.checkServerDown;
      const oCheckNotificationCount = unsafeWindow.checkNotificationCount;
      const oUpdateNotificationCount = unsafeWindow.updateNotificationCount;

      let oldCount = null; // Used to track the previous notification count to determine if new ones were found
      const notificationMap = []; // Map for keeping track of which notifications have already been shown

      const dismissNotification = async function (data) {
        // Dismiss notification ingame
        oldCount -= 1;
        oUpdateNotificationCount(oldCount);

        await fetch(
          document.location.origin +
            "/WebServices/A/Open.asmx/ClearNotification",
          {
            method: "POST",
            headers: {
              "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              ts: new Date().getTime(),
              arg: data.UID,
            }),
          }
        );
      };

      unsafeWindow.updateNotificationCount = async (newCount) => {
        // New notifications; how to handle them depends on user settings
        if (
          newCount > oldCount &&
          Notification &&
          Notification.permission === "granted" &&
          this.assistant.getGlobal("setting_browsernotifications", false)
        ) {
          fetch(
            document.location.origin +
              "/WebServices/A/Open.asmx/GetMenuNotifications",
            {
              method: "POST",
              headers: { "content-type": "application/json; charset=utf-8" },
              body: JSON.stringify({ ts: new Date().getTime() }),
            }
          )
            .then(async (response) => {
              const notificationTimeout = 15 * 1000; // 15 seconds
              const responseData = await response.json();
              // Response data is oddly packed
              const notifications = JSON.parse(responseData.d);

              // Actually show the notifications
              for (let data of notifications) {
                // Check if the notification has already been shown
                if (notificationMap.indexOf(data.UID) !== -1) continue;
                notificationMap.push(data.UID);
                console.log(data.Url);

                const notification = new Notification(
                  this.assistant._character_name,
                  {
                    body: data.Text,
                    icon: "https://cdn.discordapp.com/attachments/612910166261760001/991616486919655444/popmundo.webp",
                    // Note: Unexpected default bahaviour with firefox (windows 10); this option does not work unless
                    // "dom.webnotifications.requireinteraction.enabled" is manually set in about:config.
                    // This is unfortunate because when a notification auto-closes, the close event is also fired and indistinguishable
                    // from a manual dismissal, which causes notifactions to disappear completely when it times out
                    requireInteraction: false,
                  }
                );

                // Not the best UX but see the comment above why this is required
                setTimeout(() => {
                  notification.ignoreClose = true;
                  notification.close();
                }, notificationTimeout);

                notification.onclick = async function (e) {
                  e.target.isClicked = true;

                  await dismissNotification(data);

                  // Visit URL associated with the notification, if there is one
                  if (data.Url) {
                    document.location = document.location.origin + data.Url;
                  }
                };
                notification.onclose = function (e) {
                  if (!e.target.isClicked && !e.target.ignoreClose) {
                    // This check is here to prevent double-dismissals since close seems to trigger after onclick as well
                    dismissNotification(data);
                  }
                };
              }
            })
            .catch((rejected) => {
              debug("Failed to get menu notifications");
              debug(rejected);
            });
        }

        oldCount = newCount;
        return oUpdateNotificationCount(newCount);
      };

      unsafeWindow.getPageNotifications = () => {
        // OnPageNotifications must be enabled on interaction page for error / snuggle stopper detection
        if (
          !this.isActive() ||
          document.location.href.indexOf("Interact") !== -1
        ) {
          let result = oGetPageNotifications();
          this.pageNotificationsReady = true;
          return result;
        } else {
          this.pageNotificationsReady = true;
        }
      };

      unsafeWindow.checkServerDown = () => {
        if (!this.isActive()) {
          return oCheckServerDown();
        }
      };

      unsafeWindow.checkNotificationCount = () => {
        if (!this.isActive()) {
          return oCheckNotificationCount();
        }
      };

      /*if (this.isActive()) {
              //document.querySelectorAll("div.localeLogo").forEach((el) => { el.style.display = 'none'; });
              //document.querySelectorAll("div.avatar").forEach((el) => { el.style.display = 'none'; });
          }*/

      this.modify(context);

      if (
        !this.isActive() &&
        context.location.href.indexOf("/Interact") !== -1
      ) {
        try {
          this.selectInteraction(context);
        } catch (e) {
          // This may fail if we're not on an interaction page, which is totally fine
        }
      }

      // Todo: Only do this if module is in exclusive mode
      // Todo: This appears to not be working?
      /*if (this.isActive()) {
              debug("Waiting for page notifications to load...");
              try {
                  await new Promise(async (resolve, reject) => {
                      let count = 0;

                      while (count < 100 && this.pageNotificationsReady !== true) {
                          count++;
                          await new Promise(resolveTimer => setTimeout(resolveTimer, 50));
                      }

                      if (this.pageNotificationsReady) {
                          resolve();
                      } else {
                          reject();
                      }
                  });
              } catch (e) {
                  debug("Error while waiting for page notifications to load!");
              }

              debug("Page notifications loaded");
          }*/

      this.interactions(true);
    },

    modify: function (context) {
      if (context.location.href.indexOf("/Interact") !== -1) {
        return this.modifyInteract(context);
      }

      if (
        context.location.href.indexOf(
          "/Relations/" + this.assistant._character_id
        ) !== -1
      ) {
        return this.modifyRelations(context);
      }
    },

    modifyInteract: function (context) {
      // target_id should have been parsed already and set to the contact's id
      let target_id = this.assistant.repository.context.get("target_id", null);

      if (!target_id) {
        debug("No target ID");
        return;
      }

      let contact = this.assistant.getContact(target_id);

      if (
        !contact ||
        !contact.hasOwnProperty("is_active") ||
        !contact.is_active
      ) {
        debug("Target is not an active contact");
        return;
      }

      // Insert Vue template
      context.querySelector("div.interactHolder").insertAdjacentHTML(
        "afterbegin",
        `
          <div id="assistant-interactions-contact">
              <assistant-contact-box :contact_id="${target_id}"></assistant-contact-box>
          </div>
          `
      );

      new Vue({
        el: "#assistant-interactions-contact",
      });
    },

    modifyRelations: function (context) {
      const now = moment().unix();
      
      let table = context.querySelector("#ppm-content table.data");
      table.id = "ppm-relations";

      if (!table) {
        throw "Could not find relations table";
      }

      let groups = this.assistant.getGroups();

      let tbody = table.querySelector("tbody");
      let rows = tbody.querySelectorAll("tr");

      // Add header elements
      let headCells = table.querySelectorAll("thead th");
      headCells[0].insertAdjacentHTML("afterEnd", "<th>Group</th>");

      // Modify row contents
      rows.forEach((row) => {
        let cells = row.querySelectorAll("td");
        let contact_id = /Character\/([0-9]+)/.exec(
          cells[0].querySelector("a").href
        )[1];
        let contact = this.assistant.getContact(contact_id);

        /*
        todo: add settings for this

        try {
            if (contact.last_received) {
                if (contact.last_received < (now - 60*60*24*14)) {
                    // mark as inactive
                    row.classList.add("pa-inactive-relation");
                } else {
                    console.log(contact.last_received);
                    console.log((now - 60*60*24*14));
                }
            }
        } catch (e) { console.log(e) }*/

        let new_element = context.createElement("td");
        new_element.innerHTML =
          '<assistant-groups contact_id="' +
          contact_id +
          '" selected="' +
          contact.group +
          '"></assistant-groups>';

        cells[0].insertAdjacentElement("afterEnd", new_element);
        new Vue({ el: new_element });
      });

      // Add a dropdown to allow selecting a group for each contact
    },

    setStatus: function (status, displayMessage = null) {
      const currentStatus = sessionStorage.getItem("interactions", status);

      const order = [
        "begin",
        "self_update",
        "update",
        "first", // This is a case where _NEXT_STATUS won't work well; it could branch to end or navigate_character
        "navigate_character",
        "navigate_interact",
        "interact",
        "autoaphro",
        "next", // This is a case where _NEXT_STATUS won't work well; it could branch to next or back to navigate_character
        "end",
        "auto_focus",
        "auto_use",
        "postmove",
        "report",
      ];

      if (status === "_NEXT_STATUS") {
        const index = order.indexOf(currentStatus);
        if (index === -1) {
          throw new Error(
            `_NEXT_STATUS failed because "${currentStatus}" does not appear to be a valid status.`
          );
        } else if (index === order.length - 1) {
          throw new Error(
            `_NEXT_STATUS failed because "${currentStatus}" is the final valid status.`
          );
        }

        status = order[index + 1];
      } else if (status === "_NEXT_SECTION") {
        status = "end";
      }

      /*if (displayMessage === null) {
              switch(status) {
                  case "navigate_character":
                      displayMessage = "Moving to a character page";
                      break;
                  default:
                      displayMessage = status;
              }
          }*/

      sessionStorage.setItem("interactions", status);
      if (displayMessage) this.setStatusMessage(displayMessage);
    },

    setStatusMessage(message) {
      debug(`[STATUS] ${message}`);
      this.parent.$bus.$emit("interactions.status", message);
    },

    getNextContact(advance) {
      // Get the queue list
      let list = this.getQueue();

      // Get the current index
      let idx = this.getQueueIndex();

      if (idx === null) {
        idx = 0;
      }

      let contact = null;

      try {
        contact = list[idx];
        this.setQueueIndex(idx + 1);
      } catch (e) {
        this.setQueueIndex(null);
      }

      return contact;
    },

    getQueueIndex() {
      let idx = this.parent.get("interactions.queue_index", null);
      return idx;
    },

    setQueueIndex(idx) {
      this.parent.set("interactions.queue_index", idx);
    },

    getQueue: function () {
      let queue = this.parent.get("interactions.queue", []);

      if (!Array.isArray(queue)) {
        queue = [];
      }

      return queue;
    },

    setQueue: function (queue) {
      this.parent.set("interactions.queue", queue);
    },

    status: function () {
      return sessionStorage.getItem("interactions") || "inactive";
    },

    isActive: function () {
      return (
        this.status() !== "inactive" && this.status().indexOf("paused") === -1
      );
    },

    start: function () {
      let settings = this.parent.get("interactions", {});
      let status = "inactive";
      let restored = false;

      // Start flow
      this.setStatus("begin");
      this.interactions();
    },

    pause: function () {
      // First ensure things stop happening
      this.parent.stopNavigation();

      // Change status
      let status = this.status().split(":");

      if (
        status[0] === "inactive" ||
        status[0] === "paused" ||
        status[0] === "report"
      ) {
        // No need to pause when these statuses are set
        return;
      }

      if (status.length === 2) {
        this.setStatus("paused:" + status[1], "Paused");
      } else {
        this.setStatus("paused", "Paused");
      }
    },

    updateContacts: function () {
      if (this.parent.navigate(this.parent.urls.contacts)) {
        // Already on contacts page; find out if there is a "next" link in the document, and click it if there is
        let next = document.getElementById(
          "ctl00_cphLeftColumn_ctl00_btnGoNext"
        );

        if (!next) {
          // No next button was found, which means updating contacts is done
          return true;
        }

        this.parent.navigateElement(next);
      }

      return false;
    },

    prepareInteractionsList() {
      let settings = this.parent.get("interactions", {});
      let contacts = this.parent.getContacts();
      let filteredContacts = [];
      let list = [];
      let now = new Date().getTime();

      // Filter contacts
      Object.keys(contacts).forEach((key) => {
        let contact = contacts[key];

        if (now - contact.in_table > 1000 * 60 * 5) {
          // 5 minutes
          contact.missing = true;
          return; // Skip contacts that did not appear in relationships table
        } else {
          contact.missing = false;
        }

        if (settings.limit_city && contact.same_city !== true) {
          return; // Skip contacts in a different city when limit_city is set
        }

        if (settings.limit_hours) {
          // Skip contacts that have been interacted with recently
          let last = contact.last_clicked || 0;
          let lastDate = new Date(last);
          lastDate.setMinutes(0);
          lastDate.setSeconds(0);
          lastDate.setMilliseconds(0);

          let diff = new Date().getTime() - lastDate.getTime();

          if (diff < settings.limit_hours * 3600 * 1000) {
            return;
          }
        }

        filteredContacts.push(contact);
      });

      // Sort filtered contacts
      filteredContacts = _.shuffle(filteredContacts);

      filteredContacts.forEach((contact) => {
        if (contact.id) {
          list.push(contact.id);
        } else {
          debug("Skipping contact with undefined ID");
        }
      });

      debug(
        "The list of contacts to interact with contains " +
          list.length +
          " items"
      );

      return list;
    },

    getActiveContact: function () {
      let queue = this.getQueue();
      let index = this.getQueueIndex();

      if (!queue || !Array.isArray(queue)) {
        debug(JSON.stringify(queue, null, 1));
        throw "Queue is in an invalid state";
      }

      if (index < 0 || index >= queue.length) {
        throw (
          "Queue index is out of bounds (" + index + " / " + queue.length + ")"
        );
      }

      let contact = this.assistant.getContact(queue[index]);

      if (!contact) {
        throw (
          "Failed to get contact from queue (queue value is '" +
          queue[index] +
          "'"
        );
      }

      debug("[INTERACTIONS] Successfully resolved queue entry to a contact");
      return contact;
    },

    advanceQueue: function () {
      let index = this.getQueueIndex();
      let queue = this.getQueue();

      if (null === index) {
        // This is a special case that is triggered when phase changes from "begin" to "next"; QueueIndex will move from null to 0
        this.setQueueIndex(0);
        return true;
      }

      index++;

      // Ensure that increasing the index will not lead to an invalid state
      if (index >= queue.length) {
        return false;
      }

      // It is now safe to increase the index
      this.setQueueIndex(index);
      return true;
    },

    canContinue: function () {
      let queue = this.getQueue();
      let index = this.getQueueIndex();

      if (!queue || queue.length < 1) {
        debug("[INTERACTIONS] Can not continue due to queue");
        debug(JSON.stringify(queue));
        return false;
      }

      if (!index || index >= queue) {
        debug("[INTERACTIONS] Can not continue due to index");
        return false;
      }

      return true;
    },

    interactions: function (silent) {
      if (!this.isActive()) {
        if (!silent) {
          throw "Call to assistant.interactions, but interactions is not running!";
        } else {
          return;
        }
      }

      // Prepare interactions data
      let settings = this.parent.get("interactions");
      let phase = this.status();

      let list = this.getQueue();
      let index = this.getQueueIndex();

      debug("[INTERACTIONS] Currently in '" + phase + "' phase");
      debug(
        "[INTERACTIONS] Queue contains " +
          list.length +
          " entries (current index is " +
          index +
          ")"
      );

      // Modify navigation speed
      if (settings.hasOwnProperty("speed")) {
        this.parent.config.navigate_delay = parseInt(settings.speed);
      }

      if (phase === "reset") {
        return this.start();
      }

      if (phase === "begin") {
        this.setStatusMessage("Assistant is preparing to start automation.");

        // This should be used to reset any data before (re)starting interactions
        window.sessionStorage.setItem("autoaphro_count", 0);
        window.sessionStorage.removeItem("char_status");
        window.sessionStorage.removeItem("mood");
        window.sessionStorage.removeItem("health");
        window.sessionStorage.removeItem("moveLocaleType");
        window.sessionStorage.removeItem("autoaphro_none_available");
        window.sessionStorage.removeItem("has_snuggled");

        this.setStatus("_NEXT_STATUS");
        return this.interactions();
      }

      // Update phase means the relations table needs to be checked
      // It should be noted that interactions must ALWAYS be started in this phase, even if updating is not intended
      if (phase === "self_update") {
        if (
          document.location.href !==
            this.parent.urls.character(this.parent._character_id) &&
          !document.location.href.endsWith("/World/Popmundo.aspx/Character")
        ) {
          this.setStatusMessage(
            "Assistant is navigating to your character page."
          );

          return this.parent.navigate(
            this.parent.urls.character(this.parent._character_id)
          );
        } else {
          this.setStatusMessage(
            "Assistant is checking your character's information."
          );

          const bars = document.querySelectorAll(
            "div.charMainValues div.progressBar"
          );
          const moodBar = bars[0];
          const healthBar = bars[1];

          window.sessionStorage.setItem(
            "self_mood",
            moodBar.title.replace("%", "") || null
          );
          window.sessionStorage.setItem(
            "self_health",
            healthBar.title.replace("%", "") || null
          );

          const charStatus = document
            .querySelector(
              "div.charMainToolbox tr:nth-of-type(2) td:nth-of-type(2)"
            )
            .innerText.toLowerCase();
          window.sessionStorage.setItem("char_status", charStatus);

          this.setStatus("_NEXT_STATUS");
          return this.interactions();
        }
      }

      if (phase === "auto_use") {
        if (!settings.auto_use_enabled) {
          // Skip if this optional feature is disabled
          this.setStatus(
            "_NEXT_STATUS",
            "Skipping auto_use because it is not enabled in the settings"
          );
          return this.interactions();
        }

        // move to items page if that is not where we are
        if (
          document.location.href !==
          this.parent.urls.characterInventory(this.parent._character_id)
        ) {
          this.setStatusMessage("Assistant is navigating to your inventory.");

          return this.parent.navigate(
            this.parent.urls.characterInventory(this.parent._character_id)
          );
        }

        // todo: move to dedicated module?
        let itemRows = document.querySelectorAll(
          "table#checkedlist tbody tr.hoverable"
        );

        for (let itemRow of itemRows) {
          let itemData = {};

          let hiddenInput = itemRow.querySelector('input[type="hidden"]');
          if (hiddenInput) {
            itemRow.dataset.item_id = hiddenInput.value;
          }

          itemRow.dataset.item_name = itemRow
            .querySelector("td.middle a")
            .innerText.toLowerCase();

          // check for cooldown data
          let lastUsedTimestamp = this.parent.repository.character.get(
            `item_${itemRow.dataset.item_id}_used`,
            null
          );
          if (lastUsedTimestamp) {
            itemRow.dataset.used = lastUsedTimestamp;
          }
        }

        let useItem = (itemRow, intervalString) => {
          let button = itemRow.querySelector('input[type="image"]');
          if (!button) {
            debug(`No use button available: ${itemRow.dataset.item_name}`);
            return false;
          }

          // check if interval is off cooldown
          intervalString = intervalString.toLowerCase().trim();

          let intervalRegex = /(g|i)([0-9]+)(d|h)/;

          if (!intervalRegex.test(intervalString)) {
            confirm(`Interval is incorrectly formatted: ${intervalString}`);
            return false;
          }

          let match = intervalRegex.exec(intervalString);

          let cooldownTime = parseInt(match[2]);

          if (match[3] === "h") {
            cooldownTime *= 60 * 60;
          } else if (match[3] === "d") {
            cooldownTime *= 60 * 60 * 24;
          }

          let lastUseKey = null;

          if (match[1] === "i") {
            // Cooldown is based on the item ID
            lastUseKey = `item_used_i${itemRow.dataset.item_id}`;
          } else if (match[1] === "g") {
            lastUseKey = `item_used_g${itemRow.dataset.item_name}`;
          }

          let lastUsedTimestamp = parseInt(
            this.parent.repository.character.get(lastUseKey, 0)
          );

          if (lastUsedTimestamp + cooldownTime > moment().unix()) {
            itemRow.style.background = "rgba(255, 165, 0, 0.5)";
            return false; // Item is on cooldown
          } else {
            this.setStatusMessage(`Using ${itemRow.dataset.item_name}`);
            itemRow.style.background = "rgba(0, 255, 0, 0.5)";
            // Press the use button
            this.parent.repository.character.set(lastUseKey, moment().unix());
            // Clone to get rid of event handler that shows confirmation box
            this.parent.navigateElement(button, true);

            return true;
          }
        };

        // parse the rules
        let rules = settings.auto_use.split(",");
        let parseRegex = /\"(.+)\"\:(.+)/;

        for (let rule of rules) {
          if (!parseRegex.test(rule)) {
            debug(`Invalid rule: ${rule}`);
            continue;
          }

          let [match, item, interval] = parseRegex.exec(rule);

          // first check if any items match.
          if (item.startsWith("#")) {
            // an id is specified
            item = item.replace("#", "").trim();

            for (let itemRow of itemRows) {
              if (itemRow.dataset.item_id && itemRow.dataset.item_id === item) {
                // match
                if (useItem(itemRow, interval)) {
                  // item is being used
                  return;
                }
                // otherwise, keep looking
              }
            } // no match, continue with other rules
          } else if (item.startsWith(":")) {
            for (let itemRow of itemRows) {
              item = item.replace(":", "").trim().toLowerCase();
              // a use title is specified
              let useButton = itemRow.querySelector('input[type="image"]');
              if (
                useButton &&
                useButton.title.toLowerCase().indexOf(item) !== -1
              ) {
                if (useItem(itemRow, interval)) {
                  return;
                }
              }
            }
          } else {
            item = item.toLowerCase();

            for (let itemRow of itemRows) {
              if (
                itemRow.dataset.item_name &&
                itemRow.dataset.item_name.indexOf(item) !== -1
              ) {
                // match
                if (useItem(itemRow, interval)) {
                  // item is being used
                  return;
                }
                // otherwise, keep looking
              }
            } // no match, continue with other rules
          }
        }

        // no rules matched, move to next phase
        this.setStatus(
          "_NEXT_STATUS",
          "Skipping auto_use because no rules matched"
        );
        return this.interactions();
      }

      if (phase === "auto_focus") {
        if (!settings.auto_focus) {
          // Skip if this optional feature is disabled
          this.setStatus(
            "_NEXT_STATUS",
            "Skipping auto_focus because it is not enabled in the settings"
          );
          return this.interactions();
        }

        // This can only work if mood and health was read successfully
        const mood =
          parseInt(window.sessionStorage.getItem("self_mood")) || null;
        const health =
          parseInt(window.sessionStorage.getItem("self_health")) || null;

        if (!mood || !health) {
          this.setStatusMessage(
            "Assistant could not automatically adjust your character focus because health and mood are not known. This may be a bug!"
          );
          this.setStatus("_NEXT_STATUS");
          return this.interactions();
        }

        if (
          document.location.href !==
          this.parent.urls.character_focus(this.parent._character_id)
        ) {
          this.setStatusMessage(
            "Assistant is navigating to your character focus page."
          );
          return this.parent.navigate(
            this.parent.urls.character_focus(this.parent._character_id)
          );
        } else {
          let focus = null;
          let bestLocaleType = 32; // hotel

          // Decision logic
          if (mood < health) {
            focus = 18; // walk
          } else if (health < 40) {
            focus = 1; // rest
          } else {
            focus = 6; // gym
            if (health < 80) {
              // Stay at hotel if health is high enough
              bestLocaleType = 11; // gym
            }
          }

          window.sessionStorage.setItem("autofocus_localetype", bestLocaleType);

          const focusSelect = document.querySelector(
            "#ctl00_cphLeftColumn_ctl00_ddlPriorities"
          );
          const focusButton = document.querySelector(
            "#ctl00_cphLeftColumn_ctl00_btnSetPriority"
          );

          if (!focusSelect) {
            this.setStatusMessage(
              "Assistant is not changing your focus because it cannot find the dropdown."
            );
          } else if (!focusButton) {
            this.setStatusMessage(
              "Assistant is not changing your focus because it cannot find the button to click."
            );
          } else if (parseInt(focusSelect.value) === focus) {
            this.setStatusMessage(
              "Assistant is not changing your focus because it is already optimal."
            );
          } else if (!focusSelect.querySelector(`option[value="${focus}"]`)) {
            this.setStatusMessage(
              `Assistant is not changing your focus because it cannot find the option it wants to choose ("${focus}") in the dropdown.`
            );
          } else {
            focusSelect.value = focus.toString();
            this.setStatusMessage(
              `Assistant is changing your focus to "${focusSelect.selectedOptions[0].innerText}".`
            );
            this.setStatus("_NEXT_STATUS");
            return this.parent.navigateElement(focusButton);
          }

          this.setStatus("_NEXT_STATUS");
          return this.interactions();
        }
      }

      if (phase === "update") {
        let lastRun = parseInt(
          this.parent.repository.character.get("last_interactions_run", 0)
        );

        if (lastRun + 60 * 60 * 12 > moment().unix()) {
          this.setStatus("_NEXT_SECTION");
          this.setStatusMessage(
            "Skipping interactions because interactions already ran in the past 12 hours."
          );
          return this.interactions();
        }

        if (window.sessionStorage.getItem("char_status") !== "normal") {
          this.setStatus("_NEXT_SECTION");
          this.setStatusMessage(
            "Skipping interactions because current status is not normal."
          );
          return this.interactions();
        }

        // Todo: This should be moved to begin
        if (
          settings.hasOwnProperty("continue") &&
          settings.continue &&
          this.canContinue()
        ) {
          // User wants to resume interactions with an existing queue
          debug("[INTERACTIONS] Resuming interactions from old queue");
          this.setStatus("navigate_character");
          return this.interactions();
        }

        this.setStatusMessage(
          "Assistant is working on reading your relationships list before starting interactions."
        );

        if (!this.updateContacts()) {
          // This is taking care of reading the list of contacts
          return;
        }

        // Next phase is "begin"
        this.setStatus("_NEXT_STATUS");
        return this.interactions();
      }

      if (phase === "first") {
        // This simply prepares the queue before moving forward
        let queue = this.prepareInteractionsList();

        if (settings.max_characters_enabled && settings.max_characters) {
          queue = queue.slice(0, parseInt(settings.max_characters));
        }

        if (queue.length < 1) {
          this.setStatus("_NEXT_SECTION");
          return this.interactions();
        }

        this.setQueue(queue);
        this.setQueueIndex(null);

        this.setStatus("next");
        return this.interactions();
      }

      if (phase === "autoaphro") {
        const hasSnuggled =
          window.sessionStorage.getItem("has_snuggled") || false;
        const numUses =
          parseInt(window.sessionStorage.getItem("autoaphro_count")) || 0;
        const isAphroUnavailable =
          window.sessionStorage.getItem("autoaphro_none_available") || false;
        const stopAfterSnuggle = settings.stop_after_snuggle;

        debug(
          `Num uses ${numUses} (raw: ${window.sessionStorage.getItem(
            "autoaphro_count"
          )}). Max ${settings.autoaphro_max}.`
        );

        if (!settings.autoaphro) {
          this.setStatusMessage(
            "Skipping autoaphro because feature is not enabled in settings."
          );
        } else if (!hasSnuggled) {
          this.setStatusMessage(
            "Skipping autoaphro because feature is not enabled in settings."
          );
        } else if (numUses >= settings.autoaphro_max) {
          this.setStatusMessage(
            `Skipping autoaphro because limit in uses has been reached (${numUses}/${settings.autoaphro_max}).`
          );
        } else if (isAphroUnavailable) {
          this.setStatusMessage(
            `Skipping autoaphro because no aphrodisiacs are available in inventory.`
          );
        } else {
          // Autoaphro main logic
          if (!this.parent.navigate(this.parent.urls.items())) {
            this.setStatusMessage(
              "Assistant is moving to your inventory to look for an aphrodisiac."
            );
            return;
          }

          const useButtons = document.querySelectorAll(
            "#checkedlist tbody tr input[title='Use']"
          );

          if (!useButtons) {
            this.setStatusMessage(
              'Assistant failed to use an aphrodisiac because it could not find any "use" buttons in your inventory.'
            );
            window.sessionStorage.setItem("autoaphro_none_available", true);
            return this.interactions();
          }

          for (let button of useButtons) {
            try {
              const linkElement =
                button.parentElement.parentElement.querySelector("td a");

              if (linkElement.innerText === "Potion of Aphrodisiac") {
                window.sessionStorage.removeItem("has_snuggled");
                window.sessionStorage.setItem("autoaphro_count", 1 + numUses);
                this.setStatusMessage("Assistant is using an aphrodisiac.");
                this.setStatus("_NEXT_STATUS");
                this.parent.navigateElement(button);
                return;
              }
            } catch (e) {
              debug("Error trying to find button", e);
              continue;
            }
          }

          // If this is reached, an aphrodisiac was not found in inventory; autoaphro will skip in the next recursion
          window.sessionStorage.setItem("autoaphro_none_available", true);
          return this.interactions();
        }

        if (hasSnuggled && stopAfterSnuggle) {
          // Character has snuggled and can't snuggle again, skip to next phase
          // This doesn't happen after an aphro has been used because of the call to removeItem('has_snuggled') within it's logic
          this.setStatus("_NEXT_SECTION");
        } else {
          // If this is reached, autoaphro is done; clean up data and continue
          this.setStatus("_NEXT_STATUS");
        }

        window.sessionStorage.removeItem("has_snuggled");
        return this.interactions();
      }

      if (phase === "next") {
        // Cannot use _NEXT_STATUS here due to the branching nature of this step
        if (!this.advanceQueue()) {
          // This method returning false means that it is impossible to advance the queue, most likely due to there being no next entry
          this.parent.repository.character.set(
            "last_interactions_run",
            moment().unix()
          );
          this.setStatus("end");
        } else {
          // Queue has been advanced to the next contact, start navigation phase
          this.setStatus("navigate_character");
        }

        return this.interactions();
      }

      if (phase === "navigate_character") {
        // During the navigation phase, we navigate to the Character's overview page
        let contact = this.getActiveContact();

        if (this.parent.navigate(this.parent.urls.character(contact.id))) {
          this.setStatus("navigate_interact");
          return this.interactions();
        }

        this.setStatusMessage(
          `Navigating to the next character (${contact.name}).`
        );
        return; // Navigation is happening
      }

      if (phase === "navigate_interact") {
        let contact = this.getActiveContact();
        let regex = new RegExp("Interact(.+)?/" + contact.id);

        // Checks if we are currently on the page we wanted to navigate to
        if (regex.test(document.location.href)) {
          this.setStatus("interact");
          return this.interactions();
        }

        // Not on the correct page yet, what happens now depends on what the current page looks like
        // First attempt to find a "interact" or "go to interact" link
        let element = document.getElementById(
          "ctl00_cphRightColumn_ctl00_lnkInteract"
        );

        if (element) {
          // Found either an "interact", "go to interact" or "travel to interact" link
          if (element.href.indexOf("City") !== -1) {
            // This is travel to interact; this is of no use, so let the logic fall through into the next test (call)
          } else if (element.href.indexOf("MoveToLocale") !== -1) {
            this.setStatusMessage(
              `Navigating to the interaction page with ${contact.name} using the "move to character" link.`
            );
            this.parent.navigateElement(element);
            return;
          } else {
            this.setStatusMessage(
              `Navigating to the interaction page with ${contact.name}.`
            );
            this.parent.navigateElement(element);
            return;
          }
        }

        // Sometimes the link is a button instead (???)
        element = document.getElementById("ctl00_cphRightColumn_ctl00_btnInteract");
        if (element && window.sessionStorage.getItem('ctl00_cphRightColumn_ctl00_btnInteract') !== contact.id.toString()) {
            // To prevent getting stuck when moving to the locale is not possible
            window.sessionStorage.setItem('ctl00_cphRightColumn_ctl00_btnInteract', contact.id.toString());
            return this.parent.navigateElement(element);
        }

        element = document.getElementById(
          "ctl00_cphRightColumn_ctl00_lnkInteractPhone"
        );

        if (element) {
          // This is a phone link
          this.setStatusMessage(
            `Assistant is starting a phone call with ${contact.name}.`
          );
          this.parent.navigateElement(element);
          return;
        }

        // We can see no way to interact with this contact (_next_status does not work here)
        this.setStatus("next");
        return this.interactions();
      }

      if (phase === "interact") {
        let result = null;

        const endRelationshipButton = document.querySelector(
          "#ctl00_cphTopColumn_ctl00_btnEndRelationship"
        );

        if (!endRelationshipButton) {
          // Safeguard; relationship does not exist
          debug("Relationship does not exist; skipping");
          this.setStatus("next");
          return this.interactions();
        }

        try {
          result = this.selectInteraction(document);
          debug("------------------------------------------- " + result);
        } catch (e) {
          // This happens when the interaction select element is not present; which simply means we move on to the next contact later
          if (console.exception) {
            console.exception(e);
          } else {
            debug(e);
          }
        }

        if (!result) {
          debug(
            "[INTERACTIONS] Failed to select an interaction; moving on to the next contact"
          );
          this.setStatus("_NEXT_STATUS");
          return this.interactions();
        }

        let button = document.getElementById(
          "ctl00_cphTopColumn_ctl00_btnInteract"
        );
        let dropdown = document.getElementById(
          "ctl00_cphTopColumn_ctl00_ddlInteractionTypes"
        );

        if (settings.hasOwnProperty("manual") && settings.manual) {
          // User has indicated they want to click interact themselves
          this.parent.$bus.$emit("interactions.manual", {
            dropdown: dropdown,
            button: button,
          });
          return;
        }

        if (
          interactionData.hasOwnProperty(result.toString()) &&
          interactionData[result.toString()].snuggle
        ) {
          window.sessionStorage.setItem("has_snuggled", true);

          if (settings.pausesnuggle) {
            debug("pausing after snuggle");
            this.pause();
          }
        }

        this.parent.navigateElement(button);
        this.setStatusMessage(
          `Assistant is performing interaction "${dropdown.selectedOptions[0].innerText}".`
        );
        return; // Wait for navigation
      }

      if (phase === "end") {
        this.setStatus("_NEXT_STATUS");
        return this.interactions();
      }

      if (phase === "postmove") {
        if (window.sessionStorage.getItem("char_status") !== "normal") {
          // Can't move if status is not normal
          this.setStatus("_NEXT_STATUS");
          return this.interactions();
        }

        if (!settings.restlocale_enabled || !settings.restlocale) {
          this.setStatus("_NEXT_STATUS");
          return this.interactions();
        }

        const localeTypeID = window.sessionStorage.getItem("moveLocaleType");
        const localeList = document.querySelector("#tablelocales");
        const localeTypeSelector = document.querySelector(
          "#ctl00_cphLeftColumn_ctl00_ddlLocaleType"
        );
        const localesLink = document.querySelector("#mnuToolTipLocales a");

        if (localeList) {
          this.setStatusMessage(
            `Assistant is moving you to your preferred locale.`
          );
          this.setStatus("_NEXT_STATUS");
          return this.parent.navigateElement(
            localeList.querySelector("a.icon")
          );
        } else if (localeTypeSelector) {
          if (
            !localeTypeSelector.querySelector('[value="' + localeTypeID + '"]')
          ) {
            this.setStatus(
              "_NEXT_STATUS",
              `A locale type with ID "${localeTypeID}" cannot be found in the dropdown.`
            );
            return this.interactions();
          }
          // If on city page & no locale list, select localetype
          // Todo: ensure this is an available option
          localeTypeSelector.value = localeTypeID;
          this.setStatusMessage(
            "Assistant is searching for locales of your preferred type."
          );
          return this.parent.navigateElement(
            document.querySelector("#ctl00_cphLeftColumn_ctl00_btnFind")
          );
        } else if (localesLink) {
          const cityID = document.querySelector(
            "#ctl00_cphRightColumn_ctl01_ddlCities"
          ).value;

          // Clean old data
          window.sessionStorage.removeItem("moveLocaleType");

          // City ID is now known, we can parse which locale we should go to
          const rules = settings.restlocale.split(";");
          for (let rule of rules) {
            debug(`Evaluating rule ${rule}`);
            const ruleParts = rule.split(":");

            if (ruleParts.length === 1) {
              // This rule does not specify a city, so always choose this
              if (ruleParts[0] === "auto") {
                // Pick the locale type as defined by autofocus, or fall back to a hotel by default
                const bestLocale =
                  window.sessionStorage.getItem("autofocus_localetype") || 32;
                window.sessionStorage.setItem("moveLocaleType", bestLocale);
              } else if (!ruleParts[0].startsWith("t")) {
                // A locale can only exist in one city, so support for anything other than a TYPE makes no sense here
                this.setStatus(
                  "_NEXT_STATUS",
                  `Invalid rule "${rule}" (${ruleParts[0]}). A rule that does not specify a city can only use a locale type ID.`
                );
                return this.interactions();
              } else {
                // todo: check if valid number
                window.sessionStorage.setItem(
                  "moveLocaleType",
                  ruleParts[0].substring(1)
                );
              }
            } else if (ruleParts[0] === cityID) {
              debug(`Rule matched for specific city: ${ruleParts[1]}`);
              if (ruleParts[1] === "auto") {
                // Pick the locale type as defined by autofocus, or fall back to a hotel by default
                const bestLocale =
                  window.sessionStorage.getItem("autofocus_localetype") || 32;
                window.sessionStorage.setItem("moveLocaleType", bestLocale);
              } else if (ruleParts[1].startsWith("l")) {
                // Locale ID specified, move directly
                this.setStatus("_NEXT_STATUS");
                this.setStatusMessage(
                  `Assistant is moving you to your preferred locale (${ruleParts[1].substring(
                    1
                  )})`
                );
                return this.parent.navigate(
                  this.parent.urls.move_locale(ruleParts[1].substring(1))
                );
              } else if (ruleParts[1].startsWith("t")) {
                window.sessionStorage.setItem(
                  "moveLocaleType",
                  ruleParts[1].substring(1)
                );
              } else {
                debug("Invalid rule!");
              }
            }
          }

          // Check if a locale type was decided on
          if (!window.sessionStorage.getItem("moveLocaleType")) {
            debug("no locale link decided");
            this.setStatus("_NEXT_STATUS", "No locale to move to");
            return this.interactions();
          }

          // If on city page & no select, click locales link
          this.setStatusMessage("Assistant is looking for the city's locales.");
          return this.parent.navigateElement(localesLink);
        } else if (
          document.location.href.indexOf("/World/Popmundo.aspx/City") === -1
        ) {
          // Else, go to city page
          this.setStatusMessage(
            "Assistant is navigating to the city page for the auto-move feature."
          );
          return this.parent.navigate(
            document.location.origin + "/World/Popmundo.aspx/City"
          );
        } else {
          // Something went wrong
          this.setStatus(
            "_NEXT_STATUS",
            "Something went wrong while trying to move to locale"
          );
          return this.interactions();
        }
      }

      if (phase === "report") {
        if (settings.cyclecharacters) {
          debug("Cyclecharacters enabled");
          const select = document.querySelector(
            "#character-tools-character select"
          );

          if (select) {
            debug("Select found");
            const currentIndex = select.selectedIndex;

            if (currentIndex + 1 < select.options.length - 1) {
              debug("Hitting the button");
              // May seem like a bug, but the last index is not a character so we're ignoring that one
              this.setStatus("reset");

              select.selectedIndex = currentIndex + 1;
              this.setStatusMessage(
                `Assistant is selecting your next character (${select.selectedOptions[0].innerText}).`
              );
              this.parent.navigateElement(
                document
                  .querySelector(
                    "#character-tools-character input[type='image']"
                  )
                  .click()
              );
              return;
            }
          }
        }

        // Interactions are done; show a summary
        debug("Interactions are done!");

        // Clear the queue
        this.setQueue([]);
        this.setQueueIndex(null);

        // Reset status
        this.setStatus("inactive");
        this.setStatusMessage(`Assistant has finished automation.`);
        return;
      }

      // If this is reached, phase is somehow invalid because it did not get picked up by any of the stages
      throw "Invalid phase '" + phase + "'";
    },

    selectInteraction: function (context) {
      // Detect snuggle stopper errors
      const notifications = context.querySelector("#notifications");
      let noSnuggleMode = false;

      // @todo: translation-sensitive
      if (
        notifications.innerText.toLowerCase().indexOf("snuggle stopper") !== -1
      ) {
        debug("Snuggle stopper detected; entering no-snuggle mode");
        noSnuggleMode = true;
      }

      // Find ID of contact
      let id = null;

      try {
        id = parseInt(
          context.querySelector("div.interactPortrait.normargin div.idHolder")
            .innerText
        );
      } catch (e) {
        throw "SelectInteraction failed because it could not find the idHolder element";
      }

      // Detect if there is a relationship with the contact
      let has_relationship = null;
      try {
        let num = context.querySelectorAll("div.progressBar").length;

        if (num === 3) {
          has_relationship = true;
        }
      } catch (e) {
        // Nothing should cause this exception
        throw "SelectInteraction failed while detecting relationship: " + e;
      }

      if (!_.isInteger(id)) {
        throw (
          "SelectInteraction failed because it detected an invalid contact id: '" +
          id +
          "'"
        );
      }

      if (has_relationship !== true) {
        debug("There is no existing relationship with this contact");
        // todo: what now?
      }

      // Start selection process
      let contact = this.parent.getContact(id);
      let is_phone = context.location.href.indexOf("Phone") !== -1;
      let dropdown = context.getElementById(
        "ctl00_cphTopColumn_ctl00_ddlInteractionTypes"
      );
      let num_interactions = is_phone ? 1 : null;

      if (!dropdown) {
        throw "SelectInteraction failed because it could not find the interaction select element";
      }

      if (null === num_interactions) {
        let box = dropdown.parentElement.parentElement;
        let txt = box.querySelector("h2").innerText;
        if (!txt) {
          debug(
            "Could not detect number of remaining interactions; defaulting to a large number"
          );
          num_interactions = 999; // Couldn't parse the text. Instead of failing, just provide an indicator
        }

        let matches = /([0-9])(?:.+)([0-9])/.exec(txt);

        if (matches && matches.length === 3) {
          if (matches[1] <= matches[2]) {
            num_interactions = matches[1];
          } else {
            num_interactions = matches[2];
          }
        }
      }

      let available_interactions = [];

      // Now prepare a list of all the options there are!
      if (dropdown) {
        let options = dropdown.querySelectorAll("option");

        options.forEach((option) => {
          let value = parseInt(option.value);
          if (value && value > 0) {
            // this filters out all the options with value 0 that should really be optgroups
            available_interactions.push(value);
          }
        });
      }

      let choice = this.chooseInteraction(
        contact,
        is_phone,
        num_interactions,
        available_interactions,
        noSnuggleMode
      );

      if (null === choice || 0 === choice) {
        debug("Could not make a choice");
        return false;
      }

      // Time to act on the decision
      dropdown.value = choice;
      return choice;
    },

    chooseInteraction: function (
      contact,
      is_phone,
      num_interactions,
      available_interactions,
      filterSnuggles
    ) {
      let groups = this.parent.getGroups();
      let default_group_name = this.parent.get(
        "interactions.default_group",
        "friend"
      );
      let group = groups[contact.group] || groups[default_group_name];

      //let group_name = (contact.hasOwnProperty("group") && contact.group !== null) ? contact.group : ;
      //let group = this.parent.getGroups().hasOwnProperty(group_name) ? this.parent.getGroups()[group_name] : null;

      if (null === group) {
        throw "Contact belongs to invalid group '" + group_name + "'";
      }

      if (
        !contact.hasOwnProperty("permissions") ||
        typeof contact.permissions !== "object"
      ) {
        contact.permissions = {};
      }

      // Resolve permissions; group permissions will be overwritten by contact permissions if they are set
      //let permissions = Object.assign(group.permissions, contact.permissions);
      let permissions = group.permissions;

      // Resolve reactive permission type
      Object.keys(permissions).forEach(function (key) {
        let val = permissions[key];

        if (val === "allow") {
          permissions[key] = true;
        }

        if (val === "forbid") {
          permissions[key] = false;
        }

        if (val === "react") {
          if (contact.hasOwnProperty(key + "_self")) {
            permissions[key] = contact[key + "_self"] > 0;
          } else {
            permissions[key] = false; // Default to false
          }
        }
      });

      // Todo: move this to a function that can be called independently
      let allowedInteractions = new InteractionSet();

      if (filterSnuggles) {
        allowedInteractions.filter((interaction) => {
          // Remove all sexual interactions from the allowed list
          return interaction.hasOwnProperty("sexual")
            ? !interaction.sexual
            : true;
        });
      }

      // Now build a list of interactions that appear on whitelists
      if (group.hasOwnProperty("categories")) {
        this.applyWhitelists(allowedInteractions, group.categories);
        // @todo: allow whitelisting and blacklisting on a per-contact scope
        this.applyBlacklists(allowedInteractions, group.categories);
      }

      let safe_mode = false; // @todo get from settings

      allowedInteractions.filter((interaction) => {
        // Keep only interactions that are available in the dropdown
        if (available_interactions.indexOf(interaction.id) === -1) {
          return false;
        }

        let allow = true;

        Object.keys(permissions).forEach((type) => {
          if (permissions[type] === true) {
            //debug("Allowed " + interaction.name);
            return; // No need to check for types that are allowed
          }

          if (safe_mode && !interaction.hasOwnProperty(type)) {
            allow = false; // In safe mode, interactions with unknown/null data for a type are disallowed
            return;
          }

          if (
            !interaction.hasOwnProperty(type) ||
            !Array.isArray(interaction[type])
          ) {
            // safe mode is off and property is not defined, so assume the type is allowed
            return;
          }

          if (interaction[type][0] > 0) {
            allow = false;
            return;
          }
        });

        return allow;
      });

      // Now use defined behaviour in either the contact or the contact's group to decide which interaction to pick
      return behaviourData.parse(
        group.behaviour,
        contact,
        is_phone,
        num_interactions,
        allowedInteractions
      );
    },
    applyCategoryLists: function (interactionSet, list) {
      let blacklisted = [];
      let whitelisted = {};

      let categories = this.parent.getCategories();
      let interactions = this.parent.getInteractions();

      Object.keys(list).forEach((category) => {
        if (list[category] === "w") {
          let ids = interactionSet.resolveCategory(categories[category]);

          ids.forEach((id) => {
            if (!interactions.hasOwnProperty(id) || !interactions[id]) {
              throw "Interaction does not exist";
            } else {
              whitelisted[id] = interactions[parseInt(id)];
            }
          });
        } else if (list[category] === "b") {
          blacklisted = blacklisted.concat(
            interactionSet.resolveCategory(categories[category])
          );
        }
      });

      interactionSet.remove(blacklisted);
      interactionSet.add(whitelisted);
    },

    applyWhitelists: function (interactionSet, categories) {
      let categoryData = this.parent.getCategories();
      let allInteractions = new InteractionSet(this.parent.getInteractions());

      debug(Object.keys(allInteractions.interactions).length);

      Object.keys(categories).forEach(function (key) {
        if (categories[key] === "w") {
          interactionSet.add(
            allInteractions.subset((interaction) => {
              return categoryData[key].entries.indexOf(interaction.id) !== -1;
            }).interactions
          );
        }
      });
    },

    applyBlacklists: function (interactionSet, categories) {
      let categoryData = this.parent.getCategories();

      Object.keys(categories).forEach(function (key) {
        if (categories[key] === "b") {
          interactionSet.remove(categoryData[key].entries);
        }
      });
    },
  }); // Added interactionsModule

  assistant.parsers.push({
    name: "Relationships Table Parser",

    parse: function (document, assistant) {
      if (
        document.location.href.indexOf(
          "/Character/Relations/" + assistant._character_id
        ) === -1
      ) {
        return false;
      }

      let rows = document.querySelectorAll("div.content table.data tbody tr");

      rows.forEach((row) => {
        let parsedData = {};

        let cells = row.querySelectorAll("td");
        let anchor = cells[0].querySelector("a");

        parsedData.id = /Character\/([0-9]+)/.exec(anchor.href)[1];

        let contact = assistant.getContact(parsedData.id);

        parsedData.name = anchor.innerText;
        parsedData.same_city = anchor.querySelector("strong") ? true : false;

        parsedData.friendship_total = cells[1]
          .querySelector("div.progressBar")
          .title.replace("%", "");
        parsedData.love_total = cells[2]
          .querySelector("div.progressBar")
          .title.replace("%", "");
        parsedData.hate_total = cells[3]
          .querySelector("div.progressBar")
          .title.replace("%", "");
        parsedData.in_table = new Date().getTime(); // Mark this contact as still existing in the table
        parsedData.is_active = true;

        contact = Object.assign(contact, parsedData);
        assistant.setContact(contact);
      });
    },
  });

  assistant.parsers.push({
    name: "Relationship Details Parser",

    parse: function (document, assistant) {
      if (document.location.href.indexOf("/Interact") === -1) {
        return false;
      }

      let data = {};
      data.id = document.querySelector(
        "div.interactPortrait.normargin div.idHolder"
      ).innerText; // If this fails there's no point in parsing anything else

      let contact = assistant.getContact(data.id);

      if (data.id) {
        assistant.repository.context.set("target_id", data.id);
      } else {
        debug("Failed to parse target_id");
        return;
      }

      // Check if this is a relationship by looking for the "end relationship" button
      if (
        !document.getElementById("ctl00_cphTopColumn_ctl00_btnEndRelationship")
      ) {
        if (contact.is_active) {
          contact.is_active = false;
          assistant.setContact(contact);
        }

        return true;
      } else {
        contact.is_active = true;
      }

      // Total values
      let elements = document.querySelectorAll(
        "div.interactHolder div:nth-child(1) div.progressBar"
      );
      data.love_total = elements[0].title.replace("%", "");
      data.friendship_total = elements[1].title.replace("%", "");
      data.hate_total = elements[2].title.replace("%", "");

      // One-sided values
      elements = document.querySelectorAll(
        "div.interactPortrait div.box:nth-child(3) p"
      );
      let matches = /([0-9]+)%(?:[\s\S]+?)([0-9]+)%(?:[\s\S]+?)([0-9]+)%/.exec(
        elements[0].innerText
      ); // first result is self
      data.love_self = matches[1];
      data.friendship_self = matches[2];
      data.hate_self = matches[3];

      // Almost exactly the same for the other side
      matches = /([0-9]+)%(?:[\s\S]+?)([0-9]+)%(?:[\s\S]+?)([0-9]+)%/.exec(
        elements[1].innerText
      ); // second result is contact
      data.love_contact = matches[1];
      data.friendship_contact = matches[2];
      data.hate_contact = matches[3];

      // Last received data
      const dateParagraph = document.querySelector("div.interactHolder div.box:last-of-type p");
      if (dateParagraph) {
          console.log(dateParagraph);
          const dateformat = assistant.getGlobal("dateformat", "DD.MM.YYYY");

          const receivedText = dateParagraph.innerHTML.split("<br>")[1].split(" ");
          const receivedDateText = receivedText[receivedText.length-1].slice(0,-1);
          const receivedDate = moment(receivedDateText, dateformat);
          if (receivedDate.isValid()) {
              data.last_received = receivedDate.unix();
          }
      }

      // Merge new data
      contact = Object.assign(contact, data);
      assistant.setContact(contact);

      // Attach event listeners
      let interactBtn = document.getElementById(
        "ctl00_cphTopColumn_ctl00_btnInteract"
      );
      if (interactBtn) {
        interactBtn.addEventListener("click", () => {
          assistant.setContactAttribute(data.id, "last_clicked", Date.now());
        });
      }
    },
  });

  assistant.parsers.push({
    name: "InteractionsData Parser",

    parse: function (document, assistant) {
      if (document.location.href.indexOf("/Interact") === -1) {
        return false;
      }

      let contact_id = document.querySelector(
        "div.interactPortrait.normargin div.idHolder"
      ).innerText;
      let contact = assistant.getContact(contact_id);

      let old_data = _.cloneDeep(
        assistant.repository.session.get("interactions_parser.data", null)
      );
      assistant.repository.session.remove("interactions_parser.data");

      let log_data = null;
      try {
        log_data = document.querySelectorAll(
          "div.interactHolder div.box table.data tbody tr i"
        )[0].innerText;
      } catch (e) {
        debug("Failed to find log_data entry!");
      }

      if (old_data) {
        // @todo: Find a better way to check if the chosen interaction was actually (successfully) performed
        if (old_data.contact !== contact_id) {
          return;
        }

        if (log_data === null || old_data.log_data === log_data) {
          debug("Aborting data collection due to log data");
          return;
        }

        if (Date.now() - old_data.timestamp > 5000) {
          return;
        }

        let interactions = assistant.getInteractions();
        let interaction = interactions[old_data.interaction];
        let types = ["friendship", "love", "hate"];
        let save = false;

        types.forEach((type) => {
          let change = parseInt(contact[type + "_contact"] - old_data[type]);

          if (!Array.isArray(interaction[type])) {
            delete interaction[type]; // Failsafe
            save = true;
          }

          if (
            parseInt(contact[type + "_contact"]) === 0 ||
            parseInt(contact[type + "_contact"]) === 100
          ) {
            return; // Data is unusable if the stat is at max or min
          }

          if (!interaction.hasOwnProperty(type)) {
            interaction[type] = [change];
            save = true;
          } else if (interaction[type].indexOf(change) === -1) {
            interaction[type].push(change);
            interaction[type].sort(function (a, b) {
              return parseInt(a) < parseInt(b);
            });

            save = true;
          }
        });

        if (save) {
          debug("Saving interaction " + JSON.stringify(interaction));

          assistant.setInteractions(interactions);
          assistant.save();
        }
      }

      // Save data when the interact button is pressed
      let button = document.getElementById(
        "ctl00_cphTopColumn_ctl00_btnInteract"
      );
      if (button) {
        button.addEventListener("click", function () {
          let interaction_id = null;

          try {
            interaction_id =
              button.parentElement.parentElement.querySelector("select").value;
          } catch (e) {
            debug("Failed to find interaction id after button press!");
          }

          if (interaction_id) {
            let data = {
              // Store data so it can be read on the next page load
              friendship: contact.friendship_contact,
              love: contact.love_contact,
              hate: contact.hate_contact,
              interaction: interaction_id,
              contact: contact.id,
              log: log_data,
            };

            assistant.repository.session.set("interactions_parser.data", data);
            debug("Stored data");
            debug(data);
          }
        });
      }
    },
  });

  // Define components
  Vue.component("assistant-controls", {
    template: `
          <div class="assistant-controls-container">
              <div class="assistant-controls">
                  <button title="Click here to manage your assistant's settings!" @click="openSettings">Settings</button>
                  <button title="Click here to start automatic interactions!" @click="openInteract">Interact</button>
              </div>
          </div>
      `,
    methods: {
      openSettings: function () {
        this.$bus.$emit("window.settings.open");
      },
      openContacts: function () {
        this.$bus.$emit("window.contacts.open");
      },
      openInteract: function () {
        this.$bus.$emit("window.interact.open");
      },
    },
  });

  Vue.component("assistant-modal", {
    template: `
          <div class="modal" v-if="show">
              <div class="modal-background" @click="$emit('close')"></div>
              <div class="modal-content">
                  <slot></slot>
              </div>
          </div>
      `,
    props: {
      show: {
        default: false,
      },
    },
  });

  Vue.component("assistant-categories", {
    template: `
          <div>
              <div>
                  <h3>Select</h3>
                  <div>
                      <select @change="selectCategory" class="round" style="width:100%;">
                          <option selected>Select a category...</option>
                          <option v-for="(category, id) in categories" :value="id" :selected="selected_category_id === id">{{ category.name }}</option>
                      </select>
                  </div>
                  <div>
                      <input type="text" placeholder="New category.. (Press enter to create)" @keydown.enter="create" class="round" style="width:100%;margin-top:5px;box-sizing:border-box;" />
                  </div>
              </div>
              <div v-if="selected_category">
                  <div>
                      <h3>Details</h3>
                      <div>
                          <label>ID</label>
                          <input type="text" :value="selected_category_id" disabled />
                      </div>
                      <div>
                          <label>Name</label>
                          <input type="text" v-model="selected_category.name" :disabled="selected_category.is_default" />
                      </div>
                      <div v-if="can_delete">
                          <button @click="remove()">Delete</button>
                      </div>
                  </div>
                  <div>
                      <h3>Interactions</h3>
                      <table class="data">
                          <thead>
                              <tr>
                                  <th>Enabled</th>
                                  <th>Disabled</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>
                                      <div v-for="interaction in enabled_interactions" @click="disableInteraction(interaction.id)" class="pditem pdevent" style="cursor:pointer;">
                                          <span>{{ interaction.name }}</span>
                                          <span v-if="isType(interaction, 'friendship')" :title="toPercentage(interaction.friendship)" style="float:right;">😃</span>
                                          <span v-if="isType(interaction, 'love')" :title="toPercentage(interaction.love)" style="float:right;">❤️</span>
                                          <span v-if="isType(interaction, 'hate')" :title="toPercentage(interaction.hate)" style="float:right;">👿</span>
                                          <span v-if="interaction.diary" title="This interaction appears in the diary" style="float:right;">💬</span>
                                          <span v-if="interaction.phone" title="Phone interaction" style="float:right;">📞</span>
                                          <span v-if="interaction.sexual" title="This interaction may cause pregnancy" style="float:right;">💜</span>
                                      </div>
                                  </td>
                                  <td>
                                      <div v-for="interaction in disabled_interactions" @click="enableInteraction(interaction.id)" class="pditem pdsong" style="cursor:pointer;clear:both;">
                                          <span>{{ interaction.name }}</span>
                                          <span v-if="isType(interaction, 'friendship')" :title="toPercentage(interaction.friendship)" style="float:right;">😃</span>
                                          <span v-if="isType(interaction, 'love')" :title="toPercentage(interaction.love)" style="float:right;">❤️</span>
                                          <span v-if="isType(interaction, 'hate')" :title="toPercentage(interaction.hate)" style="float:right;">👿</span>
                                          <span v-if="interaction.diary" title="This interaction appears in the diary" style="float:right;">💬</span>
                                          <span v-if="interaction.phone" title="Phone interaction" style="float:right;">📞</span>
                                          <span v-if="interaction.sexual" title="This interaction may cause pregnancy" style="float:right;">💜</span>
                                      </div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      `,
    data: function () {
      return {
        categories: {},
        interactions: {},
        selected_category_id: null,
        enabled_interactions: {},
        disabled_interactions: {},
      };
    },
    computed: {
      selected_category: function () {
        return this.selected_category_id
          ? this.categories[this.selected_category_id]
          : null;
      },
      can_delete: function () {
        return true;
      },
    },
    methods: {
      isType(interaction, type) {
        if (!interaction.hasOwnProperty(type)) {
          return false;
        }

        if (parseInt(interaction[type][0]) > 0) {
          // checks highest value
          return true;
        }

        return false;
      },
      toPercentage: function (type) {
        let min = type[type.length - 1];
        let max = type[0];

        if (min !== max) {
          return min.toString() + "-" + max.toString() + "%";
        }

        return min.toString() + "%";
      },
      selectCategory: function (event) {
        this.selected_category_id = event.target.value;

        this.updateCategoryInteractions();
      },
      updateCategoryInteractions: function () {
        this.enabled_interactions = this.interactions.subset((interaction) => {
          return this.selected_category.entries.indexOf(interaction.id) !== -1;
        }).interactions;

        this.disabled_interactions = this.interactions.subset((interaction) => {
          return this.selected_category.entries.indexOf(interaction.id) === -1;
        }).interactions;
      },
      enableInteraction: function (id) {
        this.selected_category.entries.push(id);
        this.updateCategoryInteractions();
        this.save();
      },
      disableInteraction: function (id) {
        let index = this.selected_category.entries.indexOf(id);

        if (index > -1) {
          this.selected_category.entries.splice(index, 1);
        }

        this.updateCategoryInteractions();
        this.save();
      },
      save: function () {
        this.$assistant.setCategories(this.categories);
      },
      remove: function () {
        delete this.categories[this.selected_category_id];

        this.selected_category_id = null;

        this.save();
      },
      create: function (event) {
        let name = event.target.value;
        let id = name
          .toLowerCase()
          .replace(/([^a-z]+)/g, "_")
          .replace(/^([_]+)|([_]+)$/g, "");

        if (this.categories.hasOwnProperty(id)) {
          let i = 1;

          while (this.categories.hasOwnProperty(id + "_" + i.toString())) {
            i++;
          }

          id = id + "_" + i.toString();
        }

        let category = {
          name: name,
          entries: [],
          default: false,
        };

        Vue.set(this.categories, id, category);
        this.save();

        event.target.value = "";
        event.target.blur();

        this.selected_category_id = id;
      },
    },
    mounted: function () {
      this.categories = this.$assistant.getCategories();
      this.interactions = new InteractionSet(this.$assistant.getInteractions());
    },
  });

  Vue.component("assistant-groups-tab", {
    template: `
          <div>
              <div style="margin:5px 0px;">
                  <h3>Groups</h3>
                  <select @change="selectGroup" class="round" style="width:100%;">
                      <option selected>Select group</option>
                      <option v-for="(group, name) in groups" :value="name" :selected="name === selected_group_id">{{ name }}</option>
                  </select>
                  <input type="text" placeholder="New group... (press enter to create)" @keydown.enter="create" />
              </div>

              <div v-if="selected_group">
                  <fieldset class="assistant">
                      <legend>Properties</legend>
                      <div>
                          <p>
                              The behaviour of a group is a set of rules that decides how interactions are chosen. Do not change this unless you are certain you know what you are doing, because
                              invalid rules may cause the automatic selection of interactions to break.
                          </p>
                          <label>Behaviour</label>
                          <input type="text" class="round" v-model="behaviour_editable" style="display:block;width:100%;font-family:monospace;box-sizing:border-box;" @change="validateBehaviour" />
                          <div class="error" v-if="behaviour_invalid">
                              Behaviour is invalid: {{ behaviour_invalid_error }}<br />
                              Changes to the behaviour will not be saved before all errors are fixed!
                          </div>
                      </div>
                  </fieldset>

                  <fieldset class="assistant">
                      <legend>Display</legend>
                      <div>
                          <label>Foreground</label>
                          <input type="text" class="round" v-model="selected_group.foreground_color" style="display:block;width:100%;font-family:monospace;box-sizing:border-box;" @change="save" />
                      </div>

                      <div>
                          <label>Background</label>
                          <input type="text" class="round" v-model="selected_group.background_color" style="display:block;width:100%;font-family:monospace;box-sizing:border-box;" @change="save" />
                      </div>

                      <div>
                          <label>Example</label>
                          <div><span v-bind:style="{backgroundColor: selected_group.background_color, color: selected_group.foreground_color}">John Doe</span></div>
                      </div>
                  </fieldset>

                  <fieldset class="assistant">
                      <legend>Permissions</legend>
                      <p>
                          Forbidding a stat means that interactions that increase that stat will never be allowed, regardless of categories selected. When set to "react", the permission will change based on what the <em>other</em> person does.
                      </p>
                      <table class="data">
                          <thead>
                              <tr>
                                  <th>Stat</th>
                                  <th>Forbid</th>
                                  <th>React</th>
                                  <th>Allow</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="permission in permissions">
                                  <td>{{ permission }}</td>
                                  <td><input type="radio" @change="setPermission(permission, 'forbid')" :name="permission" :checked="selected_group.permissions[permission] === 'forbid'" /></td>
                                  <td><input type="radio" @change="setPermission(permission, 'react')" :name="permission" :checked="selected_group.permissions[permission] === 'react'" /></td>
                                  <td><input type="radio" @change="setPermission(permission, 'allow')" :name="permission" :checked="selected_group.permissions[permission] === 'allow'" /></td>
                              </tr>
                          </tbody>
                      </table>
                  </fieldset>

                  <fieldset class="assistant">
                      <legend>Categories</legend>
                      <p>
                          <strong>Blacklisting</strong> a category means that interactions from that category will <em>never</em> be allowed in this group. <strong>Defaulting</strong> a
                          category means that the category will not change anything for this group. <strong>Whitelisting</strong> a category means that interactions from that category will
                          be available for contacts in this group, <em>unless</em> they are blacklisted by another category.
                      </p>
                      <p>
                          In summary: Whitelist categories that you want this group to use. Blacklist categories that this group should <strong>never</strong> use. Everything else should
                          be left on default.
                      </p>
                      <table class="data">
                          <thead>
                              <tr>
                                  <th>Category</th>
                                  <th>Blacklist</th>
                                  <th>Default</th>
                                  <th>Whitelist</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(category, id, idx) in categories" :class="{odd: (idx % 2 === 1), even: (idx % 2 === 0)}">
                                  <td><span :title="id">{{ category.name }}</span></td>
                                  <td><input type="radio" @change="listCategory(id, 'b')" :name="name" :checked="selected_group.categories[id] === 'b'" /></td>
                                  <td><input type="radio" @change="listCategory(id, null)" :name="name" :checked="! selected_group.categories.hasOwnProperty(id)" /></td>
                                  <td><input type="radio" @change="listCategory(id, 'w')" :name="name" :checked="selected_group.categories[id] === 'w'" /></td>
                              </tr>
                          </tbody>
                      </table>
                  </fieldset>
              </div>
          </div>
      `,
    data: function () {
      return {
        permissions: ["friendship", "love", "hate"],
        groups: {},
        selected_group_id: null,
        categories: {},
        behaviour_invalid: false,
        behaviour_invalid_error: "",
        behaviour_editable: "",
      };
    },
    computed: {
      selected_group: function () {
        let group = this.selected_group_id
          ? this.groups[this.selected_group_id]
          : null;
        if (group && !group.hasOwnProperty("permissions")) {
          group.permissions = {};
        }
        return group;
      },
    },
    methods: {
      create: function (event) {
        let group_name = event.target.value;

        if (!group_name || group_name.length < 1) {
          return;
        }

        let group_id = group_name.toLowerCase().replace(/([^a-z]+)/g, "_");

        if (this.groups.hasOwnProperty(group_id)) {
          debug("Group id already exists");
          return;
        }

        let group = {
          name: group_name,
          behaviour: "",
          categories: {},
          permissions: {},
        };

        this.groups[group_id] = group;
        this.save();
      },
      validateBehaviour: function (event) {
        let result = false;

        try {
          result = behaviourData.parseDebug(event.target.value);
        } catch (e) {
          debug("Caught an exception");
          debug(e);
          this.behaviour_invalid_error = e;
          result = false;
        }

        if (result !== false) {
          this.behaviour_invalid = false;

          // Save only when valid
          this.groups[this.selected_group_id].behaviour = event.target.value;
          this.save();
        } else {
          this.behaviour_invalid = true;
        }
      },
      selectGroup: function (event) {
        this.selected_group_id = event.target.value;
        this.behaviour_editable = this.selected_group.behaviour;
      },
      listCategory(id, list) {
        if (
          list === null &&
          this.selected_group.categories.hasOwnProperty(id)
        ) {
          // unlist
          Vue.delete(this.selected_group.categories, id);
        }

        if (list === "b") {
          // blacklist
          Vue.set(this.selected_group.categories, id, "b");
        }

        if (list === "w") {
          // whitelist
          Vue.set(this.selected_group.categories, id, "w");
        }

        this.save();
      },
      setPermission(stat, value) {
        this.groups[this.selected_group_id].permissions[stat] = value;
        this.save();
      },
      save: function () {
        this.$assistant.setGroups(this.groups);
      },
    },
    mounted: function () {
      this.groups = this.$assistant.getGroups();
      this.categories = this.$assistant.getCategories();
    },
  });

  Vue.component("assistant-settings", {
    template: `
          <assistant-modal :show="show" @close="close">
          <span class="close" @click="close">[X]</span>
          <h1>Assistant Settings</h1>
          <hr />
          <div class="a_tabs">
              <button class="a_tab" @click="switchTab('assistant')">Assistant</button>
              <button class="a_tab" @click="switchTab('categories')">Categories</button>
              <button class="a_tab" @click="switchTab('groups')">Groups</button>
          </div>
          <div v-if="active === 'assistant'">
              <div>
              <fieldset class="assistant">
              <legend>My character</legend>
              <div>
              <label>Last hit song</label>
              <input type="date" v-model="last_hit_song" /><button @click="lastHitSongNow">Now</button>
              </div>
              <div>
              <label>Color in dropdown (empty for default)</label>
              <input type="color" v-model="character_select_color" />
              </div>
              <div>
              <label>Custom order in select (lower number is higher)</label>
              <input type="number" min="0" max="9999" v-model="character_select_order" />
              </div>
              </fieldset>
                  <fieldset class="assistant">
                  <legend>Defaults</legend>
                      <div>
                          <label>Default group for contacts</label><br />
                          <select v-model="default_group" @change="saveDefaultGroup" class="round">
                              <option v-for="(group, key) in groups" :value="key">{{ key }}</option>
                          </select>
                      </div>
                      <div>
                          <label>Date format</label><br />
                          <input type="text" class="round" v-model="dateformat" @change="saveSettings" />
                      </div>
                  </fieldset>

                  <fieldset class="assistant">
                      <legend>Modules</legend>
                      <div>
                          <input type="checkbox" id="setting_browsernotifications" v-model="browsernotifications" @change="onBrowserNotificationsChange" />
                          <label for="setting_browsernotifications">Enable browser notifications</label><br />
                      </div>
                  </fieldset>

                  <fieldset class="assistant">
                      <legend>Cosmetic</legend>
                      <div>
                          <label>Replace M$ currency symbol with (leave empty to disable):</label><br />
                          <input type="text" class="round" v-model="currency" @change="saveSettings" />
                      </div>
                      <hr />
                      <div>
                          <input type="checkbox" id="setting_enhanceProgressBars" v-model="enhanceProgressBars" @change="saveSettings" />
                          <label for="setting_enhanceProgressBars">Show percentage in progress bars (health, mood, etc.)</label><br />
                      </div>

                      <div>
                          <input type="checkbox" id="setting_enhanceScoringText" v-model="enhanceScoringText" @change="saveSettings" />
                          <label for="setting_enhanceScoringText">Show numeric value for scoring text (i.e. GOD SMACKING)</label><br />
                      </div>
                  </fieldset>

                  <fieldset class="assistant">
                      <legend>Development</legend>
                      <div>
                          <input type="checkbox" v-model="exports_categories" id="exports_categories" />
                          <label for="exports_categories">Categories</label>
                      </div>
                      <div>
                          <input type="checkbox" v-model="exports_contacts" id="exports_contacts" />
                          <label for="exports_contacts">Contacts</label>
                      </div>
                      <div>
                          <input type="checkbox" v-model="exports_groups" id="exports_groups" />
                          <label for="exports_groups">Groups</label>
                      </div>
                      <div>
                          <input type="checkbox" v-model="exports_interactions" id="exports_interactions" />
                          <label for="exports_interactions">Interactions</label>
                      </div>
                      <hr />
                      <button @click="exportInteractionData">Export data</button>
                      <button @click="importInteractionData">Import data</button>
                      <hr />
                      <textarea ref="data_export"></textarea>
                  </fieldset>
              </div>
          </div>
          <div v-if="active === 'categories'">
            <assistant-categories></assistant-categories>
          </div>
          <div v-if="active === 'groups'">
            <assistant-groups-tab></assistant-groups-tab>
          </div>
          </assistant-modal>
      `,
    data: function () {
      return {
        show: false,
        active: "assistant",

        default_group: null,
        dateformat: "DD.MM.YYYY",

        interactions: [],

        // Categories
        categories: {},
        selectedCategory: null,
        selectedCategoryName: null,
        categoryInteractions: null,

        // Groups
        groups: {},
        selectedGroup: null,
        selectedGroupName: null,

        // Import/Export
        exports_categories: true,
        exports_contacts: true,
        exports_groups: true,
        exports_interactions: true,

        // Modules
        browsernotifications: this.$assistant.getGlobal(
          "setting_browsernotifications",
          false
        ),
        currency: "",
        enhanceProgressBars: this.$assistant.getGlobal(
          "enhanceProgressBars",
          true
        ),
        enhanceScoringText: this.$assistant.getGlobal(
          "enhanceScoringText",
          true
        ),

        // Character data
        last_hit_song: null,
        character_select_color: null,
        character_select_order: null,
      };
    },
    watch: {
      last_hit_song: function (newValue, oldValue) {
        this.$assistant.setNew("$character$_last_bh", newValue);
      },
      character_select_color: _.debounce((newValue, oldValue) => {
        assistant.setNew("$character$_select_color", newValue);
      }, 200),
      character_select_order: function (newValue, oldValue) {
        this.$assistant.setNew("$character$_select_order", newValue);
      },
    },
    computed: {
      categoryIndex: function () {
        return Object.keys(this.categories);
      },
      is_default: function () {
        return true;
      },
    },
    methods: {
      lastHitSongNow: function () {
        this.last_hit_song = new Date();
      },
      open: function () {
        this.loadData();
        this.show = true;
      },
      close: function () {
        this.show = false;
      },
      toggle: function () {
        this.show = !this.show;
      },
      save: function () {
        this.$assistant.setGroups(this.groups);
        this.$assistant.setCategories(this.categories);
      },
      saveDefaultGroup: function () {
        this.$assistant.set("interactions.default_group", this.default_group);
      },
      async onBrowserNotificationsChange() {
        this.browsernotifications =
          this.browsernotifications &&
          (Notification.permission === "granted" ||
            (await Notification.requestPermission()) === "granted");
        this.$assistant.setGlobal(
          "setting_browsernotifications",
          this.browsernotifications
        );
      },
      saveSettings: function () {
        this.$assistant.setGlobal("currency", this.currency);
        this.$assistant.setGlobal(
          "enhanceProgressBars",
          this.enhanceProgressBars
        );
        this.$assistant.setGlobal(
          "enhanceScoringText",
          this.enhanceScoringText
        );
        this.$assistant.setGlobal("dateformat", this.dateformat);
      },
      switchTab: function (tab) {
        this.active = tab;
      },
      changeCategory: function (event) {
        this.selectedCategory = this.categories[event.target.value];
        this.selectedCategoryName = event.target.value;

        this.updateCategoryColumns();
      },
      exportInteractionData: function () {
        let data = {};

        // Todo: Checkboxes for including/excluding data
        if (this.exports_interactions) {
          data.interactions = this.$assistant.getInteractions();
        }

        if (this.exports_groups) {
          data.groups = this.$assistant.getGroups();
        }

        if (this.exports_categories) {
          data.categories = this.$assistant.getCategories();
        }

        if (this.exports_contacts) {
          data.contacts = this.$assistant.getContacts();
        }

        this.$refs.data_export.value = JSON.stringify(data, null, 4);
      },
      importInteractionData: function () {
        let data = JSON.parse(this.$refs.data_export.value);

        if (data.hasOwnProperty("interactions")) {
          debug("Importing interactions");
          this.$assistant.setInteractions(data.interactions, true);
        }

        if (data.hasOwnProperty("groups")) {
          debug("Importing groups");
          this.$assistant.setGroups(data.groups, true);
        }

        if (data.hasOwnProperty("categories")) {
          debug("Importing categories");
          this.$assistant.setCategories(data.categories, true);
        }

        if (data.hasOwnProperty("contacts")) {
          debug("Would import contacts if it were supported");
          //this.$assistant.setContacts(data.contacts, true);
        }

        this.$assistant.save();
      },
      updateCategoryColumns: function () {
        this.categoryInteractions = this.interactionSet.subset(
          (interaction) => {
            // Category should only display interactions that are part of the category
            return this.selectedCategory.entries.indexOf(interaction.id) !== -1;
          }
        ).interactions;

        this.interactions = this.interactionSet.subset((interaction) => {
          // Interactions list should only display interactions that are NOT part of the category
          return this.selectedCategory.entries.indexOf(interaction.id) === -1;
        }).interactions;
      },
      removeFromCategory: function (id) {
        let index = this.selectedCategory.entries.indexOf(id);

        if (index > -1) {
          this.selectedCategory.entries.splice(index, 1);
        }

        this.updateCategoryColumns();
        this.save(); // todo: categories only
      },
      addToCategory: function (id) {
        if (this.selectedCategory.entries.indexOf(id) === -1) {
          // prevent duplicates
          this.selectedCategory.entries.push(id);
        }

        this.updateCategoryColumns();
        this.save(); // todo: categories only
      },
      createCategory: function () {
        let categoryName = this.$refs.newCategoryName.value;

        if (
          !categoryName ||
          categoryName.length < 1 ||
          Object.keys(this.categories).indexOf(categoryName) !== -1
        ) {
          return false;
        }

        Vue.set(this.categories, categoryName, { entries: [] });

        // Category has been created, now update the UI
        this.$refs.newCategoryName.value = "";

        // And select it
        this.selectedCategory = this.categories[categoryName];
        this.selectedCategoryName = categoryName;
        // New category will only be saved when an item is added to it
      },
      deleteCategory: function () {
        if (!this.selectedCategory) {
          return false;
        }

        Vue.delete(this.categories, this.selectedCategoryName);

        this.selectedCategoryName = null;
        this.selectedCategory = null;
        this.$assistant.saveData();
      },
      changeGroupDropdown: function (event) {
        this.changeGroup(event.target.value);
      },
      changeGroup: function (name) {
        if (!this.groups[name].hasOwnProperty("permissions")) {
          this.groups[name].permissions = {};
        }

        this.selectedGroupName = name;
        this.selectedGroup = this.groups[name];
      },
      groupBlacklistCategory: function (groupName, categoryName) {
        let group = this.groups[groupName];

        if (
          !group.hasOwnProperty("categories") ||
          typeof group.categories !== "object"
        ) {
          group.categories = {};
        }

        group.categories[categoryName] = "b"; // "b" for blacklist
        this.save();
      },
      groupUnlistCategory: function (groupName, categoryName) {
        let group = this.groups[groupName];

        if (
          !group.hasOwnProperty("categories") ||
          typeof group.categories !== "object"
        ) {
          group.categories = {};
        }

        if (group.categories.hasOwnProperty(categoryName)) {
          delete group.categories[categoryName]; // Remove property completely
        }

        this.save();
      },
      groupWhitelistCategory: function (groupName, categoryName) {
        let group = this.groups[groupName];

        if (
          !group.hasOwnProperty("categories") ||
          typeof group.categories !== "object"
        ) {
          group.categories = {};
        }

        group.categories[categoryName] = "w"; // "w" for whitelist
        this.save();
      },
      loadData() {
        // Loads data when the interface is opened
        this.interactionSet = new InteractionSet(
          this.$assistant.getInteractions()
        );
        this.interactions = this.interactionSet.interactions;

        this.categories = this.$assistant.getCategories();
        this.groups = this.$assistant.getGroups();
        this.default_group = this.$assistant.get(
          "interactions.default_group",
          "friend"
        );
        this.dateformat = this.$assistant.get("dateformat", "DD.MM.YYYY");

        // Currency module
        this.currency = this.$assistant.getGlobal("currency");

        (this.last_hit_song = this.$assistant.getNew(
          "$character$_last_bh",
          null
        )),
          (this.character_select_color = this.$assistant.getNew(
            "$character$_select_color",
            "#ffffff"
          ));
        this.character_select_order = this.$assistant.getNew(
          "$character$_select_order",
          "0"
        );
      },
    },
    mounted: function () {
      this.$bus.$on("window.settings.open", this.open);
    },
  });

  Vue.component("assistant-interact", {
    template: `
          <assistant-modal :show="show" @close="close">
              <span class="close" @click="close">[X]</span>
              <h1>Assistant Interact</h1>
              <hr />
              <p>
                  Assistant Interact helps you to interact with everybody you know! Choose your preferences below, press the "start" button and sit back
                  while your Assistant does all the hard work for you, the way you want it!
              </p>
              <p>
                  After pressing start, your browser will automatically start navigating to different pages within the game. Don't worry, this is normal! Your Assistant is simply doing what you would
                  normally do to interact with your contacts. <strong>You can stop or pause the interactions at any time by clicking anywhere on the page</strong>.
              </p>
              <hr />
              <h1>Settings</h1>

              <fieldset>
                  <legend>Flow</legend>
                  <div style="padding:7px;">
                      <input id="a_interactions_auto_focus" type="checkbox" v-model="settings.auto_focus" @change="update" />
                      <label for="a_interactions_auto_focus">Automatically change character focus after interacting</label>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_manual" type="checkbox" v-model="settings.manual" @change="update" />
                      <label for="a_interactions_manual">Don't interact automatically - let me click the button myself!</label>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_continue" type="checkbox" v-model="settings.continue" @change="update" />
                      <label for="a_interactions_continue">Continue from where I left off (if applicable)</label>
                  </div>
  <div style="padding:7px;">
                      <input id="a_interactions_nosnuggle" type="checkbox" v-model="settings.nosnuggle" @change="update" />
                      <label for="a_interactions_nosnuggle">Do not snuggle</label>
                  </div>
  <div style="padding:7px;">
                      <input id="a_interactions_pausesnuggle" type="checkbox" v-model="settings.pausesnuggle" @change="update" />
                      <label for="a_interactions_pausesnuggle">Pause after snuggling</label>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_max_characters_enabled" type="checkbox" v-model="settings.max_characters_enabled" @change="update" />
                      <label for="a_interactions_max_characters_enabled">Finish interaction phase after interacting with at most this many characters</label> (max <input type="number" @change="update" v-model="settings.max_characters"/>)
                  </div>
  <div style="padding:7px;">
                      <input id="a_interactions_autoaphro" type="checkbox" v-model="settings.autoaphro" @change="update" />
                      <label for="a_interactions_autoaphro">Use aphrodisiac after snuggling (auto-aphro)</label> (max <input type="number" @change="update" v-model="settings.autoaphro_max"/>)
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_stop_after_snuggle" type="checkbox" v-model="settings.stop_after_snuggle" @change="update" />
                      <label for="a_interactions_stop_after_snuggle">Finish interaction phase after snuggling (will still continue if an aphrodisiac has been used by auto-aphro)</label>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_restlocale_enabled" type="checkbox" v-model="settings.restlocale_enabled" @change="update" />
                      <label for="a_interactions_restlocale_enabled">Move character after interactions</label> using ruleset: <input type="numeric" @change="update" v-model="settings.restlocale"/>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_auto_use_enabled" type="checkbox" v-model="settings.auto_use_enabled" @change="update" />
                      <label for="a_interactions_auto_use_enabled">Auto use items</label> <input type="text" @change="update" v-model="settings.auto_use"/>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_cyclecharacters" type="checkbox" v-model="settings.cyclecharacters" @change="update" />
                      <label for="a_interactions_cyclecharacters">Cycle through my characters (switch to next character when done)</label>
                  </div>
                  <div style="padding:7px;">
                      <label for="a_interactions_speed">Speed</label>
                      <select id="a_interactions_continue" type="checkbox" v-model="settings.speed" @change="update">
                          <option value="5000">Slowest (5 seconds)</option>
                          <option value="2500">Slower (2.5 seconds)</option>
                          <option value="1500">Slow (1.5 seconds)</option>
                          <option value="1000">Normal (1 second)</option>
                          <option value="500">Fast (0.5 seconds)</option>
                          <option value="250">Faster (0.25 seconds)</option>
                          <option value="50">Fastest (0 seconds)</option>
                      </select>
                  </div>
              </fieldset>

              <fieldset>
                  <legend>Filters</legend>
                  <div style="padding:7px;">
                      <input id="a_interactions_limit_hours" type="number" v-model="settings.limit_hours" min="0" class="round" style="width:30px;" @change="update" />
                      <label for="a_interactions_limit_hours">Only try to interact with contacts I haven't interacted with in this many hours</label>
                  </div>
                  <div style="padding:7px;">
                      <input id="a_interactions_limit_city" type="checkbox" v-model="settings.limit_city" @change="update" />
                      <label for="a_interactions_limit_city">Only try to interact with contacts that are in the same city <i>(recommended when not VIP)</i></label>
                  </div>
                  <div>
  Interactions are available <strong>{{interactionCooldown}}</strong>
                  </div>
              </fieldset>

              <hr />
              <div style="display:flex;justify-content:center;">
                  <button style="padding:10px;width:150px;" @click="start">Start</button>
              </div>
          </assistant-modal>
      `,
    data: function () {
      return {
        show: false,
        settings: {
          limit_city: false,
          limit_hours: 12,
          manual: false,
          continue: true,
          speed: "1000",
          nosnuggle: false,
          pausesnuggle: false,
          autoaphro: false,
          autoaphro_max: 3,
          cyclecharacters: false,
          restlocale_enabled: false,
          restlocale: "auto",
          auto_focus: false,
          auto_use_enabled: false,
          auto_use:
            '"personal note about skills":g0h,":tune":i24h,"rubik\'s cube":g24h,"picture of grandparents":g56d,"damiana leaves":g4h,"pom-poms":g24h',
          max_characters_enabled: false,
          max_characters: 20,
          stop_after_snuggle: false,
        },
        lastInteractions: 0,
      };
    },
    computed: {
      interactionCooldown: function () {
        return moment.unix(this.lastInteractions + 60 * 60 * 12).fromNow();
      },
    },
    methods: {
      open: function () {
        this.loadData();
        this.show = true;
      },
      close: function () {
        this.show = false;
      },
      toggle: function () {
        this.show = !this.show;
      },
      start: function () {
        // Sync settings (and populate with default settings)
        this.update();

        setTimeout(this.close, 0);

        // Hand it over to assistant
        this.$assistant.modules.interactions.start();
      },
      update: function () {
        this.$assistant.set("interactions", this.settings);
      },
      loadData() {
        this.lastInteractions = parseInt(
          this.$assistant.repository.character.get("last_interactions_run", 0)
        );
        this.settings = Object.assign(
          this.settings,
          this.$assistant.get("interactions")
        ); // Override default settings with settings from assistant
      },
    },
    mounted: function () {
      this.$bus.$on("window.interact.open", this.open);
    },
  });

  Vue.component("assistant-contact-box", {
    template: `
          <div class="box">
              <h2>Assistant</h2>
              <table>
                  <tr>
                      <td>Group</td>
                      <td><assistant-groups :selected="contact.group" :groups="groups" @change="changeGroup"></assistant-groups></td>
                  </tr>
              </table>
          </div>
      `,
    props: {
      contact_id: {
        type: Number,
        required: true,
      },
    },
    data: function () {
      return {
        contact: {},
        groups: {},
      };
    },
    methods: {
      changeGroup: function (value) {
        Vue.set(this.contact, "group", value);
        this.save();
      },

      save: function () {
        this.$assistant.setContact(this.contact);
      },
    },
    mounted: function () {
      this.contact = this.$assistant.getContact(this.contact_id);
      this.groups = this.$assistant.getGroups();
    },
  });

  Vue.component("assistant-contact", {
    template: `
          <tr @click="debug">
              <td>{{ contact.name }}</td>
              <td v-for="attribute in attributes">{{ renderAttribute(attribute) }}</td>
              <td><assistant-groups :selected="group" :groups="groups" @change="changeGroup"></assistant-groups></td>
              <td @click="toggleFriendship" :class="{a_yes: friendship === 'yes', a_no: friendship === 'no', a_default: friendship === 'default'}">{{ friendship }}</td>
              <td @click="toggleLove" :class="{a_yes: love === 'yes', a_no: love === 'no', a_default: love === 'default'}">{{ love }}</td>
              <td @click="toggleHate" :class="{a_yes: hate === 'yes', a_no: hate === 'no', a_default: hate === 'default'}">{{ hate }}</td>
          </tr>
      `,
    data: function () {
      return {
        groups: {},
      };
    },
    computed: {
      group: function () {
        if (this.contact.hasOwnProperty("group") && this.contact.group) {
          return this.contact.group;
        } else {
          return "Default";
        }
      },
      friendship: function () {
        if (!this.contact.permissions.hasOwnProperty("friendship")) {
          return "default";
        } else if (this.contact.permissions.friendship) {
          return "yes";
        } else {
          return "no";
        }
      },
      love: function () {
        if (!this.contact.permissions.hasOwnProperty("love")) {
          return "default";
        } else if (this.contact.permissions.love) {
          return "yes";
        } else {
          return "no";
        }
      },
      hate: function () {
        if (!this.contact.permissions.hasOwnProperty("hate")) {
          return "default";
        } else if (this.contact.permissions.hate) {
          return "yes";
        } else {
          return "no";
        }
      },
    },
    methods: {
      toggleFriendship: function () {
        if (!this.contact.permissions.hasOwnProperty("friendship")) {
          Vue.set(this.contact.permissions, "friendship", false);
        } else if (false == this.contact.permissions.friendship) {
          Vue.set(this.contact.permissions, "friendship", true);
        } else {
          Vue.delete(this.contact.permissions, "friendship");
        }

        this.$assistant.dirty = true;
      },
      debug: function () {
        debug(this.contact);
      },
      toggleLove: function () {
        if (!this.contact.permissions.hasOwnProperty("love")) {
          Vue.set(this.contact.permissions, "love", false);
        } else if (false == this.contact.permissions.love) {
          Vue.set(this.contact.permissions, "love", true);
        } else {
          Vue.delete(this.contact.permissions, "love");
        }

        this.$assistant.dirty = true;
      },
      toggleHate: function () {
        if (!this.contact.permissions.hasOwnProperty("hate")) {
          Vue.set(this.contact.permissions, "hate", false);
        } else if (false == this.contact.permissions.hate) {
          Vue.set(this.contact.permissions, "hate", true);
        } else {
          Vue.delete(this.contact.permissions, "hate");
        }

        this.$emit("change", this.contact);

        //this.$assistant.dirty = true;
      },
      changeGroup: function (value) {
        Vue.set(this.contact, "group", value);
        this.$emit("change", this.contact);
      },

      renderAttribute: function (attribute) {
        let value = this.contact.hasOwnProperty(attribute.attr)
          ? this.contact[attribute.attr]
          : null;

        if (value !== null) {
          return attribute.template.replace("[value]", value);
        } else {
          return "NULL";
        }
      },
    },
    props: {
      contact: {
        type: Object,
        required: true,
      },
      attributes: {
        type: Array,
        required: true,
      },
    },
    beforeMount: function () {
      if (false == this.contact.hasOwnProperty("permissions")) {
        Vue.set(this.contact, "permissions", {});
      }
    },
    mounted: function () {
      this.groups = this.$assistant.getGroups();
    },
  });

  Vue.component("assistant-groups", {
    template: `
          <select @change="change">
              <option :selected="true">Default</option>
              <option v-for="(group, key) in groups" :value="key" :selected="selected === key">{{ key }}</option>
          </select>
      `,
    props: {
      selected: String,
      contact_id: String,
    },
    data: function () {
      return {
        groups: {},
      };
    },
    methods: {
      change: function (e) {
        if (this.contact_id) {
          let contact = this.$assistant.getContact(this.contact_id);
          contact.group = e.target.value;
          this.$assistant.setContact(contact);
        }

        this.$emit("change", e.target.value);
      },
    },
    mounted: function () {
      this.groups = this.$assistant.getGroups();
    },
  });

  Vue.component("assistant-contact-attribute", {
    template: `
          <select @change="change">
              <option v-for="attribute in attributes" :value="attribute.attr" :selected="attribute.attr === selected">{{ attribute.title }}</option>
          </select>
      `,
    props: {
      attributes: Array,
      selected: String,
    },
    methods: {
      change: function (e) {
        let value = e.target.value;
        let attribute = _.find(this.attributes, (o) => {
          return o.attr === value;
        });

        this.$emit("change", attribute);
      },
    },
  });

  Vue.component("assistant-interactions-guide", {
    template: `
          <assistant-modal :show="show" @close="close">
              <h1>Assistant Interact is working!</h1>
              <hr />
              <p>Your Assistant is performing interactions for you! You can pause this at any time by clicking anywhere on the screen.</p>
              <hr />
              <div>
                  <fieldset class="assistant">
                      <legend>Status</legend>
                      <div style="text-align:center;">
                          <h3>{{ status }}</h3>
                      </div>
                  </fieldset>
              </div>
              <div v-if="manual" class="flex">
                  <select @change="changeManual" class="round">
                      <option v-if="option.value != 0" v-for="option in manualDropdown.options" :value="option.value" :selected="option.selected">
                          {{ option.innerText }}
                      </option>
                  </select>
                  <button @click="doManual">Interact</button>
                  <button>Skip</button>
              </div>
          </assistant-modal>
      `,
    data: function () {
      return {
        show: false,
        manual: false,
        manualInteractionText: "",
        manualDropdown: null,
        manualButton: null,

        status: "",
        report: false,
      };
    },
    methods: {
      close: function () {
        // When closing this, the user intends to stop automation; tell the assistant to pause
        this.$assistant.modules.interactions.pause();
        this.show = false;
      },
      enableManual: function (event) {
        this.manualDropdown = event.dropdown;
        this.manualInteractionText =
          this.manualDropdown.options[
            this.manualDropdown.selectedIndex
          ].innerText;
        this.manualButton = event.button;
        this.manual = true;
      },
      changeManual: function (event) {
        this.manualDropdown.value = event.target.value;
      },
      doManual: function () {
        this.manual = false;
        this.manualButton.click();
      },
      updateStatus: function (status) {
        let parts = status.split(":");
        let name = null;
        let contact = null;

        if (parts.length > 1) {
          contact = this.$assistant.getContact(parts[1]);
        }

        if (contact) {
          name = contact.name;
        }

        if (["navigate", "interact", "choose"].indexOf(parts[0]) !== -1) {
          this.status = "Interacting with " + name;
        } else if (status === "report") {
          this.report = true;
          this.status = "Done!";
        } else {
          this.status = status;
        }
      },
    },
    mounted: function () {
      this.show = this.$assistant.modules.interactions.isActive();

      // Close if interactions are stopped for whatever reason
      this.$bus.$on("interactions.stopped", this.close);
      this.$bus.$on("interactions.manual", this.enableManual);

      this.$bus.$on("interactions.status", this.updateStatus);
    },
  });

  // Wait for DOmContentLoaded Event
  document.addEventListener("DOMContentLoaded", function (event) {
    parseCharacterData();
    modifyBody();

    // Prepare assistant
    assistant.init();

    // Prepare Vue
    Object.defineProperty(Vue.prototype, "$moment", { value: moment });
    Object.defineProperty(Vue.prototype, "$assistant", { value: assistant });
    Object.defineProperty(Vue.prototype, "$bus", { value: assistant.$bus });

    // Create Vue instance
    let app = new Vue({
      el: "#assistant",
    });

    // Start assistant
    assistant.start();
  });
})(); // End of wrapper function
