// ==UserScript==
// @name         10ff japanese romaji -> hiragana typing script
// @namespace    https://www.ayasu.com
// @version      0.32
// @description  japanese
// @author       ayasu (big thanks to permil)
// @match        *://10fastfingers.com/typing-test/*
// @match        *://10fastfingers.com/widget*
// @match        *://10fastfingers.com/competition/*
// @match        *://10fastfingers.com/advanced-typing-test/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379322/10ff%20japanese%20romaji%20-%3E%20hiragana%20typing%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/379322/10ff%20japanese%20romaji%20-%3E%20hiragana%20typing%20script.meta.js
// ==/UserScript==

// original code http://c4se.hatenablog.com/entry/20100330/1269906760
// License: Public Domain
// ajusted a bit by permil
// NOTE: commented-out 'wyi' and 'wye' because current IME doesn't seem to support them
//       and added mapping, probably it didn't exist at that time, still not sure something missed
var roman2hiragana = {
    'a':'あ', 'i':'い', 'u':'う', 'e':'え', 'o':'お',
    'ka':'か', 'ki':'き', 'ku':'く', 'ke':'け', 'ko':'こ',
    'sa':'さ', 'si':'し', 'su':'す', 'se':'せ', 'so':'そ',
    'ta':'た', 'ti':'ち', 'tu':'つ', 'te':'て', 'to':'と', 'chi':'ち', 'tsu':'つ',
    'na':'な', 'ni':'に', 'nu':'ぬ', 'ne':'ね', 'no':'の',
    'ha':'は', 'hi':'ひ', 'hu':'ふ', 'he':'へ', 'ho':'ほ', 'fu':'ふ',
    'ma':'ま', 'mi':'み', 'mu':'む', 'me':'め', 'mo':'も',
    'ya':'や', 'yi':'い', 'yu':'ゆ', 'ye':'いぇ', 'yo':'よ',
    'ra':'ら', 'ri':'り', 'ru':'る', 're':'れ', 'ro':'ろ',
    'wa':'わ', 'wu':'う', 'wo':'を',
    'nn':'ん',
    'ga':'が', 'gi':'ぎ', 'gu':'ぐ', 'ge':'げ', 'go':'ご',
    'za':'ざ', 'zi':'じ', 'zu':'ず', 'ze':'ぜ', 'zo':'ぞ', 'ji':'じ',
    'da':'だ', 'di':'ぢ', 'du':'づ', 'de':'で', 'do':'ど',
    'ba':'ば', 'bi':'び', 'bu':'ぶ', 'be':'べ', 'bo':'ぼ',
    'pa':'ぱ', 'pi':'ぴ', 'pu':'ぷ', 'pe':'ぺ', 'po':'ぽ',
    'kya':'きゃ', 'kyu':'きゅ', 'kyo':'きょ',
    'sya':'しゃ', 'syu':'しゅ', 'syo':'しょ',
    'sha':'しゃ', 'shu':'しゅ', 'sho':'しょ',
    'tya':'ちゃ', 'tyi':'ちぃ', 'tyu':'ちゅ', 'tye':'ちぇ', 'tyo':'ちょ', 'cha':'ちゃ', 'chu':'ちゅ', 'che':'ちぇ', 'cho':'ちょ',
    'nya':'にゃ', 'nyi':'にぃ', 'nyu':'にゅ', 'nye':'にぇ', 'nyo':'にょ',
    'hya':'ひゃ', 'hyi':'ひぃ', 'hyu':'ひゅ', 'hye':'ひぇ', 'hyo':'ひょ',
    'mya':'みゃ', 'myi':'みぃ', 'myu':'みゅ', 'mye':'みぇ', 'myo':'みょ',
    'rya':'りゃ', 'ryi':'りぃ', 'ryu':'りゅ', 'rye':'りぇ', 'ryo':'りょ',
    'gya':'ぎゃ', 'gyi':'ぎぃ', 'gyu':'ぎゅ', 'gye':'ぎぇ', 'gyo':'ぎょ',
    'zya':'じゃ', 'zyi':'じぃ', 'zyu':'じゅ', 'zye':'じぇ', 'zyo':'じょ',
    'ja':'じゃ', 'ju':'じゅ', 'je':'じぇ', 'jo':'じょ', 'jya':'じゃ', 'jyi':'じぃ', 'jyu':'じゅ', 'jye':'じぇ', 'jyo':'じょ',
    'dya':'ぢゃ', 'dyi':'ぢぃ', 'dyu':'ぢゅ', 'dye':'ぢぇ', 'dyo':'ぢょ',
    'bya':'びゃ', 'byi':'びぃ', 'byu':'びゅ', 'bye':'びぇ', 'byo':'びょ',
    'pya':'ぴゃ', 'pyi':'ぴぃ', 'pyu':'ぴゅ', 'pye':'ぴぇ', 'pyo':'ぴょ',
    'fa':'ふぁ', 'fi':'ふぃ', 'fe':'ふぇ', 'fo':'ふぉ',
    'fya':'ふゃ', 'fyu':'ふゅ', 'fyo':'ふょ',
    'xa':'ぁ', 'xi':'ぃ', 'xu':'ぅ', 'xe':'ぇ', 'xo':'ぉ', 'la':'ぁ', 'li':'ぃ', 'lu':'ぅ', 'le':'ぇ', 'lo':'ぉ',
    'xya':'ゃ', 'xyu':'ゅ', 'xyo':'ょ',
    'xtu':'っ', 'xtsu':'っ',
    'wi':'うぃ', 'we':'うぇ',
    'va':'ヴぁ', 'vi':'ヴぃ', 'vu':'ヴ', 've':'ヴぇ', 'vo':'ヴぉ',

    'ca':'か', 'ci':'し', 'cu':'く', 'ce':'せ', 'co':'こ',
    'shi':'し',
    '-':'ー',
    'xn':'ん',
    'lya':'ゃ', 'lyi':'ぃ', 'lyu':'ゅ', 'lye': 'ぇ', 'lyo': 'ょ',
    'xtsu':'っ', 'ltsu':'っ',
    'cya':'ちゃ', 'cyi':'ちぃ', 'cyu':'ちゅ', 'cye':'ちぇ', 'cyo':'ちょ',
    'tha':'てゃ', 'thi':'てぃ', 'thu':'てゅ', 'the':'てぇ', 'tho':'てょ',
    'dha':'でゃ', 'dhi':'でぃ', 'dhu':'でゅ', 'dhe':'でぇ', 'dho':'でょ'
};

/*
	 * roman -> hiragana
	 *
	 * @param (String) roman:
	 * @return (String): hiragana
	 */
function r2h(roman, isEnd) {
    var i, iz, match, regex,
        hiragana = '', table = roman2hiragana;

    regex = new RegExp((function(table){
        var key,
            s = '^(?:';

        for (key in table) if (table.hasOwnProperty(key)) {
            s += key + '|';
        }
        return s + '(?:n(?![aiueo]|y[aiueo]|$))|' + '([^aiueon])\\1)';
    })(table));
    for (i = 0, iz = roman.length; i < iz; ++i) {
        if (match = roman.slice(i).match(regex)) {
            if (match[0] === 'n') {
                hiragana += 'ん';
            } else if (/^([^nー])\1$/.test(match[0]) && /^[A-Za-z\-]+$/.test(match[0])) {
                //(/^[A-Za-z\-]+$/.test(match[0]))
                hiragana += 'っ';
                --i;
            } else {
                if (table[match[0]] != undefined) {
                    hiragana += table[match[0]];
                }
                else
                    hiragana += match[0];

            }
            i += match[0].length - 1;
        } else {
            hiragana += roman[i];
        }
    }
    console.log(hiragana);
    if (hiragana.endsWith('n') && isEnd) { // NOTE: special treat for the end of words
        hiragana = hiragana.slice(0, -1) + 'ん';
    }
    console.log(hiragana);
    return hiragana;
}

$inputfield.keyup(function(event) {
        $inputfield.val(r2h($inputfield.val(), false));
});


$inputfield.keypress(function(event) {
    if (event.which == 32) {
        $inputfield.val(r2h($inputfield.val(), true));
    }
});
