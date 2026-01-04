// ==UserScript==
// @name         P&W - Better CSS
// @namespace    redcore.com.br
// @version      0.0.2
// @description  Politics and War - Better CSS.
// @author       WingedSpak
// @include      https://politicsandwar.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/396098/PW%20-%20Better%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/396098/PW%20-%20Better%20CSS.meta.js
// ==/UserScript==

/**
 * FEATURES:
 * - New design
 */
(() => {

  cssRules();

  const informationbarCSS = "informationbar col-xs-12";
  const logoId = "header";
  const rightcolumnId = "rightcolumn";
  const rightcolumnCss = "hidden-xs";



  // Perfumaria
  let informationbar = document.getElementsByClassName(informationbarCSS);

  if (informationbar.length > 0) {

    let logoHTML = `<span style="float:left;"><img src="/img/logo.png" alt="Politics &amp; War Logo" class="logo img-responsive center-block"></span>`
    logoHTML += informationbar[0].innerHTML
    informationbar[0].innerHTML = logoHTML;

    document.getElementById(logoId).innerHTML = '<div class="header-space"></div>';

    let getElementRightcolumn = document.getElementById(rightcolumnId);
    let rightcolumn = getElementRightcolumn.getElementsByClassName(rightcolumnCss)[0];

    rightcolumn.innerHTML = "";
    rightcolumn.style = "";
    rightcolumn.className = "";
  }

  function GM_addStyle(cssStr) {
    var D = document;
    var newNode = D.createElement('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(newNode);
  }

  function cssRules() {

    GM_addStyle(`
    :root {
        --color1: rgba(216, 219, 226, 1); /* GAINSBORO */
        --color2: rgba(169, 188, 208, 1); /* PASTEL BLUE */
        --color3: rgba(88, 164, 176, 1); /* CADET BLUE */
        --color4: rgba(55, 63, 81, 1); /* CHARCOAL */
        --color5: rgba(27, 27, 30, 1); /* EERIE BLACK */
    }

    body {
        background: var(--color4) !important;
        background-color: var(--color4) !important;
    }

    .container {
        background: var(--color1) !important;
    }

    #leftcolumn {
        color:  var(--color3);
    }

    .informationbar {
        background-color: var(--color2) !important;
        opacity: 0.8;
    }
    .informationbar .logo {
        width:150px;
    }

    .columnheader {
        background-color: var(--color2) !important;
    }
    table.nationtable th {
        background-color: var(--color2) !important;
    }

    .header-space{
      padding-top:40px;
    }
  ` );
  }

})();