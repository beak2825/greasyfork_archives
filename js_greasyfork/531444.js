// ==UserScript==
// @name         Tampermonkey Hide Header
// @namespace    https://bowhip.org | https://gist.github.com/qp5
// @version      1.0
// @description  New! 2025 Reduces TamperMonkey header so there is more script Editor work space. 
// @match        chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531444/Tampermonkey%20Hide%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/531444/Tampermonkey%20Hide%20Header.meta.js
// ==/UserScript==


// This script reduces Tampermonkey header so there is more space to edit scripts. Hides the large top header.
//KW: increase height of editor, improve scripting interface, UI style, editor veiw, editor layout height, editor size,

// jAdkins - bowHip.org/foster ||  github.com/qp5/


/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
STEPS 一 Hide Tampermonkey script editor header:

  1 ● Open Tampermonkey "Dashboard"
  2 ● Select ⚙️Settings tab (top-right)
  3 ● Then change: Config Mode → "Advanced"
  4 ● Appearance  Layout: Custom CSS:
  5 ● Finally: Paste the CSS below into the Custom CSS:
        ● Note: Select "Save" under the CSS textbox 一 that's it!


//  Copy past this CSS code:

// ■ Hides Header
.head_container {
  display: none !important;
}
.tv_container_fit {
  top: 0 !important;
}

.tab_container {
  display: none !important;
}


// ■ Hides Title Header

.head_logo {
  display: none !important;
}

.script_tab_head {
  display: none !important;
}

*/
