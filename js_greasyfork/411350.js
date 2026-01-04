// ==UserScript==
// @name         Wrong Chat
// @namespace    http://tampermonkey.net/
// @version      1.3.16
// @description  Just chat to chat with nearby players
// @author       unnamed
// @match        https://splix.io/
// @match        https://splix.io/flags
// @grant        none
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/478491/1377223/splix-js-demodularizer.js
// @downloadURL https://update.greasyfork.org/scripts/411350/Wrong%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/411350/Wrong%20Chat.meta.js
// ==/UserScript==

(function() {
"use strict";

var source = `"use strict";

var wcFlags = {};
var wcFlagList = [
    {
        "name": "wcConvertEmoticons",
        "caption": "Convert emoticons in your messages to emoji",
        "description": ":D ⟶ 😄",
        "type": "checkbox",
        "default": true
    },
    {
        "name": "wcConsoleLog",
        "caption": "Print messages to the browser console",
        "description": "Until the page is refreshed, you can see the message history in the console.",
        "type": "checkbox",
        "default": true
    },
    {
        "name": "wcConsoleLogTimeAmPm",
        "caption": "Use AM/PM time format for console log",
        "description": "Uncheck if you want to use 24 hour format",
        "type": "checkbox",
        "default": true
    },
    {
        "name": "wcMsgDisplayTime",
        "caption": "Message display time",
        "description": "The total display time (seconds) of the message.<br>If this value is zero, messages will only be deleted when the message limit is reached.",
        "type": "number",
        "default": 90,
        "min": 0,
        "max": 3600
    },
    {
        "name": "wcMsgDecayTime",
        "caption": "Message decay time",
        "description": "The time (seconds) during which the messages fade out.<br>It is part of the total display time.",
        "type": "number",
        "default": 20,
        "min": 0,
        "max": 3600
    },
    {
        "name": "wcMessageLimit",
        "caption": "Number of messages on screen",
        "description": "Maximum number of messages displayed on the screen.",
        "type": "number",
        "default": 20,
        "min": 0,
        "max": 50
    },
    {
        "name": "wcDefaultNotifications",
        "caption": "Show default notifications",
        "description": "Show default splix.io notifications instead of bottom right corner notifications.<br>This parameter only affects the notifications shown by the Wrong Chat script.",
        "type": "checkbox",
        "default": false
    },
    {
        "name": "wcPrivacyWarnings",
        "caption": "Enable privacy warnings",
        "description": "Disable this flag if you understand the risks of communicating in this chat.<br>Even if you don't see anyone nearby, someone can see your messages.<br>Also, do not disclose important information as the interlocutor may impersonate someone else.",
        "type": "checkbox",
        "default": true
    },
    {
        "name": "wcBlockedPlayers",
        "caption": "Blocked players",
        "description": "List of blocked players in JSON format.<br>Clear the field if you want to clear the list.",
        "type": "text",
        "default": {}
    },
];

(function wcGetFlags() {
    for (var i = 0; i < wcFlagList.length; i++) {
        var value = localStorage.getItem(wcFlagList[i].name);
        if (value !== null) {
            if (wcFlagList[i].type == "number") {
                value = Number.parseInt(value);
                if (Number.isNaN(value)) {
                    value = wcFlagList[i].default;
                }
            }
            else if (wcFlagList[i].type == "checkbox") {
                value = (value == "true");
            }
            else if (wcFlagList[i].type == "text" && wcFlagList[i].name == "wcBlockedPlayers") {
                wcLoadBlockedPlayers();
                continue;
            }
        }
        else {
            value = wcFlagList[i].default;
        }
        wcFlags[wcFlagList[i].name] = value;
    }
}());

if (window.location.pathname == "/flags") {
    (function wcFlagListAddControls() {
        addHTML('<h4 style="margin-top: 1.5em; margin-bottom: 1em">Wrong Chat Flags</h4>', 'body');
        for (var i = 0; i < wcFlagList.length; i++) {
            var flag = wcFlagList[i];
            var control = \`<label>\${flag.caption}\\t\${flag.name == "wcBlockedPlayers" ? "<br><textarea" : "<input"} name="\${flag.name}" type="\${flag.type}" \${(flag.type == "number") ?
                (' style="width: 50px"' + (('min' in flag) ? ' min="' + flag.min + '"' : " ") + (('max' in flag) ? ' max="' + flag.max + '"' : " ") + ' value="' + wcFlags[flag.name] + '"') :
                (flag.type == "text" ? (' style="width: 600px; height: 50px"') :
                    ((flag.type == "checkbox" && wcFlags[flag.name]) ? " checked" : ""))}>\${flag.name == "wcBlockedPlayers" ? "</textarea>" : ""}</label>
            <div class="st">\${flag.description}</div>\`;

            addHTML(control, "body");

            if (flag.name == "wcBlockedPlayers") {
                document.querySelector('textarea[name="wcBlockedPlayers"]').value = JSON.stringify(wcFlags[flag.name]);
            }

            document.querySelector("label:last-of-type input, label:last-of-type textarea").addEventListener("change", function (e) {
                if (e.target.type == "number") {
                    if (!Number.isNaN(e.target.valueAsNumber)) {
                        localStorage.setItem(e.target.name, e.target.value);
                        wcFlags[e.target.name] = e.target.valueAsNumber;
                    }
                }
                else if (e.target.type == "checkbox") {
                    localStorage.setItem(e.target.name, e.target.checked);
                    wcFlags[e.target.name] = e.target.checked;
                }
                else if (e.target.tagName == "TEXTAREA") {
                    try {
                        if (e.target.value.trim() === "") {
                            localStorage.setItem("wcBlockedPlayers", "{}");
                        }
                        else {
                            var obj = JSON.parse(e.target.value);
                            localStorage.setItem("wcBlockedPlayers", JSON.stringify(obj));
                        }
                        wcLoadBlockedPlayers(false);
                    }
                    catch { }
                }
            });
        }
    }());
    throw new Error("Nobody will read the text of this error"); /** Stop code execution from here */
}

var dict = ["especially", "understand", "everything", "themselves", "associated", "experience", "something", "sometimes", "different", "necessary", "important", "condition", "operation", "direction", "attention", "therefore", "character", "situation", "according", "questions", "described", "territory", "establish", "https://", "immortal", "parasite", "anything", "actually", "happened", "national", "question", "possible", "although", "probably", "business", "pressure", "together", "couldn't", "remember", "southern", "frequent", "interest", "children", "everyone", "continue", "whatever", "position", "features", "wouldn't", "movement", "declared", "complete", "presence", "consider", "appeared", "industry", "thousand", "thinking", "language", "majority", "consists", "distance", "involved", "yourself", "entirely", "increase", "standing", "property", "surround", "private", "browser", "careful", "connect", "discord", "http://", "latency", "message", "players", "protect", "refresh", "restart", "running", "through", "because", "against", "thought", "without", "between", "nothing", "another", "usually", "however", "country", "himself", "patient", "certain", "general", "brother", "already", "someone", "example", "finally", "surface", "believe", "brought", "doesn't", "several", "english", "perhaps", "becomes", "process", "present", "looking", "there's", "carried", "friends", "minutes", "they're", "applied", "whether", "morning", "control", "explain", "measure", "foreign", "hundred", "talking", "instead", "outside", "reached", "opinion", "removed", "fingers", "project", "forward", "similar", "primary", "further", "getting", "quickly", "changes", "towards", "opening", "natural", "account", "comment", "strange", "subject", "prevent", "serious", "special", "portion", "somehow", "decided", "western", "problem", "imagine", "growing", "clearly", "beneath", "college", "exactly", "feeling", "divided", "section", "contact", "parents", "despite", "support", "healing", "neither", "attack", "better", "blocks", "bottom", "coming", "fought", "inside", "killed", "leader", "played", "player", "script", "server", "square", "should", "before", "people", "little", "didn't", "around", "really", "though", "that's", "things", "enough", "course", "always", "almost", "during", "you're", "within", "become", "behind", "matter", "others", "either", "school", "second", "friend", "system", "having", "wasn't", "public", "common", "across", "number", "moment", "passed", "person", "follow", "itself", "pretty", "making", "stupid", "growth", "result", "myself", "reason", "became", "rather", "trying", "thread", "father", "figure", "beyond", "french", "master", "family", "saying", "months", "action", "nearly", "middle", "taking", "period", "affect", "anyone", "rights", "single", "nature", "longer", "ground", "toward", "twenty", "spread", "raised", "indeed", "window", "except", "cancer", "street", "answer", "muscle", "effect", "slowly", "severe", "change", "cannot", "strong", "europe", "office", "normal", "spirit", "mother", "living", "likely", "liable", "german", "closed", "entire", "employ", "occurs", "reddit", "caught", "unless", "sudden", "please", "happen", "sounds", "simple", "nation", "filled", "points", "placed", "source", "region", "hardly", "silver", "seeing", "easily", "giving", "chance", "amount", "method", "direct", "appear", "remain", "barely", "remark", "finger", "return", "broken", "manner", "anyway", "crash", "block", "board", "chase", "fight", "later", "loose", "north", "paint", "right", "south", "speak", "splix", "spoke", "start", "worst", "esque", "cracy", "cycle", "which", "there", "their", "would", "could", "other", "about", "after", "first", "those", "these", "still", "think", "don't", "where", "being", "under", "great", "years", "while", "never", "every", "state", "again", "place", "blood", "might", "house", "shall", "until", "found", "three", "thing", "small", "power", "night", "heard", "cases", "maybe", "whole", "least", "light", "asked", "point", "world", "large", "going", "often", "can't", "known", "hands", "labor", "party", "along", "nerve", "among", "treat", "parts", "wound", "cause", "black", "taken", "money", "given", "women", "since", "above", "means", "close", "young", "times", "tried", "voice", "forms", "white", "woman", "sense", "early", "hours", "human", "death", "trade", "bones", "leave", "class", "quite", "doing", "sound", "stood", "began", "front", "wrong", "words", "local", "alone", "force", "water", "short", "takes", "mouth", "civil", "order", "occur", "peace", "paper", "lower", "clear", "heart", "terms", "doubt", "brain", "makes", "we're", "isn't", "popul", "round", "bring", "third", "cells", "meant", "child", "moved", "sorry", "sleep", "below", "floor", "watch", "seems", "whose", "earth", "heavy", "guess", "field", "sight", "upper", "issue", "lines", "weeks", "polic", "cover", "eight", "court", "lived", "stuff", "level", "space", "table", "thank", "works", "rapid", "teach", "event", "mini", "nope", "afai", "ahah", "area", "asap", "best", "chat", "died", "draw", "drew", "east", "fake", "good", "haha", "head", "imho", "keep", "kill", "left", "lmao", "mass", "near", "noob", "ping", "play", "rofl", "semi", "side", "tail", "talk", "tell", "wall", "west", "yolo", "ance", "ence", "ible", "ical", "ious", "ment", "ness", "ship", "sion", "tion", "ways", "ette", "hood", "ward", "wise", "that", "inte", "comp", "cons", "cont", "with", "from", "comm", "this", "they", "have", "disc", "tran", "were", "when", "conf", "what", "been", "into", "conc", "more", "like", "just", "conv", "unde", "dist", "them", "reco", "some", "then", "time", "your", "only", "said", "even", "than", "coun", "over", "disp", "prop", "pres", "know", "supe", "upon", "such", "back", "spec", "prot", "fore", "char", "very", "down", "made", "para", "well", "it's", "disa", "will", "most", "also", "much", "long", "same", "part", "must", "here", "make", "many", "skin", "came", "away", "hand", "ight", "once", "come", "room", "take", "face", "work", "both", "bone", "high", "last", "look", "eyes", "each", "life", "went", "knew", "ever", "took", "call", "body", "case", "give", "days", "seen", "turn", "door", "told", "name", "used", "free", "does", "year", "less", "find", "half", "mind", "felt", "i've", "seem", "next", "four", "pain", "girl", "fact", "else", "land", "done", "dark", "soon", "home", "sure", "five", "shit", "mean", "want", "kind", "gave", "stor", "need", "feel", "read", "deep", "real", "help", "able", "dead", "hard", "held", "rest", "line", "gone", "show", "rise", "fuck", "kept", "size", "true", "past", "thus", "idea", "limb", "full", "yeah", "arms", "hear", "love", "i'll", "city", "lost", "dumb", "he's", "late", "king", "farm", "form", "cold", "open", "word", "post", "neck", "term", "soft", "sent", "hope", "self", "laid", "fire", "hair", "lead", "feet", "stop", "view", "live", "none", "fear", "care", "mark", "foot", "hold", "hour", "game", "miss", "vote", "seat", "wait", "cute", "army", "easy", "step", "grew", "main", "join", "save", "move", "hunt", "says", "loss", "whom", "fell", "meat", "wish", "ones", "pass", "gold", "fine", "town", "edge", "food", "serv", "rule", "deal", "type", "ends", "we'd", "bill", "tha", "tio", "nde", "nce", "edt", "tis", "oft", "sth", "boy", "con", "yep", "afk", "aka", "art", "bad", "brb", "cya", "d/c", "die", "dot", "faq", "fyi", "gr8", "hit", "idk", "ikr", "kek", "lag", "lmc", "lol", "net", "omg", "out", "pen", "say", "sup", "thx", "top", "wtf", "'ll", "'ve", "acy", "ate", "dom", "ely", "ent", "ess", "ful", "ify", "ing", "ise", "ish", "ism", "ist", "ity", "ive", "ize", "ked", "ous", "ted", "ant", "ary", "eer", "est", "ion", "ure", "pre", "dis", "the", "pro", "com", "and", "int", "tra", "per", "sta", "res", "gra", "str", "imp", "par", "rec", "was", "cha", "ins", "sub", "exp", "ove", "you", "inc", "rep", "for", "cor", "inf", "ind", "app", "had", "mar", "his", "ste", "not", "but", "rea", "col", "und", "cla", "cou", "pla", "mis", "ass", "acc", "che", "sha", "are", "dec", "sho", "des", "spe", "tri", "har", "bra", "chi", "all", "hea", "one", "ref", "pri", "rel", "cra", "bri", "ret", "mon", "her", "bar", "she", "cre", "def", "blo", "inv", "fla", "sca", "fre", "cal", "exc", "may", "shi", "sto", "whi", "tre", "him", "wor", "han", "spi", "bla", "spo", "att", "sur", "fra", "min", "gen", "dep", "bre", "rem", "pat", "mor", "thr", "who", "rev", "ext", "pur", "its", "unc", "scr", "bur", "ser", "bal", "uns", "thi", "pos", "ele", "sen", "reg", "any", "pol", "did", "del", "mal", "sti", "has", "sch", "lea", "cat", "spa", "stu", "win", "can", "bea", "bac", "squ", "fac", "bro", "new", "now", "mas", "adv", "cri", "cap", "mat", "cur", "ver", "how", "det", "fin", "dev", "see", "emp", "our", "clo", "sec", "two", "gro", "aut", "hor", "mil", "sol", "ter", "syn", "way", "i'm", "get", "man", "too", "map", "own", "off", "war", "why", "old", "got", "uni", "saw", "few", "day", "far", "men", "met", "let", "end", "yet", "use", "put", "yes", "act", "law", "fig", "set", "i'd", "due", "cut", "son", "bed", "red", "lot", "air", "god", "arm", "ran", "guy", "ten", "try", "add", "lay", "ask", "six", "big", "ago", "eye", "sir", "age", "bit", "run", "nor", "mom", "led", "ect", "sat", "kid", "dad", "ies", "pay", "car", "hot", "low", "fix", "ics", "iel", "iar", "ian", "re", "en", "nt", "ea", "ti", "io", "le", "ou", "ar", "de", "rt", "ve", "am", "go", "of", "in", "he", "to", "it", "an", "is", "on", "at", "as", "or", "be", "me", "ha", "by", "no", "so", "we", "hi", "my", "us", "if", "do", "up", "ur", "ed", "yo", "dr", "ah", "oh", "ok", "al", "ic", "er", "nd", "es", "st", "th", "ly", "fy"]

function decToAnyRadixStr(dec, radix = 186, shift = 186) {
    let result = "";
    if (dec < 0 || dec > 0x10FFFF) return result;
    let r;
    while (dec > 0) {
        r = dec % radix;
        dec = ~~(dec / radix);
        if (r > 0 || dec > 0) {
            result += String.fromCharCode(r + shift);   // + shift to avoid interpretation "bytes" as ascii chars
        }
    }
    return result;
}

function anyRadixStrToChar(str, radix = 186) {
    if (str.length > 3) return "*";
    let i, m = 1, result = 0;
    for (i = 0; i < str.length; i++) {
        result += str.charCodeAt(i) * m;
        m *= radix;
    }
    if (result < 0 || result > 0x10FFFF) return "*";
    return String.fromCodePoint(result);
}

function wordToSymbols(wordCase, wordSides, wordIndex) {
    var control = wordCase * 24 + wordSides * 6 + Math.floor(wordIndex / 186);

    if (control < 10) {  }
    else if (control >= 10 && control < 31) {
        control += 1
    }
    else if (control == 31) {
        control = 127
    }
    else if (control > 31 && control < 72) {
        control += 96;
    }
    else {
        return "??";
    }
    return String.fromCharCode(control) + String.fromCharCode(wordIndex % 186 + 186);
}

function codesToWord(control, wordCode) {
    if (wordCode > 185) {
        console.error(\`Bad word code (\${wordCode})\`)
        return "<Error>"
    }

    if (control < 10) {  }
    else if (control >= 11 && control < 32) {
        control -= 1
    }
    else if (control == 127) {
        control = 31
    }
    else if (control > 127 && control < 168) {
        control -= 96
    }
    else {
        console.error(\`Bad control code (\${control})\`);
        return "<Error>";
    }

    var wordCase = Math.floor(control / 24);
    var wordSides = Math.floor((control % 24) / 6);
    var wordIndex = (control % 6) * 186 + wordCode;
    var word;
    if (wordIndex < 1116) {
        var word = dict[wordIndex];
    }
    else {
        console.error(\`Unknown word (\${control} \${wordCode})\`)
        return "<Error>";
    }
    return ((wordSides < 2) ? " " : "") +
        ((wordCase == 0) ? word : (wordCase == 1 ? word[0].toUpperCase() + word.substring(1) : word.toUpperCase())) +
        ((wordSides % 2 == 0) ? " " : "");
}

function prepareASCIIString(src) {
    var code;
    var result = "";
    src = src.normalize("NFC");
    for (var letter of src) {
        code = letter.codePointAt();
        if (code == 9) {
            result += " ";
        }
        else if ((code >= 32 && code < 127) || code == 10) {
            result += letter;
        }
        else if (code > 127) {
            var base186 = decToAnyRadixStr(code);
            result += String.fromCharCode(167 + base186.length) + base186;
        }
    }
    return result;
}

function compressWithDict(src) {
    var dictWordLength = 0,
        dictPosNewLength = 0,
        reResult,
        re,
        srcWord,
        srcWordPos,
        srcWordLC,
        srcWordCase,
        srcWordSides,
        srcWordLeftSide,
        srcWordRightSide,
        rSPos,
        rEPos,
        dictPos = 0,
        dictPos2;

    src = prepareASCIIString(src);

    while (dictPos < dict.length) {
        dictWordLength = dict[dictPos].length;
        re = new RegExp(\`['A-Za-z:\\/]{\${dictWordLength}}\`, 'g');

        while (dictPosNewLength < dict.length && dictWordLength == dict[dictPosNewLength].length) { dictPosNewLength++ }

        while ((reResult = re.exec(src)) != null) {
            srcWord = reResult[0];
            srcWordLC = srcWord.toLowerCase();
            srcWordPos = reResult.index;
            re.lastIndex = srcWordPos + 1;
            for (dictPos2 = dictPos; dictPos2 < dictPosNewLength; dictPos2++) {
                if (dict[dictPos2] == srcWordLC) {
                    if (srcWord == srcWordLC) { srcWordCase = 0; }
                    else if (srcWord == srcWord[0].toUpperCase() + srcWord.substring(1).toLocaleLowerCase()) { srcWordCase = 1; }
                    else if (srcWord == srcWord.toUpperCase()) { srcWordCase = 2; }
                    else {
                        break;
                    }

                    srcWordLeftSide = src.substring(srcWordPos - 1, srcWordPos);
                    srcWordRightSide = src.substring(srcWordPos + dictWordLength, srcWordPos + dictWordLength + 1);
                    if (srcWordLeftSide == " " && srcWordRightSide == " ") { srcWordSides = 0 }
                    else if (srcWordLeftSide == " ") { srcWordSides = 1 }
                    else if (srcWordRightSide == " ") { srcWordSides = 2 }
                    else if (dictWordLength > 2) { srcWordSides = 3 }
                    else {
                        break;
                    }

                    rSPos = srcWordSides < 2 ? srcWordPos - 1 : srcWordPos;
                    rEPos = (srcWordSides % 2 == 0) ? srcWordPos + dictWordLength + 1 : srcWordPos + dictWordLength;
                    src = src.substring(0, rSPos) + wordToSymbols(srcWordCase, srcWordSides, dictPos2) + src.substring(rEPos);

                    if (srcWordSides > 1) { re.lastIndex = srcWordPos + 2; }
                    break;
                }
            }
        }
        dictPos = dictPosNewLength;
    }


    let result = "";
    let code;
    for (var i = 0; i < src.length; i++) {
        code = src.charCodeAt(i);
        if (code >= 186) {
            result += String.fromCharCode(code - 186);
        }
        else {
            result += src[i];
        }
    }
    return result;
}

function decompressWithDict(src) {
    var result = "",
        i = 0,
        code;
    while (i < src.length) {
        code = src.codePointAt(i);
        if ((code > 31 && code < 127) || code == 10) {
            result += src[i];
            i += 1;
        }
        else if (code > 167 && code <= 170) {
            code -= 167;
            result += anyRadixStrToChar(src.substring(i + 1, i + 1 + code));
            i += 1 + code;
        }
        else if (code > 170) {
            console.error(\`decompressASCII: bad code (\${code})\`);
            return result + " ... <Error>";
        }
        else {
            result += codesToWord(code, src.codePointAt(i + 1));
            i += 2;
        }
    }
    return result;
}

/**
 * SCSU - Standard Compression Scheme for Unicode implementation for JavaScript
 *
 * Provides SCSU encoding/decoding of  UTF-8 strings
 * Suitable for better LZF compression for UTF-8 strings
 * Based on Java source of SCSU by Unicode, Inc. (http:
 *
 * @class	Provides methods for SCSU encoding/decoding
 * @author 	Alexey A.Znaev (znaeff@mail.ru) (http:
 * @copyright 	Copyright (C) 2011-2012 Alexey A.Znaev
 * @license 	http:
 * @version 	1.0
 */
function SCSU() { }

SCSU.prototype._SQ0 = 0x01;
SCSU.prototype._SQ1 = 0x02;
SCSU.prototype._SQ2 = 0x03;
SCSU.prototype._SQ3 = 0x04;
SCSU.prototype._SQ4 = 0x05;
SCSU.prototype._SQ5 = 0x06;
SCSU.prototype._SQ6 = 0x07;
SCSU.prototype._SQ7 = 0x08;

SCSU.prototype._SDX = 0x0B;
SCSU.prototype._Srs = 0x0C;

SCSU.prototype._SQU = 0x0E;
SCSU.prototype._SCU = 0x0F;

SCSU.prototype._SC0 = 0x10;
SCSU.prototype._SC1 = 0x11;
SCSU.prototype._SC2 = 0x12;
SCSU.prototype._SC3 = 0x13;
SCSU.prototype._SC4 = 0x14;
SCSU.prototype._SC5 = 0x15;
SCSU.prototype._SC6 = 0x16;
SCSU.prototype._SC7 = 0x17;
SCSU.prototype._SD0 = 0x18;
SCSU.prototype._SD1 = 0x19;
SCSU.prototype._SD2 = 0x1A;
SCSU.prototype._SD3 = 0x1B;
SCSU.prototype._SD4 = 0x1C;
SCSU.prototype._SD5 = 0x1D;
SCSU.prototype._SD6 = 0x1E;
SCSU.prototype._SD7 = 0x1F;

SCSU.prototype._UC0 = 0xE0;
SCSU.prototype._UC1 = 0xE1;
SCSU.prototype._UC2 = 0xE2;
SCSU.prototype._UC3 = 0xE3;
SCSU.prototype._UC4 = 0xE4;
SCSU.prototype._UC5 = 0xE5;
SCSU.prototype._UC6 = 0xE6;
SCSU.prototype._UC7 = 0xE7;
SCSU.prototype._UD0 = 0xE8;
SCSU.prototype._UD1 = 0xE9;
SCSU.prototype._UD2 = 0xEA;
SCSU.prototype._UD3 = 0xEB;
SCSU.prototype._UD4 = 0xEC;
SCSU.prototype._UD5 = 0xED;
SCSU.prototype._UD6 = 0xEE;
SCSU.prototype._UD7 = 0xEF;

SCSU.prototype._UQU = 0xF0;
SCSU.prototype._UDX = 0xF1;
SCSU.prototype._Urs = 0xF2;

SCSU.prototype._gapThreshold = 0x68;
SCSU.prototype._gapOffset = 0xAC00;

SCSU.prototype._reservedStart = 0xA8;
SCSU.prototype._fixedThreshold = 0xF9;

SCSU.prototype._fixedOffset = [0x00C0, 0x0250, 0x0370, 0x0530, 0x3040, 0x30A0, 0xFF60];

SCSU.prototype._staticOffset = [0x0000, 0x0080, 0x0100, 0x0300, 0x2000, 0x2080, 0x2100, 0x3000];

SCSU.prototype._initialDynamicOffset = [0x0080, 0x00C0, 0x0400, 0x0600, 0x0900, 0x3040, 0x30A0, 0xFF00];

/**
 * Encodes UTF-8 string using SCSU algorithm
 *
 * @param 		{String} str UTF-8 string
 * @return 		{String} SCSU-encoded string
 * @throws 		{SCSUError}
 */
SCSU.prototype.compress = function (str) {
    var iLen = 0, ch, ch2, iprevWindow;
    this._reset();
    this.sIn = str;
    this.iInLen = str.length;
    this.aOut = [];
    while (this.iIn < this.iInLen) {
        if (this.iSCU != -1) {
            ch = this._outputUnicodeRun();
            if (this.aOut.length - this.iSCU == 3) {
                this.aOut[this.iSCU] = this._SQU;
                this.iSCU = -1;
                continue;
            } else {
                this.iSCU = -1;
                this.fUnicodeMode = true;
            }
        } else ch = this._outputSingleByteRun();
        if (this.iIn == this.iInLen) break;
        for (var ich = this.iIn; ch < 0x80; ich++) {
            if (ich == this.iInLen || !this._isCompressible(this.sIn.charCodeAt(ich))) {
                ch = this.sIn.charCodeAt(this.iIn);
                break;
            }
            ch = this.sIn.charCodeAt(ich);
        }
        iprevWindow = this.iSelectedWindow;
        if (ch < 0x80 || this._locateWindow(ch, this.dynamicOffset)) {
            if (!this.fUnicodeMode && this.iIn < this.iInLen - 1) {
                ch2 = this.sIn.charCodeAt(this.iIn + 1);
                if (ch2 >= this.dynamicOffset[iprevWindow] && ch2 < this.dynamicOffset[iprevWindow] + 0x80) {
                    this._quoteSingleByte(ch);
                    this.iSelectedWindow = iprevWindow;
                    continue;
                }
            }
            this.aOut.push(((this.fUnicodeMode ? this._UC0 : this._SC0) + this.iSelectedWindow) & 255);
            this.fUnicodeMode = false;
        } else if (!this.fUnicodeMode && this._locateWindow(ch, this._staticOffset)) {
            this._quoteSingleByte(ch);
            this.iSelectedWindow = iprevWindow;
            continue;
        } else if (this._positionWindow(ch)) {
            this.fUnicodeMode = false;
        } else {
            this.iSCU = this.aOut.length;
            this.aOut.push(this._SCU);
            continue;
        }
    }
    delete this.sIn;
    var a_out_symbols = [];
    for (var i = 0; i < this.aOut.length; i++) a_out_symbols.push(String.fromCharCode(this.aOut[i]));
    delete this.aOut;
    return a_out_symbols.join('');
}

/**
 * Decodes SCSU-encoded string to UTF-8 one
 *
 * @param 		{String} str SCSU-encoded string
 * @return 		{String} UTF-8 string
 * @throws 		{SCSUError}
 */
SCSU.prototype.decompress = function (str) {
    this._reset();
    this.sIn = str;
    this.iInLen = str.length;
    var sOut = '';
    var iStaticWindow, iDynamicWindow, ch;
    Loop:
    for (var iCur = 0; iCur < this.iInLen; iCur++) {
        iStaticWindow = 0;
        iDynamicWindow = this.iSelectedWindow;
        Switch:
        switch (this.sIn.charCodeAt(iCur)) {
            case this._SQ0:
            case this._SQ1:
            case this._SQ2:
            case this._SQ3:
            case this._SQ4:
            case this._SQ5:
            case this._SQ6:
            case this._SQ7:
                if (iCur >= this.iInLen - 1) break Loop;
                iDynamicWindow = iStaticWindow = this.sIn.charCodeAt(iCur) - this._SQ0;
                iCur++;
            default:
                if (this.sIn.charCodeAt(iCur) < 128) {
                    ch = this.sIn.charCodeAt(iCur) + this._staticOffset[iStaticWindow];
                    sOut += String.fromCharCode(ch);
                } else {
                    ch = this.sIn.charCodeAt(iCur);
                    ch -= 0x80;
                    ch += this.dynamicOffset[iDynamicWindow];
                    if (ch < 1 << 16) {
                        sOut += String.fromCharCode(ch);
                    } else {
                        ch -= 0x10000;
                        sOut += String.fromCharCode(0xD800 + (ch >> 10));
                        sOut += String.fromCharCode(0xDC00 + (ch & ~0xFC00));
                    }
                }
                break;
            case this._SDX:
                iCur += 2;
                if (iCur >= this.iInLen) break Loop;
                this._defineExtendedWindow(this._charFromTwoBytes(aIn[iCur - 1], this.sIn.charCodeAt(iCur)));
                break;
            case this._SD0:
            case this._SD1:
            case this._SD2:
            case this._SD3:
            case this._SD4:
            case this._SD5:
            case this._SD6:
            case this._SD7:
                iCur++;
                if (iCur >= this.iInLen) break Loop;
                this._defineWindow(this.sIn.charCodeAt(iCur - 1) - this._SD0, this.sIn.charCodeAt(iCur));
                break;
            case this._SC0:
            case this._SC1:
            case this._SC2:
            case this._SC3:
            case this._SC4:
            case this._SC5:
            case this._SC6:
            case this._SC7:
                this.iSelectedWindow = this.sIn.charCodeAt(iCur) - this._SC0;
                break;
            case this._SCU:
                iCur++;
                for (var b; iCur < this.iInLen - 1; iCur += 2) {
                    b = this.sIn.charCodeAt(iCur);
                    if (b >= this._UC0 && b <= this._UC7) {
                        this.iSelectedWindow = b - this._UC0;
                        break Switch;
                    } else if (b >= this._UD0 && b <= this._UD7) {
                        this._defineWindow(b - this._UD0, this.sIn.charCodeAt(iCur + 1));
                        iCur++;
                        break Switch;
                    } else if (b == this._UDX) {
                        this._defineExtendedWindow(this._charFromTwoBytes(this.sIn.charCodeAt(iCur + 1), this.sIn.charCodeAt(iCur + 2)));
                        iCur += 2;
                        break Switch;
                    } else if (b == this._UQU) {
                        iCur++;
                    }
                    sOut += String.fromCharCode(this._charFromTwoBytes(this.sIn.charCodeAt(iCur), this.sIn.charCodeAt(iCur + 1)));
                }
                if (iCur != this.iInLen) throw new SCSUError(this._errorText(0x11));
                break;
            case this._SQU:
                iCur += 2;
                if (iCur >= this.iInLen) {
                    break Loop;
                } else {
                    ch = this._charFromTwoBytes(this.sIn.charCodeAt(iCur - 1), this.sIn.charCodeAt(iCur));
                    sOut += String.fromCharCode(ch);
                }
                break;
            case this._Srs:
                throw new SCSUError(this._errorText(0x16, 'Pos. ' + iCur + '.'));
        }
    }
    delete this.sIn;
    if (iCur < this.iInLen) throw new SCSUError(this._errorText(0x11));
    return sOut;
}

SCSU.prototype._isCompressible = function (ch) {
    return (ch < 0x3400 || ch >= 0xE000);
}

SCSU.prototype._reset = function () {
    this.iIn = 0;
    this.iSelectedWindow = 0;
    this.dynamicOffset = this._initialDynamicOffset.slice(0);
    this.iSCU = -1;
    this.fUnicodeMode = false;
    this.iNextWindow = 3;
}

SCSU.prototype._locateWindow = function (ch, offsetTable) {
    var iWin = this.iSelectedWindow;
    if (iWin != - 1 && ch >= offsetTable[iWin] && ch < offsetTable[iWin] + 0x80) return true;
    for (iWin = 0; iWin < offsetTable.length; iWin++) {
        if (ch >= offsetTable[iWin] && ch < offsetTable[iWin] + 0x80) {
            this.iSelectedWindow = iWin;
            return true;
        }
    }
    return false;
}

SCSU.prototype._isAsciiCrLfOrTab = function (ch) {
    return (ch >= 0x20 && ch <= 0x7F) || ch == 0x09 || ch == 0x0A || ch == 0x0D;
}

SCSU.prototype._outputSingleByteRun = function () {
    var iWin = this.iSelectedWindow, ch, ch2, byte1, byte2, aInLen;
    while (this.iIn < this.iInLen) {
        this.iOutLen = 0;
        byte1 = 0;
        byte2 = 0;
        ch = this.sIn.charCodeAt(this.iIn);
        aInLen = 1;
        if ((ch & 0xF800) == 0xD800) {
            if ((ch & 0xFC00) == 0xDC00) {
                throw new SCSUError(this._errorText(0x12, 'Byte #' + this.iIn + '.'));
            } else {
                if (this.iIn >= this.iInLen - 1) throw new SCSUError(this._errorText(0x11));
                ch2 = this.sIn.charCodeAt(this.iIn + 1);
                if ((ch2 & 0xFC00) != 0xDC00) throw new SCSUError(this._errorText(0x13, 'Byte #' + (this.iIn + 1) + '.'));
                ch = ((ch - 0xD800) << 10 | (ch2 - 0xDC00)) + 0x10000;
                aInLen = 2;
            }
        }
        if (this._isAsciiCrLfOrTab(ch) || ch == 0) {
            byte2 = ch & 0x7F;
            this.iOutLen = 1;
        } else if (ch < 0x20) {
            byte1 = this._SQ0;
            byte2 = ch;
            this.iOutLen = 2;
        } else if (ch >= this.dynamicOffset[iWin] && ch < this.dynamicOffset[iWin] + 0x80) {
            ch -= this.dynamicOffset[iWin];
            byte2 = (ch | 0x80) & 255;
            this.iOutLen = 1;
        }
        switch (this.iOutLen) {
            default:
                return ch;
            case 2:
                this.aOut.push(byte1);
            case 1:
                this.aOut.push(byte2);
                break;
        }
        this.iIn += aInLen;
    }
    return 0;
}

SCSU.prototype._quoteSingleByte = function (ch) {
    var iWin = this.iSelectedWindow, ch;
    this.aOut.push((this._SQ0 + iWin) & 255);
    if (ch >= this.dynamicOffset[iWin] && ch < this.dynamicOffset[iWin] + 0x80) {
        ch -= this.dynamicOffset[iWin];
        this.aOut.push((ch | 0x80) & 255);
    } else if (ch >= this._staticOffset[iWin] && ch < this._staticOffset[iWin] + 0x80) {
        ch -= this._staticOffset[iWin];
        this.aOut.push(ch & 255);
    } else throw new SCSUError(this._errorText(0x00, 'ch = ' + ch + ' not valid in _quoteSingleByte.'));
    this.iIn++;
}

SCSU.prototype._outputUnicodeRun = function () {
    var ch = 0, ch2;
    while (this.iIn < this.iInLen) {
        ch = this.sIn.charCodeAt(this.iIn);
        this.iOutLen = 2;
        if (this._isCompressible(ch)) {
            if (this.iIn < this.iInLen - 1) {
                ch2 = this.sIn.charCodeAt(this.iIn + 1);
                if (this._isCompressible(ch2)) break;
            }
            if (ch >= 0xE000 && ch <= 0xF2FF) this.iOutLen = 3;
        }
        if (this.iOutLen == 3) this.aOut.push(this._UQU);
        this.aOut.push((ch >> 8) & 255);
        this.aOut.push(ch & 0xFF);
        this.iIn++;
    }
    return ch;
}

SCSU.prototype._positionWindow = function (ch) {
    var iWin = this.iNextWindow % 8, iPosition = 0, ch;
    if (ch < 0x80) throw new SCSUError(this._errorText(0x00, 'ch < 0x80.'));
    for (var i = 0; i < this._fixedOffset.length; i++) {
        if (ch >= this._fixedOffset[i] && ch < this._fixedOffset[i] + 0x80) {
            iPosition = i;
            break;
        }
    }
    if (iPosition != 0) {
        this.dynamicOffset[iWin] = this._fixedOffset[iPosition];
        iPosition += 0xF9;
    } else if (ch < 0x3400) {
        iPosition = ch >> 7;
        this.dynamicOffset[iWin] = ch & 0xFF80;
    } else if (ch < 0xE000) {
        return false;
    } else if (ch <= 0xFFFF) {
        iPosition = ((ch - this._gapOffset) >> 7);
        this.dynamicOffset[iWin] = ch & 0xFF80;
    } else {
        iPosition = (ch - 0x10000) >> 7;
        iPosition |= iWin << 13;
        this.dynamicOffset[iWin] = ch & 0x1FFF80;
    }
    if (iPosition < 0x100) {
        this.aOut.push(((this.fUnicodeMode ? this._UD0 : this._SD0) + iWin) & 255);
        this.aOut.push(iPosition & 0xFF);
    } else if (iPosition >= 0x100) {
        this.aOut.push(this.fUnicodeMode ? this._UDX : this._SDX);
        this.aOut.push((iPosition >> 8) & 0xFF);
        this.aOut.push(iPosition & 0xFF);
    }
    this.iSelectedWindow = iWin;
    this.iNextWindow++;
    return true;
}

SCSU.prototype._defineWindow = function (iWin, bOffset) {
    var iOffset = (bOffset < 0 ? bOffset + 256 : bOffset);
    if (iOffset == 0) {
        throw new SCSUError(this._errorText(0x14));
    } else if (iOffset < this._gapThreshold) {
        this.dynamicOffset[iWin] = iOffset << 7;
    } else if (iOffset < this._reservedStart) {
        this.dynamicOffset[iWin] = (iOffset << 7) + this._gapOffset;
    } else if (iOffset < this._fixedThreshold) {
        throw new SCSUError(this._errorText(0x15, 'Value = ' + iOffset + '.'));
    } else {
        this.dynamicOffset[iWin] = this._fixedOffset[iOffset - this._fixedThreshold];
    }
    this.iSelectedWindow = iWin;
}

SCSU.prototype._defineExtendedWindow = function (chOffset) {
    var iWin = chOffset >> 13;
    this.dynamicOffset[iWin] = ((chOffset & 0x1FFF) << 7) + (1 << 16);
    this.iSelectedWindow = iWin;
}

SCSU.prototype._charFromTwoBytes = function (hi, lo) {
    var ch = (lo >= 0 ? lo : 256 + lo);
    return (ch + ((hi >= 0 ? hi : 256 + hi) << 8));
}

SCSU.prototype._ERRORS = {
    0x00: 'Internal error.',
    0x10: 'Illegal input.',
    0x11: 'Ended prematurely.',
    0x12: 'Unpaired low surrogate.',
    0x13: 'Unpaired high surrogate.',
    0x14: 'Zero offset.',
    0x15: 'Bad offset.',
    0x16: 'Srs byte found.',
    0x20: 'Bad output.'
};

SCSU.prototype._errorText = function (code, text) {
    if (code == null || (typeof code != 'number') || code < 0 || code > 0xFF) code = 0x00;
    if (text == null || (typeof text != 'string')) text = '';
    var message = '';
    var code_class = code & 0xF0;
    if (this._ERRORS[code_class]) message = this._ERRORS[code_class];
    if ((code != code_class) && this._ERRORS[code]) message += ' ' + this._ERRORS[code];
    return ('SCSU 0x' + code.toString(16) + ': ' + message + (text == '' ? '' : ' ') + text);
}

/**
 * SCSU Errors exceptions
 *
 * @class	Constructs exceptions of SCSU errors
 * @author 	Alexey A.Znaev (znaeff@mail.ru) (http:
 * @copyright 	Copyright (C) 2011-2012 Alexey A.Znaev
 * @license 	http:
 * @version 	1.0
 */
function SCSUError(msg) { this.message = msg; this.name = 'SCSUError' };
SCSUError.prototype = new Error();

function removeControlASCIISymbols(str) {
    var code;
    var result = "";
    for (var i = 0; i < str.length; i++) {
        code = str.codePointAt(i);
        if (code == 9) {
            result += " ";
        }
        else if ((code >= 32 && code < 127) || code > 127 || code == 10) {
            result += str[i]
        }
    }
    return result;
}

function compressWithSCSU(src) {
    src = removeControlASCIISymbols(src);
    var result;
    try {
        result = SCSU.prototype.compress(src);
    }
    catch (e) {
        console.error("SCSU compression error:", e);
        return null;
    }
    return result;
}

function decompressWithSCSU(src) {
    var result;
    try {
        result = SCSU.prototype.decompress(src);
    }
    catch (e) {
        //console.error("SCSU decompression error:", e);
        return null;
    }
    return result;
}

function unicodeToRadix183Str(src) {
    var result = "",
        code;
    for (var letter of src) {
        code = letter.codePointAt();
        if (code < 183) {
            result += letter;
        }
        else if (code > 127) {
            var base183 = decToAnyRadixStr(code, 183, 0);
            result += String.fromCharCode(182 + base183.length) + base183;
        }
    }
    return result;
}

function radix183StrToUnicode(src) {
    var result = "",
        i = 0,
        code;
    while (i < src.length) {
        code = src.codePointAt(i);
        if (code < 183) {
            result += src[i];
            i += 1;
        }
        else {
            code -= 182;
            result += anyRadixStrToChar(src.substring(i + 1, i + 1 + code), 183, 0);
            i += 1 + code;
        }
    }
    return result;
}

function strToHonkMsg(src) {
    var encodingType,
        result;

    if (src.length == 0) {
        encodingType = 3;
        result = " ";
    }
    else {
        var codedWithDict = compressWithDict(src);
        var codedWithoutDict = compressWithSCSU(src);

        var scsu = false;
        if (codedWithoutDict !== null) {
            if (decompressWithSCSU(codedWithoutDict) !== null) {
                codedWithoutDict = unicodeToRadix183Str(codedWithoutDict);
                scsu = true;
            }
        }

        if (!scsu) {
            codedWithoutDict = unicodeToRadix183Str(src);
        }

        if (codedWithDict.length < codedWithoutDict.length) {
            result = codedWithDict;
            encodingType = 1;
        }
        else {
            result = codedWithoutDict;
            encodingType = scsu ? 2 : 3;
        }
    }

    if (result.length > 186 || result.length < 1) {
        return result.length;
    }
    else {
        return String.fromCharCode(encodingType) + String.fromCharCode(result.length - 1) + result;
    }
}

function honkMsgToString(src) {
    const errMsg = "<Decoding error>";
    var srcLen = src.length,
        result = "";
    if (srcLen < 3 || srcLen > 186 + 2) {
        console.error(\`honkMsgToString: incorrect length of source (\${src.length})\`);
        return errMsg;
    }
    else {
        var encodingType = src.codePointAt(0);
        if (encodingType < 1 || encodingType > 3) {
            console.error(\`honkMsgToString: incorrect encoding type (\${encodingType})\`);
            return errMsg;
        }

        var textLen = src.codePointAt(1);
        if (srcLen - 2 != textLen) {
            console.error(\`honkMsgToString: incorrect message text length (\${srcLen} / \${textLen})\`);
            return errMsg;
        }

        try {
            if (encodingType == 1) {
                result = decompressWithDict(src.substring(2));
            }
            else if (encodingType == 2) {
                result = decompressWithSCSU(radix183StrToUnicode(src.substring(2)));
            }
            else if (encodingType == 3) {
                result = radix183StrToUnicode(src.substring(2));
            }

            return result.replace(/(\\r\\n|\\r|\\n){2,}/g, '\$1\\n');
        }
        catch (e) {
            console.error(\`honkMsgToString: decompression error (type \${encodingType})\`, e);
            return errMsg;
        }
    }
}

var wcMessage = "";
var wcMessagePos = 0;

function wcSendMsgHonk() {
    if (playingAndReady) {
        var code = wcMessage.charCodeAt(wcMessagePos) + 70;
        wcMessagePos += 1;
        if (!wsSendMsg(sendAction.HONK, code)) wsMsgSendStatus = 0;
        myPlayer.doHonk(code);
        if (wcMessagePos < wcMessage.length) {
            setTimeout(wcSendMsgHonk, ((wcMessagePos < 13e0) ? 50e0 : ((wcMessagePos < 26e0) ? 65e0 : 85e0)));
        }
        else {
            wsMsgSendStatus = 0;
        }
    }
    else {
        wsMsgSendStatus = 0;
    }
}

function wcSendMessage(message) {
    wcMessage = String.fromCharCode(1) + String.fromCharCode(57) + message;
    wcMessagePos = 0;
    wsMsgSendStatus = 1;
    wcSendMsgHonk();
}

function wcMsgHonkHandler(player, value) {
    if (player.msgStatus == 0) {
        if (value == 71 && !wcIsPlayerBlocked(player.name, player.skinBlock)) {
            player.msgStatus = 1;
        }
        else return;
    }
    else if (player.msgStatus == 1) {
        if (value == 127) {
            player.msgStatus = 2;
        }
        else if (value !== 71) {
            player.msgStatus = 0;
        }
    }
    else if (player.msgStatus == 2) {
        if (value >= 71 && value <= 73) {
            player.msgStatus = 3;
            player.message = String.fromCharCode(value - 70);
        }
        else {
            player.msgStatus = 0;
        }
    }
    else if (player.msgStatus == 3) {
        player.msgStatus = 4;
        player.msgLength = value - 69 + 2;
        player.message += String.fromCharCode(value - 69);
    }
    else {
        player.message += String.fromCharCode(value - 70);
        if (player.message.length >= player.msgLength) {
            wcNewMessage(player.message, player.name, player.skinBlock);
            player.msgStatus = 0;
        }
    }
}

function honkEndWC() {
    if (wsMsgSendStatus === 0) {
        var e = Date.now();
        if (lastHonkTime < e) {
            var t = clamp(t = e - honkStartTime, 0, 1e3);
            lastHonkTime = e + t,
                t = iLerp(0, 1e3, t),
                t *= 255,
                t = Math.floor(t),
                wsSendMsg(sendAction.HONK, t);
            for (var n = 0; n < players.length; n++) {
                var a = players[n];
                a.isMyPlayer && a.doHonk(Math.max(70, t))
            }
        }
    }
}

function getPlayerWC(e, t) {
    var n;
    void 0 === t && (t = players);
    for (var a = 0; a < t.length; a++)
        if ((n = t[a]).id == e)
            return n;
    return n = {
        id: e,
        pos: [0, 0],
        drawPos: [-1, -1],
        drawPosSet: !1,
        serverPos: [0, 0],
        dir: 0,
        isMyPlayer: 0 === e,
        isSpectator: false,
        spectatorIcon: null,
        updateSpectatorIcon: async function () {
            if (!this.isSpectator) {
                this.spectatorIcon = null;
            } else {
                const playerColor = getColorForBlockSkinId(n.skinBlock);
                this.spectatorIcon = await getSpectatorIcon(playerColor.darker);
            }
        },
        isDead: !1,
        deathWasCertain: !1,
        didUncertainDeathLastTick: !1,
        isDeadTimer: 0,
        uncertainDeathPosition: [0, 0],
        message: "",
        msgStatus: 0,
        msgLength: 0,
        die: function (e) {
            if (e = !!e, this.isDead)
                this.deathWasCertain = e || this.deathWasCertain;
            else if (e || !this.didUncertainDeathLastTick) {
                e || (this.didUncertainDeathLastTick = !0, this.uncertainDeathPosition = [this.pos[0], this.pos[1]]),
                    this.isDead = !0,
                    this.deathWasCertain = e,
                    this.deadAnimParts = [0],
                    this.isDeadTimer = 0,
                    this.isMyPlayer && doCamShakeDir(this.dir);
                for (var t = 0; ;) {
                    if ((t += .4 * Math.random() + .5) >= 2 * Math.PI) {
                        this.deadAnimParts.push(2 * Math.PI);
                        break
                    }
                    this.deadAnimParts.push(t),
                        this.deadAnimPartsRandDist.push(Math.random())
                }
            }
        },
        undoDie: function () {
            this.isDead = !1
        },
        deadAnimParts: [],
        deadAnimPartsRandDist: [],
        addHitLine: function (e, t) {
            this.hitLines.push({
                pos: e,
                vanishTimer: 0,
                color: t
            })
        },
        hitLines: [],
        doHonk: function (e) {
            this.honkTimer = 0,
                this.honkMaxTime = e,
                "joris" == this.name.toLowerCase() && (null == honkSfx && (honkSfx = new Audio("/static/honk.mp3")), honkSfx.play());
            wcMsgHonkHandler(this, e);
        },
        moveRelativeToServerPosNextFrame: !1,
        lastServerPosSentTime: 0,
        honkTimer: 0,
        honkMaxTime: 0,
        trails: [],
        name: "",
        skinBlock: 0,
        lastBlock: null,
        hasReceivedPosition: !1
    },
        t.push(n),
        n.isMyPlayer && (myPlayer = n),
        n
}

getPlayer = getPlayerWC;
honkEnd = honkEndWC;

var style = \`
#chatbox {
    position: fixed;
    right: 0;
    bottom: 0;
}

#chatbox > * {
    clear:both;
    float:right;
}

#chatMessages > * {
    clear:both;
    float:right;
}

#chatNotifications > * {
    clear:both;
    float:right;
}

.chatMessage, .chatNotification {
    display: flex;
    background: #2d2824;
    border: solid 2px #332d29;
    margin: 1px 7px;
    border-radius: 9px;
    overflow: hidden;
    max-width: 450px;
    user-select: text;
    opacity: 1;
}

.chatNotification {
    max-height: 100px;
}

.chatNotification > span {
    color: #fff;
    font-style: italic;
    display: flex;
    align-items: center;
    padding: 4px 10px;
}

#chatInput {
    display: inline-block;
    background: #7a6d62;
    color: #000000;
    border: solid 4px #3a342f;
    margin: 1px 0 0 0;
    padding: 0 0.2em;
    font-size: 1.1em;
    line-height: 1.4em;
    outline: none;
    min-width: 250px;
    font-family: "Lucida Console", Monaco, monospace;
    visibility: hidden;
}

.chatMessage > span {
    display: flex;
    align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
}

.chatMessage span:last-of-type{
    color: #fff;
    background: #413a35;
    padding-left: 10px;
    padding-right: 10px;
    overflow-wrap: anywhere;
}

.chatMessage span:first-of-type{
    color: #ffffff80;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 5px;
    cursor: pointer;
    max-width: 300px;
}

#wcBlock {
    position: fixed;
    min-width: 300px;
    background: #4d453e;
    border: solid 1px #000000;
    color: #ffffff;
    text-align: center;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    cursor: default;
    user-select: none;
    overflow: hidden;
    font-size: 0;
    opacity: 0;
    display: none;
    transition: font-size 0.15s ease-out, opacity 0.05s ease-out 0.05s;
    right: 100px;
    bottom: 100px;
}

#wcBlock input[type="checkbox"],
#wcBlock input[type="radio"] {
    display: none;
}

#wcBlock label {
    padding: 0.9em 0.2em;
}

#wcBlock input[type="radio"]:checked+label {
    background: #a22929;
}

#wcBlock input:hover+label {
    background: #3a342f;
}

#wcBlockAttributes input+label::before {
    content: 'Current ';
}

#wcBlockAttributes input:checked+label::before {
    content: 'Any ';
}

#wcBlockHeader {
    background: #3a342f;
    font-weight: bold;
    padding: 0.3em 0.3em;
}

#wcBlockPeriod,
#wcBlockAttributes,
#wcBlockButtons {
    display: grid;
}

#wcBlockPeriod {
    grid-template-columns: 23% 23% 23% 31%;
}

#wcBlockButtons {
    grid-template-columns: 59% 40%;
    column-gap: 1%;
}

.wcBlockButton {
    background: #3a342f;
    border: none;
    padding: 0.6em 0.1em;
    color: white;
    font-size: 1em;
}

#wcBlockBlock {
    background: #631717;
}

#wcBlockCancel:hover {
    background: #3bad48;
}

#wcBlockBlock:hover {
    background: #a22929;
}
\`

addStyle(style);

var html = \`
<div id="chatbox">
    <div id="chatMessages"></div>
    <div id="chatNotifications"></div>
    <input id="chatInput" type="text" maxlength="372">
</div>
<div id="wcBlock">
    <div id="wcBlockHeader">Block user for ...</div>
    <div id="wcBlockPeriod">
        <input class="wcBlockPeriodRadio" type="radio" name="wcBlockPeriod" value="year" id="wcBlockPeriodRadio1">
        <label for="wcBlockPeriodRadio1">Year</label>
        <input class="wcBlockPeriodRadio" type="radio" name="wcBlockPeriod" value="week" id="wcBlockPeriodRadio2">
        <label for="wcBlockPeriodRadio2">Week</label>
        <input class="wcBlockPeriodRadio" type="radio" name="wcBlockPeriod" value="day" id="wcBlockPeriodRadio3">
        <label for="wcBlockPeriodRadio3">Day</label>
        <input class="wcBlockPeriodRadio" type="radio" name="wcBlockPeriod" value="2h" id="wcBlockPeriodRadio4" checked>
        <label for="wcBlockPeriodRadio4">Two&nbsp;hours</label>
    </div>
    <div id="wcBlockAttributes">
        <input class="wcBlockAttribute" type="checkbox" id="wcBlockAnyColor" checked>
        <label for="wcBlockAnyColor">color</label>
    </div>
    <div id="wcBlockButtons">
        <input class="wcBlockButton" type="button" id="wcBlockBlock" value="Block">
        <input class="wcBlockButton" type="button" id="wcBlockCancel" value="Cancel">
    </div>
</div>
\`

addHTML(html, "#playUI");

var wcBlock = document.getElementById("wcBlock");
var wcPlayerMenuHeader = document.getElementById("wcBlockHeader");
var wcBlockPeriodRadio1 = document.getElementById("wcBlockPeriodRadio1");
var wcBlockPeriodRadio2 = document.getElementById("wcBlockPeriodRadio2");
var wcBlockPeriodRadio3 = document.getElementById("wcBlockPeriodRadio3");
var wcBlockPeriodRadio4 = document.getElementById("wcBlockPeriodRadio4");
var wcBlockAnyColor = document.getElementById("wcBlockAnyColor");
var wcBlockBlock = document.getElementById("wcBlockBlock");
var wcBlockCancel = document.getElementById("wcBlockCancel");

wcBlockAnyColor.addEventListener("change", function () {
    if (!wcBlockAnyColor.checked) {
        document.querySelector("#wcBlockAnyColor+label").style.backgroundColor = wcBlock.getAttribute("data-color");
    }
    else {
        document.querySelector("#wcBlockAnyColor+label").style.background = "none";
    }
})

function wcShowBlockMenu(e) {
    var name = e.target.getAttribute("data-name");
    var colorId = e.target.getAttribute("data-colorid");
    wcBlock.setAttribute("data-name", name);
    wcBlock.setAttribute("data-color", bgColorById(colorId));
    wcBlock.setAttribute("data-colorid", colorId);
    wcPlayerMenuHeader.textContent = \`Block \${name} for a...\`;
    wcBlockPeriodRadio4.checked = true;
    wcBlockAnyColor.checked = false;
    document.querySelector("#wcBlockAnyColor+label").style.backgroundColor = bgColorById(colorId);
    wcBlock.style.right = \`\${document.body.clientWidth - e.clientX + 20}px\`
    wcBlock.style.bottom = \`\${document.body.clientHeight - e.clientY}px\`
    wcBlock.style.opacity = "1";
    wcBlock.style.fontSize = "1em";
    wcBlock.style.display = "block";
}

function wcHideBlockMenu() {
    wcBlock.style.opacity = "0";
    wcBlock.style.fontSize = "0";
    wcBlock.style.display = "none";
}

wcBlockCancel.addEventListener("click", wcHideBlockMenu);
wcBlockBlock.addEventListener("click", function () {
    var until = Date.now() +
        (wcBlockPeriodRadio4.checked ? 2 * 60 * 60 * 1000 :
            (wcBlockPeriodRadio3.checked ? 24 * 60 * 60 * 1000 :
                (wcBlockPeriodRadio2.checked ? 7 * 24 * 60 * 60 * 1000 :
                    365 * 24 * 60 * 60 * 1000)));

    var name = wcBlock.getAttribute("data-name");
    var colorId = !(wcBlockAnyColor.checked) ? Number.parseInt(wcBlock.getAttribute("data-colorid")) : -1;
    if (isNaN(colorId)) {
        colorId = -1;
    }
    wcBlockPlayer(name, until, colorId);

    wcNewNotification(\`\${name} has been blocked\`, 6);
    wcHideBlockMenu();
});

var chatNotifications = document.getElementById("chatNotifications");
var chatMessages = document.getElementById("chatMessages");
var chatInput = document.getElementById("chatInput");
chatInput.addEventListener('input', resizeChatInput);

function resizeChatInput() {
    chatInput.style.width = (chatInput.value.length + 1) + "ch";
}

function addStyle(styleStr) {
    const style = document.createElement('style');
    style.textContent = styleStr;
    document.head.append(style);
}

function addHTML(htmlStr, selector) {
    var template = document.createElement('template');
    template.innerHTML = htmlStr.trim();
    document.querySelector(selector).appendChild(template.content);
}

function bgColorById(colorId) {
    if (colorId < 0 || colorId > 12) { return 0 }
    var hue = [0, 342.9, 322.81, 265.97, 274.04, 227.18, 218.93, 125.19, 126.95, 71.69, 49.88, 27.39, 40.99];
    return \`hsl(\${hue[colorId]}, 94%, 50%)\`;
}

function colorNameById(colorId) {
    if (colorId < 0 || colorId > 12) { return "" }
    var colors = ["red", "pink", "dark pink", "light purple", "dark purple", "dark blue", "light blue", "light green", "dark green", "olive", "yellow", "orange", "gold"];
    return (colors[colorId]);
}

var msgDivs = [];
var notifDivs = [];
var wsMsgSendStatus = 0;
var chatVisible = true;
var showPrivacyWarning = wcFlags.wcPrivacyWarnings;
removeExtraMessages();

function wcPrivacyWarning() {
    var strings = [
        "Walls have ears, and so do blocks",
        "Do not pass any important information through this chat",
        "The interlocutor may not be who he seems",
    ];
    var emojis = ["👀", "🤐", "🎭", "👺", "👂", "🕵️"];
    wcNewNotification(strings[Math.floor(Math.random() * strings.length)] + " " + emojis[Math.floor(Math.random() * emojis.length)], 10, 1);
    showPrivacyWarning = false;
}

function wcNewMessage(honkMsg, name, colorId) {
    if (showPrivacyWarning) {
        wcPrivacyWarning();
    }
    var color = bgColorById(colorId);
    var text = wcCompatibleReplace(honkMsgToString(honkMsg));
    var trimName = name.trim();
    if (wcFlags.wcConsoleLog) {
        console.log(new Date().toLocaleTimeString(wcFlags.wcConsoleLogTimeAmPm ? "en-US" : "en-GB", { timeStyle: "short" }) + " " +
            (trimName === "" ? \`(\${colorNameById(colorId)})\` : trimName) + ": " + text);
    }

    var msgDiv = document.createElement("div");
    msgDiv.classList.add("chatMessage");

    var msgSpanName = document.createElement("span");
    msgSpanName.textContent = trimName === "" ? "⬤" : trimName;
    msgSpanName.setAttribute("data-name", trimName);
    msgSpanName.setAttribute("data-colorid", colorId);
    msgSpanName.style.color = color;
    msgSpanName.addEventListener("click", wcShowBlockMenu);
    var msgSpanText = document.createElement("span");
    msgSpanText.textContent = text;
    msgDiv.appendChild(msgSpanName);
    msgDiv.appendChild(msgSpanText);
    chatMessages.appendChild(msgDiv);
    msgDivs.unshift(msgDiv);
    if (wcFlags.wcMsgDisplayTime !== 0) {  // don't delete at all if 0. But will be deleted if limit reached
        setTimeout(function () {
            msgDiv.style.transition = \`opacity \${wcFlags.wcMsgDecayTime <= wcFlags.wcMsgDisplayTime ? wcFlags.wcMsgDecayTime : wcFlags.wcMsgDisplayTime}s ease-in-out\`;
            msgDiv.style.opacity = "0";
        }, (wcFlags.wcMsgDecayTime < wcFlags.wcMsgDisplayTime ? wcFlags.wcMsgDisplayTime - wcFlags.wcMsgDecayTime : 0.1) * 1000);
        setTimeout(function () {
            var index = msgDivs.indexOf(msgDiv);
            if (index != -1) {
                msgDiv.remove();
                msgDivs.splice(index, 1);
            }
        }, wcFlags.wcMsgDisplayTime * 1000);
    }
}

function showTopNotification(text, timeAlive = 4) {
    var notification = doTopNotification(text);
    setTimeout(function () { notification.animateOut(); notification.destroy(); }, timeAlive * 1000);
}

function wcNewCornerNotification(text, timeAlive = 4, type = 0) {
    var notifDiv = document.createElement("div");
    notifDiv.classList.add("chatNotification");
    var notifSpan = document.createElement("span");
    notifSpan.textContent = text;
    if (type == 1) {
        notifSpan.style.fontStyle = "normal";
        notifSpan.style.color = "yellow";
    }
    notifDiv.appendChild(notifSpan);
    chatNotifications.appendChild(notifDiv);
    notifDivs.unshift(notifDiv);
    setTimeout(function () {
        notifDiv.style.transition = "opacity 1s ease-in-out, max-height .35s ease-in-out";
        notifDiv.style.transitionDelay = "0s, .5s"
        notifDiv.style.opacity = "0";
        notifDiv.style.maxHeight = "0";
    }, (timeAlive - 1) * 1000);
    setTimeout(function () {
        var index = notifDivs.indexOf(notifDiv);
        if (index != -1) {
            notifDiv.remove();
            notifDivs.splice(index, 1);
        }
    }, timeAlive * 1000);
}

function wcNewNotification(text, timeAlive = 4, type = 0) {
    text = wcCompatibleReplace(text);

    if (timeAlive == undefined) {
        timeAlive = 4;
    }
    if (wcFlags.wcDefaultNotifications) {
        showTopNotification(text, timeAlive);
    }
    else {
        wcNewCornerNotification(text, timeAlive, type);
    }
}

function removeExtraMessages() {
    if (msgDivs.length > wcFlags.wcMessageLimit) {
        for (var i = msgDivs.length - 1; i > wcFlags.wcMessageLimit; i--) {
            msgDivs[i].remove();
            msgDivs.splice(i);
        }
    }
    setTimeout(removeExtraMessages, 2000);
}

function hideChatInput() {
    chatInput.style.visibility = 'hidden';
    chatInput.blur();
}

function toggleChatInput() {
    if (chatInput.style.visibility !== 'visible') {
        chatInput.style.visibility = 'visible';
        showChat();
        chatInput.focus();
        if (document.activeElement !== chatInput) hideChatInput();
    }
    else {
        hideChatInput();
    }
}

function showChat() {
    chatVisible = true;
    chatMessages.style.opacity = '1';
    chatMessages.style.pointerEvents = 'auto';
}

function toggleChat() {
    chatVisible = !chatVisible;
    if (chatVisible) {
        chatMessages.style.opacity = '1';
        chatMessages.style.pointerEvents = 'auto';
        wcNewNotification("Chat is visible", 2);
    }
    else {
        chatMessages.style.opacity = '0';
        chatMessages.style.pointerEvents = 'none';
        hideChatInput();
        wcNewNotification("Chat is hidden", 2);
    }
}

function wcIsPlayerBlocked(name, colorId) {
    if (!(name in wcFlags.wcBlockedPlayers)) {
        return false;
    }
    else {
        for (const one of wcFlags.wcBlockedPlayers[name]) {
            if (one.until > Date.now() && (!('colorId' in one) || one.colorId == colorId)) {
                return true;
            }
        }
    }
    return false;
}

function wcBlockPlayer(name, until, colorId = -1) {
    wcLoadBlockedPlayers(false);

    if (!(name in wcFlags.wcBlockedPlayers)) {
        wcFlags.wcBlockedPlayers[name] = [];
    }

    if (colorId === -1) {
        wcFlags.wcBlockedPlayers[name].push({ 'until': until });
    }
    else {
        wcFlags.wcBlockedPlayers[name].push({ 'until': until, 'colorId': colorId });
    }
    wcSaveBlockedPlayers();
}

function wcSaveBlockedPlayers() {
    localStorage.setItem("wcBlockedPlayers", JSON.stringify(wcFlags.wcBlockedPlayers));
}

function wcLoadBlockedPlayers(saveIfChanged = true) {
    var lsBlockedPlayers = localStorage.getItem("wcBlockedPlayers");
    var wasChanged = false;

    try {
        var parsedBlockedPlayers = JSON.parse(lsBlockedPlayers);
        if (parsedBlockedPlayers === null) {
            parsedBlockedPlayers = {}
        }
    }
    catch {
        var parsedBlockedPlayers = {};
        wasChanged = true;
    }

    for (var name in parsedBlockedPlayers) {
        const properties = parsedBlockedPlayers[name];
        if (Array.isArray(properties)) {
            var i = properties.length;
            while (i--) {
                const one = properties[i];
                if (typeof one !== 'object'
                    || one === null
                    || !('until' in one)
                    || one.until < Date.now()
                    || ('colorId' in one && (!Number.isInteger(one.colorId) || one.colorId < 0 || one.colorId > 12))) {
                    properties.splice(i, 1);
                    wasChanged = true;
                }
            }
            if (properties.length === 0) {
                delete parsedBlockedPlayers[name];
                wasChanged = true;
            }
        }
        else {
            delete parsedBlockedPlayers.name;
            wasChanged = true;
        }
    }

    wcFlags.wcBlockedPlayers = parsedBlockedPlayers;

    if (saveIfChanged && wasChanged) {
        wcSaveBlockedPlayers();
    }
}

var wcReplacements = {}, wcRECompat, wcCompatibleReplace;

(function () {
    var compatibleReplacements = {
        "💔": ["</3"],
        "😕": [":-/"],
        "😢": [":'("],
        "🙁": ["😟", ":("],
        "❤️": ["<3"],
        "😇": ["0:-)"],
        "😂": [":'-)"],
        "😗": [":*"],
        "😐": [":|"],
        "😮": [":-O"],
        "😡": [":@"],
        "🙂": ["😊", ":-)"],
        "😄": [":D"],
        "😭": [";("],
        "😛": [":P"],
        "😅": [",:-)"],
        "😒": [":s"],
        "😉": [";)"],
        "🙃": ["🙂", "😊", "(-:"],
        "🤐": ["🙊", ":secret:"],
        "🕵️": ["👁", ":detective:"],
    }

    var testContext = document.createElement("canvas").getContext('2d');
    function isEmojiAvailable(em) {
        return testContext.measureText(em).width > 8;
    }

    for (var em in compatibleReplacements) {
        if (!isEmojiAvailable(em)) {
            for (var i = 0; i < compatibleReplacements[em].length; i++) {
                if (i == compatibleReplacements[em].length - 1 || isEmojiAvailable(compatibleReplacements[em][i])) {
                    wcReplacements[em] = compatibleReplacements[em][i];
                    break;
                }
            }
        }
    }

    testContext.canvas.remove();

    if (Object.keys(wcReplacements).length > 0) {
        wcRECompat = new RegExp(Object.keys(wcReplacements).join("|"), "gi");
        wcCompatibleReplace = function (str) {
            return str.replace(wcRECompat, function (matched) {
                return wcReplacements[matched];
            });
        }
    }
    else {
        wcReplacements = null;
        wcCompatibleReplace = function (str) {
            return str;
        };
    }
}());

var wcEmoticons = {
    "</3": "💔",
    "<\\\\3": "💔",
    ":-/": "😕",
    ":'-(": "😢",
    ":'(": "😢",
    ":(": "🙁",
    ":-(": "🙁",
    "<3": "❤️",
    "O:-)": "😇",
    "0:-)": "😇",
    "O:)": "😇",
    "0:)": "😇",
    ":'-)": "😂",
    ":')": "😂",
    ":-*": "😗",
    ":*": "😗",
    ":-|": "😐",
    ":|": "😐",
    ":-O": "😮",
    ":O": "😮",
    ":@": "😡",
    ":)": "🙂",
    ":-)": "🙂",
    "=)": "🙂",
    "^^": "😄",
    ":D": "😃",
    ":-D": "😃",
    "=D": "😃",
    "XD": "😆",
    ";(": "😭",
    ":-P": "😛",
    ":P": "😛",
    ",:-)": "😅",
    ":\$": "😒",
    ":S": "😒",
    ";-)": "😉",
    ";)": "😉",
    "(:": "🙃",
    "(-:": "🙃",
    "(=": "🙃",
    ":F": "🐸",
    "(F)": "🐸",
    ":(|)": "🐸"
}

var wcEmRe = /(^|\\s)(['\\-\\\$\\(\\)*,/:;@\\\\\\^\\|<=03DOPSXF]{2,4})(\$|\\s)/gi;

function wcEmoticonsToEmoji(src) {
    wcEmRe.lastIndex = 0;
    var result = "",
        prevIndex = 0,
        REsult;
    while (REsult = wcEmRe.exec(src)) {
        if (REsult[2].toUpperCase() in wcEmoticons) {
            if (REsult[1].length == 1) {
                result += src.substring(prevIndex, REsult.index + 1) + wcEmoticons[REsult[2].toUpperCase()];
            }
            else {
                result += wcEmoticons[REsult[2].toUpperCase()];
            }

            if (REsult[3].length != 0) {
                wcEmRe.lastIndex -= 1;
            }

            prevIndex = wcEmRe.lastIndex;
        }
        else if (REsult[3].length != 0) {
            wcEmRe.lastIndex -= 1;
        }
    }
    result += src.substring(prevIndex);
    return result;
}

document.body.addEventListener('keydown', function (e) {
    if (!playingAndReady) return;
    if (e.keyCode == 13) {
        toggleChatInput();
    }
    else if (e.keyCode == 27) {
        hideChatInput()
    }
    else if (e.keyCode == 67) {
        toggleChat();
    }
})

chatInput.addEventListener('focusout', function () {
    chatInput.style.visibility = 'hidden';
});

chatInput.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.keyCode == 27) {
        hideChatInput();
    }
    else if (e.keyCode == 13) {
        if (chatInput.value.length == 0) {
            hideChatInput();
        }
        else {
            if (wsMsgSendStatus === 0) {
                var message = wcFlags.wcConvertEmoticons ? strToHonkMsg(wcEmoticonsToEmoji(chatInput.value)) : strToHonkMsg(chatInput.value);
                if (typeof (message) == "number") {
                    if (message == 0) {
                        wcNewNotification("Message length is 0");
                    }
                    else {
                        wcNewNotification(\`Shorten the message by about \${message - 186} characters\`, 5);
                    }
                }
                else {
                    wcSendMessage(message);
                    chatInput.value = "";
                    hideChatInput();
                    resizeChatInput();
                }
            }
            else {
                wcNewNotification("Please wait...", 2);
            }
        }
    }
})

chatInput.addEventListener('keyup', function (e) {
    e.stopPropagation();
})`

function waitPageReady(callback) {
    if (typeof(getPlayer) != "function" && typeof(ddEl) != "object") {
        requestAnimationFrame(function(){waitPageReady(callback)});
    }
    else {
        setTimeout(callback,0);
    }
}

function addScript() {
    var template = document.createElement('script');
    template.innerHTML = source;
    document.body.appendChild(template);
}

if (!localStorage.update) {
    ["clientCode", "clientDemodCode", "demodularizerVersion"].forEach(i => localStorage.removeItem(i));
    localStorage.update = true;
    location.reload();
}

waitPageReady(addScript);

})();