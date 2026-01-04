// ==UserScript==
// @name         Google Docs Strikethrough Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Now it just displays the button. I couldn't get it to work :((
// @author       FiZ
// @match        https://docs.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429786/Google%20Docs%20Strikethrough%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/429786/Google%20Docs%20Strikethrough%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

var x = document.getElementById('underlineButton');

    x.outerHTML += '<div id="strikethroughButton" onclick="highlightSelection1()" class="goog-toolbar-toggle-button goog-toolbar-button goog-inline-block" role="button" aria-disabled="false" aria-pressed="false" style="user-select: none;" '+
'data-tooltip="Зачеркнутый (Alt+Shift+5)" aria-label="Зачеркнутый (Alt+Shift+5)"><div class="goog-toolbar-button-outer-box goog-inline-block" aria-hidden="true" style="user-select: none;">'+
'<div class="goog-toolbar-button-inner-box goog-inline-block" style="user-select: none;"><div class="docs-icon goog-inline-block " style="user-select: none;">'+
'<div class="docs-icon-img-container docs-icon-img docs-icon-strikethrough" aria-hidden="true" style="user-select: none;">&nbsp;</div></div></div></div></div>';


})();

/*
<div id="underlineButton" class="goog-toolbar-toggle-button goog-toolbar-button goog-inline-block" role="button" aria-disabled="false" aria-pressed="false" style="user-select: none;" aria-hidden="false" data-tooltip="Подчеркнутый (Ctrl+U)"
aria-label="Подчеркнутый (Ctrl+U)"><div class="goog-toolbar-button-outer-box goog-inline-block" aria-hidden="true" style="user-select: none;"><div class="goog-toolbar-button-inner-box goog-inline-block" style="user-select: none;">
<div class="docs-icon goog-inline-block " style="user-select: none;"><div class="docs-icon-img-container docs-icon-img docs-icon-underline" aria-hidden="true" style="user-select: none;">&nbsp;</div></div></div></div></div>
*/


/*
<div id="t-strikethrough" class="goog-toolbar-toggle-button goog-toolbar-button goog-inline-block" role="button" aria-disabled="false" aria-pressed="false" style="user-select: none;"
data-tooltip="Зачеркнутый (Alt+Shift+5)" aria-label="Зачеркнутый (Alt+Shift+5)"><div class="goog-toolbar-button-outer-box goog-inline-block" aria-hidden="true" style="user-select: none;">
<div class="goog-toolbar-button-inner-box goog-inline-block" style="user-select: none;"><div class="docs-icon goog-inline-block " style="user-select: none;">
<div class="docs-icon-img-container docs-icon-img docs-icon-strikethrough" aria-hidden="true" style="user-select: none;">&nbsp;</div></div></div></div></div>
*/

//google docs menu strikeout menu item
/*
e737h9:18g
<div class="goog-menuitem apps-menuitem" role="menuitem" id="g2l0lo:18u" style="user-select: none;"><div class="goog-menuitem-content" style="user-select: none;">
<div class="docs-icon goog-inline-block goog-menuitem-icon" aria-hidden="true" style="user-select: none;">
<div class="docs-icon-img-container docs-icon-img docs-icon-strikethrough" style="user-select: none;"></div></div>
<span aria-label="Зачеркнутый k" class="goog-menuitem-label" style="user-select: none;">Зачеркнутый<span class="goog-menuitem-mnemonic-separator" style="user-select: none;">(
<span class="goog-menuitem-mnemonic-hint" style="user-select: none;">K</span>)</span></span><span class="goog-menuitem-accel" aria-label="Alt+Shift+5" style="user-select: none;">Alt+Shift+5</span></div></div>
*/

/*
My(e, Hy(a(hva).label("\u0417\u0430\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044b\u0439").Ea(103).key(qq ? "Ctrl+Shift+X" : "Alt+Shift+5"),
"strikethrough").yb("\u0437\u0430\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044b\u0439 | \u0437\u0430\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044c |
\u043f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u0447\u0435\u0440\u043a\u0438\u0432\u0430\u043d\u0438\u0435 ||").category(KRa).ea());

My(e, Hy(a(gh).label("\u041f\u043e\u0434\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044b\u0439").Ea(112).key("Ctrl+U"), SOa).category(KRa).ea());

//v2d= "underlineButton";
//jW(b, v2d, e.na(gh), f, m);
//jW(b, "strikethroughButton", e.na(gh), f, m);
//jW(b, "strikethroughButton", e.na(hva), f, m);
//jW(b, "italicButton", e.na(fg), f, m);
*/

/*
    d = e.bO,
    e = a.dispatchEvent(new Zfd(Al,d,b.O)),
    (e &= a.dispatchEvent(new Zfd(VLa + d,d,b.O))) || (0,
    b.F)(),
    nq && (a.W = c)))))
*/

// google apps highlight
/*
function highlightSelection(color) {
  const doc = DocumentApp.getActiveDocument();
  const range = doc.getSelection();
  if (range) {
    const rangeElements = range.getRangeElements();
    rangeElements.forEach(function (rangeElement) {
      if (rangeElement.isPartial()) {
        rangeElement.getElement().asText().setBackgroundColor(
          rangeElement.getStartOffset(),
          rangeElement.getEndOffsetInclusive(),
          color
        );
      } else {
        rangeElement.getElement().asText().setBackgroundColor(color);
      }
    });
  } else {
    showRequireSelectionError();
  }
}

  function highlightSelection1() {
//    const RGBcolor = "#3366CC";//$(this).css('backgroundColor');
    const hexColor = "#3366CC";//rgb2hex(RGBcolor);
    //google.script.run.withFailureHandler(highlightFailure).highlightSelection(hexColor);
      highlightSelection(hexColor);
  }
    highlightSelection("#3366CC");

//  $('#underlineButton').on('click', highlightSelection);
//  $('#strikethroughButton').on('click', highlightSelection);

*/