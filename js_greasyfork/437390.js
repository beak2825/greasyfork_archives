// ==UserScript==
// @name         Improved アルゴ式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提出とか実行を楽にしたいな
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://algo-method.com/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/437390/Improved%20%E3%82%A2%E3%83%AB%E3%82%B4%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437390/Improved%20%E3%82%A2%E3%83%AB%E3%82%B4%E5%BC%8F.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

var gt;
var pre;

const addOpt = (i, t, target) => {
  let opt = document.createElement("option");
  opt.value = i;
  opt.text = t;
  target.appendChild(opt);
};

const checkCorrect = () => {
  if (!document.querySelector(".Button_submitButton__0Snjl")){
      clearInterval(gt);
      return;
  }
  let v = document.getElementById("exSelect").value;
  let a = document.querySelector(".EditorWrapper_codeTestOutputArea__7Ty3v");
  var ans_show = document.getElementById("ansShow");
  if (v < 1) {
    a.style.backgroundColor = "#d6d6d0";
    ans_show.value = "";
  } else {
    let pre = document.querySelectorAll("pre:not([class])");
    let ans = pre[v * 2].innerText.replace(/\nCOPY$/, "\n");
    ans_show.value = ans;
    a.style.backgroundColor = ans === a.value ? "#98fb98" : "#ffffa8";
  }
};

const addShortcutRun = (evt) => {
  if (evt.ctrlKey && evt.keyCode == 13) {
    document.querySelectorAll(".Button_button__HxzDS")[5].click();
  }
};

const replaceInput = () => {
    var v = document.getElementById("exSelect").value;
    var ipt = document.querySelector(".EditorWrapper_codeTestInputArea__fxPTR");
    if (v == 0) {
      ipt.value = "";
    } else {
      ipt.value = pre[(v - 1) * 2 + 1].innerText.replace(/\nCOPY$/, "\n");
      ipt.focus();
    }
  };

const main = () => {
  // check if running func main is needed
  if (!document.querySelector(".Button_submitButton__0Snjl") || document.getElementById("ansShow")) {
    return;
  }

  // set style
  var ed = document.querySelector("section");
  ed.addEventListener("keydown", addShortcutRun);
  ed.style.height = "200px";

  // insert textarea for checking answer
  var ans_show = document.createElement("div");
  ans_show.innerHTML =
    "<div>出力例:</div>" +
    '<textarea class="EditorWrapper_codeTestErrorArea__KClBp" ' +
    'id="ansShow" disabled=""></textarea>';
  ans_show.classList.add("EditorWrapper_codeTestFlex__q5EsJ");
  document
    .querySelectorAll(".EditorWrapper_codeTestFlex__q5EsJ")[2]
    .after(ans_show);

  // create select menu
  pre = document.querySelectorAll("pre:not([class])");
  var select_ex = document.createElement("select");
  select_ex.id = "exSelect";
  select_ex.classList.add("EditorWrapper_languageChanger___Fl02");
  select_ex.style.marginLeft = "5px";
  select_ex.style.textAlignLast = "center";
  addOpt(0, `---`, select_ex);
  for (var i = 1; i <= (pre.length - 1) / 2; i++) {
    addOpt(i, `例 ${i}`, select_ex);
  }
  select_ex.onchange = replaceInput;

  // insert select menu
  document
    .querySelector(".EditorWrapper_codeTestHeader__SEnNi")
    .after(select_ex);

  // add timer of checking answer
  gt = setInterval(checkCorrect, 100);
  Array.from(document.getElementsByTagName("textarea"))
    .slice(1)
    .forEach((e) => (e.style.height = "10vh"));

  // add shortcut
  var ipt = document.querySelector(".EditorWrapper_codeTestInputArea__fxPTR");
  ipt.placeholder = "Run: ctrl + Enter";
  ipt.addEventListener("keydown", addShortcutRun);
};
setInterval(main, 1000);