// ==UserScript==
// @name         stock-company
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Amigo57
// @match        *://*.e-sim.org/stockCompanyProducts.html?id=*&y


// @downloadURL https://update.greasyfork.org/scripts/40349/stock-company.user.js
// @updateURL https://update.greasyfork.org/scripts/40349/stock-company.meta.js
// ==/UserScript==

(function() {

            document.body.style.backgroundImage = `none` ;


    var priceEls4 = document.getElementsByClassName("testDivwhite");
    var price4 = priceEls4[0].innerHTML;
    document.body.innerHTML = price4;
    document.body.innerHTML = document.body.innerHTML.replace('Storage', '');


    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle(`body{margin:0px;padding:10px !important}`);
    addGlobalStyle(`.storage{background:none repeat scroll 0 0 #3d6571;border:1px solid #333;margin:0 2px 15px;box-shadow:0 0 1px rgba(0,180,255,0.2);-moz-box-shadow:0 0 1px rgba(0,180,255,0.2);-o-box-shadow:0 0 1px rgba(0,180,255,0.2);-webkit-box-shadow:0 0 1px rgba(0,180,255,0.2);border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;float:left}`);
    addGlobalStyle(`.storage>div:first-child{background:transparent;border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;color:white;font-weight:bold;height:15px;line-height:14px;text-align:center;text-shadow:1px 1px 2px black;width:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2){background:url("../img/stripes.png") repeat scroll 0 0 #3d6571;border-top:1px solid #333;box-shadow:0 0 15px #555 inset;-webkit-box-shadow:0 0 15px #555 inset;-o-box-shadow:0 0 15px #555 inset;-moz-box-shadow:0 0 15px #555 inset;width:52px;height:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2):hover{background-color:#2c90b2}`);
    addGlobalStyle(`.storage>div>img:last-child{position:relative;top:-9px;border-top:1px solid #333;background:#3d6571}.`);
    addGlobalStyle(`.storage>div>img:first-child{width:40px;height:40px;background:none!important;border:0;margin:6px;position:static;border-top:0}`);
    addGlobalStyle(`.storage{background:none repeat scroll 0 0 #3d6571;border:1px solid #333;margin:0 2px 15px;box-shadow:0 0 1px rgba(0,180,255,0.2);-moz-box-shadow:0 0 1px rgba(0,180,255,0.2);-o-box-shadow:0 0 1px rgba(0,180,255,0.2);-webkit-box-shadow:0 0 1px rgba(0,180,255,0.2);border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;float:left}`);
    addGlobalStyle(`.storage>div:first-child{background:transparent;border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;-o-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;color:white;font-weight:bold;height:15px;line-height:14px;text-align:center;text-shadow:1px 1px 2px black;width:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2){background:url("../img/stripes.png") repeat scroll 0 0 #3d6571;border-top:1px solid #333;box-shadow:0 0 15px #555 inset;-webkit-box-shadow:0 0 15px #555 inset;-o-box-shadow:0 0 15px #555 inset;-moz-box-shadow:0 0 15px #555 inset;width:52px;height:52px}`);
    addGlobalStyle(`.storage>div:nth-child(2):hover{background-color:#2c90b2}`);
    addGlobalStyle(`.storage>div>img:last-child{position:relative;top:-9px;border-top:1px solid #333;background:#3d6571}`);
    addGlobalStyle(`.storage>div>img:first-child{width:40px;height:40px;background:none!important;border:0;margin:6px;position:static;border-top:0}`);




})();