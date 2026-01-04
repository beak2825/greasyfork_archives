// ==UserScript==
// @name         GotaFancyMessages
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Replace your boring messages by fancy ones !
// @author       Zacharie Boumard (Zaxtre)
// @match        https://gota.io/web/
// @license      Zaxtre
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/367730/GotaFancyMessages.user.js
// @updateURL https://update.greasyfork.org/scripts/367730/GotaFancyMessages.meta.js
// ==/UserScript==

const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const letters = [
    "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙",
    "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡",
    "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕",
    "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉",
    "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
    "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅",
    "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
    "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
    "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ",
    "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩",
    "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
    "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ",
    "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ",
    "ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ",
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

var creator = document.createElement("p");var lbl = document.createTextNode(atob("R290YUZhbmN5TWVzc2FnZXMgYnkgWmF4dHJl"));
creator.appendChild(lbl);creator.style.color = "dodgerblue";creator.style.fontSize = "15pt";creator.style.fontWeight = "900";
creator.style.textAlign = "center";document.getElementById("main-content").appendChild(creator);

var styleSelect = document.createElement("select");
styleSelect.style.backgroundColor = "#1a1a1a";
styleSelect.style.color = "white";

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