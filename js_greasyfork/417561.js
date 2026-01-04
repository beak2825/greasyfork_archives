// ==UserScript==
// @name        Kanji Highlighter 2
// @namespace   japanese
// @description Based on the original Kanji Highlighter by looki, this will highlight all kanji using specific colours, depending on the user's knowledge level (currently optimized for WaniKani users).
// @include     *
// @exclude     http*://mail.google.com*
// @exclude     http*://*reddit.com*
// @exclude     http*://*.wanikani.com*
// @version     2.0.14
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_openInTab
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/417561/Kanji%20Highlighter%202.user.js
// @updateURL https://update.greasyfork.org/scripts/417561/Kanji%20Highlighter%202.meta.js
// ==/UserScript==

// Visiblity coefficient for markup
var COL_ALPHA = 0.5;

// Number of color steps to generate for the unknown Kanji levels
var COLOR_STEPS = 5;

// Colors to use to generate color levels with
var COL_FROM = [255, 255, 128]; // yellow
var COL_TO = [255, 128, 128]; // red

// Special colors
var COL_KNOWN = "rgba(221, 255, 208, " + COL_ALPHA + ")";
var COL_CURRENT = "rgba(140, 255, 120, " + COL_ALPHA + ")";
var COL_ADDITIONAL = "rgba(208, 255, 255, " + COL_ALPHA + ")"; // User-added known kanji that have not been learned in one of the levels
var COL_SEEN = "rgba(255, 192, 255, " + COL_ALPHA + ")"; // User-added seen kanji
var COL_MISSING = "rgba(190, 190, 190, " + COL_ALPHA + ")";

// Matches a kanji in a string
var kanjiRegexp = /[\u4e00-\u9faf\u3400-\u4dbf]/;
// Matches all non-kanji characters
var notKanjiRegexp = /[^\u4e00-\u9faf\u3400-\u4dbf]+/g;

// Renderer setting mask bits
var R_KNOWN = 1;
var R_MISSING = 2;
var R_UNKNOWN = 4;
var R_ADD_K = 8;
var R_ADD_S = 16;
var R_CURRENT = 32;

// CSS that applies to all classes
var CSS_GLOBAL = "display:inline!important;margin:0!important;padding:0!important;border:0!important;"
                + "outline:0!important;font-size:100%!important;vertical-align:baseline!important;";

// Main
window.addEventListener("load", function (e) {
    // Register menu items
    GM_registerMenuCommand("Set current level", setKanjiLevel, "l");
    GM_registerMenuCommand("Show kanji statistics", countKanji);
    GM_registerMenuCommand("Re-scan website", rescanWebsite, "r");
    GM_registerMenuCommand("Open info for selected kanji", openKanjiDetails, "o");
    GM_registerMenuCommand("Set highlight settings", setRenderSettings);
    GM_registerMenuCommand("Temporarily disable on this site", undoHighlighting, "d");
    GM_registerMenuCommand("== Kanji from other sources:", function() { alert("Hey! I'm just a caption. Don't click me!"); });
    GM_registerMenuCommand("Set known", function() { setCustomKanji("known"); });
    GM_registerMenuCommand("Add known", function() { addCustomKanji("known"); }, "k");
    GM_registerMenuCommand("Remove known", function() { remCustomKanji("known"); });
    GM_registerMenuCommand("Set seen", function() { setCustomKanji("seen"); });
    GM_registerMenuCommand("Add seen", function() { addCustomKanji("seen"); }, "s");
    GM_registerMenuCommand("Remove seen", function() { remCustomKanji("seen"); });
    GM_registerMenuCommand("== Advanced:", function () { alert("Hey! I'm just a caption. Don't click me!"); });
    GM_registerMenuCommand("Set info website URLs", setInfoURLs);
    GM_registerMenuCommand("Modify level dictionary", setKanjiDict);
    GM_registerMenuCommand("Reset level dictionary", resetKanjiDict);
    GM_registerMenuCommand("Reset additionally known", function() { resetCustomKanji("known"); });
    GM_registerMenuCommand("Reset additionally seen", function() { resetCustomKanji("seen"); });
    GM_registerMenuCommand("Copy list of known kanji", copyKnownKanji);
    GM_registerMenuCommand("Copy list of unknown kanji", copyUnknownKanji);

    // GM_deleteValue("level");
    // GM_deleteValue("dictionary");

    loadSettings();
    rescanWebsite();
}, false);

// Register shortcut for setting the level
(function(){
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 76 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        setKanjiLevel();
    }
}, false);
})();

// Register shortcut for opening the selected kanji on WK
(function(){
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 79 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        openKanjiDetails();
    }
}, false);
})();

// Register shortcut for 'add additional known kanji'
(function(){
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 75 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        addCustomKanji("known");
    }
}, false);
})();

// Register shortcut for 'add additional seen kanji'
(function(){
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 83 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        addCustomKanji("seen");
    }
}, false);
})();

// Register shortcut for 're-scan website'
(function(){
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 82 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        rescanWebsite();
    }
}, false);
})();

// Register shortcut for 'Temporarily disable highlighting'
(function(){
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 68 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
        undoHighlighting();
    }
}, false);
})();

function loadSettings() {
    // First time running the script
    if (GM_getValue("level") == null) {

        // Circumvent weird bug
        GM_setValue("level", 1);
        if (GM_getValue("level") == null)
            return;
        GM_deleteValue("level");

        alert("Since this is the first time that you're using the kanji highlighter script, " +
            "please adjust the following options to your needs.");
        setKanjiLevel();
    }

    // Load the dictionary - Wanikani's by default
    var dictionary;
    var dictValue = GM_getValue("dictionary");
    if (dictValue == null) {
        dictionary = getWKKanjiLevels();
        GM_setValue("dictionary", JSON.stringify(dictionary));
        GM_setValue("levelCount", dictionary.length);
    } else {
        dictionary = JSON.parse(dictValue);
    }
    if (GM_getValue("levelCount") == null && dictionary !== null)
        GM_setValue("levelCount", dictionary.length);
    unsafeWindow.dictionary = dictionary;

    // Legacy support
    if (old = GM_getValue("additionalKanji")) {
        GM_setValue("knownKanji", old);
        GM_deleteValue("additionalKanji");
    }

    // Store global values
    unsafeWindow.renderSettings = GM_getValue("renderSettings", 0xff);
    unsafeWindow.levelCount = GM_getValue("levelCount", getWKKanjiLevels().length); // TODO: Allow changing
    unsafeWindow.levelThreshold = GM_getValue("level", 1);
    unsafeWindow.knownKanji = GM_getValue("knownKanji", "");
    unsafeWindow.seenKanji = GM_getValue("seenKanji", "");
    unsafeWindow.infoPage = GM_getValue("infoPage", "https://www.wanikani.com/kanji/$K");
    unsafeWindow.infoFallback = GM_getValue("infoPage", "http://jisho.org/search/$K #kanji");
    unsafeWindow.dictionary = dictionary;

    // Build linear map
    unsafeWindow.kanjiMap = buildKanjiMap();

    // Generate CSS classes
    css = ".wk_K {  " + CSS_GLOBAL + " background-color: " + COL_KNOWN + " !important; /*color: black !important;*/ } ";
    css += ".wk_X { " + CSS_GLOBAL + " background-color: " + COL_MISSING + " !important; /*color: black !important;*/ } ";
    css += ".wk_A { " + CSS_GLOBAL + " background-color: " + COL_ADDITIONAL + " !important; /*color: black !important;*/ } ";
    css += ".wk_S { " + CSS_GLOBAL + " background-color: " + COL_SEEN + " !important; /*color: black !important;*/ } ";
    css += ".wk_C { " + CSS_GLOBAL + " background-color: " + COL_CURRENT + " !important; /*color: black !important;*/ } ";
    // Now generate a rainbow for the unknown levels
    for (i = 0; i < COLOR_STEPS; ++i) {
        ii = i * 1.0 / (COLOR_STEPS - 1);
        r = COL_FROM[0] * (1 - ii) + COL_TO[0] * ii;
        g = COL_FROM[1] * (1 - ii) + COL_TO[1] * ii;
        b = COL_FROM[2] * (1 - ii) + COL_TO[2] * ii;

        bgCol = 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ', ' + Math.floor(b) + ', ' + COL_ALPHA + ')';
        css += ".wk_" + i + " { " + CSS_GLOBAL + " /*color: black;*/ background-color: " + bgCol + " !important; } ";
    }
    GM_addStyle(css);
}

/*
 * Set render settings
 */
function setRenderSettings() {
    var t = "Enter 1 if you want to highlight ";
    var tmp, result = 0;
    var render = GM_getValue("renderSettings", unsafeWindow.renderSettings);
    do {
        if (null === (tmp = window.prompt(t + "officially learned (green) kanji, or 0 otherwise.", (render & R_KNOWN) ? 1 : 0)))
            break;
        if (tmp > 0)
            result |= R_KNOWN;

        if (null === (tmp = window.prompt(t + "new kanji from the current level (darker green), or 0 otherwise.", (render & R_CURRENT) ? 1 : 0)))
            break;
        if (tmp > 0)
            result |= R_CURRENT;

        if (null === (tmp = window.prompt(t + "not yet officially learned (yellow - red) kanji, or 0 otherwise.", (render & R_UNKNOWN) ? 1 : 0)))
            break;
        if (tmp > 0)
            result |= R_UNKNOWN;

        if (null === (tmp = window.prompt(t + "kanji not present in the levels (black), or 0 otherwise.", (render & R_MISSING) ? 1 : 0)))
            break;
        if (tmp > 0)
            result |= R_MISSING;

        if (null === (tmp = window.prompt(t + "additionally known (blue) kanji, or 0 otherwise.", (render & R_ADD_K) ? 1 : 0)))
            break;
        if (tmp > 0)
            result |= R_ADD_K;

        if (null === (tmp = window.prompt(t + "additionally seen (purple) kanji, or 0 otherwise.", (render & R_ADD_S) ? 1 : 0)))
            break;
        if (tmp > 0)
            result |= R_ADD_S;

        alert("You need to refresh the page in order to see the changes.");
        GM_setValue("renderSettings", result);
    } while (0);
}

/* 
 * Specifies the URLs to use when opening kanji detail pages.
 */
function setInfoURLs() {
    var infoPage, infoFallback;
    if (infoPage = window.prompt("Enter the URL to use when opening a kanji detail page " 
        + "($K will be replaced with the kanji).", unsafeWindow.infoPage)) {
        unsafeWindow.infoPage = infoPage;

        if (infoPage = window.prompt("Enter the URL to use as a fallback for unavailable kanji "
            + "($K will be replaced with the kanji).", unsafeWindow.infoFallback)) {
            unsafeWindow.infoFallback = infoFallback;
        }
    }
}

/*
 * Counts all the kanji and displays them in a popup.
 */
function countKanji() {
    currentLevel = unsafeWindow.levelThreshold;
    kanjiMap = buildKanjiMap();
    var known = 0, unknown = 0, additional = 0, formallyknown = 0, seen = 0;
    for (var kanji in kanjiMap) {
        level = kanjiMap[kanji];
        if (level <= currentLevel && level >= -1)
            known++;
        else if (level == -2)
            seen++;
        else
            unknown++;
        if (level == -1)
            additional++;
        else if (level <= currentLevel)
            formallyknown++;
    }
    alert((formallyknown) + " kanji have already been learned. There are " + additional +
        " additionally known kanji. The number of known kanji in total is " + known + ", plus " + seen + " marked as seen.");
}

/*
 * Removes the CSS decoration generated by the script, just this once. Useful for viewing Chinese pages
 * or just pages dealing with many kanji in general.
 */
function undoHighlighting() {
    $('span[class^=wk_]').removeClass();
}

/*
 * Prompts a dialog that allows the user to change his current threshold level
 */
function setKanjiLevel() {
    var level = window.prompt("Please enter the highest kanji level that should be marked as 'known'.", GM_getValue("level", 1));
    if (level !== null) {
        level = Math.max(1, Math.min(GM_getValue("levelCount", 1), parseInt(level, 10)));
        GM_setValue("level", level);
    }
}

/*
 * Prompts a dialog that allows the user to edit the raw kanji dictionary
 */
function setKanjiDict() {
    var kanjiDict = "";
    GM_setClipboard(JSON.stringify(unsafeWindow.dictionary, null, 4));
    alert("The dictionary has been copied into your clipboard. You should modify it using a text editor. "+
        "Once you're done, paste it into the text field in the next dialog.");

    // Try until proper JSON was specified
    while (true) {
        kanjiDict = window.prompt("Paste the new dictionary here.", kanjiDict);

        // Abort if nothing entiered
        if (kanjiDict == null)
            break;

        try {
            dict = JSON.parse(kanjiDict);
            if (dict instanceof Object) {
                // Find highest level
                var levelCount = Object.keys(dict).length;

                // Update & finish
                GM_setValue("levelCount", levelCount);
                GM_setValue("dictionary", kanjiDict);
                alert("Dictionary updated successfully - " + levelCount + " levels detected.");
                return;
            } else
                alert("The specified JSON is not a dictionary!");
        } catch (e) {
            if (e instanceof SyntaxError)
                alert("Error while parsing: " + e.message);
            else
                alert("Error: " + e.message);
        }
    }
}

/*
 * Opens a kanji detail website for every kanji in the selected phrase.
 * Uses a fallback website for kanji that are not within the levels
 * Defaults: WaniKani + beta.jisho.org as fallback.
 */
function openKanjiDetails() {
    var kanjiMap = unsafeWindow.kanjiMap;
    var kanji = getKanjiInString(getSelection().toString());
    var infoPage = unsafeWindow.infoPage;
    var infoFallback = unsafeWindow.infoFallback;

    for (var i = 0; i < kanji.length; ++i) {
        if (kanjiMap[kanji[i]] >= 1)
            GM_openInTab(infoPage.replace("$K", kanji[i]));
        else
            GM_openInTab(infoFallback.replace("$K", kanji[i]));
    }
}

/*
 * Opens a dialog to confirm that the dictionary should be reset to its default value
 */
function resetKanjiDict() {
    if (window.prompt("You are about to reset your level dictionary. If you have modified it on your own, "
        + "all changes will be lost. Enter 'yes' to confirm.", "") == "yes")
    {
        var wk = getWKKanjiLevels();
        GM_setValue("dictionary", JSON.stringify(wk));
        GM_setValue("levelCount", wk.length);
    }
}

/*
 * Prompts a dialog that allows the user to change his set of additional known/seen kanji from other sources
 */
function setCustomKanji(mode) {
    var kanji = window.prompt("Please enter a list of kanji that should always be regarded as '" + mode + "'. " +
        "You may insert an entire text - all non-kanji characters will automatically be removed.", GM_getValue(mode + "Kanji", ""));
    if (kanji !== null) {
        kanji = getKanjiInString(kanji);
        GM_setValue(mode + "Kanji", kanji);
    }
}

/*
 * Prompts a dialog that allows the user to add new manually known/seen kanji
 */
function addCustomKanji(mode) {
    var kanji = window.prompt("Please enter the kanji that you want to add as '" + mode + "'. " +
        "You may insert an entire text - all non-kanji characters will automatically be removed.",
        getKanjiInString(window.getSelection().toString()));
    if (kanji !== null) {
        kanji =getKanjiInString(GM_getValue(mode + "Kanji", "") + kanji);
        GM_setValue(mode + "Kanji", kanji);
    }
}

/*
 * Prompts a dialog that allows the user to remove manually known/seen kanji
 */
function remCustomKanji(mode) {
    var kanji = window.prompt("Please enter the kanji that you want to remove from the '" + mode + "' list. " +
        "You may insert an entire text - all non-kanji characters will automatically be removed.",
        getKanjiInString(window.getSelection().toString()));
    if (kanji !== null) {
        filter = new RegExp("[" + kanji + "]");
        kanji = getKanjiInString(GM_getValue(mode + "Kanji", "").replace(filter, ""));
        GM_setValue(mode + "Kanji", kanji);
    }
}

/*
 * Removes all kanji from the additionally known/seen list 
 */
function resetCustomKanji(mode) {
    if (window.prompt("You are about to reset list of additional " + mode + "kanji. "
        + "All changes will be lost. Enter 'yes' to confirm.", "") == "yes") {
        GM_setValue(mode + "Kanji", "");
    }
}


/*
 * (Re-)highlight all elements, ignoring already highlighted elements
 */
var scannedBefore = false;
function rescanWebsite() {
    // ':not([class^=wk_])' will filter out already highlighted kanji for when we want to update dynamically loaded content
    if (!scannedBefore) {
        highlightKanji("body *:not(noscript):not(script):not(style):not(textarea):not([class^=wk_])");
        scannedBefore = true;
    } else {
        highlightKanji("body *:not(noscript):not(script):not(style):not(textarea)");
    }
}

/* 
 * Lets the user copy a list of each kanji marked as "known" (including additional ones)
 */
 function copyKnownKanji() {
    kanjiMap = unsafeWindow.kanjiMap;
    levelThreshold = unsafeWindow.levelThreshold;
    output = "";
    for (var key in kanjiMap) {
        if (kanjiMap[key] <= levelThreshold && kanjiMap[key] >= -1)
            output += key;
    }
    window.prompt("Press ctrl+C to copy this list. It includes all kanji up to the current level and those marked as known manually.", output);
 }

 /* 
 * Lets the user copy a list of each kanji not yet learned
 */
 function copyUnknownKanji() {
    kanjiMap = unsafeWindow.kanjiMap;
    levelThreshold = unsafeWindow.levelThreshold;
    output = "";
    for (var key in kanjiMap) {
        if (kanjiMap[key] > levelThreshold)
            output += key;
    }
    window.prompt("Press ctrl+C to copy this list. It includes all kanji that were not yet learned.", output);
 }

/*
 * Highlights all the Kanji within selector's elements
 */
function highlightKanji(selector) {
    // Retrieve global variables
    var kanjiMap = unsafeWindow.kanjiMap;
    var levelThreshold = unsafeWindow.levelThreshold;
    var levelCount = unsafeWindow.levelCount;
    var renderSettings = unsafeWindow.renderSettings;

    $(selector).forEachText(function (str) {
        var output = "";
        var previousClass = "";
        for (var i = 0; i < str.length; ++i) {
            var chr = str[i];

            // Not a kanji, just keep it the same
            if (kanjiRegexp.test(chr)) {
                var level = kanjiMap[chr];

                // Assume that Kanji is known
                var className = "";

                // Self-learned kanji
                if ((renderSettings & R_ADD_K) && level == -1)
                    className = "A";
                else if ((renderSettings & R_ADD_S) && level == -2)
                    className = "S";
                // Not in WaniKani, highlight as missing
                else if ((renderSettings & R_MISSING) && isNaN(level))
                    className = "X";
                // Kanji on the *current* level
                else if ((renderSettings & R_CURRENT) && level == levelThreshold)
                    className = "C";
                // Kanji known
                else if ((renderSettings & R_KNOWN) && level <= levelThreshold)
                    className = "K";
                // Kanji that will be in one of the upper levels
                else if ((renderSettings & R_UNKNOWN) && level > levelThreshold) {
                    var classIndex = (level - levelThreshold) / (levelCount - levelThreshold);
                    classIndex *= (COLOR_STEPS - 1);
                    className = Math.round(classIndex);
                }

                // NOTE to self: !== is needed because 0 == ""

                // Level changed from previous char, 
                if (className !== previousClass) {
                    if (previousClass !== "")
                        output += "</span>";

                    if (className !== "")
                        output += '<span class="wk_' + className + '">'; /*'" title="Level: ' + (level > 0 ? level : "None") + ' ">';*/
                }

                previousClass = className;
                output += chr;
                continue;
            }

            if (previousClass !== "")
                output += "</span>";
            previousClass = "";

            // Default: Write the character with no modifications
            output += chr;
        }

        // Close last opened span tag
        if (previousClass !== "")
            output += "</span>";

        return output;
    });
}

/*
 * Returns a string containing all kanji of the input string
 */
function getKanjiInString(str) {
    // Remove all non-kanji characters
    str = str.replace(notKanjiRegexp, "");
    // Remove duplicates
    str = str.split("").filter(function (x, n, s) {
        return s.indexOf(x) == n;
    }).sort().join("");
    return str;
}

/* 
 * Converts and returns a one-dimensional Kanji->Level map of the specified Level->Kanji dictionary.
 */
function buildKanjiMap(dict, additional) {
    var map = {};
    var dict = unsafeWindow.dictionary;
    var customKnown = unsafeWindow.knownKanji;
    var customSeen = unsafeWindow.seenKanji;

    // If the  dictionary is an array, indices (keys) are 0-based
    var offset = (dict instanceof Array) ? 1 : 0;

    for (var level in dict) {
        var kanjiList = dict[level];
        for (var i = 0; i < kanjiList.length; ++i) {
            map[kanjiList[i]] = parseInt(level) + offset;
        }
    }

    // Insert / update specified additional kanji
    for (var i = 0; i < customKnown.length; ++i) {
        // Only use the 'additional' tag for kanji that have not been in one of the levels yet!
        // ... and kanji that are not in the dictionary at all, of course!
        if (map[customKnown[i]] > unsafeWindow.levelThreshold
         || map[customKnown[i]] == null)
            map[customKnown[i]] = -1;
    }
    for (var i = 0; i < customSeen.length; ++i) {
        // Do the same for seen as for known
        if (map[customSeen[i]] > unsafeWindow.levelThreshold
         || map[customSeen[i]] == null)
            map[customSeen[i]] = -2;
    }

    return map;
}

/*
 * Returns all WK Kanji categorized by their respective levels. This is the default dictionary that is used by the script.
 */
function getWKKanjiLevels() {
    return [
      /* 1:*/ "上下大工八入山口九一人力川七十三二女",
      /* 2:*/ "玉本子丸正土犬夕出目了火五四才手天王左中月々田右六小立丁日刀千木水白文円",
      /* 3:*/ "矢市牛切方戸太父少友毛半心内生台母午北今古元外分公引止用万広冬",
      /* 4:*/ "竹車央写仕耳早気平花足打百氷虫字男主名不号他去皿先赤休申見貝石代礼糸町宝村世年",
      /* 5:*/ "角斤青体色来社当図毎羽林行金草里作多肉会交近兄雨米走同言自形皮空音学光考回谷声西何麦弟",
      /* 6:*/ "全後血両明京化国科亡死画地東食直前有私知活長曲首次夜姉点安室海羊店南星州茶思歩向妹",
      /* 7:*/ "辺付札鳥黒船必末氏失魚以組家欠未紙通民理由校雪強夏高教時弱週風記黄",
      /* 8:*/ "答反君局買雲楽数決絵住電森助馬間場医朝番所池究道役研身者支話投対",
      /* 9:*/ "受事美予服度発定談表客重持負相要新部和県保返乗屋売送苦泳仮験物具実試使勝界",
      /*10:*/ "進酒始業算運漢鳴集配飲終顔落農速頭聞院調鉄語葉習軽線最開頁親読求転路病横歌起",
      /*11:*/ "功成岸競争便老命指初味追神良意労級好昔低育令拾注利位仲放秒別特共努伝戦波洋働",
      /*12:*/ "悪息章登寒深倍勉消祭野階庭港暑湯僕島童員商都動第期植根短球泉流合陽歯族旅待温着",
      /*13:*/ "皆謝整橋選想器暗疑料情感様養緑熱億殺宿福鏡然詩練賞問館映願士課標銀駅像題輪",
      /*14:*/ "能芸術雰骨束周協例折基性妥卒固望材参完松約残季技格苺頑囲的念希狼",
      /*15:*/ "紀軍秋信岩仏建猫変晴築勇泣司区英丈夫飯計法晩昼毒昨帰式列浅単坂春寺",
      /*16:*/ "浴箱係治危冒留弁証存面遠園門府幸阪急笑荷政品守辞真関険典専冗取曜書",
      /*17:*/ "是結底因詳識劇干敗渉果官署察堂幻非愛薬覚鼻無常原栄喜恋悲塩席側兵説細梅虚警",
      /*18:*/ "告達焼借弓脳飴胸喫等枚忘苛訓種報句許可祈僧禁静座煙汽叩喉類洗禅",
      /*19:*/ "得加冊履忙閥布比歴続減易絡笛容団史昆徒宙混善順宇詞改乱節連舌暴財若",
      /*20:*/ "裕尻確械犯害機難災嫌困夢震在飛産罪穴被個議妨倒経率圧防余尾論厚妻",
      /*21:*/ "責条済委省制批断任素敵羨設評検岡増査判審件際企挙認資義権派務税解総",
      /*22:*/ "援態誕状賀各費姿勢諦示寝営坊罰案策提置域応宮袖吸過領脱統価値副観藤",
      /*23:*/ "呼崎施城護鬼割職秀俳停宅痒裁律導革贅乳収演現備則規準張優沢師幹看",
      /*24:*/ "庁額腕境燃担祝届違差象展層視環製述武型狭管載質量販供肩株触輸腰",
      /*25:*/ "慣居逮票属捕捉候輩況響効抜鮮満与莫掛隠模含訟限肥豊替景巻捜構影絞訴補渡",
      /*26:*/ "接再独獣菓討故較創造往励激占障我徴授鉛郵針従豚復河貯印振刺突怪汗筆",
      /*27:*/ "怒昇迷招腹睡康端極郎健誘貸惑痛退途給就靴眠暇段胃症濃締迫訪織悩屈",
      /*28:*/ "攻撃浜綺益児憲冷処微修博程絶凍巨稚幼並麗奇衆潔清録逆移精隊庫妙券傘婦",
      /*29:*/ "略積添寄宴板壊督僚杯娘診乾欧恐猛江韓雄航監宗請怖索臣催街詰緊閣促烈",
      /*30:*/ "更魅背騒飾預版柵旗浮越照漏系覧婚懐撮枕遊快貧延押乏匂盗購適翌渇符濡",
      /*31:*/ "帯廊離径融均除貨孫墓幾尋編陸探豪鑑泥巣普棒粉既救似富散華嘆偵驚掃菜脈徳倉",
      /*32:*/ "酸賛祖銭込衛机汚飼複染卵永績眼液採志興恩久党序雑桜密秘厳捨訳欲暖迎傷",
      /*33:*/ "灰装著裏閉股垂漠異皇拡屁暮忠肺誌操筋否盛宣賃敬尊熟噂砂簡蒸蔵糖納諸窓",
      /*34:*/ "豆枝揮刻爪承咳幕紅歓降奴聖推臓損磁誤源芋純薦丼腐沿射縮隷粋痩吐貴縦勤拝",
      /*35:*/ "熊噌彫杉喋銅舎酔炎彼紹介湖講寿測互油己払鍋獄戚為恥遅汁醤滞剣破亀厄酢",
      /*36:*/ "諾盟将舞債伎鹿換牙旧般津療継遺維奈核廃献沖摘及依縄鮭踏伸姓甘貿頼超幅",
      /*37:*/ "患狙陣塁弾葬抗崩遣掲爆眉恵漁香湾跳抱旬聴臨兆契刑募償抵戻昭串闘執跡削",
      /*38:*/ "伴齢宜噛賂賄房慮託却需璧致避描刊逃扱奥併膝傾緩奏娠妊贈択還繰抑懸称緒盤",
      /*39:*/ "控宛充渋岐埋鈴埼棋囚譲雇免群枠銃仙邦御慎躍謙阜片項斐隆圏勧拒稲奪鋼甲壁祉",
      /*40:*/ "拉敏吹唱衝戒兼薄堀剤雅孝頻駆俊嬉誉茂殿殖隣麺繁巡柱携褒排駐顧犠獲鋭敷妖透",
      /*41:*/ "棄凄至拠蜂儀炭衣潜偽畑蛍拳郷蜜仁遜侵嘘鉱喧伺徹瀬嘩墟酎措誠虎艦撤樹包",
      /*42:*/ "析弧到軸綱挑焦掘紛範括床握枢揚潟芝肝餅喪網克泊双柄哲斎袋揺滑堅暫糾荒",
      /*43:*/ "襲沼朗摩趣懲慰懇筒滅距籍露炉柔擦琴垣即威滋牧泰旨刷珍封斉沈撲裂潮貢誰",
      /*44:*/ "刃缶砲笠竜拶縁忍釣吉粒髪丘俺斗寸桃梨姫挨娯謎侍叱棚叫匹辛芽嵐涙雷塔朱翼",
      /*45:*/ "頃菌鐘舟嫁暦曇也塾呪湿稼疲翔賭霊溝狩脚澄塊狂嬢裸岳磨陰肌魂矛眺硬卓凶滝井",
      /*46:*/ "墨瞬泡穏孔椅菊涼綿魔寮鳩鈍鍛碁癖穂吾鍵盆庄猿棟誇瞳寧俵幽架黙斬帝租錬阻歳零",
      /*47:*/ "幣箸瞭崖炊粧墜欺滴塀霧扇扉恨帽憎佐挿伊詐如唇掌婆哀虹爽憩煎尺砕粘畳胴巾芯柳",
      /*48:*/ "遂畜脇殴咲鉢賢彩隙培踊闇斜尽霜穫麻騎辱灯蓄溶蚊帳塗貼輝憶悔耐盾蛇班飢餓迅脅",
      /*49:*/ "概拘煮覆駒悟慌謀鶴拓衰奨淡礎陛浸劣勘隔蹴桑尼珠抽壇陶妃刈紫唯剛征誓俗潤",
      /*50:*/ "偶巧鰐把駄洞伯唐彰諮廷蟹晶堰漂淀堤后疫翻鬱涯銘仰漫簿亭訂壮軌奮峰墳搬邪",
      /*51:*/ "又肯浦挟沸瓶召貞亮襟隅郡燥釈脂偉軒蓮慈塚玄肪耕媛邸喚苗隻膚軟郊頂濯渦聡枯",
      /*52:*/ "祥呂偏茨陥鎖賠恒綾没擁遭噴殊倫陳隼乃輔猟唆惰怠覇須牲秩孤芳貫糧颯慢膨遇",
      /*53:*/ "諭随胡搭錦鯉胞浄帥諒蒙曙惨稿啓披繊徐葵騰据莉緯瓜虐戴艇丹緋准舗壌駿剰寛",
      /*54:*/ "庶且顕杏栞欄冠酷叙逸紋阿愚尚拐悠勲疎謡哺栽践呈傲疾茜酬呆鎌粛茎痴荘鯨卸",
      /*55:*/ "累伏虜循粗凝栓瑛旦奉遼郭抹佳惜憂悼癒栃龍弥髄勿傍愉赴昌憾朴脊該之鎮尿賓那",
      /*56:*/ "匠拍縛飽柴蝶弦凛庸轄悦窮嘉弊遥洪紳呉穀摂寂宰陵凡尉錯靖恭縫舶搾猶窒碑智",
      /*57:*/ "盲醸凹弔凸烏敢堕鼓衡伐酵閲遮腸瑠乙楓膜紺蒼漬哉峡賊旋俸喝羅萌槽坪遍胎",
      /*58:*/ "陪扶迭鶏瑞暁剖凌藩譜璃淑傑殻錠媒嘱椎赦戯享濁肖憤朽奔帆菅酌慨絹窃硫",
      /*59:*/ "亜屯岬鋳拙詠慶酪篤侮堪禍雌睦胆擬漆閑憧卑姻忌曹峠吟礁沙蔑汰紡遷叔甚浪梓崇",
      /*60:*/ "煩款蛮廉劾某矯痢逝狐漸升婿匿謹藍桟殉坑罷妄漣藻泌唄畔倹拷醜冥渓湧寡慕"
    ];
};

/*
 * BASED ON (SLIGHT MODIFICATIONS)
 * jQuery replaceText - v1.1 - 11/21/2009
 * http://benalman.com/projects/jquery-replacetext-plugin/
 *
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function ($) {
    $.fn.forEachText = function (callback) {
        return this.each(function () {
            var f = this.firstChild,
                g, e, d = [];
            if (f) {
                do {
                    if (f.nodeType === 3) {
                        g = f.nodeValue;
                        e = callback(g);
                        if (e !== g) {
                            if (/</.test(e)) {
                                $(f).before(e);
                                d.push(f)
                            } else {
                                f.nodeValue = e
                            }
                        }
                    }
                } while (f = f.nextSibling)
            }
            d.length && $(d).remove()
        })
    }
})(jQuery);
