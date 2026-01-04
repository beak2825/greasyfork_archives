// ==UserScript==
// @name         Bloble.io Enchantment pack "MATRIX"
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  this is a texture pack
// @author       barely heard of 5O5
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404300/Blobleio%20Enchantment%20pack%20%22MATRIX%22.user.js
// @updateURL https://update.greasyfork.org/scripts/404300/Blobleio%20Enchantment%20pack%20%22MATRIX%22.meta.js
// ==/UserScript==

var css = document.createElement("style")
css.innerText = `
#chatBox {
    FONT-VARIANT-EAST-ASIAN: JIS83;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 350px;
    overflow: hidden;
}
.greyMenuText {
    color: #92bc91;
}
#skinSelector {
    display: none;
    font-family: 'regularF';
    font-size: 26px;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    border-radius: 8px;
    background-color: #3ca639;
    color: #021101;
    cursor: pointer;
}
#enterGameButton {
    font-family: 'regularF';
    font-size: 26px;
    padding: 5px;
    color: #021101;
    background-color: #3ca639;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    border-radius: 8px;
}
#gameTitle {
    color: #3ca639;
    font-size: 90px;
    width: 100%;
    text-align: center;
    font-family: 'regularF';
}
#skinInfo {
    position: absolute;
    display: none;
    text-align: left;
    width: 110px;
    margin-left: -140px;
    padding: 6px;
    padding-top: 3px;
    padding-left: 16px;
    color: #031401;
    border-radius: px;
    background-color: #021101;
    font-family: 'regularF';
    font-size: 15px;
}
.unitItem {
    pointer-events: all;
    margin-left: 18px;
    position: relative;
    display: inline-block;
    width: 69px;
    height: 65px;
    background-color: rgba(40, 40, 40, 0.5);
    border-radius: 8px;
    cursor: pointer;
}
#scoreContainer {
    display: inline-block;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
    font-size: 20px;
    border-radius: 4px;
    color: #fff;
}
#leaderboardContainer {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
    font-size: 24px;
    border-radius: 4px;
    color: #fff;
}
#darkener {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #021101;
}
`
document.head.appendChild(css)

backgroundColor = "#010a01";
outerColor = "#010700";
indicatorColor = "rgba(0, 255, 0, 0.3)"
turretColor = "#9fa89f";
bulletColor = "#9fa89f";
redColor = "rgba(255, 0, 0, 0.3)";