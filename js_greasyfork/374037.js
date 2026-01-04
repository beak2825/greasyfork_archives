// ==UserScript==
// @name         GotaFancyMessages
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Replace your boring messages by fancy ones !
// @author       Ehab Eqbal (7liwa)
// @match        https://gota.io/web/
// @license      7liwa (ehab)
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/374037/GotaFancyMessages.user.js
// @updateURL https://update.greasyfork.org/scripts/374037/GotaFancyMessages.meta.js
// ==/UserScript==

const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const letters = [
    "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙",
    "𝐀Ⓑ𝕔๔ＥŦgħ𝒾ʲ𝕂ㄥмภό𝓅𝓠я𝐒ⓣ𝐔𝓿ⓦ𝐗ү𝐳𝐀Ⓑ𝕔๔ＥŦgħ𝒾ʲ𝕂ㄥмภό𝓅𝓠я𝐒ⓣ𝐔𝓿ⓦ𝐗ү𝐳  ",
    "ஜ۩۞۩ஜ 𝒶ｂⓒ𝒹𝓔𝒇ＧĦ𝓘𝐣Ⓚ𝓛𝐦ŇｏᑭᵠŘ𝓈𝔱𝕌𝕧𝕎χ¥Ｚ ஜ۩۞۩ஜஜ۩۞۩ஜ 𝒶ｂⓒ𝒹𝓔𝒇ＧĦ𝓘𝐣Ⓚ𝓛𝐦ŇｏᑭᵠŘ𝓈𝔱𝕌𝕧𝕎χ¥Ｚ ஜ۩۞۩ஜ",
    "ƹʏxwvuƚꙅɿpqoᴎm|ʞꞁiʜǫᎸɘbɔdɒƹʏxwvuƚꙅɿpqoᴎm|ʞꞁiʜǫᎸɘbɔdɒ",
    "åß¢Ðê£ghïjklmñðþqr§†µvwx¥z",
    "αв¢∂єƒgнιנкℓмησρqяѕтυνωχуz",
    "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
    "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
    "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ",
    "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩",
    "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
    "ą̷̨͇͓̼̤̯̤͂̈́b̴̮̓̈́̇c̵͚̮͍̰͑́̇͠͝͝d̷̡̦͓̜̊̀̾͑̽̀͜e̷̡̛̱̥͈̓̒̃͑̅̎̍̉ḟ̷̜͉͎͎̳̼̈́̉̑ǵ̶͈̼͓̟̪̹͒̒h̴̡̻͕̭̖̫͓̥̟͊̌̄̐̚i̶̡͖̪̜̎̿̉̄̔̈̽̕̚͝j̵̧̙̣͓͕̲̩̮̉̌̊̂͋̏̚͝͝k̵̢̪̺͕͛͑̋̑̔l̸̦̤̞̏͐͝m̶̛̛͚̌͛̈́͊͗̊͝n̵͙͈̯͂̃̈͆͊͂͘̕̚͠ỏ̷̯͂̃̄̽͠p̴̘̅̄̈́̋́̚͜q̵̛͓̫̣̥̙̹̜̓̀̅̌r̵͎̭̙̞̙̼̙̂̆̀͗̉s̸̯̣̜̀͠t̶̢͚̙͐̔̀̊̽͂̍u̷̠̮͒͗͐̂̀̀̎̚͠͝v̷̲̲͓͌́͒w̶͈̪̩̲͎͓̪̥̽̕͜x̵͎̖̹̝̰̬̘̾y̷͕̼̹̲̙̬̿̾̈́̐z̵̢̨͎̞̣̭̳̓̽̈́̒͝ą̷̨͇͓̼̤̯̤͂̈́b̴̮̓̈́̇c̵͚̮͍̰͑́̇͠͝͝d̷̡̦͓̜̊̀̾͑̽̀͜e̷̡̛̱̥͈̓̒̃͑̅̎̍̉ḟ̷̜͉͎͎̳̼̈́̉̑ǵ̶͈̼͓̟̪̹͒̒h̴̡̻͕̭̖̫͓̥̟͊̌̄̐̚i̶̡͖̪̜̎̿̉̄̔̈̽̕̚͝j̵̧̙̣͓͕̲̩̮̉̌̊̂͋̏̚͝͝k̵̢̪̺͕͛͑̋̑̔l̸̦̤̞̏͐͝m̶̛̛͚̌͛̈́͊͗̊͝n̵͙͈̯͂̃̈͆͊͂͘̕̚͠ỏ̷̯͂̃̄̽͠p̴̘̅̄̈́̋́̚͜q̵̛͓̫̣̥̙̹̜̓̀̅̌r̵͎̭̙̞̙̼̙̂̆̀͗̉s̸̯̣̜̀͠t̶̢͚̙͐̔̀̊̽͂̍u̷̠̮͒͗͐̂̀̀̎̚͠͝v̷̲̲͓͌́͒w̶͈̪̩̲͎͓̪̥̽̕͜x̵͎̖̹̝̰̬̘̾y̷͕̼̹̲̙̬̿̾̈́̐z̵̢̨͎̞̣̭̳̓̽̈́̒͝",
    "ค๖¢໓ēfງhiวkl๓ຖ໐p๑rŞtนงຟxฯຊค๖¢໓ēfງhiวkl๓ຖ໐p๑rŞtนงຟxฯຊ",
    "ąცƈɖɛʄɠɧıʝƙƖɱŋơ℘զཞʂɬų۷ῳҳყʑąცƈɖɛʄɠɧıʝƙƖɱŋơ℘զཞʂɬų۷ῳҳყʑ",
];

const styles = [
    "Normal",
    "𝐁𝐨𝐥𝐝",
    "𝘐𝘵𝘢𝘭𝘪𝘤",
    "𝘽𝙤𝙡𝙙 - 𝙄𝙩𝙖𝙡𝙞𝙘",
    "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",
    "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
    "𝕭𝖔𝖑𝖉 - 𝕱𝖗𝖆𝖐𝖙𝖚𝖗",
    "𝐻𝒶𝓃𝒹𝓌𝓇𝒾𝓉𝒾𝓃𝑔",
    "𝓑𝓸𝓵𝓭 - 𝓗𝓪𝓷𝓭𝔀𝓻𝓲𝓽𝓲𝓷𝓰",
    "Ⓑⓤⓑⓑⓛⓔⓢ",
    "🅑🅛🅐🅒🅚 🅑🅤🅑🅑🅛🅔🅢",
    "𝔻𝕠𝕦𝕓𝕝𝕖",
    "Ｔｈｉｎ",
    "sᴍᴀʟʟ ᴄᴀᴘs",
    "ᔕᑭEᑕIᗩᒪ"
];


var styleSelect = document.createElement("select");
styleSelect.style.backgroundColor = "#00a7ff";
styleSelect.style.clour= "White"

for (var k = 0; k < styles.length; k++) {
    var option = document.createElement("option");
    option.text = styles[k];
    styleSelect.add(option);
} document.getElementById("chat-container").appendChild(styleSelect);

styleSelect.selectedIndex = GM_getValue("style");
styleSelect.onchange = function() { GM_setValue("style", styleSelect.selectedIndex); }

var chatInput = document.getElementById("chat-input");

chatInput.onkeyup = function() {
    if (styleSelect.selectedIndex !== 0 & !chatInput.value.startsWith('/') | chatInput.value.startsWith("/p ")) {
        var fancyText = (chatInput.value.startsWith("/p ")) ? chatInput.value.substr(3) : chatInput.value;
        for (var k = 0; k < 52; k++) {
            var regex = new RegExp(abc[k], 'g');
            fancyText = fancyText.replace(regex, Array.from(letters[styleSelect.selectedIndex - 1])[k]);
        }
        chatInput.value = (chatInput.value.startsWith("/p ")) ? "/p " + fancyText : fancyText;
    }
}