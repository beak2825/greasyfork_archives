// ==UserScript==
// @name           Replace Numbers on Webpages
// @description    Apply a math function of your choice to all numbers from 0-99 on a webpage. Inspired by JoeSimmons' "Replace Text On Webpages".
// @include        *
// @copyright      Anona
// @version        1.0
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @namespace      https://greasyfork.org/users/194312
// @downloadURL https://update.greasyfork.org/scripts/370010/Replace%20Numbers%20on%20Webpages.user.js
// @updateURL https://update.greasyfork.org/scripts/370010/Replace%20Numbers%20on%20Webpages.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /////////////////////////////////// USER EDITABLE VARIABLES ///////////////////////////////////
    var minimum = 50; // Lowest number that will have the below function applied. (min value: 0)
    var maximum = 90; // Highest number that will have the below function applied. (max value: 99)
    function userDefinedFunction(numberToReplace) { // Example: 50-90 will be halved and rounded.
        return Math.round(numberToReplace / 2);
    }
    /////////////////////////////////// USER EDITABLE VARIABLES ///////////////////////////////////

    var card = {0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven",
                12: "twelve", 20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"},
        ord = {0: "zero", 1: "fir", 2: "secon", 3: "thir", 4: "four", 5: "fif", 6: "six", 7: "seven", 8: "eigh", 9: "nine", 10: "ten", 11: "eleven",
               12: "twelf", 20: "twentie", 30: "thirtie", 40: "fortie", 50: "fiftie", 60: "sixtie", 70: "seventie", 80: "eightie", 90: "ninetie"},
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        text, texts, i;

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    function isUpperCase(str) {
        return str === str.toUpperCase();
    }

    function wordToNum(word) {
        switch (word.toLowerCase()) {
            case card[1]: case ord[1]: return 1;
            case card[2]: case ord[2]: return 2;
            case card[3]: case ord[3]: return 3;
            case card[4]: case ord[4]: return 4;
            case card[5]: case ord[5]: return 5;
            case card[6]: case ord[6]: return 6;
            case card[7]: case ord[7]: return 7;
            case card[8]: case ord[8]: return 8;
            case card[9]: case ord[9]: return 9;
            case card[10]: case ord[10]: return 10;
            case card[11]: case ord[11]: return 11;
            case card[12]: case ord[12]: return 12;
            case card[20]: case ord[20]: return 20;
            case card[30]: case ord[30]: return 30;
            case card[40]: case ord[40]: return 40;
            case card[50]: case ord[50]: return 50;
            case card[60]: case ord[60]: return 60;
            case card[70]: case ord[70]: return 70;
            case card[80]: case ord[80]: return 80;
            case card[90]: case ord[90]: return 90;
        }
        return 0;
    }

    function minusDigits(match, article, space, digits, ordinal) {
        if (Number(digits) < minimum || maximum < Number(digits)) return match;
        digits = userDefinedFunction(Number(digits)).toFixed();
        if (Number(digits) < 0 || 99 < Number(digits)) return match;
        if (digits.startsWith("8") || digits == "11" || digits == "18") {
            if (article.length == 1) article += "n";
        } else if (article.length == 2) article = article.slice(0, -1);
        if (ordinal) {
            if (digits.endsWith("1") && digits != "11") ordinal = "st";
            else if (digits.endsWith("2") && digits != "12") ordinal = "nd";
            else if (digits.endsWith("3") && digits != "13") ordinal = "rd";
            else ordinal = "th";
        }
        if (isUpperCase(match)) return (article + space + digits + ordinal).toUpperCase();
        return article + space + digits + ordinal;
    }

    function minusWords(match, article, space, digitOne, dash, digitTwo, teen, ordinal) {
        var num = (teen ? 10 : 0);
        num += wordToNum(digitOne);
        num += wordToNum(digitTwo);
        if (num < minimum || maximum < num) return match;
        var digits = userDefinedFunction(num).toFixed();
        if (Number(digits) < 0 || 99 < Number(digits)) return match;
        if (digits.startsWith("8") || digits == "11" || digits == "18") {
            if (article.length == 1) article += "n";
        } else if (article.length == 2) article = article.slice(0, -1);
        teen = (12 < Number(digits) && Number(digits) < 20 ? "teen" : "");
        if (ordinal) {
            if (digits.endsWith("1") && digits != "11") ordinal = "st";
            else if (digits.endsWith("2") && digits != "12") ordinal = "d";
            else if (digits.endsWith("3") && digits != "13") ordinal = "d";
            else ordinal = "th";
        }
        var capital = ((digitOne && isUpperCase(digitOne[0])) || isUpperCase(digitTwo[0]));
        digitOne = (Number(digits) > 19 && digits[1] != "0" ? card[digits[0] * 10] : "");
        digitTwo = (Number(digits) > 12 ? (ordinal || teen ? ord[digits[1] % 10] : card[digits[1] % 10]) : (ordinal || teen ? ord[digits] : card[digits]));
        if (digitOne && num < 21) dash = "-";
        if (isUpperCase(match)) return (article + space + digitOne + dash + digitTwo + teen + ordinal).toUpperCase();
        else if (capital && digitOne) digitOne = digitOne[0].toUpperCase() + digitOne.slice(1);
        else if (capital) digitTwo = digitTwo[0].toUpperCase() + digitTwo.slice(1);
        return article + space + digitOne + dash + digitTwo + teen + ordinal;
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if (isTagOk(text.parentNode.tagName)) {
            text.data = text.data.replace(/\b((?:a|an)?)(\s?)(\d?\d)((?:st|nd|rd|th)?)(?!\d|s|\W7|\W?something)/gi, minusDigits);
            text.data = text.data.replace(/(?:\b((?:a|an)?)(\s?))((?:(?:twent|thirt|fort|fift|sixt|sevent|eight|ninet)(?:y|ie)(?=\W?(?:one|fir|two|secon|three|thir|four|five|fif|six|seven|eight(?!h|een)|eigh|nine)))?)(\W?)(one|fir|two|secon|three|thir|four|five|fif|six|seven|eight(?!h|een)|eigh|nine|ten|eleven|twelve|twelf|(?:(?:twent|thirt|fort|fift|sixt|sevent|eight|ninet)(?:y|ie)))((?:teen)?)((?:st|d|th)?)(?!s|\W?something)/gi, minusWords);
        }
    }

}());