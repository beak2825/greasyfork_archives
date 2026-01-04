// ==UserScript==
// @name         Project T-tick
// @author       Rat Mike
// @description  Good boost tick
// @version      v2
// @icon
// @match        *://*.moomoo.io/*
// @grant        none
// @1.1       Daddy
// @1.2       Chupapi
// @namespace https://greasyfork.org/users/843325
// @downloadURL https://update.greasyfork.org/scripts/476433/Project%20T-tick.user.js
// @updateURL https://update.greasyfork.org/scripts/476433/Project%20T-tick.meta.js
// ==/UserScript==

var አህሳ = "ክር",
    ትከፍታለህ = [0];
for (let e = 0; e < 3; e++) {
    let e = "አመሳስል";
    ትከፍታለህ.push[e]
}
window.devicePixelRatio2 = 1, window.FRVR = 0;
const antiBug = !1;
setTimeout((() => {
    antiBug = !0
}), 0);
let webskt, bot = 3,
    isConnected = !1,
    myConfig = {
        x: 0,
        y: 0,
        clan: void 0,
        dir: 0,
        safeDir: 0,
        nearDist: void 0,
        nearAim: 0
    },
    botConfig = {
        waitHeal: !1,
        botJoin: !1,
        stop: !1,
        atck: !1,
        nearDst: 4444
    };
WebSocket.prototype.oldSend = WebSocket.prototype.send, WebSocket.prototype.send = function (e) {
    webskt || (webskt = this), this.oldSend(e)
};
let randomcowname = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];

function bConnect(e, t, n) {
    let i = new WebSocket(webskt.url.split("&")[0] + "&token=" + encodeURIComponent(e));
    i.binaryType = "arraybuffer", i.botthing = t, i.weapons = [0], i.fixItems = [0, 3, 6, 10], i.waitHeal = !1, i.testTickCount = 0, i.lessmove = void 0, i.chat = !1, i.plced = 0, i.healed = 0, i.hatted = 0, i.gather = !0, i.uplist = {
        one: !0,
        two: !0,
        three: !0,
        four: !0,
        five: !0,
        six: !0,
        seven: !0,
        eight: !0
    };

    function s(e) {
        i.send(new Uint8Array(Array.from(window.msgpack.encode(e))))
    }

    function a(e, t) {
        i.stop ? (s(["5", [i.fixItems[e]]]), s(["c", [1, t]]), s(["c", [0, t]]), s(["5", [i.weapon, 1]])) : (s(["5", [i.fixItems[e]]]), s(["c", [1, t]]), s(["5", [i.weapon, 1]]), s(["c", [1, t]]))
    }

    function r() {
        i.fixItems = [0, 3, 6, 10], i.weapons = [0], i.age = 0, s(["sp", [{
            name: "fan",
            moofoll: 1,
            skin: Math.floor(10 * Math.random())
        }]])
    }
    i.onmessage = function (e) {
        let n, o = window.msgpack.decode(new Uint8Array(e.data));
        o.length > 1 ? (n = [o[0], ...o[1]], n[1]) : n = o;
        let l = n[0];
        if (n && ("1" == l && null == i.id && (i.id = n[1]), "17" == n[0] && n[1] && (n[2] ? i.weapons = n[1] : i.fixItems = n[1]), "11" == n[0] && r(), "15" == n[0] && (i.age = n[3]), "h" == l && n[1] == i.id && (i.healed = Math.floor(2 * Math.random()), 1 == i.healed ? a(0) : setTimeout((() => {
                a(0)
            }), 120)), "33" == n[0])) {
            i.testTickCount++;
            for (let e = 0; e < n[1].length / 13; e++) {
                let r = n[1].slice(13 * e, 13 * e + 13);
                r[0] == i.id && (i.id = r[0], i.x = r[1], i.y = r[2], i.dir = r[3], i.object = r[4], i.weapon = r[5], i.clan = r[7], i.isLeader = r[8], i.hat = r[9], i.accessory = r[10], i.isSkull = r[11]), i.testTickCount % 3 == 0 && (i.gather && (i.gather = !1), botConfig.stop ? (i.chat && (i.chat = !1, s(["ch", ["stop: " + t]])), null != i.lessmove && (i.lessmove = void 0, s(["33", [i.lessmove]])), i.attack && (i.attack = !1, s(["c", [0]])), i.stop = !0) : (i.attack || (i.attack = !0, s(["c", [1]])), i.chat || (i.chat = !0, s(["ch", ["move: " + t]])), i.stop = !1, myConfig.clan && i.clan != myConfig.clan && s(["10", [myConfig.clan]]), myConfig.nearDist && botConfig.atck ? i.lessmove != myConfig.nearAim(i) && (i.lessmove = myConfig.nearAim(i), s(["33", [i.lessmove]]), s(["2", [i.lessmove]])) : objectDist(myConfig, i) >= 200 && objectDist(myConfig, i) <= 250 ? null != i.lessmove && (i.lessmove = void 0, s(["33", [i.lessmove]])) : objectDist(myConfig, i) < 200 ? i.lessmove != objectPlace(myConfig, i) + Math.PI && (i.lessmove = objectPlace(myConfig, i) + Math.PI, s(["33", [i.lessmove]]), s(["2", [i.lessmove]])) : objectDist(myConfig, i) > 250 && i.lessmove != objectPlace(myConfig, i) && (i.lessmove = objectPlace(myConfig, i), s(["33", [i.lessmove]]), s(["2", [i.lessmove]]))), i.hatted++, i.y <= 2400 ? 15 != i.hat && i.hatted % 2 == 0 ? s(["13c", [1, 15, 0]]) : s(["13c", [0, 15, 0]]) : i.y >= 6838 && i.y <= 7562 ? 31 != i.hat && i.hatted % 2 == 0 ? s(["13c", [1, 31, 0]]) : s(["13c", [0, 31, 0]]) : myConfig.nearDist && botConfig.nearDst(i) <= 350 ? 6 != i.hat && i.hatted % 2 == 0 ? s(["13c", [1, 6, 0]]) : s(["13c", [0, 6, 0]]) : 12 != i.hat && i.hatted % 2 == 0 ? s(["13c", [1, 12, 0]]) : s(["13c", [0, 12, 0]])), i.testTickCount % 6 == 0 && (myConfig.nearDist && botConfig.atck || i.plced <= 99 && objectDist(myConfig, i) >= 400 && (i.plced++, a(3, objectPlace(myConfig, i) + Math.PI)))
            }
        }
    }, i.onopen = function () {
        isConnected = !0, r(), i.botjoin = !0
    }, i.onclose = function () {
        isConnected = !1
    }
}

function objectPlace(e, t) {
    return Math.atan2(e.y - t.y, e.x - t.x)
}

function objectDist(e, t) {
    return Math.hypot(e.y - t.y, e.x - t.x)
}
window.urName = "ohio";
const ohio = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1053956723704074270/ohio.mp3"),
    goofy = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1053978907717685288/ahh.mp3"),
    ohiosong = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1053986654416818216/ohiosong.mp3"),
    madeinohio = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1053987827353927740/madeinohio.mp3"),
    song1 = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1055142773948428348/Zack_Merci_X_CRVN_-_Nobody_NCS_Release.mp3"),
    song2 = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1055516288249757797/ae86.mp3"),
    song3 = new Audio("https://cdn.discordapp.com/attachments/1053956635032289280/1069192210932826182/dontstandsoclose.mp3");
! function (e) {
    var t = {};

    function n(i) {
        if (t[i]) return t[i].exports;
        var s = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(s.exports, s, s.exports, n), s.l = !0, s.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var s in e) n.d(i, s, function (t) {
                return e[t]
            }.bind(null, s));
        return i
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = "./src/js/app.js")
}({
    "./node_modules/bad-words/lib/badwords.js":
        /*!************************************************!*\
          !*** ./node_modules/bad-words/lib/badwords.js ***!
          \************************************************/
        /*! no static exports found */
        function (e, t, n) {
            const i = n( /*! ./lang.json */ "./node_modules/bad-words/lib/lang.json").words,
                s = n( /*! badwords-list */ "./node_modules/badwords-list/lib/index.js").array;
            e.exports = class {
                constructor(e = {}) {
                    Object.assign(this, {
                        list: e.emptyList && [] || Array.prototype.concat.apply(i, [s, e.list || []]),
                        exclude: e.exclude || [],
                        placeHolder: e.placeHolder || "*",
                        regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                        replaceRegex: e.replaceRegex || /\w/g
                    })
                }
                isProfane(e) {
                    return this.list.filter((t => {
                        const n = new RegExp(`\\b${t.replace(/(\W)/g,"\\$1")}\\b`, "gi");
                        return !this.exclude.includes(t.toLowerCase()) && n.test(e)
                    })).length > 0 || !1
                }
                replaceWord(e) {
                    return e.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder)
                }
                clean(e) {
                    return e.split(/\b/).map((e => this.isProfane(e) ? this.replaceWord(e) : e)).join("")
                }
                addWords() {
                    let e = Array.from(arguments);
                    this.list.push(...e), e.map((e => e.toLowerCase())).forEach((e => {
                        this.exclude.includes(e) && this.exclude.splice(this.exclude.indexOf(e), 1)
                    }))
                }
                removeWords() {
                    this.exclude.push(...Array.from(arguments).map((e => e.toLowerCase())))
                }
            }
        },
    "./node_modules/bad-words/lib/lang.json":
        /*!**********************************************!*\
          !*** ./node_modules/bad-words/lib/lang.json ***!
          \**********************************************/
        /*! exports provided: words, default */
        function (e) {
            e.exports = {
                words: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]
            }
        },
    "./node_modules/badwords-list/lib/array.js":
        /*!*************************************************!*\
          !*** ./node_modules/badwords-list/lib/array.js ***!
          \*************************************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]
        },
    "./node_modules/badwords-list/lib/index.js":
        /*!*************************************************!*\
          !*** ./node_modules/badwords-list/lib/index.js ***!
          \*************************************************/
        /*! no static exports found */
        function (e, t, n) {
            e.exports = {
                object: n( /*! ./object */ "./node_modules/badwords-list/lib/object.js"),
                array: n( /*! ./array */ "./node_modules/badwords-list/lib/array.js"),
                regex: n( /*! ./regexp */ "./node_modules/badwords-list/lib/regexp.js")
            }
        },
    "./node_modules/badwords-list/lib/object.js":
        /*!**************************************************!*\
          !*** ./node_modules/badwords-list/lib/object.js ***!
          \**************************************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = {
                "4r5e": 1,
                "5h1t": 1,
                "5hit": 1,
                a55: 1,
                anal: 1,
                anus: 1,
                ar5e: 1,
                arrse: 1,
                arse: 1,
                ass: 1,
                "ass-fucker": 1,
                asses: 1,
                assfucker: 1,
                assfukka: 1,
                asshole: 1,
                assholes: 1,
                asswhole: 1,
                a_s_s: 1,
                "b!tch": 1,
                b00bs: 1,
                b17ch: 1,
                b1tch: 1,
                ballbag: 1,
                balls: 1,
                ballsack: 1,
                bastard: 1,
                beastial: 1,
                beastiality: 1,
                bellend: 1,
                bestial: 1,
                bestiality: 1,
                "bi+ch": 1,
                biatch: 1,
                bitch: 1,
                bitcher: 1,
                bitchers: 1,
                bitches: 1,
                bitchin: 1,
                bitching: 1,
                bloody: 1,
                "blow job": 1,
                blowjob: 1,
                blowjobs: 1,
                boiolas: 1,
                bollock: 1,
                bollok: 1,
                boner: 1,
                boob: 1,
                boobs: 1,
                booobs: 1,
                boooobs: 1,
                booooobs: 1,
                booooooobs: 1,
                breasts: 1,
                buceta: 1,
                bugger: 1,
                bum: 1,
                "bunny fucker": 1,
                butt: 1,
                butthole: 1,
                buttmuch: 1,
                buttplug: 1,
                c0ck: 1,
                c0cksucker: 1,
                "carpet muncher": 1,
                cawk: 1,
                chink: 1,
                cipa: 1,
                cl1t: 1,
                clit: 1,
                clitoris: 1,
                clits: 1,
                cnut: 1,
                cock: 1,
                "cock-sucker": 1,
                cockface: 1,
                cockhead: 1,
                cockmunch: 1,
                cockmuncher: 1,
                cocks: 1,
                cocksuck: 1,
                cocksucked: 1,
                cocksucker: 1,
                cocksucking: 1,
                cocksucks: 1,
                cocksuka: 1,
                cocksukka: 1,
                cok: 1,
                cokmuncher: 1,
                coksucka: 1,
                coon: 1,
                cox: 1,
                crap: 1,
                cum: 1,
                cummer: 1,
                cumming: 1,
                cums: 1,
                cumshot: 1,
                cunilingus: 1,
                cunillingus: 1,
                cunnilingus: 1,
                cunt: 1,
                cuntlick: 1,
                cuntlicker: 1,
                cuntlicking: 1,
                cunts: 1,
                cyalis: 1,
                cyberfuc: 1,
                cyberfuck: 1,
                cyberfucked: 1,
                cyberfucker: 1,
                cyberfuckers: 1,
                cyberfucking: 1,
                d1ck: 1,
                damn: 1,
                dick: 1,
                dickhead: 1,
                dildo: 1,
                dildos: 1,
                dink: 1,
                dinks: 1,
                dirsa: 1,
                dlck: 1,
                "dog-fucker": 1,
                doggin: 1,
                dogging: 1,
                donkeyribber: 1,
                doosh: 1,
                duche: 1,
                dyke: 1,
                ejaculate: 1,
                ejaculated: 1,
                ejaculates: 1,
                ejaculating: 1,
                ejaculatings: 1,
                ejaculation: 1,
                ejakulate: 1,
                "f u c k": 1,
                "f u c k e r": 1,
                f4nny: 1,
                fag: 1,
                fagging: 1,
                faggitt: 1,
                faggot: 1,
                faggs: 1,
                fagot: 1,
                fagots: 1,
                fags: 1,
                fanny: 1,
                fannyflaps: 1,
                fannyfucker: 1,
                fanyy: 1,
                fatass: 1,
                fcuk: 1,
                fcuker: 1,
                fcuking: 1,
                feck: 1,
                fecker: 1,
                felching: 1,
                fellate: 1,
                fellatio: 1,
                fingerfuck: 1,
                fingerfucked: 1,
                fingerfucker: 1,
                fingerfuckers: 1,
                fingerfucking: 1,
                fingerfucks: 1,
                fistfuck: 1,
                fistfucked: 1,
                fistfucker: 1,
                fistfuckers: 1,
                fistfucking: 1,
                fistfuckings: 1,
                fistfucks: 1,
                flange: 1,
                fook: 1,
                fooker: 1,
                fuck: 1,
                fucka: 1,
                fucked: 1,
                fucker: 1,
                fuckers: 1,
                fuckhead: 1,
                fuckheads: 1,
                fuckin: 1,
                fucking: 1,
                fuckings: 1,
                fuckingshitmotherfucker: 1,
                fuckme: 1,
                fucks: 1,
                fuckwhit: 1,
                fuckwit: 1,
                "fudge packer": 1,
                fudgepacker: 1,
                fuk: 1,
                fuker: 1,
                fukker: 1,
                fukkin: 1,
                fuks: 1,
                fukwhit: 1,
                fukwit: 1,
                fux: 1,
                fux0r: 1,
                f_u_c_k: 1,
                gangbang: 1,
                gangbanged: 1,
                gangbangs: 1,
                gaylord: 1,
                gaysex: 1,
                goatse: 1,
                God: 1,
                "god-dam": 1,
                "god-damned": 1,
                goddamn: 1,
                goddamned: 1,
                hardcoresex: 1,
                hell: 1,
                heshe: 1,
                hoar: 1,
                hoare: 1,
                hoer: 1,
                homo: 1,
                hore: 1,
                horniest: 1,
                horny: 1,
                hotsex: 1,
                "jack-off": 1,
                jackoff: 1,
                jap: 1,
                "jerk-off": 1,
                jism: 1,
                jiz: 1,
                jizm: 1,
                jizz: 1,
                kawk: 1,
                knob: 1,
                knobead: 1,
                knobed: 1,
                knobend: 1,
                knobhead: 1,
                knobjocky: 1,
                knobjokey: 1,
                kock: 1,
                kondum: 1,
                kondums: 1,
                kum: 1,
                kummer: 1,
                kumming: 1,
                kums: 1,
                kunilingus: 1,
                "l3i+ch": 1,
                l3itch: 1,
                labia: 1,
                lust: 1,
                lusting: 1,
                m0f0: 1,
                m0fo: 1,
                m45terbate: 1,
                ma5terb8: 1,
                ma5terbate: 1,
                masochist: 1,
                "master-bate": 1,
                masterb8: 1,
                "masterbat*": 1,
                masterbat3: 1,
                masterbate: 1,
                masterbation: 1,
                masterbations: 1,
                masturbate: 1,
                "mo-fo": 1,
                mof0: 1,
                mofo: 1,
                mothafuck: 1,
                mothafucka: 1,
                mothafuckas: 1,
                mothafuckaz: 1,
                mothafucked: 1,
                mothafucker: 1,
                mothafuckers: 1,
                mothafuckin: 1,
                mothafucking: 1,
                mothafuckings: 1,
                mothafucks: 1,
                "mother fucker": 1,
                motherfuck: 1,
                motherfucked: 1,
                motherfucker: 1,
                motherfuckers: 1,
                motherfuckin: 1,
                motherfucking: 1,
                motherfuckings: 1,
                motherfuckka: 1,
                motherfucks: 1,
                muff: 1,
                mutha: 1,
                muthafecker: 1,
                muthafuckker: 1,
                muther: 1,
                mutherfucker: 1,
                n1gga: 1,
                n1gger: 1,
                nazi: 1,
                nigg3r: 1,
                nigg4h: 1,
                nigga: 1,
                niggah: 1,
                niggas: 1,
                niggaz: 1,
                nigger: 1,
                niggers: 1,
                nob: 1,
                "nob jokey": 1,
                nobhead: 1,
                nobjocky: 1,
                nobjokey: 1,
                numbnuts: 1,
                nutsack: 1,
                orgasim: 1,
                orgasims: 1,
                orgasm: 1,
                orgasms: 1,
                p0rn: 1,
                pawn: 1,
                pecker: 1,
                penis: 1,
                penisfucker: 1,
                phonesex: 1,
                phuck: 1,
                phuk: 1,
                phuked: 1,
                phuking: 1,
                phukked: 1,
                phukking: 1,
                phuks: 1,
                phuq: 1,
                pigfucker: 1,
                pimpis: 1,
                piss: 1,
                pissed: 1,
                pisser: 1,
                pissers: 1,
                pisses: 1,
                pissflaps: 1,
                pissin: 1,
                pissing: 1,
                pissoff: 1,
                poop: 1,
                porn: 1,
                porno: 1,
                pornography: 1,
                pornos: 1,
                prick: 1,
                pricks: 1,
                pron: 1,
                pube: 1,
                pusse: 1,
                pussi: 1,
                pussies: 1,
                pussy: 1,
                pussys: 1,
                rectum: 1,
                retard: 1,
                rimjaw: 1,
                rimming: 1,
                "s hit": 1,
                "s.o.b.": 1,
                sadist: 1,
                schlong: 1,
                screwing: 1,
                scroat: 1,
                scrote: 1,
                scrotum: 1,
                semen: 1,
                sex: 1,
                "sh!+": 1,
                "sh!t": 1,
                sh1t: 1,
                shag: 1,
                shagger: 1,
                shaggin: 1,
                shagging: 1,
                shemale: 1,
                "shi+": 1,
                shit: 1,
                shitdick: 1,
                shite: 1,
                shited: 1,
                shitey: 1,
                shitfuck: 1,
                shitfull: 1,
                shithead: 1,
                shiting: 1,
                shitings: 1,
                shits: 1,
                shitted: 1,
                shitter: 1,
                shitters: 1,
                shitting: 1,
                shittings: 1,
                shitty: 1,
                skank: 1,
                slut: 1,
                sluts: 1,
                smegma: 1,
                smut: 1,
                snatch: 1,
                "son-of-a-bitch": 1,
                spac: 1,
                spunk: 1,
                s_h_i_t: 1,
                t1tt1e5: 1,
                t1tties: 1,
                teets: 1,
                teez: 1,
                testical: 1,
                testicle: 1,
                tit: 1,
                titfuck: 1,
                tits: 1,
                titt: 1,
                tittie5: 1,
                tittiefucker: 1,
                titties: 1,
                tittyfuck: 1,
                tittywank: 1,
                titwank: 1,
                tosser: 1,
                turd: 1,
                tw4t: 1,
                twat: 1,
                twathead: 1,
                twatty: 1,
                twunt: 1,
                twunter: 1,
                v14gra: 1,
                v1gra: 1,
                vagina: 1,
                viagra: 1,
                vulva: 1,
                w00se: 1,
                wang: 1,
                wank: 1,
                wanker: 1,
                wanky: 1,
                whoar: 1,
                whore: 1,
                willies: 1,
                willy: 1,
                xrated: 1,
                xxx: 1
            }
        },
    "./node_modules/badwords-list/lib/regexp.js":
        /*!**************************************************!*\
          !*** ./node_modules/badwords-list/lib/regexp.js ***!
          \**************************************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi
        },
    "./node_modules/base64-js/index.js":
        /*!*****************************************!*\
          !*** ./node_modules/base64-js/index.js ***!
          \*****************************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            t.byteLength = function (e) {
                var t = c(e),
                    n = t[0],
                    i = t[1];
                return 3 * (n + i) / 4 - i
            }, t.toByteArray = function (e) {
                var t, n, i = c(e),
                    r = i[0],
                    o = i[1],
                    l = new a(function (e, t, n) {
                        return 3 * (t + n) / 4 - n
                    }(0, r, o)),
                    h = 0,
                    u = o > 0 ? r - 4 : r;
                for (n = 0; n < u; n += 4) t = s[e.charCodeAt(n)] << 18 | s[e.charCodeAt(n + 1)] << 12 | s[e.charCodeAt(n + 2)] << 6 | s[e.charCodeAt(n + 3)], l[h++] = t >> 16 & 255, l[h++] = t >> 8 & 255, l[h++] = 255 & t;
                2 === o && (t = s[e.charCodeAt(n)] << 2 | s[e.charCodeAt(n + 1)] >> 4, l[h++] = 255 & t);
                1 === o && (t = s[e.charCodeAt(n)] << 10 | s[e.charCodeAt(n + 1)] << 4 | s[e.charCodeAt(n + 2)] >> 2, l[h++] = t >> 8 & 255, l[h++] = 255 & t);
                return l
            }, t.fromByteArray = function (e) {
                for (var t, n = e.length, s = n % 3, a = [], r = 16383, o = 0, l = n - s; o < l; o += r) a.push(h(e, o, o + r > l ? l : o + r));
                1 === s ? (t = e[n - 1], a.push(i[t >> 2] + i[t << 4 & 63] + "==")) : 2 === s && (t = (e[n - 2] << 8) + e[n - 1], a.push(i[t >> 10] + i[t >> 4 & 63] + i[t << 2 & 63] + "="));
                return a.join("")
            };
            for (var i = [], s = [], a = "undefined" != typeof Uint8Array ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, l = r.length; o < l; ++o) i[o] = r[o], s[r.charCodeAt(o)] = o;

            function c(e) {
                var t = e.length;
                if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var n = e.indexOf("=");
                return -1 === n && (n = t), [n, n === t ? 0 : 4 - n % 4]
            }

            function h(e, t, n) {
                for (var s, a, r = [], o = t; o < n; o += 3) s = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]), r.push(i[(a = s) >> 18 & 63] + i[a >> 12 & 63] + i[a >> 6 & 63] + i[63 & a]);
                return r.join("")
            }
            s["-".charCodeAt(0)] = 62, s["_".charCodeAt(0)] = 63
        },
    "./node_modules/buffer/index.js":
        /*!**************************************!*\
          !*** ./node_modules/buffer/index.js ***!
          \**************************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            (function (e) {
                /*!
                 * The buffer module from node.js, for the browser.
                 *
                 * @author   Feross Aboukhadijeh <http://feross.org>
                 * @license  MIT
                 */
                var i = n( /*! base64-js */ "./node_modules/base64-js/index.js"),
                    s = n( /*! ieee754 */ "./node_modules/ieee754/index.js"),
                    a = n( /*! isarray */ "./node_modules/buffer/node_modules/isarray/index.js");

                function r() {
                    return l.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                }

                function o(e, t) {
                    if (r() < t) throw new RangeError("Invalid typed array length");
                    return l.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = l.prototype : (null === e && (e = new l(t)), e.length = t), e
                }

                function l(e, t, n) {
                    if (!(l.TYPED_ARRAY_SUPPORT || this instanceof l)) return new l(e, t, n);
                    if ("number" == typeof e) {
                        if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                        return u(this, e)
                    }
                    return c(this, e, t, n)
                }

                function c(e, t, n, i) {
                    if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                    return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, n, i) {
                        if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
                        if (t.byteLength < n + (i || 0)) throw new RangeError("'length' is out of bounds");
                        t = void 0 === n && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, n) : new Uint8Array(t, n, i);
                        l.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = l.prototype : e = d(e, t);
                        return e
                    }(e, t, n, i) : "string" == typeof t ? function (e, t, n) {
                        "string" == typeof n && "" !== n || (n = "utf8");
                        if (!l.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
                        var i = 0 | p(t, n);
                        e = o(e, i);
                        var s = e.write(t, n);
                        s !== i && (e = e.slice(0, s));
                        return e
                    }(e, t, n) : function (e, t) {
                        if (l.isBuffer(t)) {
                            var n = 0 | f(t.length);
                            return 0 === (e = o(e, n)).length || t.copy(e, 0, 0, n), e
                        }
                        if (t) {
                            if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (i = t.length) != i ? o(e, 0) : d(e, t);
                            if ("Buffer" === t.type && a(t.data)) return d(e, t.data)
                        }
                        var i;
                        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                    }(e, t)
                }

                function h(e) {
                    if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
                    if (e < 0) throw new RangeError('"size" argument must not be negative')
                }

                function u(e, t) {
                    if (h(t), e = o(e, t < 0 ? 0 : 0 | f(t)), !l.TYPED_ARRAY_SUPPORT)
                        for (var n = 0; n < t; ++n) e[n] = 0;
                    return e
                }

                function d(e, t) {
                    var n = t.length < 0 ? 0 : 0 | f(t.length);
                    e = o(e, n);
                    for (var i = 0; i < n; i += 1) e[i] = 255 & t[i];
                    return e
                }

                function f(e) {
                    if (e >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");
                    return 0 | e
                }

                function p(e, t) {
                    if (l.isBuffer(e)) return e.length;
                    if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                    "string" != typeof e && (e = "" + e);
                    var n = e.length;
                    if (0 === n) return 0;
                    for (var i = !1;;) switch (t) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return n;
                    case "utf8":
                    case "utf-8":
                    case void 0:
                        return z(e).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * n;
                    case "hex":
                        return n >>> 1;
                    case "base64":
                        return H(e).length;
                    default:
                        if (i) return z(e).length;
                        t = ("" + t).toLowerCase(), i = !0
                    }
                }

                function m(e, t, n) {
                    var i = !1;
                    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                    if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
                    if ((n >>>= 0) <= (t >>>= 0)) return "";
                    for (e || (e = "utf8");;) switch (e) {
                    case "hex":
                        return P(this, t, n);
                    case "utf8":
                    case "utf-8":
                        return M(this, t, n);
                    case "ascii":
                        return E(this, t, n);
                    case "latin1":
                    case "binary":
                        return C(this, t, n);
                    case "base64":
                        return T(this, t, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return A(this, t, n);
                    default:
                        if (i) throw new TypeError("Unknown encoding: " + e);
                        e = (e + "").toLowerCase(), i = !0
                    }
                }

                function g(e, t, n) {
                    var i = e[t];
                    e[t] = e[n], e[n] = i
                }

                function y(e, t, n, i, s) {
                    if (0 === e.length) return -1;
                    if ("string" == typeof n ? (i = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = s ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
                        if (s) return -1;
                        n = e.length - 1
                    } else if (n < 0) {
                        if (!s) return -1;
                        n = 0
                    }
                    if ("string" == typeof t && (t = l.from(t, i)), l.isBuffer(t)) return 0 === t.length ? -1 : k(e, t, n, i, s);
                    if ("number" == typeof t) return t &= 255, l.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? s ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : k(e, [t], n, i, s);
                    throw new TypeError("val must be string, number or Buffer")
                }

                function k(e, t, n, i, s) {
                    var a, r = 1,
                        o = e.length,
                        l = t.length;
                    if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                        if (e.length < 2 || t.length < 2) return -1;
                        r = 2, o /= 2, l /= 2, n /= 2
                    }

                    function c(e, t) {
                        return 1 === r ? e[t] : e.readUInt16BE(t * r)
                    }
                    if (s) {
                        var h = -1;
                        for (a = n; a < o; a++)
                            if (c(e, a) === c(t, -1 === h ? 0 : a - h)) {
                                if (-1 === h && (h = a), a - h + 1 === l) return h * r
                            } else - 1 !== h && (a -= a - h), h = -1
                    } else
                        for (n + l > o && (n = o - l), a = n; a >= 0; a--) {
                            for (var u = !0, d = 0; d < l; d++)
                                if (c(e, a + d) !== c(t, d)) {
                                    u = !1;
                                    break
                                } if (u) return a
                        }
                    return -1
                }

                function w(e, t, n, i) {
                    n = Number(n) || 0;
                    var s = e.length - n;
                    i ? (i = Number(i)) > s && (i = s) : i = s;
                    var a = t.length;
                    if (a % 2 != 0) throw new TypeError("Invalid hex string");
                    i > a / 2 && (i = a / 2);
                    for (var r = 0; r < i; ++r) {
                        var o = parseInt(t.substr(2 * r, 2), 16);
                        if (isNaN(o)) return r;
                        e[n + r] = o
                    }
                    return r
                }

                function b(e, t, n, i) {
                    return W(z(t, e.length - n), e, n, i)
                }

                function v(e, t, n, i) {
                    return W(function (e) {
                        for (var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
                        return t
                    }(t), e, n, i)
                }

                function x(e, t, n, i) {
                    return v(e, t, n, i)
                }

                function S(e, t, n, i) {
                    return W(H(t), e, n, i)
                }

                function I(e, t, n, i) {
                    return W(function (e, t) {
                        for (var n, i, s, a = [], r = 0; r < e.length && !((t -= 2) < 0); ++r) i = (n = e.charCodeAt(r)) >> 8, s = n % 256, a.push(s), a.push(i);
                        return a
                    }(t, e.length - n), e, n, i)
                }

                function T(e, t, n) {
                    return 0 === t && n === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, n))
                }

                function M(e, t, n) {
                    n = Math.min(e.length, n);
                    for (var i = [], s = t; s < n;) {
                        var a, r, o, l, c = e[s],
                            h = null,
                            u = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                        if (s + u <= n) switch (u) {
                        case 1:
                            c < 128 && (h = c);
                            break;
                        case 2:
                            128 == (192 & (a = e[s + 1])) && (l = (31 & c) << 6 | 63 & a) > 127 && (h = l);
                            break;
                        case 3:
                            a = e[s + 1], r = e[s + 2], 128 == (192 & a) && 128 == (192 & r) && (l = (15 & c) << 12 | (63 & a) << 6 | 63 & r) > 2047 && (l < 55296 || l > 57343) && (h = l);
                            break;
                        case 4:
                            a = e[s + 1], r = e[s + 2], o = e[s + 3], 128 == (192 & a) && 128 == (192 & r) && 128 == (192 & o) && (l = (15 & c) << 18 | (63 & a) << 12 | (63 & r) << 6 | 63 & o) > 65535 && l < 1114112 && (h = l)
                        }
                        null === h ? (h = 65533, u = 1) : h > 65535 && (h -= 65536, i.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), i.push(h), s += u
                    }
                    return function (e) {
                        var t = e.length;
                        if (t <= j) return String.fromCharCode.apply(String, e);
                        var n = "",
                            i = 0;
                        for (; i < t;) n += String.fromCharCode.apply(String, e.slice(i, i += j));
                        return n
                    }(i)
                }
                t.Buffer = l, t.SlowBuffer = function (e) {
                    +e != e && (e = 0);
                    return l.alloc(+e)
                }, t.INSPECT_MAX_BYTES = 50, l.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
                    try {
                        var e = new Uint8Array(1);
                        return e.__proto__ = {
                            __proto__: Uint8Array.prototype,
                            foo: function () {
                                return 42
                            }
                        }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                    } catch (e) {
                        return !1
                    }
                }(), t.kMaxLength = r(), l.poolSize = 8192, l._augment = function (e) {
                    return e.__proto__ = l.prototype, e
                }, l.from = function (e, t, n) {
                    return c(null, e, t, n)
                }, l.TYPED_ARRAY_SUPPORT && (l.prototype.__proto__ = Uint8Array.prototype, l.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && l[Symbol.species] === l && Object.defineProperty(l, Symbol.species, {
                    value: null,
                    configurable: !0
                })), l.alloc = function (e, t, n) {
                    return function (e, t, n, i) {
                        return h(t), t <= 0 ? o(e, t) : void 0 !== n ? "string" == typeof i ? o(e, t).fill(n, i) : o(e, t).fill(n) : o(e, t)
                    }(null, e, t, n)
                }, l.allocUnsafe = function (e) {
                    return u(null, e)
                }, l.allocUnsafeSlow = function (e) {
                    return u(null, e)
                }, l.isBuffer = function (e) {
                    return !(null == e || !e._isBuffer)
                }, l.compare = function (e, t) {
                    if (!l.isBuffer(e) || !l.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                    if (e === t) return 0;
                    for (var n = e.length, i = t.length, s = 0, a = Math.min(n, i); s < a; ++s)
                        if (e[s] !== t[s]) {
                            n = e[s], i = t[s];
                            break
                        } return n < i ? -1 : i < n ? 1 : 0
                }, l.isEncoding = function (e) {
                    switch (String(e).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                    }
                }, l.concat = function (e, t) {
                    if (!a(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === e.length) return l.alloc(0);
                    var n;
                    if (void 0 === t)
                        for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
                    var i = l.allocUnsafe(t),
                        s = 0;
                    for (n = 0; n < e.length; ++n) {
                        var r = e[n];
                        if (!l.isBuffer(r)) throw new TypeError('"list" argument must be an Array of Buffers');
                        r.copy(i, s), s += r.length
                    }
                    return i
                }, l.byteLength = p, l.prototype._isBuffer = !0, l.prototype.swap16 = function () {
                    var e = this.length;
                    if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (var t = 0; t < e; t += 2) g(this, t, t + 1);
                    return this
                }, l.prototype.swap32 = function () {
                    var e = this.length;
                    if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (var t = 0; t < e; t += 4) g(this, t, t + 3), g(this, t + 1, t + 2);
                    return this
                }, l.prototype.swap64 = function () {
                    var e = this.length;
                    if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                    for (var t = 0; t < e; t += 8) g(this, t, t + 7), g(this, t + 1, t + 6), g(this, t + 2, t + 5), g(this, t + 3, t + 4);
                    return this
                }, l.prototype.toString = function () {
                    var e = 0 | this.length;
                    return 0 === e ? "" : 0 === arguments.length ? M(this, 0, e) : m.apply(this, arguments)
                }, l.prototype.equals = function (e) {
                    if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e || 0 === l.compare(this, e)
                }, l.prototype.inspect = function () {
                    var e = "",
                        n = t.INSPECT_MAX_BYTES;
                    return this.length > 0 && (e = this.toString("hex", 0, n).match(/.{2}/g).join(" "), this.length > n && (e += " ... ")), "<Buffer " + e + ">"
                }, l.prototype.compare = function (e, t, n, i, s) {
                    if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === i && (i = 0), void 0 === s && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
                    if (i >= s && t >= n) return 0;
                    if (i >= s) return -1;
                    if (t >= n) return 1;
                    if (this === e) return 0;
                    for (var a = (s >>>= 0) - (i >>>= 0), r = (n >>>= 0) - (t >>>= 0), o = Math.min(a, r), c = this.slice(i, s), h = e.slice(t, n), u = 0; u < o; ++u)
                        if (c[u] !== h[u]) {
                            a = c[u], r = h[u];
                            break
                        } return a < r ? -1 : r < a ? 1 : 0
                }, l.prototype.includes = function (e, t, n) {
                    return -1 !== this.indexOf(e, t, n)
                }, l.prototype.indexOf = function (e, t, n) {
                    return y(this, e, t, n, !0)
                }, l.prototype.lastIndexOf = function (e, t, n) {
                    return y(this, e, t, n, !1)
                }, l.prototype.write = function (e, t, n, i) {
                    if (void 0 === t) i = "utf8", n = this.length, t = 0;
                    else if (void 0 === n && "string" == typeof t) i = t, n = this.length, t = 0;
                    else {
                        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t |= 0, isFinite(n) ? (n |= 0, void 0 === i && (i = "utf8")) : (i = n, n = void 0)
                    }
                    var s = this.length - t;
                    if ((void 0 === n || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    i || (i = "utf8");
                    for (var a = !1;;) switch (i) {
                    case "hex":
                        return w(this, e, t, n);
                    case "utf8":
                    case "utf-8":
                        return b(this, e, t, n);
                    case "ascii":
                        return v(this, e, t, n);
                    case "latin1":
                    case "binary":
                        return x(this, e, t, n);
                    case "base64":
                        return S(this, e, t, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return I(this, e, t, n);
                    default:
                        if (a) throw new TypeError("Unknown encoding: " + i);
                        i = ("" + i).toLowerCase(), a = !0
                    }
                }, l.prototype.toJSON = function () {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                var j = 4096;

                function E(e, t, n) {
                    var i = "";
                    n = Math.min(e.length, n);
                    for (var s = t; s < n; ++s) i += String.fromCharCode(127 & e[s]);
                    return i
                }

                function C(e, t, n) {
                    var i = "";
                    n = Math.min(e.length, n);
                    for (var s = t; s < n; ++s) i += String.fromCharCode(e[s]);
                    return i
                }

                function P(e, t, n) {
                    var i = e.length;
                    (!t || t < 0) && (t = 0), (!n || n < 0 || n > i) && (n = i);
                    for (var s = "", a = t; a < n; ++a) s += Y(e[a]);
                    return s
                }

                function A(e, t, n) {
                    for (var i = e.slice(t, n), s = "", a = 0; a < i.length; a += 2) s += String.fromCharCode(i[a] + 256 * i[a + 1]);
                    return s
                }

                function B(e, t, n) {
                    if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                    if (e + t > n) throw new RangeError("Trying to access beyond buffer length")
                }

                function _(e, t, n, i, s, a) {
                    if (!l.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > s || t < a) throw new RangeError('"value" argument is out of bounds');
                    if (n + i > e.length) throw new RangeError("Index out of range")
                }

                function R(e, t, n, i) {
                    t < 0 && (t = 65535 + t + 1);
                    for (var s = 0, a = Math.min(e.length - n, 2); s < a; ++s) e[n + s] = (t & 255 << 8 * (i ? s : 1 - s)) >>> 8 * (i ? s : 1 - s)
                }

                function O(e, t, n, i) {
                    t < 0 && (t = 4294967295 + t + 1);
                    for (var s = 0, a = Math.min(e.length - n, 4); s < a; ++s) e[n + s] = t >>> 8 * (i ? s : 3 - s) & 255
                }

                function D(e, t, n, i, s, a) {
                    if (n + i > e.length) throw new RangeError("Index out of range");
                    if (n < 0) throw new RangeError("Index out of range")
                }

                function U(e, t, n, i, a) {
                    return a || D(e, 0, n, 4), s.write(e, t, n, i, 23, 4), n + 4
                }

                function L(e, t, n, i, a) {
                    return a || D(e, 0, n, 8), s.write(e, t, n, i, 52, 8), n + 8
                }
                l.prototype.slice = function (e, t) {
                    var n, i = this.length;
                    if ((e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i), (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), t < e && (t = e), l.TYPED_ARRAY_SUPPORT)(n = this.subarray(e, t)).__proto__ = l.prototype;
                    else {
                        var s = t - e;
                        n = new l(s, void 0);
                        for (var a = 0; a < s; ++a) n[a] = this[a + e]
                    }
                    return n
                }, l.prototype.readUIntLE = function (e, t, n) {
                    e |= 0, t |= 0, n || B(e, t, this.length);
                    for (var i = this[e], s = 1, a = 0; ++a < t && (s *= 256);) i += this[e + a] * s;
                    return i
                }, l.prototype.readUIntBE = function (e, t, n) {
                    e |= 0, t |= 0, n || B(e, t, this.length);
                    for (var i = this[e + --t], s = 1; t > 0 && (s *= 256);) i += this[e + --t] * s;
                    return i
                }, l.prototype.readUInt8 = function (e, t) {
                    return t || B(e, 1, this.length), this[e]
                }, l.prototype.readUInt16LE = function (e, t) {
                    return t || B(e, 2, this.length), this[e] | this[e + 1] << 8
                }, l.prototype.readUInt16BE = function (e, t) {
                    return t || B(e, 2, this.length), this[e] << 8 | this[e + 1]
                }, l.prototype.readUInt32LE = function (e, t) {
                    return t || B(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                }, l.prototype.readUInt32BE = function (e, t) {
                    return t || B(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                }, l.prototype.readIntLE = function (e, t, n) {
                    e |= 0, t |= 0, n || B(e, t, this.length);
                    for (var i = this[e], s = 1, a = 0; ++a < t && (s *= 256);) i += this[e + a] * s;
                    return i >= (s *= 128) && (i -= Math.pow(2, 8 * t)), i
                }, l.prototype.readIntBE = function (e, t, n) {
                    e |= 0, t |= 0, n || B(e, t, this.length);
                    for (var i = t, s = 1, a = this[e + --i]; i > 0 && (s *= 256);) a += this[e + --i] * s;
                    return a >= (s *= 128) && (a -= Math.pow(2, 8 * t)), a
                }, l.prototype.readInt8 = function (e, t) {
                    return t || B(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                }, l.prototype.readInt16LE = function (e, t) {
                    t || B(e, 2, this.length);
                    var n = this[e] | this[e + 1] << 8;
                    return 32768 & n ? 4294901760 | n : n
                }, l.prototype.readInt16BE = function (e, t) {
                    t || B(e, 2, this.length);
                    var n = this[e + 1] | this[e] << 8;
                    return 32768 & n ? 4294901760 | n : n
                }, l.prototype.readInt32LE = function (e, t) {
                    return t || B(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                }, l.prototype.readInt32BE = function (e, t) {
                    return t || B(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                }, l.prototype.readFloatLE = function (e, t) {
                    return t || B(e, 4, this.length), s.read(this, e, !0, 23, 4)
                }, l.prototype.readFloatBE = function (e, t) {
                    return t || B(e, 4, this.length), s.read(this, e, !1, 23, 4)
                }, l.prototype.readDoubleLE = function (e, t) {
                    return t || B(e, 8, this.length), s.read(this, e, !0, 52, 8)
                }, l.prototype.readDoubleBE = function (e, t) {
                    return t || B(e, 8, this.length), s.read(this, e, !1, 52, 8)
                }, l.prototype.writeUIntLE = function (e, t, n, i) {
                    (e = +e, t |= 0, n |= 0, i) || _(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                    var s = 1,
                        a = 0;
                    for (this[t] = 255 & e; ++a < n && (s *= 256);) this[t + a] = e / s & 255;
                    return t + n
                }, l.prototype.writeUIntBE = function (e, t, n, i) {
                    (e = +e, t |= 0, n |= 0, i) || _(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                    var s = n - 1,
                        a = 1;
                    for (this[t + s] = 255 & e; --s >= 0 && (a *= 256);) this[t + s] = e / a & 255;
                    return t + n
                }, l.prototype.writeUInt8 = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 1, 255, 0), l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
                }, l.prototype.writeUInt16LE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 2, 65535, 0), l.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : R(this, e, t, !0), t + 2
                }, l.prototype.writeUInt16BE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 2, 65535, 0), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : R(this, e, t, !1), t + 2
                }, l.prototype.writeUInt32LE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 4, 4294967295, 0), l.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : O(this, e, t, !0), t + 4
                }, l.prototype.writeUInt32BE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 4, 4294967295, 0), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : O(this, e, t, !1), t + 4
                }, l.prototype.writeIntLE = function (e, t, n, i) {
                    if (e = +e, t |= 0, !i) {
                        var s = Math.pow(2, 8 * n - 1);
                        _(this, e, t, n, s - 1, -s)
                    }
                    var a = 0,
                        r = 1,
                        o = 0;
                    for (this[t] = 255 & e; ++a < n && (r *= 256);) e < 0 && 0 === o && 0 !== this[t + a - 1] && (o = 1), this[t + a] = (e / r >> 0) - o & 255;
                    return t + n
                }, l.prototype.writeIntBE = function (e, t, n, i) {
                    if (e = +e, t |= 0, !i) {
                        var s = Math.pow(2, 8 * n - 1);
                        _(this, e, t, n, s - 1, -s)
                    }
                    var a = n - 1,
                        r = 1,
                        o = 0;
                    for (this[t + a] = 255 & e; --a >= 0 && (r *= 256);) e < 0 && 0 === o && 0 !== this[t + a + 1] && (o = 1), this[t + a] = (e / r >> 0) - o & 255;
                    return t + n
                }, l.prototype.writeInt8 = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 1, 127, -128), l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                }, l.prototype.writeInt16LE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 2, 32767, -32768), l.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : R(this, e, t, !0), t + 2
                }, l.prototype.writeInt16BE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 2, 32767, -32768), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : R(this, e, t, !1), t + 2
                }, l.prototype.writeInt32LE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 4, 2147483647, -2147483648), l.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : O(this, e, t, !0), t + 4
                }, l.prototype.writeInt32BE = function (e, t, n) {
                    return e = +e, t |= 0, n || _(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : O(this, e, t, !1), t + 4
                }, l.prototype.writeFloatLE = function (e, t, n) {
                    return U(this, e, t, !0, n)
                }, l.prototype.writeFloatBE = function (e, t, n) {
                    return U(this, e, t, !1, n)
                }, l.prototype.writeDoubleLE = function (e, t, n) {
                    return L(this, e, t, !0, n)
                }, l.prototype.writeDoubleBE = function (e, t, n) {
                    return L(this, e, t, !1, n)
                }, l.prototype.copy = function (e, t, n, i) {
                    if (n || (n = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n) return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
                    if (i < 0) throw new RangeError("sourceEnd out of bounds");
                    i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
                    var s, a = i - n;
                    if (this === e && n < t && t < i)
                        for (s = a - 1; s >= 0; --s) e[s + t] = this[s + n];
                    else if (a < 1e3 || !l.TYPED_ARRAY_SUPPORT)
                        for (s = 0; s < a; ++s) e[s + t] = this[s + n];
                    else Uint8Array.prototype.set.call(e, this.subarray(n, n + a), t);
                    return a
                }, l.prototype.fill = function (e, t, n, i) {
                    if ("string" == typeof e) {
                        if ("string" == typeof t ? (i = t, t = 0, n = this.length) : "string" == typeof n && (i = n, n = this.length), 1 === e.length) {
                            var s = e.charCodeAt(0);
                            s < 256 && (e = s)
                        }
                        if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                        if ("string" == typeof i && !l.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                    } else "number" == typeof e && (e &= 255);
                    if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
                    if (n <= t) return this;
                    var a;
                    if (t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e)
                        for (a = t; a < n; ++a) this[a] = e;
                    else {
                        var r = l.isBuffer(e) ? e : z(new l(e, i).toString()),
                            o = r.length;
                        for (a = 0; a < n - t; ++a) this[a + t] = r[a % o]
                    }
                    return this
                };
                var F = /[^+\/0-9A-Za-z-_]/g;

                function Y(e) {
                    return e < 16 ? "0" + e.toString(16) : e.toString(16)
                }

                function z(e, t) {
                    var n;
                    t = t || 1 / 0;
                    for (var i = e.length, s = null, a = [], r = 0; r < i; ++r) {
                        if ((n = e.charCodeAt(r)) > 55295 && n < 57344) {
                            if (!s) {
                                if (n > 56319) {
                                    (t -= 3) > -1 && a.push(239, 191, 189);
                                    continue
                                }
                                if (r + 1 === i) {
                                    (t -= 3) > -1 && a.push(239, 191, 189);
                                    continue
                                }
                                s = n;
                                continue
                            }
                            if (n < 56320) {
                                (t -= 3) > -1 && a.push(239, 191, 189), s = n;
                                continue
                            }
                            n = 65536 + (s - 55296 << 10 | n - 56320)
                        } else s && (t -= 3) > -1 && a.push(239, 191, 189);
                        if (s = null, n < 128) {
                            if ((t -= 1) < 0) break;
                            a.push(n)
                        } else if (n < 2048) {
                            if ((t -= 2) < 0) break;
                            a.push(n >> 6 | 192, 63 & n | 128)
                        } else if (n < 65536) {
                            if ((t -= 3) < 0) break;
                            a.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                        } else {
                            if (!(n < 1114112)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            a.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                        }
                    }
                    return a
                }

                function H(e) {
                    return i.toByteArray(function (e) {
                        if ((e = function (e) {
                                return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                            }(e).replace(F, "")).length < 2) return "";
                        for (; e.length % 4 != 0;) e += "=";
                        return e
                    }(e))
                }

                function W(e, t, n, i) {
                    for (var s = 0; s < i && !(s + n >= t.length || s >= e.length); ++s) t[s + n] = e[s];
                    return s
                }
            }).call(this, n( /*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"))
        },
    "./node_modules/buffer/node_modules/isarray/index.js":
        /*!***********************************************************!*\
          !*** ./node_modules/buffer/node_modules/isarray/index.js ***!
          \***********************************************************/
        /*! no static exports found */
        function (e, t) {
            var n = {}.toString;
            e.exports = Array.isArray || function (e) {
                return "[object Array]" == n.call(e)
            }
        },
    "./node_modules/charenc/charenc.js":
        /*!*****************************************!*\
          !*** ./node_modules/charenc/charenc.js ***!
          \*****************************************/
        /*! no static exports found */
        function (e, t) {
            var n = {
                utf8: {
                    stringToBytes: function (e) {
                        return n.bin.stringToBytes(unescape(encodeURIComponent(e)))
                    },
                    bytesToString: function (e) {
                        return decodeURIComponent(escape(n.bin.bytesToString(e)))
                    }
                },
                bin: {
                    stringToBytes: function (e) {
                        for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
                        return t
                    },
                    bytesToString: function (e) {
                        for (var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
                        return t.join("")
                    }
                }
            };
            e.exports = n
        },
    "./node_modules/crypt/crypt.js":
        /*!*************************************!*\
          !*** ./node_modules/crypt/crypt.js ***!
          \*************************************/
        /*! no static exports found */
        function (e, t) {
            var n, i;
            n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = {
                rotl: function (e, t) {
                    return e << t | e >>> 32 - t
                },
                rotr: function (e, t) {
                    return e << 32 - t | e >>> t
                },
                endian: function (e) {
                    if (e.constructor == Number) return 16711935 & i.rotl(e, 8) | 4278255360 & i.rotl(e, 24);
                    for (var t = 0; t < e.length; t++) e[t] = i.endian(e[t]);
                    return e
                },
                randomBytes: function (e) {
                    for (var t = []; e > 0; e--) t.push(Math.floor(256 * Math.random()));
                    return t
                },
                bytesToWords: function (e) {
                    for (var t = [], n = 0, i = 0; n < e.length; n++, i += 8) t[i >>> 5] |= e[n] << 24 - i % 32;
                    return t
                },
                wordsToBytes: function (e) {
                    for (var t = [], n = 0; n < 32 * e.length; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
                    return t
                },
                bytesToHex: function (e) {
                    for (var t = [], n = 0; n < e.length; n++) t.push((e[n] >>> 4).toString(16)), t.push((15 & e[n]).toString(16));
                    return t.join("")
                },
                hexToBytes: function (e) {
                    for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
                    return t
                },
                bytesToBase64: function (e) {
                    for (var t = [], i = 0; i < e.length; i += 3)
                        for (var s = e[i] << 16 | e[i + 1] << 8 | e[i + 2], a = 0; a < 4; a++) 8 * i + 6 * a <= 8 * e.length ? t.push(n.charAt(s >>> 6 * (3 - a) & 63)) : t.push("=");
                    return t.join("")
                },
                base64ToBytes: function (e) {
                    e = e.replace(/[^A-Z0-9+\/]/gi, "");
                    for (var t = [], i = 0, s = 0; i < e.length; s = ++i % 4) 0 != s && t.push((n.indexOf(e.charAt(i - 1)) & Math.pow(2, -2 * s + 8) - 1) << 2 * s | n.indexOf(e.charAt(i)) >>> 6 - 2 * s);
                    return t
                }
            }, e.exports = i
        },
    "./node_modules/event-lite/event-lite.js":
        /*!***********************************************!*\
          !*** ./node_modules/event-lite/event-lite.js ***!
          \***********************************************/
        /*! no static exports found */
        function (e, t, n) {
            ! function (t) {
                e.exports = t;
                var n = "listeners",
                    i = {
                        on: function (e, t) {
                            return r(this, e).push(t), this
                        },
                        once: function (e, t) {
                            var n = this;
                            return i.originalListener = t, r(n, e).push(i), n;

                            function i() {
                                a.call(n, e, i), t.apply(this, arguments)
                            }
                        },
                        off: a,
                        emit: function (e, t) {
                            var n = this,
                                i = r(n, e, !0);
                            if (!i) return !1;
                            var s = arguments.length;
                            if (1 === s) i.forEach(o);
                            else if (2 === s) i.forEach(l);
                            else {
                                var a = Array.prototype.slice.call(arguments, 1);
                                i.forEach(c)
                            }
                            return !!i.length;

                            function o(e) {
                                e.call(n)
                            }

                            function l(e) {
                                e.call(n, t)
                            }

                            function c(e) {
                                e.apply(n, a)
                            }
                        }
                    };

                function s(e) {
                    for (var t in i) e[t] = i[t];
                    return e
                }

                function a(e, t) {
                    var i, s = this;
                    if (arguments.length) {
                        if (t) {
                            if (i = r(s, e, !0)) {
                                if (!(i = i.filter(o)).length) return a.call(s, e);
                                s[n][e] = i
                            }
                        } else if ((i = s[n]) && (delete i[e], !Object.keys(i).length)) return a.call(s)
                    } else delete s[n];
                    return s;

                    function o(e) {
                        return e !== t && e.originalListener !== t
                    }
                }

                function r(e, t, i) {
                    if (!i || e[n]) {
                        var s = e[n] || (e[n] = {});
                        return s[t] || (s[t] = [])
                    }
                }
                s(t.prototype), t.mixin = s
            }((
                /**
                 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
                 *
                 * @copyright Yusuke Kawasaki
                 * @license MIT
                 * @constructor
                 * @see https://github.com/kawanet/event-lite
                 * @see http://kawanet.github.io/event-lite/EventLite.html
                 * @example
                 * var EventLite = require("event-lite");
                 *
                 * function MyClass() {...}             // your class
                 *
                 * EventLite.mixin(MyClass.prototype);  // import event methods
                 *
                 * var obj = new MyClass();
                 * obj.on("foo", function() {...});     // add event listener
                 * obj.once("bar", function() {...});   // add one-time event listener
                 * obj.emit("foo");                     // dispatch event
                 * obj.emit("bar");                     // dispatch another event
                 * obj.off("foo");                      // remove event listener
                 */
                function e() {
                    if (!(this instanceof e)) return new e
                }))
        },
    "./node_modules/ieee754/index.js":
        /*!***************************************!*\
          !*** ./node_modules/ieee754/index.js ***!
          \***************************************/
        /*! no static exports found */
        function (e, t) {
            t.read = function (e, t, n, i, s) {
                var a, r, o = 8 * s - i - 1,
                    l = (1 << o) - 1,
                    c = l >> 1,
                    h = -7,
                    u = n ? s - 1 : 0,
                    d = n ? -1 : 1,
                    f = e[t + u];
                for (u += d, a = f & (1 << -h) - 1, f >>= -h, h += o; h > 0; a = 256 * a + e[t + u], u += d, h -= 8);
                for (r = a & (1 << -h) - 1, a >>= -h, h += i; h > 0; r = 256 * r + e[t + u], u += d, h -= 8);
                if (0 === a) a = 1 - c;
                else {
                    if (a === l) return r ? NaN : 1 / 0 * (f ? -1 : 1);
                    r += Math.pow(2, i), a -= c
                }
                return (f ? -1 : 1) * r * Math.pow(2, a - i)
            }, t.write = function (e, t, n, i, s, a) {
                var r, o, l, c = 8 * a - s - 1,
                    h = (1 << c) - 1,
                    u = h >> 1,
                    d = 23 === s ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    f = i ? 0 : a - 1,
                    p = i ? 1 : -1,
                    m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, r = h) : (r = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -r)) < 1 && (r--, l *= 2), (t += r + u >= 1 ? d / l : d * Math.pow(2, 1 - u)) * l >= 2 && (r++, l /= 2), r + u >= h ? (o = 0, r = h) : r + u >= 1 ? (o = (t * l - 1) * Math.pow(2, s), r += u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, s), r = 0)); s >= 8; e[n + f] = 255 & o, f += p, o /= 256, s -= 8);
                for (r = r << s | o, c += s; c > 0; e[n + f] = 255 & r, f += p, r /= 256, c -= 8);
                e[n + f - p] |= 128 * m
            }
        },
    "./node_modules/int64-buffer/int64-buffer.js":
        /*!***************************************************!*\
          !*** ./node_modules/int64-buffer/int64-buffer.js ***!
          \***************************************************/
        /*! no static exports found */
        function (e, t, n) {
            (function (e) {
                ! function (t) {
                    var n, i = "undefined",
                        s = i !== typeof e && e,
                        a = i !== typeof Uint8Array && Uint8Array,
                        r = i !== typeof ArrayBuffer && ArrayBuffer,
                        o = [0, 0, 0, 0, 0, 0, 0, 0],
                        l = Array.isArray || function (e) {
                            return !!e && "[object Array]" == Object.prototype.toString.call(e)
                        },
                        c = 4294967296;

                    function h(e, l, h) {
                        var v = l ? 0 : 4,
                            x = l ? 4 : 0,
                            S = l ? 0 : 3,
                            I = l ? 1 : 2,
                            T = l ? 2 : 1,
                            M = l ? 3 : 0,
                            j = l ? y : w,
                            E = l ? k : b,
                            C = B.prototype,
                            P = "is" + e,
                            A = "_" + P;
                        return C.buffer = void 0, C.offset = 0, C[A] = !0, C.toNumber = _, C.toString = function (e) {
                            var t = this.buffer,
                                n = this.offset,
                                i = O(t, n + v),
                                s = O(t, n + x),
                                a = "",
                                r = !h && 2147483648 & i;
                            r && (i = ~i, s = c - s);
                            e = e || 10;
                            for (;;) {
                                var o = i % e * c + s;
                                if (i = Math.floor(i / e), s = Math.floor(o / e), a = (o % e).toString(e) + a, !i && !s) break
                            }
                            r && (a = "-" + a);
                            return a
                        }, C.toJSON = _, C.toArray = u, s && (C.toBuffer = d), a && (C.toArrayBuffer = f), B[P] = function (e) {
                            return !(!e || !e[A])
                        }, t[e] = B, B;

                        function B(e, t, s, l) {
                            return this instanceof B ? function (e, t, s, l, h) {
                                a && r && (t instanceof r && (t = new a(t)), l instanceof r && (l = new a(l)));
                                if (!(t || s || l || n)) return void(e.buffer = g(o, 0));
                                if (!p(t, s)) {
                                    h = s, l = t, s = 0, t = new(n || Array)(8)
                                }
                                if (e.buffer = t, e.offset = s |= 0, i === typeof l) return;
                                "string" == typeof l ? function (e, t, n, i) {
                                    var s = 0,
                                        a = n.length,
                                        r = 0,
                                        o = 0;
                                    "-" === n[0] && s++;
                                    var l = s;
                                    for (; s < a;) {
                                        var h = parseInt(n[s++], i);
                                        if (!(h >= 0)) break;
                                        o = o * i + h, r = r * i + Math.floor(o / c), o %= c
                                    }
                                    l && (r = ~r, o ? o = c - o : r++);
                                    R(e, t + v, r), R(e, t + x, o)
                                }(t, s, l, h || 10) : p(l, h) ? m(t, s, l, h) : "number" == typeof h ? (R(t, s + v, l), R(t, s + x, h)) : l > 0 ? j(t, s, l) : l < 0 ? E(t, s, l) : m(t, s, o, 0)
                            }(this, e, t, s, l) : new B(e, t, s, l)
                        }

                        function _() {
                            var e = this.buffer,
                                t = this.offset,
                                n = O(e, t + v),
                                i = O(e, t + x);
                            return h || (n |= 0), n ? n * c + i : i
                        }

                        function R(e, t, n) {
                            e[t + M] = 255 & n, n >>= 8, e[t + T] = 255 & n, n >>= 8, e[t + I] = 255 & n, n >>= 8, e[t + S] = 255 & n
                        }

                        function O(e, t) {
                            return 16777216 * e[t + S] + (e[t + I] << 16) + (e[t + T] << 8) + e[t + M]
                        }
                    }

                    function u(e) {
                        var t = this.buffer,
                            i = this.offset;
                        return n = null, !1 !== e && 0 === i && 8 === t.length && l(t) ? t : g(t, i)
                    }

                    function d(t) {
                        var i = this.buffer,
                            a = this.offset;
                        if (n = s, !1 !== t && 0 === a && 8 === i.length && e.isBuffer(i)) return i;
                        var r = new s(8);
                        return m(r, 0, i, a), r
                    }

                    function f(e) {
                        var t = this.buffer,
                            i = this.offset,
                            s = t.buffer;
                        if (n = a, !1 !== e && 0 === i && s instanceof r && 8 === s.byteLength) return s;
                        var o = new a(8);
                        return m(o, 0, t, i), o.buffer
                    }

                    function p(e, t) {
                        var n = e && e.length;
                        return t |= 0, n && t + 8 <= n && "string" != typeof e[t]
                    }

                    function m(e, t, n, i) {
                        t |= 0, i |= 0;
                        for (var s = 0; s < 8; s++) e[t++] = 255 & n[i++]
                    }

                    function g(e, t) {
                        return Array.prototype.slice.call(e, t, t + 8)
                    }

                    function y(e, t, n) {
                        for (var i = t + 8; i > t;) e[--i] = 255 & n, n /= 256
                    }

                    function k(e, t, n) {
                        var i = t + 8;
                        for (n++; i > t;) e[--i] = 255 & -n ^ 255, n /= 256
                    }

                    function w(e, t, n) {
                        for (var i = t + 8; t < i;) e[t++] = 255 & n, n /= 256
                    }

                    function b(e, t, n) {
                        var i = t + 8;
                        for (n++; t < i;) e[t++] = 255 & -n ^ 255, n /= 256
                    }
                    h("Uint64BE", !0, !0), h("Int64BE", !0, !1), h("Uint64LE", !1, !0), h("Int64LE", !1, !1)
                }("string" != typeof t.nodeName ? t : this || {})
            }).call(this, n( /*! ./../buffer/index.js */ "./node_modules/buffer/index.js").Buffer)
        },
    "./node_modules/is-buffer/index.js":
        /*!*****************************************!*\
          !*** ./node_modules/is-buffer/index.js ***!
          \*****************************************/
        /*! no static exports found */
        function (e, t) {
            function n(e) {
                return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
            }
            /*!
             * Determine if an object is a Buffer
             *
             * @author   Feross Aboukhadijeh <https://feross.org>
             * @license  MIT
             */
            e.exports = function (e) {
                return null != e && (n(e) || function (e) {
                    return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
                }(e) || !!e._isBuffer)
            }
        },
    "./node_modules/md5/md5.js":
        /*!*********************************!*\
          !*** ./node_modules/md5/md5.js ***!
          \*********************************/
        /*! no static exports found */
        function (e, t, n) {
            var i, s, a, r, o;
            i = n( /*! crypt */ "./node_modules/crypt/crypt.js"), s = n( /*! charenc */ "./node_modules/charenc/charenc.js").utf8, a = n( /*! is-buffer */ "./node_modules/is-buffer/index.js"), r = n( /*! charenc */ "./node_modules/charenc/charenc.js").bin, (o = function (e, t) {
                e.constructor == String ? e = t && "binary" === t.encoding ? r.stringToBytes(e) : s.stringToBytes(e) : a(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || (e = e.toString());
                for (var n = i.bytesToWords(e), l = 8 * e.length, c = 1732584193, h = -271733879, u = -1732584194, d = 271733878, f = 0; f < n.length; f++) n[f] = 16711935 & (n[f] << 8 | n[f] >>> 24) | 4278255360 & (n[f] << 24 | n[f] >>> 8);
                n[l >>> 5] |= 128 << l % 32, n[14 + (l + 64 >>> 9 << 4)] = l;
                var p = o._ff,
                    m = o._gg,
                    g = o._hh,
                    y = o._ii;
                for (f = 0; f < n.length; f += 16) {
                    var k = c,
                        w = h,
                        b = u,
                        v = d;
                    c = p(c, h, u, d, n[f + 0], 7, -680876936), d = p(d, c, h, u, n[f + 1], 12, -389564586), u = p(u, d, c, h, n[f + 2], 17, 606105819), h = p(h, u, d, c, n[f + 3], 22, -1044525330), c = p(c, h, u, d, n[f + 4], 7, -176418897), d = p(d, c, h, u, n[f + 5], 12, 1200080426), u = p(u, d, c, h, n[f + 6], 17, -1473231341), h = p(h, u, d, c, n[f + 7], 22, -45705983), c = p(c, h, u, d, n[f + 8], 7, 1770035416), d = p(d, c, h, u, n[f + 9], 12, -1958414417), u = p(u, d, c, h, n[f + 10], 17, -42063), h = p(h, u, d, c, n[f + 11], 22, -1990404162), c = p(c, h, u, d, n[f + 12], 7, 1804603682), d = p(d, c, h, u, n[f + 13], 12, -40341101), u = p(u, d, c, h, n[f + 14], 17, -1502002290), c = m(c, h = p(h, u, d, c, n[f + 15], 22, 1236535329), u, d, n[f + 1], 5, -165796510), d = m(d, c, h, u, n[f + 6], 9, -1069501632), u = m(u, d, c, h, n[f + 11], 14, 643717713), h = m(h, u, d, c, n[f + 0], 20, -373897302), c = m(c, h, u, d, n[f + 5], 5, -701558691), d = m(d, c, h, u, n[f + 10], 9, 38016083), u = m(u, d, c, h, n[f + 15], 14, -660478335), h = m(h, u, d, c, n[f + 4], 20, -405537848), c = m(c, h, u, d, n[f + 9], 5, 568446438), d = m(d, c, h, u, n[f + 14], 9, -1019803690), u = m(u, d, c, h, n[f + 3], 14, -187363961), h = m(h, u, d, c, n[f + 8], 20, 1163531501), c = m(c, h, u, d, n[f + 13], 5, -1444681467), d = m(d, c, h, u, n[f + 2], 9, -51403784), u = m(u, d, c, h, n[f + 7], 14, 1735328473), c = g(c, h = m(h, u, d, c, n[f + 12], 20, -1926607734), u, d, n[f + 5], 4, -378558), d = g(d, c, h, u, n[f + 8], 11, -2022574463), u = g(u, d, c, h, n[f + 11], 16, 1839030562), h = g(h, u, d, c, n[f + 14], 23, -35309556), c = g(c, h, u, d, n[f + 1], 4, -1530992060), d = g(d, c, h, u, n[f + 4], 11, 1272893353), u = g(u, d, c, h, n[f + 7], 16, -155497632), h = g(h, u, d, c, n[f + 10], 23, -1094730640), c = g(c, h, u, d, n[f + 13], 4, 681279174), d = g(d, c, h, u, n[f + 0], 11, -358537222), u = g(u, d, c, h, n[f + 3], 16, -722521979), h = g(h, u, d, c, n[f + 6], 23, 76029189), c = g(c, h, u, d, n[f + 9], 4, -640364487), d = g(d, c, h, u, n[f + 12], 11, -421815835), u = g(u, d, c, h, n[f + 15], 16, 530742520), c = y(c, h = g(h, u, d, c, n[f + 2], 23, -995338651), u, d, n[f + 0], 6, -198630844), d = y(d, c, h, u, n[f + 7], 10, 1126891415), u = y(u, d, c, h, n[f + 14], 15, -1416354905), h = y(h, u, d, c, n[f + 5], 21, -57434055), c = y(c, h, u, d, n[f + 12], 6, 1700485571), d = y(d, c, h, u, n[f + 3], 10, -1894986606), u = y(u, d, c, h, n[f + 10], 15, -1051523), h = y(h, u, d, c, n[f + 1], 21, -2054922799), c = y(c, h, u, d, n[f + 8], 6, 1873313359), d = y(d, c, h, u, n[f + 15], 10, -30611744), u = y(u, d, c, h, n[f + 6], 15, -1560198380), h = y(h, u, d, c, n[f + 13], 21, 1309151649), c = y(c, h, u, d, n[f + 4], 6, -145523070), d = y(d, c, h, u, n[f + 11], 10, -1120210379), u = y(u, d, c, h, n[f + 2], 15, 718787259), h = y(h, u, d, c, n[f + 9], 21, -343485551), c = c + k >>> 0, h = h + w >>> 0, u = u + b >>> 0, d = d + v >>> 0
                }
                return i.endian([c, h, u, d])
            })._ff = function (e, t, n, i, s, a, r) {
                var o = e + (t & n | ~t & i) + (s >>> 0) + r;
                return (o << a | o >>> 32 - a) + t
            }, o._gg = function (e, t, n, i, s, a, r) {
                var o = e + (t & i | n & ~i) + (s >>> 0) + r;
                return (o << a | o >>> 32 - a) + t
            }, o._hh = function (e, t, n, i, s, a, r) {
                var o = e + (t ^ n ^ i) + (s >>> 0) + r;
                return (o << a | o >>> 32 - a) + t
            }, o._ii = function (e, t, n, i, s, a, r) {
                var o = e + (n ^ (t | ~i)) + (s >>> 0) + r;
                return (o << a | o >>> 32 - a) + t
            }, o._blocksize = 16, o._digestsize = 16, e.exports = function (e, t) {
                if (null == e) throw new Error("Illegal argument " + e);
                var n = i.wordsToBytes(o(e, t));
                return t && t.asBytes ? n : t && t.asString ? r.bytesToString(n) : i.bytesToHex(n)
            }
        },
    "./node_modules/msgpack-lite/lib/browser.js":
        /*!**************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/browser.js ***!
          \**************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.encode = n( /*! ./encode */ "./node_modules/msgpack-lite/lib/encode.js").encode, t.decode = n( /*! ./decode */ "./node_modules/msgpack-lite/lib/decode.js").decode, t.Encoder = n( /*! ./encoder */ "./node_modules/msgpack-lite/lib/encoder.js").Encoder, t.Decoder = n( /*! ./decoder */ "./node_modules/msgpack-lite/lib/decoder.js").Decoder, t.createCodec = n( /*! ./ext */ "./node_modules/msgpack-lite/lib/ext.js").createCodec, t.codec = n( /*! ./codec */ "./node_modules/msgpack-lite/lib/codec.js").codec
        },
    "./node_modules/msgpack-lite/lib/buffer-global.js":
        /*!********************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/buffer-global.js ***!
          \********************************************************/
        /*! no static exports found */
        function (e, t, n) {
            (function (t) {
                function n(e) {
                    return e && e.isBuffer && e
                }
                e.exports = n(void 0 !== t && t) || n(this.Buffer) || n("undefined" != typeof window && window.Buffer) || this.Buffer
            }).call(this, n( /*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer)
        },
    "./node_modules/msgpack-lite/lib/buffer-lite.js":
        /*!******************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/buffer-lite.js ***!
          \******************************************************/
        /*! no static exports found */
        function (e, t) {
            t.copy = function (e, t, n, i) {
                var s;
                n || (n = 0);
                i || 0 === i || (i = this.length);
                t || (t = 0);
                var a = i - n;
                if (e === this && n < t && t < i)
                    for (s = a - 1; s >= 0; s--) e[s + t] = this[s + n];
                else
                    for (s = 0; s < a; s++) e[s + t] = this[s + n];
                return a
            }, t.toString = function (e, t, n) {
                var i = this,
                    s = 0 | t;
                n || (n = i.length);
                var a = "",
                    r = 0;
                for (; s < n;)(r = i[s++]) < 128 ? a += String.fromCharCode(r) : (192 == (224 & r) ? r = (31 & r) << 6 | 63 & i[s++] : 224 == (240 & r) ? r = (15 & r) << 12 | (63 & i[s++]) << 6 | 63 & i[s++] : 240 == (248 & r) && (r = (7 & r) << 18 | (63 & i[s++]) << 12 | (63 & i[s++]) << 6 | 63 & i[s++]), r >= 65536 ? (r -= 65536, a += String.fromCharCode(55296 + (r >>> 10), 56320 + (1023 & r))) : a += String.fromCharCode(r));
                return a
            }, t.write = function (e, t) {
                var n = this,
                    i = t || (t |= 0),
                    s = e.length,
                    a = 0,
                    r = 0;
                for (; r < s;)(a = e.charCodeAt(r++)) < 128 ? n[i++] = a : a < 2048 ? (n[i++] = 192 | a >>> 6, n[i++] = 128 | 63 & a) : a < 55296 || a > 57343 ? (n[i++] = 224 | a >>> 12, n[i++] = 128 | a >>> 6 & 63, n[i++] = 128 | 63 & a) : (a = 65536 + (a - 55296 << 10 | e.charCodeAt(r++) - 56320), n[i++] = 240 | a >>> 18, n[i++] = 128 | a >>> 12 & 63, n[i++] = 128 | a >>> 6 & 63, n[i++] = 128 | 63 & a);
                return i - t
            }
        },
    "./node_modules/msgpack-lite/lib/bufferish-array.js":
        /*!**********************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/bufferish-array.js ***!
          \**********************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

            function s(e) {
                return new Array(e)
            }(t = e.exports = s(0)).alloc = s, t.concat = i.concat, t.from = function (e) {
                if (!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
                else if (i.isArrayBuffer(e)) e = new Uint8Array(e);
                else {
                    if ("string" == typeof e) return i.from.call(t, e);
                    if ("number" == typeof e) throw new TypeError('"value" argument must not be a number')
                }
                return Array.prototype.slice.call(e)
            }
        },
    "./node_modules/msgpack-lite/lib/bufferish-buffer.js":
        /*!***********************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/bufferish-buffer.js ***!
          \***********************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                s = i.global;

            function a(e) {
                return new s(e)
            }(t = e.exports = i.hasBuffer ? a(0) : []).alloc = i.hasBuffer && s.alloc || a, t.concat = i.concat, t.from = function (e) {
                if (!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
                else if (i.isArrayBuffer(e)) e = new Uint8Array(e);
                else {
                    if ("string" == typeof e) return i.from.call(t, e);
                    if ("number" == typeof e) throw new TypeError('"value" argument must not be a number')
                }
                return s.from && 1 !== s.from.length ? s.from(e) : new s(e)
            }
        },
    "./node_modules/msgpack-lite/lib/bufferish-proto.js":
        /*!**********************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/bufferish-proto.js ***!
          \**********************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i, s = n( /*! ./buffer-lite */ "./node_modules/msgpack-lite/lib/buffer-lite.js");
            t.copy = c, t.slice = h, t.toString = function (e, t, n) {
                var i = !o && a.isBuffer(this) ? this.toString : s.toString;
                return i.apply(this, arguments)
            }, t.write = (i = "write", function () {
                return (this[i] || s[i]).apply(this, arguments)
            });
            var a = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                r = a.global,
                o = a.hasBuffer && "TYPED_ARRAY_SUPPORT" in r,
                l = o && !r.TYPED_ARRAY_SUPPORT;

            function c(e, t, n, i) {
                var r = a.isBuffer(this),
                    o = a.isBuffer(e);
                if (r && o) return this.copy(e, t, n, i);
                if (l || r || o || !a.isView(this) || !a.isView(e)) return s.copy.call(this, e, t, n, i);
                var c = n || null != i ? h.call(this, n, i) : this;
                return e.set(c, t), c.length
            }

            function h(e, t) {
                var n = this.slice || !l && this.subarray;
                if (n) return n.call(this, e, t);
                var i = a.alloc.call(this, t - e);
                return c.call(this, i, 0, e, t), i
            }
        },
    "./node_modules/msgpack-lite/lib/bufferish-uint8array.js":
        /*!***************************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/bufferish-uint8array.js ***!
          \***************************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

            function s(e) {
                return new Uint8Array(e)
            }(t = e.exports = i.hasArrayBuffer ? s(0) : []).alloc = s, t.concat = i.concat, t.from = function (e) {
                if (i.isView(e)) {
                    var n = e.byteOffset,
                        s = e.byteLength;
                    (e = e.buffer).byteLength !== s && (e.slice ? e = e.slice(n, n + s) : (e = new Uint8Array(e)).byteLength !== s && (e = Array.prototype.slice.call(e, n, n + s)))
                } else {
                    if ("string" == typeof e) return i.from.call(t, e);
                    if ("number" == typeof e) throw new TypeError('"value" argument must not be a number')
                }
                return new Uint8Array(e)
            }
        },
    "./node_modules/msgpack-lite/lib/bufferish.js":
        /*!****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/bufferish.js ***!
          \****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = t.global = n( /*! ./buffer-global */ "./node_modules/msgpack-lite/lib/buffer-global.js"),
                s = t.hasBuffer = i && !!i.isBuffer,
                a = t.hasArrayBuffer = "undefined" != typeof ArrayBuffer,
                r = t.isArray = n( /*! isarray */ "./node_modules/msgpack-lite/node_modules/isarray/index.js");
            t.isArrayBuffer = a ? function (e) {
                return e instanceof ArrayBuffer || p(e)
            } : y;
            var o = t.isBuffer = s ? i.isBuffer : y,
                l = t.isView = a ? ArrayBuffer.isView || k("ArrayBuffer", "buffer") : y;
            t.alloc = f, t.concat = function (e, n) {
                n || (n = 0, Array.prototype.forEach.call(e, (function (e) {
                    n += e.length
                })));
                var i = this !== t && this || e[0],
                    s = f.call(i, n),
                    a = 0;
                return Array.prototype.forEach.call(e, (function (e) {
                    a += d.copy.call(e, s, a)
                })), s
            }, t.from = function (e) {
                return "string" == typeof e ? m.call(this, e) : g(this).from(e)
            };
            var c = t.Array = n( /*! ./bufferish-array */ "./node_modules/msgpack-lite/lib/bufferish-array.js"),
                h = t.Buffer = n( /*! ./bufferish-buffer */ "./node_modules/msgpack-lite/lib/bufferish-buffer.js"),
                u = t.Uint8Array = n( /*! ./bufferish-uint8array */ "./node_modules/msgpack-lite/lib/bufferish-uint8array.js"),
                d = t.prototype = n( /*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");

            function f(e) {
                return g(this).alloc(e)
            }
            var p = k("ArrayBuffer");

            function m(e) {
                var t = 3 * e.length,
                    n = f.call(this, t),
                    i = d.write.call(n, e);
                return t !== i && (n = d.slice.call(n, 0, i)), n
            }

            function g(e) {
                return o(e) ? h : l(e) ? u : r(e) ? c : s ? h : a ? u : c
            }

            function y() {
                return !1
            }

            function k(e, t) {
                return e = "[object " + e + "]",
                    function (n) {
                        return null != n && {}.toString.call(t ? n[t] : n) === e
                    }
            }
        },
    "./node_modules/msgpack-lite/lib/codec-base.js":
        /*!*****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/codec-base.js ***!
          \*****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! isarray */ "./node_modules/msgpack-lite/node_modules/isarray/index.js");
            t.createCodec = o, t.install = function (e) {
                for (var t in e) a.prototype[t] = r(a.prototype[t], e[t])
            }, t.filter = function (e) {
                return i(e) ? function (e) {
                    return e = e.slice(),
                        function (n) {
                            return e.reduce(t, n)
                        };

                    function t(e, t) {
                        return t(e)
                    }
                }(e) : e
            };
            var s = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

            function a(e) {
                if (!(this instanceof a)) return new a(e);
                this.options = e, this.init()
            }

            function r(e, t) {
                return e && t ? function () {
                    return e.apply(this, arguments), t.apply(this, arguments)
                } : e || t
            }

            function o(e) {
                return new a(e)
            }
            a.prototype.init = function () {
                var e = this.options;
                return e && e.uint8array && (this.bufferish = s.Uint8Array), this
            }, t.preset = o({
                preset: !0
            })
        },
    "./node_modules/msgpack-lite/lib/codec.js":
        /*!************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/codec.js ***!
          \************************************************/
        /*! no static exports found */
        function (e, t, n) {
            n( /*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js"), n( /*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js"), t.codec = {
                preset: n( /*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js").preset
            }
        },
    "./node_modules/msgpack-lite/lib/decode-buffer.js":
        /*!********************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/decode-buffer.js ***!
          \********************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.DecodeBuffer = s;
            var i = n( /*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js").preset;

            function s(e) {
                if (!(this instanceof s)) return new s(e);
                if (e && (this.options = e, e.codec)) {
                    var t = this.codec = e.codec;
                    t.bufferish && (this.bufferish = t.bufferish)
                }
            }
            n( /*! ./flex-buffer */ "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexDecoder.mixin(s.prototype), s.prototype.codec = i, s.prototype.fetch = function () {
                return this.codec.decode(this)
            }
        },
    "./node_modules/msgpack-lite/lib/decode.js":
        /*!*************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/decode.js ***!
          \*************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.decode = function (e, t) {
                var n = new i(t);
                return n.write(e), n.read()
            };
            var i = n( /*! ./decode-buffer */ "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer
        },
    "./node_modules/msgpack-lite/lib/decoder.js":
        /*!**************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/decoder.js ***!
          \**************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.Decoder = a;
            var i = n( /*! event-lite */ "./node_modules/event-lite/event-lite.js"),
                s = n( /*! ./decode-buffer */ "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

            function a(e) {
                if (!(this instanceof a)) return new a(e);
                s.call(this, e)
            }
            a.prototype = new s, i.mixin(a.prototype), a.prototype.decode = function (e) {
                arguments.length && this.write(e), this.flush()
            }, a.prototype.push = function (e) {
                this.emit("data", e)
            }, a.prototype.end = function (e) {
                this.decode(e), this.emit("end")
            }
        },
    "./node_modules/msgpack-lite/lib/encode-buffer.js":
        /*!********************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/encode-buffer.js ***!
          \********************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.EncodeBuffer = s;
            var i = n( /*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js").preset;

            function s(e) {
                if (!(this instanceof s)) return new s(e);
                if (e && (this.options = e, e.codec)) {
                    var t = this.codec = e.codec;
                    t.bufferish && (this.bufferish = t.bufferish)
                }
            }
            n( /*! ./flex-buffer */ "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexEncoder.mixin(s.prototype), s.prototype.codec = i, s.prototype.write = function (e) {
                this.codec.encode(this, e)
            }
        },
    "./node_modules/msgpack-lite/lib/encode.js":
        /*!*************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/encode.js ***!
          \*************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.encode = function (e, t) {
                var n = new i(t);
                return n.write(e), n.read()
            };
            var i = n( /*! ./encode-buffer */ "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer
        },
    "./node_modules/msgpack-lite/lib/encoder.js":
        /*!**************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/encoder.js ***!
          \**************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.Encoder = a;
            var i = n( /*! event-lite */ "./node_modules/event-lite/event-lite.js"),
                s = n( /*! ./encode-buffer */ "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

            function a(e) {
                if (!(this instanceof a)) return new a(e);
                s.call(this, e)
            }
            a.prototype = new s, i.mixin(a.prototype), a.prototype.encode = function (e) {
                this.write(e), this.emit("data", this.read())
            }, a.prototype.end = function (e) {
                arguments.length && this.encode(e), this.flush(), this.emit("end")
            }
        },
    "./node_modules/msgpack-lite/lib/ext-buffer.js":
        /*!*****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/ext-buffer.js ***!
          \*****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.ExtBuffer = function e(t, n) {
                if (!(this instanceof e)) return new e(t, n);
                this.buffer = i.from(t), this.type = n
            };
            var i = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js")
        },
    "./node_modules/msgpack-lite/lib/ext-packer.js":
        /*!*****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/ext-packer.js ***!
          \*****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.setExtPackers = function (e) {
                e.addExtPacker(14, Error, [u, l]), e.addExtPacker(1, EvalError, [u, l]), e.addExtPacker(2, RangeError, [u, l]), e.addExtPacker(3, ReferenceError, [u, l]), e.addExtPacker(4, SyntaxError, [u, l]), e.addExtPacker(5, TypeError, [u, l]), e.addExtPacker(6, URIError, [u, l]), e.addExtPacker(10, RegExp, [h, l]), e.addExtPacker(11, Boolean, [c, l]), e.addExtPacker(12, String, [c, l]), e.addExtPacker(13, Date, [Number, l]), e.addExtPacker(15, Number, [c, l]), "undefined" != typeof Uint8Array && (e.addExtPacker(17, Int8Array, r), e.addExtPacker(18, Uint8Array, r), e.addExtPacker(19, Int16Array, r), e.addExtPacker(20, Uint16Array, r), e.addExtPacker(21, Int32Array, r), e.addExtPacker(22, Uint32Array, r), e.addExtPacker(23, Float32Array, r), "undefined" != typeof Float64Array && e.addExtPacker(24, Float64Array, r), "undefined" != typeof Uint8ClampedArray && e.addExtPacker(25, Uint8ClampedArray, r), e.addExtPacker(26, ArrayBuffer, r), e.addExtPacker(29, DataView, r));
                s.hasBuffer && e.addExtPacker(27, a, s.from)
            };
            var i, s = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                a = s.global,
                r = s.Uint8Array.from,
                o = {
                    name: 1,
                    message: 1,
                    stack: 1,
                    columnNumber: 1,
                    fileName: 1,
                    lineNumber: 1
                };

            function l(e) {
                return i || (i = n( /*! ./encode */ "./node_modules/msgpack-lite/lib/encode.js").encode), i(e)
            }

            function c(e) {
                return e.valueOf()
            }

            function h(e) {
                (e = RegExp.prototype.toString.call(e).split("/")).shift();
                var t = [e.pop()];
                return t.unshift(e.join("/")), t
            }

            function u(e) {
                var t = {};
                for (var n in o) t[n] = e[n];
                return t
            }
        },
    "./node_modules/msgpack-lite/lib/ext-unpacker.js":
        /*!*******************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/ext-unpacker.js ***!
          \*******************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.setExtUnpackers = function (e) {
                e.addExtUnpacker(14, [o, c(Error)]), e.addExtUnpacker(1, [o, c(EvalError)]), e.addExtUnpacker(2, [o, c(RangeError)]), e.addExtUnpacker(3, [o, c(ReferenceError)]), e.addExtUnpacker(4, [o, c(SyntaxError)]), e.addExtUnpacker(5, [o, c(TypeError)]), e.addExtUnpacker(6, [o, c(URIError)]), e.addExtUnpacker(10, [o, l]), e.addExtUnpacker(11, [o, h(Boolean)]), e.addExtUnpacker(12, [o, h(String)]), e.addExtUnpacker(13, [o, h(Date)]), e.addExtUnpacker(15, [o, h(Number)]), "undefined" != typeof Uint8Array && (e.addExtUnpacker(17, h(Int8Array)), e.addExtUnpacker(18, h(Uint8Array)), e.addExtUnpacker(19, [u, h(Int16Array)]), e.addExtUnpacker(20, [u, h(Uint16Array)]), e.addExtUnpacker(21, [u, h(Int32Array)]), e.addExtUnpacker(22, [u, h(Uint32Array)]), e.addExtUnpacker(23, [u, h(Float32Array)]), "undefined" != typeof Float64Array && e.addExtUnpacker(24, [u, h(Float64Array)]), "undefined" != typeof Uint8ClampedArray && e.addExtUnpacker(25, h(Uint8ClampedArray)), e.addExtUnpacker(26, u), e.addExtUnpacker(29, [u, h(DataView)]));
                s.hasBuffer && e.addExtUnpacker(27, h(a))
            };
            var i, s = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                a = s.global,
                r = {
                    name: 1,
                    message: 1,
                    stack: 1,
                    columnNumber: 1,
                    fileName: 1,
                    lineNumber: 1
                };

            function o(e) {
                return i || (i = n( /*! ./decode */ "./node_modules/msgpack-lite/lib/decode.js").decode), i(e)
            }

            function l(e) {
                return RegExp.apply(null, e)
            }

            function c(e) {
                return function (t) {
                    var n = new e;
                    for (var i in r) n[i] = t[i];
                    return n
                }
            }

            function h(e) {
                return function (t) {
                    return new e(t)
                }
            }

            function u(e) {
                return new Uint8Array(e).buffer
            }
        },
    "./node_modules/msgpack-lite/lib/ext.js":
        /*!**********************************************!*\
          !*** ./node_modules/msgpack-lite/lib/ext.js ***!
          \**********************************************/
        /*! no static exports found */
        function (e, t, n) {
            n( /*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js"), n( /*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js"), t.createCodec = n( /*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js").createCodec
        },
    "./node_modules/msgpack-lite/lib/flex-buffer.js":
        /*!******************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/flex-buffer.js ***!
          \******************************************************/
        /*! no static exports found */
        function (e, t, n) {
            t.FlexDecoder = a, t.FlexEncoder = r;
            var i = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                s = "BUFFER_SHORTAGE";

            function a() {
                if (!(this instanceof a)) return new a
            }

            function r() {
                if (!(this instanceof r)) return new r
            }

            function o() {
                throw new Error("method not implemented: write()")
            }

            function l() {
                throw new Error("method not implemented: fetch()")
            }

            function c() {
                return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch()
            }

            function h(e) {
                (this.buffers || (this.buffers = [])).push(e)
            }

            function u() {
                return (this.buffers || (this.buffers = [])).shift()
            }

            function d(e) {
                return function (t) {
                    for (var n in e) t[n] = e[n];
                    return t
                }
            }
            a.mixin = d({
                bufferish: i,
                write: function (e) {
                    var t = this.offset ? i.prototype.slice.call(this.buffer, this.offset) : this.buffer;
                    this.buffer = t ? e ? this.bufferish.concat([t, e]) : t : e, this.offset = 0
                },
                fetch: l,
                flush: function () {
                    for (; this.offset < this.buffer.length;) {
                        var e, t = this.offset;
                        try {
                            e = this.fetch()
                        } catch (e) {
                            if (e && e.message != s) throw e;
                            this.offset = t;
                            break
                        }
                        this.push(e)
                    }
                },
                push: h,
                pull: u,
                read: c,
                reserve: function (e) {
                    var t = this.offset,
                        n = t + e;
                    if (n > this.buffer.length) throw new Error(s);
                    return this.offset = n, t
                },
                offset: 0
            }), a.mixin(a.prototype), r.mixin = d({
                bufferish: i,
                write: o,
                fetch: function () {
                    var e = this.start;
                    if (e < this.offset) {
                        var t = this.start = this.offset;
                        return i.prototype.slice.call(this.buffer, e, t)
                    }
                },
                flush: function () {
                    for (; this.start < this.offset;) {
                        var e = this.fetch();
                        e && this.push(e)
                    }
                },
                push: h,
                pull: function () {
                    var e = this.buffers || (this.buffers = []),
                        t = e.length > 1 ? this.bufferish.concat(e) : e[0];
                    return e.length = 0, t
                },
                read: c,
                reserve: function (e) {
                    var t = 0 | e;
                    if (this.buffer) {
                        var n = this.buffer.length,
                            i = 0 | this.offset,
                            s = i + t;
                        if (s < n) return this.offset = s, i;
                        this.flush(), e = Math.max(e, Math.min(2 * n, this.maxBufferSize))
                    }
                    return e = Math.max(e, this.minBufferSize), this.buffer = this.bufferish.alloc(e), this.start = 0, this.offset = t, 0
                },
                send: function (e) {
                    var t = e.length;
                    if (t > this.minBufferSize) this.flush(), this.push(e);
                    else {
                        var n = this.reserve(t);
                        i.prototype.copy.call(e, this.buffer, n)
                    }
                },
                maxBufferSize: 65536,
                minBufferSize: 2048,
                offset: 0,
                start: 0
            }), r.mixin(r.prototype)
        },
    "./node_modules/msgpack-lite/lib/read-core.js":
        /*!****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/read-core.js ***!
          \****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer,
                s = n( /*! ./ext-unpacker */ "./node_modules/msgpack-lite/lib/ext-unpacker.js"),
                a = n( /*! ./read-format */ "./node_modules/msgpack-lite/lib/read-format.js").readUint8,
                r = n( /*! ./read-token */ "./node_modules/msgpack-lite/lib/read-token.js"),
                o = n( /*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js");

            function l() {
                var e = this.options;
                return this.decode = function (e) {
                    var t = r.getReadToken(e);
                    return function (e) {
                        var n = a(e),
                            i = t[n];
                        if (!i) throw new Error("Invalid type: " + (n ? "0x" + n.toString(16) : n));
                        return i(e)
                    }
                }(e), e && e.preset && s.setExtUnpackers(this), this
            }
            o.install({
                addExtUnpacker: function (e, t) {
                    (this.extUnpackers || (this.extUnpackers = []))[e] = o.filter(t)
                },
                getExtUnpacker: function (e) {
                    return (this.extUnpackers || (this.extUnpackers = []))[e] || function (t) {
                        return new i(t, e)
                    }
                },
                init: l
            }), t.preset = l.call(o.preset)
        },
    "./node_modules/msgpack-lite/lib/read-format.js":
        /*!******************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/read-format.js ***!
          \******************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ieee754 */ "./node_modules/ieee754/index.js"),
                s = n( /*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js"),
                a = s.Uint64BE,
                r = s.Int64BE;
            t.getReadFormat = function (e) {
                var t = o.hasArrayBuffer && e && e.binarraybuffer,
                    n = e && e.int64;
                return {
                    map: c && e && e.usemap ? u : h,
                    array: d,
                    str: f,
                    bin: t ? m : p,
                    ext: g,
                    uint8: y,
                    uint16: w,
                    uint32: v,
                    uint64: S(8, n ? M : I),
                    int8: k,
                    int16: b,
                    int32: x,
                    int64: S(8, n ? j : T),
                    float32: S(4, E),
                    float64: S(8, C)
                }
            }, t.readUint8 = y;
            var o = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                l = n( /*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js"),
                c = "undefined" != typeof Map;

            function h(e, t) {
                var n, i = {},
                    s = new Array(t),
                    a = new Array(t),
                    r = e.codec.decode;
                for (n = 0; n < t; n++) s[n] = r(e), a[n] = r(e);
                for (n = 0; n < t; n++) i[s[n]] = a[n];
                return i
            }

            function u(e, t) {
                var n, i = new Map,
                    s = new Array(t),
                    a = new Array(t),
                    r = e.codec.decode;
                for (n = 0; n < t; n++) s[n] = r(e), a[n] = r(e);
                for (n = 0; n < t; n++) i.set(s[n], a[n]);
                return i
            }

            function d(e, t) {
                for (var n = new Array(t), i = e.codec.decode, s = 0; s < t; s++) n[s] = i(e);
                return n
            }

            function f(e, t) {
                var n = e.reserve(t),
                    i = n + t;
                return l.toString.call(e.buffer, "utf-8", n, i)
            }

            function p(e, t) {
                var n = e.reserve(t),
                    i = n + t,
                    s = l.slice.call(e.buffer, n, i);
                return o.from(s)
            }

            function m(e, t) {
                var n = e.reserve(t),
                    i = n + t,
                    s = l.slice.call(e.buffer, n, i);
                return o.Uint8Array.from(s).buffer
            }

            function g(e, t) {
                var n = e.reserve(t + 1),
                    i = e.buffer[n++],
                    s = n + t,
                    a = e.codec.getExtUnpacker(i);
                if (!a) throw new Error("Invalid ext type: " + (i ? "0x" + i.toString(16) : i));
                return a(l.slice.call(e.buffer, n, s))
            }

            function y(e) {
                var t = e.reserve(1);
                return e.buffer[t]
            }

            function k(e) {
                var t = e.reserve(1),
                    n = e.buffer[t];
                return 128 & n ? n - 256 : n
            }

            function w(e) {
                var t = e.reserve(2),
                    n = e.buffer;
                return n[t++] << 8 | n[t]
            }

            function b(e) {
                var t = e.reserve(2),
                    n = e.buffer,
                    i = n[t++] << 8 | n[t];
                return 32768 & i ? i - 65536 : i
            }

            function v(e) {
                var t = e.reserve(4),
                    n = e.buffer;
                return 16777216 * n[t++] + (n[t++] << 16) + (n[t++] << 8) + n[t]
            }

            function x(e) {
                var t = e.reserve(4),
                    n = e.buffer;
                return n[t++] << 24 | n[t++] << 16 | n[t++] << 8 | n[t]
            }

            function S(e, t) {
                return function (n) {
                    var i = n.reserve(e);
                    return t.call(n.buffer, i, true)
                }
            }

            function I(e) {
                return new a(this, e).toNumber()
            }

            function T(e) {
                return new r(this, e).toNumber()
            }

            function M(e) {
                return new a(this, e)
            }

            function j(e) {
                return new r(this, e)
            }

            function E(e) {
                return i.read(this, e, !1, 23, 4)
            }

            function C(e) {
                return i.read(this, e, !1, 52, 8)
            }
        },
    "./node_modules/msgpack-lite/lib/read-token.js":
        /*!*****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/read-token.js ***!
          \*****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ./read-format */ "./node_modules/msgpack-lite/lib/read-format.js");

            function s(e) {
                var t, n = new Array(256);
                for (t = 0; t <= 127; t++) n[t] = a(t);
                for (t = 128; t <= 143; t++) n[t] = o(t - 128, e.map);
                for (t = 144; t <= 159; t++) n[t] = o(t - 144, e.array);
                for (t = 160; t <= 191; t++) n[t] = o(t - 160, e.str);
                for (n[192] = a(null), n[193] = null, n[194] = a(!1), n[195] = a(!0), n[196] = r(e.uint8, e.bin), n[197] = r(e.uint16, e.bin), n[198] = r(e.uint32, e.bin), n[199] = r(e.uint8, e.ext), n[200] = r(e.uint16, e.ext), n[201] = r(e.uint32, e.ext), n[202] = e.float32, n[203] = e.float64, n[204] = e.uint8, n[205] = e.uint16, n[206] = e.uint32, n[207] = e.uint64, n[208] = e.int8, n[209] = e.int16, n[210] = e.int32, n[211] = e.int64, n[212] = o(1, e.ext), n[213] = o(2, e.ext), n[214] = o(4, e.ext), n[215] = o(8, e.ext), n[216] = o(16, e.ext), n[217] = r(e.uint8, e.str), n[218] = r(e.uint16, e.str), n[219] = r(e.uint32, e.str), n[220] = r(e.uint16, e.array), n[221] = r(e.uint32, e.array), n[222] = r(e.uint16, e.map), n[223] = r(e.uint32, e.map), t = 224; t <= 255; t++) n[t] = a(t - 256);
                return n
            }

            function a(e) {
                return function () {
                    return e
                }
            }

            function r(e, t) {
                return function (n) {
                    var i = e(n);
                    return t(n, i)
                }
            }

            function o(e, t) {
                return function (n) {
                    return t(n, e)
                }
            }
            t.getReadToken = function (e) {
                var t = i.getReadFormat(e);
                return e && e.useraw ? function (e) {
                    var t, n = s(e).slice();
                    for (n[217] = n[196], n[218] = n[197], n[219] = n[198], t = 160; t <= 191; t++) n[t] = o(t - 160, e.bin);
                    return n
                }(t) : s(t)
            }
        },
    "./node_modules/msgpack-lite/lib/write-core.js":
        /*!*****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/write-core.js ***!
          \*****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer,
                s = n( /*! ./ext-packer */ "./node_modules/msgpack-lite/lib/ext-packer.js"),
                a = n( /*! ./write-type */ "./node_modules/msgpack-lite/lib/write-type.js"),
                r = n( /*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js");

            function o() {
                var e = this.options;
                return this.encode = function (e) {
                    var t = a.getWriteType(e);
                    return function (e, n) {
                        var i = t[typeof n];
                        if (!i) throw new Error('Unsupported type "' + typeof n + '": ' + n);
                        i(e, n)
                    }
                }(e), e && e.preset && s.setExtPackers(this), this
            }
            r.install({
                addExtPacker: function (e, t, n) {
                    n = r.filter(n);
                    var s = t.name;
                    if (s && "Object" !== s) {
                        (this.extPackers || (this.extPackers = {}))[s] = a
                    } else {
                        (this.extEncoderList || (this.extEncoderList = [])).unshift([t, a])
                    }

                    function a(t) {
                        return n && (t = n(t)), new i(t, e)
                    }
                },
                getExtPacker: function (e) {
                    var t = this.extPackers || (this.extPackers = {}),
                        n = e.constructor,
                        i = n && n.name && t[n.name];
                    if (i) return i;
                    for (var s = this.extEncoderList || (this.extEncoderList = []), a = s.length, r = 0; r < a; r++) {
                        var o = s[r];
                        if (n === o[0]) return o[1]
                    }
                },
                init: o
            }), t.preset = o.call(r.preset)
        },
    "./node_modules/msgpack-lite/lib/write-token.js":
        /*!******************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/write-token.js ***!
          \******************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! ieee754 */ "./node_modules/ieee754/index.js"),
                s = n( /*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js"),
                a = s.Uint64BE,
                r = s.Int64BE,
                o = n( /*! ./write-uint8 */ "./node_modules/msgpack-lite/lib/write-uint8.js").uint8,
                l = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                c = l.global,
                h = l.hasBuffer && "TYPED_ARRAY_SUPPORT" in c && !c.TYPED_ARRAY_SUPPORT,
                u = l.hasBuffer && c.prototype || {};

            function d() {
                var e = o.slice();
                return e[196] = f(196), e[197] = p(197), e[198] = m(198), e[199] = f(199), e[200] = p(200), e[201] = m(201), e[202] = g(202, 4, u.writeFloatBE || w, !0), e[203] = g(203, 8, u.writeDoubleBE || b, !0), e[204] = f(204), e[205] = p(205), e[206] = m(206), e[207] = g(207, 8, y), e[208] = f(208), e[209] = p(209), e[210] = m(210), e[211] = g(211, 8, k), e[217] = f(217), e[218] = p(218), e[219] = m(219), e[220] = p(220), e[221] = m(221), e[222] = p(222), e[223] = m(223), e
            }

            function f(e) {
                return function (t, n) {
                    var i = t.reserve(2),
                        s = t.buffer;
                    s[i++] = e, s[i] = n
                }
            }

            function p(e) {
                return function (t, n) {
                    var i = t.reserve(3),
                        s = t.buffer;
                    s[i++] = e, s[i++] = n >>> 8, s[i] = n
                }
            }

            function m(e) {
                return function (t, n) {
                    var i = t.reserve(5),
                        s = t.buffer;
                    s[i++] = e, s[i++] = n >>> 24, s[i++] = n >>> 16, s[i++] = n >>> 8, s[i] = n
                }
            }

            function g(e, t, n, i) {
                return function (s, a) {
                    var r = s.reserve(t + 1);
                    s.buffer[r++] = e, n.call(s.buffer, a, r, i)
                }
            }

            function y(e, t) {
                new a(this, t, e)
            }

            function k(e, t) {
                new r(this, t, e)
            }

            function w(e, t) {
                i.write(this, e, t, !1, 23, 4)
            }

            function b(e, t) {
                i.write(this, e, t, !1, 52, 8)
            }
            t.getWriteToken = function (e) {
                return e && e.uint8array ? ((t = d())[202] = g(202, 4, w), t[203] = g(203, 8, b), t) : h || l.hasBuffer && e && e.safe ? function () {
                    var e = o.slice();
                    return e[196] = g(196, 1, c.prototype.writeUInt8), e[197] = g(197, 2, c.prototype.writeUInt16BE), e[198] = g(198, 4, c.prototype.writeUInt32BE), e[199] = g(199, 1, c.prototype.writeUInt8), e[200] = g(200, 2, c.prototype.writeUInt16BE), e[201] = g(201, 4, c.prototype.writeUInt32BE), e[202] = g(202, 4, c.prototype.writeFloatBE), e[203] = g(203, 8, c.prototype.writeDoubleBE), e[204] = g(204, 1, c.prototype.writeUInt8), e[205] = g(205, 2, c.prototype.writeUInt16BE), e[206] = g(206, 4, c.prototype.writeUInt32BE), e[207] = g(207, 8, y), e[208] = g(208, 1, c.prototype.writeInt8), e[209] = g(209, 2, c.prototype.writeInt16BE), e[210] = g(210, 4, c.prototype.writeInt32BE), e[211] = g(211, 8, k), e[217] = g(217, 1, c.prototype.writeUInt8), e[218] = g(218, 2, c.prototype.writeUInt16BE), e[219] = g(219, 4, c.prototype.writeUInt32BE), e[220] = g(220, 2, c.prototype.writeUInt16BE), e[221] = g(221, 4, c.prototype.writeUInt32BE), e[222] = g(222, 2, c.prototype.writeUInt16BE), e[223] = g(223, 4, c.prototype.writeUInt32BE), e
                }() : d();
                var t
            }
        },
    "./node_modules/msgpack-lite/lib/write-type.js":
        /*!*****************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/write-type.js ***!
          \*****************************************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! isarray */ "./node_modules/msgpack-lite/node_modules/isarray/index.js"),
                s = n( /*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js"),
                a = s.Uint64BE,
                r = s.Int64BE,
                o = n( /*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js"),
                l = n( /*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js"),
                c = n( /*! ./write-token */ "./node_modules/msgpack-lite/lib/write-token.js"),
                h = n( /*! ./write-uint8 */ "./node_modules/msgpack-lite/lib/write-uint8.js").uint8,
                u = n( /*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer,
                d = "undefined" != typeof Uint8Array,
                f = "undefined" != typeof Map,
                p = [];
            p[1] = 212, p[2] = 213, p[4] = 214, p[8] = 215, p[16] = 216, t.getWriteType = function (e) {
                var t = c.getWriteToken(e),
                    n = e && e.useraw,
                    s = d && e && e.binarraybuffer,
                    m = s ? o.isArrayBuffer : o.isBuffer,
                    g = s ? function (e, t) {
                        b(e, new Uint8Array(t))
                    } : b,
                    y = f && e && e.usemap ? function (e, n) {
                        if (!(n instanceof Map)) return v(e, n);
                        var i = n.size;
                        t[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](e, i);
                        var s = e.codec.encode;
                        n.forEach((function (t, n, i) {
                            s(e, n), s(e, t)
                        }))
                    } : v;
                return {
                    boolean: function (e, n) {
                        t[n ? 195 : 194](e, n)
                    },
                    function: w,
                    number: function (e, n) {
                        var i, s = 0 | n;
                        if (n !== s) return void t[i = 203](e, n);
                        i = -32 <= s && s <= 127 ? 255 & s : 0 <= s ? s <= 255 ? 204 : s <= 65535 ? 205 : 206 : -128 <= s ? 208 : -32768 <= s ? 209 : 210;
                        t[i](e, s)
                    },
                    object: n ? function (e, n) {
                        if (m(n)) return function (e, n) {
                            var i = n.length;
                            t[i < 32 ? 160 + i : i <= 65535 ? 218 : 219](e, i), e.send(n)
                        }(e, n);
                        k(e, n)
                    } : k,
                    string: function (e) {
                        return n;

                        function n(n, i) {
                            var s = i.length,
                                a = 5 + 3 * s;
                            n.offset = n.reserve(a);
                            var r = n.buffer,
                                o = e(s),
                                c = n.offset + o;
                            s = l.write.call(r, i, c);
                            var h = e(s);
                            if (o !== h) {
                                var u = c + h - o,
                                    d = c + s;
                                l.copy.call(r, r, u, c, d)
                            }
                            t[1 === h ? 160 + s : h <= 3 ? 215 + h : 219](n, s), n.offset += s
                        }
                    }(n ? function (e) {
                        return e < 32 ? 1 : e <= 65535 ? 3 : 5
                    } : function (e) {
                        return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5
                    }),
                    symbol: w,
                    undefined: w
                };

                function k(e, n) {
                    if (null === n) return w(e, n);
                    if (m(n)) return g(e, n);
                    if (i(n)) return function (e, n) {
                        var i = n.length;
                        t[i < 16 ? 144 + i : i <= 65535 ? 220 : 221](e, i);
                        for (var s = e.codec.encode, a = 0; a < i; a++) s(e, n[a])
                    }(e, n);
                    if (a.isUint64BE(n)) return function (e, n) {
                        t[207](e, n.toArray())
                    }(e, n);
                    if (r.isInt64BE(n)) return function (e, n) {
                        t[211](e, n.toArray())
                    }(e, n);
                    var s = e.codec.getExtPacker(n);
                    if (s && (n = s(n)), n instanceof u) return function (e, n) {
                        var i = n.buffer,
                            s = i.length,
                            a = p[s] || (s < 255 ? 199 : s <= 65535 ? 200 : 201);
                        t[a](e, s), h[n.type](e), e.send(i)
                    }(e, n);
                    y(e, n)
                }

                function w(e, n) {
                    t[192](e, n)
                }

                function b(e, n) {
                    var i = n.length;
                    t[i < 255 ? 196 : i <= 65535 ? 197 : 198](e, i), e.send(n)
                }

                function v(e, n) {
                    var i = Object.keys(n),
                        s = i.length;
                    t[s < 16 ? 128 + s : s <= 65535 ? 222 : 223](e, s);
                    var a = e.codec.encode;
                    i.forEach((function (t) {
                        a(e, t), a(e, n[t])
                    }))
                }
            }
        },
    "./node_modules/msgpack-lite/lib/write-uint8.js":
        /*!******************************************************!*\
          !*** ./node_modules/msgpack-lite/lib/write-uint8.js ***!
          \******************************************************/
        /*! no static exports found */
        function (e, t) {
            for (var n = t.uint8 = new Array(256), i = 0; i <= 255; i++) n[i] = s(i);

            function s(e) {
                return function (t) {
                    var n = t.reserve(1);
                    t.buffer[n] = e
                }
            }
        },
    "./node_modules/msgpack-lite/node_modules/isarray/index.js":
        /*!*****************************************************************!*\
          !*** ./node_modules/msgpack-lite/node_modules/isarray/index.js ***!
          \*****************************************************************/
        /*! no static exports found */
        function (e, t) {
            var n = {}.toString;
            e.exports = Array.isArray || function (e) {
                return "[object Array]" == n.call(e)
            }
        },
    "./node_modules/process/browser.js":
        /*!*****************************************!*\
          !*** ./node_modules/process/browser.js ***!
          \*****************************************/
        /*! no static exports found */
        function (e, t) {
            var n, i, s = e.exports = {};

            function a() {
                throw new Error("setTimeout has not been defined")
            }

            function r() {
                throw new Error("clearTimeout has not been defined")
            }

            function o(e) {
                if (n === setTimeout) return setTimeout(e, 0);
                if ((n === a || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
                try {
                    return n(e, 0)
                } catch (t) {
                    try {
                        return n.call(null, e, 0)
                    } catch (t) {
                        return n.call(this, e, 0)
                    }
                }
            }! function () {
                try {
                    n = "function" == typeof setTimeout ? setTimeout : a
                } catch (e) {
                    n = a
                }
                try {
                    i = "function" == typeof clearTimeout ? clearTimeout : r
                } catch (e) {
                    i = r
                }
            }();
            var l, c = [],
                h = !1,
                u = -1;

            function d() {
                h && l && (h = !1, l.length ? c = l.concat(c) : u = -1, c.length && f())
            }

            function f() {
                if (!h) {
                    var e = o(d);
                    h = !0;
                    for (var t = c.length; t;) {
                        for (l = c, c = []; ++u < t;) l && l[u].run();
                        u = -1, t = c.length
                    }
                    l = null, h = !1,
                        function (e) {
                            if (i === clearTimeout) return clearTimeout(e);
                            if ((i === r || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);
                            try {
                                i(e)
                            } catch (t) {
                                try {
                                    return i.call(null, e)
                                } catch (t) {
                                    return i.call(this, e)
                                }
                            }
                        }(e)
                }
            }

            function p(e, t) {
                this.fun = e, this.array = t
            }

            function m() {}
            s.nextTick = function (e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
                c.push(new p(e, t)), 1 !== c.length || h || o(f)
            }, p.prototype.run = function () {
                this.fun.apply(null, this.array)
            }, s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.version = "", s.versions = {}, s.on = m, s.addListener = m, s.once = m, s.off = m, s.removeListener = m, s.removeAllListeners = m, s.emit = m, s.prependListener = m, s.prependOnceListener = m, s.listeners = function (e) {
                return []
            }, s.binding = function (e) {
                throw new Error("process.binding is not supported")
            }, s.cwd = function () {
                return "/"
            }, s.chdir = function (e) {
                throw new Error("process.chdir is not supported")
            }, s.umask = function () {
                return 0
            }
        },
    "./node_modules/punycode/punycode.js":
        /*!*******************************************!*\
          !*** ./node_modules/punycode/punycode.js ***!
          \*******************************************/
        /*! no static exports found */
        function (e, t, n) {
            (function (e, i) {
                var s; /*! https://mths.be/punycode v1.4.1 by @mathias */
                ! function (a) {
                    t && t.nodeType, e && e.nodeType;
                    var r = "object" == typeof i && i;
                    r.global !== r && r.window !== r && r.self;
                    var o, l = 2147483647,
                        c = 36,
                        h = /^xn--/,
                        u = /[^\x20-\x7E]/,
                        d = /[\x2E\u3002\uFF0E\uFF61]/g,
                        f = {
                            overflow: "Overflow: input needs wider integers to process",
                            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                            "invalid-input": "Invalid input"
                        },
                        p = Math.floor,
                        m = String.fromCharCode;

                    function g(e) {
                        throw new RangeError(f[e])
                    }

                    function y(e, t) {
                        for (var n = e.length, i = []; n--;) i[n] = t(e[n]);
                        return i
                    }

                    function k(e, t) {
                        var n = e.split("@"),
                            i = "";
                        return n.length > 1 && (i = n[0] + "@", e = n[1]), i + y((e = e.replace(d, ".")).split("."), t).join(".")
                    }

                    function w(e) {
                        for (var t, n, i = [], s = 0, a = e.length; s < a;)(t = e.charCodeAt(s++)) >= 55296 && t <= 56319 && s < a ? 56320 == (64512 & (n = e.charCodeAt(s++))) ? i.push(((1023 & t) << 10) + (1023 & n) + 65536) : (i.push(t), s--) : i.push(t);
                        return i
                    }

                    function b(e) {
                        return y(e, (function (e) {
                            var t = "";
                            return e > 65535 && (t += m((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += m(e)
                        })).join("")
                    }

                    function v(e, t) {
                        return e + 22 + 75 * (e < 26) - ((0 != t) << 5)
                    }

                    function x(e, t, n) {
                        var i = 0;
                        for (e = n ? p(e / 700) : e >> 1, e += p(e / t); e > 455; i += c) e = p(e / 35);
                        return p(i + 36 * e / (e + 38))
                    }

                    function S(e) {
                        var t, n, i, s, a, r, o, h, u, d, f, m = [],
                            y = e.length,
                            k = 0,
                            w = 128,
                            v = 72;
                        for ((n = e.lastIndexOf("-")) < 0 && (n = 0), i = 0; i < n; ++i) e.charCodeAt(i) >= 128 && g("not-basic"), m.push(e.charCodeAt(i));
                        for (s = n > 0 ? n + 1 : 0; s < y;) {
                            for (a = k, r = 1, o = c; s >= y && g("invalid-input"), ((h = (f = e.charCodeAt(s++)) - 48 < 10 ? f - 22 : f - 65 < 26 ? f - 65 : f - 97 < 26 ? f - 97 : c) >= c || h > p((l - k) / r)) && g("overflow"), k += h * r, !(h < (u = o <= v ? 1 : o >= v + 26 ? 26 : o - v)); o += c) r > p(l / (d = c - u)) && g("overflow"), r *= d;
                            v = x(k - a, t = m.length + 1, 0 == a), p(k / t) > l - w && g("overflow"), w += p(k / t), k %= t, m.splice(k++, 0, w)
                        }
                        return b(m)
                    }

                    function I(e) {
                        var t, n, i, s, a, r, o, h, u, d, f, y, k, b, S, I = [];
                        for (y = (e = w(e)).length, t = 128, n = 0, a = 72, r = 0; r < y; ++r)(f = e[r]) < 128 && I.push(m(f));
                        for (i = s = I.length, s && I.push("-"); i < y;) {
                            for (o = l, r = 0; r < y; ++r)(f = e[r]) >= t && f < o && (o = f);
                            for (o - t > p((l - n) / (k = i + 1)) && g("overflow"), n += (o - t) * k, t = o, r = 0; r < y; ++r)
                                if ((f = e[r]) < t && ++n > l && g("overflow"), f == t) {
                                    for (h = n, u = c; !(h < (d = u <= a ? 1 : u >= a + 26 ? 26 : u - a)); u += c) S = h - d, b = c - d, I.push(m(v(d + S % b, 0))), h = p(S / b);
                                    I.push(m(v(h, 0))), a = x(n, k, i == s), n = 0, ++i
                                }++ n, ++t
                        }
                        return I.join("")
                    }
                    o = {
                        version: "1.4.1",
                        ucs2: {
                            decode: w,
                            encode: b
                        },
                        decode: S,
                        encode: I,
                        toASCII: function (e) {
                            return k(e, (function (e) {
                                return u.test(e) ? "xn--" + I(e) : e
                            }))
                        },
                        toUnicode: function (e) {
                            return k(e, (function (e) {
                                return h.test(e) ? S(e.slice(4).toLowerCase()) : e
                            }))
                        }
                    }, void 0 === (s = function () {
                        return o
                    }.call(t, n, t, e)) || (e.exports = s)
                }()
            }).call(this, n( /*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(e), n( /*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"))
        },
    "./node_modules/querystring-es3/decode.js":
        /*!************************************************!*\
          !*** ./node_modules/querystring-es3/decode.js ***!
          \************************************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";

            function i(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            e.exports = function (e, t, n, a) {
                t = t || "&", n = n || "=";
                var r = {};
                if ("string" != typeof e || 0 === e.length) return r;
                var o = /\+/g;
                e = e.split(t);
                var l = 1e3;
                a && "number" == typeof a.maxKeys && (l = a.maxKeys);
                var c = e.length;
                l > 0 && c > l && (c = l);
                for (var h = 0; h < c; ++h) {
                    var u, d, f, p, m = e[h].replace(o, "%20"),
                        g = m.indexOf(n);
                    g >= 0 ? (u = m.substr(0, g), d = m.substr(g + 1)) : (u = m, d = ""), f = decodeURIComponent(u), p = decodeURIComponent(d), i(r, f) ? s(r[f]) ? r[f].push(p) : r[f] = [r[f], p] : r[f] = p
                }
                return r
            };
            var s = Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }
        },
    "./node_modules/querystring-es3/encode.js":
        /*!************************************************!*\
          !*** ./node_modules/querystring-es3/encode.js ***!
          \************************************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            var i = function (e) {
                switch (typeof e) {
                case "string":
                    return e;
                case "boolean":
                    return e ? "true" : "false";
                case "number":
                    return isFinite(e) ? e : "";
                default:
                    return ""
                }
            };
            e.exports = function (e, t, n, o) {
                return t = t || "&", n = n || "=", null === e && (e = void 0), "object" == typeof e ? a(r(e), (function (r) {
                    var o = encodeURIComponent(i(r)) + n;
                    return s(e[r]) ? a(e[r], (function (e) {
                        return o + encodeURIComponent(i(e))
                    })).join(t) : o + encodeURIComponent(i(e[r]))
                })).join(t) : o ? encodeURIComponent(i(o)) + n + encodeURIComponent(i(e)) : ""
            };
            var s = Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            };

            function a(e, t) {
                if (e.map) return e.map(t);
                for (var n = [], i = 0; i < e.length; i++) n.push(t(e[i], i));
                return n
            }
            var r = Object.keys || function (e) {
                var t = [];
                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
                return t
            }
        },
    "./node_modules/querystring-es3/index.js":
        /*!***********************************************!*\
          !*** ./node_modules/querystring-es3/index.js ***!
          \***********************************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            t.decode = t.parse = n( /*! ./decode */ "./node_modules/querystring-es3/decode.js"), t.encode = t.stringify = n( /*! ./encode */ "./node_modules/querystring-es3/encode.js")
        },
    "./node_modules/url/url.js":
        /*!*********************************!*\
          !*** ./node_modules/url/url.js ***!
          \*********************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            var i = n( /*! punycode */ "./node_modules/punycode/punycode.js"),
                s = n( /*! ./util */ "./node_modules/url/util.js");

            function a() {
                this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
            }
            t.parse = w, t.resolve = function (e, t) {
                return w(e, !1, !0).resolve(t)
            }, t.resolveObject = function (e, t) {
                return e ? w(e, !1, !0).resolveObject(t) : t
            }, t.format = function (e) {
                s.isString(e) && (e = w(e));
                return e instanceof a ? e.format() : a.prototype.format.call(e)
            }, t.Url = a;
            var r = /^([a-z0-9.+-]+:)/i,
                o = /:[0-9]*$/,
                l = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
                c = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]),
                h = ["'"].concat(c),
                u = ["%", "/", "?", ";", "#"].concat(h),
                d = ["/", "?", "#"],
                f = /^[+a-z0-9A-Z_-]{0,63}$/,
                p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
                m = {
                    javascript: !0,
                    "javascript:": !0
                },
                g = {
                    javascript: !0,
                    "javascript:": !0
                },
                y = {
                    http: !0,
                    https: !0,
                    ftp: !0,
                    gopher: !0,
                    file: !0,
                    "http:": !0,
                    "https:": !0,
                    "ftp:": !0,
                    "gopher:": !0,
                    "file:": !0
                },
                k = n( /*! querystring */ "./node_modules/querystring-es3/index.js");

            function w(e, t, n) {
                if (e && s.isObject(e) && e instanceof a) return e;
                var i = new a;
                return i.parse(e, t, n), i
            }
            a.prototype.parse = function (e, t, n) {
                if (!s.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
                var a = e.indexOf("?"),
                    o = -1 !== a && a < e.indexOf("#") ? "?" : "#",
                    c = e.split(o);
                c[0] = c[0].replace(/\\/g, "/");
                var w = e = c.join(o);
                if (w = w.trim(), !n && 1 === e.split("#").length) {
                    var b = l.exec(w);
                    if (b) return this.path = w, this.href = w, this.pathname = b[1], b[2] ? (this.search = b[2], this.query = t ? k.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this
                }
                var v = r.exec(w);
                if (v) {
                    var x = (v = v[0]).toLowerCase();
                    this.protocol = x, w = w.substr(v.length)
                }
                if (n || v || w.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var S = "//" === w.substr(0, 2);
                    !S || v && g[v] || (w = w.substr(2), this.slashes = !0)
                }
                if (!g[v] && (S || v && !y[v])) {
                    for (var I, T, M = -1, j = 0; j < d.length; j++) {
                        -1 !== (E = w.indexOf(d[j])) && (-1 === M || E < M) && (M = E)
                    } - 1 !== (T = -1 === M ? w.lastIndexOf("@") : w.lastIndexOf("@", M)) && (I = w.slice(0, T), w = w.slice(T + 1), this.auth = decodeURIComponent(I)), M = -1;
                    for (j = 0; j < u.length; j++) {
                        var E; - 1 !== (E = w.indexOf(u[j])) && (-1 === M || E < M) && (M = E)
                    } - 1 === M && (M = w.length), this.host = w.slice(0, M), w = w.slice(M), this.parseHost(), this.hostname = this.hostname || "";
                    var C = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                    if (!C)
                        for (var P = this.hostname.split(/\./), A = (j = 0, P.length); j < A; j++) {
                            var B = P[j];
                            if (B && !B.match(f)) {
                                for (var _ = "", R = 0, O = B.length; R < O; R++) B.charCodeAt(R) > 127 ? _ += "x" : _ += B[R];
                                if (!_.match(f)) {
                                    var D = P.slice(0, j),
                                        U = P.slice(j + 1),
                                        L = B.match(p);
                                    L && (D.push(L[1]), U.unshift(L[2])), U.length && (w = "/" + U.join(".") + w), this.hostname = D.join(".");
                                    break
                                }
                            }
                        }
                    this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), C || (this.hostname = i.toASCII(this.hostname));
                    var F = this.port ? ":" + this.port : "",
                        Y = this.hostname || "";
                    this.host = Y + F, this.href += this.host, C && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== w[0] && (w = "/" + w))
                }
                if (!m[x])
                    for (j = 0, A = h.length; j < A; j++) {
                        var z = h[j];
                        if (-1 !== w.indexOf(z)) {
                            var H = encodeURIComponent(z);
                            H === z && (H = escape(z)), w = w.split(z).join(H)
                        }
                    }
                var W = w.indexOf("#"); - 1 !== W && (this.hash = w.substr(W), w = w.slice(0, W));
                var V = w.indexOf("?");
                if (-1 !== V ? (this.search = w.substr(V), this.query = w.substr(V + 1), t && (this.query = k.parse(this.query)), w = w.slice(0, V)) : t && (this.search = "", this.query = {}), w && (this.pathname = w), y[x] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                    F = this.pathname || "";
                    var q = this.search || "";
                    this.path = F + q
                }
                return this.href = this.format(), this
            }, a.prototype.format = function () {
                var e = this.auth || "";
                e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@");
                var t = this.protocol || "",
                    n = this.pathname || "",
                    i = this.hash || "",
                    a = !1,
                    r = "";
                this.host ? a = e + this.host : this.hostname && (a = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (a += ":" + this.port)), this.query && s.isObject(this.query) && Object.keys(this.query).length && (r = k.stringify(this.query));
                var o = this.search || r && "?" + r || "";
                return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || y[t]) && !1 !== a ? (a = "//" + (a || ""), n && "/" !== n.charAt(0) && (n = "/" + n)) : a || (a = ""), i && "#" !== i.charAt(0) && (i = "#" + i), o && "?" !== o.charAt(0) && (o = "?" + o), t + a + (n = n.replace(/[?#]/g, (function (e) {
                    return encodeURIComponent(e)
                }))) + (o = o.replace("#", "%23")) + i
            }, a.prototype.resolve = function (e) {
                return this.resolveObject(w(e, !1, !0)).format()
            }, a.prototype.resolveObject = function (e) {
                if (s.isString(e)) {
                    var t = new a;
                    t.parse(e, !1, !0), e = t
                }
                for (var n = new a, i = Object.keys(this), r = 0; r < i.length; r++) {
                    var o = i[r];
                    n[o] = this[o]
                }
                if (n.hash = e.hash, "" === e.href) return n.href = n.format(), n;
                if (e.slashes && !e.protocol) {
                    for (var l = Object.keys(e), c = 0; c < l.length; c++) {
                        var h = l[c];
                        "protocol" !== h && (n[h] = e[h])
                    }
                    return y[n.protocol] && n.hostname && !n.pathname && (n.path = n.pathname = "/"), n.href = n.format(), n
                }
                if (e.protocol && e.protocol !== n.protocol) {
                    if (!y[e.protocol]) {
                        for (var u = Object.keys(e), d = 0; d < u.length; d++) {
                            var f = u[d];
                            n[f] = e[f]
                        }
                        return n.href = n.format(), n
                    }
                    if (n.protocol = e.protocol, e.host || g[e.protocol]) n.pathname = e.pathname;
                    else {
                        for (var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift()););
                        e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== p[0] && p.unshift(""), p.length < 2 && p.unshift(""), n.pathname = p.join("/")
                    }
                    if (n.search = e.search, n.query = e.query, n.host = e.host || "", n.auth = e.auth, n.hostname = e.hostname || e.host, n.port = e.port, n.pathname || n.search) {
                        var m = n.pathname || "",
                            k = n.search || "";
                        n.path = m + k
                    }
                    return n.slashes = n.slashes || e.slashes, n.href = n.format(), n
                }
                var w = n.pathname && "/" === n.pathname.charAt(0),
                    b = e.host || e.pathname && "/" === e.pathname.charAt(0),
                    v = b || w || n.host && e.pathname,
                    x = v,
                    S = n.pathname && n.pathname.split("/") || [],
                    I = (p = e.pathname && e.pathname.split("/") || [], n.protocol && !y[n.protocol]);
                if (I && (n.hostname = "", n.port = null, n.host && ("" === S[0] ? S[0] = n.host : S.unshift(n.host)), n.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)), e.host = null), v = v && ("" === p[0] || "" === S[0])), b) n.host = e.host || "" === e.host ? e.host : n.host, n.hostname = e.hostname || "" === e.hostname ? e.hostname : n.hostname, n.search = e.search, n.query = e.query, S = p;
                else if (p.length) S || (S = []), S.pop(), S = S.concat(p), n.search = e.search, n.query = e.query;
                else if (!s.isNullOrUndefined(e.search)) {
                    if (I) n.hostname = n.host = S.shift(), (C = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = C.shift(), n.host = n.hostname = C.shift());
                    return n.search = e.search, n.query = e.query, s.isNull(n.pathname) && s.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.href = n.format(), n
                }
                if (!S.length) return n.pathname = null, n.search ? n.path = "/" + n.search : n.path = null, n.href = n.format(), n;
                for (var T = S.slice(-1)[0], M = (n.host || e.host || S.length > 1) && ("." === T || ".." === T) || "" === T, j = 0, E = S.length; E >= 0; E--) "." === (T = S[E]) ? S.splice(E, 1) : ".." === T ? (S.splice(E, 1), j++) : j && (S.splice(E, 1), j--);
                if (!v && !x)
                    for (; j--; j) S.unshift("..");
                !v || "" === S[0] || S[0] && "/" === S[0].charAt(0) || S.unshift(""), M && "/" !== S.join("/").substr(-1) && S.push("");
                var C, P = "" === S[0] || S[0] && "/" === S[0].charAt(0);
                I && (n.hostname = n.host = P ? "" : S.length ? S.shift() : "", (C = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = C.shift(), n.host = n.hostname = C.shift()));
                return (v = v || n.host && S.length) && !P && S.unshift(""), S.length ? n.pathname = S.join("/") : (n.pathname = null, n.path = null), s.isNull(n.pathname) && s.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.auth = e.auth || n.auth, n.slashes = n.slashes || e.slashes, n.href = n.format(), n
            }, a.prototype.parseHost = function () {
                var e = this.host,
                    t = o.exec(e);
                t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e)
            }
        },
    "./node_modules/url/util.js":
        /*!**********************************!*\
          !*** ./node_modules/url/util.js ***!
          \**********************************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            e.exports = {
                isString: function (e) {
                    return "string" == typeof e
                },
                isObject: function (e) {
                    return "object" == typeof e && null !== e
                },
                isNull: function (e) {
                    return null === e
                },
                isNullOrUndefined: function (e) {
                    return null == e
                }
            }
        },
    "./node_modules/webpack/buildin/global.js":
        /*!***********************************!*\
          !*** (webpack)/buildin/global.js ***!
          \***********************************/
        /*! no static exports found */
        function (e, t) {
            var n;
            n = function () {
                return this
            }();
            try {
                n = n || new Function("return this")()
            } catch (e) {
                "object" == typeof window && (n = window)
            }
            e.exports = n
        },
    "./node_modules/webpack/buildin/module.js":
        /*!***********************************!*\
          !*** (webpack)/buildin/module.js ***!
          \***********************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = function (e) {
                return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
                    enumerable: !0,
                    get: function () {
                        return e.l
                    }
                }), Object.defineProperty(e, "id", {
                    enumerable: !0,
                    get: function () {
                        return e.i
                    }
                }), e.webpackPolyfill = 1), e
            }
        },
    "./src/js/app.js":
        /*!***********************!*\
          !*** ./src/js/app.js ***!
          \***********************/
        /*! no static exports found */
        function (e, t, n) {
            "use strict";
            window.loadedScript = !0;
            var i = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
            n( /*! ./libs/modernizr.js */ "./src/js/libs/modernizr.js");
            var s = n( /*! ./libs/io-client.js */ "./src/js/libs/io-client.js"),
                a = n( /*! ./libs/utils.js */ "./src/js/libs/utils.js"),
                r = n( /*! ./libs/animText.js */ "./src/js/libs/animText.js"),
                o = n( /*! ./config.js */ "./src/js/config.js"),
                l = n( /*! ./data/gameObject.js */ "./src/js/data/gameObject.js"),
                c = n( /*! ./data/items.js */ "./src/js/data/items.js"),
                h = (n( /*! ./data/mapManager.js */ "./src/js/data/mapManager.js"), n( /*! ./data/objectManager.js */ "./src/js/data/objectManager.js")),
                u = n( /*! ./data/player.js */ "./src/js/data/player.js"),
                d = n( /*! ./data/store.js */ "./src/js/data/store.js"),
                f = n( /*! ./data/projectile.js */ "./src/js/data/projectile.js"),
                p = n( /*! ./data/projectileManager.js */ "./src/js/data/projectileManager.js"),
                m = n( /*! ./libs/soundManager.js */ "./src/js/libs/soundManager.js").obj,
                g = new r.TextManager,
                y = new(n( /*! ../../vultr/VultrClient.js */ "./vultr/VultrClient.js"))("moomoo.io", 3e3, o.maxPlayers, 5, !1);
            y.debugLog = !1;
            var k = !1;

            function w() {
                ut && dt && (k = !0, i ? window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                    action: "homepage"
                }).then((function (e) {
                    b(e)
                })) : b(null))
            }

            function b(e) {
                y.start((function (t, n, r) {
                    var l = (i ? "wss" : "ws") + "://" + t + ":8008/?gameIndex=" + r;
                    e && (l += "&token=" + encodeURIComponent(e)), s.connect(l, (function (e) {
                        ia(), setInterval((() => ia()), 2500), e ? ft(e) : (!0, function () {
                            if (function () {
                                    ue.onclick = a.checkTrusted((function () {
                                        var e, t;
                                        e = ++wt > 1, t = Date.now() - kt > yt, e && t ? (kt = Date.now(), bt()) : Hn()
                                    })), a.hookTouchEvents(ue), de.onclick = a.checkTrusted((function () {
                                        oa("https://krunker.io/?play=SquidGame_KB")
                                    })), a.hookTouchEvents(de), pe.onclick = a.checkTrusted((function () {
                                        setTimeout((function () {
                                            var e, t;
                                            e = xe.value, (t = prompt("party key", e)) && (window.onbeforeunload = void 0, window.location.href = "/?server=" + t)
                                        }), 10)
                                    })), a.hookTouchEvents(pe), me.onclick = a.checkTrusted((function () {
                                        Ee.classList.contains("showing") ? (Ee.classList.remove("showing"), ge.innerText = "Settings") : (Ee.classList.add("showing"), ge.innerText = "Close")
                                    })), a.hookTouchEvents(me), ye.onclick = a.checkTrusted((function () {
                                        Pn(), "block" != Ve.style.display ? _t() : Ve.style.display = "none"
                                    })), a.hookTouchEvents(ye), ke.onclick = a.checkTrusted((function () {
                                        "block" != $e.style.display ? ($e.style.display = "block", Ve.style.display = "none", cn(), Gt()) : $e.style.display = "none"
                                    })), a.hookTouchEvents(ke), we.onclick = a.checkTrusted((function () {
                                        rn()
                                    })), a.hookTouchEvents(we), Xe.onclick = a.checkTrusted((function () {
                                        Fn()
                                    })), a.hookTouchEvents(Xe)
                                }(), function () {
                                    for (var e = 0; e < ei.length; ++e) {
                                        var t = new Image;
                                        t.onload = function () {
                                            this.isLoaded = !0
                                        }, t.src = "cross" == ei[e] ? "https://cdn.discordapp.com/attachments/1001384433078779927/1041105230374391878/crorrrrrrrrrshairlololol.png" : ".././img/icons/" + ei[e] + ".png", Zn[ei[e]] = t
                                    }
                                }(), Ce.style.display = "none", je.style.display = "block", As) M("moo_name");
                            else {
                                let e = ["w", "a", "s", "d"];
                                for (let t = 0; t < 8; t++) aa.push(e[Math.floor(Math.random() * e.length)]);
                                Le.value = aa.join("")
                            }! function () {
                                var e = M("native_resolution");
                                en(e ? "true" == e : "undefined" != typeof cordova);
                                E = "true" == M("show_ping"), Te.hidden = !E, M("moo_moosic") || 0, setInterval((function () {
                                    window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"))
                                }), 1e3), tn(), a.removeAllChildren(Ae);
                                for (var t = 0; t < c.weapons.length + c.list.length; ++t) ! function (e) {
                                    a.generateElement({
                                        id: "actionBarItem" + e,
                                        class: "actionBarItem",
                                        style: "display:none",
                                        onmouseout: function () {
                                            vt()
                                        },
                                        parent: Ae
                                    })
                                }(t);
                                for (t = 0; t < c.list.length + c.weapons.length; ++t) ! function (e) {
                                    var t = document.createElement("canvas");
                                    t.width = t.height = 66;
                                    var n = t.getContext("2d");
                                    if (n.translate(t.width / 2, t.height / 2), n.imageSmoothingEnabled = !1, n.webkitImageSmoothingEnabled = !1, n.mozImageSmoothingEnabled = !1, c.weapons[e]) {
                                        n.rotate(Math.PI / 4 + Math.PI);
                                        var i = new Image;
                                        vi[c.weapons[e].src] = i, i.onload = function () {
                                            this.isLoaded = !0;
                                            var i = 1 / (this.height / this.width),
                                                s = c.weapons[e].iPad || 1;
                                            n.drawImage(this, -t.width * s * o.iconPad * i / 2, -t.height * s * o.iconPad / 2, t.width * s * i * o.iconPad, t.height * s * o.iconPad), n.fillStyle = "rgba(0, 0, 70, 0.1)", n.globalCompositeOperation = "source-atop", n.fillRect(-t.width / 2, -t.height / 2, t.width, t.height), document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")"
                                        }, i.src = ".././img/weapons/" + c.weapons[e].src + ".png", (s = document.getElementById("actionBarItem" + e)).onmouseover = a.checkTrusted((function () {
                                            vt(c.weapons[e], !0)
                                        })), s.onclick = a.checkTrusted((function () {
                                            zn(e, !0)
                                        })), a.hookTouchEvents(s)
                                    } else {
                                        i = Mi(c.list[e - c.weapons.length], !0);
                                        var s, r = Math.min(t.width - o.iconPadding, i.width);
                                        n.globalAlpha = 1, n.drawImage(i, -r / 2, -r / 2, r, r), n.fillStyle = "rgba(0, 0, 70, 0.1)", n.globalCompositeOperation = "source-atop", n.fillRect(-r / 2, -r / 2, r, r), document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")", (s = document.getElementById("actionBarItem" + e)).onmouseover = a.checkTrusted((function () {
                                            vt(c.list[e - c.weapons.length])
                                        })), s.onclick = a.checkTrusted((function () {
                                            zn(e - c.weapons.length)
                                        })), a.hookTouchEvents(s)
                                    }
                                }(t);
                                Le.ontouchstart = a.checkTrusted((function (e) {
                                    e.preventDefault();
                                    var t = prompt("enter name", e.currentTarget.value);
                                    e.currentTarget.value = t.slice(0, 15)
                                })), Se.checked = j, Se.onchange = a.checkTrusted((function (e) {
                                    en(e.target.checked)
                                })), Ie.checked = E, Ie.onchange = a.checkTrusted((function (e) {
                                    E = Ie.checked, Te.hidden = !E, T("show_ping", E ? "true" : "false")
                                })), ohio.play()
                            }()
                        }())
                    }), {
                        id: rt,
                        d: ft,
                        1: Vn,
                        2: _s,
                        4: Us,
                        33: Ns,
                        5: si,
                        6: Di,
                        a: qi,
                        aa: Vi,
                        7: di,
                        8: Ui,
                        sp: Li,
                        9: Fs,
                        h: Hs,
                        11: Xn,
                        12: $n,
                        13: Gn,
                        14: Ls,
                        15: ii,
                        16: ni,
                        17: Zt,
                        18: Fi,
                        19: Wi,
                        20: sa,
                        ac: Ct,
                        ad: Bt,
                        an: jt,
                        st: Pt,
                        sa: At,
                        us: Xt,
                        ch: yn,
                        mm: qt,
                        t: qn,
                        p: Vt,
                        pp: na
                    }), mt(), setTimeout((() => gt()), 3e3)
                }), (function (e) {
                    console.error("Vultr error:", e), alert("Error:\n" + e), ft("disconnected")
                }))
            }
            var v = new m(o, a);
            var x, S = Math.PI,
                I = 2 * S;

            function T(e, t) {
                x && localStorage.setItem(e, t)
            }

            function M(e) {
                return x ? localStorage.getItem(e) : null
            }
            Math.lerpAngle = function (e, t, n) {
                Math.abs(t - e) > S && (e > t ? t += I : e += I);
                var i = t + (e - t) * n;
                return i >= 0 && i <= I ? i : i % I
            }, CanvasRenderingContext2D.prototype.roundRect = function (e, t, n, i, s) {
                return n < 2 * s && (s = n / 2), i < 2 * s && (s = i / 2), s < 0 && (s = 0), this.beginPath(), this.moveTo(e + s, t), this.arcTo(e + n, t, e + n, t + i, s), this.arcTo(e + n, t + i, e, t + i, s), this.arcTo(e, t + i, e, t, s), this.arcTo(e, t, e + n, t, s), this.closePath(), this
            }, "undefined" != typeof Storage && (x = !0);
            var j, E, C = !0;
            var P, A, B, _, R, O, D, U, L, F, Y, z, H = 1,
                W = Date.now(),
                V = [],
                q = [],
                N = [],
                X = [],
                G = [],
                J = new p(f, G, q, V, nt, c, o, a),
                K = n( /*! ./data/aiManager.js */ "./src/js/data/aiManager.js"),
                Q = n( /*! ./data/ai.js */ "./src/js/data/ai.js"),
                Z = new K(V, Q, q, c, null, o, a),
                ee = 1,
                te = 0,
                ne = 0,
                ie = 0,
                se = {
                    id: -1,
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0
                },
                ae = {
                    id: -1,
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0
                },
                re = 0,
                oe = o.maxScreenWidth,
                le = o.maxScreenHeight,
                ce = !1,
                he = (document.getElementById("ad-container"), document.getElementById("mainMenu")),
                ue = document.getElementById("enterGame"),
                de = document.getElementById("promoImg"),
                fe = document.getElementById("partyButton"),
                pe = document.getElementById("joinPartyButton"),
                me = document.getElementById("settingsButton"),
                ge = me.getElementsByTagName("span")[0],
                ye = document.getElementById("allianceButton"),
                ke = document.getElementById("storeButton"),
                we = document.getElementById("chatButton"),
                be = document.getElementById("gameCanvas"),
                ve = be.getContext("2d"),
                xe = document.getElementById("serverBrowser"),
                Se = document.getElementById("nativeResolution"),
                Ie = document.getElementById("showPing"),
                Te = (document.getElementById("playMusic"), document.getElementById("pingDisplay")),
                Me = document.getElementById("shutdownDisplay"),
                je = document.getElementById("menuCardHolder"),
                Ee = document.getElementById("guideCard"),
                Ce = document.getElementById("loadingText"),
                Pe = document.getElementById("gameUI"),
                Ae = document.getElementById("actionBar"),
                Be = document.getElementById("scoreDisplay"),
                _e = document.getElementById("foodDisplay"),
                Re = document.getElementById("woodDisplay"),
                Oe = document.getElementById("stoneDisplay"),
                De = document.getElementById("killCounter"),
                Ue = document.getElementById("leaderboardData"),
                Le = document.getElementById("nameInput"),
                Fe = document.getElementById("itemInfoHolder"),
                Ye = document.getElementById("ageText"),
                ze = document.getElementById("ageBarBody"),
                He = document.getElementById("upgradeHolder"),
                We = document.getElementById("upgradeCounter"),
                Ve = document.getElementById("allianceMenu"),
                qe = document.getElementById("allianceHolder"),
                Ne = document.getElementById("allianceManager"),
                Xe = document.getElementById("mapDisplay"),
                Ge = document.getElementById("diedText"),
                Je = document.getElementById("skinColorHolder"),
                Ke = Xe.getContext("2d");
            Xe.width = 300, Xe.height = 300;
            var $e = document.getElementById("storeMenu"),
                Qe = document.getElementById("storeHolder"),
                Ze = document.getElementById("noticationDisplay"),
                et = d.hats,
                tt = d.accessories,
                nt = new h(l, X, a, o),
                it = "#525252",
                st = "#3d3f42",
                at = 5.5;

            function rt(e) {
                N = e.teams
            }
            var ot = document.getElementById("featuredYoutube"),
                lt = [{
                    name: "Corrupt X",
                    link: "https://www.youtube.com/channel/UC0UH2LfQvBSeH24bmtbmITw"
                }, {
                    name: "Tweak Big",
                    link: "https://www.youtube.com/channel/UCbwvzJ38AndDTkoX8sD9YOw"
                }, {
                    name: "Arena Closer",
                    link: "https://www.youtube.com/channel/UCazucVSJqW-kiHMIhQhD-QQ"
                }, {
                    name: "Godenot",
                    link: "https://www.youtube.com/user/SirGodenot"
                }, {
                    name: "RajNoobTV",
                    link: "https://www.youtube.com/channel/UCVLo9brXBWrCttMaGzvm0-Q"
                }, {
                    name: "TomNotTom",
                    link: "https://www.youtube.com/channel/UC7z97RgHFJRcv2niXgArBDw"
                }, {
                    name: "Nation",
                    link: "https://www.youtube.com/channel/UCSl-MBn3qzjrIvLNESQRk-g"
                }, {
                    name: "Pidyohago",
                    link: "https://www.youtube.com/channel/UC04p8Mg8nDaDx04A9is2B8Q"
                }, {
                    name: "Enigma",
                    link: "https://www.youtube.com/channel/UC5HhLbs3sReHo8Bb9NDdFrg"
                }, {
                    name: "Bauer",
                    link: "https://www.youtube.com/channel/UCwU2TbJx3xTSlPqg-Ix3R1g"
                }, {
                    name: "iStealth",
                    link: "https://www.youtube.com/channel/UCGrvlEOsQFViZbyFDE6t69A"
                }, {
                    name: "SICKmania",
                    link: "https://www.youtube.com/channel/UCvVI98ezn4TpX5wDMZjMa3g"
                }, {
                    name: "LightThief",
                    link: "https://www.youtube.com/channel/UCj6C_tiDeATiKd3GX127XoQ"
                }, {
                    name: "Fortish",
                    link: "https://www.youtube.com/channel/UCou6CLU-szZA3Tb340TB9_Q"
                }, {
                    name: "巧克力",
                    link: "https://www.youtube.com/channel/UCgL6J6oL8F69vm-GcPScmwg"
                }, {
                    name: "i Febag",
                    link: "https://www.youtube.com/channel/UCiU6WZwiKbsnt5xmwr0OFbg"
                }, {
                    name: "GoneGaming",
                    link: "https://www.youtube.com/channel/UCOcQthRanYcwYY0XVyVeK0g"
                }],
                ct = lt[a.randInt(0, lt.length - 1)];
            ot.innerHTML = "<a target='_blank' class='ytLink' href='" + ct.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + ct.name + "</a>";
            var ht = !0,
                ut = !1,
                dt = !1;

            function ft(e) {
                !1, s.close(), pt(e)
            }

            function pt(e) {
                he.style.display = "block", Pe.style.display = "none", je.style.display = "none", Ge.style.display = "none", Ce.style.display = "block", Ce.innerHTML = e + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>"
            }
            window.onblur = function () {
                ht = !1
            }, window.onfocus = function () {
                ht = !0, R && R.alive && Pn()
            }, window.onload = function () {
                ut = !0, w(), setTimeout((function () {
                    k || window.location.reload()
                }), 2e4)
            }, window.captchaCallback = function () {
                dt = !0, w()
            }, be.oncontextmenu = function () {
                return !1
            };

            function mt() {
                var e, t, n = "",
                    i = 0;
                for (var s in y.servers) {
                    for (var a = y.servers[s], r = 0, l = 0; l < a.length; l++)
                        for (var c = 0; c < a[l].games.length; c++) r += a[l].games[c].playerCount;
                    i += r;
                    var h = y.regionInfo[s].name;
                    n += "<option disabled>" + h + " - " + r + " players</option>";
                    for (var u = 0; u < a.length; u++)
                        for (var d = a[u], f = 0; f < d.games.length; f++) {
                            var p = d.games[f],
                                m = 1 * d.index + f + 1,
                                g = y.server && y.server.region === d.region && y.server.index === d.index && y.gameIndex == f,
                                k = h + " " + m + " [" + Math.min(p.playerCount, o.maxPlayers) + "/" + o.maxPlayers + "]";
                            let e = y.stripRegion(s) + ":" + u + ":" + f;
                            g && (fe.getElementsByTagName("span")[0].innerText = e), n += "<option value='" + e + "' " + (g ? "selected" : "") + ">" + k + "</option>"
                        }
                    n += "<option disabled></option>"
                }
                n += "<option disabled>All Servers - " + i + " players</option>", xe.innerHTML = n, "sandbox.moomoo.io" == location.hostname ? (e = "Back to MooMoo", t = "//moomoo.io/") : (e = "Try the sandbox", t = "//sandbox.moomoo.io/"), document.getElementById("altServer").innerHTML = "<a href='" + t + "'>" + e + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>"
            }

            function gt() {
                var e = new XMLHttpRequest;
                e.onreadystatechange = function () {
                    4 == this.readyState && (200 == this.status ? (window.vultr = JSON.parse(this.responseText), y.processServers(vultr.servers), mt()) : console.error("Failed to load server data with status code:", this.status))
                }, e.open("GET", "/serverData", !0), e.send()
            }
            xe.addEventListener("change", a.checkTrusted((function () {
                let e = xe.value.split(":");
                y.switchServer(e[0], e[1], e[2])
            })));
            document.getElementById("pre-content-container");
            var yt = 3e5,
                kt = 0,
                wt = 0;

            function bt() {
                if (!window.adsbygoogle) return console.log("Failed to load video ad API");
                window.adsbygoogle.push({
                    type: "next",
                    adBreakDone: () => {
                        Hn()
                    }
                })
            }

            function vt(e, t, n) {
                if (R && e)
                    if (a.removeAllChildren(Fe), Fe.classList.add("visible"), a.generateElement({
                            id: "itemInfoName",
                            text: a.capitalizeFirst(e.name),
                            parent: Fe
                        }), a.generateElement({
                            id: "itemInfoDesc",
                            text: e.desc,
                            parent: Fe
                        }), n);
                    else if (t) a.generateElement({
                    class: "itemInfoReq",
                    text: e.type ? "secondary" : "primary",
                    parent: Fe
                });
                else {
                    for (var i = 0; i < e.req.length; i += 2) a.generateElement({
                        class: "itemInfoReq",
                        html: e.req[i] + "<span class='itemInfoReqVal'> x" + e.req[i + 1] + "</span>",
                        parent: Fe
                    });
                    e.group.limit && a.generateElement({
                        class: "itemInfoLmt",
                        text: (R.itemCounts[e.group.id] || 0) + "/" + e.group.limit,
                        parent: Fe
                    })
                } else Fe.classList.remove("visible")
            }
            window.adsbygoogle && adsbygoogle.push({
                preloadAdBreaks: "on"
            }), window.showPreAd = bt;
            var xt, St, It, Tt = [],
                Mt = [];

            function jt(e, t) {
                Tt.push({
                    sid: e,
                    name: t
                }), Et()
            }

            function Et() {
                if (Tt[0]) {
                    var e = Tt[0];
                    a.removeAllChildren(Ze), Ze.style.display = "block", a.generateElement({
                        class: "notificationText",
                        text: e.name,
                        parent: Ze
                    }), a.generateElement({
                        class: "notifButton",
                        html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                        parent: Ze,
                        onclick: function () {
                            Rt(0)
                        },
                        hookTouch: !0
                    }), a.generateElement({
                        class: "notifButton",
                        html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                        parent: Ze,
                        onclick: function () {
                            Rt(1)
                        },
                        hookTouch: !0
                    })
                } else Ze.style.display = "none"
            }

            function Ct(e) {
                N.push(e), "block" == Ve.style.display && _t()
            }

            function Pt(e, t) {
                R && (R.team = e, R.isOwner = t, "block" == Ve.style.display && _t())
            }

            function At(e) {
                Mt = e, "block" == Ve.style.display && _t()
            }

            function Bt(e) {
                for (var t = N.length - 1; t >= 0; t--) N[t].sid == e && N.splice(t, 1);
                "block" == Ve.style.display && _t()
            }

            function _t() {
                if (R && R.alive) {
                    if (cn(), $e.style.display = "none", Ve.style.display = "block", a.removeAllChildren(qe), R.team)
                        for (var e = 0; e < Mt.length; e += 2) ! function (e) {
                            var t = a.generateElement({
                                class: "allianceItem",
                                style: "color:" + (Mt[e] == R.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: Mt[e + 1],
                                parent: qe
                            });
                            R.isOwner && Mt[e] != R.sid && a.generateElement({
                                class: "joinAlBtn",
                                text: "Kick",
                                onclick: function () {
                                    Ot(Mt[e])
                                },
                                hookTouch: !0,
                                parent: t
                            })
                        }(e);
                    else if (N.length)
                        for (e = 0; e < N.length; ++e) ! function (e) {
                            var t = a.generateElement({
                                class: "allianceItem",
                                style: "color:" + (N[e].sid == R.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: N[e].sid,
                                parent: qe
                            });
                            a.generateElement({
                                class: "joinAlBtn",
                                text: "Join",
                                onclick: function () {
                                    Dt(e)
                                },
                                hookTouch: !0,
                                parent: t
                            })
                        }(e);
                    else a.generateElement({
                        class: "allianceItem",
                        text: "No Tribes Yet",
                        parent: qe
                    });
                    a.removeAllChildren(Ne), R.team ? a.generateElement({
                        class: "allianceButtonM",
                        style: "width: 360px",
                        text: R.isOwner ? "Delete Tribe" : "Leave Tribe",
                        onclick: function () {
                            Lt()
                        },
                        hookTouch: !0,
                        parent: Ne
                    }) : (a.generateElement({
                        tag: "input",
                        type: "text",
                        id: "allianceInput",
                        maxLength: 7,
                        placeholder: "unique name",
                        ontouchstart: function (e) {
                            e.preventDefault();
                            var t = prompt("unique name", e.currentTarget.value);
                            e.currentTarget.value = t.slice(0, 7)
                        },
                        parent: Ne
                    }), a.generateElement({
                        tag: "div",
                        class: "allianceButtonM",
                        style: "width: 140px;",
                        text: "Create",
                        onclick: function () {
                            Ut()
                        },
                        hookTouch: !0,
                        parent: Ne
                    }))
                }
            }

            function Rt(e) {
                s.send("11", Tt[0].sid, e), Tt.splice(0, 1), Et()
            }

            function Ot(e) {
                s.send("12", e)
            }

            function Dt(e) {
                s.send("10", N[e].sid), myConfig.clan = N[e].sid, botConfig.botJoin = !0
            }

            function Ut() {
                s.send("8", document.getElementById("allianceInput").value), myConfig.clan = document.getElementById("allianceInput").value, botConfig.botJoin = !0
            }

            function Lt() {
                Tt = [], Et(), s.send("9")
            }
            var Ft, Yt, zt = [],
                Ht = [];

            function Wt() {
                this.init = function (e, t) {
                    this.scale = 0, this.x = e, this.y = t, this.active = !0
                }, this.update = function (e, t) {
                    this.active && (this.scale += .05 * t, this.scale >= o.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - Math.max(0, this.scale / o.mapPingScale), e.beginPath(), e.arc(this.x / o.mapScale * Xe.width, this.y / o.mapScale * Xe.width, this.scale, 0, 2 * Math.PI), e.stroke()))
                }
            }

            function Vt(e, t) {
                for (var n = 0; n < zt.length; ++n)
                    if (!zt[n].active) {
                        Ft = zt[n];
                        break
                    } Ft || (Ft = new Wt, zt.push(Ft)), Ft.init(e, t)
            }

            function qt(e) {
                St = e
            }
            var Nt = 0;

            function Xt(e, t, n) {
                n ? e ? R.tailIndex = t : R.tails[t] = 1 : e ? R.skinIndex = t : R.skins[t] = 1, "block" == $e.style.display && Gt()
            }

            function Gt() {
                if (R) {
                    a.removeAllChildren(Qe);
                    for (var e = Nt, t = e ? tt : et, n = 0; n < t.length; ++n) t[n].dontSell || function (n) {
                        var i = a.generateElement({
                            id: "storeDisplay" + n,
                            class: "storeItem",
                            onmouseout: function () {
                                vt()
                            },
                            onmouseover: function () {
                                vt(t[n], !1, !0)
                            },
                            parent: Qe
                        });
                        a.hookTouchEvents(i, !0), a.generateElement({
                            tag: "img",
                            class: "hatPreview",
                            src: "../img/" + (e ? "accessories/access_" : "hats/hat_") + t[n].id + (t[n].topSprite ? "_p" : "") + ".png",
                            parent: i
                        }), a.generateElement({
                            tag: "span",
                            text: t[n].name,
                            parent: i
                        }), (e ? R.tails[t[n].id] : R.skins[t[n].id]) ? (e ? R.tailIndex : R.skinIndex) == t[n].id ? a.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Unequip",
                            onclick: function () {
                                Jt(0, e)
                            },
                            hookTouch: !0,
                            parent: i
                        }) : a.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Equip",
                            onclick: function () {
                                Jt(t[n].id, e)
                            },
                            hookTouch: !0,
                            parent: i
                        }) : (a.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Buy",
                            onclick: function () {
                                Kt(t[n].id, e)
                            },
                            hookTouch: !0,
                            parent: i
                        }), a.generateElement({
                            tag: "span",
                            class: "itemPrice",
                            text: t[n].price,
                            parent: i
                        }))
                    }(n)
                }
            }

            function Jt(e, t) {
                R.alive && (0 == t ? s.send("13c", 0, e, 0) : 1 == t && s.send("13c", 0, e, 1))
            }

            function Kt(e, t) {
                s.send("13c", 1, e, t)
            }

            function $t(e, t, n) {
                R.alive && (0 == t ? R.skins[e] ? n ? R.skinIndex != e && s.send("13c", 0, e, 0) : s.send("13c", 0, e, 0) : (n ? 0 != R.skinIndex && s.send("13c", 0, 0, 0) : s.send("13c", 0, 0, 0), s.send("13c", 1, e, 0)) : 1 == t && (R.tails[e] ? n ? R.tailIndex != e && s.send("13c", 0, e, 1) : s.send("13c", 0, e, 1) : (n ? 0 != R.tailIndex && s.send("13c", 0, 0, 1) : s.send("13c", 0, 0, 1), s.send("13c", 1, e, 1))))
            }

            function Qt() {
                $e.style.display = "none", Ve.style.display = "none", cn()
            }

            function Zt(e, t) {
                e && (t ? R.weapons = e : R.items = e);
                for (var n = 0; n < c.list.length; ++n) {
                    var i = c.weapons.length + n;
                    document.getElementById("actionBarItem" + i).style.display = (As ? R.items : [0, 3, 6, 10]).indexOf(c.list[n].id) >= 0 ? "inline-block" : "none"
                }
                for (n = 0; n < c.weapons.length; ++n) document.getElementById("actionBarItem" + n).style.display = R.weapons[c.weapons[n].type] == c.weapons[n].id ? "inline-block" : "none"
            }

            function en(e) {
                j = e, H = e ? window.devicePixelRatio || 1 : window.devicePixelRatio2, Se.checked = e, T("native_resolution", e.toString()), kn()
            }

            function tn() {
                for (var e = "", t = 0; t < o.skinColors.length; ++t) e += t == re ? "<div class='skinColorItem activeSkin' style='background-color:" + o.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : "<div class='skinColorItem' style='background-color:" + o.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
                Je.innerHTML = e
            }
            var nn = document.getElementById("chatBox"),
                sn = document.getElementById("chatHolder"),
                an = 0;

            function rn() {
                pn ? setTimeout((function () {
                    var e = prompt("chat message");
                    e && ln(e)
                }), 1) : an ? (nn.value && ln(nn.value), cn()) : (an = 1, $e.style.display = "none", Ve.style.display = "none", sn.style.display = "block", As ? (sn.style.opacity = "1", nn.autocomplete = "on") : (sn.style.opacity = "0", nn.autocomplete = "off"), nn.focus(), Pn()), nn.value = ""
            }
            let on = !0;

            function ln(e) {
                let t = function (t) {
                    return e == "!!" + t
                };
                if (t("grind")) Jn = !Jn;
                else if (t("replace")) Kn = !Kn;
                else if (t("autospin")) Tn = !Tn;
                else if (t("visual")) {
                    As = !As, ze.style.width = (As ? R.XP / R.maxXP * 100 : 0) + "%";
                    for (var n = 0; n < c.list.length; ++n) {
                        var i = c.weapons.length + n;
                        document.getElementById("actionBarItem" + i).style.display = (As ? R.items : [0, 3, 6, 10]).indexOf(c.list[n].id) >= 0 ? "inline-block" : "none"
                    }
                    $("#pingDisplay").toggle()
                } else if (t("pfm")) on = !on;
                else if (t("ch1")) fn("1");
                else if (t("ch2")) fn("2");
                else if (t("ch3")) fn("3");
                else if (t("showch")) dn = !dn;
                else if (t("profany")) mn = !mn;
                else if (t("move")) botConfig.stop = !botConfig.stop;
                else if (t("atck")) botConfig.atck = !botConfig.atck;
                else if (t("getsid"))
                    for (let e = 0; e < q.length; ++e) hn(q[e], q[e].name + ", " + q[e].sid, o.chatCountdown);
                else {
                    let t = e;
                    s.send("ch", t.slice(0, 30))
                }
            }

            function cn() {
                an = 0, nn.value = "", sn.style.display = "none"
            }

            function hn(e, t, n) {
                e.iChatMessage = t, e.iChatCountdown = n
            }
            let un = !1,
                dn = !1;

            function fn(e) {
                un = !un;
                let t = [{
                        say: "Children used to run and play",
                        time: 15725
                    }, {
                        say: "Look at all this mess we made",
                        time: 18600
                    }, {
                        say: "Guess i never know",
                        time: 21500
                    }, {
                        say: "It went wrong",
                        time: 23e3
                    }, {
                        say: "Sometimes i feel like all",
                        time: 27500
                    }, {
                        say: "That's said",
                        time: 28500
                    }, {
                        say: "Goes viral then people forget",
                        time: 30500
                    }, {
                        say: "In this crazy world",
                        time: 33500
                    }, {
                        say: "I don't belong",
                        time: 34800
                    }, {
                        say: "I see fire burning",
                        time: 39e3
                    }, {
                        say: "But i close my eyes",
                        time: 41e3
                    }, {
                        say: "(I'd rather deny that)",
                        time: 43300
                    }, {
                        say: "Everything is falling",
                        time: 45e3
                    }, {
                        say: "Out of place",
                        time: 46700
                    }, {
                        say: "I see trees ripped",
                        time: 5e4
                    }, {
                        say: "From the ground but",
                        time: 52200
                    }, {
                        say: "Nobody makes a sound",
                        time: 54050
                    }, {
                        say: "I see fire burning",
                        time: 57e3
                    }, {
                        say: "But i'm fine",
                        time: 59e3
                    }, {
                        say: "Now i am nobody",
                        time: 61e3
                    }, {
                        say: "Now i am nobody",
                        time: 73e3
                    }, {
                        say: "The future feels so unsure",
                        time: 99500
                    }, {
                        say: "Didin't we deserve more",
                        time: 102600
                    }, {
                        say: "The burden that you left",
                        time: 105500
                    }, {
                        say: "Is too heavy for me",
                        time: 106900
                    }, {
                        say: "Do you ever feel like",
                        time: 111300
                    }, {
                        say: "The world will die out",
                        time: 113e3
                    }, {
                        say: "My anxiety's off",
                        time: 114400
                    }, {
                        say: "The roof i cry out",
                        time: 115800
                    }, {
                        say: "We have gone too far",
                        time: 117400
                    }, {
                        say: "Take me back right now",
                        time: 118800
                    }, {
                        say: "I see fire burning",
                        time: 123e3
                    }, {
                        say: "But i close my eyes",
                        time: 125e3
                    }, {
                        say: "(I'd rather deny that)",
                        time: 127300
                    }, {
                        say: "Everything is falling",
                        time: 129e3
                    }, {
                        say: "Out of place",
                        time: 131e3
                    }, {
                        say: "I see trees ripped",
                        time: 134e3
                    }, {
                        say: "From the ground but",
                        time: 135500
                    }, {
                        say: "Nobody makes a sound",
                        time: 138e3
                    }, {
                        say: "I see fire burning",
                        time: 141e3
                    }, {
                        say: "But i'm fine",
                        time: 143e3
                    }, {
                        say: "Now i am nobody",
                        time: 145e3
                    }, {
                        say: "Now i am nobody",
                        time: 169e3
                    }],
                    n = "1" == e ? t : "2" == e ? [{
                        say: "I'm burning",
                        time: 39800
                    }, {
                        say: "Wanna fell your power",
                        time: 41300
                    }, {
                        say: "Right into my veins",
                        time: 43e3
                    }, {
                        say: "Come, racer",
                        time: 46300
                    }, {
                        say: "Cross the fire",
                        time: 47800
                    }, {
                        say: "Pushing on the gas",
                        time: 49e3
                    }, {
                        say: "So come on",
                        time: 52600
                    }, {
                        say: "So come on,",
                        time: 53900
                    }, {
                        say: "The drift is on my mind!",
                        time: 55700
                    }, {
                        say: "AE eighity Speedy 86",
                        time: 58600
                    }, {
                        say: "Every road is on fire!",
                        time: 62e3
                    }, {
                        say: "'Cause i can't stop driving",
                        time: 64e3
                    }, {
                        say: "With my 86",
                        time: 66700
                    }, {
                        say: "Anybody will be around me",
                        time: 68200
                    }, {
                        say: "AE eighity Speedy 86",
                        time: 71200
                    }, {
                        say: "See my speed is getting higher",
                        time: 74900
                    }, {
                        say: "'Cause i can't stop driving",
                        time: 77e3
                    }, {
                        say: "Go go 86",
                        time: 79400
                    }, {
                        say: "Anybody will be around me",
                        time: 81e3
                    }, {
                        say: "Your body",
                        time: 97300
                    }, {
                        say: "Burning like a flame",
                        time: 98800
                    }, {
                        say: "Engine will be fly",
                        time: 100300
                    }, {
                        say: "My racer",
                        time: 103750
                    }, {
                        say: "Can you hear me?",
                        time: 105300
                    }, {
                        say: "Listen to me now!",
                        time: 106750
                    }, {
                        say: "So come on",
                        time: 11e4
                    }, {
                        say: "So come on,",
                        time: 111700
                    }, {
                        say: "The drift is on my mind!",
                        time: 113e3
                    }, {
                        say: "AE eighity Speedy 86",
                        time: 116e3
                    }, {
                        say: "Every road is fire!",
                        time: 119750
                    }, {
                        say: "'Cause i can't stop driving",
                        time: 121750
                    }, {
                        say: "With my 86",
                        time: 124150
                    }, {
                        say: "Anybody will be around me",
                        time: 126e3
                    }, {
                        say: "AE eighity Speedy 86",
                        time: 129e3
                    }, {
                        say: "See my speed is getting higher",
                        time: 132250
                    }, {
                        say: "'Cause i can't stop driving",
                        time: 134750
                    }, {
                        say: "Go go 86",
                        time: 137e3
                    }, {
                        say: "Anybody will be around me",
                        time: 138750
                    }, {
                        say: "So come on",
                        time: 219e3
                    }, {
                        say: "So come on,",
                        time: 220500
                    }, {
                        say: "The drift is on my mind!",
                        time: 222e3
                    }, {
                        say: "AE eighity go go 86",
                        time: 225e3
                    }, {
                        say: "Every road is fire!",
                        time: 228500
                    }, {
                        say: "'Cause i can't stop driving",
                        time: 230750
                    }, {
                        say: "With my 86",
                        time: 233e3
                    }, {
                        say: "Anybody will be around me",
                        time: 234750
                    }, {
                        say: "AE eighity Speedy 86",
                        time: 237750
                    }, {
                        say: "See my speed is getting higher",
                        time: 241200
                    }, {
                        say: "'Cause i can't stop driving",
                        time: 243500
                    }, {
                        say: "Go go 86",
                        time: 245900
                    }, {
                        say: "Anybody will be around me",
                        time: 247500
                    }] : "3" == e ? [{
                        say: "Oh oh ooooh",
                        time: 2500
                    }, {
                        say: "Oh we begin",
                        time: 4750
                    }, {
                        say: "We'll be together",
                        time: 15500
                    }, {
                        say: "till the morning light",
                        time: 16750
                    }, {
                        say: "Don't stand so",
                        time: 18750
                    }, {
                        say: "don't stand so",
                        time: 20500
                    }, {
                        say: "Don't stand so close to me",
                        time: 22e3
                    }, {
                        say: "Baby you belong to me",
                        time: 37e3
                    }, {
                        say: "Yes you do, yes you do",
                        time: 4e4
                    }, {
                        say: "You're my affection",
                        time: 41750
                    }, {
                        say: "I can make a woman cry",
                        time: 43e3
                    }, {
                        say: "Yes I do, yes I do",
                        time: 46250
                    }, {
                        say: "I well be good",
                        time: 47750
                    }, {
                        say: "You're like a cruel device",
                        time: 49750
                    }, {
                        say: "Your blood is cold like ice",
                        time: 51e3
                    }, {
                        say: "Poison for my veins,",
                        time: 52500
                    }, {
                        say: "I'm breaking my chains",
                        time: 54e3
                    }, {
                        say: "One look and you can kill",
                        time: 55750
                    }, {
                        say: "my pain now is your thrill",
                        time: 57250
                    }, {
                        say: "Your love is for me",
                        time: 58750
                    }, {
                        say: "I say",
                        time: 61e3
                    }, {
                        say: "Try me",
                        time: 61750
                    }, {
                        say: "take a chance on emotions",
                        time: 62750
                    }, {
                        say: "For now and ever",
                        time: 64750
                    }, {
                        say: "close to your heart",
                        time: 66e3
                    }, {
                        say: "I say",
                        time: 67e3
                    }, {
                        say: "Try me",
                        time: 67750
                    }, {
                        say: "take a chance on my passion",
                        time: 68750
                    }, {
                        say: "We'll be together all the time",
                        time: 71e3
                    }, {
                        say: "I say",
                        time: 73250
                    }, {
                        say: "Try me",
                        time: 74e3
                    }, {
                        say: "take a chance on emotions",
                        time: 75e3
                    }, {
                        say: "For now and ever",
                        time: 77e3
                    }, {
                        say: "into my heart",
                        time: 78500
                    }, {
                        say: "I say",
                        time: 79250
                    }, {
                        say: "Try me",
                        time: 8e4
                    }, {
                        say: "take a chance on my passion",
                        time: 81e3
                    }, {
                        say: "We'll be together",
                        time: 83250
                    }, {
                        say: "till the morning light",
                        time: 84500
                    }, {
                        say: "Don't stand so",
                        time: 86750
                    }, {
                        say: "don't stand so",
                        time: 88e3
                    }, {
                        say: "Don't stand so close to me",
                        time: 89500
                    }, {
                        say: "Baby let me take control",
                        time: 104750
                    }, {
                        say: "Yes I do, yes I do",
                        time: 107750
                    }, {
                        say: "You are my target",
                        time: 109250
                    }, {
                        say: "No one ever made me cry",
                        time: 111e3
                    }, {
                        say: "What you do, what you do",
                        time: 114e3
                    }, {
                        say: "Baby's so bad",
                        time: 115500
                    }, {
                        say: "You're like a cruel device",
                        time: 117250
                    }, {
                        say: "Your blood is cold like ice",
                        time: 118500
                    }, {
                        say: "Poison for my veins,",
                        time: 120250
                    }, {
                        say: "I'm breaking my chains",
                        time: 121750
                    }, {
                        say: "One look and you can kill",
                        time: 123e3
                    }, {
                        say: "my pain now is your thrill",
                        time: 124750
                    }, {
                        say: "Your love is for me",
                        time: 126500
                    }, {
                        say: "I say",
                        time: 128500
                    }, {
                        say: "Try me",
                        time: 129250
                    }, {
                        say: "take a chance on emotions",
                        time: 130250
                    }, {
                        say: "For now and ever",
                        time: 132750
                    }, {
                        say: "close to your heart",
                        time: 133750
                    }, {
                        say: "I say",
                        time: 134750
                    }, {
                        say: "Try me",
                        time: 135500
                    }, {
                        say: "take a chance on my passion",
                        time: 136500
                    }, {
                        say: "We'll be together all the time",
                        time: 138750
                    }, {
                        say: "I say",
                        time: 141e3
                    }, {
                        say: "Try me",
                        time: 141750
                    }, {
                        say: "take a chance on emotions",
                        time: 142750
                    }, {
                        say: "For now and ever",
                        time: 145e3
                    }, {
                        say: "into my heart",
                        time: 146e3
                    }, {
                        say: "I say",
                        time: 147e3
                    }, {
                        say: "Try me",
                        time: 147750
                    }, {
                        say: "take a chance on my passion",
                        time: 148750
                    }, {
                        say: "We'll be together",
                        time: 151e3
                    }, {
                        say: "till the morning light",
                        time: 152250
                    }, {
                        say: "Don't stand so",
                        time: 154250
                    }, {
                        say: "don't stand so",
                        time: 155750
                    }, {
                        say: "Don't stand so close to me",
                        time: 157e3
                    }, {
                        say: "I say",
                        time: 184e3
                    }, {
                        say: "Try me",
                        time: 184750
                    }, {
                        say: "take a chance on emotions",
                        time: 185500
                    }, {
                        say: "For now and ever",
                        time: 188e3
                    }, {
                        say: "close to your heart",
                        time: 189e3
                    }, {
                        say: "I say",
                        time: 19e4
                    }, {
                        say: "Try me",
                        time: 190750
                    }, {
                        say: "take a chance on my passion",
                        time: 192750
                    }, {
                        say: "We'll be together all the time",
                        time: 194e3
                    }, {
                        say: "I say",
                        time: 196250
                    }, {
                        say: "Try me",
                        time: 197e3
                    }, {
                        say: "take a chance on emotions",
                        time: 198e3
                    }, {
                        say: "For now and ever",
                        time: 200250
                    }, {
                        say: "into my heart",
                        time: 201250
                    }, {
                        say: "I say",
                        time: 202500
                    }, {
                        say: "Try me",
                        time: 203250
                    }, {
                        say: "take a chance on my passion",
                        time: 204e3
                    }, {
                        say: "We'll be together",
                        time: 206500
                    }, {
                        say: "till the morning light",
                        time: 207500
                    }, {
                        say: "Don't stand so",
                        time: 209750
                    }, {
                        say: "don't stand so",
                        time: 211250
                    }, {
                        say: "Don't stand so close to me",
                        time: 212750
                    }] : t;
                n.length;
                n.forEach((e => {
                    setTimeout((() => {
                        dn ? (ln(e.say)) : (R.iChatMessage = e.say, R.iChatCountdown = o.chatCountdown), consoleSinger && console.log(e.say)
                    }), e.time)
                }))
            }
            window.consoleSinger = !1;
            var pn, mn = !1,
                gn = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];

            function yn(e, t) {
                var n = $s(e);
                n && (n.chatMessage = function (e) {
                    if ("what mod" == e && s.send("ch", "sam mod v69"), !mn)
                        for (var t, n = 0; n < gn.length; ++n)
                            if (e.indexOf(gn[n]) > -1) {
                                t = "";
                                for (var i = 0; i < gn[n].length; ++i) t += t.length ? "o" : "M";
                                var a = new RegExp(gn[n], "g");
                                e = e.replace(a, t)
                            } return e
                }(t), n.chatCountdown = o.chatCountdown)
            }

            function kn() {
                Y = window.innerWidth, z = window.innerHeight;
                var e = Math.max(Y / oe, z / le) * H;
                be.width = Y * H, be.height = z * H, be.style.width = Y + "px", be.style.height = z + "px", ve.setTransform(e, 0, 0, e, (Y * H - oe * e) / 2, (z * H - le * e) / 2)
            }

            function wn(e) {
                (pn = e) ? Ee.classList.add("touch"): Ee.classList.remove("touch")
            }

            function bn(e) {
                e.preventDefault(), e.stopPropagation(), wn(!0);
                for (var t = 0; t < e.changedTouches.length; t++) {
                    var n = e.changedTouches[t];
                    n.identifier == se.id ? (se.id = -1, Ln()) : n.identifier == ae.id && (ae.id = -1, R.buildIndex >= 0 && (_ = 1, Dn()), _ = 0, Dn())
                }
            }
            window.addEventListener("resize", a.checkTrusted(kn)), kn(), wn(!1), window.setUsingTouch = wn, be.addEventListener("touchmove", a.checkTrusted((function (e) {
                e.preventDefault(), e.stopPropagation(), wn(!0);
                for (var t = 0; t < e.changedTouches.length; t++) {
                    var n = e.changedTouches[t];
                    n.identifier == se.id ? (se.currentX = n.pageX, se.currentY = n.pageY, Ln()) : n.identifier == ae.id && (ae.currentX = n.pageX, ae.currentY = n.pageY, _ = 1)
                }
            })), !1), be.addEventListener("touchstart", a.checkTrusted((function (e) {
                e.preventDefault(), e.stopPropagation(), wn(!0);
                for (var t = 0; t < e.changedTouches.length; t++) {
                    var n = e.changedTouches[t];
                    n.pageX < document.body.scrollWidth / 2 && -1 == se.id ? (se.id = n.identifier, se.startX = se.currentX = n.pageX, se.startY = se.currentY = n.pageY, Ln()) : n.pageX > document.body.scrollWidth / 2 && -1 == ae.id && (ae.id = n.identifier, ae.startX = ae.currentX = n.pageX, ae.startY = ae.currentY = n.pageY, R.buildIndex < 0 && (_ = 1, Dn()))
                }
            })), !1), be.addEventListener("touchend", a.checkTrusted(bn), !1), be.addEventListener("touchcancel", a.checkTrusted(bn), !1), be.addEventListener("touchleave", a.checkTrusted(bn), !1), be.addEventListener("mousemove", (function (e) {
                e.preventDefault(), e.stopPropagation(), wn(!1), ne = e.clientX, ie = e.clientY
            }), !1), be.addEventListener("mousedown", (function (e) {
                wn(!1), 1 != _ && (_ = 1, os = !0, 0 == e.button ? (ls = !0, vn = !0) : 1 == e.button ? (hs = !0, us = !0) : 2 == e.button && (cs = !0))
            }), !1);
            let vn = !1,
                xn = !1;
            var Sn;
            be.addEventListener("mouseup", (function (e) {
                wn(!1), 0 != _ && (_ = 0, 0 == e.button ? (ls = !1, xn = !0) : 1 == e.button ? hs = !1 : 2 == e.button && (cs = !1), ls || hs || cs || (os = !1))
            }), !1), be.addEventListener("wheel", (function (e) {
                e.deltaY < 0
            }), !1);
            var In = null,
                Tn = !1;

            function Mn() {
                return R ? as && !Qi ? rs : Qi ? ks : !Tn || 15 != R.weaponIndex || vs.canInsta || $i || as ? (-1 != ae.id ? Sn = Math.atan2(ae.currentY - ae.startY, ae.currentX - ae.startX) : R.lockDir || pn || (Sn = Math.atan2(ie - z / 2, ne - Y / 2)), a.fixTo(Sn || 0, 2)) : Math.random() * (2 * Math.PI) : 0
            }

            function jn() {
                return R ? (-1 != ae.id ? Sn = Math.atan2(ae.currentY - ae.startY, ae.currentX - ae.startX) : R.lockDir || pn || (Sn = Math.atan2(ie - z / 2, ne - Y / 2)), a.fixTo(Sn || 0, 2)) : 0
            }
            var En = {},
                Cn = {
                    87: [0, -1],
                    38: [0, -1],
                    83: [0, 1],
                    40: [0, 1],
                    65: [-1, 0],
                    37: [-1, 0],
                    68: [1, 0],
                    39: [1, 0]
                };

            function Pn() {
                En = {}, s.send("rmd")
            }

            function An() {
                return "block" != Ve.style.display && !an
            }
            var Bn = !1,
                _n = !1,
                Rn = !1,
                On = !1;

            function Dn() {
                R && R.alive && s.send("c", _, R.buildIndex >= 0 ? Mn() : null)
            }
            window.addEventListener("keydown", a.checkTrusted((function (e) {
                var t = e.which || e.keyCode || 0;
                if (27 == t) Qt();
                else if (R && R.alive && An() && !En[t])
                    if (En[t] = 1, 69 == t) Yn();
                    else if (67 == t) It || (It = {}), It.x = R.x, It.y = R.y;
                else if (77 == t) is = !is;
                else if (88 == t) R.lockDir = R.lockDir ? 0 : 1, s.send("7", 0);
                else if (null != R.weapons[t - 49]) Ji = R.weapons[t - 49], zn(R.weapons[t - 49], !0);
                else if (null != R.items[t - 49 - R.weapons.length]) zn(R.items[t - 49 - R.weapons.length]);
                else if (82 == t) Fn();
                else if (84 == t) Ms = !Ms, Jt(0, 1);
                else if (Cn[t]) Ln();
                else if (32 == t) _ = 1, Dn();
                else if (75 == t) $t(7, 0);
                else if (90 == t) $t(40, 0);
                else if (76 == t) ss = !ss, Ys(), as ? Jt(0, 1) : $t(11, 1);
                else if ("q" == e.key) Bn = !0;
                else if ("f" == e.key) _n = !0;
                else if ("v" == e.key) Rn = !0;
                else if ("h" == e.key) On = !0;
                else if ("B" == e.key) Ps = !Ps;
                else if ("Shift" == e.key) Ys(), as ? Jt(0, 1) : $t(11, 1);
                else if ("G" == e.key) {
                    let e = [];
                    for (let t = 0; t < bot; t++) e.push(window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                        action: "homepage"
                    }));
                    Promise.all(e).then((t => {
                        for (let n = 0; n < bot; n++) bConnect(t[n], n, e);
                        bot = 4
                    }))
                } else "g" == e.key && (Es = !Es, Jt(0, 1))
            }))), window.addEventListener("keyup", a.checkTrusted((function (e) {
                if (R && R.alive) {
                    var t = e.which || e.keyCode || 0;
                    13 == t ? rn() : An() && En[t] && (En[t] = 0, Cn[t] ? Ln() : 32 == t ? (_ = 0, Dn()) : "q" == e.key ? Bn = !1 : "f" == e.key ? _n = !1 : "v" == e.key ? Rn = !1 : "h" == e.key && (On = !1))
                }
            })));
            var Un = void 0;

            function Ln() {
                var e = js ? Bs : function () {
                    var e = 0,
                        t = 0;
                    if (-1 != se.id) e += se.currentX - se.startX, t += se.currentY - se.startY;
                    else
                        for (var n in Cn) {
                            var i = Cn[n];
                            e += !!En[n] * i[0], t += !!En[n] * i[1]
                        }
                    return 0 == e && 0 == t ? void 0 : a.fixTo(Math.atan2(t, e), 2)
                }();
                (null == Un || null == e || Math.abs(e - Un) > .3) && (js || s.send("33", e), Un = e, e)
            }

            function Fn() {
                s.send("14", 1), Ki = !Ki
            }

            function Yn() {
                s.send("7", 1)
            }

            function zn(e, t) {
                s.send("5", e, t)
            }

            function Hn() {
                if (T("moo_name", Le.value), !ce && s.connected) {
                    Ji = 0, ce = !0, v.stop("menu"), ohio.pause(), ohio.currentTime = 0, pt("Loading..."), s.send("sp", {
                        name: As ? Le.value : urName,
                        moofoll: C,
                        skin: re
                    });
                    let e = document.getElementById("ot-sdk-btn-floating");
                    e && (e.style.display = "none")
                }
            }
            var Wn = !0;

            function Vn(e) {
                Ce.style.display = "none", je.style.display = "block", he.style.display = "none", En = {}, O = e, _ = 0, ce = !0, Wn && (Wn = !1, X.length = 0)
            }

            function qn(e, t, n, i) {
                g.showText(e, t, 50, .18, As ? 1e3 : 500, Math.abs(n), n >= 0 ? "#fff" : "#8ecc51")
            }
            var Nn = 99999;

            function Xn() {
                ce = !1;
                try {
                    factorem.refreshAds([2], !0)
                } catch (e) {}
                Pe.style.display = "none", Qt(), xt = {
                    x: R.x,
                    y: R.y
                }, Ce.style.display = "none", Ge.style.display = "block", Ge.style.fontSize = "0px", Nn = 0, setTimeout((function () {
                    je.style.display = "block", he.style.display = "block", ohio.play(), Ge.style.display = "none"
                }), o.deathFadeout), gt()
            }

            function Gn(e) {
                R && nt.removeAllItems(e)
            }
            var Jn = !1,
                Kn = !0;

            function $n(e) {
                ns.sid == e && (ns = {
                    sid: void 0,
                    hitCount: 0
                }, $t(cs ? 0 : 11, 1));
                let t = Zs(e);
                if (Jn) Rs(t, R) <= 111 && (Vs(5, jn() - Ws(45)), Vs(5, jn() + Ws(45)), s.send("2", jn()));
                else if (Rs(t, R) < 500 && Kn && ms.length)
                    if (Os(ms, R) <= 300)
                        for (let e = -90; e < 180; e += 90) R.items[2] && Vs(2, ks + Ws(e));
                    else if (Os(ms, R) > 300 && Os(ms, R) < 500)
                    for (let e = 0; e < 2 * Math.PI; e += Math.PI / 2) R.items[4] && 15 == R.items[4] && Vs(4, ks + e);
                Rs(t, R) > 1200 && As && function (e, t) {
                    for (var n = 0; n < Ht.length; ++n)
                        if (!Ht[n].active) {
                            Yt = Ht[n];
                            break
                        } Yt || (Yt = new Wt, Ht.push(Yt)), Yt.init(e, t)
                }(t.x, t.y), nt.disableBySid(e)
            }

            function Qn() {
                Be.innerText = R.points, _e.innerText = R.food, Re.innerText = R.wood, Oe.innerText = R.stone, R.kills > De.innerText && goofy.play(), De.innerText = R.kills
            }
            var Zn = {},
                ei = ["crown", "skull", "cross"];
            var ti = [];

            function ni(e, t) {
                if (R.upgradePoints = e, R.upgrAge = t, e > 0) {
                    ti.length = 0, a.removeAllChildren(He);
                    for (var n = 0; n < c.weapons.length; ++n) {
                        if (c.weapons[n].age == t && (null == c.weapons[n].pre || R.weapons.indexOf(c.weapons[n].pre) >= 0)) a.generateElement({
                            id: "upgradeItem" + n,
                            class: "actionBarItem",
                            onmouseout: function () {
                                vt()
                            },
                            parent: He
                        }).style.backgroundImage = document.getElementById("actionBarItem" + n).style.backgroundImage, ti.push(n)
                    }
                    for (n = 0; n < c.list.length; ++n)
                        if (c.list[n].age == t && (null == c.list[n].pre || R.items.indexOf(c.list[n].pre) >= 0)) {
                            var i = c.weapons.length + n;
                            a.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function () {
                                    vt()
                                },
                                parent: He
                            }).style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage, ti.push(i)
                        } for (n = 0; n < ti.length; n++) ! function (e) {
                        var t = document.getElementById("upgradeItem" + e);
                        t.onmouseover = function () {
                            c.weapons[e] ? vt(c.weapons[e], !0) : vt(c.list[e - c.weapons.length])
                        }, t.onclick = a.checkTrusted((function () {
                            e >= 0 && e <= 15 && (Ji = e), s.send("6", e)
                        })), a.hookTouchEvents(t)
                    }(ti[n]);
                    ti.length ? (He.style.display = "block", We.style.display = "block", We.innerHTML = "SELECT ITEMS (" + e + ")") : (He.style.display = "none", We.style.display = "none", vt())
                } else He.style.display = "none", We.style.display = "none", vt()
            }

            function ii(e, t, n) {
                null != e && (R.XP = e), null != t && (R.maxXP = t), null != n && (R.age = n), n == o.maxAge ? (Ye.innerHTML = "MAX AGE", ze.style.width = "100%") : (Ye.innerHTML = "AGE " + R.age, ze.style.width = (As ? R.XP / R.maxXP * 100 : 0) + "%")
            }

            function si(e) {
                a.removeAllChildren(Ue);
                for (var t = 1, n = 0; n < e.length; n += 3) ! function (n) {
                    a.generateElement({
                        class: "leaderHolder",
                        parent: Ue,
                        children: [a.generateElement({
                            class: "leaderboardItem",
                            style: "color:" + (e[n] == O ? "#00FF00" : "rgba(255,255,255,0.6)"),
                            text: t + ". " + ("" != e[n + 1] ? e[n + 1] : "unknown")
                        }), a.generateElement({
                            class: "leaderScore",
                            text: a.kFormat(e[n + 2]) || "0"
                        })]
                    })
                }(n), t++
            }

            function ai() {
                if (R && (!B || A - B >= 1e3 / o.clientSendRate)) {
                    B = A;
                    let e = Mn();
                    In !== e && (In = e, s.send("2", e))
                }
                if (Nn < 120 && (Nn += .1 * P, Ge.style.fontSize = Math.min(Math.round(Nn), 120) + "px"), R) {
                    var e = a.getDistance(U, L, R.x, R.y),
                        t = a.getDirection(R.x, R.y, U, L),
                        n = Math.min(.01 * e * P, e);
                    e > .05 ? (U += n * Math.cos(t), L += n * Math.sin(t)) : (U = R.x, L = R.y)
                } else U = o.mapScale / 2, L = o.mapScale / 2;
                for (var i = A - 1e3 / o.serverUpdateRate, r = 0; r < q.length + V.length; ++r)
                    if ((D = q[r] || V[r - q.length]) && D.visible)
                        if (D.forcePos) D.x = D.x2, D.y = D.y2, D.dir = D.d2;
                        else {
                            var l = D.t2 - D.t1,
                                c = (i - D.t1) / l;
                            D.dt += P;
                            var h = Math.min(1.7, D.dt / 170),
                                u = D.x2 - D.x1;
                            D.x = D.x1 + u * h, u = D.y2 - D.y1, D.y = D.y1 + u * h, D.dir = Math.lerpAngle(D.d2, D.d1, Math.min(1.2, c))
                        } var d = U - oe / 2,
                    f = L - le / 2;
                if (o.snowBiomeTop - f <= 0 && o.mapScale - o.snowBiomeTop - f >= le ? (ve.fillStyle = "#b6db66", ve.fillRect(0, 0, oe, le)) : o.mapScale - o.snowBiomeTop - f <= 0 ? (ve.fillStyle = "#dbc666", ve.fillRect(0, 0, oe, le)) : o.snowBiomeTop - f >= le ? (ve.fillStyle = "#fff", ve.fillRect(0, 0, oe, le)) : o.snowBiomeTop - f >= 0 ? (ve.fillStyle = "#fff", ve.fillRect(0, 0, oe, o.snowBiomeTop - f), ve.fillStyle = "#b6db66", ve.fillRect(0, o.snowBiomeTop - f, oe, le - (o.snowBiomeTop - f))) : (ve.fillStyle = "#b6db66", ve.fillRect(0, 0, oe, o.mapScale - o.snowBiomeTop - f), ve.fillStyle = "#dbc666", ve.fillRect(0, o.mapScale - o.snowBiomeTop - f, oe, le - (o.mapScale - o.snowBiomeTop - f))), Wn || ((ee += te * o.waveSpeed * P) >= o.waveMax ? (ee = o.waveMax, te = -1) : ee <= 1 && (ee = te = 1), ve.globalAlpha = 1, ve.fillStyle = "#dbc666", hi(d, f, ve, o.riverPadding), ve.fillStyle = "#91b2db", hi(d, f, ve, 250 * (ee - 1))), ve.lineWidth = 4, ve.strokeStyle = "#000", ve.globalAlpha = on ? 0 : .06, ve.beginPath(), !on) {
                    for (var p = -U; p < oe; p += le / 18) p > 0 && (ve.moveTo(p, 0), ve.lineTo(p, le));
                    for (var m = -L; m < le; m += le / 18) m > 0 && (ve.moveTo(0, m), ve.lineTo(oe, m))
                }
                ve.stroke(), ve.globalAlpha = 1, ve.strokeStyle = it, ui(-1, d, f), ve.globalAlpha = 1, ve.lineWidth = at, oi(0, d, f), fi(d, f, 0), ve.globalAlpha = 1;
                for (r = 0; r < V.length; ++r)(D = V[r]).active && D.visible && (D.animate(P), ve.save(), ve.translate(D.x - d, D.y - f), ve.rotate(D.dir + D.dirPlus - Math.PI / 2), Xi(D, ve), ve.restore());
                if (ui(0, d, f), oi(1, d, f), ui(1, d, f), fi(d, f, 1), ui(2, d, f), ui(3, d, f), ve.fillStyle = "#000", ve.globalAlpha = .09, d <= 0 && ve.fillRect(0, 0, -d, le), o.mapScale - d <= oe) {
                    var y = Math.max(0, -f);
                    ve.fillRect(o.mapScale - d, y, oe - (o.mapScale - d), le - y)
                }
                if (f <= 0 && ve.fillRect(-d, 0, oe + d, -f), o.mapScale - f <= le) {
                    var k = Math.max(0, -d),
                        w = 0;
                    o.mapScale - d <= oe && (w = oe - (o.mapScale - d)), ve.fillRect(k, o.mapScale - f, oe - k - w, le - (o.mapScale - f))
                }
                ve.globalAlpha = 1, ve.fillStyle = "rgba(0, 0, 70, 0.35)", ve.fillRect(0, 0, oe, le), ve.strokeStyle = st;
                for (r = 0; r < q.length + V.length; ++r)
                    if ((D = q[r] || V[r - q.length]).visible && (10 != D.skinIndex || D == R || D.team && D.team == R.team)) {
                        var b = (D.team ? "[" + D.team + "] " : "") + (D.name || "");
                        if ("" != b) {
                            if (ve.font = (D.nameScale || 30) + "px Hammersmith One", ve.fillStyle = "#fff", ve.textBaseline = "middle", ve.textAlign = "center", ve.lineWidth = D.nameScale ? 11 : 8, ve.lineJoin = "round", ve.strokeText(b, D.x - d, D.y - f - D.scale - o.nameY), ve.fillText(b, D.x - d, D.y - f - D.scale - o.nameY), D.isLeader && Zn.crown.isLoaded) {
                                var v = o.crownIconScale;
                                k = D.x - d - v / 2 - ve.measureText(b).width / 2 - o.crownPad;
                                ve.drawImage(Zn.crown, k, D.y - f - D.scale - o.nameY - v / 2 - 5, v, v)
                            }
                            if (1 == D.iconIndex && Zn.skull.isLoaded) {
                                v = o.crownIconScale, k = D.x - d - v / 2 + ve.measureText(b).width / 2 + o.crownPad;
                                ve.drawImage(Zn.skull, k, D.y - f - D.scale - o.nameY - v / 2 - 5, v, v)
                            }
                            if (D.sid === ms[0] && Ki && Zn.cross.isLoaded && ms.length && As) {
                                v = 2 * o.playerScale;
                                ve.drawImage(Zn.cross, D.x - d - v + o.playerScale, D.y - f - o.playerScale, v, v)
                            }
                        }
                        if ((!D.isPlayer || D == R || D.team && D.team == R.team || As ? D.health : D.isHitted) > 0) {
                            o.healthBarWidth;
                            ve.fillStyle = st, ve.roundRect(D.x - d - o.healthBarWidth - o.healthBarPad, D.y - f + D.scale + o.nameY, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), ve.fill(), ve.fillStyle = D == R || D.team && D.team == R.team ? "#509908" : "#FF0000", ve.roundRect(D.x - d - o.healthBarWidth, D.y - f + D.scale + o.nameY + o.healthBarPad, 2 * o.healthBarWidth * (D.health / D.maxHealth), 17 - 2 * o.healthBarPad, 7), ve.fill()
                        }
                        if (D.isPlayer && As) {
                            ve.font = (D.nameScale || 30) + "px Hammersmith One", ve.fillStyle = D.shameCount2 < D.dangerCount ? "#FF0000" : "#FF0000", ve.textBaseline = "middle", ve.textAlign = "center", ve.lineWidth = D.nameScale ? 11 : 8, ve.lineJoin = "round";
                            v = o.crownIconScale, k = D.x - d - v / 2 + ve.measureText(b).width / 2 + o.crownPad + (1 == D.iconIndex ? 2.5 * (D.nameScale || 30) : D.nameScale || 30);
                            ve.strokeText(D.shameCount2, k, D.y - f - D.scale - o.nameY), ve.fillText(D.shameCount2, k, D.y - f - D.scale - o.nameY);
                            o.healthBarWidth;
                            ve.fillStyle = st, ve.roundRect(D.x - d - o.healthBarWidth - o.healthBarPad + 50, D.y - f + D.scale + o.nameY - 13, o.healthBarWidth + 2 * o.healthBarPad, 17, 8), ve.fill(), ve.fillStyle = 1 == D.sR && (D == R || D.team && D.team == R.team) ? "#FFFF00" : "#FF0000", ve.roundRect(D.x - d - o.healthBarWidth + 50, D.y - f + D.scale + o.nameY - 13 + o.healthBarPad, o.healthBarWidth * D.sR, 17 - 2 * o.healthBarPad, 7), ve.fill();
                            o.healthBarWidth;
                            if (ve.fillStyle = st, ve.roundRect(D.x - d - o.healthBarWidth - o.healthBarPad, D.y - f + D.scale + o.nameY - 13, o.healthBarWidth + 2 * o.healthBarPad, 17, 8), ve.fill(), ve.fillStyle = 1 == D.pR && (D == R || D.team && D.team == R.team) ? "#FFFF00" : "#0000FF", ve.roundRect(D.x - d - o.healthBarWidth, D.y - f + D.scale + o.nameY - 13 + o.healthBarPad, o.healthBarWidth * D.pR, 17 - 2 * o.healthBarPad, 7), ve.fill(), D == R) {
                                if (ve.font = "20px Hammersmith One", ve.fillStyle = "#fff", ve.textBaseline = "middle", ve.textAlign = "center", ve.lineWidth = D.nameScale ? 11 : 8, ve.lineJoin = "round", ve.strokeText("[" + Ki + "]", D.x - d, D.y - f + D.scale + o.nameY + 40.5), ve.fillText("[" + Ki + "]", D.x - d, D.y - f + D.scale + o.nameY + 40.5), D.tR < 1) {
                                    o.healthBarWidth;
                                    ve.fillStyle = st, ve.roundRect(D.x - d - o.healthBarWidth - o.healthBarPad, D.y - f + D.scale + o.nameY + 13, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), ve.fill(), ve.fillStyle = "#a5974c", ve.roundRect(D.x - d - o.healthBarWidth, D.y - f + D.scale + o.nameY + 13 + o.healthBarPad, 2 * o.healthBarWidth * D.tR, 17 - 2 * o.healthBarPad, 7), ve.fill()
                                }
                            } else if (ve.font = "20px Hammersmith One", ve.fillStyle = "#fff", ve.textBaseline = "middle", ve.textAlign = "center", ve.lineWidth = D.nameScale ? 11 : 8, ve.lineJoin = "round", ve.strokeText("[" + xs[D.sid] + "/" + Is[D.sid] + "]", D.x - d, D.y - f + D.scale + o.nameY + 27), ve.fillText("[" + xs[D.sid] + "/" + Is[D.sid] + "]", D.x - d, D.y - f + D.scale + o.nameY + 27), !(D == R || D.team && D.team == R.team)) {
                                let e = function (e, t) {
                                        return Math.hypot(e.y1 - t.y1, e.x1 - t.x1)
                                    },
                                    t = function (e, t) {
                                        return Math.atan2(e.y1 - t.y1, e.x1 - t.x1)
                                    },
                                    n = Math.floor(e(D, R)),
                                    i = function (e) {
                                        return n / e
                                    };
                                ve.save(), ve.translate(R.x1 + i(2) * Math.cos(t(D, R)) - d, R.y1 + i(2) * Math.sin(t(D, R)) - f), ve.rotate(t(D, R) + Math.PI / 2), ve.fillStyle = "hsl(" + i(14) + ", 100%, 50%)", ve.globalAlpha = i(1440) > 1 ? 1 : i(1440), Ri(o.playerScale, ve), ve.restore()
                            }
                        }
                    } g.update(P, ve, d, f);
                for (r = 0; r < q.length; ++r) {
                    if ((D = q[r]).visible && D.chatCountdown > 0) {
                        D.chatCountdown -= P, D.chatCountdown <= 0 && (D.chatCountdown = 0), ve.font = "32px Hammersmith One";
                        var x = ve.measureText(D.chatMessage);
                        ve.textBaseline = "middle", ve.textAlign = "center";
                        k = D.x - d, y = D.y - D.scale - f - 90;
                        var S = 47,
                            I = x.width + 17;
                        ve.fillStyle = "rgba(0,0,0,0.2)", ve.roundRect(k - I / 2, y - S / 2, I, S, 6), ve.fill(), ve.fillStyle = "#fff", ve.fillText(D.chatMessage, k, y)
                    }
                    if (D.visible && D.iChatCountdown > 0) {
                        D.iChatCountdown -= P, D.iChatCountdown <= 0 && (D.iChatCountdown = 0), ve.font = "32px Hammersmith One";
                        x = ve.measureText(D.iChatMessage);
                        ve.textBaseline = "middle", ve.textAlign = "center";
                        k = D.x - d, y = D.y - D.scale - f + 180, S = 47, I = x.width + 17;
                        ve.fillStyle = "rgba(0,0,0,0.2)", ve.roundRect(k - I / 2, y - S / 2, I, S, 6), ve.fill(), ve.fillStyle = "rgba(255,255,255,0.6)", ve.fillText(D.iChatMessage, k, y)
                    }
                }! function (e) {
                    if (R && R.alive) {
                        Ke.clearRect(0, 0, Xe.width, Xe.height), Ke.strokeStyle = "#fff", Ke.lineWidth = 4;
                        for (var t = 0; t < zt.length; ++t)(Ft = zt[t]).update(Ke, e);
                        for (Ke.strokeStyle = "#cc5151", Ke.lineWidth = 4, t = 0; t < Ht.length; ++t)(Yt = Ht[t]).update(Ke, e);
                        if (Ke.globalAlpha = 1, Ke.fillStyle = "#fff", Pi(R.x / o.mapScale * Xe.width, R.y / o.mapScale * Xe.height, 7, Ke, !0), Ke.fillStyle = "rgba(255,255,255,0.35)", R.team && St)
                            for (t = 0; t < St.length;) Pi(St[t] / o.mapScale * Xe.width, St[t + 1] / o.mapScale * Xe.height, 7, Ke, !0), t += 2;
                        xt && (Ke.fillStyle = "#fc5553", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center", Ke.fillText("x", xt.x / o.mapScale * Xe.width, xt.y / o.mapScale * Xe.height)), It && (Ke.fillStyle = "#fff", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center", Ke.fillText("x", It.x / o.mapScale * Xe.width, It.y / o.mapScale * Xe.height))
                    }
                }(P), -1 !== se.id && ri(se.startX, se.startY, se.currentX, se.currentY), -1 !== ae.id && ri(ae.startX, ae.startY, ae.currentX, ae.currentY)
            }

            function ri(e, t, n, i) {
                ve.save(), ve.setTransform(1, 0, 0, 1, 0, 0), ve.scale(H, H);
                var s = 50;
                ve.beginPath(), ve.arc(e, t, s, 0, 2 * Math.PI, !1), ve.closePath(), ve.fillStyle = "rgba(255, 255, 255, 0.3)", ve.fill();
                s = 50;
                var a = n - e,
                    r = i - t,
                    o = Math.sqrt(Math.pow(a, 2) + Math.pow(r, 2)),
                    l = o > s ? o / s : 1;
                a /= l, r /= l, ve.beginPath(), ve.arc(e + a, t + r, .5 * s, 0, 2 * Math.PI, !1), ve.closePath(), ve.fillStyle = "white", ve.fill(), ve.restore()
            }

            function oi(e, t, n) {
                for (var i = 0; i < G.length; ++i)(D = G[i]).active && D.layer == e && (D.update(P), D.active && Gi(D.x - t, D.y - n, D.scale) && (ve.save(), ve.translate(D.x - t, D.y - n), ve.rotate(D.dir), ci(0, 0, D, ve, 1), ve.restore()))
            }
            var li = {};

            function ci(e, t, n, i, s) {
                if (n.src) {
                    var a = c.projectiles[n.indx].src,
                        r = li[a];
                    r || ((r = new Image).onload = function () {
                        this.isLoaded = !0
                    }, r.src = ".././img/weapons/" + a + ".png", li[a] = r), r.isLoaded && i.drawImage(r, e - n.scale / 2, t - n.scale / 2, n.scale, n.scale)
                } else 1 == n.indx && (i.fillStyle = "#939393", Pi(e, t, n.scale, i))
            }

            function hi(e, t, n, i) {
                var s = o.riverWidth + i,
                    a = o.mapScale / 2 - t - s / 2;
                a < le && a + s > 0 && n.fillRect(0, a, oe, s)
            }

            function ui(e, t, n) {
                for (var i, s, a, r = 0; r < X.length; ++r)(D = X[r]).active && (s = D.x + D.xWiggle - t, a = D.y + D.yWiggle - n, 0 == e && D.update(P), D.layer == e && Gi(s, a, D.scale + (D.blocker || 0)) && (ve.globalAlpha = D.hideFromEnemy ? .6 : 1, D.isItem ? (i = Ei(D, !1), ve.save(), ve.translate(s, a), ve.rotate(As ? D.dir : 0), ve.drawImage(i, -i.width / 2, -i.height / 2), D.blocker && (ve.strokeStyle = "#db6e6e", ve.globalAlpha = .3, ve.lineWidth = 6, Pi(0, 0, D.blocker, ve, !1, !0)), ve.restore()) : (i = Ii(D), ve.drawImage(i, s - i.width / 2, a - i.height / 2))))
            }

            function di(e, t, n) {
                (D = $s(e)) && (D.startAnim(t, n), n < 9 ? (D.pR = -1e3 / o.serverUpdateRate / c.weapons[n].speed, D.pCd = c.weapons[n].count) : n > 8 && (D.sR = -1e3 / o.serverUpdateRate / c.weapons[n].speed, D.sCd = c.weapons[n].count), D == R && as && 10 == R.weapons[1] && R.skins[40] && ns.hitCount++)
            }

            function fi(e, t, n) {
                ve.globalAlpha = 1;
                for (var i = 0; i < q.length; ++i)(D = q[i]).zIndex == n && (D.animate(P), D.visible && (D.skinRot += .002 * P, F = (D == R && As ? jn() : D.dir) + D.dirPlus, ve.save(), ve.translate(D.x - e, D.y - t), ve.rotate(F), pi(D, ve), ve.restore()))
            }

            function pi(e, t) {
                (t = t || ve).lineWidth = at, t.lineJoin = "miter";
                var n = Math.PI / 4 * (c.weapons[e.weaponIndex].armS || 1),
                    i = e.buildIndex < 0 && c.weapons[e.weaponIndex].hndS || 1,
                    s = e.buildIndex < 0 && c.weapons[e.weaponIndex].hndD || 1;
                if (e.tailIndex > 0 && function (e, t, n) {
                        if (!(mi = wi[e])) {
                            var i = new Image;
                            i.onload = function () {
                                this.isLoaded = !0, this.onload = null
                            }, i.src = ".././img/accessories/access_" + e + ".png", wi[e] = i, mi = i
                        }
                        var s = bi[e];
                        if (!s) {
                            for (var a = 0; a < tt.length; ++a)
                                if (tt[a].id == e) {
                                    s = tt[a];
                                    break
                                } bi[e] = s
                        }
                        mi.isLoaded && (t.save(), t.translate(-20 - (s.xOff || 0), 0), s.spin && t.rotate(n.skinRot), t.drawImage(mi, -s.scale / 2, -s.scale / 2, s.scale, s.scale), t.restore())
                    }(e.tailIndex, t, e), e.buildIndex < 0 && !c.weapons[e.weaponIndex].aboveHand && (xi(c.weapons[e.weaponIndex], o.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == c.weapons[e.weaponIndex].projectile || c.weapons[e.weaponIndex].hideProjectile || ci(e.scale, 0, c.projectiles[c.weapons[e.weaponIndex].projectile], ve)), t.fillStyle = o.skinColors[e.skinColor], Pi(e.scale * Math.cos(n), e.scale * Math.sin(n), 14), Pi(e.scale * s * Math.cos(-n * i), e.scale * s * Math.sin(-n * i), 14), e.buildIndex < 0 && c.weapons[e.weaponIndex].aboveHand && (xi(c.weapons[e.weaponIndex], o.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == c.weapons[e.weaponIndex].projectile || c.weapons[e.weaponIndex].hideProjectile || ci(e.scale, 0, c.projectiles[c.weapons[e.weaponIndex].projectile], ve)), e.buildIndex >= 0) {
                    var a = Ei(c.list[e.buildIndex], !0);
                    t.drawImage(a, e.scale - c.list[e.buildIndex].holdOffset, -a.width / 2)
                }
                Pi(0, 0, e.scale, t), e.skinIndex > 0 && (t.rotate(Math.PI / 2), ki(e.skinIndex, t, null, e))
            }
            var mi, gi = {},
                yi = {};

            function ki(e, t, n, i) {
                if (!(mi = gi[e])) {
                    var s = new Image;
                    s.onload = function () {
                        this.isLoaded = !0, this.onload = null
                    }, s.src = ".././img/hats/hat_" + e + ".png", gi[e] = s, mi = s
                }
                var a = n || yi[e];
                if (!a) {
                    for (var r = 0; r < et.length; ++r)
                        if (et[r].id == e) {
                            a = et[r];
                            break
                        } yi[e] = a
                }
                mi.isLoaded && t.drawImage(mi, -a.scale / 2, -a.scale / 2, a.scale, a.scale), !n && a.topSprite && (t.save(), t.rotate(i.skinRot), ki(e + "_top", t, a, i), t.restore())
            }
            var wi = {},
                bi = {};
            var vi = {};

            function xi(e, t, n, i, s) {
                var a = e.src + (t || ""),
                    r = vi[a];
                r || ((r = new Image).onload = function () {
                    this.isLoaded = !0
                }, r.src = ".././img/weapons/" + a + ".png", vi[a] = r), r.isLoaded && s.drawImage(r, n + e.xOff - e.length / 2, i + e.yOff - e.width / 2, e.length, e.width)
            }
            var Si = {};

            function Ii(e) {
                var t = e.y >= o.mapScale - o.snowBiomeTop ? 2 : e.y <= o.snowBiomeTop ? 1 : 0,
                    n = e.type + "_" + e.scale + "_" + t,
                    i = Si[n];
                if (!i) {
                    var s = document.createElement("canvas");
                    s.width = s.height = 2.1 * e.scale + at;
                    var r = s.getContext("2d");
                    if (r.translate(s.width / 2, s.height / 2), r.rotate(a.randFloat(0, Math.PI)), r.strokeStyle = it, r.lineWidth = at, 0 == e.type)
                        for (var l, c = 0; c < 2; ++c) Ai(r, 7, l = D.scale * (c ? .5 : 1), .7 * l), r.fillStyle = t ? c ? "#fff" : "#e3f1f4" : c ? "#b4db62" : "#9ebf57", r.fill(), c || r.stroke();
                    else if (1 == e.type)
                        if (2 == t) r.fillStyle = "#606060", Ai(r, 6, .3 * e.scale, .71 * e.scale), r.fill(), r.stroke(), r.fillStyle = "#89a54c", Pi(0, 0, .55 * e.scale, r), r.fillStyle = "#a5c65b", Pi(0, 0, .3 * e.scale, r, !0);
                        else {
                            var h;
                            ! function (e, t, n, i) {
                                var s, r = Math.PI / 2 * 3,
                                    o = Math.PI / t;
                                e.beginPath(), e.moveTo(0, -i);
                                for (var l = 0; l < t; l++) s = a.randInt(n + .9, 1.2 * n), e.quadraticCurveTo(Math.cos(r + o) * s, Math.sin(r + o) * s, Math.cos(r + 2 * o) * i, Math.sin(r + 2 * o) * i), r += 2 * o;
                                e.lineTo(0, -i), e.closePath()
                            }(r, 6, D.scale, .7 * D.scale), r.fillStyle = t ? "#e3f1f4" : "#89a54c", r.fill(), r.stroke(), r.fillStyle = t ? "#6a64af" : "#c15555";
                            var u = I / 4;
                            for (c = 0; c < 4; ++c) Pi((h = a.randInt(D.scale / 3.5, D.scale / 2.3)) * Math.cos(u * c), h * Math.sin(u * c), a.randInt(10, 12), r)
                        }
                    else 2 != e.type && 3 != e.type || (r.fillStyle = 2 == e.type ? 2 == t ? "#938d77" : "#939393" : "#e0c655", Ai(r, 3, e.scale, e.scale), r.fill(), r.stroke(), r.fillStyle = 2 == e.type ? 2 == t ? "#b2ab90" : "#bcbcbc" : "#ebdca3", Ai(r, 3, .55 * e.scale, .65 * e.scale), r.fill());
                    i = s, Si[n] = i
                }
                return i
            }
            var Ti = [];

            function Mi(e, t) {
                var n = Ti[e.id];
                if (!n || t) {
                    var i = document.createElement("canvas");
                    i.width = i.height = 2.5 * e.scale + at + (c.list[e.id].spritePadding || 0);
                    var s = i.getContext("2d");
                    if (s.translate(i.width / 2, i.height / 2), s.rotate(t ? 0 : Math.PI / 2), s.strokeStyle = it, s.lineWidth = at * (t ? i.width / 81 : 1), "apple" == e.name) {
                        s.fillStyle = "#c15555", Pi(0, 0, e.scale, s), s.fillStyle = "#89a54c";
                        var r = -Math.PI / 2;
                        Ci(e.scale * Math.cos(r), e.scale * Math.sin(r), 25, r + Math.PI / 2, s)
                    } else if ("cookie" == e.name) {
                        s.fillStyle = "#cca861", Pi(0, 0, e.scale, s), s.fillStyle = "#937c4b";
                        for (var o = I / (h = 4), l = 0; l < h; ++l) Pi((u = a.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * l), u * Math.sin(o * l), a.randInt(4, 5), s, !0)
                    } else if ("cheese" == e.name) {
                        s.fillStyle = "#f4f3ac", Pi(0, 0, e.scale, s), s.fillStyle = "#c3c28b";
                        var h, u;
                        for (o = I / (h = 4), l = 0; l < h; ++l) Pi((u = a.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * l), u * Math.sin(o * l), a.randInt(4, 5), s, !0)
                    } else if ("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
                        s.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
                        var d = "castle wall" == e.name ? 4 : 3;
                        Ai(s, d, 1.1 * e.scale, 1.1 * e.scale), s.fill(), s.stroke(), s.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc", Ai(s, d, .65 * e.scale, .65 * e.scale), s.fill()
                    } else if ("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
                        s.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
                        var f = .6 * e.scale;
                        Ai(s, "spikes" == e.name ? 5 : 6, e.scale, f), s.fill(), s.stroke(), s.fillStyle = "#a5974c", Pi(0, 0, f, s), s.fillStyle = "#c9b758", Pi(0, 0, f / 2, s, !0)
                    } else if ("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name) s.fillStyle = "#a5974c", Pi(0, 0, e.scale, s), s.fillStyle = "#c9b758", _i(0, 0, 1.5 * e.scale, 29, 4, s), s.fillStyle = "#a5974c", Pi(0, 0, .5 * e.scale, s);
                    else if ("mine" == e.name) s.fillStyle = "#939393", Ai(s, 3, e.scale, e.scale), s.fill(), s.stroke(), s.fillStyle = "#bcbcbc", Ai(s, 3, .55 * e.scale, .65 * e.scale), s.fill();
                    else if ("sapling" == e.name)
                        for (l = 0; l < 2; ++l) {
                            Ai(s, 7, f = e.scale * (l ? .5 : 1), .7 * f), s.fillStyle = l ? "#b4db62" : "#9ebf57", s.fill(), l || s.stroke()
                        } else if ("pit trap" == e.name) s.fillStyle = "#a5974c", Ai(s, 3, 1.1 * e.scale, 1.1 * e.scale), s.fill(), s.stroke(), s.fillStyle = it, Ai(s, 3, .65 * e.scale, .65 * e.scale), s.fill();
                        else if ("boost pad" == e.name) s.fillStyle = "#7e7f82", Bi(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#dbd97d", Ri(1 * e.scale, s);
                    else if ("turret" == e.name) {
                        s.fillStyle = "#a5974c", Pi(0, 0, e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#939393";
                        Bi(0, -25, .9 * e.scale, 50, s), Pi(0, 0, .6 * e.scale, s), s.fill(), s.stroke()
                    } else if ("platform" == e.name) {
                        s.fillStyle = "#cebd5f";
                        var p = 2 * e.scale,
                            m = p / 4,
                            g = -e.scale / 2;
                        for (l = 0; l < 4; ++l) Bi(g - m / 2, 0, m, 2 * e.scale, s), s.fill(), s.stroke(), g += p / 4
                    } else "healing pad" == e.name ? (s.fillStyle = "#7e7f82", Bi(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#db6e6e", _i(0, 0, .65 * e.scale, 20, 4, s, !0)) : "spawn pad" == e.name ? (s.fillStyle = "#7e7f82", Bi(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#71aad6", Pi(0, 0, .6 * e.scale, s)) : "blocker" == e.name ? (s.fillStyle = "#7e7f82", Pi(0, 0, e.scale, s), s.fill(), s.stroke(), s.rotate(Math.PI / 4), s.fillStyle = "#db6e6e", _i(0, 0, .65 * e.scale, 20, 4, s, !0)) : "teleporter" == e.name && (s.fillStyle = "#7e7f82", Pi(0, 0, e.scale, s), s.fill(), s.stroke(), s.rotate(Math.PI / 4), s.fillStyle = "#d76edb", Pi(0, 0, .5 * e.scale, s, !0));
                    n = i, t || (Ti[e.id] = n)
                }
                return n
            }
            var ji = [];

            function Ei(e, t) {
                var n = ji[e.id + (!t && R && R.sid != e.owner.sid && !ea(e.owner.sid) && As ? 23 : 0)];
                if (!n) {
                    var i = document.createElement("canvas");
                    i.width = i.height = 2.5 * e.scale + at + (c.list[e.id].spritePadding || 0);
                    var s = i.getContext("2d");
                    if (s.translate(i.width / 2, i.height / 2), s.rotate(Math.PI / 2), s.strokeStyle = it, s.lineWidth = at, "apple" == e.name) {
                        s.fillStyle = "#c15555", Pi(0, 0, e.scale, s), s.fillStyle = "#89a54c";
                        var r = -Math.PI / 2;
                        Ci(e.scale * Math.cos(r), e.scale * Math.sin(r), 25, r + Math.PI / 2, s)
                    } else if ("cookie" == e.name) {
                        s.fillStyle = "#cca861", Pi(0, 0, e.scale, s), s.fillStyle = "#937c4b";
                        for (var o = I / (h = 4), l = 0; l < h; ++l) Pi((u = a.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * l), u * Math.sin(o * l), a.randInt(4, 5), s, !0)
                    } else if ("cheese" == e.name) {
                        s.fillStyle = "#f4f3ac", Pi(0, 0, e.scale, s), s.fillStyle = "#c3c28b";
                        var h, u;
                        for (o = I / (h = 4), l = 0; l < h; ++l) Pi((u = a.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * l), u * Math.sin(o * l), a.randInt(4, 5), s, !0)
                    } else if ("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
                        s.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
                        var d = "castle wall" == e.name ? 4 : 3;
                        Ai(s, d, 1.1 * e.scale, 1.1 * e.scale), s.fill(), s.stroke(), s.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc", Ai(s, d, .65 * e.scale, .65 * e.scale), s.fill()
                    } else if ("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
                        s.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
                        var f = .6 * e.scale;
                        Ai(s, "spikes" == e.name ? 5 : 6, e.scale, f), s.fill(), s.stroke(), s.fillStyle = "#a5974c", Pi(0, 0, f, s), !t && R && R.sid != e.owner.sid && !ea(e.owner.sid) && As ? s.fillStyle = "#cc5151" : s.fillStyle = "#c9b758", Pi(0, 0, f / 2, s, !0)
                    } else if ("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name) s.fillStyle = "#a5974c", Pi(0, 0, e.scale, s), s.fillStyle = "#c9b758", _i(0, 0, 1.5 * e.scale, 29, 4, s), s.fillStyle = "#a5974c", Pi(0, 0, .5 * e.scale, s);
                    else if ("mine" == e.name) s.fillStyle = "#939393", Ai(s, 3, e.scale, e.scale), s.fill(), s.stroke(), s.fillStyle = "#bcbcbc", Ai(s, 3, .55 * e.scale, .65 * e.scale), s.fill();
                    else if ("sapling" == e.name)
                        for (l = 0; l < 2; ++l) {
                            Ai(s, 7, f = e.scale * (l ? .5 : 1), .7 * f), s.fillStyle = l ? "#b4db62" : "#9ebf57", s.fill(), l || s.stroke()
                        } else if ("pit trap" == e.name) s.fillStyle = "#a5974c", Ai(s, 3, 1.1 * e.scale, 1.1 * e.scale), s.fill(), s.stroke(), !t && R && R.sid != e.owner.sid && !ea(e.owner.sid) && As ? s.fillStyle = "#cc5151" : s.fillStyle = it, Ai(s, 3, .65 * e.scale, .65 * e.scale), s.fill();
                        else if ("boost pad" == e.name) s.fillStyle = "#7e7f82", Bi(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#dbd97d", Ri(1 * e.scale, s);
                    else if ("turret" == e.name) {
                        s.fillStyle = "#a5974c", Pi(0, 0, e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#939393";
                        Bi(0, -25, .9 * e.scale, 50, s), Pi(0, 0, .6 * e.scale, s), s.fill(), s.stroke()
                    } else if ("platform" == e.name) {
                        s.fillStyle = "#cebd5f";
                        var p = 2 * e.scale,
                            m = p / 4,
                            g = -e.scale / 2;
                        for (l = 0; l < 4; ++l) Bi(g - m / 2, 0, m, 2 * e.scale, s), s.fill(), s.stroke(), g += p / 4
                    } else "healing pad" == e.name ? (s.fillStyle = "#7e7f82", Bi(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#db6e6e", _i(0, 0, .65 * e.scale, 20, 4, s, !0)) : "spawn pad" == e.name ? (s.fillStyle = "#7e7f82", Bi(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#71aad6", Pi(0, 0, .6 * e.scale, s)) : "blocker" == e.name ? (s.fillStyle = "#7e7f82", Pi(0, 0, e.scale, s), s.fill(), s.stroke(), s.rotate(Math.PI / 4), s.fillStyle = "#db6e6e", _i(0, 0, .65 * e.scale, 20, 4, s, !0)) : "teleporter" == e.name && (s.fillStyle = "#7e7f82", Pi(0, 0, e.scale, s), s.fill(), s.stroke(), s.rotate(Math.PI / 4), s.fillStyle = "#d76edb", Pi(0, 0, .5 * e.scale, s, !0));
                    n = i, ji[e.id + (!t && R && R.sid != e.owner.sid && !ea(e.owner.sid) && As ? 23 : 0)] = n
                }
                return n
            }

            function Ci(e, t, n, i, s) {
                var a = e + n * Math.cos(i),
                    r = t + n * Math.sin(i),
                    o = .4 * n;
                s.moveTo(e, t), s.beginPath(), s.quadraticCurveTo((e + a) / 2 + o * Math.cos(i + Math.PI / 2), (t + r) / 2 + o * Math.sin(i + Math.PI / 2), a, r), s.quadraticCurveTo((e + a) / 2 - o * Math.cos(i + Math.PI / 2), (t + r) / 2 - o * Math.sin(i + Math.PI / 2), e, t), s.closePath(), s.fill(), s.stroke()
            }

            function Pi(e, t, n, i, s, a) {
                (i = i || ve).beginPath(), i.arc(e, t, n, 0, 2 * Math.PI), a || i.fill(), s || i.stroke()
            }

            function Ai(e, t, n, i) {
                var s, a, r = Math.PI / 2 * 3,
                    o = Math.PI / t;
                e.beginPath(), e.moveTo(0, -n);
                for (var l = 0; l < t; l++) s = Math.cos(r) * n, a = Math.sin(r) * n, e.lineTo(s, a), r += o, s = Math.cos(r) * i, a = Math.sin(r) * i, e.lineTo(s, a), r += o;
                e.lineTo(0, -n), e.closePath()
            }

            function Bi(e, t, n, i, s, a) {
                s.fillRect(e - n / 2, t - i / 2, n, i), a || s.strokeRect(e - n / 2, t - i / 2, n, i)
            }

            function _i(e, t, n, i, s, a, r) {
                a.save(), a.translate(e, t), s = Math.ceil(s / 2);
                for (var o = 0; o < s; o++) Bi(0, 0, 2 * n, i, a, r), a.rotate(Math.PI / s);
                a.restore()
            }

            function Ri(e, t) {
                t = t || ve;
                var n = e * (Math.sqrt(3) / 2);
                t.beginPath(), t.moveTo(0, -n / 2), t.lineTo(-e / 2, n / 2), t.lineTo(e / 2, n / 2), t.lineTo(0, -n / 2), t.fill(), t.closePath()
            }

            function Oi(e, t) {
                let n = Math.atan2(R.y2 - e, R.x2 - t);
                ms.length && Os(ms, R) <= 250 ? Vs(2, n + Math.PI) : R.items[4] && Vs(4, n + Math.PI)
            }

            function Di(e) {
                for (var t = 0; t < e.length;) nt.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], c.list[e[t + 6]], !0, e[t + 7] >= 0 ? {
                    sid: e[t + 7]
                } : null), 15 == e[t + 6] && Math.hypot(R.y2 - e[t + 2], R.x2 - e[t + 1]) <= 85 && e[t + 7] != R.sid && !ea(e[t + 7]) && (Oi(e[t + 2], e[t + 1]), n = e[t], ns = {
                    sid: n,
                    hitCount: 0
                }, as = !0, $t(6, 0), Jt(0, 1)), t += 8;
                var n
            }

            function Ui(e, t) {
                (D = Zs(t)) && (D.xWiggle += o.gatherWiggle * Math.cos(e), D.yWiggle += o.gatherWiggle * Math.sin(e))
            }

            function Li(e, t) {
                (D = Zs(e)) && (D.dir = t, D.xWiggle += o.gatherWiggle * Math.cos(t + Math.PI), D.yWiggle += o.gatherWiggle * Math.sin(t + Math.PI))
            }

            function Fi(e, t, n, i, s, a, r, l) {
                ht && (J.addProjectile(e, t, n, i, s, a, null, null, r).sid = l, function (e, t, n, i, s) {
                    let a = 1 / 0,
                        r = D;
                    for (let i = 0; i < q.length; i++)(D = q[i]).visible && Is[D.sid] && void 0 !== c.weapons[Is[D.sid]].projectile && c.projectiles[c.weapons[Is[D.sid]].projectile].speed == s && a > (1.5 * D.x2 - D.x1 / 2 - e + 80 * Math.cos(n)) ** 2 + (1.5 * D.y2 - D.y1 / 2 - t + 80 * Math.sin(n)) ** 2 && (r = D, a = (1.5 * D.x2 - D.x1 / 2 - e + 80 * Math.cos(n)) ** 2 + (1.5 * D.y2 - D.y1 / 2 - t + 80 * Math.sin(n)) ** 2);
                    if (Math.sqrt(a) > 60)
                        if (1.5 == s) {
                            for (let i = 0; i < q.length; i++)(D = q[i]).visible && a > (1.5 * D.x2 - D.x1 / 2 - e + 10 * Math.cos(n)) ** 2 + (1.5 * D.y2 - D.y1 / 2 - t + 10 * Math.sin(n)) ** 2 && (r = D, a = (1.5 * D.x2 - D.x1 / 2 - e + 10 * Math.cos(n)) ** 2 + (1.5 * D.y2 - D.y1 / 2 - t + 10 * Math.sin(n)) ** 2);
                            Math.sqrt(a) < 60 && (Hi(r, "bullet"), r.tR = -1e3 / o.serverUpdateRate / 2500)
                        } else {
                            for (let i = 0; i < q.length; i++)(D = q[i]).visible && Is[D.sid] && a > (1.5 * D.x2 - D.x1 / 2 - e + 80 * Math.cos(n)) ** 2 + (1.5 * D.y2 - D.y1 / 2 - t + 80 * Math.sin(n)) ** 2 && (r = D, a = (1.5 * D.x2 - D.x1 / 2 - e + 80 * Math.cos(n)) ** 2 + (1.5 * D.y2 - D.y1 / 2 - t + 80 * Math.sin(n)) ** 2);
                            Hi(r, "bullet"), r.sR = -1e3 / o.serverUpdateRate / c.weapons[Is[r.sid]].speed, r.sCd = c.weapons[Is[r.sid]].count
                        }
                    else Hi(r, "bullet"), r.sR = -1e3 / o.serverUpdateRate / c.weapons[Is[r.sid]].speed, r.sCd = c.weapons[Is[r.sid]].count
                }(e, t, n, 0, s))
            }
            var Yi = {
                    bullet: 0,
                    arrow: 0
                },
                zi = !1;

            function Hi(e, t) {
                e.sid == R.sid || ea(e.sid) || (Yi.bullet++, setTimeout((() => {
                    Yi.bullet--
                }), 3e3 / 9), ms.length && Yi.bullet >= 4 && !zi && (zi = !0, setTimeout((() => {
                    zi = !1
                }), 3e3), q.length >= 3 ? Os(ms, R) <= 300 ? s.send("ch", "sync threat") : s.send("ch", "sync detect test") : s.send("ch", "ranged insta homo")))
            }

            function Wi(e, t) {
                for (var n = 0; n < G.length; ++n) G[n].sid == e && (G[n].range = t);
                0
            }

            function Vi(e) {
                (D = Qs(e)) && D.startAnim()
            }

            function qi(e) {
                for (var t = 0; t < V.length; ++t) V[t].forcePos = !V[t].visible, V[t].visible = !1;
                if (e) {
                    var n = Date.now();
                    for (t = 0; t < e.length;)(D = Qs(e[t])) ? (D.index = e[t + 1], D.t1 = void 0 === D.t2 ? n : D.t2, D.t2 = n, D.x1 = D.x, D.y1 = D.y, D.x2 = e[t + 2], D.y2 = e[t + 3], D.d1 = void 0 === D.d2 ? e[t + 4] : D.d2, D.d2 = e[t + 4], D.health = e[t + 5], D.dt = 0, D.visible = !0) : ((D = Z.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1])).x2 = D.x, D.y2 = D.y, D.d2 = D.dir, D.health = e[t + 5], Z.aiTypes[e[t + 1]].name || (D.name = o.cowNames[e[t + 6]]), D.forcePos = !0, D.sid = e[t], D.visible = !0), t += 7
                }
            }
            var Ni = {};

            function Xi(e, t) {
                var n = e.index,
                    i = Ni[n];
                if (!i) {
                    var s = new Image;
                    s.onload = function () {
                        this.isLoaded = !0, this.onload = null
                    }, s.src = ".././img/animals/" + e.src + ".png", i = s, Ni[n] = i
                }
                if (i.isLoaded) {
                    var a = 1.2 * e.scale * (e.spriteMlt || 1);
                    t.drawImage(i, -a, -a, 2 * a, 2 * a)
                }
            }

            function Gi(e, t, n) {
                return e + n >= 0 && e - n <= oe && t + n >= 0 && t - n <= le
            }
            var Ji = 0,
                Ki = !1,
                $i = !1,
                Qi = !1,
                Zi = 50,
                es = {
                    x: 0,
                    y: 0
                },
                ts = {
                    x: 0,
                    y: 0
                },
                ns = {
                    sid: void 0,
                    hitCount: 0
                },
                is = !1,
                ss = !1,
                as = !1,
                rs = 0,
                os = !1,
                ls = !1,
                cs = !1,
                hs = !1,
                us = !1,
                ds = !1,
                fs = !1,
                ps = [],
                ms = [],
                gs = [],
                ys = [],
                ks = 0,
                ws = 0;
            const bs = [];
            var vs = {
                    totaldmg: 0,
                    canInsta: !1
                },
                xs = [],
                Ss = [],
                Is = [],
                Ts = [],
                Ms = !1,
                js = !1,
                Es = !1,
                Cs = !0,
                Ps = !1,
                As = !0,
                Bs = void 0;

            function _s(e, t) {
                var n = function (e) {
                    for (var t = 0; t < q.length; ++t)
                        if (q[t].id == e) return q[t];
                    return null
                }(e[0]);
                n || (n = new u(e[0], e[1], o, a, J, nt, q, V, c, et, tt), q.push(n)), n.spawn(t ? C : null), n.visible = !1, n.x2 = void 0, n.y2 = void 0, n.hitTime2 = 0, n.isHitted = 0, n.shameCount2 = 0, n.dangerCount = 5, n.pR = 1, n.sR = 1, n.tR = 1, n.pCd = 0, n.sCd = 0, n.setData(e), t && (U = (R = n).x, L = R.y, Zt(), Qn(), ii(), ni(0), Pe.style.display = "block")
            }

            function Rs(e, t) {
                return Math.hypot(e.y - t.y, e.x - t.x)
            }

            function Os(e, t) {
                return Math.hypot(e[2] - t.y2, e[1] - t.x2)
            }

            function Ds(e, t) {
                return Math.atan2(e.y - t.y, e.x - t.x)
            }

            function Us(e) {
                for (var t = 0; t < q.length; t++)
                    if (q[t].id == e) {
                        q.splice(t, 1);
                        break
                    }
            }

            function Ls(e, t) {
                R && (R.itemCounts[e] = t)
            }

            function Fs(e, t, n) {
                R && (R[e] = t, n && Qn())
            }

            function Ys() {
                X.filter((e => "turret" == e.name && R.sid != e.owner.sid && !ea(e.owner.sid) && Rs(e, R) <= 700 && e.active)).length ? $t(22, 0) : ss ? function (e) {
                    R.y2 <= o.snowBiomeTop ? e(15, 0) : R.y2 >= o.mapScale / 2 - o.riverWidth / 2 && R.y2 <= o.mapScale / 2 + o.riverWidth / 2 ? e(31, 0) : e(12, 0)
                }($t) : $t(6, 0)
            }

            function zs(e) {
                let t = e;
                return 45 != R.skinIndex && 56 != R.skinIndex ? 0 == R.items[0] ? t < -80 ? 5 : t < -60 ? 4 : t < -40 ? 3 : t < -20 ? 2 : 1 : 1 == R.items[0] ? t < -80 ? 3 : t < -40 ? 2 : 1 : 2 == R.items[0] ? t < -90 ? 4 : t < -60 ? 3 : t < -30 ? 2 : 1 : 4 : 0
            }

            function Hs(e, t) {
                (D = $s(e)) && (! function (e, t) {
                    let n = t - e.health;
                    n > 0 ? e.hitTime2 && (ws - e.hitTime2 < 2 ? e.shameCount2 >= 10 ? e.shameCount2 = 7 : e.shameCount2++ : e.shameCount2 = Math.max(0, e.shameCount2 - 2), e.hitTime2 = 0) : (e.isHitted++, e.hitTime2 = ws, e == R && (7 == R.skinIndex && (-5 == n || 13 == R.tailIndex && -2 == n) && (ws, !1), function (e) {
                        let t = $s(ms[0]);
                        if (e < -25 && ms.length && Os(ms, R) <= 350 && 1 == t.pR) {
                            if (R.shameCount2 < R.dangerCount)
                                for (let t = 0; t < zs(e); t++) Vs(0);
                            else Xs((() => {
                                for (let t = 0; t < zs(e); t++) Vs(0)
                            }), 2);
                            ds || vs.canInsta || $i || os || as || 1 != t.sR || (ds = !0)
                        } else Xs((() => {
                            for (let t = 0; t < zs(e); t++) Vs(0)
                        }), 2)
                    }(n)))
                }(D, t), D.health = t)
            }

            function Ws(e) {
                return e * (Math.PI / 180)
            }

            function Vs(e, t) {
                zn(R.items[e]), s.send("c", 1, t), s.send("c", 0, t), zn(Ji, !0)
            }

            function qs() {
                let e = ms.length ? 22 != ms[9] && R.skins[53] && 1 == R.tR : !(!R.skins[53] || 1 != R.tR),
                    t = !!R.skins[7],
                    n = !(!ms.length || 6 != ms[9]),
                    i = 0 == Ss[R.sid] ? 1 : 1 == Ss[R.sid] ? 1.1 : Ss[R.sid] >= 2 ? 1.18 : 1,
                    s = 0 == Ts[R.sid] ? 1 : 1 == Ts[R.sid] ? 1.1 : Ts[R.sid] >= 2 ? 1.18 : 1;
                $s(ms[0]);
                1 == R.pR && 1 == R.sR && null != R.weapons[0] && null != R.weapons[1] ? vs.totaldmg = e ? t ? Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i * 1.5 + (10 == R.weapons[1] || 14 == R.weapons[1] ? c.weapons[R.weapons[1]].dmg * s : c.weapons[R.weapons[1]].Pdmg) + 25)) : Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i + (10 == R.weapons[1] || 14 == R.weapons[1] ? c.weapons[R.weapons[1]].dmg * s : c.weapons[R.weapons[1]].Pdmg) + 25)) : t ? Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i * 1.5 + (10 == R.weapons[1] || 14 == R.weapons[1] ? c.weapons[R.weapons[1]].dmg * s : c.weapons[R.weapons[1]].Pdmg))) : Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i + (10 == R.weapons[1] || 14 == R.weapons[1] ? c.weapons[R.weapons[1]].dmg * s : c.weapons[R.weapons[1]].Pdmg))) : 1 == R.pR && null != R.weapons[0] ? vs.totaldmg = e ? t ? Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i * 1.5 + 25)) : Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i + 25)) : t ? Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i * 1.5)) : Math.round((n ? .75 : 1) * (c.weapons[R.weapons[0]].dmg * i)) : 1 == R.sR && null != R.weapons[1] ? vs.totaldmg = e ? Math.round((n ? .75 : 1) * ((10 == R.weapons[1] || 14 == R.weapons[1] ? c.weapons[R.weapons[1]].dmg * s : c.weapons[R.weapons[1]].Pdmg) + 25)) : Math.round((n ? .75 : 1) * (10 == R.weapons[1] || 14 == R.weapons[1] ? c.weapons[R.weapons[1]].dmg * s : c.weapons[R.weapons[1]].Pdmg)) : vs.totaldmg = e ? Math.round(25 * (n ? .75 : 1)) : 0, vs.totaldmg >= 100 && ms.length && Ki && !fs && !$i && !os && Os(ms, R) < c.weapons[10 == R.weapons[1] ? R.weapons[1] : R.weapons[0]].range + 2 * o.playerScale && 1 == R.pR && 1 == R.sR && 1 == R.tR ? vs.canInsta = !0 : vs.canInsta = !1
            }
            window.testTick = !1;

            function Ns(e) {
                ps = [], ms = [], gs = [], ys = [], ks = 0, ws++;
                for (var t, n, i = Date.now(), a = 0; a < q.length; ++a) q[a].forcePos = !q[a].visible, q[a].visible = !1;
                for (a = 0; a < e.length;)(D = $s(e[a])) && (D.t1 = void 0 === D.t2 ? i : D.t2, D.t2 = i, D.x1 = D.x, D.y1 = D.y, D.x2 = e[a + 1], D.y2 = e[a + 2], D.d1 = void 0 === D.d2 ? e[a + 3] : D.d2, D.d2 = e[a + 3], D.dt = 0, D.buildIndex = e[a + 4], D.weaponIndex = e[a + 5], D.weaponVariant = e[a + 6], D.team = e[a + 7], D.isLeader = e[a + 8], D.skinIndex = e[a + 9], D.tailIndex = e[a + 10], D.iconIndex = e[a + 11], D.zIndex = e[a + 12], D.visible = !0, !(D == R || D.team && D.team == R.team) && ps.push(e.slice(a, a + 13)), Ks(D)), a += 13;
                Bn ? Vs(0, Mn()) : _n ? Vs(4, Mn()) : Rn ? Vs(2, Mn()) : On && Vs(5, Mn()), ps.length && (ps = ps.sort(((e, t) => Os(e, R) - Os(t, R))), ms = ps[0]), ks = ms.length ? (t = ms, n = R, Math.atan2(t[2] - n.y2, t[1] - n.x2)) : jn(), X.length && (gs = X.sort(((e, t) => Rs(e, R) - Rs(t, R))), ys = gs[0]), myConfig.dir = Mn(), myConfig.safeDir = jn(), myConfig.x = R.x2, myConfig.y = R.y2, myConfig.nearDist = ms.length, ms.length && (botConfig.nearDst = function (e) {
                    return Math.hypot(ms[2] - e.y, ms[1] - e.x)
                }, myConfig.nearAim = function (e) {
                    return Math.atan2(ms[2] - e.y, ms[1] - e.x)
                }), qs(), us && (us = !1, Qi = !0, As || s.send("ch", "ml, " + R.x2 + ", " + R.y2), s.send("7", 1), Ji = R.weapons[1], zn(R.weapons[1], !0), s.send("2", ks), $t(53, 0), Xs((() => {
                    Qi = !1, Ys(), s.send("7", 1)
                }), 1)), Ps && (Ps = !1, console.log([R.buildIndex, R.weaponIndex, R.weaponVariant].join(", ")), ms.length && (R.iChatMessage = $s(ms[0]) + "/" + ms[0], R.iChatCountdown = 3e3, console.log(ms)), kn()), vn && (vn = !1, Jt(0, 1)), xn && (xn = !1, as || $i || vs.canInsta ? Jt(0, 1) : $t(11, 1)), !os || hs || as || (ls ? ($i || fs || 1 != R.pR || (fs = !0, s.send("7", 1), $t(7, 0), Xs((() => {
                    fs = !1, s.send("7", 1), Ys()
                }), 1)), Ji = R.weapons[0], zn(R.weapons[0], !0)) : cs && ($i || fs || 1 != (10 == R.weapons[1] ? R.sR : R.pR) || (fs = !0, s.send("7", 1), $t(40, 0), Xs((() => {
                    fs = !1, s.send("7", 1), Ys()
                }), 1)), Ji = 10 == R.weapons[1] ? R.weapons[1] : R.weapons[0], zn(10 == R.weapons[1] ? R.weapons[1] : R.weapons[0], !0)));
                let r = X.filter((e => "turret" == e.name && R.sid != e.owner.sid && !ea(e.owner.sid) && Rs(e, R) <= 700 && e.active));
                if ("pit trap" == ys.name && R.sid != ys.owner.sid && !ea(ys.owner.sid) && Rs(ys, R) <= 50 && ys.active) {
                    as = !0, rs = Ds(ys, R);
                    let e = 10 == R.weapons[1] && 8 != R.weapons[0] && 2 != ns.hitCount ? R.weapons[1] : R.weapons[0];
                    vs.canInsta || $i || (Ji = e, zn(e, !0)), !as || vs.canInsta || $i || fs || (10 == R.weapons[1] && 8 != R.weapons[0] && 2 != ns.hitCount ? 1 != R.sR : 1 != R.pR) || (fs = !0, s.send("7", 1), s.send("2", rs), 2 == ns.hitCount ? r.length ? $t(22, 0) : $t(6, 0) : $t(40, 0), Xs((() => {
                        10 == R.weapons[1] && 8 != R.weapons[0] && 2 == ns.hitCount ? (fs = !0, as ? r.length ? $t(22, 0) : $t(6, 0) : Ys(), Xs((() => {
                            s.send("7", 1), fs = !1, Ji = 10 == R.weapons[1] ? R.weapons[1] : R.weapons[0], zn(10 == R.weapons[1] ? R.weapons[1] : R.weapons[0], !0)
                        }), 1)) : (fs = !1, s.send("7", 1), as ? r.length ? $t(22, 0) : $t(6, 0) : Ys())
                    }), 1))
                } else as = !1;
                if (Ki && (R.skins[53] ? R.skins[7] || Kt(7, 0) : Kt(53, 0)), vs.canInsta && (Ki = !1, function () {
                        let e = X.filter((e => "turret" == e.name && R.sid != e.owner.sid && !ea(e.owner.sid) && Rs(e, R) <= 700 && e.active));
                        $i = !0, Qi = !0, !0, Ji = R.weapons[10 == R.weapons[1] ? 1 : 0], zn(R.weapons[10 == R.weapons[1] ? 1 : 0], !0), s.send("2", ks), $t(10 == R.weapons[1] ? 53 : 7, 0), Jt(0, 1), Yn(), (window.testTick ? Gs : setTimeout)((() => {
                            Ji = R.weapons[10 == R.weapons[1] ? 0 : 1], zn(R.weapons[10 == R.weapons[1] ? 0 : 1], !0), s.send("2", ks), $t(10 == R.weapons[1] ? 7 : 53, 0), (window.testTick ? Gs : setTimeout)((() => {
                                $i = !1, Qi = !1, !1, as ? (e.length ? $t(22, 0) : $t(6, 0), Jt(0, 1)) : (Ys(), $t(11, 1)), Yn()
                            }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                        }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                    }()), Ms && !as && 5 == R.weapons[0]) {
                    let e = Os(ms, R),
                        t = ks,
                        n = ks + Math.PI;
                    ms.length ? (js = !0, e < 185 ? (Ys(), Bs != n && (Bs = n, s.send("33", n)), -1 != R.buildIndex && (Ji = R.weapons[0], zn(R.weapons[0]))) : e >= 185 && e < 220 ? ($t(e < 210 ? 22 : 40, 0), Bs != n && (Bs = n, s.send("33", n)), R.buildIndex != R.items[1] && zn(R.items[1])) : e > 230 && e <= 265 ? ($t(e > 240 ? 22 : 40, 0), Bs != t && (Bs = t, s.send("33", t)), R.buildIndex != R.items[1] && zn(R.items[1])) : e > 265 ? (Ys(), Bs != t && (Bs = t, s.send("33", t)), -1 != R.buildIndex && (Ji = R.weapons[0], zn(R.weapons[0]))) : e >= 220 && e <= 230 && (6 != ms[9] && 22 != ms[9] && 1 == R.pR && 1 == R.tR && Cs ? function () {
                        let e = X.filter((e => "turret" == e.name && R.sid != e.owner.sid && !ea(e.owner.sid) && Rs(e, R) <= 700 && e.active));
                        Ms = !1, !0, !0, Qi = !0, Ji = R.weapons[0], zn(R.weapons[0], !0), s.send("2", ks), s.send("33", ks), $t(53, 0), Jt(11, 1), (window.testTick ? Gs : setTimeout)((() => {
                            Yn(), Ji = R.weapons[0], zn(R.weapons[0], !0), s.send("2", ks), s.send("33", ks), $t(7, 0), Jt(0, 1), (window.testTick ? Gs : setTimeout)((() => {
                                !1, !1, Qi = !1, s.send("33", void 0), as ? (Ji = 10 == R.weapons[1] && 8 != R.weapons[0] && 2 != ns.hitCount ? R.weapons[1] : R.weapons[0], zn(10 == R.weapons[1] && 8 != R.weapons[0] && 2 != ns.hitCount ? R.weapons[1] : R.weapons[0], !0), e.length ? $t(22, 0) : $t(6, 0), Jt(0, 1)) : (Ys(), $t(11, 1)), Yn()
                            }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                        }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                    }() : (Jt(0, 0), null != Bs && (Bs = void 0, s.send("33", void 0)), -1 != R.buildIndex && (Ji = R.weapons[0], zn(R.weapons[0]))))) : js = !1
                } else js = !1;
                if (Es && !as && 5 == R.weapons[0]) {
                    let e = Os(ms, R),
                        t = ks,
                        n = ks + Math.PI;
                    ms.length ? (!0, e < 360 ? (Ys(), s.send("33", n), -1 != R.buildIndex && (Ji = R.weapons[0], zn(R.weapons[0]))) : e >= 360 && e < 395 ? ($t(e < 385 ? 22 : 40, 0), s.send("33", n), R.buildIndex != R.items[1] && zn(R.items[1])) : e > 405 && e < 440 ? ($t(e > 415 ? 22 : 40, 0), s.send("33", t), R.buildIndex != R.items[1] && zn(R.items[1])) : e >= 440 ? (Ys(), s.send("33", t), -1 != R.buildIndex && (Ji = R.weapons[0], zn(R.weapons[0]))) : e >= 395 && e <= 405 && (1 == R.pR && 1 == R.sR && 1 == R.tR ? (Vs(4, ks), function () {
                        let e = X.filter((e => "turret" == e.name && R.sid != e.owner.sid && !ea(e.owner.sid) && Rs(e, R) <= 700 && e.active));
                        Es = !1, !0, !0, Qi = !0, Yn(), Ji = R.weapons[1], zn(R.weapons[1], !0), s.send("2", ks), s.send("33", ks), $t(53, 0), $t(11, 1), (window.testTick ? Gs : setTimeout)((() => {
                            s.send("33", ks), $t(12, 0), $t(11, 1), (window.testTick ? Gs : setTimeout)((() => {
                                Ji = R.weapons[0], zn(R.weapons[0], !0), s.send("2", ks), s.send("33", ks), $t(7, 0), Jt(0, 1), (window.testTick ? Gs : setTimeout)((() => {
                                    !1, !1, Qi = !1, s.send("33", void 0), as ? (Ji = 10 == R.weapons[1] && 8 != R.weapons[0] && 2 != ns.hitCount ? R.weapons[1] : R.weapons[0], zn(10 == R.weapons[1] && 8 != R.weapons[0] && 2 != ns.hitCount ? R.weapons[1] : R.weapons[0], !0), e.length ? $t(22, 0) : $t(6, 0), Jt(0, 1)) : (Ys(), $t(11, 1)), Yn()
                                }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                            }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                        }), window.testTick ? 1 : 1e3 / o.serverUpdateRate)
                    }()) : (Jt(0, 0), s.send("33", void 0)))) : js = !1
                } else js = !1;
                if (ds && (ds = !1, $t(22, 0), Xs((() => {
                        Ys()
                    }), 1)), Zi = 10 == R.items[3] ? 90 : 94, 6 == R.items[2] ? 49 : 52, es.y != R.y || es.x != R.x) {
                    if (is && Rs(ts, R) > Zi) {
                        let e = Ds(es, R);
                        Vs(3, e + Ws(Zi / 1.25)), Vs(3, e - Ws(Zi / 1.25)), Vs(3, e + Ws(0)), ts.x = R.x, ts.y = R.y
                    }
                    es.x = R.x, es.y = R.y
                }
                bs[ws] && bs[ws].forEach((e => e())), 45 == D.skinIndex && (D.shameCount2 = 0), As && (Os(ms, R) >= 965 || !ms.length) ? 2496 != oe && 1404 != le && (oe = 2496, le = 1404, kn()) : 1920 == oe && 1080 == le || (oe = 1920, le = 1080, kn())
            }

            function Xs(e, t) {
                "function" == typeof e && ("object" != typeof bs[ws + t] ? bs[ws + t] = [e] : bs[ws + t].push(e))
            }

            function Gs(e, t) {
                let n = ws + t,
                    i = setInterval((() => {
                        console.log(n, ws), ws >= n && (clearInterval(i), e())
                    }), 0)
            }
            var Js = !1;

            function Ks(e) {
                e.weaponSettings = c.weapons[e.weaponIndex], e.weaponIndex < 9 ? (xs[e.sid] = e.weaponIndex, Ss[e.sid] = e.weaponVariant, e.weaponIndex == xs[e.sid] && e.buildIndex < 0 && (e.pR = Math.min(1, e.pR + 1e3 / o.serverUpdateRate / c.weapons[xs[e.sid]].speed), e.pCd = Math.max(0, e.pCd - 1))) : e.weaponIndex > 8 && (Is[e.sid] = e.weaponIndex, Ts[e.sid] = e.weaponVariant, e.weaponIndex == Is[e.sid] && e.buildIndex < 0 && (e.sR = Math.min(1, e.sR + 1e3 / o.serverUpdateRate / c.weapons[Is[e.sid]].speed), e.sCd = Math.max(0, e.sCd - 1))), e.tR = Math.min(1, e.tR + 1e3 / o.serverUpdateRate / 2500), e == R && (1 == e.tR ? Js && (Js = !1, Xs((() => {
                    Cs = !0
                }), 2)) : (Js = !0, Cs = !1))
            }

            function $s(e) {
                for (var t = 0; t < q.length; ++t)
                    if (q[t].sid == e) return q[t];
                return null
            }

            function Qs(e) {
                for (var t = 0; t < V.length; ++t)
                    if (V[t].sid == e) return V[t];
                return null
            }

            function Zs(e) {
                for (var t = 0; t < X.length; ++t)
                    if (X[t].sid == e) return X[t];
                return null
            }

            function ea(e) {
                for (let t = 0; t < Mt.length; t += 2)
                    if (Mt[t] == e) return Mt[t];
                return null
            }
            var ta = -1;

            function na() {
                var e = Date.now() - ta;
                window.pingTime = e, Te.innerText = "Your Ping: " + e + " ms"
            }

            function ia() {
                ta = Date.now(), s.send("pp")
            }

            function sa(e) {
                if (!(e < 0)) {
                    var t = Math.floor(e / 60),
                        n = e % 60;
                    n = ("0" + n).slice(-2), Me.innerText = "Server restarting in " + t + ":" + n, Me.hidden = !1
                }
            }
            Te.style.left = "50px", Te.style.display = "block", document.body.appendChild(Te), window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
                window.setTimeout(e, 1e3 / 60)
            };
            let aa = [];
            var ra;

            function oa(e) {
                window.open(e, "_blank")
            }
            ra = o.mapScale / 2, nt.add(0, ra, ra + 200, 0, o.treeScales[3], 0), nt.add(1, ra, ra - 480, 0, o.treeScales[3], 0), nt.add(2, ra + 300, ra + 450, 0, o.treeScales[3], 0), nt.add(3, ra - 950, ra - 130, 0, o.treeScales[2], 0), nt.add(4, ra - 750, ra - 400, 0, o.treeScales[3], 0), nt.add(5, ra - 700, ra + 400, 0, o.treeScales[2], 0), nt.add(6, ra + 800, ra - 200, 0, o.treeScales[3], 0), nt.add(7, ra - 260, ra + 340, 0, o.bushScales[3], 1), nt.add(8, ra + 760, ra + 310, 0, o.bushScales[3], 1), nt.add(9, ra - 800, ra + 100, 0, o.bushScales[3], 1), nt.add(10, ra - 800, ra + 300, 0, c.list[4].scale, c.list[4].id, c.list[10]), nt.add(11, ra + 650, ra - 390, 0, c.list[4].scale, c.list[4].id, c.list[10]), nt.add(12, ra - 400, ra - 450, 0, o.rockScales[2], 2),
                function e() {
                    A = Date.now(), P = A - W, W = A, ai(), requestAnimFrame(e)
                }(), window.openLink = oa, window.aJoinReq = Rt, window.follmoo = function () {
                    C || (C = !0, T("moofoll", 1))
                }, window.kickFromClan = Ot, window.sendJoin = Dt, window.leaveAlliance = Lt, window.createAlliance = Ut, window.storeBuy = Kt, window.storeEquip = Jt, window.showItemInfo = vt, window.selectSkinColor = function (e) {
                    re = e, tn()
                }, window.changeStoreIndex = function (e) {
                    Nt != e && (Nt = e, Gt())
                }, window.config = o
        },
    "./src/js/config.js":
        /*!**************************!*\
          !*** ./src/js/config.js ***!
          \**************************/
        /*! no static exports found */
        function (e, t, n) {
            (function (t) {
                e.exports.maxScreenWidth = 1920, e.exports.maxScreenHeight = 1080, e.exports.serverUpdateRate = 9, e.exports.maxPlayers = t && -1 != t.argv.indexOf("--largeserver") ? 80 : 50, e.exports.maxPlayersHard = e.exports.maxPlayers + 10, e.exports.collisionDepth = 6, e.exports.minimapRate = 3e3, e.exports.colGrid = 10, e.exports.clientSendRate = 5, e.exports.healthBarWidth = 50, e.exports.healthBarPad = 4.5, e.exports.iconPadding = 15, e.exports.iconPad = .9, e.exports.deathFadeout = 0, e.exports.crownIconScale = 60, e.exports.crownPad = 35, e.exports.chatCountdown = 3e3, e.exports.chatCooldown = 500, e.exports.inSandbox = t && "mm_exp" === t.env.VULTR_SCHEME, e.exports.maxAge = 100, e.exports.gatherAngle = Math.PI / 2.6, e.exports.gatherWiggle = 10, e.exports.hitReturnRatio = .25, e.exports.hitAngle = Math.PI / 2, e.exports.playerScale = 35, e.exports.playerSpeed = .0016, e.exports.playerDecel = .993, e.exports.nameY = 34, e.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"], e.exports.animalCount = 7, e.exports.aiTurnRandom = .06, e.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"], e.exports.shieldAngle = Math.PI / 3, e.exports.weaponVariants = [{
                    id: 0,
                    src: "",
                    xp: 0,
                    val: 1
                }, {
                    id: 1,
                    src: "_g",
                    xp: 3e3,
                    val: 1.1
                }, {
                    id: 2,
                    src: "_d",
                    xp: 7e3,
                    val: 1.18
                }, {
                    id: 3,
                    src: "_r",
                    poison: !0,
                    xp: 12e3,
                    val: 1.18
                }], e.exports.fetchVariant = function (t) {
                    for (var n = t.weaponXP[t.weaponIndex] || 0, i = e.exports.weaponVariants.length - 1; i >= 0; --i)
                        if (n >= e.exports.weaponVariants[i].xp) return e.exports.weaponVariants[i]
                }, e.exports.resourceTypes = ["wood", "food", "stone", "points"], e.exports.areaCount = 7, e.exports.treesPerArea = 9, e.exports.bushesPerArea = 3, e.exports.totalRocks = 32, e.exports.goldOres = 7, e.exports.riverWidth = 724, e.exports.riverPadding = 114, e.exports.waterCurrent = .0011, e.exports.waveSpeed = 1e-4, e.exports.waveMax = 1.3, e.exports.treeScales = [150, 160, 165, 175], e.exports.bushScales = [80, 85, 95], e.exports.rockScales = [80, 85, 90], e.exports.snowBiomeTop = 2400, e.exports.snowSpeed = .75, e.exports.maxNameLength = 15, e.exports.mapScale = 14400, e.exports.mapPingScale = 40, e.exports.mapPingTime = 2200
            }).call(this, n( /*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js"))
        },
    "./src/js/data/ai.js":
        /*!***************************!*\
          !*** ./src/js/data/ai.js ***!
          \***************************/
        /*! no static exports found */
        function (e, t) {
            var n = 2 * Math.PI;
            e.exports = function (e, t, i, s, a, r, o, l) {
                this.sid = e, this.isAI = !0, this.nameIndex = a.randInt(0, r.cowNames.length - 1), this.init = function (e, t, n, i, s) {
                    this.x = e, this.y = t, this.startX = s.fixedSpawn ? e : null, this.startY = s.fixedSpawn ? t : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = n, this.dirPlus = 0, this.index = i, this.src = s.src, s.name && (this.name = s.name), this.weightM = s.weightM, this.speed = s.speed, this.killScore = s.killScore, this.turnSpeed = s.turnSpeed, this.scale = s.scale, this.maxHealth = s.health, this.leapForce = s.leapForce, this.health = this.maxHealth, this.chargePlayer = s.chargePlayer, this.viewRange = s.viewRange, this.drop = s.drop, this.dmg = s.dmg, this.hostile = s.hostile, this.dontRun = s.dontRun, this.hitRange = s.hitRange, this.hitDelay = s.hitDelay, this.hitScare = s.hitScare, this.spriteMlt = s.spriteMlt, this.nameScale = s.nameScale, this.colDmg = s.colDmg, this.noTrap = s.noTrap, this.spawnDelay = s.spawnDelay, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = !0, this.alive = !0, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {}
                };
                var c = 0;
                this.update = function (e) {
                    if (this.active) {
                        if (this.spawnCounter) return this.spawnCounter -= e, void(this.spawnCounter <= 0 && (this.spawnCounter = 0, this.x = this.startX || a.randInt(0, r.mapScale), this.y = this.startY || a.randInt(0, r.mapScale)));
                        (c -= e) <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), c = 1e3);
                        var s = !1,
                            o = 1;
                        if (!this.zIndex && !this.lockMove && this.y >= r.mapScale / 2 - r.riverWidth / 2 && this.y <= r.mapScale / 2 + r.riverWidth / 2 && (o = .33, this.xVel += r.waterCurrent * e), this.lockMove) this.xVel = 0, this.yVel = 0;
                        else if (this.waitCount > 0) {
                            if (this.waitCount -= e, this.waitCount <= 0)
                                if (this.chargePlayer) {
                                    for (var h, u, d, f = 0; f < i.length; ++f) !i[f].alive || i[f].skin && i[f].skin.bullRepel || (d = a.getDistance(this.x, this.y, i[f].x, i[f].y)) <= this.viewRange && (!h || d < u) && (u = d, h = i[f]);
                                    h ? (this.chargeTarget = h, this.moveCount = a.randInt(8e3, 12e3)) : (this.moveCount = a.randInt(1e3, 2e3), this.targetDir = a.randFloat(-Math.PI, Math.PI))
                                } else this.moveCount = a.randInt(4e3, 1e4), this.targetDir = a.randFloat(-Math.PI, Math.PI)
                        } else if (this.moveCount > 0) {
                            var p = this.speed * o;
                            if (this.runFrom && this.runFrom.active && (!this.runFrom.isPlayer || this.runFrom.alive) ? (this.targetDir = a.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), p *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = a.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), p *= 1.75, s = !0), this.hitWait && (p *= .3), this.dir != this.targetDir) {
                                this.dir %= n;
                                var m = (this.dir - this.targetDir + n) % n,
                                    g = Math.min(Math.abs(m - n), m, this.turnSpeed * e),
                                    y = m - Math.PI >= 0 ? 1 : -1;
                                this.dir += y * g + n
                            }
                            this.dir %= n, this.xVel += p * e * Math.cos(this.dir), this.yVel += p * e * Math.sin(this.dir), this.moveCount -= e, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : a.randInt(1500, 6e3))
                        }
                        this.zIndex = 0, this.lockMove = !1;
                        var k = a.getDistance(0, 0, this.xVel * e, this.yVel * e),
                            w = Math.min(4, Math.max(1, Math.round(k / 40))),
                            b = 1 / w;
                        for (f = 0; f < w; ++f) {
                            this.xVel && (this.x += this.xVel * e * b), this.yVel && (this.y += this.yVel * e * b), I = t.getGridArrays(this.x, this.y, this.scale);
                            for (var v = 0; v < I.length; ++v)
                                for (var x = 0; x < I[v].length; ++x) I[v][x].active && t.checkCollision(this, I[v][x], b)
                        }
                        var S = !1;
                        if (this.hitWait > 0 && (this.hitWait -= e, this.hitWait <= 0)) {
                            S = !0, this.hitWait = 0, this.leapForce && !a.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir), this.yVel += this.leapForce * Math.sin(this.dir));
                            for (var I = t.getGridArrays(this.x, this.y, this.hitRange), T = 0; T < I.length; ++T)
                                for (v = 0; v < I[T].length; ++v)(M = I[T][v]).health && (j = a.getDistance(this.x, this.y, M.x, M.y)) < M.scale + this.hitRange && (M.changeHealth(5 * -this.dmg) && t.disableObj(M), t.hitObj(M, a.getDirection(this.x, this.y, M.x, M.y)));
                            for (v = 0; v < i.length; ++v) i[v].canSee(this) && l.send(i[v].id, "aa", this.sid)
                        }
                        if (s || S) {
                            var M, j, E;
                            for (f = 0; f < i.length; ++f)(M = i[f]) && M.alive && (j = a.getDistance(this.x, this.y, M.x, M.y), this.hitRange ? !this.hitWait && j <= this.hitRange + M.scale && (S ? (E = a.getDirection(M.x, M.y, this.x, this.y), M.changeHealth(-this.dmg), M.xVel += .6 * Math.cos(E), M.yVel += .6 * Math.sin(E), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = a.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : j <= this.scale + M.scale && (E = a.getDirection(M.x, M.y, this.x, this.y), M.changeHealth(-this.dmg), M.xVel += .55 * Math.cos(E), M.yVel += .55 * Math.sin(E)))
                        }
                        this.xVel && (this.xVel *= Math.pow(r.playerDecel, e)), this.yVel && (this.yVel *= Math.pow(r.playerDecel, e));
                        var C = this.scale;
                        this.x - C < 0 ? (this.x = C, this.xVel = 0) : this.x + C > r.mapScale && (this.x = r.mapScale - C, this.xVel = 0), this.y - C < 0 ? (this.y = C, this.yVel = 0) : this.y + C > r.mapScale && (this.y = r.mapScale - C, this.yVel = 0)
                    }
                }, this.canSee = function (e) {
                    if (!e) return !1;
                    if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
                    var t = Math.abs(e.x - this.x) - e.scale,
                        n = Math.abs(e.y - this.y) - e.scale;
                    return t <= r.maxScreenWidth / 2 * 1.3 && n <= r.maxScreenHeight / 2 * 1.3
                };
                var h = 0,
                    u = 0;
                this.animate = function (e) {
                    this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, h = 0, u = 0) : 0 == u ? (h += e / (this.animSpeed * r.hitReturnRatio), this.dirPlus = a.lerp(0, this.targetAngle, Math.min(1, h)), h >= 1 && (h = 1, u = 1)) : (h -= e / (this.animSpeed * (1 - r.hitReturnRatio)), this.dirPlus = a.lerp(0, this.targetAngle, Math.max(0, h))))
                }, this.startAnim = function () {
                    this.animTime = this.animSpeed = 600, this.targetAngle = .8 * Math.PI, h = 0, u = 0
                }, this.changeHealth = function (e, t, n) {
                    if (this.active && (this.health += e, n && (this.hitScare && !a.randInt(0, this.hitScare) ? (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && n.isPlayer ? (this.chargeTarget = n, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3)), e < 0 && this.hitRange && a.randInt(0, 1) && (this.hitWait = 500), t && t.canSee(this) && e < 0 && l.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), this.health <= 0 && (this.spawnDelay ? (this.spawnCounter = this.spawnDelay, this.x = -1e6, this.y = -1e6) : (this.x = this.startX || a.randInt(0, r.mapScale), this.y = this.startY || a.randInt(0, r.mapScale)), this.health = this.maxHealth, this.runFrom = null, t && (o(t, this.killScore), this.drop))))
                        for (var i = 0; i < this.drop.length;) t.addResource(r.resourceTypes.indexOf(this.drop[i]), this.drop[i + 1]), i += 2
                }
            }
        },
    "./src/js/data/aiManager.js":
        /*!**********************************!*\
          !*** ./src/js/data/aiManager.js ***!
          \**********************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = function (e, t, n, i, s, a, r, o, l) {
                this.aiTypes = [{
                    id: 0,
                    src: "cow_1",
                    killScore: 150,
                    health: 500,
                    weightM: .8,
                    speed: 95e-5,
                    turnSpeed: .001,
                    scale: 72,
                    drop: ["food", 50]
                }, {
                    id: 1,
                    src: "pig_1",
                    killScore: 200,
                    health: 800,
                    weightM: .6,
                    speed: 85e-5,
                    turnSpeed: .001,
                    scale: 72,
                    drop: ["food", 80]
                }, {
                    id: 2,
                    name: "Bull",
                    src: "bull_2",
                    hostile: !0,
                    dmg: 20,
                    killScore: 1e3,
                    health: 1800,
                    weightM: .5,
                    speed: 94e-5,
                    turnSpeed: 74e-5,
                    scale: 78,
                    viewRange: 800,
                    chargePlayer: !0,
                    drop: ["food", 100]
                }, {
                    id: 3,
                    name: "Bully",
                    src: "bull_1",
                    hostile: !0,
                    dmg: 20,
                    killScore: 2e3,
                    health: 2800,
                    weightM: .45,
                    speed: .001,
                    turnSpeed: 8e-4,
                    scale: 90,
                    viewRange: 900,
                    chargePlayer: !0,
                    drop: ["food", 400]
                }, {
                    id: 4,
                    name: "Wolf",
                    src: "wolf_1",
                    hostile: !0,
                    dmg: 8,
                    killScore: 500,
                    health: 300,
                    weightM: .45,
                    speed: .001,
                    turnSpeed: .002,
                    scale: 84,
                    viewRange: 800,
                    chargePlayer: !0,
                    drop: ["food", 200]
                }, {
                    id: 5,
                    name: "Quack",
                    src: "chicken_1",
                    dmg: 8,
                    killScore: 2e3,
                    noTrap: !0,
                    health: 300,
                    weightM: .2,
                    speed: .0018,
                    turnSpeed: .006,
                    scale: 70,
                    drop: ["food", 100]
                }, {
                    id: 6,
                    name: "MOOSTAFA",
                    nameScale: 50,
                    src: "enemy",
                    hostile: !0,
                    dontRun: !0,
                    fixedSpawn: !0,
                    spawnDelay: 6e4,
                    noTrap: !0,
                    colDmg: 100,
                    dmg: 40,
                    killScore: 8e3,
                    health: 18e3,
                    weightM: .4,
                    speed: 7e-4,
                    turnSpeed: .01,
                    scale: 80,
                    spriteMlt: 1.8,
                    leapForce: .9,
                    viewRange: 1e3,
                    hitRange: 210,
                    hitDelay: 1e3,
                    chargePlayer: !0,
                    drop: ["food", 100]
                }, {
                    id: 7,
                    name: "Treasure",
                    hostile: !0,
                    nameScale: 35,
                    src: "crate_1",
                    fixedSpawn: !0,
                    spawnDelay: 12e4,
                    colDmg: 200,
                    killScore: 5e3,
                    health: 2e4,
                    weightM: .1,
                    speed: 0,
                    turnSpeed: 0,
                    scale: 70,
                    spriteMlt: 1
                }, {
                    id: 8,
                    name: "MOOFIE",
                    src: "wolf_2",
                    hostile: !0,
                    fixedSpawn: !0,
                    dontRun: !0,
                    hitScare: 4,
                    spawnDelay: 3e4,
                    noTrap: !0,
                    nameScale: 35,
                    dmg: 10,
                    colDmg: 100,
                    killScore: 3e3,
                    health: 7e3,
                    weightM: .45,
                    speed: .0015,
                    turnSpeed: .002,
                    scale: 90,
                    viewRange: 800,
                    chargePlayer: !0,
                    drop: ["food", 1e3]
                }], this.spawn = function (c, h, u, d) {
                    for (var f, p = 0; p < e.length; ++p)
                        if (!e[p].active) {
                            f = e[p];
                            break
                        } return f || (f = new t(e.length, s, n, i, r, a, o, l), e.push(f)), f.init(c, h, u, d, this.aiTypes[d]), f
                }
            }
        },
    "./src/js/data/gameObject.js":
        /*!***********************************!*\
          !*** ./src/js/data/gameObject.js ***!
          \***********************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = function (e) {
                this.sid = e, this.init = function (e, t, n, i, s, a, r) {
                    a = a || {}, this.sentTo = {}, this.gridLocations = [], this.active = !0, this.doUpdate = a.doUpdate, this.x = e, this.y = t, this.dir = n, this.xWiggle = 0, this.yWiggle = 0, this.scale = i, this.type = s, this.id = a.id, this.owner = r, this.name = a.name, this.isItem = null != this.id, this.group = a.group, this.health = a.health, this.layer = 2, null != this.group ? this.layer = this.group.layer : 0 == this.type ? this.layer = 3 : 2 == this.type ? this.layer = 0 : 4 == this.type && (this.layer = -1), this.colDiv = a.colDiv || 1, this.blocker = a.blocker, this.ignoreCollision = a.ignoreCollision, this.dontGather = a.dontGather, this.hideFromEnemy = a.hideFromEnemy, this.friction = a.friction, this.projDmg = a.projDmg, this.dmg = a.dmg, this.pDmg = a.pDmg, this.pps = a.pps, this.zIndex = a.zIndex || 0, this.turnSpeed = a.turnSpeed, this.req = a.req, this.trap = a.trap, this.healCol = a.healCol, this.teleport = a.teleport, this.boostSpeed = a.boostSpeed, this.projectile = a.projectile, this.shootRange = a.shootRange, this.shootRate = a.shootRate, this.shootCount = this.shootRate, this.spawnPoint = a.spawnPoint
                }, this.changeHealth = function (e, t) {
                    return this.health += e, this.health <= 0
                }, this.getScale = function (e, t) {
                    return e = e || 1, this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : .6 * e) * (t ? 1 : this.colDiv)
                }, this.visibleToPlayer = function (e) {
                    return !this.hideFromEnemy || this.owner && (this.owner == e || this.owner.team && e.team == this.owner.team)
                }, this.update = function (e) {
                    this.active && (this.xWiggle && (this.xWiggle *= Math.pow(.99, e)), this.yWiggle && (this.yWiggle *= Math.pow(.99, e)), this.turnSpeed && (this.dir += this.turnSpeed * e))
                }
            }
        },
    "./src/js/data/items.js":
        /*!******************************!*\
          !*** ./src/js/data/items.js ***!
          \******************************/
        /*! no static exports found */
        function (e, t) {
            e.exports.groups = [{
                id: 0,
                name: "food",
                layer: 0
            }, {
                id: 1,
                name: "walls",
                place: !0,
                limit: 30,
                layer: 0
            }, {
                id: 2,
                name: "spikes",
                place: !0,
                limit: 15,
                layer: 0
            }, {
                id: 3,
                name: "mill",
                place: !0,
                limit: 7,
                layer: 1
            }, {
                id: 4,
                name: "mine",
                place: !0,
                limit: 1,
                layer: 0
            }, {
                id: 5,
                name: "trap",
                place: !0,
                limit: 6,
                layer: -1
            }, {
                id: 6,
                name: "booster",
                place: !0,
                limit: 12,
                layer: -1
            }, {
                id: 7,
                name: "turret",
                place: !0,
                limit: 2,
                layer: 1
            }, {
                id: 8,
                name: "watchtower",
                place: !0,
                limit: 12,
                layer: 1
            }, {
                id: 9,
                name: "buff",
                place: !0,
                limit: 4,
                layer: -1
            }, {
                id: 10,
                name: "spawn",
                place: !0,
                limit: 1,
                layer: -1
            }, {
                id: 11,
                name: "sapling",
                place: !0,
                limit: 2,
                layer: 0
            }, {
                id: 12,
                name: "blocker",
                place: !0,
                limit: 3,
                layer: -1
            }, {
                id: 13,
                name: "teleporter",
                place: !0,
                limit: 2,
                layer: -1
            }], t.projectiles = [{
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 25,
                speed: 1.6,
                scale: 103,
                range: 1e3
            }, {
                indx: 1,
                layer: 1,
                dmg: 25,
                scale: 20
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 35,
                speed: 2.5,
                scale: 103,
                range: 1200
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 30,
                speed: 2,
                scale: 103,
                range: 1200
            }, {
                indx: 1,
                layer: 1,
                dmg: 16,
                scale: 20
            }, {
                indx: 0,
                layer: 0,
                src: "bullet_1",
                dmg: 50,
                speed: 3.6,
                scale: 160,
                range: 1400
            }], t.weapons = [{
                id: 0,
                type: 0,
                name: "tool hammer",
                desc: "tool for gathering all resources",
                src: "hammer_1",
                length: 140,
                width: 140,
                xOff: -3,
                yOff: 18,
                dmg: 25,
                range: 65,
                gather: 1,
                speed: 300,
                count: 3
            }, {
                id: 1,
                type: 0,
                age: 2,
                name: "hand axe",
                desc: "gathers resources at a higher rate",
                src: "axe_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 30,
                spdMult: 1,
                range: 70,
                gather: 2,
                speed: 400,
                count: 4
            }, {
                id: 2,
                type: 0,
                age: 8,
                pre: 1,
                name: "great axe",
                desc: "deal more damage and gather more resources",
                src: "great_axe_1",
                length: 140,
                width: 140,
                xOff: -8,
                yOff: 25,
                dmg: 35,
                spdMult: 1,
                range: 75,
                gather: 4,
                speed: 400,
                count: 4
            }, {
                id: 3,
                type: 0,
                age: 2,
                name: "short sword",
                desc: "increased attack power but slower move speed",
                src: "sword_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 46,
                dmg: 35,
                spdMult: .85,
                range: 110,
                gather: 1,
                speed: 300,
                count: 3
            }, {
                id: 4,
                type: 0,
                age: 8,
                pre: 3,
                name: "katana",
                desc: "greater range and damage",
                src: "samurai_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 59,
                dmg: 40,
                spdMult: .8,
                range: 118,
                gather: 1,
                speed: 300,
                count: 3
            }, {
                id: 5,
                type: 0,
                age: 2,
                name: "polearm",
                desc: "long range melee weapon",
                src: "spear_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 45,
                knock: .2,
                spdMult: .82,
                range: 142,
                gather: 1,
                speed: 700,
                count: 7
            }, {
                id: 6,
                type: 0,
                age: 2,
                name: "bat",
                desc: "fast long range melee weapon",
                src: "bat_1",
                iPad: 1.3,
                length: 110,
                width: 180,
                xOff: -8,
                yOff: 53,
                dmg: 20,
                knock: .7,
                range: 110,
                gather: 1,
                speed: 300,
                count: 3
            }, {
                id: 7,
                type: 0,
                age: 2,
                name: "daggers",
                desc: "really fast short range weapon",
                src: "dagger_1",
                iPad: .8,
                length: 110,
                width: 110,
                xOff: 18,
                yOff: 0,
                dmg: 20,
                knock: .1,
                range: 65,
                gather: 1,
                hitSlow: .1,
                spdMult: 1.13,
                speed: 100,
                count: 1
            }, {
                id: 8,
                type: 0,
                age: 2,
                name: "stick",
                desc: "great for gathering but very weak",
                src: "stick_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 1,
                spdMult: 1,
                range: 70,
                gather: 7,
                speed: 400,
                count: 4
            }, {
                id: 9,
                type: 1,
                age: 6,
                name: "hunting bow",
                desc: "bow used for ranged combat and hunting",
                src: "bow_1",
                req: ["wood", 4],
                length: 120,
                width: 120,
                xOff: -6,
                yOff: 0,
                Pdmg: 25,
                projectile: 0,
                spdMult: .75,
                speed: 600,
                count: 6
            }, {
                id: 10,
                type: 1,
                age: 6,
                name: "great hammer",
                desc: "hammer used for destroying structures",
                src: "great_hammer_1",
                length: 140,
                width: 140,
                xOff: -9,
                yOff: 25,
                dmg: 10,
                spdMult: .88,
                range: 75,
                sDmg: 7.5,
                gather: 1,
                speed: 400,
                count: 4
            }, {
                id: 11,
                type: 1,
                age: 6,
                name: "wooden shield",
                desc: "blocks projectiles and reduces melee damage",
                src: "shield_1",
                length: 120,
                width: 120,
                shield: .2,
                xOff: 6,
                yOff: 0,
                Pdmg: 0,
                spdMult: .7
            }, {
                id: 12,
                type: 1,
                age: 8,
                pre: 9,
                name: "crossbow",
                desc: "deals more damage and has greater range",
                src: "crossbow_1",
                req: ["wood", 5],
                aboveHand: !0,
                armS: .75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                Pdmg: 35,
                projectile: 2,
                spdMult: .7,
                speed: 700,
                count: 7
            }, {
                id: 13,
                type: 1,
                age: 9,
                pre: 12,
                name: "repeater crossbow",
                desc: "high firerate crossbow with reduced damage",
                src: "crossbow_2",
                req: ["wood", 10],
                aboveHand: !0,
                armS: .75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                Pdmg: 30,
                projectile: 3,
                spdMult: .7,
                speed: 230,
                count: 3
            }, {
                id: 14,
                type: 1,
                age: 6,
                name: "mc grabby",
                desc: "steals resources from enemies",
                src: "grab_1",
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 0,
                steal: 250,
                knock: .2,
                spdMult: 1.05,
                range: 125,
                gather: 0,
                speed: 700,
                count: 7
            }, {
                id: 15,
                type: 1,
                age: 9,
                pre: 12,
                name: "musket",
                desc: "slow firerate but high damage and range",
                src: "musket_1",
                req: ["stone", 10],
                aboveHand: !0,
                rec: .35,
                armS: .6,
                hndS: .3,
                hndD: 1.6,
                length: 205,
                width: 205,
                xOff: 25,
                yOff: 0,
                Pdmg: 50,
                projectile: 5,
                hideProjectile: !0,
                spdMult: .6,
                speed: 1500,
                count: 15
            }], e.exports.list = [{
                group: e.exports.groups[0],
                name: "apple",
                desc: "restores 20 health when consumed",
                req: ["food", 10],
                consume: function (e) {
                    return e.changeHealth(20, e)
                },
                scale: 22,
                holdOffset: 15
            }, {
                age: 3,
                group: e.exports.groups[0],
                name: "cookie",
                desc: "restores 40 health when consumed",
                req: ["food", 15],
                consume: function (e) {
                    return e.changeHealth(40, e)
                },
                scale: 27,
                holdOffset: 15
            }, {
                age: 7,
                group: e.exports.groups[0],
                name: "cheese",
                desc: "restores 30 health and another 50 over 5 seconds",
                req: ["food", 25],
                consume: function (e) {
                    return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0)
                },
                scale: 27,
                holdOffset: 15
            }, {
                group: e.exports.groups[1],
                name: "wood wall",
                desc: "provides protection for your village",
                req: ["wood", 10],
                projDmg: !0,
                health: 380,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 3,
                group: e.exports.groups[1],
                name: "stone wall",
                desc: "provides improved protection for your village",
                req: ["stone", 25],
                health: 900,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[1],
                name: "castle wall",
                desc: "provides powerful protection for your village",
                req: ["stone", 35],
                health: 1500,
                scale: 52,
                holdOffset: 20,
                placeOffset: -5
            }, {
                group: e.exports.groups[2],
                name: "spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 20, "stone", 5],
                health: 400,
                dmg: 20,
                scale: 49,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 5,
                group: e.exports.groups[2],
                name: "greater spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 10],
                health: 500,
                dmg: 35,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 9,
                group: e.exports.groups[2],
                name: "poison spikes",
                desc: "poisons enemies when they touch them",
                req: ["wood", 35, "stone", 15],
                health: 600,
                dmg: 30,
                pDmg: 5,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 9,
                group: e.exports.groups[2],
                name: "spinning spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 20],
                health: 500,
                dmg: 45,
                turnSpeed: .003,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                group: e.exports.groups[3],
                name: "windmill",
                desc: "generates gold over time",
                req: ["wood", 50, "stone", 10],
                health: 400,
                pps: 1,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 45,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 5,
                group: e.exports.groups[3],
                name: "faster windmill",
                desc: "generates more gold over time",
                req: ["wood", 60, "stone", 20],
                health: 500,
                pps: 1.5,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 8,
                group: e.exports.groups[3],
                name: "power mill",
                desc: "generates more gold over time",
                req: ["wood", 100, "stone", 50],
                health: 800,
                pps: 2,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 5,
                group: e.exports.groups[4],
                type: 2,
                name: "mine",
                desc: "allows you to mine stone",
                req: ["wood", 20, "stone", 100],
                iconLineMult: 12,
                scale: 65,
                holdOffset: 20,
                placeOffset: 0
            }, {
                age: 5,
                group: e.exports.groups[11],
                type: 0,
                name: "sapling",
                desc: "allows you to farm wood",
                req: ["wood", 150],
                iconLineMult: 12,
                colDiv: .5,
                scale: 110,
                holdOffset: 50,
                placeOffset: -15
            }, {
                age: 4,
                group: e.exports.groups[5],
                name: "pit trap",
                desc: "pit that traps enemies if they walk over it",
                req: ["wood", 30, "stone", 30],
                trap: !0,
                ignoreCollision: !0,
                hideFromEnemy: !0,
                health: 500,
                colDiv: .2,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 4,
                group: e.exports.groups[6],
                name: "boost pad",
                desc: "provides boost when stepped on",
                req: ["stone", 20, "wood", 5],
                ignoreCollision: !0,
                boostSpeed: 1.5,
                health: 150,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[7],
                doUpdate: !0,
                name: "turret",
                desc: "defensive structure that shoots at enemies",
                req: ["wood", 200, "stone", 150],
                health: 800,
                projectile: 1,
                shootRange: 700,
                shootRate: 2200,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[8],
                name: "platform",
                desc: "platform to shoot over walls and cross over water",
                req: ["wood", 20],
                ignoreCollision: !0,
                zIndex: 1,
                health: 300,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[9],
                name: "healing pad",
                desc: "standing on it will slowly heal you",
                req: ["wood", 30, "food", 10],
                ignoreCollision: !0,
                healCol: 15,
                health: 400,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 9,
                group: e.exports.groups[10],
                name: "spawn pad",
                desc: "you will spawn here when you die but it will dissapear",
                req: ["wood", 100, "stone", 100],
                health: 400,
                ignoreCollision: !0,
                spawnPoint: !0,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[12],
                name: "blocker",
                desc: "blocks building in radius",
                req: ["wood", 30, "stone", 25],
                ignoreCollision: !0,
                blocker: 300,
                health: 400,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: e.exports.groups[13],
                name: "teleporter",
                desc: "teleports you to a random point on the map",
                req: ["wood", 60, "stone", 60],
                ignoreCollision: !0,
                teleport: !0,
                health: 200,
                colDiv: .7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }];
            for (var n = 0; n < e.exports.list.length; ++n) e.exports.list[n].id = n, e.exports.list[n].pre && (e.exports.list[n].pre = n - e.exports.list[n].pre);
            if ("undefined" != typeof window);
        },
    "./src/js/data/mapManager.js":
        /*!***********************************!*\
          !*** ./src/js/data/mapManager.js ***!
          \***********************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = {}
        },
    "./src/js/data/objectManager.js":
        /*!**************************************!*\
          !*** ./src/js/data/objectManager.js ***!
          \**************************************/
        /*! no static exports found */
        function (e, t) {
            var n = Math.floor,
                i = Math.abs,
                s = Math.cos,
                a = Math.sin,
                r = (Math.pow, Math.sqrt);
            e.exports = function (e, t, o, l, c, h) {
                var u, d;
                this.objects = t, this.grids = {}, this.updateObjects = [];
                var f = l.mapScale / l.colGrid;
                this.setObjectGrids = function (e) {
                    for (var t = Math.min(l.mapScale, Math.max(0, e.x)), n = Math.min(l.mapScale, Math.max(0, e.y)), i = 0; i < l.colGrid; ++i) {
                        u = i * f;
                        for (var s = 0; s < l.colGrid; ++s) d = s * f, t + e.scale >= u && t - e.scale <= u + f && n + e.scale >= d && n - e.scale <= d + f && (this.grids[i + "_" + s] || (this.grids[i + "_" + s] = []), this.grids[i + "_" + s].push(e), e.gridLocations.push(i + "_" + s))
                    }
                }, this.removeObjGrid = function (e) {
                    for (var t, n = 0; n < e.gridLocations.length; ++n)(t = this.grids[e.gridLocations[n]].indexOf(e)) >= 0 && this.grids[e.gridLocations[n]].splice(t, 1)
                }, this.disableObj = function (e) {
                    if (e.active = !1, h) {
                        e.owner && e.pps && (e.owner.pps -= e.pps), this.removeObjGrid(e);
                        var t = this.updateObjects.indexOf(e);
                        t >= 0 && this.updateObjects.splice(t, 1)
                    }
                }, this.hitObj = function (e, t) {
                    for (var n = 0; n < c.length; ++n) c[n].active && (e.sentTo[c[n].id] && (e.active ? c[n].canSee(e) && h.send(c[n].id, "8", o.fixTo(t, 1), e.sid) : h.send(c[n].id, "12", e.sid)), e.active || e.owner != c[n] || c[n].changeItemCount(e.group.id, -1))
                };
                var p, m, g = [];
                this.getGridArrays = function (e, t, i) {
                    u = n(e / f), d = n(t / f), g.length = 0;
                    try {
                        this.grids[u + "_" + d] && g.push(this.grids[u + "_" + d]), e + i >= (u + 1) * f && ((p = this.grids[u + 1 + "_" + d]) && g.push(p), d && t - i <= d * f ? (p = this.grids[u + 1 + "_" + (d - 1)]) && g.push(p) : t + i >= (d + 1) * f && (p = this.grids[u + 1 + "_" + (d + 1)]) && g.push(p)), u && e - i <= u * f && ((p = this.grids[u - 1 + "_" + d]) && g.push(p), d && t - i <= d * f ? (p = this.grids[u - 1 + "_" + (d - 1)]) && g.push(p) : t + i >= (d + 1) * f && (p = this.grids[u - 1 + "_" + (d + 1)]) && g.push(p)), t + i >= (d + 1) * f && (p = this.grids[u + "_" + (d + 1)]) && g.push(p), d && t - i <= d * f && (p = this.grids[u + "_" + (d - 1)]) && g.push(p)
                    } catch (e) {}
                    return g
                }, this.add = function (n, i, s, a, r, o, l, c, u) {
                    m = null;
                    for (var d = 0; d < t.length; ++d)
                        if (t[d].sid == n) {
                            m = t[d];
                            break
                        } if (!m)
                        for (d = 0; d < t.length; ++d)
                            if (!t[d].active) {
                                m = t[d];
                                break
                            } m || (m = new e(n), t.push(m)), c && (m.sid = n), m.init(i, s, a, r, o, l, u), h && (this.setObjectGrids(m), m.doUpdate && this.updateObjects.push(m))
                }, this.disableBySid = function (e) {
                    for (var n = 0; n < t.length; ++n)
                        if (t[n].sid == e) {
                            this.disableObj(t[n]);
                            break
                        }
                }, this.removeAllItems = function (e, n) {
                    for (var i = 0; i < t.length; ++i) t[i].active && t[i].owner && t[i].owner.sid == e && this.disableObj(t[i]);
                    n && n.broadcast("13", e)
                }, this.fetchSpawnObj = function (e) {
                    for (var n = null, i = 0; i < t.length; ++i)
                        if ((m = t[i]).active && m.owner && m.owner.sid == e && m.spawnPoint) {
                            n = [m.x, m.y], this.disableObj(m), h.broadcast("12", m.sid), m.owner && m.owner.changeItemCount(m.group.id, -1);
                            break
                        } return n
                }, this.checkItemLocation = function (e, n, i, s, a, r, c) {
                    for (var h = 0; h < t.length; ++h) {
                        var u = t[h].blocker ? t[h].blocker : t[h].getScale(s, t[h].isItem);
                        if (t[h].active && o.getDistance(e, n, t[h].x, t[h].y) < i + u) return !1
                    }
                    return !(!r && 18 != a && n >= l.mapScale / 2 - l.riverWidth / 2 && n <= l.mapScale / 2 + l.riverWidth / 2)
                }, this.addProjectile = function (e, t, n, i, s) {
                    for (var a, r = items.projectiles[s], l = 0; l < projectiles.length; ++l)
                        if (!projectiles[l].active) {
                            a = projectiles[l];
                            break
                        } a || (a = new Projectile(c, o), projectiles.push(a)), a.init(s, e, t, n, r.speed, i, r.scale)
                }, this.checkCollision = function (e, t, n) {
                    n = n || 1;
                    var c = e.x - t.x,
                        h = e.y - t.y,
                        u = e.scale + t.scale;
                    if (i(c) <= u || i(h) <= u) {
                        u = e.scale + (t.getScale ? t.getScale() : t.scale);
                        var d = r(c * c + h * h) - u;
                        if (d <= 0) {
                            if (t.ignoreCollision) !t.trap || e.noTrap || t.owner == e || t.owner && t.owner.team && t.owner.team == e.team ? t.boostSpeed ? (e.xVel += n * t.boostSpeed * (t.weightM || 1) * s(t.dir), e.yVel += n * t.boostSpeed * (t.weightM || 1) * a(t.dir)) : t.healCol ? e.healCol = t.healCol : t.teleport && (e.x = o.randInt(0, l.mapScale), e.y = o.randInt(0, l.mapScale)) : (e.lockMove = !0, t.hideFromEnemy = !1);
                            else {
                                var f = o.getDirection(e.x, e.y, t.x, t.y);
                                o.getDistance(e.x, e.y, t.x, t.y);
                                if (t.isPlayer ? (d = -1 * d / 2, e.x += d * s(f), e.y += d * a(f), t.x -= d * s(f), t.y -= d * a(f)) : (e.x = t.x + u * s(f), e.y = t.y + u * a(f), e.xVel *= .75, e.yVel *= .75), t.dmg && t.owner != e && (!t.owner || !t.owner.team || t.owner.team != e.team)) {
                                    e.changeHealth(-t.dmg, t.owner, t);
                                    var p = 1.5 * (t.weightM || 1);
                                    e.xVel += p * s(f), e.yVel += p * a(f), !t.pDmg || e.skin && e.skin.poisonRes || (e.dmgOverTime.dmg = t.pDmg, e.dmgOverTime.time = 5, e.dmgOverTime.doer = t.owner), e.colDmg && t.health && (t.changeHealth(-e.colDmg) && this.disableObj(t), this.hitObj(t, o.getDirection(e.x, e.y, t.x, t.y)))
                                }
                            }
                            return t.zIndex > e.zIndex && (e.zIndex = t.zIndex), !0
                        }
                    }
                    return !1
                }
            }
        },
    "./src/js/data/player.js":
        /*!*******************************!*\
          !*** ./src/js/data/player.js ***!
          \*******************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = new(n( /*! bad-words */ "./node_modules/bad-words/lib/badwords.js"));
            i.addWords("jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa");
            var s = Math.abs,
                a = Math.cos,
                r = Math.sin,
                o = Math.pow,
                l = Math.sqrt;
            e.exports = function (e, t, n, c, h, u, d, f, p, m, g, y, k, w) {
                this.id = e, this.sid = t, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
                for (var b = 0; b < g.length; ++b) g[b].price <= 0 && (this.tails[g[b].id] = 1);
                this.skins = {};
                for (b = 0; b < m.length; ++b) m[b].price <= 0 && (this.skins[m[b].id] = 1);
                this.points = 0, this.dt = 0, this.hidden = !1, this.itemCounts = {}, this.isPlayer = !0, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.skinColor = 0, this.spawn = function (e) {
                    this.active = !0, this.alive = !0, this.lockMove = !1, this.lockDir = !1, this.minimapCounter = 0, this.chatCountdown = 0, this.shameCount = 0, this.shameTimer = 0, this.sentTo = {}, this.gathering = 0, this.autoGather = 0, this.animTime = 0, this.animSpeed = 0, this.mouseState = 0, this.buildIndex = -1, this.weaponIndex = 0, this.dmgOverTime = {}, this.noMovTimer = 0, this.maxXP = 300, this.XP = 0, this.age = 1, this.kills = 0, this.upgrAge = 2, this.upgradePoints = 0, this.x = 0, this.y = 0, this.zIndex = 0, this.xVel = 0, this.yVel = 0, this.slowMult = 1, this.dir = 0, this.dirPlus = 0, this.targetDir = 0, this.targetAngle = 0, this.maxHealth = 100, this.health = this.maxHealth, this.scale = n.playerScale, this.speed = n.playerSpeed, this.resetMoveDir(), this.resetResources(e), this.items = [0, 3, 6, 10], this.weapons = [0], this.shootCount = 0, this.weaponXP = [], this.reloads = {}
                }, this.resetMoveDir = function () {
                    this.moveDir = void 0
                }, this.resetResources = function (e) {
                    for (var t = 0; t < n.resourceTypes.length; ++t) this[n.resourceTypes[t]] = e ? 100 : 0
                }, this.addItem = function (e) {
                    var t = p.list[e];
                    if (t) {
                        for (var n = 0; n < this.items.length; ++n)
                            if (p.list[this.items[n]].group == t.group) return this.buildIndex == this.items[n] && (this.buildIndex = e), this.items[n] = e, !0;
                        return this.items.push(e), !0
                    }
                    return !1
                }, this.setUserData = function (e) {
                    if (e) {
                        this.name = "unknown";
                        var t = e.name + "",
                            s = !1,
                            a = (t = (t = (t = (t = t.slice(0, n.maxNameLength)).replace(/[^\w:\(\)\/? -]+/gim, " ")).replace(/[^\x00-\x7F]/g, " ")).trim()).toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                        for (var r of i.list)
                            if (-1 != a.indexOf(r)) {
                                s = !0;
                                break
                            } t.length > 0 && !s && (this.name = t), this.skinColor = 0, n.skinColors[e.skin] && (this.skinColor = e.skin)
                    }
                }, this.getData = function () {
                    return [this.id, this.sid, this.name, c.fixTo(this.x, 2), c.fixTo(this.y, 2), c.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor]
                }, this.setData = function (e) {
                    this.id = e[0], this.sid = e[1], this.name = e[2], this.x = e[3], this.y = e[4], this.dir = e[5], this.health = e[6], this.maxHealth = e[7], this.scale = e[8], this.skinColor = e[9]
                };
                var v = 0;
                this.update = function (e) {
                    if (this.alive) {
                        if (this.shameTimer > 0 && (this.shameTimer -= e, this.shameTimer <= 0 && (this.shameTimer = 0, this.shameCount = 0)), (v -= e) <= 0) {
                            var t = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
                            t && this.changeHealth(t, this), this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), this.healCol && this.changeHealth(this.healCol, this), v = 1e3
                        }
                        if (this.alive) {
                            if (this.slowMult < 1 && (this.slowMult += 8e-4 * e, this.slowMult > 1 && (this.slowMult = 1)), this.noMovTimer += e, (this.xVel || this.yVel) && (this.noMovTimer = 0), this.lockMove) this.xVel = 0, this.yVel = 0;
                            else {
                                var i = (this.buildIndex >= 0 ? .5 : 1) * (p.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= n.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : n.snowSpeed : 1) * this.slowMult;
                                !this.zIndex && this.y >= n.mapScale / 2 - n.riverWidth / 2 && this.y <= n.mapScale / 2 + n.riverWidth / 2 && (this.skin && this.skin.watrImm ? (i *= .75, this.xVel += .4 * n.waterCurrent * e) : (i *= .33, this.xVel += n.waterCurrent * e));
                                var s = null != this.moveDir ? a(this.moveDir) : 0,
                                    f = null != this.moveDir ? r(this.moveDir) : 0,
                                    m = l(s * s + f * f);
                                0 != m && (s /= m, f /= m), s && (this.xVel += s * this.speed * i * e), f && (this.yVel += f * this.speed * i * e)
                            }
                            var g;
                            this.zIndex = 0, this.lockMove = !1, this.healCol = 0;
                            for (var y = c.getDistance(0, 0, this.xVel * e, this.yVel * e), k = Math.min(4, Math.max(1, Math.round(y / 40))), w = 1 / k, b = 0; b < k; ++b) {
                                this.xVel && (this.x += this.xVel * e * w), this.yVel && (this.y += this.yVel * e * w), g = u.getGridArrays(this.x, this.y, this.scale);
                                for (var x = 0; x < g.length; ++x)
                                    for (var S = 0; S < g[x].length; ++S) g[x][S].active && u.checkCollision(this, g[x][S], w)
                            }
                            for (b = (T = d.indexOf(this)) + 1; b < d.length; ++b) d[b] != this && d[b].alive && u.checkCollision(this, d[b]);
                            if (this.xVel && (this.xVel *= o(n.playerDecel, e), this.xVel <= .01 && this.xVel >= -.01 && (this.xVel = 0)), this.yVel && (this.yVel *= o(n.playerDecel, e), this.yVel <= .01 && this.yVel >= -.01 && (this.yVel = 0)), this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > n.mapScale && (this.x = n.mapScale - this.scale), this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > n.mapScale && (this.y = n.mapScale - this.scale), this.buildIndex < 0)
                                if (this.reloads[this.weaponIndex] > 0) this.reloads[this.weaponIndex] -= e, this.gathering = this.mouseState;
                                else if (this.gathering || this.autoGather) {
                                var I = !0;
                                if (null != p.weapons[this.weaponIndex].gather) this.gather(d);
                                else if (null != p.weapons[this.weaponIndex].projectile && this.hasRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                                    this.useRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0), this.noMovTimer = 0;
                                    var T = p.weapons[this.weaponIndex].projectile,
                                        M = 2 * this.scale,
                                        j = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                                    p.weapons[this.weaponIndex].rec && (this.xVel -= p.weapons[this.weaponIndex].rec * a(this.dir), this.yVel -= p.weapons[this.weaponIndex].rec * r(this.dir)), h.addProjectile(this.x + M * a(this.dir), this.y + M * r(this.dir), this.dir, p.projectiles[T].range * j, p.projectiles[T].speed * j, T, this, null, this.zIndex)
                                } else I = !1;
                                this.gathering = this.mouseState, I && (this.reloads[this.weaponIndex] = p.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1))
                            }
                        }
                    }
                }, this.addWeaponXP = function (e) {
                    this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += e
                }, this.earnXP = function (e) {
                    this.age < n.maxAge && (this.XP += e, this.XP >= this.maxXP ? (this.age < n.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, y.send(this.id, "16", this.upgradePoints, this.upgrAge), y.send(this.id, "15", this.XP, c.fixTo(this.maxXP, 1), this.age)) : y.send(this.id, "15", this.XP))
                }, this.changeHealth = function (e, t) {
                    if (e > 0 && this.health >= this.maxHealth) return !1;
                    e < 0 && this.skin && (e *= this.skin.dmgMult || 1), e < 0 && this.tail && (e *= this.tail.dmgMult || 1), e < 0 && (this.hitTime = Date.now()), this.health += e, this.health > this.maxHealth && (e -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(t);
                    for (var n = 0; n < d.length; ++n) this.sentTo[d[n].id] && y.send(d[n].id, "h", this.sid, this.health);
                    return !t || !t.canSee(this) || t == this && e < 0 || y.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), !0
                }, this.kill = function (e) {
                    e && e.alive && (e.kills++, e.skin && e.skin.goldSteal ? k(e, Math.round(this.points / 2)) : k(e, Math.round(100 * this.age * (e.skin && e.skin.kScrM ? e.skin.kScrM : 1))), y.send(e.id, "9", "kills", e.kills, 1)), this.alive = !1, y.send(this.id, "11"), w()
                }, this.addResource = function (e, t, i) {
                    !i && t > 0 && this.addWeaponXP(t), 3 == e ? k(this, t, !0) : (this[n.resourceTypes[e]] += t, y.send(this.id, "9", n.resourceTypes[e], this[n.resourceTypes[e]], 1))
                }, this.changeItemCount = function (e, t) {
                    this.itemCounts[e] = this.itemCounts[e] || 0, this.itemCounts[e] += t, y.send(this.id, "14", e, this.itemCounts[e])
                }, this.buildItem = function (e) {
                    var t = this.scale + e.scale + (e.placeOffset || 0),
                        n = this.x + t * a(this.dir),
                        i = this.y + t * r(this.dir);
                    if (this.canBuild(e) && !(e.consume && this.skin && this.skin.noEat) && (e.consume || u.checkItemLocation(n, i, e.scale, .6, e.id, !1, this))) {
                        var s = !1;
                        if (e.consume) {
                            if (this.hitTime) {
                                var o = Date.now() - this.hitTime;
                                this.hitTime = 0, o <= 120 ? (this.shameCount++, this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount -= 2, this.shameCount <= 0 && (this.shameCount = 0))
                            }
                            this.shameTimer <= 0 && (s = e.consume(this))
                        } else s = !0, e.group.limit && this.changeItemCount(e.group.id, 1), e.pps && (this.pps += e.pps), u.add(u.objects.length, n, i, this.dir, e.scale, e.type, e, !1, this);
                        s && (this.useRes(e), this.buildIndex = -1)
                    }
                }, this.hasRes = function (e, t) {
                    for (var n = 0; n < e.req.length;) {
                        if (this[e.req[n]] < Math.round(e.req[n + 1] * (t || 1))) return !1;
                        n += 2
                    }
                    return !0
                }, this.useRes = function (e, t) {
                    if (!n.inSandbox)
                        for (var i = 0; i < e.req.length;) this.addResource(n.resourceTypes.indexOf(e.req[i]), -Math.round(e.req[i + 1] * (t || 1))), i += 2
                }, this.canBuild = function (e) {
                    return !!n.inSandbox || !(e.group.limit && this.itemCounts[e.group.id] >= e.group.limit) && this.hasRes(e)
                }, this.gather = function () {
                    this.noMovTimer = 0, this.slowMult -= p.weapons[this.weaponIndex].hitSlow || .3, this.slowMult < 0 && (this.slowMult = 0);
                    for (var e, t, i, s = n.fetchVariant(this), o = s.poison, l = s.val, h = {}, m = u.getGridArrays(this.x, this.y, p.weapons[this.weaponIndex].range), g = 0; g < m.length; ++g)
                        for (var y = 0; y < m[g].length; ++y)
                            if ((t = m[g][y]).active && !t.dontGather && !h[t.sid] && t.visibleToPlayer(this) && c.getDistance(this.x, this.y, t.x, t.y) - t.scale <= p.weapons[this.weaponIndex].range && (e = c.getDirection(t.x, t.y, this.x, this.y), c.getAngleDist(e, this.dir) <= n.gatherAngle)) {
                                if (h[t.sid] = 1, t.health) {
                                    if (t.changeHealth(-p.weapons[this.weaponIndex].dmg * l * (p.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
                                        for (var k = 0; k < t.req.length;) this.addResource(n.resourceTypes.indexOf(t.req[k]), t.req[k + 1]), k += 2;
                                        u.disableObj(t)
                                    }
                                } else {
                                    this.earnXP(4 * p.weapons[this.weaponIndex].gather);
                                    var w = p.weapons[this.weaponIndex].gather + (3 == t.type ? 4 : 0);
                                    this.skin && this.skin.extraGold && this.addResource(3, 1), this.addResource(t.type, w)
                                }
                                i = !0, u.hitObj(t, e)
                            } for (y = 0; y < d.length + f.length; ++y)
                        if ((t = d[y] || f[y - d.length]) != this && t.alive && (!t.team || t.team != this.team) && c.getDistance(this.x, this.y, t.x, t.y) - 1.8 * t.scale <= p.weapons[this.weaponIndex].range && (e = c.getDirection(t.x, t.y, this.x, this.y), c.getAngleDist(e, this.dir) <= n.gatherAngle)) {
                            var b = p.weapons[this.weaponIndex].steal;
                            b && t.addResource && (b = Math.min(t.points || 0, b), this.addResource(3, b), t.addResource(3, -b));
                            var v = l;
                            null != t.weaponIndex && p.weapons[t.weaponIndex].shield && c.getAngleDist(e + Math.PI, t.dir) <= n.shieldAngle && (v = p.weapons[t.weaponIndex].shield);
                            var x = p.weapons[this.weaponIndex].dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1),
                                S = .3 * (t.weightM || 1) + (p.weapons[this.weaponIndex].knock || 0);
                            t.xVel += S * a(e), t.yVel += S * r(e), this.skin && this.skin.healD && this.changeHealth(x * v * this.skin.healD, this), this.tail && this.tail.healD && this.changeHealth(x * v * this.tail.healD, this), t.skin && t.skin.dmg && 1 == v && this.changeHealth(-x * t.skin.dmg, t), t.tail && t.tail.dmg && 1 == v && this.changeHealth(-x * t.tail.dmg, t), !(t.dmgOverTime && this.skin && this.skin.poisonDmg) || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = this.skin.poisonDmg, t.dmgOverTime.time = this.skin.poisonTime || 1, t.dmgOverTime.doer = this), !t.dmgOverTime || !o || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = 5, t.dmgOverTime.time = 5, t.dmgOverTime.doer = this), t.skin && t.skin.dmgK && (this.xVel -= t.skin.dmgK * a(e), this.yVel -= t.skin.dmgK * r(e)), t.changeHealth(-x * v, this, this)
                        } this.sendAnimation(i ? 1 : 0)
                }, this.sendAnimation = function (e) {
                    for (var t = 0; t < d.length; ++t) this.sentTo[d[t].id] && this.canSee(d[t]) && y.send(d[t].id, "7", this.sid, e ? 1 : 0, this.weaponIndex)
                };
                var x = 0,
                    S = 0;
                this.animate = function (e) {
                    this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, x = 0, S = 0) : 0 == S ? (x += e / (this.animSpeed * n.hitReturnRatio), this.dirPlus = c.lerp(0, this.targetAngle, Math.min(1, x)), x >= 1 && (x = 1, S = 1)) : (x -= e / (this.animSpeed * (1 - n.hitReturnRatio)), this.dirPlus = c.lerp(0, this.targetAngle, Math.max(0, x))))
                }, this.startAnim = function (e, t) {
                    this.animTime = this.animSpeed = p.weapons[t].speed, this.targetAngle = e ? -n.hitAngle : -Math.PI, x = 0, S = 0
                }, this.canSee = function (e) {
                    if (!e) return !1;
                    if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
                    var t = s(e.x - this.x) - e.scale,
                        i = s(e.y - this.y) - e.scale;
                    return t <= n.maxScreenWidth / 2 * 1.3 && i <= n.maxScreenHeight / 2 * 1.3
                }
            }
        },
    "./src/js/data/projectile.js":
        /*!***********************************!*\
          !*** ./src/js/data/projectile.js ***!
          \***********************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = function (e, t, n, i, s, a, r) {
                this.init = function (e, t, n, i, s, a, o, l, c) {
                    this.active = !0, this.indx = e, this.x = t, this.y = n, this.dir = i, this.skipMov = !0, this.speed = s, this.dmg = a, this.scale = l, this.range = o, this.owner = c, r && (this.sentTo = {})
                };
                var o, l = [];
                this.update = function (c) {
                    if (this.active) {
                        var h, u = this.speed * c;
                        if (this.skipMov ? this.skipMov = !1 : (this.x += u * Math.cos(this.dir), this.y += u * Math.sin(this.dir), this.range -= u, this.range <= 0 && (this.x += this.range * Math.cos(this.dir), this.y += this.range * Math.sin(this.dir), u = 1, this.range = 0, this.active = !1)), r) {
                            for (var d = 0; d < e.length; ++d) !this.sentTo[e[d].id] && e[d].canSee(this) && (this.sentTo[e[d].id] = 1, r.send(e[d].id, "18", a.fixTo(this.x, 1), a.fixTo(this.y, 1), a.fixTo(this.dir, 2), a.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
                            l.length = 0;
                            for (d = 0; d < e.length + t.length; ++d) !(o = e[d] || t[d - e.length]).alive || o == this.owner || this.owner.team && o.team == this.owner.team || a.lineInRect(o.x - o.scale, o.y - o.scale, o.x + o.scale, o.y + o.scale, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && l.push(o);
                            for (var f = n.getGridArrays(this.x, this.y, this.scale), p = 0; p < f.length; ++p)
                                for (var m = 0; m < f[p].length; ++m) h = (o = f[p][m]).getScale(), o.active && this.ignoreObj != o.sid && this.layer <= o.layer && l.indexOf(o) < 0 && !o.ignoreCollision && a.lineInRect(o.x - h, o.y - h, o.x + h, o.y + h, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && l.push(o);
                            if (l.length > 0) {
                                var g = null,
                                    y = null,
                                    k = null;
                                for (d = 0; d < l.length; ++d) k = a.getDistance(this.x, this.y, l[d].x, l[d].y), (null == y || k < y) && (y = k, g = l[d]);
                                if (g.isPlayer || g.isAI) {
                                    var w = .3 * (g.weightM || 1);
                                    g.xVel += w * Math.cos(this.dir), g.yVel += w * Math.sin(this.dir), null != g.weaponIndex && i.weapons[g.weaponIndex].shield && a.getAngleDist(this.dir + Math.PI, g.dir) <= s.shieldAngle || g.changeHealth(-this.dmg, this.owner, this.owner)
                                } else {
                                    g.projDmg && g.health && g.changeHealth(-this.dmg) && n.disableObj(g);
                                    for (d = 0; d < e.length; ++d) e[d].active && (g.sentTo[e[d].id] && (g.active ? e[d].canSee(g) && r.send(e[d].id, "8", a.fixTo(this.dir, 2), g.sid) : r.send(e[d].id, "12", g.sid)), g.active || g.owner != e[d] || e[d].changeItemCount(g.group.id, -1))
                                }
                                this.active = !1;
                                for (d = 0; d < e.length; ++d) this.sentTo[e[d].id] && r.send(e[d].id, "19", this.sid, a.fixTo(y, 1))
                            }
                        }
                    }
                }
            }
        },
    "./src/js/data/projectileManager.js":
        /*!******************************************!*\
          !*** ./src/js/data/projectileManager.js ***!
          \******************************************/
        /*! no static exports found */
        function (e, t) {
            e.exports = function (e, t, n, i, s, a, r, o, l) {
                this.addProjectile = function (c, h, u, d, f, p, m, g, y) {
                    for (var k, w = a.projectiles[p], b = 0; b < t.length; ++b)
                        if (!t[b].active) {
                            k = t[b];
                            break
                        } return k || ((k = new e(n, i, s, a, r, o, l)).sid = t.length, t.push(k)), k.init(p, c, h, u, f, w.dmg, d, w.scale, m), k.ignoreObj = g, k.layer = y || w.layer, k.src = w.src, k
                }
            }
        },
    "./src/js/data/store.js":
        /*!******************************!*\
          !*** ./src/js/data/store.js ***!
          \******************************/
        /*! no static exports found */
        function (e, t) {
            e.exports.hats = [{
                id: 45,
                name: "Shame!",
                dontSell: !0,
                price: 0,
                scale: 120,
                desc: "hacks are for losers"
            }, {
                id: 51,
                name: "Moo Cap",
                price: 0,
                scale: 120,
                desc: "coolest mooer around"
            }, {
                id: 50,
                name: "Apple Cap",
                price: 0,
                scale: 120,
                desc: "apple farms remembers"
            }, {
                id: 28,
                name: "Moo Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 29,
                name: "Pig Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 30,
                name: "Fluff Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 36,
                name: "Pandou Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 37,
                name: "Bear Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 38,
                name: "Monkey Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 44,
                name: "Polar Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 35,
                name: "Fez Hat",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 42,
                name: "Enigma Hat",
                price: 0,
                scale: 120,
                desc: "join the enigma army"
            }, {
                id: 43,
                name: "Blitz Hat",
                price: 0,
                scale: 120,
                desc: "hey everybody i'm blitz"
            }, {
                id: 49,
                name: "Bob XIII Hat",
                price: 0,
                scale: 120,
                desc: "like and subscribe"
            }, {
                id: 57,
                name: "Pumpkin",
                price: 50,
                scale: 120,
                desc: "Spooooky"
            }, {
                id: 8,
                name: "Bummle Hat",
                price: 100,
                scale: 120,
                desc: "no effect"
            }, {
                id: 2,
                name: "Straw Hat",
                price: 500,
                scale: 120,
                desc: "no effect"
            }, {
                id: 15,
                name: "Winter Cap",
                price: 600,
                scale: 120,
                desc: "allows you to move at normal speed in snow",
                coldM: 1
            }, {
                id: 5,
                name: "Cowboy Hat",
                price: 1e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 4,
                name: "Ranger Hat",
                price: 2e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 18,
                name: "Explorer Hat",
                price: 2e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 31,
                name: "Flipper Hat",
                price: 2500,
                scale: 120,
                desc: "have more control while in water",
                watrImm: !0
            }, {
                id: 1,
                name: "Marksman Cap",
                price: 3e3,
                scale: 120,
                desc: "increases arrow speed and range",
                aMlt: 1.3
            }, {
                id: 10,
                name: "Bush Gear",
                price: 3e3,
                scale: 160,
                desc: "allows you to disguise yourself as a bush"
            }, {
                id: 48,
                name: "Halo",
                price: 3e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 6,
                name: "Soldier Helmet",
                price: 4e3,
                scale: 120,
                desc: "reduces damage taken but slows movement",
                spdMult: .94,
                dmgMult: .75
            }, {
                id: 23,
                name: "Anti Venom Gear",
                price: 4e3,
                scale: 120,
                desc: "makes you immune to poison",
                poisonRes: 1
            }, {
                id: 13,
                name: "Medic Gear",
                price: 5e3,
                scale: 110,
                desc: "slowly regenerates health over time",
                healthRegen: 3
            }, {
                id: 9,
                name: "Miners Helmet",
                price: 5e3,
                scale: 120,
                desc: "earn 1 extra gold per resource",
                extraGold: 1
            }, {
                id: 32,
                name: "Musketeer Hat",
                price: 5e3,
                scale: 120,
                desc: "reduces cost of projectiles",
                projCost: .5
            }, {
                id: 7,
                name: "Bull Helmet",
                price: 6e3,
                scale: 120,
                desc: "increases damage done but drains health",
                healthRegen: -5,
                dmgMultO: 1.5,
                spdMult: .96
            }, {
                id: 22,
                name: "Emp Helmet",
                price: 6e3,
                scale: 120,
                desc: "turrets won't attack but you move slower",
                antiTurret: 1,
                spdMult: .7
            }, {
                id: 12,
                name: "Booster Hat",
                price: 6e3,
                scale: 120,
                desc: "increases your movement speed",
                spdMult: 1.16
            }, {
                id: 26,
                name: "Barbarian Armor",
                price: 8e3,
                scale: 120,
                desc: "knocks back enemies that attack you",
                dmgK: .6
            }, {
                id: 21,
                name: "Plague Mask",
                price: 1e4,
                scale: 120,
                desc: "melee attacks deal poison damage",
                poisonDmg: 5,
                poisonTime: 6
            }, {
                id: 46,
                name: "Bull Mask",
                price: 1e4,
                scale: 120,
                desc: "bulls won't target you unless you attack them",
                bullRepel: 1
            }, {
                id: 14,
                name: "Windmill Hat",
                topSprite: !0,
                price: 1e4,
                scale: 120,
                desc: "generates points while worn",
                pps: 1.5
            }, {
                id: 11,
                name: "Spike Gear",
                topSprite: !0,
                price: 1e4,
                scale: 120,
                desc: "deal damage to players that damage you",
                dmg: .45
            }, {
                id: 53,
                name: "Turret Gear",
                topSprite: !0,
                price: 1e4,
                scale: 120,
                desc: "you become a walking turret",
                turret: {
                    proj: 1,
                    range: 700,
                    rate: 2500
                },
                spdMult: .7
            }, {
                id: 20,
                name: "Samurai Armor",
                price: 12e3,
                scale: 120,
                desc: "increased attack speed and fire rate",
                atkSpd: .78
            }, {
                id: 58,
                name: "Dark Knight",
                price: 12e3,
                scale: 120,
                desc: "restores health when you deal damage",
                healD: .4
            }, {
                id: 27,
                name: "Scavenger Gear",
                price: 15e3,
                scale: 120,
                desc: "earn double points for each kill",
                kScrM: 2
            }, {
                id: 40,
                name: "Tank Gear",
                price: 15e3,
                scale: 120,
                desc: "increased damage to buildings but slower movement",
                spdMult: .3,
                bDmg: 3.3
            }, {
                id: 52,
                name: "Thief Gear",
                price: 15e3,
                scale: 120,
                desc: "steal half of a players gold when you kill them",
                goldSteal: .5
            }, {
                id: 55,
                name: "Bloodthirster",
                price: 2e4,
                scale: 120,
                desc: "Restore Health when dealing damage. And increased damage",
                healD: .25,
                dmgMultO: 1.2
            }, {
                id: 56,
                name: "Assassin Gear",
                price: 2e4,
                scale: 120,
                desc: "Go invisible when not moving. Can't eat. Increased speed",
                noEat: !0,
                spdMult: 1.1,
                invisTimer: 1e3
            }], e.exports.accessories = [{
                id: 12,
                name: "Snowball",
                price: 1e3,
                scale: 105,
                xOff: 18,
                desc: "no effect"
            }, {
                id: 9,
                name: "Tree Cape",
                price: 1e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 10,
                name: "Stone Cape",
                price: 1e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 3,
                name: "Cookie Cape",
                price: 1500,
                scale: 90,
                desc: "no effect"
            }, {
                id: 8,
                name: "Cow Cape",
                price: 2e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 11,
                name: "Monkey Tail",
                price: 2e3,
                scale: 97,
                xOff: 25,
                desc: "Super speed but reduced damage",
                spdMult: 1.35,
                dmgMultO: .2
            }, {
                id: 17,
                name: "Apple Basket",
                price: 3e3,
                scale: 80,
                xOff: 12,
                desc: "slowly regenerates health over time",
                healthRegen: 1
            }, {
                id: 6,
                name: "Winter Cape",
                price: 3e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 4,
                name: "Skull Cape",
                price: 4e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 5,
                name: "Dash Cape",
                price: 5e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 2,
                name: "Dragon Cape",
                price: 6e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 1,
                name: "Super Cape",
                price: 8e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 7,
                name: "Troll Cape",
                price: 8e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 14,
                name: "Thorns",
                price: 1e4,
                scale: 115,
                xOff: 20,
                desc: "no effect"
            }, {
                id: 15,
                name: "Blockades",
                price: 1e4,
                scale: 95,
                xOff: 15,
                desc: "no effect"
            }, {
                id: 20,
                name: "Devils Tail",
                price: 1e4,
                scale: 95,
                xOff: 20,
                desc: "no effect"
            }, {
                id: 16,
                name: "Sawblade",
                price: 12e3,
                scale: 90,
                spin: !0,
                xOff: 0,
                desc: "deal damage to players that damage you",
                dmg: .15
            }, {
                id: 13,
                name: "Angel Wings",
                price: 15e3,
                scale: 138,
                xOff: 22,
                desc: "slowly regenerates health over time",
                healthRegen: 3
            }, {
                id: 19,
                name: "Shadow Wings",
                price: 15e3,
                scale: 138,
                xOff: 22,
                desc: "increased movement speed",
                spdMult: 1.1
            }, {
                id: 18,
                name: "Blood Wings",
                price: 2e4,
                scale: 178,
                xOff: 26,
                desc: "restores health when you deal damage",
                healD: .2
            }, {
                id: 21,
                name: "Corrupt X Wings",
                price: 2e4,
                scale: 178,
                xOff: 26,
                desc: "deal damage to players that damage you",
                dmg: .25
            }]
        },
    "./src/js/libs/animText.js":
        /*!*********************************!*\
          !*** ./src/js/libs/animText.js ***!
          \*********************************/
        /*! no static exports found */
        function (e, t) {
            e.exports.AnimText = function () {
                this.init = function (e, t, n, i, s, a, r) {
                    this.x = e, this.y = t, this.color = r, this.scale = n, this.startScale = this.scale, this.maxScale = 1.5 * n, this.scaleSpeed = .7, this.speed = i, this.life = s, this.text = a
                }, this.update = function (e) {
                    this.life && (this.life -= e, this.y -= this.speed * e, this.scale += this.scaleSpeed * e, this.scale >= this.maxScale ? (this.scale = this.maxScale, this.scaleSpeed *= -1) : this.scale <= this.startScale && (this.scale = this.startScale, this.scaleSpeed = 0), this.life <= 0 && (this.life = 0))
                }, this.render = function (e, t, n) {
                    e.fillStyle = this.color, e.font = this.scale + "px Hammersmith One", e.fillText(this.text, this.x - t, this.y - n)
                }
            }, e.exports.TextManager = function () {
                this.texts = [], this.update = function (e, t, n, i) {
                    t.textBaseline = "middle", t.textAlign = "center";
                    for (var s = 0; s < this.texts.length; ++s) this.texts[s].life && (this.texts[s].update(e), this.texts[s].render(t, n, i))
                }, this.showText = function (t, n, i, s, a, r, o) {
                    for (var l, c = 0; c < this.texts.length; ++c)
                        if (!this.texts[c].life) {
                            l = this.texts[c];
                            break
                        } l || (l = new e.exports.AnimText, this.texts.push(l)), l.init(t, n, i, s, a, r, o)
                }
            }
        },
    "./src/js/libs/io-client.js":
        /*!**********************************!*\
          !*** ./src/js/libs/io-client.js ***!
          \**********************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! msgpack-lite */ "./node_modules/msgpack-lite/lib/browser.js");
            n( /*! ../config */ "./src/js/config.js");
            e.exports = {
                socket: null,
                connected: !1,
                socketId: -1,
                connect: function (e, t, n) {
                    if (!this.socket) {
                        var s = this;
                        try {
                            var a = !1,
                                r = e;
                            this.socket = new WebSocket(r), this.socket.binaryType = "arraybuffer", this.socket.onmessage = function (e) {
                                var t = new Uint8Array(e.data),
                                    a = i.decode(t),
                                    r = a[0];
                                t = a[1];
                                "io-init" == r ? s.socketId = t[0] : n[r].apply(void 0, t)
                            }, this.socket.onopen = function () {
                                s.connected = !0, t()
                            }, this.socket.onclose = function (e) {
                                s.connected = !1, 4001 == e.code ? t("Invalid Connection") : a || t("disconnected"), madeinohio.play()
                            }, this.socket.onerror = function (e) {
                                this.socket && this.socket.readyState != WebSocket.OPEN && (a = !0, console.error("Socket error", arguments), t("Socket error"))
                            }
                        } catch (e) {
                            console.warn("Socket connection error:", e), t(e)
                        }
                    }
                },
                send: function (e) {
                    var t = Array.prototype.slice.call(arguments, 1),
                        n = i.encode([e, t]);
                    this.socket.send(n)
                },
                doNewSend: function (e) {
                    var t = Array.prototype.slice.call(arguments, 1),
                        n = i.encode([e, t]);
                    this.socket.send(n)
                },
                socketReady: function () {
                    return this.socket && this.connected
                },
                close: function () {
                    this.socket && this.socket.close()
                }
            }
        },
    "./src/js/libs/modernizr.js":
        /*!**********************************!*\
          !*** ./src/js/libs/modernizr.js ***!
          \**********************************/
        /*! no static exports found */
        function (e, t) {
            ! function (e, t, n) {
                function i(e, t) {
                    return typeof e === t
                }
                var s = [],
                    a = [],
                    r = {
                        _version: "3.5.0",
                        _config: {
                            classPrefix: "",
                            enableClasses: !0,
                            enableJSClass: !0,
                            usePrefixes: !0
                        },
                        _q: [],
                        on: function (e, t) {
                            var n = this;
                            setTimeout((function () {
                                t(n[e])
                            }), 0)
                        },
                        addTest: function (e, t, n) {
                            a.push({
                                name: e,
                                fn: t,
                                options: n
                            })
                        },
                        addAsyncTest: function (e) {
                            a.push({
                                name: null,
                                fn: e
                            })
                        }
                    },
                    o = function () {};
                o.prototype = r, o = new o;
                var l = t.documentElement,
                    c = "svg" === l.nodeName.toLowerCase();
                o.addTest("passiveeventlisteners", (function () {
                        var t = !1;
                        try {
                            var n = Object.defineProperty({}, "passive", {
                                get: function () {
                                    t = !0
                                }
                            });
                            e.addEventListener("test", null, n)
                        } catch (e) {}
                        return t
                    })),
                    function () {
                        var e, t, n, r, l, c;
                        for (var h in a)
                            if (a.hasOwnProperty(h)) {
                                if (e = [], (t = a[h]).name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                                    for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
                                for (r = i(t.fn, "function") ? t.fn() : t.fn, l = 0; l < e.length; l++) 1 === (c = e[l].split(".")).length ? o[c[0]] = r : (!o[c[0]] || o[c[0]] instanceof Boolean || (o[c[0]] = new Boolean(o[c[0]])), o[c[0]][c[1]] = r), s.push((r ? "" : "no-") + c.join("-"))
                            }
                    }(),
                    function (e) {
                        var t = l.className,
                            n = o._config.classPrefix || "";
                        if (c && (t = t.baseVal), o._config.enableJSClass) {
                            var i = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
                            t = t.replace(i, "$1" + n + "js$2")
                        }
                        o._config.enableClasses && (t += " " + n + e.join(" " + n), c ? l.className.baseVal = t : l.className = t)
                    }(s), delete r.addTest, delete r.addAsyncTest;
                for (var h = 0; h < o._q.length; h++) o._q[h]();
                e.Modernizr = o
            }(window, document)
        },
    "./src/js/libs/soundManager.js":
        /*!*************************************!*\
          !*** ./src/js/libs/soundManager.js ***!
          \*************************************/
        /*! no static exports found */
        function (e, t) {
            e.exports.obj = function (e, t) {
                var n;
                this.sounds = [], this.active = !0, this.play = function (t, i, s) {
                    i && this.active && ((n = this.sounds[t]) || (n = new Howl({
                        src: ".././sound/" + t + ".mp3"
                    }), this.sounds[t] = n), s && n.isPlaying || (n.isPlaying = !0, n.play(), n.volume((i || 1) * e.volumeMult), n.loop(s)))
                }, this.toggleMute = function (e, t) {
                    (n = this.sounds[e]) && n.mute(t)
                }, this.stop = function (e) {
                    (n = this.sounds[e]) && (n.stop(), n.isPlaying = !1)
                }
            }
        },
    "./src/js/libs/utils.js":
        /*!******************************!*\
          !*** ./src/js/libs/utils.js ***!
          \******************************/
        /*! no static exports found */
        function (e, t) {
            var n = Math.abs,
                i = (Math.cos, Math.sin, Math.pow, Math.sqrt),
                s = Math.atan2,
                a = Math.PI;
            e.exports.randInt = function (e, t) {
                return Math.floor(Math.random() * (t - e + 1)) + e
            }, e.exports.randFloat = function (e, t) {
                return Math.random() * (t - e + 1) + e
            }, e.exports.lerp = function (e, t, n) {
                return e + (t - e) * n
            }, e.exports.decel = function (e, t) {
                return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)), e
            }, e.exports.getDistance = function (e, t, n, s) {
                return i((n -= e) * n + (s -= t) * s)
            }, e.exports.getDirection = function (e, t, n, i) {
                return s(t - i, e - n)
            }, e.exports.getAngleDist = function (e, t) {
                var i = n(t - e) % (2 * a);
                return i > a ? 2 * a - i : i
            }, e.exports.isNumber = function (e) {
                return "number" == typeof e && !isNaN(e) && isFinite(e)
            }, e.exports.isString = function (e) {
                return e && "string" == typeof e
            }, e.exports.kFormat = function (e) {
                return e > 999 ? (e / 1e3).toFixed(1) + "k" : e
            }, e.exports.capitalizeFirst = function (e) {
                return e.charAt(0).toUpperCase() + e.slice(1)
            }, e.exports.fixTo = function (e, t) {
                return parseFloat(e.toFixed(t))
            }, e.exports.sortByPoints = function (e, t) {
                return parseFloat(t.points) - parseFloat(e.points)
            }, e.exports.lineInRect = function (e, t, n, i, s, a, r, o) {
                var l = s,
                    c = r;
                if (s > r && (l = r, c = s), c > n && (c = n), l < e && (l = e), l > c) return !1;
                var h = a,
                    u = o,
                    d = r - s;
                if (Math.abs(d) > 1e-7) {
                    var f = (o - a) / d,
                        p = a - f * s;
                    h = f * l + p, u = f * c + p
                }
                if (h > u) {
                    var m = u;
                    u = h, h = m
                }
                return u > i && (u = i), h < t && (h = t), !(h > u)
            }, e.exports.containsPoint = function (e, t, n) {
                var i = e.getBoundingClientRect(),
                    s = i.left + window.scrollX,
                    a = i.top + window.scrollY,
                    r = i.width,
                    o = i.height;
                return t > s && t < s + r && (n > a && n < a + o)
            }, e.exports.mousifyTouchEvent = function (e) {
                var t = e.changedTouches[0];
                e.screenX = t.screenX, e.screenY = t.screenY, e.clientX = t.clientX, e.clientY = t.clientY, e.pageX = t.pageX, e.pageY = t.pageY
            }, e.exports.hookTouchEvents = function (t, n) {
                var i = !n,
                    s = !1,
                    a = !1;

                function r(n) {
                    e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), i && (n.preventDefault(), n.stopPropagation()), s && (t.onclick && t.onclick(n), t.onmouseout && t.onmouseout(n), s = !1)
                }
                t.addEventListener("touchstart", e.exports.checkTrusted((function (n) {
                    e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), i && (n.preventDefault(), n.stopPropagation());
                    t.onmouseover && t.onmouseover(n);
                    s = !0
                })), a), t.addEventListener("touchmove", e.exports.checkTrusted((function (n) {
                    e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), i && (n.preventDefault(), n.stopPropagation());
                    e.exports.containsPoint(t, n.pageX, n.pageY) ? s || (t.onmouseover && t.onmouseover(n), s = !0) : s && (t.onmouseout && t.onmouseout(n), s = !1)
                })), a), t.addEventListener("touchend", e.exports.checkTrusted(r), a), t.addEventListener("touchcancel", e.exports.checkTrusted(r), a), t.addEventListener("touchleave", e.exports.checkTrusted(r), a)
            }, e.exports.removeAllChildren = function (e) {
                for (; e.hasChildNodes();) e.removeChild(e.lastChild)
            }, e.exports.generateElement = function (t) {
                var n = document.createElement(t.tag || "div");

                function i(e, i) {
                    t[e] && (n[i] = t[e])
                }
                for (var s in i("text", "textContent"), i("html", "innerHTML"), i("class", "className"), t) {
                    switch (s) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue
                    }
                    n[s] = t[s]
                }
                if (n.onclick && (n.onclick = e.exports.checkTrusted(n.onclick)), n.onmouseover && (n.onmouseover = e.exports.checkTrusted(n.onmouseover)), n.onmouseout && (n.onmouseout = e.exports.checkTrusted(n.onmouseout)), t.style && (n.style.cssText = t.style), t.hookTouch && e.exports.hookTouchEvents(n), t.parent && t.parent.appendChild(n), t.children)
                    for (var a = 0; a < t.children.length; a++) n.appendChild(t.children[a]);
                return n
            }, e.exports.eventIsTrusted = function (e) {
                return !e || "boolean" != typeof e.isTrusted || e.isTrusted
            }, e.exports.checkTrusted = function (t) {
                return function (n) {
                    n && n instanceof Event && e.exports.eventIsTrusted(n) && t(n)
                }
            }, e.exports.randomString = function (e) {
                for (var t = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; i < e; i++) t += n.charAt(Math.floor(Math.random() * n.length));
                return t
            }, e.exports.countInArray = function (e, t) {
                for (var n = 0, i = 0; i < e.length; i++) e[i] === t && n++;
                return n
            }
        },
    "./vultr/VultrClient.js":
        /*!******************************!*\
          !*** ./vultr/VultrClient.js ***!
          \******************************/
        /*! no static exports found */
        function (e, t, n) {
            var i = n( /*! url */ "./node_modules/url/url.js"),
                s = n( /*! md5 */ "./node_modules/md5/md5.js");

            function a(e, t, n, i, s) {
                "localhost" == location.hostname && (window.location.hostname = "127.0.0.1"), this.debugLog = !1, this.baseUrl = e, this.lobbySize = n, this.devPort = t, this.lobbySpread = i, this.rawIPs = !!s, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0, this.processServers(vultr.servers)
            }
            a.prototype.regionInfo = {
                0: {
                    name: "Local",
                    latitude: 0,
                    longitude: 0
                },
                "vultr:1": {
                    name: "New Jersey",
                    latitude: 40.1393329,
                    longitude: -75.8521818
                },
                "vultr:2": {
                    name: "Chicago",
                    latitude: 41.8339037,
                    longitude: -87.872238
                },
                "vultr:3": {
                    name: "Dallas",
                    latitude: 32.8208751,
                    longitude: -96.8714229
                },
                "vultr:4": {
                    name: "Seattle",
                    latitude: 47.6149942,
                    longitude: -122.4759879
                },
                "vultr:5": {
                    name: "Los Angeles",
                    latitude: 34.0207504,
                    longitude: -118.691914
                },
                "vultr:6": {
                    name: "Atlanta",
                    latitude: 33.7676334,
                    longitude: -84.5610332
                },
                "vultr:7": {
                    name: "Amsterdam",
                    latitude: 52.3745287,
                    longitude: 4.7581878
                },
                "vultr:8": {
                    name: "London",
                    latitude: 51.5283063,
                    longitude: -.382486
                },
                "vultr:9": {
                    name: "Frankfurt",
                    latitude: 50.1211273,
                    longitude: 8.496137
                },
                "vultr:12": {
                    name: "Silicon Valley",
                    latitude: 37.4024714,
                    longitude: -122.3219752
                },
                "vultr:19": {
                    name: "Sydney",
                    latitude: -33.8479715,
                    longitude: 150.651084
                },
                "vultr:24": {
                    name: "Paris",
                    latitude: 48.8588376,
                    longitude: 2.2773454
                },
                "vultr:25": {
                    name: "Tokyo",
                    latitude: 35.6732615,
                    longitude: 139.569959
                },
                "vultr:39": {
                    name: "Miami",
                    latitude: 25.7823071,
                    longitude: -80.3012156
                },
                "vultr:40": {
                    name: "Singapore",
                    latitude: 1.3147268,
                    longitude: 103.7065876
                }
            }, a.prototype.start = function (e, t) {
                this.callback = e, this.errorCallback = t;
                var n = this.parseServerQuery();
                n ? (this.log("Found server in query."), this.password = n[3], this.connect(n[0], n[1], n[2])) : (this.log("Pinging servers..."), this.pingServers())
            }, a.prototype.parseServerQuery = function () {
                var e = i.parse(location.href, !0),
                    t = e.query.server;
                if ("string" == typeof t) {
                    var n = t.split(":");
                    if (3 == n.length) {
                        var s = n[0],
                            a = parseInt(n[1]),
                            r = parseInt(n[2]);
                        return "0" == s || s.startsWith("vultr:") || (s = "vultr:" + s), [s, a, r, e.query.password]
                    }
                    this.errorCallback("Invalid number of server parameters in " + t)
                }
            }, a.prototype.findServer = function (e, t) {
                var n = this.servers[e];
                if (Array.isArray(n)) {
                    for (var i = 0; i < n.length; i++) {
                        var s = n[i];
                        if (s.index == t) return s
                    }
                    console.warn("Could not find server in region " + e + " with index " + t + ".")
                } else this.errorCallback("No server list for region " + e)
            }, a.prototype.pingServers = function () {
                var e = this,
                    t = [];
                for (var n in this.servers)
                    if (this.servers.hasOwnProperty(n)) {
                        var i = this.servers[n],
                            s = i[Math.floor(Math.random() * i.length)];
                        null != s ? function (i, s) {
                            var a = new XMLHttpRequest;
                            a.onreadystatechange = function (i) {
                                var a = i.target;
                                if (4 == a.readyState)
                                    if (200 == a.status) {
                                        for (var r = 0; r < t.length; r++) t[r].abort();
                                        e.log("Connecting to region", s.region);
                                        var o = e.seekServer(s.region);
                                        e.connect(o[0], o[1], o[2])
                                    } else console.warn("Error pinging " + s.ip + " in region " + n)
                            };
                            var r = "//" + e.serverAddress(s.ip, !0) + ":" + e.serverPort(s) + "/ping";
                            a.open("GET", r, !0), a.send(null), e.log("Pinging", r), t.push(a)
                        }(0, s) : console.log("No target server for region " + n)
                    }
            }, a.prototype.seekServer = function (e, t, n) {
                null == n && (n = "random"), null == t && (t = !1);
                const i = ["random"];
                var s = this.lobbySize,
                    a = this.lobbySpread,
                    r = this.servers[e].flatMap((function (e) {
                        var t = 0;
                        return e.games.map((function (n) {
                            var i = t++;
                            return {
                                region: e.region,
                                index: e.index * e.games.length + i,
                                gameIndex: i,
                                gameCount: e.games.length,
                                playerCount: n.playerCount,
                                isPrivate: n.isPrivate
                            }
                        }))
                    })).filter((function (e) {
                        return !e.isPrivate
                    })).filter((function (e) {
                        return !t || 0 == e.playerCount && e.gameIndex >= e.gameCount / 2
                    })).filter((function (e) {
                        return "random" == n || i[e.index % i.length].key == n
                    })).sort((function (e, t) {
                        return t.playerCount - e.playerCount
                    })).filter((function (e) {
                        return e.playerCount < s
                    }));
                if (t && r.reverse(), 0 != r.length) {
                    var o = Math.min(a, r.length),
                        l = Math.floor(Math.random() * o),
                        c = r[l = Math.min(l, r.length - 1)],
                        h = c.region,
                        u = (l = Math.floor(c.index / c.gameCount), c.index % c.gameCount);
                    return this.log("Found server."), [h, l, u]
                }
                this.errorCallback("No open servers.")
            }, a.prototype.connect = function (e, t, n) {
                if (!this.connected) {
                    var i = this.findServer(e, t);
                    null != i ? (this.log("Connecting to server", i, "with game index", n), i.games[n].playerCount >= this.lobbySize ? this.errorCallback("Server is already full.") : (window.history.replaceState(document.title, document.title, this.generateHref(e, t, n, this.password)), this.server = i, this.gameIndex = n, this.log("Calling callback with address", this.serverAddress(i.ip), "on port", this.serverPort(i), "with game index", n), this.callback(this.serverAddress(i.ip), this.serverPort(i), n))) : this.errorCallback("Failed to find server for region " + e + " and index " + t)
                }
            }, a.prototype.switchServer = function (e, t, n, i) {
                this.switchingServers = !0, window.location.href = this.generateHref(e, t, n, i)
            }, a.prototype.generateHref = function (e, t, n, i) {
                var s = "/?server=" + (e = this.stripRegion(e)) + ":" + t + ":" + n;
                return i && (s += "&password=" + encodeURIComponent(i)), s
            }, a.prototype.serverAddress = function (e, t) {
                return "127.0.0.1" == e || "7f000001" == e || "903d62ef5d1c2fecdcaeb5e7dd485eff" == e ? window.location.hostname : this.rawIPs ? t ? "ip_" + this.hashIP(e) + "." + this.baseUrl : e : "ip_" + e + "." + this.baseUrl
            }, a.prototype.serverPort = function (e) {
                return 0 == e.region ? this.devPort : location.protocol.startsWith("https") ? 443 : 80
            }, a.prototype.processServers = function (e) {
                for (var t = {}, n = 0; n < e.length; n++) {
                    var i = e[n],
                        s = t[i.region];
                    null == s && (s = [], t[i.region] = s), s.push(i)
                }
                for (var a in t) t[a] = t[a].sort((function (e, t) {
                    return e.index - t.index
                }));
                this.servers = t
            }, a.prototype.ipToHex = function (e) {
                return e.split(".").map((e => ("00" + parseInt(e).toString(16)).substr(-2))).join("").toLowerCase()
            }, a.prototype.hashIP = function (e) {
                return s(this.ipToHex(e))
            }, a.prototype.log = function () {
                return this.debugLog ? console.log.apply(void 0, arguments) : console.verbose ? console.verbose.apply(void 0, arguments) : void 0
            }, a.prototype.stripRegion = function (e) {
                return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)), e
            }, window.testVultrClient = function () {
                var e = 1;

                function t(t, n) {
                    (t = `${t}`) == (n = `${n}`) ? console.log(`Assert ${e} passed.`): console.warn(`Assert ${e} failed. Expected ${n}, got ${t}.`), e++
                }
                var n = new a("test.io", -1, 5, 1, !1);
                n.errorCallback = function (e) {
                    e
                }, n.processServers(function (e) {
                    var t = [];
                    for (var n in e)
                        for (var i = e[n], s = 0; s < i.length; s++) t.push({
                            ip: n + ":" + s,
                            scheme: "testing",
                            region: n,
                            index: s,
                            games: i[s].map((e => ({
                                playerCount: e,
                                isPrivate: !1
                            })))
                        });
                    return t
                }({
                    1: [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ],
                    2: [
                        [5, 1, 0, 0],
                        [0, 0, 0, 0]
                    ],
                    3: [
                        [5, 0, 1, 5],
                        [0, 0, 0, 0]
                    ],
                    4: [
                        [5, 1, 1, 5],
                        [1, 0, 0, 0]
                    ],
                    5: [
                        [5, 1, 1, 5],
                        [1, 0, 4, 0]
                    ],
                    6: [
                        [5, 5, 5, 5],
                        [2, 3, 1, 4]
                    ],
                    7: [
                        [5, 5, 5, 5],
                        [5, 5, 5, 5]
                    ]
                })), t(n.seekServer(1, !1), [1, 0, 0]), t(n.seekServer(1, !0), [1, 1, 3]), t(n.seekServer(2, !1), [2, 0, 1]), t(n.seekServer(2, !0), [2, 1, 3]), t(n.seekServer(3, !1), [3, 0, 2]), t(n.seekServer(3, !0), [3, 1, 3]), t(n.seekServer(4, !1), [4, 0, 1]), t(n.seekServer(4, !0), [4, 1, 3]), t(n.seekServer(5, !1), [5, 1, 2]), t(n.seekServer(5, !0), [5, 1, 3]), t(n.seekServer(6, !1), [6, 1, 3]), t(n.seekServer(6, !0), void 0), t(n.seekServer(7, !1), void 0), t(n.seekServer(7, !0), void 0), console.log("Tests passed.")
            };
            var r = function (e, t) {
                return e.concat(t)
            };
            Array.prototype.flatMap = function (e) {
                return function (e, t) {
                    return t.map(e).reduce(r, [])
                }(e, this)
            }, e.exports = a
        }
});