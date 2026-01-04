// ==UserScript==
// @name        Jitai
// @version     1.3.2-webfonts2
// @description Display WaniKani reviews in randomized fonts, for more varied reading training.
// @author      Samuel (@obskyr), edits by @marciska
// @copyright   2016-2018, obskyr
// @license     MIT
// @namespace   http://obskyr.io/
// @homepageURL https://gist.github.com/obskyr/9f3c77cf6bf663792c6e
// @icon        http://i.imgur.com/qyuR9bD.png
// @match       https://www.wanikani.com/extra_study/session*
// @match       https://www.wanikani.com/review/session*
// @match       https://preview.wanikani.com/extra_study/session*
// @match       https://preview.wanikani.com/review/session*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/458188/Jitai.user.js
// @updateURL https://update.greasyfork.org/scripts/458188/Jitai.meta.js
// ==/UserScript==

// bugfix: add fallback option for safari
const USE_WEBFONT = true; // use fonts from GoogleFonts
const USE_RTIYCFONT = false; // use fonts from Read that if you can script
const USE_LOCALFONT = true; // use local fonts installed on machine (on safari doesn't work)

/*
    To control which fonts to choose from, edit this list.
    If you feel too many fonts of a certain type are showing
    up, remove a few of those from the list. If you've got
    fonts that aren't in the list that you'd like to be used,
    add their names and they'll be in the rotation.
*/
var existingFonts = [];

function loadGoogleFonts() {
    const fonts = [
        "Zen Kurenaido",
        "Kaisei Opti",
        "Reggae One",
        "New Tegomin",
        "Yuji Boku",
        "Yuji Mai",
        "Yuji Syuku",
        "DotGothic16",
        "Hachi Maru Pop",
        "Yomogi",
        "Pota One",
        "Dela Gothic One",
        "RocknRoll One",
        "Stick",
        "Yusei Magic",
        "Kaisei Decol",
        "Kaisei Tokumin"
    ];
    // include all fonts in the stylesheet
    fonts.forEach((font) => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css?family=" +
            font.replace(/ /g, "+") +
            "&subset=japanese";
        link.rel = "stylesheet";
        document.head.append(link);
        existingFonts.push(font);
    });
}
async function loadRTIYCFonts() {
    // Load fonts from google fonts
    // code partly copied from: https://greasyfork.org/scripts/442373-wk-read-that-if-you-can/code/WK%20Read%20that%20if%20you%20can.user.js

    // fetch fonts
    const fetchedFonts = (await (
      await fetch(
        window.atob("aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vd2ViZm9udHMvdjEvd2ViZm9udHM/a2V5PQ==") + "AIzaSyAhd-3ke-7i5MBSJGF4HdLffjqhGvggJvo&sort=alpha")
      ).json())
      .items
      .filter((font) => font.subsets.includes("japanese"));

    // include all fonts in the stylesheet
    fetchedFonts.forEach((font) => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css?family=" +
            font.family.replace(/ /g, "+") +
            "&subset=japanese";
        link.rel = "stylesheet";
        document.head.append(link);
        existingFonts.push(font.family);
    });
}
function loadLocalFonts() {
    // note: even on safari, this will not error out - it simply cannot find most of the below fonts
    const fonts = [
        // Default Windows fonts
        "Meiryo, メイリオ",
        "MS PGothic, ＭＳ Ｐゴシック, MS Gothic, ＭＳ ゴック",
        "MS PMincho, ＭＳ Ｐ明朝, MS Mincho, ＭＳ 明朝",
        "Yu Gothic, YuGothic",
        "Yu Mincho, YuMincho",

        // Default OS X fonts
        "Hiragino Kaku Gothic Pro, ヒラギノ角ゴ Pro W3",
        "Hiragino Maru Gothic Pro, ヒラギノ丸ゴ Pro W3",
        "Hiragino Mincho Pro, ヒラギノ明朝 Pro W3",

        // Common Linux fonts
        "Takao Gothic, TakaoGothic",
        "Takao Mincho, TakaoMincho",
        "Sazanami Gothic",
        "Sazanami Mincho",
        "Kochi Gothic",
        "Kochi Mincho",
        "Dejima Mincho",
        "Ume Gothic",
        "Ume Mincho",

        // Other Japanese fonts people use.
        // You might want to try some of these!
        "EPSON 行書体Ｍ",
        "EPSON 正楷書体Ｍ",
        "EPSON 教科書体Ｍ",
        "EPSON 太明朝体Ｂ",
        "EPSON 太行書体Ｂ",
        "EPSON 丸ゴシック体Ｍ",
        "cinecaption",
        "nagayama_kai",
        "A-OTF Shin Maru Go Pro",
        "Hosofuwafont",
        "ChihayaGothic",
        "'chifont+', chifont",
        "darts font",
        "santyoume-font",
        "FC-Flower",
        "ArmedBanana", // This one is completely absurd. I recommend it.
        "HakusyuKaisyoExtraBold_kk",
        "aoyagireisyosimo2, AoyagiKouzanFont2OTF",
        "aquafont",

        // Add your fonts here!
        "Fake font name that you can change",
        "Another fake font name",
        "Just add them like this!",
        "Quotes around the name, comma after."
    ];
    for (var i = 0; i < fonts.length; i++) {
        var fontName = fonts[i];
        if (fontExists(fontName)) {
            existingFonts.push(fontName);
        }
    }
}
function fontExists(fontName) {
    // Approach from kirupa.com/html5/detect_whether_font_is_installed.htm - thanks!
    // Will return false for the browser's default monospace font, sadly.
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var text = "wim-—l~ツ亻".repeat(100); // Characters with widths that often vary between fonts.

    context.font = "72px monospace";
    var defaultWidth = context.measureText(text).width;

    // Microsoft Edge raises an error when a context's font is set to a string
    // containing certain special characters... so that needs to be handled.
    try {
        context.font = "72px " + fontName + ", monospace";
    } catch (e) {
        return false;
    }
    var testWidth = context.measureText(text).width;

    return testWidth != defaultWidth;
}

// Append GoogleFonts Preconnect Link (if set)
if (USE_RTIYCFONT || USE_WEBFONT) {
    const googleApiLink = document.createElement("link");
    googleApiLink.rel = "preconnect";
    googleApiLink.href = "https://fonts.googleapis.com";
    const gstaticLink = document.createElement("link");
    gstaticLink.rel = "preconnect";
    gstaticLink.href = "https://fonts.gstatic.com";
    gstaticLink.crossOrigin = true;
    document.head.append(googleApiLink);
    document.head.append(gstaticLink);
}

// Load fonts from Read that if you can script (if set)
if (USE_RTIYCFONT) {
    loadRTIYCFonts().then();
}
// Load webfonts (if set)
if (USE_WEBFONT) {
    loadGoogleFonts();
}
// check for fonts on system
if (USE_LOCALFONT) {
    loadLocalFonts();
}

function canRepresentGlyphs(fontName, glyphs) {
    var canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    var context = canvas.getContext("2d");
    context.textBaseline = 'top';

    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    var blankDataUrl = blank.toDataURL();

    context.font = "24px " + fontName;

    var result = true;
    for (var i = 0; i < glyphs.length; i++) {
        context.fillText(glyphs[i], 0, 0);
        if (canvas.toDataURL() === blankDataUrl) {
            result = false;
            break;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    return result;
}

var jitai = {
    setToRandomFont: function(glyphs) {
        // The font is set as a randomly shuffled list of the existing fonts
        // in order to always show a random font, even if the first one chosen
        // doesn't have a certain glyph being attempted to be displayed.
        var randomlyOrdered = this.getShuffledFonts();

        // Some fonts don't contain certain radicals, for example, so it's best
        // to check that the font used can represent all the glyphs. The reason
        // the browser can't switch automatically is that some fonts report that
        // they have a glyph, when in fact they just show up blank.
        var currentFont;
        if (glyphs) {
            for (var i = 0; i < randomlyOrdered.length; i++) {
                var fontName = randomlyOrdered[i];
                if (canRepresentGlyphs(fontName, glyphs)) {
                    currentFont = fontName;
                    break;
                }
            }
        } else {
            currentFont = randomlyOrdered.join(', ');
        }

        this.currentFont = currentFont;

        jitai.setHoverFont(jitai.defaultFont);
        this.$characterSpan.css('font-family', currentFont);
    },

    setToDefaultFont: function() {
        jitai.setHoverFont(jitai.currentFont);
        this.$characterSpan.css('font-family', '');
    },

    setHoverFont: function(fontName) {
        this.$hoverStyle.text("#character span:hover {font-family: " + fontName + " !important;}");
    },

    getShuffledFonts: function() {
        // This shouldn't have to be part of the Jitai object,
        // but it uses Jitai's local copy of Math.random, so
        // this is pretty much the most reasonable way to do it.
        var fonts = existingFonts.slice();
        for (var i = fonts.length; i > 0;) {
            var otherIndex = Math.floor(this.random() * i);
            i--;

            var temp = fonts[i];
            fonts[i] = fonts[otherIndex];
            fonts[otherIndex] = temp;
        }
        return fonts;
    },

    init: function() {
        // Reorder scripts seem to like overwriting Math.random(!?), so this
        // workaround is required for Jitai to work in conjunction with them.
        var iframe = document.createElement('iframe');
        iframe.className = 'jitai-workaround-for-reorder-script-compatibility';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        this.random = iframe.contentWindow.Math.random;

        this.$characterSpan = $('#character span');
        this.defaultFont = this.$characterSpan.css('font-family');

        this.$hoverStyle = $('<style/>', {'type': 'text/css'});
        $('head').append(this.$hoverStyle);

        // answerChecker.evaluate is only called when checking the answer, which
        // is why we catch it, check for the "proceed to correct/incorrect display"
        // condition, and set the font back to default if it's a non-stopping answer.
        var oldEvaluate = answerChecker.evaluate;
        answerChecker.evaluate = function(questionType, answer) {
            var result = oldEvaluate.apply(this, [questionType, answer]);

            if (!result.exception) {
                jitai.setToDefaultFont();
            }

            return result;
        };

        // $.jStorage.set('currentItem') is only called right when switching to a
        // new question, which is why we hook into it to randomize the font at the
        // exact right time: when a new item shows up.
        var oldSet = $.jStorage.set;
        $.jStorage.set = function(key, value, options) {
            var ret = oldSet.apply(this, [key, value, options]);

            if (key === 'currentItem') {
                jitai.setToRandomFont(value.kan || value.voc || value.rad);
            }

            return ret;
        };
    }
};

$(document).ready(function() {
    jitai.init();

    // Make sure page doesn't jump around on hover.
    var $heightStyle = $('<style/>', {'type': 'text/css'});
    var heightCss = "";

    // The different heights here are equal to the different line-heights.
    heightCss += "#question #character {height: 1.6em;}";
    heightCss += "#question #character.vocabulary {height: 3.21em;}";
    heightCss += "@media (max-width: 767px) {";
    heightCss += "    #question #character {height: 2.4em;}";
    heightCss += "    #question #character.vocabulary {height: 4.85em;}";
    heightCss += "}";

    $heightStyle.text(heightCss);
    $('head').append($heightStyle);
});
