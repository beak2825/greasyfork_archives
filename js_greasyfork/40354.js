// ==UserScript==
// @name         Historical work results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Amigo57
// @match        *://*.e-sim.org/companyWorkResults.html?id=*&y


// @downloadURL https://update.greasyfork.org/scripts/40354/Historical%20work%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/40354/Historical%20work%20results.meta.js
// ==/UserScript==

(function() {

            document.body.style.backgroundImage = `none` ;


    var priceEls4 = document.getElementsByClassName("testDivwhite");
    var price4 = priceEls4[0].innerHTML;
    document.body.innerHTML = price4;

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`body {padding:0px !important;margin:0px;color:black;text-align:center`);
    addGlobalStyle(`#productivityTable {width: auto !important;;background: #f2f2f2b0 !important;}`);
    addGlobalStyle(`#productivityTable > tbody > tr > td > div:first-child {
    color: red;
    font-weight: bold;
}`);
    addGlobalStyle(`.dataTable>tbody>tr:first-child>td {
    background: #0000ff7a;
}`);
    addGlobalStyle(`.dataTable{font-size:14px;text-align:center;border-spacing:0;border-radius:6px;-moz-border-radius:6px;-o-border-radius:6px;-webkit-border-radius:6px;box-shadow:0 0 2px rgba(0,0,0,0.4);-o-box-shadow:0 0 2px rgba(0,0,0,0.4);-webkit-box-shadow:0 0 2px rgba(0,0,0,0.4);-moz-box-shadow:0 0 2px rgba(0,0,0,0.4);border-collapse:inherit;border:1px solid #888;word-wrap:break-word}`);
    addGlobalStyle(`.dataTable tr td{padding:2px;height:35px;border-right:1px solid #777;border-bottom:1px solid #777;border-left:0;border-top:0;background:#f2f2f2;padding:.4em!important;font-size:.9em;font-family:'Open Sans',Arial,sans-serif;text-shadow:0 0 2px white,0 1px 1px white}`);
    addGlobalStyle(`.dataTable>tbody>tr:first-child>td{background-image:url('../img/bg.png');height:33px;font-size:11px;font-weight:normal!important;text-transform:uppercase!important;text-align:center;padding:.6em .2em!important;text-shadow:none!important;color:#f2f2f2!important;border-right:0;text-shadow:0 0 2px #f2f2f2,0 1px 1px #f2f2f2;border-color:#111}`);
    addGlobalStyle(`.dataTable tr:first-child>td:first-child{border-top-left-radius:5px;border-top:0;border-left:0}`);
    addGlobalStyle(`.dataTable tr>td:last-child{border-right:0}`);
    addGlobalStyle(`.dataTable tr:first-child>td:last-child{border-top-right-radius:5px;border-right:0}`);
    addGlobalStyle(`.dataTable tr:last-child>td:first-child{border-bottom-left-radius:5px}`);
    addGlobalStyle(`.dataTable tr:last-child>td{border-bottom:0}`);
    addGlobalStyle(`.dataTable tr:last-child>td:last-child{border-bottom-right-radius:5px;border-bottom:0;border-right:0}`);





})();