// ==UserScript==
// @name         CSGORoll XP Calculator
// @namespace    https://gge.gg/
// @version      0.1.1
// @description  Script will calculate the XP needed for next and/or requested level
// @author       twitter.com/thes0meguy
// @match        https://www.csgoroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgoroll.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/479427/CSGORoll%20XP%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/479427/CSGORoll%20XP%20Calculator.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';


const lvlarray = [ 0, 8300, 17400, 27600, 38800, 51200, 65000, 80100, 96900, 115400, 135800, 158400, 183300, 210700, 241100, 274600, 311500, 352300, 397300, 447000, 501800, 562400, 629100, 702800, 784200, 874000, 973000, 1082400, 1203100, 1336300, 1483300, 1645600, 1824700, 2022400, 2240600, 2481500, 2747300, 3040800, 3364800, 3722400, 4117100, 4552900, 5033900, 5564900, 6151200, 6798300, 7512700, 8301400, 9172100, 10133300, 11194500, 12366000, 13659400, 15087200, 16663600, 18404000, 20325400, 22446600, 24788600, 27374200, 30228800, 33380400, 36859900, 40701500, 44942800, 49625400, 54795300, 60503200, 66805100, 73762700, 81444500, 89925700, 99289500, 109627800, 121042100, 133644300, 147558100, 162920000, 179880800, 198606800, 219281800, 242108700, 267311400, 295137300, 325859400, 359779200, 397229400, 438577600, 484229500, 534633200, 590283100, 651725300, 719562900, 794461400, 877155800, 968457700, 1069262900, 1180560600, 1303443100, 1439116000, 1588910900, 1754297600, 1936899200, 2138507300, 2361100600, 2606863200, 2878206900, 3177794300, 3508565400, 3873766100, 4276980100, 4722164100, 5213686900, 5756371800, 6355544300, 7017084000, 7747482800, 8553908200, 9444273700, 10427316700, 11512683800 ]
let desired_level = 0;


const codes = ["LOUFREE", "JOHNCS"]
var rand = 0;
var code = codes[rand]


setInterval(() => {

  if (rand == 0) {
    code = codes[rand]
    rand = 1
  } else {
    code = codes[rand]
    rand = 0
  }

},30000)

function calc() {
    let input_data = document.getElementById("xpcalc-level");
    if (input_data) {
      var sel = document.getElementById("xpcalc-level");
      sel.addEventListener("input", function(e){
          desired_level = sel.value;

      });
    }

  }


setInterval(() => {

  const xp_bar = document.querySelectorAll(".xp-text");
  const profile = document.querySelectorAll(".profile");
  if (!xp_bar || !profile) {
    return
  }
  var result = [];
  for (var i = 0; i < xp_bar.length; i++) {
      result.push(xp_bar[i].textContent);
  }


  var xp_text = String(result[0])
  var matches = xp_text.match(/(\d+).*?(\d+)/);
  if (matches == null || matches == "undefined") {
    return
  }
  const xp_current = parseInt(matches[1])

  let lvl = 0;
  for (var i = 0; i < lvlarray.length; i++) {
    if (xp_current >= lvlarray[i]) {
      lvl++;
    }
  }
  const total_wagered = xp_current / 400;
  let xp_fornext = lvlarray[lvl] - xp_current;
  let wager_fornext = (lvlarray[lvl] / 400) - total_wagered;
  let percent = (100 * (lvlarray[lvl] - xp_current)) / ((lvlarray[lvl]) - (lvlarray[lvl - 1]))
  percent = 100 - (Math.round(percent * 100) / 100)
  wager_fornext = Math.round(wager_fornext * 100) / 100
  let dice_fornext = (wager_fornext * 0.05)
  percent = Math.round(percent * 100) / 100

  let xp_fordesired = lvlarray[desired_level - 1];
  let wager_fordesired = xp_fordesired / 400;


  let xp_needed = xp_fordesired - xp_current;
  let wager_needed = wager_fordesired - total_wagered;
  let dice_fordesired = (wager_needed * 0.05)
  if (xp_needed < 0) {
    wager_needed = "Reached!"
    xp_needed = "Reached!"
  }

  let xpcalc = document.getElementById("xpcalc-net");
  if (!xpcalc) {
      xpcalc = document.createElement("div");
      xpcalc.classList.add("xpcalc-net-div")
      xpcalc.classList.add("card")
      xpcalc.classList.add("card-body")
      xpcalc.id = "xpcalc-net";
      xpcalc.style.cssText = "display: flex;flex-direction: row;gap: 2rem;flex-wrap: wrap;"
      profile[0].append(xpcalc)
      xpcalc.innerHTML = " \
\
      <div id=\"xpcalc-level-input\">\
        </div><div id=\"xpcalc-level-info\" style=\"justify-content: space-around;flex-wrap: wrap; min-width: 80%; display: flex;flex-direction: row;gap: 2rem;align-items: center;font-weight: 600;font-size: .8rem;text-transform: uppercase; color: #767b83;\">" ;
  }
  let dl_color = "#d19f69"
  let l_color = "#d19f69"
  if (desired_level < 121) {
    dl_color = "<font style=\"color:#d44339;\">"+desired_level+"</font>"
  }
  if (desired_level < 100) {
    dl_color = "<font style=\"color:#0ec555;\">"+desired_level+"</font>"
  }
  if (desired_level < 80) {
    dl_color = "<font style=\"color:#fad84e;\">"+desired_level+"</font>"
  }
  if (desired_level < 60) {
    dl_color = "<font style=\"color:#bdc5d1;\">"+desired_level+"</font>"
  }
  if (desired_level < 40) {
    dl_color = "<font style=\"color:#d19f69;\">"+desired_level+"</font>"
  }
  if (desired_level < 20) {
    dl_color = "<font style=\"color:#9f9991;\">"+desired_level+"</font>"
  }
  if (lvl < 121) {
    l_color = "#d44339"
  }
  if (lvl < 100) {
    l_color = "#0ec555"
  }
  if (lvl < 80) {
    l_color = "#fad84e"
  }
  if (lvl < 60) {
    l_color = "#bdc5d1"
  }
  if (lvl < 40) {
    l_color = "#d19f69"
  }
  if (lvl < 20) {
    l_color = "#9f9991"
  }




  let xpcalc_info = document.getElementById("xpcalc-level-info");
  var text = "\
    <div style=\"min-width: 30%;\">\
      <table style=\"width: 100%;border-collpse: collapse;\">\
        <tr style=\"border-bottom: 2px solid #ffffff33;\">\
          <td>Lvl: </td><td style=\"color: "+l_color+";\">"+lvl+ "</td>\
        </tr>\
        <tr>\
          <td>Your current XP: </td>\
          <td style=\"color: #bcbebf;\">" + xp_current.toLocaleString() +  "</td>\
        </tr>\
        <tr>\
          <td>Total wagered: </td>\
          <td style=\"color: #bcbebf;\">"  + total_wagered.toLocaleString() + "</td>\
        </tr>\
        <tr>\
          <td>XP needed for next level: </td>\
          <td style=\"color: #bcbebf;\">" + xp_fornext.toLocaleString() + "</td>\
        </tr>\
        <tr>\
          <td>Wager for next: </td>\
          <td style=\"color: #bcbebf;\">" + wager_fornext.toLocaleString() + "</td>\
        </tr>\
        <tr>\
          <td><a href=\"https://www.youtube.com/watch?v=iBFJeOCrN0s\" target=\"_blank\">Dice strat for next:</a> </td>\
          <td style=\"color: #bcbebf;\">" + dice_fornext.toLocaleString() + "</td>\
        </tr>\
      </table>\
    </div>";

  xpcalc_info.innerHTML = text
  if (desired_level>0 && desired_level < 121) {
    var desired_level_text = "\
    <div style=\"min-width: 30%;\">\
      <table style=\"width: 100%;border-collpse: collapse;\">\
        <tr>\
          <td>XP Total needed for " + dl_color + " level: </td>\
          <td style=\"color: #bcbebf;\">"+xp_fordesired.toLocaleString()+"</td>\
        </tr>\
        <tr>\
          <td>Wager total needed for " + dl_color + " level: </td>\
          <td style=\"color: #bcbebf;\">"+wager_fordesired+"</td>\
        </tr>\
        <tr>\
          <td><BR>XP you need for " + dl_color + " level: </td>\
          <td style=\"color: #bcbebf;\"><BR>"+xp_needed.toLocaleString()+"</td>\
        </tr>\
        <tr>\
          <td>Wager you need for " + dl_color + " level: </td>\
          <td style=\"color: #bcbebf;\">"+wager_needed.toLocaleString() + "</td>\
        </tr>\
        <tr>\
          <td><a href=\"https://www.youtube.com/watch?v=iBFJeOCrN0s\" target=\"_blank\">Dice strat for desired:</a> </td>\
          <td style=\"color: #bcbebf;\">" + dice_fordesired.toLocaleString() + "</td>\
        </tr>\
      </table>\
    </div>"
    xpcalc_info.innerHTML += desired_level_text
  }

  xpcalc_info.innerHTML += "\
    <div style=\"display:flex; flex-direction: column; gap: .7rem; align-items: center;\">\
      <div id=\"progress\" style=\"text-align: center;font-size: .7rem;border-radius: 10px;padding: 1rem; width: 100%;background: linear-gradient(90deg, " + l_color + " "+percent+"%, rgba(30,33,39,1) "+percent+"%); color: #fff;text-shadow: 1px 1px 6px black;\" >\
        Progress to " + (lvl + 1) +" level: "+xp_current.toLocaleString()+ " / " + lvlarray[lvl].toLocaleString() + " - "+percent+"% <BR> need to wager " + wager_fornext.toLocaleString() +" coins more</div>\
      <div style=\"margin-top: 10px;font-size:1rem;color:#fff;\">\
        USE CODE <input type=\"text\" value=\""+code+"\" readonly style=\"text-align: center;font-weight: 600;border:none!important; background-color: #262a30;color: #0ec555;width:8ch;\"> for +5% deposit bonus\
        </div>\
    </div>"

  let xpcalc_input = document.getElementById("xpcalc-level");
  let xpcalc_level_input = document.getElementById("xpcalc-level-input");
  if (!xpcalc_input) {
    xpcalc_level_input.innerHTML = "\
    <input type=\"number\" id=\"xpcalc-level\" style=\"background: #1e2127;color: #fff;border: 1px #000 !important;padding: 0.8rem;border-radius: 10px;\">\
    <div style=\"position: absolute;top: 10px;background: #262a30;\">Desired level</div>"
  }
calc()


}, 2000);


    // Your code here...
})();