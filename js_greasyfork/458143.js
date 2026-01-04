// ==UserScript==
// @name        Frognigger Ratio [PUBLIC]
// @namespace   soyjak.party
// @match       http*://soyjak.party/*
// @version     1.0
// @author      Nigger
// @description Frogniggers ETERNALLY BTFO
// @license wtfpl
// @downloadURL https://update.greasyfork.org/scripts/458143/Frognigger%20Ratio%20%5BPUBLIC%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/458143/Frognigger%20Ratio%20%5BPUBLIC%5D.meta.js
// ==/UserScript==
const modifiers = ["==", "%%", "--", "'", ""];
let done = new Array(20);
let stringSets = {
  "Frognigger":["FROGNIGGERS BTFO","FROGTROONS BTFO","GO BACK TO TROONC0RD","GO BACK TO FEDSCHAN","FROGNIGGER GLOWNIGGER COAL","KILL ALL FROGTROONS","DIE OUT","KILL YOURSELF FROGNIGGER","FROGCUCKS ARE OWNED BY BIG SOY COCK","GLOWNIGGER GO BACK","HANG YOURSELF FROGTROON","KILL YOURSELF FROGMUTT","FROGNIGGERS ARE FOREVER CUCKED BY SOYKINGS","YOU WILL NEVER BE WELCOME HERE","GO EXTINCT"],
   "Frognigger Redtext":["==FROGNIGGERS BTFO==","==FROGTROONS BTFO==","==GO BACK TO TROONC0RD==","==GO BACK TO FEDSCHAN==","==FROGNIGGER GLOWNIGGER COAL==","==KILL ALL FROGTROONS==","==DIE OUT==","==KILL YOURSELF FROGNIGGER==","==FROGCUCKS ARE OWNED BY BIG SOY COCK==","==GLOWNIGGER GO BACK==","==HANG YOURSELF FROGTROON==","==KILL YOURSELF FROGMUTT==","==FROGNIGGERS ARE FOREVER CUCKED BY SOYKINGS==","==YOU WILL NEVER BE WELCOME HERE==","==GO EXTINCT=="]
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