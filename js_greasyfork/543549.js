// ==UserScript==
// @name         Grundo's Cafe Sakhmet Solitaire & Pyramids for Mobile
// @namespace    http://tampermonkey.net/
// @version      2025-07-27
// @description  Adds a toggle that removes everything from the page but the gameboard for Sakhmet Solitaire & Pyramids.
// @author       darknstormy
// @match        https://www.grundos.cafe/games/sakhmet_solitaire/
// @match        https://www.grundos.cafe/games/pyramids/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543549/Grundo%27s%20Cafe%20Sakhmet%20Solitaire%20%20Pyramids%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/543549/Grundo%27s%20Cafe%20Sakhmet%20Solitaire%20%20Pyramids%20for%20Mobile.meta.js
// ==/UserScript==

const MOBILE_MODE_ENABLED = "MobileModeEnabled"

const gameHeaderHtml = `
<div style=" display: flex; align-items: center; padding-bottom: 4px;" id="gameheader">
<span style="margin-right: 4px;">Mobile Mode</span>
<label class="switch">
  <input type="checkbox" id="mobileModeToggle">
  <span class="slider round"></span>
</label>
</div>`

const switchCss = `.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input[type='checkbox'] + label {
  display: inline-block;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}`

addMobileModeButton()

function addMobileModeButton() {
    let gameHeader = $(gameHeaderHtml)

    GM_addStyle(switchCss)
    $("#gamearea form").css("flex", 1)

    gameHeader.insertBefore("#gamearea form")

    $('#gamearea form').prependTo('#gameheader')

    $("#mobileModeToggle")[0].addEventListener('change', function() {
        if (this.checked) {
            GM_setValue(MOBILE_MODE_ENABLED, true)
            showGameAreaOnly()
        } else {
            GM_setValue(MOBILE_MODE_ENABLED, false)
            showEverything()
        }
    });

    let mobileModeEnabled = GM_getValue(MOBILE_MODE_ENABLED, false)
    $("#mobileModeToggle")[0].checked = mobileModeEnabled

    if (mobileModeEnabled) {
        showGameAreaOnly()
    }
}

function showGameAreaOnly() {
    var gameArea = $('#gamearea')
    gameArea.siblings().hide()
    gameArea.parents().siblings().hide()
}

function showEverything() {
    var gameArea = $('#gamearea')
    gameArea.siblings().show()
    gameArea.parents().siblings().show()
}