// ==UserScript==
// @name         tora-ranking-mute
// @namespace    https://github.com/zephyruszzz
// @version      0.1
// @description  Hide stuff
// @author       zephyruszzz
// @license      GPL-3.0
// @match        https://ec.toranoana.jp/joshi_r/ec/cot/watch/*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/428322/tora-ranking-mute.user.js
// @updateURL https://update.greasyfork.org/scripts/428322/tora-ranking-mute.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var blockText = "五条悟×虎杖悠仁,虎杖悠仁,五条悟×伏黒恵";
    //var blockText = GM.getValue("blockText");

    function _nodeContainsBlockText(n, e) {
        var t = e.split(",");
        for (let i = 0; i < t.length; i++) {
            if (n.includes(t[i])) {
                return true
            }
        }
        return false
    }
    function _addSettingsButton() {
        var elem = document.createElement('div');
        elem.innerHTML = '<button class="block-button" onclick="openBlockTextForm()">🚫<span class="tooltiptext" id="blockTxtMsg">test</span></button>'
        var st = document.createElement('style');
        st.innerHTML = `
.block-button {
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.1;
  position: fixed;
  bottom: 23px;
  right: 28px;
}
.block-button:hover {
  opacity: 0.6
}
.block-button .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  right: 105%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.block-button .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
}

.block-button:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
  `;
        elem.appendChild(st);

        var sc = document.createElement('script');
        var scForm = document.createTextNode(`
function openBlockTextForm() {
  //document.getElementById("blockTextForm").style.display = "block";
}

function closeBlockTextForm() {
  //document.getElementById("blockTextForm").style.display = "none";
}`)
        sc.appendChild(scForm);
        elem.appendChild(sc);

        document.body.appendChild(elem);
    }



    console.debug(blockText);
    var totalHidden = 0

    _addSettingsButton();

    for (let i = 0; i < document.getElementsByClassName("weed-column").length; i++) {
        var node = document.getElementsByClassName("weed-column")[i]
        if (_nodeContainsBlockText(node.innerHTML, blockText)) {
            console.debug(blockText, i);
            totalHidden += 1;
            node.style.display = "none"
        }
    }

    console.log(blockText, totalHidden)
    document.getElementById("blockTxtMsg").textContent = "Blocked " + totalHidden + " Results for: " + blockText
})();