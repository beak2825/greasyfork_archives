// ==UserScript==
// @name        Expanded Ratio
// @namespace   soyjak.party
// @match       http*://soyjak.party/*
// @version     1.0
// @author      Chud
// @description Ratio Time
// @license NIGGER
// @downloadURL https://update.greasyfork.org/scripts/458453/Expanded%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/458453/Expanded%20Ratio.meta.js
// ==/UserScript==
const modifiers = ["==", "--", ""];
let done = new Array(20);
let stringSets = {
  "Generic": ["holy shit", "holy shiiiit", "holy fuck", "holy fuck.", "fuckin hell", "holy fuckk", "holy fuckkk", "holy fuckkkk", "lfg", "lfggg", "lfgggg", "lfg!", "lfg!!", "lfgg!!!", "w", "dub", "massive w", "huge w", "gigantic w", "massive dub", "huge dub", "another dub", "another w", "gigantic w", "get his ass", "get that nigga", "lets fucking go", "lets fucking gooo", "lets fucking goooo", "lets fucking goooo", "lets fucking go!", "lets fucking go!!", "lets fucking go!!!", "lets fucking go!!!!!", "yo get his ass", "yo get em", "yooo", "yoooo", "yooooooo", "yoooooooooooo", "god damn", "got damn", "god damnnn", "damnnnnn", "own that fraud", "expose that fraud", "lets gooo", "lets gooooo", "let's goooooo", "keyed", "keyed af", "holy keyed", "gem", "massive gem", "gemerald", "wem", "huge gem", "gigantic gem", "sharty saving gem", "diamond", "sharty saving diamond", "up", "go up", "go the fuck up", "up up up", "go tf up", "'chup", "own that fraud", "get they ass", "beat his ass", "kill that nigga", "can't stop winning", "we cant stop winning bros", "diamonderald", "btfo", "eternally btfo", "zamn", "zamnnn", "holy based", "based af"],
  "Cob": ["another cob w", "#cobgang", "another gemson victory", "gemson win", "gemson victory", "gemson up", "god tier wojack", "gem tier godjack", "cobby up", "cobby go up", "godson up", "upson", "keyedson", "winson", "cob w", "cob dub", "cobby win", "#cobgang win", "#cobgang victory", "hwabag", "god tier winjack", "diamondson go up", "winson up", "gemson go up", "godson go up", "gemson dub", "gemson w", "godson dub", "godson w", "#cobgang dub", "#cobgang w", "cobwin", "he won", "he fucking won", "he cant stop winning"],
  "Chud":["1488","fuck niggers","kill all blacks","kanye 2024","dial eight","-ACK!","sieg heil!","jews","media is kiked","goyslop","hang yourself troon","the west has fallen","back to /leftypol/","amerimutt","women are made for rape"],
   "Frognigger":["FROGNIGGERS BTFO","FROGTROONS BTFO","GO BACK TO TROONC0RD","GO BACK TO FEDSCHAN","FROGNIGGER GLOWNIGGER COAL","KILL ALL FROGTROONS","DIE OUT","KILL YOURSELF FROGNIGGER","FROGCUCKS ARE OWNED BY BIG SOY COCK","GLOWNIGGER GO BACK","HANG YOURSELF FROGTROON","KILL YOURSELF FROGMUTT","FROGNIGGERS ARE FOREVER CUCKED BY SOYKINGS","YOU WILL NEVER BE WELCOME HERE","GO EXTINCT"],
   "Insult":["DIE OUT","KILL YOURSELF","GET OUT OF SOYJAK.PARTY","GO BACK TO TWITTER","THE COALIEST BRIMSTONE","GO EXTINCT","KYS","COAL","BRIMSTONE","GLOWNIGGER GO BACK","HANG YOURSELF","LEAVE, 'C0RDTROON","KILL YOURSELF NIGGER","YOU WILL NEVER BE WELCOME HERE","KILL YOURSELF TRANNY"],

}
let targetPosts = [];
let sets = [stringSets["Generic"]];
setInterval(() => {
  document.querySelectorAll(".button.alert_button").forEach(e => e.click());
  if (targetPosts.length == 0 || sets.length == 0) {
    return;
  }
  let post = "";
  targetPosts.forEach(p => post += `>>${p}\n`);
  let effect = "";
  if (Math.random() > 0.5) {
    effect = modifiers[Math.floor(Math.random() * modifiers.length)];
  }
  post += effect;
  let strings = sets.flat();
  stringsLength = strings.length;
  let found = false;
  while (!found) {
    text = strings[(Math.floor(Math.random() * stringsLength))];
    if (!done.includes(text)) {
      if (Math.random() > 0.5) {
        text = text.toUpperCase();
      }
      post += text;
      found = true;
      done.unshift(text);
      done.pop();
    }
  }
  post += effect;
  document.querySelector("form[name=post] textarea#body").value = post;
  document.querySelector("form[name=post] input[value*='Reply']").click();
}, 12000);
function addRatioButton(post) {
  post.querySelector(".intro").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" class="ratio" postNumber="${post.getElementsByClassName("post_no")[1].textContent}">[Ratio]</a>`);
}
let options = Options.add_tab("ratio", "gear", "Ratio").content[0];
let optionsHTML = "";
for ([key, value] of Object.entries(stringSets)) {
  optionsHTML += `<input type="checkbox" id="ratio-${key}" name="${key}"><label for="ratio-${key}">${key}</label><br>`;
}
options.insertAdjacentHTML("beforeend", optionsHTML);
options.querySelectorAll("input[type=checkbox]").forEach(e => {
  e.addEventListener("change", e => {
    sets = [];
    options.querySelectorAll("input[type=checkbox]:checked").forEach(c => sets.push(stringSets[c.getAttribute("name")]));
  });
  e.checked = e.getAttribute("name") == "Generic";
});
const updateObserver = new MutationObserver(list => {
  list.forEach(node => {
    if (node.addedNodes[0].nodeName == "DIV") {
      addRatioButton(node.addedNodes[0]);
    }
  });
});
updateObserver.observe(document.querySelector(".thread"), {
  childList: true
});
[...document.getElementsByClassName("post")].forEach(e => {
  addRatioButton(e);
});
document.addEventListener("click", e => {
  let t = e.target;
  if (t.classList.contains("ratio")) {
    if (t.textContent == "[Ratio]") {
      t.textContent = "[Unratio]";
      targetPosts.push(t.getAttribute("postNumber"));
    } else {
      targetPosts = targetPosts.filter(p => p != t.getAttribute("postNumber"));
      t.textContent = "[Ratio]";
    }
  }
});