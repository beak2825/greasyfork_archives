// ==UserScript==
// @name         EZTHEME
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Easily make a shell shockers theme!
// @author       Jayvan
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438998/EZTHEME.user.js
// @updateURL https://update.greasyfork.org/scripts/438998/EZTHEME.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let ssbg = document.getElementById('ss_background');
var menu = document.createElement("div");
menu.id = "menu";
menu.style.border = "2px solid black";
menu.style.background = "rgba(34, 34, 34, 0.9)";
menu.style.width = "300px";
menu.style.height = "500px";
menu.style.zIndex = "2147483647";
menu.style.position = "absolute";
menu.innerHTML = "<h1>EZTHEME by Jayvan</h1><p>Enter hex codes into the below text feilds to make an EZ THEME!</p><p>Titles with '*' next to them can be images! In order to add an image, simply copy the url of the image (must start with http)</p>";
ssbg.appendChild(menu);
let menucss =`#menu h3, #menu h1 { color: white !important; } #menu { overflow:scroll; float: right; text-align: center; margin: 10px 10px 10px 1px; color: white; } #menu h1 { color: white; } input::placeholder {color:black;} input { border: 1px solid black; margin: 2px;} .menuButton { border-radius: 5px; font-family: Georgia; color: #ffffff; font-size: 10px; background: #828282; padding: 2px 5px 2px 5px; border: solid #000000 1px; text-decoration: none; }`;
document.head.insertAdjacentHTML("beforeend", `<style>${menucss}</style>`)

let key = "ShiftRight";
var menuHidden = false;
document.addEventListener('keydown', function(event) {
  if (event.code == key) {
      function hideMenu() {
          menu.style.display = "none";
          menuHidden = true;
          console.log('Menu Hidden');
      }
      function showMenu() {
          menu.style.display = "initial";
          menuHidden = false;
          console.log('Menu Shown');
      }
      if(menuHidden) {
          showMenu()
      } else {
          hideMenu()
      }
  }
});
var hometitle = document.createElement('h3');
hometitle.innerHTML = "Home Screen";
menu.appendChild(hometitle);

var backgroundtitle = document.createElement('p');
backgroundtitle.innerHTML = "Background (*)";
menu.appendChild(backgroundtitle);
var input = document.createElement('input');
input.placeholder = "Background";
menu.appendChild(input);

var h4 = document.createElement('p');
h4.innerHTML = "Generic Header";
menu.appendChild(h4);
var generictitle = document.createElement('input');
generictitle.placeholder = "Text Colour";
menu.appendChild(generictitle);

var playgametitle = document.createElement('p');
playgametitle.innerHTML = "Menus (*)";
menu.appendChild(playgametitle);
var playgame = document.createElement('input');
playgame.placeholder = "Background";
menu.appendChild(playgame);
var playgameb = document.createElement('input');
playgameb.placeholder = "Border";
menu.appendChild(playgameb);

var news = document.createElement('p');
news.innerHTML = "News Item";
menu.appendChild(news);
var newsodd = document.createElement('input');
newsodd.placeholder = "Background (Odd)";
menu.appendChild(newsodd);
var newseven = document.createElement('input');
newseven.placeholder = "Background (Even)";
menu.appendChild(newseven);
var newshover = document.createElement('input');
newshover.placeholder = "Background (Hover)";
menu.appendChild(newshover);

var inputs = document.createElement('p');
inputs.innerHTML = "Inputs";
menu.appendChild(inputs);
var ssinputsbg = document.createElement('input');
ssinputsbg.placeholder = "Background";
menu.appendChild(ssinputsbg);
var ssinputsborder = document.createElement('input');
ssinputsborder.placeholder = "Border";
menu.appendChild(ssinputsborder);
var ssinputstext = document.createElement('input');
ssinputstext.placeholder = "Text Colour";
menu.appendChild(ssinputstext);

var buttons1 = document.createElement('p');
buttons1.innerHTML = "Buttons Group 1";
menu.appendChild(buttons1);
var ssbuttons1bg = document.createElement('input');
ssbuttons1bg.placeholder = "Background";
menu.appendChild(ssbuttons1bg);
var ssbuttons1border = document.createElement('input');
ssbuttons1border.placeholder = "Border";
menu.appendChild(ssbuttons1border);
var ssbuttons1text = document.createElement('input');
ssbuttons1text.placeholder = "Text Colour";
menu.appendChild(ssbuttons1text);

var buttons2 = document.createElement('p');
buttons2.innerHTML = "Buttons Group 2";
menu.appendChild(buttons2);
var ssbuttons2bg = document.createElement('input');
ssbuttons2bg.placeholder = "Background";
menu.appendChild(ssbuttons2bg);
var ssbuttons2border = document.createElement('input');
ssbuttons2border.placeholder = "Border";
menu.appendChild(ssbuttons2border);
var ssbuttons2text = document.createElement('input');
ssbuttons2text.placeholder = "Text Colour";
menu.appendChild(ssbuttons2text);

var stats = document.createElement('p');
stats.innerHTML = "Stat Item";
menu.appendChild(stats);
var statsbg = document.createElement('input');
statsbg.placeholder = "Background";
menu.appendChild(statsbg);
var statstext = document.createElement('input');
statstext.placeholder = "Text Colour";
menu.appendChild(statstext);

var weapons = document.createElement('p');
weapons.innerHTML = "Weapon Select";
menu.appendChild(weapons);
var wsbg = document.createElement('input');
wsbg.placeholder = "Background";
menu.appendChild(wsbg);
var wsborder = document.createElement('input');
wsborder.placeholder = "Border";
menu.appendChild(wsborder);

var eggcount = document.createElement('p');
eggcount.innerHTML = "Egg Count";
menu.appendChild(eggcount);
var eggcountbg = document.createElement('input');
eggcountbg.placeholder = "Background";
menu.appendChild(eggcountbg);
var eggcounttext = document.createElement('input');
eggcounttext.placeholder = "Text Colour";
menu.appendChild(eggcounttext);

var shoptitle = document.createElement('h3');
shoptitle.innerHTML = "Shop";
menu.appendChild(shoptitle);

var equip = document.createElement('p');
equip.innerHTML = "Equip";
menu.appendChild(equip);
var equipbg = document.createElement('input');
equipbg.placeholder = "Background";
menu.appendChild(equipbg);
var equipborder = document.createElement('input');
equipborder.placeholder = "Border";
menu.appendChild(equipborder);

var store = document.createElement('p');
store.innerHTML = "Store";
menu.appendChild(store);
var storebg = document.createElement('input');
storebg.placeholder = "Background";
menu.appendChild(storebg);
var storeborder = document.createElement('input');
storeborder.placeholder = "Border";
menu.appendChild(storeborder);

var gametitle = document.createElement('h3');
gametitle.innerHTML = "Game";
menu.appendChild(gametitle);

var gamebox1 = document.createElement('p');
gamebox1.innerHTML = "Game Menu Outer Box (*)";
menu.appendChild(gamebox1);
var gamebox1bg = document.createElement('input');
gamebox1bg.placeholder = "Background";
menu.appendChild(gamebox1bg);
var gamebox1border = document.createElement('input');
gamebox1border.placeholder = "Border";
menu.appendChild(gamebox1border);

var gamebox2 = document.createElement('p');
gamebox2.innerHTML = "Game Menu Inner Box";
menu.appendChild(gamebox2);
var gamebox2bg = document.createElement('input');
gamebox2bg.placeholder = "Background";
menu.appendChild(gamebox2bg);

var gamebox3 = document.createElement('p');
gamebox3.innerHTML = "Game Menu Weapon & Title Container";
menu.appendChild(gamebox3);
var gamebox3bg = document.createElement('input');
gamebox3bg.placeholder = "Background";
menu.appendChild(gamebox3bg);

var other = document.createElement('h3');
other.innerHTML = "Other";
menu.appendChild(other);

var scope = document.createElement('p');
scope.innerHTML = "Scope (*) (Must be image)";
menu.appendChild(scope);
var scopemask = document.createElement('input');
scopemask.value = "../img/scope.png";
menu.appendChild(scopemask);

var cross = document.createElement('p');
cross.innerHTML = "Crosshair (Choose Simple or Complex)";
menu.appendChild(cross);

let crosshairOption = "undecided";
function crosshairSimple() {
    crosshairOption = "simple";
}
function crosshairComplex() {
    crosshairOption = "complex";
}

let br = document.createElement("br");
let cbutton1 = document.createElement('button');
cbutton1.classList.add("menuButton");
cbutton1.innerHTML = "Simple";
menu.appendChild(cbutton1);
let cbutton2 = document.createElement('button');
cbutton2.classList.add("menuButton");
cbutton2.innerHTML = "Complex";
menu.appendChild(cbutton2);
cbutton1.onclick = crosshairSimple;
cbutton2.onclick = crosshairComplex;

var crosshairfill = document.createElement('input');
crosshairfill.placeholder = "Crosshair Fill";
menu.appendChild(crosshairfill);
var crosshairborder = document.createElement('input');
crosshairborder.placeholder = "Crosshair Border";
menu.appendChild(crosshairborder);
var crosshairfillegg = document.createElement('input');
crosshairfillegg.placeholder = "Crosshair Fill 10x Killstreak";
menu.appendChild(crosshairfillegg);

let colour = document.createElement('h3');
colour.innerHTML = "Colour";
menu.appendChild(colour);

let title0 = document.createElement('p');
title0.innerHTML = "Crosshair 0 (Bottom)";
menu.appendChild(title0);
let c0 = document.createElement('input');
c0.placeholder = "Background";
menu.appendChild(c0);
let title1 = document.createElement('p');
title1.innerHTML = "Crosshair 1 (Left)";
menu.appendChild(title1);
let c1 = document.createElement('input');
c1.placeholder = "Background";
menu.appendChild(c1);
let title2 = document.createElement('p');
title2.innerHTML = "Crosshair 2 (Top)";
menu.appendChild(title2);
let c2 = document.createElement('input');
c2.placeholder = "Background";
menu.appendChild(c2);
let title3 = document.createElement('p');
title3.innerHTML = "Crosshair 3 (Right)";
menu.appendChild(title3);
let c3 = document.createElement('input');
c3.placeholder = "Background (Right)";
menu.appendChild(c3);

let size = document.createElement('h3');
size.innerHTML = "Size";
menu.appendChild(size);

let heighttb = document.createElement('p');
heighttb.innerHTML = "Height (Top & Bottom) Default 0.8";
menu.appendChild(heighttb);
let height1 = document.createElement('input');
height1.placeholder = "Height (plain number, ie '0.6')";
menu.appendChild(height1);
let heightlr = document.createElement('p');
heightlr.innerHTML = "Height (Left & Right) Default 0.8";
menu.appendChild(heightlr);
let height2 = document.createElement('input');
height2.placeholder = "Height (plain number, ie '0.6')";
menu.appendChild(height2);
let widthtb = document.createElement('p');
widthtb.innerHTML = "Width (Top & Bottom) Default 0.3";
menu.appendChild(widthtb);
let width1 = document.createElement('input');
width1.placeholder = "Width (plain number, ie '0.6')";
menu.appendChild(width1);
let widthlr = document.createElement('p');
widthlr.innerHTML = "Width (Left & Right) Default 0.8";
menu.appendChild(widthlr);
let width2 = document.createElement('input');
width2.placeholder = "Width (plain number, ie '0.6')";
menu.appendChild(width2);

let otherc = document.createElement('h3');
otherc.innerHTML = "Other";
menu.appendChild(otherc);

let otherO = document.createElement('p');
otherO.innerHTML = "Opacity (Between 0-1) Default 0.7";
menu.appendChild(otherO);
let co = document.createElement('input');
co.placeholder = "Opacity";
menu.appendChild(co);

let other1 = document.createElement('p');
other1.innerHTML = "Border (Enter Colour)";
menu.appendChild(other1);
let border = document.createElement('input');
border.placeholder = "Border";
menu.appendChild(border);

let credits = `// ==UserScript==
// @name         My Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My theme, made with EZTHEME
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `;
let backtick = "`";
let preurl = `url('`, posturl = `')`;
let insertcss = 'document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)';
let insertcrosshaircss = 'document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)';
let precrosshair = 'let crosshaircss = ';
var copytitle = document.createElement('p');
copytitle.innerHTML = "Tampermonkey Script";
menu.appendChild(copytitle);
var copyscript = document.createElement('textarea');
copyscript.style.height = "150px";
copyscript.style.width = "250px";
menu.appendChild(copyscript);
setInterval(function() {
    let ss_background1;
    let play_game1;
    let play_game2 = playgameb.value;
    let ss_inputbg = ssinputsbg.value;
    let ss_inputborder = ssinputsborder.value;
    let ss_inputtext = ssinputstext.value;
    let ss_btn1bg = ssbuttons1bg.value;
    let ss_btn1border = ssbuttons1border.value;
    let ss_btn1text = ssbuttons1text.value;
    let ss_btn2bg = ssbuttons2bg.value;
    let ss_btn2border = ssbuttons2border.value;
    let ss_btn2text = ssbuttons2text.value;
    let ss_statsbg = statsbg.value;
    let ss_statstext = statstext.value;
    let ss_newsodd;
    let ss_newseven;
    let ss_newshover = newshover.value;
    let ss_wsbg = wsbg.value;
    let ss_wsborder = wsborder.value;
    let ss_generictitle = generictitle.value;
    let ss_eggcounttext = eggcounttext.value;
    let ss_eggcountbg;
    let ss_equipbg = equipbg.value;
    let ss_equipborder = equipborder.value;
    let ss_storebg = storebg.value;
    let ss_storeborder = storeborder.value;
    let ss_gamebox1bg;
    let ss_gamebox1border = gamebox1border.value;
    let ss_gamebox2bg = gamebox2bg.value;
    let ss_gamebox3bg = gamebox3bg.value;
    let ss_scope = scopemask.value;
    let ss_crosshairfill = crosshairfill.value;
    let ss_crosshairborder = crosshairborder.value;
    let ss_crosshairfillegg = crosshairfillegg.value;
    let ss_c0 = c0.value, ss_c1 = c1.value, ss_c2 = c2.value, ss_c3 = c3.value, ss_height1 = height1.value, ss_height2 = height2.value, ss_width1 = width1.value;
    let ss_width2 = width2.value;
    let halfwidth1 = +ss_width1 / 2;
    let halfwidth2 = +ss_width2 / 2;
    let ss_opacity = co.value;
    let ss_border = border.value;
    if (playgame.value.includes('http')) {
        //Img
        play_game1 = `${preurl}${playgame.value}${posturl}`;
    } else {
        play_game1 = playgame.value;
    }
    if (eggcountbg.value.includes('http')) {
        ss_eggcountbg = `${preurl}${eggcountbg.value}${posturl}`;
    } else {
        ss_eggcountbg = eggcountbg.value;
    }
    if (newsodd.value.includes('http')) {
        //Img
        ss_newsodd = `${preurl}${newsodd.value}${posturl}`;
    } else {
        ss_newsodd = newsodd.value;
    }
    if (newseven.value.includes('http')) {
        //Img
        ss_newseven = `${preurl}${newseven.value}${posturl}`;
    } else {
        ss_newseven = newseven.value;
    }
    if (input.value.includes('http')) {
        //Img
        ss_background1 = `${preurl}${input.value}${posturl}`;
    } else {
        ss_background1 = input.value;
    }
    if (gamebox1bg.value.includes('http')) {
        //Img
        ss_gamebox1bg = `${preurl}${gamebox1bg.value}${posturl}`;
    } else {
        ss_gamebox1bg = gamebox1bg.value;
    }
    if (crosshairOption === "undecided") {
        crosshairfill.classList.add("ez_hidden");
        crosshairborder.classList.add("ez_hidden");
        crosshairfillegg.classList.add("ez_hidden");
        colour.classList.add("ez_hidden");
        title0.classList.add("ez_hidden");
        c0.classList.add("ez_hidden");
        title1.classList.add("ez_hidden");
        c1.classList.add("ez_hidden");
        title2.classList.add("ez_hidden");
        c2.classList.add("ez_hidden");
        title3.classList.add("ez_hidden");
        c3.classList.add("ez_hidden");
        size.classList.add("ez_hidden");
        heighttb.classList.add("ez_hidden");
        height1.classList.add("ez_hidden");
        heightlr.classList.add("ez_hidden");
        height2.classList.add("ez_hidden");
        widthtb.classList.add("ez_hidden");
        width1.classList.add("ez_hidden");
        widthlr.classList.add("ez_hidden");
        width2.classList.add("ez_hidden");
        otherc.classList.add("ez_hidden");
        co.classList.add("ez_hidden");
        otherO.classList.add("ez_hidden");
        other1.classList.add("ez_hidden");
        border.classList.add("ez_hidden");
    } else if (crosshairOption === "simple") {
        crosshairfill.classList.remove("ez_hidden");
        crosshairborder.classList.remove("ez_hidden");
        crosshairfillegg.classList.remove("ez_hidden");
        colour.classList.add("ez_hidden");
        title0.classList.add("ez_hidden");
        c0.classList.add("ez_hidden");
        title1.classList.add("ez_hidden");
        c1.classList.add("ez_hidden");
        title2.classList.add("ez_hidden");
        c2.classList.add("ez_hidden");
        title3.classList.add("ez_hidden");
        c3.classList.add("ez_hidden");
        size.classList.add("ez_hidden");
        heighttb.classList.add("ez_hidden");
        height1.classList.add("ez_hidden");
        heightlr.classList.add("ez_hidden");
        height2.classList.add("ez_hidden");
        widthtb.classList.add("ez_hidden");
        width1.classList.add("ez_hidden");
        widthlr.classList.add("ez_hidden");
        width2.classList.add("ez_hidden");
        otherc.classList.add("ez_hidden");
        co.classList.add("ez_hidden");
        otherO.classList.add("ez_hidden");
        other1.classList.add("ez_hidden");
        border.classList.add("ez_hidden");
    } else if (crosshairOption === "complex") {
        crosshairfill.classList.add("ez_hidden");
        crosshairborder.classList.add("ez_hidden");
        crosshairfillegg.classList.add("ez_hidden");
        colour.classList.remove("ez_hidden");
        title0.classList.remove("ez_hidden");
        c0.classList.remove("ez_hidden");
        title1.classList.remove("ez_hidden");
        c1.classList.remove("ez_hidden");
        title2.classList.remove("ez_hidden");
        c2.classList.remove("ez_hidden");
        title3.classList.remove("ez_hidden");
        c3.classList.remove("ez_hidden");
        size.classList.remove("ez_hidden");
        heighttb.classList.remove("ez_hidden");
        height1.classList.remove("ez_hidden");
        heightlr.classList.remove("ez_hidden");
        height2.classList.remove("ez_hidden");
        widthtb.classList.remove("ez_hidden");
        width1.classList.remove("ez_hidden");
        widthlr.classList.remove("ez_hidden");
        width2.classList.remove("ez_hidden");
        otherc.classList.remove("ez_hidden");
        co.classList.remove("ez_hidden");
        other1.classList.remove("ez_hidden");
        border.classList.remove("ez_hidden");
    } else {
        //Error
    }
    let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: ${ss_background1} !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: ${play_game1}!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid ${play_game2}} .front_panel, #equip_sidebox { background: ${play_game1}; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid ${play_game2}; } .ss_field, .ss_select { background: ${ss_inputbg}; border: 1px solid ${ss_inputborder}; color: ${ss_inputtext};} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: ${ss_btn1bg} !important; border: 0.2em solid ${ss_btn1border} !important; color: ${ss_btn1text} !important; } .btn_yolk, .btn_red, .btn_blue1 { background: ${ss_btn2bg} !important; border: 0.2em solid ${ss_btn2border} !important; color: ${ss_btn2text} !important; } .morestuff { background-color: ${ss_btn2bg} !important; border: 0.2em solid ${ss_btn2border} !important; } .ss_bigtab:hover { color: ${ss_btn1text} !important; } #stat_item { background: ${ss_statsbg}; } #stat_item h4, .stat_stat { color: ${ss_statstext}; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: ${ss_newsodd}; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: ${ss_newseven}; } .stream_item:hover, .news_item.clickme:hover { background: ${ss_newshover} !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: ${ss_wsbg}!important; border: 3px solid ${ss_wsborder}!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: ${ss_wsbg}!important; border: 3px solid ${ss_wsborder}!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: ${ss_generictitle} !important; } label, .label { color: ${ss_generictitle} !important; } .egg_count { color: ${ss_eggcounttext}; } .account_eggs { background: ${ss_eggcountbg}; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: ${ss_equipbg}; background-color: ${ss_equipbg}; border: 0.33em solid ${ss_equipborder}; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: ${ss_storebg}; border: 0.33em solid ${ss_storeborder}; color: ${ss_storeborder}; } .popup_lg, .popup_sm { background: ${ss_gamebox1bg}; border: 0.33em solid ${ss_gamebox1border}; } .box_blue2 { background-color: ${ss_gamebox2bg}; } .pause-bg { background: ${ss_gamebox3bg} !important; } #maskmiddle { background: url('${ss_scope}') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: ${ss_gamebox2bg} !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss;
    if (crosshairOption === "simple") {
        crosshaircss = `.crosshair.normal { background: ${ss_crosshairfill}; } .crosshair { border: 0.05em solid ${ss_crosshairborder}; } .crosshair.powerfull { background: ${ss_crosshairfillegg}; }`;
    }
    if (crosshairOption === "complex") {
        crosshaircss = `.crosshair { opacity: ${ss_opacity}; border: solid 0.05em ${ss_border}; } .crosshair.normal:nth-child(even) { left: calc(50% - ${halfwidth2}em); width: ${ss_width2}em; } .crosshair.normal:nth-child(odd) { left: calc(50% - ${halfwidth1}em); width: ${ss_width1}em; } .crosshair:nth-child(odd) { height: ${ss_height1}em !important; } .crosshair:nth-child(even) { height: ${ss_height2}em !important; } #crosshair0 { background: ${ss_c0}; } #crosshair1 { background: ${ss_c1}; } #crosshair2 { background: ${ss_c2}; } #crosshair3 { background: ${ss_c3}; }`;
    }
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)
    copyscript.value = `${credits}${backtick}${css}${backtick}
    ${insertcss}
    ${precrosshair}${backtick}${crosshaircss}${backtick}
    ${insertcrosshaircss}`;
}, 1000);