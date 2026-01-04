// ==UserScript==
// @name         Hack doomed.io fun
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  By RESIDENT
// @author       You
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://doomed.io/*
// @downloadURL https://update.greasyfork.org/scripts/424036/Hack%20doomedio%20fun.user.js
// @updateURL https://update.greasyfork.org/scripts/424036/Hack%20doomedio%20fun.meta.js
// ==/UserScript==




if(window.location.href == "http://doomed.io/" || window.location.href == "http://doomed.io/index.html"){
document.getElementById("banner_div").remove(); // ad
document.getElementById("preroll").remove(); // ad
}
let canvas = document.getElementById("canvas"); // canvas
document.getElementById("input_username").setAttribute('maxlength', 2222222222222); // infinity symbols for input_username

const times = [];
let fps;



let HackFPS = document.createElement("div"); //FPS counter
HackFPS.style = "position:absolute;top:-22px;right:0px; left:100px;display:none;";
HackFPS.innerHTML = `
<p>FPS = <span id="TakeFPS"></span></p>
`;

HackFPS.style = "position:absolute;top:-8px;right:0px; left:245px;display:none;";
HackFPS.innerHTML = `
<p>FPS = <span id="TakeFPS"></span></p>
`;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
document.getElementById("TakeFPS").innerHTML = fps; // paste fps in span
  });
}
refreshLoop(); // start fps function

//Hack menu
let HackMenu = document.createElement("div");
HackMenu.id = "HackMenu";
HackMenu.style = "display: none;";
HackMenu.innerHTML = `
<h2 style="text-align:center;font-size:23px;font-weight: 900;background: linear-gradient(to right,#ff8a00,#da1b60);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">Hack Menu v0.1</h2>
<p class="functions" id="ShowFPS">ShowFPS</p>
<p class="functions" id="Cursor">Cursor</p>
<p class="functions" id="HotKeys">HotKeys</p>
<p class="functions" id="ShowMyObjects">ShowMyObjects</p>
<p class="functions" id="KeepMarkersOnDeath">KeepMarkersOnDeath</p>
<p class="functions" id="Tracer">Tracer</p>
<p class="functions" id="Boosters">Boosters</p>
<p class="functions" id="IWantFap">IWantFap</p>
<p class="functions" id="--ELITE MENU--">--ELITE MENU--</p>
<p class="functions" id="Menu KILLER7177">Menu KILLER7177</p>
<p class="functions" id="Menu RESIDENT">Menu RESIDENT</p>
<p class="functions" id="Menu BRO7177">Menu BRO7177</p>
<p class="functions" id="Web Site">Web Site</p>
`;

document.getElementById("game_page").appendChild(HackMenu);

document.getElementById("HotKeys").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(255,219,0)";
}
else{
this.style.color = "";
}
};

document.getElementById("ShowFPS").onclick = function (){
if(this.style.color == "" || HackFPS.style.display == "none"){
this.style.color = "rgb(255, 69, 0)";
HackFPS.style.display = "block";
}
else{
this.style.color = "";
HackFPS.style.display = "1234";
}
};

document.getElementById("Cursor").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(255, 69, 0)";
canvas.style = "cursor:url(http://www.rw-designer.com/cursor-view/97540.gif), default;";
}
else{
this.style.color = "";
canvas.style = "cursor:crosshair;";
}
};

document.getElementById("HotKeys").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(255, 69, 0)";
}
else{
this.style.color = "";
}
};

document.getElementById("ShowMyObjects").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(255, 69, 0)";
}
else{
this.style.color = "";
}
};

document.getElementById("KeepMarkersOnDeath").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(0, 128, 0)";
}
else{
this.style.color = "";
}
};

document.getElementById("Tracer").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(0, 128, 0)";
}
else{
this.style.color = "";
}
};

document.getElementById("Boosters").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(0, 128, 0)";
}
else{
this.style.color = "";
}
};

document.getElementById("IWantFap").onclick = function (){
if(this.style.color == ""){
this.style.color = "rgb(0, 128, 0)";
let inputClan = document.getElementById("input_clan_name");
let createClan = document.getElementById("create_join_clan_button");
let leaveClan = document.getElementById("leave_clan_button");
let valueTry = prompt("Сколько раз повторить дрочку ?", 10);
let valueInterval = prompt("Выберите длительность дрочки в секундах", 0.5);
valueInterval = valueInterval * 1000;

if(!null){
for(let i = 0, value = 0;i < valueTry;i++){
value = valueInterval + value;
setTimeout(function(){inputClan.value = "Л";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "ЛЮ";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "ЛЮТ";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "ЛЮТЫЙ✊";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "К";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "КЛ";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "КЛА";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);
value = valueInterval + value;
setTimeout(function(){inputClan.value = "КЛАН";}, value);
setTimeout(function(){createClan.click();}, value);
setTimeout(function(){leaveClan.click();}, value + valueInterval);

if(i == valueTry - 1){
setTimeout(function(){document.getElementById("IWantFap").style.color = "";}, value + valueInterval);
}
}
}
}
};

document.getElementById("Menu KILLER7177").onclick = function (){
if(this.style.color == "" || HackFPS.style.display == "none"){
this.style.color = "rgb(255, 0, 0)";
HackFPS.style.display = "block";
}
else{
this.style.color = "";
HackFPS.style.display = "none";
}
};

document.getElementById("Menu RESIDENT").onclick = function (){
if(this.style.color == "" || HackFPS.style.display == "none"){
this.style.color = "rgb(255, 0, 0)";
HackFPS.style.display = "block";
}
else{
this.style.color = "";
HackFPS.style.display = "none";
}
};

document.getElementById("Menu BRO7177").onclick = function (){
if(this.style.color == "" || HackFPS.style.display == "none"){
this.style.color = "rgb(255, 0, 0)";
HackFPS.style.display = "block";
}
else{
this.style.color = "";
HackFPS.style.display = "none";
}
};

document.getElementById("Web Site").onclick = function (){
if(this.style.color == "" || HackFPS.style.display == "none"){
this.style.color = "rgb(255, 0, 0)";
document.location.replace("https://naughty-meninsky-641c03.netlify.app/#KrityHack");
HackFPS.style.display = "block";
}
else{
this.style.color = "";
HackFPS.style.display = "none";
}
};

GM_addStyle(`
        #HackMenu{
            border-radius:50px;
            border:2px double orange;
            background-color:rgb(0,0,0,0.5);
            position:absolute;
            width:200px;
            padding:10px 10px 10px 15px;
            top:2%;
            left:25%;
        }
        .functions{
            font-size:20px;
            font-weight:950;
            color:rgb(255, 255, 255);
            padding-left:5px;
            border-left:3px double transparent;
        }
        .functions:hover{
            cursor:pointer;
            color:rgb(0, 0, 0);
            border-left:6px solid yellow;
        }
`);
document.getElementById("server_url_menu").style.visibility = "";

document.getElementById("server_url_button").onclick = function(){
if(HackMenu.style.display === "none"){
HackMenu.style.display = "block";
}
else{
HackMenu.style.display = "none"
}
};
console.log("Doomed.io");

//Name Hack

const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const letters = ["𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙","𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡","𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕","𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉","𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ","𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅","𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵","𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩","ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ","🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩","𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ","ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ","ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ","ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ","αв¢∂єfgнιנкℓмиσρqяѕтυνωχуzαв¢∂єfgнιנкℓмиσρqяѕтυνωχуz","αвcdeғɢнιjĸlмɴopqrѕтυvwхyzαвcdeғɢнιjĸlмɴopqrѕтυvwхyz","αвcdєfghíjklmnσpqrstuvwхчzαвcdєfghíjklmnσpqrstuvwхчz","卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙"
];
const styles = [
"Default (Name Font)","𝐁𝐨𝐥𝐝","𝘐𝘵𝘢𝘭𝘪𝘤","𝘽𝙤𝙡𝙙+𝙄𝙩𝙖𝙡𝙞𝙘","𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎","𝔉𝔯𝔞𝔨𝔱𝔲𝔯","𝕭𝖔𝖑𝖉+𝕱𝖗𝖆𝖐𝖙𝖚𝖗","𝐻𝒶𝓃𝒹","𝓑𝓸𝓵𝓭+𝓗𝓪𝓷𝓭","Ⓑⓤⓑⓑⓛⓔⓢ","🅑🅛🅐🅒🅚 🅑🅤🅑🅑🅛🅔🅢","𝔻𝕠𝕦𝕓𝕝𝕖","Ｔｈｉｎ","sᴍᴀʟʟ ᴄᴀᴘs","ᔕᑭEᑕIᗩᒪ","αитяσρвια","ѕмooтнer","pαrαnσrmαl","千卂几匚ㄚ"
];


(function (){
var styleSelect = document.createElement("select");
styleSelect.style.backgroundColor = "#1a1a1a";
styleSelect.style.color = "white";
styleSelect.style.marginTop = "6px";
styleSelect.style.width = "400px";
styleSelect.id = "fontselecter";
for (var k = 0; k < styles.length; k++) {
  var option = document.createElement("option");
  option.text = styles[k];
  styleSelect.add(option);
}

//document.querySelector("body > div:nth-child(3) > div:nth-child(5) > div:nth-child(2)").appendChild(styleSelect);
document.querySelector("#social_icon_div > div:nth-child(2)").appendChild(styleSelect);
document.querySelector("#fontselecter option").style.width = "300px";

styleSelect.selectedIndex = GM_getValue("style");
styleSelect.onchange = function () {
  GM_setValue("style", styleSelect.selectedIndex);
};

var chatInput = document.getElementById("input_username");
chatInput.onkeyup = function () {
  if (
    ((styleSelect.selectedIndex !== 0) & !chatInput.value.startsWith("/")) |
    chatInput.value.startsWith("/p ")
  ) {
    var fancyText = chatInput.value.startsWith("/p ")
      ? chatInput.value.substr(3)
      : chatInput.value;
    for (var k = 0; k < 52; k++) {
      var regex = new RegExp(abc[k], "g");
      fancyText = fancyText.replace(
        regex,
        Array.from(letters[styleSelect.selectedIndex - 1])[k]
      );
    }
    chatInput.value = chatInput.value.startsWith("/p ")
      ? "/p " + fancyText
      : fancyText;
  }
};
}());

let AAAAAAAAAAAAAAAAAAAA = true;
document.getElementById("connect_button").onclick = setTimeout(function (){
if(AAAAAAAAAAAAAAAAAAAA){
AAAAAAAAAAAAAAAAAAAA = false;
(function chatSymbolsHack(){
var styleSelect = document.createElement("select");
styleSelect.style = "z-index:999999999;position: absolute;cursor: pointer;left: 75px;top: 20px;color: white;width: 400px";
styleSelect.style.backgroundColor = "#1a1a1a";
styleSelect.id = "fontselecter1";
for (var k = 0; k < styles.length; k++) {
  var option = document.createElement("option");
  option.text = styles[k];
  styleSelect.add(option);
}
//document.querySelector("body > div:nth-child(3) > div:nth-child(5) > div:nth-child(2)").appendChild(styleSelect);
document.querySelector("#game_page > div").appendChild(styleSelect);
document.querySelector("#fontselecter1 option").style.width = "300px";

styleSelect.selectedIndex = GM_getValue("style");
styleSelect.onchange = function () {
  GM_setValue("style", styleSelect.selectedIndex);
};

var chatInput = document.getElementById("console_text_input");
chatInput.onkeyup = function () {
  if (
    ((styleSelect.selectedIndex !== 0) & !chatInput.value.startsWith("/")) |
    chatInput.value.startsWith("/p ")
  ) {
    var fancyText = chatInput.value.startsWith("/p ")
      ? chatInput.value.substr(3)
      : chatInput.value;
    for (var k = 0; k < 52; k++) {
      var regex = new RegExp(abc[k], "g");
      fancyText = fancyText.replace(
        regex,
        Array.from(letters[styleSelect.selectedIndex - 1])[k]
      );
    }
    chatInput.value = chatInput.value.startsWith("/p ")
      ? "/p " + fancyText
      : fancyText;
  }
};
}());

(function clanSymbolsHack(){
var styleSelect = document.createElement("select");
styleSelect.style.backgroundColor = "#1a1a1a";
styleSelect.style.color = "white";
styleSelect.style.marginTop = "3px";
styleSelect.style.width = "400px";
styleSelect.id = "fontselecter2";
for (var k = 0; k < styles.length; k++) {
  var option = document.createElement("option");
  option.text = styles[k];
  styleSelect.add(option);
}

//document.querySelector("body > div:nth-child(3) > div:nth-child(5) > div:nth-child(2)").appendChild(styleSelect);
document.querySelector("#clan_menu").appendChild(styleSelect);
document.querySelector("#fontselecter2 option").style.width = "300px";

styleSelect.selectedIndex = GM_getValue("style");
styleSelect.onchange = function () {
  GM_setValue("style", styleSelect.selectedIndex);
};

var chatInput = document.getElementById("input_clan_name");
chatInput.onkeyup = function () {
  if (
    ((styleSelect.selectedIndex !== 0) & !chatInput.value.startsWith("/")) |
    chatInput.value.startsWith("/p ")
  ) {
    var fancyText = chatInput.value.startsWith("/p ")
      ? chatInput.value.substr(3)
      : chatInput.value;
    for (var k = 0; k < 52; k++) {
      var regex = new RegExp(abc[k], "g");
      fancyText = fancyText.replace(
        regex,
        Array.from(letters[styleSelect.selectedIndex - 1])[k]
      );
    }
    chatInput.value = chatInput.value.startsWith("/p ")
      ? "/p " + fancyText
      : fancyText;
  }
};

})();
}
},2000);


//Name Hack

//Default settings

let FPS_COUNTER = true;
let CURSOR = true;

document.getElementById("connect_button").onclick = function (){
if(FPS_COUNTER){
HackFPS.style.display = "block";
document.getElementById("ShowFPS").style.color = "rgb(255,219,0)";
}
if(CURSOR){
setTimeout(() => {
document.getElementById("Cursor").style.color = "rgb(255,219,0)";
canvas.style = "cursor:url(https://drive.google.com/u/0/uc?id=1ima7DNPRd88iLBr6dI75BtBKl_lTqFFn&export=download), default;";
},2000);
}
};

//Default settings

document.querySelector("body > div").style = "max-width:1300px; margin:0 auto;text-align:center;left:0;right:0";
document.querySelector("body > div > div > div:nth-child(2)").style = "text-align:center;margin:10px 0";
document.querySelector("body > div > div > div:nth-child(3)").style = "text-align:center;margin:10px 0";

let aTop25 = document.createElement("a");
aTop25.innerText = "Top 25 players of Doomed2.io";
aTop25.href = "https://krityteam.github.io/Doomed2-LeaderBoard/";
aTop25.style = "font-size:20px;font-weight:700;font-family:inherit;margin:15px auto;display:block;border-radius:10px;text-decoration:none;width: 800px;height:auto;overflow:hidden;background-color:#cf0e0e;color:white;padding: 10px;";
aTop25.target = "_blank";

document.querySelector("body > div > div > div:nth-child(3)").appendChild(aTop25);
setTimeout(function HackActivated(){
console.log("Doomed.io HACK ACTIVATED"); // Send in console message
console.log("Doomed.io HACK ACTIVATED"); // Send in console message
console.log("Doomed.io HACK ACTIVATED"); // Send in console message
console.log("By RESIDENT"); // Send in console message
},6000);