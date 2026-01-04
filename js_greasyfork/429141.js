// ==UserScript==
// @name        AO3: [Wrangling] UW Fandom Freeform Auto-checkbox
// @description Automatically check off UW freeform tags that contain or lack fandom-specific substrings
// @version     0.3

// @author      endofthyme
// @namespace   http://tampermonkey.net/
// @license     GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match       *://*.archiveofourown.org/tags/%E5%8E%9F%E7%A5%9E%20%7C%20Genshin%20Impact%20(Video%20Game)/wrangle*show=freeforms*status=unwrangled*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/429141/AO3%3A%20%5BWrangling%5D%20UW%20Fandom%20Freeform%20Auto-checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/429141/AO3%3A%20%5BWrangling%5D%20UW%20Fandom%20Freeform%20Auto-checkbox.meta.js
// ==/UserScript==

var INCLUDE_NOT_X_BUTTONS = true;

var fandom_keywords = new Map([
    ["TES",
     // characters
     ["akatosh", "almalexia", "azura", "dibella", "divayth", "mannimarco", "mehrunes", "neloth", "sithis", "sotha sil",
      // concepts
      "altmer", "dwemer", "daedr", "elder scrolls"]],
    ["Skyrim",
     // characters
     ["alduin", "ambarys", "arnbjorn", "balgruuf", "brynjolf", "cicero", "dragonborn", "dovah", "elisif", "erandur", "estormo",
      "faendal", "farkas", "hadvar", "harkon", "inigo", "kaidan", "lucien flav", "lydia", "marcurio", "mercer", "miraak",
      "nazeem", "odahviing", "ondolemar", "paarthurnax", "ralof", "serana", "siddgeir", "sinding", "skjor", "teldryn",
      "ulfric", "vilkas",
      // concepts
      "skyrim", "stormcloak"]],
]);

var CYRILLIC_REGEX = /[\u0400-\u04FF]/;
var CHINESE_REGEX = /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;

function hasNonLatinCharacters(input) {
    return CYRILLIC_REGEX.test(input) || CHINESE_REGEX.test(input);
}

function containsKeyword(tag_label, keyword) {
    return tag_label.text().toLowerCase().includes(keyword.toLowerCase());
}

function boldKeyword(tag_label, keyword) {
    return tag_label.html(tag_label.html().replace(new RegExp(keyword, 'gi'), '<b>$&</b>'));
}

(function($) {
    // add the button(s)
    fandom_keywords.forEach((value, key) => {
        $("thead").find("th:contains('Tag Name')").find("ul:contains('All')").append(
            $(`<ul class="actions" role="menu"><li><a id="auto_checkbox">${key}</a></li></ul>`));
        if (INCLUDE_NOT_X_BUTTONS) {
            $("thead").find("th:contains('Tag Name')").find("ul:contains('All')").append(
                $(`<ul class="actions" role="menu"><li><a id="neg_auto_checkbox">Not-${key}</a></li></ul>`));
        }
    });

    // when fandom button is pressed
    $("a[id='auto_checkbox']").on("click", function() {
        var current_fandom = $(this).text();
        $("tbody tr th[title='tag']").each(function(i, row) {
            var tag_label = $(this).find("label")
            var matching_keywords = fandom_keywords.get(current_fandom).filter(
                keyword => containsKeyword(tag_label, keyword));
            if (matching_keywords.length == 0) return;
            // Bold the matched keywords and check the boxes
            matching_keywords.forEach(keyword => boldKeyword(tag_label, keyword));
            var checkbox = $(this).find("input[type='checkbox']").each(function() {
                this.checked = true;
            });
        });
    });

    // when not-fandom button is pressed
    $("a[id='neg_auto_checkbox']").on("click", function() {
        var current_fandom = $(this).text().slice(4);
        $("tbody tr th[title='tag']").each(function(i, row) {
            var tag_label = $(this).find("label");
            if (hasNonLatinCharacters(tag_label.text())) {
                return;
            }
            var matching_keywords = fandom_keywords.get(current_fandom).filter(
                keyword => containsKeyword(tag_label, keyword));
            if (matching_keywords.length == 0) {
                // Check the boxes
                var checkbox = $(this).find("input[type='checkbox']").each(function() {
                    this.checked = true;
                });
            } else {
                // Bold the matched keywords
                matching_keywords.forEach(keyword => boldKeyword(tag_label, keyword));
            }
        });
    });
})(jQuery);