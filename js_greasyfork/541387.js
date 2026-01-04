// ==UserScript==
// @name         Holotower Custom Emotes Box
// @namespace    http://holotower.org/
// @version      1.23
// @author       anonymous
// @license      CC0
// @description  Adds a custom emote box to the quick reply form on Holotower
// @icon         https://boards.holotower.org/static/emotes/ina/_tehepero.png
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/541387/Holotower%20Custom%20Emotes%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/541387/Holotower%20Custom%20Emotes%20Box.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Prevent loading the script twice
    if (document.documentElement.dataset.customEmotesBoxLoaded) return;
    document.documentElement.dataset.customEmotesBoxLoaded = "true";

    const emotes_db = {
        categories: [{
            name: "hololive",
            subcategories: [{
                name: "0th Generation",
                id: "holojp0",
                members: [{
                    name: "Tokino Sora", id: "sora", oshimark: "🐻💿", emotes: [
                        "\u306c\u3093\u306c\u30931", "\u306c\u3093\u306c\u30932", "\u306c\u3093\u306c\u30933",
                        "\u306c\u30931", "\u306c\u30932", "\u3044\u304b\u306a\u3044\u3067",
                        "\u6b62\u307e\u3089\u306d\u3048\u305e", "\u305d\u3063\u304b", "\u304a\u307f\u305a",
                        "\u30df\u30cb\u30bd\u30fc\u30c0\u3061\u3083\u3093", "\u3053\u3093\u305d\u3081", "\u304a\u3046\u305f",
                        "\u30bd\u30fc\u30c0\u3061\u3083\u3093", "\u6ce3\u3044\u3061\u3083\u3046", "\u30b8\u30c8\u30fc",
                        "\u3084\u3063\u305f\u30fc", "\u304c\u3093\u3070\u308b\u305e", "\u304a\u304a\u3049",
                        "\u3066\u3093\u3066\u3093\u3066\u3093", "\u30b6\u30ea\u30ac\u30cb\u3061\u3083\u3093",
                        "\u65b0\u306c\u3093\u306c\u3093", "\u306c\u3093\u306c\u3093\u3061\u3083\u3093", "\u30e4\u30e1\u30c6\u30e8\u30fc",
                        "\u3042\u3042\u8ff7\u5b50", "\u3042\u3093\u809d", "\u3089\u3063\u304b\u3061\u3083\u3093",
                        "\u30b9\u30f3\u30b9\u30bf\u30f3\u30d7", "Im\u3073\u3063\u304f\u308a", "\u307e\u3044\u3063\u304b\u3061\u3083\u3093",
                        "\u3042\u3093\u809d\u30da\u30f3\u30e9\u30d4\u30f3\u30af", "\u3042\u3093\u809d\u30da\u30f3\u30e9\u9752",
                        "\u306f\u30441", "\u306f\u30442", "\u306f\u30443", "\u306f\u30444",
                        "Hi1", "Hi2", "Hi3", "Hi4", "\u30ca\u30f3\u30c7\u30e8\u30fc",
                        "\u305d\u3089\u30b6\u30a6\u30eb\u30b9", "\u30a2\u306e\u7d75\u6587\u5b57",
                        "\u304a\u304b\u3048\u308a", "\u304b\u308f\u3044\u3044", "\u305f\u3059\u304b\u308b",
                        "\u304d\u3085\u3063", "\u30ca\u30a4\u30b9", "\u8d64\u3061\u3083\u3093",
                        "\u304b\u3055\u306e\u7d75\u6587\u5b57", "\u308f\u3089\u3046", "\u3082\u3050\u3082\u3050",
                        "\u306f\u304f\u3057\u3085", "\u30b4\u30f3\u30c3", "\u3058\u3083\u3042\u6575\u3060\u306d"
                    ]
                }, {
                    name: "Roboco", id: "roboco", oshimark: "🤖", emotes: [
                        "rbc1ha", "rbc2ro", "rbc3\u30fc\u30fc", "rbc4bo",
                        "rbcHappiness", "rbcCongrats", "rbcThankyou", "rbcTea",
                        "rbcLove", "rbc\u5145\u96fb\u4e2d", "rbcPonkotu", "rbcGlowstick1",
                        "rbcAaaaa", "rbcIdol", "rbcRobosa", "rbcShark",
                        "rbcLol", "rbcQuestion2", "rbcYes", "rbcVomiting",
                        "rbcAngry", "rbcDrool", "rbcNice", "rbcZzz",
                        "rbcLook", "rbc888", "rbcMogumogu", "rbcGlad",
                        "rbcShirohata", "rbcGuruguru", "rbcWow", "rbcSairiumu",
                        "rbcLovee", "rbcPienn", "rbcOmg", "rbcMinus100hp",
                        "rbcHighspec", "rbcLost", "rbcFAQ", "rbc\u306d\u3053\u305f\u3061"
                    ]
                }, {
                    name: "AZKi", id: "azki", oshimark: "⚒️", emotes: [
                        "clap", "AZrium", "floor", "happy", "AZhand", "emo", "kanjyo", "suki",
                        "zenmetsu", "water", "Creating", "real", "felicia", "ICCM", "FFF", "inochi",
                        "AZKi1", "AZKi2", "AZKi3", "AZKi4", "Hitext", "Nyaa", "HYPE", "encore",
                        "tenjo", "kon", "oya", "azki", "ike", "goo", "hoide", "guess",
                        "ouchi", "shima", "doya", "naki", "mic", "red", "blue", "baby"
                    ]
                }, {
                    name: "Sakura Miko", id: "miko", oshimark: "🌸", emotes: [
                        "mikoMiko", "mikoGurasan", "mikoShiitake", "mikoKusa",
                        "mikoSun", "mikoYodare", "mikoPuukusu", "mikoOko",
                        "mikoFap", "mikoHatena", "mikoMikopipipi", "mikoNiko",
                        "mikoNie", "mikoKuou", "mikoPon", "mikoTaiyaki",
                        "mikoHuakyuu", "mikoDoya35P", "mikoBaby", "mikoFxmiko",
                        "mikoNiee", "mikoMiko35p", "mikoNakimiko", "mikoPenmikop",
                        "mikoKouhomikop", "mikoGenkai35p", "mikoGood", "mikoTaiyakimi",
                        "mikoTaiyaki35p", "mikoGara", "mikoGokou", "mikoPikon",
                        "mikoHatena2", "mikoGuru", "mikoDoya", "mikoNade",
                        "mikoAhoge", "mikoCracker", "mikoBuchigire", "mikoTere",
                        "mikoPachi", "mikoPain", "mikoHiki", "mikoNoru",
                        "mikoAcyu", "mikoMaguchi", "mikoMaguchi2", "mikoNyaaa",
                        "mikoStanpmi", "mikoOre", "mikoHazi", "mikoHoko", "mikoKire35P", "mikoMitizure",
                        "mikoInuti"
                    ]
                }, {
                    name: "Hoshimachi Suisei", id: "suisei", oshimark: "☄️", emotes: [
                        "hosi", "kyoumo", "kawaii", "bikkuriB", "otumati",
                        "bikkuriY", "suisei", "kao", "suki", "hate", "orange",
                        "ringo", "tensai", "mic", "ono", "suu", "iii",
                        "tya", "nnn", "haa", "bikkuri", "cute", "awsl"
                    ]
                }]
            }, {
                name: "1st Generation",
                id: "holojp1",
                members: [{
                    name: "Shirakami Fubuki", id: "fubuki", oshimark: "🌽", emotes: [
                        "FBKOruyanke", "FBKKitunejyai", "FBKUmapuha", "FBKJyai",
                        "FBKTobuyanke", "FBKCha", "FBKHappa", "FBKChun",
                        "FBKOcha", "FBKOruyanke1", "FBKOruyanke2", "FBKOruyanke3",
                        "FBKOruyanke4", "FBKOruyanke6", "FBKBikkuri", "FBKKIRARI",
                        "FBKLOVE", "FBKHAJI", "FBKOKO", "FBKYIS",
                        "FBKATU", "FBKHEY2", "FBKANG", "FBKHAMBURGER",
                        "FBKCORN", "FBKCOKE", "FBKQUE", "FBKTAIL",
                        "FBKSEE", "FBKBEAN2", "FBKBEAM3", "FBKNIYARI",
                        "FBKSUKONBU", "FBKTETE", "FBKSAD", "FBKWCB",
                        "FBKLOVE2", "FBKFFF", "FBKIWAU", "FBKINR",
                        "FBKSEKIYUO", "FBKKUROOSHI", "FBKNice", "FBKGURUGURU",
                        "FBKGANBARE", "FBKRYOPI", "FBKALI", "FBKMATANE",
                        "FBKCLAP", "FBKHENTAI", "FBKYABE", "FBKIINE",
                        "FBKLIGHT", "FBKLIGHT2", "FBKTENSAI", "FBKLIGHT3"
                    ]
                }, {
                    name: "Natsuiro Matsuri", id: "matsuri", oshimark: "🏮", emotes: [
                        "\u307e\u3064\u308a\u305d\u3046\u3044\u3046\u3068\u304d\u3082\u3042\u308b",
                        "\u307e\u3064\u308a\u3053\u307e\u304f",
                        "\u307e\u3064\u308a\u3078\u306e\u3082\u3058",
                        "\u307e\u3064\u308a\u307c\u3046\u3066\u304d\u306a",
                        "\u307e\u3064\u308a\u3042\u3052\u3042\u3052",
                        "\u307e\u3064\u308a\u3055\u3052\u3055\u3052",
                        "\u307e\u3064\u308aLOVE",
                        "\u307e\u3064\u308a\u304a\u3053\u3066\u3044\u308b",
                        "\u307e\u3064\u308a\u3057\u3085\u3093",
                        "\u307e\u3064\u308a\u3074\u3087\u3053\u3063",
                        "\u307e\u3064\u308a\u3044\u306e\u3082\u3058",
                        "\u307e\u3064\u308a\u3061\u3044\u3055\u3044\u3064",
                        "\u307e\u3064\u308a\u3057\u3089\u3057\u3044",
                        "\u307e\u3064\u308a\u308f\u3067\u3059\u306d",
                        "\u307e\u3064\u308a\u3061\u3044\u3055\u3044\u3088",
                        "\u307e\u3064\u308a\u865a\u7121\u306a\u611f\u3058",
                        "\u307e\u3064\u308a\u3053\u308c\u306f\u30a2\u30a4\u30c9\u30eb",
                        "\u307e\u3064\u308a\u3061\u304b\u3044\u3088",
                        "\u307e\u3064\u308a\u304a\u3081\u3081\u304d\u3089\u304d\u3089",
                        "\u307e\u3064\u308a\u304a\u3058\u3055\u3093",
                        "\u307e\u3064\u308a\u304b\u304a\u3067\u304b",
                        "\u307e\u3064\u308a\u3089\u3076\u3061",
                        "\u307e\u3064\u308a\u304b\u3093\u3071\u3044\u307e\u3064\u308a\u3059",
                        "\u307e\u3064\u308a\u3072\u3047\u3063",
                        "\u307e\u3064\u308a\u3068\u3046\u3068\u3044",
                        "\u307e\u3064\u308a\u5f85\u3064\u308a\u3059",
                        "\u307e\u3064\u308a\u308f\u3042\u3042\u3042",
                        "\u307e\u3064\u308a\u30b5\u30a4\u30ea\u30a6\u30e0",
                        "\u307e\u3064\u308a\u304c\u3076\u3063",
                        "\u307e\u3064\u308a\u304b\u3093\u3071\u3044\u307e\u3064\u308a",
                        "\u307e\u3064\u308a\u3084\u3093\u3067\u308c",
                        "\u307e\u3064\u308a\u3060\u3044\u3071\u3093",
                        "\u307e\u3064\u308a\u3058\u30fc\u3058\u30fc",
                        "\u307e\u3064\u308a\u304f\u3057\u3083\u307f",
                        "\u307e\u3064\u308a\u3042\u304f\u3073",
                        "\u307e\u3064\u308a\u306f\u306b\u3083",
                        "\u307e\u3064\u308a\u305f\u3044\u3053",
                        "\u307e\u3064\u308a\u5f85\u3064\u308a",
                        "\u307e\u3064\u308a\u308f\u3067\u3059",
                        "\u307e\u3064\u308a\u304f\u3067\u3059",
                        "\u307e\u3064\u308a\u306a\u306a\u3067\u3059",
                        "\u307e\u3064\u308aFight\u307e\u3064\u308a\u3059",
                        "\u307e\u3064\u308a\u3069\u3084\u3063",
                        "\u307e\u3064\u308a\u3082\u3050\u3082\u3050",
                        "\u307e\u3064\u308a\u3070\u304f\u3057\u3087\u3046",
                        "\u307e\u3064\u308a\u3089\u3076\u3089\u3076",
                        "\u307e\u3064\u308a\u3072\u3087\u3053\u3063"
                    ]
                }, {
                    name: "Aki Rosenthal", id: "aki", oshimark: "🍎", emotes: [
                        "AKIROSEJOBZU", "AKIROSESyu", "AKIROSEGoo", "AKIROSEIii",
                        "AKIROSE\u30a2\u30ed\u30fc\u30ca", "AKIROSE\u304a\u3064\u305f\u30fc\u308b", "AKIROSEPEN",
                        "AKIROSERosetai", "AKIROSEGoku", "AKIROSEJyou", "AKIROSEWww",
                        "AKIROSETuta", "AKIROSESuu", "AKIROSEYAA", "AKIROSETUU",
                        "AKIROSEChi", "AKIROSEMaa", "AKIROSETaa", "AKIROSEPinatsu",
                        "AKIROSECHEEER", "AKIROSEWelcome", "AKIROSENICE", "AKIROSEBlessyou",
                        "AKIROSENextSC", "AKIROSEWOW", "AKIROSEAAA", "AKIROSEKKK",
                        "AKIROSEAidesu", "AKIROSERRR", "AKIROSEGGAKI", "AKIROSENewW",
                        "AKIROSELLL", "AKIROSEOOO", "AKIROSEVVV", "AKIROSEEEE",
                        "AKIROSESSS", "AKIROSEIttan", "AKIROSENimopan"
                    ]
                }, {
                    name: "Akai Haato", id: "haato", oshimark: "❤️‍🔥", emotes: [
                        "\u3076\u3072\u3076\u3072", "\u30b5\u30a4\u30ea\u30a6\u30e0YEAH",
                        "\u306a\u3093\u3066\u3053\u3064\u305f", "\u3059\u304d\u3059\u304d",
                        "\u304f\u3055\u304f\u3055",
                        "\u304a\u3064\u304a\u3064\u304a\u3064",
                        "\u3089\u3076\u3089\u3076\u3089\u3076",
                        "\u308d\u308b\u308d\u308b", "\u3042\u308a\u304c", "\u304a\u3081\u3067",
                        "\u3075\u3041\u3044", "\u3068\u3093\u3068\u3093", "\u713c\u304d\u306f\u3042\u3068\u3093",
                        "\u30bf\u30e9\u30f3\u3061\u3083\u307e", "hihi", "\u6700\u5f37\u30a2\u30a4\u30c9\u30eb",
                        "\u306f\u3042\u306f\u3042", "\u3061\u3083\u307e", "\u3061\u3083\u307e\u30fc",
                        "\u3073\u3063\u304f\u308a\u307e\u30fc\u304f", "\u306a\u3046\u306a\u3046",
                        "\u9727\u5439\u304d", "\u3044\u3047\u3044", "\u30da\u30f3\u30e9\u30a4\u30c8",
                        "\u30b7\u30f3\u30d7\u30eb\u3061\u3083\u307e", "\u304a\u308d\u306a\u307f\u3093",
                        "AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG",
                        "HHH", "III", "JJJ", "KKK", "LLL", "MMM", "NNN",
                        "OOO", "PPP", "QQQ", "RRR", "SSS", "TTT", "UUU",
                        "VVV", "WWW", "XXX", "YYY", "ZZZ"
                    ]
                }]
            }, {
                name: "2nd Generation",
                id: "holojp2",
                members: [{
                    name: "Minato Aqua", id: "aqua", oshimark: "⚓️", emotes: [
                        "aqua\u3044\u304b\u308a", "aqua\u30ea\u30dc\u30f3", "aqua\u3042\u304f\u3042\u72c2\u3046",
                        "aqua\u304f\u305d\u3056\u3053\u7406", "aqua\u304f\u305d\u3056\u3053\u89e3",
                        "aqua\u304f\u305d\u3056\u3053\u4f59\u88d5\u306e\u4f59",
                        "aqua\u304f\u305d\u3056\u3053\u4f59\u88d5\u306e\u88d5",
                        "aqua\u5927\u5929\u4f7f\u3042\u304f\u3042", "aqua\u4ef2\u4ef2\u4ef2",
                        "aqua\u826f\u826f\u826f", "aqua\u304f\u304f\u304f", "aqua\u3057\u3057\u3057",
                        "aqua\u3088\u3088\u3088", "aqua\u3063\u3063\u3063",
                        "aqua\u3073\u3063\u304f\u308a\u307e\u30fc\u304f", "aquaNEKO",
                        "aqua\u304a\u3093\u3077", "aqua\u30c8\u97f3\u8a18\u53f7",
                        "aqua\u571f\u4e0b\u5ea7", "aqua\u304a\u3063\u3051\u30fc",
                        "aquaRrr", "aquaUuu", "aquaAaa", "aqua\u30b9\u30b9\u30b9",
                        "aqua\u30a5\u30a5\u30a5", "aqua\u30fc\u30fc\u30fc", "aqua\u3066\u3093\u3066\u3093",
                        "aquaAqua\u30b5\u30a4\u30ea\u30a6\u30e0", "aqua\u60b2\u3057\u3044",
                        "aqua\u30ad\u30e9\u30ad\u30e9", "aquaGoodGame", "aquaPOG", "aqua\u53f0\u30d0\u30f3",
                        "aqua\u3080\u30fc\u3061\u3083\u3093", "aqua\u30b5\u30a4\u30ea\u30a6\u30e0",
                        "aquaIQ5000", "aquaNEKO\u9854", "aqua\u4f11\u61a9\u30bf\u30a4\u30e0",
                        "aqua\u3053\u3093\u3042\u304f\u3042", "aquaGoodLuck",
                        "aqua\u30b9\u30a5\u30fc\u30fc", "aquaSUSHI"
                    ]
                }, {
                    name: "Murasaki Shion", id: "shion", oshimark: "🌙", emotes: [
                        "shionBousi", "shion\u305f\u3059\u304b\u308b", "shionSuyasuya", "shion\u3048\u3089\u3044",
                        "shion\u3069\u3084\u3041", "shion\u3075\u30fc\u3093", "shion\u305f\u3044\u304d",
                        "shionKusa", "shionSuki", "shionSukisuki",
                        "shion\u3066\u3047\u3066\u3047", "shionMoon", "shionStar",
                        "shion\u306a\u3044\u3059", "shion\u306d\u306d\u306d", "shion\u3048\u3048\u3048",
                        "shionHaha", "shion\u30ad\u30ec\u305d\u3046", "shionThankyou",
                        "shion\u304b\u3093\u3057\u3083", "shion\u3050\u3063\u3069",
                        "shion\u304a\u3053\u304a\u3053", "shion\u30ad\u30ec\u308b",
                        "shion\u3059\u30fc\u3063", "shionTea", "shionHeart",
                        "shionHeart\u7d2b", "shion\u30da\u30f3\u30e9\u30a4\u30c8\u30d4\u30f3\u30af",
                        "shion\u30da\u30f3\u30e9\u30a4\u30c8\u7d2b", "shion\u3042\u3042\u3042",
                        "shion\u30fc\u30fc\u30fc", "shion\u3073\u3063\u304f\u308a",
                        "shion\u306f\u3066\u306a", "shion\u3066\u3093\u3055\u3044",
                        "shion\u3078\u3078\u3063", "shion\u3048\u30fc\u3093",
                        "shionGGG", "shion\u30cf\u30cf\u30cf",
                        "shion\u30d0\u30d0\u30d0", "shion\u30cf\u30d0\u5352",
                        "shion\u30c8\u30a4\u30ec", "shion\u305d\u308c\u306f\u305d\u3046",
                        "shion\u5869\u3063\u5b501", "shion\u5869\u3063\u5b502",
                        "shion\u5869\u3063\u5b503", "shion\u5869\u3063\u5b504",
                        "shion\u304a\u3081\u3067\u3068\u3046", "shion\u304a\u3064\u304b\u308c\u3055\u307e",
                        "shion\u3042\u308a\u304c\u3068\u3046", "shion\u30ad\u30ec\u30ad\u30ec",
                        "shion\u3069\u3084\u3063", "shion\u306b\u3083\u3093",
                        "shion\u3074\u3048\u3093", "shion\u3055\u3044\u304d\u3087\u3046"
                    ]
                }, {
                    name: "Nakiri Ayame", id: "ayame", oshimark: "😈", emotes: [
                        "yoo", "smile", "poyoyo", "naa", "kii",
                        "rii", "otunakiri", "kawayo", "konnakiri", "gomeitou",
                        "goodgame", "\u30b5\u30a4\u30ea\u30a6\u30e0", "nice", "pien", "lol",
                        "taiki", "hanya", "oko", "batannkyu", "honyaa",
                        "naki", "happy", "bikkuri", "nakiwarai", "supisupi",
                        "oisii", "new", "jitabata", "pokan", "yeah",
                        "poyoyonaki", "poyoyolove", "nakayosi"
                    ]
                }, {
                    name: "Yuzuki Choco", id: "choco", oshimark: "💋", emotes: [
                        "\u3061\u3087\u3053\u5148\u751f\u3055\u3059\u3061\u3087\u3053",
                        "\u3061\u3087\u3053\u5148\u751f\u304c\u3061\u3043",
                        "\u3061\u3087\u3053\u5148\u751f\u306a\u3044\u3059\u3046",
                        "\u3061\u3087\u3053\u5148\u751f\u30ca\u30a4\u30b9\u30d1",
                        "\u3061\u3087\u3053\u5148\u751f\u3078\u306a\u3061\u3087\u3053",
                        "\u3061\u3087\u3053\u5148\u751f\u3084\u3060\u3084\u3060\u3084\u3060",
                        "\u3061\u3087\u3053\u5148\u751f\u8c46\u307e\u304d\u5c02\u7528",
                        "\u3061\u3087\u3053\u5148\u751f\u3042\u308b\u3088",
                        "\u3061\u3087\u3053\u5148\u751f\u306a\u304b\u306a\u304b\u306b",
                        "\u3061\u3087\u3053\u5148\u751f\u30b5\u30a4\u30ea\u30a6\u30e0\u767d",
                        "\u3061\u3087\u3053\u5148\u751f\u30b5\u30a4\u30ea\u30a6\u30e0\u30d4\u30f3\u30af",
                        "\u3061\u3087\u3053\u5148\u751f\u30b5\u30a4\u30ea\u30a6\u30e0\u767d\u3093",
                        "\u3061\u3087\u3053\u5148\u751f\u3042\u3051\u304a\u3081",
                        "\u3061\u3087\u3053\u5148\u751f\u30af\u30ea\u30b9\u30de\u30b9",
                        "\u3061\u3087\u3053\u5148\u751f\u3053\u3068\u3088\u308d",
                        "\u3061\u3087\u3053\u5148\u751f\u304a\u3044\u3057\u305d\u3046",
                        "\u3061\u3087\u3053\u5148\u751f\u3059\u3054\u3044",
                        "\u3061\u3087\u3053\u5148\u751f\u3088\u3044\u304a\u3068\u3057\u3092",
                        "\u3061\u3087\u3053\u5148\u751f\u305f\u3044\u304d",
                        "\u3061\u3087\u3053\u5148\u751f\u30d7\u30ec\u30bc\u30f3\u30c8\u3042\u3052\u308b",
                        "\u3061\u3087\u3053\u5148\u751f\uff27\uff27\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\uff27\uff27\u6587\u5b57\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u3066\u3047\u3066\u3047\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u5c0a\u3044\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u3059\u3084\u3059\u3084\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u3075\u3047\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u3046\u30fc\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u7b11\u3044\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u304a\u3081\u3067\u3068\u3046\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u8349\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\uff71\uff9e\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u305f\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u3044\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u304d\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u53ef\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u611b\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u5929\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u624d\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u3093\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7",
                        "\u3061\u3087\u3053\u5148\u751f\u52dd\u624b\u66f8\u304d\u30b9\u30bf\u30f3\u30d7"
                    ]
                }, {
                    name: "Oozora Subaru", id: "subaru", oshimark: "🚑", emotes: [
                        "\u30b9\u30d0\u30eb\u308f\u305f\u3042\u3081\u3046\u3055\u304e",
                        "\u30b9\u30d0\u30eb\u30b9\u30d0\u30eb\u30c9\u30c0\u30c3\u30af",
                        "\u30b9\u30d0\u30eb\u30b9\u30d0\u30eb\u80a9\u5e45\u9854",
                        "\u30b9\u30d0\u30eb\u30b9\u30d0\u30eb\u30c9\u30c0\u30c3\u30af\u80a9\u5e45\u9854",
                        "\u30b9\u30d0\u30eb\u8349\u8349\u306e\u8349",
                        "\u30b9\u30d0\u30ebOK\u628a\u63e1",
                        "\u30b9\u30d0\u30eb\u3042\u3058\u3042\u3058\u3042",
                        "\u30b9\u30d0\u30eb\u3042\u3058\u3042\u3058\u3058",
                        "\u30b9\u30d0\u30eb\u3042\u3058\u3042\u3058\u3042\u3058",
                        "\u30b9\u30d0\u30eb\u306a\u3064\u3059\u3070\u308b",
                        "\u30b9\u30d0\u30eb\u304d\u3089\u304d\u3089\u3059\u3070\u308b",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u3073\u3063\u304f\u308a",
                        "\u30b9\u30d0\u30eb\u3042\u3058\u307e\u308b",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u307e\u3058",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u3055\u3044\u308a\u3046\u3080",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u3081\u308d\u3093",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u304a",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u3064",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u3046",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u3042",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u308b",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u306a\u304f",
                        "\u30b9\u30d0\u30eb\u3059\u3070\u308b\u305d\u30fc\u305b\u30fc\u3058",
                        "\u30b9\u30d0\u30eb\u3068\u304f\u3082\u308a",
                        "\u30b9\u30d0\u30eb\u3077\u308c\u3042\u3067\u3059",
                        "\u30b9\u30d0\u30eb\u3077\u308c\u3042\u3067\u3059\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u3046\u308c\u3057\u3044\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u304b\u306a\u3057\u3044\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u3055\u3044\u306a\u308a\u3046\u3080\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u306d\u305f\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u305f\u306e\u3057\u3044\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u304a\u3053\u3063\u305f\u3042\u3072\u308b",
                        "\u30b9\u30d0\u30eb\u305f\u3044\u304d",
                        "\u30b9\u30d0\u30eb\u3073\u3063\u304f\u308a",
                        "\u30b9\u30d0\u30eb\u304a\u3066\u3066",
                        "\u30b9\u30d0\u30eb\u3046\u3043\u3093\u304f",
                        "\u30b9\u30d0\u30eb\u3050\u308b\u3050\u308b",
                        "\u30b9\u30d0\u30eb\u3057\u308f\u3057\u308f",
                        "\u30b9\u30d0\u30eb\u304a\u3069\u308d\u304d",
                        "\u30b9\u30d0\u30eb\u30de\u30b0\u30de\u3059\u3070\u308b",
                        "\u30b9\u30d0\u30eb\u3057\u304f\u3057\u304f",
                        "\u30b9\u30d0\u30eb\u304d\u3089\u304d\u3089",
                        "\u30b9\u30d0\u30eb\u308f\u3044\u308f\u3044",
                        "\u30b9\u30d0\u30eb\u3077\u3093\u3077\u3093",
                        "\u30b9\u30d0\u30eb\u30b9\u30d0\u30ebK",
                        "\u30b9\u30d0\u30eb\u30b9\u30d0\u30ebM",
                        "\u30b9\u30d0\u30eb\u30b9\u30d0\u30ebO"
                    ]
                }]
            }, {
                name: "GAMERS",
                id: "holojpgamers",
                members: [{
                    name: "Ookami Mio", id: "mio", oshimark: "🌲", emotes: [
                        "mio\u30cf\u30c8\u30bf\u30a6\u30ed\u30b9",
                        "mio\u30df\u30aa\u304b\u308f\u306e\u30df\u30aa",
                        "mio\u30df\u30aa\u304b\u308f\u306e\u304b\u308f",
                        "mio\u30df\u30aa\u304b\u308f\u306e\u3044\u3044", "mio\u30bf\u30a4\u30ac\u30fc",
                        "mio\u30bf\u30a4\u30ac\u30fc\u6587\u5b57", "mio\u52a9\u304b\u308b",
                        "mio\u52a9\u304b\u308b\u306e\u304b\u308b",
                        "mio\u5f85\u6a5f\u306e\u5f85", "mio\u5f85\u6a5f\u306e\u6a5f",
                        "mio\u304a\u3064\u307f\u3049\u30fc\u3093\u306e\u304a\u3064",
                        "mio\u304a\u3064\u307f\u3049\u30fc\u3093\u306e\u307f\u3049",
                        "mio\u304a\u3064\u307f\u3049\u30fc\u3093\u306e\u3093",
                        "mio\u30df\u30aa\u306e\u8033", "mio\u30df\u30aa\u3061\u3085\u3093",
                        "mio\u3053\u3093\u3070\u3093\u307f\u3049\u3093\u306e\u3053\u3093",
                        "mio\u3053\u3093\u3070\u3093\u307f\u3049\u3093\u306e\u3070\u3093",
                        "mio\u3072\u308b\u307f\u3049\u3093\u306e\u3072\u308b",
                        "mio\u304f\u3055\u306e\u304f\u3055",
                        "mio\u30df\u30aa\u30d5\u30a1\u306e\u68ee",
                        "mio\u304a\u3081\u304c", "mio\u30b5\u30a4\u30ea\u30a6\u30e0",
                        "mio\u308f\u304a\u30fc\u3093", "mio\u307f\u304a\u30fc\u3093",
                        "mio\u30bf\u30a4\u30ac", "mio\u3073\u3063\u304f\u308a\u30bf\u30a4\u30ac",
                        "mio\u304a\u306f\u307f", "mio\u30ca\u30a4\u30b9",
                        "mio\u3068\u307e\u305f\u30c8\u30de\u30c8",
                        "mio\u305f\u308f\u3061\u3083\u3093", "mio\u30df\u30aa\u306b\u3083\u3093",
                        "mio\u30df\u30aa\u30ac\u30fc\u30f3", "mio\u30df\u30aa\u30cf\u30fc\u30c8",
                        "mio\u30df\u30aa\u6ce3", "mio\u3046\u3061\u3060\u3088\u30fc",
                        "mio\u30df\u30aazzz", "mio\u30df\u30aa\u308f\u30fc\u3044",
                        "mio\u30a6\u30af\u30ec\u30ec", "mio\u30df\u30aa\u3057\u3083",
                        "mio\u304e\u3083\u30fc", "mio\u3063\u3066\u30b3\u30c8",
                        "mio\u3093\u3093\u3041", "mioPON", "mio\u9b42\u51fa\u3066\u308b",
                        "mio\u30d1\u30c1\u30d1\u30c1\u30d1\u30c1",
                        "mio\u30df\u30aa\u30d5\u30a1\u30b5\u30a4\u30ea\u30a6\u30e0",
                        "mio\u30d5\u30d6\u30df\u30aa\u30c0\u30a4\u30b9\u30ad",
                        "mio\u30c1\u30af\u30ce\u30ab\u30f3\u30b8",
                        "mio\u30ab\u30df\u30ce\u30ab\u30f3\u30b8",
                        "mio\u30aa\u30aa\u30ce\u30ab\u30f3\u30b8",
                        "mio\u3057\u3083\u3057\u3083\u3057\u3083"
                    ]
                }, {
                    name: "Nekomata Okayu", id: "okayu", oshimark: "🍙", emotes: [
                        "\u3082\u3050\u3082\u3050", "\u3054\u3061\u3054\u3061",
                        "\u305d\u308c\u306f\u8349",
                        "\u30b7\u30f3\u30d7\u30eb\u304a\u306b\u304e\u308a",
                        "\u304a\u306b\u304e\u308a\u304a\u304b\u3086", "\u30c9\u30c3\u30c8\u304a\u304b\u3086",
                        "\u30c1\u30e5\u30fc\u30ea\u30c3\u30d7\u304a\u304b\u3086",
                        "\u304b\u3086\u30c1\u30e5\u30f3", "\u30ef\u30e9\u30d3\u30fc",
                        "\u3042\u3089\u3089", "\u52dd\u3061\u732b",
                        "\u3066\u307e\u306b\u3083\u3093\u6b69\u304f",
                        "\u3066\u307e\u306b\u3083\u3093\u5bdd\u308b",
                        "\u3066\u307e\u306b\u3083\u3093\u53bb\u308b",
                        "\u30b5\u30f3\u30b0\u30e9\u30b9", "\u738b\u69d8\u306d\u3053",
                        "\u65e9\u53e3\u304a\u304b\u3086", "\u8003\u3048\u3066\u308b",
                        "\u6065\u305a\u304b\u3057\u3044", "\u3058\u30fc\u3093",
                        "\u5bdd\u308b\u304a\u304b\u3086",
                        "\u30d3\u30fc\u30e0\u306e\u30d3\u30fc\u30e0",
                        "\u30d3\u30fc\u30e0", "\u9023\u884c\u304a\u304b\u3086",
                        "\u9023\u884c\u304a\u306b\u304e\u308a\u3083\u30fc",
                        "\u6abb\u306e\u4e2d\u306e\u304a\u306b\u304e\u308a\u3083\u30fc",
                        "\u5012\u308c\u308b\u304a\u306b\u304e\u308a\u3083\u30fc",
                        "\u708e\u306e\u304a\u306b\u304e\u308a\u3083\u30fc",
                        "\u3054\u98ef\u5f85\u6a5f\u304a\u306b\u304e\u308a\u3083\u30fc",
                        "\u8d70\u308b\u304a\u306b\u304e\u308a\u3083\u30fc",
                        "\u30b5\u30a4\u30ea\u30a6\u30e0", "\u30e1\u30b9\u304a\u304b\u306b\u3083\u3093",
                        "\u3046\u3048\u30fc\u3093", "\u3053\u307e\u3063\u30c1\u30f3\u30b2\u30f3\u83dc",
                        "\u3053\u3058\u308d\u3046", "\u3042\u3061\u3083\u3061\u3083",
                        "\u6109\u60a6\u30b0\u30ec\u30fc\u30d7", "\u304a\u304b\u306b\u3083\u3093",
                        "\u305d\u308c\u306f\u672c\u5f53", "\u305d\u308c\u306f\u5618",
                        "\u304c\u307e\u3093", "\u304d\u3089\u304d\u3089", "\u306a\u3067\u306a\u3067",
                        "\u306f\u30fc\u3068", "\u308a\u3087\u3046\u304b\u3044", "\u306d\u3053\u307e\u308b",
                        "\u306d\u3053\u304a\u3057\u308a", "\u3074\u3048\u3093", "\u3076\u306b\u3044",
                        "\u3082\u3050\u3082\u3050\u3082\u3050", "\u3042\u304f\u3073",
                        "\u304b\u3042\u3042", "\u3075\u308c\u30fc\u3075\u308c\u30fc",
                        "\u3050\u308f\u308f\u3063"
                    ]
                }, {
                    name: "Inugami Korone", id: "korone", oshimark: "🥐", emotes: [
                        "koroneIiyubi", "koroneDameyubi", "koroneHosoinu", "koroneHutoinu",
                        "koroneInugoya", "koroneHone", "koroneListener1", "koroneListener2",
                        "koroneListener3", "koroneGyoi1", "koroneGyoi2", "koroneSibakiage1",
                        "koroneSibakiage2", "koronePunching", "koroneHanakayu", "koronePkpk",
                        "koroneGekipkpk", "koroneTerepkpk", "koroneMoziyu", "koroneMozibi",
                        "koroneMoziyubi", "koroneMoziko", "koroneMoziro", "koroneMozine",
                        "koroneMozixo", "koroneMozixa", "koroneMozixyo", "koroneMozio",
                        "koroneMozibou", "koroneMozisi", "koroneMozixe", "koroneMozixi",
                        "koroneMoziwowwow", "koroneMozibibi", "koroneMozihate", "koronePsy01a",
                        "koronePsy02a", "koronePsy01b", "koronePsy02b", "koronePsy01c",
                        "koronePsy02c", "koronePan", "koroneHirameki", "koroneWaaa",
                        "koroneMimidokan", "koroneAtu1", "koroneAtu2", "koroneNahone1",
                        "koroneNahone2", "koroneNanone3", "koroneNahone4", "koroneWakarankao",
                        "koroneHorayo", "koroneKashiko", "koroneTanosii1",
                        "koroneKanasii1", "koroneTanosii2", "koroneKanasii2", "koroneEmt",
                        "koroneTuriikun"
                    ]
                }]
            }, {
                name: "3rd Generation",
                id: "holojp3",
                members: [{
                    name: "Usada Pekora", id: "pekora", oshimark: "👯‍♀️", emotes: [
                        "peko\u307a\u3054\u3049", "peko\u7345\u3005\u7530",
                        "peko\u307a\u30fc\u3053\u307a\u3053\u307a\u3053",
                        "peko\u307a\u3053\u3082\u3093", "peko\u306f\u3066\u306a",
                        "peko\u30b5\u30a4\u30ea\u30a6\u30e0", "pekoPeko",
                        "peko\u306b\u3093\u3058\u3093", "peko\u3058\u30fc\u3063",
                        "peko\u304d\u3089\u304d\u3089", "peko\u304a\u30fc\u3063",
                        "peko\u30a6\u30a3\u30f3\u30af", "peko\u306b\u3084\u30fc",
                        "peko\u7126\u308a\u9854", "peko\u306e\u30fc\u307f\u305d\u30fc",
                        "peko\u30b0\u30e9\u30b5\u30f3", "peko\u307a\u3053\u3063",
                        "peko\u307e\u3093\u3063", "peko\u304d\uff54\u3089",
                        "peko\u3042\u306e\u3042", "peko\u308f\u30fc\u3051",
                        "peko\u3073\u3063\u304f\u308a\u307e\u30fc\u304f",
                        "peko\u306f\u3066\u306a\u307e\u30fc\u304f",
                        "peko\u3053\u30fc\u3046\u3093", "peko\u3053\u306b\u3061\u308f\u30fc",
                        "peko\u30b3\u30cb\u30c1\u30ef\u30fc",
                        "peko\u30bd\u30e6\u30b3\u30c8\u30fc",
                        "peko\u30cb\u30b3\u30c3", "peko\u30c9\u30f3\u30c3",
                        "peko\u307a\u3053\u3049", "peko\u307a\u3053\u30fc\u3093",
                        "peko\u307a\u3053\u30fc\u30fc\u30fc", "peko\u307a\u3053\u3053",
                        "peko\u307a\u3053\u30fc", "pekoYOYO", "peko\u30ad\u30e9\u30ad\u30e9",
                        "peko\u304c\u3093\u3070\u308c\u304c\u3093\u3070\u308c",
                        "peko\u30c9\u30f3\u3061\u3083\u30931",
                        "peko\u30c9\u30f3\u3061\u3083\u30932",
                        "peko\u30c9\u30f3\u3061\u3083\u30933",
                        "peko\u571f\u4e0b\u5ea7", "peko\u304d\u3083\u30fc"
                    ]
                }, {
                    name: "Shiranui Flare", id: "flare", oshimark: "🔥", emotes: [
                        "oiii", "way", "rakka", "nuinonu", "nuinoi",
                        "tee", "kusa", "what", "lol", "nice",
                        "ohhh", "omg", "otu", "kon", "pon",
                        "mojiP", "mojiO", "mojienu", "mojie", "mojiten",
                        "shuku", "mojiga", "mojin", "nobashi", "Cait2",
                        "0241", "0242", "0243", "0244", "0245",
                        "0246", "0247", "0248", "0249", "02410",
                        "02411", "02412", "02413", "02414", "02415",
                        "02416", "goo", "shock", "nun", "kanpai",
                        "doki", "song", "cat", "exc", "hon",
                        "saxtu", "piyo", "tere", "atu"
                    ]
                }, {
                    name: "Shirogane Noel", id: "noel", oshimark: "⚔", emotes: [
                        "\u306f\u3066\u306a", "\u307f\u3066\u308b", "\u306a\u307f\u3060",
                        "\u3042\u3042\u3042", "\u3073\u3083\u3073\u3083", "\u3081\u3044\u3059",
                        "\u3072\u304b\u308b\u307c\u3046", "\u3072\u304b\u308b\u307c\u3046\u307c\u3046",
                        "\u307e\u307e\u307e", "\u3059\u308b\u3059\u308b", "\u305f\u308d\u3046",
                        "\u304b\u308f\u3044\u3044", "\u3054\u307f\u3076\u304f\u308d",
                        "\u304d\u304b\u3093\u3052\u3093\u3066\u3044", "\u3051\u3064\u3069\u308a",
                        "\u3051\u3064\u3069\u308a\u3068\u3046\u3081\u3044", "\u307e\u3063\u3059\u308b",
                        "\u307e\u308a\u3093", "\u308a\u308a\u308a", "\u307a\u3093\u307a\u3093",
                        "\u307f\u308b\u304f", "\u306e\u3048\u308b\u3067\u3089\u3063\u304f\u3059",
                        "\u3046\u3070\u304a\u3058",
                        "\u3044\u307e\u3058\u306a\u308a\u30fc\u3057\u3083\u3069\u3046",
                        "\u304f\u308a\u305f\u308d\u3046", "\u3048\u304c\u304a",
                        "\u3042\u3073\u3083\u3073\u3083", "\u306e\u307b\u307b\u3093",
                        "\u3054\u3046\u304d\u3085\u3046", "\u3042\u305b\u308b",
                        "\u307d\u304b\u30fc\u3093", "\u3046\u3057\u3055\u3093",
                        "\u304f\u3055\u304f\u3055", "\u3046\u3057\u3055\u3076\u3093",
                        "\u306a\u3093\u3060\u3053\u308c", "\u3044\u3082\u3080\u3057",
                        "\u307e\u3067\u3042\u308b\u3075\u3061", "\u304a\u3064\u304b\u308c",
                        "\u304a\u3064\u304a\u3064", "\u3053\u3093\u3053\u3093",
                        "\u307e\u307e\u307e\u307e", "\u3059\u308b\u306b",
                        "\u304a\u306f\u304a\u306f", "\u307d\u307d\u307d\u307d",
                        "\u305f\u305f\u305f\u305f", "\u308d\u3046\u308d",
                        "\u3066\u3047\u3066\u3047", "\u3044\u3084\u3089\u3057",
                        "\u304a\u3046\u3048\u3093", "\u304b\u3093\u3071\u3044",
                        "\u3082\u3061\u3064\u3051", "\u306a\u3044\u3059",
                        "\u3055\u3093\u307e"
                    ]
                }, {
                    name: "Houshou Marine", id: "marine", oshimark: "🏴‍☠️", emotes: [
                        "\u308f\u30fc\u3044", "\u6ce3\u3051\u308b", "\u30c9\u30f3\u30c9\u30f3",
                        "\u6674\u308c\u7740", "\u307e\u3056\u3044", "\u30af\u30e9\u30d4\u30ab",
                        "\u30d8\u30d6\u30f3", "\u3066\u3078\u307a\u308d", "\u307f\u3064\u3072\u3053",
                        "\u30eb\u30fc\u30ca\u30de\u30ea\u30f3", "\u3069\u304f\u308d\u304f\u3093",
                        "\u306f\u305f\u3060\u3088", "\u3044\u3061\u307f", "\u3074\u3048\u3093",
                        "\u308d\u308a\u307e\u308a\u3093", "\u306a\u3093\u3060\u308f",
                        "\u5b66\u751f\u30de\u30ea\u30f3", "\u3046\u3081\u3046\u3081",
                        "\u306e\u308a\u306e\u308a", "\u3058\u3068\u3081",
                        "\u30b2\u30fc\u30df\u30f3\u30b0\u5727", "\u3050\u308b\u3050\u308b",
                        "\u30e4\u30af\u30de\u30ea\u30f3", "\u3059\u3084\u3059\u3084",
                        "KAN", "\u6c88\u6ca1\u8239\u9577",
                        "\u30cf\u30fc\u30c8", "\u3077\u308b\u3077\u308b",
                        "\u306f\u3042\u306f\u3042", "\u304d\u3089\u304d\u3089",
                        "78\u6b73", "\u3044\u306e\u308a",
                        "\u3073\u3063\u304f\u308a", "\u3042\u3072\u308b",
                        "\u30b5\u30a4\u30b3\u30ed\u30ea", "\u30de\u30ea\u30eb\u30fc\u30ca",
                        "\u306f\u3066\u306a", "AhoyA", "AhoyH", "AhoyO", "AhoyY",
                        "\u304d\u3063\u3064\u306e\u304d", "\u304d\u3063\u3064\u306e\u3064",
                        "\u304d\u3063\u3064\u306e\u5927\u304d\u3044\u3064",
                        "\u306f\u3066\u306a\u30de\u30fc\u30af",
                        "\u3073\u3063\u304f\u308a\u30de\u30fc\u30af",
                        "\u30e8\u30fc\u30bd\u30ed\u30fc\u306e\u30e8",
                        "\u30e8\u30fc\u30bd\u30ed\u30fc\u306e\u30fc",
                        "\u30e8\u30fc\u30bd\u30ed\u30fc\u306e\u30bd",
                        "\u30e8\u30fc\u30bd\u30ed\u30fc\u306e\u30ed",
                        "\u8349\u306e\u5b57", "\u82e5\u306e\u5b57",
                        "\u30e0\u30e9\u30e0\u30e9\u306e\u30e0",
                        "\u30e0\u30e9\u30e0\u30e9\u306e\u30e9"
                    ]
                }]
            }, {
                name: "4th Generation",
                id: "holojp4",
                members: [{
                    name: "Amane Kanata", id: "kanata", oshimark: "💫", emotes: [
                        "kanataHey", "kanataWakka", "kanataHaa", "kanataDokkoisyo",
                        "kanataSoran", "kanataDodo", "kanataKonn", "kanataKanata",
                        "kanataOtsu", "kanataKana", "kanataTasoo", "kanataKusa",
                        "kanataTen", "kanataShi", "kanataLightblue", "kanataLightred",
                        "kanataSuki", "kanataTouto", "kanataGenka", "kanataGyu",
                        "kanataYarasii", "kanataJya", "kanataNeeyo", "kanataPchan",
                        "kanataGorilla", "kanataHamuo", "kanataYuruhamu", "kanataOnegai",
                        "kanataSupadari", "kanataKiran", "kanataKireteru", "kanataSai",
                        "kanataMaa", "kanataCho", "kanataKakaka", "kanataNanana",
                        "kanataTatata", "kanataSososo", "kanataOversea", "kanataBro",
                        "kanataGgg", "kanataOoo", "kanataDdd", "kanataOoba",
                        "kanataBabao", "kanataKaka2", "kanataNono", "kanataDan",
                        "kanataNnn", "kanataDjupao", "kanataTasochan", "kanataUpaolight"
                    ]
                }, {
                    name: "Tsunomaki Watame", id: "watame", oshimark: "🐏", emotes: [
                        "\u306d\u3047\u306f\u3066\u306a",
                        "\u30c0\u30fc\u30af\u30c6\u30fc\u30de\u7528\u306e\u30c9",
                        "\u306b\u3063\u3053\u308a\u308f\u305f\u3081\u3044\u3068",
                        "\u30d1\u30ea\u30d4\u308f\u305f\u3081\u3044\u3068",
                        "\u3055\u6587\u5b57", "\u3093\u6587\u5b57", "\u3063\u6587\u5b57",
                        "\u30b0\u30fc\u30fc", "\u30c1\u30e7\u30ad", "\u30d1\u30fc\u30fc",
                        "\u30ca\u30f3\u30d0\u30fc1", "\u306b\u3053\u306b\u3053",
                        "\u306f\u3066\u306a", "\u3046\u30fc\u3093", "\u30c9\u30e4\u9854",
                        "\u6850\u751f\u30b3\u30b3\u7d75",
                        "\u30ac\u30cf\u30cf", "\u9ec4\u30da\u30f3\u30e9",
                        "\u6843\u30da\u30f3\u30e9", "\u9752\u30da\u30f3\u30e9",
                        "\u8d64\u30da\u30f3\u30e9", "\u7dd1\u30da\u30f3\u30e9",
                        "\u7d2b\u30da\u30f3\u30e9", "Wow", "oh\u3073\u3063\u304f\u308a",
                        "\u30c0\u30d6\u30eb", "\u304a\u30fc\u30fc", "zzZ",
                        "\u30d1\u30ea\u30d4", "Shougun", "\u30d1\u30c1\u30d1\u30c1",
                        "HAHA", "\u307a\u3063\u307a", "\u30a2\u30f3\u30b3\u30fc\u30eb",
                        "\u8349\u304f\u3055", "\u81ed\u304f\u3055", "lol",
                        "yummy", "\u306f\u3088\u306d\u308d", "\u8a95\u751f\u65e5\u30b1\u30fc\u30ad",
                        "\u30ac\u30f3\u30ae\u30de\u30ea", "\u5727\u3042\u3064", "\u30cf\u30b5\u30df",
                        "\u5b09\u3057\u6d99", "\u60b2\u3057\u6d99", "\u308f\u305f\u3081\u30c0\u30f3\u30b9",
                        "\u308f\u305f\u3081\u3044\u3068\u30c0\u30f3\u30b9",
                        "\u5c02\u7528\u30cf\u30fc\u30c8", "\u30bf\u30f3\u30d0\u30ea\u30f3",
                        "\u30c9\u30e9\u30e0", "\u30d9\u30fc\u30b9", "\u308f\u305f\u304a\u3058",
                        "\u306a\u3093\u3066", "\u30ad\u30c3\u6012"
                    ]
                }, {
                    name: "Tokoyami Towa", id: "towa", oshimark: "👾", emotes: [
                        "\u3066\u3093Q\u30b9\u30bf\u30f3\u30d7", "\u3084\u3063\u3074\u30fc",
                        "\u30c8\u30ef\u69d8\u30ba\u30fc\u30f3", "\u30c8\u30ef\u69d8\u3044\u3048\u30fc\u3044",
                        "\u30d3\u30d3\u30d5\u30ec\u30d5\u30ec", "\u30c8\u30ef\u69d8\u3073\u3063\u304f\u308a",
                        "\u30c8\u30ef\u69d8\u30ad\u30e9\u30ad\u30e9", "FCOD", "goodgame",
                        "\u30c8\u30ef\u6587\u5b57", "\u8349\u3067\u3059", "\u3067\u3059\u3088", "GLHF",
                        "\u3055\u3044\u3053\u3046", "\u3055\u3044\u3066\u3044",
                        "\u30c8\u30ef\u69d8\u53f0\u30d1\u30f3", "\u30c8\u30ef\u69d8\u6307\u5dee\u3057",
                        "YAB", "YAB2", "\u864e\u592a\u90ce", "GOOD", "\u30e0\u30ad\u30fc",
                        "\u30d3\u30d3\u30cf\u30fc\u30c8", "\u30de\u30a4\u30ca\u30b9\u30c6\u30f3", "wel", "come",
                        "\u3060\u305b\u3063", "\u3052\u3093\u304d", "\u30a8\u30a4\u30c1\u30d4\u30fc",
                        "\u3077\u3045\u3045", "\u3086\u3063\u304f\u308a", "goodgame2", "psyllium1", "psyllium2",
                        "psyllium3", "psyllium4", "psyllium5", "psyllium6", "psyllium7", "psyllium8",
                        "psyllium9", "psyllium10", "psyllium11", "psyllium12", "bikkuri",
                        "kusa", "NICE", "onpu", "question", "ryoukai", "sugoi", "taiki",
                        "towagg", "towant", "akubi", "towaatensai", "towa"
                    ]
                }, {
                    name: "Himemori Luna", id: "luna", oshimark: "🍬", emotes: [
                        "\u308b\u30fc\u306a\u306a", "\u305f\u3093\u3093", "\u3072\u3081\u3081",
                        "\u3055\u307e\u307e", "\u3057\u304b\u304b", "\u306e\u306e\u306e",
                        "\u304b\u304b\u304b", "\u3061\u3044\u3044", "CIJ",
                        "LTL", "\u3093\u3093\u3093", "\u306a\u306a\u306a", "\u3042\u3042\u3042",
                        "\u3089\u3089\u3089", "\u306f\u3044\u306f\u3044",
                        "\u3057\u3085\u304d\u304d", "\u3048\u3063\u3078\u3093",
                        "\u304b\u308f\u3044\u3044", "\u3061\u3085\u30fc\u30fc",
                        "\u3048\u3089\u3044", "GENIUS", "JESUS", "NOBABY", "NOBABYNANO",
                        "\u30e1\u30f3\u30d0\u30fc\u30ba\u30ab\u30fc\u30c9",
                        "\u30da\u30f3\u30e9\u30a4\u30c8\u30d4\u30f3\u30af",
                        "\u30da\u30f3\u30e9\u30a4\u30c8\u30d6\u30eb\u30fc",
                        "\u304a\u308b\u308b", "\u3088\u3088\u3088", "\u304e\u3087\u3044",
                        "\u3082\u3063\u3068", "\u30da\u30f3\u30e91", "\u30da\u30f3\u30e92",
                        "\u30da\u30f3\u30e93", "\u30da\u30f3\u30e94", "\u30da\u30f3\u30e95",
                        "\u30da\u30f3\u30e96", "\u30da\u30f3\u30e97", "\u30da\u30f3\u30e98",
                        "\u30da\u30f3\u30e99", "\u30da\u30f3\u30e910", "\u30da\u30f3\u30e911",
                        "\u3084\u3084\u3084", "\u308c\u308c\u308c", "\u307e\u3093\u306a\u304b",
                        "\u3061\u3061\u3061", "\u3066\u3093\u3093", "\u3075\u3075\u3075"
                    ]
                }]
            }, {
                name: "5th Generation",
                id: "holojp5",
                members: [{
                    name: "Yukihana Lamy", id: "lamy", oshimark: "☃️", emotes: [
                        "\u3055\u3093\u3063", "\u3070\u3076\u3070\u3076", "\u4e7e\u676f\u3063",
                        "\u3088\u3057\u3088\u3057", "\u306d\u306d\u3061\u3083\u3093", "\u304a\u307e\u308b\u3093",
                        "\u3057\u3057\u308d\u3093", "\u30e9\u30df\u30a3", "\u304a\u306f\u3089\u307f",
                        "\u304a\u3064\u3089\u307f", "\u3089\u307f\u3089\u307f", "\u3053\u3093\u3089\u307f",
                        "\u3060\u3044\u3075\u304f01", "\u3048\u3089\u3044\u306e\u3048", "\u3048\u3089\u3044\u306e\u3089",
                        "\u3048\u3089\u3044\u306e\u3044", "\u3082\u3050MOGU", "\u306f\u30fc\u3068",
                        "\u3081\u3093\u306b\u3083\u3093", "\u306a\u3041\u30fc\u309301", "\u306a\u3041\u30fc\u309302",
                        "\u308f\u308f\u308f\u3042\u304a", "\u308f\u308f\u308f\u3042\u304b",
                        "\u3073\u3063\u304f\u308a\u307e\u30fc\u304f", "\u3060\u3044\u305d\u3046\u3052\u3093",
                        "\u3072\u3043\u30fc\u3093", "\u306a\u3044\u3059\u304601",
                        "\u306a\u3044\u3059\u304602", "\u3069\u3063\u3063", "\u30b9\u30e9\u30c3\u30b7\u30e501",
                        "\u30b9\u30e9\u30c3\u30b7\u30e502", "\u3088\u308d\u3053\u3073\u30e9\u30df\u30a3",
                        "\u304b\u306a\u3057\u307f\u30e9\u30df\u30a3", "\u304a\u3053\u30e9\u30df\u30a3",
                        "\u3088\u3063\u3071\u30e9\u30df\u30a3", "\u3057\u3057\u3089\u307f",
                        "\u307d\u308b\u3089\u307f", "\u306d\u306d\u3089\u307f", "\u6587\u5b5701",
                        "\u6587\u5b5702", "\u6587\u5b5703", "\u6587\u5b5704",
                        "\u96ea\u6c11\u3055\u309301", "\u96ea\u6c11\u3055\u309302",
                        "stamp01", "stamp02", "stamp03", "stamp04", "stamp05", "stamp06",
                        "\u30b5\u30a4\u30ea\u30a6\u30e0\u9752", "\u3064\u3063\u3066\u3047"
                    ]
                }, {
                    name: "Momosuzu Nene", id: "nene", oshimark: "🍑🥟", emotes: [
                        "penlight1", "penlight2", "penlight3", "penlight4", "flower1",
                        "flower2", "kon", "mata", "nene", "ssss",
                        "uuuu", "pppp", "eeee", "rrrr", "hhhh",
                        "yyyy", "nenene", "chi", "fafafa", "girafafa",
                        "kabuto", "orange", "\u30c9\u30c3\u30c3", "kusa",
                        "punch", "enen", "hello", "hola",
                        "nekko", "chuface", "heart1", "heart2",
                        "\u30de\u30a4\u30af\u3061\u3083\u3093",
                        "nenechigod", "hakusyu", "NENE1", "NENE2", "NENE3", "NENE4",
                        "NENE5", "NENE6", "NENE7", "hihi",
                        "nenenene", "popopopo", "rararara", "bobobo",
                        "\u30a2\u30b6\u30e9\u30b7", "KUMA",
                        "smileN1", "smileN2", "smileN3", "cryN3", "giragira"
                    ]
                }, {
                    name: "Shishiro Botan", id: "botan", oshimark: "♌", emotes: [
                        "ssrb\u307d\u3044\u3063", "ssrb\u3089\u307f\u3043", "ssrb\u306d\u306d\u3061",
                        "ssrb\u307c\u305f\u3093", "ssrb\u307d\u308b\u304b", "ssrbGggg",
                        "ssrb\u3089\u3089\u3089", "ssrb\u3044\u3044\u3044", "ssrb\u304a\u304a\u304a\u304a",
                        "ssrb\u30fc\u30fc\u30fc", "ssrb\u3093\u3093\u3093\u3093",
                        "ssrb\u308f\u3089\u3046\u82f1\u8a9e", "ssrbIQ3", "ssrbIQ200",
                        "ssrb\u306f\u3066\u306a", "ssrb\u306d\u3080\u3044", "ssrbGgwp", "ssrbGlhf",
                        "ssrb\u304f\u3055\u3055", "ssrb\u3081\u3081\u3081", "ssrb\u3084\u3079\u3079",
                        "ssrbYAGOO01", "ssrbYAGOO02", "ssrbYAGOO03", "ssrbGangimari",
                        "ssrbAtu", "ssrbTenko", "ssrbOru", "ssrbOran",
                        "ssrb666g", "ssrbPiron", "ssrbSsrb01", "ssrbSsrb02", "ssrbSsrb03",
                        "ssrbBossan", "ssrbTyakkazumi", "ssrbTyakka2", "ssrbSsrbgray",
                        "ssrbSsrbwhite", "ssrbSsrbcamo", "ssrbPenlight", "ssrbSsrbpen1",
                        "ssrbBikkuri", "ssrbGomenppu", "ssrbTamasii", "ssrbNadenade",
                        "ssrbBom01", "ssrbBom02", "ssrbOiwai", "ssrbTibesuna",
                        "ssrbSsrbtika", "ssrbSsrbbkouji", "ssrbErai", "ssrbErai2"
                    ]
                }, {
                    name: "Omaru Polka", id: "polka", oshimark: "🎪", emotes: [
                        "heart", "omaru", "oruka", "ahoge", "yagoo", "bel",
                        "ooo", "maa", "ruu", "poo", "kaa", "waa",
                        "tsu", "heta", "hera", "key", "kaaa", "melody",
                        "polka", "www", "nenenoe1", "nenenoe2", "nenenoe3", "nenenoe4",
                        "pass", "bbsb", "pen1", "pen2", "banana", "pen3",
                        "pen4", "pen5", "pen6", "pen7", "pen8", "star",
                        "hii", "haai", "iei", "holo", "fuwa",
                        "sus", "sss", "zain", "aaaa", "iiii",
                        "ltu", "yami", "densetsu", "oru", "oran",
                        "hands", "kazoo", "haa"
                    ]
                }]
            }, {
                name: "6th Generation",
                id: "holojp6",
                members: [{
                    name: "La+ Darkness", id: "laplus", oshimark: "🛸💜", emotes: [
                        "200IQ", "\u30ab\u30e9\u30b9", "\u30a2\u30bb\u30a2\u30bb",
                        "YMD", "\u306a\u307f\u3060", "\u3057\u3093\u306e\u305e\u3046",
                        "\u304a\u3082\u308d\u304a\u304a", "\u306f\u3066\u306a", "\u3064\u3088\uff57",
                        "\u304a\u30a4\u30aa\u30a4\u30aa\u30a4", "\u3086\u308b\u3059",
                        "\u52dd\u5229\u306e\u30b9\u30bf\u30f3\u30d7",
                        "\u6557\u5317\u306e\u30b9\u30bf\u30f3\u30d7", "\u30c9\u30e4\u30ac\u30aa",
                        "\u30a4\u30ab\u30ea\u30ce\u30ab\u30aa", "\u6012\u308a\u306e",
                        "\u3055\u3089\u3070", "\u3058\u3068\u3049", "\u3044\u3044\u58f0",
                        "\u3074\u3048\u3093", "\u304c\u304a\u304a", "\u3052\u30fc\u307f\u3093\u3050",
                        "\u304e\u3080\u306e\u304e", "\u304e\u3080\u306e\u3080",
                        "\u3075\u3068\u304d\u3083\u304f",
                        "\u307f\u304e\u3064\u306e", "\u3072\u3060\u308a\u3064\u306e",
                        "\u306b\u3053\u306b\u3053", "\u3044\u304b\u308a",
                        "\u306a\u304d\u3060\u3088", "\u304a\u305f\u304f",
                        "\u304a\u305f\u304f\u3060\u3088", "\u3089\u3063\u3057\u3085",
                        "\u53f7\u6ce3\u304a\u305f\u304f", "\u7167\u308c\u304a\u305f\u304f",
                        "\u3058\u3082\u3068", "\u3076\u305f\u3055\u3093"
                    ]
                }, {
                    name: "Takane Lui", id: "lui", oshimark: "🥀", emotes: [
                        "Psyllium", "kirakira", "koltu", "PON", "EYE",
                        "oko", "doya", "yaba", "cry", "hatena",
                        "ganmo", "sneeze", "goodgame", "ahahaha",
                        "shock", "water", "socool", "taka",
                        "kusa", "mojido", "naruhodo", "mojiha",
                        "mojie", "mojikara", "bikkuri", "hatena2",
                        "tubikkuri", "oha", "otsu", "kon",
                        "mojita", "mojika", "mojine", "mojiru",
                        "mojii", "KPKP", "matte", "mojima",
                        "mojiwa", "mojisu", "atsu", "ehhen",
                        "mogu", "yeah", "hahha", "flag", "iikanji",
                        "haa", "sasului", "luitomooko", "nne",
                        "toriatama", "gomenne"
                    ]
                }, {
                    name: "Hakui Koyori", id: "koyori", oshimark: "🧪", emotes: [
                        "\u308f\u30fc\u3044", "\u3069\u3084\u3041", "\u308f\u30fc\u3093",
                        "\u30b5\u30a4\u30ea\u30a6\u30e0\u30d4\u30f3\u30af", "LOVE",
                        "\u30b5\u30a4\u30ea\u30a6\u30e0\u30b3\u30e8\u30fc\u30c6",
                        "\u5c3b\u5c3e\u632f\u308b\u30b3\u30e8\u30fc\u30c6",
                        "\u3053ko", "\u3088yo", "\u308ari", "\u3093nn", "\u8349lol",
                        "\u3055\u3059sus", "\u308f\u304a\u30fc\u3093",
                        "\u3093\u306d\u3063", "\u304b\u3064\u30c3", "QED",
                        "\u30b5\u30a4\u30ea\u30a6\u30e0\u30b0\u30ea\u30fc\u30f3",
                        "\u7591\u554f\u9854", "\u3048\u3063\u3063",
                        "\u305f\u304f\u3089\u3080", "\u9154\u3063\u305f",
                        "\u30b5\u30e0\u30ba\u30a2\u30c3\u30d7", "\u304f\u308b\u3088\u30fc",
                        "\u8a31\u3055\u306a\u3044", "\u304aoo", "\u3064tsu",
                        "\u7121\u7f6amuzai", "\u6709\u7f6ayuzai", "\u51b7rei",
                        "\u304d\u3061\u3083\u3042", "YABE", "\u305a\u306e\u30fc",
                        "\u305d\u30fc\u3067\u3059\u306d", "\u3044\u3044\u3053\u3088",
                        "\u30db\u30ed\u30e9\u30a4\u30d6\u7532\u5b50\u5712",
                        "\u512a\u3086\u3046", "\u52dd\u3057\u3087\u3046", "\u306fha",
                        "\u3042\u3063\u3071\u308c", "\u304e\u3083\u3075\u3093",
                        "NDK", "\u571ftsuti", "\u7d76\u5bfe\u3042\u304d\u3089\u3081\u306a\u3044",
                        "\u62cd\u624b\u52a9\u624b\u304f\u3093", "\u6ce3\u304d\u52a9\u624b\u304f\u3093", "\u3059\u3093\u3063",
                        "\u3080\u3046\u3046", "\u304e\u3083\u3075\u3093\u3053\u3088",
                        "\u71c3\u3048\u308b\u3053\u3088", "\u30de\u30e8\u30cd\u30fc\u30ba",
                    ]
                }, {
                    name: "Sakamata Chloe", id: "chloe", oshimark: "🎣", emotes: [
                        "\u3046\u3051\uff57", "\u3070\u304f\u30fc\u3093",
                        "\u3084\u3060\u3084\u3060", "\u3076\u3061\u304e\u308c",
                        "\u30cf\u30fc\u30c8", "\u306b\u3063\u3053\u308a",
                        "\u304a\u308c\u3089", "\u307d\u3048\u307d\u3048",
                        "\u3059\u3084\u3041", "\u3084\u3060\u3084\u3060\u3041",
                        "26810", "\u3069\u3084\u3041", "\u30b5\u30a4\u30ea\u30a6\u30e0",
                        "\u3053\u3076\u3057", "\u6fc0\u30a2\u30c4",
                        "\u3054\u3061\u305d\u3046\u3055\u307e", "\u3044\u305f\u3060\u304d\u307e\u3059",
                        "PON", "\u3066\u3093\u3055\u3044", "\u52a9\u304b\u308b",
                        "\u304f\u3055\uff57", "\u3081\u3061\u3087", "\u5bff\u53f8\u3063",
                        "\u52dd\u3061\u78ba", "\u30d5\u30e9\u30b0", "\u308f\u304b\u3063\u305f",
                        "\u308f\u304b\u3063\u3066\u306a\u3044", "\u3088\u3057\u3088\u3057"
                    ]
                }, {
                    name: "Kazama Iroha", id: "iroha", oshimark: "🍃", emotes: [
                        "pokoheart", "light1", "iroha1", "goo",
                        "zaa", "ruu", "zya", "xaa",
                        "kii", "nnn", "naa", "nnn2", "dee",
                        "eee", "light", "tasukaru", "ganbare",
                        "pien", "gozaru", "otsu", "tensai",
                        "kusa", "pon", "tikara", "tyuunyuu",
                        "dono", "gozarusan"
                    ]
                }]
            }, {
                name: "hololive \u30db\u30ed\u30e9\u30a4\u30d6",
                id: "holoch",
                members: [{
                    name: "hololive \u30db\u30ed\u30e9\u30a4\u30d6", id: "hololive",
                    emotes: [
                        "holoLogo", "holoLightblue", "holoShukkin", "holoZangyo", "holoRed", "holoBlue",
                        "holoWhite", "holoOrange", "holoGreen", "holoPink", "holoPurple", "holoYellow",
                        "holoLightgreen", "holoLightpink", "holoViolet", "holoTaiki", "holoYagoo", "holoBestgirl",
                        "holoWordho", "holoWordlo", "holoWordli", "holoWordi", "holoWordve", "holoGod", "holoKusa",
                        "holoEtto", "holoWakaru", "holoKawaii", "holoTee", "holoOkamew", "holoMatane",
                        "Yagoo", "Sadgoo", "Kingoo", "HoloMoona", "HoloOllie", "HoloZeta",
                        "HoloKiara", "HoloBijou", "HoloNerissa", "HoloFuwamoco",
                        "HoloElizabeth", "HoloGigi", "HoloCecilia", "HoloRaora"
                    ]
                }]
            }]
        }, {
            name: "hololive DEV_IS",
            subcategories: [{
                name: "ReGLOSS",
                id: "holodevis1",
                members: [{
                    name: "Hiodoshi Ao", id: "ao", oshimark: "🖋️", emotes: [
                        "PON",
                        "\u30b5\u30a4\u30ea\u30a6\u30e0", "\u304f\u3055\uff57",
                        "\u3058\u3083\u3058\u3083\u3093", "\u3046\u3093\u30fc",
                        "\u3058\u30fc\u3063", "\u30a2\u30aa\u30d1\u30f3",
                        "\u9ad8\u3044\u9152", "\u30ab\u30af\u30c6\u30eb",
                        "\u30b7\u30e3\u30f3\u30d1\u30f3\u30bf\u30ef\u30fc",
                        "\u30db\u30af\u30ed\u304f\u3086",
                        "\u30af\u30e9\u30b2\u304f\u3093"
                    ]
                }, {
                    name: "Otonose Kanade", id: "kanade", oshimark: "🎹✨", emotes: [
                        "\u3046\u3081\u3046\u3081",
                        "\u306a\u3093\u3061\u3085\u3046\u3053\u3063\u305f",
                        "\uff57\uff57\uff57", "\u30da\u30f3\u30e9\u30a4\u30c8", "\u306f\u3066\u306a",
                        "\u304a\u3064\u306e\u305b\u30a4\u30e9\u30b9\u30c8",
                        "\u304a\u3064\u306e\u305b\u6587\u5b57",
                        "\u3053\u3093\u306e\u305b\u30a4\u30e9\u30b9\u30c8",
                        "\u3053\u3093\u306e\u305b\u6587\u5b57", "\u3048\u3089\u3044",
                        "\u30a2\u30bb\u30a2\u30bb", "\u3046\u3048\u30fc\u3093",
                        "\u3058\u30fc\u3063", "\u30c9\u30e4\u30a1",
                        "\u30d3\u30c3\u30af\u30ea\u30de\u30fc\u30af",
                        "\u3093\u3093\u3093", "\u3046\u3048\u3048\u3044", "\u3048\u3048\u3048",
                        "www", "\u97f3\u7b261", "\u97f3\u7b262"
                    ]
                }, {
                    name: "Ichijou Ririka", id: "ririka", oshimark: "🌃", emotes: [
                        "lol", "gangima", "cheer", "doya", "Kanpai",
                        "paku", "muri", "goodjob", "heart", "bikkuri",
                        "hoe", "cry"
                    ]
                }, {
                    name: "Juufuutei Raden", id: "raden", oshimark: "🐚", emotes: [
                        "\u3053\u3093\u3070\u3093\u306f",
                        "\u304a\u9152\u3092\u98f2\u307f\u307e\u3042\u3059",
                        "\u3055\u3088\u3046\u306a\u3089\u3067\u3093",
                        "\u3061\u3087\u3063\u3068\u307e\u3064\u305f\u3051",
                        "\u306a\u3093\u3060\u3063\u3066\u30fc",
                        "\u516d\u6839\u6e05\u6d44", "OK\u3067\u3059",
                        "\u3084\u3063\u305f", "\u307f\u3084\u3073",
                        "\u3078\u3048\u30fc", "\u30da\u30f3\u30e9\u30a4\u30c8",
                        "\u3069\u3063\u3063", "\u5ea7\u5e03\u56e3",
                        "\u3050\u308b\u3050\u308b", "\u3054\u304f\u308a"
                    ]
                }, {
                    name: "Todoroki Hajime", id: "hajime", oshimark: "🐧⚡", emotes: [
                        "doya", "klyomu", "nante", "osu", "kussa",
                        "penraito", "yataty", "hashie", "maltucho", "sukilya",
                        "yorokobi", "oko", "naki", "odoroki", "tanpopo",
                        "hakushu", "tikuwa", "yoti", "bikkuri", "naa",
                        "nya", "hatena"
                    ]
                }]
            }, {
                name: "FLOW GLOW",
                id: "holodevis2",
                members: [{
                    name: "Isaki Riona", id: "riona", oshimark: "🎤👑", emotes: [
                        "rionaBrrr", "rionaNaniwaro", "rionalight", "rionaNeko", "rionaTaiki",
                        "rionaOtsu", "rionaWww", "rionaTada", "rionaIma", "rionaRengo",
                        "rionaKita"
                    ]
                }, {
                    name: "Koganei Niko", id: "niko", oshimark: "☺️🐅", emotes: [
                        "\u9396\u30da\u30f3\u30e9\u30a4\u30c8",
                        "\u7167\u308c\u308b\u30cb\u30b3\u62c5",
                        "\u7b11\u3046\u30cb\u30b3\u62c5", "\u6012\u308b\u30cb\u30b3\u62c5",
                        "\u7b39\u30da\u30f3\u30e9\u30a4\u30c8", "\u30cb\u30b3\u306e\u5b57",
                        "\u305f\u3093\u306e\u5b57", "\u62c5\u306e\u5b57",
                        "\u30ad\u30bf\u30fc\u306e\u5b57", "\u30af\u306e\u5b57",
                        "\u8349\u864e\u306e\u5b57", "\u306f\u3066\u306a",
                        "\u3075\u306e\u5b57", "\u3045\u306e\u5b57",
                        "\u30c3\u30c3\u30c3", "\u3066\u308c\u3066\u308c",
                        "\u3056\u3041\u30fc\u3053", "\u9152\u304c\u3046\u307e\u3044",
                        "\u30d3\u30c3\u30af\u30ea\u30de\u30fc\u30af\u306f\u3066\u306a",
                        "\u56f0\u308a\u9854", "\u840c\u3048\u30c3"
                    ]
                }, {
                    name: "Mizumiya Su", id: "su", oshimark: "💬🔁💙", emotes: [
                        "\u30da\u30f3\u30e9\u30a4\u30c8",
                        "\u3059\u3046\u306e\u5727", "\u306f\u3066\u306a",
                        "\u308f\u3089\u3046\u3059\u3046",
                        "\u3048\u3089\u3044", "\u3048\u30fc\u3093",
                        "\u305f\u3044\u304d", "\u304b\u308f\u3044\u3044",
                        "\u3051\u306f\u3044", "\u3070\u304b\u306a\u304b\u304a"
                    ]
                }, {
                    name: "Rindo Chihaya", id: "chihaya", oshimark: "🎧🔧", emotes: [
                        "heart", "hey", "uee", "sad", "bbu",
                        "rro", "dayo", "penlight"
                    ]
                }, {
                    name: "Kikirara Vivi", id: "vivi", oshimark: "💅✨", emotes: [
                        "\u3059\u3063\u3074\u3093", "\u30f4\u30a3\u30f4\u30a3",
                        "\u30cb\u30e4\u30cb\u30e4", "\u30da\u30f3\u30e9\u30a4\u30c8"
                    ]
                }]
            }]
        }, {
            name: "hololive EN",
            subcategories: [{
                name: "hololive EN -Myth-",
                id: "holomyth",
                members: [{
                    name: "Amelia Watson", id: "ame", oshimark: "🔎", emotes: [
                        "ameUhh", "ameHic1", "ameHic2", "ameHic3", "ameHic4", "ameConc",
                        "ameTTT", "ameEEE", "ameAAA", "ameUUU", "ameYay", "ameBubba",
                        "ameHeh", "ameThink", "ameZoom", "ameYYY", "ameEar", "ameLighto",
                        "ameCry", "ameInspect", "ameLove", "ameRage", "ameCute", "ameWut",
                        "ameGator", "ameTOTO", "ameWWW", "ameQQQ", "ameMMM", "ame100",
                        "ameBee", "amePray", "ameCool", "ameDed", "amePotato", "ameSmug",
                        "ameRgb", "ameArm1", "ameGun1", "ameSad", "ameDrool", "ameParty",
                        "amePopcorn", "ameSalute", "ameTummy", "ameClown", "ameGun2",
                        "ameArm2", "ameBubba2", "ameGatorIdol", "ameGatorWot"
                    ],
                }, {
                    name: "Gawr Gura", id: "gura", oshimark: "🔱", emotes: [
                        "GuraA", "EbiNANI", "GuraMM", "GuraWhat", "EbiO", "GuraAA",
                        "GuraComfy", "GuraSmug", "GuraHUH", "GuraLove", "GuraHAHA",
                        "GuraSame", "GuraPeek", "GuraMad", "GuraCry", "GuraWat",
                        "gurapat", "guWAT", "GuDuh", "GuYum", "GurNya", "BloopYAY",
                        "BloopYAYL", "BloopYAYR", "RedOwO", "RedGura", "BlueLight",
                        "RedLight", "SamtTBH", "OHH", "NYO", "EBI", "Shocc", "Celebrate",
                        "ChadGura", "ded", "Squidge", "Sometimes", "Snuggle", "PenGun",
                        "EyeL", "WMouth", "EyeR", "LaSmug", "Mayhaps", "Nyoom", "OhRound",
                        "WuvXob", "EbiPen", "Ebimotions", "EbiCHAOS", "Unamused",
                        "ThumbsUp", "Rawr"
                    ]
                }, {
                    name: "Mori Calliope", id: "calli", oshimark: "💀", emotes: [
                        "Ripr", "RipI", "RipP", "nani", "nosalt", "canteloupe", "big",
                        "happymori", "sleepyreap", "drunkmori", "cryingmori", "moriguh",
                        "morimurder", "gohstrider", "laugh", "calliopog", "ups", "glasses",
                        "deadbeats", "confused", "hearteyes", "shock", "sleeby",
                        "washhands", "annoy", "blush3", "confuse", "sheriff", "boomer",
                        "pwease", "cman", "supriz", "neuron1", "neuron2", "neuron3",
                        "akambe", "lilguy", "pin", "pon", "tutu", "ghostcat", "gangimori",
                        "singin", "panik", "hazukashii", "shocking", "sleepy", "bonk",
                        "baka", "doubt", "drank", "cry", "blushed", "bigeye"
                    ]
                }, {
                    name: "Takanashi Kiara", id: "kiara", oshimark: "🐔", emotes: [
                        "shield", "sword", "quaso", "nein", "danke", "schon", "1010",
                        "bokbok", "YLS", "ohoho", "win", "pie", "aww", "omg", "hey",
                        "yab", "cry", "chu", "spark", "mgn", "jii", "huh", "wah", "ban",
                        "yay", "uwa", "dad", "mad", "lol", "fpm", "luv", "sip", "cho",
                        "smo", "nom", "pray", "sal", "par", "dro", "uhh", "yan", "daw",
                        "hel", "yes", "noo", "wow", "oof", "afk", "okk", "tin", "yaw",
                        "kya", "pat", "zzz", "polite"
                    ]
                }, {
                    name: "Ninomae Ina'nis", id: "ina", oshimark: "🐙", emotes: [
                        "DROOL", "10Q", "HUMU", "KUSA", "RIGHTGLOW", "PAT", "LEFTGLOW",
                        "MMT", "tehepero", "BRAINCELL", "404", "Glasses", "KEIKAKU",
                        "BONK", "INAFF", "YAWN", "WELL", "DONE", "oyaoya", "WWW", "AAA",
                        "HHH", "pien", "OxO", "Jii", "peek", "AME", "CALLI", "GURA",
                        "KIARA", "INA", "KDTD", "BYE", "MOGU", "SMUG", "PAIN", "CAPY",
                        "GONEXT", "OMG", "LOVE4EVER", "BAE", "FAUNA", "IRYS", "KRONII",
                        "MUMEI", "SANA", "Oii", "ANO", "DED", "frfr", "KUKUKU", "HEH",
                        "KANPAI", "TMRW"
                    ]
                }]
            }, {
                name: "hololive EN -Council-",
                id: "holocouncil",
                members: [{
                    name: "Tsukumo Sana", id: "sana", oshimark: "🪐", emotes: [
                        "sanabeeeg", "sanabreadstick", "sanalimiter", "sanasanawich",
                        "sanaahh", "sanaambread", "sanableh", "sanabyeearth", "sanadangostick",
                        "sanaearth", "sanafound", "sanahearth", "sanakaniko",
                        "sanaSANA", "sanaNANA", "sanaNARA", "sananom", "sanapartygara",
                        "sanased", "sanasmug", "sanaspeeen", "sanaspeen", "sanaspen",
                        "sanausaslug", "sanaYMR", "sanaKUSA", "sananeighbula",
                        "sanazzz", "sanaliftoff", "sanalanding", "sanaconfetti", "sanaHAHA",
                        "sanaohdear", "sanatakosana", "sanapanpan", "sanaheadpat",
                    ],
                }]
            }, {
                name: "hololive EN -Promise-",
                id: "holopromise",
                members: [{
                    name: "IRyS", id: "irys", oshimark: "💎", emotes: [
                        "irysHirys", "irysByerys", "irysMusic", "irysRys", "irysEncore2",
                        "irysSeiso", "irysMad", "irysBlush", "irysSocool", "irysDevil",
                        "irysHeart", "irysLaugh", "irysPien", "irysSing", "irysSmile",
                        "irysSurprised", "irysLight", "irysLight2", "irysBread2",
                        "irysWingl", "irysWingr", "irysBread", "irysHeart2", "irysMogu",
                        "irysWoah", "irysWave", "irysPicasso", "irysArt", "irysWha",
                        "irysGuyrys", "irysCheer", "irysCheer2", "irysBlooml", "irysBloomr",
                        "irysGlooml", "irysGloomr", "irysSoda", "irysBanana", "irysPatrys",
                        "irysYabairys", "irysNerd", "irysSmug", "irysWink", "irysTehepero",
                        "irysScared", "irysPeek", "irysWicked", "irysBonk", "irysBloompat",
                        "irysGloompat", "irysShiitake", "irysGrab", "irysYoisho", "irys116"
                    ],
                }, {
                    name: "Ceres Fauna", id: "fauna", oshimark: "🌿", emotes: [
                        "bonk", "comfy", "love", "lol", "angry", "cry", "yandere",
                        "hugsnail", "clover", "UUU", "wave", "UUUU", "wide1", "wide2",
                        "wide3", "doki", "innocent", "bald", "dead", "disgust", "flushed",
                        "yay", "pinklight", "greenlight", "pien", "sleep", "smile",
                        "nemusmug", "noo", "shy", "slap", "zoom", "tako", "smug"
                    ],
                }, {
                    name: "Ouro Kronii", id: "kronii", oshimark: "⏳", emotes: [
                        "krogwak", "kroez", "krosrprise", "krodoubt", "kroheart",
                        "krokanpai", "kronichiwa", "kroyasumi", "krolol", "kromegalol",
                        "krotea", "yukkronii", "kroanger", "kroevil", "kroguns",
                        "hairflip", "krosing", "krothonk", "timetostop", "krowink",
                        "kroyandere", "kroded", "kropet", "kropray", "krosweat",
                        "krohug", "boroswhoa", "borosgrin", "kroniebonk", "borosthis",
                        "krowand", "kroblush", "whatadeal", "neckcrack", "polltime",
                        "krosadge", "kronfused", "kropium", "kroniecry", "kroniedoko",
                        "kroniikoko", "gaslight", "kropain", "borospet", "love4ever",
                        "kroniigws", "kroniedie", "kronieclap", "krochad", "pausechamp",
                        "krocheer", "krowakaru", "krodab", "krokaku"
                    ],
                }, {
                    name: "Nanashi Mumei", id: "mumei", oshimark: "🪶", emotes: [
                        "processing", "happy", "pien", "cry", "angy", "lala", "emberries",
                        "shock", "sleep", "dead", "hehe", "haha", "eww", "caffeine",
                        "smug", "thumbsup", "yays", "comfy", "lub", "wowza", "colonSmile",
                        "colonD", "aoa", "rainbow", "notes", "sadge", "metal", "thisisfine",
                        "eyes", "takomum", "nightmare", "squeeze", "friend", "friendHap",
                        "friendMad", "friendSad", "dondon", "glowstickL", "glowstickR",
                        "lightbulb", "berry"
                    ]
                }, {
                    name: "Hakos Baelz", id: "bae", oshimark: "🎲", emotes: [
                        "wazzup", "sarabada", "lel", "coffee", "tank", "boom1", "boom2",
                        "prrr", "splash", "huh", "pien", "lessgooo", "stick1", "stick2",
                        "RESPECC", "saltbae", "nihihi", "squeakyay", "squeakno", "derp",
                        "BRUH", "despair", "pat", "sleepy", "ECKSDEE", "SUS", "squarebae",
                        "bae", "drunk", "TAKOTARO", "HOOHAH", "HOO", "ROO", "HANDSHAKE",
                        "WHATADEAL", "MILORD", "WUT", "SULK", "PANIK", "LAUGH", "BLUSH",
                        "ANGY", "OUIOUIPP", "JDONMYSOUL", "DOGEZA", "CHUUNI", "WITNESSED",
                        "KUSA", "JMS", "JDON", "BESTFRIEND"
                    ]
                }]
            }, {
                name: "hololive EN -Advent-",
                id: "holoadvent",
                members: [{
                    name: "Shiori Novella", id: "shiori", oshimark: "👁‍🗨", emotes: [
                        "shioriComfy", "shioriCry", "shioriHeadpat", "shioriRave",
                        "shioriShocked", "shioriSmug", "shioriScissors", "shioriHeart",
                        "shioriNotes", "shioriStare", "shioriPopcorn", "shioriLaugh",
                        "shioriWave", "shioriBonk", "shioriDab", "shioriDeskSlam",
                        "shioriFlashlight", "shioriThereThere", "shioriPeek", "shioriSleepy",
                        "shioriDumpy", "shioriFacepaw", "shioriNovelbonk", "shioriFear",
                        "shioriMelt", "shioriGiftlove", "shioriSus", "shioriProtecc",
                        "shioriJohnny", "shioriWelcome1", "shioriWelcome2", "shioriBlush",
                        "shioriPray", "shioriBrick", "shioriHotdogL", "shioriHotdogM", "shioriHotdogR"
                    ]
                }, {
                    name: "Koseki Bijou", id: "bijou", oshimark: "🗿", emotes: [
                        "bijouBoom", "bijouDed", "bijouSmile", "bijouBeep", "bijouPat",
                        "bijouRee", "bijouCry", "bijouStare", "bijouBlush", "bijouHeart",
                        "bijouCheer", "bijouZzz", "bijouGun", "bijouEmo", "bijouCool",
                        "bijouHeh", "bijouWiper", "bijouDangit", "bijouOOO", "bijouPebblecry",
                        "bijouPebblebweh", "bijouThink", "bijouOobib", "bijouPebbleeyes", "bijouMILK",
                        "bijouSwirlyeyes", "bijouPebbleyay", "bijouPebbleAAA", "bijoucat",
                        "bijouPebblecena", "bijouFear", "bijouThatswild", "bijouPebbledumb",
                        "bijouPebblegasp", "bijouSmart"
                    ]
                }, {
                    name: "Nerissa Ravencroft", id: "nerissa", oshimark: "🎼", emotes: [
                        "KiraKira", "Oops", "RissaLove", "Waaah", "Squish", "HWA", "Hmph",
                        "RissaPeek", "ANGY", "RissaCheer", "arrest", "hehe", "chu", "bonk",
                        "OPE", "sweepy"
                    ]
                }, {
                    name: "FUWAMOCO", id: "fuwamoco", oshimark: "🐾", emotes: [
                        "MOCOhuh", "BAU", "FUWAMOCO", "FUWAyes", "FUWAawa", "MOCOniya",
                        "FUWAhm", "FUWApat", "MOCOpat", "FUWAheart", "MOCOheart", "MOCOlight",
                        "FUWAlight", "MOCOsneeze", "mochidonut", "emojiF", "emojiW", "emojiM",
                        "emojiC", "KUSA", "MOCOthumb", "MOGOJYAN", "MOCOsweat", "MOCOwww",
                        "MOCOpien", "HOEH", "FUWAwww", "FUWApien"
                    ]
                }]
            }, {
                name: "hololive EN -Justice-",
                id: "holojustice",
                members: [{
                    name: "Elizabeth Rose Bloodflame", id: "liz", oshimark: "💄", emotes: [
                        "heart", "ree", "pat", "sing", "bluestick", "redstick", "bobby",
                        "eyel", "lips", "eyer", "eheh", "vewynoice", "Wha", "ded",
                        "strong", "gifts", "hydrate", "loading", "cheer", "comfy",
                        "zoom", "noms", "shock", "dingdong", "warcry"
                    ]
                }, {
                    name: "Gigi Murin", id: "gigi", oshimark: "👧", emotes: [
                        "popocheer", "gigiwave", "gigiwibble", "gigistare", "gigirun",
                        "gigihappy", "gigirage", "popogg", "gigigg", "gigilove", "gigihungry",
                        "gigisleep", "gigipet", "gigitehe", "gigipunch", "gigigrip", "stopfight",
                        "gremfull", "gremwoa", "frewup", "grem", "gigiagh", "giginod", "gigithink",
                        "gigidj", "gigihowl", "gigibleh", "gigiclown", "ggsideeye", "ppsideeye",
                        "gigiwoa", "gigiehe", "gigishake", "gigiangel", "gigidevil"
                    ]
                }, {
                    name: "Cecilia Immergreen", id: "cece", oshimark: "🍵", emotes: [
                        "CeCeLaugh", "CeCeJam", "CeCeHello", "CeCeHuh", "CeCeWhoa", "CeCeSmug",
                        "CeCeKnoife", "CeCeProst", "CeCeLetHerCook", "CeCeOvercooked",
                        "CeCeHeart2", "CeCeHeart3", "CeCeSalute", "CeCeEvil", "CeCeDed",
                        "CeCeCool", "CeCeSleep", "CeCeZoom", "CeCeCheer", "CeCeCry",
                        "CeCeShock", "CeCePlop", "CeCeOtoStare", "CeCeSPIN", "CeCeSpiin",
                        "cecili55KEY", "cecili55OTOMO", "cecili55ZOOM", "cecili55MYES",
                        "cecili55BIG", "cecili55LOW", "cecili55COOl", "ceccecili55ANGRY",
                        "cecili55TINY", "cecili55PEACE", "cecili55HEHE", "cecili55WAVE.gif",
                        "cecili55CLAP.gif", "cecili55SHAKE.gif", "cecili55BEAT.gif", "cecili55ARRIVE.gif"
                    ]
                }, {
                    name: "Raora Panthera", id: "raora", oshimark: "🐱", emotes: [
                        "ciao", "love", "hug", "thumbsup", "pat", "lurk", "please", "raooo",
                        "cultured", "spray1", "spray2", "bonk", "nerd", "LOL", "SKIPPA",
                        "cheer", "GIGACHAD", "stop", "WAOW", "Hand", "sniffa", "huh", "flower",
                        "derp", "LETHERCOOK", "OVERCOOKED", "BASTA", "ogey", "4090eyes",
                        "approb", "notapprob", "noted", "fire", "BOH", "PANIK", "eepy", "III",
                        "MMM", "RRR", "AAA", "OOO", "Gift", "sip", "Blush", "salute",
                        "AYO", "Dead", "sit", "flashbang", "pray", "cry", "cucumber"
                    ]
                }]
            }]
        }, {
            name: "hololive ID",
            subcategories: [{
                name: "1st Generation",
                id: "holoid1",
                members: [{
                    name: "Ayuda Risu", id: "risu", oshimark: "🐿️", emotes: [
                        "Brr", "Riscot", "LightStick", "ElMustacho", "LetterR", "LetterI",
                        "LetterS", "LetrUBrown", "LetterA", "LetterY", "LetUPink", "LetterN",
                        "LetterD", "nesoberisu", "bonk1", "bonk2", "emojipo", "emojipi",
                        "otsu1", "otsu2", "kusa", "ikz", "ameeizing1", "ameeizing2", "tskr",
                        "saber1", "saber2", "prisuners", "risuners", "headpat", "risuheart",
                        "LEMAO"
                    ]
                }, {
                    name: "Moona Hoshinova", id: "moona", oshimark: "🔮", emotes: [
                        "Cry", "Hehe", "Axe", "Shock", "Yes", "Noo", "Bonk", "GWS",
                        "Love", "Fan", "Drink", "Huh", "Hmm", "Fork", "Cryrich", "Doki2",
                        "Kyaa", "Pfft", "Youcandoit", "Food", "Please", "Kusa", "GoodGame",
                        "CoolMoona", "Cupu", "Ihh", "RTA", "Headpat", "Otsu", "hello",
                        "MLM", "Mkay", "GunMoona", "LSL", "LSR"
                    ]
                }, {
                    name: "Airani Iofifteen", id: "iofi", oshimark: "🎨", emotes: [
                        "LetterO", "Letterbi", "Lettersa", "LetterI", "Letterf", "Tensai",
                        "Otsu", "LSleft", "LSright", "Galaxy", "UFO", "Bengecc", "Ero",
                        "Eeh", "Bonk", "Bonk2", "chiyopiL", "chiyopiR", "chiyopiM",
                        "chiyopiN", "bigbrain", "nice", "peek", "pien", "suprised",
                        "tenQ", "halu", "wangy", "dumpy"
                    ]
                }]
            }, {
                name: "2nd Generation",
                id: "holoid2",
                members: [{
                    name: "Kureiji Ollie", id: "ollie", oshimark: "🧟‍♀️", emotes: [
                        "lightstick", "danceudin", "tombstone", "kusa", "ollien", "hypeollie",
                        "shockollie", "bonkollie", "sweatollie", "ollewd", "ollove", "madin",
                        "sweatyudin", "AlphaO", "AlphaL", "AlphaI1", "AlphaE", "AlphaK",
                        "AlphaU", "AlphaR", "Mozombiq2", "AlphaJ", "CepolL", "CepolR",
                        "Cabbage", "OllieHug", "OllieLaugh", "OllieSniff", "UdinGasp",
                        "UdinPat", "OllieGG", "Mozombique", "OllieAngry", "OllieFire",
                        "OllieIKZ"
                    ]
                }, {
                    name: "Anya Melfissa", id: "anya", oshimark: "🍂", emotes: [
                        "thisisfine", "taiki", "judge", "wah", "plop", "toaster",
                        "glowkris", "fabulous", "okay", "hydrate", "ikemen", "byebye",
                        "nicetry", "wow", "onduty", "gws", "what", "shinji", "heh"
                    ]
                }, {
                    name: "Pavolia Reine", id: "reine", oshimark: "🦚", emotes: [
                        "lightstick", "car", "tatang", "bigX", "bigO", "hydration",
                        "monch", "itsfine", "smile", "jitome", "glasses", "bonk",
                        "thumbsup", "gws", "mep", "hand1", "hand2", "meloncube",
                        "heart", "sosad", "uwu", "kaget", "tonjok", "reizero", "blush",
                        "memo", "breine", "kusa", "joinda1", "joinda2", "spray", "sleep",
                        "badlang", "pew", "clown", "tongue"
                    ]
                }]
            }, {
                name: "3rd Generation",
                id: "holoid3",
                members: [{
                    name: "Vestia  Zeta", id: "zeta", oshimark: "📜", emotes: [
                        "flushed", "pon", "chef", "lightstick", "ZZZ", "EEE", "TTT",
                        "AAA", "gitgud", "o7zeta", "gws", "wow", "cry", "disgusted",
                        "shock", "pat", "catat", "angrybazo", "bonk", "smug", "CCC",
                        "cute", "sparkle", "agent", "laugh", "sus", "zetamin", "UUU",
                        "WWW", "zetaGG", "loading", "zetaPIKA", "TENSAI", "comfy",
                        "tskr", "uwu"
                    ]
                }, {
                    name: "Kaela Kovalskia", id: "kaela", oshimark: "🔨", emotes: [
                        "comfy", "ggez", "laugh", "bonk", "nani", "uwu", "smug",
                        "salute", "doubt", "heart", "hydrate", "sob", "aletters",
                        "eletters", "load", "kletters", "lletters", "dot", "minluck",
                        "brick", "pat", "hammerleft", "hammeright", "dhlh", "smallNT",
                        "rude", "ugud", "GSH", "WOW", "LEMAO", "okay", "OTSU", "adios",
                        "angy", "halu", "happy", "hee", "skem", "sus", "yay", "goriela",
                        "pimok", "mald", "chad", "hug", "poll", "adios1", "adios2",
                        "cope", "jinx"
                    ]
                }, {
                    name: "Kobo Kanaeru", id: "kobo", oshimark: "☔", emotes: [
                        "tch", "pat", "ehe", "smug", "scream", "amazed", "angry",
                        "annoyed", "confused", "cry", "love", "lightleft", "lightright",
                        "kletter", "oletter", "bletter", "hee", "kuda", "LOL", "prit",
                        "sheesh", "Q3Q", "kobominus", "angel", "blush", "kobonk",
                        "galaxy", "koboGG", "gws", "hah", "loading", "koboNT",
                        "onfire", "skem", "sleepy", "www", "cilus", "cilus1", "cilus2"
                    ]
                }]
            }]
        }, {
            name: "Others",
            subcategories: [{
                name: "EN",
                id: "others_en",
                members: [{
                    name: "Nimi Nightmare", id: "nimi", oshimark: "💭", emotes: [
                        "nimiHeart", "nimiHaha", "nimiCry", "nimiNerd", "nimiAngy", "nimiBonk",
                        "nimiSmile", "nimiFlushed", "nimiScared", "nimiSip", "nimiBald", "nimiBeam1",
                        "nimiBeam2", "nimiCaught", "nimiComfy", "nimiDead", "nimiMlady",
                        "nimiNoo", "nimiPat", "nimiCheer", "nimiPls", "nimiBeg", "nimiSmug", "nimiWave",
                        "nimiYay", "nimiZoom"
                    ]
                }, {
                    name: "dooby", id: "dooby", oshimark: "🚃💨", emotes: [
                        "doobySus", "doobyO7", "doobyGlorp", "doobyPog", "doobyHA",
                        "doobyK", "doobyKcry", "doobyKd", "doobyThump", "doobyCope",
                        "doobyHmm", "doobyErm", "doobyArm", "doobyFBI", "doobyBonk",
                        "doobyKick", "doobyS", "doobyUp", "doobyDown", "doobyHiccup",
                        "doobyComfy", "doobyRat", "doobyUhh", "doobyPls", "doobyPeak",
                        "doobyLove", "doobySpray", "doobyZoom", "doobySip", "doobySmack",
                        "doobyNotLikeThis", "doobyDed", "doobyBakaa", "doobyKclown", "doobyLoad",
                        "doobyHIC", "doobyHEHE", "doobyBlush", "doobyEat", "doobyKLOL",
                        "doobyYummy", "doobyUgly", "doobyGreed", "doobyAyaya",
                        "yayY", "yayA", "smelly", "oshi",
                        "jeebBusiness", "doobyTinfoil", "doobyLMAO", "kippuBakery",
                        "doobyDoro", "WanWan", "Doobless"
                    ]
                }, {
                    name: "Sameko Saba", id: "saba", oshimark: "🐟", emotes: [
                        "fish", "cryb", "stare", "aware", "wow", "zoom", "comfy", "pray", "wheeze", "HAHA"
                    ]
                }]
            }, {
                name: "JP",
                id: "others_jp",
                members: [{
                    name: "Yuuki Sakuna", id: "sakuna", oshimark: "🎀🐾", emotes: [
                        "\u306b\u3083\u3093", "\u306a\u307f\u3060",
                        "\u304d\u3089\u304d\u3089", "\u30af\u30ea\u30aa\u30cd",
                        "\u304a\u3069\u308d\u304f", "\u3066\u308c\u308b",
                        "\u3058\u30fc\u3063", "\u30b5\u30a4\u30ea\u30a6\u30e0",
                        "\u3084\u3063\u305f\u30fc", "\u30b0\u30c3\u30c8\u30b2\u30fc\u30e0",
                        "\u3080\u30fc\u3061\u3083\u3093", "\u30d6\u30c1\u30ae\u30ec",
                        "www", "\u30b9\u30a5\u30fc", "\u3075\u3093\u3063",
                        "\u30c1\u30e9\u30c3", "\u30b5\u30a4\u30ea\u30a6\u30e02"
                    ]
                }, {
                    name: "Amagai Ruka", id: "ruka", oshimark: "☔️🐬", emotes: [
                        "rain", "Lightstick", "PON", "hera", "smile",
                        "uwaaaaan", "yoshiyoshi", "wara", "tee", "teee"
                    ]
                }, {
                    name: "Kurageu Roa", id: "roa", oshimark: "🪼☁️", emotes: [
                        "\u305f\u3044\u304d",
                        "\u3042\u308a\u304c\u3068\u3046",
                        "\u3077\u3093\u3063",
                        "\u3048\u30fc\u3093", "\u3050\u3063\u3069",
                        "\u3048\u3089\u3044", "\u30ca\u30a4\u30b9",
                        "\u304a\u304b\u304a",
                        "\u3077\u3086\u3086",
                        "\u30da\u30f3\u30e9\u30a4\u30c8"
                    ]
                }]
            }, {
                name: "Others",
                id: "others",
                members: [{
                    name: "YouTube",
                    id: "youtube",
                    emotes: [
                        "face-blue-smiling", "face-red-droopy-eyes", "face-purple-crying", "face-blue-wide-eyes",
                        "face-fuchsia-tongue-out", "face-orange-biting-nails", "face-red-heart-shape", "buffering", "shelterin"
                    ]
                }, {
                    name: "Akugaki Koa", id: "koa", oshimark: "↝ ⛓️", emotes: [
                        "peek", "memo", "pat", "uwa", "smug", "pen", "pen2",
                        "woah", "sip", "CHAOS", "bubulove", "bubuniko", "bubuangy1", "bubuangy2",
                        "bubucry", "nikilove"
                    ]
                }, {
                    name: "Amiya Aranha", id: "amiya", oshimark: "🧵", emotes: [
                        "amilove", "amipat", "amisad", "amisip", "amicheer",
                        "amihappy", "bucko", "amiwave", "ohamiya", "amicrab",
                        "amicat", "amicool", "amigamer", "amimonka", "amisleep",
                        "amiyawn", "amithonk", "bonko", "amisnort", "plok",
                        "fami", "amisneeze", "amipog", "amiangy", "buckoflush",
                        "amieat", "amiplot", "pink3", "broc", "amidig"
                    ]
                }, {
                    name: "Blair Labri", id: "blair", oshimark: "📖🔆", emotes: [
                        "Standing", "Orz", "Heart", "Stocks", "Crying", "Salute",
                        "Looking", "Blushing", "Laughing", "Burp", "Headpat",
                        "Karaoke", "Angry", "Yes", "Nope", "Scared", "Huh", "Erm"
                    ]
                }, {
                    name: "Cerenity Cosmica", id: "cerenity", oshimark: "🍰💞", emotes: [
                        "moonparty", "cereheart", "cerepeek", "cereueee", "cereshrug", "cereclown",
                        "cerebuffer", "cerehug", "cerechaos", "cerescary", "cereLOL", "cerecozy",
                        "cereferal", "ceresmug", "cerecringe", "ceresip", "cerepray", "cereeyes",
                        "moonnotes", "cerescared", "cerepoint", "cereflushd", "cerebonk", "moongrab",
                        "cerenrage", "cerenhmmm", "cerenuwu"
                    ]
                }, {
                    name: "Chiaki Katsumi", id: "chiaki", oshimark: "🐱🖥", emotes: [
                        "Cheer", "Panic", "Tubular", "Question", "SideEye", "Tea", "PuppyEyes",
                        "Wow", "Shock", "Angry", "Menace", "Sad", "Wave", "Pray", "Wheeze",
                        "Heart", "Paw", "EarPeek", "Ded", "Clueless", "Noted", "Headpat",
                        "Nerd", "Chomp"
                    ]
                }, {
                    name: "Daisy Dandelion", id: "daisy", oshimark: "🌼", emotes: [
                        "Pat", "TOT", "AHH", "Love", "Corn", "DDD",
                        "AAA", "III", "SSS", "YYY", "Hug", "Megao",
                        "Yes", "Nope", "Silly", "Fandelion", "Smort", "ZZZ",
                        "o7Salute", "Peek", "Wave", "ThumbsUp", "Shock", "Eyes",
                        "Cheer", "Spray"
                    ]
                }, {
                    name: "Daiya Fortuna", id: "daiya", oshimark: "🎰 ♦️", emotes: [
                        "nou", "heart", "headpat", "rave", "chaos", "bonk", "cry",
                        "smug", "tskr", "wheeze", "dedmonmon", "hiyamonmon", "knifemon",
                        "nosemonmon", "monmog", "frothing", "BITE", "kazzoo", "fear",
                        "jackpot", "monpreg", "daiyabeam"
                    ]
                }, {
                    name: "Essie", id: "essie", oshimark: "🐑🌾", emotes: [
                        "wokege", "sleepy", "WOW", "epic", "stare",
                        "depressed", "kyaa", "cheer", "sweat", "smug",
                        "menace", "hmm", "pause", "pain", "pien", "icant",
                        "baachikiss", "letsgo", "corpa", "True",
                        "essiec1Sweats", "essiec1Menace", "essiec1Stare", "essiec1Kyaa",
                        "essiec1Prayge", "essiec1Pat.gif", "essiec1Wiggle.gif", "essiec1ShepPls.gif",
                        "essiec1Ijbol.gif", "essiec1Pachi.gif", "essiec1Oi.gif", "essiec1Cheers.gif",
                        "essiec1Yap.gif", "essiec1Baachiyap.gif", "essiec1Freakyoi.gif", "essiec1Laughing.gif",
                        "essiec1Noted.gif", "essiec1Jamming.gif", "essiec1Erm.gif", "essiec1Chu.gif",
                        "essiec1NOOO.gif", "essiec1Peaceout.gif", "essiec1Happi.gif", "essiec1Luv",
                        "essiec1Cry", "essiec1XD", "essiec1B", "essiec1Wave", "essiec1Dead", "essiec1Depressed",
                        "essiec1Epic", "essiec1Hmmm", "essiec1LETSGO", "essiec1Pain", "essiec1Corpa",
                        "essiec1Pause", "essiec1Sleepy", "essiec1Smug", "essiec1Wokege", "essiec1Wow",
                        "essiec1Icant", "essiec1Pien", "essiec1Kissabaachi"
                    ]
                }, {
                    name: "Fuyo Cloverfield", id: "fuyo", oshimark: "🍀", emotes: [
                        "FuyoHeart", "FuyoPanik", "FuyoComfy", "FuyoPause", "FuyoHeh", "FuyoSmooch",
                        "FuyoCoin", "FuyoTUMMY", "FuyoCRY", "FuyoDerp", "FuyoFluster", "FuyoUoh",
                        "FuyoBleeh", "FuyoQuestion", "FuyoHype", "FuyoCheerA", "FuyoCheerB", "FuyoPat",
                        "FuyoCringe", "FuyoAWOOGA", "FuyoStems", "FuyoCoolUp", "FuyoWheeze", "FuyoThonk",
                        "FuyoCat", "FuyoWIP2", "FuyoWIP3", "FuyoWIP4", "FuyoWIP5"
                    ]
                }, {
                    name: "Kiba", id: "kibawoo", oshimark: "🐺🪫", emotes: [
                        "nanoLove", "nanoBan", "nanoAngy", "nanoWave", "nanoPet",
                        "nanoFlushed", "nanoSob", "nanoOmegalul", "nanoDespair"
                    ]
                }, {
                    name: "Jelly Hoshiumi", id: "jelly", oshimark: "🌠🎀", emotes: [
                        "Cheer", "Sweat", "Plead", "Wave", "Cursed", "Sob", "Notlikethi",
                        "Confused", "Cool", "Drool", "Heart", "Nerd", "Smug", "AliceStare",
                        "Clueless", "Kettle", "Dead", "Boom", "Fire", "Joy", "Pet",
                        "Think", "Yawn"
                    ]
                }, {
                    name: "Jira Jisaki", id: "jira", oshimark: "⛰️", emotes: [
                        "jiraBeam1", "jiraBeam2", "jiraWave", "jiraZZZ", "jiraRIP", "jiraHype",
                        "jiraCry", "jiraPunch", "jiraLove", "jiraBaby", "jiraPanic",
                        "jiraHmm", "jiraTired", "jiraLight1", "jiraJika1", "jiraJika2", "jiraJika3",
                        "jiraJika4", "jiraJika5", "jiraJika6"
                    ]
                }, {
                    name: "Kanna Yanagi", id: "kanna", oshimark: "🦆🔍", emotes: [
                        "HiHi", "Qua", "Headpat", "Love", "Fail", "Buffering", "Humu",
                        "scared", "KamoLove", "Noted", "Fuyumi", "KamoShy", "Lmao",
                        "Cheer", "KamoNope", "KamoHug", "Cry", "Comfy", "Water", "Burn",
                        "Bonk", "Ded", "Chu", "Shiny", "rage", "Kamo", "Gremlin", "MILK",
                        "Egg2", "Eyebrow", "Lucky", "TSKR", "DotDotDot"
                    ]
                }, {
                    name: "Lalabell Lullaby", id: "lalabell", oshimark: "🎀", emotes: [
                        "cry", "happy", "love", "cool", "angry", "pat", "holala",
                        "haha", "comfy", "cheer", "please", "nimodo", "sip",
                        "itsfine", "bonk"
                    ]
                }, {
                    name: "LAZULI", id: "lazuli", oshimark: "🍥", emotes: [
                        "LazuHUH", "LazuTAIL", "LazuLOVE", "LazuCRY", "LazuSLAP", "LazuEPIC",
                        "LazuSHOCK", "LazuSMUG", "LazuMONCH", "LazuTEHE", "LazuSHINE", "LazuPAT",
                        "LazuBITE", "LazuRIZZ", "LazuSHRIVEL", "LazuACTUALLY", "LazuSHIMAPAN",
                        "LazuUUU", "LazuNYO", "LazuWOA", "LazuLAZUL", "LazuLAZUA", "LazuLAZUD",
                        "LazuLAZUS", "LazuLAZUU", "LazuLAZUZ", "LazuLAZUI", "LazuKURILAD"
                    ]
                }, {
                    name: "Mint Fantôme", id: "mint", oshimark: "👻✨", emotes: [
                        "pien", "cry", "depression", "heart", "angry",
                        "cheer", "doya", "wave", "peek", "biteslip", "boo",
                        "Ikz", "Otsu", "Minto", "Bustin", "Boba", "eye1",
                        "bleh", "eye2", "tehepero", "coolmint", "wisp", "bonk",
                        "otaku", "panic", "pray", "wink", "blush", "silly",
                        "drool", "excited", "ICANT", "laugh", "ponder",
                        "penlight", "box", "sneaky", "choochoo", "shock",
                        "wotagei", "prettygood", "sleepy", "clap",
                        "wispylaugh", "genius", "ghost", "headpat", "salute",
                        "letterM", "letterI", "letterN", "letterT", "letterO"
                    ]
                }, {
                    name: "Mitty", id: "mitty", oshimark: "🧿", emotes: [
                        "charmWheez", "charmNOspoil", "charmMittyShut", "charmMittyPat",
                        "charmGlowSticks", "charmLuv", "charmStem", "charmStemship", "charmKith",
                        "charmBusiness", "charmCharmCopee", "charmAAAA", "charmMittyhIC", "charmMittyPause",
                        "charmUoh", "charmPause", "charmSmug", "charmBinky", "charmMittyBonk", "charmComfi",
                        "charmTmmy", "charmCharmCool", "charmCharmCring", "charmCharmGibs", "charmBlush",
                        "charmSpooketh", "charmNerd", "charmAwooga", "charmAeugh", "charmGibsSad"
                    ]
                }, {
                    name: "Mwocha", id: "mwocha", oshimark: "📦‼️", emotes: [
                        "cry", "Dcolon", "headpat", "Leye", "mouth", "Reye", "omegaLUL", "smug",
                        "ree", "bonk", "stare", "heart", "sit", "penlight", "blush",
                        "despair", "question", "tinfoilhat", "shelterin", "wow",
                        "placeh", "place", "plac", "pla", "placehold",
                        "placehold1", "placehold2", "placehold3", "placehold4"
                    ]
                }, {
                    name: "Mono Monet", id: "mono", oshimark: "💭🎨", emotes: [
                        "yay", "zzz", "cheers", "peek", "nerd", "hmm",
                        "smile.gif", "munch", "thumbsup", "patpat", "juice", "hearts",
                        "penlight", "love", "dogeza", "bonk", "mytabemono", "cibostare",
                        "comfymono", "pienmono", "angelmono", "flopmono", "screamono"
                    ]
                }, {
                    name: "Neuro", id: "neuro", oshimark: "💜", emotes: [
                        "vedalDance.gif", "vedalExcite.gif", "vedalCheer.gif", "vedalEvilGiggle.gif",
                        "vedalWave.gif", "vedalNURU.gif", "vedalEvilCheer.gif", "vedalHUH",
                        "vedalBedge", "vedalGymbag", "vedalBased", "vedalAYAYA", "vedalLewd",
                        "vedalEep", "vedalFlustered", "vedalGlare", "vedalWeird", "vedalFiltered",
                        "vedalHappy", "vedalHeart", "vedalNeuroHUH", "vedalLurk", "vedalErm",
                        "vedalCross", "vedalCry", "vedalPeek", "vedalStunned", "vedalTehe",
                        "vedalErmFish", "vedalOmega", "vedalUUH", "vedalBwaa", "vedalBonk",
                        "vedalClown", "vedalDepress", "vedalEvil", "vedalHmph", "vedalJam",
                        "vedalMagnify", "vedalNo", "vedalYes", "vedalPet", "vedalPlead",
                        "vedalPray", "vedalEvilWave", "vedalWow", "vedalYan", "vedalBread",
                        "vedalCool", "vedalDoom", "vedalEye", "vedalPipes", "vedalScream",
                        "vedalSurprise", "vedalOk", "vedalEwNo", "vedalFacepalm", "vedalRage",
                        "vedalShrug", "vedalSus", "vedalWhatever", "vedalShy", "vedalRun",
                        "vedalDespair", "vedalCelebrate", "vedalTwinPeek", "vedalStonks", "vedalSad"
                    ]
                }, {
                    name: "Poko Rakun", id: "poko", oshimark: "🔑", emotes: [
                        "PokoYessir", "PokoHeart", "PokoChad", "PokoConfused", "PokoPanik", "PokoMouth",
                        "PokoPat", "PokoAngry", "PokoSmug", "PokoBlush", "PokoGlare", "PokoTired",
                        "PokoComfy", "PokoOver", "PokoCool", "PokoSweat", "PokoAbenee", "PokoSmile",
                        "PokoDed", "PokoUgh", "PokoStand", "PokoStare", "PokoCry", "PokoThumbsUp",
                        "PokoHype", "PokoGlance", "PokoEyes", "PokoMunch", "PokoCope",
                        "pokora1Angy", "pokora1Smug", "pokora1Mouth", "pokora1Hype", "pokora1Cope",
                        "pokora1SPIN.gif", "pokora1STOP.gif", "pokora1Hug.gif", "pokora1Dance.gif",
                        "pokora1Cool.gif", "pokora1Crying.gif", "pokora1Yab.gif", "pokora1Goofy.gif",
                        "pokora1Sigh.gif", "pokora1Clingy.gif", "pokora1Mad.gif", "pokora1Pat.gif",
                        "pokora1Ded.gif", "pokora1Sleep.gif", "pokora1Eating.gif", "pokora1Loading.gif",
                        "pokora1Drool.gif", "pokora1Prayge.gif", "pokora1Sleeping.gif", "pokora1UUU.gif",
                        "pokora1JAIL.gif", "pokora1Salute", "pokora1What", "pokora1ThumbsUp", "pokora1Look",
                        "pokora1Cry", "pokora1Bonk", "pokora1Stare", "pokora1SWEAT", "pokora1SAD", "pokora1SHY",
                        "pokora1WOW", "pokora1HEART", "pokora1Abenee", "pokora1Disappointed",
                        "pokora1UGH", "pokora1BLUSH", "pokora1HIT", "pokora1Woah"
                    ]
                }, {
                    name: "Rara Rocora", id: "rara", oshimark: "🕹🐾", emotes: [
                        "YouGotThis", "Stressed", "Puzzled", "Shocked", "Flustered", "Confident",
                        "Tease", "Apologetic", "4KRara", "Penlight", "Loading", "Headpats",
                        "Nerd", "Pinching", "HUH", "TismGaze", "Sobbing", "MeowMeow",
                        "WforWaf", "AforWaf", "FforWaf", "WAFWAF", "Bro", "YESYESYES", "HIC"
                    ]
                }, {
                    name: "Roca Rourin", id: "roca", oshimark: "⚡️", emotes: [
                        "RocaBlush", "RocaCheer", "RocaSmug", "RocaCry", "RocaShock",
                        "RocaAngry", "RocaGloat", "RocaLove", "RocaWink", "RocaLmao",
                        "RocaEvil", "RocaRocks", "RocaRocksM", "RocaNerd", "RocaUhm",
                        "RocaPinch", "RocaHmph", "RocaShrug", "RocaMunnie"
                    ]
                }, {
                    name: "Serina Maiko", id: "serina", oshimark: "🏹🦋", emotes: [
                        "penlight", "heart", "scared", "cry", "angry", "wheeze", "raid",
                        "cozy", "lurk", "shy", "tease", "cute", "notes", "hiiii", "sleepy",
                        "awe", "celebrate", "headpat", "thumbsup", "charmed", "sadge"
                    ]
                }, {
                    name: "Spineys", id: "spiney", oshimark: "🎐", emotes: [
                        "spineyDOOM.gif", "spineyHEH.gif", "spineyFINGER.gif", "spineyCONFUSED.gif",
                        "spineyLICK.gif", "spineyNOTED.gif", "spineyCOOL.gif", "spineyHYPE.gif",
                        "spineyLURK.gif", "spineyHEART.gif", "spineyPANIK.gif", "spineyBABY.gif",
                        "spineySALUTE.gif", "spineyKEK.gif", "spineyBEEPBOOP.gif", "spineyLoading.gif",
                        "spineyCry.gif", "spineyAH", "spineySOB", "spineyGLANCE", "spineySCARE",
                        "spineyPAT", "spineyMUNCH", "spineyDEADGE", "spineyPARTY"
                    ]
                }, {
                    name: "Terra 404", id: "terra", oshimark: "🚩⚠️", emotes: [
                        "Headpat", "Cheer", "Dab", "Fite", "Shock", "Cool", "Sweat",
                        "Think", "Salute", "Derp", "Loser", "RedFlag", "Mad", "Love",
                        "Cry", "Lol", "Chicken", "Rawr", "Hii", "ook", "Dino5",
                        "TerrAhoge", "404T", "404E", "404R", "404A"
                    ]
                }, {
                    name: "Yuuna Nini", id: "yuuna", oshimark: "🥖", emotes: [
                        "yuunaPatpat", "yuunaPeek", "yuunaRingoshock", "yuunaAyamepls", "yuunaBred",
                        "yuunaPat.gif", "yuunaWiggle.gif", "yuunaHopping.gif", "yuunaBonk.gif",
                        "yuunaMumumumu.gif", "yuunaTehepero.gif", "yuunaNyommers.gif", "yuunaBEAM.gif",
                        "yuunaHuggu.gif", "yuunaNodders.gif", "yuunaComf", "yuunaMEGApien",
                        "yuunaWakuwaku", "yuunaSemicolonthree", "yuunaHype", "yuunaUppies", "yuunaSiiiiip",
                        "yuunaDoom", "yuunaPengupray", "yuunaLurk", "yuunaZOOM", "yuunaWatdafuk",
                        "yuunaBreadge", "yuunaTiredge", "yuunaAngy", "yuunaHeart", "yuunaCool", "yuunaLUL",
                        "yuunaSmug", "yuunaSleepy", "yuunaNotlikethis", "yuunaHuhu", "yuunaUhoh",
                        "yuunaPainini", "yuunaLove", "yuunaYawn", "yuunaHawawa", "yuunaNYAHO", "yuunaVery",
                        "yuunaBEEEG", "yuunaHat", "yuunaFrieren", "yuunaThumbsup", "yuunaZelleme30000",
                        "yuunaFlustered", "yuunaGalaxy", "yuunaYURETE", "yuunaUweh", "yuunaNyaruhodont",
                        "yuunaNEEE", "yuunaOmegalul", "yuunaShrug", "yuunaRingo", "yuunaAyame",
                        "yuunaComfy", "yuunaBeaches", "yuunaMya"
                    ]
                }]
            }]
        }]
    };

    const settings = loadSettings();

    checkMissingEmotes();

    let curCategory;
    let curSubcategory;
    let curMember;

    let emoteSelectContainer;

    // Run immediately if QR is open on script load (can happen when reloading a page after clicking a post to reply to it). Small delay to allow themes to load first.
    if ($('form#quick-reply').length > 0) setTimeout(injectEmoteBox(), 10);

    // Run the script whenever QR is opened
    $(window).on('quick-reply', injectEmoteBox);

    function injectEmoteBox() {
        $('form#quick-reply input[name="subject"]').after(
            $('<div id="emote-menu" style="float: right; display: flex; width: 20px; height: 22px; margin: 0px; padding: 0px; align-items: center; justify-content: center; cursor:pointer;">')
                .append(
                    $('<img src="/static/emotes/ina/_tehepero.png" alt="Emotes" title="Emotes" style="width: 16px; height: 16px; margin: 0px 0px 1px;">')
                )
        ).css('max-width', 'calc(100% - 22px)');

        if (!emoteSelectContainer) {
            emoteSelectContainer = $(`<tr id="emote-select"><td colspan="2">
                <div style="display:flex; flex-wrap:nowrap;">
                    <select id="emote-category-select" style="flex:2"></select>
                    <select id="emote-talent-select" style="flex:3"></select>
                </div><div id="emote-list" style="
                    overflow-y: auto;
                    resize: vertical;
                    max-height: max-content;
                    min-height: 40px;
                    min-width: 100%;
                    margin-bottom: 2px;
                    display: grid;
                    grid-template-rows: 40px;
                    grid-auto-rows: 40px;
                    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
                    justify-items: center;
                    height: ${settings.emoteListHeight}px;
                "></div></td></tr>`);
        }

        $('form#quick-reply td.submit').closest('tr').after(emoteSelectContainer);

        // Initialize
        populateCategories();
        populateTalentList();
        populateButtons();

        // Initial state
        emoteSelectContainer.toggle(settings.show || false);

        // Handle show/hide button
        $('div#emote-menu').on('click', function () {
            settings.show = emoteSelectContainer.toggle().is(':visible');
            saveSettings();
        });

        // Handle category change
        $('select#emote-category-select').change(function () {
            settings.lastCategory = $(this).val();
            curCategory = emotes_db.categories.find(cat => cat.name === settings.lastCategory);
            populateTalentList();
            $('select#emote-talent-select').change(); // trigger talent change
        });

        // Handle talent change
        $('select#emote-talent-select').change(function () {
            settings.lastMembers[curCategory.name] = $(this).val();
            curSubcategory = curCategory.subcategories.find(subcat => subcat.members.find(member => member.id === settings.lastMembers[curCategory.name]));
            curMember = curSubcategory.members.find(member => member.id === settings.lastMembers[settings.lastCategory]);
            saveSettings();
            populateButtons();
        });

        // Remember emote list height
        $("#quick-reply #emote-list").on("mousedown", (e) => {
            if (e.target !== e.currentTarget) return;
            window.addEventListener("mouseup", () => {
                const height = $("#quick-reply #emote-list").height();
                if (height !== settings.emoteListHeight) {
                    settings.emoteListHeight = height;
                    saveSettings();
                }
            }, { once: true });
        });

        // Handle emote button click
        $('#quick-reply #emote-list').on('click', function (e) {
            if (!$(e.target).is('img')) return;

            const emoteCode = $(e.target).data('shortcode');
            const $textarea = $('form#quick-reply textarea#body');
            const cursorPosition = $textarea[0].selectionStart || 0;
            const val = $textarea.val();
            $textarea.val(val.substring(0, cursorPosition) + emoteCode + val.substring(cursorPosition));
            $textarea[0].setSelectionRange(cursorPosition + emoteCode.length, cursorPosition + emoteCode.length);
            $textarea[0].focus();
        });
    }

    function populateCategories() {
        const $categorySelect = $('form#quick-reply select#emote-category-select');
        $categorySelect.empty();
        $.each(emotes_db.categories, function (index, category) {
            const $categoryOption = $('<option value="' + category.name + '">' + category.name + '</option>');

            // Preselect last category and store the object
            if (category.name === settings.lastCategory) {
                $categoryOption.prop('selected', true);
                curCategory = category;
            }

            $categorySelect.append($categoryOption);
        });
    }

    function populateTalentList() {
        const $talentSelect = $('form#quick-reply select#emote-talent-select');
        $talentSelect.empty();

        curMember = curCategory.subcategories[0].members[0];

        // Fetch all subcategories and their members
        $.each(curCategory.subcategories, function (index, subcategory) {
            const $optgroup = $('<optgroup label="' + subcategory.name + '"></optgroup>').css('font-style', 'normal');
            $talentSelect.append($optgroup);

            $.each(subcategory.members, function (index, member) {
                const displayName = member.name + (member.oshimark ? ' ' + member.oshimark : '');
                const $talentOption = $('<option value="' + member.id + '">' + displayName + '</option>');

                // Preselect last member and store the object
                if (member.id === settings.lastMembers[curCategory.name]) {
                    $talentOption.prop('selected', true);
                    curSubcategory = subcategory;
                    curMember = member;
                }

                $optgroup.append($talentOption);
            });
        });
    }

    function populateButtons() {
        const $emoteList = $('form#quick-reply #emote-list');
        $emoteList.empty();

        $.each(curMember.emotes, function (index, emote) {
            if (!emote) return;
            let filename;
            if (emote.endsWith('.gif')) {
                emote = emote.slice(0, -4);
                filename = curMember.id + '/_' + emote + '.gif';
            } else {
                filename = curMember.id + '/_' + emote + '.png';
            }
            const emoteCode = ':' + curMember.id + '.' + emote + ':';

            $emoteList.append(
                $(`<img src="/static/emotes/${filename}" alt="${emoteCode}" title="${emoteCode}" data-shortcode="${emoteCode}" style="width: 40px; height: 40px; display: block; cursor: pointer">`)
                    .on('error', function () { $(this).remove(); })
            );
        });

        // Firefox height hacky fix
        if ((navigator.userAgent.indexOf("Firefox") != -1)) {
            $emoteList.css('max-height', settings.emoteListHeight);

            // estimate height
            const rowHeight = 40 // emote height in pixel
            const emotesPerRow = 7
            const rows = Math.ceil(curMember.emotes.length / emotesPerRow);
            $emoteList.css('height', rowHeight * rows);

            setTimeout(() => {
                const lastChildTop = Math.max($emoteList[0].scrollHeight, $emoteList.height());
                $emoteList.css('max-height', lastChildTop);

                if ($emoteList.height() > lastChildTop) {
                    $emoteList.height(lastChildTop);
                } else {
                    $emoteList.height(
                        Math.min(
                            lastChildTop,
                            settings.emoteListHeight
                        )
                    );
                }
            }, 1);
        }
    }

    function saveSettings() {
        localStorage.setItem('emoteMenu', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('emoteMenu') || '{}');

        if (emotes_db.categories.find(cat => cat.name === savedSettings.lastCategory) === undefined) {
            savedSettings.lastCategory = emotes_db.categories[0].name;
        }

        // Clean up lastMembers from deleted categories
        if (savedSettings.lastMembers !== undefined) {
            for (const [categoryName, memberId] of Object.entries(savedSettings.lastMembers)) {
                if (!emotes_db.categories.some(cat => cat.name === categoryName && cat.subcategories.some(subcat => subcat.members.some(mem => mem.id === memberId)))) {
                    delete savedSettings.lastMembers[categoryName];
                }
            }
        }

        return {
            show: savedSettings.show ?? false,
            lastCategory: savedSettings.lastCategory ?? emotes_db.categories[0].name,
            lastMembers: savedSettings.lastMembers ?? { [emotes_db.categories[0].name]: emotes_db.categories[0].subcategories[0].members[0].id },
            emoteListHeight: parseInt(savedSettings.emoteListHeight) || 120,
            cachedEmotes: {
                lastModified: parseInt(savedSettings.cachedEmotes?.lastModified) || 0,
                emptyMembers: savedSettings.cachedEmotes?.emptyMembers || [],
                emotes: savedSettings.cachedEmotes?.emotes || []
            },
        };
    }

    function checkMissingEmotes() {
        // Generate a reverse lookup table to get category/subcategory from member name
        const reverseTable = {};
        emotes_db.categories.forEach((cat, catIndex) => {
            cat.subcategories.forEach((subcat, subIndex) => {
                subcat.members.forEach(mem => {
                    reverseTable[mem.id] = [catIndex, subIndex];
                });
            });
        });

        // Remove stored empty members (members that exist in emotes_db but did not have a single emote in emotes_list.json when it was last checked)
        settings.cachedEmotes.emptyMembers.forEach(mem => {
            if (reverseTable[mem] === undefined) return;
            const [cat, subcat] = reverseTable[mem];
            emotes_db.categories[cat].subcategories[subcat].members = emotes_db.categories[cat].subcategories[subcat].members.filter(m => m.id !== mem);
            delete reverseTable[mem];
        });

        // Add cached emotes from storage
        const stored = settings.cachedEmotes.emotes;
        for (let i = stored.length - 1; i >= 0; i--) {
            const [categoryId, emoteName] = stored[i];
            // Get category/subcategory based on emote.category (member name), if not found use the last category/subcategory
            const [cat, subcat] = reverseTable[categoryId] || [emotes_db.categories.length - 1, emotes_db.categories[emotes_db.categories.length - 1].subcategories.length - 1];

            // Get member object from emotes_db
            let mem = emotes_db.categories[cat].subcategories[subcat].members.find(m => m.id === categoryId);

            // If member not found, add it
            if (mem === undefined) {
                const memIdx = emotes_db.categories[cat].subcategories[subcat].members.push({ id: categoryId, name: categoryId, emotes: [] });
                mem = emotes_db.categories[cat].subcategories[subcat].members[memIdx - 1];
                reverseTable[categoryId] = [cat, subcat];
            }

            // If duplicate emote (likely the script was updated to hardcode the emote), remove it from storage. Otherwise add it to the member's emotes in emotes_db.
            if (mem.emotes.includes(emoteName)) {
                stored.splice(i, 1);
                continue;
            } else {
                mem.emotes.push(emoteName);
            }
        }

        // Check remote json
        fetch(document.location.origin + '/static/emotes/emotes_list.json')
            .then(response => {
                const lastModified = new Date(response.headers.get('Last-Modified')).getTime();
                // Check if emotes_list.json has changed since last time to avoid unnecessary processing
                if (lastModified <= settings.cachedEmotes.lastModified) return Promise.reject("NotModified");
                settings.cachedEmotes.lastModified = lastModified;
                return response.json();
            }).then(data => {
                if (!data?.length) return;

                // Remove empty members (members that exist in emotes_db but have no emotes in emotes_list.json) and store their names
                const uniqueMembers = new Set(data.map(item => item.category));
                const missing = Object.keys(reverseTable).filter(name => !uniqueMembers.has(name));
                if (missing.length > 0) {
                    settings.cachedEmotes.emptyMembers = missing;
                    for (const mem of missing) {
                        const [cat, subcat] = reverseTable[mem];
                        emotes_db.categories[cat].subcategories[subcat].members = emotes_db.categories[cat].subcategories[subcat].members.filter(m => m.id !== mem);
                        delete reverseTable[mem];
                    }
                }

                // Loop through each emote
                data.forEach(emote => {
                    // Get category/subcategory based on emote.category (member name), if not found use the last category/subcategory
                    const [cat, subcat] = reverseTable[emote.category] || [emotes_db.categories.length - 1, emotes_db.categories[emotes_db.categories.length - 1].subcategories.length - 1];

                    // Get member object
                    let mem = emotes_db.categories[cat].subcategories[subcat].members.find(m => m.id === emote.category);

                    // If member not found, add it
                    if (mem === undefined) {
                        const memIdx = emotes_db.categories[cat].subcategories[subcat].members.push({ id: emote.category, name: emote.category, emotes: [] });
                        mem = emotes_db.categories[cat].subcategories[subcat].members[memIdx - 1];
                        reverseTable[emote.category] = [cat, subcat];
                    }

                    // emotes_db only stores the emote name. If this is a gif, mark it as such
                    if (emote.url.slice(-4) === ".gif")
                        emote.name += ".gif";

                    // If not a duplicate, add to the emotes_db member object
                    if (mem.emotes.includes(emote.name)) {
                        return;
                    } else {
                        settings.cachedEmotes.emotes.push([emote.category, emote.name]);
                        mem.emotes.push(emote.name);
                    }

                });
                saveSettings();
            }).catch(() => { });
    }
})();