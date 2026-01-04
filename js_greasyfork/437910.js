// ==UserScript==
// @name         Miracle Scripts names colored
// @namespace    Miracle Scripts names colored
// @version      5.7.0
// @description  Best Agma.io script with tons of features
// @author       Samira, HutDude and others
// @license      MIT
// @icon         https://abload.de/img/mh3k8o.png
// @match        https://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437910/Miracle%20Scripts%20names%20colored.user.js
// @updateURL https://update.greasyfork.org/scripts/437910/Miracle%20Scripts%20names%20colored.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.miracleScripts = {

    // News icon: <img src="/img/new-icon.jpg" style="width: 30px;">
    //news: '<a href="https://discord.link/miracle" target="_blank" style="padding: 0;"><img src="https://media.discordapp.net/attachments/787319583366709279/810498703110570004/happy_valentine.png?width=500&height=281" style="width: 100%"></a>Miracle Scripts Valentine\'s Day Giveaway with gold membership, coins and bots!',
      news: 'Update: Multi feed got repaired.',

    // Player profiles
    profiles: {
        'LusualYT' : {
            nickNameColor: '#000000',
            nickNameStrokeColor: '#000000',
            nickNameStrokeWidth: 2,
        },
        //'inaaa' : {
        //    nickNameStrokeColor: 'deeppink',
        //},
    },

    banned: [],

    // Source: http://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim#answer-23377822
    keyboardMap: [
      '', // [0]
      '', // [1]
      '', // [2]
      'CANCEL', // [3]
      '', // [4]
      '', // [5]
      'HELP', // [6]
      '', // [7]
      'BACK_SPACE', // [8]
      'TAB', // [9]
      '', // [10]
      '', // [11]
      'CLEAR', // [12]
      'ENTER', // [13]
      'ENTER_SPECIAL', // [14]
      '', // [15]
      'SHIFT', // [16]
      'CONTROL', // [17]
      'ALT', // [18]
      'PAUSE', // [19]
      'CAPS_LOCK', // [20]
      'KANA', // [21]
      'EISU', // [22]
      'JUNJA', // [23]
      'FINAL', // [24]
      'HANJA', // [25]
      '', // [26]
      'ESCAPE', // [27]
      'CONVERT', // [28]
      'NONCONVERT', // [29]
      'ACCEPT', // [30]
      'MODECHANGE', // [31]
      'SPACE', // [32]
      'PAGE_UP', // [33]
      'PAGE_DOWN', // [34]
      'END', // [35]
      'HOME', // [36]
      'LEFT', // [37]
      'UP', // [38]
      'RIGHT', // [39]
      'DOWN', // [40]
      'SELECT', // [41]
      'PRINT', // [42]
      'EXECUTE', // [43]
      'PRINTSCREEN', // [44]
      'INSERT', // [45]
      'DELETE', // [46]
      '', // [47]
      '0', // [48]
      '1', // [49]
      '2', // [50]
      '3', // [51]
      '4', // [52]
      '5', // [53]
      '6', // [54]
      '7', // [55]
      '8', // [56]
      '9', // [57]
      'COLON', // [58]
      'SEMICOLON', // [59]
      'LESS_THAN', // [60]
      'EQUALS', // [61]
      'GREATER_THAN', // [62]
      'QUESTION_MARK', // [63]
      'AT', // [64]
      'A', // [65]
      'B', // [66]
      'C', // [67]
      'D', // [68]
      'E', // [69]
      'F', // [70]
      'G', // [71]
      'H', // [72]
      'I', // [73]
      'J', // [74]
      'K', // [75]
      'L', // [76]
      'M', // [77]
      'N', // [78]
      'O', // [79]
      'P', // [80]
      'Q', // [81]
      'R', // [82]
      'S', // [83]
      'T', // [84]
      'U', // [85]
      'V', // [86]
      'W', // [87]
      'X', // [88]
      'Y', // [89]
      'Z', // [90]
      'OS_KEY', // [91] Windows Key (Windows) or Command Key (Mac)
      '', // [92]
      'CONTEXT_MENU', // [93]
      '', // [94]
      'SLEEP', // [95]
      'NUMPAD0', // [96]
      'NUMPAD1', // [97]
      'NUMPAD2', // [98]
      'NUMPAD3', // [99]
      'NUMPAD4', // [100]
      'NUMPAD5', // [101]
      'NUMPAD6', // [102]
      'NUMPAD7', // [103]
      'NUMPAD8', // [104]
      'NUMPAD9', // [105]
      'MULTIPLY', // [106]
      'ADD', // [107]
      'SEPARATOR', // [108]
      'SUBTRACT', // [109]
      'DECIMAL', // [110]
      'DIVIDE', // [111]
      'F1', // [112]
      'F2', // [113]
      'F3', // [114]
      'F4', // [115]
      'F5', // [116]
      'F6', // [117]
      'F7', // [118]
      'F8', // [119]
      'F9', // [120]
      'F10', // [121]
      'F11', // [122]
      'F12', // [123]
      'F13', // [124]
      'F14', // [125]
      'F15', // [126]
      'F16', // [127]
      'F17', // [128]
      'F18', // [129]
      'F19', // [130]
      'F20', // [131]
      'F21', // [132]
      'F22', // [133]
      'F23', // [134]
      'F24', // [135]
      '', // [136]
      '', // [137]
      '', // [138]
      '', // [139]
      '', // [140]
      '', // [141]
      '', // [142]
      '', // [143]
      'NUM_LOCK', // [144]
      'SCROLL_LOCK', // [145]
      'WIN_OEM_FJ_JISHO', // [146]
      'WIN_OEM_FJ_MASSHOU', // [147]
      'WIN_OEM_FJ_TOUROKU', // [148]
      'WIN_OEM_FJ_LOYA', // [149]
      'WIN_OEM_FJ_ROYA', // [150]
      '', // [151]
      '', // [152]
      '', // [153]
      '', // [154]
      '', // [155]
      '', // [156]
      '', // [157]
      '', // [158]
      '', // [159]
      'CIRCUMFLEX', // [160]
      'EXCLAMATION', // [161]
      'DOUBLE_QUOTE', // [162]
      'HASH', // [163]
      'DOLLAR', // [164]
      'PERCENT', // [165]
      'AMPERSAND', // [166]
      'UNDERSCORE', // [167]
      'OPEN_PAREN', // [168]
      'CLOSE_PAREN', // [169]
      'ASTERISK', // [170]
      'PLUS', // [171]
      'PIPE', // [172]
      'HYPHEN_MINUS', // [173]
      'OPEN_CURLY_BRACKET', // [174]
      'CLOSE_CURLY_BRACKET', // [175]
      'TILDE', // [176]
      '', // [177]
      '', // [178]
      '', // [179]
      '', // [180]
      'VOLUME_MUTE', // [181]
      'VOLUME_DOWN', // [182]
      'VOLUME_UP', // [183]
      '', // [184]
      '', // [185]
      'SEMICOLON', // [186]
      'EQUALS', // [187]
      'COMMA', // [188]
      'MINUS', // [189]
      'PERIOD', // [190]
      'SLASH', // [191]
      'BACK_QUOTE', // [192]
      '', // [193]
      '', // [194]
      '', // [195]
      '', // [196]
      '', // [197]
      '', // [198]
      '', // [199]
      '', // [200]
      '', // [201]
      '', // [202]
      '', // [203]
      '', // [204]
      '', // [205]
      '', // [206]
      '', // [207]
      '', // [208]
      '', // [209]
      '', // [210]
      '', // [211]
      '', // [212]
      '', // [213]
      '', // [214]
      '', // [215]
      '', // [216]
      '', // [217]
      '', // [218]
      'OPEN_BRACKET', // [219]
      'BACK_SLASH', // [220]
      'CLOSE_BRACKET', // [221]
      'QUOTE', // [222]
      '', // [223]
      'META', // [224]
      'ALTGR', // [225]
      '', // [226]
      'WIN_ICO_HELP', // [227]
      'WIN_ICO_00', // [228]
      '', // [229]
      'WIN_ICO_CLEAR', // [230]
      '', // [231]
      '', // [232]
      'WIN_OEM_RESET', // [233]
      'WIN_OEM_JUMP', // [234]
      'WIN_OEM_PA1', // [235]
      'WIN_OEM_PA2', // [236]
      'WIN_OEM_PA3', // [237]
      'WIN_OEM_WSCTRL', // [238]
      'WIN_OEM_CUSEL', // [239]
      'WIN_OEM_ATTN', // [240]
      'WIN_OEM_FINISH', // [241]
      'WIN_OEM_COPY', // [242]
      'WIN_OEM_AUTO', // [243]
      'WIN_OEM_ENLW', // [244]
      'WIN_OEM_BACKTAB', // [245]
      'ATTN', // [246]
      'CRSEL', // [247]
      'EXSEL', // [248]
      'EREOF', // [249]
      'PLAY', // [250]
      'ZOOM', // [251]
      '', // [252]
      'PA1', // [253]
      'WIN_OEM_CLEAR', // [254]
      '' // [255]
    ],

    // List of bad words / strings that will be removed from chat messages send with the /say command.
    // NOTE: Do not sort this list in alphabetical order! Some words have to be before others.
    badWords: [
        'https://',
        'http://',
        'www.',
        '. c o m',
        '.c o m',
        '.c0m',
        '.com',
        '.io',
        'facebook',
        'face book',
        'cellcraft',
        'cell craft',
         'gay',
        'ga\.y',
        'cocksucker',
        'sucker',
        'sucka',
        'suck my',
        'blow job',
        'blowjob',
        'blow my',
        'mofo',
        'mother fucker',
        'motherfucker',
        'motherfucka',
        'mothafucka',
        'fucker',
        'facker',
        'fuck you',
        'fuk you',
        'fck you',
        'fk you',
        'fk u',
        'fk of',
        'fked',
        'fucking',
        'fucing',
        'fuck',
        'fück',
        'fack',
        'fukk',
        'f\.uck',
        'f u c k',
        'fkin',
        'smegma',
        'semen',
        'sperm',
        'piece of shit',
        'shitting',
        'shite',
        'shit',
        'rectum',
        'butthole',
        'butt ', // butter...
        'fatass',
        'lardass',
        'your ass',
        'asshole',
        'ass hole',
        'ass-hole',
        'arsehole',
        'anal ', // analyze...
        'pissing',
        'pisser',
        'piss',
        'clitoris',
        'clit',
        'vulva',
        'vagina',
        'pussy',
        'pu$$y',
        'pussies',
        'penis',
        'dick',
        'cock',
        'scrotum',
        'boobs',
        'tits',
        'titties',
        'nipple',
        'whore',
        'prostitute',
        ' hoe', // shoes...
        'stripper',
        'bitch',
        'biitch',
        'biatch',
        'bish ', // bishop...
        'bich',
        'slut',
        'bastard',
        'cunt',
        'twat',
        'suck',
        'pornography',
        'pornos',
        'porn',
        'por.n',
        'p0rn',
        'pron',
        'had sex',
        'sex with',
        'sex ', // "sexy" is allowed
        'blowjob',
        'fisting',
        'gangbang',
        'masturbating',
        'masturbate',
        'deep throat',
        'bdsm',
        'dildo',
        'pedo',
        'retarded',
        'retard',
        'wanker',
        'faggot',
        'dumbo',
        'loser',
        'moron',
        'idiota', // Spanish
        'idiot',
        'dimwit',
        'stupid',
        'dumb ass',
        'dumb-ass',
        'dumbass',
        'massacre',
        'nazi',
        'adolf',
        'hitler',
        'get cancer',
        'get aids',
        'autistic',
        'degenerated',
        'punch you',
        'slap you',
        'kick you',
        'nigger',
        'nigg3r',
        'n1gger',
        'nigga',
        'niga',
        'viagra',
        'weed',
        'cocaine',
        'puto',
        'hijo de puta',
        'puta',
        'perra',
        'zorra',
        'culo',
        'tonto',
        'pendejo',
        'maricon',
        'mierda',
        'merde',
        'arschloch',
        'arsch',
        'wichser',
        'hurensohn',
        'huso',
        'hure',
        'fick',
        'scheiß',
        'scheiss',
        'nik mok',
        'kurwa',
        'kurva',
        'cyka blyat',
        'suka bljad'
    ],

    watermark: ' ',

      wearables: {
          1: 'Santa Hat (Old)',
2: 'Wizard Hat',
3: 'Wooden Shield',
4: 'Red Partyhat (Big)',
5: 'Red Partyhat',
6: 'Blue Partyhat',
7: 'Green Partyhat',
8: 'Yellow Partyhat',
9: 'Green Eyes',
10: 'Minion Eyes',
11: 'Mustache & Glasses',
12: 'Cartoon Arms & Legs',
13: 'Evil Horns',
14: 'Hairs (Female)',
15: 'Red Hair',
16: 'Spikes',
17: 'Spine Ball',
18: 'Thug Life Glasses',
19: 'Thug Life Smoke',
20: 'Thug Life Cap',
21: 'Axe',
22: 'Sword',
23: 'Witch Hat (Purple)',
24: 'Viking Helmet',
25: 'Feather Hat',
26: 'Officer Hat',
27: 'Yellow Glasses',
28: 'Blue Fedora',
29: 'Red Cap',
30: 'Emperor Crown (Old)',
31: 'Emperor Crown',
32: 'Emperor Sceptre',
33: 'Steampunk',
34: 'Goggles',
35: 'Jester Hat',
36: 'Graduation Hat',
37: 'Angel Halo',
38: 'Angel Wings',
39: 'Pirate Eye Patch',
40: 'Pirate Hat',
41: 'Antlers',
42: 'Ring of Fire',
43: 'Sora\'s Hat',
44: 'Moderator Hat',
45: 'Admin Hat',
46: 'Witch Hat',
47: 'Scythe',
48: 'Bones',
49: 'Black Crown Friday',
50: 'Santa Hat',
51: 'Evil Wings',
52: 'Birthday Candles',
53: 'Barbed Wire',
54: 'Sheriff Star',
55: 'YouTuber Hat',
56: 'Admin Star',
57: 'Face Mask',
58: 'Cute Eyes',
59: 'Cute Eyes (With Tongue, Green)',
60: 'Cute Eyes (With Tongue)',
61: 'Leafy Hat',
62: 'Ears',
63: 'Elf hat',
      },

    // Don't remove the spaces, they are used as separators! Source: https://emojiterra.com/de/liste/
    emojis: '😀 😃 😄 😁 😆 😅 😂 😉 😊 😇 😍 😘 😗 ☺️ 😚 😙 😋 😛 😜 😝 😐 😑 😶 😏 😒 😬 😌 😔 😪 😴 😷 😵 😎 😕 😟 😮 😯 😲 😳 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 😤 😡 😠 😈 👿 💀 💩 👹 👺 👻 👽 👾 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🙈 🙉 🙊 💋 💌 💘 💝 💖 💗 💓 💞 💕 💟 💔 ❤️ 💛 💚 💙 💜 💯 💢 💥 💫 💦 💨 💣 💬 💭 💤 👋 ✋ 👌 ✌️ 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 👏 🙌 👐 🙏 💅 💪 👂 👃 👀 👅 👄 👶 👦 👧 👱 👨 👩 👴 👵 🙍 🙎 🙅 🙆 💁 🙋 🙇 👮 💂 👷 👸 👳 👲 👰 👼 🎅 💆 💇 🚶 🏃 💃 👯 🏇 🏂 🏄 🚣 🏊 🚴 🚵 🛀 👭 👫 👬 💏 💑 👪 👤 👥 👣 🐵 🐒 🐶 🐕 🐩 🐺 🐱 🐈 🐯 🐅 🐆 🐴 🐎 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🐘 🐭 🐁 🐀 🐹 🐰 🐇 🐻 🐨 🐼 🐾 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🐸 🐊 🐢 🐍 🐲 🐉 🐳 🐋 🐬 🐟 🐠 🐡 🐙 🐚 🐌 🐛 🐜 🐝 🐞 💐 🌸 💮 🌹 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 🍀 🍁 🍂 🍃 🍇 🍈 🍉 🍊 🍋 🍌 🍍 🍎 🍏 🍐 🍑 🍒 🍓 🍅 🍆 🌽 🍄 🌰 🍞 🍖 🍗 🍔 🍟 🍕 🍳 🍲 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🍡 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🍫 🍬 🍭 🍮 🍯 🍼 ☕ 🍵 🍶 🍷 🍸 🍹 🍺 🍻 🍴 🔪 🌍 🌎 🌏 🌐 🗾 🌋 🗻 🏠 🏡 🏢 🏣 🏤 🏥 🏦 🏨 🏩 🏪 🏫 🏬 🏭 🏯 🏰 💒 🗼 🗽 ⛪ ⛲ ⛺ 🌁 🌃 🌄 🌅 🌆 🌇 🌉 ♨️ 🎠 🎡 🎢 💈 🎪 🚂 🚃 🚄 🚅 🚆 🚇 🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚜 🚲 🚏 ⛽ 🚨 🚥 🚦 🚧 ⚓ ⛵ 🚤 🚢 ✈️ 💺 🚁 🚟 🚠 🚡 🚀 ⌛ ⏳ ⌚ ⏰ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 ☀️ 🌝 🌞 ⭐ 🌟 🌠 🌌 ☁️ ⛅ 🌀 🌈 🌂 ☔ ⚡ ❄️ ⛄ 🔥 💧 🌊 🎃 🎄 🎆 🎇 ✨ 🎈 🎉 🎊 🎋 🎍 🎎 🎏 🎐 🎑 🎀 🎁 🎫 🏆 ⚽ ⚾ 🏀 🏈 🏉 🎾 🎳 ⛳ 🎣 🎽 🎿 🎯 🎱 🔮 🎮 🎰 🎲 ♠️ ♥️ ♦️ ♣️ 🃏 🀄 🎴 🎭 🎨 👓 👔 👕 👖 👗 👘 👙 👚 👛 👜 👝 🎒 👞 👟 👠 👡 👢 👑 👒 🎩 🎓 💄 💍 💎 🔇 🔈 🔉 🔊 📢 📣 📯 🔔 🔕 🎼 🎵 🎶 🎤 🎧 📻 🎷 🎸 🎹 🎺 🎻 📱 📲 ☎️ 📞 📟 📠 🔋 🔌 💻 💽 💾 💿 📀 🎥 🎬 📺 📷 📹 📼 🔍 🔎 💡 🔦 🏮 📔 📕 📖 📗 📘 📙 📚 📓 📒 📃 📜 📄 📰 📑 🔖 💰 💴 💵 💶 💷 💸 💳 💹 💱 💲 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 ✏️ ✒️ 📝 💼 📁 📂 📅 📆 📇 📈 📉 📊 📋 📌 📍 📎 📏 📐 ✂️ 🔒 🔓 🔏 🔐 🔑 🔨 🔫 🔧 🔩 🔗 🔬 🔭 📡 💉 💊 🚪 🚽 🚿 🛁 🚬 🗿 🏧 🚮 🚰 ♿ 🚹 🚺 🚻 🚼 🚾 🛂 🛃 🛄 🛅 ⚠️ 🚸 ⛔ 🚫 🚳 🚭 🚯 🚱 🚷 📵 🔞 ⬆️ ↗️ ➡️ ↘️ ⬇️ ↙️ ⬅️ ↖️ ↕️ ↔️ 🔃 🔄 🔙 🔚 🔛 🔜 🔝 🔯 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⛎ 🔀 🔁 🔂 ▶️ ◀️ 🔼 🔽 🎦 📶 📳 📴 ♻️ 🔱 📛 🔰 ⭕ ✅ ☑️ ✖️ ❌ ❎ ➕ ➖ ➗ ➰ ➿ 〽️ ✳️ ✴️ ❇️ ‼️ ⁉️ ❓ ❔ ❕ ❗ 〰️ ©️ ®️ ™️ 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 🆔 Ⓜ️ 🆕 🆖 🅾️ 🆗 🅿️ 🆘 🆙 🆚 🈁 🈂️ 🈷️ 🈶 🈯 🉐 🈹 🈚 🈲 🉑 🈸 🈴 🈳 ㊗️ ㊙️ 🈺 🈵 🔴 🔵 ⚫ ⚪ ⬛ ⬜ ◼️ ◻️ ◾ ◽ ▪️ ▫️ 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲 🏁 🚩 🎌',

    settings: null,

    hotkeys: null,

    mass: 0, // Stores the current mass (Note: 0 is a valid value while being alive!! For  example if the mass is 0.4, appaerently it is rounded to 0....)

    topMass: 0,

    mouse : {
        x: 0,
        y: 0,
        lastMovedAt: null,
    },

    init: function() {
      var self = this;

      this.setupPolyfills();

      this.hotkeys = JSON.parse(localStorage.getItem('hotkeys'));

      this.auth();

      this.config();

      this.originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = this.drawImage;

      document.querySelector('body').addEventListener('mousemove', function(event) {
          self.mouse.x = event.clientX;
          self.mouse.y = event.clientY;
          self.mouse.lastMovedAt = Date.now();
      });

      this.moveRespawnBtn();
      this.players();
      this.animation();
      this.chatLog();
      this.halt();
      this.dance();
      this.favSkins();
      this.paste();
      this.replacements();
      this.fpsPing();
      this.timer();
      this.alive();
      this.skinChanger();
      this.skinApplier();
      this.nameCopier();
      this.ultraSplit();
      this.lineSplit();
      this.waste();
      this.guessing();
      this.nameColor();
      this.wearablesToggle();
      this.keyboardLayout();
      this.help();
      this.commands();

      console.log('📜 Miracle Scripts successfully loaded!');
    },

    config: function() {
      var self = this;
      var settings = null;

      var loadSettings = function (stringifiedSettings) {
        var defaultSettings = {
          // To get keycodes: https://keycode.info
          bindings: {
            ultraSplit: 85, // U
            wearables: 36, // POS1
            animation: 17, // CTRL
            paste: 33, // PAGE UP
            dance: 34, // PAGE DOWN,
            halt: 72, // H,
            lineSplit: null, // Undefined
            chatLog: 76, // L
            skin1: 49, // 1
            skin2: 50, // 2
            skin3: 51, // 3
            skin4: 52, // 4
            skin5: 53, // 5
            skin6: 54, // 6
            skin7: 55, // 7
            skin8: 56, // 8
            skin9: 57, // 9
          },
          replacements: ":D|:smile:\n:*(|:sob:\n:'D|:sweat_smile:\nxD|:joy:\n:shrug:|¯\_(ツ)_/¯\n",
          primaryColor: '#f9138b',
          targetLanguage: 'en',
          favSkins: [],
          quickSkins: [],
          players: [],
          showClock: true,
          changeKeyboardLayout: false,
          showNewsFeed: true,
          overwriteHelp: true,
          useNickNameColor: false,
          nickNameColor: '#ffffff',
          useNickNameStrokeColor: false,
          nickNameStrokeColor: '#000000',
          useNickNameStrokeWidth: false,
          nickNameStrokeWidth: 2,
          playerChatFilter: true,
          coinsClaimedAt: null,
        };


        if (stringifiedSettings == null || stringifiedSettings == undefined || stringifiedSettings === '') {
          settings = defaultSettings;
          localStorage.setItem('miracleScripts', JSON.stringify(settings));
        } else {
          settings = JSON.parse(stringifiedSettings);
          if (settings === null || Object.getOwnPropertyNames(settings).length == 0) {
              settings = defaultSettings;
              localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }

          // Update for settings:
          if (typeof settings.primaryColor === 'undefined') {
            settings.primaryColor = defaultSettings.primaryColor;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.bindings.chatLog === 'undefined') {
            settings.bindings.chatLog = defaultSettings.bindings.chatLog;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.favSkins === 'undefined') {
            settings.favSkins = defaultSettings.favSkins;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.targetLanguage === 'undefined') {
            settings.targetLanguage = defaultSettings.targetLanguage;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.quickSkins === 'undefined') {
            settings.quickSkins = [];
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.installedVersion === 'undefined') {
            settings.installedVersion = 1;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.players === 'undefined') {
            settings.players = [];
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.bindings.skin1 === 'undefined') {
            settings.bindings.skin1 = defaultSettings.bindings.skin1;
            settings.bindings.skin2 = defaultSettings.bindings.skin2;
            settings.bindings.skin3 = defaultSettings.bindings.skin3;
            settings.bindings.skin4 = defaultSettings.bindings.skin4;
            settings.bindings.skin5 = defaultSettings.bindings.skin6;
            settings.bindings.skin6 = defaultSettings.bindings.skin6;
            settings.bindings.skin7 = defaultSettings.bindings.skin7;
            settings.bindings.skin8 = defaultSettings.bindings.skin8;
            settings.bindings.skin9 = defaultSettings.bindings.skin9;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.showClock === 'undefined') {
            settings.showClock = false;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.showKeyboardLayout === 'undefined') {
            settings.showKeyboardLayout = false;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.bindings.ultraSplit === 'undefined') {
            settings.bindings.ultraSplit = 85;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.bindings.wearables === 'undefined') {
            settings.bindings.wearables = 36;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.bindings.halt === 'undefined') {
            settings.bindings.halt = defaultSettings.bindings.halt;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.showNewsFeed === 'undefined') {
            settings.showNewsFeed = defaultSettings.showNewsFeed;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.overwriteHelp === 'undefined') {
            settings.overwriteHelp = defaultSettings.overwriteHelp;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.useNickNameStrokeWidth === 'undefined') {
            settings.useNickNameColor = defaultSettings.useNickNameColor;
            settings.nickNameColor = defaultSettings.nickNameColor;
            settings.useNickNameStrokeColor = defaultSettings.useNickNameStrokeColor;
            settings.nickNameStrokeColor = defaultSettings.nickNameStrokeColor;
            settings.useNickNameStrokeWidth = defaultSettings.useNickNameStrokeWidth;
            settings.nickNameStrokeWidth = defaultSettings.nickNameStrokeWidth;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.playerChatFilter === 'undefined') {
            settings.playerChatFilter = defaultSettings.playerChatFilter;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.coinsClaimed !== 'undefined') {
            delete settings.coinsClaimed;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.coinsClaimedAt === 'undefined') {
            settings.coinsClaimedAt = Date.now();
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
          if (typeof settings.bindings.lineSplit === 'undefined') {
            settings.bindings.lineSplit = defaultSettings.bindings.lineSplit;
            localStorage.setItem('miracleScripts', JSON.stringify(settings));
          }
        }

        self.settings = settings;
      };
      loadSettings(localStorage.getItem('miracleScripts'));

      if (settings.installedVersion < this.getVersionAsInt()) {
        if (settings.installedVersion > 1) { // We do not want to inform new scripts user of past updates
          if (settings.installedVersion < this.getVersionAsInt('2.4.3')) {
            window.alert('📢 Miracle Scripts Update: \n\n' +
                'As of version 2.4.3 the nickname color change feature has been removed ' +
                'according to an official decision of the Agma team.\n\n' +
                'To avoid trouble for its users Miracle Scripts respects this decision. ' +
                'Therefore Miracle Scripts is a legit extension for Agma and using it is safe.'
            );
          }
          if (settings.installedVersion < this.getVersionAsInt('2.5.6')) {
            self.swal(
                'Miracle Scripts Update',
                'You may now use 20 slots for skins (previously: 15). Type <i>/skin16</i> - <i>/skin20</i> in the chat box!');
          }
          if (settings.installedVersion < this.getVersionAsInt('2.5.8')) {
            self.swal(
                'Miracle Scripts Update',
                'New: You may now assign aliases and notes to players. The alias will be displayed in the friends list. To add an alias right click on a player\'s name in the chat or a cell and then click on "Show profile".');
          }
          if (settings.installedVersion < this.getVersionAsInt('2.6.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: You may now bind keys to skin slots. Per default the keys 1 - 9 are bound to <i>/skin1</i> - <i>/skin9</i>.');
          }
          if (settings.installedVersion < this.getVersionAsInt('2.6.1')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Right click on a cell. Then click on <i>Use Player\'s Wearables</i> to use the same wearables as that player. (Of course you have to own the wearables.)');
          }
          if (settings.installedVersion < this.getVersionAsInt('2.6.4')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Want to see how late it is? Activate the clock in the settings!');
          }
          if (settings.installedVersion < this.getVersionAsInt('3.0.0')) {
            self.swal(
                'Miracle Scripts Update',
                '<b>ATTENTION!</b> This script won\'t get any new features! The Agma staff keeps making new restrictions to this script, so there is no point to continue development. With this update, the <i>/say</i> command has been removed, as the Agma staff enforced this.');
          }
          if (settings.installedVersion < this.getVersionAsInt('3.1.3')) {
            self.swal(
                'Miracle Scripts Update',
                'Just a friendly hint: Agma has a new powerup! It\'s called "Tactical Nuke" and can be found in the shop. Attention: It\'s the first of April 😜');
          }
          if (settings.installedVersion < this.getVersionAsInt('3.1.6')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Type <span style="font-style: italic">/players</span> in the chat to see how many players are online in Agma!');
          }
          if (settings.installedVersion < this.getVersionAsInt('3.3.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: You may now see your keyboard layout as an overlay! Go to the settings to activate it.');
          }
          if (settings.installedVersion < this.getVersionAsInt('3.4.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: ULTRA split! Press U to make an ultra split, which can split 1 cell to 64!! (The server has to support that!)');
          }
          if (settings.installedVersion < this.getVersionAsInt('3.6.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Toggle "wearables on/off" with a key! Default is POS1!');
          }
          if (settings.installedVersion < this.getVersionAsInt('4.0.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Type /guess to start a little guessing game in the chat!<br><br>💡 Note that it only works with browsers that can display emojis.');
          }
          if (settings.installedVersion < this.getVersionAsInt('4.2.2')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Right click on a player to copy the player\'s name to the chat! (PS: You cannot use the name as your own name though!)');
          }
          if (settings.installedVersion < this.getVersionAsInt('4.3.2')) {
            self.swal(
                'Miracle Scripts Announcement',
                'Prepare for some <b>insane</b> new Miracle features! This time it will be mind-blowing. <br><br>To be released soon.');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.0.2')) {
              window.swal({
                  title: 'Miracle Scripts Update',
                  text: 'Today we released a great new feature<br>to celebrate <i>Miracle\'s 1 year anniversary</i>:<br><b>Free self-freezing</b>! <br><br>' +
                '<iframe width="320" height="180" src="https://www.youtube.com/embed/oWQ9vxdbVcc?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                '<br><br>Press H to use it!',
                  html: true
              });
          }
          if (settings.installedVersion < this.getVersionAsInt('5.0.6')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Anti-AFK! Doubling the countdown time till you get disconnected for being AFK from 5 to 10 minutes!!!');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.1.0')) {
            self.swal(
                'Miracle Scripts Update',
                'Custom chat fonts are back - now with a  cussing filter! Use <b><i>/say1 message</i></b> to send messages in custom font!!');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.1.5')) {
            self.swal(
                'Miracle Scripts Update',
                '<h1 style="color: white;"><br>5.000 Miracles!</h1>Time to celebrate 1+ year of awesomeness, experienced by 5.000+ Agma players! <span style="font-size: 100px">🥳</span><br><br>');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.2.1')) {
            self.swal(
                'Miracle Winter Giveaway!!!',
                '<img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/91_Discord_logo_logos-512.png" width="100px" height="100px"><h3 style="color:white;">Join our Discord server and win one of 5 amazing prices!</h3><br><span><a style="color: white" href="https://discord.gg/rhUbrPTkGE">Participate in the huge winter giveaway (coins, minions, gold and power-ups!) and claim your custom nickname style!</span><br><button href="https://discord.gg/rhUbrPTkGE" style="color: black; background: pink;">Join</button>'
            );
          }
          if (settings.installedVersion < this.getVersionAsInt('5.2.3')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Basic support for custom nickname styles! 🥳<br><br>Go to the Miracle settings and change the look of your nickname.<br><br>Note: Only you can see that for now. More to come...');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.2.6')) {
            self.swal(
                'Miracle Scripts Update',
                'New Miracle setting: You may now turn this news feed on or off. Also you may decide if Agma\'s help should be overwritten by Miracles help.');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.3.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Use the /wearable command to turn on/off your wearables!');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.4.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Use the /mass and /topmass chat commands!');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.5.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: known toxic players get muted automatically.<br><br> You can disable this feature (useful for mods).');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.6.0')) {
            self.swal(
                'Miracle Scripts Update',
                'New: Miracle is reminding you to use the /claim command. Also megaphone messages can be seen in the Miracle chat log.');
          }
          if (settings.installedVersion < this.getVersionAsInt('5.6.6')) {
            self.swal(
                'Miracle Scripts Update',
                'News: 10,000 Miracle installations!!! 🥳🥳🥳');
          }
        }

        settings.installedVersion = this.getVersionAsInt();
        localStorage.setItem('miracleScripts', JSON.stringify(settings));
        self.settings = settings;
      }

      if (settings.showNewsFeed) {
            var defaultNews = 'Agma Updates 22.Mar.2021';
            var $newsElement = $('#cnt_panel .navbar p.text-center');
            if ($newsElement.text().trim() === defaultNews) {
                $newsElement.css('margin-bottom', '20px');
                $newsElement.css('padding', '10px');
                $newsElement.css('background-color', 'rgba(0, 0, 0, 0.5)');
                $newsElement.html(self.news);

                var $metaElement = $('<div title="Powered by Miracle Script">AGMA News</div>');
                $newsElement.parent().prepend($metaElement);
                $metaElement.css('background-color', '#B5B9C0');
                $metaElement.css('color', 'black');
            }
      }

      var applyPrimaryColor = function () {
        var primaryColorCss = '.miracle-primary-color-font { color: ' + self.settings.primaryColor + ' !important } .miracle-primary-color-background { background-color: ' + self.settings.primaryColor + ' !important }; ';
        $('body').append('<style>' + primaryColorCss + '</style>');
      };
      applyPrimaryColor();

        // General fix for the size of the FontAwesome Icons in the context menu
        $('body').append('<style>.context-icon .fa { font-size: 30px }</style>');

      // We need to have a delay, because the menu is not loaded right away
      setTimeout(function () {
        var $playButton = $('#playBtn');
        var $spectateButton = $('#spectateBtn');

        $playButton.get(0).style.width = '40%';
        $spectateButton.get(0).style.width = '40%';

        var $settingsButton = $('<button class="playgame2" style="width: 44px; margin-left: 3px; text-align: center" title="Miracle Scripts Settings">📜</button>');
        $settingsButton.insertAfter($spectateButton);

        var changeKey = function (event) {
          var name = this.name.substr(4);
          $(this).val(self.keyboardMap[event.keyCode]);
          self.settings.bindings[name] = event.keyCode;
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };

        var deleteKey = function () {
          var action = $(this).attr('data-action');
          $('#miracle-settings input[name=key_' + action + ']').val('undefined');
          self.settings.bindings[action] = null;
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };

        // Weird Agma scripting... press enter in the replacements textarea and the chat box gets focused!
        // Therefore catch the keydown event (that happens earlier) and insert the linebreak manually,
        // focus again (delayed) and go to the end of the text where the linebreak is.
        // We can improve this later on...
        var addReturn = function (event) {
          if (event.keyCode === 13) {
            var textarea = this;
            $(textarea).text($(this).text() + '\n').focus();
            setTimeout(function () {
              $(textarea).focus();
              textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            }, 1);
          }
        };
        var changeUseNickNameColor = function() {
          self.settings.useNickNameColor = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeUseNickNameStrokeColor = function() {
          self.settings.useNickNameStrokeColor = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeUseNickNameStrokeWidth = function() {
          self.settings.useNickNameStrokeWidth = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeNickNameColor = function() {
          self.settings.nickNameColor = $(this).val();
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeNickNameStrokeColor = function() {
          self.settings.nickNameStrokeColor = $(this).val();
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeNickNameStrokeWidth = function() {
          self.settings.nickNameStrokeWidth = parseInt($(this).val()) > -1 ? parseInt($(this).val()) : 2;
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeReplacements = function () {
          self.settings.replacements = $(this).val();
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changePrimaryColor = function () {
          self.settings.primaryColor = $(this).val();
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
          applyPrimaryColor();
        };
        var changeTargetLanguage = function () {
          self.settings.targetLanguage = $(this).val();
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changePlayerChatFilter = function() {
          self.settings.playerChatFilter = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeOverwriteHelp = function() {
          self.settings.overwriteHelp = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeNewsFeed = function() {
          self.settings.showNewsFeed = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeClock = function() {
          self.settings.showClock = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };
        var changeKeyboardLayout = function() {
          self.settings.showKeyboardLayout = $(this).is(':checked');
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
        };

        var $modal = $('<div id="miracle-settings" class="miracle-primary-color-font" style="position: fixed; width: 100%; height: 100%; overflow-y: auto; padding: 50px; background-color: rgba(0,0,0,0.95); z-index: 999; display: none"></div>');
        $modal.append('<h1>Miracle Scripts Settings</h1>');

        if (GM_info) {
          $modal.append('<small style="color: #717171">Version ' + GM_info.script.version + '</small>');
        }

          var $firstRow = $('<td style="vertical-align: top; padding-right: 19px;">');
          var $secRow = $('<td style="vertical-align: top; padding-right: 19px;">');
          var $thirdRow = $('<td style="vertical-align: top; padding-right: 19px;">');


        var $element = $('<input name="key_ultraSplit" value="' + self.keyboardMap[self.settings.bindings.ultraSplit] + '"/>').keyup(changeKey);
        $firstRow.append('<br><br>Ultra-Split-Key:<br>', $element);
        $element = $('<a href="#" data-action="ultraSplit" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $firstRow.append($element);

        $element = $('<input name="key_animation" value="' + self.keyboardMap[self.settings.bindings.animation] + '"/>').keyup(changeKey);
        $firstRow.append('<br><br>Animation-Key:<br>', $element);
        $element = $('<a href="#" data-action="animation" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $firstRow.append($element);

        $element = $('<input name="key_paste" value="' + self.keyboardMap[self.settings.bindings.paste] + '"/>').keyup(changeKey);
        $firstRow.append('<br><br>Paste-Key:<br>', $element);
        $element = $('<a href="#" data-action="paste" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $firstRow.append($element);

        $element = $('<input name="key_dance" value="' + self.keyboardMap[self.settings.bindings.dance] + '"/>').keyup(changeKey);
        $firstRow.append('<br><br>Dance-Key:<br>', $element);
        $element = $('<a href="#" data-action="dance" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $firstRow.append($element);

        $element = $('<input name="key_halt" value="' + self.keyboardMap[self.settings.bindings.halt] + '"/>').keyup(changeKey);
        $firstRow.append('<br><br>Halt-Key:<br>', $element);
        $element = $('<a href="#" data-action="halt" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $firstRow.append($element);

        $element = $('<input name="key_chatLog" value="' + self.keyboardMap[self.settings.bindings.chatLog] + '"/>').keyup(changeKey);
        $firstRow.append('<br><br>Chat-Log-Key:<br>', $element);
        $element = $('<a href="#" data-action="chatLog" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $firstRow.append($element);


        $element = $('<input name="key_skin1" value="' + self.keyboardMap[self.settings.bindings.skin1] + '"/>').keyup(changeKey);
        $secRow.append('<br><br>Use-First-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin1" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $secRow.append($element);

        $element = $('<input name="key_skin2" value="' + self.keyboardMap[self.settings.bindings.skin2] + '"/>').keyup(changeKey);
        $secRow.append('<br><br>Use-Second-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin2" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $secRow.append($element);

        $element = $('<input name="key_skin3" value="' + self.keyboardMap[self.settings.bindings.skin3] + '"/>').keyup(changeKey);
        $secRow.append('<br><br>Use-Third-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin3" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $secRow.append($element);

        $element = $('<input name="key_skin4" value="' + self.keyboardMap[self.settings.bindings.skin4] + '"/>').keyup(changeKey);
        $secRow.append('<br><br>Use-Fourth-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin4" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $secRow.append($element);

        $element = $('<input name="key_skin5" value="' + self.keyboardMap[self.settings.bindings.skin5] + '"/>').keyup(changeKey);
        $secRow.append('<br><br>Use-Fifth-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin5" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $secRow.append($element);

        $element = $('<input name="key_lineSplit" value="' + self.keyboardMap[self.settings.bindings.lineSplit] + '"/>').keyup(changeKey);
        $secRow.append('<br><br>Line-Split-Key:<br>', $element);
        $element = $('<a href="#" data-action="lineSplit" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $secRow.append($element);


        $element = $('<input name="key_skin6" value="' + self.keyboardMap[self.settings.bindings.skin6] + '"/>').keyup(changeKey);
        $thirdRow.append('<br><br>Use-Sixth-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin6" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $thirdRow.append($element);

        $element = $('<input name="key_skin7" value="' + self.keyboardMap[self.settings.bindings.skin7] + '"/>').keyup(changeKey);
        $thirdRow.append('<br><br>Use-Seventh-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin7" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $thirdRow.append($element);

        $element = $('<input name="key_skin8" value="' + self.keyboardMap[self.settings.bindings.skin8] + '"/>').keyup(changeKey);
        $thirdRow.append('<br><br>Use-Eighth-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin8" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $thirdRow.append($element);

        $element = $('<input name="key_skin9" value="' + self.keyboardMap[self.settings.bindings.skin9] + '"/>').keyup(changeKey);
        $thirdRow.append('<br><br>Use-Ninth-Skin-Key:<br>', $element);
        $element = $('<a href="#" data-action="skin9" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $thirdRow.append($element);

        $element = $('<input name="key_wearables" value="' + self.keyboardMap[self.settings.bindings.wearables] + '"/>').keyup(changeKey);
        $thirdRow.append('<br><br>Toggle-Wearables-Key:<br>', $element);
        $element = $('<a href="#" data-action="wearables" class="miracle-primary-color-background" style="display: inline-block; padding: 3px 10px; color: white">✕</a>').click(deleteKey);
        $thirdRow.append($element);



        var $table = $('<table>').append($('<tbody>').append($('<tr>').append($firstRow).append($secRow).append($thirdRow)));
          $modal.append($table);



        $firstRow = $('<td style="vertical-align: top; padding-right: 19px;">');
        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.useNickNameColor ? 'checked' : '') + '/>').change(changeUseNickNameColor);
        $firstRow.append($element, ' Nickname Color:<br>');
        $element = $('<input type="color" value="' + self.settings.nickNameColor + '"/>').change(changeNickNameColor);
        $firstRow.append($element);

        $secRow = $('<td style="vertical-align: top; padding-right: 19px;">');
        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.useNickNameStrokeColor ? 'checked' : '') + '/>').change(changeUseNickNameStrokeColor);
        $secRow.append($element, ' Nickname Stroke Color:<br>');
        $element = $('<input type="color" value="' + self.settings.nickNameStrokeColor + '"/>').change(changeNickNameStrokeColor);
        $secRow.append($element);

        $thirdRow = $('<td style="vertical-align: top; padding-right: 19px;">');
        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.useNickNameStrokeWidth ? 'checked' : '') + '/>').change(changeUseNickNameStrokeWidth);
        $thirdRow.append($element, ' Nickname Stroke Width:<br>');
        $element = $('<input type="number" value="' + self.settings.nickNameStrokeWidth + '" min="0" max="8" />').change(changeNickNameStrokeWidth);
        $thirdRow.append($element);

        $table = $('<table style="margin-top: 20px">').append($('<tbody>').append($('<tr>').append($firstRow).append($secRow).append($thirdRow)));
        $modal.append($table);


        $element = $('<select name="target_language"><option value="en">English</option><option value="de">German</option><option value="fr">French</option><option value="es">Spanish</option><option value="it">Italian</option><option value="nl">Dutch</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ru">Russian</option><option value="ja">Japanese</option><option value="zh">Chinese</option></select>').change(changeTargetLanguage);
        $modal.append('<br><br>Translate Chat Messages to:<br>', $element);
        $element.get(0).value = self.settings.targetLanguage;

        $element = $('<input type="color" name="favcolor" value="' + self.settings.primaryColor + '"/>').change(changePrimaryColor);
        $modal.append('<br><br>User Interface Color:<br>', $element);

        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.playerChatFilter ? 'checked' : '') + '/>').change(changePlayerChatFilter);
        $modal.append('<br><br>Automatically hide messages of toxic players:<br>', $element);

        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.overwriteHelp ? 'checked' : '') + '/>').change(changeOverwriteHelp);
        $modal.append('<br><br>Overwrite Agma Help <span style="color: #717171">(reload website to update)</span>:<br>', $element);

        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.showNewsFeed ? 'checked' : '') + '/>').change(changeNewsFeed);
        $modal.append('<br><br>Show News Feed <span style="color: #717171">(reload website to update)</span>:<br>', $element);

        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.showClock ? 'checked' : '') + '/>').change(changeClock);
        $modal.append('<br><br>Show Clock:<br>', $element);

        $element = $('<input type="checkbox" name="checkBox" value="1" ' + (self.settings.showKeyboardLayout ? 'checked' : '') + '/>').change(changeKeyboardLayout);
        $modal.append('<br><br>Show Keyboard Layout <span style="color: #717171">(reload website to update)</span>:<br>', $element);

        $element = $('<textarea rows="6" style="width: 100%; max-width: 500px" placeholder="search|replace">').text(self.settings.replacements).keydown(addReturn).keyup(changeReplacements);
        $modal.append('<br><br>Chat-Replacements (1 per line):<br>', $element, '<br>💡 <span style="color: #717171">Avoid using the search text in the replacement!</span>');

        $modal.append($('<br><a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-top: 20px; padding: 10px; color: white">Close</a>').click(function () {
          $modal.hide();
        }));
        $modal.append($('<a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-left: 20px; margin-top: 20px; padding: 10px; color: white">Export Settings</a>').click(function () {
          self.download('miracle_settings.txt', localStorage.getItem('miracleScripts'));
        }));
        $modal.append($('<a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-left: 20px; margin-top: 20px; padding: 10px; color: white">Import Settings</a>').click(function () {
          var stringifiedSettings = window.prompt('Paste the settings here');
          if (stringifiedSettings !== null) {
            loadSettings(stringifiedSettings);
            localStorage.setItem('miracleScripts', stringifiedSettings);
            $modal.hide();
            self.message('Settings loaded! Reload Agma to refresh. 😄');
          }
        }));
        //$modal.append($('<a href="http://agarioforums.net/showthread.php?tid=61388" target="_blank" class="miracle-primary-color-background" style="display: inline-block; margin-left: 20px; margin-top: 20px; padding: 10px; color: white">Support</a>'));
        $modal.append($('<a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-left: 20px; margin-top: 20px; padding: 10px; color: white">Help</a>').click(function () {
          $modal.hide();
          self.$helpModal.show();
        }));

        $('body').append($modal);

        $settingsButton.click(function (event) {
          $modal.show();

          event.preventDefault();
        });


          // Anti AFK & claim coins
          window.setInterval(function() {
              if (self.mouse.lastMovedAt !== null && Date.now() - self.mouse.lastMovedAt >= 230000 && Date.now() - self.mouse.lastMovedAt <= 230000 + 60000) {
                  self.mouse.x++;
                  $('#canvas').trigger($.Event('mousemove', {clientX: self.mouse.x, clientY: self.mouse.y, synthetic: true}));
                  console.log('🚫 Miracle ANTI-AFK activated.');
              }

              if (self.settings.coinsClaimedAt) {
                  // It is not really 24 hours but less, I think. Might also be: 10 hours but at least a day change...??
                  let reminderTime = 16 * 60 * 60 * 1000;
                  if (self.getAccountName() && Date.now() - self.settings.coinsClaimedAt > reminderTime) {
                      self.message('🎁🎁🎁 It\'s time to claim your daily coins with /claim!', false, 30);
                      if ($('#chtbox').val() === '') {
                          $('#chtbox').val('/claim');
                      }
                      self.settings.coinsClaimedAt = Date.now() - reminderTime + 15 * 60 * 1000; // Remember again in 15 minutes
                      localStorage.setItem('miracleScripts', JSON.stringify(self.settings)); // Save so if the website is loaded wont bother the player again immediately
                      console.log('#1 coins claimed at: ' + self.settings.coinsClaimedAt);
                  }
              } else {
                  self.settings.coinsClaimedAt = Date.now();
                  console.log('#2 coins claimed at: ' + self.settings.coinsClaimedAt);
                  localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
              }
              
          }, 60000);

        window.addEventListener('miracleCommand', function(commandEvent) {
          if (commandEvent.command === '/miraclesettings' || commandEvent.command === '/miracleconfig') {
            $modal.show();
            $('#chtbox').val('');
          }
        });
      }, 500);
    },

    /**
     * This overwrites the original drawImage function. This allows us to get all the drawImage() calls,
     * with coordinates of the images, so we can get the position of things on the map, for instance of cells.
     */
    drawImage: function (image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
      var self = window.miracleScripts;
      var unifiedSkinUrl = image.src ? image.src.replace('_lo.', '.') : '';
        var pos = unifiedSkinUrl.indexOf('?');
        if (pos > -1) {
            unifiedSkinUrl = unifiedSkinUrl.substring(0, pos);
        }

        // 'https://agma.io/skins/5642.png'
        if (unifiedSkinUrl === 'https://agma.io/skins/4889.png') {
            if (self.skinReplacementImg === undefined) {
              self.skinReplacementImg = document.createElement('img');
              self.skinReplacementImg.src = 'https://i.imgur.com/xOC7bqC.png';
            } else {
                arguments[0] = self.skinReplacementImg;
            }
        }

        /*
        if (image.src === 'https://agma.io/wearables/8_lo.png?v=6') {
            if (self.wearableReplacementImgLow === undefined) {
              self.wearableReplacementImgLow = document.createElement('img');
              self.wearableReplacementImgLow.src = 'https://agma.io/wearables/5_lo.png?v=6';
            } else {
                arguments[0] = self.wearableReplacementImgLow;
            }
        }
        if (image.src === 'https://agma.io/wearables/8.png?v=6') {
            if (self.wearableReplacementImg === undefined) {
              self.wearableReplacementImg = document.createElement('img');
              self.wearableReplacementImg.src = 'https://agma.io/wearables/5.png?v=6';
            } else {
                arguments[0] = self.wearableReplacementImg;
            }
        }
        */

        return self.originalDrawImage.apply(this, arguments);
    },

    moveRespawnBtn: function() {
      $('#advBox > div:last-child').css('position', 'absolute');
      $('#advBox > div:last-child').css('left', '48%');
      $('#advBox > div:last-child').css('marginTop', '5px');
      $('#advBox > div:nth-child(2)').css('marginLeft', '10%');
    },

    players: function() {
      var self = this;

      $('body').append('<style>#friendList .name { text-decoration: underline; cursor: pointer; }</style>');

      $('#phpFriendlist').click(function(event) {
        if (event.target.classList.contains('name')) { // TODO check: what happens if player is online?
          insertPMText($(event.target).text());
        }
      });

      $('#btnFriends').click(function() {
        var updater = function() {
          if ($('#friendDialogMessage').length > 0) {
            window.setTimeout(updater, 200);
            return;
          }

          $('#phpFriendlist span.name, #requestList span.name').each(function() {
            var $nameElement = $(this);
            var name = $nameElement.text();
            self.settings.players.forEach(function(player) {
              if (player.name === name && player.alias) {
                $nameElement.attr('title', 'Accountname: ' + name);
                $nameElement.css('fontStyle', 'italic');
                $nameElement.text(player.alias);
              }
            });
          });
        };
        window.setTimeout(updater, 200);
      });

      $('#contextUserProfile').click(function() {
        $('#miracle-player-settings').remove();

        window.setTimeout(function() {
          if ($('.sweet-alert .sa-error').css('display') === 'block') {
            return; // No (public) profile available
          }

          var player = null;
          var accountName = $('.sweet-alert h2 span:first()').text();

          self.settings.players.some(function(candidate) {
            if (candidate.name === accountName) {
              player = candidate;
              return true;
            }
          });

          var $editArea = $('<div id="miracle-player-settings">');
          var $aliasField = $('<input type="text" maxlength="30" placeholder="Alias" title="Alias" style="display: block; color: #333">').blur(function() {
            var alias = $(this).val();
            if (player) {
              player.alias = alias;
            } else {
              player = {name: accountName, alias: alias};
              self.settings.players.push(player);
            }
            localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
          });
          if (player) {
            $aliasField.val(player.alias);
          }
          $editArea.append($aliasField);
          var $noteField = $('<textarea maxlength="250" placeholder="Notes" title="Notes" rows="4" style="width: 100%; padding: 10px; color: #333"></textarea>').blur(function() {
            var note = $(this).val();
            if (player) {
              player.note = note;
            } else {
              player = {name: accountName, note: note};
              self.settings.players.push(player);
            }
            localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
          });
          if (player) {
            $noteField.val(player.note);
          }
          $editArea.append($noteField);

          $editArea.insertBefore('.sweet-alert .sa-button-container');

          if ($('.sweet-overlay').attr('data-listening') != 1) {
            $('.sweet-overlay').attr('data-listening', 1);

            $('.sweet-overlay').click(function() {
              $('#miracle-player-settings').remove();
            });
            $('.sweet-alert .sa-button-container button').click(function() {
              $('#miracle-player-settings').remove();
            });
          }
        }, 300);
      });
    },

    auth: function() {
        var self = this;

          var value = localStorage.getItem('330145eb94127d7d99dd28af3ee8599d');

          if (value) {
              throw 'Exception: Authentication failed. Code: 1000001';
          }

        var check = function () {
           var accountName = self.getAccountName();
            if (self.banned.indexOf(accountName) > -1) {
                console.log('Exception: Authentication failed. Code: 1000001');
                localStorage.setItem('330145eb94127d7d99dd28af3ee8599d', '90f62eda082944015b3c794c65b7c0f0');
                window.location.reload();
                return;
            };
        }

        setInterval(check, 10000);
      },

    animation: function () {
      var self = this;

      var chatAnimate = function () {
        if ($('#chtbox').val().substr(0, 4) === '/pm ') {
          $('#chtbox').val('');
        }

        // All available commands and combinations
        var items = ['wacky',
          'spin', 'spinspin', 'spinspinspin', 'wackyspin', 'wackyspinspin', 'heartsspin', 'heartsspinspin', 'wavespinspin', 'wavespin',
          'flip', 'flipflip', 'flipflipflip', 'wackyflip', 'wackyflipflip', 'heartsflip', 'heartsflipflip', 'waveflipflip', 'waveflip',
          'shake', 'shakeshake', 'shakeshakeshake', 'wackyshake', 'wackyshakeshake', 'heartsshake', 'heartsshakeshake', 'waveshakeshake', 'waveshake',
          'jump', 'jumpjump', 'jumpjumpjump', 'wackyjump', 'wackyjumpjump', 'heartsjump', 'heartsjumpjump', 'wavejumpjump', 'wavejump',
        ];

        // Super-combinations!!
        if (self.getRandomInt(1, 3) === 1) {
          items = ['jumpspinflip', 'jumpflipshake', 'jumpspinshake', 'spinshakeflip'];
        }

        // Choose randomly an item of the items array
        // Source: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
        var item = items[Math.floor(Math.random() * items.length)];

        // Attempt to avoid triggering spam protection - probably useless :-/
        item += String.fromCharCode(8203).repeat(self.getRandomInt(1, 5));

        // Add text into the chat box and focus it (Note: actually "/" is no longer necessary)
        $('#chtbox').val($('#chtbox').val() + item).focus();

        // Stop the event so that the pressed key won't be written into the chat box!
        event.preventDefault();
      };

      window.addEventListener('keydown', function (event) {
        // Do nothing if a menu is open
        if (document.getElementById('overlays').style.display !== 'none' || document.getElementById('advert').style.display !== 'none') {
          return;
        }

        if (event.keyCode == self.settings.bindings.animation) {
          chatAnimate();
        }
      });
    },

    paste: function () {
      var self = this;
      var emojiFontSize = (window.innerWidth * window.innerHeight > 2000000) ? 24 : 18;
      var css = '#miracle-emojis .miracle-emoji { display: inline-block; width: 40px; margin: 0 2px 2px 0; padding: 5px; border: 1px solid #333; font-size: ' + emojiFontSize + 'px; }\n' +
          '#miracle-emojis .miracle-emoji:hover { background-color: #FF69B4 }';

      var emojis = this.emojis.split(' ');
      var emojiCode = '';

      emojis.forEach(function (emoji) {
        emojiCode += '<a href="#" class="miracle-emoji">' + emoji + '</a>';
      });

      var addEmoji = function () {
        setTimeout(function () {
          var $pasteInput = $(document).find('#miracle-emojis input[name=paste]');

          // Add text into the chatbox and focus it
          $('#chtbox').val($('#chtbox').val() + $pasteInput.val()).focus();
        }, 200);

        $modal.hide();
      };

      var $modal = $('<div id="miracle-emojis" class="miracle-primary-color-font" style="position: fixed; width: 100%; height: 100%; padding: 50px; color: #FF69B4; background-color: rgba(0,0,0,0.95); overflow-y: auto; z-index: 999; display: none"></div>');
      $modal.append('<style>' + css + '</style>');
      $modal.append('<h1>Insert text or emoji</h1>');
      var $pasteInput = $('<input name="paste" value="" placeholder="Click to paste text, or (double)click emoji!" style="width: 300px; max-width: 100%" />');
      $modal.append('<br><br>Insert:<br>', $pasteInput);
      $modal.html($modal.html() + '<br><br>' + emojiCode);
      $modal.append($('<br><a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-top: 20px; padding: 10px; color: white">Add</a>').click(addEmoji));
      $modal.append($('<a href="#" class="miracle-primary-color-background" style="display: inline-block; float: right; margin-top: 20px; padding: 10px; color: white">Cancel</a>').click(function () {
        $modal.hide();
      }));

      $modal.find('input[name=paste]').click(function () {
        var text = window.prompt('Please paste your text here!');

        if (text !== null) {
          var $pasteInput = $modal.find('input[name=paste]');

          // Add text into the paste input
          $pasteInput.val($pasteInput.val() + text);
        }
      });

      $modal.click(function (event) {
        if (event.target.classList.contains('miracle-emoji')) {
          var $target = $(this).find('input[name=paste]');
          $target.val($target.val() + $(event.target).text());

          event.preventDefault();
        }
      });

      $modal.dblclick(function (event) {
        if (event.target.classList.contains('miracle-emoji')) {
          $('#chtbox').val($('#chtbox').val() + $(event.target).text()).focus();
          $(this).hide();

          event.preventDefault();
        }
      });

      $('body').append($modal);

      window.addEventListener('keydown', function (event) {
        // Do nothing if a menu is open
        if (document.getElementById('overlays').style.display !== 'none' || document.getElementById('advert').style.display !== 'none') {
          return;
        }

        if (event.keyCode == self.settings.bindings.paste) {
          $modal.find('input[name=paste]').val('');
          $modal.toggle();
        }
      });

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/paste') {
          $modal.find('input[name=paste]').val('');
          $modal.toggle();
          $('#chtbox').val('');
        }
      });
    },

    replacements: function () {
      var self = this;

      $('#chtbox').keyup(function () {
        var lines = self.settings.replacements.split('\n');

        var text = $('#chtbox').val();

        lines.forEach(function (line) {
          var replacement = line.split('|');
          if (replacement.length === 2) {
            text = text.replace(replacement[0], replacement[1]);
            $('#chtbox').val(text).focus();
          }
        });
      });
    },

    chatLog: function () {
      var self = this;

      // We escape the message before we print them, so no one can inject JS code!
      var htmlEntities = function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };


      var originalFillText = CanvasRenderingContext2D.prototype.fillText;
      var lastChatNickname = null;
      var lastChatNicknameColor = null;
      var chatLogCode = '';
      var chatLog = [];
      CanvasRenderingContext2D.prototype.fillText = function () {
         var text = arguments[0];

         if (this.canvas.id === '') {
            let match = text.toString().match(/^Mass: (\d+)$/);
            if (match !== null){
                self.mass = parseInt(match[1]);
                if (self.mass > self.topMass) {
                    self.topMass = self.mass;
                }
            }
        }

          // Canvas height is smaller when the screen is smaller than usual
        if (this.canvas.id !== 'leaderboard' && this.canvas.height > 13 && this.canvas.height <= 25 && typeof text !== 'number') {
          var xPos = arguments[1]; // Usually 3 for nicknames but bigger when a crown, donator icon etc. are displayed
          var lineSize = this.canvas.width; // ATTENTION: Not sure if that really is the total size (icons + nickname + message)

          // Sometimes also numbers (int) are printed (probably masses on cells) so we filter for strings
          if (typeof text === 'string' && (this.fillStyle !== '#f5f6ce' && this.fillStyle !== '#444444')) {
            // Dirty fix for the missing icon in the initial welcome messages
            if (text == '') {
              text = '📢';
            }
            lastChatNickname = text;
            lastChatNicknameColor = this.fillStyle;
          }
          if (typeof text === 'string' && (this.fillStyle === '#f5f6ce' || this.fillStyle === '#444444')) {
              if (self.settings.playerChatFilter && lastChatNickname && lastChatNickname.indexOf('Angelica') !== -1) {
                  let args = arguments;
                  arguments[0] = '*****************************************************************************************************************';
                      return originalFillText.apply(this, args);
                  }
              if (lastChatNickname === 'Yassine') {
                  this.fillStyle = '#00ffee';
              }
              if (lastChatNickname === 'Rinessa') {
                  this.fillStyle = '#14ff00';
              }



            // Unfortunately chat messages will be printed more than just once and I don't know
            // how to identify them, so for now all messages will be stored and only new messages will be shown.
            // Of course this means messages won't be shown if they are sent more than once (by the same nickname).
            var found = false;
            for (var i = 0; i < chatLog.length; i++) {
              if (chatLog[i].nickname === lastChatNickname && chatLog[i].nicknameColor === lastChatNicknameColor && chatLog[i].message === text) {
                found = true;
                break;
              }
            }

            if (!found) {
                var legit = text.indexOf(self.watermark) > -1 ? 'class="legit" title="🛡️ This seems to be a legit Miracle Scripts message"' : '';
              // NOTE: We might have to look for the coordinates of the text to find out the order of the messages (somehow)
              chatLogCode += '<div ' + legit + '><span class="time">' + (new Date().toLocaleTimeString()) + '</span> <span class="nickname" style="color: ' + lastChatNicknameColor + '">' + htmlEntities(lastChatNickname) + '</span>';
              chatLogCode += '<span class="message" style="color: #f5f6ce">' + htmlEntities(text) + '</span></div>';
              chatLog.push({nickname: lastChatNickname, nicknameColor: lastChatNicknameColor, message: text});

              var messageEvent = new Event('miracleChatMessage');
              messageEvent.nickname = lastChatNickname;
              messageEvent.nicknameColor = lastChatNicknameColor;
              messageEvent.message = text;
              window.dispatchEvent(messageEvent);
            }
          }
        }

        return originalFillText.apply(this, arguments);
      };

      var performSearch = function (searchElement) {
        var subject = searchElement.value.toLowerCase();

        $('#miracle-complete-chatlog div').each(function () {
          var $entry = $(this);

          if ($entry.text().toLowerCase().indexOf(subject) === -1 && subject != '') {
            $entry.hide();
          } else {
            $entry.show();
          }
        });
      };

      var $modal = $('<div id="miracle-chatlog" class="miracle-primary-color-font" style="position: fixed; width: 100%; height: 100%; padding: 50px; color: #FF69B4; background-color: rgba(0,0,0,0.95); user-select: text; overflow-y: auto; z-index: 999; display: none"></div>');
      $modal.append('<style>#miracle-complete-chatlog div:hover { background-color: rgba(255,255,255,0.1) } #miracle-complete-chatlog .time { padding-right: 10px; color: #666; } #miracle-complete-chatlog div.legit { font-style: italic } #miracle-complete-chatlog div.megaphone { border: 1px solid #999; background-color: #333;}</style>');
      $modal.append('<h1>Complete Chat Log</h1><br>');
      $modal.append('<div id="miracle-complete-chatlog"></div>');
      $modal.append($('<input type="text" style="display: inline-block; position: fixed; right: 20px; bottom: 20px;" placeholder="Type to search">').keyup(function () {
        performSearch(this);
      }));
      $modal.append($('<br><a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-top: 20px; padding: 10px; color: white">Close</a>').click(function () {
        $modal.hide();
      }));
      $('body').append($modal);

      $('#miracle-complete-chatlog').dblclick(function (event) {
        var $clickTarget;

        // Each chat message is a div with spans in it. Either the spans or the div might be clicked.
        if (event.target.tagName.toLowerCase() === 'span') {
          $clickTarget = $(event.target).parent();
        } else {
          $clickTarget = $(event.target);
        }

        var message = $clickTarget.find('.message').text();

        // Messages usually start with ': ' but we do not want to "translate" it, so we remove it
        if (message.substr(0, 2) === ': ') {
          message = message.substr(2);
        }

        window.open('https://www.deepl.com/translator#auto/' + self.settings.targetLanguage + '/' + message);
      });

        const originalText = jQuery.prototype.text;
        jQuery.prototype.text = function (text) {
            if (this.get(0) && this.get(0).id === 'megaphone_text') {
                chatLogCode += '<div class="megaphone legit" title="🛡️ This is a legit megaphone message"><span class="time">' + (new Date().toLocaleTimeString()) + '</span> 📢 Megaphone by ' + htmlEntities($('#megaphone_name').text()) + ': <span class="message" style="color: #f5f6ce">' + htmlEntities(text) + '</span></div>';
            }
            return originalText.apply(this, arguments);
        }


      var showChatlog = function() {
        $('#miracle-complete-chatlog').html(chatLogCode);
        $modal.toggle();
        $modal.get(0).scrollTo(0, $modal.get(0).scrollHeight);
      };

      window.addEventListener('keyup', function (event) {
        // Ignore text input field so typing in them is possible
        if (self.isWritingText()) {
          return;
        }

        if (event.keyCode == self.settings.bindings.chatLog) {
          showChatlog();
        }
      });

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/chatlog') {
          showChatlog();
          $('#chtbox').val('');
        }
      });
    },

    favSkins: function () {
      var self = this;

      // We need to have a delay, because the menu is not loaded right away
      setTimeout(function () {
        var favIconClick = function () {
          var id = parseInt($(this).parent().parent().find('button').attr('onclick').substr(11));

          if (self.settings.favSkins.includes(id)) {
            $(this).addClass('skin-not-fav');
            $('#skinUseBtn' + id).parent().find('span').addClass('skin-not-fav');
            var index = self.settings.favSkins.indexOf(id);
            self.settings.favSkins.splice(index, 1);
          } else {
            $(this).removeClass('skin-not-fav');
            self.settings.favSkins.push(id);
          }
          localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
          renderFavSkins();
        };

        var renderFavSkins = function () {
          var $skins = null;

          if ($('#fav-skins').length > 0) {
            $skins = $('#fav-skins');
            $skins.html('');
          } else {
            $skins = $('<div id="fav-skins" style="background-color: #4d4950"></div>');
            $skins.insertAfter('#publicSkinsHeader');

            $('#fav-skins').click(function (event) {
              if (event.target.tagName.toLowerCase() === 'span') {
                favIconClick.apply(event.target);
              }
            });
          }
          self.settings.favSkins.forEach(function (id) {
            $skins.append('<div style="float: left; padding: 5px;"><img style="border: 1px solid rgba(0,0,0,.25); border-radius: 50%; box-shadow: 0 0 2px #000;" src="skins/' + id + '_lo.png?u=1575650762" alt=""><h4><span style="cursor: pointer">⭐</span></h4><button class="btn btn-primary skinuse-btn" onclick="toggleSkin(' + id + ');">Use</button></div>');
          });
          $skins.append('<div style="clear: both"></div>');
        };

        var addFavIcons = function () {
          var $skins = $('#publicSkinsPage');
          $skins.append('<style>.skin-not-fav { opacity: 0.3 }</style>');

          $skins.find('h4').each(function () {
            var $favIcon = $('<span style="cursor: pointer">⭐</span>');
            var id = parseInt($(this).parent().find('button').attr('onclick').substr(11));

            $favIcon.click(favIconClick);

            $(this).append($favIcon);

            if (! self.settings.favSkins.includes(id)) {
              $favIcon.addClass('skin-not-fav');
            }
          });
        };
        var initialized = false;
        $('#skinsCustomTab, #skinExampleMenu').click(function () {
          if (!initialized) {
            var checkState = function () {
              if ($('#publicSkinsPage').html() !== '') {
                addFavIcons();
                renderFavSkins();
              } else {
                setTimeout(checkState, 30);
              }
            };
            checkState();
            initialized = true;
          }
        });
        $('#phpSkins').click(function (event) {
          if (event.target.classList.contains('publicskins-nav-btn')) {
            addFavIcons();
          }
        });

      }, 500);
    },

    skinChanger: function() {
      var self = this;

      // When the user changes the skin, display ID of the picked skin
      var originalToggleSkin = window.toggleSkin;
      window.toggleSkin = function () {
        self.message('Picked skin with ID ' + arguments[0]);

        return originalToggleSkin.apply(this, arguments);
      };

        var useSkinFromSlot = function (skinSlot, skinId) {
          var skinUri = null;

          if (skinId) {
            if (skinId === 'this' || skinId === 'current' || skinId === 'my' || skinId === 'me' || skinId === 'now' || skinId === 'here') {
              skinUri = self.getSkinUrl();
              skinId = parseInt(skinUri.substr(skinUri.indexOf('skins/') + 6));

              self.message('Skin ' + skinId + ' saved in slot ' + skinSlot + ' ✔️');
            }

            skinId = parseInt(skinId);
            self.settings.quickSkins[skinSlot - 1] = skinId;
            localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
          } else {
            skinId = self.settings.quickSkins[skinSlot - 1];
            if (!skinId) {
              self.message('Skin not set yet, set with /skin' + skinSlot + ' id 😊', true);
              $('#chtbox').val('');
              return;
            }
          }

          if (skinUri === null) {
              self.useSkin(skinId);
          }

          $('#chtbox').val('');
        };

      window.addEventListener('miracleCommand', function(commandEvent) {

        if (commandEvent.command === 'skin1' || commandEvent.command === '/skin1') {
          useSkinFromSlot(1, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin2' || commandEvent.command === '/skin2') {
          useSkinFromSlot(2, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin3' || commandEvent.command === '/skin3') {
          useSkinFromSlot(3, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin4' || commandEvent.command === '/skin4') {
          useSkinFromSlot(4, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin5' || commandEvent.command === '/skin5') {
          useSkinFromSlot(5, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin6' || commandEvent.command === '/skin6') {
          useSkinFromSlot(6, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin7' || commandEvent.command === '/skin7') {
          useSkinFromSlot(7, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin8' || commandEvent.command === '/skin8') {
          useSkinFromSlot(8, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin9' || commandEvent.command === '/skin9') {
          useSkinFromSlot(9, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin10' || commandEvent.command === '/skin10') {
          useSkinFromSlot(10, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin11' || commandEvent.command === '/skin11') {
          useSkinFromSlot(11, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin12' || commandEvent.command === '/skin12') {
          useSkinFromSlot(12, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin13' || commandEvent.command === '/skin13') {
          useSkinFromSlot(13, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin14' || commandEvent.command === '/skin14') {
          useSkinFromSlot(14, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin15' || commandEvent.command === '/skin15') {
          useSkinFromSlot(15, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin16' || commandEvent.command === '/skin16') {
          useSkinFromSlot(16, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin17' || commandEvent.command === '/skin17') {
          useSkinFromSlot(17, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin18' || commandEvent.command === '/skin18') {
          useSkinFromSlot(18, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin19' || commandEvent.command === '/skin19') {
          useSkinFromSlot(19, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin20' || commandEvent.command === '/skin20') {
          useSkinFromSlot(20, commandEvent.argument1);
        }
        if (commandEvent.command === 'skin21' || commandEvent.command === '/skin21') {
          self.message('Only 20 skin slots are available ❌', true);
          $('#chtbox').val('').focus();
        }
      });

        window.addEventListener('keyup', function (event) {
          // Ignore text input field so typing in them is possible
          if (self.isWritingText()) {
            return;
          }

          if (event.keyCode == self.settings.bindings.skin1) {
            useSkinFromSlot(1);
          }
          if (event.keyCode == self.settings.bindings.skin2) {
            useSkinFromSlot(2);
          }
          if (event.keyCode == self.settings.bindings.skin3) {
            useSkinFromSlot(3);
          }
          if (event.keyCode == self.settings.bindings.skin4) {
            useSkinFromSlot(4);
          }
          if (event.keyCode == self.settings.bindings.skin5) {
            useSkinFromSlot(5);
          }
          if (event.keyCode == self.settings.bindings.skin6) {
            useSkinFromSlot(6);
          }
          if (event.keyCode == self.settings.bindings.skin7) {
            useSkinFromSlot(7);
          }
          if (event.keyCode == self.settings.bindings.skin8) {
            useSkinFromSlot(8);
          }
          if (event.keyCode == self.settings.bindings.skin9) {
            useSkinFromSlot(9);
          }
        });
    },

    ultraSplit: function() {
          var self = this;

          window.addEventListener('keyup', function () {
              if (event.keyCode == self.settings.bindings.ultraSplit) {
                  var tripleSplit = function() {
                      window.onkeydown({keyCode: self.hotkeys.T.c});
                      window.onkeyup({keyCode: self.hotkeys.T.c});
                  }

                  tripleSplit();
                  window.setTimeout(function() {
                      tripleSplit();
                      window.setTimeout(function() {
                          tripleSplit();
                      }, 150);
                  }, 150);
              }
          });
      },

    lineSplit: function() {
      var self = this;

        let startLineSplit = function() {
          self.lineSplitAt = Date.now();
          self.message('Linesplit •••••');

          var doSplit = function() {
            if (Date.now() - self.lineSplitAt < 1000) {
              var factor = Math.min((Date.now() - self.lineSplitAt) / 700, 1);
              var x = window.innerWidth / 2;
              var y = factor * (window.innerHeight / 2);

              $('canvas').trigger($.Event('mousemove', {clientX: x, clientY: y}));

              window.requestAnimationFrame(doSplit);
            } else {
              if (Date.now() - self.lineSplitAt < 3000) {
                if (self.splitAt === undefined || Date.now() - self.splitAt > 200) {
                  window.onkeydown({keyCode: self.hotkeys.T.c});
                  window.onkeyup({keyCode: self.hotkeys.T.c});
                  self.splitAt = Date.now();
                }

                window.requestAnimationFrame(doSplit);
              }
            }
          };
          doSplit();
        }

          window.addEventListener('keyup', function () {
              if (event.keyCode == self.settings.bindings.lineSplit) {
                  if (self.isWritingText()) {
                      return;
                  }
                  startLineSplit();
              }
          });

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/linesplit') {
          startLineSplit();
          $('#chtbox').val('');
        }
      });
    },

    halt: function() {
            var self = this;

          // Stop halt on respawn
          window.addEventListener('keydown', function (event) {
              if (self.hotkeys && event.keyCode == self.hotkeys.M.c && ! self.isWritingText()) {
                  self.onHalt = false;
              }
          });

          var initHalt = function() {
              // Do nothing if a menu is open
              if (document.getElementById('overlays').style.display !== 'none' || document.getElementById('advert').style.display !== 'none') {
                  return;
              }

              self.onHalt = ! self.onHalt;

              if (self.onHalt) {
                  self.performHalt.apply(self);
              }
          };

          window.addEventListener('keyup', function () {
              if (event.keyCode == self.settings.bindings.halt) {
                  if (self.isWritingText()) {
                      return;
                  }
                  initHalt();
              }
          });

          window.addEventListener('miracleCommand', function(commandEvent) {
              if (commandEvent.command === '/halt') {
                  initHalt();
                  $('#chtbox').val('');
              }
          });
      },

    performHalt: function () {
      var self = this ? this : window.miracleScripts;

      if (self.haltMoveDirection === undefined) {
        self.haltMoveDirection = 1;
      }
      self.haltMoveDirection = -self.haltMoveDirection;

      var centerX = window.innerWidth / 2;
      var centerY = window.innerHeight / 2;
      var angle = self.getAngle(centerX, centerY, self.mouse.x, self.mouse.y);
      if (self.haltMoveDirection === 1) {
          angle = self.addAngle(angle, 180); // Invert angle
      }
      angle = self.addAngle(angle, 270);
      var distance = 1000000;
      var x = centerX + Math.cos(angle * Math.PI / 180) * distance;
	  var y = centerY + Math.sin(angle * Math.PI / 180) * distance;
      $('canvas').trigger($.Event('mousemove', {clientX: x, clientY: y}));

      // Stop halt if dead ... to avoid continuing halt after next respawn
      if (document.getElementById('advert').style.display !== 'none') {
        self.onHalt = false;
      }
      if (self.onHalt) {
        window.requestAnimationFrame(self.performHalt);
      }
    },

    dance: function () {
      var self = this;

      // Stop dancing on respawn
      window.addEventListener('keydown', function (event) {
        if (self.hotkeys && event.keyCode == self.hotkeys.M.c && ! self.isWritingText()) {
          self.dancing = false;
        }
      });

      var initDance = function() {
        // Do nothing if a menu is open
        if (document.getElementById('overlays').style.display !== 'none' || document.getElementById('advert').style.display !== 'none') {
          return;
        }

        self.dancing = ! self.dancing;

        if (self.dancing) {
          self.performDance.apply(self);
        }
      };

      window.addEventListener('keyup', function () {
        if (event.keyCode == self.settings.bindings.dance) {
          initDance();
        }
      });

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/dance') {
          initDance();
          $('#chtbox').val('');
        }
      });
    },

    performDance: function () {
      var self = this ? this : window.miracleScripts;

      if (self.danceAngle === undefined) {
        self.danceAngle = 0;
      }

      self.danceAngle += 20;

      if (self.danceAngle > 360) {
        self.danceAngle = 0;
      }

      var distance = 1000000;
      var x = window.innerWidth / 2 + Math.sin(self.danceAngle * Math.PI / 180) * distance;
      var y = window.innerHeight / 2 + Math.cos(self.danceAngle * Math.PI / 180) * distance;
      $('canvas').trigger($.Event('mousemove', {clientX: x, clientY: y}));

      // Stop dancing if dead ... to avoid continuing dancing after next respawn
      if (document.getElementById('advert').style.display !== 'none') {
        self.dancing = false;
      }
      if (self.dancing) {
        window.requestAnimationFrame(self.performDance);
      }
    },

    waste: function() {
      var self = this;

      window.addEventListener('keydown', function (event) {
        if (self.hotkeys && event.keyCode == self.hotkeys.M.c && ! self.isWritingText()) {
          self.wasting = false;
        }
      });

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/waste') {
          if (self.wasting) {
            self.wasting = false;
            self.message('Stopped wasting all mass.');
            self.dancing = false;
          } else {
            self.wasting = true;
            self.message('Wasting all mass... 💥');
            if (! self.dancing) {
              self.dancing = true;
              self.performDance.apply(self);
            }
            $('#chtbox').val('spinshakeflip').focus();
          }

          var doWaste = function() {
            // Stop wasting mass if dead ... to avoid continuing wasting after next respawn
            if (document.getElementById('advert').style.display !== 'none') {
              self.wasting = false;
            }
            if (! self.wasting) {
              return;
            }
            $('body').trigger($.Event('keydown', { keyCode: self.hotkeys.W.c}));
            $('body').trigger($.Event('keyup', { keyCode: self.hotkeys.W.c}));
            window.requestAnimationFrame(doWaste);
          };
          doWaste();
        }
      });
    },

    fpsPing: function () {
      var self = this;

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === 'ping' || commandEvent.command === '/ping' || commandEvent.command === '/lag') {
          window.setFPS(1);
          var pingRating = 'Extremely bad! ❌', ping = $('#ping').text();
          if (parseInt(ping) > 0) {
            if (parseInt(ping) >= 0 && parseInt(ping) < 35) { pingRating = 'Perfect! ✔️'; }
            if (parseInt(ping) >= 35 && parseInt(ping) < 70) { pingRating = 'Good! ✔️'; }
            if (parseInt(ping) >= 70 && parseInt(ping) < 120) { pingRating = 'Acceptable! ✔️'; }
            if (parseInt(ping) >= 120 && parseInt(ping) < 200) { pingRating = 'Bad! ❌'; }
            if (parseInt(ping) >= 200 && parseInt(ping) < 990) { pingRating = 'Insanity! ❌'; }
            if (parseInt(ping) >= 990 && parseInt(ping) < 4900) { pingRating = 'THIS IS MADNESS! ❌'; }
            if (parseInt(ping) > 4900) { pingRating = 'M M M M M M M M M MONSTERPING! ❌'; }
          } else {
            ping = '∞ (infinite) ';
          }
          $('#chtbox').val(self.pretty('has a ping of: ' + ping + '. ' + pingRating) + self.watermark).focus();
        }
        if (commandEvent.command === 'fps' || commandEvent.command === '/fps') {
          window.setFPS(1);
          var fpsRating = 'Perfect! ✔️', fps = $('#fps').text();
          if (parseInt(fps) > 0) {
            if (fps >= 0 && fps < 10) { fpsRating = 'Extremely bad! ❌'; }
            if (fps >= 10 && fps < 30) { fpsRating = 'Bad! ❌'; }
            if (fps >= 30 && fps < 40) { fpsRating = 'Acceptable! ✔️'; }
            if (fps >= 40 && fps < 57) {  fpsRating = 'Good! ✔️'; }
            if (fps > 73) {  fpsRating = 'Outstanding! ✔️'; }
            if (fps > 97) {  fpsRating = 'Fantastic! ✔️'; }
            if (fps > 117) {  fpsRating = 'GODLIKE! ✔️'; }
          } else {
            fpsRating = '';
          }

          $('#chtbox').val(self.pretty('has ' + fps + 'fps. ' + fpsRating) + self.watermark).focus();
        }
      });
    },

    timer: function() {
      var self = this;

      var timerStartedAt = null;
      var timerMinutes = null;
      var timeoutId = null;
      var updateId = null;

        // Note: The "settings" item is missing in the local storage until settings have been changed
      var agmaSettings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : { sDark : false };
      var color = (agmaSettings.sDark) ? '#999' : '#3e3e3e';
      var $timeUi = $('<div style="position: fixed; right: 20px; bottom: 230px; z-index: 998; color: ' + color + '; pointer-events: none"></div>');
      $('body').append($timeUi);


        var updateUi = function () {

            var time = '';
            if (self.settings.showClock) {
                var hours = (new Date).getHours();
                var minutes = (new Date).getMinutes();
                time = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
                if (timeoutId) {
                    time = ' - ' + time;
                }
            }

            var remaining = '';
            if (timeoutId) {
                remaining = Math.ceil(((timerStartedAt + timerMinutes * 60 * 1000) - Date.now()) / 1000 / 60) + 'm';
            }

            if (time || remaining) {
                $timeUi.text('🕒 ' + remaining + time);
            } else {
                $timeUi.text('');
            }
        };
        updateUi();
        updateId = setInterval(updateUi, 2000);

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === 'timer' || commandEvent.command === '/timer') {
          var argument1 = commandEvent.argument1;
          var argument2 = commandEvent.argument2;

          if (argument1) {
            timerMinutes = parseInt(argument1);
            if (argument2 === 'h' || argument2 === 'hour' || argument2 === 'hours') {
              timerMinutes *= 60;
            }
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
            }

            if (argument1 === '0' || argument1 === 'reset' || argument1 === 'stop' || argument1 === 'clear' || argument1 === 'remove') {
              self.message('🗑️ Timer removed');
            } else {
              timerStartedAt = Date.now();
              timeoutId = setTimeout(function () {
                timeoutId = null;
                updateUi()
                var message = '🕒 Alert! Timer has expired after ' + timerMinutes + ' minutes.';
                self.message(message);
                self.swal('Time has expired', '🕒 Alert! Timer has expired after ' + timerMinutes + ' minutes.');
              }, timerMinutes * 60 * 1000);
              updateUi();

              self.message('🕒 Timer set to ' + timerMinutes + ' minutes');
            }
          } else {
            if (timeoutId === null) {
              self.message('🕒 No timer has been set. Set with: /timer minutes', true);
            } else {
              var remaining = ((timerStartedAt + timerMinutes * 60 * 1000) - Date.now()) / 1000 / 60;
              self.message('🕒 ' + Math.round(remaining * 10) / 10 + ' minutes remaining.');
            }
          }
          $('#chtbox').val('').focus();
        }
      });
    },

    alive: function() {
      var self = this;

      var element = document.getElementById('playBtn');
      element.addEventListener('click', function() {
        if (! self.isAlive) {
          self.spawnedAt = Date.now();
          self.isAlive = true;
        }
      });
      element = document.querySelector('.bottom-dashboard-box img[title=Respawn]');
      element.addEventListener('click', function() {
        self.spawnedAt = Date.now();
        self.isAlive = true;
      });
      element = document.getElementById('advertContinue');
      element.addEventListener('click', function() {
        self.isAlive = false;
      });

      window.addEventListener('keydown', function (event) {
        if (self.hotkeys && event.keyCode == self.hotkeys.M.c && ! self.isWritingText()) {
          self.spawnedAt = Date.now();
          self.isAlive = true;
        }
      });

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/alive' || commandEvent.command === 'alive') {
            var minutes = parseInt((Date.now() - self.spawnedAt) / 1000 / 60);
            if (minutes < 1) {
              minutes = parseInt((Date.now() - self.spawnedAt) / 1000) + ' Seconds & 0';
            }
            if (minutes > 60) {
              minutes = parseInt(minutes / 60) + ' Hours & ' + (minutes % 60);
            }

          if (! self.isAlive || document.getElementById('advert').style.display !== 'none') {
              if (isNaN(minutes)) {
                  self.prettyMsg('is not alive ☠️');
              } else {
                 self.prettyMsg('is not alive but spawned ' + minutes + ' Minutes ago');
              }
          } else {
            self.prettyMsg('has been alive for ' + minutes + ' Minutes');
          }
        }
      });

    },

    guessing: function() {
      var self = this;

      var guessItem = null;
      var startedAt = null;
      var timeout = null;
      var roundLength = 60 * 1000;
      var library = [ // LMAO.... go away, no cheating please! 🙄
          ['🌞🌼', 'Sunflower', 1],
          ['🌧️🏹', 'Rainbow', 1],
          ['🌧️📅', 'Rainy day', 3],
          ['❄️👑', 'Ice Queen', 3],
          ['🦶⚽', 'Football', 1],
          ['🌙💡', 'Moonlight', 2],
          ['🌞💡', 'Sunlight', 2],
          ['😱🎥', 'Horror movie', 3],
          ['👨🐺', 'Werewolf', 2],
          ['🐮👦', 'Cowboy', 1],
          ['🌌🚢', 'Spaceship', 2],
          ['🔥👨', 'Fireman', 2],
          ['🔥⚔️', 'Firefighter', 2],
          ['🔵🍓', 'Blueberry', 3],
          ['🔥🐶', 'Hotdog', 2],
          ['📹🎮', 'Video game', 4],
          ['⭕💺', 'Wheelchair', 3],
          ['🌚🚶', 'Moonwalk', 3],
          ['🔒🏠', 'Secret room', 4],
          ['🔴🦠', 'Mothercell', 5],
          ['📺👨', 'YouTuber', 3],
          ['🚶💀', 'Walking Dead', 3],
          ['🔥🚧', 'Fireworks', 4],
          ['🧺⚽', 'Basketball', 2],
          ['🍯🌙', 'Honeymoon', 2],
          ['🤗🚢', 'Friendship', 3],
          ['👪💼', 'Teamwork', 4],
          ['🧀🍔', 'Cheeseburger', 2],
          ['❄️⚽', 'Snowball', 1],
          ['👑👨', 'Gold member', 4],
          ['❄️⚪', 'Snow white', 4],
          ['⛰️💡', 'Highlight', 4],
          ['💀🌍', 'Unwerworld', 4],
          ['🔵☁️', 'Blue sky', 3],
          ['⚡🌧️', 'Thunderstorm', 3],
          ['🔴🔴🔴🔴🔴', 'Line split', 2],
      ];

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/guess') {
            if (startedAt !== null && Date.now() - startedAt < roundLength) {
                self.message('🚫 Wait a little longer (' + Math.ceil((roundLength - (Date.now() - startedAt)) / 1000) + ' seconds)', true);
                $('#chtbox').val('');
                return;
            }

            guessItem = library[self.getRandomInt(0, library.length - 1)];

            var hint = '';
            if (guessItem[2] !== null) {
                hint = guessItem[1];
                hint = self.fonts['monospace'](hint.charCodeAt(0)) + hint.substr(1);
                for (var i = 1; i < guessItem[2]; i++) {
                    var pos = self.getRandomInt(0, hint.length);
                     hint = hint.substr(0, pos) +
                         self.fonts['monospace'](hint.charCodeAt(pos)) +
                         hint.substr(pos + 1);
                }
                hint = hint.replace(/(\w)/gi, '_ ');
                hint = ' → ' + hint;
            }

            $('#chtbox').val('𝘎𝘶𝘦𝘴𝘴 𝘸𝘩𝘢𝘵 𝘵𝘩𝘪𝘴 𝘪𝘴: ' + guessItem[0] + hint);

            startedAt = Date.now();
            timeout = setTimeout(function() {
                 self.message('Guessing game ended without a winner. The word was: "' + guessItem[1] + '"');
                  self.swal('Miracle Guessing Game', 'Guessing game ended without a winner. The word was: "<span style="color: silver">' + guessItem[1] + '</span>"');
            }, roundLength);
        }
      });

        window.addEventListener('miracleChatMessage', function(messageEvent) {
          if (startedAt !== null && Date.now() - startedAt <= roundLength) {
              if (messageEvent.message.toLowerCase().trim().replace(/\s/g, '') ===  ':' + guessItem[1].toLowerCase()) {
                  $('#chtbox').val('𝘎𝘶𝘦𝘴𝘴𝘪𝘯𝘨 𝘨𝘢𝘮𝘦 𝘸𝘰𝘯 𝘣𝘺 𝘱𝘭𝘢𝘺𝘦𝘳 ' + messageEvent.nickname);
                  self.message('Guessing game won by player "' + messageEvent.nickname + '"!');
                  self.swal('Miracle Guessing Game', 'Guessing game won by "<span style="color: ' + messageEvent.nicknameColor + '">' + messageEvent.nickname + '</span>"!');
                  startedAt = null;
                  clearTimeout(timeout);
              }
          }
        });
    },

    nameColor: function() {
      var self = this;
      var nickname;
      var profile = null;

      var updateData = function() {
          nickname = ' ' + $('#nick').val() + ' ';

          var accountName = self.getAccountName();
          if (accountName) {
              profile = self.profiles[accountName];
          }
      }
      $('#playBtn').click(updateData);

        var originalStrokeText = CanvasRenderingContext2D.prototype.strokeText;
        CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
            if (profile) {
                if (profile.nickNameStrokeColor && text === nickname) {
                    this.strokeStyle = profile.nickNameStrokeColor;
                    if (profile.nickNameStrokeWidth) {
                        this.lineWidth = profile.nickNameStrokeWidth;
                    }
                }
            } else {
                if (self.settings.useNickNameStrokeColor && text === nickname) {
                    this.strokeStyle = self.settings.nickNameStrokeColor;
                    if (self.settings.useNickNameStrokeWidth) {
                        this.lineWidth = self.settings.nickNameStrokeWidth;
                    }
                }
            }
            return originalStrokeText.apply(this, arguments);
        }

        var originalFillText = CanvasRenderingContext2D.prototype.fillText;
        CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
            if (profile) {
                if (profile && profile.nickNameColor && text === nickname) {
                    this.fillStyle = profile.nickNameColor;
                }
            } else {
                if (self.settings.useNickNameColor && text === nickname) {
                    this.fillStyle = self.settings.nickNameColor;
                }
            }
            return originalFillText.apply(this, arguments);
        }

      // Legacy info
      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/namecolor' || commandEvent.command === '/colorname' || commandEvent.command === '/colorchange') {
          self.message('🚫 Changing the name color is no longer possible as there is a server-side fix', true);
          $('#chtbox').val('');
        }
      });
    },

    wearablesToggle: function() {
        var self = this;

        // Note: Doesn't get updated, so we can only use it to init
        var checked = document.getElementById('cWearables').checked;

        window.addEventListener('keydown', function () {
            // Ignore text input field so typing in them is possible
            if (self.isWritingText()) {
                return;
            }

            if (event.keyCode == self.settings.bindings.wearables) {
                checked = ! checked;
                window.setWearables(checked);
            }
        });
    },

    keyboardLayout: function() {
          if (this.settings.showKeyboardLayout && this.hotkeys) {
              var $element = $('<table id="keyboard-layout" style="position: fixed; right: 10px; top: 345px; border-collapse: separate; border-spacing: 10px 0; text-align: right; pointer-events: none;">' +
                               '<tr><td>Split: </td><td>&nbsp;&nbsp;' + this.hotkeys.Space.d + '</td></tr>' +
                               '<tr><td>Double Split: </td><td>' + this.hotkeys.D.d + '</td></tr>' +
                               '<tr><td>Triple Split: </td><td>' + this.hotkeys.T.d + '</td></tr>' +
                               '<tr><td>Macro Split: </td><td>' + this.hotkeys.Z.d + '</td></tr>' +
                               '<tr><td>Ultra Split: </td><td>' + this.keyboardMap[this.settings.bindings.ultraSplit] + '</td></tr>' +
                               '<tr><td>Feed: </td><td>' + this.hotkeys.W360.d + '</td></tr>' +
                               '<tr><td>Respawn: </td><td>' + this.hotkeys.M.d + '</td></tr>' +
                               '<tr><td>Recombine: </td><td>' + this.hotkeys.E.d + '</td></tr>' +
                               '<tr><td>2x Speed: </td><td>' + this.hotkeys.S.d + '</td></tr>' +
                               '<tr><td>Freeze Self: </td><td>' + this.hotkeys.F.d + '</td></tr>' +
                               '<tr><td>Invisibility: </td><td>' + this.hotkeys.I.d + '</td></tr>' +
                               '<tr><td>Toggle Camera: </td><td>' + this.hotkeys.Q.d + '</td></tr>' +
                               '</table>');


              $element.insertAfter($('#leaderboard'));
          }
      },

    nameCopier: function() {
          var $copyNameItem = $('<li class="contextmenu-item enabled"><div class="context-icon"><i class="fa fa-copy"></i></div><p>Copy Name To Chat</p></li>');
          $copyNameItem.insertAfter('#contextSpectate');
          var showNoPlayerSelectedMessage = function (message, isError) {
              var curser = document.querySelector('#curser');

              curser.textContent = message;
              curser.style.display = 'block';
              curser.style.color = isError ? 'rgb(255, 0, 0)' : 'rgb(255, 0, 0)';

              window.setTimeout(function () {
                  curser.style.display = 'none';
              }, 5000);
          }

           $copyNameItem.click(function() {
               if ($('#contextPlayerName').text().trim() === '(no player selected)'){
               showNoPlayerSelectedMessage('You didn\'t select a player!');
               }else{
              $('#chtbox').val($('#chtbox').val() + $('#contextPlayerName').text().trim()).focus();
              $('#settingsBtn').click();
              setTimeout(function(){$('#settingsBtn').click();},20);}
           });
     },

    skinApplier: function() {
      var self = this;

      var $useWearablesItem = $('<li class="contextmenu-item enabled"><div class="context-icon"><i class="fa fa-graduation-cap"></i></div><p>Use Player\'s Wearables</p></li>');
      $useWearablesItem.insertAfter('#contextPlayer');
      var $useSkinItem = $('<li class="contextmenu-item enabled"><div class="context-icon"><i class="fa fa-eye"></i></div><p>Use Player\'s Skin</p></li>');
      $useSkinItem.insertAfter('#contextPlayer');

      $useSkinItem.click(function() {
        var skinUrl = self.getSkinUrl('#contextPlayerSkin');
        if (skinUrl === null) {
          self.message('This player does not use a skin or no player selected 🚫', true);
        } else {
          var skinId = parseInt(skinUrl.substr(22)); // Cut off "https://agma.io/skins/"
          self.useSkin(skinId);
        }
      });

      $useWearablesItem.click(function() {
        var wearables = [
            self.extractWearableId($('#contextPlayerWear1').attr('style')),
            self.extractWearableId($('#contextPlayerWear2').attr('style')),
            self.extractWearableId($('#contextPlayerWear3').attr('style')),
            self.extractWearableId($('#contextPlayerWear4').attr('style')),
            self.extractWearableId($('#contextPlayerWear5').attr('style')),
        ];

          
          self.useWearables(wearables);
      });
    },

      useWearables: function(wearables, dropCurrent) {
          var self = this;

          if (dropCurrent === undefined) {
              dropCurrent = true;
          }

          window.azad(true);

          setTimeout(function () {
              $('#skinExampleMenu').click();


              setTimeout(function () {

                  $('#wearablesTab a').click()

                  setTimeout(function () {
                      // First remove all current wearables
                      if (dropCurrent) {
                          var oldWearables = [
                              self.extractWearableId($('#wearExampleShop1').attr('style')),
                              self.extractWearableId($('#wearExampleShop2').attr('style')),
                              self.extractWearableId($('#wearExampleShop3').attr('style')),
                              self.extractWearableId($('#wearExampleShop4').attr('style')),
                              self.extractWearableId($('#wearExampleShop5').attr('style')),
                          ]
                          oldWearables.forEach(function(id) {
                              //toggleWearable(id, 0, 0, 0, false);
                              $('#wearableUseBtn' + id).click();
                          });
                      }

                      // Use new wearables
                      wearables.forEach(function(id) {
                          $('#wearableUseBtn' + id).click();
                      });

                      setTimeout(function () {
                          $('#shopModalDialog button.close').click();

                          setTimeout(function () {
                              window.setNick(document.getElementById('nick').value);
                          }, 200);
                      }, 200);
                  }, 1000);

              }, 200);
          }, 200);
      },

      extractWearableId: function(style) {
            if (style === undefined) {
                return null;
            }

            var pos = style.indexOf('background-image: url("wearables/');
            if (pos === -1) {
                return null;
            }
            return parseInt(style.substr(pos + 33));
        },

    help: function() {
      $('body').append('<style>#miracle-help-table tr { cursor: pointer } #miracle-help-table table tr:hover { background-color: rgba(255,255,255,0.1) } #miracle-help-button:hover { background: rgba(68,68,68,.8); color: #ffdd67; cursor: pointer } #miracle-help-button { position: absolute; z-index: 10; bottom: 10px; left: 480px; height: 30px; width: 30px; background: rgba(68,68,68,.5); color: #cbb059; }</style>');
      var $modal = $('<div class="miracle-primary-color-font" style="position: fixed; overflow-y: scroll; width: 100%; height: 100%; padding: 50px; background-color: rgba(0,0,0,0.95); z-index: 999; display: none"></div>');
      $modal.append('<h1>Miracle Scripts Help</h1>');

      var helpText = '<br><span style="color: #717171">These chat commands are available. Click on a command to use it!</span><br><br><table id="miracle-help-table"><tr><td><table>' +
          '<tr><th style="padding-right: 70px"><i>Command</i></th><th><i>Description</i></th></tr>' +
          '<tr><td><code>/commands</code></td><td>Show this command help</td></tr>' +
          '<tr><td><code>/version</code></td><td>Show Miracle version info</td></tr>' +
          '<tr><td><code>/miracles</code></td><td>Show the number of miracle installs</td></tr>' +
          '<tr><td><code>/miraclesettings</code></td><td>Show the miracle settings page</td></tr>' +
          '<tr><td><code>/players</code></td><td>Display how many players are online</td></tr>' +
          '<tr><td><code>/skin&lt;n></code></td><td>Change to skin &lt;n> (1-20), e.g.: /skin1</td></tr>' +
          '<tr><td><code>/skin&lt;n> this</code></td><td>Store current skin as skin <n>, e.g.: /skin1 this</td></tr>' +
          '<tr><td><code>/skin&lt;n> &lt;id></code></td><td>Store skin with ID &lt;id> as skin &lt;n> (1-20)</td></tr>' +
          '<tr><td><code>/skinid</code></td><td>Send a chat message with your skin ID</td></tr>' +
          '<tr><td><code>/useskin &lt;id></code></td><td>Use skin with the given ID</td></tr>' +
          '<tr><td><code>/chatlog</code></td><td>Show the extended chat log</td></tr>' +
          '<tr><td><code>/say &lt;text></code></td><td>Send a chat message with a fancy font</td></tr>' +
          '<tr><td><code>/say&lt;n> &lt;text></code></td><td>Send chat message with fancy font number &lt;n> (1-7)</td></tr>' +
          '<tr><td><code>/shout &lt;text></code></td><td>Purchase a megaphone shout for 20000 coins</td></tr>' +
          '<tr><td><code>/paste</code></td><td>Show the emojis and text paste page</td></tr>' +
          '<tr><td><code>/timer &lt;n></code></td><td>Set timer for &lt;n> minutes</td></tr>' +
          '<tr><td><code>/timer &lt;n> h</code></td><td>Set timer for &lt;n> hours</td></tr>' +
          '<tr><td><code>/timer stop</code></td><td>Stop the timer</td></tr>' +
          '<tr><td><code>/mass</code></td><td>Send a chat message with your current mass</td></tr>' +
          '<tr><td><code>/topmass</code></td><td>Send a chat message with your top mass in this sesssion</td></tr>' +
          '<tr><td><code>/xp</code></td><td>Send a chat message with your level and next level\'s progress</td></tr>' +
          '<tr><td><code>/powerups</code></td><td>Send a chat message with your powerup amounts</td></tr>' +
          '<tr><td><code>/fps</code></td><td>Send a chat message with current fps</td></tr>' +
          '<tr><td><code>/ping</code></td><td>Send a chat message with current ping</td></tr>' +
          '<tr><td><code>/online</code></td><td>For how long are you online in the current session?</td></tr>' +
          '<tr><td><code>/alive</code></td><td>For how long are you alive?</td></tr>' +
          '<tr><td><code>/solo</code></td><td>Show the solo server message</td></tr>' +
          '<tr><td><code>/dice</code></td><td>Roll a die with 6 sides</td></tr>' +
          '<tr><td><code>/dice &lt;n></code></td><td>Roll a die with &lt;n> sides</td></tr>' +
          '<tr><td><code>/guess</code></td><td>Start a guessing chat game</td></tr>' +
          '<tr><td><code>/linesplit</code></td><td>Let your cell make a linesplit</td></tr>' +
          '<tr><td><code>/waste</code></td><td>Waste all your mass</td></tr>' +
          '<tr><td><code>/dance</code></td><td>Let your cell dance</td></tr>' +
          '<tr><td><code>/halt</code></td><td>Let your cells stop moving</td></tr>' +


          '</table></td><td style="vertical-align: top"><table>' +
          '<tr><th style="padding-right: 70px"><i>Command</i></th><th><i>Description</i></th></tr>' +
          '<tr><td><code>/help</code></td><td>Get help by the Agma support team</td></tr>' +
          '<tr><td><code>/claim</code></td><td>Claim your daily coins</td></tr>' +
          '<tr><td><code>/coins</code></td><td>Send a chat message with your coins</td></tr>' +
          '<tr><td><code>/level</code></td><td>Send a chat message with your account level</td></tr>' +
          '<tr><td><code>/rank</code></td><td>Send a chat message with your account rank</td></tr>' +
          '<tr><td><code>/hours</code></td><td>Send a chat message with the time you played</td></tr>' +
          '<tr><td><code>/shake</code></td><td>Let your cells shake!</td></tr>' +
          '<tr><td><code>/flip</code></td><td>Let your cells flip!</td></tr>' +
          '<tr><td><code>/spin</code></td><td>Let your cells spin!</td></tr>' +
          '<tr><td><code>/jump</code></td><td>Let your cells jump!</td></tr>' +
          '<tr><td><code>/wacky</code></td><td>Your cells will be laughing faces!</td></tr>' +
          '<tr><td><code>/stats</code></td><td>Show your battle royale stats</td></tr>' +
          '<tr><td><code>/party &lt;message></code></td><td>Write a message to your party</td></tr>' +
          '<tr><td><code>/pm &lt;account></code></td><td>Write a message to a given account</td></tr>' +
          '</table></td></tr></table>';

      $modal.append(helpText);

      $modal.append($('<br><a href="#" class="miracle-primary-color-background" style="display: inline-block; margin-top: 20px; padding: 10px; color: white">Close</a>').click(function () {
        $modal.hide();
      }));

      $('body').append($modal);

      this.$helpModal = $modal;

      $('#miracle-help-table table tr').click(function() {
          var cmd = $(this).find('code').text();
          $('#chtbox').val($('#chtbox').val() + cmd).focus();
          $modal.hide();
      });

      var $helpButton = $('<div id="miracle-help-button" title="Help" class="unselectable"><i class="fa fa-question-circle" style="position: absolute; top: 4px; left: 5px; font-size: 22px;"></i></div>').click(function() {
          $modal.show();
      });
      if (this.settings.overwriteHelp) {
          $('#commandsBtn').css('display', 'none'); // Hide Agma's vanilla help button
          $helpButton.insertAfter('#emojiBtn');
          $('body').append(`<style>
@media all and (max-width: 1288px) {
  #miracle-help-button{
    left: 379px;
  }
}
@media all and (max-width: 1088px) {
  #miracle-help-button {
    left: 278px;
  }
}
@media all and (max-width: 909px) {
  #miracle-help-button {
    left: 185px;
    height: 26px;
    width: 26px;
  }
  #miracle-help-button i {
    top: 2px !important;
  }
}
</style>`); // Ensure help icon does not overlap powerups
      }

      window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/cmds' || commandEvent.command === '/commands' || commandEvent.command === '/info' || commandEvent.command === '/miraclehelp') {
          $('#chtbox').val('').focus();
          $modal.show();
        }
      });
    },

    commands: function () {
      var self = this;
      var minutes, skinId;

      var sessionStartedAt = Date.now();

      $('#chtbox').keydown(function (event) {
        if (event.keyCode === 13) {
          var message = $('#chtbox').val();
          var command = message.split(' ')[0];
          var argument1 = message.split(' ')[1];
          var argument2 = message.split(' ')[2];

          if (message === 'time' || command === '/time' || command === '/localtime') {
            var now = new Date();
            $('#chtbox').val(self.pretty('Local time: ' + now.toLocaleString()) + self.watermark).focus();
          }

          if (message === 'minutes' || command === '/minutes' || message === 'online' || command === '/online' || command === '/session') {
            if (message === 'minutes' || command === '/minutes') {
              self.message('⛔ The /minutes command is deprecated, please use /online instead.', true);
            }

            minutes = parseInt((Date.now() - sessionStartedAt) / 1000 / 60);
            if (minutes < 1) {
              minutes = parseInt((Date.now() - sessionStartedAt) / 1000) + ' Seconds & 0';
            }
            if (minutes > 60) {
              minutes = parseInt(minutes / 60) + ' Hours & ' + (minutes % 60);
            }
            $('#chtbox').val(self.pretty('is online for: ' + minutes + ' Minutes in the session') + self.watermark).focus();
          }

            if (command === '/claim') { // Player used claim command so store that so that Miracle doesnt suggest to use it during cool down
                // Use timeout to wait for curser rendering the message
                window.setTimeout(function() {
                    // Check if the client got the success message to be sure they actually claimed coins:
                    if ($('#curser').text().indexOf('free coins today, remember to /claim') !== -1) {
                        self.settings.coinsClaimedAt = Date.now();
                        console.log('#3 coins claimed at: ' + self.settings.coinsClaimedAt);
                        localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
                    }
                    // If the client got a fail message update the timer:
                    if ($('#curser').text().indexOf('You have already claimed your reward today.') !== -1) {
                          let regEx = /You can claim your reward again in (\d+) hour/;
                          let matches = $('#curser').text().match(regEx);
                          if (matches[1]) {
                               // 25 instead of 24 because we ingore the remaining minutes, so we just add a complete hour instead
                               self.settings.coinsClaimedAt = Date.now() - (25 - parseInt(matches[1]));
                              console.log('#4 coins claimed at: ' + self.settings.coinsClaimedAt);
                               localStorage.setItem('miracleScripts', JSON.stringify(self.settings));
                          }
                    }
                }, 1000); // 1000 ms cuz of ping because the server needs to respond
                 
            }

          if (command === '/solo' || command === '/noteam') {
            $('#chtbox').val(':warning: SOLO SERVER :warning: No teaming!! No hay equipo!! Pas d\'équipe!! Kein Teaming!! لا فريق').focus();
          }

          if (command === '/miracle' || command === '/version') {
            var miracleInfo =  'uses 𝘔𝘪𝘳𝘢𝘤𝘭𝘦 𝘚𝘤𝘳𝘪𝘱𝘵𝘴';

            if (GM_info) {
              miracleInfo += ' ' + GM_info.script.version;
            }

              var extra = 'Install for free!';
              //if (self.getRandomInt(1, 2) === 1) {
                  //extra = '';
              //}
            $('#chtbox').val(miracleInfo + '. ' + extra + self.watermark).focus();
          }

          if (command === '/samira') {
            $('#chtbox').val('Samira (inaaa) is the initiator of 𝘔𝘪𝘳𝘢𝘤𝘭𝘦 𝘚𝘤𝘳𝘪𝘱𝘵𝘴' + self.watermark).focus();
          }

          if (command === '/miracles') {
            $('#chtbox').val('𝘔𝘪𝘳𝘢𝘤𝘭𝘦 𝘚𝘤𝘳𝘪𝘱𝘵𝘴 has about 12,000 installs so far!' + self.watermark).focus();
          }

          if (command === '/skinid' || command === '/sayskin') {
            var skinUri = self.getSkinUrl();
            skinId = parseInt(skinUri.substr(skinUri.indexOf('skins/') + 6));
              if (skinId > 0) {
                  self.prettyMsg('uses the skin with the ID ' + skinId);
              } else {
                  self.prettyMsg('does not use a skin');
              }
            
            return;
          }

          if (command === '/useskin') {
            skinId = parseInt(argument1);
            if (! (skinId > 0)) {
              self.message('Invalid skin ID given. Example usage of command: /useskin 123', true);
            } else {
              self.useSkin(skinId);
            }

            $('#chtbox').val('');
          }

          if (command.substr(0, 4) === '/say' || (command === '/party' && argument1.substr(0, 4) === '/say')  || (command === '/pm' && argument2.substr(0, 4) === '/say')) {
            var prefix = '';
            if (command === '/party' && argument1.substr(0, 4) === '/say') {
              prefix = '/party ';
              message = message.substr(7);
            }
            if (command === '/pm' && argument2.substr(0, 4) === '/say') {
              var spacePos = message.indexOf(' ', 5);
              prefix = message.substr(0, spacePos + 1);
              message = message.substr(spacePos + 1);
            }

            var fontIndex = message.charAt(4) - 1;
            if (Number.isNaN(fontIndex)|| fontIndex < 0 || fontIndex > Object.getOwnPropertyNames(self.fonts).length - 1) {
              fontIndex = 1;
            }

            var badWords = self.badWords.join('|');
			var regExp = new RegExp(badWords, 'gi');
			message = message.replace(regExp, '****');

            $('#chtbox').val(prefix + self.useUnicodeFont(message.substr(message.indexOf(' ') + 1), Object.getOwnPropertyNames(self.fonts)[fontIndex])).focus();
          }

          if (command === '/dice') {
            var max = (argument1 > 0) ? parseInt(argument1) : 6;
            var number = self.getRandomInt(1, max);
            self.prettyMsg('rolled a die with ' + max + ' sides. Result: ' + number);
          }

          if (command === '/powerups' || command === '/powers' || command === '/has') {
            var map = {
                invRecombine: 'recombine',
                invSpeed: 'speed',
                invGrowth: 'growth',
                invSpawnVirus: 'virus',
                invSpawnMothercell: 'red virus',
                invSpawnPortal: 'portal',
                invSpawnGoldOre: 'gold block',
                invFreeze: 'freeze',
                inv360Shot: 'push',
                invWall: 'wall',
                invAntiFreeze: 'nofreeze',
                invAntiRecombine: 'anti-rec',
                invFrozenVirus: 'frozen virus',
                invShield: 'shield',
            }
            var getPowerUps = function(map, shortNames) {
                var ids = Object.keys(map); var amount; var powerups = ''; var powerUpName;
                for (var i = 0; i < ids.length; i++) {
                    // Note: If the amount of a power-ups is 1, no number will be displayed.
                    amount = $('#' + ids[i] + ' p').text() || ($('#' +  ids[i]).css('display') === 'none' ? 0 : 1);
                    if (amount > 0) {
                        if (powerups != '') {
                            powerups += ', ';
                        }
                        powerUpName = map[ids[i]];
                        if (shortNames) {
                            powerUpName = powerUpName.substr(0, 3);
                        }
                        powerups += amount + ' ' + powerUpName;
                    }
                }
                return powerups;
            }

            var powerups = getPowerUps(map, false);
            if (powerups.length >= 95) {
                powerups = getPowerUps(map, true);
            }

            if (powerups === '') {
                powerups = 'no power-ups';
            }
            $('#chtbox').val(self.watermark + self.pretty('has ') + powerups); // Note: Dont use unicode fotn on all because this uses more characters than usually!
          }

            if (command === '/mass') {
                 self.prettyMsg('has this mass: ' + self.mass);
            }

            if (command === '/topmass') {
                 self.prettyMsg('has this top mass: ' + self.topMass);
            }

          if (command === '/xp' || command === '/progress') {
              var xp = parseInt($('.xpBarTop span').text());
              var text =  '█'.repeat(xp / 10) + '▒'.repeat(10 - parseInt(xp / 10)) + ' ' + xp + '%';
            self.prettyMsg('is currently level ' + $('#level2').text() + ' with ' + text + ' of the next level');
          }

          if (command === '/megaphone' || command === '/megashout' || command === '/shout') {
            // Notes: 1-7 = colors. The shout message can have max 130 chars, but chat messages can be only 100(?) chars long so np
            self.warnBeforeMegaShout(message.substr(message.indexOf(' ') + 1), self.getRandomInt(1, 7));
            $('#chtbox').val('');
          }

          if (command === '/players') {
              var gameservers = JSON.parse(localStorage.getItem('gameservers'));
              var players = 0;
              var current = null;

              gameservers.forEach(function(gameserver) {
                  players += gameserver.players;
                  if (gameserver.isCurrent) {
                      current = gameserver.players + '/' + gameserver.maxPlayers;
                  }
              });

              self.prettyMsg('Players online in Agma: ' + players);

              if (current !== null) {
                  $('#chtbox').val($('#chtbox').val() + self.pretty(' - current server: ' + current));
              }
          }

          if (command === '/wearable') {
              $('#chtbox').val('');
            if (argument1) {
              argument1 = message.substr(10).toLowerCase().trim();
              var wIds = Object.keys(self.wearables);
              var foundWearable = null;
              wIds.forEach(function(wId) {
                if (self.wearables[wId].toLowerCase() === argument1) {
                   foundWearable = wId;
                }
              });
              if (! foundWearable) {
                  wIds.forEach(function(wId) {
                      if (self.wearables[wId].toLowerCase().indexOf(argument1) !== -1) {
                          foundWearable = wId;
                      }
                  });
              }
              if (foundWearable) {
                  self.useWearables([foundWearable], false);
              } else {
                  var candidates = [];
                  wIds.forEach(function(wId) {
                      if (self.wearables[wId].toLowerCase().substr(0, 1) === argument1.substr(0, 1)) {
                          candidates.push(self.wearables[wId]);
                      }
                  });
                  if (candidates.length > 0) {
                      self.swal('Not found', 'Not found. Try one of these: "' + candidates.join('" , "') + '"');
                  } else {
                      self.swal('Not found', 'Sorry, but I\'m lost. I cannot find this wearable.');
                  }
              }
            } else {
              self.swal('Missing Argument', 'You need to specify the name of a wearable.');
            }
          }

          var commandEvent = new Event('miracleCommand');
          commandEvent.message = message;
          commandEvent.command = command;
          commandEvent.argument1 = argument1;
          commandEvent.argument2 = argument2;
          window.dispatchEvent(commandEvent);
        }
      });
    },

    /**
     * This object is a container for functions that convert english letters and digits to fancy Unicode characters
     * @see https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
     * @see https://en.wikipedia.org/wiki/Enclosed_Alphanumerics
     * @see https://en.wikipedia.org/wiki/Enclosed_Alphanumeric_Supplement
     */
    fonts: {
      doubleStruck : function(charCode) {
        if (charCode === 67) { return String.fromCodePoint(0x2102); } // C
        if (charCode === 72) { return String.fromCodePoint(0x210D); } // H
        if (charCode === 78) { return String.fromCodePoint(0x2115); } // N
        if (charCode === 80) { return String.fromCodePoint(0x2119); } // P
        if (charCode === 81) { return String.fromCodePoint(0x211A); } // Q
        if (charCode === 82) { return String.fromCodePoint(0x211D); } // R
        if (charCode === 90) { return String.fromCodePoint(0x2124); } // Z
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x1D538 + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x1D552 + charCode - 97);
        }
        if (charCode >= 48 && charCode <= 57) {
          return String.fromCodePoint(0x1D7D8 + charCode - 48);
        }
        return String.fromCharCode(charCode);
      },

      monospace : function(charCode) {
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x1D670 + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x1D68A + charCode - 97);
        }
        if (charCode >= 48 && charCode <= 57) {
          return String.fromCodePoint(0x1D7F6 + charCode - 48);
        }
        return String.fromCharCode(charCode);
      },

      scriptBold : function(charCode) {
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x1D4D0 + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x1D4EA + charCode - 97);
        }
        if (charCode >= 48 && charCode <= 57) {
          return String.fromCodePoint(0x1D7CE + charCode - 48);
        }
        return String.fromCharCode(charCode);
      },

      frakturBold : function(charCode) {
        if (charCode === 121) { return '𝐲'; } // y
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x1D56C + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x1D586 + charCode - 97);
        }
        if (charCode >= 48 && charCode <= 57) {
          return String.fromCodePoint(0x1D7CE + charCode - 48);
        }
        return String.fromCharCode(charCode);
      },

      serifItalic: function(charCode) {
        if (charCode === 104) { return String.fromCodePoint(0x1D629); } // h
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x1D434 + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x1D44E + charCode - 97);
        }
        return String.fromCharCode(charCode);
      },

      circled: function(charCode) {
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x24B6 + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x24D0 + charCode - 97);
        }
        if (charCode >= 49 && charCode <= 57) {
          return String.fromCodePoint(0x2460 + charCode - 49);
        }
        return String.fromCharCode(charCode);
      },

      boxed: function(charCode) {
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCodePoint(0x1F130 + charCode - 65);
        }
        if (charCode >= 97 && charCode <= 122) {
          return String.fromCodePoint(0x1F130 + charCode - 97);
        }
        if (charCode >= 49 && charCode <= 57) {
          return String.fromCodePoint(0x2460 + charCode - 49);
        }
        return String.fromCharCode(charCode);
      }
    },

      pretty: function(text) {
          return this.useUnicodeFont(text, 'serifItalic');
      },

      prettyMsg: function(text) {
          $('#chtbox').val(this.pretty(text) + this.watermark);
      },

    /**
     * Apply a unicode "font" on given text
     */
    useUnicodeFont: function(text, font) {
      var regexResults, emojiPositions = [], emojiRegex = /:\w+:/g;
      while ((regexResults = emojiRegex.exec(text)) !== null) {
        emojiPositions.push(regexResults.index);
      }


      var converted = '', convert = true;
      for (var i = 0; i < text.length; i++) {
        if (! convert && text.charAt(i) === ':') {
          convert = true;
        }
        if (emojiPositions.indexOf(i) !== -1) {
          convert = false;
        }
        if (convert) {
          converted += this.fonts[font](text.charCodeAt(i));
        } else {
          converted += text.charAt(i);
        }
      }

      return converted;
    },

    /**
     * True if currently a HTML text element is focused
     */
    isWritingText: function() {
      return document.activeElement.type === 'text' || document.activeElement.type === 'password' || document.activeElement.type === 'textarea';
    },

    /**
     * Let the browser download string data as a text file with a given filename.
     */
    download: function (filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },

    /**
     * Converts a version string (for example "1.5.7") to an integer (for example 1005007)
     * If no string version is given, the current version of the script will be used.
     */
    getVersionAsInt: function(stringVersion) {
      if (stringVersion === undefined) {
        stringVersion = typeof GM_info !== 'undefined' ? GM_info.script.version : '0';
      }

      var parts = stringVersion.split('.');
      if (parts.length === 1) {
        parts.push('0');
      }
      if (parts.length === 2) {
        parts.push('0');
      }

      return parseInt(parts[0]) * 1000000 + parseInt(parts[1]) * 1000 + parseInt(parts[2]);
    },

    /**
     * Returns a random number between min and max (both inclusive)
     * Source: MDN
     */
    getRandomInt: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },


    /**
     * Returns the 360-angle between two points 8coordinates), starting by the first point.
     * 0° means the second point is in the north of the first point.
     * The returned angle will always be >= 0 and < 360.
     */
    getAngle: function(x1, y1, x2, y2) {
      var angle = Math.atan2(y2 - y1, x2 - x1); // range (-PI, PI]
      angle *= 180 / Math.PI; // rads to degs, range (-180, 180]
      angle += 90;

      if (angle < 0) angle = 360 + angle; // range [0, 360)
      if (angle >= 360) angle = 360 - angle; // range [0, 360)

      return angle;
    },

    /**
     * Adds angle2 to angle1 and returns the resulting angle.
     */
    addAngle: function(angle1, angle2) {
      var angle = angle1 + angle2;

      angle %= 360;
      if (angle < 0) angle += 360;

      return angle;
    },

    /**
     * Use the curser div to display a message at the top of the screen.
     *
     * @param message
     * @param isError
     */
    message: function (message, isError, fontSize) {
      var curser = document.querySelector('#curser');

      curser.textContent = message;
      curser.style.display = 'block';
      curser.style.color = isError ? 'rgb(255, 0, 0)' : 'rgb(0, 192, 0)';
      if (fontSize > 0) {
          curser.style.fontSize = fontSize + 'px';
      }

      window.setTimeout(function () {
        curser.style.display = 'none';
      }, 5000);
    },

    /**
     * Show a sweet alert (modal/popup) with a given title and message.
     */
    swal: function (title, message, html) {
      if (html === undefined) {
        html = true;
      }
      window.swal({
        title: '📢 <span class="miracle-primary-color-font">' + title + '</span>',
        text: message,
        html: html
      });
    },

    /**
     * Returns the URI of my skin or null if not skin has been set.
     * Use this.skinUrl() to get it.
     */
    getSkinUrl: function(sourceSelector) {
      if (sourceSelector === undefined) {
        sourceSelector = '#skinExampleMenu';
      }
      var skinUrlRaw = $(sourceSelector).css('background-image');

      var parts = skinUrlRaw.split('"');

      if (parts.length !== 3) {
        return null;
      } else {
        return parts[1];
      }
    },

    getAccountName: function() {
          // First make sure we are logged in
          if (document.getElementById('dashPanel').style.display !== 'none') {
              // We have to use trim() or else the name might contain new lines
              return document.querySelector('#dashPanel .username').innerText.trim();
          } else {
              return null;
          }
          
      },

    /**
     * Tries to pick a skin that is identified by its skin ID.
     * Opens the skin menu, chooses the skin, and closes the menu again.
     * The skin must be available for the current player (e.g. because it's a public one).
     */
    useSkin: function(skinId) {
      window.azad(true);

      setTimeout(function () {
        $('#skinExampleMenu').click();

        var checkLoaded = function () {
          var loaded = ($('#skinsFree tr').length > 1);
          if (loaded) {
            window.toggleSkin(skinId);

            setTimeout(function () {
              $('#shopModalDialog button.close').click();

              setTimeout(function () {
                window.setNick(document.getElementById('nick').value);
              }, 200);
            }, 200);
          } else {
            setTimeout(checkLoaded, 300);
          }
        };
        checkLoaded();
      }, 200);
    },

    /**
     * Legal Disclaimer: This is an original Agma function but the original is not accessible - so this is a copy.
     * Copyright (C) Agma.io - do only use together with Miracle on Agma.io.
     */
    warnBeforeMegaShout: function(msg, color) {
      swal({
        title: "Confirm",
        text: 'If you click "Buy", you will purchase the megaphone shout.',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        confirmButtonText: "Yes, confirm purchase",
        cancelButtonText: "No, cancel purchase"
      }, function() {
        purchaseMega(msg,color);
      });
    },

    setupPolyfills: function() {
      // Polyfill for old browser so they have String.fromCodePoint()
      if (!String.fromCodePoint) (function(stringFromCharCode) {
        var fromCodePoint = function(_) {
          var codeUnits = [], codeLen = 0, result = "";
          for (var index=0, len = arguments.length; index !== len; ++index) {
            var codePoint = +arguments[index];
            // correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
            // The surrounding `!(...)` is required to correctly handle `NaN` cases
            // The (codePoint>>>0) === codePoint clause handles decimals and negatives
            if (!(codePoint < 0x10FFFF && (codePoint>>>0) === codePoint))
              throw RangeError("Invalid code point: " + codePoint);
            if (codePoint <= 0xFFFF) { // BMP code point
              codeLen = codeUnits.push(codePoint);
            } else { // Astral code point; split in surrogate halves
              // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
              codePoint -= 0x10000;
              codeLen = codeUnits.push(
                  (codePoint >> 10) + 0xD800,  // highSurrogate
                  (codePoint % 0x400) + 0xDC00 // lowSurrogate
              );
            }
            if (codeLen >= 0x3fff) {
              result += stringFromCharCode.apply(null, codeUnits);
              codeUnits.length = 0;
            }
          }
          return result + stringFromCharCode.apply(null, codeUnits);
        };
        try { // IE 8 only supports `Object.defineProperty` on DOM elements
          Object.defineProperty(String, "fromCodePoint", {
            "value": fromCodePoint, "configurable": true, "writable": true
          });
        } catch(e) {
          String.fromCodePoint = fromCodePoint;
        }
      }(String.fromCharCode));
    },
  };

  window.miracleScripts.init();
})();