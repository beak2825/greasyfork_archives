// ==UserScript==
// @name         Melvor Alternate Sidebar
// @version      0.1.0
// @description  Replaces the skills in the sidebar with a more compact layout similar to osrs.
// @author       8992
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/418366/Melvor%20Alternate%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/418366/Melvor%20Alternate%20Sidebar.meta.js
// ==/UserScript==

//remove existing skills from sidebar
for (let i = 0; i < skillLevel.length; i++) {
  if ([9,17,18].includes(i)) {
    $('#nav-skill-progress-all-' + i).remove();
  } else $('#nav-skill-tooltip-' + i).remove();
}
$('#nav-skill-tooltip-16').remove();
$('#farming-glower').remove();

//insert css for new skill level table
var styles = `
  .newclass1 {
    height: 322px;
    width: 230px;
    padding-left:5px;
    background-color: transparent;
  }
  .newclass2 {
    height: 44px;
    width: 72px;
    margin: 0px;
    background-color: #2c343f;
    padding-top: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    padding-left: 3px;
  }
  .newclass2:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  }
`;
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

//insert html for new skill level table
$("li.nav-main-heading:contains(Skills)")[0].insertAdjacentHTML('afterend',`
  <div class="newclass1">
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/attack/attack.svg">
      <span id="nav-skill-progress-all-6"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-6"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/hitpoints/hitpoints.svg">
      <span id="nav-skill-progress-all-9"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-9"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(10);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/mining/mining.svg">
      <span id="nav-skill-progress-all-4"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-4"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/strength/strength.svg">
      <span id="nav-skill-progress-all-7"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-7"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(15);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/farming/farming.svg">
      <span id="nav-skill-progress-all-11"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-11"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(11);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/smithing/smithing.svg">
      <span id="nav-skill-progress-all-5"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-5"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/defence/defence.svg">
      <span id="nav-skill-progress-all-8"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-8"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(19);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/herblore/herblore.svg">
      <span id="nav-skill-progress-all-19"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-19"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(7);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/fishing/fishing.svg">
      <span id="nav-skill-progress-all-1"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-1"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/ranged/ranged.svg">
      <span id="nav-skill-progress-all-12"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-12"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(17);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/crafting/crafting.svg">
      <span id="nav-skill-progress-all-14"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-14"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(9);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/cooking/cooking.svg">
      <span id="nav-skill-progress-all-3"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-3"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(23);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/magic/magic.svg">
      <span id="nav-skill-progress-all-16"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-16"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(18);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/runecrafting/runecrafting.svg">
      <span id="nav-skill-progress-all-15"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-15"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(8);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/firemaking/firemaking.svg">
      <span id="nav-skill-progress-all-2"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-2"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/prayer/prayer.svg">
      <span id="nav-skill-progress-all-17"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-17"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(16);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/fletching/fletching.svg">
      <span id="nav-skill-progress-all-13"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-13"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(0);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/woodcutting/woodcutting.svg">
      <span id="nav-skill-progress-all-0"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-0"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(13);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/slayer/slayer.svg">
      <span id="nav-skill-progress-all-18"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-18"></span></span>
    </button>
    <button type="button" class="newclass2" onclick="changePage(14);">
      <img class="skill-icon-sm m-0" style="float:left;" src="assets/media/skills/thieving/thieving.svg">
      <span id="nav-skill-progress-all-10"  style="text-align:center; vertical-align:middle; color:whitesmoke; font-size:14px; font-weight:600;"><span id="nav-skill-progress-10"></span></span>
    </button>
  </div>
`);

//update skill levels
for (let i = 0; i < skillLevel.length; i++) {
  updateSkillWindow(i);
}