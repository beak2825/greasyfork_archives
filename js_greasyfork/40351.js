// ==UserScript==
// @name         only design
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Amigo57
// @include      *://*.e-sim.org/*
// @match        *://*.e-sim.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40351/only%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/40351/only%20design.meta.js
// ==/UserScript==

(function() {
        document.body.style.backgroundImage = "url('https://wallpapercave.com/wp/lVcZVvt.jpg')";
    document.body.style.backgroundSize = "auto;width:100%";
    // ===Dizayn===
    document.getElementById("footer").style.backgroundImage = "url(http://mrspals.com/wp-content/uploads/2016/06/other-flags-italy.jpg)";
    document.getElementById("footer").style.backgroundSize = "cover";
    document.getElementById("container").style.setProperty("background-color", "rgba(190, 189, 189, 0.3)", "important");

    // ===css adding===

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }


 addGlobalStyle(`body { margin-left:0px }`);
    addGlobalStyle(`.top-bar {background: rgba(33, 43, 49, 0.7) !important; }`);
    addGlobalStyle(`.canvaback { background: rgba(33, 43, 49, .75) !important; }`);
    addGlobalStyle(`.button.foundation-style { background: linear-gradient(to bottom, rgba(59, 18, 0, 1), rgb(92, 33, 8)) !important; }`);
    addGlobalStyle(`.button.foundation-style:hover { background: linear-gradient(to bottom, rgb(92, 33, 8),rgba(59, 18, 0, 1)) !important; }`);
    addGlobalStyle(`.top-bar-section .dropdown li a { background: rgba(33, 43, 49, 1) !important;}`);
    addGlobalStyle(`.top-bar-section .dropdown li a:hover { background: rgb(54, 69, 79) !important; }`);
    addGlobalStyle(`.top-bar-section ul li:hover { background: rgba(59, 18, 0, 1) !important; }`);
    addGlobalStyle(`.ui-tabs .ui-tabs-nav { background: rgba(59, 18, 0, .7) !important; }`);
    addGlobalStyle(`.ent_list { float:right;margin-right:10px }`);
    addGlobalStyle(`.fpInfoBlueBox {background: rgba(33, 43, 49, .75) !important;text-shadow: none !important;color: #fff !important;font-weight: normal !important;}`);
    addGlobalStyle(`.fpInfoBlueBox a {font-size: 1.125em;color:yellow !important`);
    addGlobalStyle(`.fpInfoBlueBox i, .active-icon > [class*="icon-"], .active-icon > b {color: yellow !important;filter: drop-shadow(1px 1px 1px black);`);
    addGlobalStyle(`#orgMsgOnIndex {background:rgba(59, 18, 0, .7) !important}`);
    addGlobalStyle(`#orgMsgOnIndexText {}`);
    addGlobalStyle(`#Comment {display: none}`);
    addGlobalStyle(`#maines strong {display: block;}`);
    addGlobalStyle(`.foundation-style .dataTable tr:nth-child(even) td {background: rgba(237, 234, 234, 0.8);`);
    addGlobalStyle(`.foundation-style .dataTable tr td {background: #f5acacc9;} !important`);
    addGlobalStyle(`.foundation-style .dataTable>tbody>tr:first-child>td {     background:#0000ff7a; } `);
    addGlobalStyle(`.dataTable a {color: black;} `);
    addGlobalStyle(`.testDivblue { background: #f2f2f2b0 !important;} `);
    addGlobalStyle(`.testDivwhite { background: #f2f2f2b0 !important;} `);
    addGlobalStyle(`.maxAmmountButton {color: darkblue !important;    background-color: transparent !important;}`);
    addGlobalStyle(`input[type="submit"] {border: 1px solid green !important;border-radius: 0 10px 0 10px !important;}`);
    addGlobalStyle(`input[type="text"] {width: 50px !important;    height: 16px;    margin-right: 5px;    border: 1px solid;    border-radius: 5px;    text-align: center;}`);
    addGlobalStyle(`select {border: 0;    padding: 0;    border-radius: 10px;    height: 20px;}`);
    addGlobalStyle(`.headerSection {    background: #0000ff7a !important;}`);
    addGlobalStyle(`#newFightView #battleHeaderImage img {    width: 100%;    height: 300px;`);
    addGlobalStyle(`.`);
    addGlobalStyle(`.`);
    addGlobalStyle(`.`);
    addGlobalStyle(`.`);
    addGlobalStyle(`.`);
    addGlobalStyle(`.`);

    document.getElementById("battleHeaderImage").innerHTML="<img src='https://wallpapersite.com/images/wallpapers/captain-america-2880x1800-iron-man-civil-war-2016-movies-93.jpg'/>";



})();