// ==UserScript==
// @name         Alis Bold Font Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  changes font of writing in chat
// @author       Zimek
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374915/Alis%20Bold%20Font%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/374915/Alis%20Bold%20Font%20Chat.meta.js
// ==/UserScript==

console.log("%cAlis Bold Chat Font Extension by Zimek", "background: #222; color: #f9ff87; padding: 5px;font-size: 15px;");


$(`
<div style="position:absolute;margin-left: -270px;width: 150px;margin-top: 340px;padding: 10px;">
<label><input id="boldfont" class="uk-checkbox zimekbox" type="checkbox" style="margin-top: -2px;"> Bold chat font</label><br>
</div>
`).insertBefore("#profilec")

var boldFont = document.getElementById("boldfont");
boldFont.onclick = function () {
    if (boldFont.checked) {
console.log("%cBold chat font ENABLED", "background: #222; color: #51ff7f; padding: 3px;font-size: 13px;");
$("#input_box2").on("keyup", function() {
  var detectedFont = $("#input_box2").val();
  for(var foundFont in replacementFont){
    if(replacementFont.hasOwnProperty(foundFont)){
      detectedFont = detectedFont.replace(foundFont,replacementFont[foundFont]);
    }
  }
  $(this).val(detectedFont);
});
}
else {
return false;
}
};

$(`<style>
.zimekbox{width: 27px;height: 27px;margin-top: 0px;}
</style>`).appendTo('head');

var replacementFont = {
    'a': '𝗮',
    'A': '𝗔',
    'b': '𝗯',
    'B': '𝗕',
    'c': '𝗰',
    'C': '𝗖',
    'd': '𝗱',
    'D': '𝗗',
    'e': '𝗲',
    'E': '𝗘',
    'f': '𝗳',
    'F': '𝗙',
    'g': '𝗴',
    'G': '𝗚',
    'h': '𝗵',
    'H': '𝗛',
    'i': '𝗶',
    'I': '𝗜',
    'j': '𝗷',
    'J': '𝗝',
    'k': '𝗸',
    'K': '𝗞',
    'l': '𝗹',
    'L': '𝗟',
    'm': '𝗺',
    'M': '𝗠',
    'n': '𝗻',
    'N': '𝗡',
    'o': '𝗼',
    'O': '𝗢',
    'p': '𝗽',
    'P': '𝗣',
    'q': '𝗾',
    'Q': '𝗤',
    'r': '𝗿',
    'R': '𝗥',
    's': '𝘀',
    'S': '𝗦',
    't': '𝘁',
    'T': '𝗧',
    'u': '𝘂',
    'U': '𝗨',
    'v': '𝘃',
    'V': '𝗩',
    'w': '𝘄',
    'W': '𝗪',
    'x': '𝘅',
    'X': '𝗫',
    'y': '𝘆',
    'Y': '𝗬',
    'z': '𝘇',
    'Z': '𝗭',
    '1': '𝟭',
    '2': '𝟮',
    '3': '𝟯',
    '4': '𝟰',
    '5': '𝟱',
    '6': '𝟲',
    '7': '𝟳',
    '8': '𝟴',
    '9': '𝟵',
    '0': '𝟬',
    '/𝗹𝗲𝗻𝗻𝘆': '( ͡° ͜ʖ ͡°)',
    '/𝘀𝗵𝗿𝘂𝗴': '¯\\_(ツ)_/¯',
//Letters changed
    'а': '𝗮',
    'А': '𝗔',
    'о': '𝗼',
    'О': '𝗢',
    'е': '𝗲',
    'Е': '𝗘',
    'ѕ': '𝘀',
    'Ѕ': '𝗦',
    'р': '𝗽',
    'Р': '𝗣',
    'с': '𝗰',
    'С': '𝗖',
};

//𝗮𝗔𝗯𝗕𝗰𝗖𝗱𝗗𝗲𝗘𝗳𝗙𝗴𝗚𝗵𝗛𝗶𝗜𝗷𝗝𝗸𝗞𝗹𝗟𝗺𝗠𝗻𝗡𝗼𝗢𝗽𝗣𝗾𝗤𝗿𝗥𝘀𝗦𝘁𝗧𝘂𝗨𝘃𝗩𝘄𝗪𝘅𝗫𝘆𝗬𝘇𝗭
//aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ
//𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵𝟬

/*    'a': 'а',
    'A': 'А',
    'o': 'о',
    'O': 'О',
    'e': 'е',
    'E': 'Е',
    's': 'ѕ',
    'S': 'Ѕ',
    'p': 'р',
    'P': 'Р',
    'c': 'с',
    'C': 'С', */