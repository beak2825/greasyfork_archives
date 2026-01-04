// ==UserScript==
// @name         YingYingYing
// @namespace    https://github.com/YukariChiba/ying
// @version      0.2.1
// @description  Replace Yings in Chinese
// @author       Yukari Chiba
// @match        http*://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/383437/YingYingYing.user.js
// @updateURL https://update.greasyfork.org/scripts/383437/YingYingYing.meta.js
// ==/UserScript==

GM_addStyle(
  'ying::after { content: "嘤"; } ying:hover::after { content: attr(ori); } '
);

(function () {
  "use strict";

  try {
    new Function("");
  } catch (e) {
    console.log("[YingYingYing] CSP is enabled. Turn off plugin.");
    return;
  }

  var yin = "陻音阴愔慇瘖磤禋欭殷氤洇姻喑噾因堙骃溵湮濦絪緸茵荫裀諲闉",
    yin_2 = "霪银夤訚狺峾崟寅婬犾唫嚚圻垠冘吟龈龂淫蟫訔誾鄞",
    yin_4 = "隐窨慭懚梀廕印胤酳",
    ying = "韺瑛锳璎撄孾柍樱嫈媖婴啨应鹦鹰瀴缨罂膺莺英荥蘡蠳譍譻賏",
    ying_2 = "盈禜籯桯楹浧嬴莹滢潆濙濚瀛瀯茔荧萤萦营蝇謍赢迎",
    ying_4 = "硬映媵",
    ying_reg = RegExp(
      "(?<=(^|>)[^<]*)[" + ying + ying_2 + ying_4 + "](?=[^>]*)",
      "g"
    ),
    yin_reg = RegExp(
      "(?<=(^|>)[^<]*)[" + yin + yin_2 + yin_4 + "](?=[^>]*)",
      "g"
    );

  function regex_replace(base, child) {
    if (ying_reg.test(child.textContent) || yin_reg.test(child.textContent)) {
      base.innerHTML = base.innerHTML
        .replace(ying_reg, '<ying ori="$&" class="ying"></ying>')
        .replace(yin_reg, '<ying ori="$&" class="ying"></ying>');
      return true;
    } else return false;
  }

  function iter(nodes) {
    if (ying_reg.test(nodes.innerHTML) || yin_reg.test(nodes.innerHTML)) {
      var replaced = false;
      for (var i = 0, n = nodes.childNodes.length; i < n; i++) {
        if (nodes.childNodes[i].nodeType == 3 || !replaced) {
          if (regex_replace(nodes, nodes.childNodes[i])) replaced = true;
        }
        if (nodes.childNodes[i].childNodes.length != 0) {
          iter(nodes.childNodes[i]);
        }
      }
    }
  }

  iter(document.body);
})();
