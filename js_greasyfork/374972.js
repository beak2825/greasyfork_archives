// ==UserScript==
// @name Pendorian UI
// @namespace http://pendoria.net/
// @version 1.0
// @author Xanthuz
// @include http*://*pendoria.net* 
// @grant none
// @description Changes a large portion of the text and UI.
// @credit to puls3 and sheldor
// @downloadURL https://update.greasyfork.org/scripts/374972/Pendorian%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/374972/Pendorian%20UI.meta.js
// ==/UserScript==

//Also follow the Clone Policy!
//Clone Policy; https://goo.gl/AyAdqy

//Options
// 1 = True & 0 = False

//Toggle the recolor
var EliteRecolor = 1

//Legacy Sidebar (Zampa Style)
var legacySide = 1

//DualView
//Show Gameframe content AND action content
//Only looks good if your content box is tall enough
var DualView = 1
var DualViewLine = 220

//Frameless
//Remove the frames
//Looks great!
var Frameless = 1

//Links
var TSMRLink = 0
var ReleaseLink = 1

//Toggle logo removal
//You 'should' leave this on
var RemoveLogo = 1

//Remove Header Battle Stats <0 - 1>
var RemoveBattleStats = 0

//Remove quest options from select quest <0 - 1>
//Your going to want to leave whatever actions you do set to 0
var RemoveBattleQuest = 0
var RemoveFoodQuest = 1
var RemoveCopperQuest = 1
var RemoveGemsQuest = 1
var RemoveWoodQuest = 1

//Remove the battle tab in the actions section
var RemoveBattleTab = 0

//Remove the TS tab in the actions section
//for Battlers
var RemoveTSTab = 1

//Remove tradeskill options from select tradeskill <0 - 1>
//Your going to want to leave whatever actions you do set to 0
var RemoveFoodSelect = 1
var RemoveCopperSelect = 1
var RemoveGemsSelect = 1
var RemoveWoodSelect = 1
//If you use this then you might as well enable the next option

//Remove Tradeskill Select and Work button
//Note: Use the bar to refresh
//If you use this you will want to enable the next option as well
var RemoveTSSelect = 1

//Add a top padding to actions 
var AddActionheight = 0

//Toggle Background
var bgimage = 1
var bglink = "https://zerthox.github.io/ClearVision/images/sapphire.jpg"

//Edit these values to change colors as a whole
var elite = "rgb(253,242,86)";
var darkelite = "rgb(253,242,86)";
var leetbutton = "rgba(253,242,86, 0.5)";
var leetbuttonhover = "rgba(253,242,86, 0.8)";
var leetdungeonback = "#334771";
var profileguildname = "rgb(253,242,86)";

//Options End

//DualView
if (DualView == 1) {
var head = document.getElementsByTagName('head')[0];
head.insertAdjacentHTML("beforeend", `
<style>
#gameframe-battle {
  display: block !important;
  height: ` + DualViewLine + `px;
}
#gameframe-content {
  display: block !important;
  height: calc(100% - ` + DualViewLine + `px - 80px);
  top: calc(70px + ` + DualViewLine + `px);
}
#menu ul li:first-child {
  display: none !important;
}
</style>
`);
}

//Background Image
if (bgimage == 1) {
var head = document.getElementsByTagName('head')[0];
head.insertAdjacentHTML("beforeend", `
<style>
  body {
     background-image: url(https://images.wallpaperscraft.com/image/autumn_field_road_landscape_86231_3840x2160.jpg) !important;
}
</style>
`);
}

//Add recolor
if (EliteRecolor == 1) {
var head = document.getElementsByTagName('head')[0];
head.insertAdjacentHTML("beforeend", `
<link rel="icon" href="https://raw.githubusercontent.com/Xer0-Puls3/Pendorian-Elite-UI/master/favicon.ico"/>
<style>

/* CHAT CSS BELOW */

.chat-username {
  color: ` + elite + `;
  text-shadow: 0px 0px 2px rgb(253,242,86),
  0px 0px 4px rgb(253,243,102)
}
chat-local-error {
  color: ` + elite + ` !important;
}

/* UI CSS Below */
#gameframe {
  background-color: rgba(0,0,0,0);
}
#gameframe-content {
  background-color: rgba(0,0,0,0);
}
#gameframe-battle {
  background-color: rgba(0,0,0,0);
}
#chat-messages {
  background-color: rgba(0,0,0,0);
}
#chat-content {
  background-color: rgba(0,0,0,0);
}
.wrapper {
  background-color: rgba(0,0,0,0);
}
#chat {
  background-color: rgba(0,0,0,0);
}
.green {
  background-color: ` + elite + ` !important;
}
#expwidth {
  background-color: ` + elite + ` !important;
}
#quest_done {
  color: ` + elite + `;
}
#quest_prog {
  color: ` + elite + `;
}
#event {
  color: ` + elite + ` !important;
}
quest_abandon {
  background-color: ` + elite + ` !important;
}
#chat-composer input[type="submit"] {
  background: ` + leetbutton + ` !important;
}
button {
  background: ` + leetbutton + ` !important;
}
button:hover {
  background: ` + leetbuttonhover + ` !important;
}
#invinfo {
  color: ` + elite + ` !important;
}
#building-progress {
  background-color: ` + elite + ` !important;
}
#scraptowninfo {
  color: ` + elite + ` !important;
}
.activity-log-username {
  color: ` + elite + ` !important;
}
.guild-section [style*="color: rgb(29, 166, 87);"] {
    color: ` + elite + ` !important;
}
.guild-section [style*="color: #1da657;"] {
   color: ` + elite + ` !important;
}
.item-rarity-legendary {
  color: rgb(255,215,0) !important;
  text-shadow: 0 0 4px rgb(255,215,0),
  0 0 6px rgb(255, 220, 25),
  0 0 8px rgb(255, 227, 75) !important;
}
.item-rarity-runic {
  color: rgb(187, 10, 30) !important;
  text-shadow: 0 0 4px rgb(220,20,60),
  0 0 6px rgb(233, 21, 61),
  0 0 8px rgb(238, 68, 96) !important;
}
.display-item [style*="color: rgb(29, 166, 87);"] {
  color: ` + elite + ` !important;
}
.display-item [style*="color: green;"] {
  color: ` + elite + ` !important;
}
.display-item [style*="color: #98bda1; padding-top: 5px;"] {
  color: ` + darkelite + ` !important;
}
::selection {
  color: white;
  background: ` + elite + `;
}
.guild-name {
  font-weight: bold;
  color: ` + profileguildname + `;
}
.chat-command {
  color: ` + elite + `;
}
progress {
  color: ` + elite + `;
}
progress::-webkit-progress-value {
  background: ` + elite + `;
}
progress::-moz-progress-bar {
  background: ` + elite + `;
}
progress::-webkit-progress-bar {
  background: ` + elite + `;
}
#progressbar-wrapper {
  background: ` + leetdungeonback + `;
}
#exp {
  background: ` + leetdungeonback + ` !important;
}
.tab-game-content [style*="width: 100%; border-radius: 10px; overflow: hidden; background-color: #31453a;"] {
  background: ` + leetdungeonback + ` !important;
}

/* DUNGEON CSS BELOW */

#dungeon-progressbar-wrapper {
  background-color: ` + leetdungeonback + `;
}
#dungeon-progressbar-wrapper .progressbar {
  background-color: ` + elite + ` !important;
}
#dungeon-dialogue {
  display: none;
}

/* VIP Section */
/* Sheldor */
[data-player-id="1593"] .chat-username {
  color: rgb(37, 197, 153) !important;
    text-shadow: 0px 0px 4px rgb(37, 197, 153),
    0px 0px 6px rgb(41, 214, 165),
    0px 0px 8px rgb(84, 222, 183) !important;
}
/* Xanthuz */
[data-player-id="3152"] .chat-username {
  color: rgb(0, 230, 138) !important;
    text-shadow: 0px 0px 4px rgb(0, 230, 138),
    0px 0px 6px rgb(0, 255, 153),
    0px 0px 8px rgb(51, 255, 173) !important;
}
/* Gale */
[data-player-id="6"] .chat-username {
  color: rgb(48, 107, 39) !important;
    text-shadow: 0px 0px 4px rgb(48, 107, 39),
    0px 0px 6px rgb(58, 131, 47),
    0px 0px 8px rgb(75, 169, 61) !important;
}
/* SilentXer0 */
[data-player-id="60"] .chat-username {
  color: rgb(192,192,192) !important;
    text-shadow: 0 0 4px rgb(192,192,192),
    0px 0px 6px rgb(204, 204, 204),
    0px 0px 8px rgb(230, 230, 230) !important;
}
/* Rabouillet */
[data-player-id="3809"] .chat-username {
  color: rgb(183, 112, 228) !important;
    text-shadow: 0 0 4px rgb(183, 112, 228),
    0px 0px 6px rgb(192, 135, 228),
    0px 0px 8px rgb(210, 181, 228) !important;
}
/* Siam */
[data-player-id="1579"] .chat-username {
  color: rgb(255, 20, 147) !important;
    text-shadow: 0 0 4px rgb(255, 20, 147),
    0px 0px 6px rgb(255, 26, 148),
    0px 0px 8px rgb(255, 77, 172) !important;
}
/* Mario */
[data-player-id="3"] .chat-username {
  color: rgb(215, 166, 211) !important;
    text-shadow: 0 0 4px rgb(215, 166, 211),
    0px 0px 6px rgb(223, 185, 220),
    0px 0px 8px rgb(239, 220, 237) !important;
}
/* porce */
[data-player-id="835"] .chat-username {
  color: rgb(172, 61, 61) !important;
    text-shadow: 0 0 4px rgb(206, 44, 44),
    0px 0px 6px rgb(210, 45, 45),
    0px 0px 8px rgb(219, 87, 87) !important;
}
/* miawe */
[data-player-id="2434"] .chat-username {
  color: rgb(100, 100, 100) !important;
    text-shadow: 0 0 4px rgb(136, 136, 136),
    0px 0px 6px rgb(140, 140, 140),
    0px 0px 8px rgb(166, 166, 166) !important;
}
/* Puls3 */
[data-player-id="334"] .chat-username {
  color: rgb(0, 153, 255) !important;
    text-shadow: 0 0 4px rgb(0, 153, 255),
    0px 0px 6px rgb(26, 163, 255),
    0px 0px 8px rgb(77, 184, 255) !important;
}
/* Hazzy */
[data-player-id="1774"] .chat-username {
  color: rgb(0, 153, 255) !important;
    text-shadow: 0 0 4px rgb(136, 136, 136),
    0px 0px 6px rgb(140, 140, 140),
    0px 0px 8px rgb(166, 166, 166) !important;
}
/* nuts */
[data-player-id="289"] .chat-username {
    color: rgb(0, 0, 0) !important;
    text-shadow: 0 0 4px rgb(204, 204, 204),
    0px 0px 6px rgb(204, 204, 204),
    0px 0px 8px rgba(255, 255, 255, 0.8) !important;
}
/* Xortrox */
[data-player-id="3741"] .chat-username {
    color: rgb(128, 191, 255) !important;
    text-shadow: 0 0 4px rgb(128, 191, 255),
    0px 0px 6px rgb(153, 204, 255),
    0px 0px 8px rgb(204, 230, 255) !important;
}
/* Taran */
[data-player-id="2314"] .chat-username {
    color: rgb(2,78,104);
    text-shadow: 0 0 4px rgb(2,78,104),
    0px 0px 6px rgb(3, 94, 125),
    0px 0px 8px rgb(4, 132, 174) !important;
}
/* Dwadlingyew71 */
[data-player-id="2959"] .chat-username {
    color: rgb(255, 196, 12) !important;
    text-shadow: 0 0 4px rgb(255, 196, 12),
    0px 0px 6px rgb(255, 198, 26),
    0px 0px 8px rgb(255, 210, 77) !important;
}
 /* Obscurity */
[data-player-id="2"] .chat-username {
    color: rgb(160, 32, 240) !important;
    text-shadow: 0 0 4px rgb(160, 32, 240),
    0px 0px 6px rgb(164, 40, 240),
    0px 0px 8px rgb(184, 88, 243) !important;
}
/* TheE1337 */
[data-player-id="3632"] .chat-username {
  color: rgb(240, 97, 68) !important;
    text-shadow: 0 0 4px rgb(240, 97, 68),
    0px 0px 6px rgb(242, 115, 90),
    0px 0px 8px rgb(245, 155, 137) !important;
}
/* pyroheart */
[data-player-id="189"] .chat-username {
  color: rgb(220, 20, 60) !important;
    text-shadow: 0 0 4px rgb(220, 20, 60),
    0px 0px 6px rgb(220, 42, 78),
    0px 0px 8px rgb(220, 86, 113) !important;
}
/* Snek */
[data-player-id="429"] .chat-username {
  color: rgb(210,105,30) !important;
    text-shadow: 0 0 4px rgb(210,105,30),
    0px 0px 6px rgb(222, 112, 32),
    0px 0px 8px rgb(229, 141, 77) !important;
}
/* Zesicla */
[data-player-id="641"] .chat-username {
  color: rgb(255, 165, 0) !important;
    text-shadow: 0 0 4px rgb(255, 165, 0),
    0px 0px 6px rgb(255, 177, 25),
    0px 0px 8px rgb(255, 194, 75) !important;
}

/* TS CSS BELOW */

#gainedres {
  color: ` + elite + ` !important;
}
#gainedtype {
  color: ` + elite + ` !important;
}
#guild_currency {
  color: ` + elite + ` !important;
}
#guild_amount {
  color: ` + elite + ` !important;
}
#quint span {
  color: ` + elite + ` !important;
}
.actionexperience, .actionexperience span {
  color: ` + elite + ` !important;
}
#double_tradeskill span {
  color: ` + elite + ` !important;
}
.terms-section-header {
  color: ` + elite + ` !important;
}

/* COMBAT CSS BELOW */

.timeshit, .timescrit, .timesdodged, .hitstaken, #gainedgold, .actiongold, #guild_gold {
  color: ` + elite + ` !important;
}
#double_battle span {
  color: ` + elite + ` !important;
}
</style>
`);}

//Remove Logo
if (RemoveLogo == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#profile, #menu, #stats-hourly {
  top: -50px;
  background-color: rgba(0,0,0,0) !important;
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.6) , rgba(0,0,0,0.3)) !important;
}
#logo {
  display: none;
}
</style>
`);
}

//legacy Sidebar
if (legacySide == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#menu .frame {
  display: none;
  width: 0px;
  hieght: 0px;
}
#menu {
  padding: 0px;
  background: none !important;
  height: auto !important;
  overflow: hidden;
}
#menu li a {
  font-family: "Open Sans", helvetica, arial;
  color: #969696;
  padding: 5px 0;
  text-decoration: none;
  font-size: 15px;
  padding-left: 15px;
}
#menu li.active a, #menu li:hover a{
	color: #FFFFFF;
	text-decoration: none !important;
}
</style>
`);
}

//Frameless
if (Frameless == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
.frame {
  background: none;
  left: 8px;
}
#gameframe-status-wrapper:after, #progressbar-wrapper::after {
  background: none;
}
#progressbar-wrapper .progressbar {
  top: 0px;
}
#gameframe-status-wrapper {
  line-height: 15px;
  top: 0px;
  left: 0px;
  right: 0px;
}
#gameframe-battle {
  left: 0px;
  right: 0px;
}
#chat {
  padding: 0 ;
}
</style>
`);
}

//Add TSMR Element
if (TSMRLink == 1) {
  var TSMRelem = document.getElementById('gameframe-menu').childNodes[0].childNodes[0].childNodes[0];
  TSMRelem.insertAdjacentHTML("beforebegin", `
  <li style="vertical-align: top;"><a href="http://xer0-puls3.github.io/" target="_blank">TSMR</a></li>`);
}

//Add Release Element
if (ReleaseLink == 1) {
  if (TSMRLink == 1) {
    var Relem = document.getElementById('gameframe-menu').childNodes[0].childNodes[0].childNodes[1];
  }
  else {
    var Relem = document.getElementById('gameframe-menu').childNodes[0].childNodes[0].childNodes[0];
  }
  Relem.insertAdjacentHTML("beforebegin", `
  <li style="vertical-align: top;"><a href="https://github.com/Xer0-Puls3/Pendorian-Elite-UI/releases" target="_blank">Releases</a></li>`);
}

//Remove Battle Stats
if (RemoveBattleStats == 1) {
  leetbattleelem = document.getElementsByClassName('header-stats-user')[0]
  leetbattleelem.parentNode.removeChild(leetbattleelem);
}

//Remove Battle Quest
if (RemoveBattleQuest == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#quest-dropdown [value*="1"] {
  display: none !important;
}
</style>
`);
}

//Remove Food Quest
if (RemoveFoodQuest == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#quest-dropdown [value*="4"] {
  display: none !important;
}
</style>
`);
}

//Remove Copper Quest
if (RemoveCopperQuest == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#quest-dropdown [value*="3"] {
  display: none !important;
}
</style>
`);
}

//Remove Gems Quest
if (RemoveGemsQuest == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#quest-dropdown [value*="5"] {
  display: none !important;
}
</style>
`);
}

//Remove Wood Quest
if (RemoveWoodQuest == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#quest-dropdown [value*="2"] {
  display: none !important;
}
</style>
`);
}

//Remove Battle Tab
if (RemoveBattleTab == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#gameframe-battle ul li:first-child {
  display: none !important;
}
</style>
`);
}

//Remove TS Tab
if (RemoveTSTab == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#gameframe-battle ul li:nth-child(2) {
  display: none !important;
}
</style>
`);
}

//Remove Food Select
if (RemoveFoodSelect == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#tradeskill [value*="3"] {
  display: none !important;
}
</style>
`);
}

//Remove Copper Select
if (RemoveCopperSelect == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#tradeskill [value*="2"] {
  display: none !important;
}
</style>
`);
}

//Remove Gems Select
if (RemoveGemsSelect == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#tradeskill [value*="4"] {
  display: none !important;
}
</style>
`);
}

//Remove Wood Select
if (RemoveGemsSelect == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#tradeskill [value*="1"] {
  display: none !important;
}
</style>
`);
}

//Remove TS Select
if (RemoveTSSelect == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#actioncontent [style*="text-align: center; margin-bottom: 10px; margin-top: 5px;"] {
  display: none !important;
}
</style>
`);
}

//Add height above TS Actions
if (AddActionheight == 1) {
  var head = document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML("beforeend", `
<style>
#actioncontent {
  padding-top: 10px;
}
</style>
`);
}
