// ==UserScript==
// @name         Rababa's Gota.io Mod
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Rababa added more fonts and cool fonts for the user name -- Original https://greasyfork.org/scripts/375945-custom-fonts-for-gota-io
// @author       Rababa
// @match        https://gota.io/web/
// @match        https://gota.io/camlan/
// @license      G3TR3KT2
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/452136/Rababa%27s%20Gotaio%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/452136/Rababa%27s%20Gotaio%20Mod.meta.js
// ==/UserScript==

const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const letters = [
    "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙"
    , "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡"
    , "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕"
    , "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉"
    , "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"
    , "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"
    , "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"
    , "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"
    , "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ"
    , "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"
    , "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ"
    , "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
    , "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ"
    , "ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ"
    , "αв¢∂єfgнιנкℓмиσρqяѕтυνωχуzαв¢∂єfgнιנкℓмиσρqяѕтυνωχуz"
    , "αвcdeғɢнιjĸlмɴopqrѕтυvwхyzαвcdeғɢнιjĸlмɴopqrѕтυvwхyz"
    , "αвcdєfghíjklmnσpqrstuvwхчzαвcdєfghíjklmnσpqrstuvwхчz"
    , "卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙"
    , "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"
    , "₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ"
    , "♋︎♌︎♍︎♎︎♏︎♐︎♑︎♒︎♓︎🙰🙵●︎❍︎■︎□︎◻︎❑︎❒︎⬧︎⧫︎◆︎❖︎⬥︎⌧︎⍓︎⌘︎✌︎👌︎👍︎👎︎☜︎☞︎☝︎☟︎✋︎☺︎😐︎☹︎💣︎☠︎⚐︎🏱︎✈︎☼︎💧︎❄︎🕆︎✞︎🕈︎✠︎✡︎☪︎"
    , "абcдёfgнїjкгѫпѳpфя$тцѵщжчзАБCДЄFGHЇJКГѪЙѲPФЯ$TЦѴШЖЧЗ"
    , "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"
    , "ᗩв𝕔ᵈε𝓕Ğ卄ιנҜ𝓁ｍŇｏ𝐩𝕢ｒ𝓈Ť𝔲ש𝔴Ｘ𝔶ℤⓐ𝕓ⓒ𝓭𝐞ⓕ𝕘Ⓗ𝐈𝕛ķ𝕝ᵐ𝕟σƤ𝓺яｓｔ𝐔𝐯𝕎𝐗ү乙"
    , "48(d3f9h!jk1mn0pqr57uvwxy248(D3F9H!JK1MN0PQR57UVWXY2"
    , "ꋫꃲꉓꃸꑾꄘꁅꃄ꒐꒑ꀗ꒒ꂵꁹꄱꉣꋟꋪꇘ꓅ꌇ꒦ꅏꋋꌥ꒗ꋫꃲꉓꃸꑾꄘꁅꃄ꒐꒑ꀗ꒒ꂵꁹꄱꉣꋟꋪꇘ꓅ꌇ꒦ꅏꋋꌥ꒗"
    , "λ𐒈𐒨Ꮷ𐒢ӺⳒ𐒅ᎥᏭᏥᏓ𐒄𐒐𐒀Ꮅ𐒉ⲄᎴᎿ𐒜ᏉᏊ𐒎𐒍೩λ𐒈𐒨Ꮷ𐒢ӺⳒ𐒅ᎥᏭᏥᏓ𐒄𐒐𐒀Ꮅ𐒉ⲄᎴᎿ𐒜ᏉᏊ𐒎𐒍೩"
    , "αвς∂єfgнιנкℓмиσρףяѕтυνωאָуzΔΒCDΞΓGHΦJKLMΠΩPQRSTUVWXΨZ"
    , "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ"
    , ""
];

const styles = [
    "Normal Font"
    , "𝐁𝐨𝐥𝐝"
    , "𝘐𝘵𝘢𝘭𝘪𝘤"
    , "𝘽𝙤𝙡𝙙+𝙄𝙩𝙖𝙡𝙞𝙘"
    , "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎"
    , "𝔉𝔯𝔞𝔨𝔱𝔲𝔯"
    , "𝕭𝖔𝖑𝖉+𝕱𝖗𝖆𝖐𝖙𝖚𝖗"
    , "𝐻𝒶𝓃𝒹"
    , "𝓑𝓸𝓵𝓭+𝓗𝓪𝓷𝓭"
    , "Ⓑⓤⓑⓑⓛⓔⓢ"
    , "🅑🅛🅐🅒🅚 🅑🅤🅑🅑🅛🅔🅢"
    , "𝔻𝕠𝕦𝕓𝕝𝕖"
    , "Ｔｈｉｎ"
    , "sᴍᴀʟʟ ᴄᴀᴘs"
    , "ᔕᑭEᑕIᗩᒪ"
    , "αитяσρвια"
    , "ѕмooтнer"
    , "pαrαnσrmαl"
    , "千卂几匚ㄚ"
    , "🅂🅀🅄🄰🅁🄴🅂"
    , "₵ɄⱤⱤɆ₦₵Ɏ"
    , "⬥︎♓︎■︎♑︎♎︎♓︎■︎♑︎⬧︎ (Wingdings)"
    , "͎яц$їfч (Rusify)"
    , "🅴🅼🅾🅹🅸 🆂🆀🆄🅰🆁🅴🆂"
    , "ｒⒶภ𝓭ØＭ"
    , "1337"
    , "ꋪꌇꁹꑾꇘ"
    , "λᏓᎥ𐒢𐒐"
    , "GRΞΞK"
    , "ˡⁱᵗᵗˡᵉ"
    , "̲̄͟G̱̳͞L̶̄͞I̳̱͞T̠̅͞C̱̄͟H"
    , "̄L͟ESS ̄G̶L̶I̠T͞C̅H"
];

var vis = true;

var chatInput = document.getElementById("chat-input");
var chatInput2 = document.getElementById("name-box");

var styleSelect2 = document.createElement("select");
styleSelect2.style.backgroundColor = "#1a1a1a";
styleSelect2.style.color = "white";
styleSelect2.id = "rbb_select";

for (var k2 = 0; k2 < styles.length; k2++) {
    var option2 = document.createElement("option");
    option2.text = styles[k2];
    styleSelect2.add(option2);
}
document.getElementsByClassName("main-content main-divider main-panel")[0].appendChild(styleSelect2);

styleSelect2.selectedIndex = GM_getValue("style");
styleSelect2.onchange = function() {
    GM_setValue("style", styleSelect2.selectedIndex);
}

function getRandomLine() {
    let inputText = document.getElementById('rbb_skinarea')
        .value;
    let lines = inputText.split('\n');
    let randomIndex = Math.floor(Math.random() * lines.length);
    return lines[randomIndex];
}

var customstyle = document.createElement("style");
customstyle.innerHTML = `
    textarea::-webkit-scrollbar {
        display: none;
    } `;
document.body.appendChild(customstyle);

var skindiv = document.createElement("div");
skindiv.id = "rbb_skindiv";
skindiv.style.backgroundColor = "#1a1a1a";
skindiv.style.overflow = "auto";
skindiv.style.position = "fixed";
skindiv.style.bottom = "10px";
skindiv.style.right = "10px";
skindiv.style.border = "1px solid white";
skindiv.style.padding = "10px";
skindiv.style.width = "200px";
skindiv.style.height = "200px";
document.getElementsByClassName('main-panel-wrapper')[0].appendChild(skindiv);

var skintitle = document.createElement("p");
skintitle.id = "rbb_skintitle";
skintitle.style.zIndex = "1000";
skintitle.style.position = "absolute";
skintitle.style.top = "-15px";
skintitle.style.width = "200px";
skintitle.style.textAlign = "center";
skintitle.style.fontWeight = "bold";
skintitle.innerHTML = "Random Name Chooser"
skindiv.appendChild(skintitle);

var skinhelp = document.createElement("p");
skinhelp.id = "rbb_skinhelp";
skinhelp.style.zIndex = "1000";
skinhelp.style.position = "absolute";
skinhelp.style.top = "145px";
skinhelp.style.width = "200px";
skinhelp.style.textAlign = "center";
skinhelp.innerHTML = "The names have to be separated by lines"
skindiv.appendChild(skinhelp);

var skinset = document.createElement("button");
skinset.id = "rbb_skinhelp";
skinset.style.backgroundColor = "#1a1a1a";
skinset.style.border = "1px solid white";
skinset.style.color = "white";
skinset.style.zIndex = "1000";
skinset.style.position = "absolute";
skinset.style.top = "193px";
skinset.style.width = "200px";
skinset.style.textAlign = "center";
skinset.innerHTML = "Choose random name"
skindiv.appendChild(skinset);

skinset.onclick = function() {
    chatInput2.value = getRandomLine();
}

var skinarea = document.createElement("textarea");
skinarea.id = "rbb_skinarea";
skinarea.style.backgroundColor = "#1a1a1a";
skinarea.style.overflow = "auto";
skinarea.style.position = "absolute";
skinarea.style.top = "10px";
skinarea.style.right = "10px";
skinarea.style.border = "1px solid white";
skinarea.style.padding = "10px";
skinarea.style.width = "180px";
skinarea.style.height = "120px";
skinarea.style.color = "white";
skindiv.appendChild(skinarea);

if (GM_getValue("value") != undefined) {
    skinarea.value = GM_getValue("value");
}
skinarea.onchange = function() {
    GM_setValue("value", skinarea.value);
}

var a = "";
var a2 = false;
var b = "";
var b2 = false;

function stringDifference(str1, str2) {
    let diff = '';

    for (let i = 0; i < str2.length; i++) {
        if (str1[i] !== str2[i]) {
            diff += str2.slice(i);
            break;
        }
    }

    if (diff === '' && str1.length < str2.length) {
        diff = str2.slice(str1.length);
    }

    return diff;
}

function codePointsToCharacters(codePoints) {
    return codePoints.map(code => String.fromCharCode(code));
}

function getRandomCodes(array, n) {
    const numberOfElements = Math.floor(Math.random() * 2) + n;

    const shuffledArray = array.sort(() => Math.random() - 0.5);

    return (shuffledArray.slice(0, numberOfElements))
        .join('');
}

const unicodeCodes = [0x0304, 0x0305, 0x0320, 0x0335, 0x0336, 0x0332, 0x035e, 0x035f, 0x0331, 0x0333];
const charactersArray = codePointsToCharacters(unicodeCodes);

chatInput.onkeydown = function(e) {
    if (e.which == 8 | a2 == true) {
        return;
    }
    a = chatInput.value;
    a2 = true;
}

chatInput.onkeyup = function(e) {
    if (e.which == 8) {
        return;
    }
    if (styleSelect2.selectedIndex !== 0 & !chatInput.value.startsWith('/') | chatInput.value.startsWith("/p ")) {
        var fancyText2 = stringDifference(a, chatInput.value);
        if (styleSelect2.selectedIndex == 30) {
            var _fancyText2 = '';
            for (var k3 = 0; k3 < fancyText2.length; k3++) {
                _fancyText2 = _fancyText2 + getRandomCodes(charactersArray, 2) + fancyText2.slice(k3, k3 + 1);
            }
            fancyText2 = _fancyText2;
        } else {
            if (styleSelect2.selectedIndex == 31) {
                var _fancyText3 = '';
                for (var k4 = 0; k4 < fancyText2.length; k4++) {
                    _fancyText3 = _fancyText3 + getRandomCodes(charactersArray, 0) + fancyText2.slice(k4, k4 + 1);
                }
                fancyText2 = _fancyText3;
            } else {
                for (var k2 = 0; k2 < 52; k2++) {
                    var regex2 = new RegExp(abc[k2], 'g');
                    fancyText2 = fancyText2.replace(regex2, Array.from(letters[styleSelect2.selectedIndex - 1])[k2]);
                }
            }
        }
        a = a + fancyText2;
        a2 = false;
        chatInput.value = a;
    }
}

chatInput2.onkeydown = function(e) {
    if (e.which == 8 | b2 == true) {
        return;
    }
    b = chatInput2.value;
    b2 = true;
}

chatInput2.onkeyup = function(e) {
    if (e.which == 8) {
        return;
    }
    if (styleSelect2.selectedIndex !== 0 & !chatInput2.value.startsWith('/') | chatInput2.value.startsWith("/p ")) {
        var fancyText2 = stringDifference(b, chatInput2.value);
        if (styleSelect2.selectedIndex == 30) {
            var _fancyText2 = '';
            for (var k3 = 0; k3 < fancyText2.length; k3++) {
                _fancyText2 = _fancyText2 + getRandomCodes(charactersArray, 2) + fancyText2.slice(k3, k3 + 1);
            }
            fancyText2 = _fancyText2;
        } else {
            if (styleSelect2.selectedIndex == 31) {
                var _fancyText3 = '';
                for (var k4 = 0; k4 < fancyText2.length; k4++) {
                    _fancyText3 = _fancyText3 + getRandomCodes(charactersArray, 0) + fancyText2.slice(k4, k4 + 1);
                }
                fancyText2 = _fancyText3;
            } else {
                for (var k2 = 0; k2 < 52; k2++) {
                    var regex2 = new RegExp(abc[k2], 'g');
                    fancyText2 = fancyText2.replace(regex2, Array.from(letters[styleSelect2.selectedIndex - 1])[k2]);
                }
            }
        }
        b = b + fancyText2;
        b2 = false;
        chatInput2.value = b;
    }
}